"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { answerSearch } from "@/lib/supabase/search-actions";
import type { SearchKind } from "@/lib/recherches";

/* ── Proposer quelque chose à une recherche ──────────────────────────────────
   Un logement que vous connaissez (votre voisin part, une annonce E-Dome…) ou,
   pour une agence, un propriétaire qui veut vendre. Si vous présentez une
   PERSONNE, ses coordonnées ne sont transmises qu'après acceptation, et
   seulement avec son accord. */

const FIELD =
  "w-full rounded-lg border border-input bg-card px-3 py-2.5 text-[14px] leading-relaxed shadow-xs outline-none placeholder:text-muted-foreground hover:border-foreground/25 focus:border-leman";

export function AnswerForm({ searchId, kind }: { searchId: string; kind: SearchKind }) {
  const [pitch, setPitch] = useState("");
  const [url, setUrl] = useState("");
  const [withContact, setWithContact] = useState(kind === "vendeurs");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const res = await answerSearch({
        searchId,
        pitch,
        propertyUrl: url,
        contact: withContact ? { name, email, phone, consent } : null,
      });
      if (!res.ok) { setError(res.error); return; }
      setSent(true);
    });
  };

  if (sent) {
    return (
      <div className="py-4 text-center">
        <CheckCircle2 className="mx-auto h-9 w-9 text-leman" aria-hidden />
        <p className="mt-3 text-[15px] font-semibold">Proposition envoyée</p>
        <p className="mt-1 text-[13px] text-muted-foreground">Vous serez prévenu de sa décision dans votre espace « Gagner ».</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block">
        <span className="mb-1.5 block text-[13px] font-medium">Votre proposition</span>
        <textarea value={pitch} onChange={(e) => setPitch(e.target.value)} rows={4} maxLength={1500} required className={FIELD}
          placeholder={kind === "vendeurs"
            ? "Ex. Mon voisin vend sa maison de 5 pièces à Peseux d'ici l'été ; il est d'accord d'être contacté."
            : "Ex. Ma collègue quitte son 3,5 pièces à Sous-Gare fin janvier, loyer 2'250 CHF, balcon."} />
      </label>
      {kind === "logement" && (
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium">Lien d&apos;une annonce E-Dome <span className="font-normal text-muted-foreground">(facultatif)</span></span>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…/explorer/…" />
        </label>
      )}
      <label className="flex items-center gap-2.5 text-[13.5px]">
        <input type="checkbox" checked={withContact} onChange={(e) => setWithContact(e.target.checked)} className="h-4 w-4 accent-[var(--leman)]" />
        Je présente une personne ({kind === "vendeurs" ? "le propriétaire" : "le locataire qui part, le propriétaire…"})
      </label>
      {withContact && (
        <div className="space-y-2.5 rounded-xl border bg-subtle/60 p-3.5">
          <div className="grid gap-2 sm:grid-cols-3">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" aria-label="Nom de la personne" />
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="E-mail" aria-label="E-mail de la personne" />
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="Téléphone" aria-label="Téléphone de la personne" />
          </div>
          <p className="text-[12px] text-muted-foreground">Transmises seulement si la proposition est acceptée.</p>
          <label className="flex items-start gap-2 text-[12.5px]">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--leman)]" />
            Cette personne m&apos;a autorisé à transmettre ses coordonnées.
          </label>
        </div>
      )}
      {error && <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-[12.5px] text-[var(--danger-text)]">{error}</p>}
      <Button type="submit" variant="prime" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} Envoyer ma proposition
      </Button>
    </form>
  );
}
