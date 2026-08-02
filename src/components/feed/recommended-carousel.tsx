"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Crown, CalendarDays, ChevronLeft, ChevronRight, Coins, TrendingUp } from "lucide-react";
import { useApp } from "@/lib/context";
import { properties, events } from "@/lib/mock-data";
import type { Currency } from "@/lib/types";

/* Carrousel automatique de recommandations en tête du feed.
   Remplace l'ancienne barre « Espace apporteur ». Met en avant une
   sélection éditoriale : biens de prestige (les plus chers, toutes
   devises confondues) entrelacés avec des événements premium. Défile
   tout seul (5 s), se met en pause au survol, navigable aux flèches et
   aux puces. Chaque slide redirige vers la fiche (bien → /explorer/[id],
   événement → /evenements/[id]). */

// Conversion approximative vers CHF pour classer le prestige entre devises.
const TO_CHF: Record<string, number> = { CHF: 1, EUR: 0.96, USD: 0.88, GBP: 1.14, AED: 0.24, MAD: 0.09 };
const toChf = (price: number, currency: string) => price * (TO_CHF[currency] ?? 1);

type Slide = {
  id: string;
  href: string;
  badge: string;
  kind: "bien" | "evenement" | "apporteur";
  title: string;
  cta: string;
  image?: string;
  location?: string;
  price?: string;
  /** Sous-titre (slide promo apporteur). */
  subtitle?: string;
};

/* Slide promotionnelle : rejoindre le réseau d'apporteurs d'affaires. */
const APPORTEUR_SLIDE: Slide = {
  id: "apporteur-cta",
  href: "/apporteurs",
  kind: "apporteur",
  badge: "Programme apporteurs",
  title: "Commencez à toucher vos premières commissions",
  subtitle: "Recommandez des biens, formations et événements — et gagnez jusqu'à 0,5 % sur chaque vente conclue via votre lien.",
  cta: "Rejoindre le réseau",
};

const AUTOPLAY_MS = 5000;

export function RecommendedCarousel() {
  const { formatPrice } = useApp();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const slides = useMemo<Slide[]>(() => {
    const topProps = [...properties]
      .filter((p) => p.transactionType === "vente")
      .sort((a, b) => toChf(b.price, b.currency) - toChf(a.price, a.currency))
      .slice(0, 5);

    const topEvents = [...events].sort((a, b) => b.price - a.price).slice(0, 2);

    const propSlide = (p: (typeof topProps)[number]): Slide => ({
      id: `bien-${p.id}`,
      href: `/explorer/${p.id}`,
      image: p.images[0],
      badge: toChf(p.price, p.currency) >= 2_000_000 ? "Bien de prestige" : "Sélection premium",
      kind: "bien",
      title: p.title,
      location: `${p.location.city}, ${p.location.country}`,
      price: formatPrice(p.price, p.currency),
      cta: "Découvrir le bien",
    });

    const eventSlide = (e: (typeof topEvents)[number]): Slide => ({
      id: `event-${e.id}`,
      href: `/evenements/${e.id}`,
      image: e.thumbnail,
      badge: e.type.charAt(0).toUpperCase() + e.type.slice(1),
      kind: "evenement",
      title: e.title,
      location: e.location,
      price: e.price > 0 ? formatPrice(e.price, e.currency as Currency) : "Gratuit",
      cta: "Réserver ma place",
    });

    // Entrelace biens et événements pour varier le rythme éditorial.
    const merged: Slide[] = [];
    topProps.forEach((p, i) => {
      merged.push(propSlide(p));
      if (i === 1 && topEvents[0]) merged.push(eventSlide(topEvents[0]));
      if (i === 3 && topEvents[1]) merged.push(eventSlide(topEvents[1]));
    });
    // Insère la promo apporteur en 2ᵉ position (visible tôt, sans voler la
    // vedette au 1ᵉʳ bien de prestige).
    merged.splice(1, 0, APPORTEUR_SLIDE);
    return merged;
  }, [formatPrice]);

  const count = slides.length;

  // Défilement automatique, suspendu au survol.
  useEffect(() => {
    if (paused || count <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, count]);

  if (count === 0) return null;

  const go = (dir: number) => setIndex((i) => (i + dir + count) % count);

  return (
    <section aria-label="Recommandations">
      <div className="flex items-center justify-between mb-2 px-0.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] inline-flex items-center gap-1.5">
          <Crown className="w-3.5 h-3.5 text-[var(--primary)]" /> Sélection prestige · pour vous
        </p>
        <Link href="/explorer" className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--foreground)] transition inline-flex items-center gap-1">
          Tout voir <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div
        className="relative overflow-hidden rounded-2xl border border-[var(--card-border)] group"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Piste : chaque slide occupe 100% de la largeur. */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((s) =>
            s.kind === "apporteur" ? (
              /* Slide promo apporteur — fond de marque (dégradé émeraude), pas de photo. */
              <Link key={s.id} href={s.href} className="relative block w-full shrink-0 h-52 sm:h-56 overflow-hidden">
                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #065f46 0%, #0f172a 72%)" }} />
                <Coins aria-hidden className="absolute -right-5 -bottom-6 w-44 h-44 text-white/10" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-[11px] font-semibold uppercase tracking-wide ring-1 ring-white/25">
                    <Coins className="w-3 h-3" /> {s.badge}
                  </span>
                  <h3 className="text-white text-lg sm:text-xl font-bold leading-snug mt-2 line-clamp-2 drop-shadow max-w-[85%]">
                    {s.title}
                  </h3>
                  {s.subtitle && (
                    <p className="text-white/85 text-xs sm:text-[13px] mt-1 line-clamp-2 max-w-[92%]">{s.subtitle}</p>
                  )}
                  <div className="flex items-center justify-between gap-3 mt-2.5">
                    <span className="inline-flex items-center gap-1.5 text-white/90 text-xs font-medium">
                      <TrendingUp className="w-4 h-4" /> Gratuit · sans engagement
                    </span>
                    <span className="shrink-0 inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full bg-white text-black text-sm font-semibold group-hover:bg-white/90 transition">
                      {s.cta} <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              <Link key={s.id} href={s.href} className="relative block w-full shrink-0 h-52 sm:h-56">
                <img
                  src={s.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-[11px] font-semibold uppercase tracking-wide ring-1 ring-white/25">
                    {s.kind === "bien" ? <Crown className="w-3 h-3" /> : <CalendarDays className="w-3 h-3" />}
                    {s.badge}
                  </span>
                  <h3 className="text-white text-lg font-bold leading-snug mt-2 line-clamp-1 drop-shadow">
                    {s.title}
                  </h3>
                  <p className="text-white/80 text-xs mt-0.5 inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {s.location}
                  </p>
                  <div className="flex items-end justify-between gap-3 mt-2.5">
                    <p className="text-white text-xl font-bold drop-shadow">{s.price}</p>
                    <span className="shrink-0 inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full bg-white text-black text-sm font-semibold group-hover:bg-white/90 transition">
                      {s.cta} <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ),
          )}
        </div>

        {/* Flèches — visibles au survol (desktop). */}
        {count > 1 && (
          <>
            <button
              onClick={(e) => { e.preventDefault(); go(-1); }}
              aria-label="Recommandation précédente"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/65 transition z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); go(1); }}
              aria-label="Recommandation suivante"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/65 transition z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Puces de navigation. */}
        {count > 1 && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={(e) => { e.preventDefault(); setIndex(i); }}
                aria-label={`Aller à la recommandation ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
