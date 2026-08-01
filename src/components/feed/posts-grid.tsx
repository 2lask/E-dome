"use client";

import { useEffect, useState } from "react";
import { Play, Images, Heart, MessageCircle, X, FileText } from "lucide-react";
import { formatCount } from "@/lib/utils";
import type { SocialPost } from "@/lib/types";
import { PostCard } from "./post-card";

/* Grille de publications façon Instagram : vue d'ensemble en tuiles carrées,
   clic sur une tuile → détail complet du post (lightbox avec la PostCard).
   Vidéo → première image + pastille lecture ; galerie → pastille multi ;
   texte seul → aperçu du texte. */

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
          <video
            src={`${post.media[0]}#t=0.1`}
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <img src={post.media[0]} alt="" className="absolute inset-0 w-full h-full object-cover" />
        )
      ) : (
        // Texte seul : aperçu de la légende.
        <div className="absolute inset-0 p-3 flex items-center justify-center bg-[var(--card)]">
          <p className="text-[11px] leading-snug text-[var(--text-secondary)] line-clamp-5 text-center">
            {post.content}
          </p>
        </div>
      )}

      {/* Pastille type (vidéo / multi) */}
      {(video || multi) && (
        <span className="absolute top-2 right-2 text-white drop-shadow">
          {video ? <Play size={16} className="fill-white" /> : <Images size={16} />}
        </span>
      )}
      {!hasMedia && (
        <span className="absolute top-2 right-2 text-[var(--text-muted)]"><FileText size={15} /></span>
      )}

      {/* Survol : likes + commentaires (desktop) */}
      <div className="absolute inset-0 hidden sm:flex items-center justify-center gap-5 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="inline-flex items-center gap-1.5 text-white font-semibold text-sm">
          <Heart size={17} className="fill-white" /> {formatCount(post.likes)}
        </span>
        <span className="inline-flex items-center gap-1.5 text-white font-semibold text-sm">
          <MessageCircle size={17} className="fill-white" /> {formatCount(post.comments.length)}
        </span>
      </div>
    </button>
  );
}

function PostLightbox({ post, onClose }: { post: SocialPost; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[90] flex items-start sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full sm:max-w-[600px] max-h-[100dvh] sm:max-h-[90vh] overflow-y-auto animate-scale-in">
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="sticky top-2 left-full ml-[-3rem] z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/80 transition-colors"
        >
          <X size={18} />
        </button>
        <div className="-mt-9">
          <PostCard post={post} />
        </div>
      </div>
    </div>
  );
}

export function PostsGrid({ posts }: { posts: SocialPost[] }) {
  const [active, setActive] = useState<SocialPost | null>(null);
  return (
    <>
      <div className="grid grid-cols-3 gap-1 sm:gap-2">
        {posts.map((p) => (
          <Thumb key={p.id} post={p} onOpen={() => setActive(p)} />
        ))}
      </div>
      {active && <PostLightbox post={active} onClose={() => setActive(null)} />}
    </>
  );
}
