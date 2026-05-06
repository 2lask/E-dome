"use client";

import { useEffect, useState } from "react";

/**
 * LoadingScreen — fond NOIR pur, plus d'image. Une villa brutaliste de
 * 3 niveaux vue de l'extérieur se trace progressivement en blanc avec
 * quelques touches orange (porte d'entrée, skylights). Inspiration :
 * Le Corbusier (Villa Savoye, pilotis + strip windows), Tadao Ando
 * (béton brut, fenêtres en bandeau), Marcel Breuer (cantilevers).
 */
export function LoadingScreen() {
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const exitTimer = window.setTimeout(() => setExiting(true), 4200);
    const removeTimer = window.setTimeout(() => {
      setDone(true);
      document.body.style.overflow = "";
    }, 5600);
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  // Palette : blancs sur noir + 2 touches orange
  const W_HI = "rgba(255,255,255,0.95)";   // contours principaux (volumes)
  const W_MD = "rgba(255,255,255,0.62)";   // mullions, fins, parapets, garde-corps
  const W_LO = "rgba(255,255,255,0.32)";   // axes, lignes de construction
  const W_FN = "rgba(255,255,255,0.10)";   // grille
  const W_BAND = "rgba(255,255,255,0.18)"; // bandes de coffrage béton
  const O = "#f59e0b";                      // touches orange

  // Helper inline
  const at = (delay: number, dur = 0.7): React.CSSProperties => ({
    animationDelay: `${delay}s`,
    animationDuration: `${dur}s`,
  });

  return (
    <div
      aria-hidden="true"
      className={`loading-root${exiting ? " loading-exit" : ""}`}
    >
      <div className="loading-content">
        <div className="loading-frame-wrap">
          <svg
            className="loading-blueprint"
            viewBox="0 0 600 600"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            {/* ═══════ GRILLE FAIBLE ═══════ */}
            <g stroke={W_FN} strokeWidth="0.7">
              {[100, 200, 300, 400, 500].map((y, i) => (
                <line key={`gh-${y}`} x1="-30" y1={y} x2="630" y2={y} pathLength="1" className="bp-line" style={at(0.3 + i * 0.025, 0.5)} />
              ))}
              {[100, 200, 300, 400, 500].map((x, i) => (
                <line key={`gv-${x}`} x1={x} y1="-30" x2={x} y2="630" pathLength="1" className="bp-line" style={at(0.32 + i * 0.025, 0.5)} />
              ))}
            </g>

            {/* ═══════ AXES + LIGNES DE CONSTRUCTION ═══════ */}
            <g stroke={W_LO} strokeWidth="0.8">
              {/* Axe vertical central */}
              <line x1="300" y1="-30" x2="300" y2="630" pathLength="1" className="bp-line" style={at(0.45, 1.0)} />
              {/* Lignes de niveau étendues */}
              <line x1="-30" y1="100" x2="630" y2="100" pathLength="1" className="bp-line" style={at(0.5, 1.0)} />
              <line x1="-30" y1="240" x2="630" y2="240" pathLength="1" className="bp-line" style={at(0.55, 1.0)} />
              <line x1="-30" y1="370" x2="630" y2="370" pathLength="1" className="bp-line" style={at(0.6, 1.0)} />
              <line x1="-30" y1="475" x2="630" y2="475" pathLength="1" className="bp-line" style={at(0.65, 1.0)} />
              {/* Verticales d'alignement */}
              <line x1="80" y1="60" x2="80" y2="540" pathLength="1" className="bp-line" style={at(0.7, 0.8)} />
              <line x1="540" y1="60" x2="540" y2="540" pathLength="1" className="bp-line" style={at(0.72, 0.8)} />
            </g>

            {/* ═══════ LIGNE DE SOL ═══════ */}
            <line x1="-30" y1="520" x2="630" y2="520" stroke={W_HI} strokeWidth="2.2" pathLength="1" className="bp-line" style={at(0.8, 1.0)} />

            {/* ═══════ HACHURES SOUS LE SOL ═══════ */}
            <g stroke={W_MD} strokeWidth="0.9">
              {Array.from({ length: 56 }).map((_, i) => {
                const x = -20 + i * 12;
                return (
                  <line
                    key={`gh-${i}`}
                    x1={x}
                    y1="520"
                    x2={x - 9}
                    y2="538"
                    pathLength="1"
                    className="bp-line"
                    style={at(0.95 + i * 0.008, 0.25)}
                  />
                );
              })}
            </g>

            {/* ═══════ PILOTIS (4 colonnes fines béton) ═══════ */}
            <g stroke={W_HI} strokeWidth="2.6" fill="none" strokeLinecap="square">
              {/* Colonnes : doublure pour l'épaisseur du pilotis (~6px) */}
              {[120, 240, 360, 460].map((x, i) => (
                <g key={`pi-g-${x}`}>
                  <line x1={x - 3} y1="475" x2={x - 3} y2="520" pathLength="1" className="bp-line" style={at(1.0 + i * 0.06, 0.5)} />
                  <line x1={x + 3} y1="475" x2={x + 3} y2="520" pathLength="1" className="bp-line" style={at(1.0 + i * 0.06, 0.5)} />
                </g>
              ))}
            </g>

            {/* ═══════ DALLE NIVEAU 1 ═══════ */}
            <g stroke={W_HI} strokeWidth="2.6">
              <line x1="60" y1="465" x2="500" y2="465" pathLength="1" className="bp-line" style={at(1.3, 0.8)} />
              <line x1="60" y1="475" x2="500" y2="475" pathLength="1" className="bp-line" style={at(1.32, 0.8)} />
            </g>

            {/* ═══════ NIVEAU 1 (rez-de-chaussée surélevé) ═══════ */}
            <g stroke={W_HI} strokeWidth="2.8" fill="none" strokeLinecap="square">
              {/* Murs verticaux */}
              <line x1="60" y1="370" x2="60" y2="465" pathLength="1" className="bp-line" style={at(1.4, 0.7)} />
              <line x1="500" y1="370" x2="500" y2="465" pathLength="1" className="bp-line" style={at(1.4, 0.7)} />
              {/* Plafond niveau 1 */}
              <line x1="60" y1="370" x2="500" y2="370" pathLength="1" className="bp-line" style={at(1.5, 0.8)} />
            </g>

            {/* ═══════ STRIP WINDOW NIVEAU 1 ═══════ */}
            <g stroke={W_HI} strokeWidth="2" fill="none">
              <line x1="100" y1="395" x2="460" y2="395" pathLength="1" className="bp-line" style={at(1.55, 0.7)} />
              <line x1="100" y1="430" x2="460" y2="430" pathLength="1" className="bp-line" style={at(1.55, 0.7)} />
              <line x1="100" y1="395" x2="100" y2="430" pathLength="1" className="bp-line" style={at(1.6, 0.3)} />
              <line x1="460" y1="395" x2="460" y2="430" pathLength="1" className="bp-line" style={at(1.6, 0.3)} />
            </g>
            <g stroke={W_MD} strokeWidth="1">
              {[170, 230, 290, 350, 410].map((x, i) => (
                <line key={`m1-${x}`} x1={x} y1="395" x2={x} y2="430" pathLength="1" className="bp-line" style={at(1.65 + i * 0.04, 0.3)} />
              ))}
            </g>

            {/* ═══════ ENTRÉE (PORTE ORANGE) ═══════ */}
            <g stroke={O} strokeWidth="2.8" fill="none" strokeLinecap="square">
              <path d="M 270 465 L 270 440 L 310 440 L 310 465" pathLength="1" className="bp-line" style={at(1.85, 0.5)} />
              <line x1="290" y1="440" x2="290" y2="465" pathLength="1" className="bp-line" style={at(1.95, 0.3)} />
            </g>
            <circle cx="305" cy="455" r="1.8" fill={O} pathLength="1" className="bp-line" style={at(2.0, 0.2)} />

            {/* ═══════ DALLE NIVEAU 2 (cantilever vers la DROITE) ═══════ */}
            <g stroke={W_HI} strokeWidth="2.6">
              <line x1="60" y1="360" x2="540" y2="360" pathLength="1" className="bp-line" style={at(1.95, 0.9)} />
              <line x1="60" y1="370" x2="540" y2="370" pathLength="1" className="bp-line" style={at(1.97, 0.9)} />
            </g>

            {/* ═══════ NIVEAU 2 (block cantilever) ═══════ */}
            <g stroke={W_HI} strokeWidth="2.8" fill="none" strokeLinecap="square">
              <line x1="60" y1="240" x2="60" y2="360" pathLength="1" className="bp-line" style={at(2.05, 0.7)} />
              <line x1="540" y1="240" x2="540" y2="360" pathLength="1" className="bp-line" style={at(2.05, 0.7)} />
              <line x1="60" y1="240" x2="540" y2="240" pathLength="1" className="bp-line" style={at(2.18, 0.8)} />
            </g>

            {/* ═══════ STRIP WINDOW NIVEAU 2 (plus longue) ═══════ */}
            <g stroke={W_HI} strokeWidth="2" fill="none">
              <line x1="90" y1="265" x2="510" y2="265" pathLength="1" className="bp-line" style={at(2.2, 0.7)} />
              <line x1="90" y1="320" x2="510" y2="320" pathLength="1" className="bp-line" style={at(2.2, 0.7)} />
              <line x1="90" y1="265" x2="90" y2="320" pathLength="1" className="bp-line" style={at(2.25, 0.3)} />
              <line x1="510" y1="265" x2="510" y2="320" pathLength="1" className="bp-line" style={at(2.25, 0.3)} />
            </g>
            <g stroke={W_MD} strokeWidth="1">
              {[160, 230, 300, 370, 440].map((x, i) => (
                <line key={`m2-${x}`} x1={x} y1="265" x2={x} y2="320" pathLength="1" className="bp-line" style={at(2.3 + i * 0.04, 0.3)} />
              ))}
            </g>

            {/* ═══════ FINS BÉTON VERTICALES (façade gauche) ═══════ */}
            <g stroke={W_MD} strokeWidth="1.2">
              {[68, 75, 82, 89].map((x, i) => (
                <line key={`fin-${x}`} x1={x} y1="245" x2={x} y2="355" pathLength="1" className="bp-line" style={at(2.4 + i * 0.04, 0.4)} />
              ))}
            </g>

            {/* ═══════ DALLE NIVEAU 3 (set back, plus petit) ═══════ */}
            <g stroke={W_HI} strokeWidth="2.6">
              <line x1="180" y1="230" x2="420" y2="230" pathLength="1" className="bp-line" style={at(2.4, 0.8)} />
              <line x1="180" y1="240" x2="420" y2="240" pathLength="1" className="bp-line" style={at(2.42, 0.8)} />
            </g>

            {/* ═══════ NIVEAU 3 (penthouse) ═══════ */}
            <g stroke={W_HI} strokeWidth="2.8" fill="none" strokeLinecap="square">
              <line x1="180" y1="100" x2="180" y2="230" pathLength="1" className="bp-line" style={at(2.55, 0.7)} />
              <line x1="420" y1="100" x2="420" y2="230" pathLength="1" className="bp-line" style={at(2.55, 0.7)} />
              <line x1="180" y1="100" x2="420" y2="100" pathLength="1" className="bp-line" style={at(2.68, 0.7)} />
            </g>

            {/* ═══════ STRIP WINDOW NIVEAU 3 ═══════ */}
            <g stroke={W_HI} strokeWidth="2" fill="none">
              <line x1="200" y1="125" x2="400" y2="125" pathLength="1" className="bp-line" style={at(2.72, 0.6)} />
              <line x1="200" y1="170" x2="400" y2="170" pathLength="1" className="bp-line" style={at(2.72, 0.6)} />
              <line x1="200" y1="125" x2="200" y2="170" pathLength="1" className="bp-line" style={at(2.78, 0.3)} />
              <line x1="400" y1="125" x2="400" y2="170" pathLength="1" className="bp-line" style={at(2.78, 0.3)} />
            </g>
            <g stroke={W_MD} strokeWidth="1">
              {[250, 300, 350].map((x, i) => (
                <line key={`m3-${x}`} x1={x} y1="125" x2={x} y2="170" pathLength="1" className="bp-line" style={at(2.82 + i * 0.04, 0.3)} />
              ))}
            </g>

            {/* ═══════ PARAPET TOIT (penthouse) ═══════ */}
            <g stroke={W_MD} strokeWidth="1.5">
              <line x1="180" y1="92" x2="420" y2="92" pathLength="1" className="bp-line" style={at(2.85, 0.6)} />
            </g>

            {/* ═══════ TERRASSE GAUCHE (entre niveau 2 et niveau 3) ═══════ */}
            <g stroke={W_MD} strokeWidth="1.5">
              <line x1="60" y1="222" x2="180" y2="222" pathLength="1" className="bp-line" style={at(2.55, 0.5)} />
              {[80, 105, 130, 155].map((x, i) => (
                <line key={`tp-l-${x}`} x1={x} y1="222" x2={x} y2="240" pathLength="1" className="bp-line" style={at(2.6 + i * 0.04, 0.2)} />
              ))}
            </g>

            {/* ═══════ TERRASSE DROITE (cantilever) ═══════ */}
            <g stroke={W_MD} strokeWidth="1.5">
              <line x1="420" y1="222" x2="540" y2="222" pathLength="1" className="bp-line" style={at(2.6, 0.5)} />
              {[445, 470, 495, 520].map((x, i) => (
                <line key={`tp-r-${x}`} x1={x} y1="222" x2={x} y2="240" pathLength="1" className="bp-line" style={at(2.65 + i * 0.04, 0.2)} />
              ))}
            </g>

            {/* ═══════ ESCALIER EXTÉRIEUR DROIT (zigzag) ═══════ */}
            <g stroke={W_MD} strokeWidth="1.4" fill="none">
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const y = 475 - i * 18;
                const x1 = 540;
                const x2 = 565;
                return (
                  <g key={`st-${i}`}>
                    <line x1={x1} y1={y} x2={x2} y2={y - 18} pathLength="1" className="bp-line" style={at(2.85 + i * 0.04, 0.3)} />
                    <line x1={x2} y1={y - 18} x2={x2} y2={y} pathLength="1" className="bp-line" style={at(2.88 + i * 0.04, 0.2)} />
                  </g>
                );
              })}
            </g>

            {/* ═══════ SKYLIGHTS SUR TOIT (ORANGE) ═══════ */}
            <g stroke={O} strokeWidth="2.4" fill="none" strokeLinecap="square">
              <path d="M 240 100 L 240 80 L 280 80 L 280 100" pathLength="1" className="bp-line" style={at(3.15, 0.5)} />
              <path d="M 320 100 L 320 80 L 360 80 L 360 100" pathLength="1" className="bp-line" style={at(3.2, 0.5)} />
              <line x1="240" y1="80" x2="280" y2="80" pathLength="1" className="bp-line" style={at(3.25, 0.3)} />
              <line x1="320" y1="80" x2="360" y2="80" pathLength="1" className="bp-line" style={at(3.27, 0.3)} />
            </g>

            {/* ═══════ BANDES DE COFFRAGE BÉTON (signature brutaliste) ═══════ */}
            <g stroke={W_BAND} strokeWidth="0.7">
              {/* Niveau 1 */}
              {[388, 408, 428, 448].map((y, i) => (
                <line key={`b1-${y}`} x1="60" y1={y} x2="500" y2={y} pathLength="1" className="bp-line" style={at(2.85 + i * 0.04, 0.4)} />
              ))}
              {/* Niveau 2 */}
              {[260, 285, 310, 335].map((y, i) => (
                <line key={`b2-${y}`} x1="60" y1={y} x2="540" y2={y} pathLength="1" className="bp-line" style={at(2.95 + i * 0.04, 0.4)} />
              ))}
              {/* Niveau 3 */}
              {[120, 145, 170, 195].map((y, i) => (
                <line key={`b3-${y}`} x1="180" y1={y} x2="420" y2={y} pathLength="1" className="bp-line" style={at(3.05 + i * 0.04, 0.4)} />
              ))}
            </g>

            {/* ═══════ TRAITS LATÉRAUX (BORDURE TECHNIQUE) ═══════ */}
            <g stroke={W_HI} strokeWidth="1.4">
              <line x1="20" y1="30" x2="20" y2="580" pathLength="1" className="bp-line" style={at(0.3, 1.5)} />
              <line x1="580" y1="30" x2="580" y2="580" pathLength="1" className="bp-line" style={at(0.32, 1.5)} />
            </g>
          </svg>

          {/* ── Texte EDOME (horizontal lettré, sous la villa) ── */}
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
