"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  MapPin,
  TrendingUp,
  GraduationCap,
  Calendar,
  BarChart3,
} from "lucide-react";
import { SectionHeading } from "./personas";

type Card =
  | { kind: "video"; src: string; author: Author; caption: string; stats: Stats }
  | { kind: "analytics"; author: Author; caption: string; metric: { label: string; value: string; delta: string }; stats: Stats }
  | { kind: "property"; author: Author; caption: string; property: { img: string; title: string; loc: string; price: string }; stats: Stats }
  | { kind: "formation"; author: Author; caption: string; formation: { img: string; title: string; instructor: string; price: string }; stats: Stats }
  | { kind: "event"; author: Author; caption: string; event: { img: string; title: string; date: string; place: string }; stats: Stats }
  | { kind: "image"; src: string; author: Author; caption: string; stats: Stats };

interface Author { name: string; handle: string; avatar: string; verified?: boolean }
interface Stats { likes: number; comments: number; reposts: number }

const AVATAR_1 = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=96&h=96&fit=crop&auto=format&q=60";
const AVATAR_2 = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&auto=format&q=60";
const AVATAR_3 = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&auto=format&q=60";
const AVATAR_4 = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&auto=format&q=60";

const CARDS: Card[] = [
  {
    kind: "video",
    src: "/videos/feed/clip-03.mp4",
    author: { name: "Léa Bernard", handle: "leabernard", avatar: AVATAR_1, verified: true },
    caption: "Visite de cet appartement neuf à Lausanne — 3.5p, vue lac. Disponible dès septembre.",
    stats: { likes: 1247, comments: 84, reposts: 56 },
  },
  {
    kind: "analytics",
    author: { name: "Marc Dubois", handle: "marc.dubois", avatar: AVATAR_2 },
    caption: "Rendement net de mon portefeuille Vaud sur 12 mois — détails dans les commentaires.",
    metric: { label: "Rendement net portfolio", value: "+6.4%", delta: "+0.8 pts" },
    stats: { likes: 892, comments: 47, reposts: 31 },
  },
  {
    kind: "property",
    author: { name: "Sophie Aubert", handle: "sophie.aubert", avatar: AVATAR_3, verified: true },
    caption: "Off-market exclusif : villa Minergie à Cologny. Prix sur demande, 12 visites prévues cette semaine.",
    property: {
      img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&h=200&fit=crop&auto=format&q=65",
      title: "Villa Minergie · Cologny",
      loc: "Cologny, GE",
      price: "CHF 4.85M",
    },
    stats: { likes: 2105, comments: 198, reposts: 142 },
  },
  {
    kind: "video",
    src: "/videos/feed/clip-07.mp4",
    author: { name: "Antoine Roux", handle: "antoine.roux", avatar: AVATAR_4 },
    caption: "Drone shot du chalet — vue plein Sud sur les Alpes. Saison 2026 ouverte.",
    stats: { likes: 1876, comments: 122, reposts: 87 },
  },
  {
    kind: "formation",
    author: { name: "Léa Bernard", handle: "leabernard", avatar: AVATAR_1, verified: true },
    caption: "Nouveau module : fiscalité de l'investissement immobilier en Suisse romande.",
    formation: {
      img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=200&fit=crop&auto=format&q=65",
      title: "Fiscalité immobilier · Suisse romande",
      instructor: "Léa Bernard",
      price: "CHF 290",
    },
    stats: { likes: 524, comments: 38, reposts: 19 },
  },
  {
    kind: "event",
    author: { name: "Marc Dubois", handle: "marc.dubois", avatar: AVATAR_2 },
    caption: "Salon Investir & Habiter — Genève. 3 jours, 80 exposants, 12 conférences.",
    event: {
      img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&h=200&fit=crop&auto=format&q=65",
      title: "Salon Investir & Habiter",
      date: "14-16 mars 2026",
      place: "Palexpo · Genève",
    },
    stats: { likes: 712, comments: 64, reposts: 41 },
  },
];

