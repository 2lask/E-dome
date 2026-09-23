import type { AccountId } from "./identity";
import type { SubscriptionId } from "./billing";
import type { IdeNumber } from "./compliance";

/* ── L'agence, ses agents, ses mandats ──────────────────────────────────────

   Rien de tout cela n'existe aujourd'hui dans le dépôt : l'Espace agence est
   la principale source de revenu récurrent du modèle et il n'a aucune trace
   dans `src/`. Ces types sont la fondation de l'étape 6.

   Le point le plus sensible est `Mandate.agencyCommission` : E-Dome affiche et
   suit la commission de l'agence, et **n'en prélève aucune part**. C'est la
   décision D2, prise contre l'avis initial du comptable, pour qui c'était la
   plus grosse assiette disponible. Le type porte ce fait dans son commentaire
   parce qu'aucun type ne peut l'imposer à lui seul — mais le module de
   tarification, lui, l'impose : `CommissionPole` exclut `vente`. */

export type AgencyId = string;
export type MandateId = string;

export interface Agency {
  id: AgencyId;
  name: string;
  /** Sous-domaine, vendu dans la formule haute. */
  slug: string;
  /** Une agence est vérifiée au niveau professionnel, ou elle n'existe pas. */
  ide: IdeNumber;
  subscriptionId: SubscriptionId | null;
  members: AgencyMember[];
  /** Communes ou districts déclarés — sert à la distribution des demandes. */
  coverage: { canton: string; communes?: string[] }[];
}

/**
 * Droits d'un membre d'agence.
 *
 * Énumérés plutôt que dérivés d'un rang : deux agences de même taille ne
 * répartissent pas les droits de la même façon, et un rang unique forcerait
 * l'une des deux à donner trop ou trop peu.
 */
export type AgencyPermission =
  | "listing:create"
  | "listing:publish"
  | "listing:assign"
  | "client:read"
  | "client:write"
  | "mandate:read"
  | "mandate:sign"
  | "document:upload"
  | "visit:schedule"
  | "stats:read"
  | "team:manage"
  | "billing:manage";

export interface AgencyMember {
  accountId: AccountId;
  /** Préréglage affiché. Les droits effectifs sont dans `permissions`. */
  seat: "owner" | "manager" | "agent" | "assistant";
  permissions: AgencyPermission[];
  /** Attribution des biens et des clients — B.3, Espace agence. */
  assignedListingIds: string[];
  assignedClientIds: AccountId[];
  status: "invited" | "active" | "suspended";
}

export interface Mandate {
  id: MandateId;
  agencyId: AgencyId;
  listingId: string;
  clientId: AccountId;
  kind: "vente" | "location-lt" | "gerance";
  exclusivity: "exclusif" | "simple";
  signedAt: string | null;
  /**
   * Commission de l'**agence**, en affichage et suivi seulement.
   *
   * E-Dome n'en prélève aucune part, n'en suggère aucun barème, ne la calcule
   * pas, ne la garantit pas et ne l'encaisse pas. L'outil enregistre ce que
   * l'agence déclare. Voir `DECISIONS.md` §1.2.
   */
  agencyCommission: { rate: number; basis: "prix-de-vente" | "loyer-annuel" };
  documents: DocumentRef[];
  visits: VisitSlot[];
}

export interface VisitSlot {
  id: string;
  mandateId: MandateId;
  agentId: AccountId;
  start: string;
  end: string;
  attendees: { accountId?: AccountId; name: string }[];
  status: "proposee" | "confirmee" | "honoree" | "annulee";
}

export interface DocumentRef {
  id: string;
  label: string;
  uploadedAt: string;
  uploadedBy: AccountId;
  kind:
    | "mandat"
    | "bail"
    | "diagnostic"
    | "piece-identite"
    | "autorisation-proprietaire"
    | "formule-loyer"
    | "autre";
  /**
   * Responsable du traitement.
   *
   * Pour les données des clients d'une agence, E-Dome est **sous-traitant** :
   * ces données restent celles de l'agence et doivent être exportables. Porter
   * le responsable sur le document rend l'export par agence écrivable sans
   * requête transverse — et rend l'obligation visible dans le type.
   */
  controller: { kind: "agency"; agencyId: AgencyId } | { kind: "platform" };
}

// ─── Demandes d'accompagnement ───────────────────────────────────────────────

/**
 * Demande d'accompagnement d'un particulier.
 *
 * **Une agence ne reçoit jamais un contact.** Elle voit une fiche anonyme et
 * elle y répond. L'identité ne circule qu'au moment où le particulier accepte
 * une proposition — c'est un acte de sa part, jamais une distribution.
 *
 * Le type porte cette règle : aucun champ d'identité n'est présent ici. Le lien
 * vers le demandeur vit ailleurs, et n'est joint qu'à l'acceptation.
 */
export interface AssistanceRequest {
  id: string;
  /** Jamais d'adresse exacte, jamais de nom, jamais de coordonnées. */
  propertyKind: string;
  area: number;
  priceRange: { min: number; max: number };
  commune: string;
  horizon: string;
  createdAt: string;
  /** Rayon choisi par le particulier. */
  radius: "commune" | "district" | "canton";
  /** Trois par défaut, cinq au plus. */
  maxProposals: number;
}

/**
 * Candidature d'une agence à une demande.
 *
 * Quatre champs imposés, et non un message libre : c'est ce qui rend les
 * propositions comparables et déplace la concurrence vers la qualité de la
 * réponse plutôt que vers la rapidité ou le budget.
 */
export interface AssistanceProposal {
  id: string;
  requestId: string;
  agencyId: AgencyId;
  commissionRate: number;
  included: string[];
  estimatedDays: number;
  references: { commune: string; note: string }[];
  submittedAt: string;
  /** Passe à `accepted` quand le particulier ouvre le contact, pas avant. */
  status: "submitted" | "accepted" | "declined";
}
