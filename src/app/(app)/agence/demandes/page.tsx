"use client";

import { useMemo, useState } from "react";
import { Lock, Home, MapPin, Wallet, Clock, Users, Check } from "lucide-react";
import { agencePage } from "@/content/agence";
import { PlatformRules } from "@/components/legal/platform-rules";
import { useToast } from "@/components/ui/toast";
import { useSession, recordSessionEvent } from "@/lib/use-session";
import { applicationsBy } from "@/lib/demo/session-views";
import Link from "next/link";
import { applicationQuota, lowestPlanWith } from "@/lib/pricing/catalog";
import { PLAN_META } from "@/content/tarifs";
import { useAgencyPlan } from "@/lib/use-business";

/* ── `/agence/demandes` — la distribution, vue côté agence ───────────────────

   Le pendant de `/vendre/accompagnement`. L'agence voit des fiches ANONYMES,
   dans l'ordre chronologique — aucun classement payant — et postule. Elle ne
   reçoit jamais un contact : c'est le particulier qui l'ouvre s'il la choisit.
   C'est l'inversion du sens de circulation d'un marché de leads (DECISIONS
   §2.3), et une condition de validité juridique, pas un positionnement.

   Postuler se fait avec les QUATRE CHAMPS IMPOSÉS — taux, inclus, délai, deux
   références — pour que le particulier compare du comparable. La candidature
   entre à la mémoire de session (`application.sent`) : elle reste « envoyée »
   après un rechargement, et le particulier derrière la fiche, s'il est à
   l'annuaire, est notifié et la voit dans sa comparaison. Aucune conversation
   n'est ouverte ici, et c'est voulu : l'agence n'a pas le droit d'écrire la
   première. */

interface ApplyForm {
  rate: string;
  included: string;
  timeline: string;
  ref1: string;
  ref2: string;
}

const EMPTY: ApplyForm = { rate: "", included: "", timeline: "", ref1: "", ref2: "" };

const inputCls =
  "w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-[13px] text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)]";
const labelCls = "mb-1 block text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]";

