"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  Video,
  Info,
  Check,
  CheckCheck,
  MessageCircle,
  Image as ImageIcon,
  FileText,
  MapPin,
  ArrowLeft,
  Camera,
  Trash2,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils";
import { currentUser, mockUsers } from "@/lib/mock-data";
import type { User, Message } from "@/lib/types";
import { Avatar } from "@/components/ui/avatar";

// ─── Mock conversation data ────────────────────────────

interface ConversationItem {
  id: string;
  participant: User;
  messages: Message[];
  unreadCount: number;
}

const initialConversations: ConversationItem[] = [
  {
    id: "conv1",
    participant: mockUsers[1],
    unreadCount: 2,
    messages: [
      { id: "m1-1", senderId: mockUsers[1].id, content: "Bonjour Karim !", createdAt: new Date(Date.now() - 24 * 3600000).toISOString(), read: true },
      { id: "m1-2", senderId: currentUser.id, content: "Bonjour Sophie, comment allez-vous ?", createdAt: new Date(Date.now() - 24 * 3600000 + 60000).toISOString(), read: true },
      { id: "m1-3", senderId: mockUsers[1].id, content: "Tr\u00e8s bien merci ! J'ai vu votre annonce pour l'appartement au centre de Gen\u00e8ve.", createdAt: new Date(Date.now() - 24 * 3600000 + 120000).toISOString(), read: true },
      { id: "m1-4", senderId: currentUser.id, content: "Oui, il est toujours disponible ! C'est un 4.5 pi\u00e8ces au 4\u00e8me \u00e9tage avec vue sur le lac.", createdAt: new Date(Date.now() - 23 * 3600000).toISOString(), read: true },
      { id: "m1-5", senderId: mockUsers[1].id, content: "C'est exactement ce que je cherche pour un de mes clients. Le prix est n\u00e9gociable ?", createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), read: true },
      { id: "m1-6", senderId: currentUser.id, content: "On peut en discuter lors d'une visite. Quand seriez-vous disponible ?", createdAt: new Date(Date.now() - 1 * 3600000).toISOString(), read: true },
      { id: "m1-7", senderId: mockUsers[1].id, content: "Je suis disponible jeudi ou vendredi apr\u00e8s-midi. Qu'est-ce qui vous arrange ?", createdAt: new Date(Date.now() - 5 * 60000).toISOString(), read: false },
    ],
  },
  {
    id: "conv2",
    participant: mockUsers[2],
    unreadCount: 0,
    messages: [
      { id: "m2-1", senderId: mockUsers[2].id, content: "Bonjour, je cherche des opportunit\u00e9s d'investissement \u00e0 Z\u00fcrich.", createdAt: new Date(Date.now() - 48 * 3600000).toISOString(), read: true },
      { id: "m2-2", senderId: currentUser.id, content: "J'ai quelques biens int\u00e9ressants \u00e0 vous proposer.", createdAt: new Date(Date.now() - 47 * 3600000).toISOString(), read: true },
      { id: "m2-3", senderId: mockUsers[2].id, content: "Pouvez-vous m'envoyer les d\u00e9tails ?", createdAt: new Date(Date.now() - 4 * 3600000).toISOString(), read: true },
      { id: "m2-4", senderId: currentUser.id, content: "Parfait, on peut organiser une visite la semaine prochaine.", createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), read: true },
    ],
  },
  {
    id: "conv3",
    participant: mockUsers[3],
    unreadCount: 0,
    messages: [
      { id: "m3-1", senderId: currentUser.id, content: "Bonjour Amina, j'ai vu que vous proposez une formation sur la gestion locative.", createdAt: new Date(Date.now() - 48 * 3600000).toISOString(), read: true },
      { id: "m3-2", senderId: mockUsers[3].id, content: "Oui ! C'est une formation compl\u00e8te de 12 modules. Elle couvre la recherche de locataires, la gestion des conflits et bien plus.", createdAt: new Date(Date.now() - 47 * 3600000).toISOString(), read: true },
      { id: "m3-3", senderId: currentUser.id, content: "Merci pour les informations ! Je m'inscris d\u00e8s demain.", createdAt: new Date(Date.now() - 24 * 3600000).toISOString(), read: true },
    ],
  },
  {
    id: "conv4",
    participant: mockUsers[4],
    unreadCount: 0,
    messages: [
      { id: "m4-1", senderId: mockUsers[4].id, content: "Bonjour, je suis int\u00e9ress\u00e9 par votre chalet \u00e0 Verbier.", createdAt: new Date(Date.now() - 72 * 3600000).toISOString(), read: true },
      { id: "m4-2", senderId: currentUser.id, content: "Bonjour Jean ! Oui, il est disponible pour la saison.", createdAt: new Date(Date.now() - 71 * 3600000).toISOString(), read: true },
      { id: "m4-3", senderId: mockUsers[4].id, content: "Quel est le prix pour une semaine ?", createdAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString(), read: true },
    ],
  },
  {
    id: "conv5",
    participant: mockUsers[5],
    unreadCount: 1,
    messages: [
      { id: "m5-1", senderId: mockUsers[5].id, content: "Salut Karim ! La villa \u00e0 Dakar est pr\u00eate pour la saison.", createdAt: new Date(Date.now() - 10 * 24 * 3600000).toISOString(), read: true },
      { id: "m5-2", senderId: currentUser.id, content: "Super nouvelle ! Les r\u00e9servations ont commenc\u00e9 ?", createdAt: new Date(Date.now() - 9 * 24 * 3600000).toISOString(), read: true },
      { id: "m5-3", senderId: mockUsers[5].id, content: "Oui, j'ai d\u00e9j\u00e0 3 r\u00e9servations pour cet \u00e9t\u00e9 !", createdAt: new Date(Date.now() - 7 * 24 * 3600000).toISOString(), read: false },
    ],
  },
];

