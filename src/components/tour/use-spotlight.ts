"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/* ── Le projecteur : trouver, mesurer et suivre l'élément éclairé ───────────

   L'élément se désigne par `data-tour="<clé>"`. On essaie les clés dans
   l'ordre ; pour chacune, on garde le premier nœud réellement visible (une
   même clé peut exister deux fois, version bureau et version mobile, l'une
   masquée). Une fois trouvé, on le fait défiler à l'écran puis on suit sa
   position : défilement (capturé, donc aussi dans les conteneurs internes),
   redimensionnement, `ResizeObserver` sur l'élément, et un contrôle lent de
   sécurité pour les décalages que rien ne signale (une image qui charge
   au-dessus).

   Si rien n'apparaît après `timeoutMs` une fois la bonne route affichée, on
   passe en « repli » : la carte se centre, rien n'est bloqué. On continue de
   chercher doucement — une cible tardive reprend le projecteur. */

export interface SpotRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export type SpotPhase = "idle" | "searching" | "found" | "fallback";

const MOBILE_QUERY = "(max-width: 640px)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeQuery(query: string) {
  return (cb: () => void) => {
    if (typeof window === "undefined" || !window.matchMedia) return () => {};
    const mql = window.matchMedia(query);
    mql.addEventListener("change", cb);
    return () => mql.removeEventListener("change", cb);
  };
}

function readQuery(query: string) {
  return () => (typeof window !== "undefined" && !!window.matchMedia && window.matchMedia(query).matches);
}

const subMobile = subscribeQuery(MOBILE_QUERY);
const getMobile = readQuery(MOBILE_QUERY);
const subReduced = subscribeQuery(REDUCED_QUERY);
const getReduced = readQuery(REDUCED_QUERY);
const serverFalse = () => false;

/** Vrai sous 640 px de large (la carte devient une feuille en bas). */
export function useIsMobile() {
  return useSyncExternalStore(subMobile, getMobile, serverFalse);
}

/** Vrai si la personne a demandé moins d'animations. */
export function useReducedMotion() {
  return useSyncExternalStore(subReduced, getReduced, serverFalse);
}

function isVisible(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  if (r.width < 1 || r.height < 1) return false;
  const style = window.getComputedStyle(el);
  return style.visibility !== "hidden" && style.display !== "none";
}

/** Le premier élément visible pour la première clé qui en a un. */
export function findTarget(keys: readonly string[]): HTMLElement | null {
  if (typeof document === "undefined") return null;
  for (const key of keys) {
    const nodes = document.querySelectorAll<HTMLElement>(`[data-tour="${key.replace(/"/g, "")}"]`);
    for (const n of Array.from(nodes)) {
      if (n.closest("[data-tour-ui]")) continue;
      if (isVisible(n)) return n;
    }
  }
  return null;
}

function sameRect(a: SpotRect | null, b: SpotRect) {
  return (
    !!a &&
    Math.round(a.top) === Math.round(b.top) &&
    Math.round(a.left) === Math.round(b.left) &&
    Math.round(a.width) === Math.round(b.width) &&
    Math.round(a.height) === Math.round(b.height)
  );
}

function bringIntoView(el: HTMLElement, mobile: boolean, reduced: boolean) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  /* Sur mobile, la carte occupe le bas : la cible doit rester dans le haut.
     Marge haute pour passer sous l'en-tête collant. */
  const topRoom = mobile ? 72 : 88;
  const bottomRoom = mobile ? Math.round(vh * 0.48) : 24;
  const fits = r.top >= topRoom && r.bottom <= vh - bottomRoom;
  if (fits) return;
  const prev = el.style.scrollMarginTop;
  el.style.scrollMarginTop = `${topRoom}px`;
  const tall = r.height > vh - topRoom - bottomRoom;
  try {
    el.scrollIntoView({
      block: mobile || tall ? "start" : "center",
      inline: "nearest",
      behavior: reduced ? "auto" : "smooth",
    });
  } catch {
    el.scrollIntoView();
  }
  el.style.scrollMarginTop = prev;
}

