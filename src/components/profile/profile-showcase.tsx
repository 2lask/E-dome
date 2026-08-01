"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2, ShoppingBag, GraduationCap, Video, Briefcase, Star, Newspaper,
  Plus, ArrowRight, UserRound,
} from "lucide-react";
import { useApp } from "@/lib/context";

/* Vitrine du profil : onglets Publications / Biens / Produits / Formations /
   Lives / Services / Avis. Chaque onglet affiche un compteur, une barre
   d'actions (Voir tout + action owner) et un état vide avec CTA. */

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

// Liens « Voir tout » (page globale) + action de création (owner) par onglet.
const TAB_LINKS: Record<TabKey, { seeAll?: string; add?: { href: string; label: string }; empty: string }> = {
  publications: { seeAll: "/feed", add: { href: "/creer-post", label: "Publier" }, empty: "Aucune publication" },
  biens: { seeAll: "/explorer", add: { href: "/publier", label: "Publier un bien" }, empty: "Aucun bien publié" },
  produits: { seeAll: "/boutique", add: { href: "/boutique", label: "Gérer la boutique" }, empty: "Aucun produit en vente" },
  formations: { seeAll: "/formations", add: { href: "/formations/creer", label: "Créer une formation" }, empty: "Aucune formation" },
  lives: { seeAll: "/live", add: { href: "/live", label: "Programmer un live" }, empty: "Aucun live programmé" },
  services: { seeAll: "/services", add: { href: "/services/proposer", label: "Proposer un service" }, empty: "Aucun service" },
  avis: { empty: "Aucun avis" },
};

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

function EmptyState({ label, isOwn, add }: { label: string; isOwn: boolean; add?: { href: string; label: string } }) {
  return (
    <div className="py-16 text-center">
      <p className="text-sm text-[var(--text-muted)]">{label}</p>
      {isOwn && add && (
        <Link
          href={add.href}
          className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={15} /> {add.label}
        </Link>
      )}
    </div>
  );
}

function Toolbar({ tab, isOwn }: { tab: TabKey; isOwn: boolean }) {
  const meta = TAB_LINKS[tab];
  if (!meta.seeAll && !(isOwn && meta.add)) return null;
  return (
    <div className="flex items-center justify-end gap-2 mb-3">
      {isOwn && meta.add && (
        <Link
          href={meta.add.href}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--card-border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
        >
          <Plus size={15} /> {meta.add.label}
        </Link>
      )}
      {meta.seeAll && (
        <Link
          href={meta.seeAll}
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
        >
          Voir tout <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}

export function ProfileShowcase({
  data,
  rating,
  isOwn,
  parcours,
}: {
  data: ProfileData;
  rating: number;
  isOwn: boolean;
  parcours?: React.ReactNode;
}) {
  const { formatPrice } = useApp();
  const [tab, setTab] = useState<TabKey | "parcours">(parcours ? "parcours" : "publications");
  const totalAvis = data.ratingBreakdown.reduce((s, r) => s + r.count, 0);

  // Onglet « Parcours » (sections CV) en tête, quand fourni.
  const allTabs: { key: TabKey | "parcours"; label: string; icon: React.ComponentType<{ size?: number }> }[] =
    parcours ? [{ key: "parcours", label: "Parcours", icon: UserRound }, ...TABS] : TABS;

  const counts: Record<TabKey, number> = {
    publications: data.publications.length,
    biens: data.biens.length,
    produits: data.produits.length,
    formations: data.formations.length,
    lives: data.lives.length,
    services: data.services.length,
    avis: data.avis.length,
  };

  return (
    <div>
      {/* Onglets + compteurs */}
      <nav className="sticky top-16 z-20 mb-5 rounded-2xl border border-[var(--card-border)] bg-[var(--card)]" aria-label="Onglets profil">
        <div className="overflow-x-auto no-scrollbar">
          <ul className="flex items-center gap-1 px-2 min-w-max">
            {allTabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.key;
              const count = t.key !== "parcours" ? counts[t.key as TabKey] : 0;
              return (
                <li key={t.key}>
                  <button
                    onClick={() => setTab(t.key)}
                    className="relative inline-flex items-center gap-2 px-3 py-3 text-sm transition-colors whitespace-nowrap"
                    style={{ color: active ? "var(--foreground)" : "var(--text-secondary)", fontWeight: active ? 600 : 500 }}
                  >
                    <Icon size={16} />
                    <span>{t.label}</span>
                    {count > 0 && (
                      <span className="text-xs tabular-nums text-[var(--text-muted)]">{count}</span>
                    )}
                    {active && <span aria-hidden className="absolute left-3 right-3 -bottom-px h-[2px] rounded-full bg-[var(--primary)]" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div key={tab} className="animate-fade-in">
        {tab === "parcours" && parcours}

        {tab !== "avis" && tab !== "parcours" && <Toolbar tab={tab} isOwn={isOwn} />}

        {tab === "publications" && (
          data.publications.length === 0 ? <EmptyState label={TAB_LINKS.publications.empty} isOwn={isOwn} add={TAB_LINKS.publications.add} /> : (
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {data.publications.map((p) => (
                <li key={p.id} className="group">
                  <Card>
                    <CardImage src={p.src} aspect="1/1" />
                    <div className="p-3"><p className="text-xs line-clamp-2 text-[var(--text-secondary)]">{p.caption}</p></div>
                  </Card>
                </li>
              ))}
            </ul>
          )
        )}

        {tab === "biens" && (
          data.biens.length === 0 ? <EmptyState label={TAB_LINKS.biens.empty} isOwn={isOwn} add={TAB_LINKS.biens.add} /> : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.biens.map((b) => (
                <li key={b.id}>
                  <Card href={`/explorer/${b.id}`}>
                    <CardImage src={b.cover} aspect="4/3" />
                    <div className="p-4">
                      <h3 className="text-sm font-semibold leading-tight line-clamp-1 text-[var(--foreground)]">{b.title}</h3>
                      <p className="text-xs mt-1 text-[var(--text-muted)]">{b.location}</p>
                      <p className="text-sm font-semibold mt-2 tabular-nums text-[var(--primary)]">{formatPrice(b.price, b.currency as "CHF")}{b.unit}</p>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )
        )}

        {tab === "produits" && (
          data.produits.length === 0 ? <EmptyState label={TAB_LINKS.produits.empty} isOwn={isOwn} add={TAB_LINKS.produits.add} /> : (
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
          data.formations.length === 0 ? <EmptyState label={TAB_LINKS.formations.empty} isOwn={isOwn} add={TAB_LINKS.formations.add} /> : (
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
          data.lives.length === 0 ? <EmptyState label={TAB_LINKS.lives.empty} isOwn={isOwn} add={TAB_LINKS.lives.add} /> : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.lives.map((l) => (
                <li key={l.id}>
                  <Card href="/live">
                    <div className="relative">
                      <CardImage src={l.cover} aspect="16/9" />
                      <span className="absolute top-2 left-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold text-white" style={{ background: l.status === "scheduled" ? "var(--primary)" : "rgba(15,15,15,0.85)" }}>
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
          data.services.length === 0 ? <EmptyState label={TAB_LINKS.services.empty} isOwn={isOwn} add={TAB_LINKS.services.add} /> : (
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
          data.avis.length === 0 ? <EmptyState label={TAB_LINKS.avis.empty} isOwn={isOwn} /> : (
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
