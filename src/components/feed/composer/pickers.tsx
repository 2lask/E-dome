"use client";
import React, { useState, useMemo } from "react";
import { MapPin, Search, BarChart3, ArrowRight } from "lucide-react";
import { useApp } from "@/lib/context";
import { formatDate } from "@/lib/utils";
import { formations as ALL_FORMATIONS } from "@/lib/mock-data";
import type { Property, AnalyticsMetric } from "@/lib/types";
import type { FormationLike } from "../attach-cards";
import type { ComposerEvent } from "./events";


/* ─── Listes du picker d'attachement ──────────────────────────────────── */

export function PropertyPickerList({
  properties,
  onSelect,
  ctaLabel = "Attacher",
}: {
  properties: Property[];
  onSelect: (p: Property) => void;
  ctaLabel?: string;
}) {
  const { formatPrice } = useApp();
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return properties;
    return properties.filter(
      (p) =>
        p.title.toLowerCase().includes(needle) ||
        p.location.city.toLowerCase().includes(needle),
    );
  }, [properties, q]);

  return (
    <>
      <div className="relative mb-2">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
        />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un bien…"
          className="w-full pl-9 pr-3 h-10 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)]/40"
        />
      </div>
      {filtered.length === 0 ? (
        <p className="text-center text-sm text-[var(--text-muted)] py-8">Aucun bien.</p>
      ) : (
        filtered.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--hover-bg)] text-left transition-colors"
          >
            <img src={p.images[0]} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--foreground)] truncate">{p.title}</p>
              <p className="text-xs text-[var(--text-muted)] inline-flex items-center gap-1">
                <MapPin size={11} /> {p.location.city} · {formatPrice(p.price, p.currency)}
              </p>
            </div>
            <span className="text-xs font-medium text-[var(--primary)] shrink-0">{ctaLabel}</span>
          </button>
        ))
      )}
    </>
  );
}

export function FormationPickerList({ onSelect }: { onSelect: (f: FormationLike) => void }) {
  const { formatPrice } = useApp();
  const [q, setQ] = useState("");
  const formations = useMemo<FormationLike[]>(
    () =>
      ALL_FORMATIONS.map((f) => ({
        id: f.id,
        title: f.title,
        instructor: `${f.instructor.firstName} ${f.instructor.lastName}`,
        price: f.price,
        students: f.studentCount ?? 0,
        thumbnail: f.thumbnail,
      })),
    [],
  );
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return formations;
    return formations.filter(
      (f) =>
        f.title.toLowerCase().includes(needle) ||
        f.instructor.toLowerCase().includes(needle),
    );
  }, [formations, q]);

  return (
    <>
      <div className="relative mb-2">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
        />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher une formation…"
          className="w-full pl-9 pr-3 h-10 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)]/40"
        />
      </div>
      {filtered.length === 0 ? (
        <p className="text-center text-sm text-[var(--text-muted)] py-8">Aucune formation.</p>
      ) : (
        filtered.map((f) => (
          <button
            key={f.id}
            onClick={() => onSelect(f)}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--hover-bg)] text-left transition-colors"
          >
            <img src={f.thumbnail} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--foreground)] truncate">{f.title}</p>
              <p className="text-xs text-[var(--text-muted)] truncate">
                {f.instructor} · {formatPrice(f.price)}
              </p>
            </div>
            <span className="text-xs font-medium text-[var(--primary)] shrink-0">Attacher</span>
          </button>
        ))
      )}
    </>
  );
}

export function EventPickerList({
  events,
  onSelect,
}: {
  events: ComposerEvent[];
  onSelect: (e: ComposerEvent) => void;
}) {
  const { formatPrice } = useApp();
  return (
    <>
      {events.map((e) => (
        <button
          key={e.id}
          onClick={() => onSelect(e)}
          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--hover-bg)] text-left transition-colors"
        >
          <img src={e.thumbnail} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--foreground)] truncate">{e.titre}</p>
            <p className="text-xs text-[var(--text-muted)] truncate">
              {formatDate(e.date)} · {e.lieu} ·{" "}
              {e.prix && e.prix > 0 ? formatPrice(e.prix) : "Gratuit"}
            </p>
          </div>
          <span className="text-xs font-medium text-[var(--primary)] shrink-0">Attacher</span>
        </button>
      ))}
    </>
  );
}

export function AnalyticsMetricPicker({
  property,
  onBack,
  onSelect,
}: {
  property: Property;
  onBack: () => void;
  onSelect: (m: AnalyticsMetric) => void;
}) {
  const metrics: { key: AnalyticsMetric; title: string; desc: string }[] = [
    {
      key: "views7d",
      title: "Vues 7 derniers jours",
      desc: "Sparkline + delta vs semaine précédente",
    },
    {
      key: "rendementNet",
      title: "Rendement net annuel",
      desc: `${property.analytics?.rendementNet?.toFixed(1) ?? "—"}% sur ce bien`,
    },
    {
      key: "occupation30d",
      title: "Taux d'occupation 30j",
      desc: "Sparkline + delta sur le mois",
    },
  ];
  return (
    <>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--foreground)] mb-2"
      >
        ← Changer de bien
      </button>
      <div className="flex items-center gap-2 p-2 mb-2 rounded-xl bg-[var(--hover-bg)]">
        <img
          src={property.images[0]}
          alt=""
          className="w-10 h-10 rounded-lg object-cover shrink-0"
        />
        <p className="text-xs font-medium text-[var(--foreground)] truncate">{property.title}</p>
      </div>
      {metrics.map((m) => (
        <button
          key={m.key}
          onClick={() => onSelect(m.key)}
          className="w-full flex items-center gap-3 p-3 rounded-xl border border-[var(--card-border)] hover:border-[var(--primary)]/40 hover:bg-[var(--hover-bg)] text-left transition-colors mb-2"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/15 text-[var(--primary)] flex items-center justify-center shrink-0">
            <BarChart3 size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--foreground)]">{m.title}</p>
            <p className="text-xs text-[var(--text-muted)]">{m.desc}</p>
          </div>
          <ArrowRight size={14} className="text-[var(--text-muted)] shrink-0" />
        </button>
      ))}
    </>
  );
}


