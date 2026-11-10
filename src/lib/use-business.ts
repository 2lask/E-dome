"use client";

import { useMemo } from "react";
import { useSession } from "./use-session";
import { demoAgency } from "@/content/agence";
import { apporteurBook, currentPlanId } from "./demo/affiliation";

/* ── Le modèle économique, branché sur la session (P4a) ──────────────────────

   Une seule clé de titulaire pour l'agence de démonstration : son `slug`.
   `/agence/abonnement` écrit `plan.changed` ; `/agence/demandes`,
   `/agence/equipe`, `/agence/mandats` et `/agence/statistiques` relisent la
   formule ICI — une formule changée se voit partout. */

export const AGENCY_HOLDER_ID = demoAgency.slug;

/** La formule en vigueur de l'agence de démonstration. */
export function useAgencyPlan(): string {
  const { state } = useSession();
  return useMemo(() => currentPlanId(state, AGENCY_HOLDER_ID, demoAgency.plan), [state]);
}

/** LE carnet d'apports de la personne incarnée — la source unique de
    `/apporteurs` ET de `/dashboard/apporteurs`. */
export function useApporteurBook() {
  const { state, actorId } = useSession();
  return useMemo(() => apporteurBook(state, actorId), [state, actorId]);
}
