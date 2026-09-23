import { properties as CATALOGUE, formations as FORMATIONS } from "@/lib/mock-data";
import { DEMO_TODAY, iso, last12Months, stayLabel } from "./clock";
import { CURRENT_USER, OWNED_PROPERTY_IDS, OWNED_FORMATION_IDS } from "./identity";

/* ── Le journal : le seul endroit où vit un montant ─────────────────────────

   Deux moteurs de revenus cohabitaient, et ils ne concordaient pas.

   `dashboard-data.ts` écrivait `monthRevenue: 11200 / 8400 / 5250` en dur,
   d'où 24 850 CHF pour le mois — puis une série mensuelle de douze valeurs
   écrites en dur dont la somme faisait 228 100, et dont la valeur de décembre
   était précisément 24 850, c'est-à-dire le total des biens SEULS. Le
   graphique excluait donc formations, événements, services, boutique et
   apporteurs, que la répartition par source, elle, incluait. La contradiction
   était interne au fichier, et son commentaire l'assumait par écrit.

   `revenue-data.ts` dérivait au contraire un montant par bien, par type et
   par mois, pour un total d'environ 66 900 sur douze mois. Les deux chiffres
   s'affichaient **sur le même écran**, à un défilement d'intervalle : 66 938
   sur douze mois, 24 850 pour le mois courant, 57 606 pour l'immobilier sur
   douze mois. Personne n'a besoin d'être comptable pour voir que 24 850 × 12
   ne tient pas dans 57 606.

   Corriger les valeurs n'aurait rien réglé : elles auraient divergé à nouveau
   dès que l'Espace agence ajoutera du revenu d'abonnement.

   ── Ce que ce module garantit ──────────────────────────────────────────────

   Un seul tableau contient des chiffres : `LEDGER`. Tout le reste est dérivé
   par des fonctions pures (`derive.ts`), et les invariants sont levés **à
   l'import** (`invariants.ts`) — donc `next build`, qui prérend les pages,
   échoue si deux chiffres divergent. Ce choix est délibéré : il n'y a pas de
   lanceur de tests unitaires dans ce dépôt, et une assertion à l'import
   bloque le commit sans ajouter ni dépendance ni porte de qualité.

   Les montants des séjours sont calculés `nuits × prix de la nuit`, ce prix
   étant lu dans le **catalogue**. Une réservation ne peut donc plus
   contredire la fiche du bien — ce qu'elle faisait sur deux des trois biens,
   avec parfois deux tarifs différents pour le même logement. */

export type LedgerSource =
  | "biens"
  | "formations"
  | "evenements"
  | "services"
  | "boutique"
  | "lives"
  | "apporteurs";

export type SubjectKind =
  | "property"
  | "formation"
  | "event"
  | "service"
  | "product"
  | "referral";

export interface Entry {
  id: string;
  /** ISO `YYYY-MM-DD`. Borne les fenêtres 7 jours / 30 jours / 12 mois. */
  date: string;
  source: LedgerSource;
  /** Même espace d'identifiants que le catalogue : pas de troisième liste. */
  subject: { kind: SubjectKind; id: string };
  /** Montant encaissé par le vendeur, avant commission, en CHF. */
  gross: number;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  label: string;
  counterparty: string;
  /** Renseigné pour une écriture de séjour. */
  stay?: { start: string; end: string; nights: number; label: string };
}

/* ── Générateur déterministe ────────────────────────────────────────────────

   Une maquette dont les chiffres changent à chaque rebuild ne peut pas être
   vérifiée : les invariants passeraient un jour et échoueraient le lendemain.
   D'où un générateur à graine fixe plutôt que `Math.random()`. */

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T>(rand: () => number, arr: readonly T[]): T =>
  arr[Math.floor(rand() * arr.length)]!;

const GUESTS = [
  "Sophie Bernard",
  "Jean Dupont",
  "Marie Leroy",
  "Thomas Roux",
  "Amina Khan",
  "Laura Meier",
  "Pierre Aubry",
  "Nadia Schmid",
  "Cédric Lopez",
  "Anne Schmid",
] as const;

/* ── Ce que fait l'utilisateur, mois par mois ───────────────────────────────

   Seule table déclarative du module. Elle décrit une ACTIVITÉ — combien de
   séjours, combien de ventes — jamais un montant : les montants se calculent
   depuis le catalogue. C'est ce qui empêche un chiffre de démonstration de
   contredire une fiche.

   La saisonnalité est volontaire et lisible : le chalet de Verbier se remplit
   l'hiver, la villa de Phuket aussi, le studio de Genève tourne toute
   l'année. Une courbe plate se remarquerait autant qu'une courbe fausse. */

