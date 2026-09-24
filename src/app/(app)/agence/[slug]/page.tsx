"use client";

import { use } from "react";
import Link from "next/link";
import { ShieldCheck, MapPin, Users, FileSignature, ArrowLeft } from "lucide-react";
import { demoAgency } from "@/content/agence";
import { properties as CATALOGUE } from "@/lib/mock-data";
import { useApp } from "@/lib/context";

/* ── `/agence/[slug]` — la page publique d'une agence ────────────────────────

   Ce que voit un visiteur : l'identité de l'agence, son badge vérifié, ses
   biens. Une seule agence de démonstration existe ; tout autre slug affiche un
   message plutôt qu'une page vide. */

export default function AgencePubliquePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { formatPrice } = useApp();

  if (slug !== demoAgency.slug) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 text-center">
        <p className="text-sm text-[var(--text-muted)]">Cette agence n'existe pas dans la démonstration.</p>
        <Link href="/agence" className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-[var(--primary)] hover:underline">
          <ArrowLeft size={14} aria-hidden /> Retour à l'espace agence
        </Link>
      </div>
    );
  }

  /* Trois biens du catalogue, présentés comme la vitrine de l'agence. */
  const listings = CATALOGUE.filter((p) => p.transactionType === "vente").slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:py-8">
      <header className="mb-5 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">{demoAgency.name}</h1>
          {demoAgency.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={12} /> Vérifiée
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{demoAgency.tagline}</p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] text-[var(--text-muted)]">
          <span className="flex items-center gap-1"><MapPin size={13} aria-hidden />{demoAgency.city}</span>
          <span className="flex items-center gap-1"><Users size={13} aria-hidden />{demoAgency.members} agents</span>
          <span className="flex items-center gap-1"><FileSignature size={13} aria-hidden />{demoAgency.activeMandates} mandats actifs</span>
          <span>Sur E-Dome depuis {demoAgency.since}</span>
        </div>
      </header>

      <h2 className="mb-2 text-sm font-semibold text-[var(--foreground)]">Biens en vente</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {listings.map((p) => (
          <Link
            key={p.id}
            href={`/explorer/${p.id}`}
            className="group overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card)] transition-colors hover:border-[var(--primary)]/40"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.images[0]} alt="" className="h-32 w-full object-cover" />
            <div className="p-3">
              <p className="line-clamp-1 text-[13px] font-semibold text-[var(--foreground)]">{p.title}</p>
              <p className="mt-0.5 text-[12px] text-[var(--text-muted)]">{p.location.city}</p>
              <p className="mt-1 text-[13px] font-bold text-[var(--primary)]">{formatPrice(p.price, p.currency)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
