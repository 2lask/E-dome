import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Coins, Compass, Home, MapPin, Sparkles } from "lucide-react";
import { CineBand } from "@/components/marketing/blocks";
import { Reveal } from "@/components/marketing/reveal";
import { SpotlightCard } from "@/components/marketing/spotlight-card";
import styles from "@/components/marketing/marketing.module.css";
import { listPublicProperties } from "@/lib/supabase/property-actions";
import { ListingCard } from "@/components/listing/listing-card";
import { ShareButton } from "@/components/listing/share-button";
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
        <Reveal className="mt-8">
          <section className="relative overflow-hidden rounded-3xl border border-dashed border-laiton-border bg-gradient-to-br from-laiton-soft/60 via-card to-card p-6 sm:p-8">
            <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr_auto]">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-laiton-border bg-card/60 text-laiton"><Sparkles className="h-6 w-6" aria-hidden /></span>
              <div>
                <h2 className="text-[19px] font-semibold tracking-[-0.015em]">Soyez parmi les premiers à {city.name}</h2>
                <p className="mt-1 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
                  E-Dome démarre ici. Publiez votre bien gratuitement et proposez une commission : tout le réseau peut vous amener l&apos;acheteur.
                </p>
              </div>
              <Link href="/auth/inscription?redirect=/publier" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-foreground px-5 text-[14px] font-semibold text-background hover:opacity-90">
                Publier mon bien <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </section>
        </Reveal>
      )}

      <section aria-label={`E-Dome à ${city.name}`} className="mt-8 grid gap-4 sm:grid-cols-3">
        <Door href={`/explorer?q=${encodeURIComponent(city.name)}`} icon={<Compass className="h-5 w-5" aria-hidden />} title={`Trouver à ${city.name}`} text="Les biens en direct des propriétaires." n={1} />
        <Door href="/vendre" icon={<Home className="h-5 w-5" aria-hidden />} title={`Vendre à ${city.name}`} text="Publication gratuite, réseau d'apporteurs." n={2} />
        <Door href="/apporteurs" icon={<Coins className="h-5 w-5" aria-hidden />} title="Recommander et gagner" text="Votre lien, la commission à la vente." n={3} prime />
      </section>

      {sales.length > 0 && <Block title={`À vendre à ${city.name}`} href="/explorer" count={sales.length}><Grid items={sales} /></Block>}
      {rentals.length > 0 && <Block title={`À louer à ${city.name}`} href="/explorer" count={rentals.length}><Grid items={rentals} /></Block>}

      <Reveal className="mt-16 md:mt-20">
        <CineBand>
          <div className="grid items-center gap-10 md:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="text-[12.5px] font-medium uppercase tracking-[0.18em] text-[#e3b85c]">Recommander</p>
              <h2 className="mt-3 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[36px]">
                Vous connaissez du monde à {city.name} ? <span className="cine-gold">Votre réseau vaut de l&apos;argent.</span>
              </h2>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/apporteurs" className="cine-btn-gold inline-flex h-12 items-center gap-2 rounded-xl px-6 text-[15px] font-semibold">
                  Devenir apporteur <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
            <CityRadar name={city.name} />
          </div>
        </CineBand>
      </Reveal>

      <nav aria-labelledby="autres-villes" className="mt-14">
        <h2 id="autres-villes" className="text-[13px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Autres villes</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {CITIES.filter((c) => c.slug !== city.slug).map((c) => (
            <li key={c.slug}>
              <Link href={`/ville/${c.slug}`} className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border bg-card px-4 text-[13.5px] text-muted-foreground transition-colors hover:border-laiton-border hover:text-foreground">
                <MapPin className="h-3.5 w-3.5" aria-hidden />Logement à {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return <li className="rounded-lg border border-white/15 bg-white/[0.06] px-3 py-1.5 backdrop-blur"><strong className="tabular-nums">{formatNumber(n)}</strong> {label}</li>;
}

function Door({ href, icon, title, text, n, prime = false }: { href: string; icon: React.ReactNode; title: string; text: string; n: number; prime?: boolean }) {
  return (
    <Reveal delay={(n - 1) * 0.08} className="h-full">
      <Link href={href} className="group block h-full rounded-3xl">
        <SpotlightCard gold={prime} className="flex h-full flex-col p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <span className={prime ? "flex h-11 w-11 items-center justify-center rounded-xl border border-laiton-border bg-card/60 text-laiton" : "flex h-11 w-11 items-center justify-center rounded-xl bg-leman-soft text-leman"}>{icon}</span>
            <span className="font-mono text-[11.5px] text-muted-foreground">0{n}</span>
          </div>
          <p className="mt-6 text-[17px] font-semibold tracking-[-0.015em]">{title}</p>
          <p className="mt-1 flex-1 text-[13.5px] text-muted-foreground">{text}</p>
          <span className={`mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-semibold ${prime ? "text-laiton" : "text-leman"}`}>
            Ouvrir <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden />
          </span>
        </SpotlightCard>
      </Link>
    </Reveal>
  );
}

function Block({ title, hint, href, count, children }: { title: string; hint?: string; href: string; count: number; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
        <div className="flex items-baseline gap-3">
          <h2 className="text-[24px] font-semibold tracking-[-0.025em]">{title}</h2>
          <span className="rounded-full border bg-card px-2.5 py-0.5 text-[12px] tabular-nums text-muted-foreground">{formatNumber(count)}</span>
          {hint && <p className="text-[13px] text-muted-foreground">{hint}</p>}
        </div>
        <Link href={href} className="inline-flex min-h-[44px] items-center gap-1 text-[13.5px] font-semibold text-leman hover:underline">Tout voir <ArrowRight className="h-4 w-4" aria-hidden /></Link>
      </div>
      {children}
    </section>
  );
}

function Grid({ items }: { items: Parameters<typeof ListingCard>[0]["p"][] }) {
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.slice(0, 6).map((p) => <ListingCard key={p.id} p={p} />)}</div>;
}

