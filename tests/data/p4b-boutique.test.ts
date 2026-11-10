import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

import "@/lib/demo/invariants";
import * as derive from "@/lib/demo/derive";
import { LEDGER } from "@/lib/demo/ledger";
import { PROFILES } from "@/lib/demo/identity";
import { PRODUCTS } from "@/lib/data/products";
import { POLE_EXPLAIN } from "@/content/explain";

/* ── P4b — La boutique en affiliation ───────────────────────────────────────

   `DECISIONS-2.md` §D5, `DECISIONS.md` §1.8 (art. 20a LTVA) : E-Dome
   référence et redirige ; il ne vend pas, ne tient pas le checkout, ne
   garantit pas l'achat. Trois défauts de l'audit Mission 2 sont verrouillés
   ici : le journal créditait un non-marchand du chiffre d'affaires d'un
   produit tiers, les fiches portaient des avis « Achat vérifié » sans
   transaction, et l'interface annonçait une commission marketplace 4–8 %. */

const BOUTIQUE_FILES = [
  "src/app/(app)/boutique/page.tsx",
  "src/app/(app)/boutique/[id]/page.tsx",
  "src/app/(app)/boutique/vendre/page.tsx",
  "src/components/boutique/affiliation.tsx",
];

/** Le texte exécutable/rendu d'un fichier : commentaires retirés (ils
    racontent l'historique, ils ne s'affichent pas). */
function code(file: string): string {
  return readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

test("P4b-1 — aucun revenu boutique attribué à un non-marchand", () => {
  const boutique = LEDGER.filter((e) => e.source === "boutique" || e.subject.kind === "product");
  for (const e of boutique) {
    const p = PRODUCTS.find((x) => x.id === e.subject.id);
    assert.ok(p, `écriture ${e.id} sur un produit inconnu`);
    assert.equal(e.ownerId, p.vendorId, `écriture ${e.id} attribuée à ${e.ownerId}, pas au marchand ${p.vendorId}`);
  }
  // Aucun profil du journal n'est marchand : la boutique ne rapporte rien à personne ici.
  for (const prof of PROFILES) {
    assert.ok(!PRODUCTS.some((x) => x.vendorId === prof.ownerId), `${prof.ownerId} est marchand`);
    assert.equal(derive.total({ source: "boutique", ownerId: prof.ownerId }), 0, `revenu boutique chez ${prof.ownerId}`);
  }
  // Le cas exact de l'audit : b11 (« linen-house ») ne crédite plus l'utilisateur courant.
  assert.equal(LEDGER.filter((e) => e.subject.id === "b11").length, 0);
});

test("P4b-2 — aucun avis « achat vérifié » ni note produit sans transaction", () => {
  for (const p of PRODUCTS) {
    const rec = p as unknown as Record<string, unknown>;
    for (const k of ["rating", "reviews", "topRated", "sold", "vendorRating", "vendorReviews"]) {
      assert.ok(!(k in rec), `${p.id} porte encore « ${k} »`);
    }
  }
  for (const f of BOUTIQUE_FILES) {
    const src = code(f);
    assert.doesNotMatch(src, /achat v[ée]rifi[ée]/i, `${f} : badge « Achat vérifié »`);
    assert.doesNotMatch(src, /avis v[ée]rifi[ée]s/i, `${f} : « avis vérifiés »`);
    assert.doesNotMatch(src, /COMMON_REVIEWS|RATING_BREAKDOWN/, `${f} : avis génériques partagés`);
  }
  assert.match(code("src/app/(app)/boutique/[id]/page.tsx"), /Les avis sont sur le site du marchand/);
});

test("P4b-3 — aucune mention de commission marketplace ni de checkout E-Dome", () => {
  for (const f of BOUTIQUE_FILES) {
    const src = code(f);
    assert.doesNotMatch(src, /commission marketplace/i, `${f} : commission marketplace`);
    assert.doesNotMatch(src, /\d+\s*[–-]\s*\d+\s*%/, `${f} : fourchette de pourcentage`);
    assert.doesNotMatch(src, /\d+\s*%\s*indicatif/i, `${f} : pourcentage indicatif`);
    assert.doesNotMatch(src, /Passer commande|Acheter maintenant|Ajouter au panier|addToCart/, `${f} : checkout E-Dome`);
    assert.doesNotMatch(src, /Protection acheteur|Paiement sécurisé E-Dome/i, `${f} : garantie acheteur E-Dome`);
    assert.doesNotMatch(src, /validation par l.équipe E-Dome/i, `${f} : modération E-Dome comme vendeur`);
    assert.doesNotMatch(src, /href=\{?["'`]https?:/, `${f} : URL marchande fictive`);
  }
  const explain = POLE_EXPLAIN.boutique!;
  const text = `${explain.what} ${explain.revenue}`;
  assert.match(text, /affiliation/i);
  assert.match(text, /ne vend pas/i);
  assert.doesNotMatch(text, /\d\s*%/, "l'entrée boutique n'affiche aucun pourcentage");
});

test("P4b-4 — l'interstitiel dit qui vend et qui paie E-Dome", () => {
  const src = code("src/components/boutique/affiliation.tsx");
  assert.match(src, /Vous quittez E-Dome pour/);
  assert.match(src, /rémunéré par le marchand/);
  assert.match(src, /sans rien ajouter à votre prix/);
  assert.match(src, /garantie sont ceux du marchand/);
  assert.match(code("src/app/(app)/boutique/[id]/page.tsx"), /Voir chez le marchand/);
});
