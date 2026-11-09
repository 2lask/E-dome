"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  GraduationCap,
  Video,
  Briefcase,
  Eye,
  Plus,
  Search,
  PackageSearch,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import {
  KpiCardPremium,
  KpiGrid,
} from "@/components/dashboard/kpi-card-premium";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { FilterChip } from "@/components/ui/filter-chip";
import { formatNumber } from "@/lib/format";
import { properties as CATALOGUE, formations as CATALOGUE_FORMATIONS } from "@/lib/mock-data";
import { properties as DASH_PROPERTIES } from "@/lib/dashboard-data";
import { useSession } from "@/lib/use-session";
import { publishedBy, seqOfSessionId } from "@/lib/demo/session-views";
import { sessionTime } from "@/lib/demo/session-store";
import { frDate } from "@/lib/demo/showcase";

/* ── /dashboard/annonces — « Mes annonces », dérivé ─────────────────────────

   Cette page lisait un `MOCK_LISTINGS` codé en dur : huit annonces sans
   rapport avec le catalogue (« Penthouse panoramique Zurich »), 13 322 vues
   inventées et un « +12,4 % » sorti de nulle part. Elle dérive désormais :

   - des biens que la personne HÉBERGE au catalogue, et des formations dont
     elle est l'autrice ;
   - de ce qu'elle a publié pendant la visite (mémoire de session) : un bien
     publié sur /publier, un service, une formation, un live apparaissent ici
     tout de suite.

   Les vues ne sont affichées que là où elles sont dérivées (les logements de
   courte durée, proportionnées aux nuits vendues ce mois-ci, comme sur le
   tableau de bord). Ailleurs, on n'invente pas de chiffre. Produits et
   événements n'ont pas encore de propriétaire dans la donnée (chantiers
   P4/P6) : ils ne figurent pas ici. */

type ListingType = "bien" | "formation" | "live" | "service";

interface Listing {
  id: string;
  type: ListingType;
  title: string;
  status: "publie" | "vendu";
  /** Vues du mois, si elles sont dérivées ; sinon absent. */
  views?: number;
  cover?: string;
  metric: string;
  href: string;
  /** Publiée pendant cette visite. */
  isNew: boolean;
  publishedLabel?: string;
}

const TYPE_LABEL: Record<ListingType, string> = {
  bien: "Bien",
  formation: "Formation",
  live: "Live",
  service: "Service",
};

const TYPE_ICON: Record<ListingType, React.ComponentType<{ className?: string; size?: number }>> = {
  bien: Building2,
  formation: GraduationCap,
  live: Video,
  service: Briefcase,
};

const TRANSACTION_LABEL = { vente: "Vente", "location-ct": "Courte durée", "location-lt": "Longue durée" } as const;

function priceMetric(price: number, currency: string, tx: keyof typeof TRANSACTION_LABEL): string {
  const unit = tx === "location-ct" ? " / nuit" : tx === "location-lt" ? " / mois" : "";
  return `${TRANSACTION_LABEL[tx]} · ${formatNumber(price)} ${currency}${unit}`;
}

const publishedOn = (id: string) => {
  const seq = seqOfSessionId(id);
  return seq ? `Publiée le ${frDate(sessionTime(seq))}` : undefined;
};

const FILTERS: { value: ListingType | "all"; label: string }[] = [
  { value: "all", label: "Tout" },
  { value: "bien", label: "Biens" },
  { value: "formation", label: "Formations" },
  { value: "live", label: "Lives" },
  { value: "service", label: "Services" },
];

