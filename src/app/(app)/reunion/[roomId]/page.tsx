"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft, Copy, Check, ShieldCheck, Mic, MicOff, Video, VideoOff,
  Users, Settings, Loader2, Sparkles, PhoneOff, MessageSquare, X,
} from "lucide-react";
import { JitsiMeet } from "@/components/jitsi-meet";
import { currentUser } from "@/lib/mock-data";

/* /reunion/[roomId] : 2 etapes
   1. Lobby (pre-join) : preview camera, controles micro/cam, nom editable,
      info salle (titre, lien d'invitation, participants attendus).
   2. Stage : header noir Zoom-style (titre + timer + bouton inviter +
      bouton quitter) + Jitsi iframe + sidebar collapsible (info + chat). */

type Stage = "lobby" | "in-call";

export default function ReunionPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();

  const subject = searchParams.get("titre") ?? "Reunion E-Dome";
  const inviteUrl = typeof window !== "undefined"
    ? `${window.location.origin}/reunion/${roomId}`
    : `/reunion/${roomId}`;

  const [stage, setStage] = useState<Stage>("lobby");
  const [displayName, setDisplayName] = useState(
    `${currentUser.firstName} ${currentUser.lastName}`,
  );
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);

  if (stage === "lobby") {
    return (
      <Lobby
        subject={subject}
        roomId={roomId}
        inviteUrl={inviteUrl}
        displayName={displayName}
        setDisplayName={setDisplayName}
        audioMuted={audioMuted}
        setAudioMuted={setAudioMuted}
        videoMuted={videoMuted}
        setVideoMuted={setVideoMuted}
        onJoin={() => setStage("in-call")}
        onBack={() => router.back()}
      />
    );
  }

  return (
    <Stage
      subject={subject}
      roomId={roomId}
      inviteUrl={inviteUrl}
      displayName={displayName}
      audioMuted={audioMuted}
      videoMuted={videoMuted}
      onLeave={() => router.back()}
    />
  );
}

/* ─── LOBBY ───────────────────────────────────────────────────────────
   Preview camera en haut, controles micro/cam au-dessus du preview,
   form nom + bouton Rejoindre en-dessous. Sidebar info a droite. */

