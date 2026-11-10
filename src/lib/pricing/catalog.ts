import { chf, type Money, type PlanId, type PrimeMoney } from "@/lib/model/billing";
import type { FeatureStage } from "@/lib/model/feature";
import type { CommissionPole, OneOffId, Rate } from "./charge";

/* ── Le catalogue : des données, jamais des variantes de type ───────────────

   Tout ce qui change quand le marketing ou la comptabilité tranche est ici, en
   lignes de tableau. La conséquence tenue dans tout le code : **aucun composant
   ne branche sur un nom de formule.** Pas un seul `if (plan === "mandats")`.
   Passer de deux à quatre paliers doit être une édition de données.

   Les taux viennent de `DECISIONS.md` §1.3, amendé par le fondateur : les
   pôles de créateurs sont à 10 %, pas 15 %. */

// ─── Taux de commission ──────────────────────────────────────────────────────

/**
 * Fourchette de commission marketplace, en fraction du montant encaissé.
 *
 * Chaque valeur a son comparable vérifié dans `DECISIONS.md` §1.3. Les deux
 * plus discutées :
 *
 * · **location-ct à 12 %** — Airbnb applique 15,5 % à l'hôte seul, seul modèle
 *   réellement en vigueur. Nous sommes 23 % moins chers. Les 8 % de B.3 ne
 *   survivaient pas aux ~3,15 % du prestataire de paiement plus le support.
 * · **formation et live à 10 %** — arbitrage du fondateur contre les 15 % du
 *   comptable. Les créateurs sont le segment à acquérir en premier, et un taux
 *   est une raison de venir avant d'être une ligne de revenu.
 */
export const RATES: Readonly<Record<CommissionPole, Rate>> = {
  "location-ct": { min: 0.12, max: 0.12 },
  service: { min: 0.05, max: 0.1 },
  evenement: { min: 0.05, max: 0.05 },
  live: { min: 0.1, max: 0.1 },
  formation: { min: 0.05, max: 0.1 },
  /* Affiliation seule : E-Dome ne facilite aucune livraison de biens, donc
     l'art. 20a LTVA ne s'applique pas. C'est le motif principal, et il est
     fiscal — voir DECISIONS.md §1.8 et JURIDIQUE-A-VALIDER.md §3. */
  boutique: { min: 0, max: 0 },
};

/** Taux appliqué quand le vendeur amène lui-même son acheteur. */
export const SELLER_SOURCED_RATE: Partial<Record<CommissionPole, number>> = {
  formation: 0.05,
  service: 0.05,
};

/** Taux appliqué quand E-Dome fournit l'acheteur. */
export const PLATFORM_SOURCED_RATE: Partial<Record<CommissionPole, number>> = {
  formation: 0.1,
  service: 0.1,
};

// ─── Affiliation marketplace (D14) ───────────────────────────────────────────

/**
 * Fourchettes du TAUX d'affiliation marketplace, en fraction du prix brut du
 * produit. Deuxième mécanique du modèle à deux mécaniques (D14) : le vendeur
 * ouvre son produit à l'affiliation et fixe un taux **sortant de sa marge** ;
 * la commission d'E-Dome ne bouge pas. Borné **par pôle** pour qu'un vendeur ne
 * puisse pas vider sa propre marge en promettant 100 % à un affilié.
 *
 * La boutique en est absente à dessein : elle est déjà en affiliation pure,
 * rémunérée par le marchand (`RATES.boutique = 0`, art. 20a LTVA), pas par un
 * pourcentage sortant d'une marge tenue sur E-Dome.
 */
export const AFFILIATION_RATES: Partial<Record<CommissionPole, Rate>> = {
  formation: { min: 0.2, max: 0.5 },
  live: { min: 0.2, max: 0.5 },
  evenement: { min: 0.1, max: 0.25 },
  service: { min: 0.05, max: 0.15 },
  "location-ct": { min: 0.03, max: 0.1 },
};

/**
 * Valide un taux d'affiliation contre la fourchette de son pôle.
 *
 * Lève au développement plutôt que d'afficher un flux faux : un taux hors
 * bornes, ou un pôle qui n'ouvre pas l'affiliation, est une erreur de
 * construction du `Charge`, pas une donnée à afficher.
 */
