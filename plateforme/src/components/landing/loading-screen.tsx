"use client";

import { useEffect, useState } from "react";

/**
 * LoadingScreen — intro plein écran avec blueprint architectural dense
 * (cadre double, équerres, X, lignes de cote avec flèches, target central,
 * marqueurs section, hachures, ticks de règle, cartouche).
 *
 * Palette : blanc rgba(255,255,255,0.85) en lignes principales,
 * orange #f59e0b pour les accents architecturaux, blanc 0.6 secondaire.
 *
 * Sortie : défocus caméra (opacity + blur + scale), 1.4s.
 */
export function LoadingScreen() {
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const exitTimer = window.setTimeout(() => setExiting(true), 3400);
    const removeTimer = window.setTimeout(() => {
      setDone(true);
      document.body.style.overflow = "";
    }, 4800);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  // Constantes couleurs / opacités
  const W_HI = "rgba(255,255,255,0.85)"; // lignes blanches principales
  const W_MD = "rgba(255,255,255,0.55)"; // lignes blanches secondaires
  const W_LO = "rgba(255,255,255,0.3)";  // axes, ticks
  const W_FN = "rgba(255,255,255,0.08)"; // grille très faible
  const O = "#f59e0b";                    // orange architectural

  // Helper inline style
  const at = (delay: number, dur = 1.0): React.CSSProperties => ({
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
          {/* ═══ BLUEPRINT SVG DENSE ═══ */}
          <svg
            className="loading-blueprint"
            viewBox="0 0 400 600"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            {/* ── Grille horizontale très subtile (5 lignes) ── */}
            <g stroke={W_FN} strokeWidth="0.5">
              {[140, 220, 300, 380, 460].map((y, i) => (
                <line key={y} x1="40" y1={y} x2="360" y2={y} pathLength="1" className="bp-line" style={at(0.5 + i * 0.05, 0.7)} />
              ))}
            </g>

            {/* ── Axes principaux blancs ── */}
            <line x1="200" y1="50" x2="200" y2="550" stroke={W_LO} strokeWidth="0.75" pathLength="1" className="bp-line bp-axis" />
            <line x1="40" y1="300" x2="360" y2="300" stroke={W_LO} strokeWidth="0.75" pathLength="1" className="bp-line bp-axis" style={at(0.5, 1.0)} />

            {/* ── Cadre extérieur BLANC principal ── */}
            <path d="M 40 70 L 360 70 L 360 530 L 40 530 Z" fill="none" stroke={W_HI} strokeWidth="1.5" pathLength="1" className="bp-line bp-frame" />

            {/* ── Cadre intérieur ORANGE ── */}
            <path d="M 70 110 L 330 110 L 330 490 L 70 490 Z" fill="none" stroke={O} strokeWidth="1" strokeOpacity="0.7" pathLength="1" className="bp-line" style={at(0.75, 1.5)} />

            {/* ── 4 équerres aux coins extérieurs (ORANGE épaisses) ── */}
            <g stroke={O} strokeWidth="2" fill="none" strokeLinecap="square">
              <path d="M 20 70 L 20 50 L 40 50" pathLength="1" className="bp-line" style={at(1.0, 0.5)} />
              <path d="M 360 50 L 380 50 L 380 70" pathLength="1" className="bp-line" style={at(1.08, 0.5)} />
              <path d="M 380 530 L 380 550 L 360 550" pathLength="1" className="bp-line" style={at(1.16, 0.5)} />
              <path d="M 40 550 L 20 550 L 20 530" pathLength="1" className="bp-line" style={at(1.24, 0.5)} />
            </g>

            {/* ── 4 X marks dans les coins intérieurs (BLANCS) ── */}
            <g stroke={W_MD} strokeWidth="0.75">
              <line x1="50" y1="80" x2="68" y2="98" pathLength="1" className="bp-line" style={at(1.30, 0.4)} />
              <line x1="68" y1="80" x2="50" y2="98" pathLength="1" className="bp-line" style={at(1.32, 0.4)} />
              <line x1="332" y1="80" x2="350" y2="98" pathLength="1" className="bp-line" style={at(1.34, 0.4)} />
              <line x1="350" y1="80" x2="332" y2="98" pathLength="1" className="bp-line" style={at(1.36, 0.4)} />
              <line x1="332" y1="502" x2="350" y2="520" pathLength="1" className="bp-line" style={at(1.38, 0.4)} />
              <line x1="350" y1="502" x2="332" y2="520" pathLength="1" className="bp-line" style={at(1.40, 0.4)} />
              <line x1="50" y1="502" x2="68" y2="520" pathLength="1" className="bp-line" style={at(1.42, 0.4)} />
              <line x1="68" y1="502" x2="50" y2="520" pathLength="1" className="bp-line" style={at(1.44, 0.4)} />
            </g>

            {/* ── Ligne de cote HAUT avec flèches (BLANC) ── */}
            <g stroke={W_HI} strokeWidth="0.75" fill="none">
              <line x1="40" y1="38" x2="360" y2="38" pathLength="1" className="bp-line" style={at(1.0, 1.0)} />
              <line x1="40" y1="33" x2="40" y2="43" pathLength="1" className="bp-line" style={at(1.0, 0.3)} />
              <line x1="360" y1="33" x2="360" y2="43" pathLength="1" className="bp-line" style={at(1.05, 0.3)} />
            </g>
            <text x="200" y="32" fontSize="9" textAnchor="middle" fill={W_HI} letterSpacing="0.18em" className="bp-label" style={{ animationDelay: "1.6s" }}>320</text>

            {/* ── Ligne de cote BAS avec flèches ── */}
            <g stroke={W_HI} strokeWidth="0.75" fill="none">
              <line x1="40" y1="562" x2="360" y2="562" pathLength="1" className="bp-line" style={at(1.1, 1.0)} />
              <line x1="40" y1="557" x2="40" y2="567" pathLength="1" className="bp-line" style={at(1.1, 0.3)} />
              <line x1="360" y1="557" x2="360" y2="567" pathLength="1" className="bp-line" style={at(1.15, 0.3)} />
            </g>

            {/* ── Ligne de cote DROITE verticale ── */}
            <g stroke={W_MD} strokeWidth="0.75" fill="none">
              <line x1="392" y1="70" x2="392" y2="530" pathLength="1" className="bp-line" style={at(1.2, 1.0)} />
              <line x1="387" y1="70" x2="397" y2="70" pathLength="1" className="bp-line" style={at(1.2, 0.3)} />
              <line x1="387" y1="530" x2="397" y2="530" pathLength="1" className="bp-line" style={at(1.25, 0.3)} />
            </g>
            <text x="395" y="303" fontSize="9" textAnchor="start" fill={W_HI} letterSpacing="0.18em" className="bp-label" style={{ animationDelay: "1.7s" }}>460</text>

            {/* ── Target central ORANGE (cercles + crosshair) ── */}
            <g stroke={O} strokeWidth="1.25" fill="none">
              <circle cx="200" cy="300" r="22" pathLength="1" className="bp-line" style={at(1.4, 0.7)} />
              <circle cx="200" cy="300" r="10" pathLength="1" className="bp-line" style={at(1.5, 0.5)} />
              <circle cx="200" cy="300" r="2" pathLength="1" className="bp-line" style={at(1.6, 0.3)} fill={O} />
              <line x1="174" y1="300" x2="186" y2="300" pathLength="1" className="bp-line" style={at(1.55, 0.3)} />
              <line x1="214" y1="300" x2="226" y2="300" pathLength="1" className="bp-line" style={at(1.55, 0.3)} />
              <line x1="200" y1="274" x2="200" y2="286" pathLength="1" className="bp-line" style={at(1.6, 0.3)} />
              <line x1="200" y1="314" x2="200" y2="326" pathLength="1" className="bp-line" style={at(1.6, 0.3)} />
            </g>

            {/* ── Marqueurs SECTION A et B (cercles ORANGES + lettres) ── */}
            <g fill="none" stroke={O} strokeWidth="1.25">
              <circle cx="100" cy="20" r="9" pathLength="1" className="bp-line" style={at(1.7, 0.5)} />
              <circle cx="300" cy="20" r="9" pathLength="1" className="bp-line" style={at(1.75, 0.5)} />
            </g>
            <text x="100" y="23" fontSize="11" textAnchor="middle" fill={O} fontWeight="500" className="bp-label" style={{ animationDelay: "2.0s" }}>A</text>
            <text x="300" y="23" fontSize="11" textAnchor="middle" fill={O} fontWeight="500" className="bp-label" style={{ animationDelay: "2.05s" }}>B</text>

            {/* ── Détail callout ORANGE (cercle + leader + label) ── */}
            <g stroke={O} strokeWidth="1" fill="none">
              <circle cx="60" cy="200" r="7" pathLength="1" className="bp-line" style={at(1.6, 0.4)} />
              <line x1="65" y1="195" x2="100" y2="172" pathLength="1" className="bp-line" style={at(1.7, 0.4)} />
            </g>
            <text x="105" y="170" fontSize="7" fill={O} letterSpacing="0.18em" className="bp-label" style={{ animationDelay: "2.1s" }}>DETAIL 01</text>

            {/* ── Détail callout 2 (côté droit) ── */}
            <g stroke={O} strokeWidth="1" fill="none">
              <circle cx="340" cy="400" r="7" pathLength="1" className="bp-line" style={at(1.65, 0.4)} />
              <line x1="335" y1="405" x2="300" y2="430" pathLength="1" className="bp-line" style={at(1.75, 0.4)} />
            </g>
            <text x="295" y="430" fontSize="7" fill={O} textAnchor="end" letterSpacing="0.18em" className="bp-label" style={{ animationDelay: "2.15s" }}>DETAIL 02</text>

            {/* ── Ticks de règle BAS (alternance courts/longs, BLANC) ── */}
            <g stroke={W_MD} strokeWidth="0.75">
              {[60, 100, 140, 180, 220, 260, 300, 340].map((x, i) => (
                <line key={`tb-${x}`} x1={x} y1="538" x2={x} y2={i % 2 === 0 ? 548 : 544} pathLength="1" className="bp-line" style={at(1.5 + i * 0.04, 0.3)} />
              ))}
            </g>

            {/* ── Ticks de règle HAUT intérieur ── */}
            <g stroke={W_MD} strokeWidth="0.75">
              {[80, 120, 160, 200, 240, 280, 320].map((x, i) => (
                <line key={`tt-${x}`} x1={x} y1="58" x2={x} y2={i % 2 === 0 ? 65 : 62} pathLength="1" className="bp-line" style={at(1.6 + i * 0.04, 0.3)} />
              ))}
            </g>

            {/* ── Hachures coin bas-gauche (ORANGE diagonales) ── */}
            <g stroke={O} strokeWidth="0.75" strokeOpacity="0.7">
              {[0, 5, 10, 15, 20, 25].map((o, i) => (
                <line key={`hbl-${i}`} x1={45 + o} y1="490" x2="45" y2={490 + o + 1} pathLength="1" className="bp-line" style={at(1.7 + i * 0.04, 0.3)} />
              ))}
            </g>

            {/* ── Hachures coin bas-droit ── */}
            <g stroke={O} strokeWidth="0.75" strokeOpacity="0.7">
              {[0, 5, 10, 15, 20, 25].map((o, i) => (
                <line key={`hbr-${i}`} x1={355 - o} y1="490" x2="355" y2={490 + o + 1} pathLength="1" className="bp-line" style={at(1.75 + i * 0.04, 0.3)} />
              ))}
            </g>

            {/* ── Cartouche bas ── */}
            <g fill="none">
              <path d="M 40 575 L 360 575 L 360 595 L 40 595 Z" stroke={W_HI} strokeWidth="0.75" pathLength="1" className="bp-line" style={at(1.8, 1.0)} />
              <line x1="120" y1="575" x2="120" y2="595" stroke={W_MD} strokeWidth="0.5" pathLength="1" className="bp-line" style={at(2.0, 0.3)} />
              <line x1="280" y1="575" x2="280" y2="595" stroke={W_MD} strokeWidth="0.5" pathLength="1" className="bp-line" style={at(2.05, 0.3)} />
            </g>

            {/* ── Labels mono ── */}
            <text x="40" y="20" fontSize="8" fill={W_HI} letterSpacing="0.18em" className="bp-label" style={{ animationDelay: "1.9s" }}>PROJECT — EDOME</text>
            <text x="360" y="20" fontSize="8" fill={W_HI} textAnchor="end" letterSpacing="0.18em" className="bp-label" style={{ animationDelay: "1.95s" }}>SCALE 1:1 — REV.A</text>

            <text x="80" y="588" fontSize="7" fill={W_HI} textAnchor="middle" letterSpacing="0.18em" className="bp-label" style={{ animationDelay: "2.1s" }}>2026</text>
            <text x="200" y="588" fontSize="9" fill={O} textAnchor="middle" letterSpacing="0.3em" fontWeight="500" className="bp-label" style={{ animationDelay: "2.15s" }}>EDOME</text>
            <text x="320" y="588" fontSize="7" fill={W_HI} textAnchor="middle" letterSpacing="0.18em" className="bp-label" style={{ animationDelay: "2.2s" }}>SHEET 01/01</text>
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
