"use client";

import { ArrowRight } from "lucide-react";
import { audience } from "@/content/landing";
import { ANCHORS } from "./anchors";
import { Icon } from "./icon";
import { Section } from "./section";
import { useProfileSelection } from "./profile-selection";

/* Section « Pour qui ».

   Composant client car chaque bouton présélectionne le profil dans le
   formulaire avant d'y descendre. Le libellé accessible du bouton précise de
   quel profil il s'agit : « C'est moi » seul, répété six fois, serait
   indéchiffrable dans une liste de liens lue par un lecteur d'écran. */

export function AudienceSection() {
  const { select } = useProfileSelection();

  return (
    <Section
      id={ANCHORS.pourQui}
      eyebrow={audience.eyebrow}
      title={audience.title}
      intro={audience.intro}
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {audience.profiles.map((profile) => (
          <li
            key={profile.id}
            className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-5"
          >
            <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--muted)] text-[var(--foreground)]">
              <Icon name={profile.icon} />
            </span>
            <h3 className="text-base font-semibold text-[var(--foreground)]">{profile.label}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
              {profile.benefit}
            </p>
            <button
              type="button"
              onClick={() => select(profile.id)}
              className="mt-4 inline-flex min-h-11 items-center justify-center gap-1.5 self-start rounded-lg border border-[var(--border)] px-4 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
            >
              <span aria-hidden="true">{audience.cta}</span>
              <span className="sr-only">
                {audience.cta} — {profile.label}
              </span>
              <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </Section>
  );
}
