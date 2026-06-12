"use client";

import React, { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Check, CheckCheck,
  Mic, MicOff, Video, VideoOff, MonitorUp, Hand,
  Users as UsersIcon, MessageSquare, PhoneOff, ShieldCheck,
  LayoutGrid, Maximize2, X as XIcon, Send as SendIcon, Link as LinkIcon,
  Paperclip, Plus, UserPlus,
} from "lucide-react";
import type { Conversation, Message, User } from "@/lib/types";
import { LottiePlayer } from "@/components/ui/lottie-player";
import { users as allUsers, currentUser as currentUserMock } from "@/lib/mock-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ─── Conférence privée (visio Zoom-style) ────────────────────────────────
   Modèle volontairement multi-participants : on ouvre une "salle" à 4 — soi,
   l'interlocuteur courant + 2 invités tiers mockés (un investisseur et un
   courtier, deux profils typiques d'un deal immobilier). Chaque participant
   a un état audio/vidéo/main levée indépendant. */
interface ConferenceParticipant {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isHost: boolean;
  isSelf: boolean;
  muted: boolean;
  cameraOff: boolean;
  handRaised: boolean;
}

const CONF_SELF = {
  id: "me",
  name: "Léo Martin",
  role: "Apporteur",
  avatar:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop",
};

const CONF_EXTRA_GUESTS: Omit<ConferenceParticipant, "isSelf">[] = [
  {
    id: "p-marc",
    name: "Marc Dubois",
    role: "Investisseur",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop",
    isHost: false,
    muted: false,
    cameraOff: false,
    handRaised: false,
  },
  {
    id: "p-yasmin",
    name: "Yasmin Al Falasi",
    role: "Courtier",
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=160&h=160&fit=crop",
    isHost: false,
    muted: true,
    cameraOff: false,
    handRaised: true,
  },
];

interface ConferenceChatMessage {
  author: string;
  text: string;
  time: string;
  isSelf?: boolean;
}

