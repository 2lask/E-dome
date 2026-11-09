import { properties as CATALOGUE, formations as FORMATIONS, users as PEOPLE } from "@/lib/mock-data";
import { DEMO_TODAY, iso, last12Months, stayLabel } from "./clock";
import { CURRENT_USER, CURRENT_USER_ID, PROFILES } from "./identity";

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
  | "apporteurs"
  /**
   * VOLUME D'AFFAIRES D'AGENCE (GMV), non commissionnable. La vente immobilière
   * classique est déjà exclue de `CommissionPole` (`charge.ts`) : E-Dome ne la
   * facture pas. Une écriture `vente` porte donc TOUJOURS `commissionable:
   * false` (invariant), et `derive.ts` la garde HORS du revenu — affichée
   * seulement comme volume (« 3,5 M de biens vendus »), jamais sommée dans le
   * CA d'E-Dome. Absente d'`ALL_SOURCES` pour cette raison.
   */
  | "vente";

export type SubjectKind =
  | "property"
  | "formation"
  | "event"
  | "service"
  | "product"
  | "referral";

export interface Entry {
  id: string;
  /**
   * À qui revient ce montant. Chaque écriture est attribuée à la personne qui
   * gagne/paie — c'est ce qui permet à 15 profils de porter chacun des montants
   * cohérents sans les mélanger dans un journal géant invérifiable. `derive.ts`
   * filtre dessus, et les invariants bouclent par `ownerId`.
   */
  ownerId: string;
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
  /**
   * Absent ou `true` = flux qu'E-Dome commissionne (compte dans le revenu).
   * `false` = volume d'affaires d'agence (GMV, ventes à des millions) : affiché
   * comme volume, JAMAIS sommé dans le revenu d'E-Dome. Voir `LedgerSource`.
   */
  commissionable?: boolean;
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
  "Inès Khan",
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

