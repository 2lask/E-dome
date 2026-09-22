"use server";

import { cookies, headers } from "next/headers";
import { form } from "@/content/landing";
import { generateRefCode, normalizeRefCode } from "./ref-code";
import { allowSubmission, ipFingerprint } from "./rate-limit";
import { leadSchema } from "./schema";
import { computeEngagementScore } from "./score";
import { getLeadStore } from "./store";
import { REF_COOKIE, UTM_COOKIE, parseUtmCookie } from "./tracking";
import type { LeadRecord } from "./types";

/* ── Server Action d'enregistrement d'une manifestation d'intérêt ────────────

   Le formulaire valide déjà côté client, mais cette action revalide tout avec
   le MÊME schéma : rien n'empêche d'appeler une Server Action directement, la
   validation client n'est qu'un confort d'interface.

   Trois choses ne sont jamais reprises du client :

   - le score d'engagement, recalculé ici ;
   - le code de parrainage attribué, généré ici ;
   - le parrain et les UTM, relus depuis les cookies posés à l'arrivée
     plutôt que depuis le corps de la requête, donc non réécrivables par un
     formulaire bricolé.

   Le rendu est délibérément avare en détails côté client : un message
   générique en cas d'échec technique, des erreurs par champ seulement pour ce
   que l'utilisateur peut corriger. */

export type SubmitResult =
  | { ok: true; refCode: string; created: boolean }
  | { ok: false; kind: "validation"; errors: Record<string, string> }
  | { ok: false; kind: "rate_limited" | "error"; message: string };

/** Aplatit les erreurs Zod en `chemin -> message`, pour l'affichage. */
function flattenIssues(issues: { path: (string | number | symbol)[]; message: string }[]) {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path.map(String).join(".") || "_";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export async function submitInterest(payload: unknown): Promise<SubmitResult> {
  /* Champ piège : seul un robot le remplit. On refuse sans détailler. */
  const honeypot =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>).honeypot
      : undefined;
  if (typeof honeypot === "string" && honeypot.length > 0) {
    return { ok: false, kind: "error", message: form.errors.generic };
  }

  /* Le compteur d'envois est tenu par le stockage, donc partagé entre les
     instances. On résout le magasin avant la validation : c'est lui qui porte
     aussi bien la limite que l'écriture. */
  let store;
  try {
    store = getLeadStore();
  } catch (error) {
    console.error("[leads] stockage indisponible", error);
    return { ok: false, kind: "error", message: form.errors.generic };
  }

  const requestHeaders = await headers();
  if (!(await allowSubmission(store, ipFingerprint(requestHeaders)))) {
    return { ok: false, kind: "rate_limited", message: form.errors.rateLimited };
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, kind: "validation", errors: flattenIssues(parsed.error.issues) };
  }
  const data = parsed.data;

  /* Parrainage et UTM : les cookies font foi. Le champ éventuellement présent
     dans le corps de la requête ne sert que de repli. */
  const cookieStore = await cookies();
  const referredBy =
    normalizeRefCode(cookieStore.get(REF_COOKIE)?.value) ??
    normalizeRefCode(data.referredBy) ??
    null;
  const utm = parseUtmCookie(cookieStore.get(UTM_COOKIE)?.value);

  const now = new Date().toISOString();

  const record: LeadRecord = {
    firstName: data.firstName,
    email: data.email,
    profile: data.profile,
    canton: data.canton,
    country: data.country ?? null,
    profileAnswers: data.profileAnswers,
    engagements: data.engagements,
    consentPrivacy: data.consentPrivacy,
    /* Horodatage du consentement : c'est la preuve qui compte en cas de
       demande, pas la simple case cochée. */
    consentAt: now,
    consentNewsletter: data.consentNewsletter,
    refCode: generateRefCode(),
    referredBy,
    utmSource: utm.source ?? data.utm?.source ?? null,
    utmMedium: utm.medium ?? data.utm?.medium ?? null,
    utmCampaign: utm.campaign ?? data.utm?.campaign ?? null,
    utmContent: utm.content ?? data.utm?.content ?? null,
    landingPath: data.landingPath ?? null,
    engagementScore: computeEngagementScore(data),
  };

  try {
    const { lead, created } = await store.upsert(record);
    return { ok: true, refCode: lead.refCode, created };
  } catch (error) {
    /* Le détail reste dans les journaux du serveur : il peut contenir des
       informations d'infrastructure qui n'ont rien à faire dans le navigateur. */
    console.error("[leads] enregistrement impossible", error);
    return { ok: false, kind: "error", message: form.errors.generic };
  }
}
