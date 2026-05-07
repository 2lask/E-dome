"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import type { Conversation, Message } from "@/lib/types";
import { LottiePlayer } from "@/components/ui/lottie-player";

// ─── Mock data ──────────────────────────────────────────────────────────────

const currentUserId = "me";

const mockConversations: Conversation[] = [
  {
    id: "c1",
    participant: {
      id: "u1", firstName: "Sophie", lastName: "Martin", email: "s@e.ch", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      city: "Lausanne", country: "Suisse", roles: ["hote"], activeRole: "hote",
      stats: { followers: 120, following: 45, properties: 3, reviews: 28, rating: 4.8, transactions: 15, revenue: 24000 },
      bio: "",
    },
    messages: [
      { id: "m1", senderId: "u1", content: "Bonjour Léo ! Je suis intéressée par le Chalet Alpin.", timestamp: "2026-03-31T10:00:00", read: true },
      { id: "m2", senderId: currentUserId, content: "Bonjour Sophie ! Merci pour votre intérêt. Le chalet est disponible dès le 15 avril.", timestamp: "2026-03-31T10:05:00", read: true },
      { id: "m3", senderId: "u1", content: "Parfait ! Quel est le tarif pour une semaine ?", timestamp: "2026-03-31T10:10:00", read: true },
      { id: "m4", senderId: currentUserId, content: "Le tarif est de 1 800 CHF la semaine, petit-déjeuner inclus.", timestamp: "2026-03-31T10:15:00", read: true },
      { id: "m5", senderId: "u1", content: "Super, je voudrais réserver du 15 au 22 avril pour 4 personnes.", timestamp: "2026-04-01T08:30:00", read: false },
    ],
    unreadCount: 1,
    lastMessage: "Super, je voudrais réserver du 15 au 22 avril pour 4 personnes.",
    isOnline: true,
  },
  {
    id: "c2",
    participant: {
      id: "u2", firstName: "Jean", lastName: "Dupont", email: "j@e.ch", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      city: "Genève", country: "Suisse", roles: ["client"], activeRole: "client",
      stats: { followers: 30, following: 60, properties: 0, reviews: 5, rating: 4.2, transactions: 3, revenue: 0 },
      bio: "",
    },
    messages: [
      { id: "m6", senderId: "u2", content: "Bonjour, je cherche une villa avec piscine à Montreux.", timestamp: "2026-03-30T14:00:00", read: true },
      { id: "m7", senderId: currentUserId, content: "Bonjour Jean ! Je suis disponible pour organiser une visite. Quel créneau vous convient ?", timestamp: "2026-03-30T14:30:00", read: true },
      { id: "m8", senderId: "u2", content: "Samedi matin serait idéal, vers 10h.", timestamp: "2026-03-30T15:00:00", read: true },
      { id: "m9", senderId: currentUserId, content: "C'est noté ! Je vous envoie la confirmation par email.", timestamp: "2026-03-30T15:10:00", read: true },
    ],
    unreadCount: 0,
    lastMessage: "C'est noté ! Je vous envoie la confirmation par email.",
    isOnline: false,
  },
  {
    id: "c3",
    participant: {
      id: "u3", firstName: "Marie", lastName: "Leroy", email: "m@e.ch", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      city: "Zürich", country: "Suisse", roles: ["agence"], activeRole: "agence",
      stats: { followers: 250, following: 80, properties: 12, reviews: 45, rating: 4.9, transactions: 30, revenue: 85000 },
      bio: "",
    },
    messages: [
      { id: "m10", senderId: "u3", content: "Bonjour Léo, je cherche un appartement pour 3 mois à Lausanne.", timestamp: "2026-03-29T09:00:00", read: true },
      { id: "m11", senderId: currentUserId, content: "Bonjour Marie ! J'ai plusieurs biens disponibles en location moyenne durée.", timestamp: "2026-03-29T09:15:00", read: true },
      { id: "m12", senderId: "u3", content: "Idéal, pouvez-vous m'envoyer les détails ?", timestamp: "2026-03-29T09:20:00", read: true },
      { id: "m13", senderId: currentUserId, content: "Bien sûr ! Je vous prépare une sélection personnalisée.", timestamp: "2026-03-29T09:25:00", read: true },
    ],
    unreadCount: 0,
    lastMessage: "Bien sûr ! Je vous prépare une sélection personnalisée.",
    isOnline: true,
  },
  {
    id: "c4",
    participant: {
      id: "u4", firstName: "Amira", lastName: "El Fassi", email: "a@e.ch", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      city: "Marrakech", country: "Maroc", roles: ["hote"], activeRole: "hote",
      stats: { followers: 180, following: 90, properties: 5, reviews: 32, rating: 4.7, transactions: 12, revenue: 42000 },
      bio: "",
    },
    messages: [
      { id: "m14", senderId: "u4", content: "Bonjour Léo ! Je cherche un apporteur pour un riad à Marrakech.", timestamp: "2026-04-02T11:00:00", read: true },
      { id: "m15", senderId: currentUserId, content: "Bonjour Amira ! Je suis très intéressé. Quelles sont les conditions ?", timestamp: "2026-04-02T11:10:00", read: true },
      { id: "m16", senderId: "u4", content: "Commission 12%, tracking 30j. Bien à 480 000 CHF.", timestamp: "2026-04-02T11:15:00", read: false },
      { id: "m17", senderId: currentUserId, content: "Parfait, j'active mon lien dès maintenant.", timestamp: "2026-04-02T11:20:00", read: true },
    ],
    unreadCount: 1,
    lastMessage: "Parfait, j'active mon lien dès maintenant.",
    isOnline: false,
  },
];

