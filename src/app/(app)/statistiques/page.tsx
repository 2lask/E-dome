"use client";

import React, { useState, useMemo } from "react";
import { properties, monthlyRevenue } from "@/lib/dashboard-data";
import { formatNumber } from "@/lib/format";

/* /statistiques : analytics agrege. AVANT, cette page avait ses
   propres "biens" (Appartement Lausanne / Studio Geneve / Chalet
   Verbier...) totalement deconnectes de ceux de /dashboard (Chalet
   Alpin Premium / Appartement Vue Lac / Studio Lausanne) — d'ou
   l'incoherence audit. Maintenant TOUT vient de dashboard-data.ts. */

type Period = "7j" | "30j" | "90j" | "12m";

const PERIOD_RATIO: Record<Period, number> = {
  "7j": 0.25,
  "30j": 1,
  "90j": 3,
  "12m": 12,
};

/* KPI derives : on multiplie la "base 30j" par le ratio de periode.
   Vues totales = somme des views des biens (= 5060). Visiteurs
   uniques = ~70% des vues. Conversions = reservations.length du
   dashboard rapportees. Revenus = monthly current x ratio. */
const BASE_VUES = properties.reduce((s, p) => s + p.views, 0);
const BASE_REVENUS = monthlyRevenue[monthlyRevenue.length - 1].value;

const SPARK_VUES: Record<Period, number[]> = {
  "7j": [120, 180, 160, 200, 210, 190, 180],
  "30j": [400, 450, 500, 480, 520, 550, 530, 560, 580, 600],
  "90j": [1200, 1400, 1500, 1600, 1700, 1650, 1750, 1800, 1850, 1900],
  "12m": monthlyRevenue.map((m) => Math.round(m.value / 4)),
};

const SPARK_REVENUS: Record<Period, number[]> = {
  "7j": [500, 700, 600, 800, 650, 600, 650],
  "30j": [1500, 1700, 1800, 1650, 1900, 2000, 1850, 1900, 2050, 2150],
  "90j": [4500, 5000, 5200, 5400, 5500, 5300, 5600, 5800, 6000, 6200],
  "12m": monthlyRevenue.map((m) => m.value),
};

/* Sources de trafic — token primary + muted-foreground au lieu de hex
   hardcodes. Cohabite avec le brutalist theme. */
const TRAFFIC_SOURCES = [
  { source: "Recherche directe", value: 35 },
  { source: "Réseaux sociaux", value: 25 },
  { source: "Referral apporteurs", value: 20 },
  { source: "Email & newsletter", value: 12 },
  { source: "Autre", value: 8 },
];

const HEATMAP_DATA = [
  [2, 1, 0, 0, 0, 1, 3, 5, 8, 10, 9, 8, 7, 8, 9, 10, 8, 6, 5, 7, 8, 6, 4, 3],
  [1, 1, 0, 0, 0, 1, 4, 6, 9, 11, 10, 9, 8, 9, 10, 11, 9, 7, 6, 8, 9, 7, 5, 3],
  [2, 1, 0, 0, 0, 2, 5, 7, 10, 12, 11, 10, 9, 10, 11, 12, 10, 8, 7, 9, 10, 8, 5, 4],
  [2, 1, 1, 0, 0, 2, 4, 7, 9, 11, 10, 9, 8, 9, 10, 11, 9, 7, 6, 8, 9, 7, 5, 3],
  [3, 2, 1, 0, 0, 2, 5, 8, 11, 13, 12, 11, 10, 11, 12, 13, 11, 9, 8, 10, 11, 9, 6, 4],
  [4, 3, 2, 1, 0, 1, 3, 6, 8, 10, 9, 8, 7, 8, 9, 10, 8, 7, 6, 8, 10, 8, 6, 5],
  [5, 4, 3, 1, 1, 1, 2, 4, 6, 8, 7, 6, 5, 6, 7, 8, 7, 6, 5, 7, 9, 8, 7, 6],
];

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 24;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");
  return (
    <svg width={w} height={h} className="inline-block">
      <polyline fill="none" stroke="var(--primary)" strokeWidth="1.5" points={points} />
    </svg>
  );
}

