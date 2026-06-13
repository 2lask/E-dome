"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { WordRotate } from "./word-rotate";

/* Dynamic import du Canvas 3D pour éviter SSR + alléger le 1er paint. */
const Hero3DBuilding = dynamic(
  () => import("./hero-building-3d").then((m) => m.Hero3DBuilding),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 60% 50%, rgba(233,198,101,0.12) 0%, transparent 60%)",
        }}
      />
    ),
  }
);

const ROTATING_WORDS = ["Investissez.", "Hébergez.", "Apportez.", "Formez."];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Transform smoothing pour le 3D
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => setProgress(v));
    return () => unsub();
  }, [scrollYProgress]);

  // Parallax sur le texte
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.2]);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "100svh",
        paddingTop: 120,
        paddingBottom: 80,
        overflow: "hidden",
      }}
    >
      {/* Background layers */}
      <div className="ld-grid-bg" aria-hidden />
      <div
        className="ld-glow-spot ld-glow-gold"
        style={{ width: 600, height: 600, top: -200, right: -150, opacity: 0.7 }}
        aria-hidden
      />
      <div
        className="ld-glow-spot"
        style={{
          width: 500,
          height: 500,
          bottom: -200,
          left: -120,
          background:
            "radial-gradient(circle, rgba(144,137,252,0.14) 0%, transparent 70%)",
          opacity: 0.6,
        }}
        aria-hidden
      />

      <div
        className="ld-container"
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 48,
          alignItems: "center",
        }}
      >
        <style>{`
          @media (min-width: 1024px) {
            .ld-hero-grid {
              grid-template-columns: 1.05fr 1fr !important;
              gap: 64px !important;
            }
          }
        `}</style>
        <div className="ld-hero-grid" style={{ display: "contents" }}>
          {/* ── Left : copy ────────────────────────────────────────── */}
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ marginBottom: 24 }}
            >
              <span className="ld-pill">
                <span className="ld-pill-dot ld-pulse-dot" />
                <span style={{ color: "var(--ld-fg-1)" }}>
                  Suisse · Maroc · Dubai · Portugal
                </span>
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              className="ld-display"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: "clamp(2.75rem, 6.5vw, 5.5rem)",
                lineHeight: 0.98,
                letterSpacing: "-0.028em",
                margin: 0,
                marginBottom: 20,
              }}
            >
              <span className="ld-grad-aurora-text">
                <WordRotate words={ROTATING_WORDS} intervalMs={2400} />
              </span>
              <br />
              <span className="ld-grad-title-text">
                Tout l'immobilier.
              </span>
              <br />
              <span className="ld-display-italic ld-grad-title-text">
                Une plateforme.
              </span>
            </motion.h1>

            {/* Subhead */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              style={{
                fontSize: 18,
                lineHeight: 1.55,
                color: "var(--ld-fg-2)",
                maxWidth: 540,
                margin: "0 0 36px 0",
              }}
            >
              L'écosystème qui réunit{" "}
              <span style={{ color: "var(--ld-fg-0)", fontWeight: 500 }}>
                investisseurs, hôtes, apporteurs et formateurs
              </span>
              . Rendement net, deals de gré à gré, formations et communauté — de l'annonce à l'acte notarié.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 48,
              }}
            >
              <Link href="/feed" className="ld-cta-primary" style={{ textDecoration: "none" }}>
                <Sparkles size={16} strokeWidth={2} aria-hidden="true" />
                Découvrir le rendement net
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </Link>
              <a href="#demo" className="ld-cta-ghost" style={{ textDecoration: "none" }}>
                <Play size={14} strokeWidth={2} fill="currentColor" aria-hidden="true" />
                Voir la démo · 2 min
              </a>
            </motion.div>

            {/* Stats inline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 28,
                paddingTop: 28,
                borderTop: "1px solid var(--ld-border-subtle)",
              }}
            >
              {[
                { value: "14+", label: "types de biens" },
                { value: "850+", label: "apporteurs cette semaine" },
                { value: "6", label: "sources de revenu" },
                { value: "4", label: "devises supportées" },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    className="ld-mono"
                    style={{
                      fontSize: 22,
                      fontWeight: 500,
                      color: "var(--ld-fg-0)",
                      lineHeight: 1,
                      marginBottom: 6,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--ld-fg-3)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right : 3D Canvas (≥768px) ─────────────────────────── */}
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "1 / 1",
              maxHeight: "72vh",
              minHeight: 320,
            }}
            aria-hidden
          >
            {/* Glow halo behind */}
            <div
              style={{
                position: "absolute",
                inset: "10%",
                background:
                  "radial-gradient(circle, rgba(233,198,101,0.25) 0%, transparent 60%)",
                filter: "blur(40px)",
                pointerEvents: "none",
              }}
            />
            <Hero3DBuilding scrollProgress={progress} />

            {/* Corner ticks (cosmetic) */}
            <CornerTicks />

            {/* Caption bottom */}
            <div
              style={{
                position: "absolute",
                left: 12,
                bottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 12px",
                fontFamily: "var(--ld-font-mono)",
                fontSize: 10.5,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--ld-gold-400)",
                background: "rgba(10,10,10,0.6)",
                backdropFilter: "blur(12px)",
                border: "1px solid var(--ld-border-subtle)",
                borderRadius: 999,
              }}
            >
              <span className="ld-pulse-dot" style={{
                width: 6, height: 6, borderRadius: 999,
                background: "var(--ld-gold-400)",
                boxShadow: "0 0 8px var(--ld-gold-glow)",
              }} />
              Maquette · Lausanne 2026
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          fontFamily: "var(--ld-font-mono)",
          fontSize: 10,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--ld-fg-3)",
          zIndex: 2,
        }}
        aria-hidden
      >
        <span>Découvrir</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 1,
            height: 32,
            background: "linear-gradient(180deg, transparent, var(--ld-gold-400))",
          }}
        />
      </motion.div>
    </section>
  );
}

function CornerTicks() {
  const tick = {
    position: "absolute" as const,
    width: 18,
    height: 18,
    borderColor: "var(--ld-gold-400)",
    opacity: 0.7,
  };
  return (
    <>
      <div style={{ ...tick, top: 8, left: 8, borderTop: "1px solid", borderLeft: "1px solid" }} />
      <div style={{ ...tick, top: 8, right: 8, borderTop: "1px solid", borderRight: "1px solid" }} />
      <div style={{ ...tick, bottom: 8, left: 8, borderBottom: "1px solid", borderLeft: "1px solid" }} />
      <div style={{ ...tick, bottom: 8, right: 8, borderBottom: "1px solid", borderRight: "1px solid" }} />
    </>
  );
}

export default Hero;
