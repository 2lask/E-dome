"use client";

import { motion } from "framer-motion";

// ---------------------------------------------------------------------------
// Scan-line keyframe (injected once via <style>)
// ---------------------------------------------------------------------------
const scanLineStyle = `
@keyframes scanLine {
  0% { top: 0%; }
  100% { top: 100%; }
}
`;

// ---------------------------------------------------------------------------
// Reusable hover overlay with scattered code text + scan line
// ---------------------------------------------------------------------------
function HoverCodeOverlay({ codes }: { codes: { text: string; top: string; left: string; opacity: number }[] }) {
  return (
    <>
      <style>{scanLineStyle}</style>
      <style>{`.group:hover .scan-line-active { animation-play-state: running !important; }`}</style>

      {/* scan-line: a thin gradient bar sweeping top-to-bottom on hover */}
      <div
        className="scan-line-active absolute left-0 w-full h-[2px] opacity-0 group-hover:opacity-60 pointer-events-none transition-opacity duration-500 z-10"
        style={{
          background: "linear-gradient(90deg, transparent 0%, #ffe0c2 30%, #ffe0c2 70%, transparent 100%)",
          animation: "scanLine 2s linear infinite",
          animationPlayState: "paused",
        }}
      />

      {/* scattered code text */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden z-10">
        {codes.map((c, i) => (
          <span
            key={i}
            className="absolute font-mono text-[#ffe0c2] select-none"
            style={{
              top: c.top,
              left: c.left,
              opacity: c.opacity,
              fontSize: "10px",
              lineHeight: 1,
            }}
          >
            {c.text}
          </span>
        ))}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Code data sets for each scene
// ---------------------------------------------------------------------------
const villaOverlayCodes = [
  { text: "48.2156°N", top: "12%", left: "8%", opacity: 0.4 },
  { text: "7.7355°E", top: "14%", left: "15%", opacity: 0.35 },
  { text: "ALT: 423m", top: "28%", left: "72%", opacity: 0.3 },
  { text: "REF: ED-2026", top: "45%", left: "5%", opacity: 0.45 },
  { text: "LOT: A-142", top: "62%", left: "80%", opacity: 0.4 },
  { text: "SRF: 2450m²", top: "75%", left: "20%", opacity: 0.35 },
  { text: "#4A2F8B", top: "22%", left: "55%", opacity: 0.3 },
  { text: "Z: 0.00", top: "85%", left: "60%", opacity: 0.4 },
  { text: "DWG::A01-R03", top: "35%", left: "38%", opacity: 0.3 },
  { text: "0x7F3E", top: "50%", left: "65%", opacity: 0.35 },
  { text: "CRC: 9A1D", top: "8%", left: "88%", opacity: 0.3 },
  { text: "Δ +0.015", top: "70%", left: "45%", opacity: 0.4 },
];

const cityOverlayCodes = [
  { text: "46.9920°N", top: "10%", left: "6%", opacity: 0.4 },
  { text: "6.9311°E", top: "12%", left: "14%", opacity: 0.35 },
  { text: "ZONE: URB-3", top: "30%", left: "75%", opacity: 0.4 },
  { text: "LOT: B-207", top: "55%", left: "10%", opacity: 0.35 },
  { text: "SRF: 12800m²", top: "70%", left: "82%", opacity: 0.3 },
  { text: "#2C5F9E", top: "20%", left: "50%", opacity: 0.3 },
  { text: "POP: 1240", top: "42%", left: "30%", opacity: 0.4 },
  { text: "IDX: 0.45", top: "80%", left: "25%", opacity: 0.35 },
  { text: "REF: UP-2026", top: "15%", left: "90%", opacity: 0.3 },
  { text: "0xBE42", top: "65%", left: "55%", opacity: 0.4 },
];

const sectionOverlayCodes = [
  { text: "48.2156°N", top: "8%", left: "5%", opacity: 0.4 },
  { text: "7.7355°E", top: "10%", left: "12%", opacity: 0.35 },
  { text: "ALT: 423m", top: "25%", left: "78%", opacity: 0.3 },
  { text: "STR: RC-220", top: "40%", left: "8%", opacity: 0.45 },
  { text: "LOAD: 4.2kN/m²", top: "55%", left: "70%", opacity: 0.4 },
  { text: "#8B3FA2", top: "18%", left: "45%", opacity: 0.3 },
  { text: "SPAN: 9.60m", top: "68%", left: "15%", opacity: 0.35 },
  { text: "0xC4F1", top: "78%", left: "60%", opacity: 0.4 },
  { text: "Σ LEVELS: 5", top: "35%", left: "55%", opacity: 0.3 },
  { text: "FND: -3.00", top: "88%", left: "35%", opacity: 0.35 },
  { text: "REF: SC-A01", top: "5%", left: "85%", opacity: 0.3 },
  { text: "CRC: F7E2", top: "48%", left: "90%", opacity: 0.35 },
];

const detailOverlayCodes = [
  { text: "Uw: 1.2 W/m²K", top: "15%", left: "5%", opacity: 0.4 },
  { text: "Rsi: 0.13", top: "40%", left: "70%", opacity: 0.35 },
  { text: "#3D6B8A", top: "25%", left: "30%", opacity: 0.3 },
  { text: "REF: DT-001", top: "60%", left: "12%", opacity: 0.4 },
  { text: "Fe: 500N/mm²", top: "50%", left: "55%", opacity: 0.35 },
  { text: "0xA39E", top: "75%", left: "82%", opacity: 0.3 },
  { text: "λ: 0.035", top: "20%", left: "85%", opacity: 0.4 },
  { text: "SIA 265", top: "70%", left: "40%", opacity: 0.35 },
  { text: "φ12@200", top: "35%", left: "50%", opacity: 0.3 },
  { text: "CRC: 4B22", top: "80%", left: "20%", opacity: 0.4 },
];

// ---------------------------------------------------------------------------
// Shared animation helpers
// ---------------------------------------------------------------------------

const fadeInOnScroll = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.4, ease: "easeOut" as const },
  },
};

const drawLine = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: i * 0.06, duration: 1.2, ease: "easeInOut" as const },
      opacity: { delay: i * 0.06, duration: 0.3 },
    },
  }),
};

const floorReveal = (floor: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: floor * 0.3,
      duration: 0.8,
      ease: "easeOut" as const,
    },
  },
});

interface SceneProps {
  className?: string;
}

// ---------------------------------------------------------------------------
// Helper: dimension line with text
// ---------------------------------------------------------------------------
function DimLine({
  x1, y1, x2, y2, label, o, idx,
}: {
  x1: number; y1: number; x2: number; y2: number; label: string; o: number; idx: number;
}) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const isH = Math.abs(y2 - y1) < 2;
  return (
    <g>
      <motion.line x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeOpacity={o} strokeWidth="0.5" variants={drawLine} custom={idx} />
      {/* tick marks */}
      {isH ? (
        <>
          <line x1={x1} y1={y1 - 4} x2={x1} y2={y1 + 4} stroke="white" strokeOpacity={o} strokeWidth="0.5" />
          <line x1={x2} y1={y2 - 4} x2={x2} y2={y2 + 4} stroke="white" strokeOpacity={o} strokeWidth="0.5" />
        </>
      ) : (
        <>
          <line x1={x1 - 4} y1={y1} x2={x1 + 4} y2={y1} stroke="white" strokeOpacity={o} strokeWidth="0.5" />
          <line x1={x2 - 4} y1={y2} x2={x2 + 4} y2={y2} stroke="white" strokeOpacity={o} strokeWidth="0.5" />
        </>
      )}
      <text x={mx} y={my - 3} fill="white" fillOpacity={o + 0.03} fontSize="7" textAnchor="middle" fontFamily="monospace">{label}</text>
    </g>
  );
}

// ---------------------------------------------------------------------------
// Helper: section cut marker circle
// ---------------------------------------------------------------------------
function SectionMarker({ x, y, label, o }: { x: number; y: number; label: string; o: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="10" stroke="white" strokeOpacity={o + 0.05} strokeWidth="1" fill="none" />
      <text x={x} y={y + 3} fill="white" fillOpacity={o + 0.05} fontSize="8" textAnchor="middle" fontFamily="monospace">{label}</text>
    </g>
  );
}

// ---------------------------------------------------------------------------
// Helper: level marker
// ---------------------------------------------------------------------------
function LevelMarker({ x, y, label, o }: { x: number; y: number; label: string; o: number }) {
  return (
    <g>
      <polygon points={`${x},${y} ${x - 5},${y + 5} ${x + 5},${y + 5}`} fill="white" fillOpacity={o} />
      <text x={x + 8} y={y + 5} fill="white" fillOpacity={o + 0.04} fontSize="7" fontFamily="monospace">{label}</text>
    </g>
  );
}

// ---------------------------------------------------------------------------
// 1. VillaElevationScene
// ---------------------------------------------------------------------------

