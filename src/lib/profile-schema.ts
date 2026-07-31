import { z } from "zod";
import type { Profile } from "./profile-types";

/* ─── Validation partagée (front + back) ──────────────────────────────────
   Les mêmes schémas zod valident les formulaires d'édition en temps réel
   (côté client) et pourront valider un payload d'API/Supabase côté serveur.
   On exporte des schémas par section pour coller aux modales d'édition. */

const CURRENT_YEAR = new Date().getFullYear();
const yearField = z
  .number()
  .int()
  .min(1950, "Année trop ancienne")
  .max(CURRENT_YEAR + 8, "Année trop lointaine");

export const introSchema = z.object({
  firstName: z.string().trim().min(1, "Le prénom est requis").max(60),
  lastName: z.string().trim().min(1, "Le nom est requis").max(60),
  headline: z.string().trim().max(160, "160 caractères maximum").optional().or(z.literal("")),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
});
export type IntroInput = z.infer<typeof introSchema>;

export const aboutSchema = z.object({
  about: z.string().trim().max(2600, "2600 caractères maximum"),
});

export const experienceSchema = z
  .object({
    title: z.string().trim().min(1, "L'intitulé du poste est requis").max(120),
    company: z.string().trim().min(1, "L'entreprise est requise").max(120),
    employmentType: z
      .enum(["temps-plein", "temps-partiel", "independant", "freelance", "stage", "alternance", "benevolat"])
      .optional(),
    location: z.string().trim().max(120).optional().or(z.literal("")),
    current: z.boolean(),
    startMonth: z.number().int().min(1).max(12),
    startYear: yearField,
    endMonth: z.number().int().min(1).max(12).optional(),
    endYear: yearField.optional(),
    description: z.string().trim().max(2000, "2000 caractères maximum").optional().or(z.literal("")),
  })
  .refine((v) => v.current || (v.endYear != null && v.endMonth != null), {
    message: "Renseignez la date de fin ou cochez « poste actuel »",
    path: ["endYear"],
  })
  .refine(
    (v) =>
      v.current ||
      v.endYear == null ||
      v.endYear * 12 + (v.endMonth ?? 1) >= v.startYear * 12 + v.startMonth,
    { message: "La date de fin précède la date de début", path: ["endYear"] },
  );
export type ExperienceInput = z.infer<typeof experienceSchema>;

export const educationSchema = z
  .object({
    school: z.string().trim().min(1, "L'établissement est requis").max(140),
    degree: z.string().trim().max(140).optional().or(z.literal("")),
    field: z.string().trim().max(140).optional().or(z.literal("")),
    startYear: yearField.optional(),
    endYear: yearField.optional(),
    description: z.string().trim().max(1200).optional().or(z.literal("")),
  })
  .refine((v) => v.startYear == null || v.endYear == null || v.endYear >= v.startYear, {
    message: "L'année de fin précède l'année de début",
    path: ["endYear"],
  });
export type EducationInput = z.infer<typeof educationSchema>;

export const linkSchema = z.object({
  type: z.enum(["website", "linkedin", "instagram", "x", "facebook", "youtube", "portfolio", "autre"]),
  url: z
    .string()
    .trim()
    .min(1, "L'URL est requise")
    .url("URL invalide (ex : https://…)")
    .max(300),
  label: z.string().trim().max(80).optional().or(z.literal("")),
});
export type LinkInput = z.infer<typeof linkSchema>;

export const skillSchema = z.object({
  name: z.string().trim().min(1, "Compétence vide").max(60, "60 caractères maximum"),
});

export const languageSchema = z.object({
  name: z.string().trim().min(1, "Langue requise").max(60),
  level: z.enum(["notions", "intermediaire", "courant", "bilingue", "natif"]),
});

export const certificationSchema = z.object({
  name: z.string().trim().min(1, "Nom requis").max(160),
  issuer: z.string().trim().min(1, "Organisme requis").max(160),
  year: yearField.optional(),
  url: z.string().trim().url("URL invalide").max(300).optional().or(z.literal("")),
});

// ─── Moteur de complétion (barre « Profil complété à X% ») ────────────────

export interface CompletionItem {
  key: string;
  label: string;
  hint: string;
  done: boolean;
  weight: number;
  /** Section à ouvrir/éditer pour compléter cet item. */
  action:
    | "intro"
    | "avatar"
    | "banner"
    | "about"
    | "experiences"
    | "education"
    | "skills"
    | "links";
}

export interface CompletionResult {
  percent: number;
  items: CompletionItem[];
  missing: CompletionItem[];
}

const DEFAULT_AVATAR_HINT = "unsplash.com"; // heuristique démo : avatar mock non personnalisé

export function computeProfileCompletion(profile: Profile): CompletionResult {
  const items: CompletionItem[] = [
    {
      key: "headline",
      label: "Ajouter un titre professionnel",
      hint: "Une accroche visible sous votre nom",
      done: profile.headline.trim().length >= 3,
      weight: 15,
      action: "intro",
    },
    {
      key: "about",
      label: "Rédiger la section À propos",
      hint: "Au moins quelques lignes sur vous",
      done: profile.about.trim().length >= 40,
      weight: 15,
      action: "about",
    },
    {
      key: "experiences",
      label: "Ajouter une expérience",
      hint: "Postes, entreprises, missions",
      done: profile.experiences.length >= 1,
      weight: 15,
      action: "experiences",
    },
    {
      key: "avatar",
      label: "Ajouter une photo de profil",
      hint: "Les profils avec photo inspirent confiance",
      done: profile.avatar.trim().length > 0 && !profile.avatar.includes(DEFAULT_AVATAR_HINT),
      weight: 10,
      action: "avatar",
    },
    {
      key: "banner",
      label: "Ajouter une photo de couverture",
      hint: "Une bannière qui vous représente",
      done: !!profile.banner && profile.banner.trim().length > 0,
      weight: 10,
      action: "banner",
    },
    {
      key: "location",
      label: "Préciser votre localisation",
      hint: "Ville et pays",
      done: profile.location.city.trim().length > 0 && profile.location.country.trim().length > 0,
      weight: 10,
      action: "intro",
    },
    {
      key: "education",
      label: "Ajouter une formation",
      hint: "Diplômes et établissements",
      done: profile.education.length >= 1,
      weight: 10,
      action: "education",
    },
    {
      key: "skills",
      label: "Ajouter au moins 3 compétences",
      hint: "Elles aident à vous trouver",
      done: profile.skills.length >= 3,
      weight: 10,
      action: "skills",
    },
    {
      key: "links",
      label: "Ajouter un lien",
      hint: "Site web, réseaux, portfolio",
      done: profile.links.length >= 1,
      weight: 5,
      action: "links",
    },
  ];

  const earned = items.reduce((s, it) => s + (it.done ? it.weight : 0), 0);
  const total = items.reduce((s, it) => s + it.weight, 0);
  const percent = Math.round((earned / total) * 100);
  const missing = items.filter((it) => !it.done).sort((a, b) => b.weight - a.weight);

  return { percent, items, missing };
}