export function FeedShowcase() {
  return (
    <section id="demo" className="ld-section" style={{ position: "relative" }}>
      <div className="ld-container">
        <SectionHeading
          eyebrow="Communauté"
          title={
            <>
              Un feed pensé pour{" "}
              <span className="ld-display-italic" style={{ color: "var(--ld-gold-300)" }}>
                l'immobilier.
              </span>
            </>
          }
          description="Vidéos, analyses financières, formations, événements — tout dans un seul flux. Sans bruit, sans agence, sans intermédiaire."
        />

        {/* Stats sous le heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            marginTop: 36,
            paddingTop: 24,
            borderTop: "1px solid var(--ld-border-subtle)",
            maxWidth: 680,
          }}
        >
          {[
            { v: "27", l: "vidéos courtes par jour" },
            { v: "4.8/5", l: "engagement community" },
            { v: "< 2s", l: "first content paint" },
          ].map((s) => (
            <div key={s.l}>
              <div className="ld-mono" style={{ fontSize: 22, fontWeight: 500, color: "var(--ld-fg-0)" }}>
                {s.v}
              </div>
              <div style={{ fontSize: 12, color: "var(--ld-fg-3)" }}>{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Carrousel auto-scroll horizontal */}
      <div
        style={{
          position: "relative",
          marginTop: 64,
          paddingTop: 8,
          paddingBottom: 8,
          maskImage:
            "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)",
        }}
      >
        <div
          className="ld-no-scrollbar"
          style={{
            display: "flex",
            gap: 24,
            paddingLeft: "max(24px, calc((100vw - 1280px) / 2 + 48px))",
            paddingRight: "max(24px, calc((100vw - 1280px) / 2 + 48px))",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
          }}
        >
          {CARDS.map((c, i) => (
            <PostPreview key={i} card={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PostPreview({ card }: { card: Card }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="ld-glass ld-lift"
      style={{
        flexShrink: 0,
        width: 360,
        scrollSnapAlign: "start",
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img
          src={card.author.avatar}
          alt=""
          width={40}
          height={40}
          loading="lazy"
          decoding="async"
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            objectFit: "cover",
            border: "1px solid var(--ld-border-subtle)",
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 14, fontWeight: 600 }}>
            <span style={{ color: "var(--ld-fg-0)" }}>{card.author.name}</span>
            {card.author.verified && (
              <svg width={14} height={14} viewBox="0 0 24 24" fill="var(--ld-gold-400)">
                <path d="M12 0L9.6 3.6L5.4 3.6L4.2 7.8L0 9L1.8 13.2L0 17.4L4.2 18.6L5.4 22.8L9.6 22.8L12 24L14.4 22.8L18.6 22.8L19.8 18.6L24 17.4L22.2 13.2L24 9L19.8 7.8L18.6 3.6L14.4 3.6L12 0Z" />
                <path d="M9 14L15 8L13.5 6.5L9 11L7.5 9.5L6 11L9 14Z" fill="#0a0a0a" />
              </svg>
            )}
          </div>
          <div style={{ fontSize: 12, color: "var(--ld-fg-3)", display: "flex", alignItems: "center", gap: 6 }}>
            @{card.author.handle}
            <span style={{ opacity: 0.5 }}>·</span>
            <MapPin size={10} strokeWidth={1.8} />
            Lausanne
          </div>
        </div>
      </header>

      {/* Caption */}
      <p
        style={{
          fontSize: 13.5,
          lineHeight: 1.5,
          color: "var(--ld-fg-1)",
          margin: 0,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {card.caption}
      </p>

      {/* Body */}
      <PostBody card={card} />

      {/* Actions */}
      <footer
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 6,
          borderTop: "1px solid var(--ld-border-subtle)",
        }}
      >
        <ActionStat icon={MessageCircle} count={card.stats.comments} color="var(--ld-blue)" />
        <ActionStat icon={Repeat2} count={card.stats.reposts} color="var(--ld-success)" />
        <ActionStat icon={Heart} count={card.stats.likes} color="var(--ld-rose)" />
        <ActionStat icon={Bookmark} count={null} color="var(--ld-fg-2)" />
      </footer>
    </motion.article>
  );
}

function PostBody({ card }: { card: Card }) {
  switch (card.kind) {
    case "video":
      return <LazyVideo src={card.src} />;
    case "image":
      return (
        <div
          style={{
            width: "100%",
            aspectRatio: "4 / 3",
            background: `url(${card.src}) center/cover`,
            borderRadius: 14,
            border: "1px solid var(--ld-border-subtle)",
          }}
        />
      );
    case "analytics":
      return (
        <div
          className="ld-glass-soft"
          style={{
            padding: 18,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "rgba(16,185,129,0.18)",
              color: "var(--ld-success)",
            }}
          >
            <BarChart3 size={20} strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: "var(--ld-fg-3)", marginBottom: 4 }}>
              {card.metric.label}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span className="ld-mono" style={{ fontSize: 24, fontWeight: 500, color: "var(--ld-fg-0)" }}>
                {card.metric.value}
              </span>
              <span style={{ fontSize: 12, color: "var(--ld-success)" }}>
                <TrendingUp size={11} strokeWidth={2} style={{ display: "inline", marginRight: 3 }} />
                {card.metric.delta}
              </span>
            </div>
          </div>
        </div>
      );
    case "property":
      return (
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="ld-glass-soft"
          style={{
            padding: 12,
            display: "flex",
            gap: 12,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: 10,
              background: `url(${card.property.img}) center/cover`,
              flexShrink: 0,
            }}
          />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="ld-eyebrow" style={{ marginBottom: 4 }}>Bien · Off-market</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ld-fg-0)", marginBottom: 2 }}>
              {card.property.title}
            </div>
            <div style={{ fontSize: 11, color: "var(--ld-fg-3)" }}>{card.property.loc}</div>
            <div className="ld-mono" style={{ fontSize: 14, fontWeight: 500, color: "var(--ld-gold-300)", marginTop: 6 }}>
              {card.property.price}
            </div>
          </div>
        </a>
      );
    case "formation":
      return (
        <div className="ld-glass-soft" style={{ padding: 12, display: "flex", gap: 12 }}>
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: 10,
              background: `url(${card.formation.img}) center/cover`,
              flexShrink: 0,
            }}
          />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="ld-eyebrow" style={{ color: "var(--ld-blue)", marginBottom: 4 }}>
              <GraduationCap size={10} strokeWidth={2} style={{ display: "inline", marginRight: 4 }} />
              Formation
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ld-fg-0)" }}>
              {card.formation.title}
            </div>
            <div style={{ fontSize: 11, color: "var(--ld-fg-3)" }}>par {card.formation.instructor}</div>
            <div className="ld-mono" style={{ fontSize: 14, fontWeight: 500, color: "var(--ld-fg-0)", marginTop: 6 }}>
              {card.formation.price}
            </div>
          </div>
        </div>
      );
    case "event":
      return (
        <div className="ld-glass-soft" style={{ padding: 12, display: "flex", gap: 12 }}>
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: 10,
              background: `url(${card.event.img}) center/cover`,
              flexShrink: 0,
            }}
          />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="ld-eyebrow" style={{ color: "var(--ld-purple)", marginBottom: 4 }}>
              <Calendar size={10} strokeWidth={2} style={{ display: "inline", marginRight: 4 }} />
              Événement
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ld-fg-0)" }}>
              {card.event.title}
            </div>
            <div style={{ fontSize: 11, color: "var(--ld-fg-3)" }}>{card.event.date}</div>
            <div style={{ fontSize: 11, color: "var(--ld-fg-3)" }}>{card.event.place}</div>
          </div>
        </div>
      );
  }
}

