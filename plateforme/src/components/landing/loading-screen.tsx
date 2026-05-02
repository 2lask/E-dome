"use client";

import { useEffect, useState } from "react";

/**
 * LoadingScreen — intro plein écran (image gratte-ciels + EDOME vertical
 * mask-reveal + trait ambre). Animations 100 % CSS, zéro dépendance.
 *
 * Timeline :
 *   0.00s  → image scale 1.12 → 1 (2.4s expo.out)
 *   0.15s  → lettres E/D/O/M/E reveal (yPercent 110→0, dur 1.2s, stagger 0.09)
 *   0.70s  → trait ambre vertical scaleY 0→1 (1.0s)
 *   ~2.30s → SORTIE : lettres s'envolent (0.55s) + trait se rétracte (0.45s)
 *                     + image continue son zoom (1.1s) + panneau remonte
 *                     comme un rideau (translateY -101%, 1.1s expo.inOut)
 *   ~3.40s → unmount
 */
export function LoadingScreen() {
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const fadeTimer = window.setTimeout(() => setExiting(true), 2300);
    const removeTimer = window.setTimeout(() => {
      setDone(true);
      document.body.style.overflow = "";
    }, 3450);

    return () => {
      window.clearTimeout(fadeTimer);
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
        <span className="loading-rule" />
      </div>
    </div>
  );
}
