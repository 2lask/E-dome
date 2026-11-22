import type { Property, PropertyType, TransactionType, Currency, User } from "./types";
import type { PlatformRole } from "./model/identity";
import type { SessionUser } from "./session-user";
import { initialsAvatar } from "./current-user-profile";
import { EDOME_PRIME_SHARE, PRIME_FLOOR } from "./pricing/catalog";
import type { CommissionTerms } from "./commission";

/* ── Biens EN BASE (chantier C4) ─────────────────────────────────────────────

   Le pont « table `properties` » → modèle d'affichage, côté client (aucune
   dépendance serveur ni démo). `MyProperty` est la forme plate renvoyée par les
   actions serveur (`property-actions.ts`) ; `propertyFromMine` l'habille en
   `Property` complet (avec son hôte) pour l'Explorer et les fiches. */

/** Une ligne de `properties`, mise à plat pour le client. */
export interface MyProperty {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  transactionType: TransactionType;
  price: number;
  currency: Currency;
  city: string;
  country: string;
  address?: string;
  lat?: number;
  lng?: number;
  images: string[];
  videos: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string[];
  featured: boolean;
  soldTo?: string | null;
  createdAt: string;
  /** Commission active, en CHF (fixe, ou estimation au prix demandé si %). */
  activePrimeChf?: number | null;
  /** Les conditions complètes de la commission active (v2), si jointes. */
  commission?: CommissionTerms | null;
  /** Données déclarées par le vendeur à la publication (rendement, DPE…). */
  analytics?: Record<string, unknown> | null;
  /** L'id du vendeur (toujours présent en lecture). */
  hostId?: string;
  /** L'hôte, si l'action a joint le profil (fiche publique). */
  host?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    city: string | null;
    country: string;
    roles: string[];
    activeRole: string;
  };
}

/** Une prime apporteur posée sur un de MES biens (table `primes`). Montant fixe
    en CHF (50–3000), jamais un % du prix — règle juridique (`MODELE.md`). */
export interface MyPrime {
  propertyId: string;
  /** Montant fixe, ou estimation au prix demandé pour un pourcentage. */
  amountChf: number;
  active: boolean;
  terms: CommissionTerms;
}

/** Bornes de la prime fixe (CHF), alignées sur la contrainte SQL `primes`. */
export const PRIME_MIN_CHF = 50;
export const PRIME_MAX_CHF = 3000;

/** Une prime n'a de sens que sur un bien à la vente ou en location longue durée
    (la courte durée relève de la marketplace, pas de l'apport). */
export function primeEligible(transactionType: TransactionType): boolean {
  return transactionType === "vente" || transactionType === "location-lt";
}

/** Le NET en CHF que touche l'apporteur sur une prime : E-Dome retient
    `max(EDOME_PRIME_SHARE, PRIME_FLOOR)` à l'intérieur de la prime, le reste
    revient à l'apporteur (même règle que le moteur `quote()` — jamais ajouté au
    prix, jamais prélevé sur l'apporteur au-delà de cette part). */
export function apporteurNetChf(amountChf: number): number {
  const cents = Math.round(amountChf * 100);
  const edomeCents = Math.max(Math.round(cents * EDOME_PRIME_SHARE), PRIME_FLOOR.cents);
  return Math.max(0, cents - edomeCents) / 100;
}

/** Un bien à prime active, tel que le voit un apporteur (table `primes` jointe
    au bien et à son vendeur). */
export interface PrimedProperty {
  primeId: string;
  propertyId: string;
  title: string;
  city: string;
  transactionType: TransactionType;
  cover: string;
  amountChf: number;
  sellerId: string;
  sellerName: string;
}

/** Une mise en relation que J'AI proposée (table `introductions`). */
export interface MyIntroduction {
  id: string;
  propertyTitle: string;
  contactLabel: string;
  status: "proposee" | "acceptee" | "refusee" | "contestee";
  amountChf: number;
  createdAt: string;
}

/** Ce que le formulaire de publication envoie à la base. */
export interface NewPropertyInput {
  title: string;
  description: string;
  type: PropertyType;
  transactionType: TransactionType;
  price: number;
  currency?: Currency;
  city: string;
  country?: string;
  address?: string;
  images: string[];
  videos?: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string[];
  analytics?: Record<string, unknown> | null;
}

/* Image de repli par type de bien, quand l'annonce n'a pas de photo — mêmes
   visuels que les annonces publiées en démonstration, pour l'homogénéité. */
const DEFAULT_IMAGE: Record<string, string> = {
  appartement: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
  studio: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
  maison: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
  villa: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
  chalet: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop",
};
export const FALLBACK_IMAGE = DEFAULT_IMAGE.appartement!;

