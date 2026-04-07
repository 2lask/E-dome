"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// SVG architectural drawings - blueprint style
function BlueprintGrid({ opacity, rotate, scale }: { opacity: any; rotate: any; scale: any }) {
  return (
    <motion.div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity }}>
      <motion.svg
        className="absolute w-[200%] h-[200%] -left-1/2 -top-1/2"
        viewBox="0 0 1000 1000"
        style={{ rotate, scale }}
      >
        {/* Grid lines */}
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="1000" y2={i * 50} stroke="currentColor" strokeWidth="0.3" opacity="0.15" />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="1000" stroke="currentColor" strokeWidth="0.3" opacity="0.15" />
        ))}
      </motion.svg>
    </motion.div>
  );
}

function VillaBlueprint({ opacity, y, x }: { opacity: any; y: any; x: any }) {
  return (
    <motion.div className="absolute pointer-events-none" style={{ opacity, y, x, right: "-5%", top: "10%" }}>
      <svg width="500" height="400" viewBox="0 0 500 400" fill="none" className="text-white/[0.04]">
        {/* Foundation */}
        <rect x="50" y="300" width="400" height="10" stroke="currentColor" strokeWidth="1" />
        {/* Main structure */}
        <rect x="80" y="150" width="150" height="150" stroke="currentColor" strokeWidth="0.8" />
        <rect x="270" y="180" width="150" height="120" stroke="currentColor" strokeWidth="0.8" />
        {/* Roof */}
        <path d="M60 150 L155 60 L250 150" stroke="currentColor" strokeWidth="0.8" />
        <path d="M250 180 L345 110 L440 180" stroke="currentColor" strokeWidth="0.8" />
        {/* Windows */}
        <rect x="110" y="180" width="30" height="40" stroke="currentColor" strokeWidth="0.6" />
        <rect x="170" y="180" width="30" height="40" stroke="currentColor" strokeWidth="0.6" />
        <rect x="110" y="240" width="30" height="40" stroke="currentColor" strokeWidth="0.6" />
        {/* Door */}
        <rect x="170" y="240" width="30" height="60" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="195" cy="270" r="2" stroke="currentColor" strokeWidth="0.5" />
        {/* Right windows */}
        <rect x="300" y="210" width="35" height="30" stroke="currentColor" strokeWidth="0.6" />
        <rect x="355" y="210" width="35" height="30" stroke="currentColor" strokeWidth="0.6" />
        <rect x="300" y="260" width="35" height="30" stroke="currentColor" strokeWidth="0.6" />
        {/* Garage */}
        <rect x="355" y="250" width="45" height="50" stroke="currentColor" strokeWidth="0.6" />
        <line x1="377" y1="250" x2="377" y2="300" stroke="currentColor" strokeWidth="0.4" strokeDasharray="4 2" />
        {/* Pool */}
        <rect x="80" y="330" width="120" height="50" rx="8" stroke="currentColor" strokeWidth="0.6" strokeDasharray="4 3" />
        <text x="115" y="360" fill="currentColor" fontSize="8" opacity="0.5">pool</text>
        {/* Dimension lines */}
        <line x1="50" y1="320" x2="450" y2="320" stroke="currentColor" strokeWidth="0.3" strokeDasharray="2 4" />
        <text x="230" y="340" fill="currentColor" fontSize="7" opacity="0.4">24.0 m</text>
        {/* Trees */}
        <circle cx="30" cy="280" r="15" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 2" />
        <line x1="30" y1="295" x2="30" y2="310" stroke="currentColor" strokeWidth="0.4" />
        <circle cx="470" cy="260" r="12" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 2" />
        <line x1="470" y1="272" x2="470" y2="310" stroke="currentColor" strokeWidth="0.4" />
      </svg>
    </motion.div>
  );
}

