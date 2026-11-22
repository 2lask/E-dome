"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Coins, SlidersHorizontal, X, Compass } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ListingCard, TX_LABEL } from "@/components/listing/listing-card";
import { LAUNCH_CITIES, repriseOf, type MyProperty } from "@/lib/my-property";
import type { PropertyType, TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";

/* ── L'Explorer (REBUILD.md §3) ──────────────────────────────────────────────

   Les biens RÉELS, rien d'autre. Recherche plein texte (ville, titre,
   description), type de transaction, type de bien, budget, chambres — et le
   filtre propre à E-Dome : « Avec prime », pour qui veut recommander.
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
  "h-10 rounded-lg border border-input bg-card px-3 pr-8 text-[13.5px] shadow-xs outline-none hover:border-foreground/25 focus:border-leman";

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
  const reset = () => { setQ(""); setTx("all"); setCity(""); setType(""); setMaxPrice(""); setMinRooms(0); setPrimeOnly(false); };

  return (
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-heading text-[30px]">Explorer</h1>
          <p className="mt-1 text-[14px] text-muted-foreground">
            {biens.length === 0
              ? "Les biens proposés directement par leurs propriétaires."
              : `${biens.length} bien${biens.length > 1 ? "s" : ""} proposé${biens.length > 1 ? "s" : ""} directement par leurs propriétaires.`}
          </p>
        </div>
        <Link href="/apporteurs" className="inline-flex items-center gap-1.5 rounded-lg border border-laiton-border bg-laiton-soft px-3 py-2 text-[13px] font-medium text-laiton hover:bg-laiton-soft/70">
          <Coins className="h-4 w-4" aria-hidden /> Recommandez un bien, touchez la commission
        </Link>
      </header>

      {biens.length === 0 ? (
        <EmptyCatalogue />
      ) : (
        <>
          {/* ── Barre de recherche et filtres ──────────────────────────── */}
          <div className="sticky top-0 z-10 -mx-4 mt-6 border-b bg-background/90 px-4 pb-3 pt-3 backdrop-blur-md md:static md:mx-0 md:rounded-2xl md:border md:bg-card md:p-3 md:shadow-xs md:backdrop-blur-none">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  leadingIcon={Search}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Ville, quartier, mot-clé…"
                  aria-label="Rechercher un bien"
                />
              </div>
              <Button
                variant="outline"
                className="md:hidden"
                onClick={() => setFiltersOpen((o) => !o)}
                aria-expanded={filtersOpen}
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden />
                {activeFilters > 0 ? activeFilters : "Filtres"}
              </Button>
            </div>

            {cities.length > 1 && (
              <div className="no-scrollbar -mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1" role="group" aria-label="Villes">
                {["", ...cities].map((c) => (
                  <button
                    key={c || "toutes"}
                    type="button"
                    aria-pressed={city === c}
                    onClick={() => setCity(c)}
                    className={cn(
                      "h-8 shrink-0 rounded-full border px-3 text-[13px]",
                      city === c ? "border-foreground bg-foreground text-background" : "bg-card hover:border-foreground/25",
                    )}
                  >
                    {c || "Toutes les villes"}
                  </button>
                ))}
              </div>
            )}

            <div className={cn("mt-3 flex-wrap items-center gap-2", filtersOpen ? "flex" : "hidden md:flex")}>
              {txAvailable.length > 1 && (
                <div role="radiogroup" aria-label="Type de transaction" className="inline-flex rounded-lg border bg-subtle p-0.5">
                  {(["all", ...txAvailable] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      role="radio"
                      aria-checked={tx === t}
                      onClick={() => setTx(t)}
                      className={cn(
                        "h-8 rounded-md px-3 text-[13px]",
                        tx === t ? "bg-card font-medium shadow-xs" : "text-muted-foreground hover:text-foreground",
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
                  className={cn(selectCls, "w-36 pr-12")}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-muted-foreground">CHF</span>
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
                    "inline-flex h-10 items-center gap-1.5 rounded-lg border px-3 text-[13.5px]",
                    primeOnly ? "border-laiton-border bg-laiton-soft font-medium text-laiton" : "bg-card shadow-xs hover:border-foreground/25",
                  )}
                >
                  <Coins className="h-4 w-4" aria-hidden />
                  Avec commission
                  <span className="tabular-nums text-[12px] opacity-70">{primedCount}</span>
                </button>
              )}

              <select aria-label="Trier" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={cn(selectCls, "md:ml-auto")}>
                <option value="recent">Plus récents</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                {primedCount > 0 && <option value="prime">Commission la plus élevée</option>}
              </select>

              {(activeFilters > 0 || q || tx !== "all" || city) && (
                <button type="button" onClick={reset} className="inline-flex h-10 items-center gap-1 px-2 text-[13px] text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" aria-hidden /> Effacer
                </button>
              )}
            </div>
          </div>

          {/* ── Résultats ──────────────────────────────────────────────── */}
          <p className="mt-6 text-[13px] text-muted-foreground" aria-live="polite">
            {results.length} résultat{results.length > 1 ? "s" : ""}
            {tx !== "all" ? ` · ${KIND_LABEL[tx]}` : ""}
            {city ? ` · ${city}` : ""}
          </p>
          {results.length > 0 ? (
            <div className="mt-3 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p, i) => <ListingCard key={p.id} p={p} priority={i < 3} />)}
            </div>
          ) : (
            <div className="mt-3 rounded-2xl border border-dashed bg-card px-6 py-12 text-center">
              <p className="text-[15px] font-medium">Aucun bien ne correspond</p>
              <p className="mt-1 text-[13.5px] text-muted-foreground">Élargissez votre budget ou retirez un filtre.</p>
              <Button variant="outline" className="mt-4" onClick={reset}>Effacer les filtres</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EmptyCatalogue() {
  return (
    <section className="mt-8 rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-subtle">
        <Compass className="h-6 w-6 text-muted-foreground" aria-hidden />
      </span>
      <h2 className="mt-4 text-[17px] font-semibold">Les premiers biens arrivent</h2>
      <p className="mx-auto mt-1.5 max-w-md text-[14px] leading-relaxed text-muted-foreground">
        E-Dome vient d&apos;ouvrir. Les biens publiés par leurs propriétaires apparaissent ici dès leur mise en ligne —
        sans annonces factices pour faire nombre.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Button asChild>
          <Link href="/publier">Publier le premier bien</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/apporteurs">Comment gagner une commission</Link>
        </Button>
      </div>
    </section>
  );
}
