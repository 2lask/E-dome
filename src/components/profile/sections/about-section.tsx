"use client";

import type { Profile } from "@/lib/profile-types";
import type { OpenEditor } from "../editor-types";
import { SectionShell, SectionEmpty } from "../section-shell";

export function AboutSection({
  profile,
  isOwn,
  open,
}: {
  profile: Profile;
  isOwn: boolean;
  open: OpenEditor;
}) {
  const has = profile.about.trim().length > 0;
  return (
    <SectionShell title="À propos" isOwn={isOwn} onEdit={has ? () => open({ type: "about" }) : undefined}>
      {has ? (
        <p className="text-sm leading-relaxed text-[var(--text-secondary)] whitespace-pre-wrap">
          {profile.about}
        </p>
      ) : (
        <SectionEmpty
          isOwn={isOwn}
          ownText="Présentez votre parcours et vos spécialités."
          publicText="Aucune description."
          onAction={() => open({ type: "about" })}
          actionLabel="Ajouter une description"
        />
      )}
    </SectionShell>
  );
}
