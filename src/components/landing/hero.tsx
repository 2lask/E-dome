"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

const REVEAL = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

/* Hero éditorial — minimal single column, oversized serif, accent teal.
   Architecture validée par ui-ux-pro-max skill (Exaggerated Minimalism). */
export function Hero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "92svh",
        display: "flex",
        flexDirection: "column",
        background: "var(--background)",
      }}
    >
      {/* Top eyebrow */}
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          width: "100%",
          padding: "32px 24px 0",
        }}
      >
        <motion.div
          {...REVEAL}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--muted-foreground)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 24,
              height: 1,
              background: "currentColor",
              opacity: 0.5,
            }}
          />
          Plateforme · Suisse · 2026
        </motion.div>
      </div>

      {/* Headline + media split */}
      <div
        className="ed-hero-grid"
        style={{
          maxWidth: 1240,
          margin: "auto",
          width: "100%",
          padding: "48px 24px 64px",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 48,
          alignItems: "center",
        }}
      >
        <style>{`
          @media (min-width: 1024px) {
            .ed-hero-grid {
              grid-template-columns: 1.15fr 1fr !important;
              gap: 80px !important;
              padding-top: 64px !important;
              padding-bottom: 96px !important;
            }
          }
        `}</style>

        {/* Left : copy */}
        <div>
          <motion.h1
            {...REVEAL}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="page-heading"
            style={{
              fontSize: "clamp(2.75rem, 7.5vw, 6.5rem)",
              lineHeight: 0.97,
              letterSpacing: "-0.028em",
              margin: 0,
              marginBottom: 28,
              color: "var(--foreground)",
              fontWeight: 500,
            }}
          >
            L'immobilier suisse,{" "}
            <em
              style={{
                fontStyle: "italic",
                color: "var(--ed-accent, #0F766E)",
                fontWeight: 500,
              }}
            >
              repensé
            </em>
            .
          </motion.h1>

          <motion.p
            {...REVEAL}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: "clamp(1.0625rem, 1.6vw, 1.25rem)",
              lineHeight: 1.55,
              color: "var(--muted-foreground)",
              maxWidth: 540,
              margin: "0 0 40px 0",
            }}
          >
            Une seule plateforme pour les investisseurs, hôtes et apporteurs.
            Rendement net calculé, deals de gré à gré, formations et communauté
            — de l'annonce à l'acte notarié.
          </motion.p>

          <motion.div
            {...REVEAL}
            transition={{ duration: 0.6, delay: 0.32 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 12 }}
          >
            <Link
              href="/feed"
              className="ed-cta-primary"
              style={{ textDecoration: "none" }}
            >
              Découvrir la démo
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
            <a
              href="#demo"
              className="ed-cta-ghost"
              style={{ textDecoration: "none" }}
            >
              <Play size={13} strokeWidth={2} fill="currentColor" aria-hidden="true" />
              Comment ça marche · 2 min
            </a>
          </motion.div>

          {/* Trust mini line */}
          <motion.p
            {...REVEAL}
            transition={{ duration: 0.6, delay: 0.45 }}
            style={{
              marginTop: 28,
              fontSize: 12.5,
              color: "var(--muted-foreground)",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.02em",
            }}
          >
            Inscription gratuite · Aucune carte requise · Données hébergées en Suisse
          </motion.p>
        </div>

        {/* Right : single editorial image with subtle frame */}
        <motion.figure
          {...REVEAL}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "relative",
            margin: 0,
            aspectRatio: "4 / 5",
            maxHeight: "78vh",
            background: "var(--muted)",
            border: "1px solid var(--border)",
            overflow: "hidden",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=1125&fit=crop&auto=format&q=80"
            alt="Villa contemporaine à Cologny, Genève"
            loading="eager"
            decoding="async"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          {/* Caption corner */}
          <figcaption
            style={{
              position: "absolute",
              left: 12,
              bottom: 12,
              padding: "8px 14px",
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#ffffff",
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(8px)",
              borderRadius: 999,
            }}
          >
            Cologny · CHF 4.85M · Off-market
          </figcaption>

          {/* Top right marker — JetBrains mono coordinates */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              right: 12,
              top: 12,
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.12em",
              color: "#ffffff",
              opacity: 0.75,
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
            }}
          >
            46.2406°N · 6.1830°E
          </div>
        </motion.figure>
      </div>

      {/* Bottom strip : 4 metrics tabular-nums */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          background: "var(--background)",
        }}
      >
        <div
          className="ed-stats-row"
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "24px",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 24,
          }}
        >
          <style>{`
            @media (min-width: 768px) {
              .ed-stats-row {
                grid-template-columns: repeat(4, 1fr) !important;
              }
            }
          `}</style>
          {[
            { v: "14+", l: "types de biens" },
            { v: "850+", l: "apporteurs actifs cette semaine" },
            { v: "120+", l: "formations en marketplace" },
            { v: "4", l: "devises supportées" },
          ].map((s) => (
            <div key={s.l}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 22,
                  fontWeight: 500,
                  color: "var(--foreground)",
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                {s.v}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--muted-foreground)",
                  lineHeight: 1.35,
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
