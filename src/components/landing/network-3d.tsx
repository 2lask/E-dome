"use client";

/* Network 3D : graphe d'apporteurs ↔ investisseurs ↔ promoteurs.
   Sphères dorées/roses/violettes reliées par lignes lumineuses
   pulsantes. Représente le réseau métier d'E-Dome.
   InstancedMesh pour les sphères, LineSegments pour les arcs. */

import { useRef, useMemo, useEffect, useState, Suspense, type ComponentType } from "react";
import dynamic from "next/dynamic";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera } from "@react-three/drei";
import { motion } from "framer-motion";
import { Handshake, Users, Building2 } from "lucide-react";
import * as THREE from "three";
import { SectionHeading } from "./personas";

type NodeKind = "apporteur" | "investisseur" | "promoteur";

interface NetNode {
  pos: THREE.Vector3;
  kind: NodeKind;
  pulsePhase: number;
}

const COLORS: Record<NodeKind, string> = {
  apporteur: "#e9c665",
  investisseur: "#f43f5e",
  promoteur: "#9089fc",
};

function generateNodes(seed: number, count: number): NetNode[] {
  let h = (seed * 2654435761) >>> 0;
  const rand = () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
  const nodes: NetNode[] = [];
  for (let i = 0; i < count; i++) {
    // Distribution sphérique
    const phi = Math.acos(2 * rand() - 1);
    const theta = 2 * Math.PI * rand();
    const r = 2.6 + rand() * 1.4;
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = (rand() - 0.5) * 2.2;
    const z = r * Math.sin(phi) * Math.sin(theta);
    const kind: NodeKind =
      i % 5 === 0 ? "promoteur" : i % 2 === 0 ? "investisseur" : "apporteur";
    nodes.push({
      pos: new THREE.Vector3(x, y, z),
      kind,
      pulsePhase: rand() * Math.PI * 2,
    });
  }
  return nodes;
}

function buildEdges(nodes: NetNode[]): Array<[number, number]> {
  const edges: Array<[number, number]> = [];
  // Chaque node connecté à 2-3 voisins les plus proches
  for (let i = 0; i < nodes.length; i++) {
    const dists = nodes
      .map((n, j) => ({ j, d: i === j ? Infinity : nodes[i].pos.distanceTo(n.pos) }))
      .sort((a, b) => a.d - b.d);
    const k = 2 + (i % 2);
    for (let m = 0; m < k; m++) {
      const j = dists[m].j;
      if (j > i) edges.push([i, j]);
    }
  }
  return edges;
}

