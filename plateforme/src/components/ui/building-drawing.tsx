"use client";

import React from "react";

/**
 * BuildingDrawing — élévation technique XL d'une tour modernist/brutaliste
 * (penthouse setback, 5 niveaux, lobby vitré). Tous les traits en gold
 * #C4956A avec différentes opacités. Longues lignes de construction qui
 * partent du bâtiment et dépassent largement à gauche grâce à des
 * coordonnées négatives + `overflow: visible`.
 *
 * ViewBox : 900×600. Le bâtiment est ancré à x=590..850, le reste de
 * la largeur est dédié aux extensions de cote/niveau qui s'étendent
 * jusqu'à x=-300 (visuellement très loin sur la gauche).
 */
export function BuildingDrawing({ className }: { className?: string }) {
  // Toutes les lignes en gold #C4956A avec hiérarchie d'opacité
  const G_HI = "rgba(196, 149, 106, 0.95)";   // contours principaux
  const G_MD = "rgba(196, 149, 106, 0.65)";   // mullions, fins, parapets
  const G_LO = "rgba(196, 149, 106, 0.32)";   // construction, axes
  const G_FN = "rgba(196, 149, 106, 0.10)";   // grille
  const O = "#C4956A";                         // accent saturé

  // Tour : 5 niveaux entre y=160 et y=510 (350 tall, 70 par étage)
  const floorTops = [160, 230, 300, 370, 440];

  return (
    <svg
      viewBox="0 0 900 600"
      preserveAspectRatio="xMidYEnd meet"
      aria-hidden="true"
      className={className}
      style={{ overflow: "visible", shapeRendering: "geometricPrecision" }}
    >
      {/* ═══════ GRILLE FAIBLE (étendue à gauche) ═══════ */}
      <g stroke={G_FN} strokeWidth="0.5">
        {[80, 160, 240, 320, 400, 480, 560].map((y) => (
          <line key={`gh-${y}`} x1="-300" y1={y} x2="900" y2={y} />
        ))}
      </g>

      {/* ═══════ LIGNES DE CONSTRUCTION (étendent largement à gauche) ═══════ */}
      <g stroke={G_LO} strokeWidth="0.8">
        {/* Penthouse top */}
        <line x1="-320" y1="80" x2="640" y2="80" />
        {/* Tower top (penthouse base) */}
        <line x1="-320" y1="160" x2="590" y2="160" />
        {/* Slabs (5 niveaux) */}
        {floorTops.map((y) => (
          <line key={`fs-${y}`} x1="-320" y1={y} x2="590" y2={y} />
        ))}
        {/* Lobby top */}
        <line x1="-320" y1="510" x2="590" y2="510" />
        {/* Ground (sol) — étend des deux côtés */}
        <line x1="-320" y1="560" x2="900" y2="560" />
        {/* Mullion levels (fenêtre supérieure et inférieure de chaque strip) */}
        <line x1="-320" y1="190" x2="590" y2="190" />
        <line x1="-320" y1="260" x2="590" y2="260" />
        <line x1="-320" y1="330" x2="590" y2="330" />
        <line x1="-320" y1="400" x2="590" y2="400" />
        <line x1="-320" y1="470" x2="590" y2="470" />
      </g>

      {/* ═══════ HACHURES SOL (étendent loin à gauche) ═══════ */}
      <g stroke={G_MD} strokeWidth="0.7">
        {Array.from({ length: 75 }).map((_, i) => {
          const x = -300 + i * 16;
          return <line key={`gh-${i}`} x1={x} y1="560" x2={x - 11} y2="578" />;
        })}
      </g>

      {/* ═══════ DIAGONALES DE CONSTRUCTION (corner-out) ═══════ */}
      <g stroke={G_LO} strokeWidth="0.6">
        <line x1="590" y1="160" x2="-200" y2="600" />
        <line x1="590" y1="510" x2="100" y2="610" />
        <line x1="850" y1="160" x2="900" y2="100" />
      </g>

      {/* ═══════ PENTHOUSE (setback) ═══════ */}
      <g stroke={G_HI} strokeWidth="2.2" fill="none">
        <line x1="640" y1="80" x2="640" y2="160" />
        <line x1="800" y1="80" x2="800" y2="160" />
        <line x1="640" y1="80" x2="800" y2="80" />
      </g>
      {/* Strip window penthouse + mullions */}
      <g stroke={G_HI} strokeWidth="1.4" fill="none">
        <rect x="650" y="100" width="140" height="50" />
      </g>
      <g stroke={G_MD} strokeWidth="0.8">
        {[680, 705, 730, 760].map((x) => (
          <line key={`pm-${x}`} x1={x} y1="100" x2={x} y2="150" />
        ))}
      </g>
      {/* Penthouse parapet */}
      <line x1="630" y1="74" x2="810" y2="74" stroke={G_MD} strokeWidth="1.1" />

      {/* ═══════ TOITURE : HVAC + ANTENNE ═══════ */}
      <g stroke={G_MD} strokeWidth="1.1" fill="none">
        <rect x="690" y="48" width="32" height="26" />
      </g>
      <g stroke={G_HI} strokeWidth="1.5">
        <line x1="740" y1="74" x2="740" y2="20" />
        <line x1="734" y1="20" x2="746" y2="20" />
      </g>
      {/* Accent ambre au sommet (signal saturé) */}
      <line x1="740" y1="20" x2="740" y2="40" stroke={O} strokeWidth="2.6" />

      {/* ═══════ TOUR PRINCIPALE (5 floors) ═══════ */}
      <g stroke={G_HI} strokeWidth="2.6" fill="none" strokeLinecap="square">
        <line x1="590" y1="160" x2="590" y2="510" />
        <line x1="850" y1="160" x2="850" y2="510" />
      </g>
      {/* Slabs entre étages */}
      <g stroke={G_HI} strokeWidth="1.6">
        {floorTops.map((y) => (
          <line key={`sl-${y}`} x1="590" y1={y} x2="850" y2={y} />
        ))}
        <line x1="590" y1="510" x2="850" y2="510" />
      </g>
      {/* Strip windows + mullions par étage */}
      {floorTops.map((y, idx) => (
        <g key={`fl-${idx}`}>
          <g stroke={G_HI} strokeWidth="1.3" fill="none">
            <rect x="608" y={y + 14} width="224" height="42" />
          </g>
          <g stroke={G_MD} strokeWidth="0.8">
            {[640, 680, 720, 760, 800].map((x) => (
              <line key={`mm-${idx}-${x}`} x1={x} y1={y + 14} x2={x} y2={y + 56} />
            ))}
          </g>
          {/* Allège sous fenêtre */}
          <line
            x1="590"
            y1={y + 60}
            x2="850"
            y2={y + 60}
            stroke={G_MD}
            strokeWidth="0.7"
          />
        </g>
      ))}

      {/* ═══════ FINS BÉTON VERTICALES (sur les côtés) ═══════ */}
      <g stroke={G_MD} strokeWidth="0.9">
        {[598, 605].map((x) => (
          <line key={`finL-${x}`} x1={x} y1="160" x2={x} y2="510" />
        ))}
        {[835, 842].map((x) => (
          <line key={`finR-${x}`} x1={x} y1="160" x2={x} y2="510" />
        ))}
      </g>

      {/* ═══════ LOBBY VITRÉ (rez-de-chaussée) ═══════ */}
      <g stroke={G_HI} strokeWidth="2.6" fill="none">
        <line x1="590" y1="510" x2="590" y2="560" />
        <line x1="850" y1="510" x2="850" y2="560" />
      </g>
      {/* Vitres lobby */}
      <g stroke={G_MD} strokeWidth="1">
        {[640, 690, 740, 790].map((x) => (
          <line key={`v-${x}`} x1={x} y1="510" x2={x} y2="560" />
        ))}
      </g>

      {/* ═══════ ENTRÉE PRINCIPALE (orange saturé) ═══════ */}
      <g stroke={O} strokeWidth="2.6" fill="none" strokeLinecap="square">
        <path d="M 700 560 L 700 524 L 740 524 L 740 560" />
        <line x1="720" y1="524" x2="720" y2="560" />
      </g>
      <circle cx="734" cy="544" r="2.2" fill={O} />
      {/* Auvent au-dessus */}
      <line x1="685" y1="524" x2="755" y2="524" stroke={G_HI} strokeWidth="1.5" />
      <line x1="680" y1="520" x2="760" y2="520" stroke={G_MD} strokeWidth="0.9" />

      {/* ═══════ PARVIS / ESPLANADE (étend largement à gauche) ═══════ */}
      <g stroke={G_MD} strokeWidth="0.8">
        <line x1="-150" y1="568" x2="590" y2="568" />
        <line x1="-150" y1="578" x2="590" y2="578" />
      </g>
      {/* Marches de parvis */}
      <g stroke={G_MD} strokeWidth="0.7">
        <line x1="500" y1="560" x2="500" y2="568" />
        <line x1="450" y1="560" x2="450" y2="568" />
        <line x1="400" y1="560" x2="400" y2="568" />
        <line x1="350" y1="568" x2="350" y2="578" />
        <line x1="280" y1="568" x2="280" y2="578" />
      </g>

      {/* ═══════ LIGNE DE COTE GAUCHE étendue avec flèches ═══════ */}
      <g stroke={G_MD} strokeWidth="0.9" fill="none">
        <line x1="-260" y1="80" x2="-260" y2="560" />
        <path d="M -266 86 L -260 70 L -254 86" />
        <path d="M -266 554 L -260 570 L -254 554" />
      </g>
      {/* Tick marks de niveau sur la cote */}
      <g stroke={G_MD} strokeWidth="1.1">
        {[80, 160, 230, 300, 370, 440, 510, 560].map((y) => (
          <line key={`ck-${y}`} x1="-265" y1={y} x2="-255" y2={y} />
        ))}
      </g>

      {/* ═══════ TICKS RULER en HAUT (sur la ligne penthouse) ═══════ */}
      <g stroke={G_MD} strokeWidth="0.8">
        {Array.from({ length: 12 }).map((_, i) => {
          const x = -200 + i * 60;
          return <line key={`tt-${i}`} x1={x} y1="76" x2={x} y2={i % 2 === 0 ? 84 : 80} />;
        })}
      </g>
    </svg>
  );
}

export default BuildingDrawing;
