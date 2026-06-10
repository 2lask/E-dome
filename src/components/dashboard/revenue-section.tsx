"use client";

import { useMemo, useState } from "react";
import {
  Download,
  ChevronLeft,
  TrendingUp,
  ChevronRight,
  BarChart2,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Activity,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionsList } from "@/components/dashboard/transactions-list";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import {
  AnalyticsChart,
  type ChartMode,
  type ChartVisual,
} from "@/components/dashboard/analytics-chart";
import {
  buildView,
  SOURCE_OPTIONS,
  TYPES,
  type SourceId,
  type PropType,
  type Period,
} from "@/lib/revenue-data";

/* RevenueSection : tout le contenu interactif de l'ancien
   /dashboard/revenus extrait en composant. Rendu maintenant
   directement dans /dashboard (fusion home + revenus) -- la page
   /dashboard/revenus n'existe plus, un redirect 308 pointe vers
   /dashboard#revenus.

   API : aucune (autonome). Filtres source x periode x mode x visuel
   x type x bien, drill-down par bien, TransactionsList en bas. */

/* IconToggle : bouton icone 28px discret pour contrôles d'AFFICHAGE
   du chart (Mode + Visuel). Etat actif = bg muted. Focus visible. */
function IconToggle({
  active,
  onClick,
  Icon,
  title,
}: {
  active: boolean;
  onClick: () => void;
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={title}
      aria-pressed={active}
      title={title}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

function Seg<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="inline-flex gap-0.5 rounded-md bg-muted p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={cn(
            "rounded-[6px] px-2.5 py-1 text-xs transition-colors",
            value === o.value
              ? "bg-background font-medium text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Tile({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border p-4">
      <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
      <p className="truncate font-mono text-xl font-medium tabular-nums">
        {value}
      </p>
      {sub && <p className="mt-0.5 truncate text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

const PERIODS: { value: Period; label: string }[] = [
  { value: "7j", label: "7j" },
  { value: "30j", label: "30j" },
  { value: "12m", label: "12m" },
];
/* MODES + VISUALS plus utilises comme Seg : remplaces par les
   IconToggle discrets en haut a droite du chart. */
const TYPE_OPTS: { value: PropType; label: string }[] = [
  { value: "all", label: "Tous types" },
  ...TYPES.map((t) => ({ value: t.id as PropType, label: t.short })),
];

export function RevenueSection() {
  const [source, setSource] = useState<SourceId>("immobilier");
  const [period, setPeriod] = useState<Period>("12m");
  const [mode, setMode] = useState<ChartMode>("evolution");
  const [visual, setVisual] = useState<ChartVisual>("bar");
  const [propType, setPropType] = useState<PropType>("all");
  const [bien, setBien] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<"value" | "name">("value");

  const vm = useMemo(
    () => buildView({ source, period, propType, bien }),
    [source, period, propType, bien],
  );

  function changeSource(v: SourceId) {
    setSource(v);
    setBien(null);
    setPropType("all");
  }

  const legend =
    mode === "repartition"
      ? vm.categories.map((c) => ({ name: c.label, color: c.color, value: c.value }))
      : mode === "evolution" && vm.series.length > 1
        ? vm.series.map((s) => ({
            name: s.name,
            color: s.color,
            value: undefined as number | undefined,
          }))
        : [];
  const legendTotal = legend.reduce((s, l) => s + (l.value || 0), 0) || 1;

  const sortedBiens = vm.biens
    ? vm.biens
        .slice()
        .sort((a, b) =>
          sortKey === "value" ? b.value - a.value : a.name.localeCompare(b.name),
        )
    : null;

  return (
    <section id="revenus" className="space-y-6 scroll-mt-20">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
          Revenus & performance
        </p>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" /> Exporter
        </Button>
      </div>

      {/* Filtres DE DONNEES (Source / Periode / Type immo) en avant
          dans une seule carte. Le mode (Evolution / Comparaison /
          Repartition) et le visuel (Barres / Courbe) sont des
          options d'AFFICHAGE -> reduits a droite du graphe. */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-x-6 gap-y-4 pt-6">
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
              Source
            </span>
            <Select
              value={source}
              onValueChange={(v) => changeSource(v as SourceId)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOURCE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
              Période
            </span>
            <Seg value={period} onChange={setPeriod} options={PERIODS} />
          </div>
          {source === "immobilier" && (
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                Type immobilier
              </span>
              <Seg value={propType} onChange={setPropType} options={TYPE_OPTS} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Breadcrumb quand on a drill-down un bien specifique. Le
          filtre propType est dans la card principale (deja affiche
          quand source=immobilier). */}
      {vm.selectedBien && (
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-muted-foreground"
            onClick={() => setBien(null)}
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Tous les biens
          </Button>
          <span className="font-mono text-xs uppercase tracking-[0.06em] text-muted-foreground">
            {vm.selectedBien.name} · {vm.selectedBien.city}
          </span>
        </div>
      )}

      <div>
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
          {vm.heroLabel}
        </p>
        <div className="flex flex-wrap items-baseline gap-2.5">
          <span className="font-mono text-4xl font-medium tracking-tight tabular-nums">
            {formatNumber(vm.total)}
          </span>
          <span className="text-base text-muted-foreground">CHF</span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[11px] font-medium tabular-nums",
              vm.delta >= 0 ? "chip-success-soft" : "chip-danger-soft",
            )}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            {vm.delta >= 0 ? "+" : ""}
            {vm.delta}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {vm.kpis.map((k) => (
          <Tile key={k.label} label={k.label} value={k.value} sub={k.sub} />
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          {/* Controles d'AFFICHAGE discrets en haut a droite du chart :
              Mode (Evolution/Comparaison/Repartition) + Visuel (Barres
              /Courbe). Pas dans la card de filtres principale -> ce
              sont des options de rendu, pas de donnees. */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            {legend.length > 0 ? (
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                {legend.map((l) => (
                  <span key={l.name} className="flex items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 rounded-[2px]"
                      style={{ background: l.color }}
                    />
                    {l.name}
                    {l.value !== undefined
                      ? ` ${Math.round((l.value / legendTotal) * 100)}%`
                      : ""}
                  </span>
                ))}
              </div>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-1">
              <IconToggle
                active={mode === "evolution"}
                onClick={() => setMode("evolution")}
                Icon={Activity}
                title="Évolution"
              />
              <IconToggle
                active={mode === "comparison"}
                onClick={() => setMode("comparison")}
                Icon={BarChart2}
                title="Comparaison"
              />
              <IconToggle
                active={mode === "repartition"}
                onClick={() => setMode("repartition")}
                Icon={PieChartIcon}
                title="Répartition"
              />
              {mode !== "repartition" && (
                <>
                  <span className="mx-1 h-4 w-px bg-border" aria-hidden />
                  <IconToggle
                    active={visual === "bar"}
                    onClick={() => setVisual("bar")}
                    Icon={BarChart2}
                    title="Barres"
                  />
                  <IconToggle
                    active={visual === "line"}
                    onClick={() => setVisual("line")}
                    Icon={LineChartIcon}
                    title="Courbe"
                  />
                </>
              )}
            </div>
          </div>
          <AnalyticsChart
            mode={mode}
            visual={visual}
            labels={vm.labels}
            series={vm.series}
            categories={vm.categories}
          />
        </CardContent>
      </Card>

      {vm.apporteur ? (
        <Card>
          <CardContent className="pt-6">
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-sm font-medium">{vm.breakdownTitle}</span>
              <span className="font-mono text-[11px] text-muted-foreground">
                12 mois
              </span>
            </div>
            {vm.apporteur.list.map((a) => (
              <div
                key={a.name}
                className="flex items-center gap-3 border-t py-2.5 first:border-t-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{a.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {a.bien} · {a.res} résa · {formatNumber(a.ca)} CHF apportés
                  </p>
                </div>
                <span className="text-sm font-medium tabular-nums text-destructive">
                  −{formatNumber(a.paid)} CHF
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : sortedBiens ? (
        <Card>
          <CardContent className="pt-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium">{vm.breakdownTitle}</span>
              <Seg
                value={sortKey}
                onChange={setSortKey}
                options={[
                  { value: "value", label: "Revenu" },
                  { value: "name", label: "Nom" },
                ]}
              />
            </div>
            {sortedBiens.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBien(b.id)}
                className="flex w-full items-center gap-3 border-t py-3 text-left transition-colors first:border-t-0 hover:bg-muted/50"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-xs font-medium text-white"
                  style={{ background: b.color }}
                >
                  {b.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.city}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium tabular-nums">
                    {formatNumber(b.value)} CHF
                  </p>
                  <p
                    className={cn(
                      "text-xs",
                      b.delta >= 0 ? "text-success" : "text-destructive",
                    )}
                  >
                    {b.delta >= 0 ? "+" : ""}
                    {b.delta}%
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="mb-3 text-sm font-medium">{vm.breakdownTitle}</p>
            {vm.categories
              .slice()
              .sort((a, b) => b.value - a.value)
              .map((c) => {
                const tot = vm.categories.reduce((s, x) => s + x.value, 0) || 1;
                const pct = Math.round((c.value / tot) * 100);
                return (
                  <div key={c.label} className="mb-3 last:mb-0">
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-[2px]"
                          style={{ background: c.color }}
                        />
                        {c.label}
                      </span>
                      <span className="tabular-nums text-muted-foreground">
                        {formatNumber(c.value)} CHF · {pct}%
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: c.color }}
                      />
                    </div>
                  </div>
                );
              })}
          </CardContent>
        </Card>
      )}

      {/* Transactions : paiements / virements / commissions /
          remboursements avec filtres par kind. */}
      <TransactionsList />
    </section>
  );
}
