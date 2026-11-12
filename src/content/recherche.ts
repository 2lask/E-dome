import type { QueryToken } from "@/lib/search/query";
import type { TransactionType } from "@/lib/types";

/* ── Textes de la recherche (chantier P6b) ──────────────────────────────────

   La requête libre est découpée en puces (`src/lib/search/query.ts`). Ici :
   comment chaque puce se lit, les exemples proposés et l'état vide. */

const group = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "'");

const TRANSACTION_LABEL: Record<TransactionType, string> = {
  vente: "À vendre",
  "location-lt": "À louer à l'année",
  "location-ct": "Séjour à la nuit",
};

const KIND_LABEL: Record<string, string> = {
  appartement: "Appartement",
  studio: "Studio",
  maison: "Maison ou villa",
  chalet: "Chalet",
  riad: "Riad",
  penthouse: "Attique",
  terrain: "Terrain",
};

export const recherche = {
  title: "Recherche",
  placeholder: "« 3 pièces Lausanne moins de 2500 », « chalet Verbier »…",
  emptyTitle: "Rechercher sur E-Dome",
  emptyText: "Écrivez comme vous parlez : une ville, un nombre de pièces, un budget, « louer » ou « acheter ». On en fait des filtres.",
  examplesTitle: "Essayez",
  examples: [
    "3 pièces Lausanne moins de 2500",
    "chalet Verbier",
    "4,5 pièces à louer Renens",
    "acheter Neuchâtel moins de 1 M",
    "vacances Montreux",
    "maison à vendre",
  ],
  recentTitle: "Recherches récentes",
  clearRecent: "Tout effacer",
  filtersTitle: "Filtres compris",
  removeChip: (label: string) => `Retirer le filtre « ${label} »`,
  inferredHint: "Déduit du budget",
  ignored: (words: string) => `Mots ignorés : ${words}`,
  results: (n: number, q: string) => `${n} résultat${n > 1 ? "s" : ""} pour « ${q} »`,
  noResultTitle: "Aucun bien ne correspond",
  noResultText: (q: string) => `Rien pour « ${q} ». Élargissez un filtre :`,
  suggestionRemove: (label: string, n: number) => `Sans « ${label} » · ${n} bien${n > 1 ? "s" : ""}`,
  suggestionCity: (city: string, n: number) => `À ${city}, tout près · ${n} bien${n > 1 ? "s" : ""}`,
  noResultOther: "Ou essayez une de ces recherches :",
  sessionBadge: "Publié pendant la démo",
  yieldBadge: (pct: string) => `${pct} brut estimé`,
  sectionBiens: "Biens immobiliers",
  seeOnExplorer: "Ouvrir l'explorateur",
  chip(token: QueryToken): string {
    switch (token.kind) {
      case "city":
        return String(token.value);
      case "rooms":
        return `${String(token.value).replace(".", ",")} pièces`;
      case "bedrooms":
        return `${token.value} chambres et +`;
      case "priceMax":
        return `Jusqu'à ${group(Number(token.value))} CHF`;
      case "priceMin":
        return `Dès ${group(Number(token.value))} CHF`;
      case "transaction":
        return TRANSACTION_LABEL[token.value as TransactionType];
      case "type":
        return KIND_LABEL[String(token.value)] ?? String(token.value);
    }
  },
  transactionLabel: (t: TransactionType) => TRANSACTION_LABEL[t],
} as const;
