"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ─── KPI Cards — dashboard refonte monochrome ───────────────────────────
   Conformement au brief utilisateur :
   - Bloc 'Revenus' = hero : chiffre 38px/500, devise + variation a cote.
   - Cartes secondaires (Reservations/Apports/Conversion) plus discretes :
     label 13px gris, valeur 24px.
   - Palette quasi-monochrome : couleur UNIQUEMENT pour vert (positif) et
     rouge (negatif). Reste utilise les tokens existants --card / --foreground.
   - Bordures 0.5px legeres → on utilise 1px sur var(--card-border) qui
     est deja une couleur tres faible (--card-border = #eee light / #1f1f1f
     dark), ce qui produit l'effet 0.5px perceptuel.
   - Radius 8-12px : rounded-lg (8px) pour secondaires, rounded-xl (12px)
     pour le hero.
   - Espacement multiples de 8px (p-6 = 24, p-8 = 32, gap-3 = 12 etc.).
   - Tous les montants Intl.NumberFormat('fr-CH', currency: CHF) +
     font-variant-numeric tabular-nums (classe tabular-nums Tailwind).
   ─────────────────────────────────────────────────────────────────── */

/* Formateur monetaire Suisse. maximumFractionDigits=0 pour eviter
   CHF 12'450.00 quand on a des montants ronds en demo. */
const formatCHF = (n: number) =>
  new Intl.NumberFormat("fr-CH", {
    style: "currency",
    currency: "CHF",
    maximumFractionDigits: 0,
  }).format(n);

/* Badge variation : vert si positif, rouge si negatif. Pas d'icone — texte
   simple +X.X% / -X.X% pour rester monochrome au max. */
function VariationBadge({
  current,
  previous,
  size = "md",
}: {
  current: number;
  previous: number;
  size?: "sm" | "md";
}) {
  if (previous === 0) return null;
  const delta = ((current - previous) / previous) * 100;
  const isPositive = delta >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium tabular-nums",
        size === "sm" ? "text-[11px]" : "text-sm"
      )}
      style={{
        color: isPositive ? "var(--success)" : "var(--danger)",
      }}
    >
      {isPositive ? "+" : ""}
      {delta.toFixed(1)}%
    </span>
  );
}

/* ─── HeroRevenueCard ─────────────────────────────────────────────────
   Bloc 'Revenus' du dashboard. Chiffre dominant 38px/500, devise (CHF)
   et variation en plus petit a cote. Ligne de comparaison sous le bloc
   pour donner le contexte (vs mois precedent). */
export interface HeroRevenueCardProps {
  /** Montant courant (en CHF). */
  current: number;
  /** Montant precedent (pour calculer la variation). */
  previous: number;
  /** Label personnalisable, defaut "Revenus". */
  label?: string;
  /** Texte sous le chiffre, defaut "vs mois précédent". */
  comparisonLabel?: string;
}

export function HeroRevenueCard({
  current,
  previous,
  label = "Revenus",
  comparisonLabel = "vs mois précédent",
}: HeroRevenueCardProps) {
  return (
    <div
      className="rounded-xl border bg-[var(--card)] p-8"
      style={{ borderColor: "var(--card-border)" }}
    >
      <p
        className="text-sm font-medium mb-4"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </p>
      <div className="flex items-baseline gap-3 flex-wrap">
        <span
          className="text-[38px] leading-none tabular-nums"
          style={{ color: "var(--foreground)", fontWeight: 500 }}
        >
          {formatCHF(current)}
        </span>
        <VariationBadge current={current} previous={previous} size="md" />
      </div>
      <p
        className="text-xs mt-4 tabular-nums"
        style={{ color: "var(--text-muted)" }}
      >
        {comparisonLabel} · {formatCHF(previous)}
      </p>
    </div>
  );
}

/* ─── SecondaryKPICard ────────────────────────────────────────────────
   Cartes Reservations / Apports / Conversion. Beaucoup plus discretes :
   label 13px (texte secondaire), valeur 24px (semi-bold), petite
   variation en bas. Pas d'icone d'accent — esthetique sobre type Linear. */
export interface SecondaryKPICardProps {
  /** Label de la metrique (ex: "Réservations"). */
  label: string;
  /** Valeur courante. */
  value: number;
  /** Valeur precedente (variation). */
  previous: number;
  /** Format de la valeur : currency CHF, number simple, ou %. */
  format?: "currency" | "number" | "percent";
}

export function SecondaryKPICard({
  label,
  value,
  previous,
  format = "number",
}: SecondaryKPICardProps) {
  const displayValue =
    format === "currency"
      ? formatCHF(value)
      : format === "percent"
      ? `${value}%`
      : new Intl.NumberFormat("fr-CH").format(value);

  return (
    <div
      className="rounded-lg border bg-[var(--card)] p-6"
      style={{ borderColor: "var(--card-border)" }}
    >
      <p
        className="text-[13px] font-medium mb-2"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </p>
      <p
        className="text-2xl leading-none tabular-nums mb-2"
        style={{ color: "var(--foreground)", fontWeight: 500 }}
      >
        {displayValue}
      </p>
      <VariationBadge current={value} previous={previous} size="sm" />
    </div>
  );
}
