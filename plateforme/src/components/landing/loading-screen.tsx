"use client";

import { useEffect, useState } from "react";

/**
 * LoadingScreen — intro plein écran cinématique.
 *
 * Entrée :
 *   0.00s → image scale 1.12 → 1 (2.4s expo.out)
 *   0.15s → lettres E/D/O/M/E reveal (yPercent 110→0, dur 1.2s, stagger 0.09)
 *   0.40s → barre de chargement horizontale 0% → 100% (2.0s)
 *   0.40s → compteur "00 → 100" sync avec la barre
 *
 * Sortie (à ~2.6s, après que la barre soit pleine) :
 *   Tout le panneau se dissout : opacity 1→0 + blur 0→14px + scale 1→1.04.
 *   Effet "défocus caméra" très doux (1.4s, cubic-bezier(0.4, 0, 0.2, 1)).
 *
 * Unmount à ~4.0s.
 */
export function LoadingScreen() {
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Compteur synchronisé avec l'animation CSS de la barre :
    // démarre à 0.4s, se remplit en 2.0s. On affiche 0 → 100 pendant ces 2s.
    const startCounter = window.setTimeout(() => {
      const start = performance.now();
      const duration = 2000;
      let raf = 0;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        // Match l'easing CSS cubic-bezier(0.65, 0, 0.35, 1) — easeInOutCubic
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        setPct(Math.round(eased * 100));
        if (t < 1) raf = window.requestAnimationFrame(tick);
      };
      raf = window.requestAnimationFrame(tick);
      return () => window.cancelAnimationFrame(raf);
    }, 400);

    // Sortie déclenchée juste après que la barre soit pleine
    const exitTimer = window.setTimeout(() => setExiting(true), 2600);
    const removeTimer = window.setTimeout(() => {
      setDone(true);
      document.body.style.overflow = "";
    }, 4000);

    return () => {
      window.clearTimeout(startCounter);
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      aria-hidden="true"
      className={`loading-root${exiting ? " loading-exit" : ""}`}
    >
      <div className="loading-bg" />
      <div className="loading-veil" />

      <div className="loading-content">
        <h1 className="loading-text" aria-label="EDOME">
          {"EDOME".split("").map((c, i) => (
            <span key={i} className="loading-line">
              <span
                className="loading-letter"
                style={{ animationDelay: `${0.15 + i * 0.09}s` }}
              >
                {c}
              </span>
            </span>
          ))}
        </h1>

        <div>
          <span className="loading-bar">
            <span className="loading-bar-fill" />
          </span>
          <span className="loading-bar-pct">
            {String(pct).padStart(3, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
