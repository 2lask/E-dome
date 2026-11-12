import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

import "@/lib/demo/invariants";
import { personById } from "@/lib/demo/directory";
import { formations, mockReviews } from "@/lib/mock-data";
import { emptySession, recordEvent, type SessionEventInput, type SessionState } from "@/lib/demo/session-store";
import { threadsFor, notificationsFor, sessionAvisOf } from "@/lib/demo/session-views";
import {
  SERVICES,
  allServices,
  findService,
  ratingSummary,
  serviceDealOf,
  servicePaymentQuote,
  serviceReviews,
  simulatedQuote,
} from "@/lib/demo/services-catalog";
import {
  canHaveCertificate,
  enrolmentQuote,
  flatLessons,
  formationProgress,
  progressPercent,
} from "@/lib/demo/lessons";
import type { Quote } from "@/lib/pricing";

/* ── P6a — Pôles Services et Formations complets et cohérents ───────────────

   Chaque service et chaque formation a une vraie personne derrière lui ;
   chaque formation a ses propres leçons ; la progression se dérive des leçons
   cochées (0 → 0 %, toutes → 100 %, certificat seulement à 100 %) ; chaque
   paiement passe par `quote()` et tombe juste. */

function play(state: SessionState, actorId: string, inputs: SessionEventInput[]): SessionState {
  let s = state;
  for (const i of inputs) s = recordEvent(s, actorId, i).state;
  return s;
}

function assertBalanced(q: Quote, label: string) {
  const f = q.flow;
  const parts =
    f.beneficiary.cents + f.edomeGross.cents + f.affiliate.cents + (f.pspBornBy === "seller" ? f.psp.cents : 0);
  assert.equal(parts, f.gross.cents, `${label} : ${parts} réparti pour ${f.gross.cents}`);
  assert.equal(q.payerTotal.cents, f.gross.cents, `${label} : le payeur paie le brut`);
  assert.ok(f.edomeGross.cents > 0, `${label} : E-Dome touche sa commission`);
  assert.ok(f.beneficiary.cents > 0, `${label} : le bénéficiaire reçoit quelque chose`);
}

test("P6a-1 — chaque service a un prestataire à l'annuaire, des lignes de devis et des avis réels", () => {
  assert.ok(SERVICES.length >= 3);
  const ids = new Set<string>();
  for (const s of SERVICES) {
    assert.ok(!ids.has(s.id), `id de service en double : ${s.id}`);
    ids.add(s.id);
    assert.ok(personById(s.providerId), `${s.id} : prestataire ${s.providerId} absent de l'annuaire`);
    assert.ok(s.quoteLines.length > 0 && s.quoteLines.every((l) => l.label.trim() && l.amountChf > 0), `${s.id} : devis type vide`);
    assert.ok(s.title.trim() && s.description.trim(), `${s.id} : texte vide`);
    // Note dérivée : uniquement des avis REÇUS par le prestataire sur une prestation de ce service.
    for (const r of serviceReviews(emptySession(), s)) {
      const src = mockReviews.find((m) => m.id === r.id);
      assert.ok(src && src.recipientId === s.providerId, `${s.id} : avis ${r.id} non reçu par le prestataire`);
    }
  }
  // Les ids repris ailleurs (affiliation, tableau de bord) existent toujours.
  for (const legacy of ["s3", "s4", "s10"]) assert.ok(ids.has(legacy), `service ${legacy} disparu`);
  // Sans avis : « Nouveau » (null), jamais 0.
  assert.equal(ratingSummary([]), null);
  const s14 = findService(emptySession(), "s14")!;
  assert.equal(ratingSummary(serviceReviews(emptySession(), s14)), null);
  const s3 = findService(emptySession(), "s3")!;
  const sum = ratingSummary(serviceReviews(emptySession(), s3));
  assert.ok(sum && sum.count === 3, "s3 porte les trois avis reçus par Nikola sur ses reportages");
});

