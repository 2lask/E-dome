import Link from "next/link";
import { ArrowRight, TriangleAlert } from "lucide-react";
import { demo } from "@/content/landing";
import { ANCHORS } from "./anchors";
import { Container } from "./section";
import { PlaceholderVisual } from "./placeholder-visual";

/* Encart démo.

   L'avertissement sur le caractère fictif des données n'est pas décoratif :
   la maquette affiche des biens, des prix et des profils inventés, et un
   visiteur doit le savoir avant d'y entrer, pas après. Il est donc présenté
   comme un bloc distinct et non comme une note en petits caractères. */

export function DemoSection() {
  return (
    <section id={ANCHORS.demo} className="scroll-mt-20 py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <div className="grid items-center gap-8 p-6 sm:p-9 lg:grid-cols-2 lg:gap-10">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                {demo.eyebrow}
              </p>
              <h2 className="page-heading text-2xl leading-tight text-[var(--foreground)] sm:text-3xl">
                {demo.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                {demo.body}
              </p>

              <div className="mt-5 flex gap-3 rounded-lg border border-[var(--warning)]/30 bg-[var(--warning-soft)] p-3.5">
                <TriangleAlert
                  size={18}
                  strokeWidth={1.9}
                  className="mt-0.5 shrink-0 text-[var(--warning-text)]"
                  aria-hidden="true"
                />
                <p className="text-sm leading-relaxed text-[var(--warning-text)]">{demo.warning}</p>
              </div>

              <Link
                href={demo.href}
                className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-6 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
              >
                {demo.cta}
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </Link>
            </div>

            <PlaceholderVisual caption={demo.visualCaption} width={1000} height={720} />
          </div>
        </div>
      </Container>
    </section>
  );
}
