import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/* /auth/callback : endpoint OAuth callback Supabase.
   Apres "Continuer avec Google", Supabase redirige ici avec un code
   qu'on echange contre une session. */

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  /* "next" vient de l'URL : on n'accepte qu'un chemin relatif simple.
     Sans ce garde, "?next=@evil.com" concatene en "https://origin@evil.com"
     — la partie avant @ est lue comme userinfo et le navigateur atterrit
     sur evil.com, session valide en poche. Le refus de "//" bloque aussi
     la forme "//evil.com" (URL protocol-relative). */
  const rawNext = searchParams.get("next") ?? "/feed";
  const next = /^\/(?!\/)/.test(rawNext) ? rawNext : "/feed";

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(new URL(next, origin));
      }
    }
  }

  /* Pas de code ou Supabase pas configure → erreur */
  return NextResponse.redirect(new URL("/auth/erreur", origin));
}
