"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Building2, Download, GraduationCap, Printer, TrendingUp, Wallet, MessageCircle, Check } from "lucide-react";
import { useApp } from "@/lib/context";
import { useActor } from "@/lib/use-actor";
import { useSession, recordSessionEvent } from "@/lib/use-session";
import { useToast } from "@/components/ui/toast";
import { properties as CATALOGUE } from "@/lib/mock-data";
import { investorBook, opportunities, rentPerM2ByCity } from "@/lib/explore/investor";
import { pctLabel, yieldTone } from "@/lib/explore/listing";
import { chfLabel } from "@/lib/demo/affiliation";
import { FREE_LIMITS, PLANS } from "@/lib/pricing/catalog";
import { FEATURE_LABEL } from "@/content/tarifs";
import { investisseurs as T } from "@/content/investisseurs";

/* ── Le pôle Investisseurs (chantier P6b) ───────────────────────────────────

   Plus aucun chiffre en dur : le portefeuille vient du catalogue (biens
   publiés + achetés), la courte durée du journal (`derive.ts`), la longue
   durée des loyers des annonces, les rendements des loyers comparables
   (`estimateYield`). Vu par Ennio Bordoni (user-003), c'est SON portefeuille :
   Prilly et Vevey à l'année, Montreux et Nyon à la nuit, Champel en vente,
   Lutry acheté via Céline. */

const MIN_YIELDS = [0, 2, 3, 4] as const;
const PATRIMOINE = PLANS.find((p) => p.id === "patrimoine")!;
const MARKET = rentPerM2ByCity(CATALOGUE);

const toneClass = (pct: number) => {
  const t = yieldTone(pct);
  return t === "success"
    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
    : t === "info"
      ? "bg-sky-500/15 text-sky-700 dark:text-sky-400"
      : "bg-[var(--hover-bg)] text-[var(--text-secondary)]";
};

