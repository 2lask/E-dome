import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Projet E-Dome — L'écosystème immobilier international",
  description: "Marketplace, réseau social, apporteurs d'affaires, formations et services réunis pour la première fois dans un seul écosystème immobilier mondial.",
  openGraph: {
    title: "Projet E-Dome — L'écosystème immobilier international",
    description: "Le premier écosystème unifié pour l'immobilier mondial.",
    url: "https://2lask.github.io/E-dome/",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
