"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function ModernVilla({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 500" fill="none" className={className}>
      {/* Ground line */}
      <line x1="0" y1="380" x2="800" y2="380" stroke="currentColor" strokeWidth="0.8" />
      <line x1="0" y1="382" x2="800" y2="382" stroke="currentColor" strokeWidth="0.3" strokeDasharray="8 4" />

      {/* Main structure - contemporary villa */}
      <rect x="100" y="200" width="280" height="180" stroke="currentColor" strokeWidth="0.7" />
      <rect x="380" y="240" width="320" height="140" stroke="currentColor" strokeWidth="0.7" />

      {/* Flat roof with overhang */}
      <line x1="80" y1="200" x2="400" y2="200" stroke="currentColor" strokeWidth="1" />
      <line x1="80" y1="195" x2="400" y2="195" stroke="currentColor" strokeWidth="0.3" />
      <line x1="360" y1="240" x2="720" y2="240" stroke="currentColor" strokeWidth="1" />
      <line x1="360" y1="235" x2="720" y2="235" stroke="currentColor" strokeWidth="0.3" />

      {/* Large panoramic windows - left block */}
      <rect x="120" y="220" width="100" height="80" stroke="currentColor" strokeWidth="0.5" />
      <line x1="170" y1="220" x2="170" y2="300" stroke="currentColor" strokeWidth="0.3" />
      <rect x="240" y="220" width="60" height="80" stroke="currentColor" strokeWidth="0.5" />

      {/* Door */}
      <rect x="320" y="260" width="40" height="120" stroke="currentColor" strokeWidth="0.5" />
      <line x1="340" y1="260" x2="340" y2="380" stroke="currentColor" strokeWidth="0.3" />
      <circle cx="350" cy="320" r="2" stroke="currentColor" strokeWidth="0.4" />

      {/* Windows right block */}
      <rect x="400" y="260" width="120" height="60" stroke="currentColor" strokeWidth="0.5" />
      <line x1="440" y1="260" x2="440" y2="320" stroke="currentColor" strokeWidth="0.3" />
      <line x1="480" y1="260" x2="480" y2="320" stroke="currentColor" strokeWidth="0.3" />
      <rect x="540" y="260" width="70" height="60" stroke="currentColor" strokeWidth="0.5" />
      <rect x="630" y="260" width="50" height="60" stroke="currentColor" strokeWidth="0.5" />

      {/* Lower windows */}
      <rect x="120" y="320" width="60" height="50" stroke="currentColor" strokeWidth="0.5" />
      <rect x="200" y="320" width="60" height="50" stroke="currentColor" strokeWidth="0.5" />

      {/* Garage */}
      <rect x="630" y="300" width="70" height="80" stroke="currentColor" strokeWidth="0.5" />
      <line x1="630" y1="310" x2="700" y2="310" stroke="currentColor" strokeWidth="0.3" strokeDasharray="3 2" />
      <line x1="630" y1="320" x2="700" y2="320" stroke="currentColor" strokeWidth="0.3" strokeDasharray="3 2" />
      <line x1="630" y1="330" x2="700" y2="330" stroke="currentColor" strokeWidth="0.3" strokeDasharray="3 2" />

      {/* Terrace */}
      <line x1="100" y1="380" x2="100" y2="395" stroke="currentColor" strokeWidth="0.4" />
      <line x1="380" y1="380" x2="380" y2="395" stroke="currentColor" strokeWidth="0.4" />
      <line x1="80" y1="395" x2="400" y2="395" stroke="currentColor" strokeWidth="0.5" strokeDasharray="6 3" />

      {/* Pool */}
      <rect x="100" y="410" width="180" height="60" rx="10" stroke="currentColor" strokeWidth="0.6" />
      <line x1="120" y1="430" x2="260" y2="430" stroke="currentColor" strokeWidth="0.2" strokeDasharray="4 4" />
      <line x1="120" y1="450" x2="260" y2="450" stroke="currentColor" strokeWidth="0.2" strokeDasharray="4 4" />

      {/* Dimension lines */}
      <line x1="100" y1="170" x2="380" y2="170" stroke="currentColor" strokeWidth="0.3" />
      <line x1="100" y1="165" x2="100" y2="175" stroke="currentColor" strokeWidth="0.3" />
      <line x1="380" y1="165" x2="380" y2="175" stroke="currentColor" strokeWidth="0.3" />
      <text x="240" y="165" fill="currentColor" fontSize="9" textAnchor="middle" opacity="0.6">18.00</text>

      <line x1="380" y1="170" x2="700" y2="170" stroke="currentColor" strokeWidth="0.3" />
      <line x1="700" y1="165" x2="700" y2="175" stroke="currentColor" strokeWidth="0.3" />
      <text x="540" y="165" fill="currentColor" fontSize="9" textAnchor="middle" opacity="0.6">20.50</text>

      {/* Height dimension */}
      <line x1="740" y1="200" x2="740" y2="380" stroke="currentColor" strokeWidth="0.3" />
      <line x1="735" y1="200" x2="745" y2="200" stroke="currentColor" strokeWidth="0.3" />
      <line x1="735" y1="380" x2="745" y2="380" stroke="currentColor" strokeWidth="0.3" />
      <text x="755" y="295" fill="currentColor" fontSize="8" opacity="0.5" transform="rotate(90 755 295)">7.20</text>

      {/* Trees */}
      <circle cx="50" cy="340" r="25" stroke="currentColor" strokeWidth="0.4" strokeDasharray="4 3" />
      <circle cx="50" cy="335" r="18" stroke="currentColor" strokeWidth="0.3" strokeDasharray="3 3" />
      <line x1="50" y1="365" x2="50" y2="380" stroke="currentColor" strokeWidth="0.5" />

      <circle cx="760" cy="350" r="20" stroke="currentColor" strokeWidth="0.4" strokeDasharray="4 3" />
      <line x1="760" y1="370" x2="760" y2="380" stroke="currentColor" strokeWidth="0.5" />

      {/* Landscaping dots */}
      {Array.from({ length: 15 }).map((_, i) => (
        <circle key={`g${i}`} cx={320 + i * 25} cy={400 + Math.sin(i) * 3} r="1" fill="currentColor" opacity="0.3" />
      ))}

      {/* Scale marker */}
      <line x1="50" y1="470" x2="150" y2="470" stroke="currentColor" strokeWidth="0.5" />
      <line x1="50" y1="465" x2="50" y2="475" stroke="currentColor" strokeWidth="0.4" />
      <line x1="150" y1="465" x2="150" y2="475" stroke="currentColor" strokeWidth="0.4" />
      <text x="100" y="485" fill="currentColor" fontSize="8" textAnchor="middle" opacity="0.5">5 m</text>
    </svg>
  );
}

