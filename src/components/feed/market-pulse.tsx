"use client";

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import {
  Coins, TrendingUp, Home, GraduationCap, KeyRound, Handshake,
  Scale, Percent, Building2, Globe, ArrowUpRight, Megaphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Colonne droite du feed — sous les suggestions de comptes.
   Trois blocs pour donner vie à la plateforme (façon Whop / X) :
   1. « En direct » : fil d'activité qui défile en boucle (commissions
      gagnées, deals conclus, nouveaux biens, inscriptions…).
   2. « Actualités & règles » : veille immobilière (taux, Lex Koller,
      marché, fiscalité).
   3. Une carte sponsorisée (pub) vers le réseau d'apporteurs.
   Tout est mock/démo — aucune donnée réelle. */

// Teintes sémantiques réutilisées (chips + pastilles d'icône).
const TINT: Record<string, string> = {
  emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  blue: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  purple: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  primary: "bg-[var(--primary)]/12 text-[var(--primary)]",
};

// ─── Fil « En direct » ──────────────────────────────────────────────────────

type LiveItem = { icon: LucideIcon; tint: keyof typeof TINT; text: ReactNode; meta: string };

const LIVE: LiveItem[] = [
  { icon: Coins, tint: "emerald", text: <>Yasmin a touché <b>62 332 CHF</b> de commission</>, meta: "Dubaï · à l'instant" },
  { icon: Handshake, tint: "primary", text: <>Deal conclu · Penthouse Genève <b>4,8 M CHF</b></>, meta: "il y a 3 min" },
  { icon: Home, tint: "blue", text: <>Nouveau bien · Riad Marrakech <b>340 000 €</b></>, meta: "il y a 6 min" },
  { icon: GraduationCap, tint: "purple", text: <><b>23</b> inscriptions aujourd'hui · Formation Amina</>, meta: "il y a 12 min" },
  { icon: TrendingUp, tint: "emerald", text: <>Premium romand · <b>+37 %</b> sur 5 ans</>, meta: "Indice E-Dome" },
  { icon: Coins, tint: "emerald", text: <>Marc a recommandé un bien · <b>+2 400 CHF</b></>, meta: "il y a 18 min" },
  { icon: KeyRound, tint: "amber", text: <>Studio Genève loué en <b>48 h</b></>, meta: "il y a 24 min" },
  { icon: Coins, tint: "emerald", text: <>Sophie a gagné <b>1 180 CHF</b> cette semaine</>, meta: "il y a 31 min" },
  { icon: Building2, tint: "blue", text: <>Programme Minergie-P Zurich · <b>28</b> lots réservés</>, meta: "il y a 40 min" },
];

function LiveRow({ item }: { item: LiveItem }) {
  const Icon = item.icon;
  return (
    <li className="flex items-start gap-2.5 px-2 py-2">
      <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${TINT[item.tint]}`}>
        <Icon size={14} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[12.5px] leading-snug text-[var(--foreground)]">{item.text}</p>
        <p className="text-[10.5px] text-[var(--text-muted)] mt-0.5">{item.meta}</p>
      </div>
    </li>
  );
}

function LiveTicker() {
  // Duree proportionnelle au nombre d'items pour une vitesse constante.
  const duration = `${LIVE.length * 3.6}s`;
  return (
    <div>
      <h3 className="px-1 pb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-70 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        En direct
      </h3>
      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] overflow-hidden">
        <div
          className="marquee-y-mask relative h-[230px] overflow-hidden"
          style={{
            maskImage: "linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)",
          }}
        >
          {/* Piste : la liste est dupliquee pour une boucle sans couture. */}
          <ul
            className="animate-marquee-y divide-y divide-[var(--card-border)]/60"
            style={{ "--marquee-duration": duration } as CSSProperties}
          >
            {[...LIVE, ...LIVE].map((item, i) => (
              <LiveRow key={i} item={item} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Actualités & règles ────────────────────────────────────────────────────

type NewsItem = { cat: string; tint: keyof typeof TINT; icon: LucideIcon; title: string; meta: string };

const NEWS: NewsItem[] = [
  { cat: "Règle", tint: "amber", icon: Scale, title: "Lex Koller : nouvelles conditions pour les non-résidents dès 2026", meta: "Confédération · 2 h" },
  { cat: "Taux", tint: "blue", icon: Percent, title: "La BNS maintient son taux directeur à 1,5 %", meta: "Marché · 5 h" },
  { cat: "Marché", tint: "emerald", icon: TrendingUp, title: "Genève : le prix au m² dépasse 14 500 CHF au centre", meta: "Immobilier · 1 j" },
  { cat: "Fiscalité", tint: "purple", icon: Building2, title: "Valeur locative : la réforme entre en vigueur", meta: "Fiscalité · 2 j" },
  { cat: "International", tint: "primary", icon: Globe, title: "Dubaï lance un visa investisseur immobilier de 10 ans", meta: "Émirats · 3 j" },
];

function NewsList() {
  return (
    <div className="mt-6">
      <h3 className="px-1 pb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        Actualités &amp; règles
      </h3>
      <ul className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] divide-y divide-[var(--card-border)]/60 overflow-hidden">
        {NEWS.map((n) => {
          const Icon = n.icon;
          return (
            <li key={n.title} className="flex items-start gap-2.5 px-3 py-2.5 hover:bg-[var(--hover-bg)] transition-colors">
              <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5 ${TINT[n.tint]}`}>
                <Icon size={14} />
              </span>
              <div className="min-w-0 flex-1">
                <span className={`inline-block text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${TINT[n.tint]}`}>
                  {n.cat}
                </span>
                <p className="text-[13px] leading-snug text-[var(--foreground)] mt-1 line-clamp-2">{n.title}</p>
                <p className="text-[10.5px] text-[var(--text-muted)] mt-0.5">{n.meta}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Pub sponsorisée ────────────────────────────────────────────────────────

function SponsoredCard() {
  return (
    <div className="mt-6">
      <p className="px-1 pb-2 text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)] inline-flex items-center gap-1">
        <Megaphone size={11} /> Sponsorisé
      </p>
      <Link
        href="/apporteurs"
        className="group block rounded-2xl border border-[var(--primary)]/25 bg-gradient-to-br from-[var(--primary)]/[0.10] to-transparent p-4 hover:border-[var(--primary)]/45 transition-colors"
      >
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]">
          <Coins size={17} />
        </span>
        <p className="text-sm font-bold text-[var(--foreground)] mt-2.5">Gagnez des commissions</p>
        <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
          Rejoignez le réseau d'apporteurs E-Dome et touchez jusqu'à <b className="text-[var(--primary)]">0,5 %</b> sur chaque vente recommandée.
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)]">
          Devenir apporteur
          <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </Link>
    </div>
  );
}

// ─── Bloc complet ───────────────────────────────────────────────────────────

export function MarketPulse() {
  return (
    <div className="mt-6 pt-5 border-t border-[var(--card-border)]">
      <LiveTicker />
      <NewsList />
      <SponsoredCard />
    </div>
  );
}
