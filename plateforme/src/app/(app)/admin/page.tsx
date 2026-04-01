"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";

/* ─── Mock Data ──────────────────────────────────────────────────────────── */

const KPIS = [
  { label: "Utilisateurs actifs", value: 2847, isCurrency: false },
  { label: "Biens publies", value: 1253, isCurrency: false },
  { label: "Chiffre d'affaires", value: 387500, isCurrency: true },
  { label: "Signalements ouverts", value: 12, isCurrency: false },
];

const MOCK_USERS = [
  { id: "U001", nom: "Marie Dupont", email: "marie@example.com", role: "hote", date: "2026-01-15", statut: "actif" },
  { id: "U002", nom: "Jean Martin", email: "jean@example.com", role: "client", date: "2026-01-20", statut: "actif" },
  { id: "U003", nom: "Sophie Meier", email: "sophie@example.com", role: "agence", date: "2026-02-01", statut: "actif" },
  { id: "U004", nom: "Karim Ben Ali", email: "karim@example.com", role: "apporteur", date: "2026-02-10", statut: "suspendu" },
  { id: "U005", nom: "Laura Fischer", email: "laura@example.com", role: "investisseur", date: "2026-02-15", statut: "actif" },
  { id: "U006", nom: "Thomas Roth", email: "thomas@example.com", role: "formateur", date: "2026-02-20", statut: "actif" },
  { id: "U007", nom: "Nadia Silva", email: "nadia@example.com", role: "courtier", date: "2026-03-01", statut: "actif" },
  { id: "U008", nom: "Patrick Leroy", email: "patrick@example.com", role: "proprietaire", date: "2026-03-05", statut: "inactif" },
  { id: "U009", nom: "Amina Kone", email: "amina@example.com", role: "photographe", date: "2026-03-10", statut: "actif" },
  { id: "U010", nom: "David Mueller", email: "david@example.com", role: "client", date: "2026-03-15", statut: "actif" },
];

const MOCK_BIENS = [
  { id: "B001", titre: "Appartement 3p Lausanne", hote: "Marie Dupont", date: "2026-03-20", prix: 450000, statut: "en_attente" },
  { id: "B002", titre: "Villa Montreux vue lac", hote: "Sophie Meier", date: "2026-03-18", prix: 1250000, statut: "en_attente" },
  { id: "B003", titre: "Studio Geneve centre", hote: "Jean Martin", date: "2026-03-15", prix: 285000, statut: "approuve" },
  { id: "B004", titre: "Chalet Verbier", hote: "Thomas Roth", date: "2026-03-12", prix: 890000, statut: "approuve" },
  { id: "B005", titre: "Penthouse Zurich", hote: "Laura Fischer", date: "2026-03-10", prix: 2100000, statut: "rejete" },
];

