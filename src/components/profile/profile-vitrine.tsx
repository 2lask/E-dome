"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Award,
  BadgeCheck,
  MapPin,
  Building2,
  ShoppingBag,
  GraduationCap,
  Video,
  Briefcase,
  Star,
  Newspaper,
  Mail,
  Share2,
  MoreHorizontal,
  Settings,
  HelpCircle,
  LogOut,
  Flag,
  UserMinus,
  Copy as CopyIcon,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { formatCount } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

/* ─────────────────────────────────────────────────────────────
   ProfileVitrine — composant partagé entre /profil (mon profil)
   et /profil/[id] (profil d'autres utilisateurs).

   Style et structure 100 % unifiés : header compact, 7 onglets
   (Publications · Biens · Produits · Formations · Lives · Services
   · Avis), grilles média en avant. Tokens CSS clairs.

   Variations selon `isOwn` :
   - isOwn=true  → bouton "Modifier le profil"
   - isOwn=false → boutons "Suivre/Suivi" + "Message"

   Toutes les data viennent de l'extérieur en props : la page parente
   passe son user et ses mocks (réels ou fictifs).
   ───────────────────────────────────────────────────────────── */

// ─── Types ────────────────────────────────────────────────────────

export interface ProfileUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  city: string;
  country: string;
  roles: string[];
  bio: string;
  isMembreFondateur?: boolean;
  stats: {
    followers: number;
    following: number;
    rating: number;
    reviewsCount: number;
  };
}

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

export interface ProfileVitrineProps {
  user: ProfileUser;
  data: ProfileData;
  isOwn: boolean;
  /** Self only : ouvre la modal d'édition. */
  onEdit?: () => void;
  /** Other only : true si l'utilisateur courant suit déjà ce profil. */
  isFollowing?: boolean;
  /** Other only : toggle follow. */
  onToggleFollow?: () => void;
  /** Other only : ouvre la conversation. */
  onMessage?: () => void;
}

// ─── Onglets ──────────────────────────────────────────────────────

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

// ─── Cartes utilitaires ───────────────────────────────────────────

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

// ─── Composant ────────────────────────────────────────────────────

