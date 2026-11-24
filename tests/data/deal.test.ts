import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

import { gapToAskingPct, isExpired, referenceOffer, stepsDone, suggestedSalePrice, validateOffer, type DealOffer } from "@/lib/deal";

const o = (id: string, amountChf: number, status: DealOffer["status"], extra: Partial<DealOffer> = {}): DealOffer => ({
  id, amountChf, status, financing: "inconnu", conditions: "", validUntil: null, counterAmountChf: null, createdAt: "2026-11-24T10:00:00Z", ...extra,
});

test("V1 · offre de référence : l'acceptée, sinon la meilleure ouverte", () => {
  assert.equal(referenceOffer([o("a", 1_300_000, "en-attente"), o("b", 1_350_000, "contre-offre", { counterAmountChf: 1_420_000 }), o("c", 1_500_000, "refusee")])?.id, "b");
  assert.equal(referenceOffer([o("a", 1_300_000, "acceptee"), o("b", 1_350_000, "en-attente")])?.id, "a");
  assert.equal(referenceOffer([o("c", 1_500_000, "refusee")]), null);
});

test("V2 · prix final suggéré : offre acceptée, ou sa contre-offre", () => {
  assert.equal(suggestedSalePrice([o("a", 1_300_000, "acceptee")]), 1_300_000);
  assert.equal(suggestedSalePrice([o("a", 1_300_000, "acceptee", { counterAmountChf: 1_380_000 })]), 1_380_000);
  assert.equal(suggestedSalePrice([o("a", 1_300_000, "en-attente")]), null);
});

test("V3 · écart au prix demandé et expiration", () => {
  assert.equal(gapToAskingPct(1_400_000, 1_490_000), -6);
  assert.equal(gapToAskingPct(1_490_000, 1_490_000), 0);
  assert.equal(gapToAskingPct(1_400_000, 0), null);
  assert.equal(isExpired(o("a", 1, "en-attente", { validUntil: "2026-11-20" }), "2026-11-24"), true);
  assert.equal(isExpired(o("a", 1, "acceptee", { validUntil: "2026-11-20" }), "2026-11-24"), false);
  assert.equal(isExpired(o("a", 1, "en-attente", { validUntil: "2026-11-24" }), "2026-11-24"), false);
});

test("V4 · validation d'une offre", () => {
  const t = "2026-11-24";
  assert.equal(validateOffer({ amountChf: 1_400_000, validUntil: null, conditions: "" }, t), null);
  assert.match(validateOffer({ amountChf: 500, validUntil: null, conditions: "" }, t) ?? "", /montant/);
  assert.match(validateOffer({ amountChf: 1_400_000, validUntil: "2026-11-01", conditions: "" }, t) ?? "", /passée/);
  assert.match(validateOffer({ amountChf: 1_400_000, validUntil: null, conditions: "x".repeat(1001) }, t) ?? "", /longues/);
  assert.equal(stepsDone({ financement: "x", acte: "y" }), 2);
});

test("V5 · migration 010 : RLS active, vendeur seul en écriture, vente conclue figée", () => {
  const sql = readFileSync("supabase/migrations/010_parcours_vente.sql", "utf8");
  for (const t of ["deal_offers", "deal_steps"]) assert.match(sql, new RegExp(`alter table public\\.${t} enable row level security`));
  assert.match(sql, /deal_offers_insert_seller[\s\S]*q\.seller_id = auth\.uid\(\) and q\.status <> 'conclue'/);
  assert.match(sql, /offre : vente déjà conclue/);
  assert.doesNotMatch(sql, /for (insert|update|delete)[^;]*sender_id/, "l'acheteur ne peut jamais écrire");
});
