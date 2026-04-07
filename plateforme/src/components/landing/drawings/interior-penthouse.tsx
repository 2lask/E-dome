"use client";

export function InteriorPenthouseDrawing({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 1400 800"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Penthouse Panoramique — Coupe Perspective — 1:75"
    >
      {/* ============================================================ */}
      {/* TITLE BLOCK                                                   */}
      {/* ============================================================ */}
      <g id="title-block">
        <rect x="1050" y="720" width="340" height="70" strokeWidth="1.5" />
        <line x1="1050" y1="745" x2="1390" y2="745" strokeWidth="0.5" />
        <line x1="1050" y1="762" x2="1390" y2="762" strokeWidth="0.5" />
        <line x1="1220" y1="745" x2="1220" y2="790" strokeWidth="0.5" />
        <text
          x="1220"
          y="738"
          textAnchor="middle"
          fontSize="9"
          fontFamily="monospace"
          fill="currentColor"
          stroke="none"
          fontWeight="bold"
        >
          PENTHOUSE PANORAMIQUE — COUPE PERSPECTIVE — 1:75
        </text>
        <text x="1060" y="757" fontSize="7" fontFamily="monospace" fill="currentColor" stroke="none">
          PROJET: E-DOME RÉSIDENCE
        </text>
        <text x="1060" y="775" fontSize="7" fontFamily="monospace" fill="currentColor" stroke="none">
          SURFACE: 285 m²
        </text>
        <text x="1060" y="785" fontSize="6" fontFamily="monospace" fill="currentColor" stroke="none">
          ÉTAGE: 18-19 (DUPLEX)
        </text>
        <text x="1230" y="757" fontSize="7" fontFamily="monospace" fill="currentColor" stroke="none">
          ÉCHELLE: 1:75
        </text>
        <text x="1230" y="775" fontSize="7" fontFamily="monospace" fill="currentColor" stroke="none">
          DATE: 2026-04-07
        </text>
        <text x="1230" y="785" fontSize="6" fontFamily="monospace" fill="currentColor" stroke="none">
          RÉV. A
        </text>
      </g>

      {/* ============================================================ */}
      {/* OUTER WALLS — thick structural                                */}
      {/* ============================================================ */}
      <g id="structure-walls">
        {/* Ground floor outer shell */}
        <rect x="40" y="360" width="1000" height="340" strokeWidth="3" />
        {/* Double-line wall thickness */}
        <rect x="48" y="368" width="984" height="324" strokeWidth="0.8" />

        {/* Mezzanine / upper level */}
        <rect x="40" y="100" width="500" height="260" strokeWidth="3" />
        <rect x="48" y="108" width="484" height="244" strokeWidth="0.8" />

        {/* Mezzanine floor slab */}
        <rect x="40" y="352" width="500" height="8" strokeWidth="1.5" />
        {/* Hatch pattern on slab section */}
        {Array.from({ length: 25 }, (_, i) => (
          <line
            key={`slab-hatch-${i}`}
            x1={40 + i * 20}
            y1="352"
            x2={50 + i * 20}
            y2="360"
            strokeWidth="0.3"
          />
        ))}

        {/* Ceiling slab ground floor right */}
        <line x1="540" y1="360" x2="1040" y2="360" strokeWidth="2" />
        <line x1="540" y1="365" x2="1040" y2="365" strokeWidth="0.5" />

        {/* Top ceiling mezzanine */}
        <line x1="40" y1="100" x2="540" y2="100" strokeWidth="3" />
        <line x1="40" y1="105" x2="540" y2="105" strokeWidth="0.5" />
      </g>

      {/* ============================================================ */}
      {/* INTERIOR PARTITION WALLS                                      */}
      {/* ============================================================ */}
      <g id="partitions">
        {/* Kitchen / Living divider (partial wall) */}
        <rect x="400" y="368" width="8" height="140" strokeWidth="1.2" />
        {/* Opening above partial wall */}

        {/* Bedroom wall */}
        <rect x="700" y="368" width="8" height="324" strokeWidth="1.2" />
        {/* Bedroom door opening */}
        <rect x="700" y="460" width="8" height="70" strokeWidth="0" />
        <line x1="700" y1="460" x2="700" y2="530" strokeWidth="0" />

        {/* Door swing arc — bedroom */}
        <path d="M 708 460 A 70 70 0 0 1 778 460" strokeWidth="0.5" strokeDasharray="3,2" />
        <line x1="708" y1="460" x2="778" y2="460" strokeWidth="0.5" strokeDasharray="3,2" />

        {/* Bathroom wall */}
        <rect x="870" y="368" width="8" height="324" strokeWidth="1.2" />
        {/* Bathroom door opening */}
        <rect x="870" y="500" width="8" height="60" strokeWidth="0" />
        {/* Door swing — bathroom */}
        <path d="M 878 500 A 60 60 0 0 1 938 500" strokeWidth="0.5" strokeDasharray="3,2" />

        {/* Walk-in closet partition */}
        <line x1="700" y1="580" x2="870" y2="580" strokeWidth="1.2" />
        <line x1="700" y1="586" x2="870" y2="586" strokeWidth="0.5" />
        {/* Closet door opening */}
        <path d="M 760 580 A 50 50 0 0 0 760 530" strokeWidth="0.5" strokeDasharray="3,2" />

        {/* Mezzanine partition — study / loft */}
        <rect x="300" y="108" width="6" height="244" strokeWidth="1" />
        {/* Door opening mezzanine */}
        <path d="M 306 200 A 50 50 0 0 1 356 200" strokeWidth="0.5" strokeDasharray="3,2" />
      </g>

      {/* ============================================================ */}
      {/* FLOOR PATTERNS                                                */}
      {/* ============================================================ */}
      <g id="floor-wood-pattern" opacity="0.25">
        {/* Wood plank lines — living/kitchen/dining */}
        {Array.from({ length: 30 }, (_, i) => (
          <line
            key={`wood-h-${i}`}
            x1="50"
            y1={375 + i * 10}
            x2="698"
            y2={375 + i * 10}
            strokeWidth="0.3"
          />
        ))}
        {/* Wood plank short breaks */}
        {Array.from({ length: 12 }, (_, i) => (
          <line
            key={`wood-v-${i}`}
            x1={100 + i * 50}
            y1="370"
            x2={100 + i * 50}
            y2="690"
            strokeWidth="0.15"
            strokeDasharray="8,12"
          />
        ))}
        {/* Bedroom wood floor */}
        {Array.from({ length: 20 }, (_, i) => (
          <line
            key={`bwood-${i}`}
            x1="710"
            y1={375 + i * 10}
            x2="868"
            y2={375 + i * 10}
            strokeWidth="0.3"
          />
        ))}
      </g>

      <g id="floor-tile-bathroom" opacity="0.2">
        {/* Tile grid — bathroom */}
        {Array.from({ length: 16 }, (_, i) => (
          <line
            key={`tile-h-${i}`}
            x1="880"
            y1={375 + i * 20}
            x2="1032"
            y2={375 + i * 20}
            strokeWidth="0.4"
          />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <line
            key={`tile-v-${i}`}
            x1={880 + i * 20}
            y1="370"
            x2={880 + i * 20}
            y2="690"
            strokeWidth="0.4"
          />
        ))}
      </g>

      <g id="floor-mezzanine-wood" opacity="0.2">
        {Array.from({ length: 24 }, (_, i) => (
          <line
            key={`mezz-floor-${i}`}
            x1="50"
            y1={115 + i * 10}
            x2="530"
            y2={115 + i * 10}
            strokeWidth="0.25"
          />
        ))}
      </g>

      {/* ============================================================ */}
      {/* FLOOR-TO-CEILING WINDOWS — left façade                       */}
      {/* ============================================================ */}
      <g id="windows-left">
        {/* Ground floor windows */}
        {[0, 1, 2, 3].map((i) => (
          <g key={`win-gf-${i}`}>
            <rect
              x="48"
              y={375 + i * 75}
              width="6"
              height="70"
              strokeWidth="0.8"
            />
            <line x1="51" y1={375 + i * 75} x2="51" y2={445 + i * 75} strokeWidth="0.3" />
            {/* Glazing indication */}
            <line x1="49" y1={410 + i * 75} x2="54" y2={410 + i * 75} strokeWidth="0.3" />
          </g>
        ))}
        {/* Mezzanine windows */}
        {[0, 1, 2].map((i) => (
          <g key={`win-mz-${i}`}>
            <rect x="48" y={115 + i * 75} width="6" height="70" strokeWidth="0.8" />
            <line x1="51" y1={115 + i * 75} x2="51" y2={185 + i * 75} strokeWidth="0.3" />
          </g>
        ))}
      </g>

      {/* ============================================================ */}
      {/* FLOOR-TO-CEILING WINDOWS — right / front façade              */}
      {/* ============================================================ */}
      <g id="windows-front">
        {/* Large panoramic windows across living/dining */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={`win-fr-${i}`}>
            <rect
              x={60 + i * 130}
              y="686"
              width="120"
              height="6"
              strokeWidth="0.8"
            />
            <line
              x1={60 + i * 130}
              y1="689"
              x2={180 + i * 130}
              y2="689"
              strokeWidth="0.3"
            />
            {/* Mullion */}
            <line
              x1={120 + i * 130}
              y1="686"
              x2={120 + i * 130}
              y2="692"
              strokeWidth="0.5"
            />
          </g>
        ))}
      </g>

      {/* ============================================================ */}
      {/* CITY SKYLINE SILHOUETTE (visible through windows)            */}
      {/* ============================================================ */}
      <g id="skyline" opacity="0.15">
        <path
          d="M 10 700 L 10 660 L 25 660 L 25 640 L 35 640 L 35 620 L 30 620 L 30 600
             L 45 600 L 45 580 L 50 575 L 55 580 L 55 610 L 65 610 L 65 590
             L 75 590 L 75 560 L 80 555 L 85 560 L 85 600 L 95 600 L 95 630
             L 105 630 L 105 650 L 115 650 L 115 700"
          strokeWidth="0.8"
        />
        <path
          d="M 10 750 L 10 710 L 20 710 L 20 690 L 30 685 L 40 690 L 40 700 L 50 700 L 50 750"
          strokeWidth="0.5"
          transform="translate(1050, -50)"
        />
        {/* Distant buildings */}
        <rect x="5" y="640" width="15" height="60" strokeWidth="0.4" />
        <rect x="22" y="610" width="12" height="90" strokeWidth="0.4" />
        <rect x="60" y="580" width="10" height="120" strokeWidth="0.4" />
        {/* Tower with antenna */}
        <line x1="80" y1="555" x2="80" y2="540" strokeWidth="0.5" />
        <circle cx="80" cy="538" r="2" strokeWidth="0.4" />
        {/* Additional skyline through front windows */}
        {[0, 1, 2, 3].map((i) => (
          <g key={`sky-${i}`} transform={`translate(${80 + i * 140}, 0)`}>
            <rect x="0" y="700" width="20" height="20" strokeWidth="0.3" />
            <rect x="25" y="695" width="15" height="25" strokeWidth="0.3" />
            <rect x="45" y="705" width="25" height="15" strokeWidth="0.3" />
            <line x1="10" y1="700" x2="10" y2="693" strokeWidth="0.3" />
          </g>
        ))}
      </g>

      {/* ============================================================ */}
      {/* CEILING BEAMS                                                 */}
      {/* ============================================================ */}
      <g id="ceiling-beams" opacity="0.3">
        {/* Ground floor beams */}
        {[0, 1, 2, 3].map((i) => (
          <g key={`beam-gf-${i}`}>
            <line
              x1={540 + i * 130}
              y1="365"
              x2={540 + i * 130}
              y2="690"
              strokeWidth="1.5"
              strokeDasharray="20,5"
            />
          </g>
        ))}
        {/* Mezzanine beams */}
        {[0, 1].map((i) => (
          <line
            key={`beam-mz-${i}`}
            x1={160 + i * 180}
            y1="105"
            x2={160 + i * 180}
            y2="350"
            strokeWidth="1.5"
            strokeDasharray="20,5"
          />
        ))}
      </g>

      {/* ============================================================ */}
      {/* RECESSED LIGHTING                                             */}
      {/* ============================================================ */}
      <g id="recessed-lights">
        {/* Living area lights */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={`light-liv-${i}`}>
            <circle
              cx={100 + (i % 3) * 120}
              cy={395 + Math.floor(i / 3) * 100}
              r="6"
              strokeWidth="0.5"
            />
            <circle
              cx={100 + (i % 3) * 120}
              cy={395 + Math.floor(i / 3) * 100}
              r="3"
              strokeWidth="0.3"
            />
          </g>
        ))}
        {/* Kitchen lights */}
        {[0, 1, 2].map((i) => (
          <g key={`light-kit-${i}`}>
            <circle cx={460 + i * 70} cy="400" r="6" strokeWidth="0.5" />
            <circle cx={460 + i * 70} cy="400" r="3" strokeWidth="0.3" />
          </g>
        ))}
        {/* Bedroom lights */}
        {[0, 1, 2, 3].map((i) => (
          <g key={`light-bed-${i}`}>
            <circle
              cx={740 + (i % 2) * 60}
              cy={400 + Math.floor(i / 2) * 70}
              r="5"
              strokeWidth="0.5"
            />
            <circle
              cx={740 + (i % 2) * 60}
              cy={400 + Math.floor(i / 2) * 70}
              r="2.5"
              strokeWidth="0.3"
            />
          </g>
        ))}
        {/* Bathroom lights */}
        {[0, 1].map((i) => (
          <g key={`light-bath-${i}`}>
            <circle cx={930 + i * 60} cy="400" r="5" strokeWidth="0.5" />
            <circle cx={930 + i * 60} cy="400" r="2.5" strokeWidth="0.3" />
          </g>
        ))}
        {/* Mezzanine lights */}
        {[0, 1, 2, 3].map((i) => (
          <g key={`light-mezz-${i}`}>
            <circle
              cx={120 + (i % 2) * 130}
              cy={150 + Math.floor(i / 2) * 100}
              r="5"
              strokeWidth="0.5"
            />
            <circle
              cx={120 + (i % 2) * 130}
              cy={150 + Math.floor(i / 2) * 100}
              r="2.5"
              strokeWidth="0.3"
            />
          </g>
        ))}
      </g>

      {/* ============================================================ */}
      {/* PENDANT LAMPS                                                 */}
      {/* ============================================================ */}
      <g id="pendant-lamps">
        {/* Dining pendant cluster */}
        {[0, 1, 2].map((i) => (
          <g key={`pendant-din-${i}`}>
            <line
              x1={220 + i * 30}
              y1="365"
              x2={220 + i * 30}
              y2={390 + i * 5}
              strokeWidth="0.5"
            />
            <ellipse
              cx={220 + i * 30}
              cy={395 + i * 5}
              rx="12"
              ry="6"
              strokeWidth="0.6"
            />
            <line
              x1={208 + i * 30}
              y1={395 + i * 5}
              x2={232 + i * 30}
              y2={395 + i * 5}
              strokeWidth="0.3"
            />
          </g>
        ))}
        {/* Kitchen island pendants */}
        {[0, 1, 2].map((i) => (
          <g key={`pendant-kit-${i}`}>
            <line
              x1={460 + i * 50}
              y1="365"
              x2={460 + i * 50}
              y2="405"
              strokeWidth="0.5"
            />
            <path
              d={`M ${448 + i * 50} 405 L ${460 + i * 50} 420 L ${472 + i * 50} 405`}
              strokeWidth="0.6"
            />
          </g>
        ))}
        {/* Bedroom pendant */}
        <line x1="770" y1="365" x2="770" y2="395" strokeWidth="0.5" />
        <circle cx="770" cy="400" r="10" strokeWidth="0.6" />
        <circle cx="770" cy="400" r="5" strokeWidth="0.3" />
      </g>

      {/* ============================================================ */}
      {/* LIVING ROOM — SOFA                                            */}
      {/* ============================================================ */}
      <g id="sofa">
        {/* L-shaped sofa outline */}
        <rect x="70" y="440" width="200" height="80" strokeWidth="1" />
        {/* Back cushions */}
        <rect x="70" y="440" width="200" height="20" strokeWidth="0.5" />
        {/* Seat cushions */}
        <line x1="137" y1="460" x2="137" y2="520" strokeWidth="0.3" />
        <line x1="204" y1="460" x2="204" y2="520" strokeWidth="0.3" />
        {/* L extension */}
        <rect x="70" y="520" width="80" height="60" strokeWidth="1" />
        <rect x="70" y="520" width="20" height="60" strokeWidth="0.5" />
        {/* Throw pillows */}
        <rect x="78" y="448" width="25" height="15" rx="3" strokeWidth="0.4" />
        <rect x="115" y="446" width="22" height="16" rx="3" strokeWidth="0.4" transform="rotate(-8, 126, 454)" />
        <rect x="220" y="448" width="25" height="15" rx="3" strokeWidth="0.4" />
        {/* Sofa legs */}
        <circle cx="75" cy="520" r="2" strokeWidth="0.3" />
        <circle cx="270" cy="520" r="2" strokeWidth="0.3" />
        <circle cx="75" cy="580" r="2" strokeWidth="0.3" />
        <circle cx="150" cy="580" r="2" strokeWidth="0.3" />
      </g>

      {/* ============================================================ */}
      {/* LIVING ROOM — COFFEE TABLE                                    */}
      {/* ============================================================ */}
      <g id="coffee-table">
        <rect x="160" y="470" width="90" height="45" rx="3" strokeWidth="0.8" />
        {/* Table surface detail */}
        <rect x="165" y="475" width="80" height="35" rx="2" strokeWidth="0.3" />
        {/* Objects on table */}
        <rect x="170" y="480" width="25" height="18" strokeWidth="0.3" /> {/* Book */}
        <circle cx="220" cy="490" r="8" strokeWidth="0.3" /> {/* Bowl */}
        <circle cx="220" cy="490" r="4" strokeWidth="0.2" />
        {/* Table legs */}
        <line x1="165" y1="515" x2="165" y2="520" strokeWidth="0.5" />
        <line x1="245" y1="515" x2="245" y2="520" strokeWidth="0.5" />
      </g>

      {/* ============================================================ */}
      {/* LIVING ROOM — TV UNIT                                         */}
      {/* ============================================================ */}
      <g id="tv-unit">
        {/* TV console */}
        <rect x="70" y="380" width="180" height="30" strokeWidth="0.8" />
        {/* Drawers */}
        <line x1="115" y1="380" x2="115" y2="410" strokeWidth="0.3" />
        <line x1="160" y1="380" x2="160" y2="410" strokeWidth="0.3" />
        <line x1="205" y1="380" x2="205" y2="410" strokeWidth="0.3" />
        {/* Drawer pulls */}
        <line x1="90" y1="395" x2="98" y2="395" strokeWidth="0.4" />
        <line x1="135" y1="395" x2="143" y2="395" strokeWidth="0.4" />
        <line x1="180" y1="395" x2="188" y2="395" strokeWidth="0.4" />
        <line x1="225" y1="395" x2="233" y2="395" strokeWidth="0.4" />
        {/* TV screen (wall-mounted above) */}
        <rect x="95" y="370" width="120" height="5" strokeWidth="0.6" />
        {/* TV bracket */}
        <line x1="155" y1="370" x2="155" y2="368" strokeWidth="0.5" />
        <line x1="145" y1="368" x2="165" y2="368" strokeWidth="0.5" />
      </g>

      {/* ============================================================ */}
      {/* LIVING ROOM — BOOKSHELVES                                     */}
      {/* ============================================================ */}
      <g id="bookshelves">
        {/* Tall bookshelf near partition */}
        <rect x="350" y="375" width="40" height="130" strokeWidth="0.8" />
        {/* Shelves */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`shelf-${i}`}
            x1="350"
            y1={400 + i * 22}
            x2="390"
            y2={400 + i * 22}
            strokeWidth="0.4"
          />
        ))}
        {/* Book spines */}
        {Array.from({ length: 8 }, (_, i) => (
          <line
            key={`book-${i}`}
            x1={354 + i * 4}
            y1="378"
            x2={354 + i * 4}
            y2="398"
            strokeWidth="0.3"
          />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line
            key={`book2-${i}`}
            x1={354 + i * 5}
            y1="402"
            x2={354 + i * 5}
            y2="420"
            strokeWidth="0.3"
          />
        ))}
        {/* Decorative objects */}
        <circle cx="380" cy="430" r="5" strokeWidth="0.3" /> {/* Globe */}
        <rect x="355" y="448" width="12" height="16" strokeWidth="0.3" /> {/* Frame */}
      </g>

      {/* ============================================================ */}
      {/* LIVING ROOM — RUG                                             */}
      {/* ============================================================ */}
      <g id="rug-living">
        <rect
          x="80"
          y="430"
          width="220"
          height="160"
          rx="2"
          strokeWidth="0.6"
          strokeDasharray="8,4"
        />
        {/* Rug border pattern */}
        <rect
          x="90"
          y="440"
          width="200"
          height="140"
          rx="1"
          strokeWidth="0.3"
          strokeDasharray="4,4"
        />
      </g>

      {/* ============================================================ */}
      {/* FIREPLACE (stone accent wall)                                 */}
      {/* ============================================================ */}
      <g id="fireplace">
        {/* Stone surround */}
        <rect x="280" y="370" width="60" height="100" strokeWidth="1" />
        {/* Firebox */}
        <rect x="290" y="410" width="40" height="50" strokeWidth="0.8" />
        <path d="M 290 410 L 310 395 L 330 410" strokeWidth="0.6" /> {/* Mantle arch */}
        {/* Stone texture */}
        {Array.from({ length: 5 }, (_, i) => (
          <g key={`stone-${i}`}>
            <line
              x1="280"
              y1={378 + i * 18}
              x2="340"
              y2={378 + i * 18}
              strokeWidth="0.3"
            />
            <line
              x1={300 + (i % 2) * 15}
              y1={378 + i * 18}
              x2={300 + (i % 2) * 15}
              y2={396 + i * 18}
              strokeWidth="0.3"
            />
          </g>
        ))}
        {/* Mantle shelf */}
        <rect x="275" y="395" width="70" height="5" strokeWidth="0.6" />
        {/* Objects on mantle */}
        <rect x="280" y="388" width="8" height="7" strokeWidth="0.3" /> {/* Candle */}
        <rect x="330" y="386" width="10" height="9" strokeWidth="0.3" /> {/* Frame */}
      </g>

      {/* ============================================================ */}
      {/* DINING AREA — TABLE & 8 CHAIRS                                */}
      {/* ============================================================ */}
      <g id="dining">
        {/* Dining table */}
        <rect x="140" y="600" width="180" height="75" rx="4" strokeWidth="1" />
        {/* Table grain lines */}
        <line x1="160" y1="605" x2="160" y2="670" strokeWidth="0.15" />
        <line x1="200" y1="605" x2="200" y2="670" strokeWidth="0.15" />
        <line x1="240" y1="605" x2="240" y2="670" strokeWidth="0.15" />
        <line x1="280" y1="605" x2="280" y2="670" strokeWidth="0.15" />
        {/* Table legs */}
        <circle cx="152" cy="610" r="3" strokeWidth="0.4" />
        <circle cx="308" cy="610" r="3" strokeWidth="0.4" />
        <circle cx="152" cy="665" r="3" strokeWidth="0.4" />
        <circle cx="308" cy="665" r="3" strokeWidth="0.4" />

        {/* 8 Chairs — top 4 */}
        {[0, 1, 2, 3].map((i) => (
          <g key={`chair-top-${i}`}>
            <rect
              x={155 + i * 42}
              y="585"
              width="28"
              height="12"
              rx="2"
              strokeWidth="0.6"
            />
            {/* Back rest */}
            <rect
              x={158 + i * 42}
              y="580"
              width="22"
              height="5"
              rx="1"
              strokeWidth="0.4"
            />
          </g>
        ))}
        {/* Bottom 4 chairs */}
        {[0, 1, 2, 3].map((i) => (
          <g key={`chair-bot-${i}`}>
            <rect
              x={155 + i * 42}
              y="678"
              width="28"
              height="12"
              rx="2"
              strokeWidth="0.6"
            />
            <rect
              x={158 + i * 42}
              y="690"
              width="22"
              height="5"
              rx="1"
              strokeWidth="0.4"
            />
          </g>
        ))}

        {/* Centerpiece on table */}
        <ellipse cx="230" cy="637" rx="20" ry="8" strokeWidth="0.4" />
        <line x1="225" y1="630" x2="225" y2="620" strokeWidth="0.3" /> {/* Flowers */}
        <circle cx="225" cy="618" r="4" strokeWidth="0.3" />
        <line x1="235" y1="632" x2="237" y2="622" strokeWidth="0.3" />
        <circle cx="237" cy="620" r="3" strokeWidth="0.3" />

        {/* Place settings (plates) */}
        {[0, 1, 2, 3].map((i) => (
          <g key={`plate-${i}`}>
            <circle cx={170 + i * 42} cy="610" r="7" strokeWidth="0.3" />
            <circle cx={170 + i * 42} cy="660" r="7" strokeWidth="0.3" />
          </g>
        ))}
      </g>

      {/* ============================================================ */}
      {/* DINING RUG                                                    */}
      {/* ============================================================ */}
      <g id="rug-dining">
        <rect
          x="120"
          y="575"
          width="230"
          height="120"
          rx="2"
          strokeWidth="0.5"
          strokeDasharray="6,4"
        />
      </g>

      {/* ============================================================ */}
      {/* KITCHEN ISLAND                                                */}
      {/* ============================================================ */}
      <g id="kitchen-island">
        <rect x="430" y="500" width="160" height="60" strokeWidth="1" />
        {/* Countertop overhang */}
        <rect x="425" y="498" width="170" height="4" strokeWidth="0.5" />
        {/* Sink */}
        <rect x="480" y="510" width="40" height="25" rx="5" strokeWidth="0.6" />
        <circle cx="500" cy="522" r="3" strokeWidth="0.3" /> {/* Drain */}
        {/* Faucet */}
        <path d="M 500 508 L 500 500 L 510 500 L 510 508" strokeWidth="0.4" />
        <circle cx="510" cy="508" r="1.5" strokeWidth="0.3" />
      </g>

      {/* ============================================================ */}
      {/* KITCHEN BAR STOOLS (4)                                        */}
      {/* ============================================================ */}
      <g id="bar-stools">
        {[0, 1, 2, 3].map((i) => (
          <g key={`stool-${i}`}>
            <circle
              cx={450 + i * 38}
              cy="575"
              r="10"
              strokeWidth="0.6"
            />
            <circle
              cx={450 + i * 38}
              cy="575"
              r="5"
              strokeWidth="0.3"
            />
            {/* Stool leg cross */}
            <line
              x1={445 + i * 38}
              y1="580"
              x2={455 + i * 38}
              y2="570"
              strokeWidth="0.3"
            />
            <line
              x1={445 + i * 38}
              y1="570"
              x2={455 + i * 38}
              y2="580"
              strokeWidth="0.3"
            />
          </g>
        ))}
      </g>

      {/* ============================================================ */}
      {/* KITCHEN CABINETS & RANGE HOOD                                 */}
      {/* ============================================================ */}
      <g id="kitchen-cabinets">
        {/* Upper cabinets along wall */}
        <rect x="410" y="375" width="220" height="35" strokeWidth="0.8" />
        {/* Cabinet doors */}
        {[0, 1, 2, 3].map((i) => (
          <g key={`cab-${i}`}>
            <rect
              x={415 + i * 53}
              y="378"
              width="48"
              height="29"
              strokeWidth="0.4"
            />
            <line
              x1={439 + i * 53}
              y1="385"
              x2={439 + i * 53}
              y2="400"
              strokeWidth="0.3"
            />
          </g>
        ))}

        {/* Lower cabinets */}
        <rect x="410" y="440" width="220" height="50" strokeWidth="0.8" />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={`lcab-${i}`}>
            <rect x={415 + i * 43} y="443" width="38" height="44" strokeWidth="0.3" />
            <line x1={434 + i * 43} y1="450" x2={434 + i * 43} y2="462" strokeWidth="0.3" />
          </g>
        ))}

        {/* Range hood */}
        <path
          d="M 480 375 L 470 365 L 550 365 L 540 375"
          strokeWidth="0.8"
        />
        <rect x="475" y="362" width="70" height="3" strokeWidth="0.5" />
        {/* Hood filter lines */}
        <line x1="485" y1="367" x2="535" y2="367" strokeWidth="0.3" />
        <line x1="485" y1="370" x2="535" y2="370" strokeWidth="0.3" />
        {/* Duct */}
        <rect x="500" y="352" width="20" height="10" strokeWidth="0.5" />

        {/* Cooktop on counter */}
        {[0, 1, 2, 3].map((i) => (
          <circle
            key={`burner-${i}`}
            cx={490 + (i % 2) * 30}
            cy={448 + Math.floor(i / 2) * 20}
            r="8"
            strokeWidth="0.4"
          />
        ))}

        {/* Refrigerator */}
        <rect x="630" y="375" width="50" height="115" strokeWidth="0.8" />
        <line x1="630" y1="440" x2="680" y2="440" strokeWidth="0.5" />
        <line x1="670" y1="400" x2="670" y2="435" strokeWidth="0.4" /> {/* Handle */}
        <line x1="670" y1="450" x2="670" y2="485" strokeWidth="0.4" />
      </g>

      {/* ============================================================ */}
      {/* MASTER BEDROOM — BED                                          */}
      {/* ============================================================ */}
      <g id="bedroom">
        {/* Bed frame */}
        <rect x="720" y="400" width="130" height="165" strokeWidth="1" />
        {/* Mattress */}
        <rect x="724" y="404" width="122" height="157" rx="3" strokeWidth="0.5" />
        {/* Pillows */}
        <rect x="728" y="408" width="54" height="25" rx="6" strokeWidth="0.5" />
        <rect x="788" y="408" width="54" height="25" rx="6" strokeWidth="0.5" />
        {/* Duvet fold line */}
        <path d="M 724 480 Q 785 470 846 480" strokeWidth="0.4" />
        <path d="M 724 490 Q 785 485 846 490" strokeWidth="0.3" />
        {/* Headboard */}
        <rect x="718" y="395" width="138" height="8" rx="2" strokeWidth="0.8" />

        {/* Nightstand left */}
        <rect x="712" y="400" width="5" height="40" strokeWidth="0" />
        <rect x="708" y="395" width="8" height="50" strokeWidth="0.6" />
        {/* Lamp */}
        <circle cx="712" cy="392" r="5" strokeWidth="0.4" />
        <line x1="712" y1="397" x2="712" y2="395" strokeWidth="0.4" />

        {/* Nightstand right */}
        <rect x="854" y="395" width="8" height="50" strokeWidth="0.6" />
        {/* Lamp */}
        <circle cx="858" cy="392" r="5" strokeWidth="0.4" />
        <line x1="858" y1="397" x2="858" y2="395" strokeWidth="0.4" />

        {/* Bedroom rug */}
        <rect
          x="730"
          y="550"
          width="110"
          height="25"
          strokeWidth="0.4"
          strokeDasharray="5,3"
        />
      </g>

      {/* ============================================================ */}
      {/* WALK-IN CLOSET                                                */}
      {/* ============================================================ */}
      <g id="walk-in-closet">
        {/* Hanging rails */}
        <line x1="712" y1="592" x2="860" y2="592" strokeWidth="0.5" />
        {/* Hangers */}
        {Array.from({ length: 15 }, (_, i) => (
          <g key={`hanger-${i}`}>
            <line
              x1={718 + i * 10}
              y1="592"
              x2={718 + i * 10}
              y2="620"
              strokeWidth="0.2"
            />
            <path
              d={`M ${714 + i * 10} 594 L ${718 + i * 10} 592 L ${722 + i * 10} 594`}
              strokeWidth="0.2"
            />
          </g>
        ))}
        {/* Shelving unit */}
        <rect x="712" y="630" width="60" height="55" strokeWidth="0.5" />
        {[0, 1, 2].map((i) => (
          <line
            key={`cshelf-${i}`}
            x1="712"
            y1={645 + i * 15}
            x2="772"
            y2={645 + i * 15}
            strokeWidth="0.3"
          />
        ))}
        {/* Shoe rack */}
        <rect x="790" y="650" width="70" height="35" strokeWidth="0.5" />
        {[0, 1].map((i) => (
          <line
            key={`shoe-${i}`}
            x1="790"
            y1={662 + i * 12}
            x2="860"
            y2={662 + i * 12}
            strokeWidth="0.3"
          />
        ))}
      </g>

      {/* ============================================================ */}
      {/* BATHROOM                                                      */}
      {/* ============================================================ */}
      <g id="bathroom">
        {/* Freestanding tub */}
        <ellipse cx="930" cy="440" rx="40" ry="20" strokeWidth="0.8" />
        <ellipse cx="930" cy="440" rx="35" ry="16" strokeWidth="0.4" />
        {/* Tub faucet */}
        <circle cx="965" cy="430" r="3" strokeWidth="0.3" />
        <line x1="965" y1="427" x2="965" y2="422" strokeWidth="0.4" />
        <line x1="960" y1="422" x2="965" y2="422" strokeWidth="0.4" />

        {/* Double vanity */}
        <rect x="885" y="375" width="140" height="35" strokeWidth="0.8" />
        {/* Sinks */}
        <ellipse cx="920" cy="390" rx="15" ry="10" strokeWidth="0.5" />
        <ellipse cx="990" cy="390" rx="15" ry="10" strokeWidth="0.5" />
        {/* Drains */}
        <circle cx="920" cy="392" r="2" strokeWidth="0.3" />
        <circle cx="990" cy="392" r="2" strokeWidth="0.3" />
        {/* Faucets */}
        <line x1="920" y1="380" x2="920" y2="376" strokeWidth="0.4" />
        <line x1="990" y1="380" x2="990" y2="376" strokeWidth="0.4" />
        {/* Mirror above vanity */}
        <rect x="895" y="368" width="120" height="5" strokeWidth="0.4" />

        {/* Glass shower enclosure */}
        <rect x="890" y="480" width="70" height="80" strokeWidth="0.5" strokeDasharray="8,3" />
        {/* Shower tray */}
        <rect x="893" y="483" width="64" height="74" rx="3" strokeWidth="0.8" />
        {/* Shower head */}
        <circle cx="925" cy="490" r="8" strokeWidth="0.4" />
        <circle cx="925" cy="490" r="4" strokeWidth="0.2" />
        {/* Shower drain */}
        <line x1="910" y1="550" x2="940" y2="550" strokeWidth="0.3" />
        <circle cx="925" cy="550" r="3" strokeWidth="0.3" />
        {/* Shower door handle */}
        <line x1="960" y1="510" x2="960" y2="530" strokeWidth="0.5" />

        {/* Toilet */}
        <ellipse cx="995" cy="530" rx="14" ry="18" strokeWidth="0.6" />
        <rect x="984" y="512" width="22" height="8" rx="3" strokeWidth="0.5" />
        {/* Tank */}
        <rect x="986" y="505" width="18" height="8" rx="2" strokeWidth="0.4" />

        {/* Heated towel rail */}
        <rect x="1010" y="470" width="15" height="50" strokeWidth="0.5" />
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`towel-${i}`}
            x1="1012"
            y1={478 + i * 9}
            x2="1023"
            y2={478 + i * 9}
            strokeWidth="0.4"
          />
        ))}

        {/* Bath mat */}
        <rect
          x="910"
          y="462"
          width="40"
          height="12"
          rx="2"
          strokeWidth="0.4"
          strokeDasharray="3,2"
        />
      </g>

      {/* ============================================================ */}
      {/* STAIRCASE                                                     */}
      {/* ============================================================ */}
      <g id="staircase">
        {/* Stair opening in floor */}
        <rect x="420" y="355" width="100" height="5" strokeWidth="0" />

        {/* Individual treads */}
        {Array.from({ length: 14 }, (_, i) => (
          <g key={`tread-${i}`}>
            <rect
              x="420"
              y={355 - i * 18}
              width="100"
              height="16"
              strokeWidth="0.6"
            />
            {/* Tread nose */}
            <line
              x1="420"
              y1={371 - i * 18}
              x2="520"
              y2={371 - i * 18}
              strokeWidth="0.3"
            />
          </g>
        ))}

        {/* Stringer left */}
        <line x1="420" y1="360" x2="420" y2="108" strokeWidth="1.2" />
        {/* Stringer right */}
        <line x1="520" y1="360" x2="520" y2="108" strokeWidth="1.2" />

        {/* Railing — left side */}
        <line x1="418" y1="360" x2="418" y2="108" strokeWidth="0.8" />
        {/* Balusters */}
        {Array.from({ length: 14 }, (_, i) => (
          <line
            key={`baluster-l-${i}`}
            x1="418"
            y1={355 - i * 18}
            x2="418"
            y2={345 - i * 18}
            strokeWidth="0.4"
          />
        ))}
        {/* Handrail top */}
        <line x1="416" y1="360" x2="416" y2="108" strokeWidth="0.5" />

        {/* Railing — right side */}
        <line x1="522" y1="360" x2="522" y2="108" strokeWidth="0.8" />
        {Array.from({ length: 14 }, (_, i) => (
          <line
            key={`baluster-r-${i}`}
            x1="522"
            y1={355 - i * 18}
            x2="522"
            y2={345 - i * 18}
            strokeWidth="0.4"
          />
        ))}
        <line x1="524" y1="360" x2="524" y2="108" strokeWidth="0.5" />

        {/* Arrow showing direction UP */}
        <line x1="470" y1="340" x2="470" y2="200" strokeWidth="0.5" />
        <path d="M 465 210 L 470 200 L 475 210" strokeWidth="0.5" />
        <text
          x="475"
          y="270"
          fontSize="7"
          fontFamily="monospace"
          fill="currentColor"
          stroke="none"
          transform="rotate(-90, 475, 270)"
        >
          MONTÉE
        </text>

        {/* Newel posts */}
        <rect x="415" y="355" width="8" height="8" strokeWidth="0.6" />
        <rect x="515" y="355" width="8" height="8" strokeWidth="0.6" />
        <rect x="415" y="103" width="8" height="8" strokeWidth="0.6" />
        <rect x="515" y="103" width="8" height="8" strokeWidth="0.6" />
      </g>

      {/* ============================================================ */}
      {/* MEZZANINE / LOFT LEVEL                                        */}
      {/* ============================================================ */}
      <g id="mezzanine">
        {/* Study desk */}
        <rect x="60" y="200" width="120" height="50" strokeWidth="0.8" />
        {/* Desk drawers */}
        <rect x="65" y="225" width="30" height="22" strokeWidth="0.3" />
        <line x1="80" y1="232" x2="80" y2="240" strokeWidth="0.3" />
        {/* Monitor */}
        <rect x="100" y="190" width="50" height="5" strokeWidth="0.5" />
        <line x1="125" y1="195" x2="125" y2="200" strokeWidth="0.4" />
        <rect x="118" y="200" width="14" height="3" strokeWidth="0.3" />
        {/* Keyboard */}
        <rect x="95" y="210" width="40" height="12" rx="1" strokeWidth="0.3" />
        {/* Mouse */}
        <ellipse cx="145" cy="216" rx="5" ry="7" strokeWidth="0.3" />

        {/* Office chair */}
        <circle cx="120" cy="270" r="14" strokeWidth="0.5" />
        <circle cx="120" cy="270" r="8" strokeWidth="0.3" />
        {/* Chair base wheels */}
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i * 72 * Math.PI) / 180;
          return (
            <circle
              key={`wheel-${i}`}
              cx={120 + 16 * Math.cos(angle)}
              cy={270 + 16 * Math.sin(angle)}
              r="2"
              strokeWidth="0.3"
            />
          );
        })}

        {/* Reading nook / lounge chair */}
        <rect x="60" y="310" width="50" height="35" rx="5" strokeWidth="0.6" />
        <rect x="60" y="310" width="12" height="35" rx="3" strokeWidth="0.4" />
        {/* Ottoman */}
        <rect x="115" y="318" width="25" height="20" rx="4" strokeWidth="0.5" />

        {/* Bookshelf on mezzanine wall */}
        <rect x="200" y="115" width="90" height="20" strokeWidth="0.6" />
        {Array.from({ length: 10 }, (_, i) => (
          <line
            key={`mbook-${i}`}
            x1={205 + i * 8}
            y1="117"
            x2={205 + i * 8}
            y2="133"
            strokeWidth="0.25"
          />
        ))}

        {/* Mezzanine railing (overlooking living room) */}
        <line x1="310" y1="352" x2="418" y2="352" strokeWidth="1" />
        {Array.from({ length: 6 }, (_, i) => (
          <line
            key={`mezz-bal-${i}`}
            x1={320 + i * 18}
            y1="352"
            x2={320 + i * 18}
            y2="340"
            strokeWidth="0.4"
          />
        ))}
        <line x1="310" y1="340" x2="418" y2="340" strokeWidth="0.6" />

        {/* Floor lamp */}
        <line x1="160" y1="340" x2="160" y2="310" strokeWidth="0.5" />
        <ellipse cx="160" cy="308" rx="8" ry="4" strokeWidth="0.4" />
        <circle cx="160" cy="342" r="5" strokeWidth="0.3" /> {/* Base */}
      </g>

      {/* ============================================================ */}
      {/* TERRACE (visible through right windows)                      */}
      {/* ============================================================ */}
      <g id="terrace" opacity="0.4">
        {/* Terrace floor area */}
        <rect x="1050" y="370" width="300" height="340" strokeWidth="1" strokeDasharray="10,5" />

        {/* Deck board lines */}
        {Array.from({ length: 15 }, (_, i) => (
          <line
            key={`deck-${i}`}
            x1="1055"
            y1={380 + i * 22}
            x2="1345"
            y2={380 + i * 22}
            strokeWidth="0.2"
          />
        ))}

        {/* Outdoor sofa */}
        <rect x="1070" y="420" width="120" height="50" strokeWidth="0.6" />
        <rect x="1070" y="420" width="120" height="15" strokeWidth="0.4" />
        {/* Cushions */}
        <line x1="1130" y1="435" x2="1130" y2="470" strokeWidth="0.3" />

        {/* Outdoor coffee table */}
        <rect x="1100" y="480" width="60" height="30" rx="3" strokeWidth="0.5" />

        {/* Lounge chairs */}
        <rect x="1200" y="420" width="80" height="35" rx="3" strokeWidth="0.5" />
        <rect x="1200" y="460" width="80" height="35" rx="3" strokeWidth="0.5" />
        {/* Side table */}
        <circle cx="1250" cy="455" r="10" strokeWidth="0.4" />

        {/* Planters */}
        <rect x="1060" y="380" width="25" height="25" strokeWidth="0.5" />
        <line x1="1072" y1="380" x2="1072" y2="370" strokeWidth="0.3" />
        <circle cx="1072" cy="367" r="5" strokeWidth="0.3" />

        <rect x="1300" y="380" width="25" height="25" strokeWidth="0.5" />
        <line x1="1312" y1="380" x2="1312" y2="370" strokeWidth="0.3" />
        <circle cx="1312" cy="367" r="5" strokeWidth="0.3" />

        {/* Outdoor dining */}
        <circle cx="1150" cy="600" r="30" strokeWidth="0.6" />
        {/* 6 chairs around */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i * 60 * Math.PI) / 180;
          return (
            <rect
              key={`ochair-${i}`}
              x={1150 + 42 * Math.cos(angle) - 8}
              y={600 + 42 * Math.sin(angle) - 8}
              width="16"
              height="16"
              rx="3"
              strokeWidth="0.4"
            />
          );
        })}

        {/* BBQ / Grill */}
        <rect x="1280" y="550" width="50" height="30" rx="5" strokeWidth="0.5" />
        <circle cx="1295" cy="565" r="5" strokeWidth="0.3" />
        <circle cx="1315" cy="565" r="5" strokeWidth="0.3" />

        {/* Railing */}
        <line x1="1050" y1="710" x2="1350" y2="710" strokeWidth="0.8" />
        {Array.from({ length: 16 }, (_, i) => (
          <line
            key={`rail-${i}`}
            x1={1060 + i * 19}
            y1="710"
            x2={1060 + i * 19}
            y2="700"
            strokeWidth="0.3"
          />
        ))}
        <line x1="1050" y1="700" x2="1350" y2="700" strokeWidth="0.5" />
      </g>

      {/* ============================================================ */}
      {/* CURTAINS                                                      */}
      {/* ============================================================ */}
      <g id="curtains" opacity="0.3">
        {/* Left window curtains */}
        <path d="M 55 375 Q 58 410 55 445 Q 58 480 55 515 Q 58 550 55 585 Q 58 620 55 655 Q 58 670 55 690" strokeWidth="0.5" />
        <path d="M 60 375 Q 63 410 60 445 Q 63 480 60 515" strokeWidth="0.5" />

        {/* Front window curtains — left drape */}
        <path d="M 60 692 Q 65 693 70 692 Q 75 693 80 692" strokeWidth="0.4" />
        {/* Front window curtains — right drape */}
        <path d="M 680 692 Q 685 693 690 692 Q 695 693 700 692" strokeWidth="0.4" />
      </g>

      {/* ============================================================ */}
      {/* POTTED PLANTS                                                 */}
      {/* ============================================================ */}
      <g id="plants">
        {/* Large floor plant — living room corner */}
        <rect x="62" y="415" width="18" height="20" strokeWidth="0.5" />
        <line x1="71" y1="415" x2="71" y2="400" strokeWidth="0.4" />
        <circle cx="71" cy="396" r="8" strokeWidth="0.3" />
        <circle cx="65" cy="400" r="5" strokeWidth="0.2" />
        <circle cx="78" cy="398" r="6" strokeWidth="0.2" />
        <line x1="68" y1="415" x2="62" y2="395" strokeWidth="0.2" />
        <line x1="74" y1="415" x2="80" y2="397" strokeWidth="0.2" />

        {/* Plant on dining table */}
        {/* (already included in dining centerpiece) */}

        {/* Kitchen windowsill plant */}
        <rect x="635" y="485" width="10" height="12" strokeWidth="0.4" />
        <line x1="640" y1="485" x2="640" y2="478" strokeWidth="0.3" />
        <circle cx="640" cy="475" r="5" strokeWidth="0.3" />

        {/* Bathroom plant */}
        <rect x="1020" y="438" width="10" height="12" strokeWidth="0.4" />
        <line x1="1025" y1="438" x2="1025" y2="430" strokeWidth="0.3" />
        <circle cx="1025" cy="427" r="5" strokeWidth="0.3" />
        <line x1="1022" y1="438" x2="1018" y2="428" strokeWidth="0.2" />
        <line x1="1028" y1="438" x2="1032" y2="430" strokeWidth="0.2" />

        {/* Mezzanine plant */}
        <rect x="280" y="328" width="12" height="15" strokeWidth="0.4" />
        <line x1="286" y1="328" x2="286" y2="318" strokeWidth="0.3" />
        <circle cx="286" cy="314" r="7" strokeWidth="0.3" />
        <circle cx="280" cy="318" r="4" strokeWidth="0.2" />
        <circle cx="292" cy="316" r="5" strokeWidth="0.2" />

        {/* Bedroom plant */}
        <rect x="840" y="555" width="10" height="12" strokeWidth="0.4" />
        <line x1="845" y1="555" x2="845" y2="548" strokeWidth="0.3" />
        <circle cx="845" cy="545" r="5" strokeWidth="0.3" />
      </g>

      {/* ============================================================ */}
      {/* CONSTRUCTION DIMENSION LINES                                  */}
      {/* ============================================================ */}
      <g id="dimensions" opacity="0.4">
        {/* Overall width — ground floor */}
        <line x1="40" y1="720" x2="1040" y2="720" strokeWidth="0.4" />
        <line x1="40" y1="715" x2="40" y2="725" strokeWidth="0.4" />
        <line x1="1040" y1="715" x2="1040" y2="725" strokeWidth="0.4" />
        <text x="520" y="718" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="currentColor" stroke="none">
          25 000 mm
        </text>

        {/* Living room width */}
        <line x1="48" y1="710" x2="400" y2="710" strokeWidth="0.3" />
        <line x1="48" y1="707" x2="48" y2="713" strokeWidth="0.3" />
        <line x1="400" y1="707" x2="400" y2="713" strokeWidth="0.3" />
        <text x="224" y="708" textAnchor="middle" fontSize="5" fontFamily="monospace" fill="currentColor" stroke="none">
          8 800 mm
        </text>

        {/* Kitchen width */}
        <line x1="408" y1="710" x2="700" y2="710" strokeWidth="0.3" />
        <line x1="408" y1="707" x2="408" y2="713" strokeWidth="0.3" />
        <line x1="700" y1="707" x2="700" y2="713" strokeWidth="0.3" />
        <text x="554" y="708" textAnchor="middle" fontSize="5" fontFamily="monospace" fill="currentColor" stroke="none">
          7 300 mm
        </text>

        {/* Bedroom width */}
        <line x1="708" y1="710" x2="870" y2="710" strokeWidth="0.3" />
        <line x1="708" y1="707" x2="708" y2="713" strokeWidth="0.3" />
        <line x1="870" y1="707" x2="870" y2="713" strokeWidth="0.3" />
        <text x="789" y="708" textAnchor="middle" fontSize="5" fontFamily="monospace" fill="currentColor" stroke="none">
          4 050 mm
        </text>

        {/* Bathroom width */}
        <line x1="878" y1="710" x2="1032" y2="710" strokeWidth="0.3" />
        <line x1="878" y1="707" x2="878" y2="713" strokeWidth="0.3" />
        <line x1="1032" y1="707" x2="1032" y2="713" strokeWidth="0.3" />
        <text x="955" y="708" textAnchor="middle" fontSize="5" fontFamily="monospace" fill="currentColor" stroke="none">
          3 850 mm
        </text>

        {/* Height — ground floor */}
        <line x1="1045" y1="360" x2="1045" y2="700" strokeWidth="0.3" />
        <line x1="1042" y1="360" x2="1048" y2="360" strokeWidth="0.3" />
        <line x1="1042" y1="700" x2="1048" y2="700" strokeWidth="0.3" />
        <text x="1047" y="530" fontSize="5" fontFamily="monospace" fill="currentColor" stroke="none" transform="rotate(-90, 1047, 530)">
          3 200 mm (h.s.p.)
        </text>

        {/* Height — mezzanine */}
        <line x1="535" y1="100" x2="535" y2="352" strokeWidth="0.3" />
        <line x1="532" y1="100" x2="538" y2="100" strokeWidth="0.3" />
        <line x1="532" y1="352" x2="538" y2="352" strokeWidth="0.3" />
        <text x="537" y="226" fontSize="5" fontFamily="monospace" fill="currentColor" stroke="none" transform="rotate(-90, 537, 226)">
          2 800 mm (h.s.p.)
        </text>

        {/* Stair dimension */}
        <line x1="415" y1="95" x2="525" y2="95" strokeWidth="0.3" />
        <line x1="415" y1="92" x2="415" y2="98" strokeWidth="0.3" />
        <line x1="525" y1="92" x2="525" y2="98" strokeWidth="0.3" />
        <text x="470" y="93" textAnchor="middle" fontSize="5" fontFamily="monospace" fill="currentColor" stroke="none">
          2 500 mm
        </text>

        {/* Furniture dimension — sofa */}
        <line x1="70" y1="435" x2="270" y2="435" strokeWidth="0.2" strokeDasharray="2,2" />
        <text x="170" y="433" textAnchor="middle" fontSize="4" fontFamily="monospace" fill="currentColor" stroke="none">
          2 400
        </text>

        {/* Furniture dimension — bed */}
        <line x1="720" y1="570" x2="850" y2="570" strokeWidth="0.2" strokeDasharray="2,2" />
        <text x="785" y="568" textAnchor="middle" fontSize="4" fontFamily="monospace" fill="currentColor" stroke="none">
          1 600
        </text>
      </g>

      {/* ============================================================ */}
      {/* ROOM LABELS                                                   */}
      {/* ============================================================ */}
      <g id="room-labels">
        <text x="200" y="545" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="currentColor" stroke="none" fontWeight="bold">
          SÉJOUR
        </text>
        <text x="200" y="556" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="currentColor" stroke="none">
          52 m²
        </text>

        <text x="540" y="640" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="currentColor" stroke="none" fontWeight="bold">
          CUISINE
        </text>
        <text x="540" y="651" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="currentColor" stroke="none">
          38 m²
        </text>

        <text x="230" y="670" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="currentColor" stroke="none" fontWeight="bold">
          SALLE À MANGER
        </text>
        <text x="230" y="680" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="currentColor" stroke="none">
          28 m²
        </text>

        <text x="785" y="485" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="currentColor" stroke="none" fontWeight="bold">
          CH. PRINCIPALE
        </text>
        <text x="785" y="496" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="currentColor" stroke="none">
          25 m²
        </text>

        <text x="785" y="618" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="currentColor" stroke="none" fontWeight="bold">
          DRESSING
        </text>
        <text x="785" y="628" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="currentColor" stroke="none">
          12 m²
        </text>

        <text x="960" y="620" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="currentColor" stroke="none" fontWeight="bold">
          SDB
        </text>
        <text x="960" y="631" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="currentColor" stroke="none">
          18 m²
        </text>

        <text x="170" y="180" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="currentColor" stroke="none" fontWeight="bold">
          BUREAU / LOFT
        </text>
        <text x="170" y="191" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="currentColor" stroke="none">
          35 m²
        </text>

        <text x="1200" y="415" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="currentColor" stroke="none" fontWeight="bold" opacity="0.4">
          TERRASSE
        </text>
        <text x="1200" y="426" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="currentColor" stroke="none" opacity="0.4">
          45 m²
        </text>
      </g>

      {/* ============================================================ */}
      {/* NORTH ARROW & SCALE BAR                                       */}
      {/* ============================================================ */}
      <g id="north-arrow" transform="translate(30, 740)">
        <line x1="0" y1="40" x2="0" y2="10" strokeWidth="0.8" />
        <path d="M -5 18 L 0 8 L 5 18" strokeWidth="0.8" />
        <text x="0" y="6" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="currentColor" stroke="none" fontWeight="bold">
          N
        </text>
      </g>

      <g id="scale-bar" transform="translate(60, 765)">
        <line x1="0" y1="0" x2="200" y2="0" strokeWidth="0.8" />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={`scale-${i}`}>
            <line x1={i * 50} y1="-3" x2={i * 50} y2="3" strokeWidth="0.5" />
            <text
              x={i * 50}
              y="10"
              textAnchor="middle"
              fontSize="5"
              fontFamily="monospace"
              fill="currentColor"
              stroke="none"
            >
              {i * 2}m
            </text>
          </g>
        ))}
        {/* Alternating fills for scale bar */}
        {[0, 2].map((i) => (
          <rect
            key={`sbar-${i}`}
            x={i * 50}
            y="-2"
            width="50"
            height="4"
            strokeWidth="0.3"
          />
        ))}
      </g>

      {/* ============================================================ */}
      {/* SECTION CUT INDICATORS                                        */}
      {/* ============================================================ */}
      <g id="section-cuts" opacity="0.35">
        {/* Section line A-A */}
        <line x1="20" y1="530" x2="1050" y2="530" strokeWidth="0.3" strokeDasharray="15,5,3,5" />
        <circle cx="15" cy="530" r="8" strokeWidth="0.5" />
        <text x="15" y="533" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="currentColor" stroke="none" fontWeight="bold">
          A
        </text>
        <circle cx="1055" cy="530" r="8" strokeWidth="0.5" />
        <text x="1055" y="533" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="currentColor" stroke="none" fontWeight="bold">
          A
        </text>
      </g>

      {/* ============================================================ */}
      {/* MATERIAL HATCHING                                             */}
      {/* ============================================================ */}
      <g id="wall-hatching" opacity="0.15">
        {/* Cross-hatching on cut walls (structural) */}
        {/* Left wall section */}
        {Array.from({ length: 40 }, (_, i) => (
          <line
            key={`hatch-lw-${i}`}
            x1="40"
            y1={365 + i * 8}
            x2="48"
            y2={369 + i * 8}
            strokeWidth="0.3"
          />
        ))}
        {/* Right wall section */}
        {Array.from({ length: 40 }, (_, i) => (
          <line
            key={`hatch-rw-${i}`}
            x1="1032"
            y1={365 + i * 8}
            x2="1040"
            y2={369 + i * 8}
            strokeWidth="0.3"
          />
        ))}
        {/* Bottom wall */}
        {Array.from({ length: 50 }, (_, i) => (
          <line
            key={`hatch-bw-${i}`}
            x1={48 + i * 20}
            y1="692"
            x2={52 + i * 20}
            y2="700"
            strokeWidth="0.3"
          />
        ))}
      </g>

      {/* ============================================================ */}
      {/* ELECTRICAL SYMBOLS                                            */}
      {/* ============================================================ */}
      <g id="electrical" opacity="0.3">
        {/* Power outlets — living */}
        {[0, 1, 2].map((i) => (
          <g key={`outlet-liv-${i}`}>
            <circle cx={100 + i * 120} cy="688" r="3" strokeWidth="0.4" />
            <line x1={98 + i * 120} y1="688" x2={102 + i * 120} y2="688" strokeWidth="0.3" />
            <line x1={100 + i * 120} y1="686" x2={100 + i * 120} y2="690" strokeWidth="0.3" />
          </g>
        ))}
        {/* Switches */}
        {[0, 1].map((i) => (
          <g key={`switch-${i}`}>
            <circle cx={410 + i * 300} cy="685" r="2.5" strokeWidth="0.4" />
            <line x1={410 + i * 300} y1="685" x2={413 + i * 300} y2="682" strokeWidth="0.3" />
          </g>
        ))}
      </g>

      {/* ============================================================ */}
      {/* ARTWORK / WALL DECORATIONS                                    */}
      {/* ============================================================ */}
      <g id="wall-art" opacity="0.25">
        {/* Large painting — living room */}
        <rect x="165" y="372" width="55" height="3" strokeWidth="0.5" />
        {/* Gallery wall — mezzanine */}
        <rect x="70" y="115" width="20" height="15" strokeWidth="0.4" />
        <rect x="95" y="112" width="15" height="20" strokeWidth="0.4" />
        <rect x="115" y="116" width="18" height="13" strokeWidth="0.4" />
        {/* Bedroom art */}
        <rect x="760" y="372" width="40" height="3" strokeWidth="0.4" />
      </g>

      {/* ============================================================ */}
      {/* LEVEL INDICATORS                                              */}
      {/* ============================================================ */}
      <g id="levels" opacity="0.5">
        {/* Ground floor level */}
        <line x1="25" y1="692" x2="40" y2="692" strokeWidth="0.5" />
        <path d="M 25 692 L 32 688 L 32 696 Z" strokeWidth="0.3" />
        <text x="10" y="695" textAnchor="middle" fontSize="5" fontFamily="monospace" fill="currentColor" stroke="none">
          ±0.00
        </text>

        {/* Mezzanine level */}
        <line x1="25" y1="352" x2="40" y2="352" strokeWidth="0.5" />
        <path d="M 25 352 L 32 348 L 32 356 Z" strokeWidth="0.3" />
        <text x="10" y="355" textAnchor="middle" fontSize="5" fontFamily="monospace" fill="currentColor" stroke="none">
          +3.20
        </text>

        {/* Upper ceiling */}
        <line x1="25" y1="100" x2="40" y2="100" strokeWidth="0.5" />
        <path d="M 25 100 L 32 96 L 32 104 Z" strokeWidth="0.3" />
        <text x="10" y="103" textAnchor="middle" fontSize="5" fontFamily="monospace" fill="currentColor" stroke="none">
          +6.00
        </text>
      </g>

      {/* ============================================================ */}
      {/* ADDITIONAL DETAIL ELEMENTS                                    */}
      {/* ============================================================ */}

      {/* AC vent grilles on ceiling */}
      <g id="ac-vents" opacity="0.2">
        <rect x="180" y="363" width="30" height="4" strokeWidth="0.4" />
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`vent1-${i}`} x1={183 + i * 6} y1="363" x2={183 + i * 6} y2="367" strokeWidth="0.2" />
        ))}
        <rect x="600" y="363" width="30" height="4" strokeWidth="0.4" />
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`vent2-${i}`} x1={603 + i * 6} y1="363" x2={603 + i * 6} y2="367" strokeWidth="0.2" />
        ))}
        <rect x="800" y="363" width="25" height="4" strokeWidth="0.4" />
        <rect x="950" y="363" width="25" height="4" strokeWidth="0.4" />
      </g>

      {/* Baseboard / skirting lines */}
      <g id="baseboards" opacity="0.15">
        <line x1="55" y1="688" x2="698" y2="688" strokeWidth="0.5" />
        <line x1="55" y1="372" x2="350" y2="372" strokeWidth="0.5" />
        <line x1="710" y1="372" x2="868" y2="372" strokeWidth="0.5" />
        <line x1="880" y1="372" x2="1032" y2="372" strokeWidth="0.5" />
      </g>

      {/* Crown molding indication */}
      <g id="crown-molding" opacity="0.12">
        <line x1="55" y1="367" x2="398" y2="367" strokeWidth="0.8" />
        <line x1="710" y1="367" x2="868" y2="367" strokeWidth="0.8" />
        <line x1="880" y1="367" x2="1032" y2="367" strokeWidth="0.8" />
        <line x1="55" y1="110" x2="298" y2="110" strokeWidth="0.8" />
        <line x1="310" y1="110" x2="530" y2="110" strokeWidth="0.8" />
      </g>

      {/* Smoke detector symbols */}
      <g id="smoke-detectors" opacity="0.2">
        {[200, 500, 780, 960, 170].map((x, i) => {
          const y = i < 4 ? 370 : 112;
          return (
            <g key={`smoke-${i}`}>
              <circle cx={x} cy={y} r="4" strokeWidth="0.3" />
              <text x={x} y={y + 2} textAnchor="middle" fontSize="4" fontFamily="monospace" fill="currentColor" stroke="none">
                SD
              </text>
            </g>
          );
        })}
      </g>

      {/* Door thresholds */}
      <g id="thresholds" opacity="0.3">
        <line x1="700" y1="460" x2="700" y2="530" strokeWidth="0.8" strokeDasharray="2,1" />
        <line x1="870" y1="500" x2="870" y2="560" strokeWidth="0.8" strokeDasharray="2,1" />
      </g>

      {/* Window sill details */}
      <g id="window-sills" opacity="0.2">
        {[0, 1, 2, 3].map((i) => (
          <rect key={`sill-${i}`} x="48" y={443 + i * 75} width="10" height="3" strokeWidth="0.3" />
        ))}
      </g>

      {/* Column / structural pillar */}
      <g id="columns" opacity="0.4">
        <rect x="396" y="365" width="12" height="12" strokeWidth="0.8" />
        {/* Cross */}
        <line x1="396" y1="365" x2="408" y2="377" strokeWidth="0.3" />
        <line x1="408" y1="365" x2="396" y2="377" strokeWidth="0.3" />

        <rect x="396" y="685" width="12" height="12" strokeWidth="0.8" />
        <line x1="396" y1="685" x2="408" y2="697" strokeWidth="0.3" />
        <line x1="408" y1="685" x2="396" y2="697" strokeWidth="0.3" />
      </g>

      {/* Grid reference markers */}
      <g id="grid-refs" opacity="0.25">
        {["A", "B", "C", "D", "E"].map((label, i) => (
          <g key={`grid-${label}`}>
            <circle cx={48 + i * 250} cy="750" r="8" strokeWidth="0.4" />
            <text
              x={48 + i * 250}
              y="753"
              textAnchor="middle"
              fontSize="7"
              fontFamily="monospace"
              fill="currentColor"
              stroke="none"
              fontWeight="bold"
            >
              {label}
            </text>
            <line
              x1={48 + i * 250}
              y1="742"
              x2={48 + i * 250}
              y2="700"
              strokeWidth="0.3"
              strokeDasharray="3,3"
            />
          </g>
        ))}
        {["1", "2", "3"].map((label, i) => (
          <g key={`grid-num-${label}`}>
            <circle cx="1060" cy={370 + i * 160} r="8" strokeWidth="0.4" />
            <text
              x="1060"
              y={373 + i * 160}
              textAnchor="middle"
              fontSize="7"
              fontFamily="monospace"
              fill="currentColor"
              stroke="none"
              fontWeight="bold"
            >
              {label}
            </text>
          </g>
        ))}
      </g>

      {/* Revision cloud on a detail area */}
      <g id="revision-cloud" opacity="0.2">
        <path
          d="M 880 460 Q 890 455 900 460 Q 910 455 920 460 Q 930 455 940 460
             Q 945 470 940 480 Q 945 490 940 500
             Q 930 505 920 500 Q 910 505 900 500 Q 890 505 880 500
             Q 875 490 880 480 Q 875 470 880 460"
          strokeWidth="0.5"
        />
      </g>
    </svg>
  );
}
