"use client";

import Link from "next/link";
import { ArrowRight, Check, RefreshCw } from "lucide-react";
import { sellPage } from "@/content/offer";
import { PlatformRules } from "@/components/legal/platform-rules";

/* ── `/vendre` — le cœur de la démonstration côté vendeur ────────────────────

   Deux routes qui s'excluent (seul / accompagné) en deux cartes portant les
   MÊMES SIX LIGNES dans le même ordre, pour que l'œil compare des lignes
   alignées. « À la carte » n'est pas une troisième carte mais un bloc rattaché,
   parce qu'il ne s'oppose pas aux deux autres. Voir l'en-tête de `offer.ts`.

   Le point contre-intuitif reçoit le plus gros caractère de l'écran :
   « 0 CHF à E-Dome », des deux côtés. Le pied porte les QUATRE règles, jamais
   la seule règle 3 — le composant ne sait pas en montrer moins. */

const LINE_ORDER = ["you", "sale", "visits", "toEdome", "toThird", "idealFor"] as const;

export default function VendrePage() {
  const s = sellPage;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:py-8">
      <header className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
          {s.eyebrow}
        </p>
        <h1 className="mt-1 text-xl font-bold leading-tight text-[var(--foreground)] sm:text-2xl">
          {s.title}
        </h1>
        <p className="mt-1.5 text-sm leading-snug text-[var(--text-muted)]">{s.subtitle}</p>
      </header>

      {/* Les deux cartes, alignées ligne à ligne */}
      <div className="grid gap-3 md:grid-cols-2">
        {s.routes.map((route) => (
          <section
            key={route.id}
            className="flex flex-col rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4"
          >
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <h2 className="text-base font-bold text-[var(--foreground)]">{route.label}</h2>
            </div>
            <p className="mb-3 text-[12.5px] leading-snug text-[var(--text-muted)]">{route.tagline}</p>

            {/* Le point contre-intuitif, le plus gros de la carte */}
            <p className="mb-3 leading-none">
              <span className="text-2xl font-extrabold tracking-tight text-[var(--primary)] sm:text-3xl">
                {s.headline}
              </span>
            </p>

            {/* Les six lignes, dans l'ordre, mêmes libellés que l'autre carte */}
            <dl className="flex-1 divide-y divide-[var(--card-border)]">
              {LINE_ORDER.map((key) => (
                <div key={key} className="grid grid-cols-[7.5rem_1fr] gap-2 py-2">
                  <dt className="text-[11.5px] font-medium text-[var(--text-muted)]">
                    {s.lineLabels[key]}
                  </dt>
                  <dd
                    className={
                      "text-[12.5px] leading-snug " +
                      (key === "toEdome"
                        ? "font-semibold text-[var(--foreground)]"
                        : "text-[var(--foreground)]")
                    }
                  >
                    {route.lines[key]}
                  </dd>
                </div>
              ))}
            </dl>

            <Link
              href={route.ctaHref}
              className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--foreground)] px-4 py-2.5 text-[13.5px] font-medium text-[var(--background)] transition-opacity hover:opacity-90"
            >
              {route.cta}
              <ArrowRight size={15} aria-hidden />
            </Link>
          </section>
        ))}
      </div>

      {/* Vous pouvez changer d'avis — la phrase sans laquelle personne ne clique */}
      <p className="mt-3 flex items-start gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-3.5 py-2.5 text-[12.5px] leading-snug text-[var(--text-muted)]">
        <RefreshCw size={15} className="mt-0.5 shrink-0 text-[var(--primary)]" aria-hidden />
        <span>{s.reassurance}</span>
      </p>

      {/* À la carte : bloc rattaché, pas une troisième carte */}
      <section className="mt-3 flex flex-col gap-2 rounded-xl border border-dashed border-[var(--card-border)] px-4 py-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <h2 className="flex items-center gap-1.5 text-[13.5px] font-semibold text-[var(--foreground)]">
            <Check size={15} className="text-[var(--primary)]" aria-hidden />
            {s.alaCarte.title}
          </h2>
          <p className="mt-0.5 text-[12.5px] leading-snug text-[var(--text-muted)]">{s.alaCarte.body}</p>
        </div>
        <Link
          href={s.alaCarte.ctaHref}
          className="inline-flex shrink-0 items-center gap-1 self-start rounded-lg border border-[var(--card-border)] px-3 py-2 text-[12.5px] font-medium text-[var(--foreground)] transition-colors hover:border-[var(--primary)]/40 sm:self-auto"
        >
          {s.alaCarte.cta}
          <ArrowRight size={14} aria-hidden />
        </Link>
      </section>

      {/* Les quatre règles, ensemble */}
      <section className="mt-6">
        <h2 className="text-sm font-semibold text-[var(--foreground)]">{s.rulesTitle}</h2>
        <p className="mt-1 mb-3 max-w-2xl text-[12.5px] leading-snug text-[var(--text-muted)]">
          {s.rulesIntro}
        </p>
        <PlatformRules variant="full" />
      </section>
    </div>
  );
}
