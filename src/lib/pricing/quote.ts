import {
  ZERO,
  addMoney,
  formatMoney,
  money,
  shareOf,
  subtractMoney,
  type Money,
} from "@/lib/model/billing";
import type { PlatformRole } from "@/lib/model/identity";
import type { Charge, CommissionPole } from "./charge";
import {
  APPORTEUR_SUBSCRIPTION_SHARES,
  BOUNTIES,
  CREATOR_FOUNDING,
  EDOME_PRIME_SHARE,
  MIN_COMMISSION,
  ONE_OFFS,
  PER_UNIT_FEE,
  PLANS,
  PLATFORM_SOURCED_RATE,
  PRIME_FLOOR,
  PSP,
  RATES,
  SELLER_SOURCED_RATE,
  assertAffiliationRate,
} from "./catalog";

/* ── Le point d'entrée unique ───────────────────────────────────────────────

   Tout écran qui affiche un montant appelle `quote()`. Aucun composant ne
   recalcule un taux : c'est ce qui a permis, hier, au bouton « Recommander »
   d'annoncer 5 100 CHF pendant que l'encart juste en dessous annonçait 48 à
   143 CHF, sur la même fiche.

   `Quote.flow` alimente le panneau de flux d'argent de la Partie C tel quel —
   pas de conversion, pas de recalcul dans le composant. */

export interface MoneyFlow {
  /** Ce que paie le client, ou le montant de l'abonnement. */
  gross: Money;
  /** Frais du prestataire de paiement, toujours une ligne distincte. */
  psp: Money;
  /** Qui supporte ces frais. Décide de l'affichage, pas du calcul. */
  pspBornBy: "seller" | "platform";
  /** Part E-Dome avant reversement à l'apporteur. */
  edomeGross: Money;
  /**
   * Prélevée SUR la part E-Dome (abonnement, prime bien), jamais ajoutée au
   * prix payé. Sémantique OPPOSÉE à `affiliate` — ne pas les confondre.
   */
  apporteur: Money;
  /**
   * MÉCANIQUE MARKETPLACE : prélevée SUR LA MARGE DU VENDEUR, distincte de la
   * commission d'E-Dome (qui ne bouge pas). Non nulle uniquement sur une
   * commission avec `affiliation`. Les mélanger recréerait le facteur-5 de
   * l'audit — d'où deux champs, deux invariants, deux phrases.
   */
  affiliate: Money;
  edomeNet: Money;
  /** Vendeur, hôte, créateur, organisateur. */
  beneficiary: Money;
}

export interface QuoteLine {
  labelKey: string;
  amount: Money;
}

export interface Quote {
  payer: PlatformRole | "client";
  /** Ce que débourse effectivement le payeur. */
  payerTotal: Money;
  lines: QuoteLine[];
  flow: MoneyFlow;
  /** Phrase générée. Jamais reformulée dans un composant. */
  explanation: string;
}

export interface QuoteContext {
  /** Un apporteur est crédité sur cette transaction. */
  hasApporteur?: boolean;
  /** Le vendeur est dans sa période de tarif fondateur. */
  founding?: boolean;
}

/** Taux effectif appliqué à un pôle, attribution et tarif fondateur compris. */
export function commissionRate(
  pole: CommissionPole,
  opts?: { attribution?: "platform" | "seller"; founding?: boolean },
): number {
  if (opts?.founding && (CREATOR_FOUNDING.poles as readonly string[]).includes(pole)) {
    return CREATOR_FOUNDING.rate;
  }
  if (opts?.attribution === "seller" && SELLER_SOURCED_RATE[pole] !== undefined) {
    return SELLER_SOURCED_RATE[pole]!;
  }
  if (opts?.attribution === "platform" && PLATFORM_SOURCED_RATE[pole] !== undefined) {
    return PLATFORM_SOURCED_RATE[pole]!;
  }
  return RATES[pole].max;
}

/**
 * Calcule un devis, son flux d'argent et sa phrase d'explication.
 *
 * L'invariant `gross === beneficiary + edomeGross + affiliate (+ psp si à charge
 * vendeur)` est vérifié ici et non dans un test : une somme fausse dans un
 * panneau de flux d'argent montré à un investisseur coûte plus cher qu'un
 * plantage au développement.
 */
export function quote(charge: Charge, ctx?: QuoteContext): Quote {
  const q = build(charge, ctx);
  assertFlowBalances(q.flow);
  return q;
}

