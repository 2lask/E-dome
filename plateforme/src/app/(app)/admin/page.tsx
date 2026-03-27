"use client";

import { useState } from "react";
import {
  Users,
  Building2,
  AlertTriangle,
  DollarSign,
  Search,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Ban,
  Shield,
  Eye,
  ToggleLeft,
  ToggleRight,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/context";
import { motion } from "framer-motion";

// ─── KPI Data ─────────────────────────────────────────────
const adminKpis = [
  { label: "Utilisateurs", value: "8'240", trend: "+124 ce mois", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
  { label: "Biens actifs", value: "1'847", trend: "+38 ce mois", icon: Building2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { label: "Signalements", value: "12", trend: "3 urgents", icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-400/10" },
  { label: "Revenue", valueNum: 378000, trend: "+12.3% vs mois dernier", icon: DollarSign, color: "text-[#C4956A]", bg: "bg-[#C4956A]/10" },
];

// ─── Mock Users ───────────────────────────────────────────
const mockUsers = [
  { id: "1", initials: "KB", name: "Karim Benali", email: "karim@edome.ch", role: "Admin", date: "2024-01-15", status: "actif" },
  { id: "2", initials: "SL", name: "Sophie Laurent", email: "sophie@edome.ch", role: "Propriétaire", date: "2024-02-20", status: "actif" },
  { id: "3", initials: "MR", name: "Marc Rousseau", email: "marc@edome.ch", role: "Hôte", date: "2024-03-10", status: "actif" },
  { id: "4", initials: "AL", name: "Anna Lehmann", email: "anna@edome.ch", role: "Client", date: "2024-03-22", status: "suspendu" },
  { id: "5", initials: "PT", name: "Pierre Tran", email: "pierre@edome.ch", role: "Agence", date: "2024-04-05", status: "actif" },
  { id: "6", initials: "LM", name: "Laura Müller", email: "laura@edome.ch", role: "Formateur", date: "2024-04-18", status: "actif" },
  { id: "7", initials: "DW", name: "David Weber", email: "david@edome.ch", role: "Apporteur", date: "2024-05-02", status: "actif" },
  { id: "8", initials: "NF", name: "Nadia Fischer", email: "nadia@edome.ch", role: "Investisseur", date: "2024-05-15", status: "vérifié" },
  { id: "9", initials: "RK", name: "Romain Keller", email: "romain@edome.ch", role: "Promoteur", date: "2024-06-01", status: "actif" },
  { id: "10", initials: "CB", name: "Clara Brunner", email: "clara@edome.ch", role: "Client", date: "2024-06-12", status: "inactif" },
];

// ─── Mock Properties ─────────────────────────────────────
const mockProperties = [
  { id: "1", title: "Penthouse Vue Lac Léman", owner: "Sophie Laurent", type: "Penthouse", priceNum: 2450000, status: "en attente" },
  { id: "2", title: "Villa Moderne Lausanne", owner: "Marc Rousseau", type: "Villa", priceNum: 1890000, status: "en attente" },
  { id: "3", title: "Studio Centre Genève", owner: "Pierre Tran", type: "Studio", priceNum: 520000, status: "approuvé" },
  { id: "4", title: "Chalet Verbier Premium", owner: "Karim Benali", type: "Chalet", priceNum: 3200000, status: "approuvé" },
  { id: "5", title: "Loft Industriel Zürich", owner: "David Weber", type: "Loft", priceNum: 875000, status: "rejeté" },
  { id: "6", title: "Appartement Neuchâtel", owner: "Nadia Fischer", type: "Appartement", priceNum: 680000, status: "en attente" },
];

// ─── Mock Signalements ───────────────────────────────────
const mockReports = [
  { id: "1", type: "Contenu", reason: "Photos trompeuses sur annonce", reporter: "Laura Müller", target: "Villa Moderne Lausanne", date: "Il y a 2h", urgent: true },
  { id: "2", type: "Utilisateur", reason: "Comportement inapproprié en messagerie", reporter: "Clara Brunner", target: "David Weber", date: "Il y a 5h", urgent: false },
  { id: "3", type: "Arnaque", reason: "Demande de paiement hors plateforme", reporter: "Romain Keller", target: "Anna Lehmann", date: "Il y a 1j", urgent: true },
  { id: "4", type: "Contenu", reason: "Description mensongère de surface", reporter: "Nadia Fischer", target: "Studio Centre Genève", date: "Il y a 1j", urgent: false },
  { id: "5", type: "Spam", reason: "Publication de liens suspects", reporter: "Marc Rousseau", target: "User #4521", date: "Il y a 2j", urgent: false },
  { id: "6", type: "Utilisateur", reason: "Usurpation d'identité professionnelle", reporter: "Sophie Laurent", target: "Pierre Tran", date: "Il y a 3j", urgent: true },
];

const tabs = ["Utilisateurs", "Biens", "Signalements", "Paramètres"] as const;
type Tab = (typeof tabs)[number];

const statusColors: Record<string, string> = {
  actif: "bg-emerald-500/10 text-emerald-400",
  suspendu: "bg-red-500/10 text-red-400",
  inactif: "bg-white/[0.06] text-white/40",
  "vérifié": "bg-blue-500/10 text-blue-400",
  "en attente": "bg-yellow-500/10 text-yellow-400",
  "approuvé": "bg-emerald-500/10 text-emerald-400",
  "rejeté": "bg-red-500/10 text-red-400",
};

export default function AdminPage() {
  const { availableRoles, formatPrice } = useApp();
  const REQUIRED_ROLES = ['agence'];
  const hasAccess = REQUIRED_ROLES.some(r => availableRoles.includes(r as any));

  const [activeTab, setActiveTab] = useState<Tab>("Utilisateurs");
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyStatuses, setPropertyStatuses] = useState<Record<string, string>>({});
  const [reportStatuses, setReportStatuses] = useState<Record<string, string>>({});
  const [commissionVente, setCommissionVente] = useState("2.5");
  const [commissionLocation, setCommissionLocation] = useState("8");
  const [commissionApporteur, setCommissionApporteur] = useState("1.5");
  const [maintenance, setMaintenance] = useState(false);

  const getPropertyStatus = (id: string, original: string) => propertyStatuses[id] || original;
  const getReportStatus = (id: string) => reportStatuses[id];

  const filteredUsers = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <Lock className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">Accès restreint</h2>
          <p className="text-[var(--text-secondary)] text-sm mb-6">Cette page est réservée aux agences. Activez ce rôle dans vos paramètres.</p>
          <Link href="/parametres" className="px-6 py-2.5 rounded-xl bg-[#C4956A] text-black font-semibold">Gérer mes rôles</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#C4956A]/10 p-2.5">
            <Shield className="h-6 w-6 text-[#C4956A]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Administration</h1>
            <p className="text-sm text-white/50">Gestion et modération de la plateforme</p>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminKpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-white/[0.06] bg-[#0e0e0e] p-5"
          >
            <div className="flex items-center justify-between">
              <div className={cn("rounded-xl p-2.5", kpi.bg)}>
                <kpi.icon className={cn("h-5 w-5", kpi.color)} />
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold">{'valueNum' in kpi && kpi.valueNum ? formatPrice(kpi.valueNum) : kpi.value}</p>
            <p className="mt-1 text-sm text-white/40">{kpi.label}</p>
            <p className="mt-1 text-xs text-white/30">{kpi.trend}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto rounded-xl border border-white/[0.06] bg-[#080808] p-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all",
              activeTab === tab
                ? "bg-[#C4956A]/20 text-[#C4956A]"
                : "text-white/40 hover:text-white/70"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* ─── Utilisateurs ────────────────────────────────── */}
        {activeTab === "Utilisateurs" && (
          <div className="rounded-2xl border border-white/[0.06] bg-[#0e0e0e] p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold">Gestion des utilisateurs</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.06] bg-[#080808] py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none focus:border-[#C4956A]/30 sm:w-72"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] text-left text-xs text-white/40">
                    <th className="pb-3 font-medium">Utilisateur</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Rôle</th>
                    <th className="pb-3 font-medium">Inscription</th>
                    <th className="pb-3 font-medium">Statut</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#C4956A] to-[#D4A574] text-xs font-bold text-black">
                            {user.initials}
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-white/60">{user.email}</td>
                      <td className="py-3">
                        <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-white/70">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 text-white/60">{user.date}</td>
                      <td className="py-3">
                        <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", statusColors[user.status])}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <button className="rounded-lg p-1.5 text-white/30 transition hover:bg-white/[0.05] hover:text-white" title="Voir">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="rounded-lg p-1.5 text-white/30 transition hover:bg-white/[0.05] hover:text-white" title="Plus">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── Biens ───────────────────────────────────────── */}
        {activeTab === "Biens" && (
          <div className="rounded-2xl border border-white/[0.06] bg-[#0e0e0e] p-6">
            <h2 className="mb-6 text-lg font-semibold">Modération des biens</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] text-left text-xs text-white/40">
                    <th className="pb-3 font-medium">Bien</th>
                    <th className="pb-3 font-medium">Propriétaire</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Prix</th>
                    <th className="pb-3 font-medium">Statut</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockProperties.map((prop) => {
                    const status = getPropertyStatus(prop.id, prop.status);
                    return (
                      <tr key={prop.id} className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-14 rounded-lg bg-gradient-to-br from-white/[0.06] to-white/[0.02]" />
                            <span className="font-medium">{prop.title}</span>
                          </div>
                        </td>
                        <td className="py-3 text-white/60">{prop.owner}</td>
                        <td className="py-3 text-white/60">{prop.type}</td>
                        <td className="py-3 font-medium text-[#C4956A]">{formatPrice(prop.priceNum)}</td>
                        <td className="py-3">
                          <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", statusColors[status])}>
                            {status}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1.5">
                            {status === "en attente" && (
                              <>
                                <button
                                  onClick={() => setPropertyStatuses((s) => ({ ...s, [prop.id]: "approuvé" }))}
                                  className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/20"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Approuver
                                </button>
                                <button
                                  onClick={() => setPropertyStatuses((s) => ({ ...s, [prop.id]: "rejeté" }))}
                                  className="flex items-center gap-1 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/20"
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                  Rejeter
                                </button>
                              </>
                            )}
                            {status !== "en attente" && (
                              <span className="text-xs text-white/30">Traité</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── Signalements ────────────────────────────────── */}
        {activeTab === "Signalements" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Signalements en cours</h2>
            {mockReports.map((report) => {
              const handled = getReportStatus(report.id);
              return (
                <div
                  key={report.id}
                  className={cn(
                    "rounded-2xl border bg-[#0e0e0e] p-5 transition",
                    report.urgent ? "border-orange-500/20" : "border-white/[0.06]"
                  )}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-medium",
                          report.type === "Arnaque" ? "bg-red-500/10 text-red-400" :
                          report.type === "Spam" ? "bg-purple-500/10 text-purple-400" :
                          report.type === "Utilisateur" ? "bg-blue-500/10 text-blue-400" :
                          "bg-orange-500/10 text-orange-400"
                        )}>
                          {report.type}
                        </span>
                        {report.urgent && (
                          <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-bold text-red-400">
                            Urgent
                          </span>
                        )}
                        <span className="text-xs text-white/30">{report.date}</span>
                      </div>
                      <p className="font-medium">{report.reason}</p>
                      <div className="mt-2 flex flex-wrap gap-x-4 text-xs text-white/40">
                        <span>Cible : <span className="text-white/60">{report.target}</span></span>
                        <span>Signalé par : <span className="text-white/60">{report.reporter}</span></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {handled ? (
                        <span className={cn(
                          "rounded-full px-3 py-1.5 text-xs font-medium",
                          handled === "traité" ? "bg-emerald-500/10 text-emerald-400" :
                          handled === "ignoré" ? "bg-white/[0.06] text-white/40" :
                          "bg-red-500/10 text-red-400"
                        )}>
                          {handled === "traité" ? "Traité" : handled === "ignoré" ? "Ignoré" : "Banni"}
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => setReportStatuses((s) => ({ ...s, [report.id]: "traité" }))}
                            className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/20"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Traiter
                          </button>
                          <button
                            onClick={() => setReportStatuses((s) => ({ ...s, [report.id]: "ignoré" }))}
                            className="flex items-center gap-1 rounded-lg bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/50 transition hover:bg-white/[0.1]"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Ignorer
                          </button>
                          <button
                            onClick={() => setReportStatuses((s) => ({ ...s, [report.id]: "banni" }))}
                            className="flex items-center gap-1 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/20"
                          >
                            <Ban className="h-3.5 w-3.5" />
                            Bannir
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── Paramètres ──────────────────────────────────── */}
        {activeTab === "Paramètres" && (
          <div className="space-y-6">
            {/* Commission Rates */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0e0e0e] p-6">
              <h2 className="mb-6 text-lg font-semibold">Taux de commission</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm text-white/50">Commission vente (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={commissionVente}
                    onChange={(e) => setCommissionVente(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.06] bg-[#080808] px-4 py-2.5 text-sm text-white outline-none focus:border-[#C4956A]/30"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/50">Commission location (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={commissionLocation}
                    onChange={(e) => setCommissionLocation(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.06] bg-[#080808] px-4 py-2.5 text-sm text-white outline-none focus:border-[#C4956A]/30"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/50">Commission apporteur (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={commissionApporteur}
                    onChange={(e) => setCommissionApporteur(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.06] bg-[#080808] px-4 py-2.5 text-sm text-white outline-none focus:border-[#C4956A]/30"
                  />
                </div>
              </div>
              <button className="mt-6 rounded-xl bg-[#C4956A] px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-[#D4A574]">
                Enregistrer
              </button>
            </div>

            {/* Maintenance Toggle */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0e0e0e] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Mode maintenance</h2>
                  <p className="mt-1 text-sm text-white/40">
                    Activer pour rendre la plateforme temporairement inaccessible aux utilisateurs.
                  </p>
                </div>
                <button
                  onClick={() => setMaintenance(!maintenance)}
                  className={cn(
                    "rounded-xl p-2 transition",
                    maintenance ? "text-orange-400" : "text-white/30 hover:text-white/60"
                  )}
                >
                  {maintenance ? (
                    <ToggleRight className="h-8 w-8" />
                  ) : (
                    <ToggleLeft className="h-8 w-8" />
                  )}
                </button>
              </div>
              {maintenance && (
                <div className="mt-4 rounded-xl border border-orange-500/20 bg-orange-500/5 px-4 py-3 text-sm text-orange-400">
                  La plateforme est actuellement en mode maintenance.
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
