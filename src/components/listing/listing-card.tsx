import Link from "next/link";
import { Bath, BedDouble, Coins, MapPin, Maximize } from "lucide-react";
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
    p.area > 0 ? { icon: Maximize, label: `${formatNumber(p.area)} m²` } : null,
    p.bedrooms > 0 ? { icon: BedDouble, label: `${p.bedrooms} ch.`, title: `${p.bedrooms} chambre${p.bedrooms > 1 ? "s" : ""}` } : null,
    p.bathrooms > 0 ? { icon: Bath, label: `${p.bathrooms} s. d'eau`, title: `${p.bathrooms} salle${p.bathrooms > 1 ? "s" : ""} d'eau` } : null,
  ].filter(Boolean) as { icon: typeof Maximize; label: string; title?: string }[];
  const prime = p.activePrimeChf
    ? p.commission?.kind === "pourcentage"
      ? `${String(p.commission.ratePct).replace(".", ",")} % · ≈ ${formatNumber(Math.round(p.activePrimeChf))} CHF`
      : `${formatNumber(p.activePrimeChf)} CHF`
    : null;

  return (
    <Link
      href={`/explorer/${p.id}`}
      className="group/card relative block rounded-[22px] outline-none transition-transform duration-300 ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-1 focus-visible:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {/* Halo doré au survol (opacité seule) */}
      <span
        aria-hidden
        className={`pointer-events-none absolute -inset-px rounded-[23px] opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 group-focus-visible/card:opacity-100 ${
          prime
            ? "shadow-[0_0_0_1px_rgb(227_184_92/0.55),0_28px_70px_-28px_rgb(217_164_65/0.6)]"
            : "shadow-[0_0_0_1px_color-mix(in_srgb,var(--foreground)_22%,transparent),0_28px_70px_-30px_rgb(0_0_0/0.55)]"
        }`}
      />
      {/* Anneau de focus clavier */}
      <span aria-hidden className="pointer-events-none absolute -inset-1 rounded-[26px] opacity-0 ring-2 ring-leman group-focus-visible/card:opacity-100" />

      <div className="relative overflow-hidden rounded-[22px] border bg-card">
        <div className="relative aspect-[4/3] overflow-hidden bg-subtle">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverOf(p)}
            alt=""
            loading={priority ? "eager" : "lazy"}
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover/card:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
          />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          <div aria-hidden className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/30 to-transparent" />

          <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
            <span className="rounded-full bg-white/92 px-2.5 py-1 text-[11.5px] font-semibold text-[#15130f] shadow-sm backdrop-blur">
              {reprise ? "Reprise de bail" : TX_LABEL[p.transactionType]}
            </span>
            {prime ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#f2c66b]/80 bg-[linear-gradient(180deg,#f9e7bb,#f2c66b)] px-2.5 py-1 text-[11.5px] font-semibold tabular-nums text-[#4a3206] shadow-[0_0_20px_-2px_rgb(242_198_107/0.75)]">
                <Coins className="h-3 w-3" aria-hidden />
                <span className="sr-only">Commission d&apos;apport : </span>{prime}
              </span>
            ) : null}
          </div>

          <div className="absolute inset-x-3.5 bottom-3 flex items-end justify-between gap-2 text-white">
            <p className="text-[22px] font-semibold leading-none tabular-nums tracking-[-0.025em] [text-shadow:0_1px_12px_rgb(0_0_0/0.45)]">
              {chfPrice(p.price)}
              <span className="text-[13px] font-normal tracking-normal text-white/80">{PRICE_UNIT[p.transactionType]}</span>
            </p>
            {p.videos.length > 0 && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
                <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" aria-hidden><path d="M8 5v14l11-7z" /></svg> Vidéo
              </span>
            )}
          </div>
        </div>

        <div className="px-4 pb-4 pt-3.5">
          <p className="truncate text-[15px] font-semibold tracking-[-0.01em] text-foreground">{p.title}</p>
          <p className="mt-1 flex items-center gap-1 truncate text-[13px] text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden /> {p.city}
          </p>
          {(facts.length > 0 || reprise?.availableFrom) && (
            <div className="mt-3 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 border-t pt-3 text-[12.5px] text-foreground/80">
              {facts.map((f) => (
                <span key={f.label} className="inline-flex items-center gap-1.5 tabular-nums" title={f.title}>
                  <f.icon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                  {f.label}{f.title ? <span className="sr-only"> ({f.title})</span> : null}
                </span>
              ))}
              {reprise?.availableFrom && (
                <span className="font-medium text-leman">Libre dès le {frDay(reprise.availableFrom)}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
