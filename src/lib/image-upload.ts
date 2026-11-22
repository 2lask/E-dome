"use client";

import { createClient } from "@/lib/supabase/client";
import { createPropertyImageUpload, createPropertyVideoUpload } from "@/lib/supabase/storage-actions";

/* ── Envoi d'une photo de bien (navigateur) ──────────────────────────────────

   1. Redimensionnement local (2000 px max, JPEG 82 %) : une photo de
      téléphone de 5 Mo devient ~300 Ko — publication rapide, même en 4G.
   2. URL d'envoi signée demandée au serveur (chemin dans MON dossier).
   3. Envoi direct au stockage ; on garde l'URL publique. */

const MAX_SIDE = 2000;
const QUALITY = 0.82;

async function resize(file: File): Promise<Blob> {
  /* Les petites images, ou un navigateur sans createImageBitmap : telles quelles. */
  if (file.size < 350_000 || typeof createImageBitmap !== "function") return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", QUALITY));
  return blob ?? file;
}

export async function uploadPropertyImage(file: File): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  if (!file.type.startsWith("image/")) return { ok: false, error: `« ${file.name} » n'est pas une image.` };
  const supabase = createClient();
  if (!supabase) return { ok: false, error: "Service indisponible." };

  const blob = await resize(file);
  const mime = blob === file ? file.type : "image/jpeg";
  const signed = await createPropertyImageUpload(mime);
  if (!signed.ok) return signed;

  const { error } = await supabase.storage
    .from("property-images")
    .uploadToSignedUrl(signed.path, signed.token, blob, { contentType: mime, cacheControl: "31536000" });
  if (error) return { ok: false, error: `« ${file.name} » n'a pas pu être envoyée.` };
  return { ok: true, url: signed.publicUrl };
}

/** Envoie la vidéo d'un bien (50 Mo max) ; renvoie son URL publique. */
export async function uploadPropertyVideo(file: File): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  if (!file.type.startsWith("video/")) return { ok: false, error: `« ${file.name} » n'est pas une vidéo.` };
  const supabase = createClient();
  if (!supabase) return { ok: false, error: "Service indisponible." };
  const signed = await createPropertyVideoUpload(file.type, file.size);
  if (!signed.ok) return signed;
  const { error } = await supabase.storage
    .from("property-videos")
    .uploadToSignedUrl(signed.path, signed.token, file, { contentType: file.type, cacheControl: "31536000" });
  if (error) return { ok: false, error: "La vidéo n'a pas pu être envoyée." };
  return { ok: true, url: signed.publicUrl };
}
