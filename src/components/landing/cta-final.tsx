"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* CTA final — Exaggerated Minimalism : oversized statement centered.
   Single CTA focus, massive whitespace (recommandation ui-ux-pro-max). */

export function CtaFinal() {
  return (
    <section
      style={{
        background: "var(--background)",
        padding: "144px 24px",
        textAlign: "center",
        borderTop: "1px solid var(--border)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ maxWidth: 980, margin: "0 auto" }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--muted-foreground)",
            marginBottom: 32,
          }}
        >
          — Démarrer
        </div>

        <h2
          className="page-heading"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 6.5rem)",
            lineHeight: 1.0,
            letterSpacing: "-0.032em",
            fontWeight: 500,
            margin: 0,
            marginBottom: 36,
            color: "var(--foreground)",
          }}
        >
          Une seule plateforme,{" "}
          <em
            style={{
              fontStyle: "italic",
              color: "var(--ed-accent, #0F766E)",
              fontWeight: 500,
            }}
          >
            quatre rôles
          </em>
          .
        </h2>

        <p
          style={{
            fontSize: "clamp(1rem, 1.6vw, 1.25rem)",
            lineHeight: 1.55,
            color: "var(--muted-foreground)",
            maxWidth: 560,
            margin: "0 auto 44px",
          }}
        >
          Trois minutes pour configurer votre profil. Aucune carte requise.
          Vous repartez si ça ne vous parle pas.
        </p>

        <Link
          href="/feed"
          className="ed-cta-primary"
          style={{
            textDecoration: "none",
            padding: "16px 32px",
            fontSize: 15.5,
          }}
        >
          Ouvrir la démo maintenant
          <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
        </Link>

        <p
          style={{
            marginTop: 32,
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            color: "var(--muted-foreground)",
            letterSpacing: "0.04em",
          }}
        >
          Données hébergées en Suisse · Conforme LPD / RGPD
        </p>
      </motion.div>
    </section>
  );
}

export default CtaFinal;
