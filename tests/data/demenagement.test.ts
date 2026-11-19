import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

import { MOVE_SERVICES, isMoveService, SERVICE_LABEL } from "@/lib/demenagement";

test("D1 · les services du code et de la base sont les mêmes", () => {
  const sql = readFileSync("supabase/migrations/007_demenagement.sql", "utf8");
  for (const s of MOVE_SERVICES) assert.ok(sql.includes(`'${s.id}'`), s.id);
  assert.equal(isMoveService("nettoyage"), true);
  assert.equal(isMoveService("piscine"), false);
  assert.equal(SERVICE_LABEL.nettoyage, "Nettoyage de fin de bail");
});

test("D2 · le suivi est réservé à l'équipe, vérifié dans chaque action", () => {
  const src = readFileSync("src/lib/supabase/move-actions.ts", "utf8");
  assert.ok(src.includes("isAdminEmail"));
  const admin = src.slice(src.indexOf("export async function listAllMoveRequests"));
  assert.ok(admin.includes("adminOrNull()"));
  assert.ok(src.slice(src.indexOf("export async function setMoveRequestStatus")).includes("adminOrNull()"));
});
