"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Search, UserRound } from "lucide-react";
import { navFor, isNavActive, COMMAND_OPEN_EVENT, type NavEntry } from "@/lib/nav";
import type { SessionUser } from "@/lib/session-user";
import { Brand } from "@/components/layout/brand";
import { AccountMenu } from "@/components/layout/account-menu";
import { cn } from "@/lib/utils";

/* ── Mobile : barre du haut + barre d'onglets (REBUILD.md §3.2) ──────────────

   Haut : la marque, la recherche (menu de commande), le compte — ou
   « Connexion » pour un visiteur.
   Bas : cinq onglets, « Publier » au centre. Membre : Accueil · Explorer ·
   Publier · Demandes · Gagner. Visiteur : Accueil · Explorer · Publier ·
   Gagner · Compte. « Mes biens » est sur l'accueil et dans le menu ⌘K. */

export function MobileTopBar({ user }: { user: SessionUser | null }) {
  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/85 px-4 backdrop-blur-md md:hidden"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <Brand />
      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Rechercher"
          onClick={() => window.dispatchEvent(new CustomEvent(COMMAND_OPEN_EVENT))}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground/80 hover:bg-accent"
        >
          <Search className="h-[18px] w-[18px]" aria-hidden />
        </button>
        {user ? (
          <AccountMenu user={user} variant="compact" />
        ) : (
          <Link
            href="/auth/connexion"
            className="flex h-8.5 items-center rounded-lg border bg-card px-3 text-[13px] font-medium"
          >
            Connexion
          </Link>
        )}
      </div>
    </header>
  );
}

export function MobileTabBar({
  user,
  counts = {},
}: {
  user: SessionUser | null;
  counts?: Partial<Record<NavEntry["key"], number>>;
}) {
  const pathname = usePathname();
  /* Cinq onglets au plus : « Mes biens » et « Recherches » passent par l'accueil,
     l'Explorer et le menu de recherche. */
  const nav = navFor(!!user).filter((e) => e.key !== "mes-biens" && e.key !== "tableau" && e.key !== "messages");
  /* Les deux premiers onglets, Publier au centre, puis le reste. */
  const left = nav.slice(0, 2);
  const right = nav.slice(2);

  return (
    <nav
      aria-label="Navigation mobile"
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t bg-card/95 backdrop-blur-md md:hidden"
      style={{ height: "calc(62px + env(safe-area-inset-bottom))", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {left.map((e) => (
        <Tab key={e.key} entry={e} active={isNavActive(e, pathname)} count={counts[e.key]} />
      ))}

      <Link
        href="/publier"
        aria-label="Publier un bien"
        aria-current={pathname.startsWith("/publier") ? "page" : undefined}
        className="flex flex-1 flex-col items-center justify-center gap-1"
      >
        <span className="flex h-9 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Plus className="h-5 w-5" aria-hidden />
        </span>
        <span className="text-[10.5px] font-medium text-muted-foreground">Publier</span>
      </Link>

      {right.map((e) => (
        <Tab key={e.key} entry={e} active={isNavActive(e, pathname)} count={counts[e.key]} />
      ))}

      {!user && (
        <Link
          href="/auth/connexion"
          aria-current={pathname.startsWith("/auth") ? "page" : undefined}
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1",
            pathname.startsWith("/auth") ? "text-foreground" : "text-muted-foreground",
          )}
        >
          <UserRound className="h-5 w-5" aria-hidden />
          <span className="text-[10.5px] font-medium">Compte</span>
        </Link>
      )}
    </nav>
  );
}

function Tab({ entry, active, count }: { entry: NavEntry; active: boolean; count?: number }) {
  const Icon = entry.icon;
  return (
    <Link
      href={entry.href}
      aria-current={active ? "page" : undefined}
      aria-label={count ? `${entry.label}, ${count} en attente` : entry.label}
      className={cn(
        "relative flex flex-1 flex-col items-center justify-center gap-1",
        active ? "text-foreground" : "text-muted-foreground",
      )}
    >
      <Icon className={cn("h-5 w-5", active && "text-leman")} aria-hidden />
      <span className={cn("text-[10.5px]", active ? "font-semibold" : "font-medium")}>{entry.label}</span>
      {count ? (
        <span
          aria-hidden
          className="absolute right-[calc(50%-18px)] top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-leman px-1 text-[10px] font-semibold text-white dark:text-[#0d1513]"
        >
          {count > 9 ? "9+" : count}
        </span>
      ) : null}
    </Link>
  );
}
