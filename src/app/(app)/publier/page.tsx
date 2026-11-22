import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { getPublicProperty } from "@/lib/supabase/property-actions";
import { listMyPrimes } from "@/lib/supabase/prime-actions";
import { isDbPropertyId } from "@/lib/my-property";
import { PublishForm } from "@/components/publish/publish-form";

export const metadata: Metadata = { title: "Publier un bien" };

/* ── /publier — créer ou modifier une annonce (REBUILD.md §6) ────────────────
   Composant serveur. `?edit=<id>` : on charge le bien et on vérifie qu'il
   appartient bien à la personne connectée avant d'ouvrir le formulaire. */
export default async function PublierPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; mode?: string }>;
}) {
  const [{ edit, mode }, user] = await Promise.all([searchParams, getCurrentUser()]);
  if (!user) redirect(`/auth/connexion?redirect=${encodeURIComponent(edit ? `/publier?edit=${edit}` : mode ? `/publier?mode=${mode}` : "/publier")}`);

  if (!edit) return <PublishForm initialMode={mode === "reprise" ? "reprise" : mode === "location" ? "location" : undefined} />;

  if (!isDbPropertyId(edit)) notFound();
  const [p, primes] = await Promise.all([getPublicProperty(edit), listMyPrimes()]);
  if (!p || p.hostId !== user.id) notFound();
  const commission = primes.find((x) => x.propertyId === p.id && x.active)?.terms ?? null;
  return <PublishForm initial={p} initialCommission={commission} />;
}
