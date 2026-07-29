"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Link from "next/link";
import {
  Search, SlidersHorizontal, Heart, MapPin, Bed, Bath, Maximize, Star,
  Grid3X3, List, Map as MapIcon, X, Loader2, Building2, TrendingUp,
  Building, Home, Mountain, Landmark, Crown, Square, TreePine, ArrowRight,
  ShieldCheck, Sparkles, ChevronRight,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { HorizontalScroller } from "@/components/ui/horizontal-scroller";
import { AirbnbPropertyCard } from "@/components/ui/airbnb-property-card";
import { useLockBodyScroll, useIsMobile } from "@/lib/hooks/use-lock-body-scroll";
import { properties as ALL_PROPERTIES } from "@/lib/mock-data";
import type { Property, TransactionType, PropertyType, Currency } from "@/lib/types";

// ─── Constantes ─────────────────────────────────────────────────────────────

const PROPERTY_TYPES: { value: PropertyType | ""; label: string }[] = [
  { value: "", label: "Tout type" },
  { value: "appartement", label: "Appartement" },
  { value: "villa", label: "Villa" },
  { value: "maison", label: "Maison" },
  { value: "chalet", label: "Chalet" },
  { value: "studio", label: "Studio" },
  { value: "penthouse", label: "Penthouse" },
  { value: "riad", label: "Riad" },
  { value: "terrain", label: "Terrain" },
];

const COUNTRIES = ["Suisse", "Maroc", "France", "Émirats arabes unis"];

const CATEGORY_CHIPS: { type: PropertyType | ""; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { type: "", label: "Tous", icon: Building2 },
  { type: "appartement", label: "Appartement", icon: Building },
  { type: "villa", label: "Villa", icon: Home },
  { type: "penthouse", label: "Penthouse", icon: Crown },
  { type: "chalet", label: "Chalet", icon: Mountain },
  { type: "riad", label: "Riad", icon: Landmark },
  { type: "studio", label: "Studio", icon: Square },
  { type: "maison", label: "Maison", icon: Home },
  { type: "terrain", label: "Terrain", icon: TreePine },
];

const TRANSACTION_TABS: { value: TransactionType | "all"; label: string }[] = [
  { value: "all", label: "Tout" },
  { value: "vente", label: "Acheter" },
  { value: "location-lt", label: "Louer" },
  { value: "location-ct", label: "Court séjour" },
];

const priceSuffix = (t: TransactionType) =>
  t === "location-ct" ? " / nuit" : t === "location-lt" ? " / mois" : "";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// ─── Page ───────────────────────────────────────────────────────────────────

export default function ExplorerPage() {
  const { formatPrice, toggleFavorite, isFavorite } = useApp();

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState<PropertyType | "">("");
  const [filterTransaction, setFilterTransaction] = useState<TransactionType | "all">("all");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterPriceMin, setFilterPriceMin] = useState("");
  const [filterPriceMax, setFilterPriceMax] = useState("");
  const [filterBedrooms, setFilterBedrooms] = useState("");
  const [sortBy, setSortBy] = useState<"recommande" | "price-asc" | "price-desc" | "rendement">("recommande");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMap, setShowMap] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<Property[]>([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loadingMore, setLoadingMore] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);

  const isMobile = useIsMobile();
  useLockBodyScroll(showFilters && isMobile);

  // Un filtre/recherche est actif → on passe en mode « résultats » (on masque
  // les collections éditoriales pour se concentrer sur la recherche).
  const hasActiveQuery =
    Boolean(search) || Boolean(filterType) || filterTransaction !== "all" ||
    Boolean(filterCountry) || Boolean(filterPriceMin) || Boolean(filterPriceMax) ||
    Boolean(filterBedrooms);

  useEffect(() => { setVisibleCount(8); }, [
    search, filterType, filterTransaction, filterCountry, filterPriceMin, filterPriceMax, filterBedrooms, sortBy,
  ]);

  useEffect(() => {
    try {
      const rv = localStorage.getItem("edome_recently_viewed");
      if (rv) {
        const ids: string[] = JSON.parse(rv);
        setRecentlyViewed(ALL_PROPERTIES.filter((p) => ids.includes(p.id)));
      }
    } catch { /* ignore */ }
  }, []);

  // ─── Collections éditoriales (mode découverte) ──────────────────────────
  const coupsDeCoeur = useMemo(
    () =>
      [...ALL_PROPERTIES]
        .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.rating ?? 0) - (a.rating ?? 0))
        .slice(0, 10),
    [],
  );
  const meilleursRendements = useMemo(
    () =>
      ALL_PROPERTIES.filter((p) => p.transactionType === "vente" && (p.analytics?.rendementBrut ?? 0) > 0)
        .sort((a, b) => (b.analytics!.rendementBrut) - (a.analytics!.rendementBrut))
        .slice(0, 10),
    [],
  );
  const sejoursCourts = useMemo(
    () => ALL_PROPERTIES.filter((p) => p.transactionType === "location-ct").slice(0, 10),
    [],
  );

  // Destinations : villes les plus représentées + une image de couverture.
  const destinations = useMemo(() => {
    const map = new Map<string, { city: string; country: string; image: string; count: number }>();
    for (const p of ALL_PROPERTIES) {
      const key = p.location.city;
      if (!map.has(key)) {
        map.set(key, { city: p.location.city, country: p.location.country, image: p.images[0], count: 0 });
      }
      map.get(key)!.count++;
    }
    return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 6);
  }, []);

  // ─── Résultats filtrés ──────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let results = [...ALL_PROPERTIES];
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.city.toLowerCase().includes(q) ||
          p.location.country.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q),
      );
    }
    if (filterType) results = results.filter((p) => p.type === filterType);
    if (filterTransaction !== "all") results = results.filter((p) => p.transactionType === filterTransaction);
    if (filterCountry) results = results.filter((p) => p.location.country === filterCountry);
    if (filterPriceMin) results = results.filter((p) => p.price >= Number(filterPriceMin));
    if (filterPriceMax) results = results.filter((p) => p.price <= Number(filterPriceMax));
    if (filterBedrooms) results = results.filter((p) => p.bedrooms >= Number(filterBedrooms));

    if (sortBy === "price-asc") results.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") results.sort((a, b) => b.price - a.price);
    else if (sortBy === "rendement")
      results.sort((a, b) => (b.analytics?.rendementBrut ?? 0) - (a.analytics?.rendementBrut ?? 0));
    else
      results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.rating ?? 0) - (a.rating ?? 0));

    return results;
  }, [search, filterType, filterTransaction, filterCountry, filterPriceMin, filterPriceMax, filterBedrooms, sortBy]);

  const visibleProperties = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 8);
      setLoadingMore(false);
    }, 500);
  };

  const resetFilters = () => {
    setFilterType("");
    setFilterTransaction("all");
    setFilterCountry("");
    setFilterPriceMin("");
    setFilterPriceMax("");
    setFilterBedrooms("");
    setSearch("");
  };

  const scrollToResults = useCallback(() => {
    requestAnimationFrame(() =>
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  }, []);

  const pickDestination = (city: string) => {
    setSearch(city);
    scrollToResults();
  };

  // ─── Carte MapLibre (coordonnées réelles) ───────────────────────────────
  useEffect(() => {
    if (!showMap) return;
    const container = document.getElementById("map-container");
    if (!container) return;

    const map = new maplibregl.Map({
      container,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [8.2, 46.8],
      zoom: 4,
    });
    map.addControl(new maplibregl.NavigationControl(), "bottom-right");

    const withCoords = filtered.filter((p) => p.location.lat != null && p.location.lng != null);
    withCoords.forEach((prop) => {
      const suffix = priceSuffix(prop.transactionType);
      const el = document.createElement("div");
      el.innerHTML = `<span style="background:var(--primary);color:var(--primary-foreground);padding:4px 9px;border-radius:20px;font-size:12px;font-weight:700;white-space:nowrap;box-shadow:0 2px 10px rgba(0,0,0,0.25)">${formatPrice(prop.price, prop.currency as Currency)}${suffix}</span>`;
      const popup = new maplibregl.Popup({ offset: 24, closeButton: false }).setHTML(
        `<div style="font-family:system-ui;min-width:210px">
          <img src="${prop.images[0]}" style="width:100%;height:120px;object-fit:cover;border-radius:8px 8px 0 0" />
          <div style="padding:8px 10px">
            <p style="font-weight:600;margin:0;font-size:13px">${prop.title}</p>
            <p style="color:var(--primary);font-weight:700;margin:4px 0;font-size:14px">${formatPrice(prop.price, prop.currency as Currency)}${suffix}</p>
            <a href="/explorer/${prop.id}" style="display:inline-flex;gap:4px;margin-top:2px;color:var(--primary);font-size:12px;font-weight:600;text-decoration:none">Voir le bien →</a>
          </div>
        </div>`,
      );
      new maplibregl.Marker({ element: el })
        .setLngLat([prop.location.lng!, prop.location.lat!])
        .setPopup(popup)
        .addTo(map);
    });

    const coords = withCoords.map((p) => [p.location.lng!, p.location.lat!] as [number, number]);
    if (coords.length > 1) {
      const bounds = new maplibregl.LngLatBounds();
      coords.forEach((c) => bounds.extend(c));
      map.fitBounds(bounds, { padding: 60 });
    }

    mapInstanceRef.current = map;
    return () => { map.remove(); mapInstanceRef.current = null; };
  }, [showMap, filtered, formatPrice]);

  // ─── Rendu d'une carte bien (réutilise AirbnbPropertyCard) ──────────────
  const renderCard = (prop: Property) => {
    const suffix = priceSuffix(prop.transactionType);
    const priceLabel = `${formatPrice(prop.price, prop.currency)}${suffix}`;
    const subtitle = [prop.bedrooms > 0 ? `${prop.bedrooms} ch.` : null, `${prop.area} m²`]
      .filter(Boolean)
      .join(" · ");
    const r = prop.analytics?.rendementBrut;
    const bottomBadge =
      prop.transactionType === "vente" && r && r > 0
        ? {
            label: `${r.toFixed(1)}% brut`,
            tone: (r > 7 ? "warning" : r >= 5 ? "success" : "info") as "success" | "warning" | "info",
          }
        : undefined;
    return (
      <AirbnbPropertyCard
        key={prop.id}
        href={`/explorer/${prop.id}`}
        images={prop.images}
        type={capitalize(prop.type)}
        location={prop.location.city}
        subtitle={subtitle}
        priceLabel={priceLabel}
        rating={prop.rating}
        highlighted={prop.featured}
        bottomBadge={bottomBadge}
        favorited={isFavorite(prop.id)}
        onToggleFavorite={() => toggleFavorite(prop.id)}
      />
    );
  };

  const selectClass =
    "w-full px-3 py-2 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] appearance-none cursor-pointer";

  return (
    <div className="max-w-7xl mx-auto pb-24">
      {/* ── Hero éditorial ─────────────────────────────────────────────── */}
      <header className="pt-2 pb-6">
        <h1 className="font-serif text-3xl md:text-5xl leading-[1.05] tracking-tight text-[var(--foreground)]">
          Trouvez le lieu
          <br className="hidden sm:block" /> qui vous ressemble.
        </h1>
        <p className="mt-3 max-w-xl text-[15px] text-[var(--text-secondary)]">
          Acheter, louer ou investir — sans intermédiaire, avec le rendement affiché en toute
          transparence.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[var(--success)]" /> {ALL_PROPERTIES.length} biens vérifiés</span>
          <span className="inline-flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> Rendement transparent</span>
          <span className="inline-flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Recommandez &amp; gagnez</span>
        </div>
      </header>

      {/* ── Barre de recherche + transaction (sticky) ──────────────────── */}
      <div className="sticky top-2 z-30 mb-6">
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)]/95 backdrop-blur-md p-2 shadow-sm">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") scrollToResults(); }}
                placeholder="Ville, pays, type de bien…"
                className="w-full pl-12 pr-10 py-3 rounded-xl bg-[var(--input-bg)] border border-transparent text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  aria-label="Effacer"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--hover-bg)]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`px-4 rounded-xl border transition-colors flex items-center gap-2 ${
                showFilters
                  ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]"
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Filtres</span>
            </button>
          </div>

          {/* Segment transaction */}
          <div className="mt-2 flex gap-1 p-1 rounded-xl bg-[var(--input-bg)] overflow-x-auto no-scrollbar">
            {TRANSACTION_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilterTransaction(tab.value)}
                className={`flex-1 whitespace-nowrap py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  filterTransaction === tab.value
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Chips catégories ────────────────────────────────────────────── */}
      <div className="mb-8 -mx-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 px-1 min-w-max">
          {CATEGORY_CHIPS.map((item) => {
            const active = filterType === item.type;
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => setFilterType(active ? "" : item.type)}
                className={`flex flex-col items-center justify-center gap-1.5 shrink-0 min-w-[76px] px-3 py-2.5 rounded-xl border transition-colors ${
                  active
                    ? "text-[var(--primary)] bg-[var(--primary)]/10 border-[var(--primary)]/30"
                    : "text-[var(--text-muted)] border-transparent hover:text-[var(--foreground)] hover:bg-[var(--hover-bg)]"
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
                <span className="text-[11px] font-medium tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══ MODE DÉCOUVERTE (aucun filtre actif) ════════════════════════ */}
      {!hasActiveQuery && (
        <div className="space-y-12 mb-14">
          {/* Destinations */}
          <section>
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-[var(--foreground)] mb-4">
              Explorer par destination
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {destinations.map((d) => (
                <button
                  key={d.city}
                  onClick={() => pickDestination(d.city)}
                  className="group relative h-36 md:h-44 rounded-2xl overflow-hidden text-left"
                >
                  <img
                    src={d.image}
                    alt={d.city}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold text-lg leading-tight">{d.city}</p>
                    <p className="text-white/80 text-xs mt-0.5">
                      {d.country} · {d.count} bien{d.count > 1 ? "s" : ""}
                    </p>
                  </div>
                  <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Consultés récemment */}
          {recentlyViewed.length > 0 && (
            <HorizontalScroller title="Consultés récemment" cardWidth="220px" gap="16px">
              {recentlyViewed.map(renderCard)}
            </HorizontalScroller>
          )}

          {/* Coups de cœur */}
          <HorizontalScroller
            title="Coups de cœur"
            subtitle="Les biens les mieux notés et mis en avant"
            cardWidth="260px"
            gap="16px"
          >
            {coupsDeCoeur.map(renderCard)}
          </HorizontalScroller>

          {/* Meilleurs rendements — USP E-Dome */}
          {meilleursRendements.length > 0 && (
            <HorizontalScroller
              title="Meilleurs rendements"
              subtitle="À la vente · rendement brut le plus élevé"
              cardWidth="260px"
              gap="16px"
            >
              {meilleursRendements.map(renderCard)}
            </HorizontalScroller>
          )}

          {/* Séjours courte durée */}
          {sejoursCourts.length > 0 && (
            <HorizontalScroller
              title="Séjours courte durée"
              subtitle="Réservez à la nuit"
              cardWidth="260px"
              gap="16px"
            >
              {sejoursCourts.map(renderCard)}
            </HorizontalScroller>
          )}
        </div>
      )}

      {/* ══ RÉSULTATS ═══════════════════════════════════════════════════ */}
      <div ref={resultsRef} className="scroll-mt-24">
        {/* En-tête résultats */}
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-[var(--foreground)]">
              {hasActiveQuery ? "Résultats" : "Tous les biens"}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {filtered.length} bien{filtered.length > 1 ? "s" : ""}
              {search && <> · « {search} »</>}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm bg-[var(--card)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-[var(--text-secondary)] outline-none cursor-pointer hover:border-[var(--text-muted)]"
            >
              <option value="recommande">Recommandés</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="rendement">Meilleur rendement</option>
            </select>
            <div role="group" aria-label="Affichage" className="hidden sm:flex rounded-lg border border-[var(--card-border)] overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                aria-label="Grille"
                aria-pressed={viewMode === "grid"}
                className={`flex items-center justify-center w-10 h-10 transition-colors ${viewMode === "grid" ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "text-[var(--text-muted)] hover:bg-[var(--hover-bg)]"}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                aria-label="Liste"
                aria-pressed={viewMode === "list"}
                className={`flex items-center justify-center w-10 h-10 transition-colors ${viewMode === "list" ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "text-[var(--text-muted)] hover:bg-[var(--hover-bg)]"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Chips filtres actifs */}
        {hasActiveQuery && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {filterTransaction !== "all" && (
              <FilterChip label={TRANSACTION_TABS.find((t) => t.value === filterTransaction)?.label ?? ""} onClear={() => setFilterTransaction("all")} />
            )}
            {filterType && <FilterChip label={capitalize(filterType)} onClear={() => setFilterType("")} />}
            {filterCountry && <FilterChip label={filterCountry} onClear={() => setFilterCountry("")} />}
            {filterBedrooms && <FilterChip label={`${filterBedrooms}+ ch.`} onClear={() => setFilterBedrooms("")} />}
            {(filterPriceMin || filterPriceMax) && (
              <FilterChip
                label={`${filterPriceMin || "0"} – ${filterPriceMax || "∞"}`}
                onClear={() => { setFilterPriceMin(""); setFilterPriceMax(""); }}
              />
            )}
            <button onClick={resetFilters} className="text-xs font-medium text-[var(--primary)] hover:underline ml-1">
              Tout effacer
            </button>
          </div>
        )}

        {/* Grille / Liste / Vide */}
        {visibleProperties.length === 0 ? (
          <div className="text-center py-24 rounded-2xl border border-dashed border-[var(--card-border)]">
            <Building2 className="w-14 h-14 text-[var(--text-muted)] mx-auto mb-4" />
            <p className="text-lg font-medium text-[var(--foreground)] mb-1">Aucun bien trouvé</p>
            <p className="text-sm text-[var(--text-secondary)] mb-5">Élargissez vos critères pour voir plus de biens.</p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 transition"
            >
              Réinitialiser la recherche
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
            {visibleProperties.map(renderCard)}
          </div>
        ) : (
          <div className="space-y-4">
            {visibleProperties.map((prop, idx) => {
              const suffix = priceSuffix(prop.transactionType);
              return (
                <Link
                  key={prop.id}
                  href={`/explorer/${prop.id}`}
                  className="group flex flex-col sm:flex-row gap-0 sm:gap-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] overflow-hidden hover:border-[var(--primary)]/40 hover:shadow-md transition-all animate-fade-in"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <div className="relative w-full sm:w-64 h-52 sm:h-auto shrink-0 overflow-hidden">
                    <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    {prop.featured && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ background: "#fff", color: "#222" }}>
                        Coup de cœur
                      </span>
                    )}
                    <button
                      onClick={(e) => { e.preventDefault(); toggleFavorite(prop.id); }}
                      aria-label="Favori"
                      className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <Heart size={24} fill={isFavorite(prop.id) ? "#ff385c" : "rgba(0,0,0,0.45)"} stroke={isFavorite(prop.id) ? "#ff385c" : "#fff"} strokeWidth={2} className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
                    </button>
                  </div>
                  <div className="flex-1 p-4 sm:py-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[var(--foreground)] truncate group-hover:text-[var(--primary)] transition-colors">{prop.title}</h3>
                        <p className="text-sm text-[var(--text-muted)] flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5" /> {prop.location.city}, {prop.location.country}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-[var(--foreground)] whitespace-nowrap">
                        {formatPrice(prop.price, prop.currency)}
                        <span className="text-xs font-normal text-[var(--text-muted)]">{suffix}</span>
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm text-[var(--text-secondary)]">
                      {prop.bedrooms > 0 && <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {prop.bedrooms} ch</span>}
                      {prop.bathrooms > 0 && <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {prop.bathrooms} sdb</span>}
                      <span className="flex items-center gap-1"><Maximize className="w-4 h-4" /> {prop.area} m²</span>
                      {prop.rating != null && <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-current" /> {prop.rating.toFixed(1)}</span>}
                    </div>
                    {prop.transactionType === "vente" && prop.analytics && prop.analytics.rendementBrut > 0 && (
                      <p className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--success)]">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Rendement {prop.analytics.rendementBrut.toFixed(1)}% brut · ROI 5 ans +{prop.analytics.roi5ans}%
                      </p>
                    )}
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                      Voir le bien <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Charger plus */}
        {visibleProperties.length > 0 && (
          <div className="flex flex-col items-center gap-3 mt-10">
            <p className="text-sm text-[var(--text-muted)]">
              {visibleProperties.length} sur {filtered.length} bien{filtered.length > 1 ? "s" : ""}
            </p>
            {hasMore ? (
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-6 py-3 rounded-xl border border-[var(--card-border)] font-medium text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors disabled:opacity-60 flex items-center gap-2"
              >
                {loadingMore ? <><Loader2 className="w-4 h-4 animate-spin" /> Chargement…</> : <>Charger plus de biens</>}
              </button>
            ) : (
              <p className="text-sm text-[var(--text-muted)] italic">Vous avez tout vu.</p>
            )}
          </div>
        )}
      </div>

      {/* ── Bouton carte flottant ──────────────────────────────────────── */}
      <button
        onClick={() => setShowMap(true)}
        className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-30 px-5 py-3 rounded-full font-medium flex items-center gap-2 shadow-xl text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
        style={{ background: "var(--primary)" }}
      >
        <MapIcon size={18} /> Carte
      </button>

      {/* ── Modale carte ───────────────────────────────────────────────── */}
      {showMap && (
        <div role="dialog" aria-modal="true" aria-labelledby="map-modal-title" className="fixed inset-0 z-50 flex flex-col bg-[var(--background)]">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--card-border)] bg-[var(--card)] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--primary-foreground)] shrink-0" style={{ background: "var(--primary)" }}>
                <MapIcon size={18} />
              </div>
              <div>
                <h3 id="map-modal-title" className="font-semibold text-[var(--foreground)] text-sm">Carte des biens</h3>
                <p className="text-xs text-[var(--text-muted)]">{filtered.length} bien{filtered.length > 1 ? "s" : ""}</p>
              </div>
            </div>
            <button onClick={() => setShowMap(false)} aria-label="Fermer" className="flex items-center justify-center w-11 h-11 rounded-xl text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 relative">
            <div id="map-container" className="absolute inset-0" />
          </div>
        </div>
      )}

      {/* ── Filtres : panel desktop + bottom-sheet mobile ──────────────── */}
      {showFilters && (
        <>
          <div className="hidden md:block fixed inset-0 z-40" onClick={() => setShowFilters(false)} aria-hidden />
          <div className="hidden md:block fixed right-6 top-24 z-50 w-80 p-5 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] shadow-2xl animate-scale-in">
            <FiltersBody
              selectClass={selectClass}
              filterType={filterType} setFilterType={setFilterType}
              filterCountry={filterCountry} setFilterCountry={setFilterCountry}
              filterPriceMin={filterPriceMin} setFilterPriceMin={setFilterPriceMin}
              filterPriceMax={filterPriceMax} setFilterPriceMax={setFilterPriceMax}
              filterBedrooms={filterBedrooms} setFilterBedrooms={setFilterBedrooms}
            />
            <div className="flex gap-2 mt-5">
              <button onClick={resetFilters} className="flex-1 py-2.5 rounded-xl border border-[var(--card-border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--hover-bg)]">
                Réinitialiser
              </button>
              <button onClick={() => setShowFilters(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-[var(--primary-foreground)]" style={{ background: "var(--primary)" }}>
                Voir {filtered.length} bien{filtered.length > 1 ? "s" : ""}
              </button>
            </div>
          </div>

          <div className="md:hidden fixed inset-0 z-[70] flex items-end animate-fade-in" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => setShowFilters(false)}>
            <div className="w-full max-h-[85vh] rounded-t-2xl flex flex-col animate-slide-in-bottom bg-[var(--card)] border border-b-0 border-[var(--card-border)]" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1.5 rounded-full bg-[var(--card-border)]" /></div>
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--card-border)] shrink-0">
                <h2 className="text-base font-semibold text-[var(--foreground)]">Filtres</h2>
                <button onClick={() => setShowFilters(false)} aria-label="Fermer" className="flex items-center justify-center w-11 h-11 rounded-lg text-[var(--text-muted)]"><X size={18} /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <FiltersBody
                  selectClass={selectClass}
                  filterType={filterType} setFilterType={setFilterType}
                  filterCountry={filterCountry} setFilterCountry={setFilterCountry}
                  filterPriceMin={filterPriceMin} setFilterPriceMin={setFilterPriceMin}
                  filterPriceMax={filterPriceMax} setFilterPriceMax={setFilterPriceMax}
                  filterBedrooms={filterBedrooms} setFilterBedrooms={setFilterBedrooms}
                />
              </div>
              <div className="flex gap-3 px-4 py-3 border-t border-[var(--card-border)] shrink-0" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}>
                <button onClick={resetFilters} className="flex-1 py-3 rounded-xl text-sm font-medium border border-[var(--card-border)] text-[var(--foreground)]">Réinitialiser</button>
                <button onClick={() => setShowFilters(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold text-[var(--primary-foreground)]" style={{ background: "var(--primary)" }}>
                  Voir {filtered.length} bien{filtered.length > 1 ? "s" : ""}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Sous-composants ─────────────────────────────────────────────────────────

function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-medium">
      {label}
      <button onClick={onClear} aria-label={`Retirer ${label}`} className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-[var(--primary)]/20">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

function FiltersBody(props: {
  selectClass: string;
  filterType: PropertyType | ""; setFilterType: (v: PropertyType | "") => void;
  filterCountry: string; setFilterCountry: (v: string) => void;
  filterPriceMin: string; setFilterPriceMin: (v: string) => void;
  filterPriceMax: string; setFilterPriceMax: (v: string) => void;
  filterBedrooms: string; setFilterBedrooms: (v: string) => void;
}) {
  const {
    selectClass, filterType, setFilterType, filterCountry, setFilterCountry,
    filterPriceMin, setFilterPriceMin, filterPriceMax, setFilterPriceMax,
    filterBedrooms, setFilterBedrooms,
  } = props;
  const label = "block text-xs font-medium text-[var(--text-muted)] mb-1.5";
  return (
    <div className="space-y-4">
      <div>
        <label className={label}>Type de bien</label>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value as PropertyType | "")} className={selectClass}>
          {PROPERTY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={label}>Pays</label>
        <select value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)} className={selectClass}>
          <option value="">Tous les pays</option>
          {COUNTRIES.map((c) => (<option key={c} value={c}>{c}</option>))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label}>Prix min</label>
          <input type="number" value={filterPriceMin} onChange={(e) => setFilterPriceMin(e.target.value)} placeholder="0" className={selectClass} />
        </div>
        <div>
          <label className={label}>Prix max</label>
          <input type="number" value={filterPriceMax} onChange={(e) => setFilterPriceMax(e.target.value)} placeholder="Illimité" className={selectClass} />
        </div>
      </div>
      <div>
        <label className={label}>Chambres min</label>
        <select value={filterBedrooms} onChange={(e) => setFilterBedrooms(e.target.value)} className={selectClass}>
          <option value="">Toutes</option>
          {[1, 2, 3, 4, 5].map((n) => (<option key={n} value={n}>{n}+</option>))}
        </select>
      </div>
    </div>
  );
}
