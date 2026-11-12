"use client";

import { use } from "react";
import Link from "next/link";
import { Award, Printer } from "lucide-react";
import { useFormation } from "@/components/formations/use-formation";
import { formationsText } from "@/content/formations";
import { completionDate } from "@/lib/demo/lessons";
import { personById } from "@/lib/demo/directory";
import { useSession } from "@/lib/use-session";

/* /formations/[id]/certificat — le certificat (P6a). Il n'existe qu'à 100 %
   (dérivé des leçons cochées), au nom de la personne incarnée ; la date est
   celle de la dernière leçon terminée, sur l'horloge de la démonstration.
   Imprimable (window.print). Il dit clairement qu'il est de démonstration. */

const T = formationsText.certificate;

export default function CertificatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { formation, loading, progress, actorId } = useFormation(id);
  const { state, hydrated } = useSession();

  if (loading || !hydrated) {
    return <p className="py-16 text-center text-[var(--text-muted)]">Chargement…</p>;
  }
  if (!formation || !progress) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-[var(--text-muted)]">Formation introuvable.</p>
        <Link href="/formations" className="inline-block px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-sm">Toutes les formations</Link>
      </div>
    );
  }

  if (!progress.certificate) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <Award size={40} className="mx-auto text-[var(--text-muted)]" aria-hidden />
        <h1 className="text-xl page-heading">{formation.title}</h1>
        <p className="text-sm text-[var(--text-secondary)]">{T.notYet}</p>
        {progress.enrolled && <p className="text-sm tabular-nums">{T.progressNow(progress.percent)}</p>}
        <Link href={`/formations/${formation.id}`} className="inline-block px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-medium">
          {T.continue}
        </Link>
      </div>
    );
  }

  const actor = personById(actorId);
  const name = actor ? `${actor.firstName} ${actor.lastName}` : "";
  const author = `${formation.instructor.firstName} ${formation.instructor.lastName}`;
  const date = completionDate(state, actorId, formation.id);
  const number = `${formation.id}-${actorId}`.toUpperCase();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href={`/formations/${formation.id}`} className="text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)]">
          ← {T.back}
        </Link>
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90">
          <Printer size={15} aria-hidden /> {T.print}
        </button>
      </div>

      <section
        aria-label={T.title}
        className="relative bg-white text-neutral-900 rounded-2xl border-[6px] border-double border-amber-700/60 px-6 py-10 md:px-14 md:py-14 text-center shadow-sm"
      >
        <p className="absolute top-3 left-0 right-0 text-[11px] font-semibold uppercase tracking-widest text-red-700">{T.demo}</p>
        <Award size={44} className="mx-auto text-amber-700" aria-hidden />
        <h1 className="mt-3 text-3xl md:text-4xl font-serif">{T.title}</h1>
        <p className="mt-6 text-sm text-neutral-600">{T.certifies}</p>
        <p className="mt-2 text-2xl md:text-3xl font-serif font-semibold">{name}</p>
        <p className="mt-4 text-sm text-neutral-600">{T.completed}</p>
        <p className="mt-2 text-xl md:text-2xl font-serif">« {formation.title} »</p>
        <p className="mt-4 text-sm text-neutral-700">{T.author(author)}</p>
        <p className="mt-1 text-sm text-neutral-700">{T.lessons(progress.total)}</p>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-4 text-xs text-neutral-500">
          <span>{T.date(date)}</span>
          <span>E-Dome</span>
          <span>{T.number(number)}</span>
        </div>
      </section>
    </div>
  );
}
