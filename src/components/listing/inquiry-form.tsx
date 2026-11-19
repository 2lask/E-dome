"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, CalendarDays, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createInquiry } from "@/lib/supabase/demande-actions";
import { cn } from "@/lib/utils";

/* ── Demande sur un bien (REBUILD.md §3.4) ───────────────────────────────────

   Contacter ou demander une visite — visiteurs compris, sans compte. La
   demande arrive dans la boîte « Demandes » du vendeur ; le vendeur est déduit
   du bien côté serveur. Un champ caché (pot de miel) écarte les robots. */

export function InquiryForm({
  propertyId,
  propertyTitle,
  defaults,
  dossierPct = null,
}: {
  propertyId: string;
  propertyTitle: string;
  defaults?: { name: string; email: string } | null;
  /** Location + membre : complétude de son dossier (null = rien à joindre). */
  dossierPct?: number | null;
}) {
  const [kind, setKind] = useState<"contact" | "visite">("contact");
  const [name, setName] = useState(defaults?.name ?? "");
  const [email, setEmail] = useState(defaults?.email ?? "");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [attach, setAttach] = useState(dossierPct !== null && dossierPct > 0);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  /* Date minimale : demain (une visite ne se planifie pas dans le passé). */
  const [tomorrow] = useState(() => new Date(Date.now() + 86400000).toISOString().slice(0, 10));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const res = await createInquiry({
        propertyId,
        kind,
        name,
        email,
        phone,
        message: message.trim() || (kind === "visite" ? "Je souhaite visiter ce bien." : `Ce bien m'intéresse : « ${propertyTitle} ».`),
        preferredDate: kind === "visite" ? date : "",
        website,
        attachDossier: attach && dossierPct !== null && dossierPct > 0,
      });
      if (!res.ok) { setError(res.error); return; }
      setSent(true);
    });
  };

  if (sent) {
    return (
      <div className="py-4 text-center">
        <CheckCircle2 className="mx-auto h-9 w-9 text-leman" aria-hidden />
        <p className="mt-3 text-[15px] font-semibold">Demande envoyée</p>
        <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
          Le propriétaire la reçoit directement et vous répondra
          {email && phone ? " par e-mail ou par téléphone" : email ? " par e-mail" : " par téléphone"}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div role="radiogroup" aria-label="Type de demande" className="grid grid-cols-2 rounded-lg border bg-subtle p-0.5">
        {([
          { v: "contact", label: "Contacter", icon: MessageSquareText },
          { v: "visite", label: "Visiter", icon: CalendarDays },
        ] as const).map(({ v, label, icon: Icon }) => (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={kind === v}
            onClick={() => setKind(v)}
            className={cn(
              "inline-flex h-8.5 items-center justify-center gap-1.5 rounded-md text-[13px]",
              kind === v ? "bg-card font-medium shadow-xs" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {label}
          </button>
        ))}
      </div>

      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" aria-label="Votre nom" autoComplete="name" required />
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="E-mail" aria-label="Votre e-mail" autoComplete="email" />
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="Téléphone" aria-label="Votre téléphone" autoComplete="tel" />
      </div>

      {kind === "visite" && (
        <label className="block">
          <span className="mb-1 block text-[12.5px] text-muted-foreground">Date souhaitée</span>
          <Input type="date" min={tomorrow} value={date} onChange={(e) => setDate(e.target.value)} aria-label="Date de visite souhaitée" />
        </label>
      )}

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        maxLength={2000}
        aria-label="Votre message"
        placeholder={kind === "visite" ? "Vos disponibilités, vos questions…" : "Votre projet, vos questions…"}
        className="w-full rounded-lg border border-input bg-card px-3 py-2 text-[13.5px] shadow-xs outline-none placeholder:text-muted-foreground hover:border-foreground/25 focus:border-leman"
      />

      {/* Pot de miel : invisible pour un humain, rempli par les robots. */}
      <input
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        name="website"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      {dossierPct !== null && (
        dossierPct > 0 ? (
          <label className="flex items-start gap-2 rounded-lg border bg-leman-soft/40 px-3 py-2.5 text-[13px]">
            <input type="checkbox" checked={attach} onChange={(e) => setAttach(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--leman)]" />
            <span>Joindre mon dossier de location <span className="text-muted-foreground">({dossierPct} % complet · lien personnel 30 jours)</span></span>
          </label>
        ) : (
          <a href="/dossier" className="block rounded-lg border border-dashed px-3 py-2.5 text-[13px] text-muted-foreground hover:text-foreground">
            Préparez votre dossier de location une fois, joignez-le en un clic →
          </a>
        )
      )}

      {error && <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-[12.5px] text-[var(--danger-text)]">{error}</p>}

      <Button type="submit" variant="accent" className="w-full" disabled={isPending}>
        {isPending ? "Envoi…" : kind === "visite" ? "Demander une visite" : "Envoyer au propriétaire"}
      </Button>
      <p className="text-center text-[11.5px] leading-snug text-muted-foreground">
        Laissez un e-mail ou un téléphone. Vos coordonnées ne sont transmises qu&apos;au propriétaire de ce bien.
      </p>
    </form>
  );
}
