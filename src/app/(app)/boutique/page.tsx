"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  X,
  Search,
  Star,
  Truck,
  Shield,
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
  Check,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { BlurImage } from "@/components/ui/blur-image";

/* ─── Pôle Boutique e-commerce (V1.0) ────────────────────────────────────────
   Refonte style marketplace e-commerce (esprit eBay) :
   - Sidebar gauche : catégories + filtres (état, prix, livraison, top vendeur)
   - Recherche en tête + tri
   - Grille dense de cartes produit avec toutes les infos clés visibles
     (photo, titre, prix, frais de port, vendeur + note, état, localisation,
     délai de livraison)
   - Panier persistant + drawer (via useApp)
   E-Dome fournit la vitrine + paiement + visibilité. Vendeurs responsables
   de produits, expéditions et SAV. Commission marketplace 4–8 %, jamais
   ajoutée au prix payé par l'acheteur. */

// ─── Types ────────────────────────────────────────────────────────────────

type Condition = "Neuf" | "Reconditionné" | "Occasion";

interface Product {
  id: string;
  title: string;
  category: string;
  cover: string;
  price: number;
  oldPrice?: number;
  condition: Condition;
  vendor: string;
  vendorCity: string;
  vendorRating: number;
  vendorReviews: number;
  topRated?: boolean;
  shipping: number; // 0 = gratuit
  shippingDays: string;
  stock: number;
  reviews: number;
  rating: number;
  sold: number;
}

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

// ─── Mocks (produits enrichis) ────────────────────────────────────────────