export function VillaElevationScene({ className = "" }: SceneProps) {
  const w = "white";
  const a = "#ffe0c2";
  const lo = 0.10; // line opacity
  const ho = 0.15; // highlight opacity

  return (
    <motion.div
      className={`${className}`}
      variants={fadeInOnScroll}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      <div className="group relative hover:bg-[#ffe0c2]/[0.02] transition-colors duration-500">
        <HoverCodeOverlay codes={villaOverlayCodes} />
      <motion.svg
        viewBox="0 0 1400 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* ---- Grid reference letters (top) ---- */}
        {["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"].map((l, i) => (
          <g key={l}>
            <circle cx={140 + i * 130} cy={22} r="10" stroke={w} strokeOpacity={0.08} strokeWidth="0.6" fill="none" />
            <text x={140 + i * 130} y={26} fill={w} fillOpacity={0.08} fontSize="8" textAnchor="middle" fontFamily="monospace">{l}</text>
            <motion.line x1={140 + i * 130} y1={32} x2={140 + i * 130} y2={440} stroke={w} strokeOpacity={0.04} strokeWidth="0.3" strokeDasharray="4 6" variants={drawLine} custom={i} />
          </g>
        ))}

        {/* ---- Grid reference numbers (left) ---- */}
        {[1, 2, 3, 4, 5].map((n, i) => (
          <g key={n}>
            <circle cx={30} cy={80 + i * 85} r="10" stroke={w} strokeOpacity={0.08} strokeWidth="0.6" fill="none" />
            <text x={30} y={84 + i * 85} fill={w} fillOpacity={0.08} fontSize="8" textAnchor="middle" fontFamily="monospace">{n}</text>
            <motion.line x1={40} y1={80 + i * 85} x2={1360} y2={80 + i * 85} stroke={w} strokeOpacity={0.03} strokeWidth="0.3" strokeDasharray="4 6" variants={drawLine} custom={i + 10} />
          </g>
        ))}

        {/* ---- Ground line ---- */}
        <motion.line x1={80} y1={390} x2={1320} y2={390} stroke={w} strokeOpacity={ho} strokeWidth="1.2" variants={drawLine} custom={0} />
        {/* Ground hatching */}
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.line key={`gh${i}`} x1={100 + i * 30} y1={390} x2={85 + i * 30} y2={405} stroke={w} strokeOpacity={0.06} strokeWidth="0.5" variants={drawLine} custom={i * 0.5} />
        ))}

        {/* ---- Foundation ---- */}
        <motion.rect x={200} y={390} width={900} height={25} stroke={w} strokeOpacity={lo} strokeWidth="0.8" fill="none" variants={drawLine} custom={1} />
        {/* Foundation hatching (concrete) */}
        {Array.from({ length: 30 }).map((_, i) => (
          <line key={`fh${i}`} x1={205 + i * 30} y1={392} x2={205 + i * 30 + 15} y2={413} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" />
        ))}

        {/* ---- Main building body ---- */}
        {/* Left wing */}
        <motion.rect x={200} y={200} width={400} height={190} stroke={w} strokeOpacity={lo} strokeWidth="0.8" fill="none" variants={drawLine} custom={2} />
        {/* Right wing (taller) */}
        <motion.rect x={600} y={140} width={500} height={250} stroke={w} strokeOpacity={lo} strokeWidth="0.8" fill="none" variants={drawLine} custom={3} />

        {/* ---- Floor line (mid level) ---- */}
        <motion.line x1={200} y1={300} x2={1100} y2={300} stroke={w} strokeOpacity={0.08} strokeWidth="0.5" strokeDasharray="8 4" variants={drawLine} custom={4} />

        {/* ---- Asymmetric roof ---- */}
        {/* Left wing flat roof with slight slope */}
        <motion.path d="M190 200 L200 195 L600 185 L610 200" stroke={w} strokeOpacity={ho} strokeWidth="1" fill="none" variants={drawLine} custom={5} />
        {/* Roof thickness */}
        <motion.path d="M195 200 L200 190 L600 180 L605 195" stroke={w} strokeOpacity={0.07} strokeWidth="0.5" fill="none" variants={drawLine} custom={5.5} />
        {/* Right wing angled roof */}
        <motion.path d="M590 140 L600 125 L850 105 L1100 125 L1110 140" stroke={w} strokeOpacity={ho} strokeWidth="1" fill="none" variants={drawLine} custom={6} />
        {/* Roof structure lines */}
        <motion.path d="M595 140 L600 120 L850 100 L1100 120 L1105 135" stroke={w} strokeOpacity={0.06} strokeWidth="0.5" fill="none" variants={drawLine} custom={6.5} />

        {/* ---- Windows - Left wing ground floor ---- */}
        {[230, 310, 390, 470].map((x, i) => (
          <g key={`wlg${i}`}>
            <motion.rect x={x} y={320} width={50} height={60} stroke={a} strokeOpacity={0.15} strokeWidth="0.8" fill={a} fillOpacity={0.03} variants={drawLine} custom={7 + i} />
            {/* Mullion vertical */}
            <line x1={x + 25} y1={320} x2={x + 25} y2={380} stroke={a} strokeOpacity={0.10} strokeWidth="0.4" />
            {/* Mullion horizontal */}
            <line x1={x} y1={350} x2={x + 50} y2={350} stroke={a} strokeOpacity={0.10} strokeWidth="0.4" />
            {/* Glass reflection line */}
            <line x1={x + 5} y1={325} x2={x + 15} y2={375} stroke={a} strokeOpacity={0.05} strokeWidth="0.3" />
          </g>
        ))}

        {/* ---- Windows - Left wing upper floor ---- */}
        {[230, 310, 390, 470].map((x, i) => (
          <g key={`wlu${i}`}>
            <motion.rect x={x} y={215} width={50} height={55} stroke={a} strokeOpacity={0.15} strokeWidth="0.8" fill={a} fillOpacity={0.03} variants={drawLine} custom={11 + i} />
            <line x1={x + 25} y1={215} x2={x + 25} y2={270} stroke={a} strokeOpacity={0.10} strokeWidth="0.4" />
            <line x1={x} y1={242} x2={x + 50} y2={242} stroke={a} strokeOpacity={0.10} strokeWidth="0.4" />
          </g>
        ))}

        {/* ---- Large panoramic window - Right wing ---- */}
        <motion.rect x={650} y={160} width={180} height={120} stroke={a} strokeOpacity={0.18} strokeWidth="1" fill={a} fillOpacity={0.04} variants={drawLine} custom={15} />
        {/* Mullion pattern - 3 vertical */}
        <line x1={695} y1={160} x2={695} y2={280} stroke={a} strokeOpacity={0.12} strokeWidth="0.5" />
        <line x1={740} y1={160} x2={740} y2={280} stroke={a} strokeOpacity={0.12} strokeWidth="0.5" />
        <line x1={785} y1={160} x2={785} y2={280} stroke={a} strokeOpacity={0.12} strokeWidth="0.5" />
        {/* Horizontal mullion */}
        <line x1={650} y1={220} x2={830} y2={220} stroke={a} strokeOpacity={0.12} strokeWidth="0.5" />

        {/* ---- Windows - Right wing additional ---- */}
        {[870, 950, 1030].map((x, i) => (
          <g key={`wrg${i}`}>
            <motion.rect x={x} y={170} width={45} height={100} stroke={a} strokeOpacity={0.14} strokeWidth="0.8" fill={a} fillOpacity={0.03} variants={drawLine} custom={16 + i} />
            <line x1={x + 22} y1={170} x2={x + 22} y2={270} stroke={a} strokeOpacity={0.09} strokeWidth="0.4" />
            <line x1={x} y1={220} x2={x + 45} y2={220} stroke={a} strokeOpacity={0.09} strokeWidth="0.4" />
          </g>
        ))}

        {/* ---- Right wing ground floor windows ---- */}
        {[650, 750, 870, 950, 1030].map((x, i) => (
          <g key={`wrgf${i}`}>
            <motion.rect x={x} y={315} width={60} height={65} stroke={a} strokeOpacity={0.14} strokeWidth="0.8" fill={a} fillOpacity={0.03} variants={drawLine} custom={19 + i} />
            <line x1={x + 30} y1={315} x2={x + 30} y2={380} stroke={a} strokeOpacity={0.09} strokeWidth="0.4" />
            <line x1={x} y1={348} x2={x + 60} y2={348} stroke={a} strokeOpacity={0.09} strokeWidth="0.4" />
          </g>
        ))}

        {/* ---- Front door ---- */}
        <motion.rect x={555} y={310} width={55} height={80} stroke={a} strokeOpacity={0.18} strokeWidth="1" fill={a} fillOpacity={0.05} variants={drawLine} custom={24} />
        {/* Door handle */}
        <circle cx={600} cy={355} r="2" stroke={a} strokeOpacity={0.15} strokeWidth="0.5" fill="none" />
        {/* Door transom */}
        <line x1={555} y1={325} x2={610} y2={325} stroke={a} strokeOpacity={0.12} strokeWidth="0.5" />

        {/* ---- Terrace / Balcony on right wing upper ---- */}
        <motion.line x1={840} y1={300} x2={1100} y2={300} stroke={w} strokeOpacity={ho} strokeWidth="1" variants={drawLine} custom={25} />
        {/* Railing posts */}
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.line key={`rp${i}`} x1={845 + i * 19} y1={280} x2={845 + i * 19} y2={300} stroke={w} strokeOpacity={lo} strokeWidth="0.5" variants={drawLine} custom={26 + i * 0.2} />
        ))}
        {/* Railing top rail */}
        <motion.line x1={840} y1={280} x2={1100} y2={280} stroke={w} strokeOpacity={lo} strokeWidth="0.7" variants={drawLine} custom={26} />
        {/* Railing mid rail */}
        <motion.line x1={840} y1={290} x2={1100} y2={290} stroke={w} strokeOpacity={0.07} strokeWidth="0.4" variants={drawLine} custom={26.5} />

        {/* ---- Garage section (far left) ---- */}
        <motion.rect x={80} y={280} width={120} height={110} stroke={w} strokeOpacity={lo} strokeWidth="0.8" fill="none" variants={drawLine} custom={28} />
        {/* Garage door */}
        <motion.rect x={95} y={310} width={90} height={80} stroke={w} strokeOpacity={ho} strokeWidth="0.8" fill="none" variants={drawLine} custom={29} />
        {/* Garage door panels */}
        {[0, 1, 2, 3].map((i) => (
          <line key={`gp${i}`} x1={95} y1={330 + i * 15} x2={185} y2={330 + i * 15} stroke={w} strokeOpacity={0.07} strokeWidth="0.4" />
        ))}
        {/* Garage flat roof */}
        <motion.line x1={75} y1={280} x2={205} y2={280} stroke={w} strokeOpacity={lo} strokeWidth="0.8" variants={drawLine} custom={30} />

        {/* ---- Landscaping: Trees ---- */}
        {/* Tree 1 - left */}
        <motion.circle cx={130} cy={350} r="30" stroke={w} strokeOpacity={0.06} strokeWidth="0.5" fill="none" variants={drawLine} custom={31} />
        <motion.circle cx={125} cy={340} r="22" stroke={w} strokeOpacity={0.05} strokeWidth="0.5" fill="none" variants={drawLine} custom={31.5} />
        <motion.line x1={130} y1={370} x2={130} y2={390} stroke={w} strokeOpacity={0.08} strokeWidth="1" variants={drawLine} custom={32} />

        {/* Tree 2 - right */}
        <motion.circle cx={1200} cy={340} r="35" stroke={w} strokeOpacity={0.06} strokeWidth="0.5" fill="none" variants={drawLine} custom={33} />
        <motion.circle cx={1195} cy={330} r="25" stroke={w} strokeOpacity={0.05} strokeWidth="0.5" fill="none" variants={drawLine} custom={33.5} />
        <motion.line x1={1200} y1={365} x2={1200} y2={390} stroke={w} strokeOpacity={0.08} strokeWidth="1.2" variants={drawLine} custom={34} />

        {/* Tree 3 - far right */}
        <motion.circle cx={1300} cy={355} r="25" stroke={w} strokeOpacity={0.06} strokeWidth="0.5" fill="none" variants={drawLine} custom={35} />
        <motion.line x1={1300} y1={375} x2={1300} y2={390} stroke={w} strokeOpacity={0.08} strokeWidth="0.8" variants={drawLine} custom={35.5} />

        {/* Bushes */}
        {[250, 380, 520, 680].map((x, i) => (
          <motion.ellipse key={`bush${i}`} cx={x} cy={385} rx={18} ry={8} stroke={w} strokeOpacity={0.06} strokeWidth="0.5" fill="none" variants={drawLine} custom={36 + i} />
        ))}

        {/* Pathway */}
        <motion.path d="M580 390 L580 440 Q580 450 570 450 L500 450 Q490 450 490 460 L490 480" stroke={w} strokeOpacity={0.08} strokeWidth="1" fill="none" variants={drawLine} custom={40} />
        {/* Pathway edges */}
        <motion.path d="M570 390 L570 435 Q570 445 560 445 L490 445" stroke={w} strokeOpacity={0.05} strokeWidth="0.5" fill="none" variants={drawLine} custom={40.5} />
        <motion.path d="M590 390 L590 445 Q590 455 580 455 L510 455" stroke={w} strokeOpacity={0.05} strokeWidth="0.5" fill="none" variants={drawLine} custom={41} />

        {/* ---- Material hatching (concrete on walls) ---- */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`ch1${i}`} x1={202} y1={205 + i * 15} x2={210} y2={210 + i * 15} stroke={w} strokeOpacity={0.04} strokeWidth="0.3" />
        ))}
        {Array.from({ length: 15 }).map((_, i) => (
          <line key={`ch2${i}`} x1={602} y1={145 + i * 16} x2={610} y2={150 + i * 16} stroke={w} strokeOpacity={0.04} strokeWidth="0.3" />
        ))}

        {/* ---- Dimension lines ---- */}
        <DimLine x1={200} y1={440} x2={600} y2={440} label="16.00 m" o={0.10} idx={42} />
        <DimLine x1={600} y1={440} x2={1100} y2={440} label="20.00 m" o={0.10} idx={43} />
        <DimLine x1={200} y1={460} x2={1100} y2={460} label="36.00 m" o={0.12} idx={44} />
        <DimLine x1={80} y1={440} x2={200} y2={440} label="4.80 m" o={0.10} idx={45} />

        {/* Vertical dimensions */}
        <DimLine x1={1140} y1={390} x2={1140} y2={300} label="3.60" o={0.10} idx={46} />
        <DimLine x1={1140} y1={300} x2={1140} y2={140} label="6.40" o={0.10} idx={47} />
        <DimLine x1={1160} y1={390} x2={1160} y2={105} label="11.40" o={0.12} idx={48} />

        {/* ---- Level markers ---- */}
        <LevelMarker x={170} y={390} label="± 0.00" o={lo} />
        <LevelMarker x={170} y={300} label="+ 3.60" o={lo} />
        <LevelMarker x={170} y={200} label="+ 7.60" o={lo} />
        <LevelMarker x={570} y={140} label="+ 10.00" o={lo} />

        {/* ---- Section cut markers ---- */}
        <SectionMarker x={350} y={460} label="A" o={lo} />
        <SectionMarker x={850} y={460} label="A" o={lo} />
        <motion.line x1={350} y1={450} x2={350} y2={80} stroke={w} strokeOpacity={0.06} strokeWidth="0.6" strokeDasharray="10 5" variants={drawLine} custom={50} />
        <motion.line x1={850} y1={450} x2={850} y2={80} stroke={w} strokeOpacity={0.06} strokeWidth="0.6" strokeDasharray="10 5" variants={drawLine} custom={51} />

        <SectionMarker x={60} y={250} label="B" o={lo} />
        <SectionMarker x={1350} y={250} label="B" o={lo} />

        {/* ---- Title block ---- */}
        <motion.rect x={1180} y={460} width={200} height={35} stroke={w} strokeOpacity={0.12} strokeWidth="0.8" fill="none" variants={drawLine} custom={52} />
        <line x1={1180} y1={478} x2={1380} y2={478} stroke={w} strokeOpacity={0.08} strokeWidth="0.5" />
        <text x={1190} y={475} fill={w} fillOpacity={0.10} fontSize="7" fontFamily="monospace">VILLA ELEVATION - FRONT</text>
        <text x={1190} y={490} fill={w} fillOpacity={0.08} fontSize="6" fontFamily="monospace">SCALE 1:100  DWG-A01</text>
        <text x={1330} y={490} fill={w} fillOpacity={0.08} fontSize="6" fontFamily="monospace">REV.03</text>

        {/* ---- Chimney on right wing ---- */}
        <motion.rect x={980} y={90} width={20} height={30} stroke={w} strokeOpacity={lo} strokeWidth="0.7" fill="none" variants={drawLine} custom={53} />
        <motion.line x1={975} y1={90} x2={1005} y2={90} stroke={w} strokeOpacity={lo} strokeWidth="0.8" variants={drawLine} custom={53.5} />

        {/* ---- Wall material pattern (glass hatching on big window) ---- */}
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={`gl${i}`} x1={655 + i * 30} y1={165} x2={660 + i * 30} y2={275} stroke={a} strokeOpacity={0.04} strokeWidth="0.3" />
        ))}

        {/* ---- Small decorative elements ---- */}
        {/* Downspouts */}
        <motion.line x1={198} y1={200} x2={198} y2={390} stroke={w} strokeOpacity={0.06} strokeWidth="0.8" variants={drawLine} custom={55} />
        <motion.line x1={1102} y1={140} x2={1102} y2={390} stroke={w} strokeOpacity={0.06} strokeWidth="0.8" variants={drawLine} custom={56} />

        {/* Window sills */}
        {[230, 310, 390, 470].map((x, i) => (
          <line key={`sill${i}`} x1={x - 3} y1={380} x2={x + 53} y2={380} stroke={w} strokeOpacity={0.07} strokeWidth="0.6" />
        ))}
      </motion.svg>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// 2. CityBlockPlanScene
