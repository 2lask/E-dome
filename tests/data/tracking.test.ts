import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

import { isRefCode, isTrackKind, newRefCode, parseRefCookie, withRef } from "@/lib/tracking";

const P1 = "11111111-1111-4111-8111-111111111111";
const P2 = "22222222-2222-4222-8222-222222222222";

test("T1 · codes de lien : 8 caractères sans ambiguïté, validés", () => {
  for (let i = 0; i < 50; i++) {
    const c = newRefCode();
    assert.ok(isRefCode(c), c);
    assert.ok(!/[01lo]/.test(c), `caractère ambigu dans ${c}`);
  }
  assert.equal(isRefCode("ABC12345"), false);
  assert.equal(isRefCode("x'; drop"), false);
});

test("T2 · cookie d'attribution : lecture tolérante, un code par bien", () => {
  assert.deepEqual(parseRefCookie(undefined), {});
  assert.deepEqual(parseRefCookie("pas-du-json"), {});
  const c = withRef({}, P1, "abcd2345");
  assert.deepEqual(parseRefCookie(c), { [P1]: "abcd2345" });
  const c2 = withRef(parseRefCookie(c), P2, "zzzz9999");
  assert.deepEqual(parseRefCookie(c2), { [P1]: "abcd2345", [P2]: "zzzz9999" });
  assert.deepEqual(parseRefCookie(encodeURIComponent(JSON.stringify({ nope: "abcd2345", [P1]: "BAD" }))), {});
});

test("T3 · seuls les événements prévus sont acceptés", () => {
  assert.ok(isTrackKind("vue") && isTrackKind("partage") && isTrackKind("video"));
  assert.equal(isTrackKind("lead"), false, "un lead naît côté serveur, jamais du navigateur");
  assert.equal(isTrackKind("admin"), false);
});

test("T4 · vie privée : la route de suivi ne stocke jamais l'adresse IP", () => {
  const src = readFileSync("src/app/api/track/route.ts", "utf8");
  assert.ok(!/x-forwarded-for|req\.ip|remoteAddress/i.test(src));
  assert.ok(src.includes("randomUUID"));
});

test("T5 · l'attribution est réservée au serveur", () => {
  const src = readFileSync("src/lib/supabase/apport-server.ts", "utf8");
  assert.ok(src.startsWith('import "server-only"'));
  assert.ok(src.includes("link.apporteur_id === sellerId"), "le vendeur n'est pas son propre apporteur");
});
