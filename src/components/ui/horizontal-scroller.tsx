"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── <HorizontalScroller /> ──────────────────────────────────────────────
   Carousel horizontal scrollable, fondation des sections type Airbnb
   ("Coups de cœur", "Récemment consultés", "Top apporteurs", etc.).

   Comportements clés :
   - Desktop : chevrons L/R en absolute, apparaissent au hover sur
     `group-hover`, disparaissent si on est en début/fin de scroll.
     Aussi visibles au focus-clavier (focus-visible) pour a11y.
   - Mobile : scrollbar masquée, scroll-snap mandatory, pas de chevrons
     (gesture native). La track déborde de -mx-4 px-4 pour bleed off-screen
     façon Stories Instagram.
   - Title + CTA "Voir tout" optionnels en header.
   - `cardWidth` figé pour produire des cartes uniformes, `gap` configurable.

   Usage canonique :
     <HorizontalScroller
       title="Biens en vedette"
       cta={{ label: "Voir tout", href: "/explorer" }}
       cardWidth="240px"
     >
       {biens.map((b) => <PropertyCard key={b.id} property={b} />)}
     </HorizontalScroller>
   ─────────────────────────────────────────────────────────────────── */

export interface HorizontalScrollerProps {
  children: React.ReactNode;
  /** Titre de section affiché au-dessus du carousel. */
  title?: React.ReactNode;
  /** Lien CTA "Voir tout" optionnel en haut à droite. */
  cta?: { label: string; href: string };
  /** Largeur figée des cartes (CSS length). 240px par défaut. */
  cardWidth?: string;
  /** Gap entre cartes. 16px par défaut. */
  gap?: string;
  /** Affiche les chevrons desktop (true par défaut). */
  showArrows?: boolean;
  /** Alignement scroll-snap par enfant. */
  snap?: "start" | "center" | "end" | "none";
  /** Classe du wrapper externe (section). */
  className?: string;
  /** Classe additionnelle sur la track scrollable. */
  trackClassName?: string;
  /** aria-label explicite (sinon dérivé du title). */
  ariaLabel?: string;
  /** Désactive le bleed mobile -mx-4/px-4 (utile dans un modal). */
  noBleed?: boolean;
}

export function HorizontalScroller({
  children,
  title,
  cta,
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
      className={cn("relative group", className)}
      aria-label={
        ariaLabel ?? (typeof title === "string" ? title : undefined)
      }
    >
      {(title || cta) && (
        <div className="flex items-end justify-between mb-3 px-1">
          {title ? (
            <h2 className="text-base md:text-lg font-semibold text-[var(--foreground)]">
              {title}
            </h2>
          ) : (
            <span />
          )}
          {cta && (
            <Link
              href={cta.href}
              className="inline-flex items-center gap-1 text-xs md:text-sm text-[var(--accent)] hover:underline whitespace-nowrap"
            >
              {cta.label}
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      )}

      <div className="relative">
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

        {/* Chevrons desktop : apparaissent au group-hover ou focus-visible.
           Cachés si on est à l'extrémité. */}
        {showArrows && (
          <>
            <button
              type="button"
              aria-label="Précédent"
              onClick={() => scrollByPage(-1)}
              disabled={!canPrev}
              className={cn(
                "hidden md:flex items-center justify-center",
                "absolute -left-3 top-1/2 -translate-y-1/2 z-10",
                "w-9 h-9 rounded-full",
                "bg-[var(--card)] border border-[var(--card-border)]",
                "shadow-md text-[var(--foreground)]",
                "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
                "transition-opacity",
                "hover:bg-[var(--hover-bg)]",
                "disabled:opacity-0 disabled:pointer-events-none"
              )}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Suivant"
              onClick={() => scrollByPage(1)}
              disabled={!canNext}
              className={cn(
                "hidden md:flex items-center justify-center",
                "absolute -right-3 top-1/2 -translate-y-1/2 z-10",
                "w-9 h-9 rounded-full",
                "bg-[var(--card)] border border-[var(--card-border)]",
                "shadow-md text-[var(--foreground)]",
                "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
                "transition-opacity",
                "hover:bg-[var(--hover-bg)]",
                "disabled:opacity-0 disabled:pointer-events-none"
              )}
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
