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
  Megaphone,
  FileText,
  CalendarCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KpiCardIcon } from "@/components/dashboard/kpi-card-icon";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";

/* Refonte Annonces : aligne sur le pattern shadcn-admin + brutaliste.
   Vue agregee de tout ce que l'utilisateur publie : biens, produits
   boutique, formations, lives, evenements, services.
   - 4 KPI cards en haut
   - Recherche + filtres pills
   - Grille de cards mono-style (cover + meta + actions discrete) */

type ListingType =
  | "bien"
  | "produit"
  | "formation"
  | "live"
  | "evenement"
  | "service";

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
  bien: "Bien",
  produit: "Produit",
  formation: "Formation",
  live: "Live",
  evenement: "Événement",
  service: "Service",
};

const TYPE_ICON: Record<
  ListingType,
  React.ComponentType<{ className?: string; size?: number }>
> = {
  bien: Building2,
  produit: ShoppingBag,
  formation: GraduationCap,
  live: Video,
  evenement: CalendarDays,
  service: Briefcase,
};

const STATUS_MAP: Record<Listing["status"], string> = {
  publie: "published",
  brouillon: "draft",
  expire: "cancelled",
};

const MOCK_LISTINGS: Listing[] = [
  { id: "l1", type: "bien", title: "Villa moderne avec piscine", status: "publie", views: 2840, publishedAt: "2026-04-12", cover: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400", metric: "1 850 000 CHF" },
  { id: "l2", type: "bien", title: "Studio centre-ville Genève", status: "publie", views: 1240, publishedAt: "2026-04-08", cover: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400", metric: "Location LT · 2 200 CHF/mois" },
  { id: "l3", type: "formation", title: "Maîtriser la location courte durée", status: "publie", views: 3120, publishedAt: "2026-03-22", cover: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400", metric: "189 CHF · 4.8/5 (124 avis)" },
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

export default function MesAnnoncesPage() {
  const [filter, setFilter] = useState<ListingType | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return MOCK_LISTINGS.filter((l) => {
      if (filter !== "all" && l.type !== filter) return false;
      if (search && !l.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [filter, search]);

  const counts = useMemo(() => {
    const c: Record<ListingType | "all", number> = {
      all: MOCK_LISTINGS.length,
      bien: 0,
      produit: 0,
      formation: 0,
      live: 0,
      evenement: 0,
      service: 0,
    };
    MOCK_LISTINGS.forEach((l) => {
      c[l.type] += 1;
    });
    return c;
  }, []);

  const totalViews = MOCK_LISTINGS.reduce((s, l) => s + l.views, 0);
  const publishedCount = MOCK_LISTINGS.filter((l) => l.status === "publie")
    .length;
  const draftCount = MOCK_LISTINGS.filter((l) => l.status === "brouillon")
    .length;

  return (
    <div className="space-y-4">
      <div className="mb-2 flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mes annonces</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Tout ce que vous publiez : biens, produits, formations, lives, événements, services
          </p>
        </div>
        <Button variant="default" size="sm" asChild>
          <Link href="/publier">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle annonce
          </Link>
        </Button>
      </div>

      {/* 4 KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCardIcon
          title="Total annonces"
          value={String(MOCK_LISTINGS.length)}
          delta={`${publishedCount} publiées, ${draftCount} brouillons`}
          icon={Megaphone}
          deltaTone="neutral"
        />
        <KpiCardIcon
          title="Vues totales"
          value={formatNumber(totalViews)}
          delta="Cumul depuis la publication"
          icon={Eye}
          deltaTone="up"
        />
        <KpiCardIcon
          title="Brouillons"
          value={String(draftCount)}
          delta={draftCount > 0 ? "À finaliser" : "Aucun"}
          icon={FileText}
          deltaTone={draftCount > 0 ? "neutral" : "up"}
        />
        <KpiCardIcon
          title="Programmées"
          value={String(MOCK_LISTINGS.filter((l) => l.status === "brouillon").length)}
          delta="Lives & événements à venir"
          icon={CalendarCheck}
          deltaTone="neutral"
        />
      </div>

      <Card>
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-medium">
                Catalogue ({filtered.length})
              </CardTitle>
              <CardDescription>Filtrer par type ou rechercher</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un titre..."
                className="h-9 w-64 rounded-md border bg-background pl-8 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                aria-pressed={filter === f.value}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs transition-colors",
                  filter === f.value
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label}
                <span className="ml-1.5 tabular-nums opacity-70">
                  {counts[f.value]}
                </span>
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              {search
                ? `Aucune annonce pour "${search}".`
                : "Aucune annonce dans cette catégorie."}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((l) => {
                const Icon = TYPE_ICON[l.type];
                return (
                  <article
                    key={l.id}
                    className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-colors hover:border-foreground"
                  >
                    {/* Cover image */}
                    <div className="relative aspect-[16/9] bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={l.cover}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="inline-flex items-center gap-1 rounded-md bg-background/90 px-2 py-0.5 text-[11px] font-medium backdrop-blur">
                          <Icon className="h-3 w-3" />
                          {TYPE_LABEL[l.type]}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <StatusBadge status={STATUS_MAP[l.status]} />
                      </div>
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 flex-col gap-2 p-3">
                      <h3 className="line-clamp-1 text-sm font-medium">
                        {l.title}
                      </h3>
                      {l.metric && (
                        <p className="text-xs text-muted-foreground">
                          {l.metric}
                        </p>
                      )}
                      <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1 tabular-nums">
                          <Eye className="h-3 w-3" />
                          {formatNumber(l.views)}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            className="rounded p-1 hover:bg-muted"
                            aria-label="Modifier"
                            title="Modifier"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            className="rounded p-1 hover:bg-muted"
                            aria-label="Plus d'options"
                            title="Plus d'options"
                          >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
