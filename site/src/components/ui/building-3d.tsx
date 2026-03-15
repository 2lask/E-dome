"use client"

import { useRef, Suspense, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

const CREAM = "#ffe0c2"
const GOLD = "#ffdfb5"

/* --------------------------------------------------------------------------
 * LineSegment — renders a Three.js Line via <primitive> to avoid the SVG
 * <line> conflict in React/JSX.
 * ------------------------------------------------------------------------*/
function LineSegment({
  points,
  color = CREAM,
  opacity = 0.25,
}: {
  points: [number, number, number][]
  color?: string
  opacity?: number
}) {
  const lineObj = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(
      points.map((p) => new THREE.Vector3(...p))
    )
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity,
    })
    return new THREE.Line(geometry, material)
  }, [points, color, opacity])

  return <primitive object={lineObj} />
}

/* --------------------------------------------------------------------------
 * FloorLines
 * ------------------------------------------------------------------------*/
function FloorLines({
  floors,
  width,
  depth,
  baseY,
  height,
}: {
  floors: number
  width: number
  depth: number
  baseY: number
  height: number
}) {
  const lines = useMemo(() => {
    const result: [number, number, number][][] = []
    for (let i = 0; i <= floors; i++) {
      const y = baseY + (i / floors) * height
      result.push([
        [-width / 2, y, -depth / 2],
        [width / 2, y, -depth / 2],
        [width / 2, y, depth / 2],
        [-width / 2, y, depth / 2],
        [-width / 2, y, -depth / 2],
      ])
    }
    return result
  }, [floors, width, depth, baseY, height])

  return (
    <>
      {lines.map((pts, i) => (
        <LineSegment key={`floor-${i}`} points={pts} color={CREAM} opacity={0.25} />
      ))}
    </>
  )
}

/* --------------------------------------------------------------------------
 * WindowGrid
 * ------------------------------------------------------------------------*/
function WindowGrid({
  width,
  depth,
  height,
  baseY,
  cols,
}: {
  width: number
  depth: number
  height: number
  baseY: number
  cols: number
  rows?: number
}) {
  const lines = useMemo(() => {
    const result: [number, number, number][][] = []
    const depthCols = Math.max(1, Math.floor(cols * (depth / width)))

    // front face
    for (let c = 0; c <= cols; c++) {
      const x = -width / 2 + (c / cols) * width
      result.push([
        [x, baseY, -depth / 2],
        [x, baseY + height, -depth / 2],
      ])
    }
    // back face
    for (let c = 0; c <= cols; c++) {
      const x = -width / 2 + (c / cols) * width
      result.push([
        [x, baseY, depth / 2],
        [x, baseY + height, depth / 2],
      ])
    }
    // left face
    for (let c = 0; c <= depthCols; c++) {
      const z = -depth / 2 + (c / depthCols) * depth
      result.push([
        [-width / 2, baseY, z],
        [-width / 2, baseY + height, z],
      ])
    }
    // right face
    for (let c = 0; c <= depthCols; c++) {
      const z = -depth / 2 + (c / depthCols) * depth
      result.push([
        [width / 2, baseY, z],
        [width / 2, baseY + height, z],
      ])
    }

    return result
  }, [width, depth, height, baseY, cols])

  return (
    <>
      {lines.map((pts, i) => (
        <LineSegment key={`win-${i}`} points={pts} color={CREAM} opacity={0.12} />
      ))}
    </>
  )
}

/* --------------------------------------------------------------------------
 * Building — the main 3D scene content
 * ------------------------------------------------------------------------*/
function Building() {
  const groupRef = useRef<THREE.Group>(null!)
  const floatRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = t * 0.15
    floatRef.current.position.y = Math.sin(t * 0.6) * 0.08
  })

  const towerW = 1.2
  const towerD = 0.9
  const towerH = 3.2
  const towerBase = -1.2

  const baseW = 1.8
  const baseD = 1.4
  const baseH = 0.4

  const pentW = 0.6
  const pentD = 0.5
  const pentH = 0.5

  const spirePoints: [number, number, number][] = [
    [0, towerBase + baseH + towerH + pentH, 0],
    [0, towerBase + baseH + towerH + pentH + 0.4, 0],
  ]

  const basePlatformPoints: [number, number, number][] = (() => {
    const y = towerBase
    const hw = baseW / 2 + 0.15
    const hd = baseD / 2 + 0.15
    return [
      [-hw, y, -hd],
      [hw, y, -hd],
      [hw, y, hd],
      [-hw, y, hd],
      [-hw, y, -hd],
    ]
  })()

  return (
    <group ref={floatRef}>
      <group ref={groupRef}>
        {/* Foundation / Base */}
        <mesh position={[0, towerBase + baseH / 2, 0]}>
          <boxGeometry args={[baseW, baseH, baseD]} />
          <meshBasicMaterial color={CREAM} wireframe transparent opacity={0.3} />
        </mesh>

        {/* Main Tower Body */}
        <mesh position={[0, towerBase + baseH + towerH / 2, 0]}>
          <boxGeometry args={[towerW, towerH, towerD]} />
          <meshBasicMaterial color={CREAM} wireframe transparent opacity={0.35} />
        </mesh>

        {/* Floor Lines */}
        <FloorLines
          floors={16}
          width={towerW}
          depth={towerD}
          baseY={towerBase + baseH}
          height={towerH}
        />

        {/* Window Grid */}
        <WindowGrid
          width={towerW}
          depth={towerD}
          height={towerH}
          baseY={towerBase + baseH}
          cols={6}
          rows={16}
        />

        {/* Penthouse */}
        <mesh position={[0, towerBase + baseH + towerH + pentH / 2, 0]}>
          <boxGeometry args={[pentW, pentH, pentD]} />
          <meshBasicMaterial color={GOLD} wireframe transparent opacity={0.35} />
        </mesh>

        {/* Antenna / spire */}
        <LineSegment points={spirePoints} color={GOLD} opacity={0.5} />

        {/* Base platform edge */}
        <LineSegment points={basePlatformPoints} color={CREAM} opacity={0.18} />
      </group>
    </group>
  )
}

/* --------------------------------------------------------------------------
 * Exported component
 * ------------------------------------------------------------------------*/
interface Building3DSceneProps {
  className?: string
}

export function Building3DScene({ className }: Building3DSceneProps) {
  return (
    <div className={className} style={{ width: "100%", height: 400 }}>
      <Suspense
        fallback={
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: CREAM,
              opacity: 0.5,
              fontFamily: "sans-serif",
              fontSize: 14,
            }}
          >
            Loading 3D...
          </div>
        }
      >
        <Canvas
          camera={{ position: [3, 2, 5], fov: 45 }}
          style={{ background: "transparent" }}
          gl={{ alpha: true }}
        >
          <ambientLight intensity={0.4} color="#ffe0c2" />
          <pointLight position={[5, 5, 5]} intensity={0.6} color="#ffdfb5" />
          <Building />
        </Canvas>
      </Suspense>
    </div>
  )
}

export default Building3DScene
