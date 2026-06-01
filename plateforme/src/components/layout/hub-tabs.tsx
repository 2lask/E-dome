"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Hub tabs — barre d'onglets horizontale sticky utilisée par
   les pages Explorer et Dashboard. Chaque onglet pointe vers
   une route existante : aucune route n'est supprimée, les pages
   conservent leur contenu, on ajoute juste une barre de navigation
   inter-pôles en tête.

   - Onglet actif : déterminé par le pathname courant via match
     (égalité stricte ou préfixe selon `matchPrefix`).
   - Scroll horizontal sur mobile, centré sur desktop.
   ───────────────────────────────────────────────────────────── */

export interface HubTab {
  key: string;
  label: string;
  href: string;
  icon?: LucideIcon;
  /** Si true, l'onglet est actif quand pathname commence par href.
      Sinon, égalité stricte. Default : true. */
  matchPrefix?: boolean;
}

interface HubTabsProps {
  tabs: HubTab[];
  /** Aria label pour la nav (ex. "Onglets Explorer"). */
  ariaLabel?: string;
}

export function HubTabs({ tabs, ariaLabel = "Onglets" }: HubTabsProps) {
  const pathname = usePathname();

  const isActive = (tab: HubTab) => {
    if (tab.matchPrefix === false) return pathname === tab.href;
    return pathname === tab.href || pathname.startsWith(tab.href + "/");
  };

  return (
    <nav
      aria-label={ariaLabel}
      className="sticky top-16 z-20 -mx-4 md:-mx-6 mb-6"
      style={{
        background: "var(--background)",
        borderBottom: "1px solid var(--card-border)",
      }}
    >
      <div className="overflow-x-auto no-scrollbar">
        <ul className="flex items-center gap-1 px-4 md:px-6 min-w-max">
          {tabs.map((tab) => {
            const active = isActive(tab);
            const Icon = tab.icon;
            return (
              <li key={tab.key}>
                <Link
                  href={tab.href}
                  className="relative flex items-center gap-2 px-3 py-3 text-sm transition-colors whitespace-nowrap"
                  style={{
                    color: active ? "var(--foreground)" : "var(--text-secondary)",
                    fontWeight: active ? 600 : 500,
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.color = "var(--foreground)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.color = "var(--text-secondary)";
                  }}
                >
                  {Icon && <Icon size={16} />}
                  <span>{tab.label}</span>
                  {active && (
                    <span
                      aria-hidden
                      className="absolute left-3 right-3 -bottom-px h-[2px] rounded-full"
                      style={{ background: "var(--primary)" }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
