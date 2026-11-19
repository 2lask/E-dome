"use server";

import { z } from "zod";
import { createClient } from "./server";
import { isValidSlug, isValidUid, normalizeUid, type Agency, type AgencyStats } from "../agences";

/* ── Actions serveur : ESPACE AGENCE (migration 006) ─────────────────────────
   Toutes les écritures passent par la session de l'agence (clé anonyme + RLS) :
   une agence ne modifie que SA fiche, et ni le badge « vérifiée » ni la
   formule (déclencheur côté base). Les statistiques sont relues sous RLS :
   l'agence ne voit que les propositions faites à SES recherches. */

type Ok<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const missing = (e: { code?: string } | null) =>
  !!e && ["42P01", "PGRST205", "42703", "PGRST200"].includes(e.code ?? "");

type AgencyRow = {
  id: string; owner_id: string; slug: string; name: string; city: string; zone: string; description: string;
  website: string | null; phone: string | null; public_email: string | null; uid_number: string | null;
  verified: boolean; plan: "pilote" | "pro"; created_at: string;
};

const COLS =
  "id, owner_id, slug, name, city, zone, description, website, phone, public_email, uid_number, verified, plan, created_at";

const mapAgency = (r: AgencyRow): Agency => ({
  id: r.id,
  ownerId: r.owner_id,
  slug: r.slug,
  name: r.name,
  city: r.city,
  zone: r.zone ?? "",
  description: r.description ?? "",
  website: r.website,
  phone: r.phone,
  publicEmail: r.public_email,
  uidNumber: r.uid_number,
  verified: r.verified,
  plan: r.plan,
  createdAt: r.created_at,
});

async function me() {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, user: null } as const;
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user } as const;
}

/* ── Lire ───────────────────────────────────────────────────────────────── */

/** Ma fiche agence. `ready: false` tant que la migration 006 n'est pas appliquée. */
export async function getMyAgency(): Promise<{ agency: Agency | null; ready: boolean }> {
  const { supabase, user } = await me();
  if (!supabase || !user) return { agency: null, ready: true };
  const { data, error } = await supabase.from("agencies").select(COLS).eq("owner_id", user.id).maybeSingle();
  if (missing(error)) return { agency: null, ready: false };
  return { agency: data ? mapAgency(data as AgencyRow) : null, ready: true };
}

export async function getAgencyBySlug(slug: string): Promise<Agency | null> {
  if (!/^[a-z0-9-]{3,40}$/.test(slug)) return null;
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.from("agencies").select(COLS).eq("slug", slug).maybeSingle();
  return data ? mapAgency(data as AgencyRow) : null;
}

export async function listAgencies(): Promise<{ agencies: Agency[]; ready: boolean }> {
  const supabase = await createClient();
  if (!supabase) return { agencies: [], ready: true };
  const { data, error } = await supabase
    .from("agencies")
    .select(COLS)
    .order("verified", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(200);
  if (missing(error)) return { agencies: [], ready: false };
  return { agencies: ((data ?? []) as AgencyRow[]).map(mapAgency), ready: true };
}

/** Le suivi du programme : recherches de vendeurs, propositions, biens à prime. */
export async function getMyAgencyStats(): Promise<AgencyStats> {
  const empty: AgencyStats = { sellerSearches: 0, proposals: 0, pending: 0, accepted: 0, dueChf: 0, listings: 0, primedListings: 0 };
  const { supabase, user } = await me();
  if (!supabase || !user) return empty;
  const [searches, answers, props] = await Promise.all([
    supabase.from("searches").select("id").eq("author_id", user.id).eq("kind", "vendeurs").eq("active", true),
    supabase.from("search_answers").select("status, reward_chf, search:searches!search_id ( kind )").eq("searcher_id", user.id),
    supabase.from("properties").select("id, primes ( active )").eq("host_id", user.id).is("sold_to", null),
  ]);
  type A = { status: string; reward_chf: number | null; search: { kind: string } | { kind: string }[] | null };
  const sellerAnswers = ((answers.data ?? []) as unknown as A[]).filter((a) => {
    const s = Array.isArray(a.search) ? a.search[0] : a.search;
    return s?.kind === "vendeurs";
  });
  const P = (props.data ?? []) as { id: string; primes: { active: boolean }[] | null }[];
  return {
    sellerSearches: searches.data?.length ?? 0,
    proposals: sellerAnswers.length,
    pending: sellerAnswers.filter((a) => a.status === "proposee").length,
    accepted: sellerAnswers.filter((a) => a.status === "acceptee").length,
    dueChf: sellerAnswers.filter((a) => a.status === "acceptee").reduce((s, a) => s + Number(a.reward_chf ?? 0), 0),
    listings: P.length,
    primedListings: P.filter((p) => (p.primes ?? []).some((x) => x.active)).length,
  };
}

/* ── Écrire ─────────────────────────────────────────────────────────────── */

const opt = (max: number) => z.string().trim().max(max).transform((v) => v || null);

const AgencyInput = z.object({
  name: z.string().trim().min(2, "Indiquez le nom de l'agence.").max(80),
  slug: z.string().trim().toLowerCase().refine(isValidSlug, "Adresse invalide : 3 à 40 caractères, lettres, chiffres et tirets."),
  city: z.string().trim().min(2, "Indiquez la localité principale.").max(80),
  zone: z.string().trim().max(200).default(""),
  description: z.string().trim().max(1500).default(""),
  website: opt(200).refine((v) => v === null || /^https?:\/\/\S+\.\S+/.test(v), "Le site doit commencer par https://"),
  phone: opt(40),
  publicEmail: opt(120).refine((v) => v === null || /^\S+@\S+\.\S+$/.test(v), "E-mail public invalide."),
  uidNumber: opt(20).refine((v) => v === null || isValidUid(v), "Numéro IDE au format CHE-123.456.789."),
});

export async function saveMyAgency(raw: z.input<typeof AgencyInput>): Promise<Ok<{ slug: string }>> {
  const parsed = AgencyInput.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  const v = parsed.data;
  const { supabase, user } = await me();
  if (!supabase || !user) return { ok: false, error: "Reconnectez-vous." };

  const row = {
    name: v.name,
    slug: v.slug,
    city: v.city,
    zone: v.zone,
    description: v.description,
    website: v.website,
    phone: v.phone,
    public_email: v.publicEmail,
    uid_number: v.uidNumber ? normalizeUid(v.uidNumber) : null,
  };
  const { data: existing, error: readErr } = await supabase.from("agencies").select("id").eq("owner_id", user.id).maybeSingle();
  if (missing(readErr)) return { ok: false, error: "La base doit être mise à jour (migration 006)." };

  const { error } = existing
    ? await supabase.from("agencies").update(row).eq("id", existing.id)
    : await supabase.from("agencies").insert({ ...row, owner_id: user.id });
  if (error?.code === "23505") return { ok: false, error: "Cette adresse est déjà prise : choisissez-en une autre." };
  if (error) return { ok: false, error: "L'enregistrement a échoué. Réessayez." };
  return { ok: true, slug: v.slug };
}
