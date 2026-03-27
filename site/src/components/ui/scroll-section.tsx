"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

type Variant = "fade" | "clip" | "wipe-right" | "wipe-left" | "perspective" | "slide-left" | "slide-right" | "zoom" | "split" | "flip" | "blur" | "none";

interface ScrollSectionProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

export function ScrollSection({ children, variant = "fade", className = "" }: ScrollSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.2"],
  });

  if (variant === "none") return <div className={className}>{children}</div>;

  const configs: Record<Variant, () => Record<string, any>> = {
    fade: () => ({
      opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.3, 1]),
      y: useTransform(scrollYProgress, [0, 1], [80, 0]),
    }),
    clip: () => ({
      clipPath: useTransform(scrollYProgress, [0, 1], ["circle(0% at 50% 50%)", "circle(150% at 50% 50%)"]),
      opacity: useTransform(scrollYProgress, [0, 0.2], [0, 1]),
    }),
    "wipe-right": () => ({
      clipPath: useTransform(scrollYProgress, [0, 1], ["polygon(100% 0, 100% 0, 100% 100%, 100% 100%)", "polygon(0 0, 100% 0, 100% 100%, 0 100%)"]),
      opacity: useTransform(scrollYProgress, [0, 0.3], [0, 1]),
    }),
    "wipe-left": () => ({
      clipPath: useTransform(scrollYProgress, [0, 1], ["polygon(0 0, 0 0, 0 100%, 0 100%)", "polygon(0 0, 100% 0, 100% 100%, 0 100%)"]),
      opacity: useTransform(scrollYProgress, [0, 0.3], [0, 1]),
    }),
    perspective: () => ({
      rotateX: useTransform(scrollYProgress, [0, 1], [12, 0]),
      opacity: useTransform(scrollYProgress, [0, 0.4], [0, 1]),
      y: useTransform(scrollYProgress, [0, 1], [100, 0]),
      scale: useTransform(scrollYProgress, [0, 1], [0.9, 1]),
    }),
    "slide-left": () => ({
      x: useTransform(scrollYProgress, [0, 1], [-200, 0]),
      rotate: useTransform(scrollYProgress, [0, 1], [-3, 0]),
      opacity: useTransform(scrollYProgress, [0, 0.3], [0, 1]),
      scale: useTransform(scrollYProgress, [0, 1], [0.9, 1]),
    }),
    "slide-right": () => ({
      x: useTransform(scrollYProgress, [0, 1], [200, 0]),
      rotate: useTransform(scrollYProgress, [0, 1], [3, 0]),
      opacity: useTransform(scrollYProgress, [0, 0.3], [0, 1]),
      scale: useTransform(scrollYProgress, [0, 1], [0.9, 1]),
    }),
    zoom: () => ({
      scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 0.8, 1]),
      opacity: useTransform(scrollYProgress, [0, 0.3, 0.7], [0, 0.5, 1]),
      rotateY: useTransform(scrollYProgress, [0, 1], [10, 0]),
    }),
    split: () => ({
      opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 1]),
      scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 0.9, 1]),
      y: useTransform(scrollYProgress, [0, 1], [120, 0]),
    }),
    flip: () => ({
      rotateX: useTransform(scrollYProgress, [0, 0.5, 1], [60, 20, 0]),
      opacity: useTransform(scrollYProgress, [0, 0.3, 0.7], [0, 0.3, 1]),
      y: useTransform(scrollYProgress, [0, 1], [120, 0]),
    }),
    blur: () => ({
      opacity: useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [0, 0, 1, 1]),
      y: useTransform(scrollYProgress, [0, 0.4, 1], [60, 30, 0]),
      filter: useTransform(scrollYProgress, [0, 0.5, 1], ["blur(12px)", "blur(4px)", "blur(0px)"]),
    }),
    none: () => ({}),
  };

  const style = configs[variant]();
  const needsPerspective = ["perspective", "flip", "zoom"].includes(variant);

  return (
    <div ref={ref} className={`relative ${className}`} style={needsPerspective ? { perspective: 1200 } : undefined}>
      <motion.div style={style} className={needsPerspective ? "[transform-origin:center_bottom]" : ""}>
        {children}
      </motion.div>
    </div>
  );
}
