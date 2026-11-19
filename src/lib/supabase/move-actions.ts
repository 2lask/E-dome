"use server";

import { z } from "zod";
import { createClient } from "./server";
import { createAdminClient } from "./admin";
import { isAdminEmail } from "./admin-guard";
import { notifyAdmins } from "../email/notify";
import { SERVICE_LABEL, isMoveService, type MoveRequest, type MoveService, type MoveStatus } from "../demenagement";

/* ── Actions serveur : SERVICES DU DÉMÉNAGEMENT (migration 007) ──────────────
   · Une demande NAÎT côté serveur (clé de service) après validation — visiteurs
     compris, avec un pot de miel anti-robots et le consentement obligatoire.
   · La personne connectée relit SES demandes (RLS).
   · Le suivi (statut, note) est réservé à l'équipe : adresse dans
     EDOME_ADMIN_EMAILS, vérifiée ici À CHAQUE appel (ces fonctions sont
     appelables depuis le navigateur, comme toute action serveur). */

type Ok<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const missing = (e: { code?: string } | null) =>
  !!e && ["42P01", "PGRST205", "42703", "PGRST200"].includes(e.code ?? "");

type Row = {
  id: string; name: string; email: string | null; phone: string | null; from_city: string; to_city: string;
  move_date: string | null; rooms: number | null; services: string[]; details: string; status: MoveStatus;
  admin_note: string; created_at: string;
};
const COLS = "id, name, email, phone, from_city, to_city, move_date, rooms, services, details, status, admin_note, created_at";

const mapRow = (r: Row): MoveRequest => ({
  id: r.id,
  name: r.name,
  email: r.email,
  phone: r.phone,
  fromCity: r.from_city,
  toCity: r.to_city ?? "",
  moveDate: r.move_date,
  rooms: r.rooms === null ? null : Number(r.rooms),
  services: (r.services ?? []).filter(isMoveService) as MoveService[],
  details: r.details ?? "",
  status: r.status,
  adminNote: r.admin_note ?? "",
  createdAt: r.created_at,
});

async function me() {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, user: null } as const;
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user } as const;
}

/* ── Demander ───────────────────────────────────────────────────────────── */

const MoveInput = z
  .object({
    services: z.array(z.string()).min(1, "Choisissez au moins un service.").max(5)
      .refine((a) => a.every(isMoveService), "Service inconnu."),
    fromCity: z.string().trim().min(2, "Indiquez la localité du logement quitté.").max(80),
    toCity: z.string().trim().max(80).default(""),
    moveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
    rooms: z.number().min(1).max(20).nullable(),
    details: z.string().trim().max(1500).default(""),
    name: z.string().trim().min(2, "Indiquez votre nom.").max(80),
    email: z.string().trim().email("E-mail invalide.").max(160).optional().or(z.literal("")),
    phone: z.string().trim().max(40).optional().or(z.literal("")),
    consent: z.literal(true, { message: "Votre accord est nécessaire pour transmettre la demande." }),
    propertyId: z.string().uuid().optional().or(z.literal("")),
    website: z.string().optional(),
  })
  .refine((v) => Boolean(v.email) || Boolean(v.phone), { message: "Laissez un e-mail ou un téléphone." });

export async function createMoveRequest(raw: z.input<typeof MoveInput>): Promise<Ok> {
  const parsed = MoveInput.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  const v = parsed.data;
  if (v.website) return { ok: true }; // robot : on fait comme si.

  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "Service momentanément indisponible." };
  const { user } = await me();

  const { error } = await admin.from("move_requests").insert({
    requester_id: user?.id ?? null,
    name: v.name,
    email: v.email || null,
    phone: v.phone || null,
    from_city: v.fromCity,
    to_city: v.toCity,
    move_date: v.moveDate || null,
    rooms: v.rooms,
    services: [...new Set(v.services)],
    details: v.details,
    consent: true,
    property_id: v.propertyId || null,
  });
  if (missing(error)) return { ok: false, error: "Le service ouvre bientôt (base à mettre à jour)." };
  if (error) return { ok: false, error: "L'envoi a échoué. Réessayez." };

  notifyAdmins({
    kind: "demenagement",
    services: v.services.filter(isMoveService).map((s) => SERVICE_LABEL[s]),
    fromCity: v.fromCity,
    moveDate: v.moveDate || null,
  });
  return { ok: true };
}

/** Mes demandes (personne connectée). `ready: false` sans migration 007. */
export async function listMyMoveRequests(): Promise<{ requests: MoveRequest[]; ready: boolean }> {
  const { supabase, user } = await me();
  if (!supabase || !user) return { requests: [], ready: true };
  const { data, error } = await supabase
    .from("move_requests")
    .select(COLS)
    .eq("requester_id", user.id)
    .order("created_at", { ascending: false });
  if (missing(error)) return { requests: [], ready: false };
  return { requests: ((data ?? []) as Row[]).map(mapRow), ready: true };
}

/* ── Conciergerie (équipe E-Dome) ───────────────────────────────────────── */

async function adminOrNull() {
  const { user } = await me();
  if (!user || !isAdminEmail(user.email)) return null;
  return createAdminClient();
}

export async function listAllMoveRequests(): Promise<{ requests: MoveRequest[]; ready: boolean; allowed: boolean }> {
  const admin = await adminOrNull();
  if (!admin) return { requests: [], ready: true, allowed: false };
  const { data, error } = await admin.from("move_requests").select(COLS).order("created_at", { ascending: false }).limit(300);
  if (missing(error)) return { requests: [], ready: false, allowed: true };
  return { requests: ((data ?? []) as Row[]).map(mapRow), ready: true, allowed: true };
}

const STATUSES: MoveStatus[] = ["nouvelle", "transmise", "devis", "realisee", "annulee"];

export async function setMoveRequestStatus(id: string, status: MoveStatus, note: string): Promise<Ok> {
  if (!/^[0-9a-f-]{36}$/i.test(id) || !STATUSES.includes(status)) return { ok: false, error: "Requête invalide." };
  const admin = await adminOrNull();
  if (!admin) return { ok: false, error: "Accès réservé." };
  const { error } = await admin
    .from("move_requests")
    .update({ status, admin_note: note.trim().slice(0, 1000) })
    .eq("id", id);
  return error ? { ok: false, error: "Non enregistré." } : { ok: true };
}
