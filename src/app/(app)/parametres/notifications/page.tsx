import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import { getEmailNotifications } from "@/lib/supabase/notification-actions";
import { EmailToggle } from "@/components/settings/email-toggle";

export const metadata: Metadata = { title: "Notifications", robots: { index: false, follow: false } };

/* ── /parametres/notifications — la page vers laquelle pointent les e-mails ── */
export default async function NotificationsSettingsPage() {
  const on = await getEmailNotifications();
  if (on === null) redirect("/auth/connexion?redirect=%2Fparametres%2Fnotifications");

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/parametres" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Réglages
      </Link>
      <h1 className="page-heading mt-4 text-[28px]">Notifications</h1>

      <section className="mt-6 rounded-2xl border bg-card p-5">
        <div className="flex items-start gap-4">
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-leman" aria-hidden />
          <div className="flex-1">
            <p className="text-[15px] font-semibold">E-mails importants</p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Un e-mail court quand :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] text-muted-foreground">
              <li>quelqu&apos;un vous écrit ou demande une visite pour un de vos biens ;</li>
              <li>un apporteur vous présente un contact, ou quelqu&apos;un répond à votre recherche ;</li>
              <li>votre mise en relation ou votre proposition est acceptée (ou refusée).</li>
            </ul>
            <p className="mt-3 text-[12px] text-muted-foreground">Jamais de publicité. Les coordonnées d&apos;un tiers ne figurent jamais dans un e-mail : elles restent dans votre espace.</p>
          </div>
          <EmailToggle initial={on} />
        </div>
      </section>
    </div>
  );
}
