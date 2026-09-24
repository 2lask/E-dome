"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search, KeyRound, BedDouble, Building2, Wrench, GraduationCap, Handshake,
  ShieldCheck, ChevronsUpDown, Check, type LucideIcon,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { roleTour, tourFor } from "@/content/roles";
import type { RoleTour } from "@/content/roles";
import { cn } from "@/lib/utils";

/* ── Sélecteur de rôle — l'outil de la visite en cinq minutes ────────────────

   Change le `viewingAs` du contexte et emmène sur la porte principale du rôle
   choisi. Ainsi la plateforme se parcourt entière en huit clics : particulier,
   propriétaire, hôte, agence, prestataire, créateur, apporteur, admin.

   Direction visuelle alignée sur `/demo` : mêmes cartes bordées, même pastille
   d'icône primaire, même densité. Le texte vient de `content/roles.ts`. */

const ICONS: Record<string, LucideIcon> = {
  Search, KeyRound, BedDouble, Building2, Wrench, GraduationCap, Handshake, ShieldCheck,
};

export function RoleSwitcher({ variant = "sidebar" }: { variant?: "sidebar" | "block" | "bar" }) {
  const { viewingAs, setViewingAs } = useApp();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = tourFor(viewingAs);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (r: RoleTour) => {
    setViewingAs(r.role);
    setOpen(false);
    router.push(r.href);
  };

  const CurrentIcon = current ? ICONS[current.icon] ?? Search : Search;
  const label = `${roleTour.title} : ${current?.label ?? "Particulier"}`;

  return (
    <div ref={ref} className={cn("relative", variant === "block" && "w-full")}>
      {variant === "bar" ? (
        /* Déclencheur compact, une seule ligne, pour le bandeau global. */
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={label}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-2 py-1 text-left transition-colors hover:border-[var(--primary)]/40"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--primary)]/10 text-[var(--primary)]">
            <CurrentIcon size={12} />
          </span>
          <span className="hidden text-[11px] text-[var(--text-muted)] sm:inline">{roleTour.title}</span>
          <span className="text-[12px] font-semibold text-[var(--foreground)]">{current?.label ?? "Particulier"}</span>
          <ChevronsUpDown size={13} className="shrink-0 text-[var(--text-muted)]" aria-hidden />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={label}
          className="flex w-full items-center gap-2.5 rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-2.5 py-2 text-left transition-colors hover:border-[var(--primary)]/40"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
            <CurrentIcon size={15} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[10.5px] uppercase tracking-wide text-[var(--text-muted)]">
              {roleTour.title}
            </span>
            <span className="block truncate text-[13px] font-semibold text-[var(--foreground)]">
              {current?.label ?? "Particulier"}
            </span>
          </span>
          <ChevronsUpDown size={15} className="shrink-0 text-[var(--text-muted)]" aria-hidden />
        </button>
      )}

      {open && (
        <div
          role="listbox"
          className={cn(
            "absolute z-50 max-h-[70vh] overflow-y-auto rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-1.5 shadow-xl",
            // Au-dessus dans la sidebar (footer en bas) ; en dessous ailleurs.
            variant === "sidebar" && "bottom-full mb-2 left-0 w-72",
            variant === "block" && "top-full mt-2 left-0 w-full",
            // Dans le bandeau : sous le déclencheur, aligné à droite.
            variant === "bar" && "top-full mt-2 right-0 w-72",
          )}
        >
          <p className="px-2 py-1.5 text-[11px] leading-snug text-[var(--text-muted)]">
            {roleTour.hint}
          </p>
          {roleTour.roles.map((r) => {
            const Icon = ICONS[r.icon] ?? Search;
            const active = r.role === viewingAs;
            return (
              <button
                key={r.role}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => choose(r)}
                className={cn(
                  "flex w-full items-start gap-2.5 rounded-lg p-2 text-left transition-colors",
                  active ? "bg-[var(--primary)]/5" : "hover:bg-[var(--hover-bg)]",
                )}
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                  <Icon size={15} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[13px] font-semibold text-[var(--foreground)]">{r.label}</span>
                    {active && <Check size={13} className="text-[var(--primary)]" aria-hidden />}
                  </span>
                  <span className="block text-[11.5px] leading-snug text-[var(--text-muted)]">
                    {r.tagline}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
