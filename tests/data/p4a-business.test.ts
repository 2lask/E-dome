import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

import {
  AFFILIATION_RATES,
  EDOME_PRIME_SHARE,
  FREE_LIMITS,
  FREEMIUM_ROLES,
  PLANS,
  PRIME_DISPUTE,
  ROLE_PLANS,
  applicationQuota,
  clampAffiliationRate,
  defaultAffiliationRate,
  lowestPlanWith,
  planIncludes,
  primeEligibility,
  quote,
  primeChf,
} from "@/lib/pricing";
import {
  affiliableOffers,
  affiliationBreakdown,
  apporteurBook,
  canIntroduce,
  chfLabel,
  currentPlanId,
  introductions,
  offerNetCents,
  primeBreakdown,
  primeListings,
  sellerPrimeBook,
} from "@/lib/demo/affiliation";
import { emptySession, recordEvent, type SessionState } from "@/lib/demo/session-store";
import { notificationsFor } from "@/lib/demo/session-views";
import { FEATURE_LABEL, FREEMIUM_COPY, PLAN_META } from "@/content/tarifs";
import { SECTIONS } from "@/content/conditions";

/* ── Chantier P4a — le modèle économique visible ──────────────────────────── */

const LEO = "user-001";
const YVES = "user-012";
const HELENE = "user-014";

function act(state: SessionState, actor: string, input: Parameters<typeof recordEvent>[2]) {
  return recordEvent(state, actor, input);
}

test("P4a.1 — une prime biens ne s'exprime jamais en % : montant CHF borné, aucun pourcentage du prix", () => {
  /* Le type n'accepte qu'un PrimeMoney, fabriqué par primeChf() dans 50–3 000. */
  assert.throws(() => primeChf(49));
  assert.throws(() => primeChf(3001));
  /* 1 % d'un bien à 1 M CHF lève : une prime indexée sur le prix ne passe pas. */
  assert.throws(() => primeChf(1_000_000 * 0.01));
  /* Les libellés de prime affichés à l'apporteur sont des CHF, jamais un « % ». */
  const book = apporteurBook(emptySession(), LEO);
  for (const l of book.lines.filter((x) => x.mechanic === "bien")) {
    assert.doesNotMatch(l.detail, /%/, `prime exprimée en % : ${l.detail}`);
  }
  for (const p of primeListings(emptySession())) {
    assert.ok(Number.isInteger(p.setting.amountChf), "prime en francs entiers");
    assert.ok(p.setting.amountChf >= 50 && p.setting.amountChf <= 3000);
  }
  /* Le composant d'activation ne lit jamais le prix du bien. */
  const src = readFileSync("src/components/business/prime-activation.tsx", "utf8");
  assert.doesNotMatch(src, /property|\.price\b|form\.prix/);
});

test("P4a.2 — net apporteur = prime − 12 % (part E-Dome à l'intérieur, frais absorbés)", () => {
  for (const amount of [50, 100, 200, 600, 1500, 3000]) {
    const b = primeBreakdown(amount);
    const edome = Math.max(Math.round(amount * 100 * EDOME_PRIME_SHARE), 300);
    assert.equal(b.edomeShareCents, edome, `part E-Dome sur ${amount}`);
    assert.equal(b.apporteurCents, amount * 100 - edome, `net apporteur sur ${amount}`);
    assert.equal(b.sellerPaysCents, amount * 100, "le vendeur paie la prime, rien de plus");
    assert.equal(b.edomeNetCents, edome - b.pspCents, "E-Dome absorbe les frais sur sa part");
  }
  /* L'exemple du rapport : prime 200 → apporteur 176, E-Dome 24, frais 6.60, net E-Dome 17.40. */
  const b = primeBreakdown(200);
  assert.deepEqual([b.apporteurCents, b.edomeShareCents, b.pspCents, b.edomeNetCents], [17600, 2400, 660, 1740]);
});

