"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Search,
  Plus,
  MessageCircle,
  User,
  HomeIcon,
  Store,
  GraduationCap,
  Radio,
  CalendarPlus,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { LottiePlayer } from "@/components/ui/lottie-player";

interface MobileNavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  isPrimary?: boolean;
}

/* 5 onglets : Accueil · Explorer · + Créer (centre) · Messages · Profil.
   Toutes les autres routes (Dashboard, Notifications, Paramètres, etc.)
   sont accessibles depuis le Profil ou la sidebar overlay (hamburger header). */
const navItems: MobileNavItem[] = [
  { href: "/feed", icon: Home, label: "Accueil" },
  { href: "/explorer", icon: Search, label: "Explorer" },
  { href: "/publier", icon: Plus, label: "Créer", isPrimary: true },
  { href: "/messages", icon: MessageCircle, label: "Messages" },
  { href: "/profil", icon: User, label: "Profil" },
];

const publishMenuItems: { icon: LucideIcon; label: string; href: string }[] = [
  { icon: HomeIcon, label: "Publier un bien", href: "/publier" },
  { icon: Store, label: "Vendre un produit", href: "/boutique/vendre" },
  { icon: GraduationCap, label: "Créer une formation", href: "/formations/creer" },
  { icon: Radio, label: "Programmer un live", href: "/live" },
  { icon: CalendarPlus, label: "Créer un événement", href: "/evenements/creer" },
  { icon: Wrench, label: "Proposer un service", href: "/services" },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      aria-label="Navigation mobile"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden flex items-center justify-around px-2"
      style={{
        background: "var(--card)",
        borderTop: "1px solid var(--card-border)",
        height: "calc(64px + env(safe-area-inset-bottom))",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {navItems.map((item) => {
        const active =
          item.href === "/feed"
            ? pathname === "/feed" || pathname === "/"
            : pathname.startsWith(item.href);
        const Icon = item.icon;

        if (item.isPrimary) {
          return (
            <div key={item.href} className="relative flex flex-col items-center gap-1" ref={menuRef}>
              {/* Popup menu */}
              {menuOpen && (
                <div
                  className="absolute bottom-14 left-1/2 -translate-x-1/2 w-56 rounded-xl border shadow-xl py-2 animate-fade-in"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--card-border)",
                  }}
                >
                  {publishMenuItems.map((mi) => {
                    const ItemIcon = mi.icon;
                    return (
                      <button
                        key={mi.href}
                        onClick={() => {
                          setMenuOpen(false);
                          router.push(mi.href);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors"
                        style={{ color: "var(--foreground)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <ItemIcon size={18} className="text-[var(--accent)]" />
                        <span>{mi.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center -mt-4 transition-transform"
                  style={{
                    background: "var(--primary)",
                    boxShadow: "0 4px 12px rgba(30,157,241,0.25)",
                    transform: menuOpen ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                >
                  {menuOpen ? (
                    <LottiePlayer src="/lottie/lottieflow-menu-nav-09-000000-easey.json" width={24} height={24} />
                  ) : (
                    <Icon size={22} color="#ffffff" />
                  )}
                </div>
                <span
                  className="text-[10px]"
                  style={{ color: "var(--primary)" }}
                >
                  {item.label}
                </span>
              </button>
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            aria-current={active ? "page" : undefined}
            className="flex flex-col items-center justify-center gap-1 px-3 min-w-[44px] min-h-[44px] active:opacity-60 transition-opacity"
            style={{ color: active ? "var(--primary)" : "var(--text-muted)" }}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
