"use client";

import { motion } from "framer-motion";

const TESTIS = [
  {
    initial: "C",
    quote:
      "J'ai sourcé trois biens hors marché en quatre mois grâce aux apporteurs. Le calculateur de rendement m'a évité deux erreurs coûteuses.",
    name: "Camille Vuilleumier",
    role: "Investisseuse, Lausanne",
    metric: "Rendement net 6.8 % · Portefeuille 4 biens VD",
  },
  {
    initial: "T",
    quote:
      "Le dashboard d'occupation est ce qui me manquait. Pricing dynamique plus formations courtes ont boosté mes revenus de 28 %.",
    name: "Thomas Aebi",
    role: "Hôte, Verbier",
    metric: "92 % d'occupation · CHF 184'000 de revenus 2025",
  },
];

/* Témoignages — 2 cards éditoriaux avec drop cap (Editorial Grid pattern).
   Source Serif 4 italic pour la citation, JetBrains Mono pour la metric. */
export function Testimonials() {
  return (
    <section id="temoignages" style={{ background: "var(--muted)", padding: "112px 0" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px" }}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 720, marginBottom: 64, textAlign: "center", marginLeft: "auto", marginRight: "auto" }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--muted-foreground)",
              marginBottom: 20,
            }}
          >
            — Témoignages
          </div>
          <h2
            className="page-heading"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.022em",
              fontWeight: 500,
              margin: 0,
              color: "var(--foreground)",
            }}
          >
            Ils construisent leur patrimoine{" "}
            <em
              style={{
                fontStyle: "italic",
                color: "var(--ed-accent, #0F766E)",
                fontWeight: 500,
              }}
            >
              sur E-Dome
            </em>
            .
          </h2>
        </motion.div>

        <div
          className="ed-testi-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 32,
          }}
        >
          <style>{`
            @media (min-width: 900px) {
              .ed-testi-grid {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 40px !important;
              }
            }
          `}</style>

          {TESTIS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                margin: 0,
                padding: 40,
                background: "var(--background)",
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: 32,
                position: "relative",
              }}
            >
              <blockquote
                className="page-heading"
                style={{
                  margin: 0,
                  fontSize: "clamp(1.25rem, 1.8vw, 1.5rem)",
                  lineHeight: 1.4,
                  fontStyle: "italic",
                  color: "var(--foreground)",
                  fontWeight: 400,
                  letterSpacing: "-0.005em",
                }}
              >
                {/* Drop cap */}
                <span
                  aria-hidden
                  style={{
                    float: "left",
                    fontFamily: "var(--font-serif)",
                    fontSize: 64,
                    lineHeight: 0.85,
                    paddingRight: 12,
                    paddingTop: 6,
                    color: "var(--ed-accent, #0F766E)",
                    fontStyle: "italic",
                    fontWeight: 500,
                  }}
                >
                  {t.initial}
                </span>
                {t.quote}
              </blockquote>

              <figcaption
                style={{
                  marginTop: "auto",
                  paddingTop: 24,
                  borderTop: "1px solid var(--border)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--foreground)",
                  }}
                >
                  {t.name}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--muted-foreground)",
                  }}
                >
                  {t.role}
                </span>
                <span
                  style={{
                    marginTop: 8,
                    fontFamily: "var(--font-mono)",
                    fontSize: 11.5,
                    color: "var(--ed-accent, #0F766E)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {t.metric}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
