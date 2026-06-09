"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Search,
  MessageCircle,
  LayoutDashboard,
  Plus,
  Settings,
  Bell,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Building2,
  ShoppingBag,
  GraduationCap,
  Video,
  CalendarDays,
  Briefcase,
  LayoutGrid,
  FileText,
  BarChart3,
  Users,
  CalendarCheck,
  Heart,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { conversations } from "@/lib/mock-data";
import { QuickLauncher } from "./quick-launcher";

/* ─────────────────────────────────────────────────────────────
   Sidebar — refonte hover-to-expand + submenus.

   - Largeur 56px par defaut (collapsed). Au survol souris,
     elle se deroule a 280px en overlay au-dessus du contenu
     (le contenu ne se decale pas — pattern Linear/Notion).
   - Sous-menus collapsibles sur Explorer (Biens/Boutique/
     Formations/Services/Live/Evenements) et Dashboard (Vue
     ensemble/Annonces/Statistiques/Reservations/Apporteurs/
     Favoris) — auto-ouverts quand on est sur une page enfant.
   - Bas de sidebar : "Compte" sobre (Settings icon, pas de
     photo ni de nom) qui ouvre le menu Profil/Notifications/
     Parametres/Quitter.
   - Mobile : la sidebar n'est pas affichee (md:hidden dans le
     layout). Pour le drawer mobile, on passe forceExpanded.
   ───────────────────────────────────────────────────────────── */

const COLLAPSED_WIDTH = 56;
const EXPANDED_WIDTH = 280;

interface SubItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  /** Routes qui rendent ce parent actif. */
  matchPrefixes?: string[];
  /** Sous-menu optionnel. */
  subItems?: SubItem[];
}

interface SidebarProps {
  /** Force le mode etendu (utilise pour le drawer mobile). */
  forceExpanded?: boolean;
}

const CREATE_ITEMS: { label: string; href: string; icon: LucideIcon; desc: string }[] = [
  { label: "Publier un bien", href: "/publier", icon: Building2, desc: "Vente ou location" },
  { label: "Vendre un produit", href: "/boutique/vendre", icon: ShoppingBag, desc: "Catalogue boutique" },
  { label: "Créer une formation", href: "/formations/creer", icon: GraduationCap, desc: "Cours en ligne" },
  { label: "Programmer un live", href: "/live", icon: Video, desc: "Diffusion en direct" },
  { label: "Créer un événement", href: "/evenements/creer", icon: CalendarDays, desc: "Atelier, visite, salon" },
  { label: "Proposer un service", href: "/services", icon: Briefcase, desc: "Prestataire / artisan" },
];

const EXPLORER_SUB: SubItem[] = [
  { label: "Biens", href: "/explorer", icon: Building2 },
  { label: "Boutique", href: "/boutique", icon: ShoppingBag },
  { label: "Formations", href: "/formations", icon: GraduationCap },
  { label: "Services", href: "/services", icon: Briefcase },
  { label: "Live", href: "/live", icon: Video },
  { label: "Événements", href: "/evenements", icon: CalendarDays },
];

const DASHBOARD_SUB: SubItem[] = [
  { label: "Vue d'ensemble", href: "/dashboard", icon: LayoutDashboard },
  { label: "Annonces", href: "/dashboard/annonces", icon: FileText },
  { label: "Statistiques", href: "/statistiques", icon: BarChart3 },
  { label: "Réservations", href: "/reservations", icon: CalendarCheck },
  { label: "Apporteurs", href: "/apporteurs", icon: Users },
  { label: "Favoris", href: "/favoris", icon: Heart },
];

