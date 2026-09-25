"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { useApp } from "@/lib/context";
import { HorizontalScroller } from "@/components/ui/horizontal-scroller";
import { PageHeader } from "@/components/ui/page-header";
import { formations as catalogue } from "@/lib/mock-data";
import type { User } from "@/lib/types";

/* ─── Catalogue ──────────────────────────────────────────────────────────────

   Cette page listait six formations qui lui étaient propres, identifiées
   f1 à f6, alors que la fiche de détail lit le catalogue partagé, identifié
   form-001 et suivants. Une rustine faisait correspondre f1 à form-001 par
   position : cliquer une carte ouvrait donc une formation au titre, au
   formateur et au prix différents de ceux affichés sur la carte.

   La liste et la fiche lisent désormais la même source. Ce qui reste
   propre à cette page est ce qui ne concerne pas la formation mais
   l'utilisateur de démonstration : sa progression et ses inscriptions. */

const ENROLMENTS: Record<string, number> = {
  "form-001": 65,
  "form-002": 30,
};

const FEATURED_ID = "form-001";

/* Le catalogue porte des User (firstName / lastName), pas un champ `name`. */
const fullName = (u: User) => `${u.firstName} ${u.lastName}`;

const FORMATIONS = catalogue.map((f) => ({
  ...f,
  instructorName: fullName(f.instructor),
  moduleCount: f.modules.length,
  progress: ENROLMENTS[f.id] ?? 0,
  enrolled: f.id in ENROLMENTS,
  featured: f.id === FEATURED_ID,
}));

const CATEGORIES = ["Tous", ...new Set(catalogue.map((f) => f.category))];

/* Formateurs : dérivés du catalogue, pour qu'un formateur mis en avant ici
   ait bien des formations à son nom. La spécialité est la catégorie qu'il
   enseigne le plus, le nombre d'étudiants la somme de ses formations, la
   note leur moyenne. */
const INSTRUCTORS = [...new Map(catalogue.map((f) => [f.instructor.id, f.instructor])).values()].map(
  (person) => {
    const taught = catalogue.filter((f) => f.instructor.id === person.id);
    const byCategory = new Map<string, number>();
    for (const f of taught) byCategory.set(f.category, (byCategory.get(f.category) ?? 0) + 1);
    const specialty = [...byCategory.entries()].sort((a, b) => b[1] - a[1])[0][0];
    return {
      id: person.id,
      name: fullName(person),
      avatar: person.avatar,
      specialty,
      students: taught.reduce((sum, f) => sum + f.studentCount, 0),
      rating: taught.reduce((sum, f) => sum + f.rating, 0) / taught.length,
    };
  },
);

const LEVEL_LABELS: Record<string, string> = { debutant: "Débutant", intermediaire: "Intermédiaire", avance: "Avancé" };
const LEVEL_COLORS: Record<string, string> = { debutant: "badge-level-beginner", intermediaire: "badge-level-intermediate", avance: "badge-level-advanced" };

