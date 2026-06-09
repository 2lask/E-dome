"use client";

import { useMemo, useState } from "react";
import { Download, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterChip } from "@/components/ui/filter-chip";
import {
  KpiCardPremium,
  KpiGrid,
} from "@/components/dashboard/kpi-card-premium";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ReviewCard } from "@/components/dashboard/review-card";
import {
  reviews as allReviews,
  reviewsSummary,
  type ReviewSource,
} from "@/lib/dashboard-data";

const FILTERS: { value: ReviewSource | "all"; label: string }[] = [
  { value: "all", label: "Tout" },
  { value: "bien", label: "Biens" },
  { value: "formation", label: "Formations" },
  { value: "evenement", label: "Événements" },
];

export default function AvisPage() {
  const [filter, setFilter] = useState<ReviewSource | "all">("all");
  const [showLowOnly, setShowLowOnly] = useState(false);

  const filtered = useMemo(() => {
    return allReviews
      .filter((r) => filter === "all" || r.source === filter)
      .filter((r) => !showLowOnly || r.rating <= 3)
      .sort(
        (a, b) =>
          new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
      );
  }, [filter, showLowOnly]);

  const counts = useMemo(() => {
    const c: Record<ReviewSource | "all", number> = {
      all: allReviews.length,
      bien: 0,
      formation: 0,
      evenement: 0,
    };
    allReviews.forEach((r) => {
      c[r.source] += 1;
    });
    return c;
  }, []);

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Avis & notations"
        description="Avis reçus sur vos biens, formations et événements"
        actions={
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        }
      />

      <KpiGrid>
        <KpiCardPremium
          label="Note moyenne"
          value={reviewsSummary.avg.toFixed(2)}
          delta={`${reviewsSummary.total} avis`}
          trend="up"
          footer="Toutes sources confondues"
          subfooter="Pondérée par récence"
        />
        <KpiCardPremium
          label="Avis à répondre"
          value={String(reviewsSummary.pendingResponse)}
          delta={reviewsSummary.pendingResponse > 0 ? "Action requise" : "À jour"}
          trend={reviewsSummary.pendingResponse > 0 ? "neutral" : "up"}
          footer="Réponses publiques manquantes"
          subfooter="Impact SEO direct"
        />
        <KpiCardPremium
          label="Avis ≤ 3★"
          value={String(reviewsSummary.low)}
          delta={reviewsSummary.low > 0 ? "À surveiller" : "Aucun"}
          trend={reviewsSummary.low > 0 ? "down" : "up"}
          footer="Qualité service en alerte"
          subfooter="Répondre sous 48h"
        />
        <KpiCardPremium
          label="Canaux"
          value="3"
          delta="E-Dome · Airbnb · Booking"
          trend="up"
          footer="Cross-channel"
          subfooter="Source unique consolidée"
        />
      </KpiGrid>

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <FilterChip
            key={f.value}
            active={filter === f.value}
            onClick={() => setFilter(f.value)}
            count={counts[f.value]}
          >
            {f.label}
          </FilterChip>
        ))}
        <FilterChip
          active={showLowOnly}
          onClick={() => setShowLowOnly(!showLowOnly)}
        >
          <Star className="h-3 w-3" />
          ≤ 3★ seulement
        </FilterChip>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
          Aucun avis ne correspond à ces filtres.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}
    </div>
  );
}
