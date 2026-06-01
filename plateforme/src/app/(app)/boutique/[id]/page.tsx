"use client";

import React, { useState, use, useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Star,
  ShoppingBag,
  Heart,
  Share2,
  Truck,
  Undo2,
  Shield,
  CheckCircle2,
  MessageCircle,
  ChevronLeft,
  Sparkles,
  Building2,
  MapPin,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { BlurImage } from "@/components/ui/blur-image";

/* /boutique/[id] — Fiche produit refondue au standard marketplace (eBay).

   Layout 3 colonnes desktop : galerie (col-span-7) | infos+CTA (col-span-5).
   En bas : caracteristiques + description + vendeur etendu + similaires.

   Donnees fictives uniquement, alignees sur le mock principal /boutique
   pour garder la coherence (meme cover, vendor, rating, condition, etc.). */

// ─── Types ──────────────────────────────────────────────────────────────

type Condition = "Neuf" | "Reconditionné" | "Occasion";

interface Product {
  id: string;
  title: string;
  category: string;
  vendor: string;
  vendorAvatar: string;
  vendorCity: string;
  vendorRating: number;
  vendorReviews: number;
  topRated?: boolean;
  rating: number;
  reviews: number;
  price: number;
  oldPrice?: number;
  unit?: string;
  stock: number;
  sold: number;
  condition: Condition;
  shipping: number; // 0 = gratuit
  shippingDays: string;
  returnDays: number;
  description: string;
  specs: { label: string; value: string }[];
  gallery: string[];
}

// ─── Données fictives (réutilisent les images/vendor du mock /boutique) ──

const PRODUCTS: Product[] = [
  {
    id: "b1",
    title: "Canapé d'angle modulable lin naturel",
    category: "Meubles",
    vendor: "Maison Léman",
    vendorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop",
    vendorCity: "Lausanne",
    vendorRating: 4.8,
    vendorReviews: 412,
    topRated: true,
    rating: 4.8,
    reviews: 142,
    price: 2490,
    oldPrice: 2890,
    stock: 4,
    sold: 86,
    condition: "Neuf",
    shipping: 0,
    shippingDays: "3-5 j",
    returnDays: 30,
    description:
      "Canapé d'angle 5 places modulable, recouvert en lin naturel hypoallergénique. Mousse haute densité, structure en hêtre massif. Livraison incluse en Suisse romande, montage sur demande.",
    specs: [
      { label: "Dimensions", value: "320 × 215 × 84 cm" },
      { label: "Tissu", value: "Lin naturel, déhoussable" },
      { label: "Structure", value: "Hêtre massif" },
      { label: "Garantie", value: "5 ans" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1000",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1000",
      "https://images.unsplash.com/photo-1605883705077-8d3d8c84a8d2?w=1000",
    ],
  },
  {
    id: "b2",
    title: "Lampadaire design laiton noir",
    category: "Décoration",
    vendor: "Studio Verbier",
    vendorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop",
    vendorCity: "Verbier",
    vendorRating: 4.6,
    vendorReviews: 218,
    rating: 4.6,
    reviews: 67,
    price: 389,
    stock: 12,
    sold: 132,
    condition: "Neuf",
    shipping: 12,
    shippingDays: "2-4 j",
    returnDays: 14,
    description:
      "Lampadaire industriel en laiton noir mat, bras articulé, abat-jour orientable. Pour salon, bureau ou coin lecture. Ampoule E27 LED chaude incluse.",
    specs: [
      { label: "Hauteur max.", value: "175 cm" },
      { label: "Matériau", value: "Laiton noir mat" },
      { label: "Ampoule", value: "E27 LED 9 W incluse" },
      { label: "Garantie", value: "2 ans" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1000",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1000",
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1000",
    ],
  },
  {
    id: "b3",
    title: "Parquet chêne massif huilé — 18 m²",
    category: "Matériaux",
    vendor: "Bois & Co.",
    vendorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop",
    vendorCity: "Bulle",
    vendorRating: 4.9,
    vendorReviews: 318,
    topRated: true,
    rating: 4.9,
    reviews: 203,
    price: 1480,
    unit: "/ 18 m²",
    stock: 22,
    sold: 56,
    condition: "Neuf",
    shipping: 89,
    shippingDays: "7-10 j",
    returnDays: 14,
    description:
      "Parquet en chêne massif huilé à chaud, lames de 20 cm de large. Origine France, certifié PEFC. Prix pour 18 m² couvrant une pièce standard.",
    specs: [
      { label: "Essence", value: "Chêne massif" },
      { label: "Finition", value: "Huilé à chaud" },
      { label: "Largeur lame", value: "20 cm" },
      { label: "Surface couverte", value: "18 m²" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1000",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1000",
      "https://images.unsplash.com/photo-1565796330194-d5d10c0e8e1c?w=1000",
    ],
  },
  {
    id: "b4",
    title: "Cuisine sur mesure noyer + îlot quartz",
    category: "Cuisines",
    vendor: "Cuisinea Geneva",
    vendorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop",
    vendorCity: "Genève",
    vendorRating: 4.7,
    vendorReviews: 92,
    rating: 4.7,
    reviews: 38,
    price: 18900,
    stock: 1,
    sold: 12,
    condition: "Neuf",
    shipping: 0,
    shippingDays: "Sur RDV",
    returnDays: 0,
    description:
      "Cuisine sur mesure linéaire 4,2 m + îlot central 1,8 m. Façades en placage noyer, plan de travail quartz blanc 30 mm. Devis et plans inclus, pose réalisée par notre équipe en 3 semaines.",
    specs: [
      { label: "Linéaire", value: "4,2 m + îlot 1,8 m" },
      { label: "Façades", value: "Placage noyer huilé" },
      { label: "Plan de travail", value: "Quartz 30 mm" },
      { label: "Pose", value: "Incluse — 3 semaines" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1000",
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1000",
      "https://images.unsplash.com/photo-1556909249-f937e8e0d9e1?w=1000",
    ],
  },
  {
    id: "b5",
    title: "Robinet mitigeur cuivre brossé",
    category: "Équipements",
    vendor: "Plumbing Pro",
    vendorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop",
    vendorCity: "Zurich",
    vendorRating: 4.5,
    vendorReviews: 156,
    rating: 4.5,
    reviews: 88,
    price: 245,
    stock: 35,
    sold: 240,
    condition: "Neuf",
    shipping: 9,
    shippingDays: "2-3 j",
    returnDays: 30,
    description:
      "Mitigeur d'évier cuivre brossé, bec haut orientable 360°. Cartouche céramique, économiseur d'eau intégré. Compatible avec toutes installations standards.",
    specs: [
      { label: "Hauteur", value: "32 cm" },
      { label: "Finition", value: "Cuivre brossé" },
      { label: "Cartouche", value: "Céramique 25 mm" },
      { label: "Garantie", value: "10 ans" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1000",
      "https://images.unsplash.com/photo-1584622781867-bc5d0671e1f8?w=1000",
    ],
  },
  {
    id: "b6",
    title: "Lave-vaisselle encastrable A+++",
    category: "Électroménager",
    vendor: "ElectroMax",
    vendorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=60&fit=crop",
    vendorCity: "Bâle",
    vendorRating: 4.4,
    vendorReviews: 184,
    rating: 4.4,
    reviews: 56,
    price: 1290,
    oldPrice: 1490,
    stock: 8,
    sold: 41,
    condition: "Reconditionné",
    shipping: 49,
    shippingDays: "5-7 j",
    returnDays: 30,
    description:
      "Lave-vaisselle 60 cm encastrable totalement intégrable, classe A+++. 14 couverts, 6 programmes, fonction silence (38 dB). Installation par notre équipe en option.",
    specs: [
      { label: "Largeur", value: "60 cm" },
      { label: "Capacité", value: "14 couverts" },
      { label: "Classe énergie", value: "A+++" },
      { label: "Bruit", value: "38 dB" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=1000",
      "https://images.unsplash.com/photo-1574269910231-bc508bcb8e29?w=1000",
    ],
  },
];

// ─── Étoiles utilitaire ────────────────────────────────────────────────

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          style={{
            color: s <= Math.round(rating) ? "#fbbf24" : "var(--card-border)",
            fill: s <= Math.round(rating) ? "#fbbf24" : "transparent",
          }}
        />
      ))}
    </span>
  );
}

// ─── Composant Page ────────────────────────────────────────────────────

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { formatPrice, addToCart } = useApp();
  const { id } = use(params);
  const product = PRODUCTS.find((p) => p.id === id);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // Hooks doivent être appelés même si product est null — useMemo conditionnel.
  const similar = useMemo(() => {
    if (!product) return [];
    return PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
  }, [product]);

  const vendorOtherProducts = useMemo(() => {
    if (!product) return [];
    return PRODUCTS.filter((p) => p.id !== product.id && p.vendor === product.vendor).slice(0, 3);
  }, [product]);

  if (!product) return notFound();

  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  const handleAdd = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      currency: "CHF",
      qty,
      cover: product.gallery[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="min-h-screen text-[var(--foreground)]">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-fade-in">

        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
          <Link href="/boutique" className="hover:underline" style={{ color: "var(--text-secondary)" }}>
            Boutique
          </Link>
          <ChevronRight size={12} />
          <Link href={`/boutique?cat=${encodeURIComponent(product.category)}`} className="hover:underline" style={{ color: "var(--text-secondary)" }}>
            {product.category}
          </Link>
          <ChevronRight size={12} />
          <span style={{ color: "var(--foreground)" }} className="font-medium truncate max-w-[260px]">
            {product.title}
          </span>
        </nav>

        {/* Layout 2 colonnes principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Galerie — col-span-7 desktop */}
          <section className="lg:col-span-7 space-y-3">
            <div
              className="relative rounded-2xl overflow-hidden bg-[var(--hover-bg)]"
              style={{ aspectRatio: "4/3" }}
            >
              <BlurImage src={product.gallery[selectedImg]} alt={product.title} eager />
              {product.topRated && (
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold"
                  style={{ background: "#0f172a", color: "#fff" }}>
                  <Sparkles size={11} /> Top vendeur
                </span>
              )}
              {discount > 0 && (
                <span className="absolute top-3 right-3 px-2 py-1 rounded-md text-[11px] font-bold text-white"
                  style={{ background: "#dc2626" }}>
                  -{discount}%
                </span>
              )}
              {/* Navigation flèches galerie */}
              {product.gallery.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImg((i) => (i - 1 + product.gallery.length) % product.gallery.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                    style={{ background: "rgba(255,255,255,0.92)", color: "var(--foreground)" }}
                    aria-label="Image précédente"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setSelectedImg((i) => (i + 1) % product.gallery.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                    style={{ background: "rgba(255,255,255,0.92)", color: "var(--foreground)" }}
                    aria-label="Image suivante"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {/* Vignettes */}
            {product.gallery.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {product.gallery.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className="relative rounded-lg overflow-hidden bg-[var(--hover-bg)] transition-all"
                    style={{
                      aspectRatio: "1/1",
                      border: selectedImg === i ? "2px solid var(--primary)" : "2px solid transparent",
                      opacity: selectedImg === i ? 1 : 0.75,
                    }}
                    aria-label={`Image ${i + 1}`}
                    aria-current={selectedImg === i}
                  >
                    <BlurImage src={g} alt="" />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Infos + CTA — col-span-5 desktop */}
          <section className="lg:col-span-5 space-y-5">

            {/* En-tête */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium"
                  style={{ background: "var(--hover-bg)", color: "var(--text-secondary)" }}>
                  {product.category}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium"
                  style={{
                    background: product.condition === "Neuf" ? "rgba(16,185,129,0.10)" : "rgba(115,115,115,0.10)",
                    color: product.condition === "Neuf" ? "#059669" : "var(--text-secondary)",
                  }}>
                  État : {product.condition}
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-semibold leading-tight mt-3" style={{ color: "var(--foreground)" }}>
                {product.title}
              </h1>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <Stars rating={product.rating} />
                <Link href="#avis" className="hover:underline tabular-nums" style={{ color: "var(--text-secondary)" }}>
                  {product.rating.toFixed(1)} ({product.reviews} avis)
                </Link>
                <span style={{ color: "var(--text-muted)" }}>·</span>
                <span className="tabular-nums" style={{ color: "var(--text-muted)" }}>
                  {product.sold} vendus
                </span>
              </div>
            </div>

            {/* Prix */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-bold tabular-nums" style={{ color: "var(--foreground)" }}>
                  {formatPrice(product.price)}
                </span>
                {product.unit && (
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>{product.unit}</span>
                )}
                {product.oldPrice && (
                  <>
                    <span className="text-sm line-through tabular-nums" style={{ color: "var(--text-muted)" }}>
                      {formatPrice(product.oldPrice)}
                    </span>
                    <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: "#dc2626", color: "#fff" }}>
                      Vous économisez {formatPrice(product.oldPrice - product.price)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs" style={{ color: product.shipping === 0 ? "#059669" : "var(--text-muted)" }}>
                {product.shipping === 0
                  ? `Livraison GRATUITE en ${product.shippingDays}`
                  : `+ ${formatPrice(product.shipping)} de livraison · ${product.shippingDays}`}
              </p>
            </div>

            {/* Stock + qté + CTA */}
            <div className="space-y-3">
              <p className="text-sm" style={{ color: product.stock > 0 ? "#059669" : "#dc2626" }}>
                {product.stock > 0 ? (
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 size={14} />
                    {product.stock <= 3 ? `Plus que ${product.stock} en stock !` : `${product.stock} en stock`}
                  </span>
                ) : "Rupture de stock"}
              </p>

              <div className="flex items-center gap-3">
                <label className="text-xs" style={{ color: "var(--text-muted)" }}>Quantité</label>
                <div className="flex items-center rounded-lg overflow-hidden" style={{ border: "1px solid var(--card-border)" }}>
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 hover:bg-[var(--hover-bg)] transition-colors text-base leading-none"
                    aria-label="Diminuer"
                  >−</button>
                  <span className="px-3 text-sm font-medium tabular-nums w-10 text-center">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-1.5 hover:bg-[var(--hover-bg)] transition-colors text-base leading-none"
                    aria-label="Augmenter"
                  >+</button>
                </div>
              </div>

              <div className="space-y-2">
                {added ? (
                  <div className="w-full text-center px-4 py-3 rounded-xl text-sm font-medium animate-fade-in"
                    style={{ background: "rgba(16,185,129,0.12)", color: "#059669" }}>
                    Ajouté au panier ✓
                  </div>
                ) : (
                  <>
                    {/* CTA primaire eBay : Acheter maintenant */}
                    <button
                      onClick={handleAdd}
                      disabled={product.stock === 0}
                      className="w-full px-6 py-3 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: "var(--primary)" }}
                      onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = "var(--accent-hover)"; }}
                      onMouseLeave={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = "var(--primary)"; }}
                    >
                      Acheter maintenant
                    </button>
                    {/* CTA secondaire eBay : Ajouter au panier */}
                    <button
                      onClick={handleAdd}
                      disabled={product.stock === 0}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ border: "1px solid var(--primary)", color: "var(--primary)", background: "var(--card)" }}
                      onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = "rgba(30,157,241,0.06)"; }}
                      onMouseLeave={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = "var(--card)"; }}
                    >
                      <ShoppingBag size={16} />
                      Ajouter au panier
                    </button>
                  </>
                )}
                <div className="flex gap-2">
                  <button
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
                    style={{ border: "1px solid var(--card-border)", color: "var(--text-secondary)", background: "var(--card)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "var(--card)")}
                  >
                    <Heart size={14} />
                    Favoris
                  </button>
                  <button
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
                    style={{ border: "1px solid var(--card-border)", color: "var(--text-secondary)", background: "var(--card)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "var(--card)")}
                  >
                    <Share2 size={14} />
                    Partager
                  </button>
                </div>
              </div>
            </div>

            {/* Livraison & retours */}
            <div className="rounded-xl p-4 space-y-2.5" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
              <h3 className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--text-muted)" }}>
                Livraison &amp; retours
              </h3>
              <ul className="space-y-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                <li className="flex items-start gap-2">
                  <Truck size={14} style={{ color: "var(--text-muted)", marginTop: 1 }} />
                  <span>
                    {product.shipping === 0 ? "Livraison gratuite" : `Livraison ${formatPrice(product.shipping)}`} ·
                    Délai estimé <strong style={{ color: "var(--foreground)" }}>{product.shippingDays}</strong> en Suisse.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Undo2 size={14} style={{ color: "var(--text-muted)", marginTop: 1 }} />
                  <span>
                    {product.returnDays > 0
                      ? <>Retour gratuit sous <strong style={{ color: "var(--foreground)" }}>{product.returnDays} jours</strong>.</>
                      : "Vente ferme — produits sur mesure, non retournables."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield size={14} style={{ color: "var(--text-muted)", marginTop: 1 }} />
                  <span>Paiement sécurisé E-Dome. Protection acheteur incluse.</span>
                </li>
              </ul>
            </div>

            {/* Vendeur */}
            <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
              <div className="flex items-center gap-3">
                <img src={product.vendorAvatar} alt="" className="w-11 h-11 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Link href="#" className="text-sm font-semibold hover:underline truncate" style={{ color: "var(--foreground)" }}>
                      {product.vendor}
                    </Link>
                    {product.topRated && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold"
                        style={{ background: "#0f172a", color: "#fff" }}>
                        <Sparkles size={9} /> Top
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                    <Star size={11} style={{ color: "#fbbf24", fill: "#fbbf24" }} />
                    <span className="tabular-nums">{product.vendorRating.toFixed(1)}</span>
                    <span>· {product.vendorReviews} avis</span>
                    <span>·</span>
                    <MapPin size={11} />
                    <span>{product.vendorCity}</span>
                  </div>
                </div>
                <Link
                  href="/messages"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{ border: "1px solid var(--card-border)", color: "var(--foreground)", background: "var(--card)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--card)")}
                >
                  <MessageCircle size={13} />
                  Contacter
                </Link>
              </div>
              {vendorOtherProducts.length > 0 && (
                <div>
                  <p className="text-[11px] mb-2" style={{ color: "var(--text-muted)" }}>
                    Autres produits de ce vendeur :
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {vendorOtherProducts.map((p) => (
                      <Link
                        key={p.id}
                        href={`/boutique/${p.id}`}
                        className="block group"
                      >
                        <div className="relative rounded-lg overflow-hidden bg-[var(--hover-bg)]" style={{ aspectRatio: "1/1" }}>
                          <BlurImage src={p.gallery[0]} />
                        </div>
                        <p className="text-[11px] mt-1 truncate font-medium" style={{ color: "var(--foreground)" }}>
                          {p.title}
                        </p>
                        <p className="text-[11px] tabular-nums" style={{ color: "var(--primary)" }}>
                          {formatPrice(p.price)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Bas : Caractéristiques + Description */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
            <h2 className="text-sm uppercase tracking-wider font-semibold mb-3"
              style={{ color: "var(--text-muted)" }}>
              Caractéristiques
            </h2>
            <dl className="divide-y" style={{ borderColor: "var(--card-border)" }}>
              {product.specs.map((s) => (
                <div key={s.label} className="flex items-center justify-between py-2.5 text-sm">
                  <dt style={{ color: "var(--text-secondary)" }}>{s.label}</dt>
                  <dd className="font-medium tabular-nums text-right max-w-[60%]" style={{ color: "var(--foreground)" }}>
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
            <h2 className="text-sm uppercase tracking-wider font-semibold mb-3"
              style={{ color: "var(--text-muted)" }}>
              Description
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {product.description}
            </p>
          </section>
        </div>

        {/* Cadrage V1.0 — discret */}
        <div className="rounded-xl px-4 py-3 text-xs flex items-start gap-2"
          style={{ background: "var(--card)", border: "1px solid var(--card-border)", color: "var(--text-secondary)" }}>
          <Building2 size={14} style={{ color: "var(--primary)", marginTop: 1 }} className="shrink-0" />
          <span>
            <strong style={{ color: "var(--foreground)" }}>E-Dome fournit la vitrine + paiement + visibilité.</strong>{" "}
            Le vendeur reste responsable du produit, de l&apos;expédition et du SAV. Commission marketplace 4–8 %, prélevée sur ce qu&apos;E-Dome encaisse — jamais ajoutée au prix payé.
          </span>
        </div>

        {/* Produits similaires */}
        {similar.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                Produits similaires
              </h2>
              <Link
                href={`/boutique?cat=${encodeURIComponent(product.category)}`}
                className="text-xs hover:underline"
                style={{ color: "var(--primary)" }}
              >
                Voir toute la catégorie →
              </Link>
            </div>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {similar.map((p) => (
                <li key={p.id} className="rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(15,23,42,0.06)]"
                  style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
                  <Link href={`/boutique/${p.id}`} className="block">
                    <div className="relative bg-[var(--hover-bg)]" style={{ aspectRatio: "4/3" }}>
                      <BlurImage src={p.gallery[0]} alt={p.title} />
                    </div>
                    <div className="p-3 space-y-1">
                      <p className="text-[13px] font-medium leading-tight line-clamp-2" style={{ color: "var(--foreground)" }}>
                        {p.title}
                      </p>
                      <p className="text-sm font-bold tabular-nums" style={{ color: "var(--foreground)" }}>
                        {formatPrice(p.price)}
                      </p>
                      <p className="text-[11px]" style={{ color: p.shipping === 0 ? "#059669" : "var(--text-muted)" }}>
                        {p.shipping === 0 ? "Livraison gratuite" : `+${formatPrice(p.shipping)} livraison`}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
