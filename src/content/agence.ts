/* ── L'Espace agence ────────────────────────────────────────────────────────

   La principale source de revenu d'E-Dome, et la brique qui se construit pour
   de vrai — pas de gris dessus (plan, étape 6). Ce fichier porte l'agence de
   démonstration et les données de ses écrans. Comme partout, ce sont des
   exemples : une agence, ses demandes reçues, sa formule.

   La distribution des demandes suit le mécanisme de DECISIONS §2.3, vu ici
   du côté agence : des fiches ANONYMES, dans l'ordre chronologique, auxquelles
   l'agence postule avec quatre champs imposés. Elle ne reçoit jamais un
   contact ; c'est le particulier qui l'ouvre. */

export const demoAgency = {
  slug: "regie-du-leman",
  name: "Régie du Léman",
  city: "Lausanne",
  verified: true,
  since: "2019",
  members: 6,
  activeMandates: 14,
  plan: "vitrine" as const,
  tagline: "Vente et gérance sur l'arc lémanique, de Nyon à Vevey.",
} as const;

export const agencePage = {
  eyebrow: "Espace agence",
  hubSubtitle: "Vos mandats, votre équipe, les demandes de votre secteur et votre formule — au même endroit.",
  currentPlanLabel: "Votre formule",
  changePlan: "Changer de formule",
  publicPage: "Voir la page publique",

  /* Les fonctions de l'espace, chacune vers sa page. Le statut vient de la
     formule et du modèle : « attribution » et « mandats » demandent Mandats. */
  sections: [
    { key: "demandes", label: "Demandes d'accompagnement", hint: "Les fiches anonymes de votre secteur, à qui postuler.", href: "/agence/demandes", stage: "launch" },
    { key: "mandats", label: "Mandats", hint: "Les biens que vous gérez, du mandat à l'acte.", href: "/agence/mandats", stage: "launch" },
    { key: "equipe", label: "Équipe", hint: "Vos agents et leurs droits.", href: "/agence/equipe", stage: "launch" },
    { key: "statistiques", label: "Statistiques", hint: "Audience, conversions, délais de vente.", href: "/agence/statistiques", stage: "launch" },
    { key: "abonnement", label: "Abonnement", hint: "Votre formule et ce qu'elle inclut.", href: "/agence/abonnement", stage: "launch" },
    { key: "publique", label: "Page publique", hint: "Ce que voient les visiteurs de votre vitrine.", href: "/agence/regie-du-leman", stage: "launch" },
  ],

  demandes: {
    title: "Demandes d'accompagnement de votre secteur",
    subtitle:
      "Chaque fiche est anonyme, et arrive dans l'ordre où elle a été déposée — aucun classement payant. Vous postulez ; le particulier compare et ouvre le contact lui-même. Vous ne recevez ses coordonnées que s'il vous choisit.",
    fields: { type: "Bien", sector: "Secteur", budget: "Prix visé", posted: "Déposée" },
    applyCta: "Postuler",
    appliedLabel: "Candidature envoyée",
    applyNote: "Postuler est gratuit. Vous renseignez taux, inclus, délai et deux références — les quatre champs imposés.",
    items: [
      { id: "d1", type: "Appartement 4,5 p.", sector: "Lausanne — Sous-gare", budget: "≈ 1 250 000 CHF", posted: "il y a 1 h", applicants: 2 },
      { id: "d2", type: "Villa individuelle", sector: "Pully", budget: "≈ 2 400 000 CHF", posted: "il y a 4 h", applicants: 1 },
      { id: "d3", type: "Studio", sector: "Lausanne — Centre", budget: "≈ 380 000 CHF", posted: "il y a 9 h", applicants: 3 },
      { id: "d4", type: "Immeuble de rendement", sector: "Vevey", budget: "≈ 5 800 000 CHF", posted: "il y a 1 j", applicants: 0 },
    ],
  },

  abonnement: {
    title: "Votre abonnement",
    subtitle: "Ce que couvre votre formule, et comment en changer. Sans engagement, résiliable au mois.",
    currentTitle: "Formule active",
    includedTitle: "Ce qu'elle inclut",
    upgradeTitle: "Passer à une formule supérieure",
    upgradeHint: "Mandats ajoute l'équipe, les mandats, l'agenda des visites et le suivi des commissions.",
  },
} as const;

/* Équipe de démonstration, pour `/agence/equipe`. */
export const agencyTeam = [
  { id: "m1", name: "Claire Rochat", role: "Directrice", permissions: "Tous droits", mandates: 5 },
  { id: "m2", name: "Julien Favre", role: "Courtier", permissions: "Mandats, visites", mandates: 4 },
  { id: "m3", name: "Sofia Marchetti", role: "Courtière", permissions: "Mandats, visites", mandates: 3 },
  { id: "m4", name: "Dylan Perret", role: "Assistant", permissions: "Lecture, agenda", mandates: 0 },
  { id: "m5", name: "Nadia Berger", role: "Gérance", permissions: "Baux, décomptes", mandates: 2 },
  { id: "m6", name: "Marc Aubert", role: "Photographe interne", permissions: "Médias", mandates: 0 },
];

/* Mandats de démonstration, pour `/agence/mandats`. Le taux est CELUI DE
   L'AGENCE, affiché seulement : E-Dome ne touche rien dessus (Mandate.
   agencyCommission est display-only dans le modèle). */
export const agencyMandates = [
  { id: "M-014", bien: "Appartement 4,5 p. — Lausanne", agent: "Julien Favre", rate: "2,5 %", status: "En visite", stage: "visites" },
  { id: "M-013", bien: "Villa — Pully", agent: "Claire Rochat", rate: "3 %", status: "Offre reçue", stage: "offre" },
  { id: "M-011", bien: "Duplex — Montreux", agent: "Sofia Marchetti", rate: "2,8 %", status: "Sous compromis", stage: "compromis" },
  { id: "M-009", bien: "Studio — Vevey", agent: "Julien Favre", rate: "Forfait 9 000 CHF", status: "Mandat signé", stage: "mandat" },
];

/* Statistiques de démonstration, pour `/agence/statistiques`. */
export const agencyStats = {
  kpis: [
    { label: "Vues sur la vitrine (30 j)", value: "1 840" },
    { label: "Demandes reçues", value: "23" },
    { label: "Mandats signés (année)", value: "17" },
    { label: "Délai de vente médian", value: "6 semaines" },
  ],
  note: "Exemple de tableau de bord. Les chiffres décrivent l'agence de démonstration, pas E-Dome.",
};
