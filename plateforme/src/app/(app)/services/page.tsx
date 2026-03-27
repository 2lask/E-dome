"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, MapPin, Send, Check, Briefcase, Camera, Truck, Paintbrush, Scale, Landmark, Hammer, Package, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/context";

const CATEGORIES = [
  { id: "all", label: "Tous", icon: Briefcase },
  { id: "conciergerie", label: "Conciergerie", icon: Briefcase },
  { id: "transport", label: "Transport", icon: Truck },
  { id: "photographie", label: "Photographie", icon: Camera },
  { id: "decoration", label: "Décoration", icon: Paintbrush },
  { id: "juridique", label: "Juridique", icon: Scale },
  { id: "finance", label: "Finance", icon: Landmark },
  { id: "renovation", label: "Rénovation", icon: Hammer },
  { id: "demenagement", label: "Déménagement", icon: Package },
];

const SERVICES = [
  { id: "s1", title: "Gestion locative complète", category: "conciergerie", provider: "Swiss Concierge", rating: 4.9, reviews: 124, priceAmount: 150, pricePrefix: "À partir de ", priceSuffix: "/mois", city: "Neuchâtel", gradient: "from-blue-600/20 to-cyan-600/20" },
  { id: "s2", title: "Photographie immobilière HDR", category: "photographie", provider: "PixelPro Studio", rating: 4.8, reviews: 89, priceAmount: 350, pricePrefix: "", priceSuffix: "/séance", city: "Lausanne", gradient: "from-purple-600/20 to-pink-600/20" },
  { id: "s3", title: "Home staging professionnel", category: "decoration", provider: "Déco & Style", rating: 4.7, reviews: 67, priceAmount: 800, pricePrefix: "À partir de ", priceSuffix: "", city: "Genève", gradient: "from-amber-600/20 to-orange-600/20" },
  { id: "s4", title: "Conseil juridique immobilier", category: "juridique", provider: "Maître Dupont", rating: 4.9, reviews: 45, priceAmount: 250, pricePrefix: "", priceSuffix: "/consultation", city: "Neuchâtel", gradient: "from-emerald-600/20 to-teal-600/20" },
  { id: "s5", title: "Transport & déménagement", category: "demenagement", provider: "MoveSwiss", rating: 4.6, reviews: 203, priceAmount: 500, pricePrefix: "À partir de ", priceSuffix: "", city: "Berne", gradient: "from-red-600/20 to-rose-600/20" },
  { id: "s6", title: "Estimation immobilière", category: "finance", provider: "Wüest Partner", rating: 4.8, reviews: 156, priceAmount: 400, pricePrefix: "", priceSuffix: "/estimation", city: "Zürich", gradient: "from-indigo-600/20 to-violet-600/20" },
  { id: "s7", title: "Rénovation intérieure", category: "renovation", provider: "RénoPlus SA", rating: 4.5, reviews: 78, priceAmount: null, pricePrefix: "", priceSuffix: "Sur devis", city: "Lausanne", gradient: "from-yellow-600/20 to-amber-600/20" },
  { id: "s8", title: "Navette aéroport VIP", category: "transport", provider: "LuxTransfer", rating: 4.9, reviews: 312, priceAmount: 120, pricePrefix: "", priceSuffix: "/trajet", city: "Genève", gradient: "from-sky-600/20 to-blue-600/20" },
  { id: "s9", title: "Conciergerie Airbnb", category: "conciergerie", provider: "KeyHost", rating: 4.7, reviews: 198, priceAmount: null, pricePrefix: "", priceSuffix: "15% des revenus", city: "Montreux", gradient: "from-teal-600/20 to-emerald-600/20" },
];

