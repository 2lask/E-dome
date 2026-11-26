import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { listPrimedProperties } from "@/lib/supabase/introduction-actions";
import { getDashboard } from "@/lib/supabase/dashboard-actions";
import { getMyPayout } from "@/lib/supabase/settlement-actions";
import { ApporteurHub } from "@/components/business/apporteur-hub";
import { GagnerPublic } from "@/components/business/gagner-public";

export const metadata: Metadata = {
  title: "Gagner en recommandant",
  description:
    "Recommandez un bien avec votre lien personnel et touchez la commission fixée par le vendeur quand la personne que vous amenez achète ou loue.",
};

/* ── /apporteurs — « Gagner » ────────────────────────────────────────────────
   Membre : son espace apporteur (biens à commission, son lien en un geste,
   ses chiffres réels). Visiteur : la page publique avec les VRAIS biens à
   commission et un simulateur. L'ancien espace par mise en relation
   (`ApporteurReal`) reste dans le code, hors navigation. */
export default async function GagnerPage() {
  const user = await getCurrentUser();
  const offers = await listPrimedProperties();
  if (user) {
    const [dash, payout] = await Promise.all([getDashboard(30), getMyPayout()]);
    return <ApporteurHub offers={offers} stats={dash?.apporteur ?? null} payout={payout} />;
  }
  return <GagnerPublic offers={offers} />;
}