function FloorPlanDetailed({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 700 600" fill="none" className={className}>
      {/* Outer walls */}
      <rect x="50" y="50" width="600" height="500" stroke="currentColor" strokeWidth="1.5" />

      {/* Interior walls */}
      <line x1="300" y1="50" x2="300" y2="350" stroke="currentColor" strokeWidth="1.2" />
      <line x1="300" y1="400" x2="300" y2="550" stroke="currentColor" strokeWidth="1.2" />
      <line x1="50" y1="300" x2="250" y2="300" stroke="currentColor" strokeWidth="1" />
      <line x1="300" y1="350" x2="650" y2="350" stroke="currentColor" strokeWidth="1" />
      <line x1="500" y1="50" x2="500" y2="350" stroke="currentColor" strokeWidth="1" />
      <line x1="50" y1="430" x2="300" y2="430" stroke="currentColor" strokeWidth="1" />

      {/* Door arcs */}
      <path d="M250 300 A50 50 0 0 0 300 350" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 2" />
      <path d="M300 400 A50 50 0 0 1 250 350" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 2" />
      <path d="M460 350 A40 40 0 0 0 500 310" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 2" />

      {/* Room labels */}
      <text x="175" y="180" fill="currentColor" fontSize="14" textAnchor="middle" opacity="0.5">SÉJOUR</text>
      <text x="175" y="200" fill="currentColor" fontSize="10" textAnchor="middle" opacity="0.3">38.5 m²</text>

      <text x="400" y="200" fill="currentColor" fontSize="13" textAnchor="middle" opacity="0.5">CUISINE</text>
      <text x="400" y="218" fill="currentColor" fontSize="10" textAnchor="middle" opacity="0.3">22.0 m²</text>

      <text x="575" y="200" fill="currentColor" fontSize="12" textAnchor="middle" opacity="0.5">BUREAU</text>
      <text x="575" y="218" fill="currentColor" fontSize="10" textAnchor="middle" opacity="0.3">15.0 m²</text>

      <text x="175" y="370" fill="currentColor" fontSize="12" textAnchor="middle" opacity="0.5">CH. 1</text>
      <text x="175" y="388" fill="currentColor" fontSize="10" textAnchor="middle" opacity="0.3">16.0 m²</text>

      <text x="175" y="490" fill="currentColor" fontSize="12" textAnchor="middle" opacity="0.5">SDB</text>
      <text x="175" y="508" fill="currentColor" fontSize="10" textAnchor="middle" opacity="0.3">9.5 m²</text>

      <text x="475" y="460" fill="currentColor" fontSize="13" textAnchor="middle" opacity="0.5">CH. MASTER</text>
      <text x="475" y="480" fill="currentColor" fontSize="10" textAnchor="middle" opacity="0.3">28.0 m²</text>

      {/* Kitchen fixtures */}
      <rect x="310" y="60" width="80" height="20" stroke="currentColor" strokeWidth="0.4" rx="2" />
      <rect x="310" y="90" width="30" height="30" stroke="currentColor" strokeWidth="0.4" rx="2" />
      <circle cx="365" cy="105" r="12" stroke="currentColor" strokeWidth="0.4" />

      {/* Bathroom fixtures */}
      <rect x="60" y="440" width="50" height="25" stroke="currentColor" strokeWidth="0.4" rx="5" />
      <circle cx="140" cy="500" r="15" stroke="currentColor" strokeWidth="0.4" />
      <rect x="200" y="440" width="40" height="20" stroke="currentColor" strokeWidth="0.4" rx="3" />

      {/* Stairs */}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={`s${i}`} x1={510 + i * 11} y1="60" x2={510 + i * 11} y2="110" stroke="currentColor" strokeWidth="0.4" />
      ))}
      <path d="M510 85 L640 85" stroke="currentColor" strokeWidth="0.3" />
      <polygon points="640,80 640,90 650,85" fill="currentColor" opacity="0.4" />

      {/* Compass */}
      <circle cx="80" cy="80" r="18" stroke="currentColor" strokeWidth="0.5" />
      <text x="80" y="72" fill="currentColor" fontSize="10" textAnchor="middle" fontWeight="bold" opacity="0.6">N</text>
      <line x1="80" y1="62" x2="80" y2="75" stroke="currentColor" strokeWidth="0.8" />
      <line x1="80" y1="85" x2="80" y2="98" stroke="currentColor" strokeWidth="0.4" />

      {/* Windows on exterior walls */}
      <rect x="80" y="46" width="60" height="8" fill="currentColor" opacity="0.15" />
      <rect x="180" y="46" width="80" height="8" fill="currentColor" opacity="0.15" />
      <rect x="350" y="46" width="100" height="8" fill="currentColor" opacity="0.15" />
      <rect x="46" y="120" width="8" height="60" fill="currentColor" opacity="0.15" />
      <rect x="46" y="340" width="8" height="50" fill="currentColor" opacity="0.15" />

      {/* Dimension text */}
      <text x="350" y="570" fill="currentColor" fontSize="9" textAnchor="middle" opacity="0.4">PLAN RDC — 1:100</text>
    </svg>
  );
}

