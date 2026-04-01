"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";

/* ─── Mock Data ──────────────────────────────────────────────────────────── */

const DEFAULT_KPIS = [
  { label: "Capital investi", value: 250000, editable: true, isCurrency: true },
  { label: "Rendement annuel", value: 8.2, editable: true, isCurrency: false, suffix: "%" },
  { label: "Revenus mensuels", value: 1708, editable: false, isCurrency: true },
  { label: "Plus-value estimee", value: 37500, editable: false, isCurrency: true },
];

const DEFAULT_PROJECTIONS = [
  { annee: 2026, capital: 250000, rendement: 8.2, revenus: 20500, plusValue: 12500, total: 283000 },
  { annee: 2027, capital: 283000, rendement: 8.5, revenus: 24055, plusValue: 14150, total: 321205 },
  { annee: 2028, capital: 321205, rendement: 8.8, revenus: 28266, plusValue: 16060, total: 365531 },
  { annee: 2029, capital: 365531, rendement: 9.0, revenus: 32898, plusValue: 18277, total: 416706 },
  { annee: 2030, capital: 416706, rendement: 9.2, revenus: 38337, plusValue: 20835, total: 475878 },
];

const GROWTH_DATA = [
  { label: "Jan", value: 20500 },
  { label: "Fev", value: 21200 },
  { label: "Mar", value: 22800 },
  { label: "Avr", value: 23500 },
  { label: "Mai", value: 24100 },
  { label: "Jun", value: 25800 },
  { label: "Jul", value: 26400 },
  { label: "Aou", value: 27100 },
  { label: "Sep", value: 28200 },
  { label: "Oct", value: 29500 },
  { label: "Nov", value: 30800 },
  { label: "Dec", value: 32000 },
];

const KEY_METRICS = [
  { label: "Taux d'occupation", value: "94%", trend: "+2%" },
  { label: "TRI (5 ans)", value: "12.4%", trend: "+0.8%" },
  { label: "Ratio dette/capital", value: "35%", trend: "-5%" },
  { label: "Cash-on-cash", value: "9.1%", trend: "+1.2%" },
  { label: "Cap rate", value: "6.8%", trend: "+0.3%" },
  { label: "Nombre de biens", value: "4", trend: "+1" },
];

