"use client";

import React, { useMemo } from "react";
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
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Video,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { conversations, notifications } from "@/lib/mock-data";

interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  indicator?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  // Dynamic badge counts from mock data
  const unreadMessages = useMemo(() => conversations.reduce((sum, c) => sum + c.unreadCount, 0), []);
  const unreadNotifications = useMemo(() => notifications.filter((n) => !n.read).length, []);

  // All nav groups — no role filtering
  const navGroups: NavGroup[] = useMemo(() => [
    {
      title: "DÉCOUVRIR",
      items: [
        { key: "nav.feed", label: t("nav.feed"), href: "/feed", icon: Home },
        { key: "nav.explorer", label: t("nav.explorer"), href: "/explorer", icon: Search },
        { key: "nav.live", label: t("nav.live"), href: "/live", icon: Radio, indicator: true },
        { key: "nav.formations", label: t("nav.formations"), href: "/formations", icon: BookOpen },
        { key: "nav.evenements", label: t("nav.evenements"), href: "/evenements", icon: CalendarDays },
        { key: "nav.services", label: t("nav.services"), href: "/services", icon: Briefcase },
        { key: "nav.boutique", label: t("nav.boutique"), href: "/boutique", icon: ShoppingBag },
      ],
    },
    {
      title: "MON ESPACE",
      items: [
        { key: "nav.dashboard", label: t("nav.dashboard"), href: "/dashboard", icon: LayoutDashboard },
        { key: "nav.statistiques", label: t("nav.statistiques"), href: "/statistiques", icon: BarChart3 },
        { key: "nav.reservations", label: t("nav.reservations"), href: "/reservations", icon: Calendar },
        { key: "nav.apporteurs", label: t("nav.apporteurs"), href: "/apporteurs", icon: Users },
        { key: "nav.favoris", label: "Favoris", href: "/favoris", icon: Heart },
        { key: "nav.messages", label: t("nav.messages"), href: "/messages", icon: MessageCircle, badge: unreadMessages > 0 ? unreadMessages : undefined },
        { key: "nav.notifications", label: t("nav.notifications"), href: "/notifications", icon: Bell, badge: unreadNotifications > 0 ? unreadNotifications : undefined },
      ],
    },
    {
      title: "PUBLIER",
      items: [
        { key: "nav.publier", label: "Publier un bien", href: "/publier", icon: Plus },
        { key: "nav.creer-formation", label: "Créer une formation", href: "/formations/creer", icon: GraduationCap },
        { key: "nav.programmer-live", label: "Programmer un live", href: "/live", icon: Video },
        { key: "nav.vendre-produit", label: "Vendre un produit", href: "/boutique/vendre", icon: ShoppingBag },
      ],
    },
  ], [t, unreadMessages, unreadNotifications]);

  const bottomItems: NavItem[] = useMemo(() => [
    { key: "nav.profil", label: t("nav.profil"), href: "/profil", icon: User },
    { key: "nav.parametres", label: t("nav.parametres"), href: "/parametres", icon: Settings },
    { key: "nav.quitter", label: "Quitter la maquette", href: "/", icon: LogOut },
  ], [t]);

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

      {/* Main nav with groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4 no-scrollbar">
        {navGroups.map((group) => (
          <div key={group.title}>
            {!collapsed && (
              <p
                className="px-3 pb-1 pt-2 text-[10px] font-semibold tracking-wider uppercase"
                style={{ color: "var(--text-muted)" }}
              >
                {group.title}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                      active && "font-medium"
                    )}
                    style={{
                      // Active state : accent bleu E-Dome (avant : gold
                      // orphelin rgba(200,169,78,...) hérité de l'ancien thème)
                      background: active ? "rgba(30,157,241,0.1)" : "transparent",
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
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom nav (COMPTE) */}
      <div className="px-3 py-2 space-y-0.5" style={{ borderTop: "1px solid var(--divider)" }}>
        {!collapsed && (
          <p
            className="px-3 pb-1 pt-1 text-[10px] font-semibold tracking-wider uppercase"
            style={{ color: "var(--text-muted)" }}
          >
            COMPTE
          </p>
        )}
        {bottomItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          const isQuit = item.key === "nav.quitter";
          return (
            <Link
              key={item.key}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
              style={{
                background: active ? "rgba(30,157,241,0.1)" : "transparent",
                color: isQuit
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
              {!collapsed && <span className="truncate">{item.label}</span>}
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
              LM
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{ color: "var(--text-primary)" }}
              >
                Léo Martin
              </p>
              <p
                className="text-[10px] truncate"
                style={{ color: "var(--text-muted)" }}
              >
                Hôte · Formateur · Apporteur
              </p>
              <span className="text-[9px] font-bold" style={{ background: "linear-gradient(135deg, #d4a832, #f5d679)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                🏅 Membre Fondateur #1
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
