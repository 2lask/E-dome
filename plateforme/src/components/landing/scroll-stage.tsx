"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  Children,
} from "react";
import { useMotionValue, useTransform, type MotionValue } from "framer-motion";

/* ─────────── Context : progress global 0..1 + nombre de slides ─────── */
interface ScrollStageCtx {
  progress: MotionValue<number>;
  slideCount: number;
}
const ScrollStageContext = createContext<ScrollStageCtx | null>(null);

/**
 * Hook : MotionValue [0,1] qui suit la fenêtre de fade-in du slide. À 0 le
 * slide commence à apparaître ; à 1 il atteint sa pleine visibilité (snap
 * point). Au-delà (durant le fade-out vers le slide suivant), la valeur
 * reste clampée à 1 — utile pour qu'une animation interne (ex. parallax)
 * culmine pile au moment où le slide est entièrement visible et tienne sa
 * pose pendant que l'opacité s'efface.
 */
export function useSlideProgress(slideIdx: number): MotionValue<number> {
  const ctx = useContext(ScrollStageContext);
  if (!ctx) {
    throw new Error("useSlideProgress must be used inside <ScrollStage>");
  }
  const segCount = Math.max(1, ctx.slideCount - 1);
  // Slide visible during second half of previous segment (incoming) +
  // first half of own segment (outgoing). Total = one segment of scroll.
  const start = Math.max(0, (slideIdx - 0.5) / segCount);
  const end = Math.min(1, (slideIdx + 0.5) / segCount);
  return useTransform(
    ctx.progress,
    [start, end],
    [0, 1],
    { clamp: true },
  );
}


/**
 * ScrollStage — pinned crossfade scroll-driven, niveau studio primé.
 *
 * Architecture : sentinelle de N×200vh fournit la course, stage sticky
 * top:0 height:100vh. Slides .scroll-slide stackées en absolute inset:0.
 *
 * Fluidité : RAF lerp factor 0.08 sur le progress — la valeur consommée
 * par les slides est lissée image par image, indépendamment de la
 * fréquence des events scroll natifs (saccadés au trackpad/souris).
 *
 * Rise-up effect (sortante) : translateY 0 → -100px + scale 1 → 0.92
 *   + blur 0 → 8px + saturate 1 → 1.4. Easing power3.in (accelerate away).
 *   Phase delay 10 % : opacity baisse légèrement après le translate
 *   (drag/trail effect — Disney 12 + Material exit).
 *
 * Entrante : scale 1.04 → 1 + blur 4 → 0 (rack-focus cinéma, mirror
 *   subtil). Easing power3.out (decelerate into place).
 *
 * Snap : custom rAF smooth-scroll 900ms easeInOutCubic, interruptable
 *   sur wheel/touchstart. Plus haut de gamme que window.scrollTo natif.
 *
 * Perf : layout mesures cachées + ResizeObserver, early return si
 *   progress inchangé, willChange dynamique sur slides actives, cache
 *   pointer-events.
 */
