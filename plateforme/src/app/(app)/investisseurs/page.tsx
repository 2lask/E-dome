"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  BarChart3,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  Download,
  FileText,
  Activity,
  Target,
  Zap,
  Edit,
  Save,
  Plus,
  X,
  FileDown,
  Pencil,
  Check,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/context";
import {
  investorKPIs,
  investorMetrics,
  investorProjections,
  investorMonthlyGrowth,
  investorReports,
} from "@/lib/mock-data";

// ─── Types ───────────────────────────────────────────────

interface KPIItem {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  change: string;
  color: string;
}

interface ReportItem {
  id: string;
  title: string;
  date: string;
  type?: string;
}

// ─── Page ───────────────────────────────────────────────

export default function InvestisseursPage() {
  const { availableRoles, formatPrice } = useApp();
  const REQUIRED_ROLES = ['investisseur'];
  const hasAccess = REQUIRED_ROLES.some(r => availableRoles.includes(r as any));

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // KPIs
  const kpiIcons = [DollarSign, Users, TrendingUp, BarChart3];
  const kpiColors = ["text-green-400", "text-blue-400", "text-purple-400", "text-[#C4956A]"];
  const kpiChanges = ["+18.2%", "+12.5%", "+3.2%", "+24.5%"];
  const initialKpis: KPIItem[] = investorKPIs.map((kpi, i) => ({
    label: kpi.label,
    value: kpi.value,
    icon: kpiIcons[i],
    change: kpiChanges[i],
    color: kpiColors[i],
  }));

  const [kpis, setKpis] = useState<KPIItem[]>(initialKpis);
  const [editingKpiIndex, setEditingKpiIndex] = useState<number | null>(null);
  const [editingKpiValue, setEditingKpiValue] = useState("");

  // Add new KPI
  const [showAddKpi, setShowAddKpi] = useState(false);
  const [newKpiLabel, setNewKpiLabel] = useState("");
  const [newKpiValue, setNewKpiValue] = useState("");
  const [newKpiTrend, setNewKpiTrend] = useState("");

  // Projections editable
  const [projections, setProjections] = useState(
    investorProjections.map((row) => ({ ...row }))
  );
  const [tableEditMode, setTableEditMode] = useState(false);
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [editingCellValue, setEditingCellValue] = useState("");

  // Reports
  const [reports, setReports] = useState<ReportItem[]>(
    investorReports.map((r) => ({ ...r }))
  );
  const [showAddReport, setShowAddReport] = useState(false);
  const [newReportTitle, setNewReportTitle] = useState("");
  const [newReportType, setNewReportType] = useState("Mensuel");
  const [newReportDate, setNewReportDate] = useState("");

  // Chart hover
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Metrics
  const metricIcons = [Activity, Target, Zap, DollarSign, TrendingUp];
  const metrics = investorMetrics.map((metric, i) => ({
    label: metric.label,
    value: metric.value,
    icon: metricIcons[i],
  }));

  const maxRevenue = Math.max(...investorMonthlyGrowth.map((m) => m.value));

  const handleSaveKpi = (index: number) => {
    setKpis((prev) =>
      prev.map((kpi, i) => (i === index ? { ...kpi, value: editingKpiValue } : kpi))
    );
    setEditingKpiIndex(null);
    showToast("Modifications sauvegardées");
  };

  const handleAddKpi = () => {
    if (!newKpiLabel || !newKpiValue) return;
    setKpis((prev) => [
      ...prev,
      {
        label: newKpiLabel,
        value: newKpiValue,
        icon: BarChart3,
        change: newKpiTrend || "+0%",
        color: "text-[#C4956A]",
      },
    ]);
    setNewKpiLabel("");
    setNewKpiValue("");
    setNewKpiTrend("");
    setShowAddKpi(false);
    showToast("KPI ajouté avec succès");
  };

  const handleCellEdit = (rowIndex: number, col: string) => {
    if (!tableEditMode) return;
    setEditingCell({ row: rowIndex, col });
    setEditingCellValue((projections[rowIndex] as Record<string, string>)[col]);
  };

  const handleCellSave = () => {
    if (!editingCell) return;
    setProjections((prev) =>
      prev.map((row, i) =>
        i === editingCell.row ? { ...row, [editingCell.col]: editingCellValue } : row
      )
    );
    setEditingCell(null);
    showToast("Modifications sauvegardées");
  };

  const handleCellKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      handleCellSave();
    }
  };

  const handleAddReport = () => {
    if (!newReportTitle || !newReportDate) return;
    setReports((prev) => [
      ...prev,
      {
        id: `r-${Date.now()}`,
        title: newReportTitle,
        date: newReportDate,
        type: newReportType,
      },
    ]);
    setNewReportTitle("");
    setNewReportDate("");
    setNewReportType("Mensuel");
    setShowAddReport(false);
    showToast("Rapport ajouté avec succès");
  };

  const handleExport = (format: string) => {
    showToast(`Export ${format} lancé - téléchargement en cours...`);
  };

  const projCols = ["users", "gmv", "revenue", "margin"] as const;

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <Lock className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">Accès restreint</h2>
          <p className="text-[var(--text-secondary)] text-sm mb-6">Cette page est réservée aux investisseurs. Activez ce rôle dans vos paramètres.</p>
          <Link href="/parametres" className="px-6 py-2.5 rounded-xl bg-[#C4956A] text-black font-semibold">Gérer mes rôles</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* ── Toast ── */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed right-6 top-6 z-50 rounded-xl border border-[#C4956A]/30 bg-[#0e0e0e] px-6 py-3 text-sm font-medium text-[#C4956A] shadow-2xl"
        >
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            {toast}
          </div>
        </motion.div>
      )}

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="mb-1 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-green-400">
              Accès Investisseur
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white">Espace Investisseurs</h1>
          <p className="mt-1 text-[var(--text-secondary)]">Métriques et projections de la plateforme E-Dome</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExport("PDF")}
            className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-[#0e0e0e] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/5"
          >
            <FileDown className="h-4 w-4" />
            Exporter en PDF
          </button>
          <button
            onClick={() => handleExport("CSV")}
            className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-[#0e0e0e] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/5"
          >
            <FileDown className="h-4 w-4" />
            Exporter en CSV
          </button>
        </div>
      </motion.div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={`${kpi.label}-${i}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-white/[0.06] bg-[#0e0e0e] p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">{kpi.label}</span>
              <div className="flex items-center gap-2">
                {editingKpiIndex === i ? (
                  <button
                    onClick={() => handleSaveKpi(i)}
                    className="rounded-md bg-[#C4956A]/20 p-1 text-[#C4956A] hover:bg-[#C4956A]/30"
                  >
                    <Save className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingKpiIndex(i);
                      setEditingKpiValue(kpi.value);
                    }}
                    className="rounded-md p-1 text-[#555] hover:bg-white/5 hover:text-[var(--text-secondary)]"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                )}
                <kpi.icon className={cn("h-5 w-5", kpi.color)} />
              </div>
            </div>
            {editingKpiIndex === i ? (
              <input
                type="text"
                value={editingKpiValue}
                onChange={(e) => setEditingKpiValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveKpi(i)}
                autoFocus
                className="w-full rounded-lg border border-[#C4956A]/30 bg-[#1a1a1a] px-3 py-1.5 text-xl font-bold text-white outline-none focus:border-[#C4956A]/60"
              />
            ) : (
              <p className="text-2xl font-bold text-white">{kpi.value}</p>
            )}
            <div className="mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-green-400" />
              <span className="text-xs font-medium text-green-400">{kpi.change}</span>
              <span className="text-[10px] text-[#666]">vs mois dernier</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Add KPI ── */}
      {!showAddKpi ? (
        <button
          onClick={() => setShowAddKpi(true)}
          className="flex items-center gap-2 rounded-lg border border-dashed border-white/[0.1] bg-transparent px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:border-[#C4956A]/40 hover:text-[#C4956A]"
        >
          <Plus className="h-4 w-4" />
          Ajouter un KPI
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-[#C4956A]/20 bg-[#0e0e0e] p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Nouveau KPI</h3>
            <button onClick={() => setShowAddKpi(false)} className="text-[var(--text-secondary)] hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Label</label>
              <input
                type="text"
                value={newKpiLabel}
                onChange={(e) => setNewKpiLabel(e.target.value)}
                placeholder="Ex: CAC"
                className="w-full rounded-lg border border-white/[0.06] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none focus:border-[#C4956A]/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Valeur</label>
              <input
                type="text"
                value={newKpiValue}
                onChange={(e) => setNewKpiValue(e.target.value)}
                placeholder="Ex: CHF 1'200"
                className="w-full rounded-lg border border-white/[0.06] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none focus:border-[#C4956A]/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Tendance</label>
              <input
                type="text"
                value={newKpiTrend}
                onChange={(e) => setNewKpiTrend(e.target.value)}
                placeholder="Ex: +5.2%"
                className="w-full rounded-lg border border-white/[0.06] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none focus:border-[#C4956A]/50"
              />
            </div>
          </div>
          <button
            onClick={handleAddKpi}
            disabled={!newKpiLabel || !newKpiValue}
            className="mt-4 rounded-lg bg-[#C4956A] px-5 py-2 text-sm font-semibold text-black transition hover:bg-[#D4A574] disabled:opacity-40"
          >
            Ajouter
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ── Growth Chart (interactive) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-white/[0.06] bg-[#0e0e0e] p-6"
        >
          <h2 className="mb-5 text-lg font-semibold text-white">Croissance mensuelle</h2>
          <div className="flex h-64 items-end gap-2">
            {investorMonthlyGrowth.map((m, idx) => (
              <div
                key={m.month}
                className="relative flex flex-1 flex-col items-center gap-1"
                onMouseEnter={() => setHoveredBar(idx)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Tooltip */}
                {hoveredBar === idx && (
                  <div className="absolute -top-10 z-10 whitespace-nowrap rounded-lg border border-[#C4956A]/30 bg-[#1a1a1a] px-3 py-1.5 text-xs font-medium text-white shadow-xl">
                    {m.month}: {formatPrice(m.value)}
                  </div>
                )}
                <span className="text-[9px] font-medium text-[#C4956A]">
                  {(m.value / 1000).toFixed(0)}k
                </span>
                <div
                  className={cn(
                    "w-full cursor-pointer rounded-t-md bg-gradient-to-t from-[#C4956A]/60 to-[#C4956A] transition-all duration-300",
                    hoveredBar === idx && "from-[#D4A574]/80 to-[#D4A574] scale-x-110"
                  )}
                  style={{ height: `${(m.value / maxRevenue) * 200}px` }}
                />
                <span className="text-[9px] text-[var(--text-secondary)]">{m.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Key Metrics ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-white/[0.06] bg-[#0e0e0e] p-6"
        >
          <h2 className="mb-5 text-lg font-semibold text-white">Metriques cles</h2>
          <div className="space-y-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-[#080808] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C4956A]/10">
                    <metric.icon className="h-4 w-4 text-[#C4956A]" />
                  </div>
                  <span className="text-sm text-[var(--text-secondary)]">{metric.label}</span>
                </div>
                <span className="text-lg font-bold text-white">{metric.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Projections Table (editable) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl border border-white/[0.06] bg-[#0e0e0e] p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Projections</h2>
          <button
            onClick={() => setTableEditMode(!tableEditMode)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition",
              tableEditMode
                ? "bg-[#C4956A]/20 text-[#C4956A]"
                : "border border-white/[0.06] text-[var(--text-secondary)] hover:bg-white/5 hover:text-white"
            )}
          >
            {tableEditMode ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Mode edition actif
              </>
            ) : (
              <>
                <Edit className="h-3.5 w-3.5" />
                Editer le tableau
              </>
            )}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06] text-left text-xs text-[var(--text-secondary)]">
                <th className="pb-3 pr-4 font-medium">Periode</th>
                <th className="pb-3 pr-4 font-medium">Utilisateurs</th>
                <th className="pb-3 pr-4 font-medium">GMV</th>
                <th className="pb-3 pr-4 font-medium">Revenue</th>
                <th className="pb-3 font-medium">Marge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {projections.map((row, rowIdx) => (
                <tr key={row.year} className="text-sm">
                  <td className="py-3 pr-4 font-medium text-white">{row.year}</td>
                  {projCols.map((col) => {
                    const isEditing =
                      editingCell?.row === rowIdx && editingCell?.col === col;
                    const val = (row as Record<string, string>)[col];
                    return (
                      <td
                        key={col}
                        className={cn(
                          "py-3 pr-4",
                          col === "margin" ? "" : "text-[var(--text-secondary)]",
                          tableEditMode && "cursor-pointer hover:bg-white/[0.02]"
                        )}
                        onClick={() => handleCellEdit(rowIdx, col)}
                      >
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingCellValue}
                            onChange={(e) => setEditingCellValue(e.target.value)}
                            onKeyDown={handleCellKeyDown}
                            onBlur={handleCellSave}
                            autoFocus
                            className="w-full rounded border border-[#C4956A]/30 bg-[#1a1a1a] px-2 py-1 text-sm text-white outline-none"
                          />
                        ) : col === "margin" ? (
                          <span className="rounded-full bg-green-500/15 px-2.5 py-0.5 text-xs font-medium text-green-400">
                            {val}
                          </span>
                        ) : (
                          val
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Monthly Reports ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-xl border border-white/[0.06] bg-[#0e0e0e] p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Rapports</h2>
          <button
            onClick={() => setShowAddReport(!showAddReport)}
            className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-transparent px-4 py-2 text-xs font-medium text-[var(--text-secondary)] transition hover:bg-white/5 hover:text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            Ajouter un rapport
          </button>
        </div>

        {/* Add Report Form */}
        {showAddReport && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-5 rounded-lg border border-[#C4956A]/20 bg-[#080808] p-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Titre</label>
                <input
                  type="text"
                  value={newReportTitle}
                  onChange={(e) => setNewReportTitle(e.target.value)}
                  placeholder="Rapport Q1 2026"
                  className="w-full rounded-lg border border-white/[0.06] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none focus:border-[#C4956A]/50"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Type</label>
                <select
                  value={newReportType}
                  onChange={(e) => setNewReportType(e.target.value)}
                  className="w-full rounded-lg border border-white/[0.06] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none focus:border-[#C4956A]/50"
                >
                  <option value="Mensuel">Mensuel</option>
                  <option value="Trimestriel">Trimestriel</option>
                  <option value="Annuel">Annuel</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Date</label>
                <input
                  type="date"
                  value={newReportDate}
                  onChange={(e) => setNewReportDate(e.target.value)}
                  className="w-full rounded-lg border border-white/[0.06] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none focus:border-[#C4956A]/50"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddReport}
                  disabled={!newReportTitle || !newReportDate}
                  className="w-full rounded-lg bg-[#C4956A] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#D4A574] disabled:opacity-40"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="group flex flex-col rounded-lg border border-white/[0.06] bg-[#080808] p-4 transition-colors hover:border-[#C4956A]/20"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#C4956A]/10">
                <FileText className="h-5 w-5 text-[#C4956A]" />
              </div>
              <p className="mb-1 text-sm font-semibold text-white">{report.title}</p>
              <p className="mb-1 text-xs text-[var(--text-secondary)]">{report.date}</p>
              {report.type && (
                <span className="mb-2 inline-flex w-fit rounded-full bg-[#C4956A]/10 px-2 py-0.5 text-[10px] font-medium text-[#C4956A]">
                  {report.type}
                </span>
              )}
              <button className="mt-auto flex items-center gap-1 text-xs text-[#C4956A] transition-colors hover:text-[#D4A574]">
                <Download className="h-3 w-3" />
                Télécharger
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
