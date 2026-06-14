"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Home, Handshake, ArrowUpRight } from "lucide-react";

const PILLARS = [
  {
    label: "01",
    title: "Investisseurs",
    description:
      "Filtres avancés, rendement net automatisé, accès aux biens hors marché via le réseau d'apporteurs.",
    href: "/explorer",
    icon: TrendingUp,
  },
  {
    label: "02",
    title: "Hôtes",
    description:
      "Pricing dynamique, dashboard d'occupation, calendrier multi-plateformes et formations marketing intégrées.",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "03",
    title: "Apporteurs",
    description:
      "Commission jusqu'à 15 % sur les referrals qualifiés. Paiement mensuel transparent, CRM intégré.",
    href: "/apporteurs",
    icon: Handshake,
  },
];

export function Pillars() {
  return (
    <section id="piliers" style={{ background: "var(--muted)", padding: "112px 0" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px" }}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ maxWidth: 720, marginBottom: 64 }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--muted-foreground)",
              marginBottom: 20,
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
            Trois rôles, une plateforme
          </div>
          <h2
            className="page-heading"
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.022em",
              fontWeight: 500,
              margin: 0,
              color: "var(--foreground)",
            }}
          >
            Conçu pour ceux qui{" "}
            <em
              style={{
                fontStyle: "italic",
                color: "var(--ed-accent, #0F766E)",
                fontWeight: 500,
              }}
            >
              construisent
            </em>{" "}
            le marché.
          </h2>
        </motion.div>

        {/* Pillar cards */}
        <div
          className="ed-pillars-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 24,
          }}
        >
          <style>{`
            @media (min-width: 768px) {
              .ed-pillars-grid {
                grid-template-columns: repeat(3, 1fr) !important;
              }
            }
          `}</style>

          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.article
                key={p.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={p.href}
                  className="ed-pillar-card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 24,
                    padding: 32,
                    minHeight: 320,
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    textDecoration: "none",
                    color: "inherit",
                    height: "100%",
                  }}
                >
                  <header
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        letterSpacing: "0.16em",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      {p.label}
                    </span>
                    <Icon
                      size={20}
                      strokeWidth={1.6}
                      color="var(--ed-accent, #0F766E)"
                      aria-hidden="true"
                    />
                  </header>

                  <h3
                    className="page-heading"
                    style={{
                      fontSize: 30,
                      fontWeight: 500,
                      lineHeight: 1.1,
                      letterSpacing: "-0.018em",
                      margin: 0,
                      color: "var(--foreground)",
                    }}
                  >
                    {p.title}
                  </h3>

                  <p
                    style={{
                      flex: 1,
                      fontSize: 14.5,
                      lineHeight: 1.55,
                      color: "var(--muted-foreground)",
                      margin: 0,
                    }}
                  >
                    {p.description}
                  </p>

                  <footer
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--foreground)",
                      paddingTop: 16,
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    Explorer
                    <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
                  </footer>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Pillars;