/** Nuits vendues par mois, du plus ancien au plus récent des douze mois. */
const NIGHTS_BY_PROPERTY: Record<string, readonly number[]> = {
  // Verbier — saison de ski marquée.
  prop5: [7, 4, 2, 1, 2, 3, 5, 6, 8, 9, 6, 7],
  // Genève — demande d'affaires régulière.
  prop2: [14, 13, 15, 16, 14, 12, 10, 11, 15, 17, 16, 15],
  // Phuket — haute saison en hiver européen.
  prop9: [11, 9, 7, 5, 4, 4, 6, 8, 10, 12, 10, 11],
};

/** Inscriptions vendues par mois sur la formation de l'utilisateur. */
const FORMATION_SALES: readonly number[] = [2, 3, 2, 4, 3, 2, 3, 5, 4, 3, 4, 5];

/** Événements organisés : trimestriels, avec places vendues et prix du billet. */
const EVENTS: readonly { monthIndex: number; id: string; title: string; seats: number; price: number }[] = [
  { monthIndex: 2, id: "ev-atelier-1", title: "Atelier rendement locatif", seats: 12, price: 45 },
  { monthIndex: 5, id: "ev-visite-1", title: "Visite groupée Chalet Verbier", seats: 8, price: 75 },
  { monthIndex: 8, id: "ev-atelier-2", title: "Atelier charges et décompte", seats: 14, price: 45 },
  { monthIndex: 11, id: "ev-networking", title: "Networking propriétaires romands", seats: 22, price: 25 },
];

/** Prestations vendues ponctuellement. */
const SERVICES: readonly { monthIndex: number; id: string; label: string; amount: number; client: string }[] = [
  { monthIndex: 1, id: "sv-photo-1", label: "Reportage photo · Studio Genève", amount: 480, client: "Marc Dupont" },
  { monthIndex: 4, id: "sv-staging-1", label: "Home-staging · Verbier", amount: 1250, client: "Anne Schmid" },
  { monthIndex: 7, id: "sv-photo-2", label: "Reportage photo · Phuket", amount: 620, client: "Laura Meier" },
  { monthIndex: 10, id: "sv-redac-1", label: "Rédaction d'annonces premium", amount: 240, client: "Cédric Lopez" },
];

/** Ventes de la boutique : quelques articles par mois. */
const PRODUCT_SALES: readonly { monthIndex: number; id: string; units: number; price: number; label: string }[] = [
  { monthIndex: 3, id: "b11", units: 4, price: 89, label: "Plaid lin lavé bleu nuit" },
  { monthIndex: 6, id: "b11", units: 3, price: 89, label: "Plaid lin lavé bleu nuit" },
  { monthIndex: 9, id: "b11", units: 5, price: 89, label: "Plaid lin lavé bleu nuit" },
  { monthIndex: 11, id: "b11", units: 6, price: 89, label: "Plaid lin lavé bleu nuit" },
];

/**
 * Apports réalisés par l'utilisateur.
 *
 * Le montant inscrit au journal est le **revenu qu'E-Dome encaisse grâce à
 * lui** — pas sa part. Sa part se calcule par `quote()` au moment de
 * l'affichage, ce qui garantit qu'elle reste cohérente avec le barème et
 * qu'elle sort toujours du revenu d'E-Dome, jamais du prix payé.
 */
const REFERRALS: readonly { monthIndex: number; id: string; label: string; edomeRevenue: number }[] = [
  { monthIndex: 3, id: "ap-hote-1", label: "Hôte amené · Studio Vevey", edomeRevenue: 168 },
  { monthIndex: 5, id: "ap-hote-2", label: "Hôte amené · Appartement Nyon", edomeRevenue: 214 },
  { monthIndex: 7, id: "ap-presta-1", label: "Prestataire amené · Photographe", edomeRevenue: 96 },
  { monthIndex: 8, id: "ap-hote-3", label: "Hôte amené · Chalet Les Diablerets", edomeRevenue: 302 },
  { monthIndex: 10, id: "ap-createur-1", label: "Créateur amené · Formation fiscalité", edomeRevenue: 149 },
  { monthIndex: 11, id: "ap-hote-4", label: "Hôte amené · Studio Montreux", edomeRevenue: 187 },
];

/* ── Expansion ──────────────────────────────────────────────────────────────── */

function nightlyPrice(propertyId: string): number {
  const p = CATALOGUE.find((x) => x.id === propertyId);
  if (!p) throw new Error(`Journal : bien inconnu au catalogue — ${propertyId}`);
  return p.price;
}

