"use client";

import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { demoBar } from "@/content/common";
import { PersonaSwitcher } from "@/components/layout/role-switcher";

/* ── Bandeau de démonstration — version discrète (chantier D2) ───────────────

   Avant : une barre pleine largeur avec « Maquette de démonstration — Données
   d'exemple, rien n'est réel », la légende des statuts (launch/later/vision) et
   le sélecteur de personne. Elle occupait le haut de CHAQUE écran et donnait un
   feeling « notice / démo » — exactement ce que le fondateur a critiqué.

   Désormais : une strip fine. L'honnêteté est tenue par un petit marqueur
   « Démonstration · données fictives » (contrainte conservée), le sélecteur de
   personne reste à droite (c'est une fonctionnalité, pas une notice), et la
   légende des statuts est reléguée à `/a-propos` (lien « Comment ça marche »).

   Présent sur toutes les routes (rendu dans `app-shell`, tableau de bord
   compris) : c'est le seul emplacement universel pour la mention obligatoire. */

export function DemoLegendBar() {
  return (
    <div className="w-full border-b border-[var(--card-border)] bg-[var(--card)]/30">
      <div className="mx-auto flex max-w-[1400px] items-center gap-2.5 px-3 py-1">
        {/* Marqueur d'honnêteté, compact. */}
        <span
          title="Les données affichées (biens, profils, prix, chiffres) sont fictives."
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--card-border)] bg-[var(--background)] px-2 py-0.5 text-[11px] font-medium text-[var(--text-muted)]"
        >
          <FlaskConical size={11} strokeWidth={2} aria-hidden className="text-[var(--primary)]" />
          <span className="hidden sm:inline">Démonstration · données fictives</span>
          <span className="sm:hidden">Démo</span>
        </span>

        <Link
          href={demoBar.learnMoreHref}
          className="hidden text-[11px] text-[var(--text-muted)] underline underline-offset-2 transition-colors hover:text-[var(--foreground)] sm:inline"
          title="Comprendre E-Dome : les pôles, qui paie quoi, par où commencer"
        >
          {demoBar.learnMore}
        </Link>

        {/* Sélecteur de personne (« être un profil ») — une fonctionnalité. */}
        <div className="ml-auto">
          <PersonaSwitcher />
        </div>
      </div>
    </div>
  );
}
