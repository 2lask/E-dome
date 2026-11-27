"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Eye, Handshake, Inbox, Link2, Share2 } from "lucide-react";
import { formatNumber } from "@/lib/format";
import { apporteurNetChf } from "@/lib/my-property";

/* ── Hero cinématographique de l'accueil visiteur ────────────────────────────
   Plein écran, toujours sombre : aurore animée, grille lumineuse, titre en
   dégradé or, et un aperçu du tableau de bord dont l'activité défile en
   direct. Aperçu ÉTIQUETÉ « illustration » : aucun chiffre réel inventé. */

type Ev = { icon: typeof Eye; text: string; tone: "teal" | "gold" };
const FEED: Ev[] = [
  { icon: Eye, text: "Nouvelle visite via le lien de Sarah", tone: "teal" },
  { icon: Share2, text: "Annonce partagée sur WhatsApp", tone: "teal" },
  { icon: Inbox, text: "Nouveau lead · apporté par Marc", tone: "gold" },
  { icon: Eye, text: "3 visites en 10 minutes", tone: "teal" },
  { icon: Link2, text: "Lien d'apporteur créé par Julie", tone: "teal" },
  { icon: Handshake, text: "Vente conclue · commission calculée", tone: "gold" },
];

const GROSS = 12_500;

export function CinematicHero() {
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);
  const [views, setViews] = useState(1_284);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setTick((t) => t + 1);
      setViews((v) => v + 1 + Math.floor(Math.random() * 3));
    }, 2400);
    return () => clearInterval(id);
  }, [reduce]);
  const visible = [0, 1, 2].map((i) => FEED[(tick + i) % FEED.length]);

  return (
    <section className="cine relative -mx-4 -mt-6 overflow-hidden md:-mx-8 md:-mt-8">
      <div aria-hidden className="cine-aurora" />
      <div aria-hidden className="cine-grid" />
      <div aria-hidden className="v3-spot" />
      <div aria-hidden className="v3-orb v3-orb--gold -left-24 top-1/3 h-72 w-72" />
      <div aria-hidden className="v3-orb v3-orb--leman right-0 top-10 h-80 w-80" />
      <div aria-hidden className="v3-grain absolute inset-0" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#0b0a08]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-14 md:px-8 md:pb-24 md:pt-20 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1 pl-1.5 pr-3 text-[12.5px] text-white/80 shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] backdrop-blur">
            <span className="rounded-full bg-[#2daa9c]/20 px-2 py-0.5 text-[11px] font-semibold text-[#7fe0d3]">Nouveau</span>
            Suisse romande · lancement novembre 2026
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-7 text-[46px] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-[66px] lg:text-[80px]">
            <span className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">Votre bien,</span>
            <br />
            <span className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">vendu par</span>
            <br />
            <span className="cine-gold drop-shadow-[0_0_28px_rgb(217_164_65/0.35)]">tout un réseau.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-7 max-w-xl text-[17px] leading-relaxed text-white/70 sm:text-[18px]">
            Publiez gratuitement avec photos et vidéo. Chacun recommande votre bien avec son lien personnel : visites,
            leads et vente suivis en temps réel, commission calculée toute seule.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-8 flex flex-wrap gap-3">
            <Link href="/auth/inscription?redirect=/publier" className="cine-btn-light v3-sheen inline-flex h-12 items-center rounded-xl px-6 text-[15px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2c66b]">
              Publier mon bien — gratuit
            </Link>
            <Link href="/apporteurs" className="cine-btn-gold v3-sheen group inline-flex h-12 items-center gap-2 rounded-xl px-6 text-[15px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2c66b]">
              Gagner en recommandant <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </motion.div>
          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-white/55">
            {["Publication gratuite", "Commission fixée par le vendeur", "Fonds jamais détenus par E-Dome"].map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#5fd3c4]" aria-hidden />{t}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Aperçu du tableau de bord, étiqueté */}
        <motion.div initial={{ opacity: 0, y: 24, rotate: -1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="relative">
          <div aria-hidden className="absolute -inset-10 rounded-[2.5rem] bg-[radial-gradient(50%_50%_at_60%_40%,rgb(217_164_65/0.28),transparent_70%)] blur-2xl" />
          <motion.div aria-hidden
            initial={{ opacity: 0, y: 12 }} animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -8, 0] }}
            transition={reduce ? { duration: 0.4 } : { opacity: { duration: 0.6, delay: 1 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 } }}
            className="cine-glass absolute -bottom-10 -left-8 z-10 hidden items-center gap-2.5 rounded-2xl px-3.5 py-2.5 xl:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d9a441]/20 text-[#f2c66b]"><Inbox className="h-4 w-4" /></span>
            <span className="text-[12.5px] leading-tight">
              <span className="block font-semibold">Lead apporté par Marc</span>
              <span className="text-white/50">exemple · lien tracé</span>
            </span>
          </motion.div>
          <div className="v3-beam v3-beam--cine relative rounded-3xl shadow-[0_40px_120px_-30px_rgb(0_0_0/0.9)]">
          <div className="v3-beam__inner cine-glass rounded-3xl p-5 sm:p-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="live-dot h-2 w-2 rounded-full bg-[#2daa9c]" aria-hidden />
                <span className="text-[13.5px] font-semibold">Villa à Corcelles · en direct</span>
              </div>
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] text-white/60">illustration</span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2.5">
              {[
                { l: "Vues", v: formatNumber(views) },
                { l: "Leads", v: String(23 + Math.floor(tick / 3)) },
                { l: "Via apporteurs", v: "61 %" },
              ].map((k) => (
                <div key={k.l} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <p className="truncate text-[11px] text-white/55">{k.l}</p>
                  <p className="mt-1 text-[22px] font-semibold tabular-nums tracking-[-0.02em]">{k.v}</p>
                </div>
              ))}
            </div>

            <svg viewBox="0 0 300 70" preserveAspectRatio="none" className="mt-4 h-16 w-full" aria-hidden>
              <defs>
                <linearGradient id="cine-area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#2daa9c" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#2daa9c" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 58 L30 52 L60 55 L90 44 L120 47 L150 34 L180 38 L210 24 L240 28 L270 14 L300 8 L300 70 L0 70 Z" fill="url(#cine-area)" />
              <path className="cine-draw" d="M0 58 L30 52 L60 55 L90 44 L120 47 L150 34 L180 38 L210 24 L240 28 L270 14 L300 8" fill="none" stroke="#2daa9c" strokeWidth="2.2" strokeLinejoin="round" />
            </svg>

            <ul className="mt-3 space-y-1.5" aria-label="Activité en direct (exemple)" aria-live="off">
              <AnimatePresence initial={false} mode="popLayout">
                {visible.map((ev, i) => (
                  <motion.li key={`${tick}-${i}`} layout
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1 - i * 0.22, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.35 }}
                    className="flex items-center gap-2.5 rounded-xl px-1.5 py-1.5 text-[13px]">
                    <span className={ev.tone === "gold"
                      ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d9a441]/20 text-[#f2c66b]"
                      : "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2daa9c]/20 text-[#5fd3c4]"}>
                      <ev.icon className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-white/85">{ev.text}</span>
                    {i === 0 && <span className="text-[11px] text-white/45">à l&apos;instant</span>}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <div className="mt-4 grid grid-cols-2 gap-2.5 border-t border-white/10 pt-4">
              <div className="rounded-2xl border border-[#d9a441]/40 bg-[#d9a441]/10 p-3">
                <p className="truncate text-[11px] text-[#f2c66b]">Commission 1 % · vente 1,25 M</p>
                <p className="mt-0.5 text-[20px] font-semibold tabular-nums text-[#f7d488]">{formatNumber(GROSS)} CHF</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <p className="truncate text-[11px] text-white/55">L&apos;apporteur touche, net</p>
                <p className="mt-0.5 text-[20px] font-semibold tabular-nums">{formatNumber(apporteurNetChf(GROSS))} CHF</p>
              </div>
            </div>
          </div>
          </div>
        </motion.div>
      </div>

      {/* Bandeau défilant : des faits, pas des promesses */}
      <div className="relative border-y border-white/10 bg-white/[0.02] py-3.5 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="cine-marquee gap-10 pr-10 text-[13px] text-white/60">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center gap-10" aria-hidden={k === 1}>
              {[
                "0 CHF pour publier",
                "Lien d'apporteur tracé 60 jours",
                "Tableau de bord en temps réel",
                "Commission calculée sur le prix final",
                "Paiement direct TWINT ou virement",
                "Suivi des visites sans adresse IP",
                "Courtage d'indication, art. 412 CO",
                "E-Dome ne détient jamais vos fonds",
              ].map((t) => (
                <span key={t} className="inline-flex items-center gap-2.5 whitespace-nowrap">
                  <span className="h-1 w-1 rounded-full bg-[#d9a441]" aria-hidden />{t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Carte sombre dont le halo suit le pointeur (variables CSS, sans re-rendu). */
export function CineCard({ className = "", children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={`cine-card ${className}`}
    >
      {children}
    </div>
  );
}
