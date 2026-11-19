import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, Globe, Phone, Mail, MapPin, Coins, UserPlus, Inbox, Handshake } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { getAgencyBySlug } from "@/lib/supabase/agency-actions";
import { listActiveSearchesByAuthor } from "@/lib/supabase/search-actions";
import { listPublicPropertiesByHost } from "@/lib/supabase/property-actions";
import { SearchCard } from "@/components/recherches/search-card";
import { ListingCard } from "@/components/listing/listing-card";
import { ShareButton } from "@/components/listing/share-button";
import { Button } from "@/components/ui/button";
import { apporteurNetChf } from "@/lib/my-property";
import { formatNumber } from "@/lib/format";

/* ── /agences/[slug] — la page publique du programme d'une agence ────────────
   Ce que l'agence partage partout (site, signature e-mail, vitrine, WhatsApp) :
   « vous connaissez un vendeur ? voici ce qu'on vous offre ». Les récompenses
   d'abord, puis les biens avec prime, puis l'agence elle-même. */

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = await getAgencyBySlug((await params).slug);
  if (!a) return { title: "Agence introuvable" };
  return {
    title: `${a.name} — programme d'apporteurs`,
    description: `Présentez un vendeur ou un acheteur à ${a.name} (${a.city}) et touchez une récompense fixe.`,
  };
}

export default async function AgencyPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const agency = await getAgencyBySlug(slug);
  if (!agency) notFound();
  const [user, searches, listings] = await Promise.all([
    getCurrentUser(),
    listActiveSearchesByAuthor(agency.ownerId),
    listPublicPropertiesByHost(agency.ownerId),
  ]);
  const sellerSearches = searches.filter((s) => s.kind === "vendeurs");
  const primed = listings.filter((p) => p.activePrimeChf);
  const others = listings.filter((p) => !p.activePrimeChf);
  const topReward = Math.max(0, ...sellerSearches.map((s) => s.rewardChf), ...primed.map((p) => p.activePrimeChf ?? 0));
  const isOwner = user?.id === agency.ownerId;

  return (
    <div className="mx-auto max-w-6xl">
      <Link href="/agences" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Agences
      </Link>

      {isOwner && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border bg-leman-soft/60 px-4 py-3 text-[13px]">
          <p className="flex-1"><strong>C&apos;est votre page publique.</strong> Partagez-la : chaque partage recrute des apporteurs.</p>
          <Button asChild size="sm" variant="outline"><Link href="/agence">Espace agence</Link></Button>
        </div>
      )}

      <header className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <p className="eyebrow">Programme d&apos;apporteurs</p>
            <ShareButton
              path={`/agences/${agency.slug}`}
              title={`${agency.name} — programme d'apporteurs`}
              text={topReward
                ? `Vous connaissez quelqu'un qui vend ou cherche un bien vers ${agency.city} ? ${agency.name} offre jusqu'à ${formatNumber(topReward)} CHF.`
                : `Le programme d'apporteurs de ${agency.name}`}
            />
          </div>
          <h1 className="page-heading mt-2 text-[32px] sm:text-[38px]">{agency.name}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-[13.5px] text-muted-foreground">
            {agency.verified && (
              <span className="inline-flex items-center gap-1 rounded-md bg-leman-soft px-2 py-0.5 font-medium text-leman"><BadgeCheck className="h-3.5 w-3.5" aria-hidden />Agence vérifiée</span>
            )}
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" aria-hidden />{agency.zone || agency.city}</span>
          </p>
          {agency.description && <p className="mt-4 max-w-2xl whitespace-pre-line text-[15px] leading-relaxed text-foreground/85">{agency.description}</p>}
          <ul className="mt-4 flex flex-wrap gap-2 text-[13px]">
            {agency.website && <li><a href={agency.website} rel="noopener nofollow" target="_blank" className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 hover:border-foreground/25"><Globe className="h-4 w-4 text-muted-foreground" aria-hidden />Site web</a></li>}
            {agency.phone && <li><a href={`tel:${agency.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 hover:border-foreground/25"><Phone className="h-4 w-4 text-muted-foreground" aria-hidden />{agency.phone}</a></li>}
            {agency.publicEmail && <li><a href={`mailto:${agency.publicEmail}`} className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 hover:border-foreground/25"><Mail className="h-4 w-4 text-muted-foreground" aria-hidden />{agency.publicEmail}</a></li>}
          </ul>
        </div>

        <aside className="rounded-2xl border border-laiton-border bg-laiton-soft/70 p-5 lg:self-start">
          <div className="flex items-center gap-2"><Coins className="h-4 w-4 text-laiton" aria-hidden /><p className="text-[13px] font-semibold text-laiton">Jusqu&apos;à</p></div>
          <p className="mt-1 text-[32px] font-semibold tabular-nums tracking-[-0.02em] text-laiton">{topReward ? `${formatNumber(topReward)} CHF` : "—"}</p>
          <p className="text-[13px] text-muted-foreground">
            {topReward
              ? <>pour une personne présentée et acceptée. Vous touchez <strong className="text-foreground">{formatNumber(apporteurNetChf(topReward))} CHF</strong> net.</>
              : "L'agence n'a pas encore publié de récompense."}
          </p>
          {sellerSearches[0] && (
            <Button asChild variant="prime" className="mt-4 w-full">
              <Link href={user ? `/recherches/${sellerSearches[0].id}` : `/auth/inscription?redirect=${encodeURIComponent(`/recherches/${sellerSearches[0].id}`)}`}>
                <UserPlus className="h-4 w-4" aria-hidden />Présenter un vendeur
              </Link>
            </Button>
          )}
        </aside>
      </header>

      <section className="mt-10">
        <h2 className="text-[18px] font-semibold">Comment ça marche</h2>
        <ol className="mt-3 grid gap-3 sm:grid-cols-3">
          {[
            { icon: UserPlus, t: "1. Vous présentez", d: "Un voisin, un client, un proche qui vend — avec son accord." },
            { icon: Inbox, t: "2. L'agence décide", d: "Elle accepte le contact (ses coordonnées s'ouvrent alors) ou le refuse." },
            { icon: Handshake, t: "3. La récompense est due", d: "Montant fixe annoncé ici, dû à l'acceptation — pas à la vente." },
          ].map(({ icon: Icon, t, d }) => (
            <li key={t} className="rounded-2xl border bg-card p-4">
              <Icon className="h-5 w-5 text-leman" aria-hidden />
              <p className="mt-2 text-[14px] font-semibold">{t}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {sellerSearches.length > 0 && (
        <section className="mt-10">
          <h2 className="text-[18px] font-semibold">Récompenses pour un vendeur présenté</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sellerSearches.map((s) => <SearchCard key={s.id} s={s} />)}
          </div>
        </section>
      )}

      {primed.length > 0 && (
        <section className="mt-10">
          <h2 className="text-[18px] font-semibold">Biens avec prime — trouvez l&apos;acheteur ou le locataire</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {primed.map((p) => <ListingCard key={p.id} p={p} />)}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="mt-10">
          <h2 className="text-[18px] font-semibold">Les autres biens de l&apos;agence</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => <ListingCard key={p.id} p={p} />)}
          </div>
        </section>
      )}

      <p className="mt-10 text-[12px] leading-relaxed text-muted-foreground">
        Les montants sont fixés par l&apos;agence et dus à l&apos;acceptation du contact — jamais un pourcentage. E-Dome
        met en relation, ne négocie rien et ne représente personne.
        {!agency.verified && " Cette agence n'a pas encore été vérifiée par E-Dome."}
      </p>
    </div>
  );
}
