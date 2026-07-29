"use client";

import Link from "next/link";
import { ArrowRight, Coins } from "lucide-react";
import { useApp } from "@/lib/context";

/* Espace apporteur (compact) en tête du feed : uniquement l'état du compte —
   gains cumulés, liens actifs, clics, conversions — + accès au tableau de
   bord. Les accroches « gagnez jusqu'à X » vivent désormais directement sur
   les liens d'affiliation des posts (façon Whop). */
export function AffiliateHub() {
  const { formatPrice, referralLinks } = useApp();
  const balance = referralLinks.reduce((s, l) => s + (l.earned || 0), 0);
  const clicks = referralLinks.reduce((s, l) => s + (l.clicks || 0), 0);
  const conversions = referralLinks.reduce((s, l) => s + (l.conversions || 0), 0);

  return (
    <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] inline-flex items-center gap-1.5">
          <Coins className="w-3.5 h-3.5 text-[var(--primary)]" /> Espace apporteur
        </p>
        <p className="text-2xl font-bold text-[var(--foreground)] mt-0.5 inline-flex items-baseline gap-1.5">
          {formatPrice(balance)}
          <span className="text-sm font-normal text-[var(--text-muted)]">gagnés</span>
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          {referralLinks.length} liens actifs · {clicks} clics · {conversions} conversions
        </p>
      </div>
      <Link
        href="/apporteurs"
        className="shrink-0 inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 transition"
      >
        Tableau de bord <ArrowRight className="w-4 h-4" />
      </Link>
    </section>
  );
}