/* ─── Stars ──────────────────────────────────────────────────────────────── */

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1 text-sm">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-4 h-4 ${s <= Math.round(rating) ? "text-amber-400" : "text-[var(--text-muted)]"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-[var(--text-muted)] ml-1">{rating.toFixed(1)}</span>
    </span>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function FormationsPage() {
  const { formatPrice, activeRole } = useApp();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tous");

  const enrolledFormations = FORMATIONS.filter((f) => f.enrolled);

  const filtered = useMemo(() => {
    return FORMATIONS.filter((f) => {
      const matchSearch = f.title.toLowerCase().includes(search.toLowerCase()) || f.instructorName.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "Tous" || f.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category]);

  const featured = FORMATIONS.find((f) => f.featured);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">

        {/* Header */}
        <PageHeader
          title="Formations"
          description="Développez vos compétences immobilières"
          variant="serif"
          actions={
            activeRole === "formateur" ? (
              <Link
                href="/formations/creer"
                className="px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-xl font-medium transition-colors"
              >
                + Créer une formation
              </Link>
            ) : undefined
          }
        />

        {/* ── Mes formations en cours ──────────────────────────────────────────
            Migre vers <HorizontalScroller> : sur mobile les cards faisaient
            chacune toute la largeur (grid-cols-1) ce qui creait beaucoup de
            scroll vertical. Maintenant carousel horizontal, cards 280px,
            on en voit 2 d'un coup sur desktop, scroll horizontal mobile. */}
        {enrolledFormations.length > 0 && (
          <HorizontalScroller
            title="Mes formations en cours"
            cardWidth="300px"
          >
            {enrolledFormations.map((f) => (
              <Link key={f.id} href={`/formations/${f.id}`} className="flex gap-3 p-3 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl hover:border-[var(--primary)]/40 transition-colors group h-full">
                <img src={f.thumbnail} alt={f.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[var(--foreground)] truncate group-hover:text-[var(--primary)] transition-colors text-sm">{f.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">{f.instructorName}</p>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)] mb-1">
                      <span>Progression</span>
                      <span className="tabular-nums">{f.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--background)] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--primary)] rounded-full transition-all" style={{ width: `${f.progress}%` }} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </HorizontalScroller>
        )}

        {/* ── Featured banner ────────────────────────────────────────────────── */}
        {featured && (
          <Link href={`/formations/${featured.id}`} className="block relative rounded-2xl overflow-hidden group">
            <img src={featured.thumbnail} alt={featured.title} className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="inline-block px-3 py-1 bg-[var(--primary)] text-white text-xs font-medium rounded-full mb-3">Formation vedette</span>
              <h2 className="text-2xl font-bold text-white mb-1">{featured.title}</h2>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <span>{featured.instructorName}</span>
                <span>{featured.studentCount} étudiants</span>
                <Stars rating={featured.rating} />
                <span className="font-semibold text-[var(--primary)]">{formatPrice(featured.price)}</span>
              </div>
            </div>
          </Link>
        )}

        {/* ── Search + Categories ─────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher une formation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[var(--card)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === cat ? "bg-[var(--primary)] text-white" : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[var(--primary)]/40"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Formation Grid ─────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Toutes les formations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Patron « lien étiré » : un <Link> ne peut pas en contenir un
                autre (HTML invalide → erreur d'hydratation, audit Mission 2).
                La carte est un conteneur ; un lien-overlay couvre toute la
                carte vers la formation, et le lien vers le formateur passe
                AU-DESSUS (z-10). */}
            {filtered.map((f) => (
              <article key={f.id} className="relative bg-[var(--card)] border border-[var(--card-border)] rounded-2xl overflow-hidden hover:border-[var(--primary)]/40 transition-colors group">
                <Link href={`/formations/${f.id}`} className="absolute inset-0 z-10" aria-label={f.title} />
                <div className="relative">
                  <img src={f.thumbnail} alt="" className="w-full h-44 object-cover" />
                  <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${LEVEL_COLORS[f.level]}`}>
                    {LEVEL_LABELS[f.level]}
                  </span>
                  {f.enrolled && (
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/30">
                      <div className="h-full bg-[var(--primary)]" style={{ width: `${f.progress}%` }} />
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <span className="text-xs text-[var(--text-muted)]">{f.category}</span>
                  <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors line-clamp-2">{f.title}</h3>
                  <Link href={`/profil/${f.instructor.id}`} className="relative z-20 inline-flex items-center gap-2 hover:underline">
                    <img src={f.instructor.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-sm text-[var(--text-secondary)]">{f.instructorName}</span>
                  </Link>
                  <Stars rating={f.rating} />
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-bold text-[var(--primary)]">{formatPrice(f.price)}</span>
                    <span className="text-xs text-[var(--text-muted)]">{f.duration} &middot; {f.moduleCount} modules</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-[var(--text-muted)] py-12">Aucune formation trouvée.</p>
          )}
        </section>

        {/* ── Formateurs populaires ────────────────────────────────────────────
            Migre vers <HorizontalScroller>. Avant : grid 2/3/4 col qui
            mangeait beaucoup de hauteur mobile. Maintenant cards 160px
            qui scrollent horizontal, on respire. */}
        <HorizontalScroller
          title="Formateurs populaires"
          cardWidth="180px"
        >
            {INSTRUCTORS.map((inst) => (
              <Link key={inst.id} href={`/profil/${inst.id}`} className="flex flex-col items-center p-5 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl hover:border-[var(--primary)]/40 transition-colors group h-full">
                <img src={inst.avatar} alt={inst.name} className="w-16 h-16 rounded-full object-cover mb-3" />
                <h3 className="font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors text-center line-clamp-1">{inst.name}</h3>
                <span className="text-sm text-[var(--text-muted)] line-clamp-1 text-center">{inst.specialty}</span>
                <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-secondary)]">
                  <span>{inst.students} étudiants</span>
                  <span className="inline-flex items-center gap-0.5 text-[var(--primary)]">
                    <Star size={11} fill="currentColor" /> {inst.rating.toFixed(1)}
                  </span>
                </div>
              </Link>
            ))}
        </HorizontalScroller>
      </div>
    </div>
  );
}
