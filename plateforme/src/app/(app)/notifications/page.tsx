"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Calendar,
  MessageCircle,
  Heart,
  MessageSquare,
  UserPlus,
  CreditCard,
  Link2,
  Settings,
  CheckCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { notifications as initialNotifications } from "@/lib/mock-data";
import type { Notification } from "@/lib/types";

// ─── Icon map by notification type ──────────────────────

const typeIcons: Record<Notification["type"], React.ComponentType<{ className?: string }>> = {
  reservation: Calendar,
  message: MessageCircle,
  like: Heart,
  comment: MessageSquare,
  follow: UserPlus,
  payment: CreditCard,
  referral: Link2,
  system: Settings,
};

const typeColors: Record<Notification["type"], string> = {
  reservation: "bg-blue-500/15 text-blue-400",
  message: "bg-[#C4956A]/15 text-[#C4956A]",
  like: "bg-pink-500/15 text-pink-400",
  comment: "bg-purple-500/15 text-purple-400",
  follow: "bg-green-500/15 text-green-400",
  payment: "bg-emerald-500/15 text-emerald-400",
  referral: "bg-yellow-500/15 text-yellow-400",
  system: "bg-white/10 text-[var(--text-secondary)]",
};

// ─── Helpers ────────────────────────────────────────────

function getDateGroup(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const weekAgo = new Date(today.getTime() - 7 * 86400000);

  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (d.getTime() >= today.getTime()) return "Aujourd'hui";
  if (d.getTime() >= yesterday.getTime()) return "Hier";
  if (d.getTime() >= weekAgo.getTime()) return "Cette semaine";
  return "Plus ancien";
}

function formatNotifTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days === 1) return "Hier";
  if (days < 7) return `Il y a ${days} jours`;
  return new Intl.DateTimeFormat("fr-CH", { day: "numeric", month: "long" }).format(date);
}

// ─── Component ──────────────────────────────────────────

type FilterTab = "all" | "unread";

