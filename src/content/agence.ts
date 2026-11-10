/* ── L'Espace agence ────────────────────────────────────────────────────────

   La principale source de revenu d'E-Dome, et la brique qui se construit pour
   de vrai — pas de gris dessus (plan, étape 6). Ce fichier porte l'agence de
   démonstration et les données de ses écrans. Comme partout, ce sont des
   exemples : une agence, ses demandes reçues, sa formule.

   La distribution des demandes suit le mécanisme de DECISIONS §2.3, vu ici
   du côté agence : des fiches ANONYMES, dans l'ordre chronologique, auxquelles
   l'agence postule avec quatre champs imposés. Elle ne reçoit jamais un
   contact ; c'est le particulier qui l'ouvre. */

/* L'agence de démonstration est Hartmann Immobilier SA, dirigée par Jean-Luc
   Hartmann (casting). Ce fichier n'en porte que l'identité et les textes ; son
   équipe (de vraies personnes de l'annuaire), ses mandats et tous ses
   compteurs se dérivent dans `src/lib/demo/agency.ts`. */
export const demoAgency = {
  slug: "hartmann-immobilier",
  name: "Hartmann Immobilier SA",
  city: "Neuchâtel",
  verified: true,
  founded: "2006",
  since: "2026",
  plan: "vitrine" as const,
  tagline: "Vente, estimation et gérance sur le littoral neuchâtelois, jusqu'à La Gruyère et au Nord vaudois.",
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
    { key: "publique", label: "Page publique", hint: "Ce que voient les visiteurs de votre vitrine.", href: `/agence/${demoAgency.slug}`, stage: "launch" },
  ],

  demandes: {
    title: "Demandes d'accompagnement de votre secteur",
    subtitle:
      "Chaque fiche est anonyme, et arrive dans l'ordre où elle a été déposée — aucun classement payant. Vous postulez ; le particulier compare et ouvre le contact lui-même. Vous ne recevez ses coordonnées que s'il vous choisit.",
    fields: { type: "Bien", sector: "Secteur", budget: "Prix visé", posted: "Déposée" },
    applyCta: "Postuler",
    appliedLabel: "Candidature envoyée",
    applyNote: "Postuler ne coûte rien : la formule gratuite couvre un quota de candidatures actives, illimitées en payant. Vous renseignez taux, inclus, délai et deux références — les quatre champs imposés. Le particulier ne vous révèle son identité que s'il ouvre le contact.",
    items: [
      /* `ownerId` n'est JAMAIS affiché à l'agence : il sert seulement à
         notifier le particulier qu'une candidature est arrivée. Ici, Sandrine
         Monnier, qui vend son appartement depuis l'achat de sa villa. */
      { id: "d1", type: "Appartement 4,5 p.", sector: "Neuchâtel — Vauseyon", budget: "≈ 820 000 CHF", posted: "il y a 1 h", applicants: 2, ownerId: "user-011" },
      { id: "d2", type: "Villa individuelle", sector: "Marin-Epagnier", budget: "≈ 1 300 000 CHF", posted: "il y a 4 h", applicants: 1 },
      { id: "d3", type: "Studio", sector: "Neuchâtel — Centre", budget: "≈ 310 000 CHF", posted: "il y a 9 h", applicants: 3 },
      { id: "d4", type: "Immeuble de rendement", sector: "La Chaux-de-Fonds", budget: "≈ 3 200 000 CHF", posted: "il y a 1 j", applicants: 0 },
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

/* L'équipe et les mandats ne s'écrivent plus ici : ce sont de vraies
   personnes de l'annuaire et leurs vrais biens (`src/lib/demo/agency.ts`). */

/* Statistiques de démonstration, pour `/agence/statistiques`. */
export const agencyStats = {
  kpis: [
    { label: "Vues sur la vitrine (30 j)", value: "412" },
    { label: "Délai de vente médian", value: "6 semaines" },
  ],
  note: "Exemple de tableau de bord. Les chiffres décrivent l'agence de démonstration, pas E-Dome.",
};
