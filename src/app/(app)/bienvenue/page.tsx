import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { getMyPayout } from "@/lib/supabase/settlement-actions";
import { Welcome } from "@/components/onboarding/welcome";

export const metadata: Metadata = { title: "Bienvenue", robots: { index: false } };

/* ── /bienvenue — premier passage après l'inscription ────────────────────────
   Trois questions courtes : ce que la personne vient faire, ses coordonnées
   de paiement si elle recommande (sans elles, un vendeur ne peut pas la
   payer), puis la première action utile. Tout est facultatif et repris
   ailleurs (Règlements, Publier, Gagner). */
export default async function BienvenuePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/connexion?redirect=%2Fbienvenue");
  const payout = await getMyPayout();
  return <Welcome firstName={user.firstName} payout={payout} />;
}
