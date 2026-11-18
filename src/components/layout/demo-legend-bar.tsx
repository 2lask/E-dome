"use client";

import { PersonaSwitcher } from "@/components/layout/role-switcher";

/* ── Barre « profil actif » ─────────────────────────────────────────────────

   Ex-« bandeau de démonstration ». Le cadre « démo / données fictives / légende
   des statuts » a été retiré (pivot 2026-11-18, `MODELE.md`) : on construit une
   vraie plateforme, pas une maquette. Il ne reste que le sélecteur de personne,
   le temps que l'authentification réelle (Supabase) prenne le relais — il
   deviendra alors le vrai menu de compte, puis disparaîtra.

   Rendu dans `app-shell`, donc présent sur toutes les routes. */

export function DemoLegendBar() {
  return (
    <div className="w-full border-b border-[var(--card-border)]">
      <div className="mx-auto flex max-w-[1400px] items-center justify-end px-3 py-1">
        <PersonaSwitcher />
      </div>
    </div>
  );
}
