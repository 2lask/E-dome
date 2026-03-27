"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Plus,
  Camera,
  Home,
  BarChart3,
  PenLine,
  Send,
  Image as ImageIcon,
  Play,
  MapPin,
  ArrowRight,
  TrendingUp,
  Calendar,
  X,
  ArrowUp,
  Link2,
  Mail,
  Check,
  Copy,
  Flag,
  EyeOff,
  UserPlus,
  Trash2,
  Pencil,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { timeAgo, formatCount } from "@/lib/utils";
import { roleLabels } from "@/lib/types";
import type { SocialPost, User, Comment } from "@/lib/types";
import {
  currentUser,
  mockPosts,
  mockStories,
  mockSuggestions,
  mockTrending,
  mockEvents,
  suggestedUsers,
} from "@/lib/mock-data";
import { useApp } from "@/lib/context";

// ─── Role badge colors ─────────────────────────────────

const roleBadgeBg: Record<string, string> = {
  client: "bg-gray-500/20 text-gray-400",
  hote: "bg-blue-500/20 text-blue-400",
  proprietaire: "bg-green-500/20 text-green-400",
  agence: "bg-violet-500/20 text-violet-400",
  promoteur: "bg-orange-500/20 text-orange-400",
  apporteur: "bg-yellow-500/20 text-yellow-400",
  investisseur: "bg-red-500/20 text-red-400",
  formateur: "bg-teal-500/20 text-teal-400",
  admin: "bg-white/20 text-white",
};

// ─── Avatar component ───────────────────────────────────

