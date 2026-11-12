"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { FREEMIUM_ROLES, PLANS, ROLE_PLANS } from "@/lib/pricing/catalog";
import { formatMoney, isZero } from "@/lib/model/billing";
import { STAGE_DOT, STAGE_LABEL } from "@/lib/model/stage-ui";
import { tarifsPage, PLAN_META, FEATURE_LABEL, FREEMIUM_COPY, FREEMIUM_ROLE_LABEL } from "@/content/tarifs";

/* ── `/tarifs` — générée depuis le module ───────────────────────────────────

   Aucun prix, aucun palier, aucun statut n'est écrit ici : tout vient de
   `PLANS` (catalog.ts). Cette page ne peut donc pas mentir — le jour où un
   tarif bouge dans le catalogue, elle bouge avec lui. Ce fichier ne fait que
   disposer ; les mots (noms, phrases, libellés de fonctions) sont dans
   `content/tarifs.ts`. */

type Plan = (typeof PLANS)[number];

function PlanCard({ plan, yearly }: { plan: Plan; yearly: boolean }) {
  const meta = PLAN_META[plan.id] ?? { name: plan.id, tagline: "" };
  const later = plan.stage !== "launch";
  const monthly = plan.price.month;
  const showYear = yearly && plan.price.year;

  return (
    <section
      className={
        "flex flex-col rounded-2xl border bg-[var(--card)] p-4 " +
        (later ? "border-[var(--card-border)] opacity-90" : "border-[var(--card-border)]")
      }
    >
      <div className="mb-1 flex items-center gap-2">
        <h3 className="text-base font-bold text-[var(--foreground)]">{meta.name}</h3>
        {later && (
          <span className="inline-flex items-center gap-1 rounded-full border border-[var(--card-border)] px-2 py-0.5 text-[10.5px] text-[var(--text-muted)]">
            <span className={`h-1.5 w-1.5 rounded-full ${STAGE_DOT[plan.stage]}`} aria-hidden />
            {STAGE_LABEL[plan.stage]}
          </span>
        )}
      </div>
      <p className="mb-3 min-h-[2.5rem] text-[12px] leading-snug text-[var(--text-muted)]">{meta.tagline}</p>

      <p className="mb-3 leading-none">
        {isZero(monthly) ? (
          <span className="text-2xl font-extrabold text-[var(--foreground)]">{tarifsPage.free}</span>
        ) : (
          <>
            <span className="text-2xl font-extrabold text-[var(--foreground)]">
              {formatMoney(showYear ? plan.price.year! : monthly)}
            </span>{" "}
            <span className="text-[11px] text-[var(--text-muted)]">
              {showYear ? tarifsPage.billingYearly : tarifsPage.billingMonthly}
            </span>
          </>
        )}
      </p>

      <ul className="flex-1 space-y-1.5">
        {plan.includes.map((key) => (
          <li key={key} className="flex items-start gap-1.5 text-[12.5px] leading-snug text-[var(--foreground)]">
            <Check size={14} className="mt-0.5 shrink-0 text-[var(--primary)]" aria-hidden />
            {FEATURE_LABEL[key] ?? key}
          </li>
        ))}
      </ul>

      <Link
        href={later ? "#" : "/agence/abonnement"}
        aria-disabled={later}
        tabIndex={later ? -1 : undefined}
        className={
          "mt-3 inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-[13px] font-medium transition-opacity " +
          (later
            ? "pointer-events-none border border-[var(--card-border)] text-[var(--text-muted)]"
            : "bg-[var(--foreground)] text-[var(--background)] hover:opacity-90")
        }
      >
        {later ? tarifsPage.ctaLater : tarifsPage.ctaLaunch}
      </Link>
    </section>
  );
}

/* Pour chaque rôle : gratuit / payant (mots dans le contenu, plafonds lus dans
   `FREE_LIMITS`), et ses formules — lues dans `ROLE_PLANS`. Un rôle sans
   formule chiffrée montre « Pro · Ensuite », sans prix inventé. */
