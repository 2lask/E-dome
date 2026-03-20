"use client";

import { motion } from "framer-motion";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;
const S = "#C4956A"; // stroke color

/* ================================================================== */
/*  1. HERO — Grand building moderne en perspective                   */
/* ================================================================== */
export function ArchBgModernTower() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.svg viewBox="0 0 1200 800" className="absolute right-[-5%] top-[5%] w-[70%] h-auto opacity-[0.06]" initial={{ opacity: 0 }} animate={{ opacity: 0.06 }} transition={{ duration: 2 }}>
        {/* Tower main body */}
        <motion.rect x="500" y="100" width="200" height="600" fill="none" stroke={S} strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, ease: EASE }} />
        {/* Floors */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.line key={`f${i}`} x1="500" y1={150 + i * 50} x2="700" y2={150 + i * 50} stroke={S} strokeWidth="0.8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.5 + i * 0.1, ease: EASE }} />
        ))}
        {/* Windows grid */}
        {Array.from({ length: 12 }).map((_, row) =>
          Array.from({ length: 4 }).map((_, col) => (
            <motion.rect key={`w${row}-${col}`} x={520 + col * 42} y={110 + row * 50} width="25" height="35" fill="none" stroke={S} strokeWidth="0.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 + row * 0.05 + col * 0.05, duration: 0.5 }} />
          ))
        )}
        {/* Left wing */}
        <motion.path d="M500,300 L350,350 L350,700 L500,700" fill="none" stroke={S} strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1, ease: EASE }} />
        {/* Right wing */}
        <motion.path d="M700,250 L850,300 L850,700 L700,700" fill="none" stroke={S} strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1.2, ease: EASE }} />
        {/* Ground line */}
        <motion.line x1="200" y1="700" x2="1000" y2="700" stroke={S} strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.3, ease: EASE }} />
        {/* Roof detail */}
        <motion.path d="M520,100 L600,50 L680,100" fill="none" stroke={S} strokeWidth="1.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 2, ease: EASE }} />
        {/* Dimension lines */}
        <motion.line x1="480" y1="100" x2="480" y2="700" stroke={S} strokeWidth="0.4" strokeDasharray="4,4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 2.5 }} />
        <motion.text x="470" y="400" fill={S} fontSize="10" textAnchor="end" opacity="0.5">30m</motion.text>
      </motion.svg>
    </div>
  );
}

/* ================================================================== */
/*  2. CONSTAT — Plan d'étage fragmenté                                */
/* ================================================================== */
export function ArchBgFloorPlan() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.svg viewBox="0 0 1000 600" className="absolute left-[-10%] bottom-[-10%] w-[80%] h-auto opacity-[0.05]" initial={{ opacity: 0 }} whileInView={{ opacity: 0.05 }} viewport={{ once: true }} transition={{ duration: 2 }}>
        {/* Outer walls */}
        <motion.rect x="100" y="50" width="800" height="500" fill="none" stroke={S} strokeWidth="2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2.5, ease: EASE }} />
        {/* Interior walls */}
        <motion.line x1="400" y1="50" x2="400" y2="350" stroke={S} strokeWidth="1.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.8, ease: EASE }} />
        <motion.line x1="400" y1="350" x2="700" y2="350" stroke={S} strokeWidth="1.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 1, ease: EASE }} />
        <motion.line x1="700" y1="50" x2="700" y2="550" stroke={S} strokeWidth="1.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 1.2, ease: EASE }} />
        <motion.line x1="100" y1="300" x2="400" y2="300" stroke={S} strokeWidth="1.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 1.4, ease: EASE }} />
        {/* Door arcs */}
        <motion.path d="M380,350 A20,20 0 0,1 400,330" fill="none" stroke={S} strokeWidth="0.8" strokeDasharray="3,3" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 2 }} />
        <motion.path d="M400,280 A20,20 0 0,0 420,300" fill="none" stroke={S} strokeWidth="0.8" strokeDasharray="3,3" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 2.2 }} />
        {/* Room labels */}
        {[{ x: 250, y: 180, t: "SALON" }, { x: 250, y: 420, t: "CUISINE" }, { x: 550, y: 200, t: "CHAMBRE 1" }, { x: 550, y: 450, t: "CHAMBRE 2" }, { x: 820, y: 300, t: "SDB" }].map((r, i) => (
          <motion.text key={i} x={r.x} y={r.y} fill={S} fontSize="12" textAnchor="middle" initial={{ opacity: 0 }} whileInView={{ opacity: 0.4 }} viewport={{ once: true }} transition={{ delay: 2.5 + i * 0.15 }}>{r.t}</motion.text>
        ))}
        {/* Dimension lines */}
        <motion.line x1="100" y1="30" x2="900" y2="30" stroke={S} strokeWidth="0.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 3 }} />
        <motion.text x="500" y="25" fill={S} fontSize="9" textAnchor="middle" opacity="0.4">24.00 m</motion.text>
      </motion.svg>
    </div>
  );
}

