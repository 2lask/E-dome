import assert from "node:assert/strict";
import { test } from "node:test";

import { propertySanity } from "@/lib/property-sanity";
import { fixedCap, validateTerms } from "@/lib/commission";

test("S1 · vraisemblance : l'annonce absurde est refusée, l'annonce normale passe", () => {
  assert.equal(propertySanity({ tx: "vente", price: 1_490_000, area: 168, bedrooms: 3, bathrooms: 2 }), null);
  assert.equal(propertySanity({ tx: "location-lt", price: 2_150, area: 82, bedrooms: 2, bathrooms: 1 }), null);
  assert.equal(propertySanity({ tx: "vente", price: 9_999, area: 88, bedrooms: 99, bathrooms: 1 })?.field, "price");
  assert.equal(propertySanity({ tx: "vente", price: 900_000, area: 88, bedrooms: 99, bathrooms: 1 })?.field, "rooms");
  assert.equal(propertySanity({ tx: "location-lt", price: 250_000, area: 80, bedrooms: 2, bathrooms: 1 })?.field, "price");
  assert.equal(propertySanity({ tx: "vente", price: 900_000, area: 2, bedrooms: 0, bathrooms: 0 })?.field, "area");
  assert.equal(propertySanity({ tx: "vente", price: 0, area: 0, bedrooms: 0, bathrooms: 0 }), null, "champs vides : rien à juger ici");
});

test("S2 · commission fixe proportionnée au prix (art. 417 CO)", () => {
  const fixe = (amountChf: number) => ({ kind: "fixe" as const, amountChf, ratePct: null, dueOn: "conclusion" as const });
  assert.equal(fixedCap("vente", 1_000_000), 30_000);
  assert.equal(fixedCap("location-lt", 2_000), 4_000);
  assert.equal(fixedCap("vente", 0), null);
  assert.equal(validateTerms(fixe(30_000), "vente", 9_999), "Au plus 3 % du prix de vente, soit 299 CHF.");
  assert.equal(validateTerms(fixe(5_000), "vente", 1_000_000), null);
  assert.match(validateTerms(fixe(5_000), "location-lt", 2_000) ?? "", /deux loyers mensuels, soit 4'000 CHF/);
  assert.equal(validateTerms(fixe(5_000), "vente"), null, "prix inconnu : seules les bornes absolues s'appliquent");
});
