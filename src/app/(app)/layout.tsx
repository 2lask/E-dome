import React from "react";
import { AppShell } from "@/components/layout/app-shell";

/* ── Layout du groupe (app) — SERVER COMPONENT ───────────────────────────────

   Ne pas ajouter "use client" ici. Ce fichier est le layout racine des 48
   routes de `(app)/` : y poser une directive client les rendrait toutes
   client-only, ce qui interdirait le data fetching serveur, les Server
   Actions et `generateMetadata` sur l'ensemble de l'application.

   Toute la chrome interactive (providers d'état, drawer mobile, conditions
   dérivées du pathname) vit dans `AppShell`, qui est le composant client.
   `children` traverse cette frontière en restant rendu côté serveur : chaque
   page peut donc être un Server Component indépendamment de la chrome.

   Pour ajouter un comportement interactif global, l'ajouter dans
   `components/layout/app-shell.tsx`, pas ici. */

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
