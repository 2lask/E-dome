import "server-only";
import { createClient } from "./server";
import type { SessionUser } from "../session-user";

/* ── La personne connectée ──────────────────────────────────────────────────

   Le pont entre l'authentification Supabase et l'application. `getCurrentUser`
   lit la session (cookies) et renvoie le profil de la personne connectée, ou
   `null`.

   `null` a DEUX sens, volontairement confondus pour l'appelant :
     · Supabase n'est pas configuré → mode démonstration, l'application tourne
       sur ses données fictives et son sélecteur de personne (« être un
       profil »).
     · Supabase est configuré mais personne n'est connecté → visiteur anonyme.

   Dans les deux cas, l'appelant retombe sur le comportement démo. La bascule
   vers les vraies données se fait écran par écran (phases suivantes) : tant
   qu'un écran n'est pas migré, il ignore ce helper et garde ses données
   fictives. Aucune régression pendant la migration. */

export type CurrentUser = SessionUser;

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  if (!supabase) return null; // Supabase non configuré → mode démo

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null; // personne connectée

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "first_name, last_name, avatar, city, country, bio, roles, active_role, trades, interests",
    )
    .eq("id", user.id)
    .single();

  /* Le profil est créé par le déclencheur `on_auth_user_created`. S'il manque
     (course rare juste après l'inscription), on retombe sur les métadonnées du
     compte plutôt que d'échouer. */
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  return {
    id: user.id,
    email: user.email ?? null,
    firstName: profile?.first_name ?? (meta.firstName as string) ?? "",
    lastName: profile?.last_name ?? (meta.lastName as string) ?? "",
    avatar: profile?.avatar ?? (meta.avatar_url as string) ?? null,
    city: profile?.city ?? null,
    country: profile?.country ?? "Suisse",
    bio: profile?.bio ?? null,
    roles: profile?.roles ?? ["particulier"],
    activeRole: profile?.active_role ?? "particulier",
    trades: profile?.trades ?? [],
    interests: profile?.interests ?? [],
  };
}

/** Vrai si une personne est connectée (backend actif). */
export async function isAuthenticated(): Promise<boolean> {
  return (await getCurrentUser()) !== null;
}
