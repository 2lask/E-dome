"use client";

import { useMemo } from "react";
import { getFormationById } from "@/lib/mock-data";
import { isSessionId } from "@/lib/demo/session-views";
import { formationProgress, type FormationProgress } from "@/lib/demo/lessons";
import type { Formation } from "@/lib/types";
import { useSession } from "@/lib/use-session";

/** Résout une formation (catalogue, ou publiée pendant la session) et la
    progression de la personne incarnée. `loading` tant que la session n'est
    pas relue pour un id de session. */
export function useFormation(id: string): {
  formation: Formation | undefined;
  loading: boolean;
  progress: FormationProgress | undefined;
  actorId: string;
  hydrated: boolean;
} {
  const { formations: published, hydrated, state, actorId } = useSession();
  const formation = useMemo(
    () => (isSessionId(id) ? published.find((f) => f.id === id) : getFormationById(id)),
    [id, published],
  );
  const progress = useMemo(() => (formation ? formationProgress(state, actorId, formation) : undefined), [formation, state, actorId]);
  return { formation, loading: !formation && isSessionId(id) && !hydrated, progress, actorId, hydrated };
}
