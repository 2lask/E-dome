import { Star, MessageSquareReply, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Review } from "@/lib/dashboard-data";

/* ReviewCard : carte avis individuel. Stars en text-rating,
   badge source (bien/formation/event), badge canal (edome/airbnb/
   booking), reponse host ou bouton "Repondre" si pas encore. */

const SOURCE_LABEL = {
  bien: "Bien",
  formation: "Formation",
  evenement: "Événement",
} as const;

const CHANNEL_LABEL = {
  edome: "E-Dome",
  airbnb: "Airbnb",
  booking: "Booking",
} as const;

export function ReviewCard({ review }: { review: Review }) {
  const isLow = review.rating <= 3;
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar name={review.guest} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{review.guest}</p>
              <p className="truncate text-xs text-muted-foreground">
                {review.sourceName} · {new Date(review.postedAt).toLocaleDateString("fr-CH")}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Badge variant="outline" shape="square" className="text-[10px]">
              {SOURCE_LABEL[review.source]}
            </Badge>
            <Badge variant="info" shape="square" className="text-[10px]">
              {CHANNEL_LABEL[review.channel]}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < review.rating
                    ? "fill-rating text-rating"
                    : "text-muted-foreground/30",
                )}
              />
            ))}
          </div>
          <span className="text-sm font-medium tabular-nums">
            {review.rating}.0
          </span>
          {isLow && (
            <Badge variant="warning" shape="square" className="gap-1 text-[10px]">
              <AlertTriangle className="h-3 w-3" />
              À surveiller
            </Badge>
          )}
        </div>

        <div>
          <p className="text-sm font-medium">{review.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{review.body}</p>
        </div>

        {review.response ? (
          <div className="rounded-md border-l-2 border-primary bg-muted/30 p-3 text-sm">
            <p className="mb-1 text-[11px] font-medium text-muted-foreground">
              Votre réponse
            </p>
            <p className="text-sm">{review.response}</p>
          </div>
        ) : (
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <MessageSquareReply className="mr-2 h-4 w-4" />
            Répondre
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
