import { PROFILE_QUESTIONS, engagementsFor, form, type ProfileId } from "@/content/landing";
import type { LeadInput } from "./schema";

/* ── Score d'engagement ──────────────────────────────────────────────────────

   Calculé côté serveur uniquement : il sert à trier les contacts dans
   l'admin, donc le client n'a aucune raison de pouvoir l'influencer
   directement.

   Barème, volontairement isolé dans cette fonction pour être ajustable sans
   toucher au reste :

   - couche 1 complète (identité) ................ 1 point
   - couche 2 complète (questions du profil) ..... 2 points
   - chaque engagement coché ..................... son poids

   Les poids des engagements vivent dans `src/content/landing.ts`, pas ici :
   l'appel de 20 minutes et la bêta valent 2, la lettre d'intérêt et le statut
   de membre fondateur valent 5 — soit les 2 points d'une case ordinaire plus
   les 3 points supplémentaires prévus pour un engagement ferme. Modifier le
   barème se fait donc dans le contenu.

   La couche 2 est considérée complète quand toutes les questions non
   facultatives du profil ont une réponse. C'est déjà garanti par le schéma
   côté serveur, mais la fonction reste défensive pour rester utilisable sur
   des données partielles (import, reprise, test). */

const ENGAGEMENT_WEIGHTS: Record<string, number> = Object.fromEntries(
  [...form.engagement.default, ...form.engagement.equipe].map((e) => [e.id, e.weight]),
);

export const SCORE_IDENTITY_COMPLETE = 1;
export const SCORE_PROFILE_COMPLETE = 2;

function identityComplete(lead: Pick<LeadInput, "firstName" | "email" | "profile" | "canton">) {
  return Boolean(lead.firstName && lead.email && lead.profile && lead.canton);
}

function profileAnswersComplete(profile: ProfileId, answers: LeadInput["profileAnswers"]) {
  const fields = PROFILE_QUESTIONS[profile];
  return fields.every((field) => {
    if (field.optional) return true;
    const value = answers[field.id];
    if (value === undefined || value === "") return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  });
}

export function computeEngagementScore(
  lead: Pick<
    LeadInput,
    "firstName" | "email" | "profile" | "canton" | "profileAnswers" | "engagements"
  >,
): number {
  let score = 0;

  if (identityComplete(lead)) score += SCORE_IDENTITY_COMPLETE;
  if (profileAnswersComplete(lead.profile, lead.profileAnswers)) score += SCORE_PROFILE_COMPLETE;

  for (const id of lead.engagements) {
    score += ENGAGEMENT_WEIGHTS[id] ?? 0;
  }

  return score;
}

/** Score maximal atteignable, utile pour afficher un rapport dans l'admin. */
export function maxEngagementScore(profile: ProfileId): number {
  const set = engagementsFor(profile);
  return (
    SCORE_IDENTITY_COMPLETE +
    SCORE_PROFILE_COMPLETE +
    set.reduce((sum, e) => sum + e.weight, 0)
  );
}
