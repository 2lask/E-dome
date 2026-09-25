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
 * Le générique « apporteur = 10 à 30 % du revenu E-Dome sur tous les pôles » est
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
    includes: ["profil-pro", "biens-3", "reseau", "messagerie"],
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
