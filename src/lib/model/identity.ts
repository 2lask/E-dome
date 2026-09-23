import type { Role } from "@/lib/types";
import type { VerificationState, Consent } from "./compliance";
import type { SubscriptionId } from "./billing";
import type { AgencyId } from "./agency";

/* ── Identité : trois axes, plus un quatrième sans pouvoir ───────────────────

   `src/lib/types.ts` porte aujourd'hui une union de treize chaînes où
   cohabitent des capacités (`agence`, `apporteur`, `admin`) et des métiers
   (`photographe`, `architecte`, `notaire`, `promoteur`). Élargir cette union
   ne résoudrait rien : le code continuerait à demander « quel rôle ? » là où
   la vraie question est « quel droit, dans quelle agence ? ».

   D'où quatre axes distincts, et la règle qui les sépare :

   · PlatformRole    — ce qu'on peut FAIRE. Onze valeurs, celles de B.5.
   · ProviderTrade   — ce qu'on VEND. Un notaire et un photographe ont les
                       mêmes droits ; ils ne vendent pas la même chose.
   · RoleGrant       — un rôle DÉTENU, daté, avec une portée. `agent` n'existe
                       qu'au sein d'une agence.
   · ProfileInterest — ce à quoi on S'INTÉRESSE. Aucun droit, aucun écran.

   Ce module ne remplace pas encore `Role` : la migration des pages se fait à
   l'étape 4, quand le sélecteur de rôle arrive et que ces pages changent de
   toute façon. `LEGACY_ROLE_TO_PLATFORM` ci-dessous rend cette migration
   mécanique plutôt que interprétative. */

export type AccountId = string;

// ─── Ce qu'on peut faire ─────────────────────────────────────────────────────

/**
 * Capacité sur la plateforme. Exactement les onze valeurs de B.5.
 *
 * Deux absences volontaires. **`courtier`** : le rôle n'est pas illicite en
 * soi, mais un badge « Courtier » à côté du logo E-Dome crée l'apparence
 * qu'E-Dome exerce ou organise le courtage, et l'apparence suffit à nourrir un
 * litige. Un courtier indépendant est une agence d'une personne, ou un agent.
 * **`investisseur`** : un espace « investisseur » avec ses droits et son
 * tableau de bord est le chemin le plus court vers la promesse de rendement,
 * que B.6 interdit — il devient un `ProfileInterest`.
 */
export type PlatformRole =
  | "visiteur"
  | "particulier"
  | "proprietaire"
  | "agent"
  | "agence"
  | "prestataire"
  | "createur"
  | "hote"
  | "apporteur"
  | "annonceur"
  | "admin";

export const PLATFORM_ROLES: readonly PlatformRole[] = [
  "visiteur",
  "particulier",
  "proprietaire",
  "agent",
  "agence",
  "prestataire",
  "createur",
  "hote",
  "apporteur",
  "annonceur",
  "admin",
];

// ─── Ce qu'on vend ───────────────────────────────────────────────────────────

/**
 * Métier d'un prestataire. **Ce n'est pas un rôle.**
 *
 * `courtage` n'y figure pas non plus : le mot « courtier » n'apparaît nulle
 * part dans l'interface, y compris comme catégorie de service. L'activité
 * d'une agence n'est pas une prestation de la marketplace.
 *
 * Un métier réglementé — notaire, architecte — ne peut porter de badge que
 * vérifié contre le registre compétent : sans quoi c'est une allégation
 * trompeuse. D'où `tradeVerified` sur le compte.
 */
export type ProviderTrade =
  | "photographe"
  | "home-staging"
  | "architecte"
  | "notaire"
  | "promoteur"
  | "diagnostic"
  | "conciergerie"
  | "demenagement";

// ─── Ce à quoi on s'intéresse ────────────────────────────────────────────────

/**
 * Centre d'intérêt déclaré.
 *
 * **Ne confère aucun droit, ne change aucun écran, ne crée aucun tableau de
 * bord.** Sert au ciblage du fil, à la segmentation et au formulaire de
 * manifestation d'intérêt de la landing.
 *
 * La règle qui rend cet axe sûr : *un centre d'intérêt n'ouvre jamais un
 * écran.* Si « investisseur » devait un jour donner accès à quelque chose,
 * c'est qu'il est redevenu un rôle — et il repasse alors par la décision D6.
 *
 * Les six premières valeurs recouvrent les profils du formulaire de la
 * landing (`ProfileId` dans `src/content/landing.ts`), qu'il ne faut surtout
 * pas renommer : la couche leads en dérive la correspondance de ses colonnes.
 */
