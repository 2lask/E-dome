"use client";

import { motion } from "framer-motion";

const EASE = [0.165, 0.84, 0.44, 1] as const;
const STROKE = "#8B6F47";

export function FloorPlanDrawing({ className = "" }: { className?: string }) {
  const drawLine = (delay: number, opacity = 0.35) => ({
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity },
  });
  const drawTransition = (delay: number, dur = 1.4) => ({
    duration: dur, delay, ease: EASE,
  });

  return (
    <div className={`w-full ${className}`} aria-hidden="true">
      <motion.svg viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid meet" className="w-full" style={{ height: 300 }} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
        <motion.rect x="100" y="60" width="1000" height="380" fill="none" stroke={STROKE} strokeWidth="3" variants={drawLine(0, 0.4)} transition={drawTransition(0, 1.8)} />
        <motion.line x1="100" y1="200" x2="700" y2="200" stroke={STROKE} strokeWidth="2.5" variants={drawLine(0.2)} transition={drawTransition(0.2)} />
        <motion.line x1="400" y1="320" x2="1100" y2="320" stroke={STROKE} strokeWidth="2.5" variants={drawLine(0.25)} transition={drawTransition(0.25)} />
        <motion.line x1="700" y1="60" x2="700" y2="200" stroke={STROKE} strokeWidth="2.5" variants={drawLine(0.3)} transition={drawTransition(0.3)} />
        <motion.line x1="400" y1="200" x2="400" y2="440" stroke={STROKE} strokeWidth="2.5" variants={drawLine(0.35)} transition={drawTransition(0.35)} />
        <motion.line x1="700" y1="200" x2="700" y2="320" stroke={STROKE} strokeWidth="2.5" variants={drawLine(0.38)} transition={drawTransition(0.38)} />
        <motion.line x1="850" y1="60" x2="850" y2="320" stroke={STROKE} strokeWidth="2.5" variants={drawLine(0.4)} transition={drawTransition(0.4)} />
        <motion.path d="M 250 200 A 70 70 0 0 1 320 200" fill="none" stroke={STROKE} strokeWidth="1.2" strokeDasharray="4 3" variants={drawLine(0.55, 0.3)} transition={drawTransition(0.55)} />
        <motion.path d="M 400 280 A 55 55 0 0 0 400 335" fill="none" stroke={STROKE} strokeWidth="1.2" strokeDasharray="4 3" variants={drawLine(0.6, 0.3)} transition={drawTransition(0.6)} />
        <motion.line x1="100" y1="35" x2="1100" y2="35" stroke={STROKE} strokeWidth="0.8" variants={drawLine(0.8, 0.28)} transition={drawTransition(0.8)} />
        <motion.line x1="100" y1="30" x2="100" y2="40" stroke={STROKE} strokeWidth="0.8" variants={drawLine(0.8, 0.28)} transition={drawTransition(0.8)} />
        <motion.line x1="1100" y1="30" x2="1100" y2="40" stroke={STROKE} strokeWidth="0.8" variants={drawLine(0.8, 0.28)} transition={drawTransition(0.8)} />
        <motion.text x="600" y="32" textAnchor="middle" fill={STROKE} fontSize="12" fontFamily="monospace" variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.35 } }} transition={drawTransition(1)}>24.00 m</motion.text>
        <motion.line x1="75" y1="60" x2="75" y2="440" stroke={STROKE} strokeWidth="0.8" variants={drawLine(0.85, 0.28)} transition={drawTransition(0.85)} />
        <motion.text x="68" y="255" textAnchor="middle" fill={STROKE} fontSize="11" fontFamily="monospace" transform="rotate(-90, 68, 255)" variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.35 } }} transition={drawTransition(1.05)}>12.50 m</motion.text>
        <motion.text x="250" y="135" textAnchor="middle" fill={STROKE} fontSize="13" fontFamily="monospace" fontWeight="500" variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.3 } }} transition={drawTransition(1.2)}>SALON</motion.text>
        <motion.text x="250" y="150" textAnchor="middle" fill={STROKE} fontSize="9" fontFamily="monospace" variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.25 } }} transition={drawTransition(1.25)}>{"32.4 m\u00B2"}</motion.text>
        <motion.text x="250" y="340" textAnchor="middle" fill={STROKE} fontSize="13" fontFamily="monospace" fontWeight="500" variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.3 } }} transition={drawTransition(1.3)}>CHAMBRE 1</motion.text>
        <motion.text x="550" y="265" textAnchor="middle" fill={STROKE} fontSize="13" fontFamily="monospace" fontWeight="500" variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.3 } }} transition={drawTransition(1.35)}>CHAMBRE 2</motion.text>
        <motion.text x="780" y="135" textAnchor="middle" fill={STROKE} fontSize="13" fontFamily="monospace" fontWeight="500" variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.3 } }} transition={drawTransition(1.4)}>CUISINE</motion.text>
        <motion.text x="975" y="200" textAnchor="middle" fill={STROKE} fontSize="13" fontFamily="monospace" fontWeight="500" variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.3 } }} transition={drawTransition(1.45)}>BUREAU</motion.text>
        <motion.text x="620" y="135" textAnchor="middle" fill={STROKE} fontSize="11" fontFamily="monospace" fontWeight="500" variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.3 } }} transition={drawTransition(1.5)}>SDB</motion.text>
        <motion.text x="750" y="385" textAnchor="middle" fill={STROKE} fontSize="13" fontFamily="monospace" fontWeight="500" variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.3 } }} transition={drawTransition(1.5)}>HALL</motion.text>
        <motion.rect x="860" y="70" width="230" height="30" fill="none" stroke={STROKE} strokeWidth="1" variants={drawLine(0.7, 0.25)} transition={drawTransition(0.7)} />
        <motion.circle cx="950" cy="85" r="8" fill="none" stroke={STROKE} strokeWidth="0.8" variants={drawLine(0.75, 0.25)} transition={drawTransition(0.75)} />
        <motion.circle cx="980" cy="85" r="8" fill="none" stroke={STROKE} strokeWidth="0.8" variants={drawLine(0.75, 0.25)} transition={drawTransition(0.75)} />
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.line key={`stair-${i}`} x1={710 + i * 16} y1="330" x2={710 + i * 16} y2="380" stroke={STROKE} strokeWidth="0.8" variants={drawLine(0.8 + i * 0.03, 0.25)} transition={drawTransition(0.8 + i * 0.03)} />
        ))}
        <motion.line x1="1140" y1="480" x2="1140" y2="420" stroke={STROKE} strokeWidth="1.2" variants={drawLine(1.2, 0.3)} transition={drawTransition(1.2)} />
        <motion.polygon points="1132,430 1140,410 1148,430" fill={STROKE} variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.3 } }} transition={drawTransition(1.3)} />
        <motion.text x="1140" y="496" textAnchor="middle" fill={STROKE} fontSize="12" fontFamily="monospace" fontWeight="bold" variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.35 } }} transition={drawTransition(1.35)}>N</motion.text>
        <motion.text x="60" y="496" fill={STROKE} fontSize="10" fontFamily="monospace" variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.25 } }} transition={drawTransition(1.4)}>{"PLAN RDC \u2014 1:100"}</motion.text>
      </motion.svg>
    </div>
  );
}

