import assert from "node:assert/strict";
import { test } from "node:test";

import "@/lib/demo/invariants";
import * as derive from "@/lib/demo/derive";
import { LEDGER } from "@/lib/demo/ledger";
import { CURRENT_USER, CURRENT_USER_ID, OWNED_PROPERTY_IDS, PROFILES } from "@/lib/demo/identity";
import { DEMO_TODAY } from "@/lib/demo/clock";
import { properties as CATALOGUE, formations as CATALOGUE_FORMATIONS, currentUser } from "@/lib/mock-data";
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
  apporteurSummary,
} from "@/lib/dashboard-data";
import { PROPS, buildView } from "@/lib/revenue-data";
import { quote, primeChf, AFFILIATION_RATES, EDOME_PRIME_SHARE } from "@/lib/pricing";
import { chf } from "@/lib/model/billing";

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
  assert.equal(currentUser.stats.properties, OWNED_PROPERTY_IDS.length);
  assert.equal(dashProperties.length, OWNED_PROPERTY_IDS.length);
  assert.equal(
    CATALOGUE.filter((p) => p.host.id === CURRENT_USER.id).length,
    OWNED_PROPERTY_IDS.length,
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
  assert.equal(apporteurSummary.earnedThisMonth, derive.currentMonth({ source: "apporteurs" }));
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
