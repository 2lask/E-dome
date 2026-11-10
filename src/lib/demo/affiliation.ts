import {
  AFFILIATION_RATES,
  APPORTEUR_SUBSCRIPTION_SHARES,
  APPORTEUR_WINDOW_MONTHS,
  EDOME_PRIME_SHARE,
  PLANS,
  PRIME_DISPUTE,
  PRIME_MANUAL_REVIEW_ABOVE,
  clampAffiliationRate,
  primeChf,
  primeEligibility,
  quote,
  type CommissionPole,
} from "@/lib/pricing";
import { chf } from "@/lib/model/billing";
import { formations as CATALOGUE_FORMATIONS, properties as CATALOGUE } from "@/lib/mock-data";
import { EVENTS } from "@/lib/data/events";
import type { Property } from "@/lib/types";
import { DEMO_TODAY } from "./clock";
import { personById } from "./directory";
import {
  formationIdOf,
  liveIdOf,
  serviceIdOf,
  sessionTime,
  type SessionEvent,
  type SessionState,
} from "./session-store";
import { sessionListings } from "./session-views";

/* ── LE MODÈLE ÉCONOMIQUE VISIBLE — la source unique de l'affiliation (P4a) ──

   Deux mécaniques, jamais confondues (D14) :

   · BIENS — une PRIME en francs, fixée par le vendeur, facturée seulement
     quand il ACCEPTE une mise en relation. Jamais un pourcentage, jamais liée
     à la vente. E-Dome en retient `EDOME_PRIME_SHARE` à l'intérieur.
   · MARKETPLACE — un POURCENTAGE du prix, sortant de la marge du vendeur ;
     la commission d'E-Dome ne bouge pas. Toujours résolu au NET en CHF pour
     l'apporteur : le pourcentage n'explique que.
   · (et les ABONNEMENTS : une part de ce qu'E-Dome encaisse, 12 mois, par
     formule.)

   Tout ce qu'affichent `/apporteurs`, `/dashboard/apporteurs`, le suivi du
   vendeur sur `/publier` et la fiche publique se calcule ICI, à partir de
   données d'amorce et du journal de session — et chaque montant passe par
   `quote()`. C'est ce qui met fin aux trois chiffres contradictoires d'avant
   (770 / 1 034 / 9 500 CHF pour la même personne) : il n'y a plus qu'un
   calcul.

   Fonctions pures, sans React ni navigateur : testées par `npm run test:data`.
   Jamais `Date.now()` — « maintenant » est l'horloge figée de la démonstration
   (`DEMO_TODAY`), avancée par les événements de session. */

// ─── Formatage (déterministe, sans `toLocaleString`) ─────────────────────────

/** « 528 CHF », « 1'457.70 CHF » — identique côté serveur et navigateur. */
export function chfLabel(cents: number): string {
  const neg = cents < 0;
  const abs = Math.abs(Math.round(cents));
  const whole = Math.floor(abs / 100);
  const rest = abs % 100;
  const grouped = String(whole).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  return `${neg ? "-" : ""}${grouped}${rest ? `.${String(rest).padStart(2, "0")}` : ""} CHF`;
}

/** « 35 % » — pour EXPLIQUER un taux marketplace, jamais pour une prime biens. */
export const pctLabel = (rate: number): string => `${Math.round(rate * 1000) / 10} %`.replace(".", ",");

// ─── Le calcul d'une prime biens ─────────────────────────────────────────────

export interface PrimeBreakdown {
  primeCents: number;
  /** Ce que touche l'apporteur, net. */
  apporteurCents: number;
  /** Part retenue par E-Dome, à l'intérieur de la prime. */
  edomeShareCents: number;
  /** Frais de paiement, absorbés par E-Dome sur sa part. */
  pspCents: number;
  edomeNetCents: number;
  /** Ce que débourse le vendeur : la prime, rien de plus. */
  sellerPaysCents: number;
}

/** Répartition d'une prime biens, calculée par `quote()` (seul moteur). */
export function primeBreakdown(amountChf: number): PrimeBreakdown {
  const q = quote({ kind: "bien-introduction", pole: "vente", prime: primeChf(amountChf) });
  return {
    primeCents: q.flow.gross.cents,
    apporteurCents: q.flow.apporteur.cents,
    edomeShareCents: q.flow.edomeGross.cents - q.flow.apporteur.cents,
    pspCents: q.flow.psp.cents,
    edomeNetCents: q.flow.edomeNet.cents,
    sellerPaysCents: q.payerTotal.cents,
  };
}

