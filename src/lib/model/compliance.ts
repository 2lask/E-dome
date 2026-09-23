import type { Money } from "./billing";

/* ── Champs imposés par le droit ────────────────────────────────────────────

   Les noms viennent de la note juridique (`analyse/juridique.md` §5). Ils sont
   posés maintenant, en grande partie optionnels, pour une raison simple :
   ajouter un champ obligatoire plus tard impose de retoucher toutes les
   données de démonstration, alors que réserver la place coûte une ligne.

   Deux champs sont **obligatoires** et non optionnels, parce que les rendre
   facultatifs reviendrait à rendre la règle contournable :
   `Review.transactionId` et `VerificationState.level`.

   Trois interdits sont posés **par construction**, pas par validation — ils
   sont demandés tels quels par l'agent juridique :

   1. `fees.chargedToTenant` n'est pas représentable. Aucun champ ne permet de
      mettre un frais à la charge d'un locataire (art. 254 CO, transaction
      couplée).
   2. La profondeur de parrainage est bornée à 1 (`REFERRAL_MAX_DEPTH`), ce qui
      ferme la vente en boule de neige.
   3. Aucun champ ne permet de détenir une garantie de loyer. `deposit` décrit
      le plafond légal et le titulaire du compte, jamais un solde chez E-Dome. */

export type IdeNumber = string; // CHE-123.456.789
export type TransactionId = string;

// ─── Vérification ────────────────────────────────────────────────────────────

/**
 * Les trois niveaux de vérification de B.6.
 *
 * Le niveau `professional` **impose** un numéro IDE et sa date de contrôle :
 * un badge « Agence vérifiée » non adossé au registre est une allégation
 * trompeuse. Le niveau `qualification` porte `verified: false` **littéral** —
 * le type interdit donc d'afficher une qualification déclarée comme une
 * garantie.
 */
export interface VerificationState {
  level: "none" | "identity" | "professional" | "qualification";
  identity?: { method: "document" | "video"; verifiedAt: string };
  professional?: { ide: IdeNumber; legalName: string; checkedAt: string; registryStatus: string };
  qualification?: { claims: { label: string; issuer: string; verified: false }[] };
  /** Clé de contenu décrivant ce que le badge **ne** garantit pas. */
  disclaimerKey?: string;
}

// ─── Consentements ───────────────────────────────────────────────────────────

/**
 * Un consentement par finalité, versionné, révocable.
 *
 * `version` n'est pas décoratif : un consentement dont on ne sait pas à quel
 * texte il se rapporte ne prouve rien. Accepter des conditions générales n'est
 * pas un consentement au sens des données — d'où une finalité `terms`
 * distincte.
 */
export interface Consent {
  purpose: "terms" | "privacy" | "newsletter" | "profiling" | "agency-dpa";
  version: string;
  givenAt: string | null;
  withdrawnAt?: string;
  source?: string;
  locale?: string;
}

// ─── Conformité portée par l'annonce ─────────────────────────────────────────

/**
 * Obligations attachées à un bien, et non à un compte.
 *
 * `initialRentNotice` porte le **canton et la commune** : la formule officielle
 * du loyer initial est obligatoire dans plusieurs cantons, et parfois
 * seulement dans certaines communes, selon la pénurie de logements. La liste
 * exacte est à confirmer (`JURIDIQUE-A-VALIDER.md` §6) et sera tenue dans une
 * table éditable, pas en dur ici.
 *
 * `registrationNumber` n'est **pas** un champ « après le lancement » : il est
 * exigible pour tout bien situé dans l'UE depuis le 20 mai 2026, et c'est la
 * plateforme qui doit vérifier et afficher.
 */
export interface ListingCompliance {
  initialRentNotice?: {
    canton: string;
    commune?: string;
    required: boolean;
    previousRent: Money | null;
    servedAt?: string;
    increaseReason?: string;
  };
  /** Courte durée : autorisation du propriétaire quand l'hôte est locataire. */
  ownerAuthorization?: { required: boolean; documentId?: string };
  registration?: { number: string; authority: string; checkedAt: string };
  /** Acheteur domicilié à l'étranger, bien résidentiel suisse. */
  lexKollerNoticeShownAt?: string;
  /** L'assujettissement Lex Koller dépend de l'affectation, pas du prix. */
  useClass?: "residential" | "commercial" | "mixed" | "land";
  localRulesAckAt?: string;
}

/**
 * Garantie de loyer.
 *
 * Plafonnée à trois mois pour un logement (art. 257e CO), sur un compte au nom
 * du locataire. **Aucun champ ne permet de représenter une détention par
 * E-Dome** : c'est délibéré, et cela ne doit jamais être ajouté.
 */
export interface RentDeposit {
  months: 0 | 1 | 2 | 3;
  holder: "tenant-account" | "insurer";
}

// ─── Avis, contenu payant, rendement ─────────────────────────────────────────

/**
 * Un avis n'existe pas sans transaction.
 *
 * `transactionId` est **obligatoire** : c'est la seule façon de rendre la règle
 * non contournable. Un avis sans transaction rattachée est une allégation sur
 * un concurrent.
 */
export interface ReviewCompliance {
  transactionId: TransactionId;
  authorRole: string;
  moderationState: "published" | "pending" | "removed";
  moderationLog?: { at: string; action: string; reason: string }[];
  /** Droit de réponse de la personne visée. */
  rebuttal?: { at: string; body: string };
  /** Si l'auteur a reçu quelque chose, l'avis doit le dire. */
  incentivized: boolean;
}

/** Contenu payant : présent = étiquette affichée, sans interaction. */
export interface Sponsorship {
  kind: "ad" | "sponsored" | "affiliate";
  advertiserId?: string;
  labelKey: string;
}

/**
 * Rendement affiché.
 *
 * Il n'existe volontairement **ni `expectedReturn` ni `yieldPromise`** : B.6
 * interdit la promesse de rendement. Un rendement s'affiche indicatif, avec sa
 * base de calcul et une mention de non-garantie — les trois ensemble.
 */
export interface IndicativeYield {
  value: number;
  basisKey: string;
  disclaimerKey: string;
}

// ─── Programme apporteurs ────────────────────────────────────────────────────

/**
 * Profondeur de parrainage autorisée.
 *
 * Bornée à 1. Une prime dépendant du recrutement d'autres apporteurs relèverait
 * de la vente en boule de neige. La constante existe pour que la borne soit
 * citée à l'endroit qui la vérifie, plutôt que supposée.
 */
export const REFERRAL_MAX_DEPTH = 1;

/**
 * Déclaration obligatoire avant la génération du premier lien d'apport.
 *
 * Sans ces trois champs, aucun lien n'est généré. Le troisième n'est pas une
 * case de confort : il est ce qui distingue un apporteur d'un courtier agissant
 * pour son propre compte.
 */
export interface ApporteurDeclaration {
  taxResidenceCountry: string;
  entity: { kind: "individual" } | { kind: "company"; ide: IdeNumber };
  /** Engagement de ne ni négocier ni représenter une partie. */
  noNegotiationAck: { at: string; textVersion: string };
}

/** Type d'apport, pour la restriction `pays × type d'apport`. */
export type ReferralKind =
  | "immobilier-vente"
  | "immobilier-location"
  | "hote"
  | "prestataire"
  | "createur"
  | "annonceur"
  | "abonnement"
  | "utilisateur";

/** `true` si l'apport touche une transaction immobilière. */
export function isRealEstateReferral(kind: ReferralKind): boolean {
  return kind === "immobilier-vente" || kind === "immobilier-location";
}