/* ================================================================== */
/*  3. SOLUTION — Isometric villa                                      */
/* ================================================================== */
export function ArchBgIsometricVilla() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.svg viewBox="0 0 800 600" className="absolute right-[-5%] top-[10%] w-[60%] h-auto opacity-[0.05]" initial={{ opacity: 0 }} whileInView={{ opacity: 0.05 }} viewport={{ once: true }} transition={{ duration: 2 }}>
        {/* Base */}
        <motion.path d="M400,400 L600,300 L600,180 L400,280 Z" fill="none" stroke={S} strokeWidth="1.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, ease: EASE }} />
        <motion.path d="M400,400 L200,300 L200,180 L400,280 Z" fill="none" stroke={S} strokeWidth="1.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, delay: 0.3, ease: EASE }} />
        {/* Roof */}
        <motion.path d="M200,180 L400,80 L600,180 L400,280 Z" fill="none" stroke={S} strokeWidth="1.2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, delay: 0.6, ease: EASE }} />
        {/* Windows left face */}
        {[0, 1, 2].map((i) => (
          <motion.rect key={`wl${i}`} x={250 + i * 45} y={250 + i * -25} width="30" height="40" fill="none" stroke={S} strokeWidth="0.8" transform={`skewY(-26.5)`} initial={{ opacity: 0 }} whileInView={{ opacity: 0.6 }} viewport={{ once: true }} transition={{ delay: 1.5 + i * 0.15 }} />
        ))}
        {/* Windows right face */}
        {[0, 1, 2].map((i) => (
          <motion.rect key={`wr${i}`} x={440 + i * 45} y={285 + i * 25} width="30" height="40" fill="none" stroke={S} strokeWidth="0.8" transform={`skewY(26.5)`} initial={{ opacity: 0 }} whileInView={{ opacity: 0.6 }} viewport={{ once: true }} transition={{ delay: 1.8 + i * 0.15 }} />
        ))}
        {/* Pool */}
        <motion.path d="M250,420 L350,370 L500,440 L400,490 Z" fill="none" stroke={S} strokeWidth="0.8" strokeDasharray="4,2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 2.5, ease: EASE }} />
        <motion.text x="375" y="440" fill={S} fontSize="8" textAnchor="middle" opacity="0.3">PISCINE</motion.text>
        {/* Garden trees */}
        {[{ cx: 180, cy: 380 }, { cx: 650, cy: 350 }, { cx: 620, cy: 420 }].map((t, i) => (
          <motion.circle key={i} cx={t.cx} cy={t.cy} r="15" fill="none" stroke={S} strokeWidth="0.6" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 3 + i * 0.2, type: "spring" }} />
        ))}
        {/* Ground shadow */}
        <motion.ellipse cx="400" cy="450" rx="250" ry="30" fill="none" stroke={S} strokeWidth="0.4" strokeDasharray="2,4" initial={{ opacity: 0 }} whileInView={{ opacity: 0.3 }} viewport={{ once: true }} transition={{ delay: 2, duration: 1 }} />
      </motion.svg>
    </div>
  );
}

