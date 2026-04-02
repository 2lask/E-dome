"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/lib/context";

/* ─── Mock Data ──────────────────────────────────────────────────────────── */

const CATEGORIES = ["Tous", "Immobilier", "Finance", "Marketing", "Juridique", "Design", "Gestion locative", "Investissement"];

const INSTRUCTORS = [
  { id: "user-001", name: "Léo Martin", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", specialty: "Investissement", students: 1240, rating: 4.8 },
  { id: "user-004", name: "Amina El Idrissi", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop", specialty: "Location", students: 1200, rating: 4.9 },
  { id: "u3", name: "Claire Bernard", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", specialty: "Marketing", students: 670, rating: 4.7 },
  { id: "u4", name: "Jean Leroy", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", specialty: "Juridique", students: 530, rating: 4.6 },
  { id: "u2", name: "Marc Dupont", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", specialty: "Finance", students: 890, rating: 4.8 },
  { id: "u1", name: "Sophie Martin", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", specialty: "Immobilier", students: 1240, rating: 4.9 },
];

const FORMATIONS = [
  { id: "f1", title: "Investissement immobilier : de 0 a expert", category: "Immobilier", level: "debutant" as const, instructor: INSTRUCTORS[0], thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop", price: 299, rating: 4.9, studentCount: 1240, duration: "12h", progress: 65, enrolled: true, featured: true, modules: 5 },
  { id: "f2", title: "Gestion locative avancee", category: "Gestion locative", level: "avance" as const, instructor: INSTRUCTORS[1], thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop", price: 199, rating: 4.8, studentCount: 890, duration: "8h", progress: 30, enrolled: true, featured: false, modules: 6 },
  { id: "f3", title: "Marketing digital immobilier", category: "Marketing", level: "intermediaire" as const, instructor: INSTRUCTORS[2], thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop", price: 149, rating: 4.7, studentCount: 670, duration: "6h", progress: 0, enrolled: false, featured: false, modules: 5 },
  { id: "f4", title: "Droit immobilier suisse", category: "Juridique", level: "intermediaire" as const, instructor: INSTRUCTORS[3], thumbnail: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop", price: 249, rating: 4.6, studentCount: 530, duration: "10h", progress: 0, enrolled: false, featured: false, modules: 7 },
  { id: "f5", title: "Analyse financiere pour investisseurs", category: "Finance", level: "avance" as const, instructor: INSTRUCTORS[4], thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop", price: 349, rating: 4.9, studentCount: 420, duration: "14h", progress: 0, enrolled: false, featured: false, modules: 10 },
  { id: "f6", title: "Home staging professionnel", category: "Design", level: "debutant" as const, instructor: INSTRUCTORS[5], thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop", price: 129, rating: 4.5, studentCount: 340, duration: "5h", progress: 0, enrolled: false, featured: false, modules: 4 },
];

const LEVEL_LABELS: Record<string, string> = { debutant: "Débutant", intermediaire: "Intermédiaire", avance: "Avancé" };
const LEVEL_COLORS: Record<string, string> = { debutant: "bg-green-500/20 text-green-400", intermediaire: "bg-yellow-500/20 text-yellow-400", avance: "bg-red-500/20 text-red-400" };

/* ─── Stars ──────────────────────────────────────────────────────────────── */

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1 text-sm">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-4 h-4 ${s <= Math.round(rating) ? "text-[#C4956A]" : "text-[var(--text-muted)]"}`} fill="currentColor" viewBox="0 0 20 20">
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
      const matchSearch = f.title.toLowerCase().includes(search.toLowerCase()) || f.instructor.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "Tous" || f.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category]);

  const featured = FORMATIONS.find((f) => f.featured);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Formations</h1>
            <p className="text-[var(--text-secondary)] mt-1">Développez vos compétences immobilières</p>
          </div>
          {activeRole === "formateur" && (
            <Link href="/formations/creer" className="px-6 py-3 bg-[#C4956A] hover:bg-[#b8845a] text-white rounded-xl font-medium transition-colors">
              + Creer une formation
            </Link>
          )}
        </div>

        {/* ── Mes formations en cours ────────────────────────────────────────── */}
        {enrolledFormations.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Mes formations en cours</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledFormations.map((f) => (
                <Link key={f.id} href={`/formations/${f.id}`} className="flex gap-4 p-4 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl hover:border-[#C4956A]/40 transition-colors group">
                  <img src={f.thumbnail} alt={f.title} className="w-28 h-20 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[var(--foreground)] truncate group-hover:text-[#C4956A] transition-colors">{f.title}</h3>
                    <p className="text-sm text-[var(--text-muted)] mt-0.5">{f.instructor.name}</p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-1">
                        <span>Progression</span>
                        <span>{f.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-[var(--background)] rounded-full overflow-hidden">
                        <div className="h-full bg-[#C4956A] rounded-full transition-all" style={{ width: `${f.progress}%` }} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Featured banner ────────────────────────────────────────────────── */}
        {featured && (
          <Link href={`/formations/${featured.id}`} className="block relative rounded-2xl overflow-hidden group">
            <img src={featured.thumbnail} alt={featured.title} className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="inline-block px-3 py-1 bg-[#C4956A] text-white text-xs font-medium rounded-full mb-3">Formation vedette</span>
              <h2 className="text-2xl font-bold text-white mb-1">{featured.title}</h2>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <span>{featured.instructor.name}</span>
                <span>{featured.studentCount} etudiants</span>
                <Stars rating={featured.rating} />
                <span className="font-semibold text-[#C4956A]">{formatPrice(featured.price)}</span>
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
              className="w-full pl-12 pr-4 py-3 bg-[var(--card)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#C4956A]/50 transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === cat ? "bg-[#C4956A] text-white" : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[#C4956A]/40"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Formation Grid ─────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Toutes les formations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((f) => (
              <Link key={f.id} href={`/formations/${f.id}`} className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl overflow-hidden hover:border-[#C4956A]/40 transition-colors group">
                <div className="relative">
                  <img src={f.thumbnail} alt={f.title} className="w-full h-44 object-cover" />
                  <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${LEVEL_COLORS[f.level]}`}>
                    {LEVEL_LABELS[f.level]}
                  </span>
                  {f.enrolled && (
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/30">
                      <div className="h-full bg-[#C4956A]" style={{ width: `${f.progress}%` }} />
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <span className="text-xs text-[var(--text-muted)]">{f.category}</span>
                  <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[#C4956A] transition-colors line-clamp-2">{f.title}</h3>
                  <Link href={`/profil/${f.instructor.id}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 hover:underline">
                    <img src={f.instructor.avatar} alt={f.instructor.name} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-sm text-[var(--text-secondary)]">{f.instructor.name}</span>
                  </Link>
                  <Stars rating={f.rating} />
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-bold text-[#C4956A]">{formatPrice(f.price)}</span>
                    <span className="text-xs text-[var(--text-muted)]">{f.duration} &middot; {f.modules} modules</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-[var(--text-muted)] py-12">Aucune formation trouvee.</p>
          )}
        </section>

        {/* ── Formateurs populaires ──────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Formateurs populaires</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {INSTRUCTORS.map((inst) => (
              <Link key={inst.id} href={`/profil/${inst.id}`} className="flex flex-col items-center p-5 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl hover:border-[#C4956A]/40 transition-colors group">
                <img src={inst.avatar} alt={inst.name} className="w-16 h-16 rounded-full object-cover mb-3" />
                <h3 className="font-medium text-[var(--foreground)] group-hover:text-[#C4956A] transition-colors text-center">{inst.name}</h3>
                <span className="text-sm text-[var(--text-muted)]">{inst.specialty}</span>
                <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-secondary)]">
                  <span>{inst.students} etudiants</span>
                  <span className="text-[#C4956A]">{inst.rating.toFixed(1)} ★</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
