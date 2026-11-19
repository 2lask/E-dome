"use server";

import { createClient } from "./server";
import { createAdminClient } from "./admin";
import { EMPTY_DOSSIER, type DocKind, type Dossier, type DossierDoc } from "../dossier";

/* ── Actions serveur : DOSSIER DE LOCATION (migration 005) ───────────────────
   Pièces sensibles (salaires, poursuites, identité) :
   · bucket PRIVÉ `dossiers`, chemin `<id utilisateur>/…` fixé par le serveur ;
   · lecture par URL signée de quelques minutes, jamais d'URL publique ;
   · partage par jeton aléatoire (192 bits), lié à un bien, expirant, révocable. */

type Ok<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const BUCKET = "dossiers";
const EXT: Record<string, string> = { "application/pdf": "pdf", "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const KINDS: DocKind[] = ["poursuites", "salaire", "identite", "assurance_rc", "autre"];
const missing = (e: { code?: string } | null) => !!e && ["42P01", "PGRST205", "42703"].includes(e.code ?? "");

async function me() {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, user: null } as const;
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user } as const;
}

type DossierRow = {
  situation: string; employer: string; monthly_income: number | null; occupants: number; children: number;
  pets: boolean; smoker: boolean; permit: string; intro: string; updated_at: string;
};
const mapDossier = (r: DossierRow | null): Dossier =>
  r
    ? {
        situation: r.situation, employer: r.employer, monthlyIncome: r.monthly_income === null ? null : Number(r.monthly_income),
        occupants: r.occupants, children: r.children, pets: r.pets, smoker: r.smoker, permit: r.permit, intro: r.intro, updatedAt: r.updated_at,
      }
    : EMPTY_DOSSIER;

/* ── Mon dossier ────────────────────────────────────────────────────────── */

export async function getMyDossier(): Promise<{ dossier: Dossier; docs: DossierDoc[]; ready: boolean }> {
  const { supabase, user } = await me();
  if (!supabase || !user) return { dossier: EMPTY_DOSSIER, docs: [], ready: true };
  const [d, docs] = await Promise.all([
    supabase.from("rental_dossiers").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("dossier_documents").select("id, kind, name, created_at").eq("user_id", user.id).order("created_at"),
  ]);
  if (missing(d.error) || missing(docs.error)) return { dossier: EMPTY_DOSSIER, docs: [], ready: false };
  return {
    dossier: mapDossier(d.data as DossierRow | null),
    docs: ((docs.data ?? []) as { id: string; kind: DocKind; name: string; created_at: string }[]).map((x) => ({ id: x.id, kind: x.kind, name: x.name, createdAt: x.created_at })),
    ready: true,
  };
}

export async function saveMyDossier(d: Omit<Dossier, "updatedAt">): Promise<Ok> {
  const { supabase, user } = await me();
  if (!supabase || !user) return { ok: false, error: "Reconnectez-vous." };
  const { error } = await supabase.from("rental_dossiers").upsert({
    user_id: user.id,
    situation: d.situation.slice(0, 40),
    employer: d.employer.trim().slice(0, 120),
    monthly_income: d.monthlyIncome && d.monthlyIncome > 0 ? Math.round(d.monthlyIncome) : null,
    occupants: Math.min(Math.max(Math.round(d.occupants) || 1, 1), 20),
    children: Math.min(Math.max(Math.round(d.children) || 0, 0), 20),
    pets: d.pets,
    smoker: d.smoker,
    permit: d.permit.slice(0, 20),
    intro: d.intro.trim().slice(0, 2000),
  });
  if (missing(error)) return { ok: false, error: "La base doit être mise à jour (migration 005)." };
  return error ? { ok: false, error: "Le dossier n'a pas pu être enregistré." } : { ok: true };
}

/* ── Pièces ─────────────────────────────────────────────────────────────── */

export async function createDossierUpload(mime: string): Promise<Ok<{ path: string; token: string }>> {
  const ext = EXT[mime];
  if (!ext) return { ok: false, error: "Format accepté : PDF, JPEG, PNG ou WebP." };
  const { user } = await me();
  if (!user) return { ok: false, error: "Reconnectez-vous." };
  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "Service indisponible." };
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
  const { data, error } = await admin.storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data) return { ok: false, error: "L'envoi n'a pas pu être préparé." };
  return { ok: true, path, token: data.token };
}

