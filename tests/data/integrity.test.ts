import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { join, sep } from "node:path";

import "@/lib/demo/invariants";
import * as derive from "@/lib/demo/derive";
import { LEDGER } from "@/lib/demo/ledger";
import { CURRENT_USER, CURRENT_USER_ID, OWNED_PROPERTY_IDS, HOSTED_PROPERTY_IDS, PROFILES } from "@/lib/demo/identity";
import { FOLLOWS, followersOf, followingOf } from "@/lib/demo/social";
import { AGENCY_MEMBER_IDS, activeSaleMandates, agencyCounts } from "@/lib/demo/agency";
import { demoAgency } from "@/content/agence";
import { DEMO_TODAY } from "@/lib/demo/clock";
import { properties as CATALOGUE, formations as CATALOGUE_FORMATIONS, currentUser, users, mockReviews } from "@/lib/mock-data";
import { PRODUCTS } from "@/lib/data/products";
import { DEFAULT_PROFILE, getMockProfile } from "@/lib/profile-data";
import {
  properties as dashProperties,
  formations as dashFormations,
  boutiqueAlerts,
  dashboardReservations,
  monthlyRevenue,
  revenueBySource,
  revenueByType,
  kpis,
  apporteurTile,
} from "@/lib/dashboard-data";
import { apporteurBook } from "@/lib/demo/affiliation";
import { emptySession } from "@/lib/demo/session-store";
import { PROPS, buildView } from "@/lib/revenue-data";
import { quote, primeChf, AFFILIATION_RATES, EDOME_PRIME_SHARE } from "@/lib/pricing";
import { chf } from "@/lib/model/billing";
import { isPlatformRole, migrateLegacyRoles } from "@/lib/model/identity";
import { PLATFORM_ROLE_LABELS, roleLabel } from "@/lib/model/role-labels";
import { formatVolumeChf } from "@/lib/utils";

/* ── Assertions d'intégrité des données de démonstration ────────────────────

   `npm run test:data`. Aucune dépendance nouvelle : `node --test` est intégré
   à Node 24, et les modules TypeScript s'exécutent directement.

   Ces épreuves ne remplacent pas les invariants de `src/lib/demo/invariants.ts`,
   qui sont levés à l'import et font échouer `next build`. Elles les doublent
   pour deux raisons : un échec y est lisible en une seconde plutôt qu'au
   milieu d'un log de construction, et elles couvrent en plus la cohérence
   entre les deux moteurs de revenus, que les invariants seuls ne voient pas.

   Chacune correspond à un défaut réellement constaté dans l'audit. Le nom de
   l'épreuve dit lequel. */

const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);

