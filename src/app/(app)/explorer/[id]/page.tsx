import type { Metadata } from "next";
import { formatNumber } from "@/lib/format";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, MapPin, Maximize, BedDouble, Bath, Home, Coins, ShieldCheck, Settings2, Images,
} from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { getPublicProperty } from "@/lib/supabase/property-actions";
import { getMyDossier } from "@/lib/supabase/dossier-actions";
import { dossierScore } from "@/lib/dossier";
import { apporteurNetChf, coverOf, frDay, isDbPropertyId, repriseOf, type MyProperty } from "@/lib/my-property";
import { initialsAvatar } from "@/lib/current-user-profile";
import { InquiryForm } from "@/components/listing/inquiry-form";
import { CopilotButton } from "@/components/home/copilot-button";
import { Button } from "@/components/ui/button";
import { PRICE_UNIT, TX_LABEL, chfPrice } from "@/components/listing/listing-card";
import { ShareButton } from "@/components/listing/share-button";

/* ── /explorer/[id] — la fiche d'un bien (REBUILD.md §3) ─────────────────────

   Une page de CONVERSION (Zillow, Idealista) : le prix une fois, les faits
   clés, la description — et trois actions : contacter, visiter, recommander.
   Le module « Recommander · prime » (laiton) est la signature d'E-Dome : sur
   chaque bien à prime, n'importe qui voit ce qu'il toucherait en présentant le
   bon acheteur. Composant serveur ; seul le formulaire est client.

   Fini l'ancienne fiche fictive (plans par identifiant, options « champagne »,
   avis inventés, horloge de démonstration). */

const TYPE_LABEL: Record<string, string> = {
  appartement: "Appartement", villa: "Villa", maison: "Maison", chalet: "Chalet", studio: "Studio",
  penthouse: "Penthouse", terrain: "Terrain", commercial: "Commercial", bureau: "Bureau", riad: "Riad",
};

/* Données déclarées : seules les valeurs numériques renseignées (> 0) sont
   montrées — les valeurs par défaut du formulaire ne sont pas des faits. */
const DECLARED: { key: string; label: string; fmt: (v: number) => string }[] = [
  { key: "rendementBrut", label: "Rendement brut", fmt: (v) => `${formatNumber(v, v % 1 ? 1 : 0)} %` },
  { key: "chargesAnnuelles", label: "Charges annuelles", fmt: (v) => chfPrice(v) },
  { key: "tauxOccupation", label: "Taux d'occupation", fmt: (v) => `${formatNumber(v, v % 1 ? 1 : 0)} %` },
  { key: "potentielPlusValue", label: "Potentiel de plus-value", fmt: (v) => `${formatNumber(v, v % 1 ? 1 : 0)} %` },
  { key: "roi5ans", label: "Rendement à 5 ans", fmt: (v) => `${formatNumber(v, v % 1 ? 1 : 0)} %` },
  { key: "roi10ans", label: "Rendement à 10 ans", fmt: (v) => `${formatNumber(v, v % 1 ? 1 : 0)} %` },
];

async function load(id: string): Promise<MyProperty | null> {
  return isDbPropertyId(id) ? getPublicProperty(id) : null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const p = await load((await params).id);
  if (!p) return { title: "Bien introuvable" };
  return {
    title: `${p.title} — ${p.city}`,
    description: `${TX_LABEL[p.transactionType]} · ${chfPrice(p.price)}${PRICE_UNIT[p.transactionType]} · ${p.city}. ${p.description.slice(0, 140)}`,
    /* L'aperçu partagé est produit par opengraph-image.tsx (photo, prix, prime). */
  };
}

