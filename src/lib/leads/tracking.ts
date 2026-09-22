/* Parrainage et paramètres UTM — constantes et utilitaires partagés.

   Pas de `server-only` ici : ce module est importé par le composant client qui
   pose les cookies ET par la Server Action qui les relit. */

export const REF_COOKIE = "edome_ref";
export const UTM_COOKIE = "edome_utm";

/** 30 jours, comme annoncé dans la politique de confidentialité. */
export const REF_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export const REF_QUERY_PARAM = "ref";

export interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
}

const UTM_KEYS = ["source", "medium", "campaign", "content"] as const;

/** Borne la longueur et retire ce qui n'a pas sa place dans un UTM. */
function clean(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim().slice(0, 120);
  return trimmed.length > 0 ? trimmed : undefined;
}

/** Lit les `utm_*` d'une chaîne de requête. */
export function readUtmFromSearch(search: string): UtmParams {
  const params = new URLSearchParams(search);
  const out: UtmParams = {};
  for (const key of UTM_KEYS) {
    const value = clean(params.get(`utm_${key}`));
    if (value) out[key] = value;
  }
  return out;
}

export function hasUtm(utm: UtmParams): boolean {
  return UTM_KEYS.some((k) => Boolean(utm[k]));
}

export function serializeUtm(utm: UtmParams): string {
  return encodeURIComponent(JSON.stringify(utm));
}

/**
 * Relit le cookie UTM. Tolérant par construction : un cookie corrompu ou
 * bricolé ne doit jamais faire échouer un envoi de formulaire, il est
 * simplement ignoré.
 */
export function parseUtmCookie(raw: string | undefined): UtmParams {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(raw));
    if (!parsed || typeof parsed !== "object") return {};
    const source = parsed as Record<string, unknown>;
    const out: UtmParams = {};
    for (const key of UTM_KEYS) {
      const value = source[key];
      if (typeof value === "string") {
        const cleaned = clean(value);
        if (cleaned) out[key] = cleaned;
      }
    }
    return out;
  } catch {
    return {};
  }
}

/** Construit le lien de parrainage à partager. */
export function buildReferralUrl(baseUrl: string, refCode: string): string {
  const url = new URL(baseUrl);
  url.searchParams.set(REF_QUERY_PARAM, refCode);
  return url.toString();
}
