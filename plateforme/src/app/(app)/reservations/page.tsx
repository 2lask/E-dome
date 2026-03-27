"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Calendar,
  Users,
  DollarSign,
  BarChart3,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  MessageCircle,
  Filter,
  Moon,
  Download,
  Loader2,
  Star,
  CalendarPlus,
  List,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import { useApp } from "@/lib/context";
import { mockReservations, mockProperties } from "@/lib/mock-data";
import type { ReservationStatus } from "@/lib/types";

type TabKey = "all" | ReservationStatus;

const tabs: { key: TabKey; label: string }[] = [
  { key: "all", label: "Toutes" },
  { key: "pending", label: "En attente" },
  { key: "confirmed", label: "Confirmées" },
  { key: "completed", label: "Terminées" },
  { key: "cancelled", label: "Annulées" },
];

const statusConfig: Record<
  ReservationStatus,
  { label: string; dot: string; bg: string; text: string }
> = {
  pending: { label: "En attente", dot: "bg-yellow-400", bg: "bg-yellow-500/10", text: "text-yellow-400" },
  confirmed: { label: "Confirmée", dot: "bg-emerald-400", bg: "bg-emerald-500/10", text: "text-emerald-400" },
  completed: { label: "Terminée", dot: "bg-blue-400", bg: "bg-blue-500/10", text: "text-blue-400" },
  cancelled: { label: "Annulée", dot: "bg-red-400", bg: "bg-red-500/10", text: "text-red-400" },
};

// Timeline steps for reservation progress
const timelineSteps = [
  { key: "demande", label: "Demande" },
  { key: "confirmation", label: "Confirmation" },
  { key: "checkin", label: "Check-in" },
  { key: "checkout", label: "Check-out" },
  { key: "avis", label: "Avis" },
];

function getTimelineStep(status: ReservationStatus): number {
  switch (status) {
    case "pending": return 0;
    case "confirmed": return 1;
    case "completed": return 3;
    case "cancelled": return -1;
    default: return 0;
  }
}

function nightsBetween(a: string, b: string) {
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24)
  );
}

