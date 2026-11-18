import Link from "next/link";
import { ArrowRight, Tag, Coins, Compass, Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listing/listing-card";
import { apporteurNetChf, type MyProperty } from "@/lib/my-property";

/* ── Accueil VISITEUR (REBUILD.md §3.3) ──────────────────────────────────────

   Comprendre la promesse en cinq secondes : deux phrases, trois portes, trois
   étapes, quatre règles — et les vrais derniers biens. Aucun chiffre inventé,
   aucune « preuve sociale » fabriquée. L'unique illustration chiffrée est
   étiquetée « Exemple ». */

const EXAMPLE_PRIME = 800;

export function VisitorHome({ biens }: { biens: MyProperty[] }) {
  return (
    <div className="mx-auto max-w-6xl">
      {/* ── Promesse ─────────────────────────────────────────────────────── */}
      <section className="grid items-center gap-10 pb-14 pt-4 md:grid-cols-[1.15fr_1fr] md:pt-10">
        <div>
          <p className="eyebrow">Immobilier · Suisse romande</p>
          <h1 className="page-heading mt-3 text-[40px] sm:text-[52px]">
            Vendez sans agence.
            <br />
            <span className="text-muted-foreground">Gagnez en recommandant.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-foreground/80">
            E-Dome relie propriétaires, acheteurs et tous ceux qui connaissent quelqu&apos;un. Publier un bien est
            gratuit. Quand vous amenez le bon contact, le vendeur vous verse une <strong>prime fixe</strong>, connue
            d&apos;avance.
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <Button asChild size="lg">
              <Link href="/auth/inscription?redirect=/publier">Publier mon bien — gratuit</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/apporteurs">
                Comment gagner <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>

        {/* Illustration honnête : une prime telle qu'elle apparaît, étiquetée. */}
        <div className="relative">
          <div className="rounded-2xl border bg-card p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="eyebrow">Exemple de prime</span>
              <span className="rounded-md bg-subtle px-2 py-0.5 text-[11px] text-muted-foreground">illustration</span>
            </div>
            <p className="mt-3 text-[15px] font-semibold">Maison familiale à Pully</p>
            <p className="text-[13px] text-muted-foreground">Vente entre particuliers · prime fixée par le vendeur</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-laiton-border bg-laiton-soft p-3">
                <p className="text-[11.5px] text-laiton">Prime du vendeur</p>
                <p className="mt-0.5 text-[22px] font-semibold tabular-nums text-laiton">{EXAMPLE_PRIME} CHF</p>
              </div>
              <div className="rounded-xl border bg-background p-3">
                <p className="text-[11.5px] text-muted-foreground">Vous touchez, net</p>
                <p className="mt-0.5 text-[22px] font-semibold tabular-nums">{apporteurNetChf(EXAMPLE_PRIME)} CHF</p>
              </div>
            </div>
            <ul className="mt-4 space-y-1.5 text-[13px]">
              {[
                "Due quand le vendeur accepte votre contact",
                "Pas un pourcentage du prix, pas liée à la vente",
                "Vous ne négociez rien, ne représentez personne",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-leman" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Trois portes ─────────────────────────────────────────────────── */}
      <section aria-label="Par où commencer" className="grid gap-3 md:grid-cols-3">
        <Door
          href="/vendre"
          icon={Tag}
          title="Vendre ou louer sans agence"
          text="Publiez gratuitement, recevez les demandes, gardez la main. 0 CHF de commission à E-Dome."
        />
        <Door
          href="/apporteurs"
          icon={Coins}
          prime
          title="Recommander et gagner"
          text="Vous connaissez quelqu'un qui cherche ? Présentez-le au vendeur et touchez la prime."
        />
        <Door
          href="/explorer"
          icon={Compass}
          title="Trouver un bien"
          text="Des biens proposés directement par leurs propriétaires, sans frais d'agence."
        />
      </section>

      {/* ── Comment ça marche ────────────────────────────────────────────── */}
      <section className="mt-16">
        <h2 className="text-[22px] font-semibold tracking-[-0.02em]">Comment ça marche</h2>
        <ol className="mt-6 grid gap-6 md:grid-cols-3">
          {[
            { t: "Le vendeur publie", d: "Gratuitement. S'il le souhaite, il fixe une prime en francs pour qui lui amènera le bon contact." },
            { t: "Vous recommandez", d: "Vous présentez une personne intéressée — avec son accord. Le vendeur voit son besoin, pas encore ses coordonnées." },
            { t: "Il accepte, la prime est due", d: "Le contact est transmis, la prime est acquise. Tout est horodaté : qui a amené qui, et quand." },
          ].map((s, i) => (
            <li key={s.t} className="relative border-t pt-5">
              <span className="font-mono text-[12px] text-muted-foreground">0{i + 1}</span>
              <h3 className="mt-1 text-[16px] font-semibold">{s.t}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
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
            { t: "Publier est gratuit", d: "Aucune commission d'agence, aucun pourcentage sur votre vente." },
            { t: "Prime fixe, en francs", d: "Fixée par le vendeur, connue d'avance — jamais un % du prix." },
            { t: "Due à l'acceptation", d: "Pas conditionnée à la vente : le contact accepté suffit." },
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
