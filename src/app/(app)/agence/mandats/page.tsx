"use client";

import Link from "next/link";
import { agencePage } from "@/content/agence";
import { activeSaleMandates, concludedSaleMandates, MANDATE_TRACKING } from "@/lib/demo/agency";
import { useApp } from "@/lib/context";
import type { Property } from "@/lib/types";
import { PlanGate } from "@/components/business/plan-gate";

/* `/agence/mandats` — les mandats de vente de l'agence : ses VRAIS biens en
   vente au catalogue (ceux qu'hébergent ses membres), puis les mandats
   conclus. La commission affichée est celle de l'agence : E-Dome ne touche
   rien dessus (display-only au modèle). */

function MandateRow({ p }: { p: Property }) {
  const { formatPrice } = useApp();
  const t = MANDATE_TRACKING[p.id];
  return (
    <li className="flex flex-col gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <Link href={`/explorer/${p.id}`} className="text-[14px] font-semibold text-[var(--foreground)] hover:underline">
          {p.title}
        </Link>
        <p className="mt-0.5 text-[12px] text-[var(--text-muted)]">
          {t?.ref ?? "—"} · {p.location.city} · {formatPrice(p.price, p.currency)} ·{" "}
          <Link href={`/profil/${p.host.id}`} className="hover:underline">
            {p.host.firstName} {p.host.lastName}
          </Link>
          {t ? ` · commission agence ${t.rate}` : ""}
        </p>
      </div>
      <span className="inline-flex shrink-0 items-center self-start rounded-full bg-[var(--primary)]/10 px-2.5 py-1 text-[12px] font-medium text-[var(--primary)] sm:self-auto">
        {t?.status ?? (p.soldTo ? "Vendu" : "En cours")}
      </span>
    </li>
  );
}

export default function AgenceMandatsPage() {
  const active = activeSaleMandates();
  const concluded = concludedSaleMandates();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-8">
      <header className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">{agencePage.eyebrow}</p>
        <h1 className="mt-1 text-xl font-bold text-[var(--foreground)] sm:text-2xl">Mandats</h1>
        <p className="mt-1.5 text-sm leading-snug text-[var(--text-muted)]">
          Les biens que vous avez en vente. La commission affichée est la vôtre, convenue avec le vendeur —
          E-Dome ne prélève rien dessus.
        </p>
      </header>

      <PlanGate
        feature="mandats"
        why="La gestion formelle des mandats (références, suivi des commissions de l'agence, agenda des visites) est une fonction de réussite, incluse dans Mandats. Vos biens restent publiés et visibles."
      />

      <h2 className="mb-2 text-sm font-semibold text-[var(--foreground)]">Mandats actifs ({active.length})</h2>
      <ul className="space-y-2.5">
        {active.map((p) => (
          <MandateRow key={p.id} p={p} />
        ))}
      </ul>

      {concluded.length > 0 && (
        <>
          <h2 className="mb-2 mt-6 text-sm font-semibold text-[var(--foreground)]">Mandats conclus ({concluded.length})</h2>
          <ul className="space-y-2.5">
            {concluded.map((p) => (
              <MandateRow key={p.id} p={p} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