function BuildingSection({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 700" fill="none" className={className}>
      {/* Ground */}
      <line x1="30" y1="600" x2="570" y2="600" stroke="currentColor" strokeWidth="0.8" />
      <rect x="30" y="600" width="540" height="30" stroke="currentColor" strokeWidth="0.3" fill="currentColor" opacity="0.03" />

      {/* Building outline */}
      <rect x="80" y="100" width="440" height="500" stroke="currentColor" strokeWidth="1.2" />

      {/* Floor slabs */}
      {Array.from({ length: 10 }).map((_, i) => (
        <g key={`fl${i}`}>
          <line x1="80" y1={150 + i * 45} x2="520" y2={150 + i * 45} stroke="currentColor" strokeWidth="0.6" />
          <text x="545" y={140 + i * 45} fill="currentColor" fontSize="7" opacity="0.35">+{(9 - i) * 3}.00</text>
        </g>
      ))}

      {/* Windows - each floor */}
      {Array.from({ length: 10 }).map((_, row) =>
        Array.from({ length: 8 }).map((_, col) => (
          <rect key={`w${row}-${col}`} x={95 + col * 52} y={110 + row * 45} width="30" height="30" stroke="currentColor" strokeWidth="0.35" rx="1" />
        ))
      )}

      {/* Balconies on some floors */}
      {[0, 2, 4, 6, 8].map((row) => (
        <g key={`bal${row}`}>
          <line x1="75" y1={150 + row * 45} x2="80" y2={150 + row * 45} stroke="currentColor" strokeWidth="0.5" />
          <line x1="75" y1={110 + row * 45} x2="75" y2={150 + row * 45} stroke="currentColor" strokeWidth="0.3" />
          <line x1="520" y1={150 + row * 45} x2="525" y2={150 + row * 45} stroke="currentColor" strokeWidth="0.5" />
          <line x1="525" y1={110 + row * 45} x2="525" y2={150 + row * 45} stroke="currentColor" strokeWidth="0.3" />
        </g>
      ))}

      {/* Entrance */}
      <rect x="240" y="555" width="120" height="45" stroke="currentColor" strokeWidth="0.6" />
      <path d="M270 600 L300 570 L330 600" stroke="currentColor" strokeWidth="0.4" fill="none" />

      {/* Rooftop */}
      <rect x="200" y="80" width="200" height="20" stroke="currentColor" strokeWidth="0.5" />
      <rect x="280" y="50" width="40" height="30" stroke="currentColor" strokeWidth="0.4" />
      <line x1="295" y1="40" x2="295" y2="50" stroke="currentColor" strokeWidth="0.5" />
      <line x1="305" y1="45" x2="305" y2="50" stroke="currentColor" strokeWidth="0.4" />

      {/* Height dimension */}
      <line x1="40" y1="100" x2="40" y2="600" stroke="currentColor" strokeWidth="0.3" strokeDasharray="4 3" />
      <line x1="35" y1="100" x2="45" y2="100" stroke="currentColor" strokeWidth="0.3" />
      <line x1="35" y1="600" x2="45" y2="600" stroke="currentColor" strokeWidth="0.3" />
      <text x="30" y="350" fill="currentColor" fontSize="8" textAnchor="middle" opacity="0.4" transform="rotate(-90 30 350)">30.00 m</text>

      {/* Width dimension */}
      <line x1="80" y1="640" x2="520" y2="640" stroke="currentColor" strokeWidth="0.3" strokeDasharray="4 3" />
      <line x1="80" y1="635" x2="80" y2="645" stroke="currentColor" strokeWidth="0.3" />
      <line x1="520" y1="635" x2="520" y2="645" stroke="currentColor" strokeWidth="0.3" />
      <text x="300" y="655" fill="currentColor" fontSize="8" textAnchor="middle" opacity="0.4">28.00 m</text>

      {/* Label */}
      <text x="300" y="680" fill="currentColor" fontSize="9" textAnchor="middle" opacity="0.35">FAÇADE SUD — 1:200</text>
    </svg>
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

  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [50, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {variant === "villa" && (
        <motion.div className="absolute right-[-5%] top-[10%] w-[70%] md:w-[55%] text-white/[0.08]" style={{ y: y1, opacity }}>
          <ModernVilla />
        </motion.div>
      )}

      {variant === "floorplan" && (
        <>
          <motion.div className="absolute left-[-5%] top-[5%] w-[60%] md:w-[45%] text-white/[0.07]" style={{ y: y2, opacity }}>
            <FloorPlanDetailed />
          </motion.div>
          <motion.div className="absolute right-[-8%] bottom-[5%] w-[45%] md:w-[30%] text-white/[0.05]" style={{ y: y1, opacity }}>
            <ModernVilla />
          </motion.div>
        </>
      )}

      {variant === "building" && (
        <motion.div className="absolute right-[0%] top-[0%] w-[50%] md:w-[35%] text-white/[0.08]" style={{ y: y1, opacity }}>
          <BuildingSection />
        </motion.div>
      )}

      {variant === "mixed" && (
        <>
          <motion.div className="absolute left-[-8%] top-[5%] w-[55%] md:w-[40%] text-white/[0.06]" style={{ y: y2, opacity }}>
            <FloorPlanDetailed />
          </motion.div>
          <motion.div className="absolute right-[-5%] bottom-[5%] w-[50%] md:w-[35%] text-white/[0.07]" style={{ y: y1, opacity }}>
            <BuildingSection />
          </motion.div>
        </>
      )}
    </div>
  );
}
