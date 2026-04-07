"use client";

export function VillaLuxuryDrawing({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1400 900"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      stroke="currentColor"
    >
      {/* ============================================================
          PERSPECTIVE GROUND GRID — fading into distance
          ============================================================ */}
      {/* Horizontal grid lines */}
      {Array.from({ length: 18 }, (_, i) => {
        const y = 580 + i * 18;
        const opacity = 0.06 + i * 0.018;
        return (
          <line
            key={`hgrid-${i}`}
            x1={50}
            y1={y}
            x2={1350}
            y2={y}
            strokeWidth={0.2}
            opacity={opacity}
          />
        );
      })}
      {/* Vertical perspective lines converging to vanishing point (700, 280) */}
      {Array.from({ length: 28 }, (_, i) => {
        const x = 100 + i * 46;
        const opacity = 0.04 + Math.abs(14 - i) * 0.005;
        return (
          <line
            key={`vgrid-${i}`}
            x1={x}
            y1={900}
            x2={700 + (x - 700) * 0.15}
            y2={400}
            strokeWidth={0.2}
            opacity={opacity}
          />
        );
      })}

      {/* ============================================================
          GROUND PLANE / TERRAIN BASE
          ============================================================ */}
      <line x1={0} y1={580} x2={1400} y2={580} strokeWidth={0.6} opacity={0.3} />
      <line x1={0} y1={582} x2={1400} y2={582} strokeWidth={0.3} opacity={0.15} />

      {/* Terrain contour lines */}
      <path d="M0,590 Q200,586 400,588 Q600,584 800,586 Q1000,582 1200,585 L1400,583" strokeWidth={0.2} opacity={0.1} />
      <path d="M0,600 Q300,594 500,596 Q700,592 900,594 Q1100,590 1400,592" strokeWidth={0.2} opacity={0.08} />

      {/* ============================================================
          MAIN VILLA — GROUND FLOOR (Level +0.00)
          ============================================================ */}
      {/* Main body — outer wall */}
      <polygon
        points="280,580 280,420 340,390 900,390 960,420 960,580"
        strokeWidth={1.2}
        opacity={0.9}
      />
      {/* Main body — inner wall (wall thickness) */}
      <polygon
        points="288,575 288,426 344,398 894,398 954,424 954,575"
        strokeWidth={0.4}
        opacity={0.5}
      />

      {/* Left wing extension */}
      <polygon
        points="140,580 140,450 200,425 280,425 280,580"
        strokeWidth={1.0}
        opacity={0.85}
      />
      <polygon
        points="148,575 148,455 205,432 275,432 275,575"
        strokeWidth={0.35}
        opacity={0.45}
      />

      {/* Right wing — garage */}
      <polygon
        points="960,580 960,440 1020,415 1120,415 1160,440 1160,580"
        strokeWidth={1.0}
        opacity={0.85}
      />
      <polygon
        points="968,575 968,446 1025,422 1114,422 1154,444 1154,575"
        strokeWidth={0.35}
        opacity={0.45}
      />

      {/* ============================================================
          UPPER FLOOR (Level +3.50)
          ============================================================ */}
      {/* Floor slab line */}
      <line x1={260} y1={420} x2={980} y2={420} strokeWidth={0.8} opacity={0.7} />
      <line x1={260} y1={422} x2={980} y2={422} strokeWidth={0.3} opacity={0.4} />

      {/* Upper floor walls */}
      <polygon
        points="300,420 300,290 355,265 880,265 935,290 935,420"
        strokeWidth={1.1}
        opacity={0.85}
      />
      <polygon
        points="308,416 308,296 359,272 874,272 929,294 929,416"
        strokeWidth={0.35}
        opacity={0.45}
      />

      {/* Upper floor setback left */}
      <polygon
        points="300,420 300,340 330,328 380,328 380,420"
        strokeWidth={0.6}
        opacity={0.6}
      />

      {/* ============================================================
          ROOF (Level +7.00) — Flat with overhang
          ============================================================ */}
      {/* Main roof slab */}
      <polygon
        points="270,290 270,258 340,230 910,230 970,258 970,290"
        strokeWidth={1.2}
        opacity={0.9}
      />
      {/* Roof thickness */}
      <polygon
        points="275,286 275,262 343,235 907,235 965,260 965,286"
        strokeWidth={0.3}
        opacity={0.4}
      />

      {/* Overhang lines */}
      <line x1={260} y1={260} x2={260} y2={292} strokeWidth={0.6} opacity={0.6} />
      <line x1={980} y1={260} x2={980} y2={292} strokeWidth={0.6} opacity={0.6} />
      <line x1={260} y1={260} x2={335} y2={228} strokeWidth={0.8} opacity={0.7} />
      <line x1={980} y1={260} x2={915} y2={228} strokeWidth={0.8} opacity={0.7} />

      {/* Roof edge detail */}
      <line x1={335} y1={228} x2={915} y2={228} strokeWidth={1.0} opacity={0.8} />
      <line x1={337} y1={232} x2={913} y2={232} strokeWidth={0.3} opacity={0.35} />

      {/* Left wing roof */}
      <polygon
        points="120,450 120,418 190,395 290,395 290,425"
        strokeWidth={0.9}
        opacity={0.75}
      />
      <line x1={125} y1={446} x2={125} y2={422} strokeWidth={0.4} opacity={0.4} />
      <line x1={120} y1={418} x2={290} y2={395} strokeWidth={0.4} opacity={0.35} />

      {/* Garage roof */}
      <polygon
        points="950,440 950,408 1015,388 1130,388 1170,408 1170,440"
        strokeWidth={0.9}
        opacity={0.75}
      />

      {/* ============================================================
          CROSS-HATCHING ON CUT SECTIONS
          ============================================================ */}
      {/* Left wall section hatching */}
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={`hatch-lw-${i}`}
          x1={281 + i * 0.6}
          y1={430 + i * 12}
          x2={287}
          y2={425 + i * 12}
          strokeWidth={0.2}
          opacity={0.3}
        />
      ))}
      {/* Right wall section hatching */}
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={`hatch-rw-${i}`}
          x1={955 + i * 0.4}
          y1={430 + i * 12}
          x2={959}
          y2={425 + i * 12}
          strokeWidth={0.2}
          opacity={0.3}
        />
      ))}
      {/* Floor slab hatching */}
      {Array.from({ length: 35 }, (_, i) => (
        <line
          key={`hatch-fs-${i}`}
          x1={280 + i * 20}
          y1={420}
          x2={284 + i * 20}
          y2={422}
          strokeWidth={0.2}
          opacity={0.25}
        />
      ))}
      {/* Roof slab hatching */}
      {Array.from({ length: 30 }, (_, i) => (
        <line
          key={`hatch-rs-${i}`}
          x1={310 + i * 20}
          y1={260}
          x2={314 + i * 20}
          y2={264}
          strokeWidth={0.2}
          opacity={0.25}
        />
      ))}

      {/* ============================================================
          FLOOR-TO-CEILING WINDOWS — Ground floor
          ============================================================ */}
      {/* Front facade windows — 6 bays */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = 340 + i * 100;
        return (
          <g key={`gf-win-${i}`} opacity={0.8}>
            {/* Window frame */}
            <rect x={x} y={430} width={70} height={145} strokeWidth={0.8} />
            {/* Horizontal mullion */}
            <line x1={x} y1={502} x2={x + 70} y2={502} strokeWidth={0.4} />
            {/* Vertical mullion */}
            <line x1={x + 35} y1={430} x2={x + 35} y2={575} strokeWidth={0.4} />
            {/* Glass reflection lines */}
            <line x1={x + 5} y1={435} x2={x + 15} y2={498} strokeWidth={0.15} opacity={0.2} />
            <line x1={x + 40} y1={435} x2={x + 50} y2={498} strokeWidth={0.15} opacity={0.2} />
            <line x1={x + 8} y1={506} x2={x + 18} y2={570} strokeWidth={0.15} opacity={0.15} />
            {/* Sill detail */}
            <line x1={x - 2} y1={575} x2={x + 72} y2={575} strokeWidth={0.5} />
            <line x1={x - 2} y1={577} x2={x + 72} y2={577} strokeWidth={0.2} />
          </g>
        );
      })}

      {/* ============================================================
          FLOOR-TO-CEILING WINDOWS — Upper floor
          ============================================================ */}
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 370 + i * 108;
        return (
          <g key={`uf-win-${i}`} opacity={0.75}>
            <rect x={x} y={300} width={78} height={115} strokeWidth={0.7} />
            {/* Mullions */}
            <line x1={x} y1={358} x2={x + 78} y2={358} strokeWidth={0.35} />
            <line x1={x + 26} y1={300} x2={x + 26} y2={415} strokeWidth={0.35} />
            <line x1={x + 52} y1={300} x2={x + 52} y2={415} strokeWidth={0.35} />
            {/* Glass reflection */}
            <line x1={x + 4} y1={305} x2={x + 12} y2={353} strokeWidth={0.15} opacity={0.18} />
            <line x1={x + 30} y1={305} x2={x + 38} y2={353} strokeWidth={0.15} opacity={0.18} />
            <line x1={x + 56} y1={305} x2={x + 64} y2={353} strokeWidth={0.15} opacity={0.18} />
          </g>
        );
      })}

      {/* Left wing windows */}
      <g opacity={0.7}>
        <rect x={160} y={460} width={55} height={110} strokeWidth={0.7} />
        <line x1={160} y1={515} x2={215} y2={515} strokeWidth={0.35} />
        <line x1={187} y1={460} x2={187} y2={570} strokeWidth={0.35} />
        <rect x={225} y={460} width={45} height={110} strokeWidth={0.7} />
        <line x1={225} y1={515} x2={270} y2={515} strokeWidth={0.35} />
        <line x1={247} y1={460} x2={247} y2={570} strokeWidth={0.35} />
      </g>

      {/* ============================================================
          GARAGE DOOR + CAR OUTLINE
          ============================================================ */}
      <g opacity={0.8}>
        {/* Garage door */}
        <rect x={985} y={470} width={150} height={105} strokeWidth={0.8} />
        {/* Door panel lines */}
        {[0, 1, 2, 3].map((i) => (
          <line
            key={`gdoor-${i}`}
            x1={985}
            y1={496 + i * 20}
            x2={1135}
            y2={496 + i * 20}
            strokeWidth={0.3}
            opacity={0.4}
          />
        ))}
        {/* Car outline */}
        <g opacity={0.35}>
          <path
            d="M1010,565 L1010,545 Q1010,535 1020,530 L1030,525 Q1040,520 1050,520 L1090,520 Q1100,520 1110,525 L1115,530 Q1120,535 1120,545 L1120,565"
            strokeWidth={0.5}
          />
          {/* Car roof */}
          <path
            d="M1030,525 L1040,510 Q1050,505 1065,505 L1080,505 Q1095,505 1100,510 L1110,525"
            strokeWidth={0.4}
          />
          {/* Wheels */}
          <circle cx={1025} cy={565} r={8} strokeWidth={0.4} />
          <circle cx={1025} cy={565} r={4} strokeWidth={0.2} />
          <circle cx={1105} cy={565} r={8} strokeWidth={0.4} />
          <circle cx={1105} cy={565} r={4} strokeWidth={0.2} />
          {/* Windows */}
          <line x1={1045} y1={510} x2={1045} y2={522} strokeWidth={0.3} />
          <line x1={1075} y1={510} x2={1075} y2={522} strokeWidth={0.3} />
        </g>
      </g>

      {/* ============================================================
          FRONT DOOR — Double entrance
          ============================================================ */}
      <g opacity={0.85}>
        <rect x={595} y={450} width={50} height={125} strokeWidth={0.9} />
        <rect x={600} y={455} width={19} height={118} strokeWidth={0.4} />
        <rect x={621} y={455} width={19} height={118} strokeWidth={0.4} />
        {/* Door handles */}
        <line x1={616} y1={510} x2={616} y2={520} strokeWidth={0.5} />
        <line x1={624} y1={510} x2={624} y2={520} strokeWidth={0.5} />
        {/* Entrance canopy */}
        <line x1={575} y1={445} x2={665} y2={445} strokeWidth={0.7} />
        <line x1={575} y1={443} x2={665} y2={443} strokeWidth={0.3} />
        <line x1={575} y1={445} x2={575} y2={450} strokeWidth={0.4} />
        <line x1={665} y1={445} x2={665} y2={450} strokeWidth={0.4} />
        {/* Steps */}
        <rect x={580} y={575} width={80} height={6} strokeWidth={0.5} />
        <rect x={585} y={581} width={70} height={5} strokeWidth={0.4} />
        <rect x={590} y={586} width={60} height={5} strokeWidth={0.35} opacity={0.7} />
      </g>

      {/* ============================================================
          STONE TEXTURE ON WALLS
          ============================================================ */}
      {/* Left side stone pattern */}
      {Array.from({ length: 8 }, (_, i) => (
        <g key={`stone-l-${i}`} opacity={0.12}>
          <line x1={282} y1={440 + i * 18} x2={286} y2={438 + i * 18} strokeWidth={0.3} />
          <line x1={283} y1={445 + i * 18} x2={287} y2={447 + i * 18} strokeWidth={0.2} />
        </g>
      ))}
      {/* Right side stone pattern */}
      {Array.from({ length: 8 }, (_, i) => (
        <g key={`stone-r-${i}`} opacity={0.12}>
          <line x1={955} y1={440 + i * 18} x2={959} y2={438 + i * 18} strokeWidth={0.3} />
          <line x1={956} y1={445 + i * 18} x2={960} y2={447 + i * 18} strokeWidth={0.2} />
        </g>
      ))}
      {/* Upper floor stone accent */}
      {Array.from({ length: 20 }, (_, i) => (
        <g key={`stone-uf-${i}`} opacity={0.1}>
          <line
            x1={310 + i * 32}
            y1={275}
            x2={315 + i * 32}
            y2={278}
            strokeWidth={0.2}
          />
          <line
            x1={312 + i * 32}
            y1={282}
            x2={318 + i * 32}
            y2={284}
            strokeWidth={0.15}
          />
        </g>
      ))}

      {/* ============================================================
          INFINITY POOL
          ============================================================ */}
      <g opacity={0.8}>
        {/* Pool outline */}
        <rect x={100} y={600} width={260} height={120} rx={4} strokeWidth={0.9} />
        {/* Pool inner edge */}
        <rect x={106} y={606} width={248} height={108} rx={3} strokeWidth={0.4} />
        {/* Water level line */}
        <rect x={110} y={610} width={240} height={100} rx={2} strokeWidth={0.2} opacity={0.3} />

        {/* Water ripple lines */}
        {Array.from({ length: 10 }, (_, i) => (
          <path
            key={`ripple-${i}`}
            d={`M115,${620 + i * 10} Q${175 + (i % 3) * 5},${617 + i * 10} ${230},${620 + i * 10} Q${290 + (i % 2) * 5},${623 + i * 10} 345,${620 + i * 10}`}
            strokeWidth={0.2}
            opacity={0.15 + i * 0.02}
          />
        ))}

        {/* Infinity edge (overflow) */}
        <line x1={100} y1={720} x2={360} y2={720} strokeWidth={1.0} />
        <line x1={100} y1={723} x2={360} y2={723} strokeWidth={0.3} opacity={0.4} />
        {/* Water overflow lines */}
        {Array.from({ length: 12 }, (_, i) => (
          <line
            key={`overflow-${i}`}
            x1={115 + i * 20}
            y1={720}
            x2={115 + i * 20}
            y2={728}
            strokeWidth={0.2}
            opacity={0.2}
          />
        ))}

        {/* Pool coping detail */}
        <line x1={96} y1={598} x2={364} y2={598} strokeWidth={0.4} />
        <line x1={96} y1={598} x2={96} y2={724} strokeWidth={0.4} />
        <line x1={364} y1={598} x2={364} y2={724} strokeWidth={0.4} />

        {/* Pool ladder */}
        <line x1={340} y1={598} x2={340} y2={620} strokeWidth={0.5} />
        <line x1={348} y1={598} x2={348} y2={620} strokeWidth={0.5} />
        <line x1={340} y1={604} x2={348} y2={604} strokeWidth={0.4} />
        <line x1={340} y1={612} x2={348} y2={612} strokeWidth={0.4} />
      </g>

      {/* ============================================================
          TERRACE WITH WOOD DECK
          ============================================================ */}
      <g opacity={0.7}>
        {/* Deck outline */}
        <rect x={280} y={580} width={400} height={80} strokeWidth={0.6} />
        {/* Wood grain / plank lines */}
        {Array.from({ length: 16 }, (_, i) => (
          <line
            key={`plank-${i}`}
            x1={280}
            y1={585 + i * 5}
            x2={680}
            y2={585 + i * 5}
            strokeWidth={0.15}
            opacity={0.2}
          />
        ))}
        {/* Wood grain detail */}
        {Array.from({ length: 8 }, (_, i) => (
          <g key={`grain-${i}`}>
            <path
              d={`M${300 + i * 48},${590} Q${305 + i * 48},${600} ${302 + i * 48},${610}`}
              strokeWidth={0.1}
              opacity={0.1}
            />
          </g>
        ))}
      </g>

      {/* ============================================================
          TERRACE FURNITURE
          ============================================================ */}
      {/* Lounge chair 1 */}
      <g opacity={0.5}>
        <rect x={300} y={600} width={50} height={22} rx={2} strokeWidth={0.5} />
        <line x1={305} y1={604} x2={345} y2={604} strokeWidth={0.2} />
        <line x1={305} y1={608} x2={345} y2={608} strokeWidth={0.2} />
        <line x1={305} y1={612} x2={345} y2={612} strokeWidth={0.2} />
        <line x1={305} y1={616} x2={345} y2={616} strokeWidth={0.2} />
        {/* Headrest */}
        <rect x={298} y={596} width={16} height={8} rx={1} strokeWidth={0.4} />
      </g>

      {/* Lounge chair 2 */}
      <g opacity={0.5}>
        <rect x={370} y={600} width={50} height={22} rx={2} strokeWidth={0.5} />
        <line x1={375} y1={604} x2={415} y2={604} strokeWidth={0.2} />
        <line x1={375} y1={608} x2={415} y2={608} strokeWidth={0.2} />
        <line x1={375} y1={612} x2={415} y2={612} strokeWidth={0.2} />
        <line x1={375} y1={616} x2={415} y2={616} strokeWidth={0.2} />
        <rect x={368} y={596} width={16} height={8} rx={1} strokeWidth={0.4} />
      </g>

      {/* Dining table */}
      <g opacity={0.5}>
        <rect x={500} y={595} width={70} height={45} rx={3} strokeWidth={0.5} />
        {/* Table legs */}
        <line x1={507} y1={595} x2={507} y2={640} strokeWidth={0.3} />
        <line x1={563} y1={595} x2={563} y2={640} strokeWidth={0.3} />
        {/* Chairs around table */}
        <rect x={505} y={586} width={15} height={8} rx={1} strokeWidth={0.35} />
        <rect x={525} y={586} width={15} height={8} rx={1} strokeWidth={0.35} />
        <rect x={550} y={586} width={15} height={8} rx={1} strokeWidth={0.35} />
        <rect x={505} y={641} width={15} height={8} rx={1} strokeWidth={0.35} />
        <rect x={525} y={641} width={15} height={8} rx={1} strokeWidth={0.35} />
        <rect x={550} y={641} width={15} height={8} rx={1} strokeWidth={0.35} />
        <rect x={491} y={605} width={8} height={12} rx={1} strokeWidth={0.35} />
        <rect x={571} y={605} width={8} height={12} rx={1} strokeWidth={0.35} />
        <rect x={491} y={622} width={8} height={12} rx={1} strokeWidth={0.35} />
        <rect x={571} y={622} width={8} height={12} rx={1} strokeWidth={0.35} />
      </g>

      {/* Umbrella 1 */}
      <g opacity={0.4}>
        <line x1={320} y1={570} x2={320} y2={596} strokeWidth={0.4} />
        <path d="M295,572 Q320,560 345,572" strokeWidth={0.4} />
        <line x1={295} y1={572} x2={320} y2={564} strokeWidth={0.2} />
        <line x1={345} y1={572} x2={320} y2={564} strokeWidth={0.2} />
        <line x1={307} y1={568} x2={320} y2={564} strokeWidth={0.2} />
        <line x1={333} y1={568} x2={320} y2={564} strokeWidth={0.2} />
      </g>

      {/* Umbrella 2 */}
      <g opacity={0.4}>
        <line x1={390} y1={570} x2={390} y2={596} strokeWidth={0.4} />
        <path d="M365,572 Q390,560 415,572" strokeWidth={0.4} />
        <line x1={365} y1={572} x2={390} y2={564} strokeWidth={0.2} />
        <line x1={415} y1={572} x2={390} y2={564} strokeWidth={0.2} />
        <line x1={377} y1={568} x2={390} y2={564} strokeWidth={0.2} />
        <line x1={403} y1={568} x2={390} y2={564} strokeWidth={0.2} />
      </g>

      {/* ============================================================
          DRIVEWAY
          ============================================================ */}
      <g opacity={0.5}>
        <path
          d="M620,660 Q750,640 900,610 Q1000,595 1060,585 L1060,595 Q1000,605 900,620 Q750,650 620,670 Z"
          strokeWidth={0.5}
        />
        {/* Driveway texture — individual stones */}
        {Array.from({ length: 15 }, (_, i) => (
          <line
            key={`drive-${i}`}
            x1={640 + i * 28}
            y1={665 - i * 4.5}
            x2={645 + i * 28}
            y2={660 - i * 4.5}
            strokeWidth={0.2}
            opacity={0.3}
          />
        ))}
      </g>

      {/* ============================================================
          PATHWAY STONES (from pool area)
          ============================================================ */}
      <g opacity={0.4}>
        {[
          [380, 680],
          [400, 695],
          [425, 708],
          [455, 718],
          [490, 725],
          [525, 730],
          [560, 732],
          [595, 730],
        ].map(([cx, cy], i) => (
          <ellipse
            key={`stone-${i}`}
            cx={cx}
            cy={cy}
            rx={14}
            ry={7}
            strokeWidth={0.35}
          />
        ))}
      </g>

      {/* ============================================================
          LANDSCAPING — Trees (multi-layer circles)
          ============================================================ */}
      {/* Tree 1 — Large deciduous */}
      <g opacity={0.6}>
        <line x1={80} y1={580} x2={80} y2={510} strokeWidth={0.6} />
        <circle cx={80} cy={500} r={30} strokeWidth={0.5} />
        <circle cx={72} cy={492} r={22} strokeWidth={0.35} />
        <circle cx={90} cy={488} r={20} strokeWidth={0.35} />
        <circle cx={78} cy={480} r={16} strokeWidth={0.3} />
        <circle cx={88} cy={496} r={18} strokeWidth={0.3} />
        <circle cx={75} cy={505} r={14} strokeWidth={0.25} />
        {/* Leaf texture */}
        <path d="M65,490 Q70,485 75,490" strokeWidth={0.15} opacity={0.2} />
        <path d="M85,482 Q90,477 95,482" strokeWidth={0.15} opacity={0.2} />
        <path d="M70,500 Q75,495 80,500" strokeWidth={0.15} opacity={0.2} />
      </g>

      {/* Tree 2 */}
      <g opacity={0.55}>
        <line x1={1220} y1={580} x2={1220} y2={490} strokeWidth={0.6} />
        <circle cx={1220} cy={480} r={35} strokeWidth={0.5} />
        <circle cx={1210} cy={472} r={25} strokeWidth={0.35} />
        <circle cx={1232} cy={468} r={22} strokeWidth={0.35} />
        <circle cx={1218} cy={460} r={18} strokeWidth={0.3} />
        <circle cx={1228} cy={478} r={20} strokeWidth={0.3} />
        <circle cx={1212} cy={488} r={16} strokeWidth={0.25} />
        <circle cx={1235} cy={485} r={14} strokeWidth={0.25} />
      </g>

      {/* Tree 3 — Cypress (tall, narrow) */}
      <g opacity={0.5}>
        <line x1={1300} y1={580} x2={1300} y2={440} strokeWidth={0.5} />
        <ellipse cx={1300} cy={500} rx={12} ry={45} strokeWidth={0.4} />
        <ellipse cx={1300} cy={490} rx={9} ry={35} strokeWidth={0.3} />
        <ellipse cx={1300} cy={480} rx={6} ry={25} strokeWidth={0.25} />
      </g>

      {/* Tree 4 — Cypress */}
      <g opacity={0.45}>
        <line x1={1330} y1={580} x2={1330} y2={460} strokeWidth={0.5} />
        <ellipse cx={1330} cy={510} rx={11} ry={40} strokeWidth={0.4} />
        <ellipse cx={1330} cy={500} rx={8} ry={30} strokeWidth={0.3} />
        <ellipse cx={1330} cy={492} rx={5} ry={20} strokeWidth={0.25} />
      </g>

      {/* Tree 5 — Small ornamental near pool */}
      <g opacity={0.5}>
        <line x1={375} y1={600} x2={375} y2={565} strokeWidth={0.4} />
        <circle cx={375} cy={558} r={14} strokeWidth={0.4} />
        <circle cx={370} cy={553} r={10} strokeWidth={0.3} />
        <circle cx={380} cy={552} r={9} strokeWidth={0.25} />
      </g>

      {/* Tree 6 — back left */}
      <g opacity={0.35}>
        <line x1={180} y1={425} x2={180} y2={375} strokeWidth={0.4} />
        <circle cx={180} cy={368} r={20} strokeWidth={0.35} />
        <circle cx={174} cy={362} r={14} strokeWidth={0.25} />
        <circle cx={188} cy={360} r={12} strokeWidth={0.25} />
        <circle cx={180} cy={355} r={10} strokeWidth={0.2} />
      </g>

      {/* ============================================================
          BUSHES / HEDGES
          ============================================================ */}
      {/* Front hedge row */}
      {Array.from({ length: 6 }, (_, i) => (
        <g key={`bush-front-${i}`} opacity={0.35}>
          <ellipse
            cx={410 + i * 35}
            cy={660}
            rx={14}
            ry={8}
            strokeWidth={0.35}
          />
          <ellipse
            cx={410 + i * 35}
            cy={658}
            rx={10}
            ry={5}
            strokeWidth={0.25}
          />
        </g>
      ))}

      {/* Pool-side bushes */}
      {Array.from({ length: 4 }, (_, i) => (
        <g key={`bush-pool-${i}`} opacity={0.4}>
          <ellipse
            cx={95 + i * 25}
            cy={595}
            rx={10}
            ry={6}
            strokeWidth={0.3}
          />
          <ellipse
            cx={95 + i * 25}
            cy={593}
            rx={7}
            ry={4}
            strokeWidth={0.2}
          />
        </g>
      ))}

      {/* Right side landscaping */}
      {Array.from({ length: 5 }, (_, i) => (
        <g key={`bush-right-${i}`} opacity={0.35}>
          <ellipse
            cx={1180 + i * 22}
            cy={585}
            rx={9}
            ry={5}
            strokeWidth={0.3}
          />
        </g>
      ))}

      {/* ============================================================
          OUTDOOR LIGHTING POSTS
          ============================================================ */}
      {[
        [270, 580],
        [690, 580],
        [960, 580],
        [100, 600],
        [365, 600],
        [620, 660],
      ].map(([x, y], i) => (
        <g key={`light-${i}`} opacity={0.5}>
          <line x1={x} y1={y} x2={x} y2={y - 28} strokeWidth={0.4} />
          <circle cx={x} cy={y - 30} r={3} strokeWidth={0.35} />
          {/* Light glow lines */}
          <line x1={x - 5} y1={y - 30} x2={x - 8} y2={y - 33} strokeWidth={0.15} opacity={0.3} />
          <line x1={x + 5} y1={y - 30} x2={x + 8} y2={y - 33} strokeWidth={0.15} opacity={0.3} />
          <line x1={x} y1={y - 35} x2={x} y2={y - 38} strokeWidth={0.15} opacity={0.3} />
        </g>
      ))}

      {/* ============================================================
          BALCONY RAILING — Upper floor
          ============================================================ */}
      <g opacity={0.6}>
        {/* Main railing line */}
        <line x1={380} y1={415} x2={860} y2={415} strokeWidth={0.5} />
        <line x1={380} y1={418} x2={860} y2={418} strokeWidth={0.3} />
        {/* Railing balusters */}
        {Array.from({ length: 24 }, (_, i) => (
          <line
            key={`baluster-${i}`}
            x1={385 + i * 20}
            y1={415}
            x2={385 + i * 20}
            y2={420}
            strokeWidth={0.25}
            opacity={0.5}
          />
        ))}
        {/* Glass panel indicators */}
        {Array.from({ length: 6 }, (_, i) => (
          <rect
            key={`glass-panel-${i}`}
            x={390 + i * 78}
            y={415}
            width={68}
            height={4}
            strokeWidth={0.15}
            opacity={0.2}
          />
        ))}
      </g>

      {/* ============================================================
          SHADOW PROJECTIONS — Dotted lines on ground
          ============================================================ */}
      <g opacity={0.15} strokeDasharray="3,4">
        {/* Main building shadow */}
        <polygon
          points="960,580 1060,640 1060,750 500,750 280,640 280,580"
          strokeWidth={0.4}
        />
        {/* Upper floor shadow */}
        <line x1={935} y1={420} x2={1020} y2={470} strokeWidth={0.3} />
        <line x1={935} y1={290} x2={1040} y2={380} strokeWidth={0.3} />
        {/* Roof overhang shadow */}
        <line x1={970} y1={260} x2={1080} y2={340} strokeWidth={0.3} />
        {/* Tree shadows */}
        <ellipse cx={110} cy={610} rx={35} ry={12} strokeWidth={0.3} />
        <ellipse cx={1260} cy={610} rx={40} ry={14} strokeWidth={0.3} />
      </g>

      {/* ============================================================
          3D PERSPECTIVE DEPTH LINES — connecting front to back
          ============================================================ */}
      <g opacity={0.4}>
        {/* Left side depth */}
        <line x1={140} y1={580} x2={120} y2={590} strokeWidth={0.4} />
        <line x1={140} y1={450} x2={120} y2={460} strokeWidth={0.4} />
        <line x1={280} y1={580} x2={260} y2={590} strokeWidth={0.3} />
        {/* Right side depth */}
        <line x1={1160} y1={580} x2={1180} y2={590} strokeWidth={0.4} />
        <line x1={1160} y1={440} x2={1180} y2={450} strokeWidth={0.4} />
        {/* Roof depth lines */}
        <line x1={260} y1={260} x2={240} y2={270} strokeWidth={0.3} />
        <line x1={260} y1={292} x2={240} y2={302} strokeWidth={0.3} />
        <line x1={980} y1={260} x2={1000} y2={270} strokeWidth={0.3} />
        <line x1={980} y1={292} x2={1000} y2={302} strokeWidth={0.3} />
      </g>

      {/* Side wall visible in perspective — left */}
      <g opacity={0.3}>
        <line x1={140} y1={580} x2={120} y2={590} strokeWidth={0.5} />
        <line x1={140} y1={450} x2={120} y2={460} strokeWidth={0.5} />
        <line x1={120} y1={460} x2={120} y2={590} strokeWidth={0.6} />
        {/* Side windows */}
        <rect x={124} y={475} width={14} height={30} strokeWidth={0.3} />
        <line x1={124} y1={490} x2={138} y2={490} strokeWidth={0.2} />
        <rect x={124} y={520} width={14} height={30} strokeWidth={0.3} />
        <line x1={124} y1={535} x2={138} y2={535} strokeWidth={0.2} />
      </g>

      {/* Side wall — right (garage) */}
      <g opacity={0.3}>
        <line x1={1160} y1={580} x2={1180} y2={590} strokeWidth={0.5} />
        <line x1={1160} y1={440} x2={1180} y2={450} strokeWidth={0.5} />
        <line x1={1180} y1={450} x2={1180} y2={590} strokeWidth={0.6} />
      </g>

      {/* ============================================================
          INTERIOR DETAILS (visible through windows)
          ============================================================ */}
      <g opacity={0.15}>
        {/* Staircase */}
        {Array.from({ length: 8 }, (_, i) => (
          <line
            key={`stair-${i}`}
            x1={880}
            y1={575 - i * 18}
            x2={920}
            y2={575 - i * 18}
            strokeWidth={0.3}
          />
        ))}
        <line x1={880} y1={575} x2={880} y2={430} strokeWidth={0.3} />
        <line x1={920} y1={575} x2={920} y2={430} strokeWidth={0.3} />

        {/* Living room furniture outlines */}
        <rect x={400} y={520} width={60} height={30} rx={2} strokeWidth={0.3} />
        <rect x={480} y={530} width={30} height={20} rx={1} strokeWidth={0.25} />
        {/* Kitchen island */}
        <rect x={700} y={500} width={80} height={35} strokeWidth={0.3} />
      </g>

      {/* ============================================================
          CHIMNEY / VENT STACK
          ============================================================ */}
      <g opacity={0.6}>
        <rect x={820} y={220} width={18} height={30} strokeWidth={0.6} />
        <rect x={818} y={218} width={22} height={4} strokeWidth={0.4} />
        {/* Vent lines */}
        <line x1={824} y1={222} x2={824} y2={226} strokeWidth={0.2} />
        <line x1={829} y1={222} x2={829} y2={226} strokeWidth={0.2} />
        <line x1={834} y1={222} x2={834} y2={226} strokeWidth={0.2} />
      </g>

      {/* ============================================================
          SOLAR PANELS ON ROOF
          ============================================================ */}
      <g opacity={0.3}>
        {Array.from({ length: 3 }, (_, row) =>
          Array.from({ length: 6 }, (_, col) => (
            <rect
              key={`solar-${row}-${col}`}
              x={400 + col * 50}
              y={240 + row * 14}
              width={45}
              height={11}
              strokeWidth={0.25}
            />
          ))
        )}
        {/* Panel grid lines */}
        {Array.from({ length: 3 }, (_, row) =>
          Array.from({ length: 6 }, (_, col) => (
            <g key={`solar-detail-${row}-${col}`}>
              <line
                x1={400 + col * 50 + 22}
                y1={240 + row * 14}
                x2={400 + col * 50 + 22}
                y2={251 + row * 14}
                strokeWidth={0.15}
              />
              <line
                x1={400 + col * 50}
                y1={245 + row * 14}
                x2={445 + col * 50}
                y2={245 + row * 14}
                strokeWidth={0.15}
              />
            </g>
          ))
        )}
      </g>

      {/* ============================================================
          DIMENSION LINES & MEASUREMENTS
          ============================================================ */}
      <g opacity={0.55} fontSize={8} fontFamily="monospace" textAnchor="middle">
        {/* Overall width dimension */}
        <line x1={120} y1={780} x2={1180} y2={780} strokeWidth={0.3} />
        <line x1={120} y1={775} x2={120} y2={785} strokeWidth={0.3} />
        <line x1={1180} y1={775} x2={1180} y2={785} strokeWidth={0.3} />
        {/* Extension lines */}
        <line x1={120} y1={590} x2={120} y2={780} strokeWidth={0.15} strokeDasharray="2,3" />
        <line x1={1180} y1={590} x2={1180} y2={780} strokeWidth={0.15} strokeDasharray="2,3" />
        <text x={650} y={778} fill="currentColor" stroke="none" opacity={0.7}>
          32.00 m
        </text>

        {/* Main body width */}
        <line x1={280} y1={760} x2={960} y2={760} strokeWidth={0.3} />
        <line x1={280} y1={756} x2={280} y2={764} strokeWidth={0.3} />
        <line x1={960} y1={756} x2={960} y2={764} strokeWidth={0.3} />
        <text x={620} y={758} fill="currentColor" stroke="none" opacity={0.7}>
          20.40 m
        </text>

        {/* Height dimension — right side */}
        <line x1={1020} y1={580} x2={1020} y2={228} strokeWidth={0.3} />
        <line x1={1015} y1={580} x2={1025} y2={580} strokeWidth={0.3} />
        <line x1={1015} y1={228} x2={1025} y2={228} strokeWidth={0.3} />
        <text
          x={1035}
          y={404}
          fill="currentColor"
          stroke="none"
          opacity={0.7}
          transform="rotate(-90, 1035, 404)"
        >
          10.56 m
        </text>

        {/* Pool dimension */}
        <line x1={100} y1={740} x2={360} y2={740} strokeWidth={0.25} />
        <line x1={100} y1={736} x2={100} y2={744} strokeWidth={0.25} />
        <line x1={360} y1={736} x2={360} y2={744} strokeWidth={0.25} />
        <text x={230} y={738} fill="currentColor" stroke="none" opacity={0.6} fontSize={7}>
          7.80 m
        </text>

        {/* Left wing */}
        <line x1={140} y1={750} x2={280} y2={750} strokeWidth={0.25} />
        <line x1={140} y1={746} x2={140} y2={754} strokeWidth={0.25} />
        <line x1={280} y1={746} x2={280} y2={754} strokeWidth={0.25} />
        <text x={210} y={748} fill="currentColor" stroke="none" opacity={0.6} fontSize={7}>
          4.20 m
        </text>

        {/* Garage width */}
        <line x1={960} y1={750} x2={1160} y2={750} strokeWidth={0.25} />
        <line x1={960} y1={746} x2={960} y2={754} strokeWidth={0.25} />
        <line x1={1160} y1={746} x2={1160} y2={754} strokeWidth={0.25} />
        <text x={1060} y={748} fill="currentColor" stroke="none" opacity={0.6} fontSize={7}>
          6.00 m
        </text>

        {/* Window bay spacing */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const x = 340 + i * 100;
          return (
            <g key={`win-dim-${i}`}>
              <line x1={x} y1={582} x2={x + 70} y2={582} strokeWidth={0.15} />
              <line x1={x} y1={580} x2={x} y2={584} strokeWidth={0.15} />
              <line x1={x + 70} y1={580} x2={x + 70} y2={584} strokeWidth={0.15} />
            </g>
          );
        })}
      </g>

      {/* ============================================================
          LEVEL MARKERS
          ============================================================ */}
      <g opacity={0.6} fontSize={7} fontFamily="monospace">
        {/* Ground level */}
        <line x1={240} y1={580} x2={270} y2={580} strokeWidth={0.4} />
        <polygon points="270,578 276,580 270,582" strokeWidth={0.3} fill="currentColor" />
        <text x={215} y={583} fill="currentColor" stroke="none" fontSize={7}>
          +0.00
        </text>

        {/* First floor */}
        <line x1={240} y1={420} x2={270} y2={420} strokeWidth={0.4} />
        <polygon points="270,418 276,420 270,422" strokeWidth={0.3} fill="currentColor" />
        <text x={215} y={423} fill="currentColor" stroke="none" fontSize={7}>
          +3.50
        </text>

        {/* Second floor / roof */}
        <line x1={240} y1={290} x2={270} y2={290} strokeWidth={0.4} />
        <polygon points="270,288 276,290 270,292" strokeWidth={0.3} fill="currentColor" />
        <text x={215} y={293} fill="currentColor" stroke="none" fontSize={7}>
          +7.00
        </text>

        {/* Roof top */}
        <line x1={300} y1={228} x2={330} y2={228} strokeWidth={0.4} />
        <polygon points="330,226 336,228 330,230" strokeWidth={0.3} fill="currentColor" />
        <text x={275} y={231} fill="currentColor" stroke="none" fontSize={7}>
          +7.80
        </text>

        {/* Pool level */}
        <line x1={70} y1={720} x2={95} y2={720} strokeWidth={0.3} />
        <polygon points="95,718 100,720 95,722" strokeWidth={0.2} fill="currentColor" />
        <text x={48} y={723} fill="currentColor" stroke="none" fontSize={6}>
          -0.60
        </text>
      </g>

      {/* ============================================================
          COMPASS ROSE
          ============================================================ */}
      <g opacity={0.6} transform="translate(80, 180)">
        {/* Outer circle */}
        <circle cx={0} cy={0} r={28} strokeWidth={0.5} />
        <circle cx={0} cy={0} r={25} strokeWidth={0.2} />
        {/* Cardinal lines */}
        <line x1={0} y1={-25} x2={0} y2={25} strokeWidth={0.3} />
        <line x1={-25} y1={0} x2={25} y2={0} strokeWidth={0.3} />
        {/* Diagonal lines */}
        <line x1={-18} y1={-18} x2={18} y2={18} strokeWidth={0.15} />
        <line x1={18} y1={-18} x2={-18} y2={18} strokeWidth={0.15} />
        {/* North arrow */}
        <polygon points="0,-24 -5,-12 0,-15 5,-12" strokeWidth={0.4} fill="currentColor" />
        {/* Letters */}
        <text x={0} y={-32} fill="currentColor" stroke="none" textAnchor="middle" fontSize={9} fontWeight="bold">
          N
        </text>
        <text x={0} y={40} fill="currentColor" stroke="none" textAnchor="middle" fontSize={7}>
          S
        </text>
        <text x={36} y={4} fill="currentColor" stroke="none" textAnchor="middle" fontSize={7}>
          E
        </text>
        <text x={-36} y={4} fill="currentColor" stroke="none" textAnchor="middle" fontSize={7}>
          O
        </text>
        {/* Inner decorative circle */}
        <circle cx={0} cy={0} r={4} strokeWidth={0.3} />
        <circle cx={0} cy={0} r={1.5} strokeWidth={0.2} fill="currentColor" />
      </g>

      {/* ============================================================
          SCALE BAR
          ============================================================ */}
      <g opacity={0.6} transform="translate(80, 830)">
        <text x={0} y={-8} fill="currentColor" stroke="none" fontSize={7} fontFamily="monospace">
          ECHELLE 1:100
        </text>
        {/* Scale bar segments */}
        <rect x={0} y={0} width={20} height={4} strokeWidth={0.3} fill="currentColor" />
        <rect x={20} y={0} width={20} height={4} strokeWidth={0.3} />
        <rect x={40} y={0} width={20} height={4} strokeWidth={0.3} fill="currentColor" />
        <rect x={60} y={0} width={20} height={4} strokeWidth={0.3} />
        <rect x={80} y={0} width={20} height={4} strokeWidth={0.3} fill="currentColor" />
        {/* Scale labels */}
        <text x={0} y={14} fill="currentColor" stroke="none" fontSize={5} fontFamily="monospace" textAnchor="middle">
          0
        </text>
        <text x={20} y={14} fill="currentColor" stroke="none" fontSize={5} fontFamily="monospace" textAnchor="middle">
          2
        </text>
        <text x={40} y={14} fill="currentColor" stroke="none" fontSize={5} fontFamily="monospace" textAnchor="middle">
          4
        </text>
        <text x={60} y={14} fill="currentColor" stroke="none" fontSize={5} fontFamily="monospace" textAnchor="middle">
          6
        </text>
        <text x={80} y={14} fill="currentColor" stroke="none" fontSize={5} fontFamily="monospace" textAnchor="middle">
          8
        </text>
        <text x={100} y={14} fill="currentColor" stroke="none" fontSize={5} fontFamily="monospace" textAnchor="middle">
          10m
        </text>
      </g>

      {/* ============================================================
          TITLE BLOCK — Bottom right
          ============================================================ */}
      <g opacity={0.7}>
        {/* Outer frame */}
        <rect x={1050} y={800} width={320} height={80} strokeWidth={0.8} />
        {/* Inner dividers */}
        <line x1={1050} y1={825} x2={1370} y2={825} strokeWidth={0.4} />
        <line x1={1050} y1={850} x2={1370} y2={850} strokeWidth={0.3} />
        <line x1={1050} y1={865} x2={1370} y2={865} strokeWidth={0.2} />
        <line x1={1250} y1={850} x2={1250} y2={880} strokeWidth={0.2} />

        {/* Title text */}
        <text
          x={1210}
          y={818}
          fill="currentColor"
          stroke="none"
          textAnchor="middle"
          fontSize={10}
          fontFamily="monospace"
          fontWeight="bold"
          letterSpacing={1.5}
        >
          VILLA MEDITERRANEENNE
        </text>
        <text
          x={1210}
          y={842}
          fill="currentColor"
          stroke="none"
          textAnchor="middle"
          fontSize={8}
          fontFamily="monospace"
          letterSpacing={2}
        >
          PERSPECTIVE 3D
        </text>
        <text
          x={1150}
          y={862}
          fill="currentColor"
          stroke="none"
          textAnchor="middle"
          fontSize={7}
          fontFamily="monospace"
          opacity={0.8}
        >
          E-DOME ARCHITECTURE
        </text>
        <text
          x={1150}
          y={876}
          fill="currentColor"
          stroke="none"
          textAnchor="middle"
          fontSize={6}
          fontFamily="monospace"
          opacity={0.6}
        >
          DATE: 2026-04-07
        </text>
        <text
          x={1310}
          y={862}
          fill="currentColor"
          stroke="none"
          textAnchor="middle"
          fontSize={6}
          fontFamily="monospace"
          opacity={0.6}
        >
          ECH: 1:100
        </text>
        <text
          x={1310}
          y={876}
          fill="currentColor"
          stroke="none"
          textAnchor="middle"
          fontSize={6}
          fontFamily="monospace"
          opacity={0.6}
        >
          PLAN N° 001
        </text>

        {/* Corner ticks on title block */}
        <line x1={1048} y1={800} x2={1048} y2={810} strokeWidth={0.6} />
        <line x1={1050} y1={798} x2={1060} y2={798} strokeWidth={0.6} />
        <line x1={1372} y1={800} x2={1372} y2={810} strokeWidth={0.6} />
        <line x1={1360} y1={798} x2={1370} y2={798} strokeWidth={0.6} />
        <line x1={1048} y1={870} x2={1048} y2={880} strokeWidth={0.6} />
        <line x1={1050} y1={882} x2={1060} y2={882} strokeWidth={0.6} />
        <line x1={1372} y1={870} x2={1372} y2={880} strokeWidth={0.6} />
        <line x1={1360} y1={882} x2={1370} y2={882} strokeWidth={0.6} />
      </g>

      {/* ============================================================
          ADDITIONAL ARCHITECTURAL DETAILS
          ============================================================ */}

      {/* Pergola structure on terrace */}
      <g opacity={0.35}>
        {/* Pergola posts */}
        <line x1={460} y1={580} x2={460} y2={555} strokeWidth={0.4} />
        <line x1={530} y1={580} x2={530} y2={555} strokeWidth={0.4} />
        <line x1={600} y1={580} x2={600} y2={555} strokeWidth={0.4} />
        {/* Pergola beams */}
        <line x1={455} y1={555} x2={605} y2={555} strokeWidth={0.5} />
        <line x1={455} y1={558} x2={605} y2={558} strokeWidth={0.2} />
        {/* Pergola slats */}
        {Array.from({ length: 8 }, (_, i) => (
          <line
            key={`pergola-${i}`}
            x1={462 + i * 18}
            y1={553}
            x2={462 + i * 18}
            y2={560}
            strokeWidth={0.2}
          />
        ))}
      </g>

      {/* Outdoor kitchen / BBQ area */}
      <g opacity={0.35}>
        <rect x={660} y={590} width={40} height={25} strokeWidth={0.4} />
        <rect x={665} y={593} width={12} height={8} strokeWidth={0.2} />
        <circle cx={690} cy={597} r={4} strokeWidth={0.2} />
        <circle cx={690} cy={607} r={3} strokeWidth={0.2} />
      </g>

      {/* Planter boxes */}
      {[280, 680].map((x) => (
        <g key={`planter-${x}`} opacity={0.35}>
          <rect x={x} y={576} width={20} height={8} strokeWidth={0.3} />
          {/* Plant */}
          <line x1={x + 5} y1={576} x2={x + 3} y2={570} strokeWidth={0.2} />
          <line x1={x + 10} y1={576} x2={x + 10} y2={568} strokeWidth={0.2} />
          <line x1={x + 15} y1={576} x2={x + 17} y2={570} strokeWidth={0.2} />
          <circle cx={x + 3} cy={568} r={3} strokeWidth={0.15} />
          <circle cx={x + 10} cy={566} r={4} strokeWidth={0.15} />
          <circle cx={x + 17} cy={568} r={3} strokeWidth={0.15} />
        </g>
      ))}

      {/* Exterior wall sconce lights */}
      {[340, 590, 640, 940].map((x) => (
        <g key={`sconce-${x}`} opacity={0.4}>
          <rect x={x - 3} y={455} width={6} height={8} strokeWidth={0.25} />
          <line x1={x - 4} y1={455} x2={x + 4} y2={455} strokeWidth={0.2} />
        </g>
      ))}

      {/* Ground floor interior partition lines */}
      <g opacity={0.12}>
        <line x1={500} y1={425} x2={500} y2={575} strokeWidth={0.3} />
        <line x1={700} y1={425} x2={700} y2={575} strokeWidth={0.3} />
        <line x1={850} y1={425} x2={850} y2={575} strokeWidth={0.3} />
      </g>

      {/* Upper floor partition lines */}
      <g opacity={0.1}>
        <line x1={500} y1={275} x2={500} y2={415} strokeWidth={0.25} />
        <line x1={700} y1={275} x2={700} y2={415} strokeWidth={0.25} />
      </g>

      {/* Gutter / drainage line */}
      <g opacity={0.25}>
        <line x1={260} y1={292} x2={980} y2={292} strokeWidth={0.3} />
        {/* Downpipe */}
        <line x1={270} y1={292} x2={270} y2={580} strokeWidth={0.25} />
        <line x1={268} y1={292} x2={268} y2={580} strokeWidth={0.15} />
        <line x1={968} y1={292} x2={968} y2={580} strokeWidth={0.25} />
        <line x1={970} y1={292} x2={970} y2={580} strokeWidth={0.15} />
      </g>

      {/* ============================================================
          MATERIAL INDICATOR LABELS
          ============================================================ */}
      <g opacity={0.35} fontSize={5} fontFamily="monospace" fontStyle="italic">
        <text x={290} y={500} fill="currentColor" stroke="none" transform="rotate(-90,290,500)">
          PIERRE NATURELLE
        </text>
        <text x={500} y={570} fill="currentColor" stroke="none">
          BOIS EXOTIQUE IPE
        </text>
        <text x={200} y={710} fill="currentColor" stroke="none">
          BETON LISSE
        </text>
        <text x={1070} y={560} fill="currentColor" stroke="none">
          ACIER CORTEN
        </text>
      </g>

      {/* ============================================================
          ADDITIONAL GROUND DETAILS
          ============================================================ */}
      {/* Flower bed outline */}
      <g opacity={0.3}>
        <path
          d="M700,660 Q750,650 800,655 Q850,660 880,670 Q900,680 880,690 Q850,695 800,692 Q750,688 720,680 Q700,675 700,660 Z"
          strokeWidth={0.3}
        />
        {/* Plants inside */}
        {[720, 750, 780, 810, 840, 860].map((x, i) => (
          <g key={`flower-${i}`}>
            <circle cx={x} cy={670 + (i % 2) * 8} r={5} strokeWidth={0.15} />
            <circle cx={x} cy={668 + (i % 2) * 8} r={3} strokeWidth={0.1} />
          </g>
        ))}
      </g>

      {/* Water feature / fountain near entrance */}
      <g opacity={0.35}>
        <circle cx={550} cy={650} r={15} strokeWidth={0.4} />
        <circle cx={550} cy={650} r={12} strokeWidth={0.25} />
        <circle cx={550} cy={650} r={8} strokeWidth={0.2} />
        <circle cx={550} cy={650} r={3} strokeWidth={0.15} />
        {/* Water spray lines */}
        <line x1={550} y1={647} x2={550} y2={640} strokeWidth={0.15} />
        <line x1={547} y1={648} x2={544} y2={642} strokeWidth={0.1} />
        <line x1={553} y1={648} x2={556} y2={642} strokeWidth={0.1} />
      </g>

      {/* Mailbox at driveway */}
      <g opacity={0.35}>
        <rect x={618} y={668} width={6} height={10} strokeWidth={0.3} />
        <line x1={621} y1={668} x2={621} y2={663} strokeWidth={0.25} />
        <rect x={618} y={662} width={8} height={4} strokeWidth={0.2} />
      </g>

      {/* ============================================================
          ROOF EDGE DETAIL / FASCIA
          ============================================================ */}
      <g opacity={0.4}>
        {/* Fascia board detail */}
        <line x1={260} y1={288} x2={980} y2={288} strokeWidth={0.2} />
        {/* Soffit ventilation */}
        {Array.from({ length: 18 }, (_, i) => (
          <line
            key={`soffit-${i}`}
            x1={300 + i * 38}
            y1={288}
            x2={300 + i * 38}
            y2={292}
            strokeWidth={0.1}
          />
        ))}
      </g>

      {/* ============================================================
          WINDOW HEADER / LINTEL DETAILS
          ============================================================ */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = 340 + i * 100;
        return (
          <g key={`lintel-${i}`} opacity={0.3}>
            <line x1={x - 3} y1={428} x2={x + 73} y2={428} strokeWidth={0.3} />
            <line x1={x - 3} y1={426} x2={x + 73} y2={426} strokeWidth={0.15} />
          </g>
        );
      })}

      {/* ============================================================
          RAILING / FENCE along property
          ============================================================ */}
      <g opacity={0.2}>
        <line x1={50} y1={590} x2={100} y2={590} strokeWidth={0.3} />
        {Array.from({ length: 5 }, (_, i) => (
          <line
            key={`fence-${i}`}
            x1={55 + i * 12}
            y1={590}
            x2={55 + i * 12}
            y2={584}
            strokeWidth={0.2}
          />
        ))}
        <line x1={50} y1={584} x2={100} y2={584} strokeWidth={0.2} />
      </g>

      {/* ============================================================
          UPPER TERRACE DETAIL
          ============================================================ */}
      <g opacity={0.4}>
        {/* Upper terrace slab overhang */}
        <line x1={930} y1={420} x2={950} y2={420} strokeWidth={0.5} />
        <line x1={950} y1={420} x2={950} y2={390} strokeWidth={0.3} />
        {/* Upper deck planking */}
        {Array.from({ length: 5 }, (_, i) => (
          <line
            key={`udeck-${i}`}
            x1={935}
            y1={395 + i * 5}
            x2={950}
            y2={395 + i * 5}
            strokeWidth={0.1}
          />
        ))}
      </g>

      {/* ============================================================
          ADDITIONAL CROSS SECTION MARKS
          ============================================================ */}
      <g opacity={0.4}>
        {/* Section cut indicator A-A */}
        <line x1={620} y1={200} x2={620} y2={215} strokeWidth={0.4} />
        <circle cx={620} cy={198} r={6} strokeWidth={0.3} />
        <text x={620} y={201} fill="currentColor" stroke="none" textAnchor="middle" fontSize={7} fontFamily="monospace" fontWeight="bold">
          A
        </text>
        <line x1={620} y1={790} x2={620} y2={800} strokeWidth={0.4} />
        <circle cx={620} cy={803} r={6} strokeWidth={0.3} />
        <text x={620} y={806} fill="currentColor" stroke="none" textAnchor="middle" fontSize={7} fontFamily="monospace" fontWeight="bold">
          A
        </text>
        {/* Dashed section line */}
        <line x1={620} y1={215} x2={620} y2={790} strokeWidth={0.2} strokeDasharray="8,4,2,4" opacity={0.15} />
      </g>

      {/* ============================================================
          GRID AXIS LABELS (column grid)
          ============================================================ */}
      <g opacity={0.3} fontSize={7} fontFamily="monospace">
        {["1", "2", "3", "4", "5", "6", "7"].map((label, i) => {
          const x = 200 + i * 130;
          return (
            <g key={`axis-${label}`}>
              <circle cx={x} cy={810} r={8} strokeWidth={0.3} />
              <text x={x} y={813} fill="currentColor" stroke="none" textAnchor="middle" fontSize={7}>
                {label}
              </text>
              <line x1={x} y1={802} x2={x} y2={790} strokeWidth={0.15} strokeDasharray="2,2" />
            </g>
          );
        })}
        {["A", "B", "C", "D"].map((label, i) => {
          const y = 300 + i * 95;
          return (
            <g key={`axis-h-${label}`}>
              <circle cx={1080} cy={y} r={8} strokeWidth={0.3} />
              <text x={1080} y={y + 3} fill="currentColor" stroke="none" textAnchor="middle" fontSize={7}>
                {label}
              </text>
              <line x1={1072} y1={y} x2={1060} y2={y} strokeWidth={0.15} strokeDasharray="2,2" />
            </g>
          );
        })}
      </g>

      {/* ============================================================
          NORTH ARROW indicator on plan
          ============================================================ */}
      <g opacity={0.3} transform="translate(1300, 200)">
        <line x1={0} y1={15} x2={0} y2={-15} strokeWidth={0.4} />
        <polygon points="0,-15 -4,-8 0,-10 4,-8" strokeWidth={0.3} fill="currentColor" />
        <text x={0} y={-20} fill="currentColor" stroke="none" textAnchor="middle" fontSize={6} fontFamily="monospace">
          N
        </text>
      </g>

      {/* ============================================================
          MISC FINE DETAILS
          ============================================================ */}
      {/* AC unit on side wall */}
      <g opacity={0.25}>
        <rect x={126} y={540} width={10} height={14} strokeWidth={0.3} />
        <line x1={128} y1={543} x2={134} y2={543} strokeWidth={0.15} />
        <line x1={128} y1={546} x2={134} y2={546} strokeWidth={0.15} />
        <line x1={128} y1={549} x2={134} y2={549} strokeWidth={0.15} />
      </g>

      {/* Utility meter box */}
      <g opacity={0.2}>
        <rect x={955} y={530} width={8} height={10} strokeWidth={0.25} />
        <circle cx={959} cy={535} r={2} strokeWidth={0.15} />
      </g>

      {/* Address number */}
      <g opacity={0.4}>
        <text x={610} y={445} fill="currentColor" stroke="none" textAnchor="middle" fontSize={8} fontFamily="serif" fontWeight="bold">
          42
        </text>
      </g>

      {/* Decorative border frame for the entire drawing */}
      <rect x={20} y={20} width={1360} height={860} strokeWidth={0.6} opacity={0.2} />
      <rect x={25} y={25} width={1350} height={850} strokeWidth={0.2} opacity={0.1} />
    </svg>
  );
}
