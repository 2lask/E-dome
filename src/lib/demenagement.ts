/* ── SERVICES DU DÉMÉNAGEMENT — modèle partagé (client-safe) ─────────────────
   Le moment le plus cher d'un déménagement en Suisse : le nettoyage de fin de
   bail (avec garantie de remise à la régie), le transport, le débarras. On
   décrit son besoin une fois ; E-Dome transmet à des artisans choisis.
   Revenu : un prix fixe par contact transmis, payé par l'artisan (pilote). */

export const MOVE_SERVICES = [
  { id: "nettoyage", label: "Nettoyage de fin de bail", hint: "Garantie de remise selon l'artisan" },
  { id: "demenagement", label: "Déménagement", hint: "Transport, emballage, monte-meubles" },
  { id: "debarras", label: "Débarras", hint: "Cave, grenier, encombrants" },
  { id: "peinture", label: "Peinture", hint: "Retouches avant l'état des lieux" },
  { id: "garde-meubles", label: "Garde-meubles", hint: "Entre deux logements" },
] as const;

export type MoveService = (typeof MOVE_SERVICES)[number]["id"];
export type MoveStatus = "nouvelle" | "transmise" | "devis" | "realisee" | "annulee";

export const MOVE_STATUS_LABEL: Record<MoveStatus, string> = {
  nouvelle: "Reçue",
  transmise: "Transmise aux artisans",
  devis: "Devis reçus",
  realisee: "Réalisée",
  annulee: "Annulée",
};

export const SERVICE_LABEL: Record<MoveService, string> = Object.fromEntries(
  MOVE_SERVICES.map((s) => [s.id, s.label]),
) as Record<MoveService, string>;

export function isMoveService(s: string): s is MoveService {
  return MOVE_SERVICES.some((x) => x.id === s);
}

export interface MoveRequest {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  fromCity: string;
  toCity: string;
  moveDate: string | null;
  rooms: number | null;
  services: MoveService[];
  details: string;
  status: MoveStatus;
  adminNote: string;
  createdAt: string;
}
