"use client";

import Link from "next/link";
import {
  Home, Wrench, Handshake, GraduationCap, CalendarDays, Radio, ShoppingBag,
  Building2, Rss, LayoutDashboard, ArrowRight, type LucideIcon,
} from "lucide-react";
import { STAGE_DOT, STAGE_TEXT } from "@/lib/model/stage-ui";
import { demoScreen } from "@/content/demo";

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
            return (
              <li
                key={p.id}
                className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-2.5 sm:p-3"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                    <Icon size={15} />
                  </span>
                  <span className={`text-[13px] font-medium sm:text-sm ${STAGE_TEXT[p.stage]}`}>{p.label}</span>
                  <span
                    className={`ml-auto h-2 w-2 shrink-0 rounded-full ${STAGE_DOT[p.stage]}`}
                    aria-hidden
                  />
                </div>
                {/* La ligne d'explication coûte quatre rangées de haut sur
                    téléphone : masquée sous `sm`, où l'icône et le libellé
                    suffisent à situer le pôle. */}
                <p className="mt-1.5 hidden text-[11.5px] leading-snug text-[var(--text-muted)] sm:block">
                  {p.line}
                </p>
              </li>
            );
          })}
        </ul>
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
