"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Check, CheckCheck,
  Mic, MicOff, Video, VideoOff, MonitorUp, Hand,
  Users as UsersIcon, MessageSquare, PhoneOff, ShieldCheck,
  LayoutGrid, Maximize2, X as XIcon, Send as SendIcon, Link as LinkIcon,
  Paperclip, Plus, UserPlus,
} from "lucide-react";
import type { User } from "@/lib/types";
import { LottiePlayer } from "@/components/ui/lottie-player";
import { actorSummary } from "@/lib/demo/actors";
import { DIRECTORY, personById, requirePerson } from "@/lib/demo/directory";
import { directThreadId } from "@/lib/demo/session-store";
import type { ThreadView } from "@/lib/demo/session-views";
import { useSession, recordSessionEvent, markThreadAsRead } from "@/lib/use-session";
import { roleLabel } from "@/lib/model/role-labels";
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
   l'interlocuteur courant + 2 invités tiers mockés (un investisseur et une
   agente immobilière, deux profils typiques d'un deal immobilier). Chaque participant
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

/* Tous les visages viennent de l'annuaire : soi (la personne incarnée,
   chantier P3), et deux invités réels (un investisseur et une agente
   immobilière, deux profils typiques d'un deal). */
function confSelf(actorId: string) {
  const a = actorSummary(actorId);
  return { id: a.id, name: a.name, role: a.line, avatar: a.avatar };
}

const G_ENNIO = requirePerson("user-003");
const G_CELINE = requirePerson("user-002");

const CONF_EXTRA_GUESTS: Omit<ConferenceParticipant, "isSelf">[] = [
  {
    id: G_ENNIO.id,
    name: `${G_ENNIO.firstName} ${G_ENNIO.lastName}`,
    role: "Investisseur",
    avatar: G_ENNIO.avatar,
    isHost: false,
    muted: false,
    cameraOff: false,
    handRaised: false,
  },
  {
    id: G_CELINE.id,
    name: `${G_CELINE.firstName} ${G_CELINE.lastName}`,
    role: "Agence",
    avatar: G_CELINE.avatar,
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
  { author: "Ennio Bordoni", text: "Bonjour. On commence ?", time: "13:42" },
  { author: "Céline Bovard", text: "Oui, j'ai préparé le dossier de Riex.", time: "13:42" },
];

// ─── La messagerie, branchée sur la mémoire de session ──────────────────────

/* Les fils ne vivent plus dans ce composant : ils viennent de la mémoire de
   session (`useSession`) — l'amorce réécrite sur le casting (Ana ↔ Léo pour
   Renens, Bernard ↔ Nikola, Mirjana ↔ Amina…) plus tout ce que la visite a
   produit : une demande de visite, une offre, un devis, un contact d'agence,
   une réservation déposent un message dans le fil de la bonne personne.

   - `/messages?to=<id>` ouvre le fil avec n'importe quelle personne de
     l'annuaire, ou un fil neuf (brouillon) qui n'existe qu'au premier envoi.
   - `/messages?conv=<id>` ouvre un fil précis (groupes).
   - Envoyer un message l'inscrit au journal (`message.sent`) : il reste après
     un rechargement et notifie les autres membres. */

/** Un message, au format qu'attend le rendu de cette page. */
interface ConvMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
  topic?: string;
}

interface ConvView {
  id: string;
  type: "direct" | "group";
  name?: string;
  groupAvatar?: string;
  /** L'interlocuteur (direct) ou le premier autre membre (groupe). */
  participant: User;
  members: User[];
  memberIds: string[];
  messages: ConvMessage[];
  unreadCount: number;
  lastMessage: string;
  isOnline: boolean;
  subject?: { id: string; title: string };
  /** Fil pas encore écrit : il n'existera qu'au premier message. */
  draft?: boolean;
}

/* Présence déterministe (aucun `Math.random()` en rendu) : une maquette ne
   sait pas qui est en ligne, mais l'indicateur ne doit pas clignoter. */
const ONLINE = new Set(["user-006", "user-002", "user-013", "user-005"]);

const GROUP_FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&h=200&fit=crop";

function toConvView(t: ThreadView): ConvView {
  const others = t.otherIds.map((id) => personById(id)).filter((u): u is User => Boolean(u));
  const participant = others[0] ?? requirePerson(t.memberIds[0]!);
  return {
    id: t.id,
    type: t.isGroup ? "group" : "direct",
    name: t.name,
    groupAvatar: t.isGroup ? t.avatar ?? GROUP_FALLBACK_AVATAR : undefined,
    participant,
    members: others,
    memberIds: t.memberIds,
    messages: t.messages.map((m, i) => ({
      id: m.id,
      senderId: m.senderId,
      content: m.text,
      timestamp: m.at,
      topic: m.topic,
      /* « Lu » : tout message suivi d'un autre, et ceux de l'amorce. */
      read: i < t.messages.length - 1 || !m.fromSession,
    })),
    unreadCount: t.unreadCount,
    lastMessage: t.lastText,
    isOnline: !t.isGroup && ONLINE.has(participant.id),
    subject: t.subject ? { id: t.subject.id, title: t.subject.title } : undefined,
  };
}

