import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

import { commissionChf, commissionLabel, defaultTerms, dueLabel, estimateChf, netForApporteur, validateTerms } from "@/lib/commission";

test("C1 · fixe : le montant, quel que soit le prix", () => {
  const t = { kind: "fixe" as const, amountChf: 2000, ratePct: null, dueOn: "conclusion" as const };
  assert.equal(commissionChf(t, null), 2000);
  assert.equal(commissionChf(t, 900_000), 2000);
  assert.equal(commissionLabel(t), "CHF 2'000");
});

test("C2 · pourcentage : sur le prix FINAL, arrondi au centime", () => {
  const t = { kind: "pourcentage" as const, amountChf: null, ratePct: 1.5, dueOn: "conclusion" as const };
  assert.equal(commissionChf(t, null), null, "inconnu tant que la vente n'est pas conclue");
  assert.equal(commissionChf(t, 850_000), 12_750);
  assert.equal(estimateChf(t, 900_000), 13_500);
  assert.equal(commissionLabel(t), "1,5 % du prix");
  assert.equal(netForApporteur(12_750), 11_220); // 12 % pour E-Dome
});

test("C3 · garde-fous juridiques", () => {
  const pct = { kind: "pourcentage" as const, amountChf: null, ratePct: 1, dueOn: "conclusion" as const };
  assert.equal(validateTerms(pct, "vente"), null);
  assert.match(validateTerms(pct, "location-lt")!, /vente/);
  assert.match(validateTerms({ ...pct, ratePct: 4 }, "vente")!, /3 %/);
  assert.match(validateTerms({ ...pct, dueOn: "acceptation" }, "vente")!, /signature/);
  assert.match(validateTerms({ kind: "fixe", amountChf: 60_000, ratePct: null, dueOn: "conclusion" }, "vente")!, /50'000/);
  assert.equal(validateTerms({ kind: "fixe", amountChf: 500, ratePct: null, dueOn: "acceptation" }, "location-lt"), null);
  assert.match(validateTerms({ kind: "fixe", amountChf: 500, ratePct: null, dueOn: "acceptation" }, "location-ct")!, /courte/);
  assert.equal(validateTerms(defaultTerms("vente", 800_000), "vente"), null);
  assert.equal(validateTerms(defaultTerms("location-lt", 2400), "location-lt"), null);
});

test("C4 · la base applique les mêmes règles que le code", () => {
  const sql = readFileSync("supabase/migrations/009_apport.sql", "utf8");
  assert.ok(sql.includes("amount_chf between 50 and 50000"));
  assert.ok(sql.includes("rate_pct > 0 and rate_pct <= 3 and due_on = 'conclusion'"));
  assert.ok(sql.includes("round(coalesce(new.sale_price, 0) * coalesce(new.commission_rate_pct, 0)) / 100.0"));
  assert.ok(sql.includes("prix de vente requis"));
  assert.ok(sql.includes("new.apporteur_id is distinct from old.apporteur_id"), "le vendeur ne peut pas retirer l'apporteur");
  assert.ok(sql.includes("vente déjà conclue"));
});

test("C5 · échéance : vente, bail, acceptation", () => {
  const conc = { kind: "fixe" as const, amountChf: 800, ratePct: null, dueOn: "conclusion" as const };
  assert.equal(dueLabel(conc), "due à la signature de la vente");
  assert.equal(dueLabel(conc, "vente"), "due à la signature de la vente");
  assert.equal(dueLabel(conc, "location-lt"), "due à la signature du bail");
  assert.equal(dueLabel({ ...conc, dueOn: "acceptation" }, "location-lt"), "due dès que le contact est accepté");
});
