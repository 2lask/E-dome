import { ArrowRight, Coins, Compass, Tag } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/motion/reveal";
import { SpotlightLink } from "@/components/ui/motion/spotlight";

/* ── Trois portes : vendre, recommander, trouver ─────────────────────────────
   Trois profils, trois cartes. Celle de l'apporteur (le cœur du modèle) est
   en laiton et entourée d'une bordure lumineuse. Grande icône en filigrane,
   halo qui suit le pointeur, flèche qui avance au survol. */

type Door = {
  href: string;
  icon: typeof Tag;
  who: string;
  title: string;
  text: string;
  cta: string;
  prime?: boolean;
};

const DOORS: Door[] = [
  {
    href: "/vendre",
    icon: Tag,
    who: "Propriétaires",
    title: "Vendre ou louer",
    text: "Publiez gratuitement, proposez une commission, suivez chaque lead jusqu'à la vente.",
    cta: "Commencer",
  },
  {
    href: "/apporteurs",
    icon: Coins,
    who: "Tout le monde",
    title: "Recommander et gagner",
    text: "Vous connaissez quelqu'un qui cherche ? Partagez votre lien et touchez la commission.",
    cta: "Commencer",
    prime: true,
  },
  {
    href: "/explorer",
    icon: Compass,
    who: "Acheteurs et locataires",
    title: "Trouver un bien",
    text: "Des biens proposés directement par leurs propriétaires, sans frais d'agence.",
    cta: "Commencer",
  },
];

export function HomeDoors() {
  return (
    <section aria-labelledby="portes-titre" className="mt-24 md:mt-32">
      <Reveal className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="v3-eyebrow">Par où commencer</p>
          <h2 id="portes-titre" className="v3-heading mt-4 text-[30px] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[40px]">
            Une place pour chacun.
          </h2>
        </div>
        <p className="max-w-sm text-[14.5px] leading-relaxed text-muted-foreground">
          Vous vendez, vous connaissez quelqu&apos;un qui cherche, ou vous cherchez vous-même : choisissez votre porte.
        </p>
      </Reveal>

      <RevealGroup className="mt-10 grid gap-4 md:grid-cols-3">
        {DOORS.map((d) => (
          <RevealItem key={d.href} className="h-full">
            {d.prime ? (
              <div className="v3-beam h-full rounded-[1.3rem]">
                <DoorCard d={d} />
              </div>
            ) : (
              <DoorCard d={d} />
            )}
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

function DoorCard({ d }: { d: Door }) {
  const Icon = d.icon;
  return (
    <SpotlightLink
      href={d.href}
      className={`group flex h-full flex-col p-6 md:min-h-[280px] focus-visible:outline-2 focus-visible:outline-ring ${
        d.prime ? "v3-card--gold v3-beam__inner rounded-[1.25rem] focus-visible:-outline-offset-4" : "focus-visible:outline-offset-2"
      }`}
    >
      {/* Teinte et filigrane */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 h-40 ${
          d.prime
            ? "bg-[radial-gradient(80%_100%_at_50%_0%,var(--laiton-soft),transparent)]"
            : "bg-[radial-gradient(80%_100%_at_50%_0%,var(--leman-soft),transparent)]"
        }`}
      />
      <Icon
        aria-hidden
        className={`pointer-events-none absolute -bottom-8 -right-8 h-44 w-44 rotate-[-12deg] transition-transform duration-700 ease-out group-hover:-translate-y-1 group-hover:rotate-[-4deg] ${
          d.prime ? "text-laiton opacity-[0.07]" : "text-foreground opacity-[0.05]"
        }`}
      />

      <div className="relative flex items-center justify-between">
        <span className={`v3-icon h-12 w-12 ${d.prime ? "v3-icon--gold" : ""}`}>
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <span className={`rounded-full border px-2.5 py-1 text-[11.5px] font-medium ${d.prime ? "border-laiton-border bg-laiton-soft text-laiton" : "bg-card/60 text-muted-foreground"}`}>
          {d.who}
        </span>
      </div>
      <h3 className="relative mt-8 text-[21px] font-semibold tracking-[-0.02em]">{d.title}</h3>
      <p className="relative mt-2 flex-1 text-[14px] leading-relaxed text-muted-foreground">{d.text}</p>
      <span className={`relative mt-6 inline-flex items-center gap-2 text-[14px] font-semibold ${d.prime ? "text-laiton" : "text-leman"}`}>
        {d.cta}
        <span
          aria-hidden
          className={`flex h-7 w-7 items-center justify-center rounded-full border transition-transform duration-300 group-hover:translate-x-1 ${
            d.prime ? "border-laiton-border bg-laiton-soft" : "bg-subtle"
          }`}
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </span>
    </SpotlightLink>
  );
}
