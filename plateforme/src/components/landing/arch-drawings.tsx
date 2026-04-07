"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ────────────────────────────────────────────────────────────────────────────
   1. LUXURY VILLA — 3D PERSPECTIVE
   ──────────────────────────────────────────────────────────────────────────── */
export function LuxuryVilla3D({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 700" fill="none" className={className}>
      {/* Ground plane - perspective grid */}
      {Array.from({ length: 25 }).map((_, i) => (
        <line key={`gx${i}`} x1={-200 + i * 80} y1="700" x2={200 + i * 40} y2="400" stroke="currentColor" strokeWidth="0.25" opacity="0.3" />
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={`gy${i}`} x1="0" y1={420 + i * 25} x2="1200" y2={420 + i * 25} stroke="currentColor" strokeWidth="0.2" opacity={0.15 + i * 0.02} />
      ))}

      {/* Main villa body - 3D perspective */}
      {/* Front face */}
      <path d="M200 400 L200 250 L750 250 L750 400" stroke="currentColor" strokeWidth="0.8" />
      {/* Right face (perspective) */}
      <path d="M750 400 L950 350 L950 200 L750 250" stroke="currentColor" strokeWidth="0.7" />
      {/* Roof - flat with slight angle */}
      <path d="M180 250 L180 240 L770 240 L970 190 L970 200 L750 250 Z" stroke="currentColor" strokeWidth="0.6" fill="currentColor" opacity="0.02" />
      {/* Roof overhang lines */}
      <line x1="180" y1="240" x2="770" y2="240" stroke="currentColor" strokeWidth="0.8" />
      <line x1="770" y1="240" x2="970" y2="190" stroke="currentColor" strokeWidth="0.7" />

      {/* Second level - setback */}
      <path d="M280 250 L280 170 L600 170 L600 250" stroke="currentColor" strokeWidth="0.7" />
      <path d="M600 170 L780 130 L780 200 L600 250" stroke="currentColor" strokeWidth="0.6" />
      <path d="M260 170 L260 160 L620 160 L800 120 L800 130 L600 170 Z" stroke="currentColor" strokeWidth="0.5" fill="currentColor" opacity="0.02" />

      {/* Large panoramic windows - front */}
      <rect x="220" y="270" width="120" height="100" stroke="currentColor" strokeWidth="0.5" />
      <line x1="280" y1="270" x2="280" y2="370" stroke="currentColor" strokeWidth="0.3" />
      <rect x="360" y="270" width="80" height="100" stroke="currentColor" strokeWidth="0.5" />
      <rect x="460" y="270" width="120" height="100" stroke="currentColor" strokeWidth="0.5" />
      <line x1="520" y1="270" x2="520" y2="370" stroke="currentColor" strokeWidth="0.3" />
      <line x1="490" y1="270" x2="490" y2="370" stroke="currentColor" strokeWidth="0.3" />

      {/* Entrance door */}
      <rect x="610" y="290" width="60" height="110" stroke="currentColor" strokeWidth="0.5" />
      <rect x="615" y="295" width="24" height="105" stroke="currentColor" strokeWidth="0.3" />
      <rect x="641" y="295" width="24" height="105" stroke="currentColor" strokeWidth="0.3" />
      <circle cx="637" cy="350" r="2.5" stroke="currentColor" strokeWidth="0.4" />

      {/* Right side windows (perspective) */}
      <path d="M760 270 L860 245 L860 340 L760 370" stroke="currentColor" strokeWidth="0.5" />
      <path d="M770 270 L810 258 L810 340 L770 355" stroke="currentColor" strokeWidth="0.3" />
      <path d="M870 245 L930 230 L930 320 L870 340" stroke="currentColor" strokeWidth="0.5" />

      {/* Upper floor windows */}
      <rect x="300" y="185" width="80" height="55" stroke="currentColor" strokeWidth="0.45" />
      <line x1="340" y1="185" x2="340" y2="240" stroke="currentColor" strokeWidth="0.25" />
      <rect x="410" y="185" width="80" height="55" stroke="currentColor" strokeWidth="0.45" />
      <line x1="450" y1="185" x2="450" y2="240" stroke="currentColor" strokeWidth="0.25" />
      <rect x="510" y="185" width="60" height="55" stroke="currentColor" strokeWidth="0.45" />

      {/* Terrace / balcony front */}
      <line x1="200" y1="400" x2="200" y2="420" stroke="currentColor" strokeWidth="0.4" />
      <line x1="750" y1="400" x2="750" y2="420" stroke="currentColor" strokeWidth="0.4" />
      <path d="M180 420 L770 420 L770 415 L180 415 Z" stroke="currentColor" strokeWidth="0.3" fill="currentColor" opacity="0.02" />

      {/* Terrace railing posts */}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={`rail${i}`} x1={210 + i * 48} y1="400" x2={210 + i * 48} y2="415" stroke="currentColor" strokeWidth="0.3" />
      ))}
      <line x1="200" y1="407" x2="750" y2="407" stroke="currentColor" strokeWidth="0.25" />

      {/* Infinity pool */}
      <path d="M200 440 L200 510 L600 510 L600 440" stroke="currentColor" strokeWidth="0.5" />
      <path d="M600 440 L720 420 L720 490 L600 510" stroke="currentColor" strokeWidth="0.4" />
      {/* Water lines */}
      <line x1="220" y1="465" x2="580" y2="465" stroke="currentColor" strokeWidth="0.2" strokeDasharray="8 6" />
      <line x1="220" y1="485" x2="580" y2="485" stroke="currentColor" strokeWidth="0.2" strokeDasharray="8 6" />

      {/* Landscaping - left */}
      <circle cx="120" cy="340" r="40" stroke="currentColor" strokeWidth="0.4" strokeDasharray="5 4" />
      <circle cx="120" cy="330" r="28" stroke="currentColor" strokeWidth="0.3" strokeDasharray="4 4" />
      <circle cx="125" cy="325" r="18" stroke="currentColor" strokeWidth="0.25" strokeDasharray="3 3" />
      <line x1="120" y1="380" x2="120" y2="410" stroke="currentColor" strokeWidth="0.5" />

      <circle cx="60" cy="370" r="30" stroke="currentColor" strokeWidth="0.35" strokeDasharray="5 4" />
      <circle cx="60" cy="362" r="20" stroke="currentColor" strokeWidth="0.25" strokeDasharray="3 3" />
      <line x1="60" y1="400" x2="60" y2="420" stroke="currentColor" strokeWidth="0.4" />

      {/* Landscaping - right */}
      <circle cx="1020" cy="310" r="35" stroke="currentColor" strokeWidth="0.4" strokeDasharray="5 4" />
      <circle cx="1020" cy="302" r="22" stroke="currentColor" strokeWidth="0.3" strokeDasharray="3 3" />
      <line x1="1020" y1="345" x2="1020" y2="370" stroke="currentColor" strokeWidth="0.5" />

      <circle cx="1100" cy="330" r="25" stroke="currentColor" strokeWidth="0.35" strokeDasharray="4 4" />
      <line x1="1100" y1="355" x2="1100" y2="375" stroke="currentColor" strokeWidth="0.4" />

      {/* Driveway */}
      <path d="M750 420 L900 380 L1100 380 L1100 400 L900 400 L770 430" stroke="currentColor" strokeWidth="0.3" strokeDasharray="6 4" />

      {/* Dimension lines */}
      <line x1="200" y1="550" x2="750" y2="550" stroke="currentColor" strokeWidth="0.3" />
      <line x1="200" y1="545" x2="200" y2="555" stroke="currentColor" strokeWidth="0.3" />
      <line x1="750" y1="545" x2="750" y2="555" stroke="currentColor" strokeWidth="0.3" />
      <text x="475" y="568" fill="currentColor" fontSize="10" textAnchor="middle" opacity="0.4">32.00 m</text>

      <line x1="160" y1="160" x2="160" y2="420" stroke="currentColor" strokeWidth="0.3" />
      <line x1="155" y1="160" x2="165" y2="160" stroke="currentColor" strokeWidth="0.3" />
      <line x1="155" y1="420" x2="165" y2="420" stroke="currentColor" strokeWidth="0.3" />
      <text x="140" y="295" fill="currentColor" fontSize="9" textAnchor="middle" opacity="0.35" transform="rotate(-90 140 295)">12.50 m</text>

      {/* Title block */}
      <rect x="850" y="540" width="300" height="80" stroke="currentColor" strokeWidth="0.4" />
      <line x1="850" y1="565" x2="1150" y2="565" stroke="currentColor" strokeWidth="0.3" />
      <text x="1000" y="558" fill="currentColor" fontSize="9" textAnchor="middle" opacity="0.4">VILLA CONTEMPORAINE</text>
      <text x="1000" y="580" fill="currentColor" fontSize="7" textAnchor="middle" opacity="0.3">ÉLÉVATION 3D — PERSPECTIVE SUD-EST</text>
      <text x="1000" y="595" fill="currentColor" fontSize="7" textAnchor="middle" opacity="0.25">ÉCHELLE 1:150</text>
      <text x="1000" y="610" fill="currentColor" fontSize="7" textAnchor="middle" opacity="0.2">E-DOME ARCHITECTURE</text>
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   2. PENTHOUSE — TOP VIEW 3D
   ──────────────────────────────────────────────────────────────────────────── */
