import type { Metadata } from "next";
import { formatNumber } from "@/lib/format";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, MapPin, Maximize, BedDouble, Bath, Home, ShieldCheck, Settings2, Eye, PlayCircle, Ruler, LayoutDashboard,
  Check, Coins, CalendarDays, Building2, Sparkles, BadgeCheck, MessageSquareText,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { Gallery } from "@/components/listing/gallery";
import { ApporteurCard } from "@/components/listing/apporteur-card";
import { TrackedVideo } from "@/components/listing/tracked-video";
import { TrackView } from "@/components/listing/track";
import { commissionLabel } from "@/lib/commission";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { getPublicProperty } from "@/lib/supabase/property-actions";
import { getMyDossier } from "@/lib/supabase/dossier-actions";
import { dossierScore } from "@/lib/dossier";
import { coverOf, frDay, isDbPropertyId, repriseOf, type MyProperty } from "@/lib/my-property";
import { initialsAvatar } from "@/lib/current-user-profile";
import { InquiryForm } from "@/components/listing/inquiry-form";
import { CopilotButton } from "@/components/home/copilot-button";
import { AffordabilityCard } from "@/components/listing/affordability-card";
import { Button } from "@/components/ui/button";
import { PRICE_UNIT, TX_LABEL, chfPrice } from "@/components/listing/listing-card";
import { ShareButton } from "@/components/listing/share-button";

/* ── /explorer/[id] — la fiche d'un bien (REBUILD.md §3) ─────────────────────

   Une page de CONVERSION (Zillow, Idealista) : la galerie en tête, le titre,
   le prix une fois, les faits clés, la description — et trois actions :
   contacter, visiter, recommander. Le module « Recommander » (laiton) est la
   signature d'E-Dome : sur chaque bien à commission, n'importe qui voit ce
   qu'il toucherait en présentant le bon acheteur. Composant serveur ; seuls la
   galerie et les formulaires sont clients. */

const TYPE_LABEL: Record<string, string> = {
  appartement: "Appartement", villa: "Villa", maison: "Maison", chalet: "Chalet", studio: "Studio",
  penthouse: "Penthouse", terrain: "Terrain", commercial: "Commercial", bureau: "Bureau", riad: "Riad",
};

/* Colonnes de la bande des chiffres clés selon leur nombre : jamais de case orpheline. */
const FACT_COLS: Record<number, string> = {
  1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-1 sm:grid-cols-3", 4: "grid-cols-2 sm:grid-cols-4",
};

/** Accord singulier / pluriel : « 1 chambre », « 2 chambres ». */
const plural = (n: number, one: string, many: string) => (n > 1 ? many : one);

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

