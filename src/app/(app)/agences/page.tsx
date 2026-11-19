import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, MapPin, ArrowRight, Building2 } from "lucide-react";
import { listAgencies } from "@/lib/supabase/agency-actions";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Agences partenaires",
  description: "Les agences qui récompensent qui leur présente un vendeur, un acheteur ou un locataire.",
};

/* ── /agences — l'annuaire des programmes d'apporteurs ───────────────────────
   Pour l'apporteur : où mon réseau peut me rapporter. Pour l'agence : être
   listée là où les apporteurs regardent. Vérifiées d'abord. */

export default async function AgencesPage() {
  const { agencies, ready } = await listAgencies();
  return (
    <div className="mx-auto max-w-6xl">
      <p className="eyebrow">Programmes d&apos;apporteurs</p>
      <h1 className="page-heading mt-1.5 text-[30px] sm:text-[34px]">Les agences qui récompensent votre réseau</h1>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
        Présentez-leur un propriétaire qui vend, un acheteur ou un locataire : chacune affiche ses montants, fixes et
        dus à l&apos;acceptation du contact.
      </p>

      {!ready ? (
        <p role="status" className="mt-8 rounded-lg bg-warning-soft px-4 py-3 text-[13px]">Les agences arrivent bientôt (base à mettre à jour).</p>
      ) : agencies.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed p-8 text-center">
          <Building2 className="mx-auto h-7 w-7 text-muted-foreground" aria-hidden />
          <p className="mt-3 text-[15px] font-medium">Aucune agence inscrite pour l&apos;instant</p>
          <p className="mt-1 text-[13px] text-muted-foreground">Les premières agences pilotes de Neuchâtel et Lausanne apparaîtront ici.</p>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agencies.map((a) => (
            <li key={a.id}>
              <Link href={`/agences/${a.slug}`} className="group flex h-full flex-col rounded-2xl border bg-card p-5 shadow-xs hover:border-foreground/20 hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[16px] font-semibold leading-snug group-hover:underline">{a.name}</p>
                  {a.verified && <BadgeCheck className="h-5 w-5 shrink-0 text-leman" aria-label="Agence vérifiée" />}
                </div>
                <p className="mt-1 inline-flex items-center gap-1 text-[13px] text-muted-foreground"><MapPin className="h-3.5 w-3.5" aria-hidden />{a.zone || a.city}</p>
                {a.description && <p className="mt-3 line-clamp-3 flex-1 text-[13.5px] leading-relaxed text-foreground/80">{a.description}</p>}
                <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-leman">Voir le programme <ArrowRight className="h-3.5 w-3.5" aria-hidden /></span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <section className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card p-6">
        <div>
          <p className="text-[16px] font-semibold">Vous êtes une agence ou une régie ?</p>
          <p className="mt-1 text-[13.5px] text-muted-foreground">Votre programme d&apos;apporteurs en deux minutes. Formule pilote gratuite.</p>
        </div>
        <Button asChild variant="accent"><Link href="/agence">Créer le programme de mon agence</Link></Button>
      </section>
    </div>
  );
}
