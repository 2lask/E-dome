/* ── L'horloge de la démonstration ──────────────────────────────────────────

   Le mois courant changeait selon l'écran : juin 2026 pour les réservations et
   les virements, mars 2026 dans le catalogue, avril 2026 dans la messagerie et
   les notifications, mars 2026 dans la console d'administration. La date
   réelle, elle, est en septembre 2026.

   Une démonstration dont les écrans ne sont pas d'accord sur la date se
   remarque immédiatement : un investisseur clique sur « Réservations » et lit
   des dates passées sous un en-tête qui annonce le mois en cours.

   Tout ce qui est daté dérive donc d'ici. La constante est figée plutôt que
   calculée sur `new Date()` : une maquette dont les chiffres bougent d'un jour
   à l'autre rend impossible toute vérification automatique, et ferait échouer
   les invariants au premier changement de mois. */

/** Le « aujourd'hui » de la démonstration. Dernier jour d'un mois complet. */
export const DEMO_TODAY = new Date("2026-09-30T12:00:00Z");

export const MONTH_LABELS = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
] as const;

const MONTHS_LONG = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
] as const;

/** Premier jour du mois de `DEMO_TODAY`. */
export function currentMonthStart(): Date {
  return new Date(Date.UTC(DEMO_TODAY.getUTCFullYear(), DEMO_TODAY.getUTCMonth(), 1));
}

/** Les douze mois qui se terminent au mois courant, du plus ancien au plus récent. */
export function last12Months(): { year: number; month: number; label: string }[] {
  const out: { year: number; month: number; label: string }[] = [];
  for (let back = 11; back >= 0; back--) {
    const d = new Date(
      Date.UTC(DEMO_TODAY.getUTCFullYear(), DEMO_TODAY.getUTCMonth() - back, 1),
    );
    out.push({
      year: d.getUTCFullYear(),
      month: d.getUTCMonth(),
      label: MONTH_LABELS[d.getUTCMonth()],
    });
  }
  return out;
}

/** Date décalée de `days` jours par rapport au « aujourd'hui » de la démo. */
export function demoDay(days: number): Date {
  return new Date(DEMO_TODAY.getTime() + days * 86_400_000);
}

export const iso = (d: Date): string => d.toISOString().slice(0, 10);

/** « 12 octobre ». Sans l'année, comme le ferait une interface. */
export function dayMonth(d: Date): string {
  return `${d.getUTCDate()} ${MONTHS_LONG[d.getUTCMonth()]}`;
}

/** « 10–17 juin · 7 nuits ». Le libellé qu'affichent les réservations. */
export function stayLabel(start: Date, end: Date): string {
  const nights = Math.round((end.getTime() - start.getTime()) / 86_400_000);
  const sameMonth = start.getUTCMonth() === end.getUTCMonth();
  const left = sameMonth ? String(start.getUTCDate()) : dayMonth(start);
  return `${left}–${dayMonth(end)} · ${nights} ${nights > 1 ? "nuits" : "nuit"}`;
}

/** Écart en jours depuis le « aujourd'hui » de la démo. Négatif si passé. */
export function daysFromToday(d: Date): number {
  return Math.round((d.getTime() - DEMO_TODAY.getTime()) / 86_400_000);
}
