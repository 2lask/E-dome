"use client";

import React, { useId } from "react";
import type { z } from "zod";
import { MONTHS_FR } from "@/lib/profile-types";

/* Primitives de formulaire partagées par les modales d'édition. Validation
   affichée en temps réel : chaque modale calcule ses erreurs via zodErrors()
   et ne les montre qu'une fois le champ touché (ou après tentative de save). */

/** Extrait la 1ʳᵉ erreur par champ d'un safeParse zod (path[0] → message). */
export function zodErrors(schema: z.ZodTypeAny, values: unknown): Record<string, string> {
  const res = schema.safeParse(values);
  if (res.success) return {};
  const out: Record<string, string> = {};
  for (const issue of res.error.issues) {
    const key = String(issue.path[0] ?? "_");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

const baseInput =
  "w-full px-3 py-2 text-sm rounded-lg bg-[var(--input-bg)] border text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[var(--primary)]";

export function Field({
  label,
  required,
  error,
  hint,
  counter,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  counter?: { value: number; max: number };
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <label className="block text-xs font-medium text-[var(--text-secondary)]">
          {label} {required && <span className="text-[var(--destructive)]">*</span>}
        </label>
        {counter && (
          <span className={`text-[10px] tabular-nums ${counter.value > counter.max ? "text-[var(--destructive)]" : "text-[var(--text-muted)]"}`}>
            {counter.value}/{counter.max}
          </span>
        )}
      </div>
      {children}
      {error ? (
        <p className="text-[11px] text-[var(--destructive)] mt-1">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-[var(--text-muted)] mt-1">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextInput({
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...props}
      className={`${baseInput} ${error ? "border-[var(--destructive)]" : "border-[var(--input-border)]"}`}
    />
  );
}

export function TextArea({
  error,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }) {
  return (
    <textarea
      {...props}
      className={`${baseInput} resize-none ${error ? "border-[var(--destructive)]" : "border-[var(--input-border)]"}`}
    />
  );
}

export function SelectInput({
  error,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return (
    <select
      {...props}
      className={`${baseInput} ${error ? "border-[var(--destructive)]" : "border-[var(--input-border)]"}`}
    >
      {children}
    </select>
  );
}

/* Sélecteur mois + année, utilisé pour les périodes d'expérience. */
export function MonthYearPicker({
  month,
  year,
  onMonth,
  onYear,
  disabled,
}: {
  month?: number;
  year?: number;
  onMonth: (m: number) => void;
  onYear: (y: number) => void;
  disabled?: boolean;
}) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 60 }, (_, i) => currentYear + 4 - i);
  return (
    <div className="grid grid-cols-2 gap-2">
      <SelectInput
        value={month ?? ""}
        disabled={disabled}
        onChange={(e) => onMonth(Number(e.target.value))}
        aria-label="Mois"
      >
        <option value="" disabled>Mois</option>
        {MONTHS_FR.map((m, i) => (
          <option key={i} value={i + 1}>{m}</option>
        ))}
      </SelectInput>
      <SelectInput
        value={year ?? ""}
        disabled={disabled}
        onChange={(e) => onYear(Number(e.target.value))}
        aria-label="Année"
      >
        <option value="" disabled>Année</option>
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </SelectInput>
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  const id = useId();
  return (
    <div className="flex items-center gap-2.5">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`rounded-full transition-colors relative shrink-0 ${checked ? "bg-[var(--primary)]" : "bg-[var(--input-bg)] border border-[var(--input-border)]"}`}
        style={{ height: 22, width: 40 }}
      >
        <span
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
          style={{ transform: checked ? "translateX(20px)" : "translateX(2px)" }}
        />
      </button>
      <label htmlFor={id} className="text-sm text-[var(--foreground)] cursor-pointer select-none">
        {label}
      </label>
    </div>
  );
}
