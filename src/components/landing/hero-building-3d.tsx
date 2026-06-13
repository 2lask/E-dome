"use client";

/* ───────────────────────────────────────────────────────────────
   Hero3DBuilding : maquette 3D isométrique d'un immeuble suisse.
   Au montage, les étages se dessinent en wireframe doré (édit du
   matériau). Au scroll, le matériau passe progressivement à un
   glassmorphism plein (MeshTransmissionMaterial via Drei).

   - Géométrie : ~5K triangles (BoxGeometry instancées par étage)
   - Caméra : perspective, orbit doux autoRotate
   - Postprocessing : Bloom léger desktop uniquement
   - Reduced motion : pas d'autoRotate, pas de pulse
   ─────────────────────────────────────────────────────────────── */

import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Environment,
  ContactShadows,
  PerspectiveCamera,
  Edges,
  Stars,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

type Floor = {
  y: number;
  width: number;
  depth: number;
  height: number;
};

const FLOORS: Floor[] = [
  { y: 0.0, width: 3.4, depth: 2.6, height: 0.55 }, // socle
  { y: 0.62, width: 3.15, depth: 2.4, height: 0.72 },
  { y: 1.45, width: 2.95, depth: 2.25, height: 0.72 },
  { y: 2.28, width: 2.75, depth: 2.1, height: 0.72 },
  { y: 3.11, width: 2.55, depth: 1.95, height: 0.65 }, // étage supérieur
];

const ROOF_HEIGHT = 0.75;
const WINDOW_ROWS = 3; // par étage standard

