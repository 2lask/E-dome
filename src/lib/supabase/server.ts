import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "./config";

/* Server client : pour Server Components, Route Handlers, Server Actions.
   Retourne null si Supabase pas configure. */

export async function createClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(getSupabaseUrl()!, getSupabaseAnonKey()!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          /* Cas des Server Components : les cookies sont read-only.
             Ignore silencieusement — le middleware s'en charge. */
        }
      },
    },
  });
}
