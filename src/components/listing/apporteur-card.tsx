"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Coins, Copy, Check, Loader2, Share2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrCreateMyLink } from "@/lib/supabase/apport-actions";
import { commissionLabel, dueLabel, netForApporteur, type CommissionTerms } from "@/lib/commission";
import { formatNumber } from "@/lib/format";
import { track } from "./track";

/* ── « Recommandez ce bien, touchez la commission » ──────────────────────────
   Le cœur de l'apport d'affaires sur la fiche : combien on gagne, puis UN
   bouton qui donne un lien personnel tracé (et le partage WhatsApp). Tout
   lead arrivé par ce lien est attribué à l'apporteur pendant 60 jours. */

export function ApporteurCard({
  propertyId, title, city, terms, estimateChf, member,
}: {
  propertyId: string;
  title: string;
  city: string;
  terms: CommissionTerms;
  estimateChf: number;
  member: boolean;
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
    <div className="relative overflow-hidden rounded-2xl border border-laiton-border bg-gradient-to-br from-laiton-soft via-laiton-soft/70 to-card p-5">
      <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgb(176_122_26/0.22),transparent_70%)]" />
      <div className="relative">
        <p className="flex items-center gap-2 text-[13px] font-semibold text-laiton"><Coins className="h-4 w-4" aria-hidden /> Recommandez ce bien</p>
        <p className="mt-2 text-[13px] text-muted-foreground">
          {terms.dueOn === "acceptation" ? "Vous touchez, dès que le vendeur accepte le contact que vous lui amenez :" : `Vous touchez, si la personne que vous amenez ${terms.kind === "pourcentage" ? "achète" : "signe"} :`}
        </p>
        <p className="mt-0.5 text-[32px] font-semibold leading-tight tracking-[-0.02em] text-laiton tabular-nums">
          {terms.kind === "pourcentage" ? "≈ " : ""}{formatNumber(net)} CHF
        </p>
        <p className="text-[12.5px] text-muted-foreground">
          Commission {commissionLabel(terms)}, {dueLabel(terms)} · net après la part E-Dome (12 %)
        </p>

        {!member ? (
          <Button asChild variant="prime" className="mt-4 w-full">
            <Link href={`/auth/inscription?redirect=${encodeURIComponent(`/explorer/${propertyId}#recommander`)}`}>Obtenir mon lien d&apos;apporteur</Link>
          </Button>
        ) : !url ? (
          <Button variant="prime" className="mt-4 w-full" onClick={getLink} disabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} Obtenir mon lien d&apos;apporteur
          </Button>
        ) : (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2">
              <span className="min-w-0 flex-1 truncate font-mono text-[12px]">{url.replace(/^https?:\/\//, "")}</span>
              <button type="button" onClick={() => void copy()} aria-label="Copier mon lien" className="text-muted-foreground hover:text-foreground">
                {copied ? <Check className="h-4 w-4 text-leman" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild size="sm" className="bg-[#1f8f4e] text-white hover:bg-[#197a42]">
                <a href={`https://wa.me/?text=${encodeURIComponent(`${message} ${url}`)}`} target="_blank" rel="noopener noreferrer" onClick={() => track(propertyId, "partage")}>
                  <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
                </a>
              </Button>
              <Button size="sm" variant="outline" onClick={() => void share()}><Share2 className="h-4 w-4" aria-hidden /> Partager</Button>
            </div>
            <p className="text-[12px] text-muted-foreground">Chaque contact venu par ce lien vous est attribué 60 jours. Suivez tout dans votre <Link href="/tableau-de-bord" className="font-medium text-leman hover:underline">tableau de bord</Link>.</p>
          </div>
        )}
        {error && <p role="alert" className="mt-2 text-[12.5px] text-[var(--danger-text)]">{error}</p>}
      </div>
    </div>
  );
}
