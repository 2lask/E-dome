"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import {
  CANTONS,
  OUTSIDE_SWITZERLAND,
  PROFILE_QUESTIONS,
  audience,
  engagementsFor,
  form,
  type ProfileId,
} from "@/content/landing";
import { leadSchema } from "@/lib/leads/schema";
import { submitInterest } from "@/lib/leads/actions";
import { track } from "@/lib/analytics";
import { Progress } from "@/components/ui/progress";
import { Stepper } from "@/components/ui/stepper";
import { cn } from "@/lib/utils";
import { ANCHORS } from "../anchors";
import { Section } from "../section";
import { FORM_HEADING_ID, useProfileSelection } from "../profile-selection";
import { FieldControl, controlCls, type FieldValue } from "./fields";

/* ── Formulaire de manifestation d'intérêt ───────────────────────────────────

   Trois étapes : identité, questions du profil, engagement. Le retour en
   arrière ne perd rien — l'état vit dans ce composant, pas dans le DOM des
   étapes démontées.

   La validation réutilise le schéma serveur (`leadSchema`), sans le
   redéclarer : à chaque « Continuer », le schéma complet est évalué et seules
   les erreurs dont le chemin appartient à l'étape courante sont affichées.
   Une règle ajoutée au schéma s'applique donc automatiquement ici, et les
   deux côtés ne peuvent pas diverger.

   Changer de profil vide les réponses de l'étape 2 : elles appartiennent aux
   questions de l'ancien profil, et le serveur les refuserait comme
   « question inconnue ». */

type Answers = Record<string, FieldValue>;

const STEP_FIELDS: readonly (readonly string[])[] = [
  ["firstName", "email", "profile", "canton", "country"],
  ["profileAnswers"],
  ["consentPrivacy", "engagements"],
];

