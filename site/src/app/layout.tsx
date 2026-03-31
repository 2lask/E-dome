import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "E-Dome — L'écosystème immobilier",
  description: "E-Dome est la première plateforme immobilière internationale réunissant marketplace, réseau social, apporteurs d'affaires, formations et services professionnels en un seul écosystème.",
  openGraph: {
    title: "E-Dome — L'écosystème immobilier",
    description: "Marketplace, réseau social, apporteurs d'affaires, formations et services réunis pour chaque acteur de l'immobilier.",
    url: "https://www.edome.world/",
    type: "website",
    siteName: "E-Dome",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} antialiased`}>
      <body className="bg-[var(--bg)] text-[var(--fg)] overflow-x-hidden">{children}</body>
    </html>
  );
}
