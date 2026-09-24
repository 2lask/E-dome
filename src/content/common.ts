/* ── Textes de la chrome de démonstration ───────────────────────────────────

   Ce qui entoure les écrans plutôt que ce qui les remplit : le bandeau-légende
   permanent, surtout. Écrit ici, pas en dur dans `app-shell`. */

export const demoBar = {
  /* La mention obligatoire, portée sur chaque écran. Elle passe d'une ligne de
     10 px à une hauteur lisible, et gagne deux voisins utiles : la légende des
     statuts et le sélecteur de rôle. */
  mention: "Maquette de démonstration",
  mentionHint: "Données d'exemple — rien ici n'est réel.",
  learnMore: "En savoir plus",
  learnMoreHref: "/demo",
  legendTitle: "Statuts",
} as const;