function build(charge: Charge, ctx?: QuoteContext): Quote {
  switch (charge.kind) {
    case "subscription":
      return quoteSubscription(charge, ctx);
    case "commission":
      return quoteCommission(charge, ctx);
    case "oneOff":
      return quoteOneOff(charge);
    case "cpm":
      return quoteCpm(charge);
    case "bounty":
      return quoteBounty(charge);
    case "bien-introduction":
      return quoteBienIntroduction(charge);
  }
}

// ─── Abonnement ──────────────────────────────────────────────────────────────

function quoteSubscription(
  charge: Extract<Charge, { kind: "subscription" }>,
  ctx?: QuoteContext,
): Quote {
  const plan = PLANS.find((p) => p.id === charge.planId);
  if (!plan) throw new Error(`Formule inconnue : ${charge.planId}`);

  const gross =
    charge.interval === "year" && plan.price.year ? plan.price.year : plan.price.month;

  /* Vente propre : E-Dome encaisse la totalité, elle n'a personne à reverser.
     Les frais du prestataire sont donc les siens dans les deux schémas. */
  const psp = pspFee(gross);
  const edomeGross = gross;
  /* Barème apporteur PAR FORMULE (D14) : 15 % Patrimoine, 25 % Vitrine/Mandats,
     30 % Régie. C'est le seul cas où l'apporteur se prélève encore sur la part
     E-Dome — les biens passent par la prime, la marketplace par l'affiliation. */
  const apporteur = ctx?.hasApporteur
    ? shareOf(subtractMoney(edomeGross, psp), APPORTEUR_SUBSCRIPTION_SHARES[charge.planId] ?? 0)
    : ZERO;

  return {
    payer: plan.holder === "agency" ? "agence" : "proprietaire",
    payerTotal: gross,
    lines: [{ labelKey: `plan.${plan.id}`, amount: gross }],
    flow: {
      gross,
      psp,
      pspBornBy: "platform",
      edomeGross,
      apporteur,
      affiliate: ZERO,
      edomeNet: subtractMoney(subtractMoney(edomeGross, psp), apporteur),
      beneficiary: ZERO,
    },
    explanation:
      charge.interval === "year"
        ? "Abonnement annuel, douze mois payés dix. Dû indépendamment de toute transaction."
        : "Abonnement mensuel. Dû indépendamment de toute transaction.",
  };
}

// ─── Commission ──────────────────────────────────────────────────────────────

function quoteCommission(
  charge: Extract<Charge, { kind: "commission" }>,
  ctx?: QuoteContext,
): Quote {
  const founding = charge.foundingRate ?? ctx?.founding;
  const rate = commissionRate(charge.pole, { attribution: charge.attribution, founding });

  const perUnit = PER_UNIT_FEE[charge.pole];
  const unitsFee =
    perUnit && charge.units ? money(perUnit.cents * charge.units, charge.gross.currency) : ZERO;

  const raw = addMoney(shareOf(charge.gross, rate), unitsFee);
  /* Plancher : sous ~25 CHF de panier, le prestataire prend plus que nous. Il
     ne s'applique pas à un pôle gratuit — la boutique reste à zéro. */
  const edomeGross =
    rate === 0 && unitsFee.cents === 0
      ? ZERO
      : raw.cents < MIN_COMMISSION.cents && charge.gross.currency === "CHF"
        ? MIN_COMMISSION
        : raw;

  /* MÉCANIQUE MARKETPLACE (D14) : la part affilié sort de la MARGE du vendeur,
     appliquée au PRIX (`gross`), bornée par pôle. La commission d'E-Dome
     (`edomeGross`) n'en est PAS diminuée — c'est le cœur du mandat. L'ancien
     « apporteur 10–30 % sur la part E-Dome » ne s'applique plus aux commissions,
     d'où `apporteur: ZERO` ici. */
  let affiliate: Money = ZERO;
  if (charge.affiliation) {
    assertAffiliationRate(charge.pole, charge.affiliation.rate);
    affiliate = shareOf(charge.gross, charge.affiliation.rate);
  }

  const psp = pspFee(charge.gross);

  /* Frais directs : le prestataire débite le vendeur, donc le bénéficiaire
     reçoit le brut moins la commission, moins l'affilié, moins les frais. Frais
     destinataires : E-Dome les absorbe sur sa part. La ligne `psp` existe dans
     les deux cas — c'est ce qui rend le basculement gratuit. */
  const beneficiary =
    PSP.bornBy === "seller"
      ? subtractMoney(subtractMoney(subtractMoney(charge.gross, edomeGross), affiliate), psp)
      : subtractMoney(subtractMoney(charge.gross, edomeGross), affiliate);

  const edomeNet = PSP.bornBy === "platform" ? subtractMoney(edomeGross, psp) : edomeGross;

  return {
    payer: "client",
    payerTotal: charge.gross,
    lines: [
      { labelKey: `pole.${charge.pole}`, amount: charge.gross },
      { labelKey: "commission", amount: edomeGross },
    ],
    flow: {
      gross: charge.gross,
      psp,
      pspBornBy: PSP.bornBy,
      edomeGross,
      apporteur: ZERO,
      affiliate,
      edomeNet,
      beneficiary,
    },
    explanation: explainCommission(charge.pole, rate, founding, charge.attribution, charge.affiliation?.rate),
  };
}

