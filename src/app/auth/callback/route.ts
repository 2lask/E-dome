import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/* /auth/callback : endpoint OAuth callback Supabase.
   Apres "Continuer avec Google", Supabase redirige ici avec un code
   qu'on echange contre une session. */

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/feed";

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  /* Pas de code ou Supabase pas configure → erreur */
  return NextResponse.redirect(`${origin}/auth/erreur`);
}
