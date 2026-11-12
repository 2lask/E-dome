import type { Property, TransactionType } from "@/lib/types";

/* ── Ce qu'une annonce dit d'elle-même (chantier P6b) ──────────────────────

   Fonctions PURES sur une annonce et un catalogue passés en paramètre : le
   loyer et ses charges, le nombre de pièces à la suisse, les biens similaires
   et le rendement brut estimé. Aucune ne lit le navigateur ni l'horloge —
   elles sont testées par `tests/data/p6b-poles.test.ts`.

   Rien n'est écrit en dur : le rendement d'un bien à vendre se calcule sur les
   loyers RÉELS des annonces de location longue durée voisines du catalogue.
   Un chiffre « déclaré » ne peut donc plus contredire un chiffre affiché. */

// ─── L'unité du prix ─────────────────────────────────────────────────────────

/** « / nuit », « / mois », ou rien pour une vente. Une longue durée ne dit jamais « nuit ». */
export function priceUnit(t: TransactionType): "" | " / nuit" | " / mois" {
  return t === "location-ct" ? " / nuit" : t === "location-lt" ? " / mois" : "";
}

// ─── Le loyer et ses charges ─────────────────────────────────────────────────

export interface RentBreakdown {
  /** Ce que paie le locataire chaque mois (le prix affiché). */
  totalChf: number;
  /** Loyer net, hors charges. Égal au total si les charges ne sont pas précisées. */
  netChf: number;
  /** Acompte de charges, s'il est précisé dans l'annonce. */
  chargesChf?: number;
}

const toInt = (s: string) => Number(s.replace(/[^\d]/g, ""));

/**
 * Le loyer d'une location longue durée, lu dans l'annonce : « Loyer 1 940 CHF +
 * 150 CHF de charges ». Le prix catalogue est le total charges comprises ; on
 * ne garde la ventilation que si elle retombe exactement sur ce total.
 */
export function rentBreakdown(p: Pick<Property, "transactionType" | "price" | "description">): RentBreakdown | null {
  if (p.transactionType !== "location-lt") return null;
  const m = p.description.match(/loyer\s+([\d'’\s  ]+?)\s*CHF\s*\+\s*([\d'’\s  ]+?)\s*CHF\s+de\s+charges/i);
  if (m) {
    const net = toInt(m[1]!);
    const charges = toInt(m[2]!);
    if (net > 0 && net + charges === p.price) return { totalChf: p.price, netChf: net, chargesChf: charges };
  }
  return { totalChf: p.price, netChf: p.price };
}

// ─── Les pièces, à la suisse ─────────────────────────────────────────────────

/**
 * Nombre de pièces au sens suisse (3,5 pièces = deux chambres, un séjour, une
 * cuisine). Lu dans le titre quand il est écrit (« 4,5 pièces »), sinon déduit :
 * un studio compte une pièce, un logement « chambres + 1,5 ».
 */
export function roomsOf(p: Pick<Property, "title" | "type" | "bedrooms">): number {
  const m = p.title.match(/(\d+)(?:[,.](5))?\s*pi[eè]ces?/i);
  if (m) return Number(m[1]) + (m[2] ? 0.5 : 0);
  if (p.type === "studio" || p.bedrooms <= 0) return 1;
  return p.bedrooms + 1.5;
}

/** « 3,5 pièces », « 1 pièce ». */
export function roomsLabel(n: number): string {
  const s = String(n).replace(".", ",");
  return `${s} pièce${n > 1 ? "s" : ""}`;
}

// ─── Distances ───────────────────────────────────────────────────────────────

type Located = Pick<Property, "location">;

