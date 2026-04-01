"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/lib/context";

/* ─── Mock Data ──────────────────────────────────────────────────────────── */

type Period = "7j" | "30j" | "90j" | "12m";

const KPI_DATA: Record<Period, { vues: number; visiteurs: number; conversions: number; revenus: number; sparkVues: number[]; sparkVisiteurs: number[]; sparkConversions: number[]; sparkRevenus: number[] }> = {
  "7j": {
    vues: 1240, visiteurs: 890, conversions: 23, revenus: 4500,
    sparkVues: [120, 180, 160, 200, 210, 190, 180],
    sparkVisiteurs: [90, 130, 110, 150, 140, 130, 140],
    sparkConversions: [2, 4, 3, 5, 3, 3, 3],
    sparkRevenus: [500, 700, 600, 800, 650, 600, 650],
  },
  "30j": {
    vues: 5200, visiteurs: 3800, conversions: 95, revenus: 18500,
    sparkVues: [400, 450, 500, 480, 520, 550, 530, 560, 580, 600],
    sparkVisiteurs: [300, 330, 370, 350, 380, 400, 390, 410, 420, 440],
    sparkConversions: [7, 8, 10, 9, 11, 10, 9, 10, 11, 10],
    sparkRevenus: [1500, 1700, 1800, 1650, 1900, 2000, 1850, 1900, 2050, 2150],
  },
  "90j": {
    vues: 14800, visiteurs: 10200, conversions: 280, revenus: 52000,
    sparkVues: [1200, 1400, 1500, 1600, 1700, 1650, 1750, 1800, 1850, 1900],
    sparkVisiteurs: [850, 950, 1000, 1050, 1100, 1080, 1150, 1200, 1250, 1300],
    sparkConversions: [22, 25, 28, 30, 32, 29, 31, 33, 35, 34],
    sparkRevenus: [4500, 5000, 5200, 5400, 5500, 5300, 5600, 5800, 6000, 6200],
  },
  "12m": {
    vues: 62000, visiteurs: 43000, conversions: 1150, revenus: 215000,
    sparkVues: [3500, 4000, 4500, 5000, 5200, 5500, 5800, 5500, 5700, 6000, 6200, 6500],
    sparkVisiteurs: [2500, 2900, 3200, 3500, 3700, 3900, 4000, 3800, 4000, 4200, 4400, 4500],
    sparkConversions: [70, 80, 85, 95, 100, 105, 110, 100, 105, 115, 120, 125],
    sparkRevenus: [14000, 15500, 17000, 18000, 18500, 19000, 20000, 18500, 19500, 20500, 21500, 22000],
  },
};

const VIEWS_BY_PROPERTY = [
  { nom: "Appartement 3p Lausanne", vues: 845, visiteurs: 620, taux: 4.2 },
  { nom: "Villa Montreux vue lac", vues: 1230, visiteurs: 890, taux: 6.1 },
  { nom: "Studio Geneve centre", vues: 560, visiteurs: 410, taux: 3.5 },
  { nom: "Chalet Verbier", vues: 920, visiteurs: 680, taux: 5.3 },
  { nom: "Penthouse Zurich", vues: 1450, visiteurs: 1050, taux: 7.8 },
  { nom: "Loft Berne", vues: 340, visiteurs: 250, taux: 2.1 },
  { nom: "Maison Neuchatel", vues: 670, visiteurs: 480, taux: 3.9 },
];

