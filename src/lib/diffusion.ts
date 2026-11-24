import { formatNumber } from "./format";
import type { MyProperty } from "./my-property";

/* Texte d'annonce prêt à coller sur un portail ou dans un groupe (kit de
   diffusion de « Mes biens »). Testé : tests/data/affordability.test.ts (K1). */

const UNIT: Record<string, string> = { vente: "", "location-lt": " / mois", "location-ct": " / nuit" };

export function listingText(p: Pick<MyProperty, "title" | "city" | "price" | "transactionType" | "area" | "bedrooms" | "description">, url: string): string {
  const facts = [
    p.transactionType === "vente" ? "À vendre" : "À louer",
    p.city,
    p.area > 0 ? `${p.area} m²` : null,
    p.bedrooms > 0 ? `${p.bedrooms} chambre${p.bedrooms > 1 ? "s" : ""}` : null,
  ].filter(Boolean).join(" · ");
  return [
    p.title,
    `CHF ${formatNumber(p.price)}${UNIT[p.transactionType] ?? ""} · ${facts}`,
    "",
    p.description.trim(),
    "",
    `Photos, vidéo et demande de visite : ${url}`,
    "Vente directe par le propriétaire, sans commission d'agence.",
  ].join("\n");
}

