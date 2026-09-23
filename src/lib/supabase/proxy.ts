import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "./config";

/* Session Supabase pour le proxy : rafraichit la session et redirige vers
   /auth/connexion si l'utilisateur atteint une zone fermee sans etre
   connecte.

   Depuis la migration vers `src/proxy.ts`, cette fonction n'est appelee que
   sur `/admin/*` et `/dashboard/*` : le matcher fait desormais le gros du
   filtrage. La liste ci-dessous n'a donc plus besoin d'enumerer /merci,
   /confidentialite, les actifs statiques ni robots.txt — ces routes ne
   passent tout simplement plus par ici.

   Il en reste une seule entree, et elle est essentielle. */
const PUBLIC_PREFIXES = [
  /* /admin/leads est sous /admin, donc filtree par le matcher, mais elle
     porte sa PROPRE porte par mot de passe cote serveur. Sans cette
     exemption, la console des inscriptions deviendrait inatteignable le jour
     ou Supabase est branche — et son mot de passe ne servirait plus a rien.

     Le suffixe "/" est ajoute a la comparaison pour qu'une future route
     "/adminleads" ne soit pas exemptee par accident. */
  "/admin/leads",
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

  /* La racine n'est plus testee ici : le matcher de `src/proxy.ts` ne fait
     passer que /admin/* et /dashboard/*, donc `/` n'atteint jamais cette
     fonction. La garder donnerait l'illusion que la landing depend de ce
     filtre. */
  const pathname = request.nextUrl.pathname;
  const isPublic = PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/connexion";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}