export async function registerDossierDoc(kind: DocKind, path: string, name: string): Promise<Ok> {
  const { supabase, user } = await me();
  if (!supabase || !user) return { ok: false, error: "Reconnectez-vous." };
  if (!KINDS.includes(kind) || !path.startsWith(`${user.id}/`)) return { ok: false, error: "Pièce invalide." };
  const { error } = await supabase.from("dossier_documents").insert({ user_id: user.id, kind, path, name: name.slice(0, 160) });
  return error ? { ok: false, error: "La pièce n'a pas pu être enregistrée." } : { ok: true };
}

export async function deleteDossierDoc(id: string): Promise<Ok> {
  const { supabase, user } = await me();
  if (!supabase || !user) return { ok: false, error: "Reconnectez-vous." };
  const { data } = await supabase.from("dossier_documents").delete().eq("id", id).eq("user_id", user.id).select("path").maybeSingle();
  if (!data) return { ok: false, error: "Pièce introuvable." };
  await createAdminClient()?.storage.from(BUCKET).remove([data.path as string]);
  return { ok: true };
}

/** URL signée (5 min) pour que la titulaire consulte SA pièce. */
export async function openMyDoc(id: string): Promise<Ok<{ url: string }>> {
  const { supabase, user } = await me();
  if (!supabase || !user) return { ok: false, error: "Reconnectez-vous." };
  const { data } = await supabase.from("dossier_documents").select("path").eq("id", id).eq("user_id", user.id).maybeSingle();
  if (!data) return { ok: false, error: "Pièce introuvable." };
  const { data: signed } = (await createAdminClient()?.storage.from(BUCKET).createSignedUrl(data.path as string, 300)) ?? { data: null };
  return signed?.signedUrl ? { ok: true, url: signed.signedUrl } : { ok: false, error: "Lien indisponible." };
}

/* ── Partage ────────────────────────────────────────────────────────────── */

/* La création d'un jeton vit dans `dossier-server.ts` (server-only) : exportée
   d'ici, elle deviendrait une action appelable par n'importe quel navigateur. */

export async function revokeAllMyShares(): Promise<Ok<{ count: number }>> {
  const { supabase, user } = await me();
  if (!supabase || !user) return { ok: false, error: "Reconnectez-vous." };
  const { data, error } = await supabase.from("dossier_shares").update({ revoked: true }).eq("user_id", user.id).eq("revoked", false).select("token");
  return error ? { ok: false, error: "La révocation a échoué." } : { ok: true, count: data?.length ?? 0 };
}

export interface SharedDossier {
  ownerName: string;
  dossier: Dossier;
  docs: (DossierDoc & { url: string | null })[];
  expiresAt: string;
}

/** Lecture d'un dossier partagé par jeton (le destinataire n'a pas de droit en
    base : tout passe ici, après vérification du jeton). */
export async function getSharedDossier(token: string): Promise<SharedDossier | null> {
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(token)) return null;
  const admin = createAdminClient();
  if (!admin) return null;
  const { data: share } = await admin.from("dossier_shares").select("user_id, expires_at, revoked, views").eq("token", token).maybeSingle();
  if (!share || share.revoked || new Date(share.expires_at as string) < new Date()) return null;

  const uid = share.user_id as string;
  const [d, docs, prof] = await Promise.all([
    admin.from("rental_dossiers").select("*").eq("user_id", uid).maybeSingle(),
    admin.from("dossier_documents").select("id, kind, name, created_at, path").eq("user_id", uid).order("created_at"),
    admin.from("profiles").select("first_name, last_name").eq("id", uid).maybeSingle(),
  ]);
  await admin.from("dossier_shares").update({ views: Number(share.views ?? 0) + 1 }).eq("token", token);

  const rows = (docs.data ?? []) as { id: string; kind: DocKind; name: string; created_at: string; path: string }[];
  const withUrls = await Promise.all(
    rows.map(async (x) => {
      const { data: s } = await admin.storage.from(BUCKET).createSignedUrl(x.path, 600);
      return { id: x.id, kind: x.kind, name: x.name, createdAt: x.created_at, url: s?.signedUrl ?? null };
    }),
  );
  const p = prof.data as { first_name: string; last_name: string } | null;
  return {
    ownerName: p ? `${p.first_name} ${p.last_name}`.trim() || "Candidat" : "Candidat",
    dossier: mapDossier(d.data as DossierRow | null),
    docs: withUrls,
    expiresAt: share.expires_at as string,
  };
}
