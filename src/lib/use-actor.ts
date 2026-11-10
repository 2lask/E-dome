"use client";

import { useMemo } from "react";
import { useApp } from "./context";
import { useSession } from "./use-session";
import { actorSummary, navFor, type ActorSummary } from "./demo/actors";
import { CURRENT_USER_ID } from "./demo/identity";
import { requirePerson } from "./demo/directory";
import { getMockProfile } from "./profile-data";
import type { Profile } from "./profile-types";
import type { User } from "./types";

/* ── La personne incarnée, pour les composants (chantier P3) ────────────────

   L'acteur vit dans la mémoire de session (`use-session.ts`) : Léo au rendu
   serveur et pendant l'hydratation, puis la personne mémorisée. Ce hook en
   donne tout ce qu'un écran affiche — nom, photo, une ligne de présentation,
   sa navigation, sa fiche d'annuaire et son profil complet. */

export interface Actor extends ActorSummary {
  /** Vrai si l'on est Léo, l'utilisateur de démonstration par défaut. */
  isDefault: boolean;
  /** La fiche d'annuaire (auteur d'un post, d'un commentaire…). */
  user: User;
}

export function useActor(): Actor {
  const { actorId } = useSession();
  return useMemo(
    () => ({ ...actorSummary(actorId), isDefault: actorId === CURRENT_USER_ID, user: requirePerson(actorId) }),
    [actorId],
  );
}

/** « Mon espace » de la personne incarnée. */
export function useActorNav() {
  const { actorId } = useSession();
  return useMemo(() => navFor(actorId), [actorId]);
}

/** Le profil complet de la personne incarnée. Pour Léo, c'est le profil
    éditable du contexte (persisté) ; pour les autres, leur fiche publique —
    la même que /profil/[id], lue de l'annuaire. */
export function useActorProfile(): { profile: Profile; editable: boolean } {
  const { actorId } = useSession();
  const { profile } = useApp();
  return useMemo(() => {
    if (actorId === CURRENT_USER_ID) return { profile, editable: true };
    return { profile: getMockProfile(actorId) ?? profile, editable: false };
  }, [actorId, profile]);
}
