"use client";
import { motion } from "framer-motion";

const enterDraw = (delay = 0, duration = 1.8) => ({
  initial: { strokeDashoffset: 1 },
  whileInView: { strokeDashoffset: 0 },
  viewport: { once: true, amount: 0.15 } as const,
  transition: { duration, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

// Stroke palettes
const W_MAIN = "rgba(255,255,255,0.55)";
const W_FAINT = "rgba(255,255,255,0.30)";
const W_ACCENT = "rgba(255,255,255,0.78)";
const W_TEXT = "rgba(255,255,255,0.45)";

const B_MAIN = "rgba(30,157,241,0.5)";
const B_FAINT = "rgba(30,157,241,0.28)";
const B_ACCENT = "rgba(30,157,241,0.78)";
const B_TEXT = "rgba(30,157,241,0.55)";

/* =========================================================================
 * Component 1: ArchRoof — pitched roof construction blueprint
 * ========================================================================= */
export function ArchRoof({ className }: { className?: string }) {
  // Geometry
  const ridgeY = 70;
  const eaveY = 230;
  const leftEave = 40;
  const rightEave = 440;
  const ridgeX = 240;
  const slopeLeftCount = 16;
  const slopeRightCount = 16;
  const purlinsLeft = [95, 130, 165, 200, 220];
  const purlinsRight = [95, 130, 165, 200, 220];
  const tileRowsLeft = [85, 105, 125, 145, 165, 185, 205, 222];
  const tileRowsRight = [85, 105, 125, 145, 165, 185, 205, 222];

  // Helpers to compute rafter positions (linearly interpolated along slope)
  const leftRafterX = (i: number, n: number) => leftEave + ((ridgeX - leftEave) * i) / n;
  const rightRafterX = (i: number, n: number) => ridgeX + ((rightEave - ridgeX) * i) / n;
  const slopeY = (x: number) => {
    if (x <= ridgeX) return eaveY - ((eaveY - ridgeY) * (x - leftEave)) / (ridgeX - leftEave);
    return ridgeY + ((eaveY - ridgeY) * (x - ridgeX)) / (rightEave - ridgeX);
  };

  return (
    <svg
      viewBox="0 0 480 320"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      style={{ overflow: "visible" }}
      className={className}
    >
      {/* Outer wrapper : drift Y plus marqué + balancement rotationnel
          très lent (-0.6° → +0.6°) → toit qui "respire" avec le vent. */}
      <motion.g
        animate={{ y: [0, -8, 0, -5, 0], rotate: [-0.6, 0.6, -0.6] }}
        transition={{
          y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 11, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{ transformOrigin: "240px 230px" }}
      >

        {/* ---------- Axis crosshair ---------- */}
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.5}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.1, 1.0)}
          d="M 240 10 L 240 30 M 230 20 L 250 20"
        />
        <motion.circle
          cx={240}
          cy={20}
          r={2.5}
          stroke={W_ACCENT}
          strokeWidth={0.5}
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.2, 0.8)}
        />

        {/* ---------- Section ref circle "B" ---------- */}
        <motion.circle
          cx={420}
          cy={30}
          r={9}
          stroke={W_ACCENT}
          strokeWidth={0.6}
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.3, 0.9)}
        />
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.35, 0.7)}
          d="M 411 30 L 429 30"
        />
        <text x={416} y={28} fontSize="6" fill={W_TEXT} fontFamily="monospace">B</text>
        <text x={416} y={36} fontSize="4" fill={W_TEXT} fontFamily="monospace">02</text>

        {/* ---------- Ridge beam (extending past edges) ---------- */}
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={1.0}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.2, 1.4)}
          d={`M -20 ${ridgeY} L 500 ${ridgeY}`}
        />
        <motion.path
          stroke={W_MAIN}
          strokeWidth={0.5}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.3, 1.4)}
          d={`M -20 ${ridgeY - 3} L 500 ${ridgeY - 3}`}
        />
        <motion.path
          stroke={W_MAIN}
          strokeWidth={0.5}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.32, 1.4)}
          d={`M -20 ${ridgeY + 3} L 500 ${ridgeY + 3}`}
        />

        {/* ---------- Left slope outline ---------- */}
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.9}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.25, 1.6)}
          d={`M ${leftEave} ${eaveY} L ${ridgeX} ${ridgeY}`}
        />
        {/* ---------- Right slope outline ---------- */}
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.9}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.25, 1.6)}
          d={`M ${ridgeX} ${ridgeY} L ${rightEave} ${eaveY}`}
        />
        {/* ---------- Eaves base line ---------- */}
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.7}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.3, 1.4)}
          d={`M -10 ${eaveY} L 490 ${eaveY}`}
        />

        {/* ---------- Rafters left (16) ---------- */}
        {Array.from({ length: slopeLeftCount }).map((_, i) => {
          const x = leftRafterX(i + 1, slopeLeftCount + 1);
          const y = slopeY(x);
          return (
            <motion.path
              key={`rl-${i}`}
              stroke={W_MAIN}
              strokeWidth={0.5}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(0.4 + i * 0.02, 1.0)}
              d={`M ${x} ${y} L ${x} ${eaveY + 8}`}
            />
          );
        })}
        {/* ---------- Rafters right (16) ---------- */}
        {Array.from({ length: slopeRightCount }).map((_, i) => {
          const x = rightRafterX(i + 1, slopeRightCount + 1);
          const y = slopeY(x);
          return (
            <motion.path
              key={`rr-${i}`}
              stroke={W_MAIN}
              strokeWidth={0.5}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(0.4 + i * 0.02, 1.0)}
              d={`M ${x} ${y} L ${x} ${eaveY + 8}`}
            />
          );
        })}

        {/* ---------- Purlins left (5) ---------- */}
        {purlinsLeft.map((y, i) => (
          <motion.path
            key={`pl-${i}`}
            stroke={W_MAIN}
            strokeWidth={0.4}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(0.5 + i * 0.05, 1.0)}
            d={`M ${leftEave + (y - eaveY) * (ridgeX - leftEave) / (ridgeY - eaveY)} ${y} L ${ridgeX - 6} ${y}`}
          />
        ))}
        {/* ---------- Purlins right (5) ---------- */}
        {purlinsRight.map((y, i) => (
          <motion.path
            key={`pr-${i}`}
            stroke={W_MAIN}
            strokeWidth={0.4}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(0.5 + i * 0.05, 1.0)}
            d={`M ${ridgeX + 6} ${y} L ${rightEave - (y - eaveY) * (rightEave - ridgeX) / (ridgeY - eaveY)} ${y}`}
          />
        ))}

        {/* ---------- Tile rows left ---------- */}
        {tileRowsLeft.map((y, i) => {
          const xStart = leftEave + (y - eaveY) * (ridgeX - leftEave) / (ridgeY - eaveY);
          return (
            <motion.path
              key={`tl-${i}`}
              stroke={W_FAINT}
              strokeWidth={0.35}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(0.55 + i * 0.04, 1.0)}
              d={`M ${xStart} ${y} L ${ridgeX} ${y}`}
            />
          );
        })}
        {/* tile separators left */}
        {tileRowsLeft.map((y, i) => {
          const xStart = leftEave + (y - eaveY) * (ridgeX - leftEave) / (ridgeY - eaveY);
          const span = ridgeX - xStart;
          const seps = Math.max(3, Math.floor(span / 18));
          return Array.from({ length: seps }).map((_, j) => {
            const x = xStart + ((j + 0.5) * span) / seps;
            return (
              <motion.path
                key={`tls-${i}-${j}`}
                stroke={W_FAINT}
                strokeWidth={0.3}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(0.6 + i * 0.02 + j * 0.01, 0.7)}
                d={`M ${x} ${y - 5} L ${x} ${y}`}
              />
            );
          });
        })}

        {/* ---------- Tile rows right ---------- */}
        {tileRowsRight.map((y, i) => {
          const xEnd = rightEave - (y - eaveY) * (rightEave - ridgeX) / (ridgeY - eaveY);
          return (
            <motion.path
              key={`tr-${i}`}
              stroke={W_FAINT}
              strokeWidth={0.35}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(0.55 + i * 0.04, 1.0)}
              d={`M ${ridgeX} ${y} L ${xEnd} ${y}`}
            />
          );
        })}
        {/* tile separators right */}
        {tileRowsRight.map((y, i) => {
          const xEnd = rightEave - (y - eaveY) * (rightEave - ridgeX) / (ridgeY - eaveY);
          const span = xEnd - ridgeX;
          const seps = Math.max(3, Math.floor(span / 18));
          return Array.from({ length: seps }).map((_, j) => {
            const x = ridgeX + ((j + 0.5) * span) / seps;
            return (
              <motion.path
                key={`trs-${i}-${j}`}
                stroke={W_FAINT}
                strokeWidth={0.3}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(0.6 + i * 0.02 + j * 0.01, 0.7)}
                d={`M ${x} ${y - 5} L ${x} ${y}`}
              />
            );
          });
        })}

        {/* ---------- Chimney 1 (right slope, tall) ---------- */}
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.7}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.0, 1.0)}
          d="M 350 130 L 350 30 L 380 30 L 380 130"
        />
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.7}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.05, 0.6)}
          d="M 346 30 L 384 30 L 384 24 L 346 24 Z"
        />
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.path
            key={`ch1-${i}`}
            stroke={W_FAINT}
            strokeWidth={0.35}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(1.1 + i * 0.04, 0.6)}
            d={`M 350 ${42 + i * 10} L 380 ${42 + i * 10}`}
          />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.path
            key={`ch1b-${i}`}
            stroke={W_FAINT}
            strokeWidth={0.3}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(1.12 + i * 0.04, 0.6)}
            d={`M 365 ${37 + i * 10} L 365 ${47 + i * 10}`}
          />
        ))}

        {/* Chimney 1 vapor smoke (animée — particules avec dérive horizontale
            pour suggérer le vent, plus nombreuses, ascension plus haute) */}
        <motion.circle
          cx={358}
          cy={20}
          r={2}
          fill={W_FAINT}
          animate={{ cy: [20, -20, -70], cx: [358, 363, 372], opacity: [0, 0.7, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.circle
          cx={365}
          cy={20}
          r={2.5}
          fill={W_FAINT}
          animate={{ cy: [20, -25, -80], cx: [365, 372, 384], opacity: [0, 0.6, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, delay: 0.7, ease: "easeOut" }}
        />
        <motion.circle
          cx={372}
          cy={20}
          r={1.8}
          fill={W_FAINT}
          animate={{ cy: [20, -22, -75], cx: [372, 380, 392], opacity: [0, 0.65, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, delay: 1.5, ease: "easeOut" }}
        />
        <motion.circle
          cx={361}
          cy={20}
          r={3}
          fill={W_FAINT}
          animate={{ cy: [20, -30, -90], cx: [361, 370, 386], opacity: [0, 0.5, 0] }}
          transition={{ duration: 5.2, repeat: Infinity, delay: 2.3, ease: "easeOut" }}
        />
        <motion.circle
          cx={368}
          cy={20}
          r={2.2}
          fill={W_FAINT}
          animate={{ cy: [20, -28, -85], cx: [368, 376, 390], opacity: [0, 0.55, 0] }}
          transition={{ duration: 4.7, repeat: Infinity, delay: 3.1, ease: "easeOut" }}
        />
        {/* vapor curves */}
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.path
            key={`vap-${i}`}
            stroke={W_FAINT}
            strokeWidth={0.35}
            fill="none"
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(1.6 + i * 0.1, 1.4)}
            d={`M ${355 + i * 6} 20 Q ${350 + i * 6} ${10 - i * 4}, ${360 + i * 6} ${0 - i * 5} T ${355 + i * 6} ${-15 - i * 5}`}
          />
        ))}

        {/* ---------- Chimney 2 (left slope, shorter) ---------- */}
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.7}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.0, 1.0)}
          d="M 110 165 L 110 75 L 134 75 L 134 165"
        />
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.7}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.05, 0.6)}
          d="M 106 75 L 138 75 L 138 70 L 106 70 Z"
        />
        {Array.from({ length: 7 }).map((_, i) => (
          <motion.path
            key={`ch2-${i}`}
            stroke={W_FAINT}
            strokeWidth={0.35}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(1.1 + i * 0.04, 0.6)}
            d={`M 110 ${85 + i * 11} L 134 ${85 + i * 11}`}
          />
        ))}

        {/* Chimney 2 vapor smoke (gauche) — dérive opposée (vent vers la gauche) */}
        <motion.circle
          cx={117}
          cy={70}
          r={2}
          fill={W_FAINT}
          animate={{ cy: [70, 40, 0], cx: [117, 110, 100], opacity: [0, 0.6, 0] }}
          transition={{ duration: 4.4, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.circle
          cx={123}
          cy={70}
          r={2.5}
          fill={W_FAINT}
          animate={{ cy: [70, 35, -10], cx: [123, 115, 102], opacity: [0, 0.55, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1.1, ease: "easeOut" }}
        />
        <motion.circle
          cx={129}
          cy={70}
          r={1.8}
          fill={W_FAINT}
          animate={{ cy: [70, 38, -5], cx: [129, 121, 110], opacity: [0, 0.5, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, delay: 2.2, ease: "easeOut" }}
        />

        {/* ---------- Dormer window (right slope) ---------- */}
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.7}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.2, 1.2)}
          d="M 290 175 L 290 140 L 310 120 L 350 120 L 350 175"
        />
        <motion.path
          stroke={W_MAIN}
          strokeWidth={0.5}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.25, 1.0)}
          d="M 290 140 L 270 130 M 350 120 L 358 124"
        />
        {/* dormer mini-roof tiles */}
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.path
            key={`drf-${i}`}
            stroke={W_FAINT}
            strokeWidth={0.3}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(1.3 + i * 0.04, 0.6)}
            d={`M ${280 + i * 4} ${135 - i * 2} L ${340 + i * 4} ${135 - i * 2}`}
          />
        ))}
        {/* dormer frame */}
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.5}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.35, 0.8)}
          d="M 296 168 L 296 145 L 344 145 L 344 168 Z"
        />
        <motion.path
          stroke={W_MAIN}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.4, 0.6)}
          d="M 320 145 L 320 168 M 296 156 L 344 156"
        />
        {/* dormer glass pulse */}
        <motion.rect
          x={297}
          y={146}
          width={46}
          height={21}
          fill="rgba(255,255,255,0.25)"
          animate={{ opacity: [0.15, 0.95, 0.4, 0.85, 0.15] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* ---------- Fascia + soffit ---------- */}
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.6}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.4, 1.4)}
          d="M -10 234 L 490 234"
        />
        <motion.path
          stroke={W_MAIN}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.42, 1.4)}
          d="M -10 240 L 490 240"
        />
        {/* soffit ticks */}
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.path
            key={`sof-${i}`}
            stroke={W_FAINT}
            strokeWidth={0.3}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(1.45 + i * 0.01, 0.4)}
            d={`M ${i * 20} 234 L ${i * 20} 240`}
          />
        ))}

        {/* ---------- Gutter ---------- */}
        <motion.path
          stroke={W_MAIN}
          strokeWidth={0.5}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.5, 1.4)}
          d="M -10 244 L 490 244"
        />
        <motion.path
          stroke={W_FAINT}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.52, 1.4)}
          d="M -10 248 L 490 248"
        />

        {/* downspout 1 (left) */}
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.6}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.55, 1.2)}
          d="M 80 244 L 80 340"
        />
        <motion.path
          stroke={W_MAIN}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.56, 1.2)}
          d="M 84 244 L 84 340"
        />
        {/* downspout 2 (right) */}
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.6}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.55, 1.2)}
          d="M 410 244 L 410 340"
        />
        <motion.path
          stroke={W_MAIN}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.56, 1.2)}
          d="M 414 244 L 414 340"
        />
        {/* downspout brackets */}
        {[260, 295, 330].map((y, i) => (
          <motion.path
            key={`dsb-l-${i}`}
            stroke={W_FAINT}
            strokeWidth={0.3}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(1.6 + i * 0.05, 0.5)}
            d={`M 76 ${y} L 88 ${y}`}
          />
        ))}
        {[260, 295, 330].map((y, i) => (
          <motion.path
            key={`dsb-r-${i}`}
            stroke={W_FAINT}
            strokeWidth={0.3}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(1.6 + i * 0.05, 0.5)}
            d={`M 406 ${y} L 418 ${y}`}
          />
        ))}

        {/* ---------- Pitch angle indicator (left, "30°") ---------- */}
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.5}
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.7, 1.0)}
          d={`M ${leftEave + 30} ${eaveY} A 30 30 0 0 1 ${leftEave + 26} ${eaveY - 14}`}
        />
        <text x={leftEave + 24} y={eaveY - 4} fontSize="6" fill={W_TEXT} fontFamily="monospace">30°</text>

        {/* ---------- Right dim "h = 4.20" ---------- */}
        <motion.path
          stroke={W_MAIN}
          strokeWidth={0.5}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.75, 1.0)}
          d="M 460 70 L 460 230"
        />
        <motion.path
          stroke={W_MAIN}
          strokeWidth={0.5}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.78, 0.6)}
          d="M 456 70 L 464 70 M 456 230 L 464 230"
        />
        {/* arrows */}
        <motion.path
          stroke={W_MAIN}
          strokeWidth={0.4}
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.8, 0.5)}
          d="M 458 74 L 460 70 L 462 74 M 458 226 L 460 230 L 462 226"
        />
        <text x={464} y={155} fontSize="7" fill={W_TEXT} fontFamily="monospace">h = 4.20</text>

        {/* ---------- Bottom dim ---------- */}
        <motion.path
          stroke={W_MAIN}
          strokeWidth={0.5}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.85, 1.2)}
          d={`M ${leftEave} 270 L ${rightEave} 270`}
        />
        <motion.path
          stroke={W_MAIN}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.88, 0.6)}
          d={`M ${leftEave} 266 L ${leftEave} 274 M ${rightEave} 266 L ${rightEave} 274`}
        />
        <motion.path
          stroke={W_MAIN}
          strokeWidth={0.4}
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.9, 0.5)}
          d={`M ${leftEave + 4} 268 L ${leftEave} 270 L ${leftEave + 4} 272 M ${rightEave - 4} 268 L ${rightEave} 270 L ${rightEave - 4} 272`}
        />
        <text x={230} y={266} fontSize="7" fill={W_TEXT} fontFamily="monospace">L = 12.40</text>

        {/* ---------- Callout: "TUILE TERRE CUITE" ---------- */}
        <motion.path
          stroke={W_FAINT}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.95, 0.8)}
          d="M 200 130 L 175 95 L 130 95"
        />
        <motion.circle
          cx={200}
          cy={130}
          r={1.5}
          fill={W_ACCENT}
          stroke={W_ACCENT}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(2.0, 0.4)}
        />
        <text x={50} y={92} fontSize="5" fill={W_TEXT} fontFamily="monospace">TUILE TERRE CUITE</text>
        <text x={50} y={100} fontSize="4" fill={W_TEXT} fontFamily="monospace">e = 18mm</text>
      </motion.g>
    </svg>
  );
}