test("1 — aucun identifiant dupliqué dans le journal", () => {
  const ids = LEDGER.map((e) => e.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("2 — toute écriture porte sur un objet du catalogue", () => {
  for (const e of LEDGER) {
    if (e.subject.kind === "property") {
      assert.ok(
        CATALOGUE.some((p) => p.id === e.subject.id),
        `bien inconnu : ${e.subject.id}`,
      );
    }
    if (e.subject.kind === "formation") {
      assert.ok(
        CATALOGUE_FORMATIONS.some((f) => f.id === e.subject.id),
        `formation inconnue : ${e.subject.id}`,
      );
    }
  }
});

test("3 — montant d'un séjour = nuits × tarif de la fiche", () => {
  for (const e of LEDGER) {
    if (!e.stay) continue;
    const price = CATALOGUE.find((p) => p.id === e.subject.id)!.price;
    assert.equal(e.gross, e.stay.nights * price, `écriture ${e.id}`);
  }
});

test("4 — la série mensuelle somme au total sur douze mois", () => {
  assert.equal(sum(monthlyRevenue.map((m) => m.value)), derive.total());
});

test("5 — le revenu du mois égale le dernier point de la série", () => {
  assert.equal(kpis.revenue, monthlyRevenue[monthlyRevenue.length - 1]!.value);
});

test("6 — la répartition par source somme au revenu du mois", () => {
  assert.equal(sum(revenueBySource.map((r) => r.value)), kpis.revenue);
  assert.equal(sum(revenueByType.map((r) => r.value)), kpis.revenue);
});

test("7 — les deux moteurs de revenus concordent, toutes sources", () => {
  const view = buildView({ source: "all", period: "12m", propType: "all", bien: null });
  assert.equal(view.total, sum(monthlyRevenue.map((m) => m.value)));
});

test("8 — les deux moteurs voient les mêmes biens, aux mêmes montants", () => {
  assert.equal(dashProperties.length, PROPS.length);
  for (const a of dashProperties) {
    const b = PROPS.find((p) => p.id === a.id);
    assert.ok(b, `${a.id} absent de revenue-data`);
    assert.equal(a.monthRevenue, b.monthly.courte[b.monthly.courte.length - 1]);
    assert.equal(a.monthGrowth, `${b.delta >= 0 ? "+" : ""}${b.delta}%`);
  }
});

test("9 — chaque bien du tableau de bord existe au catalogue, au bon tarif", () => {
  for (const p of dashProperties) {
    const c = CATALOGUE.find((x) => x.id === p.id);
    assert.ok(c, `${p.id} absent du catalogue`);
    assert.equal(p.weeklyPrice, c.price * 7);
    assert.equal(p.city, c.location.city);
  }
});

test("10 — prix × occupation × 30 retombe sur le revenu du mois", () => {
  for (const p of dashProperties) {
    const c = CATALOGUE.find((x) => x.id === p.id)!;
    const implied = Math.round(c.price * p.occupancy * 30);
    assert.ok(
      Math.abs(implied - p.monthRevenue) <= c.price,
      `${p.id} : ${implied} contre ${p.monthRevenue}`,
    );
  }
});

test("11 — aucune formation ni produit inexistant au tableau de bord", () => {
  for (const f of dashFormations) {
    assert.ok(CATALOGUE_FORMATIONS.some((c) => c.id === f.id), `formation ${f.id}`);
  }
  for (const b of boutiqueAlerts) {
    const prod = PRODUCTS.find((x) => x.id === b.id);
    assert.ok(prod, `produit ${b.id}`);
    assert.equal(b.stock, prod.stock, `stock de ${b.id}`);
  }
});

test("12 — une seule identité d'utilisateur courant", () => {
  assert.equal(DEFAULT_PROFILE.id, CURRENT_USER.id);
  assert.equal(currentUser.id, CURRENT_USER.id);
  assert.equal(DEFAULT_PROFILE.email, currentUser.email);
  assert.equal(DEFAULT_PROFILE.location.city, currentUser.city);
  assert.equal(DEFAULT_PROFILE.stats.followers, currentUser.stats.followers);
  assert.equal(DEFAULT_PROFILE.stats.reviewsCount, currentUser.stats.reviews);

  /* Le profil public ne doit pas être une copie divergente : c'est ce qui
     donnait 87 avis d'un côté et 56 de l'autre pour la même personne. */
  const pub = getMockProfile(CURRENT_USER.id);
  assert.ok(pub, "le profil public de l utilisateur courant doit exister");
  assert.equal(pub.stats.reviewsCount, DEFAULT_PROFILE.stats.reviewsCount);
  assert.equal(pub.headline, DEFAULT_PROFILE.headline);
});

test("13 — l'utilisateur de démonstration n'est pas la plateforme", () => {
  assert.doesNotMatch(DEFAULT_PROFILE.headline, /E-Dome|fondateur|CEO/i);
  assert.doesNotMatch(DEFAULT_PROFILE.about, /E-Dome/i);
  for (const e of DEFAULT_PROFILE.experiences) {
    assert.doesNotMatch(e.company, /E-Dome/i);
  }
});

test("14 — le nombre de biens annoncé est celui qu'il possède", () => {
  /* Biens hébergés = courte durée (au tableau de bord, avec écritures) +
     longue durée (le 4,5 pièces de Renens, sans écriture : E-Dome ne
     commissionne pas le bail). */
  assert.equal(currentUser.stats.properties, HOSTED_PROPERTY_IDS.length);
  assert.equal(dashProperties.length, OWNED_PROPERTY_IDS.length);
  assert.equal(
    CATALOGUE.filter((p) => p.host.id === CURRENT_USER.id).length,
    HOSTED_PROPERTY_IDS.length,
  );
});

test("15 — toutes les dates tiennent dans la fenêtre de démonstration", () => {
  const floor = new Date(DEMO_TODAY);
  floor.setUTCMonth(floor.getUTCMonth() - 12);
  const ceiling = new Date(DEMO_TODAY);
  ceiling.setUTCMonth(ceiling.getUTCMonth() + 3);

  for (const e of LEDGER) {
    const d = new Date(`${e.date}T12:00:00Z`);
    assert.ok(d >= floor && d <= ceiling, `${e.id} daté ${e.date}`);
  }
});

test("16 — aucun compteur d'audience à quatre chiffres", () => {
  /* L'ordre de grandeur crédible pour un réseau qui se lance est la dizaine.
     Le profil annonçait 2 340 abonnés, et le lien menait à onze personnes. */
  assert.ok(DEFAULT_PROFILE.stats.followers < 1000, String(DEFAULT_PROFILE.stats.followers));
  assert.equal(currentUser.stats.revenue, 0);
});

test("17 — un seul chiffre pour les apporteurs", () => {
  /* La tuile du tableau de bord et l'espace apporteur lisent la MÊME source
     (`apporteurBook()`, P4a) — plus les anciennes lignes « apporteurs » du
     journal. Chantier P6c : on épingle la source unique, pour chaque apporteur. */
  for (const id of ["user-001", "user-012", "user-014"]) {
    const book = apporteurBook(emptySession(), id);
    const tile = apporteurTile(book);
    assert.equal(tile.acquiredCents, book.totals.total, `acquis ${id}`);
    assert.equal(tile.pendingCents, book.totals.pending, `en attente ${id}`);
  }
});

test("18 — le montant de chaque réservation affichée est vérifiable", () => {
  for (const r of dashboardReservations) {
    const c = CATALOGUE.find((x) => x.id === r.propertyId);
    assert.ok(c, `bien ${r.propertyId} de la réservation ${r.id}`);
    assert.equal(r.amount, r.nights * c.price, `réservation ${r.id}`);
  }
});

/* ── Le moteur de pricing à deux mécaniques (D14, étape 1.5) ─────────────── */

test("19 — mécanique BIENS : la prime se répartit apporteur + part E-Dome", () => {
  /* Prime de 100 CHF : E-Dome retient 12 % (12 CHF), l'apporteur touche 88 CHF
     NET (aucun PSP déduit de lui), PSP absorbé par E-Dome. */
  const q = quote({ kind: "bien-introduction", pole: "vente", prime: primeChf(100) });
  const f = q.flow;
  assert.equal(f.gross.cents, 10000);
  assert.equal(f.apporteur.cents, 8800, "apporteur = prime − part E-Dome");
  assert.equal(f.edomeGross.cents - f.apporteur.cents, 1200, "part brute E-Dome = 12 %");
  assert.equal(f.affiliate.cents, 0, "pas d'affiliation sur un bien");
  assert.equal(f.beneficiary.cents, 0, "le vendeur est le payeur, pas un bénéficiaire");
  assert.equal(f.pspBornBy, "platform");
  assert.ok(f.psp.cents > 0, "un PSP existe, absorbé par E-Dome");
  assert.equal(
    f.edomeNet.cents,
    f.edomeGross.cents - f.apporteur.cents - f.psp.cents,
    "E-Dome net = brut − apporteur − PSP",
  );
  /* Invariant de flux (branche plateforme) : brut = bénéficiaire + E-Dome + affilié. */
  assert.equal(f.beneficiary.cents + f.edomeGross.cents + f.affiliate.cents, f.gross.cents);
});

test("20 — la prime est verrouillée : bornée en francs, jamais un % du prix", () => {
  assert.equal(primeChf(100).cents, 10000);
  assert.equal(primeChf(50).cents, 5000, "borne basse acceptée");
  assert.equal(primeChf(3000).cents, 300000, "borne haute acceptée");
  assert.throws(() => primeChf(40), /hors bornes/, "sous 50 CHF");
  assert.throws(() => primeChf(3001), /hors bornes/, "au-dessus de 3 000 CHF");
  /* Le cas que le verrou vise : une « prime » dérivée d'un % du prix d'un bien.
     3 % d'un bien romand à 1,25 M dépasse largement le plafond → lève aussitôt. */
  assert.throws(() => primeChf(Math.round(1_250_000 * 0.03)), /hors bornes/);
  assert.ok(EDOME_PRIME_SHARE > 0 && EDOME_PRIME_SHARE < 1);
});

test("21 — mécanique MARKETPLACE : l'affilié sort de la marge, commission E-Dome inchangée", () => {
  const gross = chf(200);
  const rate = AFFILIATION_RATES.formation!.max; // 0.50
  const withAff = quote({ kind: "commission", pole: "formation", gross, affiliation: { rate } });
  const without = quote({ kind: "commission", pole: "formation", gross });
  assert.equal(withAff.flow.affiliate.cents, Math.round(gross.cents * rate), "affilié = % du prix");
  assert.equal(
    withAff.flow.edomeGross.cents,
    without.flow.edomeGross.cents,
    "la commission d'E-Dome ne bouge pas avec l'affiliation",
  );
  assert.ok(
    withAff.flow.beneficiary.cents < without.flow.beneficiary.cents,
    "l'affilié est prélevé sur la marge du vendeur",
  );
  /* Taux hors de la fourchette du pôle → lève. */
  assert.throws(() => quote({ kind: "commission", pole: "formation", gross, affiliation: { rate: 0.6 } }), /hors bornes/);
  assert.throws(() => quote({ kind: "commission", pole: "formation", gross, affiliation: { rate: 0.1 } }), /hors bornes/);
});

test("22 — l'invariant de flux tombe juste sur les deux mécaniques", () => {
  const prime = quote({ kind: "bien-introduction", pole: "location-lt", prime: primeChf(500) }).flow;
  const partsPrime = prime.beneficiary.cents + prime.edomeGross.cents + prime.affiliate.cents;
  assert.equal(partsPrime, prime.gross.cents, "prime : brut = bénéficiaire + E-Dome + affilié");

  const market = quote({
    kind: "commission",
    pole: "evenement",
    gross: chf(300),
    affiliation: { rate: AFFILIATION_RATES.evenement!.min },
  }).flow;
  const partsMarket =
    market.pspBornBy === "seller"
      ? market.beneficiary.cents + market.edomeGross.cents + market.affiliate.cents + market.psp.cents
      : market.beneficiary.cents + market.edomeGross.cents + market.affiliate.cents;
  assert.equal(partsMarket, market.gross.cents, "marketplace : brut = bénéficiaire + E-Dome + affilié (+ PSP)");
});

/* ── L'argent par profil (D4, étape 2) ──────────────────────────────────── */

test("23 — toute écriture porte un ownerId connu de PROFILES", () => {
  const known = new Set<string>(PROFILES.map((p) => p.ownerId));
  for (const e of LEDGER) {
    assert.ok(e.ownerId && known.has(e.ownerId), `écriture ${e.id} : ownerId « ${e.ownerId} » inconnu`);
  }
});

test("24 — les invariants d'argent tiennent PAR propriétaire", () => {
  const today = DEMO_TODAY.toISOString().slice(0, 10);
  for (const p of PROFILES) {
    /* Répartition par source == revenu du mois, pour CE profil. */
    const parts = derive.bySource(p.ownerId);
    assert.equal(
      sum(parts.map((r) => r.value)),
      derive.currentMonth({ ownerId: p.ownerId }),
      `bySource ≠ currentMonth pour ${p.ownerId}`,
    );
    /* Série == somme des écritures passées, pour CE profil. */
    const serie = sum(derive.monthly({ ownerId: p.ownerId }).map((m) => m.value));
    const passees = derive
      .entries({ ownerId: p.ownerId })
      .filter((e) => e.date <= today)
      .reduce((s, e) => s + e.gross, 0);
    assert.equal(serie, Math.round(passees), `série ≠ écritures passées pour ${p.ownerId}`);
  }
});

test("25 — pas de fuite entre profils : les totaux par profil somment au journal", () => {
  /* Somme des totaux par propriétaire == somme des bruts commissionnables du
     journal (les GMV non commissionnables et les annulées exclus des deux
     côtés). Un montant qui fuit d'un profil à l'autre casserait l'égalité. */
  const perOwner = sum(PROFILES.map((p) => derive.total({ ownerId: p.ownerId })));
  const journal = LEDGER.filter(
    (e) => e.commissionable !== false && e.status !== "cancelled",
  ).reduce((s, e) => s + e.gross, 0);
  assert.equal(perOwner, Math.round(journal));

  /* Aucune écriture d'un profil n'apparaît dans le total d'un autre. */
  const owners = PROFILES.map((p) => p.ownerId);
  for (const p of PROFILES) {
    const others = owners.filter((o) => o !== p.ownerId);
    for (const o of others) {
      const shared = derive
        .entries({ ownerId: p.ownerId })
        .some((e) => derive.entries({ ownerId: o }).some((x) => x.id === e.id));
      assert.ok(!shared, `des écritures fuient entre ${p.ownerId} et ${o}`);
    }
  }
});

test("26 — GMV agence : volume jamais compté dans le revenu", () => {
  /* Toute écriture « vente » est non commissionnable (garde structurel). */
  for (const e of LEDGER) {
    if (e.source === "vente") {
      assert.equal(e.commissionable, false, `écriture ${e.id} : vente doit être non commissionnable`);
    }
  }
  /* Le volume GMV est séparé du revenu : aucune écriture non commissionnable
     n'entre dans total()/entries(). */
  const revenueEntries = derive.entries({ ownerId: CURRENT_USER_ID });
  assert.ok(
    revenueEntries.every((e) => e.commissionable !== false),
    "une écriture GMV a fuité dans le revenu",
  );
  assert.equal(typeof derive.gmvVolume(CURRENT_USER_ID), "number");
});

/* ── Les trois premiers profils complets (B.1, étape 3) ──────────────────── */

test("27 — les stats des SEIZE personnes concordent avec le journal et les avis", () => {
  const round1 = (n: number) => Math.round(n * 10) / 10;
  assert.equal(users.length, 16, "le casting compte seize personnes");
  for (const p of PROFILES) assert.ok(users.some((u) => u.id === p.ownerId), `profil ${p.ownerId} absent de users[]`);

  for (const person of users) {
    const id = person.id;
    const hostCount = CATALOGUE.filter((p) => p.host.id === id).length;
    const activity = LEDGER.filter((e) => e.ownerId === id && e.status !== "cancelled").length;
    const revenue = id === CURRENT_USER_ID ? 0 : Math.round(derive.total({ ownerId: id }));
    const revs = mockReviews.filter((r) => r.recipientId === id);
    const rating = revs.length ? round1(revs.reduce((s, r) => s + r.rating, 0) / revs.length) : 0;

    assert.equal(person.stats.properties, hostCount, `${id} : properties`);
    assert.equal(person.stats.transactions, activity, `${id} : transactions`);
    assert.equal(person.stats.revenue, revenue, `${id} : revenue commissionnable`);
    assert.equal(person.stats.reviews, revs.length, `${id} : reviews`);
    assert.equal(person.stats.rating, rating, `${id} : rating`);
  }
  /* Chaque profil à activité récurrente a un mois courant non vide. */
  for (const p of PROFILES) {
    if (p.ownedPropertyIds.length === 0 && p.ownedFormationIds.length === 0) continue;
    assert.ok(derive.currentMonth({ ownerId: p.ownerId }) > 0, `${p.ownerId} : mois courant vide`);
  }
});

test("28 — le volume de mandats de vente (GMV) reste hors du revenu", () => {
  /* Sophie et Jean-Luc portent un volume de mandats ; Marc n'en a aucun. */
  assert.ok(derive.gmvVolume("user-002") > 0, "Céline doit porter un volume de mandats");
  assert.ok(derive.gmvVolume("user-015") > 0, "Jean-Luc doit porter un volume de mandats");
  assert.equal(derive.gmvVolume("user-003"), 0, "Ennio (investisseur) n'a aucun mandat de vente");
  /* Ce volume n'entre jamais dans le revenu dérivé. */
  for (const owner of ["user-002", "user-015"]) {
    const revenueEntries = derive.entries({ ownerId: owner });
    assert.ok(
      revenueEntries.every((e) => e.commissionable !== false),
      `un GMV a fuité dans le revenu de ${owner}`,
    );
  }
});

/* ── Étape 4a — rôles de plateforme et purge de « courtier » (D11, D16.2) ── */

test("29 — les personnes de la démo ne portent que des PlatformRole", () => {
  for (const u of users) {
    assert.ok(u.roles.length > 0, `${u.id} : aucun rôle`);
    for (const r of u.roles) assert.ok(isPlatformRole(r), `${u.id} : rôle hérité « ${r} »`);
    assert.ok(isPlatformRole(u.activeRole), `${u.id} : activeRole hérité « ${u.activeRole} »`);
    assert.ok(u.roles.includes(u.activeRole), `${u.id} : activeRole hors de ses rôles`);
    /* Un métier n'a de sens que pour un prestataire. */
    if (u.trades?.length) assert.ok(u.roles.includes("prestataire"), `${u.id} : métier sans rôle prestataire`);
  }
  for (const r of DEFAULT_PROFILE.roles) assert.ok(isPlatformRole(r), `profil courant : rôle hérité « ${r} »`);
  /* Une seule table de libellés, et aucun ne nomme le rôle retiré. */
  for (const label of Object.values(PLATFORM_ROLE_LABELS)) {
    assert.doesNotMatch(label, COURTIER_RE, `libellé de rôle interdit : ${label}`);
  }
  assert.equal(roleLabel("prestataire", ["photographe"]), "Prestataire · Photographe");
  /* La passerelle relit un ancien jeu de rôles sans rien perdre. */
  const migrated = migrateLegacyRoles(["courtier", "investisseur", "formateur", "photographe"]);
  assert.deepEqual(migrated.roles, ["agence", "createur", "prestataire"]);
  assert.deepEqual(migrated.trades, ["photographe"]);
  assert.deepEqual(migrated.interests, ["investisseur"]);
});

/* Le mot « courtier » ne revient jamais par accident (D16.2).

   Parcourt TOUT `src/`. Deux exceptions seulement, explicites :
   · la landing et ses annexes, GELÉES (D12) — on n'y touche pas ;
   · les fichiers qui parlent du CADRE JURIDIQUE du courtage, chacun avec un
     nombre MAXIMAL d'occurrences : une occurrence de plus dans l'un d'eux
     échoue aussi. Toute autre occurrence, n'importe où, fait échouer. */
const COURTIER_RE = /courti(?:e|è|\u00e8)r/i;

const FROZEN_PREFIXES = [
  "src/content/landing.ts",
  "src/lib/leads/",
  "src/app/merci/",
  "src/app/admin/leads/",
  "src/app/(app)/confidentialite/",
];

const LEGAL_ALLOWLIST: Record<string, number> = {
  /* art. 412/413 CO — la définition du courtage et le salaire du courtier. */
  "src/lib/model/rules.ts": 2,
  /* Justification, en commentaire, de l'absence du rôle et de la table de
     passage `courtier → agence` (clé héritée). */
  "src/lib/model/identity.ts": 8,
  /* Clé héritée de l'ancien type `Role`, relue par la passerelle. */
  "src/lib/types.ts": 1,
  /* Commentaire : ce qui distingue un apporteur d'un courtier (compliance). */
  "src/lib/model/compliance.ts": 1,
  /* CGU, section des règles : « E-Dome n'est pas un courtier ». */
  "src/content/conditions.ts": 1,
};

function listSourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listSourceFiles(full));
    else out.push(full.split(sep).join("/"));
  }
  return out;
}

