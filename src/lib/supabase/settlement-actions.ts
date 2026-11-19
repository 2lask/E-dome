"use server";

import { createClient } from "./server";
import { createAdminClient } from "./admin";
import { notifyUser } from "../email/notify";
import {
  formatIban,
  isValidIban,
  normalizeSwissMobile,
  type PayMethod,
  type PayoutProfile,
  type Settlement,
  type SettlementStatus,
} from "../reglements";

/* ── Actions serveur : RÈGLEMENTS (migration 008) ────────────────────────────
   Les transitions sont garanties par la base (déclencheur) : seul le payeur
   déclare « payé », seul l'apporteur confirme ou conteste. Les coordonnées de
   versement d'un apporteur ne sont remises qu'au payeur d'un règlement EN
   COURS avec lui (vérifié ici sous sa session, puis lu par clé de service). */

type Ok<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const missing = (e: { code?: string } | null) =>
  !!e && ["42P01", "PGRST205", "42703", "PGRST200"].includes(e.code ?? "");

async function me() {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, user: null } as const;
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user } as const;
}

type Person = { first_name: string; last_name: string } | null;
type Row = {
  id: string; source_kind: Settlement["sourceKind"]; label: string; payer_id: string; payee_id: string;
  gross_chf: number; fee_chf: number; net_chf: number; status: SettlementStatus; method: PayMethod | null;
  declared_at: string | null; confirmed_at: string | null; created_at: string;
  payer: Person; payee: Person;
};
const COLS =
  "id, source_kind, label, payer_id, payee_id, gross_chf, fee_chf, net_chf, status, method, declared_at, confirmed_at, created_at, payer:profiles!payer_id ( first_name, last_name ), payee:profiles!payee_id ( first_name, last_name )";

const nameOf = (p: Person) => (p ? `${p.first_name} ${p.last_name}`.trim() || "Un membre" : "Un membre");

export async function listMySettlements(): Promise<{ settlements: Settlement[]; ready: boolean }> {
  const { supabase, user } = await me();
  if (!supabase || !user) return { settlements: [], ready: true };
  const { data, error } = await supabase
    .from("settlements")
    .select(COLS)
    .or(`payer_id.eq.${user.id},payee_id.eq.${user.id}`)
    .order("created_at", { ascending: false });
  if (missing(error)) return { settlements: [], ready: false };
  return {
    ready: true,
    settlements: ((data ?? []) as unknown as Row[]).map((r) => {
      const payer = r.payer_id === user.id;
      return {
        id: r.id,
        role: payer ? "payer" : "payee",
        sourceKind: r.source_kind,
        label: r.label,
        counterpartName: nameOf(payer ? r.payee : r.payer),
        grossChf: Number(r.gross_chf),
        feeChf: Number(r.fee_chf),
        netChf: Number(r.net_chf),
        status: r.status,
        method: r.method,
        declaredAt: r.declared_at,
        confirmedAt: r.confirmed_at,
        createdAt: r.created_at,
      } satisfies Settlement;
    }),
  };
}

/** Nombre de règlements qui attendent une action de ma part. */
export async function countMySettlementTodos(): Promise<number> {
  const { supabase, user } = await me();
  if (!supabase || !user) return 0;
  const [a, b] = await Promise.all([
    supabase.from("settlements").select("id", { count: "exact", head: true }).eq("payer_id", user.id).eq("status", "due"),
    supabase.from("settlements").select("id", { count: "exact", head: true }).eq("payee_id", user.id).eq("status", "declared"),
  ]);
  return (a.count ?? 0) + (b.count ?? 0);
}

/* ── Payer / confirmer ──────────────────────────────────────────────────── */

export async function declarePaid(id: string, method: PayMethod): Promise<Ok> {
  if (!["twint", "virement", "autre"].includes(method)) return { ok: false, error: "Moyen de paiement inconnu." };
  const { supabase, user } = await me();
  if (!supabase || !user) return { ok: false, error: "Reconnectez-vous." };
  const { data, error } = await supabase
    .from("settlements")
    .update({ status: "declared", method })
    .eq("id", id)
    .eq("payer_id", user.id)
    .eq("status", "due")
    .select("payee_id, net_chf")
    .maybeSingle();
  if (error || !data) return { ok: false, error: "Ce règlement n'est plus à payer." };
  notifyUser(data.payee_id, { kind: "paiement-declare", netChf: Number(data.net_chf) });
  return { ok: true };
}

