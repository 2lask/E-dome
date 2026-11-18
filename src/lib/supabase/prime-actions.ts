"use server";

import { createClient } from "./server";
import { PRIME_MIN_CHF, PRIME_MAX_CHF, type MyPrime } from "../my-property";

/* ── Actions serveur : les primes apporteur EN BASE (chantier C5) ────────────

   Un vendeur attache une prime FIXE en CHF (50–3000) à l'un de SES biens. La
   prime est due quand il accepte le contact qu'un apporteur lui amène — jamais
   un pourcentage du prix, jamais conditionnée à la vente (règle `MODELE.md`).

   RLS : `primes.seller_id = auth.uid()`. On vérifie en plus que le bien
   m'appartient. Sans Supabase / sans session : échec explicite, l'appelant
   retombe sur la démonstration (aucune régression). */

/** Pose ou met à jour la prime sur un de mes biens (une prime active par bien). */
export async function setMyPrime(
  propertyId: string,
  amountChf: number,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "supabase-non-configure" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "non-connecte" };

  const amount = Math.round(amountChf);
  if (!Number.isFinite(amount) || amount < PRIME_MIN_CHF || amount > PRIME_MAX_CHF) {
    return { ok: false, error: "montant-hors-bornes" };
  }

  /* Le bien doit m'appartenir (défense en profondeur, en plus de la RLS). */
  const { data: prop } = await supabase
    .from("properties")
    .select("id, host_id")
    .eq("id", propertyId)
    .maybeSingle();
  if (!prop || prop.host_id !== user.id) return { ok: false, error: "pas-mon-bien" };

  /* Une prime existe déjà pour ce bien ? On la réactive / réajuste. Sinon on
     l'insère. (Pas de contrainte d'unicité SQL → on gère le upsert ici.) */
  const { data: existing } = await supabase
    .from("primes")
    .select("id")
    .eq("property_id", propertyId)
    .eq("seller_id", user.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("primes")
      .update({ amount_chf: amount, active: true })
      .eq("id", existing.id);
    return error ? { ok: false, error: error.message } : { ok: true };
  }

  const { error } = await supabase
    .from("primes")
    .insert({ property_id: propertyId, seller_id: user.id, amount_chf: amount, active: true });
  return error ? { ok: false, error: error.message } : { ok: true };
}

/** Retire la prime d'un de mes biens (la désactive, l'historique est conservé). */
export async function liftMyPrime(propertyId: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "supabase-non-configure" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "non-connecte" };

  const { error } = await supabase
    .from("primes")
    .update({ active: false })
    .eq("property_id", propertyId)
    .eq("seller_id", user.id);
  return error ? { ok: false, error: error.message } : { ok: true };
}

/** Les primes posées par moi (toutes, actives ou non), clé = bien. */
export async function listMyPrimes(): Promise<MyPrime[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("primes")
    .select("property_id, amount_chf, active")
    .eq("seller_id", user.id);
  if (error || !data) return [];
  return data.map((r) => ({
    propertyId: r.property_id as string,
    amountChf: Number(r.amount_chf),
    active: Boolean(r.active),
  }));
}
