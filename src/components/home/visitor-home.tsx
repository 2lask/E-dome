import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { ListingCard } from "@/components/listing/listing-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/motion/reveal";
import type { MyProperty } from "@/lib/my-property";
import { CinematicHero } from "./cinematic-hero";
import { CineBento } from "./cine-bento";
import { HowItWorks } from "./how-it-works";
import { HomeDoors } from "./home-doors";
import { HomeRules } from "./home-rules";

/* ── Accueil VISITEUR ────────────────────────────────────────────────────────

   Comprendre la promesse en cinq secondes : l'apport d'affaires. Un bien mis
   en valeur, un réseau qui le recommande avec des liens tracés, une vente
   suivie en direct, une commission calculée. Aucun chiffre de traction
   inventé : l'aperçu du produit est étiqueté « illustration ».

   Rythme : hero sombre → parcours (bento sombre, fondu vers la page) →
   étapes → portes → biens réels → engagements (panneau sombre, en écho au
   hero) → pied de page. */

export function VisitorHome({ biens }: { biens: MyProperty[] }) {
  return (
    <div className="mx-auto max-w-6xl">
      <CinematicHero />
      <CineBento />
      <HowItWorks />
      <HomeDoors />

      {/* ── Derniers biens RÉELS ─────────────────────────────────────────── */}
      <section aria-labelledby="biens-titre" className="mt-24 md:mt-32">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="v3-eyebrow v3-eyebrow--leman">En ligne</p>
            <h2 id="biens-titre" className="v3-heading mt-4 text-[30px] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[40px]">
              Derniers biens publiés
            </h2>
          </div>
          {biens.length > 0 && (
            <Link
              href="/explorer"
              className="group inline-flex min-h-11 items-center gap-2 rounded-full border bg-card px-4 text-[13.5px] font-medium text-leman shadow-xs transition-colors hover:border-leman/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Tout explorer <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          )}
        </Reveal>
        {biens.length > 0 ? (
          <RevealGroup className="mt-8 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {biens.map((p, i) => (
              <RevealItem key={p.id}>
                <ListingCard p={p} priority={i < 3} />
              </RevealItem>
            ))}
          </RevealGroup>
        ) : (
          <Reveal className="relative mt-8 overflow-hidden rounded-3xl border border-dashed bg-card px-6 py-14 text-center">
            <div aria-hidden className="v3-dots" />
            <div className="relative">
              <span className="v3-icon mx-auto h-12 w-12"><Plus className="h-5 w-5" aria-hidden /></span>
              <p className="mt-4 text-[17px] font-semibold">E-Dome ouvre ses portes.</p>
              <p className="mx-auto mt-1 max-w-md text-[14px] text-muted-foreground">
                Les premiers biens arrivent. Publiez le vôtre et soyez parmi les premiers visibles.
              </p>
              <Link
                href="/auth/inscription?redirect=/publier"
                className="v3-sheen mt-6 inline-flex h-11 items-center rounded-xl bg-primary px-5 text-[14px] font-semibold text-primary-foreground shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Publier un bien
              </Link>
            </div>
          </Reveal>
        )}
      </section>

      <HomeRules />

      <footer className="mt-16 flex flex-wrap gap-x-5 gap-y-1 border-t pt-6 text-[12.5px] text-muted-foreground">
        {[
          ["/ville/neuchatel", "Logement à Neuchâtel"],
          ["/ville/lausanne", "Logement à Lausanne"],
          ["/a-propos", "Comment fonctionne E-Dome"],
          ["/tarifs", "Tarifs"],
          ["/aide", "Aide"],
          ["/conditions", "Conditions"],
          ["/confidentialite", "Confidentialité"],
          ["/contact", "Contact"],
        ].map(([href, label]) => (
          <Link key={href} href={href} className="inline-flex min-h-11 items-center transition-colors hover:text-foreground sm:min-h-0 sm:py-1">
            {label}
          </Link>
        ))}
        <span className="inline-flex min-h-11 items-center sm:ml-auto sm:min-h-0 sm:py-1">© {new Date().getFullYear()} E-Dome</span>
      </footer>
    </div>
  );
}
