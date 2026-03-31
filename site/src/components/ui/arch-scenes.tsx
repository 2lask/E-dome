"use client";
import { motion } from "framer-motion";

const D = { duration: 2.5, ease: [0.25, 0.46, 0.45, 0.94] as const };
const s = "#C4956A";

function L({ d, delay = 0 }: { d: string; delay?: number }) {
  return <motion.path d={d} fill="none" stroke={s} strokeWidth="0.8" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay }} />;
}
function R({ x, y, w, h, delay = 0 }: { x: number; y: number; w: number; h: number; delay?: number }) {
  return <motion.rect x={x} y={y} width={w} height={h} fill="none" stroke={s} strokeWidth="0.8" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay }} />;
}
function Li({ x1, y1, x2, y2, delay = 0, dash = false }: { x1: number; y1: number; x2: number; y2: number; delay?: number; dash?: boolean }) {
  return <motion.line x1={x1} y1={y1} x2={x2} y2={y2} fill="none" stroke={s} strokeWidth="0.8" strokeDasharray={dash ? "4 3" : undefined} initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay }} />;
}

export function ModernTower({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 500 800" className={`pointer-events-none ${className}`}>
      {/* Main building body */}
      <R x={150} y={60} w={200} h={680} delay={0} />
      {/* Glass curtain wall - vertical mullions */}
      {[190, 230, 270, 310].map((x, i) => <Li key={`v${i}`} x1={x} y1={60} x2={x} y2={740} delay={0.2 + i * 0.05} />)}
      {/* Floor slabs - 16 floors */}
      {Array.from({ length: 16 }, (_, i) => <Li key={`fl${i}`} x1={150} y1={100 + i * 42} x2={350} y2={100 + i * 42} delay={0.15 + i * 0.04} />)}
      {/* Windows per floor - pairs between mullions */}
      {Array.from({ length: 16 }, (_, i) => [160, 200, 240, 280, 320].map((x, j) => (
        <R key={`w${i}-${j}`} x={x + 3} y={105 + i * 42} w={24} h={32} delay={0.4 + (i + j) * 0.015} />
      )))}
      {/* Roof structure - mechanical room */}
      <R x={180} y={25} w={140} h={35} delay={0.3} />
      <R x={220} y={10} w={60} h={15} delay={0.35} />
      {/* Antenna */}
      <Li x1={250} y1={0} x2={250} y2={10} delay={0.4} />
      {/* Entrance canopy */}
      <L d="M 130 740 L 150 720 L 350 720 L 370 740" delay={0.5} />
      {/* Entrance doors - revolving */}
      <R x={210} y={720} w={80} h={20} delay={0.55} />
      <Li x1={250} y1={720} x2={250} y2={740} delay={0.6} />
      {/* Ground level detail */}
      <Li x1={100} y1={740} x2={400} y2={740} delay={0.2} />
      {/* Steps */}
      <Li x1={200} y1={745} x2={300} y2={745} delay={0.65} />
      <Li x1={195} y1={750} x2={305} y2={750} delay={0.7} />
      {/* Balcony projections every 4 floors */}
      {[268, 436, 604].map((y, i) => (
        <L key={`b${i}`} d={`M 145 ${y} L 140 ${y} L 140 ${y + 5} L 145 ${y + 5}`} delay={0.6 + i * 0.05} />
      ))}
      {[268, 436, 604].map((y, i) => (
        <L key={`br${i}`} d={`M 355 ${y} L 360 ${y} L 360 ${y + 5} L 355 ${y + 5}`} delay={0.6 + i * 0.05} />
      ))}
      {/* Dimension line */}
      <Li x1={130} y1={60} x2={130} y2={740} delay={0.8} dash />
      <Li x1={125} y1={60} x2={135} y2={60} delay={0.8} />
      <Li x1={125} y1={740} x2={135} y2={740} delay={0.8} />
      {/* Trees at base */}
      <motion.ellipse cx={110} cy={720} rx={20} ry={30} fill="none" stroke={s} strokeWidth="0.6" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.9 }} />
      <Li x1={110} y1={740} x2={110} y2={750} delay={0.85} />
      <motion.ellipse cx={390} cy={720} rx={20} ry={30} fill="none" stroke={s} strokeWidth="0.6" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.95 }} />
      <Li x1={390} y1={740} x2={390} y2={750} delay={0.9} />
    </svg>
  );
}

