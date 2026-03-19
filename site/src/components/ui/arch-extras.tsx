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

/* ── 12. Gratte-ciel moderne détaillé (grand) ── */
export function SkyscraperDetailed({ className = "" }: { className?: string }) {
  return (
    <motion.svg viewBox="0 0 200 600" fill="none" className={`w-40 h-auto ${className}`} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      {/* Structure principale */}
      <motion.rect x="40" y="30" width="120" height="540" stroke="#C4956A" strokeWidth="1.5" variants={d(0)} />
      {/* Étages (30 niveaux) */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.line key={`f${i}`} x1="40" y1={48 + i * 18} x2="160" y2={48 + i * 18} stroke="#C4956A" strokeWidth="0.6" variants={d(0.05 + i * 0.03)} />
      ))}
      {/* Fenêtres (4 colonnes x 30 rangées) */}
      {Array.from({ length: 30 }).map((_, row) =>
        Array.from({ length: 4 }).map((_, col) => (
          <motion.rect key={`w${row}-${col}`} x={52 + col * 26} y={33 + row * 18} width="14" height="12" stroke="#C4956A" strokeWidth="0.4" variants={d(0.1 + row * 0.02 + col * 0.01)} />
        ))
      )}
      {/* Couronnement / toit */}
      <motion.path d="M 70 30 L 100 5 L 130 30" stroke="#C4956A" strokeWidth="1.5" variants={d(0.8)} />
      <motion.line x1="100" y1="5" x2="100" y2="-15" stroke="#C4956A" strokeWidth="1" variants={d(0.9)} />
      <motion.circle cx="100" cy="-18" r="3" stroke="#C4956A" strokeWidth="0.8" variants={d(1)} />
      {/* Entrée */}
      <motion.rect x="80" y="545" width="40" height="25" stroke="#C4956A" strokeWidth="1.2" variants={d(0.5)} />
      <motion.path d="M 90 570 L 90 555 Q 100 548 110 555 L 110 570" stroke="#C4956A" strokeWidth="0.8" variants={d(0.6)} />
      {/* Sol */}
      <motion.line x1="10" y1="570" x2="190" y2="570" stroke="#C4956A" strokeWidth="1" variants={d(0.3)} />
      {/* Dimensions */}
      <motion.line x1="25" y1="30" x2="25" y2="570" stroke="#C4956A" strokeWidth="0.3" strokeDasharray="3 3" variants={d(0.7)} />
      <motion.text x="20" y="300" fill="#C4956A" fontSize="6" fontFamily="monospace" textAnchor="middle" transform="rotate(-90,20,300)" {...f(0.8)}>90m</motion.text>
    </motion.svg>
  );
}

