"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Search,
  PlusCircle,
  Heart,
  MessageCircle,
  Bell,
  Calendar,
  LayoutDashboard,
  Link as LinkIcon,
  GraduationCap,
  CalendarDays,
  Briefcase,
  BarChart3,
  Shield,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Radio,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { conversations, notifications } from "@/lib/mock-data";
import { useApp } from "@/lib/context";
import { roleLabels } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

// ─── Types ───────────────────────────────────────────────

interface NavItem {
  label: string;
  i18nKey: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number;
  roles?: string[];
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onClose: () => void;
}

// ─── Compute unread count from mock data ─────────────────

const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
const unreadNotifications = notifications.filter((n) => !n.read).length;

// ─── Nav config ──────────────────────────────────────────

// Simulated: true if a live is currently active
const isLiveActive = true;

const mainNav: NavItem[] = [
  { label: "Feed", i18nKey: "nav.feed", icon: Home, href: "/feed" },
  { label: "Live", i18nKey: "nav.live", icon: Radio, href: "/live" },
  { label: "Explorer", i18nKey: "nav.explorer", icon: Search, href: "/explorer" },
  { label: "Publier", i18nKey: "nav.publier", icon: PlusCircle, href: "/publier", roles: ["hote", "agence", "promoteur", "proprietaire"] },
  { label: "Favoris", i18nKey: "nav.favoris", icon: Heart, href: "/favoris" },
  { label: "Messages", i18nKey: "nav.messages", icon: MessageCircle, href: "/messages", badge: totalUnread },
  { label: "Notifications", i18nKey: "nav.notifications", icon: Bell, href: "/notifications", badge: unreadNotifications },
  { label: "Réservations", i18nKey: "nav.reservations", icon: Calendar, href: "/reservations" },
  { label: "Dashboard", i18nKey: "nav.dashboard", icon: LayoutDashboard, href: "/dashboard", roles: ["hote", "agence", "promoteur", "apporteur", "formateur", "proprietaire", "courtier"] },
  { label: "Statistiques", i18nKey: "nav.statistiques", icon: BarChart3, href: "/statistiques", roles: ["hote", "agence", "promoteur", "proprietaire", "courtier"] },
  { label: "Apporteurs", i18nKey: "nav.apporteurs", icon: LinkIcon, href: "/apporteurs", roles: ["apporteur"] },
  { label: "Investisseurs", i18nKey: "nav.investisseurs", icon: Wallet, href: "/investisseurs", roles: ["investisseur"] },
  { label: "Formations", i18nKey: "nav.formations", icon: GraduationCap, href: "/formations" },
  { label: "Services", i18nKey: "nav.services", icon: Briefcase, href: "/services" },
  { label: "Événements", i18nKey: "nav.evenements", icon: CalendarDays, href: "/evenements" },
];

const adminRoles = new Set(["admin"]);

const bottomNav: NavItem[] = [
  { label: "Profil", i18nKey: "nav.profil", icon: User, href: "/profil" },
  { label: "Paramètres", i18nKey: "nav.parametres", icon: Settings, href: "/parametres" },
];

// ─── Component ───────────────────────────────────────────

