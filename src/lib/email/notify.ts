import "server-only";
import { after } from "next/server";
import { createAdminClient } from "../supabase/admin";
import { adminEmails } from "../supabase/admin-guard";
import { buildEmail, type Notice } from "./templates";

/* ── Envoi des notifications (serveur uniquement) ────────────────────────────
   Fournisseur : Resend, par son API HTTP (aucune dépendance). Variables :
     RESEND_API_KEY      clé d'envoi (jamais préfixée NEXT_PUBLIC_)
     EDOME_EMAIL_FROM    expéditeur vérifié, ex. « E-Dome <notifications@…> »
     NEXT_PUBLIC_SITE_URL adresse publique du site (liens des e-mails)
   Sans ces variables : rien n'est envoyé et rien ne casse.

   L'envoi se fait APRÈS la réponse (`after`) : une panne du fournisseur ne
   ralentit ni ne fait échouer une action. L'adresse du destinataire est lue
   dans l'authentification (clé de service) — jamais transmise par le
   navigateur. Préférence : `user_metadata.email_notifications === false`
   coupe tout (réglage dans /parametres/notifications). */

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EDOME_EMAIL_FROM && process.env.NEXT_PUBLIC_SITE_URL);
}

async function send(to: string[], notice: Notice): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EDOME_EMAIL_FROM;
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (!key || !from || !site || to.length === 0) return;
  const email = buildEmail(notice, site);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject: email.subject, html: email.html, text: email.text }),
      signal: AbortSignal.timeout(8000),
    });
    /* Journal minimal : le type d'événement et le statut, jamais l'adresse. */
    if (!res.ok) console.warn(`[notify] ${notice.kind} : échec ${res.status}`);
  } catch {
    console.warn(`[notify] ${notice.kind} : fournisseur injoignable`);
  }
}

async function deliver(userId: string, notice: Notice): Promise<void> {
  const admin = createAdminClient();
  if (!admin) return;
  const { data, error } = await admin.auth.admin.getUserById(userId);
  const user = data?.user;
  if (error || !user?.email) return;
  if (user.user_metadata?.email_notifications === false) return;
  await send([user.email], notice);
}

/** Programme une notification pour un membre, après la réponse. Ne lève jamais. */
export function notifyUser(userId: string | null | undefined, notice: Notice): void {
  if (!userId || !isEmailConfigured()) return;
  try {
    after(() => deliver(userId, notice));
  } catch {
    /* Hors contexte de requête (tests) : on n'envoie rien. */
  }
}

/** Prévient l'équipe E-Dome (EDOME_ADMIN_EMAILS), après la réponse. */
export function notifyAdmins(notice: Notice): void {
  const to = adminEmails();
  if (to.length === 0 || !isEmailConfigured()) return;
  try {
    after(() => send(to, notice));
  } catch {
    /* Hors contexte de requête : rien. */
  }
}