test("30 — aucun « courtier » dans src/ hors cadre juridique (garde-fou D16.2)", () => {
  const offenders: string[] = [];
  for (const file of listSourceFiles("src")) {
    if (FROZEN_PREFIXES.some((p) => file.startsWith(p))) continue;
    if (!/\.(tsx?|jsx?|mjs|json|css|md|html|txt)$/.test(file)) continue;
    const text = readFileSync(file, "utf8");
    const count = (text.match(new RegExp(COURTIER_RE.source, "gi")) ?? []).length;
    const allowed = LEGAL_ALLOWLIST[file] ?? 0;
    if (count > allowed) offenders.push(`${file} : ${count} occurrence(s), ${allowed} autorisée(s)`);
  }
  assert.deepEqual(offenders, [], `« courtier » réapparaît :\n${offenders.join("\n")}`);
});

test("31 — la fiche publique affiche un volume, jamais un revenu (D16.1)", () => {
  const year = DEMO_TODAY.getUTCFullYear();
  /* Les agences de la démo portent un volume de l'année ; un particulier non. */
  assert.ok(derive.gmvVolume("user-002", year) > 0, "Céline : volume de l'année attendu");
  assert.ok(derive.gmvVolume("user-015", year) > 0, "Jean-Luc : volume de l'année attendu");
  assert.equal(derive.gmvVolume("user-003", year), 0);
  /* Formatage déterministe, sans toLocaleString. */
  assert.equal(formatVolumeChf(4_650_000), "4,65 M CHF");
  assert.equal(formatVolumeChf(2_000_000), "2 M CHF");
  assert.equal(formatVolumeChf(850_000), "850'000 CHF");
  /* Le libellé exact vit dans l'en-tête de profil, sans mot de revenu. */
  const header = readFileSync("src/components/profile/profile-header.tsx", "utf8");
  assert.match(header, /Volume de transactions \{transactionVolume\.year\}/);
  assert.match(header, /pas un revenu/);
  assert.doesNotMatch(header, /chiffre d.affaires|revenus|gains/i);
});

