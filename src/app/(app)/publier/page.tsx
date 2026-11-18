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
  searchParams: Promise<{ edit?: string }>;
}) {
  const [{ edit }, user] = await Promise.all([searchParams, getCurrentUser()]);
  if (!user) redirect(`/auth/connexion?redirect=${encodeURIComponent(edit ? `/publier?edit=${edit}` : "/publier")}`);

  if (!edit) return <PublishForm />;

  if (!isDbPropertyId(edit)) notFound();
  const [p, primes] = await Promise.all([getPublicProperty(edit), listMyPrimes()]);
  if (!p || p.hostId !== user.id) notFound();
  const prime = primes.find((x) => x.propertyId === p.id && x.active)?.amountChf ?? null;
  return <PublishForm initial={p} initialPrime={prime} />;
}
