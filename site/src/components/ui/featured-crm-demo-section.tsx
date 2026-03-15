"use client";

import { Card } from "@/components/ui/card";
import { useState } from "react";
import {
  Home,
  BarChart3,
  Calendar,
  Users,
  Settings,
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  Bell,
  Search,
  Star,
  MapPin,
} from "lucide-react";

const features = [
  {
    title: "Marketplace intégrée",
    subtitle: "Location courte et longue durée, vente — tout dans un parcours unique avec des commissions 40-60% inférieures aux plateformes traditionnelles.",
  },
  {
    title: "Réseau social immobilier",
    subtitle: "Publiez des reels, stories et contenus pour bâtir votre audience. Visibilité organique gratuite, sans budget publicitaire.",
  },
  {
    title: "Système d’apporteurs",
    subtitle: "Liens traçables, commissions automatiques, dashboard en temps réel. Le bouche-à-oreille devient mesurable et rémunéré.",
  },
  {
    title: "Formations & services",
    subtitle: "Catalogue de formations, webinars d’experts, et services additionnels intégrés directement à chaque bien.",
  },
];

const sidebarItems = [
  { icon: Home, label: "Accueil", active: false },
  { icon: BarChart3, label: "Analytique", active: true },
  { icon: Calendar, label: "Calendrier", active: false },
  { icon: Users, label: "Réseau", active: false },
  { icon: Settings, label: "Réglages", active: false },
];

