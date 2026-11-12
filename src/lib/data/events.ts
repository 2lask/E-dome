/* ── Événements — SOURCE UNIQUE DE VÉRITÉ ────────────────────────────────────

   Il existait trois jeux d'événements concurrents :

   1. `app/(app)/evenements/[id]/page.tsx` — `export const EVENTS` (e1→e6),
      le plus complet (programme détaillé, descriptions longues). Exporté et
      importé à l'envers par `/apporteurs`, ce qui embarquait toute la page
      fiche dans le bundle du consommateur.
   2. `app/(app)/evenements/page.tsx` — un `EVENTS` local, mêmes ids et mêmes
      champs mais descriptions raccourcies et sans `programme`.
   3. `lib/mock-data.ts` — `events` (evt-001→evt-006), forme entièrement
      différente (champs anglais, `speaker: User`, `tags`, `isOnline`).

   Le jeu n° 3 était consommé par `components/feed/recommended-carousel.tsx`,
   qui construisait des liens `/evenements/evt-002`. Comme la fiche détail ne
   résolvait que `e1`→`e6`, **tous les liens événement du carrousel du feed
   menaient à « Événement introuvable »**. Ce module supprime cette fracture
   en ramenant les quatre consommateurs sur le même espace d'identifiants.

   ── Deux longueurs de description, volontairement ──
   `description` est la version longue (fiche détail), `resume` la version
   courte (cartes de liste et carrousel). Les deux existaient déjà dans le
   code ; les conserver séparément évite de casser la mise en page des cartes.

   ── Organisateurs et dates (chantier P6c) ──
   Chaque événement a un ORGANISATEUR qui est une personne de l'annuaire
   (`organizerId`) : plus de « Plusieurs experts » ni de noms inventés.
   `intervenant` n'est plus saisi, il se lit dans l'annuaire. Les dates sont
   posées autour de `DEMO_TODAY` (30 septembre 2026) : les événements à venir
   sont réservables, les passés sont marqués comme tels. Un réseau qui se
   lance : des dizaines de places, pas des centaines.

   ── Migration Supabase ──
   Accesseurs synchrones tant que les pages événements sont des Client
   Components. Cible : tables `events`, `event_registrations`. */

import { personById, requirePerson } from "@/lib/demo/directory";
import { DEMO_TODAY, iso } from "@/lib/demo/clock";
import { eventIdOf, type SessionEvent, type SessionState } from "@/lib/demo/session-store";

export type EventType =
  | "Conférence"
  | "Webinaire"
  | "Atelier"
  | "Networking"
  | "Formation live";

export interface AppEvent {
  id: string;
  titre: string;
  type: EventType;
  /** ISO `yyyy-mm-dd`. */
  date: string;
  heure: string;
  duree: string;
  lieu: string;
  /** Dérivé de `lieu` — évite de stocker deux fois la même information. */
  enLigne: boolean;
  /** Version longue, affichée sur la fiche. */
  description: string;
  /** Version courte, affichée sur les cartes de liste et le carrousel. */
  resume: string;
  thumbnail: string;
  spots: number;
  spotsRemaining: number;
  /** En CHF. 0 = gratuit. */
  prix: number;
  featured: boolean;
  /** L'organisateur : une personne de l'annuaire (`requirePerson`). */
  organizerId: string;
  /** « Prénom Nom » de l'organisateur, lu dans l'annuaire — jamais saisi. */
  intervenant: string;
  programme: string[];
  /** Créé pendant la visite (mémoire de session). */
  fromSession?: boolean;
}

/** Classes de badge par type. Étaient dupliquées dans les deux pages. */
export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  Webinaire: "bg-blue-500/20 text-blue-400",
  Conférence: "bg-purple-500/20 text-purple-400",
  Atelier: "bg-green-500/20 text-green-400",
  Networking: "bg-amber-500/20 text-amber-400",
  "Formation live": "bg-rose-500/20 text-rose-400",
};

