"use client";

import { motion } from "framer-motion";

const EASE = [0.165, 0.84, 0.44, 1] as const;
const STROKE = "#ffe0c2";

/* ===========================================================================
 * 1. LuxuryVillaIllustration (~400px)
 * Modern villa side-elevation with pool, landscaping, blueprint grid
 * =========================================================================*/

export function LuxuryVillaIllustration({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full ${className}`} aria-hidden="true">
      <motion.svg
        viewBox="0 0 900 350"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {/* Blueprint grid */}
        {Array.from({ length: 19 }).map((_, i) => (
          <motion.line
            key={`vg-${i}`}
            x1={i * 50} y1="0" x2={i * 50} y2="350"
            stroke={STROKE} strokeWidth="0.3"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.03 } }}
            transition={{ duration: 0.5, delay: i * 0.02, ease: EASE }}
          />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.line
            key={`hg-${i}`}
            x1="0" y1={i * 50} x2="900" y2={i * 50}
            stroke={STROKE} strokeWidth="0.3"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.03 } }}
            transition={{ duration: 0.5, delay: i * 0.02, ease: EASE }}
          />
        ))}

        {/* Ground line */}
        <motion.line
          x1="50" y1="280" x2="850" y2="280"
          stroke={STROKE} strokeWidth="1"
          variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.15 } }}
          transition={{ duration: 1.2, ease: EASE }}
        />

        {/* Main building - flat roof modern villa */}
        <motion.rect
          x="200" y="160" width="350" height="120"
          fill="none" stroke={STROKE} strokeWidth="1"
          variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.12 } }}
          transition={{ duration: 1.5, delay: 0.3, ease: EASE }}
        />

        {/* Upper level */}
        <motion.rect
          x="250" y="100" width="200" height="60"
          fill="none" stroke={STROKE} strokeWidth="1"
          variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.12 } }}
          transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
        />

        {/* Large windows */}
        {[
          { x: 220, y: 180, w: 60, h: 80 },
          { x: 300, y: 180, w: 40, h: 80 },
          { x: 360, y: 180, w: 80, h: 80 },
          { x: 460, y: 180, w: 60, h: 80 },
          { x: 270, y: 115, w: 50, h: 35 },
          { x: 340, y: 115, w: 50, h: 35 },
        ].map((w, i) => (
          <motion.rect
            key={`w-${i}`}
            x={w.x} y={w.y} width={w.w} height={w.h}
            fill="none" stroke={STROKE} strokeWidth="0.5"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.08 } }}
            transition={{ duration: 0.6, delay: 0.8 + i * 0.08, ease: EASE }}
          />
        ))}

        {/* Garage / extension right */}
        <motion.rect
          x="550" y="210" width="120" height="70"
          fill="none" stroke={STROKE} strokeWidth="0.8"
          variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.1 } }}
          transition={{ duration: 1.0, delay: 0.6, ease: EASE }}
        />

        {/* Swimming pool */}
        <motion.rect
          x="100" y="290" width="160" height="40" rx="8"
          fill="none" stroke={STROKE} strokeWidth="0.8"
          variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.1 } }}
          transition={{ duration: 1.0, delay: 0.9, ease: EASE }}
        />
        {/* Pool water lines */}
        {[0, 1, 2].map((i) => (
          <motion.line
            key={`pl-${i}`}
            x1="120" y1={300 + i * 8} x2="240" y2={300 + i * 8}
            stroke={STROKE} strokeWidth="0.3" strokeDasharray="4 3"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.06 } }}
            transition={{ duration: 0.5, delay: 1.1 + i * 0.1, ease: EASE }}
          />
        ))}

        {/* Trees */}
        {[{ cx: 80, r: 18 }, { cx: 720, r: 22 }, { cx: 780, r: 15 }, { cx: 830, r: 20 }].map((t, i) => (
          <motion.g key={`tree-${i}`}>
            <motion.line
              x1={t.cx} y1="280" x2={t.cx} y2={260 - t.r}
              stroke={STROKE} strokeWidth="0.5"
              variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.08 } }}
              transition={{ duration: 0.5, delay: 1.2 + i * 0.1, ease: EASE }}
            />
            <motion.circle
              cx={t.cx} cy={255 - t.r} r={t.r}
              fill="none" stroke={STROKE} strokeWidth="0.5"
              variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 0.06, scale: 1 } }}
              transition={{ duration: 0.5, delay: 1.3 + i * 0.1, ease: EASE }}
            />
          </motion.g>
        ))}

        {/* Dimension lines */}
        <motion.g
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.05 } }}
          transition={{ duration: 0.8, delay: 1.5, ease: EASE }}
        >
          <line x1="200" y1="340" x2="550" y2="340" stroke={STROKE} strokeWidth="0.5" />
          <line x1="200" y1="337" x2="200" y2="343" stroke={STROKE} strokeWidth="0.5" />
          <line x1="550" y1="337" x2="550" y2="343" stroke={STROKE} strokeWidth="0.5" />
          <text x="375" y="348" fill={STROKE} fontSize="6" textAnchor="middle" opacity="0.4">35.0 m</text>
        </motion.g>
      </motion.svg>
    </div>
  );
}

/* ===========================================================================
 * 2. ModernTowerIllustration (~500px)
 * Wireframe skyscraper in perspective with floor plates
 * =========================================================================*/

export function ModernTowerIllustration({ className = "" }: { className?: string }) {
  const floors = 18;
  const floorH = 22;
  const baseY = 420;
  const baseW = 120;
  const topW = 90;

  return (
    <div className={`w-full ${className}`} aria-hidden="true">
      <motion.svg
        viewBox="0 0 400 480"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto max-w-md mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {/* Floor plates */}
        {Array.from({ length: floors }).map((_, i) => {
          const y = baseY - i * floorH;
          const w = baseW - (i / floors) * (baseW - topW);
          const x = 200 - w / 2;
          return (
            <motion.g key={`floor-${i}`}>
              <motion.rect
                x={x} y={y - floorH} width={w} height={floorH}
                fill="none" stroke={STROKE} strokeWidth="0.6"
                variants={{ hidden: { opacity: 0, scaleY: 0 }, visible: { opacity: 0.08, scaleY: 1 } }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease: EASE }}
                style={{ transformOrigin: `${200}px ${y}px` }}
              />
              {/* Window grid per floor */}
              {w > 60 && Array.from({ length: Math.floor(w / 15) }).map((_, j) => (
                <motion.rect
                  key={`fw-${i}-${j}`}
                  x={x + 4 + j * 14} y={y - floorH + 3}
                  width="10" height={floorH - 6}
                  fill="none" stroke={STROKE} strokeWidth="0.2"
                  variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.04 } }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.04 + j * 0.01, ease: EASE }}
                />
              ))}
            </motion.g>
          );
        })}

        {/* Antenna */}
        <motion.line
          x1="200" y1={baseY - floors * floorH} x2="200" y2={baseY - floors * floorH - 30}
          stroke={STROKE} strokeWidth="0.8"
          variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.12 } }}
          transition={{ duration: 0.6, delay: 1.2, ease: EASE }}
        />
        <motion.circle
          cx="200" cy={baseY - floors * floorH - 32} r="2"
          fill={STROKE}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.15 } }}
          transition={{ duration: 0.3, delay: 1.5, ease: EASE }}
        />

        {/* Ground */}
        <motion.line
          x1="80" y1={baseY} x2="320" y2={baseY}
          stroke={STROKE} strokeWidth="1"
          variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.12 } }}
          transition={{ duration: 1.0, ease: EASE }}
        />

        {/* Surrounding small buildings */}
        {[
          { x: 90, w: 40, h: 50 },
          { x: 280, w: 35, h: 65 },
          { x: 50, w: 30, h: 35 },
          { x: 320, w: 28, h: 40 },
        ].map((b, i) => (
          <motion.rect
            key={`sb-${i}`}
            x={b.x} y={baseY - b.h} width={b.w} height={b.h}
            fill="none" stroke={STROKE} strokeWidth="0.4"
            variants={{ hidden: { opacity: 0, scaleY: 0 }, visible: { opacity: 0.05, scaleY: 1 } }}
            transition={{ duration: 0.5, delay: 0.8 + i * 0.1, ease: EASE }}
            style={{ transformOrigin: `${b.x + b.w / 2}px ${baseY}px` }}
          />
        ))}

        {/* Entrance detail */}
        <motion.rect
          x="185" y={baseY - 18} width="30" height="18"
          fill="none" stroke={STROKE} strokeWidth="0.5"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.1 } }}
          transition={{ duration: 0.4, delay: 1.0, ease: EASE }}
        />
      </motion.svg>
    </div>
  );
}

/* ===========================================================================
 * 3. CitySkylinesIllustration (~350px)
 * Panoramic skyline with 15+ buildings, horizon glow, stars
 * =========================================================================*/

const SKYLINE_BUILDINGS = [
  { x: 20, w: 35, h: 60 },
  { x: 60, w: 25, h: 110 },
  { x: 90, w: 40, h: 75 },
  { x: 135, w: 20, h: 140 },
  { x: 160, w: 45, h: 90 },
  { x: 210, w: 30, h: 120 },
  { x: 245, w: 50, h: 65 },
  { x: 300, w: 22, h: 155 },
  { x: 327, w: 38, h: 100 },
  { x: 370, w: 28, h: 130 },
  { x: 403, w: 42, h: 85 },
  { x: 450, w: 25, h: 145 },
  { x: 480, w: 35, h: 70 },
  { x: 520, w: 30, h: 115 },
  { x: 555, w: 45, h: 55 },
  { x: 605, w: 20, h: 95 },
  { x: 630, w: 40, h: 75 },
  { x: 675, w: 28, h: 125 },
  { x: 708, w: 35, h: 60 },
  { x: 748, w: 22, h: 80 },
];

const STARS = [
  { cx: 100, cy: 30 }, { cx: 250, cy: 15 }, { cx: 400, cy: 25 },
  { cx: 550, cy: 10 }, { cx: 700, cy: 35 }, { cx: 150, cy: 50 },
  { cx: 350, cy: 45 }, { cx: 500, cy: 55 }, { cx: 650, cy: 40 },
  { cx: 50, cy: 60 }, { cx: 780, cy: 20 }, { cx: 320, cy: 8 },
];

export function CitySkylinesIllustration({ className = "" }: { className?: string }) {
  const baseY = 300;

  return (
    <div className={`w-full ${className}`} aria-hidden="true">
      <motion.svg
        viewBox="0 0 800 340"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {/* Horizon glow */}
        <defs>
          <radialGradient id="horizonGlow" cx="50%" cy="100%" r="60%" fx="50%" fy="100%">
            <stop offset="0%" stopColor={STROKE} stopOpacity="0.06" />
            <stop offset="100%" stopColor={STROKE} stopOpacity="0" />
          </radialGradient>
        </defs>
        <motion.rect
          x="0" y="150" width="800" height="190"
          fill="url(#horizonGlow)"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          transition={{ duration: 1.5, ease: EASE }}
        />

        {/* Stars */}
        {STARS.map((star, i) => (
          <motion.circle
            key={`star-${i}`}
            cx={star.cx} cy={star.cy} r="1.2"
            fill={STROKE}
            variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 0.12, scale: 1 } }}
            transition={{ duration: 0.3, delay: 0.5 + i * 0.06, ease: EASE }}
          />
        ))}

        {/* Horizon line */}
        <motion.line
          x1="0" y1={baseY} x2="800" y2={baseY}
          stroke={STROKE} strokeWidth="1"
          variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.12 } }}
          transition={{ duration: 1.5, ease: EASE }}
        />

        {/* Buildings */}
        {SKYLINE_BUILDINGS.map((b, i) => (
          <motion.rect
            key={`bldg-${i}`}
            x={b.x} y={baseY - b.h} width={b.w} height={b.h}
            fill="none" stroke={STROKE} strokeWidth="0.6"
            variants={{
              hidden: { scaleY: 0, opacity: 0 },
              visible: { scaleY: 1, opacity: 0.08 },
            }}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.04, ease: EASE }}
            style={{ transformOrigin: `${b.x + b.w / 2}px ${baseY}px` }}
          />
        ))}

        {/* Building fill (very subtle) */}
        {SKYLINE_BUILDINGS.filter((_, i) => i % 3 === 0).map((b, i) => (
          <motion.rect
            key={`bfill-${i}`}
            x={b.x} y={baseY - b.h} width={b.w} height={b.h}
            fill={STROKE}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.02 } }}
            transition={{ duration: 0.5, delay: 0.8 + i * 0.1, ease: EASE }}
          />
        ))}

        {/* Reflection lines below horizon */}
        {[0, 1, 2].map((i) => (
          <motion.line
            key={`ref-${i}`}
            x1="100" y1={baseY + 8 + i * 6} x2="700" y2={baseY + 8 + i * 6}
            stroke={STROKE} strokeWidth="0.3" strokeDasharray="6 4"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.04 } }}
            transition={{ duration: 0.6, delay: 1.2 + i * 0.1, ease: EASE }}
          />
        ))}
      </motion.svg>
    </div>
  );
}
