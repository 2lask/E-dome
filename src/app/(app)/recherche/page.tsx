"use client";

import React, { Suspense, useState, useMemo, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search as SearchIcon, SearchX, X, Clock, SlidersHorizontal } from "lucide-react";
import { useApp } from "@/lib/context";
import { listEvents } from "@/lib/data/events";
import { formations as ALL_FORMATIONS, properties as CATALOGUE } from "@/lib/mock-data";
import { listPeople } from "@/lib/profile-data";
import type { Formation, Property } from "@/lib/types";
import { roleLabel } from "@/lib/model/role-labels";
import { useSession } from "@/lib/use-session";
import { isSessionId } from "@/lib/demo/session-views";
import {
  citiesOf,
  hasFilters,
  nearbyCitiesIn,
  normalize,
  parseQuery,
  queryWithout,
  searchListings,
  suggestionsFor,
} from "@/lib/search/query";
import { estimateYield, pctLabel, priceUnit, roomsLabel, roomsOf } from "@/lib/explore/listing";
import { recherche as R } from "@/content/recherche";

/* Cle localStorage partagee avec le header (composants/layout/header.tsx)
   pour que recherches recentes soient unifiees entre la barre du header
   et celle de /recherche. */
const RECENT_SEARCHES_KEY = "edome_recent_searches";
const MAX_RECENT_SEARCHES = 8;

/* ─── Index de recherche ─────────────────────────────────────────────────────

   Les BIENS passent par la recherche tokenisée (`src/lib/search/query.ts`) :
   « 3 pièces Lausanne moins de 2500 » devient des puces (ville, pièces,
   budget, transaction déduite) que l'on retire une à une. Les biens publiés
   pendant la visite (mémoire de session) s'y ajoutent ; sans coordonnées, ils
   restent dans la liste.

   Les autres catégories (formations, profils, événements, services) gardent
   une recherche plein texte, sur les mots libres et les villes de la requête. */

const LEVEL_LABELS: Record<Formation["level"], string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
};

const OTHER_RESULTS = {
  formations: ALL_FORMATIONS.map((f) => ({
    id: f.id,
    titre: f.title,
    instructeur: `${f.instructor.firstName} ${f.instructor.lastName}`,
    prix: f.price,
    niveau: LEVEL_LABELS[f.level],
  })),
  /* listPeople() ne renvoie que des profils que /profil/[id] sait resoudre —
     garantit qu aucun resultat utilisateur ne mene a « Profil introuvable ». */
  utilisateurs: listPeople().map((u) => ({
    id: u.id,
    nom: `${u.firstName} ${u.lastName}`,
    role: roleLabel(u.roles[0] ?? "particulier", u.trades),
    ville: u.city,
  })),
  evenements: listEvents().map((e) => ({
    id: e.id,
    titre: e.titre,
    date: e.date,
    lieu: e.lieu,
  })),
  services: [
    { id: "S1", titre: "Estimation immobilière", description: "Estimation professionnelle de votre bien", prix: 150 },
    { id: "S2", titre: "Photographie immobilière pro", description: "Séance photo HDR + drone", prix: 450 },
    { id: "S3", titre: "Home staging virtuel", description: "Mise en scène 3D de votre bien", prix: 299 },
    { id: "S4", titre: "Accompagnement juridique", description: "Conseil juridique pour transactions", prix: 200 },
  ],
};

/* ─── Category tabs ─────────────────────────────────────────────────────── */

type CategoryKey = "tous" | "biens" | "profils" | "formations" | "evenements" | "services";

const CATEGORY_TABS: { key: CategoryKey; label: string }[] = [
  { key: "tous", label: "Tous" },
  { key: "biens", label: "Biens" },
  { key: "profils", label: "Profils" },
  { key: "formations", label: "Formations" },
  { key: "evenements", label: "Événements" },
  { key: "services", label: "Services" },
];

/* ─── Search logic (catégories hors biens) ────────────────────────────────── */

function filterOthers(terms: string[]) {
  const ts = terms.map(normalize).filter((t) => t.length >= 3);
  const hit = (...fields: string[]) => ts.length > 0 && ts.some((t) => fields.some((f) => normalize(f).includes(t)));
  return {
    formations: OTHER_RESULTS.formations.filter((f) => hit(f.titre, f.instructeur)),
    utilisateurs: OTHER_RESULTS.utilisateurs.filter((u) => hit(u.nom, u.role, u.ville)),
    evenements: OTHER_RESULTS.evenements.filter((e) => hit(e.titre, e.lieu)),
    services: OTHER_RESULTS.services.filter((s) => hit(s.titre, s.description)),
  };
}

