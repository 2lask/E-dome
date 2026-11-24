import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { getDashboard } from "@/lib/supabase/dashboard-actions";
import { listMyProperties } from "@/lib/supabase/property-actions";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { PERIODS, type Period } from "@/lib/dashboard-stats";

export const metadata: Metadata = { title: "Tableau de bord", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/* ── /tableau-de-bord — leads, ventes, chiffre d'affaires, en direct ───────── */
export default async function TableauDeBordPage({ searchParams }: { searchParams: Promise<{ p?: string; vue?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/connexion?redirect=%2Ftableau-de-bord");
  const sp = await searchParams;
  const p = Number(sp.p);
  const period: Period = (PERIODS as number[]).includes(p) ? (p as Period) : 30;
  const [data, mine] = await Promise.all([getDashboard(period), listMyProperties()]);
  if (!data) redirect("/auth/connexion?redirect=%2Ftableau-de-bord");
  const titles = Object.fromEntries(mine.map((b) => [b.id, b.title]));
  return <DashboardView data={data} period={period} titles={titles} initialTab={sp.vue === "apports" ? "apports" : undefined} />;
}
