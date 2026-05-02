"use client";

import { useEffect, useState } from "react";

/**
 * LoadingScreen — intro plein écran cinématique avec blueprint
 * architectural qui se dessine progressivement autour de EDOME.
 *
 * Entrée :
 *   0.00s → image scale 1.12 → 1 (2.4s expo.out)
 *   0.15s → lettres E/D/O/M/E reveal (yPercent 110→0, dur 1.2s, stagger 0.09)
 *   0.40s → axes vertical + horizontal s'étirent (1.0s)
 *   0.55s → cadre rectangle se dessine continuellement (1.7s)
 *   1.00s → équerres aux 4 coins (stagger 0.1s, 0.5s chacune)
 *   1.40s → crosshair central (0.5s)
 *   1.50s → ticks de règle bas (8x, stagger 0.05s)
 *   1.90s → label "EDOME / 2026" fade-in
 *
 * Sortie (à ~3.0s) :
 *   Tout le panneau se dissout : opacity 1→0 + blur 0→14px + scale 1→1.04.
 *
 * Unmount à ~4.4s.
 */
export function LoadingScreen() {
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const exitTimer = window.setTimeout(() => setExiting(true), 3000);
    const removeTimer = window.setTimeout(() => {
      setDone(true);
      document.body.style.overflow = "";
    }, 4400);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  // Coordonnées des ticks de règle (8 ticks répartis le long de la base)
  const tickXs = [60, 100, 140, 180, 220, 260, 300, 340];

  return (
    <div
      aria-hidden="true"
      className={`loading-root${exiting ? " loading-exit" : ""}`}
    >
      <div className="loading-bg" />
      <div className="loading-veil" />

      <div className="loading-content">
        <div className="loading-frame-wrap">
          {/* ── Blueprint SVG ── */}
          <svg
            className="loading-blueprint"
            viewBox="0 0 400 600"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            {/* Axes : verticale + horizontale très fines, faible opacité */}
            <line
              x1="200" y1="0" x2="200" y2="600"
              stroke="rgba(255,255,255,0.10)"
              strokeWidth="0.75"
              pathLength="1"
              className="bp-line bp-axis"
            />
            <line
              x1="0" y1="300" x2="400" y2="300"
              stroke="rgba(255,255,255,0.10)"
              strokeWidth="0.75"
              pathLength="1"
              className="bp-line bp-axis"
              style={{ animationDelay: "0.5s" }}
            />

            {/* Cadre rectangle principal (dessiné en continu sur les 4 côtés) */}
            <path
              d="M 50 50 L 350 50 L 350 550 L 50 550 Z"
              fill="none"
              stroke="rgba(255,255,255,0.30)"
              strokeWidth="1"
              pathLength="1"
              className="bp-line bp-frame"
            />

            {/* Équerres aux 4 coins en ambre */}
            <g stroke="#C4956A" strokeWidth="1.5" fill="none" strokeLinecap="square">
              <path d="M 30 50 L 30 30 L 50 30" pathLength="1" className="bp-line bp-corner" style={{ animationDelay: "1.0s" }} />
              <path d="M 350 30 L 370 30 L 370 50" pathLength="1" className="bp-line bp-corner" style={{ animationDelay: "1.1s" }} />
              <path d="M 370 550 L 370 570 L 350 570" pathLength="1" className="bp-line bp-corner" style={{ animationDelay: "1.2s" }} />
              <path d="M 50 570 L 30 570 L 30 550" pathLength="1" className="bp-line bp-corner" style={{ animationDelay: "1.3s" }} />
            </g>

            {/* Crosshair central + cercle de visée */}
            <g stroke="#C4956A" strokeWidth="1" fill="none">
              <circle cx="200" cy="300" r="8" pathLength="1" className="bp-line bp-center-line" />
              <line x1="186" y1="300" x2="194" y2="300" pathLength="1" className="bp-line bp-center-line" style={{ animationDelay: "1.5s" }} />
              <line x1="206" y1="300" x2="214" y2="300" pathLength="1" className="bp-line bp-center-line" style={{ animationDelay: "1.5s" }} />
              <line x1="200" y1="286" x2="200" y2="294" pathLength="1" className="bp-line bp-center-line" style={{ animationDelay: "1.55s" }} />
              <line x1="200" y1="306" x2="200" y2="314" pathLength="1" className="bp-line bp-center-line" style={{ animationDelay: "1.55s" }} />
            </g>

            {/* Ticks de règle bas (alternance courts/longs) */}
            <g stroke="rgba(255,255,255,0.45)" strokeWidth="0.75">
              {tickXs.map((x, i) => (
                <line
                  key={x}
                  x1={x} y1="555"
                  x2={x} y2={i % 2 === 0 ? 565 : 562}
                  pathLength="1"
                  className="bp-line bp-tick"
                  style={{ animationDelay: `${1.5 + i * 0.05}s` }}
                />
              ))}
            </g>

            {/* Ligne de cote bas avec extrémités */}
            <g stroke="rgba(255,255,255,0.35)" strokeWidth="0.75">
              <line x1="60" y1="585" x2="340" y2="585" pathLength="1" className="bp-line" style={{ animationDuration: "0.9s", animationDelay: "1.7s" }} />
              <line x1="60" y1="580" x2="60" y2="590" pathLength="1" className="bp-line bp-tick" style={{ animationDelay: "1.7s" }} />
              <line x1="340" y1="580" x2="340" y2="590" pathLength="1" className="bp-line bp-tick" style={{ animationDelay: "1.75s" }} />
            </g>

            {/* Label mono en haut à droite et bas centré */}
            <text
              x="370" y="22"
              fontSize="8"
              fill="rgba(255,255,255,0.45)"
              textAnchor="end"
              letterSpacing="0.18em"
              className="bp-label"
            >
              SCALE 1:1 — REV.A
            </text>
            <text
              x="200" y="600"
              fontSize="8"
              fill="rgba(255,255,255,0.55)"
              textAnchor="middle"
              letterSpacing="0.25em"
              className="bp-label"
              style={{ animationDelay: "2.0s" }}
            >
              EDOME / 2026
            </text>
          </svg>

          {/* ── Texte EDOME (centré dans le cadre) ── */}
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
        </div>
      </div>
    </div>
  );
}
