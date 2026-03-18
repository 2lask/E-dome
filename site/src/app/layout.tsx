import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "E-Dome — L'écosystème immobilier international",
  description: "Marketplace, réseau social, apporteurs d'affaires, formations et services réunis pour la première fois.",
  openGraph: {
    title: "E-Dome — L'écosystème immobilier international",
    description: "Marketplace, réseau social, apporteurs d'affaires, formations et services réunis.",
    url: "https://2lask.github.io/E-dome/",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} antialiased`}>
      <body className="bg-[#080808] text-white overflow-x-hidden">{children}</body>
    </html>
  );
}