/* ─── Inner component using useSearchParams ──────────────────────────────── */

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { formatPrice } = useApp();
  const query = searchParams.get("q") || "";
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("tous");

  /* Le catalogue + les biens publiés pendant la session. */
  const { listings: sessionListings } = useSession();
  const pool = useMemo<Property[]>(() => [...sessionListings, ...CATALOGUE], [sessionListings]);
  const cities = useMemo(() => citiesOf(pool), [pool]);
  const nearby = useMemo(() => nearbyCitiesIn(CATALOGUE), []);

  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState(query);
  const [autoOpen, setAutoOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {
      /* JSON corrompu → ignore */
    }
  }, [query]);

  /* Ajoute une entree aux recherches recentes (deduplique + cap a MAX). */
  const pushRecent = useCallback((term: string) => {
    const clean = term.trim();
    if (!clean) return;
    setRecentSearches((prev) => {
      const next = [clean, ...prev.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, MAX_RECENT_SEARCHES);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
      } catch {
        /* quota plein → silencieux */
      }
      return next;
    });
  }, []);

  const removeRecent = useCallback((term: string) => {
    setRecentSearches((prev) => {
      const next = prev.filter((s) => s !== term);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const clearAllRecent = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {}
  }, []);

  const goTo = useCallback(
    (term: string) => {
      const clean = term.trim();
      router.push(clean ? `/recherche?q=${encodeURIComponent(clean)}` : "/recherche");
    },
    [router],
  );

  const submitSearch = useCallback(
    (term: string) => {
      const clean = term.trim();
      if (!clean) return;
      pushRecent(clean);
      goTo(clean);
      setAutoOpen(false);
      inputRef.current?.blur();
    },
    [pushRecent, goTo],
  );

  /* Suggestions d'autocomplete : top 3 biens / 2 formations / 2 profils. */
  const autocompleteResults = useMemo(() => {
    const q = normalize(inputValue);
    if (q.length < 2) return null;
    return {
      biens: pool
        .filter((b) => !b.soldTo && (normalize(b.title).includes(q) || normalize(b.location.city).includes(q)))
        .slice(0, 3),
      formations: OTHER_RESULTS.formations.filter((f) => normalize(f.titre).includes(q)).slice(0, 2),
      utilisateurs: OTHER_RESULTS.utilisateurs.filter((u) => normalize(u.nom).includes(q)).slice(0, 2),
    };
  }, [inputValue, pool]);

  const showAutocomplete =
    autoOpen &&
    autocompleteResults &&
    autocompleteResults.biens.length + autocompleteResults.formations.length + autocompleteResults.utilisateurs.length > 0;

  /* La requête comprise : puces + mots libres. */
  const parsed = useMemo(() => parseQuery(query, cities), [query, cities]);

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const biens = searchListings(pool, parsed);
    const terms = hasFilters(parsed.filters) ? [...parsed.free, ...parsed.filters.cities] : [query, ...parsed.free];
    return { biens, ...filterOthers(terms) };
  }, [query, parsed, pool]);

  /* Arrivée avec une requête (lien externe, #hashtag du fil) : on l'enregistre. */
  useEffect(() => {
    if (query.trim()) pushRecent(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const counts = useMemo(() => {
    if (!results) return { biens: 0, profils: 0, formations: 0, evenements: 0, services: 0, tous: 0 };
    const c = {
      biens: results.biens.length,
      profils: results.utilisateurs.length,
      formations: results.formations.length,
      evenements: results.evenements.length,
      services: results.services.length,
      tous: 0,
    };
    c.tous = c.biens + c.profils + c.formations + c.evenements + c.services;
    return c;
  }, [results]);

  const suggestions = useMemo(
    () => (results && results.biens.length === 0 && parsed.tokens.length > 0 ? suggestionsFor(pool, parsed, cities, nearby) : []),
    [results, parsed, pool, cities, nearby],
  );

  const searchBar = (
    <div className="relative max-w-2xl mx-auto" data-search-input>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitSearch(inputValue);
        }}
      >
        <div className="relative">
          <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setAutoOpen(true)}
            onBlur={() => setTimeout(() => setAutoOpen(false), 150)}
            placeholder={R.placeholder}
            aria-label={R.title}
            data-testid="search-input"
            className="w-full pl-12 pr-10 py-3 rounded-xl bg-[var(--card)] border border-[var(--card-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => {
                setInputValue("");
                inputRef.current?.focus();
              }}
              aria-label="Effacer"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full text-[var(--text-muted)] hover:bg-[var(--hover-bg)]"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </form>

      {showAutocomplete && (
        <div
          className="absolute left-0 right-0 top-full mt-2 rounded-xl border shadow-lg overflow-hidden z-30 animate-fade-in"
          style={{ background: "var(--card)", borderColor: "var(--card-border)", boxShadow: "var(--shadow-card)" }}
        >
          <div className="max-h-[60vh] overflow-y-auto">
            {autocompleteResults!.biens.length > 0 && (
              <div className="py-1">
                <p className="px-3 py-1 text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Biens</p>
                {autocompleteResults!.biens.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onMouseDown={() => router.push(`/explorer/${b.id}`)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--hover-bg)] transition-colors flex items-center justify-between"
                  >
                    <span className="truncate">{b.title}</span>
                    <span className="text-xs text-[var(--text-muted)] shrink-0 ml-2">{b.location.city}</span>
                  </button>
                ))}
              </div>
            )}
            {autocompleteResults!.formations.length > 0 && (
              <div className="py-1 border-t" style={{ borderColor: "var(--card-border)" }}>
                <p className="px-3 py-1 text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Formations</p>
                {autocompleteResults!.formations.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onMouseDown={() => router.push(`/formations/${f.id}`)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--hover-bg)] transition-colors"
                  >
                    {f.titre}
                    <span className="text-xs text-[var(--text-muted)] ml-2">— {f.instructeur}</span>
                  </button>
                ))}
              </div>
            )}
            {autocompleteResults!.utilisateurs.length > 0 && (
              <div className="py-1 border-t" style={{ borderColor: "var(--card-border)" }}>
                <p className="px-3 py-1 text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Profils</p>
                {autocompleteResults!.utilisateurs.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onMouseDown={() => router.push(`/profil/${u.id}`)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--hover-bg)] transition-colors"
                  >
                    {u.nom}
                    <span className="text-xs text-[var(--text-muted)] ml-2">— {u.role}, {u.ville}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const examples = (
    <div className="max-w-lg mx-auto text-center">
      <h3 className="text-sm font-semibold text-[var(--text-muted)] mb-3">{R.examplesTitle}</h3>
      <div className="flex flex-wrap justify-center gap-2">
        {R.examples.map((term) => (
          <button
            key={term}
            onClick={() => submitSearch(term)}
            className="px-4 py-2 rounded-full bg-[var(--card)] border border-[var(--card-border)] text-sm text-[var(--text-secondary)] hover:border-[var(--primary)]/40 hover:text-[var(--primary)] transition-colors cursor-pointer"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );

  /* Les puces : chaque filtre compris, retirable. La transaction déduite du
     budget s'affiche aussi, sans croix : elle tombe avec le budget. */
  const chips = parsed.tokens.length > 0 && (
    <div className="space-y-1.5" data-testid="search-chips">
      <p className="text-xs font-medium text-[var(--text-muted)] inline-flex items-center gap-1.5">
        <SlidersHorizontal size={12} /> {R.filtersTitle}
      </p>
      <div className="flex flex-wrap gap-2">
        {parsed.tokens.map((t) => {
          const label = R.chip(t);
          return (
            <span
              key={t.id}
              data-testid="search-chip"
              data-kind={t.kind}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--primary)]/40 bg-[var(--primary)]/10 pl-3 pr-1 py-1 text-sm text-[var(--foreground)]"
            >
              {label}
              <button
                type="button"
                onClick={() => goTo(queryWithout(parsed, t.id))}
                aria-label={R.removeChip(label)}
                className="flex h-6 w-6 items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--foreground)]"
              >
                <X size={12} />
              </button>
            </span>
          );
        })}
        {parsed.filters.transactionInferred && parsed.filters.transaction && (
          <span
            data-testid="search-chip"
            data-kind="transaction-inferred"
            title={R.inferredHint}
            className="inline-flex items-center gap-1 rounded-full border border-dashed border-[var(--card-border)] px-3 py-1 text-sm text-[var(--text-secondary)]"
          >
            {R.transactionLabel(parsed.filters.transaction)}
            <span className="text-[11px] text-[var(--text-muted)]">· {R.inferredHint.toLowerCase()}</span>
          </span>
        )}
      </div>
      {parsed.free.length > 0 && hasFilters(parsed.filters) && (
        <p className="text-[11px] text-[var(--text-muted)]">{R.ignored(parsed.free.join(", "))}</p>
      )}
    </div>
  );

  // Empty state with examples + recent searches
  if (!query.trim()) {
    return (
      <div className="space-y-8">
        {searchBar}
        <div className="text-center py-8 space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-[var(--card)] text-[var(--text-muted)] flex items-center justify-center">
            <SearchIcon size={32} strokeWidth={1.6} />
          </div>
          <h2 className="text-xl font-semibold text-[var(--foreground)]">{R.emptyTitle}</h2>
          <p className="text-[var(--text-secondary)] max-w-md mx-auto">{R.emptyText}</p>
        </div>

        {recentSearches.length > 0 && (
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[var(--text-muted)] inline-flex items-center gap-1.5">
                <Clock size={13} />
                {R.recentTitle}
              </h3>
              <button onClick={clearAllRecent} className="text-xs text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors">
                {R.clearRecent}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term) => (
                <span
                  key={term}
                  className="inline-flex items-center gap-1 rounded-full bg-[var(--card)] border border-[var(--card-border)] hover:border-[var(--primary)]/40 transition-colors"
                >
                  <button onClick={() => submitSearch(term)} className="px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)]">
                    {term}
                  </button>
                  <button
                    onClick={() => removeRecent(term)}
                    aria-label={`Retirer ${term} des recherches récentes`}
                    className="pr-2 pl-0.5 text-[var(--text-muted)] hover:text-[var(--foreground)]"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {examples}
      </div>
    );
  }

  // No results
  if (counts.tous === 0) {
    return (
      <div className="space-y-6">
        {searchBar}
        {chips}
        <div className="text-center py-6 space-y-3" data-testid="search-empty">
          <div className="w-20 h-20 mx-auto rounded-full bg-[var(--card)] text-[var(--text-muted)] flex items-center justify-center">
            <SearchX size={32} strokeWidth={1.6} />
          </div>
          <h2 className="text-xl font-semibold text-[var(--foreground)]">{R.noResultTitle}</h2>
          {suggestions.length > 0 ? (
            <>
              <p className="text-[var(--text-secondary)]">{R.noResultText(query)}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s.query}
                    data-testid="search-suggestion"
                    onClick={() => submitSearch(s.query)}
                    className="px-4 py-2 rounded-full border border-[var(--primary)]/40 bg-[var(--card)] text-sm text-[var(--foreground)] hover:bg-[var(--primary)]/10 transition-colors"
                  >
                    {s.removed ? R.suggestionRemove(R.chip(s.removed), s.count) : R.suggestionCity(s.city ?? "", s.count)}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="text-[var(--text-secondary)]">{R.noResultOther}</p>
          )}
        </div>
        {examples}
      </div>
    );
  }

  const showBiens = (activeCategory === "tous" || activeCategory === "biens") && results!.biens.length > 0;
  const showFormations = (activeCategory === "tous" || activeCategory === "formations") && results!.formations.length > 0;
  const showProfils = (activeCategory === "tous" || activeCategory === "profils") && results!.utilisateurs.length > 0;
  const showEvenements = (activeCategory === "tous" || activeCategory === "evenements") && results!.evenements.length > 0;
  const showServices = (activeCategory === "tous" || activeCategory === "services") && results!.services.length > 0;

  return (
    <div className="space-y-6">
      {searchBar}
      {chips}
      <p className="text-[var(--text-secondary)]" data-testid="search-count">
        {R.results(counts.tous, query)}
      </p>

      {/* Category tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-[var(--card)] border border-[var(--card-border)] overflow-x-auto no-scrollbar">
        {CATEGORY_TABS.map((tab) => {
          const count = counts[tab.key];
          return (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeCategory === tab.key ? "bg-[var(--primary)] text-white" : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className={`ml-1.5 text-xs ${activeCategory === tab.key ? "text-white/80" : "text-[var(--text-muted)]"}`}>({count})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Biens */}
      {showBiens && (
        <section className="space-y-3 animate-fade-in">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              {R.sectionBiens} <span className="text-sm text-[var(--text-muted)] font-normal">({results!.biens.length})</span>
            </h2>
            <Link href="/explorer" className="text-xs text-[var(--primary)] hover:underline">
              {R.seeOnExplorer}
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-3" data-testid="search-results-biens">
            {results!.biens.map((b) => {
              const y = estimateYield(b, CATALOGUE);
              return (
                <Link
                  key={b.id}
                  href={`/explorer/${b.id}`}
                  data-testid="search-result-bien"
                  data-transaction={b.transactionType}
                  className="flex gap-3 p-3 rounded-xl bg-[var(--card)] border border-[var(--card-border)] hover:border-[var(--primary)]/40 transition"
                >
                  <img src={b.images[0]} alt="" className="h-20 w-24 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-[var(--foreground)] text-sm leading-snug line-clamp-2">{b.title}</h3>
                    <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                      {b.location.city} · {roomsLabel(roomsOf(b))} · {b.area} m²
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span className="text-sm font-bold text-[var(--primary)]">
                        {formatPrice(b.price, b.currency)}
                        <span className="text-xs font-normal text-[var(--text-muted)]">{priceUnit(b.transactionType)}</span>
                      </span>
                      {y && (
                        <span className="rounded-full bg-[var(--hover-bg)] px-2 py-0.5 text-[10.5px] text-[var(--text-secondary)]">{R.yieldBadge(pctLabel(y.pct))}</span>
                      )}
                      {isSessionId(b.id) && (
                        <span className="rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-[10.5px] text-[var(--primary)]">{R.sessionBadge}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Formations */}
      {showFormations && (
        <section className="space-y-3 animate-fade-in">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Formations <span className="text-sm text-[var(--text-muted)] font-normal">({results!.formations.length})</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {results!.formations.map((f) => (
              <Link
                key={f.id}
                href={`/formations/${f.id}`}
                className="block p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] hover:border-[var(--primary)]/40 transition"
              >
                <h3 className="font-medium text-[var(--foreground)]">{f.titre}</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{f.instructeur} — {f.niveau}</p>
                <p className="text-sm font-bold text-[var(--primary)] mt-1">{formatPrice(f.prix)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Profils */}
      {showProfils && (
        <section className="space-y-3 animate-fade-in">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Profils <span className="text-sm text-[var(--text-muted)] font-normal">({results!.utilisateurs.length})</span>
          </h2>
          <div className="space-y-2">
            {results!.utilisateurs.map((u) => (
              <Link
                key={u.id}
                href={`/profil/${u.id}`}
                className="p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] flex items-center justify-between hover:bg-[var(--hover-bg)] transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] font-bold text-sm">
                    {u.nom.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-[var(--foreground)] font-medium">{u.nom}</p>
                    <p className="text-xs text-[var(--text-muted)]">{u.role} — {u.ville}</p>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-lg border border-[var(--card-border)] text-[var(--foreground)] text-sm">Voir le profil</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Evenements */}
      {showEvenements && (
        <section className="space-y-3 animate-fade-in">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Événements <span className="text-sm text-[var(--text-muted)] font-normal">({results!.evenements.length})</span>
          </h2>
          <div className="space-y-2">
            {results!.evenements.map((e) => (
              <Link
                key={e.id}
                href={`/evenements/${e.id}`}
                className="block p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] hover:border-[var(--primary)]/40 transition"
              >
                <h3 className="font-medium text-[var(--foreground)]">{e.titre}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-[var(--text-secondary)]">
                  <span>{e.date}</span>
                  <span>{e.lieu}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Services */}
      {showServices && (
        <section className="space-y-3 animate-fade-in">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Services <span className="text-sm text-[var(--text-muted)] font-normal">({results!.services.length})</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {results!.services.map((s) => (
              <Link
                key={s.id}
                href="/services"
                className="block p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] hover:border-[var(--primary)]/40 transition"
              >
                <h3 className="font-medium text-[var(--foreground)]">{s.titre}</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{s.description}</p>
                <p className="text-sm font-bold text-[var(--primary)] mt-2">Dès {formatPrice(s.prix)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ─── Page (with Suspense boundary) ──────────────────────────────────────── */

export default function RecherchePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl page-heading text-[var(--foreground)] mb-8">{R.title}</h1>
      <Suspense
        fallback={
          <div className="text-center py-16">
            <p className="text-[var(--text-muted)]">Chargement...</p>
          </div>
        }
      >
        <SearchResults />
      </Suspense>
    </div>
  );
}
