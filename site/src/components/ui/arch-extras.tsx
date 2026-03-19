"use client";

import { motion } from "framer-motion";

const E = [0.165, 0.84, 0.44, 1] as const;
const d = (delay = 0, dur = 1.2) => ({
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1, transition: { duration: dur, delay, ease: E } },
});
const f = (delay = 0) => ({ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay, duration: 0.6 } } });

/* ── 1. Petite maison simple (icône) ── */
export function HouseIcon({ className = "" }: { className?: string }) {
  return (
    <motion.svg viewBox="0 0 100 100" fill="none" className={`w-24 h-24 ${className}`} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <motion.path d="M 50 15 L 85 45 L 85 85 L 15 85 L 15 45 Z" stroke="#C4956A" strokeWidth="2" variants={d(0)} />
      <motion.rect x="38" y="55" width="24" height="30" stroke="#C4956A" strokeWidth="1.5" variants={d(0.3)} />
      <motion.path d="M 50 15 L 10 48" stroke="#C4956A" strokeWidth="2" variants={d(0.1)} />
      <motion.path d="M 50 15 L 90 48" stroke="#C4956A" strokeWidth="2" variants={d(0.1)} />
    </motion.svg>
  );
}

/* ── 2. Tour moderne fine ── */
export function TowerThin({ className = "" }: { className?: string }) {
  return (
    <motion.svg viewBox="0 0 80 300" fill="none" className={`h-64 ${className}`} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <motion.rect x="15" y="20" width="50" height="260" stroke="#C4956A" strokeWidth="1.5" variants={d(0)} />
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.g key={i}>
          <motion.line x1="15" y1={40 + i * 20} x2="65" y2={40 + i * 20} stroke="#C4956A" strokeWidth="0.5" variants={d(0.1 + i * 0.04)} />
          <motion.rect x="22" y={43 + i * 20} width="10" height="13" stroke="#C4956A" strokeWidth="0.5" variants={d(0.2 + i * 0.03)} />
          <motion.rect x="48" y={43 + i * 20} width="10" height="13" stroke="#C4956A" strokeWidth="0.5" variants={d(0.2 + i * 0.03)} />
        </motion.g>
      ))}
      <motion.rect x="10" y="12" width="60" height="10" stroke="#C4956A" strokeWidth="1" variants={d(0.15)} />
      <motion.line x1="40" y1="0" x2="40" y2="12" stroke="#C4956A" strokeWidth="1" variants={d(0.3)} />
    </motion.svg>
  );
}

/* ── 3. Villa avec jardin (large) ── */
export function VillaLarge({ className = "" }: { className?: string }) {
  return (
    <motion.svg viewBox="0 0 700 350" fill="none" className={`w-full ${className}`} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      {/* Corps principal */}
      <motion.rect x="150" y="120" width="400" height="180" stroke="#C4956A" strokeWidth="2" variants={d(0)} />
      {/* Toit plat */}
      <motion.rect x="140" y="110" width="420" height="15" stroke="#C4956A" strokeWidth="1.5" variants={d(0.1)} />
      {/* Fenêtres panoramiques */}
      {[180, 280, 380, 480].map((x, i) => (
        <motion.rect key={i} x={x} y={145} width="60" height="50" stroke="#C4956A" strokeWidth="1.5" variants={d(0.2 + i * 0.08)} />
      ))}
      {/* Fenêtres étage bas */}
      {[180, 280, 380, 480].map((x, i) => (
        <motion.rect key={i} x={x} y={220} width="60" height="40" stroke="#C4956A" strokeWidth="1" variants={d(0.4 + i * 0.06)} />
      ))}
      {/* Porte */}
      <motion.rect x="330" y="240" width="40" height="60" stroke="#C4956A" strokeWidth="1.5" variants={d(0.5)} />
      {/* Garage */}
      <motion.rect x="50" y="180" width="90" height="120" stroke="#C4956A" strokeWidth="1.5" variants={d(0.3)} />
      <motion.rect x="55" y="220" width="80" height="60" stroke="#C4956A" strokeWidth="1" variants={d(0.35)} />
      {/* Terrasse */}
      <motion.line x1="560" y1="300" x2="680" y2="300" stroke="#C4956A" strokeWidth="1.5" variants={d(0.5)} />
      <motion.line x1="560" y1="300" x2="560" y2="250" stroke="#C4956A" strokeWidth="1" variants={d(0.5)} />
      {/* Sol */}
      <motion.line x1="20" y1="300" x2="690" y2="300" stroke="#C4956A" strokeWidth="2" variants={d(0)} />
      {/* Arbres */}
      {[{ cx: 630, cy: 270 }, { cx: 660, cy: 280 }, { cx: 30, cy: 275 }].map((t, i) => (
        <motion.g key={i} variants={d(0.6 + i * 0.1)}>
          <circle cx={t.cx} cy={t.cy} r="20" stroke="#C4956A" strokeWidth="1" />
          <line x1={t.cx} y1={t.cy + 20} x2={t.cx} y2={t.cy + 30} stroke="#C4956A" strokeWidth="1" />
        </motion.g>
      ))}
      {/* Piscine */}
      <motion.rect x="580" y="310" width="100" height="30" rx="5" stroke="#C4956A" strokeWidth="1" strokeDasharray="5 3" variants={d(0.7)} />
      <motion.text x="630" y="330" fill="#C4956A" fontSize="8" fontFamily="monospace" textAnchor="middle" {...f(1.2)}>PISCINE</motion.text>
    </motion.svg>
  );
}

