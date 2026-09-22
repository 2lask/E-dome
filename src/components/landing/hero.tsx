import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { demo, hero } from "@/content/landing";
import { FORM_HREF } from "./anchors";
import { Container } from "./section";
import { PlaceholderVisual } from "./placeholder-visual";

/* Hero. Composant serveur : aucune interactivité propre, uniquement des liens.

   `Link` est employé pour la démo (route interne) et une ancre simple pour le
   formulaire. Mélanger les deux est volontaire : `next/link` préchargerait
   inutilement une ancre de la même page. */

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-40">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          {/* Mention d'état : le visiteur doit savoir en une seconde que la
              plateforme n'est pas encore ouverte. */}
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3.5 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
            <span
              className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]"
              aria-hidden="true"
            />
            {hero.status}
          </p>

          <h1 className="page-heading text-4xl leading-[1.08] tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
            {hero.title}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            {hero.subtitle}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={FORM_HREF}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-6 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90 sm:w-auto"
            >
              {hero.ctaPrimary}
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </a>
            <Link
              href={demo.href}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] px-6 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)] sm:w-auto"
            >
              {hero.ctaSecondary}
            </Link>
          </div>

          <p className="mt-4 text-xs text-[var(--text-muted)]">{hero.ctaNote}</p>
        </div>

        <div className="mx-auto mt-14 max-w-5xl sm:mt-16">
          <PlaceholderVisual caption={hero.visualCaption} priority />
        </div>
      </Container>
    </section>
  );
}
