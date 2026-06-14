"use client";

import { motion } from "framer-motion";

const CITIES = ["Lausanne", "Genève", "Zürich", "Bâle", "Bern"];
const CERTS = ["USPI", "Brevet Fédéral", "CFA", "Minergie"];

export function TrustStrip() {
  return (
    <section
      style={{
        background: "var(--background)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6 }}
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "32px 24px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          rowGap: 16,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          letterSpacing: "0.04em",
          color: "var(--muted-foreground)",
          textAlign: "center",
        }}
      >
        <span
          style={{
            textTransform: "uppercase",
            fontSize: 10.5,
            letterSpacing: "0.18em",
            color: "var(--foreground)",
            opacity: 0.6,
          }}
        >
          Présent dans
        </span>
        {CITIES.map((c, i) => (
          <span key={c} style={{ display: "inline-flex", alignItems: "center", gap: 18 }}>
            <span style={{ color: "var(--foreground)" }}>{c}</span>
            {i < CITIES.length - 1 && (
              <span aria-hidden style={{ opacity: 0.3 }}>·</span>
            )}
          </span>
        ))}
        <span aria-hidden style={{ opacity: 0.3, margin: "0 8px" }}>|</span>
        <span
          style={{
            textTransform: "uppercase",
            fontSize: 10.5,
            letterSpacing: "0.18em",
            color: "var(--foreground)",
            opacity: 0.6,
          }}
        >
          Certifié
        </span>
        {CERTS.map((c, i) => (
          <span key={c} style={{ display: "inline-flex", alignItems: "center", gap: 18 }}>
            <span style={{ color: "var(--foreground)" }}>{c}</span>
            {i < CERTS.length - 1 && (
              <span aria-hidden style={{ opacity: 0.3 }}>·</span>
            )}
          </span>
        ))}
      </motion.div>
    </section>
  );
}

export default TrustStrip;
