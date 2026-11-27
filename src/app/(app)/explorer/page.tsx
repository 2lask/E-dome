import { Suspense } from "react";
import type { Metadata } from "next";
import { listPublicProperties } from "@/lib/supabase/property-actions";
import { ExplorerView } from "@/components/listing/explorer-view";
import { ExplorerSkeleton } from "@/components/listing/explorer-skeleton";

export const metadata: Metadata = {
  title: "Explorer les biens",
  description: "Biens à vendre et à louer en Suisse romande, proposés directement par leurs propriétaires.",
};

/* ── /explorer (REBUILD.md §3) ───────────────────────────────────────────────
   Composant serveur : lit les biens RÉELS (tous vendeurs, hors vendus) et
   passe la main au client pour la recherche et les filtres. `?q=` pré-remplit
   la recherche (menu ⌘K, ancienne page /recherche). Le squelette s'affiche
   pendant la lecture (rendu en flux). */
export default async function ExplorerPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; prime?: string }>;
}) {
  const { q, prime } = await searchParams;
  return (
    <Suspense fallback={<ExplorerSkeleton />}>
      <Catalogue initialQuery={typeof q === "string" ? q.slice(0, 120) : ""} initialPrimeOnly={prime === "1"} />
    </Suspense>
  );
}

async function Catalogue({ initialQuery, initialPrimeOnly }: { initialQuery: string; initialPrimeOnly: boolean }) {
  const biens = await listPublicProperties(200);
  return <ExplorerView biens={biens} initialQuery={initialQuery} initialPrimeOnly={initialPrimeOnly} />;
}