export function assertAffiliationRate(pole: CommissionPole, rate: number): void {
  const range = AFFILIATION_RATES[pole];
  if (!range) {
    throw new Error(`L'affiliation n'est pas ouverte sur le pôle « ${pole} ».`);
  }
  if (rate < range.min || rate > range.max) {
    throw new Error(
      `Taux d'affiliation hors bornes pour « ${pole} » : ` +
        `${(rate * 100).toLocaleString("fr-CH")} % ` +
        `(attendu ${(range.min * 100).toLocaleString("fr-CH")}–${(range.max * 100).toLocaleString("fr-CH")} %).`,
    );
  }
}

/**
 * Où le taux d'affiliation est PRÉ-REMPLI dans sa fourchette, de 0 (minimum)
 * à 1 (maximum). Anti-cold-start (`analyse2/marketing-modele.md` §E.1) : un
 * taux pré-rempli au plancher n'attire aucun apporteur. Aux deux tiers, le
 * produit est recommandable d'emblée ; le vendeur reste libre de baisser.
 */
export const AFFILIATION_DEFAULT_POSITION = 2 / 3;

/** Ramène un taux dans la fourchette de son pôle (arrondi au point entier). */
export function clampAffiliationRate(pole: CommissionPole, rate: number): number {
  const r = AFFILIATION_RATES[pole];
  if (!r) return 0;
  const whole = Math.round(rate * 100) / 100;
  return Math.min(r.max, Math.max(r.min, whole));
}

/** Le taux proposé par défaut à l'ouverture d'un produit à l'affiliation. */
export function defaultAffiliationRate(pole: CommissionPole): number {
  const r = AFFILIATION_RATES[pole];
  if (!r) return 0;
  return clampAffiliationRate(pole, r.min + (r.max - r.min) * AFFILIATION_DEFAULT_POSITION);
}

/** Libellé court « X à Y % » du taux d'affiliation d'un pôle marketplace. */
export function affiliationLabel(pole: CommissionPole): string {
  const r = AFFILIATION_RATES[pole];
  if (!r) return "affiliation payée par le marchand";
  const pct = (n: number) => `${(n * 100).toLocaleString("fr-CH")} %`;
  return r.min === r.max ? pct(r.max) : `${pct(r.min)} à ${pct(r.max)}`;
}

/**
 * Part fixe par unité vendue.
 *
 * Un pourcentage pur meurt sur les petits tickets : sur un billet à 35 CHF,
 * 5 % font 1.75 CHF quand le prestataire de paiement en prend 1.40. Eventbrite
 * met une part fixe pour exactement cette raison, et finit ~10,2 % effectifs
 * là où notre structure donne 7,9 %.
 */
export const PER_UNIT_FEE: Partial<Record<CommissionPole, Money>> = {
  evenement: chf(1),
};

/**
 * Plancher par transaction.
 *
 * Sous ~25 CHF de panier, le prestataire de paiement prend plus de 4,9 %.
 * Conséquence assumée et affichée : sur une micro-formation à 40 CHF au tarif
 * fondateur, le taux effectif n'est pas 5 % mais 7,5 %. Le panneau de flux
 * d'argent l'affiche tel quel — c'est à cela qu'il sert.
 */
export const MIN_COMMISSION: Money = chf(3);

// ─── Prime de mise en relation biens (D14) ───────────────────────────────────

/**
 * La PRIME BIENS : une somme fixe en francs, jamais un pourcentage du prix, que
 * le vendeur ou le bailleur fixe et paie quand il accepte une mise en relation.
 * E-Dome prélève `EDOME_PRIME_SHARE` **à l'intérieur** de la prime (jamais en
 * plus), plancher `PRIME_FLOOR`. Voir `DECISIONS-2.md` §D14.
 *
 * `EDOME_PRIME_SHARE` reste une constante paramétrable : passer à 0 % (ou toute
 * autre valeur) si l'avocat tranche autrement ne demande aucune refonte.
 */
