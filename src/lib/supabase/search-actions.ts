"use server";

import { z } from "zod";
import { createClient } from "./server";
import { createAdminClient } from "./admin";
import {
  REWARD_MAX_CHF,
  REWARD_MIN_CHF,
  searchTitle,
  type AnswerStatus,
  type Search,
  type SearchAnswer,
} from "../recherches";

/* ── Actions serveur : RECHERCHES À RÉCOMPENSE (migration 004) ───────────────
   Mêmes garde-fous que les mises en relation : seule l'auteure d'une
   recherche décide (RLS + déclencheur), la récompense est FIGÉE à la
   proposition, les coordonnées d'un tiers ne sont lisibles qu'après
   acceptation, le consentement du tiers est obligatoire. */

type Ok<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const missing = (e: { code?: string } | null) =>
  !!e && ["42P01", "PGRST205", "42703", "PGRST200"].includes(e.code ?? "");

async function me() {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, user: null } as const;
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user } as const;
}

type SearchRow = {
  id: string; kind: Search["kind"]; transaction: Search["transaction"]; city: string; area: string;
  rooms_min: number | null; budget_max: number | null; needed_by: string | null; description: string;
  reward_chf: number; active: boolean; created_at: string;
  author: { id: string; first_name: string; last_name: string; avatar: string | null } | null;
};

const SEARCH_COLS =
  "id, kind, transaction, city, area, rooms_min, budget_max, needed_by, description, reward_chf, active, created_at, author:profiles!author_id ( id, first_name, last_name, avatar )";

const mapSearch = (r: SearchRow): Search => ({
  id: r.id,
  kind: r.kind,
  transaction: r.transaction,
  city: r.city,
  area: r.area ?? "",
  roomsMin: r.rooms_min === null ? null : Number(r.rooms_min),
  budgetMax: r.budget_max === null ? null : Number(r.budget_max),
  neededBy: r.needed_by,
  description: r.description ?? "",
  rewardChf: Number(r.reward_chf),
  active: r.active,
  createdAt: r.created_at,
  author: {
    id: r.author?.id ?? "",
    name: r.author ? `${r.author.first_name} ${r.author.last_name}`.trim() || "Membre E-Dome" : "Membre E-Dome",
    avatar: r.author?.avatar ?? null,
  },
});

/* ── Lire ───────────────────────────────────────────────────────────────── */

export async function listPublicSearches(): Promise<{ searches: Search[]; ready: boolean }> {
  const supabase = await createClient();
  if (!supabase) return { searches: [], ready: true };
  const { data, error } = await supabase
    .from("searches")
    .select(SEARCH_COLS)
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(200);
  if (missing(error)) return { searches: [], ready: false };
  return { searches: ((data ?? []) as unknown as SearchRow[]).map(mapSearch), ready: true };
}

export async function getSearch(id: string): Promise<Search | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.from("searches").select(SEARCH_COLS).eq("id", id).maybeSingle();
  return data ? mapSearch(data as unknown as SearchRow) : null;
}

export async function listMySearches(): Promise<Search[]> {
  const { supabase, user } = await me();
  if (!supabase || !user) return [];
  const { data, error } = await supabase
    .from("searches")
    .select(`${SEARCH_COLS}, search_answers ( id )`)
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as unknown as (SearchRow & { search_answers: { id: string }[] | null })[]).map((r) => ({
    ...mapSearch(r),
    answersCount: r.search_answers?.length ?? 0,
  }));
}

/* ── Publier / clore ────────────────────────────────────────────────────── */

const SearchInput = z.object({
  kind: z.enum(["logement", "vendeurs"]),
  transaction: z.enum(["location", "achat"]),
  city: z.string().trim().min(2, "Indiquez la localité.").max(80),
  area: z.string().trim().max(120).default(""),
  roomsMin: z.number().min(0).max(20).nullable(),
  budgetMax: z.number().min(0).max(50_000_000).nullable(),
  neededBy: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  description: z.string().trim().min(20, "Décrivez ce que vous cherchez (20 caractères au moins).").max(2000),
  rewardChf: z.number().int().min(REWARD_MIN_CHF, `Récompense de ${REWARD_MIN_CHF} CHF au moins.`).max(REWARD_MAX_CHF, `Récompense de ${REWARD_MAX_CHF} CHF au plus.`),
});

export async function createMySearch(raw: z.input<typeof SearchInput>): Promise<Ok<{ id: string }>> {
  const parsed = SearchInput.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  const v = parsed.data;
  const { supabase, user } = await me();
  if (!supabase || !user) return { ok: false, error: "Reconnectez-vous pour publier." };
  const { data, error } = await supabase
    .from("searches")
    .insert({
      author_id: user.id,
      kind: v.kind,
      transaction: v.kind === "vendeurs" ? "achat" : v.transaction,
      city: v.city,
      area: v.area,
      rooms_min: v.roomsMin,
      budget_max: v.budgetMax,
      needed_by: v.neededBy,
      description: v.description,
      reward_chf: v.rewardChf,
    })
    .select("id")
    .single();
  if (missing(error)) return { ok: false, error: "La base doit être mise à jour (migration 004)." };
  if (error || !data) return { ok: false, error: "La publication a échoué. Réessayez." };
  return { ok: true, id: data.id };
}

