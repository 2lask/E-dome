/* Formatage suisse centralise — a utiliser PARTOUT pour les montants.
   Evite les incoherences "1 200 CHF" vs "1'200 CHF" reperees dans la demo. */

/** Groupe les milliers avec l'apostrophe suisse : 24850 -> "24'850". */
export function formatNumber(value: number, decimals = 0): string {
  const rounded = Number(value.toFixed(decimals));
  const [intPart, decPart] = Math.abs(rounded).toFixed(decimals).split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  const sign = rounded < 0 ? "-" : "";
  return decPart ? `${sign}${grouped}.${decPart}` : `${sign}${grouped}`;
}

/** Montant en francs : 24850 -> "24'850 CHF". */
export function formatCHF(value: number, decimals = 0): string {
  return `${formatNumber(value, decimals)} CHF`;
}

/** Pourcentage entier : 0.81 -> "81%". */
export function formatPercent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}