export function LuxuryVilla({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1000 500" className={`pointer-events-none ${className}`}>
      {/* Main house body */}
      <R x={200} y={180} w={600} h={250} delay={0} />
      {/* Pitched roof with ridge */}
      <L d="M 180 180 L 500 60 L 820 180" delay={0.15} />
      <L d="M 500 60 L 500 180" delay={0.2} />
      {/* Roof tiles suggestion */}
      {Array.from({ length: 8 }, (_, i) => {
        const y = 100 + i * 12;
        const xL = 500 - (180 - y) * 1.78;
        const xR = 500 + (180 - y) * 1.78;
        return y < 180 ? <Li key={`rt${i}`} x1={xL} y1={y} x2={xR} y2={y} delay={0.25 + i * 0.02} /> : null;
      })}
      {/* Large front windows - floor to ceiling */}
      {[240, 360, 560, 680].map((x, i) => (
        <g key={`fw${i}`}>
          <R x={x} y={210} w={60} h={120} delay={0.3 + i * 0.08} />
          {/* Window mullion */}
          <Li x1={x + 30} y1={210} x2={x + 30} y2={330} delay={0.35 + i * 0.08} />
          <Li x1={x} y1={270} x2={x + 60} y2={270} delay={0.38 + i * 0.08} />
        </g>
      ))}
      {/* Grand entrance - arched door */}
      <L d="M 465 330 L 465 230 A 35 35 0 0 1 535 230 L 535 330" delay={0.4} />
      <Li x1={500} y1={230} x2={500} y2={330} delay={0.45} />
      {/* Steps to entrance */}
      <R x={450} y={430} w={100} h={8} delay={0.5} />
      <R x={445} y={438} w={110} h={8} delay={0.52} />
      <R x={440} y={446} w={120} h={8} delay={0.54} />
      {/* Balcony above entrance */}
      <R x={440} y={200} w={120} h={10} delay={0.35} />
      {/* Balcony railing */}
      {[450, 470, 490, 510, 530, 550].map((x, i) => <Li key={`br${i}`} x1={x} y1={190} x2={x} y2={200} delay={0.4 + i * 0.02} />)}
      <Li x1={445} y1={190} x2={555} y2={190} delay={0.38} />
      {/* Chimney */}
      <R x={320} y={90} w={30} h={60} delay={0.45} />
      <R x={315} y={85} w={40} h={8} delay={0.48} />
      {/* Garage wing - right side */}
      <R x={800} y={280} w={120} h={150} delay={0.5} />
      <L d="M 790 280 L 860 240 L 930 280" delay={0.52} />
      {/* Garage door */}
      <R x={820} y={340} w={80} h={70} delay={0.55} />
      {/* Garage door panels */}
      <Li x1={820} y1={365} x2={900} y2={365} delay={0.58} />
      <Li x1={820} y1={385} x2={900} y2={385} delay={0.6} />
      {/* Swimming pool */}
      <R x={100} y={380} w={180} h={80} delay={0.65} />
      {/* Pool water lines */}
      {[395, 410, 425, 440].map((y, i) => <Li key={`pw${i}`} x1={110} y1={y} x2={270} y2={y} delay={0.7 + i * 0.03} />)}
      {/* Pool stairs */}
      <Li x1={100} y1={380} x2={120} y2={460} delay={0.72} />
      {/* Terrace/patio */}
      <R x={200} y={430} w={200} h={30} delay={0.6} />
      {/* Outdoor furniture */}
      <R x={220} y={435} w={40} h={15} delay={0.75} />
      <R x={280} y={435} w={40} h={15} delay={0.78} />
      {/* Garden trees - varied */}
      {[60, 140, 950].map((x, i) => (
        <g key={`tree${i}`}>
          <Li x1={x} y1={460} x2={x} y2={380} delay={0.8 + i * 0.05} />
          <motion.ellipse cx={x} cy={360} rx={25} ry={35} fill="none" stroke={s} strokeWidth="0.6" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.85 + i * 0.05 }} />
        </g>
      ))}
      {/* Bushes */}
      {[170, 850, 890].map((x, i) => (
        <motion.ellipse key={`bush${i}`} cx={x} cy={450} rx={15} ry={10} fill="none" stroke={s} strokeWidth="0.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.9 + i * 0.03 }} />
      ))}
      {/* Ground line */}
      <Li x1={30} y1={460} x2={970} y2={460} delay={0.15} />
      {/* Garden path - curved */}
      <L d="M 500 455 Q 480 470 460 480 Q 430 490 400 480" delay={0.75} />
      {/* Fence */}
      <Li x1={30} y1={455} x2={100} y2={455} delay={0.6} />
      {[40, 55, 70, 85].map((x, i) => <Li key={`f${i}`} x1={x} y1={450} x2={x} y2={460} delay={0.65 + i * 0.02} />)}
    </svg>
  );
}

