/* ── RÈGLEMENTS — modèle partagé (client-safe) ───────────────────────────────
   Une prime ou une récompense acceptée devient un règlement DÛ (migration 008).
   Pilote : le payeur verse le NET directement à l'apporteur (TWINT, virement),
   puis le déclare ; l'apporteur confirme ou conteste. E-Dome ne détient jamais
   les fonds. Un prestataire agréé remplacera plus tard l'étape « payer ». */

export type SettlementStatus = "due" | "declared" | "confirmed" | "disputed";
export type PayMethod = "twint" | "virement" | "autre";

export interface Settlement {
  id: string;
  role: "payer" | "payee";
  sourceKind: "introduction" | "answer" | "vente";
  label: string;
  counterpartName: string;
  grossChf: number;
  feeChf: number;
  netChf: number;
  status: SettlementStatus;
  method: PayMethod | null;
  declaredAt: string | null;
  confirmedAt: string | null;
  createdAt: string;
}

export interface PayoutProfile {
  holderName: string;
  iban: string | null;
  twintPhone: string | null;
}

export const STATUS_LABEL: Record<SettlementStatus, { payer: string; payee: string }> = {
  due: { payer: "À payer", payee: "En attente du paiement" },
  declared: { payer: "Payé — en attente de confirmation", payee: "À confirmer" },
  confirmed: { payer: "Réglé", payee: "Reçu" },
  disputed: { payer: "Contesté", payee: "Contesté" },
};

export const METHOD_LABEL: Record<PayMethod, string> = {
  twint: "TWINT",
  virement: "Virement bancaire",
  autre: "Autre moyen",
};

/** IBAN : forme + clé de contrôle (mod 97). Suisse et Liechtenstein : 21 caractères. */
export function isValidIban(raw: string): boolean {
  const s = raw.replace(/\s+/g, "").toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(s)) return false;
  if ((s.startsWith("CH") || s.startsWith("LI")) && s.length !== 21) return false;
  const moved = s.slice(4) + s.slice(0, 4);
  let rest = 0;
  for (const ch of moved) {
    const v = ch >= "A" && ch <= "Z" ? String(ch.charCodeAt(0) - 55) : ch;
    for (const d of v) rest = (rest * 10 + Number(d)) % 97;
  }
  return rest === 1;
}

/** « CH9300762011623852957 » → « CH93 0076 2011 6238 5295 7 ». */
export function formatIban(raw: string): string {
  return raw.replace(/\s+/g, "").toUpperCase().replace(/(.{4})/g, "$1 ").trim();
}

/** Numéro TWINT : mobile suisse, normalisé en +41 7X XXX XX XX. `null` si invalide. */
export function normalizeSwissMobile(raw: string): string | null {
  let d = raw.replace(/[^\d+]/g, "");
  if (d.startsWith("+41")) d = d.slice(3);
  else if (d.startsWith("0041")) d = d.slice(4);
  else if (d.startsWith("0")) d = d.slice(1);
  if (!/^7[5-9]\d{7}$/.test(d)) return null;
  return `+41 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7)}`;
}
