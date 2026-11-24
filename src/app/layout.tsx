import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PWARegister } from "@/components/pwa-register";
import { AnalyticsScripts } from "@/components/analytics/analytics-scripts";

/* Une seule famille (REBUILD.md §4) : Geist pour l'interface, Geist Mono pour
   les montants et références. Auto-hébergées par next/font : aucune requête
   bloquante vers un service tiers, pas de texte invisible au chargement. */
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

/* Adresse absolue des aperçus partagés (og:image) : le domaine public en
   production, l'URL du déploiement sur un aperçu Vercel, localhost sinon. */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3002");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "E-Dome — le réseau immobilier où ton réseau te rapporte",
    template: "%s · E-Dome",
  },
  description:
    "Vendez ou louez sans agence, recommandé par tout un réseau. Liens d'apporteurs tracés, suivi en temps réel, commission calculée à la vente. Le réseau immobilier suisse, transparent.",
  keywords: ["immobilier", "apport d'affaires", "vendre sans agence", "prime", "Suisse romande", "E-Dome"],
  manifest: "/manifest.json",
  /* Aucune clé `icons` ici, et aucune balise écrite à la main dans un `<head>` :
     c'est volontaire. Next 16 émet lui-même `<link rel="icon">` et
     `<link rel="apple-touch-icon">`, avec les bons `type` et `sizes`, à partir
     des fichiers `src/app/icon.svg` et `src/app/apple-icon.png`
     (`node_modules/next/dist/docs/.../01-metadata/app-icons.md`).

     C'est la leçon d'`appleWebApp`, appliquée : déclarer à la main ce que Next
     produit déjà donne des doublons dans le HTML. Les icônes du manifeste,
     elles, restent listées dans `public/manifest.json` — ce fichier est servi
     tel quel et Next n'y touche pas. Toutes sont produites par
     `npm run icons` depuis `public/icons/icon.svg`. */
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
    { media: "(prefers-color-scheme: dark)", color: "#12110e" },
    { color: "#faf9f6" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[var(--background)] antialiased`}
      >
        {children}
        <PWARegister />
        {/* Ne rend rien tant qu'aucune variable de mesure n'est definie. */}
        <AnalyticsScripts />
      </body>
    </html>
  );
}
