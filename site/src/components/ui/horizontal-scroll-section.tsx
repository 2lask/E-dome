"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface HorizontalScrollProps {
  children: React.ReactNode[];
  className?: string;
}

export function HorizontalScrollSection({ children, className }: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `-${(children.length - 1) * 100}%`]
  );

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ height: `${children.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ x }} className="flex h-full">
          {children.map((child, i) => (
            <div
              key={i}
              className="h-full w-screen flex-shrink-0 flex items-center justify-center px-8 md:px-16"
            >
              {child}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
