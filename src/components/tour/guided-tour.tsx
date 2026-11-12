"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { Compass, PartyPopper } from "lucide-react";
import { tourPathById, tourUi, type TourStep } from "@/content/tour";
import { incarnate, useSession } from "@/lib/use-session";
import { TourOverlay } from "./tour-overlay";
import { TourLauncher } from "./tour-launcher";
import { useReducedMotion, useSpotlight } from "./use-spotlight";
import {
  hasSeenTour,
  markCompleted,
  markTourSeen,
  readCompleted,
  readProgress,
  writeProgress,
  type TourProgress,
} from "./tour-storage";

/* ── Le tutoriel guidé (chantier P5) ────────────────────────────────────────

   Monté une fois dans `app-shell`, donc vivant d'une route à l'autre : c'est
   ce qui permet à un parcours de traverser plusieurs pages. Il orchestre :

     · le LANCEUR (choix du parcours, reprise) — ouvert tout seul à la
       première visite, après l'hydratation, jamais au rendu serveur ;
     · l'ÉTAPE en cours — il incarne la bonne personne, ouvre la bonne route,
       allume le projecteur sur la cible, et écoute le geste attendu ;
     · le BOUTON permanent « Tutoriel », placé pour ne heurter ni le pied de
       la barre latérale, ni l'Expert IA, ni la barre mobile.

   La progression est mémorisée (`tour-storage`) : fermer au milieu propose
   ensuite « Reprendre là où vous en étiez ». Tout le texte vient de
   `content/tour.ts`. */

const AUTO_ADVANCE_MS = 1100;
const AUTO_LAUNCH_DELAY_MS = 700;

function keysFor(step: TourStep, done: boolean): string[] {
  const base = [step.target, ...(step.fallbackTargets ?? [])];
  return done && step.revealTarget ? [step.revealTarget, ...base] : base;
}

