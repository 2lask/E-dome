"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/lib/context";
import type { Transaction, MonthlyRevenue } from "@/lib/types";

// ─── Constants ──────────────────────────────────────────────────────────────

const PERIODS = [
  { label: "7j", days: 7 },
  { label: "30j", days: 30 },
  { label: "90j", days: 90 },
  { label: "12m", days: 365 },
] as const;

type DashboardTab = "hote" | "formateur" | "apporteur" | "investisseur" | "agence";

const dashboardTabs: { key: DashboardTab; label: string; icon: string }[] = [
  { key: "hote", label: "Hôte", icon: "\uD83C\uDFE1" },
  { key: "formateur", label: "Formateur", icon: "\uD83D\uDCDA" },
  { key: "apporteur", label: "Apporteur", icon: "\uD83E\uDD1D" },
  { key: "investisseur", label: "Investisseur", icon: "\uD83D\uDCC8" },
  { key: "agence", label: "Agence", icon: "\uD83C\uDFE2" },
];

// ─── Mock data ──────────────────────────────────────────────────────────────

const currentUser = {
  firstName: "Léo",
  lastName: "Martin",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
};

const kpiData = [
  {
    label: "Revenus",
    value: 12450,
    prev: 10800,
    isCurrency: true,
    sparkline: [8, 9, 10, 11, 10, 12, 12.4],
  },
  {
    label: "Réservations",
    value: 34,
    prev: 28,
    isCurrency: false,
    sparkline: [4, 5, 4, 6, 5, 7, 5],
  },
  {
    label: "Apports",
    value: 8200,
    prev: 6500,
    isCurrency: true,
    sparkline: [5, 6, 5.5, 7, 6.8, 8, 8.2],
  },
  {
    label: "Conversion",
    value: 78,
    prev: 72,
    isCurrency: false,
    suffix: "%",
    sparkline: [65, 68, 70, 72, 74, 76, 78],
  },
];

const mockRevenueData: MonthlyRevenue[] = [
  { month: "Jan", revenue: 3200, bookings: 5, occupancy: 70 },
  { month: "Fev", revenue: 4100, bookings: 7, occupancy: 75 },
  { month: "Mar", revenue: 3800, bookings: 6, occupancy: 72 },
  { month: "Avr", revenue: 5200, bookings: 9, occupancy: 85 },
  { month: "Mai", revenue: 4800, bookings: 8, occupancy: 80 },
  { month: "Juin", revenue: 6100, bookings: 11, occupancy: 90 },
  { month: "Juil", revenue: 7200, bookings: 14, occupancy: 95 },
  { month: "Aout", revenue: 6800, bookings: 12, occupancy: 92 },
  { month: "Sep", revenue: 5500, bookings: 9, occupancy: 82 },
  { month: "Oct", revenue: 4200, bookings: 7, occupancy: 76 },
  { month: "Nov", revenue: 3600, bookings: 6, occupancy: 68 },
  { month: "Dec", revenue: 4500, bookings: 8, occupancy: 78 },
];

const mockTransactions: Transaction[] = [
  { id: "t1", type: "payment", amount: 1200, currency: "CHF", status: "completed", description: "Réservation #R-2024-001", date: "2026-03-28", counterpart: "Jean Dupont" },
  { id: "t2", type: "payout", amount: 3500, currency: "CHF", status: "completed", description: "Virement mensuel", date: "2026-03-25" },
  { id: "t3", type: "commission", amount: 250, currency: "CHF", status: "pending", description: "Commission apporteur", date: "2026-03-22", counterpart: "Marie Leroy" },
  { id: "t4", type: "refund", amount: 800, currency: "CHF", status: "completed", description: "Annulation #R-2024-042", date: "2026-03-20", counterpart: "Paul Moreau" },
  { id: "t5", type: "payment", amount: 2100, currency: "CHF", status: "completed", description: "Réservation #R-2024-003", date: "2026-03-18", counterpart: "Sophie Martin" },
  { id: "t6", type: "commission", amount: 180, currency: "CHF", status: "completed", description: "Commission formation", date: "2026-03-15" },
];

