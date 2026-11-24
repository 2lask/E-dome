/* ── Tableau de bord — calculs (fonctions pures, testées) ────────────────────
   Entrées : les événements de suivi (vues, partages…), les demandes (leads) et
   leur avancement, lus sous la session de la personne (RLS). Sorties : les
   indicateurs d'un vendeur (ou d'une agence) et ceux d'un apporteur. */

import { commissionChf, netForApporteur, type CommissionTerms } from "./commission";

export type Period = 7 | 30 | 90;
export const PERIODS: Period[] = [7, 30, 90];

export interface EventRow { property_id: string; kind: string; link_id: string | null; visitor: string; created_at: string }
export interface LeadRow {
  id: string;
  property_id: string;
  status: string;
  created_at: string;
  closed_at: string | null;
  sale_price: number | null;
  apporteur_id: string | null;
  apporteur_name: string | null;
  terms: CommissionTerms | null;
}
export interface PropRow { id: string; title: string; price: number; cover: string }

export interface DayPoint { day: string; views: number; leads: number }

export interface SellerStats {
  views: number;
  visitors: number;
  shares: number;
  videoPlays: number;
  leads: number;
  visits: number;
  offers: number;
  sales: number;
  revenue: number;
  commissions: number;
  net: number;
  conversion: number;
  pipelineValue: number;
  series: DayPoint[];
  funnel: { label: string; value: number }[];
  topListings: { id: string; title: string; cover: string; views: number; leads: number; conversion: number }[];
  topApporteurs: { name: string; leads: number; sales: number; commissions: number }[];
  /** Part des vues venues d'un lien d'apporteur. */
  viaApporteurs: number;
}

const ADVANCED = new Set(["visite", "offre", "conclue"]);

/** Jours (AAAA-MM-JJ, UTC) de la période, du plus ancien au plus récent. */
export function daysOf(period: Period, now: number): string[] {
  return Array.from({ length: period }, (_, i) => new Date(now - (period - 1 - i) * 86_400_000).toISOString().slice(0, 10));
}

const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 1000) / 10 : 0);

export function computeSeller(
  period: Period,
  now: number,
  props: PropRow[],
  events: EventRow[],
  leads: LeadRow[],
): SellerStats {
  const since = now - period * 86_400_000;
  const inRange = (iso: string | null) => !!iso && new Date(iso).getTime() >= since;
  const ev = events.filter((e) => inRange(e.created_at));
  const views = ev.filter((e) => e.kind === "vue");
  const ld = leads.filter((l) => inRange(l.created_at));
  const sold = leads.filter((l) => l.status === "conclue" && inRange(l.closed_at ?? l.created_at));

  const commissionOf = (l: LeadRow) => (l.terms && l.apporteur_id ? commissionChf(l.terms, l.sale_price) ?? 0 : 0);
  const revenue = sold.reduce((t, l) => t + (l.sale_price ?? 0), 0);
  const commissions = sold.reduce((t, l) => t + commissionOf(l), 0);
  const visitors = new Set(views.map((v) => v.visitor).filter(Boolean)).size;

  const days = daysOf(period, now);
  const series: DayPoint[] = days.map((day) => ({
    day,
    views: views.filter((v) => v.created_at.slice(0, 10) === day).length,
    leads: ld.filter((l) => l.created_at.slice(0, 10) === day).length,
  }));

  const visits = ld.filter((l) => ADVANCED.has(l.status)).length;
  const offers = ld.filter((l) => l.status === "offre" || l.status === "conclue").length;

  const priceOf = new Map(props.map((p) => [p.id, p.price]));
  const openOffers = leads.filter((l) => l.status === "offre");
  const pipelineValue = [...new Set(openOffers.map((l) => l.property_id))].reduce((t, id) => t + (priceOf.get(id) ?? 0), 0);

  const topListings = props
    .map((p) => {
      const v = views.filter((e) => e.property_id === p.id).length;
      const l = ld.filter((x) => x.property_id === p.id).length;
      return { id: p.id, title: p.title, cover: p.cover, views: v, leads: l, conversion: pct(l, Math.max(v, l)) };
    })
    .sort((a, b) => b.leads - a.leads || b.views - a.views)
    .slice(0, 6);

  const byApp = new Map<string, { name: string; leads: number; sales: number; commissions: number }>();
  for (const l of leads) {
    if (!l.apporteur_id) continue;
    const a = byApp.get(l.apporteur_id) ?? { name: l.apporteur_name ?? "Apporteur", leads: 0, sales: 0, commissions: 0 };
    if (inRange(l.created_at)) a.leads += 1;
    if (l.status === "conclue" && inRange(l.closed_at ?? l.created_at)) { a.sales += 1; a.commissions += commissionOf(l); }
    byApp.set(l.apporteur_id, a);
  }

  return {
    views: views.length,
    visitors,
    shares: ev.filter((e) => e.kind === "partage").length,
    videoPlays: ev.filter((e) => e.kind === "video").length,
    leads: ld.length,
    visits,
    offers,
    sales: sold.length,
    revenue,
    commissions,
    net: revenue - commissions,
    /* Un lead est aussi un visiteur (même sans vue comptée : propriétaire,
       déduplication) : la conversion ne dépasse jamais 100 %. */
    conversion: pct(ld.length, Math.max(visitors || views.length, ld.length)),
    pipelineValue,
    series,
    funnel: [
      { label: "Visiteurs", value: Math.max(visitors, ld.length) },
      { label: "Leads", value: ld.length },
      { label: "Visites", value: visits },
      { label: "Offres", value: offers },
      { label: "Ventes", value: sold.length },
    ],
    topListings,
    topApporteurs: [...byApp.values()].filter((a) => a.leads || a.sales).sort((a, b) => b.commissions - a.commissions || b.leads - a.leads).slice(0, 6),
    viaApporteurs: pct(views.filter((v) => v.link_id).length, views.length),
  };
}