export function ScrollStage({ children }: { children: React.ReactNode }) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const slideCount = Children.count(children);
  const progressMV = useMotionValue(0);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const stage = stageRef.current;
    if (!sentinel || !stage) return;

    const slides = Array.from(
      stage.querySelectorAll<HTMLElement>(":scope > .scroll-slide")
    );
    if (slides.length === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ── Easings ─────────────────────────────────────────── */
    const power3In = (t: number) => t * t * t;
    const power3Out = (t: number) => 1 - Math.pow(1 - t, 3);
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    /* ── Constantes anim ─────────────────────────────────── */
    const RISE_PX = 100;        // translateY de la sortante
    const SCALE_OUT = 0.92;     // scale finale de la sortante
    const BLUR_OUT = 8;         // blur max de la sortante (px)
    const SAT_OUT = 1.4;        // saturate boost de la sortante
    const SCALE_IN_FROM = 1.04; // scale initiale de l'entrante
    const BLUR_IN_FROM = 4;     // blur initial de l'entrante (px)
    const OPACITY_DRAG = 0.1;   // opacity délayée vs translate

    /* ── Init styles slides ──────────────────────────────── */
    const lastPE: string[] = slides.map((_, i) => (i === 0 ? "auto" : "none"));
    slides.forEach((s, i) => {
      s.style.position = "absolute";
      s.style.inset = "0";
      // overflow:hidden — le scroll natif passe au sentinel pour piloter
      // les transitions, au lieu d'être absorbé en scroll interne au slide.
      s.style.overflowY = "hidden";
      s.style.overflowX = "hidden";
      s.style.opacity = i === 0 ? "1" : "0";
      s.style.transform =
        i === 1
          ? `translate3d(0,0,0) scale(${SCALE_IN_FROM})`
          : "translate3d(0,0,0)";
      s.style.filter = i === 1 ? `blur(${BLUR_IN_FROM}px)` : "none";
      s.style.transformOrigin = "50% 50%";
      s.style.backfaceVisibility = "hidden";
      s.style.pointerEvents = i === 0 ? "auto" : "none";
      s.style.willChange = i <= 1 ? "opacity, transform, filter" : "auto";
    });

    /* ── Cache mesures DOM ───────────────────────────────── */
    let cachedTotal = 0;
    let cachedSentinelTop = 0;
    const measure = () => {
      const rect = sentinel.getBoundingClientRect();
      cachedSentinelTop = window.scrollY + rect.top;
      cachedTotal = sentinel.offsetHeight - window.innerHeight;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(sentinel);
    window.addEventListener("resize", measure);

    /* ── Lerp loop (frame-rate decoupled) ────────────────── */
    let targetProgress = 0;
    let currentProgress = 0;
    let rafId = 0;
    let isRunning = false;
    let lastAppliedIdx = -2;
    let lastAppliedLocal = -1;

    const computeTarget = () => {
      if (cachedTotal <= 0) {
        targetProgress = 0;
        return;
      }
      const scrolled = Math.max(0, window.scrollY - cachedSentinelTop);
      targetProgress = Math.min(1, scrolled / cachedTotal);
    };

    const applySlides = () => {
      const segCount = Math.max(1, slides.length - 1);
      const segPos = currentProgress * segCount;
      const currentIdx = Math.min(segCount - 1, Math.floor(segPos));
      const localProgress = segPos - currentIdx;

      // Early return : pas de write si rien n'a bougé visuellement
      if (
        currentIdx === lastAppliedIdx &&
        Math.abs(localProgress - lastAppliedLocal) < 0.0008
      ) {
        return;
      }
      lastAppliedIdx = currentIdx;
      lastAppliedLocal = localProgress;

      slides.forEach((s, i) => {
        let opacity = 0;
        let translateY = 0;
        let scale = 1;
        let blur = 0;
        let saturate = 1;
        const active = i === currentIdx || i === currentIdx + 1;

        if (i === currentIdx) {
          /* Sortante : 0 → 0.5 (première moitié) puis hold à 0 */
          if (localProgress < 0.5) {
            const phase = Math.min(1, localProgress * 2);
            const eased = power3In(phase); // accelerate away
            translateY = -RISE_PX * eased;
            scale = 1 - (1 - SCALE_OUT) * eased;
            blur = BLUR_OUT * eased;
            saturate = 1 + (SAT_OUT - 1) * eased;
            // Opacity démarre avec un délai (drag/trail)
            const opPhase = Math.max(0, (phase - OPACITY_DRAG) / (1 - OPACITY_DRAG));
            opacity = 1 - power3In(opPhase);
          } else {
            // Hors viewport — gardée à l'état final pour éviter un flash
            translateY = -RISE_PX;
            scale = SCALE_OUT;
            blur = BLUR_OUT;
            saturate = SAT_OUT;
            opacity = 0;
          }
        } else if (i === currentIdx + 1) {
          /* Entrante : avant 0.5 cachée, après fade in décéléré */
          if (localProgress >= 0.5) {
            const phase = Math.min(1, (localProgress - 0.5) * 2);
            const eased = power3Out(phase); // decelerate into place
            opacity = eased;
            scale = SCALE_IN_FROM - (SCALE_IN_FROM - 1) * eased;
            blur = BLUR_IN_FROM * (1 - eased);
          } else {
            opacity = 0;
            scale = SCALE_IN_FROM;
            blur = BLUR_IN_FROM;
          }
        }

        // Writes regroupés
        s.style.opacity = String(opacity);
        s.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
        const filterStr =
          blur > 0.02
            ? `blur(${blur.toFixed(2)}px) saturate(${saturate.toFixed(2)})`
            : "none";
        s.style.filter = filterStr;

        const wantPE = opacity > 0.5 ? "auto" : "none";
        if (lastPE[i] !== wantPE) {
          s.style.pointerEvents = wantPE;
          lastPE[i] = wantPE;
        }
        const wantWC = active ? "opacity, transform, filter" : "auto";
        if (s.style.willChange !== wantWC) s.style.willChange = wantWC;
      });
    };

    const tick = () => {
      const delta = targetProgress - currentProgress;
      const lerp = reduced ? 1 : 0.08;
      if (Math.abs(delta) > 0.0001) {
        currentProgress += delta * lerp;
        progressMV.set(currentProgress);
        applySlides();
        rafId = requestAnimationFrame(tick);
      } else {
        currentProgress = targetProgress;
        progressMV.set(currentProgress);
        applySlides();
        rafId = 0;
        isRunning = false;
      }
    };

    const wakeRaf = () => {
      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    /* ── Custom smooth-scroll snap (900ms easeInOutCubic) ── */
    let snapAnimId = 0;
    let snapCancel: (() => void) | null = null;

    const smoothScrollTo = (targetY: number) => {
      if (snapAnimId) cancelAnimationFrame(snapAnimId);
      snapCancel?.();
      const startY = window.scrollY;
      const delta = targetY - startY;
      if (Math.abs(delta) < 1) return;
      const duration = reduced ? 0 : 900;
      const startT = performance.now();
      let cancelled = false;

      const onUserInput = () => {
        cancelled = true;
      };
      window.addEventListener("wheel", onUserInput, { passive: true, once: true });
      window.addEventListener("touchstart", onUserInput, { passive: true, once: true });
      snapCancel = () => {
        window.removeEventListener("wheel", onUserInput);
        window.removeEventListener("touchstart", onUserInput);
        snapCancel = null;
      };

      if (duration === 0) {
        window.scrollTo(0, targetY);
        snapCancel?.();
        return;
      }

      const animate = (now: number) => {
        if (cancelled) {
          snapCancel?.();
          snapAnimId = 0;
          return;
        }
        const t = Math.min(1, (now - startT) / duration);
        window.scrollTo(0, startY + delta * easeInOutCubic(t));
        if (t < 1) {
          snapAnimId = requestAnimationFrame(animate);
        } else {
          snapCancel?.();
          snapAnimId = 0;
        }
      };
      snapAnimId = requestAnimationFrame(animate);
    };

    /* ── Snap detection (interval découplé du scroll) ────── */
    let lastScrollTs = performance.now();
    const onAnyScroll = () => {
      lastScrollTs = performance.now();
    };
    window.addEventListener("scroll", onAnyScroll, { passive: true });

    const SNAP_THRESHOLD = 0.04;
    const snapInterval = window.setInterval(() => {
      if (snapAnimId !== 0) return;
      if (performance.now() - lastScrollTs < 220) return;
      if (cachedTotal <= 0) return;
      const scrolled = window.scrollY - cachedSentinelTop;
      if (scrolled <= 0 || scrolled >= cachedTotal) return;
      const segCount = Math.max(1, slides.length - 1);
      const segHeight = cachedTotal / segCount;
      const segPos = scrolled / segHeight;
      const localProgress = segPos - Math.floor(segPos);
      if (localProgress < SNAP_THRESHOLD || localProgress > 1 - SNAP_THRESHOLD) return;
      const targetIdx = Math.max(0, Math.min(segCount, Math.round(segPos)));
      const targetY = cachedSentinelTop + targetIdx * segHeight;
      if (Math.abs(window.scrollY - targetY) < 6) return;
      smoothScrollTo(targetY);
    }, 100);

    /* ── Scroll listener (wake la lerp loop) ──────────────── */
    const onScroll = () => {
      computeTarget();
      wakeRaf();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ── Bootstrap ────────────────────────────────────────── */
    computeTarget();
    currentProgress = targetProgress;
    progressMV.set(currentProgress);
    applySlides();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onAnyScroll);
      window.removeEventListener("resize", measure);
      window.clearInterval(snapInterval);
      if (rafId) cancelAnimationFrame(rafId);
      if (snapAnimId) cancelAnimationFrame(snapAnimId);
      snapCancel?.();
      ro.disconnect();
    };
  }, [slideCount]);

  return (
    <ScrollStageContext.Provider value={{ progress: progressMV, slideCount }}>
      <div
        ref={sentinelRef}
        style={{
          position: "relative",
          // 200vh par slide : breathing room style PWI (~190vh par phase)
          height: `${slideCount * 200}vh`,
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
    </ScrollStageContext.Provider>
  );
}
