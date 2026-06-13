"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Search, Compass, Sparkles, Handshake, HelpCircle, Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { conversations } from "@/lib/mock-data";

/* ─────────────────────────────────────────────────────────────
   SidebarWhop : sidebar permanente style Whop pixel-perfect.

   Structure :
   - 4 items principaux SANS label de section (Accueil, Recherche,
     Découvrir, Publier un bien)
   - Section MES GROUPES : liste les conversations type='group' avec
     mini-avatars CARRÉS arrondis 28px (rounded-md, PAS rounded-full)
   - Section RESSOURCES : Apporteurs, Aide, Paramètres
   - PAS de CTA bouton primary
   - PAS de section "MON ESPACE"
   - PAS de footer utilisateur

   Largeur : 192px (12rem) — pixel-aligned avec Whop (~180-200px).
   Padding réduit pour densité Whop.
   ───────────────────────────────────────────────────────────── */

export const SIDEBAR_WHOP_WIDTH = 192;

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  matchPrefixes?: string[];
}

export function SidebarWhop() {
  const pathname = usePathname();

  /* Groupes de chat (équivalent E-Dome de "MES WHOPS"). */
  const myGroups = useMemo(
    () => conversations.filter((c) => c.type === "group").slice(0, 6),
    [],
  );

  /* Items principaux SANS label de section (style Whop top). */
  const mainItems: NavItem[] = [
    { label: "Accueil", href: "/feed", icon: Home, matchPrefixes: ["/feed"] },
    { label: "Recherche", href: "/recherche", icon: Search, matchPrefixes: ["/recherche"] },
    { label: "Découvrir", href: "/explorer", icon: Compass, matchPrefixes: ["/explorer", "/boutique", "/formations", "/services", "/live", "/evenements"] },
    { label: "Publier un bien", href: "/publier", icon: Sparkles, matchPrefixes: ["/publier"] },
  ];

  const resourceItems: NavItem[] = [
    { label: "Apporteurs", href: "/apporteurs", icon: Handshake, matchPrefixes: ["/apporteurs"] },
    { label: "Aide", href: "/aide", icon: HelpCircle, matchPrefixes: ["/aide"] },
    { label: "Paramètres", href: "/parametres", icon: Settings, matchPrefixes: ["/parametres"] },
  ];

  const isActive = (item: NavItem) =>
    item.matchPrefixes?.some((p) => pathname.startsWith(p)) ?? (pathname === item.href);

  return (
    <aside
      className="fixed left-0 top-0 z-30 hidden md:flex h-screen shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground"
      style={{ width: SIDEBAR_WHOP_WIDTH }}
    >
      {/* Logo */}
      <Link href="/" className="flex h-12 shrink-0 items-center px-3 border-b border-border">
        <span className="font-mono text-[13px] font-semibold tracking-[0.18em] text-foreground">
          E-DOME
        </span>
      </Link>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto py-2">
        {/* 4 items principaux SANS label de section (style Whop top) */}
        <div className="px-1.5 space-y-0.5">
          {mainItems.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(item)} />
          ))}
        </div>

        {/* Section MES GROUPES (mini-avatars carrés arrondis 28px) */}
        {myGroups.length > 0 && (
          <NavSection label="Mes groupes">
            {myGroups.map((group) => {
              const groupActive = pathname === "/messages" && false; // jamais "active" via path simple
              return (
                <Link
                  key={group.id}
                  href={`/messages?conv=${group.id}`}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1 transition-colors",
                    "hover:bg-sidebar-accent",
                    groupActive && "bg-sidebar-accent",
                  )}
                >
                  <img
                    src={group.groupAvatar}
                    alt=""
                    className="h-7 w-7 shrink-0 rounded-md object-cover"
                  />
                  <span className="truncate text-[12px] text-foreground/85 leading-tight">
                    {group.name}
                  </span>
                  {group.unreadCount > 0 && (
                    <span className="ml-auto inline-flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-foreground px-1 font-mono text-[9px] font-semibold text-background">
                      {group.unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </NavSection>
        )}

        {/* Section RESSOURCES */}
        <NavSection label="Ressources">
          {resourceItems.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(item)} />
          ))}
        </NavSection>
      </div>
    </aside>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */

function NavSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 px-1.5">
      <p className="px-2 pb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] transition-colors",
        active
          ? "bg-sidebar-accent font-medium text-foreground"
          : "text-foreground/75 hover:bg-sidebar-accent hover:text-foreground",
      )}
    >
      <Icon className="h-[17px] w-[17px] shrink-0" />
      <span className="flex-1 truncate">{item.label}</span>
    </Link>
  );
}
