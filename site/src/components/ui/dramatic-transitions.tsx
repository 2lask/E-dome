"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE_OUT_QUART: [number, number, number, number] = [0.165, 0.84, 0.44, 1];

/* ===========================================================================
 * 1. WaveTransition (150px)
 * Three layered SVG wave paths at low opacity with stagger animation
 * =========================================================================*/

export function WaveTransition({ className = "" }: { className?: string }) {
  const waves = [
    { d: "M0,80 C200,30 400,120 600,60 C800,0 1000,90 1200,50 L1200,150 L0,150Z", opacity: 0.03, delay: 0 },
    { d: "M0,90 C150,50 350,130 550,70 C750,10 950,100 1200,60 L1200,150 L0,150Z", opacity: 0.05, delay: 0.15 },
    { d: "M0,100 C180,60 380,140 580,80 C780,20 980,110 1200,70 L1200,150 L0,150Z", opacity: 0.08, delay: 0.3 },
  ];

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none relative w-full select-none overflow-hidden", className)}
      style={{ height: 150 }}
    >
      <motion.svg
        viewBox="0 0 1200 150"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        {waves.map((wave, i) => (
          <motion.path
            key={i}
            d={wave.d}
            fill="#8B6F47"
            variants={{
              hidden: { opacity: 0, translateY: 20 },
              visible: { opacity: wave.opacity, translateY: 0 },
            }}
            transition={{ duration: 1.2, delay: wave.delay, ease: EASE_OUT_QUART }}
          />
        ))}
        {/* Crest highlight line */}
        <motion.path
          d="M0,85 C200,35 400,125 600,65 C800,5 1000,95 1200,55"
          fill="none"
          stroke="#8B6F47"
          strokeWidth="1"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: { pathLength: 1, opacity: 0.12 },
          }}
          transition={{ duration: 1.8, delay: 0.2, ease: EASE_OUT_QUART }}
        />
      </motion.svg>
    </div>
  );
}

/* ===========================================================================
 * 2. DiagonalWipeTransition (100px)
 * A diagonal gradient band that sweeps across on scroll
 * =========================================================================*/

export function DiagonalWipeTransition({
  className = "",
  direction = "left-to-right",
}: {
  className?: string;
  direction?: "left-to-right" | "right-to-left";
}) {
  const isLTR = direction === "left-to-right";

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none relative w-full select-none overflow-hidden", className)}
      style={{ height: 100 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${isLTR ? "15deg" : "-15deg"}, transparent 20%, rgba(255,224,194,0.06) 45%, rgba(255,224,194,0.1) 50%, rgba(255,224,194,0.06) 55%, transparent 80%)`,
          transformOrigin: isLTR ? "left center" : "right center",
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-30px" }}
        variants={{
          hidden: { scaleX: 0, opacity: 0 },
          visible: { scaleX: 1, opacity: 1 },
        }}
        transition={{ duration: 1.0, ease: EASE_OUT_QUART }}
      />

      {/* Leading edge line */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 h-px"
        style={{
          left: isLTR ? 0 : "auto",
          right: isLTR ? "auto" : 0,
          width: "100%",
          background: `linear-gradient(${isLTR ? "90deg" : "270deg"}, transparent 0%, rgba(255,224,194,0.15) 40%, rgba(255,224,194,0.2) 50%, rgba(255,224,194,0.15) 60%, transparent 100%)`,
          transformOrigin: isLTR ? "left center" : "right center",
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { scaleX: 0, opacity: 0 },
          visible: { scaleX: 1, opacity: 1 },
        }}
        transition={{ duration: 1.2, delay: 0.15, ease: EASE_OUT_QUART }}
      />
    </div>
  );
}

/* ===========================================================================
 * 3. ParticleFieldTransition (200px)
 * Scattered particles that fade in with staggered delays
 * =========================================================================*/

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

export function ParticleFieldTransition({
  className = "",
  count = 35,
}: {
  className?: string;
  count?: number;
}) {
  const particles = Array.from({ length: count }, (_, i) => ({
    x: seededRandom(i * 7 + 1) * 100,
    y: seededRandom(i * 13 + 3) * 100,
    size: 2 + seededRandom(i * 19 + 5) * 4,
    opacity: 0.05 + seededRandom(i * 23 + 7) * 0.1,
    delay: seededRandom(i * 29 + 11) * 0.8,
  }));

  // Connect some particles with lines
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i < Math.min(count, 8); i++) {
    const a = particles[i];
    const b = particles[(i + 3) % count];
    const dist = Math.hypot(a.x - b.x, a.y - b.y);
    if (dist < 40) {
      lines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
    }
  }

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none relative w-full select-none overflow-hidden", className)}
      style={{ height: 200 }}
    >
      <motion.div
        className="absolute inset-0"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Connecting lines */}
          {lines.map((line, i) => (
            <motion.line
              key={`line-${i}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#8B6F47"
              strokeWidth="0.15"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: { pathLength: 1, opacity: 0.06 },
              }}
              transition={{ duration: 1.0, delay: 0.3 + i * 0.1, ease: EASE_OUT_QUART }}
            />
          ))}
        </svg>

        {/* Particles */}
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#8B6F47]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            variants={{
              hidden: { opacity: 0, scale: 0 },
              visible: { opacity: p.opacity, scale: 1 },
            }}
            transition={{ duration: 0.5, delay: p.delay, ease: EASE_OUT_QUART }}
          />
        ))}
      </motion.div>
    </div>
  );
}

