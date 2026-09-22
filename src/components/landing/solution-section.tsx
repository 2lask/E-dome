import { solution } from "@/content/landing";
import { Icon } from "./icon";
import { Section } from "./section";

/* Les sept pôles, chacun avec son badge de disponibilité.

   Les badges se distinguent par le contraste et par leur libellé, jamais par
   la seule couleur : « Au lancement » est plein, « Ensuite » est en contour.
   Une personne qui ne perçoit pas la nuance de couleur lit quand même
   l'information. */

export function SolutionSection() {
  return (
    <Section
      eyebrow={solution.eyebrow}
      title={solution.title}
      intro={solution.intro}
      muted
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {solution.poles.map((pole) => {
          const atLaunch = pole.availability === "launch";
          return (
            <li
              key={pole.id}
              className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-5"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--muted)] text-[var(--foreground)]">
                  <Icon name={pole.icon} />
                </span>
                <span
                  className={
                    atLaunch
                      ? "rounded-full bg-[var(--primary)] px-2.5 py-1 text-[11px] font-semibold text-[var(--primary-foreground)]"
                      : "rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text-muted)]"
                  }
                >
                  {atLaunch ? solution.poleBadges.launch : solution.poleBadges.later}
                </span>
              </div>
              <h3 className="text-base font-semibold text-[var(--foreground)]">{pole.label}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                {pole.description}
              </p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
