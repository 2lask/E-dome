/* ── Contenu de la landing page — SOURCE UNIQUE ──────────────────────────────

   Tous les textes de `/` et de `/merci` vivent ici. Aucun texte en dur dans
   les composants de `src/components/landing/`.

   Pour modifier la page, il suffit d'éditer ce fichier : titres, paragraphes,
   libellés de boutons, badges, statuts de la frise, questions du formulaire,
   options et tranches de réponse, FAQ, page de remerciement, métadonnées SEO.

   Deux conventions à respecter en éditant :

   1. **Aucun chiffre de traction.** Pas de nombre d'inscrits, pas de montants
      gagnés, pas de compteur. Le projet n'a pas encore de traction réelle et
      rien ne doit laisser croire le contraire.
   2. Toute promesse tarifaire ou contractuelle est marquée `À CONFIRMER`
      jusqu'à validation.

   Les icônes sont désignées par leur nom lucide-react (chaîne de caractères),
   résolu par les composants. Cela évite d'importer des composants React ici
   et garde le fichier purement déclaratif. */

/* ── Types ───────────────────────────────────────────────────────────────── */

/** Les six profils du formulaire et de la section « Pour qui ». */
export type ProfileId =
  | "agence"
  | "createur"
  | "prestataire"
  | "investisseur"
  | "proprietaire"
  | "equipe";

/** Disponibilité d'un pôle. Le libellé affiché vient de `poleBadges`. */
export type PoleAvailability = "launch" | "later";

/** Avancement d'une étape de la frise. */
export type RoadmapStatus = "done" | "inprogress" | "todo";

export type FieldType = "select" | "multiselect" | "text" | "textarea" | "url";

export interface Field {
  id: string;
  label: string;
  type: FieldType;
  /** Choix proposés pour `select` et `multiselect`. */
  options?: readonly string[];
  /** Champ facultatif (un seul par profil, d'après le brief). */
  optional?: boolean;
  placeholder?: string;
  /** Ajoute un champ libre « Autre » à la liste de choix. */
  allowOther?: boolean;
  /** Précision affichée sous le champ. */
  help?: string;
}

export interface Pole {
  id: string;
  label: string;
  description: string;
  icon: string;
  availability: PoleAvailability;
}

export interface AudienceProfile {
  id: ProfileId;
  label: string;
  benefit: string;
  icon: string;
}