export default function AgenceDemandesPage() {
  const d = agencePage.demandes;
  const { addToast } = useToast();
  const { state: sessionState, actorId } = useSession();
  const sent = useMemo(() => applicationsBy(sessionState, actorId), [sessionState, actorId]);
  const sentByDemand = useMemo(() => new Map(sent.map((a) => [a.demandId, a])), [sent]);
  /* QUOTA GRATUIT (D15) : un petit nombre de candidatures ACTIVES à la fois
     sur la formule gratuite, illimité en payant. Le quota se lit dans le
     catalogue (`applicationQuota` → `FREE_LIMITS`), jamais en dur. */
  const planId = useAgencyPlan();
  const quota = applicationQuota(planId);
  const quotaReached = quota !== null && sent.length >= quota;
  const unlimitedPlan = lowestPlanWith("demandes-accompagnement");
  const [openId, setOpenId] = useState<string | null>(null);
  const [form, setForm] = useState<ApplyForm>(EMPTY);
  const [errors, setErrors] = useState<string[]>([]);

  const update = (key: keyof ApplyForm, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const submit = (item: (typeof d.items)[number]) => {
    const errs: string[] = [];
    if (!form.rate.trim()) errs.push("Le taux (ou le forfait) proposé.");
    if (!form.included.trim()) errs.push("Ce que vous incluez.");
    if (!form.timeline.trim()) errs.push("Le délai estimé.");
    if (!form.ref1.trim() || !form.ref2.trim()) errs.push("Deux références locales.");
    setErrors(errs);
    if (errs.length > 0) return;
    if (quotaReached) return;
    recordSessionEvent({
      kind: "application.sent",
      data: {
        demandId: item.id,
        demandLabel: `${item.type} — ${item.sector}`,
        ownerId: "ownerId" in item ? item.ownerId : undefined,
        rate: form.rate.trim(),
        included: form.included.trim(),
        timeline: form.timeline.trim(),
        references: [form.ref1.trim(), form.ref2.trim()],
      },
    });
    setOpenId(null);
    setForm(EMPTY);
    addToast("Candidature envoyée. Le particulier la verra dans sa comparaison.", "success");
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-8">
      <header className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">{agencePage.eyebrow}</p>
        <h1 className="mt-1 text-xl font-bold text-[var(--foreground)] sm:text-2xl">{d.title}</h1>
        <p className="mt-1.5 text-sm leading-snug text-[var(--text-muted)]">{d.subtitle}</p>
      </header>

      <p className="mb-4 flex items-start gap-2 rounded-xl border border-[var(--primary)]/25 bg-[var(--primary)]/[0.05] px-3.5 py-2.5 text-[12px] leading-snug text-[var(--foreground)]">
        <Lock size={15} className="mt-0.5 shrink-0 text-[var(--primary)]" aria-hidden />
        <span>{d.applyNote}</span>
      </p>

      <div
        className={`mb-4 flex flex-wrap items-center gap-2 rounded-xl border px-3.5 py-2.5 text-[12.5px] ${
          quotaReached ? "border-amber-500/40 bg-amber-500/[0.08]" : "border-[var(--card-border)] bg-[var(--card)]"
        }`}
      >
        {quota === null ? (
          <span className="text-[var(--foreground)]">
            Candidatures illimitées avec votre formule {PLAN_META[planId]?.name ?? planId} · {sent.length} envoyée{sent.length > 1 ? "s" : ""}.
          </span>
        ) : (
          <>
            <span className="font-semibold text-[var(--foreground)]">
              {sent.length} / {quota} candidatures actives
            </span>
            <span className="text-[var(--text-muted)]">
              {quotaReached
                ? "Quota gratuit atteint : vous pourrez postuler à nouveau quand une candidature sera close, ou sans limite en payant."
                : `Quota gratuit de la formule ${PLAN_META[planId]?.name ?? planId}.`}
            </span>
            {unlimitedPlan && (
              <Link href="/agence/abonnement" className="ml-auto font-medium text-[var(--primary)] hover:underline">
                Illimité avec {PLAN_META[unlimitedPlan.id]?.name ?? unlimitedPlan.id}
              </Link>
            )}
          </>
        )}
      </div>

      <ul className="space-y-2.5">
        {d.items.map((item) => {
          const application = sentByDemand.get(item.id);
          const applicants = item.applicants + (application ? 1 : 0);
          const isOpen = openId === item.id;
          return (
            <li key={item.id} className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex-1 space-y-1.5">
                  <p className="flex items-center gap-1.5 text-[14px] font-semibold text-[var(--foreground)]">
                    <Home size={14} className="text-[var(--primary)]" aria-hidden />
                    {item.type}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[var(--text-muted)]">
                    <span className="flex items-center gap-1"><MapPin size={12} aria-hidden />{item.sector}</span>
                    <span className="flex items-center gap-1"><Wallet size={12} aria-hidden />{item.budget}</span>
                    <span className="flex items-center gap-1"><Clock size={12} aria-hidden />{item.posted}</span>
                    <span className="flex items-center gap-1">
                      <Users size={12} aria-hidden />
                      {applicants === 0 ? "Aucune agence n'a postulé" : applicants === 1 ? "1 agence a postulé" : `${applicants} agences ont postulé`}
                    </span>
                  </div>
                </div>
                {application ? (
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-2 text-[13px] font-medium text-emerald-500">
                    <Check size={14} aria-hidden /> {d.appliedLabel}
                  </span>
                ) : quotaReached ? (
                  <Link
                    href="/agence/abonnement"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--card-border)] px-4 py-2 text-[13px] font-medium text-[var(--text-muted)] hover:bg-[var(--hover-bg)]"
                  >
                    <Lock size={13} aria-hidden /> Quota atteint
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setOpenId(isOpen ? null : item.id);
                      setErrors([]);
                    }}
                    aria-expanded={isOpen}
                    className="shrink-0 rounded-lg bg-[var(--foreground)] px-4 py-2 text-[13px] font-medium text-[var(--background)] transition-opacity hover:opacity-90"
                  >
                    {isOpen ? "Annuler" : d.applyCta}
                  </button>
                )}
              </div>

              {/* Ce qui a été envoyé : les quatre champs, tels que le particulier les lit */}
              {application && (
                <dl className="mt-3 grid gap-2 border-t border-[var(--card-border)] pt-3 text-[12px] sm:grid-cols-2">
                  <div><dt className={labelCls}>Taux</dt><dd className="text-[var(--foreground)]">{application.rate}</dd></div>
                  <div><dt className={labelCls}>Délai</dt><dd className="text-[var(--foreground)]">{application.timeline}</dd></div>
                  <div><dt className={labelCls}>Inclus</dt><dd className="text-[var(--foreground)]">{application.included}</dd></div>
                  <div><dt className={labelCls}>Références</dt><dd className="text-[var(--foreground)]">{application.references.join(" · ")}</dd></div>
                </dl>
              )}

              {/* Le formulaire aux quatre champs imposés */}
              {isOpen && !application && (
                <form
                  className="mt-3 grid gap-3 border-t border-[var(--card-border)] pt-3 sm:grid-cols-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    submit(item);
                  }}
                >
                  <div>
                    <label htmlFor={`rate-${item.id}`} className={labelCls}>Taux ou forfait</label>
                    <input id={`rate-${item.id}`} className={inputCls} placeholder="Ex. 2,8 % du prix de vente" value={form.rate} onChange={(e) => update("rate", e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor={`timeline-${item.id}`} className={labelCls}>Délai estimé</label>
                    <input id={`timeline-${item.id}`} className={inputCls} placeholder="Ex. estimation sous 72 h" value={form.timeline} onChange={(e) => update("timeline", e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor={`included-${item.id}`} className={labelCls}>Inclus</label>
                    <textarea id={`included-${item.id}`} rows={2} className={inputCls} placeholder="Ex. photos, visites accompagnées, suivi notaire" value={form.included} onChange={(e) => update("included", e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor={`ref1-${item.id}`} className={labelCls}>Référence locale 1</label>
                    <input id={`ref1-${item.id}`} className={inputCls} placeholder="Ex. 4,5 p. — Neuchâtel, vendu en 5 semaines" value={form.ref1} onChange={(e) => update("ref1", e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor={`ref2-${item.id}`} className={labelCls}>Référence locale 2</label>
                    <input id={`ref2-${item.id}`} className={inputCls} placeholder="Ex. villa — Hauterive, vendue au prix" value={form.ref2} onChange={(e) => update("ref2", e.target.value)} />
                  </div>
                  {errors.length > 0 && (
                    <div role="alert" className="sm:col-span-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-[12px] text-red-400">
                      <p className="font-medium">Les quatre champs sont imposés. Il manque :</p>
                      <ul className="mt-0.5 list-disc pl-5">
                        {errors.map((er) => <li key={er}>{er}</li>)}
                      </ul>
                    </div>
                  )}
                  <div className="sm:col-span-2 flex justify-end">
                    <button type="submit" className="rounded-lg bg-[var(--foreground)] px-4 py-2 text-[13px] font-medium text-[var(--background)] hover:opacity-90">
                      Envoyer la candidature
                    </button>
                  </div>
                </form>
              )}
            </li>
          );
        })}
      </ul>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-[var(--foreground)]">Ce qu&apos;E-Dome ne fait pas ici</h2>
        <PlatformRules variant="compact" />
      </section>
    </div>
  );
}
