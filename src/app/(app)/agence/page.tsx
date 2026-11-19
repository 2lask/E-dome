import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BadgeCheck, Clock3, Coins, Inbox, Building2, Radar, Plus, ArrowRight, Megaphone, Handshake, Users } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { getMyAgency, getMyAgencyStats } from "@/lib/supabase/agency-actions";
import { listMySearches } from "@/lib/supabase/search-actions";
import { AgencyForm } from "@/components/agence/agency-form";
import { ShareButton } from "@/components/listing/share-button";
import { SearchCard } from "@/components/recherches/search-card";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/format";

export const metadata: Metadata = { title: "Espace agence", robots: { index: false, follow: false } };

/* ── /agence — le programme d'apporteurs clé en main ─────────────────────────
   Les agences paient déjà des apporteurs (souvent plusieurs milliers de francs
   par mandat de vente), chacune avec un programme maison : bouche-à-oreille,
   pas de suivi, pas de lien à partager. Ici : une page publique à leur nom,
   des récompenses fixes pour chaque vendeur présenté, des primes sur leurs
   biens, et le suivi de chaque recommandation. Formule pilote gratuite. */

export default async function AgencePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/connexion?redirect=%2Fagence");
  const { agency, ready } = await getMyAgency();

  if (!agency) {
    return (
      <div className="mx-auto max-w-4xl">
        <p className="eyebrow">Espace agence</p>
        <h1 className="page-heading mt-1.5 text-[30px] sm:text-[34px]">Votre programme d&apos;apporteurs, prêt en deux minutes</h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Vous récompensez déjà ceux qui vous amènent un vendeur. Donnez-leur une page à votre nom, un montant clair et un
          suivi : chaque client, voisin ou artisan de votre région devient un apporteur.
        </p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Megaphone, t: "Une page à votre nom", d: "Vos récompenses, vos biens, votre zone — un lien à partager partout." },
            { icon: Coins, t: "Des montants fixes", d: "Vous fixez la récompense (50 à 3'000 CHF), due seulement si vous acceptez le contact." },
            { icon: Inbox, t: "Chaque recommandation suivie", d: "Horodatée, avec l'accord du vendeur ; ses coordonnées s'ouvrent quand vous acceptez." },
          ].map(({ icon: Icon, t, d }) => (
            <li key={t} className="rounded-2xl border bg-card p-4">
              <Icon className="h-5 w-5 text-leman" aria-hidden />
              <p className="mt-2 text-[14px] font-semibold">{t}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{d}</p>
            </li>
          ))}
        </ul>

        <section className="mt-8 rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-[17px] font-semibold">Créer la fiche de votre agence</h2>
          <p className="mb-5 mt-1 text-[13px] text-muted-foreground">Formule pilote : gratuite pour les premières agences. Aucun tarif ne sera facturé sans votre accord préalable.</p>
          {ready ? (
            <AgencyForm />
          ) : (
            <p role="status" className="rounded-lg bg-warning-soft px-3 py-2.5 text-[13px]">La base doit être mise à jour (migration 006) avant de créer une agence.</p>
          )}
        </section>
      </div>
    );
  }

  const [stats, mine] = await Promise.all([getMyAgencyStats(), listMySearches()]);
  const sellerSearches = mine.filter((s) => s.kind === "vendeurs" && s.active);
  const topReward = sellerSearches.reduce((m, s) => Math.max(m, s.rewardChf), 0);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Espace agence</p>
          <h1 className="page-heading mt-1.5 text-[30px]">{agency.name}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
            {agency.verified ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-leman-soft px-2 py-0.5 font-medium text-leman"><BadgeCheck className="h-3.5 w-3.5" aria-hidden />Agence vérifiée</span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md bg-subtle px-2 py-0.5"><Clock3 className="h-3.5 w-3.5" aria-hidden />{agency.uidNumber ? "Vérification en cours" : "Ajoutez votre numéro IDE pour être vérifiée"}</span>
            )}
            <span>{agency.city}</span>
            <span>· Formule {agency.plan === "pro" ? "Pro" : "pilote (gratuite)"}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ShareButton
            path={`/agences/${agency.slug}`}
            title={`Programme d'apporteurs — ${agency.name}`}
            text={topReward
              ? `Vous connaissez quelqu'un qui vend son bien dans la région de ${agency.city} ? ${agency.name} vous offre jusqu'à ${formatNumber(topReward)} CHF.`
              : `Le programme d'apporteurs de ${agency.name} sur E-Dome`}
          />
          <Button asChild size="sm" variant="outline"><Link href={`/agences/${agency.slug}`}>Voir ma page publique</Link></Button>
        </div>
      </div>

      <section className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi icon={Radar} label="Recherches de vendeurs" value={formatNumber(stats.sellerSearches)} />
        <Kpi icon={Users} label="Vendeurs présentés" value={formatNumber(stats.proposals)} sub={`${stats.pending} à décider`} />
        <Kpi icon={Handshake} label="Acceptés" value={formatNumber(stats.accepted)} sub={`${formatNumber(stats.dueChf)} CHF de récompenses`} prime />
        <Kpi icon={Building2} label="Biens en ligne" value={formatNumber(stats.listings)} sub={`${stats.primedListings} avec prime`} />
      </section>

      {stats.pending > 0 && (
        <Link href="/demandes" className="mt-4 flex items-center gap-3 rounded-xl border border-laiton-border bg-laiton-soft/60 px-4 py-3 text-[14px] hover:bg-laiton-soft">
          <Inbox className="h-4 w-4 text-laiton" aria-hidden />
          <span className="flex-1"><strong>{stats.pending} vendeur{stats.pending > 1 ? "s" : ""} présenté{stats.pending > 1 ? "s" : ""}</strong> attend{stats.pending > 1 ? "ent" : ""} votre décision.</span>
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      )}

      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-semibold">Vos récompenses pour un vendeur présenté</h2>
            <p className="text-[13px] text-muted-foreground">Une recherche par zone ou par type de bien. Elles s&apos;affichent sur votre page et dans les Recherches.</p>
          </div>
          <Button asChild variant="prime" size="sm"><Link href="/recherches/nouvelle?type=vendeurs"><Plus className="h-4 w-4" aria-hidden />Nouvelle récompense</Link></Button>
        </div>
        {sellerSearches.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed p-6 text-center">
            <p className="text-[14px] font-medium">Aucune récompense en ligne</p>
            <p className="mt-1 text-[13px] text-muted-foreground">Commencez par une : « 1&apos;500 CHF pour tout propriétaire vendeur présenté à {agency.city} ».</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sellerSearches.map((s) => <SearchCard key={s.id} s={s} />)}
          </div>
        )}
      </section>

      <section className="mt-8 grid gap-3 md:grid-cols-2">
        <Link href="/mes-biens" className="group rounded-2xl border bg-card p-5 hover:border-foreground/20">
          <Building2 className="h-5 w-5 text-leman" aria-hidden />
          <p className="mt-2 text-[15px] font-semibold group-hover:underline">Vos biens et leurs primes</p>
          <p className="mt-1 text-[13px] text-muted-foreground">Posez une prime sur un bien difficile : tout le réseau cherche l&apos;acheteur ou le locataire.</p>
        </Link>
        <Link href="/publier" className="group rounded-2xl border bg-card p-5 hover:border-foreground/20">
          <Plus className="h-5 w-5 text-leman" aria-hidden />
          <p className="mt-2 text-[15px] font-semibold group-hover:underline">Publier un bien</p>
          <p className="mt-1 text-[13px] text-muted-foreground">Il apparaît dans l&apos;Explorer et sur votre page d&apos;agence.</p>
        </Link>
      </section>

      <details className="mt-8 rounded-2xl border bg-card">
        <summary className="cursor-pointer px-5 py-4 text-[15px] font-semibold">Modifier la fiche de l&apos;agence</summary>
        <div className="border-t px-5 py-5"><AgencyForm initial={agency} /></div>
      </details>

      <p className="mt-6 text-[12px] leading-relaxed text-muted-foreground">
        Formule pilote gratuite. La formule à frais fixes (sans commission sur vos ventes) sera annoncée avant toute
        facturation, et seulement avec votre accord. E-Dome prélève 12 % (3 CHF minimum) sur chaque récompense acceptée,
        à la charge de l&apos;apporteur.
      </p>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, sub, prime = false }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; sub?: string; prime?: boolean }) {
  return (
    <div className={prime ? "rounded-2xl border border-laiton-border bg-laiton-soft/40 p-4" : "rounded-2xl border bg-card p-4"}>
      <p className="flex items-center gap-1.5 text-[12px] text-muted-foreground"><Icon className="h-3.5 w-3.5" aria-hidden />{label}</p>
      <p className={prime ? "mt-1 text-[24px] font-semibold tabular-nums text-laiton" : "mt-1 text-[24px] font-semibold tabular-nums"}>{value}</p>
      {sub && <p className="text-[11.5px] text-muted-foreground">{sub}</p>}
    </div>
  );
}
