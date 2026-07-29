"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Copy, Check, Coins } from "lucide-react";
import { useApp } from "@/lib/context";
import { buildObjectAffiliate, REFERRAL_ROUTE } from "@/lib/referral-links";
import { estimateEarning } from "@/lib/rewards";
import { properties as ALL_PROPERTIES, formations as ALL_FORMATIONS } from "@/lib/mock-data";
import { EVENTS } from "@/app/(app)/evenements/[id]/page";
import type { ReferralTargetKind, TransactionType, Currency } from "@/lib/types";

/* ─── Espace apporteur en tête du feed (inspiration Whop) ─────────────────
   Deux blocs : (1) l'état du compte apporteur (gains, clics, conversions,
   liens) ; (2) une sélection de recommandations lucratives — un
   investissement, un bien premium à louer, un événement, une formation —
   avec le gain potentiel « jusqu'à X » et une action « Recommander » qui
   crée le lien et le copie. Pas de points : tout est en argent réel. */

interface Opportunity {
  kind: ReferralTargetKind;
  id: string;
  title: string;
  subtitle: string;
  image: string;
  price: number;
  currency?: Currency;
  transactionType?: TransactionType;
  cat: string;
  emoji: string;
  earnMax: number;
  earnCurrency: Currency;
}

export function AffiliateHub() {
  const { formatPrice, referralLinks, addReferralLink } = useApp();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const balance = referralLinks.reduce((s, l) => s + (l.earned || 0), 0);
  const clicks = referralLinks.reduce((s, l) => s + (l.clicks || 0), 0);
  const conversions = referralLinks.reduce((s, l) => s + (l.conversions || 0), 0);

  const opportunities = useMemo<Opportunity[]>(() => {
    const list: Opportunity[] = [];

    // Investissements (rendement le plus élevé)
    ALL_PROPERTIES
      .filter((p) => p.transactionType === "vente" && (p.analytics?.rendementBrut ?? 0) > 0)
      .sort((a, b) => (b.analytics!.rendementBrut) - (a.analytics!.rendementBrut))
      .slice(0, 2)
      .forEach((p) => list.push({
        kind: "bien", id: p.id, title: p.title, subtitle: `${p.location.city} · ${p.analytics!.rendementBrut.toFixed(1)}% brut`,
        image: p.images[0], price: p.price, currency: p.currency as Currency, transactionType: p.transactionType,
        cat: "Investissement", emoji: "💎",
        ...earn("bien", p.price, p.transactionType, p.currency as Currency),
      }));

    // Bien premium à louer (le plus cher en location)
    const premiumRental = ALL_PROPERTIES
      .filter((p) => p.transactionType === "location-ct" || p.transactionType === "location-lt")
      .sort((a, b) => b.price - a.price)[0];
    if (premiumRental) list.push({
      kind: "bien", id: premiumRental.id, title: premiumRental.title,
      subtitle: `${premiumRental.location.city} · ${premiumRental.transactionType === "location-ct" ? "court séjour" : "longue durée"}`,
      image: premiumRental.images[0], price: premiumRental.price, currency: premiumRental.currency as Currency,
      transactionType: premiumRental.transactionType, cat: "Location premium", emoji: "🏝️",
      ...earn("bien", premiumRental.price, premiumRental.transactionType, premiumRental.currency as Currency),
    });

    // Événement (billet le plus cher)
    const ev = [...EVENTS].filter((e) => e.prix > 0).sort((a, b) => b.prix - a.prix)[0];
    if (ev) list.push({
      kind: "evenement", id: ev.id, title: ev.titre, subtitle: `${ev.type} · ${ev.lieu}`,
      image: ev.thumbnail, price: ev.prix, currency: "CHF", cat: "Événement", emoji: "🎟️",
      ...earn("evenement", ev.prix, undefined, "CHF"),
    });

    // Formation (la plus chère)
    const fo = [...ALL_FORMATIONS].sort((a, b) => b.price - a.price)[0];
    if (fo) list.push({
      kind: "formation", id: fo.id, title: fo.title, subtitle: `Par ${fo.instructor.firstName} ${fo.instructor.lastName}`,
      image: fo.thumbnail, price: fo.price, currency: fo.currency as Currency, cat: "Formation", emoji: "🎓",
      ...earn("formation", fo.price, undefined, fo.currency as Currency),
    });

    return list.sort((a, b) => b.earnMax - a.earnMax);
  }, []);

  const recommend = (opp: Opportunity) => {
    const link = buildObjectAffiliate(opp.kind, opp.id, opp.title, { image: opp.image, price: opp.price, currency: opp.currency });
    addReferralLink(link);
    try { navigator.clipboard?.writeText(`https://${link.url}`); } catch { /* ignore */ }
    setCopiedId(opp.id);
    setTimeout(() => setCopiedId((c) => (c === opp.id ? null : c)), 2000);
  };

  return (
    <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] overflow-hidden">
      {/* État du compte */}
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Espace apporteur</p>
          <p className="text-2xl font-bold text-[var(--foreground)] mt-0.5 inline-flex items-baseline gap-1.5">
            {formatPrice(balance)}
            <span className="text-sm font-normal text-[var(--text-muted)]">gagnés</span>
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {referralLinks.length} liens actifs · {clicks} clics · {conversions} conversions
          </p>
        </div>
        <Link href="/apporteurs" className="shrink-0 inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 transition">
          Tableau de bord <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Recommandations lucratives */}
      <div className="border-t border-[var(--card-border)] p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[var(--foreground)] inline-flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-[var(--primary)]" /> Recommandez &amp; gagnez
          </h3>
          <span className="text-xs text-[var(--text-muted)]">Sélection pour vous</span>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4">
          {opportunities.map((opp) => (
            <div key={`${opp.kind}-${opp.id}`} className="w-[240px] shrink-0 rounded-xl border border-[var(--card-border)] overflow-hidden bg-[var(--background)]">
              <Link href={`${REFERRAL_ROUTE[opp.kind]}/${opp.id}`} className="block relative h-24">
                <img src={opp.image} alt="" className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/55 backdrop-blur-sm text-white text-[11px] font-medium">
                  {opp.emoji} {opp.cat}
                </span>
              </Link>
              <div className="p-3">
                <Link href={`${REFERRAL_ROUTE[opp.kind]}/${opp.id}`}>
                  <p className="text-sm font-semibold text-[var(--foreground)] truncate hover:underline">{opp.title}</p>
                </Link>
                <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">{opp.subtitle}</p>
                <p className="mt-2 text-sm text-[var(--foreground)]">
                  Gagnez jusqu&apos;à <span className="font-bold text-[var(--primary)]">{formatPrice(opp.earnMax, opp.earnCurrency)}</span>
                </p>
                <button
                  onClick={() => recommend(opp)}
                  className="mt-2.5 w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 transition"
                >
                  {copiedId === opp.id ? (<><Check className="w-4 h-4" /> Lien copié</>) : (<><Copy className="w-4 h-4" /> Recommander</>)}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Helper local : mappe estimateEarning vers les champs earnMax/earnCurrency.
function earn(kind: ReferralTargetKind, price: number, transactionType: TransactionType | undefined, currency: Currency) {
  const e = estimateEarning(kind, price, { transactionType, currency });
  return { earnMax: e.max, earnCurrency: e.currency };
}
