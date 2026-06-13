"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Handshake, Phone, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export function CtaFinal() {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  const fireConfetti = (e: React.MouseEvent) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    const origin = rect
      ? {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        }
      : { x: 0.5, y: 0.5 };
    confetti({
      particleCount: 90,
      spread: 75,
      startVelocity: 32,
      origin,
      colors: ["#fdf4d8", "#e9c665", "#b58721", "#ffffff"],
      gravity: 0.85,
      ticks: 180,
      zIndex: 1000,
      scalar: 0.9,
    });
  };

  return (
    <section
      className="ld-section"
      style={{
        position: "relative",
        overflow: "hidden",
        paddingTop: 128,
        paddingBottom: 128,
        background:
          "radial-gradient(ellipse at center top, rgba(233,198,101,0.12) 0%, transparent 60%), var(--ld-bg-0)",
      }}
    >
      {/* Layered glows */}
      <div
        className="ld-glow-spot ld-glow-gold"
        style={{ width: 800, height: 800, top: -150, left: "50%", transform: "translateX(-50%)" }}
      />
      <div className="ld-grid-bg" style={{ opacity: 0.5 }} />

      <div
        className="ld-container"
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          maxWidth: 880,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 28 }}
        >
          <span className="ld-pill" style={{ background: "rgba(233,198,101,0.1)" }}>
            <span className="ld-pill-dot ld-pulse-dot" />
            <span style={{ color: "var(--ld-gold-300)" }}>Inscription gratuite · Sans carte bancaire</span>
          </span>
        </motion.div>

        <motion.h2
          className="ld-display"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            lineHeight: 1.0,
            letterSpacing: "-0.028em",
            margin: 0,
            marginBottom: 24,
          }}
        >
          <span className="ld-grad-aurora-text">Le futur de l'immobilier suisse</span>
          <br />
          <span className="ld-display-italic ld-grad-title-text">commence ici.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            fontSize: 18,
            lineHeight: 1.55,
            color: "var(--ld-fg-2)",
            maxWidth: 560,
            margin: "0 auto 44px auto",
          }}
        >
          Trois minutes pour configurer votre profil. Une seule plateforme pour tout le reste.
        </motion.p>

        {/* CTA stack */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.35 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <Link
            ref={buttonRef}
            href="/auth/inscription"
            className="ld-cta-primary"
            onClick={fireConfetti}
            style={{ textDecoration: "none", fontSize: 16, padding: "16px 32px" }}
          >
            <Sparkles size={18} strokeWidth={2} />
            Créer mon compte
            <ArrowRight size={18} strokeWidth={2} />
          </Link>

          <Link
            href="/apporteurs"
            className="ld-cta-ghost"
            style={{ textDecoration: "none", fontSize: 15, padding: "15px 28px" }}
          >
            <Handshake size={16} strokeWidth={2} />
            Rejoindre les apporteurs
          </Link>

          <Link
            href="/contact"
            className="ld-cta-ghost"
            style={{
              textDecoration: "none",
              fontSize: 15,
              padding: "15px 28px",
              background: "transparent",
            }}
          >
            <Phone size={16} strokeWidth={2} />
            Demander une démo
          </Link>
        </motion.div>

        {/* Trust line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.55 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 28,
            fontSize: 12,
            fontFamily: "var(--ld-font-mono)",
            color: "var(--ld-fg-3)",
            letterSpacing: "0.04em",
          }}
        >
          <span>✓ Gratuit pour toujours</span>
          <span>✓ Données hébergées en Suisse</span>
          <span>✓ Conforme RGPD & LPD</span>
        </motion.div>
      </div>
    </section>
  );
}

export default CtaFinal;
