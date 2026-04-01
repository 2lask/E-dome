"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/lib/context";
import type { Role, Transaction, MonthlyRevenue } from "@/lib/types";

// ─── Constants ──────────────────────────────────────────────────────────────

const REMUNERABLE_ROLES: Role[] = [
  "hote",
  "agence",
  "promoteur",
  "apporteur",
  "formateur",
  "proprietaire",
  "courtier",
];

const PERIODS = [
  { label: "7j", days: 7 },
  { label: "30j", days: 30 },
  { label: "90j", days: 90 },
  { label: "12m", days: 365 },
] as const;

// ─── Mock data ──────────────────────────────────────────────────────────────

const currentUser = {
  firstName: "Léo",
  lastName: "Martin",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
};

const kpiData = [
  {
    label: "Revenus",
    value: 24850,
    prev: 21200,
    isCurrency: true,
    sparkline: [12, 18, 14, 22, 19, 25, 24],
  },
  {
    label: "Réservations",
    value: 47,
    prev: 38,
    isCurrency: false,
    sparkline: [5, 7, 6, 8, 7, 9, 5],
  },
  {
    label: "Taux d'occupation",
    value: 82,
    prev: 75,
    isCurrency: false,
    suffix: "%",
    sparkline: [70, 74, 78, 80, 76, 84, 82],
  },
  {
    label: "Note moyenne",
    value: 4.8,
    prev: 4.6,
    isCurrency: false,
    sparkline: [4.5, 4.6, 4.7, 4.6, 4.8, 4.7, 4.8],
  },
];

const mockRevenueData: MonthlyRevenue[] = [
  { month: "Jan", revenue: 3200, bookings: 5, occupancy: 70 },
  { month: "Fév", revenue: 4100, bookings: 7, occupancy: 75 },
  { month: "Mar", revenue: 3800, bookings: 6, occupancy: 72 },
  { month: "Avr", revenue: 5200, bookings: 9, occupancy: 85 },
  { month: "Mai", revenue: 4800, bookings: 8, occupancy: 80 },
  { month: "Juin", revenue: 6100, bookings: 11, occupancy: 90 },
  { month: "Juil", revenue: 7200, bookings: 14, occupancy: 95 },
  { month: "Août", revenue: 6800, bookings: 12, occupancy: 92 },
  { month: "Sep", revenue: 5500, bookings: 9, occupancy: 82 },
  { month: "Oct", revenue: 4200, bookings: 7, occupancy: 76 },
  { month: "Nov", revenue: 3600, bookings: 6, occupancy: 68 },
  { month: "Déc", revenue: 4500, bookings: 8, occupancy: 78 },
];

const mockTransactions: Transaction[] = [
  { id: "t1", type: "payment", amount: 1200, currency: "CHF", status: "completed", description: "Réservation #R-2024-001", date: "2026-03-28", counterpart: "Jean Dupont" },
  { id: "t2", type: "payout", amount: 3500, currency: "CHF", status: "completed", description: "Virement mensuel", date: "2026-03-25" },
  { id: "t3", type: "commission", amount: 250, currency: "CHF", status: "pending", description: "Commission apporteur", date: "2026-03-22", counterpart: "Marie Leroy" },
  { id: "t4", type: "refund", amount: 800, currency: "CHF", status: "completed", description: "Annulation #R-2024-042", date: "2026-03-20", counterpart: "Paul Moreau" },
  { id: "t5", type: "payment", amount: 2100, currency: "CHF", status: "completed", description: "Réservation #R-2024-003", date: "2026-03-18", counterpart: "Sophie Bernard" },
  { id: "t6", type: "commission", amount: 180, currency: "CHF", status: "completed", description: "Commission formation", date: "2026-03-15" },
];

const mockActivity = [
  { id: "a1", text: "Nouvelle réservation pour Chalet Alpin", href: "/reservations", time: "Il y a 2h" },
  { id: "a2", text: "Avis 5 étoiles de Jean D.", href: "/profil", time: "Il y a 5h" },
  { id: "a3", text: "Paiement de 1'200 CHF reçu", href: "/dashboard", time: "Il y a 1j" },
  { id: "a4", text: "Nouvel abonné: Marie L.", href: "/profil", time: "Il y a 2j" },
  { id: "a5", text: "Formation \"Investir en Suisse\" publiée", href: "/formations", time: "Il y a 3j" },
];

const mockAppointments = [
  { id: "ap1", title: "Visite - Appartement Lausanne", date: "2026-04-03", time: "10:00" },
  { id: "ap2", title: "Signature - Villa Montreux", date: "2026-04-05", time: "14:30" },
  { id: "ap3", title: "Appel - Investisseur Dubai", date: "2026-04-07", time: "09:00" },
];

const shortcuts = [
  { label: "Publier", href: "/publier", icon: "+" },
  { label: "Créer formation", href: "/formations/creer", icon: "📚" },
  { label: "Créer événement", href: "/evenements/creer", icon: "📅" },
  { label: "Proposer service", href: "/services/proposer", icon: "🔧" },
  { label: "Statistiques", href: "/statistiques", icon: "📊" },
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
  const { activeRole, formatPrice } = useApp();
  const isRemunerable = REMUNERABLE_ROLES.includes(activeRole);

  if (!isRemunerable) {
    return <SimplifiedDashboard />;
  }

  return <FullDashboard />;
}

// ─── Simplified Dashboard ───────────────────────────────────────────────────

function SimplifiedDashboard() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8 animate-fade-in">
      <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-[#C4956A]/20 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">👋</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
          Bienvenue sur E-Dome
        </h1>
        <p className="text-[var(--text-secondary)]">
          Explorez les biens, gérez vos favoris et vos réservations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Mes favoris", href: "/favoris", icon: "❤️" },
          { label: "Mes réservations", href: "/reservations", icon: "📋" },
          { label: "Explorer", href: "/explorer", icon: "🔍" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6 text-center hover:border-[#C4956A]/50 transition-colors"
          >
            <span className="text-3xl block mb-3">{item.icon}</span>
            <span className="text-[var(--foreground)] font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Full Dashboard ─────────────────────────────────────────────────────────

function FullDashboard() {
  const { formatPrice } = useApp();
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
              Bonjour, {currentUser.firstName} 👋
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
                      {formatPrice(d.revenue)} - {d.bookings} rés.
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
                    {tx.status === "completed" ? "Terminé" : tx.status === "pending" ? "En attente" : "Échoué"}
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
              <span>{s.icon}</span>
              <span>{s.label}</span>
            </Link>
          ))}
        </div>
      </div>

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
              Partagez votre lien de parrainage et gagnez des commissions sur les revenus générés.
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