export async function answerPayment(id: string, decision: "confirmed" | "disputed"): Promise<Ok> {
  if (decision !== "confirmed" && decision !== "disputed") return { ok: false, error: "Décision inconnue." };
  const { supabase, user } = await me();
  if (!supabase || !user) return { ok: false, error: "Reconnectez-vous." };
  const { data, error } = await supabase
    .from("settlements")
    .update({ status: decision })
    .eq("id", id)
    .eq("payee_id", user.id)
    .eq("status", "declared")
    .select("id")
    .maybeSingle();
  if (error || !data) return { ok: false, error: "Ce règlement n'attend plus de confirmation." };
  return { ok: true };
}

/** Les coordonnées de versement de l'apporteur — pour le PAYEUR d'un règlement en cours. */
export async function getPayeeDetails(settlementId: string): Promise<Ok<{ details: PayoutProfile | null }>> {
  const { supabase, user } = await me();
  if (!supabase || !user) return { ok: false, error: "Reconnectez-vous." };
  /* Contrôle sous MA session (RLS) : je suis bien le payeur, règlement en cours. */
  const { data: s } = await supabase
    .from("settlements")
    .select("payee_id, status, payer_id")
    .eq("id", settlementId)
    .maybeSingle();
  if (!s || s.payer_id !== user.id || !["due", "declared"].includes(s.status)) return { ok: false, error: "Accès refusé." };
  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "Service indisponible." };
  const { data: p } = await admin.from("payout_profiles").select("holder_name, iban, twint_phone").eq("user_id", s.payee_id).maybeSingle();
  if (!p || (!p.iban && !p.twint_phone)) return { ok: true, details: null };
  return { ok: true, details: { holderName: p.holder_name, iban: p.iban, twintPhone: p.twint_phone } };
}

/* ── Mes coordonnées de versement ───────────────────────────────────────── */

export async function getMyPayout(): Promise<PayoutProfile | null> {
  const { supabase, user } = await me();
  if (!supabase || !user) return null;
  const { data } = await supabase.from("payout_profiles").select("holder_name, iban, twint_phone").eq("user_id", user.id).maybeSingle();
  return data ? { holderName: data.holder_name, iban: data.iban, twintPhone: data.twint_phone } : null;
}

export async function saveMyPayout(input: { holderName: string; iban: string; twintPhone: string }): Promise<Ok> {
  const holder = input.holderName.trim().slice(0, 120);
  const ibanRaw = input.iban.trim();
  const phoneRaw = input.twintPhone.trim();
  if (!ibanRaw && !phoneRaw) return { ok: false, error: "Indiquez un IBAN ou un numéro TWINT." };
  if (ibanRaw && !isValidIban(ibanRaw)) return { ok: false, error: "IBAN invalide (vérifiez les chiffres)." };
  const phone = phoneRaw ? normalizeSwissMobile(phoneRaw) : null;
  if (phoneRaw && !phone) return { ok: false, error: "Numéro TWINT : un mobile suisse (07X XXX XX XX)." };
  if (ibanRaw && holder.length < 2) return { ok: false, error: "Indiquez le titulaire du compte." };

  const { supabase, user } = await me();
  if (!supabase || !user) return { ok: false, error: "Reconnectez-vous." };
  const { error } = await supabase.from("payout_profiles").upsert({
    user_id: user.id,
    holder_name: holder,
    iban: ibanRaw ? formatIban(ibanRaw) : null,
    twint_phone: phone,
    updated_at: new Date().toISOString(),
  });
  if (missing(error)) return { ok: false, error: "La base doit être mise à jour (migration 008)." };
  return error ? { ok: false, error: "Non enregistré. Réessayez." } : { ok: true };
}
