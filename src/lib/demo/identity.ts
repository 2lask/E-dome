/* ── L'utilisateur de démonstration, en un seul endroit ─────────────────────

   Huit sources décrivaient cette personne, et elles divergeaient sur tout :
   trois villes (Neuchâtel, Lausanne, Genève), quatre nombres d'abonnés de 0 à
   12 400, deux nombres d'avis, deux identifiants (`user-001` et `me`), trois
   domaines d'adresse e-mail, et « Fondateur » contre « Co-fondateur ». Dans le
   fil, l'identifiant de l'utilisateur courant désignait même **Sophie**.

   Ce module porte les faits ; les autres s'en dérivent. Il n'importe que le
   graphe social (social.ts, qui n'importe rien), pour qu'aucun cycle ne se forme.

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

import { followerCount, followingCount } from "./social";

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

   Dix lignes depuis le chantier P1 (le casting des seize) : un profil n'est
   pas un cas spécial mais une ligne. `OWNED_PROPERTY_IDS`/`OWNED_FORMATION_IDS` restent
   exportés (les vues du tableau de bord restent celles de l'utilisateur
   courant), mais ils DÉRIVENT désormais de la table : une seule source. */

export interface Profile {
  /** La personne à qui reviennent les montants. Un id de l'annuaire. */
  readonly ownerId: string;
  /**
   * Biens du **catalogue** que ce profil possède et exploite en location de
   * COURTE DURÉE — pas un jeu inventé pour le tableau de bord. C'est le seul pôle
   * où E-Dome perçoit une commission sur un logement (`location-ct`, source
   * `biens`), donc le seul qui produise un revenu COMMISSIONNABLE dérivé.
   */
  readonly ownedPropertyIds: readonly string[];
  /** Formations dont ce profil est l'auteur. */
  readonly ownedFormationIds: readonly string[];
  /**
   * Mandats de VENTE CONCLUS par ce profil (agence, agent immobilier). Ils
   * entrent au journal comme VOLUME D'AFFAIRES (`source: "vente"`,
   * `commissionable: false`), jamais dans le revenu d'E-Dome — la vente
   * immobilière n'est pas facturée (D4, invariant 14). Chacun porte `soldTo`
   * au catalogue (invariant 17) : un bien vendu ne figure plus parmi les biens
   * à vendre. Les mandats ACTIFS ne sont pas ici : ce sont les biens en vente
   * que la personne héberge, sans écriture tant qu'ils ne sont pas vendus.
   */
  readonly agencySalePropertyIds?: readonly string[];
  /**
   * Biens loués en LONGUE DURÉE. Hébergés au catalogue (ils comptent dans
   * « biens »), mais SANS écriture au journal : E-Dome ne commissionne pas le
   * bail (seule la courte durée l'est), et un loyer mensuel multiplié par des
   * « nuits » produirait un montant absurde.
   */
  readonly longTermPropertyIds?: readonly string[];
  /**
   * Prestations vendues sur la marketplace (photographe, home staging,
   * architecte…), une écriture `services` chacune. `clientId` est une personne
   * de l'annuaire : c'est ce qui permet à un avis de prestation de se
   * rattacher à un achat réel (invariant 18).
   */
  readonly serviceSales?: readonly ServiceSale[];
}

export interface ServiceSale {
  /** Identifiant de l'écriture au journal, et sujet des avis de prestation. */
  readonly id: string;
  /** Index du mois dans la fenêtre des douze mois (0 = le plus ancien). */
  readonly monthIndex: number;
  readonly label: string;
  /** Montant facturé, en CHF. */
  readonly amount: number;
  /** Le client, une personne de l'annuaire. */
  readonly clientId: string;
}

/* La table des profils porteurs de montants — chantier P1, « le casting des
   seize ». Une ligne par personne qui gagne quelque chose sur la plateforme ;
   les autres (Ana qui cherche à louer, Bernard qui vend seul, Clémence qui
   cherche à acheter, Aline salariée, Yves et Hélène apporteurs encore sans
   affaire conclue) n'y figurent pas, et l'invariant 15 vérifie qu'ils
   n'affichent alors ni transaction ni revenu.

   L'utilisateur courant reste EN TÊTE : le générateur déterministe
   (`ledger.ts`) tire ses réservations en premier. Chaque profil est une ligne,
   jamais un cas spécial. */
