import type { Currency, ReferralTargetKind, TransactionType } from "./types";

/* ─── Système de récompenses « Apporteur » ───────────────────────────────
   Couche ludique posée sur l'affiliation : chaque action rapporte des
   points, les points font monter de palier, et le palier débloque une part
   de commission plus élevée (10 % → 30 %, la fourchette du modèle V1.0).
   Le tout reste cohérent avec le cadrage juridique de /apporteurs : la
   rémunération est une part des revenus de plateforme d'E-Dome, jamais
   ajoutée au prix payé par le client. */

// Points gagnés par action (mock démo).
export const POINTS = {
  createLink: 50, // créer / attacher un lien d'affiliation
  share: 15, // partager un lien
  click: 5, // un clic sur votre lien
  conversion: 500, // une conversion (vente / inscription)
} as const;

export interface Tier {
  key: "bronze" | "argent" | "or" | "platine";
  name: string;
  min: number; // points requis
  share: number; // part de commission débloquée (fraction, ex 0.30)
  shareLabel: string;
  emoji: string;
  /* Classes de dégradé pour la carte de palier (Tailwind). */
  gradient: string;
  accent: string; // couleur texte/accent
}

export const TIERS: Tier[] = [
  { key: "bronze", name: "Bronze", min: 0, share: 0.10, shareLabel: "10 %", emoji: "🥉", gradient: "from-amber-700/20 to-amber-900/5", accent: "text-amber-600" },
  { key: "argent", name: "Argent", min: 1000, share: 0.15, shareLabel: "15 %", emoji: "🥈", gradient: "from-slate-400/25 to-slate-500/5", accent: "text-slate-400" },
  { key: "or", name: "Or", min: 3000, share: 0.20, shareLabel: "20 %", emoji: "🥇", gradient: "from-yellow-500/25 to-amber-500/5", accent: "text-yellow-500" },
  { key: "platine", name: "Platine", min: 8000, share: 0.30, shareLabel: "30 %", emoji: "💎", gradient: "from-cyan-400/25 to-sky-500/5", accent: "text-cyan-400" },
];

export interface TierProgress {
  current: Tier;
  next: Tier | null;
  /* Progression [0..1] vers le palier suivant. */
  progress: number;
  pointsToNext: number;
}

export function getTierProgress(points: number): TierProgress {
  let current = TIERS[0];
  for (const t of TIERS) if (points >= t.min) current = t;
  const idx = TIERS.findIndex((t) => t.key === current.key);
  const next = idx < TIERS.length - 1 ? TIERS[idx + 1] : null;
  if (!next) return { current, next: null, progress: 1, pointsToNext: 0 };
  const span = next.min - current.min;
  const progress = Math.min(1, Math.max(0, (points - current.min) / span));
  return { current, next, progress, pointsToNext: Math.max(0, next.min - points) };
}

// ─── Estimation de commission potentielle ("Gagnez jusqu'à X") ───────────

export interface EarningEstimate {
  min: number;
  max: number;
  currency: Currency;
}

/* Fourchette de commission pour une annonce donnée. Base = revenu de
   plateforme E-Dome, part apporteur 10–30 %. Cohérent avec la section
   « Devenez apporteur » de la fiche bien. */
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