/* ── Chantier P1 — le casting des seize ─────────────────────────────────── */

test("32 — abonnés et suivis égalent le graphe FOLLOWS (seize personnes)", () => {
  const ids = new Set(users.map((u) => u.id));
  const edges = new Set<string>();
  for (const e of FOLLOWS) {
    assert.ok(ids.has(e.from) && ids.has(e.to), `relation hors annuaire : ${e.from}→${e.to}`);
    assert.notEqual(e.from, e.to, `auto-suivi : ${e.from}`);
    const k = `${e.from}→${e.to}`;
    assert.ok(!edges.has(k), `relation en double : ${k}`);
    edges.add(k);
  }
  for (const u of users) {
    assert.equal(u.stats.followers, followersOf(u.id).length, `${u.id} : abonnés`);
    assert.equal(u.stats.following, followingOf(u.id).length, `${u.id} : suivis`);
    /* Un réseau qui se lance : quelques abonnés, une quinzaine au plus. */
    assert.ok(u.stats.followers >= 1 && u.stats.followers <= 15, `${u.id} : ${u.stats.followers} abonnés`);
  }
  /* « Abonnés » n'est plus l'annuaire entier. */
  assert.ok(followersOf(CURRENT_USER_ID).length < users.length - 1);
  assert.equal(DEFAULT_PROFILE.stats.followers, followersOf(CURRENT_USER_ID).length);
  assert.equal(DEFAULT_PROFILE.stats.following, followingOf(CURRENT_USER_ID).length);
});

