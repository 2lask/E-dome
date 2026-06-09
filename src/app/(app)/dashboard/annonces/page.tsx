"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  ShoppingBag,
  GraduationCap,
  Video,
  CalendarDays,
  Briefcase,
  Eye,
  Edit3,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Mes annonces & produits — vue agrégée du compte.
   Réunit dans une seule grille tout ce que l'utilisateur publie :
   biens, produits boutique, formations, lives, événements, services.
   Données fictives. Filtres simples par type + recherche.
   ───────────────────────────────────────────────────────────── */

type ListingType = "bien" | "produit" | "formation" | "live" | "evenement" | "service";

interface Listing {
  id: string;
  type: ListingType;
  title: string;
  status: "publie" | "brouillon" | "expire";
  views: number;
  publishedAt: string;
  cover: string;
  metric?: string;
}

const TYPE_LABEL: Record<ListingType, string> = {
  bien: "Bien immobilier",
  produit: "Produit boutique",
  formation: "Formation",
  live: "Live",
  evenement: "Événement",
  service: "Service",
};

const TYPE_ICON: Record<ListingType, React.ComponentType<{ size?: number }>> = {
  bien: Building2,
  produit: ShoppingBag,
  formation: GraduationCap,
  live: Video,
  evenement: CalendarDays,
  service: Briefcase,
};

const MOCK_LISTINGS: Listing[] = [
  { id: "l1", type: "bien", title: "Villa moderne avec piscine", status: "publie", views: 2840, publishedAt: "2026-04-12", cover: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400", metric: "1 850 000 CHF" },
  { id: "l2", type: "bien", title: "Studio centre-ville Genève", status: "publie", views: 1240, publishedAt: "2026-04-08", cover: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400", metric: "Location LT · 2 200 CHF/mois" },
  { id: "l3", type: "formation", title: "Maîtriser la location courte durée", status: "publie", views: 3120, publishedAt: "2026-03-22", cover: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400", metric: "189 CHF · 4.8★ (124 avis)" },
  { id: "l4", type: "live", title: "Décrypter les annonces immobilières", status: "brouillon", views: 0, publishedAt: "2026-05-01", cover: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400", metric: "Programmé le 2026-06-12" },
  { id: "l5", type: "produit", title: "Plaid lin lavé bleu nuit", status: "publie", views: 480, publishedAt: "2026-04-18", cover: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400", metric: "89 CHF · stock 14" },
  { id: "l6", type: "evenement", title: "Visite groupée : Chalet Verbier", status: "publie", views: 230, publishedAt: "2026-05-05", cover: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400", metric: "8 places · 75 CHF" },
  { id: "l7", type: "service", title: "Photographe immobilier Lausanne", status: "publie", views: 612, publishedAt: "2026-03-14", cover: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400", metric: "À partir de 350 CHF/séance" },
  { id: "l8", type: "bien", title: "Penthouse panoramique Zurich", status: "expire", views: 4800, publishedAt: "2026-01-20", cover: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400", metric: "3 200 000 CHF" },
];

const FILTERS: { value: ListingType | "all"; label: string }[] = [
  { value: "all", label: "Tout" },
  { value: "bien", label: "Biens" },
  { value: "produit", label: "Produits" },
  { value: "formation", label: "Formations" },
  { value: "live", label: "Lives" },
  { value: "evenement", label: "Événements" },
  { value: "service", label: "Services" },
];

const STATUS_STYLE: Record<Listing["status"], { label: string; bg: string; color: string }> = {
  publie: { label: "Publiée", bg: "color-mix(in srgb, var(--success) 10%, transparent)", color: "var(--success)" },
  brouillon: { label: "Brouillon", bg: "rgba(115,115,115,0.10)", color: "#525252" },
  expire: { label: "Expirée", bg: "rgba(244,63,94,0.10)", color: "#e11d48" },
};

export default function MesAnnoncesPage() {
  const [filter, setFilter] = useState<ListingType | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return MOCK_LISTINGS.filter((l) => {
      if (filter !== "all" && l.type !== filter) return false;
      if (search && !l.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [filter, search]);

  const counts = useMemo(() => {
    const c: Record<ListingType | "all", number> = { all: MOCK_LISTINGS.length, bien: 0, produit: 0, formation: 0, live: 0, evenement: 0, service: 0 };
    MOCK_LISTINGS.forEach((l) => { c[l.type] += 1; });
    return c;
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl page-heading text-[var(--foreground)]">Mes annonces &amp; produits</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Toutes vos publications, tous pôles confondus.
          </p>
        </div>
        <Link
          href="/publier"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          <Plus size={16} />
          Nouvelle annonce
        </Link>
      </header>

      {/* Search + filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher dans mes annonces…"
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none transition-colors"
            style={{ background: "var(--card)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className="shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{
                background: active ? "var(--primary)" : "var(--card)",
                color: active ? "var(--primary-foreground)" : "var(--text-secondary)",
                border: "1px solid " + (active ? "var(--primary)" : "var(--card-border)"),
              }}
            >
              <span>{f.label}</span>
              <span
                className="tabular-nums text-[10px] px-1.5 py-0.5 rounded-full"
                style={{
                  background: active ? "rgba(255,255,255,0.18)" : "var(--hover-bg)",
                  color: active ? "var(--primary-foreground)" : "var(--text-muted)",
                }}
              >
                {counts[f.value]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grille des annonces */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-sm" style={{ color: "var(--text-muted)" }}>
          Aucune annonce ne correspond à votre recherche.
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((l) => {
            const Icon = TYPE_ICON[l.type];
            const statusStyle = STATUS_STYLE[l.status];
            return (
              <li
                key={l.id}
                className="rounded-2xl overflow-hidden transition-colors"
                style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={l.cover} alt="" className="w-full h-full object-cover" />
                  <span
                    className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium"
                    style={{ background: "rgba(255,255,255,0.92)", color: "var(--foreground)" }}
                  >
                    <Icon size={12} />
                    {TYPE_LABEL[l.type]}
                  </span>
                  <span
                    className="absolute top-2 right-2 inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium"
                    style={{ background: statusStyle.bg, color: statusStyle.color }}
                  >
                    {statusStyle.label}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-semibold text-[var(--foreground)] leading-tight line-clamp-1">{l.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] tabular-nums">{l.metric}</p>
                  <div className="flex items-center justify-between text-[11px] mt-2" style={{ color: "var(--text-muted)" }}>
                    <span className="inline-flex items-center gap-1">
                      <Eye size={12} />
                      <span className="tabular-nums">{l.views.toLocaleString("fr-CH")} vues</span>
                    </span>
                    <span className="tabular-nums">Publiée le {l.publishedAt}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      style={{ background: "var(--hover-bg)", color: "var(--foreground)" }}
                    >
                      <Edit3 size={12} />
                      Modifier
                    </button>
                    <button
                      className="px-2 py-1.5 rounded-lg transition-colors"
                      style={{ background: "var(--hover-bg)", color: "var(--text-secondary)" }}
                      aria-label="Plus d'actions"
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
