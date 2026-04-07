"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { VillaLuxuryDrawing } from "@/components/landing/drawings/villa-luxury";
import { TowerResidenceDrawing } from "@/components/landing/drawings/tower-residence";
import { InteriorPenthouseDrawing } from "@/components/landing/drawings/interior-penthouse";
import { ChaletAlpineDrawing } from "@/components/landing/drawings/chalet-alpine";

interface ArchBackgroundProps {
  variant: "villa" | "floorplan" | "building" | "mixed";
  className?: string;
}

export function ArchBackground({ variant, className = "" }: ArchBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [60, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const x1 = useTransform(scrollYProgress, [0, 1], [-15, 15]);
  const x2 = useTransform(scrollYProgress, [0, 1], [15, -15]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [-2, 2]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [1, -1]);

  const drawClass = `arch-draw-in ${isInView ? "visible" : ""}`;

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {variant === "villa" && (
        <motion.div className={`absolute right-[-15%] top-[0%] w-[95%] md:w-[75%] text-white/[0.09] arch-shimmer ${drawClass}`}
          style={{ y: y1, opacity, x: x1, rotate: rotate1 }}>
          <VillaLuxuryDrawing />
        </motion.div>
      )}

      {variant === "floorplan" && (
        <>
          <motion.div className={`absolute left-[-10%] top-[-5%] w-[85%] md:w-[60%] text-white/[0.07] ${drawClass}`}
            style={{ y: y2, opacity, x: x2, rotate: rotate2 }}>
            <ChaletAlpineDrawing />
          </motion.div>
          <motion.div className={`absolute right-[-15%] bottom-[-5%] w-[70%] md:w-[50%] text-white/[0.05] arch-pulse`}
            style={{ y: y1, opacity, x: x1 }}>
            <VillaLuxuryDrawing />
          </motion.div>
        </>
      )}

      {variant === "building" && (
        <motion.div className={`absolute right-[-5%] top-[-10%] w-[55%] md:w-[40%] text-white/[0.08] arch-float ${drawClass}`}
          style={{ y: y1, opacity, x: x1 }}>
          <TowerResidenceDrawing />
        </motion.div>
      )}

      {variant === "mixed" && (
        <>
          <motion.div className={`absolute left-[-12%] top-[-5%] w-[80%] md:w-[55%] text-white/[0.06] ${drawClass}`}
            style={{ y: y2, opacity, x: x2, rotate: rotate2 }}>
            <InteriorPenthouseDrawing />
          </motion.div>
          <motion.div className={`absolute right-[-10%] bottom-[-5%] w-[55%] md:w-[40%] text-white/[0.07] arch-shimmer`}
            style={{ y: y1, opacity, x: x1, rotate: rotate1 }}>
            <TowerResidenceDrawing />
          </motion.div>
        </>
      )}
    </div>
  );
}
