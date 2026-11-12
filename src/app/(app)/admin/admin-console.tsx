"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Info } from "lucide-react";
import { useApp } from "@/lib/context";
import { RATES, EDOME_PRIME_SHARE } from "@/lib/pricing";
import { useSession } from "@/lib/use-session";
import { groupThousands } from "@/lib/demo/session-views";
import {
  ADMIN_REPORTS,
  VOLUME_YEAR,
  adminAccounts,
  adminProperties,
  platformVolume,
  reportAuthor,
  type AdminReport,
} from "@/lib/demo/admin-data";

/* ── Console d'administration (chantier P6c) ─────────────────────────────────

   Plus aucun compte inventé : les comptes sont les seize personnes de
   l'annuaire et l'agence Hartmann Immobilier SA, les biens sont ceux du
   catalogue (avec leur vrai hôte) plus ceux publiés pendant la visite, et les
   compteurs se dérivent de ces listes — `@/lib/demo/admin-data`.

   Le seul total « plateforme » est le Volume de transactions de l'année :
   ce qui a transité entre les membres, jamais présenté comme un chiffre
   d'affaires d'E-Dome. */

const ACCOUNTS = adminAccounts();
const CATALOGUE_BIENS = adminProperties();
const VOLUME = platformVolume(VOLUME_YEAR);

type Tab = "utilisateurs" | "biens" | "signalements" | "parametres";
type BienStatut = "approuve" | "en_attente" | "rejete";

