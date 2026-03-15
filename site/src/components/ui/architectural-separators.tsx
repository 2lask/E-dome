"use client";

import { motion } from "framer-motion";

const easeOutQuart = [0.165, 0.84, 0.44, 1] as const;

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        delay: i * 0.08,
        duration: 1.4,
        ease: easeOutQuart,
      },
      opacity: { delay: i * 0.08, duration: 0.3 },
    },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { delay: i * 0.08 + 0.6, duration: 0.8, ease: easeOutQuart },
  }),
};

const riseUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 1.0,
      ease: easeOutQuart,
    },
  }),
};

// ─────────────────────────────────────────────────────────
// 1. BlueprintFloorPlan
// ─────────────────────────────────────────────────────────
export function BlueprintFloorPlan() {
  return (
    <div className="w-full flex items-center justify-center py-8">
      <motion.svg
        viewBox="0 0 1200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-6xl"
        style={{ height: 200 }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <defs>
          <pattern
            id="fp-grid"
            patternUnits="userSpaceOnUse"
            width="20"
            height="20"
          >
            <motion.line
              x1="0" y1="0" x2="0" y2="20"
              stroke="rgba(255,224,194,0.06)"
              strokeWidth="0.5"
              variants={fadeIn}
              custom={0}
            />
            <motion.line
              x1="0" y1="0" x2="20" y2="0"
              stroke="rgba(255,224,194,0.06)"
              strokeWidth="0.5"
              variants={fadeIn}
              custom={0}
            />
          </pattern>
        </defs>

        {/* Background grid */}
        <motion.rect
          x="50" y="10" width="1100" height="180"
          fill="url(#fp-grid)"
          variants={fadeIn}
          custom={0}
        />

        {/* Outer walls */}
        <motion.rect
          x="100" y="30" width="400" height="140"
          stroke="rgba(255,224,194,0.12)"
          strokeWidth="2"
          variants={draw}
          custom={0}
        />
        <motion.rect
          x="500" y="30" width="300" height="140"
          stroke="rgba(255,224,194,0.12)"
          strokeWidth="2"
          variants={draw}
          custom={1}
        />
        <motion.rect
          x="800" y="30" width="300" height="140"
          stroke="rgba(255,224,194,0.12)"
          strokeWidth="2"
          variants={draw}
          custom={2}
        />

        {/* Interior walls - Room 1 subdivision */}
        <motion.line
          x1="280" y1="30" x2="280" y2="120"
          stroke="rgba(255,224,194,0.10)"
          strokeWidth="1.5"
          variants={draw}
          custom={3}
        />
        <motion.line
          x1="100" y1="110" x2="360" y2="110"
          stroke="rgba(255,224,194,0.10)"
          strokeWidth="1.5"
          variants={draw}
          custom={4}
        />

        {/* Interior walls - Room 2 */}
        <motion.line
          x1="620" y1="30" x2="620" y2="170"
          stroke="rgba(255,224,194,0.10)"
          strokeWidth="1.5"
          variants={draw}
          custom={5}
        />
        <motion.line
          x1="500" y1="100" x2="620" y2="100"
          stroke="rgba(255,224,194,0.10)"
          strokeWidth="1.5"
          variants={draw}
          custom={4}
        />

        {/* Interior walls - Room 3 */}
        <motion.line
          x1="950" y1="30" x2="950" y2="170"
          stroke="rgba(255,224,194,0.10)"
          strokeWidth="1.5"
          variants={draw}
          custom={6}
        />
        <motion.line
          x1="800" y1="95" x2="950" y2="95"
          stroke="rgba(255,224,194,0.10)"
          strokeWidth="1.5"
          variants={draw}
          custom={7}
        />

        {/* Door arcs - Door 1 (bottom of room 1) */}
        <motion.path
          d="M 180 170 A 30 30 0 0 1 210 170"
          stroke="rgba(255,224,194,0.08)"
          strokeWidth="1"
          strokeDasharray="2 2"
          variants={draw}
          custom={8}
        />
        <motion.line
          x1="180" y1="170" x2="180" y2="140"
          stroke="rgba(255,224,194,0.06)"
          strokeWidth="0.8"
          strokeDasharray="2 2"
          variants={draw}
          custom={8}
        />

        {/* Door arc - internal door room 1 */}
        <motion.path
          d="M 280 75 A 25 25 0 0 0 280 100"
          stroke="rgba(255,224,194,0.08)"
          strokeWidth="1"
          strokeDasharray="2 2"
          variants={draw}
          custom={9}
        />

        {/* Door arc - Room 2 entry */}
        <motion.path
          d="M 540 30 A 28 28 0 0 1 568 30"
          stroke="rgba(255,224,194,0.08)"
          strokeWidth="1"
          strokeDasharray="2 2"
          variants={draw}
          custom={10}
        />
        <motion.line
          x1="540" y1="30" x2="540" y2="58"
          stroke="rgba(255,224,194,0.06)"
          strokeWidth="0.8"
          strokeDasharray="2 2"
          variants={draw}
          custom={10}
        />

        {/* Door arc - Room 3 */}
        <motion.path
          d="M 860 170 A 25 25 0 0 1 885 170"
          stroke="rgba(255,224,194,0.08)"
          strokeWidth="1"
          strokeDasharray="2 2"
          variants={draw}
          custom={11}
        />
        <motion.line
          x1="860" y1="170" x2="860" y2="145"
          stroke="rgba(255,224,194,0.06)"
          strokeWidth="0.8"
          strokeDasharray="2 2"
          variants={draw}
          custom={11}
        />

        {/* Door arc - between room 3 subdivisions */}
        <motion.path
          d="M 950 60 A 22 22 0 0 1 950 82"
          stroke="rgba(255,224,194,0.08)"
          strokeWidth="1"
          strokeDasharray="2 2"
          variants={draw}
          custom={12}
        />

        {/* Dimension lines - horizontal top */}
        <motion.line
          x1="100" y1="18" x2="500" y2="18"
          stroke="rgba(255,224,194,0.07)"
          strokeWidth="0.6"
          variants={draw}
          custom={13}
        />
        <motion.line
          x1="100" y1="15" x2="100" y2="21"
          stroke="rgba(255,224,194,0.07)"
          strokeWidth="0.6"
          variants={draw}
          custom={13}
        />
        <motion.line
          x1="500" y1="15" x2="500" y2="21"
          stroke="rgba(255,224,194,0.07)"
          strokeWidth="0.6"
          variants={draw}
          custom={13}
        />
        <motion.text
          x="300" y="16"
          fill="rgba(255,224,194,0.08)"
          fontSize="7"
          textAnchor="middle"
          fontFamily="monospace"
          variants={fadeIn}
          custom={14}
        >
          12.00 m
        </motion.text>

        <motion.line
          x1="500" y1="18" x2="800" y2="18"
          stroke="rgba(255,224,194,0.07)"
          strokeWidth="0.6"
          variants={draw}
          custom={14}
        />
        <motion.line
          x1="800" y1="15" x2="800" y2="21"
          stroke="rgba(255,224,194,0.07)"
          strokeWidth="0.6"
          variants={draw}
          custom={14}
        />
        <motion.text
          x="650" y="16"
          fill="rgba(255,224,194,0.08)"
          fontSize="7"
          textAnchor="middle"
          fontFamily="monospace"
          variants={fadeIn}
          custom={15}
        >
          9.00 m
        </motion.text>

        <motion.line
          x1="800" y1="18" x2="1100" y2="18"
          stroke="rgba(255,224,194,0.07)"
          strokeWidth="0.6"
          variants={draw}
          custom={15}
        />
        <motion.line
          x1="1100" y1="15" x2="1100" y2="21"
          stroke="rgba(255,224,194,0.07)"
          strokeWidth="0.6"
          variants={draw}
          custom={15}
        />
        <motion.text
          x="950" y="16"
          fill="rgba(255,224,194,0.08)"
          fontSize="7"
          textAnchor="middle"
          fontFamily="monospace"
          variants={fadeIn}
          custom={16}
        >
          9.00 m
        </motion.text>

        {/* Dimension line - vertical right */}
        <motion.line
          x1="1112" y1="30" x2="1112" y2="170"
          stroke="rgba(255,224,194,0.07)"
          strokeWidth="0.6"
          variants={draw}
          custom={16}
        />
        <motion.line
          x1="1109" y1="30" x2="1115" y2="30"
          stroke="rgba(255,224,194,0.07)"
          strokeWidth="0.6"
          variants={draw}
          custom={16}
        />
        <motion.line
          x1="1109" y1="170" x2="1115" y2="170"
          stroke="rgba(255,224,194,0.07)"
          strokeWidth="0.6"
          variants={draw}
          custom={16}
        />
        <motion.text
          x="1125" y="104"
          fill="rgba(255,224,194,0.08)"
          fontSize="7"
          textAnchor="middle"
          fontFamily="monospace"
          transform="rotate(90, 1125, 104)"
          variants={fadeIn}
          custom={17}
        >
          4.20 m
        </motion.text>

        {/* Room labels */}
        <motion.text
          x="180" y="78"
          fill="rgba(255,224,194,0.06)"
          fontSize="8"
          textAnchor="middle"
          fontFamily="monospace"
          variants={fadeIn}
          custom={18}
        >
          SALON
        </motion.text>
        <motion.text
          x="370" y="78"
          fill="rgba(255,224,194,0.06)"
          fontSize="8"
          textAnchor="middle"
          fontFamily="monospace"
          variants={fadeIn}
          custom={19}
        >
          CUISINE
        </motion.text>
        <motion.text
          x="220" y="148"
          fill="rgba(255,224,194,0.06)"
          fontSize="7"
          textAnchor="middle"
          fontFamily="monospace"
          variants={fadeIn}
          custom={20}
        >
          ENTRÉE
        </motion.text>
        <motion.text
          x="555" y="72"
          fill="rgba(255,224,194,0.06)"
          fontSize="8"
          textAnchor="middle"
          fontFamily="monospace"
          variants={fadeIn}
          custom={21}
        >
          CH. 1
        </motion.text>
        <motion.text
          x="555" y="142"
          fill="rgba(255,224,194,0.06)"
          fontSize="7"
          textAnchor="middle"
          fontFamily="monospace"
          variants={fadeIn}
          custom={22}
        >
          SDB
        </motion.text>
        <motion.text
          x="700" y="105"
          fill="rgba(255,224,194,0.06)"
          fontSize="8"
          textAnchor="middle"
          fontFamily="monospace"
          variants={fadeIn}
          custom={23}
        >
          CH. 2
        </motion.text>
        <motion.text
          x="870" y="68"
          fill="rgba(255,224,194,0.06)"
          fontSize="8"
          textAnchor="middle"
          fontFamily="monospace"
          variants={fadeIn}
          custom={24}
        >
          BUREAU
        </motion.text>
        <motion.text
          x="870" y="142"
          fill="rgba(255,224,194,0.06)"
          fontSize="7"
          textAnchor="middle"
          fontFamily="monospace"
          variants={fadeIn}
          custom={25}
        >
          RANGEMENT
        </motion.text>
        <motion.text
          x="1020" y="105"
          fill="rgba(255,224,194,0.06)"
          fontSize="8"
          textAnchor="middle"
          fontFamily="monospace"
          variants={fadeIn}
          custom={26}
        >
          TERRASSE
        </motion.text>

        {/* Window indicators (thick breaks in walls) */}
        <motion.line
          x1="330" y1="29" x2="390" y2="29"
          stroke="rgba(255,224,194,0.10)"
          strokeWidth="3"
          variants={draw}
          custom={6}
        />
        <motion.line
          x1="660" y1="29" x2="740" y2="29"
          stroke="rgba(255,224,194,0.10)"
          strokeWidth="3"
          variants={draw}
          custom={7}
        />
        <motion.line
          x1="1000" y1="171" x2="1060" y2="171"
          stroke="rgba(255,224,194,0.10)"
          strokeWidth="3"
          variants={draw}
          custom={8}
        />

        {/* Stair symbol in entrance */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.line
            key={`stair-${i}`}
            x1={395 + i * 8}
            y1="130"
            x2={395 + i * 8}
            y2="160"
            stroke="rgba(255,224,194,0.06)"
            strokeWidth="0.6"
            variants={draw}
            custom={10 + i}
          />
        ))}
        <motion.line
          x1="395" y1="145" x2="435" y2="130"
          stroke="rgba(255,224,194,0.06)"
          strokeWidth="0.6"
          variants={draw}
          custom={15}
        />

        {/* North arrow */}
        <motion.line
          x1="70" y1="180" x2="70" y2="150"
          stroke="rgba(255,224,194,0.10)"
          strokeWidth="1"
          variants={draw}
          custom={18}
        />
        <motion.polygon
          points="70,145 66,155 74,155"
          fill="rgba(255,224,194,0.08)"
          variants={fadeIn}
          custom={19}
        />
        <motion.text
          x="70" y="192"
          fill="rgba(255,224,194,0.07)"
          fontSize="7"
          textAnchor="middle"
          fontFamily="monospace"
          variants={fadeIn}
          custom={20}
        >
          N
        </motion.text>
      </motion.svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 2. IsometricBuilding
// ─────────────────────────────────────────────────────────
export function IsometricBuilding() {
  // Isometric helper: convert (x, y, z) to 2D screen coords
  // Using 30-degree isometric projection
  const iso = (x: number, y: number, z: number) => ({
    x: 600 + (x - y) * 0.866,
    y: 200 + (x + y) * 0.5 - z,
  });

  const floors = [0, 40, 80, 120];
  const floorWidth = 120;
  const floorDepth = 80;

  return (
    <div className="w-full flex items-center justify-center py-8">
      <motion.svg
        viewBox="0 0 1200 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-6xl"
        style={{ height: 300 }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Main building - each floor */}
        {floors.map((floorZ, fi) => {
          const bl = iso(0, 0, floorZ);
          const br = iso(floorWidth, 0, floorZ);
          const tr = iso(floorWidth, floorDepth, floorZ);
          const tl = iso(0, floorDepth, floorZ);

          return (
            <g key={`floor-${fi}`}>
              {/* Floor plate */}
              <motion.polygon
                points={`${bl.x},${bl.y} ${br.x},${br.y} ${tr.x},${tr.y} ${tl.x},${tl.y}`}
                stroke="rgba(255,224,194,0.10)"
                strokeWidth="1"
                fill="rgba(255,224,194,0.02)"
                variants={draw}
                custom={fi * 3}
              />
              {/* Vertical columns at corners */}
              {fi < floors.length - 1 && (
                <>
                  {[
                    [0, 0],
                    [floorWidth, 0],
                    [floorWidth, floorDepth],
                    [0, floorDepth],
                  ].map(([cx, cy], ci) => {
                    const bottom = iso(cx, cy, floorZ);
                    const top = iso(cx, cy, floorZ + 40);
                    return (
                      <motion.line
                        key={`col-${fi}-${ci}`}
                        x1={bottom.x}
                        y1={bottom.y}
                        x2={top.x}
                        y2={top.y}
                        stroke="rgba(255,224,194,0.10)"
                        strokeWidth="1"
                        variants={draw}
                        custom={fi * 3 + 1 + ci * 0.2}
                      />
                    );
                  })}
                </>
              )}
              {/* Window grid on front face */}
              {fi < floors.length - 1 &&
                [0.25, 0.5, 0.75].map((frac, wi) => {
                  const wb = iso(floorWidth * frac, 0, floorZ + 10);
                  const wt = iso(floorWidth * frac, 0, floorZ + 30);
                  return (
                    <motion.line
                      key={`win-front-${fi}-${wi}`}
                      x1={wb.x}
                      y1={wb.y}
                      x2={wt.x}
                      y2={wt.y}
                      stroke="rgba(255,224,194,0.06)"
                      strokeWidth="0.6"
                      variants={draw}
                      custom={fi * 3 + 2}
                    />
                  );
                })}
              {/* Window grid on side face */}
              {fi < floors.length - 1 &&
                [0.33, 0.66].map((frac, wi) => {
                  const wb = iso(floorWidth, floorDepth * frac, floorZ + 10);
                  const wt = iso(floorWidth, floorDepth * frac, floorZ + 30);
                  return (
                    <motion.line
                      key={`win-side-${fi}-${wi}`}
                      x1={wb.x}
                      y1={wb.y}
                      x2={wt.x}
                      y2={wt.y}
                      stroke="rgba(255,224,194,0.06)"
                      strokeWidth="0.6"
                      variants={draw}
                      custom={fi * 3 + 2.5}
                    />
                  );
                })}
            </g>
          );
        })}

        {/* Roof */}
        {(() => {
          const roofZ = 160;
          const peakZ = 190;
          const bl = iso(0, 0, roofZ);
          const br = iso(floorWidth, 0, roofZ);
          const tr = iso(floorWidth, floorDepth, roofZ);
          const tl = iso(0, floorDepth, roofZ);
          const peakFront = iso(floorWidth / 2, 0, peakZ);
          const peakBack = iso(floorWidth / 2, floorDepth, peakZ);
          return (
            <>
              <motion.line
                x1={bl.x} y1={bl.y} x2={peakFront.x} y2={peakFront.y}
                stroke="rgba(255,224,194,0.10)" strokeWidth="1"
                variants={draw} custom={14}
              />
              <motion.line
                x1={br.x} y1={br.y} x2={peakFront.x} y2={peakFront.y}
                stroke="rgba(255,224,194,0.10)" strokeWidth="1"
                variants={draw} custom={14}
              />
              <motion.line
                x1={tl.x} y1={tl.y} x2={peakBack.x} y2={peakBack.y}
                stroke="rgba(255,224,194,0.10)" strokeWidth="1"
                variants={draw} custom={15}
              />
              <motion.line
                x1={tr.x} y1={tr.y} x2={peakBack.x} y2={peakBack.y}
                stroke="rgba(255,224,194,0.10)" strokeWidth="1"
                variants={draw} custom={15}
              />
              <motion.line
                x1={peakFront.x} y1={peakFront.y} x2={peakBack.x} y2={peakBack.y}
                stroke="rgba(255,224,194,0.12)" strokeWidth="1"
                variants={draw} custom={16}
              />
            </>
          );
        })()}

        {/* Secondary smaller building */}
        {(() => {
          const ox = 200;
          const oy = 40;
          const w2 = 60;
          const d2 = 50;
          const smallFloors = [0, 35, 70];
          return smallFloors.map((fz, fi) => {
            const bl = iso(ox, oy, fz);
            const br = iso(ox + w2, oy, fz);
            const tr = iso(ox + w2, oy + d2, fz);
            const tl = iso(ox, oy + d2, fz);
            return (
              <g key={`small-floor-${fi}`}>
                <motion.polygon
                  points={`${bl.x},${bl.y} ${br.x},${br.y} ${tr.x},${tr.y} ${tl.x},${tl.y}`}
                  stroke="rgba(255,224,194,0.08)"
                  strokeWidth="0.8"
                  fill="rgba(255,224,194,0.01)"
                  variants={draw}
                  custom={17 + fi * 2}
                />
                {fi < smallFloors.length - 1 &&
                  [
                    [ox, oy],
                    [ox + w2, oy],
                    [ox + w2, oy + d2],
                    [ox, oy + d2],
                  ].map(([cx, cy], ci) => {
                    const bottom = iso(cx, cy, fz);
                    const top = iso(cx, cy, fz + 35);
                    return (
                      <motion.line
                        key={`scol-${fi}-${ci}`}
                        x1={bottom.x} y1={bottom.y}
                        x2={top.x} y2={top.y}
                        stroke="rgba(255,224,194,0.08)"
                        strokeWidth="0.8"
                        variants={draw}
                        custom={18 + fi * 2}
                      />
                    );
                  })}
              </g>
            );
          });
        })()}

        {/* Ground reference line */}
        <motion.line
          x1="200" y1="260" x2="1000" y2="260"
          stroke="rgba(255,224,194,0.06)"
          strokeWidth="0.5"
          strokeDasharray="4 8"
          variants={draw}
          custom={24}
        />
      </motion.svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 3. ArchitecturalCrossSection
// ─────────────────────────────────────────────────────────
export function ArchitecturalCrossSection() {
  return (
    <div className="w-full flex items-center justify-center py-8">
      <motion.svg
        viewBox="0 0 1200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-6xl"
        style={{ height: 200 }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <defs>
          <pattern
            id="cs-hatch-ground"
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
            patternTransform="rotate(45)"
          >
            <line
              x1="0" y1="0" x2="0" y2="8"
              stroke="rgba(255,224,194,0.06)"
              strokeWidth="0.5"
            />
          </pattern>
          <pattern
            id="cs-hatch-concrete"
            patternUnits="userSpaceOnUse"
            width="5"
            height="5"
            patternTransform="rotate(-45)"
          >
            <line
              x1="0" y1="0" x2="0" y2="5"
              stroke="rgba(255,224,194,0.06)"
              strokeWidth="0.5"
            />
          </pattern>
          <pattern
            id="cs-hatch-insulation"
            patternUnits="userSpaceOnUse"
            width="12"
            height="12"
          >
            <path
              d="M 0 6 Q 3 0 6 6 Q 9 12 12 6"
              stroke="rgba(255,224,194,0.06)"
              strokeWidth="0.5"
              fill="none"
            />
          </pattern>
        </defs>

        {/* Ground / earth */}
        <motion.rect
          x="100" y="150" width="1000" height="30"
          fill="url(#cs-hatch-ground)"
          stroke="rgba(255,224,194,0.06)"
          strokeWidth="0.5"
          variants={fadeIn}
          custom={0}
        />
        <motion.line
          x1="100" y1="150" x2="1100" y2="150"
          stroke="rgba(255,224,194,0.10)"
          strokeWidth="1.5"
          variants={draw}
          custom={0}
        />

        {/* Foundation */}
        <motion.rect
          x="220" y="140" width="760" height="15"
          fill="url(#cs-hatch-concrete)"
          stroke="rgba(255,224,194,0.10)"
          strokeWidth="1"
          variants={draw}
          custom={1}
        />
        {/* Foundation footings */}
        <motion.rect
          x="200" y="148" width="80" height="8"
          stroke="rgba(255,224,194,0.08)"
          strokeWidth="0.8"
          fill="url(#cs-hatch-concrete)"
          variants={draw}
          custom={2}
        />
        <motion.rect
          x="520" y="148" width="80" height="8"
          stroke="rgba(255,224,194,0.08)"
          strokeWidth="0.8"
          fill="url(#cs-hatch-concrete)"
          variants={draw}
          custom={2}
        />
        <motion.rect
          x="900" y="148" width="80" height="8"
          stroke="rgba(255,224,194,0.08)"
          strokeWidth="0.8"
          fill="url(#cs-hatch-concrete)"
          variants={draw}
          custom={2}
        />

        {/* Ground floor slab */}
        <motion.rect
          x="220" y="120" width="760" height="8"
          stroke="rgba(255,224,194,0.10)"
          strokeWidth="1"
          fill="url(#cs-hatch-concrete)"
          variants={draw}
          custom={3}
        />

        {/* Basement walls */}
        <motion.line
          x1="230" y1="120" x2="230" y2="140"
          stroke="rgba(255,224,194,0.10)" strokeWidth="1.5"
          variants={draw} custom={2}
        />
        <motion.line
          x1="970" y1="120" x2="970" y2="140"
          stroke="rgba(255,224,194,0.10)" strokeWidth="1.5"
          variants={draw} custom={2}
        />

        {/* Ground floor walls */}
        <motion.line
          x1="230" y1="78" x2="230" y2="120"
          stroke="rgba(255,224,194,0.12)" strokeWidth="2"
          variants={draw} custom={4}
        />
        <motion.line
          x1="970" y1="78" x2="970" y2="120"
          stroke="rgba(255,224,194,0.12)" strokeWidth="2"
          variants={draw} custom={4}
        />
        {/* Interior wall */}
        <motion.line
          x1="560" y1="78" x2="560" y2="120"
          stroke="rgba(255,224,194,0.08)" strokeWidth="1.5"
          variants={draw} custom={5}
        />

        {/* First floor slab */}
        <motion.rect
          x="220" y="74" width="760" height="6"
          stroke="rgba(255,224,194,0.10)"
          strokeWidth="1"
          fill="url(#cs-hatch-concrete)"
          variants={draw}
          custom={6}
        />

        {/* First floor walls */}
        <motion.line
          x1="230" y1="38" x2="230" y2="74"
          stroke="rgba(255,224,194,0.12)" strokeWidth="2"
          variants={draw} custom={7}
        />
        <motion.line
          x1="970" y1="38" x2="970" y2="74"
          stroke="rgba(255,224,194,0.12)" strokeWidth="2"
          variants={draw} custom={7}
        />
        <motion.line
          x1="600" y1="38" x2="600" y2="74"
          stroke="rgba(255,224,194,0.08)" strokeWidth="1.5"
          variants={draw} custom={8}
        />

        {/* Insulation on first floor walls */}
        <motion.rect
          x="232" y="40" width="8" height="34"
          fill="url(#cs-hatch-insulation)"
          variants={fadeIn}
          custom={9}
        />
        <motion.rect
          x="960" y="40" width="8" height="34"
          fill="url(#cs-hatch-insulation)"
          variants={fadeIn}
          custom={9}
        />

        {/* Roof structure - top slab */}
        <motion.rect
          x="220" y="34" width="760" height="5"
          stroke="rgba(255,224,194,0.08)"
          strokeWidth="0.8"
          fill="url(#cs-hatch-concrete)"
          variants={draw}
          custom={10}
        />

        {/* Pitched roof */}
        <motion.line
          x1="200" y1="34" x2="600" y2="8"
          stroke="rgba(255,224,194,0.12)" strokeWidth="1.5"
          variants={draw} custom={11}
        />
        <motion.line
          x1="600" y1="8" x2="990" y2="34"
          stroke="rgba(255,224,194,0.12)" strokeWidth="1.5"
          variants={draw} custom={11}
        />

        {/* Roof trusses */}
        {[300, 450, 750, 900].map((x, i) => {
          const roofY = 34 - (34 - 8) * (1 - Math.abs(x - 600) / 400);
          return (
            <motion.line
              key={`truss-${i}`}
              x1={x} y1="34"
              x2={x} y2={roofY}
              stroke="rgba(255,224,194,0.06)"
              strokeWidth="0.6"
              variants={draw}
              custom={12 + i * 0.5}
            />
          );
        })}

        {/* Roof ridge beam */}
        <motion.line
          x1="350" y1="18" x2="850" y2="18"
          stroke="rgba(255,224,194,0.06)"
          strokeWidth="0.5"
          strokeDasharray="3 3"
          variants={draw}
          custom={14}
        />

        {/* Windows in cross-section */}
        <motion.rect
          x="350" y="85" width="40" height="30"
          stroke="rgba(255,224,194,0.07)"
          strokeWidth="0.8"
          variants={draw}
          custom={8}
        />
        <motion.line
          x1="370" y1="85" x2="370" y2="115"
          stroke="rgba(255,224,194,0.06)"
          strokeWidth="0.5"
          variants={draw}
          custom={9}
        />
        <motion.rect
          x="700" y="85" width="40" height="30"
          stroke="rgba(255,224,194,0.07)"
          strokeWidth="0.8"
          variants={draw}
          custom={8}
        />
        <motion.rect
          x="400" y="45" width="35" height="25"
          stroke="rgba(255,224,194,0.07)"
          strokeWidth="0.8"
          variants={draw}
          custom={10}
        />
        <motion.rect
          x="750" y="45" width="35" height="25"
          stroke="rgba(255,224,194,0.07)"
          strokeWidth="0.8"
          variants={draw}
          custom={10}
        />

        {/* Floor level labels */}
        <motion.text
          x="170" y="135"
          fill="rgba(255,224,194,0.06)"
          fontSize="6"
          textAnchor="end"
          fontFamily="monospace"
          variants={fadeIn}
          custom={15}
        >
          RDC ±0.00
        </motion.text>
        <motion.text
          x="170" y="95"
          fill="rgba(255,224,194,0.06)"
          fontSize="6"
          textAnchor="end"
          fontFamily="monospace"
          variants={fadeIn}
          custom={16}
        >
          +1 +2.80
        </motion.text>
        <motion.text
          x="170" y="55"
          fill="rgba(255,224,194,0.06)"
          fontSize="6"
          textAnchor="end"
          fontFamily="monospace"
          variants={fadeIn}
          custom={17}
        >
          +2 +5.60
        </motion.text>
        <motion.text
          x="170" y="155"
          fill="rgba(255,224,194,0.06)"
          fontSize="6"
          textAnchor="end"
          fontFamily="monospace"
          variants={fadeIn}
          custom={18}
        >
          FOND. -1.20
        </motion.text>

        {/* Level indicator dashes */}
        {[120, 78, 38].map((y, i) => (
          <motion.line
            key={`lvl-${i}`}
            x1="180" y1={y} x2="220" y2={y}
            stroke="rgba(255,224,194,0.06)"
            strokeWidth="0.5"
            strokeDasharray="2 3"
            variants={draw}
            custom={15 + i}
          />
        ))}
      </motion.svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 4. CraneConstruction
// ─────────────────────────────────────────────────────────
export function CraneConstruction() {
  return (
    <div className="w-full flex items-center justify-center py-8">
      <motion.svg
        viewBox="0 0 1200 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-6xl"
        style={{ height: 250 }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Ground line */}
        <motion.line
          x1="100" y1="200" x2="1100" y2="200"
          stroke="rgba(255,224,194,0.06)"
          strokeWidth="0.8"
          variants={draw}
          custom={0}
        />

        {/* Crane base */}
        <motion.rect
          x="340" y="190" width="40" height="10"
          stroke="rgba(255,224,194,0.10)"
          strokeWidth="1"
          fill="rgba(255,224,194,0.03)"
          variants={draw}
          custom={1}
        />

        {/* Crane tower (vertical mast) */}
        <motion.line
          x1="355" y1="190" x2="355" y2="25"
          stroke="rgba(255,224,194,0.12)"
          strokeWidth="1.5"
          variants={draw}
          custom={2}
        />
        <motion.line
          x1="365" y1="190" x2="365" y2="25"
          stroke="rgba(255,224,194,0.12)"
          strokeWidth="1.5"
          variants={draw}
          custom={2}
        />

        {/* Mast lattice cross-bracing */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <g key={`mast-brace-${i}`}>
            <motion.line
              x1="355" y1={190 - i * 24}
              x2="365" y2={190 - (i + 1) * 24}
              stroke="rgba(255,224,194,0.06)"
              strokeWidth="0.5"
              variants={draw}
              custom={2 + i * 0.15}
            />
            <motion.line
              x1="365" y1={190 - i * 24}
              x2="355" y2={190 - (i + 1) * 24}
              stroke="rgba(255,224,194,0.06)"
              strokeWidth="0.5"
              variants={draw}
              custom={2 + i * 0.15}
            />
          </g>
        ))}

        {/* Crane cab */}
        <motion.rect
          x="348" y="30" width="24" height="15"
          stroke="rgba(255,224,194,0.10)"
          strokeWidth="1"
          fill="rgba(255,224,194,0.03)"
          variants={draw}
          custom={4}
        />

        {/* Crane jib (horizontal arm) - animated swing */}
        <motion.g
          style={{ originX: "360px", originY: "28px" }}
          animate={{
            rotate: [0, 3, 0, -2, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Main jib boom */}
          <motion.line
            x1="360" y1="28"
            x2="650" y2="28"
            stroke="rgba(255,224,194,0.12)"
            strokeWidth="1.2"
            variants={draw}
            custom={5}
          />
          <motion.line
            x1="360" y1="22"
            x2="650" y2="22"
            stroke="rgba(255,224,194,0.08)"
            strokeWidth="0.8"
            variants={draw}
            custom={5}
          />

          {/* Jib lattice */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <motion.line
              key={`jib-lat-${i}`}
              x1={380 + i * 30} y1="22"
              x2={380 + i * 30} y2="28"
              stroke="rgba(255,224,194,0.06)"
              strokeWidth="0.5"
              variants={draw}
              custom={5.5 + i * 0.1}
            />
          ))}

          {/* Counter-jib (shorter, behind) */}
          <motion.line
            x1="360" y1="25"
            x2="260" y2="25"
            stroke="rgba(255,224,194,0.10)"
            strokeWidth="1"
            variants={draw}
            custom={5}
          />

          {/* Counter-weight */}
          <motion.rect
            x="255" y="20" width="20" height="14"
            stroke="rgba(255,224,194,0.08)"
            strokeWidth="0.8"
            fill="rgba(255,224,194,0.03)"
            variants={draw}
            custom={6}
          />

          {/* Top tower / cat head */}
          <motion.line
            x1="360" y1="22" x2="360" y2="12"
            stroke="rgba(255,224,194,0.10)"
            strokeWidth="1"
            variants={draw}
            custom={4}
          />

          {/* Tension cables */}
          <motion.line
            x1="360" y1="12" x2="650" y2="22"
            stroke="rgba(255,224,194,0.06)"
            strokeWidth="0.5"
            variants={draw}
            custom={6}
          />
          <motion.line
            x1="360" y1="12" x2="260" y2="22"
            stroke="rgba(255,224,194,0.06)"
            strokeWidth="0.5"
            variants={draw}
            custom={6}
          />

          {/* Hook cable - with pendulum */}
          <motion.g
            animate={{
              rotate: [0, 2, -2, 1, -1, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ originX: "560px", originY: "28px" }}
          >
            <motion.line
              x1="560" y1="28"
              x2="560" y2="100"
              stroke="rgba(255,224,194,0.08)"
              strokeWidth="0.6"
              variants={draw}
              custom={7}
            />
            {/* Hook */}
            <motion.path
              d="M 555 100 L 560 100 L 560 110 Q 560 116 555 116 Q 550 116 550 110 L 550 107"
              stroke="rgba(255,224,194,0.10)"
              strokeWidth="0.8"
              variants={draw}
              custom={8}
            />
          </motion.g>
        </motion.g>

        {/* Half-built building next to crane */}
        {/* Foundation */}
        <motion.rect
          x="650" y="185" width="250" height="15"
          stroke="rgba(255,224,194,0.08)"
          strokeWidth="1"
          fill="rgba(255,224,194,0.02)"
          variants={draw}
          custom={3}
        />

        {/* Completed floors */}
        {[0, 1, 2].map((fi) => (
          <g key={`built-floor-${fi}`}>
            <motion.rect
              x="660" y={170 - fi * 35} width="230" height="35"
              stroke="rgba(255,224,194,0.10)"
              strokeWidth="1"
              fill="rgba(255,224,194,0.01)"
              variants={draw}
              custom={4 + fi}
            />
            {/* Windows */}
            {[0, 1, 2, 3].map((wi) => (
              <motion.rect
                key={`bwin-${fi}-${wi}`}
                x={675 + wi * 55} y={175 - fi * 35 - 25}
                width="20" height="18"
                stroke="rgba(255,224,194,0.06)"
                strokeWidth="0.5"
                variants={draw}
                custom={5 + fi + wi * 0.2}
              />
            ))}
          </g>
        ))}

        {/* Incomplete top floor - partial walls */}
        <motion.line
          x1="660" y1="65" x2="660" y2="50"
          stroke="rgba(255,224,194,0.08)"
          strokeWidth="1"
          strokeDasharray="3 3"
          variants={draw}
          custom={9}
        />
        <motion.line
          x1="660" y1="65" x2="800" y2="65"
          stroke="rgba(255,224,194,0.08)"
          strokeWidth="1"
          strokeDasharray="3 3"
          variants={draw}
          custom={9}
        />
        <motion.line
          x1="890" y1="65" x2="890" y2="55"
          stroke="rgba(255,224,194,0.08)"
          strokeWidth="1"
          strokeDasharray="3 3"
          variants={draw}
          custom={10}
        />

        {/* Rebar sticking up (unfinished) */}
        {[680, 720, 760, 850, 870].map((x, i) => (
          <motion.line
            key={`rebar-${i}`}
            x1={x} y1="65" x2={x} y2="45"
            stroke="rgba(255,224,194,0.06)"
            strokeWidth="0.4"
            variants={draw}
            custom={10 + i * 0.2}
          />
        ))}

        {/* Scaffolding on right side of building */}
        {[0, 1, 2, 3].map((i) => (
          <g key={`scaffold-${i}`}>
            <motion.line
              x1="900" y1={185 - i * 35}
              x2="920" y2={185 - i * 35}
              stroke="rgba(255,224,194,0.06)"
              strokeWidth="0.5"
              variants={draw}
              custom={7 + i * 0.3}
            />
            <motion.line
              x1="920" y1={185 - i * 35}
              x2="920" y2={185 - (i + 1) * 35}
              stroke="rgba(255,224,194,0.06)"
              strokeWidth="0.5"
              variants={draw}
              custom={7 + i * 0.3}
            />
            <motion.line
              x1="900" y1={185 - i * 35}
              x2="920" y2={185 - (i + 1) * 35}
              stroke="rgba(255,224,194,0.06)"
              strokeWidth="0.4"
              variants={draw}
              custom={7.5 + i * 0.3}
            />
          </g>
        ))}

        {/* Small worker figure on top floor */}
        <motion.circle
          cx="780" cy="58"
          r="2"
          stroke="rgba(255,224,194,0.08)"
          strokeWidth="0.5"
          variants={draw}
          custom={12}
        />
        <motion.line
          x1="780" y1="60" x2="780" y2="65"
          stroke="rgba(255,224,194,0.08)"
          strokeWidth="0.5"
          variants={draw}
          custom={12}
        />
      </motion.svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 5. CityPanorama
// ─────────────────────────────────────────────────────────
export function CityPanorama() {
  const buildings = [
    { x: 60, w: 45, h: 70, style: "flat" },
    { x: 110, w: 35, h: 100, style: "antenna" },
    { x: 155, w: 55, h: 55, style: "flat" },
    { x: 220, w: 30, h: 120, style: "pointed" },
    { x: 260, w: 60, h: 85, style: "flat" },
    { x: 330, w: 40, h: 130, style: "antenna" },
    { x: 380, w: 50, h: 65, style: "pointed" },
    { x: 440, w: 35, h: 95, style: "flat" },
    { x: 485, w: 55, h: 140, style: "antenna" },
    { x: 550, w: 40, h: 75, style: "flat" },
    { x: 600, w: 45, h: 110, style: "pointed" },
    { x: 655, w: 30, h: 60, style: "flat" },
    { x: 695, w: 50, h: 90, style: "antenna" },
    { x: 755, w: 38, h: 105, style: "pointed" },
    { x: 800, w: 55, h: 50, style: "flat" },
  ];

  const groundY = 150;

  return (
    <div className="w-full flex items-center justify-center py-8">
      <motion.svg
        viewBox="0 0 920 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-6xl"
        style={{ height: 160 }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Ground line */}
        <motion.line
          x1="30" y1={groundY}
          x2="890" y2={groundY}
          stroke="rgba(255,224,194,0.06)"
          strokeWidth="0.8"
          variants={draw}
          custom={0}
        />

        {/* Buildings */}
        {buildings.map((b, i) => {
          const topY = groundY - b.h;
          return (
            <motion.g
              key={`building-${i}`}
              variants={riseUp}
              custom={i * 0.6 + 1}
            >
              {/* Main building body */}
              <rect
                x={b.x}
                y={topY}
                width={b.w}
                height={b.h}
                stroke="rgba(255,224,194,0.10)"
                strokeWidth="0.8"
                fill="rgba(255,224,194,0.02)"
              />

              {/* Top features based on style */}
              {b.style === "pointed" && (
                <polygon
                  points={`${b.x},${topY} ${b.x + b.w / 2},${topY - 15} ${b.x + b.w},${topY}`}
                  stroke="rgba(255,224,194,0.08)"
                  strokeWidth="0.6"
                  fill="none"
                />
              )}
              {b.style === "antenna" && (
                <>
                  <line
                    x1={b.x + b.w / 2} y1={topY}
                    x2={b.x + b.w / 2} y2={topY - 18}
                    stroke="rgba(255,224,194,0.08)"
                    strokeWidth="0.5"
                  />
                  <line
                    x1={b.x + b.w / 2 - 4} y1={topY - 12}
                    x2={b.x + b.w / 2 + 4} y2={topY - 12}
                    stroke="rgba(255,224,194,0.06)"
                    strokeWidth="0.4"
                  />
                  <circle
                    cx={b.x + b.w / 2} cy={topY - 18}
                    r="1.2"
                    fill="rgba(255,224,194,0.08)"
                  />
                </>
              )}

              {/* Window rows */}
              {Array.from({ length: Math.floor(b.h / 18) }).map((_, ri) => {
                const windowCount = Math.max(1, Math.floor(b.w / 16));
                const windowW = Math.min(8, (b.w - 10) / windowCount - 3);
                const startX = b.x + (b.w - windowCount * (windowW + 4)) / 2 + 2;
                return Array.from({ length: windowCount }).map((_, wi) => (
                  <rect
                    key={`w-${i}-${ri}-${wi}`}
                    x={startX + wi * (windowW + 4)}
                    y={topY + 8 + ri * 18}
                    width={windowW}
                    height={8}
                    stroke="rgba(255,224,194,0.06)"
                    strokeWidth="0.4"
                  />
                ));
              })}
            </motion.g>
          );
        })}

        {/* Distant background buildings (even subtler) */}
        {[
          { x: 40, w: 30, h: 35 },
          { x: 185, w: 25, h: 45 },
          { x: 350, w: 20, h: 30 },
          { x: 510, w: 25, h: 40 },
          { x: 680, w: 20, h: 35 },
          { x: 830, w: 30, h: 28 },
        ].map((b, i) => (
          <motion.rect
            key={`bg-${i}`}
            x={b.x} y={groundY - b.h}
            width={b.w} height={b.h}
            stroke="rgba(255,224,194,0.06)"
            strokeWidth="0.5"
            fill="rgba(255,224,194,0.01)"
            variants={riseUp}
            custom={i * 0.4}
          />
        ))}
      </motion.svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 6. CompassRose
// ─────────────────────────────────────────────────────────
export function CompassRose() {
  return (
    <div className="w-full flex items-center justify-center py-8">
      <motion.svg
        viewBox="0 0 200 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="max-w-[200px]"
        style={{ height: 120 }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <motion.g
          initial={{ rotate: -180, opacity: 0 }}
          whileInView={{ rotate: 0, opacity: 1 }}
          transition={{
            duration: 1.6,
            ease: easeOutQuart,
          }}
          viewport={{ once: true }}
          style={{ originX: "100px", originY: "60px" }}
        >
          {/* Outer circle */}
          <motion.circle
            cx="100" cy="60" r="48"
            stroke="rgba(255,224,194,0.08)"
            strokeWidth="0.8"
            variants={draw}
            custom={0}
          />

          {/* Inner circle */}
          <motion.circle
            cx="100" cy="60" r="35"
            stroke="rgba(255,224,194,0.06)"
            strokeWidth="0.5"
            variants={draw}
            custom={1}
          />

          {/* Innermost circle */}
          <motion.circle
            cx="100" cy="60" r="6"
            stroke="rgba(255,224,194,0.10)"
            strokeWidth="0.8"
            variants={draw}
            custom={2}
          />

          {/* N-S main axis */}
          {/* North point (filled) */}
          <motion.polygon
            points="100,12 95,55 100,50 105,55"
            fill="rgba(255,224,194,0.10)"
            stroke="rgba(255,224,194,0.12)"
            strokeWidth="0.5"
            variants={draw}
            custom={3}
          />
          {/* South point (outline) */}
          <motion.polygon
            points="100,108 95,65 100,70 105,65"
            fill="none"
            stroke="rgba(255,224,194,0.08)"
            strokeWidth="0.5"
            variants={draw}
            custom={3}
          />

          {/* E-W axis */}
          {/* East point */}
          <motion.polygon
            points="148,60 105,55 110,60 105,65"
            fill="none"
            stroke="rgba(255,224,194,0.08)"
            strokeWidth="0.5"
            variants={draw}
            custom={4}
          />
          {/* West point */}
          <motion.polygon
            points="52,60 95,55 90,60 95,65"
            fill="none"
            stroke="rgba(255,224,194,0.08)"
            strokeWidth="0.5"
            variants={draw}
            custom={4}
          />

          {/* NE-SW axis (shorter) */}
          <motion.line
            x1="130" y1="30" x2="108" y2="52"
            stroke="rgba(255,224,194,0.06)"
            strokeWidth="0.5"
            variants={draw}
            custom={5}
          />
          <motion.line
            x1="70" y1="90" x2="92" y2="68"
            stroke="rgba(255,224,194,0.06)"
            strokeWidth="0.5"
            variants={draw}
            custom={5}
          />

          {/* NW-SE axis (shorter) */}
          <motion.line
            x1="70" y1="30" x2="92" y2="52"
            stroke="rgba(255,224,194,0.06)"
            strokeWidth="0.5"
            variants={draw}
            custom={6}
          />
          <motion.line
            x1="130" y1="90" x2="108" y2="68"
            stroke="rgba(255,224,194,0.06)"
            strokeWidth="0.5"
            variants={draw}
            custom={6}
          />

          {/* Degree tick marks around outer circle */}
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = (i * 10 * Math.PI) / 180;
            const outerR = 48;
            const innerR = i % 9 === 0 ? 43 : 46;
            return (
              <motion.line
                key={`tick-${i}`}
                x1={100 + Math.sin(angle) * innerR}
                y1={60 - Math.cos(angle) * innerR}
                x2={100 + Math.sin(angle) * outerR}
                y2={60 - Math.cos(angle) * outerR}
                stroke="rgba(255,224,194,0.06)"
                strokeWidth={i % 9 === 0 ? "0.8" : "0.3"}
                variants={draw}
                custom={7 + i * 0.05}
              />
            );
          })}

          {/* Cardinal direction labels */}
          <motion.text
            x="100" y="8"
            fill="rgba(255,224,194,0.12)"
            fontSize="8"
            textAnchor="middle"
            fontFamily="monospace"
            fontWeight="bold"
            variants={fadeIn}
            custom={10}
          >
            N
          </motion.text>
          <motion.text
            x="100" y="116"
            fill="rgba(255,224,194,0.07)"
            fontSize="6"
            textAnchor="middle"
            fontFamily="monospace"
            variants={fadeIn}
            custom={11}
          >
            S
          </motion.text>
          <motion.text
            x="155" y="63"
            fill="rgba(255,224,194,0.07)"
            fontSize="6"
            textAnchor="middle"
            fontFamily="monospace"
            variants={fadeIn}
            custom={12}
          >
            E
          </motion.text>
          <motion.text
            x="45" y="63"
            fill="rgba(255,224,194,0.07)"
            fontSize="6"
            textAnchor="middle"
            fontFamily="monospace"
            variants={fadeIn}
            custom={13}
          >
            O
          </motion.text>
        </motion.g>
      </motion.svg>
    </div>
  );
}
