"use client";

import { motion } from "framer-motion";

const EASE = [0.165, 0.84, 0.44, 1] as const;
const draw = (delay = 0, dur = 1.5) => ({
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1, transition: { duration: dur, delay, ease: EASE } },
});

/* ================================================================
   1. FLOOR PLAN — Vue du dessus d'un appartement
   ================================================================ */
export function FloorPlanSVG({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 800 500"
      fill="none"
      className={`w-full ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Murs extérieurs */}
      <motion.rect x="50" y="50" width="700" height="400" stroke="#C4956A" strokeWidth="3" variants={draw(0)} />
      {/* Pièces intérieures */}
      <motion.line x1="350" y1="50" x2="350" y2="280" stroke="#C4956A" strokeWidth="2" variants={draw(0.2)} />
      <motion.line x1="350" y1="280" x2="750" y2="280" stroke="#C4956A" strokeWidth="2" variants={draw(0.3)} />
      <motion.line x1="50" y1="300" x2="350" y2="300" stroke="#C4956A" strokeWidth="2" variants={draw(0.4)} />
      <motion.line x1="200" y1="300" x2="200" y2="450" stroke="#C4956A" strokeWidth="2" variants={draw(0.5)} />
      <motion.line x1="550" y1="280" x2="550" y2="450" stroke="#C4956A" strokeWidth="2" variants={draw(0.5)} />
      <motion.line x1="550" y1="50" x2="550" y2="200" stroke="#C4956A" strokeWidth="1.5" variants={draw(0.6)} />
      {/* Portes (arcs) */}
      <motion.path d="M 350 140 A 40 40 0 0 1 390 180" stroke="#C4956A" strokeWidth="1.5" strokeDasharray="4 3" variants={draw(0.7)} />
      <motion.path d="M 250 300 A 35 35 0 0 0 285 265" stroke="#C4956A" strokeWidth="1.5" strokeDasharray="4 3" variants={draw(0.8)} />
      <motion.path d="M 550 340 A 35 35 0 0 1 585 305" stroke="#C4956A" strokeWidth="1.5" strokeDasharray="4 3" variants={draw(0.9)} />
      {/* Fenêtres (doubles lignes) */}
      {[[100, 50], [450, 50], [650, 50], [750, 150], [750, 350], [50, 200]].map(([x, y], i) => (
        <motion.g key={i} variants={draw(0.4 + i * 0.1)}>
          <line x1={x - 15} y1={y} x2={x + 15} y2={y} stroke="#C4956A" strokeWidth="3" />
          <line x1={x - 12} y1={y - 4} x2={x + 12} y2={y - 4} stroke="#C4956A" strokeWidth="1" />
        </motion.g>
      ))}
      {/* Labels des pièces */}
      {[
        { x: 180, y: 180, text: "SALON", size: 14 },
        { x: 500, y: 170, text: "CHAMBRE 1", size: 12 },
        { x: 660, y: 170, text: "CH. 2", size: 11 },
        { x: 120, y: 380, text: "CUISINE", size: 12 },
        { x: 280, y: 380, text: "SDB", size: 11 },
        { x: 450, y: 370, text: "BUREAU", size: 12 },
        { x: 660, y: 370, text: "ENTRÉE", size: 12 },
      ].map((l, i) => (
        <motion.text key={i} x={l.x} y={l.y} fill="#C4956A" fontSize={l.size} fontFamily="monospace" textAnchor="middle"
          initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 1.2 + i * 0.1, duration: 0.5 }}>
          {l.text}
        </motion.text>
      ))}
      {/* Dimensions */}
      <motion.g variants={draw(1.0)}>
        <line x1="50" y1="30" x2="750" y2="30" stroke="#C4956A" strokeWidth="0.5" />
        <line x1="50" y1="25" x2="50" y2="35" stroke="#C4956A" strokeWidth="0.5" />
        <line x1="750" y1="25" x2="750" y2="35" stroke="#C4956A" strokeWidth="0.5" />
        <text x="400" y="25" fill="#C4956A" fontSize="10" fontFamily="monospace" textAnchor="middle" opacity="0.4">24.00 m</text>
      </motion.g>
      {/* Boussole */}
      <motion.g variants={draw(1.3)}>
        <circle cx="720" cy="470" r="15" stroke="#C4956A" strokeWidth="0.5" fill="none" />
        <line x1="720" y1="458" x2="720" y2="470" stroke="#C4956A" strokeWidth="1.5" />
        <text x="720" y="454" fill="#C4956A" fontSize="8" fontFamily="monospace" textAnchor="middle" opacity="0.5">N</text>
      </motion.g>
    </motion.svg>
  );
}

/* ================================================================
   2. BUILDING ELEVATION — Vue latérale d'un immeuble 5 étages
   ================================================================ */
export function BuildingElevationSVG({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 600 450"
      fill="none"
      className={`w-full ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Sol */}
      <motion.line x1="50" y1="400" x2="550" y2="400" stroke="#C4956A" strokeWidth="2" variants={draw(0)} />
      {/* Hachurage sol */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.line key={i} x1={70 + i * 25} y1="400" x2={60 + i * 25} y2="415" stroke="#C4956A" strokeWidth="0.5" opacity={0.3} variants={draw(0.1)} />
      ))}
      {/* Structure bâtiment */}
      <motion.rect x="120" y="80" width="360" height="320" stroke="#C4956A" strokeWidth="2.5" variants={draw(0.2)} />
      {/* Étages (lignes horizontales) */}
      {[144, 208, 272, 336].map((y, i) => (
        <motion.line key={i} x1="120" y1={y} x2="480" y2={y} stroke="#C4956A" strokeWidth="1" variants={draw(0.3 + i * 0.1)} />
      ))}
      {/* Fenêtres — grille 5 colonnes x 5 étages */}
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 5 }).map((_, col) => (
          <motion.rect
            key={`${row}-${col}`}
            x={145 + col * 70}
            y={90 + row * 64}
            width="30"
            height="45"
            stroke="#C4956A"
            strokeWidth="1"
            variants={draw(0.5 + row * 0.05 + col * 0.03)}
          />
        ))
      )}
      {/* Entrée */}
      <motion.rect x="270" y="355" width="60" height="45" stroke="#C4956A" strokeWidth="1.5" variants={draw(0.8)} />
      <motion.line x1="300" y1="355" x2="300" y2="400" stroke="#C4956A" strokeWidth="1" strokeDasharray="3 2" variants={draw(0.9)} />
      {/* Auvent entrée */}
      <motion.line x1="260" y1="350" x2="340" y2="350" stroke="#C4956A" strokeWidth="2" variants={draw(0.85)} />
      {/* Toit — parapet */}
      <motion.rect x="115" y="70" width="370" height="15" stroke="#C4956A" strokeWidth="1.5" variants={draw(0.4)} />
      {/* Antenne/penthouse */}
      <motion.rect x="250" y="35" width="100" height="35" stroke="#C4956A" strokeWidth="1" variants={draw(0.6)} />
      <motion.line x1="300" y1="10" x2="300" y2="35" stroke="#C4956A" strokeWidth="1" variants={draw(0.7)} />
      {/* Labels niveaux */}
      {["R+4", "R+3", "R+2", "R+1", "RDC"].map((label, i) => (
        <motion.text key={label} x="100" y={120 + i * 64} fill="#C4956A" fontSize="9" fontFamily="monospace" textAnchor="end"
          initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} transition={{ delay: 1 + i * 0.1 }}>
          {label}
        </motion.text>
      ))}
      {/* Dimension hauteur */}
      <motion.g variants={draw(1.0)}>
        <line x1="520" y1="80" x2="520" y2="400" stroke="#C4956A" strokeWidth="0.5" />
        <line x1="515" y1="80" x2="525" y2="80" stroke="#C4956A" strokeWidth="0.5" />
        <line x1="515" y1="400" x2="525" y2="400" stroke="#C4956A" strokeWidth="0.5" />
        <text x="540" y="245" fill="#C4956A" fontSize="9" fontFamily="monospace" opacity="0.4" transform="rotate(90, 540, 245)">16.50 m</text>
      </motion.g>
    </motion.svg>
  );
}

