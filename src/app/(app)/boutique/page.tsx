"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Truck,
  Building2,
  Sofa,
  Lamp,
  Wrench,
  Plug,
  Hammer,
  ChefHat,
  Sparkles,
  MapPin,
  SlidersHorizontal,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { BlurImage } from "@/components/ui/blur-image";
import { listProducts, type Condition, type Product } from "@/lib/data/products";
import { AFFILIATION_NOTICE, ConditionChip } from "@/components/boutique/affiliation";

/* ─── Boutique EN AFFILIATION (Mission 2, P4b) ───────────────────────────────
   Ce n'est plus un marketplace (`DECISIONS-2.md` §D5, `DECISIONS.md` §1.8,
   art. 20a LTVA). E-Dome référence des produits de marchands partenaires et
   redirige vers eux : pas de panier, pas de paiement, pas de stock, pas de
   garantie E-Dome. Chaque carte montre le prix INDICATIF du marchand, son nom
   et la mention « en affiliation ». Aucune note ni aucun avis produit : sans
   transaction, un avis n'a rien à quoi se rattacher. L'état (Neuf /
   Reconditionné / Occasion) porte un jeton sémantique `chip-*` par valeur. */

// ─── Types ────────────────────────────────────────────────────────────────

/* `Condition` et `Product` viennent de `@/lib/data/products` — la définition
   locale dupliquait celle de la fiche produit et n'en couvrait qu'une partie,
   ce qui a laissé les deux catalogues diverger jusqu'aux 404. */

// ─── Catégories (sidebar tree) ────────────────────────────────────────────

const CATEGORIES: { key: string; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { key: "all", label: "Tout", icon: Sparkles },
  { key: "Meubles", label: "Meubles", icon: Sofa },
  { key: "Décoration", label: "Décoration", icon: Lamp },
  { key: "Matériaux", label: "Matériaux", icon: Hammer },
  { key: "Cuisines", label: "Cuisines", icon: ChefHat },
  { key: "Équipements", label: "Équipements", icon: Wrench },
  { key: "Électroménager", label: "Électroménager", icon: Plug },
];

const CONDITIONS: Condition[] = ["Neuf", "Reconditionné", "Occasion"];

// ─── Catalogue produits ──────────────────────────────────────────────────

/* Lu depuis la source unique. Auparavant ce tableau vivait ici en 16 entrées
   tandis que la fiche produit n'en connaissait que 6 — d'où 10 fiches en 404. */
const PRODUCTS: Product[] = listProducts();

/* Ni « plus populaires » ni « meilleures notes » : E-Dome ne voit pas les
   ventes du marchand et n'affiche aucune note. */
const SORTS = [
  { key: "default",   label: "Ordre du catalogue" },
  { key: "price-asc", label: "Prix croissant" },
  { key: "price-desc",label: "Prix décroissant" },
] as const;

type SortKey = typeof SORTS[number]["key"];

// ─── Page ──────────────────────────────────────────────────────────────

