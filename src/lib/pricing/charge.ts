import type { PlanId } from "@/lib/model/billing";
import type { Money, PrimeMoney } from "@/lib/model/billing";

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
 * Miroir exact de `CommissionPole`, dans l'autre sens.
 *
 * `CommissionPole` **exclut** `vente` et `location-lt` (l'assiette du courtage).
 * `BienIntroPole` ne contient **que** ces deux-là. Le double verrou tient dans
 * les deux unions : une commission en % ne peut jamais viser un bien (déjà
 * vrai), et une prime bien ne peut jamais viser un pôle marketplace
 * (`{ kind: "bien-introduction", pole: "formation" }` ne compile pas). Voir
 * `analyse2/architecture-modele.md` §C, verrou 3.
 */
export type BienIntroPole = "vente" | "location-lt";

export const BIEN_INTRO_POLES: readonly BienIntroPole[] = ["vente", "location-lt"];

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
      /**
       * MÉCANIQUE MARKETPLACE (D14). Optionnel : absent = pas d'affilié sur
       * cette vente. `rate` s'applique au PRIX (`gross`), jamais à la commission
       * d'E-Dome ; la part affilié sort de la MARGE du vendeur, borné par pôle
       * (`AFFILIATION_RATES`, validé dans `quote()`). Ce champ n'existe QUE sur
       * `commission` : `bien-introduction` ne l'a pas (verrou par type).
       */
      affiliation?: { rate: number };
    }
  | { kind: "oneOff"; productId: OneOffId; quantity?: number }
  | { kind: "cpm"; campaignId: string; impressions: number }
  | { kind: "bounty"; event: "host-activated" | "user-activated" }
  | {
      /**
       * MÉCANIQUE BIENS (D14) : prime fixe en francs, jamais un pourcentage.
       * `prime` est un `PrimeMoney` (fabriqué par `primeChf()` seul) — un `Money`
       * ordinaire, tel `shareOf(prix, taux)`, n'y est pas assignable. Pas de champ
       * `affiliation` ici : les deux mécaniques ne se mélangent jamais.
       */
      kind: "bien-introduction";
      pole: BienIntroPole;
      prime: PrimeMoney;
    };

export interface Rate {
  readonly min: number;
  readonly max: number;
}

/** Milieu de fourchette — la valeur affichée quand une seule doit l'être. */
export const midRate = (r: Rate): number => (r.min + r.max) / 2;
