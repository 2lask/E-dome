import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { SearchForm } from "@/components/recherches/search-form";

export const metadata: Metadata = { title: "Publier ma recherche" };

export default async function NouvelleRecherchePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/connexion?redirect=%2Frecherches%2Fnouvelle");
  const isAgency = user.roles.some((r) => r === "agence" || r === "agent");
  return <SearchForm isAgency={isAgency} />;
}
