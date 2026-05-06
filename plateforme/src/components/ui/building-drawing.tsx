"use client";

import React from "react";

/**
 * BuildingDrawing — élévation d'une VILLA de luxe moderne avec son
 * environnement : piscine à gauche, pergola, transats, escalier
 * d'accès, terrasse avec garde-corps, deux arbres à droite, lignes
 * de construction étendues à gauche. ViewBox 1200×600.
 *
 * Tous les traits en gold #C4956A (hiérarchie d'opacités). Quelques
 * accents pleins en orange saturé (porte d'entrée, signal sommet,
 * parasol). ~200 éléments SVG.
 */
export function BuildingDrawing({ className }: { className?: string }) {
  const G_HI = "rgba(196, 149, 106, 0.95)"; // contours principaux
  const G_MD = "rgba(196, 149, 106, 0.65)"; // mullions, fins, parapets
  const G_LO = "rgba(196, 149, 106, 0.32)"; // construction, axes
  const G_FN = "rgba(196, 149, 106, 0.10)"; // grille
  const O = "#C4956A"; // accent saturé

  return (
    <svg
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYEnd meet"
      aria-hidden="true"
      className={className}
      style={{ overflow: "visible", shapeRendering: "geometricPrecision" }}
    >
      {/* ═══════ GRILLE FAIBLE ═══════ */}
      <g stroke={G_FN} strokeWidth="0.5">
        {[80, 160, 240, 320, 400, 480, 560].map((y) => (
          <line key={`gh-${y}`} x1="-300" y1={y} x2="1200" y2={y} />
        ))}
      </g>

      {/* ═══════ CONSTRUCTION LINES (étendues très à gauche) ═══════ */}
      <g stroke={G_LO} strokeWidth="0.7">
        <line x1="-320" y1="100" x2="540" y2="100" />
        <line x1="-320" y1="160" x2="540" y2="160" />
        <line x1="-320" y1="280" x2="540" y2="280" />
        <line x1="-320" y1="380" x2="540" y2="380" />
        <line x1="-320" y1="460" x2="1200" y2="460" />
        <line x1="-320" y1="540" x2="1200" y2="540" />
      </g>

      {/* ═══════ HACHURES DU SOL (étendues à gauche) ═══════ */}
      <g stroke={G_MD} strokeWidth="0.6">
        {Array.from({ length: 90 }).map((_, i) => {
          const x = -300 + i * 17;
          return <line key={`gh-${i}`} x1={x} y1="540" x2={x - 11} y2="558" />;
        })}
      </g>

      {/* ═══════ LIGNE DE COTE GAUCHE étendue avec flèches ═══════ */}
      <g stroke={G_MD} strokeWidth="0.8" fill="none">
        <line x1="-260" y1="100" x2="-260" y2="540" />
        <path d="M -266 106 L -260 90 L -254 106" />
        <path d="M -266 534 L -260 550 L -254 534" />
      </g>
      <g stroke={G_MD} strokeWidth="1">
        {[100, 160, 280, 380, 460, 540].map((y) => (
          <line key={`ck-${y}`} x1="-265" y1={y} x2="-255" y2={y} />
        ))}
      </g>

      {/* ═══════════ PISCINE (gauche) ═══════════ */}
      {/* Pool deck (bordure) */}
      <g stroke={G_HI} strokeWidth="1.5" fill="none">
        <path d="M 60 460 L 380 460 L 380 535 L 60 535 Z" />
      </g>
      {/* Pool basin (eau) */}
      <g stroke={G_HI} strokeWidth="1.5" fill="none">
        <path d="M 80 470 L 360 470 L 360 525 L 80 525 Z" />
      </g>
      {/* Ripples sur l'eau */}
      <g stroke={G_MD} strokeWidth="0.7">
        {[483, 493, 503, 513].map((y) => (
          <line key={`rp-${y}`} x1="95" y1={y} x2="345" y2={y} strokeDasharray="6 4" />
        ))}
      </g>
      {/* Ladder à droite de la piscine */}
      <g stroke={G_HI} strokeWidth="1.4">
        <line x1="345" y1="460" x2="345" y2="490" />
        <line x1="355" y1="460" x2="355" y2="490" />
        <line x1="345" y1="468" x2="355" y2="468" />
        <line x1="345" y1="476" x2="355" y2="476" />
        <line x1="345" y1="484" x2="355" y2="484" />
      </g>
      {/* Indicateur de profondeur */}
      <g stroke={G_MD} strokeWidth="0.6">
        <line x1="100" y1="465" x2="100" y2="468" />
        <line x1="100" y1="525" x2="100" y2="528" />
      </g>

      {/* ═══════════ PERGOLA AU-DESSUS DU PARVIS ═══════════ */}
      <g stroke={G_HI} strokeWidth="1.6" fill="none">
        {/* Posts (4) */}
        <line x1="90" y1="460" x2="90" y2="380" />
        <line x1="180" y1="460" x2="180" y2="380" />
        <line x1="280" y1="460" x2="280" y2="380" />
        <line x1="370" y1="460" x2="370" y2="380" />
        {/* Top beams horizontaux */}
        <line x1="80" y1="380" x2="380" y2="380" />
        <line x1="80" y1="376" x2="380" y2="376" />
      </g>
      {/* Slats du toit pergola */}
      <g stroke={G_MD} strokeWidth="0.6">
        {[368, 372].map((y) => (
          <line key={`sl-${y}`} x1="85" y1={y} x2="375" y2={y} />
        ))}
        {/* Slats transverses (lattes) */}
        {Array.from({ length: 22 }).map((_, i) => {
          const x = 88 + i * 13;
          return <line key={`pl-${i}`} x1={x} y1="376" x2={x} y2="382" />;
        })}
      </g>

      {/* ═══════════ TRANSATS ═══════════ */}
      {/* Lounger 1 */}
      <g stroke={G_HI} strokeWidth="1.3" fill="none">
        <path d="M 410 458 L 410 444 L 460 444 L 460 458" />
        <line x1="408" y1="458" x2="462" y2="458" />
        <line x1="412" y1="458" x2="412" y2="465" />
        <line x1="458" y1="458" x2="458" y2="465" />
        {/* Headrest oblique */}
        <line x1="450" y1="444" x2="465" y2="430" />
      </g>
      {/* Lounger 2 */}
      <g stroke={G_HI} strokeWidth="1.3" fill="none">
        <path d="M 478 458 L 478 444 L 528 444 L 528 458" />
        <line x1="476" y1="458" x2="530" y2="458" />
        <line x1="480" y1="458" x2="480" y2="465" />
        <line x1="526" y1="458" x2="526" y2="465" />
        <line x1="518" y1="444" x2="533" y2="430" />
      </g>

      {/* ═══════════ PARASOL (orange) ═══════════ */}
      <g stroke={O} strokeWidth="1.5" fill="none">
        {/* Mât */}
        <line x1="490" y1="460" x2="490" y2="395" />
        {/* Toile triangulaire */}
        <path d="M 460 410 L 490 395 L 520 410 Z" />
        {/* Pli central */}
        <line x1="475" y1="402" x2="490" y2="395" />
        <line x1="505" y1="402" x2="490" y2="395" />
      </g>

      {/* ═══════════ ESCALIER vers la villa ═══════════ */}
      <g stroke={G_HI} strokeWidth="1.4" fill="none">
        {[0, 1, 2, 3, 4].map((i) => {
          const x = 540 + i * 8;
          const y = 460 - i * 4;
          return (
            <g key={`st-${i}`}>
              <line x1={x} y1={y} x2={x + 8} y2={y} />
              <line x1={x + 8} y1={y} x2={x + 8} y2={y - 4} />
            </g>
          );
        })}
      </g>

      {/* ═══════════ VILLA — REZ-DE-CHAUSSÉE (vitré) ═══════════ */}
      <g stroke={G_HI} strokeWidth="2.4" fill="none" strokeLinecap="square">
        {/* Murs latéraux ground */}
        <line x1="580" y1="280" x2="580" y2="460" />
        <line x1="900" y1="280" x2="900" y2="460" />
        {/* Plancher */}
        <line x1="580" y1="460" x2="900" y2="460" />
      </g>
      {/* Mullions ground (grandes baies vitrées) */}
      <g stroke={G_MD} strokeWidth="0.9">
        {[640, 700, 760, 820, 870].map((x) => (
          <line key={`gv-${x}`} x1={x} y1="280" x2={x} y2="460" />
        ))}
      </g>
      {/* Lignes horizontales sur les baies (montants intermédiaires) */}
      <g stroke={G_MD} strokeWidth="0.6">
        <line x1="580" y1="370" x2="900" y2="370" />
      </g>

      {/* Porte d'entrée principale (orange saturé) */}
      <g stroke={O} strokeWidth="2.4" fill="none" strokeLinecap="square">
        <path d="M 705 460 L 705 400 L 755 400 L 755 460" />
        <line x1="730" y1="400" x2="730" y2="460" />
      </g>
      <circle cx="748" cy="430" r="2" fill={O} />
      {/* Pas de porte (entry slab) */}
      <line x1="690" y1="464" x2="770" y2="464" stroke={G_HI} strokeWidth="1.3" />

      {/* ═══════════ VILLA — ÉTAGE (cantilever) ═══════════ */}
      <g stroke={G_HI} strokeWidth="2.4" fill="none" strokeLinecap="square">
        {/* Cantilever élargi vers la gauche */}
        <line x1="540" y1="160" x2="540" y2="280" />
        <line x1="940" y1="160" x2="940" y2="280" />
        {/* Plafond / dalle haute */}
        <line x1="540" y1="160" x2="940" y2="160" />
        {/* Plancher étage = dalle au-dessus du rez */}
        <line x1="540" y1="280" x2="940" y2="280" />
      </g>

      {/* Strip window upper avec mullions */}
      <g stroke={G_HI} strokeWidth="1.3" fill="none">
        <rect x="560" y="190" width="360" height="70" />
      </g>
      <g stroke={G_MD} strokeWidth="0.8">
        {[610, 660, 710, 760, 810, 860].map((x) => (
          <line key={`um-${x}`} x1={x} y1="190" x2={x} y2="260" />
        ))}
        <line x1="560" y1="225" x2="920" y2="225" />
      </g>
      {/* Allège béton sous strip window */}
      <line x1="540" y1="270" x2="940" y2="270" stroke={G_MD} strokeWidth="0.7" />

      {/* Garde-corps verre du balcon cantilever (gauche) */}
      <g stroke={G_MD} strokeWidth="0.9">
        <line x1="540" y1="270" x2="540" y2="280" />
        {[510, 520, 530].map((x) => (
          <line key={`gl-${x}`} x1={x} y1="272" x2={x} y2="280" />
        ))}
        {/* Garde-corps droite (extension cantilever) */}
        {[945, 955, 965].map((x) => (
          <line key={`gr-${x}`} x1={x} y1="272" x2={x} y2="280" />
        ))}
      </g>

      {/* ═══════════ TOITURE & PARAPET ═══════════ */}
      <g stroke={G_HI} strokeWidth="1.6">
        <line x1="540" y1="140" x2="940" y2="140" />
        <line x1="540" y1="148" x2="940" y2="148" />
      </g>

      {/* HVAC unit sur le toit */}
      <g stroke={G_MD} strokeWidth="1" fill="none">
        <rect x="650" y="110" width="40" height="30" />
        {/* Slats */}
        <line x1="654" y1="118" x2="686" y2="118" />
        <line x1="654" y1="126" x2="686" y2="126" />
        <line x1="654" y1="134" x2="686" y2="134" />
      </g>

      {/* Skylight rectangulaire */}
      <g stroke={G_HI} strokeWidth="1.2" fill="none">
        <rect x="730" y="116" width="60" height="24" />
        <line x1="760" y1="116" x2="760" y2="140" />
      </g>

      {/* Mât / antenne avec accent orange */}
      <g stroke={G_HI} strokeWidth="1.3">
        <line x1="820" y1="140" x2="820" y2="80" />
      </g>
      <line x1="820" y1="80" x2="820" y2="100" stroke={O} strokeWidth="2.2" />

      {/* ═══════════ ARBRES (à droite) ═══════════ */}
      {/* Tree 1 — grand */}
      <g stroke={G_HI} strokeWidth="1.4" fill="none">
        <line x1="960" y1="460" x2="960" y2="370" />
        {/* Branches (chevrons) */}
        <line x1="960" y1="400" x2="945" y2="385" />
        <line x1="960" y1="400" x2="975" y2="385" />
        <line x1="960" y1="380" x2="945" y2="370" />
        <line x1="960" y1="380" x2="975" y2="370" />
      </g>
      {/* Canopée */}
      <g stroke={G_MD} strokeWidth="0.8" fill="none">
        <circle cx="960" cy="350" r="32" />
        <circle cx="945" cy="335" r="20" />
        <circle cx="980" cy="338" r="22" />
      </g>

      {/* Tree 2 — petit */}
      <g stroke={G_HI} strokeWidth="1.3" fill="none">
        <line x1="1040" y1="460" x2="1040" y2="395" />
        <line x1="1040" y1="420" x2="1028" y2="408" />
        <line x1="1040" y1="420" x2="1052" y2="408" />
      </g>
      <g stroke={G_MD} strokeWidth="0.8" fill="none">
        <circle cx="1040" cy="380" r="22" />
        <circle cx="1028" cy="370" r="14" />
        <circle cx="1054" cy="372" r="15" />
      </g>

      {/* Tree 3 — touffe basse (buisson) */}
      <g stroke={G_MD} strokeWidth="0.8" fill="none">
        <circle cx="1100" cy="448" r="14" />
        <circle cx="1115" cy="450" r="11" />
        <circle cx="1085" cy="450" r="12" />
      </g>

      {/* ═══════════ PETITS DÉTAILS ═══════════ */}
      {/* Outdoor lights le long du parvis */}
      <g stroke={G_MD} strokeWidth="0.9" fill={G_MD}>
        <circle cx="50" cy="455" r="1.5" />
        <circle cx="540" cy="455" r="1.5" />
        <circle cx="930" cy="455" r="1.5" />
        <circle cx="1090" cy="455" r="1.5" />
      </g>
      {/* Pavés du chemin (devant la villa) */}
      <g stroke={G_MD} strokeWidth="0.5">
        <line x1="690" y1="476" x2="690" y2="488" />
        <line x1="715" y1="476" x2="715" y2="488" />
        <line x1="740" y1="476" x2="740" y2="488" />
        <line x1="765" y1="476" x2="765" y2="488" />
      </g>

      {/* Petite clôture / muret sur le côté droit */}
      <g stroke={G_MD} strokeWidth="0.8">
        <line x1="900" y1="460" x2="900" y2="480" />
        <line x1="1100" y1="460" x2="1100" y2="480" />
        <line x1="900" y1="480" x2="1100" y2="480" />
        {/* Barreaux */}
        {[940, 980, 1020, 1060].map((x) => (
          <line key={`rl-${x}`} x1={x} y1="465" x2={x} y2="480" />
        ))}
      </g>

      {/* Banc côté piscine */}
      <g stroke={G_MD} strokeWidth="1" fill="none">
        <path d="M 200 460 L 200 450 L 260 450 L 260 460" />
        <line x1="205" y1="460" x2="205" y2="468" />
        <line x1="255" y1="460" x2="255" y2="468" />
      </g>

      {/* Ripples extras (texture eau) */}
      <g stroke={G_LO} strokeWidth="0.5">
        {[488, 498, 508, 518].map((y, i) => (
          <line
            key={`rp2-${y}`}
            x1={130 + i * 30}
            y1={y}
            x2={170 + i * 30}
            y2={y}
            strokeDasharray="3 2"
          />
        ))}
      </g>

      {/* Diagonales construction depuis villa (corner-out) */}
      <g stroke={G_LO} strokeWidth="0.6">
        <line x1="540" y1="160" x2="-100" y2="600" />
        <line x1="940" y1="160" x2="1200" y2="380" />
      </g>

      {/* Top construction extension (étage haut) */}
      <line
        x1="-300"
        y1="80"
        x2="1200"
        y2="80"
        stroke={G_LO}
        strokeWidth="0.5"
      />
    </svg>
  );
}

export default BuildingDrawing;