function FloorPlan({ opacity, y, x }: { opacity: any; y: any; x: any }) {
  return (
    <motion.div className="absolute pointer-events-none" style={{ opacity, y, x, left: "-8%", bottom: "5%" }}>
      <svg width="450" height="350" viewBox="0 0 450 350" fill="none" className="text-white/[0.04]">
        {/* Outer walls */}
        <rect x="30" y="30" width="390" height="290" stroke="currentColor" strokeWidth="1.2" />
        {/* Rooms */}
        <rect x="30" y="30" width="200" height="150" stroke="currentColor" strokeWidth="0.8" />
        <rect x="230" y="30" width="190" height="150" stroke="currentColor" strokeWidth="0.8" />
        <rect x="30" y="180" width="130" height="140" stroke="currentColor" strokeWidth="0.8" />
        <rect x="160" y="180" width="130" height="140" stroke="currentColor" strokeWidth="0.8" />
        <rect x="290" y="180" width="130" height="140" stroke="currentColor" strokeWidth="0.8" />
        {/* Room labels */}
        <text x="100" y="110" fill="currentColor" fontSize="9" textAnchor="middle" opacity="0.4">Salon</text>
        <text x="100" y="125" fill="currentColor" fontSize="7" textAnchor="middle" opacity="0.25">42 m²</text>
        <text x="325" y="110" fill="currentColor" fontSize="9" textAnchor="middle" opacity="0.4">Cuisine</text>
        <text x="325" y="125" fill="currentColor" fontSize="7" textAnchor="middle" opacity="0.25">28 m²</text>
        <text x="95" y="260" fill="currentColor" fontSize="8" textAnchor="middle" opacity="0.4">Ch. 1</text>
        <text x="225" y="260" fill="currentColor" fontSize="8" textAnchor="middle" opacity="0.4">Ch. 2</text>
        <text x="355" y="260" fill="currentColor" fontSize="8" textAnchor="middle" opacity="0.4">SdB</text>
        {/* Doors (arcs) */}
        <path d="M200 100 A30 30 0 0 1 230 100" stroke="currentColor" strokeWidth="0.5" fill="none" />
        <path d="M130 180 A25 25 0 0 1 160 180" stroke="currentColor" strokeWidth="0.5" fill="none" />
        <path d="M260 180 A25 25 0 0 1 290 180" stroke="currentColor" strokeWidth="0.5" fill="none" />
        {/* Stairs */}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`stair${i}`} x1={335 + i * 8} y1="45" x2={335 + i * 8} y2="75" stroke="currentColor" strokeWidth="0.4" />
        ))}
        <text x="370" y="90" fill="currentColor" fontSize="6" textAnchor="middle" opacity="0.3">escalier</text>
        {/* Compass */}
        <circle cx="60" cy="55" r="12" stroke="currentColor" strokeWidth="0.4" />
        <text x="60" y="50" fill="currentColor" fontSize="6" textAnchor="middle" opacity="0.5">N</text>
        <line x1="60" y1="43" x2="60" y2="55" stroke="currentColor" strokeWidth="0.6" />
      </svg>
    </motion.div>
  );
}

function BuildingElevation({ opacity, y }: { opacity: any; y: any }) {
  return (
    <motion.div className="absolute pointer-events-none" style={{ opacity, y, right: "5%", bottom: "15%" }}>
      <svg width="350" height="400" viewBox="0 0 350 400" fill="none" className="text-white/[0.04]">
        {/* Building outline */}
        <rect x="50" y="50" width="250" height="320" stroke="currentColor" strokeWidth="1" />
        {/* Floors */}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`floor${i}`} x1="50" y1={90 + i * 35} x2="300" y2={90 + i * 35} stroke="currentColor" strokeWidth="0.4" />
        ))}
        {/* Windows grid */}
        {Array.from({ length: 8 }).map((_, row) =>
          Array.from({ length: 5 }).map((_, col) => (
            <rect key={`w${row}-${col}`} x={70 + col * 45} y={58 + row * 35} width="20" height="25" stroke="currentColor" strokeWidth="0.4" rx="1" />
          ))
        )}
        {/* Entrance */}
        <rect x="140" y="340" width="70" height="30" stroke="currentColor" strokeWidth="0.6" />
        <path d="M155 370 L175 350 L195 370" stroke="currentColor" strokeWidth="0.4" fill="none" />
        {/* Roof details */}
        <rect x="130" y="30" width="90" height="20" stroke="currentColor" strokeWidth="0.5" />
        <line x1="175" y1="20" x2="175" y2="30" stroke="currentColor" strokeWidth="0.4" />
        {/* Dimension */}
        <line x1="30" y1="50" x2="30" y2="370" stroke="currentColor" strokeWidth="0.3" strokeDasharray="2 4" />
        <text x="20" y="210" fill="currentColor" fontSize="6" textAnchor="middle" opacity="0.3" transform="rotate(-90 20 210)">28.5 m</text>
      </svg>
    </motion.div>
  );
}

interface ArchBackgroundProps {
  variant: "villa" | "floorplan" | "building" | "mixed";
  className?: string;
}

export function ArchBackground({ variant, className = "" }: ArchBackgroundProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.6, 0.6, 0]);
  const gridRotate = useTransform(scrollYProgress, [0, 1], [0, 8]);
  const gridScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1]);
  const yParallax1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const yParallax2 = useTransform(scrollYProgress, [0, 1], [40, -80]);
  const xDrift = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <BlueprintGrid opacity={opacity} rotate={gridRotate} scale={gridScale} />

      {(variant === "villa" || variant === "mixed") && (
        <VillaBlueprint opacity={opacity} y={yParallax1} x={xDrift} />
      )}
      {(variant === "floorplan" || variant === "mixed") && (
        <FloorPlan opacity={opacity} y={yParallax2} x={xDrift} />
      )}
      {(variant === "building" || variant === "mixed") && (
        <BuildingElevation opacity={opacity} y={yParallax1} />
      )}
    </div>
  );
}
