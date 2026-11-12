import type { Property } from "@/lib/types";
import { monthly, occupancy, total } from "@/lib/demo/derive";
import { primeSettings, currentPlanId } from "@/lib/demo/affiliation";
import type { SessionState } from "@/lib/demo/session-store";
import { sessionListings } from "@/lib/demo/session-views";
import { estimateYield, rentBreakdown, type YieldEstimate } from "./listing";

/* ── Le pôle Investisseurs, dérivé (chantier P6b) ──────────────────────────

   L'ancien tableau de bord affichait « 250 000 CHF investis, 8,2 % de
   rendement, 4 biens » — des chiffres écrits en dur que rien ne reliait au
   catalogue ni au journal. Tout ce qui s'affiche ici se calcule :

   - le portefeuille : les biens que la personne publie (catalogue + session)
     et ceux qu'elle a achetés (`soldTo`) ;
   - la courte durée : le journal, via `derive.ts` (12 mois, occupation) ;
   - la longue durée : les loyers des annonces (net, charges à part) ;
   - les opportunités : les biens à vendre, avec un rendement brut ESTIMÉ sur
     les loyers comparables du catalogue (`estimateYield`).

   Fonctions pures : `tests/data/p6b-poles.test.ts`. */

export interface ShortTermLine {
  property: Property;
  /** Encaissé sur 12 mois (nuits × tarif), CHF. */
  gross12m: number;
  /** Occupation du mois courant, 0–1. */
  occupancy: number;
}

export interface LongTermLine {
  property: Property;
  netChf: number;
  chargesChf?: number;
}

export interface SaleLine {
  property: Property;
  /** Prime de mise en relation active, en CHF, payée par le vendeur à l'acceptation. */
  primeChf?: number;
  estimate: YieldEstimate | null;
}

export interface InvestorBook {
  actorId: string;
  shortTerm: ShortTermLine[];
  longTerm: LongTermLine[];
  forSale: SaleLine[];
  /** Biens achetés (le vendeur l'a inscrit comme acheteur). */
  bought: SaleLine[];
  /** Nombre de biens en portefeuille (publiés + achetés). */
  holdings: number;
  /** Courte durée, 12 mois, CHF. */
  shortTermGross12m: number;
  /** Série mensuelle de la courte durée (12 mois). */
  shortTermSeries: { label: string; value: number }[];
  /** Loyers nets visés par les annonces longue durée, par an, CHF. */
  longTermRentRollYear: number;
  /** Demandes reçues pendant la session (visites, offres, messages) sur ses biens. */
  requests: { visits: number; offers: number; messages: number };
  /** Formule d'abonnement du compte (`patrimoine` ou `aucune`). */
  planId: string;
}

export function investorBook(actorId: string, state: SessionState, catalogue: readonly Property[]): InvestorBook {
  const published = [...catalogue.filter((p) => p.host.id === actorId && !p.soldTo), ...sessionListings(state).filter((p) => p.host.id === actorId)];
  const pool = [...catalogue];
  const primes = primeSettings(state);
  const primeOf = (id: string) => {
    const s = primes.get(id);
    return s && s.status === "active" ? s.amountChf : undefined;
  };

  const shortTerm: ShortTermLine[] = published
    .filter((p) => p.transactionType === "location-ct")
    .map((p) => ({
      property: p,
      gross12m: total({ ownerId: actorId, source: "biens", subjectId: p.id }),
      occupancy: occupancy(p.id, actorId),
    }));

  const longTerm: LongTermLine[] = published
    .filter((p) => p.transactionType === "location-lt")
    .map((p) => {
      const r = rentBreakdown(p)!;
      return { property: p, netChf: r.netChf, chargesChf: r.chargesChf };
    });

  const forSale: SaleLine[] = published
    .filter((p) => p.transactionType === "vente")
    .map((p) => ({ property: p, primeChf: primeOf(p.id), estimate: estimateYield(p, pool) }));

  const bought: SaleLine[] = catalogue
    .filter((p) => p.soldTo === actorId)
    .map((p) => ({ property: p, estimate: estimateYield(p, pool) }));

  const ids = new Set(published.map((p) => p.id));
  const requests = { visits: 0, offers: 0, messages: 0 };
  for (const e of state.events) {
    if (e.kind === "visit.requested" && e.data.toId === actorId && ids.has(e.data.propertyId)) requests.visits++;
    else if (e.kind === "offer.made" && e.data.toId === actorId && ids.has(e.data.propertyId)) requests.offers++;
    else if (e.kind === "contact.sent" && e.data.toId === actorId && e.data.propertyId && ids.has(e.data.propertyId)) requests.messages++;
  }

  return {
    actorId,
    shortTerm,
    longTerm,
    forSale,
    bought,
    holdings: published.length + bought.length,
    shortTermGross12m: shortTerm.reduce((s, l) => s + l.gross12m, 0),
    shortTermSeries: monthly({ ownerId: actorId, source: "biens" }),
    longTermRentRollYear: longTerm.reduce((s, l) => s + l.netChf * 12, 0),
    requests,
    planId: currentPlanId(state, actorId, "aucune"),
  };
}

export interface Opportunity {
  property: Property;
  estimate: YieldEstimate;
}

/** Les biens à vendre d'autres personnes, avec leur rendement brut estimé, du plus élevé au plus bas. */
export function opportunities(actorId: string, pool: readonly Property[]): Opportunity[] {
  const out: Opportunity[] = [];
  for (const p of pool) {
    if (p.soldTo || p.host.id === actorId || p.transactionType !== "vente") continue;
    const estimate = estimateYield(p, pool);
    if (estimate) out.push({ property: p, estimate });
  }
  return out.sort((a, b) => b.estimate.pct - a.estimate.pct || a.property.id.localeCompare(b.property.id));
}

/** Loyer médian au m² des locations longue durée, par ville (repère de marché, dérivé des annonces). */
export function rentPerM2ByCity(pool: readonly Property[]): { city: string; perM2: number; count: number }[] {
  const by = new Map<string, number[]>();
  for (const p of pool) {
    if (p.transactionType !== "location-lt" || !(p.area > 0)) continue;
    const r = rentBreakdown(p)!;
    by.set(p.location.city, [...(by.get(p.location.city) ?? []), r.netChf / p.area]);
  }
  return [...by.entries()]
    .map(([city, xs]) => ({ city, perM2: Math.round((xs.reduce((s, x) => s + x, 0) / xs.length) * 10) / 10, count: xs.length }))
    .sort((a, b) => b.perM2 - a.perM2 || a.city.localeCompare(b.city));
}