// ---------------------------------------------------------------------------

export function CityBlockPlanScene({ className = "" }: SceneProps) {
  const w = "white";
  const a = "#ffe0c2";
  const lo = 0.08;

  return (
    <motion.div
      className={`${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      <div className="group relative hover:bg-[#ffe0c2]/[0.02] transition-colors duration-500">
        <HoverCodeOverlay codes={cityOverlayCodes} />
      <motion.svg
        viewBox="0 0 1400 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* ---- Streets ---- */}
        {/* Main horizontal road */}
        <motion.rect x={0} y={220} width={1400} height={60} stroke={w} strokeOpacity={lo} strokeWidth="0.6" fill="none" variants={drawLine} custom={0} />
        {/* Center lane marking */}
        {Array.from({ length: 35 }).map((_, i) => (
          <motion.line key={`cl${i}`} x1={20 + i * 40} y1={250} x2={40 + i * 40} y2={250} stroke={w} strokeOpacity={0.10} strokeWidth="0.6" variants={drawLine} custom={i * 0.3} />
        ))}
        {/* Side lane markings */}
        <motion.line x1={0} y1={235} x2={1400} y2={235} stroke={w} strokeOpacity={0.05} strokeWidth="0.4" strokeDasharray="12 8" variants={drawLine} custom={1} />
        <motion.line x1={0} y1={265} x2={1400} y2={265} stroke={w} strokeOpacity={0.05} strokeWidth="0.4" strokeDasharray="12 8" variants={drawLine} custom={1.5} />

        {/* Vertical road left */}
        <motion.rect x={350} y={0} width={50} height={500} stroke={w} strokeOpacity={lo} strokeWidth="0.6" fill="none" variants={drawLine} custom={2} />
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.line key={`vl${i}`} x1={375} y1={10 + i * 40} x2={375} y2={30 + i * 40} stroke={w} strokeOpacity={0.10} strokeWidth="0.6" variants={drawLine} custom={2 + i * 0.2} />
        ))}

        {/* Vertical road right */}
        <motion.rect x={1000} y={0} width={50} height={500} stroke={w} strokeOpacity={lo} strokeWidth="0.6" fill="none" variants={drawLine} custom={3} />
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.line key={`vr${i}`} x1={1025} y1={10 + i * 40} x2={1025} y2={30 + i * 40} stroke={w} strokeOpacity={0.10} strokeWidth="0.6" variants={drawLine} custom={3 + i * 0.2} />
        ))}

        {/* Smaller cross street */}
        <motion.rect x={650} y={0} width={35} height={220} stroke={w} strokeOpacity={0.06} strokeWidth="0.5" fill="none" variants={drawLine} custom={4} />

        {/* ---- Building footprints - Upper left block ---- */}
        {/* Houses row */}
        {[{ x: 60, y: 40, w: 70, h: 50, label: "A1" }, { x: 145, y: 40, w: 70, h: 50, label: "A2" }, { x: 230, y: 40, w: 70, h: 50, label: "A3" }].map((b, i) => (
          <g key={b.label}>
            <motion.rect x={b.x} y={b.y} width={b.w} height={b.h} stroke={w} strokeOpacity={lo} strokeWidth="0.7" fill="none" variants={drawLine} custom={5 + i} />
            <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 3} fill={w} fillOpacity={0.08} fontSize="7" textAnchor="middle" fontFamily="monospace">{b.label}</text>
            {/* Internal walls */}
            <line x1={b.x + b.w / 2} y1={b.y} x2={b.x + b.w / 2} y2={b.y + b.h} stroke={w} strokeOpacity={0.04} strokeWidth="0.3" />
          </g>
        ))}

        {/* Apartment block */}
        <motion.rect x={60} y={110} width={130} height={85} stroke={a} strokeOpacity={0.12} strokeWidth="1" fill={a} fillOpacity={0.02} variants={drawLine} custom={8} />
        <text x={125} y={155} fill={a} fillOpacity={0.10} fontSize="8" textAnchor="middle" fontFamily="monospace">B1</text>
        {/* Internal grid */}
        {[0, 1, 2].map(i => <line key={`b1v${i}`} x1={93 + i * 33} y1={110} x2={93 + i * 33} y2={195} stroke={w} strokeOpacity={0.04} strokeWidth="0.3" />)}
        {[0, 1].map(i => <line key={`b1h${i}`} x1={60} y1={138 + i * 28} x2={190} y2={138 + i * 28} stroke={w} strokeOpacity={0.04} strokeWidth="0.3" />)}

        {/* L-shaped commercial */}
        <motion.path d="M210 110 L320 110 L320 170 L280 170 L280 195 L210 195 Z" stroke={a} strokeOpacity={0.14} strokeWidth="1" fill={a} fillOpacity={0.03} variants={drawLine} custom={9} />
        <text x={260} y={150} fill={a} fillOpacity={0.10} fontSize="8" textAnchor="middle" fontFamily="monospace">B2</text>

        {/* ---- Upper right block ---- */}
        {[{ x: 420, y: 30, w: 80, h: 55, label: "C1" }, { x: 520, y: 30, w: 80, h: 55, label: "C2" }].map((b, i) => (
          <g key={b.label}>
            <motion.rect x={b.x} y={b.y} width={b.w} height={b.h} stroke={w} strokeOpacity={lo} strokeWidth="0.7" fill="none" variants={drawLine} custom={10 + i} />
            <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 3} fill={w} fillOpacity={0.08} fontSize="7" textAnchor="middle" fontFamily="monospace">{b.label}</text>
          </g>
        ))}

        {/* Highlighted building */}
        <motion.rect x={420} y={100} width={210} height={100} stroke={a} strokeOpacity={0.16} strokeWidth="1.2" fill={a} fillOpacity={0.04} variants={drawLine} custom={12} />
        <text x={525} y={155} fill={a} fillOpacity={0.12} fontSize="9" textAnchor="middle" fontFamily="monospace">D1 - RESIDENCE</text>
        {/* Courtyard inside */}
        <motion.rect x={460} y={125} width={130} height={50} stroke={w} strokeOpacity={0.06} strokeWidth="0.5" fill="none" strokeDasharray="4 3" variants={drawLine} custom={13} />

        {/* ---- Central plaza / park area ---- */}
        <motion.rect x={430} y={290} width={220} height={180} stroke={w} strokeOpacity={0.10} strokeWidth="0.8" fill="none" rx="5" variants={drawLine} custom={14} />
        {/* Park pathways */}
        <motion.path d="M430 380 L540 340 L650 380" stroke={w} strokeOpacity={0.07} strokeWidth="0.5" fill="none" variants={drawLine} custom={15} />
        <motion.path d="M540 290 L540 470" stroke={w} strokeOpacity={0.07} strokeWidth="0.5" fill="none" variants={drawLine} custom={15.5} />
        {/* Park trees (circles) */}
        {[
          { x: 470, y: 320 }, { x: 510, y: 310 }, { x: 570, y: 315 }, { x: 610, y: 325 },
          { x: 460, y: 410 }, { x: 500, y: 430 }, { x: 560, y: 440 }, { x: 620, y: 420 },
          { x: 480, y: 360 }, { x: 600, y: 370 }, { x: 540, y: 390 },
        ].map((t, i) => (
          <g key={`pt${i}`}>
            <motion.circle cx={t.x} cy={t.y} r="10" stroke={w} strokeOpacity={0.07} strokeWidth="0.5" fill="none" variants={drawLine} custom={16 + i * 0.3} />
            <motion.circle cx={t.x} cy={t.y} r="5" stroke={w} strokeOpacity={0.05} strokeWidth="0.3" fill="none" variants={drawLine} custom={16.2 + i * 0.3} />
          </g>
        ))}
        <text x={540} y={475} fill={w} fillOpacity={0.08} fontSize="7" textAnchor="middle" fontFamily="monospace">CENTRAL PARK</text>

        {/* ---- Lower left block buildings ---- */}
        {[{ x: 60, y: 300, w: 90, h: 60, label: "E1" }, { x: 170, y: 300, w: 90, h: 60, label: "E2" }, { x: 60, y: 380, w: 130, h: 70, label: "F1" }, { x: 210, y: 380, w: 80, h: 70, label: "F2" }].map((b, i) => (
          <g key={b.label}>
            <motion.rect x={b.x} y={b.y} width={b.w} height={b.h} stroke={w} strokeOpacity={lo} strokeWidth="0.7" fill="none" variants={drawLine} custom={20 + i} />
            <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 3} fill={w} fillOpacity={0.07} fontSize="7" textAnchor="middle" fontFamily="monospace">{b.label}</text>
          </g>
        ))}

        {/* ---- Right block ---- */}
        {/* Large apartment complex */}
        <motion.rect x={1070} y={30} width={280} height={160} stroke={a} strokeOpacity={0.12} strokeWidth="1" fill={a} fillOpacity={0.02} variants={drawLine} custom={24} />
        <text x={1210} y={115} fill={a} fillOpacity={0.10} fontSize="9" textAnchor="middle" fontFamily="monospace">G1 - APARTMENTS</text>
        {/* Unit grid */}
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={`g1v${i}`} x1={1117 + i * 39} y1={30} x2={1117 + i * 39} y2={190} stroke={w} strokeOpacity={0.04} strokeWidth="0.3" />
        ))}
        {Array.from({ length: 3 }).map((_, i) => (
          <line key={`g1h${i}`} x1={1070} y1={70 + i * 40} x2={1350} y2={70 + i * 40} stroke={w} strokeOpacity={0.04} strokeWidth="0.3" />
        ))}

        {/* ---- Lower right block ---- */}
        {[{ x: 1070, y: 300, w: 120, h: 80, label: "H1" }, { x: 1210, y: 300, w: 140, h: 80, label: "H2" }, { x: 1070, y: 400, w: 280, h: 70, label: "H3 - COMMERCIAL" }].map((b, i) => (
          <g key={b.label}>
            <motion.rect x={b.x} y={b.y} width={b.w} height={b.h} stroke={w} strokeOpacity={lo} strokeWidth="0.7" fill="none" variants={drawLine} custom={25 + i} />
            <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 3} fill={w} fillOpacity={0.07} fontSize="7" textAnchor="middle" fontFamily="monospace">{b.label}</text>
          </g>
        ))}

        {/* Mid-right buildings */}
        {[{ x: 700, y: 30, w: 100, h: 70, label: "I1" }, { x: 820, y: 30, w: 130, h: 70, label: "I2" }, { x: 700, y: 120, w: 250, h: 80, label: "I3" }].map((b, i) => (
          <g key={b.label}>
            <motion.rect x={b.x} y={b.y} width={b.w} height={b.h} stroke={w} strokeOpacity={lo} strokeWidth="0.7" fill="none" variants={drawLine} custom={28 + i} />
            <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 3} fill={w} fillOpacity={0.07} fontSize="7" textAnchor="middle" fontFamily="monospace">{b.label}</text>
          </g>
        ))}

        {/* ---- Parking areas ---- */}
        {/* Parking lot upper right */}
        <motion.rect x={700} y={300} width={120} height={80} stroke={w} strokeOpacity={0.06} strokeWidth="0.5" fill="none" variants={drawLine} custom={31} />
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`pk${i}`} x1={710 + i * 14} y1={300} x2={710 + i * 14} y2={340} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" />
        ))}
        <text x={760} y={365} fill={w} fillOpacity={0.06} fontSize="6" textAnchor="middle" fontFamily="monospace">PARKING</text>

        {/* Parking lot bottom */}
        <motion.rect x={840} y={300} width={100} height={80} stroke={w} strokeOpacity={0.06} strokeWidth="0.5" fill="none" variants={drawLine} custom={32} />
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={`pk2${i}`} x1={850 + i * 15} y1={300} x2={850 + i * 15} y2={340} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" />
        ))}

        {/* ---- Property boundaries (dashed) ---- */}
        <motion.rect x={50} y={20} width={290} height={190} stroke={w} strokeOpacity={0.06} strokeWidth="0.6" strokeDasharray="8 4" fill="none" variants={drawLine} custom={33} />
        <motion.rect x={50} y={290} width={290} height={180} stroke={w} strokeOpacity={0.06} strokeWidth="0.6" strokeDasharray="8 4" fill="none" variants={drawLine} custom={34} />
        <motion.rect x={410} y={20} width={230} height={190} stroke={w} strokeOpacity={0.06} strokeWidth="0.6" strokeDasharray="8 4" fill="none" variants={drawLine} custom={35} />

        {/* ---- Utility lines (dotted) ---- */}
        <motion.line x1={100} y1={0} x2={100} y2={500} stroke={w} strokeOpacity={0.04} strokeWidth="0.4" strokeDasharray="2 4" variants={drawLine} custom={36} />
        <motion.line x1={300} y1={0} x2={300} y2={500} stroke={w} strokeOpacity={0.04} strokeWidth="0.4" strokeDasharray="2 4" variants={drawLine} custom={36.5} />
        <motion.line x1={0} y1={150} x2={1400} y2={150} stroke={w} strokeOpacity={0.04} strokeWidth="0.4" strokeDasharray="2 4" variants={drawLine} custom={37} />
        <motion.line x1={0} y1={400} x2={1400} y2={400} stroke={w} strokeOpacity={0.04} strokeWidth="0.4" strokeDasharray="2 4" variants={drawLine} custom={37.5} />

        {/* ---- North arrow ---- */}
        <g>
          <motion.line x1={1340} y1={470} x2={1340} y2={420} stroke={w} strokeOpacity={0.12} strokeWidth="1" variants={drawLine} custom={38} />
          <motion.polygon points="1340,415 1335,425 1345,425" fill={w} fillOpacity={0.12} />
          <text x={1340} y={412} fill={w} fillOpacity={0.12} fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">N</text>
        </g>

        {/* ---- Scale bar ---- */}
        <g>
          <motion.line x1={50} y1={480} x2={250} y2={480} stroke={w} strokeOpacity={0.10} strokeWidth="0.8" variants={drawLine} custom={39} />
          {[0, 50, 100, 150, 200].map((d, i) => (
            <g key={`sb${i}`}>
              <line x1={50 + d} y1={476} x2={50 + d} y2={484} stroke={w} strokeOpacity={0.10} strokeWidth="0.5" />
              <text x={50 + d} y={493} fill={w} fillOpacity={0.08} fontSize="5" textAnchor="middle" fontFamily="monospace">{i * 25}m</text>
            </g>
          ))}
        </g>

        {/* ---- Crosswalks ---- */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.rect key={`cw${i}`} x={365 + i * 5} y={218} width={3} height={64} fill={w} fillOpacity={0.06} variants={drawLine} custom={40 + i * 0.2} />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.rect key={`cw2${i}`} x={1015 + i * 5} y={218} width={3} height={64} fill={w} fillOpacity={0.06} variants={drawLine} custom={41 + i * 0.2} />
        ))}

        {/* Street label */}
        <text x={700} y={255} fill={w} fillOpacity={0.07} fontSize="7" textAnchor="middle" fontFamily="monospace">RUE PRINCIPALE</text>
        <text x={375} y={155} fill={w} fillOpacity={0.06} fontSize="6" textAnchor="middle" fontFamily="monospace" transform="rotate(-90 375 155)">AV. DU PARC</text>
      </motion.svg>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// 3. BuildingSectionCutScene
// ---------------------------------------------------------------------------

export function BuildingSectionCutScene({ className = "" }: SceneProps) {
  const w = "white";
  const a = "#ffe0c2";

  // Floor Y positions (from bottom to top)
  const floors = [
    { y: 500, h: 60, label: "PARKING -1", level: "- 3.00" },
    { y: 440, h: 80, label: "RDC", level: "± 0.00" },
    { y: 360, h: 80, label: "1er ETAGE", level: "+ 3.20" },
    { y: 280, h: 80, label: "2e ETAGE", level: "+ 6.40" },
    { y: 200, h: 80, label: "3e ETAGE", level: "+ 9.60" },
  ];

  return (
    <motion.div
      className={`${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="group relative hover:bg-[#ffe0c2]/[0.02] transition-colors duration-500">
        <HoverCodeOverlay codes={sectionOverlayCodes} />
      <motion.svg
        viewBox="0 0 1400 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* ---- Ground line ---- */}
        <motion.line x1={50} y1={440} x2={1350} y2={440} stroke={w} strokeOpacity={0.12} strokeWidth="1" variants={drawLine} custom={0} />
        {/* Ground hatching */}
        {Array.from({ length: 45 }).map((_, i) => (
          <line key={`gnd${i}`} x1={60 + i * 29} y1={440} x2={50 + i * 29} y2={450} stroke={w} strokeOpacity={0.06} strokeWidth="0.4" />
        ))}

        {/* ---- Underground parking (floor 0) ---- */}
        <motion.g variants={floorReveal(0)}>
          {/* Foundation walls */}
          <rect x={200} y={500} width={1000} height={10} stroke={w} strokeOpacity={0.10} strokeWidth="0.8" fill="none" />
          {/* Foundation hatching */}
          {Array.from({ length: 33 }).map((_, i) => (
            <line key={`fnd${i}`} x1={205 + i * 30} y1={502} x2={210 + i * 30} y2={508} stroke={w} strokeOpacity={0.04} strokeWidth="0.3" />
          ))}
          {/* Parking space */}
          <rect x={220} y={450} width={960} height={50} stroke={w} strokeOpacity={0.08} strokeWidth="0.6" fill="none" />
          {/* Parking columns */}
          {[350, 550, 750, 950].map((x, i) => (
            <g key={`pc${i}`}>
              <rect x={x} y={450} width={15} height={50} stroke={a} strokeOpacity={0.12} strokeWidth="0.8" fill={a} fillOpacity={0.03} />
              {/* Hatching on column */}
              {Array.from({ length: 4 }).map((_, j) => (
                <line key={`pch${i}${j}`} x1={x + 2} y1={455 + j * 12} x2={x + 13} y2={458 + j * 12} stroke={a} strokeOpacity={0.06} strokeWidth="0.3" />
              ))}
            </g>
          ))}
          {/* Cars (simplified) */}
          <rect x={260} y={465} width={60} height={25} rx="5" stroke={w} strokeOpacity={0.05} strokeWidth="0.4" fill="none" />
          <rect x={400} y={465} width={60} height={25} rx="5" stroke={w} strokeOpacity={0.05} strokeWidth="0.4" fill="none" />
          <rect x={600} y={465} width={60} height={25} rx="5" stroke={w} strokeOpacity={0.05} strokeWidth="0.4" fill="none" />
          {/* Level text */}
          <text x={160} y={480} fill={w} fillOpacity={0.08} fontSize="7" textAnchor="end" fontFamily="monospace">PARKING -1</text>
          {/* Ramp */}
          <motion.path d="M1180 440 L1180 490 L1050 490" stroke={w} strokeOpacity={0.07} strokeWidth="0.6" fill="none" variants={drawLine} custom={1} />
          <text x={1120} y={485} fill={w} fillOpacity={0.06} fontSize="5" fontFamily="monospace">RAMPE</text>
        </motion.g>

        {/* ---- Ground floor (RDC) ---- */}
        <motion.g variants={floorReveal(1)}>
          {/* Exterior walls */}
          <rect x={200} y={370} width={20} height={70} stroke={w} strokeOpacity={0.12} strokeWidth="0.8" fill="none" />
          <rect x={1180} y={370} width={20} height={70} stroke={w} strokeOpacity={0.12} strokeWidth="0.8" fill="none" />
          {/* Wall hatching left */}
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={`whl${i}`} x1={203} y1={375 + i * 13} x2={217} y2={378 + i * 13} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" />
          ))}
          {/* Wall hatching right */}
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={`whr${i}`} x1={1183} y1={375 + i * 13} x2={1197} y2={378 + i * 13} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" />
          ))}
          {/* Floor slab */}
          <rect x={200} y={365} width={1000} height={8} stroke={w} strokeOpacity={0.10} strokeWidth="0.6" fill="none" />
          {/* Internal walls */}
          <rect x={450} y={373} width={10} height={67} stroke={w} strokeOpacity={0.08} strokeWidth="0.5" fill="none" />
          <rect x={700} y={373} width={10} height={67} stroke={w} strokeOpacity={0.08} strokeWidth="0.5" fill="none" />
          <rect x={950} y={373} width={10} height={67} stroke={w} strokeOpacity={0.08} strokeWidth="0.5" fill="none" />

          {/* Living room furniture */}
          {/* Sofa */}
          <rect x={250} y={400} width={60} height={20} rx="3" stroke={w} strokeOpacity={0.06} strokeWidth="0.4" fill="none" />
          <rect x={250} y={395} width={60} height={6} rx="2" stroke={w} strokeOpacity={0.05} strokeWidth="0.3" fill="none" />
          {/* Coffee table */}
          <rect x={270} y={425} width={25} height={12} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" fill="none" />
          <text x={340} y={420} fill={w} fillOpacity={0.06} fontSize="6" textAnchor="middle" fontFamily="monospace">SALON</text>

          {/* Kitchen */}
          {/* Counter */}
          <rect x={480} y={375} width={80} height={12} stroke={w} strokeOpacity={0.06} strokeWidth="0.4" fill="none" />
          {/* Sink */}
          <circle cx={510} cy={381} r="4" stroke={w} strokeOpacity={0.05} strokeWidth="0.3" fill="none" />
          {/* Stove */}
          <rect x={535} y={377} width={12} height={8} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" fill="none" />
          {/* Kitchen table */}
          <rect x={490} y={410} width={40} height={25} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" fill="none" />
          {/* Chairs */}
          {[{ x: 495, y: 408 }, { x: 515, y: 408 }, { x: 495, y: 437 }, { x: 515, y: 437 }].map((c, i) => (
            <circle key={`ch${i}`} cx={c.x} cy={c.y} r="3" stroke={w} strokeOpacity={0.04} strokeWidth="0.3" fill="none" />
          ))}
          <text x={540} y={420} fill={w} fillOpacity={0.06} fontSize="6" textAnchor="middle" fontFamily="monospace">CUISINE</text>

          {/* Entrance */}
          <text x={840} y={420} fill={w} fillOpacity={0.06} fontSize="6" textAnchor="middle" fontFamily="monospace">ENTREE</text>
          {/* Door arc */}
          <motion.path d="M730 440 A20 20 0 0 1 710 420" stroke={w} strokeOpacity={0.06} strokeWidth="0.4" fill="none" variants={drawLine} custom={8} />

          {/* Office */}
          <rect x={980} y={395} width={50} height={30} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" fill="none" />
          <rect x={990} y={400} width={15} height={10} stroke={w} strokeOpacity={0.04} strokeWidth="0.3" fill="none" />
          <text x={1050} y={420} fill={w} fillOpacity={0.06} fontSize="6" textAnchor="middle" fontFamily="monospace">BUREAU</text>

          {/* Columns */}
          {[350, 550, 750, 950].map((x, i) => (
            <rect key={`gcol${i}`} x={x} y={373} width={12} height={67} stroke={a} strokeOpacity={0.10} strokeWidth="0.7" fill={a} fillOpacity={0.02} />
          ))}

          <text x={160} y={410} fill={w} fillOpacity={0.08} fontSize="7" textAnchor="end" fontFamily="monospace">RDC</text>
        </motion.g>

        {/* ---- 1st floor ---- */}
        <motion.g variants={floorReveal(2)}>
          <rect x={200} y={290} width={20} height={75} stroke={w} strokeOpacity={0.12} strokeWidth="0.8" fill="none" />
          <rect x={1180} y={290} width={20} height={75} stroke={w} strokeOpacity={0.12} strokeWidth="0.8" fill="none" />
          <rect x={200} y={285} width={1000} height={8} stroke={w} strokeOpacity={0.10} strokeWidth="0.6" fill="none" />
          {/* Internal walls */}
          <rect x={500} y={293} width={8} height={72} stroke={w} strokeOpacity={0.08} strokeWidth="0.5" fill="none" />
          <rect x={800} y={293} width={8} height={72} stroke={w} strokeOpacity={0.08} strokeWidth="0.5" fill="none" />

          {/* Bedroom 1 */}
          <rect x={260} y={310} width={55} height={40} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" fill="none" />
          <rect x={260} y={300} width={55} height={10} stroke={w} strokeOpacity={0.04} strokeWidth="0.3" fill="none" />
          <text x={350} y={340} fill={w} fillOpacity={0.06} fontSize="6" textAnchor="middle" fontFamily="monospace">CH. 1</text>

          {/* Bedroom 2 */}
          <rect x={560} y={310} width={55} height={40} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" fill="none" />
          <rect x={560} y={300} width={55} height={10} stroke={w} strokeOpacity={0.04} strokeWidth="0.3" fill="none" />
          <text x={660} y={340} fill={w} fillOpacity={0.06} fontSize="6" textAnchor="middle" fontFamily="monospace">CH. 2</text>

          {/* Bathroom */}
          <rect x={850} y={310} width={25} height={15} rx="3" stroke={w} strokeOpacity={0.05} strokeWidth="0.3" fill="none" />
          <circle cx={900} cy={318} r="8" stroke={w} strokeOpacity={0.04} strokeWidth="0.3" fill="none" />
          <text x={920} y={340} fill={w} fillOpacity={0.06} fontSize="6" textAnchor="middle" fontFamily="monospace">SDB</text>

          {/* Bedroom 3 */}
          <rect x={980} y={310} width={55} height={40} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" fill="none" />
          <text x={1060} y={340} fill={w} fillOpacity={0.06} fontSize="6" textAnchor="middle" fontFamily="monospace">CH. 3</text>

          {/* Columns */}
          {[350, 550, 750, 950].map((x, i) => (
            <rect key={`f1col${i}`} x={x} y={293} width={12} height={72} stroke={a} strokeOpacity={0.10} strokeWidth="0.7" fill={a} fillOpacity={0.02} />
          ))}

          <text x={160} y={330} fill={w} fillOpacity={0.08} fontSize="7" textAnchor="end" fontFamily="monospace">1er ETAGE</text>
        </motion.g>

        {/* ---- 2nd floor ---- */}
        <motion.g variants={floorReveal(3)}>
          <rect x={200} y={210} width={20} height={75} stroke={w} strokeOpacity={0.12} strokeWidth="0.8" fill="none" />
          <rect x={1180} y={210} width={20} height={75} stroke={w} strokeOpacity={0.12} strokeWidth="0.8" fill="none" />
          <rect x={200} y={205} width={1000} height={8} stroke={w} strokeOpacity={0.10} strokeWidth="0.6" fill="none" />
          <rect x={600} y={213} width={8} height={72} stroke={w} strokeOpacity={0.08} strokeWidth="0.5" fill="none" />
          <rect x={900} y={213} width={8} height={72} stroke={w} strokeOpacity={0.08} strokeWidth="0.5" fill="none" />

          {/* Living area */}
          <rect x={280} y={230} width={50} height={18} rx="3" stroke={w} strokeOpacity={0.05} strokeWidth="0.3" fill="none" />
          <rect x={260} y={255} width={25} height={15} stroke={w} strokeOpacity={0.04} strokeWidth="0.3" fill="none" />
          <text x={400} y={255} fill={w} fillOpacity={0.06} fontSize="6" textAnchor="middle" fontFamily="monospace">SEJOUR</text>

          {/* Bedroom */}
          <rect x={660} y={230} width={55} height={40} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" fill="none" />
          <text x={750} y={255} fill={w} fillOpacity={0.06} fontSize="6" textAnchor="middle" fontFamily="monospace">CH. MAITRE</text>

          {/* Studio */}
          <rect x={960} y={240} width={40} height={25} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" fill="none" />
          <text x={1050} y={255} fill={w} fillOpacity={0.06} fontSize="6" textAnchor="middle" fontFamily="monospace">STUDIO</text>

          {/* Columns */}
          {[350, 550, 750, 950].map((x, i) => (
            <rect key={`f2col${i}`} x={x} y={213} width={12} height={72} stroke={a} strokeOpacity={0.10} strokeWidth="0.7" fill={a} fillOpacity={0.02} />
          ))}

          <text x={160} y={255} fill={w} fillOpacity={0.08} fontSize="7" textAnchor="end" fontFamily="monospace">2e ETAGE</text>
        </motion.g>

        {/* ---- 3rd floor (top) ---- */}
        <motion.g variants={floorReveal(4)}>
          <rect x={200} y={130} width={20} height={75} stroke={w} strokeOpacity={0.12} strokeWidth="0.8" fill="none" />
          <rect x={1180} y={130} width={20} height={75} stroke={w} strokeOpacity={0.12} strokeWidth="0.8" fill="none" />
          <rect x={200} y={125} width={1000} height={8} stroke={w} strokeOpacity={0.10} strokeWidth="0.6" fill="none" />
          <rect x={650} y={133} width={8} height={72} stroke={w} strokeOpacity={0.08} strokeWidth="0.5" fill="none" />

          {/* Penthouse */}
          <rect x={280} y={150} width={60} height={18} rx="3" stroke={w} strokeOpacity={0.05} strokeWidth="0.3" fill="none" />
          <rect x={380} y={148} width={30} height={20} stroke={w} strokeOpacity={0.04} strokeWidth="0.3" fill="none" />
          <text x={430} y={175} fill={w} fillOpacity={0.06} fontSize="6" textAnchor="middle" fontFamily="monospace">PENTHOUSE</text>

          <rect x={720} y={150} width={55} height={40} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" fill="none" />
          <text x={850} y={175} fill={w} fillOpacity={0.06} fontSize="6" textAnchor="middle" fontFamily="monospace">TERRASSE</text>

          {/* Columns */}
          {[350, 550, 750, 950].map((x, i) => (
            <rect key={`f3col${i}`} x={x} y={133} width={12} height={72} stroke={a} strokeOpacity={0.10} strokeWidth="0.7" fill={a} fillOpacity={0.02} />
          ))}

          <text x={160} y={175} fill={w} fillOpacity={0.08} fontSize="7" textAnchor="end" fontFamily="monospace">3e ETAGE</text>
        </motion.g>

        {/* ---- Roof structure ---- */}
        <motion.g variants={floorReveal(5)}>
          {/* Roof slab */}
          <rect x={190} y={120} width={1030} height={10} stroke={w} strokeOpacity={0.12} strokeWidth="0.8" fill="none" />
          {/* Insulation layer */}
          <rect x={190} y={110} width={1030} height={10} stroke={w} strokeOpacity={0.06} strokeWidth="0.5" fill="none" />
          {/* Insulation hatching (zigzag) */}
          <motion.path d={`M190 115 ${Array.from({ length: 103 }).map((_, i) => `L${195 + i * 10} ${i % 2 === 0 ? 112 : 118}`).join(' ')}`} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" fill="none" variants={drawLine} custom={30} />
          {/* Waterproofing membrane */}
          <line x1={190} y1={108} x2={1220} y2={108} stroke={w} strokeOpacity={0.08} strokeWidth="0.8" />
          {/* Parapet */}
          <rect x={190} y={100} width={15} height={25} stroke={w} strokeOpacity={0.10} strokeWidth="0.6" fill="none" />
          <rect x={1205} y={100} width={15} height={25} stroke={w} strokeOpacity={0.10} strokeWidth="0.6" fill="none" />
          {/* Roof slope indicator */}
          <motion.path d="M400 108 L700 103" stroke={w} strokeOpacity={0.06} strokeWidth="0.4" variants={drawLine} custom={31} />
          <text x={550} y={100} fill={w} fillOpacity={0.06} fontSize="5" textAnchor="middle" fontFamily="monospace">1.5%</text>
        </motion.g>

        {/* ---- Staircase (running through all floors) ---- */}
        <motion.g variants={floorReveal(1)}>
          {/* Stair well shaft */}
          <rect x={1100} y={130} width={60} height={370} stroke={w} strokeOpacity={0.10} strokeWidth="0.8" fill="none" />
          {/* Steps in each floor */}
          {floors.map((f, fi) => (
            <g key={`stair${fi}`}>
              {Array.from({ length: 6 }).map((_, si) => (
                <line key={`step${fi}${si}`} x1={1105} y1={f.y - 10 - si * 10} x2={1155} y2={f.y - 10 - si * 10} stroke={w} strokeOpacity={0.06} strokeWidth="0.4" />
              ))}
            </g>
          ))}
          {/* Handrail */}
          <motion.line x1={1130} y1={130} x2={1130} y2={500} stroke={w} strokeOpacity={0.05} strokeWidth="0.4" variants={drawLine} custom={20} />
          <text x={1130} y={515} fill={w} fillOpacity={0.06} fontSize="5" textAnchor="middle" fontFamily="monospace">CAGE ESC.</text>
        </motion.g>

        {/* ---- Plumbing / utility lines ---- */}
        {/* Water supply (very thin blue-ish) */}
        <motion.path d="M460 510 L460 370 L460 290 L460 210 L460 130" stroke={a} strokeOpacity={0.06} strokeWidth="0.4" strokeDasharray="3 2" variants={drawLine} custom={22} />
        {/* Drain pipe */}
        <motion.path d="M480 510 L480 373 L480 293 L480 213 L480 133" stroke={w} strokeOpacity={0.05} strokeWidth="0.4" strokeDasharray="5 3" variants={drawLine} custom={23} />
        {/* Electrical conduit */}
        <motion.path d="M850 510 L850 130" stroke={w} strokeOpacity={0.04} strokeWidth="0.3" strokeDasharray="2 4" variants={drawLine} custom={24} />

        {/* ---- Level annotations (right side) ---- */}
        {[
          { y: 440, label: "± 0.00" },
          { y: 365, label: "+ 3.20" },
          { y: 285, label: "+ 6.40" },
          { y: 205, label: "+ 9.60" },
          { y: 125, label: "+ 12.80" },
          { y: 500, label: "- 3.00" },
        ].map((lv, i) => (
          <g key={`lv${i}`}>
            <polygon points={`${1260},${lv.y} ${1255},${lv.y + 5} ${1265},${lv.y + 5}`} fill={w} fillOpacity={0.10} />
            <motion.line x1={1240} y1={lv.y} x2={1350} y2={lv.y} stroke={w} strokeOpacity={0.08} strokeWidth="0.5" variants={drawLine} custom={25 + i} />
            <text x={1280} y={lv.y - 4} fill={w} fillOpacity={0.10} fontSize="7" fontFamily="monospace">{lv.label}</text>
          </g>
        ))}

        {/* ---- Dimension lines ---- */}
        <DimLine x1={200} y1={540} x2={1200} y2={540} label="40.00 m" o={0.10} idx={32} />
        <DimLine x1={200} y1={555} x2={450} y2={555} label="10.00" o={0.08} idx={33} />
        <DimLine x1={460} y1={555} x2={700} y2={555} label="9.60" o={0.08} idx={34} />
        <DimLine x1={710} y1={555} x2={950} y2={555} label="9.60" o={0.08} idx={35} />
        <DimLine x1={960} y1={555} x2={1200} y2={555} label="9.60" o={0.08} idx={36} />

        {/* ---- Structural beams highlighted ---- */}
        {floors.slice(1).map((f, i) => (
          <motion.rect key={`beam${i}`} x={220} y={f.y - f.h - 3} width={960} height={6} stroke={a} strokeOpacity={0.08} strokeWidth="0.5" fill={a} fillOpacity={0.02} variants={drawLine} custom={37 + i} />
        ))}

        {/* ---- Section cut title ---- */}
        <motion.rect x={50} y={555} width={120} height={30} stroke={w} strokeOpacity={0.10} strokeWidth="0.7" fill="none" variants={drawLine} custom={42} />
        <text x={60} y={572} fill={w} fillOpacity={0.10} fontSize="7" fontFamily="monospace">COUPE A-A</text>
        <text x={60} y={582} fill={w} fillOpacity={0.07} fontSize="5" fontFamily="monospace">ECHELLE 1:100</text>

        {/* ---- Section cut markers at top ---- */}
        <SectionMarker x={200} y={85} label="A" o={0.10} />
        <SectionMarker x={1200} y={85} label="A" o={0.10} />
        <motion.line x1={210} y1={85} x2={1190} y2={85} stroke={w} strokeOpacity={0.06} strokeWidth="0.6" strokeDasharray="10 5" variants={drawLine} custom={43} />

        {/* ---- Windows on section cut face ---- */}
        {[365, 285, 205, 125].map((y, i) => (
          <g key={`secwin${i}`}>
            <rect x={200} y={y + 15} width={3} height={40} stroke={a} strokeOpacity={0.12} strokeWidth="0.5" fill={a} fillOpacity={0.05} />
            <rect x={1197} y={y + 15} width={3} height={40} stroke={a} strokeOpacity={0.12} strokeWidth="0.5" fill={a} fillOpacity={0.05} />
          </g>
        ))}

        {/* ---- Material pattern legend ---- */}
        <g>
          <rect x={1260} y={540} width={120} height={50} stroke={w} strokeOpacity={0.08} strokeWidth="0.5" fill="none" />
          <text x={1270} y={555} fill={w} fillOpacity={0.08} fontSize="5" fontFamily="monospace">LEGENDE:</text>
          {/* Concrete pattern */}
          <rect x={1270} y={560} width={15} height={8} stroke={w} strokeOpacity={0.07} strokeWidth="0.4" fill="none" />
          <line x1={1272} y1={562} x2={1283} y2={566} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" />
          <text x={1290} y={567} fill={w} fillOpacity={0.06} fontSize="5" fontFamily="monospace">BETON</text>
          {/* Insulation pattern */}
          <path d="M1270 575 L1275 573 L1280 577 L1285 573" stroke={w} strokeOpacity={0.07} strokeWidth="0.4" fill="none" />
          <text x={1290} y={578} fill={w} fillOpacity={0.06} fontSize="5" fontFamily="monospace">ISOLATION</text>
        </g>
      </motion.svg>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// 4. ArchitecturalDetailStrip
