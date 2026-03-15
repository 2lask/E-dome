"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { IsometricBuilding } from "@/components/ui/architectural-separators";
import { RevenueDashboardMockup } from "@/components/ui/platform-mockups";
import {
  Users,
  ShoppingBag,
  Handshake,
  Briefcase,
  GraduationCap,
  Store,
  Link2,
  Settings,
  BookOpen,
  Star,
  MapPin,
  type LucideIcon,
} from "lucide-react";

const EASE = [0.165, 0.84, 0.44, 1] as const;

const featurePills: { icon: LucideIcon; label: string }[] = [
  { icon: Users, label: "Réseau social" },
  { icon: ShoppingBag, label: "Marketplace" },
  { icon: Handshake, label: "Apporteurs" },
  { icon: Briefcase, label: "Services" },
  { icon: GraduationCap, label: "Formations" },
];

const pillars: {
  icon: LucideIcon;
  title: string;
  description: string;
  impact: string;
}[] = [
  {
    icon: Users,
    title: "Réseau social immobilier",
    description:
      "Publiez reels et stories pour bâtir votre audience. Attirez des prospects qualifiés sans dépenser un centime en pub.",
    impact: "Visibilité organique, sans budget pub.",
  },
  {
    icon: Store,
    title: "Marketplace transactionnelle",
    description:
      "Location CT, LT et vente réunies. Des commissions nettement inférieures au marché. Une seule interface pour tout gérer.",
    impact: "Un seul outil pour toutes vos transactions.",
  },
  {
    icon: Link2,
    title: "Système d’apporteurs",
    description:
      "Lien unique, tracking transparent, commissions automatiques. Le bouche-à-oreille devient mesurable et rémunéré.",
    impact: "Le bouche-à-oreille devient mesurable et rémunéré.",
  },
  {
    icon: Settings,
    title: "Services additionnels",
    description:
      "Conciergerie, transport, expériences locales : réservez directement depuis chaque bien. Chaque service génère des revenus.",
    impact: "Chaque réservation génère des revenus supplémentaires.",
  },
  {
    icon: BookOpen,
    title: "Formations & communauté",
    description:
      "Formations, lives et webinars par des experts. Rejoignez une communauté de professionnels qui partagent vos ambitions.",
    impact: "La montée en compétence intégrée à la plateforme.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: EASE },
  },
};

function PropertyCardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
      className="mx-auto mt-20 max-w-sm"
    >
      <p className="mb-4 text-center text-sm font-medium uppercase tracking-widest text-white/30">
        Aperçu de la marketplace
      </p>
      <div className="group relative overflow-hidden rounded-2xl border border-[#201e18] bg-[#191919] shadow-2xl shadow-black/40 transition-all duration-500 hover:border-[#ffe0c2]/25 hover:shadow-[0_0_60px_-15px_rgba(255,224,194,0.12)]">
        <div className="relative h-48 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#ffe0c2]/20 via-[#191919] to-[#ffdfb5]/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#191919] via-transparent to-transparent" />
          <div className="absolute left-4 top-4 rounded-full border border-[#ffe0c2]/20 bg-[#111111]/70 px-3 py-1 text-xs font-medium text-[#ffe0c2] backdrop-blur-sm">
            Coup de coeur
          </div>
          <div className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-[#111111]/70 p-2 backdrop-blur-sm">
            <Store className="h-4 w-4 text-white/50" />
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h5 className="text-base font-bold text-white">Villa Méditerranée</h5>
              <div className="mt-1 flex items-center gap-1.5 text-white/40">
                <MapPin className="h-3.5 w-3.5" />
                <span className="text-xs">Marrakech, Maroc</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] bg-clip-text text-transparent">245 CHF</p>
              <p className="text-[10px] text-white/30 font-medium">/ nuit</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={cn("h-3.5 w-3.5", s <= 4 ? "fill-[#ffe0c2] text-[#ffe0c2]" : "fill-none text-white/20")} />
            ))}
            <span className="ml-1.5 text-xs text-white/40">4.0 (128)</span>
          </div>
          <div className="my-4 h-px bg-gradient-to-r from-transparent via-[#201e18] to-transparent" />
          <button className="w-full rounded-xl bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] px-4 py-2.5 text-sm font-semibold text-[#111111] transition-all duration-300 hover:opacity-90 hover:shadow-[0_0_24px_-6px_rgba(255,224,194,0.35)]">
            Réserver
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function SolutionSection() {
  return (
    <section id="solution" className="relative bg-[#111111]/85 py-32 px-6 md:px-12 arch-bg-grid arch-bg-radial">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 h-[500px] w-[500px] rounded-full bg-[#ffe0c2]/5 blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-[#ffdfb5]/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <span className="inline-flex items-center rounded-full border border-[#ffe0c2]/20 bg-[#ffe0c2]/5 px-4 py-1.5 text-sm font-medium text-[#ffe0c2]">
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#ffe0c2] animate-pulse" />
              La Solution
            </span>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white md:text-5xl">
              Tout r&eacute;uni.{" "}
              <span className="bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] bg-clip-text text-transparent">
                Pour la premi&egrave;re fois.
              </span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
              Un seul compte pour tout g&eacute;rer : transactions, visibilit&eacute;,
              commissions, formations et services. Accessible &agrave; tous les
              acteurs du secteur, partout dans le monde.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
              className="mt-10 flex flex-wrap items-start gap-3"
            >
              {featurePills.map((pill) => {
                const Icon = pill.icon;
                return (
                  <span key={pill.label} className="inline-flex items-center gap-2 rounded-full border border-[#201e18] bg-[#191919]/50 px-4 py-2 text-sm text-white/70 transition-colors hover:border-[#ffe0c2]/30">
                    <Icon className="h-4 w-4 text-[#ffe0c2]" />
                    {pill.label}
                  </span>
                );
              })}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="flex flex-col items-center justify-center gap-10"
          >
            <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
              <RevenueDashboardMockup />
            </div>
            <div className="w-full max-w-xs flex items-center justify-center opacity-60">
              <IsometricBuilding />
            </div>
          </motion.div>
        </div>

        <div className="mt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-14 text-center"
          >
            <span className="inline-flex items-center rounded-full border border-[#ffe0c2]/20 bg-[#ffe0c2]/5 px-4 py-1.5 text-sm font-medium text-[#ffe0c2]">
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#ffdfb5] animate-pulse" />
              Les 5 Piliers
            </span>
            <h3 className="mt-6 text-3xl font-bold tracking-tight text-white md:text-5xl">
              Cinq piliers.{" "}
              <span className="bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] bg-clip-text text-transparent">
                Un seul écosystème.
              </span>
            </h3>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  variants={cardVariants}
                  whileHover={{ scale: 1.03, transition: { duration: 0.3, ease: EASE } }}
                  className={cn(
                    "group relative flex min-h-[310px] flex-col rounded-2xl border border-[#201e18] bg-[#191919] p-6 md:p-8",
                    "transition-all duration-500",
                    "hover:border-[#ffe0c2]/30 hover:shadow-[0_0_50px_-10px_rgba(255,224,194,0.13)]",
                    idx === 4 && "sm:col-span-2 lg:col-span-1"
                  )}
                >
                  {/* Card number */}
                  <span className="absolute top-4 right-5 text-5xl font-bold text-white/[0.03] select-none">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ffe0c2]/15 to-transparent rounded-t-2xl" />
                  <div className="relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#ffe0c2]/15 to-[#ffdfb5]/10 ring-1 ring-[#ffe0c2]/15 transition-all group-hover:ring-[#ffe0c2]/30 group-hover:shadow-[0_0_20px_-4px_rgba(255,224,194,0.25)]">
                    <Icon className="h-6 w-6 text-[#ffe0c2] transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <h4 className="mb-3 text-lg font-bold text-white">{pillar.title}</h4>
                  <p className="mb-auto text-sm leading-relaxed text-white/50">{pillar.description}</p>
                  <div className="mt-5 inline-flex items-center gap-2 self-start rounded-full border border-[#ffe0c2]/10 bg-[#ffe0c2]/[0.06] px-3.5 py-1.5 transition-colors duration-300 group-hover:border-[#ffe0c2]/20 group-hover:bg-[#ffe0c2]/[0.1]">
                    <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#ffe0c2]" />
                    <p className="text-xs font-medium text-[#ffe0c2]/80">{pillar.impact}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 rounded-b-2xl bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] transition-all duration-700 group-hover:w-full" />
                </motion.div>
              );
            })}
          </motion.div>

          {/* PropertyCardMockup removed — CRM dashboard section shows the product */}
        </div>
      </div>
    </section>
  );
}
