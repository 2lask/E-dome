"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Plus,
  MessageCircle,
  User,
  type LucideIcon,
} from "lucide-react";
import { useSession } from "@/lib/use-session";
import { useActor } from "@/lib/use-actor";

interface MobileNavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  isPrimary?: boolean;
}

/* 5 onglets : Accueil · Explorer · + Publier (centre) · Messages · Profil.
   Toutes les autres routes (Dashboard, Notifications, Paramètres, etc.)
   sont accessibles depuis le Profil ou la sidebar overlay (hamburger header).

   V1 « E-Dome Pro » (STRATEGIE.md / PLAN-V1.md, chantier C1) : le bouton
   central mène directement à « Publier un bien », l'action de création du
   parcours professionnel. L'ancien menu multi-pôles (formation, live,
   événement, service) est retiré du premier plan — ces routes existent
   toujours et restent atteignables, elles ne sont simplement plus mises en
   avant au lancement. */
const navItems: MobileNavItem[] = [
  { href: "/feed", icon: Home, label: "Accueil" },
  { href: "/explorer", icon: Search, label: "Explorer" },
  { href: "/publier", icon: Plus, label: "Publier", isPrimary: true },
  { href: "/messages", icon: MessageCircle, label: "Messages" },
  { href: "/profil", icon: User, label: "Profil" },
];

export function MobileNav() {
  const pathname = usePathname();
  /* Le compteur de messages non lus de la mémoire de session — le même que
     la barre latérale. Sur mobile, les notifications non lues sont portées
     par la cloche de l'en-tête et par le menu (barre latérale en tiroir),
     qui lisent le même compteur unique. */
  const { unreadMessages } = useSession();
  /* L'onglet Profil porte le visage de la personne incarnée (chantier P3). */
  const actor = useActor();
  const badgeFor = (href: string) => (href === "/messages" ? unreadMessages : 0);

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
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className="relative flex flex-col items-center gap-1"
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center -mt-4 transition-transform active:scale-95"
                style={{
                  background: "var(--primary)",
                  boxShadow: "0 4px 12px rgba(245, 113, 50,0.25)",
                }}
              >
                <Icon size={22} color="#ffffff" />
              </div>
              <span className="text-[10px]" style={{ color: "var(--primary)" }}>
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={badgeFor(item.href) > 0 ? `${item.label}, ${badgeFor(item.href)} non lus` : item.label}
            aria-current={active ? "page" : undefined}
            className="relative flex flex-col items-center justify-center gap-1 px-3 min-w-[44px] min-h-[44px] active:opacity-60 transition-opacity"
            style={{ color: active ? "var(--primary)" : "var(--text-muted)" }}
          >
            {item.href === "/profil" ? (
              <img
                src={actor.avatar}
                alt=""
                className="h-5 w-5 rounded-full object-cover"
                style={{ outline: active ? "2px solid var(--primary)" : "none", outlineOffset: 1 }}
              />
            ) : (
              <Icon size={20} />
            )}
            {badgeFor(item.href) > 0 && (
              <span
                aria-hidden
                className="absolute top-0.5 right-1 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-semibold leading-4 text-center"
                style={{ background: "var(--primary)", color: "#ffffff" }}
              >
                {badgeFor(item.href)}
              </span>
            )}
            <span className="text-[10px] font-medium">{item.href === "/profil" ? actor.firstName : item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
