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
   dérivent proprement de l'annuaire.

   Étape 3 — les trois premiers profils complets sont enrichis en profondeur
   (expériences, formations, compétences, langues, liens), en accord strict
   avec leurs rôles d'annuaire : Sophie Durand (user-002, courtière), Marc Favre
   (user-003, investisseur — son seed revient, cette fois avec un titre
   « Investisseur » que l'annuaire lui donne bien, plus aucun « Courtier »
   fantôme) et Jean-Luc Hartmann (user-015, agence). Le seed Lucas (user-005)
   reste retiré : son titre annonçait « Promoteur » que l'annuaire ne lui donne
   pas. */
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
    headline: "Courtière indépendante · Brevet fédéral · Biens de caractère",
    about:
      "Courtière indépendante au bénéfice du brevet fédéral, installée à Lausanne. Douze ans sur l'arc lémanique, avec une spécialité assumée : les biens de caractère du Lavaux et de Lausanne — appartements de standing, propriétés vigneronnes, attiques avec vue lac. Une agence d'une personne, où chaque vendeur et chaque acquéreur est suivi de la première visite à la signature notariale. Rigueur du dossier, chaleur du contact.",
    experiences: [
      {
        id: "exp-so-1",
        title: "Courtière indépendante",
        company: "Sophie Durand Immobilier",
        employmentType: "independant",
        location: "Lausanne, Suisse",
        current: true,
        startMonth: 3,
        startYear: 2019,
        description:
          "Courtage de biens de caractère sur l'arc lémanique (Lausanne, Lavaux). Estimation, mise en valeur, accompagnement vendeurs et acquéreurs jusqu'à la signature notariale.",
      },
      {
        id: "exp-so-2",
        title: "Conseillère en vente immobilière",
        company: "Régie de la Riviera",
        employmentType: "temps-plein",
        location: "Montreux, Suisse",
        current: false,
        startMonth: 9,
        startYear: 2014,
        endMonth: 2,
        endYear: 2019,
        description: "Vente de résidences principales et secondaires sur la Riviera vaudoise.",
      },
      {
        id: "exp-so-3",
        title: "Négociatrice junior",
        company: "Agence lémanique",
        employmentType: "temps-plein",
        location: "Lausanne, Suisse",
        current: false,
        startMonth: 6,
        startYear: 2013,
        endMonth: 8,
        endYear: 2014,
        description: "Premiers mandats de vente, prospection et visites.",
      },
    ],
    education: [
      {
        id: "edu-so-1",
        school: "USPI Formation",
        degree: "Brevet fédéral de courtier en immeubles",
        field: "Courtage immobilier",
        startYear: 2017,
        endYear: 2019,
      },
      {
        id: "edu-so-2",
        school: "HEG Genève",
        degree: "Bachelor en économie d'entreprise",
        field: "Immobilier & finance",
        startYear: 2009,
        endYear: 2012,
      },
    ],
    skills: ["Courtage", "Biens de caractère", "Estimation", "Home staging", "Négociation", "Vente de standing"],
    languages: [
      { id: "lg-so-1", name: "Français", level: "natif" },
      { id: "lg-so-2", name: "Allemand", level: "courant" },
      { id: "lg-so-3", name: "Anglais", level: "courant" },
    ],
    links: [
      { id: "ln-so-1", type: "website", url: "https://e-dome.ch/sophie-durand", label: "Ma vitrine E-Dome" },
      { id: "ln-so-2", type: "linkedin", url: "https://linkedin.com/in/sophiedurand", label: "LinkedIn" },
    ],
  },
  "user-003": {
    banner: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=400&fit=crop",
    headline: "Investisseur immobilier · Rendement locatif net",
    about:
      "Investisseur immobilier basé à Genève, actif depuis 2010. Je construis un portefeuille locatif diversifié sur l'arc lémanique, piloté au rendement net (5-8 % visés). Analyse froide et chiffrée : rendement brut/net, ROI, TIR, LTV — les chiffres avant l'émotion. Je partage volontiers mes lectures de marché avec la communauté.",
    experiences: [
      {
        id: "exp-ma-1",
        title: "Investisseur immobilier indépendant",
        company: "Favre Patrimoine",
        employmentType: "independant",
        location: "Genève, Suisse",
        current: true,
        startMonth: 1,
        startYear: 2010,
        description:
          "Constitution et gestion d'un portefeuille locatif (courte durée, bureaux) sur l'arc lémanique. Sélection des biens au rendement net, pilotage des travaux et de la gestion.",
      },
      {
        id: "exp-ma-2",
        title: "Analyste financier",
        company: "Banque privée genevoise",
        employmentType: "temps-plein",
        location: "Genève, Suisse",
        current: false,
        startMonth: 9,
        startYear: 2006,
        endMonth: 12,
        endYear: 2009,
        description: "Analyse d'actifs et structuration de portefeuilles pour une clientèle privée.",
      },
    ],
    education: [
      {
        id: "edu-ma-1",
        school: "CFA Institute",
        degree: "CFA Level II",
        field: "Analyse financière",
        startYear: 2016,
        endYear: 2018,
      },
      {
        id: "edu-ma-2",
        school: "Université de Genève",
        degree: "Master en finance",
        field: "Finance & investissement",
        startYear: 2004,
        endYear: 2006,
      },
    ],
    skills: ["Rendement locatif", "Analyse de rendement", "Fiscalité immobilière", "Financement hypothécaire", "Négociation"],
    languages: [
      { id: "lg-ma-1", name: "Français", level: "natif" },
      { id: "lg-ma-2", name: "Anglais", level: "courant" },
      { id: "lg-ma-3", name: "Portugais", level: "intermediaire" },
    ],
    links: [
      { id: "ln-ma-1", type: "linkedin", url: "https://linkedin.com/in/marcfavre", label: "LinkedIn" },
    ],
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
    banner: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=400&fit=crop",
    headline: "Directeur · Hartmann Immobilier SA · Neuchâtel",
    about:
      "Directeur de Hartmann Immobilier SA, à Neuchâtel. Vingt ans dans l'immobilier neuchâtelois, membre USPI et SVIT. L'agence couvre la vente, le courtage et la gestion locative, avec une équipe et un service de proximité — une parfaite connaissance du marché local, du littoral aux vignobles. Approche posée, institutionnelle, au service de propriétaires exigeants.",
    experiences: [
      {
        id: "exp-jl-1",
        title: "Directeur",
        company: "Hartmann Immobilier SA",
        employmentType: "temps-plein",
        location: "Neuchâtel, Suisse",
        current: true,
        startMonth: 1,
        startYear: 2006,
        description:
          "Direction d'une agence immobilière neuchâteloise : vente, courtage et gestion locative. Encadrement de l'équipe, mandats de vente et relation avec les propriétaires institutionnels.",
      },
      {
        id: "exp-jl-2",
        title: "Courtier",
        company: "Régie du Littoral",
        employmentType: "temps-plein",
        location: "Neuchâtel, Suisse",
        current: false,
        startMonth: 4,
        startYear: 2001,
        endMonth: 12,
        endYear: 2005,
        description: "Vente et estimation de biens résidentiels sur le littoral neuchâtelois.",
      },
    ],
    education: [
      {
        id: "edu-jl-1",
        school: "USPI Suisse",
        degree: "Brevet fédéral de courtier en immeubles",
        field: "Courtage immobilier",
        startYear: 2010,
        endYear: 2012,
      },
      {
        id: "edu-jl-2",
        school: "SVIT School",
        degree: "Expert en gestion immobilière",
        field: "Gestion & administration de biens",
        startYear: 2016,
        endYear: 2018,
      },
    ],
    skills: ["Vente", "Courtage", "Gestion locative", "Estimation", "Direction d'agence", "Conseil"],
    languages: [
      { id: "lg-jl-1", name: "Français", level: "natif" },
      { id: "lg-jl-2", name: "Allemand", level: "courant" },
      { id: "lg-jl-3", name: "Anglais", level: "intermediaire" },
    ],
    links: [
      { id: "ln-jl-1", type: "website", url: "https://e-dome.ch/hartmann-immobilier", label: "Hartmann Immobilier SA" },
      { id: "ln-jl-2", type: "linkedin", url: "https://linkedin.com/in/jeanluchartmann", label: "LinkedIn" },
    ],
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