export const PROFILES: readonly Profile[] = [
  /* Léo Martin — bailleur et hôte lausannois. Trois logements en courte durée
     (Verbier, Genève, Sous-Gare), un 4,5 pièces à Renens loué en longue durée
     (Ana est candidate), et sa formation. */
  {
    ownerId: CURRENT_USER_ID,
    ownedPropertyIds: ["prop5", "prop2", "prop9"],
    ownedFormationIds: ["form-001"],
    longTermPropertyIds: ["prop8"],
  },
  /* Céline Bovard — agente immobilière indépendante à Lutry. Un mandat conclu
     (l'appartement de Lutry, vendu à Ennio) → volume d'affaires ; deux mandats
     actifs (Riex, Morges) sans écriture ; un pied-à-terre à Ouchy loué en
     courte durée → son seul revenu commissionnable. */
  {
    ownerId: "user-002",
    ownedPropertyIds: ["prop23"],
    ownedFormationIds: [],
    agencySalePropertyIds: ["prop1"],
  },
  /* Ennio Bordoni — investisseur à Genève. Deux biens en courte durée
     (Montreux, Nyon), deux en longue durée (Prilly, Vevey), un 5 pièces à
     Champel qu'il vend lui-même. Aucun mandat : aucun volume GMV. */
  {
    ownerId: "user-003",
    ownedPropertyIds: ["prop24", "prop25"],
    ownedFormationIds: [],
    longTermPropertyIds: ["prop17", "prop10"],
  },
  /* Jean-Luc Hartmann — directeur de Hartmann Immobilier SA. Un mandat conclu
     (la villa d'Hauterive, achetée par Sandrine), un meublé géré en courte
     durée, un 3,5 pièces loué à l'année. */
  {
    ownerId: "user-015",
    ownedPropertyIds: ["prop26"],
    ownedFormationIds: [],
    agencySalePropertyIds: ["prop27"],
    longTermPropertyIds: ["prop7"],
  },
  /* Mirjana Kovač — hôte à Montreux, deux appartements en courte durée. */
  {
    ownerId: "user-013",
    ownedPropertyIds: ["prop12", "prop6"],
    ownedFormationIds: [],
  },
  /* Amina El Idrissi — créatrice de formations (gestion locative touristique,
     pricing dynamique) et hôte de son riad à Marrakech. */
  {
    ownerId: "user-016",
    ownedPropertyIds: ["prop4"],
    ownedFormationIds: ["form-002", "form-010"],
  },
  /* Sandrine Monnier — créatrice de formations (fiscalité immobilière). */
  {
    ownerId: "user-011",
    ownedPropertyIds: [],
    ownedFormationIds: ["form-007", "form-009"],
  },
  /* Reto Jungo — architecte. Sa formation (rénovation énergétique) et l'étude
     énergétique de l'immeuble neuchâtelois d'Hartmann Immobilier. */
  {
    ownerId: "user-009",
    ownedPropertyIds: [],
    ownedFormationIds: ["form-005"],
    serviceSales: [
      { id: "sv-reto-cecb", monthIndex: 4, label: "CECB Plus et concept de rénovation · Immeuble rue des Parcs, Neuchâtel", amount: 4800, clientId: "user-015" },
    ],
  },
  /* Nikola Ristić — photographe immobilier. Ses reportages : pour Léo, pour
     Céline (deux mises en vente), pour Bernard (sa maison de Pully). */
  {
    ownerId: "user-005",
    ownedPropertyIds: [],
    ownedFormationIds: [],
    serviceSales: [
      { id: "sv-nik-leo", monthIndex: 3, label: "Reportage photo · Studio Sous-Gare, Lausanne", amount: 390, clientId: CURRENT_USER_ID },
      { id: "sv-nik-riex", monthIndex: 7, label: "Photos + drone · Maison vigneronne, Riex", amount: 650, clientId: "user-002" },
      { id: "sv-nik-pully", monthIndex: 9, label: "Photos + drone · Villa, Pully", amount: 590, clientId: "user-007" },
      { id: "sv-nik-morges", monthIndex: 10, label: "Reportage photo + visite 3D · 3,5 pièces, Morges", amount: 480, clientId: "user-002" },
    ],
  },
  /* Elena Currat — home staging. Les mises en vente de Céline. */
  {
    ownerId: "user-010",
    ownedPropertyIds: [],
    ownedFormationIds: [],
    serviceSales: [
      { id: "sv-ele-riex", monthIndex: 7, label: "Home staging · Maison vigneronne, Riex", amount: 2400, clientId: "user-002" },
      { id: "sv-ele-morges", monthIndex: 10, label: "Home staging léger · 3,5 pièces, Morges", amount: 1150, clientId: "user-002" },
    ],
  },
];

