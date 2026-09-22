import { ArrowRight } from "lucide-react";
import { founding } from "@/content/landing";
import { FORM_HREF } from "./anchors";
import { Icon } from "./icon";
import { Section } from "./section";

/* Avantages des membres fondateurs.

   `founding.pricingNote` est volontairement vide dans le contenu : aucune
   promesse tarifaire ne doit être publiée avant que le modèle économique soit
   arbitré. Le bloc n'apparaît que si la clé est renseignée, donc remplir la
   chaîne suffit à l'afficher — sans toucher à ce composant. */

export function FoundingSection() {
  return (
    <Section
      eyebrow={founding.eyebrow}
      title={founding.title}
      intro={founding.intro}
      muted
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {founding.perks.map((perk) => (
          <li
            key={perk.id}
            className="flex gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5"
          >
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--muted)] text-[var(--foreground)]">
              <Icon name={perk.icon} />
            </span>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-[var(--foreground)]">{perk.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                {perk.body}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {founding.pricingNote ? (
        <p className="mt-6 text-sm text-[var(--text-secondary)]">{founding.pricingNote}</p>
      ) : null}

      <div className="mt-8">
        <a
          href={FORM_HREF}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-6 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
        >
          {founding.eyebrow}
          <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
        </a>
      </div>
    </Section>
  );
}
