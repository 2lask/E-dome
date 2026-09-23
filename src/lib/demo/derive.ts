import { DEMO_TODAY, last12Months } from "./clock";
import { LEDGER, type Entry, type LedgerSource } from "./ledger";

/* ── Tout ce qui s'affiche se calcule ici ───────────────────────────────────

   Fonctions pures sur `LEDGER`. Aucune ne contient de chiffre : c'est la
   condition pour que deux écrans ne puissent plus se contredire.

   Les enveloppes `dashboard-data.ts` et `revenue-data.ts` appellent ces
   fonctions et conservent leurs noms d'export, si bien que les pages du
   tableau de bord n'ont pas changé d'une ligne. */

export interface Filter {
  source?: LedgerSource;
  subjectId?: string;
  /** Par défaut, une écriture annulée ne compte pas dans un revenu. */
  includeCancelled?: boolean;
}

function keep(e: Entry, f?: Filter): boolean {
  if (!f?.includeCancelled && e.status === "cancelled") return false;
  if (f?.source && e.source !== f.source) return false;
  if (f?.subjectId && e.subject.id !== f.subjectId) return false;
  return true;
}

export function entries(f?: Filter): Entry[] {
  return LEDGER.filter((e) => keep(e, f));
}

/** Série des douze mois, du plus ancien au plus récent. */
export function monthly(f?: Filter): { label: string; value: number }[] {
  const months = last12Months();
  const buckets = new Map<string, number>();

  for (const e of entries(f)) {
    const key = e.date.slice(0, 7);
    buckets.set(key, (buckets.get(key) ?? 0) + e.gross);
  }

  return months.map((m) => {
    const key = `${m.year}-${String(m.month + 1).padStart(2, "0")}`;
    return { label: m.label, value: Math.round(buckets.get(key) ?? 0) };
  });
}

/** Total sur les douze mois. Égal, par construction, à la somme de `monthly`. */
export function total(f?: Filter): number {
  return monthly(f).reduce((s, m) => s + m.value, 0);
}

/** Total du mois courant. Égal à la dernière valeur de `monthly`. */
export function currentMonth(f?: Filter): number {
  const series = monthly(f);
  return series[series.length - 1]!.value;
}

const ALL_SOURCES: LedgerSource[] = [
  "biens",
  "formations",
  "evenements",
  "services",
  "boutique",
  "lives",
  "apporteurs",
];

/** Répartition du mois courant par source. Sa somme égale `currentMonth()`. */
export function bySource(): { source: LedgerSource; value: number }[] {
  return ALL_SOURCES.map((source) => ({ source, value: currentMonth({ source }) }));
}

/** Répartition sur douze mois par source. */
export function bySourceYear(): { source: LedgerSource; value: number }[] {
  return ALL_SOURCES.map((source) => ({ source, value: total({ source }) }));
}

/**
 * Évolution en pourcentage entre le mois courant et le précédent.
 *
 * Calculée, jamais écrite. Les badges de croissance étaient en dur — d'où un
 * studio annoncé « +8 % » sur un écran et « −3 % » sur l'autre.
 */
export function growth(f?: Filter): number {
  const series = monthly(f);
  const previous = series[series.length - 2]?.value ?? 0;
  const current = series[series.length - 1]!.value;
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export function growthLabel(f?: Filter): string {
  const g = growth(f);
  return `${g >= 0 ? "+" : ""}${g}%`;
}

/** Nuits vendues sur le mois courant pour un bien. Sert au taux d'occupation. */
export function nightsThisMonth(subjectId: string): number {
  const key = DEMO_TODAY.toISOString().slice(0, 7);
  return entries({ source: "biens", subjectId })
    .filter((e) => e.date.slice(0, 7) === key)
    .reduce((s, e) => s + (e.stay?.nights ?? 0), 0);
}

/**
 * Taux d'occupation du mois courant.
 *
 * Dérivé des nuits réellement vendues, sur un mois de 30 jours. Les valeurs
 * étaient écrites en dur, et `prix × occupation × 30` ne retombait pas sur le
 * revenu annoncé — un facteur 2 sur deux des trois biens.
 */
export function occupancy(subjectId: string): number {
  return Math.min(1, nightsThisMonth(subjectId) / 30);
}

/** Les écritures de séjour, les plus récentes d'abord. */
export function stays(subjectId?: string): Entry[] {
  return entries({ source: "biens", subjectId, includeCancelled: true })
    .filter((e) => e.stay)
    .sort((a, b) => b.date.localeCompare(a.date));
}
