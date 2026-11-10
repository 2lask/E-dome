"use client";

import { agencePage, agencyStats } from "@/content/agence";
import { activeSaleMandates, concludedSaleMandates, agencyRentals } from "@/lib/demo/agency";
import { PlanGate } from "@/components/business/plan-gate";

/* `/agence/statistiques` — audience et conversions de l'agence de démonstration. */
export default function AgenceStatistiquesPage() {
  /* Les compteurs qui décrivent l'activité de l'agence se dérivent de ses
     vrais biens et des demandes reçues ; seuls l'audience et le délai restent
     des exemples déclaratifs (`agencyStats`). */
  const kpis = [
    agencyStats.kpis[0]!,
    { label: "Demandes reçues", value: String(agencePage.demandes.items.length) },
    { label: "Mandats de vente (actifs + conclus)", value: String(activeSaleMandates().length + concludedSaleMandates().length) },
    { label: "Biens en gérance", value: String(agencyRentals().length) },
    ...agencyStats.kpis.slice(1),
  ];
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-8">
      <header className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">{agencePage.eyebrow}</p>
        <h1 className="mt-1 text-xl font-bold text-[var(--foreground)] sm:text-2xl">Statistiques</h1>
        <p className="mt-1.5 text-sm leading-snug text-[var(--text-muted)]">{agencyStats.note}</p>
      </header>

      <PlanGate
        feature="statistiques-completes"
        why="Vous voyez les statistiques de base. Les statistiques complètes (sources d'audience, délais de vente par bien, conversions par agent) sont une fonction de réussite, incluse dans Mandats."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4">
            <p className="text-2xl font-bold text-[var(--foreground)] tabular-nums">{k.value}</p>
            <p className="mt-0.5 text-[12px] leading-snug text-[var(--text-muted)]">{k.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
