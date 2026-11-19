/* ── RECHERCHES À RÉCOMPENSE — modèle partagé (client-safe) ──────────────────

   Le côté DEMANDE du moteur de récompenses (migration 004) :
     · logement — « je cherche un 3 pièces à Lausanne, 2'400 CHF max,
       récompense 500 CHF à qui me le trouve » ;
     · vendeurs — une agence : « 1'500 CHF pour tout propriétaire vendeur
       présenté à Neuchâtel ».
   N'importe qui propose ; l'auteur accepte (récompense due) ou refuse. */

export type SearchKind = "logement" | "vendeurs";
export type SearchTransaction = "location" | "achat";
export type AnswerStatus = "proposee" | "acceptee" | "refusee" | "contestee";

export const REWARD_MIN_CHF = 50;
export const REWARD_MAX_CHF = 3000;

export interface Search {
  id: string;
  kind: SearchKind;
  transaction: SearchTransaction;
  city: string;
  area: string;
  roomsMin: number | null;
  budgetMax: number | null;
  neededBy: string | null;
  description: string;
  rewardChf: number;
  active: boolean;
  createdAt: string;
  author: { id: string; name: string; avatar: string | null };
  /** Propositions reçues (renseigné pour l'auteur uniquement). */
  answersCount?: number;
}

export interface SearchAnswer {
  id: string;
  searchId: string;
  searchTitle: string;
  pitch: string;
  propertyId: string | null;
  rewardChf: number;
  status: AnswerStatus;
  createdAt: string;
  authorName: string;
  /** Coordonnées d'un tiers, visibles par l'auteur de la recherche APRÈS acceptation. */
  contact: { name: string; email: string | null; phone: string | null } | null;
}

/** Titre lisible d'une recherche : « Logement à louer · Lausanne · 3 p. ». */
export function searchTitle(s: Pick<Search, "kind" | "transaction" | "city" | "roomsMin">): string {
  if (s.kind === "vendeurs") return `Propriétaires vendeurs · ${s.city}`;
  const what = s.transaction === "achat" ? "Bien à acheter" : "Logement à louer";
  return `${what} · ${s.city}${s.roomsMin ? ` · ${s.roomsMin} pièces et +` : ""}`;
}

export const KIND_LABEL: Record<SearchKind, string> = {
  logement: "Cherche un logement",
  vendeurs: "Cherche des vendeurs",
};
