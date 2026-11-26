import assert from "node:assert/strict";
import { test } from "node:test";

import { normalizeSource, withSource } from "@/lib/tracking";
import { liveVisitors, sourcesOf, type EventRow } from "@/lib/dashboard-stats";

test("SR1 · le paramètre src de nos partages prime, une valeur inconnue est ignorée", () => {
  assert.equal(normalizeSource("whatsapp", "facebook.com"), "whatsapp");
  assert.equal(normalizeSource("qr", ""), "qr");
  assert.equal(normalizeSource("<script>", "l.facebook.com"), "facebook", "valeur hors liste → on se rabat sur l'hôte");
  assert.equal(normalizeSource("__proto__", ""), "direct");
});

test("SR2 · l'hôte précédent est reconnu, notre domaine compte comme navigation interne", () => {
  assert.equal(normalizeSource(null, "www.google.ch"), "recherche");
  assert.equal(normalizeSource(null, "duckduckgo.com"), "recherche");
  assert.equal(normalizeSource(null, "lnkd.in"), "linkedin");
  assert.equal(normalizeSource(null, "t.co"), "x");
  assert.equal(normalizeSource(null, "web.whatsapp.com"), "whatsapp");
  assert.equal(normalizeSource(null, "mail.google.com"), "email", "le webmail Google n'est pas une recherche");
  assert.equal(normalizeSource(null, "edome-demo.vercel.app", "edome-demo.vercel.app"), "e-dome");
  assert.equal(normalizeSource(null, "exemple.org"), "autre");
  assert.equal(normalizeSource(undefined, undefined), "direct");
});

test("SR3 · withSource ajoute src sans perdre le code d'apporteur", () => {
  const u = withSource("https://e-dome.ch/explorer/abc?ref=abcd2345", "qr");
  assert.equal(new URL(u).searchParams.get("ref"), "abcd2345");
  assert.equal(new URL(u).searchParams.get("src"), "qr");
  assert.equal(new URL(withSource(u, "whatsapp")).searchParams.getAll("src").length, 1);
});

const ev = (source: string | null | undefined, minutesAgo: number, visitor = "v"): EventRow => ({
  property_id: "p", kind: "vue", link_id: null, visitor, created_at: new Date(NOW - minutesAgo * 60_000).toISOString(), source,
});
const NOW = Date.parse("2026-11-26T12:00:00Z");

test("SR4 · répartition des sources : anciennes vues sans source écartées", () => {
  assert.equal(sourcesOf([ev(undefined, 1), ev(null, 2)]), null, "aucune source connue → l'écran explique que le suivi démarre");
  const s = sourcesOf([ev("whatsapp", 1), ev("whatsapp", 2), ev("qr", 3), ev(null, 4)]);
  assert.deepEqual(s?.map((x) => [x.key, x.value, x.pct]), [["whatsapp", 2, 67], ["qr", 1, 33]]);
  assert.equal(s?.[0].label, "WhatsApp");
});

test("SR5 · « en ce moment » = visiteurs distincts des 5 dernières minutes", () => {
  assert.equal(liveVisitors([ev("qr", 1, "a"), ev("qr", 2, "a"), ev("qr", 4, "b"), ev("qr", 9, "c")], NOW), 2);
  assert.equal(liveVisitors([], NOW), 0);
});
