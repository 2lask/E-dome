"use client";

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { ProfileId } from "@/content/landing";
import { ANCHORS } from "./anchors";

/* ── Liaison « C'est moi » → formulaire ──────────────────────────────────────

   Les boutons de la section « Pour qui » doivent descendre au formulaire ET y
   présélectionner le profil correspondant. Trois approches étaient possibles :
   un paramètre d'URL, un évènement sur `window`, ou ce contexte.

   Le contexte est retenu parce qu'il évite de faire naviguer la page (donc
   pas de rechargement ni d'historique pollué) et parce qu'un paramètre d'URL
   lu par `useSearchParams` forcerait tout le sous-arbre du formulaire à sortir
   du prérendu statique.

   Le fournisseur reçoit `children` : les sections qui ne sont pas
   interactives restent donc rendues côté serveur en traversant cette
   frontière client. Même mécanisme que `AppShell` pour le groupe (app). */

interface ProfileSelectionValue {
  /** Profil choisi via un bouton « C'est moi », sinon `null`. */
  selected: ProfileId | null;
  /** Sélectionne un profil et fait défiler jusqu'au formulaire. */
  select: (profile: ProfileId) => void;
  /**
   * S'incrémente à chaque `select`. Le formulaire s'en sert pour déplacer le
   * focus, y compris quand l'utilisateur reclique sur le même profil — un
   * simple changement de `selected` ne le déclencherait pas.
   */
  jumpToken: number;
}

const ProfileSelectionContext = createContext<ProfileSelectionValue | null>(null);

export function ProfileSelectionProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<ProfileId | null>(null);
  const [jumpToken, setJumpToken] = useState(0);
  /* Évite de relancer un défilement si l'utilisateur martèle le bouton. */
  const scrolling = useRef(false);

  const select = useCallback((profile: ProfileId) => {
    setSelected(profile);
    setJumpToken((n) => n + 1);

    if (typeof document === "undefined" || scrolling.current) return;

    const target = document.getElementById(ANCHORS.form);
    if (!target) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrolling.current = true;
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    window.setTimeout(() => {
      scrolling.current = false;
    }, 600);
  }, []);

  const value = useMemo(() => ({ selected, select, jumpToken }), [selected, select, jumpToken]);

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
