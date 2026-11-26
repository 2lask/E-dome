"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block"><span className="mb-1.5 block text-[13px] font-medium">Numéro TWINT</span>
          <Input value={twintPhone} onChange={(e) => setTwintPhone(e.target.value)} type="tel" placeholder="079 123 45 67" maxLength={20} aria-invalid={phoneBad} />
          {phoneBad && <span className="mt-1 block text-[12px] text-[var(--danger-text)]">Un mobile suisse (07X).</span>}
        </label>
        <label className="block"><span className="mb-1.5 block text-[13px] font-medium">Titulaire du compte</span>
          <Input value={holderName} onChange={(e) => setHolderName(e.target.value)} placeholder="Prénom Nom" maxLength={120} autoComplete="name" />
        </label>
      </div>
      <label className="block"><span className="mb-1.5 block text-[13px] font-medium">IBAN</span>
        <Input value={iban} onChange={(e) => setIban(e.target.value)} placeholder="CH93 0076 2011 6238 5295 7" maxLength={42} className="font-mono" aria-invalid={ibanBad} />
        {ibanBad && <span className="mt-1 block text-[12px] text-[var(--danger-text)]">IBAN invalide : vérifiez les chiffres.</span>}
      </label>
      <p className="text-[12px] text-muted-foreground">Un seul des deux suffit. Visibles seulement par un vendeur qui vous doit une commission, le temps du paiement.</p>
      {msg && <p role={msg.ok ? "status" : "alert"} className={msg.ok ? "text-[13px] text-leman" : "text-[13px] text-[var(--danger-text)]"}>{msg.text}</p>}
      <Button type="submit" size="sm" variant="accent" disabled={isPending}>{submitLabel}</Button>
    </form>
  );
}
