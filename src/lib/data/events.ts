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

   ── Migration Supabase ──
   Accesseurs synchrones tant que les pages événements sont des Client
   Components. Cible : tables `events`, `event_registrations`. */

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
  intervenant: string;
  programme: string[];
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

type EventSeed = Omit<AppEvent, "enLigne">;

const EVENT_SEEDS: EventSeed[] = [
  {
    id: "e1",
    titre: "Salon de l'immobilier Suisse 2026",
    type: "Conférence",
    date: "2026-05-15",
    heure: "09:00",
    duree: "8h",
    lieu: "Palexpo, Genève",
    description:
      "Le plus grand salon immobilier de Suisse romande. Retrouvez plus de 200 exposants, des conférences thématiques et des ateliers pratiques pour tous les profils : investisseurs, propriétaires, courtiers et passionnés d'immobilier.",
    resume: "Le plus grand salon immobilier de Suisse romande.",
    thumbnail: `${U}1540575467063-178a50c2df87?w=600&h=400&fit=crop`,
    spots: 500,
    spotsRemaining: 127,
    prix: 45,
    featured: true,
    intervenant: "Plusieurs experts",
    programme: [
      "09:00 — Ouverture des portes",
      "10:00 — Keynote : Tendances immobilières 2026",
      "11:30 — Table ronde : Investir en Suisse romande",
      "14:00 — Ateliers pratiques (3 salles)",
      "16:00 — Networking & cocktail",
      "17:00 — Clôture",
    ],
  },
  {
    id: "e2",
    titre: "Webinaire : Optimiser son rendement locatif",
    type: "Webinaire",
    date: "2026-04-20",
    heure: "18:00",
    duree: "1h30",
    lieu: "En ligne",
    description:
      "Stratégies concrètes pour maximiser la rentabilité de vos biens locatifs. Calcul du rendement net, optimisation fiscale, gestion des charges et conseils pour réduire la vacance locative.",
    resume: "Stratégies pour maximiser la rentabilité de vos biens.",
    thumbnail: `${U}1591115765373-5207764f72e7?w=600&h=400&fit=crop`,
    spots: 200,
    spotsRemaining: 84,
    prix: 0,
    featured: false,
    intervenant: "Sophie Martin",
    programme: [
      "18:00 — Introduction et objectifs",
      "18:15 — Calcul du rendement net réel",
      "18:45 — Optimisation fiscale",
      "19:15 — Questions / Réponses",
      "19:30 — Fin",
    ],
  },
  {
    id: "e3",
    titre: "Atelier : Home staging pratique",
    type: "Atelier",
    date: "2026-04-10",
    heure: "14:00",
    duree: "3h",
    lieu: "Lausanne, Centre Flon",
    description:
      "Apprenez les techniques de home staging pour vendre plus vite et au meilleur prix. Mise en scène, photographie, dépersonnalisation et conseils de décoration accessibles à tous.",
    resume: "Apprenez les techniques de home staging pour vendre plus vite.",
    thumbnail: `${U}1586023492125-27b2c045efd7?w=600&h=400&fit=crop`,
    spots: 30,
    spotsRemaining: 8,
    prix: 89,
    featured: false,
    intervenant: "Claire Bernard",
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
    date: "2026-04-05",
    heure: "19:00",
    duree: "2h",
    lieu: "Hôtel Royal, Montreux",
    description:
      "Rencontrez les investisseurs les plus actifs de Suisse romande dans un cadre exclusif. Échangez vos stratégies, partagez vos deals et créez des partenariats durables.",
    resume: "Rencontrez les investisseurs les plus actifs de la région.",
    thumbnail: `${U}1511578314322-379afb476865?w=600&h=400&fit=crop`,
    spots: 80,
    spotsRemaining: 22,
    prix: 35,
    featured: false,
    intervenant: "Marc Dupont",
    programme: [
      "19:00 — Accueil & cocktail",
      "19:30 — Présentations flash (5 investisseurs)",
      "20:15 — Networking libre",
      "21:00 — Fin",
    ],
  },
  {
    id: "e5",
    titre: "Formation live : Fiscalité immobilière",
    type: "Formation live",
    date: "2026-03-20",
    heure: "10:00",
    duree: "4h",
    lieu: "En ligne",
    description:
      "Comprendre la fiscalité liée aux investissements immobiliers en Suisse. Impôt sur le revenu locatif, plus-values, déductions et optimisation via les sociétés immobilières.",
    resume: "Comprendre la fiscalité liée aux investissements immobiliers.",
    thumbnail: `${U}1554224155-6726b3ff858f?w=600&h=400&fit=crop`,
    spots: 150,
    spotsRemaining: 0,
    prix: 120,
    featured: false,
    intervenant: "Jean Leroy",
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
    titre: "Conférence : Marché immobilier 2026",
    type: "Conférence",
    date: "2026-03-10",
    heure: "17:00",
    duree: "2h",
    lieu: "EPFL, Lausanne",
    description:
      "Analyse approfondie et perspectives du marché immobilier suisse pour 2026. Données exclusives, tendances régionales et prévisions d'experts reconnus.",
    resume: "Analyse et perspectives du marché immobilier suisse.",
    thumbnail: `${U}1505373877841-8d25f7d46678?w=600&h=400&fit=crop`,
    spots: 300,
    spotsRemaining: 0,
    prix: 0,
    featured: false,
    intervenant: "Prof. A. Blanc",
    programme: [
      "17:00 — Ouverture",
      "17:15 — État des lieux du marché",
      "18:00 — Prévisions régionales",
      "18:30 — Débat avec le public",
      "19:00 — Fin",
    ],
  },
];

/** Les événements du catalogue. */
export const EVENTS: AppEvent[] = EVENT_SEEDS.map((e) => ({
  ...e,
  enLigne: e.lieu === "En ligne",
}));

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
 * Événements les plus chers d'abord — utilisé par le carrousel du feed,
 * qui mettait auparavant en avant les événements d'un jeu de données dont
 * les identifiants ne résolvaient sur aucune fiche.
 */
export function listEventsByPriceDesc(limit?: number): AppEvent[] {
  const sorted = [...EVENTS].sort((a, b) => b.prix - a.prix);
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}
