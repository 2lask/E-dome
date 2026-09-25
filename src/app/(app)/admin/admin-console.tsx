"use client";

import React, { useMemo, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { useApp } from "@/lib/context";
import { RATES, EDOME_PRIME_SHARE } from "@/lib/pricing";

/* ─── Mock Data ──────────────────────────────────────────────────────────── */


const MOCK_USERS = [
  { id: "U001", nom: "Marie Dupont", email: "marie@example.com", role: "hote", date: "2026-01-15", statut: "actif" },
  { id: "U002", nom: "Jean Martin", email: "jean@example.com", role: "client", date: "2026-01-20", statut: "actif" },
  { id: "U003", nom: "Sophie Meier", email: "sophie@example.com", role: "agence", date: "2026-02-01", statut: "actif" },
  { id: "U004", nom: "Bruno Chappuis", email: "bruno@example.com", role: "apporteur", date: "2026-02-10", statut: "suspendu" },
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

export function AdminConsole() {
  const { formatPrice } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("utilisateurs");
  const [search, setSearch] = useState("");
  const [biens, setBiens] = useState(MOCK_BIENS);
  const [signalements, setSignalements] = useState(MOCK_SIGNALEMENTS);
  /* Deux mécaniques (D14) : la vente et la location longue durée n'ont AUCUN
     frais fixe (publication gratuite) — l'apporteur y touche une prime en
     francs, dont E-Dome retient une part paramétrable. Les autres pôles :
     commission marketplace. Valeurs par défaut depuis @/lib/pricing. */
  const [commissionCourteDuree, setCommissionCourteDuree] = useState(
    String(Math.round(((RATES["location-ct"].min + RATES["location-ct"].max) / 2) * 100)),
  );
  const [partEdomePrime, setPartEdomePrime] = useState(String(Math.round(EDOME_PRIME_SHARE * 100)));
  const [maintenanceMode, setMaintenanceMode] = useState(false);

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

  /* Les quatre compteurs de cette console affirmaient une traction qu'E-Dome
     n'a pas : 2 847 utilisateurs actifs, 1 253 biens publiés, et 387 500 CHF
     de chiffre d'affaires — celui de la plateforme elle-même. Sur une page
     qui reste atteignable sans compte (cf. TODO.md), c'était la pire
     occurrence du défaut que la phase A avait traité partout ailleurs.

     Le chiffre d'affaires disparaît : il n'en existe aucune version honnête,
     puisque toute valeur affirmerait un revenu. Il cède la place au compteur
     qu'une console d'administration sert réellement à surveiller — la file
     d'attente de modération.

     Les trois autres ne décrivent plus une plateforme mais **les listes
     affichées juste en dessous**. Ce ne sont donc plus des affirmations mais
     des totaux vérifiables à l'écran. Au passage, « 12 signalements ouverts »
     en annonçait douze pour deux réels.

     Ils se calculent sur l'état, pas sur les constantes : approuver un bien
     ou résoudre un signalement doit faire bouger le compteur. Dérivés des
     tableaux figés, ils seraient redevenus faux au premier clic. */
  const kpis = useMemo(
    () => [
      {
        label: "Utilisateurs actifs",
        value: MOCK_USERS.filter((u) => u.statut === "actif").length,
        hint: `sur ${MOCK_USERS.length} listés`,
      },
      { label: "Biens listés", value: biens.length, hint: "dans l'onglet Biens" },
      {
        label: "En attente de validation",
        value: biens.filter((b) => b.statut === "en_attente").length,
        hint: "biens à modérer",
      },
      {
        label: "Signalements ouverts",
        value: signalements.filter((s) => s.statut === "ouvert").length,
        hint: `sur ${signalements.length} reçus`,
      },
    ],
    [biens, signalements],
  );

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
      <h1 className="text-3xl page-heading text-[var(--foreground)]">Administration</h1>

      {/* Cette console reste atteignable sans compte tant que Supabase n'est
          pas configuré : le proxy laisse tout passer dans ce cas. Le bandeau
          ne remplace pas une porte d'entrée — voir TODO.md.

          Il ne porte plus la même charge qu'avant : les trois chiffres qui se
          lisaient comme une traction d'E-Dome (chiffre d'affaires,
          utilisateurs actifs, biens publiés) ont été retirés plutôt que
          désamorcés par un avertissement. Un bandeau n'annule pas un chiffre
          faux ; il demande au lecteur de s'en souvenir en le lisant. */}
      <p
        role="status"
        className="flex items-start gap-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-200"
      >
        <TriangleAlert size={18} className="shrink-0 mt-px text-amber-600 dark:text-amber-400" aria-hidden />
        <span>
          <b>Données d&apos;exemple.</b> Cette console de démonstration affiche des
          chiffres inventés. Aucun compte, aucun bien et aucun signalement listé
          ici n&apos;est réel.
        </span>
      </p>

      {/* KPIs */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="p-5 rounded-xl bg-[var(--card)] border border-[var(--card-border)]">
            <p className="text-sm text-[var(--text-muted)]">{kpi.label}</p>
            <p className="text-2xl font-bold text-[var(--foreground)] mt-1">{kpi.value}</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{kpi.hint}</p>
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
                ? "border-[var(--primary)] text-[var(--primary)]"
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
            className="w-full max-w-md px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)] transition"
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
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Barème de rémunération</h3>
            <p className="text-xs text-[var(--text-muted)]">
              Vente et location longue durée : publication gratuite, aucun frais
              fixe. L&apos;apporteur d&apos;un bien touche une prime fixe en francs
              (50 à 3 000 CHF), définie par le vendeur — jamais un pourcentage du
              prix. Les autres pôles : commission marketplace.
            </p>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm text-[var(--text-secondary)]">Commission marketplace location courte durée (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={commissionCourteDuree}
                  onChange={(e) => setCommissionCourteDuree(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-[var(--text-secondary)]">Part E-Dome sur la prime de mise en relation (%)</label>
                <input
                  type="number"
                  step="1"
                  value={partEdomePrime}
                  onChange={(e) => setPartEdomePrime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition"
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

          <button className="px-6 py-2.5 rounded-lg bg-[var(--primary)] text-white font-medium hover:opacity-90 transition">
            Sauvegarder les parametres
          </button>
        </section>
      )}
    </div>
  );
}
