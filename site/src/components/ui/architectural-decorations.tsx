"use client";

import { motion } from "framer-motion";

// ---------------------------------------------------------------------------
// Shared animation variants
// ---------------------------------------------------------------------------

const fadeInOnScroll = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.2, ease: "easeOut" as const },
  },
};

const drawLine = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: i * 0.08, duration: 1, ease: "easeInOut" as const },
      opacity: { delay: i * 0.08, duration: 0.3 },
    },
  }),
};

// ---------------------------------------------------------------------------
// 1. SmallHouse
// ---------------------------------------------------------------------------

interface DecorationProps {
  className?: string;
  opacity?: number;
}

export function SmallHouse({ className = "", opacity = 0.08 }: DecorationProps) {
  return (
    <motion.div
      className={`pointer-events-none absolute ${className}`}
      variants={fadeInOnScroll}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.svg
        width="42"
        height="42"
        viewBox="0 0 42 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity }}
      >
        {/* Roof */}
        <motion.path
          d="M5 20 L21 6 L37 20"
          stroke="white"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={drawLine}
          custom={0}
        />
        {/* Chimney */}
        <motion.path
          d="M30 12 L30 8 L34 8 L34 15"
          stroke="white"
          strokeWidth="0.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={drawLine}
          custom={1}
        />
        {/* Walls */}
        <motion.rect
          x="8"
          y="20"
          width="26"
          height="16"
          stroke="white"
          strokeWidth="0.8"
          fill="none"
          variants={drawLine}
          custom={2}
        />
        {/* Door */}
        <motion.rect
          x="18"
          y="27"
          width="6"
          height="9"
          stroke="white"
          strokeWidth="0.6"
          fill="none"
          variants={drawLine}
          custom={3}
        />
        {/* Window left */}
        <motion.rect
          x="10"
          y="24"
          width="5"
          height="4"
          stroke="rgba(102,126,234,0.5)"
          strokeWidth="0.5"
          fill="rgba(102,126,234,0.08)"
          variants={drawLine}
          custom={4}
        />
        {/* Window right */}
        <motion.rect
          x="27"
          y="24"
          width="5"
          height="4"
          stroke="rgba(102,126,234,0.5)"
          strokeWidth="0.5"
          fill="rgba(102,126,234,0.08)"
          variants={drawLine}
          custom={4}
        />
      </motion.svg>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// 2. MediumVilla
// ---------------------------------------------------------------------------

export function MediumVilla({ className = "", opacity = 0.06 }: DecorationProps) {
  return (
    <motion.div
      className={`pointer-events-none absolute ${className}`}
      variants={fadeInOnScroll}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.svg
        width="110"
        height="100"
        viewBox="0 0 110 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity }}
      >
        {/* Main roof */}
        <motion.path
          d="M10 40 L55 10 L100 40"
          stroke="white"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={drawLine}
          custom={0}
        />
        {/* Roof ridge detail */}
        <motion.path
          d="M55 10 L55 6"
          stroke="white"
          strokeWidth="0.5"
          variants={drawLine}
          custom={0}
        />
        {/* Main body */}
        <motion.rect
          x="14"
          y="40"
          width="82"
          height="45"
          stroke="white"
          strokeWidth="0.8"
          fill="none"
          variants={drawLine}
          custom={1}
        />
        {/* Ground floor division */}
        <motion.line
          x1="14"
          y1="62"
          x2="96"
          y2="62"
          stroke="white"
          strokeWidth="0.4"
          strokeDasharray="2 2"
          variants={drawLine}
          custom={2}
        />
        {/* Upper windows */}
        {[22, 42, 62, 82].map((x, i) => (
          <motion.rect
            key={`upper-${i}`}
            x={x}
            y={45}
            width="8"
            height="12"
            stroke="rgba(102,126,234,0.5)"
            strokeWidth="0.5"
            fill="rgba(102,126,234,0.06)"
            variants={drawLine}
            custom={3 + i * 0.5}
          />
        ))}
        {/* Lower windows */}
        {[22, 42, 72, 82].map((x, i) => (
          <motion.rect
            key={`lower-${i}`}
            x={x}
            y={66}
            width="8"
            height="10"
            stroke="rgba(102,126,234,0.4)"
            strokeWidth="0.5"
            fill="rgba(102,126,234,0.05)"
            variants={drawLine}
            custom={5 + i * 0.5}
          />
        ))}
        {/* Front door */}
        <motion.rect
          x="51"
          y="68"
          width="10"
          height="17"
          stroke="white"
          strokeWidth="0.6"
          fill="none"
          variants={drawLine}
          custom={4}
        />
        {/* Door step */}
        <motion.line
          x1="48"
          y1="85"
          x2="64"
          y2="85"
          stroke="white"
          strokeWidth="0.5"
          variants={drawLine}
          custom={5}
        />
        {/* Garden path */}
        <motion.path
          d="M56 85 L56 95"
          stroke="white"
          strokeWidth="0.4"
          strokeDasharray="1.5 1.5"
          variants={drawLine}
          custom={6}
        />
        {/* Garden shrubs left */}
        <motion.path
          d="M18 84 Q22 78 26 84 Q30 78 34 84"
          stroke="white"
          strokeWidth="0.4"
          fill="none"
          variants={drawLine}
          custom={7}
        />
        {/* Garden shrubs right */}
        <motion.path
          d="M76 84 Q80 78 84 84 Q88 78 92 84"
          stroke="white"
          strokeWidth="0.4"
          fill="none"
          variants={drawLine}
          custom={7}
        />
        {/* Garden fence left */}
        <motion.line
          x1="5"
          y1="85"
          x2="48"
          y2="85"
          stroke="white"
          strokeWidth="0.3"
          variants={drawLine}
          custom={8}
        />
        {/* Garden fence right */}
        <motion.line
          x1="64"
          y1="85"
          x2="105"
          y2="85"
          stroke="white"
          strokeWidth="0.3"
          variants={drawLine}
          custom={8}
        />
      </motion.svg>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// 3. LargeBuilding
// ---------------------------------------------------------------------------

export function LargeBuilding({ className = "", opacity = 0.05 }: DecorationProps) {
  // Generate glass facade grid
  const floors = 8;
  const cols = 6;
  const windowW = 14;
  const windowH = 10;
  const gapX = 4;
  const gapY = 4;
  const startX = 20;
  const startY = 18;

  const windows: { x: number; y: number; i: number }[] = [];
  for (let row = 0; row < floors; row++) {
    for (let col = 0; col < cols; col++) {
      windows.push({
        x: startX + col * (windowW + gapX),
        y: startY + row * (windowH + gapY),
        i: row * cols + col,
      });
    }
  }

  return (
    <motion.div
      className={`pointer-events-none absolute ${className}`}
      variants={fadeInOnScroll}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.svg
        width="160"
        height="190"
        viewBox="0 0 160 190"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity }}
      >
        {/* Main tower outline */}
        <motion.rect
          x="14"
          y="10"
          width="112"
          height="170"
          stroke="white"
          strokeWidth="0.8"
          fill="none"
          variants={drawLine}
          custom={0}
        />
        {/* Roof cap */}
        <motion.path
          d="M14 10 L70 2 L126 10"
          stroke="white"
          strokeWidth="0.6"
          strokeLinecap="round"
          fill="none"
          variants={drawLine}
          custom={0}
        />
        {/* Antenna */}
        <motion.line
          x1="70"
          y1="2"
          x2="70"
          y2="-6"
          stroke="white"
          strokeWidth="0.4"
          variants={drawLine}
          custom={0}
        />

        {/* Glass facade grid */}
        {windows.map(({ x, y, i }) => (
          <motion.rect
            key={i}
            x={x}
            y={y}
            width={windowW}
            height={windowH}
            stroke="rgba(102,126,234,0.35)"
            strokeWidth="0.4"
            fill="rgba(102,126,234,0.04)"
            variants={drawLine}
            custom={1 + i * 0.02}
          />
        ))}

        {/* Floor lines */}
        {Array.from({ length: floors + 1 }, (_, row) => (
          <motion.line
            key={`floor-${row}`}
            x1="14"
            y1={startY + row * (windowH + gapY) - gapY / 2}
            x2="126"
            y2={startY + row * (windowH + gapY) - gapY / 2}
            stroke="white"
            strokeWidth="0.3"
            strokeDasharray="1 2"
            variants={drawLine}
            custom={1 + row * 0.1}
          />
        ))}

        {/* Ground level */}
        <motion.line
          x1="4"
          y1="180"
          x2="156"
          y2="180"
          stroke="white"
          strokeWidth="0.5"
          variants={drawLine}
          custom={3}
        />

        {/* Entrance */}
        <motion.rect
          x="55"
          y="160"
          width="30"
          height="20"
          stroke="white"
          strokeWidth="0.6"
          fill="none"
          variants={drawLine}
          custom={3}
        />

        {/* Dimension line left */}
        <motion.line
          x1="8"
          y1="10"
          x2="8"
          y2="180"
          stroke="white"
          strokeWidth="0.25"
          strokeDasharray="3 3"
          variants={drawLine}
          custom={4}
        />
        {/* Dimension ticks */}
        <motion.line x1="6" y1="10" x2="10" y2="10" stroke="white" strokeWidth="0.3" variants={drawLine} custom={4} />
        <motion.line x1="6" y1="180" x2="10" y2="180" stroke="white" strokeWidth="0.3" variants={drawLine} custom={4} />
      </motion.svg>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// 4. FloorPlanSmall
// ---------------------------------------------------------------------------

export function FloorPlanSmall({ className = "", opacity = 0.07 }: DecorationProps) {
  return (
    <motion.div
      className={`pointer-events-none absolute ${className}`}
      variants={fadeInOnScroll}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.svg
        width="55"
        height="50"
        viewBox="0 0 55 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity }}
      >
        {/* Outer walls */}
        <motion.rect
          x="2"
          y="2"
          width="51"
          height="46"
          stroke="white"
          strokeWidth="1"
          fill="none"
          variants={drawLine}
          custom={0}
        />
        {/* Horizontal divider (corridor) */}
        <motion.line
          x1="2"
          y1="22"
          x2="53"
          y2="22"
          stroke="white"
          strokeWidth="0.8"
          variants={drawLine}
          custom={1}
        />
        {/* Vertical divider left wing */}
        <motion.line
          x1="22"
          y1="2"
          x2="22"
          y2="22"
          stroke="white"
          strokeWidth="0.8"
          variants={drawLine}
          custom={2}
        />
        {/* Vertical divider right wing */}
        <motion.line
          x1="36"
          y1="22"
          x2="36"
          y2="48"
          stroke="white"
          strokeWidth="0.8"
          variants={drawLine}
          custom={2}
        />
        {/* Room: bathroom (small) */}
        <motion.rect
          x="36"
          y="2"
          width="17"
          height="12"
          stroke="white"
          strokeWidth="0.6"
          fill="none"
          variants={drawLine}
          custom={3}
        />

        {/* Door arcs */}
        <motion.path
          d="M22 18 Q26 18 26 22"
          stroke="rgba(102,126,234,0.5)"
          strokeWidth="0.5"
          fill="none"
          variants={drawLine}
          custom={4}
        />
        <motion.path
          d="M36 26 Q32 26 32 22"
          stroke="rgba(102,126,234,0.5)"
          strokeWidth="0.5"
          fill="none"
          variants={drawLine}
          custom={4}
        />

        {/* Window marks on outer walls */}
        {/* Top wall windows */}
        <motion.line
          x1="8"
          y1="2"
          x2="16"
          y2="2"
          stroke="rgba(102,126,234,0.6)"
          strokeWidth="1.2"
          variants={drawLine}
          custom={5}
        />
        <motion.line
          x1="40"
          y1="2"
          x2="48"
          y2="2"
          stroke="rgba(102,126,234,0.6)"
          strokeWidth="1.2"
          variants={drawLine}
          custom={5}
        />
        {/* Bottom wall window */}
        <motion.line
          x1="8"
          y1="48"
          x2="18"
          y2="48"
          stroke="rgba(102,126,234,0.6)"
          strokeWidth="1.2"
          variants={drawLine}
          custom={5}
        />
        {/* Right wall window */}
        <motion.line
          x1="53"
          y1="30"
          x2="53"
          y2="40"
          stroke="rgba(102,126,234,0.6)"
          strokeWidth="1.2"
          variants={drawLine}
          custom={5}
        />

        {/* Dimension marks */}
        <motion.line
          x1="2"
          y1="-1"
          x2="53"
          y2="-1"
          stroke="white"
          strokeWidth="0.2"
          strokeDasharray="1 1.5"
          variants={drawLine}
          custom={6}
        />
        <motion.line
          x1="-1"
          y1="2"
          x2="-1"
          y2="48"
          stroke="white"
          strokeWidth="0.2"
          strokeDasharray="1 1.5"
          variants={drawLine}
          custom={6}
        />
      </motion.svg>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// 5. ArchitecturalGrid
// ---------------------------------------------------------------------------

export function ArchitecturalGrid({ className = "" }: { className?: string }) {
  const tickSpacing = 20;
  const tickCount = 12;
  const size = tickCount * tickSpacing;

  return (
    <motion.div
      className={`pointer-events-none absolute ${className}`}
      variants={fadeInOnScroll}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.04 }}
      >
        {/* Vertical grid lines */}
        {Array.from({ length: tickCount + 1 }, (_, i) => (
          <line
            key={`v-${i}`}
            x1={i * tickSpacing}
            y1="0"
            x2={i * tickSpacing}
            y2={size}
            stroke="white"
            strokeWidth={i % 4 === 0 ? "0.6" : "0.25"}
          />
        ))}
        {/* Horizontal grid lines */}
        {Array.from({ length: tickCount + 1 }, (_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={i * tickSpacing}
            x2={size}
            y2={i * tickSpacing}
            stroke="white"
            strokeWidth={i % 4 === 0 ? "0.6" : "0.25"}
          />
        ))}

        {/* Measurement tick marks along top edge */}
        {Array.from({ length: tickCount + 1 }, (_, i) => (
          <line
            key={`tick-t-${i}`}
            x1={i * tickSpacing}
            y1="0"
            x2={i * tickSpacing}
            y2={i % 4 === 0 ? 6 : 3}
            stroke="rgba(102,126,234,0.5)"
            strokeWidth="0.5"
          />
        ))}
        {/* Measurement tick marks along left edge */}
        {Array.from({ length: tickCount + 1 }, (_, i) => (
          <line
            key={`tick-l-${i}`}
            x1="0"
            y1={i * tickSpacing}
            x2={i % 4 === 0 ? 6 : 3}
            y2={i * tickSpacing}
            stroke="rgba(102,126,234,0.5)"
            strokeWidth="0.5"
          />
        ))}

        {/* Diagonal accent in one cell */}
        <line
          x1={0}
          y1={0}
          x2={tickSpacing * 4}
          y2={tickSpacing * 4}
          stroke="rgba(102,126,234,0.15)"
          strokeWidth="0.3"
          strokeDasharray="4 4"
        />

        {/* Cross-hair at center */}
        <line
          x1={size / 2 - 8}
          y1={size / 2}
          x2={size / 2 + 8}
          y2={size / 2}
          stroke="rgba(102,126,234,0.3)"
          strokeWidth="0.4"
        />
        <line
          x1={size / 2}
          y1={size / 2 - 8}
          x2={size / 2}
          y2={size / 2 + 8}
          stroke="rgba(102,126,234,0.3)"
          strokeWidth="0.4"
        />
      </svg>
    </motion.div>
  );
}
