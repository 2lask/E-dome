import { DashboardShell } from "@/components/dashboard/dashboard-shell";

/* Toutes les pages /dashboard/* sont enveloppees par DashboardShell
   (header EDOME + nav 5 onglets). La sidebar globale et le header
   global sont masques sur ces routes par (app)/layout.tsx. */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
