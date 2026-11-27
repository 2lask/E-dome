"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coins, Plus, Search } from "lucide-react";
import { navFor, isNavActive, COMMAND_OPEN_EVENT, type NavEntry } from "@/lib/nav";
import type { SessionUser } from "@/lib/session-user";
import { Brand } from "@/components/layout/brand";
import { AccountMenu } from "@/components/layout/account-menu";
import { cn } from "@/lib/utils";

/* ── Barre latérale (REBUILD.md §3.2–3.3) ────────────────────────────────────

   Membre  : marque · recherche ⌘K · « Publier un bien » · 5 entrées · compte.
   Visiteur : marque · recherche · 3 entrées · invitation à créer un compte.
   Jamais de compte fictif : un visiteur voit qu'il est visiteur.

   Les compteurs (`counts`) sont RÉELS ou absents — jamais inventés. */

export const SIDEBAR_WIDTH = 240;

export function AppSidebar({
  user,
  counts = {},
}: {
  user: SessionUser | null;
  counts?: Partial<Record<NavEntry["key"], number>>;
}) {
  const pathname = usePathname();
  const entries = navFor(!!user);

  return (
    <aside
      className="fixed inset-y-0 left-0 z-30 hidden flex-col border-r bg-sidebar md:flex"
      style={{ width: SIDEBAR_WIDTH }}
      aria-label="Navigation principale"
    >
      <div className="flex h-14 shrink-0 items-center px-4">
        <Brand />
      </div>

      <div className="px-3">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent(COMMAND_OPEN_EVENT))}
          className="flex h-9 w-full items-center gap-2 rounded-lg border bg-card px-2.5 text-[13px] text-muted-foreground shadow-xs hover:border-foreground/20 hover:text-foreground"
        >
          <Search className="h-4 w-4" aria-hidden />
          <span className="flex-1 text-left">Rechercher…</span>
          <kbd className="rounded border bg-subtle px-1 font-mono text-[10.5px]">⌘K</kbd>
        </button>
      </div>

      <nav className="mt-4 flex-1 overflow-y-auto px-3" aria-label="Sections">
        <ul className="space-y-0.5">
          {entries.map((e) => (
            <li key={e.key}>
              <SidebarLink entry={e} active={isNavActive(e, pathname)} count={counts[e.key]} />
            </li>
          ))}
        </ul>

        <Link
          href="/publier"
          className="mt-4 flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-primary text-[13px] font-medium text-primary-foreground shadow-xs hover:bg-primary/88"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Publier un bien
        </Link>
        <p className="mt-2 px-1 text-center text-[11.5px] text-muted-foreground">Gratuit · sans commission d&apos;agence</p>
      </nav>

      <div className="shrink-0 border-t p-3">
        {user ? (
          <AccountMenu user={user} />
        ) : (
          <div className="v3-beam v3-beam--cine rounded-2xl">
            <div className="v3-beam__inner cine relative rounded-2xl p-3.5">
              <div aria-hidden className="v3-orb v3-orb--gold -right-10 -top-12 h-28 w-28" />
              <div aria-hidden className="v3-orb v3-orb--leman -bottom-14 -left-10 h-28 w-28" />
              <div className="relative">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e3b85c]/35 bg-[#d9a441]/15 text-[#f2c66b] shadow-[0_0_24px_-6px_rgb(217_164_65/0.8)]">
                  <Coins className="h-4 w-4" aria-hidden />
                </span>
                <p className="mt-3 text-[14px] font-semibold leading-snug tracking-[-0.01em] text-white">
                  Votre réseau <span className="cine-gold">vaut de l&apos;argent.</span>
                </p>
                <p className="mt-1 text-[12px] leading-snug text-white/60">
                  Créez un compte pour publier gratuitement et toucher des commissions.
                </p>
                <div className="mt-3 grid gap-1">
                  <Link
                    href="/auth/inscription"
                    className="cine-btn-gold v3-sheen flex h-11 items-center justify-center rounded-lg text-[13px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2c66b]"
                  >
                    Créer un compte
                  </Link>
                  <Link
                    href="/auth/connexion"
                    className="flex h-11 items-center justify-center rounded-lg text-[13px] font-medium text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#f2c66b]"
                  >
                    Se connecter
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function SidebarLink({ entry, active, count }: { entry: NavEntry; active: boolean; count?: number }) {
  const Icon = entry.icon;
  return (
    <Link
      href={entry.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13.5px]",
        active
          ? "bg-sidebar-accent font-medium text-foreground"
          : "text-foreground/75 hover:bg-sidebar-accent/70 hover:text-foreground",
      )}
    >
      <Icon
        className={cn("h-[17px] w-[17px] shrink-0", active ? "text-leman" : "text-muted-foreground group-hover:text-foreground")}
        aria-hidden
      />
      <span className="flex-1 truncate">{entry.label}</span>
      {count ? (
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-leman px-1.5 text-[11px] font-semibold tabular-nums text-white dark:text-[#0d1513]">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
