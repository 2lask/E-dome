"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Search,
  LayoutDashboard,
  GraduationCap,
  Calendar,
  MessageCircle,
  Briefcase,
  Heart,
  ShieldCheck,
  Radio,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "./personas";

interface Tile {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  span?: "wide" | "tall" | "default";
  accent?: string;
  feature?: boolean;
}

const TILES: Tile[] = [
  {
    title: "Explorer & boutique",
    description: "14+ types de biens. Filtres avancés, carte interactive, off-market apporteurs.",
    icon: Search,
    href: "/explorer",
    span: "wide",
    accent: "var(--ld-gold-400)",
    feature: true,
  },
  {
    title: "Tableau de bord propriétaire",
    description: "Revenus 12 mois, occupation du portefeuille, vue détaillée par bien.",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Formations & webinaires",
    description: "Place de marché. Les experts gagnent jusqu'à 40 % par inscription.",
    icon: GraduationCap,
    href: "/formations",
    accent: "var(--ld-blue)",
  },
  {
    title: "Événements & live",
    description: "Salons, ateliers, networking. Rediffusions accessibles à tout moment.",
    icon: Calendar,
    href: "/evenements",
    accent: "var(--ld-purple)",
  },
  {
    title: "Messages & réunions",
    description: "Chat direct, groupes, visioconférences intégrées à la plateforme.",
    icon: MessageCircle,
    href: "/messages",
    span: "tall",
  },
  {
    title: "Place de marché services",
    description: "Photographes drone, architectes Minergie, notaires, courtiers.",
    icon: Briefcase,
    href: "/services",
  },
  {
    title: "Favoris & alertes",
    description: "Sauvegardes personnelles, historique, alertes prix et nouvelles annonces.",
    icon: Heart,
    href: "/favoris",
  },
  {
    title: "Profils certifiés",
    description: "USPI, Brevet Fédéral, CFA. Statistiques publiques, note 4.7/5 en moyenne.",
    icon: ShieldCheck,
    href: "/profil",
  },
  {
    title: "Live & diffusion",
    description: "Visites en direct, conférences, chat communautaire en temps réel.",
    icon: Radio,
    href: "/live",
    accent: "var(--ld-rose)",
  },
];

export function BentoGrid() {
  return (
    <section className="ld-section" style={{ position: "relative" }}>
      <div className="ld-container">
        <SectionHeading
          eyebrow="Écosystème"
          title={
            <>
              10 modules,{" "}
              <span className="ld-display-italic ld-grad-aurora-text">une plateforme.</span>
            </>
          }
          description="Listing, financier, communauté, formation, services. Tout est connecté — sans intégration tierce."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 16,
            marginTop: 56,
          }}
        >
          <style>{`
            @media (min-width: 640px) {
              .ld-bento {
                grid-template-columns: repeat(2, 1fr) !important;
              }
            }
            @media (min-width: 1024px) {
              .ld-bento {
                grid-template-columns: repeat(4, 1fr) !important;
                grid-auto-rows: 200px !important;
              }
              .ld-bento [data-span="wide"] {
                grid-column: span 2;
                grid-row: span 2;
              }
              .ld-bento [data-span="tall"] {
                grid-row: span 2;
              }
            }
          `}</style>
          <div className="ld-bento" style={{ display: "contents" }}>
            <div
              className="ld-bento"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 16,
                gridColumn: "1 / -1",
              }}
            >
              {TILES.map((tile, i) => (
                <BentoTile key={tile.title} tile={tile} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BentoTile({ tile, index }: { tile: Tile; index: number }) {
  const Icon = tile.icon;
  const accent = tile.accent || "var(--ld-gold-400)";

  return (
    <motion.div
      data-span={tile.span || "default"}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: Math.min(0.4, index * 0.06),
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        minHeight: tile.span === "wide" ? 280 : 200,
      }}
    >
      <Link
        href={tile.href}
        className="ld-glass ld-lift"
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: tile.feature ? 32 : 24,
          height: "100%",
          textDecoration: "none",
          color: "inherit",
          overflow: "hidden",
        }}
      >
        {/* Glow accent corner */}
        {tile.feature && (
          <div
            style={{
              position: "absolute",
              top: -100,
              right: -100,
              width: 280,
              height: 280,
              background: `radial-gradient(circle, ${accent}25 0%, transparent 65%)`,
              filter: "blur(20px)",
              pointerEvents: "none",
            }}
          />
        )}

        <header style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: tile.feature ? 52 : 42,
              height: tile.feature ? 52 : 42,
              borderRadius: 12,
              background: `${accent}18`,
              color: accent,
              marginBottom: 16,
            }}
          >
            <Icon size={tile.feature ? 24 : 20} strokeWidth={1.7} />
          </div>
          <h3
            style={{
              fontSize: tile.feature ? 22 : 17,
              fontWeight: 600,
              color: "var(--ld-fg-0)",
              margin: 0,
              marginBottom: 8,
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            {tile.title}
          </h3>
          <p
            style={{
              fontSize: tile.feature ? 14.5 : 13,
              lineHeight: 1.5,
              color: "var(--ld-fg-2)",
              margin: 0,
            }}
          >
            {tile.description}
          </p>
        </header>

        <footer
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 24,
            fontSize: 12,
            color: "var(--ld-fg-2)",
            fontFamily: "var(--ld-font-mono)",
            letterSpacing: "0.04em",
            position: "relative",
            zIndex: 1,
          }}
        >
          Explorer
          <ArrowUpRight size={13} strokeWidth={2} />
        </footer>
      </Link>
    </motion.div>
  );
}

export default BentoGrid;