export default function StatistiquesPage() {
  const [period, setPeriod] = useState<Period>("30j");
  const [sortCol, setSortCol] = useState<"nom" | "vues" | "visiteurs" | "taux">("vues");
  const [sortAsc, setSortAsc] = useState(false);

  /* Vues par bien — derive de properties (la SOT du dashboard).
     Taux conv = occupancy ramene en pourcentage. */
  const viewsByProperty = useMemo(
    () =>
      properties.map((p) => ({
        nom: p.name,
        vues: p.views,
        visiteurs: Math.round(p.views * 0.72),
        taux: Math.round(p.occupancy * 100 * 10) / 10,
      })),
    [],
  );

  const sortedProperties = useMemo(() => {
    return [...viewsByProperty].sort((a, b) => {
      const aVal = a[sortCol];
      const bVal = b[sortCol];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortAsc
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
  }, [viewsByProperty, sortCol, sortAsc]);

  const handleSort = (col: typeof sortCol) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else {
      setSortCol(col);
      setSortAsc(false);
    }
  };

  const maxBarVues = Math.max(...viewsByProperty.map((p) => p.vues));
  const maxHeat = Math.max(...HEATMAP_DATA.flat());

  /* KPI cards : tout derive de la SOT. */
  const ratio = PERIOD_RATIO[period];
  const vues = Math.round(BASE_VUES * ratio);
  const visiteurs = Math.round(vues * 0.72);
  const revenus = Math.round(BASE_REVENUS * ratio);
  const conversions = Math.round(properties.length * 3 * ratio);

  const kpis = [
    { label: "Vues totales", value: formatNumber(vues), spark: SPARK_VUES[period] },
    { label: "Visiteurs uniques", value: formatNumber(visiteurs), spark: SPARK_VUES[period] },
    { label: "Conversions", value: formatNumber(conversions), spark: SPARK_VUES[period] },
    { label: "Revenus", value: `${formatNumber(revenus)} CHF`, spark: SPARK_REVENUS[period] },
  ];

  const periods: { key: Period; label: string }[] = [
    { key: "7j", label: "7 jours" },
    { key: "30j", label: "30 jours" },
    { key: "90j", label: "90 jours" },
    { key: "12m", label: "12 mois" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl page-heading text-[var(--foreground)]">Statistiques</h1>
        <div className="flex gap-1 p-1 rounded-lg bg-[var(--card)] border border-[var(--card-border)]">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                period === p.key
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--text-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-[var(--card)] border border-[var(--card-border)] space-y-2"
          >
            <p className="text-sm text-[var(--text-muted)]">{kpi.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-[var(--foreground)] tabular-nums">
                {kpi.value}
              </p>
              <Sparkline data={kpi.spark} />
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Vues par bien</h2>
        <div className="rounded-xl bg-[var(--card)] border border-[var(--card-border)] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--card-border)]">
                {(
                  [
                    { key: "nom" as const, label: "Bien" },
                    { key: "vues" as const, label: "Vues" },
                    { key: "visiteurs" as const, label: "Visiteurs" },
                    { key: "taux" as const, label: "Taux occup. (%)" },
                  ]
                ).map((col) => (
                  <th
                    key={col.key}
                    className="text-left p-4 text-[var(--text-muted)] font-medium cursor-pointer hover:text-[var(--foreground)] transition select-none"
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label} {sortCol === col.key ? (sortAsc ? "↑" : "↓") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedProperties.map((p, idx) => (
                <tr
                  key={idx}
                  className="border-b border-[var(--card-border)] last:border-0 hover:bg-[var(--hover-bg)] transition"
                >
                  <td className="p-4 text-[var(--foreground)] font-medium">{p.nom}</td>
                  <td className="p-4 text-[var(--foreground)] tabular-nums">
                    {formatNumber(p.vues)}
                  </td>
                  <td className="p-4 text-[var(--text-secondary)] tabular-nums">
                    {formatNumber(p.visiteurs)}
                  </td>
                  <td className="p-4 text-[var(--foreground)] tabular-nums">{p.taux}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Vues par bien (graphique)</h2>
        <div className="p-6 rounded-xl bg-[var(--card)] border border-[var(--card-border)]">
          <div className="space-y-3">
            {viewsByProperty.map((p, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-sm text-[var(--text-secondary)] w-44 truncate">
                  {p.nom}
                </span>
                <div className="flex-1 h-6 bg-[var(--hover-bg)] rounded overflow-hidden">
                  <div
                    className="h-full bg-[var(--primary)]/80 rounded transition-all"
                    style={{ width: `${(p.vues / maxBarVues) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-[var(--foreground)] font-medium w-20 text-right tabular-nums">
                  {formatNumber(p.vues)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Sources de trafic</h2>
        <div className="p-6 rounded-xl bg-[var(--card)] border border-[var(--card-border)]">
          <div className="space-y-3">
            {TRAFFIC_SOURCES.map((s, idx) => {
              const max = Math.max(...TRAFFIC_SOURCES.map((t) => t.value));
              return (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-sm text-[var(--text-secondary)] w-44 truncate">
                    {s.source}
                  </span>
                  <div className="flex-1 h-2.5 bg-[var(--hover-bg)] rounded overflow-hidden">
                    <div
                      className="h-full bg-[var(--primary)] rounded"
                      style={{ width: `${(s.value / max) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-[var(--foreground)] font-medium w-12 text-right tabular-nums">
                    {s.value}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Carte d&apos;activité</h2>
        <div className="p-6 rounded-xl bg-[var(--card)] border border-[var(--card-border)] overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="flex gap-1 mb-1 ml-10">
              {Array.from({ length: 24 }, (_, i) => (
                <span
                  key={i}
                  className="flex-1 text-center text-[10px] text-[var(--text-muted)]"
                >
                  {i % 4 === 0 ? `${i}h` : ""}
                </span>
              ))}
            </div>
            {HEATMAP_DATA.map((row, dayIdx) => (
              <div key={dayIdx} className="flex items-center gap-1">
                <span className="w-8 text-xs text-[var(--text-muted)]">
                  {DAYS[dayIdx]}
                </span>
                {row.map((val, hourIdx) => (
                  <div
                    key={hourIdx}
                    className="flex-1 aspect-square rounded-sm"
                    style={{
                      backgroundColor: `color-mix(in srgb, var(--primary) ${
                        Math.round((val / maxHeat) * 100)
                      }%, transparent)`,
                    }}
                    title={`${DAYS[dayIdx]} ${hourIdx}h: ${val} actions`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
