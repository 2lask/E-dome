"use client";
import React, { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { Send, X, Check, Calendar, Users, Building2, GraduationCap, Image as ImageIcon, BarChart3, Film, ListChecks, Plus } from "lucide-react";
import { useApp } from "@/lib/context";
import { roleLabels } from "@/lib/types";
import { timeAgo } from "@/lib/utils";
import { properties as ALL_PROPERTIES } from "@/lib/mock-data";
import { buildObjectAffiliate } from "@/lib/referral-links";
import type { SocialPost, Comment, Property, AnalyticsMetric, AnalyticsCardData, PostAttachment, ReferralLink } from "@/lib/types";
import { DiscoverHub } from "@/components/layout/discover-hub";
import { RecommendedCarousel } from "@/components/feed/recommended-carousel";
import { MarketPulse } from "@/components/feed/market-pulse";
import {
  CURRENT_USER, PINNED_POST_ID, SUGGESTIONS, VIDEO_POSTS,
} from "@/lib/demo/posts";
import { PostCard, renderContent } from "@/components/feed/post-card";
import { ComposerAction } from "@/components/feed/composer/actions";
import { EVENTS_AVAILABLE, type ComposerEvent } from "@/components/feed/composer/events";
import {
  AnalyticsMetricPicker, EventPickerList, FormationPickerList, PropertyPickerList,
} from "@/components/feed/composer/pickers";
import {
  AffiliateToggle, AnalyticsAttachCard, EventAttachCard, FormationAttachCard,
  PropertyAttachCard, computeAnalyticsCard, type FormationLike,
} from "@/components/feed/attach-cards";


// ─── Page ──────────────────────────────────────────────────────────────────

/* ── Le fil ──────────────────────────────────────────────────────────────────

   Ce fichier faisait 3 232 lignes : les données, les lecteurs de médias, la
   carte de post, le composer, les listes de sélection et l'état de la page.
   Il ne reste ici que l'état et la composition.

   Où est parti le reste :

     src/lib/demo/posts.ts                      utilisateurs, posts, CTA
     src/components/feed/media/                 vidéo, image, galerie
     src/components/feed/post-card.tsx          carte de post, légende
     src/components/feed/attach-cards.tsx       cartes d'objet attaché
     src/components/feed/composer/              actions, événements, listes
     src/components/feed/sparkline.tsx          courbe SVG

   Le découpage n'est pas qu'une affaire de taille. `/creer-post` redéclarait
   le composer et un troisième catalogue de biens, et les deux divergeaient :
   tant que tout vivait dans un seul fichier de page, il n'y avait rien à
   réutiliser, donc la copie était la seule issue. */

export default function FeedPage() {
  const { isFollowing, toggleFollow } = useApp();
  const [posts, setPosts] = useState<SocialPost[]>(VIDEO_POSTS);
  /* ─── Composer rapide en tête du feed ─────────────────────────────────
     Texte court (≤280) + jusqu'à 4 médias (image/vidéo) + 1 attachement
     parmi : Bien, Formation, Événement, Analyse de bien. Picker tabbed
     pour l'attachement (ouvre un drawer modal plein écran sur mobile). */
  const [composerText, setComposerText] = useState("");
  const [composerMedia, setComposerMedia] = useState<{ url: string; type: "image" | "video" }[]>([]);
  /* Les objets vendables (bien/formation/événement) portent un flag
     `affiliate` : l'interrupteur « Affiliation » de leur aperçu. À la
     publication, s'il est actif, un lien de tracking est généré
     (buildObjectAffiliate) et attaché au post. L'analyse n'est pas vendable
     → pas d'affiliation. */
  type ComposerAttachmentState =
    | { kind: "property"; property: Property; affiliate: boolean }
    | { kind: "formation"; formation: FormationLike; affiliate: boolean }
    | { kind: "event"; event: ComposerEvent; affiliate: boolean }
    | { kind: "analytics"; data: AnalyticsCardData }
    | null;
  const [composerAttachment, setComposerAttachment] = useState<ComposerAttachmentState>(null);
  /* Sondage en cours de création : actif + 2 à 4 options. Exclusif avec une
     pièce jointe (bien/formation/…). La question = le texte du composer. */
  const [pollActive, setPollActive] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
  const [attachPicker, setAttachPicker] = useState<
    null | "property" | "formation" | "event" | "analytics"
  >(null);
  /* Pour l'onglet "Analyse", il faut d'abord choisir un bien, puis la
     métrique. On garde le bien sélectionné en attente. */
  const [analyticsPickerProperty, setAnalyticsPickerProperty] = useState<Property | null>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_COMPOSER_MEDIA = 4;
  const [activeTab, setActiveTab] = useState<"pour-vous" | "suivis">("pour-vous");

  // Persiste l'état mute entre les posts (le user ne doit pas le réajuster à chaque card).
  const [muted, setMuted] = useState(true);

  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [repostedPosts, setRepostedPosts] = useState<Set<string>>(new Set());
  const [shareMenuPost, setShareMenuPost] = useState<string | null>(null);
  const [moreMenuPost, setMoreMenuPost] = useState<string | null>(null);
  const [commentsModalPost, setCommentsModalPost] = useState<string | null>(null);
  const [editModalPost, setEditModalPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [feedToast, setFeedToast] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    // Tri par date desc pour que les nouveaux formats varies (texte seul,
    // galeries photo) se melangent naturellement avec les videos selon
    // leur createdAt, plutot que d'apparaitre en bas du tableau.
    const base = activeTab === "suivis"
      ? posts.filter((p) => isFollowing(p.author.id) || p.id === PINNED_POST_ID)
      : posts;
    return [...base].sort((a, b) => {
      if (a.id === PINNED_POST_ID) return -1;
      if (b.id === PINNED_POST_ID) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [posts, activeTab, isFollowing]);

  const toggleLike = (postId: string) => {
    const wasLiked = likedPosts.has(postId);
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (wasLiked) next.delete(postId);
      else next.add(postId);
      return next;
    });
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, likes: p.likes + (wasLiked ? -1 : 1) } : p
      )
    );
  };

  const toggleSave = (postId: string) => {
    setSavedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  const toggleRepost = (postId: string) => {
    setRepostedPosts((prev) => {
      const next = new Set(prev);
      const wasReposted = next.has(postId);
      if (wasReposted) next.delete(postId);
      else next.add(postId);
      setFeedToast(wasReposted ? "Repost annulé" : "Reposté");
      setTimeout(() => setFeedToast(null), 1800);
      return next;
    });
  };

  const handleShareCopy = (postId: string) => {
    const url = `${typeof window !== "undefined" ? window.location.origin : "https://edome.world"}/feed#${postId}`;
    try {
      navigator.clipboard.writeText(url);
      setFeedToast("Lien copié");
    } catch {
      setFeedToast("Impossible de copier");
    }
    setShareMenuPost(null);
    setTimeout(() => setFeedToast(null), 1800);
  };

  const addComment = (postId: string) => {
    const text = commentInput.trim();
    if (!text) return;
    const newComment: Comment = {
      id: `c-new-${Date.now()}`,
      author: CURRENT_USER,
      content: replyTo ? `@${replyTo} ${text}` : text,
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
      )
    );
    setCommentInput("");
    setReplyTo(null);
  };

  const deletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setMoreMenuPost(null);
  };

  /* Vote de sondage : incrémente l'option choisie et verrouille (1 vote). */
  const votePoll = (postId: string, optionId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId || !p.poll || p.poll.userVote) return p;
        const options = p.poll.options.map((o) => (o.id === optionId ? { ...o, votes: o.votes + 1 } : o));
        return { ...p, poll: { ...p.poll, options, totalVotes: p.poll.totalVotes + 1, userVote: optionId } };
      }),
    );
  };

  /* ─── Composer : handlers ─────────────────────────────────────────── */

  const handleAddMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const remaining = MAX_COMPOSER_MEDIA - composerMedia.length;
    const toAdd = files.slice(0, remaining).map((f) => ({
      url: URL.createObjectURL(f),
      type: (f.type.startsWith("video") ? "video" : "image") as "image" | "video",
    }));
    setComposerMedia((prev) => [...prev, ...toAdd]);
    e.target.value = "";
    if (files.length > remaining) {
      setFeedToast(`Maximum ${MAX_COMPOSER_MEDIA} fichiers`);
      setTimeout(() => setFeedToast(null), 1800);
    }
  };

  const removeMedia = (idx: number) => {
    setComposerMedia((prev) => {
      const removed = prev[idx];
      if (removed?.url) URL.revokeObjectURL(removed.url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const openAttachPicker = (kind: "property" | "formation" | "event" | "analytics") => {
    setAttachPicker(kind);
    setAnalyticsPickerProperty(null);
  };
  const closeAttachPicker = () => {
    setAttachPicker(null);
    setAnalyticsPickerProperty(null);
  };

  const attachProperty = (p: Property) => {
    setComposerAttachment({ kind: "property", property: p, affiliate: false });
    closeAttachPicker();
  };
  const attachFormation = (f: FormationLike) => {
    setComposerAttachment({ kind: "formation", formation: f, affiliate: false });
    closeAttachPicker();
  };
  const attachEvent = (e: ComposerEvent) => {
    setComposerAttachment({ kind: "event", event: e, affiliate: false });
    closeAttachPicker();
  };
  const attachAnalytics = (p: Property, metric: AnalyticsMetric) => {
    setComposerAttachment({
      kind: "analytics",
      data: computeAnalyticsCard(p, metric),
    });
    closeAttachPicker();
  };

  /* Lien d'affiliation correspondant à l'objet vendable actuellement attaché
     (null pour l'analyse ou l'absence d'objet). Sert à afficher la commission
     sous l'interrupteur et à générer le lien final à la publication. */
  const composerAffiliateLink = (): ReferralLink | null => {
    const a = composerAttachment;
    if (!a) return null;
    if (a.kind === "property")
      return buildObjectAffiliate("bien", a.property.id, a.property.title, {
        image: a.property.images[0],
        price: a.property.price,
        currency: a.property.currency,
        transactionType: a.property.transactionType,
      });
    if (a.kind === "formation")
      return buildObjectAffiliate("formation", a.formation.id, a.formation.title, {
        image: a.formation.thumbnail,
        price: a.formation.price,
      });
    if (a.kind === "event")
      return buildObjectAffiliate("evenement", a.event.id, a.event.titre, {
        image: a.event.thumbnail,
        price: a.event.prix,
      });
    return null;
  };
  /* Bascule l'interrupteur « Affiliation » de l'objet vendable attaché. */
  const toggleComposerAffiliate = () => {
    setComposerAttachment((prev) =>
      prev && prev.kind !== "analytics" ? { ...prev, affiliate: !prev.affiliate } : prev,
    );
  };

  /* ─── Sondage : handlers ─────────────────────────────────────────── */
  const togglePoll = () => {
    setPollActive((on) => {
      const next = !on;
      if (next) setComposerAttachment(null); // exclusif avec une pièce jointe
      else setPollOptions(["", ""]);
      return next;
    });
  };
  const setPollOption = (i: number, v: string) =>
    setPollOptions((prev) => prev.map((o, k) => (k === i ? v : o)));
  const addPollOption = () => setPollOptions((prev) => (prev.length >= 4 ? prev : [...prev, ""]));
  const removePollOption = (i: number) =>
    setPollOptions((prev) => (prev.length <= 2 ? prev : prev.filter((_, k) => k !== i)));

  const pollFilled = pollOptions.map((o) => o.trim()).filter(Boolean);
  const pollReady = pollActive && composerText.trim().length > 0 && pollFilled.length >= 2;

  const composerHasContent =
    (pollActive ? pollReady : composerText.trim().length > 0) ||
    composerMedia.length > 0 ||
    composerAttachment !== null;

  /* Publication depuis le composer : texte + médias uploadés + 1 pièce
     jointe (bien/formation/événement/analyse). On bascule sur l'onglet
     "Pour vous" pour qu'on voie sa propre publication (on ne se suit pas
     soi-même côté mock). */
  const publishFromComposer = () => {
    if (!composerHasContent) return;

    const newPost: SocialPost = {
      id: `p-${Date.now()}`,
      author: CURRENT_USER,
      content: composerText.trim(),
      media: composerMedia.map((m) => m.url),
      mediaTypes: composerMedia.map((m) => m.type),
      type: "post",
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    };

    if (composerAttachment?.kind === "property") {
      newPost.property = composerAttachment.property;
    } else if (composerAttachment?.kind === "formation") {
      newPost.formation = composerAttachment.formation;
    } else if (composerAttachment?.kind === "event") {
      const a: PostAttachment = { type: "event", event: composerAttachment.event };
      newPost.attachment = a;
    } else if (composerAttachment?.kind === "analytics") {
      const a: PostAttachment = { type: "analytics", data: composerAttachment.data };
      newPost.attachment = a;
    }

    // Objet vendable + affiliation activée → lien de tracking généré.
    if (composerAttachment && composerAttachment.kind !== "analytics" && composerAttachment.affiliate) {
      const link = composerAffiliateLink();
      if (link) newPost.affiliate = link;
    }

    // Sondage → attaché au post (les options remplies deviennent votables).
    if (pollReady) {
      newPost.poll = {
        options: pollFilled.map((label, i) => ({ id: `o${i}`, label, votes: 0 })),
        totalVotes: 0,
        endsAt: new Date(Date.now() + 24 * 3600_000).toISOString(),
      };
    }

    setPosts((prev) => [newPost, ...prev]);
    setComposerText("");
    setComposerMedia([]);
    setComposerAttachment(null);
    setPollActive(false);
    setPollOptions(["", ""]);
    setActiveTab("pour-vous");
    setFeedToast("Publié");
    setTimeout(() => setFeedToast(null), 1800);
  };

  const saveEdit = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, content: editContent } : p))
    );
    setEditModalPost(null);
    setEditContent("");
  };

  const showToast = (msg: string) => {
    setFeedToast(msg);
    setTimeout(() => setFeedToast(null), 2400);
  };

  const closeMenus = () => {
    setShareMenuPost(null);
    setMoreMenuPost(null);
  };

  const commentsForPost = commentsModalPost
    ? posts.find((p) => p.id === commentsModalPost)
    : null;

  return (
    <div>
      {/* Toast */}
      {feedToast && (
        <div className="fixed top-6 right-6 z-[100] inline-flex items-center gap-1.5 px-5 py-3 rounded-xl toast-success text-sm font-medium shadow-lg animate-fade-in">
          <Check size={14} strokeWidth={2.5} /> {feedToast}
        </div>
      )}

      {/* Pas de max-w/centrage : le feed est colle a gauche apres la sidebar
          (style Whop ou le centre n'est PAS au milieu de l'espace). */}
      <div className="flex gap-8">
        {/* Colonne centrale — timeline alignee a gauche */}
        <div className="flex-1 min-w-0">
          {/* DiscoverHub */}
          <div className="max-w-[760px]">
            <DiscoverHub />
          </div>

          {/* Recommandations — carrousel automatique de biens de prestige
              et d'événements premium (remplace l'ancienne barre de solde). */}
          <div className="max-w-[760px] mt-4">
            <RecommendedCarousel />
          </div>

          {/* Tabs sticky : style underline subtle (Whop). py-2 gap-5,
              inactif text-muted, underline plus discret. */}
          <div className="sticky top-16 z-20 -mx-4 px-4 py-1 bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--card-border)] md:-mx-0 md:px-0 md:bg-transparent md:backdrop-blur-0">
            <div className="max-w-[760px] flex items-center gap-5 px-2">
              {(["pour-vous", "suivis"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative py-2 text-[14px] font-medium transition-colors ${
                    activeTab === tab
                      ? "text-[var(--foreground)]"
                      : "text-[var(--text-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {tab === "pour-vous" ? "Pour vous" : "Suivis"}
                  {activeTab === tab && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[var(--foreground)]"
                      aria-hidden
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Composer rapide en tête du feed — style X/Twitter mais
              adapté E-Dome : pas de GIF / emoji / sondage (jamais utilisés
              dans le projet), à la place upload média (image+vidéo, jusqu'à
              4 via picker iOS natif) + 4 attachements pertinents : Bien
              immobilier, Formation, Événement, Analyse de bien. */}
          <div className="mt-2 max-w-[760px]">
            <div className="px-4 py-3 border-b border-[var(--card-border)]">
              <div className="flex gap-3">
                <img
                  src={CURRENT_USER.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <textarea
                    ref={composerRef}
                    value={composerText}
                    onChange={(e) => {
                      setComposerText(e.target.value);
                      // auto-grow : reset puis adapte à scrollHeight
                      const el = e.currentTarget;
                      el.style.height = "auto";
                      el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
                    }}
                    onKeyDown={(e) => {
                      // Cmd/Ctrl + Enter → publier (raccourci Twitter)
                      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                        e.preventDefault();
                        publishFromComposer();
                      }
                    }}
                    placeholder={`Quoi de neuf, ${CURRENT_USER.firstName} ?`}
                    maxLength={280}
                    rows={1}
                    aria-label="Rédiger une publication"
                    className="w-full bg-transparent text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none resize-none text-base leading-snug py-1.5"
                  />

                  {/* Aperçu médias uploadés (image + vidéo). Grid 2 cols
                      sur mobile, jusqu'à 4 items, suppression individuelle. */}
                  {composerMedia.length > 0 && (
                    <div
                      className={`mt-2 grid gap-1.5 rounded-2xl overflow-hidden ${
                        composerMedia.length === 1
                          ? "grid-cols-1"
                          : "grid-cols-2"
                      }`}
                    >
                      {composerMedia.map((m, i) => (
                        <div
                          key={i}
                          className="relative aspect-video bg-black rounded-xl overflow-hidden group"
                        >
                          {m.type === "video" ? (
                            <video
                              src={m.url}
                              className="w-full h-full object-cover"
                              muted
                              loop
                              playsInline
                              autoPlay
                            />
                          ) : (
                            <img
                              src={m.url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}
                          {m.type === "video" && (
                            <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium">
                              <Film size={10} /> Vidéo
                            </span>
                          )}
                          <button
                            onClick={() => removeMedia(i)}
                            aria-label="Retirer ce média"
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Aperçu pièce jointe (bien/formation/événement/analyse) */}
                  {composerAttachment && (
                    <div className="mt-2">
                      {composerAttachment.kind === "property" && (
                        <PropertyAttachCard
                          property={composerAttachment.property}
                          onRemove={() => setComposerAttachment(null)}
                        />
                      )}
                      {composerAttachment.kind === "formation" && (
                        <FormationAttachCard
                          formation={composerAttachment.formation}
                          onRemove={() => setComposerAttachment(null)}
                        />
                      )}
                      {composerAttachment.kind === "event" && (
                        <EventAttachCard
                          event={composerAttachment.event}
                          onRemove={() => setComposerAttachment(null)}
                        />
                      )}
                      {composerAttachment.kind === "analytics" && (
                        <AnalyticsAttachCard
                          data={composerAttachment.data}
                          onRemove={() => setComposerAttachment(null)}
                        />
                      )}
                      {/* Interrupteur d'affiliation — objets vendables uniquement
                          (bien / formation / événement), jamais sur l'analyse. */}
                      {composerAttachment.kind !== "analytics" && (
                        <AffiliateToggle
                          on={composerAttachment.affiliate}
                          onToggle={toggleComposerAffiliate}
                          link={composerAffiliateLink()}
                        />
                      )}
                    </div>
                  )}

                  {/* Éditeur de sondage (options) */}
                  {pollActive && (
                    <div className="mt-2 rounded-xl border border-[var(--card-border)] p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] inline-flex items-center gap-1.5">
                          <ListChecks className="w-3.5 h-3.5" /> Sondage
                        </p>
                        <button
                          onClick={togglePoll}
                          className="text-xs text-[var(--text-muted)] hover:text-[var(--foreground)] inline-flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> Retirer
                        </button>
                      </div>
                      {composerText.trim().length === 0 && (
                        <p className="text-[11px] text-[var(--text-muted)] mb-2">Écrivez votre question dans le champ ci-dessus.</p>
                      )}
                      <div className="space-y-2">
                        {pollOptions.map((opt, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <input
                              value={opt}
                              onChange={(e) => setPollOption(i, e.target.value)}
                              maxLength={40}
                              placeholder={`Option ${i + 1}`}
                              className="flex-1 px-3 py-2 text-sm rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)]"
                            />
                            {pollOptions.length > 2 && (
                              <button onClick={() => removePollOption(i)} aria-label="Retirer l'option" className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--hover-bg)] transition-colors">
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      {pollOptions.length < 4 && (
                        <button onClick={addPollOption} className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] hover:underline">
                          <Plus className="w-4 h-4" /> Ajouter une option
                        </button>
                      )}
                    </div>
                  )}

                  {/* Input file caché — accept image+video, multiple, pas de
                      `capture` pour laisser iOS proposer le choix entre
                      Bibliothèque / Photo / Vidéo via le bottom sheet
                      natif (UX iOS standard). */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleAddMedia}
                    className="hidden"
                    aria-hidden
                  />

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-0.5">
                      <ComposerAction
                        icon={ImageIcon}
                        label="Ajouter une photo ou vidéo"
                        onClick={() => fileInputRef.current?.click()}
                      />
                      <ComposerAction
                        icon={Building2}
                        label="Attacher un bien immobilier"
                        onClick={() => openAttachPicker("property")}
                        badge={composerAttachment?.kind === "property"}
                      />
                      <ComposerAction
                        icon={GraduationCap}
                        label="Attacher une formation"
                        onClick={() => openAttachPicker("formation")}
                        badge={composerAttachment?.kind === "formation"}
                      />
                      <ComposerAction
                        icon={Calendar}
                        label="Attacher un événement"
                        onClick={() => openAttachPicker("event")}
                        badge={composerAttachment?.kind === "event"}
                      />
                      <ComposerAction
                        icon={BarChart3}
                        label="Attacher une analyse de bien"
                        onClick={() => openAttachPicker("analytics")}
                        badge={composerAttachment?.kind === "analytics"}
                      />
                      <ComposerAction
                        icon={ListChecks}
                        label="Créer un sondage"
                        onClick={togglePoll}
                        badge={pollActive}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      {composerText.length > 0 && (
                        <span
                          aria-hidden
                          className={`text-xs tabular-nums ${
                            composerText.length > 260
                              ? "text-amber-400"
                              : "text-[var(--text-muted)]"
                          }`}
                        >
                          {280 - composerText.length}
                        </span>
                      )}
                      <button
                        onClick={publishFromComposer}
                        disabled={!composerHasContent}
                        className="px-5 h-9 rounded-full bg-[var(--primary)] hover:bg-[var(--primary)] text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Publier
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          {/* Timeline Twitter-like : posts contigus, séparés par filet fin */}
            {filteredPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-16 px-6">
                <Users className="w-12 h-12 text-[var(--text-muted)] mb-3" />
                <p className="text-sm text-[var(--text-secondary)] max-w-xs">
                  Vous n'êtes abonné à personne pour le moment. Abonnez-vous à des utilisateurs pour voir leurs publications ici.
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  liked={likedPosts.has(post.id)}
                  saved={savedPosts.has(post.id)}
                  reposted={repostedPosts.has(post.id)}
                  muted={muted}
                  onToggleMute={() => setMuted((m) => !m)}
                  onToggleLike={() => toggleLike(post.id)}
                  onToggleSave={() => toggleSave(post.id)}
                  onToggleRepost={() => toggleRepost(post.id)}
                  onOpenComments={() => setCommentsModalPost(post.id)}
                  onOpenShare={() => {
                    setShareMenuPost(shareMenuPost === post.id ? null : post.id);
                    setMoreMenuPost(null);
                  }}
                  onOpenMore={() => {
                    setMoreMenuPost(moreMenuPost === post.id ? null : post.id);
                    setShareMenuPost(null);
                  }}
                  shareOpen={shareMenuPost === post.id}
                  moreOpen={moreMenuPost === post.id}
                  closeMenus={closeMenus}
                  onEdit={() => {
                    setEditContent(post.content);
                    setEditModalPost(post.id);
                    setMoreMenuPost(null);
                  }}
                  onDelete={() => deletePost(post.id)}
                  onSignal={() => {
                    setMoreMenuPost(null);
                    showToast("Publication signalée");
                  }}
                  onShareCopy={() => handleShareCopy(post.id)}
                  onVotePoll={(optionId) => votePoll(post.id, optionId)}
                />
              ))
            )}

            {filteredPosts.length > 0 && (
              <div className="py-10 text-center text-xs text-[var(--text-muted)]">
                Vous avez parcouru tout le feed — {filteredPosts.length} publications.
              </div>
            )}
          </div>
        </div>

        {/* Colonne droite Whop : 280px, UNIQUEMENT suggestions a suivre
            (Search + Tendances masques pour matcher la sidebar simple Whop). */}
        <aside className="hidden lg:block w-[280px] shrink-0 sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto">
          {/* Deux blocs masqués ont été supprimés ici : un formulaire de
              recherche et un bloc « Tendances », tous deux en
              `className="hidden"` pour coller à la sidebar de référence.

              Le second portait un compte par mot-dièse — #immobilier 12,4 K —
              soit un volume de publications sur E-Dome. Du code mort qui
              affirme une traction est pire que du code vivant : personne ne le
              relit, et quelqu'un finira par le démasquer. Les mots-dièse
              survivent comme vocabulaire partagé dans `demo/posts.ts`, sans
              compteur, où `/creer-post` les propose à la saisie. */}

          {/* Suggestions Whop : aucun header de section, liste verticale
              dense, 10 profils, avatar 40px + bouton Suivre pill. */}
          <div>
            <ul className="space-y-0.5">
              {SUGGESTIONS.slice(0, 10).map((user) => (
                <li key={user.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[var(--hover-bg)] transition-colors">
                  <Link href={`/profil/${user.id}`} className="shrink-0">
                    <img
                      src={user.avatar}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover hover:opacity-80 transition-opacity"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/profil/${user.id}`}
                      className="text-[13px] font-semibold text-[var(--foreground)] hover:underline truncate block leading-tight"
                    >
                      {user.firstName} {user.lastName}
                    </Link>
                    <p className="text-[11px] text-[var(--text-muted)] truncate">
                      {roleLabels[user.activeRole]}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleFollow(user.id)}
                    className="text-[12px] px-3.5 py-1.5 rounded-full font-semibold transition-colors shrink-0"
                    style={{
                      background: isFollowing(user.id) ? "transparent" : "var(--foreground)",
                      color: isFollowing(user.id) ? "var(--text-secondary)" : "var(--background)",
                      border: isFollowing(user.id) ? "1px solid var(--card-border)" : "none",
                    }}
                  >
                    {isFollowing(user.id) ? "Suivi" : "Suivre"}
                  </button>
                </li>
              ))}
            </ul>
            <Link
              href="/recherche"
              className="block mt-1 px-2 py-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
            >
              Voir plus →
            </Link>
          </div>

          {/* Pouls du marché — fil « En direct », actualités/règles, pub. */}
          <MarketPulse />
        </aside>
      </div>

      {/* Comments modal */}
      {commentsForPost && (
        <div className="fixed inset-0 z-[80] flex items-end md:items-center md:justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => { setCommentsModalPost(null); setReplyTo(null); setCommentInput(""); }}
          />
          <div className="relative w-full md:w-[480px] md:max-w-[90vw] h-[75vh] md:h-[640px] md:rounded-2xl rounded-t-3xl bg-[var(--card)] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--card-border)]">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Commentaires · {commentsForPost.comments.length}
              </h3>
              <button
                onClick={() => { setCommentsModalPost(null); setReplyTo(null); setCommentInput(""); }}
                className="p-1 rounded-lg hover:bg-[var(--hover-bg)] transition-colors"
              >
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {commentsForPost.comments.length === 0 && (
                <p className="text-center text-sm text-[var(--text-muted)] py-12">
                  Aucun commentaire pour l'instant. Sois le premier !
                </p>
              )}
              {commentsForPost.comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <img src={c.author.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Link href={`/profil/${c.author.id}`} className="text-sm font-semibold text-[var(--foreground)] hover:underline">
                        {c.author.firstName}
                      </Link>
                      <span className="text-xs text-[var(--text-muted)]">{timeAgo(c.createdAt)}</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {renderContent(c.content)}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <button className="text-xs text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors">
                        {c.likes > 0 && `${c.likes} `}J&apos;aime
                      </button>
                      <button
                        onClick={() => setReplyTo(c.author.firstName)}
                        className="text-xs text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
                      >
                        Répondre
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--card-border)] p-3">
              {replyTo && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-[var(--primary)]">Réponse à @{replyTo}</span>
                  <button onClick={() => setReplyTo(null)} className="text-[var(--text-muted)]">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <div className="flex gap-2 items-center">
                <img src={CURRENT_USER.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addComment(commentsForPost.id)}
                  placeholder={replyTo ? `Répondre à ${replyTo}...` : "Écrire un commentaire..."}
                  className="flex-1 px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)]"
                  autoFocus
                />
                <button
                  onClick={() => addComment(commentsForPost.id)}
                  disabled={!commentInput.trim()}
                  className="p-2.5 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary)] transition-colors disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editModalPost && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditModalPost(null)} />
          <div className="relative w-full max-w-[500px] rounded-2xl bg-[var(--card)] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--card-border)]">
              <h3 className="text-sm font-semibold">Modifier la publication</h3>
              <button onClick={() => setEditModalPost(null)} className="p-1 rounded-lg hover:bg-[var(--hover-bg)]">
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                maxLength={2000}
                rows={6}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl p-3 text-sm text-[var(--foreground)] outline-none resize-none focus:border-[var(--primary)]"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setEditModalPost(null)}
                  className="px-4 py-2 rounded-lg bg-[var(--hover-bg)] text-[var(--text-secondary)] text-sm transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => saveEdit(editModalPost)}
                  className="px-4 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary)] text-white text-sm font-medium transition-colors"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Picker d'attachement (Bien / Formation / Événement / Analyse) ─── */}
      {attachPicker && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Choisir une pièce jointe"
          className="fixed inset-0 z-[80] bg-black/70 flex items-end md:items-center justify-center animate-fade-in"
          onClick={closeAttachPicker}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full md:max-w-lg bg-[var(--card)] border border-[var(--card-border)] rounded-t-2xl md:rounded-2xl max-h-[85vh] flex flex-col animate-slide-in-bottom md:animate-scale-in"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--card-border)] shrink-0">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                {attachPicker === "property" && "Attacher un bien"}
                {attachPicker === "formation" && "Attacher une formation"}
                {attachPicker === "event" && "Attacher un événement"}
                {attachPicker === "analytics" &&
                  (analyticsPickerProperty ? "Choisir l'indicateur" : "Analyser un bien")}
              </h3>
              <button
                onClick={closeAttachPicker}
                aria-label="Fermer"
                className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--hover-bg)]"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body — scrollable */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {attachPicker === "property" && (
                <PropertyPickerList properties={ALL_PROPERTIES} onSelect={attachProperty} />
              )}
              {attachPicker === "formation" && (
                <FormationPickerList onSelect={attachFormation} />
              )}
              {attachPicker === "event" && (
                <EventPickerList events={EVENTS_AVAILABLE} onSelect={attachEvent} />
              )}
              {attachPicker === "analytics" && !analyticsPickerProperty && (
                <PropertyPickerList
                  properties={ALL_PROPERTIES.filter((p) => p.analytics)}
                  onSelect={(p) => setAnalyticsPickerProperty(p)}
                  ctaLabel="Choisir"
                />
              )}
              {attachPicker === "analytics" && analyticsPickerProperty && (
                <AnalyticsMetricPicker
                  property={analyticsPickerProperty}
                  onBack={() => setAnalyticsPickerProperty(null)}
                  onSelect={(m) => attachAnalytics(analyticsPickerProperty, m)}
                />
              )}
            </div>

            {/* Pied avec safe-area iOS pour le drawer mobile */}
            <div
              className="border-t border-[var(--card-border)] shrink-0"
              style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