test("P6a-2 — aucun texte des pôles ne dit « courtier » ni ne garde de lien externe factice", () => {
  const files = [
    "src/lib/demo/services-catalog.ts",
    "src/content/services.ts",
    "src/content/formations.ts",
    "src/app/(app)/services/page.tsx",
    "src/app/(app)/services/[id]/page.tsx",
    "src/app/(app)/formations/[id]/page.tsx",
    "src/app/(app)/formations/[id]/lecon/[n]/page.tsx",
    "src/app/(app)/formations/[id]/certificat/page.tsx",
  ];
  for (const f of files) {
    const src = readFileSync(f, "utf8");
    assert.ok(!/courti[eè]re?/i.test(src), `${f} : « courtier »`);
    assert.ok(!/youtube\.com|cal\.com/i.test(src), `${f} : lien externe factice`);
    assert.ok(!/Date\.now\(\)|Math\.random\(\)|toLocaleDateString/.test(src), `${f} : rendu non déterministe`);
  }
});

test("P6a-3 — parcours devis → paiement → avis, dérivé du journal", () => {
  const client = "user-006";
  const s3 = findService(emptySession(), "s3")!;
  let st = recordEvent(emptySession(), client, {
    kind: "quote.sent",
    data: { toId: s3.providerId, serviceId: s3.id, subject: s3.title, providerName: s3.provider, text: "Photos 3,5 p. Budget : 600 CHF." },
  }).state;
  assert.equal(serviceDealOf(st, client, s3.id).stage, "none", "pas de devis tant que le prestataire n'a pas répondu");
  const quoted = simulatedQuote(s3, st.events[0]!.id);
  assert.equal(quoted.totalChf, quoted.lines.reduce((a, l) => a + l.amountChf, 0));
  st = recordEvent(st, client, { kind: "service.quoted", data: quoted }).state;
  const deal = serviceDealOf(st, client, s3.id);
  assert.equal(deal.stage, "quoted");
  const ids = { serviceId: s3.id, providerId: s3.providerId, quotedId: deal.quotedId! };

  // Le devis arrive dans le fil du client, au nom du prestataire.
  const thread = threadsFor(st, client).find((t) => t.otherIds.includes(s3.providerId));
  assert.ok(thread && thread.messages.some((m) => m.senderId === s3.providerId), "devis du prestataire dans le fil");
  assert.ok(notificationsFor(st, client).some((n) => n.title.startsWith("Devis reçu")));
  assert.ok(notificationsFor(st, s3.providerId).some((n) => n.title.startsWith("Demande de devis")));

  st = play(st, client, [
    { kind: "service.quote.accepted", data: { ...ids, totalChf: quoted.totalChf } },
    { kind: "service.paid", data: { ...ids, totalChf: quoted.totalChf } },
  ]);
  assert.equal(serviceDealOf(st, client, s3.id).stage, "paid");
  st = play(st, client, [{ kind: "service.completed", data: ids }]);
  assert.equal(serviceDealOf(st, client, s3.id).stage, "completed");
  st = play(st, client, [{ kind: "service.reviewed", data: { ...ids, rating: 4, comment: "Très bien, merci." } }]);
  assert.equal(serviceDealOf(st, client, s3.id).stage, "reviewed");

  // L'avis s'affiche sur le service et sur le profil du prestataire.
  const after = serviceReviews(st, s3);
  assert.equal(after[0]!.authorId, client);
  assert.equal(ratingSummary(after)!.count, 4);
  assert.equal(sessionAvisOf(st, s3.providerId).length, 1);
  // Un autre acteur ne voit pas la demande d'Ana comme la sienne.
  assert.equal(serviceDealOf(st, "user-008", s3.id).stage, "none");
});

test("P6a-4 — chaque paiement passe par quote() et tombe juste", () => {
  for (const s of allServices(emptySession())) {
    const total = s.quoteLines.reduce((a, l) => a + l.amountChf, 0);
    assertBalanced(servicePaymentQuote(total), `service ${s.id}`);
  }
  for (const f of formations) assertBalanced(enrolmentQuote(f.price), `formation ${f.id}`);
});

