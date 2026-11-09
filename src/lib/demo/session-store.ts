import { DEMO_TODAY } from "./clock";
import type { Currency, PropertyType, TransactionType } from "@/lib/types";

/* ── LA MÉMOIRE DE SESSION — le moteur d'interactions (chantier P2) ─────────

   Une dizaine de parcours affichaient « succès » et ne créaient rien : publier
   un bien, contacter un propriétaire, demander une visite, envoyer un devis…
   Ce module est l'unique endroit où une action laisse une trace. Il ne connaît
   ni React ni le navigateur : ce sont des fonctions pures sur un état
   sérialisable, testées par `npm run test:data`. La couche React
   (`src/lib/use-session.ts`) ne fait que le brancher sur `localStorage` et
   sur `useSyncExternalStore`.

   ── Le modèle : un JOURNAL D'ÉVÉNEMENTS typés ───────────────────────────────

   On n'écrit pas « une conversation », « une notification », « une annonce »
   dans trois tiroirs différents. On écrit UN événement (`visit.requested`,
   `listing.published`…), et tout le reste en DÉRIVE : les fils de la
   messagerie, les notifications et le catalogue de session sont des vues
   calculées sur le journal + les données d'amorce. C'est ce qui garantit
   qu'une action vue ici se voit aussi là-bas — il n'y a qu'une source.

   ── L'acteur ───────────────────────────────────────────────────────────────

   Chaque événement porte `actorId` : la personne de l'annuaire qui agit.
   Aujourd'hui c'est toujours l'utilisateur courant (Léo). Le chantier P3
   (« être un profil ») fera varier l'acteur : toutes les vues prennent
   donc un `viewerId` en paramètre et ne supposent jamais que l'acteur est
   Léo. Une demande de visite envoyée par Léo à Céline crée un fil que Léo
   voit, ET une notification que Céline verra quand on l'incarnera.

   ── Le temps ───────────────────────────────────────────────────────────────

   Jamais `Date.now()` : l'horloge de la démonstration est figée
   (`DEMO_TODAY`). Le n-ième événement de la session est daté
   `DEMO_TODAY + n × 2 minutes` — toujours après les données d'amorce (qui
   sont antérieures ou égales à `DEMO_TODAY`), toujours dans l'ordre. */

export const SESSION_STORAGE_KEY = "edome_session.v1";
export const SESSION_VERSION = 1 as const;

/** Pas entre deux événements de session, en millisecondes. */
const EVENT_STEP_MS = 2 * 60_000;

/* ── Les données de chaque type d'événement ─────────────────────────────── */

export interface ListingData {
  title: string;
  description: string;
  type: PropertyType;
  transactionType: TransactionType;
  price: number;
  currency: Currency;
  city: string;
  address?: string;
  postalCode?: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  amenities: string[];
  /** Le vendeur ouvre le bien aux apporteurs (prime en francs, D14). */
  openToReferrers: boolean;
}

export interface ServiceData {
  title: string;
  category: string;
  description: string;
  zone: string;
  price: number;
  unit: string;
  images: string[];
}

export interface FormationData {
  title: string;
  category: string;
  level: "debutant" | "intermediaire" | "avance";
  description: string;
  image: string;
  price: number;
  duration: string;
  modules: { title: string; lessons: { title: string; duration: string }[] }[];
}

export interface LiveData {
  title: string;
  format: string;
  /** Date ISO (AAAA-MM-JJ) saisie par la personne. */
  date: string;
  durationMin: number;
  description: string;
  price: number;
}

export interface ApplicationData {
  demandId: string;
  /** Libellé lisible de la fiche (« Appartement 4,5 p. — Neuchâtel »). */
  demandLabel: string;
  /** Le particulier derrière la fiche anonyme, s'il est à l'annuaire. Il est
      notifié ; l'agence, elle, ne reçoit jamais son identité (DECISIONS §2.3). */
  ownerId?: string;
  rate: string;
  included: string;
  timeline: string;
  references: [string, string];
}

/** Ce que l'appelant fournit : un type et ses données. */
export type SessionEventInput =
  | { kind: "listing.published"; data: ListingData }
  | { kind: "service.published"; data: ServiceData }
  | { kind: "formation.published"; data: FormationData }
  | { kind: "live.scheduled"; data: LiveData }
  | { kind: "contact.sent"; data: { toId: string; propertyId?: string; subject?: string; text: string } }
  | { kind: "visit.requested"; data: { toId: string; propertyId: string; subject: string; date: string; time: string } }
  | {
      kind: "offer.made";
      data: { toId: string; propertyId: string; subject: string; amount: number; currency: Currency; conditions: string };
    }
  | {
      kind: "quote.sent";
      data: { toId?: string; serviceId: string; subject: string; providerName: string; text: string; date?: string };
    }
  | { kind: "agency.contacted"; data: { toId: string; proposalId: string; agencyName: string } }
  | { kind: "application.sent"; data: ApplicationData }
  | {
      kind: "booking.made";
      data: {
        propertyId: string;
        hostId: string;
        subject: string;
        checkIn: string;
        checkOut: string;
        nights: number;
        total: number;
        currency: Currency;
      };
    }
  | { kind: "follow"; data: { toId: string } }
  | { kind: "message.sent"; data: { threadId: string; memberIds: string[]; text: string } }
  | { kind: "group.created"; data: { threadId: string; memberIds: string[]; name: string } };

export type SessionEventKind = SessionEventInput["kind"];

