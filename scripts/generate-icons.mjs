import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/* ── Génération des icônes de l'application ─────────────────────────────────

   `npm run icons`. À relancer uniquement quand l'illustration source change.

   L'illustration maîtresse est `public/icons/icon.svg`. Tout le reste en
   dérive. Avant ce script, `public/icons/` contenait un seul fichier,
   littéralement nommé `icon-${size}x${size}.svg` : un gabarit de chaîne écrit
   sur le disque au lieu d'être développé. Les onze entrées du manifeste
   pointaient donc vers des fichiers inexistants, et l'application installée
   sur un téléphone affichait l'icône par défaut du navigateur.

   AUCUNE DÉPENDANCE AJOUTÉE. `sharp` est déjà dans l'arbre — c'est Next 16 qui
   l'installe pour l'optimisation d'images (`npm ls sharp` le montre). On
   emprunte donc un outil déjà présent plutôt que d'en installer un.

   Pourquoi des PNG et pas le SVG partout : Safari refuse le SVG pour
   `apple-touch-icon`, et c'est précisément l'écran d'accueil d'un iPhone qu'on
   veut servir. Le SVG reste utilisé là où il est accepté — l'onglet du
   navigateur, via `src/app/icon.svg` — parce qu'il y est plus net et plus
   léger que n'importe quel PNG.

   ATTENTION À LA REPRODUCTIBILITÉ. Le SVG source écrit son texte en
   `system-ui, sans-serif`. La police réellement choisie dépend donc de la
   machine qui rastérise. Les PNG produits ici sont versionnés : ils sont le
   livrable, pas un artefact de construction. Relancer ce script sur une autre
   machine peut changer la typographie des icônes — c'est voulu que ce soit
   visible plutôt que silencieux. Pour rendre le rendu indépendant de la
   machine, il faudrait convertir les deux `<text>` du SVG en tracés. */

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = resolve(ROOT, "public/icons/icon.svg");

/* On rastérise une seule fois en grand, puis on réduit. Réduire un grand
   rendu donne un résultat plus net que rastériser directement en petit : le
   ré-échantillonnage de sharp (Lanczos 3) moyenne les détails au lieu de les
   faire disparaître. */
const MASTER = 1024;

/* Les tailles réellement consommées, et par qui. Le manifeste en déclarait
   huit ; cinq ne servaient rien. Android/Chrome utilise 192 (icône) et 512
   (écran de démarrage), et 96 pour les raccourcis longue-pression. iOS lit
   uniquement `apple-touch-icon`, en 180. */
const TARGETS = [
  { path: "public/icons/icon-96x96.png", size: 96, why: "raccourcis du manifeste (Android)" },
  { path: "public/icons/icon-192x192.png", size: 192, why: "icône d'installation (Android)" },
  { path: "public/icons/icon-512x512.png", size: 512, why: "écran de démarrage (Android)" },
  { path: "src/app/apple-icon.png", size: 180, why: "écran d'accueil iOS, via la convention Next" },
];

const svg = await readFile(SOURCE);
const master = await sharp(svg, { density: 300 })
  .resize(MASTER, MASTER, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

for (const { path, size, why } of TARGETS) {
  const out = await sharp(master).resize(size, size).png({ compressionLevel: 9 }).toBuffer();
  await writeFile(resolve(ROOT, path), out);
  console.log(`${String(size).padStart(4)}px  ${path.padEnd(34)} ${(out.length / 1024).toFixed(1)} Ko   ${why}`);
}

console.log(`\n${TARGETS.length} icônes écrites depuis ${SOURCE.slice(ROOT.length + 1)}.`);
