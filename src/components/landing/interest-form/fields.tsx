"use client";

import React, { useId, useState } from "react";
import type { Field } from "@/content/landing";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/* ── Champs du formulaire ────────────────────────────────────────────────────

   Les listes de choix sont des `<select>` et des cases à cocher natifs, pas
   des composants sur mesure. C'est délibéré : sur mobile, un `<select>` natif
   ouvre le sélecteur du système, la navigation au clavier fonctionne sans une
   ligne de JavaScript, et les technologies d'assistance les annoncent
   correctement sans `aria-*` à maintenir.

   Chaque champ relie son message d'erreur par `aria-describedby` et porte
   `aria-invalid` : l'erreur est donc lue au moment où l'on entre dans le
   champ, et pas seulement affichée à côté.

   Les questions marquées `allowOther` ajoutent « Autre » à la liste, puis un
   champ libre. La valeur stockée est alors le texte saisi, pas le mot
   « Autre » : ce qui remonte en base reste directement lisible. */

export type FieldValue = string | string[];

const OTHER_LABEL = "Autre";

const controlCls =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 py-3 text-base text-[var(--foreground)] transition-colors placeholder:text-[var(--text-muted)] focus-visible:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/25 sm:text-sm";

interface ShellProps {
  htmlFor?: string;
  label: string;
  optional?: boolean;
  help?: string;
  error?: string;
  errorId?: string;
  helpId?: string;
  children: React.ReactNode;
  /** Regroupe des cases à cocher : le libellé devient une légende. */
  asFieldset?: boolean;
}

export function FieldShell({
  htmlFor,
  label,
  optional,
  help,
  error,
  errorId,
  helpId,
  children,
  asFieldset,
}: ShellProps) {
  const heading = (
    <>
      {label}
      {optional && (
        <span className="ml-1.5 font-normal text-[var(--text-muted)]">(facultatif)</span>
      )}
    </>
  );

  const body = (
    <>
      {children}
      {help && (
        <p id={helpId} className="mt-1.5 text-xs text-[var(--text-muted)]">
          {help}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-[var(--danger)]">
          {error}
        </p>
      )}
    </>
  );

  if (asFieldset) {
    return (
      <fieldset className="min-w-0">
        <legend className="mb-2 block text-sm font-medium text-[var(--foreground)]">
          {heading}
        </legend>
        {body}
      </fieldset>
    );
  }

  return (
    <div className="min-w-0">
      <Label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-[var(--foreground)]">
        {heading}
      </Label>
      {body}
    </div>
  );
}

interface ControlProps {
  field: Field;
  value: FieldValue | undefined;
  onChange: (value: FieldValue) => void;
  error?: string;
}

/** Texte simple, ou adresse pour les champs de type `url`. */
export function TextControl({ field, value, onChange, error }: ControlProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;
  const current = typeof value === "string" ? value : "";

  return (
    <FieldShell
      htmlFor={id}
      label={field.label}
      optional={field.optional}
      help={field.help}
      error={error}
      errorId={errorId}
      helpId={helpId}
    >
      <input
        id={id}
        type={field.type === "url" ? "url" : "text"}
        inputMode={field.type === "url" ? "url" : undefined}
        value={current}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(error && errorId, field.help && helpId) || undefined}
        className={controlCls}
      />
    </FieldShell>
  );
}

export function TextareaControl({ field, value, onChange, error }: ControlProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const current = typeof value === "string" ? value : "";

  return (
    <FieldShell
      htmlFor={id}
      label={field.label}
      optional={field.optional}
      error={error}
      errorId={errorId}
    >
      <Textarea
        id={id}
        rows={3}
        value={current}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      />
    </FieldShell>
  );
}

