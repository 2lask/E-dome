"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Building2, Check, ChevronRight, Compass, Handshake, Home, Plane, RotateCcw, X, type LucideIcon } from "lucide-react";
import { TOUR_PATHS, tourUi, type TourIcon, type TourPath } from "@/content/tour";
import { personById } from "@/lib/demo/directory";
import { trapTab } from "./focus-trap";

/* ── Le lanceur : choisir un parcours ───────────────────────────────────────

   Une feuille (en bas sur mobile, centrée sur ordinateur). En tête, si un
   parcours a été interrompu, « Reprendre là où vous en étiez ». Puis les
   parcours, chacun avec sa durée, son nombre d'étapes et la personne dont on
   prend la place. Échap ou « Plus tard » ferment ; le focus reste dans la
   feuille tant qu'elle est ouverte. */

const ICONS: Record<TourIcon, LucideIcon> = {
  compass: Compass,
  home: Home,
  building: Building2,
  handshake: Handshake,
  plane: Plane,
};

interface Props {
  resume: { path: TourPath; step: number } | null;
  completed: readonly string[];
  reduced: boolean;
  onStart: (pathId: string, step: number) => void;
  onClose: () => void;
}

export function TourLauncher({ resume, completed, reduced, onStart, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    firstRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else trapTab(e, panelRef.current);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  return createPortal(
    <div data-tour-ui className="fixed inset-0 z-[96] flex items-end justify-center sm:items-center sm:p-4">
      <div aria-hidden className={`absolute inset-0 bg-black/55 ${reduced ? "" : "animate-fade-in"}`} onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-launcher-title"
        data-testid="tour-launcher"
        className={
          "relative max-h-[88vh] w-full overflow-y-auto rounded-t-2xl border border-[var(--card-border)] bg-[var(--card)] px-4 pt-4 text-[var(--foreground)] shadow-2xl sm:max-w-lg sm:rounded-2xl sm:p-5 " +
          (reduced ? "" : "animate-slide-in-bottom")
        }
        style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
            <Compass size={18} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">{tourUi.sheetEyebrow}</p>
            <h2 id="tour-launcher-title" className="text-lg font-bold leading-tight">
              {tourUi.sheetTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={tourUi.sheetClose}
            className="rounded-md p-1 text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/50"
          >
            <X size={17} />
          </button>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-secondary)]">{tourUi.sheetIntro}</p>

        {resume && (
          <div className="mt-4 rounded-xl border border-[var(--primary)]/35 bg-[var(--primary)]/[0.06] p-3">
            <p className="text-[13px] font-semibold">{tourUi.resumeTitle}</p>
            <p className="mt-0.5 text-[12px] text-[var(--text-muted)]">
              {tourUi.resumeLine(resume.path.title, resume.step + 1, resume.path.steps.length)}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <button
                ref={firstRef}
                type="button"
                onClick={() => onStart(resume.path.id, resume.step)}
                className="inline-flex items-center gap-1 rounded-lg bg-[var(--primary)] px-3.5 py-1.5 text-[12.5px] font-semibold text-[var(--primary-foreground)] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/50"
              >
                {tourUi.resumeCta}
                <ChevronRight size={14} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => onStart(resume.path.id, 0)}
                className="inline-flex items-center gap-1 rounded-lg border border-[var(--card-border)] px-3 py-1.5 text-[12.5px] font-medium hover:border-[var(--primary)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/50"
              >
                <RotateCcw size={13} aria-hidden />
                {tourUi.restart}
              </button>
            </div>
          </div>
        )}

        <ul className="mt-4 space-y-2">
          {TOUR_PATHS.map((path, i) => {
            const Icon = ICONS[path.icon];
            const person = path.persona ? personById(path.persona) : undefined;
            const done = completed.includes(path.id);
            return (
              <li key={path.id}>
                <button
                  ref={!resume && i === 0 ? firstRef : undefined}
                  type="button"
                  onClick={() => onStart(path.id, 0)}
                  data-testid={`tour-path-${path.id}`}
                  className="group flex w-full items-start gap-3 rounded-xl border border-[var(--card-border)] p-3 text-left transition-colors hover:border-[var(--primary)]/45 hover:bg-[var(--hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/50"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                    <Icon size={17} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold leading-tight">{path.title}</span>
                      {done && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/12 px-1.5 py-0.5 text-[10.5px] font-semibold text-emerald-700 dark:text-emerald-300">
                          <Check size={11} aria-hidden />
                          {tourUi.completed}
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-[12px] leading-snug text-[var(--text-muted)]">{path.tagline}</span>
                    <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[var(--text-muted)]">
                      <span>{tourUi.minutes(path.minutes)}</span>
                      <span aria-hidden>·</span>
                      <span>{tourUi.steps(path.steps.length)}</span>
                      {person && path.personaLabel && (
                        <>
                          <span aria-hidden>·</span>
                          <span className="inline-flex items-center gap-1">
                            {/* eslint-disable-next-line @next/next/no-img-element -- avatar de 16 px, comme le reste de l'app */}
                            <img src={person.avatar} alt="" className="h-4 w-4 rounded-full object-cover" />
                            {tourUi.asPersona(path.personaLabel)}
                          </span>
                        </>
                      )}
                    </span>
                  </span>
                  <ChevronRight size={16} className="mt-2.5 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5" aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11.5px] text-[var(--text-muted)]">{tourUi.sheetHint}</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-[12.5px] font-medium text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/50"
          >
            {tourUi.sheetLater}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