/* Radar décoratif : la ville au centre, des anneaux qui pulsent, des points
   qui figurent un réseau (illustration, aucune donnée). */
function CityRadar({ name }: { name: string }) {
  const dots = [
    { x: 18, y: 28, d: 0 }, { x: 78, y: 20, d: 0.6 }, { x: 86, y: 64, d: 1.2 },
    { x: 26, y: 78, d: 1.8 }, { x: 56, y: 88, d: 0.9 }, { x: 10, y: 54, d: 1.5 },
  ];
  return (
    <div aria-hidden className="relative mx-auto aspect-square w-full max-w-[300px]">
      {[100, 72, 44].map((s) => (
        <span key={s} className="absolute left-1/2 top-1/2 rounded-full border border-white/10" style={{ width: `${s}%`, height: `${s}%`, transform: "translate(-50%, -50%)" }} />
      ))}
      <span className={`absolute inset-[6%] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgb(227_184_92/0.22)_50deg,transparent_70deg)] ${styles.spin}`} style={{ animationDuration: "8s" }} />
      {dots.map((p, i) => (
        <span key={i} className="absolute h-2.5 w-2.5" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
          <span className={`absolute inset-0 rounded-full bg-[#5fd3c4]/60 ${styles.ping}`} style={{ animationDelay: `${p.d}s` }} />
          <span className="absolute inset-0 rounded-full bg-[#5fd3c4]" />
        </span>
      ))}
      <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <span className={`flex h-14 w-14 items-center justify-center rounded-full border border-[#e3b85c]/50 bg-[#1d170c] text-[#f7d488] shadow-[0_0_40px_rgb(217_164_65/0.5)] ${styles.float}`}>
          <MapPin className="h-6 w-6" />
        </span>
        <span className="mt-2 rounded-full bg-white/10 px-2.5 py-0.5 text-[12px] font-medium text-white/85">{name}</span>
      </span>
    </div>
  );
}
