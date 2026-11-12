"use client";

import { useState, use, useMemo } from "react";
import Link from "next/link";
import { Award, Check, Circle, Lock, MessageCircle, Play, Star } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";
import { useApp } from "@/lib/context";
import { getSimilarFormations, mockReviews } from "@/lib/mock-data";
import { frDate } from "@/lib/demo/showcase";
import type { Formation } from "@/lib/types";
import { RecommendButton } from "@/components/affiliate/recommend-button";
import { ReferralBanner } from "@/components/affiliate/referral-banner";
import { EnrolPanel } from "@/components/formations/enrol-panel";
import { useFormation } from "@/components/formations/use-formation";
import { Stars } from "@/components/services/stars";
import { formationsText } from "@/content/formations";
import { flatLessons, sessionEnrolmentCount, type FormationProgress } from "@/lib/demo/lessons";
import { useSession } from "@/lib/use-session";

/* /formations/[id] — la fiche d'une formation (P6a).

   · Les leçons sont CELLES de la formation (ses modules), chacune ouvre la
     liseuse `/formations/[id]/lecon/[n]`.
   · L'inscription passe par l'étape de paiement (`MoneyFlow` → `quote()`)
     et laisse `formation.enrolled` au journal, au nom de la personne incarnée.
   · La progression se dérive des leçons cochées (`lib/demo/lessons.ts`) ;
     le certificat n'existe qu'à 100 %.
   · Plus de vidéo YouTube sans rapport, plus de lien externe de prise de
     rendez-vous : une question se pose par la messagerie. */

const T = formationsText.detail;
const LEVEL_LABELS: Record<string, string> = { debutant: "Débutant", intermediaire: "Intermédiaire", avance: "Avancé" };

/* Les avis viennent de `mockReviews` : chacun est écrit par une personne de
   l'annuaire qui a RÉELLEMENT suivi la formation (invariant 18). */
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

export default function FormationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { formation, loading, progress } = useFormation(id);

  if (!formation || !progress) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[50vh]">
        <p className="text-[var(--text-muted)]">{loading ? "Chargement de la formation…" : "Formation introuvable."}</p>
        {!loading && (
          <Link href="/formations" className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-sm font-medium">
            Toutes les formations
          </Link>
        )}
      </div>
    );
  }

  return <FormationDetail formation={formation} progress={progress} />;
}

