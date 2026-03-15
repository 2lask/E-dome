// =============================================================================
// E-Dome — Fichier de contenu centralisé
// Toutes les sections du site importent depuis ce fichier unique.
// =============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Brand {
  name: string;
  tagline: string;
  mission: string;
  valueProp: string;
  vision: string;
}

export interface PainPoint {
  id: number;
  title: string;
  description: string;
}

export interface Pillar {
  id: number;
  title: string;
  features: string[];
}

export interface UserProfile {
  id: number;
  role: string;
  description: string;
}

export interface RevenueSource {
  name: string;
  share: string;
  details: string[];
}

export interface MarketStat {
  label: string;
  value: string;
}

export interface ValidationItem {
  label: string;
  value: string;
}

export interface FinancialMilestone {
  label: string;
  value: string;
}

export interface RoadmapPhase {
  period: string;
  description: string;
}

export interface LegalPoint {
  text: string;
}

export interface QualificationBenefit {
  text: string;
}

export interface QualificationStep {
  step: number;
  label: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface HeroBadge {
  id: number;
  title: string;
  description: string;
}

export interface CompetitiveEdge {
  text: string;
}

// ---------------------------------------------------------------------------
// BRAND
// ---------------------------------------------------------------------------

export const brand: Brand = {
  name: "E-Dome",
  tagline:
    "La Première Plateforme Qui Combine Marketplace Immobilier & Réseau Social",
  mission:
    "Révolutionner l'immobilier en créant la première plateforme qui combine de manière unique une marketplace transactionnelle (ventes & locations) avec un réseau social professionnel engageant.",
  valueProp:
    "Réduisez vos coûts de 40 à 60 % grâce à une visibilité organique gratuite et un écosystème complet de services intégrés.",
  vision:
    "Devenir le leader mondial de l'immobilier social.",
};

// ---------------------------------------------------------------------------
// PROBLEMS — 4 points de douleur
// ---------------------------------------------------------------------------

export const problems: PainPoint[] = [
  {
    id: 1,
    title: "Commissions Élevées",
    description:
      "Airbnb prélève 14-18 %, Booking 15-25 %. Les professionnels perdent jusqu'à 20 % de leur chiffre d'affaires en commissions.",
  },
  {
    id: 2,
    title: "Dépendance Totale",
    description:
      "Zéro contrôle sur vos clients, algorithmes opaques, risque de suspension de compte à tout moment.",
  },
  {
    id: 3,
    title: "Visibilité Payante Obligatoire",
    description:
      "Google Ads : 500-2 000 CHF/mois, boost publicitaire : 200-800 CHF/mois. Sans budget, vous êtes invisible.",
  },
  {
    id: 4,
    title: "Apporteurs d'Affaires = Cauchemar",
    description:
      "Aucun suivi transparent, calculs manuels, litiges fréquents. Un système source de conflits permanents.",
  },
];

// ---------------------------------------------------------------------------
// 5 PILIERS — La Solution E-Dome
// ---------------------------------------------------------------------------

export const pillars: Pillar[] = [
  {
    id: 1,
    title: "Réseau Social Immobilier",
    features: [
      "Profils utilisateurs (9 types)",
      "Publication de contenu (photos, vidéos, reels, carrousels)",
      "Algorithme de fil d'actualité",
      "Visibilité organique gratuite",
      "Abonnements, likes, commentaires, sauvegardes",
      "Lives, événements, séminaires",
    ],
  },
  {
    id: 2,
    title: "Marketplace & Transactions",
    features: [
      "Tous types de biens (appartements, villas, maisons, hôtels, condos, terrains, projets neufs)",
      "Annonces complètes avec photos HD, vidéos, calendrier, carte interactive",
      "Données investisseur (ROI, projections)",
      "Location courte durée, longue durée et vente",
    ],
  },
  {
    id: 3,
    title: "Système Apporteurs & Commissions",
    features: [
      "Activation/désactivation des apporteurs par bien",
      "Lien de parrainage public ou sur invitation",
      "Suivi automatique des commissions",
      "Tableau de bord en temps réel",
      "Paiements automatiques",
      "Zéro coût supplémentaire pour l'hôte",
    ],
  },
  {
    id: 4,
    title: "Services & Options Payantes",
    features: [
      "Champagne à l'arrivée",
      "Décoration romantique",
      "Spa / massage",
      "Transport privé",
      "Chef privé",
      "Room service",
      "Activités locales",
      "Services sur mesure",
      "Achat direct sur la plateforme avec commission automatique",
    ],
  },
  {
    id: 5,
    title: "Formations, Lives & Événements",
    features: [
      "Vente de formations et coaching",
      "Lives, séminaires, replays",
      "Communauté professionnelle",
      "Monétisation directe pour les formateurs et coachs",
    ],
  },
];

// ---------------------------------------------------------------------------
// PROFILS UTILISATEURS — 9 rôles (un compte, plusieurs rôles)
// ---------------------------------------------------------------------------

export const userProfiles: UserProfile[] = [
  { id: 1, role: "Particulier", description: "Locataires et acheteurs" },
  { id: 2, role: "Hôte", description: "Propriétaires de biens" },
  { id: 3, role: "Hôtel", description: "Opérateurs hôteliers" },
  { id: 4, role: "Agence immobilière", description: "Agences immobilières" },
  { id: 5, role: "Agent immobilier", description: "Agents indépendants" },
  { id: 6, role: "Promoteur", description: "Promoteurs et constructeurs" },
  {
    id: 7,
    role: "Apporteur d'affaires",
    description: "Affiliés et parrains",
  },
  { id: 8, role: "Investisseur", description: "Investisseurs immobiliers" },
  {
    id: 9,
    role: "Formateur / Coach",
    description: "Formateurs et coachs professionnels",
  },
];

// ---------------------------------------------------------------------------
// MONÉTISATION — 4 sources de revenus
// ---------------------------------------------------------------------------

export const revenueSources: RevenueSource[] = [
  {
    name: "Commissions sur transactions",
    share: "70 %",
    details: [
      "Location courte durée : 10-15 %",
      "Location longue durée : 10-15 % du premier mois",
      "Ventes : 2-4 %",
    ],
  },
  {
    name: "Options & services payants",
    share: "15 %",
    details: ["Commission de 10-20 % sur les services additionnels"],
  },
  {
    name: "Formations & événements",
    share: "10 %",
    details: [
      "15-30 % sur les formations",
      "10-15 % sur les événements",
    ],
  },
  {
    name: "Abonnements Premium",
    share: "5 % → 15 %",
    details: ["Agences : 99-299 CHF/mois"],
  },
];

// ---------------------------------------------------------------------------
// OPPORTUNITÉ DE MARCHÉ
// ---------------------------------------------------------------------------

export const marketStats: MarketStat[] = [
  {
    label: "Marché mondial PropTech",
    value: "15,3 Md$ (2024) → 32,8 Md$ (2030), TCAC 13,7 %",
  },
  {
    label: "Location courte durée",
    value: "113 Md$ (2024) → 193 Md$ (2029)",
  },
  {
    label: "Commerce social",
    value: "992 Md$ (2023) → 2 900 Md$ (2030)",
  },
  {
    label: "Marketing d'affiliation",
    value: "17 Md$ (2023) → 27,8 Md$ (2030)",
  },
  {
    label: "Transactions immobilières en ligne",
    value: "78 % des transactions commencent en ligne",
  },
  {
    label: "Découverte via réseaux sociaux",
    value: "64 % des millennials découvrent des biens via les réseaux sociaux",
  },
  {
    label: "Croissance du parrainage",
    value: "+34 % par an depuis 2020",
  },
  {
    label: "Marché immobilier suisse (TAM)",
    value: "15 Md CHF/an",
  },
];

// ---------------------------------------------------------------------------
// VALIDATION & TRACTION
// ---------------------------------------------------------------------------

export const validation: ValidationItem[] = [
  { label: "Entretiens terrain réalisés", value: "50+" },
  { label: "Taux de validation du problème", value: "85 %" },
  {
    label: "Lettres d'engagement signées",
    value: "30 membres fondateurs représentant 350+ biens",
  },
  { label: "GMV potentiel mensuel", value: "800K – 1,2M CHF" },
];

// ---------------------------------------------------------------------------
// PROJECTIONS FINANCIÈRES
// ---------------------------------------------------------------------------

export const financialMilestones: FinancialMilestone[] = [
  {
    label: "Investissement Seed",
    value: "500 000 € (MVP + marché pilote)",
  },
  {
    label: "Série A (Année 2)",
    value: "3-5 M€ (expansion + équipe)",
  },
  {
    label: "Valorisation Année 3",
    value: "80-120 M€",
  },
];

export const roadmap: RoadmapPhase[] = [
  { period: "M1 – M4", description: "MVP" },
  {
    period: "M5 – M8",
    description: "Paiements + apporteurs + tableau de bord",
  },
  {
    period: "M9 – M12",
    description: "Formations + événements + optimisation",
  },
];

// ---------------------------------------------------------------------------
// JURIDIQUE & CONFORMITÉ
// ---------------------------------------------------------------------------

export const legalPoints: LegalPoint[] = [
  { text: "Positionnement en tant qu'intermédiaire technologique pur" },
  { text: "Conformité RGPD et LPD suisse" },
  { text: "KYC pour les rôles sensibles et les flux financiers" },
  { text: "Paiements certifiés PCI-DSS (via Stripe)" },
  { text: "Calcul automatique et traçabilité des commissions" },
];

// ---------------------------------------------------------------------------
// PROGRAMME DE QUALIFICATION — Membres Fondateurs
// ---------------------------------------------------------------------------

export const qualificationBenefits: QualificationBenefit[] = [
  { text: "Aucun engagement financier, aucun contrat" },
  { text: "Qualification du profil avant le lancement" },
  { text: "Accès anticipé à la version bêta de la plateforme" },
  { text: "Badge « Membre Fondateur » sur votre profil" },
  { text: "Support prioritaire" },
  { text: "Conditions de parrainage boostées au lancement" },
  { text: "Voix stratégique dans les décisions produit" },
  { text: "Accès au réseau exclusif des membres fondateurs" },
];

export const qualificationSteps: QualificationStep[] = [
  { step: 1, label: "Manifester votre intérêt" },
  { step: 2, label: "Analyse de votre profil" },
  { step: 3, label: "Appel de présentation" },
  { step: 4, label: "Accès anticipé" },
];

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

export const faq: FAQItem[] = [
  {
    id: 1,
    question: "Qu'est-ce qu'E-Dome ?",
    answer:
      "E-Dome est la première plateforme qui combine réseau social + marketplace + système d'apporteurs d'affaires + services payants + formations dans un seul écosystème dédié à l'immobilier.",
  },
  {
    id: 2,
    question: "À qui s'adresse E-Dome ?",
    answer:
      "À tous les acteurs de l'immobilier : hôtes, agences, agents, promoteurs, apporteurs d'affaires, investisseurs, formateurs et particuliers.",
  },
  {
    id: 3,
    question: "Comment fonctionne le système d'apporteurs d'affaires ?",
    answer:
      "Chaque apporteur dispose d'un lien de suivi unique. Les commissions sont calculées automatiquement, affichées en temps réel sur un tableau de bord, et versées mensuellement dès que le solde atteint 50 CHF.",
  },
  {
    id: 4,
    question: "Quels types de contenu puis-je publier ?",
    answer:
      "Photos, vidéos, reels, carrousels, annonces de biens, formations, annonces d'événements — tout ce qui concerne l'immobilier.",
  },
  {
    id: 5,
    question: "La manifestation d'intérêt est-elle engageante ?",
    answer:
      "Non. Aucun engagement financier, aucun contrat, aucune contrainte. C'est entièrement libre.",
  },
  {
    id: 6,
    question: "Que signifie la qualification ?",
    answer:
      "C'est une analyse de votre profil et de vos besoins afin de vous proposer les fonctionnalités les plus adaptées dès le lancement.",
  },
  {
    id: 7,
    question: "Comment les paiements sont-ils gérés ?",
    answer:
      "Via Stripe Connect avec répartition automatique, 3D Secure et conformité PCI-DSS.",
  },
  {
    id: 8,
    question:
      "Qu'est-ce qui différencie E-Dome des plateformes existantes ?",
    answer:
      "E-Dome est la seule plateforme combinant les 5 écosystèmes, avec des commissions 40-60 % moins chères, une visibilité organique gratuite et un suivi transparent des affiliations.",
  },
  {
    id: 9,
    question: "La plateforme est-elle internationale ?",
    answer:
      "Oui, E-Dome est conçue pour être internationale dès le premier jour, en commençant par la Suisse puis en s'étendant progressivement.",
  },
  {
    id: 10,
    question: "Quand la plateforme sera-t-elle lancée ?",
    answer:
      "Le MVP est prévu dans 4 mois, la version complète entre le mois 7 et le mois 14.",
  },
];

// ---------------------------------------------------------------------------
// HERO BADGES
// ---------------------------------------------------------------------------

export const heroBadges: HeroBadge[] = [
  {
    id: 1,
    title: "Multi-Rôles",
    description: "Un compte, plusieurs rôles interchangeables",
  },
  {
    id: 2,
    title: "International",
    description: "Portée mondiale dès le premier jour",
  },
  {
    id: 3,
    title: "Commission Partagée",
    description: "Modèle de commission transparent et équitable",
  },
  {
    id: 4,
    title: "100 % Acteurs Immobiliers",
    description: "Dédié aux professionnels de l'immobilier",
  },
];

// ---------------------------------------------------------------------------
// AVANTAGES CONCURRENTIELS
// ---------------------------------------------------------------------------

export const competitiveEdges: CompetitiveEdge[] = [
  {
    text: "AUCUN concurrent direct ne combine les 5 piliers : Marketplace + Réseau Social + Apporteurs + Services + Formations",
  },
  {
    text: "Seule plateforme hybride : Transactions + Engagement viral",
  },
  {
    text: "Système d'affiliation transparent : avantage du premier entrant",
  },
  {
    text: "Commissions 40-60 % moins chères que les plateformes existantes",
  },
  {
    text: "Écosystème complet : 4 sources de revenus contre 1 chez les concurrents",
  },
];
