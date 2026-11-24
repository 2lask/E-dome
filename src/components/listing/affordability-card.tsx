"use client";

import { useState } from "react";
import { Calculator, CheckCircle2, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { affordability } from "@/lib/affordability";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/* ── « Puis-je me l'offrir ? » — capacité financière indicative ─────────────
   La première question d'un acheteur, en dix secondes : la règle usuelle des
   banques suisses appliquée au prix de CE bien. Rien n'est envoyé ni
   enregistré : le calcul se fait dans le navigateur. */

const num = (s: string) => Number(s.replace(/[^\d]/g, "")) || 0;
const chf = (n: number) => `${formatNumber(Math.round(n))} CHF`;

export function AffordabilityCard({ price }: { price: number }) {
  const [equity, setEquity] = useState(String(Math.round(price * 0.2)));
  const [income, setIncome] = useState("");
  const a = affordability(price, num(equity), num(income));
  const monthly = a.annualCost / 12;

  return (
    <section aria-labelledby="afford-title" className="rounded-2xl border bg-card p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 id="afford-title" className="flex items-center gap-2 text-[16px] font-semibold"><Calculator className="h-4 w-4 text-leman" aria-hidden /> Puis-je me l&apos;offrir ?</h2>
        <span className="rounded-full bg-subtle px-2.5 py-1 text-[11px] text-muted-foreground">calcul indicatif</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-[12.5px] font-medium">Fonds propres</span>
          <Input value={equity ? formatNumber(num(equity)) : ""} onChange={(e) => setEquity(e.target.value)} inputMode="numeric" placeholder="0"
            trailing={<span className="pr-2 text-[12.5px] text-muted-foreground">CHF</span>} />
        </label>
        <label className="block">
          <span className="mb-1 block text-[12.5px] font-medium">Revenu brut annuel du ménage</span>
          <Input value={income ? formatNumber(num(income)) : ""} onChange={(e) => setIncome(e.target.value)} inputMode="numeric" placeholder="0"
            trailing={<span className="pr-2 text-[12.5px] text-muted-foreground">CHF</span>} />
        </label>
      </div>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
        <Tile label="Hypothèque" value={chf(a.loan)} sub={`${String(Math.round(a.equityShare * 1000) / 10).replace(".", ",")} % de fonds propres`} />
        <Tile label="Charges théoriques" value={`${chf(monthly)} / mois`} sub="intérêts 5 %, amortissement, entretien" />
        <Tile label="Revenu nécessaire" value={chf(a.requiredIncome)} sub="par an (charges ≤ 1/3)" />
      </div>

      <ul className="mt-3 space-y-1.5 text-[13px]">
        <Verdict ok={a.equityOk} text={a.equityOk ? "Fonds propres suffisants (au moins 20 % du prix)." : `Il faut en général au moins ${chf(a.requiredEquity)} de fonds propres (20 %).`} />
        {a.incomeOk !== null && (
          <Verdict ok={a.incomeOk} text={a.incomeOk
            ? `Charges à ${String(a.costShare).replace(".", ",")} % du revenu : dans la règle du tiers.`
            : `Charges à ${String(a.costShare).replace(".", ",")} % du revenu : au-delà du tiers admis en général.`} />
        )}
      </ul>
      <p className="mt-3 text-[11.5px] leading-relaxed text-muted-foreground">
        Règle usuelle des banques suisses (taux théorique 5 %, amortissement et entretien ~1 % chacun, charges au plus un tiers du revenu brut). Chaque banque calcule à sa façon : ce n&apos;est ni un conseil ni une offre de crédit. Rien n&apos;est enregistré.
      </p>
    </section>
  );
}

function Tile({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border bg-background p-3">
      <p className="text-[11.5px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-[16px] font-semibold tabular-nums">{value}</p>
      <p className="text-[11px] text-muted-foreground">{sub}</p>
    </div>
  );
}

function Verdict({ ok, text }: { ok: boolean; text: string }) {
  const Icon = ok ? CheckCircle2 : AlertTriangle;
  return (
    <li className={cn("flex items-start gap-2", ok ? "text-leman" : "text-[var(--warning-text,#8a5d0c)]")}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> <span className="text-foreground">{text}</span>
    </li>
  );
}