/* ── 13. Villa de luxe avec piscine (vue dessus) ── */
export function LuxuryVillaPlan({ className = "" }: { className?: string }) {
  return (
    <motion.svg viewBox="0 0 500 350" fill="none" className={`w-full max-w-lg ${className}`} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      {/* Terrain */}
      <motion.rect x="10" y="10" width="480" height="330" stroke="#C4956A" strokeWidth="0.5" strokeDasharray="4 4" variants={d(0)} />
      {/* Maison principale */}
      <motion.rect x="50" y="60" width="250" height="180" stroke="#C4956A" strokeWidth="2" variants={d(0.1)} />
      {/* Salon */}
      <motion.rect x="50" y="60" width="140" height="110" stroke="#C4956A" strokeWidth="1" variants={d(0.2)} />
      <motion.text x="120" y="120" fill="#C4956A" fontSize="7" fontFamily="monospace" textAnchor="middle" {...f(0.5)}>SALON</motion.text>
      <motion.text x="120" y="130" fill="#C4956A" fontSize="5" fontFamily="monospace" textAnchor="middle" opacity={0.5} {...f(0.6)}>42m²</motion.text>
      {/* Cuisine */}
      <motion.rect x="190" y="60" width="110" height="110" stroke="#C4956A" strokeWidth="1" variants={d(0.25)} />
      <motion.text x="245" y="120" fill="#C4956A" fontSize="7" fontFamily="monospace" textAnchor="middle" {...f(0.55)}>CUISINE</motion.text>
      {/* Chambre 1 */}
      <motion.rect x="50" y="170" width="120" height="70" stroke="#C4956A" strokeWidth="1" variants={d(0.3)} />
      <motion.text x="110" y="210" fill="#C4956A" fontSize="7" fontFamily="monospace" textAnchor="middle" {...f(0.6)}>CH. 1</motion.text>
      {/* Chambre 2 */}
      <motion.rect x="170" y="170" width="130" height="70" stroke="#C4956A" strokeWidth="1" variants={d(0.35)} />
      <motion.text x="235" y="210" fill="#C4956A" fontSize="7" fontFamily="monospace" textAnchor="middle" {...f(0.65)}>CH. 2</motion.text>
      {/* SDB */}
      <motion.rect x="230" y="170" width="70" height="70" stroke="#C4956A" strokeWidth="0.8" variants={d(0.4)} />
      <motion.text x="265" y="210" fill="#C4956A" fontSize="6" fontFamily="monospace" textAnchor="middle" {...f(0.7)}>SDB</motion.text>
      {/* Portes (arcs) */}
      <motion.path d="M 140 170 A 20 20 0 0 1 160 170" stroke="#C4956A" strokeWidth="0.6" strokeDasharray="2 2" variants={d(0.45)} />
      <motion.path d="M 190 110 A 15 15 0 0 0 205 110" stroke="#C4956A" strokeWidth="0.6" strokeDasharray="2 2" variants={d(0.5)} />
      {/* Terrasse */}
      <motion.rect x="300" y="80" width="80" height="140" stroke="#C4956A" strokeWidth="1" strokeDasharray="6 3" variants={d(0.5)} />
      <motion.text x="340" y="155" fill="#C4956A" fontSize="7" fontFamily="monospace" textAnchor="middle" {...f(0.75)}>TERRASSE</motion.text>
      {/* Piscine */}
      <motion.rect x="320" y="250" width="140" height="70" rx="20" stroke="#C4956A" strokeWidth="1.5" variants={d(0.6)} />
      <motion.text x="390" y="290" fill="#C4956A" fontSize="7" fontFamily="monospace" textAnchor="middle" {...f(0.8)}>PISCINE</motion.text>
      {/* Ondes piscine */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.line key={`pw${i}`} x1={340 + i * 20} y1="265" x2={340 + i * 20} y2="305" stroke="#C4956A" strokeWidth="0.3" strokeDasharray="2 4" variants={d(0.7 + i * 0.03)} />
      ))}
      {/* Jardin — arbres */}
      {[{ x: 420, y: 60 }, { x: 450, y: 100 }, { x: 40, y: 290 }, { x: 470, y: 180 }].map((t, i) => (
        <motion.circle key={`tree${i}`} cx={t.x} cy={t.y} r="12" stroke="#C4956A" strokeWidth="0.6" variants={d(0.8 + i * 0.04)} />
      ))}
      {/* Garage */}
      <motion.rect x="50" y="260" width="80" height="50" stroke="#C4956A" strokeWidth="1" variants={d(0.55)} />
      <motion.text x="90" y="290" fill="#C4956A" fontSize="6" fontFamily="monospace" textAnchor="middle" {...f(0.75)}>GARAGE</motion.text>
      {/* Allée */}
      <motion.path d="M 90 310 L 90 340" stroke="#C4956A" strokeWidth="1" strokeDasharray="4 2" variants={d(0.65)} />
      {/* Boussole */}
      <motion.circle cx="460" cy="30" r="15" stroke="#C4956A" strokeWidth="0.5" variants={d(0.9)} />
      <motion.path d="M 460 18 L 460 42 M 448 30 L 472 30" stroke="#C4956A" strokeWidth="0.4" variants={d(0.95)} />
      <motion.text x="460" y="14" fill="#C4956A" fontSize="5" fontFamily="monospace" textAnchor="middle" {...f(1)}>N</motion.text>
      {/* Dimensions */}
      <motion.line x1="50" y1="345" x2="300" y2="345" stroke="#C4956A" strokeWidth="0.3" variants={d(0.85)} />
      <motion.text x="175" y="340" fill="#C4956A" fontSize="5" fontFamily="monospace" textAnchor="middle" {...f(0.9)}>25.00m</motion.text>
    </motion.svg>
  );
}

