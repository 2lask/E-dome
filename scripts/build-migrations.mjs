/* Regroupe supabase/migrations/*.sql (dans l'ordre) en UN fichier à coller
   dans Supabase → SQL Editor : supabase/APPLIQUER-TOUT.sql.
   Toutes les migrations sont idempotentes : le fichier peut être rejoué. */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const dir = "supabase/migrations";
const files = readdirSync(dir).filter((f) => /^\d{3}_.+\.sql$/.test(f)).sort();
const header = `-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  E-DOME — TOUTES LES MIGRATIONS EN UN SEUL FICHIER                        ║
-- ╠══════════════════════════════════════════════════════════════════════════╣
-- ║  1. Supabase → SQL Editor → New query                                     ║
-- ║  2. Coller TOUT ce fichier → Run                                          ║
-- ║  3. Vérifier : npm run db:check                                           ║
-- ║  Idempotent : peut être rejoué sans risque. Fichier GÉNÉRÉ par            ║
-- ║  scripts/build-migrations.mjs — modifier les migrations, pas ce fichier.  ║
-- ╚══════════════════════════════════════════════════════════════════════════╝
-- Contenu : ${files.join(", ")}
`;
const body = files.map((f) => `\n-- ════════ ${f} ════════\n${readFileSync(`${dir}/${f}`, "utf8").trim()}\n`).join("");
writeFileSync("supabase/APPLIQUER-TOUT.sql", header + body);
console.log(`supabase/APPLIQUER-TOUT.sql : ${files.length} migrations regroupées.`);
