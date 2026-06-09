"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── <HorizontalScroller /> ──────────────────────────────────────────────
   Carousel horizontal Airbnb-style (cf. capture utilisateur).

   Pattern Airbnb reproduit ici :
   1. Titre gros (text-xl/2xl bold) + flèche → cliquable à côté pour
      "Voir tout" (pas de texte "Voir tout", juste l'icône arrow).
   2. Subtitle optionnel en dessous, gris descriptif.
   3. Chevrons L/R PERMANENTS en haut-droite (pas opacity:0/hover), avec
      `disabled` quand on est en début/fin (gris clair).
   4. Track scrollable avec gap généreux entre cards, scroll snap mobile.

   Sur mobile : titre reste à gauche, chevrons cachés (gesture native),
   bleed `-mx-4 px-4` pour laisser les cards déborder off-screen.
   ─────────────────────────────────────────────────────────────────── */

export interface HorizontalScrollerProps {
  children: React.ReactNode;
  /** Titre de section (généralement bold, peut contenir un · séparateur). */
  title?: React.ReactNode;
  /** Subtitle gris descriptif sous le titre. */
  subtitle?: React.ReactNode;
  /** Href du "Voir tout" : si défini, affiche la flèche → cliquable. */
  ctaHref?: string;
  /** Largeur figée des cartes (CSS length). */
  cardWidth?: string;
  /** Gap entre cartes. */
  gap?: string;
  /** Affiche les chevrons desktop. */
  showArrows?: boolean;
  /** Alignement scroll-snap par enfant. */
  snap?: "start" | "center" | "end" | "none";
  className?: string;
  trackClassName?: string;
  ariaLabel?: string;
  /** Désactive le bleed mobile -mx-4/px-4 (utile dans un modal). */
  noBleed?: boolean;
}

export function HorizontalScroller({
  children,
  title,
  subtitle,
  ctaHref,
  cardWidth = "240px",
  gap = "16px",
  showArrows = true,
  snap = "start",
  className,
  trackClassName,
  ariaLabel,
  noBleed = false,
}: HorizontalScrollerProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(true);

  const updateScrollState = React.useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  React.useEffect(() => {
    updateScrollState();
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateScrollState]);

  const scrollByPage = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const snapClass =
    snap === "start"
      ? "snap-start"
      : snap === "center"
      ? "snap-center"
      : snap === "end"
      ? "snap-end"
      : "";

  return (
    <section
      className={cn("relative", className)}
      aria-label={
        ariaLabel ?? (typeof title === "string" ? title : undefined)
      }
    >
      {(title || subtitle || (showArrows && ctaHref)) && (
        <div className="flex items-start justify-between gap-4 mb-4 px-1">
          <div className="min-w-0 flex-1">
            {title && (
              <h2 className="text-xl md:text-2xl font-bold text-[var(--foreground)] inline-flex items-center gap-2">
                {title}
                {ctaHref && (
                  <Link
                    href={ctaHref}
                    aria-label="Voir tout"
                    className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--card)] border border-[var(--card-border)] hover:bg-[var(--hover-bg)] transition-colors"
                  >
                    <ArrowRight size={13} />
                  </Link>
                )}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {/* Chevrons desktop permanents en haut-droite (Airbnb pattern).
              Disabled (gris) quand on est en debut/fin du scroll. */}
          {showArrows && (
            <div className="hidden md:flex items-center gap-1 shrink-0">
              <button
                type="button"
                aria-label="Précédent"
                onClick={() => scrollByPage(-1)}
                disabled={!canPrev}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full transition-colors",
                  "bg-transparent border border-[var(--card-border)]",
                  "text-[var(--foreground)] hover:bg-[var(--hover-bg)]",
                  "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                )}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                aria-label="Suivant"
                onClick={() => scrollByPage(1)}
                disabled={!canNext}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full transition-colors",
                  "bg-transparent border border-[var(--card-border)]",
                  "text-[var(--foreground)] hover:bg-[var(--hover-bg)]",
                  "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                )}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Track scrollable */}
      <div
        ref={trackRef}
        onScroll={updateScrollState}
        className={cn(
          "no-scrollbar overflow-x-auto scroll-smooth",
          snap !== "none" && "snap-x snap-mandatory",
          !noBleed && "-mx-4 px-4 md:mx-0 md:px-0",
          trackClassName
        )}
      >
        <div className="flex" style={{ gap }}>
          {React.Children.map(children, (child, i) => (
            <div
              key={i}
              className={cn("shrink-0", snapClass)}
              style={{ width: cardWidth }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