export function ProfileVitrine({
  user,
  data,
  isOwn,
  onEdit,
  isFollowing = false,
  onToggleFollow,
  onMessage,
}: ProfileVitrineProps) {
  const { formatPrice } = useApp();
  const { addToast } = useToast();
  const [tab, setTab] = useState<TabKey>("publications");
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  /* Ferme le menu 3-points au clic en dehors. */
  useEffect(() => {
    if (!moreOpen) return;
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [moreOpen]);

  const totalAvis = data.ratingBreakdown.reduce((s, r) => s + r.count, 0);

  /* Copie l'URL du profil dans le presse-papier (utilise par "Copier le
     lien" du menu 3-dots). Toast feedback obligatoire — sinon l'utilisateur
     ne sait pas si l'action a marche. */
  const handleCopyLink = React.useCallback(async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      addToast("Lien du profil copié", "success");
    } catch {
      addToast("Impossible de copier le lien", "error");
    }
  }, [addToast]);

  /* Partage profil : tente l'API Web Share native (mobile, OS share sheet),
     sinon fallback copie de l'URL au presse-papier + toast info. */
  const handleShare = React.useCallback(async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const title = `${user.firstName} ${user.lastName} — E-Dome`;
    try {
      if (typeof navigator !== "undefined" && "share" in navigator) {
        await navigator.share({ title, url });
        return;
      }
    } catch {
      // user cancelled — silencieux
    }
    try {
      await navigator.clipboard.writeText(url);
      addToast("Lien du profil copié", "success");
    } catch {
      addToast("Impossible de copier le lien", "error");
    }
  }, [user.firstName, user.lastName, addToast]);

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
      {/* Cover discret */}
      <div
        className="relative h-32 md:h-40 rounded-b-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(245, 113, 50,0.16), rgba(245, 113, 50,0.04) 60%, var(--background))",
        }}
      />

      {/* Header */}
      <div className="px-4 md:px-6 -mt-14 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <img
            src={user.avatar}
            alt=""
            className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover shrink-0"
            style={{ border: "4px solid var(--background)" }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1 className="text-2xl page-heading text-[var(--foreground)]">
                {user.firstName} {user.lastName}
              </h1>
              {user.isMembreFondateur && (
                <span
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{ background: "rgba(245,158,11,0.10)", color: "#b45309" }}
                >
                  <Award size={11} /> Membre Fondateur #1
                </span>
              )}
            </div>
            <p
              className="text-sm flex items-center gap-1.5 mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              <MapPin size={14} style={{ color: "var(--text-muted)" }} />
              {user.city}, {user.country}
            </p>
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              {user.roles.map((r, i) => (
                <span
                  key={r}
                  className="px-2.5 py-0.5 text-[11px] font-medium rounded-full"
                  style={
                    i === 0
                      ? { background: "var(--primary)", color: "var(--primary-foreground)" }
                      : { background: "var(--hover-bg)", color: "var(--text-secondary)" }
                  }
                >
                  {r}
                </span>
              ))}
            </div>
          </div>

          {/* Actions self vs other — pleine largeur sur mobile.
              Le bouton 3-dots (...) en bout de ligne donne acces a
              Parametres / Aide / Quitter (isOwn) ou Signaler / Copier /
              Bloquer (autre user). Fixe le finding nav critique #1 :
              les Parametres etaient planques derriere 3 clics. */}
          <div ref={moreRef} className="flex gap-2 flex-wrap w-full md:w-auto relative">
            {isOwn ? (
              <button
                onClick={onEdit}
                className="flex-1 md:flex-none px-4 py-2 text-sm font-medium rounded-xl transition-colors"
                style={{
                  border: "1px solid var(--card-border)",
                  color: "var(--foreground)",
                  background: "var(--card)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--card)")}
              >
                Modifier le profil
              </button>
            ) : (
              <>
                <button
                  onClick={onToggleFollow}
                  className="flex-1 md:flex-none px-4 py-2 text-sm font-medium rounded-xl transition-colors"
                  style={{
                    background: isFollowing ? "var(--card)" : "var(--foreground)",
                    color: isFollowing ? "var(--foreground)" : "var(--background)",
                    border: isFollowing ? "1px solid var(--card-border)" : "none",
                  }}
                >
                  {isFollowing ? "Suivi" : "Suivre"}
                </button>
                <button
                  onClick={onMessage}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl transition-colors"
                  style={{
                    border: "1px solid var(--card-border)",
                    color: "var(--foreground)",
                    background: "var(--card)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--card)")}
                >
                  <Mail size={15} />
                  Message
                </button>
                <button
                  onClick={handleShare}
                  aria-label="Partager le profil"
                  className="flex items-center justify-center min-w-[44px] min-h-[44px] p-2 text-sm rounded-xl transition-colors"
                  style={{
                    border: "1px solid var(--card-border)",
                    color: "var(--foreground)",
                    background: "var(--card)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--card)")}
                >
                  <Share2 size={15} />
                </button>
              </>
            )}

            {/* 3-dots menu : Settings/Aide/Quitter (isOwn) ou
                Signaler/Bloquer/Copier le lien (autre user). */}
            <button
              onClick={() => setMoreOpen((v) => !v)}
              aria-label="Plus d'options"
              aria-haspopup="menu"
              aria-expanded={moreOpen}
              className="flex items-center justify-center min-w-[44px] min-h-[44px] p-2 text-sm rounded-xl transition-colors"
              style={{
                border: "1px solid var(--card-border)",
                color: "var(--foreground)",
                background: moreOpen ? "var(--hover-bg)" : "var(--card)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
              onMouseLeave={(e) => {
                if (!moreOpen) e.currentTarget.style.background = "var(--card)";
              }}
            >
              <MoreHorizontal size={15} />
            </button>

            {moreOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 w-56 rounded-xl border shadow-lg py-1.5 z-20 animate-fade-in"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--card-border)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                {isOwn ? (
                  <>
                    <Link
                      href="/parametres"
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                      style={{ color: "var(--foreground)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <Settings size={16} style={{ color: "var(--text-muted)" }} />
                      Paramètres
                    </Link>
                    <Link
                      href="/aide"
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                      style={{ color: "var(--foreground)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <HelpCircle size={16} style={{ color: "var(--text-muted)" }} />
                      Aide
                    </Link>
                    <button
                      onClick={() => {
                        handleCopyLink();
                        setMoreOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                      style={{ color: "var(--foreground)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <CopyIcon size={16} style={{ color: "var(--text-muted)" }} />
                      Copier le lien
                    </button>
                    <div className="my-1 h-px" style={{ background: "var(--card-border)" }} />
                    <Link
                      href="/"
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                      style={{ color: "var(--destructive)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "color-mix(in srgb, var(--destructive) 14%, transparent)")
                      }
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <LogOut size={16} />
                      Quitter la maquette
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        handleCopyLink();
                        setMoreOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                      style={{ color: "var(--foreground)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <CopyIcon size={16} style={{ color: "var(--text-muted)" }} />
                      Copier le lien
                    </button>
                    <button
                      onClick={() => {
                        addToast("Signalement envoyé (maquette)", "info");
                        setMoreOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                      style={{ color: "var(--foreground)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <Flag size={16} style={{ color: "var(--text-muted)" }} />
                      Signaler
                    </button>
                    <button
                      onClick={() => {
                        addToast(`${user.firstName} a été bloqué (maquette)`, "info");
                        setMoreOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                      style={{ color: "var(--destructive)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "color-mix(in srgb, var(--destructive) 14%, transparent)")
                      }
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <UserMinus size={16} />
                      Bloquer
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="text-sm leading-relaxed mt-4" style={{ color: "var(--text-secondary)" }}>
          {user.bio}
        </p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4">
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            <span className="font-semibold tabular-nums" style={{ color: "var(--foreground)" }}>
              {formatCount(user.stats.followers)}
            </span>{" "}
            abonnés
          </div>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            <span className="font-semibold tabular-nums" style={{ color: "var(--foreground)" }}>
              {formatCount(user.stats.following)}
            </span>{" "}
            suivis
          </div>
          <div className="text-sm flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
            <Star size={14} style={{ color: "var(--rating)", fill: "var(--rating)" }} />
            <span className="font-semibold tabular-nums" style={{ color: "var(--foreground)" }}>
              {user.stats.rating}
            </span>
            <span>({user.stats.reviewsCount} avis)</span>
          </div>
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full md:ml-auto"
            style={{ background: "color-mix(in srgb, var(--success) 10%, transparent)", color: "var(--success)" }}
          >
            <BadgeCheck size={12} />
            Identité vérifiée
          </span>
        </div>
      </div>

      {/* Onglets */}
      <nav
        className="sticky top-16 z-20 mt-8 -mx-4 md:-mx-6 mb-6"
        style={{ background: "var(--background)", borderBottom: "1px solid var(--card-border)" }}
        aria-label="Onglets profil"
      >
        <div className="overflow-x-auto no-scrollbar">
          <ul className="flex items-center gap-1 px-4 md:px-6 min-w-max">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.key;
              return (
                <li key={t.key}>
                  <button
                    onClick={() => setTab(t.key)}
                    className="relative inline-flex items-center gap-2 px-3 py-3 text-sm transition-colors whitespace-nowrap"
                    style={{
                      color: active ? "var(--foreground)" : "var(--text-secondary)",
                      fontWeight: active ? 600 : 500,
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.color = "var(--foreground)";
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.color = "var(--text-secondary)";
                    }}
                  >
                    <Icon size={16} />
                    <span>{t.label}</span>
                    {active && (
                      <span
                        aria-hidden
                        className="absolute left-3 right-3 -bottom-px h-[2px] rounded-full"
                        style={{ background: "var(--primary)" }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Contenu par onglet — fade-in léger au changement d'onglet via key */}
      <div key={tab} className="px-4 md:px-6 animate-fade-in">
        {tab === "publications" && (
          data.publications.length === 0 ? <EmptyState label="Aucune publication" /> : (
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {data.publications.map((p) => (
                <li key={p.id} className="group">
                  <Card>
                    <CardImage src={p.src} aspect="1/1" />
                    <div className="p-3">
                      <p className="text-xs line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                        {p.caption}
                      </p>
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
                      <h3 className="text-sm font-semibold leading-tight line-clamp-1" style={{ color: "var(--foreground)" }}>
                        {b.title}
                      </h3>
                      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                        {b.location}
                      </p>
                      <p className="text-sm font-semibold mt-2 tabular-nums" style={{ color: "var(--primary)" }}>
                        {formatPrice(b.price, b.currency as "CHF")}
                        {b.unit}
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
                      <h3 className="text-sm font-medium leading-tight line-clamp-2" style={{ color: "var(--foreground)" }}>
                        {p.title}
                      </h3>
                      <div className="flex items-baseline justify-between mt-2">
                        <p className="text-sm font-semibold tabular-nums" style={{ color: "var(--foreground)" }}>
                          {formatPrice(p.price, p.currency as "CHF")}
                        </p>
                        <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                          Stock {p.stock}
                        </p>
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
                      <h3 className="text-sm font-semibold leading-tight" style={{ color: "var(--foreground)" }}>
                        {f.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                        <span className="tabular-nums">{f.students} étudiants</span>
                        <span className="inline-flex items-center gap-1">
                          <Star size={11} style={{ color: "var(--rating)", fill: "var(--rating)" }} />
                          <span className="tabular-nums">{f.rating}</span>
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-semibold tabular-nums" style={{ color: "var(--primary)" }}>
                        {formatPrice(f.price, f.currency as "CHF")}
                      </p>
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
                        className="absolute top-2 left-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold"
                        style={{
                          background: l.status === "scheduled" ? "rgba(245, 113, 50,0.92)" : "rgba(15,15,15,0.85)",
                          color: "#fff",
                        }}
                      >
                        <Video size={11} />
                        {l.status === "scheduled" ? "Programmé" : "Replay"}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold leading-tight" style={{ color: "var(--foreground)" }}>
                        {l.title}
                      </h3>
                      <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                        {l.status === "scheduled"
                          ? `Le ${l.scheduledAt} · ${l.expectedViewers} viewers attendus`
                          : `${l.replayViews} vues en replay`}
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
                  <Card href={`/services`}>
                    <CardImage src={s.cover} aspect="16/9" />
                    <div className="p-4">
                      <h3 className="text-sm font-semibold leading-tight" style={{ color: "var(--foreground)" }}>
                        {s.title}
                      </h3>
                      <p className="text-sm font-semibold mt-2 tabular-nums" style={{ color: "var(--primary)" }}>
                        {formatPrice(s.price, s.currency as "CHF")}
                        {s.unit}
                      </p>
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
              <div
                className="rounded-2xl p-5"
                style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
              >
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-semibold tabular-nums" style={{ color: "var(--foreground)" }}>
                      {user.stats.rating}
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {totalAvis} avis
                    </div>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {data.ratingBreakdown.map((r) => (
                      <div key={r.stars} className="flex items-center gap-2">
                        <span className="text-xs tabular-nums w-3" style={{ color: "var(--text-muted)" }}>
                          {r.stars}
                        </span>
                        <div
                          className="flex-1 h-1.5 rounded-full overflow-hidden"
                          style={{ background: "var(--hover-bg)" }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              background: "var(--primary)",
                              width: `${totalAvis > 0 ? (r.count / totalAvis) * 100 : 0}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs tabular-nums w-6 text-right" style={{ color: "var(--text-muted)" }}>
                          {r.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <ul className="space-y-3">
                {data.avis.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-2xl p-5"
                    style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                        {r.author}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            style={{
                              color: i < r.rating ? "var(--rating)" : "var(--card-border)",
                              fill: i < r.rating ? "var(--rating)" : "transparent",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {r.text}
                    </p>
                    <div className="text-[11px] mt-2" style={{ color: "var(--text-muted)" }}>
                      {r.date}
                    </div>
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

function EmptyState({ label }: { label: string }) {
  return (
    <div className="py-16 text-center text-sm" style={{ color: "var(--text-muted)" }}>
      {label}
    </div>
  );
}