/** Une prime qui demande une vérification renforcée et une validation manuelle. */
export const needsManualReview = (amountChf: number): boolean => chf(amountChf).cents > PRIME_MANUAL_REVIEW_ABOVE.cents;

/** La part E-Dome affichée en clair (« 12 % ») — c'est la part d'E-Dome, pas la prime. */
export const EDOME_PRIME_SHARE_LABEL = pctLabel(EDOME_PRIME_SHARE);

// ─── Le calcul d'une affiliation marketplace ─────────────────────────────────

export interface AffiliationBreakdown {
  grossCents: number;
  affiliateCents: number;
  edomeCents: number;
  pspCents: number;
  /** Ce que garde le vendeur, après commission, part affilié et frais. */
  sellerKeepsCents: number;
  /** Ce qu'il garderait sans affiliation (la commission E-Dome ne change pas). */
  sellerKeepsWithoutCents: number;
}

/** Aperçu chiffré d'une vente affiliée, calculé par `quote()`. */
export function affiliationBreakdown(
  pole: CommissionPole,
  grossChf: number,
  rate: number,
  units?: number,
): AffiliationBreakdown {
  const gross = chf(Math.max(0, grossChf));
  if (gross.cents === 0) {
    return { grossCents: 0, affiliateCents: 0, edomeCents: 0, pspCents: 0, sellerKeepsCents: 0, sellerKeepsWithoutCents: 0 };
  }
  const bounded = clampAffiliationRate(pole, rate);
  const withAff = quote({ kind: "commission", pole, gross, units, affiliation: { rate: bounded } });
  const without = quote({ kind: "commission", pole, gross, units });
  return {
    grossCents: gross.cents,
    affiliateCents: withAff.flow.affiliate.cents,
    edomeCents: withAff.flow.edomeGross.cents,
    pspCents: withAff.flow.psp.cents,
    sellerKeepsCents: withAff.flow.beneficiary.cents,
    sellerKeepsWithoutCents: without.flow.beneficiary.cents,
  };
}

// ─── « Maintenant » et le mois courant ───────────────────────────────────────

/** L'instant présent de la démonstration : `DEMO_TODAY`, ou le dernier événement de session. */
export function sessionNow(state: SessionState): string {
  const base = DEMO_TODAY.toISOString();
  if (state.seq === 0) return base;
  const last = sessionTime(state.seq);
  return last > base ? last : base;
}

const HOUR_MS = 3_600_000;
const hoursBetween = (from: string, to: string) => (Date.parse(to) - Date.parse(from)) / HOUR_MS;
const sameMonth = (a: string, b: string) => a.slice(0, 7) === b.slice(0, 7);

// ─── VOLET BIENS : les primes réglées par les vendeurs ───────────────────────

export interface PrimeSetting {
  propertyId: string;
  sellerId: string;
  amountChf: number;
  budgetChf: number;
  cardLast4: string;
  status: "active" | "paused";
  since: string;
}

/* Amorce : des vendeurs du casting ont déjà activé une prime sur leurs biens
   en vente ou en location longue durée. Les montants sont des CHF ronds, sans
   rapport avec le prix des biens (verrou anti-« 1 % »). */
const SEED_PRIMES: readonly PrimeSetting[] = [
  { propertyId: "prop27", sellerId: "user-015", amountChf: 1500, budgetChf: 3000, cardLast4: "4417", status: "active", since: "2026-09-01" },
  { propertyId: "prop3", sellerId: "user-007", amountChf: 800, budgetChf: 1600, cardLast4: "2290", status: "active", since: "2026-09-10" },
  { propertyId: "prop28", sellerId: "user-015", amountChf: 600, budgetChf: 1800, cardLast4: "4417", status: "active", since: "2026-09-01" },
  { propertyId: "prop13", sellerId: "user-002", amountChf: 500, budgetChf: 1500, cardLast4: "0382", status: "active", since: "2026-09-05" },
  { propertyId: "prop15", sellerId: "user-004", amountChf: 400, budgetChf: 1200, cardLast4: "7731", status: "active", since: "2026-09-03" },
  { propertyId: "prop20", sellerId: "user-004", amountChf: 350, budgetChf: 700, cardLast4: "7731", status: "active", since: "2026-09-03" },
  { propertyId: "prop8", sellerId: "user-001", amountChf: 200, budgetChf: 600, cardLast4: "5108", status: "active", since: "2026-09-14" },
  { propertyId: "prop10", sellerId: "user-003", amountChf: 150, budgetChf: 450, cardLast4: "6624", status: "active", since: "2026-09-12" },
  { propertyId: "prop21", sellerId: "user-004", amountChf: 100, budgetChf: 300, cardLast4: "7731", status: "active", since: "2026-09-03" },
  { propertyId: "prop19", sellerId: "user-002", amountChf: 900, budgetChf: 1800, cardLast4: "0382", status: "paused", since: "2026-08-20" },
];

