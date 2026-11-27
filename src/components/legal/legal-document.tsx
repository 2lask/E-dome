import { ChevronDown, FileText, TriangleAlert } from "lucide-react";
import { TocNav } from "@/components/marketing/toc-nav";

/* ── Mise en page d'un document juridique ───────────────────────────────────
   Présentation seulement : le titre, la date, l'avertissement et les sections
   arrivent tels quels de l'appelant. En-tête sombre, sommaire collant sur
   grand écran, sommaire replié sur téléphone, sections lisibles. */

export function LegalDocument({
  title,
  updated,
  disclaimer,
  tocTitle,
  toc,
  children,
}: {
  title: string;
  updated: string;
  disclaimer: React.ReactNode;
  tocTitle: string;
  toc: { id: string; label: string }[];
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="cine relative overflow-hidden rounded-3xl border border-white/10 px-6 py-10 md:px-10 md:py-12">
        <div aria-hidden className="cine-aurora opacity-70" />
        <div aria-hidden className="cine-grid" />
        <div className="relative max-w-3xl">
          <p className="inline-flex items-center gap-2 text-[12.5px] font-medium uppercase tracking-[0.18em] text-[#e3b85c]">
            <FileText className="h-4 w-4" aria-hidden /> Document
          </p>
          <h1 className="mt-3 text-[32px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[44px]">{title}</h1>
          <p className="mt-3 text-[14.5px] text-white/60">{updated}</p>
        </div>
      </header>

      <div role="note" className="mt-6 flex gap-3 rounded-2xl border border-warning/40 bg-warning-soft p-4 text-[13px] leading-relaxed text-foreground/85">
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />
        <p>{disclaimer}</p>
      </div>

      <details className="group mt-6 rounded-2xl border bg-card lg:hidden">
        <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-3 px-5 text-[14.5px] font-semibold [&::-webkit-details-marker]:hidden">
          {tocTitle}
          <ChevronDown aria-hidden className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180 motion-reduce:transition-none" />
        </summary>
        <ol className="border-t px-2 py-2">
          {toc.map((t) => (
            <li key={t.id}>
              <a href={`#${t.id}`} className="flex min-h-[44px] items-center rounded-lg px-3 text-[14px] text-muted-foreground hover:bg-subtle hover:text-foreground">{t.label}</a>
            </li>
          ))}
        </ol>
      </details>

      <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-[260px_1fr] lg:gap-14">
        <aside className="hidden lg:block">
          <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pb-6">
            <TocNav items={toc} label={tocTitle} title={tocTitle} />
          </div>
        </aside>
        <div className="min-w-0 max-w-3xl">{children}</div>
      </div>
    </div>
  );
}

/* Une section : titre, puis le contenu tel quel. */
export function LegalSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-t`} className="scroll-mt-20 border-t py-8 first:border-t-0 first:pt-0">
      <h2 id={`${id}-t`} className="text-[21px] font-semibold tracking-[-0.02em] text-foreground">{title}</h2>
      <div className="mt-4 space-y-4 text-[15px] leading-[1.75] text-muted-foreground">{children}</div>
    </section>
  );
}
