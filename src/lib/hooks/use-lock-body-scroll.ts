"use client";

import { useEffect, useState } from "react";

/* ─── useIsMobile ─────────────────────────────────────────────────────────
   Detecte si le viewport est <= 767px (breakpoint md de Tailwind par
   defaut). Reactive : se met a jour sur resize/orientation change.

   Sert notamment a gater useLockBodyScroll pour qu'il ne s'applique
   PAS sur desktop quand le modal correspondant n'existe que mobile
   (ex: bottom-sheet filtres /explorer).
   ─────────────────────────────────────────────────────────────────── */
export function useIsMobile(breakpoint = 767) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [breakpoint]);
  return isMobile;
}

/* ─── useLockBodyScroll ───────────────────────────────────────────────────
   Empêche le scroll de la page derrière un modal/drawer ouvert sur mobile.

   Sans ce hook, sur iOS Safari notamment :
   - L'utilisateur essaie de scroller le contenu du modal
   - Le doigt sort du modal ou le modal n'a pas assez de hauteur
   - La page derrière scrolle → confusión visuelle
   - Le modal lui-même se déplace ("modal qui flotte")

   Pattern : pose overflow:hidden + position:fixed sur <html> et conserve
   le scrollY pour le restaurer à la fermeture (sinon iOS reset à 0).

   Usage :
     const open = useState(false);
     useLockBodyScroll(open);

   Compose plusieurs modals : si DEUX modals utilisent le hook simultanément
   on garde une référence-comptée via un counter sur dataset pour éviter
   un unlock prématuré.
   ─────────────────────────────────────────────────────────────────── */

const SCROLL_Y_DATASET_KEY = "lockedScrollY";
const LOCK_COUNT_DATASET_KEY = "lockCount";

export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const html = document.documentElement;
    const body = document.body;

    const prevLockCount = Number(html.dataset[LOCK_COUNT_DATASET_KEY] ?? "0");

    if (prevLockCount === 0) {
      const scrollY = window.scrollY;
      html.dataset[SCROLL_Y_DATASET_KEY] = String(scrollY);
      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflowY = "scroll"; // évite le shift de layout (scrollbar reserve)
    }

    html.dataset[LOCK_COUNT_DATASET_KEY] = String(prevLockCount + 1);

    return () => {
      const newCount = Number(html.dataset[LOCK_COUNT_DATASET_KEY] ?? "1") - 1;
      html.dataset[LOCK_COUNT_DATASET_KEY] = String(newCount);

      if (newCount <= 0) {
        const scrollY = Number(html.dataset[SCROLL_Y_DATASET_KEY] ?? "0");
        body.style.position = "";
        body.style.top = "";
        body.style.left = "";
        body.style.right = "";
        body.style.width = "";
        body.style.overflowY = "";
        delete html.dataset[SCROLL_Y_DATASET_KEY];
        delete html.dataset[LOCK_COUNT_DATASET_KEY];
        window.scrollTo(0, scrollY);
      }
    };
  }, [locked]);
}