test("33 — chaque avis vient de l'annuaire et se rattache à un achat réel", () => {
  const name = (id: string) => {
    const u = users.find((x) => x.id === id)!;
    return `${u.firstName} ${u.lastName}`;
  };
  for (const r of mockReviews) {
    assert.ok(users.some((u) => u.id === r.author.id), `avis ${r.id} : auteur hors annuaire`);
    assert.notEqual(r.author.id, r.recipientId, `avis ${r.id} : auto-évaluation`);
    if (r.subject.kind === "formation") {
      assert.ok(
        LEDGER.some((e) => e.source === "formations" && e.subject.id === r.subject.id && e.counterparty === name(r.author.id)),
        `avis ${r.id} : ${r.author.id} n'a pas suivi ${r.subject.id}`,
      );
    }
  }
  /* Les relations réciproques du casting. */
  const has = (author: string, recipient: string) => mockReviews.some((r) => r.author.id === author && r.recipientId === recipient);
  assert.ok(has("user-003", "user-002"), "Ennio → Céline");
  assert.ok(mockReviews.find((r) => r.author.id === "user-003" && r.recipientId === "user-002")?.reply, "réponse de Céline à Ennio");
  assert.ok(has("user-007", "user-005"), "Bernard → Nikola");
  assert.ok(has("user-002", "user-005") && has("user-005", "user-002"), "Céline ↔ Nikola");
  assert.ok(has("user-002", "user-010") && has("user-010", "user-002"), "Céline ↔ Elena");
  assert.ok(has("user-011", "user-015"), "une cliente → Jean-Luc");
  assert.ok(mockReviews.some((r) => r.author.id === "user-013" && r.subject.kind === "formation" && r.recipientId === "user-016"), "Mirjana → formation d'Amina");
  assert.ok(mockReviews.some((r) => r.author.id === "user-001" && r.subject.kind === "formation" && r.recipientId === "user-011"), "Léo → formation de Sandrine");
});

