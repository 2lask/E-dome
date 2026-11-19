"use server";

import { createClient } from "./server";

/* ── Préférence d'e-mails (métadonnées du compte, aucune table) ──────────────
   Chaque membre ne lit et n'écrit que SA préférence (session). Par défaut :
   activées — une demande ou une prime acceptée qu'on ne voit pas, c'est de
   l'argent perdu pour le membre. */

export async function getEmailNotifications(): Promise<boolean | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return user.user_metadata?.email_notifications !== false;
}

export async function setEmailNotifications(on: boolean): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  if (!supabase) return { ok: false };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false };
  const { error } = await supabase.auth.updateUser({ data: { email_notifications: on === true } });
  return { ok: !error };
}