export function GuidedTour() {
  const router = useRouter();
  const pathname = usePathname();
  const { actorId } = useSession();
  const reduced = useReducedMotion();

  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<TourProgress | null>(null);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const [endedPath, setEndedPath] = useState<string | null>(null);
  const [awaitDone, setAwaitDone] = useState(false);

  const active = progress?.status === "active";
  const path = progress ? tourPathById(progress.pathId) : undefined;
  const stepIndex = path && progress ? Math.min(progress.step, path.steps.length - 1) : 0;
  const step = active && path ? path.steps[stepIndex] : undefined;
  const routeReady = !!step && pathname === step.route;

  /* ── Hydratation : lire la mémoire, ouvrir le lanceur la première fois ── */
  useEffect(() => {
    const stored = readProgress();
    const validStored = stored && tourPathById(stored.pathId) ? stored : null;
    /* eslint-disable react-hooks/set-state-in-effect -- lecture unique du stockage après hydratation */
    setProgress(validStored);
    setCompleted(readCompleted());
    setMounted(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    if (validStored?.status === "active" || hasSeenTour()) return;
    const t = setTimeout(() => {
      markTourSeen();
      setLauncherOpen(true);
    }, AUTO_LAUNCH_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const persist = useCallback((p: TourProgress | null) => {
    setProgress(p);
    writeProgress(p);
  }, []);

  /* Ouvrir la route et incarner la personne de l'étape `s`. */
  const bring = useCallback(
    (s: TourStep) => {
      if (s.persona && s.persona !== actorId) incarnate(s.persona);
      if (window.location.pathname !== s.route) router.push(s.route);
    },
    [actorId, router],
  );

  const goto = useCallback(
    (pathId: string, index: number) => {
      const p = tourPathById(pathId);
      if (!p) return;
      const i = Math.min(Math.max(index, 0), p.steps.length - 1);
      setAwaitDone(false);
      persist({ pathId, step: i, status: "active" });
      bring(p.steps[i]);
    },
    [bring, persist],
  );

  /* Reprise après rechargement d'une visite active : remettre la personne
     et la page de l'étape, une seule fois. */
  const restored = useRef(false);
  useEffect(() => {
    if (!mounted || restored.current) return;
    restored.current = true;
    if (step) bring(step);
  }, [mounted, step, bring]);

  const start = useCallback(
    (pathId: string, index: number) => {
      markTourSeen();
      setLauncherOpen(false);
      setEndedPath(null);
      goto(pathId, index);
    },
    [goto],
  );

  const close = useCallback(() => {
    markTourSeen();
    if (progress) persist({ ...progress, status: "paused" });
    setAwaitDone(false);
  }, [persist, progress]);

  const finish = useCallback(() => {
    if (!progress) return;
    setCompleted(markCompleted(progress.pathId));
    setEndedPath(progress.pathId);
    persist(null);
    setAwaitDone(false);
  }, [persist, progress]);

  const next = useCallback(() => {
    if (!progress || !path) return;
    if (stepIndex >= path.steps.length - 1) finish();
    else goto(progress.pathId, stepIndex + 1);
  }, [finish, goto, path, progress, stepIndex]);

  const prev = useCallback(() => {
    if (!progress) return;
    goto(progress.pathId, stepIndex - 1);
  }, [goto, progress, stepIndex]);

  /* ── Le geste attendu : un clic sur la cible ─────────────────────────── */
  const nextRef = useRef(next);
  useEffect(() => {
    nextRef.current = next;
  }, [next]);

  useEffect(() => {
    if (!step || step.await !== "click" || awaitDone) return;
    const selector = [step.target, ...(step.fallbackTargets ?? [])].map((k) => `[data-tour="${k}"]`).join(",");
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t || t.closest("[data-tour-ui]") || !t.closest(selector)) return;
      setAwaitDone(true);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [step, awaitDone]);

  useEffect(() => {
    if (!step || !awaitDone || step.autoAdvance === false) return;
    const t = setTimeout(() => nextRef.current(), AUTO_ADVANCE_MS);
    return () => clearTimeout(t);
  }, [step, awaitDone]);

  /* ── Le projecteur ───────────────────────────────────────────────────── */
  const keys = useMemo(() => (step ? keysFor(step, awaitDone) : null), [step, awaitDone]);
  const spot = useSpotlight({ keys, ready: routeReady });

  const resume = useMemo(() => {
    if (!progress || progress.status !== "paused") return null;
    const p = tourPathById(progress.pathId);
    return p ? { path: p, step: Math.min(progress.step, p.steps.length - 1) } : null;
  }, [progress]);

  const openLauncher = useCallback(() => {
    setEndedPath(null);
    setLauncherOpen(true);
  }, []);
  const closeLauncher = useCallback(() => {
    markTourSeen();
    setLauncherOpen(false);
  }, []);

  if (!mounted) return null;

  const isDashboard = pathname.startsWith("/dashboard");
  const showButton = !active && !launcherOpen && !endedPath;
  const ended = endedPath ? tourPathById(endedPath) : undefined;

  return (
    <>
      {showButton && (
        <button
          type="button"
          onClick={openLauncher}
          aria-label={tourUi.launchAria}
          data-tour="tour-launcher"
          data-testid="tour-launcher-button"
          className={
            "fixed z-40 inline-flex h-10 items-center gap-1.5 rounded-full border border-[var(--card-border)] bg-[var(--card)] px-3 text-[12.5px] font-medium text-[var(--foreground)] shadow-lg transition-colors hover:border-[var(--primary)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/50 " +
            /* Mobile : au-dessus de la barre du bas (64 px + zone sûre), à
               gauche — l'Expert IA est à droite. Bureau : aligné sur l'Expert
               IA, juste à droite de la barre latérale de 220 px. */
            "left-4 bottom-[calc(76px_+_env(safe-area-inset-bottom))] md:bottom-8 " +
            (isDashboard ? "md:left-6" : "md:left-[236px]")
          }
        >
          <Compass size={15} className="text-[var(--primary)]" aria-hidden />
          <span className="sm:hidden">{tourUi.launch}</span>
          <span className="hidden sm:inline">{tourUi.launchLong}</span>
        </button>
      )}

      {launcherOpen && (
        <TourLauncher resume={resume} completed={completed} reduced={reduced} onStart={start} onClose={closeLauncher} />
      )}

      {step && path && (
        <TourOverlay
          step={step}
          index={stepIndex}
          total={path.steps.length}
          phase={spot.phase}
          rect={spot.rect}
          routePending={!routeReady}
          awaitDone={awaitDone}
          mobile={spot.mobile}
          reduced={reduced}
          onPrev={prev}
          onNext={next}
          onClose={close}
          onGoToRoute={() => bring(step)}
        />
      )}

      {ended && <TourEnd title={ended.title} reduced={reduced} onOther={openLauncher} onClose={() => setEndedPath(null)} />}
    </>
  );
}

/* ── Fin de parcours ────────────────────────────────────────────────────── */

function TourEnd({ title, reduced, onOther, onClose }: { title: string; reduced: boolean; onOther: () => void; onClose: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div data-tour-ui className="fixed inset-0 z-[96] flex items-end justify-center sm:items-center sm:p-4">
      <div aria-hidden className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-end-title"
        className={`relative w-full rounded-t-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 text-center text-[var(--foreground)] shadow-2xl sm:max-w-sm sm:rounded-2xl ${reduced ? "" : "animate-slide-in-bottom"}`}
        style={{ paddingBottom: "calc(20px + env(safe-area-inset-bottom))" }}
      >
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
          <PartyPopper size={20} aria-hidden />
        </span>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">{title}</p>
        <h2 id="tour-end-title" className="mt-0.5 text-lg font-bold">
          {tourUi.endTitle}
        </h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-secondary)]">{tourUi.endBody}</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            ref={ref}
            type="button"
            onClick={onOther}
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-[13px] font-semibold text-[var(--primary-foreground)] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/50"
          >
            {tourUi.endOther}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--card-border)] px-4 py-2 text-[13px] font-medium hover:border-[var(--primary)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/50"
          >
            {tourUi.endClose}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