function FormationDetail({ formation, progress }: { formation: Formation; progress: FormationProgress }) {
  const { formatPrice } = useApp();
  const { state } = useSession();
  const instructor = formation.instructor;
  const reviews = formationReviews(formation.id);
  const similarFormations = getSimilarFormations(formation);
  const lessons = useMemo(() => flatLessons(formation), [formation]);
  const students = formation.studentCount + sessionEnrolmentCount(state, formation);
  const [openModules, setOpenModules] = useState<Set<number>>(new Set([0]));
  const [justEnrolled, setJustEnrolled] = useState(false);

  const canRead = progress.enrolled || progress.isAuthor;
  const nextLesson = lessons.find((l) => !progress.done.has(l.id)) ?? lessons[0];

  const toggleModule = (i: number) =>
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={formation.thumbnail} alt="" className="w-full h-72 md:h-96 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute top-4 left-4 z-10" style={{ paddingTop: "env(safe-area-inset-top)" }}>
          <BackButton fallbackHref="/formations" variant="circle" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-7xl mx-auto">
          <span className="inline-block px-3 py-1 bg-[var(--primary)] text-white text-xs font-medium rounded-full mb-3">{formation.category}</span>
          <h1 className="text-2xl md:text-4xl page-heading text-white mb-2">{formation.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/85 text-sm">
            <span>{LEVEL_LABELS[formation.level]}</span>
            <span>{formation.duration}</span>
            <span>{T.students(students)}</span>
            {formation.rating > 0 ? (
              <span className="inline-flex items-center gap-1.5">
                <Stars rating={formation.rating} /> {formation.rating.toFixed(1)}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs">{T.newBadge}</span>
            )}
            <span className="font-bold text-lg text-white">{formatPrice(formation.price)}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <ReferralBanner kind="formation" id={formation.id} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3">{T.about}</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">{formation.description}</p>
            </section>

            {progress.enrolled && (
              <div className="p-4 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">{T.progress} · {T.lessonsDone(progress.doneCount, progress.total)}</span>
                  <span className="font-medium text-[var(--primary)] tabular-nums">{progress.percent} %</span>
                </div>
                <div className="w-full h-3 bg-[var(--background)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--primary)] rounded-full transition-all duration-500" style={{ width: `${progress.percent}%` }} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {progress.certificate ? (
                    <>
                      <Link href={`/formations/${formation.id}/certificat`} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">
                        <Award size={15} aria-hidden /> {T.certificate}
                      </Link>
                      <Link href={`/formations/${formation.id}/lecon/1`} className="px-4 py-2 border border-[var(--card-border)] rounded-lg text-sm hover:bg-[var(--hover-bg)]">
                        {T.review}
                      </Link>
                    </>
                  ) : nextLesson ? (
                    <Link href={`/formations/${formation.id}/lecon/${nextLesson.n}`} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">
                      <Play size={14} aria-hidden /> {progress.doneCount === 0 ? T.start : T.resume(nextLesson.n)}
                    </Link>
                  ) : null}
                </div>
              </div>
            )}

            <section>
              <h2 className="text-xl font-semibold mb-1">{T.content}</h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                {progress.isAuthor ? T.own : !progress.enrolled ? T.locked : T.lessons(lessons.length)}
              </p>
              <div className="space-y-3">
                {formation.modules.map((mod, mi) => (
                  <div key={mod.id} className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl overflow-hidden">
                    <button onClick={() => toggleModule(mi)} aria-expanded={openModules.has(mi)} className="w-full flex items-center justify-between p-4 hover:bg-[var(--hover-bg)] transition-colors">
                      <div className="flex items-center gap-3 text-left">
                        <span className="w-8 h-8 flex items-center justify-center bg-[var(--primary)]/20 text-[var(--primary)] rounded-lg text-sm font-bold">{mi + 1}</span>
                        <div>
                          <h3 className="font-medium">{mod.title}</h3>
                          <span className="text-xs text-[var(--text-muted)]">{T.lessons(mod.lessons.length)}</span>
                        </div>
                      </div>
                      <svg className={`w-5 h-5 text-[var(--text-muted)] transition-transform ${openModules.has(mi) ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openModules.has(mi) && (
                      <ul className="border-t border-[var(--card-border)]">
                        {lessons
                          .filter((l) => l.moduleIndex === mi)
                          .map((lesson) => {
                            const done = progress.done.has(lesson.id);
                            const row = (
                              <>
                                <span className="w-5 flex justify-center shrink-0">
                                  {!canRead ? (
                                    <Lock size={14} className="text-[var(--text-muted)]" aria-hidden />
                                  ) : done ? (
                                    <Check size={15} strokeWidth={2.5} className="text-emerald-500" aria-label="Terminée" />
                                  ) : (
                                    <Circle size={14} className="text-[var(--text-muted)]" aria-hidden />
                                  )}
                                </span>
                                <span className={`flex-1 text-sm ${done ? "text-[var(--text-secondary)]" : "text-[var(--foreground)]"}`}>
                                  {lesson.n}. {lesson.title}
                                </span>
                                <span className="text-xs text-[var(--text-muted)]">{lesson.duration}</span>
                              </>
                            );
                            return (
                              <li key={lesson.id}>
                                {canRead ? (
                                  <Link href={`/formations/${formation.id}/lecon/${lesson.n}`} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--hover-bg)] transition-colors">
                                    {row}
                                  </Link>
                                ) : (
                                  <div className="flex items-center gap-3 px-4 py-3">{row}</div>
                                )}
                              </li>
                            );
                          })}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">{T.reviews}</h2>
              <div className="space-y-4">
                {reviews.length === 0 && <p className="text-sm text-[var(--text-muted)]">{T.noReviews}</p>}
                {reviews.map((review) => (
                  <div key={review.id} className="p-4 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={review.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <Link href={`/profil/${review.authorId}`} className="font-medium text-sm hover:underline">{review.author}</Link>
                        <span className="block text-xs text-[var(--text-muted)]">{review.date}</span>
                      </div>
                      <div className="ml-auto"><Stars rating={review.rating} size={16} /></div>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">{review.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="lg:sticky lg:top-4 p-6 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl space-y-4">
              <div className="text-3xl font-bold text-[var(--primary)]">{formatPrice(formation.price)}</div>
              {progress.isAuthor ? (
                <Link href={`/formations/${formation.id}/lecon/1`} className="block w-full py-3 text-center rounded-xl border border-[var(--card-border)] font-medium hover:bg-[var(--hover-bg)]">
                  {T.preview}
                </Link>
              ) : progress.enrolled ? (
                <div className="space-y-2">
                  <p className="w-full py-3 toast-success rounded-xl font-medium flex items-center justify-center gap-2">
                    <Check size={18} aria-hidden /> {T.enrolled}
                  </p>
                  {justEnrolled && <p className="text-xs text-center text-[var(--text-secondary)]" role="status">{T.toastEnrolled}</p>}
                </div>
              ) : (
                <EnrolPanel formation={formation} onEnrolled={() => setJustEnrolled(true)} />
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
                <div className="flex justify-between"><span>{T.duration}</span><span className="font-medium text-[var(--foreground)]">{formation.duration}</span></div>
                <div className="flex justify-between"><span>{T.modules}</span><span className="font-medium text-[var(--foreground)]">{formation.modules.length}</span></div>
                <div className="flex justify-between"><span>{T.lessonCount}</span><span className="font-medium text-[var(--foreground)]">{lessons.length}</span></div>
                <div className="flex justify-between"><span>{T.level}</span><span className="font-medium text-[var(--foreground)]">{LEVEL_LABELS[formation.level]}</span></div>
                <div className="flex justify-between"><span>{T.studentsLabel}</span><span className="font-medium text-[var(--foreground)]">{students}</span></div>
                <div className="flex justify-between">
                  <span>{T.rating}</span>
                  <span className="font-medium text-[var(--primary)]">{formation.rating > 0 ? `${formation.rating.toFixed(1)}/5 (${reviews.length})` : T.newBadge}</span>
                </div>
              </div>
            </div>

            <Link href={`/profil/${instructor.id}`} className="block p-5 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl hover:border-[var(--primary)]/40 transition-colors group">
              <div className="flex items-center gap-3 mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={instructor.avatar} alt="" className="w-14 h-14 rounded-full object-cover" />
                <div>
                  <h3 className="font-semibold group-hover:text-[var(--primary)] transition-colors">{instructor.firstName} {instructor.lastName}</h3>
                  <span className="text-sm text-[var(--text-muted)]">{T.instructor}</span>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-3">{instructor.bio}</p>
              <div className="flex gap-4 text-xs text-[var(--text-muted)]">
                <span>{instructor.stats.followers} abonnés</span>
                {instructor.stats.reviews > 0 && (
                  <span className="inline-flex items-center gap-0.5 text-[var(--primary)]">
                    <Star size={11} fill="currentColor" aria-hidden /> {instructor.stats.rating.toFixed(1)} ({instructor.stats.reviews} avis)
                  </span>
                )}
              </div>
            </Link>

            {!progress.isAuthor && (
              <div className="p-5 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl space-y-2">
                <h3 className="font-semibold">{T.askTitle(instructor.firstName)}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{T.askBody}</p>
                <Link href={`/messages?to=${instructor.id}`} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--card-border)] text-sm hover:bg-[var(--hover-bg)]">
                  <MessageCircle size={14} aria-hidden /> {T.askCta}
                </Link>
              </div>
            )}

            {similarFormations.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">{T.similar}</h3>
                <div className="space-y-3">
                  {similarFormations.map((s) => (
                    <Link key={s.id} href={`/formations/${s.id}`} className="flex gap-3 p-3 bg-[var(--card)] border border-[var(--card-border)] rounded-xl hover:border-[var(--primary)]/40 transition-colors group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.thumbnail} alt="" className="w-20 h-14 rounded-lg object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <h4 className="text-sm font-medium truncate group-hover:text-[var(--primary)] transition-colors">{s.title}</h4>
                        <p className="text-xs text-[var(--text-muted)]">{s.instructor.firstName} {s.instructor.lastName}</p>
                        <span className="text-sm font-bold text-[var(--primary)]">{formatPrice(s.price)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