/* ── 14. Perspective intérieure (salon) ── */
export function InteriorPerspective({ className = "" }: { className?: string }) {
  return (
    <motion.svg viewBox="0 0 400 250" fill="none" className={`w-full max-w-md ${className}`} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      {/* Point de fuite au centre */}
      {/* Murs */}
      <motion.path d="M 0 0 L 120 70 L 120 180 L 0 250" stroke="#C4956A" strokeWidth="1.2" variants={d(0)} />
      <motion.path d="M 400 0 L 280 70 L 280 180 L 400 250" stroke="#C4956A" strokeWidth="1.2" variants={d(0.1)} />
      <motion.line x1="120" y1="70" x2="280" y2="70" stroke="#C4956A" strokeWidth="1" variants={d(0.15)} />
      <motion.line x1="120" y1="180" x2="280" y2="180" stroke="#C4956A" strokeWidth="1" variants={d(0.2)} />
      {/* Sol — lignes de perspective */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.line key={`fl${i}`} x1={0 + i * 50} y1="250" x2={120 + i * 16} y2="180" stroke="#C4956A" strokeWidth="0.4" variants={d(0.25 + i * 0.03)} />
      ))}
      {/* Fenêtre fond */}
      <motion.rect x="160" y="80" width="80" height="60" stroke="#C4956A" strokeWidth="1" variants={d(0.3)} />
      <motion.line x1="200" y1="80" x2="200" y2="140" stroke="#C4956A" strokeWidth="0.5" variants={d(0.35)} />
      <motion.line x1="160" y1="110" x2="240" y2="110" stroke="#C4956A" strokeWidth="0.5" variants={d(0.35)} />
      {/* Canapé */}
      <motion.path d="M 30 200 L 30 180 L 150 180 L 150 200 L 145 200 L 145 185 L 35 185 L 35 200 Z" stroke="#C4956A" strokeWidth="0.8" variants={d(0.4)} />
      {/* Table basse */}
      <motion.rect x="55" y="205" width="80" height="20" rx="3" stroke="#C4956A" strokeWidth="0.6" variants={d(0.5)} />
      {/* Lampe */}
      <motion.line x1="300" y1="130" x2="300" y2="180" stroke="#C4956A" strokeWidth="0.6" variants={d(0.55)} />
      <motion.path d="M 285 130 Q 300 120 315 130" stroke="#C4956A" strokeWidth="0.6" variants={d(0.6)} />
      {/* Tableau au mur */}
      <motion.rect x="145" y="82" width="30" height="22" stroke="#C4956A" strokeWidth="0.5" variants={d(0.65)} />
      {/* Plante */}
      <motion.ellipse cx="350" cy="195" rx="15" ry="20" stroke="#C4956A" strokeWidth="0.5" variants={d(0.7)} />
      <motion.rect x="345" y="210" width="10" height="15" stroke="#C4956A" strokeWidth="0.4" variants={d(0.75)} />
    </motion.svg>
  );
}

