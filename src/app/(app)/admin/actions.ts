"use server";

import { redirect } from "next/navigation";
import { signInAdmin, signOutAdmin } from "@/lib/leads/admin-auth";

/* Connexion et déconnexion de la console de démonstration `/admin`.

   Même porte que `/admin/leads` (un seul `ADMIN_PASSWORD`, cookie de session
   au chemin `/admin`), mais les redirections restent sur `/admin`. En cas
   d'échec, un simple indicateur dans l'URL, sans détail sur l'état du système. */

export async function loginAction(formData: FormData): Promise<void> {
  const attempt = String(formData.get("password") ?? "");
  const ok = await signInAdmin(attempt);
  redirect(ok ? "/admin" : "/admin?erreur=1");
}

export async function logoutAction(): Promise<void> {
  await signOutAdmin();
  redirect("/admin");
}
