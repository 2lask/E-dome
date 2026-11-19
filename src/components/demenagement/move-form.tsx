"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createMoveRequest } from "@/lib/supabase/move-actions";
import { MOVE_SERVICES, type MoveService } from "@/lib/demenagement";
import { cn } from "@/lib/utils";

/* ── Demande de devis de déménagement ────────────────────────────────────────
   Une seule fois pour tout : on coche les services, on dit d'où, où et quand.
   L'accord de transmission est explicite (au plus trois artisans). */

const FIELD =
  "w-full rounded-lg border border-input bg-card px-3 py-2.5 text-[14px] leading-relaxed shadow-xs outline-none placeholder:text-muted-foreground hover:border-foreground/25 focus:border-leman";

export function MoveForm({
  defaults,
}: {
  defaults: { name: string; email: string; fromCity: string; services: MoveService[]; propertyId: string };
}) {
  const [services, setServices] = useState<MoveService[]>(defaults.services.length ? defaults.services : ["nettoyage"]);
  const [fromCity, setFromCity] = useState(defaults.fromCity);
  const [toCity, setToCity] = useState("");
  const [moveDate, setMoveDate] = useState("");
  const [rooms, setRooms] = useState("");
  const [details, setDetails] = useState("");
  const [name, setName] = useState(defaults.name);
  const [email, setEmail] = useState(defaults.email);
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [today] = useState(() => new Date().toISOString().slice(0, 10));

  const toggle = (s: MoveService) =>
    setServices((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const n = Number(rooms.replace(",", "."));
      const res = await createMoveRequest({
        services,
        fromCity,
        toCity,
        moveDate,
        rooms: rooms && Number.isFinite(n) ? n : null,
        details,
        name,
        email,
        phone,
        consent: consent as true,
        propertyId: defaults.propertyId,
        website,
      });
      if (!res.ok) { setError(res.error); return; }
      setSent(true);
    });
  };

  if (sent) {
    return (
      <div className="py-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-leman" aria-hidden />
        <p className="mt-3 text-[16px] font-semibold">Demande envoyée</p>
        <p className="mx-auto mt-1 max-w-sm text-[13.5px] leading-relaxed text-muted-foreground">
          Nous la transmettons à trois artisans au plus, choisis pour votre région. Ils vous contactent directement avec
          leur devis. Vous ne vous engagez à rien.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <fieldset>
        <legend className="mb-2 text-[13px] font-medium">De quoi avez-vous besoin ?</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {MOVE_SERVICES.map((s) => {
            const on = services.includes(s.id);
            return (
              <label key={s.id} className={cn("flex cursor-pointer items-start gap-2.5 rounded-xl border px-3.5 py-3", on ? "border-leman bg-leman-soft/50" : "bg-card hover:border-foreground/25")}>
                <input type="checkbox" checked={on} onChange={() => toggle(s.id)} className="mt-0.5 h-4 w-4 accent-[var(--leman)]" />
                <span><span className="block text-[14px] font-medium">{s.label}</span><span className="block text-[12.5px] text-muted-foreground">{s.hint}</span></span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block"><span className="mb-1.5 block text-[13px] font-medium">Logement quitté (localité)</span>
          <Input value={fromCity} onChange={(e) => setFromCity(e.target.value)} placeholder="Neuchâtel" required maxLength={80} /></label>
        <label className="block"><span className="mb-1.5 block text-[13px] font-medium">Nouveau logement <span className="font-normal text-muted-foreground">(facultatif)</span></span>
          <Input value={toCity} onChange={(e) => setToCity(e.target.value)} placeholder="Lausanne" maxLength={80} /></label>
        <label className="block"><span className="mb-1.5 block text-[13px] font-medium">Date prévue</span>
          <Input type="date" min={today} value={moveDate} onChange={(e) => setMoveDate(e.target.value)} /></label>
        <label className="block"><span className="mb-1.5 block text-[13px] font-medium">Nombre de pièces</span>
          <Input value={rooms} onChange={(e) => setRooms(e.target.value)} inputMode="decimal" placeholder="3,5" maxLength={4} /></label>
      </div>

      <label className="block"><span className="mb-1.5 block text-[13px] font-medium">Précisions <span className="font-normal text-muted-foreground">(facultatif)</span></span>
        <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={3} maxLength={1500} className={FIELD}
          placeholder="Étage, ascenseur, piano, date de l'état des lieux…" /></label>

      <div className="grid gap-3 sm:grid-cols-3">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" aria-label="Votre nom" autoComplete="name" required />
        <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="E-mail" aria-label="Votre e-mail" autoComplete="email" />
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="Téléphone" aria-label="Votre téléphone" autoComplete="tel" />
      </div>

      <input tabIndex={-1} autoComplete="off" aria-hidden value={website} onChange={(e) => setWebsite(e.target.value)} name="website" className="absolute left-[-9999px] h-0 w-0 opacity-0" />

      <label className="flex items-start gap-2.5 text-[13px] leading-relaxed">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--leman)]" />
        <span>J&apos;accepte qu&apos;E-Dome transmette ma demande et mes coordonnées à <strong>trois artisans au plus</strong> pour recevoir leurs devis.</span>
      </label>

      {error && <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-[13px] text-[var(--danger-text)]">{error}</p>}

      <Button type="submit" variant="accent" className="w-full sm:w-auto" disabled={isPending || services.length === 0}>
        {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        Recevoir mes devis gratuits
      </Button>
    </form>
  );
}
