"use client";

import { Globe, Linkedin, Instagram, Twitter, Facebook, Youtube, ExternalLink } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LINK_TYPE_LABELS, type LinkType, type Profile } from "@/lib/profile-types";
import type { OpenEditor } from "../editor-types";
import { SectionShell, SectionEmpty } from "../section-shell";

const LINK_ICONS: Record<LinkType, LucideIcon> = {
  website: Globe,
  linkedin: Linkedin,
  instagram: Instagram,
  x: Twitter,
  facebook: Facebook,
  youtube: Youtube,
  portfolio: ExternalLink,
  autre: ExternalLink,
};

export function LinksSection({
  profile,
  isOwn,
  open,
}: {
  profile: Profile;
  isOwn: boolean;
  open: OpenEditor;
}) {
  const list = profile.links;
  return (
    <SectionShell
      title="Liens"
      isOwn={isOwn}
      onEdit={list.length > 0 ? () => open({ type: "links" }) : undefined}
    >
      {list.length === 0 ? (
        <SectionEmpty
          isOwn={isOwn}
          ownText="Ajoutez votre site, vos réseaux ou votre portfolio."
          publicText="Aucun lien."
          onAction={() => open({ type: "links" })}
          actionLabel="Ajouter un lien"
        />
      ) : (
        <ul className="flex flex-wrap gap-2">
          {list.map((l) => {
            const Icon = LINK_ICONS[l.type];
            return (
              <li key={l.id}>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--card-border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
                >
                  <Icon size={15} className="text-[var(--text-muted)]" />
                  {l.label || LINK_TYPE_LABELS[l.type]}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </SectionShell>
  );
}
