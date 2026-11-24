/* ── Commission d'apport (v2) — modèle partagé, fonctions pures ──────────────
   Courtage d'indication (art. 412 ss CO) : le vendeur promet une commission à
   qui lui amène l'acheteur (ou le locataire). Deux formes :
     · fixe : 50 à 50'000 CHF ;
     · pourcentage du prix de VENTE final : 0,1 % à 3 % (vente uniquement).
   Déclencheur : à la conclusion (vente signée, bail signé — règle de l'art.
   413 CO) ou, pour un montant fixe, dès l'acceptation du contact.
   La part E-Dome (12 %, 3 CHF min.) est comprise dans la commission. */

import { apporteurNetChf } from "./my-property";
import { formatNumber } from "./format";
import type { TransactionType } from "./types";

export type CommissionKind = "fixe" | "pourcentage";
export type CommissionDue = "conclusion" | "acceptation";

export interface CommissionTerms {
  kind: CommissionKind;
  amountChf: number | null;
  ratePct: number | null;
  dueOn: CommissionDue;
}

export const FIXE_MIN_CHF = 50;
export const FIXE_MAX_CHF = 50_000;
export const RATE_MIN_PCT = 0.1;
export const RATE_MAX_PCT = 3;

/** Montant de la commission en CHF. Pourcentage : sur le prix FINAL (null tant qu'il est inconnu). */
export function commissionChf(t: CommissionTerms, salePrice: number | null): number | null {
  if (t.kind === "fixe") return t.amountChf ?? null;
  if (salePrice === null || !Number.isFinite(salePrice) || salePrice <= 0 || !t.ratePct) return null;
  return Math.round(salePrice * t.ratePct) / 100;
}

/** Estimation affichée sur une annonce (pourcentage : sur le prix demandé). */
export function estimateChf(t: CommissionTerms, listPrice: number): number | null {
  return commissionChf(t, t.kind === "pourcentage" ? listPrice : null);
}

/** Net pour l'apporteur (part E-Dome déduite). */
export function netForApporteur(grossChf: number): number {
  return apporteurNetChf(grossChf);
}

/** « CHF 2'000 » ou « 1,5 % du prix ». */
export function commissionLabel(t: CommissionTerms): string {
  if (t.kind === "fixe") return `CHF ${formatNumber(t.amountChf ?? 0)}`;
  return `${String(t.ratePct ?? 0).replace(".", ",")} % du prix`;
}

export function dueLabel(t: CommissionTerms, tx?: TransactionType): string {
  if (t.dueOn === "acceptation") return "due dès que le contact est accepté";
  return tx && tx !== "vente" ? "due à la signature du bail" : "due à la signature de la vente";
}

/** Contrôle des conditions ; renvoie un message d'erreur ou null. */
export function validateTerms(t: CommissionTerms, tx: TransactionType): string | null {
  if (tx === "location-ct") return "Pas de commission sur la location courte durée.";
  if (t.kind === "fixe") {
    const a = t.amountChf ?? NaN;
    if (!Number.isFinite(a) || a < FIXE_MIN_CHF || a > FIXE_MAX_CHF)
      return `Montant fixe de ${formatNumber(FIXE_MIN_CHF)} à ${formatNumber(FIXE_MAX_CHF)} CHF.`;
    return null;
  }
  if (tx !== "vente") return "Le pourcentage n'est possible que pour une vente.";
  if (t.dueOn !== "conclusion") return "Une commission en pourcentage est due à la signature de la vente.";
  const r = t.ratePct ?? NaN;
  if (!Number.isFinite(r) || r < RATE_MIN_PCT || r > RATE_MAX_PCT)
    return `Pourcentage de ${String(RATE_MIN_PCT).replace(".", ",")} % à ${RATE_MAX_PCT} % du prix de vente.`;
  return null;
}

/** Conditions par défaut proposées selon le type d'annonce. */
export function defaultTerms(tx: TransactionType, price: number): CommissionTerms {
  if (tx === "vente") return { kind: "pourcentage", amountChf: null, ratePct: 1, dueOn: "conclusion" };
  return { kind: "fixe", amountChf: Math.max(FIXE_MIN_CHF, Math.min(500, Math.round(price / 4 / 50) * 50 || 300)), ratePct: null, dueOn: "conclusion" };
}
