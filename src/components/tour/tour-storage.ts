/* ── Mémoire du tutoriel ────────────────────────────────────────────────────

   Tout passe par `localStorage`, toujours enveloppé de try/catch : un
   navigateur privé ou un stockage bloqué ne casse rien, le tutoriel marche
   alors sans mémoire. Ces fonctions ne sont appelées QUE depuis des effets ou
   des gestionnaires d'événement — jamais pendant le rendu, pour ne pas créer
   d'écart d'hydratation.

   Deux drapeaux valent « déjà vu » :
     · `edome_tour_seen` — posé par ce tutoriel à la première ouverture ;
     · `edome_tour_done` — posé par les épreuves Playwright et les scripts de
       vérification pour faire taire toute visite. Il est respecté tel quel. */

export const TOUR_SEEN_KEY = "edome_tour_seen";
export const TOUR_DONE_KEY = "edome_tour_done";
export const TOUR_PROGRESS_KEY = "edome_tour.v2";
export const TOUR_COMPLETED_KEY = "edome_tour_completed.v2";

export type TourStatus = "active" | "paused";

export interface TourProgress {
  pathId: string;
  step: number;
  status: TourStatus;
}

function store(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function hasSeenTour(): boolean {
  try {
    const s = store();
    if (!s) return true; // Sans stockage, on n'impose pas le lanceur à chaque page.
    return s.getItem(TOUR_SEEN_KEY) === "1" || s.getItem(TOUR_DONE_KEY) === "1";
  } catch {
    return true;
  }
}

export function markTourSeen() {
  try {
    store()?.setItem(TOUR_SEEN_KEY, "1");
  } catch {
    /* Stockage indisponible : rien à mémoriser. */
  }
}

export function readProgress(): TourProgress | null {
  try {
    const raw = store()?.getItem(TOUR_PROGRESS_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<TourProgress>;
    if (typeof p.pathId !== "string" || typeof p.step !== "number") return null;
    if (p.status !== "active" && p.status !== "paused") return null;
    return { pathId: p.pathId, step: Math.max(0, Math.floor(p.step)), status: p.status };
  } catch {
    return null;
  }
}

export function writeProgress(p: TourProgress | null) {
  try {
    const s = store();
    if (!s) return;
    if (p) s.setItem(TOUR_PROGRESS_KEY, JSON.stringify(p));
    else s.removeItem(TOUR_PROGRESS_KEY);
  } catch {
    /* Stockage indisponible : la progression vaut pour la visite en cours. */
  }
}

export function readCompleted(): string[] {
  try {
    const raw = store()?.getItem(TOUR_COMPLETED_KEY);
    const v: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function markCompleted(pathId: string): string[] {
  const next = Array.from(new Set([...readCompleted(), pathId]));
  try {
    store()?.setItem(TOUR_COMPLETED_KEY, JSON.stringify(next));
  } catch {
    /* Stockage indisponible. */
  }
  return next;
}