export default function ServicesPage() {
  const { formatPrice } = useApp();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [devisId, setDevisId] = useState<string | null>(null);
  const [devisSent, setDevisSent] = useState<Set<string>>(new Set());
  const [devisForm, setDevisForm] = useState({ name: "", email: "", message: "" });

  const filtered = SERVICES.filter(s => {
    if (category !== "all" && s.category !== category) return false;
    if (search && !s.title.toLowerCase().includes(search.toLowerCase()) && !s.provider.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleDevis = (id: string) => {
    setDevisSent(prev => new Set(prev).add(id));
    setDevisId(null);
    setDevisForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Services professionnels</h1>
          <p className="mt-1 text-[var(--text-secondary)]">Trouvez les meilleurs prestataires pour vos projets</p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un service..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--card-border)] text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[#C4956A]/40" />
          </div>
          <Link href="/services/proposer" className="px-5 py-2.5 rounded-xl bg-[#C4956A] text-black text-sm font-semibold hover:bg-[#D4A574] transition-colors whitespace-nowrap">Proposer un service</Link>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setCategory(cat.id)} className={cn("flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors border", category === cat.id ? "bg-[#C4956A]/10 border-[#C4956A]/30 text-[#C4956A]" : "bg-white/[0.02] border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-white/[0.04]")}>
            <cat.icon className="w-3.5 h-3.5" />{cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
        {filtered.map(service => (
          <motion.div key={service.id} layout className="rounded-2xl bg-[var(--card)] border border-[var(--card-border)] overflow-hidden hover:border-white/[0.12] transition-colors group">
            <div className={cn("h-36 bg-gradient-to-br flex items-center justify-center", service.gradient)}>
              {CATEGORIES.find(c => c.id === service.category)?.icon && (() => { const Icon = CATEGORIES.find(c => c.id === service.category)!.icon; return <Icon className="w-10 h-10 text-[var(--text-muted)]" />; })()}
            </div>
            <div className="p-4 space-y-3">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C4956A]/10 text-[#C4956A] font-medium">{CATEGORIES.find(c => c.id === service.category)?.label}</span>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">{service.title}</h3>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-[var(--text-secondary)] font-semibold">{service.provider[0]}</div>
                <span className="text-xs text-[var(--text-secondary)]">{service.provider}</span>
                <div className="flex items-center gap-0.5 ml-auto">
                  <Star className="w-3 h-3 text-[#C4956A] fill-[#C4956A]" />
                  <span className="text-xs text-[var(--text-secondary)]">{service.rating}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">({service.reviews})</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]"><MapPin className="w-3 h-3" />{service.city}</div>
              <p className="text-sm font-semibold text-[#C4956A]">{service.priceAmount != null ? <>{service.pricePrefix}{formatPrice(service.priceAmount)}{service.priceSuffix}</> : service.priceSuffix}</p>

              {devisSent.has(service.id) ? (
                <div className="flex items-center gap-2 text-xs text-green-400"><Check className="w-4 h-4" />Demande envoyée !</div>
              ) : devisId === service.id ? (
                <div className="space-y-2 pt-2 border-t border-[var(--card-border)]">
                  <input value={devisForm.name} onChange={e => setDevisForm(p => ({ ...p, name: e.target.value }))} placeholder="Votre nom" className="w-full bg-white/[0.02] border border-[var(--card-border)] rounded-lg px-3 py-1.5 text-xs text-[var(--foreground)] focus:outline-none" />
                  <input value={devisForm.email} onChange={e => setDevisForm(p => ({ ...p, email: e.target.value }))} placeholder="Votre email" className="w-full bg-white/[0.02] border border-[var(--card-border)] rounded-lg px-3 py-1.5 text-xs text-[var(--foreground)] focus:outline-none" />
                  <textarea value={devisForm.message} onChange={e => setDevisForm(p => ({ ...p, message: e.target.value }))} placeholder="Votre message..." rows={2} className="w-full bg-white/[0.02] border border-[var(--card-border)] rounded-lg px-3 py-1.5 text-xs text-[var(--foreground)] resize-none focus:outline-none" />
                  <div className="flex gap-2">
                    <button onClick={() => setDevisId(null)} className="flex-1 py-1.5 rounded-lg border border-white/10 text-[var(--text-secondary)] text-xs hover:bg-white/[0.04]">Annuler</button>
                    <button onClick={() => handleDevis(service.id)} className="flex-1 py-1.5 rounded-lg bg-[#C4956A] text-black text-xs font-semibold hover:bg-[#D4A574]">Envoyer</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setDevisId(service.id)} className="w-full py-2 rounded-xl border border-[#C4956A]/30 text-[#C4956A] text-xs font-medium hover:bg-[#C4956A]/10 transition-colors">Demander un devis</button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* How it works */}
      <div className="rounded-2xl bg-[var(--card)] border border-[var(--card-border)] p-8">
        <h2 className="text-xl font-bold text-[var(--foreground)] text-center mb-8">Comment ça marche</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "1", title: "Recherchez", desc: "Parcourez notre sélection de professionnels qualifiés" },
            { step: "2", title: "Comparez", desc: "Consultez les avis, tarifs et portfolios" },
            { step: "3", title: "Réservez", desc: "Demandez un devis et planifiez votre prestation" },
          ].map(s => (
            <div key={s.step} className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#C4956A]/10 flex items-center justify-center mx-auto mb-3 text-[#C4956A] font-bold text-lg">{s.step}</div>
              <h3 className="font-semibold text-[var(--foreground)] mb-1">{s.title}</h3>
              <p className="text-sm text-[var(--text-secondary)]">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