test("P6a-5 — chaque formation a un auteur à l'annuaire et au moins trois leçons titrées", () => {
  for (const f of formations) {
    assert.ok(personById(f.instructor.id), `${f.id} : auteur absent de l'annuaire`);
    const lessons = flatLessons(f);
    assert.ok(lessons.length >= 3, `${f.id} : ${lessons.length} leçon(s)`);
    assert.ok(lessons.every((l) => l.title.trim().length > 0), `${f.id} : leçon sans titre`);
    assert.deepEqual(lessons.map((l) => l.n), lessons.map((_, i) => i + 1), `${f.id} : numérotation`);
    assert.equal(new Set(lessons.map((l) => l.id)).size, lessons.length, `${f.id} : leçons en double`);
  }
  // Chaque formation a SES leçons : aucun titre de leçon partagé entre deux formations.
  const seen = new Map<string, string>();
  for (const f of formations) {
    for (const l of flatLessons(f)) {
      assert.ok(!seen.has(l.title) || seen.get(l.title) === f.id, `« ${l.title} » dans ${seen.get(l.title)} et ${f.id}`);
      seen.set(l.title, f.id);
    }
  }
});

test("P6a-6 — progression dérivée : 0 → 0 %, toutes → 100 %, certificat seulement à 100 %", () => {
  assert.equal(progressPercent(0, 10), 0);
  assert.equal(progressPercent(10, 10), 100);
  assert.equal(progressPercent(9, 10), 90);
  assert.equal(progressPercent(199, 200), 99, "jamais 100 % avant la dernière leçon");
  assert.equal(progressPercent(0, 0), 0);

  const actor = "user-006"; // Ana : aucune inscription d'amorce
  const f = formations.find((x) => x.id === "form-002")!;
  const lessons = flatLessons(f);
  let st = emptySession();
  let p = formationProgress(st, actor, f);
  assert.equal(p.enrolled, false);
  assert.equal(p.percent, 0);
  assert.equal(p.certificate, false);

  // Cocher sans être inscrite ne compte pas.
  st = play(st, actor, [{ kind: "lesson.marked", data: { formationId: f.id, lessonId: lessons[0]!.id, done: true } }]);
  assert.equal(formationProgress(st, actor, f).percent, 0);

  st = play(st, actor, [{ kind: "formation.enrolled", data: { formationId: f.id, authorId: f.instructor.id, priceChf: f.price } }]);
  p = formationProgress(st, actor, f);
  assert.equal(p.enrolled, true);
  assert.equal(p.doneCount, 1);

  st = play(
    st,
    actor,
    lessons.slice(1, -1).map((l) => ({ kind: "lesson.marked" as const, data: { formationId: f.id, lessonId: l.id, done: true } })),
  );
  p = formationProgress(st, actor, f);
  assert.equal(p.doneCount, lessons.length - 1);
  assert.ok(p.percent < 100);
  assert.equal(p.certificate, false);

  st = play(st, actor, [{ kind: "lesson.marked", data: { formationId: f.id, lessonId: lessons.at(-1)!.id, done: true } }]);
  p = formationProgress(st, actor, f);
  assert.equal(p.percent, 100);
  assert.equal(p.certificate, true);

  // Rouvrir une leçon retire le certificat.
  st = play(st, actor, [{ kind: "lesson.marked", data: { formationId: f.id, lessonId: lessons[0]!.id, done: false } }]);
  assert.equal(formationProgress(st, actor, f).certificate, false);

  assert.equal(canHaveCertificate(false, 100), false);
  assert.equal(canHaveCertificate(true, 99), false);

  // L'auteure ne s'inscrit pas à sa propre formation.
  assert.equal(formationProgress(emptySession(), f.instructor.id, f).isAuthor, true);
  assert.equal(formationProgress(emptySession(), f.instructor.id, f).enrolled, false);
  // Amorce : Léo a évalué la formation de Sandrine → inscrit, terminée.
  const fisc = formations.find((x) => x.id === "form-007")!;
  const leo = formationProgress(emptySession(), "user-001", fisc);
  assert.equal(leo.enrolled, true);
  assert.equal(leo.percent, 100);
});
