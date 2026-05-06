"use client";

import { useEffect, useState } from "react";

/**
 * LoadingScreen — intro plein écran. Les traits architecturaux (blancs +
 * oranges) se dessinent progressivement et forment au final une MAISON
 * avec toit, murs, porte, fenêtres et cheminée. Pas de texte, pas de
 * chiffre, pas d'icône — uniquement de la géométrie.
 *
 * Sortie : défocus caméra (opacity + blur + scale), 1.4s.
 */
export function LoadingScreen() {
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const exitTimer = window.setTimeout(() => setExiting(true), 3600);
    const removeTimer = window.setTimeout(() => {
      setDone(true);
      document.body.style.overflow = "";
    }, 5000);
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  // Palette
  const W_HI = "rgba(255,255,255,0.92)";   // traits blancs principaux
  const W_MD = "rgba(255,255,255,0.55)";   // traits blancs secondaires
  const W_LO = "rgba(255,255,255,0.28)";   // axes, lignes de construction
  const W_FN = "rgba(255,255,255,0.07)";   // grille
  const O = "#f59e0b";                      // orange architectural

  // Helper inline
  const at = (delay: number, dur = 0.8): React.CSSProperties => ({
    animationDelay: `${delay}s`,
    animationDuration: `${dur}s`,
  });

  return (
    <div
      aria-hidden="true"
      className={`loading-root${exiting ? " loading-exit" : ""}`}
    >
      <div className="loading-bg" />
      <div className="loading-veil" />

      <div className="loading-content">
        <div className="loading-frame-wrap">
          <svg
            className="loading-blueprint"
            viewBox="0 0 400 600"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            {/* ═══════════ GRILLE FAIBLE ═══════════ */}
            <g stroke={W_FN} strokeWidth="0.5">
              {[80, 160, 240, 320, 400, 480, 560].map((y, i) => (
                <line key={`gh-${y}`} x1="-40" y1={y} x2="440" y2={y} pathLength="1" className="bp-line" style={at(0.4 + i * 0.03, 0.5)} />
              ))}
              {[80, 160, 240, 320].map((x, i) => (
                <line key={`gv-${x}`} x1={x} y1="-20" x2={x} y2="620" pathLength="1" className="bp-line" style={at(0.42 + i * 0.03, 0.5)} />
              ))}
            </g>

            {/* ═══════════ AXES PRINCIPAUX ÉTENDUS ═══════════ */}
            {/* Axe vertical central, dépassant haut + bas */}
            <line x1="200" y1="-20" x2="200" y2="620" stroke={W_LO} strokeWidth="0.6" pathLength="1" className="bp-line" style={at(0.5, 1.0)} />
            {/* Axe horizontal médian */}
            <line x1="-40" y1="300" x2="440" y2="300" stroke={W_LO} strokeWidth="0.6" pathLength="1" className="bp-line" style={at(0.55, 1.0)} />

            {/* ═══════════ LIGNES DE CONSTRUCTION (extensions) ═══════════ */}
            <g stroke={W_LO} strokeWidth="0.5">
              {/* Foundation extending past walls */}
              <line x1="-40" y1="510" x2="60" y2="510" pathLength="1" className="bp-line" style={at(0.6, 0.7)} />
              <line x1="340" y1="510" x2="440" y2="510" pathLength="1" className="bp-line" style={at(0.6, 0.7)} />

              {/* Roof base horizontal extending past walls */}
              <line x1="-40" y1="200" x2="60" y2="200" pathLength="1" className="bp-line" style={at(0.65, 0.7)} />
              <line x1="340" y1="200" x2="440" y2="200" pathLength="1" className="bp-line" style={at(0.65, 0.7)} />

              {/* Walls extending up past roof */}
              <line x1="60" y1="-20" x2="60" y2="200" pathLength="1" className="bp-line" style={at(0.7, 0.8)} />
              <line x1="340" y1="-20" x2="340" y2="200" pathLength="1" className="bp-line" style={at(0.7, 0.8)} />

              {/* Walls extending down past foundation */}
              <line x1="60" y1="510" x2="60" y2="600" pathLength="1" className="bp-line" style={at(0.78, 0.5)} />
              <line x1="340" y1="510" x2="340" y2="600" pathLength="1" className="bp-line" style={at(0.78, 0.5)} />

              {/* Window axes — vertical extending */}
              <line x1="122.5" y1="-20" x2="122.5" y2="620" pathLength="1" className="bp-line" style={at(0.85, 1.1)} />
              <line x1="277.5" y1="-20" x2="277.5" y2="620" pathLength="1" className="bp-line" style={at(0.87, 1.1)} />

              {/* Window horizontal axis extending */}
              <line x1="-40" y1="310" x2="440" y2="310" pathLength="1" className="bp-line" style={at(0.9, 1.0)} />

              {/* Door top horizontal extending */}
              <line x1="-40" y1="420" x2="440" y2="420" pathLength="1" className="bp-line" style={at(0.95, 1.0)} />

              {/* Roof apex horizontal extending */}
              <line x1="-40" y1="80" x2="440" y2="80" pathLength="1" className="bp-line" style={at(1.0, 1.0)} />

              {/* Diagonal extension lines from roof corners going outward */}
              <line x1="60" y1="200" x2="-30" y2="280" pathLength="1" className="bp-line" style={at(1.1, 0.6)} />
              <line x1="340" y1="200" x2="430" y2="280" pathLength="1" className="bp-line" style={at(1.1, 0.6)} />

              {/* Roof slope axis extending past apex going up */}
              <line x1="200" y1="80" x2="160" y2="40" pathLength="1" className="bp-line" style={at(1.15, 0.4)} />
              <line x1="200" y1="80" x2="240" y2="40" pathLength="1" className="bp-line" style={at(1.15, 0.4)} />
            </g>

            {/* ═══════════ MAISON — CONTOUR PRINCIPAL (BLANC ÉPAIS) ═══════════ */}
            <g stroke={W_HI} strokeWidth="2" fill="none" strokeLinecap="square">
              {/* Foundation principale */}
              <line x1="60" y1="510" x2="340" y2="510" pathLength="1" className="bp-line" style={at(1.05, 1.0)} />
              {/* Mur gauche */}
              <line x1="60" y1="200" x2="60" y2="510" pathLength="1" className="bp-line" style={at(1.1, 0.8)} />
              {/* Mur droit */}
              <line x1="340" y1="200" x2="340" y2="510" pathLength="1" className="bp-line" style={at(1.1, 0.8)} />
              {/* Pente toit gauche */}
              <line x1="200" y1="80" x2="60" y2="200" pathLength="1" className="bp-line" style={at(1.18, 0.9)} />
              {/* Pente toit droite */}
              <line x1="200" y1="80" x2="340" y2="200" pathLength="1" className="bp-line" style={at(1.18, 0.9)} />
            </g>

            {/* ═══════════ ÉPAISSEUR DES MURS / TOIT (blanc thin doublure intérieure) ═══════════ */}
            <g stroke={W_MD} strokeWidth="0.7">
              {/* Mur gauche intérieur */}
              <line x1="68" y1="200" x2="68" y2="510" pathLength="1" className="bp-line" style={at(1.25, 0.6)} />
              {/* Mur droit intérieur */}
              <line x1="332" y1="200" x2="332" y2="510" pathLength="1" className="bp-line" style={at(1.25, 0.6)} />
              {/* Pente toit gauche intérieure (parallèle décalée) */}
              <line x1="200" y1="93" x2="73" y2="201" pathLength="1" className="bp-line" style={at(1.3, 0.6)} />
              {/* Pente toit droite intérieure */}
              <line x1="200" y1="93" x2="327" y2="201" pathLength="1" className="bp-line" style={at(1.3, 0.6)} />
            </g>

            {/* ═══════════ ÉLÉMENTS ORANGE — détails architecturaux ═══════════ */}

            {/* Ligne du toit (base horizontale entre murs) — ORANGE bold */}
            <line x1="60" y1="200" x2="340" y2="200" stroke={O} strokeWidth="1.75" pathLength="1" className="bp-line" style={at(1.35, 0.7)} />

            {/* Petit accent au sommet du toit (faîtière) */}
            <line x1="186" y1="80" x2="214" y2="80" stroke={O} strokeWidth="2.5" pathLength="1" className="bp-line" style={at(1.42, 0.3)} />
            <circle cx="200" cy="80" r="2.5" fill={O} pathLength="1" className="bp-line" style={at(1.5, 0.2)} />

            {/* PORTE (orange) */}
            <g stroke={O} strokeWidth="1.5" fill="none">
              <path d="M 170 510 L 170 420 L 230 420 L 230 510" pathLength="1" className="bp-line" style={at(1.5, 0.8)} />
              {/* Refend vertical de porte */}
              <line x1="200" y1="420" x2="200" y2="510" pathLength="1" className="bp-line" style={at(1.6, 0.4)} />
              {/* Panneau horizontal */}
              <line x1="170" y1="465" x2="230" y2="465" pathLength="1" className="bp-line" style={at(1.65, 0.3)} />
              {/* Bas de porte (linteau intérieur) */}
              <line x1="175" y1="425" x2="225" y2="425" pathLength="1" className="bp-line" style={at(1.7, 0.3)} />
            </g>
            {/* Poignée (petit cercle plein) */}
            <circle cx="217" cy="490" r="1.8" fill={O} pathLength="1" className="bp-line" style={at(1.75, 0.2)} />

            {/* FENÊTRE GAUCHE (orange) */}
            <g stroke={O} strokeWidth="1.4" fill="none">
              <path d="M 95 280 L 150 280 L 150 340 L 95 340 Z" pathLength="1" className="bp-line" style={at(1.55, 0.6)} />
              <line x1="122.5" y1="280" x2="122.5" y2="340" pathLength="1" className="bp-line" style={at(1.62, 0.3)} />
              <line x1="95" y1="310" x2="150" y2="310" pathLength="1" className="bp-line" style={at(1.66, 0.3)} />
              {/* Appui de fenêtre */}
              <line x1="88" y1="345" x2="157" y2="345" pathLength="1" className="bp-line" style={at(1.72, 0.4)} />
              {/* Linteau */}
              <line x1="88" y1="275" x2="157" y2="275" pathLength="1" className="bp-line" style={at(1.74, 0.4)} />
            </g>

            {/* FENÊTRE DROITE (orange) */}
            <g stroke={O} strokeWidth="1.4" fill="none">
              <path d="M 250 280 L 305 280 L 305 340 L 250 340 Z" pathLength="1" className="bp-line" style={at(1.55, 0.6)} />
              <line x1="277.5" y1="280" x2="277.5" y2="340" pathLength="1" className="bp-line" style={at(1.62, 0.3)} />
              <line x1="250" y1="310" x2="305" y2="310" pathLength="1" className="bp-line" style={at(1.66, 0.3)} />
              <line x1="243" y1="345" x2="312" y2="345" pathLength="1" className="bp-line" style={at(1.72, 0.4)} />
              <line x1="243" y1="275" x2="312" y2="275" pathLength="1" className="bp-line" style={at(1.74, 0.4)} />
            </g>

            {/* CHEMINÉE (orange) — sur la pente gauche du toit */}
            <g stroke={O} strokeWidth="1.5" fill="none">
              <path d="M 130 130 L 130 60 L 158 60 L 158 105" pathLength="1" className="bp-line" style={at(1.78, 0.7)} />
              {/* Chapeau de cheminée */}
              <line x1="124" y1="60" x2="164" y2="60" pathLength="1" className="bp-line" style={at(1.88, 0.3)} />
              <line x1="124" y1="55" x2="164" y2="55" pathLength="1" className="bp-line" style={at(1.92, 0.3)} />
            </g>

            {/* MARCHES DEVANT LA PORTE (blanc) */}
            <g stroke={W_HI} strokeWidth="1">
              <line x1="160" y1="515" x2="240" y2="515" pathLength="1" className="bp-line" style={at(1.85, 0.4)} />
              <line x1="155" y1="520" x2="245" y2="520" pathLength="1" className="bp-line" style={at(1.9, 0.4)} />
              <line x1="150" y1="525" x2="250" y2="525" pathLength="1" className="bp-line" style={at(1.95, 0.4)} />
            </g>

            {/* HACHURES DU SOL SOUS FONDATION (orange diagonales) */}
            <g stroke={O} strokeWidth="0.65" strokeOpacity="0.65">
              {Array.from({ length: 42 }).map((_, i) => {
                const x = -30 + i * 12;
                return (
                  <line
                    key={`fh-${i}`}
                    x1={x}
                    y1="510"
                    x2={x - 9}
                    y2="528"
                    pathLength="1"
                    className="bp-line"
                    style={at(1.95 + i * 0.011, 0.3)}
                  />
                );
              })}
            </g>

            {/* TUILES DU TOIT (lignes parallèles aux pentes — blanc thin) */}
            {/* Pente gauche : 5 lignes parallèles à la pente, à intervalles */}
            <g stroke={W_MD} strokeWidth="0.55">
              {[0.18, 0.34, 0.5, 0.66, 0.82].map((t, i) => {
                // Point sur la pente gauche : interpolation entre apex (200,80) et corner (60,200)
                const sx = 200 - t * 140;
                const sy = 80 + t * 120;
                // Tile parallèle au sol (horizontal court)
                return (
                  <line
                    key={`rt-l-${i}`}
                    x1={sx + 8}
                    y1={sy + 6}
                    x2={sx + 32}
                    y2={sy + 6}
                    pathLength="1"
                    className="bp-line"
                    style={at(2.0 + i * 0.04, 0.3)}
                  />
                );
              })}
              {[0.18, 0.34, 0.5, 0.66, 0.82].map((t, i) => {
                const sx = 200 + t * 140;
                const sy = 80 + t * 120;
                return (
                  <line
                    key={`rt-r-${i}`}
                    x1={sx - 32}
                    y1={sy + 6}
                    x2={sx - 8}
                    y2={sy + 6}
                    pathLength="1"
                    className="bp-line"
                    style={at(2.0 + i * 0.04, 0.3)}
                  />
                );
              })}
            </g>

            {/* SOL DEVANT MAISON (lignes horizontales courtes au niveau sol) */}
            <g stroke={W_MD} strokeWidth="0.5">
              <line x1="-30" y1="540" x2="50" y2="540" pathLength="1" className="bp-line" style={at(2.2, 0.5)} />
              <line x1="350" y1="540" x2="430" y2="540" pathLength="1" className="bp-line" style={at(2.2, 0.5)} />
              <line x1="-30" y1="555" x2="40" y2="555" pathLength="1" className="bp-line" style={at(2.25, 0.5)} />
              <line x1="360" y1="555" x2="430" y2="555" pathLength="1" className="bp-line" style={at(2.25, 0.5)} />
            </g>

            {/* DEUX TRAITS LATÉRAUX QUI DÉPASSENT — bordure du dessin technique */}
            <g stroke={W_HI} strokeWidth="1">
              <line x1="40" y1="-10" x2="40" y2="615" pathLength="1" className="bp-line" style={at(2.3, 1.0)} />
              <line x1="360" y1="-10" x2="360" y2="615" pathLength="1" className="bp-line" style={at(2.32, 1.0)} />
            </g>
          </svg>

          {/* ── Texte EDOME centré ── */}
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
