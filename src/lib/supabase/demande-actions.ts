"use server";

import { notifyUser } from "../email/notify";
import { apporteurNetChf as netOf } from "../my-property";

import { z } from "zod";
import { createClient } from "./server";
import { createAdminClient } from "./admin";
import { createDossierShareFor } from "./dossier-server";
import { attributionFor } from "./apport-server";
import { coverOf } from "../my-property";
import type { PropertyType } from "../types";
import type {
  Demande,
  DemandeEvent,
  DemandeKind,
  DemandeStatus,
  PendingIntroduction,
} from "../demandes";

/* ── Actions serveur : DEMANDES (REBUILD.md §3.4) ────────────────────────────

   Règles :
   · une demande NAÎT côté serveur — le vendeur est déduit du bien, jamais
     choisi par le client (table `inquiries` sans politique d'insertion) ;
   · le vendeur lit / fait avancer SES demandes (RLS) ;
   · une mise en relation n'est décidée que par le vendeur (RLS + déclencheur) ;
     à l'acceptation, les coordonnées apportées deviennent une demande « apport ».

   Requiert la migration `supabase/migrations/002_demandes.sql`. */

type Ok<T = object> = ({ ok: true } & T) | { ok: false; error: string };

async function me() {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, user: null } as const;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user } as const;
}

type PropJoin = { id: string; title: string; city: string; type: string; images: string[] | null } | null;

const propOf = (p: PropJoin) => ({
  id: p?.id ?? "",
  title: p?.title ?? "Bien supprimé",
  city: p?.city ?? "",
  cover: coverOf({ images: p?.images ?? [], type: (p?.type ?? "appartement") as PropertyType }),
});

const nameOf = (p: { first_name: string; last_name: string } | null | undefined, fallback: string) =>
  p ? `${p.first_name} ${p.last_name}`.trim() || fallback : fallback;

/* ── Créer une demande (depuis la fiche d'un bien) ──────────────────────── */

const InquiryInput = z
  .object({
    propertyId: z.string().uuid(),
    kind: z.enum(["contact", "visite"]),
    name: z.string().trim().min(2, "Indiquez votre nom.").max(80),
    email: z.string().trim().email("E-mail invalide.").max(160).optional().or(z.literal("")),
    phone: z.string().trim().max(40).optional().or(z.literal("")),
    message: z.string().trim().max(2000).default(""),
    preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
    /** Pot de miel anti-robots : un humain ne remplit jamais ce champ caché. */
    website: z.string().optional(),
    /** Joindre mon dossier de location (personne connectée uniquement). */
    attachDossier: z.boolean().optional(),
  })
  .refine((v) => Boolean(v.email) || Boolean(v.phone), {
    message: "Laissez un e-mail ou un téléphone pour être recontacté.",
  });

export async function createInquiry(raw: z.input<typeof InquiryInput>): Promise<Ok> {
  const parsed = InquiryInput.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  const v = parsed.data;
  if (v.website) return { ok: true }; // robot : on fait comme si.

  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "Service momentanément indisponible." };

  const { data: prop } = await admin.from("properties").select("id, host_id, title").eq("id", v.propertyId).maybeSingle();
  if (!prop) return { ok: false, error: "Ce bien n'existe plus." };

  const { user } = await me();
  if (user && user.id === prop.host_id) return { ok: false, error: "C'est votre propre bien." };

  /* Dossier joint : jeton créé pour la personne CONNECTÉE elle-même, lié à ce
     bien (la colonne n'est écrite que si le jeton existe : migration 005). */
  const dossierToken = user && v.attachDossier ? await createDossierShareFor(user.id, prop.id) : null;

  /* Venu par le lien d'un apporteur ? Lead attribué, commission figée (009). */
  const attribution = await attributionFor(prop.id, prop.host_id, user?.id ?? null);

  const insertInquiry = (extra: Record<string, unknown>) => admin
    .from("inquiries")
    .insert({
      ...extra,
      ...(dossierToken ? { dossier_token: dossierToken } : {}),
      property_id: prop.id,
      seller_id: prop.host_id,
      sender_id: user?.id ?? null,
      sender_name: v.name,
      sender_email: v.email || null,
      sender_phone: v.phone || null,
      kind: v.kind,
      message: v.message,
      preferred_date: v.kind === "visite" && v.preferredDate ? v.preferredDate : null,
    })
    .select("id")
    .single();
  let { data: inq, error } = await insertInquiry(attribution ? { ...attribution } : {});
  /* Base sans migration 009 : on enregistre la demande sans attribution. */
  if (error && attribution && ["42703", "PGRST204"].includes(error.code ?? "")) ({ data: inq, error } = await insertInquiry({}));
  if (error || !inq) return { ok: false, error: "L'envoi a échoué. Réessayez." };
  await admin.from("property_events").insert({ property_id: prop.id, kind: "lead", link_id: attribution?.link_id ?? null, visitor: "" });

  await admin.from("inquiry_events").insert({
    inquiry_id: inq.id,
    actor_id: user?.id ?? null,
    kind: "creee",
    data: { kind: v.kind },
  });
  notifyUser(prop.host_id, { kind: "demande", propertyTitle: prop.title ?? "votre bien", senderName: v.name, visit: v.kind === "visite" });
  return { ok: true };
}

