import type { Currency, ReferralTargetKind, TransactionType } from "./types";

/* ─── Estimation de commission ("Gagnez jusqu'à X") ───────────────────────
   Fourchette de commission apporteur pour une annonce. Base = revenu de
   plateforme d'E-Dome, part apporteur 10–30 % (modèle V1.0). La rémunération
   est prélevée sur la part d'E-Dome, jamais ajoutée au prix payé par le
   client. */

export interface EarningEstimate {
  min: number;
  max: number;
  currency: Currency;
}

export function estimateEarning(
  kind: ReferralTargetKind,
  price: number,
  opts?: { transactionType?: TransactionType; currency?: Currency },
): EarningEstimate {
  const currency = opts?.currency ?? "CHF";

  if (kind === "bien") {
    let base: number;
    if (opts?.transactionType === "location-ct") base = price * 7 * 0.08; // 7 nuits × comm. 8 %
    else if (opts?.transactionType === "location-lt") base = 250; // frais fixe bail médian
    else base = price < 1_000_000 ? 500 : 2500; // frais fixe vente
    return { min: Math.round(base * 0.1), max: Math.round(base * 0.3), currency: "CHF" };
  }
  // Marketplace : part directe du prix (formation 20 %, événement 15 %, produit 10 %).
  const rate = kind === "formation" ? 0.2 : kind === "evenement" ? 0.15 : 0.1;
  const amount = Math.round(price * rate);
  return { min: amount, max: amount, currency };
}
