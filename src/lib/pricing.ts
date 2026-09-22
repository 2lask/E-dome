import type { Currency, ReferralTargetKind, TransactionType } from "./types";

/* ─────────────────────────────────────────────────────────────────────────
   Modèle de rémunération E-Dome — source unique de vérité.

   Avant ce module, cinq fichiers décrivaient cinq barèmes différents, et
   deux d'entre eux se contredisaient sur un même écran : sur la fiche du
   chalet de Verbier, le bouton « Recommander » annonçait 5 100 CHF pendant
   que l'encart apporteur juste en dessous annonçait 48 à 143 CHF. Un
   facteur 36 sur la même page.

   Le barème ci-dessous est celui des conditions générales (§5, « Modèle de
   rémunération ») et de la page d'aide. Ces deux pages restent la référence
   rédigée ; ce module en est la traduction exécutable. Toute page qui
   affiche un montant de commission doit l'importer d'ici — ne recalculez
   jamais un taux à la main dans un composant.

   Deux règles structurent le modèle, et elles ne sont pas cosmétiques :

   1. La vente entre particuliers et la location longue durée sont
      facturées par un FRAIS FIXE, jamais par un pourcentage du prix du
      bien. Un pourcentage sur le prix de vente d'un bien immobilier est
      l'assiette de rémunération d'un courtier ; E-Dome se présente comme
      un intermédiaire technique, pas comme un courtier.

   2. La part de l'apporteur est prélevée sur ce qu'E-Dome encaisse, jamais
      ajoutée au prix payé par le client. Elle s'exprime donc toujours en
      pourcentage du revenu E-Dome, jamais du prix affiché.

   ───────────────────────────────────────────────────────────────────────── */

/** Pôles de revenu. Un pôle = une façon dont E-Dome se rémunère. */
export type Pole =
  | "vente"
  | "location-lt"
  | "location-ct"
  | "service"
  | "evenement"
  | "live"
  | "formation"
  | "boutique";

// ─── Frais fixes ────────────────────────────────────────────────────────────

/** Seuil de bascule du frais fixe de vente. */
export const SALE_FEE_THRESHOLD = 1_000_000;
/** Frais fixe de plateforme, vente d'un bien sous le seuil. */
export const SALE_FEE_BELOW = 500;
/** Frais fixe de plateforme, vente d'un bien au seuil ou au-dessus. */
export const SALE_FEE_ABOVE = 2_500;

/** Frais fixe de mise en ligne en location longue durée, selon le bail. */
export const LONG_RENTAL_FEES = {
  /** Bail court (< 6 mois). */
  court: 150,
  /** Bail médian (6 à 12 mois) — valeur retenue pour les estimations. */
  median: 250,
  /** Bail long (> 12 mois). */
  long: 400,
} as const;

// ─── Commissions marketplace ────────────────────────────────────────────────

export interface Rate {
  readonly min: number;
  readonly max: number;
}

/** Fourchette de commission marketplace, en fraction du montant encaissé. */
export const MARKETPLACE_RATE: Readonly<Record<Exclude<Pole, "vente" | "location-lt">, Rate>> = {
  "location-ct": { min: 0.05, max: 0.1 },
  service: { min: 0.05, max: 0.08 },
  evenement: { min: 0.05, max: 0.08 },
  live: { min: 0.08, max: 0.12 },
  formation: { min: 0.08, max: 0.12 },
  boutique: { min: 0.04, max: 0.08 },
};

// ─── Part apporteur ─────────────────────────────────────────────────────────

/** Part de l'apporteur, en fraction du revenu E-Dome — jamais du prix. */
export const APPORTEUR_SHARE: Rate = { min: 0.1, max: 0.3 };
export const APPORTEUR_SHARE_LABEL = "10 à 30 %";

/** Prime fixe versée pour l'activation d'un nouvel hôte (acquisition). */
export const HOST_BOUNTY_CHF = 100;

/** Revenue share B2B avec une agence partenaire (indicatif, au lancement). */
export const AGENCY_REVENUE_SHARE_LABEL = "10 à 15 %";

/** Durée de séjour retenue pour estimer une réservation courte durée. */
export const SHORT_STAY_NIGHTS = 7;

// ─── Calculs ────────────────────────────────────────────────────────────────