/* ================================================================== */
/*  4. MARKETPLACE — Skyline panoramique                               */
/* ================================================================== */
export function ArchBgSkyline() {
  const buildings = [
    { x: 50, w: 60, h: 250 }, { x: 130, w: 40, h: 350 }, { x: 190, w: 70, h: 280 },
    { x: 280, w: 50, h: 420 }, { x: 350, w: 80, h: 300 }, { x: 450, w: 45, h: 380 },
    { x: 520, w: 90, h: 450 }, { x: 630, w: 55, h: 320 }, { x: 710, w: 65, h: 360 },
    { x: 800, w: 50, h: 290 }, { x: 870, w: 75, h: 400 }, { x: 960, w: 40, h: 340 },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg viewBox="0 0 1100 500" className="absolute bottom-0 left-0 w-full h-auto opacity-[0.04]">
        {/* Ground */}
        <line x1="0" y1="480" x2="1100" y2="480" stroke={S} strokeWidth="1.5" />
        {/* Buildings */}
        {buildings.map((b, i) => (
          <motion.g key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6, ease: EASE }}>
            <rect x={b.x} y={480 - b.h} width={b.w} height={b.h} fill="none" stroke={S} strokeWidth="1" />
            {/* Window rows */}
            {Array.from({ length: Math.floor(b.h / 30) }).map((_, j) => (
              <line key={j} x1={b.x + 5} y1={480 - b.h + 20 + j * 30} x2={b.x + b.w - 5} y2={480 - b.h + 20 + j * 30} stroke={S} strokeWidth="0.3" />
            ))}
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

/* ================================================================== */
/*  5. RÉSEAU SOCIAL — Blueprint technique détaillé                    */
/* ================================================================== */
export function ArchBgBlueprint() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.svg viewBox="0 0 1000 700" className="absolute left-[5%] top-[5%] w-[90%] h-auto opacity-[0.04]" initial={{ opacity: 0 }} whileInView={{ opacity: 0.04 }} viewport={{ once: true }} transition={{ duration: 2 }}>
        {/* Grid */}
        {Array.from({ length: 25 }).map((_, i) => (
          <line key={`gv${i}`} x1={i * 40} y1="0" x2={i * 40} y2="700" stroke={S} strokeWidth={i % 5 === 0 ? "0.4" : "0.15"} />
        ))}
        {Array.from({ length: 18 }).map((_, i) => (
          <line key={`gh${i}`} x1="0" y1={i * 40} x2="1000" y2={i * 40} stroke={S} strokeWidth={i % 5 === 0 ? "0.4" : "0.15"} />
        ))}
        {/* Cross section of building */}
        <motion.path d="M300,600 L300,200 L350,200 L350,150 L500,150 L500,200 L700,200 L700,600" fill="none" stroke={S} strokeWidth="1.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 3, ease: EASE }} />
        {/* Floor slabs */}
        {[250, 350, 450, 550].map((y, i) => (
          <motion.line key={i} x1="300" y1={y} x2="700" y2={y} stroke={S} strokeWidth="1" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 1.5 + i * 0.2, ease: EASE }} />
        ))}
        {/* Stairs */}
        <motion.path d="M650,600 L650,550 L670,550 L670,500 L690,500 L690,450 L710,450" fill="none" stroke={S} strokeWidth="0.8" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 2.5, ease: EASE }} />
        {/* Foundation hatching */}
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.line key={`h${i}`} x1={300 + i * 40} y1="600" x2={310 + i * 40} y2="620" stroke={S} strokeWidth="0.4" initial={{ opacity: 0 }} whileInView={{ opacity: 0.5 }} viewport={{ once: true }} transition={{ delay: 3 + i * 0.05 }} />
        ))}
      </motion.svg>
    </div>
  );
}

/* ================================================================== */
/*  6. APPORTEURS — Réseau de connexions                               */
/* ================================================================== */
export function ArchBgNetwork() {
  const nodes = [
    { x: 200, y: 150 }, { x: 400, y: 100 }, { x: 600, y: 180 }, { x: 800, y: 120 },
    { x: 150, y: 350 }, { x: 350, y: 300 }, { x: 550, y: 380 }, { x: 750, y: 320 },
    { x: 300, y: 500 }, { x: 500, y: 480 }, { x: 700, y: 520 }, { x: 900, y: 400 },
  ];
  const connections = [
    [0,1],[1,2],[2,3],[0,4],[1,5],[2,6],[3,7],[4,5],[5,6],[6,7],[4,8],[5,9],[6,10],[7,11],[8,9],[9,10],[10,11],
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg viewBox="0 0 1000 600" className="absolute inset-0 w-full h-full opacity-[0.05]">
        {connections.map(([a, b], i) => (
          <motion.line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke={S} strokeWidth="0.6" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.06, ease: EASE }} />
        ))}
        {nodes.map((n, i) => (
          <motion.circle key={i} cx={n.x} cy={n.y} r="4" fill="none" stroke={S} strokeWidth="1" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 + i * 0.08, type: "spring" }} />
        ))}
      </svg>
    </div>
  );
}

/* ================================================================== */
/*  7. FORMATIONS — Amphithéâtre / auditorium                          */
/* ================================================================== */
export function ArchBgAuditorium() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.svg viewBox="0 0 800 500" className="absolute right-[-10%] bottom-[-5%] w-[65%] h-auto opacity-[0.05]" initial={{ opacity: 0 }} whileInView={{ opacity: 0.05 }} viewport={{ once: true }} transition={{ duration: 2 }}>
        {/* Curved seating rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.path key={i} d={`M${150 - i * 15},${200 + i * 35} Q400,${250 + i * 40} ${650 + i * 15},${200 + i * 35}`} fill="none" stroke={S} strokeWidth="1" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: i * 0.15, ease: EASE }} />
        ))}
        {/* Stage */}
        <motion.rect x="250" y="140" width="300" height="60" rx="5" fill="none" stroke={S} strokeWidth="1.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 1.5, ease: EASE }} />
        <motion.text x="400" y="175" fill={S} fontSize="10" textAnchor="middle" opacity="0.3">SCENE</motion.text>
        {/* Walls */}
        <motion.path d="M80,180 L80,500 L720,500 L720,180" fill="none" stroke={S} strokeWidth="1" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, delay: 0.5, ease: EASE }} />
      </motion.svg>
    </div>
  );
}

