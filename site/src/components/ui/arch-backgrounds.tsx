"use client";

import { motion } from "framer-motion";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;
const C = "#C4956A";
const C2 = "#8B6F47";

/* ================================================================== */
/*  1. GRAND IMMEUBLE 3D PERSPECTIVE                                  */
/* ================================================================== */
export function ArchBg3DBuilding() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.svg viewBox="0 0 1200 900" className="absolute right-[-15%] top-[-10%] w-[110%] h-[120%]" preserveAspectRatio="xMidYMid slice"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }}>
        <motion.path d="M400,800 L400,150 L750,100 L750,800 Z" fill="none" stroke={C} strokeWidth="1.8" opacity="0.12"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 3, ease: EASE }} />
        <motion.path d="M750,100 L1000,180 L1000,800 L750,800 Z" fill="none" stroke={C} strokeWidth="1.5" opacity="0.10"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2.5, delay: 0.5, ease: EASE }} />
        <motion.path d="M400,150 L650,90 L1000,180 L750,100 Z" fill="none" stroke={C} strokeWidth="1" opacity="0.08"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, delay: 1, ease: EASE }} />
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.line key={`fa${i}`} x1="400" y1={195 + i * 43} x2="750" y2={145 + i * 43} stroke={C} strokeWidth="0.6" opacity="0.09"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 1.5 + i * 0.06, ease: EASE }} />
        ))}
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.line key={`fb${i}`} x1="750" y1={145 + i * 43} x2="1000" y2={225 + i * 38} stroke={C} strokeWidth="0.5" opacity="0.07"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 2 + i * 0.05, ease: EASE }} />
        ))}
        {Array.from({ length: 14 }).map((_, row) =>
          Array.from({ length: 6 }).map((_, col) => (
            <motion.rect key={`wf${row}-${col}`} x={420 + col * 52} y={160 + row * 43 - col * 0.7} width="35" height="28" fill="none" stroke={C} strokeWidth="0.4" opacity="0.08"
              initial={{ opacity: 0 }} whileInView={{ opacity: 0.08 }} viewport={{ once: true }} transition={{ delay: 2.5 + row * 0.03 + col * 0.04, duration: 0.3 }} />
          ))
        )}
        <motion.line x1="200" y1="800" x2="1100" y2="800" stroke={C} strokeWidth="2" opacity="0.1"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, ease: EASE }} />
        {[{x:400,y:150},{x:750,y:100},{x:1000,y:180},{x:400,y:800},{x:750,y:800},{x:1000,y:800}].map((p, i) => (
          <motion.circle key={i} cx={p.x} cy={p.y} r="3" fill={C} opacity="0.15"
            initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 4 + i * 0.1, type: "spring" }} />
        ))}
        <motion.g opacity="0.06" initial={{ opacity: 0 }} whileInView={{ opacity: 0.06 }} viewport={{ once: true }} transition={{ delay: 4.5 }}>
          <line x1="380" y1="150" x2="380" y2="800" stroke={C} strokeWidth="0.5" strokeDasharray="3,6" />
          <text x="370" y="475" fill={C} fontSize="11" textAnchor="end" transform="rotate(-90,370,475)">42.5m</text>
        </motion.g>
        <motion.line x1="300" y1="0" x2="300" y2="900" stroke={C} strokeWidth="0.3" opacity="0.08"
          animate={{ x1: [300, 1100], x2: [300, 1100] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />
      </motion.svg>
    </div>
  );
}

