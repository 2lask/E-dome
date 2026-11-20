import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { KeyRound, Radar, Truck, Building2, BadgeCheck, ArrowRight, Coins } from "lucide-react";
import { listPublicProperties } from "@/lib/supabase/property-actions";
import { listPublicSearches } from "@/lib/supabase/search-actions";
import { listAgencies } from "@/lib/supabase/agency-actions";
import { ListingCard } from "@/components/listing/listing-card";
import { SearchCard } from "@/components/recherches/search-card";
import { ShareButton } from "@/components/listing/share-button";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/format";
import { repriseOf } from "@/lib/my-property";
import { CITIES, cityBySlug, inCity } from "@/lib/villes";

/* ── /ville/[slug] — tout l'immobilier d'une ville de lancement ──────────────
   Une page à trouver (« logement Neuchâtel ») et à partager dans les groupes
   locaux. Vide au début ? Elle le dit et propose d'être le premier : une
   recherche à récompense se publie en deux minutes et remplit la page. */

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = cityBySlug((await params).slug);
  if (!c) return { title: "Ville introuvable" };
  return {
    title: `Logement à ${c.name} : appartements, reprises de bail, récompenses`,
    description: `Appartements à louer et à vendre à ${c.name} et environs, reprises de bail, et recherches de logement avec récompense. Votre réseau vous rapporte.`,
    alternates: { canonical: `/ville/${c.slug}` },
  };
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const city = cityBySlug((await params).slug);
  if (!city) notFound();

  const [props, { searches }, { agencies }] = await Promise.all([
    listPublicProperties(200),
    listPublicSearches(),
    listAgencies(),
  ]);
  const here = props.filter((p) => inCity(p.city, city));
  const reprises = here.filter((p) => repriseOf(p));
  const rentals = here.filter((p) => p.transactionType === "location-lt" && !repriseOf(p));
  const sales = here.filter((p) => p.transactionType === "vente");
  const localSearches = searches.filter((s) => inCity(s.city, city));
  const localAgencies = agencies.filter((a) => inCity(`${a.city} ${a.zone}`, city));
  const rewards = localSearches.reduce((t, s) => t + s.rewardChf, 0) + here.reduce((t, p) => t + (p.activePrimeChf ?? 0), 0);
  const empty = here.length === 0 && localSearches.length === 0;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-start justify-between gap-3">
        <p className="eyebrow">{city.name} · {city.canton}</p>
        <ShareButton path={`/ville/${city.slug}`} title={`Logement à ${city.name} — E-Dome`}
          text={`Logements, reprises de bail et recherches avec récompense à ${city.name}`} />
      </div>
      <h1 className="page-heading mt-1.5 text-[32px] sm:text-[40px]">L&apos;immobilier à {city.name}, par votre réseau</h1>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
        Appartements à louer et à vendre, baux à reprendre, et des gens qui récompensent qui leur trouve un logement —
        à {city.name} et dans les communes voisines.
      </p>

      {!empty && <ul className="mt-6 flex flex-wrap gap-2 text-[13px]">
        <Stat n={here.length} label="annonces" />
        <Stat n={reprises.length} label="reprises de bail" />
        <Stat n={localSearches.length} label="recherches à récompense" />
        {rewards > 0 && <li className="chip-prime rounded-lg px-3 py-1.5 font-medium tabular-nums">{formatNumber(rewards)} CHF de récompenses offertes</li>}
      </ul>}

      {empty && (
        <section className="mt-8 rounded-2xl border border-dashed bg-card p-6 sm:p-8">
          <h2 className="text-[18px] font-semibold">Soyez parmi les premiers à {city.name}</h2>
          <p className="mt-1 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
            E-Dome démarre ici. Publiez ce que vous cherchez avec une récompense : tout votre entourage peut vous aider, et
            celui qui trouve est payé.
          </p>
        </section>
      )}

      <section className="mt-8 grid gap-3 sm:grid-cols-3">
        <Door href="/recherches/nouvelle" icon={Radar} title="Je cherche un logement" text="Publiez votre recherche avec une récompense." prime />
        <Door href="/publier?mode=reprise" icon={KeyRound} title="Je remets mon bail" text="Trouvez votre remplaçant plus vite." />
        <Door href={`/demenagement?depuis=${encodeURIComponent(city.name)}`} icon={Truck} title="Je déménage" text="Nettoyage de fin de bail, déménageurs : devis gratuits." />
      </section>

      {localSearches.length > 0 && (
        <Block title={`Ils cherchent à ${city.name} — et récompensent`} hint="Vous connaissez un logement qui se libère ? Proposez-le et touchez la récompense." href="/recherches">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{localSearches.slice(0, 6).map((s) => <SearchCard key={s.id} s={s} />)}</div>
        </Block>
      )}
      {reprises.length > 0 && (
        <Block title="Baux à reprendre" hint="Des locataires partent et cherchent leur remplaçant." href="/explorer">
          <Grid items={reprises} />
        </Block>
      )}
      {rentals.length > 0 && <Block title={`À louer à ${city.name}`} href="/explorer"><Grid items={rentals} /></Block>}
      {sales.length > 0 && <Block title={`À vendre à ${city.name}`} href="/explorer"><Grid items={sales} /></Block>}

      {localAgencies.length > 0 && (
        <Block title={`Agences de la région qui récompensent les apporteurs`} href="/agences">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {localAgencies.map((a) => (
              <li key={a.id}>
                <Link href={`/agences/${a.slug}`} className="flex items-center gap-3 rounded-2xl border bg-card p-4 hover:border-foreground/20">
                  <Building2 className="h-5 w-5 text-leman" aria-hidden />
                  <span className="flex-1 text-[14px] font-medium">{a.name}</span>
                  {a.verified && <BadgeCheck className="h-4 w-4 text-leman" aria-label="Agence vérifiée" />}
                </Link>
              </li>
            ))}
          </ul>
        </Block>
      )}

      <section className="mt-12 flex flex-wrap items-center gap-4 rounded-2xl bg-ink p-6 text-paper dark:bg-card dark:text-foreground md:p-8">
        <Coins className="h-6 w-6 text-[#e3b85c]" aria-hidden />
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
