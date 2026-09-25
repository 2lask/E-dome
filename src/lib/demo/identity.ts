/* ── L'utilisateur de démonstration, en un seul endroit ─────────────────────

   Huit sources décrivaient cette personne, et elles divergeaient sur tout :
   trois villes (Neuchâtel, Lausanne, Genève), quatre nombres d'abonnés de 0 à
   12 400, deux nombres d'avis, deux identifiants (`user-001` et `me`), trois
   domaines d'adresse e-mail, et « Fondateur » contre « Co-fondateur ». Dans le
   fil, l'identifiant de l'utilisateur courant désignait même **Sophie**.

   Ce module porte les faits ; les autres s'en dérivent. Il n'importe rien du
   reste du dépôt, pour qu'aucun cycle ne se forme.

   ── Pourquoi ce n'est plus le fondateur d'E-Dome ───────────────────────────

   La règle de tri de la Partie C — « les données fictives d'un utilisateur sur
   son propre tableau de bord sont normales, les affirmations sur E-Dome ne le
   sont pas » — **ne tient que si l'utilisateur n'est pas la plateforme**. Tant
   que le profil affichait « Fondateur & CEO · E-Dome », chaque chiffre de son
   tableau de bord devenait une affirmation sur E-Dome : son chiffre d'affaires
   était celui de la plateforme, ses abonnés étaient son audience.

   Deux effets secondaires s'ajoutaient. Un investisseur qui bascule en rôle
   agence voyait le fondateur jouer l'agence. Et c'était le seul profil
   complet, ce qui donnait l'image d'une plateforme à un seul utilisateur, son
   créateur.

   C'est désormais un propriétaire lausannois ordinaire, sans lien avec
   E-Dome, cumulant trois rôles — bailleur, hôte de courte durée, apporteur.
   Trois et non deux : `/vendre` et l'écran de la formule officielle du loyer
   initial ont besoin d'un bailleur pour être démontrables. */

export const CURRENT_USER_ID = "user-001";

/** Une seule ville, un seul domaine. Les trois variantes ont disparu. */
export const DEMO_CITY = "Lausanne";
export const DEMO_COUNTRY = "Suisse";
export const DEMO_EMAIL_DOMAIN = "e-dome.ch";

/* ── La table des profils porteurs de montants (Mission 2, étape 2) ──────────

   Le journal (`ledger.ts`) était scellé à UNE personne : `build()` bouclait sur
   deux constantes globales décrivant Léo seul. Pour que 15 profils puissent
   chacun porter des montants cohérents sans recréer le « facteur 5 » (l'audit a
   retrouvé ~×50 sur l'écran apporteurs), la possession devient une TABLE :
   `build()` boucle dessus et tague chaque écriture de l'`ownerId` du profil.

   Pour l'instant une seule entrée — l'utilisateur courant. L'étape 3 en ajoutera
   trois autres : la table est conçue pour ça, un profil n'est plus un cas
   spécial mais une ligne. `OWNED_PROPERTY_IDS`/`OWNED_FORMATION_IDS` restent
   exportés (les vues du tableau de bord restent celles de l'utilisateur
   courant), mais ils DÉRIVENT désormais de la table : une seule source. */

export interface Profile {
  /** La personne à qui reviennent les montants. Un id de l'annuaire. */
  readonly ownerId: string;
  /**
   * Biens du **catalogue** que ce profil possède — pas un jeu inventé pour le
   * tableau de bord. En location de courte durée et en francs pour l'utilisateur
   * courant : c'est le seul pôle où E-Dome perçoit une commission sur un
   * logement, donc celui qui rend le modèle économique lisible.
   */
  readonly ownedPropertyIds: readonly string[];
  /** Formations dont ce profil est l'auteur. */
  readonly ownedFormationIds: readonly string[];
}

export const PROFILES = [
  {
    ownerId: CURRENT_USER_ID,
    ownedPropertyIds: ["prop5", "prop2", "prop9"],
    ownedFormationIds: ["form-001"],
  },
] as const satisfies readonly Profile[];

/** Les identifiants de tous les profils porteurs de montants. */
export const PROFILE_OWNER_IDS: readonly string[] = PROFILES.map((p) => p.ownerId);

/** L'entrée de l'utilisateur courant dans la table. */
export const CURRENT_PROFILE = PROFILES.find((p) => p.ownerId === CURRENT_USER_ID)!;

/** Compat : les biens de l'utilisateur courant, dérivés de la table. */
export const OWNED_PROPERTY_IDS = CURRENT_PROFILE.ownedPropertyIds;

/** Compat : les formations de l'utilisateur courant, dérivées de la table. */
export const OWNED_FORMATION_IDS = CURRENT_PROFILE.ownedFormationIds;

/**
 * Les faits d'identité, et rien d'autre.
 *
 * Les chiffres d'audience sont délibérément modestes. L'ordre de grandeur
 * crédible pour un réseau qui se lance est de l'ordre de la dizaine, pas du
 * millier : les 2 340 abonnés précédents se lisaient comme une traction de la
 * plateforme, et le lien menait de toute façon à une liste de onze personnes.
 */
export const CURRENT_USER = {
  id: CURRENT_USER_ID,
  firstName: "Léo",
  lastName: "Martin",
  fullName: "Léo Martin",
  initials: "LM",
  email: `leo.martin@${DEMO_EMAIL_DOMAIN}`,
  phone: "+41 79 123 45 67",
  avatar:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&h=240&fit=crop&crop=face",
  banner:
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=400&fit=crop",
  city: DEMO_CITY,
  country: DEMO_COUNTRY,
  headline: "Propriétaire à Lausanne · Loue en courte durée",
  about:
    "Je possède trois logements en Suisse romande, que je loue en courte durée " +
    "et gère moi-même. J'écris de temps en temps sur ce que j'apprends en " +
    "chemin — rendement réel, charges, relation avec les voyageurs. Je " +
    "recommande volontiers les prestataires avec qui ça se passe bien.",
  /**
   * Rôles au sens de l'ancien jeu. La migration vers `PlatformRole` est à
   * l'étape 4.
   *
   * `formateur` s'ajoute aux trois rôles décidés dans `DECISIONS.md` §4.1, et
   * l'écart mérite d'être justifié : le catalogue fait de cette personne
   * l'auteur de `form-001`, et le tableau de bord doit démontrer sept sources
   * de revenu. Retirer la formation appauvrirait la démonstration ; la garder
   * sans le rôle serait incohérent. Un bailleur qui écrit un cours sur ce
   * qu'il a appris reste un particulier ordinaire — c'est même ce que dit sa
   * présentation.
   */
  roles: ["proprietaire", "hote", "apporteur", "formateur"] as const,
  stats: {
    followers: 38,
    following: 64,
    rating: 4.6,
    reviewsCount: 12,
  },
  memberSince: "2026-02-10",
} as const;

/** Nom affichable d'une personne, sans le recomposer à six endroits. */
export function displayName(p: { firstName: string; lastName: string }): string {
  return `${p.firstName} ${p.lastName}`;
}
