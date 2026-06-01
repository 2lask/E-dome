"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const dayNames = ["DIM", "LUN", "MAR", "MER", "JEU", "VEN", "SAM"];

interface CalendarDayProps {
  day: number | string;
  isHeader?: boolean;
  highlighted?: boolean;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ day, isHeader, highlighted }) => {
  return (
    <div
      className={`col-span-1 row-span-1 flex h-8 w-8 items-center justify-center ${
        isHeader ? "" : "rounded-xl"
      } ${
        !isHeader && highlighted
          ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
          : "text-[var(--text-muted)]"
      }`}
    >
      <span className={`font-medium ${isHeader ? "text-xs" : "text-sm"}`}>
        {day}
      </span>
    </div>
  );
};

interface CalendarProps {
  /** Cal.com (ou autre) URL pour la réservation. */
  bookingLink?: string;
  /** Titre principal de la carte. */
  title?: string;
  /** Sous-titre / pitch court. */
  subtitle?: string;
  /** Libellé du CTA. */
  ctaLabel?: string;
  /** Durée affichée à côté du mois (ex. "30 min"). */
  duration?: string;
}

export function Calendar({
  bookingLink = "https://cal.com/edome/demo",
  title = "Une question sur E-Dome ?",
  subtitle = "Réservez un appel découverte avec l'équipe.",
  ctaLabel = "Réserver",
  duration = "30 min",
}: CalendarProps) {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("fr-CH", { month: "long" });
  const currentYear = currentDate.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentDate.getMonth(), 1);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = new Date(
    currentYear,
    currentDate.getMonth() + 1,
    0,
  ).getDate();

  /* Highlights déterministes : on évite Math.random() qui causerait
     un mismatch d'hydratation SSR/client. ~30 % des jours sont mis
     en avant via un hash simple sur (jour + mois + année). */
  const isHighlighted = (day: number) => {
    const seed = day + currentDate.getMonth() * 31 + currentYear * 53;
    return seed % 10 < 3;
  };

  const headerCells = dayNames.map((day) => (
    <CalendarDay key={`header-${day}`} day={day} isHeader />
  ));

  // Cellules vides pour aligner le 1er du mois sur son jour de la semaine.
  // Array.from au lieu de Array(N).map(...) — ce dernier saute les slots vides.
  const emptyCells = Array.from({ length: firstDayOfWeek }, (_, i) => (
    <div key={`empty-${i}`} className="col-span-1 row-span-1 h-8 w-8" />
  ));

  const dateCells = Array.from({ length: daysInMonth }, (_, i) => (
    <CalendarDay
      key={`date-${i + 1}`}
      day={i + 1}
      highlighted={isHighlighted(i + 1)}
    />
  ));

  const calendarCells = [...headerCells, ...emptyCells, ...dateCells];

  return (
    <BentoCard linkTo={bookingLink}>
      <div className="grid h-full gap-5">
        <div>
          <h2 className="mb-4 text-lg md:text-3xl font-semibold text-[var(--foreground)]">
            {title}
          </h2>
          <p className="mb-2 text-xs md:text-sm text-[var(--text-secondary)]">
            {subtitle}
          </p>
          <Button className="mt-3 rounded-2xl">{ctaLabel}</Button>
        </div>
        <div className="transition-all duration-500 ease-out md:group-hover:-right-12 md:group-hover:top-5">
          <div>
            <div className="w-full max-w-[550px] rounded-[24px] border border-[var(--card-border)] bg-[var(--card)] p-2 transition-colors duration-200 group-hover:border-[var(--primary)]/40">
              <div
                className="rounded-2xl border-2 border-white/5 p-3"
                style={{ boxShadow: "0px 2px 1.5px 0px rgba(165, 174, 184, 0.18) inset" }}
              >
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-[var(--foreground)]">
                    <span className="font-medium capitalize">
                      {currentMonth}, {currentYear}
                    </span>
                  </p>
                  <span className="h-1 w-1 rounded-full bg-[var(--text-muted)]">&nbsp;</span>
                  <p className="text-xs text-[var(--text-muted)]">Appel de {duration}</p>
                </div>
                <div className="mt-4 grid grid-cols-7 gap-2 px-1 md:px-4">
                  {calendarCells}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BentoCard>
  );
}

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  showHoverGradient?: boolean;
  hideOverflow?: boolean;
  linkTo?: string;
}

export function BentoCard({
  children,
  className = "",
  showHoverGradient = true,
  hideOverflow = true,
  linkTo,
}: BentoCardProps) {
  const cardContent = (
    <div
      className={`group relative flex flex-col rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 transition-colors hover:bg-[var(--hover-bg)] ${
        hideOverflow ? "overflow-hidden" : ""
      } ${className}`}
    >
      {linkTo && (
        <div className="absolute bottom-4 right-6 z-[5] flex h-12 w-12 rotate-6 items-center justify-center rounded-full bg-white text-[var(--primary)] opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-[-8px] group-hover:rotate-0 group-hover:opacity-100">
          <ArrowUpRight className="h-6 w-6" />
        </div>
      )}
      {showHoverGradient && (
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-tl from-[var(--primary)]/15 via-transparent to-transparent opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100" />
      )}
      <div className="relative z-[2]">{children}</div>
    </div>
  );

  if (linkTo) {
    return linkTo.startsWith("/") ? (
      <Link href={linkTo} className="block">
        {cardContent}
      </Link>
    ) : (
      <a
        href={linkTo}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
}
