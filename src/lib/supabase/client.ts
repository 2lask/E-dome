"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "./config";

/* Browser client : a utiliser dans les Client Components.
   Retourne null si Supabase n'est pas configure (mode demo sans backend). */

export function createClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }
  return createBrowserClient(getSupabaseUrl()!, getSupabaseAnonKey()!);
}
