import type { FeatureStage } from "@/lib/model/feature";

/* ── Contenu de l'écran d'entrée `/demo` ────────────────────────────────────

   Écrit d'emblée, pas extrait d'une page existante. C'est le premier écran
   neuf de la reprise, et il répond aux trois questions du critère ultime de
   la mission — quelqu'un qui ouvre la maquette sans personne à côté doit
   comprendre en trente secondes :

     1. ce qu'est E-Dome,
     2. qui paie quoi,
     3. ce qui existe déjà par rapport à ce qui viendra.

   Un écran, trois blocs, sans défilement sur un téléphone. L'ordre n'est pas
   neutre : « qui paie quoi » passe AVANT les portes, parce que c'est la seule
   des trois questions qu'une capture d'écran ne peut pas résoudre (DECISIONS
   §2.1). Le fil, lui, se montre de lui-même.

   Le texte vit ici et les composants n'en écrivent aucun en dur — c'est la
   règle de `src/content/` : un pôle qui change de statut, une ligne de prix
   qui bouge, se corrigent à un seul endroit. */

export interface DemoPole {
  id: string;
  label: string;
  /** Nom d'icône lucide, résolu par l'écran. */
  icon: string;
  stage: FeatureStage;
  /** Une ligne, ce que le pôle permet de faire. */
  line: string;
}

export interface StageLegend {
  stage: FeatureStage;
  label: string;
  hint: string;
}

export interface MoneyLine {
  who: string;
  pays: string;
}

export interface DemoDoor {
  href: string;
  label: string;
  hint: string;
  icon: string;
}

export const demoScreen = {
  eyebrow: "Comprendre E-Dome en un écran",
  title: "E-Dome — le réseau immobilier où ton réseau te rapporte",
  subtitle:
    "Publiez ou trouvez un bien en direct, sans commission d'agence ; recommandez un bien par un lien traçable et touchez une prime ; et laissez le copilote IA estimer et rédiger. Services, formations et événements viennent ensuite.",

  /* ── Bloc 1 : ce qu'est E-Dome, et ce qui existe déjà ───────────────────
     Les sept pôles avec leur statut. Trois sont ouverts au lancement, quatre
     viennent ensuite : c'est la réponse à « ce qui existe par rapport à ce
     qui viendra », lisible d'un coup d'œil grâce à la couleur du statut. */
  polesTitle: "Sept pôles, lancés par étapes",
  poles: [
    { id: "biens", label: "Biens (Pro)", icon: "Home", stage: "launch", line: "Vitrine publique, gestion des annonces, analyse de rentabilité par l'IA." },
    { id: "services", label: "Services", icon: "Wrench", stage: "later", line: "Photographe, artisan, home stager : demander un devis." },
    { id: "apporteurs", label: "Apporteurs", icon: "Handshake", stage: "launch", line: "Recommandez un bien par un lien traçable, et touchez une prime." },
    { id: "formations", label: "Formations", icon: "GraduationCap", stage: "later", line: "Suivre ou publier des formations immobilières." },
    { id: "evenements", label: "Événements", icon: "CalendarDays", stage: "later", line: "Salons, ateliers et rencontres, en salle ou en ligne." },
    { id: "lives", label: "Lives", icon: "Radio", stage: "later", line: "Diffuser des visites en direct, revoir les rediffusions." },
    { id: "boutique", label: "Boutique", icon: "ShoppingBag", stage: "later", line: "Mobilier, matériaux et équipements, en affiliation." },
  ] satisfies DemoPole[],

  /* ── La légende des statuts, expliquée ici une fois pour toutes ─────────
     Le même vocabulaire — et les mêmes couleurs — servent partout dans la
     maquette. `vision` n'a pas de pôle à lui seul, mais des fonctions plus
     lointaines le portent ; il est dans la légende pour que le gris le plus
     clair ait un sens quand on le croise ailleurs. */
  stagesTitle: "Ce que veulent dire les couleurs",
  stages: [
    { stage: "launch", label: "Au lancement", hint: "Utilisable dès l'ouverture." },
    { stage: "later", label: "Ensuite", hint: "Prévu, construit après le lancement." },
    { stage: "vision", label: "Vision", hint: "Cap plus lointain, pas encore daté." },
  ] satisfies StageLegend[],

  /* ── Bloc 2 : qui paie quoi, en quatre lignes ──────────────────────────
     Placé AVANT les portes. Le point contre-intuitif de tout le modèle reçoit
     le plus gros caractère de l'écran : sur la vente et la location d'un bien,
     E-Dome ne prend rien sur la transaction. Le différenciateur n'est pas
     E-Dome, c'est la ligne « à un tiers » qu'on ne paie pas.

     Les chiffres énoncés ici sont ceux de `src/lib/pricing/catalog.ts`. Ils
     sont recopiés en toutes lettres à dessein — c'est du contenu de lecture,
     pas un calcul —, et JURIDIQUE-A-VALIDER.md porte la trace de ce qui doit
     être confirmé. */
  moneyTitle: "Qui paie quoi",
  moneyHeadline: "0 CHF à E-Dome",
  moneyHeadlineHint: "sur la vente ou la location d'un bien entre particuliers",
  money: [
    { who: "Vendre ou louer un bien", pays: "Rien à E-Dome sur la transaction. Un tiers — notaire, régie — se paie à part." },
    { who: "Apporteurs", pays: "Une prime fixe en francs, offerte par le vendeur, versée sur une mise en relation acceptée — jamais un pourcentage du prix, jamais un supplément pour le client. E-Dome en retient une part fixe." },
    { who: "Abonnements et mises en avant", pays: "Gratuit pour démarrer ; une formule payante quand on grandit (volume, équipe, mise en avant, statistiques), de 19 à 290 CHF/mois. E-Dome se rémunère en frais fixes, comme un portail — jamais un % de vente." },
    { who: "Services, formations, événements", pays: "Une commission sur ce qui se vend, de 5 à 12 % selon le pôle — pôles secondaires, ensuite." },
  ] satisfies MoneyLine[],
  moneyFootnote:
    "Aucun prix affiché ici n'est un engagement : la tarification est en cours de validation.",

  /* ── Bloc 3 : trois portes, pas six ────────────────────────────────────
     Le fil se montre de lui-même, la marketplace est le cœur, le tableau de
     bord est là où l'argent devient visible. Trois entrées suffisent à
     répondre à « ce que c'est » ; en offrir six, c'est renoncer à guider. */
  doorsTitle: "Par où commencer",
  doors: [
    { href: "/profil", label: "Ma vitrine", hint: "La page publique d'un professionnel.", icon: "Building2" },
    { href: "/publier", label: "Publier un bien", hint: "Créer et gérer une annonce.", icon: "Home" },
    { href: "/dashboard", label: "Le tableau de bord", hint: "L'activité d'un professionnel, et d'où vient l'argent.", icon: "LayoutDashboard" },
  ] satisfies DemoDoor[],

  disclaimer:
    "Tout ce que montre la maquette est un exemple : biens, prix, profils, chiffres. Rien n'y est réel.",
} as const;
