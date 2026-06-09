"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  ChevronLeft,
  ChevronRight,
  Building2,
  ShoppingBag,
  GraduationCap,
  Video,
  CalendarDays,
  Briefcase,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { conversations } from "@/lib/mock-data";
import { QuickLauncher } from "./quick-launcher";

/* ─────────────────────────────────────────────────────────────
   Sidebar refonte épurée — 6 entrées visibles.
   - Accueil, Explorer, Messages, Dashboard, +Créer (popover),
     Avatar (popover Profil/Paramètres/Notifications/Quitter).
   - Toutes les routes existantes restent accessibles. Les anciennes
     entrées /formations, /services, /boutique, /live, /evenements
     seront atteintes via le hub Explorer (Étape 3) ; /statistiques,
     /reservations, /apporteurs, /favoris via les onglets Dashboard
     (Étape 3). En attendant, leurs URLs directes fonctionnent.
   ───────────────────────────────────────────────────────────── */

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const CREATE_ITEMS: { label: string; href: string; icon: LucideIcon; desc: string }[] = [
  { label: "Publier un bien", href: "/publier", icon: Building2, desc: "Vente ou location" },
  { label: "Vendre un produit", href: "/boutique/vendre", icon: ShoppingBag, desc: "Catalogue boutique" },
  { label: "Créer une formation", href: "/formations/creer", icon: GraduationCap, desc: "Cours en ligne" },
  { label: "Programmer un live", href: "/live", icon: Video, desc: "Diffusion en direct" },
  { label: "Créer un événement", href: "/evenements/creer", icon: CalendarDays, desc: "Atelier, visite, salon" },
  { label: "Proposer un service", href: "/services", icon: Briefcase, desc: "Prestataire / artisan" },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const unreadMessages = useMemo(
    () => conversations.reduce((sum, c) => sum + c.unreadCount, 0),
    []
  );

  const navItems: NavItem[] = useMemo(
    () => [
      { label: "Accueil", href: "/feed", icon: Home },
      { label: "Explorer", href: "/explorer", icon: Search },
      { label: "Messages", href: "/messages", icon: MessageCircle, badge: unreadMessages > 0 ? unreadMessages : undefined },
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
    [unreadMessages]
  );

  const isActive = (href: string) => {
    if (href === "/feed") return pathname === "/feed" || pathname === "/";
    return pathname.startsWith(href);
  };

  const [createOpen, setCreateOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [launcherOpen, setLauncherOpen] = useState(false);

  // Raccourci global Cmd+K / Ctrl+K pour ouvrir le launcher
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
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!createOpen && !avatarOpen) return;
    const onDown = (e: MouseEvent) => {
      if (createOpen && createRef.current && !createRef.current.contains(e.target as Node)) {
        setCreateOpen(false);
      }
      if (avatarOpen && avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [createOpen, avatarOpen]);

  useEffect(() => {
    setCreateOpen(false);
    setAvatarOpen(false);
  }, [pathname]);

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col z-40 transition-all duration-300 overflow-hidden"
      style={{
        width: collapsed ? 72 : 240,
        background: "var(--card)",
        borderRight: "1px solid var(--card-border)",
      }}
    >
      {/* Brand + toggle */}
      <div className="flex items-center justify-between px-4 h-16 shrink-0">
        {!collapsed && (
          <Link href="/feed" className="text-xl font-semibold tracking-tight">
            <span style={{ color: "var(--primary)" }}>E-</span>
            <span style={{ color: "var(--foreground)" }}>Dome</span>
          </Link>
        )}
        <button
          onClick={onToggle}
          aria-label={collapsed ? "Agrandir la barre latérale" : "Réduire la barre latérale"}
          aria-expanded={!collapsed}
          className="flex items-center justify-center w-11 h-11 rounded-lg transition-colors cursor-pointer"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Bouton "Tout" — lanceur d'accès rapide à toutes les fonctionnalités.
          Ne surcharge pas la sidebar (qui reste à 6 entrées) — ouvre un
          panneau plein écran avec recherche + grille de catégories. */}
      <div className="px-3 pt-1 pb-1">
        <button
          onClick={() => setLauncherOpen(true)}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl transition-colors cursor-pointer",
            collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"
          )}
          style={{
            background: "var(--hover-bg)",
            color: "var(--foreground)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--card-border)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
          title={collapsed ? "Tout (⌘K)" : "Toutes les fonctionnalités"}
        >
          <LayoutGrid size={18} />
          {!collapsed && (
            <>
              <span className="font-medium text-sm">Tout</span>
              <span
                className="ml-auto text-[10px] px-1.5 py-0.5 rounded-md font-medium tabular-nums"
                style={{
                  background: "var(--card)",
                  color: "var(--text-muted)",
                  border: "1px solid var(--card-border)",
                }}
              >
                ⌘K
              </span>
            </>
          )}
        </button>
      </div>

      <QuickLauncher open={launcherOpen} onClose={() => setLauncherOpen(false)} />

      {/* Bouton + Créer */}
      <div className="px-3 pt-1 pb-2 relative" ref={createRef}>
        <button
          onClick={() => setCreateOpen((v) => !v)}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl transition-all duration-200 cursor-pointer",
            collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"
          )}
          style={{
            background: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
          title={collapsed ? "Créer" : undefined}
        >
          <Plus size={18} strokeWidth={2.4} />
          {!collapsed && <span className="font-medium text-sm">Créer</span>}
        </button>

        {createOpen && (
          <div
            className="absolute z-50 rounded-xl py-1.5 animate-fade-in"
            style={{
              top: "100%",
              left: collapsed ? 64 : 12,
              right: collapsed ? "auto" : 12,
              width: collapsed ? 280 : "auto",
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
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "var(--hover-bg)", color: "var(--text-secondary)" }}
                  >
                    <Icon size={16} />
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

      {/* Nav principale */}
      <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5 no-scrollbar">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
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
              <div className="relative">
                <Icon size={20} />
                {item.badge && item.badge > 0 && (
                  <span
                    className="absolute -top-2 -right-2 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold px-1"
                    style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Menu compte — trigger discret, sans photo de profil ni nom.
          La popover (Profil / Notifications / Parametres / Quitter) reste
          accessible mais le visuel ne s'impose plus en bas de sidebar. */}
      <div className="px-3 py-3 relative" style={{ borderTop: "1px solid var(--divider)" }} ref={avatarRef}>
        <button
          onClick={() => setAvatarOpen((v) => !v)}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl transition-all duration-200 cursor-pointer",
            collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"
          )}
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          title={collapsed ? "Compte" : undefined}
          aria-label="Ouvrir le menu compte"
          aria-expanded={avatarOpen}
        >
          <Settings size={18} />
          {!collapsed && <span className="text-sm font-medium">Compte</span>}
        </button>

        {avatarOpen && (
          <div
            className="absolute z-50 rounded-xl py-1.5 animate-fade-in"
            style={{
              bottom: "calc(100% + 4px)",
              left: collapsed ? 64 : 12,
              right: collapsed ? "auto" : 12,
              width: collapsed ? 220 : "auto",
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
                  onClick={() => setAvatarOpen(false)}
                >
                  <Icon size={16} style={{ color: "var(--text-muted)" }} />
                  <span>{it.label}</span>
                </Link>
              );
            })}
            <div className="my-1 h-px" style={{ background: "var(--divider)" }} />
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 text-sm transition-colors"
              style={{ color: "var(--destructive)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "color-mix(in srgb, var(--destructive) 14%, transparent)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              onClick={() => setAvatarOpen(false)}
            >
              <LogOut size={16} />
              <span>Quitter la maquette</span>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