export function SelectControl({ field, value, onChange, error }: ControlProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const options = (field.options ?? []) as readonly string[];
  const current = typeof value === "string" ? value : "";

  /* Une valeur absente de la liste ne peut venir que du champ « Autre ». */
  const valueIsOther = current !== "" && !options.includes(current);
  const [otherActive, setOtherActive] = useState(valueIsOther);

  return (
    <FieldShell
      htmlFor={id}
      label={field.label}
      optional={field.optional}
      error={error}
      errorId={errorId}
    >
      <select
        id={id}
        value={otherActive ? OTHER_LABEL : current}
        onChange={(e) => {
          const next = e.target.value;
          if (next === OTHER_LABEL) {
            setOtherActive(true);
            onChange("");
            return;
          }
          setOtherActive(false);
          onChange(next);
        }}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={controlCls}
      >
        <option value="">{field.placeholder ?? "Choisissez une réponse"}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
        {field.allowOther && <option value={OTHER_LABEL}>{OTHER_LABEL}…</option>}
      </select>

      {otherActive && (
        <input
          type="text"
          value={current}
          autoFocus
          placeholder="Précisez"
          aria-label={`${field.label} — précisez`}
          onChange={(e) => onChange(e.target.value)}
          className={cn(controlCls, "mt-2")}
        />
      )}
    </FieldShell>
  );
}

export function MultiSelectControl({ field, value, onChange, error }: ControlProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const options = (field.options ?? []) as readonly string[];
  const selected = Array.isArray(value) ? value : [];

  const known = selected.filter((v) => options.includes(v));
  const free = selected.filter((v) => !options.includes(v));
  const [otherActive, setOtherActive] = useState(free.length > 0);
  const otherText = free[0] ?? "";

  const toggle = (option: string) => {
    const next = known.includes(option)
      ? selected.filter((v) => v !== option)
      : [...selected, option];
    onChange(next);
  };

  return (
    <FieldShell
      label={field.label}
      optional={field.optional}
      error={error}
      errorId={errorId}
      asFieldset
    >
      <div
        className="grid gap-1.5 sm:grid-cols-2"
        aria-describedby={error ? errorId : undefined}
      >
        {options.map((option) => {
          const optionId = `${id}-${option}`;
          const checked = known.includes(option);
          return (
            <label
              key={option}
              htmlFor={optionId}
              className={cn(
                "flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors",
                checked
                  ? "border-[var(--primary)] bg-[var(--muted)] text-[var(--foreground)]"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--muted)]",
              )}
            >
              <input
                id={optionId}
                type="checkbox"
                checked={checked}
                onChange={() => toggle(option)}
                className="h-4 w-4 shrink-0 accent-[var(--primary)]"
              />
              <span className="min-w-0">{option}</span>
            </label>
          );
        })}

        {field.allowOther && (
          <label
            htmlFor={`${id}-other`}
            className={cn(
              "flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors",
              otherActive
                ? "border-[var(--primary)] bg-[var(--muted)] text-[var(--foreground)]"
                : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--muted)]",
            )}
          >
            <input
              id={`${id}-other`}
              type="checkbox"
              checked={otherActive}
              onChange={() => {
                if (otherActive) {
                  setOtherActive(false);
                  onChange(known);
                } else {
                  setOtherActive(true);
                }
              }}
              className="h-4 w-4 shrink-0 accent-[var(--primary)]"
            />
            <span>{OTHER_LABEL}</span>
          </label>
        )}
      </div>

      {otherActive && (
        <input
          type="text"
          value={otherText}
          placeholder="Précisez"
          aria-label={`${field.label} — précisez`}
          onChange={(e) => {
            const text = e.target.value;
            onChange(text ? [...known, text] : known);
          }}
          className={cn(controlCls, "mt-2")}
        />
      )}
    </FieldShell>
  );
}

/** Aiguille vers le contrôle adapté au type de question. */
export function FieldControl(props: ControlProps) {
  switch (props.field.type) {
    case "multiselect":
      return <MultiSelectControl {...props} />;
    case "select":
      return <SelectControl {...props} />;
    case "textarea":
      return <TextareaControl {...props} />;
    default:
      return <TextControl {...props} />;
  }
}

export { controlCls };
