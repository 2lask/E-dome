import "server-only";
import { createHmac, randomBytes } from "node:crypto";
import type { LeadStore } from "./types";

/* ── Limitation des envois ──────────────────────────────────────────────────

   Le compteur vivait en mémoire du processus. Sur Vercel, deux requêtes
   tombent volontiers sur deux instances différentes et une instance froide
   démarre avec un compteur vide : la limite ne tenait pas. Elle est
   désormais tenue en base, partagée par toutes les instances.

   Ce qui est enregistré : une empreinte de l'adresse IP et un horodatage.
   Jamais l'adresse elle-même.

   L'empreinte est un HMAC-SHA256 avec un sel secret (`LEAD_IP_SALT`), pas un
   simple condensé. La distinction compte : il n'existe que quatre milliards
   d'adresses IPv4, qu'un condensé nu laisse retrouver par force brute en
   quelques minutes. Sans le sel, personne ne peut remonter d'une empreinte à
   une adresse, même avec un accès en lecture à la base.

   Si le sel manque, on ne stocke rien : écrire un condensé non salé
   équivaudrait à stocker l'adresse. On retombe alors sur le compteur mémoire,
   avec une erreur en console en production. C'est une dégradation, pas une
   solution — renseignez le sel.

   Cette limite freine les rafales et les robots ; elle ne remplace pas la
   contrainte d'unicité sur l'adresse e-mail, qui reste la vraie protection
   contre les doublons. */

/** Fenêtre d'observation : la dernière heure. */
export const WINDOW_MS = 60 * 60 * 1000;
/** Envois tolérés par empreinte sur la fenêtre. */
export const MAX_PER_WINDOW = 5;

/** Au-delà de cet âge, une empreinte ne sert plus à rien et peut partir. */
const RETENTION_MS = 24 * 60 * 60 * 1000;
/** Une purge sur vingt appels : suffisant pour borner la table sans peser. */
const PURGE_PROBABILITY = 0.05;

/* ── Empreinte ──────────────────────────────────────────────────────────── */

/* Sel de repli, tiré au démarrage du processus. Il rend les empreintes
   inutilisables d'une instance à l'autre — c'est justement pourquoi on ne
   les écrit pas en base dans ce cas. */
const fallbackSalt = randomBytes(32).toString("hex");
let missingSaltReported = false;

function salt(): string | null {
  const value = process.env.LEAD_IP_SALT;
  return value && value.length >= 16 ? value : null;
}

/** `true` quand le sel est configuré, donc quand l'empreinte est stockable. */
export function isFingerprintStorable(): boolean {
  return salt() !== null;
}

/**
 * Extrait l'adresse du client derrière le proxy, et la hache.
 *
 * `x-forwarded-for` peut contenir une liste ; la première valeur est celle du
 * client d'origine. L'en-tête est falsifiable en théorie, mais il est réécrit
 * par la plateforme en production.
 */
export function ipFingerprint(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || headers.get("x-real-ip") || "inconnu";
  const secret = salt();

  if (!secret && !missingSaltReported) {
    missingSaltReported = true;
    const message =
      "[leads] LEAD_IP_SALT absent ou trop court (16 caractères minimum). La limite de débit retombe sur un compteur en mémoire, non partagé entre instances.";
    if (process.env.NODE_ENV === "production") console.error(message);
    else console.warn(message);
  }

  return createHmac("sha256", secret ?? fallbackSalt).update(ip).digest("hex");
}

/* ── Compteur mémoire, utilisé seulement en repli ────────────────────────── */

const MAX_TRACKED_KEYS = 5_000;
const hits = new Map<string, number[]>();

function allowInMemory(fingerprint: string): boolean {
  const now = Date.now();

  if (hits.size > MAX_TRACKED_KEYS) {
    for (const [key, times] of hits) {
      const kept = times.filter((t) => now - t < WINDOW_MS);
      if (kept.length === 0) hits.delete(key);
      else hits.set(key, kept);
    }
  }

  const times = (hits.get(fingerprint) ?? []).filter((t) => now - t < WINDOW_MS);
  if (times.length >= MAX_PER_WINDOW) {
    hits.set(fingerprint, times);
    return false;
  }

  times.push(now);
  hits.set(fingerprint, times);
  return true;
}

/* ── Point d'entrée ─────────────────────────────────────────────────────── */

/**
 * `false` quand cette empreinte a dépassé le seuil sur la dernière heure.
 *
 * Une panne du stockage ne bloque pas les inscriptions : on laisse passer et
 * on journalise. Perdre une manifestation d'intérêt à cause d'un incident sur
 * le compteur coûterait plus cher que de laisser filer quelques envois.
 */
export async function allowSubmission(store: LeadStore, fingerprint: string): Promise<boolean> {
  if (!isFingerprintStorable()) return allowInMemory(fingerprint);

  const since = new Date(Date.now() - WINDOW_MS);

  try {
    const recent = await store.countRecentSubmissions(fingerprint, since);
    if (recent >= MAX_PER_WINDOW) return false;

    await store.recordSubmission(fingerprint);

    if (Math.random() < PURGE_PROBABILITY) {
      await store.purgeSubmissions(new Date(Date.now() - RETENTION_MS));
    }
    return true;
  } catch (error) {
    console.error("[leads] limite de débit indisponible, envoi accepté", error);
    return true;
  }
}

/** Remet le compteur mémoire à zéro. Réservé aux tests. */
export function resetRateLimit(): void {
  hits.clear();
}