test("34 — catalogue : lieux du casting, location longue durée, biens vendus retirés", () => {
  const lt = CATALOGUE.filter((p) => p.transactionType === "location-lt");
  assert.ok(lt.length >= 5, `${lt.length} biens en longue durée`);
  const lemanique = ["Lausanne", "Renens", "Prilly", "Vevey", "Morges", "Nyon", "Montreux", "Pully", "Lutry"];
  assert.ok(lt.filter((p) => lemanique.includes(p.location.city)).length >= 2, "plusieurs locations sur l'arc lémanique");
  /* Le seul bien hors Suisse est le riad d'Amina (profil marocain). */
  for (const p of CATALOGUE.filter((x) => x.location.country !== "Suisse")) {
    assert.equal(p.host.id, "user-016", `${p.id} hors Suisse sans profil international`);
  }
  /* Tout hôte est une personne du casting ; aucun ancien bien lointain. */
  for (const p of CATALOGUE) {
    assert.ok(users.some((u) => u.id === p.host.id), `${p.id} : hôte hors annuaire`);
    assert.doesNotMatch(p.location.city, /Dubai|Phuket|Santorin|Lisbonne|Nice|Barcelone|Zurich|Lugano/);
  }
  /* L'appartement que Léo loue à Renens existe, en longue durée. */
  assert.ok(CATALOGUE.some((p) => p.host.id === CURRENT_USER_ID && p.location.city === "Renens" && p.transactionType === "location-lt"));
  /* Un bien vendu n'est plus proposé. */
  for (const p of CATALOGUE.filter((x) => x.soldTo)) assert.ok(users.some((u) => u.id === p.soldTo), `${p.id} : acheteur hors annuaire`);
});

