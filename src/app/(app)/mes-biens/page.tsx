"use client";

import { ActorGate } from "@/components/dashboard/actor-dashboard";
import React, { useState, useMemo, useEffect } from "react";
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
  Gift,
  Check,
  X as XIcon,
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
import { useApp } from "@/lib/context";
import { publishedBy, seqOfSessionId } from "@/lib/demo/session-views";
import { sessionTime } from "@/lib/demo/session-store";
import { frDate } from "@/lib/demo/showcase";
import { listMyProperties } from "@/lib/supabase/property-actions";
import { setMyPrime, liftMyPrime, listMyPrimes } from "@/lib/supabase/prime-actions";
import {
  coverOf,
  primeEligible,
  PRIME_MIN_CHF,
  PRIME_MAX_CHF,
  type MyProperty,
  type MyPrime,
} from "@/lib/my-property";
import { useToast } from "@/components/ui/toast";

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

function MesAnnoncesPage() {
  const [filter, setFilter] = useState<ListingType | "all">("all");
  const [search, setSearch] = useState("");
  const { state, actorId } = useSession();
  const { currentUser } = useApp();

  /* Compte RÉEL connecté : « Mes annonces » lit les biens EN BASE (table
     `properties`), pas la démonstration. On les charge une fois, puis on les
     affiche tels quels — aucune donnée fictive ne m'appartient. */
  const [dbProps, setDbProps] = useState<MyProperty[]>([]);
  const [dbLoaded, setDbLoaded] = useState(false);
  useEffect(() => {
    if (!currentUser) return;
    let active = true;
    listMyProperties().then((rows) => {
      if (active) { setDbProps(rows); setDbLoaded(true); }
    });
    return () => { active = false; };
  }, [currentUser]);

  const listings = useMemo<Listing[]>(() => {
    if (currentUser) {
      return dbProps.map((p) => ({
        id: p.id,
        type: "bien" as const,
        title: p.title,
        status: p.soldTo ? ("vendu" as const) : ("publie" as const),
        cover: coverOf(p),
        metric: `${priceMetric(p.price, p.currency, p.transactionType)} · ${p.city}`,
        href: `/explorer/${p.id}`,
        isNew: false,
      }));
    }
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
  }, [state, actorId, currentUser, dbProps]);

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

      {/* Primes apporteur (C5) — compte réel uniquement, sur les biens à la
          vente ou en location longue durée. */}
      {currentUser && dbLoaded && <PrimesPanel biens={dbProps} />}
    </div>
  );
}

/* ── Primes apporteur ────────────────────────────────────────────────────────

   « Ton réseau te rapporte » côté vendeur : poser une prime FIXE en CHF
   (50–3000) sur un de ses biens, persistée en base (table `primes`). Elle est
   due quand le vendeur accepte le contact qu'un apporteur lui amène — jamais un
   % du prix, jamais conditionnée à la vente (règle `MODELE.md`). La découverte
   par les apporteurs et la mise en relation arrivent à la tranche suivante. */
function PrimesPanel({ biens }: { biens: MyProperty[] }) {
  const { addToast } = useToast();
  const [primes, setPrimes] = useState<Record<string, MyPrime>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    listMyPrimes().then((rows) => {
      if (active) setPrimes(Object.fromEntries(rows.map((r) => [r.propertyId, r])));
    });
    return () => { active = false; };
  }, []);

  const eligible = biens.filter((b) => primeEligible(b.transactionType));
  if (eligible.length === 0) return null;

  const valueOf = (id: string) => drafts[id] ?? (primes[id]?.active ? String(primes[id].amountChf) : "");

  const save = async (id: string) => {
    const amount = Math.round(Number(valueOf(id)));
    if (!Number.isFinite(amount) || amount < PRIME_MIN_CHF || amount > PRIME_MAX_CHF) {
      addToast(`La prime doit être comprise entre ${PRIME_MIN_CHF} et ${PRIME_MAX_CHF} CHF.`, "error");
      return;
    }
    setBusy(id);
    const res = await setMyPrime(id, amount);
    setBusy(null);
    if (!res.ok) {
      addToast("Impossible d'enregistrer la prime. Réessayez.", "error");
      return;
    }
    setPrimes((p) => ({ ...p, [id]: { propertyId: id, amountChf: amount, active: true } }));
    setDrafts((d) => { const n = { ...d }; delete n[id]; return n; });
    addToast(`Prime de ${amount} CHF enregistrée.`, "success");
  };

  const lift = async (id: string) => {
    setBusy(id);
    const res = await liftMyPrime(id);
    setBusy(null);
    if (!res.ok) { addToast("Impossible de retirer la prime. Réessayez.", "error"); return; }
    setPrimes((p) => ({ ...p, [id]: { propertyId: id, amountChf: p[id]?.amountChf ?? 0, active: false } }));
    setDrafts((d) => { const n = { ...d }; delete n[id]; return n; });
    addToast("Prime retirée.", "info");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-4 w-4 text-[var(--primary)]" />
          Primes apporteur
        </CardTitle>
        <CardDescription>
          Offrez une prime fixe en CHF ({PRIME_MIN_CHF}–{PRIME_MAX_CHF}) à qui vous amène le bon contact.
          Due à l&apos;acceptation du contact, jamais un % du prix, jamais conditionnée à la vente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {eligible.map((b) => {
          const current = primes[b.id];
          const activeChf = current?.active ? current.amountChf : null;
          return (
            <div
              key={b.id}
              className="flex flex-col gap-3 rounded-lg border bg-card p-3 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{b.title}</p>
                <p className="text-xs text-muted-foreground">
                  {b.city} · {b.transactionType === "vente" ? "Vente" : "Location longue durée"}
                  {activeChf !== null ? (
                    <span className="ml-1 font-medium text-emerald-600 dark:text-emerald-400">
                      · prime active {activeChf} CHF
                    </span>
                  ) : (
                    <span className="ml-1">· aucune prime</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Input
                    type="number"
                    min={PRIME_MIN_CHF}
                    max={PRIME_MAX_CHF}
                    step={10}
                    value={valueOf(b.id)}
                    onChange={(e) => setDrafts((d) => ({ ...d, [b.id]: e.target.value }))}
                    placeholder="CHF"
                    className="w-28"
                  />
                </div>
                <Button size="sm" onClick={() => save(b.id)} disabled={busy === b.id}>
                  <Check className="mr-1 h-3.5 w-3.5" />
                  {activeChf !== null ? "Mettre à jour" : "Activer"}
                </Button>
                {activeChf !== null && (
                  <Button size="sm" variant="outline" onClick={() => lift(b.id)} disabled={busy === b.id}>
                    <XIcon className="mr-1 h-3.5 w-3.5" />
                    Retirer
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

/* Le tableau de bord suit la personne incarnée (chantier P3) : Léo voit cette
   page, toute autre personne voit la sienne (`ActorGate`). */
export default function Page() {
  return (
    <ActorGate section="annonces">
      <MesAnnoncesPage />
    </ActorGate>
  );
}