/* =========================================================================
 * Component 2: ArchFactoryFragment — industrial sheds + chimney + conveyor
 * ========================================================================= */
export function ArchFactoryFragment({ className }: { className?: string }) {
  const groundY = 230;

  // 3 sawtooth sheds geometry
  const sheds = [
    { x: 60, w: 70 },
    { x: 135, w: 70 },
    { x: 210, w: 70 },
  ];

  return (
    <svg
      viewBox="0 0 380 280"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      style={{ overflow: "visible" }}
      className={className}
    >
      <motion.g
        animate={{ x: [0, -5, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* ---------- Construction grid ---------- */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.path
            key={`fg-v-${i}`}
            stroke={W_FAINT}
            strokeWidth={0.4}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(0.02 * i, 0.9)}
            d={`M ${i * 20} 0 L ${i * 20} 280`}
          />
        ))}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.path
            key={`fg-h-${i}`}
            stroke={W_FAINT}
            strokeWidth={0.4}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(0.02 * i + 0.1, 0.9)}
            d={`M 0 ${i * 20} L 380 ${i * 20}`}
          />
        ))}

        {/* ---------- Section ref C ---------- */}
        <motion.circle
          cx={350}
          cy={20}
          r={9}
          stroke={W_ACCENT}
          strokeWidth={0.6}
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.2, 0.9)}
        />
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.25, 0.6)}
          d="M 341 20 L 359 20"
        />
        <text x={346} y={18} fontSize="6" fill={W_TEXT} fontFamily="monospace">C</text>
        <text x={346} y={26} fontSize="4" fill={W_TEXT} fontFamily="monospace">04</text>

        {/* ---------- Ground line + foundation hatch ---------- */}
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.8}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.3, 1.4)}
          d={`M -20 ${groundY} L 400 ${groundY}`}
        />
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.path
            key={`fnd-${i}`}
            stroke={W_FAINT}
            strokeWidth={0.3}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(0.4 + i * 0.01, 0.5)}
            d={`M ${i * 14 - 10} ${groundY + 2} L ${i * 14 - 4} ${groundY + 12}`}
          />
        ))}
        <motion.path
          stroke={W_MAIN}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.45, 1.4)}
          d={`M -20 ${groundY + 14} L 400 ${groundY + 14}`}
        />

        {/* ---------- 3 sawtooth sheds ---------- */}
        {sheds.map((s, idx) => {
          const top = 110;
          const peak = 80;
          const x = s.x;
          const w = s.w;
          const baseDelay = 0.5 + idx * 0.15;
          return (
            <g key={`shed-${idx}`}>
              {/* vertical wall */}
              <motion.path
                stroke={W_ACCENT}
                strokeWidth={0.7}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(baseDelay, 1.0)}
                d={`M ${x} ${groundY} L ${x} ${peak}`}
              />
              {/* glazed slope */}
              <motion.path
                stroke={W_ACCENT}
                strokeWidth={0.7}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(baseDelay + 0.1, 1.0)}
                d={`M ${x} ${peak} L ${x + w} ${top}`}
              />
              {/* flat top to next shed */}
              <motion.path
                stroke={W_ACCENT}
                strokeWidth={0.7}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(baseDelay + 0.2, 0.8)}
                d={`M ${x + w} ${top} L ${x + w} ${groundY}`}
              />
              {/* mullions on glazed slope (8) */}
              {Array.from({ length: 8 }).map((_, i) => {
                const t = (i + 1) / 9;
                const mx = x + w * t;
                const my = peak + (top - peak) * t;
                return (
                  <motion.path
                    key={`shed-${idx}-mul-${i}`}
                    stroke={W_MAIN}
                    strokeWidth={0.4}
                    pathLength={1}
                    strokeDasharray={1}
                    {...enterDraw(baseDelay + 0.3 + i * 0.03, 0.7)}
                    d={`M ${mx} ${my} L ${mx} ${groundY}`}
                  />
                );
              })}
              {/* horizontal glass divisions */}
              {[0.25, 0.5, 0.75].map((t, i) => {
                const y0 = peak + (top - peak) * t;
                const y1 = groundY;
                const yy = y0 + (y1 - y0) * 0.4;
                return (
                  <motion.path
                    key={`shed-${idx}-hor-${i}`}
                    stroke={W_FAINT}
                    strokeWidth={0.35}
                    pathLength={1}
                    strokeDasharray={1}
                    {...enterDraw(baseDelay + 0.5 + i * 0.05, 0.7)}
                    d={`M ${x} ${yy} L ${x + w} ${yy}`}
                  />
                );
              })}
            </g>
          );
        })}

        {/* ---------- Vent pipes on roof ---------- */}
        {[170, 245, 60].map((vx, i) => (
          <g key={`vent-${i}`}>
            <motion.path
              stroke={W_MAIN}
              strokeWidth={0.5}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(1.0 + i * 0.1, 0.7)}
              d={`M ${vx} 100 L ${vx} 78 L ${vx + 6} 78 L ${vx + 6} 100`}
            />
            <motion.path
              stroke={W_ACCENT}
              strokeWidth={0.5}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(1.05 + i * 0.1, 0.5)}
              d={`M ${vx - 2} 78 L ${vx + 8} 78 L ${vx + 8} 74 L ${vx - 2} 74 Z`}
            />
          </g>
        ))}

        {/* ---------- Cylindrical water tank on top of middle shed ---------- */}
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.7}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.2, 1.0)}
          d="M 155 110 L 155 60"
        />
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.7}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.22, 1.0)}
          d="M 195 110 L 195 60"
        />
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.6}
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.25, 0.9)}
          d="M 155 60 A 20 6 0 0 1 195 60"
        />
        <motion.path
          stroke={W_MAIN}
          strokeWidth={0.5}
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.27, 0.9)}
          d="M 155 60 A 20 6 0 0 0 195 60"
        />
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.6}
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.3, 0.9)}
          d="M 155 110 A 20 6 0 0 0 195 110"
        />
        {/* tank ladder */}
        <motion.path
          stroke={W_MAIN}
          strokeWidth={0.5}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.35, 0.9)}
          d="M 197 60 L 197 110"
        />
        <motion.path
          stroke={W_MAIN}
          strokeWidth={0.5}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.36, 0.9)}
          d="M 201 60 L 201 110"
        />
        {Array.from({ length: 7 }).map((_, i) => (
          <motion.path
            key={`tk-rung-${i}`}
            stroke={W_FAINT}
            strokeWidth={0.4}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(1.4 + i * 0.04, 0.5)}
            d={`M 197 ${65 + i * 7} L 201 ${65 + i * 7}`}
          />
        ))}
        {/* tank label */}
        <text x={160} y={88} fontSize="5" fill={W_TEXT} fontFamily="monospace">H2O</text>

        {/* ---------- Tall chimney on right ---------- */}
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.8}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.7, 1.4)}
          d={`M 308 ${groundY} L 308 30`}
        />
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.8}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.72, 1.4)}
          d={`M 326 ${groundY} L 326 30`}
        />
        {/* brick course rings every 30px */}
        {[60, 90, 120, 150, 180, 210].map((y, i) => (
          <motion.path
            key={`ch-ring-${i}`}
            stroke={W_FAINT}
            strokeWidth={0.4}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(0.85 + i * 0.04, 0.6)}
            d={`M 308 ${y} L 326 ${y}`}
          />
        ))}
        {/* capping band */}
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.6}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.0, 0.6)}
          d="M 304 30 L 330 30 L 330 22 L 304 22 Z"
        />
        <motion.path
          stroke={W_MAIN}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.05, 0.6)}
          d="M 304 26 L 330 26"
        />
        {/* lightning rod */}
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.6}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.1, 0.7)}
          d="M 317 22 L 317 -10"
        />
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.15, 0.5)}
          d="M 314 -6 L 320 -6 M 315 -2 L 319 -2"
        />

        {/* chimney smoke (4 particles) */}
        <motion.circle
          cx={313}
          cy={20}
          r={2}
          fill={W_FAINT}
          animate={{ cy: [20, -20, -50], cx: [313, 308, 304], opacity: [0, 0.55, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.circle
          cx={319}
          cy={20}
          r={2.5}
          fill={W_FAINT}
          animate={{ cy: [20, -25, -55], cx: [319, 322, 326], opacity: [0, 0.5, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, delay: 0.8, ease: "easeOut" }}
        />
        <motion.circle
          cx={324}
          cy={20}
          r={1.8}
          fill={W_FAINT}
          animate={{ cy: [20, -18, -48], cx: [324, 320, 316], opacity: [0, 0.6, 0] }}
          transition={{ duration: 4.6, repeat: Infinity, delay: 1.6, ease: "easeOut" }}
        />
        <motion.circle
          cx={316}
          cy={20}
          r={1.6}
          fill={W_FAINT}
          animate={{ cy: [20, -22, -52], cx: [316, 320, 324], opacity: [0, 0.5, 0] }}
          transition={{ duration: 5.2, repeat: Infinity, delay: 2.4, ease: "easeOut" }}
        />

        {/* ---------- Cable trays / power lines from chimney to wall (zig-zag) ---------- */}
        <motion.path
          stroke={W_MAIN}
          strokeWidth={0.45}
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.3, 1.4)}
          d="M 308 80 L 290 90 L 308 100 L 290 110 L 308 120 L 290 130 L 280 130"
        />
        <motion.path
          stroke={W_FAINT}
          strokeWidth={0.35}
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.35, 1.4)}
          d="M 308 84 L 290 94 L 308 104 L 290 114 L 308 124 L 290 134"
        />

        {/* ---------- Loading dock (left) ---------- */}
        {[0, 1, 2].map((i) => (
          <g key={`dock-${i}`}>
            <motion.path
              stroke={W_ACCENT}
              strokeWidth={0.6}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(1.4 + i * 0.08, 0.9)}
              d={`M ${10 + i * 17} 230 L ${10 + i * 17} 175 L ${24 + i * 17} 175 L ${24 + i * 17} 230`}
            />
            {/* door slats */}
            {Array.from({ length: 6 }).map((_, j) => (
              <motion.path
                key={`dock-${i}-${j}`}
                stroke={W_FAINT}
                strokeWidth={0.3}
                pathLength={1}
                strokeDasharray={1}
                {...enterDraw(1.45 + i * 0.05 + j * 0.02, 0.4)}
                d={`M ${11 + i * 17} ${182 + j * 8} L ${23 + i * 17} ${182 + j * 8}`}
              />
            ))}
          </g>
        ))}
        {/* concrete ramp lines */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.path
            key={`ramp-${i}`}
            stroke={W_FAINT}
            strokeWidth={0.35}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(1.6 + i * 0.04, 0.5)}
            d={`M 0 ${232 + i * 2} L 60 ${232 + i * 2}`}
          />
        ))}
        {/* truck-stop ticks */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.path
            key={`tick-${i}`}
            stroke={W_FAINT}
            strokeWidth={0.4}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(1.7 + i * 0.03, 0.4)}
            d={`M ${i * 7 + 2} 244 L ${i * 7 + 2} 250`}
          />
        ))}

        {/* ---------- Conveyor belt extending past right edge ---------- */}
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.7}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.5, 1.4)}
          d="M 240 195 L 400 195"
        />
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.7}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(1.55, 1.4)}
          d="M 240 210 L 400 210"
        />
        {/* conveyor legs */}
        {[260, 290, 320, 350, 380].map((lx, i) => (
          <motion.path
            key={`cv-leg-${i}`}
            stroke={W_MAIN}
            strokeWidth={0.5}
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(1.6 + i * 0.04, 0.7)}
            d={`M ${lx} 210 L ${lx} ${groundY}`}
          />
        ))}
        {/* rollers (6 small circles on the belt) */}
        {[250, 280, 310, 340, 370, 395].map((rx, i) => (
          <motion.circle
            key={`roll-${i}`}
            cx={rx}
            cy={202}
            r={2}
            stroke={W_ACCENT}
            strokeWidth={0.4}
            fill="none"
            pathLength={1}
            strokeDasharray={1}
            {...enterDraw(1.7 + i * 0.03, 0.5)}
          />
        ))}
        {/* moving dots on conveyor */}
        <motion.circle
          cx={240}
          cy={199}
          r={1.6}
          fill={W_ACCENT}
          animate={{ cx: [240, 400] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle
          cx={240}
          cy={199}
          r={1.6}
          fill={W_ACCENT}
          animate={{ cx: [240, 400] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 2 }}
        />
        <motion.circle
          cx={240}
          cy={199}
          r={1.6}
          fill={W_ACCENT}
          animate={{ cx: [240, 400] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 4 }}
        />

        {/* ---------- Industrial signage stencil shapes (3 rectangles with X) ---------- */}
        {[40, 90, 220].map((sx, i) => (
          <g key={`sig-${i}`}>
            <motion.path
              stroke={W_ACCENT}
              strokeWidth={0.5}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(1.85 + i * 0.05, 0.6)}
              d={`M ${sx} 165 L ${sx + 10} 165 L ${sx + 10} 173 L ${sx} 173 Z`}
            />
            <motion.path
              stroke={W_MAIN}
              strokeWidth={0.4}
              pathLength={1}
              strokeDasharray={1}
              {...enterDraw(1.9 + i * 0.05, 0.4)}
              d={`M ${sx} 165 L ${sx + 10} 173 M ${sx + 10} 165 L ${sx} 173`}
            />
          </g>
        ))}

        {/* ---------- Bottom dim L = 24.00 ---------- */}
        <motion.path
          stroke={W_MAIN}
          strokeWidth={0.5}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(2.0, 1.2)}
          d="M 10 262 L 290 262"
        />
        <motion.path
          stroke={W_MAIN}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(2.05, 0.4)}
          d="M 10 258 L 10 266 M 290 258 L 290 266"
        />
        <motion.path
          stroke={W_MAIN}
          strokeWidth={0.4}
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(2.07, 0.5)}
          d="M 14 260 L 10 262 L 14 264 M 286 260 L 290 262 L 286 264"
        />
        <text x={140} y={258} fontSize="7" fill={W_TEXT} fontFamily="monospace">L = 24.00</text>

        {/* ---------- Right callout vertical dim ---------- */}
        <motion.path
          stroke={W_MAIN}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(2.1, 1.0)}
          d="M 360 30 L 360 230"
        />
        <motion.path
          stroke={W_MAIN}
          strokeWidth={0.4}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(2.12, 0.4)}
          d="M 356 30 L 364 30 M 356 230 L 364 230"
        />
        <text x={362} y={130} fontSize="6" fill={W_TEXT} fontFamily="monospace">H = 18.5</text>

        {/* axis crosshair */}
        <motion.path
          stroke={W_ACCENT}
          strokeWidth={0.5}
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.05, 0.8)}
          d="M 20 8 L 20 28 M 10 18 L 30 18"
        />
        <motion.circle
          cx={20}
          cy={18}
          r={2.5}
          stroke={W_ACCENT}
          strokeWidth={0.5}
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          {...enterDraw(0.1, 0.6)}
        />
      </motion.g>
    </svg>
  );
}

