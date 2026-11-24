import Link from "next/link";
import { formatNumber } from "@/lib/format";
import { coverOf, frDay, repriseOf, type MyProperty } from "@/lib/my-property";
import type { TransactionType } from "@/lib/types";

/* ── La carte d'un bien (REBUILD.md §3) ──────────────────────────────────────

   Une seule carte pour tout E-Dome. Le prix d'abord (c'est ce qu'on lit en
   premier), au format suisse ; puis le titre et les faits. Si le vendeur a
   posé une prime, elle apparaît en LAITON sur la photo : sur E-Dome, chaque
   bien peut rapporter à qui connaît le bon acheteur. Composant sans état,
   utilisable côté serveur comme côté client. */

export const TX_LABEL: Record<TransactionType, string> = {
  vente: "À vendre",
  "location-lt": "À louer",
  "location-ct": "Courte durée",
};

export const PRICE_UNIT: Record<TransactionType, string> = {
  vente: "",
  "location-lt": " / mois",
  "location-ct": " / nuit",
};

/** « CHF 1'690'000 » — convention suisse, format déterministe (identique serveur et navigateur). */
export function chfPrice(n: number): string {
  return `CHF ${formatNumber(n)}`;
}

export function ListingCard({ p, priority = false }: { p: MyProperty; priority?: boolean }) {
  const reprise = repriseOf(p);
  const facts = [
    p.area > 0 ? `${p.area} m²` : null,
    p.bedrooms > 0 ? `${p.bedrooms} ch.` : null,
    p.city,
  ].filter(Boolean);

  return (
    <Link
      href={`/explorer/${p.id}`}
      className="group block overflow-hidden rounded-2xl border bg-card outline-offset-4 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-[rgb(227_184_92/0.45)] hover:shadow-[0_24px_60px_-24px_rgb(217_164_65/0.45)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-subtle">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverOf(p)}
          alt=""
          loading={priority ? "eager" : "lazy"}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <span className="absolute left-3 top-3 rounded-md bg-white/92 px-2 py-0.5 text-[11.5px] font-medium text-[#15130f] backdrop-blur">
          {reprise ? "Reprise de bail" : TX_LABEL[p.transactionType]}
        </span>
        {p.activePrimeChf ? (
          <span className="absolute right-3 top-3 rounded-md border border-[#f2c66b]/70 bg-[linear-gradient(180deg,#f7e2b0,#f2c66b)] px-2 py-0.5 text-[11.5px] font-semibold tabular-nums text-[#4a3206] shadow-[0_0_18px_-2px_rgb(242_198_107/0.7)]">
            {p.commission?.kind === "pourcentage"
              ? `${String(p.commission.ratePct).replace(".", ",")} % · ≈ ${formatNumber(Math.round(p.activePrimeChf))} CHF`
              : `Commission ${formatNumber(p.activePrimeChf)} CHF`}
          </span>
        ) : null}
        <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 text-white">
          <p className="text-[20px] font-semibold tabular-nums leading-none tracking-[-0.02em] drop-shadow">
            {chfPrice(p.price)}
            <span className="text-[13px] font-normal text-white/75">{PRICE_UNIT[p.transactionType]}</span>
          </p>
          {p.videos.length > 0 && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-white/20 px-2 py-0.5 text-[11px] font-medium backdrop-blur">
              <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" aria-hidden><path d="M8 5v14l11-7z" /></svg> Vidéo
            </span>
          )}
        </div>
      </div>
      <div className="space-y-0.5 px-3.5 py-3">
        <p className="truncate text-[14.5px] font-medium text-foreground">{p.title}</p>
        <p className="truncate text-[12.5px] text-muted-foreground">{facts.join(" · ")}</p>
        {reprise?.availableFrom && (
          <p className="text-[12.5px] font-medium text-leman">Libre dès le {frDay(reprise.availableFrom)}</p>
        )}
      </div>
    </Link>
  );
}
