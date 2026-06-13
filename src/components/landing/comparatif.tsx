"use client";

import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";
import { SectionHeading } from "./personas";

type Cell = "yes" | "no" | "partial";

const ROWS: { feature: string; edome: Cell; others: Cell; note?: string }[] = [
  { feature: "Analyse financière intégrée (rendement net, ROI)", edome: "yes", others: "no" },
  { feature: "Accès aux deals off-market", edome: "yes", others: "no" },
  { feature: "Feed social + engagement communautaire", edome: "yes", others: "no" },
  { feature: "Formations monétisées intégrées", edome: "yes", others: "no" },
  { feature: "Multi-pays & multi-devises (CHF/EUR/AED/MAD)", edome: "yes", others: "partial", note: "limité" },
  { feature: "Programme d'apporteurs avec commission", edome: "yes", others: "no" },
  { feature: "Dashboard analytique propriétaire", edome: "yes", others: "partial" },
  { feature: "Visio-conférences & visites live intégrées", edome: "yes", others: "no" },
  { feature: "Recherche full-text + filtres avancés", edome: "yes", others: "yes" },
  { feature: "Listing simple de biens", edome: "yes", others: "yes" },
];

export function Comparatif() {
  return (
    <section id="comparatif" className="ld-section" style={{ position: "relative" }}>
      <div className="ld-container">
        <SectionHeading
          eyebrow="Comparatif"
          title={
            <>
              E-Dome vs{" "}
              <span className="ld-display-italic" style={{ color: "var(--ld-fg-3)" }}>
                portails classiques.
              </span>
            </>
          }
          description="Pas de FUD, juste des faits. Voici ce qu'on fait, et ce qu'ils ne font pas."
        />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="ld-glass"
          style={{
            marginTop: 56,
            padding: 0,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Glow E-Dome column */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: "calc(28% - 4px)",
              width: "28%",
              background:
                "linear-gradient(180deg, rgba(233,198,101,0.06) 0%, rgba(233,198,101,0.02) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Header */}
          <div
            className="ld-compare-header"
            style={{
              display: "grid",
              gridTemplateColumns: "1.6fr 1fr 1fr",
              alignItems: "center",
              padding: "20px 24px",
              borderBottom: "1px solid var(--ld-border)",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div className="ld-eyebrow" style={{ color: "var(--ld-fg-2)" }}>
              Fonctionnalité
            </div>
            <h3
              className="ld-display"
              style={{
                fontSize: 22,
                fontWeight: 500,
                color: "var(--ld-gold-300)",
                textAlign: "center",
                margin: 0,
              }}
            >
              E-Dome
            </h3>
            <div
              style={{
                fontSize: 13.5,
                color: "var(--ld-fg-3)",
                textAlign: "center",
                fontWeight: 500,
              }}
            >
              Portails classiques
            </div>
          </div>

          {/* Rows */}
          {ROWS.map((row, i) => (
            <motion.div
              key={row.feature}
              className="ld-compare-row"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              style={{
                display: "grid",
                gridTemplateColumns: "1.6fr 1fr 1fr",
                alignItems: "center",
                padding: "18px 24px",
                borderBottom:
                  i < ROWS.length - 1 ? "1px solid var(--ld-border-subtle)" : "none",
                position: "relative",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  fontSize: 14.5,
                  color: "var(--ld-fg-1)",
                  paddingRight: 16,
                }}
              >
                {row.feature}
              </div>
              <div
                data-side-label="E-Dome"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <CellIcon kind={row.edome} side="edome" />
              </div>
              <div
                data-side-label="Concurrents"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <CellIcon kind={row.others} side="other" note={row.note} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CellIcon({ kind, side, note }: { kind: Cell; side: "edome" | "other"; note?: string }) {
  if (kind === "yes") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 28,
          height: 28,
          borderRadius: 999,
          background:
            side === "edome" ? "rgba(233,198,101,0.18)" : "rgba(16,185,129,0.15)",
          color: side === "edome" ? "var(--ld-gold-400)" : "var(--ld-success)",
        }}
      >
        <Check size={14} strokeWidth={2.6} />
      </div>
    );
  }
  if (kind === "partial") {
    return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: 999,
            background: "rgba(255,255,255,0.05)",
            color: "var(--ld-fg-3)",
          }}
        >
          <Minus size={14} strokeWidth={2.4} />
        </div>
        {note && (
          <span
            style={{
              fontSize: 10,
              color: "var(--ld-fg-3)",
              fontFamily: "var(--ld-font-mono)",
            }}
          >
            {note}
          </span>
        )}
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        borderRadius: 999,
        background: "rgba(255,255,255,0.03)",
        color: "var(--ld-fg-3)",
        opacity: 0.55,
      }}
    >
      <X size={14} strokeWidth={2.2} />
    </div>
  );
}

export default Comparatif;
