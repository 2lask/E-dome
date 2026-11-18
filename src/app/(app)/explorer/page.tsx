import type { Metadata } from "next";
import { listPublicProperties } from "@/lib/supabase/property-actions";
import { ExplorerView } from "@/components/listing/explorer-view";

export const metadata: Metadata = {
  title: "Explorer les biens",
  description: "Biens à vendre et à louer en Suisse romande, proposés directement par leurs propriétaires.",
};

/* ── /explorer (REBUILD.md §3) ───────────────────────────────────────────────
   Composant serveur : lit les biens RÉELS (tous vendeurs, hors vendus) et
   passe la main au client pour la recherche et les filtres. `?q=` pré-remplit
   la recherche (menu ⌘K, ancienne page /recherche). */
export default async function ExplorerPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ q }, biens] = await Promise.all([searchParams, listPublicProperties(200)]);
  return <ExplorerView biens={biens} initialQuery={typeof q === "string" ? q.slice(0, 120) : ""} />;
}
