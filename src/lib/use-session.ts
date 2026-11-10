"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  type SessionEvent,
  type SessionEventInput,
  type SessionState,
  SESSION_STORAGE_KEY,
  emptySession,
  loadSession,
  markNotificationsRead,
  markThreadRead,
  parseSession,
  recordEvent,
  saveSession,
} from "./demo/session-store";
import {
  notificationsFor,
  sessionFormations,
  sessionListings,
  sessionLives,
  sessionServices,
  threadsFor,
} from "./demo/session-views";
import { CURRENT_USER_ID } from "./demo/identity";
import { resolveActorId } from "./demo/actors";

/* ── La mémoire de session, branchée sur React ──────────────────────────────

   Un magasin EXTERNE (module), lu par `useSyncExternalStore` :

   - **Pas d'erreur d'hydratation.** Le serveur, et le client pendant
     l'hydratation, lisent l'instantané serveur — une session vide (les
     données d'amorce seules). Le contenu de `localStorage` n'est lu qu'APRÈS,
     au premier instantané client ; React refait alors le rendu. Rien de ce
     qui est stocké dans le navigateur ne touche le HTML du serveur.
   - **Une seule source** pour toute l'application : la barre latérale,
     l'en-tête, la messagerie et /notifications s'abonnent au même magasin,
     donc « tout marquer comme lu » remet tous les compteurs à zéro ensemble.
   - **Pas de fournisseur à monter.** Un module, un hook. Les fonctions
     d'écriture (`recordSessionEvent`…) s'appellent aussi hors composant, par
     exemple depuis le contexte global (suivre quelqu'un).

   ── L'acteur ───────────────────────────────────────────────────────────────

   `actorId` est la personne au nom de qui on agit et dont on lit la
   messagerie : la personne INCARNÉE (chantier P3, « être un profil »). Léo
   par défaut — c'est toujours lui au rendu serveur et pendant l'hydratation.
   Le choix est mémorisé (`ACTOR_STORAGE_KEY`) et relu au premier instantané
   client, comme la session : jamais au rendu serveur. `incarnate(id)` change
   la personne ; toutes les vues prennent l'acteur en paramètre. */

/** La clé où le choix de la personne incarnée est mémorisé. */
export const ACTOR_STORAGE_KEY = "edome_actor.v1";

interface Snapshot {
  state: SessionState;
  actorId: string;
  /** Vrai une fois la session du navigateur relue. */
  hydrated: boolean;
}

const SERVER_SNAPSHOT: Snapshot = { state: emptySession(), actorId: CURRENT_USER_ID, hydrated: false };

let snapshot: Snapshot = SERVER_SNAPSHOT;
let loaded = false;
const listeners = new Set<() => void>();

function storage(): Storage | undefined {
  try {
    return typeof window === "undefined" ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  snapshot = { ...snapshot, state: loadSession(storage()), actorId: readStoredActor(), hydrated: true };
}

function readStoredActor(): string {
  try {
    return resolveActorId(storage()?.getItem(ACTOR_STORAGE_KEY));
  } catch {
    return CURRENT_USER_ID;
  }
}

function emit() {
  for (const l of listeners) l();
}

function setState(next: SessionState) {
  snapshot = { ...snapshot, state: next };
  saveSession(storage(), next);
  emit();
}

/* Un autre onglet a modifié la session (ou la personne incarnée) : on relit. */
function onStorage(e: StorageEvent) {
  if (e.key === ACTOR_STORAGE_KEY) {
    snapshot = { ...snapshot, actorId: resolveActorId(e.newValue) };
    emit();
    return;
  }
  if (e.key !== SESSION_STORAGE_KEY) return;
  snapshot = { ...snapshot, state: parseSession(e.newValue), hydrated: true };
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1 && typeof window !== "undefined") window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && typeof window !== "undefined") window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): Snapshot {
  ensureLoaded();
  return snapshot;
}

function getServerSnapshot(): Snapshot {
  return SERVER_SNAPSHOT;
}