export function FloorPlan({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 700 550" className={`pointer-events-none ${className}`}>
      {/* Outer walls - thick */}
      <motion.rect x={50} y={50} width={600} height={450} fill="none" stroke={s} strokeWidth="2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D }} />
      {/* Interior walls */}
      <motion.line x1={300} y1={50} x2={300} y2={320} fill="none" stroke={s} strokeWidth="1.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.3 }} />
      <motion.line x1={50} y1={300} x2={300} y2={300} fill="none" stroke={s} strokeWidth="1.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.35 }} />
      <motion.line x1={300} y1={320} x2={650} y2={320} fill="none" stroke={s} strokeWidth="1.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.4 }} />
      <motion.line x1={480} y1={320} x2={480} y2={500} fill="none" stroke={s} strokeWidth="1.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.45 }} />
      <motion.line x1={300} y1={180} x2={480} y2={180} fill="none" stroke={s} strokeWidth="1" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.5 }} />
      {/* Door openings with swing arcs */}
      <L d="M 300 230 A 40 40 0 0 0 260 270" delay={0.55} />
      <L d="M 350 320 A 40 40 0 0 1 390 280" delay={0.6} />
      <L d="M 480 380 A 35 35 0 0 0 445 415" delay={0.65} />
      <L d="M 300 130 A 35 35 0 0 1 335 165" delay={0.7} />
      {/* Windows - double lines on exterior walls */}
      {/* Top wall windows */}
      <R x={120} y={48} w={80} h={4} delay={0.5} />
      <R x={400} y={48} w={100} h={4} delay={0.52} />
      <R x={560} y={48} w={60} h={4} delay={0.54} />
      {/* Bottom wall windows */}
      <R x={100} y={498} w={80} h={4} delay={0.56} />
      <R x={500} y={498} w={80} h={4} delay={0.58} />
      {/* Left wall window */}
      <R x={48} y={150} w={4} h={80} delay={0.6} />
      <R x={48} y={380} w={4} h={60} delay={0.62} />
      {/* Right wall window */}
      <R x={648} y={100} w={4} h={100} delay={0.64} />
      <R x={648} y={380} w={4} h={80} delay={0.66} />
      {/* Kitchen fixtures */}
      <R x={70} y={320} w={80} h={20} delay={0.7} />
      <motion.circle cx={90} cy={380} r={15} fill="none" stroke={s} strokeWidth="0.6" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.72 }} />
      {/* Bathroom fixtures */}
      <R x={500} y={340} w={50} h={30} delay={0.74} />
      <motion.ellipse cx={520} cy={440} rx={20} ry={12} fill="none" stroke={s} strokeWidth="0.6" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.76 }} />
      <R x={560} y={420} w={30} h={30} delay={0.78} />
      {/* Staircase */}
      {Array.from({ length: 8 }, (_, i) => <Li key={`st${i}`} x1={560} y1={60 + i * 15} x2={640} y2={60 + i * 15} delay={0.7 + i * 0.02} />)}
      <Li x1={600} y1={60} x2={600} y2={180} delay={0.72} />
      {/* Room labels */}
      {[
        { x: 150, y: 170, t: "SALON" }, { x: 150, y: 410, t: "CUISINE" },
        { x: 400, y: 120, t: "CH. 1" }, { x: 400, y: 260, t: "CH. 2" },
        { x: 360, y: 420, t: "BUREAU" }, { x: 550, y: 420, t: "SDB" },
        { x: 590, y: 120, t: "ESCALIER" },
      ].map((r, i) => (
        <motion.text key={i} x={r.x} y={r.y} fontSize="11" fill={s} fillOpacity="0.5" stroke="none" textAnchor="middle"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.2 + i * 0.08 }}>
          {r.t}
        </motion.text>
      ))}
      {/* Room areas */}
      {[
        { x: 150, y: 185, t: "42 m\u00b2" }, { x: 150, y: 425, t: "18 m\u00b2" },
        { x: 400, y: 135, t: "16 m\u00b2" }, { x: 400, y: 275, t: "14 m\u00b2" },
      ].map((r, i) => (
        <motion.text key={`a${i}`} x={r.x} y={r.y} fontSize="8" fill={s} fillOpacity="0.3" stroke="none" textAnchor="middle"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.5 + i * 0.05 }}>
          {r.t}
        </motion.text>
      ))}
      {/* Dimension lines */}
      <Li x1={50} y1={520} x2={650} y2={520} delay={0.85} dash />
      <Li x1={50} y1={515} x2={50} y2={525} delay={0.85} />
      <Li x1={650} y1={515} x2={650} y2={525} delay={0.85} />
      <motion.text x={350} y={535} fontSize="9" fill={s} fillOpacity="0.4" stroke="none" textAnchor="middle"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.6 }}>24.00 m</motion.text>
      <Li x1={30} y1={50} x2={30} y2={500} delay={0.88} dash />
      <Li x1={25} y1={50} x2={35} y2={50} delay={0.88} />
      <Li x1={25} y1={500} x2={35} y2={500} delay={0.88} />
      <motion.text x={20} y={280} fontSize="9" fill={s} fillOpacity="0.4" stroke="none" textAnchor="middle" transform="rotate(-90, 20, 280)"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.7 }}>18.00 m</motion.text>
      {/* North arrow */}
      <L d="M 680 480 L 680 450" delay={1} />
      <L d="M 675 460 L 680 450 L 685 460" delay={1.02} />
      <motion.text x={680} y={495} fontSize="10" fill={s} fillOpacity="0.4" stroke="none" textAnchor="middle"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.5 }}>N</motion.text>
    </svg>
  );
}

