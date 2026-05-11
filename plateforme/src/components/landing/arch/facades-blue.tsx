"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const enterDraw = (delay = 0, duration = 1.8) => ({
  initial: { strokeDashoffset: 1 },
  whileInView: { strokeDashoffset: 0 },
  viewport: { once: true, amount: 0.15 } as const,
  transition: { duration, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const MAIN = "rgba(30,157,241,0.5)";
const FAINT = "rgba(30,157,241,0.28)";
const ACCENT = "rgba(30,157,241,0.78)";
const TEXT = "rgba(30,157,241,0.45)";
const TEXT_FAINT = "rgba(30,157,241,0.32)";

/* =========================================================================
 *  Component 1 — ArchTallFacade
 *  Tall brutalist facade (Unite d'Habitation spirit)
 * ========================================================================= */

export function ArchTallFacade({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  // Building geometry
  const baseY = 720; // ground line
  const topY = 80; // building top (under roof crown)
  const leftX = 60;
  const rightX = 180;
  const floors = 16;
  const floorHeight = (baseY - topY) / floors; // ~40

  return (
    <div ref={ref} className={className}>
      <motion.svg
        viewBox="0 0 220 820"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        style={{ overflow: "visible", y }}
      >
        {/* ============== CONSTRUCTION GRID 10x10 ============== */}
        <g stroke={FAINT} strokeWidth={0.25} opacity={0.55}>
          {Array.from({ length: 23 }).map((_, i) => (
            <motion.path
              key={`gv-${i}`}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(0.02 * i, 1.2)}
              d={`M ${i * 10} 0 L ${i * 10} 820`}
            />
          ))}
          {Array.from({ length: 83 }).map((_, i) => (
            <motion.path
              key={`gh-${i}`}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(0.01 * i, 1.2)}
              d={`M 0 ${i * 10} L 220 ${i * 10}`}
            />
          ))}
        </g>

        {/* ============== CENTRAL AXIS (extends past edges) ============== */}
        <motion.path
          stroke={ACCENT}
          strokeWidth={0.5}
          strokeDasharray="4 3 1 3"
          pathLength={1}
          {...enterDraw(0.1, 2.2)}
          d="M 120 -20 L 120 840"
        />
        {/* axis crosshair top */}
        <motion.path
          stroke={ACCENT}
          strokeWidth={0.5}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.3, 0.8)}
          d="M 110 -10 L 130 -10"
        />
        <motion.path
          stroke={ACCENT}
          strokeWidth={0.5}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.3, 0.8)}
          d="M 120 -20 L 120 0"
        />
        {/* axis crosshair bottom */}
        <motion.path
          stroke={ACCENT}
          strokeWidth={0.5}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.3, 0.8)}
          d="M 110 830 L 130 830"
        />
        <text x={114} y={-14} fontSize="6" fill={TEXT} fontFamily="monospace">
          AX-A
        </text>
        <text x={114} y={838} fontSize="6" fill={TEXT} fontFamily="monospace">
          AX-A
        </text>

        {/* ============== GROUND LINE ============== */}
        <motion.path
          stroke={ACCENT}
          strokeWidth={0.8}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.2, 1.4)}
          d="M 0 720 L 220 720"
        />
        <text x={2} y={717} fontSize="5" fill={TEXT} fontFamily="monospace">
          ±0.00
        </text>

        {/* ============== FOUNDATION HATCHING (45deg below ground) ============== */}
        {Array.from({ length: 28 }).map((_, i) => {
          const x1 = -20 + i * 10;
          const x2 = x1 + 60;
          return (
            <motion.path
              key={`hatch-${i}`}
              stroke={FAINT}
              strokeWidth={0.4}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(0.5 + i * 0.02, 0.9)}
              d={`M ${x1} 720 L ${x2} 780`}
            />
          );
        })}
        {/* foundation bottom line */}
        <motion.path
          stroke={MAIN}
          strokeWidth={0.6}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.7, 1.0)}
          d="M 0 780 L 220 780"
        />

        {/* ============== 4 PILOTIS (concrete columns) ============== */}
        {[78, 102, 138, 162].map((cx, i) => (
          <g key={`piloti-${i}`}>
            <motion.path
              stroke={MAIN}
              strokeWidth={0.7}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(0.4 + i * 0.05, 1.0)}
              d={`M ${cx - 4} 680 L ${cx - 4} 720`}
            />
            <motion.path
              stroke={MAIN}
              strokeWidth={0.7}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(0.45 + i * 0.05, 1.0)}
              d={`M ${cx + 4} 680 L ${cx + 4} 720`}
            />
            <motion.path
              stroke={MAIN}
              strokeWidth={0.5}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(0.5 + i * 0.05, 0.8)}
              d={`M ${cx - 4} 680 L ${cx + 4} 680`}
            />
            {/* shadow tick / foundation marks under each piloti */}
            <motion.path
              stroke={ACCENT}
              strokeWidth={0.5}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(0.6 + i * 0.05, 0.6)}
              d={`M ${cx - 6} 724 L ${cx + 6} 724`}
            />
            <motion.path
              stroke={FAINT}
              strokeWidth={0.4}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(0.65 + i * 0.05, 0.6)}
              d={`M ${cx - 6} 728 L ${cx + 6} 728`}
            />
            <motion.path
              stroke={FAINT}
              strokeWidth={0.4}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(0.7 + i * 0.05, 0.6)}
              d={`M ${cx - 6} 732 L ${cx + 6} 732`}
            />
          </g>
        ))}

        {/* ============== BUILDING ENVELOPE ============== */}
        <motion.path
          stroke={ACCENT}
          strokeWidth={0.9}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.3, 1.6)}
          d={`M ${leftX} ${topY} L ${leftX} ${baseY - floorHeight}`}
        />
        <motion.path
          stroke={ACCENT}
          strokeWidth={0.9}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.3, 1.6)}
          d={`M ${rightX} ${topY} L ${rightX} ${baseY - floorHeight}`}
        />
        <motion.path
          stroke={ACCENT}
          strokeWidth={0.9}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.3, 1.0)}
          d={`M ${leftX} ${topY} L ${rightX} ${topY}`}
        />
        {/* base slab (above pilotis) */}
        <motion.path
          stroke={ACCENT}
          strokeWidth={0.9}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.3, 1.0)}
          d={`M ${leftX} ${baseY - floorHeight} L ${rightX} ${baseY - floorHeight}`}
        />

        {/* ============== 16 FLOORS ============== */}
        {Array.from({ length: floors }).map((_, i) => {
          const fTop = topY + i * floorHeight;
          const fBot = fTop + floorHeight;
          const slabY = fBot;
          const winTop = fTop + 6;
          const winBot = fBot - 6;
          const winLeft = leftX + 4;
          const winRight = rightX - 4;
          const winWidth = winRight - winLeft;
          const mullionStep = winWidth / 8; // 7 internal mullions
          const isBalcony = (floors - i) % 3 === 0;
          const floorNumber = floors - i;
          const heightMeters = (floorNumber * 3.0 + 0.5).toFixed(2);
          const flicker =
            i === 4 || i === 11
              ? {
                  animate: { opacity: [0.35, 0.85, 0.4, 0.7, 0.35] },
                  transition: {
                    duration: 4 + i * 0.3,
                    repeat: Infinity,
                    repeatType: "loop" as const,
                  },
                }
              : {};
          return (
            <g key={`floor-${i}`}>
              {/* slab line */}
              <motion.path
                stroke={MAIN}
                strokeWidth={0.7}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(0.5 + i * 0.05, 1.0)}
                d={`M ${leftX} ${slabY} L ${rightX} ${slabY}`}
              />
              {/* secondary slab */}
              <motion.path
                stroke={FAINT}
                strokeWidth={0.4}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(0.55 + i * 0.05, 0.8)}
                d={`M ${leftX} ${slabY - 2} L ${rightX} ${slabY - 2}`}
              />
              {/* deep recessed strip window outline */}
              <motion.path
                stroke={MAIN}
                strokeWidth={0.5}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(0.6 + i * 0.05, 1.0)}
                d={`M ${winLeft} ${winTop} L ${winRight} ${winTop} L ${winRight} ${winBot} L ${winLeft} ${winBot} Z`}
                {...flicker}
              />
              {/* 7 internal mullions */}
              {Array.from({ length: 7 }).map((_, m) => (
                <motion.path
                  key={`mul-${i}-${m}`}
                  stroke={FAINT}
                  strokeWidth={0.4}
                  pathLength={1}
                  strokeDasharray={1}
                  {...enterDraw(0.65 + i * 0.05 + m * 0.01, 0.8)}
                  d={`M ${winLeft + (m + 1) * mullionStep} ${winTop} L ${
                    winLeft + (m + 1) * mullionStep
                  } ${winBot}`}
                />
              ))}
              {/* brise-soleil bands (2 horizontal sub-lines) */}
              <motion.path
                stroke={ACCENT}
                strokeWidth={0.4}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(0.7 + i * 0.05, 0.8)}
                d={`M ${winLeft} ${winTop + (winBot - winTop) / 3} L ${winRight} ${
                  winTop + (winBot - winTop) / 3
                }`}
              />
              <motion.path
                stroke={ACCENT}
                strokeWidth={0.4}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(0.72 + i * 0.05, 0.8)}
                d={`M ${winLeft} ${winTop + ((winBot - winTop) * 2) / 3} L ${winRight} ${
                  winTop + ((winBot - winTop) * 2) / 3
                }`}
              />
              {/* balcony rail every 3rd floor */}
              {isBalcony && (
                <g>
                  <motion.path
                    stroke={MAIN}
                    strokeWidth={0.5}
                    pathLength={1}
                    strokeDasharray={1}
                    {...enterDraw(0.8 + i * 0.05, 0.9)}
                    d={`M ${leftX - 3} ${fBot - 4} L ${rightX + 3} ${fBot - 4}`}
                  />
                  <motion.path
                    stroke={FAINT}
                    strokeWidth={0.4}
                    pathLength={1}
                    strokeDasharray={1}
                    {...enterDraw(0.82 + i * 0.05, 0.9)}
                    d={`M ${leftX - 3} ${fBot - 1} L ${rightX + 3} ${fBot - 1}`}
                  />
                  {Array.from({ length: 13 }).map((_, t) => (
                    <motion.path
                      key={`bal-${i}-${t}`}
                      stroke={FAINT}
                      strokeWidth={0.35}
                      pathLength={1}
                      strokeDasharray={1}
                      {...enterDraw(0.85 + i * 0.05 + t * 0.005, 0.6)}
                      d={`M ${leftX - 3 + t * 10} ${fBot - 4} L ${leftX - 3 + t * 10} ${fBot - 1}`}
                    />
                  ))}
                </g>
              )}
              {/* floor number on LEFT */}
              <text
                x={leftX - 22}
                y={fTop + floorHeight / 2 + 2}
                fontSize="5"
                fill={TEXT}
                fontFamily="monospace"
              >
                R+{floorNumber}
              </text>
              {/* dimension callout LEFT: tick + arrow + height */}
              <motion.path
                stroke={FAINT}
                strokeWidth={0.4}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(0.9 + i * 0.04, 0.7)}
                d={`M ${leftX - 10} ${slabY} L ${leftX - 2} ${slabY}`}
              />
              <motion.path
                stroke={FAINT}
                strokeWidth={0.4}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(0.92 + i * 0.04, 0.5)}
                d={`M ${leftX - 4} ${slabY - 1.5} L ${leftX - 2} ${slabY} L ${leftX - 4} ${slabY + 1.5}`}
              />
              <text
                x={leftX - 38}
                y={slabY + 2}
                fontSize="5"
                fill={TEXT_FAINT}
                fontFamily="monospace"
              >
                +{heightMeters}
              </text>
              {/* RIGHT side: section continuation arrows */}
              <motion.path
                stroke={FAINT}
                strokeWidth={0.4}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(0.95 + i * 0.04, 0.6)}
                d={`M ${rightX + 2} ${slabY} L ${rightX + 14} ${slabY}`}
              />
              <motion.path
                stroke={FAINT}
                strokeWidth={0.4}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(0.97 + i * 0.04, 0.4)}
                d={`M ${rightX + 12} ${slabY - 1.5} L ${rightX + 14} ${slabY} L ${rightX + 12} ${slabY + 1.5}`}
              />
            </g>
          );
        })}

        {/* ============== ROOF CROWN + PARAPET ============== */}
        <motion.path
          stroke={ACCENT}
          strokeWidth={0.7}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.4, 1.0)}
          d={`M ${leftX - 2} ${topY - 4} L ${rightX + 2} ${topY - 4}`}
        />
        <motion.path
          stroke={MAIN}
          strokeWidth={0.5}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.45, 0.9)}
          d={`M ${leftX - 2} ${topY - 8} L ${rightX + 2} ${topY - 8}`}
        />
        <motion.path
          stroke={FAINT}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.5, 0.9)}
          d={`M ${leftX - 2} ${topY - 4} L ${leftX - 2} ${topY - 8}`}
        />
        <motion.path
          stroke={FAINT}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.5, 0.9)}
          d={`M ${rightX + 2} ${topY - 4} L ${rightX + 2} ${topY - 8}`}
        />
        {/* parapet ticks */}
        {Array.from({ length: 13 }).map((_, t) => (
          <motion.path
            key={`par-${t}`}
            stroke={FAINT}
            strokeWidth={0.35}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(0.55 + t * 0.02, 0.5)}
            d={`M ${leftX - 2 + t * 10} ${topY - 8} L ${leftX - 2 + t * 10} ${topY - 4}`}
          />
        ))}
        {/* drain spouts both sides */}
        <motion.path
          stroke={MAIN}
          strokeWidth={0.5}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.6, 0.7)}
          d={`M ${leftX - 4} ${topY - 4} L ${leftX - 4} ${topY + 6} L ${leftX - 7} ${topY + 6}`}
        />
        <motion.path
          stroke={MAIN}
          strokeWidth={0.5}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.6, 0.7)}
          d={`M ${rightX + 4} ${topY - 4} L ${rightX + 4} ${topY + 6} L ${rightX + 7} ${topY + 6}`}
        />

        {/* ============== ROOFTOP PAVILION ============== */}
        <motion.path
          stroke={MAIN}
          strokeWidth={0.6}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.5, 1.0)}
          d={`M 100 ${topY - 8} L 100 ${topY - 30} L 140 ${topY - 30} L 140 ${topY - 8}`}
        />
        <motion.path
          stroke={FAINT}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.55, 0.8)}
          d={`M 104 ${topY - 12} L 136 ${topY - 12}`}
        />
        <motion.path
          stroke={FAINT}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.6, 0.8)}
          d={`M 110 ${topY - 30} L 110 ${topY - 12}`}
        />
        <motion.path
          stroke={FAINT}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.62, 0.8)}
          d={`M 120 ${topY - 30} L 120 ${topY - 12}`}
        />
        <motion.path
          stroke={FAINT}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.64, 0.8)}
          d={`M 130 ${topY - 30} L 130 ${topY - 12}`}
        />
        {/* chimney */}
        <motion.path
          stroke={ACCENT}
          strokeWidth={0.6}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.7, 0.8)}
          d={`M 108 ${topY - 30} L 108 ${topY - 44} L 116 ${topY - 44} L 116 ${topY - 30}`}
        />
        <motion.path
          stroke={MAIN}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.75, 0.6)}
          d={`M 106 ${topY - 44} L 118 ${topY - 44}`}
        />
        {/* antenna */}
        <motion.path
          stroke={ACCENT}
          strokeWidth={0.5}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.8, 1.0)}
          d={`M 132 ${topY - 30} L 132 ${topY - 56}`}
        />
        <motion.path
          stroke={FAINT}
          strokeWidth={0.35}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.85, 0.6)}
          d={`M 128 ${topY - 50} L 136 ${topY - 50}`}
        />
        <motion.path
          stroke={FAINT}
          strokeWidth={0.35}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.87, 0.6)}
          d={`M 130 ${topY - 54} L 134 ${topY - 54}`}
        />

        {/* ============== "A" SECTION REF (circle near top) ============== */}
        <motion.circle
          cx={42}
          cy={70}
          r={6}
          stroke={ACCENT}
          strokeWidth={0.6}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.9, 0.8)}
        />
        <text x={39.2} y={72.4} fontSize="6.5" fill={ACCENT} fontFamily="monospace">
          A
        </text>
        <motion.path
          stroke={FAINT}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.95, 0.6)}
          d="M 48 70 L 58 70"
        />

        {/* ============== TOTAL HEIGHT DIM (left edge, far) ============== */}
        <motion.path
          stroke={MAIN}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.0, 1.4)}
          d={`M 12 ${topY} L 12 ${baseY}`}
        />
        <motion.path
          stroke={MAIN}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.05, 0.4)}
          d={`M 9 ${topY + 2} L 12 ${topY} L 15 ${topY + 2}`}
        />
        <motion.path
          stroke={MAIN}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.05, 0.4)}
          d={`M 9 ${baseY - 2} L 12 ${baseY} L 15 ${baseY - 2}`}
        />
        <text x={2} y={400} fontSize="6" fill={TEXT} fontFamily="monospace" transform="rotate(-90 6 400)">
          H = 48.50 m
        </text>

        {/* ============== ENTRY DETAIL AT BASE ============== */}
        <motion.path
          stroke={MAIN}
          strokeWidth={0.5}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.3, 1.0)}
          d="M 110 720 L 110 700 L 130 700 L 130 720"
        />
        <motion.path
          stroke={FAINT}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.35, 0.8)}
          d="M 120 700 L 120 720"
        />
        <text x={114} y={714} fontSize="4" fill={TEXT_FAINT} fontFamily="monospace">
          ENTREE
        </text>

        {/* corner crosshairs (drawing fiducials) */}
        <motion.path
          stroke={ACCENT}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.05, 0.4)}
          d="M 0 30 L 12 30 M 6 24 L 6 36"
        />
        <motion.path
          stroke={ACCENT}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.05, 0.4)}
          d="M 208 30 L 220 30 M 214 24 L 214 36"
        />
        <motion.path
          stroke={ACCENT}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.05, 0.4)}
          d="M 0 790 L 12 790 M 6 784 L 6 796"
        />
        <motion.path
          stroke={ACCENT}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.05, 0.4)}
          d="M 208 790 L 220 790 M 214 784 L 214 796"
        />

        {/* drawing label */}
        <text x={2} y={812} fontSize="5" fill={TEXT} fontFamily="monospace">
          FACADE-EST · ECH 1:200
        </text>
        <text x={155} y={812} fontSize="5" fill={TEXT_FAINT} fontFamily="monospace">
          PL-001
        </text>
      </motion.svg>
    </div>
  );
}

