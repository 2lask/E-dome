import { problem } from "@/content/landing";
import { ANCHORS } from "./anchors";
import { Icon } from "./icon";
import { Section } from "./section";

export function ProblemSection() {
  return (
    <Section
      id={ANCHORS.projet}
      eyebrow={problem.eyebrow}
      title={problem.title}
      intro={problem.intro}
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {problem.points.map((point) => (
          <li
            key={point.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6"
          >
            <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--muted)] text-[var(--foreground)]">
              <Icon name={point.icon} />
            </span>
            <h3 className="text-base font-semibold text-[var(--foreground)]">{point.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{point.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
