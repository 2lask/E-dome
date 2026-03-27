"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Heart,
  MapPin,
  Bed,
  Bath,
  Ruler,
  SlidersHorizontal,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Map,
  RotateCcw,
  Sparkles,
  Clock,
  Tag,
  Eye,
  Home,
  Loader2,
  Building2,
  TrendingUp,
  Bookmark,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Property, PropertyType, TransactionType } from "@/lib/types";
import { mockProperties } from "@/lib/mock-data";
import { useApp } from "@/lib/context";

// ─── Constants ──────────────────────────────────────────

const TRANSACTION_TABS: { key: string; label: string; filter?: TransactionType }[] = [
  { key: "all", label: "Tout" },
  { key: "location-ct", label: "Location CT", filter: "location-ct" },
  { key: "location-lt", label: "Location LT", filter: "location-lt" },
  { key: "vente", label: "Vente", filter: "vente" },
  { key: "terrain", label: "Terrains" },
  { key: "projets", label: "Projets Neufs" },
];

const PROPERTY_TYPES: { key: PropertyType; label: string }[] = [
  { key: "appartement", label: "Appartement" },
  { key: "maison", label: "Maison" },
  { key: "villa", label: "Villa" },
  { key: "studio", label: "Studio" },
  { key: "loft", label: "Loft" },
  { key: "chalet", label: "Chalet" },
  { key: "terrain", label: "Terrain" },
  { key: "commercial", label: "Commercial" },
];

const EQUIPMENT_LIST = [
  "Piscine",
  "Parking",
  "Jardin",
  "Terrasse",
  "Ascenseur",
  "Balcon",
  "Cave",
  "Garage",
  "Climatisation",
  "Cheminée",
];

const PRICE_PRESETS = [
  { label: "< 100K", min: 0, max: 100000 },
  { label: "100-250K", min: 100000, max: 250000 },
  { label: "250-500K", min: 250000, max: 500000 },
  { label: "> 500K", min: 500000, max: Infinity },
];

const SORT_OPTIONS = [
  { key: "recent", label: "Plus récent" },
  { key: "price-asc", label: "Prix croissant" },
  { key: "price-desc", label: "Prix décroissant" },
  { key: "popular", label: "Plus populaire" },
];

const ITEMS_PER_PAGE = 9;

// ─── Filters state type ─────────────────────────────────

interface Filters {
  search: string;
  tab: string;
  types: PropertyType[];
  priceMin: number;
  priceMax: number;
  bedrooms: number | null;
  bathrooms: number | null;
  areaMin: number;
  areaMax: number;
  equipment: string[];
  badges: {
    coupDeCoeur: boolean;
    nouveau: boolean;
    prixReduit: boolean;
    visiteVirtuelle: boolean;
  };
  city: string;
  country: string;
}

const defaultFilters: Filters = {
  search: "",
  tab: "all",
  types: [],
  priceMin: 0,
  priceMax: Infinity,
  bedrooms: null,
  bathrooms: null,
  areaMin: 20,
  areaMax: 500,
  equipment: [],
  badges: {
    coupDeCoeur: false,
    nouveau: false,
    prixReduit: false,
    visiteVirtuelle: false,
  },
  city: "",
  country: "",
};

// ─── Property card ──────────────────────────────────────

