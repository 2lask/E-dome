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
  type LucideIcon,
} from "lucide-react";
import { LottiePlayer } from "@/components/ui/lottie-player";

interface MobileNavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  isGold?: boolean;
}

const navItems: MobileNavItem[] = [
  { href: "/feed", icon: Home, label: "Feed" },
  { href: "/explorer", icon: Search, label: "Explorer" },
  { href: "/publier", icon: Plus, label: "Publier", isGold: true },
  { href: "/messages", icon: MessageCircle, label: "Messages" },
  { href: "/profil", icon: User, label: "Profil" },
];

const publishMenuItems = [
  { emoji: "\u{1F4DD}", label: "Publier un post", href: "/creer-post" },
  { emoji: "\u{1F3AC}", label: "Créer un Reel", href: "/creer-reel" },
  { emoji: "\u{1F3E0}", label: "Publier un bien", href: "/publier" },
  { emoji: "\u{1F4DA}", label: "Créer une formation", href: "/formations/creer" },
  { emoji: "\u{1F4E1}", label: "Programmer un live", href: "/live" },
  { emoji: "\u{1F4C5}", label: "Créer un événement", href: "/evenements/creer" },
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
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden flex items-center justify-around h-16 px-2"
      style={{
        background: "var(--card)",
        borderTop: "1px solid var(--card-border)",
      }}
    >
      {navItems.map((item) => {
        const active =
          item.href === "/feed"
            ? pathname === "/feed" || pathname === "/"
            : pathname.startsWith(item.href);
        const Icon = item.icon;

        if (item.isGold) {
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
                  {publishMenuItems.map((mi) => (
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
                      <span className="text-base">{mi.emoji}</span>
                      <span>{mi.label}</span>
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center -mt-4 shadow-lg transition-transform"
                  style={{
                    background: "var(--gold)",
                    transform: menuOpen ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                >
                  {menuOpen ? (
                    <LottiePlayer src="/lottie/lottieflow-menu-nav-09-000000-easey.json" width={24} height={24} />
                  ) : (
                    <Icon size={22} color="#000" />
                  )}
                </div>
                <span
                  className="text-[10px]"
                  style={{ color: "var(--gold)" }}
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
            className="flex flex-col items-center gap-1 py-1 px-3"
            style={{ color: active ? "var(--gold)" : "var(--text-muted)" }}
          >
            <Icon size={20} />
            <span className="text-[10px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
