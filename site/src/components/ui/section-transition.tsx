"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
 * SectionTransition
 *
 * Minimal, premium section dividers — subtle breathing space between
 * sections. Low-opacity warm cream (#8B6F47) accents with custom easing.
 * All accent elements stay within the 10% accent rule (opacity 0.06–0.15).
 * -------------------------------------------------------------------------*/

type TransitionVariant =
  | "fade-line"
  | "architectural-horizon"
  | "glass-divider"
  | "perspective-lines"
  | "dot-grid";

interface SectionTransitionProps {
  variant?: TransitionVariant;
  className?: string;
}

const VARIANT_HEIGHTS: Record<TransitionVariant, number> = {
  "fade-line": 80,
  "architectural-horizon": 120,
  "glass-divider": 60,
  "perspective-lines": 80,
  "dot-grid": 60,
};

/* Custom easing — ease-out-quart for smooth deceleration */
const EASE_OUT_QUART: [number, number, number, number] = [
  0.165, 0.84, 0.44, 1,
];

export function SectionTransition({
  variant = "fade-line",
  className,
}: SectionTransitionProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none relative w-full select-none overflow-hidden",
        className
      )}
      style={{ height: VARIANT_HEIGHTS[variant] }}
    >
      {variant === "fade-line" && <FadeLine />}
      {variant === "architectural-horizon" && <ArchitecturalHorizon />}
      {variant === "glass-divider" && <GlassDivider />}
      {variant === "perspective-lines" && <PerspectiveLines />}
      {variant === "dot-grid" && <DotGrid />}
    </div>
  );
}

export default SectionTransition;

/* ===========================================================================
 * 1. Fade Line (80px)
 * A thin horizontal line that draws from center outward, with subtle
 * architectural tick marks. Clean and minimal.
 * =========================================================================*/

function FadeLine() {
  const tickCount = 24;
  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const pos = ((i + 1) / (tickCount + 1)) * 100;
    const isMajor = (i + 1) % 6 === 0;
    return { pos, isMajor };
  });

  return (
    <motion.div
      className="relative h-full w-full"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      {/* Central horizontal line — draws from center outward */}
      <motion.div
        className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #8B6F47 30%, #8B6F47 70%, transparent 100%)",
          transformOrigin: "center",
        }}
        variants={{
          hidden: { scaleX: 0, opacity: 0 },
          visible: { scaleX: 1, opacity: 0.1 },
        }}
        transition={{ duration: 1.2, ease: EASE_OUT_QUART }}
      />

      {/* Tick marks */}
      <svg className="absolute inset-0 h-full w-full">
        {ticks.map((tick, i) => {
          const tickH = tick.isMajor ? 10 : 5;
          return (
            <motion.line
              key={i}
              x1={`${tick.pos}%`}
              y1={`${50 - (tickH / 80) * 50}%`}
              x2={`${tick.pos}%`}
              y2={`${50 + (tickH / 80) * 50}%`}
              stroke="#8B6F47"
              strokeWidth={tick.isMajor ? "1" : "0.5"}
              variants={{
                hidden: { opacity: 0, pathLength: 0 },
                visible: {
                  opacity: tick.isMajor ? 0.12 : 0.06,
                  pathLength: 1,
                },
              }}
              transition={{
                duration: 0.5,
                delay: 0.4 + Math.abs(i - tickCount / 2) * 0.04,
                ease: EASE_OUT_QUART,
              }}
            />
          );
        })}
      </svg>
    </motion.div>
  );
}

/* ===========================================================================
 * 2. Architectural Horizon (120px) — most detailed variant
 * Simplified city skyline — clean buildings that rise from bottom on scroll,
 * with a ground line, rooftop accents, and faint window grids.
 * =========================================================================*/

