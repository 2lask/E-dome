import assert from "node:assert/strict";
import { test } from "node:test";

import { CITIES, cityBySlug, inCity, norm } from "@/lib/villes";

test("V1 · une localité saisie librement rejoint la bonne ville", () => {
  const ne = cityBySlug("neuchatel")!;
  const vd = cityBySlug("lausanne")!;
  assert.equal(norm("Neuchâtel 2000"), "neuchatel 2000");
  assert.ok(inCity("Neuchâtel", ne));
  assert.ok(inCity("2000 neuchatel", ne));
  assert.ok(inCity("Peseux", ne));
  assert.ok(inCity("La Chaux-de-Fonds", ne));
  assert.ok(inCity("Renens VD", vd));
  assert.ok(!inCity("Lausanne", ne));
  assert.ok(!inCity("Neuchâtel", vd));
  assert.ok(!inCity("Marinette", ne), "pas de correspondance partielle de mot");
});

test("V2 · adresses de ville valides et uniques", () => {
  const slugs = CITIES.map((c) => c.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const s of slugs) assert.match(s, /^[a-z-]+$/);
  assert.equal(cityBySlug("geneve"), null);
});
