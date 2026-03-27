"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/feed", label: "Feed", icon: Home },
  { href: "/explorer", label: "Explorer", icon: Search },
  { href: "/publier", label: "Publier", icon: PlusCircle, isCenter: true },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/profil", label: "Profil", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 md:hidden">
      <div className="glass border-t border-[var(--card-border)]">
        <div
          className="flex items-center justify-around px-2"
          style={{ height: 64, paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            if (item.isCenter) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center justify-center gap-0.5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#C4956A] to-[#D4A574] shadow-lg shadow-[#C4956A]/30">
                    <Icon className="h-5 w-5 text-black" />
                  </div>
                  <span className="text-[10px] font-medium text-[#C4956A]">
                    {item.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 px-3 py-1 transition-colors",
                  isActive ? "text-[#C4956A]" : "text-[var(--text-secondary)]"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "text-[#C4956A]")} />
                <span className={cn(
                  "text-[10px] font-medium",
                  isActive ? "text-[#C4956A]" : "text-[var(--text-secondary)]"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