export const PRIME_MIN: Money = chf(50);
export const PRIME_MAX: Money = chf(3000);
export const PRIME_FLOOR: Money = chf(3);
export const EDOME_PRIME_SHARE = 0.12;

/* Groupé à l'apostrophe suisse, SANS `toLocaleString` : le séparateur de
   milliers de « fr-CH » varie selon l'ICU (Node côté serveur vs navigateur côté
   client), ce qui cassait l'hydratation partout où ce libellé est rendu
   (`/apporteurs`). Un groupage manuel est identique des deux côtés. */
const groupChf = (n: number): string => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "’");

/** Fourchette de la prime biens, en toutes lettres — pour la copie d'interface. */
export const PRIME_RANGE_LABEL = `${groupChf(PRIME_MIN.cents / 100)} à ${groupChf(PRIME_MAX.cents / 100)} CHF`;

/**
 * Seule fabrique d'un `PrimeMoney`. Valide les bornes 50–3 000 CHF à la
 * construction (sinon `throw`). Un `Money` ordinaire n'étant pas assignable à
 * `PrimeMoney`, c'est le seul chemin possible : « prime en % du prix » ne
 * compile pas, et une prime hors bornes lève dès la construction du `Charge`,
 * pas au premier rendu. Ni le brand ni cette borne n'empêchent un `number`
 * dérivé d'un prix (`primeChf(price * 0.03)`) — mais 3 % d'un bien romand
 * dépasse largement 3 000 CHF, donc `primeChf()` lève aussitôt.
 */
export function primeChf(amountChf: number): PrimeMoney {
  const m = chf(amountChf);
  if (m.cents < PRIME_MIN.cents || m.cents > PRIME_MAX.cents) {
    throw new Error(
      `Prime hors bornes : ${amountChf} CHF (attendu ${PRIME_MIN.cents / 100}–${PRIME_MAX.cents / 100} CHF). ` +
        `Une prime de mise en relation est un montant fixe, jamais un pourcentage du prix du bien.`,
    );
  }
  return m as PrimeMoney;
}

/**
 * Montant de DÉPART proposé dans le formulaire d'activation, en CHF. Une valeur
 * fixe, la même pour tous les biens : elle n'est **jamais** dérivée du prix du
 * bien (verrou anti-« 1 % », `JURIDIQUE-A-VALIDER.md` §0.3).
 */
export const PRIME_START_CHF = 200;

/**
 * Au-delà de ce montant, une prime passe en VÉRIFICATION RENFORCÉE : identité
 * de l'apporteur contrôlée et mise en relation validée à la main avant d'être
 * facturée (paliers de vérification, `PLAN-2.md` étape 6). En dessous :
 * vérification automatique.
 */
export const PRIME_MANUAL_REVIEW_ABOVE: Money = chf(1000);

/**
 * Protection du vendeur. Toutes des valeurs de catalogue, ajustables sans code.
 *
 * · `windowHours` — le vendeur peut signaler « ce contact n'était pas sérieux »
 *   pendant 48 h après avoir accepté la mise en relation ;
 * · `maxRefundsPerMonth` — remboursement PLAFONNÉ : au-delà, le signalement
 *   part en examen manuel au lieu d'être remboursé d'office (sinon « accepter
 *   puis contester » devient un moyen de ne jamais payer) ;
 * · `contestedLimit` — un apporteur trop souvent contesté perd l'accès au volet
 *   biens.
 */
export const PRIME_DISPUTE = {
  windowHours: 48,
  maxRefundsPerMonth: 2,
  contestedLimit: 3,
} as const;

// ─── Restriction géographique du volet biens (D7, JURIDIQUE §0.5) ────────────

export type PrimeCountryStatus = "ouvert" | "exclu" | "a-valider";

/**
 * Pays × volet BIENS. La marketplace (pourcentage) reste ouverte partout ; la
 * prime biens, elle, ne l'est que là où recommander un bien contre
 * rémunération ne relève pas d'un régime d'autorisation (`JURIDIQUE-A-VALIDER.md`
 * §0.5). Un profil d'un pays « exclu » ne touche JAMAIS de prime sur un bien,
 * et l'interface dit pourquoi (D7, précision du fondateur).
 */
