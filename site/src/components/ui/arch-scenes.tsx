"use client";
import { motion } from "framer-motion";

const D = { duration: 2, ease: [0.25, 0.46, 0.45, 0.94] as const };
const stroke = "#C4956A";

export function ModernTower({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 700" className={`pointer-events-none ${className}`} fill="none" stroke={stroke} strokeWidth="0.8">
      {/* Main structure */}
      <motion.rect x="120" y="80" width="160" height="580" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D }} />
      {/* Floors */}
      {Array.from({ length: 14 }, (_, i) => (
        <motion.line key={`f${i}`} x1="120" y1={120 + i * 40} x2="280" y2={120 + i * 40} initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.1 + i * 0.05 }} />
      ))}
      {/* Windows - 3 per floor */}
      {Array.from({ length: 14 }, (_, i) => [145, 185, 235].map((x, j) => (
        <motion.rect key={`w${i}-${j}`} x={x} y={125 + i * 40} width="20" height="28" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.3 + (i + j) * 0.03 }} />
      )))}
      {/* Roof detail */}
      <motion.polygon points="120,80 200,30 280,80" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.2 }} />
      <motion.rect x="185" y="35" width="30" height="45" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.4 }} />
      {/* Entrance */}
      <motion.rect x="170" y="610" width="60" height="50" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.5 }} />
      <motion.line x1="200" y1="610" x2="200" y2="660" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.6 }} />
      {/* Ground */}
      <motion.line x1="60" y1="660" x2="340" y2="660" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.3 }} />
      {/* Dimension lines */}
      <motion.line x1="110" y1="80" x2="110" y2="660" strokeDasharray="4 4" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.7 }} />
      <motion.line x1="105" y1="80" x2="115" y2="80" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.7 }} />
      <motion.line x1="105" y1="660" x2="115" y2="660" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.7 }} />
    </svg>
  );
}

export function LuxuryVilla({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 400" className={`pointer-events-none ${className}`} fill="none" stroke={stroke} strokeWidth="0.8">
      {/* Main house */}
      <motion.rect x="150" y="140" width="500" height="220" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D }} />
      {/* Roof */}
      <motion.polygon points="130,140 400,40 670,140" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.2 }} />
      {/* Large windows */}
      {[180, 280, 450, 550].map((x, i) => (
        <motion.rect key={i} x={x} y={180} width="60" height="100" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.3 + i * 0.1 }} />
      ))}
      {/* Door */}
      <motion.rect x="365" y={200} width="70" height="120" rx="35" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.5 }} />
      {/* Balcony */}
      <motion.line x1="200" y1="180" x2="600" y2="180" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.4 }} />
      <motion.line x1="200" y1="175" x2="200" y2="180" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.4 }} />
      <motion.line x1="600" y1="175" x2="600" y2="180" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.4 }} />
      {/* Pool */}
      <motion.rect x="180" y="380" width="250" height="10" rx="5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.7 }} />
      <motion.rect x="170" y="370" width="270" height="30" rx="5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.6 }} />
      {/* Trees */}
      {[80, 720].map((x, i) => (
        <motion.g key={`t${i}`}>
          <motion.line x1={x} y1="360" x2={x} y2="280" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.8 + i * 0.1 }} />
          <motion.ellipse cx={x} cy="260" rx="30" ry="45" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.9 + i * 0.1 }} />
        </motion.g>
      ))}
      {/* Ground */}
      <motion.line x1="40" y1="360" x2="760" y2="360" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.3 }} />
      {/* Garden path */}
      <motion.line x1="400" y1="320" x2="400" y2="360" strokeDasharray="3 3" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.7 }} />
      {/* Chimney */}
      <motion.rect x="250" y="60" width="25" height="50" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.5 }} />
    </svg>
  );
}

export function FloorPlan({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 500" className={`pointer-events-none ${className}`} fill="none" stroke={stroke} strokeWidth="0.8">
      {/* Outer walls */}
      <motion.rect x="50" y="50" width="500" height="400" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D }} />
      {/* Interior walls */}
      <motion.line x1="250" y1="50" x2="250" y2="300" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.3 }} />
      <motion.line x1="50" y1="250" x2="250" y2="250" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.4 }} />
      <motion.line x1="250" y1="300" x2="550" y2="300" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.5 }} />
      <motion.line x1="400" y1="300" x2="400" y2="450" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.6 }} />
      {/* Door arcs */}
      <motion.path d="M 250 200 A 30 30 0 0 0 220 230" strokeDasharray="3 2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.7 }} />
      <motion.path d="M 300 300 A 30 30 0 0 1 330 270" strokeDasharray="3 2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.8 }} />
      {/* Room labels */}
      <motion.text x="130" y="160" fontSize="10" fill={stroke} fillOpacity="0.4" stroke="none" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.2 }}>SALON</motion.text>
      <motion.text x="130" y="340" fontSize="10" fill={stroke} fillOpacity="0.4" stroke="none" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.3 }}>CUISINE</motion.text>
      <motion.text x="380" y="180" fontSize="10" fill={stroke} fillOpacity="0.4" stroke="none" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.4 }}>CHAMBRE</motion.text>
      <motion.text x="300" y="400" fontSize="10" fill={stroke} fillOpacity="0.4" stroke="none" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.5 }}>BUREAU</motion.text>
      <motion.text x="460" y="400" fontSize="10" fill={stroke} fillOpacity="0.4" stroke="none" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.6 }}>SDB</motion.text>
      {/* Dimensions */}
      <motion.line x1="50" y1="470" x2="550" y2="470" strokeDasharray="4 4" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.9 }} />
      <motion.text x="280" y="490" fontSize="9" fill={stroke} fillOpacity="0.3" stroke="none" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.5 }}>18.50 m</motion.text>
    </svg>
  );
}

