import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { countMyPendingDemandes } from "@/lib/supabase/demande-actions";

/* ── Layout du groupe (app) — SERVER COMPONENT ───────────────────────────────

   Ne pas ajouter "use client" ici : les pages de `(app)/` resteraient toutes
   client-only.

   Rôle : lire la personne connectée côté serveur (cookies) et les compteurs
   RÉELS de la navigation, puis les passer à la coquille. Visiteur → `null` :
   la coquille montre l'expérience visiteur (REBUILD.md §3.3), jamais un compte
   fictif. */

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();
  const demandes = currentUser ? await countMyPendingDemandes() : 0;
  return (
    <AppShell currentUser={currentUser} counts={{ demandes }}>
      {children}
    </AppShell>
  );
}