/* ── 4. Gratte-ciel double ── */
export function TwinTowers({ className = "" }: { className?: string }) {
  return (
    <motion.svg viewBox="0 0 300 400" fill="none" className={`h-80 ${className}`} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      {/* Tour gauche */}
      <motion.rect x="40" y="60" width="80" height="320" stroke="#C4956A" strokeWidth="2" variants={d(0)} />
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.rect key={`l${i}`} x="50" y={75 + i * 20} width="15" height="12" stroke="#C4956A" strokeWidth="0.5" variants={d(0.1 + i * 0.03)} />
      ))}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.rect key={`l2${i}`} x="95" y={75 + i * 20} width="15" height="12" stroke="#C4956A" strokeWidth="0.5" variants={d(0.1 + i * 0.03)} />
      ))}
      <motion.rect x="35" y="50" width="90" height="14" stroke="#C4956A" strokeWidth="1" variants={d(0.2)} />
      {/* Tour droite (plus haute) */}
      <motion.rect x="180" y="20" width="80" height="360" stroke="#C4956A" strokeWidth="2" variants={d(0.1)} />
      {Array.from({ length: 17 }).map((_, i) => (
        <motion.rect key={`r${i}`} x="190" y={35 + i * 20} width="15" height="12" stroke="#C4956A" strokeWidth="0.5" variants={d(0.15 + i * 0.03)} />
      ))}
      {Array.from({ length: 17 }).map((_, i) => (
        <motion.rect key={`r2${i}`} x="235" y={35 + i * 20} width="15" height="12" stroke="#C4956A" strokeWidth="0.5" variants={d(0.15 + i * 0.03)} />
      ))}
      <motion.rect x="175" y="10" width="90" height="14" stroke="#C4956A" strokeWidth="1" variants={d(0.15)} />
      {/* Antennes */}
      <motion.line x1="80" y1="30" x2="80" y2="50" stroke="#C4956A" strokeWidth="1" variants={d(0.3)} />
      <motion.line x1="220" y1="0" x2="220" y2="10" stroke="#C4956A" strokeWidth="1" variants={d(0.3)} />
      {/* Passerelle */}
      <motion.line x1="120" y1="200" x2="180" y2="200" stroke="#C4956A" strokeWidth="1.5" strokeDasharray="4 3" variants={d(0.5)} />
      {/* Sol */}
      <motion.line x1="20" y1="380" x2="280" y2="380" stroke="#C4956A" strokeWidth="1.5" variants={d(0)} />
    </motion.svg>
  );
}

