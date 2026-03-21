"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import { useRef, useState, type ReactNode } from "react";

/* ═══════════════════════════════════════════════════════════════
   1. FADE OUT — la section disparaît en se réduisant + blur
   ═══════════════════════════════════════════════════════════════ */
export function FadeOutSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8], [1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.8], [1, 1, 0.92]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.8], [0, 0, -60]);
  const blur = useTransform(scrollYProgress, [0, 0.3, 0.8], [0, 0, 10]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ opacity, scale, y, filter: useTransform(blur, v => `blur(${v}px)`) }}>
        {children}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. CLIP REVEAL — cercle qui s'ouvre depuis le centre
   ═══════════════════════════════════════════════════════════════ */
export function ClipRevealSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.3"] });
  const clipPath = useTransform(scrollYProgress, [0, 1], ["circle(0% at 50% 50%)", "circle(150% at 50% 50%)"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ clipPath, opacity }}>{children}</motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. WIPE DIAGONAL — la section apparaît en diagonale
   ═══════════════════════════════════════════════════════════════ */
export function WipeSection({ children, className = "", direction = "right" }: { children: ReactNode; className?: string; direction?: "left" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.2"] });
  const from = direction === "right" ? "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" : "polygon(0 0, 0 0, 0 100%, 0 100%)";
  const to = "polygon(0 0, 100% 0, 100% 100%, 0 100%)";
  const clipPath = useTransform(scrollYProgress, [0, 1], [from, to]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ clipPath, opacity }}>{children}</motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. PERSPECTIVE 3D — la section monte en 3D depuis le bas
   ═══════════════════════════════════════════════════════════════ */
export function PerspectiveSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.3"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [12, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);

  return (
    <div ref={ref} className={`relative ${className}`} style={{ perspective: 1200 }}>
      <motion.div style={{ rotateX, opacity, y, scale, transformOrigin: "center bottom" }}>
        {children}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. CROSS-FADE + BLUR — fondu croisé avec flou
   ═══════════════════════════════════════════════════════════════ */
export function CrossFadeSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.4"] });
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [0, 0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.4, 1], [80, 40, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.5, 1], [12, 6, 0]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ opacity, y, filter: useTransform(blur, v => `blur(${v}px)`) }}>
        {children}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. SLIDE ROTATE — la section glisse et tourne légèrement
   ═══════════════════════════════════════════════════════════════ */