export const PRIME_COUNTRIES: Readonly<Record<string, { status: PrimeCountryStatus; reason: string }>> = {
  Suisse: {
    status: "ouvert",
    reason: "La prime de mise en relation est ouverte en Suisse, avec les verrous du programme.",
  },
  France: {
    status: "exclu",
    reason:
      "En France, être rémunéré pour recommander un bien immobilier relève de la loi Hoguet et de la carte professionnelle. Depuis la France, l'affiliation porte sur la marketplace uniquement.",
  },
  Allemagne: {
    status: "exclu",
    reason:
      "En Allemagne, recommander un bien contre rémunération demande une autorisation (§34c GewO). Depuis l'Allemagne, l'affiliation porte sur la marketplace uniquement.",
  },
  Portugal: {
    status: "exclu",
    reason:
      "Au Portugal, l'activité est réservée aux titulaires d'une licence AMI. Depuis le Portugal, l'affiliation porte sur la marketplace uniquement.",
  },
  "Royaume-Uni": {
    status: "a-valider",
    reason: "Au Royaume-Uni, le volet biens attend la validation juridique (Estate Agents Act). La marketplace est ouverte.",
  },
  "Émirats arabes unis": {
    status: "a-valider",
    reason: "Aux Émirats, le volet biens attend la validation juridique (régime RERA). La marketplace est ouverte.",
  },
  Maroc: {
    status: "a-valider",
    reason: "Au Maroc, le volet biens attend la validation juridique (régime en évolution). La marketplace est ouverte.",
  },
};

/** Le volet biens est-il ouvert à une personne de ce pays ? Inconnu = fermé. */
export function primeEligibility(country: string | undefined): {
  eligible: boolean;
  status: PrimeCountryStatus;
  country: string;
  reason: string;
} {
  const c = country?.trim() || "pays non renseigné";
  const entry = PRIME_COUNTRIES[c];
  if (!entry) {
    return {
      eligible: false,
      status: "a-valider",
      country: c,
      reason: "Le volet biens n'est pas encore ouvert dans ce pays. La marketplace est ouverte.",
    };
  }
  return { eligible: entry.status === "ouvert", status: entry.status, country: c, reason: entry.reason };
}

// ─── Tarif fondateur créateur ────────────────────────────────────────────────

/**
 * Les 30 premiers créateurs : 5 % sur les pôles de contenu, pendant 24 mois.
 *
 * Vingt-quatre mois et non douze : un créateur doit d'abord produire son
 * contenu, et un tarif de douze mois expirerait à peu près au moment où son
 * catalogue commence à produire — ce qui se lit comme un appât. C'est
 * délibérément plus long que les douze mois du tarif fondateur agence, parce
 * qu'une agence juge sur le flux de demandes, mesurable en un trimestre.
 *
 * À l'échéance : passage **automatique** au taux standard, préavis de 30 jours,
 * date écrite sur l'abonnement dès la souscription. Pas de renégociation
 * individuelle — elle contredirait la règle « prix identiques pour tous les
 * utilisateurs d'une même formule », qui est une condition juridique.
 */
export const CREATOR_FOUNDING = {
  seats: 30,
  months: 24,
  rate: 0.05,
  poles: ["formation", "live", "evenement"] as const satisfies readonly CommissionPole[],
};

/** Tarif fondateur agence : montant gelé, douze mois. */
export const AGENCY_FOUNDING_MONTHS = 12;

// ─── Part apporteur ──────────────────────────────────────────────────────────

/**
 * Part de l'apporteur d'un ABONNEMENT, **par formule**, en fraction du revenu
 * net d'E-Dome (hors TVA, après frais de paiement).
 *
 * L'ancien taux générique unique de l'apporteur « sur tous les pôles » est
 * **aboli** (D14) : il ne vaut plus que pour l'abonnement, et par barème de
 * formule. Les biens passent par la PRIME (`bien-introduction`, `primeChf`), la
 * marketplace par l'AFFILIATION (`AFFILIATION_RATES`) — jamais par cette table.
 */