export function PenthouseView({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1000 600" fill="none" className={className}>
      {/* Isometric floor - large terrace */}
      <path d="M500 500 L100 350 L500 200 L900 350 Z" stroke="currentColor" strokeWidth="0.6" fill="currentColor" opacity="0.015" />

      {/* Building top face */}
      <path d="M200 320 L500 200 L800 320 L500 440 Z" stroke="currentColor" strokeWidth="0.8" fill="currentColor" opacity="0.02" />

      {/* Walls - isometric */}
      <line x1="200" y1="320" x2="200" y2="250" stroke="currentColor" strokeWidth="0.7" />
      <line x1="500" y1="200" x2="500" y2="130" stroke="currentColor" strokeWidth="0.7" />
      <line x1="800" y1="320" x2="800" y2="250" stroke="currentColor" strokeWidth="0.7" />
      <line x1="500" y1="440" x2="500" y2="370" stroke="currentColor" strokeWidth="0.7" />

      {/* Roof */}
      <path d="M200 250 L500 130 L800 250 L500 370 Z" stroke="currentColor" strokeWidth="0.5" fill="currentColor" opacity="0.02" />

      {/* Room divisions - isometric */}
      <line x1="350" y1="260" x2="350" y2="190" stroke="currentColor" strokeWidth="0.4" />
      <line x1="350" y1="260" x2="650" y2="380" stroke="currentColor" strokeWidth="0.4" />
      <line x1="650" y1="380" x2="650" y2="310" stroke="currentColor" strokeWidth="0.4" />
      <line x1="350" y1="260" x2="500" y2="320" stroke="currentColor" strokeWidth="0.35" />
      <line x1="500" y1="320" x2="500" y2="255" stroke="currentColor" strokeWidth="0.35" />

      {/* Glass facade - front */}
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={`gf${i}`} x1={230 + i * 35} y1={310 - i * 8} x2={230 + i * 35} y2={245 - i * 8} stroke="currentColor" strokeWidth="0.25" />
      ))}

      {/* Terrace furniture outlines */}
      <rect x="150" y="370" width="40" height="25" stroke="currentColor" strokeWidth="0.3" rx="3" transform="skewX(-30) translate(200, 0)" />
      <circle cx="420" cy="460" r="12" stroke="currentColor" strokeWidth="0.3" />
      <circle cx="380" cy="475" r="8" stroke="currentColor" strokeWidth="0.25" />
      <circle cx="460" cy="475" r="8" stroke="currentColor" strokeWidth="0.25" />

      {/* Pool on terrace */}
      <path d="M550 420 L700 350 L780 385 L630 455 Z" stroke="currentColor" strokeWidth="0.5" rx="5" />
      <path d="M570 425 L690 360 L760 390 L640 450 Z" stroke="currentColor" strokeWidth="0.2" strokeDasharray="4 3" />

      {/* Room labels */}
      <text x="400" y="235" fill="currentColor" fontSize="9" textAnchor="middle" opacity="0.35">LIVING</text>
      <text x="400" y="248" fill="currentColor" fontSize="7" textAnchor="middle" opacity="0.25">85 m²</text>
      <text x="580" y="290" fill="currentColor" fontSize="8" textAnchor="middle" opacity="0.35">MASTER</text>
      <text x="580" y="302" fill="currentColor" fontSize="7" textAnchor="middle" opacity="0.25">45 m²</text>
      <text x="680" y="405" fill="currentColor" fontSize="7" textAnchor="middle" opacity="0.3">POOL</text>
      <text x="420" y="480" fill="currentColor" fontSize="7" textAnchor="middle" opacity="0.3">TERRACE</text>

      {/* Skyline behind */}
      <path d="M0 180 L80 180 L80 120 L120 120 L120 80 L160 80 L160 140 L200 140 L200 100 L220 100 L220 160 L280 160 L280 90 L310 90 L310 60 L340 60 L340 150 L400 150 L400 180 L1000 180" stroke="currentColor" strokeWidth="0.3" opacity="0.15" />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   3. CHALET — SIDE ELEVATION DETAILED
   ──────────────────────────────────────────────────────────────────────────── */
