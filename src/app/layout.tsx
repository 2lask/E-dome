import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { PWARegister } from "@/components/pwa-register";

const inter = Plus_Jakarta_Sans({
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
    statusBarStyle: "black-translucent",
    title: "E-Dome",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-touch-fullscreen": "yes",
  },
};

/* Viewport séparé (recommandé Next.js 16) :
   - viewportFit: "cover" : le contenu peut s'étendre sous notch / home
     indicator (on a déjà env(safe-area-inset-*) partout)
   - userScalable: false + maximumScale 1 : annule le double-tap zoom
     iOS (qui zoom et casse le feel app)
   - themeColor : couleur de la barre Chrome Android + chip "ajouter à
     l'écran d'accueil". #000 par défaut (dark mode), #1e9df1 quand PWA
     standalone (status bar tinted) */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { color: "#000000" },
  ],
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