/* ── Écrire ─────────────────────────────────────────────────────────────── */

/** Inscrit une action au journal, au nom de l'acteur courant, et la persiste.
    Renvoie l'événement (son `seq` donne l'id de l'objet créé). À appeler
    depuis un gestionnaire d'événement, jamais pendant un rendu. */
export function recordSessionEvent(input: SessionEventInput): SessionEvent {
  ensureLoaded();
  const { state, event } = recordEvent(snapshot.state, snapshot.actorId, input);
  setState(state);
  return event;
}

export function markNotificationsAsRead(ids: readonly string[]) {
  ensureLoaded();
  const next = markNotificationsRead(snapshot.state, ids);
  if (next !== snapshot.state) setState(next);
}

/** « Tout marquer comme lu » : toutes les notifications de l'acteur courant. */
export function markAllNotificationsAsRead() {
  ensureLoaded();
  markNotificationsAsRead(notificationsFor(snapshot.state, snapshot.actorId).map((n) => n.id));
}

export function markThreadAsRead(threadId: string, seen: number) {
  ensureLoaded();
  const next = markThreadRead(snapshot.state, snapshot.actorId, threadId, seen);
  if (next !== snapshot.state) setState(next);
}

/** Change la personne incarnée (chantier P3), sans mémoriser le choix. */
export function setSessionActor(actorId: string) {
  ensureLoaded();
  if (snapshot.actorId === actorId) return;
  snapshot = { ...snapshot, actorId };
  emit();
}

/** Entrer dans la peau de quelqu'un : la personne devient l'acteur (messagerie,
    notifications, actions, tableau de bord) et le choix est mémorisé. Un id
    inconnu ramène à Léo. À appeler depuis un gestionnaire d'événement. */
export function incarnate(personId: string) {
  const id = resolveActorId(personId);
  try {
    storage()?.setItem(ACTOR_STORAGE_KEY, id);
  } catch {
    /* Stockage indisponible : le changement vaut pour la visite en cours. */
  }
  setSessionActor(id);
}

/* Les clés des autres traces d'interaction de la démonstration (contexte
   global, brouillons). « Réinitialiser » les efface aussi, sinon un favori ou
   un suivi ajouté resterait alors que la notification correspondante
   disparaît. Le profil, la langue et la devise sont des préférences : gardés. */
const INTERACTION_KEYS = [
  "edome_favorites",
  "edome_favorites.v2",
  "edome_followedUsers.v2",
  "edome_followedUsers.v3",
  "edome_cart",
  "edome_referralLinks",
  "edome_pinnedPosts",
  "edome_hiddenPosts",
  "edome_publish_draft",
  "edome_formation_draft",
];

/** « Réinitialiser la démonstration » : vide la session et les traces
    d'interaction, puis recharge pour repartir des données d'amorce. */
export function resetDemo() {
  const s = storage();
  try {
    s?.removeItem(SESSION_STORAGE_KEY);
    for (const k of INTERACTION_KEYS) s?.removeItem(k);
  } catch {
    /* Stockage indisponible : la remise à zéro en mémoire suffit. */
  }
  snapshot = { ...snapshot, state: emptySession() };
  emit();
  if (typeof window !== "undefined") window.location.reload();
}

/* ── Lire ───────────────────────────────────────────────────────────────── */

/** La mémoire de session et ses vues, pour l'acteur courant. */
export function useSession() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => {
    const { state, actorId } = snap;
    const threads = threadsFor(state, actorId);
    const notifications = notificationsFor(state, actorId);
    return {
      hydrated: snap.hydrated,
      actorId,
      state,
      threads,
      notifications,
      /** LE compteur de notifications non lues. */
      unreadNotifications: notifications.filter((n) => !n.read).length,
      unreadMessages: threads.reduce((s, t) => s + t.unreadCount, 0),
      listings: sessionListings(state),
      services: sessionServices(state),
      formations: sessionFormations(state),
      lives: sessionLives(state),
    };
  }, [snap]);
}
