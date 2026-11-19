import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { listMyDemandes } from "@/lib/supabase/demande-actions";
import { listAnswersToMe } from "@/lib/supabase/search-actions";
import { DemandesInbox } from "@/components/demandes/demandes-inbox";

export const metadata: Metadata = { title: "Demandes" };

/* ── /demandes — la boîte unique du vendeur (REBUILD.md §3.4) ────────────────
   Composant serveur : charge les demandes et les décisions en attente, puis
   passe la main au client. Après chaque action, le client rafraîchit la
   route (router.refresh) et cette page relit la base. */
export default async function DemandesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/connexion?redirect=/demandes");
  const [{ demandes, pending, ready }, answers] = await Promise.all([listMyDemandes(), listAnswersToMe()]);
  return <DemandesInbox demandes={demandes} pending={pending} ready={ready} answers={answers} />;
}
