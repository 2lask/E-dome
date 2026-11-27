import Link from "next/link";
import { ArrowRight, Fingerprint, Gift, Landmark, Percent, ShieldCheck } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/motion/reveal";

/* ── Règles + appel final, sur panneau sombre ───────────────────────────────
   Quatre engagements que le produit fait respecter, puis une dernière
   invitation à agir. Panneau toujours sombre (comme le hero) : il referme la
   page en écho à son ouverture. Aucune affirmation chiffrée nouvelle. */

const RULES = [
  { icon: Gift, t: "Publier est gratuit", d: "Aucun frais d'agence. E-Dome ne se rémunère que sur la commission d'apport, si elle est versée." },
  { icon: Percent, t: "Commission connue d'avance", d: "Fixée par le vendeur, en francs ou en % du prix, affichée sur l'annonce." },
  { icon: Fingerprint, t: "Tout est tracé", d: "Lien personnel, contacts horodatés : qui a amené qui est prouvé." },
  { icon: Landmark, t: "Votre argent n'est pas chez nous", d: "E-Dome ne détient jamais les fonds de la transaction." },
];

export function HomeRules() {
  return (
    <Reveal as="section" className="cine v3-grain relative mt-24 overflow-hidden rounded-[2rem] border border-white/10 px-6 py-12 md:mt-32 md:px-12 md:py-16">
      <div aria-hidden className="cine-grid opacity-70" />
      <div aria-hidden className="v3-orb v3-orb--gold -left-20 -top-24 h-80 w-80" />
      <div aria-hidden className="v3-orb v3-orb--leman -bottom-24 right-0 h-80 w-80" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e3b85c]/60 to-transparent" />

      <div className="relative">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2daa9c]/40 bg-[#2daa9c]/15 text-[#5fd3c4] shadow-[0_0_30px_-6px_rgb(45_170_156/0.7)]">
            <ShieldCheck className="h-5 w-5" aria-hidden />
          </span>
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55">Nos engagements</p>
        </div>
        <h2 className="mt-5 max-w-2xl text-[30px] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[40px]">
          Des règles simples,<br className="hidden sm:block" /> <span className="cine-gold">tenues par le produit.</span>
        </h2>

        <RevealGroup className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {RULES.map((r) => (
            <RevealItem key={r.t} className="h-full">
              <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] transition-colors duration-300 hover:border-[#e3b85c]/35 hover:bg-white/[0.06]">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d9a441]/15 text-[#f2c66b] transition-transform duration-300 group-hover:scale-110">
                  <r.icon className="h-[18px] w-[18px]" aria-hidden />
                </span>
                <h3 className="mt-4 text-[15px] font-semibold">{r.t}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/60">{r.d}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-10 md:flex-row md:items-center">
          <div className="max-w-xl">
            <p className="text-[22px] font-semibold tracking-[-0.02em] sm:text-[26px]">Prêt à faire travailler votre réseau ?</p>
            <p className="mt-1 text-[14.5px] text-white/60">Publier est gratuit. Par défaut, la commission n&apos;est due que si la vente se conclut grâce à un apporteur.</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/auth/inscription?redirect=/publier" className="cine-btn-light v3-sheen inline-flex h-12 items-center rounded-xl px-6 text-[15px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2c66b]">
              Publier mon bien
            </Link>
            <Link href="/apporteurs" className="cine-btn-gold v3-sheen group inline-flex h-12 items-center gap-2 rounded-xl px-6 text-[15px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2c66b]">
              Devenir apporteur <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
