"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/lib/context";
import type { Role, Transaction, MonthlyRevenue } from "@/lib/types";

// ─── Constants ──────────────────────────────────────────────────────────────

const REMUNERABLE_ROLES: Role[] = [
  "hote",
  "agence",
  "promoteur",
  "apporteur",
  "formateur",
  "proprietaire",
  "courtier",
];

const PERIODS = [
  { label: "7j", days: 7 },
  { label: "30j", days: 30 },
  { label: "90j", days: 90 },
  { label: "12m", days: 365 },
] as const;

// ─── Mock data ──────────────────────────────────────────────────────────────

const currentUser = {
  firstName: "Léo",
  lastName: "Martin",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
};

const kpiData = [
  {
    label: "Revenus",
    value: 12450,
    prev: 10800,
    isCurrency: true,
    sparkline: [8, 9, 10, 11, 10, 12, 12.4],
  },
  {
    label: "Réservations",
    value: 34,
    prev: 28,
    isCurrency: false,
    sparkline: [4, 5, 4, 6, 5, 7, 5],
  },
  {
    label: "Apports",
    value: 8200,
    prev: 6500,
    isCurrency: true,
    sparkline: [5, 6, 5.5, 7, 6.8, 8, 8.2],
  },
  {
    label: "Conversion",
    value: 78,
    prev: 72,
    isCurrency: false,
    suffix: "%",
    sparkline: [65, 68, 70, 72, 74, 76, 78],
  },
];

const mockRevenueData: MonthlyRevenue[] = [
  { month: "Jan", revenue: 3200, bookings: 5, occupancy: 70 },
  { month: "Fev", revenue: 4100, bookings: 7, occupancy: 75 },
  { month: "Mar", revenue: 3800, bookings: 6, occupancy: 72 },
  { month: "Avr", revenue: 5200, bookings: 9, occupancy: 85 },
  { month: "Mai", revenue: 4800, bookings: 8, occupancy: 80 },
  { month: "Juin", revenue: 6100, bookings: 11, occupancy: 90 },
  { month: "Juil", revenue: 7200, bookings: 14, occupancy: 95 },
  { month: "Aout", revenue: 6800, bookings: 12, occupancy: 92 },
  { month: "Sep", revenue: 5500, bookings: 9, occupancy: 82 },
  { month: "Oct", revenue: 4200, bookings: 7, occupancy: 76 },
  { month: "Nov", revenue: 3600, bookings: 6, occupancy: 68 },
  { month: "Dec", revenue: 4500, bookings: 8, occupancy: 78 },
];

const mockTransactions: Transaction[] = [
  { id: "t1", type: "payment", amount: 1200, currency: "CHF", status: "completed", description: "Reservation #R-2024-001", date: "2026-03-28", counterpart: "Jean Dupont" },
  { id: "t2", type: "payout", amount: 3500, currency: "CHF", status: "completed", description: "Virement mensuel", date: "2026-03-25" },
  { id: "t3", type: "commission", amount: 250, currency: "CHF", status: "pending", description: "Commission apporteur", date: "2026-03-22", counterpart: "Marie Leroy" },
  { id: "t4", type: "refund", amount: 800, currency: "CHF", status: "completed", description: "Annulation #R-2024-042", date: "2026-03-20", counterpart: "Paul Moreau" },
  { id: "t5", type: "payment", amount: 2100, currency: "CHF", status: "completed", description: "Reservation #R-2024-003", date: "2026-03-18", counterpart: "Sophie Martin" },
  { id: "t6", type: "commission", amount: 180, currency: "CHF", status: "completed", description: "Commission formation", date: "2026-03-15" },
];

const mockActivity = [
  { id: "a1", text: "Nouvelle reservation pour Chalet Alpin", href: "/reservations", time: "Il y a 2h" },
  { id: "a2", text: "Avis 5 etoiles de Jean D.", href: "/profil", time: "Il y a 5h" },
  { id: "a3", text: "Paiement de 1'200 CHF recu", href: "/dashboard", time: "Il y a 1j" },
  { id: "a4", text: "Nouvel abonne: Marie L.", href: "/profil", time: "Il y a 2j" },
  { id: "a5", text: "Formation \"Investir en Suisse\" publiee", href: "/formations", time: "Il y a 3j" },
];