export const APPORTEUR_SUBSCRIPTION_SHARES: Record<PlanId, number> = {
  patrimoine: 0.15,
  vitrine: 0.25,
  mandats: 0.25,
  regie: 0.3,
  /** Formule gratuite : aucun revenu E-Dome, donc aucune part. */
  presence: 0,
};

/**
 * Plafond de la fenêtre de rémunération, en mois.
 *
 * Non négociable : sans lui, on paie une rente perpétuelle sur un revenu
 * récurrent. Avec lui, le coût d'acquisition d'une agence est d'environ
 * 842 CHF pour une valeur vie estimée à ~10 100 CHF sur trois ans.
 */
export const APPORTEUR_WINDOW_MONTHS = 12;

/**
 * Primes d'acquisition.
 *
 * Versées **après un premier encaissement réel**, jamais à l'activation. La
 * fraude d'auto-parrainage est un coût, pas une hypothèse — et le programme
 * apporteurs est décaissant avant d'être rentable.
 */
export const BOUNTIES = {
  "host-activated": { amount: chf(60), condition: "premier encaissement de l'hôte" },
  "user-activated": { amount: chf(15), condition: "compte vérifié et actif 30 jours" },
} as const;

/** Prime « hôte activé » en CHF, dérivée de `BOUNTIES` (acquisition, pas une commission). */
export const HOST_BOUNTY_CHF = BOUNTIES["host-activated"].amount.cents / 100;

// ─── Freemium : la limite gratuite PAR RÔLE (D15) ────────────────────────────

/**
 * Les rôles du découpage gratuit / payant. Le particulier est dedans pour dire
 * explicitement qu'il ne paie rien — pas par oubli.
 */
export type FreemiumRole =
  | "particulier"
  | "proprietaire"
  | "agent"
  | "agence"
  | "prestataire"
  | "createur"
  | "hote";

export const FREEMIUM_ROLES: readonly FreemiumRole[] = [
  "particulier",
  "proprietaire",
  "agent",
  "agence",
  "prestataire",
  "createur",
  "hote",
];

/**
 * LES PLAFONDS GRATUITS ET LE QUOTA D'ACCOMPAGNEMENT — des valeurs de
 * catalogue, que le fondateur ajuste après ses entretiens avec les agences sans
 * toucher au code (D15, précision du fondateur). Tout l'affichage (`/tarifs`,
 * `/agence/demandes`, la formule Présence) les LIT ici ; aucun écran n'écrit
 * « 10 » ou « 3 » en dur.
 *
 * La synthèse de CEO validée découple deux choses : des plafonds d'INVENTAIRE
 * généreux (on démarre gratuitement et on travaille vraiment) et des fonctions
 * DE RÉUSSITE payantes (2e utilisateur, mise en avant, statistiques complètes,
 * automatisations, volume illimité) — la limite qui gêne quand on grandit, pas
 * au démarrage. Plus un QUOTA gratuit de candidatures d'accompagnement actives.
 *
 * Ce que chaque expert perd dans ce compromis, et l'indicateur qui dirait qu'on
 * s'est trompé de côté :
 * · LE MARKETING perd l'accompagnement gratuit et illimité (son levier
 *   d'acquisition le plus fort). Serré de trop si : peu de comptes agence créés,
 *   peu de premières candidatures, ou un abandon élevé au moment où le quota
 *   gratuit se ferme → monter `activeApplications`.
 * · LE COMPTABLE perd la protection stricte des quatre lignes qui justifient
 *   Vitrine (le quota ouvre une brèche vers l'accompagnement). Ouvert de trop
 *   si : des agences décrochent des mandats via le quota et RESTENT gratuites
 *   (conversion vers Vitrine trop basse, le tunnel de DECISIONS.md §8 ne se
 *   referme pas) → baisser `activeApplications` ou `activeListings`.
 */
