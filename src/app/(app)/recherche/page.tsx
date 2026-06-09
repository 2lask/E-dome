"use client";

import React, { Suspense, useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search as SearchIcon, SearchX, X, Clock } from "lucide-react";
import { useApp } from "@/lib/context";

/* Cle localStorage partagee avec le header (composants/layout/header.tsx)
   pour que recherches recentes soient unifiees entre la barre du header
   et celle de /recherche. */
const RECENT_SEARCHES_KEY = "edome_recent_searches";
const MAX_RECENT_SEARCHES = 8;

/* ─── Mock Data ──────────────────────────────────────────────────────────── */

const ALL_RESULTS = {
  biens: [
    { id: "B1", titre: "Appartement 3p Lausanne", prix: 450000, type: "Appartement", ville: "Lausanne", pays: "Suisse" },
    { id: "B2", titre: "Villa Montreux vue lac", prix: 1250000, type: "Villa", ville: "Montreux", pays: "Suisse" },
    { id: "B3", titre: "Studio Genève centre", prix: 285000, type: "Studio", ville: "Genève", pays: "Suisse" },
    { id: "B4", titre: "Chalet Verbier luxe", prix: 890000, type: "Chalet", ville: "Verbier", pays: "Suisse" },
    { id: "B5", titre: "Penthouse Zurich", prix: 2100000, type: "Penthouse", ville: "Zurich", pays: "Suisse" },
    { id: "B6", titre: "Loft Berne centre", prix: 520000, type: "Loft", ville: "Berne", pays: "Suisse" },
    { id: "B7", titre: "Maison Neuchatel", prix: 680000, type: "Maison", ville: "Neuchatel", pays: "Suisse" },
    { id: "B8", titre: "Riad Marrakech", prix: 380000, type: "Riad", ville: "Marrakech", pays: "Maroc" },
  ],
  formations: [
    { id: "F1", titre: "Investir dans l'immobilier", instructeur: "Marc Bonnard", prix: 299, niveau: "Débutant" },
    { id: "F2", titre: "Photographie immobilière", instructeur: "Amina Koné", prix: 199, niveau: "Intermédiaire" },
    { id: "F3", titre: "Droit du bail suisse", instructeur: "Thomas Roth", prix: 349, niveau: "Avancé" },
    { id: "F4", titre: "Home staging efficace", instructeur: "Laura Fischer", prix: 149, niveau: "Débutant" },
  ],
  utilisateurs: [
    { id: "U1", nom: "Marie Dupont", role: "Hote", ville: "Lausanne" },
    { id: "U2", nom: "Jean Martin", role: "Client", ville: "Genève" },
    { id: "U3", nom: "Sophie Meier", role: "Agence", ville: "Zurich" },
    { id: "U4", nom: "Leo Martin", role: "Apporteur", ville: "Montreux" },
    { id: "U5", nom: "Laura Fischer", role: "Investisseur", ville: "Berne" },
  ],
  evenements: [
    { id: "E1", titre: "Salon de l'immobilier Genève", date: "2026-05-15", lieu: "Palexpo, Genève" },
    { id: "E2", titre: "Workshop investissement Lausanne", date: "2026-04-20", lieu: "SwissTech, Lausanne" },
    { id: "E3", titre: "Conference PropTech Zurich", date: "2026-06-10", lieu: "Zurich Convention Center" },
  ],
  services: [
    { id: "S1", titre: "Estimation immobilière", description: "Estimation professionnelle de votre bien", prix: 150 },
    { id: "S2", titre: "Photographie immobilière pro", description: "Séance photo HDR + drone", prix: 450 },
    { id: "S3", titre: "Home staging virtuel", description: "Mise en scene 3D de votre bien", prix: 299 },
    { id: "S4", titre: "Accompagnement juridique", description: "Conseil juridique pour transactions", prix: 200 },
  ],
};

const POPULAR_SEARCHES = [
  "Villa Lausanne",
  "Appartement Genève",
  "Chalet Verbier",
  "Investissement immobilier",
  "Location courte durée",
  "Marrakech",
  "Studio Zurich",
  "Penthouse",
];

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

/* ─── Search logic ───────────────────────────────────────────────────────── */

function filterResults(query: string) {
  const q = query.toLowerCase();
  return {
    biens: ALL_RESULTS.biens.filter(
      (b) =>
        b.titre.toLowerCase().includes(q) ||
        b.ville.toLowerCase().includes(q) ||
        b.pays.toLowerCase().includes(q) ||
        b.type.toLowerCase().includes(q)
    ),
    formations: ALL_RESULTS.formations.filter(
      (f) => f.titre.toLowerCase().includes(q) || f.instructeur.toLowerCase().includes(q)
    ),
    utilisateurs: ALL_RESULTS.utilisateurs.filter(
      (u) =>
        u.nom.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.ville.toLowerCase().includes(q)
    ),
    evenements: ALL_RESULTS.evenements.filter(
      (e) => e.titre.toLowerCase().includes(q) || e.lieu.toLowerCase().includes(q)
    ),
    services: ALL_RESULTS.services.filter(
      (s) => s.titre.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    ),
  };
}

