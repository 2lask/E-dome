"use client";

import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { PLANS } from "@/lib/pricing/catalog";
import { formatMoney, isZero } from "@/lib/model/billing";
import { agencePage, demoAgency } from "@/content/agence";
import { tarifsPage, PLAN_META, FEATURE_LABEL } from "@/content/tarifs";

/* ── `/agence/abonnement` — la formule active et comment en changer ──────────

   Lit la formule de l'agence de démonstration dans les données, et la décrit
   depuis `PLANS` — mêmes prix, mêmes inclus que `/tarifs`, parce que c'est la
   même source. Propose la formule immédiatement supérieure. */

export default function AgenceAbonnementPage() {
  const a = agencePage.abonnement;
  const current = PLANS.find((p) => p.id === demoAgency.plan);
  const next = PLANS.filter((p) => p.holder === "agency" && p.stage === "launch")
    .slice()
    .sort((x, y) => x.tier - y.tier)
    .find((p) => current && p.tier > current.tier);

  if (!current) return null;
  const currentMeta = PLAN_META[current.id];
  const nextMeta = next ? PLAN_META[next.id] : undefined;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-8">
      <header className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">{agencePage.eyebrow}</p>
        <h1 className="mt-1 text-xl font-bold text-[var(--foreground)] sm:text-2xl">{a.title}</h1>
        <p className="mt-1.5 text-sm leading-snug text-[var(--text-muted)]">{a.subtitle}</p>
      </header>

      {/* Formule active */}
      <section className="mb-4 rounded-2xl border border-[var(--primary)]/30 bg-[var(--primary)]/[0.04] p-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">{a.currentTitle}</p>
        <div className="mt-0.5 flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-bold text-[var(--foreground)]">{currentMeta?.name}</span>
          <span className="text-[13px] text-[var(--text-muted)]">
            {isZero(current.price.month) ? tarifsPage.free : `${formatMoney(current.price.month)} ${tarifsPage.billingMonthly}`}
          </span>
        </div>
        <p className="mt-0.5 text-[12.5px] text-[var(--text-muted)]">{currentMeta?.tagline}</p>

        <p className="mt-3 mb-1.5 text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">{a.includedTitle}</p>
        <ul className="grid gap-1.5 sm:grid-cols-2">
          {current.includes.map((key) => (
            <li key={key} className="flex items-start gap-1.5 text-[12.5px] leading-snug text-[var(--foreground)]">
              <Check size={14} className="mt-0.5 shrink-0 text-[var(--primary)]" aria-hidden />
              {FEATURE_LABEL[key] ?? key}
            </li>
          ))}
        </ul>
      </section>

      {/* Formule supérieure */}
      {next && nextMeta && (
        <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">{a.upgradeTitle}</p>
          <div className="mt-0.5 flex flex-wrap items-baseline gap-2">
            <span className="text-lg font-bold text-[var(--foreground)]">{nextMeta.name}</span>
            <span className="text-[13px] text-[var(--text-muted)]">
              {formatMoney(next.price.month)} {tarifsPage.billingMonthly}
            </span>
          </div>
          <p className="mt-0.5 text-[12.5px] text-[var(--text-muted)]">{a.upgradeHint}</p>
          <Link
            href="/tarifs"
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[var(--foreground)] px-4 py-2.5 text-[13px] font-medium text-[var(--background)] transition-opacity hover:opacity-90"
          >
            Comparer les formules
            <ArrowRight size={14} aria-hidden />
          </Link>
        </section>
      )}
    </div>
  );
}
