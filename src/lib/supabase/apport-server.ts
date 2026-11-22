import "server-only";
import { cookies } from "next/headers";
import { createAdminClient } from "./admin";
import { REF_COOKIE, parseRefCookie } from "../tracking";

/* ── Attribution d'un lead à un apporteur (serveur uniquement) ───────────────
   Lu à la création d'une demande : si le visiteur est arrivé par le lien d'un
   apporteur (cookie, 60 jours), la demande lui est attribuée et les conditions
   de la commission active sont FIGÉES (le vendeur ne peut plus les changer
   pour ce lead — déclencheur `guard_inquiry_update`).
   Module `server-only` : jamais appelable depuis le navigateur. */

export interface Attribution {
  link_id: string;
  apporteur_id: string;
  commission_kind: "fixe" | "pourcentage";
  commission_amount_chf: number | null;
  commission_rate_pct: number | null;
  commission_due_on: "conclusion";
}

export async function attributionFor(propertyId: string, sellerId: string, senderId: string | null): Promise<Attribution | null> {
  const admin = createAdminClient();
  if (!admin) return null;
  const code = parseRefCookie((await cookies()).get(REF_COOKIE)?.value)[propertyId];
  if (!code) return null;

  const { data: link } = await admin.from("apport_links").select("id, apporteur_id, property_id").eq("code", code).maybeSingle();
  if (!link || link.property_id !== propertyId) return null;
  /* On ne s'apporte pas à soi-même, et le vendeur n'est pas son propre apporteur. */
  if (link.apporteur_id === sellerId || (senderId && link.apporteur_id === senderId)) return null;

  const { data: prime } = await admin
    .from("primes")
    .select("amount_chf, commission_kind, rate_pct")
    .eq("property_id", propertyId)
    .eq("active", true)
    .limit(1)
    .maybeSingle();
  if (!prime) return null;
  return {
    link_id: link.id as string,
    apporteur_id: link.apporteur_id as string,
    commission_kind: prime.commission_kind === "pourcentage" ? "pourcentage" : "fixe",
    commission_amount_chf: prime.amount_chf === null ? null : Number(prime.amount_chf),
    commission_rate_pct: prime.rate_pct === null ? null : Number(prime.rate_pct),
    /* Un lead venu par un lien n'a pas d'étape « acceptation » : due à la conclusion. */
    commission_due_on: "conclusion",
  };
}
