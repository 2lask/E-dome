"use client";

import { motion } from "framer-motion";
import {
  Home,
  BarChart3,
  Users,
  Settings,
  Bell,
  Search,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Copy,
  ChevronRight,
  Star,
  Camera,
  MapPin,
  Calendar,
  CreditCard,
  TrendingUp,
  Link2,
  CheckCircle2,
  Clock,
  CircleDot,
  Compass,
  PlusCircle,
  User,
  Grid3X3,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Shared                                                             */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const BLUE = "#8B6F47";
const VIOLET = "#C4956A";
const TEAL = "#C4956A";
const GREEN = "#8B6F47";
const AMBER = "#C4956A";
const DARK = "#111111";
const DARK_CARD = "#191919";
const DARK_BORDER = "#201e18";

/* ------------------------------------------------------------------ */
/*  1. RevenueDashboardMockup                                          */
/* ------------------------------------------------------------------ */

export function RevenueDashboardMockup() {
  const kpis = [
    { label: "Réservations", value: "34", color: BLUE },
    { label: "Conversions", value: "78%", color: GREEN },
    { label: "Paiements", value: "12", color: VIOLET },
    { label: "Options", value: "8", color: TEAL },
  ];

  const bars = [38, 56, 44, 62, 50, 78];

  const reservations = [
    {
      name: "Chalet Verbier",
      dates: "12–17 mars",
      status: "Confirmée",
      color: GREEN,
    },
    {
      name: "Apt. Lausanne",
      dates: "20–23 mars",
      status: "En attente",
      color: AMBER,
    },
    {
      name: "Villa Montreux",
      dates: "28–31 mars",
      status: "Confirmée",
      color: GREEN,
    },
  ];

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="w-full max-w-[500px] mx-auto select-none"
    >
      <div
        className="rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: DARK, color: "#fff", fontSize: 12 }}
      >
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{ borderBottom: `1px solid ${DARK_BORDER}` }}
        >
          <span className="font-semibold text-sm tracking-wide">
            E-Dome Dashboard
          </span>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{ background: `linear-gradient(135deg,${BLUE},${VIOLET})` }}
          >
            MD
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div
            className="flex flex-col items-center gap-4 py-4 px-2.5"
            style={{ borderRight: `1px solid ${DARK_BORDER}` }}
          >
            {[Home, BarChart3, Calendar, Users, Settings].map((Icon, i) => (
              <Icon
                key={i}
                size={16}
                style={{ color: i === 1 ? BLUE : "#5e544a" }}
              />
            ))}
          </div>

          {/* Main */}
          <div className="flex-1 p-4 space-y-4 min-w-0">
            {/* Revenue header */}
            <div>
              <p className="text-[10px] uppercase tracking-widest" style={{ color: "#8a7e72" }}>
                Revenus ce mois
              </p>
              <div className="flex items-end gap-2 mt-1">
                <span className="text-2xl font-bold tracking-tight">
                  12&apos;450 CHF
                </span>
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full mb-1"
                  style={{ background: `${GREEN}22`, color: GREEN }}
                >
                  +18%
                </span>
              </div>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-4 gap-2">
              {kpis.map((k) => (
                <div
                  key={k.label}
                  className="rounded-lg p-2 text-center"
                  style={{ background: DARK_CARD, border: `1px solid ${DARK_BORDER}` }}
                >
                  <p className="text-base font-bold" style={{ color: k.color }}>
                    {k.value}
                  </p>
                  <p className="text-[9px] mt-0.5" style={{ color: "#8a7e72" }}>
                    {k.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Bar chart */}
            <div
              className="rounded-lg p-3"
              style={{ background: DARK_CARD, border: `1px solid ${DARK_BORDER}` }}
            >
              <div className="flex items-end gap-[6px] h-16">
                {bars.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${h}%`,
                      background:
                        i === bars.length - 1 ? BLUE : `${BLUE}30`,
                      transition: "height .3s",
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1.5 text-[9px]" style={{ color: "#5e544a" }}>
                {["Oct", "Nov", "Déc", "Jan", "Fév", "Mar"].map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>

            {/* Reservations */}
            <div className="space-y-1.5">
              {reservations.map((r) => (
                <div
                  key={r.name}
                  className="flex items-center justify-between rounded-lg px-3 py-2"
                  style={{ background: DARK_CARD, border: `1px solid ${DARK_BORDER}` }}
                >
                  <div>
                    <p className="text-[11px] font-medium">{r.name}</p>
                    <p className="text-[9px]" style={{ color: "#8a7e72" }}>
                      {r.dates}
                    </p>
                  </div>
                  <span
                    className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: `${r.color}20`, color: r.color }}
                  >
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  2. SocialFeedMockup                                                */
/* ------------------------------------------------------------------ */

export function SocialFeedMockup() {
  const stories = [
    { initials: "SL", from: BLUE, to: VIOLET },
    { initials: "AK", from: TEAL, to: GREEN },
    { initials: "JR", from: AMBER, to: "#8B6F47" },
    { initials: "CM", from: VIOLET, to: "#C4956A" },
  ];

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="w-full max-w-[280px] mx-auto select-none"
    >
      {/* Phone frame */}
      <div
        className="rounded-[32px] p-[6px] shadow-2xl"
        style={{ background: "#0d0d0d" }}
      >
        <div
          className="rounded-[28px] overflow-hidden relative"
          style={{ background: DARK, color: "#fff", fontSize: 11 }}
        >
          {/* Notch */}
          <div className="flex justify-center pt-2 pb-1">
            <div
              className="w-24 h-5 rounded-full"
              style={{ background: "#0d0d0d" }}
            />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2">
            <span className="font-bold text-sm tracking-wider">E-DOME</span>
            <div className="flex gap-3">
              <Search size={15} style={{ color: "#8a7e72" }} />
              <Bell size={15} style={{ color: "#8a7e72" }} />
            </div>
          </div>

          {/* Stories */}
          <div className="flex gap-3 px-4 py-2">
            {stories.map((s) => (
              <div key={s.initials} className="flex flex-col items-center gap-1">
                <div
                  className="w-11 h-11 rounded-full p-[2px]"
                  style={{
                    background: `linear-gradient(135deg,${s.from},${s.to})`,
                  }}
                >
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ background: DARK }}
                  >
                    {s.initials}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px mx-4" style={{ background: DARK_BORDER }} />

          {/* Post */}
          <div className="px-4 py-3 space-y-2.5">
            {/* Post header */}
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{ background: `linear-gradient(135deg,${BLUE},${VIOLET})` }}
              >
                IL
              </div>
              <div>
                <p className="text-[11px] font-semibold">ImmoLux Genève</p>
                <p className="text-[9px]" style={{ color: "#8a7e72" }}>
                  <MapPin size={8} className="inline mr-0.5" style={{ verticalAlign: "-1px" }} />
                  Genève, Suisse
                </p>
              </div>
            </div>

            {/* Property illustration */}
            <div
              className="rounded-xl overflow-hidden relative"
              style={{ background: "#191919" }}
            >
              <svg
                viewBox="0 0 260 140"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full"
              >
                {/* Ground */}
                <line x1="20" y1="110" x2="240" y2="110" stroke="#8B6F47" strokeWidth="0.8" />
                {/* Main body */}
                <rect x="50" y="55" width="100" height="55" fill="#191919" stroke="#8B6F47" strokeWidth="1" />
                {/* Roof */}
                <polygon points="40,55 100,20 160,55" fill="#191919" stroke="#8B6F47" strokeWidth="1" />
                {/* Windows */}
                <rect x="65" y="68" width="18" height="14" rx="1" fill="#8B6F47" fillOpacity="0.15" stroke="#8B6F47" strokeWidth="0.7" />
                <rect x="95" y="68" width="18" height="14" rx="1" fill="#8B6F47" fillOpacity="0.15" stroke="#8B6F47" strokeWidth="0.7" />
                <rect x="125" y="68" width="18" height="14" rx="1" fill="#8B6F47" fillOpacity="0.15" stroke="#8B6F47" strokeWidth="0.7" />
                {/* Door */}
                <rect x="90" y="90" width="20" height="20" rx="1" fill="#8B6F47" fillOpacity="0.1" stroke="#8B6F47" strokeWidth="0.7" />
                {/* Extension */}
                <rect x="150" y="70" width="60" height="40" fill="#191919" stroke="#8B6F47" strokeWidth="1" />
                <line x1="150" y1="70" x2="180" y2="50" stroke="#8B6F47" strokeWidth="1" />
                <line x1="180" y1="50" x2="210" y2="70" stroke="#8B6F47" strokeWidth="1" />
                <rect x="165" y="80" width="16" height="12" rx="1" fill="#8B6F47" fillOpacity="0.15" stroke="#8B6F47" strokeWidth="0.7" />
                <rect x="190" y="80" width="12" height="12" rx="1" fill="#8B6F47" fillOpacity="0.15" stroke="#8B6F47" strokeWidth="0.7" />
                {/* Pool hint */}
                <rect x="170" y="114" width="50" height="10" rx="3" fill="#8B6F47" fillOpacity="0.08" stroke="#8B6F47" strokeWidth="0.5" />
                {/* Trees (thin lines) */}
                <line x1="30" y1="110" x2="30" y2="85" stroke="#8B6F47" strokeWidth="0.6" />
                <circle cx="30" cy="82" r="7" fill="#8B6F47" fillOpacity="0.08" stroke="#8B6F47" strokeWidth="0.5" />
                <line x1="230" y1="110" x2="230" y2="90" stroke="#8B6F47" strokeWidth="0.6" />
                <circle cx="230" cy="87" r="6" fill="#8B6F47" fillOpacity="0.08" stroke="#8B6F47" strokeWidth="0.5" />
              </svg>
              {/* Price badge */}
              <div className="absolute bottom-2 left-2">
                <span
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: BLUE, color: "#fff" }}
                >
                  CHF 1&apos;250&apos;000
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <Heart size={16} style={{ color: "#8B6F47" }} fill="#8B6F47" />
                <MessageCircle size={16} style={{ color: "#8a7e72" }} />
                <Share2 size={16} style={{ color: "#8a7e72" }} />
              </div>
              <Bookmark size={16} style={{ color: "#8a7e72" }} />
            </div>

            <div>
              <p className="text-[11px] font-semibold">128 j&apos;aime</p>
              <p className="text-[10px] mt-0.5" style={{ color: "#b4a99e" }}>
                <span className="font-semibold text-[#1A1A1A]">ImmoLux</span>{" "}
                Villa contemporaine avec vue lac, piscine et finitions haut de gamme.
              </p>
            </div>
          </div>

          {/* Bottom nav */}
          <div
            className="flex items-center justify-around py-3 mt-1"
            style={{ borderTop: `1px solid ${DARK_BORDER}` }}
          >
            {[Home, Search, PlusCircle, Heart, User].map((Icon, i) => (
              <Icon
                key={i}
                size={18}
                style={{ color: i === 0 ? BLUE : "#5e544a" }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  3. ApporteurDashboardMockup                                        */
/* ------------------------------------------------------------------ */

export function ApporteurDashboardMockup() {
  const stats = [
    { label: "Commissions", value: "3'200 CHF", color: GREEN },
    { label: "Apports", value: "7 apports", color: BLUE },
    { label: "Versements", value: "4 versements", color: VIOLET },
  ];

  const weekBars = [
    { day: "Lun", h: 30 },
    { day: "Mar", h: 55 },
    { day: "Mer", h: 42 },
    { day: "Jeu", h: 68 },
    { day: "Ven", h: 80 },
    { day: "Sam", h: 45 },
    { day: "Dim", h: 20 },
  ];

  const links = [
    { url: "edome.ch/r/a7x2k", label: "Villa Montreux", color: GREEN },
    { url: "edome.ch/r/b3m9p", label: "Apt. Lausanne", color: BLUE },
    { url: "edome.ch/r/c1n4q", label: "Chalet Verbier", color: AMBER },
  ];

  const timeline = [
    { step: "Lien partagé", status: "Complété", color: GREEN, icon: CheckCircle2 },
    { step: "Réservation confirmée", status: "En cours", color: AMBER, icon: Clock },
    { step: "Commission versée", status: "À venir", color: "#5e544a", icon: CircleDot },
  ];

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="w-full max-w-[480px] mx-auto select-none"
    >
      <div
        className="rounded-2xl overflow-hidden shadow-2xl p-5 space-y-4"
        style={{
          background: `linear-gradient(145deg,${DARK},${DARK_CARD})`,
          color: "#fff",
          fontSize: 11,
          border: `1px solid ${DARK_BORDER}`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm">Dashboard Apporteur</span>
          <span
            className="text-[10px] px-2.5 py-1 rounded-full font-medium"
            style={{ background: `${BLUE}20`, color: BLUE }}
          >
            Mars 2026
          </span>
        </div>

        {/* Stat pills */}
        <div className="grid grid-cols-3 gap-2">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-3 text-center"
              style={{ background: `${s.color}10`, border: `1px solid ${s.color}30` }}
            >
              <p className="font-bold text-sm" style={{ color: s.color }}>
                {s.value}
              </p>
              <p className="text-[9px] mt-0.5" style={{ color: "#8a7e72" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Weekly bar chart */}
        <div
          className="rounded-xl p-3"
          style={{ background: DARK_CARD, border: `1px solid ${DARK_BORDER}` }}
        >
          <p className="text-[10px] font-medium mb-2" style={{ color: "#8a7e72" }}>
            Activité de la semaine
          </p>
          <div className="flex items-end gap-2 h-14">
            {weekBars.map((b, i) => (
              <div key={b.day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-sm"
                  style={{
                    height: `${b.h}%`,
                    background:
                      i === 4
                        ? `linear-gradient(180deg,${BLUE},${VIOLET})`
                        : `${BLUE}30`,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1.5">
            {weekBars.map((b) => (
              <span key={b.day} className="flex-1 text-center text-[8px]" style={{ color: "#5e544a" }}>
                {b.day}
              </span>
            ))}
          </div>
        </div>

        {/* Active links */}
        <div
          className="rounded-xl p-3 space-y-2"
          style={{ background: DARK_CARD, border: `1px solid ${DARK_BORDER}` }}
        >
          <p className="text-[10px] font-semibold flex items-center gap-1.5">
            <Link2 size={12} style={{ color: BLUE }} />
            Liens d&apos;apport actifs
          </p>
          {links.map((l) => (
            <div
              key={l.url}
              className="flex items-center justify-between rounded-lg px-2.5 py-2"
              style={{ background: `${DARK}80`, border: `1px solid ${DARK_BORDER}` }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: l.color }}
                />
                <div className="min-w-0">
                  <p className="text-[10px] font-medium truncate">{l.label}</p>
                  <p className="text-[9px] truncate" style={{ color: "#5e544a" }}>
                    {l.url}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span
                  className="text-[8px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{ background: `${l.color}20`, color: l.color }}
                >
                  Actif
                </span>
                <Copy size={11} style={{ color: "#5e544a" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Commission timeline */}
        <div
          className="rounded-xl p-3"
          style={{ background: DARK_CARD, border: `1px solid ${DARK_BORDER}` }}
        >
          <p className="text-[10px] font-semibold mb-2.5">Suivi commission #127</p>
          <div className="space-y-3 relative">
            {/* Vertical line */}
            <div
              className="absolute left-[5px] top-1 bottom-1 w-px"
              style={{ background: DARK_BORDER }}
            />
            {timeline.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.step} className="flex items-center gap-3 relative">
                  <Icon
                    size={11}
                    className="flex-shrink-0 relative z-10"
                    style={{ color: t.color }}
                  />
                  <span className="text-[10px] flex-1">{t.step}</span>
                  <span
                    className="text-[8px] px-1.5 py-0.5 rounded-full font-medium"
                    style={{ background: `${t.color}20`, color: t.color }}
                  >
                    {t.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  4. PropertyListingMockup                                           */
/* ------------------------------------------------------------------ */

export function PropertyListingMockup() {
  const features = ["5 pièces", "Piscine", "Vue lac"];

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="w-full max-w-[320px] mx-auto select-none"
    >
      <div
        className="rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "#111111", color: "#ffffff", fontSize: 12 }}
      >
        {/* Property SVG illustration */}
        <div
          className="relative"
          style={{ background: "linear-gradient(180deg,#191919,#111111)" }}
        >
          <svg
            viewBox="0 0 320 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            {/* Sky gradient hint */}
            <rect width="320" height="180" fill="url(#skyGrad)" />
            <defs>
              <linearGradient id="skyGrad" x1="160" y1="0" x2="160" y2="180" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#191919" />
                <stop offset="100%" stopColor="#111111" />
              </linearGradient>
            </defs>
            {/* Mountains */}
            <polygon points="0,140 60,80 120,140" fill="#8B6F47" fillOpacity="0.4" />
            <polygon points="80,140 160,70 240,140" fill="#C4956A" fillOpacity="0.3" />
            <polygon points="200,140 280,90 320,140" fill="#8B6F47" fillOpacity="0.3" />
            {/* Ground */}
            <rect x="0" y="140" width="320" height="40" fill="#111111" />
            {/* Villa main */}
            <rect x="70" y="85" width="120" height="55" fill="#191919" stroke="#644a40" strokeWidth="1.2" />
            {/* Villa roof */}
            <polygon points="60,85 130,45 200,85" fill="#191919" stroke="#644a40" strokeWidth="1.2" />
            {/* Windows */}
            <rect x="85" y="98" width="22" height="16" rx="2" fill="#644a40" fillOpacity="0.08" stroke="#644a40" strokeWidth="0.8" />
            <rect x="120" y="98" width="22" height="16" rx="2" fill="#644a40" fillOpacity="0.08" stroke="#644a40" strokeWidth="0.8" />
            <rect x="155" y="98" width="22" height="16" rx="2" fill="#644a40" fillOpacity="0.08" stroke="#644a40" strokeWidth="0.8" />
            {/* Door */}
            <rect x="118" y="120" width="24" height="20" rx="2" fill="#644a40" fillOpacity="0.06" stroke="#644a40" strokeWidth="0.8" />
            {/* Extension right */}
            <rect x="190" y="100" width="60" height="40" fill="#191919" stroke="#644a40" strokeWidth="1.2" />
            <line x1="190" y1="100" x2="220" y2="80" stroke="#644a40" strokeWidth="1.2" />
            <line x1="220" y1="80" x2="250" y2="100" stroke="#644a40" strokeWidth="1.2" />
            <rect x="202" y="110" width="16" height="12" rx="1" fill="#644a40" fillOpacity="0.08" stroke="#644a40" strokeWidth="0.7" />
            <rect x="226" y="110" width="16" height="12" rx="1" fill="#644a40" fillOpacity="0.08" stroke="#644a40" strokeWidth="0.7" />
            {/* Pool */}
            <rect x="80" y="148" width="70" height="16" rx="6" fill="#644a40" fillOpacity="0.06" stroke="#644a40" strokeWidth="0.7" />
            {/* Tree */}
            <line x1="40" y1="140" x2="40" y2="108" stroke="#644a40" strokeWidth="0.8" />
            <circle cx="40" cy="104" r="10" fill="#644a40" fillOpacity="0.06" stroke="#644a40" strokeWidth="0.6" />
            <line x1="270" y1="140" x2="270" y2="115" stroke="#644a40" strokeWidth="0.8" />
            <circle cx="270" cy="111" r="8" fill="#644a40" fillOpacity="0.06" stroke="#644a40" strokeWidth="0.6" />
          </svg>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${TEAL}18`, color: TEAL }}
          >
            Location courte durée
          </span>

          <div>
            <h3 className="text-lg font-bold mt-2">Villa Montreux</h3>
            <p className="text-[11px] flex items-center gap-1 mt-0.5" style={{ color: "#6B7280" }}>
              <MapPin size={11} />
              Montreux, Suisse
            </p>
          </div>

          <p className="text-lg font-bold" style={{ color: BLUE }}>
            CHF 480{" "}
            <span className="text-xs font-normal" style={{ color: "#9CA3AF" }}>
              / nuit
            </span>
          </p>

          <div className="flex items-center gap-2 text-[11px]" style={{ color: "#6B7280" }}>
            <span className="flex items-center gap-0.5">
              <Star size={12} fill={AMBER} style={{ color: AMBER }} /> 4.9
            </span>
            <span>·</span>
            <span>24 avis</span>
            <span>·</span>
            <span className="flex items-center gap-0.5">
              <Camera size={11} /> 6 photos
            </span>
          </div>

          <div className="flex gap-2">
            {features.map((f) => (
              <span
                key={f}
                className="text-[10px] px-2.5 py-1 rounded-full font-medium"
                style={{ background: "#191919", color: "#8B6F47" }}
              >
                {f}
              </span>
            ))}
          </div>

          <button
            className="w-full py-2.5 rounded-xl text-[12px] font-semibold text-[#1A1A1A] mt-1"
            style={{ background: BLUE }}
          >
            Voir le bien
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  5. MultiRoleProfileMockup                                          */
/* ------------------------------------------------------------------ */

export function MultiRoleProfileMockup() {
  const roles = [
    { label: "Hôte", color: BLUE },
    { label: "Apporteur", color: VIOLET },
    { label: "Photographe", color: TEAL },
  ];

  const activities = [
    { text: "A publié Villa Montreux", time: "2h", icon: Home },
    { text: "Commission reçue +480 CHF", time: "1j", icon: TrendingUp },
    { text: "Nouveau rôle: Photographe", time: "3j", icon: Camera },
  ];

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="w-full max-w-[300px] mx-auto select-none"
    >
      <div
        className="rounded-2xl overflow-hidden shadow-2xl p-6 text-center space-y-4"
        style={{
          background: `linear-gradient(145deg,${DARK},${DARK_CARD})`,
          color: "#fff",
          fontSize: 11,
          border: `1px solid ${DARK_BORDER}`,
        }}
      >
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="relative">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold"
              style={{
                background: `linear-gradient(135deg,${BLUE},${VIOLET})`,
              }}
            >
              MD
            </div>
            {/* Verified badge */}
            <div
              className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: BLUE, border: `2px solid ${DARK}` }}
            >
              <CheckCircle2 size={12} color="#fff" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold">Marc Dubois</h3>
          <p className="text-[10px] mt-0.5" style={{ color: "#8a7e72" }}>
            Membre depuis 2024
          </p>
        </div>

        {/* Role pills */}
        <div className="flex justify-center gap-2 flex-wrap">
          {roles.map((r) => (
            <span
              key={r.label}
              className="text-[10px] font-semibold px-3 py-1 rounded-full"
              style={{ background: `${r.color}20`, color: r.color, border: `1px solid ${r.color}40` }}
            >
              {r.label}
            </span>
          ))}
        </div>

        {/* Stats */}
        <p className="text-[11px]" style={{ color: "#b4a99e" }}>
          12 biens{" "}
          <span style={{ color: "#5e544a" }}>·</span> 847 abonnés{" "}
          <span style={{ color: "#5e544a" }}>·</span>{" "}
          <Star size={10} fill={AMBER} style={{ color: AMBER, display: "inline", verticalAlign: "-1px" }} />{" "}
          4.8
        </p>

        {/* Recent activity */}
        <div className="space-y-2 text-left">
          <p className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: "#5e544a" }}>
            Activité récente
          </p>
          {activities.map((a) => {
            const Icon = a.icon;
            return (
              <div
                key={a.text}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2"
                style={{ background: `${DARK}80`, border: `1px solid ${DARK_BORDER}` }}
              >
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `${BLUE}15` }}
                >
                  <Icon size={12} style={{ color: BLUE }} />
                </div>
                <span className="text-[10px] flex-1">{a.text}</span>
                <span className="text-[9px] flex-shrink-0" style={{ color: "#5e544a" }}>
                  {a.time}
                </span>
              </div>
            );
          })}
        </div>

        <button
          className="w-full py-2.5 rounded-xl text-[11px] font-semibold text-[#1A1A1A]"
          style={{
            background: `linear-gradient(135deg,${BLUE},${VIOLET})`,
          }}
        >
          Activer un rôle
        </button>
      </div>
    </motion.div>
  );
}
