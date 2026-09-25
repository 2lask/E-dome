import type { Profile, ProfileVisibility, PersonSummary } from "./profile-types";
import { CURRENT_USER } from "./demo/identity";
import { DIRECTORY, personById } from "./demo/directory";
import { roleLabels } from "./types";

/* ─── Données de profil (démo) ────────────────────────────────────────────
   - DEFAULT_PROFILE : mon profil (Léo), source initiale du contexte, ensuite
     persisté dans localStorage et éditable.
   - getMockProfile(id) : profil public d'un autre utilisateur (/profil/[id]).
     Quelques profils sont enrichis à la main ; les autres sont dérivés d'un
     gabarit pour ne jamais afficher de sections vides. */

const DEFAULT_VISIBILITY: ProfileVisibility = {
  isPublic: true,
  showEmail: false,
  showPhone: false,
  showStats: true,
  hiddenSections: [],
};

/* L identite vient de demo/identity : id, nom, adresse, ville, titre,
   presentation et roles n y sont plus recopies. L identifiant passe de « me »
   a « user-001 » pour que l utilisateur courant soit une ligne du meme
   annuaire que les autres — sans quoi aucune verification ne peut etablir
   qu il est bien l auteur de ce qu il publie. */
export const DEFAULT_PROFILE: Profile = {
  id: CURRENT_USER.id,
  firstName: CURRENT_USER.firstName,
  lastName: CURRENT_USER.lastName,
  email: CURRENT_USER.email,
  phone: CURRENT_USER.phone,
  avatar: CURRENT_USER.avatar,
  banner: CURRENT_USER.banner,
  headline: CURRENT_USER.headline,
  location: { city: CURRENT_USER.city, country: CURRENT_USER.country },
  roles: [...CURRENT_USER.roles],
  about: CURRENT_USER.about,
  experiences: [
    {
      id: "exp-2",
      title: "Investisseur immobilier indépendant",
      company: "Portefeuille privé",
      employmentType: "independant",
      location: "Suisse romande",
      current: true,
      startMonth: 6,
      startYear: 2015,
      description:
        "Constitution et gestion d'un portefeuille locatif (courte et longue durée) en Suisse et au Maroc. Rendement net moyen 5,2 %.",
    },
    {
      id: "exp-3",
      title: "Consultant en gestion de patrimoine",
      company: "Banque cantonale",
      employmentType: "temps-plein",
      location: "Genève, Suisse",
      current: false,
      startMonth: 9,
      startYear: 2011,
      endMonth: 5,
      endYear: 2015,
      description: "Conseil en investissement immobilier et structuration patrimoniale pour clients privés.",
    },
  ],
  education: [
    {
      id: "edu-1",
      school: "HEC Lausanne (UNIL)",
      degree: "Master en finance",
      field: "Finance & immobilier",
      startYear: 2008,
      endYear: 2010,
    },
    {
      id: "edu-2",
      school: "USPI Formation",
      degree: "Certification de gérance",
      field: "Gestion immobilière",
      startYear: 2013,
      endYear: 2013,
    },
  ],
  skills: [
    { id: "sk-1", name: "Investissement locatif" },
    { id: "sk-2", name: "Analyse de rendement" },
    { id: "sk-3", name: "Fiscalité immobilière" },
    { id: "sk-4", name: "Gestion locative" },
    { id: "sk-5", name: "Négociation" },
    { id: "sk-6", name: "Financement hypothécaire" },
  ],
  languages: [
    { id: "lg-1", name: "Français", level: "natif" },
    { id: "lg-2", name: "Anglais", level: "courant" },
    { id: "lg-3", name: "Allemand", level: "intermediaire" },
  ],
  certifications: [
    { id: "ce-1", name: "Certification de gérance USPI", issuer: "USPI Suisse", year: 2013 },
  ],
  links: [
    { id: "ln-1", type: "website", url: "https://e-dome.ch", label: "e-dome.ch" },
    { id: "ln-2", type: "linkedin", url: "https://linkedin.com/in/leomartin", label: "LinkedIn" },
  ],
  visibility: DEFAULT_VISIBILITY,
  meta: { verified: true, membreFondateur: false, memberSince: CURRENT_USER.memberSince },
  stats: { ...CURRENT_USER.stats },
};

// ─── Profils publics (autres utilisateurs) ───────────────────────────────

/* Un profil public dérive maintenant de l'ANNUAIRE (demo/directory), pas d'un
   second annuaire concurrent. L'identité et les statistiques — prénom, nom,
   avatar, ville, pays, rôles, abonnés, avis, note — viennent de la vraie
   personne de `users[]`. `/profil/user-002` affiche donc la MÊME Sophie que le
   fil, la messagerie et le tableau de bord.

   `PUBLIC_SEEDS` ne garde QUE les ENRICHISSEMENTS « façon LinkedIn » qui n'ont
   pas de conflit d'identité : titre, présentation longue, bannière, compétences,
   expériences, formations, langues, liens. Tout le reste est retiré et pris à
   l'annuaire.

   Les seeds retenus sont uniquement ceux dont le contenu s'accorde avec la
   personne de l'annuaire (nom ET rôles). Les six seeds « user-007 … user-012 »
   décrivaient des personnes DIFFÉRENTES de celles de `users[]` (Camille Rochat
   sur l'id de Pierre Gonçalves, etc.) : c'était le bug racine (« un id, deux
   identités »), pas un enrichissement — ils sont supprimés, et ces profils
   dérivent proprement de l'annuaire. Les seeds Marc (user-003) et Lucas
   (user-005) sont également retirés : leur titre annonçait un rôle
   (« Courtier », « Promoteur ») que l'annuaire ne leur donne pas. */
