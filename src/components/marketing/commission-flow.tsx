import { Coins, Home, Landmark, UserRound } from "lucide-react";
import { formatNumber } from "@/lib/format";
import styles from "./marketing.module.css";

/* ── Schéma de flux d'une commission d'apport ───────────────────────────────
   Prix final → commission → apporteur (net) + part E-Dome. Les montants
   arrivent calculés par l'appelant (apporteurNetChf) : ce composant ne fait
   que les disposer. Des particules parcourent les rails (transform seul). */

export function CommissionFlow({
  price,
  rateLabel,
  gross,
  net,
  fee,
  apporteur,
}: {
  price: number;
  rateLabel: string;
  gross: number;
  net: number;
  fee: number;
  apporteur: string;
}) {
  const chf = (n: number) => `${formatNumber(Math.round(n))} CHF`;
  const netPct = Math.round((net / gross) * 100);

  return (
    <figure className="relative">
      <figcaption className="sr-only">
        Exemple : prix final {chf(price)}, commission de {rateLabel} soit {chf(gross)}, dont {chf(net)} nets pour {apporteur} et {chf(fee)} pour E-Dome.
      </figcaption>

      <div aria-hidden className="grid items-center gap-0 md:grid-cols-[1fr_72px_1fr_72px_1.15fr]">
        {/* 1. Prix */}
        <Node icon={<Home className="h-4 w-4" />} label="Prix de vente final" value={chf(price)} />

        <RailX />
        <RailY />

        {/* 2. Commission */}
        <Node icon={<Coins className="h-4 w-4" />} label={`Commission (${rateLabel})`} value={chf(gross)} tone="gold" />

        {/* Fourche */}
        <div className="relative hidden self-stretch md:block">
          <span className="absolute left-0 top-1/2 h-px w-1/2 bg-white/25" />
          <span className="absolute left-1/2 top-[25%] h-[50%] w-px bg-white/25" />
          <span className="absolute left-1/2 top-[25%] -mt-1.5 h-3 w-1/2 overflow-hidden">
            <span className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-white/25 to-[#e3b85c]/70" />
            <span className={styles.beamX} style={{ ["--beam-run" as string]: "56px" }} />
          </span>
          <span className="absolute left-1/2 top-[75%] -mt-1.5 h-3 w-1/2 overflow-hidden">
            <span className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-white/25 to-[#5fd3c4]/70" />
            <span className={`${styles.beamX} ${styles.beamXTeal}`} style={{ ["--beam-run" as string]: "56px", animationDelay: "0.6s" }} />
          </span>
        </div>
        <RailY />

        {/* 3. Répartition */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-1 md:gap-4">
          <div className="relative rounded-2xl border border-[#e3b85c]/45 bg-gradient-to-br from-[#d9a441]/25 via-[#d9a441]/10 to-transparent p-4 shadow-[0_0_40px_-10px_rgb(217_164_65/0.55)] sm:p-5">
            <p className="flex items-center gap-1.5 text-[12px] text-[#f7d488]/90"><UserRound className="h-3.5 w-3.5" />{apporteur}, net ({netPct} %)</p>
            <p className="mt-1 text-[20px] font-semibold whitespace-nowrap tabular-nums tracking-[-0.02em] text-[#f7d488] sm:text-[28px]">{chf(net)}</p>
          </div>
          <div className="relative rounded-2xl border border-[#5fd3c4]/30 bg-[#2daa9c]/10 p-4 sm:p-5">
            <p className="flex items-center gap-1.5 text-[12px] text-[#8fe3d8]"><Landmark className="h-3.5 w-3.5" />E-Dome ({100 - netPct} %)</p>
            <p className="mt-1 text-[20px] font-semibold whitespace-nowrap tabular-nums tracking-[-0.02em] text-white sm:text-[28px]">{chf(fee)}</p>
          </div>
        </div>
      </div>

      {/* Barre de proportion */}
      <div aria-hidden className="mt-8">
        <div className="flex h-2.5 overflow-hidden rounded-full bg-white/10">
          <span className="h-full bg-gradient-to-r from-[#d9a441] to-[#f7d488]" style={{ width: `${netPct}%` }} />
          <span className="h-full flex-1 bg-[#2daa9c]" />
        </div>
        <div className="mt-2 flex justify-between font-mono text-[11.5px] text-white/50">
          <span>{apporteur} · {netPct} %</span>
          <span>E-Dome · {100 - netPct} %</span>
        </div>
      </div>
    </figure>
  );
}

function Node({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone?: "gold" }) {
  return (
    <div className={`relative rounded-2xl border p-4 sm:p-5 ${tone === "gold" ? "border-[#e3b85c]/35 bg-white/[0.06]" : "border-white/12 bg-white/[0.04]"} backdrop-blur`}>
      <p className="flex items-center gap-1.5 text-[12px] text-white/60">
        <span className={tone === "gold" ? "text-[#e3b85c]" : "text-white/70"}>{icon}</span>
        {label}
      </p>
      <p className={`mt-1 text-[20px] font-semibold whitespace-nowrap tabular-nums tracking-[-0.02em] sm:text-[26px] ${tone === "gold" ? "text-[#f7d488]" : "text-white"}`}>{value}</p>
    </div>
  );
}

function RailX() {
  return (
    <div className="relative hidden h-3 overflow-hidden md:block">
      <span className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-white/15 via-white/35 to-white/15" />
      <span className={styles.beamX} style={{ ["--beam-run" as string]: "110px" }} />
    </div>
  );
}

function RailY() {
  return (
    <div className="relative mx-auto h-10 w-3 overflow-hidden md:hidden">
      <span className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-white/15 via-white/35 to-white/15" />
      <span className={styles.beamY} style={{ ["--beam-run" as string]: "60px" }} />
    </div>
  );
}
