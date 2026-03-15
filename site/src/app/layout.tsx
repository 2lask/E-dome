import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-Dome | Écosystème Immobilier Intelligent",
  description:
    "E-Dome — la plateforme immobilière tout-en-un qui réunit marketplace, réseau social professionnel, système d'apporteurs d'affaires, services et formations dans un écosystème unifié.",
  icons: { icon: "/favicon.ico" },
  other: { "theme-color": "#111111" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#111111] text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
