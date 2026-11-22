"use server";

import { createClient } from "./server";
import { createAdminClient } from "./admin";
import { newRefCode } from "../tracking";

/* ── Actions serveur : MES LIENS D'APPORTEUR ─────────────────────────────────
   Un lien personnel par bien et par apporteur : `/explorer/<id>?ref=<code>`.
   Créé par le serveur (clé de service) après contrôle : je suis connecté, ce
   n'est pas mon bien, et le bien a une commission active. */

type Ok<T = object> = ({ ok: true } & T) | { ok: false; error: string };

export async function getOrCreateMyLink(propertyId: string): Promise<Ok<{ code: string }>> {
  if (!/^[0-9a-f-]{36}$/i.test(propertyId)) return { ok: false, error: "Bien introuvable." };
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Service indisponible." };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Connectez-vous pour obtenir votre lien." };

  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "Service indisponible." };

  const { data: prop } = await admin.from("properties").select("id, host_id, sold_to").eq("id", propertyId).maybeSingle();
  if (!prop || prop.sold_to) return { ok: false, error: "Ce bien n'est plus disponible." };
  if (prop.host_id === user.id) return { ok: false, error: "C'est votre bien : partagez-le directement." };
  const { data: prime } = await admin.from("primes").select("id").eq("property_id", propertyId).eq("active", true).limit(1).maybeSingle();
  if (!prime) return { ok: false, error: "Ce bien n'offre pas de commission." };

  const { data: existing, error: readErr } = await admin
    .from("apport_links").select("code").eq("property_id", propertyId).eq("apporteur_id", user.id).maybeSingle();
  if (readErr) return { ok: false, error: "Les liens tracés arrivent bientôt (base à mettre à jour)." };
  if (existing) return { ok: true, code: existing.code as string };

  for (let i = 0; i < 4; i++) {
    const code = newRefCode();
    const { error } = await admin.from("apport_links").insert({ code, property_id: propertyId, apporteur_id: user.id });
    if (!error) return { ok: true, code };
    if (error.code !== "23505") return { ok: false, error: "Le lien n'a pas pu être créé." };
    /* 23505 : code déjà pris (rare) ou lien créé en parallèle → on relit. */
    const { data: again } = await admin.from("apport_links").select("code").eq("property_id", propertyId).eq("apporteur_id", user.id).maybeSingle();
    if (again) return { ok: true, code: again.code as string };
  }
  return { ok: false, error: "Le lien n'a pas pu être créé." };
}
