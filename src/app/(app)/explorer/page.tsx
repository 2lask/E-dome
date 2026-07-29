"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Link from "next/link";
import {
  Search, MapPin, Star, Map as MapIcon, X, Loader2, Building2, TrendingUp,
  Building, Home, Mountain, Landmark, Crown, Square, TreePine, ArrowRight,
  ShieldCheck, Sparkles, ChevronDown, SlidersHorizontal, Percent, Check, Leaf,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { HorizontalScroller } from "@/components/ui/horizontal-scroller";
import { AirbnbPropertyCard } from "@/components/ui/airbnb-property-card";
import { useLockBodyScroll } from "@/lib/hooks/use-lock-body-scroll";
import { properties as ALL_PROPERTIES } from "@/lib/mock-data";
import type { Property, TransactionType, PropertyType, Currency } from "@/lib/types";

// ─── Constantes ─────────────────────────────────────────────────────────────

const COUNTRY_META: Record<string, string> = {
  Suisse: "🇨🇭", Maroc: "🇲🇦", France: "🇫🇷", "Émirats arabes unis": "🇦🇪",
};

const TYPE_PILLS: { type: PropertyType | ""; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
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
  { value: "surface", label: "Plus grande surface" },
  { value: "rating", label: "Les mieux notés" },
];

const BEDROOM_OPTIONS = ["", "1", "2", "3", "4"];
const RENDEMENT_PRESETS = [
  { value: "", label: "Tout" },
  { value: "3", label: "≥ 3 %" },
  { value: "5", label: "≥ 5 %" },
  { value: "7", label: "≥ 7 %" },
];
const DPE_CLASSES = ["A", "B", "C", "D"];
const dpeTone = (c: string) =>
  c === "A" || c === "B" ? "text-[var(--success)]" : c === "C" ? "text-amber-500" : "text-red-500";

const priceSuffix = (t: TransactionType) =>
  t === "location-ct" ? " / nuit" : t === "location-lt" ? " / mois" : "";
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const compactPrice = (n: number) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(n % 1_000_000 ? 1 : 0)} M` : n >= 1000 ? `${Math.round(n / 1000)} k` : `${n}`);

// ─── Page ───────────────────────────────────────────────────────────────────

export default function ExplorerPage() {
  const { formatPrice, toggleFavorite, isFavorite, favorites } = useApp();

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<PropertyType | "">("");
  const [filterTransaction, setFilterTransaction] = useState<TransactionType | "all">("all");
  const [filterCountries, setFilterCountries] = useState<string[]>([]);
  const [filterPriceMin, setFilterPriceMin] = useState("");
  const [filterPriceMax, setFilterPriceMax] = useState("");
  const [filterBedrooms, setFilterBedrooms] = useState("");
  const [filterBathrooms, setFilterBathrooms] = useState("");
  const [filterRendementMin, setFilterRendementMin] = useState("");
  const [filterSurfaceMin, setFilterSurfaceMin] = useState("");
  const [filterDpe, setFilterDpe] = useState<string[]>([]);
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

  const isRent = filterTransaction === "location-ct" || filterTransaction === "location-lt";
  const pricePresets = isRent
    ? [{ label: "< 200", max: 200 }, { label: "200 – 500", min: 200, max: 500 }, { label: "500 – 2 000", min: 500, max: 2000 }, { label: "> 2 000", min: 2000 }]
    : [{ label: "< 500 k", max: 500000 }, { label: "500 k – 1 M", min: 500000, max: 1000000 }, { label: "1 – 2 M", min: 1000000, max: 2000000 }, { label: "> 2 M", min: 2000000 }];

  const plusCount = (filterBathrooms ? 1 : 0) + (filterSurfaceMin ? 1 : 0) + filterDpe.length;

  const hasActiveQuery =
    Boolean(search) || Boolean(filterType) || filterTransaction !== "all" ||
    filterCountries.length > 0 || Boolean(filterPriceMin) || Boolean(filterPriceMax) ||
    Boolean(filterBedrooms) || Boolean(filterBathrooms) || Boolean(filterRendementMin) ||
    Boolean(filterSurfaceMin) || filterDpe.length > 0;

  useEffect(() => { setVisibleCount(8); }, [
    search, filterType, filterTransaction, filterCountries, filterPriceMin, filterPriceMax,
    filterBedrooms, filterBathrooms, filterRendementMin, filterSurfaceMin, filterDpe, sortBy,
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

  // ─── Compteurs par pays ─────────────────────────────────────────────────
  const countryCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const p of ALL_PROPERTIES) m[p.location.country] = (m[p.location.country] ?? 0) + 1;
    return m;
  }, []);
  const countryList = useMemo(
    () => Object.keys(countryCounts).sort((a, b) => countryCounts[b] - countryCounts[a]),
    [countryCounts],
  );

  // ─── Collections ────────────────────────────────────────────────────────
  const coupsDeCoeur = useMemo(
    () => [...ALL_PROPERTIES].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 10),
    [],
  );
  const recommended = useMemo(() => {
    const favs = ALL_PROPERTIES.filter((p) => favorites.has(p.id));
    if (favs.length === 0) return coupsDeCoeur;
    const favTypes = new Set(favs.map((p) => p.type));
    const favCities = new Set(favs.map((p) => p.location.city));
    return ALL_PROPERTIES
      .filter((p) => !favorites.has(p.id))
      .map((p) => ({ p, score: (favTypes.has(p.type) ? 2 : 0) + (favCities.has(p.location.city) ? 1.5 : 0) + (p.rating ?? 0) / 5 }))
      .sort((a, b) => b.score - a.score).slice(0, 10).map((x) => x.p);
  }, [favorites, coupsDeCoeur]);
  const hasFavorites = favorites.size > 0;

  const meilleursRendements = useMemo(
    () => ALL_PROPERTIES.filter((p) => p.transactionType === "vente" && (p.analytics?.rendementBrut ?? 0) > 0).sort((a, b) => b.analytics!.rendementBrut - a.analytics!.rendementBrut).slice(0, 10),
    [],
  );
  const sejoursCourts = useMemo(() => ALL_PROPERTIES.filter((p) => p.transactionType === "location-ct").slice(0, 10), []);

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
    let r = [...ALL_PROPERTIES];
    if (search) {
      const q = search.toLowerCase();
      r = r.filter((p) => p.title.toLowerCase().includes(q) || p.location.city.toLowerCase().includes(q) || p.location.country.toLowerCase().includes(q) || p.type.toLowerCase().includes(q));
    }
    if (filterType) r = r.filter((p) => p.type === filterType);
    if (filterTransaction !== "all") r = r.filter((p) => p.transactionType === filterTransaction);
    if (filterCountries.length) r = r.filter((p) => filterCountries.includes(p.location.country));
    if (filterPriceMin) r = r.filter((p) => p.price >= Number(filterPriceMin));
    if (filterPriceMax) r = r.filter((p) => p.price <= Number(filterPriceMax));
    if (filterBedrooms) r = r.filter((p) => p.bedrooms >= Number(filterBedrooms));
    if (filterBathrooms) r = r.filter((p) => (p.bathrooms ?? 0) >= Number(filterBathrooms));
    if (filterSurfaceMin) r = r.filter((p) => (p.area ?? 0) >= Number(filterSurfaceMin));
    if (filterRendementMin) r = r.filter((p) => (p.analytics?.rendementBrut ?? 0) >= Number(filterRendementMin));
    if (filterDpe.length) r = r.filter((p) => p.analytics?.dpe && filterDpe.includes(p.analytics.dpe));

    if (sortBy === "price-asc") r.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") r.sort((a, b) => b.price - a.price);
    else if (sortBy === "rendement") r.sort((a, b) => (b.analytics?.rendementBrut ?? 0) - (a.analytics?.rendementBrut ?? 0));
    else if (sortBy === "surface") r.sort((a, b) => (b.area ?? 0) - (a.area ?? 0));
    else if (sortBy === "rating") r.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    else r.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.rating ?? 0) - (a.rating ?? 0));
    return r;
  }, [search, filterType, filterTransaction, filterCountries, filterPriceMin, filterPriceMax, filterBedrooms, filterBathrooms, filterSurfaceMin, filterRendementMin, filterDpe, sortBy]);

  const visibleProperties = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const loadMore = () => { setLoadingMore(true); setTimeout(() => { setVisibleCount((p) => p + 8); setLoadingMore(false); }, 400); };

  const resetFilters = () => {
    setFilterType(""); setFilterTransaction("all"); setFilterCountries([]);
    setFilterPriceMin(""); setFilterPriceMax(""); setFilterBedrooms(""); setFilterBathrooms("");
    setFilterRendementMin(""); setFilterSurfaceMin(""); setFilterDpe([]); setSearch("");
  };
  const scrollToResults = useCallback(() => {
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, []);
  const toggleInArray = (arr: string[], v: string, set: (a: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  // ─── Carte (vue split synchronisée) ─────────────────────────────────────
  useEffect(() => {
    if (!showMap) return;
    const container = document.getElementById("map-container");
    if (!container) return;
    const map = new maplibregl.Map({ container, style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json", center: [8.2, 46.8], zoom: 4 });
    map.addControl(new maplibregl.NavigationControl(), "bottom-right");
    markersRef.current = {};

    const withCoords = filtered.filter((p) => p.location.lat != null && p.location.lng != null);
    withCoords.forEach((prop) => {
      const el = document.createElement("div");
      el.innerHTML = `<span style="display:inline-block;background:var(--card);color:var(--foreground);border:1px solid var(--card-border);padding:4px 9px;border-radius:20px;font-size:12px;font-weight:700;white-space:nowrap;box-shadow:0 1px 6px rgba(0,0,0,0.18);transition:transform .15s,background .15s;cursor:pointer">${compactPrice(prop.price)}</span>`;
      const suffix = priceSuffix(prop.transactionType);
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
      new maplibregl.Marker({ element: el }).setLngLat([prop.location.lng!, prop.location.lat!]).setPopup(popup).addTo(map);
      el.addEventListener("mouseenter", () => setHoveredId(prop.id));
      el.addEventListener("mouseleave", () => setHoveredId(null));
      markersRef.current[prop.id] = el;
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
    const bottomBadge = prop.transactionType === "vente" && r && r > 0
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

  // Valeurs affichées dans les pills
  const priceLabelPill = filterPriceMin || filterPriceMax
    ? `${filterPriceMin ? compactPrice(Number(filterPriceMin)) : "0"} – ${filterPriceMax ? compactPrice(Number(filterPriceMax)) : "∞"}`
    : null;
  const roomsLabelPill = [filterBedrooms && `${filterBedrooms}+ ch`, filterBathrooms && `${filterBathrooms}+ sdb`].filter(Boolean).join(" · ") || null;
  const countryLabelPill = filterCountries.length === 0 ? null : filterCountries.length === 1 ? filterCountries[0] : `${filterCountries.length} pays`;

  return (
    <div className="max-w-7xl mx-auto pb-24">
      {/* ── Hero compact ────────────────────────────────────────────────── */}
      <header className="pt-1 pb-5">
        <h1 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight text-[var(--foreground)]">Trouvez le lieu qui vous ressemble.</h1>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[var(--success)]" /> {ALL_PROPERTIES.length} biens vérifiés</span>
          <span className="inline-flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> Rendement transparent</span>
          <span className="inline-flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Sans intermédiaire</span>
        </div>
      </header>

      {/* ── Barre recherche + filtres (sticky) ──────────────────────────── */}
      <div className="sticky top-2 z-30 mb-5">
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)]/95 backdrop-blur-md p-2.5 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex gap-1 p-1 rounded-xl bg-[var(--input-bg)] overflow-x-auto no-scrollbar">
              {TRANSACTION_TABS.map((tab) => (
                <button key={tab.value} onClick={() => setFilterTransaction(tab.value)}
                  className={`flex-1 whitespace-nowrap py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${filterTransaction === tab.value ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm" : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"}`}>
                  {tab.label}
                </button>
              ))}
            </div>
            <button onClick={() => setShowMap(true)} className="shrink-0 inline-flex items-center gap-1.5 h-10 px-4 rounded-full border border-[var(--card-border)] text-sm font-medium text-[var(--foreground)] hover:border-[var(--text-muted)] transition-colors">
              <MapIcon className="w-4 h-4" /> <span className="hidden sm:inline">Carte</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[190px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") scrollToResults(); }} placeholder="Ville, pays, type…"
                className="w-full h-10 pl-10 pr-9 rounded-full bg-[var(--input-bg)] border border-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors" />
              {search && <button onClick={() => setSearch("")} aria-label="Effacer" className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--hover-bg)]"><X className="w-3.5 h-3.5" /></button>}
            </div>

            {/* Prix */}
            <FilterDropdown label="Prix" value={priceLabelPill} active={!!priceLabelPill} width="w-80">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {pricePresets.map((p) => {
                  const on = String(p.min ?? "") === filterPriceMin && String(p.max ?? "") === filterPriceMax;
                  return (
                    <button key={p.label} onClick={() => { setFilterPriceMin(p.min ? String(p.min) : ""); setFilterPriceMax(p.max ? String(p.max) : ""); }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${on ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]" : "border-[var(--card-border)] text-[var(--foreground)] hover:bg-[var(--hover-bg)]"}`}>{p.label}</button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <input type="number" value={filterPriceMin} onChange={(e) => setFilterPriceMin(e.target.value)} placeholder="Min" className="w-full h-9 px-3 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-sm outline-none focus:border-[var(--primary)]" />
                <span className="text-[var(--text-muted)]">–</span>
                <input type="number" value={filterPriceMax} onChange={(e) => setFilterPriceMax(e.target.value)} placeholder="Max" className="w-full h-9 px-3 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-sm outline-none focus:border-[var(--primary)]" />
              </div>
              {priceLabelPill && <button onClick={() => { setFilterPriceMin(""); setFilterPriceMax(""); }} className="mt-2.5 text-xs text-[var(--primary)] hover:underline">Effacer</button>}
            </FilterDropdown>

            {/* Chambres & SDB */}
            <FilterDropdown label="Pièces" value={roomsLabelPill} active={!!roomsLabelPill} width="w-72">
              <p className="text-xs font-medium text-[var(--text-muted)] mb-1.5">Chambres min.</p>
              <div className="flex gap-1.5 mb-3">
                {BEDROOM_OPTIONS.map((n) => (
                  <button key={n || "any"} onClick={() => setFilterBedrooms(n)} className={`flex-1 h-9 rounded-lg text-sm font-medium border transition-colors ${filterBedrooms === n ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]" : "border-[var(--card-border)] text-[var(--foreground)] hover:bg-[var(--hover-bg)]"}`}>{n === "" ? "Tout" : `${n}+`}</button>
                ))}
              </div>
              <p className="text-xs font-medium text-[var(--text-muted)] mb-1.5">Salles de bain min.</p>
              <div className="flex gap-1.5">
                {BEDROOM_OPTIONS.map((n) => (
                  <button key={n || "any"} onClick={() => setFilterBathrooms(n)} className={`flex-1 h-9 rounded-lg text-sm font-medium border transition-colors ${filterBathrooms === n ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]" : "border-[var(--card-border)] text-[var(--foreground)] hover:bg-[var(--hover-bg)]"}`}>{n === "" ? "Tout" : `${n}+`}</button>
                ))}
              </div>
            </FilterDropdown>

            {/* Pays (multi + drapeaux + compteurs) */}
            <FilterDropdown label="Pays" value={countryLabelPill} active={filterCountries.length > 0} width="w-64">
              <div className="space-y-0.5">
                {countryList.map((c) => {
                  const on = filterCountries.includes(c);
                  return (
                    <button key={c} onClick={() => toggleInArray(filterCountries, c, setFilterCountries)} className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${on ? "bg-[var(--primary)]/10" : "hover:bg-[var(--hover-bg)]"}`}>
                      <span className="text-base leading-none">{COUNTRY_META[c] ?? "🏳️"}</span>
                      <span className={`flex-1 text-left ${on ? "text-[var(--primary)] font-medium" : "text-[var(--foreground)]"}`}>{c}</span>
                      <span className="text-xs text-[var(--text-muted)] tabular-nums">{countryCounts[c]}</span>
                      <span className={`w-4 h-4 rounded flex items-center justify-center border ${on ? "bg-[var(--primary)] border-[var(--primary)] text-[var(--primary-foreground)]" : "border-[var(--card-border)]"}`}>{on && <Check className="w-3 h-3" />}</span>
                    </button>
                  );
                })}
                {filterCountries.length > 0 && <button onClick={() => setFilterCountries([])} className="mt-1 text-xs text-[var(--primary)] hover:underline px-2.5">Effacer</button>}
              </div>
            </FilterDropdown>

            {/* Rendement (USP investisseur) */}
            <FilterDropdown label="Rendement" value={filterRendementMin ? `≥ ${filterRendementMin} %` : null} active={!!filterRendementMin} width="w-64" icon={<Percent className="w-3.5 h-3.5" />}>
              <p className="text-xs font-medium text-[var(--text-muted)] mb-2">Rendement brut minimum</p>
              <div className="flex gap-1.5">
                {RENDEMENT_PRESETS.map((p) => (
                  <button key={p.value || "any"} onClick={() => setFilterRendementMin(p.value)} className={`flex-1 h-9 rounded-lg text-sm font-medium border transition-colors ${filterRendementMin === p.value ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]" : "border-[var(--card-border)] text-[var(--foreground)] hover:bg-[var(--hover-bg)]"}`}>{p.label}</button>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-[var(--text-muted)]">Sur les biens à la vente avec rendement communiqué.</p>
            </FilterDropdown>

            {/* Plus de filtres */}
            <FilterDropdown label="Plus" active={plusCount > 0} badge={plusCount} width="w-72" icon={<SlidersHorizontal className="w-3.5 h-3.5" />}>
              <p className="text-xs font-medium text-[var(--text-muted)] mb-1.5">Surface minimum (m²)</p>
              <input type="number" value={filterSurfaceMin} onChange={(e) => setFilterSurfaceMin(e.target.value)} placeholder="Ex : 100" className="w-full h-9 px-3 mb-3 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-sm outline-none focus:border-[var(--primary)]" />
              <p className="text-xs font-medium text-[var(--text-muted)] mb-1.5 inline-flex items-center gap-1"><Leaf className="w-3 h-3" /> Classe énergétique (DPE)</p>
              <div className="flex gap-1.5">
                {DPE_CLASSES.map((c) => {
                  const on = filterDpe.includes(c);
                  return (
                    <button key={c} onClick={() => toggleInArray(filterDpe, c, setFilterDpe)} className={`flex-1 h-9 rounded-lg text-sm font-bold border transition-colors ${on ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]" : `border-[var(--card-border)] hover:bg-[var(--hover-bg)] ${dpeTone(c)}`}`}>{c}</button>
                  );
                })}
              </div>
              {plusCount > 0 && <button onClick={() => { setFilterSurfaceMin(""); setFilterBathrooms(""); setFilterDpe([]); }} className="mt-3 text-xs text-[var(--primary)] hover:underline">Effacer</button>}
            </FilterDropdown>

            <div className="ml-auto">
              <FilterDropdown label={SORT_OPTIONS.find((s) => s.value === sortBy)?.label ?? "Trier"} align="right" width="w-56" icon={<TrendingUp className="w-3.5 h-3.5" />}>
                <div className="space-y-0.5">
                  {SORT_OPTIONS.map((s) => (
                    <button key={s.value} onClick={() => setSortBy(s.value)} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${sortBy === s.value ? "bg-[var(--primary)]/10 text-[var(--primary)] font-medium" : "hover:bg-[var(--hover-bg)] text-[var(--foreground)]"}`}>
                      {s.label}{sortBy === s.value && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </FilterDropdown>
            </div>
          </div>
        </div>
      </div>

      {/* ── Type de bien : pills horizontales (refonte) ─────────────────── */}
      <div className="mb-8 -mx-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 px-1 min-w-max">
          {TYPE_PILLS.map((item) => {
            const active = filterType === item.type;
            const Icon = item.icon;
            return (
              <button key={item.label} onClick={() => setFilterType(active ? "" : item.type)}
                className={`inline-flex items-center gap-2 h-9 px-4 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${
                  active
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]"
                    : "border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[var(--text-muted)] hover:text-[var(--foreground)]"
                }`}>
                <Icon className="w-4 h-4" /> {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ══ DÉCOUVERTE ══════════════════════════════════════════════════ */}
      {!hasActiveQuery && (
        <div className="space-y-12 mb-14">
          <HorizontalScroller title={hasFavorites ? "Recommandé pour vous" : "Sélection E-Dome"} subtitle={hasFavorites ? "D'après les biens que vous avez aimés" : "Nos biens les mieux notés"} cardWidth="260px" gap="16px">
            {recommended.map(renderCard)}
          </HorizontalScroller>

          <section>
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-[var(--foreground)] mb-4">Explorer par destination</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {destinations.map((d) => (
                <button key={d.city} onClick={() => { setSearch(d.city); scrollToResults(); }} className="group relative h-36 md:h-44 rounded-2xl overflow-hidden text-left">
                  <img src={d.image} alt={d.city} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold text-lg leading-tight">{d.city}</p>
                    <p className="text-white/80 text-xs mt-0.5">{COUNTRY_META[d.country] ?? ""} {d.country} · {d.count} bien{d.count > 1 ? "s" : ""}</p>
                  </div>
                  <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight className="w-4 h-4" /></span>
                </button>
              ))}
            </div>
          </section>

          {meilleursRendements.length > 0 && (
            <HorizontalScroller title="Meilleurs rendements" subtitle="À la vente · rendement brut le plus élevé" cardWidth="260px" gap="16px">{meilleursRendements.map(renderCard)}</HorizontalScroller>
          )}
          {sejoursCourts.length > 0 && (
            <HorizontalScroller title="Séjours courte durée" subtitle="Réservez à la nuit" cardWidth="260px" gap="16px">{sejoursCourts.map(renderCard)}</HorizontalScroller>
          )}
          {recentlyViewed.length > 0 && (
            <HorizontalScroller title="Consultés récemment" cardWidth="220px" gap="16px">{recentlyViewed.map(renderCard)}</HorizontalScroller>
          )}
        </div>
      )}

      {/* ══ RÉSULTATS ═══════════════════════════════════════════════════ */}
      <div ref={resultsRef} className="scroll-mt-44">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-[var(--foreground)]">{hasActiveQuery ? "Résultats" : "Tous les biens"}</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">{filtered.length} bien{filtered.length > 1 ? "s" : ""}{search && <> · « {search} »</>}</p>
          </div>
        </div>

        {hasActiveQuery && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {filterTransaction !== "all" && <FilterChip label={TRANSACTION_TABS.find((t) => t.value === filterTransaction)?.label ?? ""} onClear={() => setFilterTransaction("all")} />}
            {filterType && <FilterChip label={capitalize(filterType)} onClear={() => setFilterType("")} />}
            {filterCountries.map((c) => <FilterChip key={c} label={`${COUNTRY_META[c] ?? ""} ${c}`} onClear={() => toggleInArray(filterCountries, c, setFilterCountries)} />)}
            {filterBedrooms && <FilterChip label={`${filterBedrooms}+ ch.`} onClear={() => setFilterBedrooms("")} />}
            {filterBathrooms && <FilterChip label={`${filterBathrooms}+ sdb`} onClear={() => setFilterBathrooms("")} />}
            {priceLabelPill && <FilterChip label={priceLabelPill} onClear={() => { setFilterPriceMin(""); setFilterPriceMax(""); }} />}
            {filterRendementMin && <FilterChip label={`Rendement ≥ ${filterRendementMin}%`} onClear={() => setFilterRendementMin("")} />}
            {filterSurfaceMin && <FilterChip label={`≥ ${filterSurfaceMin} m²`} onClear={() => setFilterSurfaceMin("")} />}
            {filterDpe.map((c) => <FilterChip key={c} label={`DPE ${c}`} onClear={() => toggleInArray(filterDpe, c, setFilterDpe)} />)}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">{visibleProperties.map(renderCard)}</div>
        )}

        {visibleProperties.length > 0 && (
          <div className="flex flex-col items-center gap-3 mt-10">
            <p className="text-sm text-[var(--text-muted)]">{visibleProperties.length} sur {filtered.length} bien{filtered.length > 1 ? "s" : ""}</p>
            {hasMore ? (
              <button onClick={loadMore} disabled={loadingMore} className="px-6 py-3 rounded-xl border border-[var(--card-border)] font-medium text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors disabled:opacity-60 flex items-center gap-2">
                {loadingMore ? <><Loader2 className="w-4 h-4 animate-spin" /> Chargement…</> : "Charger plus de biens"}
              </button>
            ) : <p className="text-sm text-[var(--text-muted)] italic">Vous avez tout vu.</p>}
          </div>
        )}
      </div>

      {/* ══ VUE CARTE + LISTE ═══════════════════════════════════════════ */}
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
            <div className="relative flex-1 min-w-0"><div id="map-container" className="absolute inset-0" /></div>
            <div className="hidden lg:block w-[380px] xl:w-[440px] shrink-0 border-l border-[var(--card-border)] overflow-y-auto bg-[var(--background)]">
              <div className="p-3 space-y-1">
                {filtered.map((prop) => {
                  const suffix = priceSuffix(prop.transactionType);
                  const r = prop.analytics?.rendementBrut;
                  return (
                    <div key={prop.id} onMouseEnter={() => setHoveredId(prop.id)} onMouseLeave={() => setHoveredId(null)}>
                      <Link href={`/explorer/${prop.id}`} className={`flex gap-3 p-2 rounded-xl transition-colors ${hoveredId === prop.id ? "bg-[var(--hover-bg)] ring-1 ring-[var(--primary)]/30" : "hover:bg-[var(--hover-bg)]"}`}>
                        <div className="relative w-28 h-24 rounded-lg overflow-hidden shrink-0">
                          <img src={prop.images[0]} alt="" className="w-full h-full object-cover" />
                          <button onClick={(e) => { e.preventDefault(); toggleFavorite(prop.id); }} aria-label="Favori" className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center">
                            <Star size={16} fill={isFavorite(prop.id) ? "#ff385c" : "rgba(0,0,0,0.35)"} stroke="#fff" strokeWidth={1.5} className="drop-shadow" />
                          </button>
                        </div>
                        <div className="min-w-0 flex-1 py-0.5">
                          <p className="text-sm font-semibold text-[var(--foreground)] truncate">{prop.title}</p>
                          <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> {prop.location.city}</p>
                          <p className="text-sm font-bold text-[var(--foreground)] mt-1">{formatPrice(prop.price, prop.currency)}<span className="text-xs font-normal text-[var(--text-muted)]">{suffix}</span></p>
                          {prop.transactionType === "vente" && r && r > 0 && <p className="text-[11px] text-[var(--success)] font-medium mt-0.5">{r.toFixed(1)}% brut</p>}
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
  label, value, active = false, children, align = "left", width = "w-64", icon, badge,
}: {
  label: string;
  value?: string | null;
  active?: boolean;
  children: React.ReactNode;
  align?: "left" | "right";
  width?: string;
  icon?: React.ReactNode;
  badge?: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 h-10 px-3.5 rounded-full border text-sm font-medium transition-colors ${
          active
            ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
            : open
            ? "border-[var(--primary)] text-[var(--foreground)]"
            : "border-[var(--card-border)] text-[var(--foreground)] hover:border-[var(--text-muted)]"
        }`}
      >
        {icon}
        <span>{value ?? label}</span>
        {badge ? <span className="ml-0.5 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-[var(--primary-foreground)]/25 text-[10px] font-bold tabular-nums">{badge}</span> : null}
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
