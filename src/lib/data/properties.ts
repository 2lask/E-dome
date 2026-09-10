/* ── Biens immobiliers — SOURCE UNIQUE DE VÉRITÉ ─────────────────────────────

   Contrairement aux produits et aux événements, il existait déjà un jeu
   canonique riche : `lib/mock-data.properties` (prop1→prop14, avec `host`,
   `analytics`, `amenities`, coordonnées). Ce module ne le remplace pas, il en
   fait le point d'entrée unique et documenté.

   Ce qu'il corrige :

   1. `app/(app)/favoris/page.tsx` déclarait son propre tableau de 6 biens,
      dont les descriptions contredisaient le jeu canonique pour un MÊME
      identifiant : `prop2` y était « Appartement Vue Lac, Montreux,
      1 250 000 CHF » (vente) alors que le bien réel est « Studio meublé
      design au cœur de Genève, 120 CHF/nuit » (location courte durée).
      Ajouter un bien aux favoris depuis `/explorer` puis ouvrir `/favoris`
      affichait donc soit rien (prop6→prop14 absents du tableau local), soit
      un bien différent de celui qu'on avait aimé.

   2. `app/(app)/recherche/page.tsx` indexait des identifiants inventés
      (`B1`→`B8`) et pointait vers `/explorer/B1`, que la fiche ne résout pas.

   ── Ce qui n'est PAS unifié ici, et pourquoi ──
   `lib/dashboard-data.ts` et `lib/revenue-data.ts` définissent chacun leur
   propre notion de « bien » (`chalet-alpin`, `appart-vue-lac`…) avec des
   champs de pilotage (`monthRevenue`, `occupancy`, `weeklyPrice`) et non de
   catalogue. Les rapprocher n'est pas une correction de bug mais une décision
   de modélisation : côté Supabase, ces vues deviendront des agrégats calculés
   sur `properties` + `reservations`, pas un troisième catalogue. À traiter
   quand le schéma sera écrit.

   ── Migration Supabase ──
   Cible : `properties`, `property_media`, `property_analytics`, `profiles`
   (pour `host`). Les accesseurs ci-dessous sont la couture : ils gagneront des
   variantes `async` quand les pages passeront en Server Components. */

import { properties as CANONICAL_PROPERTIES, getPropertyById as findById } from "@/lib/mock-data";
import type { Property, TransactionType } from "@/lib/types";

export type { Property } from "@/lib/types";

/** Les biens du catalogue. */
export const PROPERTIES: Property[] = CANONICAL_PROPERTIES;

/* ── Accesseurs ──────────────────────────────────────────────────────────── */

export function listProperties(): Property[] {
  return PROPERTIES;
}

export function getPropertyById(id: string): Property | undefined {
  return findById(id);
}

export function listPropertyIds(): string[] {
  return PROPERTIES.map((p) => p.id);
}

/**
 * Résout une liste d'identifiants en biens, en ignorant silencieusement ceux
 * qui n'existent pas.
 *
 * C'est la fonction dont `/favoris` avait besoin : le contexte ne persiste que
 * des ids, et la page doit pouvoir les afficher sans supposer qu'ils
 * appartiennent à un sous-ensemble arbitraire. Un id devenu invalide (bien
 * retiré du catalogue) disparaît de la liste au lieu de casser le rendu.
 */
export function getPropertiesByIds(ids: Iterable<string>): Property[] {
  const out: Property[] = [];
  for (const id of ids) {
    const p = findById(id);
    if (p) out.push(p);
  }
  return out;
}

export function listPropertiesByTransaction(t: TransactionType): Property[] {
  return PROPERTIES.filter((p) => p.transactionType === t);
}

export function listFeaturedProperties(): Property[] {
  return PROPERTIES.filter((p) => p.featured);
}

/**
 * Recherche plein texte simple sur titre, ville, pays et type.
 *
 * Volontairement naïve — insensible à la casse et aux accents, sans
 * pondération. Elle remplace un index de résultats codés en dur dont les
 * identifiants ne résolvaient sur aucune fiche. Côté Supabase, à remplacer par
 * une recherche `tsvector` ou un index externe.
 */
export function searchProperties(query: string): Property[] {
  const q = normalize(query).trim();
  if (!q) return [];
  return PROPERTIES.filter((p) =>
    [p.title, p.location.city, p.location.country, p.type].some((field) =>
      normalize(field).includes(q),
    ),
  );
}

/** Minuscules sans diacritiques — « Genève » doit matcher « geneve ». */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    /* \u0300-\u036f = bloc « Combining Diacritical Marks ». Écrit en
       échappements plutôt qu'en caractères combinants littéraux, qui sont
       invisibles dans un éditeur et se perdent au copier-coller. */
    .replace(/[\u0300-\u036f]/g, "");
}

export { normalize as normalizeSearchTerm };