export function useSpotlight({
  keys,
  ready,
  timeoutMs = 1500,
}: {
  /** Clés à essayer, dans l'ordre ; `null` = projecteur éteint. */
  keys: readonly string[] | null;
  /** La bonne route est affichée : le compte à rebours peut commencer. */
  ready: boolean;
  timeoutMs?: number;
}) {
  const mobile = useIsMobile();
  const reduced = useReducedMotion();
  const [state, setState] = useState<{ sig: string; phase: SpotPhase }>({ sig: "", phase: "idle" });
  const [rect, setRect] = useState<SpotRect | null>(null);
  const rectRef = useRef<SpotRect | null>(null);
  const keySig = keys ? keys.join("|") : "";
  /* La phase n'a de sens que pour la recherche en cours (mêmes clés, même
     état de route) : sinon on cherche encore. */
  const sig = `${keySig}#${ready ? 1 : 0}`;

  /* Préférences lues au moment du défilement, sans relancer la recherche. */
  const prefs = useRef({ mobile, reduced });
  useEffect(() => {
    prefs.current = { mobile, reduced };
  }, [mobile, reduced]);

  useEffect(() => {
    const list = keySig ? keySig.split("|") : [];
    if (!list.length || !ready) return;
    const setPhase = (phase: SpotPhase) => setState({ sig, phase });

    let el: HTMLElement | null = null;
    let cancelled = false;
    let raf = 0;
    let poll: ReturnType<typeof setTimeout> | undefined;
    let safety: ReturnType<typeof setInterval> | undefined;
    let ro: ResizeObserver | undefined;
    const started = performance.now();
    let scrolled = false;

    const commit = (r: SpotRect) => {
      if (sameRect(rectRef.current, r)) return;
      rectRef.current = r;
      setRect(r);
    };

    const measure = () => {
      raf = 0;
      if (cancelled) return;
      if (!el || !el.isConnected || !isVisible(el)) {
        /* La cible a disparu (re-rendu, onglet changé) : on la recherche. */
        const again = findTarget(list);
        if (!again) {
          detach();
          setPhase("fallback");
          schedulePoll(400);
          return;
        }
        attach(again);
        setPhase("found");
      }
      const r = el!.getBoundingClientRect();
      commit({ top: r.top, left: r.left, width: r.width, height: r.height });
    };

    const onMove = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    function attach(next: HTMLElement) {
      detach();
      el = next;
      if (typeof ResizeObserver !== "undefined") {
        ro = new ResizeObserver(onMove);
        ro.observe(next);
      }
      window.addEventListener("scroll", onMove, { capture: true, passive: true });
      window.addEventListener("resize", onMove);
      safety = setInterval(onMove, 400);
    }

    function detach() {
      ro?.disconnect();
      ro = undefined;
      window.removeEventListener("scroll", onMove, { capture: true });
      window.removeEventListener("resize", onMove);
      if (safety) clearInterval(safety);
      safety = undefined;
      el = null;
    }

    function schedulePoll(ms: number) {
      if (poll) clearTimeout(poll);
      poll = setTimeout(search, ms);
    }

    function search() {
      if (cancelled) return;
      const found = findTarget(list);
      if (found) {
        attach(found);
        if (!scrolled) {
          scrolled = true;
          bringIntoView(found, prefs.current.mobile, prefs.current.reduced);
        }
        setPhase("found");
        measure();
        return;
      }
      if (performance.now() - started >= timeoutMs) {
        setPhase("fallback");
        schedulePoll(400);
      } else {
        schedulePoll(100);
      }
    }

    search();

    return () => {
      cancelled = true;
      if (poll) clearTimeout(poll);
      if (raf) cancelAnimationFrame(raf);
      detach();
    };
  }, [keySig, ready, sig, timeoutMs]);

  const phase: SpotPhase = !keySig ? "idle" : state.sig === sig ? state.phase : "searching";
  return { phase, rect: phase === "found" ? rect : null, mobile, reduced };
}
