/* ── Suivi des annonces — constantes partagées (client-safe) ─────────────────
   · `ed_vid` : identifiant ALÉATOIRE du navigateur (aucune adresse IP stockée),
     pour compter des visiteurs uniques.
   · `ed_ref` : le lien d'apporteur par lequel on est arrivé, par bien, gardé
     60 jours — c'est la preuve du lien de causalité (art. 413 CO). */

export const VISITOR_COOKIE = "ed_vid";
export const REF_COOKIE = "ed_ref";
export const REF_DAYS = 60;
export const TRACK_KINDS = ["vue", "partage", "video", "contact"] as const;
export type TrackKind = (typeof TRACK_KINDS)[number];

export const isTrackKind = (k: unknown): k is TrackKind => typeof k === "string" && (TRACK_KINDS as readonly string[]).includes(k);
export const isRefCode = (c: unknown): c is string => typeof c === "string" && /^[a-z0-9]{6,12}$/.test(c);
export const isUuid = (s: unknown): s is string => typeof s === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

/** Lit le cookie d'attribution : { [propertyId]: code }. Tolère un cookie abîmé. */
export function parseRefCookie(raw: string | undefined | null): Record<string, string> {
  if (!raw) return {};
  try {
    const v = JSON.parse(decodeURIComponent(raw)) as unknown;
    if (!v || typeof v !== "object") return {};
    const out: Record<string, string> = {};
    for (const [k, c] of Object.entries(v as Record<string, unknown>)) if (isUuid(k) && isRefCode(c)) out[k] = c;
    return out;
  } catch {
    return {};
  }
}

/** Ajoute (ou remplace) l'attribution d'un bien ; garde au plus 30 biens. */
export function withRef(map: Record<string, string>, propertyId: string, code: string): string {
  const next = { ...map, [propertyId]: code };
  const keys = Object.keys(next);
  for (const k of keys.slice(0, Math.max(0, keys.length - 30))) delete next[k];
  return encodeURIComponent(JSON.stringify(next));
}

/** Code de lien lisible : 8 caractères, sans ambiguïté (pas de 0/o, 1/l). */
export function newRefCode(rand: () => number = Math.random): string {
  const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";
  return Array.from({ length: 8 }, () => alphabet[Math.floor(rand() * alphabet.length)]).join("");
}
