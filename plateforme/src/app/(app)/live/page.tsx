"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio,
  Calendar,
  Clock,
  Users,
  Play,
  Eye,
  MessageCircle,
  Send,
  Hand,
  Share2,
  X,
  Plus,
  Video,
  ChevronRight,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/context";
import { currentUser } from "@/lib/mock-data";

// ─── Types ──────────────────────────────────────────────

interface LiveEvent {
  id: string;
  title: string;
  type: "conference" | "seminaire" | "visite" | "formation" | "qa";
  date: string;
  time: string;
  description: string;
  speaker: { name: string; role: string; initials: string };
  viewerCount: number;
  duration?: string;
  isLive: boolean;
  isPast: boolean;
  thumbnail?: string;
}

interface ChatMessage {
  id: string;
  author: string;
  initials: string;
  content: string;
  time: string;
}

// ─── Mock data ──────────────────────────────────────────

const typeLabels: Record<string, string> = {
  conference: "Conférence",
  seminaire: "Séminaire",
  visite: "Visite virtuelle",
  formation: "Formation live",
  qa: "Q&A",
};

const typeColors: Record<string, string> = {
  conference: "bg-blue-500/15 text-blue-400",
  seminaire: "bg-purple-500/15 text-purple-400",
  visite: "bg-emerald-500/15 text-emerald-400",
  formation: "bg-[#C4956A]/15 text-[#C4956A]",
  qa: "bg-orange-500/15 text-orange-400",
};

const mockLives: LiveEvent[] = [
  {
    id: "live-1",
    title: "Marché immobilier suisse 2026 : tendances et opportunités",
    type: "conference",
    date: "2026-03-22",
    time: "14:00",
    description: "Analyse complète du marché immobilier suisse avec les dernières données et prévisions.",
    speaker: { name: "Marc Dupont", role: "Analyste immobilier", initials: "MD" },
    viewerCount: 147,
    isLive: true,
    isPast: false,
  },
  {
    id: "live-2",
    title: "Visite virtuelle : Penthouse de luxe à Genève",
    type: "visite",
    date: "2026-03-25",
    time: "10:00",
    description: "Découvrez ce penthouse exceptionnel de 250m² avec vue panoramique sur le lac Léman.",
    speaker: { name: "Sophie Martin", role: "Agence immobilière", initials: "SM" },
    viewerCount: 0,
    isLive: false,
    isPast: false,
  },
  {
    id: "live-3",
    title: "Formation : Optimiser son rendement locatif",
    type: "formation",
    date: "2026-03-28",
    time: "16:00",
    description: "Stratégies avancées pour maximiser le retour sur investissement de vos biens locatifs.",
    speaker: { name: "Amina Diallo", role: "Formatrice", initials: "AD" },
    viewerCount: 0,
    isLive: false,
    isPast: false,
  },
  {
    id: "live-4",
    title: "Q&A : Tout savoir sur l'apport d'affaires immobilier",
    type: "qa",
    date: "2026-04-02",
    time: "18:00",
    description: "Session de questions-réponses sur le métier d'apporteur d'affaires.",
    speaker: { name: "Karim Benali", role: "Apporteur", initials: "KB" },
    viewerCount: 0,
    isLive: false,
    isPast: false,
  },
];

