"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Clock, MapPin, ArrowRight } from "lucide-react";
import { accompagnementPage } from "@/content/accompagnement";
import { PlatformRules } from "@/components/legal/platform-rules";
import { useToast } from "@/components/ui/toast";
import { useSession, recordSessionEvent } from "@/lib/use-session";
import { applicationsReceivedBy, contactedProposalIds, displayName } from "@/lib/demo/session-views";

/* ── `/vendre/accompagnement` — comparer les propositions ────────────────────

   Le quatrième des cinq temps du mécanisme (DECISIONS §2.3) : le particulier
   compare des propositions anonymes et ouvre le contact lui-même. Les quatre
   champs imposés — commission, inclus, délai, références — sont alignés d'une
   carte à l'autre, pour que la comparaison porte sur du comparable. Le contenu
   vit dans `content/accompagnement.ts`. */

export default function AccompagnementPage() {
  const a = accompagnementPage;
  const router = useRouter();
  const { addToast } = useToast();
  /* Ouvrir le contact laisse une trace : l'événement `agency.contacted` crée
     la conversation avec la personne de l'agence (et la notifie). C'est le
     seul moment où l'identité du particulier circule — par son acte. */
  const { state: sessionState, actorId } = useSession();
  const opened = useMemo(() => contactedProposalIds(sessionState, actorId), [sessionState, actorId]);
  /* Les candidatures reçues en session sur les demandes de l'acteur (une
     agence a postulé depuis /agence/demandes) s'ajoutent à la comparaison. */
  const received = useMemo(() => applicationsReceivedBy(sessionState, actorId), [sessionState, actorId]);

  const openContact = (id: string, agency: string, contactId: string) => {
    if (contactId === actorId) {
      addToast("Cette proposition est la vôtre.", "info");
      return;
    }
    if (!opened.has(id)) {
      recordSessionEvent({ kind: "agency.contacted", data: { toId: contactId, proposalId: id, agencyName: agency } });
    }
    addToast(`Contact ouvert avec ${agency}. La conversation est dans vos messages.`, "success");
    router.push(`/messages?to=${contactId}`);
  };

  const proposals = [
    ...received.map((r) => ({
      id: r.id,
      agency: displayName(r.agencyId),
      contactId: r.agencyId,
      contactLabel: `${displayName(r.agencyId)} · ${r.demandLabel}`,
      verified: false,
      rate: r.rate,
      included: r.included.split(/[,;\n]/).map((x) => x.trim()).filter(Boolean),
      timeline: r.timeline,
      references: [...r.references],
      respondedAgo: "à l'instant",
    })),
    ...a.proposals,
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-8">
      <header className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">{a.eyebrow}</p>
        <h1 className="mt-1 text-xl font-bold leading-tight text-[var(--foreground)] sm:text-2xl">{a.title}</h1>
        <p className="mt-1.5 max-w-3xl text-sm leading-snug text-[var(--text-muted)]">{a.subtitle}</p>
      </header>

      {/* La note de confidentialité — le sens de circulation, qui est le point */}
      <p data-tour="accomp-privacy" className="mb-4 flex items-start gap-2 rounded-xl border border-[var(--primary)]/25 bg-[var(--primary)]/[0.05] px-3.5 py-2.5 text-[12.5px] leading-snug text-[var(--foreground)]">
        <Lock size={15} className="mt-0.5 shrink-0 text-[var(--primary)]" aria-hidden />
        <span>{a.privacyNote}</span>
      </p>

      {/* Les trois propositions, champs alignés */}
      <div data-tour="accomp-proposals" className="grid gap-3 md:grid-cols-3">
        {proposals.map((p) => {
          const isOpen = opened.has(p.id);
          return (
            <section
              key={p.id}
              className="flex flex-col rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4"
            >
              <div className="mb-1 flex items-center gap-1.5">
                <h2 className="text-[15px] font-bold text-[var(--foreground)]">{p.agency}</h2>
                {p.verified && (
                  <ShieldCheck size={15} className="text-emerald-500" aria-label="Agence vérifiée" />
                )}
              </div>
              <p className="text-[11.5px] text-[var(--text-secondary)]">{p.contactLabel}</p>
              <p className="mb-3 flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                <Clock size={11} aria-hidden />
                {p.respondedAgo}
              </p>

              <dl className="flex-1 space-y-2.5">
                <div>
                  <dt className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                    {a.fieldLabels.rate}
                  </dt>
                  <dd className="text-[13.5px] font-semibold text-[var(--foreground)]">{p.rate}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                    {a.fieldLabels.included}
                  </dt>
                  <dd>
                    <ul className="mt-0.5 space-y-0.5">
                      {p.included.map((inc) => (
                        <li key={inc} className="text-[12px] leading-snug text-[var(--foreground)]">
                          {inc}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                    {a.fieldLabels.timeline}
                  </dt>
                  <dd className="text-[12px] leading-snug text-[var(--foreground)]">{p.timeline}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                    {a.fieldLabels.references}
                  </dt>
                  <dd>
                    <ul className="mt-0.5 space-y-1">
                      {p.references.map((ref) => (
                        <li key={ref} className="flex items-start gap-1 text-[12px] leading-snug text-[var(--text-muted)]">
                          <MapPin size={11} className="mt-0.5 shrink-0" aria-hidden />
                          {ref}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() => openContact(p.id, p.agency, p.contactId)}
                className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--foreground)] px-4 py-2.5 text-[13px] font-medium text-[var(--background)] transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isOpen ? "Contact ouvert · voir la conversation" : a.openContact}
                <ArrowRight size={14} aria-hidden />
              </button>
            </section>
          );
        })}
      </div>

      <p className="mt-2 text-center text-[11.5px] text-[var(--text-muted)]">{a.openContactHint}</p>

      {/* Temps 5 : l'élargissement du rayon */}
      <p className="mt-4 rounded-xl border border-dashed border-[var(--card-border)] px-3.5 py-2.5 text-[12px] leading-snug text-[var(--text-muted)]">
        {a.widening}
      </p>

      {/* Les quatre règles, ensemble */}
      <section className="mt-6">
        <h2 className="text-sm font-semibold text-[var(--foreground)]">{a.rulesTitle}</h2>
        <p className="mt-1 mb-3 max-w-2xl text-[12.5px] leading-snug text-[var(--text-muted)]">{a.rulesIntro}</p>
        <PlatformRules variant="full" />
      </section>
    </div>
  );
}
