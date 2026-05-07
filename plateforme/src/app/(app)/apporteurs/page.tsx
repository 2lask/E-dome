"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { LottiePlayer } from "@/components/ui/lottie-player";

/* ─── Mock Data ──────────────────────────────────────────────────────────── */

const REFERRAL_ID = "AP-7291";

const REFERRAL_LINKS = [
  {
    label: "Amener un hôte",
    url: `edome.world/ref/hote/${REFERRAL_ID}`,
    description: "Partagez ce lien pour inviter un propriétaire à publier ses biens sur E-Dome. Commission : 100 CHF par hôte activé.",
    commission: "100 CHF / hôte activé",
    clicks: 8,
    conversions: 2,
    earned: 200,
    color: "bg-amber-500/20 text-amber-400",
  },
  {
    label: "Amener un client",
    url: `edome.world/ref/client/${REFERRAL_ID}`,
    description: "Invitez des locataires ou acheteurs potentiels à rejoindre la plateforme. Commission : 5% de la réservation.",
    commission: "5% de la réservation",
    clicks: 12,
    conversions: 5,
    earned: 1800,
    color: "bg-blue-500/20 text-blue-400",
  },
  {
    label: "Amener un bien",
    url: `edome.world/ref/bien/${REFERRAL_ID}`,
    description: "Recommandez un bien spécifique et touchez une commission sur la transaction. Commission : 2% de la vente.",
    commission: "2% de la vente",
    clicks: 3,
    conversions: 1,
    earned: 400,
    color: "bg-emerald-500/20 text-emerald-400",
  },
];

const APPORT_TYPES = [
  { title: "Amener un hôte", desc: "Invitez un propriétaire à publier ses biens sur E-Dome", icon: "\uD83C\uDFE0", commission: "100 CHF / hôte activé" },
  { title: "Amener un client", desc: "Présentez un acheteur ou locataire qualifié", icon: "\uD83D\uDC64", commission: "5% de la réservation" },
  { title: "Amener un bien", desc: "Recommandez un bien spécifique pour la vente", icon: "\uD83C\uDFD7\uFE0F", commission: "2% de la vente" },
  { title: "Prestataire", desc: "Recommandez un photographe, architecte, notaire...", icon: "\uD83D\uDCF7", commission: "100-500 CHF" },
  { title: "Partenariat local", desc: "Connectez E-Dome avec un acteur local", icon: "\uD83E\uDD1D", commission: "Variable" },
  { title: "Parrainage réseau", desc: "Parrainez d'autres apporteurs d'affaires", icon: "\uD83D\uDD17", commission: "10% indirect" },
];

const MOCK_APPORTS = [
  { id: "A-001", type: "Amener un hôte", ref: "Marc Dupont", date: "2026-03-15", status: "converti", commission: 100 },
  { id: "A-002", type: "Amener un bien", ref: "Villa Montreux", date: "2026-03-10", status: "en_cours", commission: 0 },
  { id: "A-003", type: "Amener un client", ref: "Sophie Meier", date: "2026-02-28", status: "converti", commission: 450 },
  { id: "A-004", type: "Amener un hôte", ref: "Pierre Blanc", date: "2026-02-20", status: "converti", commission: 100 },
  { id: "A-005", type: "Amener un bien", ref: "Appartement Lausanne", date: "2026-02-15", status: "converti", commission: 1400 },
  { id: "A-006", type: "Amener un client", ref: "Nadia Schmid", date: "2026-01-30", status: "converti", commission: 350 },
];

const MOCK_VERSEMENTS = [
  { id: "V-001", date: "2026-03-01", montant: 1400, methode: "Virement IBAN", statut: "verse" },
  { id: "V-002", date: "2026-02-01", montant: 650, methode: "Virement IBAN", statut: "verse" },
];

