"use client";

import { useEffect } from "react";

/**
 * ScrollFadeController — applique une opacity scroll-linked à tous les
 * éléments marqués [data-scroll-fade]. Effet studiopwi.com :
 *   - centre de l'élément près du centre du viewport → opacity 1
 *   - élément qui s'éloigne du centre → fade vers 0
 *
 * Courbe : plein dans une bande de ±20% de la hauteur du viewport autour
 * du centre, fade linéaire jusqu'à 0 à 65% de distance.
 *
 * Mount unique au root, scanne le DOM à chaque scroll via rAF, désactivé
 * si l'utilisateur a prefers-reduced-motion: reduce.
 */
export function ScrollFadeController() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const update = () => {
      const els = document.querySelectorAll<HTMLElement>("[data-scroll-fade]");
      const vh = window.innerHeight;
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;
        const vpCenter = vh / 2;
        const dist = Math.abs(elCenter - vpCenter) / vh;
        // opacity = 1 dans la bande [0, 0.20], fade linéaire vers 0 à 0.65
        let opacity = 1 - Math.max(0, dist - 0.2) / 0.45;
        opacity = Math.max(0, Math.min(1, opacity));
        el.style.opacity = String(opacity);
        el.style.willChange = "opacity";
      });
    };

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    // Initial : 2 frames pour laisser le layout se stabiliser
    update();
    requestAnimationFrame(update);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}