/* ─── Inner component using useSearchParams ──────────────────────────────── */

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { formatPrice } = useApp();
  const query = searchParams.get("q") || "";
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("tous");

  /* Recherches recentes — partage la cle localStorage avec le header
     pour une experience unifiee : ce qu'on tape dans la barre du header
     apparait dans 'Recherches recentes' ici, et vice versa. */
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

  const submitSearch = useCallback(
    (term: string) => {
      const clean = term.trim();
      if (!clean) return;
      pushRecent(clean);
      router.push(`/recherche?q=${encodeURIComponent(clean)}`);
      setAutoOpen(false);
      inputRef.current?.blur();
    },
    [pushRecent, router]
  );

  /* Suggestions d'autocomplete : top 3 biens / 2 formations / 2 profils /
     2 services matchant le prefixe en cours, regroupes par categorie.
     Visible quand l'input est focus + a >= 2 caracteres. */
  const autocompleteResults = useMemo(() => {
    const q = inputValue.trim().toLowerCase();
    if (q.length < 2) return null;
    return {
      biens: ALL_RESULTS.biens
        .filter((b) => b.titre.toLowerCase().includes(q) || b.ville.toLowerCase().includes(q))
        .slice(0, 3),
      formations: ALL_RESULTS.formations
        .filter((f) => f.titre.toLowerCase().includes(q))
        .slice(0, 2),
      utilisateurs: ALL_RESULTS.utilisateurs
        .filter((u) => u.nom.toLowerCase().includes(q))
        .slice(0, 2),
      services: ALL_RESULTS.services
        .filter((s) => s.titre.toLowerCase().includes(q))
        .slice(0, 2),
    };
  }, [inputValue]);

  const showAutocomplete =
    autoOpen &&
    autocompleteResults &&
    (autocompleteResults.biens.length +
      autocompleteResults.formations.length +
      autocompleteResults.utilisateurs.length +
      autocompleteResults.services.length) > 0;

  const results = useMemo(() => (query.trim() ? filterResults(query) : null), [query]);

  /* Quand /recherche est ouvert avec une query non vide, on enregistre
     automatiquement dans les recents (cas : arrive depuis un lien
     external comme #hashtag du feed). */
  useEffect(() => {
    if (query.trim()) pushRecent(query);
    // pushRecent stable via useCallback
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

  const handlePopularSearch = useCallback(
    (term: string) => {
      router.push(`/recherche?q=${encodeURIComponent(term)}`);
    },
    [router]
  );

  /* Barre de recherche inline + dropdown autocomplete. Affichee aussi
     bien dans l'etat vide (pas de query) qu'avec resultats. */
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
            placeholder="Rechercher un bien, une formation, un profil..."
            className="w-full pl-12 pr-10 py-3 rounded-xl bg-[var(--card)] border border-[var(--card-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#1e9df1]/50 transition-colors"
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

      {/* Dropdown autocomplete */}
      {showAutocomplete && (
        <div
          className="absolute left-0 right-0 top-full mt-2 rounded-xl border shadow-lg overflow-hidden z-30 animate-fade-in"
          style={{
            background: "var(--card)",
            borderColor: "var(--card-border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="max-h-[60vh] overflow-y-auto">
            {autocompleteResults!.biens.length > 0 && (
              <div className="py-1">
                <p className="px-3 py-1 text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Biens</p>
                {autocompleteResults!.biens.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onMouseDown={() => submitSearch(b.titre)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--hover-bg)] transition-colors flex items-center justify-between"
                  >
                    <span className="truncate">{b.titre}</span>
                    <span className="text-xs text-[var(--text-muted)] shrink-0 ml-2">{b.ville}</span>
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
                    onMouseDown={() => submitSearch(f.titre)}
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
            {autocompleteResults!.services.length > 0 && (
              <div className="py-1 border-t" style={{ borderColor: "var(--card-border)" }}>
                <p className="px-3 py-1 text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Services</p>
                {autocompleteResults!.services.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onMouseDown={() => submitSearch(s.titre)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--hover-bg)] transition-colors"
                  >
                    {s.titre}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Empty state with popular + recent searches
  if (!query.trim()) {
    return (
      <div className="space-y-8">
        {searchBar}
        <div className="text-center py-8 space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-[var(--card)] text-[var(--text-muted)] flex items-center justify-center">
            <SearchIcon size={32} strokeWidth={1.6} />
          </div>
          <h2 className="text-xl font-semibold text-[var(--foreground)]">Rechercher sur E-Dome</h2>
          <p className="text-[var(--text-secondary)] max-w-md mx-auto">
            Tapez un terme dans la barre de recherche pour trouver des biens, formations, utilisateurs ou événements.
          </p>
        </div>

        {/* Recherches recentes (localStorage) */}
        {recentSearches.length > 0 && (
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[var(--text-muted)] inline-flex items-center gap-1.5">
                <Clock size={13} />
                Recherches récentes
              </h3>
              <button
                onClick={clearAllRecent}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
              >
                Tout effacer
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term) => (
                <span
                  key={term}
                  className="inline-flex items-center gap-1 rounded-full bg-[var(--card)] border border-[var(--card-border)] hover:border-[#1e9df1]/40 transition-colors"
                >
                  <button
                    onClick={() => submitSearch(term)}
                    className="px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[#1e9df1]"
                  >
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

        {/* Recherches populaires (statique) */}
        <div className="max-w-lg mx-auto text-center">
          <h3 className="text-sm font-semibold text-[var(--text-muted)] mb-3">Recherches populaires</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => handlePopularSearch(term)}
                className="px-4 py-2 rounded-full bg-[var(--card)] border border-[var(--card-border)] text-sm text-[var(--text-secondary)] hover:border-[#1e9df1]/40 hover:text-[#1e9df1] transition-colors cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // No results
  if (counts.tous === 0) {
    return (
      <div className="space-y-8">
        {searchBar}
        <div className="text-center py-8 space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-[var(--card)] text-[var(--text-muted)] flex items-center justify-center">
            <SearchX size={32} strokeWidth={1.6} />
          </div>
          <h2 className="text-xl font-semibold text-[var(--foreground)]">Aucun résultat</h2>
          <p className="text-[var(--text-secondary)]">
            Aucun résultat pour &laquo;{query}&raquo;. Essayez avec d&apos;autres termes.
          </p>
        </div>
        <div className="max-w-lg mx-auto text-center">
          <h3 className="text-sm font-semibold text-[var(--text-muted)] mb-3">Recherches populaires</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => handlePopularSearch(term)}
                className="px-4 py-2 rounded-full bg-[var(--card)] border border-[var(--card-border)] text-sm text-[var(--text-secondary)] hover:border-[#1e9df1]/40 hover:text-[#1e9df1] transition-colors cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
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
      <p className="text-[var(--text-secondary)]">
        {counts.tous} résultat{counts.tous > 1 ? "s" : ""} pour &laquo;<span className="text-[var(--foreground)] font-medium">{query}</span>&raquo;
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
                activeCategory === tab.key
                  ? "bg-[#1e9df1] text-white"
                  : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className={`ml-1.5 text-xs ${activeCategory === tab.key ? "text-white/80" : "text-[var(--text-muted)]"}`}>
                  ({count})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Biens */}
      {showBiens && (
        <section className="space-y-3 animate-fade-in">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Biens immobiliers <span className="text-sm text-[var(--text-muted)] font-normal">({results!.biens.length})</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {results!.biens.map((b) => (
              <div key={b.id} className="p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] hover:border-[#1e9df1]/40 transition cursor-pointer"
                onClick={() => router.push(`/explorer/${b.id}`)}>
                <h3 className="font-medium text-[var(--foreground)]">{b.titre}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-[var(--text-secondary)]">{b.type} — {b.ville}, {b.pays}</span>
                  <span className="text-sm font-bold text-[#1e9df1]">{formatPrice(b.prix)}</span>
                </div>
              </div>
            ))}
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
              <div key={f.id} className="p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] hover:border-[#1e9df1]/40 transition cursor-pointer"
                onClick={() => router.push(`/formations/${f.id}`)}>
                <h3 className="font-medium text-[var(--foreground)]">{f.titre}</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{f.instructeur} — {f.niveau}</p>
                <p className="text-sm font-bold text-[#1e9df1] mt-1">{formatPrice(f.prix)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Profils (Utilisateurs) */}
      {showProfils && (
        <section className="space-y-3 animate-fade-in">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Profils <span className="text-sm text-[var(--text-muted)] font-normal">({results!.utilisateurs.length})</span>
          </h2>
          <div className="space-y-2">
            {results!.utilisateurs.map((u) => (
              <div key={u.id} className="p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] flex items-center justify-between hover:bg-[var(--hover-bg)] transition cursor-pointer"
                onClick={() => router.push(`/profil/${u.id}`)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1e9df1]/20 flex items-center justify-center text-[#1e9df1] font-bold text-sm">
                    {u.nom.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-[var(--foreground)] font-medium">{u.nom}</p>
                    <p className="text-xs text-[var(--text-muted)]">{u.role} — {u.ville}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/profil/${u.id}`);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-[var(--card-border)] text-[var(--foreground)] text-sm hover:bg-[var(--hover-bg)] transition"
                >
                  Voir le profil
                </button>
              </div>
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
              <div key={e.id} className="p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] hover:border-[#1e9df1]/40 transition cursor-pointer"
                onClick={() => router.push(`/evenements/${e.id}`)}>
                <h3 className="font-medium text-[var(--foreground)]">{e.titre}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-[var(--text-secondary)]">
                  <span>{e.date}</span>
                  <span>{e.lieu}</span>
                </div>
              </div>
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
              <div
                key={s.id}
                onClick={() => router.push("/services")}
                className="p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] hover:border-[#1e9df1]/40 transition cursor-pointer"
              >
                <h3 className="font-medium text-[var(--foreground)]">{s.titre}</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{s.description}</p>
                <p className="text-sm font-bold text-[#1e9df1] mt-2">Dès {formatPrice(s.prix)}</p>
              </div>
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
      <h1 className="text-3xl page-heading text-[var(--foreground)] mb-8">Recherche</h1>
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
