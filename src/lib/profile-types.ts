import type { Role } from "./types";

/* ─── Modèle de profil enrichi (inspiration LinkedIn) ─────────────────────
   Source de vérité unique du profil, partagée entre /profil, l'onboarding
   et les paramètres. Persistée via le contexte (localStorage en démo), avec
   une interface pensée pour un backend (Supabase) plus tard sans toucher
   à l'UI. Chaque section est un tableau d'objets identifiés → facile à
   étendre (ajouter une section = ajouter un champ + un composant). */

// ─── Énumérations & libellés ─────────────────────────────────────────────

export type EmploymentType =
  | "temps-plein"
  | "temps-partiel"
  | "independant"
  | "freelance"
  | "stage"
  | "alternance"
  | "benevolat";

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  "temps-plein": "Temps plein",
  "temps-partiel": "Temps partiel",
  independant: "Indépendant",
  freelance: "Freelance",
  stage: "Stage",
  alternance: "Alternance",
  benevolat: "Bénévolat",
};

export type LanguageLevel = "notions" | "intermediaire" | "courant" | "bilingue" | "natif";

export const LANGUAGE_LEVEL_LABELS: Record<LanguageLevel, string> = {
  notions: "Notions",
  intermediaire: "Intermédiaire",
  courant: "Courant",
  bilingue: "Bilingue",
  natif: "Langue maternelle",
};

export type LinkType =
  | "website"
  | "linkedin"
  | "instagram"
  | "x"
  | "facebook"
  | "youtube"
  | "portfolio"
  | "autre";

export const LINK_TYPE_LABELS: Record<LinkType, string> = {
  website: "Site web",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  x: "X (Twitter)",
  facebook: "Facebook",
  youtube: "YouTube",
  portfolio: "Portfolio",
  autre: "Autre",
};

// ─── Sections structurées ────────────────────────────────────────────────

export interface Experience {
  id: string;
  title: string; // poste
  company: string;
  employmentType?: EmploymentType;
  location?: string;
  current: boolean;
  startMonth: number; // 1-12
  startYear: number;
  endMonth?: number;
  endYear?: number;
  description?: string;
}

export interface Education {
  id: string;
  school: string;
  degree?: string; // diplôme
  field?: string; // domaine d'étude
  startYear?: number;
  endYear?: number;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface ProfileLanguage {
  id: string;
  name: string;
  level: LanguageLevel;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year?: number;
  url?: string;
}

export interface ProfileLink {
  id: string;
  type: LinkType;
  url: string;
  label?: string;
}

// ─── Confidentialité / visibilité ────────────────────────────────────────

/* Sections dont la visibilité peut être masquée publiquement. Les toggles
   des paramètres de confidentialité pilotent réellement l'affichage sur
   le profil public (/profil/[id]). */
export type ToggleableSection =
  | "about"
  | "experiences"
  | "education"
  | "skills"
  | "languages"
  | "certifications"
  | "links";

export interface ProfileVisibility {
  isPublic: boolean;
  showEmail: boolean;
  showPhone: boolean;
  showStats: boolean;
  /** Sections masquées sur le profil public (l'owner les voit toujours). */
  hiddenSections: ToggleableSection[];
}

// ─── Profil complet ──────────────────────────────────────────────────────

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar: string;
  banner?: string; // image de couverture (URL ou data URI)
  headline: string; // titre professionnel
  location: { city: string; country: string };
  roles: Role[];
  about: string; // résumé long
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: ProfileLanguage[];
  certifications: Certification[];
  links: ProfileLink[];
  visibility: ProfileVisibility;
  meta: {
    verified: boolean;
    membreFondateur: boolean;
    memberSince: string; // ISO date
  };
  stats: {
    followers: number;
    following: number;
    rating: number;
    reviewsCount: number;
  };
}

// ─── Résumé d'une personne (listes réseau / contacts) ────────────────────

export interface PersonSummary {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  headline: string;
  city: string;
  country: string;
  roles: Role[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────

/** Identifiant court et unique pour un élément de section (démo). */
export function newId(prefix = "it"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export const MONTHS_FR = [
  "janv.", "févr.", "mars", "avr.", "mai", "juin",
  "juil.", "août", "sept.", "oct.", "nov.", "déc.",
];

/** "janv. 2021 – Aujourd'hui · 3 ans 2 mois" pour une expérience. */
export function formatExperiencePeriod(exp: Experience): string {
  const start = `${MONTHS_FR[(exp.startMonth || 1) - 1]} ${exp.startYear}`;
  const end = exp.current
    ? "Aujourd'hui"
    : exp.endYear
      ? `${MONTHS_FR[(exp.endMonth || 1) - 1]} ${exp.endYear}`
      : "Aujourd'hui";
  return `${start} – ${end}`;
}

/** Durée lisible entre deux dates (mois → "X ans Y mois"). */
export function experienceDuration(exp: Experience): string {
  const startM = (exp.startYear || 0) * 12 + ((exp.startMonth || 1) - 1);
  const now = new Date();
  const endM = exp.current
    ? now.getFullYear() * 12 + now.getMonth()
    : (exp.endYear || 0) * 12 + ((exp.endMonth || 1) - 1);
  const total = Math.max(0, endM - startM) + 1;
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} an${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} mois`);
  return parts.join(" ") || "1 mois";
}
