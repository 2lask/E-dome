import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import "@/lib/demo/invariants";
import { DIRECTORY_IDS, PLATFORM_ACCOUNT_ID, personById } from "@/lib/demo/directory";
import { DEMO_TODAY, iso } from "@/lib/demo/clock";
import { EVENTS, isPastEvent, sessionEvents } from "@/lib/data/events";
import { UPCOMING_LIVES } from "@/lib/data/lives";
import { REPLAYS } from "@/lib/replays";
import { emptySession, recordEvent, eventIdOf } from "@/lib/demo/session-store";
import { notificationsFor } from "@/lib/demo/session-views";
import { agendaIds, registeredIds, registrationFlow, sessionRegistrationCount, canHost } from "@/lib/demo/agenda";
import { ADMIN_REPORTS, AGENCY_ACCOUNT_ID, adminAccounts, adminProperties, platformVolume } from "@/lib/demo/admin-data";
import { LEDGER } from "@/lib/demo/ledger";
import { apporteurBook } from "@/lib/demo/affiliation";
import { apporteurTile, upcomingEvents, boutiqueAlerts } from "@/lib/dashboard-data";
import { properties as CATALOGUE } from "@/lib/mock-data";
import { requirePerson } from "@/lib/demo/directory";

/* ── P6c — Événements & lives, console d'administration, apporteurs ─────────

   Verrous du chantier P6c :
   1. chaque événement, live et replay a un organisateur À L'ANNUAIRE, et des
      dates cohérentes avec `DEMO_TODAY` (passés marqués, à venir réservables) ;
   2. s'inscrire laisse une trace de session, notifie l'organisateur, et un
      billet payant a un flux d'argent (`quote()`) ;
   3. la console d'administration ne liste que l'annuaire (+ l'agence) ;
   4. la tuile Apporteurs du tableau de bord et `/dashboard/apporteurs` lisent
      la même source, par personne ; Hélène (France) n'a aucune prime bien ;
   5. plus de « Marie Dupont », de lien cal.com/zoom dans ces pôles, de
      « Vendre un produit » ni de « commission marketplace ». */

const TODAY = iso(DEMO_TODAY);
const DIR = new Set(DIRECTORY_IDS);

/** Le texte exécutable/rendu d'un fichier : commentaires retirés. */
function code(file: string): string {
  return readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
}

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(p.replace(/\\/g, "/"));
  }
  return out;
}

const SRC = walk("src");
/* Pages juridiques et landing : hors périmètre (textes contractuels). */
const LEGAL_OR_LANDING = /^src\/(app\/page\.tsx|content\/landing\.ts|lib\/leads\/|app\/\(app\)\/admin\/leads\/|app\/[^/]*\/?(merci|confidentialite|cgu|cgv|mentions|conditions)[^/]*\/)/;

const P6C_FILES = [
  ...walk("src/app/(app)/evenements"),
  ...walk("src/app/(app)/live"),
  ...walk("src/app/(app)/reunion"),
  ...walk("src/app/(app)/admin").filter((f) => !f.includes("/admin/leads/")),
  "src/app/(app)/dashboard/apporteurs/page.tsx",
  "src/app/(app)/dashboard/page.tsx",
  "src/lib/data/events.ts",
  "src/lib/data/lives.ts",
  "src/lib/replays.ts",
  "src/lib/dashboard-data.ts",
];

test("P6c-1 — chaque événement, live et replay a un organisateur à l'annuaire", () => {
  for (const e of EVENTS) {
    assert.ok(DIR.has(e.organizerId), `événement ${e.id} : organisateur ${e.organizerId} hors annuaire`);
    const p = requirePerson(e.organizerId);
    assert.equal(e.intervenant, `${p.firstName} ${p.lastName}`, `événement ${e.id} : nom saisi à la main`);
  }
  for (const l of UPCOMING_LIVES) assert.ok(DIR.has(l.organizerId), `live ${l.id} : ${l.organizerId}`);
  for (const r of REPLAYS) assert.ok(DIR.has(r.speakerId), `replay ${r.id} : ${r.speakerId}`);
  assert.ok(!EVENTS.some((e) => /plusieurs experts|e-dome events/i.test(e.intervenant)));
});

