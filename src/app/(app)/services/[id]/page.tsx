"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { Check, MapPin, Clock, MessageCircle } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";
import { ServiceFlow } from "@/components/services/service-flow";
import { ServiceCover } from "@/components/services/service-visual";
import { RatingLine, Stars } from "@/components/services/stars";
import { servicesText } from "@/content/services";
import { useApp } from "@/lib/context";
import { isSessionId } from "@/lib/demo/session-views";
import { findService, ratingSummary, serviceReviews, servicesOf, type ServiceView } from "@/lib/demo/services-catalog";
import { useSession } from "@/lib/use-session";

/* /services/[id] — la fiche d'un service (P6a). Un prestataire de l'annuaire,
   ses avis réels (amorce + session), et le parcours devis → paiement → avis. */

const D = servicesText.detail;

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { state, hydrated } = useSession();
  const service = useMemo(() => findService(state, id), [state, id]);

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[50vh]">
        <p className="text-[var(--text-muted)]">{isSessionId(id) && !hydrated ? D.loading : D.notFound}</p>
        {!(isSessionId(id) && !hydrated) && (
          <Link href="/services" className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-sm font-medium">
            {D.back}
          </Link>
        )}
      </div>
    );
  }
  return <ServiceDetail service={service} />;
}

function ServiceDetail({ service }: { service: ServiceView }) {
  const { formatPrice } = useApp();
  const { state, actorId } = useSession();
  const reviews = useMemo(() => serviceReviews(state, service), [state, service]);
  const summary = ratingSummary(reviews);
  const others = useMemo(() => servicesOf(state, service.providerId).filter((s) => s.id !== service.id), [state, service]);
  const firstName = service.provider.split(" ")[0] ?? service.provider;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <BackButton fallbackHref="/services" label={D.back} />

        <div className="rounded-2xl overflow-hidden border border-[var(--card-border)] bg-[var(--card)]">
          <ServiceCover category={service.category} className="h-40 md:h-52" iconSize={64} />
          <div className="p-5 md:p-6 space-y-3">
            <span className="inline-block px-2.5 py-0.5 bg-[var(--primary)]/15 text-[var(--primary)] rounded-full text-xs font-medium">{service.category}</span>
            <h1 className="text-2xl md:text-3xl page-heading">{service.title}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Link href={`/profil/${service.providerId}`} className="inline-flex items-center gap-2 hover:underline">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={service.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                <span className="text-sm font-medium">{service.provider}</span>
              </Link>
              <a href="#avis" className="hover:opacity-80">
                <RatingLine summary={summary} />
              </a>
              <span className="text-sm">
                <span className="text-[var(--text-muted)]">{D.from} </span>
                <span className="font-bold text-[var(--primary)]">{formatPrice(service.price)}</span>
                <span className="text-[var(--text-muted)]"> {service.unit}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="space-y-3">
              <p className="text-[var(--text-secondary)] leading-relaxed">{service.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
                <span className="inline-flex items-center gap-1.5"><MapPin size={15} aria-hidden /> {D.zone} : {service.zone}</span>
                <span className="inline-flex items-center gap-1.5"><Clock size={15} aria-hidden /> {D.delay} : {service.delay}</span>
              </div>
            </section>

            {service.includes.length > 0 && (
              <section className="p-5 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl">
                <h2 className="font-semibold mb-3">{D.includes}</h2>
                <ul className="space-y-2">
                  {service.includes.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <Check size={15} className="mt-0.5 shrink-0 text-[var(--primary)]" aria-hidden /> {it}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {service.providerWords && (
              <section className="p-5 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl">
                <h2 className="font-semibold mb-2">{D.words}</h2>
                <p className="text-sm italic text-[var(--text-secondary)]">« {service.providerWords} »</p>
              </section>
            )}

            <section id="avis" className="scroll-mt-24">
              <h2 className="text-xl font-semibold mb-3">{D.reviewsTitle}</h2>
              {reviews.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)]">{D.noReviews}</p>
              ) : (
                <div className="space-y-3">
                  {reviews.map((r) => (
                    <article key={r.id} className="p-4 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl">
                      <div className="flex items-center gap-3 mb-2">
                        {r.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={r.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                          <span className="w-9 h-9 rounded-full bg-[var(--hover-bg)]" aria-hidden />
                        )}
                        <div className="min-w-0">
                          <Link href={`/profil/${r.authorId}`} className="font-medium text-sm hover:underline">{r.author}</Link>
                          <span className="block text-xs text-[var(--text-muted)]">
                            {r.date}
                            {r.fromSession && ` · ${D.sessionTag}`}
                          </span>
                        </div>
                        <div className="ml-auto"><Stars rating={r.rating} /></div>
                      </div>
                      {r.comment && <p className="text-sm text-[var(--text-secondary)]">{r.comment}</p>}
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-4">
            <div id="devis" className="scroll-mt-24 lg:sticky lg:top-4 p-5 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl">
              <ServiceFlow key={`${actorId}-${service.id}`} service={service} />
            </div>

            <div className="p-5 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl space-y-3">
              <span className="text-xs text-[var(--text-muted)]">{D.provider}</span>
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={service.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                <span className="font-semibold">{service.provider}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link href={`/profil/${service.providerId}`} className="py-2 text-center rounded-xl border border-[var(--card-border)] text-sm hover:bg-[var(--hover-bg)]">
                  {D.seeProfile}
                </Link>
                {service.providerId !== actorId && (
                  <Link href={`/messages?to=${service.providerId}`} className="py-2 rounded-xl border border-[var(--card-border)] text-sm hover:bg-[var(--hover-bg)] inline-flex items-center justify-center gap-1.5">
                    <MessageCircle size={14} aria-hidden /> {D.write}
                  </Link>
                )}
              </div>
            </div>

            {others.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">{D.others(firstName)}</h3>
                {others.map((s) => (
                  <Link key={s.id} href={`/services/${s.id}`} className="flex items-center gap-3 p-3 bg-[var(--card)] border border-[var(--card-border)] rounded-xl hover:border-[var(--primary)]/40 transition-colors">
                    <ServiceCover category={s.category} className="w-12 h-12 rounded-lg shrink-0" iconSize={20} />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium truncate">{s.title}</span>
                      <span className="text-xs text-[var(--text-muted)]">{D.from} {formatPrice(s.price)} {s.unit}</span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
