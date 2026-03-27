"use client";

import { useState, useMemo } from "react";
import { Eye, MessageCircle, TrendingUp, DollarSign, ArrowUpRight, ArrowUpDown, Lock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/context";
import { motion } from "framer-motion";

// ─── Period options ───────────────────────────────────────
const periods = ["7j", "30j", "90j", "12 mois"] as const;

// ─── KPI Data ─────────────────────────────────────────────
const kpis = [
  { label: "Vues totales", value: "24'580", trend: +14.2, icon: Eye, color: "text-blue-400", bg: "bg-blue-400/10", sparkline: [30, 42, 38, 55, 60, 52, 68] },
  { label: "Contacts reçus", value: "342", trend: +8.7, icon: MessageCircle, color: "text-emerald-400", bg: "bg-emerald-400/10", sparkline: [25, 30, 35, 40, 38, 45, 50] },
  { label: "Taux de conversion", value: "3.8%", trend: -0.3, icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-400/10", sparkline: [45, 48, 42, 40, 38, 35, 37] },
  { label: "Revenus", value: "CHF 48'200", trend: +22.1, icon: DollarSign, color: "text-[#C4956A]", bg: "bg-[#C4956A]/10", sparkline: [20, 28, 35, 42, 50, 55, 65] },
];

// ─── Views per property ───────────────────────────────────
const propertyViews = [
  { name: "Penthouse Vue Lac Léman", views: 4820, contacts: 67, conversion: 1.4 },
  { name: "Villa Moderne Lausanne", views: 3950, contacts: 52, conversion: 1.3 },
  { name: "Chalet Verbier Premium", views: 3640, contacts: 89, conversion: 2.4 },
  { name: "Studio Centre Genève", views: 3210, contacts: 41, conversion: 1.3 },
  { name: "Loft Industriel Zürich", views: 2870, contacts: 38, conversion: 1.3 },
  { name: "Appartement Neuchâtel", views: 2450, contacts: 28, conversion: 1.1 },
  { name: "Maison Fribourg", views: 1980, contacts: 22, conversion: 1.1 },
  { name: "Terrain Morges", views: 1660, contacts: 5, conversion: 0.3 },
];

// ─── Views over time (bar chart data) ─────────────────────
const viewsOverTime = [
  { label: "Lun", value: 3200 },
  { label: "Mar", value: 4100 },
  { label: "Mer", value: 3800 },
  { label: "Jeu", value: 5200 },
  { label: "Ven", value: 4600 },
  { label: "Sam", value: 2100 },
  { label: "Dim", value: 1580 },
];

// ─── Traffic sources ──────────────────────────────────────
const trafficSources = [
  { label: "Recherche organique", pct: 42, color: "bg-blue-400" },
  { label: "Direct", pct: 28, color: "bg-[#C4956A]" },
  { label: "Réseaux sociaux", pct: 18, color: "bg-purple-400" },
  { label: "Référents", pct: 12, color: "bg-emerald-400" },
];

// ─── Activity heatmap ─────────────────────────────────────
const heatmapDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const heatmapSlots = ["6-10h", "10-13h", "13-16h", "16-19h", "19-22h", "22-6h"];
// 7 days x 6 slots – intensity 0-5
const heatmapData = [
  [1, 3, 4, 5, 3, 1],
  [2, 4, 3, 5, 4, 1],
  [1, 3, 5, 4, 3, 0],
  [2, 5, 4, 5, 4, 2],
  [3, 4, 3, 4, 5, 2],
  [0, 2, 3, 2, 3, 1],
  [0, 1, 2, 2, 2, 0],
];

const heatColors = [
  "bg-white/[0.03]",
  "bg-[#C4956A]/15",
  "bg-[#C4956A]/30",
  "bg-[#C4956A]/45",
  "bg-[#C4956A]/65",
  "bg-[#C4956A]/85",
];

type SortKey = "name" | "views" | "contacts" | "conversion";
type SortDir = "asc" | "desc";

export default function StatistiquesPage() {
  const { availableRoles } = useApp();
  const REQUIRED_ROLES = ['hote', 'agence', 'promoteur', 'proprietaire', 'courtier'];
  const hasAccess = REQUIRED_ROLES.some(r => availableRoles.includes(r as any));

  const [period, setPeriod] = useState<string>("30j");
  const [sortKey, setSortKey] = useState<SortKey>("views");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sortedProperties = useMemo(() => {
    return [...propertyViews].sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortKey === "name") return mul * a.name.localeCompare(b.name);
      return mul * (a[sortKey] - b[sortKey]);
    });
  }, [sortKey, sortDir]);

  const maxViews = Math.max(...viewsOverTime.map((v) => v.value));

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <Lock className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">Accès restreint</h2>
          <p className="text-[var(--text-secondary)] text-sm mb-6">Cette page est réservée aux hôtes, agences, promoteurs, propriétaires et courtiers. Activez ce rôle dans vos paramètres.</p>
          <Link href="/parametres" className="px-6 py-2.5 rounded-xl bg-[#C4956A] text-black font-semibold">Gérer mes rôles</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header + Period Selector */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Statistiques</h1>
          <p className="mt-1 text-sm text-white/50">Analyse de performance de vos biens</p>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-white/[0.06] bg-[#080808] p-1">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                period === p ? "bg-[#C4956A]/20 text-[#C4956A]" : "text-white/40 hover:text-white/70"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </motion.div>

      {/* KPI Cards with Sparklines */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, i) => {
          const maxVal = Math.max(...kpi.sparkline);
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-white/[0.06] bg-[#0e0e0e] p-5"
            >
              <div className="flex items-center justify-between">
                <div className={cn("rounded-xl p-2.5", kpi.bg)}>
                  <kpi.icon className={cn("h-5 w-5", kpi.color)} />
                </div>
                <span className={cn(
                  "flex items-center gap-1 text-xs font-semibold",
                  kpi.trend >= 0 ? "text-emerald-400" : "text-red-400"
                )}>
                  <ArrowUpRight className={cn("h-3.5 w-3.5", kpi.trend < 0 && "rotate-90")} />
                  {Math.abs(kpi.trend)}%
                </span>
              </div>
              <p className="mt-4 text-2xl font-bold">{kpi.value}</p>
              <p className="mt-1 text-sm text-white/40">{kpi.label}</p>
              {/* Sparkline */}
              <div className="mt-3 flex items-end gap-[3px] h-8">
                {kpi.sparkline.map((val, j) => (
                  <motion.div
                    key={j}
                    className="flex-1 rounded-sm bg-[#C4956A]"
                    initial={{ height: 0 }}
                    animate={{ height: `${(val / maxVal) * 100}%` }}
                    transition={{ duration: 0.5, delay: i * 0.08 + j * 0.05, ease: "easeOut" }}
                    style={{ opacity: 0.4 + (val / maxVal) * 0.6 }}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Two columns: Table + Bar Chart */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Views per Property Table */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl border border-white/[0.06] bg-[#0e0e0e] p-6"
        >
          <h2 className="mb-4 text-lg font-semibold">Vues par bien</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-left text-xs text-white/40">
                  {([
                    ["name", "Bien"],
                    ["views", "Vues"],
                    ["contacts", "Contacts"],
                    ["conversion", "Conv. %"],
                  ] as [SortKey, string][]).map(([key, label]) => (
                    <th
                      key={key}
                      className="cursor-pointer pb-3 font-medium transition-colors hover:text-white/70"
                      onClick={() => handleSort(key)}
                    >
                      <div className="flex items-center gap-1">
                        {label}
                        <ArrowUpDown className={cn("h-3 w-3", sortKey === key ? "text-[#C4956A]" : "text-white/20")} />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedProperties.map((prop) => (
                  <tr key={prop.name} className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]">
                    <td className="py-3 font-medium">{prop.name}</td>
                    <td className="py-3 text-white/60">{prop.views.toLocaleString("fr-CH")}</td>
                    <td className="py-3 text-white/60">{prop.contacts}</td>
                    <td className="py-3">
                      <span className={cn(
                        "text-xs font-semibold",
                        prop.conversion >= 2 ? "text-emerald-400" : prop.conversion >= 1 ? "text-white/60" : "text-red-400"
                      )}>
                        {prop.conversion}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Views Over Time Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-white/[0.06] bg-[#0e0e0e] p-6"
        >
          <h2 className="mb-4 text-lg font-semibold">Vues cette semaine</h2>
          <div className="flex h-56 items-end gap-3">
            {viewsOverTime.map((day, i) => {
              const pct = maxViews > 0 ? (day.value / maxViews) * 100 : 0;
              return (
                <div key={day.label} className="group relative flex flex-1 flex-col items-center">
                  {/* Tooltip */}
                  <div className="pointer-events-none absolute -top-10 z-10 whitespace-nowrap rounded-lg border border-white/[0.06] bg-[#1a1a1a] px-3 py-1.5 text-xs opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                    <span className="font-semibold text-[#C4956A]">{day.value.toLocaleString("fr-CH")}</span> vues
                  </div>
                  {/* Bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${pct}%` }}
                    transition={{ delay: 0.5 + i * 0.06, duration: 0.6, ease: "easeOut" }}
                    className="w-full cursor-pointer rounded-t-md transition-opacity hover:opacity-80"
                    style={{ background: "linear-gradient(to top, #C4956A, #C4956A80)" }}
                  />
                  <span className="mt-2 text-[11px] text-white/40">{day.label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Two columns: Traffic Sources + Heatmap */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Traffic Sources (CSS pie segments) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-white/[0.06] bg-[#0e0e0e] p-6"
        >
          <h2 className="mb-6 text-lg font-semibold">Sources de trafic</h2>
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            {/* Pie chart via conic-gradient */}
            <div
              className="h-40 w-40 flex-shrink-0 rounded-full"
              style={{
                background: `conic-gradient(
                  #60a5fa 0% 42%,
                  #C4956A 42% 70%,
                  #a78bfa 70% 88%,
                  #34d399 88% 100%
                )`,
              }}
            >
              <div className="flex h-full w-full items-center justify-center">
                <div className="h-24 w-24 rounded-full bg-[#0e0e0e]" />
              </div>
            </div>
            {/* Legend */}
            <div className="flex-1 space-y-3">
              {trafficSources.map((source) => (
                <div key={source.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn("h-3 w-3 rounded-full", source.color)} />
                    <span className="text-sm text-white/70">{source.label}</span>
                  </div>
                  <span className="text-sm font-semibold">{source.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Activity Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="rounded-2xl border border-white/[0.06] bg-[#0e0e0e] p-6"
        >
          <h2 className="mb-6 text-lg font-semibold">Activité par créneau</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="pb-2 text-left text-[11px] font-medium text-white/30" />
                  {heatmapSlots.map((slot) => (
                    <th key={slot} className="pb-2 text-center text-[11px] font-medium text-white/30">
                      {slot}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapDays.map((day, di) => (
                  <tr key={day}>
                    <td className="pr-3 py-1 text-right text-[11px] font-medium text-white/40">{day}</td>
                    {heatmapData[di].map((intensity, si) => (
                      <td key={si} className="p-1">
                        <div
                          className={cn(
                            "mx-auto h-8 w-full rounded-md transition-colors",
                            heatColors[intensity]
                          )}
                          title={`${day} ${heatmapSlots[si]}: intensité ${intensity}/5`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Legend */}
          <div className="mt-4 flex items-center justify-end gap-1">
            <span className="mr-1 text-[10px] text-white/30">Faible</span>
            {heatColors.map((c, i) => (
              <div key={i} className={cn("h-3 w-5 rounded-sm", c)} />
            ))}
            <span className="ml-1 text-[10px] text-white/30">Fort</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