function explainCommission(
  pole: CommissionPole,
  rate: number,
  founding?: boolean,
  attribution?: "platform" | "seller",
  affiliationRate?: number,
): string {
  const base = commissionBase(pole, rate, founding, attribution);
  if (affiliationRate && affiliationRate > 0) {
    const aff = `${(affiliationRate * 100).toLocaleString("fr-CH")} %`;
    return `${base} Un affilié reçoit ${aff} du prix, prélevés sur votre marge — la commission d'E-Dome ne change pas.`;
  }
  return base;
}

function commissionBase(
  pole: CommissionPole,
  rate: number,
  founding?: boolean,
  attribution?: "platform" | "seller",
): string {
  if (rate === 0) {
    return "Aucune commission : ce pôle fonctionne en affiliation, le marchand rémunère E-Dome directement.";
  }
  const pct = `${(rate * 100).toLocaleString("fr-CH")} %`;
  if (founding) return `Tarif fondateur : ${pct} de ce que vous encaissez, pendant 24 mois.`;
  if (attribution === "seller") {
    return `${pct} de ce que vous encaissez, parce que vous avez amené l'acheteur.`;
  }
  if (pole === "location-ct") {
    return `${pct} de la réservation, à la charge de l'hôte. Jamais ajoutés au prix payé par le voyageur.`;
  }
  return `${pct} de ce que vous encaissez. Rien n'est dû si vous ne vendez rien.`;
}

// ─── Forfait, publicité, prime ───────────────────────────────────────────────

function quoteOneOff(charge: Extract<Charge, { kind: "oneOff" }>): Quote {
  const product = ONE_OFFS.find((o) => o.id === charge.productId);
  if (!product) throw new Error(`Forfait inconnu : ${charge.productId}`);

  const gross = money(product.price.cents * (charge.quantity ?? 1), product.price.currency);
  const psp = pspFee(gross);

  return {
    payer: "client",
    payerTotal: gross,
    lines: [{ labelKey: `oneOff.${product.id}`, amount: gross }],
    flow: {
      gross,
      psp,
      pspBornBy: "platform",
      edomeGross: gross,
      apporteur: ZERO,
      affiliate: ZERO,
      edomeNet: subtractMoney(gross, psp),
      beneficiary: ZERO,
    },
    explanation:
      "Forfait payé d'avance, indépendant du résultat. Il ne conditionne jamais la publication.",
  };
}

function quoteCpm(charge: Extract<Charge, { kind: "cpm" }>): Quote {
  /* La publicité suppose une audience qu'E-Dome n'a pas : statut « Ensuite ».
     Le calcul existe pour que le panneau de flux sache l'afficher le jour venu. */
  const gross = money(Math.round((charge.impressions / 1000) * 3500));
  const psp = pspFee(gross);

  return {
    payer: "annonceur",
    payerTotal: gross,
    lines: [{ labelKey: "cpm", amount: gross }],
    flow: {
      gross,
      psp,
      pspBornBy: "platform",
      edomeGross: gross,
      apporteur: ZERO,
      affiliate: ZERO,
      edomeNet: subtractMoney(gross, psp),
      beneficiary: ZERO,
    },
    explanation: "Campagne facturée au mille impressions. Tout contenu payant est étiqueté.",
  };
}

function quoteBounty(charge: Extract<Charge, { kind: "bounty" }>): Quote {
  const bounty = BOUNTIES[charge.event];
  return {
    payer: "admin",
    payerTotal: ZERO,
    lines: [{ labelKey: `bounty.${charge.event}`, amount: bounty.amount }],
    flow: {
      gross: ZERO,
      psp: ZERO,
      pspBornBy: "platform",
      edomeGross: ZERO,
      apporteur: bounty.amount,
      affiliate: ZERO,
      edomeNet: money(-bounty.amount.cents),
      beneficiary: ZERO,
    },
    explanation: `Prime versée après ${bounty.condition}. Jamais avant que le revenu existe.`,
  };
}

