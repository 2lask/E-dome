/* ── Le tutoriel guidé (chantier P5) ────────────────────────────────────────

   Objectif : quelqu'un, seul, comprend E-Dome en dix minutes. Le tutoriel
   n'est plus une suite d'écrans commentés : il éclaire un élément précis de la
   page (le « projecteur »), explique en deux phrases, et parfois attend que la
   personne fasse le geste elle-même — ouvrir le sélecteur, changer d'onglet,
   postuler. « Suivant » reste toujours disponible : on ne bloque jamais.

   Plusieurs parcours, choisis dans un lanceur. Ceux qui ont besoin d'un point
   de vue font entrer dans la peau d'une personne de l'annuaire (`persona`,
   chantier P3) — Bernard pour vendre, Jean-Luc pour l'agence, Yves pour les
   apporteurs, Ana pour louer et voyager.

   TOUT le texte du tutoriel vit ici. Les composants de `components/tour/` ne
   font que naviguer, mesurer et afficher. Chaque `target` est la valeur d'un
   attribut `data-tour="…"` posé dans l'interface ; l'épreuve
   `tests/data/p5-tour.test.ts` vérifie que chaque cible, chaque route et
   chaque personne existent. */

/** Ce que l'étape attend de la personne avant de se dire « faite ». */
export type TourAwait = "click";

/** Où poser la carte par rapport à l'élément éclairé (préférence, pas ordre). */
export type TourPlacement = "top" | "bottom" | "left" | "right";

export interface TourStep {
  /** Identifiant stable, unique dans son parcours (sert à la reprise). */
  id: string;
  /** Route à ouvrir pour cette étape (sans paramètre de requête). */
  route: string;
  /** Personne à incarner en arrivant (id de l'annuaire), s'il y a lieu. */
  persona?: string;
  /** Clé `data-tour` de l'élément à éclairer. */
  target: string;
  /** Clés de repli, essayées dans l'ordre si `target` est absent ou caché. */
  fallbackTargets?: string[];
  title: string;
  body: string;
  /** Geste attendu sur la cible. « Suivant » reste toujours possible. */
  await?: TourAwait;
  /** Consigne affichée tant que le geste n'est pas fait. */
  awaitHint?: string;
  /** Message affiché quand le geste est fait. */
  doneText?: string;
  /** Après le geste, éclairer plutôt cet élément (ex. la liste qui s'ouvre). */
  revealTarget?: string;
  /** Après le geste, passer seul à l'étape suivante (vrai par défaut). */
  autoAdvance?: boolean;
  placement?: TourPlacement;
}

export type TourIcon = "compass" | "home" | "building" | "handshake" | "plane";

export interface TourPath {
  id: string;
  title: string;
  /** Une ligne : ce qu'on saura à la fin. */
  tagline: string;
  icon: TourIcon;
  /** Durée annoncée, en minutes. */
  minutes: number;
  /** Personne incarnée pendant tout le parcours, s'il y a lieu. */
  persona?: string;
  /** Comment on présente cette personne dans le lanceur. */
  personaLabel?: string;
  steps: TourStep[];
}

/* ── Les personnes du casting utilisées par les parcours ─────────────────── */

export const TOUR_PERSONAS = {
  bernard: "user-007",
  jeanLuc: "user-015",
  yves: "user-012",
  ana: "user-006",
  helene: "user-014",
} as const;

/* ── Les textes de l'interface du tutoriel ───────────────────────────────── */

