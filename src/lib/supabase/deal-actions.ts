"use server";

import { createClient } from "./server";
import { createAdminClient } from "./admin";
import { DEAL_STEPS, validateOffer, type Deal, type DealOffer, type DealStepKey, type Financing, type OfferStatus } from "../deal";
import { formatNumber } from "../format";

/* ── Actions serveur : PARCOURS DE VENTE (migration 010) ─────────────────────
   Écritures sous la session du vendeur : la RLS n'autorise que le vendeur de
   la demande, et fige tout une fois la vente conclue. Chaque geste laisse une
   trace dans l'historique de la demande. Base sans 010 : `ready: false`. */

type Ok<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const MISSING = ["42P01", "PGRST205", "PGRST200"];
const FINANCING: Financing[] = ["inconnu", "fonds-propres", "hypotheque-en-cours", "hypotheque-confirmee"];
const today = () => new Date().toISOString().slice(0, 10);
const isUuid = (v: string) => /^[0-9a-f-]{36}$/i.test(v);

async function me() {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, user: null } as const;
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user } as const;
}

/* Historique : écrit par la clé de service, APRÈS contrôle d'appartenance. */
async function log(inquiryId: string, actorId: string, text: string) {
  const admin = createAdminClient();
  if (admin) await admin.from("inquiry_events").insert({ inquiry_id: inquiryId, actor_id: actorId, kind: "note", data: { text } });
}

type OfferRow = {
  id: string; amount_chf: number; financing: Financing; conditions: string; valid_until: string | null;
  status: OfferStatus; counter_amount_chf: number | null; created_at: string;
};

export async function getDeal(inquiryId: string): Promise<Deal> {
  const empty: Deal = { ready: false, offers: [], steps: {} };
  if (!isUuid(inquiryId)) return empty;
  const { supabase, user } = await me();
  if (!supabase || !user) return empty;
  const [o, s] = await Promise.all([
    supabase.from("deal_offers").select("id, amount_chf, financing, conditions, valid_until, status, counter_amount_chf, created_at").eq("inquiry_id", inquiryId).order("created_at", { ascending: false }),
    supabase.from("deal_steps").select("step, done_at").eq("inquiry_id", inquiryId),
  ]);
  if (o.error && MISSING.includes(o.error.code ?? "")) return empty;
  const offers: DealOffer[] = ((o.data ?? []) as OfferRow[]).map((r) => ({
    id: r.id,
    amountChf: Number(r.amount_chf),
    financing: r.financing,
    conditions: r.conditions ?? "",
    validUntil: r.valid_until,
    status: r.status,
    counterAmountChf: r.counter_amount_chf == null ? null : Number(r.counter_amount_chf),
    createdAt: r.created_at,
  }));
  const steps: Deal["steps"] = {};
  for (const r of (s.data ?? []) as { step: DealStepKey; done_at: string }[]) steps[r.step] = r.done_at;
  return { ready: true, offers, steps };
}

/** Le vendeur enregistre une offre reçue (par écrit, téléphone ou e-mail). */
export async function addOffer(inquiryId: string, input: { amountChf: number; financing: Financing; conditions: string; validUntil: string | null }): Promise<Ok> {
  if (!isUuid(inquiryId)) return { ok: false, error: "Demande introuvable." };
  const conditions = (input.conditions ?? "").trim();
  const validUntil = input.validUntil || null;
  const amount = Math.round(Number(input.amountChf));
  const err = validateOffer({ amountChf: amount, validUntil, conditions }, today());
  if (err) return { ok: false, error: err };
  const financing = FINANCING.includes(input.financing) ? input.financing : "inconnu";

  const { supabase, user } = await me();
  if (!supabase || !user) return { ok: false, error: "Reconnectez-vous." };
  const { data: inq } = await supabase.from("inquiries").select("id, status").eq("id", inquiryId).eq("seller_id", user.id).maybeSingle();
  if (!inq) return { ok: false, error: "Demande introuvable." };
  if (inq.status === "conclue") return { ok: false, error: "Cette vente est déjà conclue." };

  const { error } = await supabase.from("deal_offers").insert({
    inquiry_id: inquiryId, seller_id: user.id, amount_chf: amount, financing, conditions, valid_until: validUntil,
  });
  if (error) return { ok: false, error: MISSING.includes(error.code ?? "") ? "Les offres arrivent avec la mise à jour de la base (migration 010)." : "L'offre n'a pas été enregistrée." };

  /* Une offre fait passer la demande à l'étape « Offre » (sans jamais reculer). */
  if (["nouvelle", "en-cours", "visite"].includes(inq.status as string)) {
    await supabase.from("inquiries").update({ status: "offre" }).eq("id", inquiryId).eq("seller_id", user.id);
  }
  await log(inquiryId, user.id, `Offre reçue : CHF ${formatNumber(amount)}.`);
  return { ok: true };
}