/** Un événement du journal : l'entrée, plus qui, quand, et un rang. */
export type SessionEvent = SessionEventInput & {
  id: string;
  seq: number;
  at: string;
  actorId: string;
};

export interface SessionState {
  version: typeof SESSION_VERSION;
  /** Dernier rang attribué (les ids et les dates en dérivent). */
  seq: number;
  events: SessionEvent[];
  /** Notifications marquées lues (amorce ou session). */
  readNotificationIds: string[];
  /** `${viewerId}|${threadId}` → nombre de messages vus dans ce fil. */
  threadReadMarks: Record<string, number>;
}

export function emptySession(): SessionState {
  return { version: SESSION_VERSION, seq: 0, events: [], readNotificationIds: [], threadReadMarks: {} };
}

/** L'horodatage du n-ième événement de session. */
export function sessionTime(seq: number): string {
  return new Date(DEMO_TODAY.getTime() + seq * EVENT_STEP_MS).toISOString();
}

/* ── Les identifiants des objets créés en session ────────────────────────── */

export const SESSION_ID_PREFIX = "s-";
export const listingIdOf = (seq: number) => `s-bien-${seq}`;
export const serviceIdOf = (seq: number) => `s-svc-${seq}`;
export const formationIdOf = (seq: number) => `s-form-${seq}`;
export const liveIdOf = (seq: number) => `s-live-${seq}`;
export const bookingIdOf = (seq: number) => `s-res-${seq}`;

/** L'id d'un fil direct entre deux personnes, indépendant de l'ordre. */
export function directThreadId(a: string, b: string): string {
  return a < b ? `dm-${a}-${b}` : `dm-${b}-${a}`;
}

/** L'id de l'objet créé par un événement, s'il en crée un. */
export function createdObjectId(e: SessionEvent): string | undefined {
  switch (e.kind) {
    case "listing.published":
      return listingIdOf(e.seq);
    case "service.published":
      return serviceIdOf(e.seq);
    case "formation.published":
      return formationIdOf(e.seq);
    case "live.scheduled":
      return liveIdOf(e.seq);
    case "booking.made":
      return bookingIdOf(e.seq);
    default:
      return undefined;
  }
}

/* ── Écrire ─────────────────────────────────────────────────────────────── */

/** Ajoute un événement au journal. Pur : renvoie un nouvel état. */
export function recordEvent(
  state: SessionState,
  actorId: string,
  input: SessionEventInput,
): { state: SessionState; event: SessionEvent } {
  const seq = state.seq + 1;
  const event = { ...input, id: `ev-${seq}`, seq, at: sessionTime(seq), actorId } as SessionEvent;
  return { state: { ...state, seq, events: [...state.events, event] }, event };
}

export function markNotificationsRead(state: SessionState, ids: readonly string[]): SessionState {
  const set = new Set(state.readNotificationIds);
  let changed = false;
  for (const id of ids) {
    if (!set.has(id)) {
      set.add(id);
      changed = true;
    }
  }
  return changed ? { ...state, readNotificationIds: [...set] } : state;
}

export function markThreadRead(state: SessionState, viewerId: string, threadId: string, seen: number): SessionState {
  const key = `${viewerId}|${threadId}`;
  if ((state.threadReadMarks[key] ?? 0) >= seen) return state;
  return { ...state, threadReadMarks: { ...state.threadReadMarks, [key]: seen } };
}

/* ── Persister (tolérant aux pannes) ─────────────────────────────────────── */

/** Relit un état sérialisé. Toute valeur illisible ou d'une autre version
    redonne une session vide : une démonstration ne casse pas sur un vieux
    stockage. */
export function parseSession(raw: string | null | undefined): SessionState {
  if (!raw) return emptySession();
  try {
    const v = JSON.parse(raw) as Partial<SessionState> | null;
    if (!v || v.version !== SESSION_VERSION || !Array.isArray(v.events)) return emptySession();
    const events = v.events.filter(
      (e): e is SessionEvent =>
        !!e && typeof e === "object" && typeof e.kind === "string" && typeof e.seq === "number" && typeof e.actorId === "string",
    );
    const seq = Math.max(typeof v.seq === "number" ? v.seq : 0, ...events.map((e) => e.seq), 0);
    return {
      version: SESSION_VERSION,
      seq,
      events,
      readNotificationIds: Array.isArray(v.readNotificationIds)
        ? v.readNotificationIds.filter((x): x is string => typeof x === "string")
        : [],
      threadReadMarks:
        v.threadReadMarks && typeof v.threadReadMarks === "object" ? (v.threadReadMarks as Record<string, number>) : {},
    };
  } catch {
    return emptySession();
  }
}

export function serializeSession(state: SessionState): string {
  return JSON.stringify(state);
}

/** Lecture depuis un stockage de type `localStorage`. Jamais d'exception. */
export function loadSession(storage: Pick<Storage, "getItem"> | undefined): SessionState {
  try {
    return parseSession(storage?.getItem(SESSION_STORAGE_KEY));
  } catch {
    return emptySession();
  }
}

/** Écriture vers un stockage. Quota dépassé, navigation privée : on dégrade
    en silence, la session reste utilisable en mémoire. */
export function saveSession(storage: Pick<Storage, "setItem"> | undefined, state: SessionState): void {
  try {
    storage?.setItem(SESSION_STORAGE_KEY, serializeSession(state));
  } catch {
    /* Stockage indisponible. */
  }
}
