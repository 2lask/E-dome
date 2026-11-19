/* ── DEMANDES — le modèle partagé (client-safe) ──────────────────────────────

   Une boîte unique pour tout ce qui arrive à un vendeur (REBUILD.md §3.4) :
     · contact  — quelqu'un écrit depuis la fiche du bien ;
     · visite   — quelqu'un demande une visite (avec une date souhaitée) ;
     · apport   — un apporteur amène quelqu'un ; le vendeur a ACCEPTÉ, la prime
                  est due, les coordonnées sont révélées.
   Avant acceptation, une mise en relation est une `PendingIntroduction` : une
   décision à prendre, pas encore une demande.

   Tables : `inquiries`, `inquiry_events`, `introductions`,
   `introduction_contacts` (migration `supabase/migrations/002_demandes.sql`). */

export type DemandeKind = "contact" | "visite" | "apport";

export type DemandeStatus = "nouvelle" | "en-cours" | "visite" | "offre" | "conclue" | "fermee";

/** Le pipeline, dans l'ordre. « fermee » = sans suite. */
export const STATUS_FLOW: { value: DemandeStatus; label: string; short: string }[] = [
  { value: "nouvelle", label: "Nouvelle", short: "Nouvelle" },
  { value: "en-cours", label: "En discussion", short: "En cours" },
  { value: "visite", label: "Visite prévue", short: "Visite" },
  { value: "offre", label: "Offre reçue", short: "Offre" },
  { value: "conclue", label: "Conclue", short: "Conclue" },
  { value: "fermee", label: "Sans suite", short: "Fermée" },
];

export const STATUS_LABEL: Record<DemandeStatus, string> = Object.fromEntries(
  STATUS_FLOW.map((s) => [s.value, s.label]),
) as Record<DemandeStatus, string>;

export const KIND_LABEL: Record<DemandeKind, string> = {
  contact: "Contact",
  visite: "Demande de visite",
  apport: "Apportée",
};

/** Une demande ouverte (statut non final) appelle encore une action. */
export function isOpen(status: DemandeStatus): boolean {
  return status !== "conclue" && status !== "fermee";
}

export interface Demande {
  id: string;
  kind: DemandeKind;
  status: DemandeStatus;
  property: { id: string; title: string; city: string; cover: string };
  sender: { name: string; email: string | null; phone: string | null; hasAccount: boolean };
  message: string;
  preferredDate: string | null;
  /** Mise en relation d'origine (kind = apport). */
  introduction: { apporteurName: string; amountChf: number } | null;
  createdAt: string;
  updatedAt: string;
  /** Jeton du dossier de location joint (lien /dossier/partage/<jeton>). */
  dossierToken?: string | null;
}

export interface PendingIntroduction {
  id: string;
  property: { id: string; title: string; city: string; cover: string };
  apporteurName: string;
  /** Description anonyme du contact (les coordonnées viennent après acceptation). */
  contactLabel: string;
  /** Montant FIGÉ à la création de la mise en relation. */
  amountChf: number;
  createdAt: string;
}

export interface DemandeEvent {
  id: string;
  kind: "creee" | "statut" | "note";
  data: Record<string, unknown>;
  actorName: string | null;
  createdAt: string;
}

/** Date relative courte en français (« il y a 3 h », « hier », « 12 nov. »). */
export function relativeFr(iso: string, now: Date = new Date()): string {
  const d = new Date(iso);
  const s = Math.round((now.getTime() - d.getTime()) / 1000);
  if (s < 60) return "à l'instant";
  if (s < 3600) return `il y a ${Math.floor(s / 60)} min`;
  if (s < 86400) return `il y a ${Math.floor(s / 3600)} h`;
  if (s < 172800) return "hier";
  if (s < 604800) return `il y a ${Math.floor(s / 86400)} j`;
  return d.toLocaleDateString("fr-CH", { day: "numeric", month: "short" });
}