export function Sidebar({ collapsed, onToggle, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { activeRole, availableRoles } = useApp();
  const { t } = useTranslation();
  const [tooltipItem, setTooltipItem] = useState<string | null>(null);

  const isActive = (href: string) => {
    if (href === "/feed") return pathname === "/feed" || pathname === "/";
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    router.push("/auth/connexion");
  };

  const renderNavItem = (item: NavItem, isLogout = false) => {
    const active = !isLogout && isActive(item.href);
    const Icon = item.icon;
    const translatedLabel = t(item.i18nKey);

    const content = (
      <div
        className={cn(
          "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
          active
            ? "bg-[#C4956A]/10 text-[#D4A574]"
            : isLogout
              ? "text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-400"
              : "text-[var(--text-secondary)] hover:bg-[var(--accent)]/5 hover:text-[var(--foreground)]"
        )}
        onMouseEnter={() => collapsed && setTooltipItem(item.label)}
        onMouseLeave={() => setTooltipItem(null)}
      >
        {/* Active indicator bar */}
        {active && (
          <div className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-[#C4956A]" />
        )}

        <div className="relative flex-shrink-0">
          <Icon className={cn("h-5 w-5", active && "text-[#C4956A]")} />
          {item.label === "Live" && isLiveActive && (
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[var(--sidebar-bg)] animate-pulse" />
          )}
        </div>

        {!collapsed && (
          <span className="flex-1 truncate">{translatedLabel}</span>
        )}

        {/* Badge */}
        {!collapsed && item.badge && item.badge > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C4956A] px-1.5 text-[10px] font-bold text-black">
            {item.badge}
          </span>
        )}

        {/* Collapsed badge dot */}
        {collapsed && item.badge && item.badge > 0 && (
          <span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-[#C4956A]" />
        )}

        {/* Tooltip (collapsed state) */}
        {collapsed && tooltipItem === item.label && (
          <div className="absolute left-full z-50 ml-3 whitespace-nowrap rounded-md bg-[var(--card-hover)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] shadow-lg border border-[var(--border)]">
            {translatedLabel}
            {item.badge ? ` (${item.badge})` : ""}
          </div>
        )}
      </div>
    );

    if (isLogout) {
      return (
        <button key={item.label} className="w-full" onClick={handleLogout}>
          {content}
        </button>
      );
    }

    return (
      <Link key={item.href} href={item.href} onClick={onClose}>
        {content}
      </Link>
    );
  };

  return (
    <div className="flex h-full flex-col border-r border-[var(--border)] bg-[var(--sidebar-bg)]">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && (
          <Link href="/feed" className="flex items-center gap-1 text-xl font-bold">
            <span className="text-[var(--foreground)]">E-</span>
            <span className="text-gradient">Dome</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/feed" className="mx-auto text-lg font-bold text-gradient">
            E
          </Link>
        )}

        {/* Collapse toggle (desktop) */}
        <button
          onClick={onToggle}
          className="hidden rounded-md p-1 text-[var(--text-secondary)] hover:bg-[var(--accent)]/5 hover:text-[var(--foreground)] lg:block"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        {/* Close button (mobile) */}
        <button
          onClick={onClose}
          className="rounded-md p-1 text-[var(--text-secondary)] hover:bg-[var(--accent)]/5 hover:text-[var(--foreground)] lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {mainNav
          .filter(item => !item.roles || item.roles.some(r => availableRoles.includes(r as any)))
          .map((item) => renderNavItem(item))}
      </nav>

      {/* Separator */}
      <div className="mx-4 border-t border-[var(--border)]" />

      {/* Bottom nav */}
      <nav className="space-y-0.5 px-3 py-2">
        {adminRoles.has(activeRole) &&
          renderNavItem({ label: "Administration", i18nKey: "nav.admin", icon: Shield, href: "/admin" })}
        {bottomNav.map((item) => renderNavItem(item))}
        {renderNavItem(
          { label: "Deconnexion", i18nKey: "nav.deconnexion", icon: LogOut, href: "#" },
          true
        )}
      </nav>

      {/* User card */}
      {!collapsed && (
        <div className="border-t border-[var(--border)] p-3">
          <div className="flex items-center gap-3 rounded-lg bg-[var(--card)] p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#C4956A] to-[#D4A574] text-sm font-bold text-black">
              KB
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-[var(--foreground)]">
                Karim Benali
              </p>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center rounded-full bg-[#C4956A]/15 px-2 py-0.5 text-[10px] font-semibold text-[#C4956A]">
                  {roleLabels[activeRole]}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed user avatar */}
      {collapsed && (
        <div className="border-t border-[var(--border)] p-3">
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#C4956A] to-[#D4A574] text-sm font-bold text-black">
            KB
          </div>
        </div>
      )}

      {/* Footer links */}
      {!collapsed && (
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-[var(--border)] px-4 py-3">
          <Link href="/conditions" className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">{t('nav.conditions')}</Link>
          <Link href="/confidentialite" className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">{t('nav.confidentialite')}</Link>
          <Link href="/aide" className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">{t('nav.aide')}</Link>
          <Link href="/contact" className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">{t('nav.contact')}</Link>
        </div>
      )}
    </div>
  );
}
