import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { getCurrentUser } from "@/lib/supabase/current-user";

/* ── Layout du groupe (app) — SERVER COMPONENT ───────────────────────────────

   Ne pas ajouter "use client" ici. Ce fichier est le layout racine des routes
   de `(app)/` : y poser une directive client les rendrait toutes client-only.

   Rôle (chantier C3) : lire la personne connectée côté serveur
   (`getCurrentUser()`, via les cookies) et la faire descendre dans l'app via
   `AppShell`. En mode démo / visiteur anonyme, c'est `null` et l'app garde son
   comportement (système de personnes). Aucune régression. */

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();
  return <AppShell currentUser={currentUser}>{children}</AppShell>;
}