// ─── Helpers ────────────────────────────────────────────

function getDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (24 * 3600000));
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  return new Intl.DateTimeFormat("fr-CH", { day: "numeric", month: "long" }).format(date);
}

function getTime(dateStr: string): string {
  return new Intl.DateTimeFormat("fr-CH", { hour: "2-digit", minute: "2-digit" }).format(new Date(dateStr));
}

function getLastSeenLabel(user: User): string {
  // Simulated last seen based on user index
  const hours = mockUsers.indexOf(user);
  if (hours <= 0) return "Derni\u00e8re connexion il y a 1h";
  if (hours <= 3) return `Derni\u00e8re connexion il y a ${hours}h`;
  return `Derni\u00e8re connexion il y a ${hours}h`;
}

// ─── Component ──────────────────────────────────────────

const EMOJI_LIST = ["😀","❤️","👍","🏠","🔑","💰","📸","🎉","✨","🙏","👏","😍","🤝","💪","🏡","🌟","✅","📊","🎯","💡","🔥","⭐","📱","🚀","💎","🏆","👋","🎊","😊","🌈"];

export default function MessagesPage() {
  const [conversations, setConversations] = useState<ConversationItem[]>(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [typingTimeout, setTypingTimeoutState] = useState<NodeJS.Timeout | null>(null);
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);
  const [deletedMsgIds, setDeletedMsgIds] = useState<Set<string>>(new Set());
  // Video call state
  const [inCall, setInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeConv = conversations.find((c) => c.id === selectedConversation);

  const filteredConversations = conversations.filter((conv) => {
    const name = `${conv.participant.firstName} ${conv.participant.lastName}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  // Auto-scroll to bottom when messages change or conversation selected
  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [selectedConversation, conversations]);

  // Simulated typing indicator - when user types, show "other is typing" after 2s
  const handleInputChange = useCallback((value: string) => {
    setNewMessage(value);

    if (typingTimeout) clearTimeout(typingTimeout);

    if (value.trim()) {
      const timeout = setTimeout(() => {
        setIsTyping(true);
        // Hide typing after 3 seconds
        setTimeout(() => setIsTyping(false), 3000);
      }, 2000);
      setTypingTimeoutState(timeout);
    } else {
      setIsTyping(false);
    }
  }, [typingTimeout]);

  // Group messages by date
  const groupedMessages: { label: string; messages: Message[] }[] = [];
  if (activeConv) {
    let currentLabel = "";
    for (const msg of activeConv.messages) {
      const label = getDateLabel(msg.createdAt);
      if (label !== currentLabel) {
        currentLabel = label;
        groupedMessages.push({ label, messages: [] });
      }
      groupedMessages[groupedMessages.length - 1].messages.push(msg);
    }
  }

  const handleSend = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      content: newMessage.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation
          ? { ...conv, messages: [...conv.messages, newMsg] }
          : conv
      )
    );

    setNewMessage("");
    setIsTyping(false);
    if (typingTimeout) clearTimeout(typingTimeout);
  };

  const handleSendPhoto = () => {
    if (!selectedConversation) return;
    const photoMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      content: "📷 Photo",
      createdAt: new Date().toISOString(),
      read: false,
      isPhoto: true,
    };
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation
          ? { ...conv, messages: [...conv.messages, photoMsg] }
          : conv
      )
    );
    setShowAttachMenu(false);
  };

  const handleDeleteMessage = (msgId: string) => {
    setDeletedMsgIds((prev) => new Set(prev).add(msgId));
    setSelectedMsgId(null);
  };

  const handleInsertEmoji = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  // Video call handlers
  const startCall = () => {
    setInCall(true);
    setCallDuration(0);
    setIsMuted(false);
    setIsCameraOff(false);
    callTimerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  const endCall = () => {
    setInCall(false);
    setCallDuration(0);
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
  };

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // Find the last message of active conversation for "Vu" indicator
  const lastOwnMessage = activeConv
    ? [...activeConv.messages].reverse().find((m) => m.senderId === currentUser.id)
    : null;

  return (
    <>
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
    <div className="flex h-[calc(100vh-7rem)] overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card)]">
      {/* ─── Left panel: Conversations ─── */}
      <div className={cn(
        "flex w-full md:w-[380px] flex-shrink-0 flex-col border-r border-[var(--card-border)]",
        mobileShowChat ? "hidden md:flex" : "flex"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--card-border)] p-4">
          <h1 className="text-lg font-semibold text-[var(--foreground)]">Messages</h1>
          <span className="rounded-full bg-[#C4956A]/20 px-2.5 py-0.5 text-xs font-semibold text-[#C4956A]">
            {conversations.reduce((sum, c) => sum + c.unreadCount, 0)}
          </span>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--card)] py-2.5 pl-10 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none transition focus:border-[#C4956A]/50"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 && searchQuery && (
            <div className="p-6 text-center text-sm text-[var(--text-muted)]">
              Aucune conversation trouv\u00e9e
            </div>
          )}
          {filteredConversations.map((conv) => {
            const lastMsg = conv.messages[conv.messages.length - 1];
            const isActive = selectedConversation === conv.id;
            const isSent = lastMsg.senderId === currentUser.id;

            return (
              <button
                key={conv.id}
                onClick={() => { setSelectedConversation(conv.id); setMobileShowChat(true); }}
                className={cn(
                  "relative flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--card-border)]",
                  isActive && "bg-[var(--card-border)]"
                )}
              >
                {/* Active border */}
                {isActive && (
                  <div className="absolute left-0 top-0 h-full w-[3px] bg-[#C4956A]" />
                )}

                {/* Avatar */}
                <Avatar
                  src={conv.participant.avatar}
                  firstName={conv.participant.firstName}
                  lastName={conv.participant.lastName}
                  size="lg"
                  online={conv.participant.online}
                />

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--foreground)]">
                        {conv.participant.firstName} {conv.participant.lastName}
                      </span>
                      {conv.participant.online && (
                        <span className="text-[10px] text-green-400">En ligne</span>
                      )}
                    </div>
                    <span className="text-[11px] text-[var(--text-muted)]">{timeAgo(lastMsg.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 overflow-hidden">
                      {isSent && (
                        lastMsg.read ? (
                          <CheckCheck className="h-3 w-3 flex-shrink-0 text-blue-400" />
                        ) : (
                          <Check className="h-3 w-3 flex-shrink-0 text-[var(--text-muted)]" />
                        )
                      )}
                      <p className="truncate text-xs text-[var(--text-secondary)]">
                        {isSent && "Vous : "}
                        {lastMsg.content}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C4956A] px-1.5 text-[10px] font-bold text-black">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  {/* Offline last seen */}
                  {!conv.participant.online && (
                    <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">
                      {getLastSeenLabel(conv.participant)}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Right panel: Chat ─── */}
      <div className={cn(
        "relative flex flex-1 flex-col",
        mobileShowChat ? "flex" : "hidden md:flex"
      )}>
        {!activeConv ? (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--card)]">
              <MessageCircle className="h-10 w-10 text-[var(--text-muted)]" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Vos messages</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                S\u00e9lectionnez une conversation pour commencer
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="flex items-center justify-between border-b border-[var(--card-border)] px-6 py-3">
              <div className="flex items-center gap-3">
                {/* Mobile back button */}
                <button
                  onClick={() => setMobileShowChat(false)}
                  className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--card-border)] hover:text-[var(--foreground)] transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <Avatar
                  src={activeConv.participant.avatar}
                  firstName={activeConv.participant.firstName}
                  lastName={activeConv.participant.lastName}
                  size="md"
                  online={activeConv.participant.online}
                />
                <div>
                  <h2 className="text-sm font-semibold text-[var(--foreground)]">
                    <Link href={`/profil/${activeConv.participant.id}`} className="hover:text-[#C4956A] transition-colors">
                      {activeConv.participant.firstName} {activeConv.participant.lastName}
                    </Link>
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {activeConv.participant.online ? (
                      <span className="flex items-center gap-1">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                        En ligne
                      </span>
                    ) : (
                      (() => {
                        const hours = mockUsers.indexOf(activeConv.participant);
                        return `Vu il y a ${hours <= 0 ? 1 : hours}h`;
                      })()
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={startCall}
                  className="rounded-lg p-2 text-[var(--text-secondary)] transition hover:bg-[var(--card-border)] hover:text-[var(--foreground)]"
                >
                  <Video className="h-5 w-5" />
                </button>
                <button
                  onClick={() => { setToastMsg("Informations bientôt disponibles"); setTimeout(() => setToastMsg(null), 2000); }}
                  className="rounded-lg p-2 text-[var(--text-secondary)] transition hover:bg-[var(--card-border)] hover:text-[var(--foreground)]"
                >
                  <Info className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Video Call Overlay */}
            <AnimatePresence>
              {inCall && activeConv && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[var(--background)]"
                >
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0e0e0e] via-[#080808] to-[#0a0a0a]" />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center gap-8">
                    {/* Status badge */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-1.5"
                    >
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-medium text-emerald-400">Appel en cours...</span>
                    </motion.div>

                    {/* Avatars */}
                    <div className="flex items-center gap-12">
                      {/* Self */}
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col items-center gap-3"
                      >
                        <div className="relative">
                          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#C4956A] to-[#D4A574] text-2xl font-bold text-black ring-4 ring-[#C4956A]/20">
                            {currentUser.firstName[0]}{currentUser.lastName[0]}
                          </div>
                          {isCameraOff && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
                              <VideoOff className="h-8 w-8 text-[var(--text-secondary)]" />
                            </div>
                          )}
                          {isMuted && (
                            <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 ring-2 ring-[#080808]">
                              <MicOff className="h-3.5 w-3.5 text-white" />
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-medium text-[var(--foreground)]/70">Vous</span>
                      </motion.div>

                      {/* Participant */}
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center gap-3"
                      >
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] text-2xl font-bold text-[var(--text-secondary)] ring-4 ring-white/10">
                          {activeConv.participant.firstName[0]}{activeConv.participant.lastName[0]}
                        </div>
                        <span className="text-sm font-medium text-[var(--foreground)]/70">
                          {activeConv.participant.firstName} {activeConv.participant.lastName}
                        </span>
                      </motion.div>
                    </div>

                    {/* Timer */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-light tracking-wider text-[var(--text-secondary)] tabular-nums"
                    >
                      {formatCallDuration(callDuration)}
                    </motion.div>

                    {/* Controls */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center gap-4"
                    >
                      {/* Mute toggle */}
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={cn(
                          "flex h-14 w-14 items-center justify-center rounded-full transition-all",
                          isMuted
                            ? "bg-red-500/20 text-red-400 ring-2 ring-red-500/30"
                            : "bg-white/10 text-white hover:bg-white/15"
                        )}
                      >
                        {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                      </button>

                      {/* Camera toggle */}
                      <button
                        onClick={() => setIsCameraOff(!isCameraOff)}
                        className={cn(
                          "flex h-14 w-14 items-center justify-center rounded-full transition-all",
                          isCameraOff
                            ? "bg-red-500/20 text-red-400 ring-2 ring-red-500/30"
                            : "bg-white/10 text-white hover:bg-white/15"
                        )}
                      >
                        {isCameraOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
                      </button>

                      {/* End call */}
                      <button
                        onClick={endCall}
                        className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white transition-all hover:bg-red-600 hover:scale-105 active:scale-95"
                      >
                        <PhoneOff className="h-6 w-6" />
                      </button>
                    </motion.div>

                    {/* Raccrocher label */}
                    <button
                      onClick={endCall}
                      className="text-sm font-medium text-red-400/70 transition hover:text-red-400"
                    >
                      Raccrocher
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-6 py-4">
              {groupedMessages.map((group) => (
                <div key={group.label}>
                  {/* Date separator */}
                  <div className="my-4 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[var(--card-border)]" />
                    <span className="text-xs text-[var(--text-muted)]">{group.label}</span>
                    <div className="h-px flex-1 bg-[var(--card-border)]" />
                  </div>

                  {/* Messages */}
                  {group.messages.map((msg) => {
                    const isMine = msg.senderId === currentUser.id;
                    const isLastOwn = lastOwnMessage?.id === msg.id;
                    const isDeleted = deletedMsgIds.has(msg.id);
                    const isSelected = selectedMsgId === msg.id;
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn("mb-3 flex flex-col", isMine ? "items-end" : "items-start")}
                      >
                        <div className="relative">
                          <div
                            onClick={() => {
                              if (isMine && !isDeleted) {
                                setSelectedMsgId(isSelected ? null : msg.id);
                              }
                            }}
                            className={cn(
                              "max-w-[70%] rounded-2xl px-4 py-2.5",
                              isMine
                                ? "rounded-br-md bg-[#C4956A]/20 text-[var(--foreground)]"
                                : "rounded-bl-md bg-[var(--card)] text-[var(--foreground)]",
                              isMine && !isDeleted && "cursor-pointer"
                            )}
                          >
                            {isDeleted ? (
                              <p className="text-sm italic text-[var(--text-muted)]">Message supprimé</p>
                            ) : msg.isPhoto ? (
                              <div className="mb-1 flex h-32 w-48 items-center justify-center rounded-lg bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a]">
                                <Camera className="h-8 w-8 text-[#C4956A]/60" />
                              </div>
                            ) : (
                              <p className="text-sm leading-relaxed">{msg.content}</p>
                            )}
                            <div
                              className={cn(
                                "mt-1 flex items-center gap-1",
                                isMine ? "justify-end" : "justify-start"
                              )}
                            >
                              <span className="text-[10px] text-[var(--text-muted)]">{getTime(msg.createdAt)}</span>
                              {isMine && !isDeleted && (
                                msg.read ? (
                                  <CheckCheck className="h-3 w-3 text-blue-400" />
                                ) : (
                                  <Check className="h-3 w-3 text-[var(--text-muted)]" />
                                )
                              )}
                            </div>
                          </div>
                          {/* Delete tooltip */}
                          <AnimatePresence>
                            {isSelected && isMine && !isDeleted && (
                              <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="absolute -top-8 right-0 flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-[var(--card)] px-3 py-1.5 text-xs font-medium text-red-400 shadow-xl transition-colors hover:bg-red-500/10"
                              >
                                <Trash2 className="h-3 w-3" />
                                Supprimer
                              </motion.button>
                            )}
                          </AnimatePresence>
                        </div>
                        {isLastOwn && msg.read && !isDeleted && (
                          <span className="mt-0.5 text-[10px] text-[var(--text-muted)]">
                            Vu à {getTime(msg.createdAt)}
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && activeConv && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mb-3 flex justify-start"
                  >
                    <div className="rounded-2xl rounded-bl-md bg-[var(--card)] px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-[#888]" style={{ animationDelay: "0ms" }} />
                        <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-[#888]" style={{ animationDelay: "150ms" }} />
                        <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-[#888]" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-[var(--card-border)] px-6 py-4">
              <div className="flex items-center gap-3">
                {/* Attachment button with menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowAttachMenu(!showAttachMenu)}
                    className={cn(
                      "rounded-lg p-2 transition",
                      showAttachMenu
                        ? "bg-[var(--card-border)] text-[#C4956A]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--card-border)] hover:text-[var(--foreground)]"
                    )}
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>

                  <AnimatePresence>
                    {showAttachMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute bottom-12 left-0 z-20 w-44 overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card)] shadow-xl"
                      >
                        <button
                          onClick={handleSendPhoto}
                          className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--card-border)] hover:text-[var(--foreground)]"
                        >
                          <ImageIcon className="h-4 w-4 text-[#C4956A]" />
                          Photo
                        </button>
                        {[
                          { icon: FileText, label: "Document" },
                          { icon: MapPin, label: "Localisation" },
                        ].map((item) => (
                          <button
                            key={item.label}
                            onClick={() => setShowAttachMenu(false)}
                            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--card-border)] hover:text-[var(--foreground)]"
                          >
                            <item.icon className="h-4 w-4 text-[#C4956A]" />
                            {item.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Écrivez un message..."
                  value={newMessage}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none transition focus:border-[#C4956A]/50"
                />
                <div className="relative">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={cn(
                      "rounded-lg p-2 transition",
                      showEmojiPicker
                        ? "bg-[var(--card-border)] text-[#C4956A]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--card-border)] hover:text-[var(--foreground)]"
                    )}
                  >
                    <Smile className="h-5 w-5" />
                  </button>
                  <AnimatePresence>
                    {showEmojiPicker && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute bottom-12 right-0 z-20 grid w-[280px] grid-cols-6 gap-1 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-3 shadow-xl"
                      >
                        {EMOJI_LIST.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => handleInsertEmoji(emoji)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-lg transition-colors hover:bg-[var(--card-border)]"
                          >
                            {emoji}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C4956A] text-black transition hover:bg-[#D4A574] disabled:opacity-40 disabled:hover:bg-[#C4956A]"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
}