/** Toutes les primes, amorce + session (activer, modifier, mettre en pause, retirer). */
export function primeSettings(state: SessionState): Map<string, PrimeSetting> {
  const out = new Map<string, PrimeSetting>(SEED_PRIMES.map((p) => [p.propertyId, { ...p }]));
  for (const e of state.events) {
    if (e.kind === "prime.set") {
      out.set(e.data.propertyId, {
        propertyId: e.data.propertyId,
        sellerId: e.actorId,
        amountChf: e.data.amountChf,
        budgetChf: e.data.budgetChf,
        cardLast4: e.data.cardLast4,
        status: "active",
        since: out.get(e.data.propertyId)?.since ?? e.at.slice(0, 10),
      });
    } else if (e.kind === "prime.paused") {
      const cur = out.get(e.data.propertyId);
      if (cur && cur.sellerId === e.actorId) out.set(e.data.propertyId, { ...cur, status: "paused" });
    } else if (e.kind === "prime.removed") {
      const cur = out.get(e.data.propertyId);
      if (cur && cur.sellerId === e.actorId) out.delete(e.data.propertyId);
    }
  }
  return out;
}

/** Le bien (catalogue ou publié pendant la session). */
export function propertyOf(state: SessionState, propertyId: string): Property | undefined {
  return CATALOGUE.find((p) => p.id === propertyId) ?? sessionListings(state).find((p) => p.id === propertyId);
}

/** Seuls la vente et la location longue durée portent une prime biens. */
export const isPrimeEligibleListing = (p: Pick<Property, "transactionType">): boolean =>
  p.transactionType === "vente" || p.transactionType === "location-lt";

// ─── Les mises en relation ───────────────────────────────────────────────────

export type IntroductionStatus = "pending" | "accepted" | "declined" | "refunded" | "under-review";

export interface Introduction {
  id: string;
  propertyId: string;
  sellerId: string;
  apporteurId: string;
  contactLabel: string;
  /** Figée au moment de la proposition. */
  primeChf: number;
  madeAt: string;
  answeredAt?: string;
  disputedAt?: string;
  status: IntroductionStatus;
  /** Prime > `PRIME_MANUAL_REVIEW_ABOVE` : validée à la main avant facturation. */
  manualReview: boolean;
}

type SeedIntroduction = Omit<Introduction, "manualReview">;

/* Amorce : Léo (Lausanne) et Yves Mottiez (Martigny) sont les apporteurs
   suisses actifs du volet biens. Hélène Marchal (Évian) n'y figure pas : depuis
   la France, elle ne peut pas (D7). Le 29 septembre, Léo accepte un contact
   d'Yves pour son 4,5 pièces de Renens — il est encore dans la fenêtre de 48 h. */
const SEED_INTRODUCTIONS: readonly SeedIntroduction[] = [
  { id: "intro-01", propertyId: "prop28", sellerId: "user-015", apporteurId: "user-001", contactLabel: "Couple, primo-acquéreurs, Neuchâtel", primeChf: 600, madeAt: "2026-09-08T09:10:00Z", answeredAt: "2026-09-09T08:30:00Z", status: "accepted" },
  { id: "intro-02", propertyId: "prop13", sellerId: "user-002", apporteurId: "user-001", contactLabel: "Famille relocalisée depuis Zurich", primeChf: 500, madeAt: "2026-09-15T17:40:00Z", answeredAt: "2026-09-16T10:05:00Z", status: "accepted" },
  { id: "intro-03", propertyId: "prop15", sellerId: "user-004", apporteurId: "user-001", contactLabel: "Investisseur, recherche Minergie", primeChf: 400, madeAt: "2026-09-29T09:00:00Z", status: "pending" },
  { id: "intro-04", propertyId: "prop20", sellerId: "user-004", apporteurId: "user-001", contactLabel: "Retraités, Gruyère", primeChf: 350, madeAt: "2026-09-20T14:20:00Z", answeredAt: "2026-09-21T09:00:00Z", status: "declined" },
  { id: "intro-05", propertyId: "prop28", sellerId: "user-015", apporteurId: "user-012", contactLabel: "Cadre, mutation à Neuchâtel", primeChf: 600, madeAt: "2026-09-21T11:00:00Z", answeredAt: "2026-09-22T09:15:00Z", status: "accepted" },
  { id: "intro-06", propertyId: "prop27", sellerId: "user-015", apporteurId: "user-012", contactLabel: "Famille, recherche villa avec vue", primeChf: 1500, madeAt: "2026-09-17T08:00:00Z", answeredAt: "2026-09-18T15:30:00Z", status: "accepted" },
  { id: "intro-07", propertyId: "prop8", sellerId: "user-001", apporteurId: "user-012", contactLabel: "Jeune couple, travaille à Renens", primeChf: 200, madeAt: "2026-09-28T10:00:00Z", answeredAt: "2026-09-29T16:00:00Z", status: "accepted" },
  { id: "intro-08", propertyId: "prop8", sellerId: "user-001", apporteurId: "user-012", contactLabel: "Étudiante en master, EPFL", primeChf: 200, madeAt: "2026-09-30T08:00:00Z", status: "pending" },
];

