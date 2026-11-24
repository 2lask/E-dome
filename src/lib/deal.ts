/* ── Parcours de vente : offres et étapes jusqu'à l'acte (migration 010) ─────
   Fonctions pures, testées (tests/data/deal.test.ts). Le cadre est suisse :
   la vente d'un immeuble exige un acte authentique (art. 216 CO), signé chez
   le notaire puis inscrit au registre foncier. E-Dome suit le parcours ; il ne
   détient aucun fonds et ne rédige pas l'acte. */

export type OfferStatus = "en-attente" | "acceptee" | "refusee" | "contre-offre" | "retiree";
export type Financing = "inconnu" | "fonds-propres" | "hypotheque-en-cours" | "hypotheque-confirmee";
export type DealStepKey = "financement" | "projet-acte" | "reservation" | "acte";

export interface DealOffer {
  id: string;
  amountChf: number;
  financing: Financing;
  conditions: string;
  validUntil: string | null;
  status: OfferStatus;
  counterAmountChf: number | null;
  createdAt: string;
}

export interface Deal {
  /** false : la base n'a pas encore la migration 010. */
  ready: boolean;
  offers: DealOffer[];
  steps: Partial<Record<DealStepKey, string>>;
}

export const OFFER_STATUS_LABEL: Record<OfferStatus, string> = {
  "en-attente": "En attente",
  acceptee: "Acceptée",
  refusee: "Refusée",
  "contre-offre": "Contre-offre",
  retiree: "Retirée",
};

export const FINANCING_LABEL: Record<Financing, string> = {
  inconnu: "Financement non précisé",
  "fonds-propres": "Fonds propres",
  "hypotheque-en-cours": "Hypothèque en cours",
  "hypotheque-confirmee": "Hypothèque confirmée",
};

/** Étapes après l'accord sur le prix, dans l'ordre suisse habituel. */
export const DEAL_STEPS: { key: DealStepKey; title: string; hint: string }[] = [
  {
    key: "financement",
    title: "Financement confirmé",
    hint: "Demandez la confirmation écrite de la banque (ou la preuve des fonds propres). Pour une hypothèque, comptez en général 20 % de fonds propres.",
  },
  {
    key: "projet-acte",
    title: "Projet d'acte reçu du notaire",
    hint: "Le notaire rédige l'acte de vente. Relisez prix, date d'entrée en jouissance, servitudes et répartition des frais.",
  },
  {
    key: "reservation",
    title: "Réservation ou promesse signée",
    hint: "Facultatif : une promesse de vente se signe aussi chez le notaire. Un simple accord écrit n'oblige personne à vendre.",
  },
  {
    key: "acte",
    title: "Acte authentique signé",
    hint: "Signature chez le notaire, puis inscription au registre foncier : la vente est conclue. Indiquez alors le prix final.",
  },
];

/** L'offre de référence : l'acceptée, sinon la meilleure encore ouverte. */
export function referenceOffer(offers: DealOffer[]): DealOffer | null {
  const accepted = offers.find((o) => o.status === "acceptee");
  if (accepted) return accepted;
  const open = offers.filter((o) => o.status === "en-attente" || o.status === "contre-offre");
  return open.sort((a, b) => b.amountChf - a.amountChf)[0] ?? null;
}

/** Prix final proposé à la conclusion : l'offre acceptée (ou sa contre-offre). */
export function suggestedSalePrice(offers: DealOffer[]): number | null {
  const accepted = offers.find((o) => o.status === "acceptee");
  if (!accepted) return null;
  return accepted.counterAmountChf ?? accepted.amountChf;
}

/** Écart d'une offre au prix demandé, en % arrondi à 0,1 (négatif = en dessous). */
export function gapToAskingPct(amount: number, asking: number): number | null {
  if (!(asking > 0) || !(amount > 0)) return null;
  return Math.round(((amount - asking) / asking) * 1000) / 10;
}

/** Une offre dont la date de validité est passée (comparaison par jour). */
export function isExpired(o: Pick<DealOffer, "validUntil" | "status">, today: string): boolean {
  return o.status === "en-attente" && !!o.validUntil && o.validUntil < today;
}

/** Contrôle d'une nouvelle offre ; message d'erreur ou null. */
export function validateOffer(input: { amountChf: number; validUntil: string | null; conditions: string }, today: string): string | null {
  if (!Number.isFinite(input.amountChf) || input.amountChf < 1000) return "Indiquez le montant de l'offre (au moins 1'000 CHF).";
  if (input.amountChf >= 10_000_000_000) return "Montant invalide.";
  if (input.validUntil && !/^\d{4}-\d{2}-\d{2}$/.test(input.validUntil)) return "Date de validité invalide.";
  if (input.validUntil && input.validUntil < today) return "La date de validité est déjà passée.";
  if (input.conditions.length > 1000) return "Conditions trop longues (1'000 caractères au plus).";
  return null;
}

/** Avancement des étapes (0 à 4). */
export function stepsDone(steps: Deal["steps"]): number {
  return DEAL_STEPS.filter((s) => steps[s.key]).length;
}
