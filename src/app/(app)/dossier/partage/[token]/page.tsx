import type { Metadata } from "next";
import { FileText, ShieldCheck, Clock } from "lucide-react";
import { getSharedDossier } from "@/lib/supabase/dossier-actions";
import { DOC_KINDS, PERMITS, SITUATIONS } from "@/lib/dossier";
import { frDay } from "@/lib/my-property";
import { formatNumber } from "@/lib/format";

/* ── Dossier de location partagé (lien personnel, 30 jours) ──────────────────
   Ouvert par le propriétaire qui a reçu la demande. Jamais indexé. Les pièces
   s'ouvrent par des liens signés valables 10 minutes. */

export const metadata: Metadata = { title: "Dossier de location", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function SharedDossierPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const s = await getSharedDossier(token);
  if (!s) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <Clock className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden />
        <h1 className="mt-4 text-[20px] font-semibold">Lien expiré ou révoqué</h1>
        <p className="mt-2 text-[14px] text-muted-foreground">Ce dossier n&apos;est plus partagé. Demandez au candidat de vous le renvoyer.</p>
      </div>
    );
  }
  const d = s.dossier;
  const label = (list: { value: string; label: string }[], v: string) => list.find((x) => x.value === v)?.label ?? "—";
  const rows: [string, string][] = [
    ["Situation", label(SITUATIONS, d.situation)],
    ["Employeur ou école", d.employer || "—"],
    ["Revenu mensuel net du ménage", d.monthlyIncome ? `CHF ${formatNumber(d.monthlyIncome)}` : "—"],
    ["Nationalité ou permis", label(PERMITS, d.permit)],
    ["Occupants", `${d.occupants} adulte${d.occupants > 1 ? "s" : ""}${d.children ? `, ${d.children} enfant${d.children > 1 ? "s" : ""}` : ""}`],
    ["Animaux", d.pets ? "Oui" : "Non"],
    ["Fumeur·se", d.smoker ? "Oui" : "Non"],
  ];
  return (
    <div className="mx-auto max-w-3xl">
      <p className="eyebrow">Dossier de location</p>
      <h1 className="page-heading mt-2 text-[30px]">{s.ownerName}</h1>
      <p className="mt-1 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-leman" aria-hidden /> Partagé avec vous seul · valable jusqu&apos;au {frDay(s.expiresAt)}
      </p>
      {d.intro && <p className="mt-6 whitespace-pre-line rounded-2xl bg-subtle px-5 py-4 text-[15px] leading-relaxed">{d.intro}</p>}
      <dl className="mt-6 divide-y rounded-2xl border bg-card">
        {rows.map(([k, v]) => (
          <div key={k} className="grid gap-1 px-5 py-3 sm:grid-cols-[240px_1fr]"><dt className="text-[13.5px] text-muted-foreground">{k}</dt><dd className="text-[14px] font-medium">{v}</dd></div>
        ))}
      </dl>
      <h2 className="mt-8 text-[17px] font-semibold">Pièces</h2>
      {s.docs.length === 0 ? (
        <p className="mt-2 text-[14px] text-muted-foreground">Aucune pièce jointe pour l&apos;instant.</p>
      ) : (
        <ul className="mt-3 divide-y rounded-2xl border bg-card">
          {s.docs.map((doc) => (
            <li key={doc.id} className="flex items-center gap-3 px-5 py-3">
              <FileText className="h-4 w-4 text-muted-foreground" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium">{DOC_KINDS.find((k) => k.kind === doc.kind)?.label ?? "Document"}</p>
                <p className="truncate text-[12.5px] text-muted-foreground">{doc.name}</p>
              </div>
              {doc.url && <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-[13px] font-medium text-leman hover:underline">Ouvrir</a>}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-6 text-[12px] leading-relaxed text-muted-foreground">
        Ces documents sont confiés pour l&apos;examen de cette candidature uniquement. Ne les conservez pas au-delà, ne les transmettez pas.
      </p>
    </div>
  );
}