const mockAppointments = [
  { id: "ap1", title: "Visite - Appartement Lausanne", date: "2026-04-03", time: "10:00" },
  { id: "ap2", title: "Signature - Villa Montreux", date: "2026-04-05", time: "14:30" },
  { id: "ap3", title: "Appel - Investisseur Dubai", date: "2026-04-07", time: "09:00" },
];

const shortcuts = [
  { label: "Publier", href: "/publier", icon: "+" },
  { label: "Créer formation", href: "/formations/creer", icon: "B" },
  { label: "Créer événement", href: "/evenements/creer", icon: "C" },
  { label: "Proposer service", href: "/services/proposer", icon: "S" },
  { label: "Statistiques", href: "/statistiques", icon: "G" },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function Sparkline({ data, color = "#C4956A" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");
  return (
    <svg width={w} height={h} className="flex-shrink-0">
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
    </svg>
  );
}

function getDateStr() {
  return new Date().toLocaleDateString("fr-CH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { activeRole } = useApp();

  if (activeRole === "client") {
    return <ClientDashboard />;
  }

  if (activeRole === "formateur") {
    return <FormateurDashboard />;
  }

  if (activeRole === "apporteur") {
    return <ApporteurDashboard />;
  }

  // Hote, agence, promoteur, proprietaire, courtier, and others get the full dashboard
  return <FullDashboard />;
}

// ─── Client Dashboard ──────────────────────────────────────────────────────

function ClientDashboard() {
  const [recentlyViewed, setRecentlyViewed] = useState<{ id: string; title: string; image: string }[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("edome_recently_viewed");
      if (stored) setRecentlyViewed(JSON.parse(stored));
    } catch {}
  }, []);

  const mockReservations = [
    { id: "r1", title: "Chalet Alpin - Verbier", date: "12-15 avr. 2026", status: "confirmed" },
    { id: "r2", title: "Appartement Vue Lac - Montreux", date: "28-30 avr. 2026", status: "pending" },
  ];

  const mockFormations = [
    { id: "f1", title: "Investir en Suisse", progress: 65 },
    { id: "f2", title: "Gestion locative avancee", progress: 30 },
    { id: "f3", title: "Droit immobilier", progress: 10 },
  ];

  const mockEvents = [
    { id: "e1", title: "Salon de l'immobilier - Geneve", date: "20 avr. 2026" },
    { id: "e2", title: "Webinaire investissement", date: "25 avr. 2026" },
  ];

  const suggestions = [
    { id: "s1", title: "Villa contemporaine - Lausanne", price: "1'250'000 CHF", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=200&h=150&fit=crop" },
    { id: "s2", title: "Studio meuble - Geneve", price: "1'800 CHF/mois", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&h=150&fit=crop" },
    { id: "s3", title: "Penthouse - Zurich", price: "2'800'000 CHF", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&h=150&fit=crop" },
  ];

  const statusColors: Record<string, string> = {
    confirmed: "text-emerald-400",
    pending: "text-amber-400",
    cancelled: "text-red-400",
  };
  const statusLabels: Record<string, string> = {
    confirmed: "Confirmee",
    pending: "En attente",
    cancelled: "Annulee",
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
            style={{ background: "var(--gold)", color: "#000" }}
          >
            {currentUser.firstName.charAt(0)}{currentUser.lastName.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">
              Bonjour, {currentUser.firstName}
            </h1>
            <p className="text-sm text-[var(--text-muted)] capitalize">{getDateStr()}</p>
          </div>
        </div>
      </div>

      {/* Prochaines reservations */}
      <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Prochaines reservations</h2>
          <Link href="/reservations" className="text-sm text-[#C4956A] hover:underline">Voir tout</Link>
        </div>
        {mockReservations.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">Aucune reservation a venir.</p>
        ) : (
          <div className="space-y-3">
            {mockReservations.map((r) => (
              <Link
                key={r.id}
                href="/reservations"
                className="flex items-center justify-between py-3 px-3 -mx-1 rounded-lg hover:bg-[var(--hover-bg)] transition-colors"
              >
                <div>
                  <div className="text-sm font-medium text-[var(--foreground)]">{r.title}</div>
                  <div className="text-xs text-[var(--text-muted)]">{r.date}</div>
                </div>
                <span className={`text-xs font-medium ${statusColors[r.status] || "text-[var(--text-muted)]"}`}>
                  {statusLabels[r.status] || r.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Formations en cours */}
      <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Formations en cours</h2>
          <Link href="/formations" className="text-sm text-[#C4956A] hover:underline">Voir tout</Link>
        </div>
        <div className="space-y-4">
          {mockFormations.map((f) => (
            <div key={f.id}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-[var(--foreground)]">{f.title}</span>
                <span className="text-xs text-[var(--text-muted)]">{f.progress}%</span>
              </div>
              <div className="w-full h-2 bg-[var(--input-bg)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#C4956A] transition-all duration-500"
                  style={{ width: `${f.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Événements inscrits */}
      <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Événements inscrits</h2>
          <Link href="/evenements" className="text-sm text-[#C4956A] hover:underline">Voir tout</Link>
        </div>
        <div className="space-y-3">
          {mockEvents.map((e) => (
            <div key={e.id} className="flex items-center gap-4 py-2 border-b border-[var(--card-border)] last:border-0">
              <div className="w-10 h-10 rounded-lg bg-[#C4956A]/10 flex items-center justify-center shrink-0">
                <span className="text-sm text-[#C4956A] font-semibold">E</span>
              </div>
              <div>
                <div className="text-sm text-[var(--foreground)]">{e.title}</div>
                <div className="text-xs text-[var(--text-muted)]">{e.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Biens recemment consultes */}
      {recentlyViewed.length > 0 && (
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Biens recemment consultes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recentlyViewed.slice(0, 3).map((item) => (
              <Link key={item.id} href={`/explorer/${item.id}`} className="rounded-lg overflow-hidden border border-[var(--card-border)] hover:border-[#C4956A]/50 transition-colors">
                <img src={item.image} alt={item.title} className="w-full h-28 object-cover" />
                <div className="p-3">
                  <span className="text-sm text-[var(--foreground)]">{item.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Suggestions de biens</h2>
          <Link href="/explorer" className="text-sm text-[#C4956A] hover:underline">Explorer</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {suggestions.map((s) => (
            <Link key={s.id} href="/explorer" className="rounded-lg overflow-hidden border border-[var(--card-border)] hover:border-[#C4956A]/50 transition-colors">
              <img src={s.image} alt={s.title} className="w-full h-32 object-cover" />
              <div className="p-3">
                <div className="text-sm font-medium text-[var(--foreground)]">{s.title}</div>
                <div className="text-xs text-[#C4956A] mt-1">{s.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Mes favoris", href: "/favoris", icon: "F" },
          { label: "Mes reservations", href: "/reservations", icon: "R" },
          { label: "Explorer", href: "/explorer", icon: "E" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6 text-center hover:border-[#C4956A]/50 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-[#C4956A]/10 flex items-center justify-center mx-auto mb-3">
              <span className="text-lg text-[#C4956A] font-bold">{item.icon}</span>
            </div>
            <span className="text-[var(--foreground)] font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Formateur Dashboard ───────────────────────────────────────────────────

function FormateurDashboard() {
  const { formatPrice } = useApp();

  const stats = {
    revenusFormations: 4200,
    nouveauxInscrits: 18,
    totalEtudiants: 156,
    noteMoyenne: 4.7,
  };

  const topFormations = [
    { id: "tf1", title: "Investir en Suisse", rating: 4.9, students: 68, revenue: 12400 },
    { id: "tf2", title: "Gestion locative avancee", rating: 4.7, students: 45, revenue: 8100 },
    { id: "tf3", title: "Droit immobilier suisse", rating: 4.6, students: 32, revenue: 5760 },
  ];

  const prochainLive = {
    title: "Masterclass: Optimisation fiscale immobiliere",
    date: "8 avril 2026",
    time: "19:00",
    inscrits: 42,
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt=""
            className="w-14 h-14 rounded-full object-cover border-2 border-[#C4956A]"
          />
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">
              Bonjour, {currentUser.firstName}
            </h1>
            <p className="text-sm text-[var(--text-muted)] capitalize">{getDateStr()}</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
          <span className="text-sm text-[var(--text-muted)]">Revenus formations du mois</span>
          <div className="text-2xl font-bold text-[var(--foreground)] mt-2">{formatPrice(stats.revenusFormations)}</div>
        </div>
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
          <span className="text-sm text-[var(--text-muted)]">Nouveaux inscrits (7j)</span>
          <div className="text-2xl font-bold text-[var(--foreground)] mt-2">{stats.nouveauxInscrits}</div>
        </div>
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
          <span className="text-sm text-[var(--text-muted)]">Total etudiants</span>
          <div className="text-2xl font-bold text-[var(--foreground)] mt-2">{stats.totalEtudiants}</div>
        </div>
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
          <span className="text-sm text-[var(--text-muted)]">Note moyenne</span>
          <div className="text-2xl font-bold text-[var(--foreground)] mt-2">{stats.noteMoyenne}/5</div>
        </div>
      </div>

      {/* Prochain live */}
      <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Prochain live programme</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-[var(--foreground)]">{prochainLive.title}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">{prochainLive.date} a {prochainLive.time}</div>
            <div className="text-xs text-emerald-400 mt-1">{prochainLive.inscrits} inscrits</div>
          </div>
          <Link
            href="/live"
            className="px-4 py-2 text-sm rounded-lg bg-[#C4956A] text-white hover:bg-[#b8845a] transition-colors"
          >
            Gerer
          </Link>
        </div>
      </div>

      {/* Formations les mieux notees */}
      <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Formations les mieux notees</h2>
          <Link href="/formations" className="text-sm text-[#C4956A] hover:underline">Voir tout</Link>
        </div>
        <div className="space-y-3">
          {topFormations.map((f, idx) => (
            <div
              key={f.id}
              className="flex items-center justify-between py-3 border-b border-[var(--card-border)] last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#C4956A]/10 flex items-center justify-center text-sm font-bold text-[#C4956A]">
                  {idx + 1}
                </div>
                <div>
                  <div className="text-sm font-medium text-[var(--foreground)]">{f.title}</div>
                  <div className="text-xs text-[var(--text-muted)]">{f.students} etudiants</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-[var(--foreground)]">{f.rating}/5</div>
                <div className="text-xs text-[var(--text-muted)]">{formatPrice(f.revenue)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Apporteur Dashboard ───────────────────────────────────────────────────

function ApporteurDashboard() {
  const { formatPrice } = useApp();

  const stats = {
    commissionsTotal: 3850,
    reservationsApportees: 24,
    tauxConversion: 18,
    classement: 5,
  };

  const trackingLinks = [
    { id: "tl1", label: "Lien principal", url: "https://e-dome.ch/r/LEO2026", clicks: 142, conversions: 8 },
    { id: "tl2", label: "Campagne Instagram", url: "https://e-dome.ch/r/LEO-IG", clicks: 87, conversions: 3 },
    { id: "tl3", label: "Newsletter", url: "https://e-dome.ch/r/LEO-NL", clicks: 56, conversions: 2 },
  ];

  const leaderboard = [
    { rank: 1, name: "Sophie M.", commissions: 8200 },
    { rank: 2, name: "Thomas R.", commissions: 6700 },
    { rank: 3, name: "Julie K.", commissions: 5400 },
    { rank: 4, name: "Marc D.", commissions: 4100 },
    { rank: 5, name: "Leo M. (vous)", commissions: 3850, isUser: true },
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt=""
            className="w-14 h-14 rounded-full object-cover border-2 border-[#C4956A]"
          />
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">
              Bonjour, {currentUser.firstName}
            </h1>
            <p className="text-sm text-[var(--text-muted)] capitalize">{getDateStr()}</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
          <span className="text-sm text-[var(--text-muted)]">Commissions totales</span>
          <div className="text-2xl font-bold text-[var(--foreground)] mt-2">{formatPrice(stats.commissionsTotal)}</div>
        </div>
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
          <span className="text-sm text-[var(--text-muted)]">Reservations apportees</span>
          <div className="text-2xl font-bold text-[var(--foreground)] mt-2">{stats.reservationsApportees}</div>
        </div>
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
          <span className="text-sm text-[var(--text-muted)]">Taux de conversion</span>
          <div className="text-2xl font-bold text-[var(--foreground)] mt-2">{stats.tauxConversion}%</div>
        </div>
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
          <span className="text-sm text-[var(--text-muted)]">Classement</span>
          <div className="text-2xl font-bold text-[#C4956A] mt-2">#{stats.classement}</div>
        </div>
      </div>

      {/* Liens de tracking */}
      <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Liens de tracking</h2>
        <div className="space-y-3">
          {trackingLinks.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between py-3 border-b border-[var(--card-border)] last:border-0"
            >
              <div>
                <div className="text-sm font-medium text-[var(--foreground)]">{link.label}</div>
                <div className="text-xs text-[var(--text-muted)] font-mono">{link.url}</div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div>
                  <div className="text-sm text-[var(--foreground)]">{link.clicks}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">clics</div>
                </div>
                <div>
                  <div className="text-sm text-emerald-400">{link.conversions}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">conv.</div>
                </div>
                <button
                  onClick={() => navigator.clipboard?.writeText(link.url)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
                >
                  Copier
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Classement performance */}
      <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Classement performance</h2>
        <div className="space-y-2">
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className={`flex items-center justify-between py-3 px-3 rounded-lg ${
                entry.isUser ? "bg-[#C4956A]/10 border border-[#C4956A]/30" : "border-b border-[var(--card-border)] last:border-0"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    entry.rank <= 3 ? "bg-[#C4956A]/20 text-[#C4956A]" : "bg-[var(--input-bg)] text-[var(--text-muted)]"
                  }`}
                >
                  {entry.rank}
                </div>
                <span className={`text-sm ${entry.isUser ? "font-semibold text-[#C4956A]" : "text-[var(--foreground)]"}`}>
                  {entry.name}
                </span>
              </div>
              <span className="text-sm font-medium text-[var(--foreground)]">{formatPrice(entry.commissions)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Full Dashboard (Hote, Agence, etc.) ───────────────────────────────────

function FullDashboard() {
  const { formatPrice } = useApp();
  const [period, setPeriod] = useState<string>("30j");
  const [txFilter, setTxFilter] = useState<string>("all");
  const [showInvite, setShowInvite] = useState(false);
  const [goals, setGoals] = useState<{ label: string; target: number; current: number }[]>([
    { label: "Revenus mensuels", target: 10000, current: 6800 },
    { label: "Reservations", target: 20, current: 14 },
    { label: "Note moyenne", target: 5, current: 4.8 },
  ]);
  const [editGoalIdx, setEditGoalIdx] = useState<number | null>(null);
  const [editGoalVal, setEditGoalVal] = useState("");
  const [tooltipIdx, setTooltipIdx] = useState<number | null>(null);

  // Load goals from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("edome_goals");
      if (saved) setGoals(JSON.parse(saved));
    } catch {}
  }, []);

  const saveGoal = useCallback(
    (idx: number) => {
      const val = parseFloat(editGoalVal);
      if (!isNaN(val) && val > 0) {
        const updated = goals.map((g, i) => (i === idx ? { ...g, target: val } : g));
        setGoals(updated);
        localStorage.setItem("edome_goals", JSON.stringify(updated));
      }
      setEditGoalIdx(null);
    },
    [editGoalVal, goals]
  );

  const filteredTx = useMemo(() => {
    if (txFilter === "all") return mockTransactions;
    return mockTransactions.filter((t) => t.type === txFilter);
  }, [txFilter]);

  // Revenue chart dimensions
  const chartMax = Math.max(...mockRevenueData.map((d) => d.revenue));

  const exportCSV = useCallback(() => {
    const header = "Mois,Revenus,Reservations,Occupation\n";
    const rows = mockRevenueData
      .map((d) => `${d.month},${d.revenue},${d.bookings},${d.occupancy}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "edome-dashboard.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const txTypeLabels: Record<string, string> = {
    payment: "Paiement",
    payout: "Virement",
    commission: "Commission",
    refund: "Remboursement",
  };

  const txStatusColors: Record<string, string> = {
    completed: "text-emerald-400",
    pending: "text-amber-400",
    failed: "text-red-400",
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt=""
            className="w-14 h-14 rounded-full object-cover border-2 border-[#C4956A]"
          />
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">
              Bonjour, {currentUser.firstName}
            </h1>
            <p className="text-sm text-[var(--text-muted)] capitalize">{getDateStr()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="px-4 py-2 text-sm rounded-lg border border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
          >
            Exporter CSV
          </button>
          <button
            onClick={() => setShowInvite(true)}
            className="px-4 py-2 text-sm rounded-lg bg-[#C4956A] text-white hover:bg-[#b8845a] transition-colors"
          >
            Inviter
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => {
          const change = kpi.prev > 0 ? ((kpi.value - kpi.prev) / kpi.prev) * 100 : 0;
          const isUp = change >= 0;
          return (
            <div
              key={kpi.label}
              className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-[var(--text-muted)]">{kpi.label}</span>
                <Sparkline data={kpi.sparkline} />
              </div>
              <div className="text-2xl font-bold text-[var(--foreground)]">
                {kpi.isCurrency ? formatPrice(kpi.value) : kpi.value}
                {kpi.suffix || ""}
              </div>
              <div className={`text-xs mt-1 ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                {isUp ? "+" : ""}
                {change.toFixed(1)}% vs periode precedente
              </div>
            </div>
          );
        })}
      </div>

      {/* Goals */}
      <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Mes objectifs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map((goal, idx) => {
            const pct = Math.min((goal.current / goal.target) * 100, 100);
            return (
              <div key={goal.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">{goal.label}</span>
                  <button
                    onClick={() => {
                      setEditGoalIdx(idx);
                      setEditGoalVal(String(goal.target));
                    }}
                    className="text-xs text-[var(--text-muted)] hover:text-[#C4956A]"
                  >
                    Modifier
                  </button>
                </div>
                {editGoalIdx === idx ? (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={editGoalVal}
                      onChange={(e) => setEditGoalVal(e.target.value)}
                      className="flex-1 px-3 py-1 text-sm rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)]"
                    />
                    <button
                      onClick={() => saveGoal(idx)}
                      className="px-3 py-1 text-sm rounded-lg bg-[#C4956A] text-white"
                    >
                      OK
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-full h-2 bg-[var(--input-bg)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#C4956A] transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      {goal.current} / {goal.target} ({pct.toFixed(0)}%)
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue Chart + Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-3 bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Revenus</h2>
            <div className="flex gap-1 bg-[var(--input-bg)] rounded-lg p-1">
              {PERIODS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setPeriod(p.label)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    period === p.label
                      ? "bg-[#C4956A] text-white"
                      : "text-[var(--text-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-2 h-48 relative">
            {mockRevenueData.map((d, i) => {
              const h = (d.revenue / chartMax) * 100;
              return (
                <div
                  key={d.month}
                  className="flex-1 flex flex-col items-center justify-end relative"
                  onMouseEnter={() => setTooltipIdx(i)}
                  onMouseLeave={() => setTooltipIdx(null)}
                >
                  {tooltipIdx === i && (
                    <div className="absolute -top-14 bg-[var(--foreground)] text-[var(--background)] text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-10">
                      {formatPrice(d.revenue)} - {d.bookings} res.
                    </div>
                  )}
                  <div
                    className="w-full rounded-t-md bg-[#C4956A]/80 hover:bg-[#C4956A] transition-colors cursor-pointer"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[10px] text-[var(--text-muted)] mt-1">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transactions */}
        <div className="lg:col-span-2 bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Transactions</h2>
            <select
              value={txFilter}
              onChange={(e) => setTxFilter(e.target.value)}
              className="text-xs px-2 py-1 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--text-secondary)]"
            >
              <option value="all">Tout</option>
              <option value="payment">Paiements</option>
              <option value="payout">Virements</option>
              <option value="commission">Commissions</option>
              <option value="refund">Remboursements</option>
            </select>
          </div>
          <div className="space-y-3 max-h-[220px] overflow-y-auto">
            {filteredTx.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-2 border-b border-[var(--card-border)] last:border-0"
              >
                <div>
                  <div className="text-sm text-[var(--foreground)]">{tx.description}</div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {txTypeLabels[tx.type]} - {tx.date}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-medium ${
                      tx.type === "refund" ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    {tx.type === "refund" ? "-" : "+"}
                    {formatPrice(tx.amount)}
                  </div>
                  <div className={`text-xs ${txStatusColors[tx.status]}`}>
                    {tx.status === "completed" ? "Termine" : tx.status === "pending" ? "En attente" : "Echoue"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity + Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity */}
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Activite recente</h2>
          <div className="space-y-3">
            {mockActivity.map((a) => (
              <Link
                key={a.id}
                href={a.href}
                className="flex items-center justify-between py-2 border-b border-[var(--card-border)] last:border-0 hover:bg-[var(--hover-bg)] px-2 -mx-2 rounded-lg transition-colors"
              >
                <span className="text-sm text-[var(--foreground)]">{a.text}</span>
                <span className="text-xs text-[var(--text-muted)] whitespace-nowrap ml-3">{a.time}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Appointments */}
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Prochains rendez-vous</h2>
          <div className="space-y-3">
            {mockAppointments.map((ap) => (
              <div
                key={ap.id}
                className="flex items-center gap-4 py-2 border-b border-[var(--card-border)] last:border-0"
              >
                <div className="w-12 h-12 rounded-lg bg-[#C4956A]/10 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-xs text-[#C4956A] font-medium">
                    {new Date(ap.date).toLocaleDateString("fr-CH", { day: "numeric" })}
                  </span>
                  <span className="text-[10px] text-[#C4956A]">
                    {new Date(ap.date).toLocaleDateString("fr-CH", { month: "short" })}
                  </span>
                </div>
                <div>
                  <div className="text-sm text-[var(--foreground)]">{ap.title}</div>
                  <div className="text-xs text-[var(--text-muted)]">{ap.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Raccourcis</h2>
        <div className="flex flex-wrap gap-3">
          {shortcuts.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--card-border)] hover:border-[#C4956A]/50 text-sm text-[var(--foreground)] transition-colors"
            >
              <span className="w-6 h-6 rounded bg-[#C4956A]/10 flex items-center justify-center text-xs text-[#C4956A] font-bold">{s.icon}</span>
              <span>{s.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Invite modal */}
      {showInvite && (
        <div
          className="fixed inset-0 bg-[var(--overlay)] flex items-center justify-center z-50 p-4"
          onClick={() => setShowInvite(false)}
        >
          <div
            className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 w-full max-w-md animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              Inviter un contact
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Partagez votre lien de parrainage et gagnez des commissions sur les revenus generes.
            </p>
            <div className="flex gap-2 mb-4">
              <input
                readOnly
                value="https://e-dome.ch/invite/LEO2026"
                className="flex-1 px-3 py-2 text-sm rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)]"
              />
              <button
                onClick={() => navigator.clipboard?.writeText("https://e-dome.ch/invite/LEO2026")}
                className="px-4 py-2 text-sm rounded-lg bg-[#C4956A] text-white hover:bg-[#b8845a]"
              >
                Copier
              </button>
            </div>
            <button
              onClick={() => setShowInvite(false)}
              className="w-full py-2 text-sm rounded-lg border border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
