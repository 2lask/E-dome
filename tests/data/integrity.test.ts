import assert from "node:assert/strict";
import { test } from "node:test";

import "@/lib/demo/invariants";
import * as derive from "@/lib/demo/derive";
import { LEDGER } from "@/lib/demo/ledger";
import { CURRENT_USER, OWNED_PROPERTY_IDS } from "@/lib/demo/identity";
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
