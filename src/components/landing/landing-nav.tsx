"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { label: "Produit", href: "#produit" },
  { label: "Solutions", href: "#personas" },
  { label: "Comparatif", href: "#comparatif" },
  { label: "Témoignages", href: "#temoignages" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className="ld-nav"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: scrolled ? "rgba(10,10,10,0.85)" : "rgba(10,10,10,0.6)",
      }}
    >
      <Link
        href="/"
        className="ld-display"
        style={{
          fontSize: 17,
          fontWeight: 500,
          letterSpacing: "0.02em",
          color: "var(--ld-fg-0)",
          padding: "4px 10px 4px 0",
          textDecoration: "none",
        }}
      >
        E-Dome
      </Link>

      <div
        className="hidden md:flex"
        style={{ alignItems: "center", gap: 4, paddingLeft: 8 }}
      >
        {NAV_LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            style={{
              padding: "8px 14px",
              fontSize: 13.5,
              color: "var(--ld-fg-2)",
              borderRadius: 999,
              textDecoration: "none",
              transition: "color 180ms ease, background 180ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--ld-fg-0)";
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--ld-fg-2)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            {l.label}
          </a>
        ))}
      </div>

      <Link
        href="/feed"
        style={{
          padding: "8px 16px",
          fontSize: 13,
          fontWeight: 600,
          color: "var(--ld-cta-text)",
          background: "var(--ld-grad-aurora)",
          borderRadius: 999,
          textDecoration: "none",
          marginLeft: 4,
          transition: "filter 180ms ease, transform 180ms ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.filter = "brightness(1.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.filter = "brightness(1)";
        }}
      >
        Ouvrir la démo
      </Link>
    </motion.nav>
  );
}

export default LandingNav;
