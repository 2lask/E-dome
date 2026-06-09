"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Calendar,
  Radio,
  Handshake,
  LayoutGrid,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

/* ─── <DiscoverHub /> ─────────────────────────────────────────────────────
   Barre de navigation horizontale Airbnb-style ("categories") placee
   en haut de /feed pour aider un nouveau venu a decouvrir les autres
   sections de la plateforme sans avoir a ouvrir le hamburger.

   Cible : nouveaux utilisateurs qui arrivent sur /feed et ne savent pas
   que E-Dome contient aussi Formations, Apporteurs, Dashboard, etc.

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
  { href: "/boutique", icon: ShoppingBag, label: "Boutique" },
  { href: "/formations", icon: GraduationCap, label: "Formations" },
  { href: "/services", icon: Briefcase, label: "Services" },
  { href: "/evenements", icon: Calendar, label: "Événements" },
  { href: "/live", icon: Radio, label: "Live" },
  { href: "/apporteurs", icon: Handshake, label: "Apporteurs" },
  { href: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
  { href: "/statistiques", icon: BarChart3, label: "Stats" },
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
