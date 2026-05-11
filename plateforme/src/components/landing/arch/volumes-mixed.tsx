"use client";
import { motion } from "framer-motion";

const enterDraw = (delay = 0, duration = 1.8) => ({
  initial: { strokeDashoffset: 1 },
  whileInView: { strokeDashoffset: 0 },
  viewport: { once: true, amount: 0.15 } as const,
  transition: { duration, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

// Fade-in helper for reference lines that need a fixed strokeDasharray
// pattern (e.g. dashed axes "4 3") and therefore can't animate via
// strokeDashoffset.
const enterFade = (delay = 0, duration = 1.2) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, amount: 0.15 } as const,
  transition: { duration, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

/* =====================================================================
 * Component 1: ArchAngularVolume
 * Deconstructivist / Zaha-Hadid style — wedge mass + cantilever + ramp
 * ===================================================================== */
export function ArchAngularVolume({ className }: { className?: string }) {
  const W = "rgba(255,255,255,0.55)"; // main
  const F = "rgba(255,255,255,0.28)"; // faint
  const A = "rgba(255,255,255,0.78)"; // accent
  const T = "rgba(255,255,255,0.45)"; // text

  // Pre-compute mullion x positions on sloped façade
  // façade goes from (60,260) on bottom to (260,80) at top — a sloped line
  // We sample 12 mullions evenly along the slope.
  const slopedMullions: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i < 13; i++) {
    const t = i / 12;
    const xTop = 80 + t * (255 - 80);
    const yTop = 260 - t * (260 - 90);
    const xBot = 80 + t * (255 - 80);
    const yBot = 260;
    slopedMullions.push({ x1: xTop, y1: yTop, x2: xBot, y2: yBot });
  }

  // Glass box floors (4 floors) inside cantilever box (240..395, 130..230)
  const floorYs = [148, 173, 198, 223];

  // Cantilever vertical mullions
  const cantMull: number[] = [];
  for (let x = 250; x <= 388; x += 12) cantMull.push(x);

  // Pilotis under primary mass (between x=80 and x=255 at y=260..305)
  const pilotis: number[] = [85, 115, 145, 175, 205, 235, 250];

  // Spiral ramp: parallel arcs around (140, 320), decreasing radii
  const spiralArcs: { r: number; opa: number }[] = [
    { r: 60, opa: 0.55 },
    { r: 52, opa: 0.5 },
    { r: 44, opa: 0.45 },
    { r: 36, opa: 0.4 },
    { r: 28, opa: 0.35 },
    { r: 20, opa: 0.3 },
  ];

  return (
    <svg
      className={className}
      viewBox="0 0 400 360"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      style={{ overflow: "visible" }}
    >
      <motion.g
        animate={{ rotate: [-0.7, 0.7, -0.7] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "200px 180px" }}
      >
        {/* ============ 10x10 construction grid (very faint) ============ */}
        <g opacity={0.35}>
          {Array.from({ length: 11 }).map((_, i) => (
            <motion.path
              key={`gv-${i}`}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(0.02 * i, 1.0)}
              stroke="rgba(255,255,255,0.10)"
              strokeWidth={0.4}
              d={`M ${i * 40} 0 L ${i * 40} 360`}
            />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.path
              key={`gh-${i}`}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(0.02 * i + 0.1, 1.0)}
              stroke="rgba(255,255,255,0.10)"
              strokeWidth={0.4}
              d={`M 0 ${i * 36} L 400 ${i * 36}`}
            />
          ))}
        </g>

        {/* ============ Center axis crosshair ============ */}
        <motion.path {...enterFade(0.1, 1.2)}
          stroke={F} strokeWidth={0.5} strokeDasharray="4 3" d="M 0 180 L 400 180" />
        <motion.path {...enterFade(0.15, 1.2)}
          stroke={F} strokeWidth={0.5} strokeDasharray="4 3" d="M 200 0 L 200 360" />
        <circle cx={200} cy={180} r={2.5} stroke={A} strokeWidth={0.6} fill="none" />
        <circle cx={200} cy={180} r={0.8} fill={A} />

        {/* ============ Landscape line (extends past edges) ============ */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(0.2, 1.4)}
          stroke={W} strokeWidth={0.9} d="M -30 305 L 430 305" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(0.25, 1.4)}
          stroke={F} strokeWidth={0.4} d="M -30 308 L 430 308" />

        {/* ============ Foundation hatch under primary volume ============ */}
        <g opacity={0.6}>
          {Array.from({ length: 22 }).map((_, i) => (
            <motion.path
              key={`fh-${i}`}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(0.3 + i * 0.01, 0.9)}
              stroke={F}
              strokeWidth={0.35}
              d={`M ${60 + i * 9} 305 L ${52 + i * 9} 318`}
            />
          ))}
        </g>
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(0.3, 1.0)}
          stroke={W} strokeWidth={0.6} d="M 60 305 L 260 305" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(0.32, 1.0)}
          stroke={W} strokeWidth={0.6} d="M 60 320 L 260 320" />

        {/* ============ Trees (3) on landscape line ============ */}
        {/* Tree 1 — left exterior */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(0.4, 1.0)}
          stroke={W} strokeWidth={0.6} d="M 18 305 L 18 285" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(0.42, 1.0)}
          stroke={W} strokeWidth={0.6} d="M 12 285 L 18 270 L 24 285 Z" />
        {/* Tree 2 — between ramp and façade */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(0.44, 1.0)}
          stroke={W} strokeWidth={0.6} d="M 40 305 L 40 282" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(0.46, 1.0)}
          stroke={W} strokeWidth={0.6} d="M 33 282 L 40 263 L 47 282 Z" />
        {/* Tree 3 — far right past viewBox */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(0.48, 1.0)}
          stroke={W} strokeWidth={0.6} d="M 410 305 L 410 280" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(0.5, 1.0)}
          stroke={W} strokeWidth={0.6} d="M 402 280 L 410 260 L 418 280 Z" />

        {/* ============ Triangular primary mass (wedge) ============ */}
        {/* Outline */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(0.5, 1.6)}
          stroke={A} strokeWidth={1.0} d="M 60 305 L 60 260 L 80 260 L 255 90 L 255 260" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(0.55, 1.6)}
          stroke={A} strokeWidth={1.0} d="M 255 260 L 255 305" />
        {/* Roof ridge & extra outline */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(0.6, 1.4)}
          stroke={W} strokeWidth={0.7} d="M 80 260 L 60 260" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(0.62, 1.4)}
          stroke={W} strokeWidth={0.7} d="M 60 305 L 60 270" />
        {/* Roof underline (sloped façade top) */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(0.65, 1.4)}
          stroke={W} strokeWidth={0.7} d="M 80 260 L 255 95" />

        {/* Diagonal hatch on triangular volume (low opacity) */}
        <g opacity={0.2}>
          {Array.from({ length: 18 }).map((_, i) => {
            const offset = i * 14;
            return (
              <motion.path
                key={`hatchT-${i}`}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(0.7 + i * 0.012, 1.0)}
                stroke={W}
                strokeWidth={0.35}
                d={`M ${65 + offset} 260 L ${65 + offset - 50} 305`}
              />
            );
          })}
        </g>

        {/* ============ Sloped façade — 13 diagonal mullions ============ */}
        {slopedMullions.map((m, i) => (
          <motion.path
            key={`sm-${i}`}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(0.85 + i * 0.04, 1.2)}
            stroke={W}
            strokeWidth={0.5}
            d={`M ${m.x1} ${m.y1} L ${m.x2} ${m.y2}`}
          />
        ))}
        {/* Façade horizontal banding */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.0, 1.2)}
          stroke={F} strokeWidth={0.45} d="M 80 260 L 255 260" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.05, 1.2)}
          stroke={F} strokeWidth={0.45} d="M 95 245 L 255 245" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.08, 1.2)}
          stroke={F} strokeWidth={0.45} d="M 110 230 L 255 230" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.11, 1.2)}
          stroke={F} strokeWidth={0.45} d="M 125 215 L 255 215" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.14, 1.2)}
          stroke={F} strokeWidth={0.45} d="M 140 200 L 255 200" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.17, 1.2)}
          stroke={F} strokeWidth={0.45} d="M 155 185 L 255 185" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.2, 1.2)}
          stroke={F} strokeWidth={0.45} d="M 170 170 L 255 170" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.23, 1.2)}
          stroke={F} strokeWidth={0.45} d="M 185 155 L 255 155" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.26, 1.2)}
          stroke={F} strokeWidth={0.45} d="M 200 140 L 255 140" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.29, 1.2)}
          stroke={F} strokeWidth={0.45} d="M 215 125 L 255 125" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.32, 1.2)}
          stroke={F} strokeWidth={0.45} d="M 230 110 L 255 110" />

        {/* ============ Cantilevered glass box (right) — projects past viewBox ============ */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.3, 1.4)}
          stroke={A} strokeWidth={0.9} d="M 240 130 L 410 130 L 410 230 L 240 230 Z" />
        {/* Inner secondary outline */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.34, 1.2)}
          stroke={F} strokeWidth={0.4} d="M 244 134 L 406 134 L 406 226 L 244 226 Z" />
        {/* Floors */}
        {floorYs.map((y, i) => (
          <motion.path
            key={`fl-${i}`}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(1.4 + i * 0.05, 1.2)}
            stroke={W}
            strokeWidth={0.55}
            d={`M 240 ${y} L 410 ${y}`}
          />
        ))}
        {/* Vertical mullions inside cantilever */}
        {cantMull.map((x, i) => (
          <motion.path
            key={`cm-${i}`}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(1.5 + i * 0.02, 1.0)}
            stroke={F}
            strokeWidth={0.4}
            d={`M ${x} 130 L ${x} 230`}
          />
        ))}
        {/* Pulsing window — single highlighted pane */}
        <motion.rect
          x={310}
          y={148}
          width={12}
          height={25}
          fill={W}
          stroke={A}
          strokeWidth={0.4}
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Cantilever support bracket leader */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.6, 1.0)}
          stroke={F} strokeWidth={0.5} d="M 240 230 L 240 250 L 255 260" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.62, 1.0)}
          stroke={F} strokeWidth={0.5} d="M 248 230 L 248 245" />

        {/* ============ Pilotis under primary mass ============ */}
        {pilotis.map((x, i) => (
          <motion.path
            key={`pi-${i}`}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(1.7 + i * 0.03, 1.0)}
            stroke={A}
            strokeWidth={0.7}
            d={`M ${x} 260 L ${x} 305`}
          />
        ))}
        {/* Capital plates */}
        {pilotis.map((x, i) => (
          <motion.path
            key={`pic-${i}`}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(1.78 + i * 0.02, 0.8)}
            stroke={W}
            strokeWidth={0.5}
            d={`M ${x - 4} 258 L ${x + 4} 258`}
          />
        ))}

        {/* ============ Spiral ramp (concentric arcs) ============ */}
        {spiralArcs.map((s, i) => (
          <motion.path
            key={`sp-${i}`}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(2.0 + i * 0.08, 1.4)}
            stroke={`rgba(255,255,255,${s.opa})`}
            strokeWidth={0.55}
            d={`M ${140 - s.r} 320 A ${s.r} ${s.r * 0.4} 0 0 1 ${140 + s.r} 320`}
          />
        ))}
        {/* Ramp diameter / edge ticks */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 7) * Math.PI;
          const r = 60;
          const x1 = 140 + Math.cos(angle + Math.PI) * r;
          const y1 = 320 + Math.sin(angle + Math.PI) * r * 0.4;
          const x2 = 140 + Math.cos(angle + Math.PI) * (r + 4);
          const y2 = 320 + Math.sin(angle + Math.PI) * (r + 4) * 0.4;
          return (
            <motion.path
              key={`rt-${i}`}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(2.5 + i * 0.03, 0.8)}
              stroke={F}
              strokeWidth={0.4}
              d={`M ${x1} ${y1} L ${x2} ${y2}`}
            />
          );
        })}

        {/* ============ Top dimension callout ============ */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.7, 1.0)}
          stroke={W} strokeWidth={0.5} d="M 60 32 L 410 32" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.72, 1.0)}
          stroke={W} strokeWidth={0.5} d="M 60 28 L 60 36" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.74, 1.0)}
          stroke={W} strokeWidth={0.5} d="M 410 28 L 410 36" />
        {/* Arrows */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.76, 0.8)}
          stroke={W} strokeWidth={0.5} d="M 60 32 L 66 30 L 66 34 Z" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.78, 0.8)}
          stroke={W} strokeWidth={0.5} d="M 410 32 L 404 30 L 404 34 Z" />
        <text x={210} y={26} fontSize="7" fill={T} fontFamily="monospace">L = 24.50 m</text>
        {/* Sub-segment top */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.8, 0.9)}
          stroke={F} strokeWidth={0.4} d="M 60 48 L 255 48" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.82, 0.9)}
          stroke={F} strokeWidth={0.4} d="M 60 44 L 60 52" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.84, 0.9)}
          stroke={F} strokeWidth={0.4} d="M 255 44 L 255 52" />
        <text x={140} y={42} fontSize="5.5" fill={T} fontFamily="monospace">a1 = 19.50</text>
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.86, 0.9)}
          stroke={F} strokeWidth={0.4} d="M 255 48 L 410 48" />
        <text x={310} y={42} fontSize="5.5" fill={T} fontFamily="monospace">a2 = 5.00</text>

        {/* ============ Right dimension callout ============ */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.9, 1.0)}
          stroke={W} strokeWidth={0.5} d="M 425 90 L 425 305" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.92, 1.0)}
          stroke={W} strokeWidth={0.5} d="M 421 90 L 429 90" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.94, 1.0)}
          stroke={W} strokeWidth={0.5} d="M 421 305 L 429 305" />
        <text x={432} y={200} fontSize="6" fill={T} fontFamily="monospace" transform="rotate(90 432 200)">H = 18.40</text>
        {/* Sub-segment right (cantilever floor heights) */}
        {floorYs.map((y, i) => (
          <motion.path
            key={`rd-${i}`}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(3.0 + i * 0.04, 0.8)}
            stroke={F}
            strokeWidth={0.35}
            d={`M 412 ${y} L 418 ${y}`}
          />
        ))}

        {/* ============ Numbered call-outs 01 / 02 / 03 with leader lines ============ */}
        {/* 01 — wedge roof apex */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.1, 0.9)}
          stroke={W} strokeWidth={0.4} d="M 255 90 L 295 70" />
        <circle cx={297} cy={68} r={5} stroke={W} strokeWidth={0.5} fill="none" />
        <text x={293} y={71} fontSize="5.5" fill={T} fontFamily="monospace">01</text>
        {/* 02 — cantilever box */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.15, 0.9)}
          stroke={W} strokeWidth={0.4} d="M 360 130 L 360 100" />
        <circle cx={360} cy={97} r={5} stroke={W} strokeWidth={0.5} fill="none" />
        <text x={356} y={100} fontSize="5.5" fill={T} fontFamily="monospace">02</text>
        {/* 03 — spiral ramp */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.2, 0.9)}
          stroke={W} strokeWidth={0.4} d="M 80 320 L 50 340" />
        <circle cx={48} cy={342} r={5} stroke={W} strokeWidth={0.5} fill="none" />
        <text x={44} y={345} fontSize="5.5" fill={T} fontFamily="monospace">03</text>

        {/* ============ Section ref circle "A" ============ */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.25, 1.0)}
          stroke={A} strokeWidth={0.7} d="M 360 38 m -8 0 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.28, 0.6)}
          stroke={A} strokeWidth={0.6} d="M 352 38 L 368 38" />
        <text x={357} y={36} fontSize="6" fill={T} fontFamily="monospace">A</text>
        <text x={357} y={45} fontSize="4.5" fill={T} fontFamily="monospace">A1</text>

        {/* ============ Compass rose ============ */}
        <g transform="translate(45,55)">
          <circle cx={0} cy={0} r={14} stroke={F} strokeWidth={0.4} fill="none" />
          <circle cx={0} cy={0} r={10} stroke={F} strokeWidth={0.3} fill="none" />
          <motion.g
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "0px 0px" }}
          >
            <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.3, 0.8)}
              stroke={A} strokeWidth={0.8} d="M 0 -12 L -3 0 L 0 -3 L 3 0 Z" />
            <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.32, 0.8)}
              stroke={F} strokeWidth={0.5} d="M 0 12 L -2 0 L 0 3 L 2 0 Z" />
          </motion.g>
          <text x={-2.5} y={-15} fontSize="5" fill={T} fontFamily="monospace">N</text>
          <text x={-2} y={20} fontSize="4.5" fill={T} fontFamily="monospace">S</text>
          <text x={15} y={1.5} fontSize="4.5" fill={T} fontFamily="monospace">E</text>
          <text x={-19} y={1.5} fontSize="4.5" fill={T} fontFamily="monospace">W</text>
        </g>

        {/* ============ Thinking / draft construction lines (extending past form) ============ */}
        <motion.path {...enterFade(3.4, 1.4)}
          stroke={F} strokeWidth={0.3} strokeDasharray="2 2" d="M -20 90 L 295 90" />
        <motion.path {...enterFade(3.42, 1.4)}
          stroke={F} strokeWidth={0.3} strokeDasharray="2 2" d="M -20 130 L 295 130" />
        <motion.path {...enterFade(3.44, 1.4)}
          stroke={F} strokeWidth={0.3} strokeDasharray="2 2" d="M -20 230 L 415 230" />
        <motion.path {...enterFade(3.46, 1.4)}
          stroke={F} strokeWidth={0.3} strokeDasharray="2 2" d="M 60 -20 L 60 360" />
        <motion.path {...enterFade(3.48, 1.4)}
          stroke={F} strokeWidth={0.3} strokeDasharray="2 2" d="M 255 -20 L 255 360" />
        <motion.path {...enterFade(3.5, 1.4)}
          stroke={F} strokeWidth={0.3} strokeDasharray="2 2" d="M 410 -20 L 410 360" />

        {/* Diagonal "thinking" guides */}
        <motion.path {...enterFade(3.55, 1.4)}
          stroke={F} strokeWidth={0.3} strokeDasharray="3 3" d="M -20 360 L 420 -20" />
        <motion.path {...enterFade(3.57, 1.4)}
          stroke={F} strokeWidth={0.3} strokeDasharray="3 3" d="M -20 -20 L 420 360" />

        {/* Title block bottom-right */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.6, 0.8)}
          stroke={F} strokeWidth={0.4} d="M 285 340 L 395 340 L 395 355 L 285 355 Z" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.62, 0.6)}
          stroke={F} strokeWidth={0.4} d="M 285 348 L 395 348" />
        <text x={290} y={346} fontSize="5" fill={T} fontFamily="monospace">PROJECT 04 / VOL.A</text>
        <text x={290} y={353} fontSize="4.5" fill={T} fontFamily="monospace">SCALE 1:200</text>

        {/* Tiny tick marks along baseline */}
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.path
            key={`bt-${i}`}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(3.65 + i * 0.01, 0.6)}
            stroke={F}
            strokeWidth={0.3}
            d={`M ${i * 18} 312 L ${i * 18} 316`}
          />
        ))}

        {/* Small detail callout (window detail circle) */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.75, 0.8)}
          stroke={F} strokeWidth={0.4} d="M 316 160 m -7 0 a 7 7 0 1 0 14 0 a 7 7 0 1 0 -14 0" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.77, 0.6)}
          stroke={F} strokeWidth={0.3} d="M 323 160 L 345 145" />
        <text x={345} y={144} fontSize="5" fill={T} fontFamily="monospace">det.B</text>

        {/* Roof slope angle indicator */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.8, 0.8)}
          stroke={F} strokeWidth={0.4} d="M 80 260 A 25 25 0 0 1 105 250" />
        <text x={88} y={258} fontSize="5" fill={T} fontFamily="monospace">43 deg</text>

        {/* Cantilever projection arrow */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.85, 0.8)}
          stroke={F} strokeWidth={0.4} d="M 255 250 L 410 250" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.87, 0.6)}
          stroke={F} strokeWidth={0.4} d="M 255 247 L 255 253" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.89, 0.6)}
          stroke={F} strokeWidth={0.4} d="M 410 247 L 410 253" />
        <text x={310} y={247} fontSize="5" fill={T} fontFamily="monospace">cantil. 7.50</text>

        {/* Foundation depth indicator left */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.92, 0.8)}
          stroke={F} strokeWidth={0.4} d="M 50 305 L 50 320" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.94, 0.6)}
          stroke={F} strokeWidth={0.4} d="M 46 305 L 54 305" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.96, 0.6)}
          stroke={F} strokeWidth={0.4} d="M 46 320 L 54 320" />
        <text x={30} y={316} fontSize="4.5" fill={T} fontFamily="monospace">f.1.5</text>
      </motion.g>
    </svg>
  );
}