/* ── 5. Plan de quartier (vue aérienne) ── */
export function NeighborhoodPlan({ className = "" }: { className?: string }) {
  return (
    <motion.svg viewBox="0 0 600 300" fill="none" className={`w-full ${className}`} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      {/* Routes */}
      <motion.line x1="0" y1="150" x2="600" y2="150" stroke="#C4956A" strokeWidth="2" variants={d(0)} />
      <motion.line x1="200" y1="0" x2="200" y2="300" stroke="#C4956A" strokeWidth="2" variants={d(0.1)} />
      <motion.line x1="400" y1="0" x2="400" y2="300" stroke="#C4956A" strokeWidth="2" variants={d(0.1)} />
      {/* Bâtiments (rectangles variés) */}
      {[
        { x: 30, y: 30, w: 60, h: 40 }, { x: 110, y: 20, w: 50, h: 60 },
        { x: 30, y: 90, w: 80, h: 30 }, { x: 130, y: 85, w: 40, h: 40 },
        { x: 230, y: 20, w: 70, h: 50 }, { x: 320, y: 30, w: 50, h: 45 },
        { x: 240, y: 90, w: 60, h: 35 }, { x: 330, y: 85, w: 45, h: 40 },
        { x: 430, y: 25, w: 80, h: 40 }, { x: 530, y: 20, w: 45, h: 55 },
        { x: 30, y: 175, w: 55, h: 50 }, { x: 100, y: 180, w: 70, h: 35 },
        { x: 230, y: 170, w: 60, h: 60 }, { x: 310, y: 185, w: 55, h: 40 },
        { x: 430, y: 170, w: 50, h: 55 }, { x: 510, y: 180, w: 65, h: 35 },
        { x: 50, y: 250, w: 80, h: 30 }, { x: 250, y: 245, w: 70, h: 40 },
        { x: 440, y: 250, w: 60, h: 35 }, { x: 530, y: 240, w: 40, h: 45 },
      ].map((b, i) => (
        <motion.rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} stroke="#C4956A" strokeWidth="1" variants={d(0.2 + i * 0.04, 0.6)} />
      ))}
      {/* Rond-point */}
      <motion.circle cx="200" cy="150" r="15" stroke="#C4956A" strokeWidth="1.5" variants={d(0.3)} />
      <motion.circle cx="400" cy="150" r="12" stroke="#C4956A" strokeWidth="1" variants={d(0.35)} />
      {/* Parc */}
      <motion.ellipse cx="480" cy="100" rx="30" ry="20" stroke="#C4956A" strokeWidth="1" strokeDasharray="4 3" variants={d(0.5)} />
      <motion.text x="480" y="105" fill="#C4956A" fontSize="7" fontFamily="monospace" textAnchor="middle" {...f(1)}>PARC</motion.text>
    </motion.svg>
  );
}

/* ── 6. Chalet de montagne ── */
export function ChaletSVG({ className = "" }: { className?: string }) {
  return (
    <motion.svg viewBox="0 0 200 160" fill="none" className={`w-40 ${className}`} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <motion.path d="M 100 20 L 180 80 L 180 140 L 20 140 L 20 80 Z" stroke="#C4956A" strokeWidth="2" variants={d(0)} />
      <motion.line x1="20" y1="80" x2="180" y2="80" stroke="#C4956A" strokeWidth="1" variants={d(0.2)} />
      <motion.rect x="80" y="100" width="40" height="40" stroke="#C4956A" strokeWidth="1.5" variants={d(0.3)} />
      <motion.rect x="35" y="90" width="25" height="20" stroke="#C4956A" strokeWidth="1" variants={d(0.35)} />
      <motion.rect x="140" y="90" width="25" height="20" stroke="#C4956A" strokeWidth="1" variants={d(0.35)} />
      {/* Cheminée */}
      <motion.rect x="140" y="35" width="15" height="30" stroke="#C4956A" strokeWidth="1" variants={d(0.4)} />
      {/* Sol */}
      <motion.line x1="5" y1="140" x2="195" y2="140" stroke="#C4956A" strokeWidth="1.5" variants={d(0)} />
    </motion.svg>
  );
}

/* ── 7. Immeuble résidentiel (moyen) ── */
export function ApartmentBlock({ className = "" }: { className?: string }) {
  return (
    <motion.svg viewBox="0 0 250 300" fill="none" className={`h-56 ${className}`} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <motion.rect x="30" y="40" width="190" height="240" stroke="#C4956A" strokeWidth="2" variants={d(0)} />
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 4 }).map((_, col) => (
          <motion.rect key={`${row}-${col}`} x={45 + col * 45} y={55 + row * 28} width="20" height="18" stroke="#C4956A" strokeWidth="0.7" variants={d(0.15 + row * 0.04 + col * 0.02)} />
        ))
      )}
      <motion.rect x="95" y="245" width="60" height="35" stroke="#C4956A" strokeWidth="1.5" variants={d(0.4)} />
      <motion.rect x="25" y="30" width="200" height="14" stroke="#C4956A" strokeWidth="1" variants={d(0.1)} />
      <motion.line x1="15" y1="280" x2="235" y2="280" stroke="#C4956A" strokeWidth="1.5" variants={d(0)} />
    </motion.svg>
  );
}