function PropertyCard({ property }: { property: Property }) {
  const { isFavorite, toggleFavorite, formatPrice } = useApp();
  const liked = isFavorite(property.id);
  const [imgLoaded, setImgLoaded] = useState(false);

  const typeLabel: Record<string, string> = {
    appartement: "Appartement",
    villa: "Villa",
    maison: "Maison",
    chalet: "Chalet",
    studio: "Studio",
    penthouse: "Penthouse",
    loft: "Loft",
    terrain: "Terrain",
    commercial: "Commercial",
  };

  const transactionLabel: Record<string, string> = {
    vente: "Vente",
    "location-lt": "Location LT",
    "location-ct": "Location CT",
  };

  return (
    <Link href={`/explorer/${property.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group rounded-xl bg-[var(--card)] border border-[var(--card-border)] overflow-hidden hover:border-[var(--card-border)] transition-all duration-300 cursor-pointer"
      >
        {/* Image */}
        <div className="relative aspect-[3/4] bg-[var(--card-border)] overflow-hidden">
          {/* Loading skeleton */}
          {!imgLoaded && (
            <div className="absolute inset-0 bg-[var(--card)] animate-pulse" />
          )}
          {/* Actual image */}
          {property.images[0] && (
            <img
              src={property.images[0]}
              alt={property.title}
              loading="lazy"
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                imgLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImgLoaded(true)}
            />
          )}

          {/* Type badge */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur text-[11px] font-medium text-[var(--foreground)]">
              {typeLabel[property.type]}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#C4956A]/80 backdrop-blur text-[11px] font-medium text-[var(--foreground)]">
              {transactionLabel[property.transactionType]}
            </span>
          </div>

          {/* Featured badge */}
          {property.featured && (
            <div className="absolute top-3 right-12 px-2 py-1 rounded-full bg-amber-500/80 backdrop-blur text-[10px] font-medium text-[var(--foreground)] flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Coup de coeur
            </div>
          )}

          {/* Heart toggle */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(property.id);
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <Heart
              className={cn(
                "w-4 h-4 transition-colors",
                liked ? "text-red-500 fill-red-500" : "text-white"
              )}
            />
          </button>

          {/* Price overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <p className="text-lg font-bold text-[#C4956A]">
              {formatPrice(property.price, property.currency)}
              {property.transactionType === "location-lt" && (
                <span className="text-xs text-[var(--text-secondary)] font-normal"> /mois</span>
              )}
              {property.transactionType === "location-ct" && (
                <span className="text-xs text-[var(--text-secondary)] font-normal"> /nuit</span>
              )}
            </p>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-[var(--card)] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Info */}
        <div className="p-3.5">
          <h3 className="text-sm font-semibold text-[var(--foreground)] truncate group-hover:text-[#C4956A] transition-colors">
            {property.title}
          </h3>

          <div className="flex items-center gap-1 mt-1.5 text-xs text-[var(--text-secondary)]">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">
              {property.location.city}, {property.location.country}
            </span>
          </div>

          {/* Stats */}
          {property.type !== "terrain" && (
            <div className="flex items-center gap-3 mt-2.5 text-xs text-[var(--text-muted)]">
              {property.bedrooms > 0 && (
                <span className="flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5" />
                  {property.bedrooms}
                </span>
              )}
              {property.bathrooms > 0 && (
                <span className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5" />
                  {property.bathrooms}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5" />
                {property.area} m²
              </span>
            </div>
          )}
          {property.type === "terrain" && (
            <div className="flex items-center gap-3 mt-2.5 text-xs text-[var(--text-muted)]">
              <span className="flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5" />
                {property.area} m²
              </span>
            </div>
          )}

          {/* Investment analytics — vente & terrain only */}
          {property.analytics && (property.transactionType === "vente" || property.type === "terrain") && (
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[var(--text-secondary)] leading-tight">
              <TrendingUp className="w-3 h-3 text-[#C4956A] flex-shrink-0" />
              <span className="truncate">
                Rdt brut:{" "}
                <span className="text-[#C4956A]">{property.analytics.rendementBrut}%</span>
                {property.analytics.dpe && (
                  <> · DPE: <span className="text-[#C4956A]">{property.analytics.dpe}</span></>
                )}
                {property.analytics.roi5ans && (
                  <> · ROI 5a: <span className="text-[#C4956A]">+{property.analytics.roi5ans}%</span></>
                )}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

// ─── Filters panel ──────────────────────────────────────

function FiltersPanel({
  filters,
  setFilters,
  onClose,
  activeFilterCount,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onClose: () => void;
  activeFilterCount: number;
}) {
  const toggleType = (type: PropertyType) => {
    setFilters((f) => ({
      ...f,
      types: f.types.includes(type)
        ? f.types.filter((t) => t !== type)
        : [...f.types, type],
    }));
  };

  const toggleEquipment = (eq: string) => {
    setFilters((f) => ({
      ...f,
      equipment: f.equipment.includes(eq)
        ? f.equipment.filter((e) => e !== eq)
        : [...f.equipment, eq],
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="rounded-xl bg-[var(--card)] border border-[var(--card-border)] p-5 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#C4956A]" />
          Filtres
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-[#C4956A] text-white text-[10px] font-medium min-w-[18px] text-center">
              {activeFilterCount}
            </span>
          )}
        </h3>
        <button onClick={onClose} className="lg:hidden p-1 text-[var(--text-secondary)] hover:text-[var(--text-secondary)]">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* City */}
      <div>
        <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">Ville</label>
        <input
          type="text"
          value={filters.city}
          onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
          placeholder="Rechercher une ville..."
          className="w-full px-3 py-2 rounded-lg bg-[var(--card-border)] border border-[var(--card-border)] text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#C4956A]/40"
        />
      </div>

      {/* Country */}
      <div>
        <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">Pays</label>
        <input
          type="text"
          value={filters.country}
          onChange={(e) => setFilters((f) => ({ ...f, country: e.target.value }))}
          placeholder="Suisse, France, Maroc..."
          className="w-full px-3 py-2 rounded-lg bg-[var(--card-border)] border border-[var(--card-border)] text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#C4956A]/40"
        />
      </div>

      {/* Price presets */}
      <div>
        <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">Prix</label>
        <div className="grid grid-cols-2 gap-1.5">
          {PRICE_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  priceMin: f.priceMin === preset.min && f.priceMax === preset.max ? 0 : preset.min,
                  priceMax: f.priceMin === preset.min && f.priceMax === preset.max ? Infinity : preset.max,
                }))
              }
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs border transition-colors",
                filters.priceMin === preset.min && filters.priceMax === preset.max
                  ? "border-[#C4956A]/60 bg-[#C4956A]/10 text-[#C4956A]"
                  : "border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[var(--card-border)]"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
        {/* Custom range */}
        <div className="flex gap-2 mt-2">
          <input
            type="number"
            value={filters.priceMin || ""}
            onChange={(e) => setFilters((f) => ({ ...f, priceMin: Number(e.target.value) || 0 }))}
            placeholder="Min"
            className="flex-1 px-2.5 py-1.5 rounded-lg bg-[var(--card-border)] border border-[var(--card-border)] text-xs text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#C4956A]/40"
          />
          <input
            type="number"
            value={filters.priceMax === Infinity ? "" : filters.priceMax}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                priceMax: Number(e.target.value) || Infinity,
              }))
            }
            placeholder="Max"
            className="flex-1 px-2.5 py-1.5 rounded-lg bg-[var(--card-border)] border border-[var(--card-border)] text-xs text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#C4956A]/40"
          />
        </div>
      </div>

      {/* Property types */}
      <div>
        <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">Type de bien</label>
        <div className="flex flex-wrap gap-1.5">
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type.key}
              onClick={() => toggleType(type.key)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs border transition-colors",
                filters.types.includes(type.key)
                  ? "border-[#C4956A]/60 bg-[#C4956A]/10 text-[#C4956A]"
                  : "border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[var(--card-border)]"
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">Chambres</label>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() =>
                setFilters((f) => ({ ...f, bedrooms: f.bedrooms === n ? null : n }))
              }
              className={cn(
                "w-9 h-9 rounded-lg text-xs border flex items-center justify-center transition-colors",
                filters.bedrooms === n
                  ? "border-[#C4956A]/60 bg-[#C4956A]/10 text-[#C4956A]"
                  : "border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[var(--card-border)]"
              )}
            >
              {n === 5 ? "5+" : n}
            </button>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div>
        <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">Salles de bain</label>
        <div className="flex gap-1.5">
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              onClick={() =>
                setFilters((f) => ({ ...f, bathrooms: f.bathrooms === n ? null : n }))
              }
              className={cn(
                "w-9 h-9 rounded-lg text-xs border flex items-center justify-center transition-colors",
                filters.bathrooms === n
                  ? "border-[#C4956A]/60 bg-[#C4956A]/10 text-[#C4956A]"
                  : "border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[var(--card-border)]"
              )}
            >
              {n === 3 ? "3+" : n}
            </button>
          ))}
        </div>
      </div>

      {/* Surface range */}
      <div>
        <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">
          Surface: {filters.areaMin} - {filters.areaMax} m²
        </label>
        <div className="flex gap-2">
          <input
            type="range"
            min={20}
            max={500}
            value={filters.areaMin}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                areaMin: Math.min(Number(e.target.value), f.areaMax - 10),
              }))
            }
            className="flex-1 accent-[#C4956A]"
          />
          <input
            type="range"
            min={20}
            max={500}
            value={filters.areaMax}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                areaMax: Math.max(Number(e.target.value), f.areaMin + 10),
              }))
            }
            className="flex-1 accent-[#C4956A]"
          />
        </div>
      </div>

      {/* Equipment */}
      <div>
        <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">Équipements</label>
        <div className="grid grid-cols-2 gap-1.5">
          {EQUIPMENT_LIST.map((eq) => (
            <label
              key={eq}
              className={cn(
                "flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs border cursor-pointer transition-colors",
                filters.equipment.includes(eq)
                  ? "border-[#C4956A]/60 bg-[#C4956A]/10 text-[#C4956A]"
                  : "border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[var(--card-border)]"
              )}
            >
              <input
                type="checkbox"
                checked={filters.equipment.includes(eq)}
                onChange={() => toggleEquipment(eq)}
                className="sr-only"
              />
              <div
                className={cn(
                  "w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center",
                  filters.equipment.includes(eq)
                    ? "border-[#C4956A] bg-[#C4956A]"
                    : "border-[var(--card-border)]"
                )}
              >
                {filters.equipment.includes(eq) && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              {eq}
            </label>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div>
        <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">Badges</label>
        <div className="space-y-1.5">
          {[
            { key: "coupDeCoeur" as const, label: "Coup de coeur", icon: Sparkles },
            { key: "nouveau" as const, label: "Nouveau", icon: Clock },
            { key: "prixReduit" as const, label: "Prix réduit", icon: Tag },
            { key: "visiteVirtuelle" as const, label: "Visite virtuelle", icon: Eye },
          ].map((badge) => (
            <label
              key={badge.key}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs border cursor-pointer transition-colors",
                filters.badges[badge.key]
                  ? "border-[#C4956A]/60 bg-[#C4956A]/10 text-[#C4956A]"
                  : "border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[var(--card-border)]"
              )}
            >
              <input
                type="checkbox"
                checked={filters.badges[badge.key]}
                onChange={() =>
                  setFilters((f) => ({
                    ...f,
                    badges: { ...f.badges, [badge.key]: !f.badges[badge.key] },
                  }))
                }
                className="sr-only"
              />
              <badge.icon className="w-3.5 h-3.5" />
              {badge.label}
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-[var(--card-border)]">
        <button
          onClick={() => setFilters(defaultFilters)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs border border-[var(--card-border)] text-[var(--text-secondary)] hover:text-[var(--text-secondary)] hover:border-[var(--card-border)] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Réinitialiser
        </button>
        <button
          onClick={onClose}
          className="flex-1 px-3 py-2 rounded-lg text-xs bg-[#C4956A] text-white font-medium hover:bg-[#D4A574] transition-colors"
        >
          Appliquer
          {activeFilterCount > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-[var(--card-border)] text-[10px]">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Map modal ──────────────────────────────────────────

function MapModal({
  properties,
  onClose,
}: {
  properties: Property[];
  onClose: () => void;
}) {
  const { formatPrice } = useApp();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const grouped = useMemo(() => {
    const map: Record<string, Property[]> = {};
    properties.forEach((p) => {
      const key = p.location.country;
      if (!map[key]) map[key] = [];
      map[key].push(p);
    });
    return map;
  }, [properties]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex flex-col bg-[var(--background)]"
    >
      <div className="flex items-center justify-between border-b border-[var(--card-border)] px-6 py-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--foreground)]">Carte des biens</h2>
          <p className="text-xs text-[var(--text-secondary)]">{properties.length} bien{properties.length !== 1 ? "s" : ""} disponible{properties.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-2 rounded-xl border border-[var(--card-border)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--card-border)] hover:text-[var(--foreground)]"
        >
          <X className="h-4 w-4" />
          Fermer
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="relative flex-1 overflow-auto bg-[#0a0a0a]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative grid gap-8 p-8 md:grid-cols-2 xl:grid-cols-3">
            {Object.entries(grouped).map(([country, props]) => (
              <div key={country} className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[#C4956A]">
                  <MapPin className="h-4 w-4" />
                  {country}
                  <span className="rounded-full bg-[#C4956A]/10 px-2 py-0.5 text-[10px] font-medium">
                    {props.length}
                  </span>
                </h3>
                <div className="space-y-2">
                  {props.map((property) => (
                    <motion.button
                      key={property.id}
                      onClick={() => setSelectedProperty(
                        selectedProperty?.id === property.id ? null : property
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all",
                        selectedProperty?.id === property.id
                          ? "border-[#C4956A]/40 bg-[#C4956A]/5"
                          : "border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--card-border)]"
                      )}
                    >
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#C4956A]/20">
                        <div className="h-3 w-3 rounded-full bg-[#C4956A] shadow-lg shadow-[#C4956A]/40" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[var(--foreground)]">
                          {property.title}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {property.location.city}
                        </p>
                      </div>
                      <p className="flex-shrink-0 text-sm font-bold text-[#C4956A]">
                        {formatPrice(property.price, property.currency)}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {selectedProperty && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-[340px] flex-shrink-0 overflow-y-auto border-l border-[var(--card-border)] bg-[var(--card)] p-5"
            >
              <button
                onClick={() => setSelectedProperty(null)}
                className="mb-4 text-xs text-[var(--text-secondary)] hover:text-[var(--text-secondary)]"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="space-y-4">
                <div className="relative aspect-video overflow-hidden rounded-xl bg-[var(--card)]">
                  {selectedProperty.images[0] ? (
                    <img
                      src={selectedProperty.images[0]}
                      alt={selectedProperty.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[var(--text-muted)]">
                      <Building2 className="h-10 w-10" />
                    </div>
                  )}
                </div>
                <h3 className="text-base font-semibold text-[var(--foreground)]">
                  {selectedProperty.title}
                </h3>
                <p className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                  <MapPin className="h-3.5 w-3.5" />
                  {selectedProperty.location.city}, {selectedProperty.location.country}
                </p>
                <div className="flex gap-4 text-sm text-[var(--text-secondary)]">
                  {selectedProperty.bedrooms > 0 && (
                    <span className="flex items-center gap-1">
                      <Bed className="h-3.5 w-3.5" /> {selectedProperty.bedrooms}
                    </span>
                  )}
                  {selectedProperty.bathrooms > 0 && (
                    <span className="flex items-center gap-1">
                      <Bath className="h-3.5 w-3.5" /> {selectedProperty.bathrooms}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Ruler className="h-3.5 w-3.5" /> {selectedProperty.area} m²
                  </span>
                </div>
                <p className="text-xl font-bold text-[#C4956A]">
                  {formatPrice(selectedProperty.price, selectedProperty.currency)}
                </p>
                <Link
                  href={`/explorer/${selectedProperty.id}`}
                  className="block rounded-xl bg-gradient-to-r from-[#C4956A] to-[#D4A574] px-4 py-2.5 text-center text-sm font-semibold text-black transition-opacity hover:opacity-90"
                >
                  Voir le détail
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Main page ──────────────────────────────────────────

export default function ExplorerPage() {
  const { formatPrice } = useApp();
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recent");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [page, setPage] = useState(1);
  const [showMap, setShowMap] = useState(false);
  const [loadMoreState, setLoadMoreState] = useState<"idle" | "loading" | "done">("idle");
  const sortRef = useRef<HTMLDivElement>(null);

  // Saved searches
  const [savedSearches, setSavedSearches] = useState<{ id: string; label: string; filters: Filters }[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("edome_saved_searches");
      if (stored) setSavedSearches(JSON.parse(stored));
    } catch {}
  }, []);

  const handleSaveSearch = () => {
    const parts: string[] = [];
    if (filters.search) parts.push(`"${filters.search}"`);
    if (filters.tab !== "all") {
      const tab = TRANSACTION_TABS.find((t) => t.key === filters.tab);
      if (tab) parts.push(tab.label);
    }
    if (filters.city) parts.push(filters.city);
    if (filters.country) parts.push(filters.country);
    if (filters.types.length > 0) parts.push(filters.types.join(", "));
    const label = parts.length > 0 ? parts.join(" · ") : "Recherche générale";

    const newSearch = { id: `search-${Date.now()}`, label, filters: { ...filters } };
    const updated = [newSearch, ...savedSearches].slice(0, 5);
    setSavedSearches(updated);
    try { localStorage.setItem("edome_saved_searches", JSON.stringify(updated)); } catch {}
  };

  const handleDeleteSearch = (id: string) => {
    const updated = savedSearches.filter((s) => s.id !== id);
    setSavedSearches(updated);
    try { localStorage.setItem("edome_saved_searches", JSON.stringify(updated)); } catch {}
  };

  const handleLoadSearch = (searchFilters: Filters) => {
    setFilters(searchFilters);
    setPage(1);
    setLoadMoreState("idle");
  };

  // Recently viewed properties
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("edome_recently_viewed") || "[]") as string[];
      setRecentlyViewedIds(stored);
    } catch {
      // ignore
    }
  }, []);

  const recentlyViewed = useMemo(() => {
    return recentlyViewedIds
      .map((id) => mockProperties.find((p) => p.id === id))
      .filter(Boolean) as Property[];
  }, [recentlyViewedIds]);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.types.length > 0) count++;
    if (filters.priceMin > 0 || filters.priceMax < Infinity) count++;
    if (filters.bedrooms !== null) count++;
    if (filters.bathrooms !== null) count++;
    if (filters.areaMin > 20 || filters.areaMax < 500) count++;
    if (filters.equipment.length > 0) count++;
    if (filters.city) count++;
    if (filters.country) count++;
    if (Object.values(filters.badges).some(Boolean)) count++;
    return count;
  }, [filters]);

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let results = [...mockProperties];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.city.toLowerCase().includes(q) ||
          p.location.country.toLowerCase().includes(q)
      );
    }

    // Tab filter
    if (filters.tab !== "all") {
      if (filters.tab === "terrain") {
        results = results.filter((p) => p.type === "terrain");
      } else if (filters.tab === "projets") {
        results = results.filter((p) => p.featured);
      } else {
        results = results.filter((p) => p.transactionType === filters.tab);
      }
    }

    // Types
    if (filters.types.length > 0) {
      results = results.filter((p) => filters.types.includes(p.type));
    }

    // Price
    if (filters.priceMin > 0) {
      results = results.filter((p) => p.price >= filters.priceMin);
    }
    if (filters.priceMax < Infinity) {
      results = results.filter((p) => p.price <= filters.priceMax);
    }

    // Bedrooms
    if (filters.bedrooms !== null) {
      if (filters.bedrooms === 5) {
        results = results.filter((p) => p.bedrooms >= 5);
      } else {
        results = results.filter((p) => p.bedrooms === filters.bedrooms);
      }
    }

    // Bathrooms
    if (filters.bathrooms !== null) {
      if (filters.bathrooms === 3) {
        results = results.filter((p) => p.bathrooms >= 3);
      } else {
        results = results.filter((p) => p.bathrooms === filters.bathrooms);
      }
    }

    // Area
    if (filters.areaMin > 20) {
      results = results.filter((p) => p.area >= filters.areaMin);
    }
    if (filters.areaMax < 500) {
      results = results.filter((p) => p.area <= filters.areaMax);
    }

    // Equipment
    if (filters.equipment.length > 0) {
      results = results.filter((p) =>
        filters.equipment.every((eq) => p.equipment.includes(eq))
      );
    }

    // City
    if (filters.city) {
      const q = filters.city.toLowerCase();
      results = results.filter((p) => p.location.city.toLowerCase().includes(q));
    }

    // Country
    if (filters.country) {
      const q = filters.country.toLowerCase();
      results = results.filter((p) => p.location.country.toLowerCase().includes(q));
    }

    // Badges
    if (filters.badges.coupDeCoeur) {
      results = results.filter((p) => p.featured);
    }
    if (filters.badges.nouveau) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      results = results.filter((p) => new Date(p.createdAt) >= thirtyDaysAgo);
    }
    if (filters.badges.visiteVirtuelle) {
      results = results.filter((p) => p.videos.length > 0);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        results.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        results.sort((a, b) => b.views - a.views);
        break;
      case "recent":
      default:
        results.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return results;
  }, [filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const paginatedProperties = filteredProperties.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Reset page and load-more when filters change
  const handleFilterChange = (newFilters: Filters | ((prev: Filters) => Filters)) => {
    setFilters(newFilters);
    setLoadMoreState("idle");
    setPage(1);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-5">
      {/* Recently viewed */}
      {recentlyViewed.length > 0 && (
        <div className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
            <Clock className="w-4 h-4 text-[#C4956A]" />
            Consultés récemment
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {recentlyViewed.map((property) => (
              <Link
                key={property.id}
                href={`/explorer/${property.id}`}
                className="flex-shrink-0 w-48 rounded-xl bg-[var(--card)] border border-[var(--card-border)] overflow-hidden hover:border-[var(--card-border)] transition-all duration-300 group"
              >
                <div className="relative aspect-[4/3] bg-[var(--card-border)] overflow-hidden">
                  {property.images[0] && (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur text-[10px] font-medium text-[var(--foreground)]">
                      {property.type}
                    </span>
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-medium text-[var(--foreground)] truncate">{property.title}</p>
                  <p className="text-[#C4956A] text-sm font-bold mt-0.5">
                    {formatPrice(property.price, property.currency)}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{property.location.city}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Search bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange((f) => ({ ...f, search: e.target.value }))}
            placeholder="Rechercher un bien, une ville, un type..."
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:border-[#C4956A]/40 transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => handleFilterChange((f) => ({ ...f, search: "" }))}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={handleSaveSearch}
          title="Sauvegarder la recherche"
          className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-xl border border-[var(--card-border)] bg-[var(--card)] text-[var(--text-secondary)] transition-colors hover:border-[#C4956A]/30 hover:text-[#C4956A]"
        >
          <Bookmark className="h-5 w-5" />
        </button>
      </div>

      {/* Saved searches */}
      {savedSearches.length > 0 && (
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
            <Bookmark className="w-3.5 h-3.5 text-[#C4956A]" />
            Recherches sauvegardées
          </h3>
          <div className="flex flex-wrap gap-2">
            {savedSearches.map((search) => (
              <div
                key={search.id}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-3 py-1.5 text-xs"
              >
                <button
                  onClick={() => handleLoadSearch(search.filters)}
                  className="text-[var(--text-secondary)] hover:text-[#C4956A] transition-colors truncate max-w-[200px]"
                >
                  {search.label}
                </button>
                <button
                  onClick={() => handleDeleteSearch(search.id)}
                  className="flex-shrink-0 rounded p-0.5 text-[var(--text-muted)] hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction tabs */}
      <div className="relative">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide border-b border-[var(--card-border)]">
          {TRANSACTION_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                handleFilterChange((f) => ({ ...f, tab: tab.key }));
              }}
              className={cn(
                "relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0",
                filters.tab === tab.key
                  ? "text-[#C4956A]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-secondary)]"
              )}
            >
              {tab.label}
              {filters.tab === tab.key && (
                <motion.div
                  layoutId="explorerTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C4956A] rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-between gap-4">
        {/* Left: filter toggle + results count */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-all",
              showFilters
                ? "border-[#C4956A]/40 text-[#C4956A] bg-[#C4956A]/5"
                : "border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[var(--card-border)]"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtres
            {activeFilterCount > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#C4956A] text-white text-[10px] font-bold animate-in fade-in">
                {activeFilterCount}
              </span>
            )}
          </button>
          <span className="text-sm text-[var(--text-muted)]">
            {filteredProperties.length} résultat{filteredProperties.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Right: sort + view toggle */}
        <div className="flex items-center gap-2">
          {/* Sort dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs border border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[var(--card-border)] transition-colors"
            >
              {SORT_OPTIONS.find((s) => s.key === sortBy)?.label}
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform",
                  showSortDropdown && "rotate-180"
                )}
              />
            </button>
            <AnimatePresence>
              {showSortDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute right-0 top-full mt-1 w-44 rounded-lg bg-[var(--card)] border border-[var(--card-border)] py-1 z-20 shadow-xl"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => {
                        setSortBy(opt.key);
                        setShowSortDropdown(false);
                        setPage(1);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-xs transition-colors",
                        sortBy === opt.key
                          ? "text-[#C4956A] bg-[#C4956A]/5"
                          : "text-[var(--text-secondary)] hover:bg-[var(--card-border)] hover:text-[var(--text-secondary)]"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* View toggle */}
          <div className="flex rounded-lg border border-[var(--card-border)] overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "grid"
                  ? "bg-[var(--card)] text-[#C4956A]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "list"
                  ? "bg-[var(--card)] text-[#C4956A]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex gap-6">
        {/* Filters sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 280 }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex-shrink-0 hidden lg:block overflow-hidden"
            >
              <div className="w-[280px] sticky top-4">
                <FiltersPanel
                  filters={filters}
                  setFilters={handleFilterChange}
                  onClose={() => setShowFilters(false)}
                  activeFilterCount={activeFilterCount}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile filter overlay — full-screen slide-up panel */}
        <AnimatePresence>
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowFilters(false)}
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="absolute inset-x-0 bottom-0 top-12 overflow-y-auto overscroll-contain rounded-t-2xl bg-[var(--background)] p-4 pb-24"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[var(--card-border)]" />
                <FiltersPanel
                  filters={filters}
                  setFilters={handleFilterChange}
                  onClose={() => setShowFilters(false)}
                  activeFilterCount={activeFilterCount}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Property grid */}
        <div className="flex-1 min-w-0">
          {paginatedProperties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <div className="w-20 h-20 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] flex items-center justify-center mx-auto mb-5">
                <Home className="w-9 h-9 text-[var(--text-muted)]" />
              </div>
              <p className="text-[var(--text-secondary)] text-base font-medium">
                Aucun bien ne correspond à vos critères
              </p>
              <p className="text-[var(--text-muted)] text-sm mt-2 max-w-[300px] mx-auto">
                Essayez de modifier vos filtres ou de rechercher avec d&apos;autres termes
              </p>
              <button
                onClick={() => {
                  handleFilterChange(defaultFilters);
                  setSortBy("recent");
                }}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-[#C4956A] border border-[#C4956A]/30 hover:bg-[#C4956A]/5 transition-colors font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                Réinitialiser les filtres
              </button>
            </motion.div>
          ) : viewMode === "grid" ? (
            <div
              className={cn(
                "grid gap-4 stagger-children",
                showFilters
                  ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              )}
            >
              {paginatedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedProperties.map((property) => (
                <Link key={property.id} href={`/explorer/${property.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] overflow-hidden hover:border-[var(--card-border)] transition-all p-3 cursor-pointer group"
                  >
                    {/* Thumbnail */}
                    <div className="w-32 h-24 rounded-lg bg-[var(--card-border)] flex-shrink-0 relative overflow-hidden">
                      {property.images[0] && (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-[var(--foreground)] truncate group-hover:text-[#C4956A] transition-colors">
                          {property.title}
                        </h3>
                        <div className="flex items-center gap-1 mt-1 text-xs text-[var(--text-secondary)]">
                          <MapPin className="w-3 h-3" />
                          <span>
                            {property.location.city}, {property.location.country}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                          {property.bedrooms > 0 && (
                            <span className="flex items-center gap-1">
                              <Bed className="w-3 h-3" /> {property.bedrooms}
                            </span>
                          )}
                          {property.bathrooms > 0 && (
                            <span className="flex items-center gap-1">
                              <Bath className="w-3 h-3" /> {property.bathrooms}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Ruler className="w-3 h-3" /> {property.area} m²
                          </span>
                        </div>
                        <p className="text-sm font-bold text-[#C4956A]">
                          {formatPrice(property.price, property.currency)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-[var(--card-border)] text-[var(--text-muted)] hover:border-[var(--card-border)] hover:text-[var(--text-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={cn(
                    "w-9 h-9 rounded-lg text-sm font-medium transition-colors",
                    n === page
                      ? "bg-[#C4956A] text-white"
                      : "text-[var(--text-muted)] hover:bg-[var(--card-border)] hover:text-[var(--text-secondary)]"
                  )}
                >
                  {n}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-[var(--card-border)] text-[var(--text-muted)] hover:border-[var(--card-border)] hover:text-[var(--text-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Load more */}
          <div className="flex flex-col items-center gap-3 mt-8">
            {loadMoreState === "idle" && page === totalPages && filteredProperties.length > 0 && (
              <button
                onClick={() => {
                  setLoadMoreState("loading");
                  setTimeout(() => setLoadMoreState("done"), 1000);
                }}
                className="flex items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-6 py-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[#C4956A]/30 hover:text-[#C4956A]"
              >
                Charger plus de résultats
              </button>
            )}
            {loadMoreState === "loading" && (
              <div className="flex items-center gap-2 py-3 text-sm text-[var(--text-secondary)]">
                <Loader2 className="h-4 w-4 animate-spin text-[#C4956A]" />
                Chargement...
              </div>
            )}
            {loadMoreState === "done" && (
              <p className="py-3 text-sm text-[var(--text-muted)]">
                Tous les résultats sont affichés
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Floating map button */}
      <motion.button
        onClick={() => setShowMap(true)}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#C4956A] to-[#D4A574] text-white text-sm font-semibold shadow-xl shadow-[#C4956A]/25 hover:shadow-[#C4956A]/40 transition-shadow"
      >
        <Map className="w-5 h-5" />
        Voir la carte
      </motion.button>

      {/* Map modal */}
      <AnimatePresence>
        {showMap && (
          <MapModal
            properties={filteredProperties}
            onClose={() => setShowMap(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