/* ── Lire ma boîte ──────────────────────────────────────────────────────── */

type InquiryRow = {
  id: string;
  kind: DemandeKind;
  status: DemandeStatus;
  sender_id: string | null;
  sender_name: string;
  sender_email: string | null;
  sender_phone: string | null;
  message: string;
  preferred_date: string | null;
  created_at: string;
  updated_at: string;
  property: PropJoin;
  introduction: {
    amount_chf: number | null;
    apporteur: { first_name: string; last_name: string } | null;
  } | null;
};

type IntroRow = {
  id: string;
  contact_label: string;
  amount_chf: number | null;
  created_at: string;
  property: PropJoin;
  apporteur: { first_name: string; last_name: string } | null;
};

export async function listMyDemandes(): Promise<{
  demandes: Demande[];
  pending: PendingIntroduction[];
  /** Faux si la migration 002 n'est pas encore appliquée. */
  ready: boolean;
}> {
  const { supabase, user } = await me();
  if (!supabase || !user) return { demandes: [], pending: [], ready: true };

  const [inq, intro] = await Promise.all([
    supabase
      .from("inquiries")
      .select(
        "id, kind, status, sender_id, sender_name, sender_email, sender_phone, message, preferred_date, created_at, updated_at, property:properties!property_id ( id, title, city, type, images ), introduction:introductions!introduction_id ( amount_chf, apporteur:profiles!apporteur_id ( first_name, last_name ) )",
      )
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("introductions")
      .select(
        "id, contact_label, amount_chf, created_at, property:properties!property_id ( id, title, city, type, images ), apporteur:profiles!apporteur_id ( first_name, last_name )",
      )
      .eq("seller_id", user.id)
      .eq("status", "proposee")
      .order("created_at", { ascending: false }),
  ]);

  /* Table absente (migration non appliquée) : on le signale au lieu de
     montrer une boîte faussement vide. */
  const missing = (e: { code?: string } | null) => !!e && (e.code === "42P01" || e.code === "PGRST205" || e.code === "42703" || e.code === "PGRST200");
  if (missing(inq.error) || missing(intro.error)) return { demandes: [], pending: [], ready: false };

  /* Dossiers joints (migration 005) : lecture séparée et tolérante. */
  const tokens = new Map<string, string>();
  const ids = ((inq.data ?? []) as { id: string }[]).map((r) => r.id);
  if (ids.length) {
    const { data: t, error: tErr } = await supabase.from("inquiries").select("id, dossier_token").in("id", ids);
    if (!tErr) for (const row of (t ?? []) as { id: string; dossier_token: string | null }[]) if (row.dossier_token) tokens.set(row.id, row.dossier_token);
  }

  /* Attribution et prix de vente (migration 009) : lecture séparée et tolérante. */
  type AttrRow = {
    id: string; sale_price: number | null; commission_kind: string | null; commission_amount_chf: number | null;
    commission_rate_pct: number | null; commission_due_on: string | null; apporteur: { first_name: string; last_name: string } | null;
  };
  const attr = new Map<string, AttrRow>();
  if (ids.length) {
    const { data: a, error: aErr } = await supabase
      .from("inquiries")
      .select("id, sale_price, commission_kind, commission_amount_chf, commission_rate_pct, commission_due_on, apporteur:profiles!apporteur_id ( first_name, last_name )")
      .in("id", ids);
    if (!aErr) for (const row of (a ?? []) as unknown as AttrRow[]) attr.set(row.id, row);
  }

  const demandes: Demande[] = ((inq.data ?? []) as unknown as InquiryRow[]).map((r) => ({
    ...(() => {
      const a = attr.get(r.id);
      return {
        salePrice: a?.sale_price === null || a?.sale_price === undefined ? null : Number(a.sale_price),
        attribution: a?.apporteur && a.commission_kind
          ? {
              apporteurName: nameOf(a.apporteur, "Un apporteur"),
              terms: {
                kind: a.commission_kind === "pourcentage" ? ("pourcentage" as const) : ("fixe" as const),
                amountChf: a.commission_amount_chf === null ? null : Number(a.commission_amount_chf),
                ratePct: a.commission_rate_pct === null ? null : Number(a.commission_rate_pct),
                dueOn: a.commission_due_on === "acceptation" ? ("acceptation" as const) : ("conclusion" as const),
              },
            }
          : null,
      };
    })(),
    dossierToken: tokens.get(r.id) ?? null,
    id: r.id,
    kind: r.kind,
    status: r.status,
    property: propOf(r.property),
    sender: { name: r.sender_name, email: r.sender_email, phone: r.sender_phone, hasAccount: !!r.sender_id },
    message: r.message,
    preferredDate: r.preferred_date,
    introduction: r.introduction
      ? { apporteurName: nameOf(r.introduction.apporteur, "Un apporteur"), amountChf: Number(r.introduction.amount_chf ?? 0) }
      : null,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));

  const pending: PendingIntroduction[] = ((intro.data ?? []) as unknown as IntroRow[]).map((r) => ({
    id: r.id,
    property: propOf(r.property),
    apporteurName: nameOf(r.apporteur, "Un apporteur"),
    contactLabel: r.contact_label,
    amountChf: Number(r.amount_chf ?? 0),
    createdAt: r.created_at,
  }));

  return { demandes, pending, ready: true };
}

/** Le compteur de la navigation : nouvelles demandes + décisions à prendre. */
export async function countMyPendingDemandes(): Promise<number> {
  const { supabase, user } = await me();
  if (!supabase || !user) return 0;
  const [a, b, c] = await Promise.all([
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("seller_id", user.id).eq("status", "nouvelle"),
    supabase.from("introductions").select("id", { count: "exact", head: true }).eq("seller_id", user.id).eq("status", "proposee"),
    /* Propositions reçues sur mes recherches à récompense (migration 004). */
    supabase.from("search_answers").select("id", { count: "exact", head: true }).eq("searcher_id", user.id).eq("status", "proposee"),
  ]);
  return (a.error ? 0 : a.count ?? 0) + (b.error ? 0 : b.count ?? 0) + (c.error ? 0 : c.count ?? 0);
}

/* ── Historique d'une demande ───────────────────────────────────────────── */

export async function listDemandeEvents(inquiryId: string): Promise<DemandeEvent[]> {
  const { supabase, user } = await me();
  if (!supabase || !user) return [];
  const { data } = await supabase
    .from("inquiry_events")
    .select("id, kind, data, created_at, actor:profiles!actor_id ( first_name, last_name )")
    .eq("inquiry_id", inquiryId)
    .order("created_at", { ascending: true });
  type Row = { id: string; kind: DemandeEvent["kind"]; data: Record<string, unknown>; created_at: string; actor: { first_name: string; last_name: string } | null };
  return ((data ?? []) as unknown as Row[]).map((r) => ({
    id: r.id,
    kind: r.kind,
    data: r.data ?? {},
    actorName: r.actor ? nameOf(r.actor, "") || null : null,
    createdAt: r.created_at,
  }));
}

/* ── Faire avancer une demande ──────────────────────────────────────────── */

const STATUSES: DemandeStatus[] = ["nouvelle", "en-cours", "visite", "offre", "conclue", "fermee"];

export async function setDemandeStatus(id: string, status: DemandeStatus, salePrice?: number | null): Promise<Ok> {
  if (!STATUSES.includes(status)) return { ok: false, error: "Statut invalide." };
  const price = salePrice && Number.isFinite(salePrice) && salePrice > 0 ? Math.round(salePrice) : null;
  const { supabase, user } = await me();
  if (!supabase || !user) return { ok: false, error: "Reconnectez-vous." };
  const patch: Record<string, unknown> = { status };
  if (status === "conclue" && price) patch.sale_price = price;
  let { error } = await supabase.from("inquiries").update(patch).eq("id", id).eq("seller_id", user.id);
  /* Base sans migration 009 : la colonne n'existe pas, on enregistre le statut seul. */
  if (error && patch.sale_price && ["42703", "PGRST204"].includes(error.code ?? "")) {
    ({ error } = await supabase.from("inquiries").update({ status }).eq("id", id).eq("seller_id", user.id));
  }
  if (error?.message?.includes("prix de vente requis")) return { ok: false, error: "Indiquez le prix de vente final : la commission en dépend." };
  if (error?.message?.includes("déjà conclue")) return { ok: false, error: "Cette vente est déjà conclue (définitif). Écrivez-nous pour corriger." };
  return error ? { ok: false, error: "La mise à jour a échoué." } : { ok: true };
}

export async function addDemandeNote(id: string, text: string): Promise<Ok> {
  const note = text.trim().slice(0, 2000);
  if (note.length < 1) return { ok: false, error: "Note vide." };
  const { supabase, user } = await me();
  if (!supabase || !user) return { ok: false, error: "Reconnectez-vous." };
  /* Contrôle d'appartenance AVANT l'écriture à privilèges. */
  const { data: own } = await supabase.from("inquiries").select("id").eq("id", id).eq("seller_id", user.id).maybeSingle();
  if (!own) return { ok: false, error: "Demande introuvable." };
  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "Service momentanément indisponible." };
  const { error } = await admin.from("inquiry_events").insert({ inquiry_id: id, actor_id: user.id, kind: "note", data: { text: note } });
  return error ? { ok: false, error: "La note n'a pas été enregistrée." } : { ok: true };
}

