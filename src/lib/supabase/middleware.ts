import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "./config";

/* Middleware Supabase : rafraichit la session sur chaque requete et
   redirige vers /auth/connexion si l'utilisateur tente d'acceder a
   un route protege sans etre connecte. Routes proteges = tout (app)
   sauf /auth/* et les pages publiques. */

/* Prefixes publics. Le suffixe "/" est ajoute a la comparaison pour eviter
   qu'une future route "/apidoc" ou "/imagesecretes" soit exemptee par hasard.
   La racine "/" est traitee a part : en prefixe, elle rendrait TOUT public. */
/* Routes accessibles sans session.

   Important pour la landing : /merci est atteinte juste apres l'envoi du
   formulaire, par quelqu'un qui n'a aucun compte, et /admin/leads porte sa
   propre porte par mot de passe — une redirection vers /auth/connexion la rendrait
   inatteignable. /confidentialite est liee depuis le pied de page public, et
   robots.txt comme sitemap.xml doivent rester lisibles par les moteurs.

   Sans ces entrees, tout cela casserait le jour ou Supabase sera configure,
   pas avant : le middleware sort immediatement tant qu'il ne l'est pas. */
const PUBLIC_PREFIXES = [
  "/auth",
  "/api",
  "/merci",
  /* UNIQUEMENT la page leads : /admin (console de la maquette) doit rester
     protegee. L'exempter entierement aggraverait un trou deja identifie. */
  "/admin/leads",
  "/confidentialite",
  "/conditions",
  "/robots.txt",
  "/sitemap.xml",
  "/_next",
  "/favicon",
  "/icons",
  "/images",
  "/videos",
  "/manifest",
];

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
  const isPublic =
    pathname === "/" ||
    PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/connexion";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}