const U = "https://images.unsplash.com/photo-";

type EventSeed = Omit<AppEvent, "enLigne" | "intervenant">;

/* Les ids e1→e5 sont conservés : l'affiliation (`demo/affiliation.ts`) leur
   rattache des ventes de billets, et les prix sont inchangés pour que les
   carnets d'apporteurs restent exacts. */
const EVENT_SEEDS: EventSeed[] = [
  {
    id: "e1",
    titre: "Rencontres immobilières de Neuchâtel",
    type: "Conférence",
    date: "2026-10-24",
    heure: "09:00",
    duree: "6h",
    lieu: "Neuchâtel, centre-ville",
    description:
      "Une journée organisée par Hartmann Immobilier SA pour les propriétaires et futurs acheteurs du canton : le marché neuchâtelois, la rénovation énergétique d'un immeuble, la fiscalité d'un bien loué. Des intervenants que vous retrouvez sur E-Dome, des questions concrètes, un repas partagé.",
    resume: "Marché neuchâtelois, rénovation énergétique et fiscalité, en une journée.",
    thumbnail: `${U}1540575467063-178a50c2df87?w=600&h=400&fit=crop`,
    spots: 120,
    spotsRemaining: 41,
    prix: 45,
    featured: true,
    organizerId: "user-015",
    programme: [
      "09:00 — Accueil, par Jean-Luc Hartmann",
      "09:30 — Le marché neuchâtelois en 2026, par Aline Tschanz",
      "10:45 — Rénover un immeuble : Minergie et CECB, par Reto Jungo",
      "12:00 — Repas",
      "13:30 — Déclarer un bien loué, par Sandrine Monnier",
      "15:00 — Questions libres et clôture",
    ],
  },
  {
    id: "e2",
    titre: "Webinaire : Optimiser son rendement locatif",
    type: "Webinaire",
    date: "2026-10-15",
    heure: "18:00",
    duree: "1h30",
    lieu: "En ligne",
    description:
      "Un an après avoir mis son appartement de Sous-Gare en location, Léo partage ses chiffres : rendement brut et net, charges qu'il n'avait pas vues venir, vacance locative, et ce qu'il ferait autrement. Pas une méthode miracle, un retour d'expérience.",
    resume: "Un bailleur lausannois partage ses chiffres, sans méthode miracle.",
    thumbnail: `${U}1591115765373-5207764f72e7?w=600&h=400&fit=crop`,
    spots: 100,
    spotsRemaining: 63,
    prix: 0,
    featured: false,
    organizerId: "user-001",
    programme: [
      "18:00 — Pourquoi j'ai loué plutôt que vendu",
      "18:15 — Rendement brut, rendement net : mes vrais chiffres",
      "18:45 — Charges, entretien, vacance",
      "19:15 — Questions / Réponses",
      "19:30 — Fin",
    ],
  },
  {
    id: "e3",
    titre: "Atelier : Home staging pratique",
    type: "Atelier",
    date: "2026-10-10",
    heure: "14:00",
    duree: "3h",
    lieu: "Vevey",
    description:
      "Elena Currat montre, pièce par pièce, comment préparer un logement pour la vente ou la location : désencombrer, dépersonnaliser, éclairer, photographier. Exercices en petit groupe, avant/après de vrais chantiers.",
    resume: "Préparer un logement pour la vente, pièce par pièce.",
    thumbnail: `${U}1586023492125-27b2c045efd7?w=600&h=400&fit=crop`,
    spots: 16,
    spotsRemaining: 5,
    prix: 89,
    featured: false,
    organizerId: "user-010",
    programme: [
      "14:00 — Accueil",
      "14:15 — Les bases du home staging",
      "15:00 — Exercice pratique en binôme",
      "16:00 — Retours et astuces avancées",
      "17:00 — Fin",
    ],
  },
  {
    id: "e4",
    titre: "Networking investisseurs romands",
    type: "Networking",
    date: "2026-11-05",
    heure: "19:00",
    duree: "2h",
    lieu: "Genève, Champel",
    description:
      "Une soirée en petit comité, à l'invitation d'Ennio Bordoni : chacun présente en cinq minutes un dossier en cours, chiffres à l'appui. Pas de vente, pas de démarchage — des échanges entre personnes qui investissent.",
    resume: "Une soirée en petit comité, chiffres à l'appui.",
    thumbnail: `${U}1511578314322-379afb476865?w=600&h=400&fit=crop`,
    spots: 40,
    spotsRemaining: 18,
    prix: 35,
    featured: false,
    organizerId: "user-003",
    programme: [
      "19:00 — Accueil",
      "19:30 — Présentations flash (cinq dossiers)",
      "20:15 — Échanges libres",
      "21:00 — Fin",
    ],
  },
  {
    id: "e5",
    titre: "Formation live : Fiscalité immobilière",
    type: "Formation live",
    date: "2026-10-20",
    heure: "10:00",
    duree: "4h",
    lieu: "En ligne",
    description:
      "Sandrine Monnier, ancienne fiduciaire, reprend en direct les points de sa formation : imposition de la valeur locative et des loyers, déductions d'entretien, plus-values, cas d'un bien situé dans un autre canton.",
    resume: "Valeur locative, déductions, plus-values : l'essentiel, en direct.",
    thumbnail: `${U}1554224155-6726b3ff858f?w=600&h=400&fit=crop`,
    spots: 60,
    spotsRemaining: 12,
    prix: 120,
    featured: false,
    organizerId: "user-011",
    programme: [
      "10:00 — Introduction",
      "10:30 — Fiscalité des revenus locatifs",
      "11:30 — Pause",
      "11:45 — Plus-values et déductions",
      "13:00 — Questions / Réponses",
      "14:00 — Fin",
    ],
  },
  {
    id: "e6",
    titre: "Café-conseil : premier achat",
    type: "Atelier",
    date: "2026-09-12",
    heure: "10:00",
    duree: "1h30",
    lieu: "Morges",
    description:
      "Céline Bovard avait proposé un café aux personnes qui hésitent à acheter leur premier logement : fonds propres, hypothèque, frais de notaire, et la question que tout le monde se pose — est-ce le moment ?",
    resume: "Fonds propres, hypothèque, frais : les questions d'un premier achat.",
    thumbnail: `${U}1505373877841-8d25f7d46678?w=600&h=400&fit=crop`,
    spots: 12,
    spotsRemaining: 0,
    prix: 0,
    featured: false,
    organizerId: "user-002",
    programme: [
      "10:00 — Tour de table",
      "10:15 — Fonds propres et hypothèque",
      "10:45 — Les frais qu'on oublie",
      "11:15 — Questions libres",
      "11:30 — Fin",
    ],
  },
  {
    id: "e7",
    titre: "Visite de chantier : rénovation Minergie",
    type: "Atelier",
    date: "2026-09-05",
    heure: "09:30",
    duree: "2h",
    lieu: "Neuchâtel",
    description:
      "Reto Jungo a ouvert le chantier de rénovation énergétique d'un immeuble neuchâtelois : isolation, pompe à chaleur, CECB avant et après. Une visite technique, en petit groupe.",
    resume: "Isolation, pompe à chaleur, CECB : une visite technique.",
    thumbnail: `${U}1586023492125-27b2c045efd7?w=600&h=400&fit=crop`,
    spots: 15,
    spotsRemaining: 0,
    prix: 0,
    featured: false,
    organizerId: "user-009",
    programme: [
      "09:30 — Accueil sur le chantier",
      "09:45 — L'enveloppe : isolation et fenêtres",
      "10:30 — Chauffage : la pompe à chaleur",
      "11:00 — CECB avant / après",
      "11:30 — Fin",
    ],
  },
];