export async function closeMySearch(id: string): Promise<Ok> {
  const { supabase, user } = await me();
  if (!supabase || !user) return { ok: false, error: "Reconnectez-vous." };
  const { error } = await supabase.from("searches").update({ active: false }).eq("id", id).eq("author_id", user.id);
  return error ? { ok: false, error: "La recherche n'a pas pu être close." } : { ok: true };
}

/* ── Proposer ───────────────────────────────────────────────────────────── */

export async function answerSearch(input: {
  searchId: string;
  pitch: string;
  propertyUrl?: string;
  contact?: { name: string; email?: string; phone?: string; consent: boolean } | null;
}): Promise<Ok> {
  const { supabase, user } = await me();
  if (!supabase || !user) return { ok: false, error: "Reconnectez-vous pour proposer." };
  const pitch = input.pitch.trim();
  if (pitch.length < 15) return { ok: false, error: "Décrivez votre proposition (15 caractères au moins)." };

  /* Lien vers une annonce E-Dome (facultatif) : on en extrait l'identifiant. */
  const propertyId = input.propertyUrl?.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)?.[0] ?? null;

  const c = input.contact;
  if (c) {
    if (c.name.trim().length < 2) return { ok: false, error: "Indiquez le nom de la personne." };
    if (!c.email?.trim() && !c.phone?.trim()) return { ok: false, error: "Un e-mail ou un téléphone de la personne est nécessaire." };
    if (!c.consent) return { ok: false, error: "La personne doit avoir accepté que vous transmettiez ses coordonnées." };
  }

  const { data: ans, error } = await supabase
    .from("search_answers")
    .insert({ search_id: input.searchId, author_id: user.id, pitch: pitch.slice(0, 1500), property_id: propertyId, status: "proposee" })
    .select("id")
    .single();
  if (missing(error)) return { ok: false, error: "La base doit être mise à jour (migration 004)." };
  if (error || !ans) return { ok: false, error: "La proposition n'a pas pu être envoyée (recherche close ou la vôtre ?)." };

  if (c) {
    const { error: cErr } = await supabase.from("search_answer_contacts").insert({
      answer_id: ans.id,
      contact_name: c.name.trim().slice(0, 120),
      contact_email: c.email?.trim() || null,
      contact_phone: c.phone?.trim() || null,
      consent_confirmed: true,
    });
    if (cErr) {
      await createAdminClient()?.from("search_answers").delete().eq("id", ans.id);
      return { ok: false, error: "Les coordonnées n'ont pas pu être enregistrées." };
    }
  }
  return { ok: true };
}

/* ── Propositions reçues / envoyées ─────────────────────────────────────── */

type AnswerRow = {
  id: string; search_id: string; pitch: string; property_id: string | null; reward_chf: number | null;
  status: AnswerStatus; created_at: string;
  author: { first_name: string; last_name: string } | null;
  search: { kind: Search["kind"]; transaction: Search["transaction"]; city: string; rooms_min: number | null } | null;
  contact: ContactRow | ContactRow[] | null;
};
type ContactRow = { contact_name: string; contact_email: string | null; contact_phone: string | null };

const ANSWER_COLS =
  "id, search_id, pitch, property_id, reward_chf, status, created_at, author:profiles!author_id ( first_name, last_name ), search:searches!search_id ( kind, transaction, city, rooms_min ), contact:search_answer_contacts ( contact_name, contact_email, contact_phone )";

const mapAnswer = (r: AnswerRow): SearchAnswer => {
  const c = Array.isArray(r.contact) ? r.contact[0] ?? null : r.contact;
  return {
  id: r.id,
  searchId: r.search_id,
  searchTitle: r.search
    ? searchTitle({ kind: r.search.kind, transaction: r.search.transaction, city: r.search.city, roomsMin: r.search.rooms_min })
    : "Recherche",
  pitch: r.pitch,
  propertyId: r.property_id,
  rewardChf: Number(r.reward_chf ?? 0),
  status: r.status,
  createdAt: r.created_at,
  authorName: r.author ? `${r.author.first_name} ${r.author.last_name}`.trim() || "Un membre" : "Un membre",
  contact: c ? { name: c.contact_name, email: c.contact_email, phone: c.contact_phone } : null,
  };
};

/** Les propositions reçues sur MES recherches (la RLS masque les coordonnées
    tant que je n'ai pas accepté). */
export async function listAnswersToMe(): Promise<SearchAnswer[]> {
  const { supabase, user } = await me();
  if (!supabase || !user) return [];
  const { data, error } = await supabase
    .from("search_answers")
    .select(ANSWER_COLS)
    .eq("searcher_id", user.id)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as unknown as AnswerRow[]).map(mapAnswer);
}

/** Les propositions que J'AI envoyées (espace apporteur). */
export async function listMyAnswers(): Promise<SearchAnswer[]> {
  const { supabase, user } = await me();
  if (!supabase || !user) return [];
  const { data, error } = await supabase
    .from("search_answers")
    .select(ANSWER_COLS)
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as unknown as AnswerRow[]).map(mapAnswer);
}

export async function decideAnswer(id: string, decision: "acceptee" | "refusee"): Promise<Ok> {
  const { supabase, user } = await me();
  if (!supabase || !user) return { ok: false, error: "Reconnectez-vous." };
  const { data, error } = await supabase
    .from("search_answers")
    .update({ status: decision })
    .eq("id", id)
    .eq("searcher_id", user.id)
    .eq("status", "proposee")
    .select("id")
    .maybeSingle();
  if (error || !data) return { ok: false, error: "Cette proposition n'est plus en attente." };
  return { ok: true };
}