/** Toutes les mises en relation, amorce + session, dans l'ordre. */
export function introductions(state: SessionState): Introduction[] {
  const byId = new Map<string, Introduction>();
  const order: string[] = [];
  const add = (i: Introduction) => {
    byId.set(i.id, i);
    order.push(i.id);
  };
  for (const s of SEED_INTRODUCTIONS) add({ ...s, manualReview: needsManualReview(s.primeChf) });

  /* Remboursements déjà consommés, par vendeur et par mois (plafond). */
  const refundsUsed = new Map<string, number>();
  const refundKey = (sellerId: string, at: string) => `${sellerId}|${at.slice(0, 7)}`;

  for (const e of state.events) {
    if (e.kind === "introduction.made") {
      add({
        id: e.id,
        propertyId: e.data.propertyId,
        sellerId: e.data.sellerId,
        apporteurId: e.actorId,
        contactLabel: e.data.contactLabel,
        primeChf: e.data.primeChf,
        madeAt: e.at,
        status: "pending",
        manualReview: needsManualReview(e.data.primeChf),
      });
    } else if (e.kind === "introduction.answered") {
      const cur = byId.get(e.data.introductionId);
      if (!cur || cur.status !== "pending" || cur.sellerId !== e.actorId) continue;
      byId.set(cur.id, { ...cur, status: e.data.decision, answeredAt: e.at });
    } else if (e.kind === "introduction.disputed") {
      const cur = byId.get(e.data.introductionId);
      if (!cur || cur.status !== "accepted" || cur.sellerId !== e.actorId || !cur.answeredAt) continue;
      if (hoursBetween(cur.answeredAt, e.at) > PRIME_DISPUTE.windowHours) continue;
      const key = refundKey(cur.sellerId, e.at);
      const used = refundsUsed.get(key) ?? 0;
      const refunded = used < PRIME_DISPUTE.maxRefundsPerMonth;
      if (refunded) refundsUsed.set(key, used + 1);
      byId.set(cur.id, { ...cur, status: refunded ? "refunded" : "under-review", disputedAt: e.at });
    }
  }
  return order.map((id) => byId.get(id)!);
}

/** Le vendeur peut-il encore signaler ce contact comme « pas sérieux » ? */
export function canDispute(i: Introduction, now: string): boolean {
  return i.status === "accepted" && !!i.answeredAt && hoursBetween(i.answeredAt, now) <= PRIME_DISPUTE.windowHours;
}

/** Heures restantes dans la fenêtre de 48 h (0 si fermée). */
export function disputeHoursLeft(i: Introduction, now: string): number {
  if (!i.answeredAt || i.status !== "accepted") return 0;
  return Math.max(0, Math.floor(PRIME_DISPUTE.windowHours - hoursBetween(i.answeredAt, now)));
}

/** Facturée = acceptée et non remboursée (« under-review » reste due tant que l'examen n'a pas tranché). */
const isBilled = (i: Introduction) => i.status === "accepted" || i.status === "under-review";

/** Nombre de contestations reçues par un apporteur (au-delà de la limite, il perd l'accès). */
export function contestedCount(state: SessionState, apporteurId: string): number {
  return introductions(state).filter((i) => i.apporteurId === apporteurId && (i.status === "refunded" || i.status === "under-review")).length;
}

