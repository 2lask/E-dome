"use client";

/* ── Piège à focus minimal ──────────────────────────────────────────────────

   Tab et Maj+Tab tournent entre les éléments focalisables du conteneur. On ne
   reprend PAS le focus quand il part ailleurs par un clic : certaines étapes
   demandent justement d'agir sur la page (ouvrir un formulaire, y taper). */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function trapTab(e: React.KeyboardEvent<HTMLElement> | KeyboardEvent, container: HTMLElement | null) {
  if (e.key !== "Tab" || !container) return;
  const items = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  );
  if (!items.length) {
    e.preventDefault();
    container.focus();
    return;
  }
  const first = items[0];
  const last = items[items.length - 1];
  const active = document.activeElement as HTMLElement | null;
  const inside = !!active && container.contains(active);
  if (e.shiftKey) {
    if (!inside || active === first || active === container) {
      e.preventDefault();
      last.focus();
    }
  } else if (!inside || active === last) {
    e.preventDefault();
    first.focus();
  }
}
