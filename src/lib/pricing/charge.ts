import type { PlanId } from "@/lib/model/billing";
import type { Money } from "@/lib/model/billing";

/* ── Ce qu'on facture ───────────────────────────────────────────────────────

   L'ancien module appelait `Pole` un mélange de deux choses : le **domaine**
   (vente, formation, boutique) et la **mécanique** (frais fixe, pourcentage).
   D'où une porte unique, `edomeRevenue(pole, price)`, qui devait deviner la
   mécanique depuis le domaine — et qui ne pouvait pas représenter un
   abonnement, pour lequel aucune valeur de `price` n'a de sens.

   Le discriminant devient donc la **mécanique**. `quote()` sait ce qu'il
   calcule sans rien deviner, et un abonnement cesse d'être un cas tordu. */

export type OneOffId = string;

/**
 * Les pôles réellement commissionnables.
 *
 * **`vente` et `location-lt` en sont absents, et c'est le point.** Une
 * commission proportionnelle sur un bien immobilier est l'assiette du
 * courtage. En les retirant du type, `quote({ kind: "commission", pole:
 * "vente" })` devient une **erreur de compilation** — ce qui vaut mieux qu'un
 * commentaire que personne ne relit.
 *
 * Voir `DECISIONS.md` §1.1 et `@/lib/model/rules` règle 3. Et rappel, parce
 * que l'erreur a déjà été commise une fois : la règle 3 seule ne protège de
 * rien. Ce sont les règles 1 et 2 qui portent le critère de l'activité.
 */
export type CommissionPole =
  | "location-ct"
  | "service"
  | "evenement"
  | "live"
  | "formation"
  | "boutique";

export const COMMISSION_POLES: readonly CommissionPole[] = [
  "location-ct",
  "service",
  "evenement",
  "live",
  "formation",
  "boutique",
];

/**
 * Qui a amené l'acheteur.
 *
 * Décide du taux sur les formations : 10 % quand E-Dome fournit l'audience,
 * 5 % quand le créateur amène la sienne. C'est la logique d'Udemy (63 % / 3 %)
 * à une fraction du prix — on facture l'audience qu'on fournit réellement.
 */
export type Attribution = "platform" | "seller";

export type Charge =
  | { kind: "subscription"; planId: PlanId; interval: "month" | "year"; foundingRate?: boolean }
  | {
      kind: "commission";
      pole: CommissionPole;
      /** Montant encaissé par le vendeur avant commission. */
      gross: Money;
      attribution?: Attribution;
      /** Nombre de billets, pour la part fixe des événements. */
      units?: number;
      /** Tarif fondateur créateur : 5 % pendant 24 mois. */
      foundingRate?: boolean;
    }
  | { kind: "oneOff"; productId: OneOffId; quantity?: number }
  | { kind: "cpm"; campaignId: string; impressions: number }
  | { kind: "bounty"; event: "host-activated" | "user-activated" };

export interface Rate {
  readonly min: number;
  readonly max: number;
}

/** Milieu de fourchette — la valeur affichée quand une seule doit l'être. */
export const midRate = (r: Rate): number => (r.min + r.max) / 2;