const pastLives: LiveEvent[] = [
  {
    id: "past-1",
    title: "Séminaire : Investir dans l'immobilier en Afrique",
    type: "seminaire",
    date: "2026-03-15",
    time: "14:00",
    description: "Panorama des opportunités d'investissement immobilier sur le continent africain.",
    speaker: { name: "Ousmane Diop", role: "Investisseur", initials: "OD" },
    viewerCount: 342,
    duration: "1h 23min",
    isLive: false,
    isPast: true,
  },
  {
    id: "past-2",
    title: "Formation : Les bases de la gestion locative",
    type: "formation",
    date: "2026-03-10",
    time: "10:00",
    description: "Apprenez les fondamentaux de la gestion de biens locatifs.",
    speaker: { name: "Amina Diallo", role: "Formatrice", initials: "AD" },
    viewerCount: 528,
    duration: "2h 05min",
    isLive: false,
    isPast: true,
  },
  {
    id: "past-3",
    title: "Conférence : Digitalisation du secteur immobilier",
    type: "conference",
    date: "2026-03-05",
    time: "16:00",
    description: "Comment la technologie transforme le marché immobilier.",
    speaker: { name: "Jean-Pierre Müller", role: "Expert PropTech", initials: "JM" },
    viewerCount: 891,
    duration: "1h 45min",
    isLive: false,
    isPast: true,
  },
  {
    id: "past-4",
    title: "Visite virtuelle : Villa contemporaine à Lausanne",
    type: "visite",
    date: "2026-02-28",
    time: "11:00",
    description: "Visite immersive d'une villa d'architecte de 400m².",
    speaker: { name: "Sophie Martin", role: "Agence", initials: "SM" },
    viewerCount: 234,
    duration: "45min",
    isLive: false,
    isPast: true,
  },
];

const initialChatMessages: ChatMessage[] = [
  { id: "c1", author: "Sophie M.", initials: "SM", content: "Très intéressant ! Quelle est la tendance pour Genève ?", time: "14:02" },
  { id: "c2", author: "Jean-Pierre", initials: "JP", content: "Les prix au m² ont augmenté de 3.2% ce trimestre", time: "14:05" },
  { id: "c3", author: "Amina D.", initials: "AD", content: "Est-ce que la hausse des taux a un impact significatif ?", time: "14:08" },
  { id: "c4", author: "Marc D.", initials: "MD", content: "Oui, mais le marché suisse reste résilient comparé aux voisins européens", time: "14:10" },
  { id: "c5", author: "Ousmane D.", initials: "OD", content: "Quelles régions recommandez-vous pour l'investissement locatif ?", time: "14:12" },
];

// ─── Component ──────────────────────────────────────────

