import type { PlatformRole } from "@/lib/model/identity";

/* ── Le parcours par rôle ───────────────────────────────────────────────────

   La maquette doit pouvoir se montrer entière en cinq minutes. Le sélecteur de
   rôle est l'outil de cette visite : on choisit « Agence », on atterrit sur
   l'espace agence ; on choisit « Apporteur », sur le tableau des liens. Chaque
   rôle est une porte vers une partie distincte de la plateforme.

   Le rôle sélectionné est un `viewingAs` : ce qu'on VISITE, découplé de ce
   qu'on aurait le droit de faire (un `RoleGrant`, cf. `model/identity.ts`).
   Dans une démonstration, on regarde tous les rôles sans en détenir aucun.

   `role` est un `PlatformRole` — la vérité du modèle, « ce qu'on peut
   faire », onze valeurs. C'est ce que porte `viewingAs` (et, depuis
   l'étape 4a, `activeRole` aussi : plus de pont vers l'ancien `Role`).

   La visite est CURÉE, pas exhaustive : huit portes qui, ensemble, couvrent
   toute la plateforme sans se répéter. `visiteur`, `agent` et `annonceur` du
   modèle n'ont pas d'entrée propre — le premier est l'état par défaut, les
   deux autres se voient à l'intérieur d'« Agence » et de la boutique. */

export interface RoleTour {
  role: PlatformRole;
  label: string;
  /** Une ligne : ce que ce rôle vient faire sur E-Dome. */
  tagline: string;
  /** La porte principale : où l'on atterrit en choisissant ce rôle. */
  href: string;
  /** Nom d'icône lucide, résolu par le composant. */
  icon: string;
  /** Deux ou trois choses à regarder une fois sur place. */
  see: string[];
}

export const roleTour = {
  title: "Visiter en tant que",
  hint: "Changez de rôle pour voir la plateforme de son point de vue. Aucun compte, aucun droit réel — c'est une démonstration.",
  reset: "Revenir à l'accueil",
  roles: [
    {
      role: "particulier",
      label: "Particulier",
      tagline: "Acheter, louer ou réserver un bien.",
      href: "/explorer",
      icon: "Search",
      see: ["La recherche et les filtres", "Une fiche de bien et son analyse", "La réservation courte durée"],
    },
    {
      role: "proprietaire",
      label: "Propriétaire",
      tagline: "Vendre ou louer son bien — 0 CHF à E-Dome.",
      href: "/vendre",
      icon: "KeyRound",
      see: ["Les deux façons de vendre", "Ce que coûte chaque option", "0 CHF à E-Dome, des deux côtés"],
    },
    {
      role: "hote",
      label: "Hôte",
      tagline: "Louer en courte durée et suivre ses revenus.",
      href: "/dashboard",
      icon: "BedDouble",
      see: ["Les revenus par bien et par mois", "Les réservations", "D'où vient chaque franc"],
    },
    {
      role: "agence",
      label: "Agence",
      tagline: "Mandats, équipe, vitrine et abonnement.",
      href: "/agence",
      icon: "Building2",
      see: ["Les demandes de votre secteur", "Les quatre formules d'abonnement", "La page publique de l'agence"],
    },
    {
      role: "prestataire",
      label: "Prestataire",
      tagline: "Proposer un service, recevoir des demandes de devis.",
      href: "/services",
      icon: "Wrench",
      see: ["Le catalogue de services", "Une fiche prestataire", "La demande de devis"],
    },
    {
      role: "createur",
      label: "Créateur",
      tagline: "Publier des formations, animer des lives.",
      href: "/formations",
      icon: "GraduationCap",
      see: ["Le catalogue de formations", "Une fiche et son programme", "La publication d'une formation"],
    },
    {
      role: "apporteur",
      label: "Apporteur",
      tagline: "Recommander par un lien traçable, être rémunéré.",
      href: "/apporteurs",
      icon: "Handshake",
      see: ["Le tableau des liens et des apports", "Comment la part est calculée", "Le classement (exemple)"],
    },
    {
      role: "admin",
      label: "Administration",
      tagline: "Modérer la plateforme.",
      href: "/admin",
      icon: "ShieldCheck",
      see: ["La file de modération", "Les biens à valider", "Les signalements"],
    },
  ] satisfies RoleTour[],
} as const;

/** Le rôle de visite par défaut : un particulier qui découvre. */
export const DEFAULT_VIEWING_AS: PlatformRole = "particulier";

/** Retrouve l'entrée de visite d'un rôle, si elle existe. */
export function tourFor(role: PlatformRole): RoleTour | undefined {
  return roleTour.roles.find((r) => r.role === role);
}
