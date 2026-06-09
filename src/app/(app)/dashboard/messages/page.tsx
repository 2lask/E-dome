"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Send,
  Search as SearchIcon,
  MessageCircle,
  Paperclip,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { FilterChip } from "@/components/ui/filter-chip";
import {
  KpiCardPremium,
  KpiGrid,
} from "@/components/dashboard/kpi-card-premium";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import {
  messageThreads,
  messagesSummary,
} from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

/* /dashboard/messages : inbox guest unifie (E-Dome + Airbnb +
   WhatsApp + SMS). Layout 2-cols : liste threads (gauche) +
   conversation selectionnee (droite). */

const CHANNEL_BADGE: Record<string, string> = {
  edome: "E-Dome",
  airbnb: "Airbnb",
  whatsapp: "WhatsApp",
  sms: "SMS",
};

export default function MessagesPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string>(messageThreads[0]?.id);

  const filtered = useMemo(() => {
    return messageThreads
      .filter((t) => filter === "all" || t.unread > 0)
      .filter(
        (t) =>
          !search ||
          t.contactName.toLowerCase().includes(search.toLowerCase()) ||
          t.context.toLowerCase().includes(search.toLowerCase()),
      );
  }, [filter, search]);

  const selected = messageThreads.find((t) => t.id === selectedId);

  const avgResponseTime = "12 min"; // dummy mais coherent
  const responseRate = 96;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Messages"
        description="Inbox guest unifiée · E-Dome, Airbnb, WhatsApp, SMS"
        actions={
          <Button size="sm">
            <Send className="mr-2 h-4 w-4" />
            Nouveau message
          </Button>
        }
      />

      <KpiGrid>
        <KpiCardPremium
          label="Conversations"
          value={String(messagesSummary.total)}
          delta={`${messagesSummary.threadsWithUnread} avec non lus`}
          trend="neutral"
          footer="Toutes plateformes"
          subfooter="Cross-channel consolidé"
        />
        <KpiCardPremium
          label="Messages non lus"
          value={String(messagesSummary.unread)}
          delta={messagesSummary.unread > 0 ? "Action requise" : "À jour"}
          trend={messagesSummary.unread > 0 ? "neutral" : "up"}
          footer="À répondre rapidement"
          subfooter="Impact réservation"
        />
        <KpiCardPremium
          label="Temps de réponse moyen"
          value={avgResponseTime}
          delta="-3 min"
          trend="up"
          footer="Très réactif"
          subfooter="Au-dessus du benchmark"
        />
        <KpiCardPremium
          label="Taux de réponse"
          value={`${responseRate}%`}
          delta="+2 pts"
          trend="up"
          footer="Engagement élevé"
          subfooter="Sur 7 derniers jours"
        />
      </KpiGrid>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Liste threads */}
        <Card className="lg:col-span-5">
          <CardHeader className="gap-3 pb-3">
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un contact, une réservation..."
              leadingIcon={SearchIcon}
            />
            <div className="flex gap-2">
              <FilterChip
                active={filter === "all"}
                onClick={() => setFilter("all")}
                count={messagesSummary.total}
              >
                Tout
              </FilterChip>
              <FilterChip
                active={filter === "unread"}
                onClick={() => setFilter("unread")}
                count={messagesSummary.unread}
              >
                Non lus
              </FilterChip>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Aucune conversation ne correspond.
              </p>
            ) : (
              filtered.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedId(t.id)}
                  className={cn(
                    "w-full rounded-lg border p-3 text-left transition-colors",
                    selectedId === t.id
                      ? "border-foreground bg-muted/50"
                      : "hover:bg-muted/40",
                  )}
                >
                  <div className="flex gap-3">
                    <Avatar name={t.contactName} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium">
                          {t.contactName}
                        </p>
                        <span className="shrink-0 text-[11px] text-muted-foreground">
                          {t.lastAt}
                        </span>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {t.context}
                      </p>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <p
                          className={cn(
                            "truncate text-xs",
                            t.unread > 0
                              ? "font-medium text-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          {t.lastMessage}
                        </p>
                        <div className="flex shrink-0 items-center gap-1.5">
                          <Badge
                            variant="info"
                            shape="square"
                            className="text-[10px]"
                          >
                            {CHANNEL_BADGE[t.channel]}
                          </Badge>
                          {t.unread > 0 && (
                            <Badge
                              variant="default"
                              shape="pill"
                              className="h-5 min-w-5 justify-center px-1.5 text-[10px]"
                            >
                              {t.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        {/* Detail conversation */}
        <Card className="lg:col-span-7">
          {selected ? (
            <>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-3">
                  <Avatar name={selected.contactName} size="md" />
                  <div>
                    <CardTitle>{selected.contactName}</CardTitle>
                    <CardDescription>{selected.context}</CardDescription>
                  </div>
                </div>
                <Badge variant="info" shape="square">
                  {CHANNEL_BADGE[selected.channel]}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Conversation factice : derniers messages echanges */}
                <div className="space-y-3">
                  <Bubble
                    side="left"
                    name={selected.contactInitials}
                    at={selected.lastAt}
                  >
                    {selected.lastMessage}
                  </Bubble>
                  <Bubble side="right" name="LM" at="Il y a 2 min">
                    Bonjour, le check-in est possible à partir de 16h. Je vous
                    envoie le code d&apos;accès la veille.
                  </Bubble>
                </div>

                {/* Composer */}
                <div className="space-y-2 rounded-lg border bg-muted/20 p-3">
                  <textarea
                    rows={3}
                    placeholder="Écrire un message..."
                    className="w-full resize-none bg-transparent text-sm focus:outline-none"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="mr-2 h-4 w-4" />
                      Joindre
                    </Button>
                    <Button size="sm">
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer
                    </Button>
                  </div>
                </div>

                <p className="text-center text-[11px] text-muted-foreground">
                  Modèles : <Link href="#" className="underline">Bienvenue</Link>{" "}
                  · <Link href="#" className="underline">Code accès</Link> ·{" "}
                  <Link href="#" className="underline">Check-out</Link>
                </p>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex h-full flex-col items-center justify-center py-16 text-center">
              <MessageCircle className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Sélectionnez une conversation
              </p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}

function Bubble({
  side,
  name,
  at,
  children,
}: {
  side: "left" | "right";
  name: string;
  at: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex gap-2",
        side === "right" && "flex-row-reverse",
      )}
    >
      <Avatar name={name} size="xs" />
      <div className={cn("max-w-[75%] space-y-1", side === "right" && "text-right")}>
        <div
          className={cn(
            "inline-block rounded-lg px-3 py-2 text-sm",
            side === "left"
              ? "bg-muted text-foreground"
              : "bg-primary text-primary-foreground",
          )}
        >
          {children}
        </div>
        <p className="text-[10px] text-muted-foreground">{at}</p>
      </div>
    </div>
  );
}
