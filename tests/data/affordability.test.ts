import assert from "node:assert/strict";
import { test } from "node:test";

import { affordability } from "@/lib/affordability";
import { listingText } from "@/lib/diffusion";

test("A1 · exemple publié par UBS : 1 M, 20 % de fonds propres → ~180'000 de revenu", () => {
  const a = affordability(1_000_000, 200_000, 180_000);
  assert.equal(a.loan, 800_000);
  assert.equal(a.annualCost, 60_000, "40'000 d'intérêts théoriques + 10'000 d'amortissement + 10'000 de frais");
  assert.equal(a.requiredIncome, 180_000);
  assert.equal(a.equityOk, true);
  assert.equal(a.incomeOk, true);
  assert.equal(a.costShare, 33.3);
});

test("A2 · fonds propres insuffisants, revenu trop bas", () => {
  const a = affordability(1_490_000, 150_000, 120_000);
  assert.equal(a.equityOk, false);
  assert.equal(a.requiredEquity, 298_000);
  assert.equal(a.incomeOk, false);
});

test("A3 · revenu non saisi : pas de verdict sur le revenu ; fonds propres plafonnés au prix", () => {
  const a = affordability(500_000, 900_000, 0);
  assert.equal(a.incomeOk, null);
  assert.equal(a.loan, 0);
  assert.equal(a.equityShare, 1);
});


test("K1 · kit de diffusion : texte prêt à coller avec prix, faits et lien E-Dome", () => {
  const t = listingText({ title: "Attique vue lac", city: "Neuchâtel", price: 1_490_000, transactionType: "vente", area: 168, bedrooms: 3, description: " Belle terrasse. " }, "https://edome-demo.vercel.app/explorer/x");
  assert.match(t, /^Attique vue lac\nCHF 1'490'000 · À vendre · Neuchâtel · 168 m² · 3 chambres\n\nBelle terrasse\.\n/);
  assert.match(t, /Photos, vidéo et demande de visite : https:\/\/edome-demo\.vercel\.app\/explorer\/x/);
  const r = listingText({ title: "Studio", city: "Lausanne", price: 1_250, transactionType: "location-lt", area: 0, bedrooms: 0, description: "" }, "u");
  assert.match(r, /CHF 1'250 \/ mois · À louer · Lausanne\n/);
});
