import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PWARegister } from "@/components/pwa-register";

/* Inter charge via next/font (preload + auto-self-host). Le CSS importe
   aussi Inter via Google Fonts en fallback. */
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
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "E-Dome",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-touch-fullscreen": "yes",
  },
};

/* Viewport (recommandé Next.js 16) :
   - viewportFit: "cover" : safe-area-inset (notch/home indicator)
   - maximumScale=5 + userScalable=true : zoom mobile autorise (WCAG)
   - themeColor : barre Chrome + chip PWA. Default mode CLAIR -> blanc.
     Mode sombre prefere systeme -> #0a0a0a coherent avec --background. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { color: "#ffffff" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="E-Dome" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={`${inter.variable} bg-[var(--background)] antialiased`}
      >
        {children}
        <PWARegister />
      </body>
    </html>
  );
}
