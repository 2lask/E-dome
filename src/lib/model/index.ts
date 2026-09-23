/* Modèle de domaine E-Dome — point d'import unique.

   `import { PlatformRole, PLATFORM_RULES } from "@/lib/model"`

   Ce module ne remplace pas encore `src/lib/types.ts`, qui porte les types de
   la maquette (Property, User, Formation, SocialPost…). Les deux cohabitent
   volontairement : migrer les pages se fait à l'étape 4, quand elles changent
   de toute façon pour le sélecteur de rôle. `LEGACY_ROLE_TO_PLATFORM` rend
   cette migration mécanique le moment venu. */

export * from "./identity";
export * from "./agency";
export * from "./billing";
export * from "./compliance";
export * from "./feature";
export * from "./rules";
