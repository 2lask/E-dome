import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} bg-[var(--background)] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
