"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Link from "next/link";
import {
  Search, MapPin, Star, Map as MapIcon, X, Loader2,
  Building2, TrendingUp, Building, Home, Mountain, Landmark, Crown, Square,
  TreePine, ArrowRight, ShieldCheck, Sparkles, ChevronDown, SlidersHorizontal,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { HorizontalScroller } from "@/components/ui/horizontal-scroller";
import { AirbnbPropertyCard } from "@/components/ui/airbnb-property-card";
import { useLockBodyScroll } from "@/lib/hooks/use-lock-body-scroll";
import { properties as ALL_PROPERTIES } from "@/lib/mock-data";
import type { Property, TransactionType, PropertyType, Currency } from "@/lib/types";

// ─── Constantes ─────────────────────────────────────────────────────────────

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

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "recommande", label: "Recommandés" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "rendement", label: "Meilleur rendement" },
];

const BEDROOM_OPTIONS = ["", "1", "2", "3", "4"];

const priceSuffix = (t: TransactionType) =>
  t === "location-ct" ? " / nuit" : t === "location-lt" ? " / mois" : "";
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const compactPrice = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`);

// ─── Page ───────────────────────────────────────────────────────────────────

export default function ExplorerPage() {
  const { formatPrice, toggleFavorite, isFavorite, favorites } = useApp();

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<PropertyType | "">("");
  const [filterTransaction, setFilterTransaction] = useState<TransactionType | "all">("all");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterPriceMin, setFilterPriceMin] = useState("");
  const [filterPriceMax, setFilterPriceMax] = useState("");
  const [filterBedrooms, setFilterBedrooms] = useState("");
  const [sortBy, setSortBy] = useState("recommande");
  const [showMap, setShowMap] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<Property[]>([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loadingMore, setLoadingMore] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Record<string, HTMLElement>>({});

  useLockBodyScroll(showMap);

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

  // ─── Collections ────────────────────────────────────────────────────────
  const coupsDeCoeur = useMemo(
    () =>
      [...ALL_PROPERTIES]
        .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.rating ?? 0) - (a.rating ?? 0))
        .slice(0, 10),
    [],
  );

  /* Recommandations : biens similaires aux favoris (même type / même ville /
     bien notés). Repli sur les coups de cœur si aucun favori. Réactif aux
     favoris (dépend de `favorites`). */
  const recommended = useMemo(() => {
    const favs = ALL_PROPERTIES.filter((p) => favorites.has(p.id));
    if (favs.length === 0) return coupsDeCoeur;
    const favTypes = new Set(favs.map((p) => p.type));
    const favCities = new Set(favs.map((p) => p.location.city));
    return ALL_PROPERTIES
      .filter((p) => !favorites.has(p.id))
      .map((p) => ({
        p,
        score: (favTypes.has(p.type) ? 2 : 0) + (favCities.has(p.location.city) ? 1.5 : 0) + (p.rating ?? 0) / 5,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((x) => x.p);
  }, [favorites, coupsDeCoeur]);
  const hasFavorites = favorites.size > 0;

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

  const destinations = useMemo(() => {
    const map = new Map<string, { city: string; country: string; image: string; count: number }>();
    for (const p of ALL_PROPERTIES) {
      const key = p.location.city;
      if (!map.has(key)) map.set(key, { city: p.location.city, country: p.location.country, image: p.images[0], count: 0 });
      map.get(key)!.count++;
    }
    return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 6);
  }, []);

  // ─── Filtrage ───────────────────────────────────────────────────────────
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
    else if (sortBy === "rendement") results.sort((a, b) => (b.analytics?.rendementBrut ?? 0) - (a.analytics?.rendementBrut ?? 0));
    else results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.rating ?? 0) - (a.rating ?? 0));
    return results;
  }, [search, filterType, filterTransaction, filterCountry, filterPriceMin, filterPriceMax, filterBedrooms, sortBy]);

  const visibleProperties = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => { setVisibleCount((p) => p + 8); setLoadingMore(false); }, 400);
  };

  const resetFilters = () => {
    setFilterType(""); setFilterTransaction("all"); setFilterCountry("");
    setFilterPriceMin(""); setFilterPriceMax(""); setFilterBedrooms(""); setSearch("");
  };

  const scrollToResults = useCallback(() => {
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, []);

  // ─── Carte (vue split) ──────────────────────────────────────────────────
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
    markersRef.current = {};

    const withCoords = filtered.filter((p) => p.location.lat != null && p.location.lng != null);
    withCoords.forEach((prop) => {
      const suffix = priceSuffix(prop.transactionType);
      const el = document.createElement("div");
      el.innerHTML = `<span style="display:inline-block;background:var(--card);color:var(--foreground);border:1px solid var(--card-border);padding:4px 9px;border-radius:20px;font-size:12px;font-weight:700;white-space:nowrap;box-shadow:0 1px 6px rgba(0,0,0,0.18);transition:transform .15s,background .15s;cursor:pointer">${compactPrice(prop.price)}${suffix ? "" : ""}</span>`;
      const popup = new maplibregl.Popup({ offset: 24, closeButton: false }).setHTML(
        `<div style="font-family:system-ui;min-width:200px">
          <img src="${prop.images[0]}" style="width:100%;height:110px;object-fit:cover;border-radius:8px 8px 0 0" />
          <div style="padding:8px 10px">
            <p style="font-weight:600;margin:0;font-size:13px">${prop.title}</p>
            <p style="color:var(--primary);font-weight:700;margin:4px 0;font-size:14px">${formatPrice(prop.price, prop.currency as Currency)}${suffix}</p>
            <a href="/explorer/${prop.id}" style="display:inline-flex;gap:4px;color:var(--primary);font-size:12px;font-weight:600;text-decoration:none">Voir le bien →</a>
          </div>
        </div>`,
      );
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([prop.location.lng!, prop.location.lat!])
        .setPopup(popup)
        .addTo(map);
      el.addEventListener("mouseenter", () => setHoveredId(prop.id));
      el.addEventListener("mouseleave", () => setHoveredId(null));
      markersRef.current[prop.id] = el;
      void marker;
    });

    const coords = withCoords.map((p) => [p.location.lng!, p.location.lat!] as [number, number]);
    if (coords.length > 1) {
      const bounds = new maplibregl.LngLatBounds();
      coords.forEach((c) => bounds.extend(c));
      map.fitBounds(bounds, { padding: 70 });
    }

    mapInstanceRef.current = map;
    return () => { map.remove(); mapInstanceRef.current = null; markersRef.current = {}; };
  }, [showMap, filtered, formatPrice]);

  // Surlignage du pin au survol d'une carte (et inversement).
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, el]) => {
      const span = el.firstElementChild as HTMLElement | null;
      if (!span) return;
      const active = id === hoveredId;
      span.style.background = active ? "var(--primary)" : "var(--card)";
      span.style.color = active ? "var(--primary-foreground)" : "var(--foreground)";
      span.style.transform = active ? "scale(1.18)" : "scale(1)";
      span.style.boxShadow = active ? "0 5px 16px rgba(0,0,0,0.32)" : "0 1px 6px rgba(0,0,0,0.18)";
      el.style.zIndex = active ? "20" : "1";
    });
  }, [hoveredId]);

  // ─── Carte bien (grille) ────────────────────────────────────────────────
  const renderCard = (prop: Property) => {
    const suffix = priceSuffix(prop.transactionType);
    const subtitle = [prop.bedrooms > 0 ? `${prop.bedrooms} ch.` : null, `${prop.area} m²`].filter(Boolean).join(" · ");
    const r = prop.analytics?.rendementBrut;
    const bottomBadge =
      prop.transactionType === "vente" && r && r > 0
        ? { label: `${r.toFixed(1)}% brut`, tone: (r > 7 ? "warning" : r >= 5 ? "success" : "info") as "success" | "warning" | "info" }
        : undefined;
    return (
      <AirbnbPropertyCard
        key={prop.id}
        href={`/explorer/${prop.id}`}
        images={prop.images}
        type={capitalize(prop.type)}
        location={prop.location.city}
        subtitle={subtitle}
        priceLabel={`${formatPrice(prop.price, prop.currency)}${suffix}`}
        rating={prop.rating}
        highlighted={prop.featured}
        bottomBadge={bottomBadge}
        favorited={isFavorite(prop.id)}
        onToggleFavorite={() => toggleFavorite(prop.id)}
      />
    );
  };

  const priceLabelPill = filterPriceMin || filterPriceMax
    ? `${filterPriceMin ? compactPrice(Number(filterPriceMin)) : "0"} – ${filterPriceMax ? compactPrice(Number(filterPriceMax)) : "∞"}`
    : null;

  return (
    <div className="max-w-7xl mx-auto pb-24">
      {/* ── Hero compact ────────────────────────────────────────────────── */}
      <header className="pt-1 pb-5">
        <h1 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight text-[var(--foreground)]">
          Trouvez le lieu qui vous ressemble.
        </h1>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[var(--success)]" /> {ALL_PROPERTIES.length} biens vérifiés</span>
          <span className="inline-flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> Rendement transparent</span>
          <span className="inline-flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Sans intermédiaire</span>
        </div>
      </header>

      {/* ── Barre de recherche + filtres (sticky) ───────────────────────── */}
      <div className="sticky top-2 z-30 mb-6">
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)]/95 backdrop-blur-md p-2.5 shadow-sm space-y-2.5">
          {/* Ligne 1 : transaction + carte */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex gap-1 p-1 rounded-xl bg-[var(--input-bg)] overflow-x-auto no-scrollbar">
              {TRANSACTION_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilterTransaction(tab.value)}
                  className={`flex-1 whitespace-nowrap py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                    filterTransaction === tab.value
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                      : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowMap(true)}
              className="shrink-0 inline-flex items-center gap-1.5 h-10 px-4 rounded-full border border-[var(--card-border)] text-sm font-medium text-[var(--foreground)] hover:border-[var(--text-muted)] transition-colors"
            >
              <MapIcon className="w-4 h-4" /> <span className="hidden sm:inline">Carte</span>
            </button>
          </div>

          {/* Ligne 2 : recherche + pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") scrollToResults(); }}
                placeholder="Ville, pays, type…"
                className="w-full h-10 pl-10 pr-9 rounded-full bg-[var(--input-bg)] border border-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
              {search && (
                <button onClick={() => setSearch("")} aria-label="Effacer" className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--hover-bg)]">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <FilterDropdown label="Prix" value={priceLabelPill} active={!!priceLabelPill} width="w-72">
              <p className="text-xs font-medium text-[var(--text-muted)] mb-2">Fourchette de prix</p>
              <div className="flex items-center gap-2">
                <input type="number" value={filterPriceMin} onChange={(e) => setFilterPriceMin(e.target.value)} placeholder="Min" className="w-full h-9 px-3 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-sm outline-none focus:border-[var(--primary)]" />
                <span className="text-[var(--text-muted)]">–</span>
                <input type="number" value={filterPriceMax} onChange={(e) => setFilterPriceMax(e.target.value)} placeholder="Max" className="w-full h-9 px-3 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-sm outline-none focus:border-[var(--primary)]" />
              </div>
              {priceLabelPill && (
                <button onClick={() => { setFilterPriceMin(""); setFilterPriceMax(""); }} className="mt-2 text-xs text-[var(--primary)] hover:underline">Effacer</button>
              )}
            </FilterDropdown>

            <FilterDropdown label="Chambres" value={filterBedrooms ? `${filterBedrooms}+ ch.` : null} active={!!filterBedrooms} width="w-64">
              <p className="text-xs font-medium text-[var(--text-muted)] mb-2">Chambres minimum</p>
              <div className="flex gap-1.5">
                {BEDROOM_OPTIONS.map((n) => (
                  <button
                    key={n || "any"}
                    onClick={() => setFilterBedrooms(n)}
                    className={`flex-1 h-9 rounded-lg text-sm font-medium border transition-colors ${
                      filterBedrooms === n ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]" : "border-[var(--card-border)] text-[var(--foreground)] hover:bg-[var(--hover-bg)]"
                    }`}
                  >
                    {n === "" ? "Tout" : `${n}+`}
                  </button>
                ))}
              </div>
            </FilterDropdown>

            <FilterDropdown label="Pays" value={filterCountry || null} active={!!filterCountry} width="w-56">
              <div className="space-y-0.5">
                <button onClick={() => setFilterCountry("")} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${!filterCountry ? "bg-[var(--primary)]/10 text-[var(--primary)] font-medium" : "hover:bg-[var(--hover-bg)] text-[var(--foreground)]"}`}>Tous les pays</button>
                {COUNTRIES.map((c) => (
                  <button key={c} onClick={() => setFilterCountry(c)} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${filterCountry === c ? "bg-[var(--primary)]/10 text-[var(--primary)] font-medium" : "hover:bg-[var(--hover-bg)] text-[var(--foreground)]"}`}>{c}</button>
                ))}
              </div>
            </FilterDropdown>

            <div className="ml-auto">
              <FilterDropdown label={SORT_OPTIONS.find((s) => s.value === sortBy)?.label ?? "Trier"} align="right" width="w-56" icon={<SlidersHorizontal className="w-3.5 h-3.5" />}>
                <div className="space-y-0.5">
                  {SORT_OPTIONS.map((s) => (
                    <button key={s.value} onClick={() => setSortBy(s.value)} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${sortBy === s.value ? "bg-[var(--primary)]/10 text-[var(--primary)] font-medium" : "hover:bg-[var(--hover-bg)] text-[var(--foreground)]"}`}>{s.label}</button>
                  ))}
                </div>
              </FilterDropdown>
            </div>
          </div>
        </div>
      </div>

      {/* ── Chips catégories (filtre type) ──────────────────────────────── */}
      <div className="mb-8 -mx-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 px-1 min-w-max">
          {CATEGORY_CHIPS.map((item) => {
            const active = filterType === item.type;
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => setFilterType(active ? "" : item.type)}
                className={`flex flex-col items-center justify-center gap-1.5 shrink-0 min-w-[74px] px-3 py-2.5 rounded-xl border transition-colors ${
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

      {/* ══ DÉCOUVERTE (aucun filtre) ═══════════════════════════════════ */}
      {!hasActiveQuery && (
        <div className="space-y-12 mb-14">
          <HorizontalScroller
            title={hasFavorites ? "Recommandé pour vous" : "Sélection E-Dome"}
            subtitle={hasFavorites ? "D'après les biens que vous avez aimés" : "Nos biens les mieux notés"}
            cardWidth="260px"
            gap="16px"
          >
            {recommended.map(renderCard)}
          </HorizontalScroller>

          <section>
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-[var(--foreground)] mb-4">Explorer par destination</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {destinations.map((d) => (
                <button
                  key={d.city}
                  onClick={() => { setSearch(d.city); scrollToResults(); }}
                  className="group relative h-36 md:h-44 rounded-2xl overflow-hidden text-left"
                >
                  <img src={d.image} alt={d.city} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold text-lg leading-tight">{d.city}</p>
                    <p className="text-white/80 text-xs mt-0.5">{d.country} · {d.count} bien{d.count > 1 ? "s" : ""}</p>
                  </div>
                  <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight className="w-4 h-4" /></span>
                </button>
              ))}
            </div>
          </section>

          {meilleursRendements.length > 0 && (
            <HorizontalScroller title="Meilleurs rendements" subtitle="À la vente · rendement brut le plus élevé" cardWidth="260px" gap="16px">
              {meilleursRendements.map(renderCard)}
            </HorizontalScroller>
          )}
          {sejoursCourts.length > 0 && (
            <HorizontalScroller title="Séjours courte durée" subtitle="Réservez à la nuit" cardWidth="260px" gap="16px">
              {sejoursCourts.map(renderCard)}
            </HorizontalScroller>
          )}
          {recentlyViewed.length > 0 && (
            <HorizontalScroller title="Consultés récemment" cardWidth="220px" gap="16px">
              {recentlyViewed.map(renderCard)}
            </HorizontalScroller>
          )}
        </div>
      )}

      {/* ══ RÉSULTATS ═══════════════════════════════════════════════════ */}
      <div ref={resultsRef} className="scroll-mt-40">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-[var(--foreground)]">
              {hasActiveQuery ? "Résultats" : "Tous les biens"}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {filtered.length} bien{filtered.length > 1 ? "s" : ""}{search && <> · « {search} »</>}
            </p>
          </div>
        </div>

        {hasActiveQuery && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {filterTransaction !== "all" && <FilterChip label={TRANSACTION_TABS.find((t) => t.value === filterTransaction)?.label ?? ""} onClear={() => setFilterTransaction("all")} />}
            {filterType && <FilterChip label={capitalize(filterType)} onClear={() => setFilterType("")} />}
            {filterCountry && <FilterChip label={filterCountry} onClear={() => setFilterCountry("")} />}
            {filterBedrooms && <FilterChip label={`${filterBedrooms}+ ch.`} onClear={() => setFilterBedrooms("")} />}
            {priceLabelPill && <FilterChip label={priceLabelPill} onClear={() => { setFilterPriceMin(""); setFilterPriceMax(""); }} />}
            <button onClick={resetFilters} className="text-xs font-medium text-[var(--primary)] hover:underline ml-1">Tout effacer</button>
          </div>
        )}

        {visibleProperties.length === 0 ? (
          <div className="text-center py-24 rounded-2xl border border-dashed border-[var(--card-border)]">
            <Building2 className="w-14 h-14 text-[var(--text-muted)] mx-auto mb-4" />
            <p className="text-lg font-medium text-[var(--foreground)] mb-1">Aucun bien trouvé</p>
            <p className="text-sm text-[var(--text-secondary)] mb-5">Élargissez vos critères pour voir plus de biens.</p>
            <button onClick={resetFilters} className="px-5 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 transition">Réinitialiser</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
            {visibleProperties.map(renderCard)}
          </div>
        )}

        {visibleProperties.length > 0 && (
          <div className="flex flex-col items-center gap-3 mt-10">
            <p className="text-sm text-[var(--text-muted)]">{visibleProperties.length} sur {filtered.length} bien{filtered.length > 1 ? "s" : ""}</p>
            {hasMore ? (
              <button onClick={loadMore} disabled={loadingMore} className="px-6 py-3 rounded-xl border border-[var(--card-border)] font-medium text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors disabled:opacity-60 flex items-center gap-2">
                {loadingMore ? <><Loader2 className="w-4 h-4 animate-spin" /> Chargement…</> : "Charger plus de biens"}
              </button>
            ) : (
              <p className="text-sm text-[var(--text-muted)] italic">Vous avez tout vu.</p>
            )}
          </div>
        )}
      </div>

      {/* ══ VUE CARTE + LISTE SYNCHRONISÉE ══════════════════════════════ */}
      {showMap && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[var(--background)]">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--card-border)] bg-[var(--card)] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--primary-foreground)] shrink-0" style={{ background: "var(--primary)" }}><MapIcon size={18} /></div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)] text-sm">Carte des biens</h3>
                <p className="text-xs text-[var(--text-muted)]">{filtered.length} bien{filtered.length > 1 ? "s" : ""}</p>
              </div>
            </div>
            <button onClick={() => setShowMap(false)} aria-label="Fermer" className="flex items-center justify-center w-11 h-11 rounded-xl text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 flex min-h-0">
            {/* Carte */}
            <div className="relative flex-1 min-w-0">
              <div id="map-container" className="absolute inset-0" />
            </div>
            {/* Liste synchronisée (desktop) */}
            <div className="hidden lg:block w-[380px] xl:w-[440px] shrink-0 border-l border-[var(--card-border)] overflow-y-auto bg-[var(--background)]">
              <div className="p-3 space-y-1">
                {filtered.map((prop) => {
                  const suffix = priceSuffix(prop.transactionType);
                  const r = prop.analytics?.rendementBrut;
                  return (
                    <div key={prop.id} onMouseEnter={() => setHoveredId(prop.id)} onMouseLeave={() => setHoveredId(null)}>
                      <Link
                        href={`/explorer/${prop.id}`}
                        className={`flex gap-3 p-2 rounded-xl transition-colors ${hoveredId === prop.id ? "bg-[var(--hover-bg)]" : "hover:bg-[var(--hover-bg)]"}`}
                      >
                        <div className="relative w-28 h-24 rounded-lg overflow-hidden shrink-0">
                          <img src={prop.images[0]} alt="" className="w-full h-full object-cover" />
                          <button
                            onClick={(e) => { e.preventDefault(); toggleFavorite(prop.id); }}
                            aria-label="Favori"
                            className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center"
                          >
                            <Star size={16} fill={isFavorite(prop.id) ? "#ff385c" : "rgba(0,0,0,0.35)"} stroke="#fff" strokeWidth={1.5} className="drop-shadow" />
                          </button>
                        </div>
                        <div className="min-w-0 flex-1 py-0.5">
                          <p className="text-sm font-semibold text-[var(--foreground)] truncate">{prop.title}</p>
                          <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> {prop.location.city}</p>
                          <p className="text-sm font-bold text-[var(--foreground)] mt-1">{formatPrice(prop.price, prop.currency)}<span className="text-xs font-normal text-[var(--text-muted)]">{suffix}</span></p>
                          {prop.transactionType === "vente" && r && r > 0 && (
                            <p className="text-[11px] text-[var(--success)] font-medium mt-0.5">{r.toFixed(1)}% brut</p>
                          )}
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sous-composants ─────────────────────────────────────────────────────────

function FilterDropdown({
  label, value, active = false, children, align = "left", width = "w-64", icon,
}: {
  label: string;
  value?: string | null;
  active?: boolean;
  children: React.ReactNode;
  align?: "left" | "right";
  width?: string;
  icon?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const on = active || open;
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 h-10 px-3.5 rounded-full border text-sm font-medium transition-colors ${
          active
            ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
            : on
            ? "border-[var(--primary)] text-[var(--foreground)]"
            : "border-[var(--card-border)] text-[var(--foreground)] hover:border-[var(--text-muted)]"
        }`}
      >
        {icon}
        <span>{value ?? label}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <div className={`absolute z-50 mt-2 ${align === "right" ? "right-0" : "left-0"} ${width} rounded-xl border border-[var(--card-border)] bg-[var(--card)] shadow-xl p-3 animate-scale-in`}>
            {children}
          </div>
        </>
      )}
    </div>
  );
}

function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-medium">
      {label}
      <button onClick={onClear} aria-label={`Retirer ${label}`} className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-[var(--primary)]/20"><X className="w-3 h-3" /></button>
    </span>
  );
}
