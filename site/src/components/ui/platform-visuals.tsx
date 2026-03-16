"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Heart,
  Search,
  MapPin,
  TrendingUp,
  MessageCircle,
  Share2,
  Play,
  CheckCircle2,
  Circle,
  ChevronRight,
  Filter,
  Star,
  Award,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Shared animation helpers                                          */
/* ------------------------------------------------------------------ */

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

const slideIn = (dir: "left" | "right" | "up" | "down" = "up", delay = 0) => ({
  hidden: {
    opacity: 0,
    x: dir === "left" ? -16 : dir === "right" ? 16 : 0,
    y: dir === "up" ? 12 : dir === "down" ? -12 : 0,
  },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const, delay },
  },
});

/* ------------------------------------------------------------------ */
/*  1. DashboardMockup                                                */
/* ------------------------------------------------------------------ */

export function DashboardMockup() {
  const stats = [
    { label: "Revenue", value: "12,450 CHF", change: "+12%" },
    { label: "Contacts", value: "89", change: "+5" },
    { label: "Leads", value: "23", change: "+8" },
  ];

  const barHeights = [40, 65, 50, 80, 55, 72, 90, 60, 75, 48, 85, 68];

  const activity = [
    { name: "Marc D.", text: "Nouveau contact ajouté", time: "il y a 2 min" },
    { name: "Sophie L.", text: "Visite confirmée", time: "il y a 15 min" },
    { name: "Jean P.", text: "Offre soumise", time: "il y a 1h" },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="w-full rounded-2xl border border-[#8B6F47]/12 bg-[#FAF8F5] shadow-2xl shadow-black/40 overflow-hidden text-[#1A1A1A] text-[11px] select-none"
    >
      {/* Top bar */}
      <motion.div
        variants={item}
        className="flex items-center justify-between px-4 py-2.5 border-b border-[#8B6F47]/12 bg-[#141414]"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#8B6F47] to-[#C4956A] flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-[#111111]" />
          </div>
          <span className="font-semibold text-xs text-[#1A1A1A]/90">
            Tableau de bord
          </span>
        </div>
        <div className="relative">
          <Bell className="w-4 h-4 text-[#888888]" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#8B6F47]" />
        </div>
      </motion.div>

      <div className="p-3 space-y-3">
        {/* Stats row */}
        <motion.div variants={item} className="grid grid-cols-3 gap-2">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-lg bg-white border border-[#8B6F47]/12 p-2"
            >
              <p className="text-[9px] text-[#888888] uppercase tracking-wider">
                {s.label}
              </p>
              <p className="text-sm font-bold text-[#1A1A1A] mt-0.5">{s.value}</p>
              <div className="flex items-center gap-0.5 mt-0.5">
                <TrendingUp className="w-2.5 h-2.5 text-[#8B6F47]" />
                <span className="text-[9px] text-[#8B6F47]">{s.change}</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Mini bar chart */}
        <motion.div
          variants={item}
          className="rounded-lg bg-white border border-[#8B6F47]/12 p-3"
        >
          <p className="text-[9px] text-[#888888] uppercase tracking-wider mb-2">
            Performance mensuelle
          </p>
          <div className="flex items-end gap-[3px] h-16">
            {barHeights.map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  background:
                    i === barHeights.length - 1
                      ? "linear-gradient(to top, #8B6F47, #C4956A)"
                      : "linear-gradient(to top, rgba(255,224,194,0.3), rgba(255,224,194,0.1))",
                }}
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.04 }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1.5 text-[8px] text-[#1A1A1A]/25">
            <span>Jan</span>
            <span>Déc</span>
          </div>
        </motion.div>

        {/* Activity feed */}
        <motion.div variants={item} className="space-y-1.5">
          <p className="text-[9px] text-[#888888] uppercase tracking-wider">
            Activité récente
          </p>
          {activity.map((a, i) => (
            <motion.div
              key={i}
              variants={slideIn("left", i * 0.06)}
              className="flex items-center gap-2 rounded-lg bg-white border border-[#8B6F47]/12 px-2.5 py-2"
            >
              <div className="w-5 h-5 rounded-full bg-[#1a1a1a] border border-[#8B6F47]/12 flex items-center justify-center shrink-0">
                <User className="w-3 h-3 text-[#888888]" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-medium text-[#1A1A1A]/80">{a.name}</span>{" "}
                <span className="text-[#888888]">{a.text}</span>
              </div>
              <span className="text-[8px] text-[#1A1A1A]/25 shrink-0">
                {a.time}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  2. MarketplaceMockup                                              */
/* ------------------------------------------------------------------ */

export function MarketplaceMockup() {
  const listings = [
    {
      price: "CHF 850,000",
      location: "Lausanne, VD",
      type: "Vente",
      kind: "Appartement",
      gradient: "from-amber-900/60 via-orange-800/40 to-yellow-900/30",
      stars: 4,
    },
    {
      price: "CHF 1,200,000",
      location: "Genève, GE",
      type: "Vente",
      kind: "Villa",
      gradient: "from-stone-700/60 via-amber-900/40 to-orange-900/30",
      stars: 5,
    },
    {
      price: "CHF 2,800 /mo",
      location: "Neuchâtel, NE",
      type: "Location",
      kind: "Appartement",
      gradient: "from-orange-900/50 via-red-900/30 to-amber-900/40",
      stars: 3,
    },
    {
      price: "CHF 650,000",
      location: "Bienne, BE",
      type: "Vente",
      kind: "Maison",
      gradient: "from-yellow-900/50 via-amber-800/40 to-stone-800/30",
      stars: 4,
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="w-full rounded-2xl border border-[#8B6F47]/12 bg-[#FAF8F5] shadow-2xl shadow-black/40 overflow-hidden text-[#1A1A1A] text-[11px] select-none"
    >
      {/* Search bar */}
      <motion.div
        variants={item}
        className="flex items-center gap-2 px-3 py-2.5 border-b border-[#8B6F47]/12 bg-[#141414]"
      >
        <div className="flex-1 flex items-center gap-2 rounded-lg bg-white border border-[#8B6F47]/12 px-2.5 py-1.5">
          <Search className="w-3.5 h-3.5 text-[#AAAAAA]" />
          <span className="text-[#AAAAAA] text-[10px]">
            Rechercher un bien...
          </span>
        </div>
        <div className="rounded-lg bg-white border border-[#8B6F47]/12 p-1.5">
          <Filter className="w-3.5 h-3.5 text-[#8B6F47]" />
        </div>
      </motion.div>

      {/* 2x2 grid */}
      <div className="p-3">
        <motion.div variants={item} className="grid grid-cols-2 gap-2">
          {listings.map((l, i) => (
            <motion.div
              key={i}
              variants={slideIn("up", i * 0.06)}
              className="rounded-xl bg-white border border-[#8B6F47]/12 overflow-hidden group"
            >
              {/* Image placeholder */}
              <div
                className={`relative h-20 bg-gradient-to-br ${l.gradient}`}
              >
                {/* Price tag */}
                <div className="absolute bottom-1.5 left-1.5 bg-black/70 backdrop-blur-sm rounded-md px-1.5 py-0.5">
                  <span className="text-[10px] font-bold text-[#8B6F47]">
                    {l.price}
                  </span>
                </div>
                {/* Heart */}
                <button className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                  <Heart className="w-3 h-3 text-[#555555]" />
                </button>
              </div>
              {/* Details */}
              <div className="p-2 space-y-1">
                <div className="flex items-center gap-1 text-[#888888]">
                  <MapPin className="w-2.5 h-2.5" />
                  <span className="text-[9px]">{l.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[8px] bg-[#8B6F47]/10 text-[#8B6F47] rounded px-1 py-[1px]">
                    {l.type}
                  </span>
                  <span className="text-[8px] bg-white/5 text-[#888888] rounded px-1 py-[1px]">
                    {l.kind}
                  </span>
                </div>
                <div className="flex items-center gap-[2px]">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star
                      key={si}
                      className={`w-2.5 h-2.5 ${
                        si < l.stars
                          ? "text-[#C4956A] fill-[#C4956A]"
                          : "text-[#1A1A1A]/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  3. SocialFeedMockup                                               */
/* ------------------------------------------------------------------ */

export function SocialFeedMockup() {
  const posts = [
    {
      name: "Claire Dupont",
      role: "Agent",
      time: "il y a 3h",
      text: "Nouvelle exclusivité à Lausanne ! Magnifique 4.5 pièces avec vue sur le lac...",
      gradient: "from-amber-900/50 via-orange-800/30 to-stone-900/40",
      likes: 24,
      comments: 7,
      shares: 3,
    },
    {
      name: "Thomas Berger",
      role: "Agent",
      time: "il y a 6h",
      text: "Merci à tous pour cette collaboration exceptionnelle sur le projet Morges.",
      gradient: "from-stone-800/50 via-amber-900/30 to-yellow-900/20",
      likes: 41,
      comments: 12,
      shares: 8,
    },
    {
      name: "Lisa Martin",
      role: "Courtier",
      time: "il y a 1j",
      text: "Conseils pour bien préparer son dossier hypothécaire en 2026...",
      gradient: "",
      likes: 58,
      comments: 19,
      shares: 14,
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="w-full rounded-2xl border border-[#8B6F47]/12 bg-[#FAF8F5] shadow-2xl shadow-black/40 overflow-hidden text-[#1A1A1A] text-[11px] select-none"
    >
      {/* Header */}
      <motion.div
        variants={item}
        className="flex items-center justify-between px-4 py-2.5 border-b border-[#8B6F47]/12 bg-[#141414]"
      >
        <span className="font-semibold text-xs text-[#1A1A1A]/90">Fil social</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-[#AAAAAA]" />
      </motion.div>

      <div className="p-3 space-y-2.5">
        {posts.map((p, i) => (
          <motion.div
            key={i}
            variants={slideIn("up", i * 0.08)}
            className="rounded-xl bg-white border border-[#8B6F47]/12 overflow-hidden"
          >
            <div className="p-2.5">
              {/* User row */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#8B6F47]/30 to-[#C4956A]/10 border border-[#8B6F47]/12 flex items-center justify-center">
                  <User className="w-3 h-3 text-[#8B6F47]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-[#1A1A1A]/90 text-[10px]">
                      {p.name}
                    </span>
                    <span className="text-[7px] bg-[#8B6F47]/15 text-[#8B6F47] rounded px-1 py-[1px] font-medium">
                      {p.role}
                    </span>
                  </div>
                  <p className="text-[8px] text-[#1A1A1A]/25">{p.time}</p>
                </div>
              </div>

              {/* Text */}
              <p className="text-[10px] text-[#555555] leading-relaxed mb-2">
                {p.text}
              </p>
            </div>

            {/* Image */}
            {p.gradient && (
              <div className={`h-24 bg-gradient-to-br ${p.gradient}`} />
            )}

            {/* Interaction bar */}
            <div className="flex items-center gap-4 px-3 py-2 border-t border-[#8B6F47]/12">
              <div className="flex items-center gap-1 text-[#888888] hover:text-[#8B6F47] transition-colors">
                <Heart className="w-3 h-3" />
                <span className="text-[9px]">{p.likes}</span>
              </div>
              <div className="flex items-center gap-1 text-[#888888]">
                <MessageCircle className="w-3 h-3" />
                <span className="text-[9px]">{p.comments}</span>
              </div>
              <div className="flex items-center gap-1 text-[#888888]">
                <Share2 className="w-3 h-3" />
                <span className="text-[9px]">{p.shares}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  4. ReferralTrackingMockup                                         */
/* ------------------------------------------------------------------ */

export function ReferralTrackingMockup() {
  const tabs = ["Tous", "En cours", "Terminés"];
  const referrals = [
    {
      status: "green",
      name: "Pierre Morel",
      type: "Bien immobilier",
      commission: "CHF 3,200",
    },
    {
      status: "yellow",
      name: "Anne Favre",
      type: "Client",
      commission: "CHF 2,600",
    },
    {
      status: "gray",
      name: "Lucas Renaud",
      type: "Partenaire",
      commission: "CHF 2,400",
    },
  ];

  const statusColors: Record<string, string> = {
    green: "bg-[#8B6F47]",
    yellow: "bg-amber-400",
    gray: "bg-white/25",
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="w-full rounded-2xl border border-[#8B6F47]/12 bg-[#FAF8F5] shadow-2xl shadow-black/40 overflow-hidden text-[#1A1A1A] text-[11px] select-none"
    >
      {/* Header */}
      <motion.div
        variants={item}
        className="px-4 pt-3 pb-2 border-b border-[#8B6F47]/12 bg-[#141414]"
      >
        <p className="font-semibold text-xs text-[#1A1A1A]/90 mb-2">Mes Apports</p>
        <div className="flex items-center gap-1.5">
          {tabs.map((t, i) => (
            <span
              key={t}
              className={`text-[9px] rounded-md px-2 py-1 transition-colors ${
                i === 0
                  ? "bg-[#8B6F47]/15 text-[#8B6F47] font-medium"
                  : "text-[#1A1A1A]/35 hover:text-[#888888]"
              }`}
            >
              {t}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Referral rows */}
      <div className="p-3 space-y-2">
        {referrals.map((r, i) => (
          <motion.div
            key={i}
            variants={slideIn("right", i * 0.07)}
            className="flex items-center gap-2.5 rounded-xl bg-white border border-[#8B6F47]/12 px-3 py-2.5"
          >
            {/* Status dot */}
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${statusColors[r.status]}`}
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-[#1A1A1A]/85">{r.name}</p>
              <p className="text-[8px] text-[#1A1A1A]/35">{r.type}</p>
            </div>

            {/* Commission */}
            <span className="text-[10px] font-semibold text-[#8B6F47] shrink-0">
              {r.commission}
            </span>

            <ChevronRight className="w-3 h-3 text-[#CCCCCC] shrink-0" />
          </motion.div>
        ))}
      </div>

      {/* Summary bar */}
      <motion.div
        variants={item}
        className="flex items-center justify-between px-4 py-2.5 border-t border-[#8B6F47]/12 bg-[#141414]"
      >
        <span className="text-[9px] text-[#888888]">Total commissions</span>
        <span className="text-xs font-bold text-[#8B6F47]">CHF 8,200</span>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  5. TrainingMockup                                                 */
/* ------------------------------------------------------------------ */

export function TrainingMockup() {
  const chapters = [
    { title: "Introduction au marché suisse", done: true },
    { title: "Évaluation des biens", done: true },
    { title: "Techniques de négociation", done: false },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="w-full rounded-2xl border border-[#8B6F47]/12 bg-[#FAF8F5] shadow-2xl shadow-black/40 overflow-hidden text-[#1A1A1A] text-[11px] select-none"
    >
      {/* Header */}
      <motion.div
        variants={item}
        className="flex items-center justify-between px-4 py-2.5 border-b border-[#8B6F47]/12 bg-[#141414]"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#8B6F47]" />
          <span className="font-semibold text-xs text-[#1A1A1A]/90">Formation</span>
        </div>
        <Award className="w-4 h-4 text-[#C4956A]/40" />
      </motion.div>

      <div className="p-3 space-y-3">
        {/* Video placeholder */}
        <motion.div
          variants={item}
          className="relative h-28 rounded-xl bg-gradient-to-br from-amber-900/40 via-stone-800/40 to-orange-900/20 border border-[#8B6F47]/12 overflow-hidden flex items-center justify-center"
        >
          {/* Play button */}
          <motion.div
            className="w-10 h-10 rounded-full bg-[#8B6F47]/20 backdrop-blur-sm border border-[#8B6F47]/30 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Play className="w-4 h-4 text-[#8B6F47] ml-0.5" />
          </motion.div>
          {/* Duration badge */}
          <span className="absolute bottom-2 right-2 text-[8px] bg-black/60 backdrop-blur-sm rounded px-1.5 py-0.5 text-[#555555]">
            12:34
          </span>
        </motion.div>

        {/* Course card */}
        <motion.div
          variants={item}
          className="rounded-xl bg-white border border-[#8B6F47]/12 p-3 space-y-2.5"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold text-[#1A1A1A]/90">
                Formation: Expertise Immobilière
              </p>
              <p className="text-[8px] text-[#1A1A1A]/35 mt-0.5">
                Module 3 sur 5
              </p>
            </div>
            <div className="flex items-center gap-1 bg-[#8B6F47]/10 rounded-md px-1.5 py-0.5">
              <Award className="w-3 h-3 text-[#8B6F47]" />
              <span className="text-[8px] text-[#8B6F47] font-medium">
                Certificat
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[8px] text-[#1A1A1A]/35">Progression</span>
              <span className="text-[9px] font-semibold text-[#8B6F47]">
                65%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-[#222] overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#8B6F47] to-[#C4956A]"
                initial={{ width: 0 }}
                whileInView={{ width: "65%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" as const }}
              />
            </div>
          </div>
        </motion.div>

        {/* Chapter list */}
        <motion.div variants={item} className="space-y-1.5">
          <p className="text-[9px] text-[#888888] uppercase tracking-wider">
            Chapitres
          </p>
          {chapters.map((c, i) => (
            <motion.div
              key={i}
              variants={slideIn("left", i * 0.06)}
              className="flex items-center gap-2 rounded-lg bg-white border border-[#8B6F47]/12 px-2.5 py-2"
            >
              {c.done ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8B6F47] shrink-0" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-[#CCCCCC] shrink-0" />
              )}
              <span
                className={`flex-1 text-[10px] ${
                  c.done ? "text-[#888888] line-through" : "text-[#1A1A1A]/80"
                }`}
              >
                {c.title}
              </span>
              <ChevronRight className="w-3 h-3 text-[#1A1A1A]/15 shrink-0" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  6. PhoneMockup                                                    */
/* ------------------------------------------------------------------ */

interface PhoneMockupProps {
  children: React.ReactNode;
  className?: string;
}

export function PhoneMockup({ children, className = "" }: PhoneMockupProps) {
  return (
    <div
      className={`relative mx-auto ${className}`}
      style={{ aspectRatio: "9/18", maxWidth: 320 }}
    >
      {/* Outer bezel */}
      <div className="absolute inset-0 rounded-[2.5rem] bg-[#0a0a0a] border-2 border-[#8B6F47]/12 shadow-2xl shadow-black/60" />

      {/* Screen area */}
      <div className="absolute inset-[6px] rounded-[2.2rem] bg-[#FAF8F5] overflow-hidden flex flex-col">
        {/* Notch */}
        <div className="relative flex justify-center pt-2 pb-1 z-10">
          <div className="w-20 h-[18px] bg-[#0a0a0a] rounded-b-2xl flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1a1a1a] border border-[#8B6F47]/12" />
            <span className="w-[6px] h-[6px] rounded-full bg-[#1a1a1a] border border-[#8B6F47]/12" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">{children}</div>

        {/* Home bar */}
        <div className="flex justify-center py-2">
          <div className="w-24 h-1 rounded-full bg-white/15" />
        </div>
      </div>
    </div>
  );
}
