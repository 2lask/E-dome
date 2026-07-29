import type { Currency, ReferralTargetKind, TransactionType } from "./types";

/* ─── Estimation de commission ("Gagnez jusqu'à X") ───────────────────────
   Fourchette de commission apporteur pour une annonce, exprimée dans la
   devise de l'annonce. La rémunération est une prime d'apport prélevée sur
   le revenu d'E-Dome — jamais ajoutée au prix payé par le client. Le montant
   est adapté à la nature de l'objet et au type de transaction :

   · bien / vente        → commission d'apporteur d'affaires, 0,25–0,5 % du prix
   · bien / location-ct  → part sur ~1 an de réservations (prix/nuit × 3 à 6)
   · bien / location-lt  → prime d'apport ≈ 0,4 à 0,8 mois de loyer
   · formation           → 30 % du prix de l'inscription
   · événement           → 20 % du prix du billet
   · produit             → 12 % du prix de vente

   Un plancher garantit qu'un lien affiche toujours un montant motivant. */

export interface EarningEstimate {
  min: number;
  max: number;
  currency: Currency;
}

const round = (n: number) => Math.round(n);

export function estimateEarning(
  kind: ReferralTargetKind,
  price: number,
  opts?: { transactionType?: TransactionType; currency?: Currency },
): EarningEstimate {
  const currency = opts?.currency ?? "CHF";

  if (kind === "bien") {
    let min: number;
    let max: number;
    if (opts?.transactionType === "location-ct") {
      // Prix / nuit → part apporteur sur une saison de réservations.
      min = price * 3;
      max = price * 6;
    } else if (opts?.transactionType === "location-lt") {
      // Loyer mensuel → prime d'apport (fraction d'un mois de loyer).
      min = price * 0.4;
      max = price * 0.8;
    } else {
      // Vente → commission d'apporteur d'affaires (0,25–0,5 % du prix).
      min = price * 0.0025;
      max = price * 0.005;
    }
    // Plancher : un lien reste motivant même sur une petite annonce.
    return { min: round(Math.max(min, 50)), max: round(Math.max(max, 120)), currency };
  }

  // Marketplace : part directe du prix (formation 30 %, événement 20 %, produit 12 %).
  const rate = kind === "formation" ? 0.3 : kind === "evenement" ? 0.2 : 0.12;
  const max = round(price * rate);
  return { min: round(max * 0.6), max, currency };
}
