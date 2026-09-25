import { formatCHF } from "./format";
import { AFFILIATION_RATES } from "./pricing";
import * as derive from "./demo/derive";
import { OWNED_PROPERTY_IDS } from "./demo/identity";
import { properties as CATALOGUE } from "./mock-data";

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
  | "services"
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

/* Les libelles de mois viennent de l horloge de la demonstration : la
   fenetre se termine au mois courant, elle n est plus figee sur Janvier-
   Decembre. Sans cela, le dernier point du graphique ne serait pas le mois
   que le reste de l ecran appelle « ce mois-ci ». */
const MONTHS = derive.monthly().map((m) => m.label);
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
/* VERSE_TOTAL est dérivé d'APPORTEUR_VERSES, plus bas : le total versé ne
   peut pas diverger du détail affiché juste à côté. */

const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);
/* `ramp` a disparu avec le second moteur de revenus : plus aucune valeur
   n est engendree ici, elles descendent toutes du journal. */

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

/* Les memes biens que dashboard-data, et les memes chiffres.

   Ce fichier portait le SECOND moteur de revenus du depot : douze valeurs par
   bien et par type, engendrees par une rampe, pour un total d environ 66 900
   sur douze mois — pendant que dashboard-data en annoncait 228 100 sur la
   meme periode et 24 850 pour le mois. Les trois chiffres s affichaient sur
   le meme ecran.

   Les deux fichiers derivent desormais du journal. Ils ne peuvent plus
   diverger : ils lisent la meme table. */
const PALETTE = ["#185FA5", "#D85A30", "#D4537E"];

export const PROPS: Property[] = OWNED_PROPERTY_IDS.map((id, i) => {
  const c = CATALOGUE.find((x) => x.id === id)!;
  const filter = { source: "biens" as const, subjectId: id };
  return {
    id,
    name: c.title,
    initials: c.title.split(" ").filter((w) => w.length > 2).slice(0, 2).map((w) => w[0]!.toUpperCase()).join(""),
    city: c.location.city,
    color: PALETTE[i % PALETTE.length]!,
    delta: derive.growth(filter),
    monthly: {
      /* Ces trois biens sont en location de courte duree : le journal ne
         produit aucune ecriture de bail ni de vente pour eux, et inventer
         une repartition ferait mentir le graphique. */
      courte: derive.monthly(filter).map((m) => m.value),
      longue: Array(12).fill(0),
      vente: Array(12).fill(0),
    },
  };
});

const SOURCES_META: Record<
  string,
  { label: string; color: string; delta: number; count?: number; monthly?: number[] }
> = {
  immobilier: { label: "Immobilier (biens)", color: "#185FA5", delta: derive.growth({ source: "biens" }) },
  formations: {
    label: "Formations",
    color: "#D85A30",
    delta: derive.growth({ source: "formations" }),
    count: derive.entries({ source: "formations" }).length,
    monthly: derive.monthly({ source: "formations" }).map((m) => m.value),
  },
  evenements: {
    label: "Evenements",
    color: "#D4537E",
    delta: derive.growth({ source: "evenements" }),
    count: derive.entries({ source: "evenements" }).length,
    monthly: derive.monthly({ source: "evenements" }).map((m) => m.value),
  },
  /* « services » manquait a l appel, et l omission etait mesurable : le total
     « toutes sources » valait 123 723 quand la serie mensuelle en sommait
     126 313. L ecart, 2 590, etait exactement le revenu des prestations. */
  services: {
    label: "Services",
    color: "#1D9E75",
    delta: derive.growth({ source: "services" }),
    count: derive.entries({ source: "services" }).length,
    monthly: derive.monthly({ source: "services" }).map((m) => m.value),
  },
  boutique: {
    label: "Boutique",
    color: "#EF9F27",
    delta: derive.growth({ source: "boutique" }),
    count: derive.entries({ source: "boutique" }).length,
    monthly: derive.monthly({ source: "boutique" }).map((m) => m.value),
  },
  apporteur: {
    label: "Apporteur",
    color: "#639922",
    delta: derive.growth({ source: "apporteurs" }),
    monthly: derive.monthly({ source: "apporteurs" }).map((m) => m.value),
  },
};

/* Part versée à un affilié sur le chiffre d'affaires qu'il a amené, en courte
   durée : le TAUX d'affiliation marketplace (milieu de fourchette), appliqué au
   prix, prélevé sur la marge de l'hôte — la mécanique marketplace de D14, pas
   l'ancien pourcentage du revenu E-Dome. */
const mid = (r: { min: number; max: number }) => (r.min + r.max) / 2;
const apporteurPaid = (ca: number) => Math.round(ca * mid(AFFILIATION_RATES["location-ct"]!));

/* Les biens cites etaient ceux de l ancien jeu invente. Ils viennent du
   catalogue, comme partout ailleurs. */
export const APPORTEUR_VERSES = PROPS.map((prop, i) => {
  const ca = derive.total({ source: "biens", subjectId: prop.id });
  return {
    name: ["Agence Leman", "SwissHome", "Alpine Props"][i]!,
    bien: prop.name,
    res: derive.stays(prop.id).length,
    ca,
    paid: apporteurPaid(ca),
  };
});

const VERSE_TOTAL = APPORTEUR_VERSES.reduce((total, v) => total + v.paid, 0);

export const SOURCE_OPTIONS: { value: SourceId; label: string }[] = [
  { value: "all", label: "Toutes les sources" },
  { value: "immobilier", label: "Immobilier (biens)" },
  { value: "formations", label: "Formations" },
  { value: "evenements", label: "Événements" },
  { value: "services", label: "Services" },
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
    const ids = ["immobilier", "formations", "evenements", "services", "boutique", "apporteur"];
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
    const ids = ["immobilier", "formations", "evenements", "services", "boutique", "apporteur"];
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
