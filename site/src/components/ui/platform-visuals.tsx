"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  User, Bell, Heart, Search, MapPin, TrendingUp, MessageCircle, Share2, Play,
  CheckCircle2, ChevronRight, Filter, Star, Award, BookOpen, ArrowUpRight,
  Clock, Lock, BarChart3, Users, FileText, ChevronDown, Pause, Maximize2, SkipForward,
} from "lucide-react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } } };
const slideIn = (dir: "left" | "right" | "up" = "up", delay = 0) => ({
  hidden: { opacity: 0, x: dir === "left" ? -16 : dir === "right" ? 16 : 0, y: dir === "up" ? 12 : 0 },
  show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.4, ease: "easeOut" as const, delay } },
});

export function ReferralTrackingMockup() {
  const tabs = ["Tous", "En cours", "Termin\u00e9s"];
  const referrals = [
    { status: "completed", initials: "PM", color: "#8B6F47", name: "Pierre Morel", type: "Bien immobilier", commission: "CHF 3,200" },
    { status: "pending", initials: "AF", color: "#C4956A", name: "Anne Favre", type: "Client acheteur", commission: "CHF 2,600" },
    { status: "completed", initials: "LR", color: "#8B6F47", name: "Lucas Renaud", type: "Partenaire courtier", commission: "CHF 2,400" },
    { status: "pending", initials: "SB", color: "#C4956A", name: "Sophie Blanc", type: "Bien commercial", commission: "CHF 4,100" },
    { status: "completed", initials: "JD", color: "#8B6F47", name: "Jean Dumont", type: "Client vendeur", commission: "CHF 1,800" },
  ];
  const sc: Record<string, { label: string; bg: string; text: string }> = {
    completed: { label: "Termin\u00e9", bg: "bg-[#8B6F47]/10", text: "text-[#8B6F47]" },
    pending: { label: "En cours", bg: "bg-[#C4956A]/10", text: "text-[#C4956A]" },
  };
  return (
    <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="w-full rounded-2xl border border-[#8B6F47]/12 bg-[#FAF8F5] shadow-lg overflow-hidden text-[#1A1A1A] text-[11px] select-none">
      <motion.div variants={item} className="px-4 pt-3 pb-2.5 border-b border-[#8B6F47]/12 bg-white">
        <div className="flex items-center gap-2 mb-2.5"><div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#8B6F47] to-[#C4956A] flex items-center justify-center shadow-sm"><Users className="w-3.5 h-3.5 text-white" /></div><div><p className="font-semibold text-xs text-[#1A1A1A]">Mes Apports</p></div></div>
        <div className="flex items-center gap-1">{tabs.map((t, i) => (<span key={t} className={`text-[9px] rounded-full px-2.5 py-1 cursor-pointer ${i === 0 ? "bg-[#8B6F47] text-white font-medium" : "text-[#888888]"}`}>{t}</span>))}</div>
      </motion.div>
      <div className="p-3 space-y-2">
        {referrals.map((r, i) => (
          <motion.div key={i} variants={slideIn("right", i * 0.05)} className="flex items-center gap-2.5 rounded-xl bg-white border border-[#8B6F47]/12 px-3 py-2.5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-white" style={{ background: `linear-gradient(135deg, ${r.color}, ${r.color}cc)` }}>{r.initials}</div>
            <div className="flex-1 min-w-0"><div className="flex items-center gap-1.5"><p className="text-[10px] font-semibold text-[#1A1A1A]">{r.name}</p><span className={`text-[7px] ${sc[r.status].bg} ${sc[r.status].text} rounded-full px-1.5 py-[1px]`}>{sc[r.status].label}</span></div><p className="text-[8px] text-[#888888]">{r.type}</p></div>
            <span className="text-[11px] font-bold text-[#8B6F47]">{r.commission}</span>
            <ChevronRight className="w-3 h-3 text-[#CCCCCC] shrink-0" />
          </motion.div>
        ))}
      </div>
      <motion.div variants={item} className="border-t border-[#8B6F47]/12 bg-white px-4 py-2.5">
        <div className="flex items-center justify-between mb-1"><span className="text-[8px] text-[#888888]">Total commissions</span><span className="text-sm font-bold text-[#8B6F47]">CHF 14,100</span></div>
        <div className="h-1.5 rounded-full bg-[#F3EDE7] overflow-hidden"><motion.div className="h-full rounded-full bg-gradient-to-r from-[#8B6F47] to-[#C4956A]" initial={{ width: 0 }} whileInView={{ width: "70%" }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" as const }} /></div>
      </motion.div>
    </motion.div>
  );
}

export function MarketplaceMockup() {
  const listings = [
    { price: "CHF 850,000", location: "Lausanne, VD", type: "Vente", kind: "Appartement", gradient: "from-[#C4956A]/40 via-[#8B6F47]/25 to-[#F3EDE7]", stars: 4 },
    { price: "CHF 1,200,000", location: "Gen\u00e8ve, GE", type: "Vente", kind: "Villa", gradient: "from-[#8B6F47]/35 via-[#C4956A]/20 to-[#FAF8F5]", stars: 5 },
    { price: "CHF 2,800 /mo", location: "Neuch\u00e2tel, NE", type: "Location", kind: "Appartement", gradient: "from-[#C4956A]/30 via-[#F3EDE7] to-[#FAF8F5]", stars: 3 },
    { price: "CHF 650,000", location: "Bienne, BE", type: "Vente", kind: "Maison", gradient: "from-[#8B6F47]/30 via-[#C4956A]/15 to-[#F3EDE7]", stars: 4 },
  ];
  return (
    <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="w-full rounded-2xl border border-[#8B6F47]/12 bg-[#FAF8F5] shadow-lg overflow-hidden text-[#1A1A1A] text-[11px] select-none">
      <motion.div variants={item} className="flex items-center gap-2 px-3 py-2.5 border-b border-[#8B6F47]/12 bg-white">
        <div className="flex-1 flex items-center gap-2 rounded-lg bg-[#FAF8F5] border border-[#8B6F47]/12 px-2.5 py-1.5"><Search className="w-3.5 h-3.5 text-[#888888]" /><span className="text-[#888888] text-[10px]">Rechercher un bien...</span></div>
      </motion.div>
      <div className="p-3"><motion.div variants={item} className="grid grid-cols-2 gap-2">
        {listings.map((l, i) => (
          <motion.div key={i} variants={slideIn("up", i * 0.06)} className="rounded-xl bg-white border border-[#8B6F47]/12 overflow-hidden shadow-sm">
            <div className={`relative h-20 bg-gradient-to-br ${l.gradient}`}><div className="absolute bottom-1.5 left-1.5 bg-white/90 rounded-md px-1.5 py-0.5 shadow-sm"><span className="text-[10px] font-bold text-[#8B6F47]">{l.price}</span></div></div>
            <div className="p-2 space-y-1"><div className="flex items-center gap-1 text-[#555555]"><MapPin className="w-2.5 h-2.5" /><span className="text-[9px]">{l.location}</span></div><div className="flex items-center gap-[2px]">{Array.from({ length: 5 }).map((_, si) => (<Star key={si} className={`w-2.5 h-2.5 ${si < l.stars ? "text-[#C4956A] fill-[#C4956A]" : "text-[#1A1A1A]/30"}`} />))}</div></div>
          </motion.div>
        ))}
      </motion.div></div>
    </motion.div>
  );
}

export function TrainingMockup() {
  const chapters = [
    { title: "Introduction au march\u00e9 suisse", done: true, duration: "8:42" },
    { title: "\u00c9valuation des biens", done: true, duration: "14:18" },
    { title: "Techniques de n\u00e9gociation", done: true, duration: "11:05" },
    { title: "Droit immobilier suisse", done: false, active: true, duration: "16:30" },
    { title: "Marketing et promotion", done: false, duration: "12:55" },
    { title: "Certification finale", done: false, locked: true, duration: "20:00" },
  ];
  return (
    <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="w-full rounded-2xl border border-[#8B6F47]/12 bg-[#FAF8F5] shadow-lg overflow-hidden text-[#1A1A1A] text-[11px] select-none">
      <motion.div variants={item} className="flex items-center justify-between px-4 py-2.5 border-b border-[#8B6F47]/12 bg-white">
        <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#8B6F47] to-[#C4956A] flex items-center justify-center shadow-sm"><BookOpen className="w-3.5 h-3.5 text-white" /></div><span className="font-semibold text-xs text-[#1A1A1A]">Formation E-Dome</span></div>
        <div className="flex items-center gap-1 bg-[#8B6F47]/10 rounded-full px-2 py-1"><Award className="w-3 h-3 text-[#8B6F47]" /><span className="text-[8px] text-[#8B6F47] font-medium">Certificat</span></div>
      </motion.div>
      <div className="p-3 space-y-3">
        <motion.div variants={item} className="relative rounded-xl overflow-hidden border border-[#8B6F47]/12 shadow-sm">
          <div className="h-28 bg-gradient-to-br from-[#1A1A1A] via-[#2a2520] to-[#1A1A1A] flex items-center justify-center relative">
            <div className="absolute top-3 left-3"><p className="text-[9px] text-white/40">Module 4 / 6</p><p className="text-[11px] text-white/80 font-semibold mt-0.5">Droit immobilier suisse</p></div>
            <motion.div className="w-10 h-10 rounded-full bg-[#8B6F47] flex items-center justify-center shadow-lg cursor-pointer" whileHover={{ scale: 1.1 }} transition={{ type: "spring" as const, stiffness: 300 }}><Play className="w-4 h-4 text-white ml-0.5" fill="white" /></motion.div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 pt-4 pb-1.5"><div className="h-1 rounded-full bg-white/20 mb-1.5 overflow-hidden"><div className="h-full w-[35%] rounded-full bg-[#8B6F47]" /></div><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Pause className="w-2.5 h-2.5 text-white/70" /><span className="text-[7px] text-white/50">5:47 / 16:30</span></div><Maximize2 className="w-2.5 h-2.5 text-white/50" /></div></div>
          </div>
        </motion.div>
        <motion.div variants={item} className="rounded-xl bg-white border border-[#8B6F47]/12 p-2.5 shadow-sm">
          <div className="flex items-center justify-between mb-1.5"><span className="text-[9px] font-medium text-[#555555]">Progression</span><span className="text-[12px] font-bold text-[#8B6F47]">65%</span></div>
          <div className="h-1.5 rounded-full bg-[#F3EDE7] overflow-hidden"><motion.div className="h-full rounded-full bg-gradient-to-r from-[#8B6F47] to-[#C4956A]" initial={{ width: 0 }} whileInView={{ width: "65%" }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" as const }} /></div>
        </motion.div>
        <motion.div variants={item} className="space-y-1.5">
          <p className="text-[9px] text-[#888888] uppercase tracking-wider font-medium">Chapitres</p>
          {chapters.map((c, i) => (
            <motion.div key={i} variants={slideIn("left", i * 0.05)} className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 ${c.active ? "bg-[#8B6F47]/5 border-[#8B6F47]/20 shadow-sm" : (c as any).locked ? "bg-[#FAF8F5] border-[#8B6F47]/8 opacity-60" : "bg-white border-[#8B6F47]/12"}`}>
              {c.done ? <div className="w-5 h-5 rounded-full bg-[#8B6F47] flex items-center justify-center shrink-0"><CheckCircle2 className="w-3.5 h-3.5 text-white" /></div>
               : c.active ? <div className="w-5 h-5 rounded-full bg-[#8B6F47]/15 border-2 border-[#8B6F47] flex items-center justify-center shrink-0"><Play className="w-2.5 h-2.5 text-[#8B6F47] ml-[1px]" /></div>
               : (c as any).locked ? <div className="w-5 h-5 rounded-full bg-[#F3EDE7] flex items-center justify-center shrink-0"><Lock className="w-2.5 h-2.5 text-[#888888]" /></div>
               : <div className="w-5 h-5 rounded-full border-2 border-[#CCCCCC] shrink-0" />}
              <span className={`flex-1 text-[10px] ${c.done ? "text-[#888888] line-through" : c.active ? "text-[#1A1A1A] font-semibold" : "text-[#1A1A1A]"}`}>{c.title}</span>
              <div className="flex items-center gap-1 shrink-0"><Clock className="w-2.5 h-2.5 text-[#888888]" /><span className="text-[8px] text-[#888888]">{c.duration}</span></div>
              <ChevronRight className="w-3 h-3 text-[#CCCCCC] shrink-0" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

export function SocialFeedMockup() {
  const posts = [
    { name: "Claire Dupont", role: "Agent", time: "3h", text: "Nouvelle exclusivit\u00e9 \u00e0 Lausanne ! 4.5 pi\u00e8ces vue lac...", gradient: "from-[#C4956A]/30 via-[#8B6F47]/15 to-[#F3EDE7]", likes: 24, comments: 7 },
    { name: "Thomas Berger", role: "Agent", time: "6h", text: "Collaboration exceptionnelle sur le projet Morges.", gradient: "from-[#8B6F47]/25 via-[#C4956A]/15 to-[#FAF8F5]", likes: 41, comments: 12 },
  ];
  return (
    <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="w-full rounded-2xl border border-[#8B6F47]/12 bg-[#FAF8F5] shadow-lg overflow-hidden text-[#1A1A1A] text-[11px] select-none">
      <motion.div variants={item} className="flex items-center justify-between px-4 py-2.5 border-b border-[#8B6F47]/12 bg-white"><span className="font-semibold text-xs text-[#1A1A1A]">Fil social</span><ArrowUpRight className="w-3.5 h-3.5 text-[#888888]" /></motion.div>
      <div className="p-3 space-y-2.5">
        {posts.map((p, i) => (
          <motion.div key={i} variants={slideIn("up", i * 0.08)} className="rounded-xl bg-white border border-[#8B6F47]/12 overflow-hidden shadow-sm">
            <div className="p-2.5"><div className="flex items-center gap-2 mb-2"><div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#8B6F47]/30 to-[#C4956A]/10 border border-[#8B6F47]/12 flex items-center justify-center"><User className="w-3 h-3 text-[#8B6F47]" /></div><div><div className="flex items-center gap-1.5"><span className="font-medium text-[10px]">{p.name}</span><span className="text-[7px] bg-[#8B6F47]/15 text-[#8B6F47] rounded px-1 py-[1px]">{p.role}</span></div><p className="text-[8px] text-[#888888]">{p.time}</p></div></div><p className="text-[10px] text-[#555555] leading-relaxed">{p.text}</p></div>
            <div className={`h-20 bg-gradient-to-br ${p.gradient}`} />
            <div className="flex items-center gap-4 px-3 py-2 border-t border-[#8B6F47]/8"><div className="flex items-center gap-1 text-[#888888]"><Heart className="w-3 h-3" /><span className="text-[9px]">{p.likes}</span></div><div className="flex items-center gap-1 text-[#888888]"><MessageCircle className="w-3 h-3" /><span className="text-[9px]">{p.comments}</span></div></div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export function PhoneMockup({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative mx-auto ${className}`} style={{ aspectRatio: "9/18", maxWidth: 320 }}>
      <div className="absolute inset-0 rounded-[2.5rem] bg-[#1A1A1A] border-2 border-[#8B6F47]/12 shadow-2xl" />
      <div className="absolute inset-[6px] rounded-[2.2rem] bg-[#FAF8F5] overflow-hidden flex flex-col">
        <div className="relative flex justify-center pt-2 pb-1 z-10"><div className="w-20 h-[18px] bg-[#1A1A1A] rounded-b-2xl" /></div>
        <div className="flex-1 overflow-hidden">{children}</div>
        <div className="flex justify-center py-2"><div className="w-24 h-1 rounded-full bg-[#1A1A1A]/15" /></div>
      </div>
    </div>
  );
}
