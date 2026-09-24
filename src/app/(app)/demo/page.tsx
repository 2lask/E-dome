"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home, Wrench, Handshake, GraduationCap, CalendarDays, Radio, ShoppingBag,
  Building2, Rss, LayoutDashboard, ArrowRight, HelpCircle, X, type LucideIcon,
} from "lucide-react";
import { STAGE_DOT, STAGE_TEXT, STAGE_LABEL } from "@/lib/model/stage-ui";
import { useApp } from "@/lib/context";
import { demoScreen } from "@/content/demo";
import { POLE_EXPLAIN, explainMode as explainCopy } from "@/content/explain";

/* ── `/demo` — la porte d'entrée ────────────────────────────────────────────

   Premier écran neuf de la reprise. Tout son texte vient de
   `src/content/demo.ts` ; ce fichier ne fait que le disposer. Voir l'en-tête
   du contenu pour le pourquoi de l'ordre des blocs.

   Objectif de mise en page : trois blocs dans une hauteur d'écran, sans
   défilement sur un téléphone. D'où la densité — icônes petites, interlignes
   serrés — et un seul point d'accent, le « 0 CHF à E-Dome ». */

const ICONS: Record<string, LucideIcon> = {
  Home, Wrench, Handshake, GraduationCap, CalendarDays, Radio, ShoppingBag,
  Building2, Rss, LayoutDashboard,
};

/* Les couleurs de statut viennent de `@/lib/model/stage-ui` : un seul endroit
   les décide, partagé avec le bandeau-légende global. */

