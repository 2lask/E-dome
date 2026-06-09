"use client";

import React, { useState, useRef, useEffect } from "react";
import { Video, VideoOff, Mic, MicOff, X, AlertTriangle } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   CameraPreview — aperçu LOCAL réel via navigator.mediaDevices.
   Allume la vraie webcam + micro de l'utilisateur, affiche le flux
   dans un <video> local. Aucune diffusion à une audience (ce serait
   un service payant type Mux/LiveKit, hors scope maquette).

   Usage : ouvrir comme modal depuis /live. Toggle vidéo / micro,
   bouton "Arrêter" coupe proprement tous les tracks.
   ───────────────────────────────────────────────────────────── */

interface CameraPreviewProps {
  open: boolean;
  onClose: () => void;
}

type State = "idle" | "requesting" | "live" | "denied" | "unsupported";

export function CameraPreview({ open, onClose }: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [videoOn, setVideoOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  // Démarre le flux à l'ouverture
  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function start() {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        setState("unsupported");
        setErrorMsg("Votre navigateur ne supporte pas l'accès aux médias.");
        return;
      }
      setState("requesting");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setState("live");
      } catch (err) {
        const e = err as Error;
        setState("denied");
        setErrorMsg(
          e.name === "NotAllowedError"
            ? "Accès refusé. Autorisez la caméra et le micro dans votre navigateur."
            : e.name === "NotFoundError"
            ? "Aucune caméra ou micro détecté sur cet appareil."
            : `Impossible de démarrer la caméra : ${e.message}`
        );
      }
    }

    start();

    return () => {
      cancelled = true;
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function stopStream() {
    const s = streamRef.current;
    if (s) {
      s.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setState("idle");
  }

  function toggleVideo() {
    const s = streamRef.current;
    if (!s) return;
    const newState = !videoOn;
    setVideoOn(newState);
    s.getVideoTracks().forEach((t) => (t.enabled = newState));
  }

  function toggleMic() {
    const s = streamRef.current;
    if (!s) return;
    const newState = !micOn;
    setMicOn(newState);
    s.getAudioTracks().forEach((t) => (t.enabled = newState));
  }

  function handleClose() {
    stopStream();
    onClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl overflow-hidden animate-scale-in"
        style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--card-border)" }}>
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: state === "live" ? "#ef4444" : "var(--text-muted)" }}
            />
            <h3 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
              Aperçu caméra local
            </h3>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {state === "live" ? "En direct (local)" : state === "requesting" ? "Demande d'accès…" : state === "denied" ? "Refusé" : state === "unsupported" ? "Non supporté" : "Inactif"}
            </span>
          </div>
          <button
            onClick={handleClose}
            aria-label="Fermer"
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <X size={18} />
          </button>
        </div>

        {/* Video area */}
        <div className="relative aspect-video bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted /* sortie audio coupée pour éviter le larsen — le micro reste capté */
            className="w-full h-full object-cover"
            style={{ display: state === "live" && videoOn ? "block" : "none" }}
          />
          {state === "live" && !videoOn && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
              <VideoOff size={48} className="opacity-40" />
              <p className="text-sm opacity-70">Vidéo coupée</p>
            </div>
          )}
          {state === "requesting" && (
            <div className="text-white text-sm opacity-80">Demande d&apos;accès à la caméra…</div>
          )}
          {(state === "denied" || state === "unsupported") && (
            <div className="flex flex-col items-center gap-3 text-white px-6 text-center">
              <AlertTriangle size={36} className="text-amber-400" />
              <p className="text-sm max-w-md">{errorMsg}</p>
            </div>
          )}
        </div>

        {/* Controls + footer */}
        <div className="px-5 py-4 space-y-4">
          {state === "live" && (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={toggleVideo}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                style={{
                  background: videoOn ? "var(--hover-bg)" : "rgba(239,68,68,0.10)",
                  color: videoOn ? "var(--foreground)" : "var(--destructive)",
                }}
              >
                {videoOn ? <Video size={16} /> : <VideoOff size={16} />}
                {videoOn ? "Vidéo" : "Vidéo coupée"}
              </button>
              <button
                onClick={toggleMic}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                style={{
                  background: micOn ? "var(--hover-bg)" : "rgba(239,68,68,0.10)",
                  color: micOn ? "var(--foreground)" : "var(--destructive)",
                }}
              >
                {micOn ? <Mic size={16} /> : <MicOff size={16} />}
                {micOn ? "Micro" : "Micro coupé"}
              </button>
              <button
                onClick={handleClose}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors text-white"
                style={{ background: "var(--destructive)" }}
              >
                Arrêter l&apos;aperçu
              </button>
            </div>
          )}
          <p className="text-[11px] text-center leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Aperçu <strong>local uniquement</strong> — aucune diffusion à une audience, aucun enregistrement, aucun envoi serveur. La diffusion en direct (Mux/LiveKit) et les replays seront activés en Phase 4 V1.0.
          </p>
        </div>
      </div>
    </div>
  );
}
