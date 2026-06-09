"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Search,
  MessageCircle,
  Bell,
  LayoutDashboard,
  Heart,
  Handshake,
  User as UserIcon,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  Building2,
  ShoppingBag,
  GraduationCap,
  Video,
  CalendarDays,
  Briefcase,
  Plus,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { conversations } from "@/lib/mock-data";

/* ─────────────────────────────────────────────────────────────
   Sidebar globale (hors /dashboard/*).
   v4 : Creer = submenu (groupe ensemble) ; click parent = toggle
   submenu sur toute la ligne (pas que la fleche) ; largeur reduite
   240 ; ajout d'Apporteurs dans MON ESPACE.

   GROUPES :
   1. NAVIGUER       : Accueil / Explorer ▼ / Messages [n] /
                       Notifications [n]
   2. CRÉER          : Creer ▼ (submenu de 6 actions)
   3. MON ESPACE     : Dashboard / Apporteurs / Favoris / Profil
   4. (bas, popover) : Reglages → Parametres / Aide / Quitter

   Comportement :
   - Hover-to-expand 56px -> 240px (overlay, le contenu ne se redecale pas)
   - Click sur la ligne parent (Explorer, Creer) = toggle submenu
     sur TOUTE la ligne, y compris l'icone et le label
   - Submenu auto-ouvert quand on est sur une route enfant
   - Items sans submenu (Accueil/Messages/Notifications/Dashboard/...) =
     Link standard (navigation directe)
   ───────────────────────────────────────────────────────────── */

const COLLAPSED_WIDTH = 56;
const EXPANDED_WIDTH = 240;

interface SubItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavItem {
  label: string;
  href?: string; // facultatif : Creer n'a pas de page index, juste un submenu
  icon: LucideIcon;
  badge?: number;
  matchPrefixes?: string[];
  subItems?: SubItem[];
  /** Icone primary-colored pour signaler une action (cas Creer). */
  accent?: boolean;
}

interface SidebarProps {
  /** Force le mode etendu (utilise pour le drawer mobile). */
  forceExpanded?: boolean;
}

const EXPLORER_SUB: SubItem[] = [
  { label: "Biens", href: "/explorer", icon: Building2 },
  { label: "Boutique", href: "/boutique", icon: ShoppingBag },
  { label: "Formations", href: "/formations", icon: GraduationCap },
  { label: "Services", href: "/services", icon: Briefcase },
  { label: "Live", href: "/live", icon: Video },
  { label: "Événements", href: "/evenements", icon: CalendarDays },
];

const CREATE_SUB: SubItem[] = [
  { label: "Publier un bien", href: "/publier", icon: Building2 },
  { label: "Vendre un produit", href: "/boutique/vendre", icon: ShoppingBag },
  { label: "Créer une formation", href: "/formations/creer", icon: GraduationCap },
  { label: "Programmer un live", href: "/live", icon: Video },
  { label: "Créer un événement", href: "/evenements/creer", icon: CalendarDays },
  { label: "Proposer un service", href: "/services", icon: Briefcase },
];

const ESPACE_ITEMS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Apporteurs", href: "/apporteurs", icon: Handshake },
  { label: "Favoris", href: "/favoris", icon: Heart },
  { label: "Profil", href: "/profil", icon: UserIcon },
];