export type ProfileInterest =
  | "investisseur"
  | "vendeur"
  | "bailleur"
  | "acheteur"
  | "locataire"
  | "voyageur"
  | "formation"
  | "evenements";

// ─── Ce qu'on détient ────────────────────────────────────────────────────────

/**
 * Un rôle détenu, daté, et dont la **portée** compte.
 *
 * `agent` n'a aucun sens hors d'une agence : la portée le dit dans le type
 * plutôt que dans une convention. Un rôle peut être adossé à un abonnement —
 * c'est le cas d'`agence` et de `proprietaire` — et il tombe avec lui.
 */
export interface RoleGrant {
  role: PlatformRole;
  scope?: { kind: "agency"; agencyId: AgencyId };
  grantedAt: string;
  subscriptionId?: SubscriptionId;
  status: "active" | "suspended" | "revoked";
}

export interface Account {
  id: AccountId;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;

  /** Cumulables — c'est B.5. Au moins un grant, toujours. */
  grants: RoleGrant[];

  /**
   * Rôle sous lequel l'interface se présente. **Une vue, pas un droit.**
   *
   * Le sélecteur « voir la plateforme en tant que… » n'écrit que ceci.
   * Découpler la vue des droits détenus est ce qui rend le sélecteur honnête :
   * changer de vue ne donne accès à rien.
   */
  viewingAs: PlatformRole;

  trades?: ProviderTrade[];
  /** Un métier réglementé non vérifié ne doit pas porter de badge. */
  tradeVerified?: Partial<Record<ProviderTrade, { registry: string; checkedAt: string }>>;

  interests?: ProfileInterest[];

  verification: VerificationState;
  consents: Consent[];

  /**
   * Décide ce que le programme apporteur autorise.
   *
   * Le découpage est `pays × type d'apport`, pas `pays` : bloquer tous les
   * types d'apport hors de Suisse bloquerait aussi l'apport d'un créateur de
   * formation ou d'un annonceur, qui n'a rien d'immobilier et ne relève
   * d'aucune autorisation. Le canton est nécessaire parce que le Tessin a son
   * propre régime d'autorisation (LFid).
   */
  residence: { country: string; canton?: string };
}

/** `true` si le compte détient effectivement ce rôle, portée comprise. */
export function holdsRole(account: Account, role: PlatformRole, agencyId?: AgencyId): boolean {
  return account.grants.some(
    (g) =>
      g.role === role &&
      g.status === "active" &&
      (agencyId === undefined || g.scope?.agencyId === agencyId),
  );
}

// ─── Passerelle vers l'ancien jeu de rôles ───────────────────────────────────

/**
 * Correspondance des treize anciens rôles vers les onze nouveaux.
 *
 * Existe pour que la migration de l'étape 4 soit mécanique. Trois cas ne sont
 * pas de simples renommages, et c'est pourquoi cette table est commentée
 * plutôt que devinée :
 *
 * · `courtier` → `agence` — un courtier indépendant est une agence d'une
 *   personne. Le libellé affiché ne dit jamais « courtier ».
 * · `investisseur` → `particulier` — la capacité ; l'intérêt est porté
 *   séparément par `ProfileInterest`.
 * · les métiers (`photographe`, `architecte`, `notaire`, `promoteur`) →
 *   `prestataire`, leur métier passant dans `Account.trades`.
 */
export const LEGACY_ROLE_TO_PLATFORM: Readonly<Record<Role, PlatformRole>> = {
  client: "particulier",
  hote: "hote",
  agence: "agence",
  promoteur: "prestataire",
  apporteur: "apporteur",
  investisseur: "particulier",
  formateur: "createur",
  proprietaire: "proprietaire",
  photographe: "prestataire",
  courtier: "agence",
  architecte: "prestataire",
  notaire: "prestataire",
  admin: "admin",
};

/** Métier déduit d'un ancien rôle, quand il en portait un. */
export const LEGACY_ROLE_TO_TRADE: Readonly<Partial<Record<Role, ProviderTrade>>> = {
  photographe: "photographe",
  architecte: "architecte",
  notaire: "notaire",
  promoteur: "promoteur",
};

/** Centre d'intérêt déduit d'un ancien rôle, quand il en portait un. */
export const LEGACY_ROLE_TO_INTEREST: Readonly<Partial<Record<Role, ProfileInterest>>> = {
  investisseur: "investisseur",
};

/** `true` si la chaîne est un rôle de plateforme connu. */
export function isPlatformRole(value: unknown): value is PlatformRole {
  return typeof value === "string" && (PLATFORM_ROLES as readonly string[]).includes(value);
}
