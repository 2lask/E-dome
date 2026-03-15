"use client";

import { motion } from "framer-motion";

const draw = {
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

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { delay: i * 0.06 + 0.8, duration: 0.6 },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.06 + 0.6, duration: 0.5, ease: "backOut" as const },
  }),
};

const slideUp = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06 + 0.5, duration: 0.5 },
  }),
};

export default function ArchitecturalBlueprint() {
  return (
    <motion.svg
      viewBox="0 0 900 620"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <defs>
        {/* Hatching patterns */}
        <pattern id="concreteHatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        </pattern>
        <pattern id="concreteHatchDense" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
        </pattern>
        <pattern id="insulationDots" patternUnits="userSpaceOnUse" width="8" height="8">
          <circle cx="2" cy="2" r="0.8" fill="rgba(255,255,255,0.06)" />
          <circle cx="6" cy="6" r="0.8" fill="rgba(255,255,255,0.06)" />
        </pattern>
        <pattern id="groundHatch" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(-30)">
          <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        </pattern>
        <radialGradient id="blueprintGlow" cx="50%" cy="35%" r="45%">
          <stop offset="0%" stopColor="rgba(102,126,234,0.07)" />
          <stop offset="100%" stopColor="rgba(102,126,234,0)" />
        </radialGradient>
      </defs>

      <rect x={0} y={0} width={900} height={620} fill="url(#blueprintGlow)" />

      {/* Grid lines - subtle background */}
      {Array.from({ length: 19 }).map((_, i) => (
        <motion.line
          key={`vg-${i}`}
          x1={i * 50} y1={0} x2={i * 50} y2={620}
          stroke="rgba(102,126,234,0.03)"
          strokeWidth={0.5}
          custom={0}
          variants={fadeIn}
        />
      ))}
      {Array.from({ length: 13 }).map((_, i) => (
        <motion.line
          key={`hg-${i}`}
          x1={0} y1={i * 50} x2={900} y2={i * 50}
          stroke="rgba(102,126,234,0.03)"
          strokeWidth={0.5}
          custom={0}
          variants={fadeIn}
        />
      ))}

      {/* ===== ELEVATION 1: NORTH - Front elevation ===== */}

      {/* Ground line */}
      <motion.line
        x1={40} y1={230} x2={580} y2={230}
        stroke="rgba(255,255,255,0.3)"
        strokeWidth={0.5}
        strokeDasharray="4 4"
        custom={1}
        variants={draw}
      />

      {/* Ground hatching below ground line */}
      <motion.rect
        x={40} y={230} width={540} height={12}
        fill="url(#groundHatch)"
        custom={2}
        variants={fadeIn}
      />

      {/* Foundation / Base platform */}
      <motion.path
        d="M 80 230 L 80 222 L 540 222 L 540 230"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth={0.8}
        custom={2}
        variants={draw}
      />
      {/* Foundation hatching */}
      <motion.rect
        x={80} y={222} width={460} height={8}
        fill="url(#concreteHatchDense)"
        custom={2}
        variants={fadeIn}
      />

      {/* Main structure - left wing */}
      <motion.path
        d="M 90 222 L 90 152 L 300 152 L 300 222"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth={1}
        custom={3}
        variants={draw}
      />

      {/* Wall thickness - left wing (double line) */}
      <motion.path
        d="M 95 222 L 95 157 L 295 157 L 295 222"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={0.4}
        custom={3}
        variants={draw}
      />

      {/* Main structure - right wing (higher) */}
      <motion.path
        d="M 310 222 L 310 115 L 530 115 L 530 222"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth={1}
        custom={4}
        variants={draw}
      />

      {/* Wall thickness - right wing */}
      <motion.path
        d="M 315 222 L 315 120 L 525 120 L 525 222"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={0.4}
        custom={4}
        variants={draw}
      />

      {/* Interior wall - left wing */}
      <motion.line
        x1={200} y1={157} x2={200} y2={222}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth={0.5}
        custom={5}
        variants={draw}
      />

      {/* Interior wall - right wing */}
      <motion.line
        x1={430} y1={120} x2={430} y2={222}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth={0.5}
        custom={5}
        variants={draw}
      />

      {/* Flat roof - left wing with material layers */}
      <motion.path
        d="M 75 152 L 90 142 L 305 142 L 305 152"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth={0.8}
        custom={5}
        variants={draw}
      />
      {/* Roof insulation layer */}
      <motion.rect
        x={90} y={142} width={215} height={10}
        fill="url(#insulationDots)"
        custom={6}
        variants={fadeIn}
      />
      {/* Roof membrane line */}
      <motion.line
        x1={88} y1={140} x2={307} y2={140}
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={0.3}
        custom={5}
        variants={draw}
      />

      {/* Flat roof - right wing with layers */}
      <motion.path
        d="M 300 115 L 305 105 L 540 105 L 545 115"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth={0.8}
        custom={6}
        variants={draw}
      />
      {/* Roof insulation - right */}
      <motion.rect
        x={310} y={105} width={230} height={10}
        fill="url(#insulationDots)"
        custom={7}
        variants={fadeIn}
      />
      {/* Roof membrane - right */}
      <motion.line
        x1={303} y1={103} x2={542} y2={103}
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={0.3}
        custom={6}
        variants={draw}
      />

      {/* Roof overhang details */}
      <motion.line
        x1={72} y1={142} x2={72} y2={152}
        stroke="rgba(255,255,255,0.4)"
        strokeWidth={0.6}
        custom={5}
        variants={draw}
      />
      <motion.line
        x1={545} y1={105} x2={545} y2={115}
        stroke="rgba(255,255,255,0.4)"
        strokeWidth={0.6}
        custom={6}
        variants={draw}
      />

      {/* Roof detail callout - material layers (top-right of right wing roof) */}
      <motion.g custom={8} variants={fadeIn}>
        {/* Callout line */}
        <line x1={500} y1={105} x2={555} y2={78} stroke="rgba(255,255,255,0.15)" strokeWidth={0.4} />
        <line x1={555} y1={78} x2={575} y2={78} stroke="rgba(255,255,255,0.15)" strokeWidth={0.4} />
        {/* Zoomed detail box */}
        <rect x={555} y={60} width={35} height={18} stroke="rgba(255,255,255,0.15)" strokeWidth={0.3} fill="none" />
        {/* Layers in detail */}
        <line x1={555} y1={63} x2={590} y2={63} stroke="rgba(255,255,255,0.2)" strokeWidth={0.5} />
        <line x1={555} y1={67} x2={590} y2={67} stroke="rgba(255,255,255,0.12)" strokeWidth={0.3} />
        <line x1={555} y1={71} x2={590} y2={71} stroke="rgba(255,255,255,0.12)" strokeWidth={0.3} />
        <line x1={555} y1={75} x2={590} y2={75} stroke="rgba(255,255,255,0.2)" strokeWidth={0.5} />
        {/* Insulation dots in detail */}
        <circle cx={562} cy={69} r={0.6} fill="rgba(255,255,255,0.15)" />
        <circle cx={570} cy={73} r={0.6} fill="rgba(255,255,255,0.15)" />
        <circle cx={578} cy={69} r={0.6} fill="rgba(255,255,255,0.15)" />
        <circle cx={585} cy={73} r={0.6} fill="rgba(255,255,255,0.15)" />
      </motion.g>

      {/* Windows - left wing with mullion details */}
      {/* Window 1 */}
      <motion.rect
        x={110} y={163} width={40} height={42}
        stroke="rgba(102,126,234,0.6)"
        strokeWidth={0.7}
        custom={7}
        variants={draw}
      />
      {/* Mullion cross */}
      <motion.line x1={130} y1={163} x2={130} y2={205} stroke="rgba(102,126,234,0.3)" strokeWidth={0.4} custom={7} variants={draw} />
      <motion.line x1={110} y1={184} x2={150} y2={184} stroke="rgba(102,126,234,0.3)" strokeWidth={0.4} custom={7} variants={draw} />

      {/* Window 2 */}
      <motion.rect
        x={160} y={163} width={30} height={42}
        stroke="rgba(102,126,234,0.6)"
        strokeWidth={0.7}
        custom={8}
        variants={draw}
      />
      <motion.line x1={175} y1={163} x2={175} y2={205} stroke="rgba(102,126,234,0.3)" strokeWidth={0.4} custom={8} variants={draw} />
      <motion.line x1={160} y1={184} x2={190} y2={184} stroke="rgba(102,126,234,0.3)" strokeWidth={0.4} custom={8} variants={draw} />

      {/* Large panoramic window - center */}
      <motion.rect
        x={220} y={160} width={65} height={48}
        stroke="rgba(102,126,234,0.7)"
        strokeWidth={0.8}
        custom={9}
        variants={draw}
      />
      <motion.line x1={242} y1={160} x2={242} y2={208} stroke="rgba(102,126,234,0.3)" strokeWidth={0.4} custom={9} variants={draw} />
      <motion.line x1={264} y1={160} x2={264} y2={208} stroke="rgba(102,126,234,0.3)" strokeWidth={0.4} custom={9} variants={draw} />
      <motion.line x1={220} y1={184} x2={285} y2={184} stroke="rgba(102,126,234,0.2)" strokeWidth={0.3} custom={9} variants={draw} />

      {/* Windows - right wing (taller, floor-to-ceiling) */}
      <motion.rect
        x={330} y={128} width={45} height={75}
        stroke="rgba(102,126,234,0.7)"
        strokeWidth={0.8}
        custom={10}
        variants={draw}
      />
      <motion.line x1={352.5} y1={128} x2={352.5} y2={203} stroke="rgba(102,126,234,0.3)" strokeWidth={0.4} custom={10} variants={draw} />
      <motion.line x1={330} y1={153} x2={375} y2={153} stroke="rgba(102,126,234,0.2)" strokeWidth={0.3} custom={10} variants={draw} />
      <motion.line x1={330} y1={178} x2={375} y2={178} stroke="rgba(102,126,234,0.2)" strokeWidth={0.3} custom={10} variants={draw} />

      <motion.rect
        x={385} y={128} width={35} height={75}
        stroke="rgba(102,126,234,0.7)"
        strokeWidth={0.8}
        custom={11}
        variants={draw}
      />
      <motion.line x1={402.5} y1={128} x2={402.5} y2={203} stroke="rgba(102,126,234,0.3)" strokeWidth={0.4} custom={11} variants={draw} />
      <motion.line x1={385} y1={153} x2={420} y2={153} stroke="rgba(102,126,234,0.2)" strokeWidth={0.3} custom={11} variants={draw} />
      <motion.line x1={385} y1={178} x2={420} y2={178} stroke="rgba(102,126,234,0.2)" strokeWidth={0.3} custom={11} variants={draw} />

      {/* Door - right wing */}
      <motion.rect
        x={460} y={158} width={35} height={64}
        stroke="rgba(255,255,255,0.5)"
        strokeWidth={0.7}
        custom={12}
        variants={draw}
      />
      {/* Door handle */}
      <motion.circle cx={490} cy={192} r={1.5} stroke="rgba(102,126,234,0.5)" strokeWidth={0.5} custom={12} variants={draw} />
      {/* Door threshold */}
      <motion.line x1={458} y1={222} x2={497} y2={222} stroke="rgba(255,255,255,0.4)" strokeWidth={0.8} custom={12} variants={draw} />

      {/* Small bathroom window */}
      <motion.rect
        x={505} y={168} width={15} height={20}
        stroke="rgba(102,126,234,0.4)"
        strokeWidth={0.5}
        custom={13}
        variants={draw}
      />
      <motion.line x1={512.5} y1={168} x2={512.5} y2={188} stroke="rgba(102,126,234,0.2)" strokeWidth={0.3} custom={13} variants={draw} />


      {/* ===== ELEVATION 2: SOUTH - Back elevation ===== */}

      {/* Separator line */}
      <motion.line
        x1={40} y1={265} x2={580} y2={265}
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={0.5}
        custom={14}
        variants={draw}
      />

      {/* Ground with slope */}
      <motion.path
        d="M 40 410 Q 150 406 280 400 Q 420 392 520 405 L 580 408"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth={0.5}
        custom={14}
        variants={draw}
      />

      {/* Ground fill */}
      <motion.rect
        x={40} y={410} width={540} height={10}
        fill="url(#groundHatch)"
        custom={15}
        variants={fadeIn}
      />

      {/* Foundation on slope */}
      <motion.path
        d="M 95 400 L 95 393 L 525 390 L 525 405"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth={0.6}
        custom={15}
        variants={draw}
      />
      {/* Foundation hatching */}
      <motion.rect
        x={95} y={390} width={430} height={10}
        fill="url(#concreteHatchDense)"
        custom={15}
        variants={fadeIn}
      />

      {/* Main body */}
      <motion.path
        d="M 105 393 L 105 330 L 515 330 L 515 390"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth={1}
        custom={16}
        variants={draw}
      />

      {/* Interior walls visible in elevation */}
      <motion.line
        x1={210} y1={330} x2={210} y2={393}
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={0.4}
        strokeDasharray="3 3"
        custom={17}
        variants={draw}
      />
      <motion.line
        x1={350} y1={330} x2={350} y2={393}
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={0.4}
        strokeDasharray="3 3"
        custom={17}
        variants={draw}
      />

      {/* Pitched roof with modern asymmetry */}
      <motion.path
        d="M 85 330 L 230 278 L 420 275 L 535 322 L 535 330"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth={1}
        custom={17}
        variants={draw}
      />
      {/* Roof edge detail */}
      <motion.path
        d="M 85 330 L 80 330"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth={0.7}
        custom={17}
        variants={draw}
      />

      {/* Chimney */}
      <motion.path
        d="M 450 318 L 450 288 L 466 288 L 466 323"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth={0.7}
        custom={18}
        variants={draw}
      />
      {/* Chimney cap */}
      <motion.line x1={447} y1={288} x2={469} y2={288} stroke="rgba(255,255,255,0.4)" strokeWidth={0.5} custom={18} variants={draw} />

      {/* Concrete hatching on chimney */}
      <motion.rect
        x={450} y={288} width={16} height={35}
        fill="url(#concreteHatch)"
        custom={18}
        variants={fadeIn}
      />

      {/* Large panoramic windows - bottom elevation */}
      <motion.rect
        x={120} y={338} width={80} height={48}
        stroke="rgba(102,126,234,0.6)"
        strokeWidth={0.7}
        custom={19}
        variants={draw}
      />
      <motion.line x1={147} y1={338} x2={147} y2={386} stroke="rgba(102,126,234,0.3)" strokeWidth={0.4} custom={19} variants={draw} />
      <motion.line x1={173} y1={338} x2={173} y2={386} stroke="rgba(102,126,234,0.3)" strokeWidth={0.4} custom={19} variants={draw} />
      <motion.line x1={120} y1={362} x2={200} y2={362} stroke="rgba(102,126,234,0.2)" strokeWidth={0.3} custom={19} variants={draw} />

      <motion.rect
        x={220} y={335} width={110} height={52}
        stroke="rgba(102,126,234,0.7)"
        strokeWidth={0.8}
        custom={20}
        variants={draw}
      />
      <motion.line x1={257} y1={335} x2={257} y2={387} stroke="rgba(102,126,234,0.3)" strokeWidth={0.4} custom={20} variants={draw} />
      <motion.line x1={293} y1={335} x2={293} y2={387} stroke="rgba(102,126,234,0.3)" strokeWidth={0.4} custom={20} variants={draw} />
      <motion.line x1={220} y1={361} x2={330} y2={361} stroke="rgba(102,126,234,0.2)" strokeWidth={0.3} custom={20} variants={draw} />

      <motion.rect
        x={350} y={338} width={60} height={48}
        stroke="rgba(102,126,234,0.6)"
        strokeWidth={0.7}
        custom={21}
        variants={draw}
      />
      <motion.line x1={380} y1={338} x2={380} y2={386} stroke="rgba(102,126,234,0.3)" strokeWidth={0.4} custom={21} variants={draw} />
      <motion.line x1={350} y1={362} x2={410} y2={362} stroke="rgba(102,126,234,0.2)" strokeWidth={0.3} custom={21} variants={draw} />

      {/* Small windows */}
      <motion.rect
        x={430} y={348} width={25} height={35}
        stroke="rgba(102,126,234,0.5)"
        strokeWidth={0.6}
        custom={22}
        variants={draw}
      />
      <motion.line x1={442.5} y1={348} x2={442.5} y2={383} stroke="rgba(102,126,234,0.2)" strokeWidth={0.3} custom={22} variants={draw} />

      {/* Back door */}
      <motion.rect
        x={475} y={348} width={30} height={45}
        stroke="rgba(255,255,255,0.5)"
        strokeWidth={0.7}
        custom={23}
        variants={draw}
      />
      <motion.circle cx={500} cy={373} r={1.5} stroke="rgba(102,126,234,0.5)" strokeWidth={0.5} custom={23} variants={draw} />

      {/* Stairs at back door */}
      <motion.g custom={24} variants={draw}>
        <motion.line x1={473} y1={393} x2={507} y2={393} stroke="rgba(255,255,255,0.3)" strokeWidth={0.5} custom={24} variants={draw} />
        <motion.line x1={471} y1={397} x2={509} y2={397} stroke="rgba(255,255,255,0.25)" strokeWidth={0.5} custom={24} variants={draw} />
        <motion.line x1={469} y1={401} x2={511} y2={401} stroke="rgba(255,255,255,0.2)" strokeWidth={0.5} custom={24} variants={draw} />
      </motion.g>


      {/* ===== FLOOR PLAN VIEW - Right side ===== */}

      {/* Floor plan label */}
      <motion.text
        x={750} y={52}
        textAnchor="middle"
        fill="rgba(102,126,234,0.25)"
        fontSize={7}
        fontFamily="monospace"
        letterSpacing={2}
        custom={35}
        variants={slideUp}
      >
        PLAN REZ-DE-CHAUSSÉE
      </motion.text>

      {/* Outer walls of floor plan */}
      <motion.rect
        x={640} y={60} width={220} height={145}
        stroke="rgba(255,255,255,0.7)"
        strokeWidth={1.2}
        custom={15}
        variants={draw}
      />
      {/* Inner wall lines (wall thickness) */}
      <motion.rect
        x={645} y={65} width={210} height={135}
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={0.4}
        custom={15}
        variants={draw}
      />

      {/* Interior walls */}
      {/* Horizontal interior wall */}
      <motion.line x1={640} y1={132} x2={790} y2={132} stroke="rgba(255,255,255,0.5)" strokeWidth={0.8} custom={16} variants={draw} />
      <motion.line x1={640} y1={137} x2={790} y2={137} stroke="rgba(255,255,255,0.15)" strokeWidth={0.3} custom={16} variants={draw} />

      {/* Vertical interior walls */}
      <motion.line x1={730} y1={60} x2={730} y2={132} stroke="rgba(255,255,255,0.5)" strokeWidth={0.8} custom={17} variants={draw} />
      <motion.line x1={735} y1={60} x2={735} y2={132} stroke="rgba(255,255,255,0.15)" strokeWidth={0.3} custom={17} variants={draw} />

      <motion.line x1={780} y1={132} x2={780} y2={205} stroke="rgba(255,255,255,0.5)" strokeWidth={0.8} custom={18} variants={draw} />
      <motion.line x1={785} y1={132} x2={785} y2={205} stroke="rgba(255,255,255,0.15)" strokeWidth={0.3} custom={18} variants={draw} />

      {/* Bathroom wall */}
      <motion.line x1={730} y1={170} x2={780} y2={170} stroke="rgba(255,255,255,0.5)" strokeWidth={0.8} custom={19} variants={draw} />

      {/* Door openings in floor plan (arc) */}
      <motion.path
        d="M 730 110 A 18 18 0 0 1 712 128"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth={0.4}
        strokeDasharray="2 2"
        custom={20}
        variants={draw}
      />
      <motion.path
        d="M 770 132 A 15 15 0 0 0 785 147"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth={0.4}
        strokeDasharray="2 2"
        custom={21}
        variants={draw}
      />

      {/* Stairs in floor plan */}
      <motion.g custom={22} variants={fadeIn}>
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={`stair-${i}`}
            x1={735} y1={65 + i * 8}
            x2={855} y2={65 + i * 8}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={0.4}
          />
        ))}
        {/* Stair direction arrow */}
        <line x1={795} y1={100} x2={795} y2={70} stroke="rgba(255,255,255,0.2)" strokeWidth={0.4} />
        <line x1={792} y1={75} x2={795} y2={70} stroke="rgba(255,255,255,0.2)" strokeWidth={0.4} />
        <line x1={798} y1={75} x2={795} y2={70} stroke="rgba(255,255,255,0.2)" strokeWidth={0.4} />
      </motion.g>

      {/* Furniture outlines - Kitchen (bottom-left room) */}
      <motion.g custom={25} variants={fadeIn}>
        {/* Kitchen counter */}
        <rect x={648} y={140} width={45} height={5} stroke="rgba(255,255,255,0.12)" strokeWidth={0.3} fill="none" />
        {/* Sink circle */}
        <circle cx={660} cy={142.5} r={2} stroke="rgba(255,255,255,0.1)" strokeWidth={0.3} fill="none" />
        {/* Stove */}
        <rect x={675} y={140} width={10} height={5} stroke="rgba(255,255,255,0.1)" strokeWidth={0.3} fill="none" />
        <circle cx={678} cy={142.5} r={1} stroke="rgba(255,255,255,0.08)" strokeWidth={0.2} fill="none" />
        <circle cx={682} cy={142.5} r={1} stroke="rgba(255,255,255,0.08)" strokeWidth={0.2} fill="none" />
      </motion.g>

      {/* Furniture - Living room (left room) */}
      <motion.g custom={26} variants={fadeIn}>
        {/* Sofa */}
        <rect x={660} y={85} width={30} height={12} stroke="rgba(255,255,255,0.1)" strokeWidth={0.3} fill="none" rx={1} />
        {/* Coffee table */}
        <rect x={668} y={102} width={14} height={8} stroke="rgba(255,255,255,0.08)" strokeWidth={0.3} fill="none" />
      </motion.g>

      {/* Furniture - Bathroom */}
      <motion.g custom={27} variants={fadeIn}>
        {/* Toilet */}
        <rect x={740} y={175} width={8} height={10} stroke="rgba(255,255,255,0.1)" strokeWidth={0.3} fill="none" rx={1} />
        {/* Shower tray */}
        <rect x={755} y={173} width={18} height={18} stroke="rgba(255,255,255,0.1)" strokeWidth={0.3} fill="none" />
        {/* Shower drain */}
        <circle cx={764} cy={182} r={1.5} stroke="rgba(255,255,255,0.08)" strokeWidth={0.2} fill="none" />
      </motion.g>

      {/* Furniture - Bedroom */}
      <motion.g custom={28} variants={fadeIn}>
        {/* Bed */}
        <rect x={790} y={145} width={22} height={16} stroke="rgba(255,255,255,0.1)" strokeWidth={0.3} fill="none" rx={0.5} />
        {/* Pillow */}
        <rect x={791} y={146} width={8} height={3} stroke="rgba(255,255,255,0.07)" strokeWidth={0.2} fill="none" rx={0.5} />
      </motion.g>

      {/* Windows in floor plan (breaks in wall) */}
      <motion.g custom={23} variants={fadeIn}>
        {/* Window on bottom wall */}
        <line x1={680} y1={205} x2={720} y2={205} stroke="rgba(102,126,234,0.5)" strokeWidth={0.8} />
        {/* Window on left wall */}
        <line x1={640} y1={80} x2={640} y2={115} stroke="rgba(102,126,234,0.5)" strokeWidth={0.8} />
        {/* Window on top wall */}
        <line x1={670} y1={60} x2={720} y2={60} stroke="rgba(102,126,234,0.5)" strokeWidth={0.8} />
      </motion.g>

      {/* Room labels in floor plan */}
      <motion.text x={680} y={108} textAnchor="middle" fill="rgba(255,255,255,0.1)" fontSize={5} fontFamily="monospace" custom={30} variants={fadeIn}>SÉJOUR</motion.text>
      <motion.text x={680} y={170} textAnchor="middle" fill="rgba(255,255,255,0.1)" fontSize={5} fontFamily="monospace" custom={31} variants={fadeIn}>CUISINE</motion.text>
      <motion.text x={755} y={100} textAnchor="middle" fill="rgba(255,255,255,0.1)" fontSize={5} fontFamily="monospace" custom={32} variants={fadeIn}>ESCALIER</motion.text>
      <motion.text x={755} y={185} textAnchor="middle" fill="rgba(255,255,255,0.1)" fontSize={4.5} fontFamily="monospace" custom={33} variants={fadeIn}>SDB</motion.text>
      <motion.text x={820} y={165} textAnchor="middle" fill="rgba(255,255,255,0.1)" fontSize={5} fontFamily="monospace" custom={34} variants={fadeIn}>CHAMBRE</motion.text>


      {/* ===== LANDSCAPE - Trees around elevation 1 ===== */}

      {/* Tree 1 - left of building */}
      <motion.g custom={25} variants={scaleIn} style={{ transformOrigin: "55px 230px" }}>
        {/* Trunk */}
        <line x1={55} y1={230} x2={55} y2={195} stroke="rgba(255,255,255,0.2)" strokeWidth={0.6} />
        {/* Canopy (simple circle clusters) */}
        <circle cx={55} cy={188} r={12} stroke="rgba(255,255,255,0.15)" strokeWidth={0.4} fill="none" />
        <circle cx={47} cy={193} r={9} stroke="rgba(255,255,255,0.12)" strokeWidth={0.3} fill="none" />
        <circle cx={63} cy={192} r={10} stroke="rgba(255,255,255,0.12)" strokeWidth={0.3} fill="none" />
      </motion.g>

      {/* Tree 2 - right of building */}
      <motion.g custom={26} variants={scaleIn} style={{ transformOrigin: "568px 230px" }}>
        <line x1={568} y1={230} x2={568} y2={190} stroke="rgba(255,255,255,0.2)" strokeWidth={0.6} />
        <circle cx={568} cy={182} r={14} stroke="rgba(255,255,255,0.15)" strokeWidth={0.4} fill="none" />
        <circle cx={558} cy={188} r={10} stroke="rgba(255,255,255,0.12)" strokeWidth={0.3} fill="none" />
        <circle cx={578} cy={186} r={11} stroke="rgba(255,255,255,0.12)" strokeWidth={0.3} fill="none" />
        <circle cx={568} cy={174} r={8} stroke="rgba(255,255,255,0.1)" strokeWidth={0.3} fill="none" />
      </motion.g>

      {/* Tree 3 - conifer/triangular tree, far right of elevation 1 */}
      <motion.g custom={27} variants={scaleIn} style={{ transformOrigin: "595px 230px" }}>
        <line x1={595} y1={230} x2={595} y2={196} stroke="rgba(255,255,255,0.2)" strokeWidth={0.5} />
        <path d="M 595 170 L 585 200 L 605 200 Z" stroke="rgba(255,255,255,0.15)" strokeWidth={0.4} fill="none" />
        <path d="M 595 180 L 583 208 L 607 208 Z" stroke="rgba(255,255,255,0.12)" strokeWidth={0.3} fill="none" />
      </motion.g>

      {/* Bushes/shrubs near elevation 2 */}
      <motion.g custom={28} variants={scaleIn} style={{ transformOrigin: "70px 408px" }}>
        <circle cx={60} cy={404} r={6} stroke="rgba(255,255,255,0.1)" strokeWidth={0.3} fill="none" />
        <circle cx={72} cy={405} r={5} stroke="rgba(255,255,255,0.1)" strokeWidth={0.3} fill="none" />
        <circle cx={66} cy={400} r={4} stroke="rgba(255,255,255,0.08)" strokeWidth={0.3} fill="none" />
      </motion.g>

      {/* Tree near elevation 2 */}
      <motion.g custom={29} variants={scaleIn} style={{ transformOrigin: "560px 408px" }}>
        <line x1={560} y1={408} x2={560} y2={378} stroke="rgba(255,255,255,0.18)" strokeWidth={0.5} />
        <circle cx={560} cy={370} r={11} stroke="rgba(255,255,255,0.13)" strokeWidth={0.4} fill="none" />
        <circle cx={552} cy={376} r={8} stroke="rgba(255,255,255,0.1)" strokeWidth={0.3} fill="none" />
        <circle cx={568} cy={374} r={9} stroke="rgba(255,255,255,0.1)" strokeWidth={0.3} fill="none" />
      </motion.g>


      {/* ===== SECTION CUT MARKERS ===== */}

      {/* Section A-A marker (left) */}
      <motion.g custom={30} variants={scaleIn} style={{ transformOrigin: "35px 190px" }}>
        <circle cx={35} cy={190} r={8} stroke="rgba(102,126,234,0.35)" strokeWidth={0.6} fill="none" />
        <text x={35} y={193} textAnchor="middle" fill="rgba(102,126,234,0.35)" fontSize={8} fontFamily="monospace" fontWeight="bold">A</text>
        {/* Cut line */}
        <line x1={35} y1={198} x2={35} y2={230} stroke="rgba(102,126,234,0.2)" strokeWidth={0.5} strokeDasharray="4 3" />
      </motion.g>

      {/* Section A-A marker (right) */}
      <motion.g custom={30} variants={scaleIn} style={{ transformOrigin: "35px 350px" }}>
        <circle cx={35} cy={350} r={8} stroke="rgba(102,126,234,0.35)" strokeWidth={0.6} fill="none" />
        <text x={35} y={353} textAnchor="middle" fill="rgba(102,126,234,0.35)" fontSize={8} fontFamily="monospace" fontWeight="bold">A</text>
        {/* Cut line */}
        <line x1={35} y1={358} x2={35} y2={410} stroke="rgba(102,126,234,0.2)" strokeWidth={0.5} strokeDasharray="4 3" />
      </motion.g>

      {/* Section B-B marker (top of right wing) */}
      <motion.g custom={31} variants={scaleIn} style={{ transformOrigin: "420px 50px" }}>
        <circle cx={420} cy={50} r={8} stroke="rgba(102,126,234,0.35)" strokeWidth={0.6} fill="none" />
        <text x={420} y={53} textAnchor="middle" fill="rgba(102,126,234,0.35)" fontSize={8} fontFamily="monospace" fontWeight="bold">B</text>
        <line x1={420} y1={58} x2={420} y2={100} stroke="rgba(102,126,234,0.2)" strokeWidth={0.5} strokeDasharray="4 3" />
      </motion.g>

      {/* Section B-B marker (bottom) */}
      <motion.g custom={31} variants={scaleIn} style={{ transformOrigin: "420px 245px" }}>
        <circle cx={420} cy={245} r={8} stroke="rgba(102,126,234,0.35)" strokeWidth={0.6} fill="none" />
        <text x={420} y={248} textAnchor="middle" fill="rgba(102,126,234,0.35)" fontSize={8} fontFamily="monospace" fontWeight="bold">B</text>
        <line x1={420} y1={253} x2={420} y2={265} stroke="rgba(102,126,234,0.2)" strokeWidth={0.5} strokeDasharray="4 3" />
      </motion.g>


      {/* ===== DIMENSION LINES ===== */}

      {/* Top dimension - total width (elevation 1) */}
      <motion.line x1={80} y1={88} x2={540} y2={88} stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} custom={24} variants={draw} />
      <motion.line x1={80} y1={83} x2={80} y2={93} stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} custom={24} variants={draw} />
      <motion.line x1={540} y1={83} x2={540} y2={93} stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} custom={24} variants={draw} />
      {/* Extension lines */}
      <motion.line x1={80} y1={93} x2={80} y2={142} stroke="rgba(255,255,255,0.06)" strokeWidth={0.3} strokeDasharray="2 4" custom={24} variants={draw} />
      <motion.line x1={540} y1={93} x2={540} y2={105} stroke="rgba(255,255,255,0.06)" strokeWidth={0.3} strokeDasharray="2 4" custom={24} variants={draw} />

      {/* Partial dimension - left wing */}
      <motion.line x1={90} y1={96} x2={300} y2={96} stroke="rgba(255,255,255,0.1)" strokeWidth={0.4} custom={25} variants={draw} />
      <motion.line x1={90} y1={93} x2={90} y2={99} stroke="rgba(255,255,255,0.1)" strokeWidth={0.4} custom={25} variants={draw} />
      <motion.line x1={300} y1={93} x2={300} y2={99} stroke="rgba(255,255,255,0.1)" strokeWidth={0.4} custom={25} variants={draw} />

      {/* Partial dimension - right wing */}
      <motion.line x1={310} y1={96} x2={530} y2={96} stroke="rgba(255,255,255,0.1)" strokeWidth={0.4} custom={26} variants={draw} />
      <motion.line x1={310} y1={93} x2={310} y2={99} stroke="rgba(255,255,255,0.1)" strokeWidth={0.4} custom={26} variants={draw} />
      <motion.line x1={530} y1={93} x2={530} y2={99} stroke="rgba(255,255,255,0.1)" strokeWidth={0.4} custom={26} variants={draw} />

      {/* Right dimension - height */}
      <motion.line x1={565} y1={105} x2={565} y2={230} stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} custom={27} variants={draw} />
      <motion.line x1={560} y1={105} x2={570} y2={105} stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} custom={27} variants={draw} />
      <motion.line x1={560} y1={230} x2={570} y2={230} stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} custom={27} variants={draw} />

      {/* Height markers for left wing */}
      <motion.line x1={560} y1={152} x2={570} y2={152} stroke="rgba(255,255,255,0.1)" strokeWidth={0.4} custom={27} variants={draw} />

      {/* Left side dimension for elevation 2 */}
      <motion.line
        x1={75} y1={275} x2={75} y2={410}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={0.5}
        strokeDasharray="2 4"
        custom={28}
        variants={draw}
      />
      <motion.line x1={70} y1={330} x2={80} y2={330} stroke="rgba(255,255,255,0.1)" strokeWidth={0.4} custom={28} variants={draw} />
      <motion.line x1={70} y1={410} x2={80} y2={410} stroke="rgba(255,255,255,0.1)" strokeWidth={0.4} custom={28} variants={draw} />

      {/* Floor plan dimensions */}
      <motion.line x1={640} y1={212} x2={860} y2={212} stroke="rgba(255,255,255,0.12)" strokeWidth={0.4} custom={29} variants={draw} />
      <motion.line x1={640} y1={209} x2={640} y2={215} stroke="rgba(255,255,255,0.12)" strokeWidth={0.4} custom={29} variants={draw} />
      <motion.line x1={860} y1={209} x2={860} y2={215} stroke="rgba(255,255,255,0.12)" strokeWidth={0.4} custom={29} variants={draw} />

      <motion.line x1={635} y1={60} x2={635} y2={205} stroke="rgba(255,255,255,0.12)" strokeWidth={0.4} custom={30} variants={draw} />
      <motion.line x1={632} y1={60} x2={638} y2={60} stroke="rgba(255,255,255,0.12)" strokeWidth={0.4} custom={30} variants={draw} />
      <motion.line x1={632} y1={205} x2={638} y2={205} stroke="rgba(255,255,255,0.12)" strokeWidth={0.4} custom={30} variants={draw} />


      {/* ===== DIMENSION TEXTS ===== */}
      <motion.text x={310} y={84} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize={8} fontFamily="monospace" custom={32} variants={fadeIn}>
        24.50 m
      </motion.text>
      <motion.text x={195} y={104} textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize={6.5} fontFamily="monospace" custom={33} variants={fadeIn}>
        10.80 m
      </motion.text>
      <motion.text x={420} y={104} textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize={6.5} fontFamily="monospace" custom={34} variants={fadeIn}>
        11.30 m
      </motion.text>
      <motion.text
        x={582} y={172}
        textAnchor="middle"
        fill="rgba(255,255,255,0.2)"
        fontSize={7}
        fontFamily="monospace"
        transform="rotate(-90, 582, 172)"
        custom={35}
        variants={fadeIn}
      >
        8.20 m
      </motion.text>
      <motion.text
        x={582} y={192}
        textAnchor="middle"
        fill="rgba(255,255,255,0.15)"
        fontSize={6}
        fontFamily="monospace"
        transform="rotate(-90, 582, 192)"
        custom={35}
        variants={fadeIn}
      >
        5.10 m
      </motion.text>
      <motion.text
        x={62} y={372}
        textAnchor="middle"
        fill="rgba(255,255,255,0.15)"
        fontSize={6.5}
        fontFamily="monospace"
        transform="rotate(-90, 62, 372)"
        custom={36}
        variants={fadeIn}
      >
        6.40 m
      </motion.text>
      {/* Floor plan dimensions */}
      <motion.text x={750} y={222} textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize={6} fontFamily="monospace" custom={37} variants={fadeIn}>
        12.00 m
      </motion.text>
      <motion.text
        x={627} y={132}
        textAnchor="middle"
        fill="rgba(255,255,255,0.15)"
        fontSize={6}
        fontFamily="monospace"
        transform="rotate(-90, 627, 132)"
        custom={38}
        variants={fadeIn}
      >
        9.50 m
      </motion.text>


      {/* ===== SECTION LABELS ===== */}
      <motion.text
        x={580} y={240}
        textAnchor="end"
        fill="rgba(102,126,234,0.25)"
        fontSize={7}
        fontFamily="monospace"
        letterSpacing={2}
        custom={36}
        variants={slideUp}
      >
        ÉLÉVATION NORD
      </motion.text>

      <motion.text
        x={580} y={420}
        textAnchor="end"
        fill="rgba(102,126,234,0.25)"
        fontSize={7}
        fontFamily="monospace"
        letterSpacing={2}
        custom={37}
        variants={slideUp}
      >
        ÉLÉVATION SUD
      </motion.text>


      {/* ===== SCALE INDICATOR ===== */}
      <motion.line x1={40} y1={470} x2={140} y2={470} stroke="rgba(255,255,255,0.2)" strokeWidth={0.8} custom={38} variants={draw} />
      <motion.line x1={40} y1={466} x2={40} y2={474} stroke="rgba(255,255,255,0.2)" strokeWidth={0.5} custom={38} variants={draw} />
      <motion.line x1={90} y1={466} x2={90} y2={474} stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} custom={38} variants={draw} />
      <motion.line x1={140} y1={466} x2={140} y2={474} stroke="rgba(255,255,255,0.2)" strokeWidth={0.5} custom={38} variants={draw} />
      {/* Half-meter tick marks */}
      <motion.line x1={65} y1={468} x2={65} y2={472} stroke="rgba(255,255,255,0.1)" strokeWidth={0.3} custom={38} variants={draw} />
      <motion.line x1={115} y1={468} x2={115} y2={472} stroke="rgba(255,255,255,0.1)" strokeWidth={0.3} custom={38} variants={draw} />
      <motion.text x={40} y={482} textAnchor="middle" fill="rgba(255,255,255,0.12)" fontSize={5.5} fontFamily="monospace" custom={39} variants={fadeIn}>0</motion.text>
      <motion.text x={90} y={482} textAnchor="middle" fill="rgba(255,255,255,0.12)" fontSize={5.5} fontFamily="monospace" custom={39} variants={fadeIn}>5m</motion.text>
      <motion.text x={140} y={482} textAnchor="middle" fill="rgba(255,255,255,0.12)" fontSize={5.5} fontFamily="monospace" custom={39} variants={fadeIn}>10m</motion.text>


      {/* ===== TITLE BLOCK ===== */}
      <motion.g custom={40} variants={slideUp}>
        {/* Outer frame */}
        <rect x={640} y={440} width={240} height={165} stroke="rgba(255,255,255,0.25)" strokeWidth={0.8} fill="none" />
        {/* Inner dividers */}
        <line x1={640} y1={472} x2={880} y2={472} stroke="rgba(255,255,255,0.2)" strokeWidth={0.5} />
        <line x1={640} y1={502} x2={880} y2={502} stroke="rgba(255,255,255,0.15)" strokeWidth={0.4} />
        <line x1={640} y1={528} x2={880} y2={528} stroke="rgba(255,255,255,0.15)" strokeWidth={0.4} />
        <line x1={640} y1={554} x2={880} y2={554} stroke="rgba(255,255,255,0.15)" strokeWidth={0.4} />
        <line x1={640} y1={578} x2={880} y2={578} stroke="rgba(255,255,255,0.15)" strokeWidth={0.4} />
        {/* Vertical dividers */}
        <line x1={740} y1={502} x2={740} y2={605} stroke="rgba(255,255,255,0.1)" strokeWidth={0.3} />
      </motion.g>

      {/* Title block text */}
      <motion.text x={760} y={460} textAnchor="middle" fill="rgba(102,126,234,0.6)" fontSize={14} fontFamily="monospace" fontWeight="bold" letterSpacing={4} custom={41} variants={slideUp}>
        E-DOME
      </motion.text>
      <motion.text x={760} y={490} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={9} fontFamily="monospace" letterSpacing={2} custom={42} variants={slideUp}>
        VILLA CONCEPT
      </motion.text>

      <motion.g custom={43} variants={fadeIn}>
        <text x={650} y={518} fill="rgba(255,255,255,0.15)" fontSize={6} fontFamily="monospace">PROJET</text>
        <text x={750} y={518} fill="rgba(255,255,255,0.25)" fontSize={7} fontFamily="monospace">Résidence Privée</text>
      </motion.g>
      <motion.g custom={44} variants={fadeIn}>
        <text x={650} y={544} fill="rgba(255,255,255,0.15)" fontSize={6} fontFamily="monospace">ÉCHELLE</text>
        <text x={750} y={544} fill="rgba(255,255,255,0.25)" fontSize={7} fontFamily="monospace">1:200</text>
      </motion.g>
      <motion.g custom={45} variants={fadeIn}>
        <text x={650} y={570} fill="rgba(255,255,255,0.15)" fontSize={6} fontFamily="monospace">PLAN N°</text>
        <text x={750} y={570} fill="rgba(255,255,255,0.25)" fontSize={7} fontFamily="monospace">A-101</text>
      </motion.g>
      <motion.g custom={46} variants={fadeIn}>
        <text x={650} y={596} fill="rgba(255,255,255,0.15)" fontSize={6} fontFamily="monospace">DATE</text>
        <text x={750} y={596} fill="rgba(255,255,255,0.25)" fontSize={7} fontFamily="monospace">Mars 2026</text>
      </motion.g>


      {/* ===== CORNER REFERENCE MARKS ===== */}
      {[
        [45, 45], [875, 45], [45, 610], [875, 610],
      ].map(([x, y], i) => (
        <motion.g key={`corner-${i}`} custom={40} variants={fadeIn}>
          <line
            x1={x} y1={y as number - 10} x2={x} y2={y}
            stroke="rgba(102,126,234,0.15)"
            strokeWidth={0.5}
          />
          <line
            x1={x as number - 10} y1={y} x2={x} y2={y}
            stroke="rgba(102,126,234,0.15)"
            strokeWidth={0.5}
          />
        </motion.g>
      ))}

      {/* Decorative cross-hatch in bottom-left corner */}
      <motion.g custom={41} variants={fadeIn}>
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={`hatch-${i}`}
            x1={45 + i * 4} y1={598 + i * 3}
            x2={53 + i * 4} y2={590 + i * 3}
            stroke="rgba(102,126,234,0.08)"
            strokeWidth={0.4}
          />
        ))}
      </motion.g>

      {/* North arrow */}
      <motion.g custom={42} variants={scaleIn} style={{ transformOrigin: "210px 470px" }}>
        <line x1={210} y1={485} x2={210} y2={455} stroke="rgba(255,255,255,0.2)" strokeWidth={0.6} />
        <path d="M 206 460 L 210 452 L 214 460" stroke="rgba(255,255,255,0.2)" strokeWidth={0.5} fill="none" />
        <text x={210} y={495} textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize={7} fontFamily="monospace">N</text>
      </motion.g>

      {/* Level markers on elevation 1 */}
      <motion.g custom={33} variants={fadeIn}>
        {/* Ground level ±0.00 */}
        <line x1={595} y1={230} x2={615} y2={230} stroke="rgba(255,255,255,0.15)" strokeWidth={0.4} />
        <path d="M 610 225 L 615 230 L 610 235" stroke="rgba(255,255,255,0.15)" strokeWidth={0.4} fill="none" />
        <text x={618} y={232} fill="rgba(255,255,255,0.12)" fontSize={5.5} fontFamily="monospace">±0.00</text>
      </motion.g>
      <motion.g custom={34} variants={fadeIn}>
        {/* Roof level */}
        <line x1={548} y1={105} x2={615} y2={105} stroke="rgba(255,255,255,0.1)" strokeWidth={0.3} strokeDasharray="2 3" />
        <text x={618} y={107} fill="rgba(255,255,255,0.1)" fontSize={5.5} fontFamily="monospace">+8.20</text>
      </motion.g>
      <motion.g custom={35} variants={fadeIn}>
        {/* Left wing roof level */}
        <line x1={308} y1={152} x2={615} y2={152} stroke="rgba(255,255,255,0.06)" strokeWidth={0.3} strokeDasharray="2 4" />
        <text x={618} y={154} fill="rgba(255,255,255,0.1)" fontSize={5.5} fontFamily="monospace">+5.10</text>
      </motion.g>

      {/* Grid axis labels for floor plan */}
      <motion.g custom={36} variants={fadeIn}>
        <circle cx={640} cy={45} r={6} stroke="rgba(102,126,234,0.2)" strokeWidth={0.4} fill="none" />
        <text x={640} y={48} textAnchor="middle" fill="rgba(102,126,234,0.2)" fontSize={7} fontFamily="monospace">1</text>
        <circle cx={730} cy={45} r={6} stroke="rgba(102,126,234,0.2)" strokeWidth={0.4} fill="none" />
        <text x={730} y={48} textAnchor="middle" fill="rgba(102,126,234,0.2)" fontSize={7} fontFamily="monospace">2</text>
        <circle cx={860} cy={45} r={6} stroke="rgba(102,126,234,0.2)" strokeWidth={0.4} fill="none" />
        <text x={860} y={48} textAnchor="middle" fill="rgba(102,126,234,0.2)" fontSize={7} fontFamily="monospace">3</text>
      </motion.g>
      <motion.g custom={37} variants={fadeIn}>
        <circle cx={627} cy={60} r={6} stroke="rgba(102,126,234,0.2)" strokeWidth={0.4} fill="none" />
        <text x={627} y={63} textAnchor="middle" fill="rgba(102,126,234,0.2)" fontSize={7} fontFamily="monospace">A</text>
        <circle cx={627} cy={132} r={6} stroke="rgba(102,126,234,0.2)" strokeWidth={0.4} fill="none" />
        <text x={627} y={135} textAnchor="middle" fill="rgba(102,126,234,0.2)" fontSize={7} fontFamily="monospace">B</text>
        <circle cx={627} cy={205} r={6} stroke="rgba(102,126,234,0.2)" strokeWidth={0.4} fill="none" />
        <text x={627} y={208} textAnchor="middle" fill="rgba(102,126,234,0.2)" fontSize={7} fontFamily="monospace">C</text>
      </motion.g>

      {/* Subtle structural grid lines for floor plan */}
      <motion.g custom={15} variants={fadeIn}>
        <line x1={640} y1={45} x2={640} y2={60} stroke="rgba(102,126,234,0.08)" strokeWidth={0.3} strokeDasharray="2 3" />
        <line x1={730} y1={45} x2={730} y2={60} stroke="rgba(102,126,234,0.08)" strokeWidth={0.3} strokeDasharray="2 3" />
        <line x1={860} y1={45} x2={860} y2={60} stroke="rgba(102,126,234,0.08)" strokeWidth={0.3} strokeDasharray="2 3" />
        <line x1={627} y1={60} x2={640} y2={60} stroke="rgba(102,126,234,0.08)" strokeWidth={0.3} strokeDasharray="2 3" />
        <line x1={627} y1={132} x2={640} y2={132} stroke="rgba(102,126,234,0.08)" strokeWidth={0.3} strokeDasharray="2 3" />
        <line x1={627} y1={205} x2={640} y2={205} stroke="rgba(102,126,234,0.08)" strokeWidth={0.3} strokeDasharray="2 3" />
      </motion.g>

      {/* Concrete wall hatching in floor plan walls */}
      <motion.g custom={16} variants={fadeIn}>
        <rect x={640} y={60} width={5} height={72} fill="url(#concreteHatch)" />
        <rect x={640} y={132} width={220} height={5} fill="url(#concreteHatch)" />
        <rect x={855} y={60} width={5} height={145} fill="url(#concreteHatch)" />
        <rect x={640} y={200} width={220} height={5} fill="url(#concreteHatch)" />
      </motion.g>
    </motion.svg>
  );
}
