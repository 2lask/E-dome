"use server";

import { createClient } from "./server";
import { coverOf } from "../my-property";
import type { CommissionTerms } from "../commission";
import {
  computeApporteur, computeSeller,
  type ApporteurStats, type EventRow, type LeadRow, type Period, type PropRow, type SellerStats,
} from "../dashboard-stats";
import type { PropertyType } from "../types";

/* ── Actions serveur : TABLEAU DE BORD ───────────────────────────────────────
   Tout est lu sous la session de la personne : la RLS ne lui montre que les
   événements et leads de SES biens (vendeur) ou de SES liens (apporteur).
   Base sans migration 009 : `ready: false`, les leads 002 restent comptés. */

export interface Dashboard {
  ready: boolean;
  seller: SellerStats | null;
  apporteur: ApporteurStats | null;
  propertyIds: string[];
  linkIds: string[];
  generatedAt: number;
}

type InqRow = {
  id: string; property_id: string; status: string; created_at: string;
  closed_at?: string | null; sale_price?: number | null; apporteur_id?: string | null;
  commission_kind?: string | null; commission_amount_chf?: number | null; commission_rate_pct?: number | null; commission_due_on?: string | null;
  apporteur?: { first_name: string; last_name: string } | null;
};

const V2 = "id, property_id, status, created_at, closed_at, sale_price, apporteur_id, commission_kind, commission_amount_chf, commission_rate_pct, commission_due_on, apporteur:profiles!apporteur_id ( first_name, last_name )";
const V1 = "id, property_id, status, created_at";

function toLead(r: InqRow): LeadRow {
  const terms: CommissionTerms | null = r.commission_kind
    ? {
        kind: r.commission_kind === "pourcentage" ? "pourcentage" : "fixe",
        amountChf: r.commission_amount_chf == null ? null : Number(r.commission_amount_chf),
        ratePct: r.commission_rate_pct == null ? null : Number(r.commission_rate_pct),
        dueOn: r.commission_due_on === "acceptation" ? "acceptation" : "conclusion",
      }
    : null;
  return {
    id: r.id,
    property_id: r.property_id,
    status: r.status,
    created_at: r.created_at,
    closed_at: r.closed_at ?? null,
    sale_price: r.sale_price == null ? null : Number(r.sale_price),
    apporteur_id: r.apporteur_id ?? null,
    apporteur_name: r.apporteur ? `${r.apporteur.first_name} ${r.apporteur.last_name}`.trim() || "Apporteur" : null,
    terms,
  };
}

type PropDb = { id: string; title: string; price: number; images: string[] | null; type: string };
const propRow = (p: PropDb): PropRow => ({
  id: p.id,
  title: p.title,
  price: Number(p.price),
  cover: coverOf({ images: p.images ?? [], type: p.type as PropertyType }),
});

/* Leads apportés, SANS donnée de l'acheteur : fonction `my_apport_leads`
   (migration 010). Base sans 010 : lecture restreinte aux mêmes colonnes. */
const SAFE = "id, property_id, status, created_at, closed_at, sale_price, commission_kind, commission_amount_chf, commission_rate_pct, commission_due_on";
async function apporteurLeads(supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>, userId: string) {
  const rpc = await supabase.rpc("my_apport_leads");
  if (!rpc.error) return rpc;
  return supabase.from("inquiries").select(SAFE).eq("apporteur_id", userId).limit(5000);
}

export async function getDashboard(period: Period): Promise<Dashboard | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const now = Date.now();
  const since = new Date(now - 90 * 86_400_000).toISOString();

  /* ── Côté vendeur ── */
  const { data: propsData } = await supabase.from("properties").select("id, title, price, images, type").eq("host_id", user.id);
  const props = ((propsData ?? []) as PropDb[]).map(propRow);
  const ids = props.map((p) => p.id);

  let ready = true;
  let events: EventRow[] = [];
  if (ids.length) {
    const ev = await supabase
      .from("property_events")
      .select("property_id, kind, link_id, visitor, created_at")
      .in("property_id", ids)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(20000);
    if (ev.error) ready = false;
    else events = (ev.data ?? []) as EventRow[];
  }

  let leadsRes = await supabase.from("inquiries").select(V2).eq("seller_id", user.id).gte("created_at", since).limit(5000);
  if (leadsRes.error) {
    ready = false;
    leadsRes = (await supabase.from("inquiries").select(V1).eq("seller_id", user.id).gte("created_at", since).limit(5000)) as typeof leadsRes;
  }
  const sellerLeads = ((leadsRes.data ?? []) as unknown as InqRow[]).map(toLead);
  const seller = ids.length || sellerLeads.length ? computeSeller(period, now, props, events, sellerLeads) : null;

  /* ── Côté apporteur ── */
  let apporteur: ApporteurStats | null = null;
  let linkIds: string[] = [];
  const linksRes = await supabase
    .from("apport_links")
    .select("id, code, property:properties!property_id ( id, title, price, images, type )")
    .eq("apporteur_id", user.id);
  if (!linksRes.error && (linksRes.data ?? []).length) {
    type L = { id: string; code: string; property: PropDb | PropDb[] | null };
    const links = ((linksRes.data ?? []) as unknown as L[])
      .map((l) => ({ id: l.id, code: l.code, prop: Array.isArray(l.property) ? l.property[0] : l.property }))
      .filter((l): l is { id: string; code: string; prop: PropDb } => !!l.prop)
      .map((l) => ({ id: l.id, code: l.code, property: propRow(l.prop) }));
    linkIds = links.map((l) => l.id);
    const [ev, ld] = await Promise.all([
      supabase.from("property_events").select("property_id, kind, link_id, visitor, created_at").in("link_id", linkIds).gte("created_at", since).limit(20000),
      apporteurLeads(supabase, user.id),
    ]);
    apporteur = computeApporteur(
      period, now, links,
      ev.error ? [] : ((ev.data ?? []) as EventRow[]),
      ld.error ? [] : ((ld.data ?? []) as unknown as InqRow[]).map(toLead),
    );
  }

  return { ready, seller, apporteur, propertyIds: ids, linkIds, generatedAt: now };
}
