"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2, ShoppingBag, GraduationCap, Video, Briefcase, Star, Newspaper,
} from "lucide-react";
import { useApp } from "@/lib/context";

/* Vitrine commerciale du profil : onglets Publications / Biens / Produits /
   Formations / Lives / Services / Avis. Extrait de l'ancien ProfileVitrine
   pour être composé sous les sections « LinkedIn » du profil. */

// ─── Types (données de vitrine) ───────────────────────────────────────────

export interface ProfilePublication { id: string; src: string; caption: string }
export interface ProfileBien { id: string; title: string; cover: string; price: number; currency: string; unit: string; location: string }
export interface ProfileProduit { id: string; title: string; cover: string; price: number; currency: string; stock: number }
export interface ProfileFormation { id: string; title: string; cover: string; price: number; currency: string; students: number; rating: number }
export interface ProfileLive { id: string; title: string; cover: string; status: "scheduled" | "replay"; scheduledAt?: string; expectedViewers?: number; replayViews?: number }
export interface ProfileService { id: string; title: string; cover: string; price: number; currency: string; unit: string }
export interface ProfileAvis { id: string; author: string; rating: number; text: string; date: string }

export interface ProfileData {
  publications: ProfilePublication[];
  biens: ProfileBien[];
  produits: ProfileProduit[];
  formations: ProfileFormation[];
  lives: ProfileLive[];
  services: ProfileService[];
  avis: ProfileAvis[];
  ratingBreakdown: { stars: number; count: number }[];
}

type TabKey = "publications" | "biens" | "produits" | "formations" | "lives" | "services" | "avis";

const TABS: { key: TabKey; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { key: "publications", label: "Publications", icon: Newspaper },
  { key: "biens", label: "Biens", icon: Building2 },
  { key: "produits", label: "Produits", icon: ShoppingBag },
  { key: "formations", label: "Formations", icon: GraduationCap },
  { key: "lives", label: "Lives", icon: Video },
  { key: "services", label: "Services", icon: Briefcase },
  { key: "avis", label: "Avis", icon: Star },
];