/* ================================================================
   3. ISOMETRIC VILLA — Vue isométrique d'une villa moderne
   ================================================================ */
export function IsometricVillaSVG({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 500 400"
      fill="none"
      className={`w-full ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Base / terrain */}
      <motion.path d="M 250 350 L 450 250 L 250 150 L 50 250 Z" stroke="#C4956A" strokeWidth="1" strokeDasharray="6 4" variants={draw(0)} />
      {/* Corps maison */}
      <motion.path d="M 150 230 L 150 150 L 350 150 L 350 230" stroke="#C4956A" strokeWidth="2" variants={draw(0.2)} />
      <motion.path d="M 150 150 L 250 100 L 350 150" stroke="#C4956A" strokeWidth="2" variants={draw(0.3)} />
      {/* Face droite */}
      <motion.path d="M 350 150 L 420 185 L 420 265 L 350 230" stroke="#C4956A" strokeWidth="2" variants={draw(0.35)} />
      <motion.path d="M 350 150 L 420 185" stroke="#C4956A" strokeWidth="2" variants={draw(0.3)} />
      {/* Toit plat avec épaisseur */}
      <motion.path d="M 145 150 L 250 95 L 355 150" stroke="#C4956A" strokeWidth="1" variants={draw(0.4)} />
      <motion.path d="M 355 150 L 425 185" stroke="#C4956A" strokeWidth="1" variants={draw(0.4)} />
      {/* Grandes fenêtres face avant */}
      {[{ x: 175, w: 45 }, { x: 235, w: 45 }, { x: 295, w: 40 }].map((f, i) => (
        <motion.rect key={i} x={f.x} y={165} width={f.w} height={55} stroke="#C4956A" strokeWidth="1.5" variants={draw(0.5 + i * 0.1)} />
      ))}
      {/* Fenêtres face droite */}
      {[195, 220].map((y, i) => (
        <motion.path key={i} d={`M 365 ${y} L 405 ${y + 17} L 405 ${y + 40} L 365 ${y + 23} Z`} stroke="#C4956A" strokeWidth="1" variants={draw(0.6 + i * 0.1)} />
      ))}
      {/* Porte d'entrée */}
      <motion.rect x="240" y="190" width="30" height="40" stroke="#C4956A" strokeWidth="1.5" variants={draw(0.7)} />
      <motion.circle cx="265" cy="212" r="2" stroke="#C4956A" strokeWidth="1" variants={draw(0.75)} />
      {/* Garage */}
      <motion.rect x="80" y="200" width="60" height="45" stroke="#C4956A" strokeWidth="1.5" variants={draw(0.6)} />
      <motion.path d="M 80 200 L 80 180 L 140 180 L 140 200" stroke="#C4956A" strokeWidth="1.5" variants={draw(0.55)} />
      {/* Lignes porte garage */}
      {[210, 220, 230].map((y, i) => (
        <motion.line key={i} x1="85" y1={y} x2="135" y2={y} stroke="#C4956A" strokeWidth="0.5" variants={draw(0.65 + i * 0.03)} />
      ))}
      {/* Piscine */}
      <motion.path d="M 180 290 L 320 290 L 350 310 L 210 310 Z" stroke="#C4956A" strokeWidth="1.5" strokeDasharray="5 3" variants={draw(0.8)} />
      <motion.text x="265" y="305" fill="#C4956A" fontSize="8" fontFamily="monospace" textAnchor="middle" opacity="0.3">PISCINE</motion.text>
      {/* Arbres (cercles simples) */}
      {[{ cx: 420, cy: 310 }, { cx: 80, cy: 290 }, { cx: 60, cy: 310 }].map((t, i) => (
        <motion.g key={i} variants={draw(0.9 + i * 0.05)}>
          <circle cx={t.cx} cy={t.cy} r="15" stroke="#C4956A" strokeWidth="1" />
          <circle cx={t.cx} cy={t.cy} r="8" stroke="#C4956A" strokeWidth="0.5" />
          <line x1={t.cx} y1={t.cy + 15} x2={t.cx} y2={t.cy + 25} stroke="#C4956A" strokeWidth="1" />
        </motion.g>
      ))}
      {/* Chemin d'accès */}
      <motion.path d="M 255 230 L 255 290" stroke="#C4956A" strokeWidth="1" strokeDasharray="4 4" variants={draw(0.85)} />
    </motion.svg>
  );
}

/* ================================================================
   4. SKYLINE PANORAMA — Ligne d'horizon avec buildings variés
   ================================================================ */
export function SkylineSVG({ className = "" }: { className?: string }) {
  const buildings = [
    { x: 30, w: 40, h: 80 }, { x: 80, w: 25, h: 140 }, { x: 115, w: 35, h: 100 },
    { x: 160, w: 20, h: 180 }, { x: 190, w: 45, h: 120 }, { x: 245, w: 30, h: 200 },
    { x: 285, w: 50, h: 90 }, { x: 345, w: 22, h: 160 }, { x: 377, w: 40, h: 130 },
    { x: 427, w: 28, h: 220 }, { x: 465, w: 45, h: 110 }, { x: 520, w: 20, h: 170 },
    { x: 550, w: 35, h: 95 }, { x: 595, w: 25, h: 150 }, { x: 630, w: 40, h: 75 },
    { x: 680, w: 30, h: 190 }, { x: 720, w: 45, h: 105 },
  ];
  const base = 280;

  return (
    <motion.svg
      viewBox="0 0 800 300"
      fill="none"
      className={`w-full ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Horizon line */}
      <motion.line x1="0" y1={base} x2="800" y2={base} stroke="#C4956A" strokeWidth="1" variants={draw(0)} />
      {/* Buildings */}
      {buildings.map((b, i) => (
        <motion.g key={i}>
          <motion.rect
            x={b.x} y={base - b.h} width={b.w} height={b.h}
            stroke="#C4956A" strokeWidth="1.5"
            variants={draw(0.1 + i * 0.06, 0.8)}
          />
          {/* Windows grid */}
          {Array.from({ length: Math.floor(b.h / 20) }).map((_, row) =>
            Array.from({ length: Math.max(1, Math.floor(b.w / 15)) }).map((_, col) => (
              <motion.rect
                key={`${row}-${col}`}
                x={b.x + 5 + col * 13}
                y={base - b.h + 8 + row * 18}
                width="6" height="10"
                stroke="#C4956A" strokeWidth="0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ delay: 0.8 + i * 0.04 + row * 0.02 }}
              />
            ))
          )}
        </motion.g>
      ))}
      {/* Stars / dots in sky */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.circle
          key={i}
          cx={50 + i * 65 + Math.sin(i) * 20}
          cy={20 + Math.cos(i * 2) * 15 + i * 3}
          r="1.5"
          fill="#C4956A"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 3, delay: 1.5 + i * 0.2, repeat: Infinity }}
        />
      ))}
    </motion.svg>
  );
}

