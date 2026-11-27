"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Landmark, Loader2, Smartphone } from "lucide-react";
import { saveMyPayout } from "@/lib/supabase/settlement-actions";
import { isValidIban, normalizeSwissMobile, type PayoutProfile } from "@/lib/reglements";

/* Mes coordonnées pour être payé : remises uniquement à qui me doit une prime. */
export function PayoutForm({ initial, onSaved, submitLabel = "Enregistrer" }: { initial: PayoutProfile | null; onSaved?: () => void; submitLabel?: string }) {
  const router = useRouter();
  const [holderName, setHolderName] = useState(initial?.holderName ?? "");
  const [iban, setIban] = useState(initial?.iban ?? "");
  const [twintPhone, setTwintPhone] = useState(initial?.twintPhone ?? "");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const ibanBad = iban.trim().length > 4 && !isValidIban(iban);
  const phoneBad = twintPhone.trim().length > 6 && !normalizeSwissMobile(twintPhone);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await saveMyPayout({ holderName, iban, twintPhone });
      setMsg(res.ok ? { ok: true, text: "Enregistré." } : { ok: false, text: res.error });
      if (res.ok) { router.refresh(); onSaved?.(); }
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block"><span className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium"><Smartphone className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />Numéro TWINT</span>
          <Input value={twintPhone} onChange={(e) => setTwintPhone(e.target.value)} type="tel" placeholder="079 123 45 67" maxLength={20} aria-invalid={phoneBad} className="h-11 rounded-xl" />
          {phoneBad && <span className="mt-1 block text-[12px] text-[var(--danger-text)]">Un mobile suisse (07X).</span>}
        </label>
        <label className="block"><span className="mb-1.5 block text-[13px] font-medium">Titulaire du compte</span>
          <Input value={holderName} onChange={(e) => setHolderName(e.target.value)} placeholder="Prénom Nom" maxLength={120} autoComplete="name" className="h-11 rounded-xl" />
        </label>
      </div>
      <label className="block"><span className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium"><Landmark className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />IBAN</span>
        <Input value={iban} onChange={(e) => setIban(e.target.value)} placeholder="CH93 0076 2011 6238 5295 7" maxLength={42} className="h-11 rounded-xl font-mono" aria-invalid={ibanBad} />
        {ibanBad && <span className="mt-1 block text-[12px] text-[var(--danger-text)]">IBAN invalide : vérifiez les chiffres.</span>}
      </label>
      <p className="rounded-xl bg-subtle/60 px-3.5 py-2.5 text-[12px] leading-relaxed text-muted-foreground">Un seul des deux suffit. Visibles seulement par un vendeur qui vous doit une commission, le temps du paiement.</p>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="accent" disabled={isPending} className="h-11 rounded-xl px-5">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {submitLabel}
        </Button>
        {msg && (
          <p role={msg.ok ? "status" : "alert"} className={msg.ok ? "inline-flex items-center gap-1.5 text-[13px] font-medium text-leman" : "text-[13px] text-[var(--danger-text)]"}>
            {msg.ok && <Check className="h-4 w-4" aria-hidden />}
            {msg.text}
          </p>
        )}
      </div>
    </form>
  );
}
