"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Link2 } from "lucide-react";
import { useApp } from "@/lib/context";
import type { ReferralTargetKind } from "@/lib/types";

/* Bannière de confiance affichée en tête d'une annonce quand on y arrive
   via un lien d'affiliation (?ref=…). Compte le clic une fois par visite
   sur le lien apporteur rattaché à cette annonce, s'il existe. */
function ReferralBannerInner({ kind, id }: { kind: ReferralTargetKind; id: string }) {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const { registerReferralClick } = useApp();
  const counted = useRef(false);

  useEffect(() => {
    if (ref && !counted.current) {
      counted.current = true;
      registerReferralClick({ kind, id });
    }
  }, [ref, kind, id, registerReferralClick]);

  if (!ref) return null;

  return (
    <div className="flex items-center gap-2 rounded-xl border border-[var(--primary)]/25 bg-[var(--primary)]/[0.08] px-3 py-2 text-sm">
      <Link2 size={15} className="text-[var(--primary)] shrink-0" />
      <span className="text-[var(--foreground)]">
        Vous suivez la{" "}
        <span className="font-medium text-[var(--primary)]">recommandation d&apos;un apporteur</span>.
      </span>
    </div>
  );
}

/* useSearchParams doit être sous <Suspense> pour le rendu Next 16. */
export function ReferralBanner(props: { kind: ReferralTargetKind; id: string }) {
  return (
    <Suspense fallback={null}>
      <ReferralBannerInner {...props} />
    </Suspense>
  );
}
