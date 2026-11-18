/* ── Textes de la chrome de démonstration ───────────────────────────────────

   Ce qui entoure les écrans plutôt que ce qui les remplit : le bandeau-légende
   permanent, surtout. Écrit ici, pas en dur dans `app-shell`. */

export const demoBar = {
  /* La mention obligatoire, portée sur chaque écran. Elle passe d'une ligne de
     10 px à une hauteur lisible, et gagne deux voisins utiles : la légende des
     statuts et le sélecteur de rôle. */
  mention: "Maquette de démonstration",
  mentionHint: "Données d'exemple — rien ici n'est réel.",
  learnMore: "Comment ça marche",
  learnMoreHref: "/a-propos",
  legendTitle: "Statuts",
} as const;

/* ── Pôles hors périmètre du lancement V1 « E-Dome Pro » ─────────────────────

   La V1 se concentre sur l'espace professionnel (vitrine publique + annonces +
   copilote IA + abonnement). Les pôles ci-dessous existent dans la maquette
   mais ne font PAS partie du lancement : ils rejoignent E-Dome plus tard
   (roadmap V2→V5, voir `STRATEGIE.md` / `PLAN-V1.md`). On le dit honnêtement en
   haut de ces écrans plutôt que de les présenter comme des fonctions de
   lancement — l'honnêteté sur l'état d'une fonction prime. Textes éditables ici.

   La correspondance se fait par préfixe de route, donc les sous-routes
   (fiche, création) héritent de la même note. */

export const PARKED_POLE_NOTE_DEFAULT =
  "Aperçu de démonstration : ce pôle ne fait pas partie du lancement (V1 « E-Dome Pro », l'espace des professionnels de l'immobilier). Il rejoindra E-Dome plus tard. Rien ici n'est actif.";

/* Pivot 2026-11-18 (`MODELE.md`) : l'apport d'affaires est désormais le CŒUR du
   produit (plus parqué). Restent secondaires, et seulement eux : boutique, lives,
   événements. */
export const PARKED_POLES: readonly { prefix: string; label: string; note?: string }[] = [
  { prefix: "/boutique", label: "La boutique" },
  { prefix: "/live", label: "Les lives" },
  { prefix: "/evenements", label: "Les événements" },
] as const;
