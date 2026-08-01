"use client";

import { useState } from "react";
import type { Profile, ToggleableSection } from "@/lib/profile-types";
import { ProfileHeader } from "./profile-header";
import { ProfileCompletion } from "./profile-completion";
import { AboutSection } from "./sections/about-section";
import { ExperienceSection } from "./sections/experience-section";
import { EducationSection } from "./sections/education-section";
import { SkillsSection } from "./sections/skills-section";
import { LinksSection } from "./sections/links-section";
import { ProfileShowcase, type ProfileData } from "./profile-showcase";
import type { ProfileEditor } from "./editor-types";
import { EditIntroModal } from "./editors/edit-intro-modal";
import { EditAboutModal } from "./editors/edit-about-modal";
import { EditExperienceModal } from "./editors/edit-experience-modal";
import { EditEducationModal } from "./editors/edit-education-modal";
import { EditSkillsModal } from "./editors/edit-skills-modal";
import { EditLinksModal } from "./editors/edit-links-modal";
import { EditImageModal } from "./editors/edit-image-modal";

/* Orchestrateur du profil — navigation par onglets (façon Instagram) : on ne
   empile plus toutes les sections sur une page. L'en-tête reste en haut ; le
   reste vit dans un seul jeu d'onglets où « Parcours » regroupe les sections
   CV (À propos, Expériences, Formation, Compétences, Liens) et les autres
   onglets montrent les contenus (Publications, Biens, Formations…).
   Monte toutes les modales d'édition ; en vue publique, respecte la
   visibilité (sections masquées ou vides non rendues). */
export function ProfileView({
  profile,
  isOwn,
  showcase,
  isFollowing,
  onToggleFollow,
  onMessage,
}: {
  profile: Profile;
  isOwn: boolean;
  showcase: ProfileData;
  isFollowing?: boolean;
  onToggleFollow?: () => void;
  onMessage?: () => void;
}) {
  const [editor, setEditor] = useState<ProfileEditor | null>(null);
  const open = (e: ProfileEditor) => setEditor(e);
  const close = () => setEditor(null);

  const visible = (key: ToggleableSection, hasContent: boolean) =>
    isOwn || (!profile.visibility.hiddenSections.includes(key) && hasContent);

  // Contenu de l'onglet « Parcours » (sections CV).
  const parcours = (
    <div className="space-y-4">
      {visible("about", profile.about.trim().length > 0) && (
        <AboutSection profile={profile} isOwn={isOwn} open={open} />
      )}
      {visible("experiences", profile.experiences.length > 0) && (
        <ExperienceSection profile={profile} isOwn={isOwn} open={open} />
      )}
      {visible("education", profile.education.length > 0) && (
        <EducationSection profile={profile} isOwn={isOwn} open={open} />
      )}
      {visible("skills", profile.skills.length > 0) && (
        <SkillsSection profile={profile} isOwn={isOwn} open={open} />
      )}
      {visible("links", profile.links.length > 0) && (
        <LinksSection profile={profile} isOwn={isOwn} open={open} />
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-4 animate-fade-in">
      <ProfileHeader
        profile={profile}
        isOwn={isOwn}
        open={open}
        isFollowing={isFollowing}
        onToggleFollow={onToggleFollow}
        onMessage={onMessage}
      />

      {isOwn && <ProfileCompletion profile={profile} open={open} />}

      <ProfileShowcase data={showcase} rating={profile.stats.rating} isOwn={isOwn} parcours={parcours} />

      {/* Modales d'édition (owner) */}
      {isOwn && editor?.type === "intro" && <EditIntroModal onClose={close} />}
      {isOwn && editor?.type === "avatar" && <EditImageModal kind="avatar" onClose={close} />}
      {isOwn && editor?.type === "banner" && <EditImageModal kind="banner" onClose={close} />}
      {isOwn && editor?.type === "about" && <EditAboutModal onClose={close} />}
      {isOwn && editor?.type === "experience" && <EditExperienceModal initial={editor.item} onClose={close} />}
      {isOwn && editor?.type === "education" && <EditEducationModal initial={editor.item} onClose={close} />}
      {isOwn && editor?.type === "skills" && <EditSkillsModal onClose={close} />}
      {isOwn && editor?.type === "links" && <EditLinksModal onClose={close} />}
    </div>
  );
}
