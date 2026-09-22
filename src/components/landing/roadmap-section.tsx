import { Check } from "lucide-react";
import { roadmap } from "@/content/landing";
import { ANCHORS } from "./anchors";
import { Section } from "./section";

/* Frise d'avancement.

   L'étape en cours est mise en évidence par un fond, une bordure et un
   libellé de statut — pas seulement par une couleur de puce. Les étapes
   terminées portent une coche, une information non chromatique de plus. */

export function RoadmapSection() {
  return (
    <Section
      id={ANCHORS.roadmap}
      eyebrow={roadmap.eyebrow}
      title={roadmap.title}
      intro={roadmap.intro}
    >
      <ol className="relative space-y-3">
        {roadmap.steps.map((step) => {
          const done = step.status === "done";
          const current = step.status === "inprogress";

          return (
            <li
              key={step.id}
              aria-current={current ? "step" : undefined}
              className={`flex gap-4 rounded-xl border p-4 sm:p-5 ${
                current
                  ? "border-[var(--primary)]/35 bg-[var(--card)] shadow-sm"
                  : "border-[var(--border)] bg-transparent"
              }`}
            >
              <span
                className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  done
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : current
                      ? "border-2 border-[var(--primary)] bg-[var(--background)] text-[var(--foreground)]"
                      : "border border-[var(--border)] bg-[var(--muted)] text-[var(--text-muted)]"
                }`}
                aria-hidden="true"
              >
                {done ? <Check size={14} strokeWidth={2.4} /> : null}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3
                    className={`text-base ${
                      current
                        ? "font-semibold text-[var(--foreground)]"
                        : "font-medium text-[var(--foreground)]"
                    }`}
                  >
                    {step.label}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      done
                        ? "bg-[var(--muted)] text-[var(--text-secondary)]"
                        : current
                          ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                          : "border border-[var(--border)] text-[var(--text-muted)]"
                    }`}
                  >
                    {roadmap.statusLabels[step.status]}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {step.detail}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
