"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/lib/context";

/* ─── Pôle Boutique e-commerce (V1.0) ────────────────────────────────────────
   Marketplace produits intégrée : meubles, décoration, matériaux de
   construction, cuisines, équipements, électroménager. Les vendeurs créent
   leur boutique et restent entièrement responsables de leurs produits.
   E-Dome fournit la vitrine, le paiement sécurisé et la visibilité.
   Commission marketplace 4–8 % au lancement. Aucun abonnement imposé. */

const CATEGORIES = [
  { label: "Tous", icon: "🛍️" },
  { label: "Meubles", icon: "🛋️" },
  { label: "Décoration", icon: "🖼️" },
  { label: "Matériaux", icon: "🧱" },
  { label: "Cuisines", icon: "🍳" },
  { label: "Équipements", icon: "🔧" },
  { label: "Électroménager", icon: "🔌" },
];

const GRADIENTS = [
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-slate-500 to-zinc-700",
  "from-emerald-500 to-teal-600",
  "from-purple-500 to-violet-600",
  "from-blue-500 to-indigo-600",
  "from-cyan-500 to-sky-600",
  "from-red-500 to-rose-600",
  "from-yellow-500 to-amber-600",
];

const PRODUCTS = [
  { id: "b1", title: "Canapé d'angle modulable lin naturel", category: "Meubles", vendor: "Maison Léman", vendorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop", rating: 4.8, reviews: 142, price: 2490, stock: 4, gradient: 0 },
  { id: "b2", title: "Lampadaire design laiton noir", category: "Décoration", vendor: "Studio Verbier", vendorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop", rating: 4.6, reviews: 67, price: 389, stock: 12, gradient: 1 },
  { id: "b3", title: "Parquet chêne massif huilé — 18 m²", category: "Matériaux", vendor: "Bois & Co.", vendorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop", rating: 4.9, reviews: 203, price: 1480, unit: "/ 18 m²", stock: 22, gradient: 2 },
  { id: "b4", title: "Cuisine sur mesure noyer + îlot quartz", category: "Cuisines", vendor: "Cuisinea Geneva", vendorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop", rating: 4.7, reviews: 38, price: 18900, stock: 1, gradient: 3 },
  { id: "b5", title: "Robinet mitigeur cuivre brossé", category: "Équipements", vendor: "Plumbing Pro", vendorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop", rating: 4.5, reviews: 88, price: 245, stock: 35, gradient: 4 },
  { id: "b6", title: "Lave-vaisselle encastrable A+++", category: "Électroménager", vendor: "ElectroMax", vendorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=60&fit=crop", rating: 4.4, reviews: 56, price: 1290, stock: 8, gradient: 5 },
  { id: "b7", title: "Table basse marbre travertin", category: "Meubles", vendor: "Maison Léman", vendorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop", rating: 4.7, reviews: 41, price: 690, stock: 6, gradient: 6 },
  { id: "b8", title: "Set de 4 chaises bouclette écru", category: "Meubles", vendor: "Deco Studio", vendorAvatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=60&h=60&fit=crop", rating: 4.6, reviews: 92, price: 980, unit: "/ set 4", stock: 14, gradient: 7 },
  { id: "b9", title: "Carrelage grès cérame XXL — 24 m²", category: "Matériaux", vendor: "TileMaster", vendorAvatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=60&h=60&fit=crop", rating: 4.8, reviews: 117, price: 2160, unit: "/ 24 m²", stock: 18, gradient: 8 },
];

const STEPS = [
  { number: "1", title: "Parcourez le catalogue", desc: "Filtrez par catégorie ou recherchez directement le produit qu'il vous faut. Vendeurs vérifiés, fiches détaillées." },
  { number: "2", title: "Ajoutez au panier", desc: "Comparez, ajoutez vos produits au panier, profitez du paiement sécurisé E-Dome." },
  { number: "3", title: "Livraison et SAV", desc: "Le vendeur expédie et reste responsable du produit. Le SAV passe par la messagerie E-Dome." },
];

/* ─── Stars ──────────────────────────────────────────────────────────────── */

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "text-amber-400" : "text-[var(--text-muted)]"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-[var(--text-muted)] ml-1">{rating.toFixed(1)}</span>
    </span>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function BoutiquePage() {
  const { formatPrice } = useApp();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tous");
  const [cart, setCart] = useState<Set<string>>(new Set());
  const [toastVisible, setToastVisible] = useState(false);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.vendor.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "Tous" || p.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category]);

  const addToCart = (productId: string) => {
    setCart((prev) => {
      const next = new Set(prev);
      next.add(productId);
      return next;
    });
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl page-heading">Boutique</h1>
            <p className="text-[var(--text-secondary)] mt-1">Meubles, décoration, matériaux, équipements — tout pour votre bien</p>
          </div>
          <Link href="/boutique/vendre" className="px-6 py-3 bg-[#1e9df1] hover:bg-[#1583c9] text-white rounded-xl font-medium transition-colors">
            Vendre un produit
          </Link>
        </div>

        {/* Cadrage V1.0 — petit bandeau qui rappelle la responsabilité des vendeurs */}
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-3 text-xs text-[var(--text-secondary)] leading-relaxed">
          <strong className="text-[var(--foreground)]">E-Dome fournit la vitrine, le paiement sécurisé et la visibilité.</strong>{" "}
          Les vendeurs restent responsables de leurs produits, du SAV et des livraisons. Commission marketplace 4–8 % au lancement, jamais ajoutée au prix payé par l&apos;acheteur.
        </div>

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Rechercher un produit ou une boutique..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-[var(--card)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#1e9df1]/50 transition-colors" />
        </div>

        {/* Category chips */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button key={cat.label} onClick={() => setCategory(cat.label)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === cat.label ? "bg-[#1e9df1] text-white" : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[#1e9df1]/40"}`}>
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <div key={product.id} className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl overflow-hidden hover:border-[#1e9df1]/40 transition-colors flex flex-col">
              {/* Gradient thumbnail (placeholder en attendant les vraies photos vendeurs) */}
              <Link href={`/boutique/${product.id}`} className={`block h-40 bg-gradient-to-br ${GRADIENTS[product.gradient]} flex items-center justify-center`}>
                <span className="text-5xl">{CATEGORIES.find((c) => c.label === product.category)?.icon ?? "🛍️"}</span>
              </Link>
              <div className="p-4 space-y-3 flex flex-col flex-1">
                <span className="inline-block w-fit px-2 py-0.5 bg-[#1e9df1]/20 text-[#1e9df1] rounded-full text-xs font-medium">{product.category}</span>
                <Link href={`/boutique/${product.id}`} className="font-semibold line-clamp-2 hover:text-[#1e9df1] transition-colors">
                  {product.title}
                </Link>
                <div className="flex items-center gap-2">
                  <img src={product.vendorAvatar} alt={product.vendor} className="w-6 h-6 rounded-full object-cover" />
                  <span className="text-sm text-[var(--text-secondary)]">{product.vendor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Stars rating={product.rating} />
                  <span className="text-xs text-[var(--text-muted)]">({product.reviews} avis)</span>
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  {product.stock > 0 ? `${product.stock} en stock` : "Rupture"}
                </p>
                <div className="flex items-center justify-between pt-2 mt-auto">
                  <div>
                    <span className="font-bold text-[#1e9df1]">{formatPrice(product.price)}</span>
                    {product.unit && <span className="text-xs text-[var(--text-muted)]"> {product.unit}</span>}
                  </div>
                  {cart.has(product.id) ? (
                    <span className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium">Au panier ✓</span>
                  ) : (
                    <button onClick={() => addToCart(product.id)} disabled={product.stock === 0} className="px-3 py-1.5 bg-[#1e9df1] hover:bg-[#1583c9] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors">
                      Ajouter
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-[var(--text-muted)] py-12">Aucun produit trouvé.</p>
        )}

        {/* Toast notification */}
        {toastVisible && (
          <div className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-green-600 text-white rounded-xl shadow-lg text-sm font-medium animate-fade-in">
            Produit ajouté au panier
          </div>
        )}

        {/* Comment ça marche */}
        <section className="py-10">
          <h2 className="text-2xl font-bold text-center mb-8">Comment ça marche</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step) => (
              <div key={step.number} className="text-center p-6 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl">
                <div className="w-12 h-12 bg-[#1e9df1]/20 text-[#1e9df1] rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.number}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
