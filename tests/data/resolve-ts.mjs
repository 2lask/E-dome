import { registerHooks } from "node:module";
import { statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

/* ── Résolveur pour `node --test` ───────────────────────────────────────────

   Ces épreuves importent directement les modules du dépôt. Deux choses
   empêchent Node de les charger tel quel, et aucune ne justifie d'ajouter une
   dépendance :

   1. **L'alias `@/`.** Il est déclaré dans `tsconfig.json` et compris par
      Next, pas par Node. On le traduit en chemin réel.
   2. **Les imports sans extension.** `import { x } from "./clock"` est une
      convention TypeScript ; la spécification ESM exige une extension. On
      essaie `.ts`, `.tsx`, puis `/index.ts`.

   Pourquoi pas une dépendance comme `tsx` ou `vitest` : `node --test` et
   `--experimental-strip-types` sont intégrés à Node 24, et ce fichier tient en
   vingt lignes. Une porte de qualité qui n'ajoute rien à installer est une
   porte qu'on ne désactive pas le jour où l'installation casse.

   Attention à un piège : `src/lib/pricing` est un DOSSIER depuis l'étape 1.
   Tester la simple existence ferait résoudre l'import vers un répertoire, que
   Node tente ensuite de lire comme un fichier — d'où `isFile()`. */

const SRC = pathToFileURL(resolve(dirname(fileURLToPath(import.meta.url)), "../../src") + "/").href;

function firstFile(base) {
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`]) {
    try {
      if (statSync(fileURLToPath(candidate)).isFile()) return candidate;
    } catch {
      /* Absent, ou dossier : candidat suivant. */
    }
  }
  return null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const found = firstFile(SRC + specifier.slice(2));
      if (found) return { url: found, shortCircuit: true };
    }
    if (specifier.startsWith(".") && context.parentURL) {
      const found = firstFile(new URL(specifier, context.parentURL).href);
      if (found) return { url: found, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});
