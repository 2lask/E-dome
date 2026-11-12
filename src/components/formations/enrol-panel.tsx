"use client";

import { useState } from "react";
import { MoneyFlow } from "@/components/pricing/money-flow";
import { formationsText } from "@/content/formations";
import { enrolmentCharge } from "@/lib/demo/lessons";
import { groupThousands } from "@/lib/demo/session-views";
import type { Formation } from "@/lib/types";
import { recordSessionEvent } from "@/lib/use-session";

/* Inscription à une formation (P6a) : « S'inscrire » ouvre l'étape de
   paiement, qui montre qui reçoit quoi (`MoneyFlow` → `quote()`), puis
   « Payer » inscrit `formation.enrolled` au journal, au nom de l'acteur. */

const T = formationsText.detail;

export function EnrolPanel({ formation, onEnrolled }: { formation: Formation; onEnrolled?: () => void }) {
  const [step, setStep] = useState<"idle" | "pay">("idle");
  const amount = `${groupThousands(formation.price)} CHF`;

  if (step === "idle") {
    return (
      <button
        type="button"
        onClick={() => setStep("pay")}
        className="w-full py-3 bg-[var(--primary)] hover:opacity-90 text-white rounded-xl font-medium transition-opacity"
      >
        {T.enrol}
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">{T.payTitle}</h3>
      <MoneyFlow charge={enrolmentCharge(formation.price)} beneficiaryLabel={T.beneficiary} grossLabel={T.grossLabel} />
      <p className="text-[11px] text-[var(--text-muted)]">{T.payHint}</p>
      <button
        type="button"
        onClick={() => {
          recordSessionEvent({
            kind: "formation.enrolled",
            data: { formationId: formation.id, authorId: formation.instructor.id, priceChf: formation.price },
          });
          setStep("idle");
          onEnrolled?.();
        }}
        className="w-full py-3 bg-[var(--primary)] hover:opacity-90 text-white rounded-xl font-medium transition-opacity"
      >
        {T.pay(amount)}
      </button>
      <button
        type="button"
        onClick={() => setStep("idle")}
        className="w-full py-2 rounded-xl border border-[var(--card-border)] text-sm text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]"
      >
        {T.cancel}
      </button>
    </div>
  );
}
