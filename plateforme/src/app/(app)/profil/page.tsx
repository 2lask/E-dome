"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { useApp } from "@/lib/context";
import { formatCount } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────
   Page profil — vitrine unifiée (esprit Whop / Instagram).
   Une seule structure réutilisée quel que soit le rôle du compte :
   en arrivant, des onglets montrent tout ce que le compte propose
   (Publications, Biens, Produits, Formations, Lives, Services, Avis).
   Style épuré : cover discret, header compact, onglets soulignés,
   grilles média en avant. Données fictives uniquement.
   ───────────────────────────────────────────────────────────── */

// ─── Mock utilisateur ─────────────────────────────────────────────

const currentUser = {
  id: "me",
  firstName: "Léo",
  lastName: "Martin",
  email: "leo@e-dome.ch",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240",
  city: "Lausanne",
  country: "Suisse",
  roles: ["Hôte", "Formateur", "Apporteur", "Investisseur"],
  bio: "Passionné d'immobilier depuis 15 ans. Hôte actif en Suisse romande, formateur certifié USPI et apporteur d'affaires.",
  stats: {
    followers: 2340,
    following: 812,
    rating: 4.8,
    reviewsCount: 56,
  },
};

// ─── Mock data des onglets ─────────────────────────────────────────

const PUBLICATIONS = [
  { id: "pub1", src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600", caption: "Visite du jour : villa contemporaine à Genolier." },
  { id: "pub2", src: "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?w=600", caption: "Chalet Verbier sous la première neige." },
  { id: "pub3", src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600", caption: "Aménagement intérieur signé Studio Verbier." },
  { id: "pub4", src: "https://images.unsplash.com/photo-1590073242678-70ee818e55fb?w=600", caption: "Riad Marrakech — patio rénové." },
  { id: "pub5", src: "https://images.unsplash.com/photo-1600047509807-ba7fdd402464?w=600", caption: "Penthouse Montreux, vue lac." },
  { id: "pub6", src: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=600", caption: "Évolution du rendement locatif 2026." },
];

const BIENS = [
  { id: "prop1", title: "Chalet Alpin Premium", cover: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600", price: 350, currency: "CHF", unit: "/nuit", location: "Verbier, Suisse" },
  { id: "prop2", title: "Appartement Vue Lac", cover: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600", price: 1_250_000, currency: "CHF", unit: "", location: "Montreux, Suisse" },
  { id: "prop3", title: "Villa Prestige", cover: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600", price: 3_200_000, currency: "CHF", unit: "", location: "Lausanne, Suisse" },
  { id: "prop4", title: "Studio Zurich Centre", cover: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600", price: 180, currency: "CHF", unit: "/nuit", location: "Zurich, Suisse" },
];

const PRODUITS = [
  { id: "prod1", title: "Plaid lin lavé bleu nuit", cover: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600", price: 89, currency: "CHF", stock: 14 },
  { id: "prod2", title: "Lampe céramique nordique", cover: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600", price: 145, currency: "CHF", stock: 6 },
  { id: "prod3", title: "Vase grès noir mat", cover: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600", price: 65, currency: "CHF", stock: 22 },
];

const FORMATIONS = [
  { id: "form-001", title: "Investissement locatif : de zéro à rentier", cover: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600", price: 497, currency: "CHF", students: 342, rating: 4.9 },
  { id: "form-002", title: "Maîtriser la gestion locative CT", cover: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=600", price: 397, currency: "CHF", students: 178, rating: 4.8 },
];

const LIVES = [
  { id: "live1", title: "Décrypter les annonces immobilières", cover: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600", status: "scheduled" as const, scheduledAt: "2026-06-12 19:00", expectedViewers: 320 },
  { id: "live2", title: "Q&R : fiscalité locative en Suisse", cover: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600", status: "replay" as const, replayViews: 1240 },
];

const SERVICES = [
  { id: "s1", title: "Conseil investissement personnalisé", cover: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600", price: 250, currency: "CHF", unit: "/h" },
  { id: "s2", title: "Audit de portefeuille immobilier", cover: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600", price: 1800, currency: "CHF", unit: "" },
];

const AVIS = [
  { id: "r1", author: "Jean-Pierre M.", rating: 5, text: "Hôte exceptionnel, chalet magnifique et communication parfaite.", date: "15 mars 2026" },
  { id: "r2", author: "Marie L.", rating: 5, text: "Formation très claire et actionnable. J'ai investi 3 mois après.", date: "28 fév. 2026" },
  { id: "r3", author: "Thomas K.", rating: 5, text: "Appartement propre, moderne et lumineux. Vue sur le Léman à couper le souffle.", date: "10 jan. 2026" },
  { id: "r4", author: "Amira B.", rating: 5, text: "Formation investissement top niveau. Les modules fiscalité sont très utiles.", date: "5 jan. 2026" },
  { id: "r5", author: "Pierre S.", rating: 4, text: "Apporteur fiable et sérieux. Rémunération versée rapidement.", date: "20 déc. 2025" },
];

const RATING_BREAKDOWN = [
  { stars: 5, count: 4 },
  { stars: 4, count: 1 },
  { stars: 3, count: 0 },
  { stars: 2, count: 0 },
  { stars: 1, count: 0 },
];

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

// ─── Composants utilitaires ───────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────

export default function ProfilPage() {
  const { formatPrice } = useApp();
  const [tab, setTab] = useState<TabKey>("publications");
  const [showEditModal, setShowEditModal] = useState(false);

  const totalAvis = RATING_BREAKDOWN.reduce((s, r) => s + r.count, 0);

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
      {/* Cover discret */}
      <div
        className="relative h-32 md:h-40 rounded-b-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(30,157,241,0.16), rgba(30,157,241,0.04) 60%, var(--background))",
        }}
      />

      {/* Header */}
      <div className="px-4 md:px-6 -mt-14 relative z-10">
        <div className="flex items-end gap-4 flex-wrap">
          <img
            src={currentUser.avatar}
            alt=""
            className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover shrink-0"
            style={{ border: "4px solid var(--background)" }}
          />
          <div className="flex-1 min-w-[200px]">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1 className="text-2xl page-heading text-[var(--foreground)]">
                {currentUser.firstName} {currentUser.lastName}
              </h1>
              <span
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{ background: "rgba(245,158,11,0.10)", color: "#b45309" }}
              >
                <Award size={11} /> Membre Fondateur #1
              </span>
            </div>
            <p
              className="text-sm flex items-center gap-1.5 mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              <MapPin size={14} style={{ color: "var(--text-muted)" }} />
              {currentUser.city}, {currentUser.country}
            </p>
            {/* Rôles */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              {currentUser.roles.map((r, i) => (
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
          <button
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2 text-sm font-medium rounded-xl transition-colors"
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
        </div>

        {/* Bio */}
        <p className="text-sm leading-relaxed mt-4" style={{ color: "var(--text-secondary)" }}>
          {currentUser.bio}
        </p>

        {/* Stats compactes + verified */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4">
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            <span className="font-semibold tabular-nums" style={{ color: "var(--foreground)" }}>
              {formatCount(currentUser.stats.followers)}
            </span>{" "}
            abonnés
          </div>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            <span className="font-semibold tabular-nums" style={{ color: "var(--foreground)" }}>
              {formatCount(currentUser.stats.following)}
            </span>{" "}
            suivis
          </div>
          <div className="text-sm flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
            <Star size={14} style={{ color: "#fbbf24", fill: "#fbbf24" }} />
            <span className="font-semibold tabular-nums" style={{ color: "var(--foreground)" }}>
              {currentUser.stats.rating}
            </span>
            <span>({currentUser.stats.reviewsCount} avis)</span>
          </div>
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full ml-auto"
            style={{ background: "rgba(16,185,129,0.10)", color: "#059669" }}
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

      {/* Contenu par onglet */}
      <div className="px-4 md:px-6">
        {tab === "publications" && (
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PUBLICATIONS.map((p) => (
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
        )}

        {tab === "biens" && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BIENS.map((b) => (
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
        )}

        {tab === "produits" && (
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {PRODUITS.map((p) => (
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
        )}

        {tab === "formations" && (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FORMATIONS.map((f) => (
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
                        <Star size={11} style={{ color: "#fbbf24", fill: "#fbbf24" }} />
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
        )}

        {tab === "lives" && (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LIVES.map((l) => (
              <li key={l.id}>
                <Card href="/live">
                  <div className="relative">
                    <CardImage src={l.cover} aspect="16/9" />
                    <span
                      className="absolute top-2 left-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold"
                      style={{
                        background: l.status === "scheduled" ? "rgba(30,157,241,0.92)" : "rgba(15,15,15,0.85)",
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
        )}

        {tab === "services" && (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SERVICES.map((s) => (
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
        )}

        {tab === "avis" && (
          <div className="space-y-4">
            {/* Rating summary */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
            >
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-semibold tabular-nums" style={{ color: "var(--foreground)" }}>
                    {currentUser.stats.rating}
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {totalAvis} avis
                  </div>
                </div>
                <div className="flex-1 space-y-1.5">
                  {RATING_BREAKDOWN.map((r) => (
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

            {/* Reviews list */}
            <ul className="space-y-3">
              {AVIS.map((r) => (
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
                            color: i < r.rating ? "#fbbf24" : "var(--card-border)",
                            fill: i < r.rating ? "#fbbf24" : "transparent",
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
        )}
      </div>

      {/* Edit modal (simplifié) */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowEditModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl p-6 animate-scale-in"
            style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--foreground)" }}>
              Modifier le profil
            </h3>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              Formulaire d'édition (maquette).
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-2.5 text-sm rounded-xl transition-colors"
                style={{
                  border: "1px solid var(--card-border)",
                  color: "var(--text-secondary)",
                  background: "var(--card)",
                }}
              >
                Annuler
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-2.5 text-sm font-medium rounded-xl transition-colors"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