export function BuildingElevationDrawing({ className = "" }: { className?: string }) {
  const draw = (delay: number, opacity = 0.4) => ({ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity } });
  const fade = (delay: number, opacity = 0.35) => ({ hidden: { opacity: 0 }, visible: { opacity } });
  const t = (delay: number, dur = 1.4) => ({ duration: dur, delay, ease: EASE });
  const floorH = 60, baseY = 420, bL = 200, bR = 750, bW = bR - bL;

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`} aria-hidden="true">
      <motion.svg viewBox="0 0 950 500" preserveAspectRatio="xMidYMid meet" className="w-full" style={{ height: 400 }} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
        <motion.line x1="80" y1={baseY} x2="870" y2={baseY} stroke={STROKE} strokeWidth="2" variants={draw(0, 0.5)} transition={t(0, 1.6)} />
        {Array.from({ length: 20 }).map((_, i) => (<motion.line key={`gh-${i}`} x1={120 + i * 38} y1={baseY} x2={108 + i * 38} y2={baseY + 14} stroke={STROKE} strokeWidth="0.8" variants={draw(0.1 + i * 0.02, 0.3)} transition={t(0.1 + i * 0.02, 0.6)} />))}
        <motion.rect x={bL} y={baseY - 5 * floorH} width={bW} height={5 * floorH} fill="none" stroke={STROKE} strokeWidth="2.5" variants={draw(0.2, 0.45)} transition={t(0.2, 2)} />
        {Array.from({ length: 4 }).map((_, i) => (<motion.line key={`floor-${i}`} x1={bL} y1={baseY - (i + 1) * floorH} x2={bR} y2={baseY - (i + 1) * floorH} stroke={STROKE} strokeWidth="1.5" variants={draw(0.4 + i * 0.1, 0.35)} transition={t(0.4 + i * 0.1)} />))}
        {Array.from({ length: 5 }).map((_, floor) => { const fy = baseY - (floor + 1) * floorH + 14; const wW = 40, wH = 34, wC = 8, gap = (bW - wC * wW) / (wC + 1); return Array.from({ length: wC }).map((_, w) => { const wx = bL + gap + w * (wW + gap), d = 0.5 + floor * 0.12 + w * 0.04; return (<g key={`win-${floor}-${w}`}><motion.rect x={wx} y={fy} width={wW} height={wH} fill="none" stroke={STROKE} strokeWidth="1" variants={draw(d, 0.35)} transition={t(d, 0.8)} /><motion.line x1={wx + wW / 2} y1={fy} x2={wx + wW / 2} y2={fy + wH} stroke={STROKE} strokeWidth="0.6" variants={draw(d + 0.05, 0.25)} transition={t(d + 0.05, 0.5)} /></g>); }); })}
        <motion.rect x={bL + bW / 2 - 30} y={baseY - 50} width="60" height="50" fill="none" stroke={STROKE} strokeWidth="1.5" variants={draw(0.6, 0.4)} transition={t(0.6)} />
        <motion.line x1={bL - 8} y1={baseY - 5 * floorH - 8} x2={bR + 8} y2={baseY - 5 * floorH - 8} stroke={STROKE} strokeWidth="2" variants={draw(0.3, 0.4)} transition={t(0.3)} />
        <motion.rect x={bL + bW / 2 - 60} y={baseY - 5 * floorH - 35} width="120" height="27" fill="none" stroke={STROKE} strokeWidth="1.2" variants={draw(0.35, 0.3)} transition={t(0.35)} />
        <motion.line x1="810" y1={baseY} x2="810" y2={baseY - 5 * floorH} stroke={STROKE} strokeWidth="0.8" variants={draw(1.2, 0.3)} transition={t(1.2)} />
        <motion.text x="828" y={baseY - 2.5 * floorH + 4} fill={STROKE} fontSize="11" fontFamily="monospace" variants={fade(1.4, 0.35)} transition={t(1.4)}>15.00 m</motion.text>
        {["RDC", "R+1", "R+2", "R+3", "R+4"].map((label, i) => (<motion.text key={`flbl-${i}`} x="838" y={baseY - i * floorH - floorH / 2 + 4} fill={STROKE} fontSize="9" fontFamily="monospace" variants={fade(1.5 + i * 0.05, 0.28)} transition={t(1.5 + i * 0.05)}>{label}</motion.text>))}
        <motion.line x1={bL} y1="455" x2={bR} y2="455" stroke={STROKE} strokeWidth="0.8" variants={draw(1.3, 0.3)} transition={t(1.3)} />
        <motion.text x={(bL + bR) / 2} y="472" textAnchor="middle" fill={STROKE} fontSize="11" fontFamily="monospace" variants={fade(1.5, 0.35)} transition={t(1.5)}>36.00 m</motion.text>
        <motion.text x="80" y="495" fill={STROKE} fontSize="10" fontFamily="monospace" variants={fade(1.6, 0.3)} transition={t(1.6)}>{"ELEVATION OUEST \u2014 1:200"}</motion.text>
      </motion.svg>
    </div>
  );
}

export function BlueprintGridOverlay({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="bp-fine-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <line x1="40" y1="0" x2="40" y2="40" stroke={STROKE} strokeWidth="0.5" opacity="0.06" />
            <line x1="0" y1="40" x2="40" y2="40" stroke={STROKE} strokeWidth="0.5" opacity="0.06" />
          </pattern>
          <pattern id="bp-bold-grid" width="200" height="200" patternUnits="userSpaceOnUse">
            <rect width="200" height="200" fill="url(#bp-fine-grid)" />
            <line x1="200" y1="0" x2="200" y2="200" stroke={STROKE} strokeWidth="1" opacity="0.1" />
            <line x1="0" y1="200" x2="200" y2="200" stroke={STROKE} strokeWidth="1" opacity="0.1" />
            <line x1="-4" y1="0" x2="4" y2="0" stroke={STROKE} strokeWidth="1" opacity="0.12" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke={STROKE} strokeWidth="1" opacity="0.12" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bp-bold-grid)" />
      </svg>
    </div>
  );
}
