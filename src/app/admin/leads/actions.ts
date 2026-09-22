"use server";

import { redirect } from "next/navigation";
import { signInAdmin, signOutAdmin } from "@/lib/leads/admin-auth";

/* Connexion et déconnexion de /admin/leads.

   En cas d'échec, on redirige avec un simple indicateur dans l'URL plutôt que
   de renvoyer un détail : ni « mot de passe incorrect » ni « aucun mot de
   passe configuré », qui renseigneraient un visiteur sur l'état du système. */

export async function loginAction(formData: FormData): Promise<void> {
  const attempt = String(formData.get("password") ?? "");
  const ok = await signInAdmin(attempt);
  redirect(ok ? "/admin/leads" : "/admin/leads?erreur=1");
}

export async function logoutAction(): Promise<void> {
  await signOutAdmin();
  redirect("/admin/leads");
}
