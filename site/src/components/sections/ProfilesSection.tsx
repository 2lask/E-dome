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
      <div className="absolute -inset-4 rounded-[44px] bg-[#ffe0c2]/5 blur-2xl" />
      <div className="relative">{children}</div>
    </div>
  );
}

export default function ProfilesSection() {
  return (
    <section
      id="profiles"
      className="relative bg-[#111111] py-32 px-6 md:px-12"
    >
      {/* Background accent */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#ffdfb5]/5 blur-[160px]" />
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

            {/* Closing quote */}
            <motion.blockquote
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.4, duration: 0.6, ease: EASE }}
              className="mt-10 max-w-md border-l-2 border-[#ffe0c2]/30 pl-5"
            >
              <p className="text-base italic leading-relaxed text-white/50 md:text-lg text-center lg:text-left">
                <span className="text-[#ffe0c2]/60">&ldquo;</span>
                Peu importe où vous vous situez dans l&apos;immobilier,
                E-Dome a été conçu pour vous.
                <span className="text-[#ffe0c2]/60">&rdquo;</span>
              </p>
            </motion.blockquote>
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
            <span className="mb-4 inline-flex items-center rounded-full border border-[#ffe0c2]/20 bg-[#ffe0c2]/5 px-4 py-1.5 text-sm font-medium text-[#ffe0c2] backdrop-blur-sm">
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#ffe0c2] animate-pulse" />
              Multi-Rôles
            </span>

            {/* Heading */}
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white md:text-5xl">
              Un compte.{" "}
              <span className="bg-gradient-to-r from-[#ffe0c2] to-[#ffdfb5] bg-clip-text text-transparent">
                Tous les rôles.
              </span>
            </h2>

            {/* Description */}
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
              E-Dome s&apos;adapte à chaque acteur de l&apos;immobilier. Un
              seul profil peut activer plusieurs rôles selon son activité.
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
                    <div className="flex-1 flex items-start gap-3 rounded-xl border border-[#201e18] bg-[#191919] p-4 transition-all duration-300 hover:border-[#ffe0c2]/20 hover:bg-[#1f1d17]">
                      <div className="shrink-0 rounded-lg bg-[#ffe0c2]/10 p-2.5">
                        <Icon className="h-5 w-5 text-[#ffe0c2]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-white">
                          {profile.role}
                        </h3>
                        <p className="mt-0.5 text-xs leading-relaxed text-white/40">
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
