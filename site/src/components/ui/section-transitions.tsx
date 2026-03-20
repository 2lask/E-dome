"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

/* Section qui disparaît en scrollant (scale down + fade out) */
export function FadeOutSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8], [1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.8], [1, 1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.8], [0, 0, -40]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ opacity, scale, y }}>{children}</motion.div>
    </div>
  );
}

/* Section qui apparaît depuis le bas avec clip-path circulaire */
export function ClipRevealSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.3"] });
  const clipPath = useTransform(scrollYProgress, [0, 1], ["circle(0% at 50% 100%)", "circle(150% at 50% 50%)"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ clipPath, opacity }}>{children}</motion.div>
    </div>
  );
}

/* Wipe horizontal — la section suivante glisse depuis la droite */
export function WipeSection({ children, className = "", direction = "right" }: { children: ReactNode; className?: string; direction?: "left" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.2"] });
  const x = useTransform(scrollYProgress, [0, 1], [direction === "right" ? "100%" : "-100%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ x, opacity }}>{children}</motion.div>
    </div>
  );
}

/* Section qui monte et pousse la précédente — perspective 3D */
export function PerspectiveSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.3"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [8, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);

  return (
    <div ref={ref} className={`relative ${className}`} style={{ perspective: 1200 }}>
      <motion.div style={{ rotateX, opacity, y, transformOrigin: "center bottom" }}>{children}</motion.div>
    </div>
  );
}

/* Section avec fondu croisé (cross-fade) — l'ancienne disparaît, la nouvelle apparaît */
export function CrossFadeSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.4"] });
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.4, 1], [60, 30, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.5, 1], [8, 4, 0]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ opacity, y, filter: useTransform(blur, (v) => `blur(${v}px)`) }}>
        {children}
      </motion.div>
    </div>
  );
}

/* Séparateur animé entre sections — ligne qui se dessine */
export function LineDivider({ color = "#C4956A" }: { color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.5"] });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <div ref={ref} className="py-8 flex justify-center">
      <motion.div
        style={{ scaleX, opacity, transformOrigin: "center" }}
        className="w-[80%] max-w-[600px] h-[1px]"
      >
        <div className="w-full h-full" style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />
      </motion.div>
    </div>
  );
}
