"use client";

import Link from "next/link";
import { BookOpen, FlaskConical } from "lucide-react";
import { STAGE_DOT, STAGE_LABEL, STAGE_HINT, STAGE_ORDER } from "@/lib/model/stage-ui";
import { demoBar } from "@/content/common";
import { tourUi } from "@/content/tour";
import { useApp } from "@/lib/context";
import { PersonaSwitcher } from "@/components/layout/role-switcher";

/* ── Bandeau-légende permanent ──────────────────────────────────────────────

   Présent sur chaque écran de l'application (rendu dans `app-shell`, hors des
   conditions de route). Il remplace l'ancienne mention « données fictives » de
   10 px, qui disait le nécessaire mais qu'on ne lisait pas.

   Il porte trois choses, et c'est pour cela qu'il vaut sa hauteur :
     · la mention obligatoire — rien ici n'est réel ;
     · la LÉGENDE DES STATUTS — la clé de lecture du vert et des gris qu'on
       croise sur tous les écrans, avec le lien vers `/demo` qui l'explique ;
     · QUI L'ON EST — « Vous êtes Céline Bovard · agente immobilière à Lutry
       — changer » : le sélecteur de personne (chantier P3), ici parce
       que c'est le seul emplacement présent sur toutes les routes, y compris
       le tableau de bord dont la chrome est différente.

   Couleurs de statut et libellés : `@/lib/model/stage-ui`, la même source que
   `/demo`. Le composant n'écrit aucun statut en dur.

   L'ancien interrupteur « Mode explicatif » est rétrogradé (chantier P5) :
   c'est désormais le « Glossaire », un bouton secondaire. Il commande le même
   état (`explainMode`) et les mêmes contenus (`content/explain.ts`) ; c'est le
   tutoriel guidé qui porte maintenant la découverte. */

export function DemoLegendBar() {
  const { explainMode, setExplainMode } = useApp();
  return (
    <div data-tour="demo-banner" className="w-full border-b border-[var(--primary)]/15 bg-[var(--primary)]/5">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-1.5">
        {/* Mention */}
        <span className="flex items-center gap-1.5 text-[12px] text-[var(--primary)]">
          <FlaskConical size={13} strokeWidth={2} aria-hidden />
          <span className="font-semibold">{demoBar.mention}</span>
          <span className="hidden text-[var(--text-muted)] sm:inline">— {demoBar.mentionHint}</span>
        </span>

        {/* Légende des statuts */}
        <ul className="flex items-center gap-x-3 gap-y-1">
          {STAGE_ORDER.map((stage) => (
            <li key={stage} className="flex items-center gap-1" title={STAGE_HINT[stage]}>
              <span className={`h-2 w-2 rounded-full ${STAGE_DOT[stage]}`} aria-hidden />
              <span className="text-[11px] text-[var(--text-muted)]">{STAGE_LABEL[stage]}</span>
            </li>
          ))}
        </ul>

        {/* À droite : le glossaire, le lien d'explication, le sélecteur */}
        <div className="ml-auto flex items-center gap-2">
          {/* Le glossaire : l'ancien mode explicatif, en bouton secondaire.
              Aria-pressed le rend lisible aux lecteurs d'écran ; le « ? » qu'il
              commande apparaît sur les éléments qui savent s'expliquer. */}
          <button
            type="button"
            onClick={() => setExplainMode(!explainMode)}
            aria-pressed={explainMode}
            aria-label={tourUi.glossaryLabel}
            title={tourUi.glossaryHint}
            className={
              "flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11.5px] transition-colors " +
              (explainMode
                ? "text-[var(--primary)]"
                : "text-[var(--text-muted)] hover:text-[var(--foreground)]")
            }
          >
            <BookOpen size={12} aria-hidden />
            <span className="hidden sm:inline">{tourUi.glossaryLabel}</span>
          </button>

          <Link
            href={demoBar.learnMoreHref}
            className="text-[12px] text-[var(--primary)] underline underline-offset-2 hover:opacity-80"
            title="Comprendre E-Dome en un écran : les pôles, qui paie quoi, par où commencer"
          >
            {demoBar.learnMore}
          </Link>
          <PersonaSwitcher />
        </div>
      </div>
    </div>
  );
}
