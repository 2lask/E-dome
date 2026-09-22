import "server-only";
import { createHash } from "node:crypto";

/* ── Limitation des envois, au mieux ────────────────────────────────────────

   TODO — ce n'est PAS une vraie limite de débit, et il faut le savoir.

   Le compteur vit dans la mémoire du processus. Sur Vercel, deux requêtes
   peuvent tomber sur deux instances différentes, et une instance froide
   démarre avec un compteur vide : quelqu'un de déterminé passe à travers.
   C'est exactement le défaut déjà identifié sur les quotas de l'assistant IA,
   dont le compteur souffre du même problème.

   Ce que ce module apporte réellement : il freine les rafales accidentelles
   (double-clic, formulaire renvoyé en boucle) et les robots naïfs. La
   protection sérieuse contre les doublons est ailleurs — contrainte
   d'unicité sur l'adresse e-mail en base, qui transforme un second envoi en
   mise à jour.

   Pour une vraie limite partagée entre instances, il faudra un compteur
   externe (Upstash Redis ou Vercel KV). Le même composant servirait alors à
   protéger `/api/ai/chat`, actuellement sans aucune limite.

   L'adresse IP est hachée avant d'être utilisée comme clé, et rien n'est
   écrit en base : aucune adresse IP n'est conservée, ni en clair ni hachée.
   C'est volontaire, pour ne pas avoir à déclarer une donnée de plus dans la
   politique de confidentialité. */

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
/** Garde-fou mémoire : au-delà, on vide les entrées expirées. */
const MAX_TRACKED_KEYS = 5_000;

const hits = new Map<string, number[]>();

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

/**
 * Extrait l'adresse du client derrière le proxy Vercel.
 *
 * `x-forwarded-for` peut contenir une liste ; la première valeur est celle du
 * client d'origine. L'en-tête est falsifiable en théorie, mais il est réécrit
 * par la plateforme en production.
 */
export function clientKeyFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || headers.get("x-real-ip") || "inconnu";
  return hashIp(ip);
}

function sweep(now: number) {
  for (const [key, times] of hits) {
    const kept = times.filter((t) => now - t < WINDOW_MS);
    if (kept.length === 0) hits.delete(key);
    else hits.set(key, kept);
  }
}

/** `false` quand l'appelant a dépassé le seuil sur la fenêtre courante. */
export function allowSubmission(key: string): boolean {
  const now = Date.now();

  if (hits.size > MAX_TRACKED_KEYS) sweep(now);

  const times = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (times.length >= MAX_PER_WINDOW) {
    hits.set(key, times);
    return false;
  }

  times.push(now);
  hits.set(key, times);
  return true;
}

/** Remet les compteurs à zéro. Réservé aux tests. */
export function resetRateLimit(): void {
  hits.clear();
}
