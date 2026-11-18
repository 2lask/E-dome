"use client";

import { useMemo } from "react";
import { useApp } from "./context";
import { useSession } from "./use-session";
import { actorSummary, navFor, type ActorSummary, type ActorNavItem } from "./demo/actors";
import { CURRENT_USER_ID } from "./demo/identity";
import { requirePerson } from "./demo/directory";
import { getMockProfile } from "./profile-data";
import type { Profile } from "./profile-types";
import type { User } from "./types";
import type { PlatformRole } from "./model/identity";
import type { SessionUser } from "./session-user";
import { initialsAvatar } from "./current-user-profile";

/* ── L'identité affichée par l'app ──────────────────────────────────────────

   DEUX sources, dans cet ordre de priorité :

   1. La personne RÉELLEMENT connectée (`currentUser`, chantier C3) : dès qu'on
      est connecté, c'est SOI qui s'affiche partout — nom, avatar, rôles — et
      plus une personne de démonstration.
   2. Sinon, la personne incarnée de la démonstration (chantier P3), qui vit
      dans la mémoire de session (`use-session.ts`).

   Ce hook donne tout ce qu'un écran affiche : nom, photo, une ligne de
   présentation, sa navigation, sa fiche d'annuaire. */

export interface Actor extends ActorSummary {
  /** Vrai si l'on est la personne de démonstration par défaut (jamais pour un
      vrai compte connecté). */
  isDefault: boolean;
  /** La fiche (auteur d'un post, d'un commentaire…). */
  user: User;
}

/** Construit l'acteur à partir du vrai compte connecté. Aucune donnée fictive. */
function actorFromCurrentUser(u: SessionUser): Actor {
  const name = `${u.firstName} ${u.lastName}`.trim() || u.email || "Mon compte";
  const initials = `${u.firstName[0] ?? ""}${u.lastName[0] ?? ""}`.toUpperCase() || "ME";
  const avatar = u.avatar || initialsAvatar(u.firstName, u.lastName);
  const roles = (u.roles.length ? u.roles : ["particulier"]) as PlatformRole[];
  const activeRole = (u.activeRole || "particulier") as PlatformRole;
  const city = u.city ?? "";

  const summary: ActorSummary = {
    id: u.id,
    firstName: u.firstName || name,
    name,
    initials,
    avatar,
    city,
    roles,
    activeRole,
    group: "particuliers",
    as: "membre",
    line: city ? `Membre · ${city}` : "Membre E-Dome",
    legend: city ? `membre à ${city}` : "membre E-Dome",
    cta: { label: "Publier un bien", href: "/publier" },
  };

  const user: User = {
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email ?? "",
    avatar,
    city,
    country: u.country,
    roles,
    activeRole,
    trades: u.trades as User["trades"],
    interests: u.interests as User["interests"],
    /* Un vrai compte démarre vide : aucun chiffre inventé. */
    stats: { followers: 0, following: 0, properties: 0, reviews: 0, rating: 0, transactions: 0, revenue: 0 },
    bio: u.bio ?? "",
  };

  return { ...summary, isDefault: false, user };
}

export function useActor(): Actor {
  const { actorId } = useSession();
  const { currentUser } = useApp();
  return useMemo(() => {
    if (currentUser) return actorFromCurrentUser(currentUser);
    return { ...actorSummary(actorId), isDefault: actorId === CURRENT_USER_ID, user: requirePerson(actorId) };
  }, [actorId, currentUser]);
}

/** « Mon espace » : la navigation selon les rôles — de la personne connectée si
    elle existe, sinon de la personne incarnée. */
export function useActorNav(): ActorNavItem[] {
  const { actorId } = useSession();
  const { currentUser } = useApp();
  return useMemo(() => {
    if (currentUser) {
      const has = (r: string) => currentUser.roles.includes(r);
      const items: ActorNavItem[] = [
        { key: "dashboard", label: "Tableau de bord", href: "/dashboard", icon: "dashboard" },
      ];
      if (has("apporteur")) items.push({ key: "apporteurs", label: "Espace apporteur", href: "/apporteurs", icon: "referral" });
      if (has("createur")) items.push({ key: "formations", label: "Mes formations", href: "/dashboard/annonces#formations", icon: "formations" });
      if (has("prestataire")) items.push({ key: "services", label: "Mes prestations", href: "/dashboard/annonces#prestations", icon: "services" });
      items.push({ key: "favoris", label: "Favoris", href: "/favoris", icon: "favorites" });
      items.push({ key: "profil", label: "Profil", href: "/profil", icon: "profile" });
      return items;
    }
    return navFor(actorId);
  }, [actorId, currentUser]);
}

/** Le profil complet de la personne incarnée (démo). Pour un vrai compte
    connecté, la vraie fiche en base viendra à l'étape suivante ; d'ici là on
    garde le profil éditable du contexte. */
export function useActorProfile(): { profile: Profile; editable: boolean } {
  const { actorId } = useSession();
  const { profile } = useApp();
  return useMemo(() => {
    if (actorId === CURRENT_USER_ID) return { profile, editable: true };
    return { profile: getMockProfile(actorId) ?? profile, editable: false };
  }, [actorId, profile]);
}
