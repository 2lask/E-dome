import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Wallet, ShieldCheck } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { getMyPayout, listMySettlements } from "@/lib/supabase/settlement-actions";
import { SettlementCard } from "@/components/reglements/settlement-card";
import { PayoutForm } from "@/components/reglements/payout-form";
import { formatNumber } from "@/lib/format";

export const metadata: Metadata = { title: "Règlements", robots: { index: false, follow: false } };

/* ── /reglements — à payer, à recevoir ───────────────────────────────────────
   Le dernier maillon du moteur : une prime acceptée doit être PAYÉE. Pilote
   sans intermédiaire financier (TWINT, virement) ; la confirmation des deux
   côtés laisse une trace. */

export default async function ReglementsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/connexion?redirect=%2Freglements");
  const [{ settlements, ready }, payout] = await Promise.all([listMySettlements(), getMyPayout()]);
  const toPay = settlements.filter((s) => s.role === "payer");
  const toReceive = settlements.filter((s) => s.role === "payee");
  const dueOut = toPay.filter((s) => s.status === "due").reduce((t, s) => t + s.netChf, 0);
  const pendingIn = toReceive.filter((s) => s.status === "due" || s.status === "declared").reduce((t, s) => t + s.netChf, 0);
  const received = toReceive.filter((s) => s.status === "confirmed").reduce((t, s) => t + s.netChf, 0);

  return (
    <div className="mx-auto max-w-5xl">
      <p className="eyebrow">Argent</p>
      <h1 className="page-heading mt-1.5 text-[30px]">Règlements</h1>
      <p className="mt-1 max-w-2xl text-[14px] text-muted-foreground">
        Chaque prime ou récompense acceptée devient un règlement. Le payeur verse le montant net directement à
        l&apos;apporteur (TWINT ou virement), puis chacun confirme. E-Dome ne détient jamais votre argent.
      </p>

      {!ready && <p role="status" className="mt-6 rounded-lg bg-warning-soft px-4 py-3 text-[13px]">Les règlements arrivent bientôt (base à mettre à jour, migration 008).</p>}

      <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="À payer" value={dueOut} />
        <Stat label="À recevoir" value={pendingIn} prime />
        <Stat label="Déjà reçu" value={received} />
      </section>

      {!payout && toReceive.length > 0 && (
        <p className="mt-4 rounded-xl border border-laiton-border bg-laiton-soft/60 px-4 py-3 text-[13.5px]">
          <strong>Indiquez où vous payer</strong> (TWINT ou IBAN) : sans cela, on ne peut pas vous verser vos gains.
        </p>
      )}

      {toPay.length > 0 && (
        <section className="mt-8">
          <h2 className="text-[17px] font-semibold">À payer</h2>
          <ul className="mt-3 space-y-3">{toPay.map((s) => <SettlementCard key={s.id} s={s} />)}</ul>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-[17px] font-semibold">À recevoir</h2>
        {toReceive.length === 0 ? (
          <p className="mt-2 text-[13.5px] text-muted-foreground">Rien pour l&apos;instant. Présentez un contact sur un bien à prime ou répondez à une recherche : chaque acceptation apparaît ici.</p>
        ) : (
          <ul className="mt-3 space-y-3">{toReceive.map((s) => <SettlementCard key={s.id} s={s} />)}</ul>
        )}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border bg-card p-5">
          <p className="flex items-center gap-2 text-[15px] font-semibold"><Wallet className="h-4 w-4 text-leman" aria-hidden />Où vous payer</p>
          <div className="mt-4"><PayoutForm initial={payout} /></div>
        </div>
        <aside className="rounded-2xl border bg-card p-5 text-[13px] leading-relaxed text-muted-foreground">
          <ShieldCheck className="h-5 w-5 text-leman" aria-hidden />
          <p className="mt-2 font-semibold text-foreground">Comment c&apos;est calculé</p>
          <p className="mt-1">Montant fixe annoncé, dû à l&apos;acceptation. La part E-Dome (12 %, 3 CHF minimum) est comprise dans ce montant : l&apos;apporteur reçoit le net, le payeur ne paie jamais plus que l&apos;annonce.</p>
          <p className="mt-2">Phase pilote : la part E-Dome est enregistrée mais pas encore encaissée ; elle le sera avec le paiement intégré.</p>
        </aside>
      </section>
    </div>
  );
}

function Stat({ label, value, prime = false }: { label: string; value: number; prime?: boolean }) {
  return (
    <div className={prime ? "rounded-2xl border border-laiton-border bg-laiton-soft/40 p-4" : "rounded-2xl border bg-card p-4"}>
      <p className="text-[12px] text-muted-foreground">{label}</p>
      <p className={prime ? "mt-1 text-[24px] font-semibold tabular-nums text-laiton" : "mt-1 text-[24px] font-semibold tabular-nums"}>{formatNumber(value)} CHF</p>
    </div>
  );
}
