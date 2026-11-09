import { properties as CATALOGUE } from "@/lib/mock-data";
import type { Property } from "@/lib/types";
import type { AgencyMember } from "@/lib/model/agency";
import { demoAgency } from "@/content/agence";
import { requirePerson } from "./directory";

/* ── L'agence de démonstration : Hartmann Immobilier SA ─────────────────────

   L'ancienne agence de démonstration (« Régie du Léman ») n'avait aucun
   visage : six noms inventés dans une table d'équipe, quatorze « mandats
   actifs » écrits à la main, et une vitrine qui montrait les trois premiers
   biens en vente du catalogue — ceux d'autres personnes.

   C'est désormais Hartmann Immobilier SA, à Neuchâtel (casting, « Relations ») :
   une équipe de VRAIES personnes de l'annuaire — Jean-Luc Hartmann, directeur,
   et Aline Tschanz, agente —, et des biens qui sont LES LEURS : ceux qu'ils
   hébergent au catalogue. Tous les compteurs (membres, mandats actifs, biens
   vendus) se dérivent d'ici ; aucun ne s'écrit.

   Les textes de l'espace agence restent dans `src/content/agence.ts`. */

export interface DemoAgencyMember {
  /** Une personne de l'annuaire (invariant 11). */
  readonly accountId: string;
  /** Intitulé affiché dans l'équipe. */
  readonly title: string;
  readonly seat: AgencyMember["seat"];
  /** Résumé lisible des droits (`AgencyPermission` au modèle). */
  readonly permissionsLabel: string;
}

export const AGENCY_MEMBERS: readonly DemoAgencyMember[] = [
  { accountId: "user-015", title: "Directeur", seat: "owner", permissionsLabel: "Tous droits" },
  { accountId: "user-004", title: "Agente immobilière", seat: "agent", permissionsLabel: "Mandats, visites, locations" },
];

/** Les identifiants des membres de l'agence. */
export const AGENCY_MEMBER_IDS: readonly string[] = AGENCY_MEMBERS.map((m) => m.accountId);

/** Un membre, avec sa fiche d'annuaire. */
export function agencyTeam() {
  return AGENCY_MEMBERS.map((m) => ({ ...m, person: requirePerson(m.accountId) }));
}

/** Tous les biens portés par l'agence : ceux qu'hébergent ses membres. */
export function agencyProperties(): Property[] {
  const ids = new Set(AGENCY_MEMBER_IDS);
  return CATALOGUE.filter((p) => ids.has(p.host.id));
}

/** Les mandats de vente ACTIFS : biens en vente de l'agence, pas encore vendus. */
export function activeSaleMandates(): Property[] {
  return agencyProperties().filter((p) => p.transactionType === "vente" && !p.soldTo);
}

/** Les mandats de vente CONCLUS : biens de l'agence vendus (`soldTo`). */
export function concludedSaleMandates(): Property[] {
  return agencyProperties().filter((p) => p.transactionType === "vente" && !!p.soldTo);
}

/** Les biens en location (gérance) : longue et courte durée. */
export function agencyRentals(): Property[] {
  return agencyProperties().filter((p) => p.transactionType !== "vente");
}

/* Le suivi d'un mandat, tel que l'agence le déclare : référence interne,
   commission DE L'AGENCE (affichée seulement — E-Dome n'en prélève rien,
   `Mandate.agencyCommission` est display-only au modèle) et étape. Une ligne
   par mandat de vente de l'agence ; l'invariant 11 vérifie que la table et le
   catalogue désignent les mêmes biens. */
export const MANDATE_TRACKING: Readonly<Record<string, { ref: string; rate: string; status: string }>> = {
  prop28: { ref: "M-031", rate: "3 %", status: "En visite" },
  prop15: { ref: "M-034", rate: "2,5 %", status: "Offre reçue" },
  prop20: { ref: "M-036", rate: "3 %", status: "Mandat signé" },
  prop27: { ref: "M-024", rate: "3 %", status: "Vendu" },
};

/** Les chiffres de l'en-tête de l'agence, tous dérivés. */
export function agencyCounts() {
  return {
    members: AGENCY_MEMBERS.length,
    activeMandates: activeSaleMandates().length,
    sold: concludedSaleMandates().length,
    rentals: agencyRentals().length,
  };
}

/** Le chemin de la vitrine publique. */
export const AGENCY_PUBLIC_HREF = `/agence/${demoAgency.slug}`;
