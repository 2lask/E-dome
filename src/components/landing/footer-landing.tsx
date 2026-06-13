"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const COLS = [
  {
    label: "Produit",
    links: [
      { label: "Explorer", href: "/explorer" },
      { label: "Feed", href: "/feed" },
      { label: "Formations", href: "/formations" },
      { label: "Live", href: "/live" },
      { label: "Événements", href: "/evenements" },
    ],
  },
  {
    label: "Solutions",
    links: [
      { label: "Investisseurs", href: "/investisseurs" },
      { label: "Hôtes", href: "/feed" },
      { label: "Apporteurs", href: "/apporteurs" },
      { label: "Promoteurs", href: "/contact" },
      { label: "Formateurs", href: "/formations/creer" },
    ],
  },
  {
    label: "Entreprise",
    links: [
      { label: "À propos", href: "/contact" },
      { label: "Carrières", href: "/contact" },
      { label: "Presse", href: "/contact" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    label: "Légal",
    links: [
      { label: "Conditions générales", href: "/conditions" },
      { label: "Confidentialité", href: "/confidentialite" },
      { label: "Cookies", href: "/confidentialite" },
      { label: "Mentions légales", href: "/conditions" },
    ],
  },
];

export function FooterLanding() {
  return (
    <footer
      style={{
        position: "relative",
        background: "var(--ld-bg-1)",
        borderTop: "1px solid var(--ld-border-subtle)",
        paddingTop: 80,
        paddingBottom: 32,
      }}
    >
      <div className="ld-container">
        {/* Top : brand + cols */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 48,
            paddingBottom: 56,
            borderBottom: "1px solid var(--ld-border-subtle)",
          }}
        >
          <style>{`
            @media (min-width: 768px) {
              .ld-footer-grid {
                grid-template-columns: 1.4fr repeat(4, 1fr) !important;
                gap: 48px !important;
              }
            }
          `}</style>
          <div className="ld-footer-grid" style={{ display: "contents" }}>
            {/* Brand */}
            <div>
              <Link
                href="/"
                className="ld-display"
                style={{
                  fontSize: 26,
                  fontWeight: 400,
                  color: "var(--ld-gold-300)",
                  textDecoration: "none",
                  display: "inline-block",
                  marginBottom: 12,
                }}
              >
                E-Dome
              </Link>
              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: "var(--ld-fg-2)",
                  maxWidth: 280,
                  margin: 0,
                  marginBottom: 24,
                }}
              >
                L'écosystème immobilier qui réunit investisseurs, hôtes, apporteurs et formateurs.
              </p>

              {/* Newsletter */}
              <form
                onSubmit={(e) => e.preventDefault()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0,
                  maxWidth: 320,
                  padding: 4,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--ld-border-subtle)",
                  borderRadius: 999,
                }}
              >
                <input
                  type="email"
                  placeholder="votre@email.com"
                  style={{
                    flex: 1,
                    padding: "8px 14px",
                    background: "transparent",
                    border: "none",
                    color: "var(--ld-fg-0)",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "8px 16px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--ld-cta-text)",
                    background: "var(--ld-grad-aurora)",
                    border: "none",
                    borderRadius: 999,
                    cursor: "pointer",
                  }}
                >
                  S'abonner
                </button>
              </form>

              {/* Lang/currency */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 24,
                  flexWrap: "wrap",
                }}
              >
                <SelectorPill>FR · CHF</SelectorPill>
                <SelectorPill>Lausanne · Suisse</SelectorPill>
              </div>
            </div>

            {/* Cols */}
            {COLS.map((col) => (
              <div key={col.label}>
                <div
                  className="ld-eyebrow"
                  style={{ color: "var(--ld-fg-2)", marginBottom: 16 }}
                >
                  {col.label}
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map((l) => (
                    <li key={l.href + l.label}>
                      <Link
                        href={l.href}
                        style={{
                          fontSize: 13.5,
                          color: "var(--ld-fg-2)",
                          textDecoration: "none",
                          transition: "color 180ms ease",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ld-fg-0)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ld-fg-2)"; }}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            paddingTop: 32,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 16,
            fontSize: 12,
            color: "var(--ld-fg-3)",
            fontFamily: "var(--ld-font-mono)",
          }}
        >
          <div>© 2026 E-Dome SA · Lausanne, Suisse</div>
          <div style={{ display: "flex", gap: 18 }}>
            <span>🇨🇭 Made in Switzerland</span>
            <span>v1.0 · Maquette de démonstration</span>
          </div>
        </div>

        {/* Big logotype background */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.06 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5 }}
          aria-hidden
          className="ld-display"
          style={{
            marginTop: 48,
            fontSize: "clamp(5rem, 18vw, 16rem)",
            fontWeight: 400,
            color: "var(--ld-gold-400)",
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            textAlign: "center",
            background: "linear-gradient(180deg, var(--ld-gold-400) 0%, transparent 80%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          E-DOME
        </motion.div>
      </div>
    </footer>
  );
}

function SelectorPill({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 12px",
        fontSize: 11,
        color: "var(--ld-fg-2)",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid var(--ld-border-subtle)",
        borderRadius: 999,
        fontFamily: "var(--ld-font-mono)",
        letterSpacing: "0.04em",
      }}
    >
      {children}
    </span>
  );
}

export default FooterLanding;
