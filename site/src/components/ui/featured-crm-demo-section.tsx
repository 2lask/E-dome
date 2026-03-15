"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
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
    title: "Marketplace int\u00e9gr\u00e9e",
    subtitle: "Location courte et longue dur\u00e9e, vente \u2014 tout dans un parcours unique avec des commissions 40-60% inf\u00e9rieures aux plateformes traditionnelles.",
  },
  {
    title: "R\u00e9seau social immobilier",
    subtitle: "Publiez des reels, stories et contenus pour b\u00e2tir votre audience. Visibilit\u00e9 organique gratuite, sans budget publicitaire.",
  },
  {
    title: "Syst\u00e8me d\u2019apporteurs",
    subtitle: "Liens tra\u00e7ables, commissions automatiques, dashboard en temps r\u00e9el. Le bouche-\u00e0-oreille devient mesurable et r\u00e9mun\u00e9r\u00e9.",
  },
  {
    title: "Formations & services",
    subtitle: "Catalogue de formations, webinars d\u2019experts, et services additionnels int\u00e9gr\u00e9s directement \u00e0 chaque bien.",
  },
];

const sidebarItems = [
  { icon: Home, label: "Accueil", active: false },
  { icon: BarChart3, label: "Analytics", active: true },
  { icon: Calendar, label: "Calendrier", active: false },
  { icon: Users, label: "R\u00e9seau", active: false },
  { icon: Settings, label: "R\u00e9glages", active: false },
];

const properties = [
  { name: "Chalet Verbier", dates: "12\u201317 mars", status: "Confirm\u00e9e", color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/20", price: "3\u2019200 CHF", rating: 4.8 },
  { name: "Apt. Lausanne", dates: "20\u201323 mars", status: "En attente", color: "text-amber-400 bg-amber-500/15 border-amber-500/20", price: "1\u2019450 CHF", rating: 4.5 },
  { name: "Villa Montreux", dates: "28\u201331 mars", status: "Confirm\u00e9e", color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/20", price: "4\u2019800 CHF", rating: 4.9 },
];

const barData = [
  { month: "Oct", h: 30 },
  { month: "Nov", h: 42 },
  { month: "D\u00e9c", h: 38 },
  { month: "Jan", h: 55 },
  { month: "F\u00e9v", h: 65 },
  { month: "Mar", h: 88 },
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
          {([["all", "Tous"], ["reservations", "R\u00e9servations"], ["apports", "Apports"]] as const).map(([key, label]) => (
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
            {barData.map((bar, i) => (
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
    <div className="max-w-7xl mx-auto bg-[#111111] text-white">
      <header className="text-left py-12">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Des outils pens\u00e9s pour l&apos;immobilier. <br />
          <span className="bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] bg-clip-text text-transparent">
            de nouvelle g\u00e9n\u00e9ration.
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
        {[
          { name: "Stripe", subtitle: "Paiements s\u00e9curis\u00e9s", domain: "stripe.com" },
          { name: "Twilio", subtitle: "Communications", domain: "twilio.com" },
          { name: "Google Maps", subtitle: "G\u00e9olocalisation", domain: "google.com" },
          { name: "Cloudinary", subtitle: "M\u00e9dias optimis\u00e9s", domain: "cloudinary.com" },
          { name: "Veriff", subtitle: "V\u00e9rification KYC", domain: "veriff.com" },
          { name: "SendGrid", subtitle: "Notifications email", domain: "sendgrid.com" },
          { name: "Intercom", subtitle: "Support client", domain: "intercom.com" },
          { name: "Mixpanel", subtitle: "Analytics avanc\u00e9es", domain: "mixpanel.com" },
        ].map((integration) => (
          <div
            key={integration.name}
            className="p-3 flex items-center gap-3 hover:bg-[#191919] rounded-xl transition-colors duration-300"
          >
            <Image
              src={`https://logo.clearbit.com/${integration.domain}`}
              alt={integration.name}
              width={40}
              height={40}
              className="w-10 h-10 object-contain rounded-xl bg-white p-1"
            />
            <div>
              <div className="font-normal text-white">{integration.name}</div>
              <div className="text-xs text-white/40">{integration.subtitle}</div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
