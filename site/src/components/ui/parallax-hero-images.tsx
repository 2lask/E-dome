"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";

interface ParallaxHeroImagesProps {
  images: string[];
  className?: string;
}

/* Images placed around the edges of the viewport so they frame the center text.
   Using vw/vh units for responsive positioning. */
const POSITIONS = [
  { left: "3vw",  top: "12vh", depth: 20, rotate: -6,  w: 260, h: 170 },
  { left: "75vw", top: "8vh",  depth: 35, rotate: 5,   w: 240, h: 160 },
  { left: "-2vw", top: "55vh", depth: 15, rotate: -3,   w: 220, h: 150 },
  { left: "78vw", top: "52vh", depth: 30, rotate: 7,    w: 250, h: 165 },
  { left: "15vw", top: "78vh", depth: 25, rotate: -4,   w: 200, h: 140 },
  { left: "60vw", top: "80vh", depth: 40, rotate: 3,    w: 230, h: 155 },
];

export function ParallaxHeroImages({ images, className = "" }: ParallaxHeroImagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {images.slice(0, POSITIONS.length).map((src, i) => (
        <FloatingImage key={i} src={src} pos={POSITIONS[i]} smoothX={smoothX} smoothY={smoothY} index={i} />
      ))}
    </div>
  );
}

function FloatingImage({ src, pos, smoothX, smoothY, index }: {
  src: string;
  pos: typeof POSITIONS[0];
  smoothX: ReturnType<typeof useSpring>;
  smoothY: ReturnType<typeof useSpring>;
  index: number;
}) {
  const x = useTransform(smoothX, [-1, 1], [-pos.depth, pos.depth]);
  const y = useTransform(smoothY, [-1, 1], [-pos.depth, pos.depth]);

  return (
    <motion.div
      style={{ x, y, left: pos.left, top: pos.top, width: pos.w, height: pos.h, rotate: pos.rotate, position: "absolute" }}
      initial={{ opacity: 0, scale: 0.7, y: 40 }}
      animate={{ opacity: 0.7, scale: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3 + index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/[0.08]"
    >
      <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      {/* Subtle glow behind each image */}
      <div className="absolute -inset-4 -z-10 rounded-3xl bg-[#C4956A]/[0.06] blur-2xl" />
    </motion.div>
  );
}
