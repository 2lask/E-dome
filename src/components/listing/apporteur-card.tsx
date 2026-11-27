"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Coins, Copy, Check, Loader2, Share2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrCreateMyLink } from "@/lib/supabase/apport-actions";
import { commissionLabel, dueLabel, netForApporteur, type CommissionTerms } from "@/lib/commission";
import { formatNumber } from "@/lib/format";
import type { TransactionType } from "@/lib/types";
import { track } from "./track";

/* ── « Recommandez ce bien, touchez la commission » ──────────────────────────
   Le cœur de l'apport d'affaires sur la fiche : combien on gagne, puis UN
   bouton qui donne un lien personnel tracé (et le partage WhatsApp). Tout
   lead arrivé par ce lien est attribué à l'apporteur pendant 60 jours. */

export function ApporteurCard({
  propertyId, title, city, terms, estimateChf, member, transactionType,
}: {
  propertyId: string;
  title: string;
  city: string;
  terms: CommissionTerms;
  estimateChf: number;
  member: boolean;
  transactionType?: TransactionType;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const net = Math.round(netForApporteur(estimateChf));
  const message = `${title} à ${city} — je pense que ça peut t'intéresser :`;

  const getLink = () =>
    startTransition(async () => {
      setError("");
      const res = await getOrCreateMyLink(propertyId);
      if (!res.ok) { setError(res.error); return; }
      setUrl(`${window.location.origin}/explorer/${propertyId}?ref=${res.code}`);
    });

  const copy = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    track(propertyId, "partage");
    setTimeout(() => setCopied(false), 1800);
  };
  const share = async () => {
    if (!url) return;
    track(propertyId, "partage");
    try { if (navigator.share) await navigator.share({ title, text: message, url }); else await copy(); } catch { /* annulé */ }
  };

  return (
    <div className="group/ap relative isolate overflow-hidden rounded-[22px] border border-laiton-border bg-card p-5 shadow-[0_30px_80px_-40px_rgb(217_164_65/0.55)]">
      {/* Halos dorés et fine ligne de lumière en tête de carte */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-laiton-soft via-laiton-soft/40 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 -z-10 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgb(227_184_92/0.32),transparent_65%)] transition-transform duration-700 group-hover/ap:scale-110 motion-reduce:transition-none" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 -z-10 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgb(227_184_92/0.14),transparent_70%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#e3b85c] to-transparent opacity-80" />

      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-laiton">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-laiton-border bg-laiton-soft">
            <Coins className="h-3.5 w-3.5" aria-hidden />
          </span>
          Recommandez ce bien
        </p>
      </div>
      <p className="mt-4 text-[13px] leading-snug text-muted-foreground">
        {terms.dueOn === "acceptation" ? "Vous touchez, dès que le vendeur accepte le contact que vous lui amenez :" : `Vous touchez, si la personne que vous amenez ${terms.kind === "pourcentage" ? "achète" : "signe"} :`}
      </p>
      <p className="mt-1 text-[38px] font-semibold leading-[1.05] tracking-[-0.03em] text-laiton tabular-nums dark:bg-[linear-gradient(180deg,#fff1cc_0%,#f2c66b_50%,#d9a441_100%)] dark:bg-clip-text dark:[-webkit-text-fill-color:transparent]">
        {terms.kind === "pourcentage" ? "≈ " : ""}{formatNumber(net)} CHF
      </p>
      <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
        Commission {commissionLabel(terms)}, {dueLabel(terms, transactionType)} · net après la part E-Dome (12 %)
      </p>

      {!url && (
        <ol className="mt-4 grid grid-cols-3 gap-1.5 text-[11.5px] leading-tight">
          {["Votre lien personnel", "Partagez-le", terms.dueOn === "acceptation" ? "Contact accepté : vous touchez" : "Vente conclue : vous touchez"].map((s, i) => (
            <li key={s} className="rounded-xl border border-laiton-border/70 bg-background/40 px-2.5 py-2">
              <span className="block text-[11px] font-semibold tabular-nums text-laiton">0{i + 1}</span>
              <span className="mt-0.5 block text-foreground/80">{s}</span>
            </li>
          ))}
        </ol>
      )}

      {!member ? (
        <Button asChild variant="prime" className="mt-4 h-11 w-full text-[14px]">
          <Link href={`/auth/inscription?redirect=${encodeURIComponent(`/explorer/${propertyId}#recommander`)}`}>Obtenir mon lien d&apos;apporteur</Link>
        </Button>
      ) : !url ? (
        <Button variant="prime" className="mt-4 h-11 w-full text-[14px]" onClick={getLink} disabled={isPending}>
          {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} Obtenir mon lien d&apos;apporteur
        </Button>
      ) : (
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 rounded-xl border border-laiton-border bg-background/60 py-1 pl-3 pr-1">
            <span className="min-w-0 flex-1 truncate font-mono text-[12px]">{url.replace(/^https?:\/\//, "")}</span>
            <button type="button" onClick={() => void copy()} aria-label="Copier mon lien" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-laiton-soft hover:text-foreground">
              {copied ? <Check className="h-4 w-4 text-leman" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button asChild className="h-11 bg-[#1f8f4e] text-white hover:bg-[#197a42]">
              <a href={`https://wa.me/?text=${encodeURIComponent(`${message} ${url}`)}`} target="_blank" rel="noopener noreferrer" onClick={() => track(propertyId, "partage")}>
                <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
              </a>
            </Button>
            <Button variant="outline" className="h-11" onClick={() => void share()}><Share2 className="h-4 w-4" aria-hidden /> Partager</Button>
          </div>
          <p className="text-[12px] text-muted-foreground">Chaque contact venu par ce lien vous est attribué 60 jours. Suivez tout dans votre <Link href="/tableau-de-bord" className="font-medium text-leman hover:underline">tableau de bord</Link>.</p>
        </div>
      )}
      {error && <p role="alert" className="mt-2 text-[12.5px] text-[var(--danger-text)]">{error}</p>}
    </div>
  );
}
