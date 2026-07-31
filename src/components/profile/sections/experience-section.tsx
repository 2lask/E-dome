"use client";

import { Briefcase, Pencil } from "lucide-react";
import {
  EMPLOYMENT_TYPE_LABELS,
  formatExperiencePeriod,
  experienceDuration,
  type Profile,
} from "@/lib/profile-types";
import type { OpenEditor } from "../editor-types";
import { SectionShell, SectionEmpty } from "../section-shell";

export function ExperienceSection({
  profile,
  isOwn,
  open,
}: {
  profile: Profile;
  isOwn: boolean;
  open: OpenEditor;
}) {
  const list = profile.experiences;
  return (
    <SectionShell
      title="Expériences"
      isOwn={isOwn}
      onAdd={() => open({ type: "experience" })}
    >
      {list.length === 0 ? (
        <SectionEmpty
          isOwn={isOwn}
          ownText="Ajoutez vos postes, entreprises et réalisations."
          publicText="Aucune expérience renseignée."
          onAction={() => open({ type: "experience" })}
          actionLabel="Ajouter une expérience"
        />
      ) : (
        <ul className="space-y-5">
          {list.map((exp) => (
            <li key={exp.id} className="flex gap-3.5">
              <div className="shrink-0 w-11 h-11 rounded-lg bg-[var(--hover-bg)] flex items-center justify-center text-[var(--text-muted)]">
                <Briefcase size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[var(--foreground)]">{exp.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {exp.company}
                      {exp.employmentType && ` · ${EMPLOYMENT_TYPE_LABELS[exp.employmentType]}`}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {formatExperiencePeriod(exp)} · {experienceDuration(exp)}
                    </p>
                    {exp.location && (
                      <p className="text-xs text-[var(--text-muted)]">{exp.location}</p>
                    )}
                  </div>
                  {isOwn && (
                    <button
                      onClick={() => open({ type: "experience", item: exp })}
                      aria-label="Modifier l'expérience"
                      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--foreground)] transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                  )}
                </div>
                {exp.description && (
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)] mt-2 whitespace-pre-wrap">
                    {exp.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </SectionShell>
  );
}
