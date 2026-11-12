import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

import { properties } from "@/lib/mock-data";
import {
  citiesOf,
  nearbyCitiesIn,
  normalize,
  parseQuery,
  queryWithout,
  searchListings,
  suggestionsFor,
} from "@/lib/search/query";
import {
  estimateYield,
  grossYieldPct,
  priceUnit,
  rentBreakdown,
  roomsOf,
  similarListings,
  visitSlots,
} from "@/lib/explore/listing";
import { investorBook, opportunities } from "@/lib/explore/investor";
import { emptySession, recordEvent } from "@/lib/demo/session-store";
import { total } from "@/lib/demo/derive";
import { DEMO_TODAY } from "@/lib/demo/clock";
import { personaFor } from "@/content/roles";

/* ── Chantier P6b — location longue durée, investisseurs, recherche ───────── */

const CITIES = citiesOf(properties);
const parse = (q: string) => parseQuery(q, CITIES);
const ids = (q: string) => searchListings(properties, parse(q)).map((p) => p.id).sort();

// ─── Tokeniseur ──────────────────────────────────────────────────────────────

test("tokeniseur : « 3 pièces Lausanne moins de 2500 » → ville, pièces, budget, longue durée déduite", () => {
  const p = parse("3 pièces Lausanne moins de 2500");
  assert.deepEqual(p.filters.cities, ["Lausanne"]);
  assert.equal(p.filters.rooms, 3);
  assert.equal(p.filters.roomsExact, false);
  assert.equal(p.filters.priceMax, 2500);
  assert.equal(p.filters.transaction, "location-lt");
  assert.equal(p.filters.transactionInferred, true);
  assert.deepEqual(p.free, []);
});

test("tokeniseur : « chalet Verbier » → type + ville, et le chalet de Verbier sort", () => {
  const p = parse("chalet Verbier");
  assert.deepEqual(p.filters.kinds, ["chalet"]);
  assert.deepEqual(p.filters.cities, ["Verbier"]);
  assert.deepEqual(ids("chalet Verbier"), ["prop5"]);
});

test("tokeniseur : accents indifférents (Genève = geneve = GENEVE)", () => {
  for (const q of ["Genève", "geneve", "GENEVE", "genève"]) assert.deepEqual(parse(q).filters.cities, ["Genève"], q);
  assert.deepEqual(parse("Neuchatel").filters.cities, ["Neuchâtel"]);
  assert.deepEqual(parseQuery("evian", ["Évian-les-Bains"]).filters.cities, ["Évian-les-Bains"]);
  assert.deepEqual(parse("Yverdon").filters.cities, ["Yverdon-les-Bains"]);
});

test("tokeniseur : « 3,5 pièces » et « 3.5 p » sont exacts ; « 3 pièces » couvre 3 et 3,5", () => {
  for (const q of ["3,5 pièces", "3.5 p", "3,5 pces"]) {
    const f = parse(q).filters;
    assert.equal(f.rooms, 3.5, q);
    assert.equal(f.roomsExact, true, q);
  }
  const r = searchListings(properties, parse("3 pièces à louer"));
  assert.ok(r.length > 0);
  for (const p of r) assert.ok(roomsOf(p) === 3 || roomsOf(p) === 3.5, p.id);
});

test("tokeniseur : montants « moins de 2 500 », « max 2'500 », « < 2500 », « 1 M », « 800k »", () => {
  assert.equal(parse("moins de 2 500").filters.priceMax, 2500);
  assert.equal(parse("max 2'500").filters.priceMax, 2500);
  assert.equal(parse("max 2’500 CHF").filters.priceMax, 2500);
  assert.equal(parse("< 2500").filters.priceMax, 2500);
  assert.equal(parse("acheter moins de 1 M").filters.priceMax, 1_000_000);
  assert.equal(parse("maison max 800k").filters.priceMax, 800_000);
  assert.equal(parse("dès 1500").filters.priceMin, 1500);
  // Une surface n'est pas un budget.
  assert.equal(parse("Neuchâtel 80 m2").filters.priceMax, undefined);
});

test("tokeniseur : mots de transaction (louer / acheter / vacances)", () => {
  assert.equal(parse("louer Renens").filters.transaction, "location-lt");
  assert.equal(parse("appartement à louer").filters.transaction, "location-lt");
  assert.equal(parse("acheter à Morges").filters.transaction, "vente");
  assert.equal(parse("vacances Montreux").filters.transaction, "location-ct");
  assert.equal(parse("location courte durée Lausanne").filters.transaction, "location-ct");
  assert.equal(parse("vacances Montreux").filters.transactionInferred, undefined);
});

