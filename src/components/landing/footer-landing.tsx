import Link from "next/link";

const COLS = [
  {
    label: "Produit",
    links: [
      { label: "Explorer", href: "/explorer" },
      { label: "Feed", href: "/feed" },
      { label: "Formations", href: "/formations" },
      { label: "Événements", href: "/evenements" },
    ],
  },
  {
    label: "Rôles",
    links: [
      { label: "Investisseurs", href: "/investisseurs" },
      { label: "Hôtes", href: "/dashboard" },
      { label: "Apporteurs", href: "/apporteurs" },
      { label: "Formateurs", href: "/formations/creer" },
    ],
  },
  {
    label: "Légal",
    links: [
      { label: "Conditions", href: "/conditions" },
      { label: "Confidentialité", href: "/confidentialite" },
      { label: "Contact", href: "/contact" },
      { label: "Aide", href: "/aide" },
    ],
  },
];

export function FooterLanding() {
  return (
    <footer
      style={{
        background: "var(--background)",
        borderTop: "1px solid var(--border)",
        padding: "64px 24px 32px",
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div
          className="ed-footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 40,
            paddingBottom: 48,
            borderBottom: "1px solid var(--border)",
          }}
        >
          <style>{`
            @media (min-width: 768px) {
              .ed-footer-grid {
                grid-template-columns: 1.6fr repeat(3, 1fr) !important;
                gap: 48px !important;
              }
            }
          `}</style>

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="page-heading"
              style={{
                fontSize: 24,
                fontWeight: 500,
                color: "var(--foreground)",
                textDecoration: "none",
                letterSpacing: "-0.01em",
                display: "inline-block",
                marginBottom: 14,
              }}
            >
              E-Dome
            </Link>
            <p
              style={{
                fontSize: 13.5,
                lineHeight: 1.55,
                color: "var(--muted-foreground)",
                maxWidth: 320,
                margin: 0,
              }}
            >
              L'écosystème immobilier suisse qui réunit investisseurs, hôtes,
              apporteurs et formateurs. Lausanne, 2026.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.label}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--muted-foreground)",
                  marginBottom: 18,
                }}
              >
                {col.label}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="ed-footer-link"
                      style={{
                        fontSize: 13.5,
                        color: "var(--muted-foreground)",
                        textDecoration: "none",
                        transition: "color 180ms ease",
                      }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            paddingTop: 28,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 12,
            fontSize: 11.5,
            fontFamily: "var(--font-mono)",
            color: "var(--muted-foreground)",
            letterSpacing: "0.04em",
          }}
        >
          <span>© 2026 E-Dome SA — Lausanne, Suisse</span>
          <span>v1.0 · Maquette de démonstration</span>
        </div>
      </div>
    </footer>
  );
}

export default FooterLanding;
