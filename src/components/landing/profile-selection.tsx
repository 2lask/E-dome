"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ProfileId } from "@/content/landing";
import { ANCHORS } from "./anchors";

/* ── Profil choisi : source unique ──────────────────────────────────────────

   Le profil est piloté à deux endroits — les boutons « C'est moi » de la
   section « Pour qui » et la liste déroulante du formulaire. Il vit donc ici
   plutôt que dans le formulaire.

   Première version de ce fichier : le formulaire gardait son propre état et le
   synchronisait depuis le contexte dans un `useEffect`. Le lint a refusé, à
   juste titre — appeler `setState` dans le corps d'un effet provoque des
   rendus en cascade, et c'est précisément la règle que le code existant viole
   23 fois. Remonter l'état supprime l'effet au lieu de le contourner.

   `select()` fait défiler et déplace le focus. Ces deux gestes ont lieu dans
   un gestionnaire d'évènement, pas dans un effet : rien à synchroniser.

   Le fournisseur reçoit `children`, donc les sections non interactives
   restent rendues côté serveur en traversant cette frontière client — même
   mécanisme que `AppShell` pour le groupe (app). */

/** Identifiant du titre du formulaire, cible du focus après un « C'est moi ». */
export const FORM_HEADING_ID = "interest-form-heading";

interface ProfileSelectionValue {
  /** Profil courant, chaîne vide si aucun choix n'a encore été fait. */
  profile: ProfileId | "";
  /** Change le profil sans bouger la page (liste déroulante du formulaire). */
  setProfile: (profile: ProfileId | "") => void;
  /** Change le profil, descend au formulaire et y place le focus. */
  select: (profile: ProfileId) => void;
}

const ProfileSelectionContext = createContext<ProfileSelectionValue | null>(null);

export function ProfileSelectionProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileId | "">("");

  const select = useCallback((next: ProfileId) => {
    setProfile(next);

    if (typeof document === "undefined") return;

    const target = document.getElementById(ANCHORS.form);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });

    /* Le focus suit le défilement : sans cela, la tabulation repartirait du
       bouton « C'est moi », loin au-dessus du formulaire. Le titre porte
       `tabIndex={-1}` pour pouvoir le recevoir. */
    document.getElementById(FORM_HEADING_ID)?.focus({ preventScroll: true });
  }, []);

  const value = useMemo(() => ({ profile, setProfile, select }), [profile, select]);

  return (
    <ProfileSelectionContext.Provider value={value}>{children}</ProfileSelectionContext.Provider>
  );
}

export function useProfileSelection(): ProfileSelectionValue {
  const ctx = useContext(ProfileSelectionContext);
  if (!ctx) {
    throw new Error("useProfileSelection doit être utilisé dans ProfileSelectionProvider.");
  }
  return ctx;
}