/* ── 15. Coupe transversale d'un immeuble (3 étages) ── */
export function BuildingCrossSection({ className = "" }: { className?: string }) {
  return (
    <motion.svg viewBox="0 0 500 400" fill="none" className={`w-full max-w-xl ${className}`} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      {/* Sol/Fondation */}
      <motion.rect x="50" y="350" width="400" height="30" stroke="#C4956A" strokeWidth="1" variants={d(0)} />
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.line key={`hatch${i}`} x1={55 + i * 20} y1="355" x2={65 + i * 20} y2="375" stroke="#C4956A" strokeWidth="0.3" variants={d(0.05 + i * 0.01)} />
      ))}
      {/* Structure — 3 étages */}
      {[0, 1, 2].map((floor) => {
        const y = 250 - floor * 100;
        return (
          <motion.g key={`floor${floor}`}>
            {/* Dalle */}
            <motion.rect x="50" y={y} width="400" height="8" stroke="#C4956A" strokeWidth="1" fill="none" variants={d(0.1 + floor * 0.15)} />
            {/* Murs porteurs */}
            <motion.line x1="50" y1={y + 8} x2="50" y2={y + 100} stroke="#C4956A" strokeWidth="1.5" variants={d(0.15 + floor * 0.15)} />
            <motion.line x1="200" y1={y + 8} x2="200" y2={y + 100} stroke="#C4956A" strokeWidth="1" variants={d(0.2 + floor * 0.15)} />
            <motion.line x1="300" y1={y + 8} x2="300" y2={y + 100} stroke="#C4956A" strokeWidth="1" variants={d(0.2 + floor * 0.15)} />
            <motion.line x1="450" y1={y + 8} x2="450" y2={y + 100} stroke="#C4956A" strokeWidth="1.5" variants={d(0.15 + floor * 0.15)} />
            {/* Fenêtres */}
            <motion.rect x="80" y={y + 30} width="50" height="45" stroke="#C4956A" strokeWidth="0.6" variants={d(0.25 + floor * 0.15)} />
            <motion.rect x="230" y={y + 30} width="40" height="45" stroke="#C4956A" strokeWidth="0.6" variants={d(0.28 + floor * 0.15)} />
            <motion.rect x="350" y={y + 30} width="50" height="45" stroke="#C4956A" strokeWidth="0.6" variants={d(0.3 + floor * 0.15)} />
            {/* Mobilier simplifié */}
            <motion.rect x={100} y={y + 80} width="30" height="12" rx="2" stroke="#C4956A" strokeWidth="0.4" variants={d(0.35 + floor * 0.1)} />
            {/* Label */}
            <motion.text x="250" y={y + 95} fill="#C4956A" fontSize="6" fontFamily="monospace" textAnchor="middle" {...f(0.4 + floor * 0.15)}>
              {floor === 0 ? "RDC" : `R+${floor}`}
            </motion.text>
          </motion.g>
        );
      })}
      {/* Toit */}
      <motion.path d="M 30 50 L 250 10 L 470 50" stroke="#C4956A" strokeWidth="1.5" variants={d(0.7)} />
      <motion.line x1="50" y1="50" x2="450" y2="50" stroke="#C4956A" strokeWidth="1" variants={d(0.65)} />
      {/* Dimensions latérales */}
      <motion.line x1="30" y1="50" x2="30" y2="350" stroke="#C4956A" strokeWidth="0.3" strokeDasharray="3 3" variants={d(0.75)} />
      <motion.text x="25" y="200" fill="#C4956A" fontSize="6" fontFamily="monospace" textAnchor="middle" transform="rotate(-90,25,200)" {...f(0.85)}>12.00m</motion.text>
      {/* Dimension largeur */}
      <motion.line x1="50" y1="390" x2="450" y2="390" stroke="#C4956A" strokeWidth="0.3" strokeDasharray="3 3" variants={d(0.8)} />
      <motion.text x="250" y="398" fill="#C4956A" fontSize="6" fontFamily="monospace" textAnchor="middle" {...f(0.9)}>20.00m</motion.text>
    </motion.svg>
  );
}