export default function LivePage() {
  const { activeRole, availableRoles } = useApp();
  const canCreateLive = ["formateur", "agence"].some((r) => availableRoles.includes(r as any));

  const [activeTab, setActiveTab] = useState<"live" | "upcoming" | "replays">("live");
  const [watchingLive, setWatchingLive] = useState<LiveEvent | null>(null);
  const [watchingReplay, setWatchingReplay] = useState<LiveEvent | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [newChatMsg, setNewChatMsg] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Create form state
  const [createForm, setCreateForm] = useState({
    title: "",
    type: "conference" as string,
    date: "",
    time: "",
    description: "",
  });

  const activeLive = mockLives.find((l) => l.isLive);
  const upcomingLives = mockLives.filter((l) => !l.isLive && !l.isPast);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleSendChat = () => {
    if (!newChatMsg.trim()) return;
    const msg: ChatMessage = {
      id: `c-${Date.now()}`,
      author: "Vous",
      initials: `${currentUser.firstName[0]}${currentUser.lastName[0]}`,
      content: newChatMsg.trim(),
      time: new Date().toLocaleTimeString("fr-CH", { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages((prev) => [...prev, msg]);
    setNewChatMsg("");
  };

  const handleCreateLive = () => {
    if (!createForm.title || !createForm.date || !createForm.time) return;
    setShowCreateModal(false);
    setCreateForm({ title: "", type: "conference", date: "", time: "", description: "" });
    showToast("Live planifié avec succès !");
  };

  // ─── Watching a live stream ───────────────────────────
  if (watchingLive) {
    return (
      <div className="flex h-[calc(100vh-7rem)] overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card)]">
        {/* Video area */}
        <div className="flex flex-1 flex-col">
          {/* Video */}
          <div className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0e0e0e]">
            {/* LIVE badge */}
            <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                <span className="text-xs font-bold text-white">LIVE</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-black/60 px-3 py-1.5 backdrop-blur-sm">
                <Eye className="h-3.5 w-3.5 text-white/70" />
                <span className="text-xs font-medium text-white/70">{watchingLive.viewerCount} spectateurs</span>
              </div>
            </div>

            {/* Back button */}
            <button
              onClick={() => setWatchingLive(null)}
              className="absolute right-4 top-4 z-10 rounded-lg bg-black/60 p-2 text-white/70 backdrop-blur-sm transition hover:bg-black/80 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Simulated video content */}
            <div className="flex flex-col items-center gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#C4956A]/20 text-3xl font-bold text-[#C4956A]">
                {watchingLive.speaker.initials}
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-white">{watchingLive.title}</h2>
                <p className="mt-2 text-sm text-white/50">{watchingLive.speaker.name} - {watchingLive.speaker.role}</p>
              </div>
            </div>

            {/* Bottom controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              {/* Speaker info card */}
              <div className="flex items-center gap-3 rounded-xl bg-black/60 px-4 py-3 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C4956A]/20 text-sm font-bold text-[#C4956A]">
                  {watchingLive.speaker.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{watchingLive.speaker.name}</p>
                  <p className="text-[11px] text-white/50">{watchingLive.speaker.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Lever la main */}
                <button
                  onClick={() => {
                    setHandRaised(!handRaised);
                    if (!handRaised) showToast("Main levée !");
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition",
                    handRaised
                      ? "bg-[#C4956A]/20 text-[#C4956A] ring-1 ring-[#C4956A]/30"
                      : "bg-black/60 text-white/70 backdrop-blur-sm hover:text-white"
                  )}
                >
                  <Hand className="h-4 w-4" />
                  <span className="hidden sm:inline">Lever la main</span>
                </button>

                {/* Partager */}
                <button
                  onClick={() => showToast("Lien copié !")}
                  className="flex items-center gap-2 rounded-xl bg-black/60 px-4 py-2.5 text-sm font-medium text-white/70 backdrop-blur-sm transition hover:text-white"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Partager</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat sidebar */}
        <div className="flex w-[340px] flex-shrink-0 flex-col border-l border-[var(--card-border)]">
          <div className="flex items-center justify-between border-b border-[var(--card-border)] px-4 py-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-[#C4956A]" />
              <h3 className="text-sm font-semibold text-white">Chat en direct</h3>
            </div>
            <span className="rounded-full bg-[#C4956A]/15 px-2 py-0.5 text-[10px] font-semibold text-[#C4956A]">
              {chatMessages.length}
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--card-border)] text-[10px] font-bold text-white/60">
                  {msg.initials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white/80">{msg.author}</span>
                    <span className="text-[10px] text-white/30">{msg.time}</span>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-white/60">{msg.content}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Chat input */}
          <div className="border-t border-[var(--card-border)] p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newChatMsg}
                onChange={(e) => setNewChatMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                placeholder="Écrire un message..."
                className="flex-1 rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-xs text-white placeholder-[var(--text-muted)] outline-none transition focus:border-[#C4956A]/50"
              />
              <button
                onClick={handleSendChat}
                disabled={!newChatMsg.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C4956A] text-black transition hover:bg-[#D4A574] disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Toast */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed right-6 top-6 z-50 rounded-xl border border-[#C4956A]/30 bg-[var(--card)] px-6 py-3 text-sm font-medium text-[#C4956A] shadow-2xl"
            >
              {toastMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ─── Watching a replay ────────────────────────────────
  if (watchingReplay) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setWatchingReplay(null)}
          className="flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          Retour aux replays
        </button>

        <div className="overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)]">
          {/* Video area */}
          <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0e0e0e]">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#C4956A]/10">
                <Play className="h-10 w-10 text-[#C4956A]" />
              </div>
              <p className="text-sm text-white/50">Lecture du replay</p>
            </div>

            {/* Badge */}
            <div className="absolute left-4 top-4 flex items-center gap-2">
              <span className={cn("rounded-lg px-3 py-1 text-xs font-semibold", typeColors[watchingReplay.type])}>
                {typeLabels[watchingReplay.type]}
              </span>
              {watchingReplay.duration && (
                <span className="rounded-lg bg-black/60 px-3 py-1 text-xs text-white/60 backdrop-blur-sm">
                  {watchingReplay.duration}
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="p-6">
            <h2 className="text-xl font-bold text-white">{watchingReplay.title}</h2>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C4956A]/20 text-xs font-bold text-[#C4956A]">
                  {watchingReplay.speaker.initials}
                </div>
                <span className="text-sm text-white/70">{watchingReplay.speaker.name}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-white/40">
                <Eye className="h-3.5 w-3.5" />
                {watchingReplay.viewerCount} vues
              </div>
              <span className="text-sm text-white/40">
                {new Date(watchingReplay.date).toLocaleDateString("fr-CH", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/50">{watchingReplay.description}</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main page ────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed right-6 top-6 z-50 rounded-xl border border-[#C4956A]/30 bg-[var(--card)] px-6 py-3 text-sm font-medium text-[#C4956A] shadow-2xl"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10">
            <Radio className="h-6 w-6 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Live</h1>
            <p className="text-sm text-white/50">Conférences, séminaires et formations en direct</p>
          </div>
        </div>
        {canCreateLive && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-xl bg-[#C4956A] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#D4A574]"
          >
            <Plus className="h-4 w-4" />
            Planifier un live
          </button>
        )}
      </motion.div>

      {/* Active live banner */}
      {activeLive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="group cursor-pointer overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-r from-red-500/10 via-[#0e0e0e] to-[#0e0e0e] p-6 transition-all hover:border-red-500/30"
          onClick={() => setWatchingLive(activeLive)}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/20 text-lg font-bold text-red-400">
                  {activeLive.speaker.initials}
                </div>
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 ring-2 ring-[#0e0e0e]">
                  <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-md bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    EN DIRECT
                  </span>
                  <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-semibold", typeColors[activeLive.type])}>
                    {typeLabels[activeLive.type]}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-semibold text-white group-hover:text-[#C4956A] transition-colors">
                  {activeLive.title}
                </h3>
                <p className="mt-1 text-sm text-white/50">
                  {activeLive.speaker.name} · {activeLive.viewerCount} spectateurs
                </p>
              </div>
            </div>
            <button
              className="flex items-center gap-2 rounded-xl bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              <Play className="h-4 w-4" />
              Rejoindre
            </button>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-xl border border-[var(--card-border)] bg-[var(--background)] p-1 w-fit">
        {[
          { key: "live" as const, label: "En direct", count: activeLive ? 1 : 0 },
          { key: "upcoming" as const, label: "À venir", count: upcomingLives.length },
          { key: "replays" as const, label: "Replays", count: pastLives.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
              activeTab === tab.key
                ? "bg-[#C4956A]/20 text-[#C4956A]"
                : "text-white/40 hover:text-white/70"
            )}
          >
            {tab.label}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                activeTab === tab.key
                  ? "bg-[#C4956A]/20 text-[#C4956A]"
                  : "bg-white/[0.06] text-white/30"
              )}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {/* No active live */}
        {activeTab === "live" && !activeLive && (
          <motion.div
            key="no-live"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] py-16"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--card)]">
              <Radio className="h-10 w-10 text-[var(--text-muted)]" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-white">Aucun live en cours</h2>
              <p className="mt-1 text-sm text-white/40">
                Consultez les prochains lives programmés ou regardez les replays
              </p>
            </div>
          </motion.div>
        )}

        {/* Active live tab (with live) */}
        {activeTab === "live" && activeLive && (
          <motion.div
            key="active-live"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8 text-sm text-white/40"
          >
            Cliquez sur le live en direct ci-dessus pour le rejoindre
          </motion.div>
        )}

        {/* Upcoming */}
        {activeTab === "upcoming" && (
          <motion.div
            key="upcoming"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {upcomingLives.length === 0 ? (
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] py-16">
                <Calendar className="h-10 w-10 text-[var(--text-muted)]" />
                <p className="text-sm text-white/40">Aucun live programmé</p>
              </div>
            ) : (
              upcomingLives.map((live, i) => (
                <motion.div
                  key={live.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex flex-col gap-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/[0.05] text-lg font-bold text-white/40">
                      {live.speaker.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-semibold", typeColors[live.type])}>
                          {typeLabels[live.type]}
                        </span>
                      </div>
                      <h3 className="mt-1.5 font-semibold text-white">{live.title}</h3>
                      <p className="mt-1 text-sm text-white/40">{live.speaker.name} · {live.speaker.role}</p>
                      <p className="mt-2 text-xs text-white/30">{live.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 flex-col items-end gap-2">
                    <div className="flex items-center gap-1.5 text-sm text-[#C4956A]">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(live.date).toLocaleDateString("fr-CH", { day: "numeric", month: "long" })}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-white/40">
                      <Clock className="h-3.5 w-3.5" />
                      {live.time}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* Replays */}
        {activeTab === "replays" && (
          <motion.div
            key="replays"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {pastLives.map((live, i) => (
              <motion.div
                key={live.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setWatchingReplay(live)}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)] transition-all hover:border-[#C4956A]/20"
              >
                {/* Thumbnail */}
                <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#111]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white/40 transition-all group-hover:bg-[#C4956A]/20 group-hover:text-[#C4956A]">
                    <Play className="h-7 w-7" />
                  </div>
                  {/* Duration badge */}
                  {live.duration && (
                    <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-2 py-0.5 text-[10px] font-medium text-white/80">
                      {live.duration}
                    </span>
                  )}
                  {/* Type badge */}
                  <span className={cn("absolute left-2 top-2 rounded-md px-2 py-0.5 text-[10px] font-semibold", typeColors[live.type])}>
                    {typeLabels[live.type]}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="line-clamp-2 text-sm font-semibold text-white group-hover:text-[#C4956A] transition-colors">
                    {live.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-3 text-xs text-white/40">
                    <span>{live.speaker.name}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {live.viewerCount}
                    </span>
                    <span>
                      {new Date(live.date).toLocaleDateString("fr-CH", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Create Live Modal ─── */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="mx-4 w-full max-w-lg rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                    <Video className="h-5 w-5 text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Planifier un live</h3>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg p-1.5 text-white/40 transition hover:bg-white/[0.05] hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Titre */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Titre</label>
                  <input
                    type="text"
                    value={createForm.title}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    placeholder="Ex: Analyse du marché immobilier 2026"
                    className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm text-white placeholder-[var(--text-muted)] outline-none transition focus:border-[#C4956A]/50"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Type</label>
                  <select
                    value={createForm.type}
                    onChange={(e) => setCreateForm({ ...createForm, type: e.target.value })}
                    className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#C4956A]/50"
                  >
                    <option value="conference">Conférence</option>
                    <option value="seminaire">Séminaire</option>
                    <option value="visite">Visite virtuelle</option>
                    <option value="formation">Formation live</option>
                    <option value="qa">Q&A</option>
                  </select>
                </div>

                {/* Date & time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Date</label>
                    <input
                      type="date"
                      value={createForm.date}
                      onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })}
                      className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#C4956A]/50"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Heure</label>
                    <input
                      type="time"
                      value={createForm.time}
                      onChange={(e) => setCreateForm({ ...createForm, time: e.target.value })}
                      className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#C4956A]/50"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Description</label>
                  <textarea
                    rows={3}
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    placeholder="Décrivez le contenu de votre live..."
                    className="w-full resize-none rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm text-white placeholder-[var(--text-muted)] outline-none transition focus:border-[#C4956A]/50"
                  />
                </div>
              </div>

              <button
                onClick={handleCreateLive}
                disabled={!createForm.title || !createForm.date || !createForm.time}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C4956A] py-3 text-sm font-semibold text-black transition hover:bg-[#D4A574] disabled:opacity-40"
              >
                <Calendar className="h-4 w-4" />
                Planifier
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
