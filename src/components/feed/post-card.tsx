"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Heart, MessageCircle, Repeat2, Share2, Bookmark, MapPin, Play,
  Volume2, VolumeX, ArrowRight, Coins, Building2, GraduationCap,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { timeAgo, formatCount } from "@/lib/utils";
import { getVideoMetadata } from "@/lib/video-metadata";
import { estimateEarning } from "@/lib/rewards";
import { roleLabels } from "@/lib/types";
import type { SocialPost, ReferralLink, Currency } from "@/lib/types";

/* Carte de post réutilisable, rendu identique au feed social : en-tête
   auteur, média (vidéo autoplay au scroll + son, ou galerie photo), légende
   avec « voir plus », bien/formation attaché, badge d'affiliation avec
   commission, barre d'engagement et aperçu des commentaires. Autonome
   (gère son propre état), utilisée par l'onglet Publications du profil. */

const MEDIA_MAX_HEIGHT = "min(70svh, 600px)";
const clampAspect = (r: number) => Math.max(0.5625, Math.min(r, 1.78));

const isVideo = (url: string, i: number, post: SocialPost) =>
  post.mediaTypes?.[i] === "video" || /\.(mp4|webm|mov)$/i.test(url);

// ─── Vidéo (lazy autoplay au scroll) ──────────────────────────────────────

function PostVideo({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ratioRef = useRef(0);
  const aspect = useMemo(() => clampAspect(getVideoMetadata(src)?.ratio ?? 9 / 16), [src]);

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        ratioRef.current = entry.intersectionRatio;
        if (entry.intersectionRatio >= 0.1) setMounted(true);
        const v = videoRef.current;
        if (!v) return;
        if (entry.intersectionRatio >= 0.6) v.play().then(() => setPaused(false)).catch(() => {});
        else v.pause();
      },
      { threshold: [0, 0.1, 0.6], rootMargin: "40% 0px" },
    );
    obs.observe(c);
    return () => obs.disconnect();
  }, []);

  const toggle = () => {
    if (!mounted) { setMounted(true); return; }
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().then(() => setPaused(false)).catch(() => {});
    else { v.pause(); setPaused(true); }
  };

  return (
    <div ref={containerRef} className="relative bg-black rounded-2xl overflow-hidden" style={{ aspectRatio: aspect, maxHeight: MEDIA_MAX_HEIGHT }}>
      {mounted ? (
        <video
          ref={videoRef}
          src={src}
          muted={muted}
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
          onClick={toggle}
        />
      ) : (
        <button type="button" onClick={toggle} className="absolute inset-0 flex items-center justify-center bg-black" aria-label="Lire la vidéo">
          <span className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center ring-1 ring-white/30">
            <Play className="w-6 h-6 text-white fill-white" />
          </span>
        </button>
      )}
      {paused && mounted && (
        <button onClick={toggle} className="absolute inset-0 flex items-center justify-center bg-black/25" aria-label="Lire">
          <span className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center ring-1 ring-white/30">
            <Play className="w-7 h-7 text-white fill-white" />
          </span>
        </button>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); setMuted((m) => !m); }}
        className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-black/55 backdrop-blur-sm flex items-center justify-center hover:bg-black/75 transition-colors z-10"
        aria-label={muted ? "Activer le son" : "Couper le son"}
      >
        {muted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
      </button>
    </div>
  );
}

// ─── Galerie photo ────────────────────────────────────────────────────────