const INITIAL_CONF_CHAT: ConferenceChatMessage[] = [
  { author: "Marc Dubois", text: "Bonjour à tous, prêts à démarrer ?", time: "13:42" },
  { author: "Yasmin Al Falasi", text: "Oui, j'ai préparé les chiffres.", time: "13:42" },
];

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
  /* ─── Groupes (chat multi-membres) ────────────────────────────
     L'attribut `type: 'group'` declenche un rendu different :
     groupAvatar + name + compteur de membres au lieu de l'avatar
     d'un seul participant. */
  {
    id: "g1",
    type: "group",
    name: "Hôtes Verbier 2026",
    groupAvatar:
      "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?w=200&h=200&fit=crop",
    participant: {
      id: "u1", firstName: "Sophie", lastName: "Martin", email: "s@e.ch",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      city: "Lausanne", country: "Suisse", roles: ["hote"], activeRole: "hote",
      stats: { followers: 120, following: 45, properties: 3, reviews: 28, rating: 4.8, transactions: 15, revenue: 24000 },
      bio: "",
    },
    members: [
      {
        id: "u1", firstName: "Sophie", lastName: "Martin", email: "s@e.ch",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        city: "Lausanne", country: "Suisse", roles: ["hote"], activeRole: "hote",
        stats: { followers: 120, following: 45, properties: 3, reviews: 28, rating: 4.8, transactions: 15, revenue: 24000 },
        bio: "",
      },
      {
        id: "u3", firstName: "Marie", lastName: "Leroy", email: "m@e.ch",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        city: "Zürich", country: "Suisse", roles: ["agence"], activeRole: "agence",
        stats: { followers: 250, following: 80, properties: 12, reviews: 45, rating: 4.9, transactions: 30, revenue: 85000 },
        bio: "",
      },
      {
        id: "u5", firstName: "Pierre", lastName: "Fournier", email: "p@e.ch",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
        city: "Verbier", country: "Suisse", roles: ["hote"], activeRole: "hote",
        stats: { followers: 90, following: 30, properties: 2, reviews: 18, rating: 4.6, transactions: 8, revenue: 18000 },
        bio: "",
      },
    ],
    messages: [
      { id: "gm1", senderId: "u3", content: "Bonjour à tous ! Je propose qu'on se synchronise sur les disponibilités fin avril.", timestamp: "2026-04-03T09:00:00", read: true },
      { id: "gm2", senderId: "u5", content: "Mon chalet est libre du 18 au 25.", timestamp: "2026-04-03T09:15:00", read: true },
      { id: "gm3", senderId: currentUserId, content: "Idem chez moi. Je peux héberger un overflow si besoin.", timestamp: "2026-04-03T09:20:00", read: true },
      { id: "gm4", senderId: "u1", content: "Super, on prépare un tableau partagé ?", timestamp: "2026-04-03T09:30:00", read: false },
    ],
    unreadCount: 1,
    lastMessage: "Sophie: Super, on prépare un tableau partagé ?",
    isOnline: true,
  },
  {
    id: "g2",
    type: "group",
    name: "Investisseurs Suisse Romande",
    groupAvatar:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=200&fit=crop",
    participant: {
      id: "u2", firstName: "Jean", lastName: "Dupont", email: "j@e.ch",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      city: "Genève", country: "Suisse", roles: ["client"], activeRole: "client",
      stats: { followers: 30, following: 60, properties: 0, reviews: 5, rating: 4.2, transactions: 3, revenue: 0 },
      bio: "",
    },
    members: [
      {
        id: "u2", firstName: "Jean", lastName: "Dupont", email: "j@e.ch",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        city: "Genève", country: "Suisse", roles: ["client"], activeRole: "client",
        stats: { followers: 30, following: 60, properties: 0, reviews: 5, rating: 4.2, transactions: 3, revenue: 0 },
        bio: "",
      },
      {
        id: "u4", firstName: "Amira", lastName: "El Fassi", email: "a@e.ch",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
        city: "Marrakech", country: "Maroc", roles: ["hote"], activeRole: "hote",
        stats: { followers: 180, following: 90, properties: 5, reviews: 32, rating: 4.7, transactions: 12, revenue: 42000 },
        bio: "",
      },
    ],
    messages: [
      { id: "gm10", senderId: "u2", content: "On se voit ce vendredi pour l'AG annuelle ?", timestamp: "2026-04-02T17:00:00", read: true },
      { id: "gm11", senderId: currentUserId, content: "Présent. J'apporte les chiffres du Q1.", timestamp: "2026-04-02T17:05:00", read: true },
    ],
    unreadCount: 0,
    lastMessage: "Vous: Présent. J'apporte les chiffres du Q1.",
    isOnline: false,
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function MessagesPage() {
  /* Wrappe le contenu réel dans <Suspense> car useSearchParams() requiert
     une boundary en App Router (Next 16). Sans ça : warning prerender. */
  return (
    <Suspense fallback={null}>
      <MessagesPageInner />
    </Suspense>
  );
}

function MessagesPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [conversations, setConversations] = useState(mockConversations);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [showAttach, setShowAttach] = useState(false);
  /* ─── Conférence privée ───────────────────────────────────────────────
     Remplace l'ancien appel 1-1 par une visio multi-participants
     style Zoom. L'état de soi (muted/camera/main) est dupliqué dans
     `participants` à l'ouverture pour pouvoir le mettre à jour depuis
     l'UI bas-de-page comme dans Zoom. */
  const [showConference, setShowConference] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [participants, setParticipants] = useState<ConferenceParticipant[]>([]);
  const [confViewMode, setConfViewMode] = useState<"grid" | "speaker">("grid");
  const [confSidePanel, setConfSidePanel] = useState<null | "participants" | "chat">(null);
  const [confChat, setConfChat] = useState<ConferenceChatMessage[]>(INITIAL_CONF_CHAT);
  const [confChatInput, setConfChatInput] = useState("");
  const [confToast, setConfToast] = useState<string | null>(null);
  const isSelfMuted = participants.find((p) => p.isSelf)?.muted ?? false;
  const isSelfCameraOff = participants.find((p) => p.isSelf)?.cameraOff ?? false;
  const isSelfHandRaised = participants.find((p) => p.isSelf)?.handRaised ?? false;
  const [typing, setTyping] = useState(false);
  const [deletedMessages, setDeletedMessages] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showNewConv, setShowNewConv] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupMembers, setNewGroupMembers] = useState<string[]>([]);
  const [newGroupSearch, setNewGroupSearch] = useState("");
  const [newConvSearch, setNewConvSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const callIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId) || null;

  const filteredConvs = conversations.filter((c) => {
    const name = `${c.participant.firstName} ${c.participant.lastName}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  /* Auto-sélection de conversation depuis une query string :
     - /messages?to=u1            → ouvre la conv avec u1
     - /messages?product=b3&...   → ouvre la 1ère conv et pré-remplit
       le message avec une référence au produit (UX deeplink depuis
       boutique/[id] "Contacter" / "Poser une question").
     Ne tente qu'une seule fois (refs) pour ne pas écraser l'état. */
  const autoSelectAppliedRef = useRef(false);
  useEffect(() => {
    if (autoSelectAppliedRef.current) return;
    const to = searchParams.get("to");
    const productId = searchParams.get("product");
    const vendor = searchParams.get("vendor");
    if (to) {
      const conv = conversations.find((c) => c.participant.id === to);
      if (conv) {
        setActiveConvId(conv.id);
        autoSelectAppliedRef.current = true;
      }
    } else if (productId) {
      const conv = conversations[0];
      if (conv) {
        setActiveConvId(conv.id);
        setMessage(
          `Bonjour${vendor ? " " + vendor : ""}, je vous contacte au sujet de l'annonce ${productId}.`
        );
        autoSelectAppliedRef.current = true;
      }
    }
  }, [searchParams, conversations]);

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

  // Conference timer
  useEffect(() => {
    if (showConference) {
      callIntervalRef.current = setInterval(() => setCallTimer((t) => t + 1), 1000);
    } else {
      if (callIntervalRef.current) clearInterval(callIntervalRef.current);
      setCallTimer(0);
    }
    return () => { if (callIntervalRef.current) clearInterval(callIntervalRef.current); };
  }, [showConference]);

  // Ferme la conférence avec Échap (UX clavier desktop)
  useEffect(() => {
    if (!showConference) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowConference(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showConference]);

  // Auto-dismiss conf toast
  useEffect(() => {
    if (!confToast) return;
    const t = setTimeout(() => setConfToast(null), 2200);
    return () => clearTimeout(t);
  }, [confToast]);

  /* Démarre une conférence : peuple la liste avec soi (hôte), l'interlocuteur
     courant et 2 invités tiers. Réinitialise les panneaux et le compteur. */
  const startConference = useCallback(() => {
    if (!activeConv) return;
    const partRole =
      (activeConv.participant.activeRole as string) || "client";
    setParticipants([
      {
        id: CONF_SELF.id,
        name: CONF_SELF.name,
        role: CONF_SELF.role,
        avatar: CONF_SELF.avatar,
        isHost: true,
        isSelf: true,
        muted: false,
        cameraOff: false,
        handRaised: false,
      },
      {
        id: activeConv.participant.id,
        name: `${activeConv.participant.firstName} ${activeConv.participant.lastName}`,
        role: partRole.charAt(0).toUpperCase() + partRole.slice(1),
        avatar: activeConv.participant.avatar,
        isHost: false,
        isSelf: false,
        muted: false,
        cameraOff: false,
        handRaised: false,
      },
      ...CONF_EXTRA_GUESTS.map((g) => ({ ...g, isSelf: false })),
    ]);
    setConfSidePanel(null);
    setConfChat(INITIAL_CONF_CHAT);
    setShowConference(true);
  }, [activeConv]);

  const endConference = useCallback(() => {
    setShowConference(false);
    setParticipants([]);
    setConfSidePanel(null);
  }, []);

  const toggleSelf = useCallback(
    (key: "muted" | "cameraOff" | "handRaised") => {
      setParticipants((prev) =>
        prev.map((p) => (p.isSelf ? { ...p, [key]: !p[key] } : p)),
      );
    },
    [],
  );

  const sendConfChat = useCallback(() => {
    const txt = confChatInput.trim();
    if (!txt) return;
    const time = new Date().toLocaleTimeString("fr-CH", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setConfChat((prev) => [...prev, { author: "Vous", text: txt, time, isSelf: true }]);
    setConfChatInput("");
  }, [confChatInput]);

  const copyInviteLink = useCallback(() => {
    if (!activeConv) return;
    const link = `https://edome.world/conf/${activeConv.id}-${Date.now().toString(36)}`;
    try {
      navigator.clipboard.writeText(link);
      setConfToast("Lien d'invitation copié");
    } catch {
      setConfToast("Impossible de copier");
    }
  }, [activeConv]);

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
              <h1 className="text-xl page-heading text-[var(--foreground)]">Messages</h1>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowNewGroup(true)}
                className="flex h-8 items-center gap-1 rounded-full border border-[var(--card-border)] bg-[var(--background)] px-2.5 text-[11px] font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--hover-bg)]"
                title="Nouveau groupe"
              >
                <UsersIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Groupe</span>
              </button>
              <button
                onClick={() => setShowNewConv(true)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-white transition-colors hover:opacity-90"
                title="Nouvelle conversation"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
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
          {filteredConvs.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 px-6 text-[var(--text-muted)]">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                style={{ background: "var(--hover-bg)" }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-sm">
                {search ? `Aucune conversation pour « ${search} »` : "Aucune conversation"}
              </p>
              {!search && (
                <p className="text-xs mt-1">
                  Vos discussions avec les hôtes, courtiers et prestataires apparaîtront ici.
                </p>
              )}
            </div>
          ) : filteredConvs.map((conv) => {
            const isGroup = conv.type === "group";
            const displayName = isGroup
              ? conv.name
              : `${conv.participant.firstName} ${conv.participant.lastName}`;
            const displayAvatar = isGroup
              ? conv.groupAvatar
              : conv.participant.avatar;
            return (
            <button
              key={conv.id}
              onClick={() => setActiveConvId(conv.id)}
              className={`w-full flex items-center gap-3 p-4 text-left hover:bg-[var(--hover-bg)] transition-colors border-b border-[var(--card-border)] ${
                activeConvId === conv.id ? "bg-[var(--hover-bg)]" : ""
              }`}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={displayAvatar}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />
                {!isGroup && conv.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[var(--background)]" />
                )}
                {isGroup && (
                  <div className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full bg-foreground px-1 py-0.5 text-[8px] font-mono font-medium text-background">
                    {conv.members?.length ?? 0}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--foreground)] truncate">
                    {displayName}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] flex-shrink-0">
                    {formatTime(conv.messages[conv.messages.length - 1]?.timestamp || "")}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs text-[var(--text-muted)] truncate">{conv.lastMessage}</span>
                  {conv.unreadCount > 0 && (
                    <span className="ml-2 w-5 h-5 rounded-full bg-[var(--primary)] text-white text-[10px] flex items-center justify-center flex-shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
            );
          })}
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
                  src={
                    activeConv.type === "group"
                      ? activeConv.groupAvatar
                      : activeConv.participant.avatar
                  }
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                {activeConv.type !== "group" && activeConv.isOnline && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[var(--background)]" />
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-[var(--foreground)] flex items-center gap-2">
                  {activeConv.type === "group"
                    ? activeConv.name
                    : `${activeConv.participant.firstName} ${activeConv.participant.lastName}`}
                  {activeConv.type === "group" && (
                    <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                      Groupe
                    </span>
                  )}
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  {activeConv.type === "group"
                    ? `${activeConv.members?.length ?? 0} membres`
                    : activeConv.isOnline
                    ? "En ligne"
                    : "Hors ligne"}
                </div>
              </div>
              <button
                onClick={() =>
                  router.push(
                    `/reunion/${activeConv.id}?titre=${encodeURIComponent(
                      `Visio avec ${activeConv.participant.firstName} ${activeConv.participant.lastName}`,
                    )}`,
                  )
                }
                aria-label="Démarrer une visio Jitsi"
                title="Démarrer une visio Jitsi"
                className="flex items-center gap-1.5 px-3 h-11 rounded-lg bg-[var(--primary)]/10 hover:bg-[var(--primary)]/15 text-[var(--primary)] text-xs font-medium transition-colors"
              >
                <Video size={16} />
                <span className="hidden sm:inline">Visio</span>
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
                                ? "bg-[var(--primary)]/20 text-[var(--foreground)] rounded-br-md"
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
                                    isMine ? "text-[var(--primary)]/60 justify-end" : "text-[var(--text-muted)]"
                                  }`}
                                >
                                  {formatTime(msg.timestamp)}
                                  {isMine && (msg.read ? <CheckCheck size={12} /> : <Check size={12} />)}
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
              {/* Attachment menu */}
              {showAttach && (
                <div className="mb-2 flex gap-2">
                  {["Photo", "Document", "Localisation"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setShowAttach(false)}
                      className="px-3 py-1.5 text-xs rounded-lg bg-[var(--card)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[var(--primary)]/50"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAttach(!showAttach)}
                  aria-label="Joindre un fichier"
                  className="p-2 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-secondary)]"
                >
                  <Paperclip size={20} />
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
                  className="p-2.5 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary)] disabled:opacity-40 transition-colors"
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

      {/* ─── Nouveau groupe ─────────────────────────────────────────────── */}
      <Dialog open={showNewGroup} onOpenChange={(open) => {
        if (!open) {
          setShowNewGroup(false);
          setNewGroupName("");
          setNewGroupMembers([]);
          setNewGroupSearch("");
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nouveau groupe</DialogTitle>
            <DialogDescription>
              Donnez un nom au groupe et ajoutez au moins 2 membres.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground" htmlFor="group-name">
                Nom du groupe
              </label>
              <input
                id="group-name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Ex : Investisseurs Romandie"
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground" htmlFor="group-search">
                  Membres
                </label>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {newGroupMembers.length} sélectionné{newGroupMembers.length > 1 ? "s" : ""}
                </span>
              </div>
              <input
                id="group-search"
                value={newGroupSearch}
                onChange={(e) => setNewGroupSearch(e.target.value)}
                placeholder="Rechercher un utilisateur…"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
              />
              <div className="mt-2 max-h-56 overflow-y-auto rounded-md border border-border">
                {allUsers
                  .filter((u) => u.id !== currentUserMock.id)
                  .filter((u) =>
                    `${u.firstName} ${u.lastName} ${u.city}`
                      .toLowerCase()
                      .includes(newGroupSearch.toLowerCase()),
                  )
                  .map((user) => {
                    const checked = newGroupMembers.includes(user.id);
                    return (
                      <label
                        key={user.id}
                        className="flex cursor-pointer items-center gap-3 border-b border-border px-3 py-2 last:border-b-0 hover:bg-muted/40"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setNewGroupMembers((prev) =>
                              checked ? prev.filter((id) => id !== user.id) : [...prev, user.id],
                            );
                          }}
                          className="h-4 w-4 shrink-0 rounded border-border"
                        />
                        <img
                          src={user.avatar}
                          alt=""
                          className="h-7 w-7 shrink-0 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="truncate text-[11px] text-muted-foreground">
                            {user.city}, {user.country}
                          </p>
                        </div>
                      </label>
                    );
                  })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => {
                setShowNewGroup(false);
                setNewGroupName("");
                setNewGroupMembers([]);
                setNewGroupSearch("");
              }}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => {
                if (!newGroupName.trim() || newGroupMembers.length < 2) return;
                const members = allUsers.filter((u) => newGroupMembers.includes(u.id));
                /* On garde currentUser implicite dans le groupe : seul lui peut
                   l'ouvrir, donc on ne le re-stocke pas comme membre dans la
                   liste affichee. */
                const newGroup: Conversation = {
                  id: `g-new-${Date.now()}`,
                  type: "group",
                  name: newGroupName.trim(),
                  groupAvatar:
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&h=200&fit=crop",
                  participant: members[0] as User,
                  members,
                  messages: [],
                  unreadCount: 0,
                  lastMessage: "",
                  isOnline: false,
                };
                setConversations((prev) => [newGroup, ...prev]);
                setActiveConvId(newGroup.id);
                setShowNewGroup(false);
                setNewGroupName("");
                setNewGroupMembers([]);
                setNewGroupSearch("");
              }}
              disabled={!newGroupName.trim() || newGroupMembers.length < 2}
              className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-40"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Créer le groupe
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Conférence privée (visio Zoom-style) ──────────────────────── */}
      {showConference && activeConv && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Réunion privée"
          className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col text-white"
        >
          {/* Header */}
          <header className="flex items-center justify-between px-3 md:px-6 py-2.5 border-b border-white/10 bg-black/40 shrink-0">
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                <ShieldCheck size={14} />
                <span className="hidden sm:inline">Réunion chiffrée</span>
                <span className="sm:hidden">Chiffrée</span>
              </span>
              <span className="text-white/30">·</span>
              <span className="text-white text-xs font-mono tabular-nums">
                {formatCallTimer(callTimer)}
              </span>
              <span className="hidden md:inline text-white/30">·</span>
              <span className="hidden md:inline text-white/70 text-xs truncate">
                avec {activeConv.participant.firstName} {activeConv.participant.lastName}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setConfViewMode(confViewMode === "grid" ? "speaker" : "grid")
                }
                aria-label={
                  confViewMode === "grid" ? "Vue intervenant" : "Vue grille"
                }
                className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg text-white/70 hover:bg-white/10 transition-colors"
              >
                {confViewMode === "grid" ? (
                  <Maximize2 size={16} />
                ) : (
                  <LayoutGrid size={16} />
                )}
              </button>
              <button
                onClick={endConference}
                aria-label="Fermer la réunion"
                className="flex items-center justify-center w-11 h-11 rounded-lg text-white/70 hover:bg-white/10 transition-colors"
              >
                <XIcon size={18} />
              </button>
            </div>
          </header>

          {/* Stage + side panel */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* Stage */}
            <div className="flex-1 overflow-y-auto p-3 md:p-4">
              {confViewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 h-full content-start">
                  {participants.map((p) => (
                    <ConferenceTile key={p.id} p={p} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3 h-full">
                  <div className="flex-1 min-h-[280px]">
                    <ConferenceTile p={participants[0]} large />
                  </div>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {participants.slice(1).map((p) => (
                      <div key={p.id} className="shrink-0 w-40">
                        <ConferenceTile p={p} compact />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Side panel : participants OU chat (drawer mobile / pan desktop) */}
            {confSidePanel && (
              <aside
                className="absolute md:relative inset-y-0 right-0 w-full md:w-80 bg-[#12141a] border-l border-white/10 flex flex-col animate-slide-in-right z-10"
                aria-label={
                  confSidePanel === "participants"
                    ? "Liste des participants"
                    : "Discussion de la réunion"
                }
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                  <h3 className="text-sm font-semibold text-white">
                    {confSidePanel === "participants"
                      ? `Participants (${participants.length})`
                      : "Discussion"}
                  </h3>
                  <button
                    onClick={() => setConfSidePanel(null)}
                    aria-label="Fermer le panneau"
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <XIcon size={16} />
                  </button>
                </div>

                {confSidePanel === "participants" && (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <ul className="flex-1 overflow-y-auto py-1">
                      {participants.map((p) => (
                        <li
                          key={p.id}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5"
                        >
                          <img
                            src={p.avatar}
                            alt=""
                            className="w-9 h-9 rounded-full object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">
                              {p.name}{" "}
                              {p.isSelf && (
                                <span className="text-white/50 text-xs">(Vous)</span>
                              )}
                            </p>
                            <p className="text-xs text-white/50 truncate">
                              {p.role}
                              {p.isHost && " · Hôte"}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {p.handRaised && (
                              <Hand size={14} className="text-amber-400" />
                            )}
                            {p.muted ? (
                              <MicOff size={14} className="text-red-400" />
                            ) : (
                              <Mic size={14} className="text-white/70" />
                            )}
                            {p.cameraOff ? (
                              <VideoOff size={14} className="text-white/40" />
                            ) : (
                              <Video size={14} className="text-white/70" />
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="p-3 border-t border-white/10">
                      <button
                        onClick={copyInviteLink}
                        className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors"
                      >
                        <LinkIcon size={14} /> Copier le lien d&apos;invitation
                      </button>
                    </div>
                  </div>
                )}

                {confSidePanel === "chat" && (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <ul className="flex-1 overflow-y-auto p-4 space-y-3">
                      {confChat.map((m, i) => (
                        <li key={i}>
                          <p className="text-[11px] text-white/50">
                            <span
                              className={`font-medium ${
                                m.isSelf ? "text-[var(--primary)]" : "text-white/80"
                              }`}
                            >
                              {m.author}
                            </span>{" "}
                            · {m.time}
                          </p>
                          <p className="text-sm text-white/90 mt-0.5 break-words">
                            {m.text}
                          </p>
                        </li>
                      ))}
                    </ul>
                    <div className="p-3 border-t border-white/10 flex gap-2">
                      <input
                        type="text"
                        value={confChatInput}
                        onChange={(e) => setConfChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") sendConfChat();
                        }}
                        placeholder="Message à tous…"
                        aria-label="Message à tous les participants"
                        className="flex-1 h-10 px-3 rounded-lg bg-white/10 text-white text-sm placeholder:text-white/40 outline-none focus:bg-white/15"
                      />
                      <button
                        onClick={sendConfChat}
                        aria-label="Envoyer le message"
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--primary)] hover:bg-[var(--primary)] text-white transition-colors"
                      >
                        <SendIcon size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </aside>
            )}
          </div>

          {/* Barre de contrôles bas — Zoom-style. Scrollable horizontalement
              en mobile si jamais l'écran est très étroit. */}
          <div className="border-t border-white/10 bg-black/40 shrink-0">
            <div className="px-3 md:px-6 py-2.5 flex items-center justify-between gap-2"
              style={{ paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom))" }}
            >
              <div className="hidden md:block text-white/40 text-xs">
                E-Dome Réunions
              </div>

              <div className="flex items-center gap-1.5 md:gap-2 overflow-x-auto no-scrollbar mx-auto md:mx-0">
                <ConferenceAction
                  icon={isSelfMuted ? MicOff : Mic}
                  label={isSelfMuted ? "Activer le micro" : "Couper le micro"}
                  shortLabel="Micro"
                  active={isSelfMuted}
                  onClick={() => toggleSelf("muted")}
                />
                <ConferenceAction
                  icon={isSelfCameraOff ? VideoOff : Video}
                  label={isSelfCameraOff ? "Activer la caméra" : "Couper la caméra"}
                  shortLabel="Caméra"
                  active={isSelfCameraOff}
                  onClick={() => toggleSelf("cameraOff")}
                />
                <ConferenceAction
                  icon={MonitorUp}
                  label="Partager l'écran"
                  shortLabel="Partager"
                  onClick={() => setConfToast("Partage d'écran activé (démo)")}
                />
                <ConferenceAction
                  icon={Hand}
                  label={isSelfHandRaised ? "Baisser la main" : "Lever la main"}
                  shortLabel="Main"
                  active={isSelfHandRaised}
                  activeAmber
                  onClick={() => toggleSelf("handRaised")}
                />
                <ConferenceAction
                  icon={UsersIcon}
                  label="Participants"
                  shortLabel="Participants"
                  badge={participants.length}
                  active={confSidePanel === "participants"}
                  onClick={() =>
                    setConfSidePanel(
                      confSidePanel === "participants" ? null : "participants",
                    )
                  }
                />
                <ConferenceAction
                  icon={MessageSquare}
                  label="Discussion"
                  shortLabel="Chat"
                  active={confSidePanel === "chat"}
                  onClick={() =>
                    setConfSidePanel(confSidePanel === "chat" ? null : "chat")
                  }
                />
              </div>

              <button
                onClick={endConference}
                aria-label="Quitter la réunion"
                className="inline-flex items-center gap-2 h-11 px-3 md:px-5 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors shrink-0"
              >
                <PhoneOff size={16} />
                <span className="hidden sm:inline">Quitter</span>
              </button>
            </div>
          </div>

          {/* Toast interne à la conférence */}
          {confToast && (
            <div
              role="status"
              aria-live="polite"
              className="absolute left-1/2 top-16 -translate-x-1/2 z-20 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm shadow-lg animate-fade-in flex items-center gap-1.5"
            >
              <Check size={14} strokeWidth={2.5} /> {confToast}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Sous-composants conférence ──────────────────────────────────────── */

interface ConferenceTileProps {
  p: ConferenceParticipant;
  large?: boolean;
  compact?: boolean;
}

function ConferenceTile({ p, large, compact }: ConferenceTileProps) {
  if (!p) return null;
  return (
    <div
      className={`relative rounded-2xl overflow-hidden border border-white/5 ${
        compact ? "aspect-video" : large ? "h-full min-h-[280px]" : "aspect-video"
      }`}
      style={{
        background: p.cameraOff
          ? "linear-gradient(135deg, #1c2230, #0d1117)"
          : "linear-gradient(135deg, #1e3a5f 0%, #0a1929 50%, #11203a 100%)",
      }}
    >
      {/* Centered avatar (camera off → grand ; on → cercle moyen, simule
          un "frame" de webcam). */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={p.avatar}
          alt=""
          className={`rounded-full object-cover ${
            p.cameraOff
              ? large
                ? "w-32 h-32"
                : "w-20 h-20"
              : large
                ? "w-28 h-28 ring-2 ring-white/15"
                : "w-16 h-16 ring-2 ring-white/15"
          } ${p.isSelf && !p.cameraOff ? "scale-x-[-1]" : ""}`}
        />
      </div>

      {/* Badges haut */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-2 pointer-events-none">
        {p.handRaised ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/95 text-white text-[11px] font-medium">
            <Hand size={11} /> Main levée
          </span>
        ) : (
          <span />
        )}
        {p.isHost && (
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/15 text-white">
            Hôte
          </span>
        )}
      </div>

      {/* Bandeau bas : nom + état audio/vidéo */}
      <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 flex items-end justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent">
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {p.name}
            {p.isSelf && <span className="text-white/60 font-normal"> (Vous)</span>}
          </p>
          {!compact && (
            <p className="text-[11px] text-white/60 truncate">{p.role}</p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {p.muted && (
            <div className="w-7 h-7 rounded-full bg-red-500/85 flex items-center justify-center">
              <MicOff size={13} className="text-white" />
            </div>
          )}
          {p.cameraOff && (
            <div className="w-7 h-7 rounded-full bg-black/55 flex items-center justify-center">
              <VideoOff size={13} className="text-white/85" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ConferenceActionProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  shortLabel: string;
  active?: boolean;
  activeAmber?: boolean;
  badge?: number;
  onClick: () => void;
}

function ConferenceAction({
  icon: Icon,
  label,
  shortLabel,
  active,
  activeAmber,
  badge,
  onClick,
}: ConferenceActionProps) {
  const activeBg = activeAmber ? "bg-amber-500/90" : "bg-[var(--primary)]";
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={!!active}
      className={`relative flex flex-col items-center justify-center gap-0.5 min-w-[60px] h-12 px-2.5 rounded-xl text-[10px] font-medium transition-colors ${
        active
          ? `${activeBg} text-white`
          : "bg-white/10 text-white/85 hover:bg-white/15"
      }`}
    >
      <Icon size={18} />
      <span className="leading-none">{shortLabel}</span>
      {typeof badge === "number" && badge > 0 && (
        <span
          aria-hidden
          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold tabular-nums"
        >
          {badge}
        </span>
      )}
    </button>
  );
}
