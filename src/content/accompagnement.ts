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

  proposals: [
    {
      id: "p1",
      agency: "Régie du Léman",
      verified: true,
      rate: "2,5 % du prix de vente",
      included: ["Photos professionnelles", "Home staging virtuel", "Visites accompagnées", "Publication multi-portails"],
      timeline: "Estimation sous 48 h, mise en vente sous 1 semaine",
      references: ["Appartement 4,5 p. — Lausanne, vendu en 3 semaines", "Villa — Pully, vendue au prix demandé"],
      respondedAgo: "il y a 2 h",
    },
    {
      id: "p2",
      agency: "Alpes Immobilier",
      verified: true,
      rate: "3 % du prix de vente, dégressif au-delà de 1,5 M",
      included: ["Reportage photo + drone", "Annonce rédigée", "Visites 7j/7", "Négociation et suivi notaire"],
      timeline: "Mise en vente sous 10 jours",
      references: ["Chalet — Villars, vendu en 5 semaines", "Duplex — Montreux, vendu 4 % sous l'estimation"],
      respondedAgo: "il y a 5 h",
    },
    {
      id: "p3",
      agency: "Cardinal & Associés",
      verified: true,
      rate: "Forfait 12 000 CHF, quel que soit le prix",
      included: ["Photos", "Visites sur rendez-vous", "Accompagnement jusqu'à l'acte"],
      timeline: "Mise en vente sous 2 semaines",
      references: ["Maison — Nyon, vendue en 6 semaines", "Appartement — Morges, deux offres reçues"],
      respondedAgo: "il y a 1 j",
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