// ---------------------------------------------------------------------------

export function ArchitecturalDetailStrip({ className = "" }: SceneProps) {
  const w = "white";
  const a = "#ffe0c2";
  const lo = 0.10;

  return (
    <motion.div
      className={`${className}`}
      variants={fadeInOnScroll}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="group relative hover:bg-[#ffe0c2]/[0.02] transition-colors duration-500">
        <HoverCodeOverlay codes={detailOverlayCodes} />
      <motion.svg
        viewBox="0 0 1400 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* ---- Connecting dimension line across entire strip ---- */}
        <motion.line x1={30} y1={185} x2={1370} y2={185} stroke={w} strokeOpacity={0.08} strokeWidth="0.5" variants={drawLine} custom={0} />
        {[30, 350, 700, 1050, 1370].map((x, i) => (
          <line key={`tick${i}`} x1={x} y1={181} x2={x} y2={189} stroke={w} strokeOpacity={0.08} strokeWidth="0.5" />
        ))}

        {/* ==== DETAIL 1: Window Section ==== */}
        <motion.rect x={30} y={10} width={300} height={165} stroke={w} strokeOpacity={lo} strokeWidth="0.7" fill="none" variants={drawLine} custom={1} />
        <text x={180} y={25} fill={a} fillOpacity={0.15} fontSize="7" textAnchor="middle" fontFamily="monospace">DETAIL 1 - WINDOW SECTION</text>
        <line x1={30} y1={30} x2={330} y2={30} stroke={w} strokeOpacity={0.08} strokeWidth="0.4" />

        {/* Wall section (thick) */}
        <rect x={60} y={45} width={25} height={120} stroke={w} strokeOpacity={lo} strokeWidth="0.7" fill="none" />
        {/* Wall hatching */}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`wwh${i}`} x1={63} y1={50 + i * 14} x2={82} y2={55 + i * 14} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" />
        ))}
        {/* Insulation inside wall */}
        <path d={`M72 45 ${Array.from({ length: 12 }).map((_, i) => `L${i % 2 === 0 ? 68 : 76} ${50 + i * 10}`).join(' ')}`} stroke={w} strokeOpacity={0.06} strokeWidth="0.3" fill="none" />

        {/* Window frame (double glazing detail) */}
        <rect x={85} y={60} width={12} height={90} stroke={a} strokeOpacity={0.15} strokeWidth="0.8" fill="none" />
        {/* Outer glass */}
        <line x1={89} y1={62} x2={89} y2={148} stroke={a} strokeOpacity={0.12} strokeWidth="0.5" />
        {/* Inner glass */}
        <line x1={93} y1={62} x2={93} y2={148} stroke={a} strokeOpacity={0.12} strokeWidth="0.5" />
        {/* Spacer bars */}
        <rect x={89} y={60} width={4} height={3} fill={w} fillOpacity={0.06} />
        <rect x={89} y={147} width={4} height={3} fill={w} fillOpacity={0.06} />

        {/* Sill detail */}
        <rect x={60} y={150} width={45} height={8} stroke={w} strokeOpacity={lo} strokeWidth="0.6" fill="none" />
        {/* Drip edge */}
        <path d="M60 158 L58 162 L63 162 L60 158" stroke={w} strokeOpacity={0.08} strokeWidth="0.4" fill="none" />

        {/* Lintel above */}
        <rect x={60} y={45} width={45} height={10} stroke={w} strokeOpacity={lo} strokeWidth="0.6" fill="none" />
        {/* Steel angle */}
        <path d="M85 45 L100 45 L100 50" stroke={a} strokeOpacity={0.12} strokeWidth="0.6" fill="none" />

        {/* Interior finish */}
        <rect x={50} y={45} width={10} height={120} stroke={w} strokeOpacity={0.06} strokeWidth="0.4" fill="none" />

        {/* Dimension annotations */}
        <DimLine x1={105} y1={60} x2={105} y2={150} label="90cm" o={lo} idx={2} />
        <DimLine x1={50} y1={170} x2={97} y2={170} label="20cm" o={lo} idx={3} />

        {/* Detail callouts */}
        <text x={120} y={80} fill={a} fillOpacity={0.12} fontSize="5" fontFamily="monospace">DOUBLE</text>
        <text x={120} y={88} fill={a} fillOpacity={0.12} fontSize="5" fontFamily="monospace">VITRAGE</text>
        <line x1={97} y1={85} x2={118} y2={85} stroke={a} strokeOpacity={0.08} strokeWidth="0.3" />

        {/* Weatherseal */}
        {[65, 145].map((y, i) => (
          <circle key={`ws${i}`} cx={87} cy={y} r="1.5" stroke={a} strokeOpacity={0.10} strokeWidth="0.4" fill="none" />
        ))}
        <text x={130} y={145} fill={w} fillOpacity={0.08} fontSize="5" fontFamily="monospace">JOINT</text>
        <line x1={97} y1={145} x2={128} y2={145} stroke={w} strokeOpacity={0.06} strokeWidth="0.3" />

        {/* Scale */}
        <text x={180} y={175} fill={w} fillOpacity={0.08} fontSize="5" textAnchor="middle" fontFamily="monospace">1:5</text>

        {/* ==== DETAIL 2: Door Section ==== */}
        <motion.rect x={355} y={10} width={320} height={165} stroke={w} strokeOpacity={lo} strokeWidth="0.7" fill="none" variants={drawLine} custom={4} />
        <text x={515} y={25} fill={a} fillOpacity={0.15} fontSize="7" textAnchor="middle" fontFamily="monospace">DETAIL 2 - DOOR SECTION</text>
        <line x1={355} y1={30} x2={675} y2={30} stroke={w} strokeOpacity={0.08} strokeWidth="0.4" />

        {/* Floor section */}
        <rect x={380} y={145} width={270} height={15} stroke={w} strokeOpacity={lo} strokeWidth="0.6" fill="none" />
        {/* Floor hatching */}
        {Array.from({ length: 18 }).map((_, i) => (
          <line key={`flh${i}`} x1={385 + i * 15} y1={147} x2={390 + i * 15} y2={158} stroke={w} strokeOpacity={0.04} strokeWidth="0.3" />
        ))}

        {/* Wall left */}
        <rect x={380} y={40} width={22} height={105} stroke={w} strokeOpacity={lo} strokeWidth="0.7" fill="none" />
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`dwh${i}`} x1={383} y1={45 + i * 14} x2={399} y2={50 + i * 14} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" />
        ))}

        {/* Wall right */}
        <rect x={600} y={40} width={22} height={105} stroke={w} strokeOpacity={lo} strokeWidth="0.7" fill="none" />
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`dwh2${i}`} x1={603} y1={45 + i * 14} x2={619} y2={50 + i * 14} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" />
        ))}

        {/* Door frame */}
        <rect x={402} y={42} width={8} height={103} stroke={a} strokeOpacity={0.14} strokeWidth="0.6" fill={a} fillOpacity={0.03} />
        <rect x={592} y={42} width={8} height={103} stroke={a} strokeOpacity={0.14} strokeWidth="0.6" fill={a} fillOpacity={0.03} />
        {/* Door head frame */}
        <rect x={402} y={38} width={198} height={8} stroke={a} strokeOpacity={0.14} strokeWidth="0.6" fill={a} fillOpacity={0.03} />

        {/* Door panel */}
        <rect x={415} y={50} width={172} height={95} stroke={w} strokeOpacity={0.08} strokeWidth="0.6" fill="none" />
        {/* Door panels decorative */}
        <rect x={425} y={55} width={70} height={35} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" fill="none" />
        <rect x={505} y={55} width={70} height={35} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" fill="none" />
        <rect x={425} y={100} width={70} height={35} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" fill="none" />
        <rect x={505} y={100} width={70} height={35} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" fill="none" />

        {/* Door handle */}
        <circle cx={575} cy={100} r="3" stroke={a} strokeOpacity={0.12} strokeWidth="0.5" fill="none" />
        <line x1={575} y1={93} x2={575} y2={107} stroke={a} strokeOpacity={0.10} strokeWidth="0.4" />

        {/* Threshold detail */}
        <rect x={402} y={143} width={198} height={4} stroke={a} strokeOpacity={0.12} strokeWidth="0.5" fill={a} fillOpacity={0.03} />

        {/* Dimensions */}
        <DimLine x1={402} y1={170} x2={600} y2={170} label="90cm" o={lo} idx={5} />
        <DimLine x1={640} y1={42} x2={640} y2={145} label="210cm" o={lo} idx={6} />

        {/* Swing arc */}
        <motion.path d="M410 145 A185 185 0 0 0 410 50" stroke={w} strokeOpacity={0.05} strokeWidth="0.4" fill="none" strokeDasharray="4 3" variants={drawLine} custom={7} />

        <text x={515} y={175} fill={w} fillOpacity={0.08} fontSize="5" textAnchor="middle" fontFamily="monospace">1:10</text>

        {/* ==== DETAIL 3: Roof Junction ==== */}
        <motion.rect x={700} y={10} width={320} height={165} stroke={w} strokeOpacity={lo} strokeWidth="0.7" fill="none" variants={drawLine} custom={8} />
        <text x={860} y={25} fill={a} fillOpacity={0.15} fontSize="7" textAnchor="middle" fontFamily="monospace">DETAIL 3 - ROOF JUNCTION</text>
        <line x1={700} y1={30} x2={1020} y2={30} stroke={w} strokeOpacity={0.08} strokeWidth="0.4" />

        {/* Wall top */}
        <rect x={730} y={70} width={22} height={100} stroke={w} strokeOpacity={lo} strokeWidth="0.7" fill="none" />
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`rwh${i}`} x1={733} y1={75 + i * 13} x2={749} y2={80 + i * 13} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" />
        ))}

        {/* Roof slab */}
        <motion.path d="M720 70 L1000 55 L1000 65 L720 80 Z" stroke={w} strokeOpacity={lo} strokeWidth="0.7" fill="none" variants={drawLine} custom={9} />

        {/* Insulation layer */}
        <motion.path d="M720 80 L1000 65 L1000 75 L720 90 Z" stroke={w} strokeOpacity={0.07} strokeWidth="0.5" fill="none" variants={drawLine} custom={9.5} />
        {/* Insulation zigzag fill */}
        <path d={`M725 85 ${Array.from({ length: 27 }).map((_, i) => `L${730 + i * 10} ${i % 2 === 0 ? 82 : 88 - i * 0.2}`).join(' ')}`} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" fill="none" />

        {/* Waterproof membrane */}
        <motion.path d="M718 90 L1000 74" stroke={a} strokeOpacity={0.10} strokeWidth="0.8" variants={drawLine} custom={10} />
        <text x={870} y={72} fill={a} fillOpacity={0.10} fontSize="5" fontFamily="monospace">MEMBRANE ETANCHE</text>

        {/* Parapet */}
        <rect x={720} y={45} width={25} height={25} stroke={w} strokeOpacity={lo} strokeWidth="0.6" fill="none" />
        {/* Coping stone */}
        <rect x={715} y={40} width={35} height={6} stroke={w} strokeOpacity={lo} strokeWidth="0.5" fill="none" />
        {/* Drip edge */}
        <path d="M715 46 L712 50" stroke={w} strokeOpacity={0.08} strokeWidth="0.4" />
        <path d="M750 46 L753 50" stroke={w} strokeOpacity={0.08} strokeWidth="0.4" />

        {/* Flashing */}
        <motion.path d="M745 45 L752 60 L752 80" stroke={a} strokeOpacity={0.12} strokeWidth="0.6" fill="none" variants={drawLine} custom={11} />
        <text x={770} y={65} fill={a} fillOpacity={0.10} fontSize="5" fontFamily="monospace">SOLIN</text>

        {/* Gutter */}
        <path d="M715 90 L708 92 L708 100 L720 100 L720 90" stroke={w} strokeOpacity={lo} strokeWidth="0.5" fill="none" />
        <text x={695} y={110} fill={w} fillOpacity={0.08} fontSize="5" textAnchor="middle" fontFamily="monospace">GOUTTIERE</text>

        {/* Rafter / structure */}
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={`raft${i}`} x1={760 + i * 50} y1={57 - i * 3} x2={760 + i * 50} y2={77 - i * 3} stroke={a} strokeOpacity={0.08} strokeWidth="0.5" />
        ))}

        {/* Ceiling finish below */}
        <motion.path d="M752 80 L1000 66 L1000 70 L752 84 Z" stroke={w} strokeOpacity={0.06} strokeWidth="0.4" fill="none" variants={drawLine} custom={12} />

        {/* Interior plaster */}
        <rect x={752} y={80} width={3} height={90} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" fill="none" />

        {/* Dimension */}
        <DimLine x1={730} y1={45} x2={730} y2={170} label="50cm" o={lo} idx={13} />

        <text x={860} y={175} fill={w} fillOpacity={0.08} fontSize="5" textAnchor="middle" fontFamily="monospace">1:5</text>

        {/* ==== DETAIL 4: Foundation Detail ==== */}
        <motion.rect x={1045} y={10} width={330} height={165} stroke={w} strokeOpacity={lo} strokeWidth="0.7" fill="none" variants={drawLine} custom={14} />
        <text x={1210} y={25} fill={a} fillOpacity={0.15} fontSize="7" textAnchor="middle" fontFamily="monospace">DETAIL 4 - FOUNDATION</text>
        <line x1={1045} y1={30} x2={1375} y2={30} stroke={w} strokeOpacity={0.08} strokeWidth="0.4" />

        {/* Ground level line */}
        <motion.line x1={1060} y1={100} x2={1360} y2={100} stroke={w} strokeOpacity={lo} strokeWidth="0.8" variants={drawLine} custom={15} />
        {/* Ground hatching */}
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`fgh${i}`} x1={1070 + i * 30} y1={100} x2={1060 + i * 30} y2={110} stroke={w} strokeOpacity={0.06} strokeWidth="0.4" />
        ))}

        {/* Foundation wall */}
        <rect x={1150} y={45} width={25} height={120} stroke={w} strokeOpacity={lo} strokeWidth="0.7" fill="none" />
        {/* Wall hatching */}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`fwh${i}`} x1={1153} y1={50 + i * 14} x2={1172} y2={55 + i * 14} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" />
        ))}

        {/* Foundation footing */}
        <rect x={1120} y={150} width={100} height={20} stroke={w} strokeOpacity={lo} strokeWidth="0.8" fill="none" />
        {/* Footing hatching (concrete) */}
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={`fth${i}`} x1={1125 + i * 16} y1={153} x2={1130 + i * 16} y2={167} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" />
        ))}

        {/* Rebar dots */}
        {[1130, 1145, 1190, 1205].map((x, i) => (
          <g key={`rb${i}`}>
            <circle cx={x} cy={157} r="2" stroke={a} strokeOpacity={0.12} strokeWidth="0.5" fill="none" />
            <circle cx={x} cy={157} r="0.5" fill={a} fillOpacity={0.12} />
          </g>
        ))}
        <text x={1240} y={160} fill={a} fillOpacity={0.10} fontSize="5" fontFamily="monospace">4xFe12</text>

        {/* Waterproof membrane on wall */}
        <motion.line x1={1148} y1={50} x2={1148} y2={150} stroke={a} strokeOpacity={0.10} strokeWidth="0.8" variants={drawLine} custom={16} />
        <text x={1130} y={80} fill={a} fillOpacity={0.10} fontSize="5" textAnchor="end" fontFamily="monospace" transform="rotate(-90 1130 80)">ETANCHEITE</text>

        {/* Drainage layer */}
        <rect x={1140} y={100} width={10} height={50} stroke={w} strokeOpacity={0.07} strokeWidth="0.4" fill="none" />
        {/* Drainage gravel dots */}
        {Array.from({ length: 8 }).map((_, i) => (
          <circle key={`dr${i}`} cx={1145} cy={105 + i * 6} r="1.5" stroke={w} strokeOpacity={0.05} strokeWidth="0.3" fill="none" />
        ))}

        {/* Drain pipe */}
        <circle cx={1135} cy={148} r="5" stroke={w} strokeOpacity={lo} strokeWidth="0.5" fill="none" />
        <circle cx={1135} cy={148} r="3" stroke={w} strokeOpacity={0.06} strokeWidth="0.3" fill="none" />
        <text x={1110} y={148} fill={w} fillOpacity={0.08} fontSize="5" textAnchor="end" fontFamily="monospace">DRAIN</text>

        {/* Floor slab */}
        <rect x={1175} y={90} width={180} height={10} stroke={w} strokeOpacity={lo} strokeWidth="0.6" fill="none" />
        {/* Insulation under slab */}
        <rect x={1175} y={100} width={180} height={8} stroke={w} strokeOpacity={0.06} strokeWidth="0.4" fill="none" />
        <path d={`M1180 104 ${Array.from({ length: 17 }).map((_, i) => `L${1185 + i * 10} ${i % 2 === 0 ? 102 : 106}`).join(' ')}`} stroke={w} strokeOpacity={0.05} strokeWidth="0.3" fill="none" />

        {/* Gravel bed */}
        <rect x={1175} y={108} width={180} height={12} stroke={w} strokeOpacity={0.06} strokeWidth="0.4" fill="none" />
        {Array.from({ length: 12 }).map((_, i) => (
          <circle key={`gv${i}`} cx={1185 + i * 14} cy={114} r="2" stroke={w} strokeOpacity={0.04} strokeWidth="0.3" fill="none" />
        ))}

        {/* DPC (damp proof course) */}
        <motion.line x1={1150} y1={98} x2={1355} y2={98} stroke={a} strokeOpacity={0.10} strokeWidth="0.6" strokeDasharray="3 2" variants={drawLine} custom={17} />
        <text x={1290} y={88} fill={a} fillOpacity={0.10} fontSize="5" fontFamily="monospace">DPC</text>

        {/* Dimensions */}
        <DimLine x1={1100} y1={90} x2={1100} y2={170} label="80cm" o={lo} idx={18} />
        <DimLine x1={1120} y1={175} x2={1220} y2={175} label="100cm" o={lo} idx={19} />

        {/* Finish grade arrow */}
        <polygon points="1080,100 1075,105 1085,105" fill={w} fillOpacity={0.08} />
        <text x={1070} y={98} fill={w} fillOpacity={0.08} fontSize="5" textAnchor="end" fontFamily="monospace">NTN</text>

        <text x={1210} y={175} fill={w} fillOpacity={0.08} fontSize="5" textAnchor="middle" fontFamily="monospace">1:10</text>

        {/* ==== Connecting detail numbers in circles ==== */}
        {[{ x: 180, n: "1" }, { x: 515, n: "2" }, { x: 860, n: "3" }, { x: 1210, n: "4" }].map((d) => (
          <g key={d.n}>
            <circle cx={d.x} cy={192} r="6" stroke={w} strokeOpacity={0.10} strokeWidth="0.5" fill="none" />
            <text x={d.x} y={195} fill={w} fillOpacity={0.10} fontSize="6" textAnchor="middle" fontFamily="monospace">{d.n}</text>
          </g>
        ))}
      </motion.svg>
      </div>
    </motion.div>
  );
}