const mockActivity = [
  { id: "a1", text: "Nouvelle réservation pour Chalet Alpin", href: "/reservations", time: "Il y a 2h" },
  { id: "a2", text: "Avis 5 étoiles de Jean D.", href: "/profil", time: "Il y a 5h" },
  { id: "a3", text: "Paiement de 1'200 CHF reçu", href: "/dashboard", time: "Il y a 1j" },
  { id: "a4", text: "Nouvel abonné : Marie L.", href: "/profil", time: "Il y a 2j" },
  { id: "a5", text: "Formation \"Investir en Suisse\" publiée", href: "/formations", time: "Il y a 3j" },
];

const mockAppointments = [
  { id: "ap1", title: "Visite - Appartement Lausanne", date: "2026-04-03", time: "10:00" },
  { id: "ap2", title: "Signature - Villa Montreux", date: "2026-04-05", time: "14:30" },
  { id: "ap3", title: "Appel - Investisseur Dubaï", date: "2026-04-07", time: "09:00" },
];

const shortcuts = [
  { label: "Publier", href: "/publier", icon: "+" },
  { label: "Créer formation", href: "/formations/creer", icon: "B" },
  { label: "Créer événement", href: "/evenements/creer", icon: "C" },
  { label: "Proposer service", href: "/services/proposer", icon: "S" },
  { label: "Statistiques", href: "/statistiques", icon: "G" },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function Sparkline({ data, color = "#C4956A" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");
  return (
    <svg width={w} height={h} className="flex-shrink-0">
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
    </svg>
  );
}

function getDateStr() {
  return new Date().toLocaleDateString("fr-CH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { formatPrice } = useApp();
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>("hote");
  const [period, setPeriod] = useState<string>("30j");
  const [txFilter, setTxFilter] = useState<string>("all");
  const [showInvite, setShowInvite] = useState(false);
  const [goals, setGoals] = useState<{ label: string; target: number; current: number }[]>([
    { label: "Revenus mensuels", target: 10000, current: 6800 },
    { label: "Réservations", target: 20, current: 14 },
    { label: "Note moyenne", target: 5, current: 4.8 },
  ]);
  const [editGoalIdx, setEditGoalIdx] = useState<number | null>(null);
  const [editGoalVal, setEditGoalVal] = useState("");
  const [tooltipIdx, setTooltipIdx] = useState<number | null>(null);

  // Load goals from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("edome_goals");
      if (saved) setGoals(JSON.parse(saved));
    } catch {}
  }, []);

  const saveGoal = useCallback(
    (idx: number) => {
      const val = parseFloat(editGoalVal);
      if (!isNaN(val) && val > 0) {
        const updated = goals.map((g, i) => (i === idx ? { ...g, target: val } : g));
        setGoals(updated);
        localStorage.setItem("edome_goals", JSON.stringify(updated));
      }
      setEditGoalIdx(null);
    },
    [editGoalVal, goals]
  );

  const filteredTx = useMemo(() => {
    if (txFilter === "all") return mockTransactions;
    return mockTransactions.filter((t) => t.type === txFilter);
  }, [txFilter]);

  // Revenue chart dimensions
  const chartMax = Math.max(...mockRevenueData.map((d) => d.revenue));

  const exportCSV = useCallback(() => {
    const header = "Mois,Revenus,Réservations,Occupation\n";
    const rows = mockRevenueData
      .map((d) => `${d.month},${d.revenue},${d.bookings},${d.occupancy}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "edome-dashboard.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const txTypeLabels: Record<string, string> = {
    payment: "Paiement",
    payout: "Virement",
    commission: "Commission",
    refund: "Remboursement",
  };

  const txStatusColors: Record<string, string> = {
    completed: "text-emerald-400",
    pending: "text-amber-400",
    failed: "text-red-400",
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt=""
            className="w-14 h-14 rounded-full object-cover border-2 border-[#C4956A]"
          />
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">
              Bonjour, {currentUser.firstName}
            </h1>
            <p className="text-sm text-[var(--text-muted)] capitalize">{getDateStr()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="px-4 py-2 text-sm rounded-lg border border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
          >
            Exporter CSV
          </button>
          <button
            onClick={() => setShowInvite(true)}
            className="px-4 py-2 text-sm rounded-lg bg-[#C4956A] text-white hover:bg-[#b8845a] transition-colors"
          >
            Inviter
          </button>
        </div>
      </div>

      {/* Role Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 -mb-2">
        {dashboardTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setDashboardTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-xl whitespace-nowrap transition-colors ${
              dashboardTab === t.key
                ? "bg-[#C4956A] text-white"
                : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--foreground)] hover:border-[#C4956A]/30"
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ─── Hôte Tab ─── */}
      {dashboardTab === "hote" && (
      <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => {
          const change = kpi.prev > 0 ? ((kpi.value - kpi.prev) / kpi.prev) * 100 : 0;
          const isUp = change >= 0;
          return (
            <div
              key={kpi.label}
              className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-[var(--text-muted)]">{kpi.label}</span>
                <Sparkline data={kpi.sparkline} />
              </div>
              <div className="text-2xl font-bold text-[var(--foreground)]">
                {kpi.isCurrency ? formatPrice(kpi.value) : kpi.value}
                {kpi.suffix || ""}
              </div>
              <div className={`text-xs mt-1 ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                {isUp ? "+" : ""}
                {change.toFixed(1)}% vs période précédente
              </div>
            </div>
          );
        })}
      </div>

      {/* Goals */}
      <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Mes objectifs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map((goal, idx) => {
            const pct = Math.min((goal.current / goal.target) * 100, 100);
            return (
              <div key={goal.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">{goal.label}</span>
                  <button
                    onClick={() => {
                      setEditGoalIdx(idx);
                      setEditGoalVal(String(goal.target));
                    }}
                    className="text-xs text-[var(--text-muted)] hover:text-[#C4956A]"
                  >
                    Modifier
                  </button>
                </div>
                {editGoalIdx === idx ? (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={editGoalVal}
                      onChange={(e) => setEditGoalVal(e.target.value)}
                      className="flex-1 px-3 py-1 text-sm rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)]"
                    />
                    <button
                      onClick={() => saveGoal(idx)}
                      className="px-3 py-1 text-sm rounded-lg bg-[#C4956A] text-white"
                    >
                      OK
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-full h-2 bg-[var(--input-bg)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#C4956A] transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      {goal.current} / {goal.target} ({pct.toFixed(0)}%)
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue Chart + Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-3 bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Revenus</h2>
            <div className="flex gap-1 bg-[var(--input-bg)] rounded-lg p-1">
              {PERIODS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setPeriod(p.label)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    period === p.label
                      ? "bg-[#C4956A] text-white"
                      : "text-[var(--text-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-2 h-48 relative">
            {mockRevenueData.map((d, i) => {
              const h = (d.revenue / chartMax) * 100;
              return (
                <div
                  key={d.month}
                  className="flex-1 flex flex-col items-center justify-end relative"
                  onMouseEnter={() => setTooltipIdx(i)}
                  onMouseLeave={() => setTooltipIdx(null)}
                >
                  {tooltipIdx === i && (
                    <div className="absolute -top-14 bg-[var(--foreground)] text-[var(--background)] text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-10">
                      {formatPrice(d.revenue)} - {d.bookings} res.
                    </div>
                  )}
                  <div
                    className="w-full rounded-t-md bg-[#C4956A]/80 hover:bg-[#C4956A] transition-colors cursor-pointer"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[10px] text-[var(--text-muted)] mt-1">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transactions */}
        <div className="lg:col-span-2 bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Transactions</h2>
            <select
              value={txFilter}
              onChange={(e) => setTxFilter(e.target.value)}
              className="text-xs px-2 py-1 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--text-secondary)]"
            >
              <option value="all">Tout</option>
              <option value="payment">Paiements</option>
              <option value="payout">Virements</option>
              <option value="commission">Commissions</option>
              <option value="refund">Remboursements</option>
            </select>
          </div>
          <div className="space-y-3 max-h-[220px] overflow-y-auto">
            {filteredTx.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-2 border-b border-[var(--card-border)] last:border-0"
              >
                <div>
                  <div className="text-sm text-[var(--foreground)]">{tx.description}</div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {txTypeLabels[tx.type]} - {tx.date}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-medium ${
                      tx.type === "refund" ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    {tx.type === "refund" ? "-" : "+"}
                    {formatPrice(tx.amount)}
                  </div>
                  <div className={`text-xs ${txStatusColors[tx.status]}`}>
                    {tx.status === "completed" ? "Termine" : tx.status === "pending" ? "En attente" : "Echoue"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity + Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity */}
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Activité récente</h2>
          <div className="space-y-3">
            {mockActivity.map((a) => (
              <Link
                key={a.id}
                href={a.href}
                className="flex items-center justify-between py-2 border-b border-[var(--card-border)] last:border-0 hover:bg-[var(--hover-bg)] px-2 -mx-2 rounded-lg transition-colors"
              >
                <span className="text-sm text-[var(--foreground)]">{a.text}</span>
                <span className="text-xs text-[var(--text-muted)] whitespace-nowrap ml-3">{a.time}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Appointments */}
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Prochains rendez-vous</h2>
          <div className="space-y-3">
            {mockAppointments.map((ap) => (
              <div
                key={ap.id}
                className="flex items-center gap-4 py-2 border-b border-[var(--card-border)] last:border-0"
              >
                <div className="w-12 h-12 rounded-lg bg-[#C4956A]/10 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-xs text-[#C4956A] font-medium">
                    {new Date(ap.date).toLocaleDateString("fr-CH", { day: "numeric" })}
                  </span>
                  <span className="text-[10px] text-[#C4956A]">
                    {new Date(ap.date).toLocaleDateString("fr-CH", { month: "short" })}
                  </span>
                </div>
                <div>
                  <div className="text-sm text-[var(--foreground)]">{ap.title}</div>
                  <div className="text-xs text-[var(--text-muted)]">{ap.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Réservations récentes */}
      <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Réservations récentes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--card-border)]">
                {["Bien", "Client", "Dates", "Nuits", "Montant", "Statut", "Actions"].map((h) => (
                  <th key={h} className="text-left py-3 px-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { bien: "Chalet Alpin Premium", client: "Sophie B.", dates: "10-17 juil.", nuits: 7, montant: 2450, statut: "confirmed" },
                { bien: "Appart. Vue Lac", client: "Jean-Marc D.", dates: "15-20 avr.", nuits: 5, montant: 900, statut: "pending" },
                { bien: "Chalet Alpin Premium", client: "Marie L.", dates: "20-25 mai", nuits: 5, montant: 1750, statut: "pending" },
              ].map((r, i) => (
                <tr key={i} className="border-b border-[var(--card-border)] last:border-0 hover:bg-[var(--hover-bg)] transition-colors">
                  <td className="py-3 px-2 font-medium text-[var(--foreground)]">{r.bien}</td>
                  <td className="py-3 px-2 text-[var(--text-secondary)]">{r.client}</td>
                  <td className="py-3 px-2 text-[var(--text-secondary)]">{r.dates}</td>
                  <td className="py-3 px-2 text-[var(--text-secondary)]">{r.nuits}</td>
                  <td className="py-3 px-2 font-medium text-[var(--foreground)]">{formatPrice(r.montant)}</td>
                  <td className="py-3 px-2">
                    {r.statut === "confirmed" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-400/10 text-emerald-400">Confirmee</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-400/10 text-amber-400">En attente</span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex gap-2">
                      {r.statut === "pending" && (
                        <button className="px-3 py-1 text-xs rounded-lg bg-[#C4956A] text-white hover:bg-[#b8845a] transition-colors">Confirmer</button>
                      )}
                      <button className="px-3 py-1 text-xs rounded-lg border border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">Contacter</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mes biens — Performance */}
      <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Mes biens — Performance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Chalet Alpin Premium", occupation: 87, vues: 234, revenus: 4200 },
            { name: "Appart. Vue Lac", occupation: 72, vues: 156, revenus: 2800 },
            { name: "Studio Centre-Ville", occupation: 65, vues: 98, revenus: 1450 },
          ].map((prop) => (
            <div key={prop.name} className="border border-[var(--card-border)] rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">{prop.name}</h3>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)]">Taux d&apos;occupation</span>
                  <span className="text-[var(--foreground)] font-medium">{prop.occupation}%</span>
                </div>
                <div className="w-full h-2 bg-[var(--input-bg)] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#C4956A] transition-all duration-500" style={{ width: `${prop.occupation}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)]">Vues cette semaine</span>
                <span className="text-[var(--foreground)] font-medium">{prop.vues}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)]">Revenus du mois</span>
                <span className="text-[#C4956A] font-medium">{formatPrice(prop.revenus)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Apporteurs actifs sur mes biens */}
      <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Apporteurs actifs sur mes biens</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          3 apporteurs actifs · 8 réservations générées · {formatPrice(342)} de commissions versées
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--card-border)]">
                {["Apporteur", "Bien", "Réservations", "Commissions"].map((h) => (
                  <th key={h} className="text-left py-3 px-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { apporteur: "Jean M.", bien: "Chalet Alpin", reservations: 3, commissions: 126 },
                { apporteur: "Sara L.", bien: "Appart. Lac", reservations: 1, commissions: 36 },
              ].map((a, i) => (
                <tr key={i} className="border-b border-[var(--card-border)] last:border-0 hover:bg-[var(--hover-bg)] transition-colors">
                  <td className="py-3 px-2 font-medium text-[var(--foreground)]">{a.apporteur}</td>
                  <td className="py-3 px-2 text-[var(--text-secondary)]">{a.bien}</td>
                  <td className="py-3 px-2 text-[var(--text-secondary)]">{a.reservations}</td>
                  <td className="py-3 px-2 font-medium text-[#C4956A]">{formatPrice(a.commissions)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Raccourcis</h2>
        <div className="flex flex-wrap gap-3">
          {shortcuts.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--card-border)] hover:border-[#C4956A]/50 text-sm text-[var(--foreground)] transition-colors"
            >
              <span className="w-6 h-6 rounded bg-[#C4956A]/10 flex items-center justify-center text-xs text-[#C4956A] font-bold">{s.icon}</span>
              <span>{s.label}</span>
            </Link>
          ))}
        </div>
      </div>
      </>
      )}

      {/* ─── Formateur Tab ─── */}
      {dashboardTab === "formateur" && (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Étudiants", value: "2 130" },
            { label: "Revenus", value: formatPrice(8470) },
            { label: "Formations", value: "2" },
            { label: "Note", value: "4.9/5" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
              <span className="text-sm text-[var(--text-muted)]">{kpi.label}</span>
              <div className="text-2xl font-bold text-[var(--foreground)] mt-2">{kpi.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Mes formations</h2>
            <Link href="/formations" className="text-sm text-[#C4956A] hover:underline">Voir tout</Link>
          </div>
          <div className="space-y-3">
            {[
              { id: "f1", title: "Investir en Suisse romande", students: 1280, rating: 4.9, revenue: 45600 },
              { id: "f2", title: "Gestion locative avancée", students: 850, rating: 4.8, revenue: 32400 },
            ].map((f, idx) => (
              <div key={f.id} className="flex items-center justify-between py-3 border-b border-[var(--card-border)] last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C4956A]/10 flex items-center justify-center text-sm font-bold text-[#C4956A]">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--foreground)]">{f.title}</div>
                    <div className="text-xs text-[var(--text-muted)]">{f.students} étudiants</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-[var(--foreground)]">{f.rating}/5</div>
                  <div className="text-xs text-[var(--text-muted)]">{formatPrice(f.revenue)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
      )}

      {/* ─── Apporteur Tab ─── */}
      {dashboardTab === "apporteur" && (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Clics", value: "23" },
            { label: "Conversions", value: "8" },
            { label: "Commissions", value: formatPrice(2400) },
            { label: "En attente", value: formatPrice(633) },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
              <span className="text-sm text-[var(--text-muted)]">{kpi.label}</span>
              <div className="text-2xl font-bold text-[var(--foreground)] mt-2">{kpi.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Liens de tracking</h2>
          <div className="space-y-3">
            {[
              { id: "tl1", label: "Lien principal", url: "https://e-dome.ch/r/LEO2026", clicks: 142, conversions: 8 },
              { id: "tl2", label: "Campagne Instagram", url: "https://e-dome.ch/r/LEO-IG", clicks: 87, conversions: 3 },
              { id: "tl3", label: "Newsletter", url: "https://e-dome.ch/r/LEO-NL", clicks: 56, conversions: 2 },
            ].map((link) => (
              <div key={link.id} className="flex items-center justify-between py-3 border-b border-[var(--card-border)] last:border-0">
                <div>
                  <div className="text-sm font-medium text-[var(--foreground)]">{link.label}</div>
                  <div className="text-xs text-[var(--text-muted)] font-mono">{link.url}</div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="text-sm text-[var(--foreground)]">{link.clicks}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">clics</div>
                  </div>
                  <div>
                    <div className="text-sm text-emerald-400">{link.conversions}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">conv.</div>
                  </div>
                  <button
                    onClick={() => navigator.clipboard?.writeText(link.url)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
                  >
                    Copier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
      )}

      {/* ─── Investisseur Tab ─── */}
      {dashboardTab === "investisseur" && (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Biens suivis", value: "7" },
            { label: "Rendement", value: "5.8%" },
            { label: "Valeur", value: formatPrice(6450000) },
            { label: "Opportunités", value: "3" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
              <span className="text-sm text-[var(--text-muted)]">{kpi.label}</span>
              <div className="text-2xl font-bold text-[var(--foreground)] mt-2">{kpi.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Portefeuille</h2>
          <div className="space-y-3">
            {[
              { id: "inv1", title: "Résidence Les Alpes - Verbier", rendement: "6.2%", valeur: 2800000 },
              { id: "inv2", title: "Immeuble Centre - Lausanne", rendement: "5.4%", valeur: 1950000 },
              { id: "inv3", title: "Villa Riviera - Montreux", rendement: "5.8%", valeur: 1700000 },
            ].map((bien) => (
              <div key={bien.id} className="flex items-center justify-between py-3 border-b border-[var(--card-border)] last:border-0">
                <div>
                  <div className="text-sm font-medium text-[var(--foreground)]">{bien.title}</div>
                  <div className="text-xs text-[var(--text-muted)]">Rendement : {bien.rendement}</div>
                </div>
                <div className="text-sm font-bold text-[#C4956A]">{formatPrice(bien.valeur)}</div>
              </div>
            ))}
          </div>
        </div>
      </>
      )}

      {/* ─── Agence Tab ─── */}
      {dashboardTab === "agence" && (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Mandats", value: "12" },
            { label: "Leads", value: "8" },
            { label: "Volume", value: formatPrice(2850000) },
            { label: "Conversion", value: "22%" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
              <span className="text-sm text-[var(--text-muted)]">{kpi.label}</span>
              <div className="text-2xl font-bold text-[var(--foreground)] mt-2">{kpi.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Mandats actifs</h2>
          <div className="space-y-3">
            {[
              { id: "m1", title: "Appartement 4.5p - Lausanne", status: "En vente", prix: 890000 },
              { id: "m2", title: "Villa 6p - Pully", status: "Sous compromis", prix: 1450000 },
              { id: "m3", title: "Studio meublé - Genève", status: "En location", prix: 1800 },
            ].map((mandat) => (
              <div key={mandat.id} className="flex items-center justify-between py-3 border-b border-[var(--card-border)] last:border-0">
                <div>
                  <div className="text-sm font-medium text-[var(--foreground)]">{mandat.title}</div>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] rounded-full font-medium ${
                    mandat.status === "Sous compromis"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-emerald-500/20 text-emerald-400"
                  }`}>
                    {mandat.status}
                  </span>
                </div>
                <div className="text-sm font-bold text-[#C4956A]">{formatPrice(mandat.prix)}</div>
              </div>
            ))}
          </div>
        </div>
      </>
      )}

      {/* Invite modal */}
      {showInvite && (
        <div
          className="fixed inset-0 bg-[var(--overlay)] flex items-center justify-center z-50 p-4"
          onClick={() => setShowInvite(false)}
        >
          <div
            className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 w-full max-w-md animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              Inviter un contact
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Partagez votre lien de parrainage et gagnez des commissions sur les revenus generes.
            </p>
            <div className="flex gap-2 mb-4">
              <input
                readOnly
                value="https://e-dome.ch/invite/LEO2026"
                className="flex-1 px-3 py-2 text-sm rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)]"
              />
              <button
                onClick={() => navigator.clipboard?.writeText("https://e-dome.ch/invite/LEO2026")}
                className="px-4 py-2 text-sm rounded-lg bg-[#C4956A] text-white hover:bg-[#b8845a]"
              >
                Copier
              </button>
            </div>
            <button
              onClick={() => setShowInvite(false)}
              className="w-full py-2 text-sm rounded-lg border border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
