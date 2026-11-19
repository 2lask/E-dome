import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { listPublicSearches } from "@/lib/supabase/search-actions";
import { SearchesView } from "@/components/recherches/searches-view";

export const metadata: Metadata = {
  title: "Recherches à récompense",
  description: "Des gens cherchent un logement, des agences cherchent des vendeurs — et récompensent qui les aide.",
};

/* ── /recherches — le côté demande du moteur de récompenses ─────────────────── */
export default async function RecherchesPage() {
  const [user, { searches, ready }] = await Promise.all([getCurrentUser(), listPublicSearches()]);
  return <SearchesView searches={searches} ready={ready} member={!!user} />;
}
