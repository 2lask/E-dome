import "server-only";
import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/* ── Porte d'entrée de /admin/leads ─────────────────────────────────────────

   Un mot de passe unique dans `ADMIN_PASSWORD`, vérifié côté serveur. C'est
   volontairement modeste : cette page liste des contacts, elle ne pilote pas
   la plateforme. Le jour où plusieurs personnes doivent y accéder, il faudra
   de vrais comptes et un rôle en base — pas un mot de passe partagé.

   Deux précautions valent la peine d'être expliquées.

   1. La comparaison passe par un condensé de longueur fixe et
      `timingSafeEqual`. Comparer deux chaînes avec `===` sort au premier
      caractère différent, ce qui laisse fuiter la longueur et le préfixe par
      le temps de réponse. Le condensé préalable est nécessaire parce que
      `timingSafeEqual` exige des tampons de même taille.

   2. Le cookie de session ne contient pas le mot de passe mais un HMAC
      calculé avec lui. Il est donc vérifiable sans rien stocker côté
      serveur, et changer `ADMIN_PASSWORD` invalide immédiatement toutes les
      sessions ouvertes.

   `httpOnly` : le cookie est inaccessible au JavaScript de la page.
   `sameSite: "lax"` : il ne part pas sur une requête déclenchée par un autre
   site. */

const COOKIE_NAME = "edome_admin";
const MAX_AGE_SECONDS = 60 * 60 * 8;
const SESSION_PAYLOAD = "admin-leads-v1";

function password(): string | null {
  const value = process.env.ADMIN_PASSWORD;
  return value && value.length > 0 ? value : null;
}

export function isAdminConfigured(): boolean {
  return password() !== null;
}

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

function sessionToken(secret: string): string {
  return createHmac("sha256", secret).update(SESSION_PAYLOAD).digest("hex");
}

/** Comparaison à temps constant, sur des condensés de taille identique. */
function sameSecret(a: string, b: string): boolean {
  return timingSafeEqual(digest(a), digest(b));
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const secret = password();
  if (!secret) return false;

  const cookie = (await cookies()).get(COOKIE_NAME)?.value;
  if (!cookie) return false;

  return sameSecret(cookie, sessionToken(secret));
}

/** `true` si le mot de passe est correct ; pose alors le cookie de session. */
export async function signInAdmin(attempt: string): Promise<boolean> {
  const secret = password();
  if (!secret) return false;
  if (!sameSecret(attempt, secret)) return false;

  (await cookies()).set(COOKIE_NAME, sessionToken(secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: MAX_AGE_SECONDS,
  });
  return true;
}

export async function signOutAdmin(): Promise<void> {
  (await cookies()).delete({ name: COOKIE_NAME, path: "/admin" });
}
