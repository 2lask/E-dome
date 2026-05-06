"use client";

import React from "react";

/**
 * BuildingDrawing — élévation technique d'une tour modernist/brutaliste
 * vue de face. Penthouse en setback, tour principale (5 niveaux), rez
 * vitré avec entrée. Fins béton verticales, strip windows à mullions,
 * parapets, élément de toiture, ligne de cote latérale, hachures sol,
 * grille de construction. ~120 éléments SVG.
 *
 * Statique (les traits sont dessinés en permanence, sans animation
 * pour ne pas se déclencher pendant le loading screen).
 *
 * Positionnée en absolute bottom-right du hero. Cachée < lg.
 */
export function BuildingDrawing({ className }: { className?: string }) {
  const W_HI = "rgba(255,255,255,0.88)";
  const W_MD = "rgba(255,255,255,0.55)";
  const W_LO = "rgba(255,255,255,0.25)";
  const W_FN = "rgba(255,255,255,0.08)";
  const O = "#C4956A";

  // Niveaux (5 floors typiques + penthouse + rez)
  // y range : penthouse 60-135 (75h), 5 floors 135-410 (55h chacun), rez 410-460 (50h)
  const floors = [135, 190, 245, 300, 355]; // top y de chaque floor (5)

  return (
    <svg
      viewBox="0 0 320 500"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      className={className}
      style={{ shapeRendering: "geometricPrecision" }}
    >
      {/* ── GRILLE FAIBLE ── */}
      <g stroke={W_FN} strokeWidth="0.5">
        {[80, 160, 240, 320, 400, 480].map((y) => (
          <line key={`gh-${y}`} x1="-10" y1={y} x2="330" y2={y} />
        ))}
        {[80, 160, 240].map((x) => (
          <line key={`gv-${x}`} x1={x} y1="0" x2={x} y2="500" />
        ))}
      </g>

      {/* ── CONSTRUCTION EXTENSIONS (lignes de niveau étendues) ── */}
      <g stroke={W_LO} strokeWidth="0.5">
        <line x1="0" y1="60" x2="80" y2="60" />
        <line x1="240" y1="60" x2="320" y2="60" />
        <line x1="0" y1="135" x2="80" y2="135" />
        <line x1="240" y1="135" x2="320" y2="135" />
        <line x1="0" y1="410" x2="80" y2="410" />
        <line x1="240" y1="410" x2="320" y2="410" />
        <line x1="0" y1="460" x2="320" y2="460" />
      </g>

      {/* ── LIGNE DE COTE LATÉRALE (DROITE) avec flèches ── */}
      <g stroke={W_MD} strokeWidth="0.7" fill="none">
        <line x1="290" y1="60" x2="290" y2="460" />
        <path d="M 286 60 L 290 54 L 294 60" />
        <path d="M 286 460 L 290 466 L 294 460" />
      </g>

      {/* ── LIGNE DE SOL ── */}
      <line x1="0" y1="460" x2="320" y2="460" stroke={W_HI} strokeWidth="1.6" />

      {/* ── HACHURES SOL ── */}
      <g stroke={W_MD} strokeWidth="0.6">
        {Array.from({ length: 28 }).map((_, i) => {
          const x = -5 + i * 12;
          return <line key={`gh-${i}`} x1={x} y1="460" x2={x - 7} y2="473" />;
        })}
      </g>

      {/* ═══════ PENTHOUSE (setback en haut) ═══════ */}
      <g stroke={W_HI} strokeWidth="1.6" fill="none">
        <line x1="100" y1="60" x2="100" y2="135" />
        <line x1="220" y1="60" x2="220" y2="135" />
        <line x1="100" y1="60" x2="220" y2="60" />
      </g>
      {/* Strip window penthouse */}
      <g stroke={W_HI} strokeWidth="1" fill="none">
        <rect x="110" y="78" width="100" height="38" />
      </g>
      <g stroke={W_MD} strokeWidth="0.6">
        {[140, 160, 180].map((x) => (
          <line key={`pm-${x}`} x1={x} y1="78" x2={x} y2="116" />
        ))}
      </g>
      {/* Parapet penthouse top */}
      <line x1="92" y1="56" x2="228" y2="56" stroke={W_MD} strokeWidth="0.8" />

      {/* ── ÉLÉMENT TOITURE (HVAC + antenne) ── */}
      <g stroke={W_MD} strokeWidth="0.9" fill="none">
        <rect x="135" y="40" width="22" height="16" />
      </g>
      <g stroke={W_HI} strokeWidth="1">
        <line x1="180" y1="56" x2="180" y2="20" />
        <line x1="175" y1="20" x2="185" y2="20" />
      </g>

      {/* ═══════ TOUR PRINCIPALE (5 floors) ═══════ */}
      {/* Murs latéraux principal */}
      <g stroke={W_HI} strokeWidth="1.8" fill="none">
        <line x1="80" y1="135" x2="80" y2="410" />
        <line x1="240" y1="135" x2="240" y2="410" />
      </g>

      {/* Slabs (dalles) entre étages */}
      <g stroke={W_HI} strokeWidth="1.2">
        {floors.map((y) => (
          <line key={`sl-${y}`} x1="80" y1={y} x2="240" y2={y} />
        ))}
        <line x1="80" y1="410" x2="240" y2="410" />
      </g>

      {/* Strip windows par étage avec mullions */}
      {floors.map((floorTop, idx) => (
        <g key={`f-${idx}`}>
          <g stroke={W_HI} strokeWidth="1" fill="none">
            <rect x="92" y={floorTop + 12} width="136" height="32" />
          </g>
          <g stroke={W_MD} strokeWidth="0.6">
            {[120, 148, 176, 204].map((x) => (
              <line key={`m-${idx}-${x}`} x1={x} y1={floorTop + 12} x2={x} y2={floorTop + 44} />
            ))}
          </g>
          {/* Allège béton (sous-fenêtre) */}
          <line
            x1="80"
            y1={floorTop + 48}
            x2="240"
            y2={floorTop + 48}
            stroke={W_MD}
            strokeWidth="0.5"
          />
        </g>
      ))}

      {/* ── FINS BÉTON VERTICALES (sur la façade entière de la tour) ── */}
      <g stroke={W_MD} strokeWidth="0.7">
        {[88, 95].map((x) => (
          <line key={`finL-${x}`} x1={x} y1="135" x2={x} y2="410" />
        ))}
        {[225, 232].map((x) => (
          <line key={`finR-${x}`} x1={x} y1="135" x2={x} y2="410" />
        ))}
      </g>

      {/* ═══════ REZ-DE-CHAUSSÉE (lobby vitré) ═══════ */}
      <g stroke={W_HI} strokeWidth="1.8" fill="none">
        <line x1="80" y1="410" x2="80" y2="460" />
        <line x1="240" y1="410" x2="240" y2="460" />
      </g>

      {/* Vitres lobby (4 panneaux) */}
      <g stroke={W_MD} strokeWidth="0.8">
        {[112, 144, 176, 208].map((x) => (
          <line key={`v-${x}`} x1={x} y1="410" x2={x} y2="460" />
        ))}
      </g>

      {/* ── ENTRÉE PRINCIPALE (ORANGE) ── */}
      <g stroke={O} strokeWidth="1.8" fill="none" strokeLinecap="square">
        <path d="M 145 460 L 145 420 L 175 420 L 175 460" />
        <line x1="160" y1="420" x2="160" y2="460" />
      </g>
      <circle cx="170" cy="442" r="1.4" fill={O} />

      {/* Auvent au-dessus de l'entrée */}
      <line x1="135" y1="420" x2="185" y2="420" stroke={W_HI} strokeWidth="1" />
      <line x1="130" y1="416" x2="190" y2="416" stroke={W_MD} strokeWidth="0.7" />

      {/* ── PARVIS / PLAZA (deux niveaux d'esplanade) ── */}
      <g stroke={W_MD} strokeWidth="0.6">
        <line x1="40" y1="468" x2="80" y2="468" />
        <line x1="240" y1="468" x2="280" y2="468" />
        <line x1="20" y1="478" x2="80" y2="478" />
        <line x1="240" y1="478" x2="300" y2="478" />
      </g>

      {/* ── DEUX TRAITS LATÉRAUX ── */}
      <g stroke={W_HI} strokeWidth="0.9">
        <line x1="10" y1="20" x2="10" y2="490" />
        <line x1="310" y1="20" x2="310" y2="490" />
      </g>

      {/* ── INDEX DE NIVEAUX (small hash marks à gauche) ── */}
      <g stroke={W_HI} strokeWidth="1.2">
        <line x1="14" y1="60" x2="22" y2="60" />
        <line x1="14" y1="135" x2="22" y2="135" />
        {floors.map((y) => (
          <line key={`tk-${y}`} x1="14" y1={y} x2="22" y2={y} />
        ))}
        <line x1="14" y1="410" x2="22" y2="410" />
      </g>

      {/* ── ACCENT ORANGE : barre verticale au sommet (signal) ── */}
      <line x1="180" y1="20" x2="180" y2="40" stroke={O} strokeWidth="1.6" />
    </svg>
  );
}

export default BuildingDrawing;