export default function ReservationsPage() {
  const { formatPrice } = useApp();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [propertyFilter, setPropertyFilter] = useState<string>("all");
  const [reservationStatuses, setReservationStatuses] = useState<Record<string, ReservationStatus>>(() => {
    const map: Record<string, ReservationStatus> = {};
    mockReservations.forEach((r) => { map[r.id] = r.status; });
    return map;
  });
  const [toast, setToast] = useState<string | null>(null);
  const [cancelModal, setCancelModal] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  // Review state
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());

  // Extend stay state
  const [extendingId, setExtendingId] = useState<string | null>(null);

  // Calendar view state
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [selectedCalRes, setSelectedCalRes] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleConfirm = (resId: string) => {
    setConfirmingId(resId);
    setTimeout(() => {
      setReservationStatuses((prev) => ({ ...prev, [resId]: "confirmed" }));
      setConfirmingId(null);
      showToast("Réservation confirmée avec succès !");
    }, 800);
  };

  const handleCancel = (resId: string) => {
    setCancelModal(resId);
  };

  const confirmCancel = (resId: string) => {
    setReservationStatuses((prev) => ({ ...prev, [resId]: "cancelled" }));
    setCancelModal(null);
    showToast("Réservation annulée");
  };

  const handleContact = () => {
    router.push("/messages");
  };

  const handleDownloadInvoice = (resId: string) => {
    showToast("Facture téléchargée !");
  };

  const handleSubmitReview = (resId: string) => {
    if (reviewRating === 0) return;
    setReviewSubmitting(true);
    setTimeout(() => {
      setReviewSubmitting(false);
      setReviewedIds((prev) => new Set(prev).add(resId));
      setReviewingId(null);
      setReviewRating(0);
      setReviewComment("");
      showToast("Avis publié avec succès !");
    }, 1000);
  };

  const handleExtendStay = (resId: string) => {
    setExtendingId(resId);
    setTimeout(() => {
      setExtendingId(null);
      showToast("Demande de prolongation envoyée !");
    }, 1000);
  };

  const reservationsWithStatus = useMemo(() => {
    return mockReservations.map((r) => ({
      ...r,
      status: reservationStatuses[r.id] || r.status,
    }));
  }, [reservationStatuses]);

  const filtered = useMemo(() => {
    return reservationsWithStatus.filter((r) => {
      if (activeTab !== "all" && r.status !== activeTab) return false;
      if (propertyFilter !== "all" && r.property.id !== propertyFilter) return false;
      return true;
    });
  }, [activeTab, propertyFilter, reservationsWithStatus]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: reservationsWithStatus.length };
    for (const r of reservationsWithStatus) c[r.status] = (c[r.status] || 0) + 1;
    return c;
  }, [reservationsWithStatus]);

  const summaryStats = useMemo(() => {
    const pending = reservationsWithStatus.filter((r) => r.status === "pending");
    const confirmed = reservationsWithStatus.filter((r) => r.status === "confirmed");
    return {
      total: reservationsWithStatus.length,
      pendingRevenue: pending.reduce((s, r) => s + r.totalPrice, 0),
      confirmedRevenue: confirmed.reduce((s, r) => s + r.totalPrice, 0),
      occupancy: 78,
    };
  }, [reservationsWithStatus]);

  const summaryCards = [
    { label: "Total réservations", value: summaryStats.total.toString(), icon: Calendar, color: "text-[#C4956A]", bg: "bg-[#C4956A]/10" },
    { label: "Revenus en attente", value: formatPrice(summaryStats.pendingRevenue), icon: DollarSign, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: "Revenus confirmés", value: formatPrice(summaryStats.confirmedRevenue), icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Taux d'occupation", value: `${summaryStats.occupancy}%`, icon: BarChart3, color: "text-blue-400", bg: "bg-blue-400/10" },
  ];

  // Unique properties for filter
  const propertyOptions = useMemo(() => {
    const seen = new Set<string>();
    return mockReservations
      .filter((r) => {
        if (seen.has(r.property.id)) return false;
        seen.add(r.property.id);
        return true;
      })
      .map((r) => r.property);
  }, []);

  return (
    <div className="space-y-8">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-5 py-3 text-sm font-medium text-[var(--foreground)] shadow-2xl"
          >
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              {toast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Modal */}
      <AnimatePresence>
        {cancelModal && (
          <motion.div
            key="cancel-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setCancelModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="mx-4 w-full max-w-md rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">Confirmer l&apos;annulation</h3>
                <button onClick={() => setCancelModal(null)} className="rounded-lg p-1 text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--foreground)]">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mb-6 text-sm text-[var(--text-secondary)]">
                Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setCancelModal(null)}
                  className="flex-1 rounded-xl border border-[var(--card-border)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--foreground)]"
                >
                  Retour
                </button>
                <button
                  onClick={() => confirmCancel(cancelModal)}
                  className="flex-1 rounded-xl bg-red-500/20 px-4 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/30"
                >
                  Annuler la réservation
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold md:text-3xl">Réservations</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Gérez vos réservations et suivez vos transactions
        </p>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5"
          >
            <div className="flex items-center gap-3">
              <div className={cn("rounded-xl p-2.5", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-sm text-[var(--text-secondary)]">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-1 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "relative rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                activeTab === tab.key
                  ? "bg-[#C4956A]/15 text-[#C4956A]"
                  : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "ml-1.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold",
                  activeTab === tab.key
                    ? "bg-[#C4956A]/20 text-[#C4956A]"
                    : "bg-white/[0.06] text-[var(--text-secondary)]"
                )}
              >
                {counts[tab.key] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Property filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[var(--text-secondary)]" />
          <select
            value={propertyFilter}
            onChange={(e) => setPropertyFilter(e.target.value)}
            className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text-secondary)] outline-none focus:border-[#C4956A]/30"
          >
            <option value="all">Tous les biens</option>
            {propertyOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* View mode toggle */}
        <div className="ml-auto flex gap-1 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-1">
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              viewMode === "list"
                ? "bg-[#C4956A]/15 text-[#C4956A]"
                : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
            )}
          >
            <List className="h-4 w-4" />
            Liste
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              viewMode === "calendar"
                ? "bg-[#C4956A]/15 text-[#C4956A]"
                : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
            )}
          >
            <CalendarDays className="h-4 w-4" />
            Calendrier
          </button>
        </div>
      </div>

      {/* ─── Calendar View ──────────────────────────────── */}
      {viewMode === "calendar" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6"
        >
          {/* Month navigation */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => {
                if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
                else setCalMonth((m) => m - 1);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--card-border)] text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--foreground)]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              {["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"][calMonth]} {calYear}
            </h3>
            <button
              onClick={() => {
                if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
                else setCalMonth((m) => m + 1);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--card-border)] text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--foreground)]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Calendar grid */}
          {(() => {
            const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
            const firstDay = (new Date(calYear, calMonth, 1).getDay() + 6) % 7;
            const dayNames = ["Lu","Ma","Me","Je","Ve","Sa","Di"];
            const today = new Date();
            const isToday = (d: number) =>
              today.getFullYear() === calYear && today.getMonth() === calMonth && today.getDate() === d;

            // Build reservation bars for this month
            const getResForDay = (day: number) => {
              const date = new Date(calYear, calMonth, day);
              return filtered.filter((r) => {
                const start = new Date(r.checkIn);
                const end = new Date(r.checkOut);
                return date >= start && date <= end;
              });
            };

            const statusBarColors: Record<ReservationStatus, string> = {
              confirmed: "bg-[#C4956A] text-black",
              pending: "bg-yellow-500/70 text-black",
              completed: "bg-emerald-500/70 text-black",
              cancelled: "bg-red-500/30 text-red-300 line-through",
            };

            return (
              <div>
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {dayNames.map((d) => (
                    <div key={d} className="py-2 text-center text-xs font-medium text-[var(--text-secondary)]">
                      {d}
                    </div>
                  ))}
                </div>
                {/* Day cells */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="min-h-[80px]" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dayRes = getResForDay(day);
                    return (
                      <div
                        key={day}
                        className={cn(
                          "min-h-[80px] rounded-lg border p-1.5 transition-colors",
                          isToday(day)
                            ? "border-[#C4956A]/40 bg-[#C4956A]/5"
                            : "border-[var(--card-border)] hover:border-[var(--card-border)]"
                        )}
                      >
                        <span className={cn(
                          "text-xs font-medium",
                          isToday(day) ? "text-[#C4956A]" : "text-[var(--text-secondary)]"
                        )}>
                          {day}
                        </span>
                        <div className="mt-1 space-y-0.5">
                          {dayRes.slice(0, 2).map((r) => (
                            <button
                              key={r.id}
                              onClick={() => setSelectedCalRes(selectedCalRes === r.id ? null : r.id)}
                              className={cn(
                                "w-full truncate rounded px-1.5 py-0.5 text-[10px] font-medium text-left transition-opacity hover:opacity-80",
                                statusBarColors[r.status]
                              )}
                              title={r.property.title}
                            >
                              {r.property.title}
                            </button>
                          ))}
                          {dayRes.length > 2 && (
                            <span className="text-[9px] text-[var(--text-muted)]">+{dayRes.length - 2}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-5 rounded bg-[#C4956A]" /> Confirmée</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-5 rounded bg-yellow-500/70" /> En attente</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-5 rounded bg-emerald-500/70" /> Terminée</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-5 rounded bg-red-500/30" /> Annulée</span>
                </div>
              </div>
            );
          })()}

          {/* Selected reservation detail */}
          <AnimatePresence>
            {selectedCalRes && (() => {
              const res = filtered.find((r) => r.id === selectedCalRes);
              if (!res) return null;
              const sc = statusConfig[res.status];
              const nights = nightsBetween(res.checkIn, res.checkOut);
              return (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 overflow-hidden rounded-xl border border-[var(--card-border)] bg-white/[0.02] p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-white/[0.04]">
                        {res.property.images?.[0] ? (
                          <img src={res.property.images[0]} alt={res.property.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[var(--text-muted)]">
                            <Building2 className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-[var(--foreground)]">{res.property.title}</h4>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {formatDate(res.checkIn)} → {formatDate(res.checkOut)} · {nights} nuit{nights > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium", sc.bg, sc.text)}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", sc.dot)} />
                        {sc.label}
                      </span>
                      <p className="text-lg font-bold text-[var(--foreground)]">{formatPrice(res.totalPrice)}</p>
                      <button onClick={() => setSelectedCalRes(null)} className="rounded-lg p-1 text-[var(--text-secondary)] hover:text-[var(--foreground)]">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Reservation Cards (List View) */}
      <div className={cn("space-y-4", viewMode !== "list" && "hidden")}>
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-[var(--card-border)] bg-[var(--card)] py-20"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--card)]">
                <Calendar className="h-8 w-8 text-[var(--text-muted)]" />
              </div>
              <p className="mt-4 text-lg font-medium text-[var(--text-secondary)]">
                {activeTab === "pending" ? "Aucune réservation en attente" :
                 activeTab === "confirmed" ? "Aucune réservation confirmée" :
                 activeTab === "completed" ? "Aucune réservation terminée" :
                 activeTab === "cancelled" ? "Aucune réservation annulée" :
                 "Aucune réservation trouvée"}
              </p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                {activeTab !== "all"
                  ? "Essayez un autre filtre pour voir vos réservations"
                  : "Les réservations de vos biens apparaîtront ici"}
              </p>
              {activeTab !== "all" && (
                <button
                  onClick={() => setActiveTab("all")}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#C4956A]/30 px-5 py-2.5 text-sm font-medium text-[#C4956A] transition-colors hover:bg-[#C4956A]/5"
                >
                  Voir toutes les réservations
                </button>
              )}
            </motion.div>
          )}

          {filtered.map((res, i) => {
            const nights = nightsBetween(res.checkIn, res.checkOut);
            const sc = statusConfig[res.status];
            const tlStep = getTimelineStep(res.status);
            const isReviewing = reviewingId === res.id;
            const hasReviewed = reviewedIds.has(res.id);

            return (
              <motion.div
                key={res.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)] transition-colors hover:border-white/[0.1]"
              >
                {/* Timeline progress */}
                {res.status !== "cancelled" && (
                  <div className="border-b border-[var(--card-border)] bg-white/[0.01] px-5 py-3">
                    <div className="flex items-center">
                      {timelineSteps.map((step, si) => (
                        <div key={step.key} className="flex flex-1 items-center">
                          <div className="flex flex-col items-center">
                            <div
                              className={cn(
                                "flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold",
                                si <= tlStep
                                  ? "bg-[#C4956A]/25 text-[#C4956A]"
                                  : "bg-white/5 text-[var(--text-muted)]"
                              )}
                            >
                              {si <= tlStep ? <Check className="h-2.5 w-2.5" /> : si + 1}
                            </div>
                            <span className={cn(
                              "mt-1 text-[8px] font-medium",
                              si <= tlStep ? "text-[#C4956A]" : "text-[var(--text-muted)]"
                            )}>
                              {step.label}
                            </span>
                          </div>
                          {si < timelineSteps.length - 1 && (
                            <div className={cn(
                              "mx-1 h-[1px] flex-1",
                              si < tlStep ? "bg-[#C4956A]/30" : "bg-white/[0.06]"
                            )} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center">
                  {/* Property thumbnail + info */}
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-white/[0.04]">
                      {res.property.images && res.property.images[0] ? (
                        <img
                          src={res.property.images[0]}
                          alt={res.property.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            ((e.target as HTMLImageElement).nextElementSibling as HTMLElement)?.style.removeProperty('display');
                          }}
                        />
                      ) : null}
                      <div className={cn("flex h-full w-full items-center justify-center text-[var(--text-muted)]", res.property.images?.[0] && "hidden")}>
                        <Building2 className="h-8 w-8" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{res.property.title}</h3>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {res.property.location.city}, {res.property.location.country}
                      </p>
                    </div>
                  </div>

                  {/* Guest */}
                  <div className="flex items-center gap-3 lg:w-40">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C4956A]/10 text-sm font-semibold text-[#C4956A]">
                      {res.guest.firstName[0]}
                      {res.guest.lastName[0]}
                    </div>
                    <div>
                      <Link href={`/profil/${res.guest.id}`} className="text-sm font-medium hover:text-[#C4956A] transition-colors">
                        {res.guest.firstName} {res.guest.lastName}
                      </Link>
                      <p className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                        <Users className="h-3 w-3" /> {res.guests} voyageur{res.guests > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="lg:w-52">
                    <div className="flex items-center gap-2 text-sm">
                      <span>{formatDate(res.checkIn)}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                      <span>{formatDate(res.checkOut)}</span>
                    </div>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                      <Moon className="h-3 w-3" /> {nights} nuit{nights > 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="lg:w-32 lg:text-right">
                    <p className="text-lg font-bold">{formatPrice(res.totalPrice)}</p>
                    {res.optionsPrice > 0 && (
                      <p className="text-xs text-[var(--text-secondary)]">
                        dont {formatPrice(res.optionsPrice)} options
                      </p>
                    )}
                  </div>

                  {/* Status badge */}
                  <div className="lg:w-28 lg:text-center">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
                        sc.bg,
                        sc.text
                      )}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", sc.dot)} />
                      {sc.label}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 lg:w-auto">
                    {res.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleConfirm(res.id)}
                          disabled={confirmingId === res.id}
                          className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
                        >
                          {confirmingId === res.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                          Confirmer
                        </button>
                        <button
                          onClick={() => handleCancel(res.id)}
                          className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20"
                        >
                          <X className="h-3.5 w-3.5" /> Annuler
                        </button>
                      </>
                    )}
                    {res.status === "confirmed" && (
                      <>
                        <button
                          onClick={handleContact}
                          className="flex items-center gap-1.5 rounded-lg bg-[#C4956A]/10 px-3 py-2 text-xs font-medium text-[#C4956A] transition-colors hover:bg-[#C4956A]/20"
                        >
                          <MessageCircle className="h-3.5 w-3.5" /> Contacter
                        </button>
                        <button
                          onClick={() => handleExtendStay(res.id)}
                          disabled={extendingId === res.id}
                          className="flex items-center gap-1.5 rounded-lg bg-purple-500/10 px-3 py-2 text-xs font-medium text-purple-400 transition-colors hover:bg-purple-500/20"
                        >
                          {extendingId === res.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <CalendarPlus className="h-3.5 w-3.5" />
                          )}
                          Prolonger le séjour
                        </button>
                      </>
                    )}
                    {res.status === "completed" && (
                      <>
                        <button
                          onClick={handleContact}
                          className="flex items-center gap-1.5 rounded-lg bg-blue-500/10 px-3 py-2 text-xs font-medium text-blue-400 transition-colors hover:bg-blue-500/20"
                        >
                          <MessageCircle className="h-3.5 w-3.5" /> Contacter
                        </button>
                        {!hasReviewed && (
                          <button
                            onClick={() => setReviewingId(isReviewing ? null : res.id)}
                            className="flex items-center gap-1.5 rounded-lg bg-[#C4956A]/10 px-3 py-2 text-xs font-medium text-[#C4956A] transition-colors hover:bg-[#C4956A]/20"
                          >
                            <Star className="h-3.5 w-3.5" /> Laisser un avis
                          </button>
                        )}
                        {hasReviewed && (
                          <span className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400">
                            <Check className="h-3.5 w-3.5" /> Avis publié
                          </span>
                        )}
                      </>
                    )}
                    {/* Download invoice */}
                    {(res.status === "confirmed" || res.status === "completed") && (
                      <button
                        onClick={() => handleDownloadInvoice(res.id)}
                        className="flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-white/[0.08] hover:text-[var(--foreground)]"
                      >
                        <Download className="h-3.5 w-3.5" /> Facture
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline review form */}
                <AnimatePresence>
                  {isReviewing && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-[var(--card-border)] bg-white/[0.01] px-5 py-4">
                        <h4 className="mb-3 text-sm font-semibold text-[var(--foreground)]">Laisser un avis</h4>

                        {/* Star rating */}
                        <div className="mb-3 flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setReviewRating(star)}
                              onMouseEnter={() => setReviewHover(star)}
                              onMouseLeave={() => setReviewHover(0)}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                className={cn(
                                  "h-6 w-6 transition-colors",
                                  star <= (reviewHover || reviewRating)
                                    ? "fill-[#C4956A] text-[#C4956A]"
                                    : "text-[var(--text-muted)]"
                                )}
                              />
                            </button>
                          ))}
                          {reviewRating > 0 && (
                            <span className="ml-2 text-xs text-[var(--text-secondary)]">{reviewRating}/5</span>
                          )}
                        </div>

                        {/* Comment */}
                        <textarea
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Partagez votre expérience..."
                          rows={3}
                          className="mb-3 w-full resize-none rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none focus:border-[#C4956A]/40"
                        />

                        {/* Submit */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSubmitReview(res.id)}
                            disabled={reviewRating === 0 || reviewSubmitting}
                            className={cn(
                              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all",
                              reviewSubmitting
                                ? "bg-[#C4956A]/30 text-black/50 cursor-wait"
                                : reviewRating === 0
                                ? "bg-[#C4956A]/20 text-black/30 cursor-not-allowed"
                                : "bg-gradient-to-r from-[#C4956A] to-[#D4A574] text-black hover:opacity-90"
                            )}
                          >
                            {reviewSubmitting ? (
                              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Publication...</>
                            ) : (
                              "Publier l'avis"
                            )}
                          </button>
                          <button
                            onClick={() => { setReviewingId(null); setReviewRating(0); setReviewComment(""); }}
                            className="rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)]"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Options row */}
                {res.options.length > 0 && (
                  <div className="border-t border-[var(--card-border)] bg-white/[0.01] px-5 py-3">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="text-xs font-medium text-[var(--text-secondary)]">Options :</span>
                      {res.options.map((o) => (
                        <span key={o.id} className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                          <Check className="h-3 w-3 text-emerald-400" />
                          {o.name}
                          <span className="text-[#C4956A]">{formatPrice(o.price)}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
