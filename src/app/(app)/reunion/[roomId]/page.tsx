"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft, Copy, Check, ShieldCheck, Calendar, Link as LinkIcon,
} from "lucide-react";
import { JitsiMeet } from "@/components/jitsi-meet";
import { currentUser } from "@/lib/mock-data";

/* /reunion/[roomId] : page de visio E-Dome powered by Jitsi Meet.
   Layout split : iframe Jitsi plein ecran a gauche, sidebar info a droite
   (titre, lien partageable, participants attendus, regles). */

export default function ReunionPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const subject = searchParams.get("titre") ?? "Reunion E-Dome";
  const inviteUrl = typeof window !== "undefined"
    ? `${window.location.origin}/reunion/${roomId}`
    : `/reunion/${roomId}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(inviteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col lg:flex-row">
      {/* Visio principale */}
      <div className="relative flex-1 bg-black">
        <button
          type="button"
          onClick={() => router.back()}
          className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-md bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm hover:bg-black/80"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Retour
        </button>
        <JitsiMeet
          roomName={roomId}
          displayName={`${currentUser.firstName} ${currentUser.lastName}`}
          subject={subject}
          className="absolute inset-0 h-full w-full rounded-none border-0 bg-black"
        />
      </div>

      {/* Sidebar info (cachee sur mobile) */}
      <aside className="hidden w-80 shrink-0 border-l border-border bg-card p-6 lg:block">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
          Reunion en cours
        </p>
        <h1 className="page-heading mt-1 text-2xl">{subject}</h1>
        <p className="mt-1 font-mono text-xs text-muted-foreground">#{roomId}</p>

        <div className="mt-6 space-y-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Lien d&apos;invitation</p>
            <div className="mt-1 flex items-center gap-2 rounded-md border border-border bg-background p-2">
              <LinkIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate font-mono text-[11px]">{inviteUrl}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Copier le lien"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          <div className="rounded-md border border-border bg-muted/40 p-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-success" />
              <p className="text-xs font-medium">Connexion securisee</p>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Visio chiffree de bout en bout via Jitsi Meet. Pas de compte requis pour vos invites.
            </p>
          </div>

          <div className="rounded-md border border-border p-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs font-medium">Programmer plus tard</p>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Pour planifier une reunion future, utilisez le calendrier du dashboard.
            </p>
            <Link
              href="/dashboard/calendrier"
              className="mt-2 inline-block text-[11px] font-medium underline underline-offset-2"
            >
              Ouvrir le calendrier
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
