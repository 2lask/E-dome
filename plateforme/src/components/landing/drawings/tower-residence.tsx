"use client"

export function TowerResidenceDrawing({ className }: { className?: string }) {
  // Building geometry constants
  const buildingLeft = 250
  const buildingRight = 550
  const buildingWidth = buildingRight - buildingLeft
  const groundLevel = 1050
  const floorHeight = 40
  const numFloors = 22
  const roofLevel = groundLevel - numFloors * floorHeight
  const penthouseSetback = 20
  const balconyDepth = 18
  const balconyWidth = 60

  // Generate floor slab lines
  const floorSlabs = []
  for (let i = 0; i <= numFloors; i++) {
    const y = groundLevel - i * floorHeight
    floorSlabs.push(y)
  }

  // Generate window grid
  const windowCols = 8
  const windowWidth = (buildingWidth - 30) / windowCols - 4
  const windowMargin = 4

  // Generate cross-hatching pattern for concrete
  const crossHatchLines = []
  for (let i = 0; i < 40; i++) {
    crossHatchLines.push(i * 6)
  }

  return (
    <svg
      viewBox="0 0 800 1200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      stroke="currentColor"
    >
      {/* ============================================= */}
      {/* DEFS: Patterns, Gradients, Markers            */}
      {/* ============================================= */}
      <defs>
        {/* Cross-hatch pattern for exposed concrete */}
        <pattern id="crosshatch" width="8" height="8" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="8" y2="8" strokeWidth="0.3" stroke="currentColor" opacity="0.3" />
          <line x1="8" y1="0" x2="0" y2="8" strokeWidth="0.3" stroke="currentColor" opacity="0.3" />
        </pattern>

        {/* Diagonal glass reflection pattern */}
        <pattern id="glassReflect" width="12" height="12" patternUnits="userSpaceOnUse">
          <line x1="0" y1="12" x2="12" y2="0" strokeWidth="0.4" stroke="currentColor" opacity="0.15" />
        </pattern>

        {/* Ground fill pattern */}
        <pattern id="groundHatch" width="6" height="6" patternUnits="userSpaceOnUse">
          <line x1="0" y1="6" x2="6" y2="0" strokeWidth="0.2" stroke="currentColor" opacity="0.2" />
        </pattern>

        {/* Tree leaf cluster pattern */}
        <pattern id="leafPattern" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="1.2" fill="none" strokeWidth="0.3" stroke="currentColor" opacity="0.3" />
        </pattern>

        {/* Section cut arrow marker */}
        <marker id="sectionArrow" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
          <polygon points="0,0 8,3 0,6" fill="currentColor" stroke="none" />
        </marker>

        {/* Dimension tick marker */}
        <marker id="dimTick" markerWidth="1" markerHeight="8" refX="0.5" refY="4" orient="auto">
          <line x1="0.5" y1="0" x2="0.5" y2="8" strokeWidth="0.6" stroke="currentColor" />
        </marker>
      </defs>

      {/* ============================================= */}
      {/* TITLE BLOCK                                   */}
      {/* ============================================= */}
      <rect x="20" y="1140" width="760" height="45" strokeWidth="1.2" stroke="currentColor" fill="none" />
      <line x1="400" y1="1140" x2="400" y2="1185" strokeWidth="0.6" />
      <line x1="600" y1="1140" x2="600" y2="1185" strokeWidth="0.6" />
      <line x1="20" y1="1160" x2="400" y2="1160" strokeWidth="0.4" />
      <text x="210" y="1155" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="currentColor" stroke="none" fontWeight="bold">
        RÉSIDENCE LE DOMAINE — FAÇADE PRINCIPALE
      </text>
      <text x="210" y="1175" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="currentColor" stroke="none">
        ÉLÉVATION SUD — ÉCHELLE 1:250
      </text>
      <text x="500" y="1158" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="currentColor" stroke="none">
        E-DOME ARCHITECTURE
      </text>
      <text x="500" y="1175" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="currentColor" stroke="none">
        RÉF: ED-2026-ARC-001 — REV. B
      </text>
      <text x="700" y="1155" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="currentColor" stroke="none">
        DATE: 07.04.2026
      </text>
      <text x="700" y="1175" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="currentColor" stroke="none">
        DESSINÉ: LR / VÉR: MH
      </text>

      {/* Drawing border */}
      <rect x="15" y="10" width="770" height="1180" strokeWidth="1.5" stroke="currentColor" fill="none" />
      <rect x="18" y="13" width="764" height="1174" strokeWidth="0.3" stroke="currentColor" fill="none" />

      {/* ============================================= */}
      {/* GROUND / STREET / SIDEWALK                    */}
      {/* ============================================= */}
      {/* Ground level line - heavy */}
      <line x1="40" y1={groundLevel} x2="760" y2={groundLevel} strokeWidth="2" />

      {/* Sidewalk */}
      <rect x="100" y={groundLevel} width="600" height="15" strokeWidth="0.5" fill="url(#groundHatch)" />
      <line x1="100" y1={groundLevel + 15} x2="700" y2={groundLevel + 15} strokeWidth="0.8" />

      {/* Sidewalk tile pattern */}
      {Array.from({ length: 30 }, (_, i) => (
        <line key={`tile-${i}`} x1={100 + i * 20} y1={groundLevel} x2={100 + i * 20} y2={groundLevel + 15} strokeWidth="0.2" opacity="0.3" />
      ))}

      {/* Street / Road */}
      <rect x="60" y={groundLevel + 15} width="680" height="40" strokeWidth="0.5" fill="none" />
      {/* Lane markings - dashed center line */}
      {Array.from({ length: 17 }, (_, i) => (
        <line key={`lane-${i}`} x1={80 + i * 40} y1={groundLevel + 35} x2={95 + i * 40} y2={groundLevel + 35} strokeWidth="1" opacity="0.5" />
      ))}
      {/* Road edge lines */}
      <line x1="60" y1={groundLevel + 55} x2="740" y2={groundLevel + 55} strokeWidth="0.8" />
      {/* Curb detail */}
      <line x1="100" y1={groundLevel + 2} x2="700" y2={groundLevel + 2} strokeWidth="0.3" opacity="0.5" />

      {/* ============================================= */}
      {/* BUILDING MAIN OUTLINE                         */}
      {/* ============================================= */}
      {/* Main facade - heavy outline */}
      <rect x={buildingLeft} y={roofLevel} width={buildingWidth} height={groundLevel - roofLevel} strokeWidth="2" fill="none" />

      {/* 3D perspective - right side depth lines */}
      <line x1={buildingRight} y1={roofLevel} x2={buildingRight + 25} y2={roofLevel - 12} strokeWidth="1" opacity="0.5" />
      <line x1={buildingRight} y1={groundLevel} x2={buildingRight + 25} y2={groundLevel - 12} strokeWidth="1" opacity="0.5" />
      <line x1={buildingRight + 25} y1={roofLevel - 12} x2={buildingRight + 25} y2={groundLevel - 12} strokeWidth="1" opacity="0.4" />

      {/* 3D perspective lines every 5 floors */}
      {floorSlabs.filter((_, i) => i % 5 === 0 && i > 0 && i < numFloors).map((y, idx) => (
        <line key={`persp-${idx}`} x1={buildingRight} y1={y} x2={buildingRight + 25} y2={y - 12} strokeWidth="0.3" opacity="0.3" />
      ))}

      {/* Right side depth face hatching */}
      {Array.from({ length: 35 }, (_, i) => {
        const y = roofLevel + i * ((groundLevel - roofLevel) / 35)
        return (
          <line key={`depth-h-${i}`} x1={buildingRight + 1} y1={y} x2={buildingRight + 25} y2={y - 12} strokeWidth="0.15" opacity="0.15" />
        )
      })}

      {/* ============================================= */}
      {/* FLOOR SLAB LINES                              */}
      {/* ============================================= */}
      {floorSlabs.map((y, i) => (
        <g key={`floor-${i}`}>
          {/* Floor slab line */}
          <line x1={buildingLeft} y1={y} x2={buildingRight} y2={y} strokeWidth={i === 0 ? 2 : 0.6} opacity={i === 0 ? 1 : 0.7} />
          {/* Slab thickness */}
          {i > 0 && i < numFloors && (
            <line x1={buildingLeft} y1={y + 2} x2={buildingRight} y2={y + 2} strokeWidth="0.2" opacity="0.3" />
          )}
        </g>
      ))}

      {/* ============================================= */}
      {/* CURTAIN WALL / WINDOW GRID                    */}
      {/* ============================================= */}
      {/* Vertical mullions */}
      {Array.from({ length: windowCols + 1 }, (_, col) => {
        const x = buildingLeft + 15 + col * ((buildingWidth - 30) / windowCols)
        return (
          <line key={`mullion-v-${col}`} x1={x} y1={roofLevel + 3} x2={x} y2={groundLevel - 3} strokeWidth="0.4" opacity="0.5" />
        )
      })}

      {/* Individual window panes with mullion subdivisions */}
      {floorSlabs.slice(1, -1).map((y, floorIdx) => (
        <g key={`windows-floor-${floorIdx}`}>
          {Array.from({ length: windowCols }, (_, col) => {
            const x = buildingLeft + 15 + col * ((buildingWidth - 30) / windowCols) + 2
            const w = windowWidth
            const h = floorHeight - 8
            const showReflection = (floorIdx + col) % 5 === 0
            return (
              <g key={`win-${floorIdx}-${col}`}>
                {/* Window pane */}
                <rect x={x} y={y + 4} width={w} height={h} strokeWidth="0.3" opacity="0.6" fill="none" />
                {/* Horizontal mullion subdivision */}
                <line x1={x} y1={y + 4 + h / 2} x2={x + w} y2={y + 4 + h / 2} strokeWidth="0.15" opacity="0.3" />
                {/* Glass reflection diagonal on select windows */}
                {showReflection && (
                  <>
                    <line x1={x + 2} y1={y + 4 + h - 2} x2={x + w * 0.4} y2={y + 6} strokeWidth="0.3" opacity="0.12" />
                    <line x1={x + 5} y1={y + 4 + h - 2} x2={x + w * 0.5} y2={y + 6} strokeWidth="0.3" opacity="0.08" />
                  </>
                )}
              </g>
            )
          })}
        </g>
      ))}

      {/* ============================================= */}
      {/* BALCONIES (alternating every 2 floors)        */}
      {/* ============================================= */}
      {floorSlabs.slice(1).map((y, i) => {
        if (i < 1 || i >= numFloors - 1) return null
        const isLeft = Math.floor(i / 2) % 2 === 0
        const balconyY = y
        // Every 2 floors, alternate side
        if (i % 2 !== 0) return null

        return (
          <g key={`balcony-${i}`}>
            {isLeft ? (
              <>
                {/* Left balcony slab */}
                <rect x={buildingLeft - balconyDepth} y={balconyY - 1} width={balconyDepth + 2} height="3" strokeWidth="0.8" fill="url(#crosshatch)" />
                {/* Railing posts */}
                <line x1={buildingLeft - balconyDepth} y1={balconyY - 1} x2={buildingLeft - balconyDepth} y2={balconyY - 20} strokeWidth="0.5" />
                <line x1={buildingLeft - balconyDepth + 6} y1={balconyY - 1} x2={buildingLeft - balconyDepth + 6} y2={balconyY - 20} strokeWidth="0.3" />
                {/* Railing top rail */}
                <line x1={buildingLeft - balconyDepth} y1={balconyY - 20} x2={buildingLeft + 2} y2={balconyY - 20} strokeWidth="0.5" />
                {/* Glass railing panel */}
                <rect x={buildingLeft - balconyDepth + 1} y={balconyY - 18} width={balconyDepth - 2} height="15" strokeWidth="0.2" opacity="0.3" fill="none" />
                {/* Balcony soffit line */}
                <line x1={buildingLeft - balconyDepth} y1={balconyY + 2} x2={buildingLeft} y2={balconyY + 2} strokeWidth="0.2" opacity="0.4" />
              </>
            ) : (
              <>
                {/* Right balcony slab */}
                <rect x={buildingRight - 2} y={balconyY - 1} width={balconyDepth + 2} height="3" strokeWidth="0.8" fill="url(#crosshatch)" />
                {/* Railing posts */}
                <line x1={buildingRight + balconyDepth} y1={balconyY - 1} x2={buildingRight + balconyDepth} y2={balconyY - 20} strokeWidth="0.5" />
                <line x1={buildingRight + balconyDepth - 6} y1={balconyY - 1} x2={buildingRight + balconyDepth - 6} y2={balconyY - 20} strokeWidth="0.3" />
                {/* Railing top rail */}
                <line x1={buildingRight - 2} y1={balconyY - 20} x2={buildingRight + balconyDepth} y2={balconyY - 20} strokeWidth="0.5" />
                {/* Glass railing panel */}
                <rect x={buildingRight + 1} y={balconyY - 18} width={balconyDepth - 2} height="15" strokeWidth="0.2" opacity="0.3" fill="none" />
                {/* Balcony soffit line */}
                <line x1={buildingRight} y1={balconyY + 2} x2={buildingRight + balconyDepth} y2={balconyY + 2} strokeWidth="0.2" opacity="0.4" />
              </>
            )}
          </g>
        )
      })}

      {/* ============================================= */}
      {/* PENTHOUSE (top 2 floors with setback)         */}
      {/* ============================================= */}
      {/* Penthouse setback outline */}
      <rect
        x={buildingLeft + penthouseSetback}
        y={roofLevel - 10}
        width={buildingWidth - penthouseSetback * 2}
        height={floorHeight * 2 + 10}
        strokeWidth="1"
        fill="none"
      />
      {/* Penthouse terrace slab (setback area) */}
      <rect x={buildingLeft} y={roofLevel + floorHeight * 2} width={penthouseSetback} height="3" strokeWidth="0.5" fill="url(#crosshatch)" />
      <rect x={buildingRight - penthouseSetback} y={roofLevel + floorHeight * 2} width={penthouseSetback} height="3" strokeWidth="0.5" fill="url(#crosshatch)" />
      {/* Terrace railing - left */}
      <line x1={buildingLeft} y1={roofLevel + floorHeight * 2} x2={buildingLeft} y2={roofLevel + floorHeight * 2 - 18} strokeWidth="0.5" />
      <line x1={buildingLeft} y1={roofLevel + floorHeight * 2 - 18} x2={buildingLeft + penthouseSetback} y2={roofLevel + floorHeight * 2 - 18} strokeWidth="0.5" />
      {/* Terrace railing - right */}
      <line x1={buildingRight} y1={roofLevel + floorHeight * 2} x2={buildingRight} y2={roofLevel + floorHeight * 2 - 18} strokeWidth="0.5" />
      <line x1={buildingRight - penthouseSetback} y1={roofLevel + floorHeight * 2 - 18} x2={buildingRight} y2={roofLevel + floorHeight * 2 - 18} strokeWidth="0.5" />
      {/* Penthouse larger windows */}
      {Array.from({ length: 5 }, (_, i) => {
        const pw = (buildingWidth - penthouseSetback * 2 - 30) / 5
        const px = buildingLeft + penthouseSetback + 15 + i * (pw + 2)
        return (
          <g key={`ph-win-${i}`}>
            <rect x={px} y={roofLevel - 6} width={pw - 2} height={floorHeight * 2 + 2} strokeWidth="0.4" opacity="0.6" fill="none" />
            <line x1={px} y1={roofLevel - 6 + floorHeight} x2={px + pw - 2} y2={roofLevel - 6 + floorHeight} strokeWidth="0.2" opacity="0.3" />
            {/* Reflection on penthouse glass */}
            {i % 2 === 0 && (
              <line x1={px + 3} y1={roofLevel + floorHeight * 2 - 8} x2={px + pw * 0.6} y2={roofLevel} strokeWidth="0.3" opacity="0.1" />
            )}
          </g>
        )
      })}

      {/* ============================================= */}
      {/* ROOFTOP: Mechanical room, antenna, parapet     */}
      {/* ============================================= */}
      {/* Parapet wall */}
      <rect x={buildingLeft + penthouseSetback} y={roofLevel - 14} width={buildingWidth - penthouseSetback * 2} height="4" strokeWidth="0.8" fill="url(#crosshatch)" />
      {/* Parapet coping */}
      <line x1={buildingLeft + penthouseSetback - 2} y1={roofLevel - 14} x2={buildingRight - penthouseSetback + 2} y2={roofLevel - 14} strokeWidth="0.6" />

      {/* Mechanical room */}
      <rect x={350} y={roofLevel - 45} width={100} height="31" strokeWidth="0.8" fill="none" />
      {/* Mechanical room hatching */}
      <rect x={350} y={roofLevel - 45} width={100} height="31" strokeWidth="0" fill="url(#crosshatch)" />
      {/* Mechanical room door */}
      <rect x={385} y={roofLevel - 30} width={15} height="16" strokeWidth="0.4" fill="none" />
      {/* Louvered vent on mech room */}
      <rect x={410} y={roofLevel - 42} width={30} height="12" strokeWidth="0.4" fill="none" />
      {Array.from({ length: 6 }, (_, i) => (
        <line key={`louver-${i}`} x1={411} y1={roofLevel - 41 + i * 2} x2={439} y2={roofLevel - 41 + i * 2} strokeWidth="0.3" opacity="0.5" />
      ))}

      {/* Antenna / telecom mast */}
      <line x1={400} y1={roofLevel - 45} x2={400} y2={roofLevel - 85} strokeWidth="1" />
      <line x1={397} y1={roofLevel - 75} x2={403} y2={roofLevel - 75} strokeWidth="0.5" />
      <line x1={395} y1={roofLevel - 65} x2={405} y2={roofLevel - 65} strokeWidth="0.5" />
      <circle cx={400} cy={roofLevel - 85} r="2" strokeWidth="0.5" fill="none" />
      {/* Lightning rod */}
      <line x1={400} y1={roofLevel - 85} x2={400} y2={roofLevel - 92} strokeWidth="0.4" />

      {/* Roof edge equipment */}
      <rect x={310} y={roofLevel - 22} width={18} height="8" strokeWidth="0.4" fill="url(#crosshatch)" />
      <rect x={472} y={roofLevel - 22} width={18} height="8" strokeWidth="0.4" fill="url(#crosshatch)" />

      {/* ============================================= */}
      {/* GROUND FLOOR LOBBY & ENTRANCE                 */}
      {/* ============================================= */}
      {/* Lobby entrance - double height */}
      <rect x={buildingLeft + 80} y={groundLevel - floorHeight * 2 + 5} width={buildingWidth - 160} height={floorHeight * 2 - 5} strokeWidth="1" fill="none" />
      {/* Entrance doors - revolving */}
      <rect x={buildingLeft + 120} y={groundLevel - 30} width={60} height="30" strokeWidth="0.6" fill="none" />
      <circle cx={buildingLeft + 150} cy={groundLevel - 15} r="12" strokeWidth="0.3" opacity="0.4" fill="none" />
      {/* Revolving door wings */}
      <line x1={buildingLeft + 150} y1={groundLevel - 27} x2={buildingLeft + 150} y2={groundLevel - 3} strokeWidth="0.3" opacity="0.4" />
      <line x1={buildingLeft + 138} y1={groundLevel - 15} x2={buildingLeft + 162} y2={groundLevel - 15} strokeWidth="0.3" opacity="0.4" />

      {/* Entrance canopy */}
      <line x1={buildingLeft + 70} y1={groundLevel - floorHeight * 2 + 5} x2={buildingLeft + 60} y2={groundLevel - floorHeight * 2 - 5} strokeWidth="0.8" />
      <line x1={buildingRight - 70} y1={groundLevel - floorHeight * 2 + 5} x2={buildingRight - 60} y2={groundLevel - floorHeight * 2 - 5} strokeWidth="0.8" />
      <line x1={buildingLeft + 60} y1={groundLevel - floorHeight * 2 - 5} x2={buildingRight - 60} y2={groundLevel - floorHeight * 2 - 5} strokeWidth="1.2" />
      {/* Canopy underside */}
      <line x1={buildingLeft + 62} y1={groundLevel - floorHeight * 2 - 3} x2={buildingRight - 62} y2={groundLevel - floorHeight * 2 - 3} strokeWidth="0.3" opacity="0.4" />

      {/* Canopy support cables */}
      <line x1={buildingLeft + 80} y1={groundLevel - floorHeight * 2 - 5} x2={buildingLeft + 90} y2={groundLevel - floorHeight * 3} strokeWidth="0.3" opacity="0.5" />
      <line x1={buildingRight - 80} y1={groundLevel - floorHeight * 2 - 5} x2={buildingRight - 90} y2={groundLevel - floorHeight * 3} strokeWidth="0.3" opacity="0.5" />

      {/* Lobby interior lines */}
      <line x1={buildingLeft + 82} y1={groundLevel - 20} x2={buildingLeft + 82} y2={groundLevel - floorHeight * 2 + 8} strokeWidth="0.2" opacity="0.3" />
      <line x1={buildingRight - 82} y1={groundLevel - 20} x2={buildingRight - 82} y2={groundLevel - floorHeight * 2 + 8} strokeWidth="0.2" opacity="0.3" />

      {/* Ground floor side windows (left) */}
      {Array.from({ length: 2 }, (_, i) => (
        <rect key={`gf-wl-${i}`} x={buildingLeft + 10 + i * 30} y={groundLevel - 35} width={25} height="30" strokeWidth="0.4" opacity="0.5" fill="none" />
      ))}
      {/* Ground floor side windows (right) */}
      {Array.from({ length: 2 }, (_, i) => (
        <rect key={`gf-wr-${i}`} x={buildingRight - 65 + i * 30} y={groundLevel - 35} width={25} height="30" strokeWidth="0.4" opacity="0.5" fill="none" />
      ))}

      {/* Steps at entrance */}
      {Array.from({ length: 3 }, (_, i) => (
        <line key={`step-${i}`} x1={buildingLeft + 90 - i * 8} y1={groundLevel + i * 3} x2={buildingRight - 90 + i * 8} y2={groundLevel + i * 3} strokeWidth="0.5" />
      ))}

      {/* ============================================= */}
      {/* COLUMN GRID DOTS AT BASE                      */}
      {/* ============================================= */}
      {Array.from({ length: 9 }, (_, i) => {
        const cx = buildingLeft + 15 + i * ((buildingWidth - 30) / 8)
        return (
          <g key={`col-${i}`}>
            <circle cx={cx} cy={groundLevel} r="3" strokeWidth="0.5" fill="none" />
            <circle cx={cx} cy={groundLevel} r="1" strokeWidth="0.3" fill="currentColor" />
            {/* Column grid line extending below */}
            <line x1={cx} y1={groundLevel} x2={cx} y2={groundLevel + 8} strokeWidth="0.2" opacity="0.3" strokeDasharray="2,2" />
          </g>
        )
      })}

      {/* ============================================= */}
      {/* CORE WALLS (shown as dashed section cut)      */}
      {/* ============================================= */}
      <rect x={370} y={roofLevel + 3} width={60} height={groundLevel - roofLevel - 6} strokeWidth="0.6" strokeDasharray="4,3" opacity="0.25" fill="none" />
      {/* Elevator shaft indicators */}
      <rect x={375} y={roofLevel + 10} width={22} height={groundLevel - roofLevel - 20} strokeWidth="0.3" opacity="0.15" fill="none" />
      <rect x={403} y={roofLevel + 10} width={22} height={groundLevel - roofLevel - 20} strokeWidth="0.3" opacity="0.15" fill="none" />
      {/* Stair core */}
      <line x1={398} y1={roofLevel + 10} x2={398} y2={groundLevel - 10} strokeWidth="0.2" opacity="0.15" strokeDasharray="2,4" />

      {/* ============================================= */}
      {/* FLOOR NUMBERS (every 5 floors)                */}
      {/* ============================================= */}
      {[0, 5, 10, 15, 20].map((floor) => {
        const y = groundLevel - floor * floorHeight
        return (
          <g key={`flabel-${floor}`}>
            <text x={buildingLeft - 30} y={y - floorHeight / 2 + 4} textAnchor="middle" fontSize="7" fontFamily="monospace" fill="currentColor" stroke="none">
              {floor === 0 ? "RDC" : `N+${floor}`}
            </text>
            {/* Tick mark */}
            <line x1={buildingLeft - 8} y1={y} x2={buildingLeft - 3} y2={y} strokeWidth="0.5" />
          </g>
        )
      })}

      {/* Penthouse label */}
      <text x={buildingLeft - 30} y={roofLevel + floorHeight - 2} textAnchor="middle" fontSize="6" fontFamily="monospace" fill="currentColor" stroke="none">
        PH
      </text>

      {/* ============================================= */}
      {/* HEIGHT DIMENSIONS (right side)                */}
      {/* ============================================= */}
      {/* Overall height dimension line */}
      <line x1={buildingRight + 60} y1={groundLevel} x2={buildingRight + 60} y2={roofLevel - 14} strokeWidth="0.4" />
      <line x1={buildingRight + 55} y1={groundLevel} x2={buildingRight + 65} y2={groundLevel} strokeWidth="0.4" />
      <line x1={buildingRight + 55} y1={roofLevel - 14} x2={buildingRight + 65} y2={roofLevel - 14} strokeWidth="0.4" />
      <text x={buildingRight + 72} y={(groundLevel + roofLevel - 14) / 2} textAnchor="middle" fontSize="6" fontFamily="monospace" fill="currentColor" stroke="none" transform={`rotate(-90, ${buildingRight + 72}, ${(groundLevel + roofLevel - 14) / 2})`}>
        {`${(numFloors * floorHeight * 0.25).toFixed(1)}m (${numFloors} niveaux)`}
      </text>

      {/* Antenna height */}
      <line x1={buildingRight + 45} y1={roofLevel - 14} x2={buildingRight + 45} y2={roofLevel - 92} strokeWidth="0.3" strokeDasharray="2,2" />
      <text x={buildingRight + 50} y={roofLevel - 55} fontSize="5" fontFamily="monospace" fill="currentColor" stroke="none" opacity="0.6">
        +96.5m
      </text>

      {/* Floor-to-floor dimension (typical) */}
      <line x1={buildingRight + 40} y1={groundLevel - 5 * floorHeight} x2={buildingRight + 40} y2={groundLevel - 6 * floorHeight} strokeWidth="0.3" />
      <line x1={buildingRight + 36} y1={groundLevel - 5 * floorHeight} x2={buildingRight + 44} y2={groundLevel - 5 * floorHeight} strokeWidth="0.3" />
      <line x1={buildingRight + 36} y1={groundLevel - 6 * floorHeight} x2={buildingRight + 44} y2={groundLevel - 6 * floorHeight} strokeWidth="0.3" />
      <text x={buildingRight + 48} y={groundLevel - 5.5 * floorHeight + 2} fontSize="5" fontFamily="monospace" fill="currentColor" stroke="none">
        3.0m typ.
      </text>

      {/* ============================================= */}
      {/* BUILDING WIDTH DIMENSION (bottom)             */}
      {/* ============================================= */}
      <line x1={buildingLeft} y1={groundLevel + 70} x2={buildingRight} y2={groundLevel + 70} strokeWidth="0.4" />
      <line x1={buildingLeft} y1={groundLevel + 65} x2={buildingLeft} y2={groundLevel + 75} strokeWidth="0.4" />
      <line x1={buildingRight} y1={groundLevel + 65} x2={buildingRight} y2={groundLevel + 75} strokeWidth="0.4" />
      <text x={(buildingLeft + buildingRight) / 2} y={groundLevel + 82} textAnchor="middle" fontSize="7" fontFamily="monospace" fill="currentColor" stroke="none">
        75.0m
      </text>
      {/* Extension lines */}
      <line x1={buildingLeft} y1={groundLevel + 3} x2={buildingLeft} y2={groundLevel + 68} strokeWidth="0.2" strokeDasharray="3,3" opacity="0.3" />
      <line x1={buildingRight} y1={groundLevel + 3} x2={buildingRight} y2={groundLevel + 68} strokeWidth="0.2" strokeDasharray="3,3" opacity="0.3" />

      {/* ============================================= */}
      {/* SECTION CUT INDICATION                        */}
      {/* ============================================= */}
      {/* Section line A-A */}
      <line x1={buildingLeft - 50} y1={groundLevel - 10 * floorHeight} x2={buildingRight + 80} y2={groundLevel - 10 * floorHeight} strokeWidth="0.8" strokeDasharray="12,4,2,4" opacity="0.35" />
      {/* Section arrows */}
      <g>
        <circle cx={buildingLeft - 55} cy={groundLevel - 10 * floorHeight} r="8" strokeWidth="0.8" fill="none" />
        <text x={buildingLeft - 55} y={groundLevel - 10 * floorHeight + 3} textAnchor="middle" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="currentColor" stroke="none">
          A
        </text>
        <line x1={buildingLeft - 55} y1={groundLevel - 10 * floorHeight + 8} x2={buildingLeft - 55} y2={groundLevel - 10 * floorHeight + 18} strokeWidth="0.8" markerEnd="url(#sectionArrow)" />
      </g>
      <g>
        <circle cx={buildingRight + 85} cy={groundLevel - 10 * floorHeight} r="8" strokeWidth="0.8" fill="none" />
        <text x={buildingRight + 85} y={groundLevel - 10 * floorHeight + 3} textAnchor="middle" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="currentColor" stroke="none">
          A
        </text>
        <line x1={buildingRight + 85} y1={groundLevel - 10 * floorHeight - 8} x2={buildingRight + 85} y2={groundLevel - 10 * floorHeight - 18} strokeWidth="0.8" markerEnd="url(#sectionArrow)" />
      </g>

      {/* ============================================= */}
      {/* CAR PARK ENTRANCE RAMP                        */}
      {/* ============================================= */}
      {/* Ramp opening */}
      <rect x={buildingLeft - 5} y={groundLevel - 28} width={50} height="28" strokeWidth="0.8" fill="none" />
      {/* Ramp slope line */}
      <line x1={buildingLeft - 5} y1={groundLevel} x2={buildingLeft + 20} y2={groundLevel + 12} strokeWidth="0.6" />
      <line x1={buildingLeft + 45} y1={groundLevel} x2={buildingLeft + 20} y2={groundLevel + 12} strokeWidth="0.6" />
      {/* Ramp guard wall */}
      <line x1={buildingLeft - 5} y1={groundLevel - 28} x2={buildingLeft - 15} y2={groundLevel - 15} strokeWidth="0.5" />
      <line x1={buildingLeft - 15} y1={groundLevel - 15} x2={buildingLeft - 15} y2={groundLevel} strokeWidth="0.5" />
      {/* Ramp cross hatching */}
      {Array.from({ length: 5 }, (_, i) => (
        <line key={`ramp-h-${i}`} x1={buildingLeft - 4} y1={groundLevel - 5 - i * 5} x2={buildingLeft + 44} y2={groundLevel - 5 - i * 5} strokeWidth="0.15" opacity="0.2" />
      ))}
      {/* P sign */}
      <text x={buildingLeft + 20} y={groundLevel - 10} textAnchor="middle" fontSize="12" fontFamily="monospace" fontWeight="bold" fill="currentColor" stroke="none" opacity="0.5">
        P
      </text>
      {/* Arrow down */}
      <line x1={buildingLeft + 20} y1={groundLevel - 6} x2={buildingLeft + 20} y2={groundLevel - 2} strokeWidth="0.5" opacity="0.5" markerEnd="url(#sectionArrow)" />

      {/* ============================================= */}
      {/* TREES & LANDSCAPING                           */}
      {/* ============================================= */}
      {/* Tree 1 - left side */}
      <g opacity="0.7">
        <line x1={140} y1={groundLevel} x2={140} y2={groundLevel - 40} strokeWidth="1.2" />
        <ellipse cx={140} cy={groundLevel - 55} rx="20" ry="18" strokeWidth="0.6" fill="url(#leafPattern)" />
        <ellipse cx={132} cy={groundLevel - 48} rx="12" ry="10" strokeWidth="0.4" fill="none" opacity="0.4" />
        <ellipse cx={150} cy={groundLevel - 50} rx="10" ry="12" strokeWidth="0.4" fill="none" opacity="0.4" />
      </g>

      {/* Tree 2 - left */}
      <g opacity="0.6">
        <line x1={180} y1={groundLevel} x2={180} y2={groundLevel - 30} strokeWidth="0.8" />
        <ellipse cx={180} cy={groundLevel - 42} rx="15" ry="14" strokeWidth="0.5" fill="url(#leafPattern)" />
        <ellipse cx={175} cy={groundLevel - 38} rx="8" ry="8" strokeWidth="0.3" fill="none" opacity="0.3" />
      </g>

      {/* Tree 3 - right side */}
      <g opacity="0.7">
        <line x1={660} y1={groundLevel} x2={660} y2={groundLevel - 45} strokeWidth="1.2" />
        <ellipse cx={660} cy={groundLevel - 58} rx="22" ry="16" strokeWidth="0.6" fill="url(#leafPattern)" />
        <ellipse cx={668} cy={groundLevel - 52} rx="12" ry="11" strokeWidth="0.4" fill="none" opacity="0.4" />
        <ellipse cx={652} cy={groundLevel - 54} rx="10" ry="10" strokeWidth="0.4" fill="none" opacity="0.3" />
      </g>

      {/* Tree 4 - right */}
      <g opacity="0.5">
        <line x1={710} y1={groundLevel} x2={710} y2={groundLevel - 35} strokeWidth="0.8" />
        <ellipse cx={710} cy={groundLevel - 46} rx="14" ry="13" strokeWidth="0.5" fill="url(#leafPattern)" />
      </g>

      {/* Small hedge / bushes left */}
      {Array.from({ length: 4 }, (_, i) => (
        <ellipse key={`bush-l-${i}`} cx={buildingLeft - 30 + i * 12} cy={groundLevel - 5} rx="6" ry="5" strokeWidth="0.3" opacity="0.35" fill="none" />
      ))}

      {/* Small hedge / bushes right */}
      {Array.from({ length: 3 }, (_, i) => (
        <ellipse key={`bush-r-${i}`} cx={buildingRight + 40 + i * 12} cy={groundLevel - 5} rx="6" ry="5" strokeWidth="0.3" opacity="0.35" fill="none" />
      ))}

      {/* Planter boxes at entrance */}
      <rect x={buildingLeft + 65} y={groundLevel - 8} width={20} height="8" strokeWidth="0.4" fill="url(#crosshatch)" opacity="0.5" />
      <ellipse cx={buildingLeft + 75} cy={groundLevel - 12} rx="8" ry="5" strokeWidth="0.3" opacity="0.4" fill="none" />
      <rect x={buildingRight - 85} y={groundLevel - 8} width={20} height="8" strokeWidth="0.4" fill="url(#crosshatch)" opacity="0.5" />
      <ellipse cx={buildingRight - 75} cy={groundLevel - 12} rx="8" ry="5" strokeWidth="0.3" opacity="0.4" fill="none" />

      {/* ============================================= */}
      {/* STREET LIGHTS                                 */}
      {/* ============================================= */}
      {/* Street light 1 */}
      <g opacity="0.6">
        <line x1={120} y1={groundLevel + 15} x2={120} y2={groundLevel - 50} strokeWidth="0.8" />
        <line x1={120} y1={groundLevel - 50} x2={130} y2={groundLevel - 52} strokeWidth="0.6" />
        <ellipse cx={132} cy={groundLevel - 52} rx="4" ry="2" strokeWidth="0.4" fill="none" />
        <circle cx={120} cy={groundLevel + 15} r="2" strokeWidth="0.3" fill="none" />
      </g>

      {/* Street light 2 */}
      <g opacity="0.6">
        <line x1={690} y1={groundLevel + 15} x2={690} y2={groundLevel - 50} strokeWidth="0.8" />
        <line x1={690} y1={groundLevel - 50} x2={680} y2={groundLevel - 52} strokeWidth="0.6" />
        <ellipse cx={678} cy={groundLevel - 52} rx="4" ry="2" strokeWidth="0.4" fill="none" />
        <circle cx={690} cy={groundLevel + 15} r="2" strokeWidth="0.3" fill="none" />
      </g>

      {/* Street light 3 - center */}
      <g opacity="0.5">
        <line x1={400} y1={groundLevel + 15} x2={400} y2={groundLevel - 45} strokeWidth="0.6" />
        <line x1={400} y1={groundLevel - 45} x2={390} y2={groundLevel - 47} strokeWidth="0.5" />
        <line x1={400} y1={groundLevel - 45} x2={410} y2={groundLevel - 47} strokeWidth="0.5" />
        <ellipse cx={388} cy={groundLevel - 47} rx="3" ry="1.5" strokeWidth="0.3" fill="none" />
        <ellipse cx={412} cy={groundLevel - 47} rx="3" ry="1.5" strokeWidth="0.3" fill="none" />
      </g>

      {/* ============================================= */}
      {/* ADDITIONAL STRUCTURAL DETAILS                 */}
      {/* ============================================= */}
      {/* Foundation indication below ground */}
      <line x1={buildingLeft - 5} y1={groundLevel + 10} x2={buildingRight + 5} y2={groundLevel + 10} strokeWidth="0.4" strokeDasharray="4,2" opacity="0.3" />
      <line x1={buildingLeft + 10} y1={groundLevel + 13} x2={buildingRight - 10} y2={groundLevel + 13} strokeWidth="0.3" strokeDasharray="3,2" opacity="0.2" />
      <text x={buildingRight + 10} y={groundLevel + 12} fontSize="5" fontFamily="monospace" fill="currentColor" stroke="none" opacity="0.4">
        FOND.
      </text>

      {/* Spandrel panels at each floor (subtle) */}
      {floorSlabs.slice(2, -1).map((y, i) => (
        <line key={`spandrel-${i}`} x1={buildingLeft + 2} y1={y + 3} x2={buildingRight - 2} y2={y + 3} strokeWidth="0.15" opacity="0.15" />
      ))}

      {/* ============================================= */}
      {/* GRID AXIS LABELS (bottom)                     */}
      {/* ============================================= */}
      {Array.from({ length: 9 }, (_, i) => {
        const cx = buildingLeft + 15 + i * ((buildingWidth - 30) / 8)
        return (
          <g key={`axis-${i}`}>
            <line x1={cx} y1={groundLevel + 60} x2={cx} y2={groundLevel + 68} strokeWidth="0.3" opacity="0.4" />
            <circle cx={cx} cy={groundLevel + 95} r="7" strokeWidth="0.5" fill="none" opacity="0.5" />
            <text x={cx} y={groundLevel + 98} textAnchor="middle" fontSize="7" fontFamily="monospace" fill="currentColor" stroke="none" opacity="0.5">
              {String.fromCharCode(65 + i)}
            </text>
          </g>
        )
      })}

      {/* ============================================= */}
      {/* NORTH ARROW                                   */}
      {/* ============================================= */}
      <g transform="translate(720, 60)">
        <circle cx={0} cy={0} r="12" strokeWidth="0.5" fill="none" />
        <polygon points="0,-10 -3,2 0,-1 3,2" fill="currentColor" stroke="none" />
        <line x1={0} y1={-1} x2={0} y2={10} strokeWidth="0.5" />
        <text x={0} y={-15} textAnchor="middle" fontSize="7" fontFamily="monospace" fill="currentColor" stroke="none" fontWeight="bold">
          N
        </text>
      </g>

      {/* ============================================= */}
      {/* SCALE BAR                                     */}
      {/* ============================================= */}
      <g transform={`translate(60, ${groundLevel + 95})`}>
        <line x1={0} y1={0} x2={100} y2={0} strokeWidth="0.5" />
        <line x1={0} y1={-3} x2={0} y2={3} strokeWidth="0.5" />
        <line x1={50} y1={-3} x2={50} y2={3} strokeWidth="0.5" />
        <line x1={100} y1={-3} x2={100} y2={3} strokeWidth="0.5" />
        {/* Alternating filled blocks */}
        <rect x={0} y={-2} width={25} height="4" strokeWidth="0.3" fill="currentColor" />
        <rect x={25} y={-2} width={25} height="4" strokeWidth="0.3" fill="none" />
        <rect x={50} y={-2} width={25} height="4" strokeWidth="0.3" fill="currentColor" />
        <rect x={75} y={-2} width={25} height="4" strokeWidth="0.3" fill="none" />
        <text x={0} y={12} textAnchor="middle" fontSize="5" fontFamily="monospace" fill="currentColor" stroke="none">0</text>
        <text x={50} y={12} textAnchor="middle" fontSize="5" fontFamily="monospace" fill="currentColor" stroke="none">12.5m</text>
        <text x={100} y={12} textAnchor="middle" fontSize="5" fontFamily="monospace" fill="currentColor" stroke="none">25m</text>
      </g>

      {/* ============================================= */}
      {/* ELEVATION LEVEL MARKS (left side)             */}
      {/* ============================================= */}
      {[
        { y: groundLevel, label: "± 0.00" },
        { y: groundLevel - 10 * floorHeight, label: "+ 30.00" },
        { y: groundLevel - 20 * floorHeight, label: "+ 60.00" },
        { y: roofLevel - 14, label: "+ 66.50" },
      ].map((mark, i) => (
        <g key={`elev-${i}`}>
          <line x1={buildingLeft - 65} y1={mark.y} x2={buildingLeft - 45} y2={mark.y} strokeWidth="0.4" />
          <polygon
            points={`${buildingLeft - 55},${mark.y - 4} ${buildingLeft - 51},${mark.y} ${buildingLeft - 55},${mark.y + 4} ${buildingLeft - 59},${mark.y}`}
            fill="none"
            strokeWidth="0.4"
          />
          <text x={buildingLeft - 55} y={mark.y - 7} textAnchor="middle" fontSize="5" fontFamily="monospace" fill="currentColor" stroke="none">
            {mark.label}
          </text>
        </g>
      ))}

      {/* ============================================= */}
      {/* ADDITIONAL WINDOW REFLECTIONS (scattered)      */}
      {/* ============================================= */}
      {[3, 7, 12, 16, 19].map((floor) => {
        const y = groundLevel - floor * floorHeight
        return (
          <g key={`refl-extra-${floor}`} opacity="0.08">
            {/* Large diagonal reflection across 2 window bays */}
            <line
              x1={buildingLeft + 50}
              y1={y + floorHeight - 6}
              x2={buildingLeft + 120}
              y2={y + 6}
              strokeWidth="0.5"
            />
            <line
              x1={buildingLeft + 55}
              y1={y + floorHeight - 6}
              x2={buildingLeft + 125}
              y2={y + 6}
              strokeWidth="0.3"
            />
          </g>
        )
      })}

      {/* ============================================= */}
      {/* BUILDING NAME ON FACADE (subtle)              */}
      {/* ============================================= */}
      <text
        x={(buildingLeft + buildingRight) / 2}
        y={groundLevel - floorHeight * 2 - 15}
        textAnchor="middle"
        fontSize="5"
        fontFamily="monospace"
        fill="currentColor"
        stroke="none"
        opacity="0.35"
        letterSpacing="4"
      >
        LE DOMAINE
      </text>

      {/* ============================================= */}
      {/* PERSPECTIVE SHADOW (ground)                   */}
      {/* ============================================= */}
      <polygon
        points={`${buildingRight},${groundLevel} ${buildingRight + 80},${groundLevel} ${buildingRight + 80},${groundLevel + 2} ${buildingRight},${groundLevel + 2}`}
        fill="currentColor"
        stroke="none"
        opacity="0.06"
      />
      <polygon
        points={`${buildingRight},${groundLevel} ${buildingRight + 80},${groundLevel + 2} ${buildingRight + 60},${groundLevel + 15} ${buildingRight},${groundLevel + 15}`}
        fill="currentColor"
        stroke="none"
        opacity="0.04"
      />

      {/* ============================================= */}
      {/* ADDITIONAL FINE DETAILS                       */}
      {/* ============================================= */}

      {/* Downpipe / rainwater pipe on left */}
      <line x1={buildingLeft + 5} y1={roofLevel + 3} x2={buildingLeft + 5} y2={groundLevel - 2} strokeWidth="0.3" opacity="0.25" />
      <line x1={buildingLeft + 6} y1={roofLevel + 3} x2={buildingLeft + 6} y2={groundLevel - 2} strokeWidth="0.15" opacity="0.15" />

      {/* Downpipe / rainwater pipe on right */}
      <line x1={buildingRight - 5} y1={roofLevel + 3} x2={buildingRight - 5} y2={groundLevel - 2} strokeWidth="0.3" opacity="0.25" />
      <line x1={buildingRight - 6} y1={roofLevel + 3} x2={buildingRight - 6} y2={groundLevel - 2} strokeWidth="0.15" opacity="0.15" />

      {/* Window sill lines (every other floor for detail) */}
      {floorSlabs.slice(3, -2).filter((_, i) => i % 3 === 0).map((y, i) => (
        <line key={`sill-${i}`} x1={buildingLeft + 15} y1={y - 4} x2={buildingRight - 15} y2={y - 4} strokeWidth="0.12" opacity="0.12" />
      ))}

      {/* AC unit indicators on some balconies */}
      {[4, 8, 12, 16].map((floor) => {
        const y = groundLevel - floor * floorHeight
        const isLeft = Math.floor(floor / 2) % 2 === 0
        const bx = isLeft ? buildingLeft - balconyDepth + 2 : buildingRight + 2
        return (
          <rect key={`ac-${floor}`} x={bx} y={y - 8} width="8" height="6" strokeWidth="0.3" opacity="0.3" fill="none" />
        )
      })}

      {/* Fire escape ladder indication */}
      <g opacity="0.15">
        <line x1={buildingRight - 15} y1={roofLevel + 3} x2={buildingRight - 15} y2={groundLevel - floorHeight * 2} strokeWidth="0.3" strokeDasharray="1,3" />
        <line x1={buildingRight - 20} y1={roofLevel + 3} x2={buildingRight - 20} y2={groundLevel - floorHeight * 2} strokeWidth="0.3" strokeDasharray="1,3" />
        {Array.from({ length: 20 }, (_, i) => {
          const ry = roofLevel + 5 + i * ((groundLevel - floorHeight * 2 - roofLevel - 5) / 20)
          return <line key={`ladder-${i}`} x1={buildingRight - 20} y1={ry} x2={buildingRight - 15} y2={ry} strokeWidth="0.2" />
        })}
      </g>

      {/* ============================================= */}
      {/* COMPASS CROSS-HAIR AT BUILDING CENTER         */}
      {/* ============================================= */}
      <g opacity="0.08">
        <line x1={(buildingLeft + buildingRight) / 2} y1={roofLevel - 5} x2={(buildingLeft + buildingRight) / 2} y2={groundLevel + 5} strokeWidth="0.3" strokeDasharray="8,4" />
        <line x1={buildingLeft - 5} y1={(groundLevel + roofLevel) / 2} x2={buildingRight + 5} y2={(groundLevel + roofLevel) / 2} strokeWidth="0.3" strokeDasharray="8,4" />
      </g>

      {/* ============================================= */}
      {/* DETAIL CALLOUT BUBBLES                        */}
      {/* ============================================= */}
      {/* Detail 1: Typical balcony */}
      <g>
        <circle cx={buildingLeft - 55} cy={groundLevel - 8 * floorHeight} r="6" strokeWidth="0.5" fill="none" opacity="0.5" />
        <text x={buildingLeft - 55} y={groundLevel - 8 * floorHeight + 2} textAnchor="middle" fontSize="5" fontFamily="monospace" fill="currentColor" stroke="none" opacity="0.5">
          D1
        </text>
        <line x1={buildingLeft - 49} y1={groundLevel - 8 * floorHeight} x2={buildingLeft - 18} y2={groundLevel - 8 * floorHeight} strokeWidth="0.3" opacity="0.3" strokeDasharray="2,1" />
      </g>

      {/* Detail 2: Canopy */}
      <g>
        <circle cx={buildingRight + 50} cy={groundLevel - 2 * floorHeight - 5} r="6" strokeWidth="0.5" fill="none" opacity="0.5" />
        <text x={buildingRight + 50} y={groundLevel - 2 * floorHeight - 3} textAnchor="middle" fontSize="5" fontFamily="monospace" fill="currentColor" stroke="none" opacity="0.5">
          D2
        </text>
        <line x1={buildingRight + 44} y1={groundLevel - 2 * floorHeight - 5} x2={buildingRight - 55} y2={groundLevel - 2 * floorHeight - 5} strokeWidth="0.3" opacity="0.3" strokeDasharray="2,1" />
      </g>

      {/* Detail 3: Rooftop mech */}
      <g>
        <circle cx={450} cy={roofLevel - 70} r="6" strokeWidth="0.5" fill="none" opacity="0.5" />
        <text x={450} y={roofLevel - 68} textAnchor="middle" fontSize="5" fontFamily="monospace" fill="currentColor" stroke="none" opacity="0.5">
          D3
        </text>
        <line x1={444} y1={roofLevel - 68} x2={410} y2={roofLevel - 55} strokeWidth="0.3" opacity="0.3" strokeDasharray="2,1" />
      </g>

      {/* ============================================= */}
      {/* MATERIAL ANNOTATIONS                          */}
      {/* ============================================= */}
      {/* Glass curtain wall note */}
      <g opacity="0.45">
        <line x1={buildingRight + 30} y1={groundLevel - 14 * floorHeight} x2={buildingRight - 30} y2={groundLevel - 14 * floorHeight + 10} strokeWidth="0.3" />
        <text x={buildingRight + 32} y={groundLevel - 14 * floorHeight - 3} fontSize="4.5" fontFamily="monospace" fill="currentColor" stroke="none">
          MUR-RIDEAU VITRÉ
        </text>
        <text x={buildingRight + 32} y={groundLevel - 14 * floorHeight + 4} fontSize="4" fontFamily="monospace" fill="currentColor" stroke="none" opacity="0.7">
          DOUBLE VITRAGE LOW-E
        </text>
      </g>

      {/* Concrete note */}
      <g opacity="0.45">
        <line x1={buildingLeft - 40} y1={groundLevel - 4 * floorHeight} x2={buildingLeft + 30} y2={groundLevel - 4 * floorHeight + 5} strokeWidth="0.3" />
        <text x={buildingLeft - 80} y={groundLevel - 4 * floorHeight - 3} fontSize="4.5" fontFamily="monospace" fill="currentColor" stroke="none">
          BÉTON APPARENT
        </text>
        <text x={buildingLeft - 80} y={groundLevel - 4 * floorHeight + 4} fontSize="4" fontFamily="monospace" fill="currentColor" stroke="none" opacity="0.7">
          CLASSE C30/37
        </text>
      </g>

      {/* ============================================= */}
      {/* SUBTLE CROSS-HATCH ON EXPOSED CONCRETE AREAS  */}
      {/* ============================================= */}
      {/* Left edge concrete band */}
      <rect x={buildingLeft} y={roofLevel} width={12} height={groundLevel - roofLevel} strokeWidth="0" fill="url(#crosshatch)" opacity="0.5" />
      {/* Right edge concrete band */}
      <rect x={buildingRight - 12} y={roofLevel} width={12} height={groundLevel - roofLevel} strokeWidth="0" fill="url(#crosshatch)" opacity="0.5" />

      {/* Ground floor concrete podium hatching */}
      <rect x={buildingLeft} y={groundLevel - floorHeight} width={buildingWidth} height={floorHeight} strokeWidth="0" fill="url(#crosshatch)" opacity="0.3" />

      {/* ============================================= */}
      {/* EXTRA FINE MULLION DETAILS ON SELECT FLOORS   */}
      {/* ============================================= */}
      {[5, 10, 15].map((floor) => {
        const y = groundLevel - floor * floorHeight
        return (
          <g key={`detail-mullion-${floor}`} opacity="0.2">
            {Array.from({ length: 16 }, (_, i) => {
              const mx = buildingLeft + 15 + i * ((buildingWidth - 30) / 16)
              return <line key={`fm-${floor}-${i}`} x1={mx} y1={y + 5} x2={mx} y2={y + floorHeight - 3} strokeWidth="0.15" />
            })}
          </g>
        )
      })}

      {/* ============================================= */}
      {/* PEDESTRIAN FIGURES (scale reference)           */}
      {/* ============================================= */}
      {/* Person 1 */}
      <g opacity="0.35" transform={`translate(340, ${groundLevel - 2})`}>
        <circle cx={0} cy={-14} r="2" strokeWidth="0.4" fill="none" />
        <line x1={0} y1={-12} x2={0} y2={-4} strokeWidth="0.4" />
        <line x1={-3} y1={-9} x2={3} y2={-9} strokeWidth="0.4" />
        <line x1={0} y1={-4} x2={-2} y2={0} strokeWidth="0.4" />
        <line x1={0} y1={-4} x2={2} y2={0} strokeWidth="0.4" />
      </g>
      {/* Person 2 */}
      <g opacity="0.3" transform={`translate(365, ${groundLevel - 2})`}>
        <circle cx={0} cy={-13} r="1.8" strokeWidth="0.35" fill="none" />
        <line x1={0} y1={-11} x2={0} y2={-4} strokeWidth="0.35" />
        <line x1={-2.5} y1={-8} x2={2.5} y2={-8} strokeWidth="0.35" />
        <line x1={0} y1={-4} x2={-2} y2={0} strokeWidth="0.35" />
        <line x1={0} y1={-4} x2={2} y2={0} strokeWidth="0.35" />
      </g>

      {/* ============================================= */}
      {/* CAR ON STREET                                 */}
      {/* ============================================= */}
      <g opacity="0.2" transform={`translate(500, ${groundLevel + 25})`}>
        <rect x={0} y={0} width={30} height={10} rx="2" strokeWidth="0.4" fill="none" />
        <line x1={5} y1={0} x2={8} y2={-5} strokeWidth="0.3" />
        <line x1={8} y1={-5} x2={22} y2={-5} strokeWidth="0.3" />
        <line x1={22} y1={-5} x2={25} y2={0} strokeWidth="0.3" />
        <circle cx={7} cy={10} r="3" strokeWidth="0.3" fill="none" />
        <circle cx={23} cy={10} r="3" strokeWidth="0.3" fill="none" />
      </g>
    </svg>
  )
}
