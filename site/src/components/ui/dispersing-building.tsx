"use client";

import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* -------------------------------------------------------------------------- */
/*  Seeded pseudo-random so every render is deterministic                      */
/* -------------------------------------------------------------------------- */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */
interface BuildingElement {
  id: number;
  type: "line" | "rect" | "polyline";
  // SVG attributes
  x1?: number; y1?: number; x2?: number; y2?: number;
  x?: number; y?: number; w?: number; h?: number;
  points?: string;
  accent?: boolean;
  // Dispersion params
  dx: number;
  dy: number;
  rotate: number;
  delay: number; // 0-0.3 stagger
  // What it morphs into
  morphTo: "binary" | "dataline" | "circle" | "triangle" | "code" | "node";
}

/* -------------------------------------------------------------------------- */
/*  Building definition — ~55 elements                                        */
/* -------------------------------------------------------------------------- */
function generateBuilding(): Omit<BuildingElement, "dx" | "dy" | "rotate" | "delay" | "morphTo">[] {
  const elems: Omit<BuildingElement, "dx" | "dy" | "rotate" | "delay" | "morphTo">[] = [];
  let id = 0;

  // Center the building in viewBox 0 0 800 500
  const bx = 150; // building left
  const by = 60;  // building top
  const bw = 500; // building width
  const bh = 380; // building height

  // --- Main outline ---
  // Left wall
  elems.push({ id: id++, type: "line", x1: bx, y1: by + 40, x2: bx, y2: by + bh });
  // Right wall
  elems.push({ id: id++, type: "line", x1: bx + bw, y1: by + 40, x2: bx + bw, y2: by + bh });
  // Ground
  elems.push({ id: id++, type: "line", x1: bx - 30, y1: by + bh, x2: bx + bw + 30, y2: by + bh });
  // Roof line
  elems.push({ id: id++, type: "line", x1: bx, y1: by + 40, x2: bx + bw, y2: by + 40 });
  // Roof accent peak (modern angled)
  elems.push({ id: id++, type: "polyline", points: `${bx + 100},${by + 40} ${bx + 200},${by} ${bx + 400},${by} ${bx + 420},${by + 40}`, accent: true });

  // --- Tower section (left) ---
  const tx = bx;
  const tw = 140;
  elems.push({ id: id++, type: "line", x1: tx, y1: by - 20, x2: tx, y2: by + 40 });
  elems.push({ id: id++, type: "line", x1: tx + tw, y1: by - 20, x2: tx + tw, y2: by + 40 });
  elems.push({ id: id++, type: "line", x1: tx, y1: by - 20, x2: tx + tw, y2: by - 20, accent: true });

  // --- Floor lines ---
  for (let f = 1; f <= 5; f++) {
    const fy = by + 40 + f * (bh - 40) / 6;
    elems.push({ id: id++, type: "line", x1: bx + 5, y1: fy, x2: bx + bw - 5, y2: fy });
  }

  // --- Windows (grid: 6 cols x 5 rows) ---
  const winCols = 8;
  const winRows = 5;
  const winW = 30;
  const winH = 35;
  const gapX = (bw - 40) / winCols;
  const floorH = (bh - 40) / 6;
  for (let row = 0; row < winRows; row++) {
    for (let col = 0; col < winCols; col++) {
      const wx = bx + 20 + col * gapX + (gapX - winW) / 2;
      const wy = by + 55 + row * floorH + (floorH - winH) / 2;
      const isAccent = (row + col) % 5 === 0;
      elems.push({ id: id++, type: "rect", x: wx, y: wy, w: winW, h: winH, accent: isAccent });
    }
  }

  // --- Entrance ---
  elems.push({ id: id++, type: "rect", x: bx + bw / 2 - 35, y: by + bh - 70, w: 70, h: 70, accent: true });
  // Entrance door lines
  elems.push({ id: id++, type: "line", x1: bx + bw / 2, y1: by + bh - 70, x2: bx + bw / 2, y2: by + bh });

  // --- Right wing overhang ---
  elems.push({ id: id++, type: "line", x1: bx + bw - 120, y1: by + 25, x2: bx + bw, y2: by + 25, accent: true });
  elems.push({ id: id++, type: "line", x1: bx + bw - 120, y1: by + 25, x2: bx + bw - 120, y2: by + 40 });

  // --- Antenna / tech spire ---
  elems.push({ id: id++, type: "line", x1: bx + 80, y1: by - 20, x2: bx + 80, y2: by - 55, accent: true });
  elems.push({ id: id++, type: "line", x1: bx + 70, y1: by - 45, x2: bx + 90, y2: by - 45 });

  // --- Horizontal decorative lines on facade ---
  for (let d = 0; d < 3; d++) {
    const dy = by + 42 + d * 2;
    elems.push({ id: id++, type: "line", x1: bx + 20, y1: dy, x2: bx + bw - 20, y2: dy });
  }

  return elems;
}

