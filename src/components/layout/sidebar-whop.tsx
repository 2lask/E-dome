"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Search, MessageCircle, Bell, Settings, HelpCircle,
  Plus, Users as UsersIcon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/use-session";
import { useActor, useActorNav } from "@/lib/use-actor";
import { ACTOR_NAV_ICONS } from "@/components/layout/actor-nav-icons";

/* ─────────────────────────────────────────────────────────────
   SidebarWhop : sidebar permanente style Whop / Twitter.
   Structure : sections labellees uppercase + items inline avec
   icone + label, badge counter pour Messages/Notifications.

   Largeur 220px (mesure Whop reelle, ~28% viewport ~1440).
   Dimensions tirees de l'inspection live whop.com + screenshot.
   ───────────────────────────────────────────────────────────── */

export const SIDEBAR_WHOP_WIDTH = 220;

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  matchPrefixes?: string[];
}

export function SidebarWhop() {
  const pathname = usePathname();

  /* Compteurs et groupes : la mémoire de session, source unique (la page
     /notifications, l'en-tête et la nav mobile lisent les mêmes). */
  const { unreadMessages, unreadNotifications, threads } = useSession();

  /* Groupes de chat de l'acteur : equivalent E-Dome de "MES WHOPS". Limite a
     6 pour ne pas surcharger. */
  const myGroups = useMemo(() => threads.filter((t) => t.isGroup).slice(0, 6), [threads]);

  const navItems: NavItem[] = [
    { label: "Accueil", href: "/feed", icon: Home, matchPrefixes: ["/feed"] },
    { label: "Explorer", href: "/explorer", icon: Search, matchPrefixes: ["/explorer", "/boutique", "/formations", "/services", "/live", "/evenements"] },
    { label: "Messages", href: "/messages", icon: MessageCircle, badge: unreadMessages > 0 ? unreadMessages : undefined, matchPrefixes: ["/messages"] },
    { label: "Notifications", href: "/notifications", icon: Bell, badge: unreadNotifications > 0 ? unreadNotifications : undefined, matchPrefixes: ["/notifications"] },
  ];

  /* La personne incarnée (chantier P3) : son nom et sa photo en pied de
     barre, son action principale en tête, et « Mon espace » selon SES rôles
     (`navFor`) — l'espace agence pour l'équipe Hartmann, l'espace apporteur
     pour qui recommande, ses formations pour qui en crée… */
  const actor = useActor();
  const actorNav = useActorNav();
  const espaceItems: NavItem[] = actorNav.map((it) => ({
    label: it.label,
    href: it.href,
    icon: ACTOR_NAV_ICONS[it.icon],
    /* « Mes formations » pointe dans le tableau de bord : seul « Tableau de
       bord » s'allume sur /dashboard. */
    matchPrefixes: it.href.includes("#") ? [] : [it.href],
  }));

  const resourceItems: NavItem[] = [
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
      {/* Logo : h-14 + px-4 + text-[15px] (mesure Whop) */}
      <Link href="/" className="flex h-14 shrink-0 items-center px-4 border-b border-border">
        <span className="font-mono text-[15px] font-bold tracking-[0.02em] text-foreground">
          E-DOME
        </span>
      </Link>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto py-3">
        {/* CTA "Publier un bien" : py-2.5 text-[13.5px] (Whop CTA dimensions) */}
        <div className="px-3 pb-3">
          <Link
            href={actor.cta.href}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground py-2.5 text-[13.5px] font-medium text-background hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            {actor.cta.label}
          </Link>
        </div>

        {/* Section NAVIGUER */}
        <NavSection label="Naviguer">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(item)} />
          ))}
        </NavSection>

        {/* Section MES GROUPES (mini-avatars 28px + nom 13px) */}
        {myGroups.length > 0 && (
          <NavSection label="Mes groupes">
            {myGroups.map((group) => (
              <Link
                key={group.id}
                href={`/messages?conv=${group.id}`}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition-colors",
                  "hover:bg-sidebar-accent",
                )}
              >
                {group.avatar ? (
                  <img
                    src={group.avatar}
                    alt=""
                    className="h-7 w-7 shrink-0 rounded-md object-cover"
                  />
                ) : (
                  <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-sidebar-accent text-muted-foreground">
                    <UsersIcon className="h-3.5 w-3.5" />
                  </span>
                )}
                <span className="truncate text-[13px] text-foreground/85 leading-tight">
                  {group.name}
                </span>
                {group.unreadCount > 0 && (
                  <span className="ml-auto inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-foreground px-1 font-mono text-[10px] font-semibold text-background">
                    {group.unreadCount}
                  </span>
                )}
              </Link>
            ))}
            <Link
              href="/messages"
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12px] text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
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

      {/* Footer utilisateur — p-3 + avatar h-8 (Whop dimensions).
          Le sélecteur de rôle n'est pas ici mais dans le bandeau-légende
          global : c'est le seul emplacement présent sur toutes les routes,
          tableau de bord compris, dont la chrome n'a pas cette sidebar. */}
      <div className="shrink-0 border-t border-border p-3">
        <Link
          href="/profil"
          className="flex items-center gap-2.5 rounded-lg p-2 hover:bg-sidebar-accent transition-colors"
        >
          <img
            src={actor.avatar}
            alt=""
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium leading-tight">{actor.name}</p>
            <p className="truncate text-[11px] text-muted-foreground">{actor.line}</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */

function NavSection({ label, children }: { label: string; children: React.ReactNode }) {
  /* mt-5 entre sections, label uppercase 10.5px + pb-2, px-3 wrapper. */
  return (
    <div className="mt-5 first:mt-0 px-3">
      <p className="pb-2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
      <div className="space-y-0">{children}</div>
    </div>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  /* py-2 text-[14px] gap-3 icon 18px rounded-lg : densite Whop pleine. */
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-2.5 py-2 text-[14px] transition-colors",
        active
          ? "bg-sidebar-accent font-medium text-foreground"
          : "text-foreground/80 hover:bg-sidebar-accent hover:text-foreground",
      )}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-foreground px-1 font-mono text-[10px] font-semibold text-background">
          {item.badge}
        </span>
      )}
    </Link>
  );
}