/** Les identifiants de tous les profils porteurs de montants. */
export const PROFILE_OWNER_IDS: readonly string[] = PROFILES.map((p) => p.ownerId);

/** L'entrée de l'utilisateur courant dans la table. */
export const CURRENT_PROFILE = PROFILES.find((p) => p.ownerId === CURRENT_USER_ID)!;

/** Compat : les biens de l'utilisateur courant exploités en courte durée. */
export const OWNED_PROPERTY_IDS = CURRENT_PROFILE.ownedPropertyIds;

/** Les biens de l'utilisateur courant loués en longue durée (sans écriture). */
export const LONG_TERM_PROPERTY_IDS: readonly string[] = CURRENT_PROFILE.longTermPropertyIds ?? [];

/** Tous les biens hébergés par l'utilisateur courant : courte + longue durée. */
export const HOSTED_PROPERTY_IDS: readonly string[] = [...OWNED_PROPERTY_IDS, ...LONG_TERM_PROPERTY_IDS];

/** Compat : les formations de l'utilisateur courant, dérivées de la table. */
export const OWNED_FORMATION_IDS = CURRENT_PROFILE.ownedFormationIds;

/**
 * Les faits d'identité, et rien d'autre.
 *
 * Les chiffres d'audience ne s'écrivent plus : abonnés et suivis dérivent du
 * graphe `FOLLOWS` (`social.ts`), le nombre d'avis et la note des avis
 * réellement reçus (calculés dans `mock-data.ts`, qui porte les avis).
 */
export const CURRENT_USER = {
  id: CURRENT_USER_ID,
  firstName: "Léo",
  lastName: "Martin",
  fullName: "Léo Martin",
  initials: "LM",
  email: `leo.martin@${DEMO_EMAIL_DOMAIN}`,
  phone: "+41 79 123 45 67",
  /* Visage synthétique, servi localement (D16) — plus aucun portrait réel. */
  avatar: `/avatars/${CURRENT_USER_ID}.jpg`,
  banner:
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=400&fit=crop",
  city: DEMO_CITY,
  country: DEMO_COUNTRY,
  headline: "Propriétaire à Lausanne · Hôte et bailleur",
  about:
    "J'habite à Sous-Gare, à Lausanne. Je loue trois logements en courte durée " +
    "(Verbier, Genève, Lausanne) et un appartement à l'année à Renens, et je " +
    "gère tout moi-même. J'écris de temps en temps sur ce que j'apprends en " +
    "chemin — rendement réel, charges, fiscalité, relation avec les voyageurs. " +
    "Je recommande volontiers les prestataires avec qui ça se passe bien.",
  /**
   * Rôles de plateforme (`PlatformRole`, étape 4a).
   *
   * `createur` s'ajoute aux trois rôles décidés dans `DECISIONS.md` §4.1, et
   * l'écart mérite d'être justifié : le catalogue fait de cette personne
   * l'auteur de `form-001`, et le tableau de bord doit démontrer sept sources
   * de revenu. Retirer la formation appauvrirait la démonstration ; la garder
   * sans le rôle serait incohérent. Un bailleur qui écrit un cours sur ce
   * qu'il a appris reste un particulier ordinaire — c'est même ce que dit sa
   * présentation.
   */
  roles: ["proprietaire", "hote", "apporteur", "createur"] as const,
  stats: {
    followers: followerCount(CURRENT_USER_ID),
    following: followingCount(CURRENT_USER_ID),
  },
  memberSince: "2025-09-15",
} as const;

/** Nom affichable d'une personne, sans le recomposer à six endroits. */
export function displayName(p: { firstName: string; lastName: string }): string {
  return `${p.firstName} ${p.lastName}`;
}
