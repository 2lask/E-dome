"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { Award, BookOpen, Check, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { useFormation } from "@/components/formations/use-formation";
import { VideoPlaceholder } from "@/components/formations/video-placeholder";
import { formationsText } from "@/content/formations";
import { flatLessons } from "@/lib/demo/lessons";
import { recordSessionEvent } from "@/lib/use-session";

/* /formations/[id]/lecon/[n] — la liseuse (P6a).

   Les leçons sont celles de LA formation (ses modules, mis à plat). La
   progression se dérive du journal : « Marquer comme terminée » inscrit
   `lesson.marked`, et la barre, la liste et la fiche lisent la même
   dérivation. Pas de vidéo dans la maquette : un emplacement honnête. */

const T = formationsText.lesson;

export default function LeconPage({ params }: { params: Promise<{ id: string; n: string }> }) {
  const { id, n } = use(params);
  const lessonNum = Number.parseInt(n, 10);
  const { formation, loading, progress } = useFormation(id);
  const lessons = useMemo(() => (formation ? flatLessons(formation) : []), [formation]);
  const lesson = lessons[lessonNum - 1];

  if (loading) {
    return <p className="py-16 text-center text-[var(--text-muted)]">Chargement…</p>;
  }

  if (!formation || !progress || !lesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 mx-auto rounded-full bg-[var(--card)] text-[var(--text-muted)] flex items-center justify-center">
          <BookOpen size={32} strokeWidth={1.6} aria-hidden />
        </div>
        <h1 className="text-2xl page-heading text-[var(--foreground)]">{T.notFound}</h1>
        <p className="text-[var(--text-secondary)]">{T.notFoundBody}</p>
        <Link href={formation ? `/formations/${id}` : "/formations"} className="inline-block px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90 transition">
          {T.back}
        </Link>
      </div>
    );
  }

  const canRead = progress.enrolled || progress.isAuthor;
  const author = `${formation.instructor.firstName} ${formation.instructor.lastName}`;
  const isDone = progress.done.has(lesson.id);
  const total = lessons.length;

  if (!canRead) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-5 animate-fade-in">
        <div className="w-16 h-16 mx-auto rounded-full bg-[var(--card)] text-[var(--text-muted)] flex items-center justify-center">
          <Lock size={28} aria-hidden />
        </div>
        <h1 className="text-xl page-heading">{T.lockedTitle}</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          {formation.title} · {T.of(lesson.n, total)}
        </p>
        <Link href={`/formations/${id}`} className="inline-block px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90">
          {T.lockedCta}
        </Link>
      </div>
    );
  }

  const toggle = () => {
    if (progress.isAuthor) return;
    recordSessionEvent({ kind: "lesson.marked", data: { formationId: formation.id, lessonId: lesson.id, done: !isDone } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <Link href={`/formations/${id}`} className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] transition mb-6">
        <ChevronLeft size={16} aria-hidden /> {T.back}
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0 space-y-6">
          <VideoPlaceholder title={lesson.title} />

          <div className="space-y-1">
            <p className="text-xs text-[var(--text-muted)]">{T.module(lesson.moduleIndex + 1, lesson.moduleTitle)}</p>
            <h1 className="text-2xl page-heading text-[var(--foreground)]">
              {lesson.n}. {lesson.title}
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {formation.title} · {author} · {lesson.duration}
            </p>
          </div>

          {progress.enrolled && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
                <span>{T.of(lesson.n, total)}</span>
                <span className="tabular-nums">{progress.percent} %</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--card-border)]">
                <div className="h-2 rounded-full bg-[var(--primary)] transition-all duration-500" style={{ width: `${progress.percent}%` }} />
              </div>
            </div>
          )}

          <article className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] space-y-3">
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{T.summary(author, lesson.title, lesson.moduleTitle, formation.title)}</p>
            <h2 className="text-sm font-semibold">{T.keyPoints}</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-[var(--text-secondary)]">
              {T.keyPointsList(lesson.title).map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
            <p className="text-[11px] text-[var(--text-muted)]">{T.demoNote}</p>
          </article>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {lesson.n > 1 ? (
              <Link href={`/formations/${id}/lecon/${lesson.n - 1}`} className="inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-lg border border-[var(--card-border)] text-sm font-medium hover:bg-[var(--hover-bg)] transition">
                <ChevronLeft size={16} aria-hidden /> {T.previous}
              </Link>
            ) : null}

            {progress.enrolled && (
              <button
                type="button"
                onClick={toggle}
                aria-pressed={isDone}
                className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium transition ${
                  isDone ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25" : "bg-[var(--primary)] text-white hover:opacity-90"
                }`}
              >
                <Check size={14} strokeWidth={2.5} aria-hidden />
                {isDone ? T.done : T.markDone}
              </button>
            )}

            {lesson.n < total ? (
              <Link href={`/formations/${id}/lecon/${lesson.n + 1}`} className="inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-lg border border-[var(--primary)] text-[var(--primary)] text-sm font-medium hover:bg-[var(--primary)]/10 transition">
                {T.next} <ChevronRight size={16} aria-hidden />
              </Link>
            ) : progress.certificate ? (
              <Link href={`/formations/${id}/certificat`} className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90 transition">
                <Award size={15} aria-hidden /> {T.finish}
              </Link>
            ) : null}
          </div>
        </div>

        <aside className="lg:w-80 shrink-0">
          <div className="rounded-xl bg-[var(--card)] border border-[var(--card-border)] overflow-hidden">
            <div className="p-4 border-b border-[var(--card-border)] flex items-center justify-between">
              <h3 className="font-semibold text-sm">{T.sidebar}</h3>
              {progress.enrolled && <span className="text-xs text-[var(--text-muted)] tabular-nums">{progress.doneCount}/{total}</span>}
            </div>
            <ol className="divide-y divide-[var(--card-border)]">
              {lessons.map((l) => {
                const isCurrent = l.n === lesson.n;
                const done = progress.done.has(l.id);
                return (
                  <li key={l.id}>
                    <Link
                      href={`/formations/${id}/lecon/${l.n}`}
                      aria-current={isCurrent ? "page" : undefined}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-[var(--hover-bg)] ${isCurrent ? "bg-[var(--primary)]/10" : ""}`}
                    >
                      <span className="shrink-0 w-5 flex items-center justify-center">
                        {done ? <Check size={14} strokeWidth={2.5} className="text-emerald-500" aria-label="Terminée" /> : <span className="text-[var(--text-muted)] text-xs tabular-nums">{l.n}</span>}
                      </span>
                      <span className={isCurrent ? "text-[var(--primary)] font-medium" : done ? "text-[var(--text-secondary)]" : "text-[var(--foreground)]"}>{l.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