const MOCK_SIGNALEMENTS = [
  { id: "S001", type: "Contenu inapproprie", cible: "Post #4521", auteur: "User anonyme", date: "2026-03-25", statut: "ouvert" },
  { id: "S002", type: "Annonce frauduleuse", cible: "Bien B-789", auteur: "Laura Fischer", date: "2026-03-24", statut: "ouvert" },
  { id: "S003", type: "Harcelement", cible: "User U-456", auteur: "Marie Dupont", date: "2026-03-22", statut: "en_cours" },
  { id: "S004", type: "Spam", cible: "Commentaire #112", auteur: "Thomas Roth", date: "2026-03-20", statut: "resolu" },
  { id: "S005", type: "Faux avis", cible: "Avis #78", auteur: "Nadia Silva", date: "2026-03-18", statut: "resolu" },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */

type Tab = "utilisateurs" | "biens" | "signalements" | "parametres";

export default function AdminPage() {
  const { activeRole, formatPrice } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("utilisateurs");
  const [search, setSearch] = useState("");
  const [biens, setBiens] = useState(MOCK_BIENS);
  const [signalements, setSignalements] = useState(MOCK_SIGNALEMENTS);
  const [commissionVente, setCommissionVente] = useState("3.5");
  const [commissionLocation, setCommissionLocation] = useState("8");
  const [commissionApporteur, setCommissionApporteur] = useState("15");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  if (activeRole !== "agence" && activeRole !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-8 rounded-2xl bg-[var(--card)] border border-[var(--card-border)]">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">Acces restreint</h2>
          <p className="text-[var(--text-secondary)]">
            Cette page est reservee aux administrateurs et agences.
          </p>
        </div>
      </div>
    );
  }

  const filteredUsers = MOCK_USERS.filter(
    (u) =>
      u.nom.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleApproveBien = (id: string) => {
    setBiens((prev) => prev.map((b) => (b.id === id ? { ...b, statut: "approuve" } : b)));
  };

  const handleRejectBien = (id: string) => {
    setBiens((prev) => prev.map((b) => (b.id === id ? { ...b, statut: "rejete" } : b)));
  };

  const handleResolveSignalement = (id: string) => {
    setSignalements((prev) => prev.map((s) => (s.id === id ? { ...s, statut: "resolu" } : s)));
  };

  const handleDismissSignalement = (id: string) => {
    setSignalements((prev) => prev.filter((s) => s.id !== id));
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "utilisateurs", label: "Utilisateurs" },
    { key: "biens", label: "Biens" },
    { key: "signalements", label: "Signalements" },
    { key: "parametres", label: "Parametres" },
  ];

  const userStatusStyle: Record<string, string> = {
    actif: "bg-emerald-500/20 text-emerald-400",
    suspendu: "bg-amber-500/20 text-amber-400",
    inactif: "bg-red-500/20 text-red-400",
  };

  const bienStatusStyle: Record<string, string> = {
    en_attente: "bg-amber-500/20 text-amber-400",
    approuve: "bg-emerald-500/20 text-emerald-400",
    rejete: "bg-red-500/20 text-red-400",
  };

  const bienStatusLabel: Record<string, string> = {
    en_attente: "En attente",
    approuve: "Approuve",
    rejete: "Rejete",
  };

  const signalStatusStyle: Record<string, string> = {
    ouvert: "bg-red-500/20 text-red-400",
    en_cours: "bg-amber-500/20 text-amber-400",
    resolu: "bg-emerald-500/20 text-emerald-400",
  };

  const signalStatusLabel: Record<string, string> = {
    ouvert: "Ouvert",
    en_cours: "En cours",
    resolu: "Resolu",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-[var(--foreground)]">Administration</h1>

      {/* KPIs */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map((kpi, idx) => (
          <div key={idx} className="p-5 rounded-xl bg-[var(--card)] border border-[var(--card-border)]">
            <p className="text-sm text-[var(--text-muted)]">{kpi.label}</p>
            <p className="text-2xl font-bold text-[var(--foreground)] mt-1">
              {kpi.isCurrency ? formatPrice(kpi.value) : kpi.value.toLocaleString("fr-CH")}
            </p>
          </div>
        ))}
      </section>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--card-border)]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium transition border-b-2 ${
              activeTab === tab.key
                ? "border-[#C4956A] text-[#C4956A]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "utilisateurs" && (
        <section className="space-y-4">
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[#C4956A] transition"
          />
          <div className="rounded-xl bg-[var(--card)] border border-[var(--card-border)] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--card-border)]">
                  <th className="text-left p-4 text-[var(--text-muted)] font-medium">ID</th>
                  <th className="text-left p-4 text-[var(--text-muted)] font-medium">Nom</th>
                  <th className="text-left p-4 text-[var(--text-muted)] font-medium">Email</th>
                  <th className="text-left p-4 text-[var(--text-muted)] font-medium">Role</th>
                  <th className="text-left p-4 text-[var(--text-muted)] font-medium">Date</th>
                  <th className="text-left p-4 text-[var(--text-muted)] font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-[var(--card-border)] last:border-0 hover:bg-[var(--hover-bg)] transition">
                    <td className="p-4 text-[var(--foreground)] font-mono text-xs">{u.id}</td>
                    <td className="p-4 text-[var(--foreground)] font-medium">{u.nom}</td>
                    <td className="p-4 text-[var(--text-secondary)]">{u.email}</td>
                    <td className="p-4 text-[var(--text-secondary)] capitalize">{u.role}</td>
                    <td className="p-4 text-[var(--text-secondary)]">{u.date}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${userStatusStyle[u.statut]}`}>
                        {u.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "biens" && (
        <section className="space-y-4">
          <div className="rounded-xl bg-[var(--card)] border border-[var(--card-border)] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--card-border)]">
                  <th className="text-left p-4 text-[var(--text-muted)] font-medium">Bien</th>
                  <th className="text-left p-4 text-[var(--text-muted)] font-medium">Hote</th>
                  <th className="text-left p-4 text-[var(--text-muted)] font-medium">Date</th>
                  <th className="text-right p-4 text-[var(--text-muted)] font-medium">Prix</th>
                  <th className="text-left p-4 text-[var(--text-muted)] font-medium">Statut</th>
                  <th className="text-right p-4 text-[var(--text-muted)] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {biens.map((b) => (
                  <tr key={b.id} className="border-b border-[var(--card-border)] last:border-0 hover:bg-[var(--hover-bg)] transition">
                    <td className="p-4">
                      <p className="text-[var(--foreground)] font-medium">{b.titre}</p>
                      <p className="text-xs text-[var(--text-muted)]">{b.id}</p>
                    </td>
                    <td className="p-4 text-[var(--text-secondary)]">{b.hote}</td>
                    <td className="p-4 text-[var(--text-secondary)]">{b.date}</td>
                    <td className="p-4 text-right text-[var(--foreground)] font-medium">{formatPrice(b.prix)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${bienStatusStyle[b.statut]}`}>
                        {bienStatusLabel[b.statut]}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {b.statut === "en_attente" && (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleApproveBien(b.id)}
                            className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/30 transition"
                          >
                            Approuver
                          </button>
                          <button
                            onClick={() => handleRejectBien(b.id)}
                            className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 transition"
                          >
                            Rejeter
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "signalements" && (
        <section className="space-y-4">
          {signalements.map((s) => (
            <div key={s.id} className="p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-[var(--foreground)] font-medium">{s.type}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${signalStatusStyle[s.statut]}`}>
                    {signalStatusLabel[s.statut]}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">Cible: {s.cible} — Par: {s.auteur}</p>
                <p className="text-xs text-[var(--text-muted)]">{s.date}</p>
              </div>
              {s.statut !== "resolu" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleResolveSignalement(s.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/30 transition"
                  >
                    Resoudre
                  </button>
                  <button
                    onClick={() => handleDismissSignalement(s.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 transition"
                  >
                    Rejeter
                  </button>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {activeTab === "parametres" && (
        <section className="space-y-6 max-w-lg">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Taux de commission</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm text-[var(--text-secondary)]">Commission vente (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={commissionVente}
                  onChange={(e) => setCommissionVente(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] outline-none focus:border-[#C4956A] transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-[var(--text-secondary)]">Commission location (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={commissionLocation}
                  onChange={(e) => setCommissionLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] outline-none focus:border-[#C4956A] transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-[var(--text-secondary)]">Part apporteur (%)</label>
                <input
                  type="number"
                  step="1"
                  value={commissionApporteur}
                  onChange={(e) => setCommissionApporteur(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] outline-none focus:border-[#C4956A] transition"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Mode maintenance</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`relative w-12 h-6 rounded-full transition ${
                  maintenanceMode ? "bg-red-500" : "bg-[var(--text-muted)]"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    maintenanceMode ? "translate-x-6" : ""
                  }`}
                />
              </button>
              <span className="text-sm text-[var(--text-secondary)]">
                {maintenanceMode ? "Maintenance activee" : "Maintenance desactivee"}
              </span>
            </div>
          </div>

          <button className="px-6 py-2.5 rounded-lg bg-[#C4956A] text-white font-medium hover:opacity-90 transition">
            Sauvegarder les parametres
          </button>
        </section>
      )}
    </div>
  );
}