function CardImage({ src, alt = "", aspect = "4/3" }: { src: string; alt?: string; aspect?: string }) {
  return (
    <div className="overflow-hidden bg-[var(--hover-bg)]" style={{ aspectRatio: aspect }}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}

function Card({ children, href }: { children: React.ReactNode; href?: string }) {
  const cls = "rounded-2xl overflow-hidden border border-[var(--card-border)] bg-[var(--card)] transition-colors hover:border-[var(--text-muted)]/30 block";
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <div className={cls}>{children}</div>;
}

function EmptyState({ label }: { label: string }) {
  return <div className="py-16 text-center text-sm text-[var(--text-muted)]">{label}</div>;
}

export function ProfileShowcase({ data, rating }: { data: ProfileData; rating: number }) {
  const { formatPrice } = useApp();
  const [tab, setTab] = useState<TabKey>("publications");
  const totalAvis = data.ratingBreakdown.reduce((s, r) => s + r.count, 0);

  return (
    <div>
      {/* Onglets */}
      <nav
        className="sticky top-16 z-20 mb-5 rounded-2xl border border-[var(--card-border)] bg-[var(--card)]"
        aria-label="Onglets profil"
      >
        <div className="overflow-x-auto no-scrollbar">
          <ul className="flex items-center gap-1 px-2 min-w-max">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.key;
              return (
                <li key={t.key}>
                  <button
                    onClick={() => setTab(t.key)}
                    className="relative inline-flex items-center gap-2 px-3 py-3 text-sm transition-colors whitespace-nowrap"
                    style={{ color: active ? "var(--foreground)" : "var(--text-secondary)", fontWeight: active ? 600 : 500 }}
                  >
                    <Icon size={16} />
                    <span>{t.label}</span>
                    {active && <span aria-hidden className="absolute left-3 right-3 -bottom-px h-[2px] rounded-full bg-[var(--primary)]" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div key={tab} className="animate-fade-in">
        {tab === "publications" && (
          data.publications.length === 0 ? <EmptyState label="Aucune publication" /> : (
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {data.publications.map((p) => (
                <li key={p.id} className="group">
                  <Card>
                    <CardImage src={p.src} aspect="1/1" />
                    <div className="p-3">
                      <p className="text-xs line-clamp-2 text-[var(--text-secondary)]">{p.caption}</p>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )
        )}

        {tab === "biens" && (
          data.biens.length === 0 ? <EmptyState label="Aucun bien publié" /> : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.biens.map((b) => (
                <li key={b.id}>
                  <Card href={`/explorer/${b.id}`}>
                    <CardImage src={b.cover} aspect="4/3" />
                    <div className="p-4">
                      <h3 className="text-sm font-semibold leading-tight line-clamp-1 text-[var(--foreground)]">{b.title}</h3>
                      <p className="text-xs mt-1 text-[var(--text-muted)]">{b.location}</p>
                      <p className="text-sm font-semibold mt-2 tabular-nums text-[var(--primary)]">
                        {formatPrice(b.price, b.currency as "CHF")}{b.unit}
                      </p>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )
        )}

        {tab === "produits" && (
          data.produits.length === 0 ? <EmptyState label="Aucun produit en vente" /> : (
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.produits.map((p) => (
                <li key={p.id}>
                  <Card href={`/boutique/${p.id}`}>
                    <CardImage src={p.cover} aspect="1/1" />
                    <div className="p-3">
                      <h3 className="text-sm font-medium leading-tight line-clamp-2 text-[var(--foreground)]">{p.title}</h3>
                      <div className="flex items-baseline justify-between mt-2">
                        <p className="text-sm font-semibold tabular-nums text-[var(--foreground)]">{formatPrice(p.price, p.currency as "CHF")}</p>
                        <p className="text-[11px] text-[var(--text-muted)]">Stock {p.stock}</p>
                      </div>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )
        )}

        {tab === "formations" && (
          data.formations.length === 0 ? <EmptyState label="Aucune formation" /> : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.formations.map((f) => (
                <li key={f.id}>
                  <Card href={`/formations/${f.id}`}>
                    <CardImage src={f.cover} aspect="16/9" />
                    <div className="p-4">
                      <h3 className="text-sm font-semibold leading-tight text-[var(--foreground)]">{f.title}</h3>
                      <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-muted)]">
                        <span className="tabular-nums">{f.students} étudiants</span>
                        <span className="inline-flex items-center gap-1">
                          <Star size={11} style={{ color: "var(--rating)", fill: "var(--rating)" }} />
                          <span className="tabular-nums">{f.rating}</span>
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-semibold tabular-nums text-[var(--primary)]">{formatPrice(f.price, f.currency as "CHF")}</p>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )
        )}

        {tab === "lives" && (
          data.lives.length === 0 ? <EmptyState label="Aucun live programmé" /> : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.lives.map((l) => (
                <li key={l.id}>
                  <Card href="/live">
                    <div className="relative">
                      <CardImage src={l.cover} aspect="16/9" />
                      <span
                        className="absolute top-2 left-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold text-white"
                        style={{ background: l.status === "scheduled" ? "var(--primary)" : "rgba(15,15,15,0.85)" }}
                      >
                        <Video size={11} />
                        {l.status === "scheduled" ? "Programmé" : "Replay"}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold leading-tight text-[var(--foreground)]">{l.title}</h3>
                      <p className="text-xs mt-2 text-[var(--text-muted)]">
                        {l.status === "scheduled" ? `Le ${l.scheduledAt} · ${l.expectedViewers} viewers attendus` : `${l.replayViews} vues en replay`}
                      </p>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )
        )}

        {tab === "services" && (
          data.services.length === 0 ? <EmptyState label="Aucun service" /> : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.services.map((s) => (
                <li key={s.id}>
                  <Card href="/services">
                    <CardImage src={s.cover} aspect="16/9" />
                    <div className="p-4">
                      <h3 className="text-sm font-semibold leading-tight text-[var(--foreground)]">{s.title}</h3>
                      <p className="text-sm font-semibold mt-2 tabular-nums text-[var(--primary)]">{formatPrice(s.price, s.currency as "CHF")}{s.unit}</p>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )
        )}

        {tab === "avis" && (
          data.avis.length === 0 ? <EmptyState label="Aucun avis" /> : (
            <div className="space-y-4">
              <div className="rounded-2xl p-5 bg-[var(--card)] border border-[var(--card-border)]">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-semibold tabular-nums text-[var(--foreground)]">{rating}</div>
                    <div className="text-xs text-[var(--text-muted)]">{totalAvis} avis</div>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {data.ratingBreakdown.map((r) => (
                      <div key={r.stars} className="flex items-center gap-2">
                        <span className="text-xs tabular-nums w-3 text-[var(--text-muted)]">{r.stars}</span>
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-[var(--hover-bg)]">
                          <div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${totalAvis > 0 ? (r.count / totalAvis) * 100 : 0}%` }} />
                        </div>
                        <span className="text-xs tabular-nums w-6 text-right text-[var(--text-muted)]">{r.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <ul className="space-y-3">
                {data.avis.map((r) => (
                  <li key={r.id} className="rounded-2xl p-5 bg-[var(--card)] border border-[var(--card-border)]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-[var(--foreground)]">{r.author}</span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} style={{ color: i < r.rating ? "var(--rating)" : "var(--card-border)", fill: i < r.rating ? "var(--rating)" : "transparent" }} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{r.text}</p>
                    <div className="text-[11px] mt-2 text-[var(--text-muted)]">{r.date}</div>
                  </li>
                ))}
              </ul>
            </div>
          )
        )}
      </div>
    </div>
  );
}
