"use client";

import { motion } from "framer-motion";
import { Home, Heart, Search, Bell, User, MapPin, Star, Play, CheckCircle2, TrendingUp, ArrowUpRight, Calendar, ChevronRight, Clock, Share2, MessageCircle, BarChart3, Link2, Copy } from "lucide-react";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;
const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 12 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay, ease: EASE } });

/* ------------------------------------------------------------------ */
/*  Phone Frame wrapper                                                */
/* ------------------------------------------------------------------ */
function Phone({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative mx-auto ${className}`} style={{ width: 280, height: 560 }}>
      <div className="absolute inset-0 rounded-[2.5rem] bg-[#1a1a1a] shadow-2xl shadow-black/60 border border-white/[0.08]" />
      <div className="absolute inset-[5px] rounded-[2.2rem] bg-[#0e0e0e] overflow-hidden flex flex-col">
        <div className="flex justify-center pt-2.5 pb-1"><div className="w-24 h-[22px] bg-black rounded-b-2xl" /></div>
        <div className="flex-1 overflow-hidden bg-[#0a0a0a]">{children}</div>
        <div className="flex justify-center py-2"><div className="w-28 h-1 rounded-full bg-white/10" /></div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  1. Marketplace App Mockup                                          */
/* ------------------------------------------------------------------ */
export function MarketplacePhoneMockup() {
  const listings = [
    { name: "Villa Méditerranée", loc: "Marrakech", price: "245 CHF/nuit", stars: 4.8, gradient: "from-[#C4956A]/40 to-[#8B6F47]/20" },
    { name: "Chalet Alpin", loc: "Verbier", price: "380 CHF/nuit", stars: 4.9, gradient: "from-[#8B6F47]/30 to-[#C4956A]/10" },
    { name: "Loft Urbain", loc: "Genève", price: "185 CHF/nuit", stars: 4.6, gradient: "from-[#C4956A]/25 to-[#D4A574]/15" },
  ];

  return (
    <motion.div {...fadeUp(0.2)}>
      <Phone>
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 py-2 text-[9px] text-white/40">
          <span>9:41</span>
          <div className="flex gap-1"><div className="w-3 h-1.5 rounded-sm bg-white/30" /><div className="w-3 h-1.5 rounded-sm bg-white/20" /></div>
        </div>
        {/* Header */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div><p className="text-[11px] text-white/40">Bienvenue</p><p className="text-[14px] font-bold text-white">Découvrir</p></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C4956A] to-[#8B6F47] flex items-center justify-center"><User className="w-4 h-4 text-white" /></div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/[0.06] border border-white/[0.06] px-3 py-2">
            <Search className="w-3.5 h-3.5 text-white/30" />
            <span className="text-[10px] text-white/30">Rechercher un bien...</span>
          </div>
        </div>
        {/* Listings */}
        <div className="px-4 space-y-2.5 pb-4">
          {listings.map((l, i) => (
            <motion.div key={l.name} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1, ease: EASE }}
              className="rounded-xl bg-white/[0.04] border border-white/[0.06] overflow-hidden">
              <div className={`h-16 bg-gradient-to-br ${l.gradient} relative`}>
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"><Heart className="w-3 h-3 text-white/60" /></div>
                <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm rounded-md px-2 py-0.5"><span className="text-[9px] font-bold text-[#C4956A]">{l.price}</span></div>
              </div>
              <div className="p-2.5">
                <p className="text-[11px] font-semibold text-white">{l.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5 text-white/30" /><span className="text-[9px] text-white/40">{l.loc}</span></div>
                  <div className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 text-[#C4956A] fill-[#C4956A]" /><span className="text-[9px] text-white/50">{l.stars}</span></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Bottom nav */}
        <div className="mt-auto border-t border-white/[0.06] flex justify-around py-2.5 px-4">
          {[Home, Search, Heart, User].map((Icon, i) => (
            <div key={i} className={`flex flex-col items-center gap-0.5 ${i === 0 ? "text-[#C4956A]" : "text-white/30"}`}>
              <Icon className="w-4 h-4" /><span className="text-[7px]">{["Accueil", "Chercher", "Favoris", "Profil"][i]}</span>
            </div>
          ))}
        </div>
      </Phone>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  2. Social Feed Mockup                                              */
/* ------------------------------------------------------------------ */
export function SocialFeedPhoneMockup() {
  return (
    <motion.div {...fadeUp(0.3)}>
      <Phone>
        <div className="flex items-center justify-between px-5 py-2 text-[9px] text-white/40"><span>9:41</span></div>
        <div className="px-4 pb-2 flex items-center justify-between">
          <p className="text-[14px] font-bold text-white">Fil social</p>
          <Bell className="w-4 h-4 text-white/40" />
        </div>
        {/* Stories */}
        <div className="flex gap-3 px-4 py-2 overflow-hidden">
          {["Vous", "Claire", "Marc", "Sophie", "Jean"].map((n, i) => (
            <div key={n} className="flex flex-col items-center gap-1 shrink-0">
              <div className={`w-10 h-10 rounded-full ${i === 0 ? "border-2 border-dashed border-white/20" : "border-2 border-[#C4956A]"} flex items-center justify-center`}>
                {i === 0 ? <span className="text-white/30 text-lg">+</span> : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C4956A]/30 to-[#8B6F47]/10 flex items-center justify-center"><span className="text-[8px] font-bold text-[#C4956A]">{n[0]}</span></div>}
              </div>
              <span className="text-[8px] text-white/40">{n}</span>
            </div>
          ))}
        </div>
        {/* Posts */}
        <div className="px-4 space-y-3 py-2">
          {[
            { name: "Claire Dupont", role: "Agent", text: "Nouvelle exclusivité à Lausanne ! Vue lac imprenable.", gradient: "from-[#C4956A]/30 to-[#8B6F47]/15", likes: 24 },
            { name: "Marc Berger", role: "Hôte", text: "Mon chalet Verbier affiche complet pour mars !", gradient: "from-[#8B6F47]/25 to-[#C4956A]/10", likes: 41 },
          ].map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.15, ease: EASE }}
              className="rounded-xl bg-white/[0.04] border border-white/[0.06] overflow-hidden">
              <div className="p-2.5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#C4956A]/30 to-[#8B6F47]/10 flex items-center justify-center"><span className="text-[8px] font-bold text-[#C4956A]">{p.name[0]}</span></div>
                  <div><div className="flex items-center gap-1"><span className="text-[10px] font-semibold text-white">{p.name}</span><span className="text-[7px] bg-[#C4956A]/15 text-[#C4956A] rounded px-1 py-[1px]">{p.role}</span></div></div>
                </div>
                <p className="text-[9px] text-white/50 leading-relaxed">{p.text}</p>
              </div>
              <div className={`h-20 bg-gradient-to-br ${p.gradient}`} />
              <div className="flex items-center gap-4 px-3 py-2 border-t border-white/[0.04]">
                <div className="flex items-center gap-1 text-white/30"><Heart className="w-3 h-3" /><span className="text-[8px]">{p.likes}</span></div>
                <div className="flex items-center gap-1 text-white/30"><MessageCircle className="w-3 h-3" /><span className="text-[8px]">7</span></div>
                <div className="flex items-center gap-1 text-white/30"><Share2 className="w-3 h-3" /></div>
              </div>
            </motion.div>
          ))}
        </div>
      </Phone>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  3. Dashboard Revenue Mockup (large, not in phone)                  */
/* ------------------------------------------------------------------ */
export function DashboardMockup() {
  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
  const bars = [25, 40, 35, 55, 48, 62, 70, 58, 75, 65, 85, 92];
  const bookings = [
    { name: "Chalet Verbier", dates: "12–17 mars", amount: "CHF 1,900", status: "Confirmée", color: "text-emerald-400 bg-emerald-400/10" },
    { name: "Apt. Lausanne", dates: "20–23 mars", amount: "CHF 740", status: "En attente", color: "text-amber-400 bg-amber-400/10" },
    { name: "Villa Montreux", dates: "28–31 mars", amount: "CHF 1,200", status: "Confirmée", color: "text-emerald-400 bg-emerald-400/10" },
    { name: "Studio Genève", dates: "2–5 avril", amount: "CHF 520", status: "En attente", color: "text-amber-400 bg-amber-400/10" },
  ];

  return (
    <motion.div {...fadeUp(0.2)} className="w-full rounded-2xl border border-white/[0.06] bg-[#0a0a0a] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C4956A] to-[#8B6F47] flex items-center justify-center"><BarChart3 className="w-4 h-4 text-white" /></div>
          <div><p className="text-sm font-semibold text-white">E-Dome Dashboard</p><p className="text-[10px] text-white/30">Mars 2026</p></div>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C4956A] to-[#8B6F47] flex items-center justify-center text-[10px] font-bold text-white">MD</div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Revenus", value: "12'450 CHF", change: "+18%", up: true },
            { label: "Réservations", value: "34", change: "+12", up: true },
            { label: "Conversions", value: "78%", change: "+4.2%", up: true },
            { label: "Commissions", value: "8'200 CHF", change: "+23%", up: true },
          ].map((k, i) => (
            <motion.div key={k.label} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.08, ease: EASE }}
              className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
              <p className="text-[10px] text-white/30 uppercase tracking-wider">{k.label}</p>
              <p className="text-xl font-bold text-white mt-1">{k.value}</p>
              <div className="flex items-center gap-1 mt-1"><TrendingUp className="w-3 h-3 text-[#C4956A]" /><span className="text-[10px] text-[#C4956A]">{k.change}</span></div>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-white/40 uppercase tracking-wider">Revenus mensuels</p>
            <span className="text-[10px] text-[#C4956A] bg-[#C4956A]/10 rounded-full px-2 py-0.5">+47% YoY</span>
          </div>
          <div className="flex items-end gap-[4px] h-32">
            {bars.map((h, i) => (
              <motion.div key={i} className="flex-1 rounded-t-sm" style={{ background: i === bars.length - 1 ? "linear-gradient(to top, #C4956A, #D4A574)" : "linear-gradient(to top, rgba(196,149,106,0.2), rgba(196,149,106,0.05))" }}
                initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 + i * 0.04, ease: EASE }} />
            ))}
          </div>
          <div className="flex justify-between mt-2">{months.map((m) => <span key={m} className="text-[7px] text-white/20 flex-1 text-center">{m}</span>)}</div>
        </div>

        {/* Bookings */}
        <div className="space-y-2">
          <p className="text-xs text-white/40 uppercase tracking-wider">Réservations récentes</p>
          {bookings.map((b, i) => (
            <motion.div key={b.name} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.08, ease: EASE }}
              className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-white/20" />
                <div><p className="text-sm font-medium text-white">{b.name}</p><p className="text-[10px] text-white/30">{b.dates}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-[#C4956A]">{b.amount}</span>
                <span className={`text-[9px] rounded-full px-2 py-0.5 ${b.color}`}>{b.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  4. Referral Links Mockup                                           */
/* ------------------------------------------------------------------ */
export function ReferralMockup() {
  const links = [
    { label: "Amener un hôte", url: "e-dome.ch/ref/jm-host", badge: "100 CHF/hôte" },
    { label: "Amener un client", url: "e-dome.ch/ref/jm-client", badge: "5% résa" },
    { label: "Amener un bien", url: "e-dome.ch/ref/jm-listing", badge: "2% vente" },
  ];

  return (
    <motion.div {...fadeUp(0.2)} className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-[#0a0a0a] overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
        <Link2 className="w-4 h-4 text-[#C4956A]" />
        <span className="text-sm font-semibold text-white">Liens de Parrainage</span>
      </div>
      <div className="p-4 space-y-3">
        {links.map((l, i) => (
          <motion.div key={l.label} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1, ease: EASE }}
            className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-white/70">{l.label}</span>
              <span className="text-[9px] font-semibold text-[#C4956A] bg-[#C4956A]/10 rounded-full px-2 py-0.5 border border-[#C4956A]/20">{l.badge}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.06]"><span className="text-[10px] font-mono text-white/40">{l.url}</span></div>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#C4956A]/30 text-[10px] text-[#C4956A] font-medium hover:bg-[#C4956A]/5 transition-colors"><Copy className="w-3 h-3" />Copier</button>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 px-4 pb-4">
        {[{ v: "23", l: "Clics" }, { v: "8", l: "Conversions" }, { v: "2'400 CHF", l: "Gagnés" }].map((s) => (
          <div key={s.l} className="rounded-lg bg-white/[0.03] border border-white/[0.06] py-2.5 text-center">
            <p className="text-sm font-bold text-[#C4956A]">{s.v}</p>
            <p className="text-[8px] text-white/30 mt-0.5">{s.l}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  5. Training Mockup                                                 */
/* ------------------------------------------------------------------ */
export function TrainingMockup() {
  const chapters = [
    { title: "Introduction au marché", done: true },
    { title: "Évaluation des biens", done: true },
    { title: "Techniques de négociation", done: true },
    { title: "Droit immobilier", active: true },
    { title: "Marketing digital" },
    { title: "Certification finale", locked: true },
  ];

  return (
    <motion.div {...fadeUp(0.2)} className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-[#0a0a0a] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#C4956A] to-[#8B6F47] flex items-center justify-center"><Play className="w-3 h-3 text-white ml-0.5" fill="white" /></div><span className="text-sm font-semibold text-white">Formation E-Dome</span></div>
        <span className="text-[10px] text-[#C4956A] bg-[#C4956A]/10 rounded-full px-2.5 py-1 font-medium">65%</span>
      </div>
      {/* Video placeholder */}
      <div className="mx-4 mt-4 h-32 rounded-xl bg-gradient-to-br from-[#1a1a1a] to-[#0e0e0e] border border-white/[0.06] flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-3 left-3"><p className="text-[8px] text-white/30">Module 4/6</p><p className="text-[10px] text-white/60 font-medium">Droit immobilier</p></div>
        <div className="w-12 h-12 rounded-full bg-[#C4956A]/20 border border-[#C4956A]/30 flex items-center justify-center"><Play className="w-5 h-5 text-[#C4956A] ml-0.5" /></div>
      </div>
      {/* Progress */}
      <div className="px-4 py-3">
        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden"><motion.div className="h-full rounded-full bg-gradient-to-r from-[#C4956A] to-[#D4A574]" initial={{ width: 0 }} whileInView={{ width: "65%" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3, ease: EASE }} /></div>
      </div>
      {/* Chapters */}
      <div className="px-4 pb-4 space-y-1.5">
        {chapters.map((c, i) => (
          <motion.div key={c.title} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.06, ease: EASE }}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[10px] ${c.active ? "bg-[#C4956A]/5 border border-[#C4956A]/15" : "border border-transparent"} ${c.locked ? "opacity-40" : ""}`}>
            {c.done ? <CheckCircle2 className="w-4 h-4 text-[#C4956A] shrink-0" /> : c.active ? <Play className="w-4 h-4 text-[#C4956A] shrink-0" /> : <div className="w-4 h-4 rounded-full border border-white/15 shrink-0" />}
            <span className={`flex-1 ${c.done ? "text-white/40 line-through" : c.active ? "text-white font-medium" : "text-white/50"}`}>{c.title}</span>
            <ChevronRight className="w-3 h-3 text-white/15" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