function formationPrice(formationId: string): number {
  const f = FORMATIONS.find((x) => x.id === formationId);
  if (!f) throw new Error(`Journal : formation inconnue au catalogue — ${formationId}`);
  return f.price;
}

function propertyName(propertyId: string): string {
  return CATALOGUE.find((x) => x.id === propertyId)!.title;
}

function build(): Entry[] {
  const months = last12Months();
  const out: Entry[] = [];
  const rand = mulberry32(20260930);

  /* Biens — un séjour se découpe en réservations de 2 à 7 nuits, jusqu'à
     épuisement du nombre de nuits vendues dans le mois. */
  for (const propertyId of OWNED_PROPERTY_IDS) {
    const price = nightlyPrice(propertyId);
    const name = propertyName(propertyId);
    const plan = NIGHTS_BY_PROPERTY[propertyId];
    if (!plan) throw new Error(`Journal : aucun plan d'occupation pour ${propertyId}`);

    months.forEach((m, mi) => {
      let remaining = plan[mi]!;
      let day = 2;
      let seq = 0;

      while (remaining > 0) {
        const nights = Math.min(remaining, 2 + Math.floor(rand() * 6));
        const start = new Date(Date.UTC(m.year, m.month, day));
        const end = new Date(Date.UTC(m.year, m.month, day + nights));
        const isFuture = start.getTime() > DEMO_TODAY.getTime();
        const isPast = end.getTime() <= DEMO_TODAY.getTime();

        out.push({
          id: `res-${propertyId}-${mi}-${seq}`,
          date: iso(start),
          source: "biens",
          subject: { kind: "property", id: propertyId },
          gross: nights * price,
          status: isFuture ? "pending" : isPast ? "completed" : "confirmed",
          label: name,
          counterparty: pick(rand, GUESTS),
          stay: { start: iso(start), end: iso(end), nights, label: stayLabel(start, end) },
        });

        remaining -= nights;
        day += nights + 1 + Math.floor(rand() * 3);
        seq++;
        /* Garde-fou : on ne déborde pas du mois. */
        if (day > 26) break;
      }
    });
  }

  /* Formations — une écriture par inscription, au prix du catalogue. */
  for (const formationId of OWNED_FORMATION_IDS) {
    const price = formationPrice(formationId);
    months.forEach((m, mi) => {
      for (let i = 0; i < FORMATION_SALES[mi]!; i++) {
        out.push({
          id: `form-${formationId}-${mi}-${i}`,
          date: iso(new Date(Date.UTC(m.year, m.month, 3 + i * 4))),
          source: "formations",
          subject: { kind: "formation", id: formationId },
          gross: price,
          status: "completed",
          label: FORMATIONS.find((f) => f.id === formationId)!.title,
          counterparty: pick(rand, GUESTS),
        });
      }
    });
  }

  for (const e of EVENTS) {
    const m = months[e.monthIndex]!;
    out.push({
      id: e.id,
      date: iso(new Date(Date.UTC(m.year, m.month, 12))),
      source: "evenements",
      subject: { kind: "event", id: e.id },
      gross: e.seats * e.price,
      status: "completed",
      label: e.title,
      counterparty: `${e.seats} participants`,
    });
  }

  for (const s of SERVICES) {
    const m = months[s.monthIndex]!;
    out.push({
      id: s.id,
      date: iso(new Date(Date.UTC(m.year, m.month, 8))),
      source: "services",
      subject: { kind: "service", id: s.id },
      gross: s.amount,
      status: "completed",
      label: s.label,
      counterparty: s.client,
    });
  }

  for (const p of PRODUCT_SALES) {
    const m = months[p.monthIndex]!;
    out.push({
      id: `prod-${p.id}-${p.monthIndex}`,
      date: iso(new Date(Date.UTC(m.year, m.month, 17))),
      source: "boutique",
      subject: { kind: "product", id: p.id },
      gross: p.units * p.price,
      status: "completed",
      label: `${p.label} · ${p.units}×`,
      counterparty: pick(rand, GUESTS),
    });
  }

  for (const r of REFERRALS) {
    const m = months[r.monthIndex]!;
    out.push({
      id: r.id,
      date: iso(new Date(Date.UTC(m.year, m.month, 21))),
      source: "apporteurs",
      subject: { kind: "referral", id: r.id },
      gross: r.edomeRevenue,
      status: "completed",
      label: r.label,
      counterparty: CURRENT_USER.fullName,
    });
  }

  return out.sort((a, b) => a.date.localeCompare(b.date));
}

export const LEDGER: readonly Entry[] = build();