export default function MesAnnoncesPage() {
  const [filter, setFilter] = useState<ListingType | "all">("all");
  const [search, setSearch] = useState("");
  const { state, actorId } = useSession();

  const listings = useMemo<Listing[]>(() => {
    const mine = publishedBy(state, actorId);
    const fromSession: Listing[] = [
      ...mine.listings.map((p) => ({
        id: p.id,
        type: "bien" as const,
        title: p.title,
        status: "publie" as const,
        cover: p.images[0],
        metric: `${priceMetric(p.price, p.currency, p.transactionType)} · ${p.location.city}`,
        href: `/explorer/${p.id}`,
        isNew: true,
        publishedLabel: publishedOn(p.id),
      })),
      ...mine.formations.map((f) => ({
        id: f.id,
        type: "formation" as const,
        title: f.title,
        status: "publie" as const,
        cover: f.thumbnail,
        metric: `${formatNumber(f.price)} CHF · ${f.modules.length} module${f.modules.length > 1 ? "s" : ""} · pas encore d'inscrit`,
        href: `/formations/${f.id}`,
        isNew: true,
        publishedLabel: publishedOn(f.id),
      })),
      ...mine.services.map((s) => ({
        id: s.id,
        type: "service" as const,
        title: s.title,
        status: "publie" as const,
        metric: `${s.category} · ${formatNumber(s.price)} CHF ${s.unit}`,
        href: `/services?focus=${s.id}`,
        isNew: true,
        publishedLabel: publishedOn(s.id),
      })),
      ...mine.lives.map((l) => ({
        id: l.id,
        type: "live" as const,
        title: l.title,
        status: "publie" as const,
        metric: `Programmé le ${l.dateLabel} · ${l.durationMin} min · ${l.price > 0 ? `${formatNumber(l.price)} CHF` : "gratuit"}`,
        href: `/live?focus=${l.id}`,
        isNew: true,
        publishedLabel: publishedOn(l.id),
      })),
    ];
    const fromCatalogue: Listing[] = [
      ...CATALOGUE.filter((p) => p.host.id === actorId).map((p) => ({
        id: p.id,
        type: "bien" as const,
        title: p.title,
        status: p.soldTo ? ("vendu" as const) : ("publie" as const),
        views: DASH_PROPERTIES.find((d) => d.id === p.id)?.views,
        cover: p.images[0],
        metric: `${priceMetric(p.price, p.currency, p.transactionType)} · ${p.location.city}`,
        href: `/explorer/${p.id}`,
        isNew: false,
      })),
      ...CATALOGUE_FORMATIONS.filter((f) => f.instructor.id === actorId).map((f) => ({
        id: f.id,
        type: "formation" as const,
        title: f.title,
        status: "publie" as const,
        cover: f.thumbnail,
        metric: `${formatNumber(f.price)} CHF · ${f.studentCount} inscrit${f.studentCount > 1 ? "s" : ""}${f.rating > 0 ? ` · ${f.rating.toFixed(1)}/5` : ""}`,
        href: `/formations/${f.id}`,
        isNew: false,
      })),
    ];
    return [...fromSession, ...fromCatalogue];
  }, [state, actorId]);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (filter !== "all" && l.type !== filter) return false;
      if (search && !l.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [listings, filter, search]);

  const counts = useMemo(() => {
    const c: Record<ListingType | "all", number> = { all: listings.length, bien: 0, formation: 0, live: 0, service: 0 };
    listings.forEach((l) => {
      c[l.type] += 1;
    });
    return c;
  }, [listings]);

  const withViews = listings.filter((l) => l.views !== undefined);
  const monthViews = withViews.reduce((s, l) => s + (l.views ?? 0), 0);
  const publishedCount = listings.filter((l) => l.status === "publie").length;
  const newCount = listings.filter((l) => l.isNew).length;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Mes annonces"
        description="Ce que vous publiez : biens, formations, services, lives"
        actions={
          <Button size="sm" asChild>
            <Link href="/publier">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle annonce
            </Link>
          </Button>
        }
      />

      <KpiGrid>
        <KpiCardPremium
          label="Total annonces"
          value={String(listings.length)}
          delta={`${publishedCount} en ligne`}
          trend="neutral"
          footer="Catalogue actif"
          subfooter={`${counts.bien} bien${counts.bien > 1 ? "s" : ""}, ${counts.formation} formation${counts.formation > 1 ? "s" : ""}`}
        />
        <KpiCardPremium
          label="Vues ce mois"
          value={formatNumber(monthViews)}
          delta={`${withViews.length} logement${withViews.length > 1 ? "s" : ""}`}
          trend="neutral"
          footer="Courte durée uniquement"
          subfooter="Proportionnées aux nuits vendues"
        />
        <KpiCardPremium
          label="Publiées pendant la visite"
          value={String(newCount)}
          delta={newCount > 0 ? "Nouveau" : "Aucune"}
          trend={newCount > 0 ? "up" : "neutral"}
          footer={newCount > 0 ? "Visibles partout sur la plateforme" : "Publiez un bien ou un service"}
          subfooter="Mémoire de la session"
        />
        <KpiCardPremium
          label="Biens vendus"
          value={String(listings.filter((l) => l.status === "vendu").length)}
          trend="neutral"
          footer="Restent au catalogue"
          subfooter="Avec l'avis de leur acheteur"
        />
      </KpiGrid>

      <Card>
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Catalogue ({filtered.length})</CardTitle>
              <CardDescription>Filtrer par type ou rechercher</CardDescription>
            </div>
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un titre..."
              className="w-64"
              leadingIcon={Search}
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <FilterChip
                key={f.value}
                active={filter === f.value}
                onClick={() => setFilter(f.value)}
                count={counts[f.value]}
              >
                {f.label}
              </FilterChip>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          {filtered.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title={search ? `Aucune annonce pour "${search}"` : "Aucune annonce"}
              description={
                search
                  ? "Modifiez votre recherche ou changez de filtre."
                  : "Cette catégorie est vide pour le moment."
              }
              action={{ label: "Publier une annonce", href: "/publier" }}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((l) => {
                const Icon = TYPE_ICON[l.type];
                return (
                  <Link
                    key={l.id}
                    href={l.href}
                    className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-colors hover:border-foreground"
                  >
                    <div className="relative aspect-[16/9] bg-muted">
                      {l.cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={l.cover} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <Icon className="h-8 w-8" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className="inline-flex items-center gap-1 rounded-md bg-background/90 px-2 py-0.5 text-[11px] font-medium backdrop-blur">
                          <Icon className="h-3 w-3" />
                          {TYPE_LABEL[l.type]}
                        </span>
                        {l.isNew && (
                          <span className="inline-flex items-center rounded-md bg-emerald-500/90 px-2 py-0.5 text-[11px] font-medium text-white">
                            Nouveau
                          </span>
                        )}
                      </div>
                      <div className="absolute top-2 right-2">
                        <StatusBadge status={l.status === "vendu" ? "completed" : "published"} />
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-2 p-3">
                      <h3 className="line-clamp-1 text-sm font-medium group-hover:underline">{l.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {l.status === "vendu" ? "Vendu · " : ""}
                        {l.metric}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
                        {l.views !== undefined ? (
                          <span className="inline-flex items-center gap-1 tabular-nums">
                            <Eye className="h-3 w-3" />
                            {formatNumber(l.views)} ce mois
                          </span>
                        ) : (
                          <span>{l.publishedLabel ?? ""}</span>
                        )}
                        <span className="opacity-0 transition-opacity group-hover:opacity-100">Voir →</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