function Lobby({
  subject, roomId, inviteUrl, displayName, setDisplayName,
  audioMuted, setAudioMuted, videoMuted, setVideoMuted, onJoin, onBack,
}: {
  subject: string;
  roomId: string;
  inviteUrl: string;
  displayName: string;
  setDisplayName: (v: string) => void;
  audioMuted: boolean;
  setAudioMuted: (v: boolean) => void;
  videoMuted: boolean;
  setVideoMuted: (v: boolean) => void;
  onJoin: () => void;
  onBack: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [camStatus, setCamStatus] = useState<"loading" | "granted" | "denied" | "off">("loading");
  const [copied, setCopied] = useState(false);

  /* Demande l'acces camera/micro a l'ouverture. Si refuse, fallback avatar. */
  useEffect(() => {
    if (videoMuted) {
      setCamStatus("off");
      stopStream();
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCamStatus("denied");
      return;
    }
    setCamStatus("loading");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCamStatus("granted");
      })
      .catch(() => setCamStatus("denied"));

    return stopStream;
  }, [videoMuted]);

  function stopStream() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }

  const handleJoin = () => {
    stopStream();
    onJoin();
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(inviteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-zinc-950 text-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_320px] lg:py-10">
        {/* Preview + controls */}
        <div className="space-y-5">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-white/60 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Retour
          </button>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
              Salle d&apos;attente
            </p>
            <h1 className="page-heading mt-1 text-3xl text-white">{subject}</h1>
            <p className="mt-1 font-mono text-xs text-white/40">#{roomId}</p>
          </div>

          {/* Video preview */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black">
            {camStatus === "granted" && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full -scale-x-100 object-cover"
              />
            )}
            {camStatus === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-white/40" />
              </div>
            )}
            {(camStatus === "denied" || camStatus === "off") && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 font-mono text-2xl">
                  {initials}
                </div>
                <p className="text-xs text-white/50">
                  {camStatus === "denied" ? "Caméra non accessible" : "Caméra désactivée"}
                </p>
              </div>
            )}

            {/* Controls overlay */}
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
              <CircleToggle
                active={!audioMuted}
                onClick={() => setAudioMuted(!audioMuted)}
                label={audioMuted ? "Activer micro" : "Couper micro"}
              >
                {audioMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </CircleToggle>
              <CircleToggle
                active={!videoMuted}
                onClick={() => setVideoMuted(!videoMuted)}
                label={videoMuted ? "Activer camera" : "Couper camera"}
              >
                {videoMuted ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
              </CircleToggle>
            </div>
          </div>

          {/* Name + Join */}
          <div className="space-y-3">
            <div>
              <label htmlFor="displayName" className="text-xs font-medium text-white/60">
                Votre nom dans la salle
              </label>
              <input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-white/30"
                placeholder="Prénom Nom"
              />
            </div>
            <button
              type="button"
              onClick={handleJoin}
              disabled={!displayName.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-white py-3 text-sm font-medium text-zinc-950 transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <Sparkles className="h-4 w-4" />
              Rejoindre la réunion
            </button>
          </div>
        </div>

        {/* Sidebar info */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
              Lien d&apos;invitation
            </p>
            <p className="mt-2 break-all font-mono text-[11px] text-white/80">{inviteUrl}</p>
            <button
              type="button"
              onClick={handleCopy}
              className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Lien copié" : "Copier le lien"}
            </button>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <p className="text-xs font-medium">Connexion sécurisée</p>
            </div>
            <p className="mt-1 text-[11px] text-white/60">
              Visio chiffrée via Jitsi Meet. Pas de compte requis pour vos invités.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-white/60" />
              <p className="text-xs font-medium">Conseils</p>
            </div>
            <ul className="mt-2 space-y-1.5 text-[11px] text-white/60">
              <li>· Casque recommandé pour éviter l&apos;écho</li>
              <li>· Connexion câblée si possible</li>
              <li>· Fermez les onglets vidéo en arrière-plan</li>
            </ul>
          </div>

          <Link
            href="/dashboard/calendrier"
            className="block rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/70 transition-colors hover:bg-white/10"
          >
            <p className="font-medium text-white">Programmer une réunion</p>
            <p className="mt-1 text-[11px] text-white/50">
              Calendrier du dashboard →
            </p>
          </Link>
        </aside>
      </div>
    </div>
  );
}

/* ─── STAGE ───────────────────────────────────────────────────────────
   Header noir (titre + timer + inviter + quitter), Jitsi iframe en plein
   ecran, sidebar collapsible (toggle bouton "Participants" / "Info"). */

function Stage({
  subject, roomId, inviteUrl, displayName, audioMuted, videoMuted, onLeave,
}: {
  subject: string;
  roomId: string;
  inviteUrl: string;
  displayName: string;
  audioMuted: boolean;
  videoMuted: boolean;
  onLeave: () => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const [sidePanel, setSidePanel] = useState<null | "info">(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    navigator.clipboard?.writeText(inviteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timer = `${minutes}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col bg-zinc-950 text-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/10 bg-zinc-950/95 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3 min-w-0">
          <span className="hidden h-2 w-2 rounded-full bg-rose-500 sm:inline-block" aria-hidden />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{subject}</p>
            <p className="font-mono text-[10px] text-white/40">
              #{roomId} · {timer}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{copied ? "Copié" : "Inviter"}</span>
          </button>
          <button
            type="button"
            onClick={() => setSidePanel(sidePanel === "info" ? null : "info")}
            className={`inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium hover:bg-white/10 ${
              sidePanel === "info" ? "bg-white/15" : "bg-white/5"
            }`}
            aria-pressed={sidePanel === "info"}
          >
            <Users className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Infos</span>
          </button>
          <button
            type="button"
            onClick={onLeave}
            className="inline-flex items-center gap-1.5 rounded-md bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-500"
          >
            <PhoneOff className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Quitter</span>
          </button>
        </div>
      </header>

      {/* Stage body */}
      <div className="relative flex flex-1 overflow-hidden">
        <div className="relative flex-1 bg-black">
          <JitsiMeet
            roomName={roomId}
            displayName={displayName}
            subject={subject}
            audioMuted={audioMuted}
            videoMuted={videoMuted}
            hidePrejoin
            className="absolute inset-0 h-full w-full bg-black"
          />
        </div>

        {/* Side panel info (collapsible) */}
        {sidePanel === "info" && (
          <aside className="w-80 shrink-0 border-l border-white/10 bg-zinc-950 p-5">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                Informations
              </p>
              <button
                type="button"
                onClick={() => setSidePanel(null)}
                className="rounded-sm p-1 text-white/60 hover:bg-white/10 hover:text-white"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs text-white/60">Lien d&apos;invitation</p>
                <p className="mt-1 break-all font-mono text-[11px] text-white/80">{inviteUrl}</p>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium hover:bg-white/10"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copié" : "Copier"}
                </button>
              </div>

              <div className="rounded-md border border-white/10 bg-white/5 p-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <p className="text-xs font-medium">Connexion sécurisée</p>
                </div>
                <p className="mt-1 text-[11px] text-white/60">
                  Visio chiffrée via Jitsi Meet.
                </p>
              </div>

              <div className="rounded-md border border-white/10 bg-white/5 p-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-white/60" />
                  <p className="text-xs font-medium">Chat de la salle</p>
                </div>
                <p className="mt-1 text-[11px] text-white/60">
                  Utilisez le chat intégré Jitsi (icône en bas de l&apos;iframe) pour discuter pendant la réunion.
                </p>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

/* ─── Helpers ─────────────────────────────────────────────────────── */

function CircleToggle({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${
        active
          ? "border-white/20 bg-white/10 text-white hover:bg-white/15"
          : "border-rose-500/40 bg-rose-500/15 text-rose-300 hover:bg-rose-500/25"
      }`}
    >
      {children}
    </button>
  );
}