function PostGallery({ media }: { media: string[] }) {
  if (media.length === 1) {
    return (
      <div className="rounded-2xl overflow-hidden bg-[var(--hover-bg)]" style={{ maxHeight: MEDIA_MAX_HEIGHT }}>
        <img src={media[0]} alt="" className="w-full h-full object-cover" style={{ maxHeight: MEDIA_MAX_HEIGHT }} />
      </div>
    );
  }
  const shown = media.slice(0, 4);
  return (
    <div className={`grid gap-0.5 rounded-2xl overflow-hidden ${shown.length === 2 ? "grid-cols-2" : "grid-cols-2 grid-rows-2"}`} style={{ aspectRatio: shown.length === 2 ? "16/10" : "1/1" }}>
      {shown.map((src, i) => (
        <div key={i} className="relative overflow-hidden bg-[var(--hover-bg)]">
          <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" />
          {i === 3 && media.length > 4 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-white text-2xl font-semibold">+{media.length - 4}</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Badge d'affiliation (commission) ─────────────────────────────────────

function AffiliateBadge({ link }: { link: ReferralLink }) {
  const { formatPrice } = useApp();
  const t = link.target;
  const earn = t?.price != null
    ? estimateEarning(t.kind, t.price, { transactionType: t.transactionType, currency: t.currency as Currency | undefined })
    : null;
  const has = !!earn && earn.max > 0;
  const cls =
    "group/aff relative flex items-center gap-3 px-3 py-2.5 rounded-xl overflow-hidden mt-3 " +
    "bg-gradient-to-r from-[var(--primary)]/[0.12] via-[var(--primary)]/[0.05] to-transparent " +
    "border border-[var(--primary)]/25 hover:border-[var(--primary)]/45 transition-colors";
  const inner = (
    <>
      <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-full w-1/2 skew-x-12 bg-white/10 transition-[left] duration-700 ease-out group-hover/aff:left-[140%]" />
      <span className="shrink-0 w-9 h-9 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center"><Coins size={17} /></span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Recommandez &amp; gagnez</p>
        {has ? (
          <p className="text-[15px] leading-tight text-[var(--foreground)] truncate">
            Jusqu&apos;à <span className="font-extrabold text-[var(--primary)]">{formatPrice(earn.max, earn.currency)}</span>
            <span className="text-[var(--text-muted)]"> de commission</span>
          </p>
        ) : (
          <p className="text-[15px] leading-tight text-[var(--foreground)] truncate">Commission <span className="font-bold text-[var(--primary)]">{link.commission}</span></p>
        )}
      </div>
      <span className="shrink-0 w-7 h-7 rounded-full bg-[var(--primary)]/12 text-[var(--primary)] flex items-center justify-center transition-colors group-hover/aff:bg-[var(--primary)] group-hover/aff:text-[var(--primary-foreground)]"><ArrowRight size={14} /></span>
    </>
  );
  return link.redirect
    ? <Link href={link.redirect} className={cls}>{inner}</Link>
    : <a href={`https://${link.url}`} target="_blank" rel="noopener noreferrer nofollow" className={cls}>{inner}</a>;
}

// ─── Objets attachés ──────────────────────────────────────────────────────

function AttachedProperty({ property }: { property: NonNullable<SocialPost["property"]> }) {
  const { formatPrice } = useApp();
  const suffix = property.transactionType === "location-ct" ? "/nuit" : property.transactionType === "location-lt" ? "/mois" : "";
  return (
    <Link href={`/explorer/${property.id}`} className="mt-3 flex rounded-2xl border border-[var(--card-border)] overflow-hidden bg-[var(--card)] hover:border-[var(--text-muted)]/40 transition-colors">
      <img src={property.images[0]} alt="" className="w-24 h-24 object-cover shrink-0" />
      <div className="flex-1 p-3 min-w-0">
        <p className="text-xs text-[var(--primary)] font-medium inline-flex items-center gap-1"><Building2 size={11} /> Bien immobilier</p>
        <p className="text-sm font-semibold text-[var(--foreground)] mt-0.5 line-clamp-1">{property.title}</p>
        <p className="text-xs text-[var(--text-muted)] mt-1 inline-flex items-center gap-1"><MapPin size={11} /> {property.location.city}</p>
        <p className="text-sm font-bold text-[var(--primary)] mt-1">{formatPrice(property.price, property.currency)}<span className="text-xs text-[var(--text-muted)] font-normal">{suffix}</span></p>
      </div>
    </Link>
  );
}

function AttachedFormation({ formation }: { formation: NonNullable<SocialPost["formation"]> }) {
  const { formatPrice } = useApp();
  return (
    <Link href={`/formations/${formation.id}`} className="mt-3 flex rounded-2xl border border-[var(--card-border)] overflow-hidden bg-[var(--card)] hover:border-[var(--text-muted)]/40 transition-colors">
      <img src={formation.thumbnail} alt="" className="w-24 h-24 object-cover shrink-0" />
      <div className="flex-1 p-3 min-w-0">
        <p className="text-xs text-orange-400 font-medium inline-flex items-center gap-1"><GraduationCap size={11} /> Formation</p>
        <p className="text-sm font-semibold text-[var(--foreground)] mt-0.5 line-clamp-2">{formation.title}</p>
        <p className="text-xs text-[var(--text-muted)] mt-1">Par {formation.instructor} · {formatCount(formation.students)} élèves</p>
        <p className="text-sm font-bold text-[var(--primary)] mt-1">{formatPrice(formation.price)}</p>
      </div>
    </Link>
  );
}

// ─── Légende ──────────────────────────────────────────────────────────────

function Caption({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false);
  const long = content.length > 180 || content.split("\n").length > 3;
  return (
    <div className="mt-1">
      <p className={`text-[14px] text-[var(--foreground)] whitespace-pre-wrap leading-relaxed ${expanded ? "" : "line-clamp-3"}`}>{content}</p>
      {long && (
        <button onClick={() => setExpanded((v) => !v)} className="text-[var(--primary)] text-sm font-medium hover:underline mt-0.5">
          {expanded ? "Voir moins" : "Voir plus"}
        </button>
      )}
    </div>
  );
}

// ─── Carte ────────────────────────────────────────────────────────────────

export function PostCard({ post }: { post: SocialPost }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const author = post.author;
  const firstIsVideo = post.media.length > 0 && isVideo(post.media[0], 0, post);
  const likeCount = post.likes + (liked ? 1 : 0);

  return (
    <article className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4">
      {/* En-tête auteur */}
      <div className="flex items-center gap-3">
        <Link href={`/profil/${author.id}`} className="shrink-0">
          <img src={author.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={`/profil/${author.id}`} className="text-sm font-semibold text-[var(--foreground)] hover:underline">
            {author.firstName} {author.lastName}
          </Link>
          <p className="text-xs text-[var(--text-muted)] truncate">
            {roleLabels[author.activeRole]} · {timeAgo(post.createdAt)}
            {post.location ? ` · ${post.location}` : ""}
          </p>
        </div>
      </div>

      {/* Légende */}
      {post.content && <Caption content={post.content} />}

      {/* Média */}
      {post.media.length > 0 && (
        <div className="mt-3">
          {firstIsVideo ? <PostVideo src={post.media[0]} /> : <PostGallery media={post.media} />}
        </div>
      )}

      {/* Objet attaché */}
      {post.property && <AttachedProperty property={post.property} />}
      {post.formation && <AttachedFormation formation={post.formation} />}

      {/* Affiliation */}
      {post.affiliate && <AffiliateBadge link={post.affiliate} />}

      {/* Engagement */}
      <div className="flex items-center gap-1 mt-3 -ml-1.5">
        <button onClick={() => setLiked((v) => !v)} className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm hover:bg-[var(--hover-bg)] transition-colors" style={{ color: liked ? "var(--destructive)" : "var(--text-secondary)" }}>
          <Heart size={18} fill={liked ? "currentColor" : "none"} /> <span className="tabular-nums">{formatCount(likeCount)}</span>
        </button>
        <span className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm text-[var(--text-secondary)]">
          <MessageCircle size={18} /> <span className="tabular-nums">{formatCount(post.comments.length)}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm text-[var(--text-secondary)]">
          <Repeat2 size={18} />
        </span>
        <span className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm text-[var(--text-secondary)]">
          <Share2 size={17} />
        </span>
        <button onClick={() => setSaved((v) => !v)} className="ml-auto inline-flex items-center px-2 py-1.5 rounded-lg text-sm hover:bg-[var(--hover-bg)] transition-colors" style={{ color: saved ? "var(--primary)" : "var(--text-secondary)" }}>
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Aperçu commentaires */}
      {post.comments.length > 0 && (
        <div className="mt-1 pt-3 border-t border-[var(--card-border)] space-y-2">
          {post.comments.slice(0, 1).map((c) => (
            <div key={c.id} className="flex items-start gap-2">
              <img src={c.author.avatar} alt="" className="w-6 h-6 rounded-full object-cover mt-0.5" />
              <p className="text-sm text-[var(--text-secondary)]">
                <span className="font-medium text-[var(--foreground)]">{c.author.firstName}</span> {c.content}
              </p>
            </div>
          ))}
          {post.comments.length > 1 && (
            <p className="text-xs text-[var(--text-muted)]">Voir les {post.comments.length} commentaires</p>
          )}
        </div>
      )}
    </article>
  );
}
