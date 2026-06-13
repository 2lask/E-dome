import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./landing.css";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://e-dome.ch";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "E-Dome — L'écosystème immobilier suisse, repensé",
  description:
    "Investissez, hébergez, apportez, formez. E-Dome réunit tout l'immobilier — du listing au closing — avec analyse financière intégrée, réseau d'apporteurs et formations.",
  applicationName: "E-Dome",
  keywords: [
    "immobilier suisse",
    "investissement immobilier",
    "rendement net",
    "off-market",
    "apporteurs immobilier",
    "formations immobilier",
    "courte durée",
    "Lausanne",
    "Genève",
  ],
  authors: [{ name: "E-Dome SA" }],
  alternates: {
    canonical: "/",
    languages: { "fr-CH": "/" },
  },
  openGraph: {
    title: "E-Dome — L'écosystème immobilier suisse",
    description:
      "Plateforme tout-en-un : investissement, location, gestion, formations et réseau d'apporteurs. Données fiscales cantonales 2026.",
    url: BASE_URL,
    siteName: "E-Dome",
    type: "website",
    locale: "fr_CH",
    images: [
      {
        url: "/images/og-landing.png",
        width: 1200,
        height: 630,
        alt: "E-Dome — L'écosystème immobilier suisse",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Dome — L'écosystème immobilier suisse",
    description:
      "Investissez, hébergez, apportez, formez. Une seule plateforme, quatre rôles.",
    images: ["/images/og-landing.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "real estate",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "E-Dome SA",
      url: BASE_URL,
      logo: `${BASE_URL}/images/logo.png`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lausanne",
        addressCountry: "CH",
      },
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "E-Dome",
      description:
        "Écosystème immobilier suisse : investisseurs, hôtes, apporteurs et formateurs.",
      inLanguage: "fr-CH",
      publisher: { "@id": `${BASE_URL}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      name: "E-Dome",
      applicationCategory: "RealEstateApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "CHF",
      },
    },
  ],
};

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="landing-root">
      <a href="#main" className="landing-skip-link">
        Aller au contenu
      </a>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      {children}
    </div>
  );
}
