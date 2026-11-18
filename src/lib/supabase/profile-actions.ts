"use server";

import { createClient } from "./server";

/* Action serveur : enregistre les champs de profil de la personne CONNECTÉE
   dans la table `profiles`. La RLS garantit qu'on n'écrit que sa propre ligne
   (`auth.uid() = id`). Appelée depuis le contexte (débattue) quand on édite son
   compte. En mode démo (pas de Supabase) ou sans session : no-op silencieux. */

export interface ProfilePatch {
  firstName?: string;
  lastName?: string;
  avatar?: string | null;
  city?: string | null;
  country?: string;
  bio?: string | null;
  roles?: string[];
}

export async function saveMyProfile(patch: ProfilePatch): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "supabase-non-configure" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "non-connecte" };

  const row: Record<string, unknown> = {};
  if (patch.firstName !== undefined) row.first_name = patch.firstName;
  if (patch.lastName !== undefined) row.last_name = patch.lastName;
  /* On n'enregistre PAS l'avatar « à initiales » généré (data-URI) : il est
     recréé à la volée. Seule une vraie photo (URL) est persistée. */
  if (patch.avatar !== undefined && !(patch.avatar ?? "").startsWith("data:")) row.avatar = patch.avatar;
  if (patch.city !== undefined) row.city = patch.city;
  if (patch.country !== undefined) row.country = patch.country;
  if (patch.bio !== undefined) row.bio = patch.bio;
  if (patch.roles !== undefined) row.roles = patch.roles;

  if (Object.keys(row).length === 0) return { ok: true };

  const { error } = await supabase.from("profiles").update(row).eq("id", user.id);
  return error ? { ok: false, error: error.message } : { ok: true };
}