/** Ce que le vendeur a déjà payé ce mois, en primes facturées. */
function billedThisMonth(intros: Introduction[], sellerId: string, now: string): number {
  return intros
    .filter((i) => i.sellerId === sellerId && isBilled(i) && i.answeredAt && sameMonth(i.answeredAt, now))
    .reduce((s, i) => s + i.primeChf, 0);
}

// ─── Qui peut proposer un contact sur quel bien ──────────────────────────────

export type IntroductionBlock =
  | { ok: true }
  | { ok: false; reason: "country" | "own-listing" | "no-prime" | "paused" | "already" | "contested"; message: string };

/** Garde-fous, dans l'ordre où l'interface les explique. */
export function canIntroduce(state: SessionState, apporteurId: string, propertyId: string): IntroductionBlock {
  const person = personById(apporteurId);
  const elig = primeEligibility(person?.country);
  if (!elig.eligible) return { ok: false, reason: "country", message: elig.reason };
  if (contestedCount(state, apporteurId) >= PRIME_DISPUTE.contestedLimit) {
    return { ok: false, reason: "contested", message: "Trop de contacts contestés : l'accès au volet biens est suspendu." };
  }
  const setting = primeSettings(state).get(propertyId);
  if (!setting) return { ok: false, reason: "no-prime", message: "Ce bien n'a pas de prime active." };
  if (setting.status !== "active") return { ok: false, reason: "paused", message: "Le vendeur a mis sa prime en pause." };
  /* Anti-collusion élémentaire : on ne se recommande pas soi-même. */
  if (setting.sellerId === apporteurId) return { ok: false, reason: "own-listing", message: "C'est votre bien : vous ne pouvez pas vous amener un contact." };
  const pending = introductions(state).some((i) => i.propertyId === propertyId && i.apporteurId === apporteurId && i.status === "pending");
  if (pending) return { ok: false, reason: "already", message: "Un contact proposé attend déjà la réponse du vendeur." };
  return { ok: true };
}

/** Le vendeur peut-il accepter (budget mensuel) ? */
export function budgetAllows(state: SessionState, intro: Introduction): boolean {
  const setting = primeSettings(state).get(intro.propertyId);
  if (!setting) return true;
  const now = sessionNow(state);
  return billedThisMonth(introductions(state), intro.sellerId, now) + intro.primeChf <= setting.budgetChf * countSellerPrimes(state, intro.sellerId);
}

/* Le budget est réglé par bien ; un vendeur à plusieurs biens dispose de la
   somme de ses budgets sur le mois. */
function countSellerPrimes(state: SessionState, sellerId: string): number {
  return Math.max(1, [...primeSettings(state).values()].filter((p) => p.sellerId === sellerId).length);
}

// ─── L'espace apporteur, onglet BIENS ────────────────────────────────────────

export interface PrimeListing {
  property: Property;
  setting: PrimeSetting;
  breakdown: PrimeBreakdown;
  manualReview: boolean;
}

/** Les biens à prime ACTIVE, triés par prime décroissante (la prime fait remonter). */
export function primeListings(state: SessionState): PrimeListing[] {
  const out: PrimeListing[] = [];
  for (const setting of primeSettings(state).values()) {
    if (setting.status !== "active") continue;
    const property = propertyOf(state, setting.propertyId);
    if (!property || !isPrimeEligibleListing(property)) continue;
    out.push({ property, setting, breakdown: primeBreakdown(setting.amountChf), manualReview: needsManualReview(setting.amountChf) });
  }
  return out.sort((a, b) => b.setting.amountChf - a.setting.amountChf || a.property.id.localeCompare(b.property.id));
}

// ─── L'espace apporteur, onglet MARKETPLACE ──────────────────────────────────

export interface AffiliableOffer {
  id: string;
  pole: CommissionPole;
  kindLabel: string;
  title: string;
  ownerId?: string;
  ownerName: string;
  /** Prix de référence de l'exemple chiffré, en CHF. */
  priceChf: number;
  /** Ce que couvre ce prix (« par inscription », « séjour de 3 nuits »…). */
  unitLabel: string;
  units?: number;
  rate: number;
  href: string;
  image?: string;
  fromSession?: boolean;
}

const STAY_NIGHTS = 3;

/* Amorce : produits que leurs vendeurs ont ouverts à l'affiliation, avec le
   taux qu'ils ont choisi DANS la fourchette de leur pôle. */
