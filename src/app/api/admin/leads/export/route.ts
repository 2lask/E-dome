import { NextResponse } from "next/server";
import { PROFILE_QUESTIONS, audience } from "@/content/landing";
import { isAdminAuthenticated } from "@/lib/leads/admin-auth";
import { getLeadStore } from "@/lib/leads/store";
import type { StoredLead } from "@/lib/leads/types";

/* Export CSV des manifestations d'intérêt.

   Même porte que la page : sans session valide, 404 plutôt que 401. Un 401
   confirmerait que la ressource existe ; un 404 n'apprend rien à qui tombe
   dessus par hasard.

   Le fichier est destiné à être ouvert dans Excel ou Numbers en Suisse
   romande, d'où deux choix : séparateur point-virgule (Excel en locale
   française lit la virgule comme séparateur décimal) et marque d'ordre des
   octets en tête, sans laquelle les accents s'affichent de travers.

   Une colonne par question, l'union de tous les profils. Un même
   identifiant partagé par plusieurs profils — « commentaire » par exemple —
   se retrouve donc dans une seule colonne, ce qui est le comportement
   souhaitable. */

export const dynamic = "force-dynamic";

const PROFILE_LABELS: Record<string, string> = Object.fromEntries(
  audience.profiles.map((p) => [p.id, p.label]),
);

/** Identifiants de question, dédupliqués, dans l'ordre des profils. */
function questionColumns(): string[] {
  const seen = new Set<string>();
  for (const profile of audience.profiles) {
    for (const field of PROFILE_QUESTIONS[profile.id]) {
      seen.add(field.id);
    }
  }
  return [...seen];
}

/**
 * Échappe une valeur CSV.
 *
 * Le préfixe par une apostrophe sur `=`, `+`, `-` et `@` neutralise
 * l'injection de formule : un champ libre contenant `=1+1` serait sinon
 * interprété comme une formule à l'ouverture du fichier dans un tableur.
 */
function cell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const raw = Array.isArray(value) ? value.join(" | ") : String(value);
  const guarded = /^[=+\-@]/.test(raw) ? `'${raw}` : raw;
  return `"${guarded.replace(/"/g, '""')}"`;
}

export async function GET(request: Request): Promise<NextResponse> {
  if (!(await isAdminAuthenticated())) {
    return new NextResponse("Not found", { status: 404 });
  }

  const url = new URL(request.url);
  const profileFilter = url.searchParams.get("profil") ?? "";
  const engagementFilter = url.searchParams.get("engagement") ?? "";
  const minScoreRaw = url.searchParams.get("score") ?? "";
  const minScore = minScoreRaw === "" ? null : Number(minScoreRaw);

  let leads: StoredLead[];
  try {
    leads = await getLeadStore().list();
  } catch (error) {
    console.error("[leads] export impossible", error);
    return new NextResponse("Export indisponible", { status: 500 });
  }

  const rows = leads
    .filter((l) => (profileFilter ? l.profile === profileFilter : true))
    .filter((l) => (engagementFilter ? l.engagements.includes(engagementFilter) : true))
    .filter((l) =>
      minScore !== null && Number.isFinite(minScore) ? l.engagementScore >= minScore : true,
    );

  const questions = questionColumns();

  const header = [
    "Date",
    "Prenom",
    "Email",
    "Profil",
    "Canton",
    "Pays",
    "Score",
    "Engagements",
    "Consentement",
    "Consentement le",
    "Newsletter",
    "Code parrainage",
    "Parraine par",
    "UTM source",
    "UTM medium",
    "UTM campagne",
    "UTM contenu",
    "Page",
    ...questions.map((id) => `Q_${id}`),
  ];

  const lines = [
    header.map(cell).join(";"),
    ...rows.map((lead) =>
      [
        lead.createdAt,
        lead.firstName,
        lead.email,
        PROFILE_LABELS[lead.profile] ?? lead.profile,
        lead.canton,
        lead.country,
        lead.engagementScore,
        lead.engagements,
        lead.consentPrivacy ? "oui" : "non",
        lead.consentAt,
        lead.consentNewsletter ? "oui" : "non",
        lead.refCode,
        lead.referredBy,
        lead.utmSource,
        lead.utmMedium,
        lead.utmCampaign,
        lead.utmContent,
        lead.landingPath,
        ...questions.map((id) => lead.profileAnswers[id]),
      ]
        .map(cell)
        .join(";"),
    ),
  ];

  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(`﻿${lines.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="edome-manifestations-${stamp}.csv"`,
      /* Données personnelles : jamais mises en cache par un intermédiaire. */
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