const PRODUCTS: Product[] = [
  { id: "b1",  title: "Canapé d'angle modulable lin naturel",           category: "Meubles",         cover: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600", price: 2490,  oldPrice: 2890, condition: "Neuf",           vendor: "Maison Léman",     vendorCity: "Lausanne",   vendorRating: 4.8, vendorReviews: 412, topRated: true,  shipping: 0,   shippingDays: "3-5 j",   stock: 4,  reviews: 142, rating: 4.8, sold: 86 },
  { id: "b2",  title: "Lampadaire design laiton noir",                  category: "Décoration",      cover: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600", price: 389,                   condition: "Neuf",           vendor: "Studio Verbier",   vendorCity: "Verbier",    vendorRating: 4.6, vendorReviews: 218,                  shipping: 12,  shippingDays: "2-4 j",   stock: 12, reviews: 67,  rating: 4.6, sold: 132 },
  { id: "b3",  title: "Parquet chêne massif huilé — 18 m²",              category: "Matériaux",       cover: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600", price: 1480,                  condition: "Neuf",           vendor: "Bois & Co.",       vendorCity: "Bulle",      vendorRating: 4.9, vendorReviews: 318, topRated: true,  shipping: 89,  shippingDays: "7-10 j",  stock: 22, reviews: 203, rating: 4.9, sold: 56 },
  { id: "b4",  title: "Cuisine sur mesure noyer + îlot quartz",         category: "Cuisines",        cover: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600", price: 18900,                 condition: "Neuf",           vendor: "Cuisinea Geneva",  vendorCity: "Genève",     vendorRating: 4.7, vendorReviews: 92,                   shipping: 0,   shippingDays: "Sur RDV", stock: 1,  reviews: 38,  rating: 4.7, sold: 12 },
  { id: "b5",  title: "Robinet mitigeur cuivre brossé",                 category: "Équipements",     cover: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600", price: 245,                   condition: "Neuf",           vendor: "Plumbing Pro",     vendorCity: "Zurich",     vendorRating: 4.5, vendorReviews: 156,                  shipping: 9,   shippingDays: "2-3 j",   stock: 35, reviews: 88,  rating: 4.5, sold: 240 },
  { id: "b6",  title: "Lave-vaisselle encastrable A+++",                category: "Électroménager",  cover: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600", price: 1290,  oldPrice: 1490, condition: "Reconditionné",  vendor: "ElectroMax",       vendorCity: "Bâle",       vendorRating: 4.4, vendorReviews: 184,                  shipping: 49,  shippingDays: "5-7 j",   stock: 8,  reviews: 56,  rating: 4.4, sold: 41 },
  { id: "b7",  title: "Table basse marbre travertin",                   category: "Meubles",         cover: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600", price: 690,                   condition: "Neuf",           vendor: "Maison Léman",     vendorCity: "Lausanne",   vendorRating: 4.8, vendorReviews: 412, topRated: true,  shipping: 0,   shippingDays: "3-5 j",   stock: 6,  reviews: 41,  rating: 4.7, sold: 28 },
  { id: "b8",  title: "Set de 4 chaises bouclette écru",                category: "Meubles",         cover: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600", price: 980,                   condition: "Neuf",           vendor: "Deco Studio",      vendorCity: "Neuchâtel",  vendorRating: 4.6, vendorReviews: 134,                  shipping: 0,   shippingDays: "3-5 j",   stock: 14, reviews: 92,  rating: 4.6, sold: 62 },
  { id: "b9",  title: "Carrelage grès cérame XXL — 24 m²",               category: "Matériaux",       cover: "https://images.unsplash.com/photo-1615875605825-5eb9bb5d52ac?w=600", price: 2160,                  condition: "Neuf",           vendor: "TileMaster",       vendorCity: "Sion",       vendorRating: 4.8, vendorReviews: 286,                  shipping: 120, shippingDays: "7-12 j",  stock: 18, reviews: 117, rating: 4.8, sold: 34 },
  { id: "b10", title: "Vase grès noir mat — 35 cm",                     category: "Décoration",      cover: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600", price: 65,                    condition: "Neuf",           vendor: "Atelier Argile",   vendorCity: "Fribourg",   vendorRating: 4.9, vendorReviews: 76,  topRated: true,  shipping: 7,   shippingDays: "2-3 j",   stock: 22, reviews: 31,  rating: 4.9, sold: 88 },
  { id: "b11", title: "Plaid lin lavé bleu nuit",                       category: "Décoration",      cover: "https://images.unsplash.com/photo-1576020799627-aeac74d58064?w=600", price: 89,                    condition: "Neuf",           vendor: "Linen House",      vendorCity: "Vevey",      vendorRating: 4.7, vendorReviews: 168,                  shipping: 0,   shippingDays: "2-4 j",   stock: 14, reviews: 54,  rating: 4.7, sold: 174 },
  { id: "b12", title: "Four pyrolyse encastrable 71 L",                 category: "Électroménager",  cover: "https://images.unsplash.com/photo-1574269910231-bc508bcb8e29?w=600", price: 749,   oldPrice: 899,  condition: "Neuf",           vendor: "ElectroMax",       vendorCity: "Bâle",       vendorRating: 4.4, vendorReviews: 184,                  shipping: 35,  shippingDays: "5-7 j",   stock: 11, reviews: 73,  rating: 4.5, sold: 49 },
  { id: "b13", title: "Plan de travail bois massif chêne",              category: "Cuisines",        cover: "https://images.unsplash.com/photo-1556909114-44e3e9636da7?w=600", price: 540,                   condition: "Neuf",           vendor: "Bois & Co.",       vendorCity: "Bulle",      vendorRating: 4.9, vendorReviews: 318, topRated: true,  shipping: 65,  shippingDays: "5-8 j",   stock: 9,  reviews: 28,  rating: 4.8, sold: 22 },
  { id: "b14", title: "Perceuse visseuse 18 V (occasion testée)",       category: "Équipements",     cover: "https://images.unsplash.com/photo-1583858175013-d3b7ec3a0f44?w=600", price: 89,    oldPrice: 159,  condition: "Occasion",       vendor: "OutilsRéparés",    vendorCity: "Genève",     vendorRating: 4.3, vendorReviews: 64,                   shipping: 12,  shippingDays: "3-5 j",   stock: 3,  reviews: 14,  rating: 4.2, sold: 17 },
  { id: "b15", title: "Suspension cuivre artisanale",                   category: "Décoration",      cover: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600", price: 215,                   condition: "Neuf",           vendor: "Atelier Argile",   vendorCity: "Fribourg",   vendorRating: 4.9, vendorReviews: 76,  topRated: true,  shipping: 15,  shippingDays: "2-3 j",   stock: 8,  reviews: 22,  rating: 4.9, sold: 41 },
  { id: "b16", title: "Hotte aspirante îlot inox",                      category: "Électroménager",  cover: "https://images.unsplash.com/photo-1556909114-37c9b8aacc7e?w=600", price: 1190,                  condition: "Neuf",           vendor: "ElectroMax",       vendorCity: "Bâle",       vendorRating: 4.4, vendorReviews: 184,                  shipping: 0,   shippingDays: "7-10 j",  stock: 4,  reviews: 19,  rating: 4.4, sold: 12 },
];

const SORTS = [
  { key: "popular",   label: "Plus populaires" },
  { key: "price-asc", label: "Prix croissant" },
  { key: "price-desc",label: "Prix décroissant" },
  { key: "rating",    label: "Meilleures notes" },
  { key: "new",       label: "Nouveautés" },
] as const;

type SortKey = typeof SORTS[number]["key"];

// ─── Étoiles ────────────────────────────────────────────────────────────

function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          style={{
            color: s <= Math.round(rating) ? "var(--rating)" : "var(--card-border)",
            fill: s <= Math.round(rating) ? "var(--rating)" : "transparent",
          }}
        />
      ))}
    </span>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────

export default function BoutiquePage() {
  const { formatPrice, cart, cartCount, addToCart, updateCartQty, removeFromCart, clearCart } = useApp();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [conditions, setConditions] = useState<Set<Condition>>(new Set());
  const [freeShippingOnly, setFreeShippingOnly] = useState(false);
  const [topRatedOnly, setTopRatedOnly] = useState(false);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sort, setSort] = useState<SortKey>("popular");
  const [toastVisible, setToastVisible] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile drawer

  const activeFiltersCount =
    (conditions.size) +
    (freeShippingOnly ? 1 : 0) +
    (topRatedOnly ? 1 : 0) +
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
    setTopRatedOnly(false);
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
      const matchTop = !topRatedOnly || p.topRated === true;
      const matchPrice = p.price >= minN && p.price <= maxN;
      return matchSearch && matchCat && matchCond && matchShip && matchTop && matchPrice;
    });
    switch (sort) {
      case "price-asc":   arr.sort((a, b) => a.price - b.price); break;
      case "price-desc":  arr.sort((a, b) => b.price - a.price); break;
      case "rating":      arr.sort((a, b) => b.rating - a.rating); break;
      case "new":         arr.sort((a, b) => b.stock - a.stock); break;
      case "popular":
      default:            arr.sort((a, b) => b.sold - a.sold); break;
    }
    return arr;
  }, [search, category, conditions, freeShippingOnly, topRatedOnly, priceMin, priceMax, sort]);

  const isInCart = (id: string) => cart.some((c) => c.id === id);

  const handleAddToCart = (p: Product) => {
    addToCart({ id: p.id, title: p.title, price: p.price, currency: "CHF", cover: p.cover });
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2200);
  };

  const cartSubtotal = useMemo(
    () => cart.reduce((s, c) => s + (c.price ?? 0) * c.qty, 0),
    [cart]
  );

  return (
    <div className="min-h-screen text-[var(--foreground)]">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">

        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl page-heading">Boutique E-Dome</h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Marketplace : meubles, déco, matériaux, cuisines, équipements, électroménager — vendeurs vérifiés.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            <button
              onClick={() => setCartOpen(true)}
              className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ border: "1px solid var(--card-border)", background: "var(--card)", color: "var(--foreground)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--card)")}
            >
              <ShoppingBag size={16} />
              Panier
              {cartCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 rounded-full text-[11px] font-semibold px-1.5 tabular-nums"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
                  {cartCount}
                </span>
              )}
            </button>
            <Link href="/boutique/vendre" className="px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-white"
              style={{ background: "var(--primary)" }}>
              Vendre un produit
            </Link>
          </div>
        </header>

        {/* Cadrage V1.0 — discret */}
        <div className="rounded-xl px-3 py-2 text-xs flex items-start gap-2"
          style={{ background: "var(--card)", border: "1px solid var(--card-border)", color: "var(--text-secondary)" }}>
          <Shield size={14} style={{ color: "var(--primary)", marginTop: 1 }} className="shrink-0" />
          <span>
            <strong style={{ color: "var(--foreground)" }}>E-Dome fournit la vitrine + paiement + visibilité.</strong>{" "}
            Vendeurs responsables des produits, expéditions et SAV. Commission marketplace 4–8 %, jamais ajoutée au prix payé.
          </span>
        </div>

        {/* Recherche large */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input
            type="search"
            placeholder="Rechercher un produit, une boutique, un matériau…"
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
                          background: active ? "rgba(30,157,241,0.08)" : "transparent",
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
                          className="accent-[#1e9df1]"
                        />
                        {c}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Livraison + top vendeur */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: "var(--text-secondary)" }}>
                  <input
                    type="checkbox"
                    checked={freeShippingOnly}
                    onChange={(e) => setFreeShippingOnly(e.target.checked)}
                    className="accent-[#1e9df1]"
                  />
                  <Truck size={13} style={{ color: "var(--text-muted)" }} />
                  Livraison gratuite
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: "var(--text-secondary)" }}>
                  <input
                    type="checkbox"
                    checked={topRatedOnly}
                    onChange={(e) => setTopRatedOnly(e.target.checked)}
                    className="accent-[#1e9df1]"
                  />
                  <Sparkles size={13} style={{ color: "var(--text-muted)" }} />
                  Top vendeur
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
                        {p.topRated && (
                          <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold"
                            style={{ background: "#0f172a", color: "#fff" }}>
                            <Sparkles size={10} /> Top vendeur
                          </span>
                        )}
                        {discount > 0 && (
                          <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
                            style={{ background: "var(--destructive)" }}>
                            -{discount}%
                          </span>
                        )}
                        <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-medium"
                          style={{ background: "rgba(255,255,255,0.92)", color: "var(--foreground)" }}>
                          {p.condition}
                        </span>
                      </Link>

                      {/* Contenu */}
                      <div className="p-3 flex flex-col flex-1 gap-1.5">
                        <Link href={`/boutique/${p.id}`}
                          className="text-[13px] font-medium leading-tight line-clamp-2 hover:underline"
                          style={{ color: "var(--foreground)" }}
                        >
                          {p.title}
                        </Link>

                        {/* Prix */}
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

                        {/* Étoiles produit + nb avis */}
                        <div className="flex items-center gap-1">
                          <Stars rating={p.rating} size={12} />
                          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                            ({p.reviews})
                          </span>
                        </div>

                        {/* Livraison */}
                        <div className="flex items-center gap-1 text-[11px]" style={{ color: p.shipping === 0 ? "var(--success)" : "var(--text-muted)" }}>
                          <Truck size={11} />
                          {p.shipping === 0 ? "Livraison gratuite" : `+${formatPrice(p.shipping)} livraison`}
                          <span style={{ color: "var(--text-muted)" }}>· {p.shippingDays}</span>
                        </div>

                        {/* Vendeur */}
                        <Link href="#" className="flex items-center gap-1 text-[11px] truncate hover:underline" style={{ color: "var(--text-secondary)" }}>
                          <span className="truncate">{p.vendor}</span>
                          <span style={{ color: "var(--text-muted)" }}>·</span>
                          <Star size={10} style={{ color: "var(--rating)", fill: "var(--rating)" }} />
                          <span className="tabular-nums">{p.vendorRating.toFixed(1)}</span>
                          <span style={{ color: "var(--text-muted)" }} className="tabular-nums">({p.vendorReviews})</span>
                        </Link>

                        {/* Localisation + ventes */}
                        <div className="flex items-center justify-between text-[11px]" style={{ color: "var(--text-muted)" }}>
                          <span className="inline-flex items-center gap-0.5"><MapPin size={11} /> {p.vendorCity}</span>
                          <span className="tabular-nums">{p.sold} vendus</span>
                        </div>

                        {/* CTA */}
                        <div className="mt-1.5 flex gap-1.5">
                          {isInCart(p.id) ? (
                            <button
                              onClick={() => setCartOpen(true)}
                              className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                              style={{ background: "color-mix(in srgb, var(--success) 12%, transparent)", color: "var(--success)" }}
                            >
                              <Check size={12} strokeWidth={2.5} /> Au panier
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(p)}
                              disabled={p.stock === 0}
                              className="flex-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors text-white disabled:opacity-40 disabled:cursor-not-allowed"
                              style={{ background: p.stock === 0 ? "var(--text-muted)" : "var(--primary)" }}
                            >
                              Ajouter
                            </button>
                          )}
                          <Link
                            href={`/boutique/${p.id}`}
                            className="px-2 py-1.5 rounded-lg text-xs font-medium transition-colors"
                            style={{ border: "1px solid var(--card-border)", color: "var(--text-secondary)" }}
                          >
                            Voir
                          </Link>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Toast notification — décalé au-dessus de la bottom-nav mobile
            (~80 px + safe-area), retour au bas standard en md+. */}
        {toastVisible && (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-[calc(80px+env(safe-area-inset-bottom)+1rem)] md:bottom-6 right-4 md:right-6 left-4 md:left-auto z-50 px-4 py-2.5 rounded-xl text-sm font-medium animate-fade-in text-center md:text-left"
            style={{ background: "var(--success)", color: "#fff", boxShadow: "0 4px 14px color-mix(in srgb, var(--success) 25%, transparent)" }}>
            Produit ajouté au panier
          </div>
        )}

        {/* Drawer panier */}
        {cartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setCartOpen(false)}>
            <div className="absolute inset-0 animate-fade-in" style={{ background: "rgba(15,23,42,0.4)" }} />
            <aside onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md h-full flex flex-col animate-slide-in-right"
              style={{ background: "var(--card)", borderLeft: "1px solid var(--card-border)" }}
            >
              <header className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: "1px solid var(--card-border)" }}>
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} style={{ color: "var(--foreground)" }} />
                  <h3 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
                    Panier ({cartCount})
                  </h3>
                </div>
                <button onClick={() => setCartOpen(false)} aria-label="Fermer"
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <X size={18} />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                {cart.length === 0 ? (
                  <div className="py-16 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                    Votre panier est vide.
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {cart.map((item) => (
                      <li key={item.id} className="flex gap-3 p-3 rounded-xl"
                        style={{ border: "1px solid var(--card-border)" }}>
                        {item.cover && (
                          <img src={item.cover} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-tight line-clamp-2"
                            style={{ color: "var(--foreground)" }}>{item.title}</p>
                          <p className="text-sm font-semibold mt-1 tabular-nums"
                            style={{ color: "var(--primary)" }}>
                            {formatPrice((item.price ?? 0) * item.qty)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => updateCartQty(item.id, item.qty - 1)}
                              className="w-7 h-7 rounded-md transition-colors"
                              style={{ background: "var(--hover-bg)", color: "var(--foreground)" }}
                              aria-label="Diminuer">−</button>
                            <span className="text-sm font-medium tabular-nums w-6 text-center"
                              style={{ color: "var(--foreground)" }}>{item.qty}</span>
                            <button onClick={() => updateCartQty(item.id, item.qty + 1)}
                              className="w-7 h-7 rounded-md transition-colors"
                              style={{ background: "var(--hover-bg)", color: "var(--foreground)" }}
                              aria-label="Augmenter">+</button>
                            <button onClick={() => removeFromCart(item.id)}
                              className="ml-auto text-xs"
                              style={{ color: "var(--text-muted)" }}>Retirer</button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {cart.length > 0 && (
                <footer className="px-5 py-4 space-y-3"
                  style={{ borderTop: "1px solid var(--card-border)" }}>
                  <div className="flex items-center justify-between text-sm"
                    style={{ color: "var(--text-secondary)" }}>
                    <span>Sous-total</span>
                    <span className="font-semibold tabular-nums" style={{ color: "var(--foreground)" }}>
                      {formatPrice(cartSubtotal)}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    Paiement sécurisé E-Dome (démonstration). Commission marketplace 4–8 %, déjà incluse côté vendeur — jamais ajoutée au prix payé.
                  </p>
                  <div className="flex gap-2">
                    <button onClick={clearCart}
                      className="px-3 py-2 text-sm rounded-xl transition-colors"
                      style={{ border: "1px solid var(--card-border)", color: "var(--text-secondary)", background: "var(--card)" }}>
                      Vider
                    </button>
                    <button onClick={() => alert("Paiement (démo) : Stripe Connect sera intégré en Phase 4 V1.0.")}
                      className="flex-1 px-4 py-2 text-sm font-medium rounded-xl transition-colors text-white"
                      style={{ background: "var(--primary)" }}>
                      Passer commande
                    </button>
                  </div>
                </footer>
              )}
            </aside>
          </div>
        )}

      </div>
    </div>
  );
}