/* ── 16. Façade Art Déco ── */
export function ArtDecoFacade({ className = "" }: { className?: string }) {
  return (
    <motion.svg viewBox="0 0 300 450" fill="none" className={`w-36 h-auto ${className}`} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <motion.rect x="30" y="50" width="240" height="380" stroke="#C4956A" strokeWidth="1.5" variants={d(0)} />
      {/* Ornement supérieur */}
      <motion.path d="M 30 50 L 150 15 L 270 50" stroke="#C4956A" strokeWidth="1.5" variants={d(0.1)} />
      <motion.path d="M 70 50 L 150 25 L 230 50" stroke="#C4956A" strokeWidth="0.8" variants={d(0.15)} />
      {/* Colonnes décoratives */}
      <motion.line x1="50" y1="50" x2="50" y2="430" stroke="#C4956A" strokeWidth="1.2" variants={d(0.2)} />
      <motion.line x1="250" y1="50" x2="250" y2="430" stroke="#C4956A" strokeWidth="1.2" variants={d(0.2)} />
      {/* Fenêtres Art Déco (3x5 avec arcs) */}
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 3 }).map((_, col) => (
          <motion.g key={`ad${row}-${col}`}>
            <motion.rect x={70 + col * 60} y={65 + row * 72} width="40" height="55" stroke="#C4956A" strokeWidth="0.6" variants={d(0.25 + row * 0.08 + col * 0.03)} />
            <motion.path d={`M ${70 + col * 60} ${65 + row * 72} Q ${90 + col * 60} ${55 + row * 72} ${110 + col * 60} ${65 + row * 72}`} stroke="#C4956A" strokeWidth="0.5" variants={d(0.3 + row * 0.08 + col * 0.03)} />
          </motion.g>
        ))
      )}
      {/* Entrée principale */}
      <motion.rect x="110" y="370" width="80" height="60" stroke="#C4956A" strokeWidth="1" variants={d(0.7)} />
      <motion.path d="M 110 370 Q 150 345 190 370" stroke="#C4956A" strokeWidth="1" variants={d(0.75)} />
      {/* Marches */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.line key={`step${i}`} x1={105 - i * 5} y1={430 + i * 5} x2={195 + i * 5} y2={430 + i * 5} stroke="#C4956A" strokeWidth="0.6" variants={d(0.8 + i * 0.03)} />
      ))}
      {/* Motif géométrique au sommet */}
      <motion.circle cx="150" cy="35" r="10" stroke="#C4956A" strokeWidth="0.6" variants={d(0.85)} />
      <motion.path d="M 140 35 L 150 25 L 160 35 L 150 45 Z" stroke="#C4956A" strokeWidth="0.4" variants={d(0.9)} />
    </motion.svg>
  );
}

