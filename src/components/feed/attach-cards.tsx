"use client";
import Link from "next/link";
import { MapPin, X, Calendar, GraduationCap, BarChart3, TrendingUp, TrendingDown, ArrowRight, Link2, Coins } from "lucide-react";
import { useApp } from "@/lib/context";
import { formatCount, formatDate } from "@/lib/utils";
import { estimateEarning } from "@/lib/pricing";
import type { Property, AnalyticsMetric, AnalyticsCardData, ReferralLink, Currency } from "@/lib/types";
import type { ComposerEvent } from "./composer/events";
import { Sparkline } from "./sparkline";

/* ── Cartes attachables ──────────────────────────────────────────────────

   Aperçu dans le composer, et rendu dans la carte de post : les deux
   usages partagent le même composant. C'est la raison de ce fichier
   plutôt qu'un rangement sous `composer/` ou à côté de `post-card`. */

/* ─── Calcul de la card analytics ───────────────────────────────────────
   Génère un dataset déterministe (seedé sur l'id du bien) pour les
   métriques qui n'ont pas de série temporelle dans le mock. Évite tout
   `Math.random()` — sinon mismatch d'hydratation SSR/client. */
export function computeAnalyticsCard(property: Property, metric: AnalyticsMetric): AnalyticsCardData {
  const seed =
    property.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) + property.id.length;
  const seededRand = (i: number) => {
    const v = Math.abs(Math.sin(seed + i * 137)) * 10000;
    return v - Math.floor(v);
  };

  if (metric === "views7d") {
    const spark = Array.from({ length: 7 }, (_, i) => Math.round(80 + seededRand(i) * 240));
    const total = spark.reduce((a, b) => a + b, 0);
    const prevTotal = Math.round(total * (0.65 + seededRand(99) * 0.4));
    const delta = +(((total - prevTotal) / prevTotal) * 100).toFixed(1);
    return {
      propertyId: property.id,
      propertyTitle: property.title,
      metric,
      label: "Vues 7 derniers jours",
      headline: total.toLocaleString("fr-CH"),
      delta,
      sparkData: spark,
    };
  }

  if (metric === "rendementNet") {
    const val = property.analytics?.rendementNet ?? 3.2;
    return {
      propertyId: property.id,
      propertyTitle: property.title,
      metric,
      label: "Rendement net annuel",
      headline: `${val.toFixed(1)}%`,
    };
  }

  // occupation30d
  const base = property.analytics?.tauxOccupation ?? 75;
  const spark = Array.from({ length: 30 }, (_, i) =>
    Math.round(Math.min(100, Math.max(40, base + (seededRand(i) - 0.5) * 22))),
  );
  const first = spark[0] ?? base;
  const last = spark[spark.length - 1] ?? base;
  const delta = +(last - first).toFixed(1);
  return {
    propertyId: property.id,
    propertyTitle: property.title,
    metric,
    label: "Taux d'occupation 30j",
    headline: `${last}%`,
    delta,
    sparkData: spark,
  };
}


// ─── Cartes attachables (preview composer + render dans PostCard) ──────

/* Carte Bien — image + titre + ville + m² + prix (formaté CHF). Clic →
   /explorer/[id]. Utilisable dans le composer (avec X de retrait) et
   dans le post publié. */
