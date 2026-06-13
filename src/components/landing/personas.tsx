"use client";

import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  TrendingUp,
  Home,
  Handshake,
  GraduationCap,
  Check,
  type LucideIcon,
} from "lucide-react";

interface Persona {
  id: string;
  label: string;
  icon: LucideIcon;
  baseline: string;
  bullets: string[];
  metric: { value: string; label: string };
  accent: string;
}

const PERSONAS: Persona[] = [
  {
    id: "investisseur",
    label: "Investisseur",
    icon: TrendingUp,
    baseline: "Calculez le rendement net en 3 clics.",
    bullets: [
      "Filtres avancés : prix, m², rendement net, ROI 5-10 ans",
      "Analyse fiscale par canton suisse intégrée",
      "Accès aux biens hors marché via le réseau d'apporteurs",
      "Suivi de portefeuille consolidé multi-devises",
    ],
    metric: { value: "+6.4%", label: "Rendement net moyen" },
    accent: "var(--ld-success)",
  },
  {
    id: "hote",
    label: "Hôte",
    icon: Home,
    baseline: "Gérez votre courte durée comme un pro.",
    bullets: [
      "Pricing dynamique recommandé par saisonnalité",
      "Dashboard occupation portefeuille temps réel",
      "Calendrier multi-plateformes synchronisé",
      "Formations marketing digital incluses",
    ],
    metric: { value: "92%", label: "Taux d'occupation cible" },
    accent: "var(--ld-rose)",
  },
  {
    id: "apporteur",
    label: "Apporteur",
    icon: Handshake,
    baseline: "Transformez votre carnet en revenus.",
    bullets: [
      "Commission jusqu'à 15 % sur les referrals qualifiés",
      "Biens hors marché réservés en avant-première",
      "CRM intégré : leads, suivis, conversions",
      "Paiement mensuel transparent en CHF / EUR",
    ],
    metric: { value: "CHF 48K", label: "Commission maximale modélisée" },
    accent: "var(--ld-gold-400)",
  },
  {
    id: "formateur",
    label: "Formateur",
    icon: GraduationCap,
    baseline: "Monétisez votre expertise immobilier.",
    bullets: [
      "Place de marché : audience d'investisseurs qualifiés",
      "Jusqu'à 40 % de commission par inscription",
      "Outils : modules, quiz, rediffusions, certifications",
      "Communauté multilingue FR / DE / EN",
    ],
    metric: { value: "120+", label: "Formations actives" },
    accent: "var(--ld-blue)",
  },
];

