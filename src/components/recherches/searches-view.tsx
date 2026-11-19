"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Radar, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchCard } from "@/components/recherches/search-card";
import { LAUNCH_CITIES } from "@/lib/my-property";
import { formatNumber } from "@/lib/format";
import type { Search, SearchKind } from "@/lib/recherches";
import { cn } from "@/lib/utils";

/* ── Les recherches à récompense ─────────────────────────────────────────────
   Ce que les gens cherchent, et ce qu'ils offrent à qui le leur trouve. C'est
   aussi la réponse au démarrage à froid : une recherche est du contenu qui
   n'a pas besoin qu'un bien existe déjà sur E-Dome. */

export function SearchesView({ searches, ready, member }: { searches: Search[]; ready: boolean; member: boolean }) {
  const [kind, setKind] = useState<SearchKind | "all">("all");
  const [city, setCity] = useState("");
  const newHref = member ? "/recherches/nouvelle" : "/auth/inscription?redirect=%2Frecherches%2Fnouvelle";

  const cities = useMemo(() => {
    const present = [...new Set(searches.map((s) => s.city.trim()))];
    return [...LAUNCH_CITIES.filter((c) => present.includes(c)), ...present.filter((c) => !LAUNCH_CITIES.includes(c)).sort((a, b) => a.localeCompare(b, "fr"))];
  }, [searches]);
  const visible = searches.filter((s) => (kind === "all" || s.kind === kind) && (!city || s.city.trim() === city));
  const total = searches.reduce((sum, s) => sum + s.rewardChf, 0);

  return (
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="page-heading text-[30px]">Recherches à récompense</h1>
          <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted-foreground">
            Des gens cherchent un logement, des agences cherchent des vendeurs — et récompensent qui les aide.
            Vous connaissez la bonne personne ou le bon bien ? Proposez-le.
          </p>
        </div>
        <Button asChild>
          <Link href={newHref}><Plus className="h-4 w-4" aria-hidden /> Publier ma recherche</Link>
        </Button>
      </header>

      {!ready && (
        <div role="status" className="mt-6 flex items-start gap-3 rounded-xl border bg-card p-4 text-[13px]">
          <Database className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          <p><strong>Base à mettre à jour.</strong> Les recherches attendent la migration <code className="rounded bg-subtle px-1">supabase/migrations/004_recherches.sql</code>.</p>
        </div>
      )}

      {searches.length > 0 && (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <div role="radiogroup" aria-label="Type de recherche" className="inline-flex rounded-lg border bg-subtle p-0.5">
              {([["all", "Tout"], ["logement", "Logements"], ["vendeurs", "Vendeurs"]] as const).map(([k, l]) => (
                <button key={k} type="button" role="radio" aria-checked={kind === k} onClick={() => setKind(k)}
                  className={cn("h-8 rounded-md px-3 text-[13px]", kind === k ? "bg-card font-medium shadow-xs" : "text-muted-foreground hover:text-foreground")}>
                  {l}
                </button>
              ))}
            </div>
            {cities.length > 1 && (
              <div className="no-scrollbar flex gap-1.5 overflow-x-auto" role="group" aria-label="Villes">
                {["", ...cities].map((c) => (
                  <button key={c || "toutes"} type="button" aria-pressed={city === c} onClick={() => setCity(c)}
                    className={cn("h-8 shrink-0 rounded-full border px-3 text-[13px]", city === c ? "border-foreground bg-foreground text-background" : "bg-card hover:border-foreground/25")}>
                    {c || "Toutes les villes"}
                  </button>
                ))}
              </div>
            )}
            <p className="ml-auto text-[12.5px] text-muted-foreground">
              {searches.length} recherche{searches.length > 1 ? "s" : ""} · {formatNumber(total)} CHF de récompenses offertes
            </p>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((s) => <SearchCard key={s.id} s={s} />)}
          </div>
        </>
      )}

      {ready && searches.length === 0 && (
        <section className="mt-8 rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-laiton-border bg-laiton-soft text-laiton">
            <Radar className="h-6 w-6" aria-hidden />
          </span>
          <h2 className="mt-4 text-[17px] font-semibold">Soyez le premier à chercher… avec une récompense</h2>
          <p className="mx-auto mt-1.5 max-w-md text-[14px] leading-relaxed text-muted-foreground">
            Vous cherchez un appartement ? Publiez ce que vous voulez et offrez une récompense : tout votre réseau — et
            celui des autres — se met à chercher pour vous.
          </p>
          <Button asChild className="mt-5"><Link href={newHref}>Publier ma recherche</Link></Button>
        </section>
      )}
    </div>
  );
}
