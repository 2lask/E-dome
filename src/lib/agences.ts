/* ── ESPACE AGENCE — modèle partagé (client-safe) ────────────────────────────

   Le programme d'apporteurs clé en main (migration 006). Une agence a :
     · une page publique à son nom : /agences/<adresse> ;
     · des recherches de vendeurs à récompense (le moteur des recherches) ;
     · des biens avec prime (le moteur des primes) ;
     · un tableau de suivi des recommandations reçues.
   Rien de nouveau dans le moteur : l'agence en est l'utilisatrice la plus
   intensive, et la seule qui paie un abonnement (formule à frais fixes). */

export interface Agency {
  id: string;
  ownerId: string;
  slug: string;
  name: string;
  city: string;
  zone: string;
  description: string;
  website: string | null;
  phone: string | null;
  publicEmail: string | null;
  uidNumber: string | null;
  verified: boolean;
  plan: "pilote" | "pro";
  createdAt: string;
}

/** Adresses qui ne peuvent pas désigner une agence (routes, marques, ambiguïtés). */
export const RESERVED_SLUGS = new Set([
  "admin", "agence", "agences", "api", "aide", "auth", "e-dome", "edome", "explorer", "gagner",
  "nouvelle", "parametres", "profil", "recherches", "support", "tarifs",
]);

/** « Régie du Lac SA » → « regie-du-lac-sa ». */
export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
}

export function isValidSlug(s: string): boolean {
  return /^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/.test(s) && !RESERVED_SLUGS.has(s);
}

/** Numéro IDE suisse : CHE-123.456.789 (contrôle de forme, pas de registre). */
export function isValidUid(s: string): boolean {
  return /^CHE-?\d{3}\.?\d{3}\.?\d{3}$/i.test(s.trim());
}

export function normalizeUid(s: string): string {
  const d = s.replace(/\D/g, "");
  return d.length === 9 ? `CHE-${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}` : s.trim().toUpperCase();
}

/** Le suivi du programme, vu par l'agence. */
export interface AgencyStats {
  sellerSearches: number;
  proposals: number;
  pending: number;
  accepted: number;
  /** Récompenses acceptées (dues aux apporteurs), en CHF. */
  dueChf: number;
  listings: number;
  primedListings: number;
}
