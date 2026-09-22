import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProfileId } from "@/content/landing";
import type { AnswerValue } from "./schema";
import { generateRefCode } from "./ref-code";
import type { LeadListFilter, LeadRecord, LeadStore, StoredLead } from "./types";

/* Implémentation Supabase du contrat `LeadStore`.

   La table `leads` est fermée : RLS activée, aucune politique. Seule la clé
   de service y accède, donc uniquement ce module, côté serveur. Le schéma
   SQL est dans `supabase/leads.sql`.

   Colonnes en `snake_case` côté base, camelCase côté application : la
   conversion est centralisée dans les deux fonctions de mappage ci-dessous. */

const TABLE = "leads";

/** Colonnes lues. Énumérées explicitement plutôt que `*`, pour que l'ajout
    d'une colonne sensible en base ne se retrouve pas exposé par accident. */
const COLUMNS =
  "id, created_at, updated_at, first_name, email, profile, canton, country, profile_answers, engagements, consent_privacy, consent_at, consent_newsletter, ref_code, referred_by, utm_source, utm_medium, utm_campaign, utm_content, landing_path, engagement_score";

interface Row {
  id: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  email: string;
  profile: string;
  canton: string;
  country: string | null;
  profile_answers: Record<string, AnswerValue> | null;
  engagements: string[] | null;
  consent_privacy: boolean;
  consent_at: string | null;
  consent_newsletter: boolean;
  ref_code: string;
  referred_by: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  landing_path: string | null;
  engagement_score: number;
}

function toLead(row: Row): StoredLead {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    firstName: row.first_name,
    email: row.email,
    profile: row.profile as ProfileId,
    canton: row.canton,
    country: row.country,
    profileAnswers: row.profile_answers ?? {},
    engagements: row.engagements ?? [],
    consentPrivacy: row.consent_privacy,
    consentAt: row.consent_at,
    consentNewsletter: row.consent_newsletter,
    refCode: row.ref_code,
    referredBy: row.referred_by,
    utmSource: row.utm_source,
    utmMedium: row.utm_medium,
    utmCampaign: row.utm_campaign,
    utmContent: row.utm_content,
    landingPath: row.landing_path,
    engagementScore: row.engagement_score,
  };
}

function toRow(record: LeadRecord) {
  return {
    first_name: record.firstName,
    email: record.email,
    profile: record.profile,
    canton: record.canton,
    country: record.country,
    profile_answers: record.profileAnswers,
    engagements: record.engagements,
    consent_privacy: record.consentPrivacy,
    consent_at: record.consentAt,
    consent_newsletter: record.consentNewsletter,
    ref_code: record.refCode,
    referred_by: record.referredBy,
    utm_source: record.utmSource,
    utm_medium: record.utmMedium,
    utm_campaign: record.utmCampaign,
    utm_content: record.utmContent,
    landing_path: record.landingPath,
    engagement_score: record.engagementScore,
  };
}

/** Code d'erreur Postgres pour une violation de contrainte d'unicité. */
const UNIQUE_VIOLATION = "23505";

export function createSupabaseLeadStore(client: SupabaseClient): LeadStore {
  return {
    name: "Supabase",

    async upsert(record) {
      /* Recherche préalable plutôt qu'un `upsert` sur l'e-mail : il faut
         conserver le `ref_code` déjà attribué, sinon les liens de parrainage
         qu'une personne a pu partager cesseraient de lui être rattachés. */
      const existing = await client
        .from(TABLE)
        .select(COLUMNS)
        .eq("email", record.email)
        .maybeSingle<Row>();

      if (existing.error) throw new Error(`Lecture du lead impossible : ${existing.error.message}`);

      if (existing.data) {
        const { ref_code: keptRefCode } = existing.data;
        const payload = { ...toRow(record), ref_code: keptRefCode, updated_at: new Date().toISOString() };
        const updated = await client
          .from(TABLE)
          .update(payload)
          .eq("id", existing.data.id)
          .select(COLUMNS)
          .single<Row>();

        if (updated.error || !updated.data) {
          throw new Error(`Mise à jour du lead impossible : ${updated.error?.message ?? "réponse vide"}`);
        }
        return { lead: toLead(updated.data), created: false };
      }

      /* Insertion. Une collision de `ref_code` est improbable mais possible :
         on retente avec un nouveau code plutôt que de perdre l'inscription. */
      let payload = toRow(record);
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const inserted = await client.from(TABLE).insert(payload).select(COLUMNS).single<Row>();

        if (!inserted.error && inserted.data) {
          return { lead: toLead(inserted.data), created: true };
        }

        const code = (inserted.error as { code?: string } | null)?.code;
        const message = inserted.error?.message ?? "";

        if (code === UNIQUE_VIOLATION && message.includes("ref_code")) {
          payload = { ...payload, ref_code: generateRefCode() };
          continue;
        }

        /* Course entre deux envois simultanés de la même adresse : la
           contrainte d'unicité a tranché, on repasse par la branche de mise
           à jour. C'est aussi ce qui tient lieu de garde-fou en base contre
           les doublons, le compteur en mémoire n'étant pas fiable entre
           instances. */
        if (code === UNIQUE_VIOLATION && message.includes("email")) {
          return this.upsert(record);
        }

        throw new Error(`Enregistrement du lead impossible : ${message || "erreur inconnue"}`);
      }

      throw new Error("Enregistrement du lead impossible : trop de collisions de code de parrainage.");
    },

    async list(filter?: LeadListFilter) {
      let query = client.from(TABLE).select(COLUMNS).order("created_at", { ascending: false });

      if (filter?.profile) query = query.eq("profile", filter.profile);
      if (typeof filter?.minScore === "number") query = query.gte("engagement_score", filter.minScore);
      /* `contains` sur un text[] : le contact doit avoir coché cet engagement. */
      if (filter?.engagement) query = query.contains("engagements", [filter.engagement]);

      const { data, error } = await query.returns<Row[]>();
      if (error) throw new Error(`Lecture des leads impossible : ${error.message}`);
      return (data ?? []).map(toLead);
    },
  };
}
