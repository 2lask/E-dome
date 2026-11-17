"use client";

import React from "react";
import {
  Building2,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { HubTabs, type HubTab } from "./hub-tabs";

/* Onglets du hub Explorer.
   Chaque onglet pointe vers la route existante du pôle. Les pages
   conservent leur recherche/filtres/tri propres ; ces onglets
   ajoutent simplement la navigation inter-pôles en haut.

   V1 « E-Dome Pro » (STRATEGIE.md / PLAN-V1.md, chantier C1) : le hub ne met
   plus en avant les pôles parqués (boutique, lives, événements). Les routes
   existent toujours — rien n'est supprimé — elles ne sont simplement plus
   présentées comme des pôles de premier plan. Biens reste le cœur ; Services
   et Formations restent atteignables (différés, V2/V3). */

const EXPLORER_TABS: HubTab[] = [
  { key: "biens", label: "Biens", href: "/explorer", icon: Building2, matchPrefix: false },
  { key: "services", label: "Services", href: "/services", icon: Briefcase },
  { key: "formations", label: "Formations", href: "/formations", icon: GraduationCap },
];

export function ExplorerTabs() {
  return <HubTabs tabs={EXPLORER_TABS} ariaLabel="Onglets Explorer" />;
}