/* ===========================================================================
 * 4. ArchitecturalBlueprintTransition (180px)
 * SVG floor plan with walls, rooms, doors, and dimension lines
 * =========================================================================*/

export function ArchitecturalBlueprintTransition({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none relative w-full select-none overflow-hidden", className)}
      style={{ height: 180 }}
    >
      <motion.svg
        viewBox="0 0 800 160"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        {/* Outer perimeter */}
        <motion.rect
          x="100" y="20" width="600" height="120"
          fill="none" stroke="#8B6F47" strokeWidth="1.5"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: { pathLength: 1, opacity: 0.1 },
          }}
          transition={{ duration: 1.5, ease: EASE_OUT_QUART }}
        />

        {/* Interior walls */}
        {[
          { x1: 300, y1: 20, x2: 300, y2: 100 },
          { x1: 500, y1: 60, x2: 500, y2: 140 },
          { x1: 300, y1: 80, x2: 500, y2: 80 },
          { x1: 100, y1: 80, x2: 250, y2: 80 },
          { x1: 550, y1: 60, x2: 700, y2: 60 },
        ].map((wall, i) => (
          <motion.line
            key={`wall-${i}`}
            x1={wall.x1} y1={wall.y1} x2={wall.x2} y2={wall.y2}
            stroke="#8B6F47" strokeWidth="1"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: { pathLength: 1, opacity: 0.08 },
            }}
            transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: EASE_OUT_QUART }}
          />
        ))}

        {/* Door arcs */}
        {[
          "M 250,80 A 20,20 0 0 1 270,60",
          "M 300,100 A 18,18 0 0 0 318,82",
          "M 500,60 A 16,16 0 0 1 516,44",
        ].map((d, i) => (
          <motion.path
            key={`door-${i}`}
            d={d}
            fill="none" stroke="#8B6F47" strokeWidth="0.5" strokeDasharray="3 2"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: { pathLength: 1, opacity: 0.1 },
            }}
            transition={{ duration: 0.6, delay: 0.8 + i * 0.12, ease: EASE_OUT_QUART }}
          />
        ))}

        {/* Dimension lines at bottom */}
        <motion.g
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 0.06 },
          }}
          transition={{ duration: 0.8, delay: 1.0, ease: EASE_OUT_QUART }}
        >
          <line x1="100" y1="150" x2="700" y2="150" stroke="#8B6F47" strokeWidth="0.5" />
          <line x1="100" y1="147" x2="100" y2="153" stroke="#8B6F47" strokeWidth="0.5" />
          <line x1="300" y1="147" x2="300" y2="153" stroke="#8B6F47" strokeWidth="0.5" />
          <line x1="500" y1="147" x2="500" y2="153" stroke="#8B6F47" strokeWidth="0.5" />
          <line x1="700" y1="147" x2="700" y2="153" stroke="#8B6F47" strokeWidth="0.5" />
        </motion.g>

        {/* Corner reference dots */}
        {[
          [100, 20], [700, 20], [100, 140], [700, 140],
        ].map(([cx, cy], i) => (
          <motion.circle
            key={`corner-${i}`}
            cx={cx} cy={cy} r="2"
            fill="#8B6F47"
            variants={{
              hidden: { opacity: 0, scale: 0 },
              visible: { opacity: 0.12, scale: 1 },
            }}
            transition={{ duration: 0.3, delay: 0.6 + i * 0.08, ease: EASE_OUT_QUART }}
          />
        ))}

        {/* Furniture hints - small rectangles */}
        {[
          { x: 140, y: 30, w: 30, h: 20 },
          { x: 350, y: 90, w: 25, h: 15 },
          { x: 560, y: 70, w: 35, h: 18 },
        ].map((f, i) => (
          <motion.rect
            key={`furn-${i}`}
            x={f.x} y={f.y} width={f.w} height={f.h}
            fill="none" stroke="#8B6F47" strokeWidth="0.3" strokeDasharray="2 2"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 0.05 },
            }}
            transition={{ duration: 0.5, delay: 1.1 + i * 0.1, ease: EASE_OUT_QUART }}
          />
        ))}
      </motion.svg>
    </div>
  );
}
