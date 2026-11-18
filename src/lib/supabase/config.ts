/* Config Supabase : helpers pour detecter la configuration et lire
   les variables d'environnement. Si NEXT_PUBLIC_SUPABASE_URL est
   absent, la couche auth devient inactive et la demo continue de
   fonctionner sans connexion (les pages auth restent visibles mais
   les boutons OAuth renvoient une erreur claire). */

export function getSupabaseUrl(): string | null {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
}

export function getSupabaseAnonKey(): string | null {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? null;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

/* 2026-11-18 : reconstruction forcée de la préprod pour que Vercel ré-inline
   les variables NEXT_PUBLIC_SUPABASE_* (gravées au build) après leur ajout —
   l'ancien build caché gardait « mode démo ». Ce commentaire force la
   recompilation de ce module avec les clés présentes. */
