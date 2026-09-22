"use client";

import { useState } from "react";
import { Check, Copy, Linkedin, Mail, MessageCircle } from "lucide-react";
import { thanks } from "@/content/landing";
import { track } from "@/lib/analytics";
import { controlCls } from "./interest-form/fields";
import { cn } from "@/lib/utils";

/* Lien de parrainage : copie et partage.

   Le champ affichant le lien est un `<input readOnly` et non un bloc de
   texte : on peut le sélectionner, le copier au clavier et le lire dans un
   lecteur d'écran, y compris si l'API de presse-papiers est indisponible
   (navigateur ancien, contexte non sécurisé, permission refusée).

   Le repli sur `select()` compte vraiment : `navigator.clipboard` n'existe
   pas hors HTTPS, donc le bouton serait muet en développement local sans
   cela. */

export function ReferralShare({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      track("referral_copied");
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      /* Presse-papiers refusé : on sélectionne le texte pour que la copie
         manuelle reste possible. */
      const input = document.getElementById("referral-url");
      if (input instanceof HTMLInputElement) {
        input.focus();
        input.select();
      }
    }
  };

  const shareText = `${thanks.referral.shareBody} ${url}`;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6">
      <h2 className="text-base font-semibold text-[var(--foreground)]">
        {thanks.referral.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
        {thanks.referral.body}
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label htmlFor="referral-url" className="sr-only">
          {thanks.referral.title}
        </label>
        <input
          id="referral-url"
          type="text"
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          className={cn(controlCls, "font-mono text-xs sm:text-sm")}
        />
        <button
          type="button"
          onClick={copy}
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-5 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
        >
          {copied ? (
            <Check size={16} strokeWidth={2.2} aria-hidden="true" />
          ) : (
            <Copy size={16} strokeWidth={2} aria-hidden="true" />
          )}
          {copied ? thanks.referral.copiedLabel : thanks.referral.copyLabel}
        </button>
      </div>

      {/* `aria-live` : la confirmation de copie doit être annoncée, pas
          seulement affichée sur le bouton. */}
      <p aria-live="polite" className="sr-only">
        {copied ? thanks.referral.copiedLabel : ""}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--border)] px-4 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
        >
          <Linkedin size={15} strokeWidth={1.9} aria-hidden="true" />
          {thanks.referral.shareLinkedIn}
        </a>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--border)] px-4 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
        >
          <MessageCircle size={15} strokeWidth={1.9} aria-hidden="true" />
          {thanks.referral.shareWhatsApp}
        </a>
        <a
          href={`mailto:?subject=${encodeURIComponent(thanks.referral.shareSubject)}&body=${encodeURIComponent(shareText)}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--border)] px-4 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
        >
          <Mail size={15} strokeWidth={1.9} aria-hidden="true" />
          {thanks.referral.shareEmail}
        </a>
      </div>
    </div>
  );
}