/* ================================================================== */
/*  2. VILLA LUXE 3D ISOMÉTRIQUE                                      */
/* ================================================================== */
export function ArchBg3DVilla() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.svg viewBox="0 0 1200 800" className="absolute left-[-10%] top-[5%] w-[100%] h-[100%]"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }}>
        <motion.path d="M500,500 L500,250 L250,350 L250,600 Z" fill="none" stroke={C} strokeWidth="1.5" opacity="0.12"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2.5, ease: EASE }} />
        <motion.path d="M500,250 L800,200 L800,450 L500,500 Z" fill="none" stroke={C} strokeWidth="1.5" opacity="0.10"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2.5, delay: 0.3, ease: EASE }} />
        <motion.path d="M250,350 L500,250 L800,200 L550,300 Z" fill="none" stroke={C} strokeWidth="1.2" opacity="0.08"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, delay: 0.6, ease: EASE }} />
        <motion.path d="M320,420 L320,300 L500,250 L500,370 Z" fill="none" stroke={C} strokeWidth="0.8" opacity="0.07"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 1, ease: EASE }} />
        <motion.path d="M500,250 L650,220 L650,340 L500,370 Z" fill="none" stroke={C} strokeWidth="0.8" opacity="0.06"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 1.2, ease: EASE }} />
        {[0,1,2].map((i) => (
          <motion.rect key={`bg${i}`} x={290+i*10} y={380+i*20} width={60-i*5} height={80} fill="none" stroke={C} strokeWidth="0.6" opacity="0.09" transform="skewY(20)"
            initial={{ opacity: 0 }} whileInView={{ opacity: 0.09 }} viewport={{ once: true }} transition={{ delay: 2 + i * 0.2, duration: 0.5 }} />
        ))}
        {[0,1,2,3].map((i) => (
          <motion.rect key={`bd${i}`} x={540+i*60} y={260+i*5} width="45" height="70" fill="none" stroke={C} strokeWidth="0.5" opacity="0.07" transform="skewY(-8)"
            initial={{ opacity: 0 }} whileInView={{ opacity: 0.07 }} viewport={{ once: true }} transition={{ delay: 2.3 + i * 0.15, duration: 0.5 }} />
        ))}
        <motion.path d="M300,650 L500,570 L700,620 L500,700 Z" fill="none" stroke={C2} strokeWidth="1" opacity="0.10"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, delay: 3, ease: EASE }} />
        {[0,1,2].map((i) => (
          <motion.path key={`w${i}`} d={`M${350+i*30},${640-i*10} Q500,${600-i*8} ${650-i*30},${630-i*5}`} fill="none" stroke={C2} strokeWidth="0.4" opacity="0.06"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 3.5 + i * 0.2 }} />
        ))}
        {[{x:150,y:550},{x:850,y:400},{x:900,y:500},{x:180,y:700}].map((t, i) => (
          <motion.g key={i} initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 4 + i * 0.2, type: "spring" }}>
            <circle cx={t.x} cy={t.y} r="20" fill="none" stroke={C} strokeWidth="0.6" opacity="0.08" />
            <circle cx={t.x} cy={t.y} r="12" fill="none" stroke={C} strokeWidth="0.4" opacity="0.05" />
          </motion.g>
        ))}
        {[{x:250,y:350},{x:500,y:250},{x:800,y:200},{x:250,y:600},{x:500,y:500},{x:800,y:450}].map((p, i) => (
          <motion.g key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 4.5 + i * 0.1 }}>
            <circle cx={p.x} cy={p.y} r="2.5" fill={C} opacity="0.15" />
            <circle cx={p.x} cy={p.y} r="6" fill="none" stroke={C} strokeWidth="0.3" opacity="0.08" />
          </motion.g>
        ))}
        <motion.line x1="0" y1="400" x2="1200" y2="400" stroke={C} strokeWidth="0.3" opacity="0.06"
          animate={{ y1: [100, 750], y2: [100, 750] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
      </motion.svg>
    </div>
  );
}

/* ================================================================== */
/*  3. COMPLEXE RÉSIDENTIEL 3D AÉRIEN                                  */
/* ================================================================== */
export function ArchBg3DComplex() {
  const buildings = [
    { x: 100, y: 300, w: 120, h: 250, d: 80, floors: 8 },
    { x: 300, y: 250, w: 100, h: 350, d: 70, floors: 12 },
    { x: 500, y: 280, w: 150, h: 300, d: 90, floors: 10 },
    { x: 750, y: 220, w: 90, h: 400, d: 60, floors: 14 },
    { x: 900, y: 300, w: 130, h: 280, d: 85, floors: 9 },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.svg viewBox="0 0 1200 800" className="absolute inset-0 w-full h-full"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.line key={`sg${i}`} x1={0} y1={600+i*10} x2={1200} y2={600+i*10} stroke={C} strokeWidth="0.2" opacity="0.03"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.03 }} />
        ))}
        {buildings.map((b, bi) => (
          <motion.g key={bi} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 + bi * 0.3, duration: 1, ease: EASE }}>
            <rect x={b.x} y={600-b.h} width={b.w} height={b.h} fill="none" stroke={C} strokeWidth="1.2" opacity="0.10" />
            <path d={`M${b.x+b.w},${600-b.h} L${b.x+b.w+b.d*0.6},${600-b.h-b.d*0.3} L${b.x+b.w+b.d*0.6},${600-b.d*0.3} L${b.x+b.w},600`} fill="none" stroke={C} strokeWidth="0.8" opacity="0.07" />
            <path d={`M${b.x},${600-b.h} L${b.x+b.d*0.6},${600-b.h-b.d*0.3} L${b.x+b.w+b.d*0.6},${600-b.h-b.d*0.3} L${b.x+b.w},${600-b.h}`} fill="none" stroke={C} strokeWidth="0.6" opacity="0.06" />
            {Array.from({ length: b.floors }).map((_, fi) => (
              <line key={fi} x1={b.x} y1={600-b.h+(fi+1)*(b.h/(b.floors+1))} x2={b.x+b.w} y2={600-b.h+(fi+1)*(b.h/(b.floors+1))} stroke={C} strokeWidth="0.3" opacity="0.06" />
            ))}
            {Array.from({ length: b.floors }).map((_, fi) =>
              Array.from({ length: Math.floor(b.w/25) }).map((_, wi) => (
                <rect key={`${fi}-${wi}`} x={b.x+8+wi*25} y={600-b.h+fi*(b.h/(b.floors+1))+5} width="15" height={b.h/(b.floors+1)-10} fill="none" stroke={C} strokeWidth="0.25" opacity="0.05" />
              ))
            )}
            <motion.circle cx={b.x+b.w/2} cy={600-b.h-5} r="2" fill={C} opacity="0.15"
              animate={{ opacity: [0.1,0.2,0.1] }} transition={{ duration: 2+bi*0.5, repeat: Infinity }} />
          </motion.g>
        ))}
        <motion.path d="M0,600 L1200,600" stroke={C} strokeWidth="1.5" opacity="0.08"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2 }} />
        <motion.line x1="0" y1="0" x2="0" y2="800" stroke={C} strokeWidth="0.4" opacity="0.06"
          animate={{ x1: [0,1200], x2: [0,1200] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />
      </motion.svg>
    </div>
  );
}

