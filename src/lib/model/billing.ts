import type { Currency } from "@/lib/types";
import type { AccountId } from "./identity";
import type { AgencyId } from "./agency";

/* ── Argent et abonnements ──────────────────────────────────────────────────

   `Money` est en **centimes entiers**. Le panneau de flux d'argent de la
   Partie C doit afficher une somme qui tombe juste — « la somme des lignes
   égale le montant payé » est une épreuve automatisée, pas un vœu — et une
   addition de flottants ne tombe pas juste. Le coût est une conversion à
   l'affichage ; le bénéfice est qu'aucun écart d'un centime n'apparaîtra
   jamais dans une démonstration devant un investisseur. */

export type SubscriptionId = string;
export type PlanId = string;

/** Montant en centimes. `{ cents: 29000, currency: "CHF" }` vaut 290.00 CHF. */
export interface Money {
  readonly cents: number;
  readonly currency: Currency;
}

/**
 * Prime de mise en relation, en francs — jamais un pourcentage du prix.
 *
 * Type nominal (brand) : aucun `Money` ordinaire n'est assignable à
 * `PrimeMoney`, y compris le résultat de `shareOf(prix, taux)`. La seule
 * fabrique autorisée est `primeChf()` (`@/lib/pricing/catalog`), qui valide les
 * bornes 50–3 000 CHF à la construction. Conséquence au compilateur : passer
 * `shareOf(property.price, 0.03)` comme `prime` d'une charge `bien-introduction`
 * ne compile pas — « prime en % du prix du bien » est structurellement
 * impossible. Voir `analyse2/architecture-modele.md` §C et `DECISIONS-2.md` §D14.
 */
export type PrimeMoney = Money & { readonly __brand: "prime" };

export const money = (cents: number, currency: Currency = "CHF"): Money => ({
  cents: Math.round(cents),
  currency,
});

/** Depuis une valeur en francs. `chf(290)` vaut 290.00 CHF. */
export const chf = (amount: number): Money => money(Math.round(amount * 100), "CHF");

export const ZERO: Money = { cents: 0, currency: "CHF" };

export function addMoney(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  return { cents: a.cents + b.cents, currency: a.currency };
}

export function subtractMoney(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  return { cents: a.cents - b.cents, currency: a.currency };
}

/** Fraction d'un montant, arrondie au centime. */
export function shareOf(amount: Money, rate: number): Money {
  return { cents: Math.round(amount.cents * rate), currency: amount.currency };
}

export const isZero = (m: Money): boolean => m.cents === 0;

/** Formate un montant pour l'affichage : « 1 234.50 CHF », séparateur suisse. */
export function formatMoney(m: Money): string {
  const value = (m.cents / 100).toLocaleString("fr-CH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${value} ${m.currency}`;
}

function assertSameCurrency(a: Money, b: Money): void {
  if (a.currency !== b.currency) {
    throw new Error(`Devises incompatibles : ${a.currency} et ${b.currency}`);
  }
}

// ─── Abonnements ─────────────────────────────────────────────────────────────

/**
 * Un abonnement en cours.
 *
 * Deux choix méritent d'être expliqués.
 *
 * `holder` distingue une agence d'un compte : une agence s'abonne en tant que
 * personne morale, et son abonnement porte les droits de ses agents. Ce n'est
 * pas le même titulaire qu'un particulier qui souscrit Patrimoine.
 *
 * `unitAmount` est le montant **réellement appliqué**, pas celui du plan. Un
 * tarif fondateur gelé se lit ici. En faire une formule distincte doublerait le
 * catalogue à chaque changement de prix — et `Fondateur` n'est pas une formule,
 * c'est un prix gelé plus un badge.
 */
export interface Subscription {
  id: SubscriptionId;
  planId: PlanId;
  holder: { kind: "agency"; agencyId: AgencyId } | { kind: "account"; accountId: AccountId };
  interval: "month" | "year";
  currentPeriod: { start: string; end: string };
  status: "trialing" | "active" | "past_due" | "canceled" | "paused";
  unitAmount: Money;
  cancelAt?: string;
  /** Apporteur crédité sur ce que cet abonnement fait encaisser à E-Dome. */
  apporteurCode?: string;
  /**
   * Tarif fondateur, quand il s'applique.
   *
   * `endsAt` est écrit **à la souscription** et visible en permanence sur
   * l'écran du titulaire : l'expiration ne doit jamais être une surprise. À
   * l'échéance, passage automatique au tarif standard avec un préavis de
   * 30 jours — pas de renégociation individuelle, qui contredirait la règle
   * « prix identiques pour tous les utilisateurs d'une même formule ».
   */
  founding?: { endsAt: string; standardAmount: Money };
}

/** Préavis avant toute modification tarifaire, en jours. */
export const PRICE_CHANGE_NOTICE_DAYS = 30;