const EMOJIS = [
  "😀","😂","🥰","😍","😎","🤩","😊","🙏","👍","👋",
  "❤️","🔥","✨","🎉","💪","🏠","🏡","🌟","💰","📞",
  "✅","🤝","💬","📋","🎯","🏆","💎","🌍","📍","🔑",
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function MessagesPage() {
  const [conversations, setConversations] = useState(mockConversations);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [typing, setTyping] = useState(false);
  const [deletedMessages, setDeletedMessages] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showNewConv, setShowNewConv] = useState(false);
  const [newConvSearch, setNewConvSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const callIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId) || null;

  const filteredConvs = conversations.filter((c) => {
    const name = `${c.participant.firstName} ${c.participant.lastName}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages.length]);

  // Simulate typing
  useEffect(() => {
    if (!activeConvId) return;
    const t = setTimeout(() => setTyping(true), 2000);
    const t2 = setTimeout(() => setTyping(false), 4000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [activeConvId]);

  // Call timer
  useEffect(() => {
    if (showVideoCall) {
      callIntervalRef.current = setInterval(() => setCallTimer((t) => t + 1), 1000);
    } else {
      if (callIntervalRef.current) clearInterval(callIntervalRef.current);
      setCallTimer(0);
    }
    return () => { if (callIntervalRef.current) clearInterval(callIntervalRef.current); };
  }, [showVideoCall]);

  const sendMessage = useCallback(() => {
    if (!message.trim() || !activeConvId) return;
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      senderId: currentUserId,
      content: message.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: newMsg.content }
          : c
      )
    );
    setMessage("");
    setShowEmoji(false);
  }, [message, activeConvId]);

  const deleteMessage = useCallback(
    (msgId: string) => {
      setDeletedMessages((prev) => new Set(prev).add(msgId));
      setConfirmDelete(null);
    },
    []
  );

  const formatTime = (ts: string) =>
    new Date(ts).toLocaleTimeString("fr-CH", { hour: "2-digit", minute: "2-digit" });

  const formatCallTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: Record<string, Message[]> = {};
    messages.forEach((m) => {
      const dateKey = new Date(m.timestamp).toLocaleDateString("fr-CH", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(m);
    });
    return groups;
  };

  // ── Mobile: show list or chat ──
  const showList = !activeConvId;

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden animate-fade-in">
      {/* Conversation List */}
      <div
        className={`${
          showList ? "flex" : "hidden"
        } md:flex flex-col w-full md:w-80 lg:w-96 border-r border-[var(--card-border)] bg-[var(--background)]`}
      >
        <div className="p-4 border-b border-[var(--card-border)]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <LottiePlayer src="/lottie/lottieflow-chat-17-9-000000-easey.json" width={32} height={32} />
              <h1 className="text-xl font-bold text-[var(--foreground)]">Messages</h1>
            </div>
            <button
              onClick={() => setShowNewConv(true)}
              className="w-8 h-8 rounded-full bg-[#1e9df1] text-white flex items-center justify-center hover:bg-[#b8845a] transition-colors"
              title="Nouvelle conversation"
            >
              <LottiePlayer src="/lottie/lottieflow-chat-17-1-000000-easey.json" width={24} height={24} />
            </button>
          </div>
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 text-sm rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)]"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConvs.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConvId(conv.id)}
              className={`w-full flex items-center gap-3 p-4 text-left hover:bg-[var(--hover-bg)] transition-colors border-b border-[var(--card-border)] ${
                activeConvId === conv.id ? "bg-[var(--hover-bg)]" : ""
              }`}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={conv.participant.avatar}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />
                {conv.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[var(--background)]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--foreground)] truncate">
                    {conv.participant.firstName} {conv.participant.lastName}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] flex-shrink-0">
                    {formatTime(conv.messages[conv.messages.length - 1]?.timestamp || "")}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs text-[var(--text-muted)] truncate">{conv.lastMessage}</span>
                  {conv.unreadCount > 0 && (
                    <span className="ml-2 w-5 h-5 rounded-full bg-[#1e9df1] text-white text-[10px] flex items-center justify-center flex-shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Panel */}
      <div
        className={`${
          !showList ? "flex" : "hidden"
        } md:flex flex-col flex-1 bg-[var(--background)]`}
      >
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b border-[var(--card-border)]">
              <button
                onClick={() => setActiveConvId(null)}
                className="md:hidden text-[var(--text-secondary)] hover:text-[var(--foreground)] mr-1"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <div className="relative">
                <img
                  src={activeConv.participant.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                {activeConv.isOnline && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[var(--background)]" />
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-[var(--foreground)]">
                  {activeConv.participant.firstName} {activeConv.participant.lastName}
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  {activeConv.isOnline ? "En ligne" : "Hors ligne"}
                </div>
              </div>
              <button
                onClick={() => setShowVideoCall(true)}
                className="p-2 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-secondary)]"
                title="Appel vidéo"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {Object.entries(groupMessagesByDate(activeConv.messages)).map(([date, msgs]) => (
                <div key={date}>
                  <div className="text-center mb-4">
                    <span className="text-xs text-[var(--text-muted)] bg-[var(--card)] px-3 py-1 rounded-full">
                      {date}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {msgs.map((msg) => {
                      const isMine = msg.senderId === currentUserId;
                      const isDeleted = deletedMessages.has(msg.id);
                      return (
                        <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`relative max-w-[75%] px-4 py-2.5 rounded-2xl text-sm cursor-pointer ${
                              isDeleted
                                ? "bg-[var(--card)] text-[var(--text-muted)] italic"
                                : isMine
                                ? "bg-[#1e9df1]/20 text-[var(--foreground)] rounded-br-md"
                                : "bg-[var(--card)] text-[var(--foreground)] rounded-bl-md"
                            }`}
                            onClick={() => {
                              if (isMine && !isDeleted) setConfirmDelete(msg.id);
                            }}
                          >
                            {isDeleted ? (
                              "Message supprimé"
                            ) : (
                              <>
                                <div>{msg.content}</div>
                                <div
                                  className={`text-[10px] mt-1 flex items-center gap-1 ${
                                    isMine ? "text-[#1e9df1]/60 justify-end" : "text-[var(--text-muted)]"
                                  }`}
                                >
                                  {formatTime(msg.timestamp)}
                                  {isMine && (
                                    <span>{msg.read ? "✓✓" : "✓"}</span>
                                  )}
                                </div>
                              </>
                            )}

                            {/* Delete confirm */}
                            {confirmDelete === msg.id && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteMessage(msg.id);
                                }}
                                className="absolute -top-8 right-0 px-3 py-1 text-xs rounded-lg bg-red-500 text-white shadow-lg"
                              >
                                Supprimer
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-[var(--card)] px-4 py-2.5 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[var(--card-border)]">
              {/* Emoji picker */}
              {showEmoji && (
                <div className="mb-2 p-3 bg-[var(--card)] border border-[var(--card-border)] rounded-xl">
                  <div className="grid grid-cols-10 gap-1">
                    {EMOJIS.map((e) => (
                      <button
                        key={e}
                        onClick={() => setMessage((m) => m + e)}
                        className="text-xl p-1 hover:bg-[var(--hover-bg)] rounded"
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Attachment menu */}
              {showAttach && (
                <div className="mb-2 flex gap-2">
                  {["Photo", "Document", "Localisation"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setShowAttach(false)}
                      className="px-3 py-1.5 text-xs rounded-lg bg-[var(--card)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[#1e9df1]/50"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setShowAttach(!showAttach); setShowEmoji(false); }}
                  className="p-2 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-secondary)]"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                  </svg>
                </button>
                <button
                  onClick={() => { setShowEmoji(!showEmoji); setShowAttach(false); }}
                  className="p-2 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-secondary)]"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Votre message..."
                  className="flex-1 px-4 py-2.5 text-sm rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)]"
                />
                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="p-2.5 rounded-xl bg-[#1e9df1] text-white hover:bg-[#b8845a] disabled:opacity-40 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <LottiePlayer src="/lottie/lottieflow-chat-17-10-000000-easey.json" width={160} height={160} className="mx-auto mb-4" />
              <p className="text-[var(--text-muted)]">Sélectionnez une conversation</p>
            </div>
          </div>
        )}
      </div>

      {/* New Conversation Modal */}
      {showNewConv && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-[var(--card-border)]">
              <h3 className="text-base font-semibold text-[var(--foreground)]">Nouvelle conversation</h3>
              <button
                onClick={() => { setShowNewConv(false); setNewConvSearch(""); }}
                className="p-1 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-muted)]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <input
                type="text"
                value={newConvSearch}
                onChange={(e) => setNewConvSearch(e.target.value)}
                placeholder="Rechercher un utilisateur..."
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)]"
                autoFocus
              />
            </div>
            <div className="max-h-64 overflow-y-auto px-2 pb-4">
              {[
                { id: "u10", firstName: "Alain", lastName: "Bernard", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", city: "Berne" },
                { id: "u11", firstName: "Clara", lastName: "Fischer", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", city: "Bâle" },
                { id: "u12", firstName: "David", lastName: "Müller", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", city: "Lucerne" },
              ]
                .filter((u) =>
                  `${u.firstName} ${u.lastName}`.toLowerCase().includes(newConvSearch.toLowerCase())
                )
                .map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      const newConv: Conversation = {
                        id: `c-new-${Date.now()}`,
                        participant: {
                          id: user.id, firstName: user.firstName, lastName: user.lastName,
                          email: `${user.firstName.toLowerCase()}@e-dome.ch`,
                          avatar: user.avatar, city: user.city, country: "Suisse",
                          roles: ["client"], activeRole: "client",
                          stats: { followers: 0, following: 0, properties: 0, reviews: 0, rating: 0, transactions: 0, revenue: 0 },
                          bio: "",
                        },
                        messages: [],
                        unreadCount: 0,
                        lastMessage: "",
                        isOnline: Math.random() > 0.5,
                      };
                      setConversations((prev) => [newConv, ...prev]);
                      setActiveConvId(newConv.id);
                      setShowNewConv(false);
                      setNewConvSearch("");
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--hover-bg)] transition-colors"
                  >
                    <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-[var(--foreground)]">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">{user.city}, Suisse</div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Video Call Overlay */}
      {showVideoCall && activeConv && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center">
          <div className="flex items-center gap-8 mb-8">
            <div className="text-center">
              <img
                src={activeConv.participant.avatar}
                alt=""
                className="w-24 h-24 rounded-full object-cover border-4 border-[#1e9df1] mx-auto mb-2"
              />
              <span className="text-white text-sm">
                {activeConv.participant.firstName} {activeConv.participant.lastName}
              </span>
            </div>
          </div>
          <div className="text-white/60 text-lg mb-8 font-mono">{formatCallTimer(callTimer)}</div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                isMuted ? "bg-red-500/80" : "bg-white/20"
              }`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                {isMuted ? (
                  <>
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
                    <path d="M17 16.95A7 7 0 015 12v-2m14 0v2c0 .76-.13 1.49-.36 2.18" />
                    <line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
                  </>
                ) : (
                  <>
                    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                    <path d="M19 10v2a7 7 0 01-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
                  </>
                )}
              </svg>
            </button>
            <button
              onClick={() => setIsCameraOff(!isCameraOff)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                isCameraOff ? "bg-red-500/80" : "bg-white/20"
              }`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                {isCameraOff ? (
                  <>
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <path d="M21 21H3a2 2 0 01-2-2V8a2 2 0 012-2h3l2-3h6l2 3h3a2 2 0 012 2v9.34" />
                  </>
                ) : (
                  <>
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </>
                )}
              </svg>
            </button>
            <button
              onClick={() => setShowVideoCall(false)}
              className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
