"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { LuxuryVilla3D, PenthouseView, ChaletElevation } from "@/components/landing/arch-drawings";

interface ArchBackgroundProps {
  variant: "villa" | "floorplan" | "building" | "mixed";
  className?: string;
}

export function ArchBackground({ variant, className = "" }: ArchBackgroundProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [50, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const x1 = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const x2 = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {variant === "villa" && (
        <motion.div className="absolute right-[-15%] top-[5%] w-[85%] md:w-[65%] text-white/[0.08]" style={{ y: y1, opacity, x: x1 }}>
          <LuxuryVilla3D />
        </motion.div>
      )}

      {variant === "floorplan" && (
        <>
          <motion.div className="absolute left-[-10%] top-[0%] w-[80%] md:w-[55%] text-white/[0.07]" style={{ y: y2, opacity, x: x2 }}>
            <ChaletElevation />
          </motion.div>
          <motion.div className="absolute right-[-15%] bottom-[0%] w-[60%] md:w-[40%] text-white/[0.05]" style={{ y: y1, opacity, x: x1 }}>
            <LuxuryVilla3D />
          </motion.div>
        </>
      )}

      {variant === "building" && (
        <motion.div className="absolute right-[-5%] top-[-5%] w-[70%] md:w-[50%] text-white/[0.08]" style={{ y: y1, opacity, x: x1 }}>
          <PenthouseView />
        </motion.div>
      )}

      {variant === "mixed" && (
        <>
          <motion.div className="absolute left-[-12%] top-[0%] w-[75%] md:w-[55%] text-white/[0.06]" style={{ y: y2, opacity, x: x2 }}>
            <PenthouseView />
          </motion.div>
          <motion.div className="absolute right-[-10%] bottom-[0%] w-[65%] md:w-[45%] text-white/[0.07]" style={{ y: y1, opacity, x: x1 }}>
            <ChaletElevation />
          </motion.div>
        </>
      )}
    </div>
  );
}
