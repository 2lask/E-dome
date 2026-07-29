"use client";

import { useState } from "react";
import Link from "next/link";
import { Link2, Check, Copy, ArrowRight, Coins } from "lucide-react";
import { useApp } from "@/lib/context";
import { buildObjectAffiliate } from "@/lib/referral-links";
import { estimateEarning } from "@/lib/rewards";
import type { ReferralTargetKind, TransactionType, Currency } from "@/lib/types";

/* Bouton « Recommander & gagner » posé sur chaque annonce vendable.
   Au clic : génère (ou retrouve) le lien d'affiliation rattaché à
   l'annonce, l'ajoute à « Mes liens » (dédup côté contexte), crédite des
   points de récompense, et ouvre un popover avec le gain potentiel, l'URL
   partageable et un accès à la page Apporteurs. */
export function RecommendButton({
  kind,
  id,
  title,
  image,
  price,
  currency,
  transactionType,
  className,
}: {
  kind: ReferralTargetKind;
  id: string;
  title: string;
  image?: string;
  price?: number;
  currency?: string;
  transactionType?: TransactionType;
  className?: string;
}) {
  const { addReferralLink, hasReferralLinkFor, formatPrice } = useApp();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [existed, setExisted] = useState(false);

  const link = buildObjectAffiliate(kind, id, title, { image, price, currency, transactionType });
  const earning = price != null
    ? estimateEarning(kind, price, { transactionType, currency: currency as Currency | undefined })
    : null;

  const handleClick = () => {
    setExisted(hasReferralLinkFor(kind, id));
    addReferralLink(link);
    setOpen((o) => !o);
  };

  const copy = () => {
    navigator.clipboard?.writeText(`https://${link.url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        className={
          className ??
          "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--card-border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
        }
      >
        <Link2 size={15} className="text-[var(--primary)]" />
        Recommander &amp; gagner
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-[var(--card-border)] bg-[var(--card)] shadow-xl p-3 animate-scale-in">
            {/* Gain potentiel — accroche lucrative */}
            {earning && earning.max > 0 && (
              <div className="flex items-center gap-2 rounded-lg bg-[var(--primary)]/[0.07] border border-[var(--primary)]/20 px-3 py-2 mb-2.5">
                <Coins className="w-4 h-4 text-[var(--primary)] shrink-0" />
                <p className="text-sm text-[var(--foreground)]">
                  Gagnez jusqu&apos;à{" "}
                  <span className="font-bold text-[var(--primary)]">{formatPrice(earning.max, earning.currency)}</span>
                </p>
              </div>
            )}

            <p className="text-sm font-semibold text-[var(--foreground)] inline-flex items-center gap-1.5">
              <Check size={14} className="text-emerald-400" />
              {existed ? "Lien déjà dans vos liens" : "Lien d'affiliation créé"}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Commission : <span className="text-[var(--primary)] font-medium">{link.commission}</span></p>

            <div className="mt-2 flex items-center gap-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] px-2 py-1.5">
              <span className="text-xs text-[var(--text-muted)] truncate flex-1">{link.url}</span>
            </div>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={copy}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90 transition"
              >
                {copied ? (<><Check size={14} /> Copié</>) : (<><Copy size={14} /> Copier</>)}
              </button>
              <Link
                href="/apporteurs"
                className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-[var(--hover-bg)] text-[var(--text-secondary)] text-sm hover:opacity-80 transition"
              >
                Mes liens <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