function draftConv(actorId: string, other: User): ConvView {
  return {
    id: directThreadId(actorId, other.id),
    type: "direct",
    participant: other,
    members: [other],
    memberIds: [actorId, other.id],
    messages: [],
    unreadCount: 0,
    lastMessage: "Nouvelle conversation",
    isOnline: ONLINE.has(other.id),
    draft: true,
  };
}

/* Heure et date de Suisse romande, construites à la main : `toLocale*` diffère
   entre l'ICU du serveur et celle du navigateur (hydratation cassée). Toutes
   les dates de la démonstration tombent en heure d'été (UTC+2). */
const ZURICH_OFFSET_MS = 2 * 3_600_000;
const MONTHS_FR = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
function localDate(ts: string): Date {
  return new Date(new Date(ts).getTime() + ZURICH_OFFSET_MS);
}

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
  const { threads, actorId, state: sessionState } = useSession();
  const currentUserId = actorId;
  /* Brouillon : la personne choisie (deep link ou modale) avec qui aucun fil
     n'existe encore. */
  const [draftWith, setDraftWith] = useState<string | null>(null);
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

  /* Les fils de l'acteur, plus le brouillon éventuel en tête. Un brouillon
     disparaît de lui-même dès que le fil réel existe (premier message). */
  const conversations: ConvView[] = useMemo(() => {
    const real = threads.map(toConvView);
    if (!draftWith) return real;
    if (real.some((c) => c.type === "direct" && c.participant.id === draftWith)) return real;
    const other = personById(draftWith);
    return other ? [draftConv(currentUserId, other), ...real] : real;
  }, [threads, draftWith, currentUserId]);

  const activeConv = conversations.find((c) => c.id === activeConvId) || null;

  const filteredConvs = conversations.filter((c) => {
    const name = (c.type === "group" ? c.name ?? "" : `${c.participant.firstName} ${c.participant.lastName}`).toLowerCase();
    return name.includes(search.toLowerCase());
  });

  /* Ouvre (ou prépare) le fil direct avec une personne de l'annuaire. */
  const openWith = useCallback(
    (personId: string) => {
      if (personId === currentUserId || !personById(personId)) return;
      const existing = threads.find((t) => !t.isGroup && t.otherIds.length === 1 && t.otherIds[0] === personId);
      if (existing) {
        setActiveConvId(existing.id);
      } else {
        setDraftWith(personId);
        setActiveConvId(directThreadId(currentUserId, personId));
      }
    },
    [threads, currentUserId],
  );

  /* Auto-sélection depuis la query string :
     - /messages?to=user-002    → le fil avec cette personne (créé au besoin)
     - /messages?conv=<id>      → ce fil précis (groupes)
     - /messages?product=…      → la modale « Nouvelle conversation », message
       pré-rempli : on choisit soi-même à qui l'adresser.
     Ré-appliquée quand la query change (un lien vers un autre fil depuis une
     notification), pas à chaque rendu. */
  const appliedQueryRef = useRef<string | null>(null);
  useEffect(() => {
    const key = searchParams.toString();
    if (appliedQueryRef.current === key) return;
    const to = searchParams.get("to");
    const conv = searchParams.get("conv");
    const productId = searchParams.get("product");
    const vendor = searchParams.get("vendor");
    if (to) {
      openWith(to);
    } else if (conv) {
      if (!threads.some((t) => t.id === conv)) return; // la session n'est peut-être pas encore relue
      setActiveConvId(conv);
    } else if (productId) {
      setMessage(`Bonjour${vendor ? " " + vendor : ""}, je vous contacte au sujet de l'annonce ${productId}.`);
      setShowNewConv(true);
    }
    appliedQueryRef.current = key;
  }, [searchParams, openWith, threads]);

  /* Ouvrir un fil le marque lu, jusqu'au dernier message affiché. */
  const activeLength = activeConv?.messages.length ?? 0;
  useEffect(() => {
    if (!activeConvId || activeLength === 0) return;
    markThreadAsRead(activeConvId, activeLength);
  }, [activeConvId, activeLength]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages.length]);

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
      roleLabel(activeConv.participant.activeRole, activeConv.participant.trades);
    const self = confSelf(currentUserId);
    setParticipants([
      {
        id: self.id,
        name: self.name,
        role: self.role,
        avatar: self.avatar,
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
      ...CONF_EXTRA_GUESTS.filter((g) => g.id !== currentUserId && g.id !== activeConv.participant.id).map((g) => ({ ...g, isSelf: false })),
    ]);
    setConfSidePanel(null);
    setConfChat(INITIAL_CONF_CHAT);
    setShowConference(true);
  }, [activeConv, currentUserId]);

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

  /* Envoyer : le message entre au journal de session, dans ce fil (le
     brouillon devient un vrai fil), et notifie les autres membres. */
  const sendMessage = useCallback(() => {
    const text = message.trim();
    if (!text || !activeConv) return;
    recordSessionEvent({
      kind: "message.sent",
      data: { threadId: activeConv.id, memberIds: activeConv.memberIds, text },
    });
    if (activeConv.draft) setDraftWith(null);
    setMessage("");
  }, [message, activeConv]);

  const deleteMessage = useCallback(
    (msgId: string) => {
      setDeletedMessages((prev) => new Set(prev).add(msgId));
      setConfirmDelete(null);
    },
    []
  );

  const formatTime = (ts: string) => {
    if (!ts) return "";
    const d = localDate(ts);
    return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
  };

  const formatCallTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const groupMessagesByDate = (messages: ConvMessage[]) => {
    const groups: Record<string, ConvMessage[]> = {};
    messages.forEach((m) => {
      const d = localDate(m.timestamp);
      const dateKey = `${d.getUTCDate()} ${MONTHS_FR[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(m);
    });
    return groups;
  };

  /* La modale « Nouvelle conversation » propose TOUT l'annuaire, sauf soi. */
  const directoryChoices = DIRECTORY.filter((u) => u.id !== currentUserId);

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
                  Vos discussions avec les hôtes, agences et prestataires apparaîtront ici.
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
                    {conv.memberIds.length}
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
                    ? `${activeConv.memberIds.length} membres`
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

            {/* Ce dont parle le fil (un bien), avec un lien vers sa fiche */}
            {activeConv.subject && (
              <Link
                href={`/explorer/${activeConv.subject.id}`}
                className="flex items-center gap-2 border-b border-[var(--card-border)] bg-[var(--card)] px-4 py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--foreground)]"
              >
                <span className="font-medium">À propos de :</span>
                <span className="truncate">{activeConv.subject.title}</span>
              </Link>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeConv.messages.length === 0 && (
                <div className="py-12 text-center text-sm text-[var(--text-muted)]">
                  <p>
                    Nouvelle conversation avec {activeConv.type === "group" ? activeConv.name : `${activeConv.participant.firstName} ${activeConv.participant.lastName}`}.
                  </p>
                  <p className="mt-1 text-xs">Votre premier message crée le fil ; il restera dans votre messagerie.</p>
                </div>
              )}
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
                                {msg.topic && (
                                  <div className="mb-1 text-[11px] font-medium text-[var(--text-muted)]">{msg.topic}</div>
                                )}
                                {activeConv.type === "group" && !isMine && (
                                  <div className="mb-0.5 text-[11px] font-semibold text-[var(--primary)]">
                                    {personById(msg.senderId)?.firstName ?? ""}
                                  </div>
                                )}
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
              {directoryChoices
                .filter((u) =>
                  `${u.firstName} ${u.lastName} ${u.city}`.toLowerCase().includes(newConvSearch.toLowerCase())
                )
                .map((user) => {
                  const hasThread = threads.some((t) => !t.isGroup && t.otherIds[0] === user.id);
                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        openWith(user.id);
                        setShowNewConv(false);
                        setNewConvSearch("");
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--hover-bg)] transition-colors"
                    >
                      <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div className="min-w-0 flex-1 text-left">
                        <div className="text-sm font-medium text-[var(--foreground)] truncate">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-[var(--text-muted)] truncate">
                          {roleLabel(user.activeRole, user.trades)} · {user.city}, {user.country}
                        </div>
                      </div>
                      {hasThread && (
                        <span className="shrink-0 text-[10px] text-[var(--text-muted)]">Fil existant</span>
                      )}
                    </button>
                  );
                })}
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
                {directoryChoices
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
                /* Le groupe entre au journal de session : il survit au
                   rechargement, et chaque membre est notifié. */
                const threadId = `grp-${sessionState.seq + 1}`;
                recordSessionEvent({
                  kind: "group.created",
                  data: { threadId, name: newGroupName.trim(), memberIds: [currentUserId, ...newGroupMembers] },
                });
                const newGroup = { id: threadId };
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
