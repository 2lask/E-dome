"use client";

import { Check } from "lucide-react";
import { formatCount } from "@/lib/utils";
import type { Poll } from "@/lib/types";

/* Bloc de sondage interactif (façon X), partagé entre le feed et le
   visualiseur de profil. Avant vote → options cliquables ; après vote (ou
   sondage terminé) → barres avec pourcentages, option choisie mise en avant,
   total des votes + temps restant. */

export function pollTimeLeft(endsAt: string): string {
  const ms = new Date(endsAt).getTime() - Date.now();
  if (ms <= 0) return "Sondage terminé";
  const h = Math.floor(ms / 3600_000);
  if (h >= 24) return `${Math.floor(h / 24)} j restants`;
  if (h >= 1) return `${h} h restantes`;
  return `${Math.max(1, Math.floor(ms / 60_000))} min restantes`;
}

export function PollBlock({ poll, onVote }: { poll: Poll; onVote: (optionId: string) => void }) {
  const ended = poll.endsAt ? new Date(poll.endsAt).getTime() < Date.now() : false;
  const locked = !!poll.userVote || ended;
  const total = poll.totalVotes || 0;

  return (
    <div className="mt-2 space-y-1.5 max-w-md" onClick={(e) => e.stopPropagation()}>
      {poll.options.map((o) => {
        const pct = total > 0 ? Math.round((o.votes / total) * 100) : 0;
        const chosen = poll.userVote === o.id;
        if (!locked) {
          return (
            <button
              key={o.id}
              onClick={() => onVote(o.id)}
              className="w-full text-center px-4 py-2 rounded-full border border-[var(--primary)]/45 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors"
            >
              {o.label}
            </button>
          );
        }
        return (
          <div key={o.id} className="relative w-full h-9 rounded-lg overflow-hidden border border-[var(--card-border)] bg-[var(--card)]">
            <div
              className="absolute inset-y-0 left-0 transition-[width] duration-500"
              style={{ width: `${pct}%`, background: `color-mix(in srgb, var(--primary) ${chosen ? 28 : 12}%, transparent)` }}
            />
            <div className="relative flex items-center justify-between h-full px-3">
              <span className={`text-sm text-[var(--foreground)] inline-flex items-center gap-1.5 ${chosen ? "font-semibold" : ""}`}>
                {o.label}
                {chosen && <Check className="w-3.5 h-3.5 text-[var(--primary)]" strokeWidth={3} />}
              </span>
              <span className="text-sm font-semibold tabular-nums text-[var(--foreground)]">{pct}%</span>
            </div>
          </div>
        );
      })}
      <p className="text-xs text-[var(--text-muted)] pt-0.5">
        {formatCount(total)} vote{total > 1 ? "s" : ""}
        {poll.endsAt ? ` · ${pollTimeLeft(poll.endsAt)}` : ""}
      </p>
    </div>
  );
}