export function ChaletElevation({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1000 550" fill="none" className={className}>
      {/* Ground with slope */}
      <path d="M0 450 Q250 460 500 440 Q750 420 1000 430" stroke="currentColor" strokeWidth="0.6" />
      <path d="M0 455 Q250 465 500 445 Q750 425 1000 435" stroke="currentColor" strokeWidth="0.3" strokeDasharray="6 4" />

      {/* Main structure */}
      <rect x="150" y="250" width="700" height="200" stroke="currentColor" strokeWidth="0.8" />

      {/* A-frame roof */}
      <path d="M120 250 L500 80 L880 250" stroke="currentColor" strokeWidth="1" />
      <path d="M130 250 L500 90 L870 250" stroke="currentColor" strokeWidth="0.4" />
      {/* Roof ridge detail */}
      <line x1="500" y1="80" x2="500" y2="70" stroke="currentColor" strokeWidth="0.5" />
      {/* Roof tiles suggestion */}
      {Array.from({ length: 15 }).map((_, i) => (
        <line key={`rt${i}`} x1={190 + i * 20} y1={240 - i * 10} x2={200 + i * 20} y2={240 - i * 10} stroke="currentColor" strokeWidth="0.2" opacity="0.3" />
      ))}

      {/* Stone/wood facade texture lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={`st${i}`} x1="150" y1={265 + i * 22} x2="850" y2={265 + i * 22} stroke="currentColor" strokeWidth="0.15" opacity="0.2" />
      ))}

      {/* Large chalet windows */}
      <rect x="200" y="270" width="150" height="120" stroke="currentColor" strokeWidth="0.5" />
      <line x1="275" y1="270" x2="275" y2="390" stroke="currentColor" strokeWidth="0.3" />
      <line x1="200" y1="330" x2="350" y2="330" stroke="currentColor" strokeWidth="0.3" />

      {/* Triangular window in roof */}
      <path d="M430 150 L500 110 L570 150" stroke="currentColor" strokeWidth="0.5" />
      <line x1="430" y1="150" x2="570" y2="150" stroke="currentColor" strokeWidth="0.5" />
      <line x1="500" y1="110" x2="500" y2="150" stroke="currentColor" strokeWidth="0.3" />

      {/* Central entrance */}
      <rect x="440" y="310" width="120" height="140" stroke="currentColor" strokeWidth="0.6" />
      <path d="M440 310 L500 280 L560 310" stroke="currentColor" strokeWidth="0.5" />
      <line x1="500" y1="310" x2="500" y2="450" stroke="currentColor" strokeWidth="0.3" />
      <circle cx="530" cy="380" r="3" stroke="currentColor" strokeWidth="0.4" />

      {/* Right windows */}
      <rect x="620" y="270" width="80" height="70" stroke="currentColor" strokeWidth="0.5" />
      <rect x="720" y="270" width="80" height="70" stroke="currentColor" strokeWidth="0.5" />
      <rect x="620" y="360" width="80" height="60" stroke="currentColor" strokeWidth="0.5" />
      <rect x="720" y="360" width="80" height="60" stroke="currentColor" strokeWidth="0.5" />
      {/* Window crosses */}
      <line x1="660" y1="270" x2="660" y2="340" stroke="currentColor" strokeWidth="0.25" />
      <line x1="620" y1="305" x2="700" y2="305" stroke="currentColor" strokeWidth="0.25" />
      <line x1="760" y1="270" x2="760" y2="340" stroke="currentColor" strokeWidth="0.25" />

      {/* Balcony */}
      <line x1="150" y1="390" x2="380" y2="390" stroke="currentColor" strokeWidth="0.5" />
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={`br${i}`} x1={170 + i * 26} y1="390" x2={170 + i * 26} y2="410" stroke="currentColor" strokeWidth="0.3" />
      ))}
      <line x1="150" y1="410" x2="380" y2="410" stroke="currentColor" strokeWidth="0.4" />

      {/* Chimney */}
      <rect x="650" y="130" width="30" height="70" stroke="currentColor" strokeWidth="0.5" />
      <rect x="645" y="125" width="40" height="10" stroke="currentColor" strokeWidth="0.3" />

      {/* Trees */}
      <g opacity="0.5">
        {/* Fir tree left */}
        <line x1="60" y1="350" x2="60" y2="450" stroke="currentColor" strokeWidth="0.5" />
        <path d="M30 400 L60 340 L90 400" stroke="currentColor" strokeWidth="0.35" />
        <path d="M35 420 L60 360 L85 420" stroke="currentColor" strokeWidth="0.35" />
        <path d="M40 440 L60 385 L80 440" stroke="currentColor" strokeWidth="0.35" />
        {/* Fir tree right */}
        <line x1="940" y1="360" x2="940" y2="435" stroke="currentColor" strokeWidth="0.5" />
        <path d="M915 400 L940 350 L965 400" stroke="currentColor" strokeWidth="0.35" />
        <path d="M920 420 L940 375 L960 420" stroke="currentColor" strokeWidth="0.35" />
      </g>

      {/* Mountains background */}
      <path d="M0 200 L150 120 L300 180 L450 100 L600 160 L750 90 L900 150 L1000 130" stroke="currentColor" strokeWidth="0.3" opacity="0.15" />

      {/* Dimensions */}
      <line x1="150" y1="480" x2="850" y2="480" stroke="currentColor" strokeWidth="0.3" strokeDasharray="4 3" />
      <text x="500" y="500" fill="currentColor" fontSize="9" textAnchor="middle" opacity="0.35">CHALET ALPIN — ÉLÉVATION SUD — 1:100</text>
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   4. DIVIDER COMPONENT — BETWEEN SECTIONS
   ──────────────────────────────────────────────────────────────────────────── */
interface ArchDividerProps {
  drawing: "villa" | "penthouse" | "chalet" | "floorplan" | "building";
  flip?: boolean;
}

export function ArchDivider({ drawing, flip = false }: ArchDividerProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.12, 0.12, 0]);
  const x = useTransform(scrollYProgress, [0, 1], flip ? [30, -30] : [-30, 30]);

  const DrawingComponent = {
    villa: LuxuryVilla3D,
    penthouse: PenthouseView,
    chalet: ChaletElevation,
    floorplan: LuxuryVilla3D,
    building: PenthouseView,
  }[drawing];

  return (
    <div ref={ref} className="relative w-full overflow-hidden pointer-events-none" style={{ height: "clamp(200px, 25vw, 350px)" }}>
      <motion.div
        className={`absolute ${flip ? "right-[-10%]" : "left-[-10%]"} top-1/2 -translate-y-1/2 w-[90%] md:w-[70%] text-white`}
        style={{ y, opacity, x }}
      >
        <DrawingComponent />
      </motion.div>
    </div>
  );
}
