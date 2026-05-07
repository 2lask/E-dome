"use client";

import React, { useEffect, useRef } from "react";

/**
 * HeroSideStrip — élévation détaillée d'un bâtiment vertical sur le bord
 * droit du hero. Inclut : antenne + signal, double parapet, cornice,
 * 7 étages typiques avec strip windows / mullions / allèges / fins béton,
 * 2 cantilevers (balcons), 1 stair shaft, 2 skylights, lobby vitré avec
 * porte orange et auvent, ligne de sol + hachures débordantes, 17 lignes
 * de cote latérales de longueurs et grosseurs variées (max 120px).
 *
 * Au scroll, ~9 transformations différentes s'appliquent :
 *   skewY + rotate global · floors translateY+rotate+scaleX différenciés ·
 *   ticks translateX+scaleX · windows rotate · mullions shift X ·
 *   dots translateY+scale+opacity · door translateY+opacity ·
 *   antenna skewX · cantilevers translateX
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
      const progress = Math.min(1, scrolled / (vh * 1.5));

      // Whole SVG : skewY + slight rotate
      el.style.transform = `skewY(${progress * -3}deg) rotate(${progress * -1}deg)`;

      // Floor groups : translateY + rotate + scaleX
      const floors = el.querySelectorAll<SVGElement>("[data-floor]");
      floors.forEach((f, i) => {
        const ty = (i % 2 === 0 ? -1 : 1) * progress * 50;
        const rot = ((i % 3) - 1) * progress * 3.5;
        const sx = 1 - progress * 0.1 * (i % 2 === 0 ? 1 : -1);
        f.style.transform = `translateY(${ty}px) rotate(${rot}deg) scaleX(${sx})`;
      });

      // Tick marks (cotes) : translateX + scaleX (lines compress)
      const ticks = el.querySelectorAll<SVGElement>("[data-htick]");
      ticks.forEach((t, i) => {
        const tx = ((i % 3) - 1) * progress * 28;
        const sx = 1 - progress * 0.35;
        t.style.transform = `translateX(${tx}px) scaleX(${sx})`;
      });

      // Strip windows : rotate slightly differently
      const wins = el.querySelectorAll<SVGElement>("[data-window]");
      wins.forEach((w, i) => {
        const rot = ((i % 4) - 1.5) * progress * 5;
        w.style.transform = `rotate(${rot}deg)`;
      });

      // Mullions : translateX wave pattern
      const mulls = el.querySelectorAll<SVGElement>("[data-mullion]");
      mulls.forEach((m, i) => {
        const tx = ((i % 4) - 1.5) * progress * 5;
        m.style.transform = `translateX(${tx}px)`;
      });

      // Dots : translateY + scale + opacity
      const dots = el.querySelectorAll<SVGElement>("[data-dot]");
      dots.forEach((d, i) => {
        const ty = (i % 2 === 0 ? 1 : -1) * progress * 80;
        const scale = 1 + progress * (i % 2 === 0 ? 0.6 : -0.5);
        d.style.transform = `translateY(${ty}px) scale(${scale})`;
        d.style.opacity = String(1 - progress * 0.7);
      });

      // Cantilevers (balcons) : slide horizontaux
      const cants = el.querySelectorAll<SVGElement>("[data-cantilever]");
      cants.forEach((c, i) => {
        const tx = (i % 2 === 0 ? -1 : 1) * progress * 22;
        c.style.transform = `translateX(${tx}px)`;
      });

      // Door : translateY + opacity
      const door = el.querySelector<SVGElement>("[data-door]");
      if (door) {
        door.style.transform = `translateY(${progress * 28}px)`;
        door.style.opacity = String(1 - progress * 0.55);
      }

      // Antenna : skewX prononcé
      const antenna = el.querySelector<SVGElement>("[data-antenna]");
      if (antenna) {
        antenna.style.transform = `skewX(${progress * 12}deg) translateY(${progress * -10}px)`;
      }

      // Stair shaft : translateY négatif
      const stair = el.querySelector<SVGElement>("[data-stair]");
      if (stair) {
        stair.style.transform = `translateY(${progress * -25}px) skewY(${progress * 4}deg)`;
      }
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

  // Gold avec hiérarchie d'opacités
  const GHI = "rgba(30, 157, 242,0.85)";
  const GMD = "rgba(30, 157, 242,0.55)";
  const GLO = "rgba(30, 157, 242,0.30)";
  const GFN = "rgba(30, 157, 242,0.12)";
  const O = "#1e9df1";

  // 7 étages typiques (top y de chaque, espacement 80)
  const typicalFloors = [50, 130, 210, 290, 370, 450, 530];

  // Lignes de cote latérales : max 120px maintenant
  const levelMarkers = [
    { y: 30, len: 120, stroke: 1.4, color: GHI }, // toit
    { y: 50, len: 35, stroke: 0.6, color: GMD },
    { y: 90, len: 70, stroke: 0.9, color: GMD },
    { y: 130, len: 18, stroke: 0.5, color: GLO },
    { y: 170, len: 95, stroke: 1.0, color: GHI },
    { y: 210, len: 28, stroke: 0.6, color: GMD },
    { y: 250, len: 55, stroke: 0.8, color: GMD },
    { y: 290, len: 14, stroke: 0.5, color: GLO },
    { y: 330, len: 110, stroke: 1.2, color: GHI }, // emphase mid
    { y: 370, len: 22, stroke: 0.5, color: GLO },
    { y: 410, len: 65, stroke: 0.9, color: GMD },
    { y: 450, len: 30, stroke: 0.6, color: GMD },
    { y: 490, len: 90, stroke: 1.0, color: GHI },
    { y: 530, len: 24, stroke: 0.6, color: GLO },
    { y: 570, len: 50, stroke: 0.8, color: GMD },
    { y: 610, len: 115, stroke: 1.1, color: GHI }, // dalle lobby
    { y: 670, len: 38, stroke: 0.7, color: GMD },
    { y: 720, len: 120, stroke: 1.3, color: GHI }, // sol
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
      {/* ════════ GRILLE FAIBLE (background) ════════ */}
      <g stroke={GFN} strokeWidth="0.4">
        {[100, 200, 300, 400, 500, 600].map((y) => (
          <line key={`gh-${y}`} x1="-50" y1={y} x2="90" y2={y} />
        ))}
      </g>

      {/* ════════ LIGNES DE COTE QUI DÉBORDENT À GAUCHE (max 120px) ════════ */}
      {levelMarkers.map((m, i) => (
        <g
          key={`lm-${i}`}
          data-htick={i}
          style={{ transition: "transform 200ms ease-out", transformOrigin: "100% 50%" }}
        >
          <line
            x1={20 - m.len}
            y1={m.y}
            x2={20}
            y2={m.y}
            stroke={m.color}
            strokeWidth={m.stroke}
          />
          {m.len > 60 && (
            <line
              x1={20 - m.len}
              y1={m.y - 2.5}
              x2={20 - m.len}
              y2={m.y + 2.5}
              stroke={m.color}
              strokeWidth={m.stroke * 0.7}
            />
          )}
        </g>
      ))}

      {/* ════════ ANTENNE + SIGNAL ════════ */}
      <g data-antenna style={{ transition: "transform 200ms ease-out", transformOrigin: "50% 100%" }}>
        <line x1="49" y1="30" x2="49" y2="8" stroke={GMD} strokeWidth="0.8" />
        <line x1="46" y1="14" x2="52" y2="14" stroke={GMD} strokeWidth="0.5" />
        <line x1="47" y1="20" x2="51" y2="20" stroke={GMD} strokeWidth="0.5" />
        <circle cx="49" cy="6" r="1.5" fill={O} data-dot="0" />
      </g>

      {/* ════════ TOITURE (cornice + parapet double + skylights) ════════ */}
      <g data-floor="0">
        {/* Cornice (légèrement débordant) */}
        <line x1="12" y1="26" x2="84" y2="26" stroke={GHI} strokeWidth="0.7" />
        {/* Parapet double */}
        <line x1="14" y1="28" x2="80" y2="28" stroke={GHI} strokeWidth="1.1" />
        <line x1="14" y1="32" x2="80" y2="32" stroke={GMD} strokeWidth="0.5" />
        {/* 2 skylights sur le toit */}
        <rect x="28" y="36" width="14" height="8" fill="none" stroke={GMD} strokeWidth="0.6" />
        <rect x="56" y="36" width="14" height="8" fill="none" stroke={GMD} strokeWidth="0.6" />
        {/* HVAC unit central */}
        <rect x="44" y="36" width="10" height="10" fill="none" stroke={GMD} strokeWidth="0.5" />
        <line x1="44" y1="40" x2="54" y2="40" stroke={GLO} strokeWidth="0.4" />
        <line x1="44" y1="43" x2="54" y2="43" stroke={GLO} strokeWidth="0.4" />
      </g>

      {/* ════════ MURS LATÉRAUX (toute la hauteur) ════════ */}
      <line x1="20" y1="32" x2="20" y2="720" stroke={GHI} strokeWidth="1" />
      <line x1="78" y1="32" x2="78" y2="720" stroke={GHI} strokeWidth="1.3" />

      {/* ════════ STAIR SHAFT (cage d'escalier indicateur sur le côté droit) ════════ */}
      <g data-stair style={{ transition: "transform 200ms ease-out", transformOrigin: "50% 50%" }}>
        <line x1="74" y1="50" x2="74" y2="610" stroke={GMD} strokeWidth="0.5" strokeDasharray="3 2" />
        {/* Marches en zigzag */}
        {Array.from({ length: 7 }).map((_, i) => {
          const y = 80 + i * 80;
          return (
            <g key={`stz-${i}`}>
              <line x1="74" y1={y} x2="76" y2={y - 6} stroke={GLO} strokeWidth="0.4" />
              <line x1="76" y1={y - 6} x2="76" y2={y - 12} stroke={GLO} strokeWidth="0.4" />
            </g>
          );
        })}
      </g>

      {/* ════════ 7 ÉTAGES TYPIQUES (slab + window + mullions + allège + fins) ════════ */}
      {typicalFloors.map((y, idx) => (
        <g key={`fl-${idx}`} data-floor={`f${idx}`} style={{ transition: "transform 200ms ease-out", transformOrigin: "50% 50%" }}>
          {/* Slab */}
          <line x1="20" y1={y} x2="78" y2={y} stroke={GMD} strokeWidth="0.7" />
          <line x1="20" y1={y + 3} x2="78" y2={y + 3} stroke={GLO} strokeWidth="0.4" />

          {/* Strip window — rotate-able */}
          <g data-window={idx} style={{ transition: "transform 200ms ease-out", transformOrigin: "50% 50%" }}>
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
            <line data-mullion={idx * 4 + 0} x1="38" y1={y + 18} x2="38" y2={y + 50} stroke={GMD} strokeWidth="0.4" style={{ transition: "transform 200ms ease-out" }} />
            <line data-mullion={idx * 4 + 1} x1="50" y1={y + 18} x2="50" y2={y + 50} stroke={GMD} strokeWidth="0.4" style={{ transition: "transform 200ms ease-out" }} />
            <line data-mullion={idx * 4 + 2} x1="62" y1={y + 18} x2="62" y2={y + 50} stroke={GMD} strokeWidth="0.4" style={{ transition: "transform 200ms ease-out" }} />
            {/* Horizontal divider in window */}
            <line x1="26" y1={y + 34} x2="72" y2={y + 34} stroke={GLO} strokeWidth="0.3" />
          </g>

          {/* Allège béton */}
          <line x1="20" y1={y + 56} x2="78" y2={y + 56} stroke={GLO} strokeWidth="0.4" />

          {/* Fins béton verticales (3 thin verticals on left edge) */}
          <line x1="22" y1={y + 4} x2="22" y2={y + 76} stroke={GLO} strokeWidth="0.3" />
          <line x1="24" y1={y + 4} x2="24" y2={y + 76} stroke={GLO} strokeWidth="0.3" />

          {/* Numéro d'étage (mono) discret */}
          <text
            x="68"
            y={y + 12}
            fontSize="4"
            fontFamily="ui-monospace, monospace"
            fill={GLO}
            letterSpacing="0.1em"
          >
            {String(7 - idx).padStart(2, "0")}
          </text>
        </g>
      ))}

      {/* ════════ CANTILEVER 1 (balcon à mi-hauteur, côté gauche) ════════ */}
      <g data-cantilever="0" style={{ transition: "transform 200ms ease-out", transformOrigin: "100% 50%" }}>
        <rect x="6" y="328" width="14" height="6" fill="none" stroke={GMD} strokeWidth="0.6" />
        {/* Garde-corps */}
        {[8, 12, 16].map((x) => (
          <line key={`r1-${x}`} x1={x} y1="328" x2={x} y2="334" stroke={GLO} strokeWidth="0.3" />
        ))}
      </g>

      {/* ════════ CANTILEVER 2 (balcon plus bas, côté droit) ════════ */}
      <g data-cantilever="1" style={{ transition: "transform 200ms ease-out", transformOrigin: "0% 50%" }}>
        <rect x="78" y="488" width="14" height="6" fill="none" stroke={GMD} strokeWidth="0.6" />
        {[80, 84, 88].map((x) => (
          <line key={`r2-${x}`} x1={x} y1="488" x2={x} y2="494" stroke={GLO} strokeWidth="0.3" />
        ))}
      </g>

      {/* ════════ LOBBY (rez-de-chaussée vitré) ════════ */}
      <g data-floor="lobby">
        {/* Slab supérieur */}
        <line x1="20" y1="610" x2="78" y2="610" stroke={GHI} strokeWidth="0.9" />
        <line x1="20" y1="613" x2="78" y2="613" stroke={GLO} strokeWidth="0.4" />

        {/* Vitres lobby */}
        <line x1="34" y1="610" x2="34" y2="720" stroke={GMD} strokeWidth="0.4" />
        <line x1="48" y1="610" x2="48" y2="720" stroke={GMD} strokeWidth="0.4" />
        <line x1="62" y1="610" x2="62" y2="720" stroke={GMD} strokeWidth="0.4" />
        {/* Horizontal mid */}
        <line x1="20" y1="660" x2="78" y2="660" stroke={GLO} strokeWidth="0.3" />

        {/* Auvent */}
        <line x1="34" y1="678" x2="64" y2="678" stroke={GHI} strokeWidth="0.7" />
        <line x1="32" y1="675" x2="66" y2="675" stroke={GMD} strokeWidth="0.5" />

        {/* Porte d'entrée (orange) */}
        <g data-door style={{ transition: "transform 200ms ease-out, opacity 200ms ease-out" }}>
          <path d="M 42 720 L 42 678 L 56 678 L 56 720" fill="none" stroke={O} strokeWidth="1.5" strokeLinecap="square" />
          <line x1="49" y1="678" x2="49" y2="720" stroke={O} strokeWidth="0.8" />
          <circle cx="54" cy="700" r="0.9" fill={O} />
          {/* Marche */}
          <line x1="40" y1="722" x2="58" y2="722" stroke={GHI} strokeWidth="0.7" />
        </g>

        {/* Numéro RDC */}
        <text x="64" y="630" fontSize="4" fontFamily="ui-monospace, monospace" fill={GLO} letterSpacing="0.1em">RDC</text>
      </g>

      {/* ════════ LIGNE DE SOL ════════ */}
      <line x1="-30" y1="720" x2="84" y2="720" stroke={GHI} strokeWidth="1.4" />

      {/* ════════ HACHURES SOL (étendues à gauche, légèrement) ════════ */}
      <g>
        {Array.from({ length: 18 }).map((_, i) => {
          const x = -30 + i * 7;
          return (
            <line
              key={`gh-${i}`}
              x1={x}
              y1="720"
              x2={x - 5}
              y2="732"
              stroke={GMD}
              strokeWidth="0.45"
            />
          );
        })}
      </g>

      {/* ════════ DOTS GOLD ACCENTS (avec halo) ════════ */}
      {[
        { x: 49, y: 80, key: 1 },
        { x: 78, y: 250, key: 2 },
        { x: 20, y: 410, key: 3 },
        { x: 78, y: 570, key: 4 },
        { x: 49, y: 690, key: 5 },
      ].map((d) => (
        <g key={`dot-${d.key}`} data-dot={d.key} style={{ transition: "transform 200ms ease-out, opacity 200ms ease-out", transformOrigin: `${d.x}px ${d.y}px` }}>
          <circle cx={d.x} cy={d.y} r="1.5" fill={O} />
          <circle cx={d.x} cy={d.y} r="3.8" stroke={O} strokeWidth="0.5" fill="none" opacity="0.55" />
        </g>
      ))}

      {/* ════════ ANNOTATIONS NUMÉROTÉES (mono, sur le côté gauche) ════════ */}
      {[
        { y: 50, label: "+24m" },
        { y: 210, label: "+18m" },
        { y: 370, label: "+12m" },
        { y: 530, label: "+6m" },
        { y: 670, label: "0m" },
        { y: 720, label: "─0─" },
      ].map((n) => (
        <text
          key={`ann-${n.label}`}
          x={-26}
          y={n.y + 2}
          fontSize="5"
          fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
          fill={GMD}
          letterSpacing="0.1em"
        >
          {n.label}
        </text>
      ))}

      {/* ════════ DIAGONAL CONSTRUCTION LINE (de l'angle bâtiment vers le sol) ════════ */}
      <line x1="78" y1="32" x2="92" y2="50" stroke={GLO} strokeWidth="0.5" />
      <line x1="20" y1="720" x2="-30" y2="745" stroke={GLO} strokeWidth="0.5" />
    </svg>
  );
}

export default HeroSideStrip;