/* LazyVideo : monte la balise <video> uniquement quand 60 % visible,
   met en pause hors viewport. Respect prefers-reduced-motion. */
function LazyVideo({ src }: { src: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const node = wrapRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio > 0.5;
        if (visible) setMounted(true);
        setShouldPlay(visible);
      },
      { threshold: [0, 0.5, 0.75] },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (shouldPlay && !reducedMotion) {
      v.play().catch(() => { /* autoplay blocked on certain browsers */ });
    } else {
      v.pause();
    }
  }, [shouldPlay, reducedMotion, mounted]);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "9 / 16",
        maxHeight: 420,
        background:
          "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)",
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid var(--ld-border-subtle)",
      }}
    >
      {mounted ? (
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          aria-label="Aperçu vidéo immobilier en lecture automatique muette"
        />
      ) : (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--ld-fg-3)",
          }}
        >
          <svg width={32} height={32} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
            <path d="M10 8L16 12L10 16V8Z" fill="currentColor" opacity="0.7" />
          </svg>
        </div>
      )}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "4px 10px",
          fontSize: 10,
          fontFamily: "var(--ld-font-mono)",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "#fff",
          background: "rgba(0,0,0,0.6)",
          borderRadius: 999,
          backdropFilter: "blur(8px)",
        }}
      >
        <span className="ld-pulse-dot" style={{ width: 5, height: 5, borderRadius: 999, background: "var(--ld-rose)" }} />
        Live · 247
      </div>
    </div>
  );
}

function ActionStat({
  icon: Icon,
  count,
  color,
}: {
  icon: React.ComponentType<{ size: number; strokeWidth: number }>;
  count: number | null;
  color: string;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 12,
        fontFamily: "var(--ld-font-mono)",
        color: "var(--ld-fg-2)",
      }}
    >
      <Icon size={14} strokeWidth={1.8} />
      {count !== null && (
        <span>
          {count > 999 ? `${(count / 1000).toFixed(1)}K` : count}
        </span>
      )}
    </div>
  );
}

export default FeedShowcase;