/* ── 8. Grue de construction ── */
export function CraneSVG({ className = "" }: { className?: string }) {
  return (
    <motion.svg viewBox="0 0 200 300" fill="none" className={`h-48 ${className}`} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      {/* Mât */}
      <motion.line x1="80" y1="280" x2="80" y2="30" stroke="#C4956A" strokeWidth="2" variants={d(0)} />
      {/* Base */}
      <motion.path d="M 50 280 L 110 280 L 95 260 L 65 260 Z" stroke="#C4956A" strokeWidth="1.5" variants={d(0.1)} />
      {/* Flèche */}
      <motion.line x1="80" y1="40" x2="180" y2="40" stroke="#C4956A" strokeWidth="2" variants={d(0.2)} />
      {/* Contre-flèche */}
      <motion.line x1="80" y1="40" x2="30" y2="40" stroke="#C4956A" strokeWidth="1.5" variants={d(0.25)} />
      {/* Contrepoids */}
      <motion.rect x="20" y="40" width="20" height="15" stroke="#C4956A" strokeWidth="1" variants={d(0.3)} />
      {/* Câble */}
      <motion.line x1="160" y1="40" x2="160" y2="120" stroke="#C4956A" strokeWidth="1" strokeDasharray="3 3" variants={d(0.4)} />
      {/* Crochet */}
      <motion.path d="M 155 120 A 5 5 0 1 0 165 120" stroke="#C4956A" strokeWidth="1" variants={d(0.5)} />
      {/* Haubans */}
      <motion.line x1="80" y1="30" x2="30" y2="55" stroke="#C4956A" strokeWidth="0.8" variants={d(0.3)} />
      <motion.line x1="80" y1="30" x2="180" y2="45" stroke="#C4956A" strokeWidth="0.8" variants={d(0.3)} />
      {/* Treillis du mât */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.g key={i}>
          <motion.line x1="75" y1={60 + i * 22} x2="85" y2={82 + i * 22} stroke="#C4956A" strokeWidth="0.4" variants={d(0.1 + i * 0.03)} />
          <motion.line x1="85" y1={60 + i * 22} x2="75" y2={82 + i * 22} stroke="#C4956A" strokeWidth="0.4" variants={d(0.1 + i * 0.03)} />
        </motion.g>
      ))}
    </motion.svg>
  );
}

/* ── 9. Petite fenêtre décorative ── */
export function WindowDetail({ className = "" }: { className?: string }) {
  return (
    <motion.svg viewBox="0 0 60 80" fill="none" className={`w-12 ${className}`} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <motion.rect x="5" y="5" width="50" height="70" stroke="#C4956A" strokeWidth="1.5" variants={d(0)} />
      <motion.line x1="30" y1="5" x2="30" y2="75" stroke="#C4956A" strokeWidth="1" variants={d(0.2)} />
      <motion.line x1="5" y1="40" x2="55" y2="40" stroke="#C4956A" strokeWidth="1" variants={d(0.2)} />
      <motion.path d="M 5 5 A 25 25 0 0 1 55 5" stroke="#C4956A" strokeWidth="1.5" variants={d(0.3)} />
    </motion.svg>
  );
}

/* ── 10. Escalier en coupe ── */
export function StairSection({ className = "" }: { className?: string }) {
  return (
    <motion.svg viewBox="0 0 150 120" fill="none" className={`w-32 ${className}`} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.g key={i}>
          <motion.line x1={10 + i * 16} y1={100 - i * 12} x2={26 + i * 16} y2={100 - i * 12} stroke="#C4956A" strokeWidth="1.5" variants={d(i * 0.08)} />
          <motion.line x1={26 + i * 16} y1={100 - i * 12} x2={26 + i * 16} y2={88 - i * 12} stroke="#C4956A" strokeWidth="1.5" variants={d(i * 0.08 + 0.04)} />
        </motion.g>
      ))}
      {/* Rampe */}
      <motion.line x1="10" y1="95" x2="138" y2="8" stroke="#C4956A" strokeWidth="0.8" strokeDasharray="4 3" variants={d(0.6)} />
    </motion.svg>
  );
}

/* ── 11. Section de mur (détail technique) ── */
export function WallSection({ className = "" }: { className?: string }) {
  return (
    <motion.svg viewBox="0 0 120 200" fill="none" className={`h-36 ${className}`} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <motion.rect x="20" y="10" width="80" height="180" stroke="#C4956A" strokeWidth="1.5" variants={d(0)} />
      {/* Couches du mur */}
      <motion.rect x="30" y="10" width="20" height="180" stroke="#C4956A" strokeWidth="0.5" fill="none" variants={d(0.2)} />
      <motion.rect x="55" y="10" width="10" height="180" stroke="#C4956A" strokeWidth="0.5" fill="none" variants={d(0.25)} />
      {/* Hachurage isolation */}
      {Array.from({ length: 9 }).map((_, i) => (
        <motion.line key={i} x1="55" y1={15 + i * 20} x2="65" y2={25 + i * 20} stroke="#C4956A" strokeWidth="0.4" variants={d(0.3 + i * 0.02)} />
      ))}
      {/* Labels */}
      <motion.text x="40" y="205" fill="#C4956A" fontSize="6" fontFamily="monospace" textAnchor="middle" {...f(0.8)}>BÉTON</motion.text>
      <motion.text x="60" y="205" fill="#C4956A" fontSize="6" fontFamily="monospace" textAnchor="middle" {...f(0.9)}>ISOL.</motion.text>
    </motion.svg>
  );
}
