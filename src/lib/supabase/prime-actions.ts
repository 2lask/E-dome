"use server";

import { createClient } from "./server";
import { estimateChf, validateTerms, type CommissionTerms } from "../commission";
import type { MyPrime } from "../my-property";
import type { TransactionType } from "../types";

/* ── Actions serveur : la COMMISSION D'APPORT d'un bien (v2, migration 009) ──

   Le vendeur promet une commission à qui lui amène l'acheteur ou le locataire
   (courtage d'indication, art. 412 ss CO) : fixe ou % du prix de vente final,
   due à la conclusion (art. 413 CO) ou, si fixe, à l'acceptation du contact.
   Son accord est horodaté (`terms_accepted_at`).

   Base sans migration 009 : on retombe sur la prime v1 (fixe 50–3000 CHF due à
   l'acceptation) quand les conditions le permettent, sinon message explicite.

   RLS : `primes.seller_id = auth.uid()`, et on vérifie que le bien est à moi. */

type Ok = { ok: boolean; error?: string };
const v2Missing = (e: { code?: string } | null) => !!e && ["42703", "PGRST204", "23514"].includes(e.code ?? "");

export async function setMyPrime(propertyId: string, terms: CommissionTerms, accepted: boolean): Promise<Ok> {
  if (!accepted) return { ok: false, error: "Acceptez les conditions de la commission." };
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Service indisponible." };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Reconnectez-vous." };

  const { data: prop } = await supabase
    .from("properties")
    .select("id, host_id, transaction_type")
    .eq("id", propertyId)
    .maybeSingle();
  if (!prop || prop.host_id !== user.id) return { ok: false, error: "Ce bien n'est pas le vôtre." };

  const t: CommissionTerms = {
    kind: terms.kind === "pourcentage" ? "pourcentage" : "fixe",
    amountChf: terms.kind === "fixe" && terms.amountChf ? Math.round(terms.amountChf) : null,
    ratePct: terms.kind === "pourcentage" && terms.ratePct ? Math.round(terms.ratePct * 100) / 100 : null,
    dueOn: terms.kind === "pourcentage" ? "conclusion" : terms.dueOn === "acceptation" ? "acceptation" : "conclusion",
  };
  const invalid = validateTerms(t, prop.transaction_type as TransactionType);
  if (invalid) return { ok: false, error: invalid };

  const row = {
    amount_chf: t.amountChf,
    commission_kind: t.kind,
    rate_pct: t.ratePct,
    due_on: t.dueOn,
    terms_accepted_at: new Date().toISOString(),
    active: true,
  };
  const { data: existing } = await supabase
    .from("primes").select("id").eq("property_id", propertyId).eq("seller_id", user.id).maybeSingle();

  const write = (r: Record<string, unknown>) =>
    existing
      ? supabase.from("primes").update(r).eq("id", existing.id)
      : supabase.from("primes").insert({ ...r, property_id: propertyId, seller_id: user.id });

  const { error } = await write(row);
  if (!error) return { ok: true };
  if (!v2Missing(error)) return { ok: false, error: "La commission n'a pas pu être enregistrée." };

  /* Base v1 : seulement une prime fixe de 50 à 3000 CHF due à l'acceptation. */
  if (t.kind === "fixe" && t.amountChf && t.amountChf <= 3000 && t.dueOn === "acceptation") {
    const { error: e1 } = await write({ amount_chf: t.amountChf, active: true });
    return e1 ? { ok: false, error: "La commission n'a pas pu être enregistrée." } : { ok: true };
  }
  return { ok: false, error: "Cette forme de commission sera disponible après la mise à jour de la base (migration 009)." };
}

/** Retire la commission d'un de mes biens (désactivée, historique conservé). */
export async function liftMyPrime(propertyId: string): Promise<Ok> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Service indisponible." };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Reconnectez-vous." };
  const { error } = await supabase.from("primes").update({ active: false }).eq("property_id", propertyId).eq("seller_id", user.id);
  return error ? { ok: false, error: error.message } : { ok: true };
}

type PrimeRow = {
  property_id: string; amount_chf: number | null; active: boolean;
  commission_kind?: string | null; rate_pct?: number | null; due_on?: string | null;
  property?: { price: number } | { price: number }[] | null;
};

/** Mes commissions (actives ou non), avec leurs conditions. */
export async function listMyPrimes(): Promise<MyPrime[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let res = await supabase
    .from("primes")
    .select("property_id, amount_chf, active, commission_kind, rate_pct, due_on, property:properties!property_id ( price )")
    .eq("seller_id", user.id);
  if (res.error && v2Missing(res.error)) {
    res = await supabase.from("primes").select("property_id, amount_chf, active").eq("seller_id", user.id) as typeof res;
  }
  if (res.error || !res.data) return [];
  return (res.data as unknown as PrimeRow[]).map((r) => {
    const terms: CommissionTerms = {
      kind: r.commission_kind === "pourcentage" ? "pourcentage" : "fixe",
      amountChf: r.amount_chf === null ? null : Number(r.amount_chf),
      ratePct: r.rate_pct === null || r.rate_pct === undefined ? null : Number(r.rate_pct),
      dueOn: r.due_on === "conclusion" ? "conclusion" : "acceptation",
    };
    const price = Number((Array.isArray(r.property) ? r.property[0]?.price : r.property?.price) ?? 0);
    return { propertyId: r.property_id, amountChf: estimateChf(terms, price) ?? 0, active: Boolean(r.active), terms };
  });
}
