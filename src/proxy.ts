import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

/* ── Proxy ──────────────────────────────────────────────────────────────────

   Next 16 a renommé Middleware en Proxy ; la fonctionnalité est identique.
   Le fichier se place au même niveau que `app`, donc `src/proxy.ts`, et
   exporte soit `proxy`, soit un export par défaut.

   Contrainte vérifiée dans la documentation du guide de migration : le runtime
   `edge` n'est **pas** supporté par `proxy`, dont le runtime est `nodejs` et
   n'est pas configurable. Cette fonction n'utilise aucune API edge —
   `@supabase/ssr` fonctionne dans les deux.

   ── Le matcher, et pourquoi il change ──────────────────────────────────────

   Il couvrait auparavant **toutes** les routes, par exclusion des seuls actifs
   statiques. Cela n'avait aucun effet visible, parce que `updateSession` sort
   immédiatement tant que Supabase n'est pas configuré — ce qui est le cas
   aujourd'hui.

   Mais le jour où la clé anonyme Supabase serait renseignée, le proxy se
   réveillerait sur l'ensemble du site et redirigerait vers l'écran de
   connexion tout ce qui n'était pas explicitement exempté : `/feed`,
   `/explorer`, `/formations`, `/messages`… c'est-à-dire la maquette entière.
   Une plateforme de démonstration doit se parcourir sans compte.

   Le matcher est donc restreint aux deux seules zones qui doivent rester
   fermées :

   · `/admin`     — la console de la maquette, qui liste des adresses e-mail
                    et des signalements. Elle est aujourd'hui publiquement
                    atteignable ; c'est une dette connue, suivie dans TODO.md.
   · `/dashboard` — les données personnelles de l'utilisateur.

   `/admin/leads` est sous `/admin` et reste donc filtrée — mais elle porte sa
   propre porte par mot de passe et figure à ce titre dans les préfixes publics
   de `updateSession`, sans quoi la console des inscriptions deviendrait
   inatteignable le jour où Supabase est branché.

   Un codemod officiel existe pour cette migration
   (`npx @next/codemod@canary middleware-to-proxy .`). Elle a été faite à la
   main : le fichier tient en quelques lignes et le changement de matcher
   demandait de toute façon une décision. */

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
