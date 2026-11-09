"use client";

import React, { useState, use, useMemo } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { Calendar as BookingCallout } from "@/components/ui/calendar";
import { BackButton } from "@/components/ui/back-button";
import { useApp } from "@/lib/context";
import {
  getFormationById,
  getSimilarFormations,
  formations as allFormations,
  mockReviews,
} from "@/lib/mock-data";
import { frDate } from "@/lib/demo/showcase";
import type { Formation } from "@/lib/types";
import { RecommendButton } from "@/components/affiliate/recommend-button";
import { useSession } from "@/lib/use-session";
import { isSessionId } from "@/lib/demo/session-views";
import { ReferralBanner } from "@/components/affiliate/referral-banner";

/* ─── Résolution d'une formation ────────────────────────────────────────────

   Cette fonction faisait auparavant correspondre « f1 » à « form-001 » par
   remplissage de zéros, puis par position dans le tableau, puis par simple
   inclusion de chaîne. Résultat : une carte intitulée « Investissement
   immobilier : de 0 à expert » ouvrait « Investissement locatif : de zéro à
   rentier », d'un autre formateur, à un autre prix — et surtout, aucun
   identifiant inconnu n'échouait jamais vraiment.

   La liste et la fiche partagent maintenant le même catalogue. Un
   identifiant qui n'existe pas doit donc simplement rester introuvable. */

function resolveFormation(id: string): Formation | undefined {
  return getFormationById(id);
}

/* ─── Avis de formation ─────────────────────────────────────────────────────

   Les avis viennent de `mockReviews` : chacun est écrit par une personne de
   l'annuaire qui a RÉELLEMENT suivi la formation (inscription à son nom au
   journal, invariant 18). Plus de visages ni de noms inventés. */
function formationReviews(formationId: string) {
  return mockReviews
    .filter((r) => r.subject.kind === "formation" && r.subject.id === formationId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((r) => ({
      id: r.id,
      authorId: r.author.id,
      author: `${r.author.firstName} ${r.author.lastName}`,
      avatar: r.author.avatar,
      rating: r.rating,
      comment: r.comment,
      date: frDate(r.createdAt),
    }));
}

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

/* Le composant est coupé en deux, et ce n'est pas cosmétique.

   La version précédente résolvait la formation, sortait en `return` quand elle
   était introuvable, puis déclarait ses `useState` — donc des hooks appelés
   conditionnellement. Sur un identifiant inconnu, React changeait de nombre de
   hooks entre deux rendus : un plantage qui attendait son heure. C'étaient les
   six avertissements `rules-of-hooks` du dépôt, tous dans ce seul fichier.

   La coupure règle le problème sans acrobatie : le composant externe décide
   quoi afficher, le composant interne reçoit une formation qui existe, et tous
   ses hooks sont inconditionnels. */

export default function FormationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  /* Une formation publiée pendant la visite (`s-form-…`) vit dans la mémoire
     de session ; tant qu'elle n'est pas relue, on patiente au lieu d'afficher
     « introuvable ». */
  const { formations: published, hydrated } = useSession();
  const formation = isSessionId(id) ? published.find((f) => f.id === id) : resolveFormation(id);

  if (!formation && isSessionId(id) && !hydrated) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-[var(--text-muted)]">Chargement de la formation…</p>
      </div>
    );
  }

  if (!formation) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-[var(--text-muted)]">Formation introuvable.</p>
      </div>
    );
  }

  return <FormationDetail formation={formation} />;
}