export function CityBlock({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 450" className={`pointer-events-none ${className}`}>
      {/* Skyline of varied buildings */}
      {[
        { x: 30, w: 90, h: 180, floors: 5, hasRoof: true },
        { x: 130, w: 70, h: 300, floors: 9, hasRoof: false },
        { x: 210, w: 110, h: 240, floors: 7, hasRoof: true },
        { x: 330, w: 60, h: 370, floors: 11, hasRoof: false },
        { x: 400, w: 100, h: 200, floors: 6, hasRoof: true },
        { x: 510, w: 80, h: 320, floors: 10, hasRoof: false },
        { x: 600, w: 90, h: 260, floors: 8, hasRoof: true },
        { x: 700, w: 70, h: 350, floors: 10, hasRoof: false },
        { x: 780, w: 120, h: 220, floors: 6, hasRoof: true },
        { x: 910, w: 60, h: 290, floors: 9, hasRoof: false },
        { x: 980, w: 100, h: 250, floors: 7, hasRoof: true },
        { x: 1090, w: 80, h: 330, floors: 10, hasRoof: false },
      ].map((b, i) => (
        <g key={i}>
          <R x={b.x} y={420 - b.h} w={b.w} h={b.h} delay={i * 0.06} />
          {/* Roof */}
          {b.hasRoof && <L d={`M ${b.x} ${420 - b.h} L ${b.x + b.w / 2} ${420 - b.h - 25} L ${b.x + b.w} ${420 - b.h}`} delay={0.1 + i * 0.06} />}
          {/* Floor lines */}
          {Array.from({ length: b.floors }, (_, j) => (
            <Li key={`f${j}`} x1={b.x} y1={420 - (j + 1) * (b.h / (b.floors + 1))} x2={b.x + b.w} y2={420 - (j + 1) * (b.h / (b.floors + 1))} delay={0.15 + i * 0.04 + j * 0.015} />
          ))}
          {/* Windows - 2 per floor */}
          {Array.from({ length: Math.min(b.floors, 6) }, (_, j) => (
            <g key={`wg${j}`}>
              <R x={b.x + 8} y={420 - (j + 1) * (b.h / (b.floors + 1)) + 5} w={b.w / 2 - 14} h={b.h / (b.floors + 1) - 10} delay={0.3 + i * 0.03 + j * 0.01} />
              <R x={b.x + b.w / 2 + 6} y={420 - (j + 1) * (b.h / (b.floors + 1)) + 5} w={b.w / 2 - 14} h={b.h / (b.floors + 1) - 10} delay={0.32 + i * 0.03 + j * 0.01} />
            </g>
          ))}
        </g>
      ))}
      {/* Ground */}
      <motion.line x1={10} y1={420} x2={1190} y2={420} fill="none" stroke={s} strokeWidth="1.2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D }} />
      {/* Road markings */}
      <Li x1={10} y1={440} x2={1190} y2={440} delay={0.2} dash />
      {/* Trees between buildings */}
      {[125, 325, 505, 695, 905, 1085].map((x, i) => (
        <g key={`t${i}`}>
          <Li x1={x} y1={420} x2={x} y2={400} delay={0.8 + i * 0.04} />
          <motion.circle cx={x} cy={392} r={10} fill="none" stroke={s} strokeWidth="0.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.85 + i * 0.04 }} />
        </g>
      ))}
    </svg>
  );
}

