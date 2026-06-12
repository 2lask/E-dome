import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/* Middleware Next.js : intercepte chaque requete pour refresh la
   session Supabase et appliquer la protection des routes (app).
   Voir matcher pour les exclusions. */

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /* Exclut explicitement : assets statiques, images, fichiers PWA,
       et toutes les routes qui n'ont pas besoin d'auth-check. */
    "/((?!_next/static|_next/image|favicon.ico|icons|images|videos|lottie|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm|json)$).*)",
  ],
};