function FormationDetail({ formation }: { formation: Formation }) {
  const { formatPrice } = useApp();

  const instructor = formation.instructor;
  const reviews = formationReviews(formation.id);
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
        {/* Back button : overlay sur l'image hero, variante "circle" pour
            rester lisible quelle que soit la photo de la formation. */}
        <div className="absolute top-4 left-4 z-10" style={{ paddingTop: "env(safe-area-inset-top)" }}>
          <BackButton fallbackHref="/formations" variant="circle" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-7xl mx-auto">
          <span className="inline-block px-3 py-1 bg-[var(--primary)] text-white text-xs font-medium rounded-full mb-3">{formation.category}</span>
          <h1 className="text-2xl md:text-4xl page-heading text-white mb-2">{formation.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
            <span>{LEVEL_LABELS[formation.level]}</span>
            <span>{formation.duration}</span>
            <span>{formation.studentCount} étudiants</span>
            <Stars rating={formation.rating} />
            <span className="text-[var(--primary)] font-bold text-lg">{formatPrice(formation.price)}</span>
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
        {/* Bannière de confiance si on arrive via un lien d'apporteur (?ref=) */}
        <div className="mb-6">
          <ReferralBanner kind="formation" id={formation.id} />
        </div>
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
                  <span className="font-medium text-[var(--primary)]">{progressPercent}%</span>
                </div>
                <div className="w-full h-3 bg-[var(--background)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--primary)] rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                </div>
                {allDone && (
                  <button onClick={() => setShowCertificate(true)} className="mt-3 px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--primary)] transition-colors">
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
                        <span className="w-8 h-8 flex items-center justify-center bg-[var(--primary)]/20 text-[var(--primary)] rounded-lg text-sm font-bold">{mi + 1}</span>
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
                          <div key={lesson.id} className={`flex items-center gap-3 px-4 py-3 hover:bg-[var(--hover-bg)] transition-colors ${playingLesson === lesson.id ? "bg-[var(--primary)]/10" : ""}`}>
                            {enrollState === "enrolled" ? (
                              <button onClick={() => toggleLesson(lesson.id)} className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors flex-shrink-0 ${completedLessons.has(lesson.id) ? "bg-[var(--primary)] border-[var(--primary)]" : "border-[var(--text-muted)]"}`}>
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
                <button
                  onClick={() => setPlayingLesson(null)}
                  aria-label="Fermer la vidéo"
                  className="absolute top-3 right-3 w-11 h-11 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 z-10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            )}

            {/* ── Reviews ───────────────────────────────────────────────── */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Avis des étudiants</h2>
              <div className="space-y-4">
                {reviews.length === 0 && (
                  <p className="text-sm text-[var(--text-muted)]">Aucun avis pour l'instant.</p>
                )}
                {reviews.map((review) => (
                  <div key={review.id} className="p-4 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={review.avatar} alt={review.author} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <Link href={`/profil/${review.authorId}`} className="font-medium text-sm hover:underline">{review.author}</Link>
                        <span className="block text-xs text-[var(--text-muted)]">{review.date}</span>
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
              <div className="text-3xl font-bold text-[var(--primary)]">{formatPrice(formation.price)}</div>
              {enrollState === "idle" && (
                <button onClick={handleEnroll} className="w-full py-3 bg-[var(--primary)] hover:bg-[var(--primary)] text-white rounded-xl font-medium transition-colors">
                  S&apos;inscrire à la formation
                </button>
              )}
              {enrollState === "loading" && (
                <button disabled className="w-full py-3 bg-[var(--primary)]/60 text-white rounded-xl font-medium flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Inscription en cours...
                </button>
              )}
              {enrollState === "enrolled" && (
                <button disabled className="w-full py-3 toast-success rounded-xl font-medium flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Inscrit
                </button>
              )}
              <RecommendButton
                kind="formation"
                id={formation.id}
                title={formation.title}
                image={formation.thumbnail}
                price={formation.price}
                currency={formation.currency}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--primary)]/40 text-[var(--primary)] text-sm font-medium hover:bg-[var(--primary)]/10 transition-colors"
              />
              <div className="space-y-3 text-sm text-[var(--text-secondary)]">
                <div className="flex justify-between"><span>Durée</span><span className="font-medium text-[var(--foreground)]">{formation.duration}</span></div>
                <div className="flex justify-between"><span>Modules</span><span className="font-medium text-[var(--foreground)]">{formation.modules.length}</span></div>
                <div className="flex justify-between"><span>Leçons</span><span className="font-medium text-[var(--foreground)]">{totalLessons}</span></div>
                <div className="flex justify-between"><span>Niveau</span><span className="font-medium text-[var(--foreground)]">{LEVEL_LABELS[formation.level]}</span></div>
                <div className="flex justify-between"><span>Étudiants</span><span className="font-medium text-[var(--foreground)]">{formation.studentCount}</span></div>
                <div className="flex justify-between"><span>Note</span><span className="font-medium text-[var(--primary)]">{formation.rating}/5</span></div>
              </div>
            </div>

            {/* Instructor Card */}
            <Link href={`/profil/${instructor.id}`} className="block p-5 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl hover:border-[var(--primary)]/40 transition-colors group">
              <div className="flex items-center gap-3 mb-3">
                <img src={instructor.avatar} alt={`${instructor.firstName} ${instructor.lastName}`} className="w-14 h-14 rounded-full object-cover" />
                <div>
                  <h3 className="font-semibold group-hover:text-[var(--primary)] transition-colors">{instructor.firstName} {instructor.lastName}</h3>
                  <span className="text-sm text-[var(--text-muted)]">Formateur</span>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-3">{instructor.bio}</p>
              <div className="flex gap-4 text-xs text-[var(--text-muted)]">
                <span>{instructor.stats.followers} abonnés</span>
                <span className="inline-flex items-center gap-0.5 text-[var(--primary)]">
                  <Star size={11} fill="currentColor" /> {instructor.stats.rating}
                </span>
              </div>
            </Link>

            {/* Similar formations */}
            <div>
              <h3 className="font-semibold mb-3">Formations similaires</h3>
              <div className="space-y-3">
                {similarFormations.map((s) => (
                  <Link key={s.id} href={`/formations/${s.id}`} className="flex gap-3 p-3 bg-[var(--card)] border border-[var(--card-border)] rounded-xl hover:border-[var(--primary)]/40 transition-colors group">
                    <img src={s.thumbnail} alt={s.title} className="w-20 h-14 rounded-lg object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium truncate group-hover:text-[var(--primary)] transition-colors">{s.title}</h4>
                      <p className="text-xs text-[var(--text-muted)]">{s.instructor.firstName} {s.instructor.lastName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-[var(--primary)]">{formatPrice(s.price)}</span>
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
            <div className="w-20 h-20 bg-[var(--primary)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Félicitations !</h2>
            <p className="text-[var(--text-secondary)] mb-4">Vous avez complété la formation <strong>&quot;{formation.title}&quot;</strong>. Votre certificat est prêt.</p>
            <div className="p-6 border-2 border-dashed border-[var(--primary)]/40 rounded-xl mb-6">
              <p className="text-xs text-[var(--text-muted)] mb-1">CERTIFICAT DE COMPLÉTION</p>
              <p className="text-lg font-bold text-[var(--primary)]">{formation.title}</p>
              <p className="text-sm text-[var(--text-secondary)] mt-2">Délivré le {new Date().toLocaleDateString("fr-CH")}</p>
              <p className="text-sm text-[var(--text-secondary)]">Formateur : {instructor.firstName} {instructor.lastName}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowCertificate(false)} className="flex-1 py-3 border border-[var(--card-border)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors">
                Fermer
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-[var(--primary)] hover:bg-[var(--primary)] text-white rounded-xl font-medium transition-colors"
              >
                Télécharger PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
