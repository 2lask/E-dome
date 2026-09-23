import type { Currency, ReferralTargetKind, TransactionType } from "@/lib/types";
import { RATES, BOUNTIES } from "./catalog";
import type { Rate } from "./charge";

/* ── Couche de compatibilité — à supprimer à l'étape 5 ──────────────────────

   Dix fichiers importent l'ancienne interface de `pricing.ts`. Les migrer tous
   dans le même commit que le nouveau moteur rendrait le diff illisible et
   mêlerait deux risques : une refonte de modèle et une réécriture d'écrans.

   Ce module les laisse donc compiler inchangés, et porte deux dettes
   explicitement datées.

   **Dette 1 — les frais fixes de l'ancien modèle.** `SALE_FEE_*` et
   `LONG_RENTAL_FEES` décrivent le modèle que la mission ABANDONNE : il
   n'existe plus aucun frais de publication de 500 ou 2 500 CHF. Ils survivent
   ici parce que `/publier` et `/admin` bâtissent encore leurs écrans dessus.
   **L'étape 5 réécrit `/publier`** — l'écran de tarification devient un écran
   d'obligations — et supprime ces constantes avec lui.

   Ils ne sont volontairement **pas** dans `catalog.ts` : le nouveau catalogue
   ne doit contenir aucun frais conditionné à une transaction immobilière, sans
   quoi quelqu'un finira par en remettre un. Et `CommissionPole` exclut déjà
   `vente` et `location-lt`, si bien qu'aucun code neuf ne peut les employer.

   **Dette 2 — une estimation au lieu d'un devis.** `estimateEarning` renvoie
   une fourchette sans payeur, sans période et sans flux d'argent.
   `quote()` fait mieux ; les écrans qui affichent un montant y passeront à
   l'étape 5, quand le panneau de flux d'argent arrivera. */

// ─── Frais fixes de l'ancien modèle — supprimés à l'étape 5 ──────────────────

/** @deprecated Modèle abandonné. Supprimé à l'étape 5 avec la réécriture de `/publier`. */
export const SALE_FEE_THRESHOLD = 1_000_000;
/** @deprecated Modèle abandonné. Supprimé à l'étape 5. */
export const SALE_FEE_BELOW = 500;
/** @deprecated Modèle abandonné. Supprimé à l'étape 5. */
export const SALE_FEE_ABOVE = 2_500;
/** @deprecated Modèle abandonné. Supprimé à l'étape 5. */
export const LONG_RENTAL_FEES = { court: 150, median: 250, long: 400 } as const;

/** @deprecated Utilisez `RATES` de `./catalog`. */
export const MARKETPLACE_RATE = RATES;

/**
 * @deprecated Utilisez `APPORTEUR_SHARES`, qui distingue abonnement,
 * commission et forfait. Cette fourchette globale sert encore aux écrans qui
 * affichent « 10 à 30 % » sans savoir de quoi.
 */
export const APPORTEUR_SHARE: Rate = { min: 0.1, max: 0.3 };

/**
 * @deprecated La prime d'hôte n'est plus versée à l'activation mais **après le
 * premier encaissement** — la fraude d'auto-parrainage est un coût, pas une
 * hypothèse. Le montant suit désormais `BOUNTIES`, d'où 60 et non 100.
 */
export const HOST_BOUNTY_CHF = BOUNTIES["host-activated"].amount.cents / 100;

/** Durée de séjour retenue pour estimer une réservation courte durée. */
export const SHORT_STAY_NIGHTS = 7;

// ─── Ancienne notion de pôle ─────────────────────────────────────────────────

/** @deprecated Mélange domaine et mécanique. Voir `Charge` de `./charge`. */
export type Pole =
  | "vente"
  | "location-lt"
  | "location-ct"
  | "service"
  | "evenement"
  | "live"
  | "formation"
  | "boutique";

export interface RevenueRange {
  min: number;
  max: number;
  label: string;
}

export interface EarningEstimate {
  min: number;
  max: number;
  currency: Currency;
  baseLabel: string;
}

const round = (n: number) => Math.round(n);

/**
 * Revenu qu'E-Dome perçoit sur une transaction.
 *
 * @deprecated Utilisez `quote()`, qui connaît le payeur, la période et le flux
 * complet. Cette fonction ne sait raisonner que par transaction avec un prix,
 * et c'est précisément ce qui la rendait incapable de représenter un
 * abonnement — la principale source de revenu du modèle retenu.
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

  const rate = RATES[pole];
  const pct = (n: number) => `${(n * 100).toLocaleString("fr-CH")} %`;
  const band = rate.min === rate.max ? pct(rate.max) : `${pct(rate.min)} à ${pct(rate.max)}`;

  if (pole === "location-ct") {
    const booking = price * SHORT_STAY_NIGHTS;
    return {
      min: booking * rate.min,
      max: booking * rate.max,
      label: `Commission marketplace : ${band} d'une réservation de ${SHORT_STAY_NIGHTS} nuits`,
    };
  }

  return {
    min: price * rate.min,
    max: price * rate.max,
    label: `Commission marketplace : ${band}`,
  };
}

/** @deprecated Utilisez `quote()` et son `MoneyFlow`. */
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

/** Pôle correspondant à un objet recommandable. */
export function poleForReferral(kind: ReferralTargetKind, transactionType?: TransactionType): Pole {
  if (kind === "bien") return transactionType ?? "vente";
  if (kind === "formation") return "formation";
  if (kind === "evenement") return "evenement";
  return "boutique";
}

/**
 * Estimation affichée sur les boutons « Recommander » et les encarts apporteur.
 *
 * @deprecated Point d'entrée unique **de l'ancien modèle**. Il garde son rôle :
 * le bouton et l'encart d'une même fiche appellent cette fonction et affichent
 * donc le même montant. L'étape 5 les fera passer à `quote()`.
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

/** Libellé court de la part apporteur, par pôle. */
export function apporteurShareLabel(pole: Pole): string {
  const assiette =
    pole === "vente" || pole === "location-lt" ? "du frais plateforme" : "de la commission E-Dome";
  return `10 à 30 % ${assiette}`;
}