export function CityBlock({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 900 400" className={`pointer-events-none ${className}`} fill="none" stroke={stroke} strokeWidth="0.6">
      {/* Buildings of various heights */}
      {[
        { x: 50, w: 80, h: 200 }, { x: 140, w: 60, h: 300 }, { x: 210, w: 90, h: 250 },
        { x: 310, w: 70, h: 350 }, { x: 390, w: 100, h: 180 }, { x: 500, w: 60, h: 280 },
        { x: 570, w: 80, h: 220 }, { x: 660, w: 70, h: 320 }, { x: 740, w: 90, h: 260 },
      ].map((b, i) => (
        <motion.g key={i}>
          <motion.rect x={b.x} y={380 - b.h} width={b.w} height={b.h} initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: i * 0.08 }} />
          {/* Windows */}
          {Array.from({ length: Math.floor(b.h / 35) }, (_, j) => (
            <motion.rect key={j} x={b.x + 10} y={380 - b.h + 15 + j * 35} width={b.w - 20} height="18" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.3 + i * 0.05 + j * 0.02 }} />
          ))}
        </motion.g>
      ))}
      {/* Ground */}
      <motion.line x1="20" y1="380" x2="880" y2="380" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D }} />
    </svg>
  );
}

export function IsometricHouse({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 500 400" className={`pointer-events-none ${className}`} fill="none" stroke={stroke} strokeWidth="0.8">
      {/* Front face */}
      <motion.polygon points="250,50 450,150 450,320 250,220" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D }} />
      {/* Side face */}
      <motion.polygon points="250,50 50,150 50,320 250,220" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.2 }} />
      {/* Roof front */}
      <motion.polygon points="250,50 450,150 350,100" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.3 }} />
      {/* Roof side */}
      <motion.polygon points="250,50 50,150 150,100" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.3 }} />
      {/* Windows */}
      <motion.rect x="300" y="160" width="40" height="50" transform="skewY(26.5)" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.5 }} />
      <motion.rect x="370" y="180" width="40" height="50" transform="skewY(26.5)" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.6 }} />
      {/* Door */}
      <motion.rect x="100" y="230" width="35" height="60" transform="skewY(-26.5)" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.7 }} />
      {/* Ground shadow */}
      <motion.line x1="50" y1="320" x2="450" y2="320" strokeDasharray="4 4" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.4 }} />
    </svg>
  );
}

export function InteriorView({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 400" className={`pointer-events-none ${className}`} fill="none" stroke={stroke} strokeWidth="0.7">
      {/* Room perspective - back wall */}
      <motion.rect x="100" y="60" width="400" height="280" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D }} />
      {/* Floor perspective lines */}
      <motion.line x1="0" y1="400" x2="100" y2="340" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.2 }} />
      <motion.line x1="600" y1="400" x2="500" y2="340" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.2 }} />
      {/* Ceiling perspective */}
      <motion.line x1="0" y1="0" x2="100" y2="60" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.3 }} />
      <motion.line x1="600" y1="0" x2="500" y2="60" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.3 }} />
      {/* Window on back wall */}
      <motion.rect x="200" y="100" width="200" height="160" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.4 }} />
      <motion.line x1="300" y1="100" x2="300" y2="260" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.5 }} />
      <motion.line x1="200" y1="180" x2="400" y2="180" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.5 }} />
      {/* Sofa */}
      <motion.rect x="140" y="280" width="150" height="40" rx="5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.6 }} />
      <motion.rect x="140" y="260" width="150" height="25" rx="8" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.7 }} />
      {/* Table */}
      <motion.ellipse cx="400" cy="310" rx="50" ry="20" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.8 }} />
      {/* Floor tiles */}
      {[150, 250, 350, 450].map((x, i) => (
        <motion.line key={i} x1={x} y1="340" x2={x + (x < 300 ? -50 : 50)} y2="400" strokeDasharray="3 5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.5 + i * 0.05 }} />
      ))}
    </svg>
  );
}