export function PropertyAttachCard({ property, onRemove }: { property: Property; onRemove?: () => void }) {
  const { formatPrice } = useApp();
  const transactionSuffix =
    property.transactionType === "location-ct"
      ? "/nuit"
      : property.transactionType === "location-lt"
        ? "/mois"
        : "";
  return (
    <div className="relative rounded-2xl border border-[var(--card-border)] overflow-hidden bg-[var(--card)] group">
      <Link href={`/explorer/${property.id}`} className="flex">
        <img src={property.images[0]} alt="" className="w-28 h-28 object-cover shrink-0" />
        <div className="flex-1 p-3 min-w-0">
          <p className="text-xs text-[var(--primary)] font-medium">Bien immobilier</p>
          <p className="text-sm font-semibold text-[var(--foreground)] mt-0.5 line-clamp-2">
            {property.title}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1 inline-flex items-center gap-1">
            <MapPin size={11} /> {property.location.city}
            {property.area ? ` · ${property.area} m²` : ""}
          </p>
          <p className="text-sm font-bold text-[var(--primary)] mt-1.5">
            {formatPrice(property.price, property.currency)}
            {transactionSuffix && (
              <span className="text-xs text-[var(--text-muted)] font-normal">{transactionSuffix}</span>
            )}
          </p>
        </div>
      </Link>
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label="Retirer le bien attaché"
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export interface FormationLike {
  id: string;
  title: string;
  instructor: string;
  price: number;
  students: number;
  thumbnail: string;
}

export function FormationAttachCard({ formation, onRemove }: { formation: FormationLike; onRemove?: () => void }) {
  const { formatPrice } = useApp();
  return (
    <div className="relative rounded-2xl border border-[var(--card-border)] overflow-hidden bg-[var(--card)]">
      <Link href={`/formations/${formation.id}`} className="flex">
        <img src={formation.thumbnail} alt="" className="w-28 h-28 object-cover shrink-0" />
        <div className="flex-1 p-3 min-w-0">
          <p className="text-xs text-orange-400 font-medium inline-flex items-center gap-1">
            <GraduationCap size={11} /> Formation
          </p>
          <p className="text-sm font-semibold text-[var(--foreground)] mt-0.5 line-clamp-2">
            {formation.title}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Par {formation.instructor} · {formatCount(formation.students)} élèves
          </p>
          <p className="text-sm font-bold text-[var(--primary)] mt-1.5">{formatPrice(formation.price)}</p>
        </div>
      </Link>
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label="Retirer la formation attachée"
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export function EventAttachCard({ event, onRemove }: { event: ComposerEvent; onRemove?: () => void }) {
  const { formatPrice } = useApp();
  return (
    <div className="relative rounded-2xl border border-[var(--card-border)] overflow-hidden bg-[var(--card)]">
      <Link href={`/evenements/${event.id}`} className="flex">
        <img src={event.thumbnail} alt="" className="w-28 h-28 object-cover shrink-0" />
        <div className="flex-1 p-3 min-w-0">
          <p className="text-xs text-purple-400 font-medium inline-flex items-center gap-1">
            <Calendar size={11} /> {event.eventType}
          </p>
          <p className="text-sm font-semibold text-[var(--foreground)] mt-0.5 line-clamp-2">
            {event.titre}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {formatDate(event.date)} · {event.lieu}
          </p>
          <p className="text-sm font-bold text-[var(--primary)] mt-1.5">
            {event.prix && event.prix > 0 ? formatPrice(event.prix) : "Gratuit"}
            {typeof event.spotsRemaining === "number" && (
              <span className="text-xs text-[var(--text-muted)] font-normal">
                {" "}· {event.spotsRemaining} places restantes
              </span>
            )}
          </p>
        </div>
      </Link>
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label="Retirer l'événement attaché"
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export function AnalyticsAttachCard({ data, onRemove }: { data: AnalyticsCardData; onRemove?: () => void }) {
  const positive = (data.delta ?? 0) >= 0;
  return (
    <div className="relative rounded-2xl border border-[var(--card-border)] overflow-hidden bg-[var(--card)]">
      <Link href={`/explorer/${data.propertyId}`} className="block p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-emerald-400 font-medium inline-flex items-center gap-1">
              <BarChart3 size={11} /> Analyse de bien
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1 truncate">
              {data.propertyTitle}
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-2">{data.label}</p>
            <div className="flex items-end gap-2 mt-1">
              <p className="text-3xl font-bold text-[var(--foreground)] tabular-nums leading-none">
                {data.headline}
              </p>
              {typeof data.delta === "number" && (
                <span
                  className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                    positive ? "text-emerald-400" : "text-red-400"
                  } pb-0.5`}
                >
                  {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {positive ? "+" : ""}
                  {data.delta}%
                </span>
              )}
            </div>
          </div>
          {data.sparkData && data.sparkData.length > 1 && (
            <div className="shrink-0">
              <Sparkline
                data={data.sparkData}
                color={positive ? "#10b981" : "#ef4444"}
                width={104}
                height={48}
              />
            </div>
          )}
        </div>
        <p className="text-[11px] text-[var(--text-muted)] mt-3 inline-flex items-center gap-1">
          Voir le bien <ArrowRight size={11} />
        </p>
      </Link>
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label="Retirer l'analyse attachée"
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

/* Interrupteur « Affiliation » affiché sous un objet vendable dans le
   composer. Activé → un lien de tracking apporteur sera généré à la
   publication (buildObjectAffiliate) et l'auteur touchera la commission
   affichée si quelqu'un achète via sa recommandation. */
export function AffiliateToggle({
  on,
  onToggle,
  link,
}: {
  on: boolean;
  onToggle: () => void;
  link: ReferralLink | null;
}) {
  const { formatPrice } = useApp();
  const t = link?.target;
  const earn =
    t?.price != null
      ? estimateEarning(t.kind, t.price, {
          transactionType: t.transactionType,
          currency: t.currency as Currency | undefined,
        })
      : null;
  const earnLabel = earn && earn.max > 0 ? formatPrice(earn.max, earn.currency) : null;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      className={`mt-1.5 w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-colors ${
        on
          ? "border-[var(--primary)]/40 bg-[var(--primary)]/10"
          : "border-[var(--card-border)] hover:bg-[var(--hover-bg)]"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
          on ? "bg-[var(--primary)]/20 text-[var(--primary)]" : "bg-[var(--hover-bg)] text-[var(--text-muted)]"
        }`}
      >
        <Link2 size={15} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[var(--foreground)]">Lien d&apos;affiliation</p>
        <p className="text-xs text-[var(--text-muted)] truncate">
          {!on
            ? "Gagnez une commission si on achète via votre reco"
            : earnLabel
              ? <>Gagnez jusqu&apos;à <span className="font-semibold text-[var(--primary)]">{earnLabel}</span> de commission</>
              : `Commission ${link?.commission ?? ""}`}
        </p>
      </div>
      {/* Switch visuel */}
      <span
        aria-hidden
        className={`relative w-9 h-5 rounded-full shrink-0 transition-colors ${
          on ? "bg-[var(--primary)]" : "bg-[var(--card-border)]"
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
            on ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}

/* Badge d'affiliation d'un post publié : bandeau compact sous l'objet
   vendable recommandé. Clic → URL de tracking apporteur (nouvel onglet),
   même logique que les liens de la page /apporteurs. */
export function AffiliatePostBadge({ link }: { link: ReferralLink }) {
  const { formatPrice } = useApp();
  // Commission potentielle concrète pour ce lien (façon Whop) : « Gagnez
  // jusqu'à X CHF » calculée depuis la cible (prix + type de transaction).
  // Repli sur le % si le prix n'est pas connu (anciens liens génériques).
  const t = link.target;
  const earn =
    t?.price != null
      ? estimateEarning(t.kind, t.price, {
          transactionType: t.transactionType,
          currency: t.currency as Currency | undefined,
        })
      : null;
  const hasAmount = !!earn && earn.max > 0;

  const cls =
    "group/aff relative flex items-center gap-3 px-3 py-2.5 rounded-xl overflow-hidden " +
    "bg-gradient-to-r from-[var(--primary)]/[0.12] via-[var(--primary)]/[0.05] to-transparent " +
    "border border-[var(--primary)]/25 hover:border-[var(--primary)]/45 transition-colors";

  const inner = (
    <>
      {/* Reflet qui balaie au survol (effet « offre »). */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-full w-1/2 skew-x-12 bg-white/10 transition-[left] duration-700 ease-out group-hover/aff:left-[140%]"
      />
      {/* Icône pleine */}
      <span className="shrink-0 w-9 h-9 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center">
        <Coins size={17} />
      </span>
      {/* Accroche */}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Recommandez &amp; gagnez
        </p>
        {hasAmount ? (
          <p className="text-[15px] leading-tight text-[var(--foreground)] truncate">
            Jusqu&apos;à{" "}
            <span className="font-extrabold text-[var(--primary)]">{formatPrice(earn.max, earn.currency)}</span>
            <span className="text-[var(--text-muted)]"> de commission</span>
          </p>
        ) : (
          <p className="text-[15px] leading-tight text-[var(--foreground)] truncate">
            Commission <span className="font-bold text-[var(--primary)]">{link.commission}</span>
          </p>
        )}
      </div>
      {/* Flèche */}
      <span className="shrink-0 w-7 h-7 rounded-full bg-[var(--primary)]/12 text-[var(--primary)] flex items-center justify-center transition-colors group-hover/aff:bg-[var(--primary)] group-hover/aff:text-[var(--primary-foreground)]">
        <ArrowRight size={14} />
      </span>
    </>
  );
  // Lien interne réel (redirige vers l'annonce + trace le clic) si dispo,
  // sinon repli sur la chaîne partageable externe (anciens liens).
  return link.redirect ? (
    <Link href={link.redirect} className={cls}>
      {inner}
    </Link>
  ) : (
    <a href={`https://${link.url}`} target="_blank" rel="noopener noreferrer nofollow" className={cls}>
      {inner}
    </a>
  );
}

