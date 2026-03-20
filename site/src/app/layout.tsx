import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "E-Dome — L'écosystème immobilier international",
  description: "E-Dome est la première plateforme immobilière internationale réunissant marketplace, réseau social, apporteurs d'affaires, formations et services professionnels en un seul écosystème.",
  openGraph: {
    title: "E-Dome — L'écosystème immobilier international",
    description: "E-Dome est la première plateforme immobilière internationale réunissant marketplace, réseau social, apporteurs d'affaires, formations et services professionnels en un seul écosystème.",
    url: "https://www.edome.world/",
    type: "website",
    siteName: "E-Dome",
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Dome — L'écosystème immobilier international",
    description: "Marketplace, réseau social, apporteurs d'affaires, formations et services réunis pour chaque acteur de l'immobilier.",
  },
  alternates: {
    canonical: "https://www.edome.world/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} antialiased`}>
      <body className="bg-[#080808] text-white overflow-x-hidden">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#C4956A] focus:text-[#080808] focus:rounded">
          Aller au contenu principal
        </a>
        {children}
      </body>
    </html>
  );
}
