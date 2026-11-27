"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Search, SearchX, Coins, SlidersHorizontal, X, Compass, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCard, TX_LABEL } from "@/components/listing/listing-card";
import { LAUNCH_CITIES, repriseOf, type MyProperty } from "@/lib/my-property";
import type { PropertyType, TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";

/* ── L'Explorer (REBUILD.md §3) ──────────────────────────────────────────────

   Les biens RÉELS, rien d'autre. Recherche plein texte (ville, titre,
   description), type de transaction, type de bien, budget, chambres — et le
   filtre propre à E-Dome : « Avec commission », pour qui veut recommander.
   Pas de carte tant que les biens n'ont pas de coordonnées : une carte vide
   ne servirait à rien. */

const TYPE_LABEL: Record<PropertyType, string> = {
  appartement: "Appartement", villa: "Villa", maison: "Maison", chalet: "Chalet", studio: "Studio",
  penthouse: "Penthouse", terrain: "Terrain", commercial: "Commercial", bureau: "Bureau", riad: "Riad",
};

type Sort = "recent" | "price-asc" | "price-desc" | "prime";

type Kind = TransactionType | "reprise" | "all";

/** Le « genre » d'une annonce pour le filtre : la reprise de bail est à part. */
const kindOf = (b: MyProperty): Exclude<Kind, "all"> => (repriseOf(b) ? "reprise" : b.transactionType);

const SEG_LABEL: Record<Exclude<Kind, "all">, string> = {
  vente: "Acheter", "location-lt": "Louer", reprise: "Reprises de bail", "location-ct": "Courte durée",
};
const KIND_LABEL: Record<Exclude<Kind, "all">, string> = {
  vente: TX_LABEL.vente, "location-lt": TX_LABEL["location-lt"], reprise: "Reprise de bail", "location-ct": TX_LABEL["location-ct"],
};

const normalize = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const selectCls =
  "h-11 rounded-xl border border-input bg-card px-3.5 pr-8 text-[13.5px] shadow-xs outline-none transition-colors hover:border-foreground/30 focus-visible:border-leman focus-visible:ring-3 focus-visible:ring-leman/15";

export function ExplorerView({ biens, initialQuery = "", initialPrimeOnly = false }: { biens: MyProperty[]; initialQuery?: string; initialPrimeOnly?: boolean }) {
  const [q, setQ] = useState(initialQuery);
  /* « reprise » : une location longue durée remise par son locataire. */
  const [tx, setTx] = useState<Kind>("all");
  const [city, setCity] = useState("");
  const [type, setType] = useState<PropertyType | "">("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRooms, setMinRooms] = useState(0);
  const [primeOnly, setPrimeOnly] = useState(initialPrimeOnly);
  const [sort, setSort] = useState<Sort>("recent");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const reduce = useReducedMotion();

  /* Ne proposer que ce qui existe réellement dans le catalogue. */
  const txAvailable = useMemo(() => (["vente", "location-lt", "reprise", "location-ct"] as const).filter((t) => biens.some((b) => kindOf(b) === t)), [biens]);
  /* Villes présentes, les villes de lancement d'abord. */
  const cities = useMemo(() => {
    const present = [...new Set(biens.map((b) => b.city.trim()).filter(Boolean))];
    return [...LAUNCH_CITIES.filter((c) => present.includes(c)), ...present.filter((c) => !LAUNCH_CITIES.includes(c)).sort((a, b) => a.localeCompare(b, "fr"))];
  }, [biens]);
  const typesAvailable = useMemo(() => [...new Set(biens.map((b) => b.type))], [biens]);
  const primedCount = biens.filter((b) => b.activePrimeChf).length;

  const results = useMemo(() => {
    const nq = normalize(q.trim());
    const max = Number(maxPrice.replace(/[^\d]/g, "")) || 0;
    const list = biens.filter((b) => {
      if (tx !== "all" && kindOf(b) !== tx) return false;
      if (city && b.city.trim() !== city) return false;
      if (type && b.type !== type) return false;
      if (max && b.price > max) return false;
      if (minRooms && b.bedrooms < minRooms) return false;
      if (primeOnly && !b.activePrimeChf) return false;
      if (nq && !normalize(`${b.city} ${b.title} ${b.description} ${b.address ?? ""}`).includes(nq)) return false;
      return true;
    });
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "prime") sorted.sort((a, b) => (b.activePrimeChf ?? 0) - (a.activePrimeChf ?? 0));
    else sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return sorted;
  }, [biens, q, tx, city, type, maxPrice, minRooms, primeOnly, sort]);

  const activeFilters = (type ? 1 : 0) + (maxPrice ? 1 : 0) + (minRooms ? 1 : 0) + (primeOnly ? 1 : 0);
  const hasAnyFilter = activeFilters > 0 || !!q || tx !== "all" || !!city;
  const reset = () => { setQ(""); setTx("all"); setCity(""); setType(""); setMaxPrice(""); setMinRooms(0); setPrimeOnly(false); };

  return (
    <div className="mx-auto max-w-6xl">
      {/* ── En-tête cinématique + recherche ─────────────────────────────── */}
      <header className="cine relative isolate overflow-hidden rounded-[28px] border border-white/10 px-5 py-8 sm:px-8 md:px-10 md:py-12">
        <div aria-hidden className="cine-aurora" />
        <div aria-hidden className="cine-grid" />
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgb(227_184_92/0.2),transparent_65%)]" />
        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#e3b85c]">
                <span aria-hidden className="h-px w-6 bg-[#e3b85c]/70" /> Explorer
              </p>
              <h1 className="mt-3 text-balance text-[32px] font-semibold leading-[1.04] tracking-[-0.035em] sm:text-[46px]">
                Des biens en direct <span className="cine-gold">de leurs propriétaires.</span>
              </h1>
              <p className="mt-3 text-[14.5px] text-white/65">
                {biens.length === 0
                  ? "Sans frais d'agence. Les premiers biens arrivent."
                  : `${biens.length} bien${biens.length > 1 ? "s" : ""} en ligne · sans frais d'agence${primedCount > 0 ? ` · ${primedCount} avec commission pour les apporteurs` : ""}`}
              </p>
            </div>
            <Link href="/apporteurs" className="cine-btn-gold hidden h-11 items-center gap-2 rounded-xl px-5 text-[14px] font-semibold md:inline-flex">
              <Coins className="h-4 w-4" aria-hidden /> Recommander et gagner
            </Link>
          </div>

          {biens.length > 0 && (
            <div className="mt-7 flex max-w-3xl items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.07] p-1.5 shadow-[0_20px_60px_-30px_rgb(0_0_0/0.8)] backdrop-blur-xl transition-colors focus-within:border-[#e3b85c]/60">
              <div className="relative flex min-w-0 flex-1 items-center">
                <Search className="pointer-events-none absolute left-3.5 h-[18px] w-[18px] text-white/55" aria-hidden />
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Ville, quartier, mot-clé…"
                  aria-label="Rechercher un bien"
                  className="h-12 w-full min-w-0 rounded-xl bg-transparent pl-11 pr-2 text-[15px] text-white outline-none placeholder:text-white/45 [&::-webkit-search-cancel-button]:hidden"
                />
                {q && (
                  <button type="button" onClick={() => setQ("")} aria-label="Effacer la recherche" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white">
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                )}
              </div>
              <button
                type="button"
                className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 text-[14px] font-medium text-white hover:bg-white/15 md:hidden"
                onClick={() => setFiltersOpen((o) => !o)}
                aria-expanded={filtersOpen}
                aria-controls="explorer-filtres"
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden />
                Filtres
                {activeFilters > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e3b85c] px-1 text-[11px] font-bold text-[#2a1d05]">{activeFilters}</span>
                )}
              </button>
            </div>
          )}
        </div>
      </header>

      {biens.length === 0 ? (
        <EmptyCatalogue />
      ) : (
        <>
          {/* ── Villes ─────────────────────────────────────────────────── */}
          {cities.length > 1 && (
            <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0" role="group" aria-label="Villes">
              {["", ...cities].map((c) => (
                <button
                  key={c || "toutes"}
                  type="button"
                  aria-pressed={city === c}
                  onClick={() => setCity(c)}
                  className={cn(
                    "h-11 shrink-0 rounded-full border px-4 text-[13.5px] font-medium transition-colors",
                    city === c ? "border-foreground bg-foreground text-background" : "bg-card text-foreground/80 hover:border-foreground/30 hover:text-foreground",
                  )}
                >
                  {c || "Toutes les villes"}
                </button>
              ))}
            </div>
          )}

          {/* ── Filtres ────────────────────────────────────────────────── */}
          <div
            id="explorer-filtres"
            className={cn(
              "mt-4 flex-wrap items-center gap-2 rounded-2xl border bg-card/70 p-2 backdrop-blur",
              filtersOpen ? "flex" : "hidden md:flex",
            )}
          >
            {txAvailable.length > 1 && (
              <div role="radiogroup" aria-label="Type de transaction" className="no-scrollbar inline-flex max-w-full overflow-x-auto rounded-xl bg-subtle p-1">
                {(["all", ...txAvailable] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    aria-checked={tx === t}
                    onClick={() => setTx(t)}
                    className={cn(
                      "h-9 shrink-0 rounded-lg px-3.5 text-[13.5px] transition-colors",
                      tx === t ? "bg-card font-semibold text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t === "all" ? "Tout" : SEG_LABEL[t]}
                  </button>
                ))}
              </div>
            )}

            {typesAvailable.length > 1 && (
              <select aria-label="Type de bien" value={type} onChange={(e) => setType(e.target.value as PropertyType | "")} className={selectCls}>
                <option value="">Tous les types</option>
                {typesAvailable.map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
              </select>
            )}

            <div className="relative">
              <input
                inputMode="numeric"
                aria-label="Budget maximum en francs"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Budget max"
                className={cn(selectCls, "w-40 pr-12")}
              />
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[12px] text-muted-foreground">CHF</span>
            </div>

            <select aria-label="Chambres minimum" value={minRooms} onChange={(e) => setMinRooms(Number(e.target.value))} className={selectCls}>
              <option value={0}>Chambres</option>
              {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}+ chambre{n > 1 ? "s" : ""}</option>)}
            </select>

            {primedCount > 0 && (
              <button
                type="button"
                aria-pressed={primeOnly}
                onClick={() => setPrimeOnly((p) => !p)}
                className={cn(
                  "inline-flex h-11 items-center gap-2 rounded-xl border px-3.5 text-[13.5px] font-medium transition-colors",
                  primeOnly
                    ? "border-[#f2c66b]/80 bg-[linear-gradient(180deg,#f9e7bb,#f2c66b)] text-[#4a3206] shadow-[0_0_22px_-6px_rgb(242_198_107/0.8)]"
                    : "border-laiton-border bg-laiton-soft text-laiton hover:border-laiton",
                )}
              >
                <Coins className="h-4 w-4" aria-hidden />
                Avec commission
                <span className={cn("rounded-full px-1.5 text-[11.5px] tabular-nums", primeOnly ? "bg-[#4a3206]/15" : "bg-laiton/15")}>{primedCount}</span>
              </button>
            )}

            <div className="flex items-center gap-2 md:ml-auto">
              {hasAnyFilter && (
                <button type="button" onClick={reset} className="inline-flex h-11 items-center gap-1.5 rounded-xl px-3 text-[13px] font-medium text-muted-foreground hover:bg-subtle hover:text-foreground">
                  <X className="h-3.5 w-3.5" aria-hidden /> Effacer
                </button>
              )}
              <select aria-label="Trier" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={selectCls}>
                <option value="recent">Plus récents</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                {primedCount > 0 && <option value="prime">Commission la plus élevée</option>}
              </select>
            </div>
          </div>

          {/* ── Résultats ──────────────────────────────────────────────── */}
          <p className="mt-7 text-[14px] text-muted-foreground" aria-live="polite">
            <strong className="font-semibold tabular-nums text-foreground">{results.length}</strong> résultat{results.length > 1 ? "s" : ""}
            {tx !== "all" ? ` · ${KIND_LABEL[tx]}` : ""}
            {city ? ` · ${city}` : ""}
          </p>
          {results.length > 0 ? (
            <div className="mt-4 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: Math.min(i, 8) * 0.05, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <ListingCard p={p} priority={i < 3} />
                </motion.div>
              ))}
              {/* Catalogue encore court : une invitation à publier, jamais de fausse annonce. */}
              {results.length < 3 && !hasAnyFilter && <PublishTile />}
            </div>
          ) : (
            <div className="relative mt-4 overflow-hidden rounded-[22px] border border-dashed bg-card px-6 py-14 text-center">
              <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(227_184_92/0.18),transparent_70%)]" />
              <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border bg-subtle">
                <SearchX className="h-6 w-6 text-muted-foreground" aria-hidden />
              </span>
              <p className="relative mt-4 text-[17px] font-semibold">Aucun bien ne correspond</p>
              <p className="relative mx-auto mt-1.5 max-w-sm text-[14px] text-muted-foreground">
                {q ? <>Rien pour « {q} ». </> : null}Élargissez votre budget, changez de ville ou retirez un filtre.
              </p>
              <Button variant="outline" className="relative mt-5 h-11" onClick={reset}>Effacer les filtres</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PublishTile() {
  return (
    <Link
      href="/publier"
      className="group/pub relative flex min-h-[280px] flex-col items-center justify-center overflow-hidden rounded-[22px] border border-dashed border-laiton-border bg-card/40 p-6 text-center outline-none transition-transform duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-leman motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(227_184_92/0.16),transparent_70%)] opacity-60 transition-opacity duration-500 group-hover/pub:opacity-100" />
      <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-laiton-border bg-laiton-soft text-laiton transition-transform duration-300 group-hover/pub:scale-110 motion-reduce:transition-none">
        <Plus className="h-5 w-5" aria-hidden />
      </span>
      <p className="relative mt-4 text-[16px] font-semibold tracking-[-0.01em]">Votre bien ici</p>
      <p className="relative mt-1 max-w-[240px] text-[13.5px] leading-relaxed text-muted-foreground">
        Publiez gratuitement, sans agence, et proposez une commission aux apporteurs si vous le souhaitez.
      </p>
      <span className="relative mt-4 inline-flex items-center gap-1 text-[13.5px] font-semibold text-laiton">
        Publier un bien <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/pub:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}

function EmptyCatalogue() {
  return (
    <section className="relative mt-6 overflow-hidden rounded-[28px] border bg-card px-6 py-16 text-center">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(227_184_92/0.2),transparent_70%)]" />
      <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-laiton-border bg-laiton-soft">
        <Compass className="h-6 w-6 text-laiton" aria-hidden />
      </span>
      <h2 className="relative mt-5 text-[20px] font-semibold tracking-[-0.015em]">Les premiers biens arrivent</h2>
      <p className="relative mx-auto mt-2 max-w-md text-[14.5px] leading-relaxed text-muted-foreground">
        E-Dome vient d&apos;ouvrir. Les biens publiés par leurs propriétaires apparaissent ici dès leur mise en ligne —
        sans annonces factices pour faire nombre.
      </p>
      <div className="relative mt-6 flex flex-wrap justify-center gap-2">
        <Button asChild className="h-11">
          <Link href="/publier">Publier le premier bien</Link>
        </Button>
        <Button asChild variant="outline" className="h-11">
          <Link href="/apporteurs">Comment gagner une commission</Link>
        </Button>
      </div>
    </section>
  );
}
