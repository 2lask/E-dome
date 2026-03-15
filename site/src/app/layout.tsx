import type { Metadata } from "next";
import { Inter, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./architectural-bg.css";
import { LenisProvider } from "@/components/ui/lenis-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "E-Dome | \u00c9cosyst\u00e8me Immobilier Intelligent",
  description:
    "E-Dome \u2014 la plateforme immobili\u00e8re tout-en-un qui r\u00e9unit marketplace, r\u00e9seau social professionnel, syst\u00e8me d\u2019apporteurs d\u2019affaires, services et formations dans un \u00e9cosyst\u00e8me unifi\u00e9.",
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
        className={`${inter.variable} ${dmSans.variable} ${jetbrainsMono.variable} bg-[#111111] text-white antialiased`}
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
