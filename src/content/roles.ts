import type { PlatformRole } from "@/lib/model/identity";

/* ── Les profils qu'on peut incarner (chantier P3, « être un profil ») ─────

   On ne « visite » plus la plateforme en tant que RÔLE : on entre dans la peau
   d'une PERSONNE existante de l'annuaire (DECISIONS-2 §D2). On est Céline,
   agente à Lutry, avec son compte, ses biens, ses messages et son tableau de
   bord réels. Plus jamais un rôle sans visage.

   Ce fichier est la liste des seize profils proposés par le sélecteur, rangés
   par ce qu'ils font, avec ce qui ne se dérive pas de la donnée : la façon de
   dire qui l'on est (« agente immobilière »), l'action principale de la
   personne, ses favoris et ses recherches de départ. Tout le reste — nom,
   photo, ville, rôles, biens, montants — vient de l'annuaire et du journal.

   Les identifiants sont ceux de l'annuaire (`users[]`) : un id inconnu fait
   échouer `tests/data/p3-actor.test.ts`. */

export type PersonaGroup = "particuliers" | "proprietaires" | "agents" | "prestataires" | "createurs" | "apporteurs";

export interface Persona {
  /** Identifiant de l'annuaire. */
  id: string;
  group: PersonaGroup;
  /** Ce que fait la personne, en minuscules, accordé (« agente immobilière »). */
  as: string;
  /** L'action principale proposée dans la barre latérale. */
  cta: { label: string; href: string };
  /** Biens mis en favori au départ (des biens d'AUTRES personnes). */
  favorites: string[];
  /** Recherches enregistrées (vides pour qui ne cherche rien). */
  searches: { label: string; href: string }[];
}

export const PERSONA_GROUP_LABELS: Readonly<Record<PersonaGroup, string>> = {
  particuliers: "Particuliers",
  proprietaires: "Propriétaires & hôtes",
  agents: "Agents & agences",
  prestataires: "Prestataires",
  createurs: "Créateurs",
  apporteurs: "Apporteurs",
};

export const PERSONA_GROUP_ORDER: readonly PersonaGroup[] = [
  "particuliers",
  "proprietaires",
  "agents",
  "prestataires",
  "createurs",
  "apporteurs",
];

const PUBLISH = { label: "Publier un bien", href: "/publier" };
const SEARCH = { label: "Chercher un bien", href: "/explorer" };

export const PERSONAS: readonly Persona[] = [
  /* ── Particuliers ── */
  {
    id: "user-006",
    group: "particuliers",
    as: "particulière qui cherche à louer",
    cta: SEARCH,
    favorites: ["prop8", "prop17"],
    searches: [
      { label: "4 pièces à louer · Renens", href: "/recherche?q=Renens" },
      { label: "3,5 pièces à louer · Prilly", href: "/recherche?q=Prilly" },
    ],
  },
  {
    id: "user-008",
    group: "particuliers",
    as: "particulière, premier achat",
    cta: SEARCH,
    favorites: ["prop13", "prop15"],
    searches: [
      { label: "3,5 pièces à vendre · Morges", href: "/recherche?q=Morges" },
      { label: "Formation premier achat", href: "/formations/form-009" },
    ],
  },
  {
    id: "user-007",
    group: "particuliers",
    as: "particulier qui vend sa maison",
    cta: PUBLISH,
    favorites: [],
    searches: [],
  },
  /* ── Propriétaires & hôtes ── */
  {
    id: "user-001",
    group: "proprietaires",
    as: "propriétaire bailleur et hôte",
    cta: PUBLISH,
    favorites: ["prop12", "prop13", "prop3", "prop4"],
    searches: [],
  },
  {
    id: "user-003",
    group: "proprietaires",
    as: "investisseur",
    cta: PUBLISH,
    favorites: ["prop28", "prop19"],
    searches: [{ label: "Rendement > 4 % · Vaud et Genève", href: "/investisseurs" }],
  },
  {
    id: "user-013",
    group: "proprietaires",
    as: "hôte en courte durée",
    cta: PUBLISH,
    favorites: ["prop24"],
    searches: [],
  },
  /* ── Agents & agences ── */
  {
    id: "user-002",
    group: "agents",
    as: "agente immobilière",
    cta: PUBLISH,
    favorites: [],
    searches: [],
  },
  {
    id: "user-015",
    group: "agents",
    as: "directeur d'agence immobilière",
    cta: PUBLISH,
    favorites: [],
    searches: [],
  },
  {
    id: "user-004",
    group: "agents",
    as: "agente immobilière salariée",
    cta: PUBLISH,
    favorites: [],
    searches: [],
  },
  /* ── Prestataires ── */
  {
    id: "user-005",
    group: "prestataires",
    as: "photographe immobilier",
    cta: { label: "Proposer un service", href: "/services/proposer" },
    favorites: [],
    searches: [],
  },
  {
    id: "user-009",
    group: "prestataires",
    as: "architecte",
    cta: { label: "Proposer un service", href: "/services/proposer" },
    favorites: [],
    searches: [],
  },
  {
    id: "user-010",
    group: "prestataires",
    as: "décoratrice en home staging",
    cta: { label: "Proposer un service", href: "/services/proposer" },
    favorites: [],
    searches: [],
  },
  /* ── Créateurs ── */
  {
    id: "user-011",
    group: "createurs",
    as: "créatrice de formations",
    cta: { label: "Créer une formation", href: "/formations/creer" },
    favorites: [],
    searches: [],
  },
  {
    id: "user-016",
    group: "createurs",
    as: "créatrice de formations et hôte",
    cta: { label: "Créer une formation", href: "/formations/creer" },
    favorites: [],
    searches: [],
  },
  /* ── Apporteurs ── */
  {
    id: "user-012",
    group: "apporteurs",
    as: "apporteur d'affaires",
    cta: { label: "Recommander un bien", href: "/apporteurs" },
    favorites: ["prop20"],
    searches: [],
  },
  {
    id: "user-014",
    group: "apporteurs",
    as: "apporteuse d'affaires (marketplace)",
    cta: { label: "Recommander une formation", href: "/apporteurs" },
    favorites: [],
    searches: [],
  },
];

/** Le profil incarné par défaut : Léo, l'utilisateur de démonstration. */
export const DEFAULT_PERSONA_ID = "user-001";

export function personaFor(id: string): Persona | undefined {
  return PERSONAS.find((p) => p.id === id);
}

/* La visite guidée (refaite au chantier P5) désigne encore ses arrêts par
   rôle. On incarne alors la personne qui porte ce rôle dans le casting —
   jamais un rôle sans visage. */
const PERSONA_BY_ROLE: Partial<Record<PlatformRole, string>> = {
  particulier: "user-006",
  proprietaire: "user-007",
  hote: "user-001",
  agence: "user-015",
  agent: "user-004",
  prestataire: "user-005",
  createur: "user-011",
  apporteur: "user-012",
};

/** La personne à incarner pour un rôle (Léo à défaut). */
export function personaIdForRole(role: PlatformRole): string {
  return PERSONA_BY_ROLE[role] ?? DEFAULT_PERSONA_ID;
}

/* Les textes du sélecteur et du bandeau. */
export const personaPicker = {
  title: "Entrer dans la peau de…",
  hint: "Choisissez une personne : vous voyez la plateforme avec son compte, ses biens, ses messages et son tableau de bord. Aucun compte réel — c'est une démonstration.",
  youAre: "Vous êtes",
  change: "changer",
  current: "Profil incarné",
};
