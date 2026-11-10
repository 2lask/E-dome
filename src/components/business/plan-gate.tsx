"use client";

import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import { lowestPlanWith, planIncludes } from "@/lib/pricing/catalog";
import { formatMoney } from "@/lib/model/billing";
import { PLAN_META, FEATURE_LABEL, tarifsPage } from "@/content/tarifs";
import { useAgencyPlan } from "@/lib/use-business";

/* ── L'appel à monter de formule ─────────────────────────────────────────────

   Une fonction « de réussite » (équipe à 2+, mandats, statistiques complètes)
   que la formule active ne couvre pas : on l'explique et on propose la formule
   la moins chère qui l'inclut. Décidé par `includes` (catalogue), jamais par
   le nom de la formule. Rien ne s'affiche si la formule couvre la fonction. */

export function usePlanCovers(feature: string): boolean {
  return planIncludes(useAgencyPlan(), feature);
}

export function PlanGate({ feature, why }: { feature: string; why: string }) {
  const planId = useAgencyPlan();
  if (planIncludes(planId, feature)) return null;
  const target = lowestPlanWith(feature);
  const label = FEATURE_LABEL[feature] ?? feature;
  return (
    <div className="mb-4 flex flex-col gap-3 rounded-xl border border-amber-500/30 bg-amber-500/[0.07] px-4 py-3 sm:flex-row sm:items-center">
      <Lock size={16} className="shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
      <div className="min-w-0 flex-1 text-[12.5px] leading-snug text-[var(--foreground)]">
        <p className="font-semibold">
          {label} : non inclus dans votre formule {PLAN_META[planId]?.name ?? planId}.
        </p>
        <p className="mt-0.5 text-[var(--text-muted)]">{why}</p>
      </div>
      {target && (
        <Link
          href="/agence/abonnement"
          className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[var(--foreground)] px-3 py-2 text-[12.5px] font-medium text-[var(--background)] hover:opacity-90"
        >
          Passer à {PLAN_META[target.id]?.name ?? target.id} · {formatMoney(target.price.month)} {tarifsPage.billingMonthly}
          <ArrowUpRight size={13} aria-hidden />
        </Link>
      )}
    </div>
  );
}
