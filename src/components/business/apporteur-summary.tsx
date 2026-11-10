"use client";

import { Ban } from "lucide-react";
import { chfLabel, type ApporteurBook } from "@/lib/demo/affiliation";

/* ── Le total d'un apporteur, en une seule forme ─────────────────────────────

   Rendu par `/apporteurs` ET `/dashboard/apporteurs` à partir du MÊME
   `apporteurBook()` : les deux écrans ne peuvent plus annoncer deux chiffres
   différents pour la même personne. */

export function ApporteurTotals({ book }: { book: ApporteurBook }) {
  const tiles = [
    { label: "Total acquis (net)", value: book.totals.total, strong: true },
    { label: "Biens · primes", value: book.totals.bien },
    { label: "Marketplace · affiliation", value: book.totals.marketplace },
    { label: "Abonnements apportés", value: book.totals.abonnement },
    { label: "En attente d'acceptation", value: book.totals.pending },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {tiles.map((t) => (
        <div key={t.label} className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-3.5">
          <p className={`tabular-nums ${t.strong ? "text-xl font-bold" : "text-lg font-semibold"} text-[var(--foreground)]`}>{chfLabel(t.value)}</p>
          <p className="mt-0.5 text-[11.5px] leading-snug text-[var(--text-muted)]">{t.label}</p>
        </div>
      ))}
    </div>
  );
}

/** « Affiliation biens indisponible en France » — la restriction pays, visible (D7). */
export function PrimeCountryNotice({ country, reason }: { country: string; reason: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/[0.07] px-4 py-3">
      <Ban size={16} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
      <div className="text-[12.5px] leading-snug">
        <p className="font-semibold text-[var(--foreground)]">Affiliation biens indisponible {countryIn(country)}</p>
        <p className="mt-0.5 text-[var(--text-muted)]">{reason}</p>
      </div>
    </div>
  );
}

/* « en France », « au Portugal », « aux Émirats arabes unis »… */
function countryIn(country: string): string {
  const au = ["Portugal", "Royaume-Uni", "Maroc"];
  if (au.includes(country)) return `au ${country}`;
  if (country.startsWith("Émirats")) return `aux ${country}`;
  if (country === "pays non renseigné") return "dans ce pays";
  return `en ${country}`;
}
