"use client";

import React from "react";
import {
  Building2,
  ShoppingBag,
  Briefcase,
  GraduationCap,
  Video,
  CalendarDays,
} from "lucide-react";
import { HubTabs, type HubTab } from "./hub-tabs";

/* Onglets du hub Explorer.
   Chaque onglet pointe vers la route existante du pôle. Les pages
   conservent leur recherche/filtres/tri propres ; ces onglets
   ajoutent simplement la navigation inter-pôles en haut. */

const EXPLORER_TABS: HubTab[] = [
  { key: "biens", label: "Biens", href: "/explorer", icon: Building2, matchPrefix: false },
  { key: "boutique", label: "Boutique", href: "/boutique", icon: ShoppingBag },
  { key: "services", label: "Services", href: "/services", icon: Briefcase },
  { key: "formations", label: "Formations", href: "/formations", icon: GraduationCap },
  { key: "lives", label: "Lives", href: "/live", icon: Video },
  { key: "evenements", label: "Événements", href: "/evenements", icon: CalendarDays },
];

export function ExplorerTabs() {
  return <HubTabs tabs={EXPLORER_TABS} ariaLabel="Onglets Explorer" />;
}