export default function InvestisseursPage() {
  const { formatPrice } = useApp();
  const actor = useActor();
  const { state, actorId } = useSession();
  const { addToast } = useToast();
  const [minYield, setMinYield] = useState<number>(0);

  const book = useMemo(() => investorBook(actorId, state, CATALOGUE), [actorId, state]);
  const opps = useMemo(() => opportunities(actorId, CATALOGUE), [actorId]);
  const visibleOpps = opps.filter((o) => o.estimate.pct >= minYield);
  const published = book.shortTerm.length + book.longTerm.length + book.forSale.length;
  const rented = book.shortTerm.length + book.longTerm.length;
  const hasPortfolio = book.holdings > 0;
  const maxBar = Math.max(1, ...book.shortTermSeries.map((m) => m.value));
  const medianYield = opps.length ? [...opps].sort((a, b) => a.estimate.pct - b.estimate.pct)[Math.floor(opps.length / 2)]!.estimate.pct : 0;
  const comparablesCount = MARKET.reduce((s, m) => s + m.count, 0);
  const patrimoineActive = book.planId === "patrimoine";

  /* Une ligne par bien, pour le tableau et l'export CSV. */
  const rows = [
    ...book.shortTerm.map((l) => ({
      p: l.property,
      status: T.status.shortTerm,
      amount: l.gross12m,
      detail: T.line.shortTerm(Math.round(l.occupancy * 100)),
      extra: undefined as string | undefined,
    })),
    ...book.longTerm.map((l) => ({
      p: l.property,
      status: T.status.longTerm,
      amount: l.netChf,
      detail: T.line.longTerm(l.chargesChf !== undefined ? chfLabel(l.chargesChf * 100) : undefined),
      extra: undefined as string | undefined,
    })),
    ...book.forSale.map((l) => ({
      p: l.property,
      status: T.status.forSale,
      amount: l.property.price,
      detail: T.line.forSale,
      extra: l.primeChf !== undefined ? T.line.prime(chfLabel(l.primeChf * 100)) : undefined,
    })),
    ...book.bought.map((l) => ({
      p: l.property,
      status: T.status.bought,
      amount: l.property.price,
      detail: T.line.bought,
      extra: l.estimate ? T.line.ifRented(pctLabel(l.estimate.pct)) : undefined,
    })),
  ];

  const exportCsv = () => {
    const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
    const lines = [T.csvHeader.map(esc).join(";"), ...rows.map((r) => [r.p.title, r.p.location.city, r.status, r.amount, [r.detail, r.extra].filter(Boolean).join(" — ")].map(esc).join(";"))];
    const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = T.csvName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activatePatrimoine = () => {
    recordSessionEvent({ kind: "plan.changed", data: { holderId: actorId, planId: "patrimoine" } });
    addToast(T.plan.activated, "success");
  };

  const kpis = hasPortfolio
    ? [
        { icon: Building2, label: T.kpi.holdings, value: String(book.holdings), hint: T.kpi.holdingsHint(published, book.bought.length) },
        { icon: TrendingUp, label: T.kpi.shortTerm, value: chfLabel(book.shortTermGross12m * 100), hint: T.kpi.shortTermHint },
        { icon: Wallet, label: T.kpi.longTerm, value: chfLabel(book.longTermRentRollYear * 100), hint: T.kpi.longTermHint(book.longTerm.length) },
        {
          icon: MessageCircle,
          label: T.kpi.requests,
          value: String(book.requests.visits + book.requests.offers + book.requests.messages),
          hint: T.kpi.requestsHint(book.requests.visits, book.requests.offers, book.requests.messages),
        },
      ]
    : [
        { icon: Building2, label: T.kpi.opportunities, value: String(opps.length), hint: T.kpi.opportunitiesHint },
        { icon: TrendingUp, label: T.kpi.bestYield, value: opps[0] ? pctLabel(opps[0].estimate.pct) : "—", hint: opps[0]?.property.location.city ?? "" },
        { icon: Wallet, label: T.kpi.medianYield, value: opps.length ? pctLabel(medianYield) : "—", hint: T.kpi.opportunitiesHint },
        { icon: MessageCircle, label: T.kpi.comparables, value: String(comparablesCount), hint: T.kpi.comparablesHint },
      ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-fade-in">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl page-heading text-[var(--foreground)]">{T.title}</h1>
          <p className="text-[var(--text-secondary)]">{hasPortfolio ? T.subtitleOwner(actor.name) : T.subtitleVisitor}</p>
        </div>
        {hasPortfolio && (
          <div className="flex gap-2">
            <button
              onClick={exportCsv}
              data-testid="export-csv"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90 transition"
            >
              <Download size={15} /> {T.exportCsv}
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--card-border)] text-[var(--foreground)] text-sm font-medium hover:bg-[var(--hover-bg)] transition"
            >
              <Printer size={15} /> {T.print}
            </button>
          </div>
        )}
      </div>

      {/* KPI */}
      <section className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="investor-kpis">
        {kpis.map((k) => (
          <div key={k.label} className="p-5 rounded-xl bg-[var(--card)] border border-[var(--card-border)] space-y-1.5">
            <p className="text-sm text-[var(--text-muted)] inline-flex items-center gap-1.5">
              <k.icon size={14} className="text-[var(--primary)]" /> {k.label}
            </p>
            <p className="text-2xl font-bold text-[var(--foreground)] tabular-nums" data-testid="investor-kpi-value">{k.value}</p>
            <p className="text-xs text-[var(--text-muted)]">{k.hint}</p>
          </div>
        ))}
      </section>

      {/* Courte durée, mois par mois (journal) */}
      {hasPortfolio && book.shortTerm.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">{T.chartTitle}</h2>
          <div className="p-6 rounded-xl bg-[var(--card)] border border-[var(--card-border)]">
            {book.shortTermGross12m === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">{T.chartEmpty}</p>
            ) : (
              <div className="flex items-end gap-1.5 h-44">
                {book.shortTermSeries.map((d) => (
                  <div key={d.label} className="flex-1 min-w-0 flex flex-col items-center gap-1 h-full justify-end" title={chfLabel(d.value * 100)}>
                    <div className="w-full rounded-t bg-[var(--primary)]/80" style={{ height: `${Math.max(2, (d.value / maxBar) * 100)}%` }} />
                    <span className="text-[10px] text-[var(--text-muted)]">{d.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Portefeuille */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">{T.portfolioTitle}</h2>
        {rows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--card-border)] p-5 text-sm text-[var(--text-secondary)]">{T.portfolioEmpty}</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2" data-testid="investor-portfolio">
            {rows.map((r) => (
              <Link
                key={r.p.id}
                href={`/explorer/${r.p.id}`}
                className="flex gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-3 hover:border-[var(--primary)]/40 transition"
              >
                <img src={r.p.images[0]} alt="" className="h-20 w-24 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-[var(--foreground)] leading-snug line-clamp-2">{r.p.title}</p>
                    <span className="shrink-0 rounded-full bg-[var(--hover-bg)] px-2 py-0.5 text-[10.5px] text-[var(--text-secondary)]">{r.status}</span>
                  </div>
                  <p className="mt-1 text-sm">
                    <span className="font-semibold text-[var(--foreground)] tabular-nums">{chfLabel(r.amount * 100)}</span>{" "}
                    <span className="text-xs text-[var(--text-muted)]">{r.detail}</span>
                  </p>
                  {r.extra && <p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">{r.extra}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Opportunités, avec badge de rendement brut estimé */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[var(--foreground)]">{T.oppTitle}</h2>
            <p className="text-sm text-[var(--text-secondary)] max-w-2xl">{T.oppSubtitle}</p>
          </div>
          <div className="flex items-center gap-1.5" role="group" aria-label={T.oppMin}>
            {MIN_YIELDS.map((v) => (
              <button
                key={v}
                onClick={() => setMinYield(v)}
                aria-pressed={minYield === v}
                className={`h-8 rounded-lg border px-2.5 text-xs font-medium transition-colors ${
                  minYield === v
                    ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                    : "border-[var(--card-border)] text-[var(--foreground)] hover:bg-[var(--hover-bg)]"
                }`}
              >
                {v === 0 ? "Tous" : `≥ ${v} %`}
              </button>
            ))}
          </div>
        </div>
        {visibleOpps.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">{T.oppNone}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="investor-opportunities">
            {visibleOpps.map((o) => (
              <Link
                key={o.property.id}
                href={`/explorer/${o.property.id}`}
                data-testid="investor-opportunity"
                className="overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--primary)]/40 transition"
              >
                <div className="relative">
                  <img src={o.property.images[0]} alt="" className="h-36 w-full object-cover" />
                  <span data-testid="yield-badge" className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur ${toneClass(o.estimate.pct)}`}>
                    {pctLabel(o.estimate.pct)} brut
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-[var(--foreground)] truncate">{o.property.title}</p>
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                    {o.property.location.city} · {o.property.area} m²
                  </p>
                  <p className="mt-1 text-sm font-bold text-[var(--primary)]">{formatPrice(o.property.price, o.property.currency)}</p>
                  <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
                    {T.oppRent(chfLabel(o.estimate.monthlyRentChf * 100))} · {T.oppBasis(o.estimate.comparables.length)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Repères de marché */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-[var(--foreground)]">{T.marketTitle}</h2>
          <p className="text-sm text-[var(--text-secondary)]">{T.marketSubtitle}</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {MARKET.map((m) => (
            <Link
              key={m.city}
              href={`/recherche?q=${encodeURIComponent(`louer ${m.city}`)}`}
              className="flex items-center justify-between rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-3 hover:border-[var(--primary)]/40 transition"
            >
              <span>
                <span className="block text-sm font-medium text-[var(--foreground)]">{m.city}</span>
                <span className="block text-[11px] text-[var(--text-muted)]">{T.marketCount(m.count)}</span>
              </span>
              <span className="text-right">
                <span className="block text-base font-bold text-[var(--foreground)] tabular-nums">{String(m.perM2).replace(".", ",")}</span>
                <span className="block text-[10.5px] text-[var(--text-muted)]">{T.marketUnit}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Formule Patrimoine + formation */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 p-5" data-testid="patrimoine-cta">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">{T.plan.title}</h2>
            <span className="text-sm font-semibold text-[var(--primary)]">{T.plan.price(chfLabel(PATRIMOINE.price.month.cents))}</span>
          </div>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{T.plan.pitch}</p>
          {rented > 0 && (
            <p className="mt-1 text-xs text-[var(--text-muted)]">{T.plan.freeNote(FREE_LIMITS.proprietaire.rentedPropertiesFree, rented)}</p>
          )}
          <ul className="mt-3 grid gap-1 sm:grid-cols-2">
            {PATRIMOINE.includes.map((k) => (
              <li key={k} className="flex items-center gap-1.5 text-xs text-[var(--foreground)]">
                <Check size={12} className="text-[var(--primary)]" /> {FEATURE_LABEL[k] ?? k}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {patrimoineActive ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                <Check size={14} /> {T.plan.active}
              </span>
            ) : (
              <button
                onClick={activatePatrimoine}
                data-testid="patrimoine-activate"
                className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
              >
                {T.plan.activate}
              </button>
            )}
            <Link href="/tarifs" className="rounded-lg border border-[var(--card-border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition">
              {T.plan.seePricing}
            </Link>
          </div>
          <p className="mt-2 text-[11px] text-[var(--text-muted)]">{T.plan.trialNote}</p>
        </div>
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
          <h2 className="text-lg font-semibold text-[var(--foreground)] inline-flex items-center gap-2">
            <GraduationCap size={18} className="text-[var(--primary)]" /> {T.learn.title}
          </h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{T.learn.text}</p>
          <Link href={T.learn.href} className="mt-3 inline-block text-sm font-medium text-[var(--primary)] hover:underline">
            {T.learn.cta} →
          </Link>
        </div>
      </section>

      <p className="text-[11px] text-[var(--text-muted)]">{T.disclaimer}</p>
    </div>
  );
}