/* ================================================================== */
/*  4. GRANDE VILLA DÉTAILLÉE — pour Apporteurs                        */
/* ================================================================== */
export function ArchBgLuxuryVilla() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.svg viewBox="0 0 1400 900" className="absolute left-[-5%] top-[-5%] w-[110%] h-[110%]" preserveAspectRatio="xMidYMid slice"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }}>

        {/* Sol */}
        <motion.line x1="0" y1="680" x2="1400" y2="680" stroke={C} strokeWidth="2" opacity="0.12"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, ease: EASE }} />
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.line key={`g${i}`} x1={30+i*35} y1="680" x2={35+i*35} y2={690+Math.sin(i)*3} stroke={C} strokeWidth="0.4" opacity="0.06"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 2+i*0.02 }} />
        ))}

        {/* RDC */}
        <motion.rect x="300" y="430" width="800" height="250" fill="none" stroke={C} strokeWidth="1.8" opacity="0.13"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 3, ease: EASE }} />

        {/* Étage */}
        <motion.rect x="380" y="220" width="640" height="210" fill="none" stroke={C} strokeWidth="1.5" opacity="0.11"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2.5, delay: 0.5, ease: EASE }} />

        {/* Toit */}
        <motion.line x1="360" y1="220" x2="1040" y2="220" stroke={C} strokeWidth="2" opacity="0.10"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, delay: 1, ease: EASE }} />
        <motion.line x1="360" y1="215" x2="1040" y2="215" stroke={C} strokeWidth="0.5" opacity="0.06"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 1.2 }} />

        {/* Baies vitrées RDC */}
        {[0,1,2,3,4].map((i) => (
          <motion.g key={`bv${i}`} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 2+i*0.15, duration: 0.5 }}>
            <rect x={340+i*145} y="460" width="120" height="190" fill="none" stroke={C} strokeWidth="0.8" opacity="0.10" />
            <line x1={400+i*145} y1="460" x2={400+i*145} y2="650" stroke={C} strokeWidth="0.4" opacity="0.07" />
            <line x1={340+i*145} y1="555" x2={460+i*145} y2="555" stroke={C} strokeWidth="0.3" opacity="0.06" />
            <line x1={345+i*145} y1="650" x2={455+i*145} y2="470" stroke={C} strokeWidth="0.2" opacity="0.03" />
          </motion.g>
        ))}

        {/* Fenêtres étage */}
        {[0,1,2,3,4,5].map((i) => (
          <motion.g key={`fe${i}`} initial={{ opacity: 0, y: 5 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 2.5+i*0.12, duration: 0.4 }}>
            <rect x={405+i*98} y="260" width="70" height="130" fill="none" stroke={C} strokeWidth="0.7" opacity="0.09" />
            <line x1={440+i*98} y1="260" x2={440+i*98} y2="390" stroke={C} strokeWidth="0.3" opacity="0.06" />
            <line x1={405+i*98} y1="325" x2={475+i*98} y2="325" stroke={C} strokeWidth="0.3" opacity="0.05" />
          </motion.g>
        ))}

        {/* Porte */}
        <motion.rect x="660" y="520" width="80" height="160" fill="none" stroke={C} strokeWidth="1" opacity="0.12"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 3, ease: EASE }} />
        <motion.line x1="700" y1="520" x2="700" y2="680" stroke={C} strokeWidth="0.5" opacity="0.08"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 3.3 }} />
        <motion.path d="M660,520 Q700,490 740,520" fill="none" stroke={C} strokeWidth="0.7" opacity="0.08"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 3.5 }} />
        <motion.circle cx="725" cy="600" r="3" fill={C} opacity="0.10"
          initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 3.8, type: "spring" }} />

        {/* Garage */}
        <motion.rect x="100" y="480" width="200" height="200" fill="none" stroke={C} strokeWidth="1" opacity="0.09"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, delay: 1.5, ease: EASE }} />
        <motion.rect x="130" y="530" width="140" height="150" fill="none" stroke={C} strokeWidth="0.6" opacity="0.07"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 2.5 }} />
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.line key={`gl${i}`} x1="130" y1={545+i*22} x2="270" y2={545+i*22} stroke={C} strokeWidth="0.3" opacity="0.05"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 3+i*0.08 }} />
        ))}

        {/* Pergola droite */}
        <motion.path d="M1100,530 L1100,430 L1300,430 L1300,680" fill="none" stroke={C} strokeWidth="0.8" opacity="0.08"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, delay: 2, ease: EASE }} />
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.line key={`pg${i}`} x1="1100" y1={445+i*20} x2="1300" y2={445+i*20} stroke={C} strokeWidth="0.4" opacity="0.05"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 3+i*0.1 }} />
        ))}
        {[1100,1200,1300].map((x, i) => (
          <motion.line key={`pc${i}`} x1={x} y1="430" x2={x} y2="680" stroke={C} strokeWidth="0.5" opacity="0.06"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 2.5+i*0.15 }} />
        ))}

        {/* Piscine */}
        <motion.rect x="400" y="720" width="500" height="120" rx="15" fill="none" stroke={C2} strokeWidth="1.2" opacity="0.10"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, delay: 4, ease: EASE }} />
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.path key={`pw${i}`} d={`M${420+i*10},${740+i*5} Q650,${750+Math.sin(i*2)*8} ${880-i*10},${740+i*5}`}
            fill="none" stroke={C2} strokeWidth="0.3" opacity="0.05"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 4.5+i*0.1 }} />
        ))}

        {/* Arbres */}
        {[{x:60,y:620,r:30},{x:1350,y:600,r:35},{x:1280,y:650,r:22},{x:50,y:660,r:18},{x:180,y:700,r:25}].map((t, i) => (
          <motion.g key={`t${i}`} initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 5+i*0.15, type: "spring" }}>
            <circle cx={t.x} cy={t.y} r={t.r} fill="none" stroke={C} strokeWidth="0.7" opacity="0.07" />
            <circle cx={t.x} cy={t.y} r={t.r*0.6} fill="none" stroke={C} strokeWidth="0.4" opacity="0.04" />
            <line x1={t.x} y1={t.y+t.r} x2={t.x} y2={t.y+t.r+15} stroke={C} strokeWidth="0.5" opacity="0.05" />
          </motion.g>
        ))}

        {/* Cotes */}
        <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 0.07 }} viewport={{ once: true }} transition={{ delay: 5.5, duration: 1 }}>
          <line x1="100" y1="195" x2="1100" y2="195" stroke={C} strokeWidth="0.4" strokeDasharray="3,5" />
          <text x="600" y="190" fill={C} fontSize="10" textAnchor="middle">32.00 m</text>
          <line x1="80" y1="220" x2="80" y2="680" stroke={C} strokeWidth="0.4" strokeDasharray="3,5" />
          <text x="70" y="450" fill={C} fontSize="9" textAnchor="end" transform="rotate(-90,70,450)">8.50 m</text>
        </motion.g>

        {/* Points de mesure */}
        {[{x:300,y:430},{x:1100,y:430},{x:380,y:220},{x:1020,y:220},{x:300,y:680},{x:1100,y:680}].map((p, i) => (
          <motion.g key={`p${i}`} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 5.5+i*0.08 }}>
            <circle cx={p.x} cy={p.y} r="2" fill={C} opacity="0.12" />
            <circle cx={p.x} cy={p.y} r="5" fill="none" stroke={C} strokeWidth="0.3" opacity="0.06" />
          </motion.g>
        ))}

        {/* Scan line */}
        <motion.line x1="0" y1="450" x2="1400" y2="450" stroke={C} strokeWidth="0.4" opacity="0.07"
          animate={{ y1: [150, 850], y2: [150, 850] }} transition={{ duration: 7, repeat: Infinity, ease: "linear" }} />

        {/* Particules */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.circle key={`pr${i}`} cx={100+i*110} cy={300+Math.sin(i*1.5)*150} r="1.5" fill={C} opacity="0.06"
            animate={{ y: [0,-10,0], opacity: [0.04,0.08,0.04] }} transition={{ duration: 3+i*0.5, repeat: Infinity, delay: i*0.3 }} />
        ))}
      </motion.svg>
    </div>
  );
}