export function IsometricHouse({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 500" className={`pointer-events-none ${className}`}>
      {/* Front face */}
      <L d="M 300 100 L 500 200 L 500 400 L 300 300 Z" delay={0} />
      {/* Left face */}
      <L d="M 300 100 L 100 200 L 100 400 L 300 300 Z" delay={0.15} />
      {/* Roof - front slope */}
      <L d="M 300 100 L 520 210 L 400 155" delay={0.25} />
      {/* Roof - left slope */}
      <L d="M 300 100 L 80 210 L 200 155" delay={0.3} />
      {/* Roof ridge */}
      <Li x1={300} y1={60} x2={300} y2={100} delay={0.2} />
      <L d="M 80 210 L 300 60 L 520 210" delay={0.35} />
      {/* Front windows - large */}
      <L d="M 340 220 L 460 275 L 460 350 L 340 295 Z" delay={0.4} />
      <Li x1={400} y1={247} x2={400} y2={322} delay={0.45} />
      {/* Left windows */}
      <L d="M 140 275 L 260 220 L 260 295 L 140 350 Z" delay={0.5} />
      <Li x1={200} y1={247} x2={200} y2={322} delay={0.55} />
      {/* Front door */}
      <L d="M 360 310 L 420 340 L 420 400 L 360 370 Z" delay={0.6} />
      {/* Garage (left side) */}
      <L d="M 110 310 L 200 270 L 200 370 L 110 400 Z" delay={0.65} />
      {/* Garage door lines */}
      <L d="M 110 340 L 200 300" delay={0.7} />
      <L d="M 110 365 L 200 325" delay={0.72} />
      {/* Terrace */}
      <L d="M 300 400 L 500 400 L 580 440 L 380 440 Z" delay={0.75} />
      {/* Terrace railing */}
      {[340, 380, 420, 460].map((x, i) => (
        <Li key={`tr${i}`} x1={x} y1={400 - (x - 300) * 0} x2={x + 40} y2={440 - (x - 300) * 0} delay={0.8 + i * 0.02} />
      ))}
      {/* Garden */}
      <motion.ellipse cx={80} cy={440} rx={30} ry={15} fill="none" stroke={s} strokeWidth="0.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.85 }} />
      <motion.ellipse cx={550} cy={460} rx={25} ry={12} fill="none" stroke={s} strokeWidth="0.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.9 }} />
      {/* Ground shadow */}
      <L d="M 100 400 L 300 300 L 500 400 L 300 480 Z" delay={0.3} />
    </svg>
  );
}