export const FREE_LIMITS = {
  /** Tout est gratuit : chercher, contacter, réserver, alertes. Jamais monétisé (côté demande du marché). */
  particulier: {},
  /** Vendre et louer sans plafond, 0 CHF sur la transaction. Patrimoine devient utile dès le 2e bien loué. */
  proprietaire: { rentedPropertiesFree: 1 },
  /** Agent indépendant : même plafond que l'agence. */
  agent: { activeListings: 10, seats: 1, activeApplications: 3 },
  /** Agence : 10 biens actifs (42 % des agences suisses ont ≤ 5 biens), 1 utilisateur, 3 candidatures actives. */
  agence: { activeListings: 10, seats: 1, activeApplications: 3 },
  /** Prestataire : déjà rémunérateur via la commission dès le premier devis transformé. */
  prestataire: { activeServices: 5 },
  /** Créateur : de quoi tester plusieurs offres ; les lives restent illimités (déjà commissionnés). */
  createur: { activeFormations: 2 },
  /** Hôte : au-delà de 2 biens simultanés, on devient un petit professionnel de la location. */
  hote: { activeShortStays: 2 },
} as const satisfies Record<FreemiumRole, Record<string, number>>;

/**
 * Les formules ouvertes à chaque rôle, par identifiant de `PLANS`. `proLater` :
 * une formule Pro est prévue mais N'A PAS ENCORE DE PRIX — elle s'affiche en
 * statut « Ensuite », sans montant inventé (prestataire, créateur, hôte).
 */
export const ROLE_PLANS: Readonly<Record<FreemiumRole, { planIds: readonly PlanId[]; proLater?: boolean }>> = {
  particulier: { planIds: [] },
  proprietaire: { planIds: ["patrimoine"] },
  agent: { planIds: ["presence", "vitrine"] },
  agence: { planIds: ["presence", "vitrine", "mandats", "regie"] },
  prestataire: { planIds: [], proLater: true },
  createur: { planIds: [], proLater: true },
  hote: { planIds: [], proLater: true },
};

// ─── Formules ────────────────────────────────────────────────────────────────

export interface Plan {
  id: PlanId;
  holder: "agency" | "account";
  /** Ordre d'affichage et de montée en gamme. */
  tier: number;
  price: { month: Money; year?: Money };
  /** Référence des `FeatureEntry.id`, jamais du texte : les noms sont dans le contenu. */
  includes: string[];
  stage: FeatureStage;
}

/**
 * Les quatre paliers d'agence, plus Patrimoine.
 *
 * `Régie` est en statut « Ensuite », donc gris et hors de la grille de
 * comparaison : c'est la synthèse entre le comptable, qui veut trois paliers
 * payants parce que 42 % des agences suisses ont au plus cinq biens, le
 * marketing, qui n'en veut que deux pour ne pas inviter à attendre le moins
 * cher, et le produit, pour qui deux formules × deux statuts font déjà quatre
 * choses à comparer.
 *
 * Prix **hors taxes** : une agence déduit la TVA, et un prix TTC lui paraîtrait
 * 8,1 % trop cher. Patrimoine s'adresse à un particulier, donc TTC à
 * l'affichage — la distinction est portée par `holder`.
 */
export const PLANS: readonly Plan[] = [
  {
    id: "presence",
    holder: "agency",
    tier: 0,
    price: { month: chf(0) },
    /* Présence gratuite PLAFONNÉE (D15) : le plafond de biens et le quota de
       candidatures se lisent dans `FREE_LIMITS.agence`, pas dans la clé. */
    includes: ["profil-pro", "biens-plafond", "utilisateur-1", "candidatures-quota", "statistiques-base", "reseau", "messagerie"],
    stage: "launch",
  },
  {
    id: "vitrine",
    holder: "agency",
    tier: 1,
    price: { month: chf(89), year: chf(890) },
    includes: [
      "biens-illimites",
      "page-publique",
      "mise-en-avant-1",
      "statistiques",
      "badge-verifie",
      "demandes-accompagnement",
    ],
    stage: "launch",
  },
  {
    id: "mandats",
    holder: "agency",
    tier: 2,
    price: { month: chf(290), year: chf(2900) },
    includes: [
      "biens-illimites",
      "page-publique",
      "sous-domaine",
      "equipe-droits",
      "attribution",
      "mandats",
      "agenda-visites",
      "suivi-commissions",
      "mise-en-avant-4",
      "statistiques-completes",
      "export",
      "demandes-accompagnement",
    ],
    stage: "launch",
  },
  {
    id: "regie",
    holder: "agency",
    tier: 3,
    price: { month: chf(690) },
    includes: ["multi-entites", "import-flux", "roles-fins", "comptabilite", "sla", "dpa"],
    stage: "later",
  },
  {
    id: "patrimoine",
    holder: "account",
    tier: 1,
    price: { month: chf(19), year: chf(190) },
    includes: [
      "suivi-biens",
      "baux-echeances",
      "charges-decompte",
      "rendement-reel",
      "statistiques-annonces",
      "alertes-marche",
      "ia-incluse",
      "export-fiduciaire",
    ],
    stage: "launch",
  },
];

