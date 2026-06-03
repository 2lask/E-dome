"use client";

import React, { Suspense, useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search as SearchIcon, SearchX } from "lucide-react";
import { useApp } from "@/lib/context";

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

  const results = useMemo(() => (query.trim() ? filterResults(query) : null), [query]);

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

  // Empty state with popular searches
  if (!query.trim()) {
    return (
      <div className="text-center py-16 space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-[var(--card)] text-[var(--text-muted)] flex items-center justify-center">
          <SearchIcon size={32} strokeWidth={1.6} />
        </div>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Rechercher sur E-Dome</h2>
        <p className="text-[var(--text-secondary)] max-w-md mx-auto">
          Tapez un terme dans la barre de recherche pour trouver des biens, formations, utilisateurs ou événements.
        </p>
        <div className="max-w-lg mx-auto">
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
        <div className="text-center py-16 space-y-4">
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
                onClick={() => router.push("/formations")}>
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
                <button className="px-3 py-1.5 rounded-lg border border-[var(--card-border)] text-[var(--foreground)] text-sm hover:bg-[var(--hover-bg)] transition">
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
              <div key={s.id} className="p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] hover:border-[#1e9df1]/40 transition">
                <h3 className="font-medium text-[var(--foreground)]">{s.titre}</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{s.description}</p>
                <p className="text-sm font-bold text-[#1e9df1] mt-2">Des {formatPrice(s.prix)}</p>
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
