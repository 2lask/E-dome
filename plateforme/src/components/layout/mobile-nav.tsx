"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, MessageCircle, User } from "lucide-react";

interface MobileNavItem {
  href: string;
  icon: React.ElementType;
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

export function MobileNav() {
  const pathname = usePathname();

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
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1"
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center -mt-4 shadow-lg"
                style={{ background: "var(--gold)" }}
              >
                <Icon size={22} color="#000" />
              </div>
              <span
                className="text-[10px]"
                style={{ color: "var(--gold)" }}
              >
                {item.label}
              </span>
            </Link>
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
