import { formatCHF } from "./format";

/* Modele de donnees pour /dashboard/revenus refondu.
   - 3 sources de biens (cohabite avec dashboard-data.properties)
   - 6 sources de revenus (all / immobilier / formations / evenements /
     boutique / apporteur)
   - fonction buildView(state) qui retourne une RevenueView complete
     (hero label + total + delta + 4 KPI + series chart + categories
     + breakdown title + selection de bien).

   Logique : on a 12 mois de donnees par bien × type. La fenetre 7j/
   30j/12m est calculee par windowValues. */

export type SourceId =
  | "all"
  | "immobilier"
  | "formations"
  | "evenements"
  | "boutique"
  | "apporteur";
export type PropType = "all" | "courte" | "longue" | "vente";
export type Period = "7j" | "30j" | "12m";

export interface RevenueState {
  source: SourceId;
  period: Period;
  propType: PropType;
  bien: string | null;
}

export interface Kpi {
  label: string;
  value: string;
  sub?: string;
}
export interface ChartSeries {
  key: string;
  name: string;
  color: string;
  data: number[];
}
export interface Category {
  label: string;
  value: number;
  color: string;
}
export interface BienRow {
  id: string;
  name: string;
  city: string;
  initials: string;
  color: string;
  value: number;
  delta: number;
}

const MONTHS = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];
const PL: Record<Period, string> = {
  "12m": "12 mois",
  "30j": "30 jours",
  "7j": "7 jours",
};
const FACTOR: Record<Period, number> = {
  "12m": 1,
  "30j": 1 / 12,
  "7j": 7 / 365,
};
const VERSE_TOTAL = 466;

const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);
const ramp = (base: number, growth: number) =>
  Array.from({ length: 12 }, (_, i) =>
    Math.round(base * (1 + (growth * i) / 11)),
  );

/* Types d'activite immobiliere — couleurs distinctives chart. */
export const TYPES = [
  {
    id: "courte" as const,
    label: "Location courte durée",
    short: "Courte durée",
    color: "#1D9E75",
  },
  {
    id: "longue" as const,
    label: "Location longue durée",
    short: "Longue durée",
    color: "#378ADD",
  },
  {
    id: "vente" as const,
    label: "Vente de biens",
    short: "Ventes",
    color: "#7F77DD",
  },
];

export interface Property {
  id: string;
  name: string;
  initials: string;
  city: string;
  color: string;
  delta: number;
  monthly: { courte: number[]; longue: number[]; vente: number[] };
}

/* Aligne avec dashboard-data.properties : meme id, name, city.
   Ajout : monthly par type (courte/longue/vente) sur 12 mois. */
