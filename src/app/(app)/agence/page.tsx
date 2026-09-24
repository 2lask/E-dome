"use client";

import Link from "next/link";
import {
  ShieldCheck, Inbox, FileSignature, Users, BarChart3, CreditCard, Globe,
  ArrowRight, type LucideIcon,
} from "lucide-react";
import { agencePage, demoAgency } from "@/content/agence";
import { PLAN_META } from "@/content/tarifs";

/* ── `/agence` — le hub de l'Espace agence ──────────────────────────────────

   L'atterrissage du rôle « Agence ». Il présente l'agence de démonstration et
   ouvre sur ses fonctions. La principale source de revenu d'E-Dome se construit
   pour de vrai : ces cartes mènent à des écrans réels, pas à du gris. */

const ICONS: Record<string, LucideIcon> = {
  demandes: Inbox,
  mandats: FileSignature,
  equipe: Users,
  statistiques: BarChart3,
  abonnement: CreditCard,
  publique: Globe,
};

export default function AgenceHubPage() {
  const a = agencePage;
  const planName = PLAN_META[demoAgency.plan]?.name ?? demoAgency.plan;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:py-8">
      <header className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">{a.eyebrow}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-bold text-[var(--foreground)] sm:text-2xl">{demoAgency.name}</h1>
          {demoAgency.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={12} /> Vérifiée
            </span>
          )}
          <span className="text-[12px] text-[var(--text-muted)]">
            {demoAgency.city} · {demoAgency.members} agents · {demoAgency.activeMandates} mandats actifs
          </span>
        </div>
        <p className="mt-1.5 text-sm leading-snug text-[var(--text-muted)]">{a.hubSubtitle}</p>
      </header>

      {/* Formule active */}
      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-3">
        <span className="text-[12px] text-[var(--text-muted)]">{a.currentPlanLabel}</span>
        <span className="text-[15px] font-bold text-[var(--foreground)]">{planName}</span>
        <Link
          href="/agence/abonnement"
          className="ml-auto inline-flex items-center gap-1 text-[12.5px] font-medium text-[var(--primary)] hover:underline"
        >
          {a.changePlan}
          <ArrowRight size={13} aria-hidden />
        </Link>
      </div>

      {/* Les fonctions */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {a.sections.map((s) => {
          const Icon = ICONS[s.key] ?? Inbox;
          return (
            <Link
              key={s.key}
              href={s.href}
              className="group flex flex-col rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 transition-colors hover:border-[var(--primary)]/40"
            >
              <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                <Icon size={16} />
              </span>
              <span className="text-[13.5px] font-semibold text-[var(--foreground)]">{s.label}</span>
              <span className="mt-0.5 text-[11.5px] leading-snug text-[var(--text-muted)]">{s.hint}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
