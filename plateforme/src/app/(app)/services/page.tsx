"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/lib/context";

/* ─── Mock Data ──────────────────────────────────────────────────────────── */

const CATEGORIES = [
  { label: "Tous", icon: "🔍" },
  { label: "Conciergerie", icon: "🏨" },
  { label: "Transport", icon: "🚗" },
  { label: "Photographie", icon: "📸" },
  { label: "Décoration", icon: "🎨" },
  { label: "Juridique", icon: "⚖️" },
  { label: "Finance", icon: "💼" },
  { label: "Rénovation", icon: "🔨" },
  { label: "Déménagement", icon: "📦" },
];

const GRADIENTS = [
  "from-blue-600 to-indigo-700",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-purple-500 to-violet-600",
  "from-cyan-500 to-blue-600",
  "from-red-500 to-rose-600",
  "from-green-500 to-emerald-600",
  "from-yellow-500 to-amber-600",
];

const SERVICES = [
  { id: "s1", title: "Conciergerie premium Airbnb", category: "Conciergerie", provider: "Swiss Concierge", providerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop", rating: 4.9, reviews: 127, price: 150, unit: "/mois", gradient: 0 },
  { id: "s2", title: "Transport de meubles Suisse romande", category: "Transport", provider: "TransLogistic SA", providerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop", rating: 4.7, reviews: 89, price: 80, unit: "/trajet", gradient: 1 },
  { id: "s3", title: "Photographie immobilière HD + drone", category: "Photographie", provider: "PixelHome", providerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop", rating: 4.8, reviews: 203, price: 350, unit: "/séance", gradient: 2 },
  { id: "s4", title: "Décoration intérieure & home staging", category: "Décoration", provider: "Deco Studio", providerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop", rating: 4.6, reviews: 56, price: 200, unit: "/pièce", gradient: 3 },
  { id: "s5", title: "Conseil juridique immobilier", category: "Juridique", provider: "Cabinet Moreau", providerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop", rating: 4.9, reviews: 145, price: 250, unit: "/h", gradient: 4 },
  { id: "s6", title: "Gestion comptable locative", category: "Finance", provider: "FinImmo Conseil", providerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=60&fit=crop", rating: 4.5, reviews: 34, price: 120, unit: "/mois", gradient: 5 },
  { id: "s7", title: "Rénovation complète appartement", category: "Rénovation", provider: "RenovaPro", providerAvatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=60&h=60&fit=crop", rating: 4.8, reviews: 178, price: 5000, unit: "/projet", gradient: 6 },
  { id: "s8", title: "Déménagement professionnel", category: "Déménagement", provider: "MoveSwiss", providerAvatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=60&h=60&fit=crop", rating: 4.7, reviews: 92, price: 600, unit: "/déménagement", gradient: 7 },
  { id: "s9", title: "Gestion clés et accueil voyageurs", category: "Conciergerie", provider: "KeyMaster", providerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop", rating: 4.6, reviews: 67, price: 30, unit: "/accueil", gradient: 8 },
];

const STEPS = [
  { number: "1", title: "Choisissez un service", desc: "Parcourez notre catalogue de prestataires vérifiés et sélectionnez le service adapté à vos besoins." },
  { number: "2", title: "Demandez un devis", desc: "Décrivez votre projet et recevez un devis personnalisé directement du prestataire." },
  { number: "3", title: "Profitez du service", desc: "Le prestataire réalise la mission. Payez en toute sécurité via la plateforme." },
];

/* ─── Stars ──────────────────────────────────────────────────────────────── */

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "text-amber-400" : "text-[var(--text-muted)]"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-[var(--text-muted)] ml-1">{rating.toFixed(1)}</span>
    </span>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function ServicesPage() {
  const { formatPrice } = useApp();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tous");
  const [devisOpenId, setDevisOpenId] = useState<string | null>(null);
  const [devisMessage, setDevisMessage] = useState("");
  const [devisDate, setDevisDate] = useState("");
  const [devisNom, setDevisNom] = useState("");
  const [devisEmail, setDevisEmail] = useState("");
  const [devisTel, setDevisTel] = useState("");
  const [devisSent, setDevisSent] = useState<Set<string>>(new Set());
  const [toastVisible, setToastVisible] = useState(false);

  const filtered = useMemo(() => {
    return SERVICES.filter((s) => {
      const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.provider.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "Tous" || s.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category]);

  const handleSendDevis = (serviceId: string) => {
    setDevisSent((prev) => { const n = new Set(prev); n.add(serviceId); return n; });
    setDevisOpenId(null);
    setDevisMessage("");
    setDevisDate("");
    setDevisNom("");
    setDevisEmail("");
    setDevisTel("");
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl page-heading">Services</h1>
            <p className="text-[var(--text-secondary)] mt-1">Trouvez les meilleurs prestataires pour vos biens</p>
          </div>
          <a href="/services/proposer" className="px-6 py-3 bg-[#1e9df1] hover:bg-[#1583c9] text-white rounded-xl font-medium transition-colors">
            Proposer un service
          </a>
        </div>

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Rechercher un service..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-[var(--card)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#1e9df1]/50 transition-colors" />
        </div>

        {/* Category chips */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button key={cat.label} onClick={() => setCategory(cat.label)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === cat.label ? "bg-[#1e9df1] text-white" : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[#1e9df1]/40"}`}>
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* ── Service Grid ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service) => (
            <div key={service.id} className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl overflow-hidden hover:border-[#1e9df1]/40 transition-colors">
              {/* Gradient thumbnail */}
              <div className={`h-32 bg-gradient-to-br ${GRADIENTS[service.gradient]} flex items-center justify-center`}>
                <span className="text-5xl">{CATEGORIES.find((c) => c.label === service.category)?.icon || service.category.charAt(0)}</span>
              </div>
              <div className="p-4 space-y-3">
                <span className="inline-block px-2 py-0.5 bg-[#1e9df1]/20 text-[#1e9df1] rounded-full text-xs font-medium">{service.category}</span>
                <h3 className="font-semibold line-clamp-2">{service.title}</h3>
                <div className="flex items-center gap-2">
                  <img src={service.providerAvatar} alt={service.provider} className="w-6 h-6 rounded-full object-cover" />
                  <span className="text-sm text-[var(--text-secondary)]">{service.provider}</span>
                </div>
                <Stars rating={service.rating} />
                <span className="text-xs text-[var(--text-muted)]">({service.reviews} avis)</span>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="font-bold text-[#1e9df1]">{formatPrice(service.price)}</span>
                    <span className="text-xs text-[var(--text-muted)]"> {service.unit}</span>
                  </div>
                  {devisSent.has(service.id) ? (
                    <span className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium">Devis envoy&eacute; ✓</span>
                  ) : devisOpenId === service.id ? (
                    <button onClick={() => setDevisOpenId(null)} className="px-3 py-1.5 border border-[var(--card-border)] rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">
                      Annuler
                    </button>
                  ) : (
                    <button onClick={() => setDevisOpenId(service.id)} className="px-3 py-1.5 bg-[#1e9df1] hover:bg-[#1583c9] text-white rounded-lg text-sm font-medium transition-colors">
                      Demander un devis
                    </button>
                  )}
                </div>

                {/* Inline devis form */}
                {devisOpenId === service.id && (
                  <div className="pt-3 border-t border-[var(--card-border)] space-y-3 animate-fade-in">
                    <textarea
                      className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--card-border)] rounded-xl text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#1e9df1]/50 min-h-[80px] resize-y transition-colors"
                      placeholder="Description du besoin..."
                      value={devisMessage}
                      onChange={(e) => setDevisMessage(e.target.value)}
                    />
                    <input
                      type="date"
                      className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--card-border)] rounded-xl text-sm text-[var(--foreground)] focus:outline-none focus:border-[#1e9df1]/50 transition-colors"
                      value={devisDate}
                      onChange={(e) => setDevisDate(e.target.value)}
                      placeholder="Date souhait&eacute;e"
                    />
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--card-border)] rounded-xl text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#1e9df1]/50 transition-colors"
                      placeholder="Votre nom"
                      value={devisNom}
                      onChange={(e) => setDevisNom(e.target.value)}
                    />
                    <input
                      type="email"
                      className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--card-border)] rounded-xl text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#1e9df1]/50 transition-colors"
                      placeholder="Email"
                      value={devisEmail}
                      onChange={(e) => setDevisEmail(e.target.value)}
                    />
                    <input
                      type="tel"
                      className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--card-border)] rounded-xl text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#1e9df1]/50 transition-colors"
                      placeholder="T&eacute;l&eacute;phone"
                      value={devisTel}
                      onChange={(e) => setDevisTel(e.target.value)}
                    />
                    <button onClick={() => handleSendDevis(service.id)} className="w-full py-2 bg-[#1e9df1] hover:bg-[#1583c9] text-white rounded-lg text-sm font-medium transition-colors">
                      Envoyer
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-[var(--text-muted)] py-12">Aucun service trouvé.</p>
        )}

        {/* Toast notification */}
        {toastVisible && (
          <div className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-green-600 text-white rounded-xl shadow-lg text-sm font-medium animate-fade-in">
            Demande de devis envoy&eacute;e avec succ&egrave;s !
          </div>
        )}

        {/* ── Comment ca marche ───────────────────────────────────────── */}
        <section className="py-10">
          <h2 className="text-2xl font-bold text-center mb-8">Comment &ccedil;a marche</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step) => (
              <div key={step.number} className="text-center p-6 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl">
                <div className="w-12 h-12 bg-[#1e9df1]/20 text-[#1e9df1] rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.number}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
