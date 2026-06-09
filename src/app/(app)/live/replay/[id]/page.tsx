"use client";

import { use } from "react";
import Link from "next/link";
import { Film } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";

/* ─── Replay Data ───────────────────────────────────────────────────────── */

const REPLAYS: Record<string, { title: string; speaker: string; date: string; vues: string; youtubeId: string }> = {
  "1": { title: "Les tendances du marche Q1 2026", speaker: "Jean-Pierre Dumont", date: "20 mars 2026", vues: "1 240", youtubeId: "FqjDgXlE2nQ" },
  "2": { title: "Comment fixer le bon prix de location", speaker: "Nadia Silva", date: "15 mars 2026", vues: "890", youtubeId: "E0dyHPjiJDo" },
  "3": { title: "Fiscalite immobiliere en Suisse", speaker: "Patrick Leroy", date: "10 mars 2026", vues: "2 100", youtubeId: "_DtWLPqqnwU" },
  "4": { title: "Home staging : avant/apres", speaker: "Amina Kone", date: "5 mars 2026", vues: "670", youtubeId: "p5Kk_HBASHg" },
  "5": { title: "Droit du bail : vos obligations", speaker: "Thomas Roth", date: "28 fev. 2026", vues: "1 560", youtubeId: "NBjn9FkvpCQ" },
  "6": { title: "Photographie immobiliere pro", speaker: "Amina Kone", date: "20 fev. 2026", vues: "780", youtubeId: "FqjDgXlE2nQ" },
};

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function ReplayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const replay = REPLAYS[id];

  if (!replay) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 mx-auto rounded-full bg-[var(--card)] text-[var(--text-muted)] flex items-center justify-center">
          <Film size={32} strokeWidth={1.6} />
        </div>
        <h1 className="text-2xl page-heading text-[var(--foreground)]">Replay introuvable</h1>
        <p className="text-[var(--text-secondary)]">Ce replay n&apos;existe pas ou a ete supprime.</p>
        <Link
          href="/live"
          className="inline-block px-5 py-2.5 rounded-lg bg-[#1e9df1] text-white text-sm font-medium hover:opacity-90 transition"
        >
          Retour aux lives
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      {/* Back link */}
      <BackButton fallbackHref="/live" label="Retour aux lives" />

      {/* YouTube Embed */}
      <div className="rounded-xl overflow-hidden bg-gray-900">
        <iframe
          className="w-full aspect-video"
          src={`https://www.youtube.com/embed/${replay.youtubeId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={replay.title}
        />
      </div>

      {/* Info */}
      <div className="space-y-2">
        <h1 className="text-2xl page-heading text-[var(--foreground)]">{replay.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)]">
          <span className="font-medium text-[#1e9df1]">{replay.speaker}</span>
          <span className="text-[var(--text-muted)]">&middot;</span>
          <span>{replay.date}</span>
          <span className="text-[var(--text-muted)]">&middot;</span>
          <span>{replay.vues} vues</span>
        </div>
      </div>
    </div>
  );
}
