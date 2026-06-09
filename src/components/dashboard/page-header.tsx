import type { ReactNode } from "react";
import { PageHeader } from "@/components/ui/page-header";

/* DashboardPageHeader = alias historique vers PageHeader variant
   default. Garde l'API pour ne pas casser les 5 pages dashboard. */

interface DashboardPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function DashboardPageHeader(props: DashboardPageHeaderProps) {
  return <PageHeader {...props} variant="default" />;
}
