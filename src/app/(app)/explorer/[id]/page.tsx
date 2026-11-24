import type { Metadata } from "next";
import { formatNumber } from "@/lib/format";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, MapPin, Maximize, BedDouble, Bath, Home, ShieldCheck, Settings2, Eye, PlayCircle, Ruler, LayoutDashboard,
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
  const facts = [
    { icon: Home, label: TYPE_LABEL[p.type] ?? p.type },
    p.area > 0 ? { icon: Maximize, label: `${p.area} m²` } : null,
    p.bedrooms > 0 ? { icon: BedDouble, label: `${p.bedrooms} chambre${p.bedrooms > 1 ? "s" : ""}` } : null,
    p.bathrooms > 0 ? { icon: Bath, label: `${p.bathrooms} salle${p.bathrooms > 1 ? "s" : ""} d'eau` } : null,
  ].filter(Boolean) as { icon: typeof Home; label: string }[];

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
            {p.commission ? ` Commission : ${commissionLabel(p.commission)}.` : " Aucune commission : les apporteurs ne la recommandent pas encore."}
            {views > 0 ? ` ${formatNumber(views)} vue${views > 1 ? "s" : ""}.` : ""}
          </p>
          <div className="flex gap-2">
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

      {/* ── Vitrine : vidéo ou photo en grand, l'essentiel par-dessus ─────── */}
      <section aria-label={p.title} className="relative isolate mt-4 flex min-h-[460px] flex-col justify-between overflow-hidden rounded-3xl bg-ink p-5 text-white sm:p-7 md:min-h-[560px]">
        {video ? (
          <video src={video} poster={cover} autoPlay muted loop playsInline preload="metadata" aria-hidden className="absolute inset-0 -z-20 h-full w-full object-cover" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" className="hero-zoom absolute inset-0 -z-20 h-full w-full object-cover" />
        )}
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/88 via-black/35 to-black/25" />
        <div aria-hidden className="absolute -bottom-24 -left-24 -z-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgb(227_184_92/0.28),transparent_70%)]" />

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <span className="glass-chip">{reprise ? "Reprise de bail" : TX_LABEL[p.transactionType]}</span>
            {p.commission && p.activePrimeChf ? (
              <span className="glass-chip glass-chip--gold">Commission {commissionLabel(p.commission)}</span>
            ) : null}
            {video && <span className="glass-chip"><PlayCircle className="h-3.5 w-3.5" aria-hidden /> Visite vidéo</span>}
          </div>
          <div className="flex items-center gap-2">
            {views > 0 && (
              <span className="glass-chip tabular-nums" title="Vues de l'annonce"><Eye className="h-3.5 w-3.5" aria-hidden /> {formatNumber(views)}</span>
            )}
            <ShareButton
              path={`/explorer/${p.id}`}
              title={p.title}
              propertyId={p.id}
              className="border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20"
              text={`${reprise ? "Reprise de bail" : TX_LABEL[p.transactionType]} à ${p.city} : ${p.title}`}
            />
          </div>
        </div>

        <div className="hero-rise max-w-3xl">
          <p className="inline-flex items-center gap-1.5 text-[14px] text-white/80"><MapPin className="h-4 w-4" aria-hidden />{[p.address, p.city].filter(Boolean).join(", ")}</p>
          <h1 className="mt-2 text-[30px] font-semibold leading-[1.08] tracking-[-0.025em] sm:text-[44px]">{p.title}</h1>
          <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-3">
            <p className="text-[30px] font-semibold tabular-nums tracking-[-0.02em] sm:text-[36px]">
              {chfPrice(p.price)}<span className="text-[16px] font-normal text-white/70">{PRICE_UNIT[p.transactionType]}</span>
            </p>
            <ul className="flex flex-wrap gap-2 pb-1.5">
              {facts.map((f) => (
                <li key={f.label} className="glass-chip"><f.icon className="h-3.5 w-3.5" aria-hidden /> {f.label}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* ── Contenu ──────────────────────────────────────────────────── */}
        <div className="min-w-0">
          {/* Photos */}
          <section aria-label="Photos">
            <Gallery images={images} title={p.title} />
          </section>

          {video && (
            <section className="mt-10">
              <h2 className="text-[17px] font-semibold">Visite en vidéo</h2>
              <div className="mt-3"><TrackedVideo src={video} poster={cover} propertyId={p.id} /></div>
            </section>
          )}

          {/* Chiffres clés */}
          <section className="mt-10">
            <h2 className="text-[17px] font-semibold">En bref</h2>
            <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Fact label="Type" value={TYPE_LABEL[p.type] ?? p.type} />
              {p.area > 0 && <Fact label="Surface" value={`${p.area} m²`} />}
              {p.bedrooms > 0 && <Fact label="Chambres" value={String(p.bedrooms)} />}
              {p.bathrooms > 0 && <Fact label="Salles d'eau" value={String(p.bathrooms)} />}
              {pricePerM2 && <Fact label="Prix au m²" value={chfPrice(pricePerM2)} icon={<Ruler className="h-3.5 w-3.5" aria-hidden />} />}
            </dl>
          </section>

          {reprise && (
            <div className="mt-10 rounded-2xl border bg-leman-soft/50 p-4">
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
          <div id="contact" className="scroll-mt-6 rounded-2xl border bg-card p-5 shadow-sm">
            <p className="text-[26px] font-semibold tabular-nums tracking-[-0.02em]">
              {chfPrice(p.price)}
              <span className="text-[15px] font-normal text-muted-foreground">{PRICE_UNIT[p.transactionType]}</span>
            </p>
            <p className="mt-0.5 text-[12.5px] text-muted-foreground">{pricePerM2 ? `${chfPrice(pricePerM2)} / m² · ` : ""}Sans commission d&apos;agence</p>
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

          {p.commission && p.activePrimeChf && !isOwner ? (
            <div id="recommander" className="scroll-mt-6">
              <ApporteurCard propertyId={p.id} title={p.title} city={p.city} terms={p.commission} estimateChf={p.activePrimeChf} member={!!user} transactionType={p.transactionType} />
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

      {/* ── Mobile : l'action toujours à portée de pouce ───────────────────
          Un lien reçu par WhatsApp s'ouvre sur téléphone : le formulaire est
          en bas de page, la barre y mène en un geste. Posée au-dessus de la
          barre de navigation mobile. */}
      {!isOwner && (
        <>
          <div aria-hidden className="h-20 md:hidden" />
          <div
            className="fixed inset-x-0 z-30 border-t bg-card/95 px-4 py-2.5 backdrop-blur-md md:hidden"
            style={{ bottom: "calc(62px + env(safe-area-inset-bottom))" }}
          >
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[16px] font-semibold tabular-nums leading-tight">
                  {chfPrice(p.price)}<span className="text-[12.5px] font-normal text-muted-foreground">{PRICE_UNIT[p.transactionType]}</span>
                </p>
                <p className="truncate text-[11.5px] text-muted-foreground">{p.city} · sans commission d&apos;agence</p>
              </div>
              {p.commission && p.activePrimeChf ? (
                <a href="#recommander" className="inline-flex h-10 items-center rounded-xl border border-laiton-border bg-laiton-soft px-3 text-[13px] font-semibold text-laiton">
                  Recommander
                </a>
              ) : null}
              <a href="#contact" className="inline-flex h-10 items-center rounded-xl bg-leman px-4 text-[13.5px] font-semibold text-white dark:text-[#0d1513]">
                Contacter
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Fact({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-3.5">
      <dt className="flex items-center gap-1.5 text-[12px] text-muted-foreground">{icon}{label}</dt>
      <dd className="mt-1 text-[17px] font-semibold tabular-nums tracking-[-0.01em]">{value}</dd>
    </div>
  );
}
