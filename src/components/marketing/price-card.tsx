import { Check } from "lucide-react";
import styles from "./marketing.module.css";

/* ── Carte de tarif ──────────────────────────────────────────────────────────
   `featured` : bordure lumineuse tournante (dégradé conique, transform seul)
   et halo laiton. Les autres cartes restent sobres pour la laisser respirer. */

export function PriceCard({
  icon,
  title,
  price,
  sub,
  items,
  featured = false,
  tag,
}: {
  icon: React.ReactNode;
  title: string;
  price: string;
  sub?: string;
  items: string[];
  featured?: boolean;
  tag?: string;
}) {
  const body = (
    <div className={`relative flex h-full flex-col rounded-[calc(1.5rem-1px)] p-6 sm:p-7 ${featured ? "bg-card" : ""}`}>
      {featured && <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-laiton-soft via-transparent to-transparent" />}
      <div className="relative flex items-center justify-between gap-3">
        <span className={featured ? "flex h-11 w-11 items-center justify-center rounded-xl border border-laiton-border bg-laiton-soft text-laiton" : "flex h-11 w-11 items-center justify-center rounded-xl bg-leman-soft text-leman"}>
          {icon}
        </span>
        {tag && <span className="rounded-full border border-laiton-border bg-laiton-soft px-2.5 py-1 text-[11.5px] font-semibold text-laiton">{tag}</span>}
      </div>
      <p className="relative mt-6 text-[15px] font-semibold">{title}</p>
      <p className={`relative mt-2 text-[56px] font-semibold leading-none tracking-[-0.045em] tabular-nums ${featured ? "text-laiton" : ""}`}>{price}</p>
      <p className="relative mt-2 min-h-[2.5em] text-[12.5px] leading-snug text-muted-foreground">{sub ?? " "}</p>
      <div aria-hidden className="relative my-5 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <ul className="relative space-y-3 text-[14px]">
        {items.map((t) => (
          <li key={t} className="flex items-start gap-2.5">
            <span className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${featured ? "bg-laiton-soft text-laiton" : "bg-leman-soft text-leman"}`}>
              <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
            </span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );

  if (!featured) return <div className="h-full rounded-3xl border bg-card">{body}</div>;

  return (
    <div className="relative h-full overflow-hidden rounded-3xl p-px shadow-[0_30px_80px_-30px_color-mix(in_oklab,var(--laiton)_55%,transparent)] md:-translate-y-3">
      <div aria-hidden className="absolute inset-0 bg-laiton-border" />
      <div aria-hidden className={styles.glowRing} />
      {body}
    </div>
  );
}