const REPORTS = [
  { title: "Rapport mensuel - Mars 2026", date: "2026-03-31", type: "Mensuel" },
  { title: "Rapport trimestriel Q1 2026", date: "2026-03-31", type: "Trimestriel" },
  { title: "Rapport annuel 2025", date: "2025-12-31", type: "Annuel" },
  { title: "Rapport mensuel - Fevrier 2026", date: "2026-02-28", type: "Mensuel" },
  { title: "Analyse de performance", date: "2026-03-15", type: "Analyse" },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function InvestisseursPage() {
  const { activeRole, formatPrice } = useApp();
  const [kpis, setKpis] = useState(DEFAULT_KPIS);
  const [projections, setProjections] = useState(DEFAULT_PROJECTIONS);
  const [editingKpi, setEditingKpi] = useState<number | null>(null);
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);

  if (activeRole !== "investisseur") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-8 rounded-2xl bg-[var(--card)] border border-[var(--card-border)]">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">Accès restreint</h2>
          <p className="text-[var(--text-secondary)]">
            Cette page est réservée aux investisseurs. Activez le role &laquo;Investisseur&raquo; dans vos paramètres.
          </p>
        </div>
      </div>
    );
  }

  const maxGrowth = Math.max(...GROWTH_DATA.map((d) => d.value));

  const handleKpiChange = (idx: number, val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return;
    setKpis((prev) => prev.map((k, i) => (i === idx ? { ...k, value: num } : k)));
  };

  const handleProjectionChange = (rowIdx: number, col: string, val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return;
    setProjections((prev) =>
      prev.map((p, i) => (i === rowIdx ? { ...p, [col]: num } : p))
    );
  };

  const handleExport = (format: "pdf" | "csv") => {
    alert(`Export ${format.toUpperCase()} en cours... (demo)`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Tableau de bord investisseur</h1>
          <p className="text-[var(--text-secondary)]">Suivez et pilotez vos investissements immobiliers</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport("pdf")}
            className="px-4 py-2 rounded-lg bg-[#C4956A] text-white text-sm font-medium hover:opacity-90 transition"
          >
            Export PDF
          </button>
          <button
            onClick={() => handleExport("csv")}
            className="px-4 py-2 rounded-lg border border-[var(--card-border)] text-[var(--foreground)] text-sm font-medium hover:bg-[var(--hover-bg)] transition"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-[var(--card)] border border-[var(--card-border)] space-y-2 cursor-pointer"
            onClick={() => kpi.editable && setEditingKpi(editingKpi === idx ? null : idx)}
          >
            <p className="text-sm text-[var(--text-muted)]">{kpi.label}</p>
            {editingKpi === idx && kpi.editable ? (
              <input
                type="number"
                value={kpi.value}
                onChange={(e) => handleKpiChange(idx, e.target.value)}
                onBlur={() => setEditingKpi(null)}
                autoFocus
                className="w-full text-2xl font-bold bg-transparent text-[var(--foreground)] border-b border-[#C4956A] outline-none"
              />
            ) : (
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {kpi.isCurrency ? formatPrice(kpi.value) : `${kpi.value}${kpi.suffix || ""}`}
              </p>
            )}
            {kpi.editable && (
              <p className="text-xs text-[#C4956A]">Cliquez pour modifier</p>
            )}
          </div>
        ))}
      </section>

      {/* Projections Table */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Projections sur 5 ans</h2>
        <div className="rounded-xl bg-[var(--card)] border border-[var(--card-border)] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--card-border)]">
                {["Annee", "Capital", "Rendement (%)", "Revenus", "Plus-value", "Total"].map((h) => (
                  <th key={h} className="text-left p-4 text-[var(--text-muted)] font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projections.map((p, rowIdx) => (
                <tr key={p.annee} className="border-b border-[var(--card-border)] last:border-0 hover:bg-[var(--hover-bg)] transition">
                  <td className="p-4 text-[var(--foreground)] font-medium">{p.annee}</td>
                  {(["capital", "rendement", "revenus", "plusValue", "total"] as const).map((col) => (
                    <td key={col} className="p-4 text-[var(--foreground)]" onClick={() => setEditingCell({ row: rowIdx, col })}>
                      {editingCell?.row === rowIdx && editingCell?.col === col ? (
                        <input
                          type="number"
                          value={p[col]}
                          onChange={(e) => handleProjectionChange(rowIdx, col, e.target.value)}
                          onBlur={() => setEditingCell(null)}
                          autoFocus
                          className="w-24 bg-transparent border-b border-[#C4956A] outline-none text-[var(--foreground)]"
                        />
                      ) : col === "rendement" ? (
                        `${p[col]}%`
                      ) : (
                        formatPrice(p[col])
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Growth Chart */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Evolution des revenus (2026)</h2>
        <div className="p-6 rounded-xl bg-[var(--card)] border border-[var(--card-border)]">
          <div className="flex items-end gap-2 h-48">
            {GROWTH_DATA.map((d, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-[var(--text-muted)]">{formatPrice(d.value)}</span>
                <div
                  className="w-full rounded-t bg-[#C4956A]/80 hover:bg-[#C4956A] transition"
                  style={{ height: `${(d.value / maxGrowth) * 100}%` }}
                />
                <span className="text-xs text-[var(--text-muted)]">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Indicateurs cles</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {KEY_METRICS.map((m, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-muted)]">{m.label}</p>
                <p className="text-xl font-bold text-[var(--foreground)]">{m.value}</p>
              </div>
              <span className={`text-sm font-medium ${m.trend.startsWith("+") ? "text-emerald-400" : m.trend.startsWith("-") ? "text-red-400" : "text-[var(--text-muted)]"}`}>
                {m.trend}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Reports */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Rapports</h2>
        <div className="space-y-3">
          {REPORTS.map((r, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] flex items-center justify-between hover:bg-[var(--hover-bg)] transition">
              <div>
                <p className="text-[var(--foreground)] font-medium">{r.title}</p>
                <p className="text-sm text-[var(--text-muted)]">{r.date} — {r.type}</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-[var(--hover-bg)] text-[var(--text-secondary)] text-sm hover:text-[var(--foreground)] transition">
                Télécharger
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
