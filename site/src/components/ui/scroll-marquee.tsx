"use client";

import { useRef } from "react";
import { motion, useScroll, useVelocity, useTransform, useSpring } from "framer-motion";

interface ScrollMarqueeProps {
  text: string;
  className?: string;
  repeat?: number;
}

export function ScrollMarquee({ text, className = "", repeat = 5 }: ScrollMarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 400 });
  const x = useTransform(smoothVelocity, [-1000, 1000], [-150, 150]);

  return (
    <div
      ref={ref}
      className={`overflow-hidden py-8 pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <motion.div style={{ x }} className="flex whitespace-nowrap gap-12">
        {Array.from({ length: repeat }).map((_, i) => (
          <span
            key={i}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#ffe0c2]/[0.04] uppercase tracking-[0.2em]"
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function NoiseOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.025]"
      aria-hidden="true"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        animation: "grain 0.5s steps(1) infinite",
      }}
    />
  );
}
