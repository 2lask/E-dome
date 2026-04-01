"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Notification } from "@/lib/types";
import { formatDate } from "@/lib/utils";

// ─── Mock data ──────────────────────────────────────────────────────────────

const initialNotifications: Notification[] = [
  { id: "n1", type: "reservation", title: "Nouvelle réservation", message: "Sophie Martin a réservé le Chalet Alpin du 10 au 17 juillet.", read: false, createdAt: "2026-04-01T09:00:00", href: "/reservations" },
  { id: "n2", type: "message", title: "Nouveau message", message: "Jean Dupont vous a envoyé un message.", read: false, createdAt: "2026-04-01T08:30:00", href: "/messages" },
  { id: "n3", type: "payment", title: "Paiement reçu", message: "Vous avez reçu un paiement de 1'200 CHF.", read: false, createdAt: "2026-03-31T16:00:00", href: "/dashboard" },
  { id: "n4", type: "review", title: "Nouvel avis", message: "Marie Leroy a laissé un avis 5 étoiles.", read: true, createdAt: "2026-03-31T10:00:00", href: "/profil" },
  { id: "n5", type: "follow", title: "Nouvel abonné", message: "Paul Moreau vous suit maintenant.", read: true, createdAt: "2026-03-30T14:00:00", href: "/profil" },
  { id: "n6", type: "system", title: "Mise à jour", message: "Nouvelle fonctionnalité : export CSV disponible dans le dashboard.", read: true, createdAt: "2026-03-30T09:00:00", href: "/dashboard" },
  { id: "n7", type: "reservation", title: "Réservation confirmée", message: "Votre réservation #R-2024-005 a été confirmée.", read: true, createdAt: "2026-03-29T11:00:00", href: "/reservations" },
  { id: "n8", type: "message", title: "Nouveau message", message: "Claire Richard vous a envoyé un message.", read: false, createdAt: "2026-03-29T08:00:00", href: "/messages" },
  { id: "n9", type: "system", title: "Maintenance prévue", message: "Une maintenance est prévue le 5 avril de 2h à 4h.", read: true, createdAt: "2026-03-28T15:00:00", href: "/dashboard" },
  { id: "n10", type: "reservation", title: "Annulation", message: "La réservation #R-2024-042 a été annulée.", read: true, createdAt: "2026-03-27T10:00:00", href: "/reservations" },
];

type FilterType = "all" | "reservation" | "message" | "follow" | "review" | "system" | "payment";

const FILTER_CHIPS: { key: FilterType; label: string; types: Notification["type"][] }[] = [
  { key: "reservation", label: "Réservations", types: ["reservation"] },
  { key: "message", label: "Messages", types: ["message"] },
  { key: "follow", label: "Apporteurs", types: ["follow"] },
  { key: "review", label: "Formations", types: ["review"] },
  { key: "system", label: "Système", types: ["system", "payment"] },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);
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
      const key = formatDate(n.createdAt);
      if (!groups[key]) groups[key] = [];
      groups[key].push(n);
    });
    return groups;
  }, [filtered]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const handleClick = useCallback(
    (notif: Notification) => {
      markAsRead(notif.id);
      router.push(notif.href);
    },
    [markAsRead, router]
  );

  const typeIcons: Record<Notification["type"], string> = {
    message: "💬",
    reservation: "📋",
    review: "⭐",
    follow: "👤",
    system: "🔔",
    payment: "💰",
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">Notifications</h1>

      {/* Read / Unread tabs */}
      <div className="flex gap-1 mb-4">
        <button
          onClick={() => setReadTab("unread")}
          className={`px-4 py-2 text-sm rounded-xl transition-colors ${
            readTab === "unread"
              ? "bg-[#C4956A] text-white"
              : "text-[var(--text-muted)] hover:bg-[var(--hover-bg)]"
          }`}
        >
          Non lues {counts.all > 0 && `(${counts.all})`}
        </button>
        <button
          onClick={() => setReadTab("read")}
          className={`px-4 py-2 text-sm rounded-xl transition-colors ${
            readTab === "read"
              ? "bg-[#C4956A] text-white"
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
          <div className="w-16 h-16 rounded-full bg-[var(--card)] flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔔</span>
          </div>
          <p className="text-[var(--text-muted)]">Aucune notification.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <h3 className="text-xs font-medium text-[var(--text-muted)] mb-3">{date}</h3>
              <div className="space-y-2">
                {items.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => handleClick(notif)}
                    className={`w-full flex items-start gap-3 p-4 rounded-xl text-left transition-colors ${
                      notif.read
                        ? "bg-[var(--card)] hover:bg-[var(--hover-bg)]"
                        : "bg-[#C4956A]/5 border border-[#C4956A]/10 hover:bg-[#C4956A]/10"
                    }`}
                  >
                    <span className="text-lg flex-shrink-0 mt-0.5">{typeIcons[notif.type]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm font-medium ${notif.read ? "text-[var(--foreground)]" : "text-[var(--foreground)]"}`}>
                          {notif.title}
                        </span>
                        {!notif.read && (
                          <div className="w-2 h-2 rounded-full bg-[#C4956A] flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">{notif.message}</p>
                      <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
                        {new Date(notif.createdAt).toLocaleTimeString("fr-CH", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
