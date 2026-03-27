"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Video,
  Radio,
  Wrench,
  Award,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  X,
  Check,
  Loader2,
  CalendarPlus,
  Share2,
  Link2,
  Mail,
  MessageCircle,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { useApp } from "@/lib/context";
import { mockEventsExtended } from "@/lib/mock-data";
import type { EventType } from "@/lib/types";

// ─── Constants ──────────────────────────────────────────

const tabs = [
  { key: "upcoming", label: "À venir" },
  { key: "ongoing", label: "En cours" },
  { key: "past", label: "Passés" },
] as const;

const eventTypeConfig: Record<EventType, { label: string; bg: string; text: string; icon: typeof Video }> = {
  webinar: { label: "Webinar", bg: "bg-blue-500/15", text: "text-blue-400", icon: Video },
  live: { label: "Live", bg: "bg-red-500/15", text: "text-red-400", icon: Radio },
  atelier: { label: "Atelier", bg: "bg-purple-500/15", text: "text-purple-400", icon: Wrench },
  seminaire: { label: "Seminaire", bg: "bg-amber-500/15", text: "text-amber-400", icon: Award },
};

const dateBlockColors: Record<EventType, string> = {
  webinar: "from-blue-600 to-blue-500",
  live: "from-red-600 to-red-500",
  atelier: "from-purple-600 to-purple-500",
  seminaire: "from-amber-600 to-amber-500",
};

const dotColors: Record<EventType, string> = {
  webinar: "bg-blue-400",
  live: "bg-red-400",
  atelier: "bg-purple-400",
  seminaire: "bg-amber-400",
};

const monthNames = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];
const shortMonths = ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jul", "Aou", "Sep", "Oct", "Nov", "Dec"];
const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const today = new Date();

function classifyEvent(dateStr: string): "upcoming" | "ongoing" | "past" {
  const eventDate = new Date(dateStr);
  const diffDays = Math.floor((eventDate.getTime() - today.getTime()) / 86_400_000);
  if (diffDays < 0) return "past";
  if (diffDays === 0) return "ongoing";
  return "upcoming";
}

function daysUntil(dateStr: string): number {
  const eventDate = new Date(dateStr);
  return Math.max(0, Math.ceil((eventDate.getTime() - today.getTime()) / 86_400_000));
}

