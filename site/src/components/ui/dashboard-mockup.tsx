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
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const sidebarIcons = [
  { icon: Home, label: "Accueil", active: false },
  { icon: BarChart3, label: "Stats", active: true },
  { icon: Calendar, label: "Calendrier", active: false },
  { icon: Users, label: "Réseau", active: false },
  { icon: Settings, label: "Réglages", active: false },
];

const statCards = [
  { value: "34", label: "Réservations", color: "from-[#ffe0c2]/20 to-[#ffe0c2]/5" },
  { value: "78%", label: "Conversions", color: "from-[#4ade80]/20 to-[#4ade80]/5" },
  { value: "12", label: "Paiements", color: "from-[#60a5fa]/20 to-[#60a5fa]/5" },
  { value: "8", label: "Options", color: "from-[#c084fc]/20 to-[#c084fc]/5" },
];

const barData = [
  { month: "Oct", height: 35 },
  { month: "Nov", height: 48 },
  { month: "Déc", height: 42 },
  { month: "Jan", height: 55 },
  { month: "Fév", height: 62 },
  { month: "Mar", height: 85 },
];

const bookings = [
  { name: "Chalet Verbier", dates: "12–17 mars", status: "Confirmée", statusColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  { name: "Apt. Lausanne", dates: "20–23 mars", status: "En attente", statusColor: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  { name: "Villa Montreux", dates: "28–31 mars", status: "Confirmée", statusColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
];

export function DashboardMockup() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="w-full max-w-2xl mx-auto rounded-2xl border border-[#201e18] bg-[#0d0d0d] overflow-hidden shadow-2xl"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between px-5 py-3 border-b border-[#201e18]"
      >
        <span className="text-sm font-semibold text-white tracking-tight">
          E-Dome Dashboard
        </span>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ffe0c2] to-[#ffdfb5] flex items-center justify-center text-[#111111] text-xs font-bold">
          MD
        </div>
      </motion.div>

      <div className="flex">
        {/* Sidebar */}
        <motion.div
          variants={itemVariants}
          className="hidden md:flex flex-col items-center gap-1 py-4 px-3 border-r border-[#201e18] bg-[#0a0a0a]"
        >
          {sidebarIcons.map((item) => (
            <div
              key={item.label}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                item.active
                  ? "bg-[#ffe0c2]/10 text-[#ffe0c2]"
                  : "text-white/30 hover:text-white/50"
              }`}
            >
              <item.icon className="w-4 h-4" />
            </div>
          ))}
        </motion.div>

        {/* Main content */}
        <div className="flex-1 p-5 space-y-5">
          {/* Revenue header */}
          <motion.div variants={itemVariants}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-1">
              Revenus ce mois
            </p>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                12&apos;450 CHF
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[11px] font-semibold border border-emerald-500/20">
                <TrendingUp className="w-3 h-3" />
                +18%
              </span>
            </div>
          </motion.div>

          {/* Stat cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {statCards.map((stat) => (
              <div
                key={stat.label}
                className={`rounded-xl bg-gradient-to-b ${stat.color} border border-[#201e18] px-3 py-2.5 text-center`}
              >
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-[10px] text-white/40">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Bar chart */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl bg-[#111111] border border-[#201e18] p-4"
          >
            <div className="flex items-end justify-between gap-2 h-24">
              {barData.map((bar, i) => (
                <div key={bar.month} className="flex flex-col items-center gap-1.5 flex-1">
                  <motion.div
                    className="w-full rounded-t-md bg-gradient-to-t from-[#ffe0c2]/40 to-[#ffdfb5]/20"
                    initial={{ height: 0 }}
                    whileInView={{ height: `${bar.height}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.08, ease: [0.165, 0.84, 0.44, 1] as const }}
                  />
                  <span className="text-[9px] text-white/30">{bar.month}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bookings */}
          <motion.div variants={itemVariants} className="space-y-2">
            {bookings.map((booking) => (
              <div
                key={booking.name}
                className="flex items-center justify-between rounded-xl bg-[#111111] border border-[#201e18] px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-white">{booking.name}</p>
                  <p className="text-[11px] text-white/30">{booking.dates}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${booking.statusColor}`}>
                    {booking.status}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-white/20" />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default DashboardMockup;