type PublicSeed = {
  headline?: string;
  about?: string;
  banner?: string;
  membreFondateur?: boolean;
  experiences?: Profile["experiences"];
  education?: Profile["education"];
  skills?: string[];
  languages?: Profile["languages"];
  links?: Profile["links"];
};

const PUBLIC_SEEDS: Record<string, PublicSeed> = {
  "user-002": {
    banner: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=400&fit=crop",
    headline: "Courtière Brevet Fédéral · Immobilier de standing",
    about:
      "Courtière Brevet Fédéral spécialisée dans l'immobilier de standing en Suisse romande. J'accompagne vendeurs et acquéreurs sur des biens d'exception avec discrétion et rigueur.",
    skills: ["Courtage", "Estimation", "Home staging", "Négociation", "Immobilier de luxe"],
  },
  "user-004": {
    banner: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1200&h=400&fit=crop",
    headline: "Formatrice & hôte · Gestion locative et pricing dynamique",
    about:
      "Formatrice et hôte au Maroc. Experte en investissement locatif dans les marchés émergents et en optimisation des revenus courte durée.",
    skills: ["Gestion locative", "Pricing dynamique", "Airbnb", "Marketing immobilier"],
  },
  "user-006": {
    banner: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=400&fit=crop",
    headline: "Agence premium · Résidences de luxe à Dubaï",
    about:
      "Agence immobilière premium à Dubaï. Spécialiste des résidences de luxe et des opportunités off-market pour investisseurs internationaux.",
    skills: ["Immobilier de luxe", "Off-market", "Investissement international"],
  },
  "user-015": {
    headline: "Agence familiale · Vente & gestion locative depuis 1992",
    about:
      "Agence familiale en Suisse romande. Vente et gestion locative depuis 1992, avec un service de proximité et une parfaite connaissance du marché local.",
    skills: ["Vente", "Gestion locative", "Estimation", "Conseil"],
  },
};

/** Les ids qui portent un enrichissement de profil. Chacun DOIT exister à
    l'annuaire (garde-fou dans demo/invariants.ts). */
export const PUBLIC_SEED_IDS = Object.keys(PUBLIC_SEEDS);

const GENERIC_BANNER = "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=400&fit=crop";

/* Construit le profil public d'une personne de l'annuaire. Renvoie null
   uniquement si l'id n'existe PAS à l'annuaire (la page affiche alors
   « profil introuvable »). Tout id réel de `users[]` résout donc — plus aucun
   auteur du fil ni interlocuteur ne mène à un cul-de-sac. */
export function getMockProfile(id: string): Profile | null {
  /* Le profil public de l'utilisateur courant EST son profil canonique, pas
     une copie : c'est ce qui garantit qu'il n'affiche pas 87 avis là où son
     profil en annonce 12. */
  if (id === CURRENT_USER.id) return DEFAULT_PROFILE;

  const person = personById(id);
  if (!person) return null;
  const seed = PUBLIC_SEEDS[id];

  return {
    id: person.id,
    firstName: person.firstName,
    lastName: person.lastName,
    email: person.email,
    avatar: person.avatar,
    banner: seed?.banner ?? GENERIC_BANNER,
    headline: seed?.headline ?? `${roleLabels[person.activeRole]} · ${person.city}`,
    location: { city: person.city, country: person.country },
    roles: person.roles,
    about: seed?.about ?? person.bio,
    experiences: seed?.experiences ?? [],
    education: seed?.education ?? [],
    skills: (seed?.skills ?? []).map((name, i) => ({ id: `sk-${id}-${i}`, name })),
    languages:
      seed?.languages ??
      (person.languages ?? []).map((name, i) => ({ id: `lg-${id}-${i}`, name, level: "courant" as const })),
    certifications: [],
    links: seed?.links ?? [],
    visibility: DEFAULT_VISIBILITY,
    meta: { verified: true, membreFondateur: !!seed?.membreFondateur, memberSince: "2024-06-01" },
    stats: {
      followers: person.stats.followers,
      following: person.stats.following,
      rating: person.stats.rating,
      reviewsCount: person.stats.reviews,
    },
  };
}

/** Tous les identifiants de profil public : l'annuaire entier. */
export const PUBLIC_PROFILE_IDS = DIRECTORY.map((p) => p.id);

/* Liste des personnes (hors moi) pour les pages réseau / contacts. Source
   unique : l'annuaire. Chaque personne ouvre une vraie fiche /profil/[id],
   puisque getMockProfile résout tout id de l'annuaire. */
export function listPeople(): PersonSummary[] {
  return DIRECTORY.filter((p) => p.id !== CURRENT_USER.id).map((p) => ({
    id: p.id,
    firstName: p.firstName,
    lastName: p.lastName,
    avatar: p.avatar,
    headline: PUBLIC_SEEDS[p.id]?.headline ?? `${roleLabels[p.activeRole]} · ${p.city}`,
    city: p.city,
    country: p.country,
    roles: p.roles,
  }));
}
