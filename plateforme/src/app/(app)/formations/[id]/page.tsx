"use client";

import React, { useState, use, useMemo } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { Calendar as BookingCallout } from "@/components/ui/calendar";
import { useApp } from "@/lib/context";
import {
  getFormationById,
  getSimilarFormations,
  formations as allFormations,
} from "@/lib/mock-data";
import type { Formation } from "@/lib/types";

/* ─── Resolve formation by ID (handles f1, form-001, etc.) ─────────────── */

function resolveFormation(id: string): Formation | undefined {
  // 1) Direct lookup (e.g. "form-001")
  let found = getFormationById(id);
  if (found) return found;

  // 2) Map short IDs like "f1" -> "form-001", "f12" -> "form-012"
  const shortMatch = id.match(/^f(\d+)$/);
  if (shortMatch) {
    const num = parseInt(shortMatch[1], 10);
    const paddedId = `form-${String(num).padStart(3, "0")}`;
    found = getFormationById(paddedId);
    if (found) return found;

    // 3) Fallback: find by index (1-based)
    if (num >= 1 && num <= allFormations.length) {
      return allFormations[num - 1];
    }
  }

  // 4) Search by partial match
  return allFormations.find((f) => f.id.includes(id) || id.includes(f.id));
}

/* ─── Formation reviews (per-formation, not from mock-data property reviews) */