test("35 — l'agence de démonstration est Hartmann Immobilier SA, avec une vraie équipe", () => {
  assert.equal(demoAgency.name, "Hartmann Immobilier SA");
  assert.deepEqual([...AGENCY_MEMBER_IDS].sort(), ["user-004", "user-015"]);
  const counts = agencyCounts();
  assert.equal(counts.members, AGENCY_MEMBER_IDS.length);
  assert.equal(counts.activeMandates, activeSaleMandates().length);
  for (const p of activeSaleMandates()) {
    assert.ok(AGENCY_MEMBER_IDS.includes(p.host.id), `${p.id} : mandat d'un non-membre`);
    assert.equal(p.soldTo, undefined);
  }
  const slugPage = readFileSync("src/app/(app)/agence/[slug]/page.tsx", "utf8");
  assert.doesNotMatch(slugPage, /CATALOGUE\.filter/);
});

test("36 — aucun portrait réel dans src/ : tout visage vient de /avatars", () => {
  for (const u of users) assert.equal(u.avatar, `/avatars/${u.id}.jpg`, `${u.id} : avatar`);
  const FACE_IDS = [
    "1500648767791", "1463453091185", "1504257432389", "1531746020798", "1535713875002", "1544005313",
    "1548449112", "1560250097", "1580489944761", "1487412720507", "1507003211169", "1438761681033",
    "1472099645785", "1494790108377", "1506794778202", "1534528741775", "1507591064344", "1519345182560",
    "1581094794329",
  ];
  const offenders: string[] = [];
  for (const file of listSourceFiles("src")) {
    if (!/\.(tsx?|jsx?)$/.test(file)) continue;
    const text = readFileSync(file, "utf8");
    if (/crop=faces?/.test(text) || FACE_IDS.some((id) => text.includes(`photo-${id}`))) offenders.push(file);
  }
  assert.deepEqual(offenders, [], `portraits réels :\n${offenders.join("\n")}`);
});

