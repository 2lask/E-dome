import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { SearchForm } from "@/components/recherches/search-form";

export const metadata: Metadata = { title: "Publier ma recherche" };

export default async function NouvelleRecherchePage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const user = await getCurrentUser();
  if (!user) redirect(`/auth/connexion?redirect=${encodeURIComponent(type === "vendeurs" ? "/recherches/nouvelle?type=vendeurs" : "/recherches/nouvelle")}`);
  /* Depuis l'Espace agence (?type=vendeurs) ou un profil agence : on ouvre sur « vendeurs ». */
  const isAgency = type === "vendeurs" || user.roles.some((r) => r === "agence" || r === "agent");
  return <SearchForm isAgency={isAgency} />;
}