export const tourUi = {
  /** Bouton permanent de relance. */
  launch: "Tutoriel",
  launchLong: "Visite guidée",
  launchAria: "Ouvrir le tutoriel guidé",

  /** Le lanceur (feuille de choix des parcours). */
  sheetEyebrow: "Tutoriel guidé",
  sheetTitle: "Bienvenue sur E-Dome",
  sheetIntro:
    "Une démonstration où tout est fictif. Choisissez un parcours : on vous montre, vous essayez. Vous pouvez arrêter à tout moment.",
  sheetLater: "Plus tard",
  sheetClose: "Fermer",
  sheetHint: "Vous retrouverez le tutoriel à tout moment avec le bouton « Tutoriel ».",
  resumeTitle: "Reprendre là où vous en étiez",
  resumeLine: (path: string, i: number, n: number) => `${path} · étape ${i} sur ${n}`,
  resumeCta: "Reprendre",
  restart: "Recommencer",
  minutes: (m: number) => `≈ ${m} min`,
  steps: (n: number) => `${n} étapes`,
  asPersona: (name: string) => `Dans la peau de ${name}`,
  completed: "Terminé",

  /** La carte d'étape. */
  stepOf: (i: number, n: number) => `Étape ${i} / ${n}`,
  prev: "Précédent",
  next: "Suivant",
  finish: "Terminer",
  skip: "Passer le tutoriel",
  close: "Fermer le tutoriel",
  yourTurn: "À vous",
  defaultAwaitHint: "Cliquez sur l'élément éclairé.",
  defaultDone: "Bien joué !",
  fallbackNote: "L'élément n'est pas visible sur cet écran : lisez simplement l'explication.",
  loading: "On ouvre la bonne page…",
  goToPage: "Ouvrir la page de l'étape",

  /** Fin d'un parcours. */
  endTitle: "Parcours terminé",
  endBody: "Vous avez fait le tour. Les autres parcours vous attendent dans le tutoriel.",
  endOther: "Choisir un autre parcours",
  endClose: "Explorer librement",

  /** Le mode explicatif, rétrogradé en point d'entrée du glossaire. */
  glossaryLabel: "Glossaire",
  glossaryHint: "Affiche un « ? » sur les termes et les statuts qui s'expliquent.",
} as const;

/* ── Les parcours ────────────────────────────────────────────────────────── */

const discover: TourPath = {
  id: "decouvrir",
  title: "Découvrir E-Dome",
  tagline: "Le tour complet : qui vous êtes, le fil, les biens, les messages et qui paie quoi.",
  icon: "compass",
  minutes: 4,
  steps: [
    {
      id: "banner",
      route: "/feed",
      target: "demo-banner",
      placement: "bottom",
      title: "Ici, tout est fictif",
      body: "Ce bandeau reste en haut de chaque écran. Personnes, biens et montants sont des exemples. Les pastilles de couleur disent ce qui est ouvert au lancement et ce qui viendra ensuite.",
    },
    {
      id: "persona",
      route: "/feed",
      target: "persona-switcher",
      placement: "bottom",
      title: "« Vous êtes … » : choisissez qui vous êtes",
      body: "E-Dome se vit du point de vue d'une personne : une locataire, un propriétaire, une agence, un apporteur. Changez de personne et tout l'écran change avec elle.",
      await: "click",
      awaitHint: "Cliquez sur « Vous êtes … » pour ouvrir la liste.",
      doneText: "Voici les seize personnes de la démonstration. Vous pourrez revenir ici à tout moment.",
      revealTarget: "persona-list",
      autoAdvance: false,
    },
    {
      id: "feed",
      route: "/feed",
      target: "feed-tabs",
      placement: "bottom",
      title: "Le fil",
      body: "Les annonces, les conseils et les nouvelles des personnes que vous suivez, au même endroit. « Pour vous » mélange tout ; « Suivis » ne garde que vos abonnements.",
      await: "click",
      awaitHint: "Essayez : cliquez sur « Suivis ».",
      doneText: "Le fil se trie d'un clic.",
    },
    {
      id: "poles",
      route: "/explorer",
      target: "hub-tabs",
      placement: "bottom",
      title: "Les pôles, réunis",
      body: "Biens, boutique, services, formations, lives, événements : tout ce dont on a besoin autour d'un logement, sur une seule plateforme.",
    },
    {
      id: "search",
      route: "/explorer",
      target: "explorer-search",
      placement: "bottom",
      title: "Chercher un bien",
      body: "Achat, location, vacances : choisissez, puis affinez par prix, pièces, pays ou rendement. Les résultats se mettent à jour tout de suite.",
    },
    {
      id: "property",
      route: "/explorer/prop5",
      target: "money-flow",
      fallbackTargets: ["property-title"],
      placement: "top",
      title: "Une fiche de bien, sans zone grise",
      body: "Sur une location de vacances, chaque franc est visible. La commission d'E-Dome est prise sur la part de l'hôte. Elle ne s'ajoute jamais au prix payé par le voyageur.",
    },
    {
      id: "messages",
      route: "/messages",
      target: "messages-list",
      placement: "right",
      title: "Les messages",
      body: "Chaque contact, chaque visite, chaque réservation ouvre une conversation. Elle garde le lien vers le bien dont on parle.",
    },
    {
      id: "tarifs",
      route: "/tarifs",
      target: "tarifs-roles",
      placement: "bottom",
      title: "Qui paie quoi",
      body: "Rôle par rôle : ce qui est gratuit, et ce qui devient payant quand on grandit. E-Dome vit surtout des abonnements des professionnels, et d'une commission sur la location de vacances.",
    },
    {
      id: "apporteurs",
      route: "/apporteurs",
      target: "apporteurs-tabs",
      placement: "bottom",
      title: "Les apporteurs",
      body: "Vous recommandez un bien ou un produit à quelqu'un. Si le vendeur accepte le contact, vous touchez une prime. Rien n'est ajouté au prix payé par le client.",
    },
    {
      id: "expert",
      route: "/apporteurs",
      target: "ai-assistant",
      placement: "top",
      title: "Une question ? L'Expert IA",
      body: "Il répond sur la plateforme et sur l'immobilier en Suisse. Et le bouton « Tutoriel » vous ramène ici quand vous voulez.",
    },
  ],
};

