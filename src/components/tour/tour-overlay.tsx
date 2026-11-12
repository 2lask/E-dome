"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, Check, Compass, Hand, Info, X } from "lucide-react";
import { tourUi, type TourPlacement, type TourStep } from "@/content/tour";
import type { SpotPhase, SpotRect } from "./use-spotlight";
import { trapTab } from "./focus-trap";

/* ── L'overlay du tutoriel : le trou de lumière et la carte d'étape ─────────

   Le voile est une ombre portée géante autour d'un « trou » (le rectangle de
   la cible, un peu agrandi) : tout s'assombrit sauf l'élément éclairé. Le trou
   laisse passer les clics — c'est ce qui permet aux étapes d'attendre un vrai
   geste. Autour, quatre bandes transparentes bloquent les clics ailleurs, pour
   qu'on ne parte pas par erreur au milieu d'une étape.

   La carte se place à côté du trou (préférence de l'étape, puis bas, haut,
   droite, gauche — la première qui tient dans l'écran). Sous 640 px, elle
   devient une feuille ancrée en bas. Sans cible (repli), elle se centre. */

const PAD = 6;
const GAP = 14;
const MARGIN = 12;

interface Props {
  step: TourStep;
  index: number;
  total: number;
  phase: SpotPhase;
  rect: SpotRect | null;
  /** La bonne route n'est pas (encore) affichée. */
  routePending: boolean;
  awaitDone: boolean;
  mobile: boolean;
  reduced: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  onGoToRoute: () => void;
}

interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
}

function holeOf(rect: SpotRect, vw: number, vh: number): Box {
  const top = Math.max(0, rect.top - PAD);
  const left = Math.max(0, rect.left - PAD);
  const bottom = Math.min(vh, rect.top + rect.height + PAD);
  const right = Math.min(vw, rect.left + rect.width + PAD);
  return { top, left, width: Math.max(0, right - left), height: Math.max(0, bottom - top) };
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function placeCard(
  hole: Box | null,
  w: number,
  h: number,
  vw: number,
  vh: number,
  pref: TourPlacement | undefined,
): { top: number; left: number } {
  if (!hole || hole.height < 1) return { top: Math.max(MARGIN, (vh - h) / 2), left: Math.max(MARGIN, (vw - w) / 2) };
  const cx = hole.left + hole.width / 2;
  const cy = hole.top + hole.height / 2;
  const order = Array.from(new Set<TourPlacement>([pref ?? "bottom", "bottom", "top", "right", "left"]));
  for (const p of order) {
    if (p === "bottom" && hole.top + hole.height + GAP + h <= vh - MARGIN)
      return { top: hole.top + hole.height + GAP, left: clamp(cx - w / 2, MARGIN, vw - w - MARGIN) };
    if (p === "top" && hole.top - GAP - h >= MARGIN)
      return { top: hole.top - GAP - h, left: clamp(cx - w / 2, MARGIN, vw - w - MARGIN) };
    if (p === "right" && hole.left + hole.width + GAP + w <= vw - MARGIN)
      return { top: clamp(cy - h / 2, MARGIN, vh - h - MARGIN), left: hole.left + hole.width + GAP };
    if (p === "left" && hole.left - GAP - w >= MARGIN)
      return { top: clamp(cy - h / 2, MARGIN, vh - h - MARGIN), left: hole.left - GAP - w };
  }
  /* Rien ne tient (cible immense) : coin bas droit, par-dessus. */
  return { top: Math.max(MARGIN, vh - h - MARGIN), left: Math.max(MARGIN, vw - w - MARGIN) };
}

function useViewport() {
  const [vp, setVp] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const read = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);
  return vp;
}

