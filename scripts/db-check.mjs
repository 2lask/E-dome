/* Vérifie quelles tables des migrations existent dans la base Supabase.
   Lit .env.local ; n'affiche JAMAIS de clé — seulement OK / MANQUE. */
import { readFileSync, existsSync } from "node:fs";

const env = { ...process.env };
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in env)) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.log("NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY absente de .env.local.");
  process.exit(1);
}

const CHECKS = [
  ["002", "Demandes", ["inquiries", "inquiry_events", "introduction_contacts"]],
  ["004", "Recherches à récompense", ["searches", "search_answers", "search_answer_contacts"]],
  ["005", "Dossier de location", ["rental_dossiers", "dossier_documents", "dossier_shares"]],
  ["006", "Espace agence", ["agencies"]],
  ["007", "Déménagement", ["move_requests"]],
  ["008", "Règlements", ["settlements", "payout_profiles"]],
  ["009", "Apport v2 (liens tracés, suivi temps réel)", ["apport_links", "property_events"]],
];

async function exists(table) {
  const res = await fetch(`${url}/rest/v1/${table}?select=*&limit=0`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, "User-Agent": "edome-db-check" },
  });
  return res.ok;
}

let missing = 0;
for (const [num, label, tables] of CHECKS) {
  const results = await Promise.all(tables.map(exists));
  const ok = results.every(Boolean);
  if (!ok) missing++;
  const detail = ok ? "" : `  (manque : ${tables.filter((_, i) => !results[i]).join(", ")})`;
  console.log(`${ok ? "OK    " : "MANQUE"}  ${num}  ${label}${detail}`);
}
const admins = (env.EDOME_ADMIN_EMAILS ?? "").split(",").filter((e) => e.trim()).length;
const mail = ["RESEND_API_KEY", "EDOME_EMAIL_FROM", "NEXT_PUBLIC_SITE_URL"].filter((k) => !env[k]);
console.log(`${admins ? "OK    " : "MANQUE"}  EDOME_ADMIN_EMAILS${admins ? ` (${admins} adresse${admins > 1 ? "s" : ""})` : ""}`);
console.log(`${mail.length ? "MANQUE" : "OK    "}  E-mails (Resend)${mail.length ? `  (manque : ${mail.join(", ")})` : ""}`);
if (missing) console.log(`\n→ Coller supabase/APPLIQUER-TOUT.sql dans Supabase → SQL Editor, puis relancer : npm run db:check`);
