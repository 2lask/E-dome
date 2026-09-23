"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Send, Repeat2, Eye, MapPin, ChevronRight, Edit3, Trash2, Flag, EyeOff, Copy, Calendar, Search, User as UserIcon, Users, Building2, GraduationCap, Pin } from "lucide-react";
import { useApp } from "@/lib/context";
import { timeAgo, formatCount } from "@/lib/utils";
import type { SocialPost } from "@/lib/types";
import { CURRENT_USER_ID, CUSTOM_CTA, EVENTS_BY_POST, PINNED_POST_ID, formatEventDate } from "@/lib/demo/posts";
import { PollBlock } from "./poll-block";
import { MediaGallery } from "./media/gallery";
import { VideoPlayer } from "./media/video-player";
import { AffiliatePostBadge, AnalyticsAttachCard, EventAttachCard } from "./attach-cards";


export function renderContent(content: string) {
  return content.split(/([@#][\p{L}\p{N}_]+)/gu).map((part, i) => {
    if (part.startsWith("@") || part.startsWith("#")) {
      return (
        <Link
          key={i}
          href={`/recherche?q=${encodeURIComponent(part)}`}
          onClick={(e) => e.stopPropagation()}
          className="text-[var(--primary)] hover:underline"
        >
          {part}
        </Link>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}


export function PostCaption({
  content,
  big = false,
  clamp = true,
}: {
  content: string;
  big?: boolean;
  clamp?: boolean;
}) {
  const pRef = useRef<HTMLParagraphElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  /* Post texte seul (façon X) : texte plus grand, montré en entier jusqu'à
     ~10 lignes, puis « Voir plus ». Sinon : légende compacte clampée à 3. */
  const clampLines = !clamp ? "" : big ? "line-clamp-[10]" : "line-clamp-3";
  const sizeClass = big
    ? "text-[17px] sm:text-[19px] leading-snug"
    : "text-[14px] leading-relaxed";

  useEffect(() => {
    const p = pRef.current;
    if (!p) return;
    const check = () => {
      // 2 px de tolérance pour les arrondis sub-pixel.
      setOverflowing(p.scrollHeight > p.clientHeight + 2);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(p);
    return () => ro.disconnect();
  }, [content, expanded]);

  return (
    <>
      <p
        ref={pRef}
        className={`${sizeClass} text-[var(--foreground)] whitespace-pre-wrap ${
          expanded ? "" : clampLines
        }`}
      >
        {renderContent(content)}
      </p>
      {!expanded && overflowing && (
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
          className="text-[var(--primary)] text-sm font-medium hover:underline mt-1"
        >
          Voir plus
        </button>
      )}
      {expanded && (
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
          className="text-[var(--primary)] text-sm font-medium hover:underline mt-1"
        >
          Voir moins
        </button>
      )}
    </>
  );
}


// ─── PostCard ──────────────────────────────────────────────────────────────

export type PostCardProps = {
  post: SocialPost;
  liked: boolean;
  saved: boolean;
  reposted: boolean;
  muted: boolean;
  onToggleMute: () => void;
  onToggleLike: () => void;
  onToggleSave: () => void;
  onToggleRepost: () => void;
  onOpenComments: () => void;
  onOpenShare: () => void;
  onOpenMore: () => void;
  shareOpen: boolean;
  moreOpen: boolean;
  closeMenus: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSignal: () => void;
  onShareCopy: () => void;
  onVotePoll: (optionId: string) => void;
};

export function PostCard({
  post, liked, saved, reposted, muted, onToggleMute,
  onToggleLike, onToggleSave, onToggleRepost, onOpenComments, onOpenShare, onOpenMore,
  shareOpen, moreOpen, closeMenus, onEdit, onDelete, onSignal, onShareCopy, onVotePoll,
}: PostCardProps) {
  const { formatPrice } = useApp();
  const cta = CUSTOM_CTA[post.id];
  const event = EVENTS_BY_POST[post.id];
  const isOwn = post.author.id === CURRENT_USER_ID;
  /* L'avis d'accueil porte « Épinglé » au lieu d'un horodatage : « il y a
     2 h » sur un avertissement permanent affirme une fraîcheur qui n'a pas
     de sens, et invite à le lire comme une actualité qu'on peut dépasser. */
  const isPinned = post.id === PINNED_POST_ID;
  /* Détection vidéo : on consulte mediaTypes (renseigné par le composer
     d'upload) sinon on tombe sur l'heuristique d'extension pour les
     mocks (.mp4). Les blob: URLs du composer ne portent pas d'extension. */
  const isVideo =
    post.mediaTypes?.[0] === "video" ||
    post.media[0]?.endsWith(".mp4") ||
    post.media[0]?.endsWith(".webm");
  const handle = post.author.firstName.toLowerCase();
  /* Post « texte seul » (façon X) : aucun média ni objet attaché → on met le
     texte en avant, plus grand. */
  const textOnly =
    post.media.length === 0 && !post.property && !post.formation && !post.attachment && !post.poll && !cta && !event;

  return (
    <article
      onClick={closeMenus}
      className="w-full border-b border-[var(--card-border)] last:border-b-0 px-4 py-2.5 transition-colors"
    >
      {/* Layout Twitter : avatar gauche + colonne contenu droite */}
      <div className="flex gap-3">
        {/* Avatar gauche - 32px Whop */}
        <Link href={`/profil/${post.author.id}`} onClick={(e) => e.stopPropagation()} className="shrink-0">
          <img
            src={post.author.avatar}
            alt={post.author.firstName}
            className="w-8 h-8 rounded-full object-cover hover:opacity-80 transition-opacity"
          />
        </Link>

        {/* Colonne contenu */}
        <div className="flex-1 min-w-0">
          {/* Header inline : nom · @handle · time + menu (text-13 Whop) */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0 min-w-0">
              <Link
                href={`/profil/${post.author.id}`}
                onClick={(e) => e.stopPropagation()}
                className="text-[13px] font-semibold text-[var(--foreground)] hover:underline truncate leading-tight"
              >
                {post.author.firstName} {post.author.lastName}
              </Link>
              <span className="text-[12px] text-[var(--text-muted)] truncate">@{handle}</span>
              <span className="text-[12px] text-[var(--text-muted)]" aria-hidden>·</span>
              {isPinned ? (
                <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--primary)]">
                  <Pin className="w-3 h-3" aria-hidden />
                  Épinglé
                </span>
              ) : (
                <span className="text-[12px] text-[var(--text-muted)]">{timeAgo(post.createdAt)}</span>
              )}
              {post.location && (
                <>
                  <span className="text-[12px] text-[var(--text-muted)]" aria-hidden>·</span>
                  <span className="inline-flex items-center gap-0.5 text-[11px] text-[var(--text-muted)] truncate max-w-[140px]">
                    <MapPin className="w-3 h-3" />
                    {post.location}
                  </span>
                </>
              )}
            </div>

            {/* More menu */}
            <div className="relative shrink-0 -mt-1 -mr-1">
              <button
                onClick={(e) => { e.stopPropagation(); onOpenMore(); }}
                className="p-1.5 rounded-full hover:bg-[var(--hover-bg)] text-[var(--text-muted)] transition-colors"
                aria-label="Plus d'options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {moreOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-9 w-48 rounded-xl border border-[var(--card-border)] bg-[var(--card)] shadow-xl z-20 animate-scale-in overflow-hidden"
                >
                  {isOwn ? (
                    <>
                      <button onClick={onEdit} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors">
                        <Edit3 className="w-4 h-4" /> Modifier
                      </button>
                      <button onClick={onDelete} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-[var(--hover-bg)] transition-colors">
                        <Trash2 className="w-4 h-4" /> Supprimer
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={onSignal} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors">
                        <Flag className="w-4 h-4" /> Signaler
                      </button>
                      <button onClick={closeMenus} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors">
                        <EyeOff className="w-4 h-4" /> Ne plus afficher
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Caption — directement sous le header. Texte seul = plus grand (X). */}
          {post.content && (
            <div className={textOnly ? "mt-1.5" : "mt-0.5"}>
              <PostCaption content={post.content} big={textOnly} clamp={!isPinned} />
            </div>
          )}

          {/* Sondage interactif */}
          {post.poll && <PollBlock poll={post.poll} onVote={onVotePoll} />}

          {/* Media — video, image ou galerie. Format d'origine inchange. */}
          {post.media.length > 0 && (
            <div className="mt-2">
              {isVideo ? (
                <VideoPlayer src={post.media[0]} muted={muted} onToggleMute={onToggleMute} />
              ) : (
                <MediaGallery media={post.media} />
              )}
            </div>
          )}

          {/* Property CTA — compact */}
          {post.property && (
            <Link
              href={`/explorer/${post.property.id}`}
              onClick={(e) => e.stopPropagation()}
              className="mt-2 flex gap-2.5 p-2 rounded-xl border border-[var(--card-border)] hover:bg-[var(--hover-bg)] transition-colors"
            >
              <img src={post.property.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3 h-3 text-[var(--primary)]" />
                  <span className="text-[10px] uppercase tracking-wider text-[var(--primary)] font-semibold">Bien</span>
                </div>
                <p className="text-[13px] font-medium text-[var(--foreground)] truncate leading-tight">{post.property.title}</p>
                <p className="text-[12px] text-[var(--text-muted)] mt-0.5 truncate">
                  <span className="font-semibold tabular-nums text-[var(--foreground)]">
                    {formatPrice(post.property.price, post.property.currency)}
                  </span>
                  {" · "}{post.property.bedrooms} ch · {post.property.area} m²
                  {post.property.transactionType === "vente" && post.property.analytics &&
                    ` · ${post.property.analytics.rendementBrut.toFixed(1)} % brut`}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--text-muted)] self-center shrink-0" />
            </Link>
          )}

          {/* Formation CTA */}
          {post.formation && (
            <Link
              href={`/formations/${post.formation.id}`}
              onClick={(e) => e.stopPropagation()}
              className="mt-2 flex gap-2.5 p-2 rounded-xl border border-[var(--card-border)] hover:bg-[var(--hover-bg)] transition-colors"
            >
              <img src={post.formation.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-3 h-3 text-[var(--primary)]" />
                  <span className="text-[10px] uppercase tracking-wider text-[var(--primary)] font-semibold">Formation</span>
                </div>
                <p className="text-[13px] font-medium text-[var(--foreground)] truncate leading-tight">{post.formation.title}</p>
                <p className="text-[12px] text-[var(--text-muted)] mt-0.5 truncate">
                  <span className="font-semibold tabular-nums text-[var(--foreground)]">{formatPrice(post.formation.price)}</span>
                  {" · "}{post.formation.instructor} · {post.formation.students} étudiants
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--text-muted)] self-center shrink-0" />
            </Link>
          )}

          {/* Event CTA (ancien format via EVENTS_BY_POST map) */}
          {event && (
            <Link
              href={`/evenements/${event.id}`}
              onClick={(e) => e.stopPropagation()}
              className="mt-2 flex gap-2.5 p-2 rounded-xl border border-[var(--card-border)] hover:bg-[var(--hover-bg)] transition-colors"
            >
              <img src={event.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-violet-400" />
                  <span className="text-[10px] uppercase tracking-wider text-violet-400 font-semibold">Événement · {event.type}</span>
                </div>
                <p className="text-[13px] font-medium text-[var(--foreground)] truncate leading-tight">{event.titre}</p>
                <p className="text-[12px] text-[var(--text-muted)] mt-0.5 truncate">
                  {formatEventDate(event.date)} · {event.heure} · {event.lieu} · {event.prix === 0 ? "Gratuit" : formatPrice(event.prix)}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--text-muted)] self-center shrink-0" />
            </Link>
          )}

          {/* Nouveau format : post.attachment (event ou analytics) */}
          {post.attachment?.type === "event" && (
            <div className="mt-2" onClick={(e) => e.stopPropagation()}>
              <EventAttachCard event={post.attachment.event} />
            </div>
          )}
          {post.attachment?.type === "analytics" && (
            <div className="mt-2" onClick={(e) => e.stopPropagation()}>
              <AnalyticsAttachCard data={post.attachment.data} />
            </div>
          )}
          {/* Badge d'affiliation — sous l'objet vendable recommandé (bien /
              formation / événement). Clic → URL de tracking apporteur. */}
          {post.affiliate && (
            <div className="mt-1.5" onClick={(e) => e.stopPropagation()}>
              <AffiliatePostBadge link={post.affiliate} />
            </div>
          )}

          {/* Custom CTA */}
          {cta && (
            <Link
              href={cta.href}
              onClick={(e) => e.stopPropagation()}
              className="mt-2 flex items-center gap-2.5 p-2 rounded-xl border border-[var(--card-border)] hover:bg-[var(--hover-bg)] transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
                {cta.icon === "users" ? <Users className="w-4 h-4 text-[var(--primary)]" />
                  : cta.icon === "search" ? <Search className="w-4 h-4 text-[var(--primary)]" />
                  : cta.icon === "calendar" ? <Calendar className="w-4 h-4 text-[var(--primary)]" />
                  : <UserIcon className="w-4 h-4 text-[var(--primary)]" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[var(--foreground)] truncate">{cta.title}</p>
                <p className="text-[11px] text-[var(--text-muted)] truncate">{cta.subtitle}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
            </Link>
          )}

          {/* Actions — Twitter-style : Reply | Repost | Like | View | Bookmark | Share.
              Compact, sans border-t, dans le flux de la colonne contenu. */}
          <div className="mt-2 -ml-2 flex items-center justify-between max-w-md">
            <ActionBtn
              onClick={(e) => { e.stopPropagation(); onOpenComments(); }}
              hoverColor="primary"
              label="Répondre"
              count={post.comments.length}
            >
              <MessageCircle className="w-[16px] h-[16px]" />
            </ActionBtn>

            <ActionBtn
              onClick={(e) => { e.stopPropagation(); onToggleRepost(); }}
              hoverColor="emerald"
              label={reposted ? "Annuler le repost" : "Reposter"}
              active={reposted}
              count={Math.round(post.likes / 8) + (reposted ? 1 : 0)}
            >
              <Repeat2 className={`w-[16px] h-[16px] ${reposted ? "animate-pop" : ""}`} />
            </ActionBtn>

            <ActionBtn
              onClick={(e) => { e.stopPropagation(); onToggleLike(); }}
              hoverColor="rose"
              label={liked ? "Retirer le j'aime" : "J'aime"}
              active={liked}
              count={post.likes}
            >
              <Heart className={`w-[16px] h-[16px] ${liked ? "fill-rose-500 text-rose-500 animate-pop" : ""}`} />
            </ActionBtn>

            <div className="hidden items-center gap-1 px-2 py-1 text-[12px] text-[var(--text-muted)]">
              <Eye className="w-[16px] h-[16px]" />
              <span className="tabular-nums">{formatCount(post.likes * 25 + post.comments.length * 50)}</span>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
              className={`group p-1.5 rounded-full transition-colors hover:bg-[var(--primary)]/10 ${
                saved ? "text-[var(--primary)]" : "text-[var(--text-muted)] hover:text-[var(--primary)]"
              }`}
              aria-label={saved ? "Retirer du marque-pages" : "Enregistrer"}
              aria-pressed={saved}
            >
              <Bookmark className={`w-[16px] h-[16px] ${saved ? "fill-current" : ""}`} />
            </button>

            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); onOpenShare(); }}
                className="group p-1.5 rounded-full text-[var(--text-muted)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-colors"
                aria-label="Partager"
                aria-expanded={shareOpen}
              >
                <Share2 className="w-[16px] h-[16px]" />
              </button>
              {shareOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 bottom-10 w-44 rounded-xl border border-[var(--card-border)] bg-[var(--card)] shadow-xl z-20 animate-scale-in overflow-hidden"
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); onShareCopy(); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Copier le lien
                  </button>
                  <button
                    onClick={closeMenus}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Envoyer par message
                  </button>
                  <button
                    onClick={closeMenus}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Partager via…
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ActionBtn : bouton d'action compact style Twitter — icone + count
   inline, hover colore selon hoverColor (primary/emerald/rose). */
export function ActionBtn({
  children, onClick, hoverColor, label, count, active,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  hoverColor: "primary" | "emerald" | "rose";
  label: string;
  count?: number;
  active?: boolean;
}) {
  const colorClass = active
    ? hoverColor === "emerald"
      ? "text-emerald-500"
      : hoverColor === "rose"
      ? "text-rose-500"
      : "text-[var(--primary)]"
    : "text-[var(--text-muted)]";
  const hoverClass =
    hoverColor === "emerald"
      ? "group-hover:bg-emerald-500/10 group-hover:text-emerald-500"
      : hoverColor === "rose"
      ? "group-hover:bg-rose-500/10 group-hover:text-rose-500"
      : "group-hover:bg-[var(--primary)]/10 group-hover:text-[var(--primary)]";
  const countColorClass = active
    ? colorClass
    : hoverColor === "emerald"
    ? "group-hover:text-emerald-500"
    : hoverColor === "rose"
    ? "group-hover:text-rose-500"
    : "group-hover:text-[var(--primary)]";

  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className="group inline-flex items-center gap-1 px-1.5 py-1 transition-colors"
    >
      <span className={`p-1 rounded-full transition-colors ${colorClass} ${hoverClass}`}>
        {children}
      </span>
      {typeof count === "number" && count > 0 && (
        <span className={`text-[12px] tabular-nums transition-colors ${colorClass} ${countColorClass}`}>
          {formatCount(count)}
        </span>
      )}
    </button>
  );
}