export function Sidebar({ forceExpanded = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const isExpanded = forceExpanded || isHovered;

  const unreadMessages = useMemo(
    () => conversations.reduce((sum, c) => sum + c.unreadCount, 0),
    []
  );

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
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        matchPrefixes: ["/dashboard", "/statistiques", "/reservations", "/apporteurs", "/favoris"],
        subItems: DASHBOARD_SUB,
      },
    ],
    [unreadMessages]
  );

  const isItemActive = (item: NavItem) => {
    if (!item.matchPrefixes) return pathname.startsWith(item.href);
    return item.matchPrefixes.some((p) => (p === "/" ? pathname === "/" : pathname.startsWith(p)));
  };
  const isSubItemActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/explorer") return pathname === "/explorer";
    return pathname.startsWith(href);
  };

  // Submenu : auto-ouvert quand l'item parent est actif.
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  useEffect(() => {
    const active = navItems.find((it) => it.subItems && isItemActive(it));
    if (active) setOpenSubmenu(active.href);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const [createOpen, setCreateOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [launcherOpen, setLauncherOpen] = useState(false);

  // Cmd+K / Ctrl+K : ouvre le QuickLauncher.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setLauncherOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const createRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!createOpen && !accountOpen) return;
    const onDown = (e: MouseEvent) => {
      if (createOpen && createRef.current && !createRef.current.contains(e.target as Node)) {
        setCreateOpen(false);
      }
      if (accountOpen && accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [createOpen, accountOpen]);

  useEffect(() => {
    setCreateOpen(false);
    setAccountOpen(false);
  }, [pathname]);

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
      {/* Brand : "E" seul en collapsed (logo), "E-Dome" en deroule.
          Le tiret apparait/disparait avec "Dome" pour eviter l'orphelin "E-". */}
      <Link
        href="/feed"
        className={cn(
          "flex items-center h-14 shrink-0 text-base font-semibold tracking-tight whitespace-nowrap",
          isExpanded ? "px-4" : "justify-center"
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

      {/* Tout (Cmd+K) */}
      <div className="px-2 pb-1">
        <button
          onClick={() => setLauncherOpen(true)}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg transition-colors cursor-pointer h-9 whitespace-nowrap",
            isExpanded ? "px-3" : "px-0 justify-center"
          )}
          style={{ background: "var(--hover-bg)", color: "var(--foreground)" }}
          title={!isExpanded ? "Tout (⌘K)" : undefined}
        >
          <LayoutGrid size={16} className="shrink-0" />
          {isExpanded && (
            <>
              <span className="text-sm font-medium flex-1 text-left">Tout</span>
              <kbd
                className="text-[10px] px-1.5 py-0.5 rounded font-medium tabular-nums shrink-0"
                style={{
                  background: "var(--card)",
                  color: "var(--text-muted)",
                  border: "1px solid var(--card-border)",
                }}
              >
                ⌘K
              </kbd>
            </>
          )}
        </button>
      </div>

      <QuickLauncher open={launcherOpen} onClose={() => setLauncherOpen(false)} />

      {/* Créer */}
      <div className="px-2 pb-2 relative" ref={createRef}>
        <button
          onClick={() => setCreateOpen((v) => !v)}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg h-9 cursor-pointer whitespace-nowrap",
            isExpanded ? "px-3" : "px-0 justify-center"
          )}
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          title={!isExpanded ? "Créer" : undefined}
        >
          <Plus size={16} strokeWidth={2.4} className="shrink-0" />
          {isExpanded && <span className="text-sm font-medium">Créer</span>}
        </button>

        {createOpen && (
          <div
            className="absolute z-50 rounded-xl py-1.5 animate-fade-in"
            style={{
              top: "100%",
              left: isExpanded ? 8 : COLLAPSED_WIDTH,
              right: isExpanded ? 8 : "auto",
              width: isExpanded ? "auto" : 280,
              background: "var(--card)",
              border: "1px solid var(--card-border)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            {CREATE_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  onClick={() => {
                    setCreateOpen(false);
                    router.push(item.href);
                  }}
                  className="w-full flex items-start gap-3 px-3 py-2 text-left transition-colors"
                  style={{ color: "var(--foreground)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "var(--hover-bg)", color: "var(--text-secondary)" }}
                  >
                    <Icon size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium leading-tight">{item.label}</span>
                    <span className="text-[11px] leading-tight" style={{ color: "var(--text-muted)" }}>
                      {item.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Nav principale + sous-menus */}
      <nav className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5 no-scrollbar">
        {navItems.map((item) => {
          const active = isItemActive(item);
          const Icon = item.icon;
          const hasSub = !!item.subItems && isExpanded;
          const subOpen = openSubmenu === item.href;

          return (
            <div key={item.href}>
              <div className="flex items-center">
                <Link
                  href={item.href}
                  title={!isExpanded ? item.label : undefined}
                  className={cn(
                    "flex-1 flex items-center gap-3 h-9 rounded-lg transition-colors relative whitespace-nowrap",
                    isExpanded ? "px-3" : "justify-center px-0",
                    active && "font-medium"
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
                {hasSub && (
                  <button
                    onClick={() => setOpenSubmenu(subOpen ? null : item.href)}
                    aria-label={subOpen ? "Replier" : "Déplier"}
                    aria-expanded={subOpen}
                    className="p-1.5 mr-0.5 rounded transition-colors shrink-0"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <ChevronDown
                      size={14}
                      className={cn("transition-transform duration-150", subOpen && "rotate-180")}
                    />
                  </button>
                )}
              </div>

              {/* Sous-menu */}
              {hasSub && subOpen && (
                <ul
                  className="ml-5 mt-0.5 mb-1 pl-3 space-y-0.5"
                  style={{ borderLeft: "1px solid var(--card-border)" }}
                >
                  {item.subItems!.map((sub) => {
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
        })}
      </nav>

      {/* Compte (Settings) */}
      <div
        className="px-2 py-2 relative shrink-0"
        style={{ borderTop: "1px solid var(--divider)" }}
        ref={accountRef}
      >
        <button
          onClick={() => setAccountOpen((v) => !v)}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg h-9 transition-colors cursor-pointer whitespace-nowrap",
            isExpanded ? "px-3" : "px-0 justify-center"
          )}
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          title={!isExpanded ? "Compte" : undefined}
          aria-label="Ouvrir le menu compte"
          aria-expanded={accountOpen}
        >
          <Settings size={18} className="shrink-0" />
          {isExpanded && <span className="text-sm font-medium">Compte</span>}
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
              { label: "Profil", href: "/profil", icon: UserIcon },
              { label: "Notifications", href: "/notifications", icon: Bell },
              { label: "Paramètres", href: "/parametres", icon: Settings },
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