// ─── Prime de mise en relation biens (D14) ────────────────────────────────────

/**
 * Le flux se comporte comme un abonnement : E-Dome encaisse le brut (la prime),
 * puis reverse à l'apporteur. `gross = prime`, `pspBornBy = "platform"` (E-Dome
 * absorbe les frais de paiement sur sa part). La part E-Dome est
 * `max(shareOf(prime, EDOME_PRIME_SHARE), PRIME_FLOOR)` ; l'apporteur touche le
 * reste, NET (aucun PSP déduit de lui). Sur une prime de 100 CHF : apporteur 88,
 * part brute E-Dome 12, PSP ~3.45 absorbé par E-Dome, net E-Dome ~8.55.
 *
 * `beneficiary = ZERO` : le vendeur/bailleur est le PAYEUR, pas un bénéficiaire.
 * L'invariant `beneficiary + edomeGross + affiliate === gross` (branche
 * plateforme) tient : `0 + prime + 0 = prime`. C'est une sous-répartition
 * INTERNE à `edomeGross`, exactement comme un abonnement avec apporteur — d'où
 * l'écart avec la formule prose de la consigne, résolu en faveur du code de
 * `analyse2/architecture-modele.md` §B.2 (subscription-consistant, sans
 * double-compte bénéficiaire/apporteur, chiffres identiques).
 */
function quoteBienIntroduction(charge: Extract<Charge, { kind: "bien-introduction" }>): Quote {
  const prime = charge.prime;
  const edomeShare = money(
    Math.max(Math.round(prime.cents * EDOME_PRIME_SHARE), PRIME_FLOOR.cents),
    prime.currency,
  );
  const apporteur = subtractMoney(prime, edomeShare);
  const psp = pspFee(prime);

  return {
    payer: "proprietaire",
    payerTotal: prime,
    lines: [
      { labelKey: `bienIntro.${charge.pole}`, amount: prime },
      { labelKey: "primeApporteur", amount: apporteur },
    ],
    flow: {
      gross: prime,
      psp,
      pspBornBy: "platform",
      edomeGross: prime,
      apporteur,
      affiliate: ZERO,
      edomeNet: subtractMoney(subtractMoney(prime, psp), apporteur),
      beneficiary: ZERO,
    },
    explanation:
      `Prime de mise en relation de ${formatMoney(prime)}, fixée par le vendeur et due à ` +
      `l'acceptation du contact — jamais un pourcentage du prix du bien, jamais conditionnée ` +
      `à la vente. E-Dome retient ${formatMoney(edomeShare)} ` +
      `(${(EDOME_PRIME_SHARE * 100).toLocaleString("fr-CH")} %), l'apporteur reçoit ${formatMoney(apporteur)}.`,
  };
}

// ─── Outils ──────────────────────────────────────────────────────────────────

function pspFee(gross: Money): Money {
  if (gross.cents === 0) return ZERO;
  return money(Math.round(gross.cents * PSP.rate) + PSP.fixed.cents, gross.currency);
}

/**
 * Vérifie que la somme tombe juste.
 *
 * La Partie C impose un panneau où « la somme des lignes égale le montant
 * payé ». L'invariant est levé ici, à l'appel, plutôt que dans un test : il
 * n'existe pas de lanceur de tests unitaires dans ce dépôt, et un panneau faux
 * devant un investisseur coûte plus cher qu'une exception au développement.
 */
function assertFlowBalances(flow: MoneyFlow): void {
  if (flow.gross.cents === 0) return;

  /* Quatre composantes depuis D14 : la part affilié (marge vendeur) est une
     ligne du brut à part entière, au même titre que le bénéficiaire, la part
     E-Dome et les frais de paiement. `apporteur` n'y figure pas : c'est une
     sous-répartition INTERNE à `edomeGross`, pas une part du brut. */
  const parts =
    flow.pspBornBy === "seller"
      ? flow.beneficiary.cents + flow.edomeGross.cents + flow.affiliate.cents + flow.psp.cents
      : flow.beneficiary.cents + flow.edomeGross.cents + flow.affiliate.cents;

  if (parts !== flow.gross.cents) {
    throw new Error(
      `Flux d'argent incohérent : ${parts} centimes répartis pour ${flow.gross.cents} encaissés.`,
    );
  }
}