/* ── Décider d'une mise en relation ─────────────────────────────────────── */

export async function decideIntroduction(id: string, decision: "acceptee" | "refusee"): Promise<Ok> {
  const { supabase, user } = await me();
  if (!supabase || !user) return { ok: false, error: "Reconnectez-vous." };

  /* La RLS (vendeur seul) et le déclencheur (une seule décision) protègent ;
     on filtre aussi ici pour un message clair. */
  const { data: updated, error } = await supabase
    .from("introductions")
    .update({ status: decision })
    .eq("id", id)
    .eq("seller_id", user.id)
    .eq("status", "proposee")
    .select("*")
    .maybeSingle();
  if (error || !updated) return { ok: false, error: "Cette mise en relation n'est plus en attente." };

  /* Prévenir l'apporteur de la décision (après la réponse). */
  const { data: p } = await supabase.from("properties").select("title").eq("id", updated.property_id ?? "").maybeSingle();
  notifyUser(updated.apporteur_id, {
    kind: "decision-relation",
    propertyTitle: p?.title ?? "le bien",
    accepted: decision === "acceptee",
    netChf: netOf(Number(updated.amount_chf ?? 0)),
  });
  if (decision === "refusee") return { ok: true };

  /* Acceptée : les coordonnées apportées deviennent une demande dans la boîte
     du vendeur, avec la trace de l'apport. */
  const admin = createAdminClient();
  if (!admin) return { ok: true };
  const { data: contact } = await admin
    .from("introduction_contacts")
    .select("contact_name, contact_email, contact_phone")
    .eq("introduction_id", id)
    .maybeSingle();
  if (!contact || !updated.property_id) return { ok: true };

  const base = {
    property_id: updated.property_id,
    seller_id: updated.seller_id,
    sender_name: contact.contact_name,
    sender_email: contact.contact_email,
    sender_phone: contact.contact_phone,
    kind: "apport",
    message: updated.contact_label,
    introduction_id: id,
  };
  /* La commission suit le lead jusqu'à la vente (figée à la mise en relation). */
  const attributed = {
    ...base,
    apporteur_id: updated.apporteur_id,
    commission_kind: updated.commission_kind ?? "fixe",
    commission_amount_chf: updated.amount_chf ?? null,
    commission_rate_pct: updated.rate_pct ?? null,
    commission_due_on: updated.due_on ?? "acceptation",
  };
  let { data: inq, error: insErr } = await admin.from("inquiries").insert(attributed).select("id").single();
  if (insErr && ["42703", "PGRST204"].includes(insErr.code ?? "")) ({ data: inq, error: insErr } = await admin.from("inquiries").insert(base).select("id").single());
  if (inq) {
    await admin.from("inquiry_events").insert({
      inquiry_id: inq.id,
      actor_id: user.id,
      kind: "creee",
      data: { kind: "apport", amountChf: Number(updated.amount_chf ?? 0) },
    });
  }
  return { ok: true };
}