test("P6c-2 — dates cohérentes avec DEMO_TODAY : passés marqués, à venir réservables", () => {
  const past = EVENTS.filter(isPastEvent);
  const upcoming = EVENTS.filter((e) => !isPastEvent(e));
  assert.ok(past.length >= 1, "au moins un événement passé");
  assert.ok(upcoming.length >= 3, "des événements à venir");
  for (const e of past) assert.ok(e.date < TODAY, `${e.id} marqué passé à tort`);
  for (const e of upcoming) {
    assert.ok(e.date >= TODAY, `${e.id} à venir mais daté ${e.date}`);
    assert.ok(e.spotsRemaining > 0, `${e.id} à venir mais complet : non réservable`);
    assert.ok(e.spots < 1000, `${e.id} : jauge de ${e.spots}, pas un réseau qui se lance`);
  }
  for (const l of UPCOMING_LIVES) {
    assert.ok(l.date >= TODAY, `live ${l.id} daté ${l.date}, avant DEMO_TODAY`);
    assert.ok(l.inscrits < 100, `live ${l.id} : ${l.inscrits} inscrits`);
  }
  for (const r of REPLAYS) assert.ok(r.vues < 1000, `replay ${r.id} : ${r.vues} vues`);
  // Le carrousel du feed ne met plus en avant un événement passé.
  // Le tableau de bord de Léo ne montre que ses rendez-vous à venir, dérivés.
  for (const u of upcomingEvents) assert.ok(u.daysUntil >= 0, `rendez-vous ${u.id} passé`);
  assert.ok(upcomingEvents.length >= 1);
});

test("P6c-3 — s'inscrire laisse une trace, notifie l'organisateur, et un billet payant a un flux", () => {
  const paid = EVENTS.find((e) => !isPastEvent(e) && e.prix > 0)!;
  let s = emptySession();
  s = recordEvent(s, "user-008", {
    kind: "event.registered",
    data: { eventId: paid.id, target: "evenement", title: paid.titre, organizerId: paid.organizerId, date: paid.date, priceChf: paid.prix },
  }).state;
  assert.ok(registeredIds(s, "user-008").has(paid.id));
  assert.equal(sessionRegistrationCount(s, paid.id), 1);
  const orgNotes = notificationsFor(s, paid.organizerId).filter((n) => n.fromSession);
  assert.equal(orgNotes.length, 1, "l'organisateur est notifié");
  assert.match(orgNotes[0]!.title, /Clémence Jaquet/);
  assert.ok(notificationsFor(s, "user-008").some((n) => n.fromSession && n.title === "Inscription confirmée"));

  const flow = registrationFlow("evenement", paid.prix)!;
  assert.ok(flow, "flux d'argent pour un billet payant");
  assert.equal(flow.gross.cents, paid.prix * 100);
  assert.ok(flow.beneficiary.cents > 0 && flow.beneficiary.cents < flow.gross.cents);
  assert.equal(registrationFlow("evenement", 0), null, "gratuit : rien ne circule");
  assert.ok(registrationFlow("live", 25));

  // Désinscription : la trace s'efface, l'organisateur est prévenu.
  s = recordEvent(s, "user-008", { kind: "event.unregistered", data: { eventId: paid.id, target: "evenement", title: paid.titre, organizerId: paid.organizerId } }).state;
  assert.ok(!registeredIds(s, "user-008").has(paid.id));
  assert.equal(sessionRegistrationCount(s, paid.id), 0);

  // « Ajouter à mon agenda » : une trace en session, pas un lien externe.
  s = recordEvent(s, "user-006", { kind: "agenda.added", data: { eventId: "L1", target: "live", title: "x", organizerId: "user-016", date: "2026-10-08" } }).state;
  assert.ok(agendaIds(s, "user-006").has("L1"));

  // Un événement créé depuis /evenements/creer a pour organisateur l'acteur.
  const pub = recordEvent(s, "user-010", {
    kind: "event.published",
    data: { titre: "Atelier test", type: "Atelier", date: "2026-11-20", heure: "14:00", duree: "2h", lieu: "Vevey", description: "d", image: "", places: 10, prix: 0 },
  });
  const created = sessionEvents(pub.state)[0]!;
  assert.equal(created.id, eventIdOf(pub.event.seq));
  assert.equal(created.organizerId, "user-010");
});

