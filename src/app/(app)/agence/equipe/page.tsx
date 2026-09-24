"use client";

import { agencePage, agencyTeam } from "@/content/agence";

/* `/agence/equipe` — les agents et leurs droits. Vue lecture de démonstration. */
export default function AgenceEquipePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-8">
      <header className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">{agencePage.eyebrow}</p>
        <h1 className="mt-1 text-xl font-bold text-[var(--foreground)] sm:text-2xl">Équipe</h1>
        <p className="mt-1.5 text-sm leading-snug text-[var(--text-muted)]">
          Vos agents et leurs droits. Chaque membre a un rôle et un périmètre d'accès.
        </p>
      </header>

      <div className="overflow-x-auto rounded-xl border border-[var(--card-border)]">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[var(--card-border)] text-left text-[var(--text-muted)]">
              <th className="p-3 font-medium">Membre</th>
              <th className="p-3 font-medium">Rôle</th>
              <th className="p-3 font-medium">Droits</th>
              <th className="p-3 text-right font-medium">Mandats</th>
            </tr>
          </thead>
          <tbody>
            {agencyTeam.map((m) => (
              <tr key={m.id} className="border-b border-[var(--card-border)] last:border-0">
                <td className="p-3 font-medium text-[var(--foreground)]">{m.name}</td>
                <td className="p-3 text-[var(--text-muted)]">{m.role}</td>
                <td className="p-3 text-[var(--text-muted)]">{m.permissions}</td>
                <td className="p-3 text-right tabular-nums text-[var(--foreground)]">{m.mandates}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
