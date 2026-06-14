"use client";

import { motion } from "framer-motion";

/* Editorial pitch — pull quote + image asymmetric grid.
   Pattern : Editorial Grid / Magazine (ui-ux-pro-max recommandation).
   Source Serif 4 italic en très grand pour la citation. */

export function EditorialPitch() {
  return (
    <section
      style={{
        background: "var(--background)",
        padding: "112px 0",
      }}
    >
      <div
        className="ed-pitch-grid"
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 48,
          alignItems: "center",
        }}
      >
        <style>{`
          @media (min-width: 1024px) {
            .ed-pitch-grid {
              grid-template-columns: 1.3fr 1fr !important;
              gap: 80px !important;
            }
          }
        `}</style>

        {/* Pull quote */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--muted-foreground)",
              marginBottom: 28,
              display: "flex",
              alignItems: "center",
              gap: 12,
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
            La promesse
          </div>

          <blockquote
            className="page-heading"
            style={{
              fontSize: "clamp(1.875rem, 4.5vw, 3.5rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              fontWeight: 400,
              margin: 0,
              color: "var(--foreground)",
              fontStyle: "italic",
            }}
          >
            <span aria-hidden style={{ color: "var(--ed-accent, #0F766E)" }}>
              «&nbsp;
            </span>
            Le seul portail qui calcule votre{" "}
            <em
              style={{
                fontStyle: "italic",
                color: "var(--ed-accent, #0F766E)",
                fontWeight: 400,
              }}
            >
              rendement net réel
            </em>{" "}
            avant que vous tombiez amoureux du bien.
            <span aria-hidden style={{ color: "var(--ed-accent, #0F766E)" }}>
              &nbsp;»
            </span>
          </blockquote>

          <p
            style={{
              marginTop: 36,
              fontSize: 15,
              lineHeight: 1.6,
              color: "var(--muted-foreground)",
              maxWidth: 520,
            }}
          >
            Charges, vacance estimée, fiscalité cantonale et ROI 10 ans —
            préchargés sur chaque annonce. Vous comparez ce qui compte vraiment,
            pas seulement les photos.
          </p>
        </motion.div>

        {/* Stats card */}
        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{
            border: "1px solid var(--border)",
            padding: 32,
            background: "var(--background)",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--muted-foreground)",
            }}
          >
            Exemple · Lausanne 2.5 pièces
          </div>

          {[
            { label: "Prix d'achat", value: "CHF 875'000" },
            { label: "Loyer mensuel net", value: "CHF 2'950" },
            { label: "Rendement brut", value: "4.05 %", muted: true },
            { label: "Rendement net après charges & impôts", value: "2.91 %", highlight: true },
            { label: "ROI projeté 10 ans", value: "+ 47 %", muted: true },
          ].map((row, i) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 12,
                paddingBottom: i < 4 ? 16 : 0,
                borderBottom: i < 4 ? "1px dashed var(--border)" : "none",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: row.highlight ? "var(--foreground)" : "var(--muted-foreground)",
                  fontWeight: row.highlight ? 500 : 400,
                  maxWidth: 220,
                  lineHeight: 1.35,
                }}
              >
                {row.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: row.highlight ? 22 : 15,
                  fontWeight: row.highlight ? 600 : 500,
                  color: row.highlight
                    ? "var(--ed-accent, #0F766E)"
                    : row.muted
                    ? "var(--muted-foreground)"
                    : "var(--foreground)",
                  whiteSpace: "nowrap",
                }}
              >
                {row.value}
              </span>
            </div>
          ))}

          <p
            style={{
              margin: 0,
              fontSize: 11,
              fontStyle: "italic",
              color: "var(--muted-foreground)",
              lineHeight: 1.45,
            }}
          >
            Calcul indicatif. Les valeurs réelles dépendent du canton, des
            travaux et du financement.
          </p>
        </motion.aside>
      </div>
    </section>
  );
}

export default EditorialPitch;
