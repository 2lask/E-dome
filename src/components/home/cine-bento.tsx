"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Calculator, Check, Copy, Coins, Film, Images, Link2, Map as MapIcon, MapPin, MessageCircle, MousePointerClick, Play, QrCode } from "lucide-react";
import { CineCard } from "./cinematic-hero";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/motion/reveal";
import { formatNumber } from "@/lib/format";
import { apporteurNetChf } from "@/lib/my-property";

/* ── Ce que fait E-Dome, en quatre cartes vivantes (fond sombre) ─────────────
   Chaque carte montre la fonction plutôt que de la décrire : une annonce
   vidéo, un lien tracé dont les clics montent, une courbe en direct, le calcul
   d'une commission. Exemples étiquetés, aucun chiffre réel inventé. */

const BARS = [18, 30, 26, 44, 38, 58, 50, 70, 62, 82];
const FEATURES = [
  { icon: Film, t: "Vidéo en fond" },
  { icon: Images, t: "Galerie plein écran" },
  { icon: MapIcon, t: "Carte et quartier" },
  { icon: Calculator, t: "« Puis-je me l'offrir ? »" },
];

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
    <section className="cine relative -mx-4 overflow-hidden px-4 pb-32 pt-16 md:-mx-8 md:px-8 md:pt-24">
      <div aria-hidden className="v3-orb v3-orb--leman -right-20 top-40 h-96 w-96 opacity-60" />
      <div aria-hidden className="v3-orb v3-orb--gold -left-32 bottom-32 h-96 w-96 opacity-50" />
      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <p className="v3-eyebrow v3-eyebrow--cine">Le parcours complet</p>
          <h2 className="mt-5 max-w-3xl text-[34px] font-semibold leading-[1.04] tracking-[-0.035em] sm:text-[50px]">
            De la première photo à la commission versée.{" "}
            <span className="bg-gradient-to-r from-white/40 to-white/25 bg-clip-text text-transparent">Tout au même endroit.</span>
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-4 md:grid-cols-6">
          {/* 1. Annonce vidéo */}
          <RevealItem className="md:col-span-4">
            <CineCard className="h-full p-6 sm:p-7">
              <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgb(45_170_156/0.22),transparent)]" />
              <div className="relative grid h-full gap-7 sm:grid-cols-[1fr_200px]">
                <div className="flex flex-col">
                  <span className="text-[12px] font-medium text-[#5fd3c4]">Annonce</span>
                  <h3 className="mt-1.5 text-[22px] font-semibold tracking-[-0.02em]">Une annonce qui donne envie</h3>
                  <p className="mt-2 max-w-md text-[14px] leading-relaxed text-white/60">
                    Pensée pour le téléphone, là où s&apos;ouvrent les liens partagés. Tout ce qu&apos;un acheteur veut voir, sans quitter la page.
                  </p>
                  <ul className="mt-6 grid grid-cols-2 gap-2.5">
                    {FEATURES.map((f) => (
                      <li key={f.t} className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-[12.5px] text-white/80 shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#2daa9c]/15 text-[#5fd3c4]">
                          <f.icon className="h-3.5 w-3.5" aria-hidden />
                        </span>
                        <span className="min-w-0 leading-tight">{f.t}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-white/[0.07] pt-5 text-[12px] text-white/50">
                    <span className="mr-1">Partagée en un geste</span>
                    {[{ icon: Link2, t: "Lien" }, { icon: QrCode, t: "QR code" }, { icon: MessageCircle, t: "Message" }].map((c) => (
                      <span key={c.t} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-white/75">
                        <c.icon className="h-3 w-3 text-[#f2c66b]" aria-hidden />{c.t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Téléphone */}
                <div className="relative mx-auto w-[190px] sm:w-full">
                  <div aria-hidden className="absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(closest-side,rgb(217_164_65/0.25),transparent)] blur-xl" />
                  <div className="relative aspect-[9/16] overflow-hidden rounded-[1.8rem] border border-white/15 bg-[linear-gradient(160deg,#3b5a63_0%,#1d2b30_45%,#5b4524_100%)] p-[5px] shadow-[0_30px_70px_-20px_rgb(0_0_0/0.9),inset_0_1px_0_rgb(255_255_255/0.15)]">
                    <div className="relative h-full overflow-hidden rounded-[1.45rem]">
                      <motion.div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_40%_at_70%_25%,rgb(255_220_160/0.4),transparent_70%)]"
                        animate={reduce ? undefined : { scale: [1, 1.12, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
                      <div aria-hidden className="absolute left-1/2 top-1.5 h-1 w-10 -translate-x-1/2 rounded-full bg-black/40" />
                      <div className="absolute left-2.5 right-2.5 top-4 flex justify-between">
                        <span className="rounded-md bg-white/90 px-1.5 py-0.5 text-[9.5px] font-medium text-[#15130f]">À vendre</span>
                        <span className="rounded-md bg-[#f7edd6] px-1.5 py-0.5 text-[9.5px] font-semibold text-[#8a5d0c]">Commission 1 %</span>
                      </div>
                      <span className="absolute left-1/2 top-[38%] flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/30 backdrop-blur">
                        <Play className="h-5 w-5 fill-white text-white" aria-hidden />
                      </span>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3 pt-12">
                        <p className="flex items-center gap-1 text-[10px] text-white/70"><MapPin className="h-3 w-3" aria-hidden />Neuchâtel</p>
                        <p className="text-[13px] font-semibold leading-tight">Attique vue lac</p>
                        <p className="text-[14px] font-semibold">CHF 1&apos;490&apos;000</p>
                        <span className="mt-2 block rounded-lg bg-[#2daa9c] py-1.5 text-center text-[11px] font-semibold text-[#06201c]">Contacter</span>
                      </div>
                    </div>
                  </div>
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-md bg-white/10 px-2 py-0.5 text-[10.5px] text-white/55 backdrop-blur">exemple</span>
                </div>
              </div>
            </CineCard>
          </RevealItem>

          {/* 2. Lien tracé */}
          <RevealItem className="md:col-span-2">
            <CineCard className="flex h-full flex-col p-6 sm:p-7">
              <span className="text-[12px] font-medium text-[#f2c66b]">Apporteur</span>
              <h3 className="mt-1.5 text-[22px] font-semibold tracking-[-0.02em]">Un lien par apporteur</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-white/60">Qui a amené qui est prouvé, pendant 60 jours.</p>
              <button type="button" aria-label="Copier le lien d'exemple"
                onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                className="mt-5 flex min-h-11 w-full items-center gap-2 rounded-xl border border-white/12 bg-black/30 px-3 py-2.5 text-left font-mono text-[12px] text-white/80 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)] transition-colors hover:border-[#e3b85c]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2c66b]">
                <span className="min-w-0 flex-1 truncate">…/explorer/attique?ref=<span className="text-[#f2c66b]">k7p2qx</span></span>
                {copied ? <Check className="h-4 w-4 text-[#5fd3c4]" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
              </button>
              <span className="sr-only" aria-live="polite">{copied ? "Copié (exemple)" : ""}</span>
              <svg viewBox="0 0 200 48" preserveAspectRatio="none" className="mt-5 h-12 w-full" aria-hidden>
                <defs>
                  <linearGradient id="v3-link-area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#e3b85c" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#e3b85c" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.g style={{ transformOrigin: "left", transformBox: "fill-box" }}
                  initial={{ scaleX: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }} whileInView={{ scaleX: 1, opacity: 1 }} viewport={{ once: true }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}>
                  <path d="M0 40 L25 36 L50 38 L75 28 L100 30 L125 20 L150 22 L175 10 L200 6 L200 48 L0 48 Z" fill="url(#v3-link-area)" />
                  <path d="M0 40 L25 36 L50 38 L75 28 L100 30 L125 20 L150 22 L175 10 L200 6" fill="none" stroke="#e3b85c" strokeWidth="1.8" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                </motion.g>
              </svg>
              <div className="mt-auto flex items-end justify-between pt-6">
                <div>
                  <p className="flex items-center gap-1.5 text-[12px] text-white/50"><MousePointerClick className="h-3.5 w-3.5" aria-hidden />Clics sur ce lien</p>
                  <div className="relative mt-0.5 h-11 overflow-hidden text-[38px] font-semibold leading-[44px] tabular-nums tracking-[-0.03em]">
                    <AnimatePresence initial={false} mode="popLayout">
                      <motion.span key={clicks} className="block"
                        initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                        {clicks}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
                <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] text-white/55">exemple</span>
              </div>
            </CineCard>
          </RevealItem>

          {/* 3. Temps réel */}
          <RevealItem className="md:col-span-2">
            <CineCard className="flex h-full flex-col p-6 sm:p-7">
              <span className="text-[12px] font-medium text-[#5fd3c4]">Suivi</span>
              <h3 className="mt-1.5 text-[22px] font-semibold tracking-[-0.02em]">Tout en temps réel</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-white/60">Vues, visiteurs, leads, conversion : le tableau de bord bouge à l&apos;instant.</p>
              <svg viewBox="0 0 240 90" className="mt-6 h-24 w-full overflow-visible" aria-hidden>
                <defs>
                  <linearGradient id="v3-bar-teal" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#5fd3c4" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#2daa9c" stopOpacity="0.2" />
                  </linearGradient>
                  <linearGradient id="v3-bar-gold" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#fff1cf" />
                    <stop offset="100%" stopColor="#d9a441" />
                  </linearGradient>
                </defs>
                {BARS.map((h, i) => (
                  <motion.rect key={i} className="v3-bar" x={i * 24 + 2} y={90 - h} width="16" height={h} rx="4"
                    fill={i === BARS.length - 1 ? "url(#v3-bar-gold)" : "url(#v3-bar-teal)"}
                    initial={{ scaleY: reduce ? 1 : 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.15 + i * 0.05, ease: [0.16, 1, 0.3, 1] }} />
                ))}
              </svg>
              <p className="mt-auto flex items-center gap-2 pt-3 text-[12.5px] text-white/70">
                <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#2daa9c]" aria-hidden />En direct
                <span className="ml-auto rounded-md bg-white/10 px-2 py-0.5 text-[11px] text-white/55">illustration</span>
              </p>
            </CineCard>
          </RevealItem>

          {/* 4. Commission calculée */}
          <RevealItem className="md:col-span-4">
            <CineCard className="h-full p-6 sm:p-7">
              <div aria-hidden className="pointer-events-none absolute -bottom-28 right-10 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgb(217_164_65/0.2),transparent)]" />
              <div className="relative grid h-full items-center gap-7 sm:grid-cols-[1fr_auto]">
                <div>
                  <span className="text-[12px] font-medium text-[#f2c66b]">Commission</span>
                  <h3 className="mt-1.5 text-[22px] font-semibold tracking-[-0.02em]">La commission se calcule toute seule</h3>
                  <p className="mt-2 max-w-md text-[14px] leading-relaxed text-white/60">
                    Fixe ou en % du prix, fixée par le vendeur. À la vente, le montant est calculé sur le prix final, le règlement est créé et suivi jusqu&apos;au paiement.
                  </p>
                </div>
                <div className="v3-beam v3-beam--cine rounded-2xl">
                  <div className="v3-beam__inner rounded-2xl p-4 font-mono text-[13px] sm:min-w-[260px]">
                    <div className="mb-2 flex items-center justify-between text-[10.5px] uppercase tracking-[0.14em] text-white/40">
                      <span>Décompte</span><span className="normal-case tracking-normal">exemple</span>
                    </div>
                    <div className="flex justify-between gap-6 text-white/60"><span>Prix final</span><span className="tabular-nums text-white">{formatNumber(price)}</span></div>
                    <div className="flex justify-between gap-6 text-white/60"><span>× commission</span><span className="tabular-nums text-white">1 %</span></div>
                    <div className="my-2 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                    <div className="flex justify-between gap-6"><span className="text-white/60">= Commission</span><span className="tabular-nums text-[#f7d488]">{formatNumber(gross)}</span></div>
                    <div className="flex justify-between gap-6 text-white/60"><span>− E-Dome 12 %</span><span className="tabular-nums">{formatNumber(gross - apporteurNetChf(gross))}</span></div>
                    <div className="mt-2.5 flex items-center justify-between gap-6 rounded-lg bg-gradient-to-r from-[#d9a441]/25 to-[#d9a441]/10 px-2.5 py-2 text-[#f7d488] ring-1 ring-[#d9a441]/30">
                      <span className="flex items-center gap-1.5"><Coins className="h-3.5 w-3.5" aria-hidden />Apporteur, net</span>
                      <span className="font-semibold tabular-nums">{formatNumber(apporteurNetChf(gross))} CHF</span>
                    </div>
                  </div>
                </div>
              </div>
            </CineCard>
          </RevealItem>
        </RevealGroup>
      </div>
      <div aria-hidden className="v3-fade-to-page" />
    </section>
  );
}
