"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Award, BadgeCheck, MapPin, Camera, Mail, Share2, MoreHorizontal,
  Settings, HelpCircle, LogOut, Flag, UserMinus, Copy as CopyIcon, Pencil,
} from "lucide-react";
import { roleLabels } from "@/lib/types";
import { formatCount } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import type { Profile } from "@/lib/profile-types";
import type { OpenEditor } from "./editor-types";

/* En-tête de profil (bannière + avatar + identité + actions).
   isOwn : bannière/avatar/intro éditables + menu Paramètres.
   Visiteur : Suivre / Message / Partager + menu Signaler/Bloquer. */
export function ProfileHeader({
  profile,
  isOwn,
  open,
  isFollowing = false,
  onToggleFollow,
  onMessage,
}: {
  profile: Profile;
  isOwn: boolean;
  open: OpenEditor;
  isFollowing?: boolean;
  onToggleFollow?: () => void;
  onMessage?: () => void;
}) {
  const { addToast } = useToast();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!moreOpen) return;
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [moreOpen]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      addToast("Lien du profil copié", "success");
    } catch {
      addToast("Impossible de copier le lien", "error");
    }
  };

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = `${profile.firstName} ${profile.lastName} — E-Dome`;
    try {
      if (typeof navigator !== "undefined" && "share" in navigator) {
        await navigator.share({ title, url });
        return;
      }
    } catch { /* annulé */ }
    copyLink();
  };

  const showStats = isOwn || profile.visibility.showStats;

  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] overflow-hidden">
      {/* Bannière */}
      <div className="relative h-36 md:h-48 bg-[var(--hover-bg)]">
        {profile.banner ? (
          <img src={profile.banner} alt="" className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: "linear-gradient(135deg, var(--hover-bg), var(--card))" }}
          />
        )}
        {isOwn && (
          <button
            onClick={() => open({ type: "banner" })}
            aria-label="Modifier la couverture"
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <Camera size={17} />
          </button>
        )}
      </div>

      {/* Corps */}
      <div className="px-4 md:px-6 pb-5">
        <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12 md:-mt-14">
          {/* Avatar */}
          <div className="relative shrink-0">
            <img
              src={profile.avatar}
              alt=""
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
              style={{ border: "4px solid var(--card)" }}
            />
            {isOwn && (
              <button
                onClick={() => open({ type: "avatar" })}
                aria-label="Modifier la photo"
                className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center ring-2 ring-[var(--card)] hover:opacity-90 transition-opacity"
              >
                <Camera size={15} />
              </button>
            )}
          </div>

          {/* Actions */}
          <div ref={moreRef} className="flex gap-2 flex-wrap w-full md:w-auto md:ml-auto relative md:pb-1">
            {isOwn ? (
              <button
                onClick={() => open({ type: "intro" })}
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full border border-[var(--card-border)] text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
              >
                <Pencil size={15} /> Modifier
              </button>
            ) : (
              <>
                <button
                  onClick={onToggleFollow}
                  className="flex-1 md:flex-none px-4 py-2 text-sm font-semibold rounded-full transition-colors"
                  style={{
                    background: isFollowing ? "var(--card)" : "var(--foreground)",
                    color: isFollowing ? "var(--foreground)" : "var(--background)",
                    border: isFollowing ? "1px solid var(--card-border)" : "none",
                  }}
                >
                  {isFollowing ? "Suivi" : "Suivre"}
                </button>
                <button
                  onClick={onMessage}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full border border-[var(--card-border)] text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
                >
                  <Mail size={15} /> Message
                </button>
                <button
                  onClick={share}
                  aria-label="Partager"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[var(--card-border)] text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
                >
                  <Share2 size={15} />
                </button>
              </>
            )}

            <button
              onClick={() => setMoreOpen((v) => !v)}
              aria-label="Plus d'options"
              aria-haspopup="menu"
              aria-expanded={moreOpen}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[var(--card-border)] text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
              style={{ background: moreOpen ? "var(--hover-bg)" : undefined }}
            >
              <MoreHorizontal size={15} />
            </button>

            {moreOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[var(--card-border)] bg-[var(--card)] shadow-lg py-1.5 z-30 animate-fade-in"
              >
                {isOwn ? (
                  <>
                    <MenuLink href="/parametres" icon={Settings} label="Paramètres" onClick={() => setMoreOpen(false)} />
                    <MenuLink href="/aide" icon={HelpCircle} label="Aide" onClick={() => setMoreOpen(false)} />
                    <MenuButton icon={CopyIcon} label="Copier le lien" onClick={() => { copyLink(); setMoreOpen(false); }} />
                    <div className="my-1 h-px bg-[var(--card-border)]" />
                    <MenuLink href="/" icon={LogOut} label="Quitter la maquette" danger onClick={() => setMoreOpen(false)} />
                  </>
                ) : (
                  <>
                    <MenuButton icon={CopyIcon} label="Copier le lien" onClick={() => { copyLink(); setMoreOpen(false); }} />
                    <MenuButton icon={Flag} label="Signaler" onClick={() => { addToast("Signalement envoyé (maquette)", "info"); setMoreOpen(false); }} />
                    <MenuButton icon={UserMinus} label="Bloquer" danger onClick={() => { addToast(`${profile.firstName} a été bloqué (maquette)`, "info"); setMoreOpen(false); }} />
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Identité */}
        <div className="mt-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              {profile.firstName} {profile.lastName}
            </h1>
            {profile.meta.verified && (
              <span className="inline-flex items-center gap-1 text-[var(--primary)]" title="Identité vérifiée">
                <BadgeCheck size={18} />
              </span>
            )}
            {profile.meta.membreFondateur && (
              <span
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{ background: "rgba(245,158,11,0.12)", color: "#b45309" }}
              >
                <Award size={11} /> Membre Fondateur
              </span>
            )}
          </div>

          {profile.headline && (
            <p className="text-sm text-[var(--foreground)] mt-1">{profile.headline}</p>
          )}

          {(profile.location.city || profile.location.country) && (
            <p className="text-sm flex items-center gap-1.5 mt-1 text-[var(--text-muted)]">
              <MapPin size={14} />
              {[profile.location.city, profile.location.country].filter(Boolean).join(", ")}
            </p>
          )}

          {/* Rôles */}
          {profile.roles.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              {profile.roles.map((r, i) => (
                <span
                  key={r}
                  className="px-2.5 py-0.5 text-[11px] font-medium rounded-full"
                  style={
                    i === 0
                      ? { background: "var(--primary)", color: "var(--primary-foreground)" }
                      : { background: "var(--hover-bg)", color: "var(--text-secondary)" }
                  }
                >
                  {roleLabels[r]}
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          {showStats && (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4">
              <Stat value={formatCount(profile.stats.followers)} label="abonnés" href={isOwn ? "/reseau" : undefined} />
              <Stat value={formatCount(profile.stats.following)} label="suivis" href={isOwn ? "/reseau" : undefined} />
              <div className="text-sm flex items-center gap-1.5 text-[var(--text-secondary)]">
                <BadgeCheck size={14} className="text-[var(--success)]" />
                <span className="font-semibold text-[var(--foreground)] tabular-nums">{profile.stats.rating}</span>
                <span>({profile.stats.reviewsCount} avis)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label, href }: { value: string; label: string; href?: string }) {
  const content = (
    <>
      <span className="font-semibold text-[var(--foreground)] tabular-nums">{value}</span> {label}
    </>
  );
  if (href) {
    return (
      <Link href={href} className="text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors">
        {content}
      </Link>
    );
  }
  return <div className="text-sm text-[var(--text-secondary)]">{content}</div>;
}

function MenuLink({
  href, icon: Icon, label, danger, onClick,
}: {
  href: string; icon: React.ComponentType<{ size?: number }>; label: string; danger?: boolean; onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--hover-bg)]"
      style={{ color: danger ? "var(--destructive)" : "var(--foreground)" }}
    >
      <Icon size={16} />
      {label}
    </Link>
  );
}

function MenuButton({
  icon: Icon, label, danger, onClick,
}: {
  icon: React.ComponentType<{ size?: number }>; label: string; danger?: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left hover:bg-[var(--hover-bg)]"
      style={{ color: danger ? "var(--destructive)" : "var(--foreground)" }}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}