test("P4a.3 — marketplace : affilié sur la marge, commission E-Dome inchangée, taux borné et pré-rempli", () => {
  for (const pole of Object.keys(AFFILIATION_RATES) as (keyof typeof AFFILIATION_RATES)[]) {
    const r = AFFILIATION_RATES[pole]!;
    const d = defaultAffiliationRate(pole);
    assert.ok(d >= r.min && d <= r.max, `${pole} : défaut dans la fourchette`);
    assert.ok(d > r.min, `${pole} : pré-rempli au-dessus du plancher`);
    assert.equal(clampAffiliationRate(pole, 0.99), r.max);
    assert.equal(clampAffiliationRate(pole, 0), r.min);
  }
  const b = affiliationBreakdown("formation", 400, 0.35);
  const plain = quote({ kind: "commission", pole: "formation", gross: { cents: 40000, currency: "CHF" } });
  assert.equal(b.affiliateCents, 14000);
  assert.equal(b.edomeCents, plain.flow.edomeGross.cents, "commission E-Dome non diluée");
  assert.equal(b.sellerKeepsWithoutCents - b.sellerKeepsCents, b.affiliateCents, "l'affilié sort de la marge du vendeur");
  /* Toute offre de l'onglet Marketplace se résout en un net CHF positif. */
  for (const o of affiliableOffers(emptySession())) assert.ok(offerNetCents(o) > 0, o.id);
});

test("P4a.4 — plafonds freemium lus du catalogue (aucune valeur en dur à l'affichage)", () => {
  for (const role of FREEMIUM_ROLES) {
    assert.ok(FREE_LIMITS[role], role);
    assert.ok(ROLE_PLANS[role], role);
    assert.ok(FREEMIUM_COPY[role].free.length > 0, role);
  }
  assert.equal(FREE_LIMITS.agence.activeListings, 10);
  assert.ok(FREEMIUM_COPY.agence.free.join(" ").includes(String(FREE_LIMITS.agence.activeListings)));
  assert.ok(FEATURE_LABEL["biens-plafond"]!.includes(String(FREE_LIMITS.agence.activeListings)));
  assert.ok(FEATURE_LABEL["candidatures-quota"]!.includes(String(FREE_LIMITS.agence.activeApplications)));
  /* Quota : gratuit plafonné sur Présence, illimité dès qu'une formule inclut l'accompagnement. */
  assert.equal(applicationQuota("presence"), FREE_LIMITS.agence.activeApplications);
  assert.equal(applicationQuota("vitrine"), null);
  /* Fonctions de réussite : équipe, mandats, stats complètes → Mandats. */
  for (const f of ["equipe-droits", "mandats", "statistiques-completes"]) {
    assert.equal(planIncludes("vitrine", f), false, f);
    assert.equal(lowestPlanWith(f)?.id, "mandats", f);
  }
  /* Rôles sans formule chiffrée : Pro « Ensuite », aucun prix inventé dans PLANS. */
  for (const role of ["prestataire", "createur", "hote"] as const) {
    assert.equal(ROLE_PLANS[role].proLater, true);
    assert.equal(ROLE_PLANS[role].planIds.length, 0);
  }
  assert.ok(PLANS.every((p) => PLAN_META[p.id]), "toute formule a un nom");
  /* Aucune page /tarifs n'écrit un plafond en dur. */
  const page = readFileSync("src/app/(app)/tarifs/page.tsx", "utf8");
  assert.doesNotMatch(page, /\b10 biens\b/);
});

test("P4a.5 — restriction France : Hélène ne touche jamais de prime biens, et on dit pourquoi", () => {
  const e = primeEligibility("France");
  assert.equal(e.eligible, false);
  assert.match(e.reason, /loi Hoguet/);
  assert.equal(primeEligibility("Suisse").eligible, true);
  const s = emptySession();
  const book = apporteurBook(s, HELENE);
  assert.equal(book.eligibility.eligible, false);
  assert.equal(book.totals.bien, 0);
  assert.ok(book.totals.marketplace > 0, "la marketplace lui reste ouverte");
  const guard = canIntroduce(s, HELENE, "prop28");
  assert.equal(guard.ok, false);
  assert.equal(!guard.ok && guard.reason, "country");
  /* La fiche publique et l'espace apporteur portent la mention. */
  assert.match(readFileSync("src/app/(app)/profil/[id]/page.tsx", "utf8"), /PrimeCountryNotice/);
  assert.match(readFileSync("src/components/business/apporteur-summary.tsx", "utf8"), /Affiliation biens indisponible/);
});

