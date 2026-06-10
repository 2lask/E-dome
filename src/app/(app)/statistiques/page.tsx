import { redirect } from "next/navigation";

/* Redirect 307 : /statistiques a ete renommee en /dashboard/audience
   et integree au DashboardShell. Ce stub maintient la compatibilite
   avec d'anciens liens. */
export default function StatistiquesRedirect() {
  redirect("/dashboard/audience");
}