const SKYLINE: Array<{
  w: number;
  h: number;
  gap: number;
  hasAntenna?: boolean;
  windowRows?: number;
}> = [
  { w: 32, h: 28, gap: 2, windowRows: 2 },
  { w: 18, h: 58, gap: 1, hasAntenna: true, windowRows: 4 },
  { w: 26, h: 42, gap: 2, windowRows: 3 },
  { w: 14, h: 80, gap: 1, hasAntenna: true, windowRows: 5 },
  { w: 30, h: 48, gap: 3, windowRows: 3 },
  { w: 20, h: 36, gap: 1, windowRows: 2 },
  { w: 16, h: 68, gap: 2, hasAntenna: true, windowRows: 4 },
  { w: 28, h: 40, gap: 1, windowRows: 3 },
  { w: 12, h: 85, gap: 2, hasAntenna: true, windowRows: 5 },
  { w: 24, h: 52, gap: 1, windowRows: 3 },
];

function ArchitecturalHorizon() {
  return (
    <motion.div
      className="relative h-full w-full"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      {/* Horizon glow — very faint radial warmth behind skyline */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: "60%",
          height: "70%",
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(255,224,194,0.06) 0%, transparent 70%)",
        }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        transition={{ duration: 1.4, ease: EASE_OUT_QUART }}
      />

      {/* Ground line */}
      <motion.div
        className="absolute bottom-0 left-0 h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, #8B6F47 30%, #8B6F47 70%, transparent 95%)",
        }}
        variants={{
          hidden: { scaleX: 0, opacity: 0 },
          visible: { scaleX: 1, opacity: 0.12 },
        }}
        transition={{ duration: 1.0, ease: EASE_OUT_QUART }}
      />

      {/* Secondary ground line — slightly above, thinner */}
      <motion.div
        className="absolute bottom-[2px] left-[10%] right-[10%] h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #8B6F47 40%, #8B6F47 60%, transparent 100%)",
        }}
        variants={{
          hidden: { scaleX: 0, opacity: 0 },
          visible: { scaleX: 1, opacity: 0.06 },
        }}
        transition={{ duration: 1.2, delay: 0.15, ease: EASE_OUT_QUART }}
      />

      {/* Buildings */}
      <div className="absolute bottom-0 left-0 flex h-full w-full items-end justify-center">
        {SKYLINE.map((b, i) => (
          <motion.div
            key={i}
            className="relative flex-shrink-0"
            style={{
              width: b.w,
              height: `${b.h}%`,
              marginRight: b.gap,
              transformOrigin: "bottom center",
            }}
            variants={{
              hidden: { scaleY: 0, opacity: 0 },
              visible: { scaleY: 1, opacity: 1 },
            }}
            transition={{
              duration: 0.8,
              delay: 0.2 + i * 0.07,
              ease: EASE_OUT_QUART,
            }}
          >
            {/* Building outline */}
            <div
              className="absolute inset-0 border border-[#8B6F47]"
              style={{ opacity: 0.08 }}
            />

            {/* Building fill */}
            <div
              className="absolute inset-0 bg-[#8B6F47]"
              style={{ opacity: 0.02 }}
            />

            {/* Window grid — tiny dots for floors */}
            {b.windowRows && b.w >= 16 && (
              <div
                className="absolute inset-x-[3px] top-[4px] bottom-[2px] flex flex-col justify-evenly"
              >
                {Array.from({ length: b.windowRows }).map((_, row) => (
                  <div
                    key={row}
                    className="flex justify-evenly"
                  >
                    {Array.from({ length: Math.max(2, Math.floor(b.w / 10)) }).map(
                      (_, col) => (
                        <div
                          key={col}
                          className="rounded-[0.5px] bg-[#8B6F47]"
                          style={{
                            width: 2,
                            height: 1.5,
                            opacity: 0.06,
                          }}
                        />
                      )
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Antenna accent on taller buildings */}
            {b.hasAntenna && (
              <div
                className="absolute left-1/2 -translate-x-1/2 bg-[#8B6F47]"
                style={{
                  width: 1,
                  height: 6,
                  top: -6,
                  opacity: 0.1,
                }}
              />
            )}

            {/* Rooftop cap line */}
            <div
              className="absolute left-0 right-0 top-0 h-px bg-[#8B6F47]"
              style={{ opacity: 0.1 }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ===========================================================================
 * 3. Glass Divider (60px)
 * A glassmorphism band with backdrop blur and a subtle gradient center line.
 * =========================================================================*/

function GlassDivider() {
  return (
    <motion.div
      className="relative h-full w-full"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
    >
      {/* Glass band */}
      <motion.div
        className="absolute left-[10%] right-[10%] top-1/2 -translate-y-1/2 rounded-full"
        style={{
          height: 20,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          background: "rgba(255, 224, 194, 0.03)",
          border: "1px solid rgba(255, 224, 194, 0.05)",
        }}
        variants={{
          hidden: { scaleX: 0, opacity: 0 },
          visible: { scaleX: 1, opacity: 1 },
        }}
        transition={{ duration: 1.0, ease: EASE_OUT_QUART }}
      />

      {/* Center gradient line */}
      <motion.div
        className="absolute left-[15%] right-[15%] top-1/2 h-px -translate-y-1/2"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,224,194,0.12) 30%, rgba(255,224,194,0.15) 50%, rgba(255,224,194,0.12) 70%, transparent 100%)",
        }}
        variants={{
          hidden: { scaleX: 0, opacity: 0 },
          visible: { scaleX: 1, opacity: 1 },
        }}
        transition={{ duration: 1.2, delay: 0.3, ease: EASE_OUT_QUART }}
      />
    </motion.div>
  );
}

/* ===========================================================================
 * 4. Perspective Lines (80px)
 * Lines radiating from a central vanishing point, creating a subtle
 * perspective/depth effect.
 * =========================================================================*/

function PerspectiveLines() {
  const lineCount = 10;
  const cx = 50;
  const cy = 50;

  const lines = Array.from({ length: lineCount }, (_, i) => {
    const angle = (i / lineCount) * 360;
    const rad = (angle * Math.PI) / 180;
    const reach = 120;
    return {
      endX: cx + Math.cos(rad) * reach,
      endY: cy + Math.sin(rad) * reach * 0.5,
      opacity: 0.06 + (i % 3) * 0.02,
    };
  });

  return (
    <motion.div
      className="relative h-full w-full"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {lines.map((line, i) => (
          <motion.line
            key={i}
            x1={cx}
            y1={cy}
            x2={line.endX}
            y2={line.endY}
            stroke="#8B6F47"
            strokeWidth="0.3"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: { pathLength: 1, opacity: line.opacity },
            }}
            transition={{
              duration: 1.0,
              delay: 0.1 + i * 0.06,
              ease: EASE_OUT_QUART,
            }}
          />
        ))}

        {/* Central dot */}
        <motion.circle
          cx={cx}
          cy={cy}
          r="0.6"
          fill="#8B6F47"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 0.1 },
          }}
          transition={{ duration: 0.4, delay: 0.3, ease: EASE_OUT_QUART }}
        />
      </svg>
    </motion.div>
  );
}

/* ===========================================================================
 * 5. Dot Grid (60px)
 * A subtle 3-row x 20-column grid of small dots that fade in with a wave
 * pattern on scroll. Very minimal.
 * =========================================================================*/

function DotGrid() {
  const rows = 3;
  const cols = 20;

  return (
    <motion.div
      className="relative h-full w-full"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20px" }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="grid gap-x-3 gap-y-2"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
          }}
        >
          {Array.from({ length: rows * cols }).map((_, idx) => {
            const col = idx % cols;
            const row = Math.floor(idx / cols);
            /* Wave delay: radiates from center */
            const distFromCenter =
              Math.abs(col - cols / 2) + Math.abs(row - rows / 2);

            return (
              <motion.div
                key={idx}
                className="rounded-full bg-[#8B6F47]"
                style={{ width: 3, height: 3 }}
                variants={{
                  hidden: { opacity: 0, scale: 0 },
                  visible: { opacity: 0.08, scale: 1 },
                }}
                transition={{
                  duration: 0.4,
                  delay: 0.2 + distFromCenter * 0.04,
                  ease: EASE_OUT_QUART,
                }}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
