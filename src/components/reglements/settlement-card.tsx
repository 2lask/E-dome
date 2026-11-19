"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { answerPayment, declarePaid, getPayeeDetails } from "@/lib/supabase/settlement-actions";
import { METHOD_LABEL, STATUS_LABEL, type PayMethod, type PayoutProfile, type Settlement } from "@/lib/reglements";
import { formatNumber } from "@/lib/format";
import { frDay } from "@/lib/my-property";
import { cn } from "@/lib/utils";

/* ── Une ligne de règlement ──────────────────────────────────────────────────
   Payeur : voir où verser (IBAN / TWINT de l'apporteur), puis « J'ai payé ».
   Apporteur : « Reçu » ou « Problème ». Le montant affiché est TOUJOURS le
   net à verser : la part E-Dome n'est pas ajoutée au prix. */

function CopyLine({ label, value }: { label: string; value: string }) {
  const [done, setDone] = useState(false);
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg bg-subtle/70 px-3 py-2 text-[13px]">
      <span><span className="text-muted-foreground">{label} </span><span className="font-mono">{value}</span></span>
      <button type="button" aria-label={`Copier ${label}`} className="text-muted-foreground hover:text-foreground"
        onClick={() => { void navigator.clipboard.writeText(value.replace(/\s/g, "")); setDone(true); setTimeout(() => setDone(false), 1500); }}>
        {done ? <Check className="h-4 w-4 text-leman" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
      </button>
    </div>
  );
}

export function SettlementCard({ s }: { s: Settlement }) {
  const router = useRouter();
  const [details, setDetails] = useState<PayoutProfile | null | undefined>(undefined);
  const [method, setMethod] = useState<PayMethod>("twint");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const status = STATUS_LABEL[s.status][s.role];
  const todo = (s.role === "payer" && s.status === "due") || (s.role === "payee" && s.status === "declared");

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>) =>
    startTransition(async () => {
      setError("");
      const res = await fn();
      if (!res.ok) { setError(res.error ?? "Erreur."); return; }
      router.refresh();
    });

  const showDetails = () =>
    startTransition(async () => {
      const res = await getPayeeDetails(s.id);
      if (!res.ok) { setError(res.error); return; }
      setDetails(res.details);
      if (res.details && !res.details.twintPhone) setMethod("virement");
    });

  return (
    <li className={cn("rounded-2xl border bg-card p-5", todo && "border-laiton-border")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[14px] font-semibold">
            {s.role === "payer" ? `À ${s.counterpartName}` : `De ${s.counterpartName}`}
            <span className="ml-2 font-normal text-muted-foreground">· {s.sourceKind === "introduction" ? "prime" : "récompense"} acceptée le {frDay(s.createdAt)}</span>
          </p>
          {s.label && <p className="mt-0.5 line-clamp-1 text-[13px] text-muted-foreground">{s.label}</p>}
        </div>
        <div className="text-right">
          <p className="text-[20px] font-semibold tabular-nums text-laiton">{formatNumber(s.netChf)} CHF</p>
          <p className="text-[11.5px] text-muted-foreground">sur {formatNumber(s.grossChf)} CHF · part E-Dome {formatNumber(s.feeChf)} CHF</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={cn("rounded-md px-2 py-0.5 text-[12px] font-medium", todo ? "bg-laiton-soft text-laiton" : s.status === "confirmed" ? "bg-leman-soft text-leman" : "bg-subtle")}>{status}</span>
        {s.method && s.status !== "due" && <span className="text-[12px] text-muted-foreground">par {METHOD_LABEL[s.method]}{s.declaredAt ? ` le ${frDay(s.declaredAt)}` : ""}</span>}
      </div>

      {s.role === "payer" && s.status === "due" && (
        <div className="mt-4 space-y-3">
          {details === undefined ? (
            <Button size="sm" variant="outline" onClick={showDetails} disabled={isPending}>Voir où verser</Button>
          ) : details === null ? (
            <p className="rounded-lg bg-subtle px-3 py-2 text-[13px]">{s.counterpartName} n&apos;a pas encore indiqué ses coordonnées de versement. Demandez-les-lui, ou revenez plus tard.</p>
          ) : (
            <div className="space-y-2">
              {details.twintPhone && <CopyLine label="TWINT" value={details.twintPhone} />}
              {details.iban && <CopyLine label="IBAN" value={details.iban} />}
              {details.holderName && <p className="text-[12.5px] text-muted-foreground">Titulaire : {details.holderName} · Communication : « E-Dome {s.id.slice(0, 8)} »</p>}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <select value={method} onChange={(e) => setMethod(e.target.value as PayMethod)} aria-label="Moyen de paiement"
              className="h-9 rounded-lg border border-input bg-card px-2 text-[13px]">
              {(Object.keys(METHOD_LABEL) as PayMethod[]).map((m) => <option key={m} value={m}>{METHOD_LABEL[m]}</option>)}
            </select>
            <Button size="sm" variant="prime" disabled={isPending} onClick={() => run(() => declarePaid(s.id, method))}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}J&apos;ai payé {formatNumber(s.netChf)} CHF
            </Button>
          </div>
        </div>
      )}

      {s.role === "payee" && s.status === "declared" && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" variant="accent" disabled={isPending} onClick={() => run(() => answerPayment(s.id, "confirmed"))}>J&apos;ai bien reçu le paiement</Button>
          <Button size="sm" variant="outline" disabled={isPending} onClick={() => run(() => answerPayment(s.id, "disputed"))}>Je n&apos;ai rien reçu</Button>
        </div>
      )}

      {s.status === "disputed" && (
        <p className="mt-3 text-[12.5px] text-muted-foreground">Contesté : écrivez-nous via la page Contact avec la référence « {s.id.slice(0, 8)} », nous vous aidons à le régler.</p>
      )}
      {error && <p role="alert" className="mt-2 text-[12.5px] text-[var(--danger-text)]">{error}</p>}
    </li>
  );
}
