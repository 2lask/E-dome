"use client";

import React, { useEffect, useRef } from "react";

/**
 * HeroSideStrip — bande verticale décorative sur le bord droit de la
 * première section. Lignes verticales gold, ticks horizontaux,
 * accents : un dessin technique de bâtiment minimaliste.
 *
 * Au scroll, chaque ligne se déforme indépendamment (translateY + skew
 * différents par index), et le SVG complet s'incline légèrement —
 * effet de "morphing architectural" pendant le passage entre sections.
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
      // Progress 0..1 sur les ~2 premiers viewports (transition hero → next)
      const progress = Math.min(1, scrolled / (vh * 1.8));

      // Skew global subtil sur tout le SVG
      el.style.transform = `skewY(${progress * -2.5}deg)`;

      // Transformations différenciées par data-line
      const verts = el.querySelectorAll<SVGElement>("[data-vline]");
      verts.forEach((v, i) => {
        const ty = (i % 2 === 0 ? -1 : 1) * progress * 70;
        const scale = 1 - progress * (0.18 + i * 0.04);
        v.style.transform = `translateY(${ty}px) scaleY(${scale})`;
      });

      const hticks = el.querySelectorAll<SVGElement>("[data-htick]");
      hticks.forEach((h, i) => {
        const tx = ((i % 3) - 1) * progress * 18;
        h.style.transform = `translateX(${tx}px)`;
      });

      const dots = el.querySelectorAll<SVGElement>("[data-dot]");
      dots.forEach((d, i) => {
        const ty = (i % 2 === 0 ? 1 : -1) * progress * 90;
        const opacity = 1 - progress * 0.7;
        d.style.transform = `translateY(${ty}px)`;
        d.style.opacity = String(opacity);
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

  // Niveaux horizontaux répartis sur la hauteur
  const levels = Array.from({ length: 14 }, (_, i) => 30 + i * 56);
  // Dots accent (gold remplis) à des positions spécifiques
  const dotPositions = [120, 280, 440, 600, 720];

  return (
    <svg
      ref={ref}
      viewBox="0 0 90 820"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="absolute right-0 top-0 h-screen w-[70px] xl:w-[90px] pointer-events-none"
      style={{
        overflow: "visible",
        transition: "transform 200ms ease-out",
        transformOrigin: "center center",
      }}
    >
      {/* Cadre extérieur droite (bordure technique) */}
      <line x1="84" y1="10" x2="84" y2="810" stroke="rgba(196,149,106,0.85)" strokeWidth="1.4" />
      <line x1="80" y1="10" x2="80" y2="810" stroke="rgba(196,149,106,0.4)" strokeWidth="0.6" />

      {/* 4 lignes verticales — chacune se déforme différemment */}
      <g data-vline="1" style={{ transition: "transform 200ms ease-out", transformOrigin: "50% 50%" }}>
        <line x1="20" y1="20" x2="20" y2="800" stroke="rgba(196,149,106,0.35)" strokeWidth="0.7" />
      </g>
      <g data-vline="2" style={{ transition: "transform 200ms ease-out", transformOrigin: "50% 50%" }}>
        <line x1="36" y1="20" x2="36" y2="800" stroke="rgba(196,149,106,0.7)" strokeWidth="1.3" />
      </g>
      <g data-vline="3" style={{ transition: "transform 200ms ease-out", transformOrigin: "50% 50%" }}>
        <line x1="54" y1="20" x2="54" y2="800" stroke="rgba(196,149,106,0.45)" strokeWidth="0.8" />
      </g>
      <g data-vline="4" style={{ transition: "transform 200ms ease-out", transformOrigin: "50% 50%" }}>
        <line x1="68" y1="20" x2="68" y2="800" stroke="rgba(196,149,106,0.55)" strokeWidth="0.9" />
      </g>

      {/* Niveaux horizontaux (ticks) */}
      {levels.map((y, i) => (
        <g
          key={`lv-${i}`}
          data-htick={i}
          style={{ transition: "transform 200ms ease-out", transformOrigin: "50% 50%" }}
        >
          <line
            x1="10"
            y1={y}
            x2="78"
            y2={y}
            stroke={i % 3 === 0 ? "rgba(196,149,106,0.4)" : "rgba(196,149,106,0.18)"}
            strokeWidth={i % 3 === 0 ? "0.7" : "0.4"}
          />
          {/* Tick principal sur la ligne droite */}
          <line
            x1="80"
            y1={y}
            x2={i % 2 === 0 ? "88" : "84"}
            y2={y}
            stroke="rgba(196,149,106,0.7)"
            strokeWidth="0.8"
          />
        </g>
      ))}

      {/* Dots accent gold remplis */}
      {dotPositions.map((y, i) => (
        <g
          key={`dot-${i}`}
          data-dot={i}
          style={{ transition: "transform 200ms ease-out, opacity 200ms ease-out" }}
        >
          <circle cx="36" cy={y} r="2.5" fill="#C4956A" />
          <circle cx="36" cy={y} r="6" stroke="#C4956A" strokeWidth="0.6" fill="none" opacity="0.5" />
        </g>
      ))}

      {/* Petits chiffres mono à intervalles (style cote technique) */}
      {[1, 4, 7, 10, 13].map((idx) => {
        const y = 30 + idx * 56;
        return (
          <text
            key={`num-${idx}`}
            x="2"
            y={y + 2}
            fontSize="6"
            fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
            fill="rgba(196,149,106,0.45)"
            letterSpacing="0.15em"
          >
            {String(idx).padStart(2, "0")}
          </text>
        );
      })}
    </svg>
  );
}

export default HeroSideStrip;
