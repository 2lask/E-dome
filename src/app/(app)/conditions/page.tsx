import type { Metadata } from "next";
import { SECTIONS, conditionsMeta } from "@/content/conditions";
import { LegalDocument, LegalSection } from "@/components/legal/legal-document";

export const metadata: Metadata = { title: conditionsMeta.title };

/* ── /conditions ────────────────────────────────────────────────────────────

   Le contenu — treize sections, les quatre règles en §2, le barème généré —
   vit dans `src/content/conditions.ts`. Cette page ne fait que le disposer
   (Server Component ; le sommaire actif est le seul îlot client). */

export default function ConditionsPage() {
  return (
    <LegalDocument
      title={conditionsMeta.title}
      updated={conditionsMeta.updated}
      disclaimer={conditionsMeta.disclaimer}
      tocTitle={conditionsMeta.tocTitle}
      toc={SECTIONS.map((s) => ({ id: s.id, label: s.title }))}
    >
      {SECTIONS.map((s) => (
        <LegalSection key={s.id} id={s.id} title={s.title}>
          <div className="whitespace-pre-line">{s.content}</div>
          {s.table && (
            <div className="my-2 overflow-x-auto rounded-2xl border">
              <table className="w-full min-w-[520px] text-[13.5px]">
                <thead>
                  <tr className="bg-subtle">
                    {s.table[0].map((h, i) => (
                      <th key={i} scope="col" className="border-b p-3 text-left font-semibold text-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.table.slice(1).map((row, ri) => (
                    <tr key={ri} className="border-b last:border-0 even:bg-subtle/40">
                      {row.map((cell, ci) => (
                        <td key={ci} className="p-3 align-top text-foreground/90">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {s.contentAfter && <div className="whitespace-pre-line">{s.contentAfter}</div>}
        </LegalSection>
      ))}
    </LegalDocument>
  );
}
