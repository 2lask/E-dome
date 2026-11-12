"use client";

import Link from "next/link";
import { Check, Lock } from "lucide-react";
import { PLANS, planIncludes, lowestPlanWith, FREE_LIMITS } from "@/lib/pricing/catalog";
import { formatMoney, isZero } from "@/lib/model/billing";
import { agencePage } from "@/content/agence";
import { tarifsPage, PLAN_META, FEATURE_LABEL } from "@/content/tarifs";
import { recordSessionEvent } from "@/lib/use-session";
import { useAgencyPlan, AGENCY_HOLDER_ID } from "@/lib/use-business";
import { useToast } from "@/components/ui/toast";
import { STAGE_LABEL } from "@/lib/model/stage-ui";

/* ── `/agence/abonnement` — la formule active, et en changer POUR DE VRAI ─────

   Changer de formule écrit `plan.changed` au journal de session : la formule
   se relit partout (`useAgencyPlan`) — le hub, le quota de candidatures, les
   appels à monter de formule sur l'équipe, les mandats, les statistiques.
   Mêmes prix et mêmes inclus que `/tarifs`, parce que c'est la même source
   (`PLANS`). Aucun composant ne branche sur un nom de formule : les fonctions
   réservées se lisent dans `includes`. */

/* Les fonctions « de réussite » montrées avec leur verrou (D15). */
const RESERVED: { feature: string; why: string }[] = [
  { feature: "equipe-droits", why: `Au-delà de ${FREE_LIMITS.agence.seats} utilisateur : une équipe, des droits par membre.` },
  { feature: "mandats", why: "Mandats formels, agenda des visites, suivi des commissions de l'agence." },
  { feature: "statistiques-completes", why: "Sources d'audience, délais de vente, conversions par agent." },
  { feature: "demandes-accompagnement", why: `Candidater sans limite (gratuit : ${FREE_LIMITS.agence.activeApplications} candidatures actives à la fois).` },
  { feature: "biens-illimites", why: `Au-delà de ${FREE_LIMITS.agence.activeListings} biens actifs.` },
];

export default function AgenceAbonnementPage() {
  const a = agencePage.abonnement;
  const { addToast } = useToast();
  const planId = useAgencyPlan();
  const current = PLANS.find((p) => p.id === planId);
  const agencyPlans = PLANS.filter((p) => p.holder === "agency").slice().sort((x, y) => x.tier - y.tier);

  if (!current) return null;
  const currentMeta = PLAN_META[current.id];

  const choose = (id: string) => {
    if (id === planId) return;
    recordSessionEvent({ kind: "plan.changed", data: { holderId: AGENCY_HOLDER_ID, planId: id } });
    addToast(`Formule ${PLAN_META[id]?.name ?? id} active. Sans engagement, résiliable au mois.`, "success");
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:py-8">
      <header className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">{agencePage.eyebrow}</p>
        <h1 className="mt-1 text-xl font-bold text-[var(--foreground)] sm:text-2xl">{a.title}</h1>
        <p className="mt-1.5 text-sm leading-snug text-[var(--text-muted)]">{a.subtitle}</p>
      </header>

      {/* Formule active */}
      <section className="mb-4 rounded-2xl border border-[var(--primary)]/30 bg-[var(--primary)]/[0.04] p-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">{a.currentTitle}</p>
        <div className="mt-0.5 flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-bold text-[var(--foreground)]">{currentMeta?.name}</span>
          <span className="text-[13px] text-[var(--text-muted)]">
            {isZero(current.price.month) ? tarifsPage.free : `${formatMoney(current.price.month)} ${tarifsPage.billingMonthly}`}
          </span>
        </div>
        <p className="mt-0.5 text-[12.5px] text-[var(--text-muted)]">{currentMeta?.tagline}</p>

        <p className="mt-3 mb-1.5 text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">{a.includedTitle}</p>
        <ul className="grid gap-1.5 sm:grid-cols-2">
          {current.includes.map((key) => (
            <li key={key} className="flex items-start gap-1.5 text-[12.5px] leading-snug text-[var(--foreground)]">
              <Check size={14} className="mt-0.5 shrink-0 text-[var(--primary)]" aria-hidden />
              {FEATURE_LABEL[key] ?? key}
            </li>
          ))}
        </ul>
      </section>

      {/* Fonctions réservées : ce que la formule ne couvre pas, et laquelle les couvre */}
      <section data-tour="abonnement-gated" className="mb-5 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4">
        <h2 className="mb-2 text-sm font-semibold text-[var(--foreground)]">Les fonctions de réussite</h2>
        <ul className="space-y-2">
          {RESERVED.map((r) => {
            const covered = planIncludes(planId, r.feature);
            const target = lowestPlanWith(r.feature);
            return (
              <li key={r.feature} className="flex flex-wrap items-center gap-2 text-[12.5px]">
                {covered ? (
                  <Check size={14} className="shrink-0 text-emerald-500" aria-hidden />
                ) : (
                  <Lock size={14} className="shrink-0 text-amber-500" aria-hidden />
                )}
                <span className="font-medium text-[var(--foreground)]">{FEATURE_LABEL[r.feature] ?? r.feature}</span>
                <span className="text-[var(--text-muted)]">— {r.why}</span>
                {!covered && target && (
                  <button
                    type="button"
                    onClick={() => choose(target.id)}
                    className="ml-auto rounded-md border border-[var(--card-border)] px-2.5 py-1 text-[12px] font-medium text-[var(--primary)] hover:bg-[var(--hover-bg)]"
                  >
                    Passer à {PLAN_META[target.id]?.name ?? target.id}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Changer de formule */}
      <h2 className="mb-2 text-sm font-semibold text-[var(--foreground)]">Changer de formule</h2>
      <div data-tour="abonnement-plans" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {agencyPlans.map((p) => {
          const meta = PLAN_META[p.id];
          const active = p.id === planId;
          const later = p.stage !== "launch";
          return (
            <section
              key={p.id}
              className={`flex flex-col rounded-xl border p-3.5 ${active ? "border-[var(--primary)] bg-[var(--primary)]/[0.05]" : "border-[var(--card-border)] bg-[var(--card)]"}`}
            >
              <p className="text-[14px] font-bold text-[var(--foreground)]">{meta?.name ?? p.id}</p>
              <p className="mt-0.5 text-[12.5px] text-[var(--text-muted)]">
                {isZero(p.price.month) ? tarifsPage.free : `${formatMoney(p.price.month)} ${tarifsPage.billingMonthly}`}
              </p>
              <p className="mt-1 flex-1 text-[11.5px] leading-snug text-[var(--text-muted)]">{meta?.tagline}</p>
              <button
                type="button"
                disabled={active || later}
                onClick={() => choose(p.id)}
                className={`mt-3 rounded-lg px-3 py-2 text-[12.5px] font-medium ${
                  active
                    ? "border border-[var(--primary)]/40 text-[var(--primary)]"
                    : later
                      ? "border border-[var(--card-border)] text-[var(--text-muted)]"
                      : "bg-[var(--foreground)] text-[var(--background)] hover:opacity-90"
                }`}
              >
                {active ? "Formule active" : later ? STAGE_LABEL[p.stage] : "Choisir"}
              </button>
            </section>
          );
        })}
      </div>
      <p className="mt-3 text-[11.5px] text-[var(--text-muted)]">
        Démonstration : aucun paiement n&apos;est débité. <Link href="/tarifs" className="text-[var(--primary)] hover:underline">Comparer le détail des formules</Link>
      </p>
    </div>
  );
}