const typeFilterChips: { key: string; label: string; types: Notification["type"][] }[] = [
  { key: "all", label: "Toutes", types: [] },
  { key: "reservations", label: "Réservations", types: ["reservation"] },
  { key: "messages", label: "Messages", types: ["message", "comment"] },
  { key: "apporteurs", label: "Apporteurs", types: ["referral", "follow"] },
  { key: "formations", label: "Formations", types: ["like", "payment"] },
  { key: "systeme", label: "Système", types: ["system"] },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = useMemo(() => {
    let result = notifications;
    if (filter === "unread") result = result.filter((n) => !n.read);
    if (typeFilter !== "all") {
      const chip = typeFilterChips.find((c) => c.key === typeFilter);
      if (chip && chip.types.length > 0) {
        result = result.filter((n) => chip.types.includes(n.type));
      }
    }
    return result;
  }, [notifications, filter, typeFilter]);

  const typeFilterCounts = useMemo(() => {
    const base = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;
    const counts: Record<string, number> = { all: base.length };
    typeFilterChips.forEach((chip) => {
      if (chip.key === "all") return;
      counts[chip.key] = base.filter((n) => chip.types.includes(n.type)).length;
    });
    return counts;
  }, [notifications, filter]);

  // Group by date
  const grouped = useMemo(() => {
    const groups: { label: string; items: Notification[] }[] = [];
    let currentLabel = "";
    for (const notif of filtered) {
      const label = getDateGroup(notif.createdAt);
      if (label !== currentLabel) {
        currentLabel = label;
        groups.push({ label, items: [] });
      }
      groups[groups.length - 1].items.push(notif);
    }
    return groups;
  }, [filtered]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "Toutes" },
    { key: "unread", label: "Non lues" },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C4956A]/15">
            <Bell className="h-5 w-5 text-[#C4956A]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Notifications</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {unreadCount > 0
                ? `${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${unreadCount > 1 ? "s" : ""}`
                : "Aucune notification non lue"}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium text-[#C4956A] transition-colors hover:bg-[#C4956A]/10"
          >
            <CheckCheck className="h-4 w-4" />
            Tout marquer comme lu
          </button>
        )}
      </motion.div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={cn(
              "flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all",
              filter === tab.key
                ? "bg-[#C4956A]/20 text-[#C4956A]"
                : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
            )}
          >
            {tab.label}
            {tab.key === "unread" && unreadCount > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C4956A] px-1.5 text-[10px] font-bold text-black">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Type filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        {typeFilterChips.map((chip) => (
          <button
            key={chip.key}
            onClick={() => setTypeFilter(chip.key)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              typeFilter === chip.key
                ? "bg-[#C4956A]/15 text-[#C4956A]"
                : "text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--foreground)]"
            )}
          >
            {chip.label}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                typeFilter === chip.key
                  ? "bg-[#C4956A]/20 text-[#C4956A]"
                  : "bg-white/[0.06] text-[var(--text-muted)]"
              )}
            >
              {typeFilterCounts[chip.key] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Notifications list */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-[var(--card-border)] bg-[var(--card)] py-20"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--card)]">
            {filter === "unread" ? (
              <CheckCheck className="h-8 w-8 text-[var(--text-muted)]" />
            ) : (
              <Bell className="h-8 w-8 text-[var(--text-muted)]" />
            )}
          </div>
          <p className="mt-4 text-lg font-medium text-[var(--text-secondary)]">
            {filter === "unread"
              ? "Vous êtes à jour !"
              : "Aucune notification"}
          </p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {filter === "unread"
              ? "Toutes vos notifications ont été lues"
              : "Vos notifications apparaîtront ici"}
          </p>
          {filter === "unread" && (
            <button
              onClick={() => setFilter("all")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#C4956A]/30 px-5 py-2.5 text-sm font-medium text-[#C4956A] transition-colors hover:bg-[#C4956A]/5"
            >
              Voir toutes les notifications
            </button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-6">
          {grouped.map((group) => (
            <div key={group.label}>
              {/* Date group label */}
              <div className="mb-3 flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  {group.label}
                </span>
                <div className="h-px flex-1 bg-white/[0.06]" />
              </div>

              {/* Notification cards */}
              <div className="space-y-2">
                <AnimatePresence>
                  {group.items.map((notif, i) => {
                    const Icon = typeIcons[notif.type];
                    const colorClass = typeColors[notif.type];

                    return (
                      <motion.button
                        key={notif.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => handleMarkRead(notif.id)}
                        className={cn(
                          "group flex w-full items-start gap-4 rounded-xl border bg-[var(--card)] p-4 text-left transition-all hover:border-[#C4956A]/20 hover:bg-[var(--card)]/80",
                          notif.read
                            ? "border-[var(--card-border)]"
                            : "border-[#C4956A]/10 bg-[#C4956A]/[0.02]"
                        )}
                      >
                        {/* Icon */}
                        <div
                          className={cn(
                            "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl",
                            colorClass
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={cn(
                                "text-sm font-medium",
                                notif.read ? "text-[var(--text-secondary)]" : "text-[var(--foreground)]"
                              )}
                            >
                              {notif.title}
                            </p>
                            <div className="flex flex-shrink-0 items-center gap-2">
                              <span className="text-[11px] text-[var(--text-muted)]">
                                {formatNotifTime(notif.createdAt)}
                              </span>
                              {/* Gold dot for unread */}
                              {!notif.read && (
                                <span className="h-2.5 w-2.5 rounded-full bg-[#C4956A]" />
                              )}
                            </div>
                          </div>
                          <p
                            className={cn(
                              "mt-0.5 text-sm leading-relaxed",
                              notif.read ? "text-[var(--text-muted)]" : "text-[var(--text-secondary)]"
                            )}
                          >
                            {notif.message}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