export function SlideRotateSection({ children, className = "", direction = "left" }: { children: ReactNode; className?: string; direction?: "left" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.25"] });
  const x = useTransform(scrollYProgress, [0, 1], [direction === "left" ? -200 : 200, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [direction === "left" ? -5 : 5, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 0.5, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ x, rotate, opacity, scale }}>{children}</motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   7. ZOOM BURST — la section apparaît en zoomant depuis le fond
   ═══════════════════════════════════════════════════════════════ */
export function ZoomBurstSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.3"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7], [0, 0.5, 1]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [15, 0]);

  return (
    <div ref={ref} className={`relative ${className}`} style={{ perspective: 1000 }}>
      <motion.div style={{ scale, opacity, rotateY }}>{children}</motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   8. SPLIT REVEAL — deux moitiés s'ouvrent comme un rideau
   ═══════════════════════════════════════════════════════════════ */
export function SplitRevealSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.3"] });
  const leftX = useTransform(scrollYProgress, [0, 0.6, 1], ["-50%", "-50%", "0%"]);
  const rightX = useTransform(scrollYProgress, [0, 0.6, 1], ["50%", "50%", "0%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [0, 0, 1]);
  const curtainOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Left curtain */}
      <motion.div
        className="absolute inset-0 w-1/2 z-20"
        style={{ x: leftX, opacity: curtainOpacity, background: "linear-gradient(90deg, #080808, #0a0a0a)" }}
      />
      {/* Right curtain */}
      <motion.div
        className="absolute inset-0 left-1/2 w-1/2 z-20"
        style={{ x: rightX, opacity: curtainOpacity, background: "linear-gradient(270deg, #080808, #0a0a0a)" }}
      />
      <motion.div style={{ opacity: contentOpacity }} className="relative z-10">
        {children}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   9. FLIP CARD — la section tourne sur elle-même en 3D
   ═══════════════════════════════════════════════════════════════ */
export function FlipSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.2"] });
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [90, 45, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7], [0, 0.3, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [150, 0]);

  return (
    <div ref={ref} className={`relative ${className}`} style={{ perspective: 1500 }}>
      <motion.div style={{ rotateX, opacity, y, transformOrigin: "center bottom" }}>
        {children}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   10. PARALLAX STACK — la section monte par-dessus la précédente
   ═══════════════════════════════════════════════════════════════ */
export function ParallaxStackSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [200, 0, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 1.02]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.8]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ y, scale, opacity }}>{children}</motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SÉPARATEURS ANIMÉS
   ═══════════════════════════════════════════════════════════════ */

/* Ligne qui se dessine depuis le centre */
export function LineDivider({ color = "#C4956A" }: { color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.5"] });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <div ref={ref} className="py-8 flex justify-center">
      <motion.div style={{ scaleX, opacity, transformOrigin: "center" }} className="w-[80%] max-w-[600px] h-[1px]">
        <div className="w-full h-full" style={{ background: `linear-gradient(90deg, transparent, ${color}60, ${color}, ${color}60, transparent)` }} />
      </motion.div>
    </div>
  );
}

/* Losange + lignes qui se dessinent */
export function DiamondDivider({ color = "#C4956A" }: { color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.5"] });
  const scaleX = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [180, 45]);
  const diamondScale = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 1]);
  const diamondOpacity = useTransform(scrollYProgress, [0, 0.5, 0.8], [0, 0, 1]);

  return (
    <div ref={ref} className="py-12 flex items-center justify-center gap-0">
      <motion.div style={{ scaleX, transformOrigin: "right center", opacity: useTransform(scrollYProgress, [0, 0.3], [0, 1]) }}
        className="flex-1 max-w-[300px] h-[1px]" >
        <div className="w-full h-full" style={{ background: `linear-gradient(90deg, transparent, ${color}50)` }} />
      </motion.div>
      <motion.div style={{ rotate, scale: diamondScale, opacity: diamondOpacity }}
        className="w-3 h-3 mx-4 shrink-0" >
        <div className="w-full h-full" style={{ background: color, transform: "rotate(0deg)" }} />
      </motion.div>
      <motion.div style={{ scaleX, transformOrigin: "left center", opacity: useTransform(scrollYProgress, [0, 0.3], [0, 1]) }}
        className="flex-1 max-w-[300px] h-[1px]" >
        <div className="w-full h-full" style={{ background: `linear-gradient(270deg, transparent, ${color}50)` }} />
      </motion.div>
    </div>
  );
}

/* Points qui apparaissent en cascade */
export function DotCascadeDivider({ color = "#C4956A", count = 5 }: { color?: string; count?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.5"] });

  return (
    <div ref={ref} className="py-10 flex items-center justify-center gap-3">
      {Array.from({ length: count }).map((_, i) => {
        const delay = i / count;
        return (
          <motion.div key={i}
            style={{
              scale: useTransform(scrollYProgress, [delay * 0.5, delay * 0.5 + 0.3], [0, 1]),
              opacity: useTransform(scrollYProgress, [delay * 0.5, delay * 0.5 + 0.2], [0, 1]),
            }}
            className="rounded-full"
          >
            <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}60` }} />
          </motion.div>
        );
      })}
    </div>
  );
}

/* Vague SVG animée */
export function WaveDivider({ color = "#C4956A" }: { color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.5"] });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <div ref={ref} className="py-6 flex justify-center">
      <motion.svg width="600" height="30" viewBox="0 0 600 30" className="max-w-[80%]" style={{ opacity }}>
        <motion.path
          d="M0,15 Q75,0 150,15 T300,15 T450,15 T600,15"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeOpacity="0.5"
          style={{ pathLength }}
        />
        <motion.path
          d="M0,15 Q75,30 150,15 T300,15 T450,15 T600,15"
          fill="none"
          stroke={color}
          strokeWidth="1"
          strokeOpacity="0.25"
          style={{ pathLength }}
        />
      </motion.svg>
    </div>
  );
}
