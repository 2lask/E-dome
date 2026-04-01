"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/lib/context";

/* ─── Mock Data ──────────────────────────────────────────────────────────── */

const ALL_RESULTS = {
  biens: [
    { id: "B1", titre: "Appartement 3p Lausanne", prix: 450000, type: "Appartement", ville: "Lausanne" },
    { id: "B2", titre: "Villa Montreux vue lac", prix: 1250000, type: "Villa", ville: "Montreux" },
    { id: "B3", titre: "Studio Geneve centre", prix: 285000, type: "Studio", ville: "Geneve" },
    { id: "B4", titre: "Chalet Verbier luxe", prix: 890000, type: "Chalet", ville: "Verbier" },
    { id: "B5", titre: "Penthouse Zurich", prix: 2100000, type: "Penthouse", ville: "Zurich" },
    { id: "B6", titre: "Loft Berne centre", prix: 520000, type: "Loft", ville: "Berne" },
    { id: "B7", titre: "Maison Neuchatel", prix: 680000, type: "Maison", ville: "Neuchatel" },
  ],
  formations: [
    { id: "F1", titre: "Investir dans l'immobilier", instructeur: "Marc Bonnard", prix: 299, niveau: "Débutant" },
    { id: "F2", titre: "Photographie immobilière", instructeur: "Amina Kone", prix: 199, niveau: "Intermédiaire" },
    { id: "F3", titre: "Droit du bail suisse", instructeur: "Thomas Roth", prix: 349, niveau: "Avancé" },
    { id: "F4", titre: "Home staging efficace", instructeur: "Laura Fischer", prix: 149, niveau: "Débutant" },
  ],
  utilisateurs: [
    { id: "U1", nom: "Marie Dupont", role: "Hote", ville: "Lausanne" },
    { id: "U2", nom: "Jean Martin", role: "Client", ville: "Geneve" },
    { id: "U3", nom: "Sophie Meier", role: "Agence", ville: "Zurich" },
    { id: "U4", nom: "Léo Martin", role: "Apporteur", ville: "Montreux" },
    { id: "U5", nom: "Laura Fischer", role: "Investisseur", ville: "Berne" },
  ],
  evenements: [
    { id: "E1", titre: "Salon de l'immobilier Geneve", date: "2026-05-15", lieu: "Palexpo, Geneve" },
    { id: "E2", titre: "Workshop investissement Lausanne", date: "2026-04-20", lieu: "SwissTech, Lausanne" },
    { id: "E3", titre: "Conférence PropTech Zurich", date: "2026-06-10", lieu: "Zurich Convention Center" },
  ],
};

/* ─── Search logic ───────────────────────────────────────────────────────── */

function filterResults(query: string) {
  const q = query.toLowerCase();
  return {
    biens: ALL_RESULTS.biens.filter((b) => b.titre.toLowerCase().includes(q) || b.ville.toLowerCase().includes(q) || b.type.toLowerCase().includes(q)),
    formations: ALL_RESULTS.formations.filter((f) => f.titre.toLowerCase().includes(q) || f.instructeur.toLowerCase().includes(q)),
    utilisateurs: ALL_RESULTS.utilisateurs.filter((u) => u.nom.toLowerCase().includes(q) || u.role.toLowerCase().includes(q) || u.ville.toLowerCase().includes(q)),
    evenements: ALL_RESULTS.evenements.filter((e) => e.titre.toLowerCase().includes(q) || e.lieu.toLowerCase().includes(q)),
  };
}

/* ─── Inner component using useSearchParams ──────────────────────────────── */

function SearchResults() {
  const searchParams = useSearchParams();
  const { formatPrice } = useApp();
  const query = searchParams.get("q") || "";

  if (!query.trim()) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="text-6xl">🔍</div>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Rechercher sur E-Dome</h2>
        <p className="text-[var(--text-secondary)] max-w-md mx-auto">
          Tapez un terme dans la barre de recherche pour trouver des biens, formations, utilisateurs ou événements.
        </p>
      </div>
    );
  }

  const results = filterResults(query);
  const totalCount = results.biens.length + results.formations.length + results.utilisateurs.length + results.evenements.length;

  if (totalCount === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="text-6xl">😕</div>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Aucun resultat</h2>
        <p className="text-[var(--text-secondary)]">
          Aucun resultat pour &laquo;{query}&raquo;. Essayez avec d&apos;autres termes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <p className="text-[var(--text-secondary)]">
        {totalCount} resultat{totalCount > 1 ? "s" : ""} pour &laquo;<span className="text-[var(--foreground)] font-medium">{query}</span>&raquo;
      </p>

      {/* Biens */}
      {results.biens.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Biens immobiliers <span className="text-sm text-[var(--text-muted)] font-normal">({results.biens.length})</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {results.biens.map((b) => (
              <div key={b.id} className="p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] hover:border-[#C4956A]/40 transition">
                <h3 className="font-medium text-[var(--foreground)]">{b.titre}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-[var(--text-secondary)]">{b.type} — {b.ville}</span>
                  <span className="text-sm font-bold text-[#C4956A]">{formatPrice(b.prix)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Formations */}
      {results.formations.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Formations <span className="text-sm text-[var(--text-muted)] font-normal">({results.formations.length})</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {results.formations.map((f) => (
              <div key={f.id} className="p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] hover:border-[#C4956A]/40 transition">
                <h3 className="font-medium text-[var(--foreground)]">{f.titre}</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{f.instructeur} — {f.niveau}</p>
                <p className="text-sm font-bold text-[#C4956A] mt-1">{formatPrice(f.prix)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Utilisateurs */}
      {results.utilisateurs.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Utilisateurs <span className="text-sm text-[var(--text-muted)] font-normal">({results.utilisateurs.length})</span>
          </h2>
          <div className="space-y-2">
            {results.utilisateurs.map((u) => (
              <div key={u.id} className="p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] flex items-center justify-between hover:bg-[var(--hover-bg)] transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C4956A]/20 flex items-center justify-center text-[#C4956A] font-bold text-sm">
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

      {/* Événements */}
      {results.evenements.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Événements <span className="text-sm text-[var(--text-muted)] font-normal">({results.evenements.length})</span>
          </h2>
          <div className="space-y-2">
            {results.evenements.map((e) => (
              <div key={e.id} className="p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] hover:border-[#C4956A]/40 transition">
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
    </div>
  );
}

/* ─── Page (with Suspense boundary) ──────────────────────────────────────── */

export default function RecherchePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">Recherche</h1>
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
