"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Radio,
  Search,
  Plus,
  Heart,
  MessageCircle,
  Bell,
  Calendar,
  LayoutDashboard,
  BarChart3,
  Users,
  BookOpen,
  Briefcase,
  CalendarDays,
  Wallet,
  User,
  Settings,
  LogOut,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { useLanguage } from "@/lib/i18n";
import { roleBadgeColors, roleLabels } from "@/lib/types";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

interface NavItem {
  key: string;
  href: string;
  icon: React.ElementType;
  roles?: Role[];
  badge?: number;
  indicator?: boolean;
}

const mainNavItems: NavItem[] = [
  { key: "nav.feed", href: "/feed", icon: Home },
  { key: "nav.live", href: "/live", icon: Radio, indicator: true },
  { key: "nav.explorer", href: "/explorer", icon: Search },
  { key: "nav.publier", href: "/publier", icon: Plus, roles: ["hote", "agence", "promoteur", "proprietaire"] },
  { key: "nav.favoris", href: "/favoris", icon: Heart },
  { key: "nav.messages", href: "/messages", icon: MessageCircle, badge: 3 },
  { key: "nav.notifications", href: "/notifications", icon: Bell, badge: 5 },
  { key: "nav.reservations", href: "/reservations", icon: Calendar },
  {
    key: "nav.dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["hote", "agence", "promoteur", "proprietaire", "apporteur", "formateur", "courtier"],
  },
  {
    key: "nav.statistiques",
    href: "/statistiques",
    icon: BarChart3,
    roles: ["hote", "agence", "promoteur", "proprietaire"],
  },
  { key: "nav.apporteurs", href: "/apporteurs", icon: Users, roles: ["apporteur"] },
  { key: "nav.formations", href: "/formations", icon: BookOpen },
  { key: "nav.services", href: "/services", icon: Briefcase },
  { key: "nav.evenements", href: "/evenements", icon: CalendarDays },
  { key: "nav.investisseurs", href: "/investisseurs", icon: Wallet, roles: ["investisseur"] },
];

const bottomNavItems: NavItem[] = [
  { key: "nav.profil", href: "/profil", icon: User },
  { key: "nav.parametres", href: "/parametres", icon: Settings },
  { key: "nav.deconnexion", href: "/auth/connexion", icon: LogOut },
  { key: "nav.administration", href: "/administration", icon: Shield, roles: ["admin"] },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { activeRole, availableRoles } = useApp();
  const { t } = useLanguage();

  const isVisible = (item: NavItem) => {
    if (!item.roles) return true;
    return item.roles.some((r) => availableRoles.includes(r) || activeRole === r);
  };

  const isActive = (href: string) => {
    if (href === "/feed") return pathname === "/feed" || pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col z-40 transition-all duration-300 overflow-hidden"
      style={{
        width: collapsed ? 72 : 260,
        background: "var(--card)",
        borderRight: "1px solid var(--card-border)",
      }}
    >
      {/* Logo & toggle */}
      <div className="flex items-center justify-between px-4 h-16 shrink-0">
        {!collapsed && (
          <Link href="/feed" className="text-xl font-bold tracking-tight">
            <span style={{ color: "var(--gold)" }}>E-</span>
            <span style={{ color: "var(--text-primary)" }}>Dome</span>
          </Link>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg transition-colors cursor-pointer"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--hover-bg)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
          title={collapsed ? "Agrandir" : "Réduire"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 no-scrollbar">
        {mainNavItems.filter(isVisible).map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? t(item.key) : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                active && "font-medium"
              )}
              style={{
                background: active ? "rgba(200,169,78,0.1)" : "transparent",
                color: active ? "var(--gold)" : "var(--text-secondary)",
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = "var(--hover-bg)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              <div className="relative">
                <Icon size={20} />
                {item.indicator && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
                )}
                {item.badge && item.badge > 0 && (
                  <span
                    className="absolute -top-2 -right-2 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold text-white px-1"
                    style={{ background: "var(--gold)" }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              {!collapsed && <span className="truncate">{t(item.key)}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 py-2 space-y-1" style={{ borderTop: "1px solid var(--divider)" }}>
        {bottomNavItems.filter(isVisible).map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          const isLogout = item.key === "nav.deconnexion";
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? t(item.key) : undefined}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
              style={{
                background: active ? "rgba(200,169,78,0.1)" : "transparent",
                color: isLogout
                  ? "#ef4444"
                  : active
                  ? "var(--gold)"
                  : "var(--text-secondary)",
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = "var(--hover-bg)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              <Icon size={20} />
              {!collapsed && <span className="truncate">{t(item.key)}</span>}
            </Link>
          );
        })}
      </div>

      {/* User card */}
      {!collapsed && (
        <div
          className="px-4 py-3 shrink-0"
          style={{ borderTop: "1px solid var(--divider)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
              style={{ background: "var(--gold)", color: "#000" }}
            >
              LD
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{ color: "var(--text-primary)" }}
              >
                Leo Demo
              </p>
              <span
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full font-medium",
                  roleBadgeColors[activeRole]
                )}
              >
                {roleLabels[activeRole]}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Footer links */}
      {!collapsed && (
        <div
          className="px-4 py-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] shrink-0"
          style={{ color: "var(--text-muted)", borderTop: "1px solid var(--divider)" }}
        >
          <Link href="/conditions" className="hover:underline">Conditions</Link>
          <Link href="/confidentialite" className="hover:underline">Confidentialité</Link>
          <Link href="/aide" className="hover:underline">Aide</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
        </div>
      )}
    </aside>
  );
}