function BuildingFloor({
  floor,
  index,
  reveal,
  matProgress,
}: {
  floor: Floor;
  index: number;
  reveal: number; // 0..1 par étage (cascade build-up)
  matProgress: number; // 0 wireframe / 1 solide glass
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesOpacity = useMemo(() => Math.min(1, reveal * 1.4), [reveal]);

  // y final + appearance scale
  const scaleY = THREE.MathUtils.clamp(reveal, 0.001, 1);
  const yOffset = floor.y + (1 - scaleY) * 0.4;

  return (
    <group ref={groupRef} position={[0, yOffset, 0]} scale={[1, scaleY, 1]}>
      {/* Volume principal : glass material qui apparaît à matProgress */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[floor.width, floor.height, floor.depth]} />
        <meshPhysicalMaterial
          transmission={0.85 * matProgress}
          thickness={0.5}
          roughness={0.15}
          ior={1.35}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
          color="#1a1a17"
          emissive="#e9c665"
          emissiveIntensity={0.04 * matProgress}
          transparent
          opacity={0.05 + matProgress * 0.55}
          envMapIntensity={1.2 * matProgress}
        />
        {/* Edges wireframe doré, toujours visible mais fade à matProgress=1 */}
        <Edges
          color="#e9c665"
          threshold={20}
          scale={1.0}
        >
          <meshBasicMaterial
            color="#e9c665"
            transparent
            opacity={edgesOpacity * (1 - matProgress * 0.55)}
            depthWrite={false}
          />
        </Edges>
      </mesh>

      {/* Fenêtres lumineuses émissives : visible à partir de matProgress > 0.4 */}
      <Windows
        floor={floor}
        intensity={Math.max(0, (matProgress - 0.35) * 1.6)}
        seed={index}
      />
    </group>
  );
}

function Windows({
  floor,
  intensity,
  seed,
}: {
  floor: Floor;
  intensity: number;
  seed: number;
}) {
  // 2 façades visibles (front + side), chacune 4 colonnes x WINDOW_ROWS
  const cols = 4;
  const winW = 0.32;
  const winH = 0.32;
  const facadeY = -floor.height / 2 + winH / 2 + 0.08;
  const winSlots = useMemo(() => {
    const arr: { lit: boolean; pos: [number, number, number] }[] = [];
    // Front face (z = +depth/2)
    for (let r = 0; r < WINDOW_ROWS; r++) {
      for (let c = 0; c < cols; c++) {
        const x = ((c + 0.5) / cols - 0.5) * (floor.width - 0.2);
        const y = facadeY + r * 0.18;
        // Seeded pseudo-rand pour lit/dark
        const lit = ((seed * 17 + r * 5 + c) % 7) < 4;
        arr.push({ lit, pos: [x, y, floor.depth / 2 + 0.005] });
      }
    }
    // Right face (x = +width/2)
    for (let r = 0; r < WINDOW_ROWS; r++) {
      for (let c = 0; c < 3; c++) {
        const z = ((c + 0.5) / 3 - 0.5) * (floor.depth - 0.2);
        const y = facadeY + r * 0.18;
        const lit = ((seed * 23 + r * 7 + c * 3) % 8) < 5;
        arr.push({ lit, pos: [floor.width / 2 + 0.005, y, z] });
      }
    }
    return arr;
  }, [floor.width, floor.depth, floor.height, seed, facadeY]);

  return (
    <group>
      {winSlots.map((w, i) => (
        <mesh key={i} position={w.pos}>
          <planeGeometry args={[winW * 0.9, winH * 0.7]} />
          <meshBasicMaterial
            color={w.lit ? "#fde8a1" : "#202020"}
            transparent
            opacity={intensity * (w.lit ? 0.9 : 0.4)}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function Roof({
  reveal,
  matProgress,
}: {
  reveal: number;
  matProgress: number;
}) {
  const baseFloor = FLOORS[FLOORS.length - 1];
  const yPos = baseFloor.y + baseFloor.height / 2 + ROOF_HEIGHT / 2;
  const scaleY = THREE.MathUtils.clamp(reveal, 0.001, 1);
  return (
    <group position={[0, yPos + (1 - scaleY) * 0.3, 0]} scale={[1, scaleY, 1]}>
      <mesh>
        <coneGeometry args={[Math.max(baseFloor.width, baseFloor.depth) / 1.7, ROOF_HEIGHT, 4, 1]} />
        <meshPhysicalMaterial
          color="#1a1a17"
          roughness={0.4}
          metalness={0.2}
          transmission={0.4 * matProgress}
          opacity={0.15 + matProgress * 0.6}
          transparent
          emissive="#e9c665"
          emissiveIntensity={0.05 * matProgress}
        />
        <Edges color="#e9c665" threshold={15}>
          <meshBasicMaterial
            color="#e9c665"
            transparent
            opacity={reveal * (1 - matProgress * 0.55)}
            depthWrite={false}
          />
        </Edges>
      </mesh>
    </group>
  );
}

function Ground() {
  return (
    <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <ringGeometry args={[2.4, 5.2, 64]} />
      <meshBasicMaterial color="#0a0a0a" transparent opacity={0.0} />
    </mesh>
  );
}

function GoldRing({ y, radius, opacity }: { y: number; radius: number; opacity: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.15;
  });
  return (
    <mesh ref={ref} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius, radius + 0.018, 96]} />
      <meshBasicMaterial color="#e9c665" transparent opacity={opacity} toneMapped={false} />
    </mesh>
  );
}

function Scene({
  scrollProgress,
  buildProgress,
  isReducedMotion,
}: {
  scrollProgress: number;
  buildProgress: number;
  isReducedMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Mat progress : 0 wireframe au mount → 1 solide au scroll
  // Combine cascade + scroll
  const matProgress = THREE.MathUtils.clamp(
    buildProgress * 0.4 + scrollProgress * 0.85,
    0,
    1
  );

  useFrame((state, delta) => {
    if (!groupRef.current || isReducedMotion) return;
    // Rotation lente autour Y
    groupRef.current.rotation.y += delta * 0.12;
    // Léger bob
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = -1.6 + Math.sin(t * 0.5) * 0.05;
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow color="#fff5d8" />
      <pointLight position={[-4, 4, -3]} intensity={0.6} color="#e9c665" distance={12} />
      <pointLight position={[3, 2, 4]} intensity={0.35} color="#9089fc" distance={8} />

      <group ref={groupRef} position={[0, -1.6, 0]}>
        {FLOORS.map((floor, i) => {
          // Cascade reveal : étage i révélé à buildProgress > i/5
          const localReveal = THREE.MathUtils.clamp(
            (buildProgress - i / (FLOORS.length + 1.5)) * 3,
            0,
            1
          );
          return (
            <BuildingFloor
              key={i}
              floor={floor}
              index={i}
              reveal={localReveal}
              matProgress={matProgress}
            />
          );
        })}
        <Roof
          reveal={THREE.MathUtils.clamp((buildProgress - 0.8) * 5, 0, 1)}
          matProgress={matProgress}
        />

        {/* Anneaux dorés rotatifs au sol — accentue le côté holographique */}
        <GoldRing y={-0.02} radius={2.4} opacity={0.35 * (1 - matProgress * 0.3)} />
        <GoldRing y={-0.04} radius={3.2} opacity={0.2 * (1 - matProgress * 0.3)} />

        <Ground />
      </group>

      <Stars
        radius={50}
        depth={30}
        count={1500}
        factor={2}
        saturation={0.4}
        fade
        speed={isReducedMotion ? 0 : 0.4}
      />
    </>
  );
}

export interface Hero3DBuildingProps {
  /** 0 → 1 : progression du scroll dans la page (provoque la matérialisation). */
  scrollProgress?: number;
}

/* SVG fallback isométrique d'un immeuble en wireframe doré.
   Affiche sur mobile/reduced-motion où WebGL est coupé. */
function StaticBuildingSvg() {
  return (
    <svg
      viewBox="0 0 360 360"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{
        position: "absolute",
        inset: 0,
        filter: "drop-shadow(0 0 30px rgba(233,198,101,0.25))",
      }}
      aria-hidden
    >
      <defs>
        <linearGradient id="bld-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdf4d8" />
          <stop offset="50%" stopColor="#e9c665" />
          <stop offset="100%" stopColor="#b58721" />
        </linearGradient>
      </defs>
      {/* Anneau lumineux base */}
      <ellipse cx="180" cy="300" rx="130" ry="22" fill="none" stroke="url(#bld-grad)" strokeWidth="1" opacity="0.4" />
      <ellipse cx="180" cy="300" rx="160" ry="28" fill="none" stroke="url(#bld-grad)" strokeWidth="0.6" opacity="0.25" />

      {/* Étages isométriques (4 étages + toit). Polygones simples */}
      {[
        { y: 248, w: 130, h: 32 },
        { y: 200, w: 122, h: 32 },
        { y: 152, w: 114, h: 32 },
        { y: 104, w: 106, h: 32 },
      ].map((f, i) => (
        <g key={i} fill="none" stroke="url(#bld-grad)" strokeWidth="1.1">
          {/* face avant */}
          <polygon points={`${180 - f.w / 2},${f.y} ${180 + f.w / 2},${f.y} ${180 + f.w / 2},${f.y + f.h} ${180 - f.w / 2},${f.y + f.h}`} />
          {/* face droite */}
          <polygon points={`${180 + f.w / 2},${f.y} ${180 + f.w / 2 + 32},${f.y - 16} ${180 + f.w / 2 + 32},${f.y - 16 + f.h} ${180 + f.w / 2},${f.y + f.h}`} />
          {/* dessus */}
          <polygon points={`${180 - f.w / 2},${f.y} ${180 + f.w / 2},${f.y} ${180 + f.w / 2 + 32},${f.y - 16} ${180 - f.w / 2 + 32},${f.y - 16}`} />
          {/* fenêtres */}
          {[0, 1, 2, 3].map((c) => (
            <rect
              key={c}
              x={180 - f.w / 2 + 12 + c * (f.w / 4)}
              y={f.y + 8}
              width={f.w / 4 - 16}
              height={f.h - 16}
              fill={(i + c) % 2 === 0 ? "url(#bld-grad)" : "none"}
              fillOpacity={0.55}
              stroke="url(#bld-grad)"
              strokeWidth="0.5"
            />
          ))}
        </g>
      ))}
      {/* Toit pyramidal */}
      <g fill="none" stroke="url(#bld-grad)" strokeWidth="1.2">
        <polygon points="127,104 180,72 233,104 233,104 180,72 265,88" />
        <line x1="127" y1="104" x2="180" y2="72" />
        <line x1="180" y1="72" x2="233" y2="104" />
        <line x1="233" y1="104" x2="265" y2="88" />
        <line x1="180" y1="72" x2="212" y2="56" />
        <line x1="265" y1="88" x2="212" y2="56" />
      </g>
    </svg>
  );
}

export function Hero3DBuilding({ scrollProgress = 0 }: Hero3DBuildingProps) {
  const [mounted, setMounted] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [enableBloom, setEnableBloom] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Animation de build au mount : 0 → 1 en 2.2s
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const m = window.matchMedia("(prefers-reduced-motion: reduce)");
      setIsReducedMotion(m.matches);
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Bloom uniquement sur desktop avec WebGL2 + non-reduced
      setEnableBloom(window.innerWidth >= 1024 && !m.matches);
    }
    const start = performance.now();
    const dur = 2200;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setBuildProgress(eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Viewport culling : pause useFrame quand hors viewport
  useEffect(() => {
    const node = wrapRef.current;
    if (!node || typeof window === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // Mobile ou reduced-motion : on rend le SVG isométrique au lieu du Canvas
  if (mounted && (isMobile || isReducedMotion)) {
    return (
      <div
        ref={wrapRef}
        style={{ position: "absolute", inset: 0 }}
        aria-hidden
      >
        <StaticBuildingSvg />
      </div>
    );
  }

  if (!mounted) {
    return (
      <div
        ref={wrapRef}
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 60% 50%, rgba(233,198,101,0.08) 0%, transparent 60%)",
        }}
      />
    );
  }

  return (
    <div ref={wrapRef} style={{ position: "absolute", inset: 0 }}>
      <Canvas
        dpr={isMobile ? [1, 1.2] : [1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [4.5, 2.8, 5.5], fov: 35 }}
        frameloop={isVisible ? "always" : "demand"}
        style={{ width: "100%", height: "100%" }}
      >
        <PerspectiveCamera makeDefault position={[4.5, 2.4, 5.8]} fov={36} />
        <Suspense fallback={null}>
          <Scene
            scrollProgress={scrollProgress}
            buildProgress={buildProgress}
            isReducedMotion={isReducedMotion}
          />
          {enableBloom && (
            <EffectComposer>
              <Bloom
                intensity={0.55}
                luminanceThreshold={0.72}
                luminanceSmoothing={0.4}
                mipmapBlur
              />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Hero3DBuilding;
