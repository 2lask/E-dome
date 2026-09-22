import { z } from "zod";
import {
  CANTONS,
  OUTSIDE_SWITZERLAND,
  PROFILE_QUESTIONS,
  engagementsFor,
  form,
  type ProfileId,
} from "@/content/landing";

/* ── Schéma d'une manifestation d'intérêt ────────────────────────────────────

   Un seul schéma, utilisé par le formulaire dans le navigateur ET par la
   Server Action. C'est le point important : une validation uniquement côté
   client ne protège de rien, puisqu'on peut poster directement sur l'action.

   La validation ne se contente pas de vérifier la forme. Elle confronte les
   réponses aux questions réellement définies dans `src/content/landing.ts`
   pour le profil choisi : un champ obligatoire manquant, une option inventée
   ou une clé étrangère sont refusés. Ajouter une question au contenu suffit
   donc à l'inclure dans la validation, sans toucher ce fichier. */

const PROFILE_IDS = [
  "agence",
  "createur",
  "prestataire",
  "investisseur",
  "proprietaire",
  "equipe",
] as const satisfies readonly ProfileId[];

const QUESTIONS = PROFILE_QUESTIONS;

/** Identifiants d'engagement autorisés pour un profil donné. */
export function engagementIdsFor(profile: ProfileId): readonly string[] {
  return engagementsFor(profile).map((e) => e.id);
}

const answerValue = z.union([z.string().trim().max(2000), z.array(z.string().trim().max(200)).max(20)]);

const utmSchema = z
  .object({
    source: z.string().trim().max(120).optional(),
    medium: z.string().trim().max(120).optional(),
    campaign: z.string().trim().max(120).optional(),
    content: z.string().trim().max(120).optional(),
  })
  .partial();

export const leadSchema = z
  .object({
    firstName: z.string().trim().min(1, form.errors.firstName).max(80),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .max(200)
      .pipe(z.email(form.errors.email)),
    profile: z.enum(PROFILE_IDS, { message: form.errors.profile }),
    canton: z.string().trim().min(1, form.errors.canton).max(60),
    /* Rempli uniquement quand `canton` vaut « Hors de Suisse ». */
    country: z.string().trim().max(80).optional(),

    profileAnswers: z.record(z.string().max(60), answerValue).default({}),
    engagements: z.array(z.string().max(60)).max(12).default([]),

    consentPrivacy: z.literal(true, { message: form.errors.consent }),
    consentNewsletter: z.boolean().default(false),

    /* Champ piège : invisible à l'écran, donc toujours vide chez un humain.
       Un robot qui remplit tous les champs le trahit ici. */
    honeypot: z.string().max(0).optional(),

    /* Traçage. Fourni par le client, donc borné et jamais fait confiance
       au-delà de son format. */
    referredBy: z.string().trim().max(32).optional(),
    utm: utmSchema.optional(),
    landingPath: z.string().trim().max(200).optional(),
  })
  .superRefine((data, ctx) => {
    /* Canton : soit un canton connu, soit explicitement hors de Suisse. */
    const knownCanton = (CANTONS as readonly string[]).includes(data.canton);
    const outside = data.canton === OUTSIDE_SWITZERLAND;
    if (!knownCanton && !outside) {
      ctx.addIssue({ code: "custom", path: ["canton"], message: form.errors.canton });
    }
    if (outside && !data.country) {
      ctx.addIssue({ code: "custom", path: ["country"], message: form.errors.country });
    }

    /* Réponses de la couche 2, confrontées aux questions du profil. */
    const fields = QUESTIONS[data.profile];
    const known = new Set(fields.map((f) => f.id));

    for (const key of Object.keys(data.profileAnswers)) {
      if (!known.has(key)) {
        ctx.addIssue({
          code: "custom",
          path: ["profileAnswers", key],
          message: "Question inconnue pour ce profil.",
        });
      }
    }

    for (const field of fields) {
      const value = data.profileAnswers[field.id];
      const empty =
        value === undefined ||
        value === "" ||
        (Array.isArray(value) && value.length === 0);

      if (empty) {
        if (!field.optional) {
          ctx.addIssue({
            code: "custom",
            path: ["profileAnswers", field.id],
            message: form.errors.required,
          });
        }
        continue;
      }

      const options = field.options as readonly string[] | undefined;

      if (field.type === "multiselect") {
        if (!Array.isArray(value)) {
          ctx.addIssue({
            code: "custom",
            path: ["profileAnswers", field.id],
            message: form.errors.required,
          });
          continue;
        }
        /* `allowOther` autorise une saisie libre : on ne peut alors plus
           restreindre aux options connues. */
        if (options && !field.allowOther) {
          for (const v of value) {
            if (!options.includes(v)) {
              ctx.addIssue({
                code: "custom",
                path: ["profileAnswers", field.id],
                message: "Option non proposée.",
              });
              break;
            }
          }
        }
        continue;
      }

      if (Array.isArray(value)) {
        ctx.addIssue({
          code: "custom",
          path: ["profileAnswers", field.id],
          message: form.errors.required,
        });
        continue;
      }

      if (field.type === "select" && options && !field.allowOther && !options.includes(value)) {
        ctx.addIssue({
          code: "custom",
          path: ["profileAnswers", field.id],
          message: "Option non proposée.",
        });
        continue;
      }

      if (field.type === "url" && !/^https?:\/\/\S+$/i.test(value)) {
        ctx.addIssue({
          code: "custom",
          path: ["profileAnswers", field.id],
          message: form.errors.url,
        });
      }
    }

    /* Engagements : seuls les identifiants du jeu correspondant au profil. */
    const allowed = new Set(engagementIdsFor(data.profile));
    for (const id of data.engagements) {
      if (!allowed.has(id)) {
        ctx.addIssue({
          code: "custom",
          path: ["engagements"],
          message: "Engagement inconnu pour ce profil.",
        });
        break;
      }
    }
  });

/** Données validées d'une manifestation d'intérêt. */
export type LeadInput = z.infer<typeof leadSchema>;

/** Valeur d'une réponse de la couche 2. */
export type AnswerValue = z.infer<typeof answerValue>;