test("37 — le fil vivant : compteurs réels, seize voix, trois semaines (P2bis, B.3)", async () => {
  const { VIDEO_POSTS, POLL_VOTERS, PINNED_POST_ID, SUGGESTIONS, CUSTOM_CTA } = await import("@/lib/demo/posts");
  const { DIRECTORY, DIRECTORY_IDS, PLATFORM_ACCOUNT_ID } = await import("@/lib/demo/directory");
  const { getPublicPosts } = await import("@/lib/profile-posts");
  const inDirectory = (id: string) => DIRECTORY_IDS.includes(id);
  const now = DEMO_TODAY.getTime();
  const floor = now - 22 * 86_400_000;
  const days = new Set<string>();

  assert.ok(VIDEO_POSTS.length >= 35 && VIDEO_POSTS.length <= 46, `${VIDEO_POSTS.length} publications`);
  assert.equal(new Set(VIDEO_POSTS.map((p) => p.id)).size, VIDEO_POSTS.length, "id de post en double");

  for (const p of VIDEO_POSTS) {
    const isPlatform = p.author.id === PLATFORM_ACCOUNT_ID;
    assert.ok(isPlatform || inDirectory(p.author.id), `${p.id} : auteur ${p.author.id} hors annuaire`);
    if (isPlatform) assert.equal(p.id, PINNED_POST_ID, "seul l'avis épinglé est signé E-Dome");

    /* « J'aime » : une liste de personnes réelles, le compteur en dérive. */
    assert.ok(Array.isArray(p.likedBy), `${p.id} : likedBy manquant`);
    assert.equal(p.likes, p.likedBy.length, `${p.id} : compteur non dérivé`);
    assert.ok(p.likes <= DIRECTORY.length, `${p.id} : ${p.likes} j'aime pour ${DIRECTORY.length} personnes`);
    assert.equal(new Set(p.likedBy).size, p.likedBy.length, `${p.id} : likeur en double`);
    for (const id of p.likedBy) {
      assert.ok(inDirectory(id), `${p.id} : likeur ${id} hors annuaire`);
      assert.notEqual(id, p.author.id, `${p.id} : l'auteur s'aime lui-même`);
    }

    /* Dates : sur l'horloge de la démo, étalées sur trois semaines. */
    const t = new Date(p.createdAt).getTime();
    assert.ok(t <= now, `${p.id} daté dans le futur`);
    if (!isPlatform) {
      assert.ok(t >= floor, `${p.id} hors de la fenêtre de trois semaines`);
      days.add(p.createdAt.slice(0, 10));
    }

    /* Commentaires : des personnes réelles, après le post, avant aujourd'hui. */
    for (const c of p.comments) {
      assert.ok(inDirectory(c.author.id), `${c.id} : commentateur ${c.author.id} hors annuaire`);
      const ct = new Date(c.createdAt).getTime();
      assert.ok(ct > t && ct <= now, `${c.id} : daté hors de [post, aujourd'hui]`);
      const likers = (c as { likedBy?: string[] }).likedBy ?? [];
      assert.equal(c.likes, likers.length, `${c.id} : compteur de commentaire non dérivé`);
      for (const id of likers) {
        assert.ok(inDirectory(id), `${c.id} : likeur ${id} hors annuaire`);
        assert.notEqual(id, c.author.id, `${c.id} : le commentateur s'aime lui-même`);
      }
    }

    /* Sondages : chaque vote est une personne réelle, une seule fois. */
    if (p.poll) {
      const voters = POLL_VOTERS[p.id];
      assert.ok(voters, `${p.id} : votants inconnus`);
      const flat = voters.flat();
      assert.equal(new Set(flat).size, flat.length, `${p.id} : quelqu'un a voté deux fois`);
      for (const id of flat) assert.ok(inDirectory(id), `${p.id} : votant ${id} hors annuaire`);
      assert.equal(p.poll.totalVotes, flat.length);
      assert.deepEqual(p.poll.options.map((o) => o.votes), voters.map((v) => v.length));
    }

    /* Un bien joint appartient à l'auteur du post. */
    if (p.property) assert.equal(p.property.host.id, p.author.id, `${p.id} : bien d'un autre hôte`);
    if (typeof p.views === "number") assert.ok(p.views < 1000, `${p.id} : ${p.views} vues`);
    for (const m of p.media) assert.ok(!m.includes("clip-01"), `${p.id} : clip filigrané « surjo.aep »`);
  }

  assert.ok(days.size >= 15, `publications concentrées sur ${days.size} jours`);

  /* Les seize publient, chacun au moins une fois ; les pros plus que les
     particuliers. */
  const count = (id: string) => VIDEO_POSTS.filter((p) => p.author.id === id).length;
  for (const id of DIRECTORY_IDS) assert.ok(count(id) >= 1, `${id} ne publie rien`);
  for (const particulier of ["user-006", "user-007", "user-008"]) assert.ok(count(particulier) <= 2);

  /* CTA : vers des profils de l'annuaire. */
  for (const [postId, cta] of Object.entries(CUSTOM_CTA)) {
    assert.ok(VIDEO_POSTS.some((p) => p.id === postId), `CTA orphelin ${postId}`);
    const m = cta.href.match(/^\/profil\/(.+)$/);
    if (m) assert.ok(inDirectory(m[1]), `CTA ${postId} : profil ${m[1]} inconnu`);
  }

  /* « Qui suivre » : jamais soi-même, jamais quelqu'un qu'on suit déjà. */
  const followed = followingOf(CURRENT_USER_ID);
  for (const s of SUGGESTIONS) {
    assert.notEqual(s.id, CURRENT_USER_ID);
    assert.ok(!followed.includes(s.id), `${s.id} déjà suivi`);
  }
  assert.equal(SUGGESTIONS.length, DIRECTORY.length - 1 - followed.length);

  /* L'onglet Publications d'un profil = ses posts du fil, rien d'autre. */
  for (const u of DIRECTORY) {
    const mine = getPublicPosts(u).map((p) => p.id).sort();
    const inFeed = VIDEO_POSTS.filter((p) => p.author.id === u.id).map((p) => p.id).sort();
    assert.deepEqual(mine, inFeed, `${u.id} : profil et fil divergent`);
  }
});
