"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Home,
  ClipboardList,
  Camera,
  Video,
  Handshake,
  Landmark,
  GraduationCap,
  Key,
  type LucideIcon,
} from "lucide-react";
import { SocialFeedMockup } from "@/components/ui/platform-mockups";

const profiles: { icon: LucideIcon; role: string; benefit: string }[] = [
  { icon: Building2, role: "Agence", benefit: "Leads organiques, zéro dépendance pub" },
  { icon: Home, role: "Hôte", benefit: "Davantage de revenus par réservation" },
  { icon: ClipboardList, role: "Gestionnaire", benefit: "Tous vos biens, un seul tableau de bord" },
  { icon: Camera, role: "Photographe", benefit: "Portfolio visible, réservations directes" },
  { icon: Video, role: "Vidéaste", benefit: "Monétisez vos reels immobiliers" },
  { icon: Handshake, role: "Apporteur", benefit: "Commission automatique, suivi en temps réel" },
  { icon: Landmark, role: "Promoteur", benefit: "Audience qualifiée pour vos projets" },
  { icon: GraduationCap, role: "Formateur", benefit: "Diffusez et monétisez vos formations" },
  { icon: Key, role: "Propriétaire", benefit: "Pilotez vos biens avec des données claires" },
];

const EASE = [0.165, 0.84, 0.44, 1] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.07, duration: 0.5, ease: EASE },
  }),
};

/* ── Lightweight phone wrapper for the social feed preview ── */
function PhoneMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      {/* Outer glow */}
      <div className="absolute -inset-4 rounded-[44px] bg-[#8B6F47]/5 blur-2xl" />
      <div className="relative">{children}</div>
    </div>
  );
}

export default function ProfilesSection() {
  return (
    <section
      id="profiles"
      className="relative bg-[#FAF8F5]/90 py-32 px-6 md:px-12 arch-bg-grid arch-bg-perspective"
    >
      {/* Background accent */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#C4956A]/5 blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Split layout: mobile = text+cards first, phone below */}
        <div className="flex flex-col-reverse lg:flex-row lg:items-start gap-12 lg:gap-16">
          {/* ── Left column (45%) ── sticky on desktop ── */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mt-12 lg:mt-0 lg:w-[45%] flex flex-col items-center lg:items-start lg:sticky lg:top-32 lg:self-start"
          >
            {/* Social feed phone mockup — shows what the platform looks like */}
            <PhoneMockup>
              <SocialFeedMockup />
            </PhoneMockup>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.4, duration: 0.6, ease: EASE }}
              className="mt-10 rounded-xl border border-[#8B6F47]/12 bg-white p-5 max-w-md transition-colors duration-300 hover:border-[#8B6F47]/20"
            >
              <p className="text-sm font-semibold text-[#1A1A1A] mb-1">30+ professionnels d&eacute;j&agrave; engag&eacute;s</p>
              <p className="text-xs text-[#888888]">Agences, h&ocirc;tes et promoteurs ont manifest&eacute; leur int&eacute;r&ecirc;t pour le programme fondateur.</p>
            </motion.div>
          </motion.div>

          {/* ── Right column (55%) ── */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="lg:w-[55%]"
          >
            {/* Badge */}
            <span className="mb-4 inline-flex items-center rounded-full border border-[#8B6F47]/20 bg-[#8B6F47]/5 px-4 py-1.5 text-sm font-medium text-[#8B6F47] backdrop-blur-sm">
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#8B6F47] animate-pulse" />
              Multi-Rôles
            </span>

            {/* Heading */}
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-[#1A1A1A] md:text-5xl">
              Vous &ecirc;tes plusieurs.{" "}
              <span className="bg-gradient-to-r from-[#8B6F47] to-[#C4956A] bg-clip-text text-transparent">
                E-Dome aussi.
              </span>
            </h2>

            {/* Description */}
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#555555] md:text-lg">
              Un seul compte, plusieurs casquettes. Activez les r&ocirc;les
              qui correspondent &agrave; votre activit&eacute;.
            </p>

            {/* 3x3 Role cards grid */}
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {profiles.map((profile, idx) => {
                const Icon = profile.icon;
                return (
                  <motion.div
                    key={profile.role}
                    custom={idx}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    className="group flex"
                  >
                    <div className="flex-1 flex items-start gap-3 rounded-xl border border-[#8B6F47]/12 bg-white p-4 transition-all duration-300 hover:border-[#8B6F47]/20 hover:bg-[#F3EDE7]">
                      <div className="shrink-0 rounded-lg bg-[#8B6F47]/10 p-2.5">
                        <Icon className="h-5 w-5 text-[#8B6F47]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-[#1A1A1A]">
                          {profile.role}
                        </h3>
                        <p className="mt-0.5 text-xs leading-relaxed text-[#888888]">
                          {profile.benefit}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