/* =====================================================================
 * Component 3: ArchClockTower (REPLACES ArchSilo)
 * Tour-horloge gothique-moderne — base en pierre + corps en briques avec
 * fenêtres en plein cintre, gallery de cloches, gros cadran d'horloge avec
 * AIGUILLES QUI TOURNENT EN CONTINU, toit pyramidal + girouette qui oscille,
 * lanternes qui pulsent. ~140 paths.
 * Couleur : BLEU (#1262b3 family).
 * ===================================================================== */
export function ArchClockTower({ className }: { className?: string }) {
  const M = "rgba(30,157,241,0.55)";   // main
  const F = "rgba(30,157,241,0.30)";   // faint
  const A = "rgba(30,157,241,0.78)";   // accent
  const T = "rgba(30,157,241,0.55)";   // text

  // Dimensions clés
  const cx = 140;
  const clockCx = 140;
  const clockCy = 130;
  const clockR = 38;

  return (
    <svg
      viewBox="0 0 280 420"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      className={className}
      style={{ overflow: "visible" }}
    >
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* ───── Sol + hachures de fondation 45° ───── */}
        <motion.path
          stroke={M} strokeWidth={1.0}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(0, 1.0)}
          d="M -20 380 L 300 380"
        />
        {Array.from({ length: 28 }).map((_, i) => (
          <motion.path
            key={`fnd-${i}`}
            stroke={F} strokeWidth={0.4}
            pathLength={1} strokeDasharray={1}
            {...enterDraw(0.05 + i * 0.01, 0.6)}
            d={`M ${20 + i * 9} 380 L ${10 + i * 9} 396`}
          />
        ))}
        <motion.path
          stroke={M} strokeWidth={0.7}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(0.1, 0.9)}
          d="M 30 396 L 250 396"
        />

        {/* ───── Base en pierre (large) ───── */}
        <motion.path
          stroke={A} strokeWidth={1.3}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(0.3, 1.6)}
          d="M 60 380 L 60 320 L 220 320 L 220 380"
        />
        {/* Joints de pierre (3 rangées) */}
        {[336, 352, 368].map((y, r) => (
          <g key={`stone-${y}`}>
            <motion.path
              stroke={F} strokeWidth={0.4}
              pathLength={1} strokeDasharray={1}
              {...enterDraw(0.5 + r * 0.05, 0.6)}
              d={`M 60 ${y} L 220 ${y}`}
            />
            {/* Stagger vertical pour effet de pierre */}
            {Array.from({ length: 6 }).map((_, k) => {
              const offset = r % 2 === 0 ? 0 : 13;
              const x = 60 + offset + k * 28;
              return (
                <motion.path
                  key={`sj-${y}-${k}`}
                  stroke={F} strokeWidth={0.35}
                  pathLength={1} strokeDasharray={1}
                  {...enterDraw(0.55 + r * 0.05 + k * 0.02, 0.4)}
                  d={`M ${x} ${y - 16} L ${x} ${y}`}
                />
              );
            })}
          </g>
        ))}

        {/* ───── Porte arche en plein cintre (entrée) ───── */}
        <motion.path
          stroke={A} strokeWidth={1.0}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(0.8, 1.2)}
          d="M 122 380 L 122 340 Q 122 322, 140 322 Q 158 322, 158 340 L 158 380"
        />
        {/* Linteau */}
        <motion.path
          stroke={F} strokeWidth={0.5}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(1.0, 0.6)}
          d="M 116 340 L 164 340"
        />
        {/* Battants de porte */}
        <motion.path
          stroke={F} strokeWidth={0.5}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(1.05, 0.5)}
          d="M 140 340 L 140 380"
        />
        <motion.path
          stroke={F} strokeWidth={0.4}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(1.1, 0.4)}
          d="M 130 380 L 130 348 M 150 380 L 150 348"
        />

        {/* ───── Corniche entre base et corps ───── */}
        <motion.path
          stroke={A} strokeWidth={1.0}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(0.6, 0.9)}
          d="M 50 320 L 230 320 L 230 312 L 50 312 Z"
        />
        {/* Modillons sous la corniche (12 petits crénaux) */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.path
            key={`mod-${i}`}
            stroke={F} strokeWidth={0.4}
            pathLength={1} strokeDasharray={1}
            {...enterDraw(0.65 + i * 0.02, 0.35)}
            d={`M ${56 + i * 14} 312 L ${56 + i * 14} 318 L ${64 + i * 14} 318 L ${64 + i * 14} 312`}
          />
        ))}

        {/* ───── Corps central de la tour (briques) ───── */}
        <motion.path
          stroke={A} strokeWidth={1.3}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(0.4, 1.8)}
          d="M 90 312 L 90 80 L 190 80 L 190 312"
        />
        {/* Briques (joints horizontaux + verticaux décalés) */}
        {Array.from({ length: 14 }).map((_, r) => {
          const y = 96 + r * 16;
          if (y > 308) return null;
          return (
            <g key={`bricks-${r}`}>
              <motion.path
                stroke={F} strokeWidth={0.3}
                pathLength={1} strokeDasharray={1}
                {...enterDraw(0.7 + r * 0.02, 0.4)}
                d={`M 90 ${y} L 190 ${y}`}
              />
              {Array.from({ length: 5 }).map((_, k) => {
                const offset = r % 2 === 0 ? 0 : 10;
                const x = 90 + offset + k * 20;
                if (x >= 190) return null;
                return (
                  <motion.path
                    key={`bj-${r}-${k}`}
                    stroke={F} strokeWidth={0.25}
                    pathLength={1} strokeDasharray={1}
                    {...enterDraw(0.72 + r * 0.02 + k * 0.01, 0.3)}
                    d={`M ${x} ${y} L ${x} ${y + 16}`}
                  />
                );
              })}
            </g>
          );
        })}

        {/* ───── Fenêtres en plein cintre (3 niveaux × 1 fenêtre) ───── */}
        {[
          { y: 220, h: 26 },
          { y: 252, h: 26 },
          { y: 284, h: 22 },
        ].map((w, i) => (
          <g key={`win-${w.y}`}>
            <motion.path
              stroke={A} strokeWidth={0.7}
              pathLength={1} strokeDasharray={1}
              {...enterDraw(1.2 + i * 0.05, 0.7)}
              d={`M 128 ${w.y + w.h} L 128 ${w.y + 6} Q 128 ${w.y - 2}, 140 ${w.y - 2} Q 152 ${w.y - 2}, 152 ${w.y + 6} L 152 ${w.y + w.h}`}
            />
            {/* Mullion central */}
            <motion.path
              stroke={F} strokeWidth={0.4}
              pathLength={1} strokeDasharray={1}
              {...enterDraw(1.3 + i * 0.05, 0.5)}
              d={`M 140 ${w.y + 6} L 140 ${w.y + w.h}`}
            />
            {/* Croisillon horizontal */}
            <motion.path
              stroke={F} strokeWidth={0.35}
              pathLength={1} strokeDasharray={1}
              {...enterDraw(1.35 + i * 0.05, 0.5)}
              d={`M 128 ${w.y + 14} L 152 ${w.y + 14}`}
            />
            {/* Vitre lumineuse qui pulse */}
            <motion.rect
              x={129} y={w.y + 6}
              width={22} height={w.h - 6}
              fill={A} fillOpacity={0.18}
              animate={{ opacity: [0.15, 0.7, 0.3, 0.6, 0.15] }}
              transition={{ duration: 3.6 + i * 0.4, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
            />
          </g>
        ))}

        {/* ───── Galerie de cloches (3 arches au-dessus du cadran) ───── */}
        <motion.path
          stroke={A} strokeWidth={0.9}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(0.9, 0.9)}
          d="M 86 84 L 86 76 L 194 76 L 194 84"
        />
        {[
          { x: 100 },
          { x: 140 },
          { x: 180 },
        ].map((b, i) => (
          <g key={`bell-${i}`}>
            {/* Arche bell */}
            <motion.path
              stroke={A} strokeWidth={0.6}
              pathLength={1} strokeDasharray={1}
              {...enterDraw(1.0 + i * 0.05, 0.7)}
              d={`M ${b.x - 10} 80 L ${b.x - 10} 70 Q ${b.x - 10} 56, ${b.x} 56 Q ${b.x + 10} 56, ${b.x + 10} 70 L ${b.x + 10} 80`}
            />
            {/* Cloche silhouettée */}
            <motion.path
              stroke={F} strokeWidth={0.5}
              pathLength={1} strokeDasharray={1}
              {...enterDraw(1.1 + i * 0.05, 0.6)}
              d={`M ${b.x - 5} 78 Q ${b.x - 5} 64, ${b.x} 62 Q ${b.x + 5} 64, ${b.x + 5} 78 L ${b.x + 4} 78 L ${b.x - 4} 78 Z`}
            />
            {/* Battant qui se balance — animation indépendante */}
            <motion.path
              stroke={A} strokeWidth={0.5}
              fill="none"
              animate={{ rotate: [-12, 12, -12] }}
              transition={{ duration: 2.4 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: `${b.x}px 64px` }}
              d={`M ${b.x} 64 L ${b.x} 76`}
            />
          </g>
        ))}

        {/* ───── Cadran d'horloge — gros cercle ───── */}
        <motion.circle
          cx={clockCx} cy={clockCy} r={clockR}
          stroke={A} strokeWidth={1.4}
          fill="rgba(30,157,241,0.04)"
          pathLength={1} strokeDasharray={1}
          {...enterDraw(1.0, 1.4)}
        />
        <motion.circle
          cx={clockCx} cy={clockCy} r={clockR - 4}
          stroke={F} strokeWidth={0.5}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(1.2, 1.0)}
        />

        {/* ───── 12 graduations horaires ───── */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x1 = clockCx + Math.cos(angle) * (clockR - 6);
          const y1 = clockCy + Math.sin(angle) * (clockR - 6);
          const x2 = clockCx + Math.cos(angle) * (clockR - 1);
          const y2 = clockCy + Math.sin(angle) * (clockR - 1);
          return (
            <motion.path
              key={`hr-${i}`}
              stroke={A}
              strokeWidth={i % 3 === 0 ? 1.0 : 0.6}
              pathLength={1} strokeDasharray={1}
              {...enterDraw(1.4 + i * 0.03, 0.4)}
              d={`M ${x1} ${y1} L ${x2} ${y2}`}
            />
          );
        })}

        {/* ───── 60 graduations minutes (faintes) ───── */}
        {Array.from({ length: 60 }).map((_, i) => {
          if (i % 5 === 0) return null;
          const angle = (i * 6 - 90) * (Math.PI / 180);
          const x1 = clockCx + Math.cos(angle) * (clockR - 3);
          const y1 = clockCy + Math.sin(angle) * (clockR - 3);
          const x2 = clockCx + Math.cos(angle) * (clockR - 1);
          const y2 = clockCy + Math.sin(angle) * (clockR - 1);
          return (
            <motion.path
              key={`mn-${i}`}
              stroke={F}
              strokeWidth={0.3}
              pathLength={1} strokeDasharray={1}
              {...enterDraw(1.6 + i * 0.005, 0.3)}
              d={`M ${x1} ${y1} L ${x2} ${y2}`}
            />
          );
        })}

        {/* ───── Aiguille des HEURES — tourne lentement (60s par tour pour visibilité) ───── */}
        <motion.line
          x1={clockCx} y1={clockCy}
          x2={clockCx} y2={clockCy - clockR + 14}
          stroke={A} strokeWidth={2.2}
          strokeLinecap="round"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${clockCx}px ${clockCy}px` }}
        />
        {/* ───── Aiguille des MINUTES — tour en 12s pour effet visuel ───── */}
        <motion.line
          x1={clockCx} y1={clockCy}
          x2={clockCx} y2={clockCy - clockR + 6}
          stroke={A} strokeWidth={1.4}
          strokeLinecap="round"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${clockCx}px ${clockCy}px` }}
        />
        {/* ───── Aiguille des SECONDES — fine, tour en 4s ───── */}
        <motion.line
          x1={clockCx} y1={clockCy + 4}
          x2={clockCx} y2={clockCy - clockR + 2}
          stroke="rgba(30,157,241,0.95)" strokeWidth={0.7}
          strokeLinecap="round"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${clockCx}px ${clockCy}px` }}
        />
        {/* Pivot central */}
        <circle cx={clockCx} cy={clockCy} r={2.4} fill={A} />
        <circle cx={clockCx} cy={clockCy} r={1} fill="rgba(30,157,241,0.95)" />

        {/* ───── Bandeau supérieur (séparation cadran/galerie) ───── */}
        <motion.path
          stroke={A} strokeWidth={0.8}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(0.9, 0.8)}
          d="M 86 168 L 194 168"
        />

        {/* ───── Toit pyramidal ───── */}
        <motion.path
          stroke={A} strokeWidth={1.3}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(1.1, 1.4)}
          d="M 80 80 L 140 18 L 200 80"
        />
        {/* Avant-toit légèrement débordant */}
        <motion.path
          stroke={F} strokeWidth={0.5}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(1.5, 0.6)}
          d="M 80 80 L 70 86 M 200 80 L 210 86"
        />
        {/* Lignes de tuiles parallèles au toit */}
        {[68, 56, 44, 32].map((y, i) => {
          const dx = (80 - y * 0.96);
          return (
            <motion.path
              key={`tile-${y}`}
              stroke={F} strokeWidth={0.4}
              pathLength={1} strokeDasharray={1}
              {...enterDraw(1.6 + i * 0.05, 0.5)}
              d={`M ${140 - dx * 0.5} ${y} L ${140 + dx * 0.5} ${y}`}
            />
          );
        })}

        {/* ───── Girouette qui oscille ───── */}
        <motion.line
          x1={140} y1={18}
          x2={140} y2={-12}
          stroke={A} strokeWidth={1.0}
          strokeLinecap="round"
        />
        <motion.g
          animate={{ rotate: [-15, 15, -15] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "140px -12px" }}
        >
          <path stroke={A} strokeWidth={0.8} d="M 132 -16 L 148 -12 L 132 -8 Z" />
          <path stroke={A} strokeWidth={0.5} d="M 134 -12 L 146 -12" />
        </motion.g>
        <circle cx={140} cy={-12} r={1.6} fill={A} />

        {/* ───── Petits flèches cardinaux (N, S, E, W) ───── */}
        <text x={138} y={-22} fontSize="5" fill={T} fontFamily="monospace">N</text>

        {/* ───── 4 spires aux coins du toit ───── */}
        {[
          { x: 80, y: 80 },
          { x: 200, y: 80 },
        ].map((s, i) => (
          <g key={`spire-${i}`}>
            <motion.path
              stroke={A} strokeWidth={0.7}
              pathLength={1} strokeDasharray={1}
              {...enterDraw(1.7 + i * 0.05, 0.6)}
              d={`M ${s.x} ${s.y} L ${s.x} ${s.y - 22} L ${s.x + (i === 0 ? 6 : -6)} ${s.y - 22} L ${s.x} ${s.y - 30}`}
            />
            <circle cx={s.x} cy={s.y - 32} r={1.2} fill={A} />
          </g>
        ))}

        {/* ───── Cotation gauche ───── */}
        <motion.path
          stroke={F} strokeWidth={0.4}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(0.4, 1.2)}
          d="M 30 18 L 30 380"
        />
        {[18, 80, 168, 320, 380].map((y, i) => (
          <g key={`dim-${i}`}>
            <motion.path
              stroke={F} strokeWidth={0.4}
              pathLength={1} strokeDasharray={1}
              {...enterDraw(0.45 + i * 0.05, 0.4)}
              d={`M 26 ${y} L 34 ${y}`}
            />
          </g>
        ))}

        {/* ───── Cercle référence section "D" ───── */}
        <motion.circle
          cx={250} cy={40} r={8.5}
          stroke={A} strokeWidth={0.7}
          fill="none"
          pathLength={1} strokeDasharray={1}
          {...enterDraw(0.3, 0.9)}
        />
        <motion.path
          stroke={A} strokeWidth={0.5}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(0.4, 0.5)}
          d="M 241.5 40 L 258.5 40"
        />
        <text x={246} y={38} fontSize="6" fill={T} fontFamily="monospace">D</text>
        <text x={246} y={45} fontSize="3.6" fill={T} fontFamily="monospace">02</text>

        {/* ───── Cartouche identification ───── */}
        <motion.path
          stroke={F} strokeWidth={0.4}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(2.0, 0.9)}
          d="M 200 396 L 270 396 L 270 414 L 200 414 Z"
        />
        <motion.path
          stroke={F} strokeWidth={0.3}
          pathLength={1} strokeDasharray={1}
          {...enterDraw(2.1, 0.6)}
          d="M 200 405 L 270 405"
        />
        <text x={203} y={402} fontSize="4.8" fill={T} fontFamily="monospace">CLOCK · TR</text>
        <text x={203} y={411} fontSize="3.5" fill={T} fontFamily="monospace">BP-002 · 1:100</text>

        {/* ───── Cotes hauteur ───── */}
        <text x={9} y={20} fontSize="4.8" fill={T} fontFamily="monospace">+24.50</text>
        <text x={9} y={172} fontSize="4.8" fill={T} fontFamily="monospace">+15.20</text>
        <text x={9} y={324} fontSize="4.8" fill={T} fontFamily="monospace">+3.20</text>
        <text x={9} y={384} fontSize="4.8" fill={T} fontFamily="monospace">+0.00</text>
      </motion.g>
    </svg>
  );
}