test("P6c-4 — hôte ou spectateur selon la personne incarnée", () => {
  assert.ok(canHost(requirePerson("user-001").roles), "Léo (créateur) peut animer");
  assert.ok(!canHost(requirePerson("user-006").roles), "Ana (particulière) regarde");
  assert.ok(UPCOMING_LIVES.some((l) => l.organizerId === "user-001"), "Léo anime un live");
  const live = code("src/app/(app)/live/page.tsx");
  assert.doesNotMatch(live, /activeRole/, "/live ne lit plus le rôle actif global");
  assert.match(live, /useSession\(\)/);
  assert.match(live, /canHost\(/);
});

test("P6c-5 — la console d'administration ne liste que l'annuaire (+ l'agence)", () => {
  const accounts = adminAccounts();
  for (const a of accounts) {
    assert.ok(DIR.has(a.id) || a.id === AGENCY_ACCOUNT_ID || a.id === PLATFORM_ACCOUNT_ID, `compte ${a.id} (${a.nom}) hors annuaire`);
    if (a.kind === "personne") {
      const p = personById(a.id)!;
      assert.equal(a.nom, `${p.firstName} ${p.lastName}`);
    }
  }
  assert.equal(accounts.filter((a) => a.kind === "personne").length, DIRECTORY_IDS.length);
  for (const r of ADMIN_REPORTS) assert.ok(DIR.has(r.auteurId), `signalement ${r.id} : ${r.auteurId}`);
  for (const b of adminProperties()) assert.ok(DIR.has(b.hoteId), `bien ${b.id} : hôte ${b.hoteId}`);
  assert.equal(adminProperties().length, CATALOGUE.length);
  // Le compteur « biens » d'un compte est celui du catalogue.
  for (const a of accounts.filter((x) => x.kind === "personne")) {
    assert.equal(a.biens, CATALOGUE.filter((p) => p.host.id === a.id).length);
  }
  // Le volume de transactions est une somme du journal, pas un chiffre écrit.
  const expected = LEDGER.filter(
    (e) => (e.status === "completed" || e.status === "confirmed") && e.source !== "apporteurs" && e.date.startsWith("2026-"),
  ).reduce((s, e) => s + e.gross, 0);
  assert.equal(platformVolume(2026), expected);
  assert.ok(platformVolume(2026) > 0);

  const consoleSrc = code("src/app/(app)/admin/admin-console.tsx");
  assert.match(consoleSrc, /Volume de transactions/);
  assert.doesNotMatch(consoleSrc, /chiffre d.affaires|revenus? de la plateforme/i);
  assert.doesNotMatch(consoleSrc, /MOCK_USERS|example\.com/);
});

test("P6c-6 — tuile du tableau de bord et /dashboard/apporteurs : mêmes chiffres, par personne", () => {
  for (const id of ["user-001", "user-012", "user-014"]) {
    const book = apporteurBook(emptySession(), id);
    const tile = apporteurTile(book);
    assert.equal(tile.acquiredCents, book.totals.total, id);
    assert.equal(tile.pendingCents, book.totals.pending, id);
  }
  // Les carnets diffèrent d'une personne à l'autre : pas les chiffres de Léo pour tous.
  const leo = apporteurBook(emptySession(), "user-001").totals.total;
  const yves = apporteurBook(emptySession(), "user-012").totals.total;
  assert.notEqual(leo, yves);
  // Les deux écrans lisent le carnet de la personne incarnée.
  assert.match(code("src/app/(app)/dashboard/apporteurs/page.tsx"), /useApporteurBook\(\)/);
  const dash = code("src/app/(app)/dashboard/page.tsx");
  assert.match(dash, /apporteurTile\(useApporteurBook\(\)\)/);
  assert.doesNotMatch(dash, /apporteurSummary/);
});

test("P6c-7 — Hélène (France) n'a aucune prime bien", () => {
  const book = apporteurBook(emptySession(), "user-014");
  assert.equal(book.eligibility.eligible, false);
  assert.equal(book.totals.bien, 0);
  assert.equal(book.lines.filter((l) => l.mechanic === "bien").length, 0);
  assert.ok(book.totals.marketplace > 0, "elle touche l'affiliation marketplace");
});

test("P6c-8 — plus de stock boutique chez Léo ni de panier", () => {
  assert.equal(boutiqueAlerts.length, 0);
  assert.doesNotMatch(code("src/lib/context.tsx"), /\bcart\b|addToCart|CartItem/i);
});

test("P6c-9 — grep : Marie Dupont, cal.com, « Vendre un produit », commission marketplace", () => {
  for (const f of SRC) {
    if (LEGAL_OR_LANDING.test(f)) continue;
    const src = code(f);
    assert.doesNotMatch(src, /Marie Dupont/, `${f} : Marie Dupont`);
    assert.doesNotMatch(src, /"Vendre un produit"|>\s*Vendre un produit\s*</, `${f} : « Vendre un produit »`);
    assert.doesNotMatch(src.replace(/aucune commission marketplace/gi, ""), /commission marketplace/i, `${f} : commission marketplace`);
    assert.doesNotMatch(src, /Recommander &amp; gagner/, `${f} : « Recommander & gagner » inconditionnel`);
  }
  for (const f of P6C_FILES) {
    const src = code(f);
    assert.doesNotMatch(src, /cal\.com|zoom\.us|calendar\.google\.com|youtube\.com\/embed/, `${f} : lien externe factice`);
    assert.doesNotMatch(src, /new Date\(\)/, `${f} : new Date() (horloge réelle)`);
    assert.doesNotMatch(src, /toLocaleDateString|toLocaleString/, `${f} : formatage ICU au rendu`);
  }
});