function Avatar({
  user,
  size = "md",
  ring,
}: {
  user: User;
  size?: "sm" | "md" | "lg";
  ring?: boolean;
}) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" };
  const initials = `${user.firstName[0]}${user.lastName[0]}`;
  return (
    <div
      className={cn(
        "relative flex-shrink-0 rounded-full flex items-center justify-center font-semibold overflow-hidden",
        sizes[size],
        ring && "ring-2 ring-[#C4956A] ring-offset-2 ring-offset-[var(--background)]",
        !user.avatar && "bg-gradient-to-br from-[#C4956A]/30 to-[#C4956A]/10 text-[#C4956A]"
      )}
    >
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={`${user.firstName} ${user.lastName}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
            (e.target as HTMLImageElement).parentElement!.classList.add(
              "bg-gradient-to-br",
              "from-[#C4956A]/30",
              "to-[#C4956A]/10",
              "text-[#C4956A]"
            );
          }}
        />
      ) : (
        initials
      )}
      {/* Show initials as fallback overlay when image fails */}
      {user.avatar && (
        <span className="absolute inset-0 flex items-center justify-center text-[#C4956A] font-semibold pointer-events-none opacity-0">
          {initials}
        </span>
      )}
      {user.online && (
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--background)]" />
      )}
    </div>
  );
}

// ─── Stories bar ────────────────────────────────────────

function StoriesBar() {
  const [showStoryCreation, setShowStoryCreation] = useState(false);
  const [storyToast, setStoryToast] = useState(false);
  const [viewingStory, setViewingStory] = useState<typeof mockStories[0] | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const storyTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const storyFileRef = useRef<HTMLInputElement>(null);
  const [storyFile, setStoryFile] = useState<string | null>(null);

  // Auto-close story viewer after 5 seconds
  useEffect(() => {
    if (viewingStory) {
      setStoryProgress(0);
      const start = Date.now();
      storyTimerRef.current = setInterval(() => {
        const elapsed = Date.now() - start;
        const pct = Math.min((elapsed / 5000) * 100, 100);
        setStoryProgress(pct);
        if (pct >= 100) {
          setViewingStory(null);
        }
      }, 50);
      return () => {
        if (storyTimerRef.current) clearInterval(storyTimerRef.current);
      };
    }
  }, [viewingStory]);

  const handleStoryPublish = () => {
    setShowStoryCreation(false);
    setStoryFile(null);
    setStoryToast(true);
    setTimeout(() => setStoryToast(false), 2500);
  };

  return (
    <>
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-1">
          {/* Your story */}
          <button onClick={() => setShowStoryCreation(!showStoryCreation)} className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-[var(--card-border)] flex items-center justify-center hover:border-[#C4956A]/50 transition-colors overflow-hidden">
              {currentUser.avatar ? (
                <div className="relative w-full h-full">
                  <img
                    src={currentUser.avatar}
                    alt="Votre story"
                    className="w-full h-full object-cover opacity-50"
                  />
                  <Plus className="w-6 h-6 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow" />
                </div>
              ) : (
                <Plus className="w-6 h-6 text-[var(--text-secondary)]" />
              )}
            </div>
            <span className="text-[11px] text-[var(--text-secondary)] w-16 text-center truncate">
              Votre story
            </span>
          </button>

          {/* User stories */}
          {mockStories.map((story, idx) => (
            <button key={story.user.id ?? idx} onClick={() => setViewingStory(story)} className="flex flex-col items-center gap-1.5 flex-shrink-0 group">
              <div
                className={cn(
                  "w-16 h-16 rounded-full p-[2.5px] transition-transform group-hover:scale-105",
                  !story.viewed
                    ? "bg-gradient-to-br from-[#C4956A] to-[#D4A574]"
                    : "bg-white/10"
                )}
              >
                <div className="w-full h-full rounded-full bg-[var(--background)] overflow-hidden flex items-center justify-center text-sm font-semibold text-[#C4956A]">
                  {story.user.avatar ? (
                    <img
                      src={story.user.avatar}
                      alt={story.user.firstName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      {story.user.firstName[0]}
                      {story.user.lastName[0]}
                    </>
                  )}
                </div>
              </div>
              <span className="text-[11px] text-[var(--text-secondary)] w-16 text-center truncate">
                {story.user.firstName}
              </span>
            </button>
          ))}
        </div>

        {/* Fade edges */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-[#080808] to-transparent" />
      </div>

      {/* Story creation panel */}
      <AnimatePresence>
        {showStoryCreation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--foreground)]">Créer une story</h3>
                <button onClick={() => { setShowStoryCreation(false); setStoryFile(null); }} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <input
                ref={storyFileRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setStoryFile(file.name);
                }}
              />
              <button
                onClick={() => storyFileRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--card-border)] py-8 text-sm text-[var(--text-muted)] hover:border-[#C4956A]/30 hover:text-[var(--text-secondary)] transition-colors"
              >
                <Camera className="w-5 h-5" />
                {storyFile ? storyFile : "Ajouter une photo ou vidéo"}
              </button>
              <button
                onClick={handleStoryPublish}
                disabled={!storyFile}
                className="w-full rounded-xl bg-[#C4956A] py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#D4A574] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Publier votre story
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Story toast */}
      <AnimatePresence>
        {storyToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-8 left-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-xl bg-[var(--card)] border border-[#C4956A]/30 shadow-xl shadow-black/40"
          >
            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-green-400" />
            </div>
            <span className="text-sm text-[var(--foreground)] font-medium">Story publiée !</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen story viewer modal */}
      <AnimatePresence>
        {viewingStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setViewingStory(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md mx-4 aspect-[9/16] rounded-2xl bg-[var(--card)] border border-[var(--card-border)] overflow-hidden flex flex-col"
            >
              {/* Progress bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-10">
                <div
                  className="h-full bg-[#C4956A] transition-[width] duration-100"
                  style={{ width: `${storyProgress}%` }}
                />
              </div>

              {/* Header */}
              <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C4956A] to-[#D4A574] flex items-center justify-center text-[10px] font-bold text-black">
                    {viewingStory.user.firstName[0]}{viewingStory.user.lastName[0]}
                  </div>
                  <span className="text-sm font-semibold text-[var(--foreground)] drop-shadow">
                    {viewingStory.user.firstName} {viewingStory.user.lastName}
                  </span>
                </div>
                <button onClick={() => setViewingStory(null)} className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Story content */}
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#C4956A]/20 via-[#0e0e0e] to-[#080808]">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#C4956A] to-[#D4A574] flex items-center justify-center text-2xl font-bold text-black">
                    {viewingStory.user.firstName[0]}{viewingStory.user.lastName[0]}
                  </div>
                  <p className="text-white font-semibold">{viewingStory.user.firstName} {viewingStory.user.lastName}</p>
                  <p className="text-[var(--text-secondary)] text-sm mt-1">Story de {viewingStory.user.firstName}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Create post ────────────────────────────────────────

function CreatePost() {
  const [expanded, setExpanded] = useState(false);
  const [content, setContent] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<{ name: string; isVideo: boolean }[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_CHARS = 2000;

  // @ mention state for create post
  const [showCreateMention, setShowCreateMention] = useState(false);
  const [createMentionFilter, setCreateMentionFilter] = useState("");
  const [createMentionStart, setCreateMentionStart] = useState(-1);
  const [postLocation, setPostLocation] = useState("");
  const [showLocationInput, setShowLocationInput] = useState(false);

  const filteredCreateMentionUsers = useMemo(() => {
    if (!createMentionFilter) return suggestedUsers.slice(0, 5);
    const q = createMentionFilter.toLowerCase();
    return suggestedUsers.filter(
      (u) =>
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [createMentionFilter]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= MAX_CHARS) {
      setContent(val);
    }
    // Auto-height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
    // Detect @ mention
    const cursorPos = e.target.selectionStart || 0;
    const textBeforeCursor = val.slice(0, cursorPos);
    const atMatch = textBeforeCursor.match(/@(\w*)$/);
    if (atMatch) {
      setShowCreateMention(true);
      setCreateMentionFilter(atMatch[1]);
      setCreateMentionStart(cursorPos - atMatch[0].length);
    } else {
      setShowCreateMention(false);
      setCreateMentionFilter("");
    }
  };

  const handlePublish = () => {
    if (!content.trim()) return;
    setShowToast(true);
    setContent("");
    setSelectedFiles([]);
    setExpanded(false);
    setTimeout(() => setShowToast(false), 2500);
  };

  const isVideoFile = (name: string) => /\.(mp4|mov|webm|avi|mkv)$/i.test(name);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles((prev) => [...prev, ...files.map((f) => ({ name: f.name, isVideo: isVideoFile(f.name) }))]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files.map((f) => ({ name: f.name, isVideo: isVideoFile(f.name) }))]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <div className="rounded-xl bg-[var(--card)] border border-[var(--card-border)] p-4">
        {/* Collapsed */}
        <div className="flex items-center gap-3">
          <Avatar user={currentUser} />
          <button
            onClick={() => setExpanded(true)}
            className="flex-1 text-left px-4 py-2.5 rounded-full bg-[var(--card-border)] text-[var(--text-muted)] text-sm hover:bg-[var(--card)] transition-colors"
          >
            Quoi de neuf dans l&apos;immobilier ?
          </button>
        </div>

        {/* Action buttons row */}
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-[var(--card-border)]">
          {[
            { icon: Camera, label: "Photo/Vidéo", color: "text-blue-400" },
            { icon: Home, label: "Bien immobilier", color: "text-green-400" },
            { icon: MapPin, label: "Localisation", color: "text-red-400" },
            { icon: PenLine, label: "Article", color: "text-violet-400" },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => { setExpanded(true); if (action.label === "Localisation") setShowLocationInput(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[var(--text-secondary)] hover:bg-[var(--card-border)] transition-colors flex-1 justify-center"
            >
              <action.icon className={cn("w-4 h-4", action.color)} />
              <span className="hidden sm:inline">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Expanded form */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-[var(--card-border)] space-y-3">
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={handleTextareaChange}
                    placeholder="Partagez une actualité, un bien, ou une analyse..."
                    className="w-full bg-[var(--card)] rounded-xl p-4 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] resize-none focus:outline-none focus:ring-1 focus:ring-[#C4956A]/30 min-h-[120px] border border-[var(--card-border)] transition-colors"
                    autoFocus
                  />
                  {/* Character count */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <span
                      className={cn(
                        "text-[11px] font-medium transition-colors",
                        content.length > MAX_CHARS * 0.9
                          ? content.length >= MAX_CHARS
                            ? "text-red-400"
                            : "text-amber-400"
                          : "text-[var(--text-muted)]"
                      )}
                    >
                      {content.length}/{MAX_CHARS}
                    </span>
                  </div>
                  {/* @ Mention dropdown for create post */}
                  <AnimatePresence>
                    {showCreateMention && filteredCreateMentionUsers.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="absolute top-full mt-1 left-0 w-56 rounded-xl bg-[var(--card)] border border-[var(--card-border)] shadow-2xl shadow-black/60 overflow-hidden z-30"
                      >
                        {filteredCreateMentionUsers.map((user) => (
                          <button
                            key={user.id}
                            onClick={() => {
                              const before = content.slice(0, createMentionStart);
                              const after = content.slice(
                                createMentionStart + 1 + createMentionFilter.length
                              );
                              setContent(`${before}@${user.firstName} ${after}`);
                              setShowCreateMention(false);
                              setTimeout(() => textareaRef.current?.focus(), 50);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-[var(--card-border)] transition-colors"
                          >
                            <Avatar user={user} size="sm" />
                            <div className="text-left">
                              <span className="text-[var(--foreground)] font-medium">
                                {user.firstName} {user.lastName}
                              </span>
                              <p className="text-[var(--text-muted)] text-[10px]">{user.city}</p>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Location input */}
                <AnimatePresence>
                  {showLocationInput && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <input
                          type="text"
                          value={postLocation}
                          onChange={(e) => setPostLocation(e.target.value)}
                          placeholder="Ajouter une localisation..."
                          className="flex-1 bg-[var(--card)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[#C4956A]/30 border border-[var(--card-border)]"
                        />
                        <button onClick={() => { setShowLocationInput(false); setPostLocation(""); }} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"><X className="w-4 h-4" /></button>
                      </div>
                      {postLocation && (
                        <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 text-red-400 text-xs">
                          <MapPin className="w-3 h-3" />
                          {postLocation}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Media upload zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer",
                    dragOver
                      ? "border-[#C4956A]/60 bg-[#C4956A]/5"
                      : "border-[var(--card-border)] hover:border-[#C4956A]/30"
                  )}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <ImageIcon
                    className={cn(
                      "w-8 h-8 mx-auto mb-2 transition-colors",
                      dragOver ? "text-[#C4956A]/60" : "text-[var(--text-muted)]"
                    )}
                  />
                  <p className="text-xs text-[var(--text-muted)]">
                    Glissez vos photos ou vidéos, ou cliquez pour ajouter
                  </p>
                  {selectedFiles.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 justify-center">
                      {selectedFiles.map((file, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C4956A]/10 text-[#C4956A] text-[11px]"
                        >
                          {file.isVideo ? <Play className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                          {file.name}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFiles((prev) => prev.filter((_, j) => j !== i));
                            }}
                            className="hover:text-[var(--foreground)] transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post type selector */}
                <div className="flex items-center gap-2">
                  {["Post", "Bien immobilier", "Article"].map((type) => (
                    <button
                      key={type}
                      className="px-3 py-1.5 rounded-full text-xs border border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[#C4956A]/40 hover:text-[#C4956A] transition-colors"
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      setExpanded(false);
                      setContent("");
                      setSelectedFiles([]);
                    }}
                    className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-secondary)] transition-colors px-3 py-1.5"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handlePublish}
                    className="px-6 py-2 rounded-full bg-[#C4956A] text-white text-sm font-medium hover:bg-[#D4A574] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={!content.trim()}
                  >
                    Publier
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Success toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-8 left-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-xl bg-[var(--card)] border border-[#C4956A]/30 shadow-xl shadow-black/40"
          >
            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-green-400" />
            </div>
            <span className="text-sm text-[var(--foreground)] font-medium">Publication créée !</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Share menu ─────────────────────────────────────────

function ShareMenu({
  postId,
  onClose,
  onRepost,
}: {
  postId: string;
  onClose: () => void;
  onRepost?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/feed/${postId}` : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback: ignore */
    }
  };

  const handleWhatsApp = () => {
    window.open(
      `https://web.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
    onClose();
  };

  const handleEmail = () => {
    window.open(
      `mailto:?subject=${encodeURIComponent("Découvrez ce post sur E-Dome")}&body=${encodeURIComponent(shareUrl)}`,
      "_self"
    );
    onClose();
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -4 }}
      className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-52 rounded-xl bg-[var(--card)] border border-[var(--card-border)] shadow-2xl shadow-black/60 overflow-hidden z-30"
    >
      {onRepost && (
        <button
          onClick={() => { onRepost(); onClose(); }}
          className="w-full flex items-center gap-3 px-4 py-3 text-xs text-[#C4956A] hover:bg-[#C4956A]/10 transition-colors font-medium"
        >
          <ArrowRight className="w-4 h-4" />
          <span>Republier sur mon fil</span>
        </button>
      )}
      <button
        onClick={handleCopy}
        className="w-full flex items-center gap-3 px-4 py-3 text-xs text-[var(--text-secondary)] hover:bg-[var(--card-border)] hover:text-[var(--foreground)] transition-colors"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Link2 className="w-4 h-4" />
        )}
        <span>{copied ? "Copié !" : "Copier le lien"}</span>
      </button>
      <button
        onClick={handleWhatsApp}
        className="w-full flex items-center gap-3 px-4 py-3 text-xs text-[var(--text-secondary)] hover:bg-[var(--card-border)] hover:text-[var(--foreground)] transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span>WhatsApp</span>
      </button>
      <button
        onClick={handleEmail}
        className="w-full flex items-center gap-3 px-4 py-3 text-xs text-[var(--text-secondary)] hover:bg-[var(--card-border)] hover:text-[var(--foreground)] transition-colors"
      >
        <Mail className="w-4 h-4" />
        <span>Email</span>
      </button>
    </motion.div>
  );
}

// ─── Post card ──────────────────────────────────────────

function PostCard({ post, onHide, onDelete }: { post: SocialPost; onHide?: () => void; onDelete?: () => void }) {
  const { formatPrice } = useApp();
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [likeCount, setLikeCount] = useState(post.likes);
  const [shareOpen, setShareOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [playingVideos, setPlayingVideos] = useState<Record<number, boolean>>({});
  const [videoProgress, setVideoProgress] = useState<Record<number, number>>({});
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const moreRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  // Task 1: Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Task 2: Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [displayContent, setDisplayContent] = useState(post.content);
  const [wasEdited, setWasEdited] = useState(false);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Task 3: @ mention state for comment input
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [mentionStartIdx, setMentionStartIdx] = useState(-1);

  const isOwnPost = post.author.id === currentUser.id;

  const filteredMentionUsers = useMemo(() => {
    if (!mentionFilter) return suggestedUsers.slice(0, 5);
    const q = mentionFilter.toLowerCase();
    return suggestedUsers.filter(
      (u) =>
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [mentionFilter]);

  // Close more dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    if (moreOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [moreOpen]);

  // Auto-play/pause videos on scroll (Instagram-style)
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    Object.entries(videoRefs.current).forEach(([key, video]) => {
      if (!video) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            video.play().catch(() => {});
            setPlayingVideos((prev) => ({ ...prev, [Number(key)]: true }));
          } else {
            video.pause();
            setPlayingVideos((prev) => ({ ...prev, [Number(key)]: false }));
          }
        },
        { threshold: [0, 0.6] }
      );
      observer.observe(video);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  });

  const isLongText = displayContent.length > 200;
  const displayText = isLongText && !showFullText ? displayContent.slice(0, 200) : displayContent;

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  // Render content with highlighted hashtags and @mentions
  const renderContent = (text: string) => {
    return text.split(/(#\w+|@\w+)/g).map((part, i) =>
      part.startsWith("#") ? (
        <span key={i} onClick={(e) => { e.stopPropagation(); router.push(`/recherche?q=${encodeURIComponent(part)}`); }} className="text-[#C4956A] hover:underline cursor-pointer">
          {part}
        </span>
      ) : part.startsWith("@") ? (
        <span key={i} className="text-[#C4956A] font-medium cursor-pointer hover:underline">
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  // Media grid
  const renderMedia = () => {
    const images = post.media.filter((m) => m.type === "image");
    const videos = post.media.filter((m) => m.type === "video");

    if (images.length === 0 && videos.length === 0) return null;

    return (
      <div className="mt-3 -mx-4">
        {images.length === 1 && (
          <div className="aspect-[16/10] relative overflow-hidden bg-[var(--card)]">
            <img
              src={images[0].url}
              alt="Photo publication"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          </div>
        )}
        {images.length === 2 && (
          <div className="grid grid-cols-2 gap-0.5">
            {images.map((img, i) => (
              <div key={i} className="aspect-square relative overflow-hidden bg-[var(--card)]">
                <img
                  src={img.url}
                  alt="Photo publication"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
        {images.length >= 3 && (
          <div className="grid grid-cols-2 gap-0.5">
            <div className="aspect-square relative overflow-hidden bg-[var(--card)] row-span-2">
              <img
                src={images[0].url}
                alt="Photo publication"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>
            <div className="aspect-square relative overflow-hidden bg-[var(--card)]">
              <img
                src={images[1].url}
                alt="Photo publication"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square relative overflow-hidden bg-[var(--card)]">
              <img
                src={images[2].url}
                alt="Photo publication"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {images.length > 3 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xl font-semibold">
                  +{images.length - 3}
                </div>
              )}
            </div>
          </div>
        )}
        {videos.map((vid, i) => {
          const isPlaying = playingVideos[i];
          return (
            <div key={i} className="aspect-video bg-[var(--card)] relative mt-0.5 overflow-hidden group">
              <video
                ref={(el) => { videoRefs.current[i] = el; }}
                src={vid.url}
                className="absolute inset-0 w-full h-full object-cover"
                preload="metadata"
                playsInline
                muted
                loop
                poster={post.property?.images?.[0]}
                onTimeUpdate={(e) => {
                  const v = e.currentTarget;
                  if (v.duration) setVideoProgress((prev) => ({ ...prev, [i]: (v.currentTime / v.duration) * 100 }));
                }}
              />
              {/* Play/Pause overlay — visible on hover or when paused */}
              <button
                onClick={() => {
                  const video = videoRefs.current[i];
                  if (!video) return;
                  if (video.paused) {
                    video.play();
                    setPlayingVideos((prev) => ({ ...prev, [i]: true }));
                  } else {
                    video.pause();
                    setPlayingVideos((prev) => ({ ...prev, [i]: false }));
                  }
                }}
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
                  isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100 bg-black/20"
                )}
              >
                <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                  {isPlaying ? (
                    <div className="flex gap-1">
                      <div className="w-1.5 h-5 bg-white rounded-full" />
                      <div className="w-1.5 h-5 bg-white rounded-full" />
                    </div>
                  ) : (
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  )}
                </div>
              </button>
              {/* Mute/Unmute button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const video = videoRefs.current[i];
                  if (video) video.muted = !video.muted;
                }}
                className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors z-10"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              </button>
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
                <div
                  className="h-full bg-[#C4956A] transition-[width] duration-200"
                  style={{ width: `${videoProgress[i] || 0}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-[var(--card)] border border-[var(--card-border)] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-start gap-3 p-4 pb-0">
        <Link href={`/profil/${post.author.id}`} className="flex items-center gap-2.5 min-w-0 shrink-0">
          <Avatar user={post.author} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/profil/${post.author.id}`} className="font-semibold text-sm text-[var(--foreground)] hover:text-[#C4956A] transition-colors">
              {post.author.firstName} {post.author.lastName}
            </Link>
            <span
              className={cn(
                "text-[10px] px-2 py-0.5 rounded-full font-medium",
                roleBadgeBg[post.author.activeRole] || "bg-white/10 text-[var(--text-secondary)]"
              )}
            >
              {roleLabels[post.author.activeRole]}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] mt-0.5">
            <span>{post.author.city}</span>
            <span>·</span>
            <span>{timeAgo(post.createdAt)}</span>
            {wasEdited && (
              <>
                <span>·</span>
                <span className="italic text-[var(--text-muted)]">(modifié)</span>
              </>
            )}
          </div>
        </div>
        <div ref={moreRef} className="relative">
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className="p-1.5 rounded-lg hover:bg-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          <AnimatePresence>
            {moreOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                className="absolute right-0 top-full mt-1 w-52 rounded-xl bg-[var(--card)] border border-[var(--card-border)] shadow-2xl shadow-black/60 overflow-hidden z-30"
              >
                {/* Edit — own post only */}
                {isOwnPost && (
                  <button
                    onClick={() => {
                      setMoreOpen(false);
                      setEditContent(displayContent);
                      setIsEditing(true);
                      setTimeout(() => editTextareaRef.current?.focus(), 50);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs text-[var(--text-secondary)] hover:bg-[var(--card-border)] hover:text-[var(--foreground)] transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    <span>Modifier</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    const url = typeof window !== "undefined" ? `${window.location.origin}/feed/${post.id}` : "";
                    navigator.clipboard.writeText(url);
                    setMoreOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs text-[var(--text-secondary)] hover:bg-[var(--card-border)] hover:text-[var(--foreground)] transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copier le lien</span>
                </button>
                <button
                  onClick={() => setMoreOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs text-[var(--text-secondary)] hover:bg-[var(--card-border)] hover:text-[var(--foreground)] transition-colors"
                >
                  <Flag className="w-4 h-4" />
                  <span>Signaler</span>
                </button>
                <button
                  onClick={() => {
                    setMoreOpen(false);
                    onHide?.();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs text-[var(--text-secondary)] hover:bg-[var(--card-border)] hover:text-red-400 transition-colors"
                >
                  <EyeOff className="w-4 h-4" />
                  <span>Ne plus afficher</span>
                </button>
                <button
                  onClick={() => setMoreOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs text-[var(--text-secondary)] hover:bg-[var(--card-border)] hover:text-[#C4956A] transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Suivre l&apos;auteur</span>
                </button>
                {/* Delete — own post only */}
                {isOwnPost && (
                  <button
                    onClick={() => {
                      setMoreOpen(false);
                      setShowDeleteConfirm(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Supprimer</span>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-3">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              ref={editTextareaRef}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-[var(--card)] rounded-xl p-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] resize-none focus:outline-none focus:ring-1 focus:ring-[#C4956A]/30 min-h-[80px] border border-[var(--card-border)] transition-colors"
            />
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(displayContent);
                }}
                className="px-4 py-1.5 rounded-lg text-xs text-[var(--text-secondary)] hover:text-[var(--text-secondary)] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setDisplayContent(editContent);
                  setWasEdited(true);
                  setIsEditing(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-[#C4956A] text-black text-xs font-medium hover:bg-[#D4A574] transition-colors"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-line">
            {renderContent(displayText)}
            {isLongText && !showFullText && (
              <>
                {"... "}
                <button
                  onClick={() => setShowFullText(true)}
                  className="text-[#C4956A] hover:underline text-sm"
                >
                  voir plus
                </button>
              </>
            )}
          </p>
        )}
      </div>

      {/* Media */}
      {renderMedia()}

      {/* Property link */}
      {post.property && (
        <Link href={`/explorer/${post.property.id}`} className="block mx-4 mt-3 rounded-lg border border-[var(--card-border)] overflow-hidden hover:border-[var(--card-border)] transition-colors cursor-pointer group">
          <div className="flex">
            <div className="w-24 h-20 bg-[var(--card-border)] flex-shrink-0 relative">
              <div className="absolute inset-0 flex items-center justify-center text-[var(--text-muted)] text-[10px]">
                {post.property.type}
              </div>
            </div>
            <div className="flex-1 p-2.5 min-w-0">
              <p className="text-xs font-medium text-[var(--foreground)] truncate">{post.property.title}</p>
              <p className="text-[#C4956A] text-sm font-bold mt-0.5">
                {formatPrice(post.property.price, post.property.currency)}
                {post.property.transactionType !== "vente" && (
                  <span className="text-[var(--text-muted)] font-normal text-xs"> /mois</span>
                )}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)] mt-0.5">
                <MapPin className="w-3 h-3" />
                <span>
                  {post.property.location.city}, {post.property.location.country}
                </span>
              </div>
            </div>
            <div className="flex items-center pr-3">
              <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[#C4956A] transition-colors" />
            </div>
          </div>
          {/* Investment analytics bar — vente & terrain only */}
          {post.property.analytics && (post.property.transactionType === "vente" || post.property.type === "terrain") && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 border-t border-[var(--card-border)] text-[11px] text-[var(--text-secondary)]">
              <TrendingUp className="w-3 h-3 text-[#C4956A] flex-shrink-0" />
              {post.property.analytics.rendementBrut != null && (
                <span>
                  Rendement:{" "}
                  <span className="text-[#C4956A]">{post.property.analytics.rendementBrut}%</span>
                </span>
              )}
              {post.property.analytics.dpe && (
                <span>
                  {" "}· DPE:{" "}
                  <span className="text-[#C4956A]">{post.property.analytics.dpe}</span>
                </span>
              )}
              {post.property.analytics.potentielPlusValue && (
                <span>
                  {" "}· Potentiel:{" "}
                  <span className="text-[#C4956A]">{post.property.analytics.potentielPlusValue}</span>
                </span>
              )}
            </div>
          )}
        </Link>
      )}

      {/* Stats */}
      <div className="px-4 py-2 mt-2 flex items-center gap-1 text-xs text-[var(--text-muted)]">
        <span>{formatCount(likeCount)} j&apos;aime</span>
        <span>·</span>
        <button
          onClick={() => setShowComments(!showComments)}
          className="hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
        >
          {formatCount(post.comments.length)} commentaires
        </button>
        <span>·</span>
        <span>{formatCount(post.shares)} partages</span>
      </div>

      {/* Action bar */}
      <div className="flex items-center border-t border-[var(--card-border)] px-2">
        <button
          onClick={handleLike}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2.5 text-sm transition-colors flex-1 justify-center rounded-lg hover:bg-[var(--card-border)]",
            liked ? "text-red-500" : "text-[var(--text-secondary)] hover:text-[var(--text-secondary)]"
          )}
        >
          <Heart className={cn("w-[18px] h-[18px]", liked && "fill-current")} />
          <span className="text-xs">J&apos;aime</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-secondary)] transition-colors flex-1 justify-center rounded-lg hover:bg-[var(--card-border)]"
        >
          <MessageCircle className="w-[18px] h-[18px]" />
          <span className="text-xs">Commenter</span>
        </button>
        <div className="relative flex-1">
          <button
            onClick={() => setShareOpen(!shareOpen)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5 text-sm transition-colors w-full justify-center rounded-lg hover:bg-[var(--card-border)]",
              shareOpen ? "text-[#C4956A]" : "text-[var(--text-secondary)] hover:text-[var(--text-secondary)]"
            )}
          >
            <Share2 className="w-[18px] h-[18px]" />
            <span className="text-xs">Partager</span>
          </button>
          <AnimatePresence>
            {shareOpen && (
              <ShareMenu postId={post.id} onClose={() => setShareOpen(false)} />
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={() => setSaved(!saved)}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2.5 text-sm transition-colors flex-1 justify-center rounded-lg hover:bg-[var(--card-border)]",
            saved ? "text-[#C4956A]" : "text-[var(--text-secondary)] hover:text-[var(--text-secondary)]"
          )}
        >
          <Bookmark className={cn("w-[18px] h-[18px]", saved && "fill-current")} />
          <span className="text-xs hidden sm:inline">Sauvegarder</span>
        </button>
      </div>

      {/* Comments section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[var(--card-border)]"
          >
            <div className="p-4 space-y-3">
              {post.comments.length > 2 && !showAllComments && (
                <button
                  onClick={() => setShowAllComments(true)}
                  className="text-xs text-[var(--text-secondary)] hover:text-[#C4956A] transition-colors"
                >
                  Voir les {post.comments.length} commentaires
                </button>
              )}

              {(showAllComments ? post.comments : post.comments.slice(0, 3)).map((comment) => (
                <div key={comment.id} className="flex gap-2.5">
                  <Link href={`/profil/${comment.author.id}`} className="shrink-0">
                    <Avatar user={comment.author} size="sm" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="bg-[var(--card)] rounded-xl px-3 py-2">
                      <Link href={`/profil/${comment.author.id}`} className="text-xs font-semibold text-[var(--foreground)] hover:text-[#C4956A] transition-colors">
                        {comment.author.firstName} {comment.author.lastName}
                      </Link>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 px-2 text-[11px] text-[var(--text-muted)]">
                      <span>{timeAgo(comment.createdAt)}</span>
                      <button
                        onClick={() => setLikedComments((prev) => {
                          const next = new Set(prev);
                          if (next.has(comment.id)) next.delete(comment.id);
                          else next.add(comment.id);
                          return next;
                        })}
                        className={cn("hover:text-[var(--text-secondary)] transition-colors", likedComments.has(comment.id) && "text-red-400")}
                      >
                        J&apos;aime
                      </button>
                      <button
                        onClick={() => {
                          setCommentText(`@${comment.author.firstName} `);
                          setTimeout(() => commentInputRef.current?.focus(), 50);
                        }}
                        className="hover:text-[var(--text-secondary)] transition-colors"
                      >
                        Répondre
                      </button>
                      {comment.likes > 0 && (
                        <span className="flex items-center gap-0.5">
                          <Heart className="w-3 h-3" />
                          {comment.likes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Comment input with @ mention support */}
              <div className="flex gap-2.5 pt-1">
                <Avatar user={currentUser} size="sm" />
                <div className="flex-1 relative">
                  <div className="flex items-center gap-2 bg-[var(--card-border)] rounded-full px-4 py-2">
                    <input
                      ref={commentInputRef}
                      type="text"
                      value={commentText}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCommentText(val);
                        // Detect @ mention
                        const cursorPos = e.target.selectionStart || 0;
                        const textBeforeCursor = val.slice(0, cursorPos);
                        const atMatch = textBeforeCursor.match(/@(\w*)$/);
                        if (atMatch) {
                          setShowMentionDropdown(true);
                          setMentionFilter(atMatch[1]);
                          setMentionStartIdx(cursorPos - atMatch[0].length);
                        } else {
                          setShowMentionDropdown(false);
                          setMentionFilter("");
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && commentText.trim()) {
                          setCommentText("");
                          setShowMentionDropdown(false);
                        }
                        if (e.key === "Escape") setShowMentionDropdown(false);
                      }}
                      placeholder="Écrire un commentaire..."
                      className="flex-1 bg-transparent text-xs text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        if (commentText.trim()) {
                          setCommentText("");
                          setShowMentionDropdown(false);
                        }
                      }}
                      className={cn(
                        "transition-colors",
                        commentText.trim()
                          ? "text-[#C4956A] hover:text-[#D4A574]"
                          : "text-[var(--text-muted)]"
                      )}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  {/* @ Mention dropdown */}
                  <AnimatePresence>
                    {showMentionDropdown && filteredMentionUsers.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="absolute bottom-full mb-1 left-0 w-56 rounded-xl bg-[var(--card)] border border-[var(--card-border)] shadow-2xl shadow-black/60 overflow-hidden z-30"
                      >
                        {filteredMentionUsers.map((user) => (
                          <button
                            key={user.id}
                            onClick={() => {
                              const before = commentText.slice(0, mentionStartIdx);
                              const after = commentText.slice(
                                mentionStartIdx + 1 + mentionFilter.length
                              );
                              setCommentText(`${before}@${user.firstName} ${after}`);
                              setShowMentionDropdown(false);
                              setTimeout(() => commentInputRef.current?.focus(), 50);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-[var(--card-border)] transition-colors"
                          >
                            <Avatar user={user} size="sm" />
                            <div className="text-left">
                              <span className="text-[var(--foreground)] font-medium">
                                {user.firstName} {user.lastName}
                              </span>
                              <p className="text-[var(--text-muted)] text-[10px]">{user.city}</p>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm mx-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] p-6 space-y-4"
            >
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                Supprimer cette publication ?
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Cette action est irréversible. La publication sera définitivement supprimée.
              </p>
              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)]/70 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    onDelete?.();
                  }}
                  className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Right sidebar ──────────────────────────────────────

function RightSidebar() {
  const router = useRouter();
  const { isFollowing, toggleFollow } = useApp();

  return (
    <div className="w-[300px] flex-shrink-0 hidden lg:block space-y-4">
      {/* Suggestions */}
      <div className="rounded-xl bg-[var(--card)] border border-[var(--card-border)] p-4">
        <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Suggestions</h3>
        <div className="space-y-3">
          {mockSuggestions.map((user) => {
            const isFollowed = isFollowing(user.id);
            return (
              <div key={user.id} className="flex items-center gap-3">
                <Link href={`/profil/${user.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar user={user} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)] hover:text-[#C4956A] transition-colors truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">{roleLabels[user.activeRole]} · {user.city}</p>
                  </div>
                </Link>
                <button
                  onClick={() => toggleFollow(user.id)}
                  className={cn(
                    "text-xs font-medium transition-colors px-3 py-1 rounded-full border",
                    isFollowed
                      ? "border-[var(--card-border)] bg-transparent text-[var(--text-secondary)] hover:text-[var(--foreground)]"
                      : "border-[#C4956A]/30 bg-[#C4956A] text-black hover:bg-[#D4A574]"
                  )}
                >
                  {isFollowed ? "Suivi \u2713" : "Suivre"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trending */}
      <div className="rounded-xl bg-[var(--card)] border border-[var(--card-border)] p-4">
        <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#C4956A]" />
          Tendances
        </h3>
        <div className="space-y-2.5">
          {mockTrending.slice(0, 6).map((trend) => (
            <button
              key={trend.tag}
              onClick={() => router.push(`/recherche?q=${encodeURIComponent("#" + trend.tag)}`)}
              className="block w-full text-left hover:bg-[var(--card-border)] -mx-2 px-2 py-1 rounded-lg transition-colors"
            >
              <p className="text-sm text-[#C4956A]">#{trend.tag}</p>
              <p className="text-[11px] text-[var(--text-muted)]">{formatCount(trend.posts)} publications</p>
            </button>
          ))}
        </div>
      </div>

      {/* Events */}
      <div className="rounded-xl bg-[var(--card)] border border-[var(--card-border)] p-4">
        <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#C4956A]" />
          Événements
        </h3>
        <div className="space-y-3">
          {mockEvents.map((event) => (
            <Link
              key={event.id}
              href="/evenements"
              className="block p-3 rounded-lg bg-[var(--card)] border border-[var(--card-border)] hover:border-[var(--card-border)] transition-colors cursor-pointer"
            >
              <p className="text-xs font-medium text-[var(--foreground)]">{event.title}</p>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[var(--text-muted)]">
                <span>
                  {new Date(event.date).toLocaleDateString("fr-CH", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                <span>·</span>
                <span>{event.time}</span>
                <span>·</span>
                <span>{event.location}</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[11px] text-[var(--text-muted)]">
                  {event.registered}/{event.spots} inscrits
                </span>
                <span className="text-[11px] text-[#C4956A]">S&apos;inscrire</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Scroll-to-top button ───────────────────────────────

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-[var(--card)] border border-[var(--card-border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[#C4956A] hover:border-[#C4956A]/30 transition-colors shadow-lg shadow-black/40"
          aria-label="Retour en haut"
        >
          <ArrowUp className="w-4 h-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ─── Main page ──────────────────────────────────────────

type FeedTab = "foryou" | "following" | "trending";

const INITIAL_POSTS = 5;
const LOAD_MORE_COUNT = 3;

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<FeedTab>("foryou");
  const [hiddenPosts, setHiddenPosts] = useState<Set<string>>(new Set());
  const [deletedPosts, setDeletedPosts] = useState<Set<string>>(new Set());

  // Infinite scroll state
  const [visibleCount, setVisibleCount] = useState(INITIAL_POSTS);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const tabs: { key: FeedTab; label: string }[] = [
    { key: "foryou", label: "Pour vous" },
    { key: "following", label: "Suivis" },
    { key: "trending", label: "Tendances" },
  ];

  // Simple filter simulation
  const filteredPosts = useMemo(() => {
    let posts = mockPosts.filter(
      (p) => !hiddenPosts.has(p.id) && !deletedPosts.has(p.id)
    );
    if (activeTab === "trending") {
      posts = [...posts].sort((a, b) => b.likes - a.likes);
    }
    return posts;
  }, [activeTab, hiddenPosts, deletedPosts]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const allLoaded = visibleCount >= filteredPosts.length;

  // Reset visible count when tab changes
  useEffect(() => {
    setVisibleCount(INITIAL_POSTS);
  }, [activeTab]);

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    if (allLoaded || isLoadingMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoadingMore && !allLoaded) {
          setIsLoadingMore(true);
          // Simulate loading delay
          setTimeout(() => {
            setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
            setIsLoadingMore(false);
          }, 800);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [allLoaded, isLoadingMore, visibleCount]);

  return (
    <>
      <div className="flex gap-6 justify-center max-w-[960px] mx-auto">
        {/* Main column */}
        <div className="flex-1 max-w-[600px] min-w-0 space-y-4">
          {/* Stories */}
          <StoriesBar />

          {/* Create post */}
          <CreatePost />

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-[var(--card-border)]">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "relative px-4 py-3 text-sm font-medium transition-colors",
                  activeTab === tab.key
                    ? "text-[#C4956A]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-secondary)]"
                )}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="feedTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C4956A] rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Posts */}
          <div className="space-y-4">
            <AnimatePresence>
              {visiblePosts.map((post) => (
                <motion.div
                  key={post.id}
                  layout
                  exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: "hidden" }}
                  transition={{ duration: 0.3 }}
                >
                  <PostCard
                    post={post}
                    onHide={() => setHiddenPosts((prev) => new Set(prev).add(post.id))}
                    onDelete={() => setDeletedPosts((prev) => new Set(prev).add(post.id))}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading spinner */}
            {isLoadingMore && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-6 h-6 text-[#C4956A] animate-spin" />
              </div>
            )}

            {/* Sentinel for infinite scroll */}
            {!allLoaded && !isLoadingMore && (
              <div ref={sentinelRef} className="h-4" />
            )}

            {/* All loaded message */}
            {allLoaded && filteredPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center py-8"
              >
                <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <Check className="w-4 h-4 text-[#C4956A]" />
                  <span>Vous êtes à jour !</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <RightSidebar />
      </div>

      {/* Scroll-to-top FAB */}
      <ScrollToTop />
    </>
  );
}
