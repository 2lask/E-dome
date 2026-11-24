import Link from "next/link";
import { ArrowRight, Tag, Coins, Compass, Check, ShieldCheck, Eye, Inbox, Handshake, PlayCircle, Link2, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listing/listing-card";
import { apporteurNetChf, type MyProperty } from "@/lib/my-property";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/* ── Accueil VISITEUR ────────────────────────────────────────────────────────

   Comprendre la promesse en cinq secondes : l'apport d'affaires. Un bien mis
   en valeur, un réseau qui le recommande avec des liens tracés, une vente
   suivie en direct, une commission calculée. Aucun chiffre de traction
   inventé : l'aperçu du produit est étiqueté « illustration ». */

const EXAMPLE = { price: 1_250_000, rate: 1 };

export function VisitorHome({ biens }: { biens: MyProperty[] }) {
  const gross = (EXAMPLE.price * EXAMPLE.rate) / 100;
  return (
    <div className="mx-auto max-w-6xl">
      {/* ── Promesse ─────────────────────────────────────────────────────── */}
      <section className="grid items-center gap-10 pb-14 pt-4 md:grid-cols-[1.1fr_1fr] md:pt-10">
        <div className="hero-rise">
          <p className="eyebrow">Immobilier · Suisse romande</p>
          <h1 className="page-heading mt-3 text-[40px] sm:text-[54px]">
            Votre bien, recommandé
            <br />
            <span className="text-laiton">par tout un réseau.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-foreground/80">
            Publiez gratuitement avec photos et vidéo, proposez une commission d&apos;apport. Chacun peut recommander
            votre bien avec son lien personnel : visites, contacts et vente sont suivis en temps réel, et la commission
            se calcule toute seule.
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <Button asChild size="lg">
              <Link href="/auth/inscription?redirect=/publier">Publier mon bien — gratuit</Link>
            </Button>
            <Button asChild size="lg" variant="prime">
              <Link href="/apporteurs">
                Gagner en recommandant <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-muted-foreground">
            {["0 CHF pour publier", "Aucun frais d'agence", "Neuchâtel · Vaud"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-leman" aria-hidden />{t}</span>
            ))}
          </p>
        </div>

        {/* Aperçu du produit, étiqueté : ce que voit un vendeur. */}
        <div className="relative">
          <div aria-hidden className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-[radial-gradient(60%_60%_at_70%_20%,rgb(176_122_26/0.16),transparent_70%),radial-gradient(50%_50%_at_20%_90%,rgb(11_93_87/0.14),transparent_70%)]" />
          <div className="relative rounded-2xl border bg-card p-5 shadow-lg">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-[13px] font-semibold">Villa à Corcelles · tableau de bord</span>
              <span className="shrink-0 rounded-md bg-subtle px-2 py-0.5 text-[11px] text-muted-foreground">illustration</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2.5">
              {[
                { l: "Vues", v: "1'284" },
                { l: "Leads", v: "23" },
                { l: "Via apporteurs", v: "61 %" },
              ].map((k) => (
                <div key={k.l} className="rounded-xl border bg-background p-3">
                  <p className="truncate text-[11px] text-muted-foreground">{k.l}</p>
                  <p className="mt-0.5 text-[19px] font-semibold tabular-nums">{k.v}</p>
                </div>
              ))}
            </div>
            <ul className="mt-4 space-y-1.5" aria-label="Activité en direct (exemple)">
              {[
                { icon: Eye, t: "Nouvelle visite via le lien de Sarah", tone: "leman" },
                { icon: Inbox, t: "Nouveau lead · apporté par Marc", tone: "laiton" },
                { icon: Handshake, t: "Vente conclue · commission calculée", tone: "laiton" },
              ].map((it, i) => (
                <li key={it.t} className="live-in flex items-center gap-2.5 rounded-lg px-1 py-1 text-[13px]" style={{ animationDelay: `${300 + i * 350}ms` }}>
                  <span className={it.tone === "leman" ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leman-soft text-leman" : "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-laiton-soft text-laiton"}>
                    <it.icon className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1 truncate">{it.t}</span>
                  {i === 0 && <span className="live-dot h-1.5 w-1.5 rounded-full bg-leman" aria-hidden />}
                </li>
              ))}
            </ul>
            <div className="mt-4 grid grid-cols-2 gap-2.5 border-t pt-4">
              <div className="rounded-xl border border-laiton-border bg-laiton-soft p-3">
                <p className="truncate text-[11px] text-laiton">Commission {EXAMPLE.rate} % du prix</p>
                <p className="mt-0.5 text-[20px] font-semibold tabular-nums text-laiton">{formatNumber(gross)} CHF</p>
              </div>
              <div className="rounded-xl border bg-background p-3">
                <p className="truncate text-[11px] text-muted-foreground">L&apos;apporteur touche, net</p>
                <p className="mt-0.5 text-[20px] font-semibold tabular-nums">{formatNumber(apporteurNetChf(gross))} CHF</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ce que fait E-Dome (bento) ───────────────────────────────────── */}
      <section aria-label="Ce que fait E-Dome" className="grid gap-3 md:grid-cols-6">
        <Feature className="md:col-span-4" icon={PlayCircle} title="Une annonce qui donne envie"
          text="Grand visuel ou vidéo en fond, galerie plein écran, chiffres clés, carte. Votre bien présenté comme il le mérite, sur mobile d'abord." />
        <Feature className="md:col-span-2" prime icon={Link2} title="Un lien tracé par apporteur"
          text="Chaque recommandation porte son lien : qui a amené qui est prouvé, pendant 60 jours." />
        <Feature className="md:col-span-2" icon={Activity} title="Tout en temps réel"
          text="Vues, visiteurs, leads, conversion : votre tableau de bord bouge à l'instant." />
        <Feature className="md:col-span-4" prime icon={Coins} title="Une commission calculée, suivie jusqu'au paiement"
          text="Fixe ou en % du prix, fixée par vous. À la vente, le montant est calculé sur le prix final, le règlement est créé et suivi jusqu'à sa confirmation." />
      </section>

      {/* ── Comment ça marche ────────────────────────────────────────────── */}
      <section className="mt-16">
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

function Feature({ icon: Icon, title, text, prime = false, className }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
  prime?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl border p-6 transition-[border-color,box-shadow] duration-300 hover:shadow-md",
      prime ? "border-laiton-border bg-gradient-to-br from-laiton-soft via-laiton-soft/50 to-card" : "bg-card hover:border-foreground/15",
      className,
    )}>
      <span className={prime
        ? "flex h-10 w-10 items-center justify-center rounded-xl border border-laiton-border bg-card/70 text-laiton"
        : "flex h-10 w-10 items-center justify-center rounded-xl bg-leman-soft text-leman"}>
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <h3 className="mt-4 text-[17px] font-semibold tracking-[-0.01em]">{title}</h3>
      <p className="mt-1.5 max-w-xl text-[14px] leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}
