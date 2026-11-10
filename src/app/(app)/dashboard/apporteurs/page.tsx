"use client";

import Link from "next/link";
import { Copy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SimpleBarList } from "@/components/dashboard/simple-bar-list";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { REFERRAL_ID } from "@/lib/referral-links";
import { useApporteurBook } from "@/lib/use-business";
import { chfLabel } from "@/lib/demo/affiliation";
import { ApporteurTotals, PrimeCountryNotice } from "@/components/business/apporteur-summary";

/* ── `/dashboard/apporteurs` — aligné sur la MÊME source que `/apporteurs` ────

   Les trois chiffres contradictoires d'avant (770 CHF sur les liens, 1 034 CHF
   dans le tableau des apports, 9 500 CHF dans un classement) venaient de trois
   tables écrites à la main. Ici comme sur `/apporteurs`, tout vient de
   `apporteurBook()` — dérivé par `quote()`, pour la personne incarnée. Plus de
   classement nominatif avec montants : E-Dome n'affirme aucune traction. */

const REFERRAL_LINK = `https://edome.world/ref/${REFERRAL_ID}`;

const MECHANIC_LABEL = { bien: "Biens · primes", marketplace: "Marketplace · affiliation", abonnement: "Abonnements" } as const;

export default function DashboardApporteursPage() {
  const book = useApporteurBook();
  const byMechanic = (["bien", "marketplace", "abonnement"] as const).map((m) => ({
    name: MECHANIC_LABEL[m],
    value: book.totals[m] / 100,
  }));
  const recent = book.lines.slice(0, 6);

  return (
    <div className="space-y-6">
      <DashboardPageHeader title="Apporteurs" description="Ce que vous avez amené, sur les deux mécaniques et les abonnements" />

      <ApporteurTotals book={book} />

      {!book.eligibility.eligible && <PrimeCountryNotice country={book.eligibility.country} reason={book.eligibility.reason} />}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Votre lien de recommandation</CardTitle>
          <CardDescription>Pour amener des comptes ; les liens par annonce se créent dans l&apos;espace apporteur.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input readOnly value={REFERRAL_LINK} className="flex-1 font-mono" />
            <Button variant="outline" size="sm" className="h-9" onClick={() => navigator.clipboard?.writeText(REFERRAL_LINK)}>
              <Copy className="mr-2 h-4 w-4" />
              Copier
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Répartition par mécanique</CardTitle>
            <CardDescription>Net acquis · {chfLabel(book.totals.total)}</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarList items={byMechanic} valueFormatter={(n) => chfLabel(Math.round(n * 100))} barClass="bg-primary" />
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Derniers apports</CardTitle>
            <CardDescription>
              Le détail complet est dans <Link href="/apporteurs" className="text-primary hover:underline">l&apos;espace apporteur</Link>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {recent.length === 0 && <p className="text-sm text-muted-foreground">Aucun apport pour l&apos;instant.</p>}
            {recent.map((l) => (
              <div key={l.id} className="flex items-baseline justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{l.label}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {MECHANIC_LABEL[l.mechanic]} · {l.date}
                  </p>
                </div>
                <span className="shrink-0 tabular-nums">{l.netCents > 0 ? chfLabel(l.netCents) : "—"}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
