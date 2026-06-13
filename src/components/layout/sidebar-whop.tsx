"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Search, MessageCircle, Bell, LayoutDashboard,
  Heart, Handshake, User as UserIcon, Settings, HelpCircle,
  Plus, Users as UsersIcon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { conversations } from "@/lib/mock-data";

/* ─────────────────────────────────────────────────────────────
   SidebarWhop : sidebar permanente style Whop / Twitter.
   Structure : sections labellees uppercase + items inline avec
   icone + label, badge counter pour Messages/Notifications.

   - Largeur fixe 240px (pas de hover-to-expand)
   - Section MES GROUPES : liste les conversations type='group'
     du mock, mini-avatars + nom tronque. Clic -> /messages
   - Section RESSOURCES : Aide, Parametres
   - Logo en haut, footer minimal en bas
   ───────────────────────────────────────────────────────────── */

export const SIDEBAR_WHOP_WIDTH = 240;

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  matchPrefixes?: string[];
}

export function SidebarWhop() {
  const pathname = usePathname();

  const unreadMessages = useMemo(
    () => conversations.reduce((sum, c) => sum + c.unreadCount, 0),
    [],
  );

  /* Groupes de chat (les conversations type='group' du mock) :
     equivalent E-Dome de "MES WHOPS". Limite a 6 pour ne pas surcharger. */
  const myGroups = useMemo(
    () => conversations.filter((c) => c.type === "group").slice(0, 6),
    [],
  );

  const navItems: NavItem[] = [
    { label: "Accueil", href: "/feed", icon: Home, matchPrefixes: ["/feed"] },
    { label: "Explorer", href: "/explorer", icon: Search, matchPrefixes: ["/explorer", "/boutique", "/formations", "/services", "/live", "/evenements"] },
    { label: "Messages", href: "/messages", icon: MessageCircle, badge: unreadMessages > 0 ? unreadMessages : undefined, matchPrefixes: ["/messages"] },
    { label: "Notifications", href: "/notifications", icon: Bell, badge: 3, matchPrefixes: ["/notifications"] },
  ];

  const espaceItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, matchPrefixes: ["/dashboard"] },
    { label: "Apporteurs", href: "/apporteurs", icon: Handshake, matchPrefixes: ["/apporteurs"] },
    { label: "Favoris", href: "/favoris", icon: Heart, matchPrefixes: ["/favoris"] },
    { label: "Profil", href: "/profil", icon: UserIcon, matchPrefixes: ["/profil"] },
  ];

  const resourceItems: NavItem[] = [
    { label: "Aide", href: "/aide", icon: HelpCircle, matchPrefixes: ["/aide"] },
    { label: "Paramètres", href: "/parametres", icon: Settings, matchPrefixes: ["/parametres"] },
  ];

  const isActive = (item: NavItem) =>
    item.matchPrefixes?.some((p) => pathname.startsWith(p)) ?? (pathname === item.href);

  return (
    <aside
      className="fixed left-0 top-0 z-30 hidden md:flex h-screen w-[240px] shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground"
      style={{ width: SIDEBAR_WHOP_WIDTH }}
    >
      {/* Logo */}
      <Link href="/" className="flex h-14 shrink-0 items-center px-5 border-b border-border">
        <span className="font-mono text-base font-semibold tracking-[0.18em] text-foreground">
          E-DOME
        </span>
      </Link>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto py-4">
        {/* CTA Créer (bouton primary en haut) */}
        <div className="px-3 pb-3">
          <Link
            href="/publier"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-foreground py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            Publier un bien
          </Link>
        </div>

        {/* Section NAVIGUER */}
        <NavSection label="Naviguer">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(item)} />
          ))}
        </NavSection>

        {/* Section MES GROUPES (mini-avatars + nom) */}
        {myGroups.length > 0 && (
          <NavSection label="Mes groupes">
            {myGroups.map((group) => (
              <Link
                key={group.id}
                href={`/messages?conv=${group.id}`}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                  "hover:bg-sidebar-accent",
                )}
              >
                <img
                  src={group.groupAvatar}
                  alt=""
                  className="h-6 w-6 shrink-0 rounded-md object-cover"
                />
                <span className="truncate text-[13px] text-foreground/85 group-hover:text-foreground">
                  {group.name}
                </span>
                {group.unreadCount > 0 && (
                  <span className="ml-auto inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-foreground px-1 font-mono text-[9px] font-semibold text-background">
                    {group.unreadCount}
                  </span>
                )}
              </Link>
            ))}
            <Link
              href="/messages"
              className="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[12px] text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
            >
              <UsersIcon className="h-4 w-4" />
              Voir toutes les conversations
            </Link>
          </NavSection>
        )}

        {/* Section MON ESPACE */}
        <NavSection label="Mon espace">
          {espaceItems.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(item)} />
          ))}
        </NavSection>

        {/* Section RESSOURCES */}
        <NavSection label="Ressources">
          {resourceItems.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(item)} />
          ))}
        </NavSection>
      </div>

      {/* Footer utilisateur — toujours visible */}
      <div className="shrink-0 border-t border-border p-3">
        <Link
          href="/profil"
          className="flex items-center gap-2.5 rounded-md p-2 hover:bg-sidebar-accent transition-colors"
        >
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"
            alt=""
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium leading-tight">Léo Martin</p>
            <p className="truncate text-[11px] text-muted-foreground">Démo</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */

function NavSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-3 first:mt-0 px-1.5">
      <p className="px-3 pb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
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
        "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
        active
          ? "bg-sidebar-accent font-medium text-foreground"
          : "text-foreground/75 hover:bg-sidebar-accent hover:text-foreground",
      )}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span className="inline-flex h-4 min-w-[18px] items-center justify-center rounded-full bg-foreground px-1 font-mono text-[10px] font-semibold text-background">
          {item.badge}
        </span>
      )}
    </Link>
  );
}
