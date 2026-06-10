"use client";

import { useEffect } from "react";

/* Kill-switch cote client. Travaille en duo avec public/sw.js
   (lui-meme reduit a un kill-switch qui se desinscrit).

   Probleme initial : l'ancien SW (CACHE_NAME = "edome-v10") avait
   precache /dashboard avec strategie network-first cache-fallback.
   Resultat : meme apres deploy, les visiteurs voyaient l'ancienne
   home (34 reservations, Studio Centre-Ville, viewport user-scalable=
   no, etc.) parce que le SW servait le HTML cache avant que le
   reseau ne reponde.

   Sequence de nettoyage :
   1. Detecte tout SW enregistre
   2. Le desinscrit + vide les caches
   3. Si on a effectivement nettoye quelque chose, on recharge la
      page une seule fois (flag sessionStorage pour eviter la boucle)
      afin que le contenu serve directement depuis le reseau.

   Une fois le visiteur "soigne", la prochaine navigation est
   100% reseau, les redirects/refontes sont visibles immediatement. */

const RELOAD_FLAG = "edome-sw-killswitch-reloaded";

export function PWARegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let didCleanup = false;

    Promise.all([
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        return Promise.all(
          registrations.map((r) => {
            didCleanup = true;
            return r.unregister();
          }),
        );
      }),
      caches.keys().then((names) => {
        if (names.length > 0) didCleanup = true;
        return Promise.all(names.map((name) => caches.delete(name)));
      }),
    ]).then(() => {
      if (didCleanup && !sessionStorage.getItem(RELOAD_FLAG)) {
        sessionStorage.setItem(RELOAD_FLAG, "1");
        window.location.reload();
      }
    });
  }, []);

  return null;
}
