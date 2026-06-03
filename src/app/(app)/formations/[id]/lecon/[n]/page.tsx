"use client";

import { use, useState } from "react";
import Link from "next/link";
import { BookOpen, Check } from "lucide-react";
import { getFormationById } from "@/lib/mock-data";

/* ─── Constants ──────────────────────────────────────────────────────────── */

const TOTAL_LESSONS = 12;
const YOUTUBE_ID = "E0dyHPjiJDo";

const LESSON_TITLES = [
  "Introduction et objectifs",
  "Les fondamentaux du marche",
  "Analyse de la demande",
  "Strategies de pricing",
  "Aspects juridiques",
  "Financement et fiscalite",
  "Marketing immobilier",
  "Negociation avancee",
  "Gestion locative",
  "Optimisation des rendements",
  "Etudes de cas pratiques",
  "Examen et certification",
];

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function LeconPage({ params }: { params: Promise<{ id: string; n: string }> }) {
  const { id, n } = use(params);
  const lessonNum = parseInt(n, 10);
  const formation = getFormationById(id);

  // Track completed lessons
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(() => {
    const set = new Set<number>();
    // Mark first 2 lessons as done for demo
    if (lessonNum > 2) {
      set.add(1);
      set.add(2);
    } else if (lessonNum > 1) {
      set.add(1);
    }
    return set;
  });

  const isCompleted = completedLessons.has(lessonNum);
  const completedCount = completedLessons.size + (isCompleted ? 0 : 0);
  const progressPercent = Math.round((completedCount / TOTAL_LESSONS) * 100);

  const toggleComplete = () => {
    setCompletedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(lessonNum)) {
        next.delete(lessonNum);
      } else {
        next.add(lessonNum);
      }
      return next;
    });
  };

  if (!formation || isNaN(lessonNum) || lessonNum < 1 || lessonNum > TOTAL_LESSONS) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 mx-auto rounded-full bg-[var(--card)] text-[var(--text-muted)] flex items-center justify-center">
          <BookOpen size={32} strokeWidth={1.6} />
        </div>
        <h1 className="text-2xl page-heading text-[var(--foreground)]">Lecon introuvable</h1>
        <p className="text-[var(--text-secondary)]">Cette lecon n&apos;existe pas.</p>
        <Link
          href={`/formations/${id}`}
          className="inline-block px-5 py-2.5 rounded-lg bg-[#1e9df1] text-white text-sm font-medium hover:opacity-90 transition"
        >
          Retour à la formation
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Back link */}
      <Link
        href={`/formations/${id}`}
        className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] transition mb-6"
      >
        &larr; Retour à la formation
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 space-y-6">
          {/* YouTube Embed */}
          <div className="rounded-xl overflow-hidden bg-gray-900">
            <iframe
              className="w-full aspect-video"
              src={`https://www.youtube.com/embed/${YOUTUBE_ID}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`Lecon ${lessonNum}`}
            />
          </div>

          {/* Lesson title */}
          <div className="space-y-2">
            <h1 className="text-2xl page-heading text-[var(--foreground)]">
              Lecon {lessonNum} : {LESSON_TITLES[lessonNum - 1]}
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">{formation.title}</p>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-secondary)]">
                Lecon {lessonNum}/{TOTAL_LESSONS} &middot; {progressPercent}% complete
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[var(--input-bg)]">
              <div
                className="h-2 rounded-full bg-[#1e9df1] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {lessonNum > 1 ? (
              <Link
                href={`/formations/${id}/lecon/${lessonNum - 1}`}
                className="px-4 py-2.5 rounded-lg border border-[var(--card-border)] text-[var(--foreground)] text-sm font-medium hover:bg-[var(--hover-bg)] transition text-center"
              >
                &larr; Precedente
              </Link>
            ) : (
              <span className="px-4 py-2.5 rounded-lg border border-[var(--card-border)] text-[var(--text-muted)] text-sm font-medium opacity-50 cursor-not-allowed text-center">
                &larr; Precedente
              </span>
            )}

            <button
              onClick={toggleComplete}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium transition text-center ${
                isCompleted
                  ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                  : "bg-[#1e9df1] text-white hover:opacity-90"
              }`}
            >
              <Check size={14} strokeWidth={2.5} />
              {isCompleted ? "Terminee" : "Marquer comme terminee"}
            </button>

            {lessonNum < TOTAL_LESSONS ? (
              <Link
                href={`/formations/${id}/lecon/${lessonNum + 1}`}
                className="px-4 py-2.5 rounded-lg border border-[#1e9df1] text-[#1e9df1] text-sm font-medium hover:bg-[#1e9df1]/10 transition text-center"
              >
                Suivante &rarr;
              </Link>
            ) : (
              <span className="px-4 py-2.5 rounded-lg border border-[var(--card-border)] text-[var(--text-muted)] text-sm font-medium opacity-50 cursor-not-allowed text-center">
                Suivante &rarr;
              </span>
            )}
          </div>
        </div>

        {/* Sidebar — lesson list (desktop) */}
        <aside className="lg:w-72 shrink-0">
          <div className="rounded-xl bg-[var(--card)] border border-[var(--card-border)] overflow-hidden">
            <div className="p-4 border-b border-[var(--card-border)]">
              <h3 className="font-semibold text-[var(--foreground)] text-sm">Contenu de la formation</h3>
            </div>
            <div className="divide-y divide-[var(--card-border)]">
              {LESSON_TITLES.map((title, idx) => {
                const num = idx + 1;
                const isCurrent = num === lessonNum;
                const isDone = completedLessons.has(num);

                return (
                  <Link
                    key={num}
                    href={`/formations/${id}/lecon/${num}`}
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-[var(--hover-bg)] ${
                      isCurrent ? "bg-[#1e9df1]/10" : ""
                    }`}
                  >
                    <span className="shrink-0 w-5 flex items-center justify-center">
                      {isDone ? (
                        <Check size={14} strokeWidth={2.5} className="text-green-500" />
                      ) : isCurrent ? (
                        <span className="text-[#1e9df1]">&rarr;</span>
                      ) : (
                        <span className="text-[var(--text-muted)]">○</span>
                      )}
                    </span>
                    <span
                      className={`${
                        isCurrent
                          ? "text-[#1e9df1] font-medium"
                          : isDone
                          ? "text-[var(--text-secondary)]"
                          : "text-[var(--foreground)]"
                      }`}
                    >
                      {num}. {title}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
