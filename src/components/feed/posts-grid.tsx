"use client";

import { useMemo, useState } from "react";
import { Play, Images, Heart, MessageCircle, FileText, Pin, ListChecks, Calendar, BarChart3 } from "lucide-react";
import { formatCount } from "@/lib/utils";
import { useApp } from "@/lib/context";
import type { SocialPost } from "@/lib/types";
import { PostViewer } from "./post-viewer";

/* Grille de publications façon Instagram : vue d'ensemble en tuiles carrées
   (3 colonnes, gouttières fines), filtre Tout / Vidéos / Photos, épinglés en
   tête (owner) avec badge, masquage des supprimés, clic → visualiseur. */

const isVideo = (url: string, i: number, post: SocialPost) =>
  post.mediaTypes?.[i] === "video" || /\.(mp4|webm|mov)$/i.test(url);
const postIsVideo = (p: SocialPost) => p.media.length > 0 && isVideo(p.media[0], 0, p);
const postIsPhoto = (p: SocialPost) => p.media.length > 0 && !isVideo(p.media[0], 0, p);

type Filter = "all" | "video" | "photo";

function Thumb({ post, pinned, onOpen }: { post: SocialPost; pinned: boolean; onOpen: () => void }) {
  const hasMedia = post.media.length > 0;
  const video = postIsVideo(post);
  const multi = post.media.length > 1;
  const poll = !!post.poll;
  const isEvent = post.attachment?.type === "event";
  const isAnalytics = post.attachment?.type === "analytics";
  const TypeIcon = video ? Play : multi ? Images : poll ? ListChecks : isEvent ? Calendar : isAnalytics ? BarChart3 : !hasMedia ? FileText : null;

  return (
    <button onClick={onOpen} className="group relative block w-full overflow-hidden bg-[var(--hover-bg)]" style={{ aspectRatio: "1/1" }} aria-label="Voir la publication">
      {hasMedia ? (
        video ? (
          <video src={`${post.media[0]}#t=0.1`} muted playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <img src={post.media[0]} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
        )
      ) : (
        <div className="absolute inset-0 p-3 flex items-center justify-center bg-[var(--card)]">
          <p className="text-[11px] sm:text-xs leading-snug text-[var(--text-secondary)] line-clamp-5 text-center">{post.content}</p>
        </div>
      )}

      {pinned && (
        <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/55 backdrop-blur-sm text-white text-[10px] font-semibold">
          <Pin size={11} className="fill-white" /> Épinglé
        </span>
      )}
      {TypeIcon && (
        <span className={`absolute top-2 right-2 ${hasMedia ? "text-white drop-shadow-md" : "text-[var(--text-muted)]"}`}>
          <TypeIcon size={16} className={video ? "fill-white" : ""} />
        </span>
      )}

      <div className="absolute inset-0 hidden sm:flex items-center justify-center gap-5 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="inline-flex items-center gap-1.5 text-white font-semibold text-sm"><Heart size={17} className="fill-white" /> {formatCount(post.likes)}</span>
        <span className="inline-flex items-center gap-1.5 text-white font-semibold text-sm"><MessageCircle size={17} className="fill-white" /> {formatCount(post.comments.length)}</span>
      </div>
    </button>
  );
}

export function PostsGrid({ posts, isOwn }: { posts: SocialPost[]; isOwn: boolean }) {
  const { pinnedPosts, hiddenPosts, isPinned } = useApp();
  const [index, setIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  // Masqués retirés ; épinglés en tête (owner).
  const displayed = useMemo(() => {
    const visible = posts.filter((p) => !hiddenPosts.includes(p.id));
    const ordered = isOwn
      ? [
          ...pinnedPosts.map((pid) => visible.find((p) => p.id === pid)).filter((p): p is SocialPost => !!p),
          ...visible.filter((p) => !pinnedPosts.includes(p.id)),
        ]
      : visible;
    if (filter === "all") return ordered;
    if (filter === "video") return ordered.filter(postIsVideo);
    return ordered.filter(postIsPhoto);
  }, [posts, hiddenPosts, pinnedPosts, isOwn, filter]);

  const nav = (dir: 1 | -1) =>
    setIndex((i) => (i === null ? i : (i + dir + displayed.length) % displayed.length));

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "all", label: "Tout" },
    { key: "video", label: "Vidéos" },
    { key: "photo", label: "Photos" },
  ];

  return (
    <>
      {/* Filtre Tout / Vidéos / Photos */}
      <div className="flex items-center gap-2 mb-3">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="px-3 py-1.5 rounded-full text-sm font-medium border transition-colors"
              style={active
                ? { background: "var(--primary)", color: "var(--primary-foreground)", borderColor: "var(--primary)" }
                : { background: "var(--card)", color: "var(--text-secondary)", borderColor: "var(--card-border)" }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {displayed.length === 0 ? (
        <div className="py-16 text-center text-sm text-[var(--text-muted)]">Aucune publication dans cette catégorie.</div>
      ) : (
        <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
          {displayed.map((p, i) => (
            <Thumb key={p.id} post={p} pinned={isOwn && isPinned(p.id)} onOpen={() => setIndex(i)} />
          ))}
        </div>
      )}

      {index !== null && displayed[index] && (
        <PostViewer posts={displayed} index={index} onClose={() => setIndex(null)} onNav={nav} isOwn={isOwn} />
      )}
    </>
  );
}
