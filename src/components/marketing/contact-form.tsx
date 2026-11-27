"use client";

import { useId, useState } from "react";
import { AlertCircle, ArrowRight, Check, Mail, RotateCcw } from "lucide-react";

/* ── Formulaire de contact ──────────────────────────────────────────────────
   Aucun envoi serveur n'existe encore : plutôt que de simuler un envoi (et
   d'affirmer qu'un e-mail de confirmation est parti), le formulaire prépare le
   message dans la messagerie de la personne, adressé au support. */

const SUBJECTS = [
  { v: "general", l: "Question générale" },
  { v: "technique", l: "Problème technique" },
  { v: "compte", l: "Mon compte" },
  { v: "paiement", l: "Paiement et facturation" },
  { v: "signalement", l: "Signaler un abus" },
  { v: "partenariat", l: "Proposition de partenariat" },
  { v: "presse", l: "Presse et média" },
  { v: "autre", l: "Autre" },
];

type Field = "sujet" | "nom" | "email" | "message";

export function ContactForm({ email: SUPPORT_EMAIL }: { email: string }) {
  const uid = useId();
  const [form, setForm] = useState<Record<Field, string>>({ sujet: "", nom: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [done, setDone] = useState(false);

  const validate = () => {
    const e: Partial<Record<Field, string>> = {};
    if (!form.sujet) e.sujet = "Veuillez sélectionner un sujet.";
    if (!form.nom.trim()) e.nom = "Le nom est requis.";
    if (!form.email.trim()) e.email = "L'e-mail est requis.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "L'e-mail n'est pas valide.";
    if (!form.message.trim()) e.message = "Le message est requis.";
    else if (form.message.trim().length < 10) e.message = "Le message doit contenir au moins 10 caractères.";
    return e;
  };

  const set = (f: Field, v: string) => {
    setForm((p) => ({ ...p, [f]: v }));
    if (errors[f]) setErrors((p) => ({ ...p, [f]: undefined }));
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    const first = (Object.keys(e) as Field[])[0];
    if (first) {
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    const subject = `[${SUBJECTS.find((s) => s.v === form.sujet)?.l ?? "Contact"}] ${form.nom}`;
    const body = `${form.message}\n\n— ${form.nom} (${form.email})`;
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setDone(true);
  };

  if (done) {
    return (
      <div role="status" className="relative overflow-hidden rounded-3xl border border-laiton-border bg-gradient-to-br from-laiton-soft via-card to-card p-8 text-center sm:p-12">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-laiton-border bg-laiton-soft text-laiton">
          <Check className="h-8 w-8" strokeWidth={2.5} aria-hidden />
        </span>
        <h2 className="mt-5 text-[24px] font-semibold tracking-[-0.02em]">Votre message est prêt</h2>
        <p className="mx-auto mt-2 max-w-md text-[14.5px] leading-relaxed text-muted-foreground">
          Il s&apos;est ouvert dans votre messagerie, adressé à {SUPPORT_EMAIL}. Envoyez-le depuis là : nous vous répondrons par e-mail.
        </p>
        <p className="mx-auto mt-2 max-w-md text-[13px] text-muted-foreground">
          Rien ne s&apos;est ouvert ? Écrivez directement à{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-leman underline underline-offset-2">{SUPPORT_EMAIL}</a>.
        </p>
        <button type="button" onClick={() => setDone(false)}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl border bg-card px-5 text-[14px] font-medium hover:border-foreground/25">
          <RotateCcw className="h-4 w-4" aria-hidden /> Modifier le message
        </button>
      </div>
    );
  }

  const input = (f: Field) =>
    `w-full rounded-xl border bg-background px-4 text-[15px] outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 focus:border-laiton focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--laiton)_18%,transparent)] ${
      errors[f] ? "border-danger" : "border-input"
    }`;

  return (
    <form onSubmit={submit} noValidate className="relative overflow-hidden rounded-3xl border bg-card p-5 sm:p-8">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--laiton)_20%,transparent),transparent)]" />

      <fieldset className="relative">
        <legend className="text-[14px] font-semibold">Sujet</legend>
        <div id={`${uid}-sujet`} tabIndex={-1} role="radiogroup" aria-invalid={!!errors.sujet} aria-describedby={errors.sujet ? `${uid}-sujet-err` : undefined}
          className="mt-3 grid grid-cols-2 gap-2 outline-none sm:grid-cols-4">
          {SUBJECTS.map((s) => {
            const on = form.sujet === s.v;
            return (
              <label key={s.v}
                className={`relative flex min-h-[48px] cursor-pointer items-center justify-center rounded-xl border px-3 py-2 text-center text-[13px] font-medium leading-tight transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring ${
                  on ? "border-laiton bg-laiton-soft text-foreground" : "bg-background text-muted-foreground hover:border-foreground/25 hover:text-foreground"
                }`}>
                <input type="radio" name="sujet" value={s.v} checked={on} onChange={() => set("sujet", s.v)} className="sr-only" />
                {s.l}
              </label>
            );
          })}
        </div>
        <Err id={`${uid}-sujet-err`} msg={errors.sujet} />
      </fieldset>

      <div className="relative mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-nom`} className="text-[14px] font-semibold">Nom complet</label>
          <input id={`${uid}-nom`} type="text" autoComplete="name" value={form.nom} onChange={(e) => set("nom", e.target.value)}
            placeholder="Votre nom" aria-invalid={!!errors.nom} aria-describedby={errors.nom ? `${uid}-nom-err` : undefined}
            className={`mt-2 h-12 ${input("nom")}`} />
          <Err id={`${uid}-nom-err`} msg={errors.nom} />
        </div>
        <div>
          <label htmlFor={`${uid}-email`} className="text-[14px] font-semibold">Adresse e-mail</label>
          <input id={`${uid}-email`} type="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)}
            placeholder="vous@exemple.ch" aria-invalid={!!errors.email} aria-describedby={errors.email ? `${uid}-email-err` : undefined}
            className={`mt-2 h-12 ${input("email")}`} />
          <Err id={`${uid}-email-err`} msg={errors.email} />
        </div>
      </div>

      <div className="relative mt-5">
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor={`${uid}-message`} className="text-[14px] font-semibold">Message</label>
          <span className="font-mono text-[11.5px] tabular-nums text-muted-foreground" aria-hidden>{form.message.trim().length} car.</span>
        </div>
        <textarea id={`${uid}-message`} rows={6} value={form.message} onChange={(e) => set("message", e.target.value)}
          placeholder="Décrivez votre demande (ce que vous faisiez, votre appareil, votre navigateur s'il s'agit d'un problème)."
          aria-invalid={!!errors.message} aria-describedby={errors.message ? `${uid}-message-err` : undefined}
          className={`mt-2 resize-y py-3 leading-relaxed ${input("message")}`} />
        <Err id={`${uid}-message-err`} msg={errors.message} />
      </div>

      <div className="relative mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-[12.5px] text-muted-foreground">
          <Mail className="h-4 w-4 shrink-0" aria-hidden /> Le message s&apos;ouvre dans votre messagerie, prêt à partir.
        </p>
        <button type="submit" className="cine-btn-gold inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-[15px] font-semibold">
          Envoyer le message <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </form>
  );
}

function Err({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-danger">
      <AlertCircle className="h-3.5 w-3.5" aria-hidden />{msg}
    </p>
  );
}
