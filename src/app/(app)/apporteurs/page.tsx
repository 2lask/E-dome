"use client";

import React, { useMemo, useState } from "react";
import {
  Trophy, Medal, Award, Plus, MousePointer2, UserPlus2, CheckCircle2,
  Tag, Search, ExternalLink, Building2, GraduationCap, Calendar, ShoppingBag, Check,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { slugifyLinkLabel, buildReferralUrl, buildObjectAffiliate } from "@/lib/referral-links";
import { properties, formations } from "@/lib/mock-data";
import { EVENTS } from "../evenements/[id]/page";
import { PRODUCTS } from "../boutique/[id]/page";
import type { ReferralTargetKind } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ─── Catalogue d'annonces recommandables ────────────────────────────────
   Normalise biens / formations / événements / produits en une seule forme
   pour le picker. Les ids sont ceux reconnus par les pages de détail, donc
   le `redirect` du lien généré tombe juste. */
type CatalogItem = {
  kind: ReferralTargetKind;
  id: string;
  title: string;
  image: string;
  price: number;
  currency?: string;
  subtitle: string;
};

const KIND_LABEL: Record<ReferralTargetKind, string> = {
  bien: "Bien",
  formation: "Formation",
  evenement: "Événement",
  produit: "Produit",
};

const CATALOG_TABS: {
  key: ReferralTargetKind;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: CatalogItem[];
}[] = [
  {
    key: "bien",
    label: "Biens",
    icon: Building2,
    items: properties.map((p) => ({
      kind: "bien", id: p.id, title: p.title, image: p.images[0], price: p.price,
      currency: p.currency, subtitle: `${p.location.city} · ${p.area} m²`,
    })),
  },
  {
    key: "formation",
    label: "Formations",
    icon: GraduationCap,
    items: formations.map((f) => ({
      kind: "formation", id: f.id, title: f.title, image: f.thumbnail, price: f.price,
      currency: f.currency, subtitle: `Par ${f.instructor.firstName} ${f.instructor.lastName}`,
    })),
  },
  {
    key: "evenement",
    label: "Événements",
    icon: Calendar,
    items: EVENTS.map((e) => ({
      kind: "evenement", id: e.id, title: e.titre, image: e.thumbnail, price: e.prix,
      currency: "CHF", subtitle: `${e.type} · ${e.lieu}`,
    })),
  },
  {
    key: "produit",
    label: "Produits",
    icon: ShoppingBag,
    items: PRODUCTS.map((p) => ({
      kind: "produit", id: p.id, title: p.title, image: p.gallery[0], price: p.price,
      currency: "CHF", subtitle: p.category,
    })),
  },
];

/* ─── Mock Data ──────────────────────────────────────────────────────────── */

/* ── Modèle de rémunération (V1.0) ──────────────────────────────────────────
   L'apporteur est rémunéré sur le REVENU D'E-DOME (10–30 % de ce qu'E-Dome
   gagne sur le trafic apporté), JAMAIS sur un % du prix payé par le client,
   JAMAIS en sus du prix. Pour les ventes entre particuliers (frais fixes
   plateforme 500 / 2 500 CHF) et la location longue durée (150 / 250 / 400 CHF),
   l'apporteur touche une PART de ce frais fixe E-Dome. Pour les pôles
   marketplace (location courte, services, événements, lives, formations,
   e-commerce), il touche une PART de la commission marketplace E-Dome.
   Les bounties fixes (hôte activé, prestataire qualifié) sont du referral
   pur — ce ne sont pas des % de transaction.

   Les liens eux-mêmes (REFERRAL_LINKS) vivent maintenant dans le contexte
   global (useApp().referralLinks) pour être partagés avec le composer du
   feed — voir src/lib/referral-links.ts pour les valeurs par défaut. */

const APPORT_TYPES = [
  { title: "Amener un hôte", desc: "Invitez un propriétaire à publier ses biens sur E-Dome", icon: "\uD83C\uDFE0", commission: "Bounty fixe 100 CHF" },
  { title: "Amener un client", desc: "Présentez un acheteur ou locataire qualifié — réservation ou achat marketplace", icon: "\uD83D\uDC64", commission: "10–30 % de la commission E-Dome" },
  { title: "Amener un bien", desc: "Recommandez un bien à la vente entre particuliers ou à la location longue durée", icon: "\uD83C\uDFD7\uFE0F", commission: "10–30 % du frais plateforme" },
  { title: "Amener un prestataire", desc: "Recommandez un photographe, architecte, notaire qualifi\u00E9", icon: "\uD83D\uDCF7", commission: "Bounty fixe 100\u2013500 CHF" },
  { title: "Partenariat local", desc: "Connectez E-Dome avec un acteur local (agence, salon, association)", icon: "\uD83E\uDD1D", commission: "À négocier (B2B)" },
  { title: "Amener une formation / un événement", desc: "Recommandez une formation, un live, un événement à billetterie", icon: "\uD83D\uDD17", commission: "10–30 % de la commission marketplace" },
];

/* Mock data — montants calibrés sur le modèle V1.0 : bounties fixes pour
   hôtes / prestataires, parts (10–30 %) des frais E-Dome pour ventes et
   marketplace. Exemples :
   · Appartement Lausanne (vente ≥ 1 M) → 30 % de 2 500 CHF = 750 CHF
   · Sophie Meier (location courte 6 nuits × 200 CHF, comm. marketplace 10 %
     = 120 CHF) → 30 % de 120 = 36 CHF
   · Marc / Pierre (hôte activé) → bounty fixe 100 CHF */
const MOCK_APPORTS = [
  { id: "A-001", type: "Amener un hôte", ref: "Marc Dupont", date: "2026-03-15", status: "converti", commission: 100 },
  { id: "A-002", type: "Amener un bien", ref: "Villa Montreux (vente)", date: "2026-03-10", status: "en_cours", commission: 0 },
  { id: "A-003", type: "Amener un client", ref: "Sophie Meier (location courte)", date: "2026-02-28", status: "converti", commission: 36 },
  { id: "A-004", type: "Amener un hôte", ref: "Pierre Blanc", date: "2026-02-20", status: "converti", commission: 100 },
  { id: "A-005", type: "Amener un bien", ref: "Appartement Lausanne (vente ≥ 1 M)", date: "2026-02-15", status: "converti", commission: 750 },
  { id: "A-006", type: "Amener un client", ref: "Nadia Schmid (location courte)", date: "2026-01-30", status: "converti", commission: 48 },
];

const MOCK_VERSEMENTS = [
  { id: "V-001", date: "2026-03-01", montant: 886, methode: "Virement IBAN", statut: "verse" },
  { id: "V-002", date: "2026-02-01", montant: 48, methode: "Virement IBAN", statut: "verse" },
];

const LEADERBOARD = [
  { rank: 1, nom: "Sarah K.", apports: 52, commissions: 4200 },
  { rank: 2, nom: "Jean-Pierre D.", apports: 41, commissions: 3380 },
  { rank: 3, nom: "Laura M.", apports: 39, commissions: 3010 },
  /* Note : nom sans " (Vous)" — le rendu ajoute deja le tag (vous)
     en bleu via isYou. Avoir les deux donnait "Leo M. (Vous) (vous)". */
  { rank: 4, nom: "Léo M.", apports: 28, commissions: 1034, isYou: true },
  { rank: 5, nom: "Nadia S.", apports: 25, commissions: 1050 },
  { rank: 6, nom: "Thomas R.", apports: 22, commissions: 920 },
  { rank: 7, nom: "Amina K.", apports: 19, commissions: 780 },
  { rank: 8, nom: "Patrick L.", apports: 15, commissions: 610 },
];

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(`https://${text}`);
}