const fullName = (id: string) => {
  const p = requirePerson(id);
  return `${p.firstName} ${p.lastName}`;
};

/** Les événements du catalogue. */
export const EVENTS: AppEvent[] = EVENT_SEEDS.map((e) => ({
  ...e,
  enLigne: e.lieu === "En ligne",
  intervenant: fullName(e.organizerId),
}));

/* ── Le temps des événements (horloge de la démonstration) ───────────────── */

const TODAY_ISO = iso(DEMO_TODAY);

/** Passé : avant le « aujourd'hui » de la démonstration (30 septembre 2026). */
export function isPastEvent(e: Pick<AppEvent, "date">): boolean {
  return e.date < TODAY_ISO;
}

const MONTHS_LONG = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

/** « 24 octobre 2026 », sans `toLocaleDateString` (hydratation stable). */
export function eventDateLabel(isoDate: string): string {
  const [y, m, d] = isoDate.slice(0, 10).split("-").map(Number) as [number, number, number];
  if (!y || !m || !d) return isoDate;
  return `${d} ${MONTHS_LONG[m - 1]} ${y}`;
}

/* ── Événements créés pendant la visite ──────────────────────────────────── */

const EVENT_TYPES: EventType[] = ["Conférence", "Webinaire", "Atelier", "Networking", "Formation live"];
const DEFAULT_SESSION_THUMB = `${U}1540575467063-178a50c2df87?w=600&h=400&fit=crop`;