export interface RoadmapStep {
  id: string;
  label: string;
  detail: string;
  status: RoadmapStatus;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface Engagement {
  id: string;
  label: string;
  /** Points ajoutés au score. Voir `src/lib/leads/score.ts`. */
  weight: number;
}

/* ── Identité et SEO ─────────────────────────────────────────────────────── */

export const site = {
  name: "E-Dome",
  /** Sert aux balises title/OG et au pied de page. */
  tagline: "L'écosystème professionnel de l'immobilier",
  seo: {
    title: "E-Dome — l'écosystème professionnel de l'immobilier",
    description:
      "E-Dome réunit en un seul endroit tout ce qu'un professionnel de l'immobilier utilise au quotidien : annonces, réseau, formations, événements, services et prestations. Projet en construction, lancement prévu en Suisse romande.",
    /** Image Open Graph. Remplacer le fichier, pas le chemin. */
    ogImage: "/landing/og.png",
    ogImageAlt: "E-Dome — l'écosystème professionnel de l'immobilier",
    locale: "fr_CH",
  },
} as const;

/* ── En-tête ─────────────────────────────────────────────────────────────── */

export const header = {
  /** Liens d'ancre. Les `href` doivent correspondre aux id de section. */
  nav: [
    { label: "Le projet", href: "#le-projet" },
    { label: "Pour qui", href: "#pour-qui" },
    { label: "Où on en est", href: "#ou-on-en-est" },
    { label: "Démo", href: "#demo" },
  ],
  cta: "Rejoindre les membres fondateurs",
  menuLabel: "Ouvrir le menu",
  menuCloseLabel: "Fermer le menu",
} as const;

/* ── Hero ────────────────────────────────────────────────────────────────── */

export const hero = {
  /** Mention d'état, visible et volontairement sobre. */
  status: "Projet en construction · Lancement prévu en Suisse romande",
  title: "Tout votre métier immobilier, au même endroit",
  subtitle:
    "Annonces, réseau professionnel, formations, événements, prestations : aujourd'hui, ces activités se répartissent sur une dizaine d'outils qui ne se parlent pas. E-Dome les réunit sur une seule plateforme.",
  ctaPrimary: "Rejoindre les membres fondateurs",
  ctaSecondary: "Explorer la démo",
  /** Précision sous les boutons. */
  ctaNote: "Deux minutes. Aucune carte bancaire, aucun engagement.",
  visualCaption: "Aperçu de la maquette interactive",
} as const;

/* ── Le problème ─────────────────────────────────────────────────────────── */

export const problem = {
  eyebrow: "Le constat",
  title: "Une dizaine d'outils qui ne communiquent pas",
  intro:
    "Un professionnel de l'immobilier jongle aujourd'hui entre des services conçus séparément, qu'il paie séparément et dont aucun ne connaît les autres.",
  points: [
    {
      id: "portails",
      title: "Les annonces d'un côté",
      body: "Les portails diffusent les biens mais ignorent qui vous êtes, ce que vous savez faire et qui vous recommande.",
      icon: "Building2",
    },
    {
      id: "reseaux",
      title: "La réputation ailleurs",
      body: "L'audience se construit sur les réseaux sociaux généralistes, où le contenu immobilier côtoie tout le reste et disparaît en quelques heures.",
      icon: "Share2",
    },
    {
      id: "outils",
      title: "Les outils métier dispersés",
      body: "Formation, billetterie, visioconférence, encaissement, facturation : autant d'abonnements distincts, à réconcilier à la main.",
      icon: "Layers",
    },
    {
      id: "recommandation",
      title: "La recommandation informelle",
      body: "L'apport d'affaires fonctionne au téléphone et de mémoire, sans traçabilité ni rémunération claire.",
      icon: "Handshake",
    },
  ],
} as const;

/* ── La solution ─────────────────────────────────────────────────────────── */

export const solution = {
  eyebrow: "La proposition",
  title: "Un réseau professionnel, et sept pôles qui reposent dessus",
  intro:
    "Au centre, un réseau social dédié à l'immobilier : profils vérifiés, publications, messagerie. Autour, les activités du métier, qui partagent la même identité et le même réseau.",
  /** Libellés des badges de disponibilité. Modifiables. */
  poleBadges: {
    launch: "Au lancement",
    later: "Ensuite",
  },
  poles: [
    {
      id: "biens",
      label: "Biens",
      description: "Publier et rechercher des biens à la vente ou à la location, avec analyse de rentabilité.",
      icon: "Home",
      availability: "launch",
    },
    {
      id: "services",
      label: "Services",
      description: "Trouver un photographe, un artisan, un architecte ou un home stager, et demander un devis.",
      icon: "Wrench",
      availability: "launch",
    },
    {
      id: "apporteurs",
      label: "Apporteurs",
      description: "Recommander un bien ou une prestation par un lien traçable, et être rémunéré pour l'apport.",
      icon: "Handshake",
      availability: "launch",
    },
    {
      id: "formations",
      label: "Formations",
      description: "Suivre ou publier des formations immobilières, avec progression et attestation.",
      icon: "GraduationCap",
      availability: "later",
    },
    {
      id: "evenements",
      label: "Événements",
      description: "Organiser et rejoindre salons, ateliers et rencontres, en présentiel ou en ligne.",
      icon: "CalendarDays",
      availability: "later",
    },
    {
      id: "lives",
      label: "Lives",
      description: "Diffuser des visites et des sessions en direct, et retrouver les rediffusions.",
      icon: "Radio",
      availability: "later",
    },
    {
      id: "boutique",
      label: "Boutique",
      description: "Acheter et vendre mobilier, matériaux et équipements entre professionnels et particuliers.",
      icon: "ShoppingBag",
      availability: "later",
    },
  ],
} as const satisfies { poles: readonly Pole[] } & Record<string, unknown>;

/* ── Pour qui ────────────────────────────────────────────────────────────── */

export const audience = {
  eyebrow: "Pour qui",
  title: "Six façons d'utiliser E-Dome",
  intro:
    "Dites-nous laquelle vous ressemble : le formulaire s'adapte et ne vous posera que les questions utiles.",
  /** Libellé du bouton qui préremplit le profil dans le formulaire. */
  cta: "C'est moi",
  profiles: [
    {
      id: "agence",
      label: "Agence ou agent immobilier",
      benefit:
        "Diffuser vos biens, mais aussi exister comme professionnel : profil, publications, recommandations et réseau au même endroit.",
      icon: "Building2",
    },
    {
      id: "createur",
      label: "Créateur, formateur ou coach",
      benefit:
        "Toucher une audience venue pour l'immobilier, et vendre vos formations sans assembler quatre outils.",
      icon: "GraduationCap",
    },
    {
      id: "prestataire",
      label: "Prestataire",
      benefit:
        "Être visible auprès de ceux qui ont un bien à préparer, à photographier ou à rénover, au moment où ils en ont besoin.",
      icon: "Wrench",
    },
    {
      id: "investisseur",
      label: "Investisseur",
      benefit:
        "Suivre les biens, les chiffres et les personnes qui comptent, dans un flux dédié plutôt qu'éparpillé.",
      icon: "TrendingUp",
    },
    {
      id: "proprietaire",
      label: "Propriétaire",
      benefit:
        "Vendre ou louer en gardant la main, avec accès direct aux prestataires et aux professionnels de votre région.",
      icon: "KeyRound",
    },
    {
      id: "equipe",
      label: "Rejoindre l'équipe",
      benefit:
        "Construire la plateforme depuis le début : développement, design, produit. Les rôles clés sont ouverts.",
      icon: "Users",
    },
  ],
} as const satisfies { profiles: readonly AudienceProfile[] } & Record<string, unknown>;

/* ── Où on en est ────────────────────────────────────────────────────────── */

export const roadmap = {
  eyebrow: "Où on en est",
  title: "L'état réel du projet",
  intro:
    "Autant le dire clairement : la plateforme n'est pas ouverte. Voici ce qui est fait et ce qui reste à faire.",
  /** Libellés des statuts. */
  statusLabels: {
    done: "Terminé",
    inprogress: "En cours",
    todo: "À venir",
  },
  steps: [
    {
      id: "maquette",
      label: "Maquette interactive",
      detail:
        "L'ensemble des parcours est navigable, sur données fictives. C'est ce que vous pouvez explorer dès maintenant.",
      status: "done",
    },
    {
      id: "equipe",
      label: "Constitution de l'équipe",
      detail: "Recherche des profils techniques et produit qui porteront la plateforme.",
      status: "inprogress",
    },
    {
      id: "fondateurs",
      label: "Membres fondateurs",
      detail:
        "Recueil des premiers engagements auprès des professionnels qui publieront au lancement.",
      status: "inprogress",
    },
    {
      id: "beta",
      label: "Bêta privée",
      detail: "Ouverture à un groupe restreint, sur données réelles, par vagues d'invitation.",
      status: "todo",
    },
    {
      id: "lancement",
      label: "Lancement en Suisse romande",
      detail: "Ouverture publique, d'abord sur le marché romand.",
      status: "todo",
    },
  ],
} as const satisfies { steps: readonly RoadmapStep[] } & Record<string, unknown>;

/* ── Démo ────────────────────────────────────────────────────────────────── */

export const demo = {
  eyebrow: "Voir par vous-même",
  title: "La maquette est ouverte, sans compte",
  body: "Parcourez les parcours réels de la plateforme : le fil, la recherche de biens, le tableau de bord, l'espace apporteurs. Rien n'est verrouillé.",
  /** Avertissement obligatoire : les données de la maquette sont fictives. */
  warning:
    "Toutes les données affichées sont fictives, y compris les biens, les prix, les profils et les chiffres. Rien n'y est réel.",
  cta: "Explorer la démo",
  /** Destination de la démo. */
  href: "/feed",
  visualCaption: "Le fil E-Dome dans la maquette",
} as const;

/* ── Membres fondateurs ──────────────────────────────────────────────────── */

export const founding = {
  eyebrow: "Membres fondateurs",
  title: "Ce que reçoivent les premiers",
  intro:
    "Les professionnels qui s'engagent maintenant façonnent la plateforme et y arrivent avant les autres.",
  perks: [
    {
      id: "beta",
      title: "Accès prioritaire à la bêta",
      body: "Vous entrez dans les premières vagues d'invitation, avant l'ouverture publique.",
      icon: "Rocket",
    },
    {
      id: "statut",
      title: "Statut fondateur sur votre profil",
      body: "Un marqueur permanent, visible par les autres membres, qui indique que vous étiez là au départ.",
      icon: "BadgeCheck",
    },
    {
      id: "voix",
      title: "Voix dans les choix produit",
      body: "Vous êtes consulté sur les priorités et les fonctionnalités avant qu'elles soient développées.",
      icon: "MessagesSquare",
    },
    {
      id: "accompagnement",
      title: "Mise en route accompagnée",
      body: "Reprise de vos annonces et de votre profil avec notre aide, pour ne pas repartir de zéro.",
      icon: "LifeBuoy",
    },
  ],
  /* À CONFIRMER — aucune promesse tarifaire ne doit être publiée avant
     validation du modèle économique. Exemple de formulation possible :
     « Conditions préférentielles maintenues après le lancement ». Laisser
     cette clé vide tant que ce n'est pas arbitré. */
  pricingNote: "",
} as const;

/* ── Formulaire ──────────────────────────────────────────────────────────── */

/** Les 26 cantons suisses, plus l'option hors de Suisse. */
export const CANTONS = [
  "Argovie",
  "Appenzell Rhodes-Extérieures",
  "Appenzell Rhodes-Intérieures",
  "Bâle-Campagne",
  "Bâle-Ville",
  "Berne",
  "Fribourg",
  "Genève",
  "Glaris",
  "Grisons",
  "Jura",
  "Lucerne",
  "Neuchâtel",
  "Nidwald",
  "Obwald",
  "Saint-Gall",
  "Schaffhouse",
  "Schwytz",
  "Soleure",
  "Tessin",
  "Thurgovie",
  "Uri",
  "Valais",
  "Vaud",
  "Zoug",
  "Zurich",
] as const;

/** Valeur du sélecteur de canton qui déclenche le champ « pays ». */
export const OUTSIDE_SWITZERLAND = "Hors de Suisse";

export const form = {
  eyebrow: "Manifester votre intérêt",
  title: "Dites-nous qui vous êtes",
  intro:
    "Trois étapes courtes. Nous demandons ce que vous faites aujourd'hui, pas ce que vous feriez peut-être : c'est ce qui nous permet de construire les bonnes fonctionnalités d'abord.",
  steps: [
    { id: "identite", label: "Vous", description: "Quatre champs" },
    { id: "activite", label: "Votre activité", description: "Selon votre profil" },
    { id: "engagement", label: "Votre engagement", description: "Facultatif" },
  ],
  /* Couche 1 — commune à tous. */
  identity: {
    firstName: { label: "Prénom", placeholder: "Votre prénom" },
    email: { label: "E-mail", placeholder: "vous@exemple.ch" },
    profile: {
      label: "Vous êtes",
      placeholder: "Choisissez votre profil",
    },
    canton: {
      label: "Canton ou région",
      placeholder: "Choisissez votre canton",
    },
    country: {
      label: "Pays",
      placeholder: "Votre pays de résidence",
    },
  },
  /* Couche 2 — questions par profil. Modifiez librement options et tranches. */
  profileQuestions: {
    agence: [
      {
        id: "biens_actifs",
        label: "Combien de biens avez-vous en portefeuille actuellement ?",
        type: "select",
        options: ["Aucun pour l'instant", "1 à 5", "6 à 20", "21 à 50", "Plus de 50"],
      },
      {
        id: "portails",
        label: "Quels portails utilisez-vous aujourd'hui ?",
        type: "multiselect",
        options: [
          "Homegate",
          "ImmoScout24",
          "Immostreet",
          "Newhome",
          "Acheter-Louer",
          "Mon propre site",
          "Aucun",
        ],
        allowOther: true,
      },
      {
        id: "budget_mensuel",
        label: "Votre budget mensuel actuel en portails et publicité",
        type: "select",
        options: [
          "Moins de 200 CHF",
          "200 à 500 CHF",
          "500 à 1 500 CHF",
          "1 500 à 5 000 CHF",
          "Plus de 5 000 CHF",
          "Je préfère ne pas répondre",
        ],
      },
      {
        id: "commentaire",
        label: "Ce qui vous coûte le plus de temps aujourd'hui",
        type: "textarea",
        optional: true,
        placeholder: "Facultatif — en une ou deux phrases",
      },
    ],
    createur: [
      {
        id: "reseau_principal",
        label: "Votre réseau principal",
        type: "select",
        options: ["Instagram", "LinkedIn", "YouTube", "TikTok", "Facebook", "Newsletter", "Podcast"],
        allowOther: true,
      },
      {
        id: "audience",
        label: "Taille de votre audience",
        type: "select",
        options: [
          "Moins de 500",
          "500 à 2 000",
          "2 000 à 10 000",
          "10 000 à 50 000",
          "Plus de 50 000",
        ],
      },
      {
        id: "outil_vente",
        label: "Comment vendez-vous vos contenus aujourd'hui ?",
        type: "select",
        options: [
          "Aucun, je ne vends pas encore",
          "Teachable, Podia ou équivalent",
          "Gumroad",
          "Mon propre site",
          "Paiement direct, sans plateforme",
        ],
        allowOther: true,
      },
      {
        id: "revenus_contenu",
        label: "Revenus mensuels issus de vos contenus",
        type: "select",
        optional: true,
        options: [
          "Aucun",
          "Moins de 500 CHF",
          "500 à 2 000 CHF",
          "2 000 à 10 000 CHF",
          "Plus de 10 000 CHF",
          "Je préfère ne pas répondre",
        ],
      },
    ],
    prestataire: [
      {
        id: "metier",
        label: "Votre métier",
        type: "select",
        options: [
          "Photographe",
          "Home stager",
          "Architecte",
          "Artisan ou entreprise du bâtiment",
          "Diagnostiqueur",
          "Déménageur",
          "Notaire ou juriste",
          "Gestion et conciergerie",
        ],
        allowOther: true,
      },
      {
        id: "zone",
        label: "Votre zone d'intervention",
        type: "text",
        placeholder: "Par exemple : Arc lémanique, canton de Neuchâtel",
      },
      {
        id: "acquisition",
        label: "Comment trouvez-vous vos clients aujourd'hui ?",
        type: "multiselect",
        options: [
          "Bouche-à-oreille",
          "Agences partenaires",
          "Réseaux sociaux",
          "Annuaires professionnels",
          "Mon propre site",
          "Publicité en ligne",
        ],
        allowOther: true,
      },
      {
        id: "commentaire",
        label: "Ce qui vous manque le plus pour développer votre activité",
        type: "textarea",
        optional: true,
        placeholder: "Facultatif",
      },
    ],
    investisseur: [
      {
        id: "biens_detenus",
        label: "Combien de biens détenez-vous ?",
        type: "select",
        options: ["Aucun, je commence", "1 à 2", "3 à 5", "6 à 15", "Plus de 15"],
      },
      {
        id: "recherche",
        label: "Que venez-vous chercher ?",
        type: "multiselect",
        options: [
          "Des biens à acquérir",
          "De la formation",
          "Un réseau de professionnels",
          "Des prestataires de confiance",
          "De l'analyse et des chiffres",
        ],
      },
      {
        id: "sources_info",
        label: "Où vous informez-vous aujourd'hui ?",
        type: "multiselect",
        options: [
          "Portails immobiliers",
          "Groupes privés et forums",
          "Réseaux sociaux",
          "Presse spécialisée",
          "Mon réseau personnel",
          "Courtiers et agences",
        ],
        allowOther: true,
      },
      {
        id: "commentaire",
        label: "Votre objectif pour les douze prochains mois",
        type: "textarea",
        optional: true,
        placeholder: "Facultatif",
      },
    ],
    proprietaire: [
      {
        id: "projet",
        label: "Votre projet",
        type: "select",
        options: ["Vendre", "Louer en longue durée", "Louer en courte durée", "Je me renseigne"],
      },
      {
        id: "horizon",
        label: "À quelle échéance ?",
        type: "select",
        options: [
          "Moins de 3 mois",
          "3 à 6 mois",
          "6 à 12 mois",
          "Plus de 12 mois",
          "Pas encore décidé",
        ],
      },
      {
        id: "agence",
        label: "Êtes-vous accompagné aujourd'hui ?",
        type: "select",
        options: [
          "Non, je gère seul",
          "Oui, par une agence",
          "Oui, par un courtier indépendant",
          "En cours de réflexion",
        ],
      },
      {
        id: "commentaire",
        label: "Votre bien en quelques mots",
        type: "textarea",
        optional: true,
        placeholder: "Facultatif — type, commune, particularités",
      },
    ],
    equipe: [
      {
        id: "role",
        label: "Le rôle qui vous intéresse",
        type: "select",
        options: [
          "CTO ou responsable technique",
          "Développement back-end",
          "Développement front-end",
          "Développement mobile",
          "Design produit et UI",
          "Produit et gestion de projet",
          "Croissance et marketing",
        ],
        allowOther: true,
      },
      {
        id: "technologies",
        label: "Vos technologies et outils",
        type: "textarea",
        placeholder: "Par exemple : TypeScript, React, Next.js, Postgres, Figma",
      },
      {
        id: "disponibilite",
        label: "Votre disponibilité",
        type: "select",
        options: ["Temps plein", "Temps partiel", "Soirs et week-ends", "À discuter"],
      },
      {
        id: "lien",
        label: "Votre LinkedIn, GitHub ou portfolio",
        type: "url",
        placeholder: "https://",
      },
      {
        id: "equity",
        label: "Une association avec participation au capital vous intéresse-t-elle ?",
        type: "select",
        options: ["Oui", "À discuter", "Non, je préfère une autre formule"],
      },
    ],
  },
  /* Couche 3 — niveau d'engagement. Les poids alimentent le score. */
  engagement: {
    title: "Jusqu'où voulez-vous aller avec nous ?",
    intro:
      "Facultatif, mais c'est ce qui nous aide le plus. Cochez ce qui vous correspond.",
    default: [
      { id: "appel", label: "D'accord pour un appel de 20 minutes", weight: 2 },
      { id: "beta", label: "Je veux tester la bêta privée", weight: 2 },
      {
        id: "publier",
        label: "Je m'engage à publier sur E-Dome au lancement (biens, formation, services…)",
        weight: 2,
      },
      { id: "lettre", label: "Je suis prêt à signer une lettre d'intérêt", weight: 5 },
      { id: "fondateur", label: "Je veux devenir membre fondateur", weight: 5 },
    ],
    equipe: [
      { id: "appel_decouverte", label: "D'accord pour un appel de découverte", weight: 2 },
      { id: "projet_test", label: "Prêt à réaliser un projet test de quelques semaines", weight: 2 },
      { id: "association", label: "Ouvert à une discussion sur une association", weight: 5 },
    ],
  },
  /* Consentement. */
  consent: {
    privacy: {
      label:
        "J'accepte que mes données soient traitées pour le suivi de ma manifestation d'intérêt, conformément à la politique de confidentialité.",
      linkLabel: "politique de confidentialité",
      linkHref: "/confidentialite",
    },
    newsletter: {
      label: "Je souhaite recevoir des nouvelles de l'avancement du projet.",
    },
  },
  /* Navigation et états. */
  actions: {
    next: "Continuer",
    back: "Retour",
    submit: "Envoyer",
    submitting: "Envoi…",
  },
  progressLabel: "Étape",
  /* Messages d'erreur. Doivent rester neutres et utiles. */
  errors: {
    firstName: "Indiquez votre prénom.",
    email: "Indiquez une adresse e-mail valide.",
    profile: "Choisissez le profil qui vous correspond.",
    canton: "Choisissez votre canton ou « Hors de Suisse ».",
    country: "Indiquez votre pays.",
    required: "Ce champ est nécessaire pour continuer.",
    url: "Indiquez une adresse commençant par http:// ou https://",
    consent: "Votre accord est nécessaire pour enregistrer votre demande.",
    generic:
      "L'envoi n'a pas abouti. Réessayez dans un instant — si le problème persiste, écrivez-nous.",
    rateLimited: "Plusieurs envois viennent d'être reçus depuis votre connexion. Patientez une minute.",
  },
} as const;

/* ── FAQ ─────────────────────────────────────────────────────────────────── */

export const faq = {
  eyebrow: "Questions",
  title: "Ce qu'on nous demande",
  items: [
    {
      id: "quoi",
      question: "Qu'est-ce qu'E-Dome exactement ?",
      answer:
        "Une plateforme qui réunit les activités d'un professionnel de l'immobilier : un réseau professionnel au centre, et autour, la diffusion de biens, les prestations de services, la formation, les événements et l'apport d'affaires. L'objectif est de remplacer une dizaine d'outils séparés par un seul.",
    },
    {
      id: "agence",
      question: "Êtes-vous une agence immobilière ?",
      answer:
        "Non. E-Dome est une plateforme technologique. Nous ne vendons ni ne louons de biens, nous ne sommes ni courtier ni agent immobilier, et nous n'intervenons pas dans les transactions entre les membres. Nous fournissons l'outil, la visibilité et les moyens de paiement.",
    },
    {
      id: "prix",
      question: "Les outils seront-ils payants ?",
      answer:
        "Le modèle n'est pas encore arrêté. L'intention est qu'une part reste gratuite, notamment la présence sur le réseau et la consultation, et que les fonctions professionnelles soient payantes. Rien n'est confirmé à ce stade, et nous ne demandons aucun paiement aujourd'hui. [À CONFIRMER]",
    },
    {
      id: "quand",
      question: "Quand la plateforme ouvre-t-elle ?",
      answer:
        "Aucune date n'est annoncée, et nous préférons ne pas en inventer une. La maquette est terminée, l'équipe est en constitution. La suite est une bêta privée par vagues d'invitation, puis une ouverture en Suisse romande. Les membres fondateurs sont prévenus en premier.",
    },
    {
      id: "donnees",
      question: "Que faites-vous de mes données ?",
      answer:
        "Elles servent uniquement à vous recontacter et à comprendre les besoins des premiers utilisateurs. Elles ne sont ni vendues ni cédées à des tiers à des fins publicitaires. Vous pouvez demander leur consultation, leur correction ou leur suppression à tout moment. Le détail figure dans la politique de confidentialité.",
    },
    {
      id: "equipe",
      question: "Comment rejoindre l'équipe ?",
      answer:
        "Choisissez « Rejoindre l'équipe » dans le formulaire. Les questions portent sur votre rôle, vos technologies, votre disponibilité et votre intérêt éventuel pour une association. Les rôles techniques et produit sont ouverts.",
    },
  ],
} as const satisfies { items: readonly FaqItem[] } & Record<string, unknown>;

/* ── Pied de page ────────────────────────────────────────────────────────── */

export const footer = {
  /* À COMPLÉTER — adresse de contact définitive. */
  contactLabel: "Nous écrire",
  contactEmail: "contact@e-dome.ch",
  note: "Projet en cours de constitution. Les données de la maquette sont fictives.",
  links: [
    { label: "Politique de confidentialité", href: "/confidentialite" },
    { label: "Explorer la démo", href: "/feed" },
  ],
  /** Le composant ajoute l'année en cours. */
  copyright: "E-Dome",
} as const;

/* ── Page de remerciement ────────────────────────────────────────────────── */

export const thanks = {
  title: "C'est enregistré, merci",
  subtitle:
    "Votre manifestation d'intérêt nous est parvenue. Nous lisons chaque réponse — c'est ce qui détermine l'ordre dans lequel nous construisons les fonctionnalités.",
  nextSteps: {
    title: "Ce qui se passe maintenant",
    items: [
      "Si vous avez accepté un appel, nous vous écrivons pour convenir d'un créneau.",
      "Si vous avez demandé la bêta, vous ferez partie des premières vagues d'invitation.",
      "Sinon, vous recevrez les prochaines nouvelles du projet si vous l'avez souhaité.",
    ],
  },
  referral: {
    title: "Faites venir les bonnes personnes",
    body: "Partagez ce lien : nous saurons que l'inscription vient de vous. Plus le premier cercle est solide, plus vite la plateforme devient utile.",
    copyLabel: "Copier le lien",
    copiedLabel: "Lien copié",
    shareLinkedIn: "Partager sur LinkedIn",
    shareWhatsApp: "Partager sur WhatsApp",
    shareEmail: "Partager par e-mail",
    shareSubject: "E-Dome — l'écosystème professionnel de l'immobilier",
    shareBody: "Je viens de rejoindre les membres fondateurs d'E-Dome. Jette un œil :",
  },
  bookingCta: "Réserver un créneau maintenant",
  demoCta: "Explorer la démo",
  backHome: "Retour à l'accueil",
} as const;
