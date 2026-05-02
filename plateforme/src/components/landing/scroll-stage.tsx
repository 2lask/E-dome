"use client";

import { useEffect, useRef, Children } from "react";

/**
 * ScrollStage — pattern studiopwi.com pour la première section :
 *   Un sentinel haut de N × 100vh fournit la course du scroll. Un stage
 *   sticky de 100vh reste épinglé en viewport. À l'intérieur, les enfants
 *   `.scroll-slide` sont stackés en absolute inset-0. Quand on scroll,
 *   le stage reste fixe et UNIQUEMENT l'opacité de chaque slide change
 *   (crossfade) — aucune translation, aucun mouvement vertical.
 *
 *   La courbe est un smoothstep (lissage doux des extrémités).
 *
 * Usage :
 *   <ScrollStage>
 *     <section className="scroll-slide">...</section>
 *     <section className="scroll-slide">...</section>
 *   </ScrollStage>
 */
export function ScrollStage({ children }: { children: React.ReactNode }) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const slideCount = Children.count(children);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const stage = stageRef.current;
    if (!sentinel || !stage) return;

    const slides = Array.from(
      stage.querySelectorAll<HTMLElement>(":scope > .scroll-slide")
    );
    if (slides.length === 0) return;

    // Initial : tous en absolute, seule la première visible et interactive
    slides.forEach((s, i) => {
      s.style.position = "absolute";
      s.style.inset = "0";
      s.style.overflowY = "auto";
      s.style.overflowX = "hidden";
      s.style.opacity = i === 0 ? "1" : "0";
      s.style.transform = "translate3d(0, 0, 0)";
      s.style.pointerEvents = i === 0 ? "auto" : "none";
      s.style.willChange = "opacity, transform";
    });

    // Distance de remontée (px) que la slide sortante effectue pendant son fade-out
    const RISE_PX = 60;

    const update = () => {
      const rect = sentinel.getBoundingClientRect();
      const total = sentinel.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolled / total);

      // Mappe progress (0..1) sur (slides.length - 1) transitions
      const segCount = Math.max(1, slides.length - 1);
      const segPos = progress * segCount;
      const currentIdx = Math.min(segCount - 1, Math.floor(segPos));
      const localProgress = segPos - currentIdx;

      // Smootherstep (Perlin) : 6t⁵ - 15t⁴ + 10t³
      const smoother = (x: number) =>
        x * x * x * (x * (x * 6 - 15) + 10);

      // Transition séquentielle :
      //   première moitié (0 → 0.5) : sortante 1 → 0 (+ translateY)
      //   seconde moitié (0.5 → 1)  : entrante 0 → 1 (sans mouvement)
      // Entre les deux : très bref instant où les deux sont à 0 (le fond
      // de page apparaît), garantissant que rien ne se chevauche.
      slides.forEach((s, i) => {
        let opacity = 0;
        let translateY = 0;

        if (i === currentIdx) {
          // Sortante
          if (localProgress < 0.5) {
            const phase = smoother(localProgress * 2);
            opacity = 1 - phase;
            translateY = -phase * RISE_PX;
          } else {
            opacity = 0;
            translateY = -RISE_PX;
          }
        } else if (i === currentIdx + 1) {
          // Entrante : reste invisible jusqu'au point milieu, puis fade-in pur
          if (localProgress >= 0.5) {
            const phase = smoother((localProgress - 0.5) * 2);
            opacity = phase;
          }
        }

        s.style.opacity = String(opacity);
        s.style.transform = `translate3d(0, ${translateY}px, 0)`;
        // Slide la plus visible reçoit les interactions
        s.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
      });
    };

    // ── Auto-snap : quand l'utilisateur arrête de scroller dans le milieu
    //    d'une transition, on glisse en smooth scroll vers le bord le plus
    //    proche (en avant si localProgress >= 0.5, en arrière sinon).
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let snapTimer: number | null = null;
    let isSnapping = false;

    const maybeSnap = () => {
      if (isSnapping) return;
      const rect = sentinel.getBoundingClientRect();
      const total = sentinel.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const sentinelAbsTop = window.scrollY + rect.top;
      const scrolled = window.scrollY - sentinelAbsTop;
      if (scrolled <= 0 || scrolled >= total) return; // hors stage

      const segCount = Math.max(1, slides.length - 1);
      const segHeight = total / segCount;
      const segPos = scrolled / segHeight;
      const currentIdx = Math.floor(segPos);
      const localProgress = segPos - currentIdx;

      // Très proche d'un bord → on ne snap pas (déjà sur place)
      if (localProgress < 0.04 || localProgress > 0.96) return;

      // Math.round bias to forward at exactly 0.5
      const targetIdx = Math.max(0, Math.min(segCount, Math.round(segPos)));
      const targetScroll = sentinelAbsTop + targetIdx * segHeight;
      if (Math.abs(window.scrollY - targetScroll) < 6) return;

      isSnapping = true;
      window.scrollTo({ top: targetScroll, behavior: reduced ? "auto" : "smooth" });
      window.setTimeout(() => {
        isSnapping = false;
      }, 900);
    };

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);

      if (isSnapping) return;
      if (snapTimer) clearTimeout(snapTimer);
      snapTimer = window.setTimeout(maybeSnap, 220);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      if (snapTimer) clearTimeout(snapTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [slideCount]);

  return (
    <div
      ref={sentinelRef}
      style={{
        position: "relative",
        // 1.7 viewport par slide : plus de course de scroll = transitions plus
        // lentes et progressives, sensation moins brusque entre les sections.
        height: `${slideCount * 170}vh`,
      }}
    >
      <div
        ref={stageRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}
