/* ─── Moteur de calcul immobilier (pur, sans I/O) ─────────────────────────
   Source unique de vérité pour les calculs financiers immobiliers, partagée
   par les outils de l'IA (src/lib/ai/tools.ts) et, à terme, l'UI. Toutes les
   fonctions sont pures et déterministes : aucun accès réseau, aucune donnée
   externe. Les hypothèses par défaut (charges, vacance, taux) sont explicites
   et surchargeables — l'IA doit toujours expliquer celles qu'elle a utilisées.

   Modèle locatif : le rendement brut = loyer annuel / prix. Le rendement net
   déduit charges non récupérables, vacance et taxe foncière. Le cash-flow
   déduit en plus la mensualité de prêt. Rien ici n'est un conseil financier ;
   ce sont des estimations à vérifier. */

export interface YieldInput {
  price: number; // prix d'achat (frais inclus si fournis via `notaryFees`)
  monthlyRent: number; // loyer mensuel (charges non comprises)
  chargesRate?: number; // charges non récupérables, % du loyer (défaut 20%)
  vacancyRate?: number; // vacance locative, % (défaut 5%)
  propertyTaxYearly?: number; // taxe foncière / impôt annuel (défaut 0)
}

export interface YieldResult {
  annualRent: number;
  grossYield: number; // %
  netYield: number; // %
  annualCharges: number;
  annualVacancyLoss: number;
  netAnnualIncome: number;
  assumptions: { chargesRate: number; vacancyRate: number; propertyTaxYearly: number };
}

export function computeYield(input: YieldInput): YieldResult {
  const chargesRate = input.chargesRate ?? 0.2;
  const vacancyRate = input.vacancyRate ?? 0.05;
  const propertyTaxYearly = input.propertyTaxYearly ?? 0;

  const annualRent = round2(input.monthlyRent * 12);
  const annualVacancyLoss = round2(annualRent * vacancyRate);
  const annualCharges = round2(annualRent * chargesRate);
  const netAnnualIncome = round2(annualRent - annualVacancyLoss - annualCharges - propertyTaxYearly);

  return {
    annualRent,
    grossYield: input.price > 0 ? round2((annualRent / input.price) * 100) : 0,
    netYield: input.price > 0 ? round2((netAnnualIncome / input.price) * 100) : 0,
    annualCharges,
    annualVacancyLoss,
    netAnnualIncome,
    assumptions: { chargesRate, vacancyRate, propertyTaxYearly },
  };
}

export interface MortgageInput {
  principal: number; // montant emprunté
  annualRatePct: number; // taux annuel nominal, en % (ex: 2.5)
  years: number; // durée en années
}

export interface MortgageResult {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
}

/* Mensualité d'un prêt amortissable classique (formule des annuités
   constantes). Taux 0 → simple division. */
export function computeMortgage(input: MortgageInput): MortgageResult {
  const n = Math.round(input.years * 12);
  const r = input.annualRatePct / 100 / 12;
  if (n <= 0 || input.principal <= 0) return { monthlyPayment: 0, totalPaid: 0, totalInterest: 0 };
  const monthly =
    r === 0 ? input.principal / n : (input.principal * r) / (1 - Math.pow(1 + r, -n));
  const monthlyPayment = round2(monthly);
  const totalPaid = round2(monthlyPayment * n);
  return { monthlyPayment, totalPaid, totalInterest: round2(totalPaid - input.principal) };
}

export interface CashflowInput extends YieldInput {
  downPayment: number; // apport
  loanRatePct: number; // taux du prêt (%)
  loanYears: number; // durée du prêt (années)
}

export interface CashflowResult {
  yield: YieldResult;
  loanAmount: number;
  mortgage: MortgageResult;
  monthlyNetIncome: number; // revenu net mensuel avant prêt
  monthlyCashflow: number; // après mensualité de prêt
  annualCashflow: number;
  cashOnCash: number; // % : cash-flow annuel / apport
}

/* Cash-flow mensuel : revenu net (après charges/vacance/taxe) moins la
   mensualité de prêt. cash-on-cash = cash-flow annuel / apport. */
export function computeCashflow(input: CashflowInput): CashflowResult {
  const y = computeYield(input);
  const loanAmount = Math.max(0, round2(input.price - input.downPayment));
  const mortgage = computeMortgage({
    principal: loanAmount,
    annualRatePct: input.loanRatePct,
    years: input.loanYears,
  });
  const monthlyNetIncome = round2(y.netAnnualIncome / 12);
  const monthlyCashflow = round2(monthlyNetIncome - mortgage.monthlyPayment);
  const annualCashflow = round2(monthlyCashflow * 12);
  return {
    yield: y,
    loanAmount,
    mortgage,
    monthlyNetIncome,
    monthlyCashflow,
    annualCashflow,
    cashOnCash: input.downPayment > 0 ? round2((annualCashflow / input.downPayment) * 100) : 0,
  };
}

export interface RoiInput {
  price: number;
  annualCashflow: number;
  appreciationPctYearly: number; // plus-value annuelle estimée (%)
  years: number;
}

/* Projection ROI simple : cumul des cash-flows + plus-value composée sur la
   période, rapporté au prix. Illustratif, pas un modèle actuariel. */
export function projectRoi(input: RoiInput): { totalReturn: number; roiPct: number; futureValue: number } {
  const futureValue = round2(input.price * Math.pow(1 + input.appreciationPctYearly / 100, input.years));
  const appreciation = round2(futureValue - input.price);
  const cumulativeCashflow = round2(input.annualCashflow * input.years);
  const totalReturn = round2(appreciation + cumulativeCashflow);
  return {
    futureValue,
    totalReturn,
    roiPct: input.price > 0 ? round2((totalReturn / input.price) * 100) : 0,
  };
}

export function pricePerM2(price: number, area: number): number {
  return area > 0 ? Math.round(price / area) : 0;
}

/* Estimation par comparables : médiane du prix/m² des biens de référence
   appliquée à la surface. Renvoie une fourchette ±spread. */
export function estimateByComparables(
  area: number,
  comparablePricePerM2: number[],
  spread = 0.1,
): { estimate: number; low: number; high: number; medianPricePerM2: number } {
  const median = medianOf(comparablePricePerM2);
  const estimate = Math.round(median * area);
  return {
    medianPricePerM2: Math.round(median),
    estimate,
    low: Math.round(estimate * (1 - spread)),
    high: Math.round(estimate * (1 + spread)),
  };
}

// ─── utils ───────────────────────────────────────────────────────────────
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
function medianOf(arr: number[]): number {
  if (arr.length === 0) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}
