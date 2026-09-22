"use client";

import { useEffect } from "react";
import {
  REF_COOKIE,
  REF_COOKIE_MAX_AGE_SECONDS,
  REF_QUERY_PARAM,
  UTM_COOKIE,
  hasUtm,
  readUtmFromSearch,
  serializeUtm,
} from "@/lib/leads/tracking";
import { normalizeRefCode } from "@/lib/leads/ref-code";

/* ── Capture du parrainage et des paramètres UTM ─────────────────────────────

   Composant sans rendu, monté sur la landing. Il lit l'URL à l'arrivée et
   dépose deux cookies, que la Server Action relira à l'envoi du formulaire.

   Pourquoi des cookies et pas un état React : la personne arrive souvent par
   `?ref=CODE`, navigue, revient plus tard, puis remplit le formulaire. Le
   cookie survit à tout cela, un état en mémoire non.

   Le parrainage tient 30 jours, comme annoncé dans la politique de
   confidentialité. Les UTM sont en cookie de session : ils décrivent la
   visite en cours, pas la personne.

   `SameSite=Lax` suffit : ces cookies ne sont lus que par nos propres
   requêtes. `Secure` est ajouté dès qu'on est en HTTPS — jamais en
   développement sur http://localhost, sinon le navigateur refuserait le
   cookie et le mécanisme serait silencieusement inopérant en local.

   Le paramètre `ref` est retiré de la barre d'adresse après lecture : le lien
   partagé reste propre si la personne le recopie depuis son navigateur. Les
   UTM sont laissés en place, les outils de mesure les lisant eux-mêmes. */

function setCookie(name: string, value: string, maxAgeSeconds?: number) {
  const parts = [`${name}=${value}`, "Path=/", "SameSite=Lax"];
  if (typeof maxAgeSeconds === "number") parts.push(`Max-Age=${maxAgeSeconds}`);
  if (window.location.protocol === "https:") parts.push("Secure");
  document.cookie = parts.join("; ");
}

export function TrackingCapture() {
  useEffect(() => {
    const search = window.location.search;
    if (!search) return;

    const params = new URLSearchParams(search);

    const ref = normalizeRefCode(params.get(REF_QUERY_PARAM));
    if (ref) {
      setCookie(REF_COOKIE, ref, REF_COOKIE_MAX_AGE_SECONDS);
      params.delete(REF_QUERY_PARAM);
      const rest = params.toString();
      /* `replaceState` plutôt qu'une navigation Next : on ne veut ni
         rechargement, ni entrée d'historique, ni perte de la position de
         défilement. */
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${rest ? `?${rest}` : ""}${window.location.hash}`,
      );
    }

    const utm = readUtmFromSearch(search);
    if (hasUtm(utm)) setCookie(UTM_COOKIE, serializeUtm(utm));
  }, []);

  return null;
}