const TRAFFIC_SOURCES = [
  { source: "Recherche directe", value: 35, color: "#C4956A" },
  { source: "Reseaux sociaux", value: 25, color: "#60a5fa" },
  { source: "Referral", value: 20, color: "#34d399" },
  { source: "Email", value: 12, color: "#a78bfa" },
  { source: "Autre", value: 8, color: "#f87171" },
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

/* ─── Sparkline component ────────────────────────────────────────────────── */

function Sparkline({ data, color = "#C4956A" }: { data: number[]; color?: string }) {
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
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
    </svg>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function StatistiquesPage() {
  const { activeRole, formatPrice } = useApp();
  const [period, setPeriod] = useState<Period>("30j");
  const [sortCol, setSortCol] = useState<"nom" | "vues" | "visiteurs" | "taux">("vues");
  const [sortAsc, setSortAsc] = useState(false);

  const allowedRoles = ["hote", "agence", "promoteur", "proprietaire", "courtier"];

  if (!allowedRoles.includes(activeRole)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-8 rounded-2xl bg-[var(--card)] border border-[var(--card-border)]">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">Acces restreint</h2>
          <p className="text-[var(--text-secondary)]">
            Les statistiques sont accessibles aux hotes, agences, promoteurs, proprietaires et courtiers.
          </p>
        </div>
      </div>
    );
  }

  const data = KPI_DATA[period];

  const sortedProperties = useMemo(() => {
    return [...VIEWS_BY_PROPERTY].sort((a, b) => {
      const aVal = a[sortCol];
      const bVal = b[sortCol];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [sortCol, sortAsc]);

  const handleSort = (col: typeof sortCol) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else { setSortCol(col); setSortAsc(false); }
  };

  const maxBarVues = Math.max(...VIEWS_BY_PROPERTY.map((p) => p.vues));
  const maxHeat = Math.max(...HEATMAP_DATA.flat());

  const periods: { key: Period; label: string }[] = [
    { key: "7j", label: "7 jours" },
    { key: "30j", label: "30 jours" },
    { key: "90j", label: "90 jours" },
    { key: "12m", label: "12 mois" },
  ];

  const kpis = [
    { label: "Vues totales", value: data.vues.toLocaleString("fr-CH"), spark: data.sparkVues },
    { label: "Visiteurs uniques", value: data.visiteurs.toLocaleString("fr-CH"), spark: data.sparkVisiteurs },
    { label: "Conversions", value: data.conversions.toLocaleString("fr-CH"), spark: data.sparkConversions },
    { label: "Revenus", value: formatPrice(data.revenus), spark: data.sparkRevenus },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Statistiques</h1>
        <div className="flex gap-1 p-1 rounded-lg bg-[var(--card)] border border-[var(--card-border)]">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                period === p.key
                  ? "bg-[#C4956A] text-white"
                  : "text-[var(--text-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards with Sparklines */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="p-5 rounded-xl bg-[var(--card)] border border-[var(--card-border)] space-y-2">
            <p className="text-sm text-[var(--text-muted)]">{kpi.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-[var(--foreground)]">{kpi.value}</p>
              <Sparkline data={kpi.spark} />
            </div>
          </div>
        ))}
      </section>

      {/* Views by Property - sortable table */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Vues par bien</h2>
        <div className="rounded-xl bg-[var(--card)] border border-[var(--card-border)] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--card-border)]">
                {([
                  { key: "nom" as const, label: "Bien" },
                  { key: "vues" as const, label: "Vues" },
                  { key: "visiteurs" as const, label: "Visiteurs" },
                  { key: "taux" as const, label: "Taux conv. (%)" },
                ]).map((col) => (
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
                <tr key={idx} className="border-b border-[var(--card-border)] last:border-0 hover:bg-[var(--hover-bg)] transition">
                  <td className="p-4 text-[var(--foreground)] font-medium">{p.nom}</td>
                  <td className="p-4 text-[var(--foreground)]">{p.vues.toLocaleString("fr-CH")}</td>
                  <td className="p-4 text-[var(--text-secondary)]">{p.visiteurs.toLocaleString("fr-CH")}</td>
                  <td className="p-4 text-[var(--foreground)]">{p.taux}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Views Bar Chart */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Vues par bien (graphique)</h2>
        <div className="p-6 rounded-xl bg-[var(--card)] border border-[var(--card-border)]">
          <div className="space-y-3">
            {VIEWS_BY_PROPERTY.map((p, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-sm text-[var(--text-secondary)] w-44 truncate">{p.nom}</span>
                <div className="flex-1 h-6 bg-[var(--hover-bg)] rounded overflow-hidden">
                  <div
                    className="h-full bg-[#C4956A]/80 rounded transition-all"
                    style={{ width: `${(p.vues / maxBarVues) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-[var(--foreground)] font-medium w-16 text-right">{p.vues}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Traffic Sources Donut */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Sources de trafic</h2>
        <div className="p-6 rounded-xl bg-[var(--card)] border border-[var(--card-border)]">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Simple donut representation */}
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                {(() => {
                  let offset = 0;
                  return TRAFFIC_SOURCES.map((s, idx) => {
                    const dash = s.value;
                    const gap = 100 - dash;
                    const el = (
                      <circle
                        key={idx}
                        cx="18" cy="18" r="15.9155"
                        fill="none"
                        stroke={s.color}
                        strokeWidth="3"
                        strokeDasharray={`${dash} ${gap}`}
                        strokeDashoffset={-offset}
                      />
                    );
                    offset += dash;
                    return el;
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-[var(--foreground)]">100%</span>
              </div>
            </div>
            {/* Legend */}
            <div className="space-y-2">
              {TRAFFIC_SOURCES.map((s, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-sm text-[var(--text-secondary)]">{s.source}</span>
                  <span className="text-sm font-medium text-[var(--foreground)]">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Activity Heatmap */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Carte d&apos;activite</h2>
        <div className="p-6 rounded-xl bg-[var(--card)] border border-[var(--card-border)] overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="flex gap-1 mb-1 ml-10">
              {Array.from({ length: 24 }, (_, i) => (
                <span key={i} className="flex-1 text-center text-[10px] text-[var(--text-muted)]">
                  {i % 4 === 0 ? `${i}h` : ""}
                </span>
              ))}
            </div>
            {HEATMAP_DATA.map((row, dayIdx) => (
              <div key={dayIdx} className="flex items-center gap-1">
                <span className="w-8 text-xs text-[var(--text-muted)]">{DAYS[dayIdx]}</span>
                {row.map((val, hourIdx) => (
                  <div
                    key={hourIdx}
                    className="flex-1 aspect-square rounded-sm"
                    style={{
                      backgroundColor: `rgba(196,149,106,${val / maxHeat})`,
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
