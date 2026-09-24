import type { FeatureStage } from "./feature";

/* ── La couleur et le mot d'un statut, décidés à un seul endroit ─────────────

   Le statut d'une fonctionnalité (`FeatureStage`) se lit partout de la même
   façon : la pastille verte veut dire « au lancement », le gris « ensuite », le
   gris clair « vision ». Sans ce module, chaque écran choisissait sa nuance, et
   le gris redevenait une décision prise quarante-huit fois différemment.

   Les gris viennent de jetons de thème (`--stage-later`, `--stage-vision`)
   pour tenir en clair comme en sombre ; le vert est direct, il n'a pas besoin
   d'osciller. « Au lancement » n'a donc pas de jeton dédié, c'est voulu. */

export const STAGE_DOT: Record<FeatureStage, string> = {
  launch: "bg-emerald-500",
  later: "bg-[var(--stage-later)]",
  vision: "bg-[var(--stage-vision)]",
};

/** Le texte d'un pôle : plein s'il est ouvert, atténué s'il vient plus tard. */
export const STAGE_TEXT: Record<FeatureStage, string> = {
  launch: "text-[var(--foreground)]",
  later: "text-[var(--text-muted)]",
  vision: "text-[var(--text-muted)]",
};

export const STAGE_LABEL: Record<FeatureStage, string> = {
  launch: "Au lancement",
  later: "Ensuite",
  vision: "Vision",
};

export const STAGE_HINT: Record<FeatureStage, string> = {
  launch: "Utilisable dès l'ouverture.",
  later: "Prévu, construit après le lancement.",
  vision: "Cap plus lointain, pas encore daté.",
};

/** L'ordre d'affichage de la légende. */
export const STAGE_ORDER: readonly FeatureStage[] = ["launch", "later", "vision"];
