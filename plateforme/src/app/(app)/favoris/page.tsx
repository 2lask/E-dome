"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Heart, FileText } from "lucide-react";
import { useApp } from "@/lib/context";
import type { Property } from "@/lib/types";

// ─── Mock data ──────────────────────────────────────────────────────────────

const emptyHost = (id: string, name: string, city: string) => ({
  id, firstName: name.split(" ")[0], lastName: name.split(" ")[1] || "", email: "", avatar: "", city, country: "Suisse",
  roles: ["hote" as const], activeRole: "hote" as const,
  stats: { followers: 0, following: 0, properties: 0, reviews: 0, rating: 0, transactions: 0, revenue: 0 }, bio: "",
});

const allProperties: Property[] = [
  {
    id: "prop2", title: "Appartement Vue Lac", description: "", type: "appartement", transactionType: "vente",
    price: 1250000, currency: "CHF", location: { city: "Montreux", country: "Suisse" },
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"],
    host: emptyHost("h2", "Sophie Martin", "Genève"),
    bedrooms: 3, bathrooms: 2, area: 120, amenities: ["Vue lac", "Parking"], rating: 4.7, reviewCount: 15,
  },
  {
    id: "prop3", title: "Villa Prestige", description: "", type: "villa", transactionType: "vente",
    price: 3200000, currency: "CHF", location: { city: "Lausanne", country: "Suisse" },
    images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop"],
    host: emptyHost("h1", "Léo Martin", "Lausanne"),
    bedrooms: 6, bathrooms: 4, area: 320, amenities: ["Piscine", "Jardin"], rating: 5.0, reviewCount: 8,
  },
  {
    id: "prop5", title: "Chalet Alpin Premium", description: "Un chalet de luxe à Verbier.", type: "chalet", transactionType: "location-ct",
    price: 350, currency: "CHF", location: { city: "Verbier", country: "Suisse" },
    images: ["https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop"],
    host: emptyHost("h1", "Léo Martin", "Lausanne"),
    bedrooms: 4, bathrooms: 3, area: 180, amenities: ["WiFi", "Cheminée"], rating: 4.9, reviewCount: 28,
  },
  {
    id: "prop9", title: "Studio Moderne Zürich", description: "", type: "studio", transactionType: "location-ct",
    price: 89, currency: "CHF", location: { city: "Zürich", country: "Suisse" },
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"],
    host: emptyHost("h3", "Jean Dupont", "Zürich"),
    bedrooms: 1, bathrooms: 1, area: 35, amenities: ["WiFi"], rating: 4.3, reviewCount: 42,
  },
  {
    id: "prop1", title: "Penthouse Genève", description: "", type: "penthouse", transactionType: "vente",
    price: 2800000, currency: "CHF", location: { city: "Genève", country: "Suisse" },
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop"],
    host: emptyHost("h4", "Marc Favre", "Genève"),
    bedrooms: 4, bathrooms: 3, area: 200, amenities: ["Terrasse", "Vue lac"], rating: 4.9, reviewCount: 12,
  },
  {
    id: "prop4", title: "Riad Marrakech", description: "", type: "villa", transactionType: "location-ct",
    price: 180, currency: "EUR", location: { city: "Marrakech", country: "Maroc" },
    images: ["https://images.unsplash.com/photo-1590059390258-ea0456c8548a?w=400&h=300&fit=crop"],
    host: emptyHost("h5", "Amira El Fassi", "Marrakech"),
    bedrooms: 4, bathrooms: 3, area: 250, amenities: ["Piscine", "Jardin"], rating: 4.8, reviewCount: 22,
  },
];

type SortKey = "recent" | "price-asc" | "price-desc" | "rating";

// ─── Component ──────────────────────────────────────────────────────────────

export default function FavorisPage() {
  const { favorites, toggleFavorite, formatPrice } = useApp();
  const [tab, setTab] = useState<"biens" | "publications">("biens");
  const [sort, setSort] = useState<SortKey>("recent");
  const [removing, setRemoving] = useState<Set<string>>(new Set());

  const favoriteProperties = useMemo(() => {
    let items = allProperties.filter((p) => favorites.has(p.id));
    switch (sort) {
      case "price-asc": items.sort((a, b) => a.price - b.price); break;
      case "price-desc": items.sort((a, b) => b.price - a.price); break;
      case "rating": items.sort((a, b) => b.rating - a.rating); break;
    }
    return items;
  }, [favorites, sort]);

  const handleRemove = (id: string) => {
    setRemoving((prev) => new Set(prev).add(id));
    setTimeout(() => {
      toggleFavorite(id);
      setRemoving((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 300);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 animate-fade-in">
      <h1 className="text-2xl page-heading text-[var(--foreground)] mb-6">Favoris</h1>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex gap-1">
          {[
            { key: "biens" as const, label: "Biens" },
            { key: "publications" as const, label: "Publications" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm rounded-xl transition-colors ${
                tab === t.key
                  ? "bg-[#1e9df1] text-white"
                  : "text-[var(--text-muted)] hover:bg-[var(--hover-bg)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "biens" && (
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="px-3 py-2 text-sm rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--text-secondary)]"
          >
            <option value="recent">Plus récents</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="rating">Meilleure note</option>
          </select>
        )}
      </div>

      {/* Content */}
      {tab === "biens" && (
        <>
          {favoriteProperties.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-[var(--card)] text-[var(--text-muted)] flex items-center justify-center mx-auto mb-4">
                <Heart size={26} strokeWidth={1.8} />
              </div>
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                Aucun favori
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                Explorez les biens et ajoutez vos coups de coeur ici.
              </p>
              <Link
                href="/explorer"
                className="inline-block px-6 py-2.5 text-sm rounded-xl bg-[#1e9df1] text-white hover:bg-[#1583c9]"
              >
                Explorer
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteProperties.map((p) => (
                <div
                  key={p.id}
                  className={`bg-[var(--card)] border border-[var(--card-border)] rounded-xl overflow-hidden transition-all duration-300 ${
                    removing.has(p.id) ? "opacity-0 scale-95" : "opacity-100 scale-100"
                  }`}
                >
                  <Link href={`/explorer/${p.id}`}>
                    <img src={p.images[0]} alt={p.title} className="w-full h-40 object-cover" />
                  </Link>
                  <div className="p-4">
                    <Link href={`/explorer/${p.id}`}>
                      <h3 className="text-sm font-semibold text-[var(--foreground)] truncate hover:text-[#1e9df1]">
                        {p.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      {p.location.city}, {p.location.country}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-[#1e9df1]">
                        {formatPrice(p.price, p.currency)}
                        {p.transactionType === "location-ct" ? "/nuit" : ""}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">
                        {p.rating} ({p.reviewCount})
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemove(p.id)}
                      className="mt-3 w-full py-1.5 text-xs rounded-lg border border-[var(--card-border)] text-[var(--text-muted)] hover:text-red-400 hover:border-red-400/30 transition-colors"
                    >
                      Retirer des favoris
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "publications" && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-[var(--card)] text-[var(--text-muted)] flex items-center justify-center mx-auto mb-4">
            <FileText size={26} strokeWidth={1.8} />
          </div>
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">
            Aucune publication sauvegardée
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Vos publications favorites apparaîtront ici.
          </p>
        </div>
      )}
    </div>
  );
}
