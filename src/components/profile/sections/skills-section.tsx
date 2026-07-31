"use client";

import type { Profile } from "@/lib/profile-types";
import type { OpenEditor } from "../editor-types";
import { SectionShell, SectionEmpty } from "../section-shell";

export function SkillsSection({
  profile,
  isOwn,
  open,
}: {
  profile: Profile;
  isOwn: boolean;
  open: OpenEditor;
}) {
  const list = profile.skills;
  return (
    <SectionShell
      title="Compétences"
      isOwn={isOwn}
      onEdit={list.length > 0 ? () => open({ type: "skills" }) : undefined}
    >
      {list.length === 0 ? (
        <SectionEmpty
          isOwn={isOwn}
          ownText="Ajoutez vos savoir-faire pour être plus facilement trouvé."
          publicText="Aucune compétence renseignée."
          onAction={() => open({ type: "skills" })}
          actionLabel="Ajouter des compétences"
        />
      ) : (
        <ul className="flex flex-wrap gap-2">
          {list.map((s) => (
            <li
              key={s.id}
              className="px-3 py-1.5 rounded-full text-sm font-medium bg-[var(--hover-bg)] text-[var(--foreground)]"
            >
              {s.name}
            </li>
          ))}
        </ul>
      )}
    </SectionShell>
  );
}