export function InteriorView({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 700 500" className={`pointer-events-none ${className}`}>
      {/* Room perspective - vanishing point at center */}
      {/* Back wall */}
      <R x={120} y={80} w={460} h={340} delay={0} />
      {/* Floor perspective */}
      <L d="M 0 500 L 120 420 L 580 420 L 700 500" delay={0.1} />
      {/* Ceiling perspective */}
      <L d="M 0 0 L 120 80 L 580 80 L 700 0" delay={0.15} />
      {/* Left wall */}
      <L d="M 0 0 L 0 500 L 120 420 L 120 80" delay={0.2} />
      {/* Right wall */}
      <L d="M 700 0 L 700 500 L 580 420 L 580 80" delay={0.25} />
      {/* Large window on back wall */}
      <R x={200} y={120} w={300} h={200} delay={0.3} />
      {/* Window mullions */}
      <Li x1={350} y1={120} x2={350} y2={320} delay={0.35} />
      <Li x1={275} y1={120} x2={275} y2={320} delay={0.37} />
      <Li x1={425} y1={120} x2={425} y2={320} delay={0.39} />
      <Li x1={200} y1={220} x2={500} y2={220} delay={0.4} />
      {/* Curtains */}
      <L d="M 190 110 Q 195 220 190 330" delay={0.42} />
      <L d="M 510 110 Q 505 220 510 330" delay={0.44} />
      {/* Sofa - perspective */}
      <L d="M 150 350 L 340 350 L 340 380 L 150 380 Z" delay={0.5} />
      <L d="M 150 340 L 340 340 L 340 355 Q 245 360 150 355 Z" delay={0.52} />
      {/* Sofa cushions */}
      <Li x1={200} y1={350} x2={200} y2={380} delay={0.54} />
      <Li x1={290} y1={350} x2={290} y2={380} delay={0.56} />
      {/* Coffee table */}
      <motion.ellipse cx={440} cy={380} rx={60} ry={25} fill="none" stroke={s} strokeWidth="0.7" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.6 }} />
      {/* Table legs */}
      <Li x1={400} y1={385} x2={395} y2={410} delay={0.62} />
      <Li x1={480} y1={385} x2={485} y2={410} delay={0.64} />
      {/* Lamp on side */}
      <Li x1={560} y1={300} x2={560} y2={250} delay={0.65} />
      <motion.ellipse cx={560} cy={245} rx={20} ry={10} fill="none" stroke={s} strokeWidth="0.6" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.67 }} />
      {/* Floor tiles perspective */}
      {[180, 280, 380, 480].map((x, i) => (
        <Li key={`ft${i}`} x1={x} y1={420} x2={x + (x < 350 ? -80 : 80)} y2={500} delay={0.5 + i * 0.03} />
      ))}
      {[430, 440, 450, 460, 470, 480].map((y, i) => (
        <Li key={`fth${i}`} x1={0} y1={y} x2={700} y2={y} delay={0.55 + i * 0.02} />
      ))}
      {/* Ceiling light */}
      <motion.circle cx={350} cy={80} r={30} fill="none" stroke={s} strokeWidth="0.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.7 }} />
      <Li x1={350} y1={80} x2={350} y2={110} delay={0.72} />
      {/* Picture frames on back wall */}
      <R x={150} y={140} w={30} h={40} delay={0.75} />
      <R x={530} y={130} w={35} h={50} delay={0.78} />
      {/* Plant in corner */}
      <Li x1={140} y1={420} x2={140} y2={370} delay={0.8} />
      <motion.ellipse cx={140} cy={360} rx={15} ry={20} fill="none" stroke={s} strokeWidth="0.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.82 }} />
      <motion.ellipse cx={130} cy={350} rx={12} ry={15} fill="none" stroke={s} strokeWidth="0.4" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ ...D, delay: 0.84 }} />
    </svg>
  );
}