/* Compteur de vues public (à la manière d'un profil gun.lol), lu par le serveur. */
async function viewCount(id: string): Promise<number> {
  const admin = createAdminClient();
  if (!admin) return 0;
  const { count, error } = await admin.from("property_events").select("id", { count: "exact", head: true }).eq("property_id", id).eq("kind", "vue");
  return error ? 0 : count ?? 0;
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
  const [p, user, views] = await Promise.all([load(id), getCurrentUser(), isDbPropertyId(id) ? viewCount(id) : Promise.resolve(0)]);
  if (!p) notFound();
  const video = p.videos[0] ?? null;
  const pricePerM2 = p.transactionType === "vente" && p.area > 0 ? Math.round(p.price / p.area) : null;
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
  const cover = images[0];
  const sellerName = p.host ? `${p.host.firstName} ${p.host.lastName}`.trim() || "Propriétaire" : "Propriétaire";
  const sellerAvatar = p.host?.avatar || initialsAvatar(p.host?.firstName ?? "", p.host?.lastName ?? "");
  const declared = DECLARED
    .map((d) => ({ ...d, v: Number((p.analytics ?? {})[d.key] ?? 0) }))
    .filter((d) => Number.isFinite(d.v) && d.v > 0);
  const kindLabel = reprise ? "Reprise de bail" : TX_LABEL[p.transactionType];
  const hasCommission = !!(p.commission && p.activePrimeChf);
  const location = [p.address, p.city].filter(Boolean).join(", ");

  /* Chiffres clés : la valeur en grand, le libellé accordé dessous. */
  const keyFacts = [
    { icon: Home, value: TYPE_LABEL[p.type] ?? p.type, label: "Type de bien" },
    p.area > 0 ? { icon: Maximize, value: `${formatNumber(p.area)} m²`, label: "Surface" } : null,
    p.bedrooms > 0 ? { icon: BedDouble, value: formatNumber(p.bedrooms), label: plural(p.bedrooms, "chambre", "chambres") } : null,
    p.bathrooms > 0 ? { icon: Bath, value: formatNumber(p.bathrooms), label: plural(p.bathrooms, "salle d'eau", "salles d'eau") } : null,
  ].filter(Boolean) as { icon: typeof Home; value: string; label: string }[];

  return (
    <div className="mx-auto max-w-6xl">
      {/* ── Barre de tête : retour, vues, partage ─────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/explorer"
          className="group -ml-2 inline-flex h-11 items-center gap-1.5 rounded-full px-3 text-[13.5px] font-medium text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:transition-none" aria-hidden /> Explorer
        </Link>
        <div className="flex items-center gap-2">
          {views > 0 && (
            <span className="inline-flex h-9 items-center gap-1.5 rounded-full border bg-card px-3 text-[12.5px] tabular-nums text-muted-foreground" title="Vues de l'annonce">
              <Eye className="h-3.5 w-3.5" aria-hidden /> {formatNumber(views)} {plural(views, "vue", "vues")}
            </span>
          )}
          <ShareButton
            path={`/explorer/${p.id}`}
            title={p.title}
            propertyId={p.id}
            className="h-11 rounded-full px-4"
            text={`${kindLabel} à ${p.city} : ${p.title}`}
          />
        </div>
      </div>

      {isOwner && (
        <div role={justSaved ? "status" : undefined} className="mt-3 flex flex-wrap items-center gap-3 rounded-2xl border border-leman/25 bg-leman-soft/60 px-4 py-3 text-[13px]">
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
            {p.commission ? ` Commission : ${commissionLabel(p.commission)}.` : " Aucune commission : les apporteurs ne la recommandent pas encore."}
            {views > 0 ? ` ${formatNumber(views)} ${plural(views, "vue", "vues")}.` : ""}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href={`/publier?edit=${p.id}`}>Modifier</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/tableau-de-bord"><LayoutDashboard className="h-4 w-4" aria-hidden /> Statistiques</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/mes-biens"><Settings2 className="h-4 w-4" aria-hidden /> Mes biens</Link>
            </Button>
          </div>
        </div>
      )}

      <TrackView propertyId={p.id} />

      {/* ── Titre ─────────────────────────────────────────────────────────── */}
      <header className="hero-rise mt-4 md:mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-7 items-center rounded-full border bg-card px-3 text-[12.5px] font-medium">{kindLabel}</span>
          {hasCommission && p.commission ? (
            <a
              href="#recommander"
              className="inline-flex h-7 items-center gap-1.5 rounded-full border border-[#f2c66b]/70 bg-[linear-gradient(180deg,#f7e2b0,#f2c66b)] px-3 text-[12.5px] font-semibold text-[#4a3206] shadow-[0_0_22px_-4px_rgb(242_198_107/0.75)] transition-transform duration-200 hover:-translate-y-px motion-reduce:transition-none"
            >
              <Coins className="h-3.5 w-3.5" aria-hidden /> Commission {commissionLabel(p.commission)}
            </a>
          ) : null}
          {video && (
            <a href="#video" className="inline-flex h-7 items-center gap-1.5 rounded-full border bg-card px-3 text-[12.5px] font-medium hover:border-foreground/25">
              <PlayCircle className="h-3.5 w-3.5 text-leman" aria-hidden /> Visite vidéo
            </a>
          )}
        </div>
        <h1 className="mt-3 max-w-4xl text-balance text-[30px] font-semibold leading-[1.06] tracking-[-0.03em] sm:text-[40px] lg:text-[46px]">
          {p.title}
        </h1>
        {location && (
          <p className="mt-2.5 inline-flex items-center gap-1.5 text-[15px] text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 text-leman" aria-hidden />{location}
          </p>
        )}
      </header>

      {/* ── Galerie ───────────────────────────────────────────────────────── */}
      <section aria-label="Photos" className="mt-5 md:mt-7">
        <Gallery images={images} title={p.title} hasVideo={!!video} />
      </section>

      <div className="mt-8 grid gap-10 md:mt-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
        {/* ── Contenu ──────────────────────────────────────────────────── */}
        <div className="min-w-0">
          {/* Prix et chiffres clés */}
          <section aria-label="Prix et chiffres clés">
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
              <div>
                <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  {p.transactionType === "vente" ? "Prix de vente" : p.transactionType === "location-ct" ? "Prix par nuit" : "Loyer mensuel"}
                </p>
                <p className="mt-1 text-[38px] font-semibold leading-none tabular-nums tracking-[-0.035em] sm:text-[46px]">
                  {chfPrice(p.price)}
                  <span className="ml-1 text-[17px] font-normal tracking-normal text-muted-foreground">{PRICE_UNIT[p.transactionType]}</span>
                </p>
              </div>
              <p className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 pb-1 text-[13px] text-muted-foreground">
                {pricePerM2 ? (
                  <span className="inline-flex items-center gap-1.5 tabular-nums"><Ruler className="h-4 w-4" aria-hidden /> {chfPrice(pricePerM2)} / m²</span>
                ) : null}
                <span className="inline-flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-leman" aria-hidden /> Proposé par son propriétaire · sans commission d&apos;agence</span>
              </p>
            </div>

            <dl className={`mt-6 grid gap-px overflow-hidden rounded-2xl border bg-border ${FACT_COLS[keyFacts.length] ?? FACT_COLS[4]}`}>
              {keyFacts.map((f) => (
                <div key={f.label} className="flex min-w-0 flex-col gap-3 bg-card p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-subtle text-foreground/80">
                    <f.icon className="h-[17px] w-[17px]" aria-hidden />
                  </span>
                  <div className="flex min-w-0 flex-col-reverse">
                    <dt className="text-[12.5px] text-muted-foreground">{f.label}</dt>
                    <dd className="hyphens-auto break-words text-[16px] font-semibold leading-tight tabular-nums tracking-[-0.01em]">{f.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>

          {reprise && (
            <Section title="Reprise de bail" icon={CalendarDays}>
              <div className="rounded-2xl border border-leman/25 bg-leman-soft/50 p-5">
                <div className="flex flex-wrap gap-x-8 gap-y-3 text-[14.5px]">
                  {reprise.availableFrom && (
                    <p><span className="block text-[12.5px] text-muted-foreground">Libre dès le</span><strong className="text-[16px]">{frDay(reprise.availableFrom)}</strong></p>
                  )}
                  {reprise.regie && (
                    <p><span className="block text-[12.5px] text-muted-foreground">Régie</span><strong className="text-[16px]">{reprise.regie}</strong></p>
                  )}
                </div>
                <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
                  Le locataire actuel part et cherche un remplaçant. Si votre dossier convient, le bail se conclut ensuite
                  directement avec la régie, aux mêmes conditions. Écrivez-lui pour visiter.
                </p>
              </div>
            </Section>
          )}

          {p.description && (
            <Section title="À propos de ce bien">
              <p className="max-w-[68ch] whitespace-pre-line text-[15.5px] leading-[1.75] text-foreground/85">{p.description}</p>
            </Section>
          )}

          {p.amenities.length > 0 && (
            <Section title="Équipements" aside={`${p.amenities.length} ${plural(p.amenities.length, "équipement", "équipements")}`}>
              <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                {p.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-3 border-b border-dashed py-3 text-[14.5px] last:border-b-0">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leman-soft text-leman">
                      <Check className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {video && (
            <Section id="video" title="Visite en vidéo" icon={PlayCircle}>
              <div className="overflow-hidden rounded-2xl border bg-black">
                <TrackedVideo src={video} poster={cover} propertyId={p.id} />
              </div>
            </Section>
          )}

          {declared.length > 0 && (
            <Section title="Chiffres déclarés" icon={Building2}>
              <dl className="grid gap-3 sm:grid-cols-3">
                {declared.map((d) => (
                  <div key={d.key} className="rounded-2xl border bg-card p-4">
                    <dt className="text-[12.5px] text-muted-foreground">{d.label}</dt>
                    <dd className="mt-1 text-[19px] font-semibold tabular-nums tracking-[-0.01em]">{d.fmt(d.v)}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-[12.5px] text-muted-foreground">Chiffres déclarés par le propriétaire, non vérifiés par E-Dome.</p>
            </Section>
          )}

          {p.transactionType === "vente" && p.price > 0 && !isOwner && (
            <div className="mt-10 border-t pt-10">
              <AffordabilityCard price={p.price} />
            </div>
          )}

          <section className="relative mt-10 overflow-hidden rounded-2xl border bg-card p-5">
            <div aria-hidden className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--leman)_22%,transparent),transparent_70%)]" />
            <div className="relative flex flex-wrap items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-leman-soft text-leman">
                <Sparkles className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-[200px] flex-1">
                <h2 className="text-[15px] font-semibold">Une question sur ce bien ?</h2>
                <p className="mt-0.5 text-[13.5px] text-muted-foreground">Prix, quartier, financement : le copilote analyse ce bien avec vous.</p>
              </div>
              <CopilotButton
                label="Analyser avec le copilote"
                prompt={`Analyse ce bien : « ${p.title} », ${TX_LABEL[p.transactionType].toLowerCase()} à ${p.city}, ${chfPrice(p.price)}${PRICE_UNIT[p.transactionType]}${p.area ? `, ${p.area} m²` : ""}${p.bedrooms ? `, ${p.bedrooms} ${plural(p.bedrooms, "chambre", "chambres")}` : ""}. Le prix est-il cohérent pour la région, et quelles questions poser au propriétaire ?`}
              />
            </div>
          </section>

          <p className="mt-6 text-[12px] leading-relaxed text-muted-foreground">
            Annonce publiée par son propriétaire. E-Dome ne négocie aucun prix, ne signe aucun mandat et ne représente
            aucune partie.
          </p>
        </div>

        {/* ── Colonne d'action ─────────────────────────────────────────── */}
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div id="contact" className="relative scroll-mt-6 overflow-hidden rounded-[22px] border bg-card p-5 shadow-[0_30px_80px_-45px_rgb(0_0_0/0.6)]">
            <div aria-hidden className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-leman/60 to-transparent" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 text-[15px] font-semibold">
                  <MessageSquareText className="h-4 w-4 text-leman" aria-hidden /> Contacter le propriétaire
                </h2>
                <p className="mt-2 text-[24px] font-semibold leading-none tabular-nums tracking-[-0.025em]">
                  {chfPrice(p.price)}
                  <span className="text-[14px] font-normal tracking-normal text-muted-foreground">{PRICE_UNIT[p.transactionType]}</span>
                </p>
                <p className="mt-1.5 text-[12.5px] text-muted-foreground">{pricePerM2 ? `${chfPrice(pricePerM2)} / m² · ` : ""}Sans commission d&apos;agence</p>
              </div>
            </div>
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

          {hasCommission && p.commission && p.activePrimeChf && !isOwner ? (
            <div id="recommander" className="scroll-mt-6">
              <ApporteurCard propertyId={p.id} title={p.title} city={p.city} terms={p.commission} estimateChf={p.activePrimeChf} member={!!user} transactionType={p.transactionType} />
            </div>
          ) : null}

          <div className="flex items-center gap-3.5 rounded-[22px] border bg-card p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={sellerAvatar} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-border" />
            <div className="min-w-0 flex-1">
              <p className="text-[11.5px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Propriétaire</p>
              <p className="truncate text-[15px] font-semibold">{sellerName}</p>
              <p className="text-[12.5px] text-muted-foreground">Vend sans agence, en direct</p>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Mobile : l'action toujours à portée de pouce ───────────────────
          Un lien reçu par WhatsApp s'ouvre sur téléphone : le formulaire est
          en bas de page, la barre y mène en un geste. Posée au-dessus de la
          barre de navigation mobile. */}
      {!isOwner && (
        <>
          <div aria-hidden className="h-24 md:hidden" />
          <div
            className="fixed inset-x-0 z-30 border-t bg-card/90 px-4 py-2.5 shadow-[0_-12px_40px_-20px_rgb(0_0_0/0.6)] backdrop-blur-xl md:hidden"
            style={{ bottom: "calc(62px + env(safe-area-inset-bottom))" }}
          >
            <div className="flex items-center gap-2.5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[17px] font-semibold tabular-nums leading-tight tracking-[-0.01em]">
                  {chfPrice(p.price)}<span className="text-[12.5px] font-normal text-muted-foreground">{PRICE_UNIT[p.transactionType]}</span>
                </p>
                <p className="truncate text-[11.5px] text-muted-foreground">{p.city} · sans commission d&apos;agence</p>
              </div>
              {hasCommission ? (
                <a href="#recommander" className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl border border-laiton-border bg-laiton-soft px-3 text-[13px] font-semibold text-laiton">
                  <Coins className="h-4 w-4" aria-hidden /> Recommander
                </a>
              ) : null}
              <a href="#contact" className="inline-flex h-11 shrink-0 items-center rounded-xl bg-leman px-4 text-[13.5px] font-semibold text-white shadow-sm dark:text-[#0d1513]">
                Contacter
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const slug = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/* Une section de la fiche : séparateur, titre, contenu. */
function Section({
  title, icon: Icon, aside, id, children,
}: {
  title: string;
  icon?: typeof Home;
  aside?: string;
  id?: string;
  children: React.ReactNode;
}) {
  const headingId = `${id ?? slug(title)}-titre`;
  return (
    <section id={id} aria-labelledby={headingId} className="mt-10 scroll-mt-6 border-t pt-10">
      <div className="mb-5 flex items-baseline justify-between gap-3">
        <h2 id={headingId} className="flex items-center gap-2.5 text-[21px] font-semibold tracking-[-0.02em]">
          {Icon && <Icon className="h-5 w-5 text-muted-foreground" aria-hidden />}
          {title}
        </h2>
        {aside && <span className="text-[13px] text-muted-foreground">{aside}</span>}
      </div>
      {children}
    </section>
  );
}
