"use client";

import React, { useEffect, useRef } from "react";

/**
 * HeroSideStrip — bande verticale sur le bord droit du hero représentant
 * une élévation de bâtiment (façade : 7 étages + rez vitré + porte
 * orange + parapet + antenne + hachures sol). Côté gauche, des traits
 * horizontaux débordent à différentes longueurs et grosseurs (cotes de
 * niveau techniques).
 *
 * Au scroll, chaque élément se déforme indépendamment :
 *   - skewY global du SVG
 *   - étages (groupes) translateY différenciés
 *   - lignes de cote translateX shift
 *   - dots opacity + translateY
 */
export function HeroSideStrip() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let raf = 0;

    const update = () => {
      const el = ref.current;
      if (!el) return;
      const scrolled = window.scrollY;
      const vh = window.innerHeight;
      const progress = Math.min(1, scrolled / (vh * 1.8));

      // Skew global subtil sur tout le SVG
      el.style.transform = `skewY(${progress * -2.5}deg)`;

      // Étages : translateY alterné
      const floors = el.querySelectorAll<SVGElement>("[data-floor]");
      floors.forEach((f, i) => {
        const ty = (i % 2 === 0 ? -1 : 1) * progress * 35;
        f.style.transform = `translateY(${ty}px)`;
      });

      // Lignes de cote : translateX alternant gauche/droite
      const ticks = el.querySelectorAll<SVGElement>("[data-htick]");
      ticks.forEach((t, i) => {
        const tx = ((i % 3) - 1) * progress * 22;
        t.style.transform = `translateX(${tx}px)`;
      });

      // Dots : translateY + opacity
      const dots = el.querySelectorAll<SVGElement>("[data-dot]");
      dots.forEach((d, i) => {
        const ty = (i % 2 === 0 ? 1 : -1) * progress * 60;
        d.style.transform = `translateY(${ty}px)`;
        d.style.opacity = String(1 - progress * 0.6);
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Couleurs gold
  const GHI = "rgba(196,149,106,0.85)";
  const GMD = "rgba(196,149,106,0.55)";
  const GLO = "rgba(196,149,106,0.30)";
  const O = "#C4956A";

  // 7 étages typiques (top y de chaque) + rez/lobby
  const typicalFloors = [50, 130, 210, 290, 370, 450, 530];
  // Rez/lobby : y=610-720
  // Ground line : y=720

  // Lignes de cote qui dépassent à gauche (longueurs et strokes variées)
  const levelMarkers = [
    { y: 30, len: 200, stroke: 1.5, color: GHI }, // toit (très long)
    { y: 50, len: 60, stroke: 0.7, color: GMD },
    { y: 130, len: 25, stroke: 0.5, color: GLO },
    { y: 170, len: 110, stroke: 1.0, color: GHI }, // mid-floor
    { y: 210, len: 30, stroke: 0.6, color: GMD },
    { y: 250, len: 75, stroke: 0.9, color: GMD },
    { y: 290, len: 18, stroke: 0.5, color: GLO },
    { y: 330, len: 160, stroke: 1.3, color: GHI }, // emphase
    { y: 370, len: 22, stroke: 0.5, color: GLO },
    { y: 410, len: 90, stroke: 0.9, color: GMD },
    { y: 450, len: 35, stroke: 0.6, color: GMD },
    { y: 490, len: 130, stroke: 1.1, color: GHI },
    { y: 530, len: 28, stroke: 0.6, color: GLO },
    { y: 570, len: 68, stroke: 0.8, color: GMD },
    { y: 610, len: 175, stroke: 1.4, color: GHI }, // dalle lobby
    { y: 670, len: 50, stroke: 0.7, color: GMD },
    { y: 720, len: 220, stroke: 1.5, color: GHI }, // sol (le plus long)
  ];

  return (
    <svg
      ref={ref}
      viewBox="0 0 90 800"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="absolute right-0 top-0 h-screen w-[80px] xl:w-[100px] pointer-events-none"
      style={{
        overflow: "visible",
        transition: "transform 200ms ease-out",
        transformOrigin: "center center",
      }}
    >
      {/* ════════ LIGNES DE COTE QUI DÉBORDENT À GAUCHE ════════ */}
      {levelMarkers.map((m, i) => (
        <g
          key={`lm-${i}`}
          data-htick={i}
          style={{ transition: "transform 200ms ease-out", transformOrigin: "50% 50%" }}
        >
          <line
            x1={20 - m.len}
            y1={m.y}
            x2={20}
            y2={m.y}
            stroke={m.color}
            strokeWidth={m.stroke}
          />
          {/* Tick vertical à l'extrémité gauche pour les lignes longues */}
          {m.len > 90 && (
            <line
              x1={20 - m.len}
              y1={m.y - 3}
              x2={20 - m.len}
              y2={m.y + 3}
              stroke={m.color}
              strokeWidth={m.stroke * 0.7}
            />
          )}
        </g>
      ))}

      {/* ════════ BÂTIMENT — façade ════════ */}

      {/* Antenne au sommet */}
      <g data-floor="0">
        <line x1="49" y1="30" x2="49" y2="10" stroke={GMD} strokeWidth="0.8" />
        <circle cx="49" cy="8" r="1.4" fill={O} data-dot="0" />
      </g>

      {/* Parapet du toit */}
      <g data-floor="1">
        <line x1="14" y1="28" x2="80" y2="28" stroke={GHI} strokeWidth="1.1" />
        <line x1="14" y1="32" x2="80" y2="32" stroke={GMD} strokeWidth="0.5" />
      </g>

      {/* Murs latéraux (toute la hauteur du bâtiment) */}
      <line x1="20" y1="32" x2="20" y2="720" stroke={GHI} strokeWidth="1" />
      <line x1="78" y1="32" x2="78" y2="720" stroke={GHI} strokeWidth="1.3" />

      {/* 7 étages typiques — chacun avec slab + strip window + 3 mullions */}
      {typicalFloors.map((y, idx) => (
        <g key={`fl-${idx}`} data-floor={`f${idx}`}>
          {/* Slab du dessus */}
          <line x1="20" y1={y} x2="78" y2={y} stroke={GMD} strokeWidth="0.6" />
          {/* Strip window */}
          <rect
            x="26"
            y={y + 18}
            width="46"
            height="32"
            fill="none"
            stroke={GHI}
            strokeWidth="0.7"
          />
          {/* Mullions */}
          <line x1="38" y1={y + 18} x2="38" y2={y + 50} stroke={GMD} strokeWidth="0.4" />
          <line x1="50" y1={y + 18} x2="50" y2={y + 50} stroke={GMD} strokeWidth="0.4" />
          <line x1="62" y1={y + 18} x2="62" y2={y + 50} stroke={GMD} strokeWidth="0.4" />
          {/* Allège béton */}
          <line x1="20" y1={y + 56} x2="78" y2={y + 56} stroke={GLO} strokeWidth="0.4" />
        </g>
      ))}

      {/* Rez-de-chaussée / Lobby (vitré, plus haut) */}
      <g data-floor="lobby">
        {/* Slab du dessus */}
        <line x1="20" y1="610" x2="78" y2="610" stroke={GHI} strokeWidth="0.9" />
        {/* Vitres lobby */}
        <line x1="34" y1="610" x2="34" y2="720" stroke={GMD} strokeWidth="0.4" />
        <line x1="48" y1="610" x2="48" y2="720" stroke={GMD} strokeWidth="0.4" />
        <line x1="62" y1="610" x2="62" y2="720" stroke={GMD} strokeWidth="0.4" />
        {/* Porte d'entrée — accent ORANGE saturé */}
        <path
          d="M 42 720 L 42 678 L 56 678 L 56 720"
          fill="none"
          stroke={O}
          strokeWidth="1.5"
          strokeLinecap="square"
        />
        <line x1="49" y1="678" x2="49" y2="720" stroke={O} strokeWidth="0.8" />
        <circle cx="54" cy="700" r="0.9" fill={O} />
        {/* Auvent au-dessus de la porte */}
        <line x1="38" y1="678" x2="60" y2="678" stroke={GHI} strokeWidth="0.7" />
      </g>

      {/* Ligne de sol */}
      <line x1="14" y1="720" x2="84" y2="720" stroke={GHI} strokeWidth="1.4" />

      {/* Hachures sol (étendues à gauche) */}
      <g>
        {Array.from({ length: 16 }).map((_, i) => {
          const x = -40 + i * 9;
          return (
            <line
              key={`gh-${i}`}
              x1={x}
              y1="720"
              x2={x - 6}
              y2="734"
              stroke={GMD}
              strokeWidth="0.5"
            />
          );
        })}
      </g>

      {/* Dots accents gold à des points clés (avec halo) */}
      {[
        { x: 49, y: 80, key: 1 },
        { x: 78, y: 250, key: 2 },
        { x: 20, y: 410, key: 3 },
        { x: 78, y: 570, key: 4 },
      ].map((d) => (
        <g key={`dot-${d.key}`} data-dot={d.key} style={{ transition: "transform 200ms ease-out, opacity 200ms ease-out" }}>
          <circle cx={d.x} cy={d.y} r="1.6" fill={O} />
          <circle cx={d.x} cy={d.y} r="4" stroke={O} strokeWidth="0.5" fill="none" opacity="0.55" />
        </g>
      ))}

      {/* Petits chiffres de niveau (mono) sur le côté gauche, ponctuellement */}
      {[
        { y: 50, label: "07" },
        { y: 210, label: "05" },
        { y: 370, label: "03" },
        { y: 530, label: "01" },
        { y: 670, label: "00" },
      ].map((n) => (
        <text
          key={`lvl-${n.label}`}
          x={-50}
          y={n.y + 2}
          fontSize="6"
          fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
          fill={GMD}
          letterSpacing="0.15em"
        >
          {n.label}
        </text>
      ))}
    </svg>
  );
}

export default HeroSideStrip;