export function InterestForm() {
  const router = useRouter();
  const { profile, setProfile } = useProfileSelection();

  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [canton, setCanton] = useState("");
  const [country, setCountry] = useState("");
  /* Reponses conservees par profil : changer de profil affiche donc un jeu
     vierge, et revenir en arriere retrouve ce qui avait ete saisi. Aucune
     remise a zero, donc aucun effet de synchronisation. */
  const [answersByProfile, setAnswersByProfile] = useState<Record<string, Answers>>({});
  const [engagements, setEngagements] = useState<string[]>([]);
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [consentNewsletter, setConsentNewsletter] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const started = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const markStarted = useCallback(() => {
    if (started.current) return;
    started.current = true;
    track("form_started");
  }, []);

  const answers = useMemo<Answers>(() => answersByProfile[profile] ?? {}, [answersByProfile, profile]);
  /* Memoises : les tables du contenu sont stables, mais le litteral [] du
     ternaire creerait une nouvelle reference a chaque rendu et invaliderait
     les memos qui en dependent. */
  const questions = useMemo(() => (profile ? PROFILE_QUESTIONS[profile] : []), [profile]);
  const engagementOptions = useMemo(
    () => (profile ? engagementsFor(profile) : []),
    [profile],
  );

  /* Les engagements du jeu « equipe » et du jeu commun ne se recouvrent pas :
     on filtre plutot que de vider, pour qu'un aller-retour entre profils ne
     fasse pas perdre les cases dejà cochees. */
  const validEngagements = useMemo(
    () => engagements.filter((id) => engagementOptions.some((o) => o.id === id)),
    [engagements, engagementOptions],
  );

  const payload = useMemo(
    () => ({
      firstName,
      email,
      profile,
      canton,
      country: canton === OUTSIDE_SWITZERLAND ? country : undefined,
      profileAnswers: answers,
      engagements: validEngagements,
      consentPrivacy,
      consentNewsletter,
      honeypot,
      landingPath: typeof window === "undefined" ? undefined : window.location.pathname,
    }),
    [
      firstName,
      email,
      profile,
      canton,
      country,
      answers,
      validEngagements,
      consentPrivacy,
      consentNewsletter,
      honeypot,
    ],
  );

  /** Erreurs du schéma restreintes aux champs de l'étape demandée. */
  const errorsForStep = useCallback(
    (index: number) => {
      const parsed = leadSchema.safeParse(payload);
      if (parsed.success) return {};

      const prefixes = STEP_FIELDS[index] ?? [];
      const out: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.map(String).join(".");
        const root = path.split(".")[0] ?? "";
        if (prefixes.includes(root) && !out[path]) out[path] = issue.message;
      }
      return out;
    },
    [payload],
  );

  const goNext = () => {
    const stepErrors = errorsForStep(step);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    track("form_step_completed", { step: step + 1 });
    setStep((s) => Math.min(s + 1, STEP_FIELDS.length - 1));
    headingRef.current?.focus();
  };

  const goBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
    headingRef.current?.focus();
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const stepErrors = errorsForStep(2);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitInterest(payload);

      if (result.ok) {
        track("form_submitted", { profile: profile || "inconnu" });
        router.push(`/merci?ref=${encodeURIComponent(result.refCode)}`);
        return;
      }

      if (result.kind === "validation") {
        setErrors(result.errors);
        /* Une erreur peut concerner une étape précédente (valeur bricolée,
           ou règle que le client n'a pas su évaluer) : on y renvoie. */
        const firstRoot = Object.keys(result.errors)[0]?.split(".")[0] ?? "";
        const target = STEP_FIELDS.findIndex((fields) => fields.includes(firstRoot));
        if (target >= 0) setStep(target);
      } else {
        setFormError(result.message);
      }
    } catch {
      setFormError(form.errors.generic);
    } finally {
      setSubmitting(false);
    }
  };

  const progress = ((step + 1) / STEP_FIELDS.length) * 100;

  return (
    <Section id={ANCHORS.form} muted>
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
            {form.eyebrow}
          </p>
          <h2
            id={FORM_HEADING_ID}
            ref={headingRef}
            tabIndex={-1}
            className="page-heading text-3xl leading-tight text-[var(--foreground)] outline-none sm:text-4xl"
          >
            {form.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)]">
            {form.intro}
          </p>
        </header>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-8">
          <div className="mb-7">
            <Stepper steps={form.steps.map((s) => ({ id: s.id, label: s.label }))} current={step} />
            <Progress value={progress} className="mt-4" />
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              {form.progressLabel} {step + 1} / {STEP_FIELDS.length}
            </p>
          </div>

          <form onSubmit={onSubmit} onChange={markStarted} noValidate>
            {/* Champ piège : hors écran plutôt que `display:none`, que certains
                robots savent détecter. Exclu de la tabulation et de
                l'arbre d'accessibilité. */}
            <div aria-hidden="true" className="pointer-events-none absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
              <label htmlFor="landing-company">Société</label>
              <input
                id="landing-company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {step === 0 && (
              <div className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="lead-first-name"
                      className="mb-2 block text-sm font-medium text-[var(--foreground)]"
                    >
                      {form.identity.firstName.label}
                    </label>
                    <input
                      id="lead-first-name"
                      type="text"
                      autoComplete="given-name"
                      value={firstName}
                      placeholder={form.identity.firstName.placeholder}
                      onChange={(e) => setFirstName(e.target.value)}
                      aria-invalid={errors.firstName ? true : undefined}
                      aria-describedby={errors.firstName ? "lead-first-name-error" : undefined}
                      className={controlCls}
                    />
                    {errors.firstName && (
                      <p id="lead-first-name-error" role="alert" className="mt-1.5 text-xs text-[var(--danger)]">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lead-email"
                      className="mb-2 block text-sm font-medium text-[var(--foreground)]"
                    >
                      {form.identity.email.label}
                    </label>
                    <input
                      id="lead-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={email}
                      placeholder={form.identity.email.placeholder}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={errors.email ? "lead-email-error" : undefined}
                      className={controlCls}
                    />
                    {errors.email && (
                      <p id="lead-email-error" role="alert" className="mt-1.5 text-xs text-[var(--danger)]">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lead-profile"
                    className="mb-2 block text-sm font-medium text-[var(--foreground)]"
                  >
                    {form.identity.profile.label}
                  </label>
                  <select
                    id="lead-profile"
                    value={profile}
                    onChange={(e) => {
                      setProfile(e.target.value as ProfileId | "");
                    }}
                    aria-invalid={errors.profile ? true : undefined}
                    aria-describedby={errors.profile ? "lead-profile-error" : undefined}
                    className={controlCls}
                  >
                    <option value="">{form.identity.profile.placeholder}</option>
                    {audience.profiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                  {errors.profile && (
                    <p id="lead-profile-error" role="alert" className="mt-1.5 text-xs text-[var(--danger)]">
                      {errors.profile}
                    </p>
                  )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="lead-canton"
                      className="mb-2 block text-sm font-medium text-[var(--foreground)]"
                    >
                      {form.identity.canton.label}
                    </label>
                    <select
                      id="lead-canton"
                      value={canton}
                      onChange={(e) => setCanton(e.target.value)}
                      aria-invalid={errors.canton ? true : undefined}
                      aria-describedby={errors.canton ? "lead-canton-error" : undefined}
                      className={controlCls}
                    >
                      <option value="">{form.identity.canton.placeholder}</option>
                      {CANTONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                      <option value={OUTSIDE_SWITZERLAND}>{OUTSIDE_SWITZERLAND}</option>
                    </select>
                    {errors.canton && (
                      <p id="lead-canton-error" role="alert" className="mt-1.5 text-xs text-[var(--danger)]">
                        {errors.canton}
                      </p>
                    )}
                  </div>

                  {canton === OUTSIDE_SWITZERLAND && (
                    <div>
                      <label
                        htmlFor="lead-country"
                        className="mb-2 block text-sm font-medium text-[var(--foreground)]"
                      >
                        {form.identity.country.label}
                      </label>
                      <input
                        id="lead-country"
                        type="text"
                        autoComplete="country-name"
                        value={country}
                        placeholder={form.identity.country.placeholder}
                        onChange={(e) => setCountry(e.target.value)}
                        aria-invalid={errors.country ? true : undefined}
                        aria-describedby={errors.country ? "lead-country-error" : undefined}
                        className={controlCls}
                      />
                      {errors.country && (
                        <p id="lead-country-error" role="alert" className="mt-1.5 text-xs text-[var(--danger)]">
                          {errors.country}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-5">
                {questions.length === 0 ? (
                  <p className="text-sm text-[var(--text-muted)]">
                    Choisissez d&apos;abord votre profil à l&apos;étape précédente.
                  </p>
                ) : (
                  questions.map((field) => (
                    <FieldControl
                      key={field.id}
                      field={field}
                      value={answers[field.id]}
                      error={errors[`profileAnswers.${field.id}`]}
                      onChange={(value) =>
                        setAnswersByProfile((prev) => ({
                          ...prev,
                          [profile]: { ...(prev[profile] ?? {}), [field.id]: value },
                        }))
                      }
                    />
                  ))
                )}
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-6">
                <fieldset>
                  <legend className="text-base font-semibold text-[var(--foreground)]">
                    {form.engagement.title}
                  </legend>
                  <p className="mt-1.5 mb-3 text-sm text-[var(--text-secondary)]">
                    {form.engagement.intro}
                  </p>
                  <div className="grid gap-1.5">
                    {engagementOptions.map((option) => {
                      const checked = engagements.includes(option.id);
                      return (
                        <label
                          key={option.id}
                          htmlFor={`engagement-${option.id}`}
                          className={cn(
                            "flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border px-3.5 py-3 text-sm transition-colors",
                            checked
                              ? "border-[var(--primary)] bg-[var(--muted)] text-[var(--foreground)]"
                              : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--muted)]",
                          )}
                        >
                          <input
                            id={`engagement-${option.id}`}
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setEngagements((prev) =>
                                prev.includes(option.id)
                                  ? prev.filter((v) => v !== option.id)
                                  : [...prev, option.id],
                              )
                            }
                            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--primary)]"
                          />
                          <span>{option.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="grid gap-3 border-t border-[var(--border)] pt-5">
                  <label htmlFor="consent-privacy" className="flex items-start gap-3 text-sm">
                    <input
                      id="consent-privacy"
                      type="checkbox"
                      checked={consentPrivacy}
                      onChange={(e) => setConsentPrivacy(e.target.checked)}
                      aria-invalid={errors.consentPrivacy ? true : undefined}
                      aria-describedby={errors.consentPrivacy ? "consent-privacy-error" : undefined}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--primary)]"
                    />
                    <span className="text-[var(--text-secondary)]">
                      {form.consent.privacy.label}{" "}
                      <Link
                        href={form.consent.privacy.linkHref}
                        className="underline underline-offset-2 hover:text-[var(--foreground)]"
                      >
                        {form.consent.privacy.linkLabel}
                      </Link>
                    </span>
                  </label>
                  {errors.consentPrivacy && (
                    <p id="consent-privacy-error" role="alert" className="text-xs text-[var(--danger)]">
                      {errors.consentPrivacy}
                    </p>
                  )}

                  <label htmlFor="consent-newsletter" className="flex items-start gap-3 text-sm">
                    <input
                      id="consent-newsletter"
                      type="checkbox"
                      checked={consentNewsletter}
                      onChange={(e) => setConsentNewsletter(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--primary)]"
                    />
                    <span className="text-[var(--text-secondary)]">
                      {form.consent.newsletter.label}
                    </span>
                  </label>
                </div>
              </div>
            )}

            {formError && (
              <p
                role="alert"
                className="mt-5 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger)]/5 px-3.5 py-3 text-sm text-[var(--danger)]"
              >
                {formError}
              </p>
            )}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row-reverse sm:items-center">
              {step < STEP_FIELDS.length - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-6 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90 sm:w-auto"
                >
                  {form.actions.next}
                  <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-6 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
                >
                  {submitting && (
                    <Loader2
                      size={16}
                      strokeWidth={2}
                      className="animate-spin motion-reduce:animate-none"
                      aria-hidden="true"
                    />
                  )}
                  {submitting ? form.actions.submitting : form.actions.submit}
                </button>
              )}

              {step > 0 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)] sm:w-auto"
                >
                  <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
                  {form.actions.back}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </Section>
  );
}