/** L'image de couverture d'un bien : sa 1re photo, sinon un visuel par défaut. */
export function coverOf(m: Pick<MyProperty, "images" | "type">): string {
  return m.images[0] ?? DEFAULT_IMAGE[m.type] ?? FALLBACK_IMAGE;
}

/** Un `User` d'affichage construit depuis le compte connecté (hôte d'un bien
    que l'on vient de publier). Aucun chiffre inventé. */
export function userFromSession(u: SessionUser): User {
  const roles = (u.roles.length ? u.roles : ["particulier"]) as PlatformRole[];
  return {
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email ?? "",
    avatar: u.avatar || initialsAvatar(u.firstName, u.lastName),
    city: u.city ?? "",
    country: u.country,
    roles,
    activeRole: (u.activeRole || "particulier") as PlatformRole,
    stats: { followers: 0, following: 0, properties: 0, reviews: 0, rating: 0, transactions: 0, revenue: 0 },
    bio: u.bio ?? "",
  };
}

/** Un `User` d'affichage depuis l'hôte joint par l'action serveur. */
function hostUser(h: NonNullable<MyProperty["host"]>): User {
  return {
    id: h.id,
    firstName: h.firstName,
    lastName: h.lastName,
    email: "",
    avatar: h.avatar || initialsAvatar(h.firstName, h.lastName),
    city: h.city ?? "",
    country: h.country,
    roles: (h.roles.length ? h.roles : ["particulier"]) as PlatformRole[],
    activeRole: (h.activeRole || "particulier") as PlatformRole,
    stats: { followers: 0, following: 0, properties: 0, reviews: 0, rating: 0, transactions: 0, revenue: 0 },
    bio: "",
  };
}

/** Habille un bien plat en `Property` complet. L'hôte vient, par ordre : de
    l'argument `host`, sinon de l'hôte joint par l'action, sinon un hôte minimal
    (fiche d'annuaire indisponible). Un bien RÉEL démarre sans note ni avis. */
export function propertyFromMine(m: MyProperty, host?: User): Property {
  const h: User =
    host ??
    (m.host ? hostUser(m.host) : {
      id: "",
      firstName: "", lastName: "", email: "",
      avatar: initialsAvatar("", ""),
      city: m.city, country: m.country,
      roles: ["particulier"] as PlatformRole[],
      activeRole: "particulier" as PlatformRole,
      stats: { followers: 0, following: 0, properties: 0, reviews: 0, rating: 0, transactions: 0, revenue: 0 },
      bio: "",
    });
  return {
    id: m.id,
    title: m.title,
    description: m.description || "Annonce publiée sur E-Dome.",
    type: m.type,
    transactionType: m.transactionType,
    price: m.price,
    currency: m.currency,
    location: { city: m.city, country: m.country, address: m.address, lat: m.lat, lng: m.lng },
    images: m.images.length > 0 ? m.images : [coverOf(m)],
    videos: m.videos,
    host: h,
    bedrooms: m.bedrooms,
    bathrooms: m.bathrooms,
    area: m.area,
    amenities: m.amenities,
    rating: 0,
    reviewCount: 0,
    featured: m.featured,
    soldTo: m.soldTo ?? undefined,
  };
}

/** Un id de bien EN BASE est un UUID (ni `prop…` du catalogue, ni `s-…` de
    session). Sert aux écrans à décider s'ils doivent interroger la base. */
export function isDbPropertyId(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

/* ── Reprise de bail (lancement 2026-11) ─────────────────────────────────────
   Un locataire qui part cherche un locataire de remplacement (art. 264 CO).
   Stockée comme une location longue durée, avec `analytics.reprise = true`,
   la date de disponibilité et la régie — aucune migration nécessaire. */

export interface RepriseInfo {
  availableFrom: string | null;
  regie: string | null;
}

export function repriseOf(m: Pick<MyProperty, "analytics" | "transactionType">): RepriseInfo | null {
  const a = (m.analytics ?? {}) as Record<string, unknown>;
  if (m.transactionType !== "location-lt" || a.reprise !== true) return null;
  return {
    availableFrom: typeof a.availableFrom === "string" && a.availableFrom ? a.availableFrom : null,
    regie: typeof a.regie === "string" && a.regie.trim() ? a.regie.trim() : null,
  };
}

const MOIS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

/** « 1er déc. 2026 » — format déterministe (identique serveur et navigateur). */
export function frDay(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d === 1 ? "1er" : d} ${MOIS[m - 1]} ${y}`;
}

/** Les villes de lancement, proposées en premier dans l'Explorer. */
export const LAUNCH_CITIES = ["Neuchâtel", "Lausanne"];