/** Accepter, refuser, contre-proposer ou marquer retirée une offre. */
export async function setOfferStatus(offerId: string, status: Exclude<OfferStatus, "en-attente">, counterAmountChf?: number | null): Promise<Ok> {
  if (!isUuid(offerId) || !["acceptee", "refusee", "contre-offre", "retiree"].includes(status)) return { ok: false, error: "Action invalide." };
  const counter = status === "contre-offre" ? Math.round(Number(counterAmountChf)) : null;
  if (status === "contre-offre" && !(counter && counter >= 1000)) return { ok: false, error: "Indiquez le montant de votre contre-offre." };

  const { supabase, user } = await me();
  if (!supabase || !user) return { ok: false, error: "Reconnectez-vous." };
  const { data: offer } = await supabase.from("deal_offers").select("id, inquiry_id, amount_chf").eq("id", offerId).eq("seller_id", user.id).maybeSingle();
  if (!offer) return { ok: false, error: "Offre introuvable." };

  const patch: Record<string, unknown> = { status, counter_amount_chf: counter };
  /* Accepter une contre-offre déjà faite garde son montant. */
  if (status === "acceptee") delete patch.counter_amount_chf;
  const { error } = await supabase.from("deal_offers").update(patch).eq("id", offerId).eq("seller_id", user.id);
  if (error) return { ok: false, error: error.message?.includes("conclue") ? "Cette vente est déjà conclue." : "La mise à jour a échoué." };

  /* Une seule offre acceptée : les autres offres ouvertes passent « refusée ». */
  if (status === "acceptee") {
    await supabase.from("deal_offers").update({ status: "refusee" })
      .eq("inquiry_id", offer.inquiry_id).eq("seller_id", user.id).neq("id", offerId).in("status", ["en-attente", "contre-offre"]);
  }
  const amount = formatNumber(Number(offer.amount_chf));
  const text = status === "acceptee" ? `Offre de CHF ${amount} acceptée.`
    : status === "refusee" ? `Offre de CHF ${amount} refusée.`
    : status === "retiree" ? `Offre de CHF ${amount} retirée par l'acheteur.`
    : `Contre-offre à CHF ${formatNumber(counter ?? 0)} (offre de CHF ${amount}).`;
  await log(offer.inquiry_id as string, user.id, text);
  return { ok: true };
}

/** Cocher ou décocher une étape jusqu'à l'acte. */
export async function setDealStep(inquiryId: string, step: DealStepKey, done: boolean): Promise<Ok> {
  if (!isUuid(inquiryId) || !DEAL_STEPS.some((s) => s.key === step)) return { ok: false, error: "Action invalide." };
  const { supabase, user } = await me();
  if (!supabase || !user) return { ok: false, error: "Reconnectez-vous." };
  const { data: inq } = await supabase.from("inquiries").select("id").eq("id", inquiryId).eq("seller_id", user.id).maybeSingle();
  if (!inq) return { ok: false, error: "Demande introuvable." };

  const { error } = done
    ? await supabase.from("deal_steps").upsert({ inquiry_id: inquiryId, step, done_by: user.id }, { onConflict: "inquiry_id,step", ignoreDuplicates: true })
    : await supabase.from("deal_steps").delete().eq("inquiry_id", inquiryId).eq("step", step);
  if (error) return { ok: false, error: MISSING.includes(error.code ?? "") ? "Les étapes arrivent avec la mise à jour de la base (migration 010)." : "La mise à jour a échoué." };
  const title = DEAL_STEPS.find((s) => s.key === step)?.title ?? step;
  await log(inquiryId, user.id, done ? `Étape franchie : ${title}.` : `Étape annulée : ${title}.`);
  return { ok: true };
}
