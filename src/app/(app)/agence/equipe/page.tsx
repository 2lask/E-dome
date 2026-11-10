"use client";

import Link from "next/link";
import { agencePage, demoAgency } from "@/content/agence";
import { agencyProperties, agencyTeam } from "@/lib/demo/agency";
import { roleLabel } from "@/lib/model/role-labels";
import { PlanGate } from "@/components/business/plan-gate";

/* `/agence/equipe` — les membres de l'agence et leurs droits. Ce sont de
   VRAIES personnes de l'annuaire : chaque ligne ouvre leur profil, et le
   nombre de biens est celui qu'elles portent réellement au catalogue. */
export default function AgenceEquipePage() {
  const portfolio = agencyProperties();
  const team = agencyTeam().map((m) => ({
    ...m,
    listings: portfolio.filter((p) => p.host.id === m.accountId).length,
  }));

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-8">
      <header className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">{agencePage.eyebrow}</p>
        <h1 className="mt-1 text-xl font-bold text-[var(--foreground)] sm:text-2xl">Équipe</h1>
        <p className="mt-1.5 text-sm leading-snug text-[var(--text-muted)]">
          Les membres de {demoAgency.name}, leurs droits et les biens dont ils ont la charge.
        </p>
      </header>

      <PlanGate
        feature="equipe-droits"
        why="La formule gratuite et Vitrine couvrent un seul utilisateur. Une équipe de deux personnes ou plus, avec des droits par membre, demande Mandats."
      />

      <ul className="space-y-2.5">
        {team.map((m) => (
          <li
            key={m.accountId}
            className="flex items-center gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-3 sm:p-4"
          >
            <Link href={`/profil/${m.accountId}`} className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.person.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                href={`/profil/${m.accountId}`}
                className="block truncate text-[14px] font-semibold text-[var(--foreground)] hover:underline"
              >
                {m.person.firstName} {m.person.lastName}
              </Link>
              <p className="mt-0.5 truncate text-[12px] text-[var(--text-muted)]">
                {m.title} · {roleLabel(m.person.activeRole, m.person.trades)} · {m.permissionsLabel}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[15px] font-bold tabular-nums text-[var(--foreground)]">{m.listings}</p>
              <p className="text-[11px] text-[var(--text-muted)]">{m.listings > 1 ? "biens" : "bien"}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
