"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useApp } from "@/lib/context";
import type { Reservation, User, Property } from "@/lib/types";
import { formatDate } from "@/lib/utils";

// ─── Mock data ──────────────────────────────────────────────────────────────

const mockHost: User = {
  id: "me", firstName: "Léo", lastName: "Martin", email: "", avatar: "", city: "Lausanne", country: "Suisse",
  roles: ["hote"], activeRole: "hote", stats: { followers: 0, following: 0, properties: 0, reviews: 0, rating: 0, transactions: 0, revenue: 0 }, bio: "",
};

const guests: User[] = [
  { id: "g1", firstName: "Sophie", lastName: "Bernard", email: "s@e.ch", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", city: "Genève", country: "Suisse", roles: ["client"], activeRole: "client", stats: { followers: 120, following: 45, properties: 0, reviews: 5, rating: 4.5, transactions: 3, revenue: 0 }, bio: "" },
  { id: "g2", firstName: "Jean", lastName: "Dupont", email: "j@e.ch", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", city: "Zürich", country: "Suisse", roles: ["client"], activeRole: "client", stats: { followers: 30, following: 60, properties: 0, reviews: 2, rating: 4.0, transactions: 2, revenue: 0 }, bio: "" },
  { id: "g3", firstName: "Marie", lastName: "Leroy", email: "m@e.ch", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", city: "Lyon", country: "France", roles: ["client"], activeRole: "client", stats: { followers: 80, following: 120, properties: 0, reviews: 8, rating: 4.8, transactions: 5, revenue: 0 }, bio: "" },
];

const properties: Property[] = [
  { id: "rp1", title: "Chalet Alpin Premium", description: "", type: "chalet", transactionType: "location-ct", price: 350, currency: "CHF", location: { city: "Verbier", country: "Suisse" }, images: ["https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop"], host: mockHost, bedrooms: 4, bathrooms: 3, area: 180, amenities: [], rating: 4.9, reviewCount: 28 },
  { id: "rp2", title: "Appartement Vue Lac", description: "", type: "appartement", transactionType: "location-ct", price: 180, currency: "CHF", location: { city: "Montreux", country: "Suisse" }, images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"], host: mockHost, bedrooms: 2, bathrooms: 1, area: 75, amenities: [], rating: 4.7, reviewCount: 15 },
  { id: "rp3", title: "Studio Moderne", description: "", type: "studio", transactionType: "location-ct", price: 89, currency: "CHF", location: { city: "Lausanne", country: "Suisse" }, images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"], host: mockHost, bedrooms: 1, bathrooms: 1, area: 35, amenities: [], rating: 4.5, reviewCount: 42 },
];

const mockReservations: Reservation[] = [
  { id: "r1", property: properties[0], guest: guests[0], checkIn: "2026-07-10", checkOut: "2026-07-17", status: "confirmed", totalPrice: 2450 },
  { id: "r2", property: properties[1], guest: guests[1], checkIn: "2026-04-15", checkOut: "2026-04-20", status: "pending", totalPrice: 900 },
  { id: "r3", property: properties[2], guest: guests[2], checkIn: "2026-03-01", checkOut: "2026-03-05", status: "completed", totalPrice: 356 },
  { id: "r4", property: properties[0], guest: guests[2], checkIn: "2026-05-20", checkOut: "2026-05-25", status: "pending", totalPrice: 1750 },
  { id: "r5", property: properties[1], guest: guests[0], checkIn: "2026-02-10", checkOut: "2026-02-14", status: "cancelled", totalPrice: 720 },
];

type StatusFilter = "all" | "pending" | "confirmed" | "cancelled" | "completed";

const statusLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  cancelled: "Annulée",
  completed: "Terminée",
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400",
  confirmed: "bg-emerald-500/20 text-emerald-400",
  cancelled: "bg-red-500/20 text-red-400",
  completed: "bg-blue-500/20 text-blue-400",
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function ReservationsPage() {
  const { formatPrice } = useApp();
  const [reservations, setReservations] = useState(mockReservations);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [confirmModal, setConfirmModal] = useState<{ id: string; action: "confirm" | "cancel" } | null>(null);
  const [reviewModal, setReviewModal] = useState<string | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return reservations;
    return reservations.filter((r) => r.status === statusFilter);
  }, [reservations, statusFilter]);

  // Summary stats
  const stats = useMemo(() => {
    const total = reservations.length;
    const confirmed = reservations.filter((r) => r.status === "confirmed").length;
    const pending = reservations.filter((r) => r.status === "pending").length;
    const revenue = reservations
      .filter((r) => r.status === "confirmed" || r.status === "completed")
      .reduce((s, r) => s + r.totalPrice, 0);
    return { total, confirmed, pending, revenue };
  }, [reservations]);

  const handleAction = useCallback((id: string, action: "confirm" | "cancel") => {
    setReservations((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: action === "confirm" ? "confirmed" : "cancelled" }
          : r
      ) as Reservation[]
    );
    setConfirmModal(null);
  }, []);

  // Timeline progress
  const getProgress = (checkIn: string, checkOut: string, status: string) => {
    if (status === "cancelled") return 0;
    if (status === "completed") return 100;
    const now = new Date().getTime();
    const start = new Date(checkIn).getTime();
    const end = new Date(checkOut).getTime();
    if (now < start) return 10; // Upcoming
    if (now > end) return 100;
    return Math.round(((now - start) / (end - start)) * 100);
  };

  // Calendar view - simple month grid
  const calendarDays = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: { day: number; hasReservation: boolean }[] = [];
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      days.push({ day: 0, hasReservation: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const hasRes = reservations.some((r) => {
        return dateStr >= r.checkIn && dateStr <= r.checkOut && r.status !== "cancelled";
      });
      days.push({ day: d, hasReservation: hasRes });
    }
    return days;
  }, [reservations]);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">Réservations</h1>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: stats.total },
          { label: "Confirmées", value: stats.confirmed },
          { label: "En attente", value: stats.pending },
          { label: "Revenus", value: formatPrice(stats.revenue), isFormatted: true },
        ].map((s) => (
          <div key={s.label} className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-4">
            <div className="text-xs text-[var(--text-muted)]">{s.label}</div>
            <div className="text-xl font-bold text-[var(--foreground)] mt-1">
              {"isFormatted" in s ? s.value : s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filters + View toggle */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {(["all", "pending", "confirmed", "completed", "cancelled"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 text-sm rounded-xl whitespace-nowrap transition-colors ${
                statusFilter === s
                  ? "bg-[#C4956A] text-white"
                  : "text-[var(--text-muted)] hover:bg-[var(--hover-bg)]"
              }`}
            >
              {s === "all" ? "Toutes" : statusLabels[s]}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-[var(--input-bg)] rounded-lg p-1">
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1 text-xs rounded-md ${viewMode === "list" ? "bg-[#C4956A] text-white" : "text-[var(--text-muted)]"}`}
          >
            Liste
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-3 py-1 text-xs rounded-md ${viewMode === "calendar" ? "bg-[#C4956A] text-white" : "text-[var(--text-muted)]"}`}
          >
            Calendrier
          </button>
        </div>
      </div>

      {/* Calendar view */}
      {viewMode === "calendar" && (
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">
            {new Date().toLocaleDateString("fr-CH", { month: "long", year: "numeric" })}
          </h3>
          <div className="grid grid-cols-7 gap-1 text-center">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
              <div key={d} className="text-xs text-[var(--text-muted)] py-2">{d}</div>
            ))}
            {calendarDays.map((d, i) => (
              <div
                key={i}
                className={`py-2 text-sm rounded-lg ${
                  d.day === 0
                    ? ""
                    : d.hasReservation
                    ? "bg-[#C4956A]/20 text-[#C4956A] font-medium"
                    : "text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]"
                }`}
              >
                {d.day > 0 ? d.day : ""}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reservation cards */}
      {viewMode === "list" && (
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[var(--text-muted)]">Aucune réservation trouvée.</p>
            </div>
          ) : (
            filtered.map((res) => {
              const progress = getProgress(res.checkIn, res.checkOut, res.status);
              const nights = Math.ceil(
                (new Date(res.checkOut).getTime() - new Date(res.checkIn).getTime()) / (1000 * 60 * 60 * 24)
              );
              return (
                <div
                  key={res.id}
                  className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Property image */}
                    <img
                      src={res.property.images[0]}
                      alt={res.property.title}
                      className="w-full md:w-48 h-36 md:h-auto object-cover"
                    />

                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-sm font-semibold text-[var(--foreground)]">
                            {res.property.title}
                          </h3>
                          <p className="text-xs text-[var(--text-muted)]">
                            {res.property.location.city}, {res.property.location.country}
                          </p>
                        </div>
                        <span className={`px-2.5 py-1 text-xs rounded-full ${statusColors[res.status]}`}>
                          {statusLabels[res.status]}
                        </span>
                      </div>

                      {/* Guest */}
                      <div className="flex items-center gap-2 mb-3">
                        <Link href={`/profil/${res.guest.id}`} className="flex items-center gap-2 hover:opacity-80">
                          <img src={res.guest.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                          <span className="text-sm text-[var(--text-secondary)]">
                            {res.guest.firstName} {res.guest.lastName}
                          </span>
                        </Link>
                      </div>

                      {/* Dates & price */}
                      <div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)] mb-3">
                        <span>Du {formatDate(res.checkIn)}</span>
                        <span>au {formatDate(res.checkOut)}</span>
                        <span>{nights} nuit{nights > 1 ? "s" : ""}</span>
                        <span className="font-medium text-[#C4956A]">{formatPrice(res.totalPrice)}</span>
                      </div>

                      {/* Timeline progress */}
                      <div className="mb-4">
                        <div className="w-full h-1.5 bg-[var(--input-bg)] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              res.status === "cancelled" ? "bg-red-400" : "bg-[#C4956A]"
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        {res.status === "pending" && (
                          <>
                            <button
                              onClick={() => setConfirmModal({ id: res.id, action: "confirm" })}
                              className="px-3 py-1.5 text-xs rounded-lg bg-[#C4956A] text-white hover:bg-[#b8845a]"
                            >
                              Confirmer
                            </button>
                            <button
                              onClick={() => setConfirmModal({ id: res.id, action: "cancel" })}
                              className="px-3 py-1.5 text-xs rounded-lg border border-red-400/30 text-red-400 hover:bg-red-400/10"
                            >
                              Annuler
                            </button>
                          </>
                        )}
                        <Link
                          href="/messages"
                          className="px-3 py-1.5 text-xs rounded-lg border border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]"
                        >
                          Contacter
                        </Link>
                        <button className="px-3 py-1.5 text-xs rounded-lg border border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]">
                          Facture
                        </button>
                        {res.status === "completed" && (
                          <button
                            onClick={() => setReviewModal(res.id)}
                            className="px-3 py-1.5 text-xs rounded-lg border border-[#C4956A]/30 text-[#C4956A] hover:bg-[#C4956A]/10"
                          >
                            Laisser un avis
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Confirm/Cancel modal */}
      {confirmModal && (
        <div
          className="fixed inset-0 bg-[var(--overlay)] flex items-center justify-center z-50 p-4"
          onClick={() => setConfirmModal(null)}
        >
          <div
            className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 w-full max-w-sm animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">
              {confirmModal.action === "confirm" ? "Confirmer la réservation" : "Annuler la réservation"}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              {confirmModal.action === "confirm"
                ? "Êtes-vous sûr de vouloir confirmer cette réservation ?"
                : "Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-2.5 text-sm rounded-xl border border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]"
              >
                Retour
              </button>
              <button
                onClick={() => handleAction(confirmModal.id, confirmModal.action)}
                className={`flex-1 py-2.5 text-sm rounded-xl text-white ${
                  confirmModal.action === "confirm"
                    ? "bg-[#C4956A] hover:bg-[#b8845a]"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {confirmModal.action === "confirm" ? "Confirmer" : "Annuler"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review modal */}
      {reviewModal && (
        <div
          className="fixed inset-0 bg-[var(--overlay)] flex items-center justify-center z-50 p-4"
          onClick={() => setReviewModal(null)}
        >
          <div
            className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 w-full max-w-md animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Laisser un avis</h3>

            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className={`text-2xl ${star <= reviewRating ? "text-[#C4956A]" : "text-[var(--text-muted)]"}`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Partagez votre expérience..."
              rows={4}
              className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] resize-none mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setReviewModal(null)}
                className="flex-1 py-2.5 text-sm rounded-xl border border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]"
              >
                Annuler
              </button>
              <button
                onClick={() => { setReviewModal(null); setReviewText(""); }}
                className="flex-1 py-2.5 text-sm rounded-xl bg-[#C4956A] text-white hover:bg-[#b8845a]"
              >
                Publier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