const morphTypes: BuildingElement["morphTo"][] = ["binary", "dataline", "circle", "triangle", "code", "node"];

function assignDispersion(
  elems: Omit<BuildingElement, "dx" | "dy" | "rotate" | "delay" | "morphTo">[]
): BuildingElement[] {
  const rand = seededRandom(42);
  return elems.map((el) => {
    const angle = rand() * Math.PI * 2;
    const dist = 200 + rand() * 500;
    return {
      ...el,
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist,
      rotate: (rand() - 0.5) * 360,
      delay: rand() * 0.3,
      morphTo: morphTypes[Math.floor(rand() * morphTypes.length)],
    };
  });
}

/* -------------------------------------------------------------------------- */
/*  Fragment sub-component                                                     */
/* -------------------------------------------------------------------------- */
function Fragment({
  el,
  scrollYProgress,
}: {
  el: BuildingElement;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  // Each element starts dispersing at its own delay point
  const start = 0.15 + el.delay;
  const end = 0.65 + el.delay * 0.5;

  const x = useTransform(scrollYProgress, [start, end], [0, el.dx]);
  const y = useTransform(scrollYProgress, [start, end], [0, el.dy]);
  const rotate = useTransform(scrollYProgress, [start, end], [0, el.rotate]);
  const opacity = useTransform(scrollYProgress, [start, end, Math.min(end + 0.15, 1)], [1, 0.7, 0]);
  const scale = useTransform(scrollYProgress, [start, end], [1, 0.6]);

  // Morph opacity: the tech element fades in as the building element fades
  const morphOpacity = useTransform(scrollYProgress, [start + 0.05, end], [0, 1]);

  const baseColor = el.accent ? "#ffe0c2" : "rgba(255,255,255,0.7)";
  const accentDim = el.accent ? "#ffe0c2" : "rgba(255,255,255,0.35)";

  // Compute a transform origin near the element center
  let cx = 400, cy = 250;
  if (el.type === "line") {
    cx = ((el.x1 ?? 0) + (el.x2 ?? 0)) / 2;
    cy = ((el.y1 ?? 0) + (el.y2 ?? 0)) / 2;
  } else if (el.type === "rect") {
    cx = (el.x ?? 0) + (el.w ?? 0) / 2;
    cy = (el.y ?? 0) + (el.h ?? 0) / 2;
  } else if (el.type === "polyline" && el.points) {
    const nums = el.points.split(/[\s,]+/).map(Number);
    const xs = nums.filter((_, i) => i % 2 === 0);
    const ys = nums.filter((_, i) => i % 2 === 1);
    cx = xs.reduce((a, b) => a + b, 0) / xs.length;
    cy = ys.reduce((a, b) => a + b, 0) / ys.length;
  }

  // Render the building element
  const renderBuildingEl = () => {
    switch (el.type) {
      case "line":
        return (
          <line
            x1={el.x1} y1={el.y1} x2={el.x2} y2={el.y2}
            stroke={baseColor}
            strokeWidth={el.accent ? 2 : 1.2}
          />
        );
      case "rect":
        return (
          <rect
            x={el.x} y={el.y} width={el.w} height={el.h}
            stroke={baseColor}
            strokeWidth={el.accent ? 1.8 : 1}
            fill={accentDim}
            fillOpacity={0.08}
          />
        );
      case "polyline":
        return (
          <polyline
            points={el.points}
            stroke={baseColor}
            strokeWidth={el.accent ? 2.2 : 1.2}
            fill="none"
          />
        );
    }
  };

  // Render the tech morph element
  const renderMorphEl = () => {
    const color = el.accent ? "#ffe0c2" : "rgba(255,255,255,0.6)";
    switch (el.morphTo) {
      case "binary":
        return (
          <motion.text
            x={cx} y={cy}
            fill={color}
            fontSize={9}
            fontFamily="monospace"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ opacity: morphOpacity }}
          >
            {el.id % 2 === 0 ? "01101001" : "10010110"}
          </motion.text>
        );
      case "dataline":
        return (
          <motion.line
            x1={cx - 20} y1={cy} x2={cx + 20} y2={cy}
            stroke={color}
            strokeWidth={1.5}
            strokeDasharray="3 3"
            style={{ opacity: morphOpacity }}
          />
        );
      case "circle":
        return (
          <motion.circle
            cx={cx} cy={cy} r={4}
            stroke={color}
            strokeWidth={1.5}
            fill="none"
            style={{ opacity: morphOpacity }}
          />
        );
      case "triangle":
        return (
          <motion.polygon
            points={`${cx},${cy - 5} ${cx - 5},${cy + 4} ${cx + 5},${cy + 4}`}
            stroke={color}
            strokeWidth={1.2}
            fill="none"
            style={{ opacity: morphOpacity }}
          />
        );
      case "code":
        return (
          <motion.text
            x={cx} y={cy}
            fill={color}
            fontSize={8}
            fontFamily="monospace"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ opacity: morphOpacity }}
          >
            {["</>", "{ }", "=>", "( )", "[ ]", "::"][el.id % 6]}
          </motion.text>
        );
      case "node":
        return (
          <motion.g style={{ opacity: morphOpacity }}>
            <circle cx={cx} cy={cy} r={3} fill={color} />
            <line x1={cx} y1={cy} x2={cx + 12} y2={cy - 8} stroke={color} strokeWidth={0.8} />
            <circle cx={cx + 12} cy={cy - 8} r={1.8} fill={color} />
          </motion.g>
        );
    }
  };

  return (
    <motion.g
      style={{
        x,
        y,
        rotate,
        scale,
        opacity,
        transformOrigin: `${cx}px ${cy}px`,
      }}
    >
      {renderBuildingEl()}
      {renderMorphEl()}
    </motion.g>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                             */
/* -------------------------------------------------------------------------- */
interface DispersingBuildingProps {
  className?: string;
}

export default function DispersingBuilding({ className }: DispersingBuildingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const elements = useMemo(() => assignDispersion(generateBuilding()), []);

  // Subtle glow pulse behind the building
  const glowOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7], [0.15, 0.35, 0]);
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.3, 1.8]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}
    >
      <svg
        viewBox="0 0 800 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: "min(70vw, 900px)",
          height: "auto",
          overflow: "visible",
        }}
      >
        {/* Background glow */}
        <motion.ellipse
          cx={400}
          cy={280}
          rx={260}
          ry={180}
          fill="#ffe0c2"
          style={{
            opacity: glowOpacity,
            scale: glowScale,
            transformOrigin: "400px 280px",
            filter: "blur(80px)",
          }}
        />

        {/* All building fragments */}
        {elements.map((el) => (
          <Fragment key={el.id} el={el} scrollYProgress={scrollYProgress} />
        ))}
      </svg>
    </div>
  );
}
