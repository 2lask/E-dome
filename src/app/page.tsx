import type { Metadata } from "next";
import { LandingNav } from "@/components/landing/landing-nav";
import { Hero } from "@/components/landing/hero";
import { TrustStrip } from "@/components/landing/trust-strip";
import { EditorialPitch } from "@/components/landing/editorial-pitch";
import { Pillars } from "@/components/landing/pillars";
import { Showcase } from "@/components/landing/showcase";
import { Testimonials } from "@/components/landing/testimonials";
import { CtaFinal } from "@/components/landing/cta-final";
import { FooterLanding } from "@/components/landing/footer-landing";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://e-dome.ch";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "E-Dome — L'immobilier suisse, repensé",
  description:
    "Une seule plateforme pour les investisseurs, hôtes et apporteurs. Rendement net calculé, deals de gré à gré, formations et communauté — de l'annonce à l'acte notarié.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "E-Dome — L'immobilier suisse, repensé",
    description:
      "Investisseurs, hôtes, apporteurs : une seule plateforme pour tout l'immobilier suisse.",
    url: BASE_URL,
    siteName: "E-Dome",
    type: "website",
    locale: "fr_CH",
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Dome",
    description:
      "Investisseurs, hôtes, apporteurs : une seule plateforme pour tout l'immobilier suisse.",
  },
};

export default function LandingPage() {
  return (
    <>
      <a href="#main" className="ed-skip-link">
        Aller au contenu
      </a>
      <LandingNav />
      <main id="main" tabIndex={-1} style={{ outline: "none" }}>
        <Hero />
        <TrustStrip />
        <EditorialPitch />
        <Pillars />
        <Showcase />
        <Testimonials />
        <CtaFinal />
      </main>
      <FooterLanding />

      {/* Skip-link discret en bas */}
      <style>{`
        .ed-skip-link {
          position: absolute;
          left: 16px;
          top: -48px;
          padding: 10px 16px;
          background: var(--ed-accent);
          color: #ffffff;
          font-size: 13px;
          font-weight: 500;
          border-radius: 8px;
          text-decoration: none;
          z-index: 999;
          transition: top 200ms ease;
        }
        .ed-skip-link:focus {
          top: 16px;
        }
      `}</style>
    </>
  );
}