/* ── 17. Plan de quartier (vue aérienne) ── */
export function CityBlockPlan({ className = "" }: { className?: string }) {
  return (
    <motion.svg viewBox="0 0 600 400" fill="none" className={`w-full max-w-2xl ${className}`} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      {/* Routes principales */}
      <motion.line x1="0" y1="200" x2="600" y2="200" stroke="#C4956A" strokeWidth="2" variants={d(0)} />
      <motion.line x1="300" y1="0" x2="300" y2="400" stroke="#C4956A" strokeWidth="2" variants={d(0.05)} />
      {/* Routes secondaires */}
      <motion.line x1="0" y1="100" x2="600" y2="100" stroke="#C4956A" strokeWidth="0.5" strokeDasharray="8 4" variants={d(0.1)} />
      <motion.line x1="0" y1="300" x2="600" y2="300" stroke="#C4956A" strokeWidth="0.5" strokeDasharray="8 4" variants={d(0.1)} />
      <motion.line x1="150" y1="0" x2="150" y2="400" stroke="#C4956A" strokeWidth="0.5" strokeDasharray="8 4" variants={d(0.1)} />
      <motion.line x1="450" y1="0" x2="450" y2="400" stroke="#C4956A" strokeWidth="0.5" strokeDasharray="8 4" variants={d(0.1)} />
      {/* Bâtiments — îlot 1 */}
      <motion.rect x="20" y="20" width="110" height="65" stroke="#C4956A" strokeWidth="0.8" variants={d(0.2)} />
      <motion.rect x="30" y="110" width="80" height="50" stroke="#C4956A" strokeWidth="0.8" variants={d(0.25)} />
      {/* Bâtiments — îlot 2 */}
      <motion.rect x="170" y="25" width="100" height="55" stroke="#C4956A" strokeWidth="0.8" variants={d(0.3)} />
      <motion.rect x="180" y="120" width="60" height="40" stroke="#C4956A" strokeWidth="0.6" variants={d(0.32)} />
      {/* Bâtiments — îlot 3 */}
      <motion.rect x="320" y="20" width="110" height="60" stroke="#C4956A" strokeWidth="0.8" variants={d(0.35)} />
      <motion.rect x="340" y="110" width="70" height="50" stroke="#C4956A" strokeWidth="0.6" variants={d(0.38)} />
      {/* Bâtiments — îlot 4 (en bas) */}
      <motion.rect x="20" y="220" width="100" height="60" stroke="#C4956A" strokeWidth="0.8" variants={d(0.4)} />
      <motion.rect x="170" y="220" width="90" height="55" stroke="#C4956A" strokeWidth="0.8" variants={d(0.42)} />
      <motion.rect x="320" y="215" width="110" height="65" stroke="#C4956A" strokeWidth="0.8" variants={d(0.45)} />
      <motion.rect x="470" y="220" width="100" height="50" stroke="#C4956A" strokeWidth="0.6" variants={d(0.47)} />
      {/* Bâtiments — îlot 5 */}
      <motion.rect x="30" y="320" width="90" height="55" stroke="#C4956A" strokeWidth="0.6" variants={d(0.5)} />
      <motion.rect x="330" y="310" width="100" height="65" stroke="#C4956A" strokeWidth="0.8" variants={d(0.52)} />
      <motion.rect x="470" y="30" width="100" height="50" stroke="#C4956A" strokeWidth="0.8" variants={d(0.55)} />
      {/* Parc/espace vert */}
      <motion.ellipse cx="500" cy="320" rx="60" ry="50" stroke="#C4956A" strokeWidth="0.6" strokeDasharray="4 3" variants={d(0.6)} />
      <motion.text x="500" y="325" fill="#C4956A" fontSize="7" fontFamily="monospace" textAnchor="middle" {...f(0.75)}>PARC</motion.text>
      {/* Arbres dans le parc */}
      {[{ x: 480, y: 300 }, { x: 520, y: 340 }, { x: 490, y: 345 }, { x: 510, y: 305 }].map((t, i) => (
        <motion.circle key={`pt${i}`} cx={t.x} cy={t.y} r="6" stroke="#C4956A" strokeWidth="0.4" variants={d(0.65 + i * 0.03)} />
      ))}
      {/* Rond-point */}
      <motion.circle cx="300" cy="200" r="20" stroke="#C4956A" strokeWidth="1" variants={d(0.7)} />
      <motion.circle cx="300" cy="200" r="8" stroke="#C4956A" strokeWidth="0.5" variants={d(0.75)} />
      {/* Labels rues */}
      <motion.text x="150" y="195" fill="#C4956A" fontSize="5" fontFamily="monospace" textAnchor="middle" {...f(0.8)}>AV. PRINCIPALE</motion.text>
      <motion.text x="305" y="50" fill="#C4956A" fontSize="5" fontFamily="monospace" transform="rotate(90,305,50)" {...f(0.85)}>RUE DU LAC</motion.text>
    </motion.svg>
  );
}

