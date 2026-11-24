"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Check, Copy, Coins, MapPin, MousePointerClick, Play } from "lucide-react";
import { CineCard } from "./cinematic-hero";
import { formatNumber } from "@/lib/format";
import { apporteurNetChf } from "@/lib/my-property";

/* ── Ce que fait E-Dome, en quatre cartes vivantes (fond sombre) ─────────────
   Chaque carte montre la fonction plutôt que de la décrire : une annonce
   vidéo, un lien tracé dont les clics montent, une courbe en direct, le calcul
   d'une commission. Exemples étiquetés, aucun chiffre réel inventé. */

export function CineBento() {
  const reduce = useReducedMotion();
  const [clicks, setClicks] = useState(37);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setClicks((c) => c + 1), 1800);
    return () => clearInterval(id);
  }, [reduce]);

  const price = 1_400_000;
  const gross = price * 0.01;

  return (
    <section className="cine relative -mx-4 overflow-hidden px-4 pb-20 pt-6 md:-mx-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-[12.5px] font-medium uppercase tracking-[0.18em] text-[#e3b85c]">Le parcours complet</p>
        <h2 className="mt-3 max-w-3xl text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[44px]">
          De la première photo à la commission versée. <span className="text-white/45">Tout au même endroit.</span>
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-6">
          {/* 1. Annonce vidéo */}
          <CineCard className="p-6 md:col-span-4">
            <div className="grid items-center gap-6 sm:grid-cols-[1fr_220px]">
              <div>
                <h3 className="text-[20px] font-semibold tracking-[-0.02em]">Une annonce qui donne envie</h3>
                <p className="mt-2 max-w-md text-[14px] leading-relaxed text-white/60">
                  Vidéo en fond, galerie plein écran, chiffres clés, carte, calculateur « Puis-je me l&apos;offrir ? ». Pensée pour le téléphone, là où s&apos;ouvrent les liens partagés.
                </p>
              </div>
              <div className="relative mx-auto aspect-[9/16] w-[180px] overflow-hidden rounded-[1.6rem] border border-white/15 bg-[linear-gradient(160deg,#3b5a63_0%,#1d2b30_45%,#5b4524_100%)] shadow-[0_20px_60px_-20px_rgb(0_0_0/0.8)] sm:w-full">
                <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_40%_at_70%_25%,rgb(255_220_160/0.35),transparent_70%)]" />
                <div className="absolute left-3 right-3 top-3 flex justify-between">
                  <span className="rounded-md bg-white/90 px-1.5 py-0.5 text-[9.5px] font-medium text-[#15130f]">À vendre</span>
                  <span className="rounded-md bg-[#f7edd6] px-1.5 py-0.5 text-[9.5px] font-semibold text-[#8a5d0c]">Commission 1 %</span>
                </div>
                <span className="absolute left-1/2 top-[38%] flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                  <Play className="h-5 w-5 fill-white text-white" aria-hidden />
                </span>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-10">
                  <p className="flex items-center gap-1 text-[10px] text-white/70"><MapPin className="h-3 w-3" aria-hidden />Neuchâtel</p>
                  <p className="text-[13px] font-semibold leading-tight">Attique vue lac</p>
                  <p className="text-[14px] font-semibold">CHF 1&apos;490&apos;000</p>
                  <span className="mt-2 block rounded-lg bg-[#2daa9c] py-1.5 text-center text-[11px] font-semibold text-[#06201c]">Contacter</span>
                </div>
              </div>
            </div>
          </CineCard>

          {/* 2. Lien tracé */}
          <CineCard className="p-6 md:col-span-2">
            <h3 className="text-[20px] font-semibold tracking-[-0.02em]">Un lien par apporteur</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-white/60">Qui a amené qui est prouvé, pendant 60 jours.</p>
            <button type="button" onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }}
              className="mt-5 flex w-full items-center gap-2 rounded-xl border border-white/12 bg-white/[0.05] px-3 py-2.5 text-left font-mono text-[12px] text-white/80 transition-colors hover:border-[#e3b85c]/50">
              <span className="min-w-0 flex-1 truncate">…/explorer/attique?ref=k7p2qx</span>
              {copied ? <Check className="h-4 w-4 text-[#5fd3c4]" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
            </button>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="flex items-center gap-1.5 text-[12px] text-white/50"><MousePointerClick className="h-3.5 w-3.5" aria-hidden />Clics sur ce lien</p>
                <p className="text-[34px] font-semibold tabular-nums tracking-[-0.03em]">{clicks}</p>
              </div>
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] text-white/55">exemple</span>
            </div>
          </CineCard>

          {/* 3. Temps réel */}
          <CineCard className="p-6 md:col-span-2">
            <h3 className="text-[20px] font-semibold tracking-[-0.02em]">Tout en temps réel</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-white/60">Vues, visiteurs, leads, conversion : le tableau de bord bouge à l&apos;instant.</p>
            <svg viewBox="0 0 240 90" className="mt-5 h-24 w-full" aria-hidden>
              {[18, 30, 26, 44, 38, 58, 50, 70, 62, 82].map((h, i) => (
                <rect key={i} x={i * 24 + 2} y={90 - h} width="16" height={h} rx="4" fill={i === 9 ? "#e3b85c" : "rgb(45 170 156 / 0.55)"} />
              ))}
            </svg>
            <p className="mt-2 flex items-center gap-2 text-[12.5px] text-white/70"><span className="live-dot h-1.5 w-1.5 rounded-full bg-[#2daa9c]" aria-hidden />En direct</p>
          </CineCard>

          {/* 4. Commission calculée */}
          <CineCard className="p-6 md:col-span-4">
            <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto]">
              <div>
                <h3 className="text-[20px] font-semibold tracking-[-0.02em]">La commission se calcule toute seule</h3>
                <p className="mt-2 max-w-md text-[14px] leading-relaxed text-white/60">
                  Fixe ou en % du prix, fixée par le vendeur. À la vente, le montant est calculé sur le prix final, le règlement est créé et suivi jusqu&apos;au paiement.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 font-mono text-[13px]">
                <div className="flex justify-between gap-6 text-white/60"><span>Prix final</span><span className="tabular-nums text-white">{formatNumber(price)}</span></div>
                <div className="flex justify-between gap-6 text-white/60"><span>× commission</span><span className="tabular-nums text-white">1 %</span></div>
                <div className="my-2 h-px bg-white/10" />
                <div className="flex justify-between gap-6"><span className="text-white/60">= Commission</span><span className="tabular-nums text-[#f7d488]">{formatNumber(gross)}</span></div>
                <div className="flex justify-between gap-6 text-white/60"><span>− E-Dome 12 %</span><span className="tabular-nums">{formatNumber(gross - apporteurNetChf(gross))}</span></div>
                <div className="mt-2 flex items-center justify-between gap-6 rounded-lg bg-[#d9a441]/15 px-2 py-1.5 text-[#f7d488]">
                  <span className="flex items-center gap-1.5"><Coins className="h-3.5 w-3.5" aria-hidden />Apporteur, net</span>
                  <span className="font-semibold tabular-nums">{formatNumber(apporteurNetChf(gross))} CHF</span>
                </div>
              </div>
            </div>
          </CineCard>
        </div>
      </div>
    </section>
  );
}
