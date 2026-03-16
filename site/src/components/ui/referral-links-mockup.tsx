"use client";

import { motion } from "framer-motion";
import {
  Link,
  Copy,
  Share2,
  MousePointerClick,
  TrendingUp,
  Wallet,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const referralLinks = [
  {
    label: "Amener un hôte",
    link: "e-dome.ch/ref/jm-host-2024",
    badge: "100 CHF/hôte",
  },
  {
    label: "Amener un client",
    link: "e-dome.ch/ref/jm-client-2024",
    badge: "5% résa",
  },
  {
    label: "Amener un bien",
    link: "e-dome.ch/ref/jm-listing-2024",
    badge: "2% vente",
  },
];

const stats = [
  { icon: MousePointerClick, value: "23", label: "clics" },
  { icon: TrendingUp, value: "8", label: "conversions" },
  { icon: Wallet, value: "2'400 CHF", label: "gagnés" },
];

export function ReferralLinksMockup() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="w-full max-w-md mx-auto rounded-2xl border border-[#8B6F47]/12 bg-[#FAF8F5] overflow-hidden shadow-2xl"
    >
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-3 px-6 pt-6 pb-4"
      >
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#8B6F47]/10">
          <Link className="w-[18px] h-[18px] text-[#8B6F47]" />
        </div>
        <h3 className="text-lg font-semibold text-[#1A1A1A] tracking-tight">
          Tes Liens de Parrainage
        </h3>
      </motion.div>

      <div className="flex flex-col gap-3 px-6 pb-5">
        {referralLinks.map((item) => (
          <motion.div
            key={item.link}
            variants={itemVariants}
            className="rounded-xl bg-white border border-[#8B6F47]/12 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-[#1A1A1A]/90">
                {item.label}
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#C4956A]/15 text-[#C4956A] border border-[#C4956A]/20">
                {item.badge}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-[#EDE5DB] border border-[#8B6F47]/12">
                <span className="text-xs font-mono text-[#888888] truncate block">
                  {item.link}
                </span>
              </div>

              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#C4956A]/30 bg-transparent text-[#C4956A] text-xs font-medium hover:bg-[#C4956A]/5 transition-colors shrink-0">
                <Copy className="w-3.5 h-3.5" />
                Copier
              </button>

              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#C4956A] text-[#111111] text-xs font-semibold hover:bg-[#8B6F47] transition-colors shrink-0">
                <Share2 className="w-3.5 h-3.5" />
                Partager
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mx-6 h-px bg-gradient-to-r from-transparent via-[#201e18] to-transparent" />

      <motion.div variants={itemVariants} className="px-6 pt-4 pb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#888888] mb-3">
          Statistiques
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-white border border-[#8B6F47]/12"
            >
              <stat.icon className="w-4 h-4 text-[#8B6F47]/60" />
              <span className="text-sm font-bold text-[#1A1A1A]">
                {stat.value}
              </span>
              <span className="text-[11px] text-[#888888]">{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ReferralLinksMockup;