const properties = [
  { name: "Chalet Verbier", dates: "12\u201317 mars", status: "Confirmée", color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/20", price: "3’200 CHF", rating: 4.8 },
  { name: "Apt. Lausanne", dates: "20\u201323 mars", status: "En attente", color: "text-amber-400 bg-amber-500/15 border-amber-500/20", price: "1’450 CHF", rating: 4.5 },
  { name: "Villa Montreux", dates: "28\u201331 mars", status: "Confirmée", color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/20", price: "4’800 CHF", rating: 4.9 },
];

const barData = [
  { month: "Oct", h: 30 },
  { month: "Nov", h: 42 },
  { month: "Déc", h: 38 },
  { month: "Jan", h: 55 },
  { month: "Fév", h: 65 },
  { month: "Mar", h: 88 },
];

const integrations = [
  { name: "Stripe", subtitle: "Paiements sécurisés" },
  { name: "Twilio", subtitle: "Communications" },
  { name: "Google Maps", subtitle: "Géolocalisation" },
  { name: "Cloudinary", subtitle: "Médias optimisés" },
  { name: "Veriff", subtitle: "Vérification KYC" },
  { name: "SendGrid", subtitle: "Notifications email" },
  { name: "Intercom", subtitle: "Support client" },
  { name: "Mixpanel", subtitle: "Analytique avancée" },
];

function InteractiveDashboard() {
  const [activeTab, setActiveTab] = useState<"all" | "reservations" | "apports">("all");

  return (
    <div className="w-full h-full rounded-lg bg-[#0d0d0d] overflow-hidden flex">
      {/* Sidebar */}
      <div className="hidden sm:flex flex-col items-center gap-1 py-4 px-2 border-r border-[#201e18] bg-[#0a0a0a]">
        {sidebarItems.map((item) => (
          <div
            key={item.label}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              item.active ? "bg-[#ffe0c2]/10 text-[#ffe0c2]" : "text-white/25 hover:text-white/50"
            }`}
          >
            <item.icon className="w-4 h-4" />
          </div>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 p-4 space-y-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-semibold text-sm">E-Dome Dashboard</p>
            <p className="text-[10px] text-white/30">Vue d&apos;ensemble</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#191919] border border-[#201e18] flex items-center justify-center">
              <Search className="w-3 h-3 text-white/30" />
            </div>
            <div className="w-7 h-7 rounded-lg bg-[#191919] border border-[#201e18] flex items-center justify-center relative">
              <Bell className="w-3 h-3 text-white/30" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#ffe0c2]" />
            </div>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ffe0c2] to-[#ffdfb5] flex items-center justify-center text-[#111111] text-[9px] font-bold">
              MD
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-widest text-white/25 mb-0.5">Revenus ce mois</p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white">12&apos;450 CHF</span>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[9px] font-semibold border border-emerald-500/20">
              <TrendingUp className="w-2.5 h-2.5" />+18%
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          {([["all", "Tous"], ["reservations", "Réservations"], ["apports", "Apports"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors ${
                activeTab === key ? "bg-[#ffe0c2]/10 text-[#ffe0c2]" : "text-white/30 hover:text-white/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="rounded-lg bg-[#111111] border border-[#201e18] p-3">
          <div className="flex items-end justify-between gap-1.5 h-16">
            {barData.map((bar) => (
              <div key={bar.month} className="flex flex-col items-center gap-1 flex-1">
                <div
                  className="w-full rounded-t bg-gradient-to-t from-[#ffe0c2]/50 to-[#ffdfb5]/15 transition-all duration-500"
                  style={{ height: `${bar.h}%` }}
                />
                <span className="text-[7px] text-white/25">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Properties */}
        <div className="space-y-1.5">
          {properties.map((prop) => (
            <div key={prop.name} className="flex items-center justify-between rounded-lg bg-[#111111] border border-[#201e18] px-3 py-2">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-[#ffe0c2] text-[#ffe0c2]" />
                  <span className="text-[9px] text-white/40">{prop.rating}</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-white">{prop.name}</p>
                  <p className="text-[9px] text-white/25 flex items-center gap-1">
                    <MapPin className="w-2 h-2" />{prop.dates}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#ffe0c2]">{prop.price}</span>
                <span className={`text-[8px] font-medium px-1.5 py-0.5 rounded-full border ${prop.color}`}>
                  {prop.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] text-[#111111] text-[10px] font-semibold">
            <ArrowUpRight className="w-3 h-3" />Publier un bien
          </button>
          <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-[#201e18] text-white/50 text-[10px] font-medium hover:border-[#ffe0c2]/20 transition-colors">
            <ChevronRight className="w-3 h-3" />Voir tout
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedCrmDemoSection() {
  return (
    <div className="relative bg-[#111111]/85 text-white arch-bg-grid">
      <div className="max-w-7xl mx-auto py-32 px-6 md:px-12">
        <header className="text-left pb-12">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Des outils pensés pour l&apos;immobilier{" "}
            <span className="bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] bg-clip-text text-transparent">
              de nouvelle génération.
            </span>
          </h2>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-2 h-full">
          {/* Interactive Dashboard */}
          <Card className="lg:col-span-2 bg-[#191919] border-[#201e18] p-2 overflow-hidden relative mb-4 lg:mb-0 flex flex-col min-h-[500px]">
            <InteractiveDashboard />
          </Card>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 h-full">
            {features.map((feature, i) => (
              <div
                key={i}
                className="flex flex-col border border-[#201e18] rounded-xl p-2 hover:border-[#ffe0c2]/20 cursor-pointer transition-colors duration-300"
              >
                <Card className="bg-[#191919] border-[#201e18] flex-grow rounded-lg p-0" />
                <div className="mt-2">
                  <h3 className="text-sm font-medium text-white mb-1">{feature.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{feature.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-1 text-sm">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="p-3 flex items-center gap-3 hover:bg-[#191919] rounded-xl transition-colors duration-300 border border-transparent hover:border-[#201e18]"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ffe0c2]/20 to-[#ffdfb5]/5 border border-[#201e18] flex items-center justify-center shrink-0">
                <span className="text-[#ffe0c2] text-xs font-bold">
                  {integration.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="font-normal text-white">{integration.name}</div>
                <div className="text-xs text-white/40">{integration.subtitle}</div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