/** Distance à vol d'oiseau en km, ou `undefined` si l'un des deux n'a pas de coordonnées. */
export function distanceKm(a: Located, b: Located): number | undefined {
  const { lat: la, lng: oa } = a.location;
  const { lat: lb, lng: ob } = b.location;
  if (la == null || oa == null || lb == null || ob == null) return undefined;
  const R = 6371;
  const dLat = ((lb - la) * Math.PI) / 180;
  const dLng = ((ob - oa) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos((la * Math.PI) / 180) * Math.cos((lb * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Distance utilisable pour un tri : même ville = 0, inconnue = loin. */
function sortDistance(a: Property, b: Property): number {
  const d = distanceKm(a, b);
  if (d !== undefined) return d;
  return a.location.city === b.location.city ? 0 : 300;
}

// ─── Biens similaires ────────────────────────────────────────────────────────

/**
 * Les biens similaires : TOUJOURS le même type de transaction (on ne propose
 * pas un chalet à la nuit à côté d'un appartement à l'année), encore
 * disponibles, puis les plus proches — en distance et en gamme de prix.
 */
export function similarListings(p: Property, pool: readonly Property[], n = 3): Property[] {
  return pool
    .filter((x) => x.id !== p.id && !x.soldTo && x.transactionType === p.transactionType)
    .map((x) => {
      const priceGap = p.price > 0 && x.price > 0 ? Math.abs(Math.log(x.price / p.price)) : 1;
      const score = sortDistance(p, x) / 25 + priceGap * 3 + (x.type === p.type ? 0 : 0.5);
      return { x, score };
    })
    .sort((a, b) => a.score - b.score || a.x.id.localeCompare(b.x.id))
    .slice(0, n)
    .map((s) => s.x);
}

// ─── Rendement brut ──────────────────────────────────────────────────────────

/** Rendement brut en %, arrondi au dixième : loyer annuel / prix. */
export function grossYieldPct(annualRentChf: number, priceChf: number): number {
  if (!(priceChf > 0) || !(annualRentChf > 0)) return 0;
  return Math.round((annualRentChf / priceChf) * 1000) / 10;
}

export interface Comparable {
  property: Property;
  netChf: number;
  perM2: number;
  km?: number;
}

/** Rayon dans lequel une location longue durée sert de comparable. */
export const COMPARABLE_RADIUS_KM = 40;

/**
 * Les loyers comparables d'un bien : les locations longue durée du catalogue
 * dans un rayon de 40 km ; à défaut, les trois plus proches.
 */
export function comparablesFor(p: Property, pool: readonly Property[]): Comparable[] {
  const all: Comparable[] = [];
  for (const x of pool) {
    if (x.transactionType !== "location-lt" || x.id === p.id || !(x.area > 0)) continue;
    const r = rentBreakdown(x)!;
    all.push({ property: x, netChf: r.netChf, perM2: r.netChf / x.area, km: distanceKm(p, x) });
  }
  const sorted = all.sort((a, b) => (a.km ?? 999) - (b.km ?? 999) || a.property.id.localeCompare(b.property.id));
  const near = sorted.filter((c) => c.km !== undefined && c.km <= COMPARABLE_RADIUS_KM);
  return near.length > 0 ? near : sorted.slice(0, 3);
}

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid]! : (s[mid - 1]! + s[mid]!) / 2;
};

export interface YieldEstimate {
  /** Rendement brut estimé, en %. */
  pct: number;
  /** Loyer mensuel net estimé, en CHF entiers. */
  monthlyRentChf: number;
  /** Loyer médian au m² des comparables, CHF / m² / mois (un décimal). */
  perM2: number;
  comparables: Comparable[];
}

/**
 * Le rendement brut estimé d'un bien à vendre : loyer au m² médian des
 * comparables × surface × 12, rapporté au prix. `null` pour une location, un
 * bien vendu ou sans surface : on ne fabrique pas un rendement.
 */
export function estimateYield(p: Property, pool: readonly Property[]): YieldEstimate | null {
  if (p.transactionType !== "vente" || !(p.area > 0) || !(p.price > 0) || p.currency !== "CHF") return null;
  const comparables = comparablesFor(p, pool);
  if (comparables.length === 0) return null;
  const perM2 = median(comparables.map((c) => c.perM2));
  const monthlyRentChf = Math.round(perM2 * p.area);
  return {
    pct: grossYieldPct(monthlyRentChf * 12, p.price),
    monthlyRentChf,
    perM2: Math.round(perM2 * 10) / 10,
    comparables,
  };
}

/** Ton du badge de rendement : neutre sous 3 %, informatif ensuite, positif dès 4 %. */
export function yieldTone(pct: number): "success" | "info" | "neutral" {
  return pct >= 4 ? "success" : pct >= 3 ? "info" : "neutral";
}

/** « 3,2 % » — virgule décimale, sans `toLocaleString`. */
export const pctLabel = (pct: number): string => `${pct.toFixed(1).replace(".", ",")} %`;

// ─── Créneaux de visite ──────────────────────────────────────────────────────

export interface VisitSlot {
  /** AAAA-MM-JJ */
  date: string;
  /** HH:MM */
  time: string;
  /** « jeu. 1 oct. · 17:30 » — formaté à la main, identique serveur et navigateur. */
  label: string;
}

const DAYS = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."] as const;
const MONTHS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."] as const;

/**
 * Les créneaux proposés par le propriétaire : les prochains jours après
 * `from` (l'horloge de la démonstration), en soirée en semaine et le matin le
 * samedi, jamais le dimanche. Déterministe : aucun `Date.now()`.
 */
export function visitSlots(from: Date, n = 4): VisitSlot[] {
  const out: VisitSlot[] = [];
  for (let d = 1; out.length < n && d < 30; d++) {
    const day = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate() + d));
    const dow = day.getUTCDay();
    if (dow === 0) continue;
    if (dow !== 6 && d % 2 === 0) continue; // un soir sur deux en semaine
    const time = dow === 6 ? "10:00" : "18:00";
    const date = day.toISOString().slice(0, 10);
    out.push({ date, time, label: `${DAYS[dow]} ${day.getUTCDate()} ${MONTHS[day.getUTCMonth()]} · ${time}` });
  }
  return out;
}