const sell: TourPath = {
  id: "vendre",
  title: "Comment je vends mon bien",
  tagline: "Vendre seul ou accompagné, comparer des agences sans se dévoiler, attirer des acheteurs.",
  icon: "home",
  minutes: 3,
  persona: TOUR_PERSONAS.bernard,
  personaLabel: "Bernard Chappuis, propriétaire",
  steps: [
    {
      id: "who",
      route: "/vendre",
      persona: TOUR_PERSONAS.bernard,
      target: "persona-switcher",
      placement: "bottom",
      title: "Vous êtes Bernard",
      body: "Bernard Chappuis veut vendre sa maison. Pour ce parcours, vous voyez E-Dome avec ses yeux.",
    },
    {
      id: "routes",
      route: "/vendre",
      persona: TOUR_PERSONAS.bernard,
      target: "sell-routes",
      placement: "bottom",
      title: "Deux façons de vendre",
      body: "Seul, ou accompagné par une agence. Les deux cartes se lisent ligne à ligne. Dans les deux cas, E-Dome ne prend rien sur la vente.",
    },
    {
      id: "privacy",
      route: "/vendre/accompagnement",
      persona: TOUR_PERSONAS.bernard,
      target: "accomp-privacy",
      placement: "bottom",
      title: "Vous restez anonyme",
      body: "Les agences voient votre demande, pas votre nom. C'est vous qui décidez qui vous contacte.",
    },
    {
      id: "proposals",
      route: "/vendre/accompagnement",
      persona: TOUR_PERSONAS.bernard,
      target: "accomp-proposals",
      placement: "top",
      title: "Comparer, champ par champ",
      body: "Chaque agence répond avec les mêmes quatre champs : taux, délai, ce qui est inclus, références. Aucune ne paie pour passer devant.",
    },
    {
      id: "publish",
      route: "/publier",
      persona: TOUR_PERSONAS.bernard,
      target: "publish-steps",
      placement: "bottom",
      title: "Publier son annonce",
      body: "Six étapes : le bien, les détails, les photos, les équipements, les apporteurs, la publication. Le brouillon se garde si vous partez.",
    },
    {
      id: "prime",
      route: "/publier",
      persona: TOUR_PERSONAS.bernard,
      target: "seller-primes",
      fallbackTargets: ["publish-steps"],
      placement: "bottom",
      title: "« Faites-vous amener des acheteurs »",
      body: "À l'étape Apporteurs, vous fixez une prime en francs. Un apporteur vous présente un acheteur : vous acceptez, la prime est due ; vous refusez, rien n'est dû. Ici, le suivi de vos primes.",
    },
  ],
};

