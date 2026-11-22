import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "./config";

/* Session Supabase pour le proxy. Appelée sur TOUTES les routes (matcher large
   dans `src/proxy.ts`), pour UNE raison : rafraîchir la session et synchroniser
   les cookies partout, afin que `getCurrentUser()` (layout serveur) reconnaisse
   la personne connectée sur tout le site — pas seulement sur /dashboard.

   Elle ne REDIRIGE vers /auth/connexion que sur les zones FERMÉES
   (`PROTECTED_PREFIXES`) ; ailleurs elle laisse passer (navigation publique,
   connecté ou non). Sans Supabase configuré, elle sort immédiatement. */

/* Zones fermées : redirection vers la connexion si non connecté. Ce sont les
   espaces d'un MEMBRE (REBUILD.md §3.3) : un visiteur n'a ni demandes, ni
   biens, ni réglages — et publier crée une annonce à son nom. */
const PROTECTED_PREFIXES = [
  "/admin",
  "/dashboard",
  "/demandes",
  "/mes-biens",
  "/publier",
  "/parametres",
  "/favoris",
  "/recherches/nouvelle",
  "/reglements",
  "/tableau-de-bord",
];
/* Correspondance EXACTE : `/profil` est MA fiche, `/profil/[id]` reste public. */
const PROTECTED_EXACT = ["/profil", "/dossier", "/agence"];
/* /admin/leads a sa PROPRE porte par mot de passe : exemptée du filtre Supabase. */
const AUTH_EXEMPT = ["/admin/leads"];

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
  const isProtected =
    PROTECTED_EXACT.includes(pathname) ||
    PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const isExempt = AUTH_EXEMPT.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!user && isProtected && !isExempt) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/connexion";
    /* Chemin ET paramètres (ex. /publier?mode=reprise) : rien ne se perd. */
    url.search = "";
    url.searchParams.set("redirect", pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  return response;
}