function generateIcsUrl(event: { title: string; date: string; time: string; location: string; description: string }) {
  const dateObj = new Date(event.date);
  const [hours, minutes] = (event.time || "09:00").split(":").map(Number);
  dateObj.setHours(hours || 9, minutes || 0, 0);
  const endDate = new Date(dateObj.getTime() + 2 * 60 * 60 * 1000);

  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `DTSTART:${fmt(dateObj)}`,
    `DTEND:${fmt(endDate)}`,
    `SUMMARY:${event.title}`,
    `LOCATION:${event.location}`,
    `DESCRIPTION:${event.description}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
}

// ─── Page ───────────────────────────────────────────────

export default function EvenementsPage() {
  const { formatPrice } = useApp();
  const [activeTab, setActiveTab] = useState<"upcoming" | "ongoing" | "past">("upcoming");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());
  const [loadingEvent, setLoadingEvent] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<string | null>(null);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [sharingEvent, setSharingEvent] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const events = mockEventsExtended;

  const filteredEvents = useMemo(() => {
    return events.filter((e) => classifyEvent(e.date) === activeTab);
  }, [events, activeTab]);

  // Featured: next upcoming event
  const featuredEvent = events
    .filter((e) => classifyEvent(e.date) === "upcoming")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  // Calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1);
    const lastDay = new Date(calYear, calMonth + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7; // Monday start
    const totalDays = lastDay.getDate();

    const days: (number | null)[] = [];
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(i);
    return days;
  }, [calMonth, calYear]);

  const eventsOnDay = (day: number) => {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.date === dateStr);
  };

  const selectedDayEvents = selectedDay ? eventsOnDay(selectedDay) : [];

  const handleRegister = (eventId: string) => {
    setConfirmModal(eventId);
  };

  const confirmRegistration = (eventId: string) => {
    setConfirmModal(null);
    setLoadingEvent(eventId);
    setTimeout(() => {
      setRegisteredEvents((prev) => new Set(prev).add(eventId));
      setLoadingEvent(null);
    }, 1200);
  };

  const getButtonState = (eventId: string, spotsRemaining: number) => {
    if (registeredEvents.has(eventId)) return "registered";
    if (loadingEvent === eventId) return "loading";
    if (spotsRemaining <= 0) return "full";
    return "available";
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* ── Confirmation Modal ── */}
      <AnimatePresence>
        {confirmModal && (() => {
          const ev = events.find((e) => e.id === confirmModal);
          if (!ev) return null;
          return (
            <motion.div
              key="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              onClick={() => setConfirmModal(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="mx-4 w-full max-w-md rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">Confirmer l&apos;inscription</h3>
                  <button onClick={() => setConfirmModal(null)} className="rounded-lg p-1 text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--foreground)]">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="mb-6 text-sm text-[var(--text-secondary)]">
                  Confirmer votre inscription à <span className="font-medium text-[var(--foreground)]">{ev.title}</span> ?
                </p>
                <div className="mb-4 rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-3">
                  <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(ev.date)}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{ev.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{ev.location}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmModal(null)}
                    className="flex-1 rounded-xl border border-[var(--card-border)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--foreground)]"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => confirmRegistration(ev.id)}
                    className="flex-1 rounded-xl bg-gradient-to-r from-[#C4956A] to-[#D4A574] px-4 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
                  >
                    Confirmer
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Événements</h1>
          <p className="mt-1 text-[var(--text-secondary)]">Webinaires, séminaires et ateliers immobiliers</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/evenements/creer" className="px-5 py-2.5 rounded-xl bg-[#C4956A] text-black text-sm font-semibold hover:bg-[#D4A574] transition-colors whitespace-nowrap">Créer un événement</a>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "rounded-lg p-2 transition-colors",
              viewMode === "list" ? "bg-[#C4956A]/15 text-[#C4956A]" : "text-[var(--text-secondary)] hover:bg-white/5"
            )}
          >
            <List className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={cn(
              "rounded-lg p-2 transition-colors",
              viewMode === "calendar" ? "bg-[#C4956A]/15 text-[#C4956A]" : "text-[var(--text-secondary)] hover:bg-white/5"
            )}
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
        </div>
      </motion.div>

      {/* ── Featured Event ── */}
      {featuredEvent && viewMode === "list" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)]"
        >
          <div className="flex flex-col md:flex-row">
            {/* Thumbnail */}
            <div className="relative h-48 w-full overflow-hidden md:h-auto md:w-80">
              <img
                src={featuredEvent.thumbnail}
                alt={featuredEvent.title}
                className="h-full w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0e0e0e]/80 md:bg-gradient-to-r" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent md:hidden" />
            </div>

            <div className="flex flex-1 flex-col gap-5 p-6 md:flex-row md:items-center md:p-8">
              {/* Date block */}
              <div className={cn("flex h-20 w-20 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br text-white", dateBlockColors[featuredEvent.type])}>
                <span className="text-2xl font-bold">{new Date(featuredEvent.date).getDate()}</span>
                <span className="text-xs font-medium uppercase">{shortMonths[new Date(featuredEvent.date).getMonth()]}</span>
              </div>
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  {(() => {
                    const cfg = eventTypeConfig[featuredEvent.type];
                    return (
                      <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold", cfg.bg, cfg.text)}>
                        <cfg.icon className="h-3 w-3" />
                        {cfg.label}
                      </span>
                    );
                  })()}
                  <span className="text-xs text-[#C4956A] font-medium">Événement vedette</span>
                  {/* Countdown badge */}
                  {classifyEvent(featuredEvent.date) === "upcoming" && (
                    <span className="rounded-full bg-[#C4956A]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#C4956A]">
                      Dans {daysUntil(featuredEvent.date)} jour{daysUntil(featuredEvent.date) > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <h2 className="mb-2 text-xl font-bold text-[var(--foreground)] md:text-2xl">
                  {featuredEvent.title}
                </h2>
                <p className="mb-3 text-sm text-[var(--text-secondary)]">{featuredEvent.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {featuredEvent.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {featuredEvent.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {featuredEvent.registered}/{featuredEvent.spots} inscrits
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-lg font-bold text-[var(--foreground)]">
                  {featuredEvent.price ? formatPrice(featuredEvent.price) : "Gratuit"}
                </span>
                {(() => {
                  const state = getButtonState(featuredEvent.id, featuredEvent.spots - featuredEvent.registered);
                  return state === "registered" ? (
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="flex items-center gap-1.5 rounded-xl bg-emerald-500/20 px-6 py-2.5 text-sm font-semibold text-emerald-400">
                        <Check className="h-4 w-4" /> Vous etes inscrit
                      </span>
                      <a
                        href={generateIcsUrl(featuredEvent)}
                        download={`${featuredEvent.title.replace(/\s+/g, "_")}.ics`}
                        className="flex items-center gap-1 text-xs text-[#C4956A] hover:underline"
                      >
                        <CalendarPlus className="h-3 w-3" /> Ajouter au calendrier
                      </a>
                    </div>
                  ) : (
                    <button
                      onClick={() => state === "available" && handleRegister(featuredEvent.id)}
                      disabled={state !== "available"}
                      className={cn(
                        "rounded-xl px-6 py-2.5 text-sm font-semibold transition-all",
                        state === "loading"
                          ? "bg-[#C4956A]/50 text-black/50 cursor-wait"
                          : "bg-gradient-to-r from-[#C4956A] to-[#D4A574] text-black hover:opacity-90"
                      )}
                    >
                      {state === "loading" ? (
                        <span className="flex items-center gap-1.5"><Loader2 className="h-4 w-4 animate-spin" /> Inscription...</span>
                      ) : (
                        "S'inscrire"
                      )}
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {viewMode === "list" ? (
        <>
          {/* ── Tabs ── */}
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm font-medium transition-all",
                  activeTab === tab.key
                    ? "bg-[#C4956A]/15 text-[#C4956A]"
                    : "bg-[var(--card)] text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--foreground)]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Event Cards ── */}
          <div className="space-y-4">
            {filteredEvents.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Calendar className="mb-4 h-12 w-12 text-[var(--text-muted)]" />
                <p className="text-lg font-medium text-[var(--text-secondary)]">Aucun événement {activeTab === "upcoming" ? "à venir" : activeTab === "ongoing" ? "en cours" : "passé"}</p>
              </div>
            )}

            {filteredEvents.map((event, i) => {
              const cfg = eventTypeConfig[event.type];
              const spotsRemaining = event.spots - event.registered;
              const spotsPercent = event.spots > 0 ? (event.registered / event.spots) * 100 : 100;
              const eventDate = new Date(event.date);
              const buttonState = getButtonState(event.id, spotsRemaining);
              const countdown = daysUntil(event.date);

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card)] transition-colors hover:border-[#C4956A]/20"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Date block + thumbnail */}
                    <div className="relative flex w-full flex-shrink-0 sm:w-48 overflow-hidden">
                      {event.thumbnail ? (
                        <>
                          <img
                            src={event.thumbnail}
                            alt={event.title}
                            className="h-32 w-full object-cover sm:h-full"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                          <div className={cn("absolute left-3 top-3 flex h-14 w-14 flex-col items-center justify-center rounded-lg bg-gradient-to-br text-white", dateBlockColors[event.type])}>
                            <span className="text-lg font-bold leading-none">{eventDate.getDate()}</span>
                            <span className="text-[10px] font-medium uppercase">{shortMonths[eventDate.getMonth()]}</span>
                          </div>
                        </>
                      ) : (
                        <div className={cn("flex w-full items-center justify-center bg-gradient-to-br p-4 sm:flex-col", dateBlockColors[event.type])}>
                          <span className="mr-2 text-2xl font-bold text-white sm:mr-0">{eventDate.getDate()}</span>
                          <span className="text-xs font-medium uppercase text-white/80">{shortMonths[eventDate.getMonth()]}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold", cfg.bg, cfg.text)}>
                            <cfg.icon className="h-3 w-3" />
                            {cfg.label}
                          </span>
                          {/* Countdown badge for upcoming */}
                          {classifyEvent(event.date) === "upcoming" && countdown > 0 && (
                            <span className="rounded-full bg-[#C4956A]/15 px-2 py-0.5 text-[10px] font-bold text-[#C4956A]">
                              Dans {countdown} jour{countdown > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                          className="mb-1 text-left text-base font-semibold text-[var(--foreground)] hover:text-[#C4956A] transition-colors cursor-pointer"
                        >
                          {event.title}
                        </button>
                        <p className="mb-3 line-clamp-2 text-sm text-[var(--text-secondary)]">{event.description}</p>

                        {/* Speaker */}
                        <div className="mb-3 flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#C4956A] to-[#D4A574] text-[9px] font-bold text-black">
                            {event.speaker.firstName[0]}{event.speaker.lastName[0]}
                          </div>
                          <span className="text-xs text-[var(--text-secondary)]">
                            {event.speaker.firstName} {event.speaker.lastName}
                          </span>
                        </div>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)]">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </span>
                        </div>

                        {/* Spots progress — animated */}
                        {event.spots > 0 && (
                          <div className="mt-3">
                            <div className="mb-1 flex justify-between text-[10px]">
                              <span className="text-[var(--text-secondary)]">{spotsRemaining > 0 ? `${spotsRemaining} places restantes` : "Complet"}</span>
                              <span className="text-[#C4956A]">{event.registered}/{event.spots}</span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--card)]">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: mounted ? `${Math.min(100, spotsPercent)}%` : 0 }}
                                transition={{ duration: 0.8, delay: 0.2 + i * 0.05, ease: "easeOut" }}
                                className={cn(
                                  "h-full rounded-full",
                                  spotsPercent >= 90 ? "bg-red-500" : spotsPercent >= 70 ? "bg-amber-500" : "bg-gradient-to-r from-[#C4956A] to-[#D4A574]"
                                )}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Price + CTA */}
                      <div className="flex flex-shrink-0 flex-col items-end gap-2 sm:ml-6">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-[var(--foreground)]">
                            {event.price ? formatPrice(event.price) : "Gratuit"}
                          </span>
                          {/* Share button */}
                          <div className="relative">
                            <button
                              onClick={() => setSharingEvent(sharingEvent === event.id ? null : event.id)}
                              className="rounded-lg p-2 text-[var(--text-secondary)] transition hover:bg-white/5 hover:text-[var(--foreground)]"
                            >
                              <Share2 className="h-4 w-4" />
                            </button>
                            <AnimatePresence>
                              {sharingEvent === event.id && (
                                <motion.div
                                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                                  className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card)] shadow-xl"
                                >
                                  <a
                                    href={`https://wa.me/?text=${encodeURIComponent(event.title + " - E-Dome")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setSharingEvent(null)}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--foreground)]"
                                  >
                                    <MessageCircle className="h-4 w-4 text-green-400" />
                                    WhatsApp
                                  </a>
                                  <a
                                    href={`mailto:?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(event.title + "\n" + event.description)}`}
                                    onClick={() => setSharingEvent(null)}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--foreground)]"
                                  >
                                    <Mail className="h-4 w-4 text-blue-400" />
                                    Email
                                  </a>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(`${event.title} - E-Dome`);
                                      setShareCopied(true);
                                      setTimeout(() => setShareCopied(false), 2000);
                                      setSharingEvent(null);
                                    }}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--foreground)]"
                                  >
                                    <Link2 className="h-4 w-4 text-[#C4956A]" />
                                    {shareCopied ? "Copié !" : "Copier le lien"}
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        {buttonState === "registered" ? (
                          <div className="flex flex-col items-end gap-1.5">
                            <span className="flex items-center gap-1.5 rounded-xl bg-emerald-500/20 px-5 py-2 text-sm font-semibold text-emerald-400">
                              <Check className="h-3.5 w-3.5" /> Vous etes inscrit
                            </span>
                            <a
                              href={generateIcsUrl(event)}
                              download={`${event.title.replace(/\s+/g, "_")}.ics`}
                              className="flex items-center gap-1 text-[10px] text-[#C4956A] hover:underline"
                            >
                              <CalendarPlus className="h-3 w-3" /> Ajouter au calendrier
                            </a>
                          </div>
                        ) : (
                          <button
                            onClick={() => buttonState === "available" && handleRegister(event.id)}
                            disabled={buttonState !== "available"}
                            className={cn(
                              "rounded-xl px-5 py-2 text-sm font-semibold transition-all",
                              buttonState === "loading"
                                ? "bg-[#C4956A]/50 text-black/50 cursor-wait"
                                : buttonState === "full"
                                ? "cursor-not-allowed bg-[var(--card)] text-[var(--text-muted)]"
                                : "bg-gradient-to-r from-[#C4956A] to-[#D4A574] text-black hover:opacity-90"
                            )}
                          >
                            {buttonState === "loading" ? (
                              <span className="flex items-center gap-1.5"><Loader2 className="h-3.5 w-3.5 animate-spin" /></span>
                            ) : buttonState === "full" ? (
                              "Complet"
                            ) : (
                              "S'inscrire"
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  <AnimatePresence>
                    {expandedEvent === event.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden border-t border-[var(--card-border)]"
                      >
                        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                          {/* Full Description */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-[var(--foreground)]">Description complète</h4>
                            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                              {event.description} Cet événement est conçu pour les professionnels de l&apos;immobilier souhaitant approfondir leurs connaissances et développer leur réseau. Vous découvrirez les dernières tendances du marché, les meilleures pratiques et des études de cas concrets.
                            </p>

                            {/* Speaker Bio */}
                            <div className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-4">
                              <h4 className="mb-2 text-sm font-semibold text-[var(--foreground)]">À propos de l&apos;intervenant</h4>
                              <div className="flex items-center gap-3 mb-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#C4956A] to-[#D4A574] text-sm font-bold text-black">
                                  {event.speaker.firstName[0]}{event.speaker.lastName[0]}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-[var(--foreground)]">{event.speaker.firstName} {event.speaker.lastName}</p>
                                  <p className="text-xs text-[var(--text-secondary)]">Expert immobilier</p>
                                </div>
                              </div>
                              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                {event.speaker.firstName} est un expert reconnu dans le domaine de l&apos;immobilier avec plus de 10 ans d&apos;expérience. Spécialisé dans {event.type === "webinar" ? "la formation en ligne" : event.type === "atelier" ? "les ateliers pratiques" : "les événements immobiliers"}.
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {/* Location Map Placeholder */}
                            <div className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-4">
                              <h4 className="mb-3 text-sm font-semibold text-[var(--foreground)]">Lieu</h4>
                              <div className="flex aspect-[16/9] items-center justify-center rounded-lg border border-[var(--card-border)] bg-[var(--background)]">
                                <div className="flex flex-col items-center gap-2 text-[var(--text-muted)]">
                                  <MapPin className="h-8 w-8" />
                                  <p className="text-xs">{event.location}</p>
                                </div>
                              </div>
                            </div>

                            {/* Attendee Count with Progress */}
                            <div className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-4">
                              <h4 className="mb-3 text-sm font-semibold text-[var(--foreground)]">Participants</h4>
                              <div className="mb-2 flex items-center justify-between text-xs">
                                <span className="text-[var(--text-secondary)]">{event.registered} inscrits sur {event.spots} places</span>
                                <span className="font-semibold text-[#C4956A]">{Math.round((event.registered / event.spots) * 100)}%</span>
                              </div>
                              <div className="h-2 overflow-hidden rounded-full bg-[var(--card)]">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(100, (event.registered / event.spots) * 100)}%` }}
                                  transition={{ duration: 0.8 }}
                                  className={cn(
                                    "h-full rounded-full",
                                    spotsPercent >= 90 ? "bg-red-500" : spotsPercent >= 70 ? "bg-amber-500" : "bg-gradient-to-r from-[#C4956A] to-[#D4A574]"
                                  )}
                                />
                              </div>
                            </div>

                            {/* Related Events */}
                            <div>
                              <h4 className="mb-3 text-sm font-semibold text-[var(--foreground)]">Événements similaires</h4>
                              <div className="space-y-2">
                                {events
                                  .filter((e) => e.id !== event.id && e.type === event.type)
                                  .slice(0, 2)
                                  .map((related) => {
                                    const relCfg = eventTypeConfig[related.type];
                                    return (
                                      <button
                                        key={related.id}
                                        onClick={() => setExpandedEvent(related.id)}
                                        className="flex w-full items-center gap-3 rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-3 text-left transition-colors hover:border-[#C4956A]/20"
                                      >
                                        <div className={cn("flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-gradient-to-br text-white text-[10px]", dateBlockColors[related.type])}>
                                          <span className="font-bold leading-none">{new Date(related.date).getDate()}</span>
                                          <span className="text-[8px] uppercase">{shortMonths[new Date(related.date).getMonth()]}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="truncate text-xs font-medium text-[var(--foreground)]">{related.title}</p>
                                          <p className="text-[11px] text-[var(--text-secondary)]">{related.time} · {related.location}</p>
                                        </div>
                                        <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-semibold", relCfg.bg, relCfg.text)}>
                                          {relCfg.label}
                                        </span>
                                      </button>
                                    );
                                  })}
                                {events.filter((e) => e.id !== event.id && e.type === event.type).length === 0 && (
                                  <p className="text-xs text-[var(--text-muted)]">Aucun événement similaire</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </>
      ) : (
        /* ── Calendar View ── */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6">
            {/* Month nav */}
            <div className="mb-5 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedDay(null);
                  if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
                  else setCalMonth(calMonth - 1);
                }}
                className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--foreground)]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                {monthNames[calMonth]} {calYear}
              </h3>
              <button
                onClick={() => {
                  setSelectedDay(null);
                  if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
                  else setCalMonth(calMonth + 1);
                }}
                className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--foreground)]"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Day headers */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {dayNames.map((d) => (
                <div key={d} className="py-2 text-center text-xs font-medium text-[var(--text-secondary)]">{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => {
                if (day === null) return <div key={`empty-${i}`} />;
                const dayEvents = eventsOnDay(day);
                const isToday =
                  day === today.getDate() &&
                  calMonth === today.getMonth() &&
                  calYear === today.getFullYear();
                const isSelected = selectedDay === day;

                return (
                  <button
                    key={day}
                    onClick={() => {
                      if (dayEvents.length > 0) {
                        setSelectedDay(isSelected ? null : day);
                      }
                    }}
                    className={cn(
                      "relative min-h-[70px] rounded-lg border p-1.5 text-left text-xs transition-all",
                      isSelected
                        ? "border-[#C4956A]/40 bg-[#C4956A]/10"
                        : isToday
                        ? "border-[#C4956A]/30 bg-[#C4956A]/5"
                        : "border-[var(--card-border)] bg-[var(--background)]",
                      dayEvents.length > 0 && "cursor-pointer hover:border-[#C4956A]/20"
                    )}
                  >
                    <span className={cn("text-[11px] font-medium", isToday ? "text-[#C4956A]" : isSelected ? "text-[var(--foreground)]" : "text-[var(--text-secondary)]")}>
                      {day}
                    </span>
                    {/* Event dots */}
                    {dayEvents.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-0.5">
                        {dayEvents.map((ev) => (
                          <div
                            key={ev.id}
                            className={cn("h-1.5 w-1.5 rounded-full", dotColors[ev.type])}
                            title={ev.title}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected day events */}
          <AnimatePresence>
            {selectedDay && selectedDayEvents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5">
                  <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">
                    Événements du {selectedDay} {monthNames[calMonth]}
                  </h3>
                  <div className="space-y-3">
                    {selectedDayEvents.map((event) => {
                      const cfg = eventTypeConfig[event.type];
                      const spotsRemaining = event.spots - event.registered;
                      const spotsPercent = event.spots > 0 ? (event.registered / event.spots) * 100 : 100;
                      const buttonState = getButtonState(event.id, spotsRemaining);

                      return (
                        <div
                          key={event.id}
                          className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-4"
                        >
                          <div className="mb-2 flex items-center gap-2">
                            <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold", cfg.bg, cfg.text)}>
                              <cfg.icon className="h-3 w-3" />
                              {cfg.label}
                            </span>
                            <span className="text-xs text-[var(--text-secondary)]">{event.time}</span>
                          </div>
                          <h4 className="mb-1 text-sm font-semibold text-[var(--foreground)]">{event.title}</h4>
                          <p className="mb-2 text-xs text-[var(--text-secondary)]">{event.description}</p>
                          <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)]">
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location}</span>
                            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{event.registered}/{event.spots} inscrits</span>
                          </div>
                          {/* Spots progress */}
                          {event.spots > 0 && (
                            <div className="mb-3">
                              <div className="h-1.5 overflow-hidden rounded-full bg-[var(--card)]">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(100, spotsPercent)}%` }}
                                  transition={{ duration: 0.6 }}
                                  className={cn(
                                    "h-full rounded-full",
                                    spotsPercent >= 90 ? "bg-red-500" : spotsPercent >= 70 ? "bg-amber-500" : "bg-gradient-to-r from-[#C4956A] to-[#D4A574]"
                                  )}
                                />
                              </div>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-[var(--foreground)]">
                              {event.price ? formatPrice(event.price) : "Gratuit"}
                            </span>
                            {buttonState === "registered" ? (
                              <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1 rounded-lg bg-emerald-500/20 px-4 py-1.5 text-xs font-semibold text-emerald-400">
                                  <Check className="h-3 w-3" /> Inscrit
                                </span>
                                <a
                                  href={generateIcsUrl(event)}
                                  download={`${event.title.replace(/\s+/g, "_")}.ics`}
                                  className="text-[10px] text-[#C4956A] hover:underline"
                                  title="Ajouter au calendrier"
                                >
                                  <CalendarPlus className="h-3.5 w-3.5" />
                                </a>
                              </div>
                            ) : (
                              <button
                                onClick={() => buttonState === "available" && handleRegister(event.id)}
                                disabled={buttonState !== "available"}
                                className={cn(
                                  "rounded-lg px-4 py-1.5 text-xs font-semibold transition-all",
                                  buttonState === "loading"
                                    ? "bg-[#C4956A]/50 text-black/50 cursor-wait"
                                    : buttonState === "full"
                                    ? "cursor-not-allowed bg-[var(--card)] text-[var(--text-muted)]"
                                    : "bg-gradient-to-r from-[#C4956A] to-[#D4A574] text-black hover:opacity-90"
                                )}
                              >
                                {buttonState === "loading" ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : buttonState === "full" ? "Complet" : "S'inscrire"}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
