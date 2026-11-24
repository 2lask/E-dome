import Link from "next/link";
import { ArrowRight, Tag, Coins, Compass, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listing/listing-card";
import type { MyProperty } from "@/lib/my-property";
import { CinematicHero } from "./cinematic-hero";
import { CineBento } from "./cine-bento";

/* ── Accueil VISITEUR ────────────────────────────────────────────────────────

   Comprendre la promesse en cinq secondes : l'apport d'affaires. Un bien mis
   en valeur, un réseau qui le recommande avec des liens tracés, une vente
   suivie en direct, une commission calculée. Aucun chiffre de traction
   inventé : l'aperçu du produit est étiqueté « illustration ». */

export function VisitorHome({ biens }: { biens: MyProperty[] }) {
  return (
    <div className="mx-auto max-w-6xl">
      <CinematicHero />
      <CineBento />

      {/* ── Comment ça marche ────────────────────────────────────────────── */}
      <section className="mt-14">
        <h2 className="text-[22px] font-semibold tracking-[-0.02em]">Comment ça marche</h2>
        <ol className="mt-6 grid gap-6 md:grid-cols-3">
          {[
            { t: "Vous publiez", d: "Gratuitement : photos, vidéo, informations, et la commission que vous offrez à qui amènera l'acheteur ou le locataire." },
            { t: "Le réseau recommande", d: "Chacun prend son lien personnel et le partage à qui cherche. Les leads vous arrivent avec le nom de l'apporteur." },
            { t: "Vente conclue, commission réglée", d: "Vous indiquez le prix final : la commission est calculée et réglée directement à l'apporteur. Tout est horodaté." },
          ].map((s, i) => (
            <li key={s.t} className="relative border-t pt-5">
              <span className="font-mono text-[12px] text-muted-foreground">0{i + 1}</span>
              <h3 className="mt-1 text-[16px] font-semibold">{s.t}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Trois portes ─────────────────────────────────────────────────── */}
      <section aria-label="Par où commencer" className="mt-14 grid gap-3 md:grid-cols-3">
        <Door href="/vendre" icon={Tag} title="Vendre ou louer"
          text="Publiez gratuitement, proposez une commission, suivez chaque lead jusqu'à la vente." />
        <Door href="/apporteurs" icon={Coins} prime title="Recommander et gagner"
          text="Vous connaissez quelqu'un qui cherche ? Partagez votre lien et touchez la commission." />
        <Door href="/explorer" icon={Compass} title="Trouver un bien"
          text="Des biens proposés directement par leurs propriétaires, sans frais d'agence." />
      </section>

      {/* ── Derniers biens RÉELS ─────────────────────────────────────────── */}
      <section className="mt-16">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-[22px] font-semibold tracking-[-0.02em]">Derniers biens publiés</h2>
          {biens.length > 0 && (
            <Link href="/explorer" className="inline-flex items-center gap-1 text-[13.5px] font-medium text-leman hover:underline">
              Tout explorer <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          )}
        </div>
        {biens.length > 0 ? (
          <div className="mt-5 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {biens.map((p, i) => (
              <ListingCard key={p.id} p={p} priority={i < 3} />
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed bg-card px-6 py-10 text-center">
            <p className="text-[15px] font-medium">E-Dome ouvre ses portes.</p>
            <p className="mx-auto mt-1 max-w-md text-[13.5px] text-muted-foreground">
              Les premiers biens arrivent. Publiez le vôtre et soyez parmi les premiers visibles.
            </p>
            <Button asChild className="mt-4">
              <Link href="/auth/inscription?redirect=/publier">Publier un bien</Link>
            </Button>
          </div>
        )}
      </section>

      {/* ── Règles ───────────────────────────────────────────────────────── */}
      <section className="mt-16 rounded-2xl border bg-card p-6 md:p-8">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-leman" aria-hidden />
          <h2 className="text-[18px] font-semibold tracking-[-0.015em]">Des règles simples, tenues par le produit</h2>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { t: "Publier est gratuit", d: "Aucun frais d'agence. E-Dome ne se rémunère que sur la commission d'apport, si elle est versée." },
            { t: "Commission connue d'avance", d: "Fixée par le vendeur, en francs ou en % du prix, affichée sur l'annonce." },
            { t: "Tout est tracé", d: "Lien personnel, contacts horodatés : qui a amené qui est prouvé." },
            { t: "Votre argent n'est pas chez nous", d: "E-Dome ne détient jamais les fonds de la transaction." },
          ].map((r) => (
            <div key={r.t}>
              <p className="text-[14px] font-semibold">{r.t}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{r.d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-14 flex flex-wrap gap-x-5 gap-y-2 border-t pt-6 text-[12.5px] text-muted-foreground">
        <Link href="/ville/neuchatel" className="hover:text-foreground">Logement à Neuchâtel</Link>
        <Link href="/ville/lausanne" className="hover:text-foreground">Logement à Lausanne</Link>
        <Link href="/a-propos" className="hover:text-foreground">Comment fonctionne E-Dome</Link>
        <Link href="/tarifs" className="hover:text-foreground">Tarifs</Link>
        <Link href="/aide" className="hover:text-foreground">Aide</Link>
        <Link href="/conditions" className="hover:text-foreground">Conditions</Link>
        <Link href="/confidentialite" className="hover:text-foreground">Confidentialité</Link>
        <Link href="/contact" className="hover:text-foreground">Contact</Link>
        <span className="ml-auto">© {new Date().getFullYear()} E-Dome</span>
      </footer>
    </div>
  );
}

function Door({
  href,
  icon: Icon,
  title,
  text,
  prime = false,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
  prime?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border bg-card p-5 shadow-xs transition-[border-color,box-shadow] hover:border-foreground/20 hover:shadow-md"
    >
      <span
        className={
          prime
            ? "flex h-10 w-10 items-center justify-center rounded-xl border border-laiton-border bg-laiton-soft text-laiton"
            : "flex h-10 w-10 items-center justify-center rounded-xl bg-subtle text-foreground"
        }
      >
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-[15.5px] font-semibold">{title}</h3>
      <p className="mt-1 flex-1 text-[13.5px] leading-relaxed text-muted-foreground">{text}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-leman">
        Commencer <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}

