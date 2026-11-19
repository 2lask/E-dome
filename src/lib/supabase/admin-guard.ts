import "server-only";

/* ── Qui est administrateur ? ────────────────────────────────────────────────
   Les adresses listées dans EDOME_ADMIN_EMAILS (séparées par des virgules).
   Rien n'est écrit en dur dans le code. */

export function adminEmails(): string[] {
  return (process.env.EDOME_ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  return !!email && adminEmails().includes(email.toLowerCase());
}
