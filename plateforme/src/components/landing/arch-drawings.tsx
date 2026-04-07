"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { VillaLuxuryDrawing } from "@/components/landing/drawings/villa-luxury";
import { TowerResidenceDrawing } from "@/components/landing/drawings/tower-residence";
import { InteriorPenthouseDrawing } from "@/components/landing/drawings/interior-penthouse";
import { ChaletAlpineDrawing } from "@/components/landing/drawings/chalet-alpine";

export { VillaLuxuryDrawing as LuxuryVilla3D } from "@/components/landing/drawings/villa-luxury";
export { InteriorPenthouseDrawing as PenthouseView } from "@/components/landing/drawings/interior-penthouse";
export { ChaletAlpineDrawing as ChaletElevation } from "@/components/landing/drawings/chalet-alpine";

const drawingComponents = {
  villa: VillaLuxuryDrawing,
  penthouse: InteriorPenthouseDrawing,
  chalet: ChaletAlpineDrawing,
  tower: TowerResidenceDrawing,
  floorplan: InteriorPenthouseDrawing,
  building: TowerResidenceDrawing,
};

type AnimStyle = "draw" | "pulse" | "shimmer" | "float";

interface ArchDividerProps {
  drawing: keyof typeof drawingComponents;
  flip?: boolean;
  animation?: AnimStyle;
}

export function ArchDivider({ drawing, flip = false, animation = "draw" }: ArchDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 0.14, 0.14, 0]);
  const x = useTransform(scrollYProgress, [0, 1], flip ? [40, -40] : [-40, 40]);

  const animClass = {
    draw: `arch-draw-in ${isInView ? "visible" : ""}`,
    pulse: "arch-pulse",
    shimmer: "arch-shimmer",
    float: "arch-float",
  }[animation];

  const DrawingComponent = drawingComponents[drawing];

  return (
    <div ref={ref} className="relative w-full overflow-hidden pointer-events-none" style={{ height: "clamp(280px, 32vw, 450px)" }}>
      <motion.div
        className={`absolute ${flip ? "right-[-12%]" : "left-[-12%]"} top-1/2 -translate-y-1/2 w-[100%] md:w-[80%] text-white ${animClass}`}
        style={{ y, opacity, x }}
      >
        <DrawingComponent />
      </motion.div>
    </div>
  );
}
