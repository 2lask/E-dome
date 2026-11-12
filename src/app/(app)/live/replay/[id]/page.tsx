import type { Metadata } from "next";
import Link from "next/link";
import { Film } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";
import { REPLAYS, formatVues, getReplayById } from "@/lib/replays";

/* ── SERVER COMPONENT ────────────────────────────────────────────────────────
   Première page du groupe (app) convertie après le découpage du layout.
   Elle n'a aucune interactivité propre (le seul élément client est
   `BackButton`, importé comme composant), donc rien ne justifiait de
   l'envoyer au navigateur.

   Ce que la conversion débloque concrètement :
   - `generateMetadata` : titre et description réels par replay, pour le
     partage et le référencement — impossible tant que la page était client.
   - `generateStaticParams` : les 6 replays sont prérendus au build. C'est
     aussi un prérequis de `output: "export"`, nécessaire pour empaqueter
     l'application avec Capacitor.
   Modèle à suivre pour /explorer, /formations, /evenements, /boutique. */

/* ─── Prérendu & métadonnées ─────────────────────────────────────────────── */

/* Les six replays étaient recopiés ici, indexés « 1 » à « 6 », pendant que
   /live les identifiait R1 à R6 et liait par position. Les deux copies
   divergeaient déjà sur les accents. Ils viennent maintenant de
   @/lib/replays, et l'URL porte le vrai identifiant. */

export function generateStaticParams() {
  return REPLAYS.map((r) => ({ id: r.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const replay = getReplayById(id);

  if (!replay) {
    return { title: "Replay introuvable · E-Dome" };
  }

  return {
    title: `${replay.titre} · Replay E-Dome`,
    description: `Replay du live « ${replay.titre} » animé par ${replay.speaker} le ${replay.date}.`,
    openGraph: {
      title: replay.titre,
      description: `Live animé par ${replay.speaker} · ${formatVues(replay.vues)} vues`,
      type: "video.other",
    },
  };
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default async function ReplayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const replay = getReplayById(id);

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
          className="inline-block px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90 transition"
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

      {/* Pas de vidéo sans rapport : la maquette n'embarque aucun replay réel. */}
      <div className="rounded-xl overflow-hidden bg-gray-900 aspect-video flex flex-col items-center justify-center gap-3 px-6 text-center">
        <Film size={36} strokeWidth={1.5} className="text-white/50" aria-hidden />
        <p className="text-sm text-white/70 max-w-md">
          Démonstration : l&apos;enregistrement de ce live serait diffusé ici. Aucune vidéo n&apos;est incluse dans la maquette.
        </p>
      </div>

      {/* Info */}
      <div className="space-y-2">
        <h1 className="text-2xl page-heading text-[var(--foreground)]">{replay.titre}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)]">
          <Link href={`/profil/${replay.speakerId}`} className="font-medium text-[var(--primary)] hover:underline">{replay.speaker}</Link>
          <span className="text-[var(--text-muted)]">&middot;</span>
          <span>{replay.date}</span>
          <span className="text-[var(--text-muted)]">&middot;</span>
          <span>{formatVues(replay.vues)} vues</span>
        </div>
      </div>
    </div>
  );
}
