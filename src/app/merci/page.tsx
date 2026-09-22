import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { ArrowRight, CalendarCheck, Check } from "lucide-react";
import { demo, thanks } from "@/content/landing";
import { normalizeRefCode } from "@/lib/leads/ref-code";
import { buildReferralUrl } from "@/lib/leads/tracking";
import { Container } from "@/components/landing/section";
import { ReferralShare } from "@/components/landing/referral-share";
import { LandingFooter } from "@/components/landing/landing-footer";

/* ── Page de remerciement ────────────────────────────────────────────────────

   `noindex` : cette page n'a aucun intérêt dans un moteur de recherche, et
   surtout elle ne doit pas apparaître dans les résultats avec le code de
   parrainage de quelqu'un dans l'URL.

   L'URL de base est déduite des en-têtes de la requête plutôt que codée en
   dur, pour que le lien de parrainage soit juste aussi sur un déploiement de
   prévisualisation Vercel, dont le domaine change à chaque branche.

   Le code reçu est renormalisé : il arrive d'une chaîne de requête, donc de
   l'extérieur. Sans code valide, la page s'affiche sans le bloc de partage
   plutôt que d'exposer un lien bancal. */

export const metadata: Metadata = {
  title: `${thanks.title} · E-Dome`,
  robots: { index: false, follow: false },
};

async function baseUrl(): Promise<string> {
  const explicit = process.env.NEXT_PUBLIC_BASE_URL;
  if (explicit) return explicit;

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "e-dome.ch";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.ref) ? params.ref[0] : params.ref;
  const refCode = normalizeRefCode(raw);
  const referralUrl = refCode ? buildReferralUrl(await baseUrl(), refCode) : null;
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;

  return (
    <>
      <main className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--success-soft)] text-[var(--success-text)]">
              <Check size={24} strokeWidth={2.2} aria-hidden="true" />
            </span>

            <h1 className="page-heading mt-6 text-3xl leading-tight text-[var(--foreground)] sm:text-4xl">
              {thanks.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
              {thanks.subtitle}
            </p>

            <section className="mt-10">
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                {thanks.nextSteps.title}
              </h2>
              <ul className="mt-3 space-y-2.5">
                {thanks.nextSteps.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                    <Check
                      size={16}
                      strokeWidth={2}
                      className="mt-0.5 shrink-0 text-[var(--text-muted)]"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {referralUrl && (
              <section className="mt-10">
                <ReferralShare url={referralUrl} />
              </section>
            )}

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {/* Affiché seulement si une URL de prise de rendez-vous existe. */}
              {bookingUrl && (
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-6 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
                >
                  <CalendarCheck size={16} strokeWidth={2} aria-hidden="true" />
                  {thanks.bookingCta}
                </a>
              )}
              <Link
                href={demo.href}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-6 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
              >
                {thanks.demoCta}
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </Link>
              <Link
                href="/"
                className="inline-flex min-h-12 items-center justify-center rounded-lg px-4 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--foreground)]"
              >
                {thanks.backHome}
              </Link>
            </div>
          </div>
        </Container>
      </main>

      <LandingFooter />
    </>
  );
}
