"use client";

import { agencePage, agencyMandates } from "@/content/agence";

/* `/agence/mandats` — les biens gérés, du mandat à l'acte. Le taux affiché est
   celui de l'agence : E-Dome ne touche rien dessus (display-only au modèle). */
export default function AgenceMandatsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-8">
      <header className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">{agencePage.eyebrow}</p>
        <h1 className="mt-1 text-xl font-bold text-[var(--foreground)] sm:text-2xl">Mandats</h1>
        <p className="mt-1.5 text-sm leading-snug text-[var(--text-muted)]">
          Les biens que vous gérez. La commission affichée est la vôtre, convenue avec le vendeur —
          E-Dome ne prélève rien dessus.
        </p>
      </header>

      <ul className="space-y-2.5">
        {agencyMandates.map((m) => (
          <li
            key={m.id}
            className="flex flex-col gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 sm:flex-row sm:items-center"
          >
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-[var(--foreground)]">{m.bien}</p>
              <p className="mt-0.5 text-[12px] text-[var(--text-muted)]">
                {m.id} · {m.agent} · commission agence {m.rate}
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center self-start rounded-full bg-[var(--primary)]/10 px-2.5 py-1 text-[12px] font-medium text-[var(--primary)] sm:self-auto">
              {m.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
