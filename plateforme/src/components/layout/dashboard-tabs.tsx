"use client";

import React from "react";
import {
  LayoutDashboard,
  BarChart3,
  Calendar,
  Package,
  Users,
  Heart,
} from "lucide-react";
import { HubTabs, type HubTab } from "./hub-tabs";

/* Onglets du hub Dashboard.
   Chaque onglet pointe vers la route existante. /dashboard reste
   la vue d'ensemble ; /statistiques, /reservations, /apporteurs,
   /favoris conservent leur contenu ; /dashboard/annonces est une
   nouvelle vue agrégée pour "Mes annonces & produits". */

const DASHBOARD_TABS: HubTab[] = [
  { key: "overview", label: "Vue d'ensemble", href: "/dashboard", icon: LayoutDashboard, matchPrefix: false },
  { key: "stats", label: "Revenus & stats", href: "/statistiques", icon: BarChart3 },
  { key: "reservations", label: "Réservations", href: "/reservations", icon: Calendar },
  { key: "annonces", label: "Mes annonces & produits", href: "/dashboard/annonces", icon: Package },
  { key: "apporteurs", label: "Apporteurs", href: "/apporteurs", icon: Users },
  { key: "favoris", label: "Favoris", href: "/favoris", icon: Heart },
];

export function DashboardTabs() {
  return <HubTabs tabs={DASHBOARD_TABS} ariaLabel="Onglets Dashboard" />;
}
