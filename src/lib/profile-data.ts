import type { Profile, ProfileVisibility, PersonSummary } from "./profile-types";

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

export const DEFAULT_PROFILE: Profile = {
  id: "me",
  firstName: "Léo",
  lastName: "Martin",
  email: "leo@e-dome.ch",
  phone: "+41 79 123 45 67",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240&h=240&fit=crop",
  banner: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=400&fit=crop",
  headline: "Investisseur & formateur immobilier · Fondateur E-Dome",
  location: { city: "Lausanne", country: "Suisse" },
  roles: ["hote", "formateur", "apporteur", "investisseur"],
  about:
    "Passionné d'immobilier depuis plus de 15 ans. J'accompagne investisseurs et hôtes en Suisse romande et à l'international : acquisition, rendement locatif, gestion et fiscalité. Formateur certifié USPI et apporteur d'affaires, je crois à un immobilier plus direct, transparent et accessible — c'est la mission d'E-Dome.",
  experiences: [
    {
      id: "exp-1",
      title: "Fondateur & CEO",
      company: "E-Dome",
      employmentType: "temps-plein",
      location: "Lausanne, Suisse",
      current: true,
      startMonth: 1,
      startYear: 2024,
      description:
        "Plateforme sociale immobilière sans intermédiaire : marketplace, réseau, apporteurs d'affaires et formations. +4 500 membres en bêta.",
    },
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
  meta: { verified: true, membreFondateur: true, memberSince: "2024-01-15" },
  stats: { followers: 2340, following: 812, rating: 4.8, reviewsCount: 56 },
};

// ─── Profils publics (autres utilisateurs) ───────────────────────────────

type PublicSeed = {
  firstName: string;
  lastName: string;
  avatar: string;
  banner?: string;
  headline: string;
  city: string;
  country: string;
  roles: Profile["roles"];
  about: string;
  stats: Profile["stats"];
  membreFondateur?: boolean;
  experiences?: Profile["experiences"];
  education?: Profile["education"];
  skills?: string[];
  languages?: Profile["languages"];
  links?: Profile["links"];
};

const PUBLIC_SEEDS: Record<string, PublicSeed> = {
  "user-001": {
    firstName: "Léo",
    lastName: "Martin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240",
    banner: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=400&fit=crop",
    headline: "Investisseur & formateur immobilier · Fondateur E-Dome",
    city: "Lausanne",
    country: "Suisse",
    roles: ["hote", "formateur", "apporteur", "investisseur"],
    about: DEFAULT_PROFILE.about,
    stats: { followers: 2340, following: 812, rating: 4.8, reviewsCount: 87 },
    membreFondateur: true,
    experiences: DEFAULT_PROFILE.experiences,
    education: DEFAULT_PROFILE.education,
    skills: DEFAULT_PROFILE.skills.map((s) => s.name),
    languages: DEFAULT_PROFILE.languages,
    links: DEFAULT_PROFILE.links,
  },
  "user-002": {
    firstName: "Sophie",
    lastName: "Durand",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240",
    banner: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=400&fit=crop",
    headline: "Courtière Brevet Fédéral · Immobilier de standing",
    city: "Lausanne",
    country: "Suisse",
    roles: ["courtier", "hote"],
    about:
      "Courtière Brevet Fédéral spécialisée dans l'immobilier de standing en Suisse romande. J'accompagne vendeurs et acquéreurs sur des biens d'exception avec discrétion et rigueur.",
    stats: { followers: 890, following: 210, rating: 4.8, reviewsCount: 42 },
    skills: ["Courtage", "Estimation", "Home staging", "Négociation", "Immobilier de luxe"],
  },
  "user-003": {
    firstName: "Marc",
    lastName: "Favre",
    avatar: "https://images.unsplash.com/photo-1519345182560-cabd3c3338a3?w=240",
    headline: "Courtier & hôte · Location courte durée à Genève",
    city: "Genève",
    country: "Suisse",
    roles: ["courtier", "hote"],
    about:
      "Agent immobilier et hôte actif à Genève. Spécialiste de la location courte durée et de la valorisation de biens résidentiels.",
    stats: { followers: 640, following: 340, rating: 4.7, reviewsCount: 42 },
    skills: ["Courtage", "Location courte durée", "Estimation", "Relation client"],
  },
  "user-004": {
    firstName: "Amina",
    lastName: "El Idrissi",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240",
    banner: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1200&h=400&fit=crop",
    headline: "Formatrice & hôte · Gestion locative et pricing dynamique",
    city: "Marrakech",
    country: "Maroc",
    roles: ["formateur", "hote"],
    about:
      "Formatrice et hôte au Maroc. Experte en investissement locatif dans les marchés émergents et en optimisation des revenus courte durée.",
    stats: { followers: 1200, following: 610, rating: 4.9, reviewsCount: 98 },
    skills: ["Gestion locative", "Pricing dynamique", "Airbnb", "Marketing immobilier"],
  },
  "user-005": {
    firstName: "Lucas",
    lastName: "Renaud",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=240",
    headline: "Promoteur immobilier · Villas de prestige Côte d'Azur",
    city: "Nice",
    country: "France",
    roles: ["promoteur"],
    about:
      "Promoteur immobilier sur la Côte d'Azur. Spécialiste des villas de prestige et des programmes neufs haut de gamme.",
    stats: { followers: 520, following: 430, rating: 4.6, reviewsCount: 56 },
    skills: ["Promotion immobilière", "Développement foncier", "Immobilier de luxe"],
  },
  "user-006": {
    firstName: "Yasmin",
    lastName: "Al Maktoum",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240",
    banner: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=400&fit=crop",
    headline: "Agence premium · Résidences de luxe à Dubaï",
    city: "Dubaï",
    country: "EAU",
    roles: ["agence", "apporteur"],
    about:
      "Agence immobilière premium à Dubaï. Spécialiste des résidences de luxe et des opportunités off-market pour investisseurs internationaux.",
    stats: { followers: 3500, following: 480, rating: 4.8, reviewsCount: 64 },
    skills: ["Immobilier de luxe", "Off-market", "Investissement international"],
  },
  "user-015": {
    firstName: "Jean-Luc",
    lastName: "Hartmann",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=240",
    headline: "Agence familiale · Vente & gestion locative depuis 1992",
    city: "Neuchâtel",
    country: "Suisse",
    roles: ["agence"],
    about:
      "Agence familiale en Suisse romande. Vente et gestion locative depuis 1992, avec un service de proximité et une parfaite connaissance du marché local.",
    stats: { followers: 280, following: 150, rating: 4.5, reviewsCount: 22 },
    skills: ["Vente", "Gestion locative", "Estimation", "Conseil"],
  },
  "user-007": {
    firstName: "Camille",
    lastName: "Rochat",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240",
    headline: "Investisseuse · Rendement locatif en Suisse romande",
    city: "Fribourg",
    country: "Suisse",
    roles: ["investisseur"],
    about: "Investisseuse immobilière axée rendement et diversification. Adepte du locatif longue durée et de la colocation premium.",
    stats: { followers: 410, following: 190, rating: 4.7, reviewsCount: 18 },
    skills: ["Investissement locatif", "Colocation", "Financement"],
  },
  "user-008": {
    firstName: "Nicolas",
    lastName: "Berger",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240",
    headline: "Promoteur · Programmes neufs certifiés Minergie",
    city: "Zurich",
    country: "Suisse",
    roles: ["promoteur"],
    about: "Promoteur spécialisé dans les programmes résidentiels neufs à haute performance énergétique.",
    stats: { followers: 1500, following: 220, rating: 4.6, reviewsCount: 31 },
    skills: ["Promotion immobilière", "Minergie", "Développement foncier"],
  },
  "user-009": {
    firstName: "Fatima",
    lastName: "Zahra",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240",
    headline: "Agence · Immobilier résidentiel à Casablanca",
    city: "Casablanca",
    country: "Maroc",
    roles: ["agence"],
    about: "Directrice d'agence à Casablanca. Vente et location de biens résidentiels et bureaux.",
    stats: { followers: 2100, following: 340, rating: 4.8, reviewsCount: 76 },
    skills: ["Vente", "Location", "Bureaux"],
  },
  "user-010": {
    firstName: "David",
    lastName: "Meier",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=240",
    headline: "Courtier · Financement hypothécaire & fiscalité",
    city: "Zoug",
    country: "Suisse",
    roles: ["courtier"],
    about: "Courtier en financement. J'optimise le montage hypothécaire et la fiscalité de vos acquisitions.",
    stats: { followers: 720, following: 160, rating: 4.9, reviewsCount: 44 },
    skills: ["Hypothèque", "Fiscalité", "Négociation"],
  },
  "user-011": {
    firstName: "Elena",
    lastName: "Rossi",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=240",
    headline: "Formatrice · Home staging & valorisation",
    city: "Lugano",
    country: "Suisse",
    roles: ["formateur"],
    about: "Formatrice en home staging et valorisation de biens pour accélérer la vente.",
    stats: { followers: 980, following: 280, rating: 4.8, reviewsCount: 52 },
    skills: ["Home staging", "Décoration", "Photographie"],
  },
  "user-012": {
    firstName: "Omar",
    lastName: "Haddad",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=240",
    headline: "Apporteur d'affaires · Off-market Émirats",
    city: "Dubaï",
    country: "EAU",
    roles: ["apporteur"],
    about: "Apporteur d'affaires spécialisé off-market à Dubaï et Abu Dhabi pour investisseurs internationaux.",
    stats: { followers: 3400, following: 410, rating: 4.9, reviewsCount: 61 },
    skills: ["Off-market", "Investissement international", "Négociation"],
  },
};

const GENERIC_BANNER = "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=400&fit=crop";

/* Construit un profil public. Si l'id n'a pas de seed dédié, on renvoie null
   (la page affichera "profil introuvable"). */
export function getMockProfile(id: string): Profile | null {
  const seed = PUBLIC_SEEDS[id];
  if (!seed) return null;

  return {
    id,
    firstName: seed.firstName,
    lastName: seed.lastName,
    email: `${seed.firstName.toLowerCase()}@e-dome.ch`,
    avatar: seed.avatar,
    banner: seed.banner ?? GENERIC_BANNER,
    headline: seed.headline,
    location: { city: seed.city, country: seed.country },
    roles: seed.roles,
    about: seed.about,
    experiences: seed.experiences ?? [],
    education: seed.education ?? [],
    skills: (seed.skills ?? []).map((name, i) => ({ id: `sk-${id}-${i}`, name })),
    languages: seed.languages ?? [],
    certifications: [],
    links: seed.links ?? [],
    visibility: DEFAULT_VISIBILITY,
    meta: { verified: true, membreFondateur: !!seed.membreFondateur, memberSince: "2024-06-01" },
    stats: seed.stats,
  };
}

export const PUBLIC_PROFILE_IDS = Object.keys(PUBLIC_SEEDS);

/* Liste des personnes (hors moi) pour les pages réseau / contacts. Source
   unique : dérivée des seeds publics, donc chaque personne ouvre une vraie
   fiche /profil/[id]. */
export function listPeople(): PersonSummary[] {
  return Object.entries(PUBLIC_SEEDS)
    .filter(([id]) => id !== "user-001")
    .map(([id, s]) => ({
      id,
      firstName: s.firstName,
      lastName: s.lastName,
      avatar: s.avatar,
      headline: s.headline,
      city: s.city,
      country: s.country,
      roles: s.roles,
    }));
}
