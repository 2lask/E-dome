"use client";

import Link from "next/link";
import {
  Search, Plus, Sparkles, Compass, LayoutDashboard, Store, MessageCircle,
  ArrowRight, type LucideIcon,
} from "lucide-react";
import { useActor } from "@/lib/use-actor";
import { RecommendedCarousel } from "@/components/feed/recommended-carousel";

/* ── `/demo` — l'ACCUEIL du produit (chantier D1) ───────────────────────────

   Avant : cette route ouvrait sur un écran EXPLICATIF (les sept pôles, qui paie
   quoi…). Une vraie application ne s'ouvre pas sur une notice. Désormais c'est
   un vrai accueil : on salue la personne, on lui donne la recherche, les actions
   clés, le copilote IA, une sélection de biens, et des accès rapides. On COMPREND
   en utilisant. L'explicatif reste accessible, discrètement, sur `/a-propos`.

   La route garde le nom `/demo` parce que la landing (figée) y renvoie via son
   bouton « Explorer la démo » — on ne touche pas à la landing, on améliore la
   destination. */

interface QuickTile {
  href: string;
  icon: LucideIcon;
  title: string;
  desc: string;
}

const QUICK: QuickTile[] = [
  { href: "/explorer", icon: Compass, title: "Explorer les biens", desc: "Vente, location, analyse" },
  { href: "/dashboard", icon: LayoutDashboard, title: "Mon espace", desc: "Annonces, activité, stats" },
  { href: "/profil", icon: Store, title: "Ma vitrine", desc: "Ma page publique" },
  { href: "/messages", icon: MessageCircle, title: "Messages", desc: "Mes conversations" },
];

export default function HomePage() {
  const actor = useActor();

  const openCopilot = () => {
    try {
      window.dispatchEvent(new CustomEvent("edome:ai-open"));
    } catch {
      /* no-op : le drawer IA est monté globalement, l'événement l'ouvre. */
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl pb-6">
      {/* ── Accueil / hero ────────────────────────────────────────────────── */}
      <section className="mb-7 sm:mb-9">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">E-Dome Pro</p>
        <h1 className="page-heading mt-1 text-3xl leading-tight sm:text-4xl">
          Bonjour {actor.firstName || "👋"}
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-snug text-[var(--text-muted)]">
          Votre espace immobilier : cherchez un bien, publiez le vôtre, suivez votre
          activité — et laissez le copilote IA estimer et rédiger pour vous.
        </p>

        {/* Recherche — formulaire GET natif vers /recherche?q=… (robuste, sans JS). */}
        <form action="/recherche" method="get" className="mt-5 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              aria-hidden
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="search"
              name="q"
              placeholder="Rechercher un bien, une ville…"
              aria-label="Rechercher un bien"
              className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--card)] py-3 pl-11 pr-4 text-[15px] text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[var(--primary)]"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 rounded-xl bg-[var(--primary)] px-6 py-3 text-[15px] font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90 active:scale-[0.98]"
          >
            Rechercher
          </button>
        </form>

        {/* Actions clés */}
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/publier"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5"
          >
            <Plus size={16} className="text-[var(--primary)]" /> Publier un bien
          </Link>
          <button
            type="button"
            onClick={openCopilot}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5"
          >
            <Sparkles size={16} className="text-[var(--primary)]" /> Copilote IA
          </button>
        </div>
      </section>

      {/* ── Sélection de biens (composant premium réutilisé) ──────────────── */}
      <section className="mb-7 sm:mb-9">
        <RecommendedCarousel />
      </section>

      {/* ── Accès rapides ─────────────────────────────────────────────────── */}
      <section className="mb-6">
        <h2 className="mb-2.5 text-sm font-semibold text-[var(--foreground)]">Accès rapide</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {QUICK.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                className="group rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--primary)]/40 hover:shadow-[0_6px_20px_-8px_rgba(0,0,0,0.25)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                  <Icon size={19} />
                </span>
                <p className="mt-3 text-sm font-semibold text-[var(--foreground)]">{t.title}</p>
                <p className="mt-0.5 text-[12px] leading-snug text-[var(--text-muted)]">{t.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Lien discret vers l'explicatif ────────────────────────────────── */}
      <div className="pt-1 text-center">
        <Link
          href="/a-propos"
          className="inline-flex items-center gap-1 text-[13px] text-[var(--text-muted)] underline underline-offset-2 transition-colors hover:text-[var(--foreground)]"
        >
          Nouveau ici ? Comprendre E-Dome en une minute
          <ArrowRight size={13} aria-hidden />
        </Link>
      </div>
    </div>
  );
}