export default async function BienPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ publie?: string; modifie?: string }>;
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const [p, user] = await Promise.all([load(id), getCurrentUser()]);
  if (!p) notFound();
  const justSaved = sp.publie ? "publie" : sp.modifie ? "modifie" : null;

  const isOwner = !!user && user.id === p.hostId;
  const reprise = repriseOf(p);
  /* Location + membre (pas le propriétaire) : complétude de son dossier. */
  let dossierPct: number | null = null;
  if (user && !isOwner && p.transactionType !== "vente") {
    const { dossier, docs, ready } = await getMyDossier();
    if (ready) dossierPct = dossier.updatedAt ? dossierScore(dossier, docs).pct : 0;
  }
  const images = p.images.length > 0 ? p.images : [coverOf(p)];
  const sellerName = p.host ? `${p.host.firstName} ${p.host.lastName}`.trim() || "Propriétaire" : "Propriétaire";
  const sellerAvatar = p.host?.avatar || initialsAvatar(p.host?.firstName ?? "", p.host?.lastName ?? "");
  const declared = DECLARED
    .map((d) => ({ ...d, v: Number((p.analytics ?? {})[d.key] ?? 0) }))
    .filter((d) => Number.isFinite(d.v) && d.v > 0);
  const facts = [
    { icon: Home, label: TYPE_LABEL[p.type] ?? p.type },
    p.area > 0 ? { icon: Maximize, label: `${p.area} m²` } : null,
    p.bedrooms > 0 ? { icon: BedDouble, label: `${p.bedrooms} chambre${p.bedrooms > 1 ? "s" : ""}` } : null,
    p.bathrooms > 0 ? { icon: Bath, label: `${p.bathrooms} salle${p.bathrooms > 1 ? "s" : ""} d'eau` } : null,
  ].filter(Boolean) as { icon: typeof Home; label: string }[];
  const recommendHref = user
    ? `/apporteurs?bien=${p.id}`
    : `/auth/inscription?redirect=${encodeURIComponent(`/apporteurs?bien=${p.id}`)}`;

  return (
    <div className="mx-auto max-w-6xl">
      <Link href="/explorer" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Explorer
      </Link>

      {isOwner && (
        <div role={justSaved ? "status" : undefined} className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border bg-leman-soft/60 px-4 py-3 text-[13px]">
          <ShieldCheck className="h-4 w-4 text-leman" aria-hidden />
          <p className="flex-1">
            {justSaved === "publie" ? (
              <strong>Votre annonce est en ligne. </strong>
            ) : justSaved === "modifie" ? (
              <strong>Modifications enregistrées. </strong>
            ) : (
              <strong>C&apos;est votre annonce. </strong>
            )}
            Elle est visible de tous ; les demandes arrivent dans vos Demandes.
            {p.activePrimeChf ? ` Prime active : ${formatNumber(p.activePrimeChf)} CHF.` : " Aucune prime : les apporteurs ne la recommandent pas encore."}
          </p>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href={`/publier?edit=${p.id}`}>Modifier</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/mes-biens"><Settings2 className="h-4 w-4" aria-hidden /> Mes biens</Link>
            </Button>
          </div>
        </div>
      )}

      {/* ── Galerie ──────────────────────────────────────────────────────── */}
      <section aria-label="Photos" className="relative mt-4">
        {/* Mobile : défilement horizontal. Bureau : mise en page selon le
            nombre de photos (1 pleine largeur · 2 côte à côte · 3+ principale
            et deux vignettes), sans case vide. */}
        <div
          className={
            images.length === 1
              ? "overflow-hidden rounded-2xl"
              : images.length === 2
                ? "flex snap-x snap-mandatory gap-2 overflow-x-auto no-scrollbar md:grid md:grid-cols-2 md:overflow-hidden md:rounded-2xl"
                : "flex snap-x snap-mandatory gap-2 overflow-x-auto no-scrollbar md:grid md:h-[460px] md:grid-cols-[2fr_1fr] md:grid-rows-2 md:overflow-hidden md:rounded-2xl"
          }
        >
          {images.slice(0, images.length >= 3 ? 3 : images.length).map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src + i}
              src={src}
              alt={i === 0 ? p.title : ""}
              loading={i === 0 ? "eager" : "lazy"}
              className={
                images.length === 1
                  ? "aspect-[16/9] max-h-[520px] w-full object-cover"
                  : images.length >= 3 && i === 0
                    ? "aspect-[4/3] w-[88%] shrink-0 snap-start rounded-2xl object-cover md:row-span-2 md:aspect-auto md:h-full md:w-full md:rounded-none"
                    : images.length >= 3
                      ? "aspect-[4/3] w-[88%] shrink-0 snap-start rounded-2xl object-cover md:aspect-auto md:h-full md:w-full md:rounded-none"
                      : "aspect-[4/3] w-[88%] shrink-0 snap-start rounded-2xl object-cover md:w-full md:rounded-none"
              }
            />
          ))}
        </div>
        {images.length > 1 && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-white/92 px-2 py-1 text-[12px] font-medium text-[#15130f]">
            <Images className="h-3.5 w-3.5" aria-hidden /> {images.length} photo{images.length > 1 ? "s" : ""}
          </span>
        )}
      </section>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* ── Contenu ──────────────────────────────────────────────────── */}
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <p className="eyebrow">{reprise ? "Reprise de bail" : TX_LABEL[p.transactionType]}</p>
            <ShareButton
              path={`/explorer/${p.id}`}
              title={p.title}
              text={`${reprise ? "Reprise de bail" : TX_LABEL[p.transactionType]} à ${p.city} : ${p.title}${p.activePrimeChf ? ` — prime de ${formatNumber(p.activePrimeChf)} CHF pour qui trouve la bonne personne` : ""}`}
            />
          </div>
          <h1 className="page-heading mt-2 text-[30px] sm:text-[34px]">{p.title}</h1>
          <p className="mt-2 inline-flex items-center gap-1.5 text-[14px] text-muted-foreground">
            <MapPin className="h-4 w-4" aria-hidden />
            {[p.address, p.city].filter(Boolean).join(", ")}
          </p>

          {reprise && (
            <div className="mt-5 rounded-2xl border bg-leman-soft/50 p-4">
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
                {reprise.availableFrom && (
                  <p><span className="text-muted-foreground">Libre dès le </span><strong>{frDay(reprise.availableFrom)}</strong></p>
                )}
                {reprise.regie && (
                  <p><span className="text-muted-foreground">Régie : </span><strong>{reprise.regie}</strong></p>
                )}
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                Le locataire actuel part et cherche un remplaçant. Si votre dossier convient, le bail se conclut ensuite
                directement avec la régie, aux mêmes conditions. Écrivez-lui ci-contre pour visiter.
              </p>
            </div>
          )}

          <ul className="mt-5 flex flex-wrap gap-2">
            {facts.map((f) => (
              <li key={f.label} className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 text-[13px]">
                <f.icon className="h-4 w-4 text-muted-foreground" aria-hidden /> {f.label}
              </li>
            ))}
          </ul>

          {p.description && (
            <section className="mt-8">
              <h2 className="text-[17px] font-semibold">Description</h2>
              <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-foreground/85">{p.description}</p>
            </section>
          )}

          {p.amenities.length > 0 && (
            <section className="mt-8">
              <h2 className="text-[17px] font-semibold">Équipements</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {p.amenities.map((a) => (
                  <li key={a} className="rounded-full bg-subtle px-3 py-1 text-[13px]">{a}</li>
                ))}
              </ul>
            </section>
          )}

          {declared.length > 0 && (
            <section className="mt-8">
              <h2 className="text-[17px] font-semibold">Chiffres déclarés</h2>
              <dl className="mt-3 grid gap-3 sm:grid-cols-3">
                {declared.map((d) => (
                  <div key={d.key} className="rounded-xl border bg-card p-3">
                    <dt className="text-[12px] text-muted-foreground">{d.label}</dt>
                    <dd className="mt-0.5 text-[16px] font-semibold tabular-nums">{d.fmt(d.v)}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-[12px] text-muted-foreground">Chiffres déclarés par le propriétaire, non vérifiés par E-Dome.</p>
            </section>
          )}

          <section className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border bg-card p-4">
            <p className="flex-1 text-[13.5px] text-muted-foreground">
              Une question sur le prix, le quartier, le financement ? Le copilote analyse ce bien avec vous.
            </p>
            <CopilotButton
              label="Analyser avec le copilote"
              prompt={`Analyse ce bien : « ${p.title} », ${TX_LABEL[p.transactionType].toLowerCase()} à ${p.city}, ${chfPrice(p.price)}${PRICE_UNIT[p.transactionType]}${p.area ? `, ${p.area} m²` : ""}${p.bedrooms ? `, ${p.bedrooms} chambres` : ""}. Le prix est-il cohérent pour la région, et quelles questions poser au propriétaire ?`}
            />
          </section>

          <p className="mt-6 text-[12px] leading-relaxed text-muted-foreground">
            Annonce publiée par son propriétaire. E-Dome ne négocie aucun prix, ne signe aucun mandat et ne représente
            aucune partie.
          </p>
        </div>

        {/* ── Colonne d'action ─────────────────────────────────────────── */}
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <p className="text-[26px] font-semibold tabular-nums tracking-[-0.02em]">
              {chfPrice(p.price)}
              <span className="text-[15px] font-normal text-muted-foreground">{PRICE_UNIT[p.transactionType]}</span>
            </p>
            <p className="mt-0.5 text-[12.5px] text-muted-foreground">Sans commission d&apos;agence</p>
            <div className="my-4 h-px bg-border" />
            {isOwner ? (
              <p className="text-[13px] text-muted-foreground">
                Les visiteurs vous écrivent d&apos;ici. Retrouvez leurs messages dans{" "}
                <Link href="/demandes" className="font-medium text-leman hover:underline">Demandes</Link>.
              </p>
            ) : (
              <InquiryForm
                propertyId={p.id}
                propertyTitle={p.title}
                defaults={user ? { name: `${user.firstName} ${user.lastName}`.trim(), email: user.email ?? "" } : null}
                dossierPct={dossierPct}
              />
            )}
          </div>

          {p.activePrimeChf && !isOwner ? (
            <div className="rounded-2xl border border-laiton-border bg-laiton-soft/70 p-5">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-laiton" aria-hidden />
                <p className="text-[13px] font-semibold text-laiton">Prime pour qui recommande</p>
              </div>
              <p className="mt-2 text-[14px] leading-relaxed">
                Vous connaissez quelqu&apos;un qui cherche ce type de bien ? Le propriétaire offre{" "}
                <strong className="tabular-nums">{formatNumber(p.activePrimeChf)} CHF</strong> à qui lui présente
                le bon contact.
              </p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Vous touchez <strong className="tabular-nums text-foreground">{formatNumber(apporteurNetChf(p.activePrimeChf))} CHF</strong> net,
                dès qu&apos;il accepte le contact — pas un % du prix, pas liée à la vente.
              </p>
              <Button asChild variant="prime" className="mt-4 w-full">
                <Link href={recommendHref}>Recommander quelqu&apos;un</Link>
              </Button>
            </div>
          ) : null}

          <div className="flex items-center gap-3 rounded-2xl border bg-card p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={sellerAvatar} alt="" className="h-10 w-10 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="truncate text-[14px] font-medium">{sellerName}</p>
              <p className="text-[12.5px] text-muted-foreground">Propriétaire · vend sans agence</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