/** Les événements publiés depuis /evenements/creer (journal de session). */
export function sessionEvents(state: SessionState): AppEvent[] {
  return state.events
    .filter((e): e is Extract<SessionEvent, { kind: "event.published" }> => e.kind === "event.published")
    .map((e) => ({
      id: eventIdOf(e.seq),
      titre: e.data.titre,
      type: (EVENT_TYPES as string[]).includes(e.data.type) ? (e.data.type as EventType) : "Atelier",
      date: e.data.date,
      heure: e.data.heure,
      duree: e.data.duree,
      lieu: e.data.lieu,
      enLigne: e.data.lieu === "En ligne",
      description: e.data.description,
      resume: e.data.description.slice(0, 90),
      thumbnail: e.data.image || DEFAULT_SESSION_THUMB,
      spots: Math.max(1, e.data.places),
      spotsRemaining: Math.max(1, e.data.places),
      prix: Math.max(0, e.data.prix),
      featured: false,
      organizerId: e.actorId,
      intervenant: personById(e.actorId) ? fullName(e.actorId) : "",
      programme: [],
      fromSession: true,
    }))
    .reverse();
}

/** Catalogue + créations de session, les plus récentes créations en tête. */
export function allEvents(state: SessionState): AppEvent[] {
  return [...sessionEvents(state), ...EVENTS];
}

/* ── Accesseurs ──────────────────────────────────────────────────────────── */

export function listEvents(): AppEvent[] {
  return EVENTS;
}

export function getEventById(id: string): AppEvent | undefined {
  return EVENTS.find((e) => e.id === id);
}

export function listEventIds(): string[] {
  return EVENTS.map((e) => e.id);
}

export function getFeaturedEvent(): AppEvent | undefined {
  return EVENTS.find((e) => e.featured);
}

/** Complet quand il ne reste aucune place. */
export function isSoldOut(e: AppEvent): boolean {
  return e.spotsRemaining <= 0;
}

/**
 * Événements à venir, les plus chers d'abord — utilisé par le carrousel du
 * feed, qui mettait auparavant en avant les événements d'un jeu de données
 * dont les identifiants ne résolvaient sur aucune fiche.
 */
export function listEventsByPriceDesc(limit?: number): AppEvent[] {
  const sorted = EVENTS.filter((e) => !isPastEvent(e)).sort((a, b) => b.prix - a.prix);
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}
