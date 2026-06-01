"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useApp } from "@/lib/context";

/* Mock — fiche produit. Dans une vraie implémentation, les données viendraient
   d'un store / d'une API ; ici on garde le même tableau que /boutique pour
   garantir la cohérence (catégories, prix, stock, vendeur). */

type Product = {
  id: string;
  title: string;
  category: string;
  vendor: string;
  vendorAvatar: string;
  rating: number;
  reviews: number;
  price: number;
  unit?: string;
  stock: number;
  description: string;
  specs: { label: string; value: string }[];
  gallery: string[]; // ici on n'a pas de vraies photos vendeurs → on simule avec des gradients
};

const PRODUCTS: Product[] = [
  {
    id: "b1",
    title: "Canapé d'angle modulable lin naturel",
    category: "Meubles",
    vendor: "Maison Léman",
    vendorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop",
    rating: 4.8, reviews: 142, price: 2490, stock: 4,
    description: "Canapé d'angle 5 places modulable, recouvert en lin naturel hypoallergénique. Mousse haute densité, structure en hêtre massif. Livraison incluse en Suisse romande, montage sur demande.",
    specs: [
      { label: "Dimensions", value: "320 × 215 × 84 cm" },
      { label: "Tissu", value: "Lin naturel, déhoussable" },
      { label: "Structure", value: "Hêtre massif" },
      { label: "Garantie", value: "5 ans" },
    ],
    gallery: ["from-amber-500 to-orange-600", "from-amber-400 to-yellow-600", "from-orange-600 to-red-600"],
  },
  {
    id: "b2",
    title: "Lampadaire design laiton noir",
    category: "Décoration",
    vendor: "Studio Verbier",
    vendorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop",
    rating: 4.6, reviews: 67, price: 389, stock: 12,
    description: "Lampadaire industriel en laiton noir mat, bras articulé, abat-jour orientable. Pour salon, bureau ou coin lecture. Ampoule E27 LED chaude incluse.",
    specs: [
      { label: "Hauteur max.", value: "175 cm" },
      { label: "Matériau", value: "Laiton noir mat" },
      { label: "Ampoule", value: "E27 LED 9 W incluse" },
      { label: "Garantie", value: "2 ans" },
    ],
    gallery: ["from-rose-500 to-pink-600", "from-pink-500 to-rose-700"],
  },
  {
    id: "b3",
    title: "Parquet chêne massif huilé — 18 m²",
    category: "Matériaux",
    vendor: "Bois & Co.",
    vendorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop",
    rating: 4.9, reviews: 203, price: 1480, unit: "/ 18 m²", stock: 22,
    description: "Parquet en chêne massif huilé à chaud, lames de 20 cm de large. Origine France, certifié PEFC. Prix pour 18 m² couvrant une pièce standard.",
    specs: [
      { label: "Essence", value: "Chêne massif" },
      { label: "Finition", value: "Huilé à chaud" },
      { label: "Largeur lame", value: "20 cm" },
      { label: "Surface couverte", value: "18 m²" },
    ],
    gallery: ["from-slate-500 to-zinc-700", "from-stone-600 to-amber-800"],
  },
  {
    id: "b4",
    title: "Cuisine sur mesure noyer + îlot quartz",
    category: "Cuisines",
    vendor: "Cuisinea Geneva",
    vendorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop",
    rating: 4.7, reviews: 38, price: 18900, stock: 1,
    description: "Cuisine sur mesure linéaire 4,2 m + îlot central 1,8 m. Façades en placage noyer, plan de travail quartz blanc 30 mm. Devis et plans inclus, pose réalisée par notre équipe en 3 semaines.",
    specs: [
      { label: "Linéaire", value: "4,2 m + îlot 1,8 m" },
      { label: "Façades", value: "Placage noyer huilé" },
      { label: "Plan de travail", value: "Quartz 30 mm" },
      { label: "Pose", value: "Incluse — 3 semaines" },
    ],
    gallery: ["from-emerald-500 to-teal-600", "from-teal-600 to-cyan-700"],
  },
  {
    id: "b5",
    title: "Robinet mitigeur cuivre brossé",
    category: "Équipements",
    vendor: "Plumbing Pro",
    vendorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop",
    rating: 4.5, reviews: 88, price: 245, stock: 35,
    description: "Mitigeur d'évier cuivre brossé, bec haut orientable 360°. Cartouche céramique, économiseur d'eau intégré. Compatible avec toutes installations standards.",
    specs: [
      { label: "Hauteur", value: "32 cm" },
      { label: "Finition", value: "Cuivre brossé" },
      { label: "Cartouche", value: "Céramique 25 mm" },
      { label: "Garantie", value: "10 ans" },
    ],
    gallery: ["from-purple-500 to-violet-600"],
  },
  {
    id: "b6",
    title: "Lave-vaisselle encastrable A+++",
    category: "Électroménager",
    vendor: "ElectroMax",
    vendorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=60&fit=crop",
    rating: 4.4, reviews: 56, price: 1290, stock: 8,
    description: "Lave-vaisselle 60 cm encastrable totalement intégrable, classe A+++. 14 couverts, 6 programmes, fonction silence (38 dB). Installation par notre équipe en option.",
    specs: [
      { label: "Largeur", value: "60 cm" },
      { label: "Capacité", value: "14 couverts" },
      { label: "Classe énergie", value: "A+++" },
      { label: "Bruit", value: "38 dB" },
    ],
    gallery: ["from-blue-500 to-indigo-600"],
  },
];

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { formatPrice } = useApp();
  const { id } = use(params);
  const product = PRODUCTS.find((p) => p.id === id);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return notFound();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
          <Link href="/boutique" className="hover:text-[#1e9df1] transition-colors">Boutique</Link>
          <span>·</span>
          <Link href={`/boutique?cat=${encodeURIComponent(product.category)}`} className="hover:text-[#1e9df1] transition-colors">{product.category}</Link>
          <span>·</span>
          <span className="text-[var(--foreground)]">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Galerie (gradients placeholders en attendant les photos vendeurs) */}
          <div className="space-y-3">
            <div className={`aspect-square rounded-2xl bg-gradient-to-br ${product.gallery[selectedImg]} flex items-center justify-center`}>
              <span className="text-7xl opacity-30">{product.category.charAt(0)}</span>
            </div>
            {product.gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.gallery.map((g, i) => (
                  <button key={i} onClick={() => setSelectedImg(i)} className={`aspect-square rounded-xl bg-gradient-to-br ${g} transition-all ${selectedImg === i ? "ring-2 ring-[#1e9df1]" : "opacity-70 hover:opacity-100"}`} />
                ))}
              </div>
            )}
          </div>

          {/* Infos */}
          <div className="space-y-5">
            <div>
              <span className="inline-block px-2 py-0.5 bg-[#1e9df1]/20 text-[#1e9df1] rounded-full text-xs font-medium">{product.category}</span>
              <h1 className="text-2xl md:text-3xl font-bold mt-3">{product.title}</h1>
            </div>

            {/* Vendeur */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--card)] border border-[var(--card-border)]">
              <img src={product.vendorAvatar} alt={product.vendor} className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1">
                <p className="text-sm font-medium">{product.vendor}</p>
                <p className="text-xs text-[var(--text-muted)]">Vendeur vérifié · Responsable du produit et du SAV</p>
              </div>
              <Link href="/messages" className="text-xs text-[#1e9df1] hover:underline">Contacter</Link>
            </div>

            {/* Notes */}
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? "text-amber-400" : "text-[var(--text-muted)]"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </span>
              <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-[var(--text-muted)]">({product.reviews} avis)</span>
            </div>

            {/* Prix */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#1e9df1]">{formatPrice(product.price)}</span>
              {product.unit && <span className="text-sm text-[var(--text-muted)]">{product.unit}</span>}
            </div>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{product.description}</p>

            {/* Spécifications */}
            <div className="rounded-xl border border-[var(--card-border)] divide-y divide-[var(--card-border)]">
              {product.specs.map((s) => (
                <div key={s.label} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span className="text-[var(--text-muted)]">{s.label}</span>
                  <span className="text-[var(--foreground)] font-medium">{s.value}</span>
                </div>
              ))}
            </div>

            {/* Stock + Qté + CTA */}
            <div className="space-y-3">
              <p className="text-xs text-[var(--text-muted)]">
                {product.stock > 0 ? `${product.stock} en stock — expédition sous 5 à 7 jours ouvrés` : "Rupture de stock"}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-xl border border-[var(--card-border)] overflow-hidden">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-[var(--hover-bg)] transition-colors">−</button>
                  <span className="px-4 text-sm font-medium tabular-nums">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="px-3 py-2 hover:bg-[var(--hover-bg)] transition-colors">+</button>
                </div>
                {added ? (
                  <span className="flex-1 text-center px-4 py-2.5 rounded-xl bg-green-500/20 text-green-400 text-sm font-medium">
                    Ajouté au panier ✓
                  </span>
                ) : (
                  <button
                    onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 2500); }}
                    disabled={product.stock === 0}
                    className="flex-1 px-6 py-3 bg-[#1e9df1] hover:bg-[#1583c9] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
                  >
                    Ajouter au panier
                  </button>
                )}
              </div>
            </div>

            {/* Cadrage V1.0 */}
            <div className="text-xs text-[var(--text-muted)] leading-relaxed border-t border-[var(--card-border)] pt-4">
              E-Dome fournit la vitrine, le paiement sécurisé et la visibilité. Le vendeur reste responsable du produit, de l&apos;expédition et du SAV. Commission marketplace 4–8 %, prélevée sur ce qu&apos;E-Dome encaisse — jamais ajoutée au prix.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
