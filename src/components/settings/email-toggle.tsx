"use client";

import { useState, useTransition } from "react";
import { setEmailNotifications } from "@/lib/supabase/notification-actions";
import { cn } from "@/lib/utils";

/* Interrupteur des e-mails de notification (enregistré immédiatement). */
export function EmailToggle({ initial }: { initial: boolean }) {
  const [on, setOn] = useState(initial);
  const [error, setError] = useState(false);
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    const next = !on;
    setOn(next);
    setError(false);
    startTransition(async () => {
      const res = await setEmailNotifications(next);
      if (!res.ok) { setOn(!next); setError(true); }
    });
  };

  return (
    <div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label="Recevoir les e-mails de notification"
        onClick={toggle}
        disabled={isPending}
        className={cn("relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors", on ? "bg-leman" : "bg-foreground/20")}
      >
        <span className={cn("inline-block h-5 w-5 rounded-full bg-white shadow transition-transform", on ? "translate-x-5.5" : "translate-x-0.5")} />
      </button>
      {error && <p role="alert" className="mt-1 text-[12px] text-[var(--danger-text)]">Non enregistré. Réessayez.</p>}
    </div>
  );
}