/* ================================================================== */
/*  8. COMPARAISON — Split building (moitié intact, moitié cassé)      */
/* ================================================================== */
export function ArchBgSplitBuilding() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full opacity-[0.04]">
        {/* Left side — broken/fragmented */}
        <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }}>
          <line x1="150" y1="450" x2="150" y2="150" stroke={S} strokeWidth="1" strokeDasharray="8,4" />
          <line x1="150" y1="150" x2="350" y2="150" stroke={S} strokeWidth="1" strokeDasharray="6,6" />
          <line x1="350" y1="150" x2="350" y2="450" stroke={S} strokeWidth="1" />
          <line x1="150" y1="250" x2="300" y2="250" stroke={S} strokeWidth="0.5" strokeDasharray="4,4" />
          <line x1="150" y1="350" x2="280" y2="350" stroke={S} strokeWidth="0.5" strokeDasharray="4,4" />
          {/* Crack lines */}
          <path d="M250,150 L260,200 L240,250 L270,300 L250,350" fill="none" stroke={S} strokeWidth="0.5" />
        </motion.g>
        {/* Center divider */}
        <motion.line x1="500" y1="50" x2="500" y2="480" stroke={S} strokeWidth="0.5" strokeDasharray="2,6" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, ease: EASE }} />
        {/* Right side — clean/complete */}
        <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.5 }}>
          <rect x="650" y="150" width="200" height="300" fill="none" stroke={S} strokeWidth="1.2" />
          {[200, 250, 300, 350, 400].map((y, i) => (
            <line key={i} x1="650" y1={y} x2="850" y2={y} stroke={S} strokeWidth="0.5" />
          ))}
          {[690, 730, 770, 810].map((x, i) => (
            <g key={i}>
              {[160, 210, 260, 310, 360].map((y, j) => (
                <rect key={j} x={x} y={y} width="20" height="30" fill="none" stroke={S} strokeWidth="0.4" />
              ))}
            </g>
          ))}
          <line x1="650" y1="450" x2="850" y2="450" stroke={S} strokeWidth="1.2" />
        </motion.g>
      </svg>
    </div>
  );
}

/* ================================================================== */
/*  9. FONDATEURS — Grand dôme / coupole                               */
/* ================================================================== */
export function ArchBgDome() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.svg viewBox="0 0 800 600" className="absolute left-[10%] top-[5%] w-[80%] h-auto opacity-[0.05]" initial={{ opacity: 0 }} whileInView={{ opacity: 0.05 }} viewport={{ once: true }} transition={{ duration: 2 }}>
        {/* Dome arc */}
        <motion.path d="M150,450 Q150,100 400,80 Q650,100 650,450" fill="none" stroke={S} strokeWidth="1.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 3, ease: EASE }} />
        {/* Inner arcs */}
        {[0.85, 0.7, 0.55].map((s, i) => (
          <motion.path key={i} d={`M${150 + (1 - s) * 125},450 Q${150 + (1 - s) * 125},${100 + (1 - s) * 50} 400,${80 + (1 - s) * 30} Q${650 - (1 - s) * 125},${100 + (1 - s) * 50} ${650 - (1 - s) * 125},450`} fill="none" stroke={S} strokeWidth="0.6" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, delay: 1 + i * 0.3, ease: EASE }} />
        ))}
        {/* Columns */}
        {[200, 300, 400, 500, 600].map((x, i) => (
          <motion.line key={i} x1={x} y1="450" x2={x} y2={150 + Math.abs(x - 400) * 0.4} stroke={S} strokeWidth="0.8" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 2 + i * 0.15, ease: EASE }} />
        ))}
        {/* Base */}
        <motion.line x1="100" y1="450" x2="700" y2="450" stroke={S} strokeWidth="2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.3, ease: EASE }} />
        {/* Keystone */}
        <motion.circle cx="400" cy="80" r="8" fill="none" stroke={S} strokeWidth="1" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 3, type: "spring" }} />
      </motion.svg>
    </div>
  );
}