/** Douze mois payés dix sur l'engagement annuel. */
export const ANNUAL_DISCOUNT = 2 / 12;

/** Une formule inclut-elle une fonction ? Lit `includes`, jamais le nom de la formule. */
export function planIncludes(planId: PlanId, feature: string): boolean {
  return PLANS.find((p) => p.id === planId)?.includes.includes(feature) ?? false;
}

/** La formule disponible la moins chère qui inclut une fonction (pour l'appel à monter). */
export function lowestPlanWith(feature: string, holder: Plan["holder"] = "agency"): Plan | undefined {
  return PLANS.filter((p) => p.holder === holder && p.stage === "launch" && p.includes.includes(feature))
    .slice()
    .sort((a, b) => a.tier - b.tier)[0];
}

/**
 * Quota de candidatures d'accompagnement ACTIVES d'une agence selon sa
 * formule : `null` = illimité (la formule inclut « demandes-accompagnement »),
 * sinon le quota gratuit de `FREE_LIMITS.agence`.
 */
export function applicationQuota(planId: PlanId): number | null {
  return planIncludes(planId, "demandes-accompagnement") ? null : FREE_LIMITS.agence.activeApplications;
}

/** Nombre d'utilisateurs couverts : illimité avec « equipe-droits », sinon le plafond gratuit. */
export function seatQuota(planId: PlanId): number | null {
  return planIncludes(planId, "equipe-droits") ? null : FREE_LIMITS.agence.seats;
}

// ─── Forfaits ponctuels ──────────────────────────────────────────────────────

export interface OneOff {
  id: OneOffId;
  price: Money;
  stage: FeatureStage;
}

/**
 * Forfaits ponctuels, aux trois conditions qui les tiennent hors du courtage :
 * payés d'avance, **jamais conditionnés** à la conclusion d'une transaction
 * immobilière, **jamais proportionnels** au prix d'un bien.
 *
 * Jamais sous 25 CHF non plus : en dessous, le prestataire de paiement prend
 * plus de 4,9 %.
 *
 * La mise en avant ne doit **jamais** conditionner la publication — ce serait
 * le retour déguisé du modèle 500 / 2 500 CHF que la mission abandonne.
 */
export const ONE_OFFS: readonly OneOff[] = [
  { id: "mise-en-avant-7j", price: chf(79), stage: "launch" },
  { id: "mise-en-avant-30j", price: chf(199), stage: "launch" },
  { id: "dossier-de-vente", price: chf(149), stage: "later" },
  { id: "visite-virtuelle", price: chf(249), stage: "later" },
  { id: "estimation-supplementaire", price: chf(2), stage: "launch" },
];

// ─── Prestataire de paiement ─────────────────────────────────────────────────

/**
 * Frais du prestataire de paiement.
 *
 * **Qui les supporte n'est pas tranché** : c'est l'arbitrage frais directs
 * contre frais destinataires, réservé à l'avocat
 * (`JURIDIQUE-A-VALIDER.md` §2). Position de travail : **frais directs**, donc
 * débités au vendeur et affichés sur une ligne distincte du panneau de flux
 * d'argent.
 *
 * Le modèle représente les deux : `MoneyFlow` porte `psp` comme ligne séparée,
 * si bien que basculer ne coûte qu'un changement de configuration.
 */
export const PSP = {
  rate: 0.0315,
  fixed: chf(0.3),
  /** `seller` = frais directs. `platform` = frais destinataires. */
  bornBy: "seller" as "seller" | "platform",
};

/** Taux normal de TVA suisse, inchangé en 2026. */
export const VAT_STANDARD = 0.081;
