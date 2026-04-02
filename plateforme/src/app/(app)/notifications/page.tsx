"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Notification } from "@/lib/types";
import { formatDate } from "@/lib/utils";

// ─── Mock data ──────────────────────────────────────────────────────────────

const initialNotifications: Notification[] = [
  { id: "n1", type: "review", title: "Sophie Martin a aimé votre post", message: "Sophie Martin a aimé votre publication sur le Chalet Verbier.", read: false, createdAt: "2026-04-02T09:30:00", href: "/profil" },
  { id: "n2", type: "message", title: "Marc Dupont a commenté votre publication", message: "Marc Dupont : \"Superbe bien, je suis intéressé !\"", read: false, createdAt: "2026-04-02T09:00:00", href: "/messages" },
  { id: "n3", type: "reservation", title: "Nouvelle demande de réservation", message: "Nouvelle demande de réservation de Jean-Marc D. pour l'Appartement Montreux du 15 au 22 juillet.", read: false, createdAt: "2026-04-02T08:00:00", href: "/reservations" },
  { id: "n4", type: "payment", title: "Commission reçue : 84 CHF", message: "Vous avez reçu une commission de 84 CHF suite à la réservation générée via votre lien apporteur.", read: false, createdAt: "2026-04-02T07:00:00", href: "/dashboard" },
  { id: "n5", type: "follow", title: "Thomas Weber vous suit maintenant", message: "Thomas Weber a commencé à vous suivre.", read: false, createdAt: "2026-04-02T05:00:00", href: "/profil" },
  { id: "n6", type: "reservation", title: "Réservation confirmée", message: "Votre réservation #R-2026-018 a été confirmée par l'hôte.", read: true, createdAt: "2026-04-01T14:00:00", href: "/reservations" },
  { id: "n7", type: "system", title: "Mise à jour plateforme", message: "Nouvelle fonctionnalité : export CSV disponible dans le dashboard.", read: true, createdAt: "2026-04-01T09:00:00", href: "/dashboard" },
  { id: "n8", type: "message", title: "Nouveau message", message: "Claire Richard vous a envoyé un message concernant le Penthouse Zurich.", read: true, createdAt: "2026-03-31T16:00:00", href: "/messages" },
  { id: "n9", type: "payment", title: "Paiement reçu", message: "Vous avez reçu un paiement de 1'200 CHF pour la location du Studio Lausanne.", read: true, createdAt: "2026-03-31T10:00:00", href: "/dashboard" },
  { id: "n10", type: "system", title: "Vérification d'identité validée", message: "Votre pièce d'identité a été vérifiée avec succès. Votre profil est désormais certifié.", read: true, createdAt: "2026-03-30T11:00:00", href: "/profil" },
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
    message: "\u{1F4AC}",
    reservation: "\u{1F4C5}",
    review: "\u{2764}\u{FE0F}",
    follow: "\u{1F464}",
    system: "\u{1F514}",
    payment: "\u{1F4B0}",
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Notifications</h1>
        {counts.all > 0 && (
          <button
            onClick={() => {
              setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            }}
            className="text-sm text-[#C4956A] hover:underline transition-colors cursor-pointer"
          >
            Tout marquer comme lu
          </button>
        )}
      </div>

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
