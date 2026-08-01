"use client";

import { useState } from "react";
import { Play, Images, Heart, MessageCircle, FileText } from "lucide-react";
import { formatCount } from "@/lib/utils";
import type { SocialPost } from "@/lib/types";
import { PostViewer } from "./post-viewer";

/* Grille de publications façon Instagram : vue d'ensemble en tuiles carrées
   (3 colonnes, gouttières fines), clic → visualiseur détaillé avec navigation
   post-à-post. */

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
          <img src={post.media[0]} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
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

export function PostsGrid({ posts }: { posts: SocialPost[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const nav = (dir: 1 | -1) =>
    setIndex((i) => (i === null ? i : (i + dir + posts.length) % posts.length));

  return (
    <>
      <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
        {posts.map((p, i) => (
          <Thumb key={p.id} post={p} onOpen={() => setIndex(i)} />
        ))}
      </div>
      {index !== null && (
        <PostViewer posts={posts} index={index} onClose={() => setIndex(null)} onNav={nav} />
      )}
    </>
  );
}
