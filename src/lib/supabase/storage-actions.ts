"use server";

import { createClient } from "./server";
import { createAdminClient } from "./admin";

/* ── Photos des biens : URL d'envoi signées (REBUILD.md §3.4) ────────────────

   Le serveur vérifie l'identité, fixe le chemin DANS le dossier de la personne
   (`<id>/<aléatoire>.<ext>`) et signe une URL d'envoi à usage unique. Le
   navigateur envoie ensuite l'image directement au stockage. Avantages : pas
   de politique de stockage à écrire, pas de limite de taille des actions
   serveur, et personne ne peut écrire dans le dossier d'un autre.

   Bucket `property-images` (public en lecture) — migration 003. */

const BUCKET = "property-images";
const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export async function createPropertyImageUpload(
  mime: string,
): Promise<{ ok: true; path: string; token: string; publicUrl: string } | { ok: false; error: string }> {
  const ext = EXT[mime];
  if (!ext) return { ok: false, error: "Format non accepté (JPEG, PNG ou WebP)." };

  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Service indisponible." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Reconnectez-vous pour ajouter des photos." };

  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "Service indisponible." };

  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
  const { data, error } = await admin.storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data) return { ok: false, error: "L'envoi n'a pas pu être préparé." };

  const { data: pub } = admin.storage.from(BUCKET).getPublicUrl(path);
  return { ok: true, path, token: data.token, publicUrl: pub.publicUrl };
}

/* ── Vidéo d'un bien (migration 009, bucket `property-videos`, 50 Mo max) ──── */
const VIDEO_BUCKET = "property-videos";
const VIDEO_EXT: Record<string, string> = { "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov" };

export async function createPropertyVideoUpload(
  mime: string,
  size: number,
): Promise<{ ok: true; path: string; token: string; publicUrl: string } | { ok: false; error: string }> {
  const ext = VIDEO_EXT[mime];
  if (!ext) return { ok: false, error: "Format non accepté (MP4, WebM ou MOV)." };
  if (!Number.isFinite(size) || size <= 0 || size > 50 * 1024 * 1024) return { ok: false, error: "Vidéo trop lourde : 50 Mo au plus (environ 1 minute en 1080p)." };

  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Service indisponible." };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Reconnectez-vous pour ajouter une vidéo." };
  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "Service indisponible." };

  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
  const { data, error } = await admin.storage.from(VIDEO_BUCKET).createSignedUploadUrl(path);
  if (error || !data) return { ok: false, error: "L'envoi n'a pas pu être préparé." };
  const { data: pub } = admin.storage.from(VIDEO_BUCKET).getPublicUrl(path);
  return { ok: true, path, token: data.token, publicUrl: pub.publicUrl };
}
