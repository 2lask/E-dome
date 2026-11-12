"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search as SearchIcon, Check } from "lucide-react";
import { useApp } from "@/lib/context";
import { PageHeader } from "@/components/ui/page-header";
import { ServiceCover, CategoryIcon } from "@/components/services/service-visual";
import { RatingLine } from "@/components/services/stars";
import { servicesText } from "@/content/services";
import { useSession } from "@/lib/use-session";
import { quotedServiceIds } from "@/lib/demo/session-views";
import { allServices, ratingSummary, serviceReviews } from "@/lib/demo/services-catalog";

/* /services — le catalogue (P6a). Chaque service est tenu par une personne
   de l'annuaire (`lib/demo/services-catalog.ts`) ; sa note se dérive de ses
   avis réels, « Nouveau » sinon. La carte ouvre la fiche `/services/[id]`,
   où se fait la demande de devis. Les services publiés pendant la visite
   passent en tête. */

const L = servicesText.list;

/* `useSearchParams` exige une frontière Suspense en App Router (Next 16). */
export default function ServicesPage() {
  return (
    <React.Suspense fallback={null}>
      <ServicesPageInner />
    </React.Suspense>
  );
}

function ServicesPageInner() {
  const { formatPrice } = useApp();
  const searchParams = useSearchParams();
  const focusId = searchParams.get("focus");
  const { state: sessionState, actorId } = useSession();
  const services = useMemo(
    () =>
      allServices(sessionState).map((s) => ({
        ...s,
        summary: ratingSummary(serviceReviews(sessionState, s)),
      })),
    [sessionState],
  );
  const categories = useMemo(() => [L.all, ...new Set(services.map((s) => s.category))], [services]);
  /* Un devis déjà demandé pendant la session reste visible. */
  const quoted = useMemo(() => quotedServiceIds(sessionState, actorId), [sessionState, actorId]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>(L.all);

  /* Arrivée depuis « Voir mon service » : on fait défiler jusqu'à la carte. */
  useEffect(() => {
    if (!focusId) return;
    const t = setTimeout(() => document.getElementById(`service-${focusId}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 150);
    return () => clearTimeout(t);
  }, [focusId, services.length]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return services.filter((s) => {
      const matchSearch = s.title.toLowerCase().includes(q) || s.provider.toLowerCase().includes(q);
      const matchCat = category === L.all || s.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category, services]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        <PageHeader
          title={L.title}
          description={L.description}
          variant="serif"
          actions={
            <Link href="/services/proposer" className="px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-xl font-medium transition-colors">
              {L.propose}
            </Link>
          }
        />

        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" aria-hidden />
          <input
            type="text"
            placeholder={L.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[var(--card)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => {
            const active = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${active ? "bg-[var(--primary)] text-white" : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[var(--primary)]/40"}`}
              >
                {cat === L.all ? <SearchIcon size={14} aria-hidden /> : <CategoryIcon category={cat} />}
                {cat}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Patron « lien étiré » : la carte entière ouvre la fiche, le lien
              vers le profil du prestataire passe au-dessus (pas de <Link>
              imbriqué). */}
          {filtered.map((service) => (
            <article
              key={service.id}
              id={`service-${service.id}`}
              className={`relative bg-[var(--card)] border rounded-2xl overflow-hidden hover:border-[var(--primary)]/40 transition-colors ${
                focusId === service.id ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/30" : "border-[var(--card-border)]"
              }`}
            >
              <Link href={`/services/${service.id}`} className="absolute inset-0 z-10" aria-label={service.title} />
              <ServiceCover category={service.category} />
              <div className="p-4 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-block px-2 py-0.5 bg-[var(--primary)]/20 text-[var(--primary)] rounded-full text-xs font-medium">{service.category}</span>
                  <RatingLine summary={service.summary} />
                </div>
                <h3 className="font-semibold line-clamp-2">{service.title}</h3>
                <Link href={`/profil/${service.providerId}`} className="relative z-20 inline-flex items-center gap-2 hover:underline">
                  {service.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={service.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <span aria-hidden className="w-6 h-6 rounded-full bg-[var(--hover-bg)]" />
                  )}
                  <span className="text-sm text-[var(--text-secondary)]">{service.provider}</span>
                </Link>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="font-bold text-[var(--primary)]">{formatPrice(service.price)}</span>
                    <span className="text-xs text-[var(--text-muted)]"> {service.unit}</span>
                  </div>
                  {quoted.has(service.id) ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/15 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium">
                      <Check size={14} strokeWidth={2.5} aria-hidden /> {L.quoteSent}
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 bg-[var(--primary)] text-white rounded-lg text-sm font-medium">{L.details}</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
        {filtered.length === 0 && <p className="text-center text-[var(--text-muted)] py-12">{L.empty}</p>}

        <section className="py-10">
          <h2 className="text-2xl font-bold text-center mb-8">{L.howTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {L.steps.map((step, i) => (
              <div key={step.title} className="text-center p-6 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl">
                <div className="w-12 h-12 bg-[var(--primary)]/20 text-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">{i + 1}</div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
