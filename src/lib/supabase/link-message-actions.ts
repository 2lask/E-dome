"use server";

import { createClient } from "./server";
import { notifyUser } from "../email/notify";

/* ── Messages vendeur ↔ apporteur (migration 012) ────────────────────────────
   Une conversation par lien d'apporteur. Lecture et écriture sous la session
   de la personne : la RLS (`is_link_party`) garantit que seuls l'apporteur du
   lien et le propriétaire du bien y accèdent. Base non migrée → `ready:false`,
   l'écran l'explique au lieu de planter. */

type Ok<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const missing = (e: { code?: string } | null) =>
  !!e && ["42P01", "PGRST205", "42703", "PGRST200", "PGRST202", "42883"].includes(e.code ?? "");

export interface LinkMessage { id: string; mine: boolean; body: string; createdAt: string; readAt: string | null }
export interface LinkThread {
  linkId: string;
  propertyId: string;
  propertyTitle: string;
  cover: string;
  /** Mon rôle dans la conversation. */
  role: "vendeur" | "apporteur";
  /** Prénom et initiale de l'autre partie. */
  other: string;
  otherId: string;
  last: { body: string; createdAt: string; mine: boolean } | null;
  unread: number;
}

type Prof = { first_name: string | null; last_name: string | null } | null;
type LinkRow = {
  id: string;
  apporteur_id: string;
  apporteur: Prof | Prof[];
  property: { id: string; title: string; images: string[] | null; host_id: string; host: Prof | Prof[] } | null;
};
const one = <T,>(v: T | T[] | null | undefined): T | null => (Array.isArray(v) ? v[0] ?? null : v ?? null);
const shortName = (p: Prof) => {
  const f = (p?.first_name ?? "").trim();
  const l = (p?.last_name ?? "").trim();
  return f ? `${f}${l ? ` ${l[0]}.` : ""}` : "Membre";
};

async function me() {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, user: null } as const;
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user } as const;
}

const LINK_SELECT =
  "id, apporteur_id, apporteur:profiles!apporteur_id ( first_name, last_name ), property:properties!property_id ( id, title, images, host_id, host:profiles!host_id ( first_name, last_name ) )";

/** Mes conversations : chaque lien où je suis apporteur, ou dont je possède le bien. */
export async function listMyThreads(): Promise<{ ready: boolean; threads: LinkThread[] }> {
  const { supabase, user } = await me();
  if (!supabase || !user) return { ready: true, threads: [] };

  const { data: links, error } = await supabase.from("apport_links").select(LINK_SELECT).limit(500);
  if (error) return { ready: !missing(error), threads: [] };
  const rows = ((links ?? []) as unknown as LinkRow[]).filter((l) => l.property);
  if (rows.length === 0) return { ready: true, threads: [] };

  const { data: msgs, error: mErr } = await supabase
    .from("link_messages")
    .select("link_id, sender_id, body, created_at, read_at")
    .in("link_id", rows.map((r) => r.id))
    .order("created_at", { ascending: false })
    .limit(2000);
  if (mErr) return { ready: !missing(mErr), threads: [] };

  type M = { link_id: string; sender_id: string; body: string; created_at: string; read_at: string | null };
  const byLink = new Map<string, M[]>();
  for (const m of (msgs ?? []) as M[]) byLink.set(m.link_id, [...(byLink.get(m.link_id) ?? []), m]);

  const threads = rows.map((r): LinkThread => {
    const p = r.property!;
    const iAmSeller = p.host_id === user.id;
    const list = byLink.get(r.id) ?? [];
    const last = list[0];
    return {
      linkId: r.id,
      propertyId: p.id,
      propertyTitle: p.title,
      cover: p.images?.[0] ?? "",
      role: iAmSeller ? "vendeur" : "apporteur",
      other: iAmSeller ? shortName(one(r.apporteur)) : shortName(one(p.host)),
      otherId: iAmSeller ? r.apporteur_id : p.host_id,
      last: last ? { body: last.body, createdAt: last.created_at, mine: last.sender_id === user.id } : null,
      unread: list.filter((m) => m.sender_id !== user.id && !m.read_at).length,
    };
  });
  /* Conversations actives d'abord, puis les liens sans message. */
  threads.sort((a, b) => (b.last?.createdAt ?? "").localeCompare(a.last?.createdAt ?? ""));
  return { ready: true, threads };
}

/** Nombre de messages reçus non lus (badge de navigation). */
export async function countUnreadLinkMessages(): Promise<number> {
  const { supabase, user } = await me();
  if (!supabase || !user) return 0;
  const { count, error } = await supabase
    .from("link_messages")
    .select("id", { count: "exact", head: true })
    .neq("sender_id", user.id)
    .is("read_at", null);
  return error ? 0 : count ?? 0;
}

export async function getThreadMessages(linkId: string): Promise<Ok<{ messages: LinkMessage[] }>> {
  const { supabase, user } = await me();
  if (!supabase || !user) return { ok: false, error: "Reconnectez-vous." };
  const { data, error } = await supabase
    .from("link_messages")
    .select("id, sender_id, body, created_at, read_at")
    .eq("link_id", linkId)
    .order("created_at", { ascending: true })
    .limit(500);
  if (missing(error)) return { ok: false, error: "La messagerie s'active avec la mise à jour de la base (migration 012)." };
  if (error) return { ok: false, error: "Conversation indisponible." };
  type M = { id: string; sender_id: string; body: string; created_at: string; read_at: string | null };
  return {
    ok: true,
    messages: ((data ?? []) as M[]).map((m) => ({ id: m.id, mine: m.sender_id === user.id, body: m.body, createdAt: m.created_at, readAt: m.read_at })),
  };
}

export async function markThreadRead(linkId: string): Promise<void> {
  const { supabase, user } = await me();
  if (!supabase || !user) return;
  await supabase.rpc("mark_link_messages_read", { l: linkId });
}

export async function sendLinkMessage(linkId: string, body: string): Promise<Ok<{ message: LinkMessage }>> {
  const text = body.replace(/\r\n/g, "\n").trim();
  if (!text) return { ok: false, error: "Message vide." };
  if (text.length > 2000) return { ok: false, error: "2000 caractères au plus." };
  const { supabase, user } = await me();
  if (!supabase || !user) return { ok: false, error: "Reconnectez-vous." };

  const { data, error } = await supabase
    .from("link_messages")
    .insert({ link_id: linkId, sender_id: user.id, body: text })
    .select("id, body, created_at, read_at")
    .single();
  if (missing(error)) return { ok: false, error: "La messagerie s'active avec la mise à jour de la base (migration 012)." };
  if (error || !data) return { ok: false, error: "Message non envoyé. Réessayez." };

  /* Prévenir l'autre partie par e-mail (si les e-mails sont configurés). */
  const { data: link } = await supabase.from("apport_links").select("apporteur_id, property:properties!property_id ( title, host_id )").eq("id", linkId).maybeSingle();
  const l = link as unknown as { apporteur_id: string; property: { title: string; host_id: string } | { title: string; host_id: string }[] | null } | null;
  const prop = one(l?.property);
  if (l && prop) {
    const to = prop.host_id === user.id ? l.apporteur_id : prop.host_id;
    notifyUser(to, { kind: "message", propertyTitle: prop.title });
  }

  return { ok: true, message: { id: data.id as string, mine: true, body: data.body as string, createdAt: data.created_at as string, readAt: null } };
}
