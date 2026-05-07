import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PWARegister } from "@/components/pwa-register";
import { LoadingScreen } from "@/components/landing/loading-screen";
import { SiteBackground } from "@/components/ui/site-background";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "E-Dome - Plateforme immobilière",
  description:
    "La plateforme immobilière tout-en-un pour la gestion, l'investissement et la location de biens.",
  keywords: ["immobilier", "investissement", "location", "plateforme", "E-Dome"],
  manifest: "/manifest.json",
  themeColor: "#1e9df1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "E-Dome",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${inter.variable} bg-[var(--background)] antialiased`}
      >
        <SiteBackground />
        <LoadingScreen />
        {children}
        <PWARegister />
      </body>
    </html>
  );
}