/* ── 18. Escalier en colimaçon (vue dessus) ── */
export function SpiralStaircase({ className = "" }: { className?: string }) {
  return (
    <motion.svg viewBox="0 0 200 200" fill="none" className={`w-32 h-32 ${className}`} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <motion.circle cx="100" cy="100" r="80" stroke="#C4956A" strokeWidth="1" variants={d(0)} />
      <motion.circle cx="100" cy="100" r="20" stroke="#C4956A" strokeWidth="1.5" variants={d(0.1)} />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        return (
          <motion.line key={`sp${i}`} x1={100 + Math.cos(angle) * 20} y1={100 + Math.sin(angle) * 20} x2={100 + Math.cos(angle) * 80} y2={100 + Math.sin(angle) * 80} stroke="#C4956A" strokeWidth="0.5" variants={d(0.15 + i * 0.05)} />
        );
      })}
      <motion.circle cx="100" cy="100" r="50" stroke="#C4956A" strokeWidth="0.3" strokeDasharray="3 3" variants={d(0.7)} />
    </motion.svg>
  );
}

/* ── 19. Détail de toiture (vue coupe) ── */
export function RoofDetail({ className = "" }: { className?: string }) {
  return (
    <motion.svg viewBox="0 0 300 150" fill="none" className={`w-48 h-auto ${className}`} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      {/* Chevrons */}
      <motion.path d="M 20 130 L 150 20 L 280 130" stroke="#C4956A" strokeWidth="1.5" variants={d(0)} />
      <motion.path d="M 40 130 L 150 35 L 260 130" stroke="#C4956A" strokeWidth="0.8" variants={d(0.1)} />
      {/* Pannes */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.line key={`pn${i}`} x1={50 + i * 20} y1={115 - i * 18} x2={250 - i * 20} y2={115 - i * 18} stroke="#C4956A" strokeWidth="0.5" variants={d(0.2 + i * 0.06)} />
      ))}
      {/* Tuiles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.path key={`tile${i}`} d={`M ${35 + i * 15} ${128 - i * 12} Q ${42 + i * 15} ${122 - i * 12} ${50 + i * 15} ${128 - i * 12}`} stroke="#C4956A" strokeWidth="0.3" variants={d(0.5 + i * 0.03)} />
      ))}
      {/* Labels */}
      <motion.text x="150" y="145" fill="#C4956A" fontSize="5" fontFamily="monospace" textAnchor="middle" {...f(0.8)}>CHARPENTE TRADITIONNELLE</motion.text>
      {/* Faîtière */}
      <motion.circle cx="150" cy="20" r="4" stroke="#C4956A" strokeWidth="0.6" variants={d(0.75)} />
    </motion.svg>
  );
}

/* ── 20. Perspective 3D isométrique d'un bureau ── */
export function OfficeIsometric({ className = "" }: { className?: string }) {
  return (
    <motion.svg viewBox="0 0 400 300" fill="none" className={`w-full max-w-md ${className}`} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      {/* Sol isométrique */}
      <motion.path d="M 200 250 L 50 175 L 200 100 L 350 175 Z" stroke="#C4956A" strokeWidth="1" variants={d(0)} />
      {/* Grille du sol */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.g key={`grid${i}`}>
          <motion.line x1={80 + i * 30} y1={187 - i * 7.5} x2={230 + i * 30} y2={112 + i * 7.5} stroke="#C4956A" strokeWidth="0.3" variants={d(0.1 + i * 0.02)} />
          <motion.line x1={80 + i * 30} y1={162 + i * 7.5} x2={230 + i * 30} y2={237 - i * 7.5} stroke="#C4956A" strokeWidth="0.3" variants={d(0.1 + i * 0.02)} />
        </motion.g>
      ))}
      {/* Mur gauche */}
      <motion.path d="M 50 175 L 50 75 L 200 0 L 200 100" stroke="#C4956A" strokeWidth="1" variants={d(0.2)} />
      {/* Mur droit */}
      <motion.path d="M 200 100 L 200 0 L 350 75 L 350 175" stroke="#C4956A" strokeWidth="1" variants={d(0.25)} />
      {/* Fenêtre mur gauche */}
      <motion.path d="M 80 130 L 80 80 L 140 50 L 140 100" stroke="#C4956A" strokeWidth="0.6" variants={d(0.35)} />
      {/* Fenêtre mur droit */}
      <motion.path d="M 260 100 L 260 50 L 320 80 L 320 130" stroke="#C4956A" strokeWidth="0.6" variants={d(0.4)} />
      {/* Bureau (isométrique) */}
      <motion.path d="M 150 200 L 100 175 L 150 150 L 200 175 Z" stroke="#C4956A" strokeWidth="0.6" variants={d(0.5)} />
      <motion.line x1="100" y1="175" x2="100" y2="185" stroke="#C4956A" strokeWidth="0.4" variants={d(0.55)} />
      <motion.line x1="200" y1="175" x2="200" y2="185" stroke="#C4956A" strokeWidth="0.4" variants={d(0.55)} />
      {/* Chaise */}
      <motion.ellipse cx="150" cy="210" rx="15" ry="8" stroke="#C4956A" strokeWidth="0.5" variants={d(0.6)} />
      {/* Écran sur le bureau */}
      <motion.rect x="140" y="155" width="20" height="15" stroke="#C4956A" strokeWidth="0.4" variants={d(0.65)} />
      <motion.line x1="150" y1="170" x2="150" y2="175" stroke="#C4956A" strokeWidth="0.3" variants={d(0.7)} />
      {/* Plante dans le coin */}
      <motion.ellipse cx="280" cy="190" rx="12" ry="15" stroke="#C4956A" strokeWidth="0.4" variants={d(0.75)} />
      <motion.rect x="275" y="200" width="10" height="10" stroke="#C4956A" strokeWidth="0.3" variants={d(0.8)} />
    </motion.svg>
  );
}