export interface ApporteurStats {
  clicks: number;
  visitors: number;
  leads: number;
  sales: number;
  revenueGenerated: number;
  commissionsEarned: number;
  commissionsPending: number;
  series: DayPoint[];
  links: { propertyId: string; title: string; cover: string; code: string; clicks: number; leads: number; sales: number; earned: number }[];
  /** Mes leads, sans aucune donnée de l'acheteur : bien, étape, gain (net, estimé si pas encore vendu). */
  leadList: { id: string; propertyId: string; title: string; cover: string; status: string; createdAt: string; netChf: number; final: boolean }[];
}

export function computeApporteur(
  period: Period,
  now: number,
  links: { id: string; code: string; property: PropRow }[],
  events: EventRow[],
  leads: LeadRow[],
): ApporteurStats {
  const since = now - period * 86_400_000;
  const inRange = (iso: string | null) => !!iso && new Date(iso).getTime() >= since;
  const mine = new Set(links.map((l) => l.id));
  const clicks = events.filter((e) => e.kind === "vue" && e.link_id && mine.has(e.link_id) && inRange(e.created_at));
  const ld = leads.filter((l) => inRange(l.created_at));
  const sold = leads.filter((l) => l.status === "conclue" && inRange(l.closed_at ?? l.created_at));
  /* L'apporteur voit ce qu'il TOUCHE : le net, part E-Dome déduite. */
  const commissionOf = (l: LeadRow) => { const g = l.terms ? commissionChf(l.terms, l.sale_price) ?? 0 : 0; return g > 0 ? netForApporteur(g) : 0; };
  const open = leads.filter((l) => l.status !== "conclue" && l.status !== "fermee");

  const days = daysOf(period, now);
  return {
    clicks: clicks.length,
    visitors: new Set(clicks.map((c) => c.visitor).filter(Boolean)).size,
    leads: ld.length,
    sales: sold.length,
    revenueGenerated: sold.reduce((t, l) => t + (l.sale_price ?? 0), 0),
    commissionsEarned: sold.reduce((t, l) => t + commissionOf(l), 0),
    /* Fixe : le montant ; pourcentage : estimé au prix demandé. */
    commissionsPending: open.reduce((t, l) => {
      const price = links.find((x) => x.property.id === l.property_id)?.property.price ?? 0;
      const g = l.terms ? commissionChf(l.terms, l.terms.kind === "pourcentage" ? price : null) ?? 0 : 0;
      return t + (g > 0 ? netForApporteur(g) : 0);
    }, 0),
    series: days.map((day) => ({
      day,
      views: clicks.filter((c) => c.created_at.slice(0, 10) === day).length,
      leads: ld.filter((l) => l.created_at.slice(0, 10) === day).length,
    })),
    links: links.map((l) => {
      const s = leads.filter((x) => x.property_id === l.property.id);
      return {
        propertyId: l.property.id,
        title: l.property.title,
        cover: l.property.cover,
        code: l.code,
        clicks: clicks.filter((c) => c.link_id === l.id).length,
        leads: s.filter((x) => inRange(x.created_at)).length,
        sales: s.filter((x) => x.status === "conclue").length,
        earned: s.filter((x) => x.status === "conclue").reduce((t, x) => t + commissionOf(x), 0),
      };
    }).sort((a, b) => b.earned - a.earned || b.leads - a.leads || b.clicks - a.clicks),
    leadList: [...leads]
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 50)
      .map((l) => {
        const prop = links.find((x) => x.property.id === l.property_id)?.property;
        const final = l.status === "conclue";
        const g = l.terms ? commissionChf(l.terms, final ? l.sale_price : l.terms.kind === "pourcentage" ? prop?.price ?? null : null) ?? 0 : 0;
        return {
          id: l.id,
          propertyId: l.property_id,
          title: prop?.title ?? "Bien",
          cover: prop?.cover ?? "",
          status: l.status,
          createdAt: l.created_at,
          netChf: l.status === "fermee" ? 0 : g > 0 ? netForApporteur(g) : 0,
          final,
        };
      }),
  };
}
