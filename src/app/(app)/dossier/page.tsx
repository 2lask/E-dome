import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { getMyDossier } from "@/lib/supabase/dossier-actions";
import { DossierEditor } from "@/components/dossier/dossier-editor";

export const metadata: Metadata = { title: "Mon dossier de location" };

export default async function DossierPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/connexion?redirect=%2Fdossier");
  const { dossier, docs, ready } = await getMyDossier();
  return <DossierEditor initial={dossier} docs={docs} ready={ready} />;
}
