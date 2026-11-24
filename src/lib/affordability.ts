/* ── Capacité financière (règle usuelle des banques suisses) ─────────────────
   Calcul indicatif, publié par les banques elles-mêmes (UBS, PostFinance,
   BCV…) : taux THÉORIQUE de 5 % sur l'hypothèque, amortissement d'environ 1 %
   du prix, frais d'entretien d'environ 1 % du prix ; le total ne doit pas
   dépasser un tiers (33 %) du revenu brut du ménage. Fonds propres : au moins
   20 % du prix. Chaque banque applique ses propres paramètres : ce n'est ni
   un conseil, ni une offre de crédit. Testé : tests/data/affordability.test.ts. */

export const THEORETICAL_RATE = 0.05;
export const AMORTIZATION_RATE = 0.01;
export const MAINTENANCE_RATE = 0.01;
export const MAX_COST_SHARE = 1 / 3;
export const MIN_EQUITY_SHARE = 0.2;

export interface Affordability {
  loan: number;
  equityShare: number;
  annualCost: number;
  costShare: number | null;
  requiredIncome: number;
  requiredEquity: number;
  equityOk: boolean;
  incomeOk: boolean | null;
}

export function affordability(price: number, equity: number, grossIncome: number): Affordability {
  const p = Math.max(0, price);
  const e = Math.min(Math.max(0, equity), p);
  const loan = p - e;
  const annualCost = loan * THEORETICAL_RATE + p * AMORTIZATION_RATE + p * MAINTENANCE_RATE;
  const costShare = grossIncome > 0 ? annualCost / grossIncome : null;
  return {
    loan,
    equityShare: p > 0 ? e / p : 0,
    annualCost: Math.round(annualCost),
    costShare: costShare === null ? null : Math.round(costShare * 1000) / 10,
    requiredIncome: Math.round(annualCost / MAX_COST_SHARE),
    requiredEquity: Math.round(p * MIN_EQUITY_SHARE),
    equityOk: p > 0 && e >= p * MIN_EQUITY_SHARE,
    incomeOk: costShare === null ? null : costShare <= MAX_COST_SHARE + 1e-9,
  };
}