/* =====================================================================
 * Component 2: ArchSmallSlab
 * Modernist pavilion + roof terrace + deck + reflecting pond
 * ===================================================================== */
export function ArchSmallSlab({ className }: { className?: string }) {
  const W = "rgba(30,157,241,0.5)"; // main
  const F = "rgba(30,157,241,0.28)"; // faint
  const A = "rgba(30,157,241,0.78)"; // accent
  const T = "rgba(30,157,241,0.45)"; // text

  // 8 glass façade panels, x positions
  const panelXs: number[] = [];
  for (let i = 0; i <= 8; i++) panelXs.push(50 + i * 11);

  // Balusters on roof terrace (vertical), x positions
  const balusters: number[] = [];
  for (let i = 0; i <= 12; i++) balusters.push(46 + i * 8);

  // Deck planks along right side (around pool)
  const deckPlanks: number[] = [];
  for (let i = 0; i < 18; i++) deckPlanks.push(165 + i * 4.2);

  // Pool ripples
  const poolRipples = [
    { y: 132, dur: 4.0, delay: 0 },
    { y: 138, dur: 4.5, delay: 0.4 },
    { y: 144, dur: 4.2, delay: 0.8 },
    { y: 150, dur: 4.6, delay: 0.2 },
    { y: 156, dur: 4.3, delay: 0.6 },
    { y: 162, dur: 4.7, delay: 1.0 },
  ];

  // Roof rafters
  const rafters: number[] = [];
  for (let x = 50; x <= 145; x += 9) rafters.push(x);

  return (
    <svg
      className={className}
      viewBox="0 0 300 220"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      style={{ overflow: "visible" }}
    >
      <motion.g
        animate={{ x: [0, 5, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* ============ Construction grid ============ */}
        <g opacity={0.4}>
          {Array.from({ length: 11 }).map((_, i) => (
            <motion.path
              key={`gv2-${i}`}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(0.02 * i, 1.0)}
              stroke="rgba(30,157,241,0.10)"
              strokeWidth={0.35}
              d={`M ${i * 30} 0 L ${i * 30} 220`}
            />
          ))}
          {Array.from({ length: 9 }).map((_, i) => (
            <motion.path
              key={`gh2-${i}`}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(0.02 * i + 0.1, 1.0)}
              stroke="rgba(30,157,241,0.10)"
              strokeWidth={0.35}
              d={`M 0 ${i * 27.5} L 300 ${i * 27.5}`}
            />
          ))}
        </g>

        {/* Center axis */}
        <motion.path {...enterFade(0.1, 1.0)}
          stroke={F} strokeWidth={0.4} strokeDasharray="3 2" d="M 0 110 L 300 110" />
        <motion.path {...enterFade(0.12, 1.0)}
          stroke={F} strokeWidth={0.4} strokeDasharray="3 2" d="M 150 0 L 150 220" />

        {/* ============ Ground line (extends past edges) ============ */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(0.15, 1.4)}
          stroke={W} strokeWidth={0.8} d="M -25 168 L 325 168" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(0.18, 1.4)}
          stroke={F} strokeWidth={0.35} d="M -25 171 L 325 171" />

        {/* ============ Foundation hatch under building ============ */}
        <g opacity={0.65}>
          {Array.from({ length: 18 }).map((_, i) => (
            <motion.path
              key={`fh2-${i}`}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(0.22 + i * 0.01, 0.8)}
              stroke={F}
              strokeWidth={0.3}
              d={`M ${42 + i * 6} 168 L ${36 + i * 6} 178`}
            />
          ))}
        </g>
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(0.24, 1.0)}
          stroke={W} strokeWidth={0.55} d="M 42 168 L 152 168" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(0.26, 1.0)}
          stroke={W} strokeWidth={0.55} d="M 42 180 L 152 180" />

        {/* ============ Pavilion structure ============ */}
        {/* Main 1-story rectangle */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(0.4, 1.4)}
          stroke={A} strokeWidth={0.9} d="M 50 168 L 50 110 L 145 110 L 145 168" />
        {/* Inner secondary line */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(0.45, 1.2)}
          stroke={F} strokeWidth={0.35} d="M 53 168 L 53 113 L 142 113 L 142 168" />
        {/* Roof slab + deep canopy overhang both sides */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(0.5, 1.2)}
          stroke={A} strokeWidth={0.9} d="M 30 110 L 165 110" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(0.52, 1.2)}
          stroke={A} strokeWidth={0.9} d="M 30 105 L 165 105" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(0.54, 1.2)}
          stroke={A} strokeWidth={0.9} d="M 30 105 L 30 110" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(0.56, 1.2)}
          stroke={A} strokeWidth={0.9} d="M 165 105 L 165 110" />
        {/* Canopy hatch */}
        <g opacity={0.4}>
          {Array.from({ length: 28 }).map((_, i) => (
            <motion.path
              key={`ch-${i}`}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(0.6 + i * 0.01, 0.7)}
              stroke={F}
              strokeWidth={0.25}
              d={`M ${30 + i * 5} 105 L ${33 + i * 5} 110`}
            />
          ))}
        </g>

        {/* ============ Façade — 8 floor-to-ceiling glass panels with vertical mullions ============ */}
        {panelXs.map((x, i) => (
          <motion.path
            key={`pn-${i}`}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(0.7 + i * 0.04, 1.0)}
            stroke={W}
            strokeWidth={0.5}
            d={`M ${x} 110 L ${x} 168`}
          />
        ))}
        {/* Glass horizontal banding */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.0, 1.0)}
          stroke={F} strokeWidth={0.35} d="M 50 130 L 138 130" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.02, 1.0)}
          stroke={F} strokeWidth={0.35} d="M 50 150 L 138 150" />

        {/* ============ Entry doors with step ticks ============ */}
        {/* Door 1 */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.08, 0.9)}
          stroke={A} strokeWidth={0.7} d="M 70 168 L 70 140 L 80 140 L 80 168" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.1, 0.6)}
          stroke={F} strokeWidth={0.35} d="M 75 168 L 75 140" />
        {/* Door 1 step */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.12, 0.6)}
          stroke={W} strokeWidth={0.5} d="M 67 168 L 83 168" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.14, 0.6)}
          stroke={W} strokeWidth={0.5} d="M 67 171 L 83 171" />
        {/* tick marks */}
        {[68, 71, 74, 77, 80, 82].map((x, i) => (
          <motion.path
            key={`tk1-${i}`}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(1.16 + i * 0.02, 0.5)}
            stroke={F}
            strokeWidth={0.25}
            d={`M ${x} 168 L ${x} 171`}
          />
        ))}

        {/* Door 2 */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.2, 0.9)}
          stroke={A} strokeWidth={0.7} d="M 110 168 L 110 140 L 120 140 L 120 168" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.22, 0.6)}
          stroke={F} strokeWidth={0.35} d="M 115 168 L 115 140" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.24, 0.6)}
          stroke={W} strokeWidth={0.5} d="M 107 168 L 123 168" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.26, 0.6)}
          stroke={W} strokeWidth={0.5} d="M 107 171 L 123 171" />
        {[108, 111, 114, 117, 120, 122].map((x, i) => (
          <motion.path
            key={`tk2-${i}`}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(1.28 + i * 0.02, 0.5)}
            stroke={F}
            strokeWidth={0.25}
            d={`M ${x} 168 L ${x} 171`}
          />
        ))}

        {/* ============ Roof rafters visible through parapet ============ */}
        {rafters.map((x, i) => (
          <motion.path
            key={`rf-${i}`}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(1.3 + i * 0.025, 0.8)}
            stroke={F}
            strokeWidth={0.3}
            d={`M ${x} 105 L ${x} 95`}
          />
        ))}

        {/* ============ Roof terrace: parapet + balusters ============ */}
        {/* Parapet edge */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.5, 1.2)}
          stroke={A} strokeWidth={0.85} d="M 42 95 L 152 95" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.52, 1.0)}
          stroke={W} strokeWidth={0.5} d="M 42 90 L 152 90" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.54, 0.6)}
          stroke={W} strokeWidth={0.5} d="M 42 90 L 42 95" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.56, 0.6)}
          stroke={W} strokeWidth={0.5} d="M 152 90 L 152 95" />
        {/* Top railing line */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(1.58, 1.0)}
          stroke={W} strokeWidth={0.45} d="M 42 78 L 152 78" />
        {/* Balusters 13 verticals */}
        {balusters.map((x, i) => (
          <motion.path
            key={`bl-${i}`}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(1.6 + i * 0.03, 0.7)}
            stroke={W}
            strokeWidth={0.35}
            d={`M ${x} 90 L ${x} 78`}
          />
        ))}

        {/* ============ Plant pots on roof terrace (3) ============ */}
        {/* Pot 1 */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.0, 0.7)}
          stroke={W} strokeWidth={0.45} d="M 60 90 L 62 80 L 70 80 L 72 90" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.02, 0.7)}
          stroke={F} strokeWidth={0.4} d="M 66 80 L 66 72 M 63 76 L 66 72 L 69 76" />
        {/* Pot 2 */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.05, 0.7)}
          stroke={W} strokeWidth={0.45} d="M 92 90 L 94 80 L 102 80 L 104 90" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.07, 0.7)}
          stroke={F} strokeWidth={0.4} d="M 98 80 L 98 72 M 95 76 L 98 72 L 101 76" />
        {/* Pot 3 */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.1, 0.7)}
          stroke={W} strokeWidth={0.45} d="M 124 90 L 126 80 L 134 80 L 136 90" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.12, 0.7)}
          stroke={F} strokeWidth={0.4} d="M 130 80 L 130 72 M 127 76 L 130 72 L 133 76" />

        {/* ============ Pool / reflecting pond (right) ============ */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.2, 1.2)}
          stroke={A} strokeWidth={0.8} d="M 170 128 L 240 128 L 240 165 L 170 165 Z" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.22, 1.2)}
          stroke={F} strokeWidth={0.35} d="M 173 131 L 237 131 L 237 162 L 173 162 Z" />
        {/* Static water lines */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.25, 1.0)}
          stroke={F} strokeWidth={0.3} d="M 178 137 L 232 137" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.27, 1.0)}
          stroke={F} strokeWidth={0.3} d="M 178 142 L 232 142" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.29, 1.0)}
          stroke={F} strokeWidth={0.3} d="M 178 147 L 232 147" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.31, 1.0)}
          stroke={F} strokeWidth={0.3} d="M 178 152 L 232 152" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.33, 1.0)}
          stroke={F} strokeWidth={0.3} d="M 178 157 L 232 157" />

        {/* Pool animated ripples (3 with opacity + x shift) */}
        <motion.path
          d="M 178 134 Q 195 132 212 134 T 232 134"
          stroke={A}
          strokeWidth={0.4}
          fill="none"
          animate={{ opacity: [0.25, 0.7, 0.25], x: [0, 2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0 }}
        />
        <motion.path
          d="M 178 145 Q 195 143 212 145 T 232 145"
          stroke={A}
          strokeWidth={0.4}
          fill="none"
          animate={{ opacity: [0.3, 0.8, 0.3], x: [0, -2, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        />
        <motion.path
          d="M 178 156 Q 195 154 212 156 T 232 156"
          stroke={A}
          strokeWidth={0.4}
          fill="none"
          animate={{ opacity: [0.2, 0.65, 0.2], x: [0, 2, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        />

        {/* ============ Wooden deck around pool ============ */}
        {deckPlanks.map((x, i) => (
          <motion.path
            key={`dk-${i}`}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(2.4 + i * 0.015, 0.7)}
            stroke={F}
            strokeWidth={0.3}
            d={`M ${x} 168 L ${x} 124`}
          />
        ))}
        {/* Deck outline */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.7, 1.0)}
          stroke={W} strokeWidth={0.55} d="M 165 124 L 245 124 L 245 168" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.72, 1.0)}
          stroke={W} strokeWidth={0.55} d="M 165 168 L 165 124" />

        {/* ============ Lounge chair pictogram on deck ============ */}
        {/* Base rectangle */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.85, 0.8)}
          stroke={A} strokeWidth={0.55} d="M 250 158 L 280 158 L 280 162 L 250 162 Z" />
        {/* Back tilted */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.88, 0.8)}
          stroke={A} strokeWidth={0.55} d="M 280 158 L 290 145 L 286 143 L 278 156" />
        {/* Leg ticks */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.9, 0.6)}
          stroke={F} strokeWidth={0.4} d="M 252 162 L 252 167" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.92, 0.6)}
          stroke={F} strokeWidth={0.4} d="M 263 162 L 263 167" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(2.94, 0.6)}
          stroke={F} strokeWidth={0.4} d="M 274 162 L 274 167" />

        {/* ============ Top dimension callout: L = 14.00 ============ */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.0, 1.0)}
          stroke={W} strokeWidth={0.45} d="M 30 30 L 245 30" />
        {/* Brackets (L-shape ends) */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.02, 0.8)}
          stroke={W} strokeWidth={0.45} d="M 30 26 L 30 34" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.04, 0.8)}
          stroke={W} strokeWidth={0.45} d="M 245 26 L 245 34" />
        {/* Arrow heads */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.06, 0.6)}
          stroke={W} strokeWidth={0.45} d="M 30 30 L 36 28 L 36 32 Z" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.08, 0.6)}
          stroke={W} strokeWidth={0.45} d="M 245 30 L 239 28 L 239 32 Z" />
        <text x={120} y={26} fontSize="6.5" fill={T} fontFamily="monospace">L = 14.00</text>
        {/* Sub-segment top */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.1, 0.9)}
          stroke={F} strokeWidth={0.35} d="M 30 42 L 145 42" />
        <text x={70} y={40} fontSize="4.5" fill={T} fontFamily="monospace">a1 = 9.50</text>
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.12, 0.9)}
          stroke={F} strokeWidth={0.35} d="M 145 42 L 245 42" />
        <text x={180} y={40} fontSize="4.5" fill={T} fontFamily="monospace">a2 = 4.50</text>

        {/* ============ Tiny callout numbers on left side: +0.00 / +3.20 / +3.80 ============ */}
        {/* +3.80 (parapet top) */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.2, 0.8)}
          stroke={F} strokeWidth={0.35} d="M 18 78 L 38 78" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.22, 0.6)}
          stroke={F} strokeWidth={0.35} d="M 35 76 L 38 78 L 35 80" />
        <text x={3} y={77} fontSize="4.5" fill={T} fontFamily="monospace">+3.80</text>
        {/* +3.20 (roof) */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.24, 0.8)}
          stroke={F} strokeWidth={0.35} d="M 18 105 L 28 105" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.26, 0.6)}
          stroke={F} strokeWidth={0.35} d="M 25 103 L 28 105 L 25 107" />
        <text x={3} y={104} fontSize="4.5" fill={T} fontFamily="monospace">+3.20</text>
        {/* +0.00 (ground) */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.28, 0.8)}
          stroke={F} strokeWidth={0.35} d="M 18 168 L 38 168" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.3, 0.6)}
          stroke={F} strokeWidth={0.35} d="M 35 166 L 38 168 L 35 170" />
        <text x={3} y={167} fontSize="4.5" fill={T} fontFamily="monospace">+0.00</text>

        {/* Right vertical dim (height) */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.32, 1.0)}
          stroke={F} strokeWidth={0.35} d="M 260 78 L 260 168" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.34, 0.6)}
          stroke={F} strokeWidth={0.35} d="M 257 78 L 263 78" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.36, 0.6)}
          stroke={F} strokeWidth={0.35} d="M 257 168 L 263 168" />
        <text x={264} y={125} fontSize="4.5" fill={T} fontFamily="monospace" transform="rotate(90 264 125)">H 3.80</text>

        {/* ============ Compass / north arrow corner ============ */}
        <g transform="translate(280,30)">
          <circle cx={0} cy={0} r={11} stroke={F} strokeWidth={0.35} fill="none" />
          <circle cx={0} cy={0} r={8} stroke={F} strokeWidth={0.25} fill="none" />
          <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.4, 0.8)}
            stroke={A} strokeWidth={0.7} d="M 0 -10 L -2.5 0 L 0 -2 L 2.5 0 Z" />
          <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.42, 0.8)}
            stroke={F} strokeWidth={0.4} d="M 0 10 L -1.5 0 L 0 2 L 1.5 0 Z" />
          <text x={-2} y={-13} fontSize="4.5" fill={T} fontFamily="monospace">N</text>
          <text x={-2} y={17} fontSize="4" fill={T} fontFamily="monospace">S</text>
          <text x={12} y={1.5} fontSize="4" fill={T} fontFamily="monospace">E</text>
          <text x={-15} y={1.5} fontSize="4" fill={T} fontFamily="monospace">W</text>
        </g>

        {/* ============ Section ref circle "E" ============ */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.5, 1.0)}
          stroke={A} strokeWidth={0.6} d="M 240 200 m -7 0 a 7 7 0 1 0 14 0 a 7 7 0 1 0 -14 0" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.52, 0.6)}
          stroke={A} strokeWidth={0.5} d="M 233 200 L 247 200" />
        <text x={237} y={198} fontSize="5" fill={T} fontFamily="monospace">E</text>
        <text x={237} y={206} fontSize="3.8" fill={T} fontFamily="monospace">E1</text>

        {/* ============ Construction "thinking" lines past form ============ */}
        <motion.path {...enterFade(3.55, 1.4)}
          stroke={F} strokeWidth={0.25} strokeDasharray="2 2" d="M -20 95 L 320 95" />
        <motion.path {...enterFade(3.57, 1.4)}
          stroke={F} strokeWidth={0.25} strokeDasharray="2 2" d="M -20 110 L 320 110" />
        <motion.path {...enterFade(3.59, 1.4)}
          stroke={F} strokeWidth={0.25} strokeDasharray="2 2" d="M -20 128 L 320 128" />
        <motion.path {...enterFade(3.61, 1.4)}
          stroke={F} strokeWidth={0.25} strokeDasharray="2 2" d="M 50 -10 L 50 220" />
        <motion.path {...enterFade(3.63, 1.4)}
          stroke={F} strokeWidth={0.25} strokeDasharray="2 2" d="M 145 -10 L 145 220" />
        <motion.path {...enterFade(3.65, 1.4)}
          stroke={F} strokeWidth={0.25} strokeDasharray="2 2" d="M 245 -10 L 245 220" />

        {/* ============ Bottom title block ============ */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.7, 0.8)}
          stroke={F} strokeWidth={0.35} d="M 195 198 L 295 198 L 295 213 L 195 213 Z" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.72, 0.6)}
          stroke={F} strokeWidth={0.35} d="M 195 205 L 295 205" />
        <text x={199} y={203} fontSize="4.5" fill={T} fontFamily="monospace">PAVILION 02 / E.SECTION</text>
        <text x={199} y={211} fontSize="4" fill={T} fontFamily="monospace">SCALE 1:100</text>

        {/* Tick marks along baseline */}
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.path
            key={`bt2-${i}`}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(3.78 + i * 0.01, 0.5)}
            stroke={F}
            strokeWidth={0.25}
            d={`M ${i * 17} 174 L ${i * 17} 178`}
          />
        ))}

        {/* Numbered call-outs */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.85, 0.7)}
          stroke={F} strokeWidth={0.3} d="M 100 110 L 100 60" />
        <circle cx={100} cy={58} r={4} stroke={F} strokeWidth={0.4} fill="none" />
        <text x={97.5} y={60} fontSize="4" fill={T} fontFamily="monospace">01</text>

        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.88, 0.7)}
          stroke={F} strokeWidth={0.3} d="M 205 145 L 230 188" />
        <circle cx={232} cy={190} r={4} stroke={F} strokeWidth={0.4} fill="none" />
        <text x={229.5} y={192} fontSize="4" fill={T} fontFamily="monospace">02</text>

        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.9, 0.7)}
          stroke={F} strokeWidth={0.3} d="M 100 80 L 75 55" />
        <circle cx={73} cy={53} r={4} stroke={F} strokeWidth={0.4} fill="none" />
        <text x={70.5} y={55} fontSize="4" fill={T} fontFamily="monospace">03</text>

        {/* Foundation depth marker */}
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.93, 0.8)}
          stroke={F} strokeWidth={0.3} d="M 32 168 L 32 180" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.95, 0.5)}
          stroke={F} strokeWidth={0.3} d="M 29 168 L 35 168" />
        <motion.path pathLength={1} strokeDasharray={1} {...enterDraw(3.97, 0.5)}
          stroke={F} strokeWidth={0.3} d="M 29 180 L 35 180" />
        <text x={20} y={177} fontSize="3.5" fill={T} fontFamily="monospace">f1.2</text>
      </motion.g>
    </svg>
  );
}
