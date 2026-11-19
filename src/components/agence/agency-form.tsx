"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveMyAgency } from "@/lib/supabase/agency-actions";
import { isValidSlug, slugify, type Agency } from "@/lib/agences";

/* ── La fiche d'une agence (création et modification) ───────────────────────
   Deux minutes : le nom, l'adresse de la page, la ville. Le reste est
   facultatif. L'adresse se déduit du nom tant qu'on ne la touche pas. */

const FIELD =
  "w-full rounded-lg border border-input bg-card px-3 py-2.5 text-[14px] leading-relaxed shadow-xs outline-none placeholder:text-muted-foreground hover:border-foreground/25 focus:border-leman";

export function AgencyForm({ initial }: { initial?: Agency | null }) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [city, setCity] = useState(initial?.city ?? "");
  const [zone, setZone] = useState(initial?.zone ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [website, setWebsite] = useState(initial?.website ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [publicEmail, setPublicEmail] = useState(initial?.publicEmail ?? "");
  const [uidNumber, setUidNumber] = useState(initial?.uidNumber ?? "");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const effectiveSlug = slugTouched ? slug : slugify(name);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaved(false);
    startTransition(async () => {
      const res = await saveMyAgency({ name, slug: effectiveSlug, city, zone, description, website, phone, publicEmail, uidNumber });
      if (!res.ok) { setError(res.error); return; }
      setSaved(true);
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium">Nom de l&apos;agence</span>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex. Immobilière du Littoral SA" required maxLength={80} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium">Localité principale</span>
          <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Neuchâtel" required maxLength={80} />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-[13px] font-medium">Adresse de votre page</span>
        <div className="flex items-center rounded-lg border border-input bg-subtle/60 shadow-xs focus-within:border-leman">
          <span className="shrink-0 pl-3 text-[13px] text-muted-foreground">e-dome · /agences/</span>
          <input
            value={effectiveSlug}
            onChange={(e) => { setSlugTouched(true); setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")); }}
            className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-[14px] outline-none"
            aria-label="Adresse de votre page"
            maxLength={40}
            data-focus-ring="none"
          />
        </div>
        {effectiveSlug && !isValidSlug(effectiveSlug) && (
          <span className="mt-1 block text-[12px] text-[var(--danger-text)]">3 à 40 caractères : lettres, chiffres et tirets (pas au début ni à la fin).</span>
        )}
      </label>

      <label className="block">
        <span className="mb-1.5 block text-[13px] font-medium">Communes couvertes <span className="font-normal text-muted-foreground">(facultatif)</span></span>
        <Input value={zone} onChange={(e) => setZone(e.target.value)} placeholder="Neuchâtel, Peseux, Colombier, Boudry" maxLength={200} />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-[13px] font-medium">Présentation <span className="font-normal text-muted-foreground">(facultatif)</span></span>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} maxLength={1500} className={FIELD}
          placeholder="Qui vous êtes, ce que vous vendez, comment vous traitez les apporteurs." />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium">Site web</span>
          <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://…" maxLength={200} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium">Téléphone</span>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="032 …" maxLength={40} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium">E-mail public</span>
          <Input value={publicEmail} onChange={(e) => setPublicEmail(e.target.value)} type="email" placeholder="contact@…" maxLength={120} />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-[13px] font-medium">Numéro IDE <span className="font-normal text-muted-foreground">(pour le badge « agence vérifiée »)</span></span>
        <Input value={uidNumber} onChange={(e) => setUidNumber(e.target.value)} placeholder="CHE-123.456.789" maxLength={20} />
        <span className="mt-1 block text-[12px] text-muted-foreground">E-Dome contrôle le numéro au registre du commerce avant d&apos;afficher le badge. Le modifier retire le badge.</span>
      </label>

      {error && <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-[13px] text-[var(--danger-text)]">{error}</p>}
      {saved && <p role="status" className="rounded-lg bg-leman-soft px-3 py-2 text-[13px] text-leman">Fiche enregistrée.</p>}

      <Button type="submit" variant="accent" disabled={isPending}>
        {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {initial ? "Enregistrer" : "Créer le programme de mon agence"}
      </Button>
    </form>
  );
}
