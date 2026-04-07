"use client";

export function ChaletAlpineDrawing({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1400 900"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Dessin architectural du Chalet Grand Panorama — Élévation 3D"
    >
      {/* ============================================================
          BACKGROUND — MOUNTAIN RANGE SILHOUETTES (multiple layers)
          ============================================================ */}
      {/* Far mountain range — layer 1 (faintest) */}
      <polyline
        points="0,320 40,290 90,260 140,230 180,210 220,195 280,175 330,160 370,145 420,155 460,140 510,120 550,110 590,125 630,100 670,90 710,105 750,85 790,95 830,110 870,90 910,80 950,95 990,75 1030,85 1070,100 1110,80 1150,90 1190,110 1230,95 1270,105 1310,120 1350,100 1400,115"
        strokeWidth="0.3"
        opacity="0.25"
      />
      {/* Mid mountain range — layer 2 */}
      <polyline
        points="0,370 50,345 100,320 140,300 190,280 230,265 270,250 320,240 370,225 410,235 450,215 500,200 540,190 580,210 620,185 660,170 700,185 740,165 780,175 820,195 860,170 900,160 940,180 980,155 1020,165 1060,185 1100,160 1140,175 1180,200 1220,180 1260,190 1300,210 1340,195 1400,205"
        strokeWidth="0.4"
        opacity="0.3"
      />
      {/* Near mountain range — layer 3 */}
      <polyline
        points="0,420 60,395 110,370 160,355 210,335 260,325 310,310 350,300 400,290 440,305 480,280 530,265 570,255 610,270 650,250 690,240 730,260 770,245 810,255 850,275 890,250 930,235 970,260 1010,240 1050,250 1090,270 1130,245 1170,260 1210,280 1250,265 1290,275 1330,290 1370,270 1400,285"
        strokeWidth="0.5"
        opacity="0.35"
      />
      {/* Closest foothills — layer 4 */}
      <polyline
        points="0,470 70,450 130,435 200,420 270,415 340,405 400,395 460,400 520,385 580,390 640,380 700,375 760,385 820,370 880,365 940,375 1000,360 1060,370 1120,380 1180,365 1240,375 1300,385 1360,375 1400,380"
        strokeWidth="0.5"
        opacity="0.4"
      />

      {/* Mountain peak accent lines */}
      <line x1="630" y1="100" x2="660" y2="90" strokeWidth="0.2" opacity="0.2" />
      <line x1="660" y1="90" x2="690" y2="95" strokeWidth="0.2" opacity="0.2" />
      <line x1="750" y1="85" x2="770" y2="80" strokeWidth="0.2" opacity="0.15" />
      <line x1="910" y1="80" x2="935" y2="72" strokeWidth="0.2" opacity="0.15" />
      <line x1="990" y1="75" x2="1010" y2="70" strokeWidth="0.2" opacity="0.15" />

      {/* Snow caps on distant peaks */}
      <polyline points="625,105 630,100 640,96 650,93 660,90 670,92" strokeWidth="0.2" opacity="0.2" strokeDasharray="1.5,1" />
      <polyline points="745,90 750,85 758,82 765,80 772,82" strokeWidth="0.2" opacity="0.2" strokeDasharray="1.5,1" />
      <polyline points="905,85 910,80 920,76 930,73 940,78" strokeWidth="0.2" opacity="0.18" strokeDasharray="1.5,1" />
      <polyline points="985,80 990,75 1000,72 1010,70 1020,74" strokeWidth="0.2" opacity="0.18" strokeDasharray="1.5,1" />

      {/* ============================================================
          GROUND CONTOUR LINES (terrain slope)
          ============================================================ */}
      <path d="M0,680 Q200,670 400,665 Q600,658 800,655 Q1000,660 1200,668 Q1350,675 1400,680" strokeWidth="0.3" opacity="0.2" />
      <path d="M0,700 Q200,690 400,685 Q600,678 800,675 Q1000,680 1200,688 Q1350,695 1400,700" strokeWidth="0.3" opacity="0.2" />
      <path d="M0,720 Q200,712 400,707 Q600,700 800,697 Q1000,702 1200,710 Q1350,717 1400,720" strokeWidth="0.3" opacity="0.2" />
      <path d="M0,740 Q200,733 400,728 Q600,722 800,720 Q1000,724 1200,732 Q1350,738 1400,740" strokeWidth="0.3" opacity="0.15" />
      <path d="M0,760 Q200,754 400,750 Q600,745 800,743 Q1000,747 1200,754 Q1350,758 1400,760" strokeWidth="0.3" opacity="0.15" />
      <path d="M0,780 Q200,775 400,772 Q600,768 800,766 Q1000,770 1200,776 Q1350,780 1400,782" strokeWidth="0.25" opacity="0.12" />
      <path d="M0,800 Q200,796 400,793 Q600,790 800,788 Q1000,791 1200,796 Q1350,800 1400,802" strokeWidth="0.25" opacity="0.1" />

      {/* ============================================================
          STONE PATHWAY TO ENTRANCE
          ============================================================ */}
      {/* Path edges */}
      <path d="M620,680 Q610,710 605,740 Q600,770 590,800 Q580,840 570,880 Q565,900 560,920" strokeWidth="0.6" opacity="0.4" />
      <path d="M690,680 Q700,710 710,740 Q720,770 740,800 Q760,840 780,880 Q790,900 800,920" strokeWidth="0.6" opacity="0.4" />
      {/* Stone coursing on path */}
      <line x1="612" y1="700" x2="698" y2="700" strokeWidth="0.3" opacity="0.25" />
      <line x1="608" y1="720" x2="706" y2="720" strokeWidth="0.3" opacity="0.25" />
      <line x1="604" y1="740" x2="714" y2="740" strokeWidth="0.3" opacity="0.25" />
      <line x1="598" y1="760" x2="724" y2="760" strokeWidth="0.3" opacity="0.25" />
      <line x1="592" y1="780" x2="738" y2="780" strokeWidth="0.3" opacity="0.22" />
      <line x1="586" y1="800" x2="752" y2="800" strokeWidth="0.3" opacity="0.2" />
      <line x1="578" y1="820" x2="764" y2="820" strokeWidth="0.3" opacity="0.18" />
      <line x1="572" y1="840" x2="776" y2="840" strokeWidth="0.3" opacity="0.15" />
      <line x1="566" y1="860" x2="788" y2="860" strokeWidth="0.3" opacity="0.12" />
      {/* Center line for path stones */}
      <line x1="655" y1="690" x2="640" y2="730" strokeWidth="0.2" opacity="0.15" />
      <line x1="640" y1="730" x2="648" y2="770" strokeWidth="0.2" opacity="0.15" />
      <line x1="648" y1="770" x2="660" y2="810" strokeWidth="0.2" opacity="0.12" />

      {/* ============================================================
          CHALET — STONE FOUNDATION / BASE
          ============================================================ */}
      {/* Front face of stone base */}
      <polygon points="340,580 340,680 940,680 940,580" strokeWidth="0.8" />
      {/* 3D right side of stone base */}
      <polygon points="940,580 940,680 1040,640 1040,545" strokeWidth="0.7" />
      {/* Stone coursing — front face horizontal lines */}
      <line x1="340" y1="595" x2="940" y2="595" strokeWidth="0.3" opacity="0.4" />
      <line x1="340" y1="610" x2="940" y2="610" strokeWidth="0.3" opacity="0.4" />
      <line x1="340" y1="625" x2="940" y2="625" strokeWidth="0.3" opacity="0.4" />
      <line x1="340" y1="640" x2="940" y2="640" strokeWidth="0.3" opacity="0.4" />
      <line x1="340" y1="655" x2="940" y2="655" strokeWidth="0.3" opacity="0.4" />
      <line x1="340" y1="670" x2="940" y2="670" strokeWidth="0.3" opacity="0.4" />
      {/* Stone coursing — front face vertical joints (staggered like real masonry) */}
      {/* Row 1 */}
      <line x1="400" y1="580" x2="400" y2="595" strokeWidth="0.2" opacity="0.3" />
      <line x1="480" y1="580" x2="480" y2="595" strokeWidth="0.2" opacity="0.3" />
      <line x1="560" y1="580" x2="560" y2="595" strokeWidth="0.2" opacity="0.3" />
      <line x1="640" y1="580" x2="640" y2="595" strokeWidth="0.2" opacity="0.3" />
      <line x1="720" y1="580" x2="720" y2="595" strokeWidth="0.2" opacity="0.3" />
      <line x1="800" y1="580" x2="800" y2="595" strokeWidth="0.2" opacity="0.3" />
      <line x1="880" y1="580" x2="880" y2="595" strokeWidth="0.2" opacity="0.3" />
      {/* Row 2 (offset) */}
      <line x1="370" y1="595" x2="370" y2="610" strokeWidth="0.2" opacity="0.3" />
      <line x1="440" y1="595" x2="440" y2="610" strokeWidth="0.2" opacity="0.3" />
      <line x1="520" y1="595" x2="520" y2="610" strokeWidth="0.2" opacity="0.3" />
      <line x1="600" y1="595" x2="600" y2="610" strokeWidth="0.2" opacity="0.3" />
      <line x1="680" y1="595" x2="680" y2="610" strokeWidth="0.2" opacity="0.3" />
      <line x1="760" y1="595" x2="760" y2="610" strokeWidth="0.2" opacity="0.3" />
      <line x1="840" y1="595" x2="840" y2="610" strokeWidth="0.2" opacity="0.3" />
      <line x1="920" y1="595" x2="920" y2="610" strokeWidth="0.2" opacity="0.3" />
      {/* Row 3 */}
      <line x1="400" y1="610" x2="400" y2="625" strokeWidth="0.2" opacity="0.3" />
      <line x1="480" y1="610" x2="480" y2="625" strokeWidth="0.2" opacity="0.3" />
      <line x1="560" y1="610" x2="560" y2="625" strokeWidth="0.2" opacity="0.3" />
      <line x1="640" y1="610" x2="640" y2="625" strokeWidth="0.2" opacity="0.3" />
      <line x1="720" y1="610" x2="720" y2="625" strokeWidth="0.2" opacity="0.3" />
      <line x1="800" y1="610" x2="800" y2="625" strokeWidth="0.2" opacity="0.3" />
      <line x1="880" y1="610" x2="880" y2="625" strokeWidth="0.2" opacity="0.3" />
      {/* Row 4 (offset) */}
      <line x1="370" y1="625" x2="370" y2="640" strokeWidth="0.2" opacity="0.3" />
      <line x1="440" y1="625" x2="440" y2="640" strokeWidth="0.2" opacity="0.3" />
      <line x1="520" y1="625" x2="520" y2="640" strokeWidth="0.2" opacity="0.3" />
      <line x1="600" y1="625" x2="600" y2="640" strokeWidth="0.2" opacity="0.3" />
      <line x1="680" y1="625" x2="680" y2="640" strokeWidth="0.2" opacity="0.3" />
      <line x1="760" y1="625" x2="760" y2="640" strokeWidth="0.2" opacity="0.3" />
      <line x1="840" y1="625" x2="840" y2="640" strokeWidth="0.2" opacity="0.3" />
      <line x1="920" y1="625" x2="920" y2="640" strokeWidth="0.2" opacity="0.3" />
      {/* Row 5 */}
      <line x1="400" y1="640" x2="400" y2="655" strokeWidth="0.2" opacity="0.3" />
      <line x1="480" y1="640" x2="480" y2="655" strokeWidth="0.2" opacity="0.3" />
      <line x1="560" y1="640" x2="560" y2="655" strokeWidth="0.2" opacity="0.3" />
      <line x1="640" y1="640" x2="640" y2="655" strokeWidth="0.2" opacity="0.3" />
      <line x1="720" y1="640" x2="720" y2="655" strokeWidth="0.2" opacity="0.3" />
      <line x1="800" y1="640" x2="800" y2="655" strokeWidth="0.2" opacity="0.3" />
      <line x1="880" y1="640" x2="880" y2="655" strokeWidth="0.2" opacity="0.3" />
      {/* Stone coursing — right side face */}
      <line x1="940" y1="595" x2="1040" y2="558" strokeWidth="0.3" opacity="0.35" />
      <line x1="940" y1="610" x2="1040" y2="572" strokeWidth="0.3" opacity="0.35" />
      <line x1="940" y1="625" x2="1040" y2="586" strokeWidth="0.3" opacity="0.35" />
      <line x1="940" y1="640" x2="1040" y2="600" strokeWidth="0.3" opacity="0.35" />
      <line x1="940" y1="655" x2="1040" y2="614" strokeWidth="0.3" opacity="0.35" />
      <line x1="940" y1="670" x2="1040" y2="628" strokeWidth="0.3" opacity="0.35" />
      {/* Right side vertical joints */}
      <line x1="970" y1="545" x2="970" y2="558" strokeWidth="0.2" opacity="0.25" />
      <line x1="1000" y1="548" x2="1000" y2="572" strokeWidth="0.2" opacity="0.25" />
      <line x1="980" y1="558" x2="980" y2="572" strokeWidth="0.2" opacity="0.25" />
      <line x1="1020" y1="552" x2="1020" y2="586" strokeWidth="0.2" opacity="0.25" />
      <line x1="960" y1="572" x2="960" y2="586" strokeWidth="0.2" opacity="0.25" />
      <line x1="990" y1="586" x2="990" y2="600" strokeWidth="0.2" opacity="0.25" />
      <line x1="1015" y1="600" x2="1015" y2="614" strokeWidth="0.2" opacity="0.25" />

      {/* ============================================================
          CHALET — MAIN TIMBER STRUCTURE (ground floor + first floor)
          ============================================================ */}
      {/* Front wall — ground floor */}
      <polygon points="340,380 340,580 940,580 940,380" strokeWidth="0.9" />
      {/* 3D right side wall */}
      <polygon points="940,380 940,580 1040,545 1040,350" strokeWidth="0.8" />

      {/* Floor separator (between ground and first floor) */}
      <line x1="340" y1="480" x2="940" y2="480" strokeWidth="0.7" />
      <line x1="940" y1="480" x2="1040" y2="448" strokeWidth="0.6" />

      {/* Horizontal timber beams — front face */}
      <line x1="340" y1="380" x2="940" y2="380" strokeWidth="1.0" />
      <line x1="340" y1="430" x2="940" y2="430" strokeWidth="0.5" opacity="0.5" />
      <line x1="340" y1="530" x2="940" y2="530" strokeWidth="0.5" opacity="0.5" />

      {/* Vertical timber posts — front face */}
      <line x1="340" y1="380" x2="340" y2="680" strokeWidth="1.0" />
      <line x1="490" y1="380" x2="490" y2="580" strokeWidth="0.7" />
      <line x1="640" y1="380" x2="640" y2="580" strokeWidth="0.7" />
      <line x1="790" y1="380" x2="790" y2="580" strokeWidth="0.7" />
      <line x1="940" y1="380" x2="940" y2="680" strokeWidth="1.0" />

      {/* Diagonal timber braces — front face */}
      <line x1="340" y1="430" x2="390" y2="380" strokeWidth="0.4" opacity="0.45" />
      <line x1="940" y1="430" x2="890" y2="380" strokeWidth="0.4" opacity="0.45" />
      <line x1="490" y1="430" x2="540" y2="380" strokeWidth="0.4" opacity="0.45" />
      <line x1="640" y1="430" x2="590" y2="380" strokeWidth="0.4" opacity="0.45" />
      <line x1="790" y1="430" x2="740" y2="380" strokeWidth="0.4" opacity="0.45" />

      {/* Timber joint details (small X or circles at intersections) */}
      <circle cx="340" cy="380" r="3" strokeWidth="0.5" opacity="0.5" />
      <circle cx="490" cy="380" r="3" strokeWidth="0.5" opacity="0.5" />
      <circle cx="640" cy="380" r="3" strokeWidth="0.5" opacity="0.5" />
      <circle cx="790" cy="380" r="3" strokeWidth="0.5" opacity="0.5" />
      <circle cx="940" cy="380" r="3" strokeWidth="0.5" opacity="0.5" />
      <circle cx="340" cy="480" r="3" strokeWidth="0.5" opacity="0.5" />
      <circle cx="490" cy="480" r="2.5" strokeWidth="0.4" opacity="0.4" />
      <circle cx="640" cy="480" r="2.5" strokeWidth="0.4" opacity="0.4" />
      <circle cx="790" cy="480" r="2.5" strokeWidth="0.4" opacity="0.4" />
      <circle cx="940" cy="480" r="3" strokeWidth="0.5" opacity="0.5" />
      {/* Cross-bracing joint detail marks */}
      <line x1="487" y1="377" x2="493" y2="383" strokeWidth="0.3" opacity="0.4" />
      <line x1="493" y1="377" x2="487" y2="383" strokeWidth="0.3" opacity="0.4" />
      <line x1="637" y1="377" x2="643" y2="383" strokeWidth="0.3" opacity="0.4" />
      <line x1="643" y1="377" x2="637" y2="383" strokeWidth="0.3" opacity="0.4" />
      <line x1="787" y1="377" x2="793" y2="383" strokeWidth="0.3" opacity="0.4" />
      <line x1="793" y1="377" x2="787" y2="383" strokeWidth="0.3" opacity="0.4" />

      {/* Vertical timber posts — right side */}
      <line x1="990" y1="365" x2="990" y2="592" strokeWidth="0.5" opacity="0.5" />

      {/* ============================================================
          PANORAMIC WINDOWS — GROUND FLOOR (3 large windows)
          ============================================================ */}
      {/* Window 1 */}
      <rect x="360" y="500" width="110" height="70" strokeWidth="0.6" />
      <line x1="415" y1="500" x2="415" y2="570" strokeWidth="0.4" />
      <line x1="360" y1="535" x2="470" y2="535" strokeWidth="0.4" />
      {/* Window pane inner lines */}
      <line x1="387" y1="500" x2="387" y2="535" strokeWidth="0.15" opacity="0.3" />
      <line x1="442" y1="500" x2="442" y2="535" strokeWidth="0.15" opacity="0.3" />
      <line x1="387" y1="535" x2="387" y2="570" strokeWidth="0.15" opacity="0.3" />
      <line x1="442" y1="535" x2="442" y2="570" strokeWidth="0.15" opacity="0.3" />

      {/* Window 2 (center — larger panoramic) */}
      <rect x="510" y="495" width="130" height="80" strokeWidth="0.6" />
      <line x1="575" y1="495" x2="575" y2="575" strokeWidth="0.4" />
      <line x1="510" y1="535" x2="640" y2="535" strokeWidth="0.4" />
      <line x1="542" y1="495" x2="542" y2="535" strokeWidth="0.15" opacity="0.3" />
      <line x1="607" y1="495" x2="607" y2="535" strokeWidth="0.15" opacity="0.3" />
      <line x1="542" y1="535" x2="542" y2="575" strokeWidth="0.15" opacity="0.3" />
      <line x1="607" y1="535" x2="607" y2="575" strokeWidth="0.15" opacity="0.3" />

      {/* Window 3 */}
      <rect x="810" y="500" width="110" height="70" strokeWidth="0.6" />
      <line x1="865" y1="500" x2="865" y2="570" strokeWidth="0.4" />
      <line x1="810" y1="535" x2="920" y2="535" strokeWidth="0.4" />
      <line x1="837" y1="500" x2="837" y2="535" strokeWidth="0.15" opacity="0.3" />
      <line x1="892" y1="500" x2="892" y2="535" strokeWidth="0.15" opacity="0.3" />
      <line x1="837" y1="535" x2="837" y2="570" strokeWidth="0.15" opacity="0.3" />
      <line x1="892" y1="535" x2="892" y2="570" strokeWidth="0.15" opacity="0.3" />

      {/* Interior visible through center window — fireplace glow */}
      <rect x="555" y="540" width="40" height="30" strokeWidth="0.2" opacity="0.25" />
      <line x1="565" y1="540" x2="575" y2="530" strokeWidth="0.15" opacity="0.2" />
      <line x1="585" y1="540" x2="575" y2="530" strokeWidth="0.15" opacity="0.2" />
      {/* Flame suggestion */}
      <path d="M568,555 Q572,545 575,548 Q578,545 582,555" strokeWidth="0.2" opacity="0.2" />
      <path d="M571,558 Q575,550 579,558" strokeWidth="0.15" opacity="0.15" />
      {/* Furniture outlines — sofa */}
      <rect x="520" y="555" width="30" height="12" strokeWidth="0.15" opacity="0.15" />
      <rect x="600" y="555" width="30" height="12" strokeWidth="0.15" opacity="0.15" />
      {/* Table */}
      <rect x="560" y="560" width="20" height="8" strokeWidth="0.15" opacity="0.12" />

      {/* ============================================================
          FIRST FLOOR WINDOWS
          ============================================================ */}
      {/* Upper window 1 */}
      <rect x="370" y="400" width="90" height="60" strokeWidth="0.6" />
      <line x1="415" y1="400" x2="415" y2="460" strokeWidth="0.4" />
      <line x1="370" y1="430" x2="460" y2="430" strokeWidth="0.4" />
      {/* Upper window 2 */}
      <rect x="520" y="395" width="100" height="65" strokeWidth="0.6" />
      <line x1="570" y1="395" x2="570" y2="460" strokeWidth="0.4" />
      <line x1="520" y1="427" x2="620" y2="427" strokeWidth="0.4" />
      {/* Upper window 3 */}
      <rect x="680" y="395" width="100" height="65" strokeWidth="0.6" />
      <line x1="730" y1="395" x2="730" y2="460" strokeWidth="0.4" />
      <line x1="680" y1="427" x2="780" y2="427" strokeWidth="0.4" />
      {/* Upper window 4 */}
      <rect x="830" y="400" width="90" height="60" strokeWidth="0.6" />
      <line x1="875" y1="400" x2="875" y2="460" strokeWidth="0.4" />
      <line x1="830" y1="430" x2="920" y2="430" strokeWidth="0.4" />

      {/* Right side windows */}
      <polygon points="955,410 955,460 1020,438 1020,390" strokeWidth="0.5" />
      <line x1="987" y1="400" x2="987" y2="449" strokeWidth="0.3" />
      <polygon points="955,510 955,560 1020,538 1020,490" strokeWidth="0.5" />
      <line x1="987" y1="500" x2="987" y2="549" strokeWidth="0.3" />

      {/* ============================================================
          ENTRANCE PORCH WITH COLUMNS
          ============================================================ */}
      {/* Porch roof */}
      <polygon points="600,470 600,480 750,480 750,470 720,460 630,460" strokeWidth="0.7" />
      <line x1="600" y1="470" x2="630" y2="460" strokeWidth="0.5" />
      <line x1="750" y1="470" x2="720" y2="460" strokeWidth="0.5" />
      {/* 3D porch roof top */}
      <polygon points="630,460 720,460 770,450 680,450" strokeWidth="0.5" />

      {/* Columns */}
      <rect x="612" y="480" width="8" height="100" strokeWidth="0.5" />
      <rect x="732" y="480" width="8" height="100" strokeWidth="0.5" />
      {/* Column base details */}
      <rect x="609" y="572" width="14" height="8" strokeWidth="0.3" />
      <rect x="729" y="572" width="14" height="8" strokeWidth="0.3" />
      {/* Column capital details */}
      <rect x="609" y="478" width="14" height="6" strokeWidth="0.3" />
      <rect x="729" y="478" width="14" height="6" strokeWidth="0.3" />

      {/* Entrance door */}
      <rect x="640" y="500" width="70" height="80" strokeWidth="0.7" />
      <line x1="675" y1="500" x2="675" y2="580" strokeWidth="0.5" />
      {/* Door panels */}
      <rect x="647" y="507" width="22" height="30" strokeWidth="0.2" opacity="0.3" />
      <rect x="647" y="543" width="22" height="30" strokeWidth="0.2" opacity="0.3" />
      <rect x="681" y="507" width="22" height="30" strokeWidth="0.2" opacity="0.3" />
      <rect x="681" y="543" width="22" height="30" strokeWidth="0.2" opacity="0.3" />
      {/* Door handles */}
      <circle cx="668" cy="542" r="2" strokeWidth="0.3" />
      <circle cx="682" cy="542" r="2" strokeWidth="0.3" />
      {/* Porch step */}
      <rect x="625" y="580" width="100" height="6" strokeWidth="0.4" />
      <rect x="620" y="586" width="110" height="6" strokeWidth="0.4" />

      {/* ============================================================
          MAIN ROOF — DRAMATIC PITCHED WITH MULTIPLE GABLES
          ============================================================ */}
      {/* Main roof front face */}
      <polygon points="320,380 640,220 960,380" strokeWidth="1.2" />
      {/* Main roof 3D right slope */}
      <polygon points="960,380 640,220 740,195 1060,350" strokeWidth="1.0" />
      {/* Roof ridge line */}
      <line x1="640" y1="220" x2="740" y2="195" strokeWidth="0.8" />
      {/* Roof eave overhangs */}
      <line x1="310" y1="385" x2="640" y2="218" strokeWidth="0.4" opacity="0.5" />
      <line x1="970" y1="385" x2="640" y2="218" strokeWidth="0.4" opacity="0.5" />
      <line x1="310" y1="385" x2="320" y2="380" strokeWidth="0.5" />
      <line x1="970" y1="385" x2="960" y2="380" strokeWidth="0.5" />

      {/* Roof tile/shingle pattern — left slope */}
      {[...Array(12)].map((_, i) => {
        const y1 = 235 + i * 13;
        const y2 = y1;
        const xLeft = 330 + (640 - 330) * (1 - (380 - y1) / (380 - 220));
        const xRight = 950 - (950 - 640) * (1 - (380 - y1) / (380 - 220));
        return y1 < 380 ? (
          <line
            key={`tile-h-${i}`}
            x1={Math.max(320, 640 - (640 - 320) * ((380 - y1) / (380 - 220)))}
            y1={y1}
            x2={Math.min(960, 640 + (960 - 640) * ((380 - y1) / (380 - 220)))}
            y2={y2}
            strokeWidth="0.15"
            opacity="0.2"
          />
        ) : null;
      })}
      {/* Vertical tile lines on left slope */}
      {[...Array(16)].map((_, i) => {
        const x = 370 + i * 38;
        if (x >= 940) return null;
        const roofY = x <= 640
          ? 380 - ((x - 320) / (640 - 320)) * (380 - 220)
          : 380 - ((960 - x) / (960 - 640)) * (380 - 220);
        return (
          <line
            key={`tile-v-${i}`}
            x1={x}
            y1={roofY + 2}
            x2={x}
            y2={380}
            strokeWidth="0.15"
            opacity="0.15"
          />
        );
      })}
      {/* Tile lines on right 3D slope */}
      {[...Array(6)].map((_, i) => {
        const t = (i + 1) / 7;
        return (
          <line
            key={`tile-r-${i}`}
            x1={960 + (1060 - 960) * t}
            y1={380 + (350 - 380) * t}
            x2={640 + (740 - 640) * t}
            y2={220 + (195 - 220) * t}
            strokeWidth="0.15"
            opacity="0.15"
          />
        );
      })}

      {/* ============================================================
          LEFT GABLE / SECONDARY ROOF PROJECTION
          ============================================================ */}
      <polygon points="340,380 440,300 540,380" strokeWidth="0.8" />
      <line x1="340" y1="380" x2="540" y2="380" strokeWidth="0.6" />
      {/* Gable window */}
      <polygon points="410,340 440,320 470,340 470,370 410,370" strokeWidth="0.5" />
      <line x1="440" y1="320" x2="440" y2="370" strokeWidth="0.3" />
      <line x1="410" y1="355" x2="470" y2="355" strokeWidth="0.3" />

      {/* ============================================================
          RIGHT GABLE / SECONDARY ROOF PROJECTION
          ============================================================ */}
      <polygon points="740,380 840,300 940,380" strokeWidth="0.8" />
      {/* Gable window */}
      <polygon points="810,340 840,320 870,340 870,370 810,370" strokeWidth="0.5" />
      <line x1="840" y1="320" x2="840" y2="370" strokeWidth="0.3" />
      <line x1="810" y1="355" x2="870" y2="355" strokeWidth="0.3" />

      {/* ============================================================
          DORMER WINDOWS (on roof)
          ============================================================ */}
      {/* Left dormer */}
      <rect x="430" y="290" width="60" height="50" strokeWidth="0.5" />
      <polygon points="425,290 460,260 495,290" strokeWidth="0.6" />
      <line x1="460" y1="290" x2="460" y2="340" strokeWidth="0.3" />
      <line x1="430" y1="315" x2="490" y2="315" strokeWidth="0.3" />
      {/* Dormer side walls */}
      <line x1="425" y1="290" x2="430" y2="290" strokeWidth="0.3" />
      <line x1="495" y1="290" x2="490" y2="290" strokeWidth="0.3" />

      {/* Center dormer (larger) */}
      <rect x="600" y="280" width="80" height="55" strokeWidth="0.5" />
      <polygon points="593,280 640,245 687,280" strokeWidth="0.6" />
      <line x1="640" y1="280" x2="640" y2="335" strokeWidth="0.3" />
      <line x1="620" y1="280" x2="620" y2="335" strokeWidth="0.2" opacity="0.3" />
      <line x1="660" y1="280" x2="660" y2="335" strokeWidth="0.2" opacity="0.3" />
      <line x1="600" y1="308" x2="680" y2="308" strokeWidth="0.3" />

      {/* Right dormer */}
      <rect x="770" y="290" width="60" height="50" strokeWidth="0.5" />
      <polygon points="765,290 800,260 835,290" strokeWidth="0.6" />
      <line x1="800" y1="290" x2="800" y2="340" strokeWidth="0.3" />
      <line x1="770" y1="315" x2="830" y2="315" strokeWidth="0.3" />

      {/* ============================================================
          SNOW ON ROOF (dotted lines)
          ============================================================ */}
      <path d="M340,375 Q400,365 460,360 Q520,355 580,345 Q610,338 640,325" strokeWidth="0.4" strokeDasharray="2,2" opacity="0.3" />
      <path d="M960,375 Q900,365 840,360 Q780,355 720,345 Q690,338 660,325" strokeWidth="0.4" strokeDasharray="2,2" opacity="0.3" />
      <path d="M350,370 Q420,358 490,348 Q560,338 630,320" strokeWidth="0.3" strokeDasharray="1.5,2.5" opacity="0.2" />
      <path d="M950,370 Q880,358 810,348 Q740,338 670,320" strokeWidth="0.3" strokeDasharray="1.5,2.5" opacity="0.2" />
      {/* Snow on ridge */}
      <path d="M640,220 Q660,218 680,215 Q700,210 720,205 Q730,200 740,195" strokeWidth="0.5" strokeDasharray="2,1.5" opacity="0.35" />
      {/* Snow on dormers */}
      <path d="M425,288 Q445,278 460,260 Q475,278 495,288" strokeWidth="0.3" strokeDasharray="1.5,2" opacity="0.25" />
      <path d="M593,278 Q610,268 640,245 Q670,268 687,278" strokeWidth="0.3" strokeDasharray="1.5,2" opacity="0.25" />
      <path d="M765,288 Q785,278 800,260 Q815,278 835,288" strokeWidth="0.3" strokeDasharray="1.5,2" opacity="0.25" />
      {/* Snow on eaves */}
      <path d="M310,387 Q330,385 350,383 Q400,379 450,376" strokeWidth="0.3" strokeDasharray="1,2" opacity="0.2" />
      <path d="M930,376 Q950,379 960,382 Q965,384 970,387" strokeWidth="0.3" strokeDasharray="1,2" opacity="0.2" />

      {/* ============================================================
          BALCONIES WITH INDIVIDUAL BALUSTERS
          ============================================================ */}
      {/* First floor balcony — left section */}
      <line x1="350" y1="470" x2="490" y2="470" strokeWidth="0.6" />
      <line x1="350" y1="480" x2="490" y2="480" strokeWidth="0.6" />
      {/* Balcony floor */}
      <line x1="345" y1="480" x2="345" y2="490" strokeWidth="0.4" />
      <polygon points="345,480 345,490 495,490 495,480" strokeWidth="0.3" opacity="0.3" />
      {/* Top rail */}
      <line x1="350" y1="470" x2="350" y2="480" strokeWidth="0.5" />
      <line x1="490" y1="470" x2="490" y2="480" strokeWidth="0.5" />
      {/* Individual balusters */}
      {[...Array(14)].map((_, i) => (
        <line
          key={`bal-l-${i}`}
          x1={355 + i * 10}
          y1="470"
          x2={355 + i * 10}
          y2="480"
          strokeWidth="0.25"
          opacity="0.4"
        />
      ))}

      {/* First floor balcony — right section */}
      <line x1="790" y1="470" x2="930" y2="470" strokeWidth="0.6" />
      <line x1="790" y1="480" x2="930" y2="480" strokeWidth="0.6" />
      <line x1="790" y1="470" x2="790" y2="480" strokeWidth="0.5" />
      <line x1="930" y1="470" x2="930" y2="480" strokeWidth="0.5" />
      <polygon points="785,480 785,490 935,490 935,480" strokeWidth="0.3" opacity="0.3" />
      {/* Individual balusters */}
      {[...Array(14)].map((_, i) => (
        <line
          key={`bal-r-${i}`}
          x1={795 + i * 10}
          y1="470"
          x2={795 + i * 10}
          y2="480"
          strokeWidth="0.25"
          opacity="0.4"
        />
      ))}

      {/* Ground floor wide balcony / terrace — front */}
      <line x1="340" y1="578" x2="620" y2="578" strokeWidth="0.3" opacity="0.3" />
      <line x1="730" y1="578" x2="940" y2="578" strokeWidth="0.3" opacity="0.3" />

      {/* Right side balcony */}
      <line x1="940" y1="470" x2="1040" y2="440" strokeWidth="0.5" />
      <line x1="940" y1="480" x2="1040" y2="448" strokeWidth="0.5" />
      {/* Right balcony balusters */}
      {[...Array(8)].map((_, i) => {
        const t = (i + 1) / 9;
        return (
          <line
            key={`bal-rs-${i}`}
            x1={940 + 100 * t}
            y1={470 + (440 - 470) * t}
            x2={940 + 100 * t}
            y2={480 + (448 - 480) * t}
            strokeWidth="0.25"
            opacity="0.35"
          />
        );
      })}

      {/* ============================================================
          CHIMNEY WITH STONE DETAIL
          ============================================================ */}
      <rect x="860" y="260" width="35" height="80" strokeWidth="0.7" />
      {/* Chimney cap */}
      <rect x="855" y="255" width="45" height="8" strokeWidth="0.5" />
      <rect x="858" y="250" width="39" height="7" strokeWidth="0.4" />
      {/* Chimney pot */}
      <rect x="870" y="242" width="15" height="10" strokeWidth="0.4" />
      {/* Stone coursing on chimney */}
      <line x1="860" y1="275" x2="895" y2="275" strokeWidth="0.2" opacity="0.35" />
      <line x1="860" y1="290" x2="895" y2="290" strokeWidth="0.2" opacity="0.35" />
      <line x1="860" y1="305" x2="895" y2="305" strokeWidth="0.2" opacity="0.35" />
      <line x1="860" y1="320" x2="895" y2="320" strokeWidth="0.2" opacity="0.35" />
      <line x1="860" y1="335" x2="895" y2="335" strokeWidth="0.2" opacity="0.35" />
      {/* Chimney vertical joints */}
      <line x1="877" y1="260" x2="877" y2="275" strokeWidth="0.15" opacity="0.25" />
      <line x1="870" y1="275" x2="870" y2="290" strokeWidth="0.15" opacity="0.25" />
      <line x1="885" y1="275" x2="885" y2="290" strokeWidth="0.15" opacity="0.25" />
      <line x1="877" y1="290" x2="877" y2="305" strokeWidth="0.15" opacity="0.25" />
      <line x1="870" y1="305" x2="870" y2="320" strokeWidth="0.15" opacity="0.25" />
      <line x1="885" y1="305" x2="885" y2="320" strokeWidth="0.15" opacity="0.25" />
      <line x1="877" y1="320" x2="877" y2="335" strokeWidth="0.15" opacity="0.25" />
      {/* Smoke suggestion */}
      <path d="M877,242 Q875,232 880,222 Q878,212 882,202" strokeWidth="0.2" opacity="0.15" strokeDasharray="2,3" />
      <path d="M873,240 Q870,228 875,218 Q872,208 876,198" strokeWidth="0.15" opacity="0.1" strokeDasharray="2,4" />

      {/* ============================================================
          SHADOW LINES (dashed) FOR 3D DEPTH
          ============================================================ */}
      {/* Building shadow on ground */}
      <path d="M940,680 L1080,720 L1080,740 L440,740 L340,680" strokeWidth="0.4" strokeDasharray="4,3" opacity="0.15" />
      <line x1="940" y1="680" x2="1080" y2="720" strokeWidth="0.3" strokeDasharray="3,3" opacity="0.15" />
      <line x1="1040" y1="640" x2="1120" y2="670" strokeWidth="0.3" strokeDasharray="3,3" opacity="0.12" />
      {/* Roof shadow */}
      <line x1="1060" y1="350" x2="1120" y2="380" strokeWidth="0.3" strokeDasharray="3,2" opacity="0.12" />
      {/* Balcony shadows */}
      <line x1="345" y1="490" x2="345" y2="495" strokeWidth="0.2" strokeDasharray="1,2" opacity="0.15" />
      <line x1="495" y1="490" x2="495" y2="495" strokeWidth="0.2" strokeDasharray="1,2" opacity="0.15" />
      <line x1="785" y1="490" x2="785" y2="495" strokeWidth="0.2" strokeDasharray="1,2" opacity="0.15" />
      <line x1="935" y1="490" x2="935" y2="495" strokeWidth="0.2" strokeDasharray="1,2" opacity="0.15" />

      {/* ============================================================
          PINE / FIR TREES (8 trees with individual branch lines)
          ============================================================ */}
      {/* Tree 1 — far left */}
      <g opacity="0.55">
        <line x1="120" y1="680" x2="120" y2="520" strokeWidth="0.5" />
        <line x1="120" y1="530" x2="95" y2="560" strokeWidth="0.4" />
        <line x1="120" y1="530" x2="145" y2="560" strokeWidth="0.4" />
        <line x1="120" y1="550" x2="88" y2="590" strokeWidth="0.4" />
        <line x1="120" y1="550" x2="152" y2="590" strokeWidth="0.4" />
        <line x1="120" y1="570" x2="82" y2="620" strokeWidth="0.4" />
        <line x1="120" y1="570" x2="158" y2="620" strokeWidth="0.4" />
        <line x1="120" y1="595" x2="78" y2="650" strokeWidth="0.4" />
        <line x1="120" y1="595" x2="162" y2="650" strokeWidth="0.4" />
        <line x1="120" y1="620" x2="75" y2="680" strokeWidth="0.4" />
        <line x1="120" y1="620" x2="165" y2="680" strokeWidth="0.4" />
        {/* Individual branch details */}
        <line x1="120" y1="540" x2="105" y2="550" strokeWidth="0.2" />
        <line x1="120" y1="540" x2="135" y2="550" strokeWidth="0.2" />
        <line x1="120" y1="560" x2="100" y2="575" strokeWidth="0.2" />
        <line x1="120" y1="560" x2="140" y2="575" strokeWidth="0.2" />
        <line x1="120" y1="580" x2="95" y2="600" strokeWidth="0.2" />
        <line x1="120" y1="580" x2="145" y2="600" strokeWidth="0.2" />
        <line x1="120" y1="605" x2="90" y2="630" strokeWidth="0.2" />
        <line x1="120" y1="605" x2="150" y2="630" strokeWidth="0.2" />
      </g>

      {/* Tree 2 — left of chalet */}
      <g opacity="0.5">
        <line x1="230" y1="690" x2="230" y2="530" strokeWidth="0.5" />
        <line x1="230" y1="540" x2="208" y2="565" strokeWidth="0.4" />
        <line x1="230" y1="540" x2="252" y2="565" strokeWidth="0.4" />
        <line x1="230" y1="560" x2="202" y2="595" strokeWidth="0.4" />
        <line x1="230" y1="560" x2="258" y2="595" strokeWidth="0.4" />
        <line x1="230" y1="585" x2="195" y2="625" strokeWidth="0.4" />
        <line x1="230" y1="585" x2="265" y2="625" strokeWidth="0.4" />
        <line x1="230" y1="610" x2="190" y2="655" strokeWidth="0.4" />
        <line x1="230" y1="610" x2="270" y2="655" strokeWidth="0.4" />
        <line x1="230" y1="640" x2="188" y2="690" strokeWidth="0.4" />
        <line x1="230" y1="640" x2="272" y2="690" strokeWidth="0.4" />
        <line x1="230" y1="550" x2="215" y2="558" strokeWidth="0.2" />
        <line x1="230" y1="550" x2="245" y2="558" strokeWidth="0.2" />
        <line x1="230" y1="575" x2="210" y2="588" strokeWidth="0.2" />
        <line x1="230" y1="575" x2="250" y2="588" strokeWidth="0.2" />
        <line x1="230" y1="598" x2="205" y2="615" strokeWidth="0.2" />
        <line x1="230" y1="598" x2="255" y2="615" strokeWidth="0.2" />
        <line x1="230" y1="625" x2="200" y2="645" strokeWidth="0.2" />
        <line x1="230" y1="625" x2="260" y2="645" strokeWidth="0.2" />
      </g>

      {/* Tree 3 — far right background */}
      <g opacity="0.4">
        <line x1="1180" y1="660" x2="1180" y2="510" strokeWidth="0.5" />
        <line x1="1180" y1="520" x2="1158" y2="545" strokeWidth="0.35" />
        <line x1="1180" y1="520" x2="1202" y2="545" strokeWidth="0.35" />
        <line x1="1180" y1="540" x2="1152" y2="575" strokeWidth="0.35" />
        <line x1="1180" y1="540" x2="1208" y2="575" strokeWidth="0.35" />
        <line x1="1180" y1="565" x2="1148" y2="605" strokeWidth="0.35" />
        <line x1="1180" y1="565" x2="1212" y2="605" strokeWidth="0.35" />
        <line x1="1180" y1="590" x2="1145" y2="635" strokeWidth="0.35" />
        <line x1="1180" y1="590" x2="1215" y2="635" strokeWidth="0.35" />
        <line x1="1180" y1="620" x2="1142" y2="660" strokeWidth="0.35" />
        <line x1="1180" y1="620" x2="1218" y2="660" strokeWidth="0.35" />
        <line x1="1180" y1="530" x2="1168" y2="538" strokeWidth="0.2" />
        <line x1="1180" y1="530" x2="1192" y2="538" strokeWidth="0.2" />
        <line x1="1180" y1="555" x2="1162" y2="568" strokeWidth="0.2" />
        <line x1="1180" y1="555" x2="1198" y2="568" strokeWidth="0.2" />
        <line x1="1180" y1="578" x2="1158" y2="595" strokeWidth="0.2" />
        <line x1="1180" y1="578" x2="1202" y2="595" strokeWidth="0.2" />
      </g>

      {/* Tree 4 — right foreground */}
      <g opacity="0.55">
        <line x1="1250" y1="695" x2="1250" y2="520" strokeWidth="0.5" />
        <line x1="1250" y1="530" x2="1222" y2="562" strokeWidth="0.4" />
        <line x1="1250" y1="530" x2="1278" y2="562" strokeWidth="0.4" />
        <line x1="1250" y1="555" x2="1215" y2="595" strokeWidth="0.4" />
        <line x1="1250" y1="555" x2="1285" y2="595" strokeWidth="0.4" />
        <line x1="1250" y1="580" x2="1208" y2="628" strokeWidth="0.4" />
        <line x1="1250" y1="580" x2="1292" y2="628" strokeWidth="0.4" />
        <line x1="1250" y1="610" x2="1202" y2="660" strokeWidth="0.4" />
        <line x1="1250" y1="610" x2="1298" y2="660" strokeWidth="0.4" />
        <line x1="1250" y1="645" x2="1200" y2="695" strokeWidth="0.4" />
        <line x1="1250" y1="645" x2="1300" y2="695" strokeWidth="0.4" />
        <line x1="1250" y1="542" x2="1235" y2="552" strokeWidth="0.2" />
        <line x1="1250" y1="542" x2="1265" y2="552" strokeWidth="0.2" />
        <line x1="1250" y1="568" x2="1230" y2="582" strokeWidth="0.2" />
        <line x1="1250" y1="568" x2="1270" y2="582" strokeWidth="0.2" />
        <line x1="1250" y1="595" x2="1225" y2="612" strokeWidth="0.2" />
        <line x1="1250" y1="595" x2="1275" y2="612" strokeWidth="0.2" />
        <line x1="1250" y1="625" x2="1218" y2="648" strokeWidth="0.2" />
        <line x1="1250" y1="625" x2="1282" y2="648" strokeWidth="0.2" />
      </g>

      {/* Tree 5 — small background left */}
      <g opacity="0.35">
        <line x1="55" y1="680" x2="55" y2="580" strokeWidth="0.4" />
        <line x1="55" y1="588" x2="40" y2="608" strokeWidth="0.3" />
        <line x1="55" y1="588" x2="70" y2="608" strokeWidth="0.3" />
        <line x1="55" y1="608" x2="35" y2="635" strokeWidth="0.3" />
        <line x1="55" y1="608" x2="75" y2="635" strokeWidth="0.3" />
        <line x1="55" y1="630" x2="32" y2="660" strokeWidth="0.3" />
        <line x1="55" y1="630" x2="78" y2="660" strokeWidth="0.3" />
        <line x1="55" y1="655" x2="30" y2="680" strokeWidth="0.3" />
        <line x1="55" y1="655" x2="80" y2="680" strokeWidth="0.3" />
        <line x1="55" y1="598" x2="45" y2="605" strokeWidth="0.15" />
        <line x1="55" y1="598" x2="65" y2="605" strokeWidth="0.15" />
        <line x1="55" y1="620" x2="42" y2="630" strokeWidth="0.15" />
        <line x1="55" y1="620" x2="68" y2="630" strokeWidth="0.15" />
      </g>

      {/* Tree 6 — mid background right */}
      <g opacity="0.38">
        <line x1="1120" y1="670" x2="1120" y2="545" strokeWidth="0.4" />
        <line x1="1120" y1="553" x2="1103" y2="575" strokeWidth="0.3" />
        <line x1="1120" y1="553" x2="1137" y2="575" strokeWidth="0.3" />
        <line x1="1120" y1="573" x2="1098" y2="600" strokeWidth="0.3" />
        <line x1="1120" y1="573" x2="1142" y2="600" strokeWidth="0.3" />
        <line x1="1120" y1="598" x2="1093" y2="630" strokeWidth="0.3" />
        <line x1="1120" y1="598" x2="1147" y2="630" strokeWidth="0.3" />
        <line x1="1120" y1="625" x2="1090" y2="658" strokeWidth="0.3" />
        <line x1="1120" y1="625" x2="1150" y2="658" strokeWidth="0.3" />
        <line x1="1120" y1="650" x2="1088" y2="670" strokeWidth="0.3" />
        <line x1="1120" y1="650" x2="1152" y2="670" strokeWidth="0.3" />
        <line x1="1120" y1="562" x2="1110" y2="570" strokeWidth="0.15" />
        <line x1="1120" y1="562" x2="1130" y2="570" strokeWidth="0.15" />
        <line x1="1120" y1="585" x2="1107" y2="596" strokeWidth="0.15" />
        <line x1="1120" y1="585" x2="1133" y2="596" strokeWidth="0.15" />
        <line x1="1120" y1="610" x2="1102" y2="625" strokeWidth="0.15" />
        <line x1="1120" y1="610" x2="1138" y2="625" strokeWidth="0.15" />
      </g>

      {/* Tree 7 — foreground left cluster */}
      <g opacity="0.5">
        <line x1="170" y1="700" x2="170" y2="560" strokeWidth="0.45" />
        <line x1="170" y1="568" x2="150" y2="592" strokeWidth="0.35" />
        <line x1="170" y1="568" x2="190" y2="592" strokeWidth="0.35" />
        <line x1="170" y1="590" x2="145" y2="620" strokeWidth="0.35" />
        <line x1="170" y1="590" x2="195" y2="620" strokeWidth="0.35" />
        <line x1="170" y1="615" x2="140" y2="650" strokeWidth="0.35" />
        <line x1="170" y1="615" x2="200" y2="650" strokeWidth="0.35" />
        <line x1="170" y1="645" x2="138" y2="680" strokeWidth="0.35" />
        <line x1="170" y1="645" x2="202" y2="680" strokeWidth="0.35" />
        <line x1="170" y1="670" x2="136" y2="700" strokeWidth="0.35" />
        <line x1="170" y1="670" x2="204" y2="700" strokeWidth="0.35" />
        <line x1="170" y1="578" x2="158" y2="586" strokeWidth="0.18" />
        <line x1="170" y1="578" x2="182" y2="586" strokeWidth="0.18" />
        <line x1="170" y1="602" x2="153" y2="614" strokeWidth="0.18" />
        <line x1="170" y1="602" x2="187" y2="614" strokeWidth="0.18" />
        <line x1="170" y1="630" x2="148" y2="645" strokeWidth="0.18" />
        <line x1="170" y1="630" x2="192" y2="645" strokeWidth="0.18" />
      </g>

      {/* Tree 8 — far right background small */}
      <g opacity="0.32">
        <line x1="1330" y1="680" x2="1330" y2="580" strokeWidth="0.4" />
        <line x1="1330" y1="588" x2="1315" y2="608" strokeWidth="0.3" />
        <line x1="1330" y1="588" x2="1345" y2="608" strokeWidth="0.3" />
        <line x1="1330" y1="608" x2="1310" y2="632" strokeWidth="0.3" />
        <line x1="1330" y1="608" x2="1350" y2="632" strokeWidth="0.3" />
        <line x1="1330" y1="630" x2="1306" y2="658" strokeWidth="0.3" />
        <line x1="1330" y1="630" x2="1354" y2="658" strokeWidth="0.3" />
        <line x1="1330" y1="655" x2="1304" y2="680" strokeWidth="0.3" />
        <line x1="1330" y1="655" x2="1356" y2="680" strokeWidth="0.3" />
        <line x1="1330" y1="597" x2="1320" y2="605" strokeWidth="0.15" />
        <line x1="1330" y1="597" x2="1340" y2="605" strokeWidth="0.15" />
        <line x1="1330" y1="618" x2="1317" y2="628" strokeWidth="0.15" />
        <line x1="1330" y1="618" x2="1343" y2="628" strokeWidth="0.15" />
      </g>

      {/* ============================================================
          OUTDOOR HOT TUB / JACUZZI
          ============================================================ */}
      <ellipse cx="1080" cy="700" rx="40" ry="18" strokeWidth="0.5" opacity="0.5" />
      <ellipse cx="1080" cy="700" rx="35" ry="15" strokeWidth="0.3" opacity="0.35" />
      {/* Water ripple lines */}
      <ellipse cx="1080" cy="700" rx="25" ry="10" strokeWidth="0.15" opacity="0.2" />
      <ellipse cx="1080" cy="700" rx="15" ry="6" strokeWidth="0.15" opacity="0.15" />
      {/* Hot tub rim detail */}
      <ellipse cx="1080" cy="695" rx="42" ry="19" strokeWidth="0.2" opacity="0.3" />
      {/* Steam suggestion */}
      <path d="M1070,690 Q1068,680 1072,672" strokeWidth="0.2" opacity="0.15" strokeDasharray="1.5,2" />
      <path d="M1080,688 Q1078,676 1082,668" strokeWidth="0.2" opacity="0.15" strokeDasharray="1.5,2" />
      <path d="M1090,690 Q1088,680 1092,672" strokeWidth="0.2" opacity="0.15" strokeDasharray="1.5,2" />
      {/* Steps to hot tub */}
      <line x1="1050" y1="715" x2="1070" y2="720" strokeWidth="0.3" opacity="0.3" />
      <line x1="1048" y1="720" x2="1068" y2="725" strokeWidth="0.3" opacity="0.3" />

      {/* ============================================================
          WOOD PILE
          ============================================================ */}
      <g opacity="0.45">
        {/* Wood pile frame */}
        <rect x="1100" y="735" width="50" height="30" strokeWidth="0.4" />
        {/* Individual log cross-sections (circles) */}
        <circle cx="1110" cy="740" r="4" strokeWidth="0.25" />
        <circle cx="1120" cy="740" r="4" strokeWidth="0.25" />
        <circle cx="1130" cy="740" r="4" strokeWidth="0.25" />
        <circle cx="1140" cy="740" r="4" strokeWidth="0.25" />
        <circle cx="1115" cy="748" r="4" strokeWidth="0.25" />
        <circle cx="1125" cy="748" r="4" strokeWidth="0.25" />
        <circle cx="1135" cy="748" r="4" strokeWidth="0.25" />
        <circle cx="1110" cy="756" r="4" strokeWidth="0.25" />
        <circle cx="1120" cy="756" r="4" strokeWidth="0.25" />
        <circle cx="1130" cy="756" r="4" strokeWidth="0.25" />
        <circle cx="1140" cy="756" r="4" strokeWidth="0.25" />
        {/* Growth rings inside logs */}
        <circle cx="1110" cy="740" r="2" strokeWidth="0.15" />
        <circle cx="1120" cy="740" r="2" strokeWidth="0.15" />
        <circle cx="1130" cy="740" r="2" strokeWidth="0.15" />
        <circle cx="1140" cy="740" r="2" strokeWidth="0.15" />
        <circle cx="1115" cy="748" r="2" strokeWidth="0.15" />
        <circle cx="1125" cy="748" r="2" strokeWidth="0.15" />
        <circle cx="1135" cy="748" r="2" strokeWidth="0.15" />
        <circle cx="1110" cy="756" r="2" strokeWidth="0.15" />
        <circle cx="1120" cy="756" r="2" strokeWidth="0.15" />
        <circle cx="1130" cy="756" r="2" strokeWidth="0.15" />
        <circle cx="1140" cy="756" r="2" strokeWidth="0.15" />
      </g>

      {/* ============================================================
          GARDEN (bushes/shrubs)
          ============================================================ */}
      {/* Left garden bushes */}
      <path d="M280,690 Q290,670 310,675 Q320,665 340,672 Q350,660 365,670" strokeWidth="0.35" opacity="0.35" />
      <path d="M275,695 Q285,680 305,685 Q315,675 330,680" strokeWidth="0.25" opacity="0.25" />
      {/* Right garden bushes */}
      <path d="M950,685 Q965,668 980,675 Q995,660 1010,672 Q1020,665 1035,675" strokeWidth="0.35" opacity="0.35" />
      <path d="M955,690 Q970,678 985,682 Q998,672 1015,680" strokeWidth="0.25" opacity="0.25" />
      {/* Flower bed dots */}
      <circle cx="295" cy="688" r="1.5" strokeWidth="0.2" opacity="0.25" />
      <circle cx="310" cy="685" r="1.5" strokeWidth="0.2" opacity="0.25" />
      <circle cx="325" cy="682" r="1.5" strokeWidth="0.2" opacity="0.25" />
      <circle cx="345" cy="680" r="1.5" strokeWidth="0.2" opacity="0.25" />
      <circle cx="965" cy="685" r="1.5" strokeWidth="0.2" opacity="0.25" />
      <circle cx="985" cy="680" r="1.5" strokeWidth="0.2" opacity="0.25" />
      <circle cx="1005" cy="678" r="1.5" strokeWidth="0.2" opacity="0.25" />
      <circle cx="1025" cy="680" r="1.5" strokeWidth="0.2" opacity="0.25" />

      {/* ============================================================
          EXPOSED TIMBER FRAME — DECORATIVE ELEMENTS ON FACADE
          ============================================================ */}
      {/* Cross bracing on upper facade */}
      <line x1="370" y1="395" x2="455" y2="465" strokeWidth="0.25" opacity="0.3" />
      <line x1="455" y1="395" x2="370" y2="465" strokeWidth="0.25" opacity="0.3" />
      <line x1="830" y1="395" x2="915" y2="465" strokeWidth="0.25" opacity="0.3" />
      <line x1="915" y1="395" x2="830" y2="465" strokeWidth="0.25" opacity="0.3" />

      {/* Decorative timber pattern under eaves */}
      <line x1="340" y1="385" x2="940" y2="385" strokeWidth="0.3" opacity="0.4" />
      {/* Small bracket supports under eave */}
      <path d="M360,385 L360,395 L375,385" strokeWidth="0.25" opacity="0.3" />
      <path d="M420,385 L420,395 L435,385" strokeWidth="0.25" opacity="0.3" />
      <path d="M480,385 L480,395 L495,385" strokeWidth="0.25" opacity="0.3" />
      <path d="M540,385 L540,395 L555,385" strokeWidth="0.25" opacity="0.3" />
      <path d="M600,385 L600,395 L615,385" strokeWidth="0.25" opacity="0.3" />
      <path d="M660,385 L660,395 L675,385" strokeWidth="0.25" opacity="0.3" />
      <path d="M720,385 L720,395 L735,385" strokeWidth="0.25" opacity="0.3" />
      <path d="M780,385 L780,395 L795,385" strokeWidth="0.25" opacity="0.3" />
      <path d="M840,385 L840,395 L855,385" strokeWidth="0.25" opacity="0.3" />
      <path d="M900,385 L900,395 L915,385" strokeWidth="0.25" opacity="0.3" />

      {/* Timber beam ends (cross-section dots at wall edge) */}
      <rect x="337" y="425" width="6" height="6" strokeWidth="0.3" opacity="0.4" />
      <rect x="337" y="525" width="6" height="6" strokeWidth="0.3" opacity="0.4" />
      <rect x="937" y="425" width="6" height="6" strokeWidth="0.3" opacity="0.4" />
      <rect x="937" y="525" width="6" height="6" strokeWidth="0.3" opacity="0.4" />

      {/* ============================================================
          ANNOTATIONS — DIMENSIONS
          ============================================================ */}
      {/* Overall width dimension */}
      <line x1="340" y1="730" x2="940" y2="730" strokeWidth="0.3" opacity="0.35" />
      <line x1="340" y1="725" x2="340" y2="735" strokeWidth="0.3" opacity="0.35" />
      <line x1="940" y1="725" x2="940" y2="735" strokeWidth="0.3" opacity="0.35" />
      <text x="620" y="728" textAnchor="middle" fontSize="7" fill="currentColor" stroke="none" opacity="0.4" fontFamily="monospace">
        18.00 m
      </text>

      {/* Height dimension — left */}
      <line x1="300" y1="220" x2="300" y2="680" strokeWidth="0.3" opacity="0.35" />
      <line x1="295" y1="220" x2="305" y2="220" strokeWidth="0.3" opacity="0.35" />
      <line x1="295" y1="380" x2="305" y2="380" strokeWidth="0.3" opacity="0.35" />
      <line x1="295" y1="680" x2="305" y2="680" strokeWidth="0.3" opacity="0.35" />
      <text x="297" y="455" textAnchor="middle" fontSize="6" fill="currentColor" stroke="none" opacity="0.4" fontFamily="monospace" transform="rotate(-90,297,455)">
        14.50 m
      </text>

      {/* Floor-to-floor dimension markers */}
      <line x1="310" y1="580" x2="318" y2="580" strokeWidth="0.2" opacity="0.3" />
      <text x="313" y="635" textAnchor="middle" fontSize="5" fill="currentColor" stroke="none" opacity="0.35" fontFamily="monospace" transform="rotate(-90,313,635)">
        3.00 m
      </text>
      <line x1="310" y1="480" x2="318" y2="480" strokeWidth="0.2" opacity="0.3" />
      <text x="313" y="535" textAnchor="middle" fontSize="5" fill="currentColor" stroke="none" opacity="0.35" fontFamily="monospace" transform="rotate(-90,313,535)">
        3.20 m
      </text>

      {/* Roof height */}
      <line x1="270" y1="220" x2="270" y2="380" strokeWidth="0.2" opacity="0.3" strokeDasharray="2,2" />
      <line x1="265" y1="220" x2="275" y2="220" strokeWidth="0.2" opacity="0.3" />
      <line x1="265" y1="380" x2="275" y2="380" strokeWidth="0.2" opacity="0.3" />
      <text x="267" y="305" textAnchor="middle" fontSize="5" fill="currentColor" stroke="none" opacity="0.35" fontFamily="monospace" transform="rotate(-90,267,305)">
        5.00 m
      </text>

      {/* ============================================================
          ANNOTATIONS — ROOF PITCH ANGLE
          ============================================================ */}
      <path d="M370,380 L395,380 L385,370" strokeWidth="0.3" opacity="0.35" fill="none" />
      <text x="402" y="375" fontSize="5.5" fill="currentColor" stroke="none" opacity="0.4" fontFamily="monospace">
        45°
      </text>

      {/* ============================================================
          ANNOTATIONS — LEVEL MARKERS
          ============================================================ */}
      {/* Level 0 — ground */}
      <line x1="245" y1="680" x2="260" y2="680" strokeWidth="0.3" opacity="0.4" />
      <polygon points="252,676 256,680 252,684" strokeWidth="0.2" opacity="0.4" fill="currentColor" />
      <text x="230" y="683" textAnchor="end" fontSize="5" fill="currentColor" stroke="none" opacity="0.4" fontFamily="monospace">
        ±0.00
      </text>

      {/* Level 1 */}
      <line x1="245" y1="580" x2="260" y2="580" strokeWidth="0.3" opacity="0.4" />
      <polygon points="252,576 256,580 252,584" strokeWidth="0.2" opacity="0.4" fill="currentColor" />
      <text x="230" y="583" textAnchor="end" fontSize="5" fill="currentColor" stroke="none" opacity="0.4" fontFamily="monospace">
        +3.00
      </text>

      {/* Level 2 */}
      <line x1="245" y1="480" x2="260" y2="480" strokeWidth="0.3" opacity="0.4" />
      <polygon points="252,476 256,480 252,484" strokeWidth="0.2" opacity="0.4" fill="currentColor" />
      <text x="230" y="483" textAnchor="end" fontSize="5" fill="currentColor" stroke="none" opacity="0.4" fontFamily="monospace">
        +6.20
      </text>

      {/* Level 3 — eave */}
      <line x1="245" y1="380" x2="260" y2="380" strokeWidth="0.3" opacity="0.4" />
      <polygon points="252,376 256,380 252,384" strokeWidth="0.2" opacity="0.4" fill="currentColor" />
      <text x="230" y="383" textAnchor="end" fontSize="5" fill="currentColor" stroke="none" opacity="0.4" fontFamily="monospace">
        +9.40
      </text>

      {/* Level 4 — ridge */}
      <line x1="245" y1="220" x2="260" y2="220" strokeWidth="0.3" opacity="0.4" />
      <polygon points="252,216 256,220 252,224" strokeWidth="0.2" opacity="0.4" fill="currentColor" />
      <text x="230" y="223" textAnchor="end" fontSize="5" fill="currentColor" stroke="none" opacity="0.4" fontFamily="monospace">
        +14.50
      </text>

      {/* ============================================================
          COMPASS ROSE
          ============================================================ */}
      <g transform="translate(80,150)" opacity="0.45">
        <circle cx="0" cy="0" r="22" strokeWidth="0.4" />
        <circle cx="0" cy="0" r="20" strokeWidth="0.2" />
        {/* N-S line */}
        <line x1="0" y1="-20" x2="0" y2="20" strokeWidth="0.3" />
        {/* E-W line */}
        <line x1="-20" y1="0" x2="20" y2="0" strokeWidth="0.3" />
        {/* NE-SW */}
        <line x1="14" y1="-14" x2="-14" y2="14" strokeWidth="0.15" />
        {/* NW-SE */}
        <line x1="-14" y1="-14" x2="14" y2="14" strokeWidth="0.15" />
        {/* North arrow */}
        <polygon points="0,-18 -4,-10 0,-12 4,-10" strokeWidth="0.3" fill="currentColor" />
        {/* Cardinal labels */}
        <text x="0" y="-25" textAnchor="middle" fontSize="7" fill="currentColor" stroke="none" fontWeight="bold" fontFamily="monospace">
          N
        </text>
        <text x="0" y="31" textAnchor="middle" fontSize="5.5" fill="currentColor" stroke="none" fontFamily="monospace">
          S
        </text>
        <text x="28" y="3" textAnchor="middle" fontSize="5.5" fill="currentColor" stroke="none" fontFamily="monospace">
          E
        </text>
        <text x="-28" y="3" textAnchor="middle" fontSize="5.5" fill="currentColor" stroke="none" fontFamily="monospace">
          O
        </text>
      </g>

      {/* ============================================================
          TITLE BLOCK
          ============================================================ */}
      <rect x="950" y="810" width="420" height="70" strokeWidth="0.6" opacity="0.5" />
      <line x1="950" y1="835" x2="1370" y2="835" strokeWidth="0.3" opacity="0.4" />
      <line x1="950" y1="855" x2="1370" y2="855" strokeWidth="0.3" opacity="0.4" />
      <line x1="1200" y1="835" x2="1200" y2="880" strokeWidth="0.3" opacity="0.4" />

      <text x="1160" y="828" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" opacity="0.55" fontFamily="monospace" fontWeight="bold" letterSpacing="1.5">
        CHALET GRAND PANORAMA — ÉLÉVATION 3D — 1:100
      </text>

      <text x="1070" y="848" textAnchor="middle" fontSize="6.5" fill="currentColor" stroke="none" opacity="0.45" fontFamily="monospace" letterSpacing="1">
        E-DOME ARCHITECTURE
      </text>

      <text x="1070" y="872" textAnchor="middle" fontSize="5.5" fill="currentColor" stroke="none" opacity="0.35" fontFamily="monospace">
        CHALET DE LUXE ALPIN — VUE PERSPECTIVE
      </text>

      <text x="1280" y="848" textAnchor="middle" fontSize="5.5" fill="currentColor" stroke="none" opacity="0.35" fontFamily="monospace">
        DATE: 2026-04
      </text>
      <text x="1280" y="872" textAnchor="middle" fontSize="5.5" fill="currentColor" stroke="none" opacity="0.35" fontFamily="monospace">
        PHASE: APD
      </text>

      {/* Drawing border */}
      <rect x="15" y="15" width="1370" height="870" strokeWidth="0.5" opacity="0.2" />
      <rect x="20" y="20" width="1360" height="860" strokeWidth="0.3" opacity="0.12" />

      {/* ============================================================
          ADDITIONAL DETAIL — WINDOW SHUTTERS INDICATION
          ============================================================ */}
      {/* Shutter lines on upper windows */}
      <line x1="365" y1="400" x2="365" y2="460" strokeWidth="0.2" opacity="0.2" />
      <line x1="464" y1="400" x2="464" y2="460" strokeWidth="0.2" opacity="0.2" />
      <line x1="515" y1="395" x2="515" y2="460" strokeWidth="0.2" opacity="0.2" />
      <line x1="624" y1="395" x2="624" y2="460" strokeWidth="0.2" opacity="0.2" />
      <line x1="675" y1="395" x2="675" y2="460" strokeWidth="0.2" opacity="0.2" />
      <line x1="784" y1="395" x2="784" y2="460" strokeWidth="0.2" opacity="0.2" />
      <line x1="825" y1="400" x2="825" y2="460" strokeWidth="0.2" opacity="0.2" />
      <line x1="924" y1="400" x2="924" y2="460" strokeWidth="0.2" opacity="0.2" />

      {/* Shutter hinge dots */}
      <circle cx="365" cy="420" r="1" strokeWidth="0.15" opacity="0.2" />
      <circle cx="365" cy="445" r="1" strokeWidth="0.15" opacity="0.2" />
      <circle cx="464" cy="420" r="1" strokeWidth="0.15" opacity="0.2" />
      <circle cx="464" cy="445" r="1" strokeWidth="0.15" opacity="0.2" />

      {/* ============================================================
          ADDITIONAL DETAIL — ROOF RAFTER TAILS
          ============================================================ */}
      {[...Array(10)].map((_, i) => {
        const x = 355 + i * 62;
        if (x > 930) return null;
        return (
          <line
            key={`rafter-${i}`}
            x1={x}
            y1={382}
            x2={x - 5}
            y2={390}
            strokeWidth="0.25"
            opacity="0.3"
          />
        );
      })}

      {/* ============================================================
          ADDITIONAL DETAIL — FOUNDATION DRAINAGE
          ============================================================ */}
      <line x1="340" y1="685" x2="940" y2="685" strokeWidth="0.2" strokeDasharray="3,2" opacity="0.15" />
      <line x1="940" y1="685" x2="1040" y2="645" strokeWidth="0.2" strokeDasharray="3,2" opacity="0.15" />

      {/* Gutter/downspout */}
      <line x1="345" y1="382" x2="345" y2="680" strokeWidth="0.2" opacity="0.25" />
      <line x1="935" y1="382" x2="935" y2="680" strokeWidth="0.2" opacity="0.25" />
      {/* Gutter bracket marks */}
      <line x1="343" y1="420" x2="347" y2="420" strokeWidth="0.15" opacity="0.2" />
      <line x1="343" y1="500" x2="347" y2="500" strokeWidth="0.15" opacity="0.2" />
      <line x1="343" y1="580" x2="347" y2="580" strokeWidth="0.15" opacity="0.2" />
      <line x1="933" y1="420" x2="937" y2="420" strokeWidth="0.15" opacity="0.2" />
      <line x1="933" y1="500" x2="937" y2="500" strokeWidth="0.15" opacity="0.2" />
      <line x1="933" y1="580" x2="937" y2="580" strokeWidth="0.15" opacity="0.2" />

      {/* ============================================================
          ADDITIONAL — WINDOW SILLS
          ============================================================ */}
      <line x1="356" y1="572" x2="474" y2="572" strokeWidth="0.3" opacity="0.3" />
      <line x1="506" y1="577" x2="644" y2="577" strokeWidth="0.3" opacity="0.3" />
      <line x1="806" y1="572" x2="924" y2="572" strokeWidth="0.3" opacity="0.3" />
      <line x1="366" y1="462" x2="464" y2="462" strokeWidth="0.25" opacity="0.3" />
      <line x1="516" y1="462" x2="624" y2="462" strokeWidth="0.25" opacity="0.3" />
      <line x1="676" y1="462" x2="784" y2="462" strokeWidth="0.25" opacity="0.3" />
      <line x1="826" y1="462" x2="924" y2="462" strokeWidth="0.25" opacity="0.3" />

      {/* ============================================================
          MISC — LIGHT FIXTURE AT ENTRANCE
          ============================================================ */}
      <circle cx="628" cy="510" r="3" strokeWidth="0.3" opacity="0.3" />
      <line x1="628" y1="507" x2="628" y2="502" strokeWidth="0.2" opacity="0.3" />
      <circle cx="722" cy="510" r="3" strokeWidth="0.3" opacity="0.3" />
      <line x1="722" y1="507" x2="722" y2="502" strokeWidth="0.2" opacity="0.3" />

      {/* House number */}
      <text x="675" y="496" textAnchor="middle" fontSize="5" fill="currentColor" stroke="none" opacity="0.3" fontFamily="serif">
        N° 7
      </text>

      {/* ============================================================
          SCALE BAR
          ============================================================ */}
      <g transform="translate(950,790)" opacity="0.4">
        <line x1="0" y1="0" x2="180" y2="0" strokeWidth="0.4" />
        <line x1="0" y1="-3" x2="0" y2="3" strokeWidth="0.3" />
        <line x1="36" y1="-3" x2="36" y2="3" strokeWidth="0.3" />
        <line x1="72" y1="-3" x2="72" y2="3" strokeWidth="0.3" />
        <line x1="108" y1="-3" x2="108" y2="3" strokeWidth="0.3" />
        <line x1="144" y1="-3" x2="144" y2="3" strokeWidth="0.3" />
        <line x1="180" y1="-3" x2="180" y2="3" strokeWidth="0.3" />
        {/* Alternating filled blocks */}
        <rect x="0" y="-2" width="36" height="4" strokeWidth="0.2" fill="currentColor" opacity="0.3" />
        <rect x="72" y="-2" width="36" height="4" strokeWidth="0.2" fill="currentColor" opacity="0.3" />
        <rect x="144" y="-2" width="36" height="4" strokeWidth="0.2" fill="currentColor" opacity="0.3" />
        <text x="0" y="10" textAnchor="middle" fontSize="4.5" fill="currentColor" stroke="none" fontFamily="monospace">0</text>
        <text x="36" y="10" textAnchor="middle" fontSize="4.5" fill="currentColor" stroke="none" fontFamily="monospace">2m</text>
        <text x="72" y="10" textAnchor="middle" fontSize="4.5" fill="currentColor" stroke="none" fontFamily="monospace">4m</text>
        <text x="108" y="10" textAnchor="middle" fontSize="4.5" fill="currentColor" stroke="none" fontFamily="monospace">6m</text>
        <text x="144" y="10" textAnchor="middle" fontSize="4.5" fill="currentColor" stroke="none" fontFamily="monospace">8m</text>
        <text x="180" y="10" textAnchor="middle" fontSize="4.5" fill="currentColor" stroke="none" fontFamily="monospace">10m</text>
      </g>

      {/* ============================================================
          GRID REFERENCE MARKS (along borders)
          ============================================================ */}
      {['A','B','C','D','E','F','G'].map((letter, i) => (
        <g key={`grid-h-${i}`} opacity="0.2">
          <text x={200 * i + 100} y="12" textAnchor="middle" fontSize="5" fill="currentColor" stroke="none" fontFamily="monospace">{letter}</text>
          <line x1={200 * i + 100} y1="15" x2={200 * i + 100} y2="20" strokeWidth="0.2" />
        </g>
      ))}
      {[1,2,3,4,5].map((num, i) => (
        <g key={`grid-v-${i}`} opacity="0.2">
          <text x="12" y={180 * i + 100} textAnchor="middle" fontSize="5" fill="currentColor" stroke="none" fontFamily="monospace">{num}</text>
          <line x1="15" y1={180 * i + 100} x2="20" y2={180 * i + 100} strokeWidth="0.2" />
        </g>
      ))}
    </svg>
  );
}
