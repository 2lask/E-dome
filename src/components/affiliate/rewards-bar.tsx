"use client";

import Link from "next/link";
import { Coins, Zap, ChevronRight } from "lucide-react";
import { useApp } from "@/lib/context";
import { getTierProgress } from "@/lib/rewards";

/* Bandeau récompenses en tête du feed (façon Whop) : palier de l'apporteur,
   solde gagné, points cumulés et progression vers le palier suivant. Clic →
   page /apporteurs. Le solde reprend les gains cumulés des liens d'affiliation. */
export function RewardsBar() {
  const { rewardPoints, referralLinks, formatPrice } = useApp();
  const balance = referralLinks.reduce((s, l) => s + (l.earned || 0), 0);
  const { current, next, progress, pointsToNext } = getTierProgress(rewardPoints);
  const fmtPts = (n: number) => n.toLocaleString("fr-CH");

  return (
    <Link
      href="/apporteurs"
      aria-label="Voir mon programme apporteur"
      className="group block rounded-2xl border border-[var(--card-border)] overflow-hidden bg-[var(--card)] hover:border-[var(--primary)]/30 transition-colors"
    >
      <div className={`flex items-center gap-3.5 p-3.5 bg-gradient-to-r ${current.gradient}`}>
        <div className="w-11 h-11 rounded-xl bg-[var(--background)]/70 backdrop-blur flex items-center justify-center text-2xl shrink-0">
          {current.emoji}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-sm font-semibold text-[var(--foreground)]">Apporteur {current.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--primary)]/12 text-[var(--primary)] font-semibold">
              commission {current.shareLabel}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-xs text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" /> <b className="text-[var(--foreground)] font-semibold">{formatPrice(balance)}</b> gagnés
            </span>
            <span className="inline-flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> <b className="text-[var(--foreground)] font-semibold">{fmtPts(rewardPoints)}</b> pts
            </span>
          </div>
          {next && (
            <div className="mt-2 max-w-md">
              <div className="h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-[var(--primary)] transition-all" style={{ width: `${Math.round(progress * 100)}%` }} />
              </div>
              <p className="text-[10px] text-[var(--text-muted)] mt-1">
                Plus que <b className="text-[var(--foreground)] font-semibold">{fmtPts(pointsToNext)} pts</b> avant {next.emoji} {next.name}
              </p>
            </div>
          )}
        </div>

        <ChevronRight className="w-5 h-5 text-[var(--text-muted)] shrink-0 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
}
