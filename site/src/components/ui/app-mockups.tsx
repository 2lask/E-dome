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
    { name: "Chalet Alpin", loc: "Verbier", price: "380 CHF/nuit", stars: 4.9, img: "/chalet.jpg" },
    { name: "Villa Charme", loc: "C\u00f4te d\u2019Azur", price: "520 CHF/nuit", stars: 4.8, img: "/villa.jpg" },
    { name: "Loft Design", loc: "Gen\u00e8ve", price: "185 CHF/nuit", stars: 4.6, img: "/interior.jpg" },
  ];

  return (
    <motion.div {...fadeUp(0.2)}>
      <Phone>
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 py-2 text-xs text-white/40">
          <span>9:41</span>
          <div className="flex gap-1"><div className="w-3 h-1.5 rounded-sm bg-white/30" /><div className="w-3 h-1.5 rounded-sm bg-white/20" /></div>
        </div>
        {/* Header */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div><p className="text-xs text-white/40">Bienvenue</p><p className="text-sm font-bold text-white">Découvrir</p></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C4956A] to-[#8B6F47] flex items-center justify-center"><User className="w-4 h-4 text-white" /></div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/[0.06] border border-white/[0.06] px-3 py-2">
            <Search className="w-3.5 h-3.5 text-white/30" />
            <span className="text-xs text-white/30">Rechercher un bien...</span>
          </div>
        </div>
        {/* Listings */}
        <div className="px-4 space-y-2.5 pb-16 overflow-y-auto flex-1">
          {listings.map((l, i) => (
            <motion.div key={l.name} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1, ease: EASE }}
              className="rounded-xl bg-white/[0.04] border border-white/[0.06] overflow-hidden">
              <div className="h-20 relative overflow-hidden">
                {i === 0 ? <video src="/feed-video-2.mp4" autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" /> : <img src={l.img} alt={l.name} className="absolute inset-0 w-full h-full object-cover" />}
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"><Heart className="w-3 h-3 text-white/60" /></div>
                <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm rounded-md px-2 py-0.5"><span className="text-xs font-bold text-[#C4956A]">{l.price}</span></div>
              </div>
              <div className="p-2.5">
                <p className="text-xs font-semibold text-white">{l.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5 text-white/30" /><span className="text-xs text-white/40">{l.loc}</span></div>
                  <div className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 text-[#C4956A] fill-[#C4956A]" /><span className="text-xs text-white/50">{l.stars}</span></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Bottom nav */}
        <div className="mt-auto border-t border-white/[0.06] flex justify-around py-2.5 px-4">
          {[Home, Search, Heart, User].map((Icon, i) => (
            <div key={i} className={`flex flex-col items-center gap-0.5 ${i === 0 ? "text-[#C4956A]" : "text-white/30"}`}>
              <Icon className="w-4 h-4" /><span className="text-xs">{["Accueil", "Chercher", "Favoris", "Profil"][i]}</span>
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
        <div className="flex items-center justify-between px-5 py-2 text-xs text-white/40"><span>9:41</span></div>
        <div className="px-4 pb-2 flex items-center justify-between">
          <p className="text-sm font-bold text-white">Fil social</p>
          <Bell className="w-4 h-4 text-white/40" />
        </div>
        {/* Stories */}
        <div className="flex gap-3 px-4 py-2 overflow-hidden">
          {[
            { name: "Vous", color: "#C4956A", isYou: true },
            { name: "Claire", color: "#8B5CF6" },
            { name: "Marc", color: "#3B82F6" },
            { name: "Sophie", color: "#EC4899" },
            { name: "Jean", color: "#10B981" },
          ].map((s) => (
            <div key={s.name} className="flex flex-col items-center gap-1 shrink-0">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ border: s.isYou ? "2px dashed rgba(255,255,255,0.2)" : `2px solid ${s.color}` }}>
                {s.isYou ? <span className="text-white/30 text-base">+</span> : <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${s.color}40, ${s.color}15)` }}><span className="text-xs font-bold" style={{ color: s.color }}>{s.name[0]}</span></div>}
              </div>
              <span className="text-xs text-white/40">{s.name}</span>
            </div>
          ))}
        </div>
        {/* Posts */}
        <div className="px-4 space-y-3 py-2 overflow-y-auto flex-1 pb-16">
          {/* Post vidéo */}
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4, ease: EASE }}
            className="rounded-xl bg-white/[0.04] border border-white/[0.06] overflow-hidden">
            <div className="p-2.5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#3B82F6]/30 to-[#3B82F6]/10 flex items-center justify-center"><span className="text-xs font-bold text-[#3B82F6]">C</span></div>
                <div><div className="flex items-center gap-1"><span className="text-xs font-semibold text-white">Claire Dupont</span><span className="text-xs bg-[#8B5CF6]/15 text-[#8B5CF6] rounded px-1 py-[1px]">Agent</span></div></div>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">Visite exclusive de cette villa avec vue panoramique</p>
            </div>
            <div className="h-32 relative overflow-hidden">
              <video src="/feed-video-1.mp4" autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
                <Play className="w-2.5 h-2.5 text-white" fill="white" />
                <span className="text-xs text-white/80">Reel</span>
              </div>
            </div>
            <div className="px-3 py-2 border-t border-white/[0.04]">
              <button className="w-full py-1.5 rounded-lg bg-[#C4956A] text-xs font-bold text-white hover:bg-[#D4A574] transition-colors">R&eacute;server</button>
            </div>
            <div className="flex items-center gap-4 px-3 py-2 border-t border-white/[0.04]">
              <div className="flex items-center gap-1 text-[#EF4444]"><Heart className="w-3 h-3 fill-[#EF4444]" /><span className="text-xs">127</span></div>
              <div className="flex items-center gap-1 text-white/30"><MessageCircle className="w-3 h-3" /><span className="text-xs">34</span></div>
              <div className="flex items-center gap-1 text-white/30"><Share2 className="w-3 h-3" /></div>
            </div>
          </motion.div>
          {/* Post image */}
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.55, ease: EASE }}
            className="rounded-xl bg-white/[0.04] border border-white/[0.06] overflow-hidden">
            <div className="p-2.5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#F59E0B]/30 to-[#F59E0B]/10 flex items-center justify-center"><span className="text-xs font-bold text-[#F59E0B]">M</span></div>
                <div><div className="flex items-center gap-1"><span className="text-xs font-semibold text-white">Marc Berger</span><span className="text-xs bg-[#3B82F6]/15 text-[#3B82F6] rounded px-1 py-[1px]">H&ocirc;te</span></div></div>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">Mon chalet Verbier affiche complet pour mars !</p>
            </div>
            <div className="h-20 relative overflow-hidden">
              <img src="/chalet.jpg" alt="Chalet" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-4 px-3 py-2 border-t border-white/[0.04]">
              <div className="flex items-center gap-1 text-white/30"><Heart className="w-3 h-3" /><span className="text-xs">41</span></div>
              <div className="flex items-center gap-1 text-white/30"><MessageCircle className="w-3 h-3" /><span className="text-xs">7</span></div>
              <div className="flex items-center gap-1 text-white/30"><Share2 className="w-3 h-3" /></div>
            </div>
          </motion.div>
        </div>
      </Phone>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  3. Dashboard Revenue Mockup (large, not in phone)                  */
/* ------------------------------------------------------------------ */
export function DashboardMockup() {
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const bars = [14, 22, 18, 31, 25, 38, 45, 33, 52, 42, 60, 72];

  const kpis = [
    { label: "Revenus", value: "12'450", color: "#C4956A", icon: TrendingUp },
    { label: "R\u00e9servations", value: "34", color: "#3B82F6", icon: Calendar },
    { label: "Apports", value: "8'200", color: "#F59E0B", icon: Link2 },
    { label: "Conversion", value: "78%", color: "#10B981", icon: BarChart3 },
  ];

  const activity = [
    { initials: "MD", color: "#3B82F6", name: "Marc D.", action: "R\u00e9servation", amount: "1,900" },
    { initials: "SL", color: "#F59E0B", name: "Sophie L.", action: "Commission", amount: "320" },
    { initials: "PR", color: "#8B5CF6", name: "Pierre R.", action: "Publication", amount: "1.2M" },
  ];

  return (
    <motion.div {...fadeUp(0.2)} className="w-full rounded-2xl border border-white/[0.06] bg-[#0a0a0a] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#C4956A] to-[#8B6F47] flex items-center justify-center shrink-0"><BarChart3 className="w-3 h-3 text-white" /></div>
          <span className="text-xs font-semibold text-white truncate">E-Dome</span>
        </div>
        <div className="flex items-center shrink-0">
          {["MD", "SL"].map((init, i) => (
            <div key={init} className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: ["#3B82F6", "#F59E0B"][i], marginLeft: i > 0 ? -6 : 0, zIndex: 2 - i, border: "2px solid #0a0a0a" }}>{init}</div>
          ))}
        </div>
      </div>

      <div className="p-3 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {kpis.map((k, i) => (
            <motion.div key={k.label} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.06, ease: EASE }}
              className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-2.5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: k.color }} />
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-white/30 uppercase truncate">{k.label}</p>
                <k.icon className="w-3 h-3 shrink-0" style={{ color: k.color }} />
              </div>
              <p className="text-sm font-bold text-white truncate">{k.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-2.5">
          <p className="text-xs text-white/30 uppercase mb-2">Revenus</p>
          <div className="flex items-end gap-[2px] h-20">
            {bars.map((h, i) => (
              <motion.div key={i} className="flex-1 rounded-t-sm"
                style={{ background: i >= 10 ? "linear-gradient(to top, #C4956A, #D4A574)" : "linear-gradient(to top, rgba(196,149,106,0.2), rgba(196,149,106,0.05))" }}
                initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.03, ease: EASE }} />
            ))}
          </div>
          <div className="flex justify-between mt-1">{months.map((m, i) => <span key={i} className="text-xs text-white/15 flex-1 text-center">{m}</span>)}</div>
        </div>

        <div className="space-y-1.5">
          {activity.map((a, i) => (
            <motion.div key={a.name} initial={{ opacity: 0, x: -6 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.06, ease: EASE }}
              className="flex items-center justify-between rounded-lg bg-white/[0.03] border border-white/[0.06] px-2.5 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: a.color }}>{a.initials}</div>
                <div className="min-w-0"><p className="text-xs font-medium text-white truncate">{a.name}</p><p className="text-xs text-white/25 truncate">{a.action}</p></div>
              </div>
              <span className="text-xs font-semibold shrink-0 ml-2" style={{ color: a.color }}>{a.amount}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mini Dashboard (sidebar version)                                    */
/* ------------------------------------------------------------------ */
export function MiniDashboard() {
  const kpis = [
    { label: "Revenus", value: "12'450", unit: "CHF", color: "#F59E0B", icon: TrendingUp },
    { label: "Réservations", value: "34", unit: "", color: "#3B82F6", icon: Calendar },
  ];
  const bars = [20, 35, 28, 45, 38, 55, 62, 48, 68, 58, 78, 85];
  const activity = [
    { initials: "MD", color: "#3B82F6", name: "Marc D.", action: "Réservation", amount: "CHF 1,900" },
    { initials: "SL", color: "#F59E0B", name: "Sophie L.", action: "Commission", amount: "CHF 320" },
    { initials: "PR", color: "#8B5CF6", name: "Pierre R.", action: "Bien publié", amount: "CHF 1.2M" },
  ];

  return (
    <motion.div {...fadeUp(0.3)} className="w-full rounded-2xl border border-white/[0.06] bg-[#0a0a0a] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#C4956A] to-[#8B6F47] flex items-center justify-center"><BarChart3 className="w-3 h-3 text-white" /></div>
          <span className="text-xs font-semibold text-white">Dashboard</span>
        </div>
        <span className="text-xs text-white/30">Mars 2026</span>
      </div>
      <div className="p-3 space-y-3">
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-2">
          {kpis.map((k, i) => (
            <motion.div key={k.label} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1, ease: EASE }}
              className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-2.5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: k.color }} />
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-white/30 uppercase">{k.label}</p>
                <k.icon className="w-3 h-3" style={{ color: k.color }} />
              </div>
              <p className="text-base font-bold text-white">{k.value} <span className="text-xs text-white/30">{k.unit}</span></p>
            </motion.div>
          ))}
        </div>
        {/* Mini chart */}
        <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-2.5">
          <p className="text-xs text-white/30 uppercase mb-2">Revenus mensuels</p>
          <div className="flex items-end gap-[2px] h-16">
            {bars.map((h, i) => (
              <motion.div key={i} className="flex-1 rounded-t-sm"
                style={{ background: i >= 10 ? "linear-gradient(to top, #F59E0B, #FBBF24)" : "linear-gradient(to top, rgba(245,158,11,0.2), rgba(245,158,11,0.05))" }}
                initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.03, ease: EASE }} />
            ))}
          </div>
        </div>
        {/* Activity */}
        <div className="space-y-1.5">
          {activity.map((a, i) => (
            <motion.div key={a.name} initial={{ opacity: 0, x: -6 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.08, ease: EASE }}
              className="flex items-center justify-between rounded-lg bg-white/[0.03] border border-white/[0.06] px-2.5 py-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: a.color }}>{a.initials}</div>
                <div><p className="text-xs font-medium text-white">{a.name}</p><p className="text-xs text-white/25">{a.action}</p></div>
              </div>
              <span className="text-xs font-semibold" style={{ color: a.color }}>{a.amount}</span>
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
    { label: "Amener un hôte", url: "e-dome.ch/ref/jm-host", badge: "100 CHF/hôte", color: "#3B82F6", icon: Home },
    { label: "Amener un client", url: "e-dome.ch/ref/jm-client", badge: "5% résa", color: "#8B5CF6", icon: User },
    { label: "Amener un bien", url: "e-dome.ch/ref/jm-listing", badge: "2% vente", color: "#10B981", icon: MapPin },
  ];

  const stats = [
    { v: "23", l: "Clics", color: "#F59E0B" },
    { v: "8", l: "Conversions", color: "#10B981" },
    { v: "2'400 CHF", l: "Gagnés", color: "#3B82F6" },
  ];

  return (
    <motion.div {...fadeUp(0.2)} className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-[#0a0a0a] overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
        <div className="w-7 h-7 rounded-lg bg-[#F59E0B]/15 flex items-center justify-center"><Link2 className="w-4 h-4 text-[#F59E0B]" /></div>
        <span className="text-sm font-semibold text-white">Liens de Parrainage</span>
      </div>
      <div className="p-4 space-y-3">
        {links.map((l, i) => (
          <motion.div key={l.label} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1, ease: EASE }}
            className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3.5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[2px] group-hover:h-[3px] transition-all" style={{ backgroundColor: l.color }} />
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: `${l.color}15` }}>
                  <l.icon className="w-3.5 h-3.5" style={{ color: l.color }} />
                </div>
                <span className="text-xs font-medium text-white/70">{l.label}</span>
              </div>
              <span className="text-xs font-semibold rounded-full px-2 py-0.5 border" style={{ color: l.color, backgroundColor: `${l.color}10`, borderColor: `${l.color}30` }}>{l.badge}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.06]"><span className="text-xs font-mono text-white/40">{l.url}</span></div>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors" style={{ borderColor: `${l.color}30`, color: l.color }}><Copy className="w-3 h-3" />Copier</button>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 px-4 pb-4">
        {stats.map((s) => (
          <div key={s.l} className="rounded-lg bg-white/[0.03] border border-white/[0.06] py-2.5 text-center">
            <p className="text-sm font-bold" style={{ color: s.color }}>{s.v}</p>
            <p className="text-xs text-white/30 mt-0.5">{s.l}</p>
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
  const myFormations = [
    { title: "Investir en Tha\u00eflande", progress: 60, modules: "7/12 modules", gradient: "from-[#8B5CF6] to-[#6366F1]", emoji: "🏝️", status: "En cours", statusColor: "#3B82F6", btn: "Continuer", btnColor: "#3B82F6" },
    { title: "Agent Immobilier International", progress: 100, modules: "Termin\u00e9", gradient: "from-[#10B981] to-[#06B6D4]", emoji: "🤝", status: "Termin\u00e9", statusColor: "#10B981", btn: "Certificat", btnColor: "#10B981" },
    { title: "Bootcamp Apporteur Pro", progress: 0, modules: "Commence le 10 Mars 2026", gradient: "from-[#F97316] to-[#EF4444]", emoji: "📊", status: "\u00c0 venir", statusColor: "#F97316", btn: "Voir infos", btnColor: "#F97316" },
  ];

  const catalogue = [
    { title: "Agent Immobilier International", author: "@CoachImmo", rating: "4.9", reviews: "567", price: "297\u20ac", img: "/formation-1.jpg" },
    { title: "Bootcamp Apporteur Pro (30j)", author: "@BusinessAcademy", rating: "4.9", reviews: "342", price: "997\u20ac", img: "/formation-2.jpg" },
    { title: "Analyse ROI & Projections", author: "@InvestmentGuru", rating: "4.7", reviews: "890", price: "147\u20ac", img: "/formation-3.jpg" },
    { title: "Investir aux Philippines", author: "@AsiaProperty", rating: "4.6", reviews: "234", price: "197\u20ac", img: "/formation-4.jpg" },
  ];

  return (
    <motion.div {...fadeUp(0.2)} className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#0c0c0c] overflow-hidden">
      {/* MES FORMATIONS */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">📚</span>
          <span className="text-xs font-bold text-white">Mes Formations</span>
        </div>
        <div className="space-y-2.5">
          {myFormations.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.08, ease: EASE }}
              className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-xl shrink-0 shadow-lg`}>
                {f.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{f.title}</p>
                {f.progress > 0 && f.progress < 100 && (
                  <div className="mt-1.5 h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: f.btnColor }}
                      initial={{ width: 0 }} whileInView={{ width: `${f.progress}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3, ease: EASE }} />
                  </div>
                )}
                <div className="flex items-center gap-2 mt-1">
                  {f.progress === 100 && <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${f.statusColor}20`, color: f.statusColor }}>&#x2714; {f.status}</span>}
                  <span className="text-xs" style={{ color: f.statusColor }}>{f.modules}</span>
                </div>
              </div>
              <button className="text-xs font-bold px-3 py-1.5 rounded-lg text-white shrink-0 flex items-center gap-1" style={{ backgroundColor: f.btnColor }}>
                {f.progress > 0 && f.progress < 100 && <Play className="w-2.5 h-2.5" fill="white" />}
                {f.btn}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CATALOGUE */}
      <div className="px-4 pt-4 pb-4 border-t border-white/[0.06] mt-2">
        <p className="text-xs font-semibold text-white/60 mb-3">Autres formations</p>
        <div className="grid grid-cols-2 gap-2">
          {catalogue.map((c, i) => (
            <motion.div key={c.title} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.06, ease: EASE }}
              className="rounded-xl border border-white/[0.06] bg-white/[0.03] overflow-hidden hover:bg-white/[0.06] transition-colors">
              <div className="h-16 relative overflow-hidden">
                <img src={(c as any).img} alt={c.title} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="p-2.5">
                <p className="text-xs font-semibold text-white leading-tight">{c.title}</p>
                <p className="text-xs text-white/30 mt-0.5">Par {c.author}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-2.5 h-2.5 text-[#F59E0B] fill-[#F59E0B]" />
                  <span className="text-xs text-white/50">{c.rating} ({c.reviews})</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-bold text-[#8B5CF6]">{c.price}</span>
                  <span className="text-xs text-white/30 border border-white/[0.1] rounded px-1.5 py-0.5">Voir</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* WEBINAIRE LIVE */}
      <div className="px-4 pb-4">
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4, ease: EASE }}
          className="rounded-xl border border-[#EF4444]/20 bg-[#EF4444]/5 p-3 flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#EF4444] to-[#EC4899] flex items-center justify-center shrink-0 relative">
            <Play className="w-6 h-6 text-white" fill="white" />
            <span className="absolute -top-1 -right-1 text-xs font-bold bg-[#EF4444] text-white px-1.5 py-0.5 rounded-full animate-pulse">LIVE</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white">Webinaire : Acheter &agrave; Bali en 2026</p>
            <p className="text-xs text-white/40 mt-0.5">@BaliPropertyExpert &middot; 15 Mars 2026 &middot; 20h00</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-[#10B981]">Gratuit</span>
              <span className="text-xs text-white/30">234 inscrits</span>
            </div>
          </div>
          <button className="text-xs font-bold bg-[#EF4444] text-white px-3 py-1.5 rounded-lg shrink-0">S&apos;inscrire</button>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Options Additionnelles Mockup                                      */
/* ------------------------------------------------------------------ */

const addOptions = [
  { icon: "☕", name: "Caf\u00e9 de bienvenue", price: "Gratuit", color: "#10B981", free: true },
  { icon: "🍾", name: "Champagne \u00e0 l\u2019arriv\u00e9e", price: "+50\u20ac", color: "#F59E0B", free: false },
  { icon: "💆", name: "Massage 1h en villa", price: "+80\u20ac", color: "#EC4899", free: false },
  { icon: "👨‍🍳", name: "Chef priv\u00e9 (d\u00eener)", price: "+200\u20ac", color: "#EF4444", free: false },
  { icon: "🚗", name: "Transfert a\u00e9roport", price: "+60\u20ac", color: "#3B82F6", free: false },
];

export function OptionsMockup() {
  return (
    <motion.div {...fadeUp(0.1)} className="w-full rounded-xl bg-[#0c0c0c] border border-white/[0.08] overflow-hidden">
      <div className="px-3 py-2 border-b border-white/[0.06] flex items-center gap-2">
        <span className="text-sm">💰</span>
        <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Options</span>
        <span className="ml-auto text-xs text-[#C4956A] font-medium">(configurable par l&apos;h&ocirc;te)</span>
      </div>
      <div className="p-2 space-y-1.5">
        {addOptions.map((opt, i) => (
          <motion.div key={opt.name} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.05, ease: EASE }}
            className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors">
            <div className="w-7 h-7 rounded flex items-center justify-center text-sm" style={{ backgroundColor: `${opt.color}15` }}>
              {opt.icon}
            </div>
            <p className="flex-1 text-xs font-medium text-white truncate">{opt.name}</p>
            <span className={`text-xs font-bold ${opt.free ? 'text-[#10B981]' : ''}`} style={opt.free ? {} : { color: opt.color }}>{opt.price}</span>
            <button className={`text-xs font-semibold px-2 py-1 rounded ${opt.free ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/20' : 'border border-white/[0.1] text-white/50'}`}>
              {opt.free ? 'Inclus' : 'Ajouter'}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Property Analytics Mockup — fiche bien + données investisseur     */
/* ------------------------------------------------------------------ */

export function PropertyAnalyticsMockup() {
  const metrics = [
    { label: "Rendement brut", value: "6.8%", color: "#10B981", trend: "+0.4%" },
    { label: "Rendement net", value: "4.9%", color: "#3B82F6", trend: "+0.2%" },
    { label: "Cash-flow mensuel", value: "CHF 1,240", color: "#F59E0B", trend: "+8%" },
    { label: "ROI sur 5 ans", value: "34.2%", color: "#8B5CF6", trend: "" },
  ];

  const monthlyData = [65, 72, 58, 80, 75, 88, 82, 90, 85, 95, 92, 98];

  return (
    <motion.div {...fadeUp(0.1)} className="w-full max-w-md mx-auto rounded-2xl bg-[#0c0c0c] border border-white/[0.08] overflow-hidden">
      {/* Property header with image */}
      <div className="relative h-44 overflow-hidden">
        <img src="/villa.jpg" alt="Villa Méditerranée" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="text-xs font-bold bg-[#10B981]/90 text-white px-2 py-0.5 rounded-full">Investissement</span>
          <span className="text-xs font-bold bg-[#3B82F6]/90 text-white px-2 py-0.5 rounded-full">Vente</span>
        </div>
        <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <Heart className="w-3.5 h-3.5 text-white/70" />
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-base font-bold text-white">Villa Méditerranée</h3>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-white/50" />
            <span className="text-xs text-white/50">Côte d&apos;Azur, France</span>
            <span className="ml-auto text-sm font-bold text-[#C4956A]">CHF 1,850,000</span>
          </div>
        </div>
      </div>

      {/* Quick stats bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-1"><Home className="w-3 h-3 text-white/30" /><span className="text-xs text-white/40">5 pièces</span></div>
        <div className="flex items-center gap-1"><Calendar className="w-3 h-3 text-white/30" /><span className="text-xs text-white/40">Disponible</span></div>
        <div className="flex items-center gap-0.5">
          <Star className="w-3 h-3 text-[#C4956A] fill-[#C4956A]" />
          <span className="text-xs text-white/50">4.9</span>
        </div>
        <button className="text-xs font-semibold bg-[#C4956A] text-black px-3 py-1 rounded-full">Réserver une visite</button>
      </div>

      {/* Analytics section */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-3.5 h-3.5 text-[#C4956A]" />
          <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Analyse investisseur</span>
        </div>

        {/* 4 KPI cards */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {metrics.map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.08, ease: EASE }}
              className="rounded-lg bg-white/[0.04] border border-white/[0.06] p-2.5">
              <p className="text-xs text-white/40 uppercase tracking-wider">{m.label}</p>
              <div className="flex items-end gap-1.5 mt-1">
                <span className="text-base font-bold" style={{ color: m.color }}>{m.value}</span>
                {m.trend && (
                  <span className="text-xs font-medium text-[#10B981] mb-0.5 flex items-center gap-0.5">
                    <TrendingUp className="w-2.5 h-2.5" />{m.trend}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mini bar chart — Taux d'occupation */}
        <div className="rounded-lg bg-white/[0.04] border border-white/[0.06] p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-white/50">Taux d&apos;occupation (12 mois)</span>
            <span className="text-xs font-bold text-[#10B981]">87% moy.</span>
          </div>
          <div className="flex items-end gap-[3px] h-12">
            {monthlyData.map((h, i) => (
              <motion.div key={i} className="flex-1 rounded-sm" style={{ background: `linear-gradient(to top, ${h > 85 ? '#10B981' : h > 70 ? '#3B82F6' : '#F59E0B'}40, ${h > 85 ? '#10B981' : h > 70 ? '#3B82F6' : '#F59E0B'}15)` }}
                initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 + i * 0.03, ease: EASE }} />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-white/25">Jan</span>
            <span className="text-xs text-white/25">Juin</span>
            <span className="text-xs text-white/25">Déc</span>
          </div>
        </div>

        {/* Financials breakdown */}
        <div className="rounded-lg bg-white/[0.04] border border-white/[0.06] p-3 mb-3">
          <span className="text-xs font-medium text-white/50 block mb-2">Projection financière</span>
          {[
            { label: "Revenus locatifs annuels", value: "CHF 126,000", color: "#10B981" },
            { label: "Charges & entretien", value: "- CHF 18,200", color: "#EF4444" },
            { label: "Hypothèque (estimation)", value: "- CHF 42,000", color: "#F59E0B" },
            { label: "Revenu net annuel", value: "CHF 65,800", color: "#3B82F6", bold: true },
          ].map((row, i) => (
            <div key={i} className={`flex items-center justify-between py-1.5 ${i < 3 ? 'border-b border-white/[0.04]' : ''}`}>
              <span className={`text-xs ${(row as any).bold ? 'text-white font-semibold' : 'text-white/40'}`}>{row.label}</span>
              <span className={`text-xs font-bold`} style={{ color: row.color }}>{row.value}</span>
            </div>
          ))}
        </div>

        <div className="pb-2" />
      </div>
    </motion.div>
  );
}
