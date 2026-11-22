import assert from "node:assert/strict";
import { test } from "node:test";

import { computeApporteur, computeSeller, daysOf, type EventRow, type LeadRow, type PropRow } from "@/lib/dashboard-stats";

const NOW = Date.parse("2026-11-24T12:00:00Z");
const ago = (d: number) => new Date(NOW - d * 86_400_000).toISOString();
const P: PropRow[] = [
  { id: "a", title: "Villa A", price: 1_000_000, cover: "" },
  { id: "b", title: "Appart B", price: 500_000, cover: "" },
];
const pct1 = { kind: "pourcentage" as const, amountChf: null, ratePct: 1, dueOn: "conclusion" as const };

const events: EventRow[] = [
  { property_id: "a", kind: "vue", link_id: "L1", visitor: "v1", created_at: ago(1) },
  { property_id: "a", kind: "vue", link_id: null, visitor: "v2", created_at: ago(1) },
  { property_id: "a", kind: "vue", link_id: null, visitor: "v2", created_at: ago(2) },
  { property_id: "b", kind: "vue", link_id: null, visitor: "v3", created_at: ago(3) },
  { property_id: "b", kind: "partage", link_id: null, visitor: "v3", created_at: ago(3) },
  { property_id: "a", kind: "vue", link_id: null, visitor: "v9", created_at: ago(40) }, // hors 30 j
];
const leads: LeadRow[] = [
  { id: "1", property_id: "a", status: "conclue", created_at: ago(5), closed_at: ago(1), sale_price: 950_000, apporteur_id: "u1", apporteur_name: "Léa", terms: pct1 },
  { id: "2", property_id: "a", status: "offre", created_at: ago(4), closed_at: null, sale_price: null, apporteur_id: null, apporteur_name: null, terms: null },
  { id: "3", property_id: "b", status: "nouvelle", created_at: ago(2), closed_at: null, sale_price: null, apporteur_id: null, apporteur_name: null, terms: null },
];

test("D-1 · vendeur : vues, visiteurs uniques, leads, ventes, CA, commissions, net", () => {
  const s = computeSeller(30, NOW, P, events, leads);
  assert.equal(s.views, 4);
  assert.equal(s.visitors, 3);
  assert.equal(s.shares, 1);
  assert.equal(s.leads, 3);
  assert.equal(s.sales, 1);
  assert.equal(s.revenue, 950_000);
  assert.equal(s.commissions, 9_500, "1 % du prix FINAL");
  assert.equal(s.net, 940_500);
  assert.equal(s.pipelineValue, 1_000_000, "bien avec une offre en cours");
  assert.equal(s.viaApporteurs, 25);
  assert.deepEqual(s.funnel.map((f) => f.value), [3, 3, 2, 2, 1]);
  assert.equal(s.topApporteurs[0].name, "Léa");
  assert.equal(s.topApporteurs[0].commissions, 9_500);
  assert.equal(s.series.length, 30);
});

test("D-2 · la période filtre vraiment", () => {
  const s7 = computeSeller(7, NOW, P, events, leads);
  const s90 = computeSeller(90, NOW, P, events, leads);
  assert.equal(s7.views, 4);
  assert.equal(s90.views, 5);
  assert.equal(daysOf(7, NOW).at(-1), "2026-11-24");
});

test("D-3 · apporteur : clics de ses liens, ventes, commissions NETTES gagnées et en cours", () => {
  const a = computeApporteur(30, NOW, [{ id: "L1", code: "abcd2345", property: P[0] }], events, [
    leads[0],
    { ...leads[2], id: "4", property_id: "a", apporteur_id: "u1", terms: pct1 },
  ]);
  assert.equal(a.clicks, 1);
  assert.equal(a.sales, 1);
  assert.equal(a.revenueGenerated, 950_000);
  assert.equal(a.commissionsEarned, 8_360, "9'500 brut − 12 % E-Dome");
  assert.equal(a.commissionsPending, 8_800, "10'000 estimés au prix demandé, nets");
  assert.equal(a.links[0].earned, 8_360);
});
