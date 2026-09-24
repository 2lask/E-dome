"use client";

import { agencePage, agencyStats } from "@/content/agence";

/* `/agence/statistiques` — audience et conversions de l'agence de démonstration. */
export default function AgenceStatistiquesPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-8">
      <header className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">{agencePage.eyebrow}</p>
        <h1 className="mt-1 text-xl font-bold text-[var(--foreground)] sm:text-2xl">Statistiques</h1>
        <p className="mt-1.5 text-sm leading-snug text-[var(--text-muted)]">{agencyStats.note}</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {agencyStats.kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4">
            <p className="text-2xl font-bold text-[var(--foreground)] tabular-nums">{k.value}</p>
            <p className="mt-0.5 text-[12px] leading-snug text-[var(--text-muted)]">{k.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
