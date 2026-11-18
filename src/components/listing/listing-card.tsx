import Link from "next/link";
import { formatNumber } from "@/lib/format";
import { coverOf, type MyProperty } from "@/lib/my-property";
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
  const facts = [
    p.area > 0 ? `${p.area} m²` : null,
    p.bedrooms > 0 ? `${p.bedrooms} ch.` : null,
    p.city,
  ].filter(Boolean);

  return (
    <Link href={`/explorer/${p.id}`} className="group block rounded-xl outline-offset-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-subtle">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverOf(p)}
          alt=""
          loading={priority ? "eager" : "lazy"}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <span className="absolute left-2.5 top-2.5 rounded-md bg-white/92 px-2 py-0.5 text-[11.5px] font-medium text-[#15130f] backdrop-blur">
          {TX_LABEL[p.transactionType]}
        </span>
        {p.activePrimeChf ? (
          <span className="absolute right-2.5 top-2.5 rounded-md border border-[#ead7ad] bg-[#f7edd6] px-2 py-0.5 text-[11.5px] font-semibold tabular-nums text-[#8a5d0c]">
            Prime {formatNumber(p.activePrimeChf)} CHF
          </span>
        ) : null}
      </div>
      <div className="mt-2.5 space-y-0.5">
        <p className="text-[15px] font-semibold tabular-nums tracking-[-0.01em]">
          {chfPrice(p.price)}
          <span className="font-normal text-muted-foreground">{PRICE_UNIT[p.transactionType]}</span>
        </p>
        <p className="truncate text-[13.5px] text-foreground/90 group-hover:underline">{p.title}</p>
        <p className="truncate text-[12.5px] text-muted-foreground">{facts.join(" · ")}</p>
      </div>
    </Link>
  );
}