export default function DemoPage() {
  const d = demoScreen;
  const { explainMode } = useApp();
  /* Un seul pôle expliqué à la fois — la contrainte « une seule bulle
     ouverte » du mode explicatif. */
  const [openPole, setOpenPole] = useState<string | null>(null);
  const explained = openPole ? POLE_EXPLAIN[openPole] : undefined;
  const openStage = openPole ? d.poles.find((p) => p.id === openPole)?.stage : undefined;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4 sm:py-8">
      {/* En-tête : ce qu'est E-Dome, en une phrase. */}
      <header className="mb-3 sm:mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
          {d.eyebrow}
        </p>
        <h1 className="mt-1 text-lg font-bold leading-tight text-[var(--foreground)] sm:text-2xl">
          {d.title}
        </h1>
        {/* Sous-titre borné à deux lignes sur téléphone pour préserver la
            hauteur : les trois blocs doivent tenir sans défiler. */}
        <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-[var(--text-muted)] sm:line-clamp-none sm:text-sm">
          {d.subtitle}
        </p>
      </header>

      {/* ── Bloc 1 : les sept pôles avec leur statut ──────────────────────── */}
      <section className="mb-3 sm:mb-4">
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">{d.polesTitle}</h2>
          {/* Légende des statuts, compacte, en ligne avec le titre. */}
          <ul className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {d.stages.map((s) => (
              <li key={s.stage} className="flex items-center gap-1" title={s.hint}>
                <span className={`h-2 w-2 rounded-full ${STAGE_DOT[s.stage]}`} aria-hidden />
                <span className="text-[11px] text-[var(--text-muted)]">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {d.poles.map((p) => {
            const Icon = ICONS[p.icon] ?? Home;
            const canExplain = explainMode && !!POLE_EXPLAIN[p.id];
            const isOpen = openPole === p.id;
            /* En mode explicatif, un pôle est un bouton qui ouvre son panneau ;
               sinon c'est une carte inerte. On ne rend pas un bouton quand il
               n'y a rien à ouvrir — un affordance qui ne fait rien ment. */
            const Tag = canExplain ? "button" : "li";
            return (
              <Tag
                key={p.id}
                {...(canExplain
                  ? {
                      type: "button" as const,
                      onClick: () => setOpenPole(isOpen ? null : p.id),
                      "aria-expanded": isOpen,
                    }
                  : {})}
                className={
                  "rounded-xl border bg-[var(--card)] p-2.5 text-left transition-colors sm:p-3 " +
                  (isOpen
                    ? "border-[var(--primary)]/50"
                    : "border-[var(--card-border)]") +
                  (canExplain ? " hover:border-[var(--primary)]/40" : "")
                }
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                    <Icon size={15} />
                  </span>
                  <span className={`text-[13px] font-medium sm:text-sm ${STAGE_TEXT[p.stage]}`}>{p.label}</span>
                  {canExplain ? (
                    <HelpCircle
                      size={13}
                      className="ml-auto shrink-0 text-[var(--text-muted)]"
                      aria-hidden
                    />
                  ) : (
                    <span
                      className={`ml-auto h-2 w-2 shrink-0 rounded-full ${STAGE_DOT[p.stage]}`}
                      aria-hidden
                    />
                  )}
                </div>
                {/* La ligne d'explication coûte quatre rangées de haut sur
                    téléphone : masquée sous `sm`, où l'icône et le libellé
                    suffisent à situer le pôle. */}
                <p className="mt-1.5 hidden text-[11.5px] leading-snug text-[var(--text-muted)] sm:block">
                  {p.line}
                </p>
              </Tag>
            );
          })}
        </ul>

        {/* Panneau d'explication au clic. Les quatre questions de la Partie C,
            dans l'ordre ; la dernière — le revenu — est celle qui intéresse un
            investisseur. Ferme sur clic du bouton ou d'un autre pôle. */}
        {explained && openStage && (
          <div className="mt-2 rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/[0.04] p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${STAGE_DOT[openStage]}`} aria-hidden />
              <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                {STAGE_LABEL[openStage]}
              </span>
              <button
                type="button"
                onClick={() => setOpenPole(null)}
                aria-label="Fermer l'explication"
                className="ml-auto rounded-md p-0.5 text-[var(--text-muted)] hover:text-[var(--foreground)]"
              >
                <X size={15} />
              </button>
            </div>
            <dl className="grid gap-2 sm:grid-cols-2">
              {(["what", "who", "revenue", "when"] as const).map((k) => (
                <div key={k}>
                  <dt className="text-[11px] font-semibold text-[var(--foreground)]">
                    {explainCopy.fields[k]}
                  </dt>
                  <dd className="text-[12px] leading-snug text-[var(--text-muted)]">{explained[k]}</dd>
                </div>
              ))}
            </dl>
            {explained.insteadHref && explained.insteadLabel && (
              <Link
                href={explained.insteadHref}
                className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-[var(--primary)] hover:underline"
              >
                {explained.insteadLabel}
                <ArrowRight size={13} aria-hidden />
              </Link>
            )}
          </div>
        )}
      </section>

      {/* ── Bloc 2 : qui paie quoi, AVANT les portes ──────────────────────── */}
      <section className="mb-3 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-3.5 sm:mb-4 sm:p-4">
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-0.5">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">{d.moneyTitle}</h2>
          <p className="leading-none">
            <span className="text-2xl font-extrabold tracking-tight text-[var(--primary)] sm:text-3xl">
              {d.moneyHeadline}
            </span>{" "}
            <span className="text-[11px] text-[var(--text-muted)]">{d.moneyHeadlineHint}</span>
          </p>
        </div>

        <ul className="mt-2.5 divide-y divide-[var(--card-border)]">
          {d.money.map((m) => (
            <li key={m.who} className="flex flex-col gap-0.5 py-1.5 sm:flex-row sm:items-baseline sm:gap-3 sm:py-2">
              <span className="shrink-0 text-[13px] font-medium text-[var(--foreground)] sm:w-64">
                {m.who}
              </span>
              <span className="text-[12px] leading-snug text-[var(--text-muted)] sm:text-[12.5px]">{m.pays}</span>
            </li>
          ))}
        </ul>

        <p className="mt-2 text-[11px] italic text-[var(--text-muted)]">{d.moneyFootnote}</p>
      </section>

      {/* ── Bloc 3 : trois portes ──────────────────────────────────────────── */}
      <section>
        <h2 className="mb-2 text-sm font-semibold text-[var(--foreground)]">{d.doorsTitle}</h2>
        <div className="grid gap-2 sm:grid-cols-3">
          {d.doors.map((door) => {
            const Icon = ICONS[door.icon] ?? ArrowRight;
            return (
              <Link
                key={door.href}
                href={door.href}
                className="group flex items-center gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-3 transition-colors hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                  <Icon size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-[var(--foreground)]">
                    {door.label}
                  </span>
                  <span className="block text-[11px] leading-snug text-[var(--text-muted)]">
                    {door.hint}
                  </span>
                </span>
                <ArrowRight
                  size={16}
                  className="shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--primary)]"
                  aria-hidden
                />
              </Link>
            );
          })}
        </div>
      </section>

      <p className="mt-4 text-center text-[11px] text-[var(--text-muted)]">{d.disclaimer}</p>
    </div>
  );
}
