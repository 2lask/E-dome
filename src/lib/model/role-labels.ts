import type { PlatformRole, ProviderTrade } from "./identity";

/* ── La table UNIQUE des libellés de rôle ───────────────────────────────────

   Toute l'interface affiche un rôle de personne par ici : badges de profil,
   fil, recherche, réseau, messages, paramètres. Une seule table, donc un seul
   endroit où un mot peut revenir. Un indépendant de la transaction s'affiche
   « Agence » (agence d'une personne) ou « Agent immobilier » (salarié d'une
   agence) — cf. `PlatformRole` pour les rôles volontairement absents.

   Un prestataire s'affiche enrichi de son métier : « Prestataire ·
   Photographe ». Le métier n'est pas un rôle (`ProviderTrade`), mais c'est lui
   qui dit ce que la personne vend. */

export const PLATFORM_ROLE_LABELS: Readonly<Record<PlatformRole, string>> = {
  visiteur: "Visiteur",
  particulier: "Particulier",
  proprietaire: "Propriétaire",
  agent: "Agent immobilier",
  agence: "Agence",
  prestataire: "Prestataire",
  createur: "Créateur de formations",
  hote: "Hôte",
  apporteur: "Apporteur d'affaires",
  annonceur: "Annonceur",
  admin: "Administrateur",
};

export const PROVIDER_TRADE_LABELS: Readonly<Record<ProviderTrade, string>> = {
  photographe: "Photographe",
  "home-staging": "Home staging",
  architecte: "Architecte",
  notaire: "Notaire",
  promoteur: "Promoteur",
  diagnostic: "Diagnostic",
  conciergerie: "Conciergerie",
  demenagement: "Déménagement",
};

/** Couleurs de badge, alignées sur la table des libellés (mêmes clés). */
export const PLATFORM_ROLE_BADGE_COLORS: Readonly<Record<PlatformRole, string>> = {
  visiteur: "bg-gray-500/20 text-gray-400",
  particulier: "bg-gray-500/20 text-gray-400",
  proprietaire: "bg-rose-500/20 text-rose-400",
  agent: "bg-sky-500/20 text-sky-400",
  agence: "bg-blue-500/20 text-blue-400",
  prestataire: "bg-teal-500/20 text-teal-400",
  createur: "bg-orange-500/20 text-orange-400",
  hote: "bg-amber-500/20 text-amber-400",
  apporteur: "bg-emerald-500/20 text-emerald-400",
  annonceur: "bg-purple-500/20 text-purple-400",
  admin: "bg-red-500/20 text-red-400",
};

/**
 * Libellé affichable d'un rôle. Pour `prestataire`, enrichi du (des) métier(s)
 * quand la personne en déclare : « Prestataire · Photographe ».
 */
export function roleLabel(role: PlatformRole, trades?: readonly ProviderTrade[]): string {
  const base = PLATFORM_ROLE_LABELS[role];
  if (role !== "prestataire" || !trades || trades.length === 0) return base;
  return `${base} · ${trades.map((t) => PROVIDER_TRADE_LABELS[t]).join(", ")}`;
}

/** Couleur de badge d'un rôle. */
export function roleBadgeColor(role: PlatformRole): string {
  return PLATFORM_ROLE_BADGE_COLORS[role];
}