const SEED_FORMATION_RATES: Readonly<Record<string, number>> = {
  "form-007": 0.4,
  "form-002": 0.35,
  "form-005": 0.3,
  "form-001": 0.3,
  "form-009": 0.25,
};
const SEED_EVENT_RATES: Readonly<Record<string, number>> = { e3: 0.2, e5: 0.2, e1: 0.15, e4: 0.1 };
const SEED_STAY_RATES: Readonly<Record<string, number>> = { prop4: 0.1, prop12: 0.08, prop26: 0.05 };
/* Services : repris de la fiche `/services` (s3, s4). */
const SEED_SERVICES: readonly AffiliableOffer[] = [
  { id: "s3", pole: "service", kindLabel: "Service", title: "Photographie immobilière, drone et visite 3D", ownerId: "user-005", ownerName: "Nikola Ristić", priceChf: 350, unitLabel: "par séance", rate: 0.1, href: "/services?focus=s3" },
  { id: "s4", pole: "service", kindLabel: "Service", title: "Home staging pour la vente et la location", ownerId: "user-010", ownerName: "Elena Currat", priceChf: 200, unitLabel: "par pièce", rate: 0.08, href: "/services?focus=s4" },
];

const fullName = (id?: string) => {
  const p = id ? personById(id) : undefined;
  return p ? `${p.firstName} ${p.lastName}` : "";
};

/** Les produits ouverts à l'affiliation : amorce + créations de session. */
export function affiliableOffers(state: SessionState): AffiliableOffer[] {
  const out: AffiliableOffer[] = [];

  for (const e of [...state.events].reverse()) out.push(...sessionOffer(e));

  for (const f of CATALOGUE_FORMATIONS) {
    const rate = SEED_FORMATION_RATES[f.id];
    if (rate === undefined || !(f.price > 0)) continue;
    out.push({
      id: f.id, pole: "formation", kindLabel: "Formation", title: f.title, ownerId: f.instructor.id,
      ownerName: `${f.instructor.firstName} ${f.instructor.lastName}`, priceChf: f.price, unitLabel: "par inscription",
      rate, href: `/formations/${f.id}`, image: f.thumbnail,
    });
  }
  for (const ev of EVENTS) {
    const rate = SEED_EVENT_RATES[ev.id];
    if (rate === undefined || !(ev.prix > 0)) continue;
    out.push({
      id: ev.id, pole: "evenement", kindLabel: "Événement", title: ev.titre, ownerName: ev.intervenant,
      priceChf: ev.prix, unitLabel: "par billet", units: 1, rate, href: `/evenements/${ev.id}`, image: ev.thumbnail,
    });
  }
  out.push(...SEED_SERVICES);
  for (const p of CATALOGUE) {
    const rate = SEED_STAY_RATES[p.id];
    if (rate === undefined || p.transactionType !== "location-ct") continue;
    out.push({
      id: p.id, pole: "location-ct", kindLabel: "Courte durée", title: p.title, ownerId: p.host.id,
      ownerName: `${p.host.firstName} ${p.host.lastName}`, priceChf: p.price * STAY_NIGHTS,
      unitLabel: `séjour de ${STAY_NIGHTS} nuits`, rate, href: `/explorer/${p.id}`, image: p.images[0],
    });
  }
  return out;
}

function sessionOffer(e: SessionEvent): AffiliableOffer[] {
  const name = fullName(e.actorId);
  if (e.kind === "service.published" && e.data.affiliationRate && e.data.price > 0) {
    return [{
      id: serviceIdOf(e.seq), pole: "service", kindLabel: "Service", title: e.data.title, ownerId: e.actorId, ownerName: name,
      priceChf: e.data.price, unitLabel: e.data.unit.replace("/", "par "), rate: clampAffiliationRate("service", e.data.affiliationRate),
      href: `/services?focus=${serviceIdOf(e.seq)}`, fromSession: true,
    }];
  }
  if (e.kind === "formation.published" && e.data.affiliationRate && e.data.price > 0) {
    return [{
      id: formationIdOf(e.seq), pole: "formation", kindLabel: "Formation", title: e.data.title, ownerId: e.actorId, ownerName: name,
      priceChf: e.data.price, unitLabel: "par inscription", rate: clampAffiliationRate("formation", e.data.affiliationRate),
      href: `/formations/${formationIdOf(e.seq)}`, fromSession: true,
    }];
  }
  if (e.kind === "live.scheduled" && e.data.affiliationRate && e.data.price > 0) {
    return [{
      id: liveIdOf(e.seq), pole: "live", kindLabel: "Live", title: e.data.title, ownerId: e.actorId, ownerName: name,
      priceChf: e.data.price, unitLabel: "par participant", rate: clampAffiliationRate("live", e.data.affiliationRate),
      href: "/live", fromSession: true,
    }];
  }
  return [];
}

