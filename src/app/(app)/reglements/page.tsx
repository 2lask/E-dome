import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Wallet, ShieldCheck, ArrowDownLeft, ArrowUpRight, Coins } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { getMyPayout, listMySettlements } from "@/lib/supabase/settlement-actions";
import { SettlementCard } from "@/components/reglements/settlement-card";
import { PayoutForm } from "@/components/reglements/payout-form";
import { MemberHero } from "@/components/demandes/member-hero";
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
      <MemberHero
        eyebrow="Argent"
        icon={Coins}
        title="Règlements"
        description={
          <>
            Chaque prime ou récompense acceptée devient un règlement. Le payeur verse le montant net directement à
            l&apos;apporteur (TWINT ou virement), puis chacun confirme. E-Dome ne détient jamais votre argent.
          </>
        }
        stats={[
          { label: "À payer", value: `${formatNumber(dueOut)} CHF` },
          { label: "À recevoir", value: `${formatNumber(pendingIn)} CHF`, prime: true },
          { label: "Déjà reçu", value: `${formatNumber(received)} CHF` },
        ]}
      />

      {!ready && <p role="status" className="mt-6 rounded-xl border bg-warning-soft px-4 py-3 text-[13px]">Les règlements arrivent bientôt (base à mettre à jour, migration 008).</p>}

      {!payout && toReceive.length > 0 && (
        <p className="mt-5 flex items-start gap-3 rounded-2xl border border-laiton-border bg-gradient-to-r from-laiton-soft to-laiton-soft/30 px-4 py-3.5 text-[13.5px]">
          <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-laiton" aria-hidden />
          <span><strong>Indiquez où vous payer</strong> (TWINT ou IBAN) : sans cela, on ne peut pas vous verser vos gains.</span>
        </p>
      )}

      {toPay.length > 0 && (
        <section className="mt-8">
          <SectionTitle icon={ArrowUpRight} title="À payer" count={toPay.length} />
          <ul className="mt-3 space-y-3">{toPay.map((s) => <SettlementCard key={s.id} s={s} />)}</ul>
        </section>
      )}

      <section className="mt-8">
        <SectionTitle icon={ArrowDownLeft} title="À recevoir" count={toReceive.length} />
        {toReceive.length === 0 ? (
          <div className="mt-3 flex items-start gap-4 rounded-3xl border border-dashed bg-card px-5 py-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border bg-subtle">
              <ArrowDownLeft className="h-5 w-5 text-muted-foreground" aria-hidden />
            </span>
            <p className="pt-0.5 text-[13.5px] leading-relaxed text-muted-foreground">
              <span className="block text-[14.5px] font-semibold text-foreground">Rien pour l&apos;instant</span>
              Présentez un contact sur un bien à prime ou répondez à une recherche : chaque acceptation apparaît ici.
            </p>
          </div>
        ) : (
          <ul className="mt-3 space-y-3">{toReceive.map((s) => <SettlementCard key={s.id} s={s} />)}</ul>
        )}
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="relative overflow-hidden rounded-3xl border bg-card p-5 sm:p-6">
          <div aria-hidden className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-leman/50 to-transparent" />
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-leman/25 bg-leman-soft">
              <Wallet className="h-[18px] w-[18px] text-leman" aria-hidden />
            </span>
            <div>
              <p className="text-[16px] font-semibold tracking-[-0.01em]">Où vous payer</p>
              <p className="text-[12.5px] text-muted-foreground">TWINT ou IBAN, au choix.</p>
            </div>
          </div>
          <div className="mt-5"><PayoutForm initial={payout} /></div>
        </div>
        <aside className="rounded-3xl border bg-card p-5 text-[13px] leading-relaxed text-muted-foreground sm:p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border bg-subtle">
            <ShieldCheck className="h-[18px] w-[18px] text-leman" aria-hidden />
          </span>
          <p className="mt-3 text-[15px] font-semibold text-foreground">Comment c&apos;est calculé</p>
          {/* La répartition réelle de chaque commission : 88 % / 12 %. */}
          <div className="mt-3" aria-hidden>
            <div className="flex h-2 overflow-hidden rounded-full bg-subtle">
              <span className="h-full w-[88%] bg-gradient-to-r from-laiton/70 to-laiton" />
              <span className="h-full w-[12%] bg-muted-foreground/40" />
            </div>
            <div className="mt-1.5 flex justify-between text-[11.5px]">
              <span><strong className="font-semibold text-laiton">88 %</strong> apporteur</span>
              <span><strong className="font-semibold text-foreground">12 %</strong> E-Dome</span>
            </div>
          </div>
          <p className="mt-3">Montant fixe annoncé, dû à l&apos;acceptation. La part E-Dome (12 %, 3 CHF minimum) est comprise dans ce montant : l&apos;apporteur reçoit le net, le payeur ne paie jamais plus que l&apos;annonce.</p>
          <p className="mt-2">Phase pilote : la part E-Dome est enregistrée mais pas encore encaissée ; elle le sera avec le paiement intégré.</p>
        </aside>
      </section>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, count }: { icon: typeof Wallet; title: string; count: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg border bg-subtle">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
      </span>
      <h2 className="text-[17px] font-semibold tracking-[-0.01em]">{title}</h2>
      {count > 0 && <span className="rounded-full bg-subtle px-2 py-0.5 text-[11.5px] font-medium tabular-nums text-muted-foreground">{count}</span>}
    </div>
  );
}
