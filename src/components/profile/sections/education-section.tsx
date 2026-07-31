"use client";

import { GraduationCap, Pencil } from "lucide-react";
import type { Profile } from "@/lib/profile-types";
import type { OpenEditor } from "../editor-types";
import { SectionShell, SectionEmpty } from "../section-shell";

export function EducationSection({
  profile,
  isOwn,
  open,
}: {
  profile: Profile;
  isOwn: boolean;
  open: OpenEditor;
}) {
  const list = profile.education;
  return (
    <SectionShell title="Formation" isOwn={isOwn} onAdd={() => open({ type: "education" })}>
      {list.length === 0 ? (
        <SectionEmpty
          isOwn={isOwn}
          ownText="Ajoutez vos diplômes et établissements."
          publicText="Aucune formation renseignée."
          onAction={() => open({ type: "education" })}
          actionLabel="Ajouter une formation"
        />
      ) : (
        <ul className="space-y-5">
          {list.map((edu) => (
            <li key={edu.id} className="flex gap-3.5">
              <div className="shrink-0 w-11 h-11 rounded-lg bg-[var(--hover-bg)] flex items-center justify-center text-[var(--text-muted)]">
                <GraduationCap size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[var(--foreground)]">{edu.school}</h3>
                    {(edu.degree || edu.field) && (
                      <p className="text-sm text-[var(--text-secondary)]">
                        {[edu.degree, edu.field].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    {(edu.startYear || edu.endYear) && (
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        {edu.startYear ?? "?"} – {edu.endYear ?? "?"}
                      </p>
                    )}
                  </div>
                  {isOwn && (
                    <button
                      onClick={() => open({ type: "education", item: edu })}
                      aria-label="Modifier la formation"
                      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--foreground)] transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                  )}
                </div>
                {edu.description && (
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)] mt-2 whitespace-pre-wrap">
                    {edu.description}
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
