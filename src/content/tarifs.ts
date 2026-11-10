/* ── Les mots de la page des tarifs ─────────────────────────────────────────

   La page `/tarifs` est GÉNÉRÉE depuis `src/lib/pricing/catalog.ts` : les prix,
   les paliers et les statuts viennent du module, jamais recopiés. Elle ne peut
   donc pas mentir — si le tarif Vitrine change dans le catalogue, la page
   change avec lui, et l'invariant du modèle interdit qu'un chiffre y diverge.

   Ce fichier ne porte que les MOTS : le nom d'affichage d'une formule, sa
   phrase, et le libellé lisible de chaque fonctionnalité incluse (les clés
   `includes` du catalogue sont des identifiants, pas des phrases). Séparer les
   deux est le point : le module garde les nombres, le contenu garde la langue.

   FREEMIUM (D15) : les plafonds gratuits et le quota d'accompagnement ne sont
   PAS écrits ici — les phrases les lisent dans `FREE_LIMITS` (catalog.ts), si
   bien qu'ajuster un plafond dans le catalogue réécrit la page. */

import { FREE_LIMITS, type FreemiumRole } from "@/lib/pricing/catalog";

const L = FREE_LIMITS;

export const tarifsPage = {
  eyebrow: "Tarifs",
  title: "Gratuit pour démarrer et vraiment travailler. Payant quand vous grandissez.",
  subtitle:
    "Tout le monde utilise E-Dome gratuitement — particuliers, propriétaires, agents, agences. Le payant, c'est aller plus loin : volume, équipe, visibilité, statistiques complètes. Vendre son propre bien reste gratuit, sans exception.",
  rolesTitle: "Ce qui est gratuit, et ce qui passe payant, rôle par rôle",
  freeLabel: "Gratuit",
  paidLabel: "Passe payant",
  plansLabel: "Formules",
  proLaterName: "Pro",
  proLaterPrice: "Prix à fixer",
  proLaterNote: "Formule prévue, pas encore chiffrée : aucun prix n'est annoncé avant validation.",
  limitsNote: "Les plafonds gratuits sont des valeurs de catalogue, ajustées après nos entretiens avec les agences.",
  affiliationLine:
    "Programme apporteurs : une prime fixe en francs sur les biens, un pourcentage sur la marketplace, une part des abonnements apportés.",
  affiliationCta: "Voir l'espace apporteur",
  billingMonthly: "par mois",
  billingYearly: "par an",
  yearlyHint: "deux mois offerts",
  agencyTitle: "Pour les agences",
  ownerTitle: "Pour les propriétaires particuliers",
  free: "Gratuit",
  ctaLaunch: "Choisir cette formule",
  ctaLater: "Bientôt disponible",
  footnote:
    "Prix affichés à titre indicatif, en cours de validation. Toutes les formules sont sans engagement et résiliables au mois.",
} as const;

/** Nom d'affichage et phrase d'une formule, par identifiant de `PLANS`. */
export const PLAN_META: Record<string, { name: string; tagline: string }> = {
  presence: {
    name: "Présence",
    tagline: `Gratuite et plafonnée : jusqu'à ${L.agence.activeListings} biens actifs, ${L.agence.seats} utilisateur, de quoi vraiment travailler.`,
  },
  vitrine: {
    name: "Vitrine",
    tagline: "Visibilité et volume : biens illimités, page publique, candidatures illimitées, mise en avant.",
  },
  mandats: {
    name: "Mandats",
    tagline: "L'équipe, les mandats, l'agenda des visites, le suivi des commissions.",
  },
  regie: {
    name: "Régie",
    tagline: "Multi-entités, import de flux, comptabilité, SLA et accord de traitement.",
  },
  patrimoine: {
    name: "Patrimoine",
    tagline: "Suivre ses biens, ses baux et ses rendements — pour qui possède, pas pour qui vend.",
  },
};

