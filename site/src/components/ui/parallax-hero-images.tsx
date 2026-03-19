"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";

interface ParallaxHeroImagesProps {
  images: string[];
  className?: string;
}

const POSITIONS = [
  { x: -35, y: -25, z: 0.15, rotate: -8, size: 220 },
  { x: 30, y: -30, z: 0.25, rotate: 6, size: 200 },
  { x: -40, y: 20, z: 0.1, rotate: -4, size: 180 },
  { x: 35, y: 25, z: 0.2, rotate: 8, size: 190 },
  { x: -10, y: -40, z: 0.3, rotate: -2, size: 160 },
  { x: 15, y: 35, z: 0.18, rotate: 5, size: 170 },
];

export function ParallaxHeroImages({ images, className = "" }: ParallaxHeroImagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set((e.clientX - centerX) / (rect.width / 2));
      mouseY.set((e.clientY - centerY) / (rect.height / 2));
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      {images.slice(0, POSITIONS.length).map((src, i) => {
        const pos = POSITIONS[i];
        const depth = 40 + pos.z * 120;

        return (
          <ParallaxImage
            key={i}
            src={src}
            smoothX={smoothX}
            smoothY={smoothY}
            depth={depth}
            baseX={pos.x}
            baseY={pos.y}
            rotate={pos.rotate}
            size={pos.size}
            delay={i * 0.15}
          />
        );
      })}
    </div>
  );
}

function ParallaxImage({
  src, smoothX, smoothY, depth, baseX, baseY, rotate, size, delay,
}: {
  src: string;
  smoothX: ReturnType<typeof useSpring>;
  smoothY: ReturnType<typeof useSpring>;
  depth: number;
  baseX: number;
  baseY: number;
  rotate: number;
  size: number;
  delay: number;
}) {
  const x = useTransform(smoothX, [-1, 1], [-depth, depth]);
  const y = useTransform(smoothY, [-1, 1], [-depth, depth]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ x, y }}
      className="absolute"
    >
      <div
        className="overflow-hidden rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/40"
        style={{
          width: size,
          height: size * 0.65,
          left: `calc(50% + ${baseX}%)`,
          top: `calc(50% + ${baseY}%)`,
          transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
          position: "absolute",
        }}
      >
        <img
          src={src}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
    </motion.div>
  );
}
