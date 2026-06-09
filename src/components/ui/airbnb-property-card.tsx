"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── <AirbnbPropertyCard /> ─────────────────────────────────────────────
   Reproduction fidèle du pattern card Airbnb (cf. capture utilisateur) :

   - Image carrée arrondie (4:3) sans bordure
   - Carousel photos intégré : swipe gauche/droite + dots indicators en
     bas de l'image, chevrons L/R au hover desktop (sans ouvrir la fiche)
   - Badge "Coup de cœur" optionnel haut-gauche dans pill blanc opaque
   - Bouton cœur favori haut-droite (sans fond, juste l'icône blanche
     avec stroke noir pour visibilité quelle que soit la photo)
   - 3 lignes texte épurées sous l'image avec séparateur · :
     - Type · Ville     (foreground, font-medium)
     - Période / sous-titre   (text-muted, optionnel)
     - Prix au total · ★ Rating   (foreground, prix bold)
   ─────────────────────────────────────────────────────────────────── */

export interface AirbnbPropertyCardProps {
  /** URL fiche détail. */
  href: string;
  /** Photos à afficher dans le carousel. Minimum 1. */
  images: string[];
  /** Type ou catégorie (ex: "Appartement", "Villa"). */
  type: string;
  /** Localisation courte (ex: "Khlong Toei"). */
  location: string;
  /** Sous-titre optionnel (ex: "12-14 juin"). */
  subtitle?: string;
  /** Prix formaté complet (ex: "75 € au total"). */
  priceLabel: string;
  /** Note 4.95 → affiché en bout de ligne prix. */
  rating?: number;
  /** Affiche le badge "Coup de cœur voyageurs" en haut-gauche. */
  highlighted?: boolean;
  /** Texte du badge (par défaut "Coup de cœur"). */
  highlightLabel?: string;
  /** Si le bien est favori (cœur rempli). */
  favorited?: boolean;
  /** Toggle favori. */
  onToggleFavorite?: () => void;
  className?: string;
}

export function AirbnbPropertyCard({
  href,
  images,
  type,
  location,
  subtitle,
  priceLabel,
  rating,
  highlighted = false,
  highlightLabel = "Coup de cœur",
  favorited = false,
  onToggleFavorite,
  className,
}: AirbnbPropertyCardProps) {
  const [photoIndex, setPhotoIndex] = React.useState(0);
  const touchStartXRef = React.useRef<number | null>(null);

  const goPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPhotoIndex((i) => Math.max(0, i - 1));
  };

  const goNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPhotoIndex((i) => Math.min(images.length - 1, i + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartXRef.current;
    if (start == null) return;
    const end = e.changedTouches[0]?.clientX ?? start;
    const delta = end - start;
    if (delta > 40 && photoIndex > 0) setPhotoIndex((i) => i - 1);
    else if (delta < -40 && photoIndex < images.length - 1) setPhotoIndex((i) => i + 1);
    touchStartXRef.current = null;
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.();
  };

  const hasMultiple = images.length > 1;

  return (
    <Link
      href={href}
      className={cn("group block", className)}
    >
      {/* ── Image avec carousel intégré ─────────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-[var(--hover-bg)]"
        style={{ aspectRatio: "1 / 1" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image courante avec transition opacity */}
        {images.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt=""
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
              i === photoIndex ? "opacity-100" : "opacity-0"
            )}
            loading={i === 0 ? "eager" : "lazy"}
            draggable={false}
          />
        ))}

        {/* Badge "Coup de cœur" haut-gauche (Airbnb pattern) */}
        {highlighted && (
          <div
            className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold pointer-events-none"
            style={{
              background: "#fff",
              color: "#222",
              boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
            }}
          >
            {highlightLabel}
          </div>
        )}

        {/* Bouton cœur favori haut-droite */}
        <button
          type="button"
          aria-label={favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
          onClick={handleHeartClick}
          className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 active:scale-90 transition-transform"
        >
          <Heart
            size={26}
            fill={favorited ? "#ff385c" : "rgba(0,0,0,0.45)"}
            stroke={favorited ? "#ff385c" : "#fff"}
            strokeWidth={2}
            className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
          />
        </button>

        {/* Chevrons L/R (au group-hover desktop, masqués en début/fin) */}
        {hasMultiple && (
          <>
            {photoIndex > 0 && (
              <button
                type="button"
                aria-label="Photo précédente"
                onClick={goPrev}
                className={cn(
                  "hidden md:flex items-center justify-center",
                  "absolute left-3 top-1/2 -translate-y-1/2",
                  "w-8 h-8 rounded-full bg-white text-[#222]",
                  "opacity-0 group-hover:opacity-100 transition-opacity",
                  "shadow-[0_1px_3px_rgba(0,0,0,0.25)] hover:scale-105"
                )}
              >
                <ChevronLeft size={16} strokeWidth={2.5} />
              </button>
            )}
            {photoIndex < images.length - 1 && (
              <button
                type="button"
                aria-label="Photo suivante"
                onClick={goNext}
                className={cn(
                  "hidden md:flex items-center justify-center",
                  "absolute right-3 top-1/2 -translate-y-1/2",
                  "w-8 h-8 rounded-full bg-white text-[#222]",
                  "opacity-0 group-hover:opacity-100 transition-opacity",
                  "shadow-[0_1px_3px_rgba(0,0,0,0.25)] hover:scale-105"
                )}
              >
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            )}

            {/* Dots indicators en bas (max 5 visibles) */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
              {images.slice(0, 5).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "rounded-full transition-all",
                    i === photoIndex
                      ? "w-1.5 h-1.5 bg-white"
                      : "w-1.5 h-1.5 bg-white/60"
                  )}
                />
              ))}
              {images.length > 5 && (
                <span className="text-[8px] text-white/80 leading-1.5 ml-0.5">
                  +{images.length - 5}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Texte sous l'image — Airbnb pattern 3 lignes ──────────────────── */}
      <div className="pt-3 space-y-0.5">
        <p className="text-sm font-medium text-[var(--foreground)] truncate">
          {type} <span className="text-[var(--text-muted)]">·</span> {location}
        </p>
        {subtitle && (
          <p className="text-sm text-[var(--text-muted)] truncate">{subtitle}</p>
        )}
        <p className="text-sm text-[var(--foreground)] flex items-center gap-1.5">
          <span className="font-semibold">{priceLabel}</span>
          {rating !== undefined && (
            <>
              <span className="text-[var(--text-muted)]">·</span>
              <span className="inline-flex items-center gap-0.5">
                <Star size={11} fill="currentColor" />
                <span className="tabular-nums">{rating.toFixed(2).replace(".", ",")}</span>
              </span>
            </>
          )}
        </p>
      </div>
    </Link>
  );
}
