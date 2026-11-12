import { properties as CATALOGUE } from "@/lib/mock-data";
import { roleLabel } from "@/lib/model/role-labels";
import { demoAgency } from "@/content/agence";
import { DIRECTORY, requirePerson } from "./directory";
import { AGENCY_MEMBER_IDS, agencyProperties } from "./agency";
import { LEDGER } from "./ledger";
import { DEMO_TODAY } from "./clock";

/* ── La console d'administration, alignée sur le casting (chantier P6c) ──────

   La console listait dix comptes inventés (« Marie Dupont », « Laura
   Fischer »…), cinq biens qui n'existaient nulle part et des signalements
   signés par ces fantômes. Elle lit désormais LES MÊMES données que le reste
   de la démonstration :

   - les comptes = les seize personnes de l'annuaire + l'agence Hartmann
     Immobilier SA (dont l'équipe est faite de deux d'entre elles) ;
   - les biens = le catalogue, avec leur vrai hôte ;
   - le seul total plateforme = le « Volume de transactions » de l'année, sommé
     sur le journal (`ledger.ts`, lecture seule). Jamais « chiffre
     d'affaires » ni « revenus » : ce n'est pas ce qu'E-Dome encaisse, c'est ce
     qui a transité entre les membres.

   Fonctions pures, testées par `tests/data/p6c-poles.test.ts`. */

export interface AdminAccount {
  id: string;
  nom: string;
  email: string;
  kind: "personne" | "agence";
  role: string;
  lieu: string;
  /** Biens hébergés au catalogue (dérivé). */
  biens: number;
  href: string;
}

export const AGENCY_ACCOUNT_ID = demoAgency.slug;

/** Les comptes de la démonstration : l'annuaire, puis l'agence. */
export function adminAccounts(): AdminAccount[] {
  const people: AdminAccount[] = DIRECTORY.map((u) => ({
    id: u.id,
    nom: `${u.firstName} ${u.lastName}`,
    email: u.email,
    kind: "personne",
    role: roleLabel(u.activeRole, u.trades),
    lieu: u.country && u.country !== "Suisse" ? `${u.city} (${u.country})` : u.city,
    biens: CATALOGUE.filter((p) => p.host.id === u.id).length,
    href: `/profil/${u.id}`,
  }));
  const team = AGENCY_MEMBER_IDS.map((id) => {
    const p = requirePerson(id);
    return `${p.firstName} ${p.lastName}`;
  }).join(", ");
  return [
    ...people,
    {
      id: AGENCY_ACCOUNT_ID,
      nom: demoAgency.name,
      email: `contact@${AGENCY_ACCOUNT_ID}.ch`,
      kind: "agence",
      role: `Agence · ${team}`,
      lieu: demoAgency.city,
      biens: agencyProperties().length,
      href: `/agence/${AGENCY_ACCOUNT_ID}`,
    },
  ];
}

/** Les biens du catalogue, tels que la modération les voit. */
export function adminProperties() {
  return CATALOGUE.map((p) => ({
    id: p.id,
    titre: p.title,
    hoteId: p.host.id,
    hote: `${p.host.firstName} ${p.host.lastName}`,
    ville: p.location.city,
    prix: p.price,
    currency: p.currency,
    transactionType: p.transactionType,
  }));
}

export const VOLUME_YEAR = DEMO_TODAY.getUTCFullYear();

/** Volume de transactions de l'année, tous membres confondus : ce qui a
    transité (séjours, ventes, formations, billets, prestations…), hors
    annulations et hors rémunérations d'apporteurs (qui ne sont pas des
    transactions). En CHF. */
export function platformVolume(year: number = VOLUME_YEAR): number {
  return LEDGER.filter(
    (e) => (e.status === "completed" || e.status === "confirmed") && e.source !== "apporteurs" && e.date.startsWith(`${year}-`),
  ).reduce(
    (s, e) => s + e.gross,
    0,
  );
}

/* Signalements de démonstration, déposés par des personnes de l'annuaire sur
   des objets qui existent. */
export interface AdminReport {
  id: string;
  type: string;
  cible: string;
  cibleHref: string;
  auteurId: string;
  date: string;
  statut: "ouvert" | "en_cours" | "resolu";
}

export const ADMIN_REPORTS: readonly AdminReport[] = [
  { id: "S001", type: "Annonce : prix à vérifier", cible: "Bien prop8", cibleHref: "/explorer/prop8", auteurId: "user-006", date: "2026-09-28", statut: "ouvert" },
  { id: "S002", type: "Commentaire en double", cible: "Fil d'actualité", cibleHref: "/feed", auteurId: "user-007", date: "2026-09-24", statut: "en_cours" },
  { id: "S003", type: "Démarchage en message privé", cible: "Messagerie", cibleHref: "/messages", auteurId: "user-013", date: "2026-09-15", statut: "resolu" },
];

export function reportAuthor(r: AdminReport): string {
  const p = requirePerson(r.auteurId);
  return `${p.firstName} ${p.lastName}`;
}
