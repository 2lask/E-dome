import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

import { formatIban, isValidIban, normalizeSwissMobile } from "@/lib/reglements";
import { apporteurNetChf } from "@/lib/my-property";

test("R1 · IBAN : clé de contrôle mod 97", () => {
  assert.equal(isValidIban("CH93 0076 2011 6238 5295 7"), true);
  assert.equal(isValidIban("CH9300762011623852957"), true);
  assert.equal(isValidIban("CH93 0076 2011 6238 5295 8"), false); // un chiffre faux
  assert.equal(isValidIban("CH93 0076 2011"), false);
  assert.equal(isValidIban("DE89 3704 0044 0532 0130 00"), true);
  assert.equal(formatIban("ch9300762011623852957"), "CH93 0076 2011 6238 5295 7");
});

test("R2 · TWINT : mobiles suisses seulement, normalisés", () => {
  assert.equal(normalizeSwissMobile("079 123 45 67"), "+41 79 123 45 67");
  assert.equal(normalizeSwissMobile("+41791234567"), "+41 79 123 45 67");
  assert.equal(normalizeSwissMobile("0041 76 555 44 33"), "+41 76 555 44 33");
  assert.equal(normalizeSwissMobile("032 123 45 67"), null); // fixe
  assert.equal(normalizeSwissMobile("12"), null);
});

test("R3 · la part E-Dome en base suit la même règle que le code", () => {
  const sql = readFileSync("supabase/migrations/008_reglements.sql", "utf8");
  assert.ok(sql.includes("greatest(round(gross * 100 * 0.12), 300)"));
  /* Réplique JS de edome_fee_chf, comparée à apporteurNetChf. */
  const fee = (g: number) => Math.min(Math.max(Math.round(g * 100 * 0.12), 300), Math.round(g * 100)) / 100;
  for (const g of [50, 99, 250, 1234, 1500, 3000]) assert.equal(g - fee(g), apporteurNetChf(g), `montant ${g}`);
});

test("R4 · transitions : payeur déclare, apporteur confirme — rien d'autre", () => {
  const sql = readFileSync("supabase/migrations/008_reglements.sql", "utf8");
  assert.ok(sql.includes("old.status = 'due' and new.status = 'declared' and auth.uid() = old.payer_id"));
  assert.ok(sql.includes("old.status = 'declared' and new.status in ('confirmed', 'disputed') and auth.uid() = old.payee_id"));
  assert.ok(sql.includes("transition non autorisée"));
  assert.ok(!/create policy[^;]*settlements[^;]*for insert/i.test(sql), "aucune insertion directe");
});

test("R5 · coordonnées de versement remises au seul payeur d'un règlement en cours", () => {
  const src = readFileSync("src/lib/supabase/settlement-actions.ts", "utf8");
  const fn = src.slice(src.indexOf("export async function getPayeeDetails"), src.indexOf("export async function getMyPayout"));
  assert.ok(fn.includes("s.payer_id !== user.id"));
  assert.ok(fn.includes(`["due", "declared"].includes(s.status)`));
});