export function Sidebar({ forceExpanded = false }: SidebarProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const isExpanded = forceExpanded || isHovered;

  const unreadMessages = useMemo(
    () => conversations.reduce((sum, c) => sum + c.unreadCount, 0),
    []
  );
  const unreadNotifications = 3;

  const navItems: NavItem[] = useMemo(
    () => [
      { label: "Accueil", href: "/feed", icon: Home, matchPrefixes: ["/feed", "/"] },
      {
        label: "Explorer",
        href: "/explorer",
        icon: Search,
        matchPrefixes: ["/explorer", "/boutique", "/formations", "/services", "/live", "/evenements"],
        subItems: EXPLORER_SUB,
      },
      {
        label: "Messages",
        href: "/messages",
        icon: MessageCircle,
        badge: unreadMessages > 0 ? unreadMessages : undefined,
        matchPrefixes: ["/messages"],
      },
      {
        label: "Notifications",
        href: "/notifications",
        icon: Bell,
        badge: unreadNotifications > 0 ? unreadNotifications : undefined,
        matchPrefixes: ["/notifications"],
      },
    ],
    [unreadMessages]
  );

  /* Le groupe CRÉER n'est qu'un seul item parent collapsible. Il n'a
     pas de page index propre — uniquement un submenu de 6 actions. */
  const createItem: NavItem = {
    label: "Créer",
    icon: Plus,
    subItems: CREATE_SUB,
    accent: true,
    matchPrefixes: ["/publier", "/boutique/vendre", "/formations/creer", "/evenements/creer"],
  };

  const isItemActive = (item: { href?: string; matchPrefixes?: string[] }) => {
    if (item.matchPrefixes) {
      return item.matchPrefixes.some((p) =>
        p === "/" ? pathname === "/" : pathname.startsWith(p),
      );
    }
    if (item.href) return pathname.startsWith(item.href);
    return false;
  };
  const isExactActive = (href: string) => pathname === href;
  const isSubItemActive = (href: string) => {
    if (href === "/explorer") return pathname === "/explorer";
    return pathname.startsWith(href);
  };

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  useEffect(() => {
    // Auto-ouverture du submenu Explorer ou Creer selon la route active.
    if (isItemActive(navItems[1])) setOpenSubmenu("explorer");
    else if (isItemActive(createItem)) setOpenSubmenu("create");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!accountOpen) return;
    const onDown = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [accountOpen]);

  useEffect(() => {
    setAccountOpen(false);
  }, [pathname]);

  /* Rend un item parent avec submenu : toute la ligne est UN bouton
     (icone + label + chevron) qui toggle le submenu. */
  const renderParentWithSubmenu = (
    item: NavItem,
    submenuKey: string,
    submenu: SubItem[],
  ) => {
    const active = isItemActive(item);
    const subOpen = openSubmenu === submenuKey;
    const Icon = item.icon;
    return (
      <div key={submenuKey}>
        <button
          onClick={() => setOpenSubmenu(subOpen ? null : submenuKey)}
          aria-expanded={subOpen}
          title={!isExpanded ? item.label : undefined}
          className={cn(
            "w-full flex items-center gap-3 h-9 rounded-lg transition-colors whitespace-nowrap cursor-pointer",
            isExpanded ? "px-3" : "justify-center px-0",
            active && "font-medium",
          )}
          style={{
            background: active ? "rgba(30,157,241,0.10)" : "transparent",
            color: active ? "var(--primary)" : "var(--text-secondary)",
          }}
          onMouseEnter={(e) => {
            if (!active) e.currentTarget.style.background = "var(--hover-bg)";
          }}
          onMouseLeave={(e) => {
            if (!active) e.currentTarget.style.background = "transparent";
          }}
        >
          <Icon
            size={18}
            className="shrink-0"
            style={item.accent && !active ? { color: "var(--primary)" } : undefined}
          />
          {isExpanded && (
            <>
              <span className="truncate text-sm flex-1 text-left">{item.label}</span>
              <ChevronDown
                size={14}
                className={cn(
                  "shrink-0 transition-transform duration-150",
                  subOpen && "rotate-180",
                )}
                style={{ color: "var(--text-muted)" }}
              />
            </>
          )}
        </button>

        {/* Submenu inline (uniquement quand etendue) */}
        {isExpanded && subOpen && (
          <ul
            className="ml-5 mt-0.5 mb-1 pl-3 space-y-0.5"
            style={{ borderLeft: "1px solid var(--card-border)" }}
          >
            {submenu.map((sub) => {
              const SubIcon = sub.icon;
              const subActive = isSubItemActive(sub.href);
              return (
                <li key={sub.href}>
                  <Link
                    href={sub.href}
                    className="flex items-center gap-2 px-2 h-8 rounded-md text-xs transition-colors whitespace-nowrap"
                    style={{
                      background: subActive ? "rgba(30,157,241,0.10)" : "transparent",
                      color: subActive ? "var(--primary)" : "var(--text-muted)",
                      fontWeight: subActive ? 600 : 500,
                    }}
                    onMouseEnter={(e) => {
                      if (!subActive) e.currentTarget.style.background = "var(--hover-bg)";
                    }}
                    onMouseLeave={(e) => {
                      if (!subActive) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <SubIcon size={14} className="shrink-0" />
                    <span className="truncate">{sub.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  };

  /* Rend un item simple (Link, pas de submenu). */
  const renderSimpleLink = (
    item: { label: string; href: string; icon: LucideIcon; badge?: number },
    active: boolean,
  ) => {
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        title={!isExpanded ? item.label : undefined}
        className={cn(
          "flex items-center gap-3 h-9 rounded-lg transition-colors relative whitespace-nowrap",
          isExpanded ? "px-3" : "justify-center px-0",
          active && "font-medium",
        )}
        style={{
          background: active ? "rgba(30,157,241,0.10)" : "transparent",
          color: active ? "var(--primary)" : "var(--text-secondary)",
        }}
        onMouseEnter={(e) => {
          if (!active) e.currentTarget.style.background = "var(--hover-bg)";
        }}
        onMouseLeave={(e) => {
          if (!active) e.currentTarget.style.background = "transparent";
        }}
      >
        <div className="relative shrink-0">
          <Icon size={18} />
          {item.badge && item.badge > 0 && (
            <span
              className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] flex items-center justify-center rounded-full text-[10px] font-bold px-1"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              {item.badge}
            </span>
          )}
        </div>
        {isExpanded && <span className="truncate text-sm">{item.label}</span>}
      </Link>
    );
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH }}
      transition={{ type: "tween", ease: "easeOut", duration: 0.18 }}
      onMouseEnter={() => !forceExpanded && setIsHovered(true)}
      onMouseLeave={() => !forceExpanded && setIsHovered(false)}
      className="fixed left-0 top-0 h-screen flex flex-col z-40 overflow-hidden"
      style={{
        background: "var(--card)",
        borderRight: "1px solid var(--card-border)",
      }}
    >
      {/* Brand */}
      <Link
        href="/feed"
        className={cn(
          "flex items-center h-14 shrink-0 text-base font-semibold tracking-tight whitespace-nowrap",
          isExpanded ? "px-4" : "justify-center",
        )}
        title="Accueil"
      >
        <span style={{ color: "var(--primary)" }}>E</span>
        {isExpanded && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.16, delay: 0.04 }}
            style={{ color: "var(--foreground)" }}
          >
            -Dome
          </motion.span>
        )}
      </Link>

      <nav className="flex-1 overflow-y-auto px-2 py-2 no-scrollbar">
        {/* ─── GROUPE 1 : NAVIGUER ───────────────────────────── */}
        <SectionHeader label="Naviguer" expanded={isExpanded} />
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const active = isItemActive(item);
            if (item.subItems) {
              return renderParentWithSubmenu(item, "explorer", item.subItems);
            }
            return renderSimpleLink(
              { label: item.label, href: item.href!, icon: item.icon, badge: item.badge },
              active,
            );
          })}
        </div>

        {/* Separator */}
        <div className="my-3 h-px" style={{ background: "var(--card-border)" }} />

        {/* ─── GROUPE 2 : CRÉER ─────────────────────────────── */}
        <SectionHeader label="Créer" expanded={isExpanded} />
        <div className="space-y-0.5">
          {renderParentWithSubmenu(createItem, "create", CREATE_SUB)}
        </div>

        {/* Separator */}
        <div className="my-3 h-px" style={{ background: "var(--card-border)" }} />

        {/* ─── GROUPE 3 : MON ESPACE ────────────────────────── */}
        <SectionHeader label="Mon espace" expanded={isExpanded} />
        <div className="space-y-0.5">
          {ESPACE_ITEMS.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname.startsWith("/dashboard")
                : isExactActive(item.href);
            return renderSimpleLink(item, active);
          })}
        </div>
      </nav>

      {/* ─── Bas : Reglages ────────────────────────────────── */}
      <div
        className="px-2 py-2 relative shrink-0"
        style={{ borderTop: "1px solid var(--divider)" }}
        ref={accountRef}
      >
        <button
          onClick={() => setAccountOpen((v) => !v)}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg h-9 transition-colors cursor-pointer whitespace-nowrap",
            isExpanded ? "px-3" : "px-0 justify-center",
          )}
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          title={!isExpanded ? "Réglages" : undefined}
          aria-label="Ouvrir le menu compte"
          aria-expanded={accountOpen}
        >
          <Settings size={18} className="shrink-0" />
          {isExpanded && <span className="text-sm font-medium">Réglages</span>}
        </button>

        {accountOpen && (
          <div
            className="absolute z-50 rounded-xl py-1.5 animate-fade-in"
            style={{
              bottom: "calc(100% + 4px)",
              left: isExpanded ? 8 : COLLAPSED_WIDTH,
              right: isExpanded ? 8 : "auto",
              width: isExpanded ? "auto" : 220,
              background: "var(--card)",
              border: "1px solid var(--card-border)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            {[
              { label: "Paramètres", href: "/parametres", icon: Settings },
              { label: "Aide", href: "/aide", icon: HelpCircle },
            ].map((it) => {
              const Icon = it.icon;
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className="flex items-center gap-3 px-3 py-2 text-sm transition-colors"
                  style={{ color: "var(--foreground)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  onClick={() => setAccountOpen(false)}
                >
                  <Icon size={14} style={{ color: "var(--text-muted)" }} />
                  <span>{it.label}</span>
                </Link>
              );
            })}
            <div className="my-1 h-px" style={{ background: "var(--divider)" }} />
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 text-sm transition-colors"
              style={{ color: "var(--destructive)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "color-mix(in srgb, var(--destructive) 14%, transparent)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              onClick={() => setAccountOpen(false)}
            >
              <LogOut size={14} />
              <span>Quitter la maquette</span>
            </Link>
          </div>
        )}
      </div>
    </motion.aside>
  );
}

function SectionHeader({ label, expanded }: { label: string; expanded: boolean }) {
  if (!expanded) return null;
  return (
    <div
      className="px-3 pt-1 pb-1.5 text-[10px] font-semibold uppercase tracking-wider"
      style={{ color: "var(--text-muted)" }}
    >
      {label}
    </div>
  );
}
