"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Heart, FileText } from "lucide-react";
import { useApp } from "@/lib/context";
import { getPropertiesByIds } from "@/lib/data/properties";

/* Les biens viennent de la couche de donnees. Ce fichier declarait
   auparavant son propre tableau de 6 biens dont les descriptions
   contredisaient le catalogue reel pour un meme identifiant : ajouter
   prop11 aux favoris depuis /explorer laissait cette page vide, et prop2
   y designait un bien different de celui qu'on avait aime. */

type SortKey = "recent" | "price-asc" | "price-desc" | "rating";

// ─── Component ──────────────────────────────────────────────────────────────

export default function FavorisPage() {
  const { favorites, toggleFavorite, formatPrice } = useApp();
  const [tab, setTab] = useState<"biens" | "publications">("biens");
  const [sort, setSort] = useState<SortKey>("recent");
  const [removing, setRemoving] = useState<Set<string>>(new Set());

  const favoriteProperties = useMemo(() => {
    /* Résolution par ids : le contexte ne persiste que des identifiants, et
       tout id du catalogue doit pouvoir s'afficher ici — pas seulement ceux
       d'un sous-ensemble codé en dur. */
    let items = getPropertiesByIds(favorites);
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
                  ? "bg-[var(--primary)] text-white"
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
                className="inline-block px-6 py-2.5 text-sm rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary)]"
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
                      <h3 className="text-sm font-semibold text-[var(--foreground)] truncate hover:text-[var(--primary)]">
                        {p.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      {p.location.city}, {p.location.country}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-[var(--primary)]">
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