test("P4a.6 — suivi des deux côtés : l'apporteur amène, le vendeur accepte, chacun le voit", () => {
  let s = emptySession();
  const before = apporteurBook(s, YVES).totals.bien;
  ({ state: s } = act(s, YVES, { kind: "introduction.made", data: { propertyId: "prop13", sellerId: "user-002", contactLabel: "Test", primeChf: 500 } }));
  const intro = introductions(s).at(-1)!;
  assert.equal(intro.status, "pending");
  assert.ok(notificationsFor(s, "user-002").some((n) => n.title.includes("vous propose un contact")));
  ({ state: s } = act(s, "user-002", {
    kind: "introduction.answered",
    data: { introductionId: intro.id, apporteurId: YVES, propertyId: "prop13", decision: "accepted" },
  }));
  assert.equal(apporteurBook(s, YVES).totals.bien - before, primeBreakdown(500).apporteurCents);
  assert.ok(sellerPrimeBook(s, "user-002").paidCents >= 50000);
  /* Refuser est gratuit ; contester sous 48 h rembourse (plafonné). */
  const leoBefore = sellerPrimeBook(s, LEO);
  const disputable = introductions(s).find((i) => i.id === "intro-07")!;
  ({ state: s } = act(s, LEO, { kind: "introduction.disputed", data: { introductionId: disputable.id, apporteurId: YVES, reason: "x" } }));
  const after = sellerPrimeBook(s, LEO);
  assert.equal(introductions(s).find((i) => i.id === "intro-07")!.status, "refunded");
  assert.equal(leoBefore.paidCents - after.paidCents, 20000);
  assert.equal(after.refundsLeftThisMonth, PRIME_DISPUTE.maxRefundsPerMonth - 1);
});

test("P4a.7 — une seule source : le même carnet pour /apporteurs et /dashboard/apporteurs, plus de 770 / 1 034 / 9 500", () => {
  const book = apporteurBook(emptySession(), LEO);
  assert.equal(book.totals.total, book.totals.bien + book.totals.marketplace + book.totals.abonnement);
  const a = readFileSync("src/app/(app)/apporteurs/page.tsx", "utf8");
  const d = readFileSync("src/app/(app)/dashboard/apporteurs/page.tsx", "utf8");
  for (const src of [a, d]) {
    assert.match(src, /useApporteurBook/);
    assert.doesNotMatch(src, /LEADERBOARD|leaderboard|MOCK_APPORTS|9500|1034/);
  }
  assert.doesNotMatch(readFileSync("src/lib/referral-links.ts", "utf8"), /earned: [1-9]/);
});

test("P4a.8 — changer de formule fonctionne, et l'ancien « apporteur 10–30 % » a disparu des textes", () => {
  let s = emptySession();
  assert.equal(currentPlanId(s, "hartmann-immobilier", "vitrine"), "vitrine");
  ({ state: s } = act(s, "user-015", { kind: "plan.changed", data: { holderId: "hartmann-immobilier", planId: "mandats" } }));
  assert.equal(currentPlanId(s, "hartmann-immobilier", "vitrine"), "mandats");
  const OLD = /10\s*(?:–|-|à|et)\s*30\s*%/;
  for (const f of [
    "src/content/conditions.ts",
    "src/content/explain.ts",
    "src/content/tarifs.ts",
    "src/content/demo.ts",
    "src/app/(app)/aide/page.tsx",
    "src/app/(app)/apporteurs/page.tsx",
    "src/app/(app)/publier/page.tsx",
  ]) {
    assert.doesNotMatch(readFileSync(f, "utf8"), OLD, f);
  }
  const cgu = SECTIONS.find((x) => x.id === "apporteurs")!.content;
  assert.match(cgu, /BIENS/);
  assert.match(cgu, /MARKETPLACE/);
  assert.match(cgu, /ABONNEMENTS/);
  assert.equal(chfLabel(145770), "1'457.70 CHF");
});