const agency: TourPath = {
  id: "agence",
  title: "Comment je gère mon agence",
  tagline: "L'espace agence, les demandes de vendeurs et ce que débloque chaque formule.",
  icon: "building",
  minutes: 3,
  persona: TOUR_PERSONAS.jeanLuc,
  personaLabel: "Jean-Luc Hartmann, directeur d'agence",
  steps: [
    {
      id: "who",
      route: "/agence",
      persona: TOUR_PERSONAS.jeanLuc,
      target: "persona-switcher",
      placement: "bottom",
      title: "Vous êtes Jean-Luc",
      body: "Jean-Luc Hartmann dirige une agence. Voici son espace de travail.",
    },
    {
      id: "plan",
      route: "/agence",
      persona: TOUR_PERSONAS.jeanLuc,
      target: "agence-plan",
      placement: "bottom",
      title: "Votre formule",
      body: "L'agence paie un abonnement pour ses outils. C'est la principale source de revenu d'E-Dome, et elle se change en un clic.",
    },
    {
      id: "tools",
      route: "/agence",
      persona: TOUR_PERSONAS.jeanLuc,
      target: "agence-sections",
      placement: "top",
      title: "Les outils de l'agence",
      body: "Demandes de vendeurs, mandats, équipe, statistiques : tout l'outil de travail au même endroit.",
    },
    {
      id: "demand",
      route: "/agence/demandes",
      persona: TOUR_PERSONAS.jeanLuc,
      target: "demande",
      placement: "bottom",
      title: "Une demande de vendeur",
      body: "Un particulier cherche une agence. Vous voyez le type de bien, le secteur et le budget, jamais son nom.",
      await: "click",
      awaitHint: "Cliquez sur « Postuler » pour ouvrir le formulaire.",
      doneText: "Le formulaire s'ouvre.",
    },
    {
      id: "fields",
      route: "/agence/demandes",
      persona: TOUR_PERSONAS.jeanLuc,
      target: "demande-form",
      fallbackTargets: ["demande"],
      placement: "top",
      title: "Quatre champs imposés",
      body: "Taux, délai, ce qui est inclus, références. Toutes les agences répondent pareil : le vendeur compare à égalité, sans classement payant.",
    },
    {
      id: "gating",
      route: "/agence/abonnement",
      persona: TOUR_PERSONAS.jeanLuc,
      target: "abonnement-gated",
      placement: "bottom",
      title: "Ce que débloque la formule",
      body: "Certaines fonctions sont réservées à une formule supérieure. La page dit laquelle, sans détour.",
    },
    {
      id: "plans",
      route: "/agence/abonnement",
      persona: TOUR_PERSONAS.jeanLuc,
      target: "abonnement-plans",
      placement: "top",
      title: "Changer de formule",
      body: "Les prix sont ceux du catalogue, les mêmes que sur la page Tarifs. Essayez : dans la démonstration, rien n'est facturé.",
    },
  ],
};

