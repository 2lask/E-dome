"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  GraduationCap,
  Briefcase,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

/* ─── <DiscoverHub /> ─────────────────────────────────────────────────────
   Barre de navigation horizontale Airbnb-style ("categories") placee
   en haut de /feed pour aider un nouveau venu a decouvrir les autres
   sections de la plateforme sans avoir a ouvrir le hamburger.

   Cible : nouveaux utilisateurs qui arrivent sur /feed et ne savent pas
   que E-Dome contient aussi Formations, Services, Dashboard, etc.

   V1 « E-Dome Pro » (STRATEGIE.md / PLAN-V1.md, chantier C1) : le hub ne met
   plus en avant les pôles parqués (boutique, événements, lives, apporteurs).
   L'ancien item « Stats » pointait vers /statistiques, une route inexistante
   (lien mort) — retiré ; le Dashboard couvre déjà les statistiques.

   Pattern : icone + label sous chaque item, scroll horizontal mobile
   (no-scrollbar), gap genereux. Au hover desktop : underline du label.
   ─────────────────────────────────────────────────────────────────── */

interface HubItem {
  href: string;
  icon: LucideIcon;
  label: string;
}

const ITEMS: HubItem[] = [
  { href: "/explorer", icon: Building2, label: "Biens" },
  { href: "/formations", icon: GraduationCap, label: "Formations" },
  { href: "/services", icon: Briefcase, label: "Services" },
  { href: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
];

export function DiscoverHub() {
  return (
    <nav
      aria-label="Découvrir les sections E-Dome"
      className="no-scrollbar overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0"
    >
      <div className="flex gap-6 md:gap-8 py-3 min-w-max border-b border-[var(--card-border)]">
        {ITEMS.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col items-center gap-1.5 shrink-0 pt-1 pb-3 -mb-px border-b-2 border-transparent hover:border-[var(--foreground)] transition-colors"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--foreground)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
          >
            <Icon size={22} strokeWidth={1.8} />
            <span className="text-[11px] font-medium tracking-tight whitespace-nowrap">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
