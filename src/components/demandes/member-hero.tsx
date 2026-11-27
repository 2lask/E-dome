import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── En-tête cinématique de l'espace membre ──────────────────────────────────
   Partagé par Mes biens, Demandes et Règlements, dans la lignée de l'en-tête
   de la publication : toujours sombre (classes `.cine`, couleurs fixes),
   aurore et grille en fond, et une rangée de compteurs RÉELS passés par la
   page — jamais un chiffre décoratif. L'aurore s'arrête si l'on préfère un
   mouvement réduit (règle déjà portée par globals.css). */

export interface HeroStat {
  label: string;
  value: string;
  /** Montant qui rapporte : rendu en laiton. */
  prime?: boolean;
  hint?: string;
}

export function MemberHero({
  eyebrow,
  icon: Icon,
  title,
  description,
  actions,
  stats,
  className,
}: {
  eyebrow: string;
  icon: LucideIcon;
  title: React.ReactNode;
  description: React.ReactNode;
  actions?: React.ReactNode;
  stats?: HeroStat[];
  className?: string;
}) {
  return (
    <header className={cn("cine relative isolate overflow-hidden rounded-3xl border border-white/10", className)}>
      <div aria-hidden className="cine-aurora opacity-80" />
      <div aria-hidden className="cine-grid" />
      {/* Deux sources de lumière fixes (laiton, Léman) pour donner du relief. */}
      <div aria-hidden className="pointer-events-none absolute -left-24 -top-32 h-80 w-[520px] rounded-full bg-[radial-gradient(closest-side,rgb(217_164_65/0.22),transparent)]" />
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-72 w-[440px] rounded-full bg-[radial-gradient(closest-side,rgb(45_170_156/0.18),transparent)]" />
      {/* Filet de lumière sur l'arête haute. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#e3b85c]/60 to-transparent" />

      <div className="relative px-5 pb-6 pt-7 sm:px-8 sm:pb-8 sm:pt-9">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-5">
          <div className="min-w-0 max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] py-1 pl-1 pr-3 text-[11.5px] font-medium uppercase tracking-[0.16em] text-[#e3b85c]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[rgb(227_184_92/0.16)]">
                <Icon className="h-3.5 w-3.5" aria-hidden />
              </span>
              {eyebrow}
            </p>
            <h1 className="mt-4 text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-[40px]">{title}</h1>
            <p className="mt-2.5 max-w-xl text-[14.5px] leading-relaxed text-white/65">{description}</p>
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
        </div>

        {stats && stats.length > 0 && (
          <dl
            className={cn(
              "mt-7 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10",
              stats.length === 3 ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4",
            )}
          >
            {stats.map((s) => (
              <div key={s.label} className="relative min-w-0 bg-[#0e0c09]/85 px-3 py-3 backdrop-blur-sm sm:px-5 sm:py-4">
                <dt className="text-[11px] font-medium leading-tight text-white/55 sm:text-[12px]">{s.label}</dt>
                <dd className={cn("mt-1 truncate text-[17px] font-semibold tabular-nums tracking-[-0.02em] sm:text-[26px]", s.prime ? "text-[#f0c977]" : "text-white")}>
                  {s.value}
                </dd>
                {s.hint && <dd className="mt-0.5 text-[11.5px] text-white/45">{s.hint}</dd>}
                {s.prime && <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#e3b85c]/70 to-transparent" />}
              </div>
            ))}
          </dl>
        )}
      </div>
    </header>
  );
}

/* Boutons sur fond sombre : 44 px de haut, anneau de focus visible. */
export const heroBtnLight =
  "cine-btn-light inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-[14px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e3b85c]";
export const heroBtnGlass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 text-[14px] font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e3b85c]";