function RoleRow({ role }: { role: (typeof FREEMIUM_ROLES)[number] }) {
  const t = tarifsPage;
  const copy = FREEMIUM_COPY[role];
  const offer = ROLE_PLANS[role];
  return (
    <li className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h3 className="text-[14px] font-bold text-[var(--foreground)]">{FREEMIUM_ROLE_LABEL[role]}</h3>
        {offer.planIds.map((id) => {
          const plan = PLANS.find((p) => p.id === id);
          if (!plan) return null;
          return (
            <span key={id} className="inline-flex items-center gap-1 rounded-full border border-[var(--card-border)] px-2 py-0.5 text-[11px] text-[var(--text-muted)]">
              <span className={`h-1.5 w-1.5 rounded-full ${STAGE_DOT[plan.stage]}`} aria-hidden />
              {PLAN_META[id]?.name ?? id}
              {plan.stage !== "launch" ? ` · ${STAGE_LABEL[plan.stage]}` : isZero(plan.price.month) ? ` · ${t.free}` : ` · ${formatMoney(plan.price.month)}`}
            </span>
          );
        })}
        {offer.proLater && (
          <span className="inline-flex items-center gap-1 rounded-full border border-[var(--card-border)] px-2 py-0.5 text-[11px] text-[var(--text-muted)]">
            <span className={`h-1.5 w-1.5 rounded-full ${STAGE_DOT.later}`} aria-hidden />
            {t.proLaterName} · {STAGE_LABEL.later} · {t.proLaterPrice}
          </span>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">{t.freeLabel}</p>
          <ul className="space-y-1">
            {copy.free.map((line) => (
              <li key={line} className="flex items-start gap-1.5 text-[12.5px] leading-snug text-[var(--foreground)]">
                <Check size={13} className="mt-0.5 shrink-0 text-emerald-500" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">{t.paidLabel}</p>
          <ul className="space-y-1">
            {copy.paid.map((line) => (
              <li key={line} className="text-[12.5px] leading-snug text-[var(--text-secondary)]">{line}</li>
            ))}
          </ul>
          {offer.proLater && <p className="mt-1 text-[11px] italic text-[var(--text-muted)]">{t.proLaterNote}</p>}
        </div>
      </div>
    </li>
  );
}

export default function TarifsPage() {
  const t = tarifsPage;
  const [yearly, setYearly] = useState(false);

  const agencyPlans = PLANS.filter((p) => p.holder === "agency").slice().sort((a, b) => a.tier - b.tier);
  const ownerPlans = PLANS.filter((p) => p.holder === "account");
  const anyYearly = PLANS.some((p) => p.price.year);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-8">
      <header className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">{t.eyebrow}</p>
        <h1 className="mt-1 max-w-3xl text-xl font-bold leading-tight text-[var(--foreground)] sm:text-2xl">
          {t.title}
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm leading-snug text-[var(--text-muted)]">{t.subtitle}</p>
      </header>

      <h2 className="mb-2 text-sm font-semibold text-[var(--foreground)]">{t.rolesTitle}</h2>
      <ul data-tour="tarifs-roles" className="mb-2 space-y-2.5">
        {FREEMIUM_ROLES.map((role) => (
          <RoleRow key={role} role={role} />
        ))}
      </ul>
      <p className="mb-6 text-[11.5px] italic text-[var(--text-muted)]">{t.limitsNote}</p>

      {anyYearly && (
        <div className="mb-4 inline-flex items-center gap-1 rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-1 text-[12.5px]">
          <button
            type="button"
            onClick={() => setYearly(false)}
            className={`rounded-md px-3 py-1 ${!yearly ? "bg-[var(--foreground)] text-[var(--background)]" : "text-[var(--text-muted)]"}`}
          >
            Mensuel
          </button>
          <button
            type="button"
            onClick={() => setYearly(true)}
            className={`rounded-md px-3 py-1 ${yearly ? "bg-[var(--foreground)] text-[var(--background)]" : "text-[var(--text-muted)]"}`}
          >
            Annuel <span className="text-[var(--primary)]">· {t.yearlyHint}</span>
          </button>
        </div>
      )}

      <h2 className="mb-2 text-sm font-semibold text-[var(--foreground)]">{t.agencyTitle}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {agencyPlans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} yearly={yearly} />
        ))}
      </div>

      <h2 className="mb-2 mt-6 text-sm font-semibold text-[var(--foreground)]">{t.ownerTitle}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ownerPlans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} yearly={yearly} />
        ))}
      </div>

      <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-3.5 py-2.5 text-[12.5px] text-[var(--text-secondary)]">
        {t.affiliationLine}
        <Link href="/apporteurs" className="font-medium text-[var(--primary)] hover:underline">
          {t.affiliationCta}
        </Link>
      </p>

      <p className="mt-5 text-[11.5px] italic leading-snug text-[var(--text-muted)]">{t.footnote}</p>
    </div>
  );
}
