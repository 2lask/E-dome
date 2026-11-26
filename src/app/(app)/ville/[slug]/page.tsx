import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Coins, Compass, Home } from "lucide-react";
import { listPublicProperties } from "@/lib/supabase/property-actions";
import { ListingCard } from "@/components/listing/listing-card";
import { ShareButton } from "@/components/listing/share-button";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/format";
import { CITIES, cityBySlug, inCity } from "@/lib/villes";

/* ── /ville/[slug] — tout l'immobilier d'une ville de lancement ──────────────
   Une page à trouver (« logement Neuchâtel ») et à partager dans les groupes
   locaux. Recentrée sur le lancement : biens à vendre et à louer, ceux avec
   commission, et trois portes (trouver, vendre, recommander). */

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = cityBySlug((await params).slug);
  if (!c) return { title: "Ville introuvable" };
  return {
    title: `Immobilier à ${c.name} : biens à vendre et à louer sans agence`,
    description: `Biens à vendre et à louer à ${c.name} et environs, en direct des propriétaires, sans frais d'agence. Recommandez un bien et touchez la commission.`,
    alternates: { canonical: `/ville/${c.slug}` },
  };
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const city = cityBySlug((await params).slug);
  if (!city) notFound();

  const props = await listPublicProperties(200);
  const here = props.filter((p) => inCity(p.city, city));
  const rentals = here.filter((p) => p.transactionType === "location-lt");
  const sales = here.filter((p) => p.transactionType === "vente");
  const withCommission = here.filter((p) => p.activePrimeChf);
  const empty = here.length === 0;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="cine relative overflow-hidden rounded-3xl border border-white/10 px-6 py-9 md:px-10 md:py-11">
        <div aria-hidden className="cine-aurora" />
        <div aria-hidden className="cine-grid" />
        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[12.5px] font-medium uppercase tracking-[0.18em] text-[#e3b85c]">{city.name} · {city.canton}</p>
            <ShareButton path={`/ville/${city.slug}`} title={`Immobilier à ${city.name} — E-Dome`}
              text={`Biens à vendre et à louer à ${city.name}, en direct des propriétaires`} />
          </div>
          <h1 className="mt-3 text-[34px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[46px]">
            L&apos;immobilier à {city.name}, <span className="cine-gold">par votre réseau.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/70">
            Des biens à vendre et à louer en direct de leurs propriétaires, sans frais d&apos;agence — à {city.name} et dans
            les communes voisines. Vous connaissez quelqu&apos;un qui cherche ? Recommandez et touchez la commission.
          </p>
          {!empty && (
            <ul className="mt-5 flex flex-wrap gap-2 text-[13px]">
              <Stat n={here.length} label={here.length > 1 ? "annonces" : "annonce"} />
              <Stat n={sales.length} label="à vendre" />
              <Stat n={rentals.length} label="à louer" />
              {withCommission.length > 0 && <li className="rounded-lg border border-[#d9a441]/40 bg-[#d9a441]/15 px-3 py-1.5 font-medium text-[#f7d488]"><strong className="tabular-nums">{withCommission.length}</strong> avec commission</li>}
            </ul>
          )}
        </div>
      </header>

      {empty && (
        <section className="mt-8 rounded-2xl border border-dashed bg-card p-6 sm:p-8">
          <h2 className="text-[18px] font-semibold">Soyez parmi les premiers à {city.name}</h2>
          <p className="mt-1 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
            E-Dome démarre ici. Publiez votre bien gratuitement et proposez une commission : tout le réseau peut vous amener l&apos;acheteur.
          </p>
        </section>
      )}

      <section className="mt-8 grid gap-3 sm:grid-cols-3">
        <Door href={`/explorer?q=${encodeURIComponent(city.name)}`} icon={Compass} title={`Trouver à ${city.name}`} text="Les biens en direct des propriétaires." />
        <Door href="/vendre" icon={Home} title={`Vendre à ${city.name}`} text="Publication gratuite, réseau d'apporteurs." />
        <Door href="/apporteurs" icon={Coins} title="Recommander et gagner" text="Votre lien, la commission à la vente." prime />
      </section>

      {sales.length > 0 && <Block title={`À vendre à ${city.name}`} href="/explorer"><Grid items={sales} /></Block>}
      {rentals.length > 0 && <Block title={`À louer à ${city.name}`} href="/explorer"><Grid items={rentals} /></Block>}

      <section className="mt-12 flex flex-wrap items-center gap-4 rounded-2xl border bg-card p-6 md:p-8">
        <Coins className="h-6 w-6 text-laiton" aria-hidden />
        <p className="flex-1 text-[15px] font-medium">Vous connaissez du monde à {city.name} ? Votre réseau vaut de l&apos;argent.</p>
        <Button asChild variant="prime"><Link href="/apporteurs">Devenir apporteur</Link></Button>
      </section>

      <nav aria-label="Autres villes" className="mt-8 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted-foreground">
        {CITIES.filter((c) => c.slug !== city.slug).map((c) => (
          <Link key={c.slug} href={`/ville/${c.slug}`} className="hover:text-foreground">Logement à {c.name}</Link>
        ))}
      </nav>
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return <li className="rounded-lg border bg-card px-3 py-1.5"><strong className="tabular-nums">{formatNumber(n)}</strong> {label}</li>;
}

function Door({ href, icon: Icon, title, text, prime = false }: { href: string; icon: React.ComponentType<{ className?: string }>; title: string; text: string; prime?: boolean }) {
  return (
    <Link href={href} className={prime ? "group rounded-2xl border border-laiton-border bg-laiton-soft/50 p-4 hover:bg-laiton-soft" : "group rounded-2xl border bg-card p-4 hover:border-foreground/20"}>
      <Icon className={prime ? "h-5 w-5 text-laiton" : "h-5 w-5 text-leman"} aria-hidden />
      <p className="mt-2 text-[14.5px] font-semibold group-hover:underline">{title}</p>
      <p className="mt-0.5 text-[13px] text-muted-foreground">{text}</p>
    </Link>
  );
}

function Block({ title, hint, href, children }: { title: string; hint?: string; href: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-[19px] font-semibold tracking-[-0.015em]">{title}</h2>
          {hint && <p className="text-[13px] text-muted-foreground">{hint}</p>}
        </div>
        <Link href={href} className="inline-flex items-center gap-1 text-[13px] font-medium text-leman hover:underline">Tout voir <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
      </div>
      {children}
    </section>
  );
}

function Grid({ items }: { items: Parameters<typeof ListingCard>[0]["p"][] }) {
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.slice(0, 6).map((p) => <ListingCard key={p.id} p={p} />)}</div>;
}
