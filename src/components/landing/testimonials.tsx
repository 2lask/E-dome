"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { SectionHeading } from "./personas";

const TESTIS = [
  {
    name: "Camille Vuilleumier",
    role: "Investisseuse · Lausanne",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=144&h=144&fit=crop&auto=format&q=70",
    quote:
      "J'ai pu sourcer 3 biens off-market en 4 mois grâce aux apporteurs. Le calculateur de rendement m'a évité 2 erreurs coûteuses.",
    metric: "Rendement net 6.8% · Portefeuille 4 biens VD",
    tilt: -1.2,
  },
  {
    name: "Thomas Aebi",
    role: "Hôte Airbnb · Verbier",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=144&h=144&fit=crop&auto=format&q=70",
    quote:
      "Le dashboard occupation est ce qui me manquait. Pricing dynamique + formations courtes ont boosté mes revenus de 28%.",
    metric: "92% occupation · CHF 184K revenus 2025",
    tilt: 0.8,
  },
  {
    name: "Yasmine Benali",
    role: "Apporteuse · Genève",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=144&h=144&fit=crop&auto=format&q=70",
    quote:
      "Plateforme transparente, payout mensuel sans frais cachés. Mon CRM intégré me fait gagner 6h/semaine sur les follow-ups.",
    metric: "CHF 48K commissions · 12 deals closés",
    tilt: -0.6,
  },
];

export function Testimonials() {
  return (
    <section id="temoignages" className="ld-section" style={{ position: "relative" }}>
      <div className="ld-grid-bg" style={{ opacity: 0.4 }} />

      <div className="ld-container">
        <SectionHeading
          eyebrow="Communauté"
          title={
            <>
              Ils construisent leur patrimoine{" "}
              <span className="ld-display-italic ld-grad-aurora-text">sur E-Dome.</span>
            </>
          }
          description="Témoignages d'investisseurs, hôtes et apporteurs actifs sur la plateforme."
        />

        {/* Metrics strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 24,
            margin: "48px 0",
            padding: "32px",
            borderTop: "1px solid var(--ld-border-subtle)",
            borderBottom: "1px solid var(--ld-border-subtle)",
          }}
        >
          <style>{`
            @media (min-width: 768px) {
              .ld-metrics-strip {
                grid-template-columns: repeat(4, 1fr) !important;
              }
            }
          `}</style>
          <div className="ld-metrics-strip" style={{ display: "contents" }}>
            {[
              { v: "4.7", l: "Note moyenne", sub: "sur 5 — 12K avis" },
              { v: "CHF 12M", l: "Transactions", sub: "facilitées en 2025" },
              { v: "850+", l: "Apporteurs", sub: "actifs cette semaine" },
              { v: "120+", l: "Formations", sub: "disponibles" },
            ].map((m) => (
              <div key={m.l}>
                <div
                  className="ld-mono ld-grad-title-text"
                  style={{
                    fontSize: 32,
                    fontWeight: 500,
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {m.v}
                </div>
                <div style={{ fontSize: 13, color: "var(--ld-fg-1)", fontWeight: 500 }}>
                  {m.l}
                </div>
                <div style={{ fontSize: 11, color: "var(--ld-fg-3)", marginTop: 2 }}>
                  {m.sub}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Cards inclinées */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 24,
            marginTop: 48,
          }}
        >
          <style>{`
            @media (min-width: 768px) {
              .ld-testi-grid {
                grid-template-columns: repeat(3, 1fr) !important;
              }
            }
          `}</style>
          <div className="ld-testi-grid" style={{ display: "contents" }}>
            {TESTIS.map((t, i) => (
              <motion.article
                key={t.name}
                initial={{ opacity: 0, y: 32, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: t.tilt }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ rotate: 0, y: -6 }}
                className="ld-glass"
                style={{
                  padding: 28,
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                }}
              >
                <Quote
                  size={28}
                  strokeWidth={1.4}
                  style={{
                    color: "var(--ld-gold-400)",
                    opacity: 0.7,
                  }}
                />

                <p
                  className="ld-display"
                  style={{
                    fontSize: 17,
                    lineHeight: 1.5,
                    color: "var(--ld-fg-0)",
                    margin: 0,
                    fontStyle: "italic",
                    letterSpacing: "-0.005em",
                  }}
                >
                  « {t.quote} »
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: "auto" }}>
                  <img
                    src={t.avatar}
                    alt=""
                    width={48}
                    height={48}
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 999,
                      objectFit: "cover",
                      border: "2px solid var(--ld-gold-400)",
                    }}
                  />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ld-fg-0)" }}>
                      {t.name}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--ld-fg-3)" }}>{t.role}</div>
                  </div>
                </div>

                <div
                  style={{
                    paddingTop: 16,
                    borderTop: "1px solid var(--ld-border-subtle)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 12,
                    fontFamily: "var(--ld-font-mono)",
                    color: "var(--ld-gold-300)",
                  }}
                >
                  <Star size={11} strokeWidth={2} fill="var(--ld-gold-300)" />
                  {t.metric}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
