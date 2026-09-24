"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Compass, X, ArrowRight, ArrowLeft, Eye } from "lucide-react";
import { guidedTour } from "@/content/tour";
import { useApp } from "@/lib/context";

/* ── La visite guidée ───────────────────────────────────────────────────────

   Montée dans `app-shell`, donc persistante d'une route à l'autre : c'est ce
   qui permet à un stepper de survivre à la navigation entre les six arrêts.
   L'état (ouverte, index) vit dans `localStorage`, enveloppé de try/catch —
   un navigateur privé qui refuse le stockage ne casse pas la page.

   Quand un arrêt porte un rôle, la visite pilote `setViewingAs` : le même
   mécanisme que la visite libre, pour que l'écran s'affiche du bon point de
   vue. Le texte vient de `content/tour.ts` ; ce composant ne fait que naviguer
   et afficher. */

const KEY_OPEN = "edome:tour:open";
const KEY_STEP = "edome:tour:step";

function readStored(): { open: boolean; step: number } {
  try {
    return {
      open: localStorage.getItem(KEY_OPEN) === "1",
      step: Number(localStorage.getItem(KEY_STEP) ?? "0") || 0,
    };
  } catch {
    return { open: false, step: 0 };
  }
}

export function GuidedTour() {
  const router = useRouter();
  const pathname = usePathname();
  const { setViewingAs } = useApp();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  const stops = guidedTour.stops;

  useEffect(() => {
    const s = readStored();
    setOpen(s.open);
    setStep(Math.min(Math.max(s.step, 0), stops.length - 1));
    setMounted(true);
  }, [stops.length]);

  const persist = (o: boolean, st: number) => {
    try {
      localStorage.setItem(KEY_OPEN, o ? "1" : "0");
      localStorage.setItem(KEY_STEP, String(st));
    } catch {
      /* stockage indisponible : la visite marche quand même, sans mémoire. */
    }
  };

  const goto = (index: number) => {
    const i = Math.min(Math.max(index, 0), stops.length - 1);
    setStep(i);
    persist(true, i);
    const stop = stops[i];
    if (stop.as) setViewingAs(stop.as);
    if (pathname !== stop.route) router.push(stop.route);
  };

  const start = () => {
    setOpen(true);
    persist(true, step);
    goto(step);
  };

  const close = () => {
    setOpen(false);
    persist(false, step);
  };

  if (!mounted) return null;

  /* Lanceur discret quand la visite est fermée. Placé en bas à gauche pour ne
     pas heurter le bouton « Expert IA » ancré en bas à droite. */
  if (!open) {
    return (
      <button
        type="button"
        onClick={start}
        className="fixed bottom-4 left-4 z-40 hidden items-center gap-1.5 rounded-full border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-[12.5px] font-medium text-[var(--foreground)] shadow-lg transition-colors hover:border-[var(--primary)]/40 md:inline-flex"
      >
        <Compass size={15} className="text-[var(--primary)]" aria-hidden />
        {guidedTour.launch}
      </button>
    );
  }

  const stop = stops[step];
  const isFirst = step === 0;
  const isLast = step === stops.length - 1;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[min(92vw,26rem)] -translate-x-1/2 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 shadow-2xl">
      <div className="mb-1.5 flex items-center gap-2">
        <Compass size={15} className="text-[var(--primary)]" aria-hidden />
        <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
          {guidedTour.stepOf(step + 1, stops.length)}
        </span>
        <button
          type="button"
          onClick={close}
          aria-label={guidedTour.close}
          className="ml-auto rounded-md p-0.5 text-[var(--text-muted)] hover:text-[var(--foreground)]"
        >
          <X size={16} />
        </button>
      </div>

      <h2 className="text-[15px] font-bold text-[var(--foreground)]">{stop.title}</h2>
      <p className="mt-1 text-[12.5px] leading-snug text-[var(--text-muted)]">{stop.body}</p>
      <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-[var(--primary)]/[0.06] px-2.5 py-2 text-[12px] leading-snug text-[var(--foreground)]">
        <Eye size={14} className="mt-0.5 shrink-0 text-[var(--primary)]" aria-hidden />
        {stop.look}
      </p>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => goto(step - 1)}
          disabled={isFirst}
          className="inline-flex items-center gap-1 rounded-lg border border-[var(--card-border)] px-3 py-1.5 text-[12.5px] font-medium text-[var(--foreground)] transition-colors hover:border-[var(--primary)]/40 disabled:opacity-40"
        >
          <ArrowLeft size={14} aria-hidden />
          {guidedTour.prev}
        </button>
        {isLast ? (
          <button
            type="button"
            onClick={close}
            className="ml-auto inline-flex items-center gap-1 rounded-lg bg-[var(--foreground)] px-4 py-1.5 text-[12.5px] font-medium text-[var(--background)] transition-opacity hover:opacity-90"
          >
            {guidedTour.done}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => goto(step + 1)}
            className="ml-auto inline-flex items-center gap-1 rounded-lg bg-[var(--foreground)] px-4 py-1.5 text-[12.5px] font-medium text-[var(--background)] transition-opacity hover:opacity-90"
          >
            {guidedTour.next}
            <ArrowRight size={14} aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