/** Le NET en CHF qu'un affilié touche sur une vente de cette offre. */
export function offerNetCents(o: AffiliableOffer): number {
  return affiliationBreakdown(o.pole, o.priceChf, o.rate, o.units).affiliateCents;
}

// ─── Les apports d'une personne : LA source unique ───────────────────────────

export type Mechanic = "bien" | "marketplace" | "abonnement";

export interface ApportLine {
  id: string;
  mechanic: Mechanic;
  label: string;
  detail: string;
  date: string;
  /** Net touché (ou à toucher) par l'apporteur, en centimes. */
  netCents: number;
  status: "acquis" | "en-attente" | "refuse" | "rembourse";
  href?: string;
}

/* Ventes marketplace attribuées à un lien d'affilié. */
const SEED_AFFILIATE_SALES: readonly { id: string; apporteurId: string; offerId: string; date: string; count: number }[] = [
  { id: "aff-01", apporteurId: "user-001", offerId: "form-002", date: "2026-09-11", count: 2 },
  { id: "aff-02", apporteurId: "user-001", offerId: "e3", date: "2026-09-18", count: 3 },
  { id: "aff-03", apporteurId: "user-001", offerId: "prop12", date: "2026-09-24", count: 1 },
  { id: "aff-04", apporteurId: "user-014", offerId: "form-007", date: "2026-09-06", count: 3 },
  { id: "aff-05", apporteurId: "user-014", offerId: "e1", date: "2026-09-14", count: 4 },
  { id: "aff-06", apporteurId: "user-014", offerId: "e5", date: "2026-09-26", count: 2 },
  { id: "aff-07", apporteurId: "user-012", offerId: "s3", date: "2026-09-19", count: 1 },
];

/* Abonnements apportés : une part de ce qu'E-Dome encaisse, sur 12 mois au plus. */
const SEED_SUBSCRIPTION_REFERRALS: readonly { id: string; apporteurId: string; holderLabel: string; planId: string; since: string }[] = [
  { id: "sub-01", apporteurId: "user-001", holderLabel: "Hartmann Immobilier SA", planId: "vitrine", since: "2026-05-01" },
  { id: "sub-02", apporteurId: "user-001", holderLabel: "Ennio Bordoni (propriétaire)", planId: "patrimoine", since: "2026-07-01" },
];

/** Mois facturés depuis `since` jusqu'à `now` inclus, plafonnés à la fenêtre de 12 mois. */
function monthsBilled(since: string, now: string): number {
  const [sy, sm] = since.split("-").map(Number) as [number, number];
  const [ny, nm] = now.split("-").map(Number) as [number, number];
  const n = (ny - sy) * 12 + (nm - sm) + 1;
  return Math.max(0, Math.min(APPORTEUR_WINDOW_MONTHS, n));
}

/** Part mensuelle de l'apporteur sur une formule (barème par formule), via `quote()`. */
export function subscriptionShareCents(planId: string): number {
  return quote({ kind: "subscription", planId, interval: "month" }, { hasApporteur: true }).flow.apporteur.cents;
}

export interface ApporteurBook {
  personId: string;
  eligibility: ReturnType<typeof primeEligibility>;
  lines: ApportLine[];
  totals: { bien: number; marketplace: number; abonnement: number; total: number; pending: number };
}