export function Personas() {
  const [activeId, setActiveId] = useState(PERSONAS[0].id);
  const active = PERSONAS.find((p) => p.id === activeId)!;
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const focusTab = useCallback((id: string) => {
    setActiveId(id);
    requestAnimationFrame(() => {
      tabRefs.current[id]?.focus();
    });
  }, []);

  const onTabKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, currentIdx: number) => {
      const last = PERSONAS.length - 1;
      let nextIdx = currentIdx;
      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          nextIdx = currentIdx === last ? 0 : currentIdx + 1;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          nextIdx = currentIdx === 0 ? last : currentIdx - 1;
          break;
        case "Home":
          nextIdx = 0;
          break;
        case "End":
          nextIdx = last;
          break;
        default:
          return;
      }
      e.preventDefault();
      focusTab(PERSONAS[nextIdx].id);
    },
    [focusTab],
  );

  return (
    <section
      id="personas"
      className="ld-section"
      style={{ position: "relative" }}
    >
      <div className="ld-container">
        <SectionHeading
          eyebrow="Solutions"
          title={
            <>
              Quatre rôles.{" "}
              <span className="ld-display-italic" style={{ color: "var(--ld-gold-300)" }}>
                Un écosystème.
              </span>
            </>
          }
          description="Sélectionnez votre rôle. La plateforme s'adapte à vos objectifs — pas l'inverse."
        />

        <LayoutGroup>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 32,
              alignItems: "stretch",
              marginTop: 56,
            }}
          >
            <style>{`
              @media (min-width: 1024px) {
                .ld-personas-grid {
                  grid-template-columns: 320px 1fr !important;
                  gap: 48px !important;
                }
              }
            `}</style>
            <div className="ld-personas-grid" style={{ display: "contents" }}>
              {/* Tabs */}
              <div
                role="tablist"
                aria-label="Profils utilisateur"
                aria-orientation="vertical"
                style={{ display: "flex", flexDirection: "column", gap: 8 }}
              >
                {PERSONAS.map((p, idx) => {
                  const Icon = p.icon;
                  const isActive = p.id === activeId;
                  return (
                    <button
                      key={p.id}
                      ref={(el) => { tabRefs.current[p.id] = el; }}
                      id={`persona-tab-${p.id}`}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`persona-panel-${p.id}`}
                      tabIndex={isActive ? 0 : -1}
                      onKeyDown={(e) => onTabKeyDown(e, idx)}
                      onClick={() => setActiveId(p.id)}
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        padding: "18px 20px",
                        background: isActive
                          ? "rgba(255,255,255,0.05)"
                          : "transparent",
                        border: "1px solid",
                        borderColor: isActive
                          ? "var(--ld-border)"
                          : "var(--ld-border-subtle)",
                        borderRadius: 14,
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "background 220ms ease, border-color 220ms ease",
                        fontFamily: "inherit",
                        color: "inherit",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive)
                          e.currentTarget.style.background = "rgba(255,255,255,0.025)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive)
                          e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="persona-indicator"
                          style={{
                            position: "absolute",
                            left: 0,
                            top: "20%",
                            bottom: "20%",
                            width: 3,
                            background: p.accent,
                            borderRadius: 999,
                            boxShadow: `0 0 12px ${p.accent}`,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 340,
                            damping: 30,
                          }}
                        />
                      )}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 38,
                          height: 38,
                          borderRadius: 10,
                          background: isActive
                            ? `${p.accent}20`
                            : "rgba(255,255,255,0.04)",
                          color: isActive ? p.accent : "var(--ld-fg-2)",
                          transition: "background 220ms ease, color 220ms ease",
                        }}
                      >
                        <Icon size={18} strokeWidth={1.8} />
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: isActive ? "var(--ld-fg-0)" : "var(--ld-fg-1)",
                            marginBottom: 2,
                          }}
                        >
                          {p.label}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--ld-fg-3)",
                          }}
                        >
                          {p.baseline}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Mockup card */}
              <div
                className="ld-glass"
                role="tabpanel"
                id={`persona-panel-${active.id}`}
                aria-labelledby={`persona-tab-${active.id}`}
                tabIndex={0}
                style={{
                  position: "relative",
                  minHeight: 480,
                  padding: 40,
                  overflow: "hidden",
                }}
              >
                <div
                  className="ld-glow-spot ld-glow-gold"
                  style={{
                    width: 300,
                    height: 300,
                    top: -80,
                    right: -80,
                    opacity: 0.4,
                  }}
                />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    style={{ position: "relative", zIndex: 1 }}
                  >
                    <div
                      className="ld-eyebrow"
                      style={{ color: active.accent, marginBottom: 16 }}
                    >
                      Pour les {active.label.toLowerCase()}s
                    </div>

                    <h3
                      className="ld-display"
                      style={{
                        fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                        margin: "0 0 32px 0",
                        color: "var(--ld-fg-0)",
                      }}
                    >
                      {active.baseline}
                    </h3>

                    {/* Bullets */}
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: "0 0 40px 0",
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                      }}
                    >
                      {active.bullets.map((b, i) => (
                        <motion.li
                          key={b}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 12,
                            fontSize: 15,
                            lineHeight: 1.5,
                            color: "var(--ld-fg-1)",
                          }}
                        >
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 20,
                              height: 20,
                              borderRadius: 999,
                              background: `${active.accent}25`,
                              color: active.accent,
                              flexShrink: 0,
                              marginTop: 2,
                            }}
                          >
                            <Check size={12} strokeWidth={2.5} />
                          </span>
                          {b}
                        </motion.li>
                      ))}
                    </ul>

                    {/* Metric mockup */}
                    <div
                      className="ld-glass-soft"
                      style={{
                        padding: "20px 24px",
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 56,
                          height: 56,
                          borderRadius: 12,
                          background: `${active.accent}20`,
                          color: active.accent,
                        }}
                      >
                        <active.icon size={24} strokeWidth={1.8} />
                      </div>
                      <div>
                        <div
                          className="ld-mono"
                          style={{
                            fontSize: 32,
                            fontWeight: 500,
                            lineHeight: 1,
                            color: "var(--ld-fg-0)",
                            marginBottom: 6,
                          }}
                        >
                          {active.metric.value}
                        </div>
                        <div style={{ fontSize: 13, color: "var(--ld-fg-3)" }}>
                          {active.metric.label}
                        </div>
                      </div>
                      <MiniSparkline accent={active.accent} seed={active.id} />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}

/* ─── Section heading shared ────────────────────────────────── */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        textAlign: align,
        maxWidth: align === "center" ? 720 : 680,
        marginLeft: align === "center" ? "auto" : 0,
        marginRight: align === "center" ? "auto" : 0,
      }}
    >
      {eyebrow && <div className="ld-eyebrow" style={{ marginBottom: 16 }}>{eyebrow}</div>}
      <h2
        className="ld-display"
        style={{
          fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
          margin: 0,
          marginBottom: description ? 20 : 0,
          color: "var(--ld-fg-0)",
        }}
      >
        {title}
      </h2>
      {description && (
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.55,
            color: "var(--ld-fg-2)",
            margin: 0,
          }}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}

/* ─── Mini sparkline SVG seeded ──────────────────────────────── */
function MiniSparkline({ accent, seed }: { accent: string; seed: string }) {
  const points = generatePoints(seed, 12);
  const path = pointsToPath(points, 104, 36);
  return (
    <svg
      width={104}
      height={36}
      viewBox="0 0 104 36"
      style={{ marginLeft: "auto", flexShrink: 0 }}
      aria-hidden
    >
      <defs>
        <linearGradient id={`grad-${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity={0.4} />
          <stop offset="100%" stopColor={accent} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path
        d={`${path} L 104 36 L 0 36 Z`}
        fill={`url(#grad-${seed})`}
      />
      <path
        d={path}
        fill="none"
        stroke={accent}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function generatePoints(seed: string, count: number): number[] {
  // FNV-1a hash → seeded random
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  const rand = () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return (h >>> 0) / 4294967296;
  };
  const arr: number[] = [];
  let v = 0.5;
  for (let i = 0; i < count; i++) {
    v = Math.max(0.1, Math.min(0.95, v + (rand() - 0.42) * 0.25));
    arr.push(v);
  }
  return arr;
}

function pointsToPath(points: number[], width: number, height: number): string {
  if (!points.length) return "";
  const stepX = width / (points.length - 1);
  return points
    .map((v, i) => {
      const x = i * stepX;
      const y = height - v * height;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export default Personas;
