"use server";

import { createClient } from "./server";
import { coverOf, type PrimedProperty, type MyIntroduction } from "../my-property";
import type { PropertyType, TransactionType } from "../types";

/* ── Actions serveur : découverte & mise en relation apporteur (chantier C5) ──

   L'autre moitié du cœur du modèle. Un apporteur voit les biens à prime active
   (hors les siens), propose un contact traçable → ligne `introductions`. Le
   vendeur acceptera (prime due) ou refusera (rien dû). RLS :
   `introductions` visible/éditable par l'apporteur ou le vendeur.

   Sans Supabase / sans session : liste vide / échec explicite — l'appelant
   retombe sur la démonstration. */

type PrimeRow = {
  id: string;
  amount_chf: number;
  seller_id: string;
  property: {
    id: string;
    title: string;
    city: string;
    type: string;
    transaction_type: string;
    images: string[] | null;
    sold_to: string | null;
    host: { first_name: string; last_name: string } | null;
  } | null;
};

/** Les biens à prime active que je peux recommander (pas les miens, pas les
    biens déjà vendus), prime la plus rémunératrice d'abord. */
export async function listPrimedProperties(): Promise<PrimedProperty[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("primes")
    .select(
      "id, amount_chf, seller_id, property:properties!property_id ( id, title, city, type, transaction_type, images, sold_to, host:profiles!host_id ( first_name, last_name ) )",
    )
    .eq("active", true)
    .neq("seller_id", user.id);
  if (error || !data) return [];

  const rows = data as unknown as PrimeRow[];
  return rows
    .filter((r) => r.property && !r.property.sold_to)
    .map((r) => {
      const p = r.property!;
      const sellerName = p.host
        ? `${p.host.first_name} ${p.host.last_name}`.trim() || "Vendeur"
        : "Vendeur";
      return {
        primeId: r.id,
        propertyId: p.id,
        title: p.title,
        city: p.city,
        transactionType: p.transaction_type as TransactionType,
        cover: coverOf({ images: p.images ?? [], type: p.type as PropertyType }),
        amountChf: Number(r.amount_chf),
        sellerId: r.seller_id,
        sellerName,
      };
    })
    .sort((a, b) => b.amountChf - a.amountChf);
}

/** Propose un contact au vendeur sur un bien à prime (mise en relation). */
export async function createIntroduction(input: {
  primeId: string;
  sellerId: string;
  contactLabel: string;
}): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "supabase-non-configure" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "non-connecte" };
  if (input.sellerId === user.id) return { ok: false, error: "propre-bien" };
  if (input.contactLabel.trim().length < 3) return { ok: false, error: "contact-trop-court" };

  const { error } = await supabase.from("introductions").insert({
    prime_id: input.primeId,
    apporteur_id: user.id,
    seller_id: input.sellerId,
    contact_label: input.contactLabel.trim(),
    status: "proposee",
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

type IntroRow = {
  id: string;
  contact_label: string;
  status: string;
  created_at: string;
  prime: {
    amount_chf: number;
    property: { title: string } | null;
  } | null;
};

/** Mes mises en relation proposées, récentes d'abord. */
export async function listMyIntroductions(): Promise<MyIntroduction[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("introductions")
    .select(
      "id, contact_label, status, created_at, prime:primes!prime_id ( amount_chf, property:properties!property_id ( title ) )",
    )
    .eq("apporteur_id", user.id)
    .order("created_at", { ascending: false });
  if (error || !data) return [];

  const rows = data as unknown as IntroRow[];
  return rows.map((r) => ({
    id: r.id,
    propertyTitle: r.prime?.property?.title ?? "Bien",
    contactLabel: r.contact_label,
    status: (["proposee", "acceptee", "refusee", "contestee"].includes(r.status)
      ? r.status
      : "proposee") as MyIntroduction["status"],
    amountChf: Number(r.prime?.amount_chf ?? 0),
    createdAt: r.created_at,
  }));
}
