"use client";

import { motion } from "framer-motion";
import {
  Home,
  BarChart3,
  Calendar,
  Users,
  Settings,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BookOpen,
  Target,
  Zap,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

/* ───────────────────────── animations ───────────────────────── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const cardPopVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ───────────────────────── data ───────────────────────── */

const sidebarIcons = [
  { icon: Home, label: "Accueil", active: false },
  { icon: BarChart3, label: "Statistiques", active: true },
  { icon: Calendar, label: "Calendrier", active: false },
  { icon: Users, label: "Réseau", active: false },
  { icon: Settings, label: "Réglages", active: false },
];

const kpiCards = [
  {
    label: "Revenus",
    value: "12'450",
    unit: "CHF",
    change: "+18%",
    positive: true,
    icon: DollarSign,
    gradient: "from-[#8B6F47]/20 to-[#8B6F47]/5",
    iconBg: "bg-[#8B6F47]/10",
    iconColor: "text-[#8B6F47]",
  },
  {
    label: "Réservations",
    value: "34",
    unit: "",
    change: "+12%",
    positive: true,
    icon: BookOpen,
    gradient: "from-[#60a5fa]/20 to-[#60a5fa]/5",
    iconBg: "bg-[#60a5fa]/10",
    iconColor: "text-[#60a5fa]",
  },
  {
    label: "Conversions",
    value: "78",
    unit: "%",
    change: "+4.2%",
    positive: true,
    icon: Target,
    gradient: "from-[#4ade80]/20 to-[#4ade80]/5",
    iconBg: "bg-[#4ade80]/10",
    iconColor: "text-[#4ade80]",
  },
  {
    label: "Apports",
    value: "8'200",
    unit: "CHF",
    change: "-3%",
    positive: false,
    icon: Zap,
    gradient: "from-[#c084fc]/20 to-[#c084fc]/5",
    iconBg: "bg-[#c084fc]/10",
    iconColor: "text-[#c084fc]",
  },
];

const barData = [
  { month: "Jan", height: 32 },
  { month: "Fév", height: 45 },
  { month: "Mar", height: 58 },
  { month: "Avr", height: 42 },
  { month: "Mai", height: 67 },
  { month: "Juin", height: 75 },
  { month: "Juil", height: 88 },
  { month: "Aoû", height: 72 },
  { month: "Sep", height: 65 },
  { month: "Oct", height: 80 },
  { month: "Nov", height: 92 },
  { month: "Déc", height: 100 },
];

const progressMetrics = [
  { label: "Taux d'occupation", value: 87, color: "bg-[#8B6F47]" },
  { label: "Satisfaction clients", value: 94, color: "bg-[#4ade80]" },
  { label: "Objectif mensuel", value: 72, color: "bg-[#60a5fa]" },
  { label: "Croissance réseau", value: 61, color: "bg-[#c084fc]" },
];

const sparklinePoints = [
  { x: 0, y: 60 },
  { x: 1, y: 52 },
  { x: 2, y: 58 },
  { x: 3, y: 45 },
  { x: 4, y: 50 },
  { x: 5, y: 38 },
  { x: 6, y: 42 },
  { x: 7, y: 30 },
  { x: 8, y: 35 },
  { x: 9, y: 22 },
  { x: 10, y: 28 },
  { x: 11, y: 15 },
];

const bookings = [
  {
    name: "Chalet Verbier",
    dates: "12–17 mars 2026",
    amount: "3'850 CHF",
    status: "Confirmée",
    statusIcon: CheckCircle2,
    statusColor:
      "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  },
  {
    name: "Appartement Lausanne",
    dates: "20–23 mars 2026",
    amount: "1'240 CHF",
    status: "En attente",
    statusIcon: Clock,
    statusColor:
      "bg-amber-500/15 text-amber-400 border-amber-500/25",
  },
  {
    name: "Villa Montreux",
    dates: "28–31 mars 2026",
    amount: "4'600 CHF",
    status: "Confirmée",
    statusIcon: CheckCircle2,
    statusColor:
      "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  },
  {
    name: "Studio Neuchâtel",
    dates: "2–5 avril 2026",
    amount: "780 CHF",
    status: "Annulée",
    statusIcon: XCircle,
    statusColor:
      "bg-red-500/15 text-red-400 border-red-500/25",
  },
];

/* ───────────────────── sparkline SVG path ───────────────────── */

function buildSparklinePath(
  points: { x: number; y: number }[],
  width: number,
  height: number,
): string {
  const maxY = Math.max(...points.map((p) => p.y));
  const stepX = width / (points.length - 1);
  return points
    .map((p, i) => {
      const px = i * stepX;
      const py = height - (p.y / maxY) * (height - 4);
      return `${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`;
    })
    .join(" ");
}

/* ═══════════════════════════ COMPONENT ═══════════════════════════ */

export function DashboardMockup() {
  const sparkPath = buildSparklinePath(sparklinePoints, 200, 60);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="w-full max-w-5xl mx-auto rounded-2xl border border-[#8B6F47]/12 bg-[#EDE5DB] overflow-hidden shadow-2xl"
    >
      {/* ──── Header ──── */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between px-6 py-3.5 border-b border-[#8B6F47]/12"
      >
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#8B6F47]/80" />
          <span className="text-sm font-semibold text-[#1A1A1A] tracking-tight">
            E-Dome Analytics
          </span>
          <span className="hidden sm:inline text-[10px] text-[#1A1A1A]/25 font-medium ml-1">
            / Vue d&apos;ensemble
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-[10px] text-[#AAAAAA]">
            Dernière mise à jour : il y a 2 min
          </span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B6F47] to-[#C4956A] flex items-center justify-center text-[#111111] text-xs font-bold">
            MD
          </div>
        </div>
      </motion.div>

      <div className="flex">
        {/* ──── Sidebar ──── */}
        <motion.div
          variants={itemVariants}
          className="hidden md:flex flex-col items-center gap-1.5 py-5 px-3 border-r border-[#8B6F47]/12 bg-[#0a0a0a]"
        >
          {sidebarIcons.map((item) => (
            <div
              key={item.label}
              title={item.label}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                item.active
                  ? "bg-[#8B6F47]/10 text-[#8B6F47]"
                  : "text-[#1A1A1A]/25 hover:text-[#888888]"
              }`}
            >
              <item.icon className="w-4 h-4" />
            </div>
          ))}
        </motion.div>

        {/* ──── Main content ──── */}
        <div className="flex-1 p-4 sm:p-6 space-y-5 min-w-0">
          {/* ── TOP ROW: KPI cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {kpiCards.map((kpi, idx) => (
              <motion.div
                key={kpi.label}
                variants={cardPopVariants}
                custom={idx}
                className={`rounded-xl bg-gradient-to-b ${kpi.gradient} border border-[#8B6F47]/12 p-4 flex flex-col gap-3`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-8 h-8 rounded-lg ${kpi.iconBg} flex items-center justify-center`}
                  >
                    <kpi.icon className={`w-4 h-4 ${kpi.iconColor}`} />
                  </div>
                  <span
                    className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${
                      kpi.positive
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                        : "bg-red-500/15 text-red-400 border-red-500/20"
                    }`}
                  >
                    {kpi.positive ? (
                      <TrendingUp className="w-2.5 h-2.5" />
                    ) : (
                      <TrendingDown className="w-2.5 h-2.5" />
                    )}
                    {kpi.change}
                  </span>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight leading-none">
                    {kpi.value}
                    {kpi.unit && (
                      <span className="text-xs font-medium text-[#888888] ml-1">
                        {kpi.unit}
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] font-medium text-[#1A1A1A]/35 mt-1 uppercase tracking-wider">
                    {kpi.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── CHART ROW ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
            {/* Left: Bar chart (spans 3 cols) */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-3 rounded-xl bg-[#FAF8F5] border border-[#8B6F47]/12 p-4 sm:p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold text-[#1A1A1A]/80">
                    Revenus mensuels
                  </p>
                  <p className="text-[10px] text-[#AAAAAA] mt-0.5">
                    Janvier – Décembre 2025
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] text-[#8B6F47]/70 font-medium bg-[#8B6F47]/5 border border-[#8B6F47]/10 rounded-full px-2 py-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  +24% annuel
                </span>
              </div>
              <div className="flex items-end justify-between gap-1 sm:gap-1.5 h-32 sm:h-40">
                {barData.map((bar, i) => (
                  <div
                    key={bar.month}
                    className="flex flex-col items-center gap-1.5 flex-1 min-w-0"
                  >
                    <motion.div
                      className="w-full rounded-t-md bg-gradient-to-t from-[#8B6F47]/50 to-[#C4956A]/15 hover:from-[#8B6F47]/70 hover:to-[#C4956A]/30 transition-colors cursor-default"
                      initial={{ height: 0 }}
                      whileInView={{ height: `${bar.height}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.7,
                        delay: 0.25 + i * 0.05,
                        ease: [0.165, 0.84, 0.44, 1] as const,
                      }}
                    />
                    <span className="text-[8px] sm:text-[9px] text-[#AAAAAA] truncate">
                      {bar.month}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Progress + sparkline (spans 2 cols) */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 rounded-xl bg-[#FAF8F5] border border-[#8B6F47]/12 p-4 sm:p-5 flex flex-col justify-between gap-4"
            >
              <div>
                <p className="text-xs font-semibold text-[#1A1A1A]/80">
                  Indicateurs clés
                </p>
                <p className="text-[10px] text-[#AAAAAA] mt-0.5">
                  Performance en temps réel
                </p>
              </div>

              {/* Progress bars */}
              <div className="space-y-3">
                {progressMetrics.map((m, idx) => (
                  <div key={m.label} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#888888]">
                        {m.label}
                      </span>
                      <span className="text-[10px] font-semibold text-[#1A1A1A]/70">
                        {m.value}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white">
                      <motion.div
                        className={`h-full rounded-full ${m.color}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${m.value}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.8,
                          delay: 0.4 + idx * 0.1,
                          ease: [0.22, 1, 0.36, 1] as const,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Mini sparkline */}
              <div className="rounded-lg bg-white border border-[#8B6F47]/12 p-3">
                <p className="text-[9px] text-[#AAAAAA] mb-2">
                  Tendance des coûts
                </p>
                <svg
                  viewBox="0 0 200 60"
                  className="w-full h-auto"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="sparkGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#4ade80" stopOpacity="0.3" />
                      <stop
                        offset="100%"
                        stopColor="#4ade80"
                        stopOpacity="0.02"
                      />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d={sparkPath}
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.2,
                      delay: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94] as const,
                    }}
                  />
                  <path
                    d={`${sparkPath} L200,60 L0,60 Z`}
                    fill="url(#sparkGrad)"
                    opacity="0.5"
                  />
                </svg>
              </div>
            </motion.div>
          </div>

          {/* ── BOTTOM ROW: Recent bookings ── */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-[#1A1A1A]/80">
                Réservations récentes
              </p>
              <span className="text-[10px] text-[#8B6F47]/50 cursor-default hover:text-[#8B6F47]/80 transition-colors">
                Voir tout
              </span>
            </div>
            <div className="rounded-xl bg-[#FAF8F5] border border-[#8B6F47]/12 overflow-hidden divide-y divide-[#201e18]/60">
              {bookings.map((booking, idx) => (
                <motion.div
                  key={booking.name}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.35,
                    delay: 0.5 + idx * 0.07,
                    ease: [0.25, 0.46, 0.45, 0.94] as const,
                  }}
                  className="flex items-center justify-between px-4 py-3 hover:bg-white/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="hidden sm:flex w-8 h-8 rounded-lg bg-white border border-[#8B6F47]/12 items-center justify-center flex-shrink-0">
                      <Calendar className="w-3.5 h-3.5 text-[#1A1A1A]/25" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#1A1A1A] truncate">
                        {booking.name}
                      </p>
                      <p className="text-[10px] text-[#AAAAAA]">
                        {booking.dates}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="hidden sm:inline text-xs font-semibold text-[#555555]">
                      {booking.amount}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${booking.statusColor}`}
                    >
                      <booking.statusIcon className="w-2.5 h-2.5" />
                      {booking.status}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#1A1A1A]/15" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default DashboardMockup;
