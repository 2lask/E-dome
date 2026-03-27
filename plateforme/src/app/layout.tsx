import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "E-Dome — Plateforme Immobilière",
    template: "%s | E-Dome"
  },
  description: "E-Dome est la première plateforme immobilière internationale réunissant marketplace, réseau social, apporteurs d'affaires, formations et services professionnels.",
  keywords: ["immobilier", "marketplace", "réseau social", "apporteurs", "formations", "investissement", "location", "vente"],
  authors: [{ name: "E-Dome" }],
  openGraph: {
    title: "E-Dome — Plateforme Immobilière",
    description: "Marketplace, réseau social, apporteurs d'affaires, formations et services réunis.",
    type: "website",
    locale: "fr_CH",
    siteName: "E-Dome",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="bg-[var(--background)] text-[var(--foreground)] antialiased">{children}</body>
    </html>
  );
}
