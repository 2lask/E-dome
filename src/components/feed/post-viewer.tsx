"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import Link from "next/link";
import {
  Heart, MessageCircle, Send, Bookmark, Share2, X, ChevronLeft, ChevronRight,
  Volume2, VolumeX, Play, MapPin, Building2, GraduationCap, Coins, ArrowRight,
  MoreHorizontal, Pin, PinOff, Trash2, Copy, Flag,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { useToast } from "@/components/ui/toast";
import { timeAgo, formatCount } from "@/lib/utils";
import { estimateEarning } from "@/lib/rewards";
import { profileToAuthor } from "@/lib/profile-posts";
import { roleLabels } from "@/lib/types";
import type { SocialPost, Comment, ReferralLink, Currency } from "@/lib/types";
import { ReportModal } from "./report-modal";

/* Visualiseur de post façon Instagram : deux panneaux (média à gauche, infos
   + commentaires à droite) sur desktop, empilé sur mobile. Carrousel d'images,
   vidéo autoplay + son, double-clic pour aimer (animation cœur), commentaires
   complets + champ de saisie, navigation post-à-post (flèches, clavier, swipe). */

const isVideo = (url: string, i: number, post: SocialPost) =>
  post.mediaTypes?.[i] === "video" || /\.(mp4|webm|mov)$/i.test(url);

// ─── Vidéo (modale) ───────────────────────────────────────────────────────

function ModalVideo({ src, onLike }: { src: string; onLike: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (v) v.play().then(() => setPaused(false)).catch(() => {});
  }, [src]);
  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().then(() => setPaused(false)).catch(() => {});
    else { v.pause(); setPaused(true); }
  };
  return (
    <div className="relative w-full h-full flex items-center justify-center" onDoubleClick={onLike}>
      <video ref={ref} src={src} muted={muted} loop playsInline className="max-h-full max-w-full object-contain cursor-pointer" onClick={toggle} />
      {paused && (
        <button onClick={toggle} className="absolute inset-0 flex items-center justify-center" aria-label="Lire">
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

// ─── Carrousel d'images ───────────────────────────────────────────────────

function ImageCarousel({ media, onLike }: { media: string[]; onLike: () => void }) {
  const [i, setI] = useState(0);
  const go = (dir: 1 | -1) => setI((p) => (p + dir + media.length) % media.length);
  return (
    <div className="relative w-full h-full flex items-center justify-center" onDoubleClick={onLike}>
      <img src={media[i]} alt="" className="max-h-full max-w-full object-contain select-none" draggable={false} />
      {media.length > 1 && (
        <>
          {i > 0 && (
            <button onClick={() => go(-1)} aria-label="Image précédente" className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 text-black flex items-center justify-center hover:bg-white transition-colors">
              <ChevronLeft size={18} />
            </button>
          )}
          {i < media.length - 1 && (
            <button onClick={() => go(1)} aria-label="Image suivante" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 text-black flex items-center justify-center hover:bg-white transition-colors">
              <ChevronRight size={18} />
            </button>
          )}
          <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5">
            {media.map((_, k) => (
              <span key={k} className={`h-1.5 rounded-full transition-all ${k === i ? "w-4 bg-white" : "w-1.5 bg-white/50"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Cartes attachées / affiliation (panneau infos) ───────────────────────

function AttachedProperty({ property }: { property: NonNullable<SocialPost["property"]> }) {
  const { formatPrice } = useApp();
  const suffix = property.transactionType === "location-ct" ? "/nuit" : property.transactionType === "location-lt" ? "/mois" : "";
  return (
    <Link href={`/explorer/${property.id}`} className="flex rounded-xl border border-[var(--card-border)] overflow-hidden bg-[var(--card)] hover:border-[var(--text-muted)]/40 transition-colors">
      <img src={property.images[0]} alt="" className="w-20 h-20 object-cover shrink-0" />
      <div className="flex-1 p-2.5 min-w-0">
        <p className="text-[11px] text-[var(--primary)] font-medium inline-flex items-center gap-1"><Building2 size={10} /> Bien</p>
        <p className="text-[13px] font-semibold text-[var(--foreground)] line-clamp-1">{property.title}</p>
        <p className="text-[11px] text-[var(--text-muted)] inline-flex items-center gap-1"><MapPin size={10} /> {property.location.city}</p>
        <p className="text-[13px] font-bold text-[var(--primary)]">{formatPrice(property.price, property.currency)}<span className="text-[11px] font-normal text-[var(--text-muted)]">{suffix}</span></p>
      </div>
    </Link>
  );
}

function AttachedFormation({ formation }: { formation: NonNullable<SocialPost["formation"]> }) {
  const { formatPrice } = useApp();
  return (
    <Link href={`/formations/${formation.id}`} className="flex rounded-xl border border-[var(--card-border)] overflow-hidden bg-[var(--card)] hover:border-[var(--text-muted)]/40 transition-colors">
      <img src={formation.thumbnail} alt="" className="w-20 h-20 object-cover shrink-0" />
      <div className="flex-1 p-2.5 min-w-0">
        <p className="text-[11px] text-orange-400 font-medium inline-flex items-center gap-1"><GraduationCap size={10} /> Formation</p>
        <p className="text-[13px] font-semibold text-[var(--foreground)] line-clamp-2">{formation.title}</p>
        <p className="text-[13px] font-bold text-[var(--primary)]">{formatPrice(formation.price)}</p>
      </div>
    </Link>
  );
}

function AffiliateBadge({ link }: { link: ReferralLink }) {
  const { formatPrice } = useApp();
  const t = link.target;
  const earn = t?.price != null ? estimateEarning(t.kind, t.price, { transactionType: t.transactionType, currency: t.currency as Currency | undefined }) : null;
  const has = !!earn && earn.max > 0;
  const cls = "group/aff relative flex items-center gap-2.5 px-3 py-2 rounded-xl overflow-hidden bg-gradient-to-r from-[var(--primary)]/[0.12] via-[var(--primary)]/[0.05] to-transparent border border-[var(--primary)]/25 hover:border-[var(--primary)]/45 transition-colors";
  const inner = (
    <>
      <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-full w-1/2 skew-x-12 bg-white/10 transition-[left] duration-700 ease-out group-hover/aff:left-[140%]" />
      <span className="shrink-0 w-8 h-8 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center"><Coins size={15} /></span>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Recommandez &amp; gagnez</p>
        {has ? (
          <p className="text-[13px] leading-tight text-[var(--foreground)] truncate">Jusqu&apos;à <span className="font-extrabold text-[var(--primary)]">{formatPrice(earn.max, earn.currency)}</span> de commission</p>
        ) : (
          <p className="text-[13px] leading-tight text-[var(--foreground)] truncate">Commission <span className="font-bold text-[var(--primary)]">{link.commission}</span></p>
        )}
      </div>
      <ArrowRight size={14} className="shrink-0 text-[var(--primary)]" />
    </>
  );
  return link.redirect ? <Link href={link.redirect} className={cls}>{inner}</Link> : <a href={`https://${link.url}`} target="_blank" rel="noopener noreferrer nofollow" className={cls}>{inner}</a>;
}

// ─── Ligne de commentaire ─────────────────────────────────────────────────

function CommentRow({ c }: { c: Comment }) {
  return (
    <div className="flex items-start gap-2.5">
      <img src={c.author.avatar} alt="" className="w-7 h-7 rounded-full object-cover mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[13px] text-[var(--foreground)] leading-snug">
          <Link href={`/profil/${c.author.id}`} className="font-semibold hover:underline">{c.author.firstName} {c.author.lastName}</Link>{" "}
          <span className="text-[var(--text-secondary)]">{c.content}</span>
        </p>
        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{timeAgo(c.createdAt)}{c.likes ? ` · ${formatCount(c.likes)} j'aime` : ""}</p>
      </div>
    </div>
  );
}

// ─── Visualiseur ──────────────────────────────────────────────────────────

export function PostViewer({
  posts, index, onClose, onNav, isOwn,
}: {
  posts: SocialPost[];
  index: number;
  onClose: () => void;
  onNav: (dir: 1 | -1) => void;
  isOwn: boolean;
}) {
  const { profile, togglePinPost, hidePost, isPinned } = useApp();
  const { addToast } = useToast();
  const post = posts[index];
  const id = post.id;

  // États persistés par post pendant la session ouverte.
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});
  const [extra, setExtra] = useState<Record<string, Comment[]>>({});
  const [draft, setDraft] = useState("");
  const [burst, setBurst] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const permalink = () =>
    typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}#post-${id}` : "";
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(permalink()); addToast("Lien copié", "success"); }
    catch { addToast("Impossible de copier le lien", "error"); }
    setMenuOpen(false);
  };
  const sharePost = async () => {
    const url = permalink();
    try { if (typeof navigator !== "undefined" && "share" in navigator) { await navigator.share({ title: `Publication de ${post.author.firstName}`, url }); setMenuOpen(false); return; } } catch { /* annulé */ }
    copyLink();
  };
  const doPin = () => {
    const r = togglePinPost(id);
    addToast(
      r === "pinned" ? "Épinglé en haut du profil" : r === "unpinned" ? "Publication désépinglée" : "Maximum 3 publications épinglées",
      r === "limit" ? "error" : "success",
    );
    setMenuOpen(false);
  };
  const doDelete = () => {
    hidePost(id);
    addToast("Publication supprimée", "success");
    setMenuOpen(false);
    onClose();
  };

  const liked = !!likedMap[id];
  const saved = !!savedMap[id];
  const comments = [...(extra[id] ?? []), ...post.comments];
  const likeCount = post.likes + (liked ? 1 : 0);

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

  const toggleLike = () => setLikedMap((m) => ({ ...m, [id]: !m[id] }));
  const toggleSave = () => setSavedMap((m) => ({ ...m, [id]: !m[id] }));
  const doubleLike = () => {
    setLikedMap((m) => ({ ...m, [id]: true }));
    setBurst(true);
    setTimeout(() => setBurst(false), 700);
  };
  const submitComment = () => {
    const text = draft.trim();
    if (!text) return;
    const c: Comment = { id: `c-new-${Date.now()}`, author: profileToAuthor(profile), content: text, createdAt: new Date().toISOString(), likes: 0 };
    setExtra((e) => ({ ...e, [id]: [c, ...(e[id] ?? [])] }));
    setDraft("");
  };

  const firstIsVideo = post.media.length > 0 && isVideo(post.media[0], 0, post);
  const author = post.author;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
      onTouchEnd={(e) => {
        if (!touch.current) return;
        const dx = e.changedTouches[0].clientX - touch.current.x;
        const dy = e.changedTouches[0].clientY - touch.current.y;
        if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy)) onNav(dx < 0 ? 1 : -1);
        touch.current = null;
      }}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      {/* Barre haut */}
      <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-4 py-3">
        <span className="text-sm font-medium text-white/90 tabular-nums">{index + 1} / {posts.length}</span>
        <button onClick={onClose} aria-label="Fermer" className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Flèches post-à-post */}
      {posts.length > 1 && (
        <>
          <button onClick={() => onNav(-1)} aria-label="Post précédent" className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-colors">
            <ChevronLeft size={22} />
          </button>
          <button onClick={() => onNav(1)} aria-label="Post suivant" className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-colors">
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Fenêtre : média + infos */}
      <div className="relative z-10 w-full sm:w-auto sm:max-w-[1040px] h-[100dvh] sm:h-[86vh] flex flex-col sm:flex-row overflow-y-auto sm:overflow-hidden sm:rounded-2xl bg-[var(--card)] animate-scale-in">
        {/* Média */}
        <div
          key={`media-${id}`}
          className="relative bg-black shrink-0 w-full sm:w-[min(62vw,640px)] flex items-center justify-center"
          style={{ minHeight: "42vh" }}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          {post.media.length === 0 ? (
            <div className="w-full h-full min-h-[42vh] flex items-center justify-center p-8" onDoubleClick={doubleLike}>
              <p className="text-white/90 text-lg leading-relaxed text-center whitespace-pre-wrap">{post.content}</p>
            </div>
          ) : firstIsVideo ? (
            <div className="w-full h-full min-h-[42vh]"><ModalVideo src={post.media[0]} onLike={doubleLike} /></div>
          ) : (
            <div className="w-full h-full min-h-[42vh]"><ImageCarousel media={post.media} onLike={doubleLike} /></div>
          )}
          {/* Cœur double-tap */}
          {burst && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <Heart className="w-24 h-24 text-white fill-white drop-shadow-2xl animate-pop" />
            </div>
          )}
        </div>

        {/* Infos + commentaires */}
        <div key={`info-${id}`} className="flex flex-col w-full sm:w-[360px] shrink-0 bg-[var(--card)] sm:h-full">
          {/* Auteur */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--card-border)]">
            <Link href={`/profil/${author.id}`}><img src={author.avatar} alt="" className="w-9 h-9 rounded-full object-cover" /></Link>
            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-1.5">
                <Link href={`/profil/${author.id}`} className="text-sm font-semibold text-[var(--foreground)] hover:underline">{author.firstName} {author.lastName}</Link>
                {isOwn && isPinned(id) && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--primary)]"><Pin size={11} /> Épinglé</span>
                )}
              </span>
              <p className="text-[11px] text-[var(--text-muted)] truncate">{roleLabels[author.activeRole]}{post.location ? ` · ${post.location}` : ""}</p>
            </div>

            {/* Menu … */}
            <div className="relative shrink-0">
              <button onClick={() => setMenuOpen((v) => !v)} aria-label="Options" className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors">
                <MoreHorizontal size={18} />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} aria-hidden />
                  <div role="menu" className="absolute right-0 top-full mt-1 w-52 rounded-xl border border-[var(--card-border)] bg-[var(--card)] shadow-lg py-1.5 z-50 animate-fade-in">
                    {isOwn ? (
                      <>
                        <MenuItem icon={isPinned(id) ? PinOff : Pin} label={isPinned(id) ? "Désépingler" : "Épingler en haut"} onClick={doPin} />
                        <MenuItem icon={Share2} label="Partager" onClick={sharePost} />
                        <MenuItem icon={Copy} label="Copier le lien" onClick={copyLink} />
                        <div className="my-1 h-px bg-[var(--card-border)]" />
                        <MenuItem icon={Trash2} label="Supprimer" danger onClick={doDelete} />
                      </>
                    ) : (
                      <>
                        <MenuItem icon={Share2} label="Partager" onClick={sharePost} />
                        <MenuItem icon={Copy} label="Copier le lien" onClick={copyLink} />
                        <div className="my-1 h-px bg-[var(--card-border)]" />
                        <MenuItem icon={Flag} label="Signaler" danger onClick={() => { setShowReport(true); setMenuOpen(false); }} />
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Corps scrollable : légende + attachés + commentaires */}
          <div className="flex-1 sm:overflow-y-auto px-4 py-3 space-y-3">
            {post.content && post.media.length > 0 && (
              <div className="flex items-start gap-2.5">
                <img src={author.avatar} alt="" className="w-7 h-7 rounded-full object-cover mt-0.5 shrink-0" />
                <p className="text-[13px] text-[var(--foreground)] leading-snug">
                  <span className="font-semibold">{author.firstName} {author.lastName}</span>{" "}
                  <span className="text-[var(--text-secondary)] whitespace-pre-wrap">{post.content}</span>
                </p>
              </div>
            )}

            {post.property && <AttachedProperty property={post.property} />}
            {post.formation && <AttachedFormation formation={post.formation} />}
            {post.affiliate && <AffiliateBadge link={post.affiliate} />}

            {comments.length > 0 && (
              <div className="space-y-3 pt-1">
                {comments.map((c) => <CommentRow key={c.id} c={c} />)}
              </div>
            )}
            {comments.length === 0 && !post.content && (
              <p className="text-sm text-[var(--text-muted)] text-center py-6">Aucun commentaire pour l'instant.</p>
            )}
          </div>

          {/* Actions + saisie */}
          <div className="border-t border-[var(--card-border)] px-4 pt-2.5 pb-3">
            <div className="flex items-center gap-1 -ml-1.5">
              <button onClick={toggleLike} aria-label="J'aime" className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[var(--hover-bg)] transition-colors" style={{ color: liked ? "var(--destructive)" : "var(--foreground)" }}>
                <Heart size={22} fill={liked ? "currentColor" : "none"} />
              </button>
              <button onClick={() => inputRef.current?.focus()} aria-label="Commenter" className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors">
                <MessageCircle size={21} />
              </button>
              <button aria-label="Partager" className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors">
                <Share2 size={20} />
              </button>
              <button onClick={toggleSave} aria-label="Enregistrer" className="ml-auto w-9 h-9 rounded-full flex items-center justify-center hover:bg-[var(--hover-bg)] transition-colors" style={{ color: saved ? "var(--primary)" : "var(--foreground)" }}>
                <Bookmark size={21} fill={saved ? "currentColor" : "none"} />
              </button>
            </div>
            <p className="text-sm font-semibold text-[var(--foreground)] mt-1">{formatCount(likeCount)} j'aime</p>
            <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide mt-0.5">{timeAgo(post.createdAt)}</p>

            <div className="flex items-center gap-2 mt-2.5">
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submitComment(); }}
                placeholder="Ajouter un commentaire…"
                className="flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none"
              />
              <button onClick={submitComment} disabled={!draft.trim()} className="text-[var(--primary)] disabled:opacity-40 transition-opacity" aria-label="Publier">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showReport && <ReportModal onClose={() => setShowReport(false)} />}
    </div>
  );
}

function MenuItem({
  icon: Icon, label, danger, onClick,
}: {
  icon: ComponentType<{ size?: number }>; label: string; danger?: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-[var(--hover-bg)]"
      style={{ color: danger ? "var(--destructive)" : "var(--foreground)" }}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}
