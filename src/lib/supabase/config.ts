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
