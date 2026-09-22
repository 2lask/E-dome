import type { ProfileId } from "@/content/landing";
import type { AnswerValue } from "./schema";

/* Formes de données de la couche leads, partagées par les implémentations de
   stockage, la Server Action et l'admin. */

/** Une manifestation d'intérêt telle qu'elle est conservée. */
export interface StoredLead {
  id: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  email: string;
  profile: ProfileId;
  canton: string;
  country: string | null;
  /** Réponses de la couche 2, indexées par identifiant de question. */
  profileAnswers: Record<string, AnswerValue>;
  /** Identifiants d'engagement cochés (couche 3). */
  engagements: string[];
  consentPrivacy: boolean;
  consentAt: string | null;
  consentNewsletter: boolean;
  /** Code de parrainage propre à cette personne. */
  refCode: string;
  /** Code de la personne qui l'a parrainée, le cas échéant. */
  referredBy: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  landingPath: string | null;
  /** Calculé côté serveur — voir `score.ts`. */
  engagementScore: number;
}

/** Données prêtes à être écrites : le serveur a déjà calculé score et code. */
export type LeadRecord = Omit<StoredLead, "id" | "createdAt" | "updatedAt">;

export interface LeadListFilter {
  profile?: ProfileId;
  /** Ne retenir que les contacts ayant coché cet engagement. */
  engagement?: string;
  minScore?: number;
}

/**
 * Contrat de stockage.
 *
 * Volontairement réduit à ce dont la landing a besoin, pour qu'une autre
 * implémentation (Airtable, Notion, une simple API) reste un exercice court.
 */
export interface LeadStore {
  /** Nom lisible, affiché dans l'admin et les avertissements de console. */
  readonly name: string;
  /**
   * Insère, ou met à jour si l'adresse e-mail est déjà connue.
   *
   * Le `created` renvoyé sert à distinguer une première inscription d'une
   * mise à jour : on réutilise alors le code de parrainage existant plutôt
   * que d'en attribuer un nouveau, sinon les liens déjà partagés par cette
   * personne cesseraient de lui être attribués.
   */
  upsert(record: LeadRecord): Promise<{ lead: StoredLead; created: boolean }>;
  /** Liste filtrée, la plus récente d'abord. */
  list(filter?: LeadListFilter): Promise<StoredLead[]>;
}