   La saisonnalité est volontaire et lisible : Verbier se remplit l'hiver,
   la Riviera au Jazz de juillet, le studio de Genève tourne toute l'année. Une courbe plate se remarquerait autant qu'une courbe fausse. */

/** Nuits vendues par mois, du plus ancien (octobre de l'an passé) au plus
    récent (le mois de DEMO_TODAY, septembre). Index 9 = juillet : le Montreux
    Jazz fait le pic de la Riviera ; index 2 à 5 = l'hiver, la saison de
    Verbier ; l'été est creux à Marrakech. Chaque plan finit sur un mois courant
    strictement positif (invariant 5). */
const NIGHTS_BY_PROPERTY: Record<string, readonly number[]> = {
  // Léo — Verbier : la saison de ski, un creux au printemps, un été correct.
  prop5: [2, 1, 9, 12, 13, 10, 4, 1, 3, 8, 7, 3],
  // Léo — Genève, près de Cornavin : demande d'affaires régulière.
  prop2: [14, 13, 15, 16, 14, 12, 10, 11, 15, 17, 16, 15],
  // Léo — Lausanne Sous-Gare : régulier, plus fort l'été.
  prop9: [10, 9, 8, 9, 11, 12, 13, 15, 16, 18, 17, 14],
  // Céline — pied-à-terre à Ouchy, demande estivale au lac.
  prop23: [6, 5, 4, 3, 4, 5, 7, 8, 9, 7, 6, 7],
  // Ennio — studio de Montreux : Jazz en juillet, marché de Noël en décembre.
  prop24: [8, 7, 9, 5, 6, 7, 9, 10, 11, 16, 12, 9],
  // Ennio — 2 pièces à Nyon, séjours professionnels.
  prop25: [5, 5, 6, 4, 5, 6, 7, 8, 7, 6, 7, 6],
  // Jean-Luc — meublé géré au centre de Neuchâtel.
  prop26: [4, 4, 3, 3, 4, 5, 6, 7, 6, 5, 5, 6],
  // Mirjana — 2 pièces vue lac à Montreux.
  prop12: [9, 7, 12, 6, 8, 9, 11, 13, 15, 22, 19, 14],
  // Mirjana — studio de Clarens.
  prop6: [10, 8, 13, 7, 9, 10, 12, 14, 16, 22, 20, 15],
  // Amina — riad en médina : l'automne et le printemps, un été creux (chaleur).
  prop4: [16, 18, 20, 12, 14, 17, 19, 15, 9, 7, 8, 13],
};

/* Les séjours des personnes de l'annuaire — ceux qui fondent un avis.
   La PREMIÈRE réservation du bien, ce mois-là, est à leur nom : un avis de
   séjour se rattache ainsi à une écriture réelle (invariant 18). Clé :
   `bien:indexDuMois`. */
const NAMED_GUESTS: Record<string, string> = {
  "prop2:6": "user-016", // Amina, salon à Genève (avril)
  "prop2:8": "user-005", // Nikola, shooting à Genève (juin)
  "prop5:3": "user-003", // Ennio, ski (janvier)
  "prop5:4": "user-011", // Sandrine, semaine de ski en famille (février)
  "prop9:5": "user-013", // Mirjana, à Lausanne (mars)
  "prop23:9": "user-012", // Yves et son épouse, concert (juillet)
  "prop23:10": "user-014", // Hélène, rendez-vous à Lausanne (août)
  "prop24:9": "user-008", // Clémence, week-end au Jazz (juillet)
  "prop25:7": "user-015", // Jean-Luc, rendez-vous à Genève (mai)
  "prop26:5": "user-009", // Reto, relevés rue des Parcs (mars)
  "prop12:8": "user-001", // Léo, chez une consœur (juin)
  "prop12:10": "user-006", // Ana et sa famille (août)
  "prop6:9": "user-014", // Hélène, Montreux Jazz (juillet)
  "prop4:6": "user-002", // Céline, vacances (avril)
};

/** Inscriptions vendues par mois, par formation. La somme sur douze mois est
    le `studentCount` du catalogue (invariant 19). */
const FORMATION_SALES: Record<string, readonly number[]> = {
  // Léo — investissement locatif.
  "form-001": [2, 3, 2, 4, 3, 2, 3, 5, 4, 3, 4, 5],
  // Amina — gestion locative touristique.
  "form-002": [6, 5, 7, 8, 6, 5, 7, 6, 4, 3, 5, 7],
  // Reto — rénovation énergétique.
  "form-005": [1, 2, 1, 2, 2, 3, 2, 1, 1, 1, 2, 2],
  // Sandrine — fiscalité : le pic de février-mars, la saison des déclarations.
  "form-007": [4, 5, 3, 6, 9, 11, 4, 2, 2, 1, 3, 5],
  // Sandrine — premier achat.
  "form-009": [2, 3, 2, 3, 4, 4, 3, 2, 2, 2, 3, 4],
  // Amina — pricing dynamique.
  "form-010": [3, 4, 6, 5, 4, 6, 5, 4, 3, 2, 4, 5],
};

/* Les inscriptions des personnes de l'annuaire — celles qui fondent un avis
   de formation. La première inscription du mois est à leur nom. */
const NAMED_STUDENTS: Record<string, string> = {
  "form-001:2": "user-003", // Ennio (décembre)
  "form-001:6": "user-008", // Clémence (avril)
  "form-005:5": "user-004", // Aline (mars)
  "form-007:4": "user-001", // Léo (février)
  "form-009:7": "user-008", // Clémence (mai)
  "form-010:3": "user-013", // Mirjana (janvier)
};

/** Nom affichable d'une personne de l'annuaire, pour la contrepartie. */
function personName(id: string): string {
  const p = PEOPLE.find((u) => u.id === id);
  if (!p) throw new Error(`Journal : personne inconnue à l'annuaire — ${id}`);
  return `${p.firstName} ${p.lastName}`;
}

/** Inscriptions vendues sur une formation, mois par mois. */
export function formationSalesPlan(formationId: string): readonly number[] {
  const plan = FORMATION_SALES[formationId];
  if (!plan) throw new Error(`Journal : aucun plan d'inscriptions pour ${formationId}`);
  return plan;
}

/** Événements organisés : trimestriels, avec places vendues et prix du billet. */
const EVENTS: readonly { monthIndex: number; id: string; title: string; seats: number; price: number }[] = [
  { monthIndex: 2, id: "ev-atelier-1", title: "Atelier rendement locatif", seats: 12, price: 45 },
  { monthIndex: 5, id: "ev-visite-1", title: "Visite groupée Chalet Verbier", seats: 8, price: 75 },
  { monthIndex: 8, id: "ev-atelier-2", title: "Atelier charges et décompte", seats: 14, price: 45 },
  { monthIndex: 11, id: "ev-networking", title: "Networking propriétaires romands", seats: 22, price: 25 },
];

/** Prestations vendues ponctuellement. */
const SERVICES: readonly { monthIndex: number; id: string; label: string; amount: number; client: string }[] = [
  { monthIndex: 1, id: "sv-photo-1", label: "Accueil voyageurs et remise des clés · voisin de Sous-Gare", amount: 480, client: "Marc Dupont" },
  { monthIndex: 4, id: "sv-staging-1", label: "Mise en service d'un meublé · Verbier", amount: 1250, client: "Anne Schmid" },
  { monthIndex: 7, id: "sv-photo-2", label: "Accompagnement d'un hôte débutant · Lausanne", amount: 620, client: "Laura Meier" },
  { monthIndex: 10, id: "sv-redac-1", label: "Rédaction d'annonces", amount: 240, client: "Cédric Lopez" },
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

  /* On boucle sur la TABLE des profils, pas sur des constantes globales : chaque
     écriture est taguée de l'`ownerId` du profil qui la produit. Aujourd'hui un
     seul profil (l'utilisateur courant) ; l'étape 3 en ajoutera d'autres sans
     toucher à cette boucle. */
  for (const profile of PROFILES) {
    /* Biens — un séjour se découpe en réservations de 2 à 7 nuits, jusqu'à
       épuisement du nombre de nuits vendues dans le mois. */
    for (const propertyId of profile.ownedPropertyIds) {
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
          /* Le tirage a toujours lieu (la suite reste déterministe), mais la
             première réservation du mois peut revenir à une personne nommée. */
          const drawn = pick(rand, GUESTS);
          const named = seq === 0 ? NAMED_GUESTS[`${propertyId}:${mi}`] : undefined;

          out.push({
            id: `res-${propertyId}-${mi}-${seq}`,
            ownerId: profile.ownerId,
            date: iso(start),
            source: "biens",
            subject: { kind: "property", id: propertyId },
            gross: nights * price,
            status: isFuture ? "pending" : isPast ? "completed" : "confirmed",
            label: name,
            counterparty: named ? personName(named) : drawn,
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
    for (const formationId of profile.ownedFormationIds) {
      const price = formationPrice(formationId);
      const sales = formationSalesPlan(formationId);
      months.forEach((m, mi) => {
        const count = sales[mi]!;
        for (let i = 0; i < count; i++) {
          const drawn = pick(rand, GUESTS);
          const named = i === 0 ? NAMED_STUDENTS[`${formationId}:${mi}`] : undefined;
          out.push({
            id: `form-${formationId}-${mi}-${i}`,
            ownerId: profile.ownerId,
            /* Réparties dans le mois, jamais au-delà du 28 : onze inscriptions
               ne débordent plus sur le mois suivant. */
            date: iso(new Date(Date.UTC(m.year, m.month, 2 + Math.floor((i * 26) / count)))),
            source: "formations",
            subject: { kind: "formation", id: formationId },
            gross: price,
            status: "completed",
            label: FORMATIONS.find((f) => f.id === formationId)!.title,
            counterparty: named ? personName(named) : drawn,
          });
        }
      });
    }

    /* Mandats de vente d'agence — VOLUME D'AFFAIRES, jamais du revenu.
       Une écriture par mandat conclu : `source: "vente"`, `commissionable:
       false` (invariant 14). Le montant est le prix du bien au catalogue —
       c'est un volume, sommé par `gmvVolume()`, exclu de tout calcul de revenu
       par `derive.keep()`. Réparti sur l'année et daté dans la fenêtre. */
    (profile.agencySalePropertyIds ?? []).forEach((propertyId, idx) => {
      const p = CATALOGUE.find((x) => x.id === propertyId);
      if (!p) throw new Error(`Journal : mandat inconnu au catalogue — ${propertyId}`);
      const m = months[(idx * 4 + 3) % 12]!;
      out.push({
        id: `gmv-${propertyId}`,
        ownerId: profile.ownerId,
        date: iso(new Date(Date.UTC(m.year, m.month, 15))),
        source: "vente",
        subject: { kind: "property", id: propertyId },
        gross: p.price,
        status: "completed",
        label: `Mandat de vente conclu · ${p.title}`,
        /* L'acheteur est une personne de l'annuaire (`soldTo`, invariant 17). */
        counterparty: p.soldTo ? personName(p.soldTo) : pick(rand, GUESTS),
        commissionable: false,
      });
    });

    /* Prestations de la marketplace — une écriture par prestation vendue, au
       nom du client de l'annuaire (sujet des avis de prestation). */
    for (const sale of profile.serviceSales ?? []) {
      const m = months[sale.monthIndex]!;
      out.push({
        id: sale.id,
        ownerId: profile.ownerId,
        date: iso(new Date(Date.UTC(m.year, m.month, 8))),
        source: "services",
        subject: { kind: "service", id: sale.id },
        gross: sale.amount,
        status: "completed",
        label: sale.label,
        counterparty: personName(sale.clientId),
      });
    }
  }

  /* Événements, services, boutique et apports : l'activité de l'utilisateur
     courant (les autres profils recevront la leur à l'étape 3). Chaque écriture
     porte son `ownerId`. */
  for (const e of EVENTS) {
    const m = months[e.monthIndex]!;
    out.push({
      id: e.id,
      ownerId: CURRENT_USER_ID,
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
      ownerId: CURRENT_USER_ID,
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
      ownerId: CURRENT_USER_ID,
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
      ownerId: CURRENT_USER_ID,
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
