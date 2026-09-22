/* Identifiants d'ancre des sections de la landing.

   Les liens de navigation de l'en-tête vivent dans `src/content/landing.ts`
   (clé `header.nav`) sous la forme `#le-projet`. Ces valeurs doivent rester
   alignées avec celles ci-dessous — c'est le seul endroit du code où les deux
   se rencontrent, d'où ce fichier plutôt que des chaînes dispersées. */

export const ANCHORS = {
  projet: "le-projet",
  pourQui: "pour-qui",
  roadmap: "ou-on-en-est",
  demo: "demo",
  /** Cible de tous les boutons d'appel à l'action. */
  form: "formulaire",
} as const;

export const FORM_HREF = `#${ANCHORS.form}`;