export const PROPS: Property[] = [
  {
    id: "chalet-alpin",
    name: "Chalet Alpin Premium",
    initials: "CA",
    city: "Verbier",
    color: "#185FA5",
    delta: 18,
    monthly: {
      courte: ramp(900, 0.5),
      longue: Array(12).fill(0),
      vente: [0, 0, 0, 9000, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  },
  {
    id: "appart-vue-lac",
    name: "Appartement Vue Lac",
    initials: "AV",
    city: "Montreux",
    color: "#1D9E75",
    delta: 12,
    monthly: {
      courte: ramp(500, 0.3),
      longue: ramp(700, 0.05),
      vente: [0, 0, 0, 0, 0, 0, 0, 0, 9000, 0, 0, 0],
    },
  },
  {
    id: "studio-lausanne",
    name: "Studio Lausanne",
    initials: "SL",
    city: "Lausanne",
    color: "#7F77DD",
    delta: -3,
    monthly: {
      courte: ramp(200, 0.2),
      longue: ramp(650, 0.04),
      vente: Array(12).fill(0),
    },
  },
];

const SOURCES_META: Record<
  string,
  {
    label: string;
    color: string;
    delta: number;
    count?: number;
    monthly?: number[];
  }
> = {
  immobilier: { label: "Immobilier (biens)", color: "#185FA5", delta: 15 },
  formations: {
    label: "Formations",
    color: "#D85A30",
    delta: 26,
    count: 41,
    monthly: ramp(300, 0.4),
  },
  evenements: {
    label: "Événements",
    color: "#D4537E",
    delta: 12,
    count: 9,
    monthly: [0, 0, 400, 0, 0, 400, 0, 0, 400, 0, 0, 400],
  },
  boutique: {
    label: "Boutique",
    color: "#EF9F27",
    delta: 9,
    count: 73,
    monthly: ramp(85, 0.1),
  },
  apporteur: {
    label: "Apporteur",
    color: "#639922",
    delta: 26,
    monthly: ramp(150, 0.6),
  },
};

export const APPORTEUR_VERSES = [
  {
    name: "Agence Léman",
    bien: "Chalet Alpin Premium",
    res: 3,
    ca: 7350,
    paid: 294,
  },
  {
    name: "SwissHome",
    bien: "Appartement Vue Lac",
    res: 2,
    ca: 3600,
    paid: 144,
  },
  {
    name: "Alpine Props",
    bien: "Studio Lausanne",
    res: 1,
    ca: 712,
    paid: 28,
  },
];

export const SOURCE_OPTIONS: { value: SourceId; label: string }[] = [
  { value: "all", label: "Toutes les sources" },
  { value: "immobilier", label: "Immobilier (biens)" },
  { value: "formations", label: "Formations" },
  { value: "evenements", label: "Événements" },
  { value: "boutique", label: "Boutique" },
  { value: "apporteur", label: "Apporteur" },
];

function propMonthly(p: Property, type: PropType): number[] {
  if (type === "all")
    return p.monthly.courte.map(
      (_, i) => p.monthly.courte[i] + p.monthly.longue[i] + p.monthly.vente[i],
    );
  return p.monthly[type];
}
function typeMonthly(type: PropType): number[] {
  return MONTHS.map((_, i) =>
    PROPS.reduce((s, p) => s + propMonthly(p, type)[i], 0),
  );
}
function immobilierMonthly(): number[] {
  return typeMonthly("all");
}
function sourceMonthly(id: string): number[] {
  if (id === "immobilier") return immobilierMonthly();
  return SOURCES_META[id].monthly as number[];
}

export function windowLabels(period: Period): string[] {
  if (period === "12m") return MONTHS;
  if (period === "30j") return ["Sem. 1", "Sem. 2", "Sem. 3", "Sem. 4"];
  return ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
}
function windowValues(arr: number[], period: Period): number[] {
  if (period === "12m") return arr.slice();
  const v = arr[arr.length - 1];
  if (period === "30j") return [0.22, 0.26, 0.24, 0.28].map((f) => Math.round(v * f));
  const base = v / 30;
  return [0.9, 1.1, 1.0, 1.15, 1.2, 0.8, 0.85].map((f) => Math.round(base * f));
}

export interface RevenueView {
  heroLabel: string;
  total: number;
  delta: number;
  kpis: Kpi[];
  labels: string[];
  series: ChartSeries[];
  categories: Category[];
  breakdownTitle: string;
  showTypeFilter: boolean;
  biens?: BienRow[];
  selectedBien?: { id: string; name: string; city: string; initials: string };
  apporteur?: {
    gagne: number;
    verse: number;
    net: number;
    list: typeof APPORTEUR_VERSES;
  };
}

const fmtC = (n: number) => formatCHF(n);

export function buildView(state: RevenueState): RevenueView {
  const { source, period, bien, propType } = state;
  const labels = windowLabels(period);
  const ws = (arr: number[]) => windowValues(arr, period);
  const wsum = (arr: number[]) => sum(windowValues(arr, period));

  if (source === "apporteur") {
    const ser = ws(sourceMonthly("apporteur"));
    const gagne = sum(ser);
    const verse = Math.round(VERSE_TOTAL * FACTOR[period]);
    const net = gagne - verse;
    return {
      heroLabel: "Commissions gagnées · " + PL[period],
      total: gagne,
      delta: 26,
      kpis: [
        { label: "Commissions gagnées", value: fmtC(gagne), sub: "ce que je touche" },
        { label: "Commissions versées", value: fmtC(verse), sub: "payé à mes apporteurs" },
        { label: "Net", value: fmtC(net), sub: "sur la période" },
        {
          label: "Apporteurs",
          value: String(APPORTEUR_VERSES.length),
          sub: "sur mes biens",
        },
      ],
      labels,
      series: [
        { key: "gagne", name: "Gagnées", color: "#639922", data: ser },
        {
          key: "verse",
          name: "Versées",
          color: "#E24B4A",
          data: ser.map(() => Math.round(verse / ser.length)),
        },
      ],
      categories: [
        { label: "Gagnées", value: gagne, color: "#639922" },
        { label: "Versées", value: verse, color: "#E24B4A" },
      ],
      breakdownTitle: "Apporteurs sur mes biens",
      showTypeFilter: false,
      apporteur: { gagne, verse, net, list: APPORTEUR_VERSES },
    };
  }

  if (source === "all") {
    const ids = ["immobilier", "formations", "evenements", "boutique", "apporteur"];
    const series = ids.map((id) => ({
      key: id,
      name: SOURCES_META[id].label,
      color: SOURCES_META[id].color,
      data: ws(sourceMonthly(id)),
    }));
    const cats = ids
      .map((id) => ({
        label: SOURCES_META[id].label,
        value: wsum(sourceMonthly(id)),
        color: SOURCES_META[id].color,
      }))
      .sort((a, b) => b.value - a.value);
    const total = cats.reduce((s, c) => s + c.value, 0);
    return {
      heroLabel: "Tous les revenus · " + PL[period],
      total,
      delta: 14,
      kpis: [
        { label: "Revenu total", value: fmtC(total) },
        { label: "Sources actives", value: String(ids.length) },
        { label: "Source n°1", value: cats[0].label },
        { label: "Croissance", value: "+14%" },
      ],
      labels,
      series,
      categories: cats,
      breakdownTitle: "Répartition par source",
      showTypeFilter: false,
    };
  }

  if (source !== "immobilier") {
    const meta = SOURCES_META[source];
    const ser = ws(meta.monthly as number[]);
    const total = sum(ser);
    const ids = ["immobilier", "formations", "evenements", "boutique", "apporteur"];
    const grand = ids.reduce((s, id) => s + wsum(sourceMonthly(id)), 0) || 1;
    const cats = ids
      .map((id) => ({
        label: SOURCES_META[id].label,
        value: wsum(sourceMonthly(id)),
        color: SOURCES_META[id].color,
      }))
      .sort((a, b) => b.value - a.value);
    return {
      heroLabel: meta.label + " · " + PL[period],
      total,
      delta: meta.delta,
      kpis: [
        { label: "Revenu", value: fmtC(total) },
        { label: "Part du total", value: Math.round((total / grand) * 100) + "%" },
        {
          label: "Croissance",
          value: (meta.delta >= 0 ? "+" : "") + meta.delta + "%",
        },
        {
          label: "Transactions",
          value: String(Math.round((meta.count || 0) * FACTOR[period])),
        },
      ],
      labels,
      series: [{ key: "v", name: meta.label, color: meta.color, data: ser }],
      categories: cats,
      breakdownTitle: "Dans le total des sources",
      showTypeFilter: false,
    };
  }

  if (bien) {
    const prop = PROPS.find((p) => p.id === bien)!;
    let series: ChartSeries[];
    if (propType === "all")
      series = TYPES.map((t) => ({
        key: t.id,
        name: t.short,
        color: t.color,
        data: ws(prop.monthly[t.id]),
      }));
    else {
      const t = TYPES.find((x) => x.id === propType)!;
      series = [
        { key: t.id, name: t.short, color: t.color, data: ws(prop.monthly[t.id]) },
      ];
    }
    const total = wsum(propMonthly(prop, propType));
    const cats = TYPES.map((t) => ({
      label: t.short,
      value: wsum(prop.monthly[t.id]),
      color: t.color,
    })).filter((c) => c.value > 0);
    const immoTotal = wsum(immobilierMonthly()) || 1;
    const topType = cats.slice().sort((a, b) => b.value - a.value)[0];
    return {
      heroLabel: prop.name + " · " + PL[period],
      total,
      delta: prop.delta,
      kpis: [
        { label: "Revenu du bien", value: fmtC(total) },
        { label: "Type principal", value: topType ? topType.label : "—" },
        {
          label: "Part immobilier",
          value: Math.round((total / immoTotal) * 100) + "%",
        },
        {
          label: "Croissance",
          value: (prop.delta >= 0 ? "+" : "") + prop.delta + "%",
        },
      ],
      labels,
      series,
      categories: cats,
      breakdownTitle: "Ventilation par type",
      showTypeFilter: true,
      selectedBien: {
        id: prop.id,
        name: prop.name,
        city: prop.city,
        initials: prop.initials,
      },
    };
  }

  let series: ChartSeries[];
  if (propType === "all")
    series = TYPES.map((t) => ({
      key: t.id,
      name: t.short,
      color: t.color,
      data: ws(typeMonthly(t.id)),
    }));
  else {
    const t = TYPES.find((x) => x.id === propType)!;
    series = [
      { key: t.id, name: t.short, color: t.color, data: ws(typeMonthly(t.id)) },
    ];
  }
  const total = wsum(propType === "all" ? immobilierMonthly() : typeMonthly(propType));
  const biens: BienRow[] = PROPS.map((p) => ({
    id: p.id,
    name: p.name,
    city: p.city,
    initials: p.initials,
    color: p.color,
    value: wsum(propMonthly(p, propType)),
    delta: p.delta,
  }));
  const cats = biens
    .map((b) => ({ label: b.name, value: b.value, color: b.color }))
    .filter((c) => c.value > 0);
  const top = biens.slice().sort((a, b) => b.value - a.value)[0];
  return {
    heroLabel:
      (propType === "all"
        ? "Immobilier · tous les biens"
        : TYPES.find((t) => t.id === propType)!.label) +
      " · " +
      PL[period],
    total,
    delta: 15,
    kpis: [
      { label: "Revenu immobilier", value: fmtC(total) },
      { label: "Biens actifs", value: String(PROPS.length) },
      { label: "Bien n°1", value: top ? top.name : "—" },
      /* Auparavant "Croissance +15%" qui doublait le delta du hero.
         Remplace par revenu moyen par bien actif (info utile et non
         redondante). */
      {
        label: "Revenu / bien",
        value: fmtC(Math.round(total / Math.max(1, PROPS.length))),
      },
    ],
    labels,
    series,
    categories: cats,
    breakdownTitle: "Par bien",
    showTypeFilter: true,
    biens,
  };
}
