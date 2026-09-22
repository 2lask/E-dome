import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "./config";

/* ── Client Supabase à clé de service ───────────────────────────────────────

   `import "server-only"` en première ligne : si ce module est un jour importé
   depuis un composant client, la compilation échoue au lieu d'expédier la clé
   de service au navigateur. C'est le garde-fou qui compte ici — cette clé
   contourne les politiques RLS et vaut un accès administrateur complet à la
   base.

   Les clients existants (`client.ts`, `server.ts`) utilisent la clé anonyme et
   passent par les cookies de session. Ce client-ci est différent : il n'a pas
   d'utilisateur, ne persiste aucune session et n'a rien à voir avec l'auth.
   Il sert uniquement aux écritures serveur sur des tables volontairement
   fermées à tout accès public, comme `leads`.

   La variable n'est délibérément pas préfixée `NEXT_PUBLIC_`. */

export function getServiceRoleKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
}

/** Vrai quand l'URL du projet et la clé de service sont toutes deux présentes. */
export function isSupabaseAdminConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getServiceRoleKey());
}

/**
 * Client à privilèges, ou `null` si la configuration est incomplète.
 * L'appelant décide quoi faire de l'absence — voir `lib/leads/store.ts`, qui
 * bascule sur un stockage fichier en développement et échoue en production.
 */
export function createAdminClient(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const key = getServiceRoleKey();
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
