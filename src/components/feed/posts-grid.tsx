"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Images, Heart, MessageCircle, X, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { formatCount } from "@/lib/utils";
import type { SocialPost } from "@/lib/types";
import { PostCard } from "./post-card";

/* Grille de publications façon Instagram : vue d'ensemble en tuiles carrées,
   clic sur une tuile → détail complet (lightbox avec la PostCard) et
   navigation dans les deux sens (flèches, clavier ←/→, swipe). */

const isVideo = (url: string, i: number, post: SocialPost) =>
  post.mediaTypes?.[i] === "video" || /\.(mp4|webm|mov)$/i.test(url);

function Thumb({ post, onOpen }: { post: SocialPost; onOpen: () => void }) {
  const hasMedia = post.media.length > 0;
  const video = hasMedia && isVideo(post.media[0], 0, post);
  const multi = post.media.length > 1;

  return (
    <button
      onClick={onOpen}
      className="group relative block w-full overflow-hidden bg-[var(--hover-bg)]"
      style={{ aspectRatio: "1/1" }}
      aria-label="Voir la publication"
    >
      {hasMedia ? (
        video ? (
          <video src={`${post.media[0]}#t=0.1`} muted playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <img src={post.media[0]} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
        )
      ) : (
        <div className="absolute inset-0 p-3 flex items-center justify-center bg-[var(--card)]">
          <p className="text-[11px] sm:text-xs leading-snug text-[var(--text-secondary)] line-clamp-5 text-center">{post.content}</p>
        </div>
      )}

      {(video || multi) && (
        <span className="absolute top-2 right-2 text-white drop-shadow-md">
          {video ? <Play size={16} className="fill-white" /> : <Images size={16} />}
        </span>
      )}
      {!hasMedia && <span className="absolute top-2 right-2 text-[var(--text-muted)]"><FileText size={15} /></span>}

      <div className="absolute inset-0 hidden sm:flex items-center justify-center gap-5 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="inline-flex items-center gap-1.5 text-white font-semibold text-sm"><Heart size={17} className="fill-white" /> {formatCount(post.likes)}</span>
        <span className="inline-flex items-center gap-1.5 text-white font-semibold text-sm"><MessageCircle size={17} className="fill-white" /> {formatCount(post.comments.length)}</span>
      </div>
    </button>
  );
}

function PostLightbox({
  posts, index, onClose, onNav,
}: {
  posts: SocialPost[];
  index: number;
  onClose: () => void;
  onNav: (dir: 1 | -1) => void;
}) {
  const post = posts[index];
  const touch = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onNav(-1);
      else if (e.key === "ArrowRight") onNav(1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose, onNav]);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
      onTouchEnd={(e) => {
        if (!touch.current) return;
        const dx = e.changedTouches[0].clientX - touch.current.x;
        const dy = e.changedTouches[0].clientY - touch.current.y;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) onNav(dx < 0 ? 1 : -1);
        touch.current = null;
      }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      {/* Barre haut : compteur + fermer */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-4 py-3">
        <span className="text-sm font-medium text-white/90 tabular-nums">{index + 1} / {posts.length}</span>
        <button onClick={onClose} aria-label="Fermer" className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Flèches */}
      {posts.length > 1 && (
        <>
          <button onClick={() => onNav(-1)} aria-label="Précédent" className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-colors">
            <ChevronLeft size={22} />
          </button>
          <button onClick={() => onNav(1)} aria-label="Suivant" className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-colors">
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Post */}
      <div className="relative z-10 w-full sm:max-w-[600px] max-h-[100dvh] sm:max-h-[88vh] overflow-y-auto px-2 sm:px-0 pt-14 pb-4">
        <div key={post.id} className="animate-scale-in">
          <PostCard post={post} />
        </div>
      </div>
    </div>
  );
}

export function PostsGrid({ posts }: { posts: SocialPost[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const nav = (dir: 1 | -1) =>
    setIndex((i) => (i === null ? i : (i + dir + posts.length) % posts.length));

  return (
    <>
      <div className="grid grid-cols-3 gap-1 sm:gap-2">
        {posts.map((p, i) => (
          <Thumb key={p.id} post={p} onOpen={() => setIndex(i)} />
        ))}
      </div>
      {index !== null && (
        <PostLightbox posts={posts} index={index} onClose={() => setIndex(null)} onNav={nav} />
      )}
    </>
  );
}
