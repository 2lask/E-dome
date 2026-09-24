/* ── Les mots de la page des tarifs ─────────────────────────────────────────

   La page `/tarifs` est GÉNÉRÉE depuis `src/lib/pricing/catalog.ts` : les prix,
   les paliers et les statuts viennent du module, jamais recopiés. Elle ne peut
   donc pas mentir — si le tarif Vitrine change dans le catalogue, la page
   change avec lui, et l'invariant du modèle interdit qu'un chiffre y diverge.

   Ce fichier ne porte que les MOTS : le nom d'affichage d'une formule, sa
   phrase, et le libellé lisible de chaque fonctionnalité incluse (les clés
   `includes` du catalogue sont des identifiants, pas des phrases). Séparer les
   deux est le point : le module garde les nombres, le contenu garde la langue. */

export const tarifsPage = {
  eyebrow: "Tarifs",
  title: "Un prix pour les professionnels. Rien pour le bien d'un particulier.",
  subtitle:
    "E-Dome gagne sa vie du côté professionnel : les agences s'abonnent aux outils. Publier, chercher, vendre son propre bien reste gratuit.",
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
    tagline: "Être sur la plateforme, se faire connaître, répondre aux messages.",
  },
  vitrine: {
    name: "Vitrine",
    tagline: "Une page publique, des annonces illimitées, les demandes d'accompagnement.",
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
  "biens-3": "Jusqu'à 3 biens publiés",
  reseau: "Accès au réseau et au fil",
  messagerie: "Messagerie",
  // vitrine
  "biens-illimites": "Biens illimités",
  "page-publique": "Page publique d'agence",
  "mise-en-avant-1": "1 mise en avant par mois",
  statistiques: "Statistiques",
  "badge-verifie": "Badge vérifié",
  "demandes-accompagnement": "Demandes d'accompagnement",
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