export function AdminConsole() {
  const { formatPrice } = useApp();
  const { listings } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>("utilisateurs");
  const [search, setSearch] = useState("");
  /* Décisions de modération prises pendant la visite (par id de bien). */
  const [decisions, setDecisions] = useState<Record<string, BienStatut>>({});
  const [signalements, setSignalements] = useState<AdminReport[]>(() => [...ADMIN_REPORTS]);
  /* Deux mécaniques (D14) : la vente et la location longue durée n'ont AUCUN
     frais fixe (publication gratuite) — l'apporteur y touche une prime en
     francs, dont E-Dome retient une part paramétrable. Courte durée,
     services, formations, événements et lives : une commission sur la
     transaction. Boutique : affiliation pure, payée par le marchand. */
  const [commissionCourteDuree, setCommissionCourteDuree] = useState(
    String(Math.round(((RATES["location-ct"].min + RATES["location-ct"].max) / 2) * 100)),
  );
  const [partEdomePrime, setPartEdomePrime] = useState(String(Math.round(EDOME_PRIME_SHARE * 100)));
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  /* Les biens : ceux publiés pendant la visite attendent la modération, ceux
     du catalogue sont en ligne. */
  const biens = useMemo(
    () => [
      ...listings.map((l) => ({
        id: l.id,
        titre: l.title,
        hoteId: l.host.id,
        hote: `${l.host.firstName} ${l.host.lastName}`,
        ville: l.location.city,
        prix: l.price,
        currency: l.currency,
        statut: decisions[l.id] ?? ("en_attente" as BienStatut),
      })),
      ...CATALOGUE_BIENS.map((b) => ({ ...b, statut: decisions[b.id] ?? ("approuve" as BienStatut) })),
    ],
    [listings, decisions],
  );

  const q = search.trim().toLowerCase();
  const filteredUsers = ACCOUNTS.filter(
    (u) => !q || u.nom.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q) || u.lieu.toLowerCase().includes(q),
  );

  const decide = (id: string, statut: BienStatut) => setDecisions((prev) => ({ ...prev, [id]: statut }));

  const handleResolveSignalement = (id: string) => {
    setSignalements((prev) => prev.map((s) => (s.id === id ? { ...s, statut: "resolu" } : s)));
  };

  const handleDismissSignalement = (id: string) => {
    setSignalements((prev) => prev.filter((s) => s.id !== id));
  };

  /* Chaque compteur décrit une liste affichée juste en dessous, ou se dérive
     du journal : approuver un bien ou résoudre un signalement le fait bouger. */
  const kpis = useMemo(
    () => [
      {
        label: "Comptes",
        value: String(ACCOUNTS.length),
        hint: `${ACCOUNTS.filter((a) => a.kind === "personne").length} personnes + 1 agence`,
      },
      { label: "Biens au catalogue", value: String(biens.length), hint: `${biens.filter((b) => b.statut === "en_attente").length} en attente de validation` },
      {
        label: `Volume de transactions ${VOLUME_YEAR}`,
        value: `${groupThousands(VOLUME)} CHF`,
        hint: "Entre membres, pas un revenu d'E-Dome",
      },
      {
        label: "Signalements ouverts",
        value: String(signalements.filter((s) => s.statut === "ouvert").length),
        hint: `sur ${signalements.length} reçus`,
      },
    ],
    [biens, signalements],
  );

  const tabs: { key: Tab; label: string }[] = [
    { key: "utilisateurs", label: "Utilisateurs" },
    { key: "biens", label: "Biens" },
    { key: "signalements", label: "Signalements" },
    { key: "parametres", label: "Paramètres" },
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
    approuve: "Approuvé",
    rejete: "Rejeté",
  };

  const signalStatusStyle: Record<string, string> = {
    ouvert: "bg-red-500/20 text-red-400",
    en_cours: "bg-amber-500/20 text-amber-400",
    resolu: "bg-emerald-500/20 text-emerald-400",
  };

  const signalStatusLabel: Record<string, string> = {
    ouvert: "Ouvert",
    en_cours: "En cours",
    resolu: "Résolu",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <h1 className="text-3xl page-heading text-[var(--foreground)]">Administration</h1>

      {/* Le bandeau ne dit plus « chiffres inventés » : les comptes sont ceux
          du casting et les compteurs se dérivent des données de la maquette. */}
      <p
        role="status"
        className="flex items-start gap-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--text-secondary)]"
      >
        <Info size={18} className="shrink-0 mt-px text-[var(--primary)]" aria-hidden />
        <span>
          <b className="text-[var(--foreground)]">Démonstration.</b> Les comptes sont les seize personnes de la
          démonstration et l&apos;agence Hartmann Immobilier SA ; biens, volume et signalements sont dérivés des
          données de la maquette. Aucun n&apos;est un vrai client.
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
                  <th className="text-left p-4 text-[var(--text-muted)] font-medium">Compte</th>
                  <th className="text-left p-4 text-[var(--text-muted)] font-medium">Email</th>
                  <th className="text-left p-4 text-[var(--text-muted)] font-medium">Rôle</th>
                  <th className="text-left p-4 text-[var(--text-muted)] font-medium">Lieu</th>
                  <th className="text-right p-4 text-[var(--text-muted)] font-medium">Biens</th>
                  <th className="text-left p-4 text-[var(--text-muted)] font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-[var(--card-border)] last:border-0 hover:bg-[var(--hover-bg)] transition">
                    <td className="p-4">
                      <Link href={u.href} className="text-[var(--foreground)] font-medium hover:underline">{u.nom}</Link>
                      <p className="text-xs text-[var(--text-muted)] font-mono">{u.id}</p>
                    </td>
                    <td className="p-4 text-[var(--text-secondary)]">{u.email}</td>
                    <td className="p-4 text-[var(--text-secondary)]">{u.role}</td>
                    <td className="p-4 text-[var(--text-secondary)]">{u.lieu}</td>
                    <td className="p-4 text-right tabular-nums text-[var(--foreground)]">{u.biens}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${userStatusStyle.actif}`}>actif</span>
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
                  <th className="text-left p-4 text-[var(--text-muted)] font-medium">Hôte</th>
                  <th className="text-left p-4 text-[var(--text-muted)] font-medium">Ville</th>
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
                    <td className="p-4 text-[var(--text-secondary)]">
                      <Link href={`/profil/${b.hoteId}`} className="hover:underline">{b.hote}</Link>
                    </td>
                    <td className="p-4 text-[var(--text-secondary)]">{b.ville}</td>
                    <td className="p-4 text-right text-[var(--foreground)] font-medium">{formatPrice(b.prix, b.currency)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${bienStatusStyle[b.statut]}`}>
                        {bienStatusLabel[b.statut]}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {b.statut === "en_attente" && (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => decide(b.id, "approuve")}
                            className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/30 transition"
                          >
                            Approuver
                          </button>
                          <button
                            onClick={() => decide(b.id, "rejete")}
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
                <p className="text-sm text-[var(--text-secondary)]">
                  Cible : <Link href={s.cibleHref} className="hover:underline">{s.cible}</Link> — Par :{" "}
                  <Link href={`/profil/${s.auteurId}`} className="hover:underline">{reportAuthor(s)}</Link>
                </p>
                <p className="text-xs text-[var(--text-muted)]">{s.date}</p>
              </div>
              {s.statut !== "resolu" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleResolveSignalement(s.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/30 transition"
                  >
                    Résoudre
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
              prix. Courte durée, services, formations, événements et lives : une
              commission sur la transaction, prélevée sur le vendeur. Boutique :
              affiliation pure — E-Dome est rémunéré par le marchand, sans
              pourcentage affiché.
            </p>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm text-[var(--text-secondary)]">Commission location courte durée (%)</label>
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
                {maintenanceMode ? "Maintenance activée" : "Maintenance désactivée"}
              </span>
            </div>
          </div>

          <button className="px-6 py-2.5 rounded-lg bg-[var(--primary)] text-white font-medium hover:opacity-90 transition">
            Sauvegarder les paramètres
          </button>
        </section>
      )}
    </div>
  );
}