/* ── 21. Pont architectural ── */
export function BridgeSVG({ className = "" }: { className?: string }) {
  return (
    <motion.svg viewBox="0 0 600 200" fill="none" className={`w-full max-w-xl ${className}`} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      {/* Tablier */}
      <motion.line x1="0" y1="120" x2="600" y2="120" stroke="#C4956A" strokeWidth="2" variants={d(0)} />
      <motion.line x1="0" y1="125" x2="600" y2="125" stroke="#C4956A" strokeWidth="0.5" variants={d(0.05)} />
      {/* Piles */}
      <motion.rect x="140" y="120" width="20" height="70" stroke="#C4956A" strokeWidth="1" variants={d(0.1)} />
      <motion.rect x="440" y="120" width="20" height="70" stroke="#C4956A" strokeWidth="1" variants={d(0.1)} />
      {/* Arches */}
      <motion.path d="M 10 120 Q 80 60 150 120" stroke="#C4956A" strokeWidth="1" variants={d(0.2)} />
      <motion.path d="M 160 120 Q 300 20 440 120" stroke="#C4956A" strokeWidth="1.5" variants={d(0.3)} />
      <motion.path d="M 460 120 Q 530 60 600 120" stroke="#C4956A" strokeWidth="1" variants={d(0.4)} />
      {/* Câbles/haubans sur l'arche principale */}
      {Array.from({ length: 8 }).map((_, i) => {
        const x = 195 + i * 32;
        const archY = 120 - Math.sin(((i + 1) / 9) * Math.PI) * 95;
        return (
          <motion.line key={`cb${i}`} x1={x} y1="120" x2={x} y2={archY} stroke="#C4956A" strokeWidth="0.4" variants={d(0.35 + i * 0.04)} />
        );
      })}
      {/* Eau */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.path key={`wave${i}`} d={`M ${i * 60} 185 Q ${i * 60 + 15} 180 ${i * 60 + 30} 185 Q ${i * 60 + 45} 190 ${i * 60 + 60} 185`} stroke="#C4956A" strokeWidth="0.3" variants={d(0.6 + i * 0.02)} />
      ))}
      {/* Berges */}
      <motion.rect x="0" y="120" width="15" height="80" stroke="#C4956A" strokeWidth="0.8" variants={d(0.5)} />
      <motion.rect x="585" y="120" width="15" height="80" stroke="#C4956A" strokeWidth="0.8" variants={d(0.5)} />
    </motion.svg>
  );
}
