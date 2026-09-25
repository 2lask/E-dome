"use client";

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import {
  TrendingUp, Home, GraduationCap, CalendarDays, Video, Camera,
  Scale, Percent, Building2, Globe, ArrowUpRight, Megaphone, Handshake,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Colonne droite du feed — sous les suggestions de comptes.
   Trois blocs pour donner du relief au feed :
   1. « Exemple d'activité » : un fil qui défile en boucle.
   2. « Sujets suivis » : les thèmes de veille, sans dépêche inventée.
   3. Une carte sponsorisée vers le réseau d'apporteurs.

   Le fil ne contient aucun montant, aucun gain nominatif, aucun « deal
   conclu » et aucun indice de marché maison. Ce sont des affirmations sur
   E-Dome elle-même : sur une maquette publique, elles se lisent comme une
   traction réelle que la plateforme n'a pas encore. Il ne reste que des
   activités d'exemple non monétaires — publication, événement, formation —
   sous un libellé explicite.

   Les données d'un utilisateur (ses revenus, ses réservations) restent
   fictives ailleurs dans la maquette : c'est le rôle d'une démonstration.
   La distinction porte sur qui est le sujet de l'affirmation. */

// Teintes sémantiques réutilisées (chips + pastilles d'icône).
const TINT: Record<string, string> = {
  emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  blue: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  purple: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  primary: "bg-[var(--primary)]/12 text-[var(--primary)]",
};

// ─── Fil d'activité d'exemple ───────────────────────────────────────────────

type LiveItem = { icon: LucideIcon; tint: keyof typeof TINT; text: ReactNode; meta: string };

/* Pas d'horodatage relatif (« à l'instant », « il y a 3 min ») : il
   affirmerait un flux temps réel, ce que le libellé « Exemple d'activité »
   viendrait contredire. La méta porte le lieu et la nature. */
const LIVE: LiveItem[] = [
  { icon: Home, tint: "blue", text: <>Nouveau bien · <b>Appartement vue lac</b></>, meta: "Lausanne · Vente" },
  { icon: CalendarDays, tint: "amber", text: <>Nouvel événement · <b>Visite de programme neuf</b></>, meta: "Genève · Sur inscription" },
  { icon: GraduationCap, tint: "purple", text: <>Nouvelle formation · <b>Première acquisition</b></>, meta: "En ligne · 6 modules" },
  { icon: Home, tint: "blue", text: <>Nouveau bien · <b>Riad médina</b></>, meta: "Marrakech · Vente" },
  { icon: Video, tint: "primary", text: <>Nouveau live · <b>Questions-réponses fiscalité</b></>, meta: "Suisse romande" },
  { icon: Camera, tint: "emerald", text: <>Nouveau service · <b>Photographe immobilier</b></>, meta: "Canton de Vaud" },
  { icon: Home, tint: "blue", text: <>Nouveau bien · <b>Studio centre-ville</b></>, meta: "Genève · Location" },
  { icon: CalendarDays, tint: "amber", text: <>Nouvel événement · <b>Atelier rendement locatif</b></>, meta: "Neuchâtel · Sur inscription" },
  { icon: GraduationCap, tint: "purple", text: <>Nouvelle formation · <b>Analyse financière</b></>, meta: "En ligne · 8 modules" },
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
      <h3 className="px-1 pb-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        Exemple d&apos;activité
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

// ─── Sujets suivis ──────────────────────────────────────────────────────────

type NewsItem = { cat: string; tint: keyof typeof TINT; icon: LucideIcon; title: string; meta: string };

/* Ce bloc portait cinq brèves : « Lex Koller : nouvelles conditions dès
   2026 », « la BNS maintient son taux à 1,5 % », « Genève : le m² dépasse
   14 500 CHF », datées « 2 h », « 5 h », « 1 j ».

   Elles ne portaient pas sur E-Dome, donc la règle de tri de la phase A les
   avait laissées. Elles restaient pourtant inventées, crédibles et sans
   source — un lecteur pouvait repartir en croyant connaître le taux
   directeur. L'horodatage aggravait le cas : il affirmait une dépêche fraîche
   là où il n'y a aucune rédaction derrière.

   Elles deviennent ce qu'elles pouvaient être sans mentir : les SUJETS que la
   veille couvrira. Plus un seul chiffre, plus une seule date. Le jour où de
   vraies dépêches sourcées arrivent, elles prennent la place des titres sans
   toucher au composant. */
const NEWS: NewsItem[] = [
  { cat: "Règle", tint: "amber", icon: Scale, title: "Lex Koller et l'acquisition par des non-résidents", meta: "Veille réglementaire" },
  { cat: "Taux", tint: "blue", icon: Percent, title: "Taux directeur de la BNS et coût du crédit hypothécaire", meta: "Veille marché" },
  { cat: "Marché", tint: "emerald", icon: TrendingUp, title: "Prix au mètre carré, par canton et par type de bien", meta: "Veille marché" },
  { cat: "Fiscalité", tint: "purple", icon: Building2, title: "Valeur locative et imposition du logement", meta: "Veille fiscale" },
  { cat: "International", tint: "primary", icon: Globe, title: "Régimes d'investissement immobilier hors de Suisse", meta: "Veille internationale" },
];

function NewsList() {
  return (
    <div className="mt-6">
      <h3 className="px-1 pb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        Sujets suivis
      </h3>
      <p className="px-1 pb-2 text-[11px] leading-snug text-[var(--text-muted)]">
        Les thèmes que la veille couvrira. Aucune dépêche n&apos;est publiée à ce
        stade.
      </p>
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
          <Handshake size={17} />
        </span>
        <p className="text-sm font-bold text-[var(--foreground)] mt-2.5">Devenez apporteur</p>
        <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
          Recommandez et touchez{" "}
          <b className="text-[var(--primary)]">une prime fixe en francs</b> sur les
          biens, ou <b className="text-[var(--primary)]">un pourcentage</b> sur la
          marketplace — jamais un pourcentage du prix payé par le client.
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)]">
          Comment ça marche
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
