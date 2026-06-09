"use client";

/* Coquille partagee par TOUTES les pages du dashboard.
   Une seule navigation, une seule identite utilisateur -> fini les
   deux layouts et les initiales qui changeaient (LM/LD) d'une page
   a l'autre. */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  CalendarDays,
  Building2,
  Handshake,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardUser } from "@/lib/dashboard-data";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/dashboard/revenus", label: "Revenus", icon: TrendingUp },
  { href: "/dashboard/reservations", label: "Réservations", icon: CalendarDays },
  { href: "/dashboard/annonces", label: "Annonces", icon: Building2 },
  { href: "/dashboard/apporteurs", label: "Apporteurs", icon: Handshake },
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
        "flex items-center gap-2.5 rounded-md text-sm transition-colors",
        horizontal ? "shrink-0 px-3 py-2" : "px-3 py-2",
        active
          ? "bg-muted font-medium text-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="whitespace-nowrap">{item.label}</span>
    </Link>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 md:px-6">
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

        {/* Navigation mobile : barre horizontale scrollable */}
        <nav className="flex gap-1 overflow-x-auto border-t px-2 py-1.5 md:hidden">
          {NAV.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={isActive(pathname, item.href)}
              horizontal
            />
          ))}
        </nav>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6 md:px-6">
        {/* Navigation desktop : sidebar */}
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="sticky top-20 flex flex-col gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={isActive(pathname, item.href)}
              />
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
