/* Graphe en SVG pur : aucune dependance, controle total du rendu
   monochrome. La barre du mois courant est accentuee (fill-foreground),
   les autres en gris. Pour passer a Recharts plus tard, remplace juste
   ce composant. */

interface RevenueChartProps {
  data: { label: string; value: number }[];
  target?: number;
}

const W = 640;
const H = 215;
const TOP = 20;
const BASELINE = 190;
const LEFT = 40;
const RIGHT = 628;

export function RevenueChart({ data, target }: RevenueChartProps) {
  const max = Math.max(...data.map((d) => d.value), target ?? 0) * 1.08;
  const scale = (v: number) => (v / max) * (BASELINE - TOP);
  const slot = (RIGHT - LEFT) / data.length;
  const barW = Math.min(26, slot * 0.55);
  const targetY = target ? BASELINE - scale(target) : null;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label="Revenus mensuels sur douze mois, en hausse régulière"
    >
      <line
        x1={LEFT}
        y1={BASELINE}
        x2={RIGHT}
        y2={BASELINE}
        className="stroke-border"
        strokeWidth={1}
      />
      {targetY != null && (
        <line
          x1={LEFT}
          y1={targetY}
          x2={RIGHT}
          y2={targetY}
          className="stroke-border"
          strokeWidth={1}
          strokeDasharray="3 4"
        />
      )}
      {data.map((d, i) => {
        const h = scale(d.value);
        const x = LEFT + slot * i + (slot - barW) / 2;
        const y = BASELINE - h;
        const isLast = i === data.length - 1;
        return (
          <g key={d.label}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={h}
              rx={3}
              className={isLast ? "fill-foreground" : "fill-muted-foreground/25"}
            />
            <text
              x={x + barW / 2}
              y={BASELINE + 16}
              textAnchor="middle"
              className="fill-muted-foreground text-[11px]"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
