import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PWARegister } from "@/components/pwa-register";
import { AnalyticsScripts } from "@/components/analytics/analytics-scripts";

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
  /* `appleWebApp` est l'API courante de Next 16, pas une dépréciation —
     l'audit s'était trompé sur ce point. L'avertissement « Use appleWebApp
     instead » du build venait d'une TRIPLE déclaration : cet objet, le bloc
     `other` ci-dessous, et quatre balises écrites à la main dans le `<head>`.
     Next émet lui-même `apple-mobile-web-app-capable`, `-status-bar-style` et
     `-title` à partir d'ici ; les balises manuelles faisaient doublon. */
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "E-Dome",
  },
  /* Le bloc `other` a disparu entièrement, et ses deux clés pour des raisons
     différentes — vérifiées dans les sources de Next plutôt que supposées.

     `apple-touch-fullscreen` déclenchait l'avertissement « Use appleWebApp
     instead » à chaque build : `resolve-metadata.js` teste nommément cette clé
     dans `metadata.other`. Elle est obsolète.

     `mobile-web-app-capable` était un doublon exact. `metadata.js` ligne 561
     montre que c'est précisément cette balise — sans préfixe `apple-` — que
     Next émet à partir de `appleWebApp.capable`. La déclarer aussi dans
     `other` la produisait deux fois dans le HTML. */
  formatDetection: { telephone: false },
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
        {/* TODO — lien cassé, en attente d'arbitrage.
            `public/icons/` ne contient qu'un seul fichier, littéralement nommé
            `icon-${size}x${size}.svg` : un gabarit de chaîne écrit sur le
            disque. Aucune des huit tailles déclarées au manifeste n'existe.
            Ce lien est donc en 404, comme les onze entrées de manifest.json.
            Corriger le lien sans corriger le manifeste reviendrait à remplacer
            un lien cassé par un autre — voir compte rendu. */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
      </head>
      <body
        className={`${inter.variable} bg-[var(--background)] antialiased`}
      >
        {children}
        <PWARegister />
        {/* Ne rend rien tant qu'aucune variable de mesure n'est definie. */}
        <AnalyticsScripts />
      </body>
    </html>
  );
}
