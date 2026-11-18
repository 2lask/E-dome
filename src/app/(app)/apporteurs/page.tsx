import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { listPrimedProperties } from "@/lib/supabase/introduction-actions";
import { ApporteurReal } from "@/components/business/apporteur-real";
import { GagnerPublic } from "@/components/business/gagner-public";

export const metadata: Metadata = {
  title: "Gagner en recommandant",
  description:
    "Présentez le bon acheteur ou locataire à un propriétaire et touchez une prime fixe, due dès qu'il accepte votre contact.",
};

/* ── /apporteurs — « Gagner » (REBUILD.md §7) ────────────────────────────────
   Composant serveur. Membre : son espace apporteur réel (biens à prime,
   mises en relation, gains). Visiteur : la page publique, avec les VRAIS biens
   à prime. L'ancienne vue de démonstration (biens et gains fictifs) est
   retirée de cette page. */
export default async function GagnerPage() {
  const user = await getCurrentUser();
  if (user) return <ApporteurReal />;
  return <GagnerPublic offers={await listPrimedProperties()} />;
}
