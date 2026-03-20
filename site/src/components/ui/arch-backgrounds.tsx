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
