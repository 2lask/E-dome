"use client";

import React, { useState, use, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/lib/context";

/* ─── Mock Data ──────────────────────────────────────────────────────────── */

const INSTRUCTOR = {
  id: "u1", name: "Sophie Martin", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  bio: "Experte en immobilier avec plus de 15 ans d'experience. Formatrice certifiee et investisseuse active en Suisse romande.",
  students: 1240, rating: 4.9, formations: 8,
};

const FORMATION_DATA: Record<string, {
  title: string; description: string; category: string; level: string; price: number; duration: string;
  thumbnail: string; previewVideo: string; rating: number; studentCount: number;
  modules: { id: string; title: string; lessons: { id: string; title: string; duration: string; completed: boolean; videoUrl?: string }[] }[];
  reviews: { id: string; author: string; avatar: string; rating: number; comment: string; date: string }[];
  similar: { id: string; title: string; thumbnail: string; price: number; rating: number; instructor: string }[];
}> = {
  f1: {
    title: "Investissement immobilier : de 0 a expert",
    description: "Cette formation complète vous guide pas à pas dans l'univers de l'investissement immobilier. De la recherche du bien idéal au financement, en passant par la négociation et la gestion locative, vous acquerrez toutes les compétences nécessaires pour réussir vos investissements.",
    category: "Immobilier", level: "debutant", price: 299, duration: "12h",
    thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=600&fit=crop",
    previewVideo: "",
    rating: 4.9, studentCount: 1240,
    modules: [
      { id: "m1", title: "Introduction a l'investissement immobilier", lessons: [
        { id: "l1", title: "Pourquoi investir dans l'immobilier", duration: "15 min", completed: true },
        { id: "l2", title: "Les differents types d'investissement", duration: "20 min", completed: true },
        { id: "l3", title: "Le marche immobilier suisse", duration: "25 min", completed: false },
      ]},
      { id: "m2", title: "Financement et fiscalite", lessons: [
        { id: "l4", title: "Les options de financement", duration: "30 min", completed: false },
        { id: "l5", title: "Optimisation fiscale", duration: "25 min", completed: false },
      ]},
      { id: "m3", title: "Recherche et analyse de biens", lessons: [
        { id: "l6", title: "Criteres de selection", duration: "20 min", completed: false },
        { id: "l7", title: "Analyse de rentabilite", duration: "35 min", completed: false },
        { id: "l8", title: "Due diligence", duration: "25 min", completed: false },
      ]},
      { id: "m4", title: "Negociation et acquisition", lessons: [
        { id: "l9", title: "Techniques de negociation", duration: "30 min", completed: false },
        { id: "l10", title: "Le processus d'achat", duration: "20 min", completed: false },
      ]},
      { id: "m5", title: "Gestion locative", lessons: [
        { id: "l11", title: "Trouver et gerer les locataires", duration: "25 min", completed: false },
        { id: "l12", title: "Entretien et renovation", duration: "20 min", completed: false },
      ]},
    ],
    reviews: [
      { id: "r1", author: "Pierre Müller", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop", rating: 5, comment: "Formation exceptionnelle. Tres complete et bien structuree. J'ai pu acheter mon premier bien 3 mois apres.", date: "2025-11-15" },
      { id: "r2", author: "Marie Laurent", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop", rating: 5, comment: "Sophie explique de maniere tres claire et pratique. Je recommande vivement.", date: "2025-10-22" },
      { id: "r3", author: "Lucas Favre", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop", rating: 4, comment: "Bon contenu, j'aurais aime plus d'exemples concrets sur le marche romand.", date: "2025-09-30" },
    ],
    similar: [
      { id: "f2", title: "Gestion locative avancee", thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop", price: 199, rating: 4.8, instructor: "Marc Dupont" },
      { id: "f5", title: "Analyse financiere pour investisseurs", thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop", price: 349, rating: 4.9, instructor: "Marc Dupont" },
    ],
  },
};

const DEFAULT_FORMATION = FORMATION_DATA.f1;

const LEVEL_LABELS: Record<string, string> = { debutant: "Débutant", intermediaire: "Intermédiaire", avance: "Avancé" };

/* ─── Stars ──────────────────────────────────────────────────────────────── */

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "md" ? "w-5 h-5" : "w-4 h-4";
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`${cls} ${s <= Math.round(rating) ? "text-[#C4956A]" : "text-[var(--text-muted)]"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function FormationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { formatPrice } = useApp();

  const formation = FORMATION_DATA[id] ?? DEFAULT_FORMATION;

  const [openModules, setOpenModules] = useState<Set<string>>(new Set([formation.modules[0]?.id]));
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(() => {
    const set = new Set<string>();
    formation.modules.forEach((m) => m.lessons.forEach((l) => { if (l.completed) set.add(l.id); }));
    return set;
  });
  const [enrollState, setEnrollState] = useState<"idle" | "loading" | "enrolled">("idle");
  const [showCertificate, setShowCertificate] = useState(false);
  const [playingLesson, setPlayingLesson] = useState<string | null>(null);

  const totalLessons = useMemo(() => formation.modules.reduce((acc, m) => acc + m.lessons.length, 0), [formation]);
  const completedCount = completedLessons.size;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const allDone = completedCount === totalLessons && totalLessons > 0;

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId); else next.add(moduleId);
      return next;
    });
  };

  const toggleLesson = (lessonId: string) => {
    setCompletedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) next.delete(lessonId); else next.add(lessonId);
      return next;
    });
  };

  const handleEnroll = () => {
    setEnrollState("loading");
    setTimeout(() => setEnrollState("enrolled"), 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative">
        <img src={formation.thumbnail} alt={formation.title} className="w-full h-72 md:h-96 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-7xl mx-auto">
          <span className="inline-block px-3 py-1 bg-[#C4956A] text-white text-xs font-medium rounded-full mb-3">{formation.category}</span>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{formation.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
            <span>{LEVEL_LABELS[formation.level]}</span>
            <span>{formation.duration}</span>
            <span>{formation.studentCount} etudiants</span>
            <Stars rating={formation.rating} />
            <span className="text-[#C4956A] font-bold text-lg">{formatPrice(formation.price)}</span>
          </div>
        </div>
        {/* Play button */}
        <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left Column ─────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-xl font-semibold mb-3">A propos de cette formation</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">{formation.description}</p>
            </section>

            {/* Progress bar */}
            {enrollState === "enrolled" && (
              <div className="p-4 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[var(--text-secondary)]">Progression</span>
                  <span className="font-medium text-[#C4956A]">{progressPercent}%</span>
                </div>
                <div className="w-full h-3 bg-[var(--background)] rounded-full overflow-hidden">
                  <div className="h-full bg-[#C4956A] rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                </div>
                {allDone && (
                  <button onClick={() => setShowCertificate(true)} className="mt-3 px-4 py-2 bg-[#C4956A] text-white rounded-lg text-sm font-medium hover:bg-[#b8845a] transition-colors">
                    Obtenir mon certificat
                  </button>
                )}
              </div>
            )}

            {/* ── Module Accordion ──────────────────────────────────────── */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Contenu de la formation</h2>
              <div className="space-y-3">
                {formation.modules.map((mod, mi) => (
                  <div key={mod.id} className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl overflow-hidden">
                    <button onClick={() => toggleModule(mod.id)} className="w-full flex items-center justify-between p-4 hover:bg-[var(--hover-bg)] transition-colors">
                      <div className="flex items-center gap-3 text-left">
                        <span className="w-8 h-8 flex items-center justify-center bg-[#C4956A]/20 text-[#C4956A] rounded-lg text-sm font-bold">{mi + 1}</span>
                        <div>
                          <h3 className="font-medium">{mod.title}</h3>
                          <span className="text-xs text-[var(--text-muted)]">{mod.lessons.length} lecons</span>
                        </div>
                      </div>
                      <svg className={`w-5 h-5 text-[var(--text-muted)] transition-transform ${openModules.has(mod.id) ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openModules.has(mod.id) && (
                      <div className="border-t border-[var(--card-border)]">
                        {mod.lessons.map((lesson) => (
                          <div key={lesson.id} className={`flex items-center gap-3 px-4 py-3 hover:bg-[var(--hover-bg)] transition-colors ${playingLesson === lesson.id ? "bg-[#C4956A]/10" : ""}`}>
                            {enrollState === "enrolled" ? (
                              <button onClick={() => toggleLesson(lesson.id)} className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors flex-shrink-0 ${completedLessons.has(lesson.id) ? "bg-[#C4956A] border-[#C4956A]" : "border-[var(--text-muted)]"}`}>
                                {completedLessons.has(lesson.id) && (
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                )}
                              </button>
                            ) : (
                              <svg className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth={2} /><path d="M10 8l6 4-6 4V8z" fill="currentColor" /></svg>
                            )}
                            <button onClick={() => setPlayingLesson(lesson.id)} className="flex-1 text-left">
                              <span className={`text-sm ${completedLessons.has(lesson.id) ? "line-through text-[var(--text-muted)]" : "text-[var(--foreground)]"}`}>{lesson.title}</span>
                            </button>
                            <span className="text-xs text-[var(--text-muted)]">{lesson.duration}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* ── Video player area ─────────────────────────────────────── */}
            {playingLesson && (
              <div className="bg-black rounded-2xl aspect-video flex items-center justify-center relative">
                <div className="text-center text-white/60">
                  <svg className="w-16 h-16 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  <p className="text-sm">Lecteur video</p>
                  <p className="text-xs text-white/40 mt-1">{formation.modules.flatMap(m => m.lessons).find(l => l.id === playingLesson)?.title}</p>
                </div>
                <button onClick={() => setPlayingLesson(null)} className="absolute top-3 right-3 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            )}

            {/* ── Reviews ───────────────────────────────────────────────── */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Avis des etudiants</h2>
              <div className="space-y-4">
                {formation.reviews.map((review) => (
                  <div key={review.id} className="p-4 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={review.avatar} alt={review.author} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <h4 className="font-medium text-sm">{review.author}</h4>
                        <span className="text-xs text-[var(--text-muted)]">{new Date(review.date).toLocaleDateString("fr-CH")}</span>
                      </div>
                      <div className="ml-auto"><Stars rating={review.rating} /></div>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">{review.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── Right Column ────────────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Enroll Card */}
            <div className="sticky top-4 p-6 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl space-y-4">
              <div className="text-3xl font-bold text-[#C4956A]">{formatPrice(formation.price)}</div>
              {enrollState === "idle" && (
                <button onClick={handleEnroll} className="w-full py-3 bg-[#C4956A] hover:bg-[#b8845a] text-white rounded-xl font-medium transition-colors">
                  S&apos;inscrire a la formation
                </button>
              )}
              {enrollState === "loading" && (
                <button disabled className="w-full py-3 bg-[#C4956A]/60 text-white rounded-xl font-medium flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Inscription en cours...
                </button>
              )}
              {enrollState === "enrolled" && (
                <button disabled className="w-full py-3 bg-green-600 text-white rounded-xl font-medium flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Inscrit
                </button>
              )}
              <div className="space-y-3 text-sm text-[var(--text-secondary)]">
                <div className="flex justify-between"><span>Durée</span><span className="font-medium text-[var(--foreground)]">{formation.duration}</span></div>
                <div className="flex justify-between"><span>Modules</span><span className="font-medium text-[var(--foreground)]">{formation.modules.length}</span></div>
                <div className="flex justify-between"><span>Leçons</span><span className="font-medium text-[var(--foreground)]">{totalLessons}</span></div>
                <div className="flex justify-between"><span>Niveau</span><span className="font-medium text-[var(--foreground)]">{LEVEL_LABELS[formation.level]}</span></div>
                <div className="flex justify-between"><span>Étudiants</span><span className="font-medium text-[var(--foreground)]">{formation.studentCount}</span></div>
                <div className="flex justify-between"><span>Note</span><span className="font-medium text-[#C4956A]">{formation.rating}/5</span></div>
              </div>
            </div>

            {/* Instructor Card */}
            <Link href={`/profil/${INSTRUCTOR.id}`} className="block p-5 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl hover:border-[#C4956A]/40 transition-colors group">
              <div className="flex items-center gap-3 mb-3">
                <img src={INSTRUCTOR.avatar} alt={INSTRUCTOR.name} className="w-14 h-14 rounded-full object-cover" />
                <div>
                  <h3 className="font-semibold group-hover:text-[#C4956A] transition-colors">{INSTRUCTOR.name}</h3>
                  <span className="text-sm text-[var(--text-muted)]">Formateur</span>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-3">{INSTRUCTOR.bio}</p>
              <div className="flex gap-4 text-xs text-[var(--text-muted)]">
                <span>{INSTRUCTOR.students} etudiants</span>
                <span>{INSTRUCTOR.formations} formations</span>
                <span className="text-[#C4956A]">{INSTRUCTOR.rating} ★</span>
              </div>
            </Link>

            {/* Similar formations */}
            <div>
              <h3 className="font-semibold mb-3">Formations similaires</h3>
              <div className="space-y-3">
                {formation.similar.map((s) => (
                  <Link key={s.id} href={`/formations/${s.id}`} className="flex gap-3 p-3 bg-[var(--card)] border border-[var(--card-border)] rounded-xl hover:border-[#C4956A]/40 transition-colors group">
                    <img src={s.thumbnail} alt={s.title} className="w-20 h-14 rounded-lg object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium truncate group-hover:text-[#C4956A] transition-colors">{s.title}</h4>
                      <p className="text-xs text-[var(--text-muted)]">{s.instructor}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-[#C4956A]">{formatPrice(s.price)}</span>
                        <span className="text-xs text-[var(--text-muted)]">{s.rating} ★</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Certificate Modal ────────────────────────────────────────────── */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-8 max-w-lg w-full animate-scale-in text-center">
            <div className="w-20 h-20 bg-[#C4956A]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-[#C4956A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Felicitations !</h2>
            <p className="text-[var(--text-secondary)] mb-4">Vous avez complete la formation <strong>&quot;{formation.title}&quot;</strong>. Votre certificat est pret.</p>
            <div className="p-6 border-2 border-dashed border-[#C4956A]/40 rounded-xl mb-6">
              <p className="text-xs text-[var(--text-muted)] mb-1">CERTIFICAT DE COMPLETION</p>
              <p className="text-lg font-bold text-[#C4956A]">{formation.title}</p>
              <p className="text-sm text-[var(--text-secondary)] mt-2">Delivre le {new Date().toLocaleDateString("fr-CH")}</p>
              <p className="text-sm text-[var(--text-secondary)]">Formateur : {INSTRUCTOR.name}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowCertificate(false)} className="flex-1 py-3 border border-[var(--card-border)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">
                Fermer
              </button>
              <button className="flex-1 py-3 bg-[#C4956A] hover:bg-[#b8845a] text-white rounded-xl font-medium transition-colors">
                Telecharger PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
