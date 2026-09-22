import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { generateRefCode } from "./ref-code";
import type { LeadListFilter, LeadRecord, LeadStore, StoredLead } from "./types";

/* ── Stockage fichier, pour le développement uniquement ─────────────────────

   Permet de remplir et de relire le formulaire sans projet Supabase. Le
   fichier est ignoré par git : il contient de vraies données personnelles dès
   qu'on teste avec sa propre adresse.

   Ce n'est pas un stockage de production, et `store.ts` refuse de l'utiliser
   en production : sur Vercel le système de fichiers est éphémère et non
   partagé entre instances, donc les données disparaîtraient sans prévenir.

   L'écriture passe par un fichier temporaire suivi d'un `rename`, atomique
   sur un même volume : une interruption en cours d'écriture ne laisse pas un
   JSON tronqué. Les écritures concurrentes sont sérialisées par une simple
   file de promesses — suffisant pour un usage local. */

const FILE = join(process.cwd(), ".leads.local.json");

let queue: Promise<unknown> = Promise.resolve();

/** Sérialise les accès pour éviter deux écritures simultanées. */
function serialize<T>(task: () => Promise<T>): Promise<T> {
  const next = queue.then(task, task);
  queue = next.catch(() => undefined);
  return next;
}

async function readAll(): Promise<StoredLead[]> {
  try {
    const raw = await readFile(FILE, "utf8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredLead[]) : [];
  } catch (error) {
    /* Fichier absent au premier envoi : cas normal, pas une erreur. */
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function writeAll(leads: StoredLead[]): Promise<void> {
  await mkdir(dirname(FILE), { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  await writeFile(tmp, `${JSON.stringify(leads, null, 2)}\n`, "utf8");
  await rename(tmp, FILE);
}

export function createJsonLeadStore(): LeadStore {
  return {
    name: "Fichier local (.leads.local.json)",

    upsert(record: LeadRecord) {
      return serialize(async () => {
        const leads = await readAll();
        const now = new Date().toISOString();
        const index = leads.findIndex((l) => l.email === record.email);

        if (index >= 0) {
          const previous = leads[index]!;
          const lead: StoredLead = {
            ...record,
            id: previous.id,
            createdAt: previous.createdAt,
            updatedAt: now,
            /* Code conservé : les liens déjà partagés doivent continuer à
               pointer sur la même personne. */
            refCode: previous.refCode,
          };
          leads[index] = lead;
          await writeAll(leads);
          return { lead, created: false };
        }

        const taken = new Set(leads.map((l) => l.refCode));
        let refCode = record.refCode;
        while (taken.has(refCode)) refCode = generateRefCode();

        const lead: StoredLead = {
          ...record,
          refCode,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        };
        leads.push(lead);
        await writeAll(leads);
        return { lead, created: true };
      });
    },

    async list(filter?: LeadListFilter) {
      const leads = await readAll();
      return leads
        .filter((l) => (filter?.profile ? l.profile === filter.profile : true))
        .filter((l) =>
          typeof filter?.minScore === "number" ? l.engagementScore >= filter.minScore : true,
        )
        .filter((l) => (filter?.engagement ? l.engagements.includes(filter.engagement) : true))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
  };
}