function NetworkScene({ isReducedMotion }: { isReducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const nodes = useMemo(() => generateNodes(42, 36), []);
  const edges = useMemo(() => buildEdges(nodes), [nodes]);
  const sphereRefs = useRef<Record<NodeKind, THREE.InstancedMesh | null>>({
    apporteur: null,
    investisseur: null,
    promoteur: null,
  });
  const lineRef = useRef<THREE.LineSegments>(null);

  // Build buffer geometry pour les lignes
  const linesGeo = useMemo(() => {
    const positions = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], idx) => {
      const pa = nodes[a].pos;
      const pb = nodes[b].pos;
      positions[idx * 6 + 0] = pa.x;
      positions[idx * 6 + 1] = pa.y;
      positions[idx * 6 + 2] = pa.z;
      positions[idx * 6 + 3] = pb.x;
      positions[idx * 6 + 4] = pb.y;
      positions[idx * 6 + 5] = pb.z;
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [nodes, edges]);

  // Group nodes by kind for InstancedMesh
  const nodesByKind = useMemo(() => {
    const map: Record<NodeKind, NetNode[]> = {
      apporteur: [],
      investisseur: [],
      promoteur: [],
    };
    nodes.forEach((n) => map[n.kind].push(n));
    return map;
  }, [nodes]);

  useFrame((state, delta) => {
    if (!isReducedMotion && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.07;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.06;
    }

    const t = state.clock.elapsedTime;

    // Pulse spheres
    (Object.keys(nodesByKind) as NodeKind[]).forEach((kind) => {
      const mesh = sphereRefs.current[kind];
      if (!mesh) return;
      const arr = nodesByKind[kind];
      const dummy = new THREE.Object3D();
      arr.forEach((n, i) => {
        const pulse = 0.85 + Math.sin(t * 1.6 + n.pulsePhase) * 0.18;
        dummy.position.copy(n.pos);
        dummy.scale.setScalar(pulse * 0.16);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    });
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={0.6} color="#fef3c7" distance={8} />

      <group ref={groupRef}>
        {/* Lines */}
        <lineSegments ref={lineRef}>
          <primitive object={linesGeo} attach="geometry" />
          <lineBasicMaterial
            color="#e9c665"
            transparent
            opacity={0.45}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>

        {/* Spheres par kind */}
        {(Object.keys(nodesByKind) as NodeKind[]).map((kind) => (
          <instancedMesh
            key={kind}
            ref={(r) => { sphereRefs.current[kind] = r; }}
            args={[undefined, undefined, nodesByKind[kind].length]}
          >
            <sphereGeometry args={[1, 12, 12]} />
            <meshBasicMaterial
              color={COLORS[kind]}
              transparent
              opacity={0.9}
              toneMapped={false}
            />
          </instancedMesh>
        ))}

        {/* Halo spheres around each big one — additive bloom-fake */}
        {(Object.keys(nodesByKind) as NodeKind[]).map((kind) =>
          nodesByKind[kind].slice(0, 3).map((n, i) => (
            <Float key={`${kind}-${i}`} speed={1.4} floatIntensity={0.3} rotationIntensity={0.2}>
              <mesh position={n.pos}>
                <sphereGeometry args={[0.36, 16, 16]} />
                <meshBasicMaterial
                  color={COLORS[kind]}
                  transparent
                  opacity={0.12}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>
            </Float>
          ))
        )}
      </group>
    </>
  );
}

/* Fallback SVG mobile : 3 clusters de nodes connectés (apporteurs/investisseurs/promoteurs). */
function NetworkSvgFallback() {
  const clusters = [
    { cx: 90, cy: 110, color: "#e9c665", label: "A" },
    { cx: 270, cy: 90, color: "#f43f5e", label: "I" },
    { cx: 180, cy: 240, color: "#9089fc", label: "P" },
  ];
  return (
    <svg
      viewBox="0 0 360 360"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <g stroke="#e9c665" strokeWidth="0.6" opacity="0.5">
        <line x1="90" y1="110" x2="270" y2="90" />
        <line x1="270" y1="90" x2="180" y2="240" />
        <line x1="180" y1="240" x2="90" y2="110" />
        <line x1="90" y1="110" x2="180" y2="170" />
        <line x1="270" y1="90" x2="180" y2="170" />
        <line x1="180" y1="240" x2="180" y2="170" />
      </g>
      {clusters.map((c, i) => (
        <g key={i}>
          <circle cx={c.cx} cy={c.cy} r="24" fill={c.color} opacity="0.15" />
          <circle cx={c.cx} cy={c.cy} r="10" fill={c.color} />
          {/* Petits satellites */}
          {[0, 1, 2].map((k) => {
            const angle = (k * 2.1 + i * 0.7) * Math.PI;
            return (
              <circle
                key={k}
                cx={c.cx + Math.cos(angle) * 36}
                cy={c.cy + Math.sin(angle) * 36}
                r="4"
                fill={c.color}
                opacity="0.7"
              />
            );
          })}
        </g>
      ))}
    </svg>
  );
}

const NetworkCanvas = dynamic<{}>(
  () =>
    Promise.resolve(function NetworkCanvasInner() {
      const [isReducedMotion, setIsReducedMotion] = useState(false);
      const [isMobile, setIsMobile] = useState(false);
      const [isVisible, setIsVisible] = useState(true);
      const wrapRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
        const m = window.matchMedia("(prefers-reduced-motion: reduce)");
        setIsReducedMotion(m.matches);
        setIsMobile(window.innerWidth < 768);
      }, []);

      useEffect(() => {
        const node = wrapRef.current;
        if (!node) return;
        const io = new IntersectionObserver(
          ([entry]) => setIsVisible(entry.isIntersecting),
          { threshold: 0 },
        );
        io.observe(node);
        return () => io.disconnect();
      }, []);

      if (isMobile || isReducedMotion) {
        return (
          <div ref={wrapRef} style={{ position: "absolute", inset: 0 }}>
            <NetworkSvgFallback />
          </div>
        );
      }

      return (
        <div ref={wrapRef} style={{ position: "absolute", inset: 0 }}>
          <Canvas
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            frameloop={isVisible ? "always" : "demand"}
            style={{ width: "100%", height: "100%" }}
          >
            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={42} />
            <Suspense fallback={null}>
              <NetworkScene isReducedMotion={isReducedMotion} />
            </Suspense>
          </Canvas>
        </div>
      );
    }),
  { ssr: false }
);

export function NetworkSection() {
  return (
    <section
      className="ld-section"
      style={{
        position: "relative",
        background: "var(--ld-bg-1)",
        borderTop: "1px solid var(--ld-border-subtle)",
        borderBottom: "1px solid var(--ld-border-subtle)",
      }}
    >
      <div
        className="ld-glow-spot"
        style={{
          width: 800, height: 800,
          top: "10%", right: "-200px",
          background:
            "radial-gradient(circle, rgba(144,137,252,0.12) 0%, transparent 70%)",
          opacity: 0.7,
        }}
      />

      <div className="ld-container">
        <SectionHeading
          eyebrow="Fonctionnalité phare · 02"
          title={
            <>
              Les meilleurs deals{" "}
              <span className="ld-display-italic ld-grad-aurora-text">
                ne sont jamais publics.
              </span>
            </>
          }
          description="Le réseau d'apporteurs E-Dome connecte 850+ deal-bringers à des investisseurs qualifiés. Off-market avant tout le monde."
        />

        {/* Network visu + 3 colonnes */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 40,
            marginTop: 56,
            alignItems: "stretch",
          }}
        >
          <style>{`
            @media (min-width: 1024px) {
              .ld-net-grid {
                grid-template-columns: 1fr 1fr !important;
                gap: 64px !important;
              }
            }
          `}</style>
          <div className="ld-net-grid" style={{ display: "contents" }}>
            {/* Canvas 3D */}
            <div
              className="ld-glass"
              style={{
                position: "relative",
                aspectRatio: "1 / 1",
                minHeight: 360,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: "20%",
                  background:
                    "radial-gradient(circle, rgba(233,198,101,0.2) 0%, transparent 70%)",
                  filter: "blur(40px)",
                  pointerEvents: "none",
                }}
              />
              <NetworkCanvas />
              {/* Legend overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  padding: "12px 16px",
                  background: "rgba(10,10,10,0.7)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid var(--ld-border-subtle)",
                  borderRadius: 12,
                  fontSize: 12,
                  fontFamily: "var(--ld-font-mono)",
                }}
              >
                {[
                  { kind: "apporteur", label: "Apporteurs" },
                  { kind: "investisseur", label: "Investisseurs" },
                  { kind: "promoteur", label: "Promoteurs" },
                ].map((l) => (
                  <div key={l.kind} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        background: COLORS[l.kind as NodeKind],
                        boxShadow: `0 0 6px ${COLORS[l.kind as NodeKind]}`,
                      }}
                    />
                    <span style={{ color: "var(--ld-fg-1)" }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3 colonnes value props */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                justifyContent: "center",
              }}
            >
              <NetRow
                icon={Handshake}
                color={COLORS.apporteur}
                title="Pour les apporteurs"
                description="Commission jusqu'à 15 % sur referrals qualifiés. Paiement mensuel transparent. CRM intégré."
                metric="CHF 2.4M"
                metricLabel="potentiel annuel projeté"
              />
              <NetRow
                icon={Users}
                color={COLORS.investisseur}
                title="Pour les investisseurs"
                description="Accès aux biens hors marché avant publication. Filtres avancés et priorité de visite."
                metric="247"
                metricLabel="biens hors marché actifs"
              />
              <NetRow
                icon={Building2}
                color={COLORS.promoteur}
                title="Pour les promoteurs"
                description="Pré-commercialisation discrète. Audience d'investisseurs sérieux et qualifiés."
                metric="68 %"
                metricLabel="taux de pré-vente moyen modélisé"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NetRow({
  icon: Icon,
  color,
  title,
  description,
  metric,
  metricLabel,
}: {
  icon: typeof Handshake;
  color: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="ld-glass-soft ld-lift"
      style={{ padding: 22, display: "flex", gap: 16, alignItems: "flex-start" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 42,
          height: 42,
          borderRadius: 10,
          background: `${color}20`,
          color: color,
          flexShrink: 0,
        }}
      >
        <Icon size={18} strokeWidth={1.8} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ld-fg-0)", marginBottom: 4 }}>
          {title}
        </div>
        <p style={{ fontSize: 13.5, lineHeight: 1.5, color: "var(--ld-fg-2)", margin: 0, marginBottom: 12 }}>
          {description}
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span
            className="ld-mono"
            style={{ fontSize: 22, fontWeight: 500, color: color, lineHeight: 1 }}
          >
            {metric}
          </span>
          <span style={{ fontSize: 11, color: "var(--ld-fg-3)" }}>{metricLabel}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default NetworkSection;
