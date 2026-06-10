"use client";

/* DashboardShell : sidebar groupee (Pilotage / Activite / Catalogue
   & croissance). Pas de Messages (la messagerie reste dans la nav
   globale, comme demande par l'audit). Badges count sur Avis +
   Reservations pending. Largeur etendue 1680px. */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  CalendarDays,
  Building2,
  Handshake,
  Star,
  Calendar,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  dashboardUser,
  reviewsSummary,
  dashboardReservations,
} from "@/lib/dashboard-data";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string | number;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const pendingReservations = dashboardReservations.filter(
  (r) => r.status === "pending",
).length;

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Pilotage",
    items: [
      { href: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
      { href: "/dashboard/calendrier", label: "Calendrier", icon: Calendar },
      { href: "/dashboard/revenus", label: "Revenus", icon: TrendingUp },
      { href: "/dashboard/audience", label: "Audience", icon: BarChart3 },
    ],
  },
  {
    label: "Activité",
    items: [
      {
        href: "/dashboard/reservations",
        label: "Réservations",
        icon: CalendarDays,
        badge: pendingReservations > 0 ? pendingReservations : undefined,
      },
      {
        href: "/dashboard/avis",
        label: "Avis",
        icon: Star,
        badge:
          reviewsSummary.pendingResponse > 0
            ? reviewsSummary.pendingResponse
            : undefined,
      },
    ],
  },
  {
    label: "Catalogue & croissance",
    items: [
      { href: "/dashboard/annonces", label: "Annonces", icon: Building2 },
      { href: "/dashboard/apporteurs", label: "Apporteurs", icon: Handshake },
    ],
  },
];

function isActive(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === href : pathname.startsWith(href);
}

function NavLink({
  item,
  active,
  horizontal,
}: {
  item: NavItem;
  active: boolean;
  horizontal?: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2.5 rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        horizontal ? "shrink-0 px-3 py-2" : "px-3 py-2",
        active
          ? "bg-muted font-medium text-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="whitespace-nowrap flex-1">{item.label}</span>
      {item.badge !== undefined && (
        <span
          className={cn(
            "ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-medium tabular-nums",
            active
              ? "bg-primary text-primary-foreground"
              : "chip-warning-soft",
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const allItems = NAV_GROUPS.flatMap((g) => g.items);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1680px] items-center justify-between gap-3 px-4 md:px-6 xl:px-10">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="text-[15px] font-medium tracking-[0.18em]">EDOME</span>
            <span className="font-mono text-xs text-muted-foreground">/ dashboard</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="hidden text-right leading-tight sm:block">
              <p className="text-[13px] font-medium">{dashboardUser.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {dashboardUser.roles.join(" · ")}
              </p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
              {dashboardUser.initials}
            </div>
          </div>
        </div>

        {/* Nav mobile : barre horizontale scrollable (flatten groups) */}
        <nav className="flex gap-1 overflow-x-auto border-t px-2 py-1.5 md:hidden">
          {allItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={isActive(pathname, item.href)}
              horizontal
            />
          ))}
        </nav>
      </header>

      <div className="mx-auto flex max-w-[1680px] gap-4 px-4 py-6 md:px-6 lg:gap-6 xl:px-10">
        {/* Sidebar desktop groupee */}
        <aside className="hidden w-52 shrink-0 md:block lg:w-56">
          <nav className="sticky top-20 flex flex-col gap-4">
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {group.label}
                </p>
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.href}
                      item={item}
                      active={isActive(pathname, item.href)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
