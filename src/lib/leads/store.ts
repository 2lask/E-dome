import "server-only";
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { createJsonLeadStore } from "./json-store";
import { createSupabaseLeadStore } from "./supabase-store";
import type { LeadStore } from "./types";

/* ── Choix de l'implémentation de stockage ───────────────────────────────────

   Supabase dès que `NEXT_PUBLIC_SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`
   sont présentes. Sinon :

   - en développement, repli sur un fichier local, avec un avertissement en
     console — on peut ainsi tester le formulaire de bout en bout sans projet
     Supabase ;
   - en production, échec explicite. Le pire scénario serait d'accepter des
     inscriptions et de les perdre en silence : sur Vercel, le système de
     fichiers est éphémère et propre à chaque instance.

   Pour brancher un autre back-end (Airtable, Notion, une API maison), il
   suffit d'écrire une implémentation de `LeadStore` et de l'ajouter ici. */

let cached: LeadStore | null = null;
let warned = false;

export function getLeadStore(): LeadStore {
  if (cached) return cached;

  if (isSupabaseAdminConfigured()) {
    const client = createAdminClient();
    if (client) {
      cached = createSupabaseLeadStore(client);
      return cached;
    }
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Stockage des manifestations d'intérêt non configuré : renseignez NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  if (!warned) {
    warned = true;
    console.warn(
      "[leads] Supabase n'est pas configuré. Les inscriptions sont écrites dans .leads.local.json (développement uniquement, fichier ignoré par git).",
    );
  }

  cached = createJsonLeadStore();
  return cached;
}

/** Remet le choix à zéro. Utile en test, après modification de l'environnement. */
export function resetLeadStore(): void {
  cached = null;
  warned = false;
}

export type { LeadStore, LeadListFilter, LeadRecord, StoredLead } from "./types";
