import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/* ── ESLint — configuration à deux niveaux ───────────────────────────────────

   Le projet n'avait aucun ESLint jusqu'ici, et Next 16 a supprimé la commande
   `next lint`. Un lint strict appliqué d'un coup à tout le dépôt sortirait
   59 erreurs sur du code déjà en production, ce qui rendrait `npm run lint`
   rouge en permanence — donc inutile.

   Le parti pris est donc :

   - **Code existant** : les règles ci-dessous passent en avertissement. Elles
     restent visibles (`npm run lint` les affiche) mais ne bloquent pas.
   - **Code neuf** (landing, leads, admin, contenu) : tout est erreur, plus
     quelques règles supplémentaires absentes du preset Next.

   Les avertissements ne sont pas du bruit à ignorer : ils recensent une dette
   réelle, notamment 6 violations de `rules-of-hooks` — dont
   `src/app/(app)/formations/[id]/page.tsx`, qui appelle 6 hooks après un
   `return` conditionnel. À traiter, mais pas au détour de la landing.

   Pour promouvoir un fichier existant en strict, il suffit de l'ajouter à
   STRICT_PATHS ci-dessous. */

/** Chemins soumis au niveau strict. Tout code neuf doit y figurer. */
const STRICT_PATHS = [
  "src/content/**/*.{ts,tsx}",
  "src/components/landing/**/*.{ts,tsx}",
  "src/components/analytics/**/*.{ts,tsx}",
  "src/lib/leads/**/*.{ts,tsx}",
  "src/lib/analytics.ts",
  "src/lib/supabase/admin.ts",
  "src/app/page.tsx",
  "src/app/robots.ts",
  "src/app/sitemap.ts",
  "src/app/merci/**/*.{ts,tsx}",
  "src/app/admin/**/*.{ts,tsx}",
  "src/app/api/admin/**/*.{ts,tsx}",
];

/* Règles que le preset Next classe en erreur et que le code existant viole
   déjà. Valeur = nombre d'occurrences au 2026-09-22, pour mesurer la dette. */
const LEGACY_DOWNGRADES = {
  "react-hooks/set-state-in-effect": "warn", // 23
  "react/no-unescaped-entities": "warn", // 12
  "@typescript-eslint/no-explicit-any": "warn", // 6
  "@next/next/no-html-link-for-pages": "warn", // 6
  "react-hooks/rules-of-hooks": "warn", // 6 — vraies violations, cf. ci-dessus
  "react-hooks/preserve-manual-memoization": "warn", // 2
  "react-hooks/purity": "warn", // 2
  "prefer-const": "warn", // 1
  "react/display-name": "warn", // 1
};

/** Les mêmes règles, remises en erreur pour le code neuf. */
const STRICT_UPGRADES = Object.fromEntries(
  Object.keys(LEGACY_DOWNGRADES).map((rule) => [rule, "error"]),
);

export default [
  {
    ignores: [
      ".next/**",
      "_next/**",
      "node_modules/**",
      /* Projet Expo séparé, avec sa propre chaîne d'outils. */
      "mobile/**",
      /* Documents et médias sources, pas du code applicatif. */
      "informations/**",
      "public/**",
      "docs/**",
      "supabase/**",
    ],
  },

  ...coreWebVitals,
  ...nextTypescript,

  /* Niveau 1 — code existant : la dette reste visible sans bloquer. */
  {
    name: "edome/legacy",
    rules: LEGACY_DOWNGRADES,
  },

  /* Niveau 2 — code neuf : rien ne passe. */
  {
    name: "edome/strict",
    files: STRICT_PATHS,
    rules: {
      ...STRICT_UPGRADES,
      /* La landing doit servir des images optimisées (critère du brief) :
         `next/image` obligatoire, contrairement aux 88 `<img>` existants. */
      "@next/next/no-img-element": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "react-hooks/exhaustive-deps": "error",
      /* `console.warn` reste autorisé : le store de leads en développement
         doit pouvoir avertir qu'il écrit dans un fichier local. */
      "no-console": ["error", { allow: ["warn", "error"] }],
      eqeqeq: ["error", "smart"],
    },
  },
];
