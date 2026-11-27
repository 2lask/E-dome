import { Check, Handshake, Link2, Share2, Upload } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/motion/reveal";
import { SpotlightCard } from "@/components/ui/motion/spotlight";

/* ── Comment ça marche : trois étapes reliées par un trait lumineux ──────────
   Chaque étape montre un fragment d'interface (étiqueté « exemple »), pour que
   le parcours se voie au lieu de se lire. Suit les jetons : clair et sombre. */

const STEPS = [
  {
    n: "01",
    icon: Upload,
    t: "Vous publiez",
    d: "Gratuitement : photos, vidéo, informations, et la commission que vous offrez à qui amènera l'acheteur ou le locataire.",
    gold: false,
  },
  {
    n: "02",
    icon: Share2,
    t: "Le réseau recommande",
    d: "Chacun prend son lien personnel et le partage à qui cherche. Les leads vous arrivent avec le nom de l'apporteur.",
    gold: false,
  },
  {
    n: "03",
    icon: Handshake,
    t: "Vente conclue, commission réglée",
    d: "Vous indiquez le prix final : la commission est calculée et réglée directement à l'apporteur. Tout est horodaté.",
    gold: true,
  },
] as const;

export function HowItWorks() {
  return (
    <section aria-labelledby="comment-titre" className="relative mt-20 md:mt-24">
      <div aria-hidden className="v3-dots" />
      <Reveal className="relative max-w-2xl">
        <p className="v3-eyebrow v3-eyebrow--leman">Comment ça marche</p>
        <h2 id="comment-titre" className="v3-heading mt-4 text-[30px] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[40px]">
          Trois étapes, de l&apos;annonce à la commission.
        </h2>
      </Reveal>

      <div className="relative mt-10">
        {/* Trait qui relie les étapes (visible entre les cartes, en grand écran) */}
        <div aria-hidden className="absolute left-[8%] right-[8%] top-[52px] hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
        <div aria-hidden className="v3-trace left-[8%] right-[8%] top-[52px] hidden h-px md:block" />

        <RevealGroup as="ol" className="relative grid gap-4 md:grid-cols-3 md:gap-6">
          {STEPS.map((s, i) => (
            <RevealItem as="li" key={s.n} className="h-full">
              <SpotlightCard className={`v3-card--static flex h-full flex-col p-6 ${s.gold ? "v3-card--gold" : ""}`}>
                <div className="flex items-center justify-between">
                  <span className={`v3-icon h-12 w-12 ${s.gold ? "v3-icon--gold" : ""}`}>
                    <s.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span aria-hidden className="bg-gradient-to-b from-foreground/25 to-foreground/0 bg-clip-text font-mono text-[44px] font-semibold leading-none tracking-[-0.05em] text-transparent">
                    {s.n}
                  </span>
                </div>
                <h3 className="mt-6 text-[18px] font-semibold tracking-[-0.015em]">
                  <span className="sr-only">Étape {i + 1} : </span>{s.t}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{s.d}</p>
                <div className="mt-auto pt-6">
                  <StepMock step={i} />
                </div>
              </SpotlightCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function StepMock({ step }: { step: number }) {
  const shell = "rounded-xl border bg-subtle/60 p-3 text-[12.5px]";
  if (step === 0)
    return (
      <div className={shell}>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Commission d&apos;apport</span>
          <span className="text-[10.5px]">exemple</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-md border border-laiton-border bg-laiton-soft px-2 py-1 font-semibold text-laiton">1 % du prix</span>
          <span className="ml-auto inline-flex h-5 w-9 items-center rounded-full bg-leman p-0.5" aria-hidden>
            <span className="ml-auto h-4 w-4 rounded-full bg-white shadow-sm" />
          </span>
        </div>
      </div>
    );
  if (step === 1)
    return (
      <div className={shell}>
        <div className="flex items-center gap-2 rounded-lg border bg-card px-2.5 py-1.5 font-mono text-[11.5px]">
          <Link2 className="h-3.5 w-3.5 shrink-0 text-leman" aria-hidden />
          <span className="min-w-0 truncate">…?ref=<span className="text-laiton">k7p2qx</span></span>
        </div>
        <p className="mt-2 flex items-center justify-between text-muted-foreground">
          <span>Partagé par message</span><span className="text-[10.5px]">exemple</span>
        </p>
      </div>
    );
  return (
    <div className={shell}>
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-leman text-white dark:text-[#0d1513]">
          <Check className="h-3.5 w-3.5" aria-hidden />
        </span>
        <span className="font-medium">Commission réglée à l&apos;apporteur</span>
      </div>
      <p className="mt-2 flex items-center justify-between text-muted-foreground">
        <span>Horodaté</span><span className="text-[10.5px]">exemple</span>
      </p>
    </div>
  );
}
