import { mockReviews, formations as CATALOGUE } from "@/lib/mock-data";
import { chf } from "@/lib/model/billing";
import { quote, type Quote } from "@/lib/pricing";
import type { Formation } from "@/lib/types";
import { LEDGER } from "./ledger";
import { personById } from "./directory";
import { frDate } from "./showcase";
import type { SessionEvent, SessionState } from "./session-store";

/* ── LE PÔLE FORMATIONS : leçons, inscription, progression, certificat ──────

   Avant P6a, la liseuse affichait douze leçons identiques pour toutes les
   formations (« Strategies de pricing » dans un cours de fiscalité), une
   vidéo YouTube sans rapport, et une progression codée en dur (« 30 % »)
   qui ne correspondait à aucune leçon cochée. Ici :

   · les leçons d'une formation sont CELLES de ses modules (catalogue), mises
     à plat et numérotées 1..n — la liseuse `/formations/[id]/lecon/[n]` lit
     cette liste ;
   · l'inscription est un événement `formation.enrolled` (ou, pour l'amorce,
     une inscription réelle du journal à son nom) ;
   · la progression se DÉRIVE des leçons marquées terminées (`lesson.marked`) ;
     une personne qui a évalué la formation dans l'amorce l'a terminée ;
   · le certificat n'existe qu'à 100 %. */

export interface FlatLesson {
  id: string;
  /** Rang 1..n dans la formation. */
  n: number;
  title: string;
  duration: string;
  moduleTitle: string;
  moduleIndex: number;
}

/** Les leçons d'une formation, à plat, dans l'ordre des modules. */
export function flatLessons(formation: Pick<Formation, "modules">): FlatLesson[] {
  const out: FlatLesson[] = [];
  formation.modules.forEach((m, mi) => {
    for (const l of m.lessons) {
      out.push({ id: l.id, n: out.length + 1, title: l.title, duration: l.duration, moduleTitle: m.title, moduleIndex: mi });
    }
  });
  return out;
}

/* ── Inscription ─────────────────────────────────────────────────────── */

type Ev<K extends SessionEvent["kind"]> = Extract<SessionEvent, { kind: K }>;

const fullName = (id: string) => {
  const p = personById(id);
  return p ? `${p.firstName} ${p.lastName}` : "";
};

/** Inscription réelle de l'amorce : une écriture « formations » du journal au
    nom de la personne, ou un avis qu'elle a laissé sur la formation. */
export function seedEnrolled(actorId: string, formationId: string): boolean {
  const name = fullName(actorId);
  return (
    seedCompleted(actorId, formationId) ||
    (name !== "" && LEDGER.some((e) => e.source === "formations" && e.subject.id === formationId && e.counterparty === name))
  );
}

/** L'amorce dit que la personne a TERMINÉ la formation : elle l'a évaluée. */
export function seedCompleted(actorId: string, formationId: string): boolean {
  return mockReviews.some((r) => r.subject.kind === "formation" && r.subject.id === formationId && r.author.id === actorId);
}

function enrolEvent(state: SessionState, actorId: string, formationId: string) {
  return state.events.find(
    (e): e is Ev<"formation.enrolled"> => e.kind === "formation.enrolled" && e.actorId === actorId && e.data.formationId === formationId,
  );
}

export function isEnrolled(state: SessionState, actorId: string, formation: Pick<Formation, "id" | "instructor">): boolean {
  if (formation.instructor.id === actorId) return false;
  return Boolean(enrolEvent(state, actorId, formation.id)) || seedEnrolled(actorId, formation.id);
}

/** Inscrits de la session (hors amorce, hors auteur) — ajoutés au compteur. */
export function sessionEnrolmentCount(state: SessionState, formation: Pick<Formation, "id" | "instructor">): number {
  const ids = new Set<string>();
  for (const e of state.events) {
    if (e.kind === "formation.enrolled" && e.data.formationId === formation.id && e.actorId !== formation.instructor.id && !seedEnrolled(e.actorId, formation.id)) {
      ids.add(e.actorId);
    }
  }
  return ids.size;
}

/* ── Progression ─────────────────────────────────────────────────────── */

/** Les leçons terminées par `actorId` : amorce (formation évaluée = toutes),
    puis chaque `lesson.marked` de la session, dans l'ordre. */
export function doneLessonIds(state: SessionState, actorId: string, formation: Pick<Formation, "id" | "modules">): Set<string> {
  const lessons = flatLessons(formation);
  const valid = new Set(lessons.map((l) => l.id));
  const done = new Set<string>(seedCompleted(actorId, formation.id) ? lessons.map((l) => l.id) : []);
  for (const e of state.events) {
    if (e.kind !== "lesson.marked" || e.actorId !== actorId || e.data.formationId !== formation.id || !valid.has(e.data.lessonId)) continue;
    if (e.data.done) done.add(e.data.lessonId);
    else done.delete(e.data.lessonId);
  }
  return done;
}

/** Pourcentage entier : 0 leçon → 0 %, toutes → 100 %, jamais 100 % avant. */
export function progressPercent(doneCount: number, total: number): number {
  if (total <= 0 || doneCount <= 0) return 0;
  if (doneCount >= total) return 100;
  return Math.min(99, Math.round((doneCount / total) * 100));
}

export interface FormationProgress {
  enrolled: boolean;
  isAuthor: boolean;
  done: Set<string>;
  doneCount: number;
  total: number;
  percent: number;
  certificate: boolean;
}

export function formationProgress(state: SessionState, actorId: string, formation: Formation): FormationProgress {
  const total = flatLessons(formation).length;
  const isAuthor = formation.instructor.id === actorId;
  const enrolled = isEnrolled(state, actorId, formation);
  const done = enrolled ? doneLessonIds(state, actorId, formation) : new Set<string>();
  const percent = progressPercent(done.size, total);
  return { enrolled, isAuthor, done, doneCount: done.size, total, percent, certificate: canHaveCertificate(enrolled, percent) };
}

/** Le certificat n'existe qu'à 100 %, pour une personne inscrite. */
export function canHaveCertificate(enrolled: boolean, percent: number): boolean {
  return enrolled && percent === 100;
}

/** Date de complétion : la dernière leçon cochée en session (horloge de la
    démonstration, `DEMO_TODAY` + n × 2 min) ; à défaut, l'avis d'amorce. */
export function completionDate(state: SessionState, actorId: string, formationId: string): string {
  const marks = state.events.filter(
    (e): e is Ev<"lesson.marked"> => e.kind === "lesson.marked" && e.actorId === actorId && e.data.formationId === formationId && e.data.done,
  );
  const last = marks[marks.length - 1];
  if (last) return frDate(last.at);
  const review = mockReviews.find((r) => r.subject.kind === "formation" && r.subject.id === formationId && r.author.id === actorId);
  return review ? frDate(review.createdAt) : "";
}

/* ── Paiement de l'inscription ───────────────────────────────────────── */

/** Le flux de l'inscription — toujours via `quote()`. L'élève vient de la
    plateforme : taux « audience E-Dome » du catalogue. */
export function enrolmentCharge(priceChf: number) {
  return { kind: "commission" as const, pole: "formation" as const, gross: chf(priceChf), attribution: "platform" as const };
}

export function enrolmentQuote(priceChf: number): Quote {
  return quote(enrolmentCharge(priceChf));
}

/** Les formations du catalogue (amorce). */
export const FORMATION_CATALOGUE: readonly Formation[] = CATALOGUE;
