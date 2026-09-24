"use client";

import { useState } from "react";
import { Lock, Home, MapPin, Wallet, Clock, Users } from "lucide-react";
import { agencePage } from "@/content/agence";
import { PlatformRules } from "@/components/legal/platform-rules";
import { useToast } from "@/components/ui/toast";

/* ── `/agence/demandes` — la distribution, vue côté agence ───────────────────

   Le pendant de `/vendre/accompagnement`. L'agence voit des fiches ANONYMES,
   dans l'ordre chronologique — aucun classement payant — et postule. Elle ne
   reçoit jamais un contact : c'est le particulier qui l'ouvre s'il la choisit.
   C'est l'inversion du sens de circulation d'un marché de leads (DECISIONS
   §2.3), et une condition de validité juridique, pas un positionnement. */

export default function AgenceDemandesPage() {
  const d = agencePage.demandes;
  const { addToast } = useToast();
  const [applied, setApplied] = useState<Set<string>>(new Set());

  const apply = (id: string) => {
    setApplied((prev) => new Set(prev).add(id));
    addToast("Candidature envoyée. Le particulier la verra dans sa comparaison.", "success");
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-8">
      <header className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">{agencePage.eyebrow}</p>
        <h1 className="mt-1 text-xl font-bold text-[var(--foreground)] sm:text-2xl">{d.title}</h1>
        <p className="mt-1.5 text-sm leading-snug text-[var(--text-muted)]">{d.subtitle}</p>
      </header>

      <p className="mb-4 flex items-start gap-2 rounded-xl border border-[var(--primary)]/25 bg-[var(--primary)]/[0.05] px-3.5 py-2.5 text-[12px] leading-snug text-[var(--foreground)]">
        <Lock size={15} className="mt-0.5 shrink-0 text-[var(--primary)]" aria-hidden />
        <span>{d.applyNote}</span>
      </p>

      <ul className="space-y-2.5">
        {d.items.map((item) => {
          const isApplied = applied.has(item.id);
          return (
            <li
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 sm:flex-row sm:items-center"
            >
              <div className="flex-1 space-y-1.5">
                <p className="flex items-center gap-1.5 text-[14px] font-semibold text-[var(--foreground)]">
                  <Home size={14} className="text-[var(--primary)]" aria-hidden />
                  {item.type}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[var(--text-muted)]">
                  <span className="flex items-center gap-1"><MapPin size={12} aria-hidden />{item.sector}</span>
                  <span className="flex items-center gap-1"><Wallet size={12} aria-hidden />{item.budget}</span>
                  <span className="flex items-center gap-1"><Clock size={12} aria-hidden />{item.posted}</span>
                  <span className="flex items-center gap-1"><Users size={12} aria-hidden />{item.applicants} agence{item.applicants > 1 ? "s ont" : item.applicants === 1 ? " a" : "s ont"} postulé</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => apply(item.id)}
                disabled={isApplied}
                className="shrink-0 rounded-lg bg-[var(--foreground)] px-4 py-2 text-[13px] font-medium text-[var(--background)] transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isApplied ? d.appliedLabel : d.applyCta}
              </button>
            </li>
          );
        })}
      </ul>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-[var(--foreground)]">Ce qu'E-Dome ne fait pas ici</h2>
        <PlatformRules variant="compact" />
      </section>
    </div>
  );
}
