/* ── `/vendre/accompagnement` — la comparaison des propositions ──────────────

   Le mécanisme, confirmé comme condition de validité juridique et non comme
   positionnement (DECISIONS §2.3) : une agence ne reçoit jamais un contact.
   Elle voit une fiche ANONYME et y répond. L'identité du particulier ne bouge
   que par un acte de sa part — il ouvre le contact lui-même. C'est l'inverse
   d'un marché de leads, où la plateforme pousse une identité vers qui paie.

   Cinq temps ; cet écran montre le quatrième : le particulier compare les
   propositions. Chaque agence a postulé avec QUATRE CHAMPS IMPOSÉS — taux,
   inclus, délai, deux références locales — pour que la comparaison porte sur du
   comparable. Aucun paiement pour voir, aucun paiement pour postuler, aucune
   pondération par l'argent : l'ordre est chronologique. */

export interface AgencyProposal {
  id: string;
  agency: string;
  /** La personne de l'annuaire qui reçoit le contact quand le particulier
      l'ouvre : la conversation s'ouvre avec elle (moteur d'interactions). */
  contactId: string;
  /** Son nom et son rôle, affichés sous l'agence. */
  contactLabel: string;
  verified: boolean;
  /** Taux de commission proposé, en toutes lettres. */
  rate: string;
  /** Ce que l'agence inclut. */
  included: string[];
  /** Délai estimé. */
  timeline: string;
  /** Deux références locales imposées. */
  references: string[];
  /** Depuis quand la proposition est arrivée (ordre chronologique). */
  respondedAgo: string;
}

export const accompagnementPage = {
  eyebrow: "Vendre accompagné",
  title: "Comparez, puis ouvrez le contact vous-même",
  subtitle:
    "Votre bien a été présenté de façon anonyme aux agences vérifiées de votre secteur. Elles ont postulé ; vous choisissez. Tant que vous n'ouvrez pas le contact, aucune agence ne connaît votre identité.",

  /* La ligne qui rassure sur le sens de circulation. */
  privacyNote:
    "Aucune agence n'a reçu vos coordonnées. C'est vous qui décidez à qui les donner, et quand.",

  /* Les quatre champs imposés, dans l'ordre des colonnes. */
  fieldLabels: {
    rate: "Commission",
    included: "Inclus",
    timeline: "Délai estimé",
    references: "Références locales",
  },

  /* Les agences qui ont postulé sont celles du casting : Céline Bovard,
     agente indépendante à Lutry, et Hartmann Immobilier SA (Aline Tschanz,
     agente). Leurs références sont leurs vraies ventes (Lutry → Ennio,
     Hauterive → Sandrine). Deux réponses seulement : c'est précisément le cas
     où le rayon s'élargit (temps 5, plus bas). */
  proposals: [
    {
      id: "p1",
      agency: "Céline Bovard, agente indépendante",
      contactId: "user-002",
      contactLabel: "Céline Bovard · Lutry",
      verified: true,
      rate: "2,5 % du prix de vente",
      included: ["Photos et drone (Nikola Ristić)", "Home staging (Elena Currat)", "Visites accompagnées", "Publication multi-portails"],
      timeline: "Estimation sous 48 h, mise en vente sous une semaine",
      references: ["Appartement 4,5 p. vue lac — Lutry, vendu en 2026", "3,5 pièces — Morges, mandat en cours avec visite 3D"],
      respondedAgo: "il y a 2 h",
    },
    {
      id: "p2",
      agency: "Hartmann Immobilier SA",
      contactId: "user-004",
      contactLabel: "Aline Tschanz · agente, Neuchâtel",
      verified: true,
      rate: "3 % du prix de vente, dégressif au-delà de 1,5 M",
      included: ["Reportage photo", "Annonce rédigée", "Visites du lundi au samedi", "Négociation et suivi notaire"],
      timeline: "Estimation sous 72 h, mise en vente sous 10 jours",
      references: ["Villa individuelle — Hauterive, vendue en 2026", "Maison — Bulle, estimation en cours"],
      respondedAgo: "il y a 5 h",
    },
  ] satisfies AgencyProposal[],

  openContact: "Ouvrir le contact",
  openContactHint: "L'agence reçoit alors vos coordonnées, et vous les siennes. Vous signez un mandat directement avec elle.",

  /* Temps 5 : le rayon s'élargit si moins de trois réponses en 72 h. */
  widening: "Moins de trois réponses en 72 heures ? Votre demande s'ouvre automatiquement au secteur voisin.",

  rulesTitle: "Le rôle d'E-Dome s'arrête ici",
  rulesIntro:
    "E-Dome présente votre demande et affiche les propositions dans l'ordre où elles arrivent. Il ne signe aucun mandat, ne négocie aucun prix, et ne touche rien sur la commission de l'agence — que vous payez à elle, jamais à E-Dome.",
} as const;