/* =========================================================================
 *  Component 2 — ArchCantilever
 *  Stacked cantilever volumes (Fallingwater meets MVRDV)
 * ========================================================================= */

export function ArchCantilever({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  // 4 stacked volumes — each shifted L/R
  // y axis: 0 top, 620 bottom
  const groundY = 540;
  const volumes = [
    { x: 60, w: 130, top: 410, bot: 540 }, // ground volume (above pilotis)
    { x: 40, w: 150, top: 300, bot: 410 }, // shifted left
    { x: 80, w: 130, top: 200, bot: 300 }, // shifted right
    { x: 50, w: 150, top: 100, bot: 200 }, // shifted left again
  ];

  return (
    <div ref={ref} className={className}>
      <motion.svg
        viewBox="0 0 240 620"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        style={{ overflow: "visible", y, width: "100%", height: "100%" }}
      >
        {/* ============== CONSTRUCTION GRID ============== */}
        <g stroke={FAINT} strokeWidth={0.25} opacity={0.5}>
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.path
              key={`cgv-${i}`}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(0.02 * i, 1.2)}
              d={`M ${i * 10} 0 L ${i * 10} 620`}
            />
          ))}
          {Array.from({ length: 63 }).map((_, i) => (
            <motion.path
              key={`cgh-${i}`}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(0.01 * i, 1.2)}
              d={`M 0 ${i * 10} L 240 ${i * 10}`}
            />
          ))}
        </g>

        {/* ============== AXIS GRID ============== */}
        <motion.path
          stroke={ACCENT}
          strokeWidth={0.4}
          strokeDasharray="3 2 1 2"
          pathLength={1}
          {...enterDraw(0.1, 1.6)}
          d="M 120 -10 L 120 630"
        />
        <motion.path
          stroke={FAINT}
          strokeWidth={0.4}
          strokeDasharray="3 2 1 2"
          pathLength={1}
          {...enterDraw(0.12, 1.4)}
          d="M -10 320 L 250 320"
        />

        {/* ============== GROUND LINE ============== */}
        <motion.path
          stroke={ACCENT}
          strokeWidth={0.7}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.2, 1.4)}
          d="M 0 540 L 240 540"
        />
        <text x={2} y={537} fontSize="5" fill={TEXT} fontFamily="monospace">
          ±0.00
        </text>

        {/* ============== FOUNDATION HATCHING ============== */}
        {Array.from({ length: 26 }).map((_, i) => {
          const x1 = -20 + i * 10;
          const x2 = x1 + 50;
          return (
            <motion.path
              key={`chatch-${i}`}
              stroke={FAINT}
              strokeWidth={0.4}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(0.4 + i * 0.02, 0.9)}
              d={`M ${x1} 540 L ${x2} 590`}
            />
          );
        })}
        <motion.path
          stroke={MAIN}
          strokeWidth={0.5}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.6, 1.0)}
          d="M 0 590 L 240 590"
        />

        {/* ============== FOOTPRINT HINT (dotted rect below ground) ============== */}
        <motion.path
          stroke={FAINT}
          strokeWidth={0.4}
          strokeDasharray="2 2"
          pathLength={1}
          {...enterDraw(0.7, 1.2)}
          d="M 50 600 L 200 600 L 200 612 L 50 612 Z"
        />
        <text x={94} y={609} fontSize="4" fill={TEXT_FAINT} fontFamily="monospace">
          EMPRISE AU SOL
        </text>

        {/* ============== 4 PILOTIS at base ============== */}
        {[80, 110, 140, 170].map((cx, i) => (
          <g key={`cp-${i}`}>
            <motion.path
              stroke={MAIN}
              strokeWidth={0.7}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(0.3 + i * 0.05, 1.0)}
              d={`M ${cx - 3} 510 L ${cx - 3} 540`}
            />
            <motion.path
              stroke={MAIN}
              strokeWidth={0.7}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(0.32 + i * 0.05, 1.0)}
              d={`M ${cx + 3} 510 L ${cx + 3} 540`}
            />
            <motion.path
              stroke={ACCENT}
              strokeWidth={0.5}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(0.4 + i * 0.05, 0.5)}
              d={`M ${cx - 5} 543 L ${cx + 5} 543`}
            />
            <motion.path
              stroke={FAINT}
              strokeWidth={0.4}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(0.42 + i * 0.05, 0.5)}
              d={`M ${cx - 5} 547 L ${cx + 5} 547`}
            />
          </g>
        ))}

        {/* ============== 4 VOLUMES ============== */}
        {volumes.map((v, idx) => {
          const isTopFlicker = idx === 3;
          const mullionsV = 6;
          const mullionsH = 4;
          const stepX = v.w / (mullionsV + 1);
          const stepY = (v.bot - v.top) / (mullionsH + 1);
          // determine cantilever overhang relative to volume below
          const below = idx > 0 ? volumes[idx - 1] : null;
          const overhangs: Array<{ from: number; to: number }> = [];
          if (below) {
            // left overhang
            if (v.x < below.x) overhangs.push({ from: v.x, to: below.x });
            // right overhang
            if (v.x + v.w > below.x + below.w)
              overhangs.push({ from: below.x + below.w, to: v.x + v.w });
          } else {
            // ground volume — overhangs vs pilotis cluster
            overhangs.push({ from: v.x, to: 78 });
            overhangs.push({ from: 172, to: v.x + v.w });
          }
          return (
            <g key={`vol-${idx}`}>
              {/* envelope */}
              <motion.path
                stroke={ACCENT}
                strokeWidth={0.8}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(0.4 + idx * 0.1, 1.4)}
                d={`M ${v.x} ${v.top} L ${v.x + v.w} ${v.top} L ${v.x + v.w} ${v.bot} L ${v.x} ${v.bot} Z`}
              />
              {/* slab top emphasis */}
              <motion.path
                stroke={MAIN}
                strokeWidth={0.5}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(0.45 + idx * 0.1, 1.0)}
                d={`M ${v.x} ${v.top + 3} L ${v.x + v.w} ${v.top + 3}`}
              />
              {/* slab bottom emphasis */}
              <motion.path
                stroke={MAIN}
                strokeWidth={0.5}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(0.47 + idx * 0.1, 1.0)}
                d={`M ${v.x} ${v.bot - 3} L ${v.x + v.w} ${v.bot - 3}`}
              />
              {/* 6 vertical mullions */}
              {Array.from({ length: mullionsV }).map((_, m) => {
                const mx = v.x + (m + 1) * stepX;
                const flicker =
                  isTopFlicker && m === 2
                    ? {
                        animate: { opacity: [0.3, 0.85, 0.4, 0.7, 0.3] },
                        transition: {
                          duration: 4.5,
                          repeat: Infinity,
                          repeatType: "loop" as const,
                        },
                      }
                    : {};
                return (
                  <motion.path
                    key={`vm-${idx}-${m}`}
                    stroke={FAINT}
                    strokeWidth={0.4}
                    pathLength={1}
                    strokeDasharray={1}
                    {...enterDraw(0.5 + idx * 0.1 + m * 0.02, 0.8)}
                    d={`M ${mx} ${v.top + 3} L ${mx} ${v.bot - 3}`}
                    {...flicker}
                  />
                );
              })}
              {/* 4 horizontal mullions */}
              {Array.from({ length: mullionsH }).map((_, m) => {
                const my = v.top + (m + 1) * stepY;
                return (
                  <motion.path
                    key={`hm-${idx}-${m}`}
                    stroke={FAINT}
                    strokeWidth={0.4}
                    pathLength={1}
                    strokeDasharray={1}
                    {...enterDraw(0.55 + idx * 0.1 + m * 0.02, 0.8)}
                    d={`M ${v.x + 1} ${my} L ${v.x + v.w - 1} ${my}`}
                  />
                );
              })}
              {/* underside diagonal hatching (steel beam suggestion) */}
              {Array.from({ length: 14 }).map((_, h) => (
                <motion.path
                  key={`und-${idx}-${h}`}
                  stroke={FAINT}
                  strokeWidth={0.3}
                  pathLength={1}
                  strokeDasharray={1}
                  {...enterDraw(0.6 + idx * 0.08 + h * 0.01, 0.6)}
                  d={`M ${v.x + h * 12} ${v.bot - 1} L ${v.x + h * 12 + 6} ${v.bot + 5}`}
                />
              ))}
              {/* visible structural ribs under each cantilever overhang */}
              {overhangs.map((o, oi) => {
                const span = o.to - o.from;
                const ribCount = Math.max(3, Math.min(4, Math.floor(span / 6)));
                return Array.from({ length: ribCount }).map((_, r) => {
                  const rx = o.from + ((r + 1) * span) / (ribCount + 1);
                  return (
                    <motion.path
                      key={`rib-${idx}-${oi}-${r}`}
                      stroke={ACCENT}
                      strokeWidth={0.5}
                      pathLength={1}
                      strokeDasharray={1}
                      {...enterDraw(0.7 + idx * 0.08 + r * 0.05, 0.7)}
                      d={`M ${rx} ${v.bot} L ${rx} ${v.bot + 7}`}
                    />
                  );
                });
              })}
              {/* overhang line */}
              {overhangs.map((o, oi) => (
                <motion.path
                  key={`ohl-${idx}-${oi}`}
                  stroke={MAIN}
                  strokeWidth={0.5}
                  pathLength={1}
                  strokeDasharray={1}
                  {...enterDraw(0.75 + idx * 0.08, 0.7)}
                  d={`M ${o.from} ${v.bot + 7} L ${o.to} ${v.bot + 7}`}
                />
              ))}
              {/* volume label */}
              <text
                x={v.x + 2}
                y={v.top + 8}
                fontSize="5"
                fill={TEXT_FAINT}
                fontFamily="monospace"
              >
                V{idx + 1}
              </text>
            </g>
          );
        })}

        {/* ============== ROOF: parapet + mechanical pavilion ============== */}
        {(() => {
          const top = volumes[3];
          return (
            <g>
              {/* parapet */}
              <motion.path
                stroke={ACCENT}
                strokeWidth={0.6}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(0.5, 1.0)}
                d={`M ${top.x - 2} ${top.top - 4} L ${top.x + top.w + 2} ${top.top - 4}`}
              />
              <motion.path
                stroke={MAIN}
                strokeWidth={0.4}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(0.55, 1.0)}
                d={`M ${top.x - 2} ${top.top - 8} L ${top.x + top.w + 2} ${top.top - 8}`}
              />
              <motion.path
                stroke={FAINT}
                strokeWidth={0.4}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(0.6, 0.8)}
                d={`M ${top.x - 2} ${top.top - 4} L ${top.x - 2} ${top.top - 8}`}
              />
              <motion.path
                stroke={FAINT}
                strokeWidth={0.4}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(0.6, 0.8)}
                d={`M ${top.x + top.w + 2} ${top.top - 4} L ${top.x + top.w + 2} ${top.top - 8}`}
              />
              {/* parapet ticks */}
              {Array.from({ length: 14 }).map((_, t) => (
                <motion.path
                  key={`cpar-${t}`}
                  stroke={FAINT}
                  strokeWidth={0.3}
                  pathLength={1}
                  strokeDasharray={1}
                  {...enterDraw(0.65 + t * 0.02, 0.5)}
                  d={`M ${top.x + t * 11} ${top.top - 8} L ${top.x + t * 11} ${top.top - 4}`}
                />
              ))}
              {/* mechanical pavilion */}
              <motion.path
                stroke={MAIN}
                strokeWidth={0.6}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(0.75, 1.0)}
                d={`M ${top.x + 30} ${top.top - 8} L ${top.x + 30} ${top.top - 24} L ${top.x + 70} ${top.top - 24} L ${top.x + 70} ${top.top - 8}`}
              />
              <motion.path
                stroke={FAINT}
                strokeWidth={0.4}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(0.78, 0.8)}
                d={`M ${top.x + 36} ${top.top - 12} L ${top.x + 64} ${top.top - 12}`}
              />
              <motion.path
                stroke={FAINT}
                strokeWidth={0.4}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(0.8, 0.8)}
                d={`M ${top.x + 45} ${top.top - 24} L ${top.x + 45} ${top.top - 12}`}
              />
              <motion.path
                stroke={FAINT}
                strokeWidth={0.4}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(0.82, 0.8)}
                d={`M ${top.x + 55} ${top.top - 24} L ${top.x + 55} ${top.top - 12}`}
              />
              {/* small antenna */}
              <motion.path
                stroke={ACCENT}
                strokeWidth={0.5}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(0.9, 0.8)}
                d={`M ${top.x + 60} ${top.top - 24} L ${top.x + 60} ${top.top - 38}`}
              />
              <motion.path
                stroke={FAINT}
                strokeWidth={0.35}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(0.95, 0.5)}
                d={`M ${top.x + 56} ${top.top - 34} L ${top.x + 64} ${top.top - 34}`}
              />
            </g>
          );
        })()}

        {/* ============== LATERAL DIM LEFT (4 brackets/floors) ============== */}
        {[
          { y: 540, label: "+0.00" },
          { y: 410, label: "+3.50" },
          { y: 300, label: "+7.20" },
          { y: 200, label: "+11.10" },
          { y: 100, label: "+15.50" },
        ].map((d, i) => (
          <g key={`ldim-${i}`}>
            <motion.path
              stroke={MAIN}
              strokeWidth={0.4}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(1.0 + i * 0.06, 0.7)}
              d={`M 22 ${d.y} L 30 ${d.y}`}
            />
            <motion.path
              stroke={MAIN}
              strokeWidth={0.4}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(1.02 + i * 0.06, 0.4)}
              d={`M 27 ${d.y - 1.5} L 30 ${d.y} L 27 ${d.y + 1.5}`}
            />
            <text x={2} y={d.y + 2} fontSize="5" fill={TEXT} fontFamily="monospace">
              {d.label}
            </text>
            {/* bracket */}
            <motion.path
              stroke={FAINT}
              strokeWidth={0.4}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(1.04 + i * 0.06, 0.6)}
              d={`M 30 ${d.y - 3} L 22 ${d.y - 3} L 22 ${d.y + 3} L 30 ${d.y + 3}`}
            />
          </g>
        ))}
        {/* vertical dim line LEFT */}
        <motion.path
          stroke={MAIN}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.1, 1.4)}
          d="M 30 100 L 30 540"
        />

        {/* ============== LATERAL DIM RIGHT — Total height ============== */}
        <motion.path
          stroke={MAIN}
          strokeWidth={0.5}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.2, 1.6)}
          d="M 220 100 L 220 540"
        />
        <motion.path
          stroke={MAIN}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.25, 0.4)}
          d="M 217 102 L 220 100 L 223 102"
        />
        <motion.path
          stroke={MAIN}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.25, 0.4)}
          d="M 217 538 L 220 540 L 223 538"
        />
        <motion.path
          stroke={FAINT}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.3, 0.7)}
          d="M 215 100 L 225 100"
        />
        <motion.path
          stroke={FAINT}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.3, 0.7)}
          d="M 215 540 L 225 540"
        />
        <text
          x={228}
          y={324}
          fontSize="6"
          fill={TEXT}
          fontFamily="monospace"
          transform="rotate(-90 228 324)"
        >
          H = 18.20 m
        </text>

        {/* ============== "B" SECTION REF (circle near top) ============== */}
        <motion.circle
          cx={20}
          cy={50}
          r={6}
          stroke={ACCENT}
          strokeWidth={0.6}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.9, 0.8)}
        />
        <text x={17.4} y={52.4} fontSize="6.5" fill={ACCENT} fontFamily="monospace">
          B
        </text>
        <motion.path
          stroke={FAINT}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.95, 0.6)}
          d="M 26 50 L 36 50"
        />

        {/* fiducial corners */}
        <motion.path
          stroke={ACCENT}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.05, 0.4)}
          d="M 0 16 L 10 16 M 5 11 L 5 21"
        />
        <motion.path
          stroke={ACCENT}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.05, 0.4)}
          d="M 230 16 L 240 16 M 235 11 L 235 21"
        />
        <motion.path
          stroke={ACCENT}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.05, 0.4)}
          d="M 0 600 L 10 600 M 5 595 L 5 605"
        />
        <motion.path
          stroke={ACCENT}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.05, 0.4)}
          d="M 230 600 L 240 600 M 235 595 L 235 605"
        />

        {/* drawing label */}
        <text x={2} y={617} fontSize="5" fill={TEXT} fontFamily="monospace">
          COUPE-VOLUMES · ECH 1:150
        </text>
        <text x={180} y={617} fontSize="5" fill={TEXT_FAINT} fontFamily="monospace">
          PL-002
        </text>
      </motion.svg>
    </div>
  );
}
