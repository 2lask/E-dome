"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Link from "next/link";
import {
  Search, SlidersHorizontal, Heart, MapPin, Bed, Bath, Maximize,
  Star, ChevronDown, Grid3X3, List, Map, Bookmark, BookmarkCheck,
  X, Loader2, SortAsc, Building2, TrendingUp, Rocket,
  Building, Home, Mountain, Landmark, Crown, Square, TreePine,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { LottiePlayer } from "@/components/ui/lottie-player";
import type { Property, TransactionType, PropertyType, Currency } from "@/lib/types";

// ─── Mock properties ──────────────────────────────────────────────────────

const MOCK_PROPERTIES: Property[] = [
  {
    id: "prop1", title: "Villa moderne avec piscine", description: "Magnifique villa contemporaine",
    type: "villa", transactionType: "vente", price: 1850000, currency: "CHF",
    location: { city: "Lausanne", country: "Suisse" },
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600"],
    host: { id: "u1", firstName: "Sophie", lastName: "Martin", email: "", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", city: "Lausanne", country: "Suisse", roles: ["hote"], activeRole: "hote", stats: { followers: 0, following: 0, properties: 0, reviews: 0, rating: 0, transactions: 0, revenue: 0 }, bio: "" },
    bedrooms: 5, bathrooms: 3, area: 320, amenities: ["Piscine", "Jardin", "Garage"], rating: 4.9, reviewCount: 24, featured: true,
    analytics: { rendementBrut: 5.2, rendementNet: 3.8, prixM2: 5781, dpe: "A", etatGeneral: "Neuf", anneeConstruction: 2023, potentielPlusValue: 15, roi5ans: 32, roi10ans: 72, tauxOccupation: 95 },
  },
  {
    id: "prop2", title: "Appartement vue lac", description: "Superbe appartement avec vue imprenable",
    type: "appartement", transactionType: "location-ct", price: 250, currency: "CHF",
    location: { city: "Montreux", country: "Suisse" },
    images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600"],
    host: { id: "u2", firstName: "Marc", lastName: "Dubois", email: "", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", city: "Genève", country: "Suisse", roles: ["hote"], activeRole: "hote", stats: { followers: 0, following: 0, properties: 0, reviews: 0, rating: 0, transactions: 0, revenue: 0 }, bio: "" },
    bedrooms: 3, bathrooms: 2, area: 120, amenities: ["Vue lac", "Balcon", "Parking"], rating: 4.7, reviewCount: 56,
  },
  {
    id: "prop3", title: "Riad traditionnel Marrakech", description: "Authentique riad avec cour intérieure",
    type: "riad", transactionType: "vente", price: 380000, currency: "EUR",
    location: { city: "Marrakech", country: "Maroc" },
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600"],
    host: { id: "u3", firstName: "Amira", lastName: "El Fassi", email: "", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", city: "Marrakech", country: "Maroc", roles: ["agence"], activeRole: "agence", stats: { followers: 0, following: 0, properties: 0, reviews: 0, rating: 0, transactions: 0, revenue: 0 }, bio: "" },
    bedrooms: 4, bathrooms: 4, area: 250, amenities: ["Piscine", "Hammam", "Terrasse"], rating: 4.8, reviewCount: 89,
    analytics: { rendementBrut: 7.5, rendementNet: 5.2, prixM2: 1520, dpe: "C", etatGeneral: "Rénové", anneeConstruction: 1920, potentielPlusValue: 20, roi5ans: 45, roi10ans: 95, tauxOccupation: 78 },
  },
  {
    id: "prop4", title: "Penthouse panoramique", description: "Penthouse de luxe au dernier étage",
    type: "penthouse", transactionType: "vente", price: 3200000, currency: "CHF",
    location: { city: "Genève", country: "Suisse" },
    images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600"],
    host: { id: "u4", firstName: "Thomas", lastName: "Weber", email: "", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100", city: "Zurich", country: "Suisse", roles: ["promoteur"], activeRole: "promoteur", stats: { followers: 0, following: 0, properties: 0, reviews: 0, rating: 0, transactions: 0, revenue: 0 }, bio: "" },
    bedrooms: 4, bathrooms: 3, area: 280, amenities: ["Terrasse", "Spa", "Cave à vin"], rating: 5.0, reviewCount: 12, featured: true,
    analytics: { rendementBrut: 3.8, rendementNet: 2.5, prixM2: 11428, dpe: "A", etatGeneral: "Neuf", anneeConstruction: 2024, potentielPlusValue: 10, roi5ans: 22, roi10ans: 50, tauxOccupation: 90 },
  },
  {
    id: "prop5", title: "Chalet alpin authentique", description: "Charmant chalet en bois",
    type: "chalet", transactionType: "location-ct", price: 350, currency: "CHF",
    location: { city: "Verbier", country: "Suisse" },
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600"],
    host: { id: "u1", firstName: "Sophie", lastName: "Martin", email: "", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", city: "Lausanne", country: "Suisse", roles: ["hote"], activeRole: "hote", stats: { followers: 0, following: 0, properties: 0, reviews: 0, rating: 0, transactions: 0, revenue: 0 }, bio: "" },
    bedrooms: 6, bathrooms: 4, area: 400, amenities: ["Jacuzzi", "Sauna", "Cheminée", "Ski-in/ski-out"], rating: 4.9, reviewCount: 134,
  },
  {
    id: "prop6", title: "Studio centre-ville", description: "Studio rénové idéalement situé",
    type: "studio", transactionType: "location-lt", price: 1200, currency: "CHF",
    location: { city: "Zurich", country: "Suisse" },
    images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600"],
    host: { id: "u2", firstName: "Marc", lastName: "Dubois", email: "", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", city: "Genève", country: "Suisse", roles: ["hote"], activeRole: "hote", stats: { followers: 0, following: 0, properties: 0, reviews: 0, rating: 0, transactions: 0, revenue: 0 }, bio: "" },
    bedrooms: 1, bathrooms: 1, area: 35, amenities: ["Meublé", "Buanderie"], rating: 4.3, reviewCount: 28,
  },
  {
    id: "prop7", title: "Terrain constructible vue mer", description: "Magnifique terrain en bord de mer",
    type: "terrain", transactionType: "vente", price: 450000, currency: "EUR",
    location: { city: "Tanger", country: "Maroc" },
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600"],
    host: { id: "u3", firstName: "Amira", lastName: "El Fassi", email: "", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", city: "Marrakech", country: "Maroc", roles: ["agence"], activeRole: "agence", stats: { followers: 0, following: 0, properties: 0, reviews: 0, rating: 0, transactions: 0, revenue: 0 }, bio: "" },
    bedrooms: 0, bathrooms: 0, area: 2000, amenities: ["Vue mer", "Viabilisé"], rating: 4.5, reviewCount: 5,
    analytics: { rendementBrut: 0, rendementNet: 0, prixM2: 225, dpe: "N/A", etatGeneral: "Terrain", anneeConstruction: 0, potentielPlusValue: 35, roi5ans: 50, roi10ans: 120, tauxOccupation: 0 },
  },
  {
    id: "prop8", title: "Maison familiale avec jardin", description: "Belle maison pour famille",
    type: "maison", transactionType: "vente", price: 980000, currency: "CHF",
    location: { city: "Neuchâtel", country: "Suisse" },
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600"],
    host: { id: "u4", firstName: "Thomas", lastName: "Weber", email: "", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100", city: "Zurich", country: "Suisse", roles: ["promoteur"], activeRole: "promoteur", stats: { followers: 0, following: 0, properties: 0, reviews: 0, rating: 0, transactions: 0, revenue: 0 }, bio: "" },
    bedrooms: 4, bathrooms: 2, area: 180, amenities: ["Jardin", "Garage double", "Cave"], rating: 4.6, reviewCount: 18,
    analytics: { rendementBrut: 4.1, rendementNet: 2.9, prixM2: 5444, dpe: "B", etatGeneral: "Bon", anneeConstruction: 2010, potentielPlusValue: 8, roi5ans: 18, roi10ans: 40, tauxOccupation: 100 },
  },
  {
    id: "prop9", title: "Bureau moderne open-space", description: "Espace de bureau contemporain",
    type: "bureau", transactionType: "location-lt", price: 3500, currency: "CHF",
    location: { city: "Bâle", country: "Suisse" },
    images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600"],
    host: { id: "u2", firstName: "Marc", lastName: "Dubois", email: "", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", city: "Genève", country: "Suisse", roles: ["investisseur"], activeRole: "investisseur", stats: { followers: 0, following: 0, properties: 0, reviews: 0, rating: 0, transactions: 0, revenue: 0 }, bio: "" },
    bedrooms: 0, bathrooms: 2, area: 150, amenities: ["Climatisation", "Salle de réunion", "Parking"], rating: 4.4, reviewCount: 8,
  },
];

const PROPERTY_TYPES: { value: PropertyType | ""; label: string }[] = [
  { value: "", label: "Tout type" },
  { value: "appartement", label: "Appartement" },
  { value: "villa", label: "Villa" },
  { value: "maison", label: "Maison" },
  { value: "chalet", label: "Chalet" },
  { value: "studio", label: "Studio" },
  { value: "penthouse", label: "Penthouse" },
  { value: "terrain", label: "Terrain" },
  { value: "commercial", label: "Commercial" },
  { value: "bureau", label: "Bureau" },
  { value: "riad", label: "Riad" },
];

const COUNTRIES = ["", "Suisse", "Maroc", "France"];

const CITY_COORDS: Record<string, [number, number]> = {
  "Lausanne": [46.5197, 6.6323],
  "Genève": [46.2044, 6.1432],
  "Montreux": [46.4312, 6.9107],
  "Verbier": [46.0967, 7.2286],
  "Zurich": [47.3769, 8.5417],
  "Neuchâtel": [46.9920, 6.9311],
  "Bâle": [47.5596, 7.5886],
  "Nice": [43.7102, 7.2620],
  "Marrakech": [31.6295, -7.9811],
  "Tanger": [35.7595, -5.8340],
  "Phuket": [7.8804, 98.3923],
  "Dubai": [25.2048, 55.2708],
};

const TRANSACTION_TABS: { value: TransactionType | "all" | "terrains"; label: string }[] = [
  { value: "all", label: "Tout" },
  { value: "location-ct", label: "Location CT" },
  { value: "location-lt", label: "Location LT" },
  { value: "vente", label: "Vente" },
  { value: "terrains", label: "Terrains" },
];

export default function ExplorerPage() {
  const { formatPrice, toggleFavorite, isFavorite } = useApp();
  const [search, setSearch] = useState("");
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState<PropertyType | "">("");
  const [filterTransaction, setFilterTransaction] = useState<TransactionType | "all" | "terrains">("all");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterPriceMin, setFilterPriceMin] = useState("");
  const [filterPriceMax, setFilterPriceMax] = useState("");
  const [filterBedrooms, setFilterBedrooms] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "price-asc" | "price-desc">("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMap, setShowMap] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<Property[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(6);
  }, [search, filterType, filterTransaction, filterCountry, filterPriceMin, filterPriceMax, filterBedrooms, sortBy]);

  // Load saved searches and recently viewed
  useEffect(() => {
    try {
      const ss = localStorage.getItem("edome_saved_searches");
      if (ss) setSavedSearches(JSON.parse(ss));
      const rv = localStorage.getItem("edome_recently_viewed");
      if (rv) {
        const ids: string[] = JSON.parse(rv);
        setRecentlyViewed(MOCK_PROPERTIES.filter((p) => ids.includes(p.id)));
      }
    } catch { /* ignore */ }
  }, []);

  // ─── MapLibre map ref ───────
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);

  const saveSearch = () => {
    if (!search.trim()) return;
    const updated = [search, ...savedSearches.filter((s) => s !== search)].slice(0, 5);
    setSavedSearches(updated);
    localStorage.setItem("edome_saved_searches", JSON.stringify(updated));
  };

  const removeSavedSearch = (s: string) => {
    const updated = savedSearches.filter((r) => r !== s);
    setSavedSearches(updated);
    localStorage.setItem("edome_saved_searches", JSON.stringify(updated));
  };

  const filtered = useMemo(() => {
    let results = [...MOCK_PROPERTIES];

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.city.toLowerCase().includes(q) ||
          p.location.country.toLowerCase().includes(q)
      );
    }
    if (filterType) results = results.filter((p) => p.type === filterType);
    if (filterTransaction !== "all") {
      if (filterTransaction === "terrains") {
        results = results.filter((p) => p.type === "terrain");
      } else {
        results = results.filter((p) => p.transactionType === filterTransaction);
      }
    }
    if (filterCountry) results = results.filter((p) => p.location.country === filterCountry);
    if (filterPriceMin) results = results.filter((p) => p.price >= Number(filterPriceMin));
    if (filterPriceMax) results = results.filter((p) => p.price <= Number(filterPriceMax));
    if (filterBedrooms) results = results.filter((p) => p.bedrooms >= Number(filterBedrooms));

    if (sortBy === "price-asc") results.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") results.sort((a, b) => b.price - a.price);

    return results;
  }, [search, filterType, filterTransaction, filterCountry, filterPriceMin, filterPriceMax, filterBedrooms, sortBy]);

  // ─── MapLibre map useEffect ────────────────────────────────────────
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

    filtered.forEach((prop) => {
      const coords = CITY_COORDS[prop.location.city];
      if (!coords) return;

      const suffix = prop.transactionType === "location-ct" ? "/nuit" : prop.transactionType === "location-lt" ? "/mois" : "";

      const el = document.createElement("div");
      el.className = "map-marker";
      el.innerHTML = `<span style="background:#1e9df1;color:white;padding:4px 8px;border-radius:20px;font-size:12px;font-weight:600;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.2)">${formatPrice(prop.price, prop.currency as import("@/lib/types").Currency)}${suffix}</span>`;

      const popup = new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(
        `<div style="font-family:system-ui;min-width:200px">
          <img src="${prop.images[0]}" style="width:100%;height:120px;object-fit:cover;border-radius:8px 8px 0 0" />
          <div style="padding:8px">
            <p style="font-weight:600;margin:0">${prop.title}</p>
            <p style="color:#1e9df1;font-weight:700;margin:4px 0">${formatPrice(prop.price, prop.currency as import("@/lib/types").Currency)}${suffix ? ` <span style="font-weight:400;color:#888;font-size:11px">${suffix}</span>` : ""}</p>
            <p style="color:#888;font-size:12px;margin:0">${prop.location.city}${prop.rating ? ` · ★ ${prop.rating}` : ""}</p>
            <a href="/explorer/${prop.id}" style="display:block;margin-top:8px;color:#1e9df1;font-size:12px;font-weight:600;text-decoration:none">Voir le bien →</a>
          </div>
        </div>`
      );

      new maplibregl.Marker({ element: el })
        .setLngLat([coords[1], coords[0]])
        .setPopup(popup)
        .addTo(map);
    });

    // Fit bounds
    const validCoords = filtered.map((p) => CITY_COORDS[p.location.city]).filter(Boolean);
    if (validCoords.length > 1) {
      const bounds = new maplibregl.LngLatBounds();
      validCoords.forEach((c) => bounds.extend([c![1], c![0]]));
      map.fitBounds(bounds, { padding: 50 });
    }

    mapInstanceRef.current = map;
    return () => { map.remove(); mapInstanceRef.current = null; };
  }, [showMap, filtered, formatPrice]);

  const visibleProperties = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 6);
      setLoadingMore(false);
    }, 600);
  };

  const selectClass = "px-3 py-2 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] outline-none focus:border-[#1e9df1] appearance-none cursor-pointer";

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl page-heading text-[var(--foreground)] mb-6">Explorer</h1>

      {/* Recently viewed */}
      {recentlyViewed.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">
            Consultés récemment
          </h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {recentlyViewed.map((prop) => (
              <Link
                key={prop.id}
                href={`/explorer/${prop.id}`}
                className="shrink-0 w-48 rounded-xl border border-[var(--card-border)] bg-[var(--card)] overflow-hidden hover:border-[#1e9df1]/30 transition-colors"
              >
                <img src={prop.images[0]} alt="" className="w-full h-24 object-cover" />
                <div className="p-2.5">
                  <p className="text-xs font-medium text-[var(--foreground)] truncate">{prop.title}</p>
                  <p className="text-xs text-[#1e9df1] font-semibold mt-0.5">
                    {formatPrice(prop.price, prop.currency)}
                    {prop.transactionType === "location-ct" && <span className="text-[var(--text-muted)]">/nuit</span>}
                    {prop.transactionType === "location-lt" && <span className="text-[var(--text-muted)]">/mois</span>}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Type categories — barre horizontale Airbnb-style.
          Remplace l'ancienne grille 5 grandes cartes-images qui prenait
          ~280px de hauteur pour un simple filtre redondant avec le drawer
          Filtres. Cette barre fait 64px, scroll horizontal, et expose
          plus de types d'un coup. */}
      <div className="mb-6 -mx-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 px-1 min-w-max">
          {[
            { type: "" as PropertyType | "", label: "Tous", icon: Building2 },
            { type: "appartement" as const, label: "Appartement", icon: Building },
            { type: "villa" as const, label: "Villa", icon: Home },
            { type: "chalet" as const, label: "Chalet", icon: Mountain },
            { type: "riad" as const, label: "Riad", icon: Landmark },
            { type: "penthouse" as const, label: "Penthouse", icon: Crown },
            { type: "studio" as const, label: "Studio", icon: Square },
            { type: "maison" as const, label: "Maison", icon: Building2 },
            { type: "terrain" as const, label: "Terrain", icon: TreePine },
          ].map((item) => {
            const active = filterType === item.type;
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => setFilterType(item.type as PropertyType | "")}
                className={`flex flex-col items-center justify-center gap-1.5 shrink-0 min-w-[78px] px-3 py-2.5 rounded-xl transition-colors ${
                  active
                    ? "text-[#1e9df1] bg-[#1e9df1]/10 ring-1 ring-[#1e9df1]/25"
                    : "text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--hover-bg)]"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[11px] font-medium tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search bar */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par ville, type, titre..."
            className="w-full pl-12 pr-12 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#1e9df1] transition-colors"
          />
          <button
            onClick={saveSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[#1e9df1] transition-colors"
            title="Sauvegarder la recherche"
          >
            {savedSearches.includes(search) ? (
              <BookmarkCheck className="w-5 h-5 text-[#1e9df1]" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 rounded-xl border transition-colors flex items-center gap-2 ${
            showFilters
              ? "border-[#1e9df1] bg-[#1e9df1]/10 text-[#1e9df1]"
              : "border-[var(--card-border)] bg-[var(--card)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]"
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="hidden sm:inline text-sm">Filtres</span>
        </button>
      </div>

      {/* Saved searches */}
      {savedSearches.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
          {savedSearches.map((s) => (
            <div
              key={s}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--card)] border border-[var(--card-border)] shrink-0"
            >
              <button
                onClick={() => setSearch(s)}
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--foreground)]"
              >
                {s}
              </button>
              <button onClick={() => removeSavedSearch(s)} className="text-[var(--text-muted)]">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Filters panel */}
      {showFilters && (
        <div className="mb-6 p-5 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Type de bien</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value as PropertyType | "")} className={selectClass + " w-full"}>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Pays</label>
              <select value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)} className={selectClass + " w-full"}>
                <option value="">Tous les pays</option>
                {COUNTRIES.filter(Boolean).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Prix min</label>
              <input
                type="number"
                value={filterPriceMin}
                onChange={(e) => setFilterPriceMin(e.target.value)}
                placeholder="0"
                className={selectClass + " w-full"}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Prix max</label>
              <input
                type="number"
                value={filterPriceMax}
                onChange={(e) => setFilterPriceMax(e.target.value)}
                placeholder="Illimité"
                className={selectClass + " w-full"}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Chambres min</label>
              <select value={filterBedrooms} onChange={(e) => setFilterBedrooms(e.target.value)} className={selectClass + " w-full"}>
                <option value="">Toutes</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}+</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Transaction tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl bg-[var(--card)] border border-[var(--card-border)] overflow-x-auto no-scrollbar">
        {TRANSACTION_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterTransaction(tab.value)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filterTransaction === tab.value
                ? "bg-[#1e9df1] text-white"
                : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-[var(--text-secondary)]">
          {filtered.length} bien{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-3">
          {/* Sort */}
          <div className="flex items-center gap-1">
            <LottiePlayer src="/lottie/lottieflow-dropdown-02-000000-easey.json" width={20} height={20} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-sm bg-[var(--card)] border border-[var(--card-border)] rounded-lg px-3 py-1.5 text-[var(--text-secondary)] outline-none cursor-pointer"
          >
            <option value="recent">Plus récents</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>
          </div>
          {/* View toggle */}
          <div className="flex rounded-lg border border-[var(--card-border)] overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${viewMode === "grid" ? "bg-[#1e9df1] text-white" : "bg-[var(--card)] text-[var(--text-muted)]"}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${viewMode === "list" ? "bg-[#1e9df1] text-white" : "bg-[var(--card)] text-[var(--text-muted)]"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Property grid / list */}
      {visibleProperties.length === 0 ? (
        <div className="text-center py-20">
          <Building2 className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
          <p className="text-lg font-medium text-[var(--foreground)] mb-2">Aucun bien trouvé</p>
          <p className="text-sm text-[var(--text-secondary)]">
            Essayez de modifier vos critères de recherche.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleProperties.map((prop, idx) => (
            <div
              key={prop.id}
              className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] overflow-hidden card-hover animate-fade-in"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {/* Image */}
              <div className="relative aspect-[4/3]">
                <Link href={`/explorer/${prop.id}`}>
                  <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover" />
                </Link>
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {prop.featured && (
                    <span className="px-2.5 py-1 rounded-lg text-amber-300 text-xs font-medium flex items-center gap-1 bg-amber-400/15 ring-1 ring-amber-400/30 backdrop-blur-sm">
                      <Rocket className="w-3 h-3" /> Mis en avant
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-lg bg-black/60 text-white text-xs font-medium backdrop-blur-sm">
                    {prop.transactionType === "vente" ? "Vente" : prop.transactionType === "location-ct" ? "Location CT" : "Location LT"}
                  </span>
                </div>
                {/* Heart */}
                <button
                  onClick={() => toggleFavorite(prop.id)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isFavorite(prop.id) ? "fill-red-400 text-red-400" : ""}`} />
                </button>
                {/* Rendement badge — palette sémantique */}
                {prop.analytics && prop.analytics.rendementBrut > 0 && prop.transactionType === "vente" && (() => {
                  const r = prop.analytics.rendementBrut;
                  const tone = r > 7
                    ? "bg-amber-400/15 text-amber-300 ring-amber-400/30"
                    : r >= 5
                      ? "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30"
                      : r >= 3
                        ? "bg-[#1e9df1]/15 text-[#1e9df1] ring-[#1e9df1]/30"
                        : "bg-zinc-700/40 text-zinc-300 ring-zinc-600/40";
                  return (
                    <span
                      className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm flex items-center gap-1 ring-1 tabular-nums ${tone}`}
                      title="Donnée communiquée par le vendeur. À vérifier — E-Dome ne garantit pas ce chiffre."
                    >
                      <TrendingUp className="w-3 h-3" /> {r.toFixed(1)}%
                    </span>
                  );
                })()}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-lg font-bold text-[#1e9df1]">
                    {formatPrice(prop.price, prop.currency)}
                    {prop.transactionType === "location-ct" && (
                      <span className="text-sm font-normal text-[var(--text-muted)]">/nuit</span>
                    )}
                    {prop.transactionType === "location-lt" && (
                      <span className="text-sm font-normal text-[var(--text-muted)]">/mois</span>
                    )}
                  </p>
                  <div className="flex items-center gap-1 text-[var(--text-muted)]">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm">{prop.rating}</span>
                  </div>
                </div>
                <Link href={`/explorer/${prop.id}`}>
                  <h3 className="font-semibold text-[var(--foreground)] mb-1 hover:text-[#1e9df1] transition-colors">
                    {prop.title}
                  </h3>
                </Link>
                <p className="text-sm text-[var(--text-muted)] flex items-center gap-1 mb-3">
                  <MapPin className="w-3.5 h-3.5" />
                  {prop.location.city}, {prop.location.country}
                </p>
                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                  {prop.bedrooms > 0 && (
                    <span className="flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5" /> {prop.bedrooms}
                    </span>
                  )}
                  {prop.bathrooms > 0 && (
                    <span className="flex items-center gap-1">
                      <Bath className="w-3.5 h-3.5" /> {prop.bathrooms}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Maximize className="w-3.5 h-3.5" /> {prop.area}m²
                  </span>
                </div>
                {/* Analytics line for vente */}
                {prop.transactionType === "vente" && prop.analytics && (
                  <div
                    className="mt-3 pt-3 border-t border-[var(--card-border)] flex items-center gap-2"
                    title="Données communiquées par le vendeur. E-Dome ne garantit pas ces chiffres."
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-xs text-green-400">
                      {prop.analytics.rendementBrut.toFixed(1)}% brut · +{prop.analytics.potentielPlusValue}% potentiel
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] ml-auto">déclaré vendeur</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List view */
        <div className="space-y-4">
          {visibleProperties.map((prop, idx) => (
            <div
              key={prop.id}
              className="flex gap-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] overflow-hidden card-hover animate-fade-in"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="relative w-60 shrink-0">
                <Link href={`/explorer/${prop.id}`}>
                  <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover" />
                </Link>
                {prop.featured && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-white text-xs font-medium flex items-center gap-1" style={{ background: "#1e9df1" }}>
                    <Rocket className="w-3 h-3" /> Mis en avant
                  </span>
                )}
                <button
                  onClick={() => toggleFavorite(prop.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white"
                >
                  <Heart className={`w-4 h-4 ${isFavorite(prop.id) ? "fill-red-400 text-red-400" : ""}`} />
                </button>
                {/* Rendement badge — palette sémantique */}
                {prop.analytics && prop.analytics.rendementBrut > 0 && prop.transactionType === "vente" && (() => {
                  const r = prop.analytics.rendementBrut;
                  const tone = r > 7
                    ? "bg-amber-400/15 text-amber-300 ring-amber-400/30"
                    : r >= 5
                      ? "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30"
                      : r >= 3
                        ? "bg-[#1e9df1]/15 text-[#1e9df1] ring-[#1e9df1]/30"
                        : "bg-zinc-700/40 text-zinc-300 ring-zinc-600/40";
                  return (
                    <span
                      className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm flex items-center gap-1 ring-1 tabular-nums ${tone}`}
                      title="Donnée communiquée par le vendeur. À vérifier — E-Dome ne garantit pas ce chiffre."
                    >
                      <TrendingUp className="w-3 h-3" /> {r.toFixed(1)}%
                    </span>
                  );
                })()}
              </div>
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <Link href={`/explorer/${prop.id}`}>
                      <h3 className="font-semibold text-[var(--foreground)] hover:text-[#1e9df1] transition-colors">
                        {prop.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-[var(--text-muted)] flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {prop.location.city}, {prop.location.country}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-[#1e9df1]">
                    {formatPrice(prop.price, prop.currency)}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-3 text-sm text-[var(--text-secondary)]">
                  {prop.bedrooms > 0 && <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {prop.bedrooms} ch</span>}
                  {prop.bathrooms > 0 && <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {prop.bathrooms} sdb</span>}
                  <span className="flex items-center gap-1"><Maximize className="w-4 h-4" /> {prop.area}m²</span>
                  <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {prop.rating}</span>
                </div>
                {prop.transactionType === "vente" && prop.analytics && (
                  <p className="mt-2 text-xs text-green-400 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Rendement {prop.analytics.rendementBrut.toFixed(1)}% brut · ROI 5 ans: +{prop.analytics.roi5ans}%
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load more / Pagination */}
      <div className="flex flex-col items-center gap-3 mt-8">
        <p className="text-sm text-[var(--text-secondary)]">
          Affichage de {visibleProperties.length} sur {filtered.length} bien{filtered.length > 1 ? "s" : ""}
        </p>
        {hasMore ? (
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-6 py-3 rounded-xl bg-[#1e9df1] hover:bg-[var(--gold-hover)] text-white font-medium transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {loadingMore ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Charger plus</span>
                <LottiePlayer src="/lottie/lottieflow-arrow-02-000000-easey.json" width={24} height={24} />
              </>
            )}
          </button>
        ) : filtered.length > 0 ? (
          <p className="text-sm text-[var(--text-muted)] italic">Tous les biens sont affichés</p>
        ) : null}
      </div>

      {/* Map floating button */}
      <button
        onClick={() => setShowMap((v) => !v)}
        className="fixed bottom-20 md:bottom-8 right-6 z-30 px-5 py-3 rounded-full font-medium flex items-center gap-2 shadow-xl text-white hover:opacity-90 transition-opacity"
        style={{ background: "#1e9df1" }}
      >
        <span className="text-lg">🗺</span>
        Carte
      </button>

      {/* Map modal — MapLibre interactive */}
      {showMap && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[var(--background)]">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--card-border)] bg-[var(--card)] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base" style={{ background: "#1e9df1" }}>
                🗺
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)] text-sm">Carte des biens</h3>
                <p className="text-xs text-[var(--text-muted)]">{filtered.length} bien{filtered.length > 1 ? "s" : ""} disponible{filtered.length > 1 ? "s" : ""}</p>
              </div>
            </div>
            <button
              onClick={() => setShowMap(false)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Map container */}
          <div className="flex-1 relative">
            <div id="map-container" className="absolute inset-0" style={{ borderRadius: "inherit" }} />
          </div>
        </div>
      )}
    </div>
  );
}
