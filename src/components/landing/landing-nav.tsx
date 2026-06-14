"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { label: "Plateforme", href: "#piliers" },
  { label: "Démo", href: "#demo" },
  { label: "Témoignages", href: "#temoignages" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: scrolled
          ? "rgba(255,255,255,0.88)"
          : "rgba(255,255,255,0.65)",
        backdropFilter: "blur(14px) saturate(140%)",
        WebkitBackdropFilter: "blur(14px) saturate(140%)",
        borderBottom: scrolled
          ? "1px solid var(--border)"
          : "1px solid transparent",
        transition: "background 220ms ease, border-color 220ms ease",
      }}
      aria-label="Navigation principale"
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
        }}
      >
        <Link
          href="/"
          className="page-heading"
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: "var(--foreground)",
            textDecoration: "none",
            letterSpacing: "-0.01em",
          }}
        >
          E-Dome
        </Link>

        <div
          className="ed-nav-links"
          style={{ display: "none", alignItems: "center", gap: 8 }}
        >
          <style>{`
            @media (min-width: 768px) {
              .ed-nav-links { display: flex !important; }
            }
          `}</style>
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="ed-nav-link"
              style={{
                padding: "8px 14px",
                fontSize: 14,
                color: "var(--muted-foreground)",
                textDecoration: "none",
                borderRadius: 999,
                transition: "color 180ms ease, background 180ms ease",
              }}
            >
              {l.label}
            </a>
          ))}
        </div>

        <Link href="/feed" className="ed-cta-primary-sm" style={{ textDecoration: "none" }}>
          Ouvrir la démo
        </Link>
      </div>
    </nav>
  );
}

export default LandingNav;