export function TourOverlay({
  step,
  index,
  total,
  phase,
  rect,
  routePending,
  awaitDone,
  mobile,
  reduced,
  onPrev,
  onNext,
  onClose,
  onGoToRoute,
}: Props) {
  const vp = useViewport();
  const cardRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [size, setSize] = useState({ w: 360, h: 240 });

  /* Taille réelle de la carte, pour la placer sans déborder. */
  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const read = () => {
      const r = el.getBoundingClientRect();
      setSize((s) => (Math.round(s.w) === Math.round(r.width) && Math.round(s.h) === Math.round(r.height) ? s : { w: r.width, h: r.height }));
    };
    read();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [mobile]);

  /* Le focus entre dans la carte à chaque étape. */
  useEffect(() => {
    cardRef.current?.focus({ preventScroll: true });
  }, [index, step.id]);

  /* Geste fait : le bouton « Suivant » prend le focus. */
  useEffect(() => {
    if (awaitDone) nextRef.current?.focus({ preventScroll: true });
  }, [awaitDone]);

  /* Tab hors de la carte (après un clic sur le voile, par exemple) : on y
     revient. Échap ferme — seulement une vraie touche, pas un événement
     synthétique. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && e.isTrusted) {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const active = document.activeElement;
        const card = cardRef.current;
        if (!card) return;
        if (!active || active === document.body || card.contains(active) || (active as HTMLElement).dataset?.tourBlocker) {
          trapTab(e, card);
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (vp.w === 0) return null;

  const hole = phase === "found" && rect ? holeOf(rect, vp.w, vp.h) : null;
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const waiting = !!step.await && !awaitDone;
  const showFallback = phase === "fallback";
  const progress = ((index + 1) / total) * 100;

  const cardW = Math.min(380, vp.w - 2 * MARGIN);
  const pos = placeCard(hole, cardW, size.h, vp.w, vp.h, step.placement);
  const motion = reduced ? "" : "transition-[top,left,width,height,transform,opacity] duration-300 ease-out";

  const cardStyle: React.CSSProperties = mobile
    ? { left: 0, right: 0, bottom: 0, paddingBottom: "calc(14px + env(safe-area-inset-bottom))" }
    : { top: pos.top, left: pos.left, width: cardW };

  const announce = `${tourUi.stepOf(index + 1, total)}. ${step.title}. ${step.body}${waiting ? ` ${step.awaitHint ?? tourUi.defaultAwaitHint}` : ""}`;

  return createPortal(
    <div data-tour-ui className="pointer-events-none fixed inset-0 z-[95]">
      {/* Le voile et le trou */}
      {hole ? (
        <>
          <div
            aria-hidden
            className={`absolute rounded-xl ${motion}`}
            style={{
              top: hole.top,
              left: hole.left,
              width: hole.width,
              height: hole.height,
              boxShadow: "0 0 0 2px var(--primary), 0 0 0 9999px rgba(6, 8, 14, 0.58)",
            }}
          />
          {/* Les quatre bandes qui bloquent les clics hors du trou */}
          {[
            { top: 0, left: 0, width: vp.w, height: hole.top },
            { top: hole.top + hole.height, left: 0, width: vp.w, height: Math.max(0, vp.h - hole.top - hole.height) },
            { top: hole.top, left: 0, width: hole.left, height: hole.height },
            { top: hole.top, left: hole.left + hole.width, width: Math.max(0, vp.w - hole.left - hole.width), height: hole.height },
          ].map((b, i) => (
            <div key={i} aria-hidden data-tour-blocker="1" className="pointer-events-auto absolute" style={b} />
          ))}
        </>
      ) : (
        <div aria-hidden data-tour-blocker="1" className={`pointer-events-auto absolute inset-0 bg-[rgba(6,8,14,0.58)] ${reduced ? "" : "animate-fade-in"}`} />
      )}

      {/* Annonce pour les lecteurs d'écran */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announce}
      </div>

      {/* La carte d'étape */}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-step-title"
        aria-describedby="tour-step-body"
        tabIndex={-1}
        onKeyDown={(e) => trapTab(e, cardRef.current)}
        className={
          "pointer-events-auto absolute border border-[var(--card-border)] bg-[var(--card)] text-[var(--foreground)] shadow-2xl outline-none " +
          (mobile ? "max-h-[52vh] overflow-y-auto rounded-t-2xl px-4 pt-3" : `rounded-2xl p-4 ${motion}`)
        }
        style={cardStyle}
      >
        {mobile && <div aria-hidden className="mx-auto mb-2 h-1 w-10 rounded-full bg-[var(--card-border)]" />}

        {/* En-tête : compteur, progression, fermer */}
        <div className="flex items-center gap-2">
          <Compass size={15} className="shrink-0 text-[var(--primary)]" aria-hidden />
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            {tourUi.stepOf(index + 1, total)}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={tourUi.close}
            className="ml-auto rounded-md p-1 text-[var(--text-muted)] transition-colors hover:bg-[var(--hover-bg)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/50"
          >
            <X size={16} />
          </button>
        </div>
        <div
          className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[var(--card-border)]"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={index + 1}
          aria-label={tourUi.stepOf(index + 1, total)}
        >
          <div
            className={`h-full rounded-full bg-[var(--primary)] ${reduced ? "" : "transition-[width] duration-300"}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <h2 id="tour-step-title" className="mt-3 text-[15.5px] font-bold leading-snug text-[var(--foreground)]">
          {step.title}
        </h2>
        <p id="tour-step-body" className="mt-1 text-[13px] leading-relaxed text-[var(--text-secondary)]">
          {step.body}
        </p>

        {/* Le geste attendu, puis la réussite */}
        {step.await && (
          <p
            className={
              "mt-2.5 flex items-start gap-2 rounded-lg px-2.5 py-2 text-[12.5px] leading-snug " +
              (awaitDone
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "bg-[var(--primary)]/[0.08] text-[var(--foreground)]")
            }
          >
            {awaitDone ? (
              <Check size={15} className="mt-0.5 shrink-0" aria-hidden />
            ) : (
              <Hand size={15} className={`mt-0.5 shrink-0 text-[var(--primary)] ${reduced ? "" : "motion-safe:animate-pulse"}`} aria-hidden />
            )}
            <span>
              {awaitDone ? (
                step.doneText ?? tourUi.defaultDone
              ) : (
                <>
                  <span className="font-semibold">{tourUi.yourTurn} · </span>
                  {step.awaitHint ?? tourUi.defaultAwaitHint}
                </>
              )}
            </span>
          </p>
        )}

        {(showFallback || routePending) && (
          <p className="mt-2.5 flex items-start gap-2 text-[11.5px] leading-snug text-[var(--text-muted)]">
            <Info size={13} className="mt-0.5 shrink-0" aria-hidden />
            <span>
              {routePending ? tourUi.loading : tourUi.fallbackNote}
              {routePending && showFallback && (
                <>
                  {" "}
                  <button type="button" onClick={onGoToRoute} className="font-medium text-[var(--primary)] underline underline-offset-2">
                    {tourUi.goToPage}
                  </button>
                </>
              )}
            </span>
          </p>
        )}

        {/* Navigation */}
        <div className="mt-3.5 flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            disabled={isFirst}
            className="inline-flex items-center gap-1 rounded-lg border border-[var(--card-border)] px-3 py-1.5 text-[12.5px] font-medium text-[var(--foreground)] transition-colors hover:border-[var(--primary)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/50 disabled:opacity-40"
          >
            <ArrowLeft size={14} aria-hidden />
            {tourUi.prev}
          </button>
          <button
            ref={nextRef}
            type="button"
            onClick={onNext}
            className={
              "ml-auto inline-flex items-center gap-1 rounded-lg px-4 py-1.5 text-[12.5px] font-semibold transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/50 " +
              (waiting
                ? "border border-[var(--card-border)] bg-transparent text-[var(--text-muted)]"
                : "bg-[var(--primary)] text-[var(--primary-foreground)]")
            }
          >
            {isLast ? tourUi.finish : tourUi.next}
            {!isLast && <ArrowRight size={14} aria-hidden />}
          </button>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full text-center text-[11.5px] text-[var(--text-muted)] underline-offset-2 hover:text-[var(--foreground)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/50"
        >
          {tourUi.skip}
        </button>
      </div>
    </div>,
    document.body,
  );
}