/** Tout ce qu'une personne a amené, sur les trois mécaniques, avec un seul total. */
export function apporteurBook(state: SessionState, personId: string): ApporteurBook {
  const now = sessionNow(state);
  const lines: ApportLine[] = [];
  const eligibility = primeEligibility(personById(personId)?.country);

  for (const i of introductions(state)) {
    if (i.apporteurId !== personId) continue;
    const p = propertyOf(state, i.propertyId);
    const net = primeBreakdown(i.primeChf).apporteurCents;
    const status: ApportLine["status"] =
      i.status === "pending" ? "en-attente" : i.status === "declined" ? "refuse" : i.status === "refunded" ? "rembourse" : "acquis";
    lines.push({
      id: i.id,
      mechanic: "bien",
      label: p ? p.title : i.propertyId,
      detail: `Prime de ${chfLabel(i.primeChf * 100)} · contact : ${i.contactLabel}${i.manualReview ? " · validation manuelle" : ""}`,
      date: (i.answeredAt ?? i.madeAt).slice(0, 10),
      netCents: status === "acquis" || status === "en-attente" ? net : 0,
      status,
      href: p ? `/explorer/${p.id}` : undefined,
    });
  }

  const offers = affiliableOffers(state);
  for (const s of SEED_AFFILIATE_SALES) {
    if (s.apporteurId !== personId) continue;
    const o = offers.find((x) => x.id === s.offerId);
    if (!o) continue;
    lines.push({
      id: s.id,
      mechanic: "marketplace",
      label: o.title,
      detail: `${s.count} × ${chfLabel(offerNetCents(o))} net (${pctLabel(o.rate)} du prix, sur la marge du vendeur)`,
      date: s.date,
      netCents: offerNetCents(o) * s.count,
      status: "acquis",
      href: o.href,
    });
  }

  for (const r of SEED_SUBSCRIPTION_REFERRALS) {
    if (r.apporteurId !== personId) continue;
    const months = monthsBilled(r.since, now);
    const share = subscriptionShareCents(r.planId);
    const planShare = APPORTEUR_SUBSCRIPTION_SHARES[r.planId] ?? 0;
    lines.push({
      id: r.id,
      mechanic: "abonnement",
      label: r.holderLabel,
      detail: `${months} mois × ${chfLabel(share)} (${pctLabel(planShare)} de ce qu'encaisse E-Dome, ${APPORTEUR_WINDOW_MONTHS} mois au plus)`,
      date: r.since,
      netCents: share * months,
      status: "acquis",
    });
  }

  lines.sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
  const sumOf = (m: Mechanic) => lines.filter((l) => l.mechanic === m && l.status === "acquis").reduce((s, l) => s + l.netCents, 0);
  const bien = sumOf("bien");
  const marketplace = sumOf("marketplace");
  const abonnement = sumOf("abonnement");
  const pending = lines.filter((l) => l.status === "en-attente").reduce((s, l) => s + l.netCents, 0);
  return { personId, eligibility, lines, totals: { bien, marketplace, abonnement, total: bien + marketplace + abonnement, pending } };
}

// ─── Le suivi du vendeur ─────────────────────────────────────────────────────

export interface SellerPrimeRow {
  property: Property;
  setting: PrimeSetting;
  introductions: Introduction[];
}

export interface SellerPrimeBook {
  rows: SellerPrimeRow[];
  /** Payé (primes facturées, non remboursées), tous mois confondus. */
  paidCents: number;
  paidThisMonthCents: number;
  refundedCents: number;
  refundsLeftThisMonth: number;
  now: string;
}

/** Ce que voit le vendeur : ses biens à prime, les contacts reçus, ce qu'il a payé. */
export function sellerPrimeBook(state: SessionState, sellerId: string): SellerPrimeBook {
  const now = sessionNow(state);
  const intros = introductions(state).filter((i) => i.sellerId === sellerId);
  const rows: SellerPrimeRow[] = [];
  for (const setting of primeSettings(state).values()) {
    if (setting.sellerId !== sellerId) continue;
    const property = propertyOf(state, setting.propertyId);
    if (!property) continue;
    rows.push({ property, setting, introductions: intros.filter((i) => i.propertyId === setting.propertyId).reverse() });
  }
  const billed = intros.filter(isBilled);
  const refunds = intros.filter((i) => i.status === "refunded");
  const refundsThisMonth = refunds.filter((i) => i.disputedAt && sameMonth(i.disputedAt, now)).length;
  return {
    rows,
    paidCents: billed.reduce((s, i) => s + i.primeChf * 100, 0),
    paidThisMonthCents: billedThisMonth(intros, sellerId, now) * 100,
    refundedCents: refunds.reduce((s, i) => s + i.primeChf * 100, 0),
    refundsLeftThisMonth: Math.max(0, PRIME_DISPUTE.maxRefundsPerMonth - refundsThisMonth),
    now,
  };
}

// ─── Formule d'abonnement en vigueur ─────────────────────────────────────────

/** La formule d'un titulaire : la dernière choisie pendant la session, sinon celle de l'amorce. */
export function currentPlanId(state: SessionState, holderId: string, seedPlanId: string): string {
  let plan = seedPlanId;
  for (const e of state.events) {
    if (e.kind === "plan.changed" && e.data.holderId === holderId && PLANS.some((p) => p.id === e.data.planId)) plan = e.data.planId;
  }
  return plan;
}

/** Les pôles marketplace qui s'ouvrent à l'affiliation (la boutique est à part : payée par le marchand). */
export const AFFILIABLE_POLES = Object.keys(AFFILIATION_RATES) as CommissionPole[];
