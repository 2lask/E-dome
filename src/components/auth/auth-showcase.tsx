"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, Coins, Link2, MapPin, Sparkles } from "lucide-react";

/* ── Aperçu du produit (panneau de l'authentification) ───────────────────────
   Une ILLUSTRATION, annoncée comme telle : un bien d'exemple, son lien tracé
   et le parcours jusqu'à la vente. Aucun montant ni compteur inventé — seule
   la répartition 88 % / 12 % est réelle (règle de la plateforme). Animations
   limitées à transform et opacity ; tout s'immobilise si l'on préfère un
   mouvement réduit. */

const STEPS = ["Lien partagé", "Visite", "Lead", "Vente"];

export function AuthShowcase() {
  const reduce = useReducedMotion();
  const enter = (delay: number) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] as const } };

  return (
    <div className="relative mx-auto w-full max-w-[520px]" aria-label="Illustration du parcours d'un apporteur" role="img">
      {/* Carte principale */}
      <motion.div {...enter(0.15)} className="cine-glass relative rounded-[22px] p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/70">
            <Sparkles className="h-3 w-3 text-[#e3b85c]" aria-hidden /> Illustration
          </span>
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
          </span>
        </div>

        <div className="flex gap-4">
          {/* « Photo » du bien : un paysage lacustre dessiné, pas une image réelle. */}
          <div className="relative h-[104px] w-[136px] shrink-0 overflow-hidden rounded-xl bg-[linear-gradient(180deg,#2b3f45_0%,#47606a_45%,#1f3a3c_46%,#152a2c_100%)]">
            <div className="absolute left-5 top-4 h-6 w-6 rounded-full bg-[#f2d48a]/80 blur-[1px]" />
            <svg viewBox="0 0 136 104" className="absolute inset-0 h-full w-full" aria-hidden>
              <path d="M0 52 L28 30 L46 42 L70 22 L98 44 L118 34 L136 46 L136 52 Z" fill="#33484c" />
              <path d="M38 104 V70 l26 -16 l26 16 V104 Z" fill="#e9dfcb" opacity="0.92" />
              <path d="M34 72 l30 -20 l30 20" fill="none" stroke="#b07a1a" strokeWidth="3" strokeLinecap="round" />
              <rect x="50" y="80" width="10" height="12" rx="1.5" fill="#1d2b2c" />
              <rect x="68" y="80" width="10" height="12" rx="1.5" fill="#f0c977" opacity="0.85" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10.5px] font-medium uppercase tracking-[0.12em] text-white/45">Bien d&apos;exemple</p>
            <p className="mt-1 truncate text-[15px] font-semibold text-white">Attique avec terrasse</p>
            <p className="mt-0.5 flex items-center gap-1 text-[12.5px] text-white/55">
              <MapPin className="h-3 w-3" aria-hidden /> Neuchâtel
            </p>
            <p className="mt-2.5 flex w-fit max-w-full items-center gap-1.5 rounded-lg border border-[rgb(227_184_92/0.45)] bg-[rgb(227_184_92/0.14)] px-2 py-1 text-[12px] font-semibold text-[#f6d796]">
              <Coins className="h-3.5 w-3.5" aria-hidden /> Commission d&apos;apport proposée
            </p>
          </div>
        </div>

        {/* Lien tracé */}
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2.5">
          <Link2 className="h-3.5 w-3.5 shrink-0 text-[#63bdb2]" aria-hidden />
          <span className="truncate font-mono text-[12px] text-white/70">
            …/explorer/attique<span className="text-[#f0c977]">?ref=votre-code</span>
          </span>
          <span className="ml-auto shrink-0 rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/80">Votre lien</span>
        </div>

        {/* Parcours */}
        <ol className="mt-4 grid grid-cols-4 gap-2">
          {STEPS.map((s, i) => {
            const done = i < 3;
            return (
              <li key={s} className="relative">
                <motion.span
                  className={done ? "block h-1 origin-left rounded-full bg-[#63bdb2]" : "block h-1 origin-left rounded-full bg-gradient-to-r from-[#e3b85c] to-[#f6d796]"}
                  {...(reduce ? {} : { initial: { scaleX: 0 }, animate: { scaleX: 1 }, transition: { duration: 0.6, delay: 0.5 + i * 0.25, ease: "easeOut" } })}
                />
                <span className={done ? "mt-2 flex items-center gap-1 text-[11.5px] text-white/70" : "mt-2 flex items-center gap-1 text-[11.5px] font-semibold text-[#f6d796]"}>
                  {done && <Check className="h-3 w-3 text-[#63bdb2]" aria-hidden />}
                  {s}
                </span>
              </li>
            );
          })}
        </ol>

        {/* Répartition réelle de la commission */}
        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="flex items-center justify-between text-[11.5px]">
            <span className="font-medium text-white/80">À la vente, la commission se partage</span>
          </div>
          <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-white/10">
            <span className="h-full w-[88%] bg-gradient-to-r from-[#d9a441] to-[#f6d796]" />
            <span className="h-full w-[12%] bg-white/35" />
          </div>
          <div className="mt-1.5 flex justify-between text-[11px] text-white/55">
            <span><strong className="font-semibold text-[#f6d796]">88 %</strong> pour l&apos;apporteur</span>
            <span><strong className="font-semibold text-white/80">12 %</strong> E-Dome</span>
          </div>
        </div>
      </motion.div>

      {/* Notification flottante, elle aussi illustrative. */}
      <motion.div
        {...(reduce
          ? {}
          : {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: [0, -6, 0] },
              transition: { opacity: { duration: 0.6, delay: 1.4 }, y: { duration: 6, delay: 1.4, repeat: Infinity, ease: "easeInOut" } },
            })}
        className="absolute -right-4 -top-7 hidden items-center gap-2.5 rounded-2xl border border-white/12 bg-[#14120e]/90 px-3.5 py-2.5 shadow-[0_20px_50px_-15px_rgb(0_0_0/0.8)] backdrop-blur xl:flex"
      >
        <span className="relative flex h-2 w-2">
          <span className="live-dot absolute inline-flex h-full w-full rounded-full bg-[#63bdb2]" />
        </span>
        <span className="text-[12px] text-white/85">
          Exemple : <strong className="font-semibold text-white">un lead arrive par votre lien</strong>
        </span>
      </motion.div>
    </div>
  );
}
