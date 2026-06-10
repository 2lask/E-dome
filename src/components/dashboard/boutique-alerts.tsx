import Link from "next/link";
import { AlertTriangle, Package, PackageX, ShoppingBag } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataRow } from "@/components/ui/data-row";
import { boutiqueAlerts, type StockLevel } from "@/lib/dashboard-data";
import { formatNumber } from "@/lib/format";

const LEVEL: Record<
  StockLevel,
  { label: string; chip: string; icon: typeof Package }
> = {
  rupture: { label: "Rupture", chip: "chip-danger-soft", icon: PackageX },
  faible: { label: "Stock faible", chip: "chip-warning-soft", icon: AlertTriangle },
  ok: { label: "OK", chip: "bg-muted text-muted-foreground", icon: Package },
};

export function BoutiqueAlerts() {
  const items = boutiqueAlerts.filter((b) => b.level !== "ok");
  const ruptureCount = items.filter((b) => b.level === "rupture").length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            Boutique
            {ruptureCount > 0 && (
              <span className="chip-danger-soft rounded-md px-1.5 py-0.5 text-[10px] font-medium">
                {ruptureCount} rupture{ruptureCount > 1 ? "s" : ""}
              </span>
            )}
          </CardTitle>
          <CardDescription>Stock à réapprovisionner</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/annonces">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Gérer
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((p) => {
          const cfg = LEVEL[p.level];
          const Icon = cfg.icon;
          return (
            <DataRow
              key={p.id}
              leading={
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-md ${cfg.chip}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              }
              title={p.name}
              subtitle={`${p.soldThisMonth} vendus ce mois · ${formatNumber(p.price)} CHF`}
              trailing={
                <>
                  <Badge variant="outline" className={`${cfg.chip} border-0`}>
                    {p.stock === 0 ? "0" : p.stock} en stock
                  </Badge>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {cfg.label}
                  </p>
                </>
              }
            />
          );
        })}
        {items.length === 0 && (
          <p className="rounded-lg border border-dashed py-6 text-center text-sm text-muted-foreground">
            Tous les produits sont en stock.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
