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
  return (
    <>
      <DossierEditor initial={dossier} docs={docs} ready={ready} />
      <div className="mx-auto mt-8 max-w-5xl">
        <a href="/demenagement" className="flex items-center justify-between gap-3 rounded-2xl border bg-card px-5 py-4 text-[14px] hover:border-foreground/20">
          <span><strong>Le logement trouvé, reste à déménager.</strong> <span className="text-muted-foreground">Nettoyage de fin de bail, déménageurs : devis gratuits.</span></span>
          <span className="shrink-0 text-[13px] font-medium text-leman">Demander →</span>
        </a>
      </div>
    </>
  );
}
