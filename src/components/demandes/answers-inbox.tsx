"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, X, Mail, Phone, Radar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { decideAnswer } from "@/lib/supabase/search-actions";
import { relativeFr } from "@/lib/demandes";
import { formatNumber } from "@/lib/format";
import type { SearchAnswer } from "@/lib/recherches";

/* ── Propositions reçues sur MES recherches à récompense ─────────────────────
   Même règle que les mises en relation : accepter rend la récompense due (montant
   figé) et révèle les coordonnées d'un tiers éventuel ; refuser ne coûte rien. */

export function AnswersInbox({ answers }: { answers: SearchAnswer[] }) {
  if (answers.length === 0) return null;
  const pending = answers.filter((a) => a.status === "proposee");
  const accepted = answers.filter((a) => a.status === "acceptee");
  return (
    <section aria-label="Propositions sur vos recherches" className="mb-8">
      <div className="mb-3 flex items-center gap-2">
        <Radar className="h-4 w-4 text-laiton" aria-hidden />
        <h2 className="text-[16px] font-semibold tracking-[-0.01em]">Propositions sur vos recherches</h2>
        {pending.length > 0 && <span className="chip-prime rounded-full px-2 py-0.5 text-[11.5px] font-medium tabular-nums">{pending.length}</span>}
      </div>
      <ul className="grid gap-3 lg:grid-cols-2">
        {[...pending, ...accepted].map((a) => <li key={a.id}><AnswerCard a={a} /></li>)}
      </ul>
    </section>
  );
}

function AnswerCard({ a }: { a: SearchAnswer }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const decide = (d: "acceptee" | "refusee") =>
    startTransition(async () => {
      const res = await decideAnswer(a.id, d);
      if (!res.ok) { addToast(res.error, "error"); return; }
      addToast(d === "acceptee" ? `Acceptée. La récompense de ${formatNumber(a.rewardChf)} CHF est due.` : "Refusée. Rien n'est dû.", d === "acceptee" ? "success" : "info");
      router.refresh();
    });

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-laiton-border bg-card p-5 shadow-xs">
      <div aria-hidden className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-laiton/70 to-transparent" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] text-muted-foreground"><span className="font-medium text-foreground">{a.authorName}</span> vous propose</p>
          <Link href={`/recherches/${a.searchId}`} className="block truncate text-[14px] font-semibold hover:underline">{a.searchTitle}</Link>
        </div>
        <span className="chip-prime shrink-0 rounded-lg px-2 py-1 text-[12.5px] font-semibold tabular-nums">{formatNumber(a.rewardChf)} CHF</span>
      </div>
      <blockquote className="mt-4 whitespace-pre-line rounded-2xl border-l-2 border-laiton bg-subtle px-3.5 py-3 text-[13.5px] leading-snug">{a.pitch}</blockquote>
      {a.propertyId && (
        <Link href={`/explorer/${a.propertyId}`} className="mt-2 inline-flex items-center gap-1 text-[13px] font-medium text-leman hover:underline">
          Voir l&apos;annonce proposée <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </Link>
      )}
      {a.status === "acceptee" ? (
        <div className="mt-3 rounded-2xl border border-leman/25 bg-leman-soft/50 p-3.5 text-[13px]">
          <p className="font-medium">Acceptée · récompense due</p>
          {a.contact ? (
            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
              <span>{a.contact.name}</span>
              {a.contact.email && <a href={`mailto:${a.contact.email}`} className="inline-flex items-center gap-1 text-leman hover:underline"><Mail className="h-3.5 w-3.5" aria-hidden />{a.contact.email}</a>}
              {a.contact.phone && <a href={`tel:${a.contact.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1 text-leman hover:underline"><Phone className="h-3.5 w-3.5" aria-hidden />{a.contact.phone}</a>}
            </div>
          ) : (
            <p className="mt-1 text-muted-foreground">Contactez {a.authorName} pour la suite.</p>
          )}
        </div>
      ) : (
        <>
          <p className="mt-2 text-[12px] text-muted-foreground">
            Récompense fixe, due seulement si vous acceptez. Les coordonnées éventuelles apparaissent après acceptation. {relativeFr(a.createdAt)}.
          </p>
          <div className="mt-auto flex flex-wrap gap-2 pt-4 [&_button]:h-11 [&_button]:rounded-xl sm:[&_button]:h-9 sm:[&_button]:rounded-lg">
            {confirming ? (
              <>
                <Button variant="prime" size="sm" disabled={isPending} onClick={() => decide("acceptee")}><Check className="h-4 w-4" aria-hidden /> Confirmer · je dois {formatNumber(a.rewardChf)} CHF</Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>Annuler</Button>
              </>
            ) : (
              <>
                <Button size="sm" disabled={isPending} onClick={() => setConfirming(true)}>Accepter</Button>
                <Button variant="outline" size="sm" disabled={isPending} onClick={() => decide("refusee")}><X className="h-4 w-4" aria-hidden /> Refuser · rien dû</Button>
              </>
            )}
          </div>
        </>
      )}
    </article>
  );
}