export default function BoutiquePage() {
  const { formatPrice } = useApp();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [conditions, setConditions] = useState<Set<Condition>>(new Set());
  const [freeShippingOnly, setFreeShippingOnly] = useState(false);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sort, setSort] = useState<SortKey>("default");
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile drawer

  const activeFiltersCount =
    (conditions.size) +
    (freeShippingOnly ? 1 : 0) +
    (priceMin ? 1 : 0) +
    (priceMax ? 1 : 0);

  const activeCategory = CATEGORIES.find((c) => c.key === category);

  const toggleCondition = (c: Condition) => {
    setConditions((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setConditions(new Set());
    setFreeShippingOnly(false);
    setPriceMin("");
    setPriceMax("");
  };

  const filtered = useMemo(() => {
    const minN = priceMin ? Number(priceMin) : 0;
    const maxN = priceMax ? Number(priceMax) : Infinity;
    const arr = PRODUCTS.filter((p) => {
      const q = search.trim().toLowerCase();
      const matchSearch = !q || p.title.toLowerCase().includes(q) || p.vendor.toLowerCase().includes(q);
      const matchCat = category === "all" || p.category === category;
      const matchCond = conditions.size === 0 || conditions.has(p.condition);
      const matchShip = !freeShippingOnly || p.shipping === 0;
      const matchPrice = p.price >= minN && p.price <= maxN;
      return matchSearch && matchCat && matchCond && matchShip && matchPrice;
    });
    switch (sort) {
      case "price-asc":   arr.sort((a, b) => a.price - b.price); break;
      case "price-desc":  arr.sort((a, b) => b.price - a.price); break;
      default:            break;
    }
    return arr;
  }, [search, category, conditions, freeShippingOnly, priceMin, priceMax, sort]);

  return (
    <div className="min-h-screen text-[var(--foreground)]">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">

        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl page-heading">Boutique</h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Meubles, déco, matériaux, cuisines, équipements, électroménager — sélectionnés chez des marchands partenaires. Vous achetez chez le marchand.
            </p>
          </div>
          <Link href="/boutique/vendre" className="px-4 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--hover-bg)]"
            style={{ border: "1px solid var(--card-border)", background: "var(--card)", color: "var(--foreground)" }}>
            Marchand ? Proposer vos produits
          </Link>
        </header>

        {/* Cadrage : affiliation */}
        <div className="rounded-xl px-3 py-2 text-xs flex items-start gap-2"
          style={{ background: "var(--card)", border: "1px solid var(--card-border)", color: "var(--text-secondary)" }}>
          <Building2 size={14} style={{ color: "var(--primary)", marginTop: 1 }} className="shrink-0" />
          <span>
            <strong style={{ color: "var(--foreground)" }}>E-Dome ne vend rien ici : la boutique fonctionne en affiliation.</strong>{" "}
            Chaque produit renvoie vers son marchand, qui garde la vente, la livraison, la garantie et le service après-vente. {AFFILIATION_NOTICE}
          </span>
        </div>

        {/* Recherche large */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input
            type="search"
            placeholder="Rechercher un produit, un marchand, un matériau…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-colors"
            style={{ background: "var(--card)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
          />
        </div>

        {/* Breadcrumb façon eBay : Boutique > Catégorie active */}
        <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
          <Link href="/boutique" className="hover:underline transition-colors" style={{ color: "var(--text-secondary)" }}>
            Boutique
          </Link>
          {activeCategory && activeCategory.key !== "all" && (
            <>
              <ChevronRight size={12} />
              <span style={{ color: "var(--foreground)" }} className="font-medium">
                {activeCategory.label}
              </span>
            </>
          )}
          {search && (
            <>
              <ChevronRight size={12} />
              <span style={{ color: "var(--foreground)" }} className="font-medium">
                « {search} »
              </span>
            </>
          )}
        </nav>

        {/* Grid : sidebar filtres + grille produits */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5 items-start">

          {/* Sidebar filtres — desktop sticky, mobile drawer */}
          <aside
            className={`${filtersOpen ? "block" : "hidden lg:block"} lg:sticky lg:top-20 self-start space-y-5`}
          >

            {/* Catégories */}
            <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
              <h3 className="text-[11px] uppercase tracking-wider font-semibold px-4 pt-3 pb-2"
                style={{ color: "var(--text-muted)" }}>
                Catégories
              </h3>
              <ul className="pb-2">
                {CATEGORIES.map((c) => {
                  const Icon = c.icon;
                  const active = category === c.key;
                  const count = c.key === "all" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === c.key).length;
                  return (
                    <li key={c.key}>
                      <button
                        onClick={() => setCategory(c.key)}
                        className="w-full flex items-center gap-2.5 px-4 py-1.5 text-sm transition-colors"
                        style={{
                          color: active ? "var(--primary)" : "var(--foreground)",
                          fontWeight: active ? 600 : 500,
                          background: active ? "rgba(245, 113, 50,0.08)" : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (!active) e.currentTarget.style.background = "var(--hover-bg)";
                        }}
                        onMouseLeave={(e) => {
                          if (!active) e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <Icon size={15} />
                        <span className="flex-1 text-left">{c.label}</span>
                        <span className="text-[11px] tabular-nums" style={{ color: "var(--text-muted)" }}>
                          {count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Filtres */}
            <div className="rounded-xl p-4 space-y-4" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] uppercase tracking-wider font-semibold"
                  style={{ color: "var(--text-muted)" }}>
                  Filtres
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-[11px]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Réinitialiser
                </button>
              </div>

              {/* Prix */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
                  Prix (CHF)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg text-xs outline-none"
                    style={{ background: "var(--background)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg text-xs outline-none"
                    style={{ background: "var(--background)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
                  />
                </div>
              </div>

              {/* État */}
              <div>
                <p className="text-xs font-medium mb-1.5" style={{ color: "var(--foreground)" }}>État</p>
                <ul className="space-y-1">
                  {CONDITIONS.map((c) => (
                    <li key={c}>
                      <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: "var(--text-secondary)" }}>
                        <input
                          type="checkbox"
                          checked={conditions.has(c)}
                          onChange={() => toggleCondition(c)}
                          className="accent-[var(--primary)]"
                        />
                        {c}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Livraison */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: "var(--text-secondary)" }}>
                  <input
                    type="checkbox"
                    checked={freeShippingOnly}
                    onChange={(e) => setFreeShippingOnly(e.target.checked)}
                    className="accent-[var(--primary)]"
                  />
                  <Truck size={13} style={{ color: "var(--text-muted)" }} />
                  Livraison gratuite
                </label>
              </div>
            </div>
          </aside>

          {/* Contenu : tri + grille produits */}
          <div className="space-y-4 min-w-0">

            {/* Bar de tri + filtres mobile */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Bouton Filtres mobile uniquement (la sidebar est cachee < lg) */}
                <button
                  onClick={() => setFiltersOpen((v) => !v)}
                  className="lg:hidden inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{ background: "var(--card)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
                >
                  <SlidersHorizontal size={13} />
                  Filtres
                  {activeFiltersCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-semibold px-1 tabular-nums"
                      style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  <span className="font-semibold tabular-nums" style={{ color: "var(--foreground)" }}>
                    {filtered.length}
                  </span>
                  {" "}résultat{filtered.length > 1 ? "s" : ""}
                </p>
              </div>
              <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors"
                style={{ background: "var(--card)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
              >
                <ArrowUpDown size={13} style={{ color: "var(--text-muted)" }} />
                <span style={{ color: "var(--text-muted)" }}>Trier :</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="bg-transparent outline-none cursor-pointer font-medium"
                  style={{ color: "var(--foreground)" }}
                >
                  {SORTS.map((s) => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
              </label>
            </div>

            {/* Grille produits dense */}
            {filtered.length === 0 ? (
              <div className="py-16 text-center space-y-3" style={{ color: "var(--text-muted)" }}>
                <Search size={32} className="mx-auto opacity-40" />
                <p className="text-sm">Aucun produit ne correspond à vos critères.</p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{ background: "var(--hover-bg)", color: "var(--foreground)" }}
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {filtered.map((p) => {
                  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
                  return (
                    <li key={p.id} className="rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:shadow-[0_4px_16px_rgba(15,23,42,0.06)] hover:-translate-y-0.5"
                      style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>

                      {/* Photo + badges */}
                      <Link href={`/boutique/${p.id}`} className="relative block bg-[var(--hover-bg)] overflow-hidden group" style={{ aspectRatio: "4/3" }}>
                        <BlurImage src={p.cover} alt={p.title} className="group-hover:scale-105 transition-transform duration-500" />
                        {discount > 0 && (
                          <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
                            style={{ background: "var(--destructive)" }}>
                            -{discount}%
                          </span>
                        )}
                        <ConditionChip condition={p.condition} className="absolute bottom-2 left-2" />
                      </Link>

                      {/* Contenu */}
                      <div className="p-3 flex flex-col flex-1 gap-1.5">
                        <Link href={`/boutique/${p.id}`}
                          className="text-[13px] font-medium leading-tight line-clamp-2 hover:underline"
                          style={{ color: "var(--foreground)" }}
                        >
                          {p.title}
                        </Link>

                        {/* Prix indicatif du marchand */}
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-base font-bold tabular-nums" style={{ color: "var(--foreground)" }}>
                              {formatPrice(p.price)}
                            </span>
                            {p.oldPrice && (
                              <span className="text-xs line-through tabular-nums" style={{ color: "var(--text-muted)" }}>
                                {formatPrice(p.oldPrice)}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Prix indicatif du marchand</p>
                        </div>

                        {/* Livraison annoncée par le marchand */}
                        <div className="flex items-center gap-1 text-[11px]" style={{ color: "var(--text-muted)" }}>
                          <Truck size={11} />
                          {p.shipping === 0 ? "Livraison offerte" : `+${formatPrice(p.shipping)} livraison`}
                          <span>· {p.shippingDays}</span>
                        </div>

                        {/* Marchand : une entreprise, pas un visage */}
                        <div className="mt-auto pt-1.5 flex items-center gap-1 text-[11px] min-w-0" style={{ borderTop: "1px solid var(--card-border)", color: "var(--text-secondary)" }}>
                          <Building2 size={11} className="shrink-0" style={{ color: "var(--text-muted)" }} />
                          <span className="truncate">{p.vendor}</span>
                          <span className="inline-flex items-center gap-0.5 shrink-0" style={{ color: "var(--text-muted)" }}>
                            · <MapPin size={10} /> {p.vendorCity}
                          </span>
                        </div>
                        <p className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>En affiliation</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
