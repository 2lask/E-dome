"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronsUpDown, User, Building2, Settings, HelpCircle, Sparkles, LogOut, FileText, Briefcase } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { initialsAvatar } from "@/lib/current-user-profile";
import { AI_OPEN_EVENT } from "@/lib/nav";
import type { SessionUser } from "@/lib/session-user";
import { cn } from "@/lib/utils";

/* ── Le menu du compte (REBUILD.md §3.2) ─────────────────────────────────────

   Tout ce qui concerne SOI vit ici, pas dans la navigation : profil, favoris,
   réglages, aide, copilote, déconnexion. Le déclencheur montre l'identité
   réelle (nom + e-mail), comme dans Linear, Vercel ou Notion. */

export function avatarOf(u: SessionUser): string {
  return u.avatar || initialsAvatar(u.firstName, u.lastName);
}

export function displayName(u: SessionUser): string {
  return `${u.firstName} ${u.lastName}`.trim() || u.email || "Mon compte";
}

export function AccountMenu({
  user,
  variant = "sidebar",
}: {
  user: SessionUser;
  /** `sidebar` : bloc complet (nom + e-mail) · `compact` : avatar seul (mobile). */
  variant?: "sidebar" | "compact";
}) {
  const router = useRouter();

  const signOut = async () => {
    const supabase = createClient();
    if (supabase && isSupabaseConfigured()) await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "sidebar" ? (
          <button
            type="button"
            className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left hover:bg-sidebar-accent data-[state=open]:bg-sidebar-accent"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={avatarOf(user)} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium leading-tight">{displayName(user)}</span>
              <span className="block truncate text-[11.5px] text-muted-foreground">{user.email}</span>
            </span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          </button>
        ) : (
          <button
            type="button"
            aria-label={`Compte de ${displayName(user)}`}
            className="rounded-full outline-offset-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={avatarOf(user)} alt="" className="h-8 w-8 rounded-full object-cover" />
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={variant === "sidebar" ? "start" : "end"}
        side={variant === "sidebar" ? "top" : "bottom"}
        className="w-60"
      >
        <DropdownMenuLabel className="font-normal">
          <span className="block truncate text-[13px] font-medium">{displayName(user)}</span>
          <span className="block truncate text-[11.5px] text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <MenuLink href="/profil" icon={User}>Mon profil public</MenuLink>
        <MenuLink href="/mes-biens" icon={Building2}>Mes biens et primes</MenuLink>
        <MenuLink href="/dossier" icon={FileText}>Mon dossier de location</MenuLink>
        <MenuLink href="/agence" icon={Briefcase}>Espace agence</MenuLink>
        <MenuLink href="/parametres" icon={Settings}>Réglages du compte</MenuLink>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => window.dispatchEvent(new CustomEvent(AI_OPEN_EVENT))}>
          <Sparkles className="h-4 w-4" aria-hidden /> Copilote IA
        </DropdownMenuItem>
        <MenuLink href="/aide" icon={HelpCircle}>Aide</MenuLink>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void signOut()} className="text-muted-foreground">
          <LogOut className="h-4 w-4" aria-hidden /> Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MenuLink({
  href,
  icon: Icon,
  children,
  className,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <DropdownMenuItem asChild>
      <Link href={href} className={cn("cursor-pointer", className)}>
        <Icon className="h-4 w-4" aria-hidden />
        {children}
      </Link>
    </DropdownMenuItem>
  );
}