const round = (n: number) => Math.round(n);

export interface RevenueRange {
  /** Revenu E-Dome minimum, dans la devise de l'objet. */
  min: number;
  /** Revenu E-Dome maximum. */
  max: number;
  /** Phrase affichable expliquant l'assiette retenue. */
  label: string;
}

/**
 * Revenu qu'E-Dome perçoit sur une transaction.
 *
 * `price` s'entend selon le pôle : prix du bien en vente, loyer mensuel en
 * location longue durée, prix par nuit en courte durée, prix du billet ou
 * du contenu pour la marketplace.
 *
 * Pour un frais fixe, `min` et `max` sont égaux : il n'y a pas de
 * fourchette, c'est le principe même du forfait.
 */
export function edomeRevenue(pole: Pole, price: number): RevenueRange {
  if (pole === "vente") {
    const fee = price < SALE_FEE_THRESHOLD ? SALE_FEE_BELOW : SALE_FEE_ABOVE;
    const bound = price < SALE_FEE_THRESHOLD ? "< 1 M" : "≥ 1 M";
    return { min: fee, max: fee, label: `Frais fixe plateforme : ${fee} CHF (vente ${bound})` };
  }

  if (pole === "location-lt") {
    const fee = LONG_RENTAL_FEES.median;
    return {
      min: fee,
      max: fee,
      label: `Frais fixe plateforme : ${fee} CHF (bail médian 6–12 mois)`,
    };
  }

  const rate = MARKETPLACE_RATE[pole];
  const pct = (n: number) => `${(n * 100).toLocaleString("fr-CH")} %`;

  if (pole === "location-ct") {
    const booking = price * SHORT_STAY_NIGHTS;
    return {
      min: booking * rate.min,
      max: booking * rate.max,
      label: `Commission marketplace : ${pct(rate.min)} à ${pct(rate.max)} d'une réservation de ${SHORT_STAY_NIGHTS} nuits`,
    };
  }

  return {
    min: price * rate.min,
    max: price * rate.max,
    label: `Commission marketplace : ${pct(rate.min)} à ${pct(rate.max)}`,
  };
}

export interface EarningEstimate {
  min: number;
  max: number;
  currency: Currency;
  /** Assiette sur laquelle la part apporteur est calculée. */
  baseLabel: string;
}

/**
 * Ce que touche un apporteur s'il recommande cet objet.
 *
 * Une part du revenu E-Dome, arrondie. Pas de plancher artificiel : une
 * petite annonce rapporte peu, et l'afficher honnêtement vaut mieux qu'un
 * montant minimum inventé pour rendre le lien attirant.
 */
export function apporteurEarning(
  pole: Pole,
  price: number,
  currency: Currency = "CHF",
): EarningEstimate {
  const base = edomeRevenue(pole, price);
  return {
    min: round(base.min * APPORTEUR_SHARE.min),
    max: round(base.max * APPORTEUR_SHARE.max),
    currency,
    baseLabel: base.label,
  };
}

/** Pôle correspondant à un objet recommandable du feed ou de la marketplace. */
export function poleForReferral(
  kind: ReferralTargetKind,
  transactionType?: TransactionType,
): Pole {
  if (kind === "bien") return transactionType ?? "vente";
  if (kind === "formation") return "formation";
  if (kind === "evenement") return "evenement";
  return "boutique";
}

/**
 * Estimation affichée sur les boutons « Recommander » et dans les encarts
 * apporteur. Point d'entrée unique : le bouton et l'encart d'une même fiche
 * appellent celle-ci et affichent donc le même montant.
 */
export function estimateEarning(
  kind: ReferralTargetKind,
  price: number,
  opts?: { transactionType?: TransactionType; currency?: Currency },
): EarningEstimate {
  return apporteurEarning(
    poleForReferral(kind, opts?.transactionType),
    price,
    opts?.currency ?? "CHF",
  );
}

/** Libellé court de la part apporteur, par pôle. Sert aux cartes de liens. */
export function apporteurShareLabel(pole: Pole): string {
  const assiette =
    pole === "vente" || pole === "location-lt" ? "du frais plateforme" : "de la commission E-Dome";
  return `${APPORTEUR_SHARE_LABEL} ${assiette}`;
}
