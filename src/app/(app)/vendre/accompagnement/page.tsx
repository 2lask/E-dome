"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Clock, MapPin, ArrowRight } from "lucide-react";
import { accompagnementPage } from "@/content/accompagnement";
import { PlatformRules } from "@/components/legal/platform-rules";
import { useToast } from "@/components/ui/toast";

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
  const [opened, setOpened] = useState<Set<string>>(new Set());

  const openContact = (id: string, agency: string) => {
    setOpened((prev) => new Set(prev).add(id));
    addToast(`Contact ouvert avec ${agency}. Elle reçoit vos coordonnées.`, "success");
    router.push("/messages");
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-8">
      <header className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">{a.eyebrow}</p>
        <h1 className="mt-1 text-xl font-bold leading-tight text-[var(--foreground)] sm:text-2xl">{a.title}</h1>
        <p className="mt-1.5 max-w-3xl text-sm leading-snug text-[var(--text-muted)]">{a.subtitle}</p>
      </header>

      {/* La note de confidentialité — le sens de circulation, qui est le point */}
      <p className="mb-4 flex items-start gap-2 rounded-xl border border-[var(--primary)]/25 bg-[var(--primary)]/[0.05] px-3.5 py-2.5 text-[12.5px] leading-snug text-[var(--foreground)]">
        <Lock size={15} className="mt-0.5 shrink-0 text-[var(--primary)]" aria-hidden />
        <span>{a.privacyNote}</span>
      </p>

      {/* Les trois propositions, champs alignés */}
      <div className="grid gap-3 md:grid-cols-3">
        {a.proposals.map((p) => {
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
                onClick={() => openContact(p.id, p.agency)}
                disabled={isOpen}
                className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--foreground)] px-4 py-2.5 text-[13px] font-medium text-[var(--background)] transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isOpen ? "Contact ouvert" : a.openContact}
                {!isOpen && <ArrowRight size={14} aria-hidden />}
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
