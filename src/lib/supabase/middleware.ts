import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "./config";

/* Middleware Supabase : rafraichit la session sur chaque requete et
   redirige vers /auth/connexion si l'utilisateur tente d'acceder a
   un route protege sans etre connecte. Routes proteges = tout (app)
   sauf /auth/* et les pages publiques. */

const PUBLIC_ROUTES = ["/", "/auth", "/api", "/_next", "/favicon", "/icons", "/images", "/videos", "/manifest"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  /* Pas de Supabase configure → laisse tout passer (mode demo). */
  if (!isSupabaseConfigured()) {
    return response;
  }

  const supabase = createServerClient(getSupabaseUrl()!, getSupabaseAnonKey()!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  /* Important : appeler getUser() oblige le refresh de la session. */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isPublic = PUBLIC_ROUTES.some((p) => pathname.startsWith(p));

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/connexion";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}
