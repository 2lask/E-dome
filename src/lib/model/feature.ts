/* ── Statuts de fonctionnalité ──────────────────────────────────────────────

   La Partie C exige trois statuts visibles : disponible au lancement, prévu
   après, vision plus lointaine. Le vocabulaire existe déjà pour deux d'entre
   eux dans `src/content/landing.ts` (`PoleAvailability`, valeurs `launch` et
   `later`) ; ce module ajoute le troisième sans toucher à la landing, dont le
   contenu est figé.

   Le statut est porté par la **donnée**, pas décidé dans un composant. Sans
   cela, la légende permanente ne tient pas : le gris redeviendrait une
   décision prise quarante-huit fois différemment. */

export type FeatureStage = "launch" | "later" | "vision";

export const FEATURE_STAGES: readonly FeatureStage[] = ["launch", "later", "vision"];

export interface FeatureEntry {
  id: string;
  stage: FeatureStage;
  /**
   * Ce que montre le clic sur une fonctionnalité future.
   *
   * Les quatre questions sont celles de la Partie C, dans cet ordre fixe. La
   * quatrième — comment E-Dome gagne de l'argent dessus — est celle qui
   * intéresse un investisseur, et c'est pour elle que le panneau existe.
   */
  explains: {
    what: string;
    who: string;
    revenue: string;
    when: string;
  };
  /** Ce qui existe déjà à la place, pour que tout élément gris ait un voisin utile. */
  insteadSeeHref?: string;
}

/** `true` si la fonctionnalité est disponible au lancement. */
export const isAvailable = (stage: FeatureStage): boolean => stage === "launch";
