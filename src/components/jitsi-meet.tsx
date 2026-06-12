"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* JitsiMeet : iframe Jitsi Meet (meet.jit.si, gratuit, sans cle).
   - roomName : identifiant unique de la salle (visible dans l'URL Jitsi).
   - displayName : nom affiche du participant dans la salle.
   - subject : titre affiche en haut de la conference.
   - audioMuted / videoMuted : etat initial du micro/camera au join.
   - hidePrejoin : skip l'ecran "Etes-vous pret a rejoindre ?" interne
     a Jitsi (on a notre propre lobby E-Dome au-dessus).

   Notes :
   - meet.jit.si est public ; ajoute un prefix "edome-" devant roomName pour
     reduire les collisions avec d'autres utilisateurs Jitsi.
   - configOverwrite et interfaceConfigOverwrite sont passes via le hash de
     l'URL (#config.X=Y) — c'est le mecanisme officiel Jitsi pour iframe simple.
   - Si tu passes plus tard a un domaine Jitsi self-hosted, change DOMAIN. */

const DOMAIN = "meet.jit.si";

interface JitsiMeetProps {
  roomName: string;
  displayName?: string;
  subject?: string;
  audioMuted?: boolean;
  videoMuted?: boolean;
  hidePrejoin?: boolean;
  className?: string;
}

export function JitsiMeet({
  roomName,
  displayName,
  subject,
  audioMuted = false,
  videoMuted = false,
  hidePrejoin = true,
  className,
}: JitsiMeetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  /* Prefixe edome- pour reduire les collisions globales sur meet.jit.si. */
  const safeRoom = useMemo(() => `edome-${roomName.replace(/[^a-zA-Z0-9-_]/g, "-")}`, [roomName]);

  /* Construction de l'URL Jitsi avec config hash. Les params apres # sont
     interpretes par Jitsi pour configurer la salle SANS avoir besoin du SDK. */
  const url = useMemo(() => {
    const params: Record<string, string | boolean> = {
      "config.prejoinPageEnabled": !hidePrejoin,
      "config.disableDeepLinking": true,
      "config.startWithAudioMuted": audioMuted,
      "config.startWithVideoMuted": videoMuted,
      "config.disableInviteFunctions": true,
      "interfaceConfig.SHOW_JITSI_WATERMARK": false,
      "interfaceConfig.SHOW_WATERMARK_FOR_GUESTS": false,
      "interfaceConfig.DEFAULT_BACKGROUND": "#0a0a0a",
      "interfaceConfig.DEFAULT_REMOTE_DISPLAY_NAME": "Participant",
      "interfaceConfig.MOBILE_APP_PROMO": false,
      "interfaceConfig.SHOW_PROMOTIONAL_CLOSE_PAGE": false,
      "interfaceConfig.HIDE_INVITE_MORE_HEADER": true,
    };
    if (displayName) {
      params["userInfo.displayName"] = displayName;
    }
    if (subject) {
      params["config.subject"] = subject;
    }
    const hash = Object.entries(params)
      .map(([k, v]) => `${k}=${typeof v === "string" ? encodeURIComponent(JSON.stringify(v)) : v}`)
      .join("&");
    return `https://${DOMAIN}/${safeRoom}#${hash}`;
  }, [safeRoom, displayName, subject, audioMuted, videoMuted, hidePrejoin]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div
      ref={containerRef}
      className={className ?? "relative w-full h-full overflow-hidden bg-black"}
    >
      {loaded ? (
        <iframe
          title={`Salle Jitsi ${safeRoom}`}
          src={url}
          allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
          className="h-full w-full"
          style={{ border: 0 }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-white/60">
          <span className="font-mono text-xs uppercase tracking-wider">Connexion à la salle…</span>
        </div>
      )}
    </div>
  );
}