/* ================================================================
   5. SECTION DIVIDER — Trait architectural entre sections
   ================================================================ */
export function ArchDivider({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`py-16 px-[4vw] ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <svg viewBox="0 0 1200 60" fill="none" className="w-full max-w-[1200px] mx-auto">
        <motion.line x1="0" y1="30" x2="1200" y2="30" stroke="#C4956A" strokeWidth="0.5"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }} />
        {/* Tick marks */}
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.line key={i}
            x1={i * 50} y1={i % 5 === 0 ? 20 : 25} x2={i * 50} y2={i % 5 === 0 ? 40 : 35}
            stroke="#C4956A" strokeWidth={i % 5 === 0 ? "1" : "0.5"}
            initial={{ opacity: 0 }} animate={{ opacity: i % 5 === 0 ? 0.4 : 0.2 }}
            transition={{ delay: 0.5 + i * 0.03 }} />
        ))}
        {/* Center diamond */}
        <motion.path d="M 600 20 L 610 30 L 600 40 L 590 30 Z" stroke="#C4956A" strokeWidth="1"
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.5 }}
          transition={{ delay: 0.8, duration: 0.4 }} />
      </svg>
    </motion.div>
  );
}

/* ================================================================
   6. BACKGROUND OVERLAY — Grille blueprint pour fond de section
   ================================================================ */
export function BlueprintOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <pattern id="bp-fine" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C4956A" strokeWidth="0.3" opacity="0.06" />
          </pattern>
          <pattern id="bp-bold" width="200" height="200" patternUnits="userSpaceOnUse">
            <path d="M 200 0 L 0 0 0 200" fill="none" stroke="#C4956A" strokeWidth="0.6" opacity="0.1" />
            <circle cx="0" cy="0" r="2" fill="#C4956A" opacity="0.08" />
            <circle cx="200" cy="0" r="2" fill="#C4956A" opacity="0.08" />
            <circle cx="0" cy="200" r="2" fill="#C4956A" opacity="0.08" />
            <circle cx="200" cy="200" r="2" fill="#C4956A" opacity="0.08" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bp-fine)" />
        <rect width="100%" height="100%" fill="url(#bp-bold)" />
      </svg>
    </div>
  );
}
