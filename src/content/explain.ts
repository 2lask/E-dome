import type { FeatureStage } from "@/lib/model/feature";

/* ── Le mode explicatif ─────────────────────────────────────────────────────

   Ce que dit un élément quand on lui demande de s'expliquer. Deux emplois :

   1. Le panneau au clic sur un STATUT. Une fonctionnalité grise — « ensuite »,
      « vision » — n'est pas un cul-de-sac : on clique, elle dit ce qu'elle
      sera, pour qui, comment E-Dome gagne dessus, et quand. Les quatre
      questions sont celles de la Partie C du cahier des charges, dans cet
      ordre fixe. La quatrième — le revenu — est celle qui intéresse un
      investisseur, et c'est pour elle que le panneau existe.

   2. Le mode explicatif GLOBAL, un interrupteur du bandeau. Actif par défaut
      mais discret : il fait apparaître les affordances « ? » sans rien ouvrir.
      Une seule bulle ouverte à la fois, six puces par écran au plus — au-delà,
      ce n'est plus une explication, c'est une notice.

   Le contenu vit ici, pas dans les composants. */

export interface Explanation {
  /** Ce que c'est. */
  what: string;
  /** Pour qui. */
  who: string;
  /** Comment E-Dome gagne de l'argent dessus. */
  revenue: string;
  /** Quand — rattaché au statut. */
  when: string;
  /** Ce qui existe déjà à la place, pour qu'un élément gris ait un voisin utile. */
  insteadHref?: string;
  insteadLabel?: string;
}

export const explainMode = {
  toggleLabel: "Mode explicatif",
  toggleHint: "Affiche un « ? » sur les éléments qui peuvent s'expliquer.",
  /** Titres des quatre lignes du panneau, dans l'ordre de la Partie C. */
  fields: {
    what: "Ce que c'est",
    who: "Pour qui",
    revenue: "Ce qu'E-Dome y gagne",
    when: "Quand",
  },
  /** Libellé du statut, repris de stage-ui pour l'en-tête du panneau. */
  stageBadge: (stage: FeatureStage) => stage,
} as const;

/* Les sept pôles. Les trois « au lancement » expliquent surtout leur modèle de
   revenu ; les quatre « ensuite » disent ce qu'ils seront. */
export const POLE_EXPLAIN: Record<string, Explanation> = {
  biens: {
    what: "Publier et rechercher des biens à la vente ou à la location, avec une analyse de rentabilité sur chaque fiche.",
    who: "Propriétaires, agences, et toute personne qui cherche à acheter, louer ou réserver.",
    revenue: "Rien sur la vente ou la location d'un bien entre particuliers. Les professionnels démarrent gratuitement (plafond de biens généreux) et s'abonnent quand ils grandissent. Si un vendeur offre une prime de mise en relation à un apporteur, E-Dome en retient une part — à l'intérieur de la prime, jamais en plus.",
    when: "Au lancement.",
    insteadHref: "/explorer",
    insteadLabel: "Explorer les biens",
  },
  services: {
    what: "Trouver un photographe, un artisan, un home stager, et demander un devis.",
    who: "Propriétaires et agences qui préparent un bien ; prestataires qui proposent leurs services.",
    revenue: "Une commission de 5 à 10 % sur la prestation vendue via la plateforme, jamais ajoutée au prix payé.",
    when: "Au lancement.",
    insteadHref: "/services",
    insteadLabel: "Voir les services",
  },
  apporteurs: {
    what: "Recommander un bien ou une offre de la marketplace par un lien traçable, et voir son gain net avant de recommander.",
    who: "Quiconque a un réseau : un ancien client, un artisan, une voisine bien entourée. Le volet biens dépend du pays de l'apporteur ; la marketplace est ouverte partout.",
    revenue: "Deux mécaniques, jamais confondues. Biens : le vendeur offre une prime fixe en francs, payée quand il accepte le contact ; E-Dome en retient 12 % à l'intérieur. Marketplace : le vendeur reverse un pourcentage du prix, pris sur sa marge ; la commission d'E-Dome ne change pas. Abonnements apportés : une part de ce qu'encaisse E-Dome, 12 mois au plus. Jamais un supplément pour le client.",
    when: "Au lancement.",
    insteadHref: "/apporteurs",
    insteadLabel: "Le réseau d'apporteurs",
  },
  formations: {
    what: "Suivre ou publier des formations immobilières, avec progression et attestation.",
    who: "Créateurs qui vendent leur savoir ; particuliers et pros qui se forment.",
    revenue: "Une commission de 5 à 10 % sur chaque inscription payante. Tarif fondateur plus bas pour les trente premiers créateurs.",
    when: "Ensuite — après la marketplace et le réseau.",
    insteadHref: "/formations",
    insteadLabel: "Voir les formations",
  },
  evenements: {
    what: "Organiser et rejoindre salons, ateliers et rencontres, en présentiel ou en ligne.",
    who: "Agences et créateurs qui rassemblent leur communauté ; particuliers qui veulent apprendre en vrai.",
    revenue: "Une commission sur la billetterie, avec une part fixe par billet pour tenir sur les petits montants.",
    when: "Ensuite.",
    insteadHref: "/evenements",
    insteadLabel: "Voir les événements",
  },
  lives: {
    what: "Diffuser des visites et des sessions en direct, et retrouver les rediffusions.",
    who: "Agences, promoteurs et créateurs qui montrent un bien ou un savoir en direct.",
    revenue: "Une commission de 10 % sur les lives payants et les pourboires.",
    when: "Ensuite.",
    insteadHref: "/live",
    insteadLabel: "Voir les lives",
  },
  boutique: {
    what: "Une sélection de mobilier, matériaux et équipements de marchands partenaires, en affiliation : E-Dome recommande et redirige vers le marchand, qui vend, encaisse, livre et garantit. E-Dome ne vend pas, ne tient ni panier ni paiement.",
    who: "Qui rénove ou meuble un bien — et les marchands qui veulent être recommandés.",
    revenue: "Une rémunération d'affiliation payée par le marchand, convenue avec chacun, jamais ajoutée au prix de l'acheteur ; aucune commission marketplace. Le motif est fiscal (art. 20a LTVA) — voir les questions à l'avocat.",
    when: "Ensuite.",
    insteadHref: "/boutique",
    insteadLabel: "Voir la boutique",
  },
};
