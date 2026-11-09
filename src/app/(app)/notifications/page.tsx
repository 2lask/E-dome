"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  BellOff,
  MessageCircle,
  Calendar,
  Heart,
  UserPlus,
  Bell as BellIcon,
  CircleDollarSign,
  type LucideIcon,
} from "lucide-react";
import type { Notification } from "@/lib/types";
import { frDate } from "@/lib/demo/showcase";
import { PageHeader } from "@/components/ui/page-header";
import { useSession, markNotificationsAsRead, markAllNotificationsAsRead } from "@/lib/use-session";

/* ── /notifications — une seule source ──────────────────────────────────────

   Trois compteurs se contredisaient : « 3 » en dur dans la barre latérale,
   « aucune » dans l'en-tête, cinq non lues ici, sur dix notifications
   inventées (« Sophie Martin », « Penthouse Zurich »…). Tout vient désormais
   de la mémoire de session (`useSession`) : l'amorce, réécrite sur le casting
   et le journal, plus ce que produit chaque action de la visite (une demande
   de visite, une réservation, une annonce publiée…). « Tout marquer comme
   lu » remet le compteur à zéro partout à la fois. */

/** « 14:05 » sans `toLocaleTimeString` (l'ICU serveur et navigateur diffèrent). */
function hhmm(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

type FilterType = "all" | "reservation" | "message" | "follow" | "review" | "system" | "payment";

const FILTER_CHIPS: { key: FilterType; label: string; types: Notification["type"][] }[] = [
  { key: "reservation", label: "Réservations", types: ["reservation"] },
  { key: "message", label: "Messages", types: ["message"] },
  { key: "follow", label: "Abonnés", types: ["follow"] },
  { key: "review", label: "Avis", types: ["review"] },
  { key: "payment", label: "Offres", types: ["payment"] },
  { key: "system", label: "Système", types: ["system"] },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications } = useSession();
  const [readTab, setReadTab] = useState<"unread" | "read">("unread");
  const [filter, setFilter] = useState<FilterType>("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: 0 };
    FILTER_CHIPS.forEach((f) => { c[f.key] = 0; });
    notifications.forEach((n) => {
      if (!n.read) {
        c.all++;
        const chip = FILTER_CHIPS.find((f) => f.types.includes(n.type));
        if (chip) c[chip.key]++;
      }
    });
    return c;
  }, [notifications]);

  const filtered = useMemo(() => {
    let items = notifications.filter((n) => (readTab === "unread" ? !n.read : n.read));
    if (filter !== "all") {
      const chip = FILTER_CHIPS.find((f) => f.key === filter);
      if (chip) items = items.filter((n) => chip.types.includes(n.type));
    }
    return items;
  }, [notifications, readTab, filter]);

  // Group by date
  const grouped = useMemo(() => {
    const groups: Record<string, Notification[]> = {};
    filtered.forEach((n) => {
      const key = frDate(n.createdAt);
      if (!groups[key]) groups[key] = [];
      groups[key].push(n);
    });
    return groups;
  }, [filtered]);

  const markAsRead = useCallback((id: string) => markNotificationsAsRead([id]), []);

  const handleClick = useCallback(
    (notif: Notification) => {
      markAsRead(notif.id);
      router.push(notif.href);
    },
    [markAsRead, router]
  );

  const typeIcons: Record<Notification["type"], LucideIcon> = {
    message: MessageCircle,
    reservation: Calendar,
    review: Heart,
    follow: UserPlus,
    system: BellIcon,
    payment: CircleDollarSign,
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 animate-fade-in">
      <PageHeader
        title="Notifications"
        variant="serif"
        className="mb-6"
        actions={
          counts.all > 0 ? (
            <button
              onClick={() => markAllNotificationsAsRead()}
              className="text-sm text-[var(--primary)] hover:underline transition-colors cursor-pointer"
            >
              Tout marquer comme lu
            </button>
          ) : undefined
        }
      />

      {/* Read / Unread tabs */}
      <div className="flex gap-1 mb-4">
        <button
          onClick={() => setReadTab("unread")}
          className={`px-4 py-2 text-sm rounded-xl transition-colors ${
            readTab === "unread"
              ? "bg-[var(--primary)] text-white"
              : "text-[var(--text-muted)] hover:bg-[var(--hover-bg)]"
          }`}
        >
          Non lues {counts.all > 0 && `(${counts.all})`}
        </button>
        <button
          onClick={() => setReadTab("read")}
          className={`px-4 py-2 text-sm rounded-xl transition-colors ${
            readTab === "read"
              ? "bg-[var(--primary)] text-white"
              : "text-[var(--text-muted)] hover:bg-[var(--hover-bg)]"
          }`}
        >
          Lues
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${
            filter === "all"
              ? "bg-[var(--foreground)] text-[var(--background)]"
              : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--text-secondary)]"
          }`}
        >
          Tout
        </button>
        {FILTER_CHIPS.map((chip) => (
          <button
            key={chip.key}
            onClick={() => setFilter(chip.key)}
            className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${
              filter === chip.key
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--text-secondary)]"
            }`}
          >
            {chip.label}
            {counts[chip.key] > 0 && ` (${counts[chip.key]})`}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-[var(--card)] text-[var(--text-muted)] flex items-center justify-center mx-auto mb-4">
            <BellOff size={26} strokeWidth={1.8} />
          </div>
          <p className="text-[var(--text-muted)]">Aucune notification.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <h3 className="text-xs font-medium text-[var(--text-muted)] mb-3">{date}</h3>
              <div className="space-y-2">
                {items.map((notif) => {
                  const TypeIcon = typeIcons[notif.type];
                  return (
                  <button
                    key={notif.id}
                    onClick={() => handleClick(notif)}
                    className={`w-full flex items-start gap-3 p-4 rounded-xl text-left transition-colors ${
                      notif.read
                        ? "bg-[var(--card)] hover:bg-[var(--hover-bg)]"
                        : "bg-[var(--primary)]/5 border border-[var(--primary)]/10 hover:bg-[var(--primary)]/10"
                    }`}
                  >
                    <span
                      className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        background: notif.read
                          ? "var(--hover-bg)"
                          : "color-mix(in srgb, var(--accent) 18%, transparent)",
                        color: notif.read ? "var(--text-secondary)" : "var(--accent)",
                      }}
                    >
                      <TypeIcon size={16} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm font-medium ${notif.read ? "text-[var(--foreground)]" : "text-[var(--foreground)]"}`}>
                          {notif.title}
                        </span>
                        {!notif.read && (
                          <div className="w-2 h-2 rounded-full bg-[var(--primary)] flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">{notif.message}</p>
                      <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
                        {hhmm(notif.createdAt)}
                      </span>
                    </div>
                  </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