const FORMATION_REVIEWS: Record<string, { id: string; author: string; avatar: string; rating: number; comment: string; date: string }[]> = {
  "form-001": [
    { id: "fr1", author: "Pierre Müller", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop", rating: 5, comment: "Formation exceptionnelle. Très complète et bien structurée. J'ai pu acheter mon premier bien 3 mois après.", date: "2025-11-15" },
    { id: "fr2", author: "Marie Laurent", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop", rating: 5, comment: "Léo explique de manière très claire et pratique. Je recommande vivement.", date: "2025-10-22" },
    { id: "fr3", author: "Lucas Favre", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop", rating: 4, comment: "Bon contenu, j'aurais aimé plus d'exemples concrets sur le marché romand.", date: "2025-09-30" },
  ],
  "form-002": [
    { id: "fr4", author: "Nathalie Blanc", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop", rating: 5, comment: "Amina maîtrise parfaitement la location courte durée. Ses conseils sur le pricing dynamique m'ont permis d'augmenter mes revenus de 40%.", date: "2025-12-05" },
    { id: "fr5", author: "Jean-Luc Hartmann", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&h=60&fit=crop", rating: 5, comment: "Formation très pratique avec des outils concrets. Le module sur l'automatisation est un vrai game-changer.", date: "2025-11-20" },
  ],
  "form-003": [
    { id: "fr6", author: "Marc Favre", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop", rating: 5, comment: "Sophie est une négociatrice hors pair. Ses techniques m'ont aidé à vendre ma villa 15% au-dessus du prix estimé.", date: "2025-10-10" },
    { id: "fr7", author: "Elena P.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop", rating: 4, comment: "Très bon contenu, surtout le module sur la psychologie de l'acheteur. Niveau avancé justifié.", date: "2025-09-18" },
  ],
  "form-004": [
    { id: "fr8", author: "Alexandre Petit", avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=60&h=60&fit=crop", rating: 5, comment: "Yasmin connaît le marché du luxe comme personne. Formation indispensable pour qui veut se positionner sur le haut de gamme.", date: "2025-12-12" },
  ],
  "form-005": [
    { id: "fr9", author: "Pierre Gonçalves", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=60&fit=crop", rating: 5, comment: "Thomas m'a permis de comprendre les subtilités de la rénovation énergétique. Mon projet Minergie avance grâce à cette formation.", date: "2025-11-28" },
    { id: "fr10", author: "Clémence Moreau", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop", rating: 4, comment: "Bonne formation sur la rénovation, le module sur les subventions est très utile.", date: "2025-10-15" },
  ],
  "form-006": [
    { id: "fr11", author: "Carlos Rivera", avatar: "https://images.unsplash.com/photo-1548449112-96a38a643324?w=60&h=60&fit=crop", rating: 5, comment: "Lucas maîtrise parfaitement le marketing digital immobilier. Mes annonces génèrent 3x plus de leads depuis cette formation.", date: "2025-12-01" },
  ],
  "form-007": [
    { id: "fr12", author: "Sophie Durand", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop", rating: 5, comment: "Nathalie est une experte juridique remarquable. Cette formation est essentielle pour tout professionnel de l'immobilier en Suisse.", date: "2025-11-05" },
  ],
  "form-008": [
    { id: "fr13", author: "Omar Benjelloun", avatar: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=60&h=60&fit=crop", rating: 5, comment: "Carlos m'a appris à photographier mes biens comme un pro. Le module drone est fantastique.", date: "2025-12-08" },
  ],
  "form-009": [
    { id: "fr14", author: "Fatima Zahra", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=60&h=60&fit=crop", rating: 4, comment: "Bonne introduction au marché thaïlandais. Les études de cas réels sont très instructives.", date: "2025-11-18" },
  ],
  "form-010": [
    { id: "fr15", author: "Marc Favre", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop", rating: 5, comment: "Yasmin connaît Dubaï sur le bout des doigts. Formation incontournable pour investir aux Émirats.", date: "2025-12-15" },
  ],
  "form-011": [
    { id: "fr16", author: "Jean-Luc Hartmann", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&h=60&fit=crop", rating: 5, comment: "Le bootcamp de Fatima est intense mais très efficace. J'ai signé mes premiers deals d'apporteur en 30 jours.", date: "2025-11-30" },
  ],
};

const LEVEL_LABELS: Record<string, string> = { debutant: "Débutant", intermediaire: "Intermédiaire", avance: "Avancé" };

/* ─── Stars ──────────────────────────────────────────────────────────────── */

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "md" ? "w-5 h-5" : "w-4 h-4";
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`${cls} ${s <= Math.round(rating) ? "text-amber-400" : "text-[var(--text-muted)]"}`} fill="currentColor" viewBox="0 0 20 20">
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

  const resolvedFormation = resolveFormation(id);

  if (!resolvedFormation) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-[var(--text-muted)]">Formation introuvable.</p>
      </div>
    );
  }

  const formation = resolvedFormation;
  const instructor = formation.instructor;
  const reviews = FORMATION_REVIEWS[formation.id] || [];
  const similarFormations = getSimilarFormations(formation);

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
          <span className="inline-block px-3 py-1 bg-[#1e9df1] text-white text-xs font-medium rounded-full mb-3">{formation.category}</span>
          <h1 className="text-2xl md:text-4xl page-heading text-white mb-2">{formation.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
            <span>{LEVEL_LABELS[formation.level]}</span>
            <span>{formation.duration}</span>
            <span>{formation.studentCount} étudiants</span>
            <Stars rating={formation.rating} />
            <span className="text-[#1e9df1] font-bold text-lg">{formatPrice(formation.price)}</span>
          </div>
        </div>
        {/* Play button */}
        <button
          onClick={() => setPlayingLesson(formation.modules[0]?.lessons[0]?.id || "preview")}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left Column ─────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-xl font-semibold mb-3">À propos de cette formation</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">{formation.description}</p>
            </section>

            {/* Progress bar */}
            {enrollState === "enrolled" && (
              <div className="p-4 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[var(--text-secondary)]">Progression</span>
                  <span className="font-medium text-[#1e9df1]">{progressPercent}%</span>
                </div>
                <div className="w-full h-3 bg-[var(--background)] rounded-full overflow-hidden">
                  <div className="h-full bg-[#1e9df1] rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                </div>
                {allDone && (
                  <button onClick={() => setShowCertificate(true)} className="mt-3 px-4 py-2 bg-[#1e9df1] text-white rounded-lg text-sm font-medium hover:bg-[#1583c9] transition-colors">
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
                        <span className="w-8 h-8 flex items-center justify-center bg-[#1e9df1]/20 text-[#1e9df1] rounded-lg text-sm font-bold">{mi + 1}</span>
                        <div>
                          <h3 className="font-medium">{mod.title}</h3>
                          <span className="text-xs text-[var(--text-muted)]">{mod.lessons.length} leçons</span>
                        </div>
                      </div>
                      <svg className={`w-5 h-5 text-[var(--text-muted)] transition-transform ${openModules.has(mod.id) ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openModules.has(mod.id) && (
                      <div className="border-t border-[var(--card-border)]">
                        {mod.lessons.map((lesson) => (
                          <div key={lesson.id} className={`flex items-center gap-3 px-4 py-3 hover:bg-[var(--hover-bg)] transition-colors ${playingLesson === lesson.id ? "bg-[#1e9df1]/10" : ""}`}>
                            {enrollState === "enrolled" ? (
                              <button onClick={() => toggleLesson(lesson.id)} className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors flex-shrink-0 ${completedLessons.has(lesson.id) ? "bg-[#1e9df1] border-[#1e9df1]" : "border-[var(--text-muted)]"}`}>
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
              <div className="bg-black rounded-2xl overflow-hidden relative">
                <iframe
                  className="w-full aspect-video rounded-2xl"
                  src="https://www.youtube.com/embed/E0dyHPjiJDo?autoplay=1"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <button onClick={() => setPlayingLesson(null)} className="absolute top-3 right-3 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 z-10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            )}

            {/* ── Reviews ───────────────────────────────────────────────── */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Avis des étudiants</h2>
              <div className="space-y-4">
                {reviews.map((review) => (
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
              <div className="text-3xl font-bold text-[#1e9df1]">{formatPrice(formation.price)}</div>
              {enrollState === "idle" && (
                <button onClick={handleEnroll} className="w-full py-3 bg-[#1e9df1] hover:bg-[#1583c9] text-white rounded-xl font-medium transition-colors">
                  S&apos;inscrire à la formation
                </button>
              )}
              {enrollState === "loading" && (
                <button disabled className="w-full py-3 bg-[#1e9df1]/60 text-white rounded-xl font-medium flex items-center justify-center gap-2">
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
                <div className="flex justify-between"><span>Note</span><span className="font-medium text-[#1e9df1]">{formation.rating}/5</span></div>
              </div>
            </div>

            {/* Instructor Card */}
            <Link href={`/profil/${instructor.id}`} className="block p-5 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl hover:border-[#1e9df1]/40 transition-colors group">
              <div className="flex items-center gap-3 mb-3">
                <img src={instructor.avatar} alt={`${instructor.firstName} ${instructor.lastName}`} className="w-14 h-14 rounded-full object-cover" />
                <div>
                  <h3 className="font-semibold group-hover:text-[#1e9df1] transition-colors">{instructor.firstName} {instructor.lastName}</h3>
                  <span className="text-sm text-[var(--text-muted)]">Formateur</span>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-3">{instructor.bio}</p>
              <div className="flex gap-4 text-xs text-[var(--text-muted)]">
                <span>{instructor.stats.followers} abonnés</span>
                <span className="inline-flex items-center gap-0.5 text-[#1e9df1]">
                  <Star size={11} fill="currentColor" /> {instructor.stats.rating}
                </span>
              </div>
            </Link>

            {/* Similar formations */}
            <div>
              <h3 className="font-semibold mb-3">Formations similaires</h3>
              <div className="space-y-3">
                {similarFormations.map((s) => (
                  <Link key={s.id} href={`/formations/${s.id}`} className="flex gap-3 p-3 bg-[var(--card)] border border-[var(--card-border)] rounded-xl hover:border-[#1e9df1]/40 transition-colors group">
                    <img src={s.thumbnail} alt={s.title} className="w-20 h-14 rounded-lg object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium truncate group-hover:text-[#1e9df1] transition-colors">{s.title}</h4>
                      <p className="text-xs text-[var(--text-muted)]">{s.instructor.firstName} {s.instructor.lastName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-[#1e9df1]">{formatPrice(s.price)}</span>
                        <span className="inline-flex items-center gap-0.5 text-xs text-[var(--text-muted)]">
                          <Star size={10} fill="currentColor" className="text-amber-400" /> {s.rating}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA appel formateur — pour les indécis, un appel avec le
            formateur lève le doute mieux que la page produit. Slug
            personnalisé par formateur pour que chaque cal.com soit
            le bon. */}
        <div className="mt-10">
          <BookingCallout
            bookingLink={`https://cal.com/edome/formateur-${instructor.id}`}
            title={`Une question pour ${instructor.firstName} ?`}
            subtitle="Réservez un appel de présentation gratuit avant de vous inscrire — programme, prérequis, accompagnement."
            ctaLabel="Réserver avec le formateur"
            duration="20 min"
          />
        </div>
      </div>

      {/* ── Certificate Modal ────────────────────────────────────────────── */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-8 max-w-lg w-full animate-scale-in text-center">
            <div className="w-20 h-20 bg-[#1e9df1]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-[#1e9df1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Félicitations !</h2>
            <p className="text-[var(--text-secondary)] mb-4">Vous avez complété la formation <strong>&quot;{formation.title}&quot;</strong>. Votre certificat est prêt.</p>
            <div className="p-6 border-2 border-dashed border-[#1e9df1]/40 rounded-xl mb-6">
              <p className="text-xs text-[var(--text-muted)] mb-1">CERTIFICAT DE COMPLÉTION</p>
              <p className="text-lg font-bold text-[#1e9df1]">{formation.title}</p>
              <p className="text-sm text-[var(--text-secondary)] mt-2">Délivré le {new Date().toLocaleDateString("fr-CH")}</p>
              <p className="text-sm text-[var(--text-secondary)]">Formateur : {instructor.firstName} {instructor.lastName}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowCertificate(false)} className="flex-1 py-3 border border-[var(--card-border)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">
                Fermer
              </button>
              <button className="flex-1 py-3 bg-[#1e9df1] hover:bg-[#1583c9] text-white rounded-xl font-medium transition-colors">
                Télécharger PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
