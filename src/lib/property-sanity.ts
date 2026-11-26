import { formatNumber } from "./format";
import type { TransactionType } from "./types";

/* ── Vraisemblance d'une annonce ─────────────────────────────────────────────
   Une annonce à 9'999 CHF avec 99 chambres nuit à la crédibilité de toute la
   plateforme. Bornes larges (elles n'arrêtent que l'absurde), appliquées dans
   le formulaire ET côté serveur. Testé : tests/data/property-sanity.test.ts. */

const PRICE_BOUNDS: Record<TransactionType, [number, number, string]> = {
  vente: [20_000, 200_000_000, "prix de vente"],
  "location-lt": [100, 50_000, "loyer mensuel"],
  "location-ct": [20, 10_000, "prix par nuit"],
};

export interface SanityInput {
  tx: TransactionType;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
}

export type SanityField = "price" | "area" | "rooms";

/** Première incohérence trouvée, ou null. */
export function propertySanity(p: SanityInput): { field: SanityField; message: string } | null {
  const [min, max, label] = PRICE_BOUNDS[p.tx] ?? PRICE_BOUNDS.vente;
  if (p.price > 0 && (p.price < min || p.price > max))
    return { field: "price", message: `Vérifiez le ${label} : entre ${formatNumber(min)} et ${formatNumber(max)} CHF.` };
  if (p.area > 0 && (p.area < 5 || p.area > 50_000))
    return { field: "area", message: "Vérifiez la surface : entre 5 et 50'000 m²." };
  if (p.bedrooms > 50 || p.bathrooms > 30)
    return { field: "rooms", message: "Vérifiez le nombre de chambres et de salles d'eau." };
  if (p.bedrooms > 0 && p.area > 0 && p.area / p.bedrooms < 4)
    return { field: "rooms", message: "La surface semble trop petite pour ce nombre de chambres." };
  return null;
}
