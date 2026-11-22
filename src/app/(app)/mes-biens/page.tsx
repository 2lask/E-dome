import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { listMyProperties } from "@/lib/supabase/property-actions";
import { listMyPrimes } from "@/lib/supabase/prime-actions";
import { listMyDemandes } from "@/lib/supabase/demande-actions";
import { MyListings, type ListingStats } from "@/components/publish/my-listings";
import type { CommissionTerms } from "@/lib/commission";

export const metadata: Metadata = { title: "Mes biens" };

/* ── /mes-biens (REBUILD.md §6) ──────────────────────────────────────────────
   Composant serveur : mes annonces, leurs primes actives et leurs demandes en
   cours, lues en base. L'ancienne page (« Mes annonces » de la démonstration)
   est remplacée. */
export default async function MesBiensPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/connexion?redirect=/mes-biens");

  const [biens, primes, inbox] = await Promise.all([listMyProperties(), listMyPrimes(), listMyDemandes()]);

  const primeBy: Record<string, CommissionTerms> = {};
  for (const p of primes) if (p.active) primeBy[p.propertyId] = p.terms;

  const stats: Record<string, ListingStats> = {};
  const bump = (id: string, k: keyof ListingStats) => {
    stats[id] ??= { demandes: 0, pending: 0 };
    stats[id][k] += 1;
  };
  for (const d of inbox.demandes) if (d.status !== "conclue" && d.status !== "fermee") bump(d.property.id, "demandes");
  for (const i of inbox.pending) bump(i.property.id, "pending");

  return <MyListings biens={biens.filter((b) => !b.soldTo)} primes={primeBy} stats={stats} />;
}