function shareEmail(url: string, label: string) {
  window.open(`mailto:?subject=E-Dome - ${label}&body=${encodeURIComponent(`https://${url}`)}`, "_blank");
}

/* Tokens semantiques au lieu de emerald-500/amber-500/red-500 hardcodes. */
const statusStyles: Record<string, string> = {
  converti: "chip-success-soft",
  en_cours: "chip-warning-soft",
  expire: "chip-danger-soft",
};

const statusLabels: Record<string, string> = {
  converti: "Converti",
  en_cours: "En cours",
  expire: "Expiré",
};

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function ApporteursPage() {
  const { formatPrice, referralLinks, addReferralLink, hasReferralLinkFor } = useApp();
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [showQR, setShowQR] = useState<number | null>(null);
  const [showNewLink, setShowNewLink] = useState(false);
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkType, setNewLinkType] = useState("Amener un hôte");

  /* ── Picker « lien pour une annonce » ── */
  const [showListingPicker, setShowListingPicker] = useState(false);
  const [listingTab, setListingTab] = useState<ReferralTargetKind>("bien");
  const [listingSearch, setListingSearch] = useState("");
  const [listingToast, setListingToast] = useState<string | null>(null);

  const currentTab = CATALOG_TABS.find((t) => t.key === listingTab)!;
  const filteredListings = useMemo(() => {
    const q = listingSearch.trim().toLowerCase();
    if (!q) return currentTab.items;
    return currentTab.items.filter(
      (it) => it.title.toLowerCase().includes(q) || it.subtitle.toLowerCase().includes(q),
    );
  }, [currentTab, listingSearch]);

  const handleCreateListingLink = (item: CatalogItem) => {
    const created = addReferralLink(
      buildObjectAffiliate(item.kind, item.id, item.title, {
        image: item.image,
        price: item.price,
        currency: item.currency,
      }),
    );
    setListingToast(created ? `Lien créé pour « ${item.title} »` : "Ce lien existe déjà dans vos liens");
    setTimeout(() => setListingToast(null), 2400);
  };

  const totalCommissions = MOCK_APPORTS.reduce((s, a) => s + a.commission, 0);
  const totalVersements = MOCK_VERSEMENTS.reduce((s, v) => s + v.montant, 0);
  const enAttente = totalCommissions - totalVersements;

  /* Funnel KPI : agrege clics / conversions sur l'ensemble des liens. */
  const funnelClicks = referralLinks.reduce((s, l) => s + l.clicks, 0);
  const funnelConversions = referralLinks.reduce((s, l) => s + l.conversions, 0);
  const funnelProspects = Math.max(funnelClicks - funnelConversions, 0);
  const conversionRate = funnelClicks > 0 ? Math.round((funnelConversions / funnelClicks) * 100) : 0;

  const handleCreateLink = () => {
    if (!newLinkLabel.trim()) return;
    const slug = slugifyLinkLabel(newLinkLabel);
    addReferralLink({
      label: newLinkLabel,
      url: buildReferralUrl(slug),
      description: `Lien personnalise cree pour : ${newLinkLabel}. Tracking 30j.`,
      commission: APPORT_TYPES.find((t) => t.title === newLinkType)?.commission ?? "Variable",
      clicks: 0,
      conversions: 0,
      earned: 0,
      color: "bg-[var(--primary)]/15 text-[var(--primary)]",
    });
    setNewLinkLabel("");
    setShowNewLink(false);
  };

  const handleCopy = (url: string, idx: number) => {
    copyToClipboard(url);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-fade-in">
      {/* Hero */}
      <section className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl page-heading text-[var(--foreground)]">
          Programme Apporteurs d&apos;Affaires
        </h1>
        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
          Générez des revenus en recommandant E-Dome à votre réseau. Chaque conversion vous reverse une part des revenus de plateforme d&apos;E-Dome (10 à 30 %) ou un bounty fixe selon le pôle, jamais ajoutée au prix payé par le client. L&apos;apporteur fait du referral marketing digital : il ne négocie aucun prix, ne représente aucune partie, n&apos;est jamais payé directement par le vendeur ou l&apos;acheteur, et n&apos;est ni agent immobilier ni courtier.
        </p>
      </section>

      {/* Bloc cadrage juridique V1.0 — KYC + double opt-in.
          Placé juste sous le hero, avant la grille d'apport, pour qu'aucun
          utilisateur n'active le programme sans avoir vu ces 2 conditions. */}
      <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
          <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider bg-[var(--primary)]/15 text-[var(--primary)] font-bold">Cadrage V1.0</span>
          Conditions du programme apporteur
        </div>
        <ul className="text-sm text-[var(--text-secondary)] space-y-2 list-none">
          <li className="flex gap-2">
            <span className="text-[var(--primary)] mt-0.5">·</span>
            <span><strong className="text-[var(--foreground)]">Activation après KYC.</strong> Vous activez vous-même la fonction apporteur après vérification d&apos;identité — c&apos;est la première opt-in.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[var(--primary)] mt-0.5">·</span>
            <span><strong className="text-[var(--foreground)]">Double opt-in.</strong> Le vendeur, l&apos;organisateur ou le prestataire peut désactiver le programme sur chaque annonce ou contenu — c&apos;est la seconde opt-in. Les deux parties gardent le contrôle.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[var(--primary)] mt-0.5">·</span>
            <span><strong className="text-[var(--foreground)]">Part prélevée sur E-Dome.</strong> Votre rémunération est toujours prélevée sur les revenus de plateforme d&apos;E-Dome (10 à 30 % de la part E-Dome, ou un bounty fixe). Elle n&apos;est jamais ajoutée au prix payé par le client.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[var(--primary)] mt-0.5">·</span>
            <span><strong className="text-[var(--foreground)]">Pas de courtage.</strong> Vous ne négociez aucun prix, ne signez aucun mandat, ne représentez aucune partie. Vous faites du referral marketing digital — vous n&apos;êtes ni agent immobilier ni courtier.</span>
          </li>
        </ul>
      </section>

      {/* Funnel KPI : visualisation clics → prospects → conversions */}
      <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
              Funnel apports — 30 derniers jours
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Taux de conversion global : <strong className="text-foreground">{conversionRate}%</strong>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <FunnelTile
            icon={MousePointer2}
            label="Clics"
            value={funnelClicks}
            pct={100}
          />
          <FunnelTile
            icon={UserPlus2}
            label="Prospects en cours"
            value={funnelProspects}
            pct={funnelClicks > 0 ? Math.round((funnelProspects / funnelClicks) * 100) : 0}
          />
          <FunnelTile
            icon={CheckCircle2}
            label="Conversions"
            value={funnelConversions}
            pct={conversionRate}
          />
        </div>
      </section>

      {/* Referral Link Cards + bouton "Nouveau lien" */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Mes liens d&apos;invitation
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowListingPicker(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
            >
              <Tag className="h-3.5 w-3.5" />
              Lien pour une annonce
            </button>
            <button
              onClick={() => setShowNewLink(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
            >
              <Plus className="h-3.5 w-3.5" />
              Lien générique
            </button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
        {referralLinks.map((link, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] space-y-4">
            {link.target ? (
              <div className="flex items-center gap-3">
                <img src={link.target.image} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${link.color}`}>
                    {KIND_LABEL[link.target.kind]}
                  </span>
                  <p className="text-sm font-medium text-[var(--foreground)] truncate mt-1">{link.target.title}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${link.color}`}>{link.label}</span>
              </div>
            )}
            <p className="text-sm text-[var(--text-secondary)]">{link.description}</p>
            <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-[var(--primary)]/20 text-[var(--primary)]">
              Rémunération : {link.commission}
            </span>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)]">
              <span className="text-xs text-[var(--text-muted)] truncate flex-1">{link.url}</span>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => handleCopy(link.url, idx)}
                className="flex-1 px-3 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90 transition"
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
            {link.redirect && (
              <a
                href={link.redirect}
                className="flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-lg border border-[var(--card-border)] text-sm text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition"
              >
                <ExternalLink size={14} /> Voir l&apos;annonce
              </a>
            )}
            {showQR === idx && (
              <div className="flex items-center justify-center p-4 rounded-lg" style={{ background: "var(--background)" }}>
                <div className="w-32 h-32 rounded flex items-center justify-center text-xs text-center"
                  style={{ background: "var(--hover-bg)", color: "var(--text-muted)", border: "1px solid var(--card-border)" }}
                >
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
        </div>
      </section>

      {/* Types d'Apport */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Types d&apos;apport</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {APPORT_TYPES.map((type, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-[var(--card)] border border-[var(--card-border)] hover:border-[var(--primary)]/40 transition space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{type.icon}</span>
                <h3 className="font-medium text-[var(--foreground)]">{type.title}</h3>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">{type.desc}</p>
              <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-[var(--primary)]/20 text-[var(--primary)]">
                Rémunération : {type.commission}
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
            { step: "1", title: "Lien cliqué", desc: "Un prospect clique sur votre lien de recommandation (activé après KYC)" },
            { step: "2", title: "Conversion confirmée", desc: "Le prospect s'inscrit et finalise une transaction sur la plateforme" },
            { step: "3", title: "Part versée", desc: "Votre part — calculée sur les revenus de plateforme d'E-Dome (10–30 %) ou un bounty fixe — est virée mensuellement" },
          ].map((s, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <div className="hidden md:block text-[var(--text-muted)] text-2xl">→</div>}
              <div className="flex-1 w-full p-5 rounded-xl bg-[var(--card)] border border-[var(--card-border)] text-center space-y-2">
                <div className="w-10 h-10 mx-auto rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold">
                  {s.step}
                </div>
                <h3 className="font-medium text-[var(--foreground)]">{s.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{s.desc}</p>
              </div>
            </React.Fragment>
          ))}
        </div>
        <p className="text-sm text-[var(--text-muted)] text-center italic">
          La part de l&apos;apporteur est prélevée sur les revenus de plateforme d&apos;E-Dome — jamais ajoutée au prix payé par l&apos;hôte ou le client.
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
                <th className="text-right p-4 text-[var(--text-muted)] font-medium">Rémunération</th>
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
          <h3 className="font-semibold text-[var(--foreground)]">Résumé de ma rémunération</h3>
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
              <span className="text-[var(--primary)] font-bold">{formatPrice(enAttente)}</span>
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
            <div className="w-16 h-16 mx-auto rounded-full bg-gray-400/20 text-gray-300 flex items-center justify-center">
              <Medal size={28} strokeWidth={2} />
            </div>
            <p className="text-sm font-medium text-[var(--foreground)]">{LEADERBOARD[1].nom}</p>
            <p className="text-xs text-[var(--text-muted)]">{formatPrice(LEADERBOARD[1].commissions)}</p>
            <div className="w-20 h-24 bg-gray-400/10 rounded-t-lg mx-auto" />
          </div>
          {/* 1st */}
          <div className="text-center space-y-2">
            <div className="w-20 h-20 mx-auto rounded-full bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center">
              <Trophy size={36} strokeWidth={2} />
            </div>
            <p className="text-sm font-bold text-[var(--primary)]">{LEADERBOARD[0].nom}</p>
            <p className="text-xs text-[var(--text-muted)]">{formatPrice(LEADERBOARD[0].commissions)}</p>
            <div className="w-20 h-32 bg-[var(--primary)]/10 rounded-t-lg mx-auto" />
          </div>
          {/* 3rd */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-700/20 text-amber-500 flex items-center justify-center">
              <Award size={22} strokeWidth={2} />
            </div>
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
                <th className="text-right p-4 text-[var(--text-muted)] font-medium">Rémunération</th>
              </tr>
            </thead>
            <tbody>
              {LEADERBOARD.map((l) => (
                <tr
                  key={l.rank}
                  className={`border-b border-[var(--card-border)] last:border-0 transition ${
                    l.isYou ? "bg-[var(--primary)]/5" : "hover:bg-[var(--hover-bg)]"
                  }`}
                >
                  <td className="p-4 text-[var(--foreground)] font-bold">{l.rank}</td>
                  <td className="p-4 text-[var(--foreground)] font-medium">
                    {l.nom} {l.isYou && <span className="text-xs text-[var(--primary)]">(vous)</span>}
                  </td>
                  <td className="p-4 text-right text-[var(--text-secondary)]">{l.apports}</td>
                  <td className="p-4 text-right text-[var(--foreground)] font-medium">{formatPrice(l.commissions)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Dialog : catalogue d'annonces → lien d'affiliation rattaché */}
      <Dialog open={showListingPicker} onOpenChange={setShowListingPicker}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer un lien pour une annonce</DialogTitle>
            <DialogDescription>
              Choisissez une annonce : son lien d&apos;affiliation et la commission sont générés
              automatiquement. Chaque clic redirige vers l&apos;annonce et est tracé.
            </DialogDescription>
          </DialogHeader>

          {/* Onglets par type d'annonce */}
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            {CATALOG_TABS.map((t) => {
              const active = listingTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => { setListingTab(t.key); setListingSearch(""); }}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition ${
                    active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <t.icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={listingSearch}
              onChange={(e) => setListingSearch(e.target.value)}
              placeholder={`Rechercher parmi les ${currentTab.label.toLowerCase()}…`}
              className="w-full rounded-md border border-border bg-background pl-9 pr-3 py-2 text-sm outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
            />
          </div>

          {/* Liste des annonces */}
          <div className="max-h-[46vh] overflow-y-auto space-y-2 pr-1">
            {filteredListings.map((it) => {
              const existing = hasReferralLinkFor(it.kind, it.id);
              return (
                <div key={it.id} className="flex items-center gap-3 rounded-xl border border-border p-2">
                  <img src={it.image} alt="" className="h-12 w-12 rounded-lg object-cover shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{it.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {it.subtitle} · {formatPrice(it.price, it.currency as any)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCreateListingLink(it)}
                    className={`shrink-0 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      existing
                        ? "bg-[var(--hover-bg)] text-[var(--text-secondary)]"
                        : "bg-[var(--primary)] text-white hover:opacity-90"
                    }`}
                  >
                    {existing ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Créé
                      </>
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5" /> Créer le lien
                      </>
                    )}
                  </button>
                </div>
              );
            })}
            {filteredListings.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">Aucune annonce ne correspond.</p>
            )}
          </div>

          {listingToast && (
            <p className="text-center text-xs font-medium text-[var(--primary)]">{listingToast}</p>
          )}

          <DialogFooter>
            <button
              type="button"
              onClick={() => setShowListingPicker(false)}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Fermer
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog : creation d'un nouveau lien d'invitation */}
      <Dialog open={showNewLink} onOpenChange={setShowNewLink}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un nouveau lien</DialogTitle>
            <DialogDescription>
              Personnalisez l&apos;intitulé. L&apos;URL est générée automatiquement avec tracking 30 jours.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground" htmlFor="link-label">
                Intitulé du lien
              </label>
              <input
                id="link-label"
                value={newLinkLabel}
                onChange={(e) => setNewLinkLabel(e.target.value)}
                placeholder="Ex : Campagne Verbier Mars"
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground" htmlFor="link-type">
                Type d&apos;apport
              </label>
              <select
                id="link-type"
                value={newLinkType}
                onChange={(e) => setNewLinkType(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
              >
                {APPORT_TYPES.map((t) => (
                  <option key={t.title} value={t.title}>{t.title}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setShowNewLink(false)}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleCreateLink}
              disabled={!newLinkLabel.trim()}
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
            >
              Créer le lien
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FunnelTile({
  icon: Icon,
  label,
  value,
  pct,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  pct: number;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="flex items-center justify-between">
        <div className="flex h-7 w-7 items-center justify-center rounded-md border text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="font-mono text-[10px] tabular-nums text-muted-foreground">{pct}%</span>
      </div>
      <p className="mt-2 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 font-mono text-2xl font-medium tabular-nums">{value}</p>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-foreground transition-all motion-reduce:transition-none"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