test("tokeniseur : les mots inconnus sont ignorés par les filtres", () => {
  const a = parse("3 pièces Lausanne");
  const b = parse("super 3 pièces Lausanne lumineux svp");
  assert.deepEqual(b.filters, a.filters);
  assert.deepEqual(b.free.sort(), ["lumineux", "super", "svp"]);
  assert.deepEqual(ids("Morges blabla"), ids("Morges"));
});

test("tokeniseur : budget seul → transaction déduite du montant", () => {
  assert.equal(parse("moins de 200").filters.transaction, "location-ct");
  assert.equal(parse("moins de 2000").filters.transaction, "location-lt");
  assert.equal(parse("moins de 900000").filters.transaction, "vente");
});

test("recherche : résultats cohérents avec chaque filtre, biens vendus exclus", () => {
  for (const q of ["3 pièces Lausanne moins de 2500", "4,5 pièces à louer Renens", "acheter Neuchâtel moins de 1 M", "vacances Montreux", "maison à vendre", "Genève"]) {
    const p = parse(q);
    for (const r of searchListings(properties, p)) {
      assert.equal(r.soldTo, undefined, `${q} → ${r.id} vendu`);
      if (p.filters.transaction) assert.equal(r.transactionType, p.filters.transaction, `${q} → ${r.id}`);
      if (p.filters.priceMax !== undefined) assert.ok(r.price <= p.filters.priceMax, `${q} → ${r.id}`);
      if (p.filters.cities.length) assert.ok(p.filters.cities.map(normalize).includes(normalize(r.location.city)), `${q} → ${r.id}`);
    }
  }
  assert.deepEqual(ids("4,5 pièces à louer Renens"), ["prop8"]);
  assert.deepEqual(ids("acheter Neuchâtel moins de 1 M"), ["prop15", "prop28"]);
});

test("recherche : retirer une puce rejoue la requête sans elle ; l'état vide propose des pistes", () => {
  const p = parse("3 pièces Lausanne moins de 2500");
  assert.equal(searchListings(properties, p).length, 0);
  const without = queryWithout(p, "city:lausanne");
  assert.ok(!/lausanne/i.test(without));
  assert.ok(searchListings(properties, parse(without)).length > 0);
  const sugg = suggestionsFor(properties, p, CITIES, nearbyCitiesIn(properties));
  assert.ok(sugg.length > 0);
  for (const s of sugg) assert.equal(searchListings(properties, parse(s.query)).length, s.count);
});

test("recherche : un bien publié pendant la session (sans coordonnées) sort dans les résultats", () => {
  let state = emptySession();
  state = recordEvent(state, "user-001", {
    kind: "listing.published",
    data: {
      title: "3,5 pièces test à Lausanne",
      description: "Annonce de test",
      type: "appartement",
      transactionType: "location-lt",
      price: 2300,
      currency: "CHF",
      city: "Lausanne",
      bedrooms: 2,
      bathrooms: 1,
      area: 75,
      images: [],
      amenities: [],
      openToReferrers: false,
    },
  }).state;
  return import("@/lib/demo/session-views").then(({ sessionListings }) => {
    const pool = [...sessionListings(state), ...properties];
    const r = searchListings(pool, parseQuery("3 pièces Lausanne moins de 2500", citiesOf(pool)));
    assert.equal(r.length, 1);
    assert.ok(r[0]!.id.startsWith("s-bien-"));
  });
});

// ─── Biens similaires ────────────────────────────────────────────────────────

test("similaires : TOUJOURS le même type de transaction, disponibles, jamais le bien lui-même", () => {
  for (const p of properties) {
    const sim = similarListings(p, properties);
    assert.ok(sim.length > 0, `${p.id} sans similaire`);
    for (const s of sim) {
      assert.equal(s.transactionType, p.transactionType, `${p.id} → ${s.id}`);
      assert.notEqual(s.id, p.id);
      assert.equal(s.soldTo, undefined);
    }
  }
  // Un appartement à l'année à Renens : pas un chalet à la nuit, des voisins vaudois.
  const renens = similarListings(properties.find((p) => p.id === "prop8")!, properties).map((s) => s.location.city);
  assert.deepEqual(renens.slice(0, 2), ["Prilly", "Vevey"]);
});

// ─── Location longue durée ───────────────────────────────────────────────────

test("longue durée : jamais de prix à la nuit, charges lues dans l'annonce", () => {
  assert.equal(priceUnit("location-lt"), " / mois");
  assert.equal(priceUnit("location-ct"), " / nuit");
  assert.equal(priceUnit("vente"), "");
  for (const p of properties.filter((x) => x.transactionType === "location-lt")) {
    assert.ok(!priceUnit(p.transactionType).includes("nuit"), p.id);
    const r = rentBreakdown(p)!;
    assert.equal(r.totalChf, p.price, p.id);
    assert.equal(r.netChf + (r.chargesChf ?? 0), p.price, p.id);
  }
  assert.deepEqual(rentBreakdown(properties.find((p) => p.id === "prop17")!), { totalChf: 2090, netChf: 1940, chargesChf: 150 });
  assert.equal(rentBreakdown(properties.find((p) => p.id === "prop5")!), null);
  // Le source de la fiche n'affiche plus « /nuit » pour la longue durée en dur.
  const src = readFileSync(new URL("../../src/app/(app)/explorer/[id]/page.tsx", import.meta.url), "utf8");
  assert.ok(!src.includes('"location-lt" && <span className="text-xs text-[var(--text-muted)]">/nuit'));
});