const LEADERBOARD = [
  { rank: 1, nom: "Sarah K.", apports: 52, commissions: 21300 },
  { rank: 2, nom: "Jean-Pierre D.", apports: 41, commissions: 16800 },
  { rank: 3, nom: "Laura M.", apports: 39, commissions: 15200 },
  { rank: 4, nom: "Léo M. (Vous)", apports: 28, commissions: 9500, isYou: true },
  { rank: 5, nom: "Nadia S.", apports: 25, commissions: 8700 },
  { rank: 6, nom: "Thomas R.", apports: 22, commissions: 7400 },
  { rank: 7, nom: "Amina K.", apports: 19, commissions: 6100 },
  { rank: 8, nom: "Patrick L.", apports: 15, commissions: 4900 },
];

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(`https://${text}`);
}

function shareEmail(url: string, label: string) {
  window.open(`mailto:?subject=E-Dome - ${label}&body=${encodeURIComponent(`https://${url}`)}`, "_blank");
}

const statusStyles: Record<string, string> = {
  converti: "bg-emerald-500/20 text-emerald-400",
  en_cours: "bg-amber-500/20 text-amber-400",
  expire: "bg-red-500/20 text-red-400",
};

const statusLabels: Record<string, string> = {
  converti: "Converti",
  en_cours: "En cours",
  expire: "Expiré",
};

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function ApporteursPage() {
  const { formatPrice } = useApp();
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [showQR, setShowQR] = useState<number | null>(null);

  const totalCommissions = MOCK_APPORTS.reduce((s, a) => s + a.commission, 0);
  const totalVersements = MOCK_VERSEMENTS.reduce((s, v) => s + v.montant, 0);
  const enAttente = totalCommissions - totalVersements;

  const handleCopy = (url: string, idx: number) => {
    copyToClipboard(url);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-fade-in">
      {/* Hero */}
      <section className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)]">
          Programme Apporteurs d&apos;Affaires
        </h1>
        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
          Générez des revenus en recommandant E-Dome à votre réseau. Chaque conversion vous rapporte une commission prélevée sur la part plateforme, sans surcharge pour les utilisateurs.
        </p>
      </section>

      {/* Referral Link Cards */}
      <section className="grid md:grid-cols-3 gap-6">
        {REFERRAL_LINKS.map((link, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] space-y-4">
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${link.color}`}>{link.label}</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">{link.description}</p>
            <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-[#1e9df1]/20 text-[#1e9df1]">
              {link.commission}
            </span>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)]">
              <span className="text-xs text-[var(--text-muted)] truncate flex-1">{link.url}</span>
            </div>
            <div className="flex gap-2 items-center">
              <LottiePlayer src="/lottie/lottieflow-social-networks-16-11-000000-easey.json" width={40} height={40} className="flex-shrink-0" />
              <button
                onClick={() => handleCopy(link.url, idx)}
                className="flex-1 px-3 py-2 rounded-lg bg-[#1e9df1] text-white text-sm font-medium hover:opacity-90 transition"
              >
                {copiedIdx === idx ? "\u2713 Copié" : "Copier"}
              </button>
              <button
                onClick={() => shareEmail(link.url, link.label)}
                className="px-3 py-2 rounded-lg bg-blue-600/20 text-blue-400 text-sm hover:bg-blue-600/30 transition"
                title="Email"
              >
                @
              </button>
              <button
                onClick={() => setShowQR(showQR === idx ? null : idx)}
                className="px-3 py-2 rounded-lg bg-[var(--hover-bg)] text-[var(--text-secondary)] text-sm hover:opacity-80 transition"
                title="QR Code"
              >
                QR
              </button>
            </div>
            {showQR === idx && (
              <div className="flex items-center justify-center p-4 rounded-lg bg-white">
                <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs text-center">
                  QR Code<br />pour<br />{link.label}
                </div>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Clics: <span className="text-[var(--foreground)] font-medium">{link.clicks}</span></span>
              <span className="text-[var(--text-muted)]">Conv.: <span className="text-[var(--foreground)] font-medium">{link.conversions}</span></span>
              <span className="text-[var(--text-muted)]">Gagné: <span className="text-emerald-400 font-medium">{formatPrice(link.earned)}</span></span>
            </div>
          </div>
        ))}
      </section>

      {/* Types d'Apport */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Types d&apos;apport</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {APPORT_TYPES.map((type, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-[var(--card)] border border-[var(--card-border)] hover:border-[#1e9df1]/40 transition space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{type.icon}</span>
                <h3 className="font-medium text-[var(--foreground)]">{type.title}</h3>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">{type.desc}</p>
              <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-[#1e9df1]/20 text-[#1e9df1]">
                Commission: {type.commission}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Commission Flow */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Comment ça fonctionne</h2>
        <div className="flex flex-col md:flex-row items-center gap-4">
          {[
            { step: "1", title: "Lien cliqué", desc: "Un prospect clique sur votre lien de parrainage" },
            { step: "2", title: "Conversion confirmée", desc: "Le prospect s'inscrit et réalise une transaction" },
            { step: "3", title: "Commission versée", desc: "Votre commission est calculée et virée mensuellement" },
          ].map((s, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <div className="hidden md:block text-[var(--text-muted)] text-2xl">→</div>}
              <div className="flex-1 w-full p-5 rounded-xl bg-[var(--card)] border border-[var(--card-border)] text-center space-y-2">
                <div className="w-10 h-10 mx-auto rounded-full bg-[#1e9df1] text-white flex items-center justify-center font-bold">
                  {s.step}
                </div>
                <h3 className="font-medium text-[var(--foreground)]">{s.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{s.desc}</p>
              </div>
            </React.Fragment>
          ))}
        </div>
        <p className="text-sm text-[var(--text-muted)] text-center italic">
          La commission est prélevée sur la part plateforme E-Dome. Aucun coût supplémentaire pour l&apos;hôte ou le client.
        </p>
      </section>

      {/* Dashboard: Apports Table */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Mes apports</h2>
        <div className="rounded-xl bg-[var(--card)] border border-[var(--card-border)] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--card-border)]">
                <th className="text-left p-4 text-[var(--text-muted)] font-medium">ID</th>
                <th className="text-left p-4 text-[var(--text-muted)] font-medium">Type</th>
                <th className="text-left p-4 text-[var(--text-muted)] font-medium">Référence</th>
                <th className="text-left p-4 text-[var(--text-muted)] font-medium">Date</th>
                <th className="text-left p-4 text-[var(--text-muted)] font-medium">Statut</th>
                <th className="text-right p-4 text-[var(--text-muted)] font-medium">Commission</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_APPORTS.map((a) => (
                <tr key={a.id} className="border-b border-[var(--card-border)] last:border-0 hover:bg-[var(--hover-bg)] transition">
                  <td className="p-4 text-[var(--foreground)] font-mono text-xs">{a.id}</td>
                  <td className="p-4 text-[var(--foreground)]">{a.type}</td>
                  <td className="p-4 text-[var(--foreground)]">{a.ref}</td>
                  <td className="p-4 text-[var(--text-secondary)]">{a.date}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusStyles[a.status]}`}>
                      {statusLabels[a.status]}
                    </span>
                  </td>
                  <td className="p-4 text-right text-[var(--foreground)] font-medium">
                    {a.commission > 0 ? formatPrice(a.commission) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Commissions Summary + Versements */}
      <section className="grid md:grid-cols-2 gap-6">
        {/* Summary */}
        <div className="p-6 rounded-xl bg-[var(--card)] border border-[var(--card-border)] space-y-4">
          <h3 className="font-semibold text-[var(--foreground)]">Résumé des commissions</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Total gagné</span>
              <span className="text-[var(--foreground)] font-bold text-lg">{formatPrice(totalCommissions)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Déjà versé</span>
              <span className="text-emerald-400 font-medium">{formatPrice(totalVersements)}</span>
            </div>
            <div className="flex justify-between border-t border-[var(--card-border)] pt-3">
              <span className="text-[var(--text-secondary)]">En attente</span>
              <span className="text-[#1e9df1] font-bold">{formatPrice(enAttente)}</span>
            </div>
          </div>
        </div>

        {/* Versements */}
        <div className="p-6 rounded-xl bg-[var(--card)] border border-[var(--card-border)] space-y-4">
          <h3 className="font-semibold text-[var(--foreground)]">Historique des versements</h3>
          <div className="space-y-3">
            {MOCK_VERSEMENTS.map((v) => (
              <div key={v.id} className="flex items-center justify-between py-2 border-b border-[var(--card-border)] last:border-0">
                <div>
                  <p className="text-sm text-[var(--foreground)]">{v.date}</p>
                  <p className="text-xs text-[var(--text-muted)]">{v.methode}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-emerald-400">{formatPrice(v.montant)}</p>
                  <p className="text-xs text-emerald-400/60">Versé</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Classement des apporteurs</h2>

        {/* Podium */}
        <div className="flex items-end justify-center gap-4 py-6">
          {/* 2nd */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-gray-400/20 flex items-center justify-center text-2xl">🥈</div>
            <p className="text-sm font-medium text-[var(--foreground)]">{LEADERBOARD[1].nom}</p>
            <p className="text-xs text-[var(--text-muted)]">{formatPrice(LEADERBOARD[1].commissions)}</p>
            <div className="w-20 h-24 bg-gray-400/10 rounded-t-lg mx-auto" />
          </div>
          {/* 1st */}
          <div className="text-center space-y-2">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#1e9df1]/20 flex items-center justify-center text-3xl">🥇</div>
            <p className="text-sm font-bold text-[#1e9df1]">{LEADERBOARD[0].nom}</p>
            <p className="text-xs text-[var(--text-muted)]">{formatPrice(LEADERBOARD[0].commissions)}</p>
            <div className="w-20 h-32 bg-[#1e9df1]/10 rounded-t-lg mx-auto" />
          </div>
          {/* 3rd */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-700/20 flex items-center justify-center text-xl">🥉</div>
            <p className="text-sm font-medium text-[var(--foreground)]">{LEADERBOARD[2].nom}</p>
            <p className="text-xs text-[var(--text-muted)]">{formatPrice(LEADERBOARD[2].commissions)}</p>
            <div className="w-20 h-16 bg-amber-700/10 rounded-t-lg mx-auto" />
          </div>
        </div>

        {/* Full table */}
        <div className="rounded-xl bg-[var(--card)] border border-[var(--card-border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--card-border)]">
                <th className="text-left p-4 text-[var(--text-muted)] font-medium">#</th>
                <th className="text-left p-4 text-[var(--text-muted)] font-medium">Apporteur</th>
                <th className="text-right p-4 text-[var(--text-muted)] font-medium">Apports</th>
                <th className="text-right p-4 text-[var(--text-muted)] font-medium">Commissions</th>
              </tr>
            </thead>
            <tbody>
              {LEADERBOARD.map((l) => (
                <tr
                  key={l.rank}
                  className={`border-b border-[var(--card-border)] last:border-0 transition ${
                    l.isYou ? "bg-[#1e9df1]/5" : "hover:bg-[var(--hover-bg)]"
                  }`}
                >
                  <td className="p-4 text-[var(--foreground)] font-bold">{l.rank}</td>
                  <td className="p-4 text-[var(--foreground)] font-medium">
                    {l.nom} {l.isYou && <span className="text-xs text-[#1e9df1]">(vous)</span>}
                  </td>
                  <td className="p-4 text-right text-[var(--text-secondary)]">{l.apports}</td>
                  <td className="p-4 text-right text-[var(--foreground)] font-medium">{formatPrice(l.commissions)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