const referrers: TourPath = {
  id: "apporteurs",
  title: "Comment je gagne avec les apporteurs",
  tagline: "Recommander un bien ou un produit, et voir ce qu'on touche avant de recommander.",
  icon: "handshake",
  minutes: 2,
  persona: TOUR_PERSONAS.yves,
  personaLabel: "Yves Mottiez, apporteur",
  steps: [
    {
      id: "who",
      route: "/apporteurs",
      persona: TOUR_PERSONAS.yves,
      target: "persona-switcher",
      placement: "bottom",
      title: "Vous êtes Yves",
      body: "Yves Mottiez connaît La Gruyère et ses gens. Il recommande des biens et des produits, et il est payé quand le vendeur accepte le contact.",
    },
    {
      id: "totals",
      route: "/apporteurs",
      persona: TOUR_PERSONAS.yves,
      target: "apporteurs-totals",
      placement: "bottom",
      title: "Ce que vous avez touché",
      body: "Un seul calcul pour tout l'espace : primes sur les biens, part sur les ventes de la boutique, part sur les abonnements.",
    },
    {
      id: "tabs",
      route: "/apporteurs",
      persona: TOUR_PERSONAS.yves,
      target: "apporteurs-tabs",
      placement: "bottom",
      title: "Biens ou marketplace",
      body: "Deux mécaniques, jamais mélangées. Sur un bien : une prime fixe en francs. Sur la marketplace : un pourcentage, pris sur la marge du vendeur.",
      await: "click",
      awaitHint: "Cliquez sur « Marketplace » pour comparer.",
      doneText: "Même calcul, autre mécanique.",
    },
    {
      id: "subscriptions",
      route: "/apporteurs",
      persona: TOUR_PERSONAS.yves,
      target: "apporteurs-abonnements",
      placement: "top",
      title: "Les abonnements",
      body: "Vous amenez une agence qui s'abonne ? Vous touchez une part de son abonnement pendant une durée fixe.",
    },
    {
      id: "rules",
      route: "/apporteurs",
      persona: TOUR_PERSONAS.yves,
      target: "apporteurs-rules",
      placement: "top",
      title: "Les règles, et la frontière",
      body: "Vous ne négociez rien et ne représentez personne. Le volet biens dépend du pays : incarnez Hélène Marchal, à Évian, et vous verrez qu'en France il reste fermé. La marketplace, elle, est ouverte partout.",
    },
  ],
};

const travel: TourPath = {
  id: "louer",
  title: "Je loue, je voyage",
  tagline: "Trouver un logement ou un séjour, et savoir exactement ce qu'on paie.",
  icon: "plane",
  minutes: 2,
  persona: TOUR_PERSONAS.ana,
  personaLabel: "Ana Ferreira, locataire",
  steps: [
    {
      id: "who",
      route: "/explorer",
      persona: TOUR_PERSONAS.ana,
      target: "persona-switcher",
      placement: "bottom",
      title: "Vous êtes Ana",
      body: "Ana Ferreira cherche un 4 pièces à Renens pour sa famille. Et pourquoi pas, une semaine au ski.",
    },
    {
      id: "search",
      route: "/explorer",
      persona: TOUR_PERSONAS.ana,
      target: "explorer-search",
      placement: "bottom",
      title: "Location ou vacances",
      body: "Choisissez le type de transaction en haut, puis filtrez. Pour un séjour, prenez « Vacances ».",
      await: "click",
      awaitHint: "Cliquez sur un type : Location ou Vacances.",
      doneText: "Les résultats suivent votre choix.",
    },
    {
      id: "stay",
      route: "/explorer/prop5",
      persona: TOUR_PERSONAS.ana,
      target: "property-aside",
      fallbackTargets: ["property-title"],
      placement: "left",
      title: "Réserver un séjour",
      body: "Choisissez vos dates : le total affiché, c'est ce que vous payez. Pas de frais ajoutés au dernier moment.",
    },
    {
      id: "flow",
      route: "/explorer/prop5",
      persona: TOUR_PERSONAS.ana,
      target: "money-flow",
      fallbackTargets: ["property-title"],
      placement: "top",
      title: "Qui paie la commission ?",
      body: "L'hôte, sur sa part. Le voyageur paie le prix affiché, rien de plus.",
    },
    {
      id: "contact",
      route: "/messages",
      persona: TOUR_PERSONAS.ana,
      target: "messages-list",
      placement: "right",
      title: "Parler à l'hôte ou au propriétaire",
      body: "Vos échanges arrivent ici, chacun rattaché à son bien. Bon voyage !",
    },
  ],
};

export const TOUR_PATHS: readonly TourPath[] = [discover, sell, agency, referrers, travel];

export function tourPathById(id: string): TourPath | undefined {
  return TOUR_PATHS.find((p) => p.id === id);
}