/** Libellé lisible d'une fonctionnalité incluse, par clé `includes`. */
export const FEATURE_LABEL: Record<string, string> = {
  // presence
  "profil-pro": "Profil professionnel",
  "biens-plafond": `Jusqu'à ${L.agence.activeListings} biens actifs`,
  "utilisateur-1": `${L.agence.seats} utilisateur`,
  "candidatures-quota": `${L.agence.activeApplications} candidatures d'accompagnement actives à la fois`,
  "statistiques-base": "Statistiques de base (vues, demandes)",
  reseau: "Accès au réseau et au fil",
  messagerie: "Messagerie",
  // vitrine
  "biens-illimites": "Biens illimités",
  "page-publique": "Page publique d'agence",
  "mise-en-avant-1": "1 mise en avant par mois",
  statistiques: "Statistiques",
  "badge-verifie": "Badge vérifié",
  "demandes-accompagnement": "Candidatures d'accompagnement illimitées",
  // mandats
  "sous-domaine": "Sous-domaine personnalisé",
  "equipe-droits": "Équipe et droits",
  attribution: "Attribution des demandes",
  mandats: "Gestion des mandats",
  "agenda-visites": "Agenda des visites",
  "suivi-commissions": "Suivi des commissions",
  "mise-en-avant-4": "4 mises en avant par mois",
  "statistiques-completes": "Statistiques complètes",
  export: "Export des données",
  // regie
  "multi-entites": "Multi-entités",
  "import-flux": "Import de flux",
  "roles-fins": "Rôles fins",
  comptabilite: "Comptabilité",
  sla: "SLA",
  dpa: "Accord de traitement des données",
  // patrimoine
  "suivi-biens": "Suivi de ses biens",
  "baux-echeances": "Baux et échéances",
  "charges-decompte": "Charges et décomptes",
  "rendement-reel": "Rendement réel",
  "statistiques-annonces": "Statistiques d'annonces",
  "alertes-marche": "Alertes de marché",
  "ia-incluse": "Assistant IA inclus",
  "export-fiduciaire": "Export pour la fiduciaire",
};

/** Nom lisible d'un rôle du découpage freemium. */
export const FREEMIUM_ROLE_LABEL: Record<FreemiumRole, string> = {
  particulier: "Particulier",
  proprietaire: "Propriétaire",
  agent: "Agent indépendant",
  agence: "Agence",
  prestataire: "Prestataire",
  createur: "Créateur",
  hote: "Hôte",
};

/** Pour chaque rôle : ce qui est gratuit, ce qui passe payant. Chiffres lus dans `FREE_LIMITS`. */
export const FREEMIUM_COPY: Record<FreemiumRole, { free: string[]; paid: string[] }> = {
  particulier: {
    free: ["Tout : chercher, contacter, réserver, alertes, simulateur, avis."],
    paid: ["Rien, et ça ne changera pas."],
  },
  proprietaire: {
    free: [
      "Vendre ou louer sans plafond de biens, 0 CHF à E-Dome sur la transaction.",
      `Suivi de ${L.proprietaire.rentedPropertiesFree} bien loué.`,
    ],
    paid: [`Patrimoine dès le ${L.proprietaire.rentedPropertiesFree + 1}e bien loué : baux, charges, rendement réel, export fiduciaire.`],
  },
  agent: {
    free: [`Jusqu'à ${L.agent.activeListings} biens actifs.`, `${L.agent.activeApplications} candidatures d'accompagnement actives à la fois.`, "Profil pro, messagerie."],
    paid: [`Vitrine dès le ${L.agent.activeListings + 1}e bien : biens illimités, candidatures illimitées, mise en avant, badge vérifié.`],
  },
  agence: {
    free: [
      `Présence : jusqu'à ${L.agence.activeListings} biens actifs, ${L.agence.seats} utilisateur.`,
      `${L.agence.activeApplications} candidatures d'accompagnement actives à la fois.`,
      "Statistiques de base, messagerie, réseau.",
    ],
    paid: [
      `Vitrine dès le ${L.agence.activeListings + 1}e bien ou pour candidater sans limite.`,
      `Mandats dès le ${L.agence.seats + 1}e utilisateur : équipe et droits, mandats, statistiques complètes.`,
    ],
  },
  prestataire: {
    free: [`Jusqu'à ${L.prestataire.activeServices} fiches de service actives.`, "Devis illimités. E-Dome se rémunère par la commission sur ce qui se vend."],
    paid: [`Dès la ${L.prestataire.activeServices + 1}e fiche : fiches illimitées, mise en avant, statistiques.`],
  },
  createur: {
    free: [`Jusqu'à ${L.createur.activeFormations} formations actives.`, "Lives illimités."],
    paid: [`Dès la ${L.createur.activeFormations + 1}e formation : catalogue illimité, mise en avant, automatisations.`],
  },
  hote: {
    free: [`Jusqu'à ${L.hote.activeShortStays} biens en courte durée actifs.`, "Calendrier, messagerie, réservations."],
    paid: [`Dès le ${L.hote.activeShortStays + 1}e bien : biens illimités, synchronisation des calendriers, automatisations.`],
  },
};
