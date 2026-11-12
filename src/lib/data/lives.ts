import { requirePerson } from "@/lib/demo/directory";
import { personaFor } from "@/content/roles";
import { DEMO_TODAY, iso } from "@/lib/demo/clock";
import { eventDateLabel } from "./events";

/* ── Les prochains lives — SOURCE UNIQUE (chantier P6c) ──────────────────────

   Ils vivaient dans `/live/page.tsx`, avec des dates en français à
   ré-analyser (« 8 octobre 2026 à 18h00 ») et un compte à rebours calculé sur
   `new Date()` — la date réelle, pas celle de la démonstration.

   Chaque live a un ANIMATEUR qui est une personne de l'annuaire
   (`organizerId`), une date ISO postérieure au « aujourd'hui » de la
   démonstration (30 septembre 2026), un prix (0 = gratuit) et un nombre
   d'inscrits à l'échelle d'un réseau qui se lance : des dizaines. Les lives
   programmés pendant la visite (mémoire de session) s'ajoutent en tête, côté
   page. */

export interface UpcomingLiveSeed {
  id: string;
  titre: string;
  organizerId: string;
  /** Date et heure locales, ISO (AAAA-MM-JJTHH:MM). */
  startsAt: string;
  durationMin: number;
  /** En CHF. 0 = gratuit. */
  price: number;
  inscrits: number;
}

export interface UpcomingLive extends UpcomingLiveSeed {
  speaker: string;
  /** « Créatrice de formations » — le libellé du casting. */
  role: string;
  /** « 8 octobre 2026 à 18h00 ». */
  dateLabel: string;
  /** Date ISO (AAAA-MM-JJ). */
  date: string;
  isNew?: boolean;
}

const LIVE_SEEDS: UpcomingLiveSeed[] = [
  { id: "L1", titre: "Pricing dynamique : préparer l'hiver en courte durée", organizerId: "user-016", startsAt: "2026-10-08T18:00", durationMin: 60, price: 25, inscrits: 24 },
  { id: "L2", titre: "Visite commentée : la maison vigneronne de Riex", organizerId: "user-002", startsAt: "2026-10-14T12:30", durationMin: 45, price: 0, inscrits: 17 },
  { id: "L3", titre: "Déclarer un bien loué dans un autre canton", organizerId: "user-011", startsAt: "2026-10-21T19:00", durationMin: 60, price: 0, inscrits: 31 },
  { id: "L4", titre: "Bailleur à Lausanne : ce que j'ai appris en un an", organizerId: "user-001", startsAt: "2026-10-27T19:00", durationMin: 45, price: 0, inscrits: 11 },
];

const capitalize = (s: string) => (s ? s[0]!.toUpperCase() + s.slice(1) : s);

/** « 18h00 » depuis « 2026-10-08T18:00 ». */
function hourLabel(startsAt: string): string {
  const t = startsAt.slice(11, 16);
  return t ? t.replace(":", "h") : "";
}

export function liveFromSeed(s: UpcomingLiveSeed): UpcomingLive {
  const p = requirePerson(s.organizerId);
  const date = s.startsAt.slice(0, 10);
  const hour = hourLabel(s.startsAt);
  return {
    ...s,
    speaker: `${p.firstName} ${p.lastName}`,
    role: capitalize(personaFor(s.organizerId)?.as ?? ""),
    date,
    dateLabel: hour ? `${eventDateLabel(date)} à ${hour}` : eventDateLabel(date),
  };
}

export const UPCOMING_LIVES: UpcomingLive[] = LIVE_SEEDS.map(liveFromSeed);

/** Le temps qui sépare le « aujourd'hui » de la démonstration du début d'un
    live — figé, comme l'horloge : pas de compte à rebours sur l'heure réelle. */
export function timeUntil(startsAt: string): { days: number; hours: number } {
  const start = new Date(`${startsAt.length > 10 ? startsAt : `${startsAt}T12:00`}:00Z`);
  const diff = Math.max(0, start.getTime() - DEMO_TODAY.getTime());
  return { days: Math.floor(diff / 86_400_000), hours: Math.floor((diff % 86_400_000) / 3_600_000) };
}

/** Le prochain live à venir (le plus proche), ou `undefined`. */
export function nextLive(lives: readonly UpcomingLive[]): UpcomingLive | undefined {
  return [...lives].filter((l) => l.startsAt.slice(0, 10) >= iso(DEMO_TODAY)).sort((a, b) => a.startsAt.localeCompare(b.startsAt))[0];
}