test("longue durée : créneaux de visite déterministes, après la date de démo, jamais un dimanche", () => {
  const a = visitSlots(DEMO_TODAY);
  assert.deepEqual(a, visitSlots(DEMO_TODAY));
  assert.ok(a.length >= 3);
  for (const s of a) {
    assert.ok(s.date > DEMO_TODAY.toISOString().slice(0, 10));
    assert.notEqual(new Date(`${s.date}T12:00:00Z`).getUTCDay(), 0);
  }
});

// ─── Rendement ───────────────────────────────────────────────────────────────

test("rendement brut = loyer annuel / prix", () => {
  assert.equal(grossYieldPct(36_000, 1_000_000), 3.6);
  assert.equal(grossYieldPct(24_000, 800_000), 3);
  assert.equal(grossYieldPct(0, 800_000), 0);
  assert.equal(grossYieldPct(10_000, 0), 0);
  for (const p of properties.filter((x) => x.transactionType === "vente")) {
    const e = estimateYield(p, properties);
    assert.ok(e, p.id);
    assert.ok(e.comparables.length > 0);
    for (const c of e.comparables) assert.equal(c.property.transactionType, "location-lt");
    assert.equal(e.pct, grossYieldPct(e.monthlyRentChf * 12, p.price), p.id);
    assert.ok(e.pct > 0.5 && e.pct < 10, `${p.id} : ${e.pct}`);
  }
  for (const p of properties.filter((x) => x.transactionType !== "vente")) assert.equal(estimateYield(p, properties), null);
});

// ─── Investisseurs ───────────────────────────────────────────────────────────

test("investisseurs : le portefeuille d'Ennio (user-003) est dérivé des données", () => {
  const book = investorBook("user-003", emptySession(), properties);
  const hosted = properties.filter((p) => p.host.id === "user-003" && !p.soldTo);
  const bought = properties.filter((p) => p.soldTo === "user-003");
  assert.equal(book.holdings, hosted.length + bought.length);
  assert.deepEqual(book.longTerm.map((l) => l.property.id).sort(), ["prop10", "prop17"]);
  assert.deepEqual(book.bought.map((l) => l.property.id), ["prop1"]);
  assert.deepEqual(book.forSale.map((l) => l.property.id), ["prop16"]);
  assert.equal(book.longTermRentRollYear, (1940 + 1990) * 12);
  assert.equal(book.shortTermGross12m, total({ ownerId: "user-003", source: "biens" }));
  assert.equal(book.shortTermSeries.reduce((s, m) => s + m.value, 0), book.shortTermGross12m);
  // Les opportunités : biens à vendre d'AUTRES personnes, triés par rendement.
  const opps = opportunities("user-003", properties);
  assert.ok(opps.length > 0);
  for (let i = 1; i < opps.length; i++) assert.ok(opps[i - 1]!.estimate.pct >= opps[i]!.estimate.pct);
  for (const o of opps) {
    assert.notEqual(o.property.host.id, "user-003");
    assert.equal(o.property.soldTo, undefined);
  }
});

test("investisseurs : les demandes de session et la formule Patrimoine se lisent dans le journal", () => {
  let state = emptySession();
  state = recordEvent(state, "user-006", {
    kind: "visit.requested",
    data: { toId: "user-003", propertyId: "prop17", subject: "Prilly", date: "2026-10-01", time: "18:00" },
  }).state;
  state = recordEvent(state, "user-003", { kind: "plan.changed", data: { holderId: "user-003", planId: "patrimoine" } }).state;
  const book = investorBook("user-003", state, properties);
  assert.equal(book.requests.visits, 1);
  assert.equal(book.planId, "patrimoine");
  assert.equal(investorBook("user-001", state, properties).planId, "aucune");
});

test("investisseurs : la page ne contient plus de KPI en dur, Ennio y accède depuis sa barre", () => {
  const src = readFileSync(new URL("../../src/app/(app)/investisseurs/page.tsx", import.meta.url), "utf8");
  for (const stale of ["250000", "8.2", "DEFAULT_KPIS", "GROWTH_DATA", "cal.com"]) assert.ok(!src.includes(stale), stale);
  assert.equal(personaFor("user-003")?.cta.href, "/investisseurs");
});
