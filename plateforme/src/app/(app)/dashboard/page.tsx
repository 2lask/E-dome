"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  Building2,
  Eye,
  TrendingUp,
  Plus,
  FileText,
  UserPlus,
  Calendar,
  Briefcase,
  BarChart3,
  CalendarDays,
  Star,
  CreditCard,
  MessageCircle,
  Users,
  Clock,
  GraduationCap,
  Mail,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  X,
  Link as LinkIcon,
  Copy,
  Check,
  Target,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { cn, formatDate, timeAgo } from "@/lib/utils";
import {
  mockDashboardStats,
  mockMonthlyRevenue,
  mockTransactions,
  mockActivity,
  mockAppointments,
  currentUser,
} from "@/lib/mock-data";
import { useApp } from "@/lib/context";
import { Heart, Search as SearchIcon, Calendar as CalendarIcon2 } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

// Sparkline data for each KPI (7 data points each, ascending trend)
const sparklineData = [
  [35, 42, 38, 55, 62, 58, 72], // Revenus
  [40, 45, 50, 48, 55, 60, 65], // Biens
  [30, 38, 42, 50, 55, 48, 68], // Vues
  [45, 52, 60, 55, 50, 48, 45], // Conversion (slight dip)
];

const kpiConfigs = [
  {
    label: "Revenus totaux",
    rawValue: mockDashboardStats.totalRevenue,
    rawPrevValue: Math.round(mockDashboardStats.totalRevenue / 1.125),
    isPrice: true,
    trend: +12.5,
    icon: DollarSign,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    label: "Biens actifs",
    rawValue: mockDashboardStats.totalProperties,
    rawPrevValue: mockDashboardStats.totalProperties - 1,
    isPrice: false,
    trend: +2,
    icon: Building2,
    color: "text-[#C4956A]",
    bg: "bg-[#C4956A]/10",
  },
  {
    label: "Vues ce mois",
    rawValue: mockDashboardStats.totalViews,
    rawPrevValue: Math.round(mockDashboardStats.totalViews / 1.083),
    isPrice: false,
    trend: +8.3,
    icon: Eye,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    label: "Taux de conversion",
    rawValue: mockDashboardStats.conversionRate,
    rawPrevValue: mockDashboardStats.conversionRate + 0.4,
    isPrice: false,
    isPercent: true,
    trend: -0.4,
    icon: TrendingUp,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
];

const statusColors: Record<string, string> = {
  completed: "bg-emerald-500/10 text-emerald-400",
  pending: "bg-yellow-500/10 text-yellow-400",
  failed: "bg-red-500/10 text-red-400",
};

const statusLabels: Record<string, string> = {
  completed: "Compl\u00e9t\u00e9",
  pending: "En attente",
  failed: "\u00c9chou\u00e9",
};

const typeColors: Record<string, string> = {
  income: "bg-emerald-500/10 text-emerald-400",
  expense: "bg-red-500/10 text-red-400",
  commission: "bg-[#C4956A]/10 text-[#C4956A]",
  refund: "bg-orange-500/10 text-orange-400",
};

const typeLabels: Record<string, string> = {
  income: "Revenu",
  expense: "D\u00e9pense",
  commission: "Commission",
  refund: "Remboursement",
};

const activityIcons: Record<string, React.ElementType> = {
  calendar: Calendar,
  eye: Eye,
  star: Star,
  "user-plus": UserPlus,
  "credit-card": CreditCard,
  "message-circle": MessageCircle,
};

const activityLinks: Record<string, string> = {
  eye: "/explorer",
  heart: "/favoris",
  "message-circle": "/messages",
  star: "/profil",
  link: "/apporteurs",
  "credit-card": "/dashboard",
  calendar: "/dashboard",
  "user-plus": "/apporteurs",
};

const bottomStatsConfig = [
  { label: "Apporteurs actifs", value: "24", icon: Users, color: "text-blue-400" },
  { label: "Commissions en attente", priceValue: mockDashboardStats.referralEarnings, icon: Clock, color: "text-yellow-400" },
  { label: "Formations suivies", value: "8", icon: GraduationCap, color: "text-purple-400" },
  { label: "Messages non lus", value: "5", icon: Mail, color: "text-[#C4956A]" },
];

// ─── Period filter options ────────────────────────────────
const periodOptions = [
  { label: "7 jours", months: 1 },
  { label: "30 jours", months: 1 },
  { label: "90 jours", months: 3 },
  { label: "12 mois", months: 12 },
] as const;

// ─── Transaction filter tabs ─────────────────────────────
const txFilterTabs = [
  { key: "all", label: "Toutes" },
  { key: "income", label: "Ventes" },
  { key: "expense", label: "Locations" },
  { key: "commission", label: "Commissions" },
] as const;

export default function DashboardPage() {
  const { activeRole, availableRoles, formatPrice } = useApp();
  const REMUNERABLE_ROLES = ['hote', 'agence', 'promoteur', 'apporteur', 'formateur', 'proprietaire', 'courtier'];
  const isRemunerable = REMUNERABLE_ROLES.some(r => availableRoles.includes(r as any));

  const kpis = kpiConfigs.map((kpi) => ({
    ...kpi,
    value: kpi.isPrice ? formatPrice(kpi.rawValue) : kpi.isPercent ? `${kpi.rawValue}%` : kpi.rawValue.toLocaleString("fr-CH"),
    prevValue: kpi.isPrice ? formatPrice(kpi.rawPrevValue) : kpi.isPercent ? `${(kpi.rawPrevValue as number).toFixed(1)}%` : kpi.rawPrevValue.toLocaleString("fr-CH"),
  }));

  const bottomStats = bottomStatsConfig.map((stat) => ({
    ...stat,
    value: 'priceValue' in stat && stat.priceValue != null ? formatPrice(stat.priceValue) : stat.value ?? "",
  }));

  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [periodIdx, setPeriodIdx] = useState(3); // default "12 mois"
  const [txFilter, setTxFilter] = useState<string>("all");
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);

  // Goals state
  const [goals, setGoals] = useState([
    { id: "revenue", label: "Revenus mensuels", current: 15000, target: 25000, unit: "", prefix: "", isPrice: true },
    { id: "properties", label: "Nouveaux biens", current: 3, target: 5, unit: "", prefix: "", isPrice: false },
    { id: "occupation", label: "Taux d'occupation", current: 78, target: 90, unit: "%", prefix: "", isPrice: false },
  ]);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // Load goals from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("edome_goals");
      if (stored) {
        const parsed = JSON.parse(stored);
        setGoals((prev) =>
          prev.map((g) => {
            const saved = parsed.find((s: { id: string; target: number }) => s.id === g.id);
            return saved ? { ...g, target: saved.target } : g;
          })
        );
      }
    } catch {}
  }, []);

  const saveGoalTarget = (goalId: string) => {
    const newTarget = Number(editValue);
    if (!newTarget || newTarget <= 0) {
      setEditingGoal(null);
      return;
    }
    setGoals((prev) => {
      const updated = prev.map((g) => (g.id === goalId ? { ...g, target: newTarget } : g));
      try {
        localStorage.setItem(
          "edome_goals",
          JSON.stringify(updated.map((g) => ({ id: g.id, target: g.target })))
        );
      } catch {}
      return updated;
    });
    setEditingGoal(null);
  };

  // Filter monthly revenue by selected period
  const visibleMonths = periodOptions[periodIdx].months;
  const filteredRevenue = mockMonthlyRevenue.slice(-visibleMonths);
  const maxRevenue = Math.max(...filteredRevenue.map((m) => m.revenue));

  // Filter transactions
  const filteredTransactions =
    txFilter === "all"
      ? mockTransactions
      : mockTransactions.filter((tx) => tx.type === txFilter);

  const txCounts: Record<string, number> = {
    all: mockTransactions.length,
    income: mockTransactions.filter((t) => t.type === "income").length,
    expense: mockTransactions.filter((t) => t.type === "expense").length,
    commission: mockTransactions.filter((t) => t.type === "commission").length,
  };

  // CSV export
  const handleExportCSV = useCallback(() => {
    const headers = ["Date", "Description", "Montant", "Devise", "Type", "Statut"];
    const rows = mockTransactions.map((tx) => [
      tx.date,
      `"${tx.description}"`,
      tx.amount.toString(),
      tx.currency,
      typeLabels[tx.type],
      statusLabels[tx.status],
    ]);
    const csv = [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "edome-transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // Invite link
  const inviteLink = "https://edome.ch/invite/KARIM2024";
  const handleCopyInvite = () => {
    navigator.clipboard.writeText(inviteLink);
    setInviteCopied(true);
    setTimeout(() => setInviteCopied(false), 2000);
  };

  const today = new Date().toLocaleDateString("fr-CH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // ─── Simplified dashboard for non-remunerable roles ───
  if (!isRemunerable) {
    return (
      <div className="space-y-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">
              Bonjour, {currentUser.firstName}
            </h1>
            <p className="mt-1 text-sm capitalize text-[var(--text-secondary)]">{today}</p>
          </div>
        </motion.div>

        {/* Quick links grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {/* Mes favoris */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              href="/favoris"
              className="group flex flex-col items-center gap-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-8 text-center transition-all hover:border-[#C4956A]/30 hover:bg-[var(--card)]/80"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C4956A]/10 transition-colors group-hover:bg-[#C4956A]/20">
                <Heart className="h-8 w-8 text-[#C4956A]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">Mes favoris</h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">Retrouvez vos biens sauvegardés</p>
              </div>
            </Link>
          </motion.div>

          {/* Mes réservations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/reservations"
              className="group flex flex-col items-center gap-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-8 text-center transition-all hover:border-[#C4956A]/30 hover:bg-[var(--card)]/80"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-400/10 transition-colors group-hover:bg-blue-400/20">
                <CalendarIcon2 className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">Mes réservations</h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">Gérez vos réservations en cours</p>
              </div>
            </Link>
          </motion.div>

          {/* Explorer les biens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/explorer"
              className="group flex flex-col items-center gap-4 rounded-2xl border border-[#C4956A]/20 bg-gradient-to-br from-[#C4956A]/10 to-transparent p-8 text-center transition-all hover:border-[#C4956A]/40 hover:from-[#C4956A]/15"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C4956A]/20 transition-colors group-hover:bg-[#C4956A]/30">
                <SearchIcon className="h-8 w-8 text-[#C4956A]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">Explorer les biens</h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">Découvrez les dernières annonces</p>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Activité récente */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6"
        >
          <h2 className="mb-4 text-lg font-semibold">Activité récente</h2>
          <div className="space-y-4">
            {mockActivity.map((item) => {
              const Icon = activityIcons[item.icon] || Calendar;
              const href = activityLinks[item.icon] || "/dashboard";
              return (
                <Link key={item.id} href={href} className="flex items-start gap-3 rounded-lg p-1 -m-1 transition-colors hover:bg-[var(--card-border)]">
                  <div className="rounded-lg bg-[var(--card-border)] p-2">
                    <Icon className="h-4 w-4 text-[#C4956A]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">{item.text}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{item.time}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Prochains RDV */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6"
        >
          <h2 className="mb-4 text-lg font-semibold">Prochains rendez-vous</h2>
          <div className="space-y-3">
            {mockAppointments.map((apt) => (
              <Link
                key={apt.id}
                href={`/explorer/${apt.id}`}
                className="flex items-center justify-between rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 transition-colors hover:border-[#C4956A]/20 hover:bg-[var(--card-border)]"
              >
                <div>
                  <p className="font-medium">{apt.title}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{apt.client}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#C4956A]">{formatDate(apt.date)}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{apt.time}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ─── Welcome ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">
            Bonjour, {currentUser.firstName}
          </h1>
          <p className="mt-1 text-sm capitalize text-[var(--text-secondary)]">{today}</p>
        </div>

        <div className="flex gap-2">
          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[#C4956A]/30 hover:text-[var(--foreground)]"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exporter CSV</span>
          </button>

          {/* Ajouter un bien */}
          <Link
            href="/publier"
            className="flex items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[#C4956A]/30 hover:text-[var(--foreground)]"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Ajouter un bien</span>
          </Link>

          {/* Nouvelle publication */}
          <Link
            href="/feed"
            className="flex items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[#C4956A]/30 hover:text-[var(--foreground)]"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Nouvelle publication</span>
          </Link>

          {/* Inviter un contact */}
          <button
            onClick={() => setInviteModalOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[#C4956A]/30 hover:text-[var(--foreground)]"
          >
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Inviter</span>
          </button>
        </div>
      </motion.div>

      {/* ─── Invite Modal ────────────────────────────────── */}
      <AnimatePresence>
        {inviteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setInviteModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="mx-4 w-full max-w-md rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">Inviter un contact</h3>
                <button
                  onClick={() => setInviteModalOpen(false)}
                  className="rounded-lg p-1.5 text-[var(--text-secondary)] transition hover:bg-[var(--card-border)] hover:text-[var(--foreground)]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mb-4 text-sm text-[var(--text-secondary)]">
                Partagez ce lien avec vos contacts pour les inviter sur E-Dome.
              </p>
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-3">
                <LinkIcon className="h-4 w-4 flex-shrink-0 text-[#C4956A]" />
                <span className="flex-1 truncate text-sm text-[var(--text-secondary)]">{inviteLink}</span>
              </div>
              <button
                onClick={handleCopyInvite}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all",
                  inviteCopied
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-[#C4956A] text-black hover:bg-[#D4A574]"
                )}
              >
                {inviteCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {inviteCopied ? "Lien copié !" : "Copier le lien"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── KPI Cards with Sparklines ──────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, i) => {
          const data = sparklineData[i];
          const maxVal = Math.max(...data);
          return (
            <motion.div
              key={kpi.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5"
            >
              <div className="flex items-center justify-between">
                <div className={cn("rounded-xl p-2.5", kpi.bg)}>
                  <kpi.icon className={cn("h-5 w-5", kpi.color)} />
                </div>
                <span
                  className={cn(
                    "flex items-center gap-1 text-xs font-semibold",
                    kpi.trend >= 0 ? "text-emerald-400" : "text-red-400"
                  )}
                >
                  {kpi.trend >= 0 ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  )}
                  {Math.abs(kpi.trend)}%
                </span>
              </div>
              <p className="mt-4 text-2xl font-bold">{kpi.value}</p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{kpi.label}</p>
              {/* Period comparison */}
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-xs text-[var(--text-muted)]">vs {kpi.prevValue}</span>
                <span className={cn(
                  "text-xs font-semibold",
                  kpi.trend >= 0 ? "text-emerald-400" : "text-red-400"
                )}>
                  {kpi.trend >= 0 ? "+" : ""}{kpi.trend}%
                </span>
              </div>

              {/* Sparkline chart */}
              <div className="mt-3 flex items-end gap-[3px] h-8">
                {data.map((val, j) => (
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

      {/* ─── Mes objectifs ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-[#C4956A]" />
          <h2 className="text-lg font-semibold">Mes objectifs</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {goals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
            const isEditing = editingGoal === goal.id;
            return (
              <div
                key={goal.id}
                className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-[var(--text-secondary)]">{goal.label}</p>
                  <button
                    onClick={() => {
                      if (isEditing) {
                        saveGoalTarget(goal.id);
                      } else {
                        setEditingGoal(goal.id);
                        setEditValue(goal.target.toString());
                      }
                    }}
                    className="rounded-lg p-1.5 text-[var(--text-muted)] transition hover:bg-[var(--card-border)] hover:text-[#C4956A]"
                  >
                    {isEditing ? <Check className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-xl font-bold text-[var(--foreground)]">
                    {goal.isPrice ? formatPrice(goal.current) : <>{goal.prefix}{goal.current.toLocaleString("fr-CH")}{goal.unit}</>}
                  </span>
                  <span className="text-sm text-[var(--text-muted)]">/</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveGoalTarget(goal.id);
                        if (e.key === "Escape") setEditingGoal(null);
                      }}
                      autoFocus
                      className="w-20 rounded-lg border border-[#C4956A]/40 bg-[var(--background)] px-2 py-1 text-sm text-[#C4956A] outline-none"
                    />
                  ) : (
                    <span className="text-sm text-[var(--text-secondary)]">
                      {goal.isPrice ? formatPrice(goal.target) : <>{goal.prefix}{goal.target.toLocaleString("fr-CH")}{goal.unit}</>}
                    </span>
                  )}
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--card-border)]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-full",
                      pct >= 90
                        ? "bg-emerald-500"
                        : pct >= 60
                          ? "bg-[#C4956A]"
                          : "bg-amber-500"
                    )}
                  />
                </div>
                <p className="mt-2 text-xs text-[var(--text-muted)]">{pct}% atteint</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ─── Revenue Chart ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6"
      >
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Revenus mensuels</h2>
            <p className="text-sm text-[var(--text-secondary)]">Historique des revenus</p>
          </div>

          {/* Period selector pills */}
          <div className="flex items-center gap-1 rounded-xl border border-[var(--card-border)] bg-[var(--background)] p-1">
            {periodOptions.map((opt, i) => (
              <button
                key={opt.label}
                onClick={() => setPeriodIdx(i)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  periodIdx === i
                    ? "bg-[#C4956A]/20 text-[#C4956A]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-secondary)]"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold">{formatPrice(mockDashboardStats.totalRevenue)}</p>
            <p className="text-sm text-emerald-400">+12.5% vs année précédente</p>
          </div>
        </div>

        <div className="flex h-64 items-end gap-2">
          {filteredRevenue.map((m, i) => {
            const pct = maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 0;
            return (
              <div
                key={m.month}
                className="group relative flex flex-1 flex-col items-center"
                onMouseEnter={() => setHoveredBar(i)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Tooltip */}
                {hoveredBar === i && (
                  <div className="absolute -top-14 z-10 whitespace-nowrap rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-xs shadow-xl">
                    <p className="font-semibold text-[var(--foreground)]">{m.month}</p>
                    <p className="text-[#C4956A]">{formatPrice(m.revenue)}</p>
                  </div>
                )}
                {/* Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${pct}%` }}
                  transition={{ delay: 0.4 + i * 0.05, duration: 0.6, ease: "easeOut" }}
                  className={cn(
                    "w-full cursor-pointer rounded-t-md transition-opacity",
                    hoveredBar === null || hoveredBar === i
                      ? "opacity-100"
                      : "opacity-30"
                  )}
                  style={{
                    background:
                      "linear-gradient(to top, #C4956A, #C4956A80)",
                  }}
                />
                {/* Label */}
                <span className="mt-2 text-[11px] text-[var(--text-secondary)]">{m.month}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ─── Two Columns ─────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Dernières transactions</h2>
            <Link href="/dashboard" className="text-xs font-medium text-[#C4956A] transition-colors hover:text-[#D4A574]">
              Voir tout
            </Link>
          </div>

          {/* Filter tabs */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {txFilterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setTxFilter(tab.key)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  txFilter === tab.key
                    ? "bg-[#C4956A]/15 text-[#C4956A]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--card-border)] hover:text-[var(--text-secondary)]"
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    txFilter === tab.key
                      ? "bg-[#C4956A]/20 text-[#C4956A]"
                      : "bg-[var(--card-border)] text-[var(--text-muted)]"
                  )}
                >
                  {txCounts[tab.key]}
                </span>
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--card-border)] text-left text-xs text-[var(--text-secondary)]">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Bien</th>
                  <th className="pb-3 font-medium">Montant</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-[var(--card-border)] transition-colors hover:bg-[var(--card)]"
                  >
                    <td className="py-3 text-[var(--text-secondary)]">{formatDate(tx.date)}</td>
                    <td className="py-3 font-medium">{tx.description}</td>
                    <td
                      className={cn(
                        "py-3 font-semibold",
                        tx.amount >= 0 ? "text-emerald-400" : "text-red-400"
                      )}
                    >
                      {tx.amount >= 0 ? "+" : ""}
                      {formatPrice(tx.amount)}
                    </td>
                    <td className="py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-medium",
                          typeColors[tx.type]
                        )}
                      >
                        {typeLabels[tx.type]}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-medium",
                          statusColors[tx.status]
                        )}
                      >
                        {statusLabels[tx.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Right Column: Activity + Appointments */}
        <div className="space-y-6">
          {/* Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 }}
            className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Activité récente</h2>
              <Link href="/dashboard" className="text-xs font-medium text-[#C4956A] transition-colors hover:text-[#D4A574]">
                Voir tout
              </Link>
            </div>
            <div className="space-y-4">
              {mockActivity.map((item) => {
                const Icon = activityIcons[item.icon] || Calendar;
                const href = activityLinks[item.icon] || "/dashboard";
                return (
                  <Link key={item.id} href={href} className="flex items-start gap-3 rounded-lg p-1 -m-1 transition-colors hover:bg-[var(--card-border)]">
                    <div className="rounded-lg bg-[var(--card-border)] p-2">
                      <Icon className="h-4 w-4 text-[#C4956A]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">{item.text}</p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {item.time}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Appointments */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Prochains RDV</h2>
              <Link href="/dashboard" className="text-xs font-medium text-[#C4956A] transition-colors hover:text-[#D4A574]">
                Voir tout
              </Link>
            </div>
            <div className="space-y-3">
              {mockAppointments.map((apt) => (
                <Link
                  key={apt.id}
                  href={`/explorer/${apt.id}`}
                  className="flex items-center justify-between rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 transition-colors hover:border-[#C4956A]/20 hover:bg-[var(--card-border)]"
                >
                  <div>
                    <p className="font-medium">{apt.title}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{apt.client}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#C4956A]">
                      {formatDate(apt.date)}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">{apt.time}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── Bottom Stats ────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {bottomStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i + 8}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex items-center gap-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5"
          >
            <div className="rounded-xl bg-[var(--card-border)] p-3">
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
            <div>
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-sm text-[var(--text-secondary)]">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── Raccourcis ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-4"
      >
        <h2 className="text-lg font-semibold">Raccourcis</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
          {[
            { label: "Publier un bien", icon: Plus, href: "/publier" },
            { label: "Créer une formation", icon: GraduationCap, href: "/formations/creer" },
            { label: "Créer un événement", icon: CalendarDays, href: "/evenements/creer" },
            { label: "Proposer un service", icon: Briefcase, href: "/services/proposer" },
            { label: "Voir mes statistiques", icon: BarChart3, href: "/statistiques" },
          ].map((shortcut) => (
            <Link
              key={shortcut.href}
              href={shortcut.href}
              className="flex flex-col items-center gap-3 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 text-center transition-all hover:border-[#C4956A]/20 hover:bg-[var(--background)]"
            >
              <div className="rounded-xl bg-[#C4956A]/10 p-3">
                <shortcut.icon className="h-5 w-5 text-[#C4956A]" />
              </div>
              <span className="text-sm font-medium text-[var(--text-secondary)]">{shortcut.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
