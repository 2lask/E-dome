"use client";

import { motion } from "framer-motion";

const ITEMS = [
  { label: "CHF · Franc suisse", type: "currency" },
  { label: "EUR · Euro", type: "currency" },
  { label: "AED · Dirham", type: "currency" },
  { label: "MAD · Dirham marocain", type: "currency" },
  { label: "USPI", type: "cert" },
  { label: "Brevet Fédéral", type: "cert" },
  { label: "Minergie", type: "cert" },
  { label: "CFA Institute", type: "cert" },
  { label: "🇨🇭 Suisse", type: "country" },
  { label: "🇲🇦 Maroc", type: "country" },
  { label: "🇦🇪 Émirats", type: "country" },
  { label: "🇵🇹 Portugal", type: "country" },
  { label: "🇬🇷 Grèce", type: "country" },
  { label: "🇪🇸 Espagne", type: "country" },
  { label: "🇹🇭 Thaïlande", type: "country" },
];

export function TrustStrip() {
  return (
    <section
      style={{
        position: "relative",
        paddingTop: 48,
        paddingBottom: 48,
        background: "var(--ld-bg-1)",
        borderTop: "1px solid var(--ld-border-subtle)",
        borderBottom: "1px solid var(--ld-border-subtle)",
        overflow: "hidden",
      }}
    >
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: "center",
          fontSize: 12,
          fontFamily: "var(--ld-font-mono)",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--ld-fg-3)",
          marginBottom: 28,
        }}
      >
        Pensé pour les investisseurs sérieux · Construit pour la communauté
      </motion.p>

      <div
        role="region"
        aria-label="Devises, certifications et marchés couverts"
        style={{
          position: "relative",
          width: "100%",
          maskImage:
            "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      >
        <div
          className="ld-marquee-track"
          style={{
            display: "flex",
            gap: 40,
            width: "max-content",
            animation: "ld-marquee 50s linear infinite",
          }}
        >
          {[...ITEMS, ...ITEMS].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 18px",
                fontSize: 13,
                fontWeight: 500,
                color: item.type === "cert" ? "var(--ld-gold-300)" : "var(--ld-fg-1)",
                background: "rgba(255,255,255,0.025)",
                border: "1px solid var(--ld-border-subtle)",
                borderRadius: 999,
                whiteSpace: "nowrap",
                fontFamily:
                  item.type === "currency" ? "var(--ld-font-mono)" : "var(--ld-font-sans)",
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustStrip;
