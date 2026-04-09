"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Network, UserCog, Eye, MessageCircle } from "lucide-react";
import { ArchBackground } from "@/components/landing/arch-background";
import { StaggerText } from "@/components/ui/stagger-text";
import { BlurFade } from "@/components/ui/blur-fade";
import GlowingBorder from "@/components/ui/glowing-border";

const pillars = [
  {
    icon: Network,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-400/10",
    title: "Un écosystème, pas un outil",
    description:
      "Aujourd'hui, un agent publie ses biens sur un portail, communique via un autre, gère ses réservations ailleurs et suit ses revenus sur un tableur. E-Dome supprime ces frontières : tout est connecté, tout communique, tout se gère depuis un seul tableau de bord.",
  },
  {
    icon: UserCog,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-400/10",
    title: "Des profils qui évoluent avec vous",
    description:
      "Vous démarrez comme apporteur d'affaires, puis vous devenez hôte, puis formateur. Sur E-Dome, votre profil s'adapte. Pas besoin de créer un nouveau compte ou de recommencer. Activez un rôle, désactivez-le — votre historique, vos contacts et vos données restent.",
  },
  {
    icon: Eye,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-400/10",
    title: "Commissions transparentes",
    description:
      "Chaque acteur rémunéré dispose de son propre dashboard revenus. L'apporteur suit ses commissions en temps réel, l'hôte visualise ses réservations et gains, le formateur contrôle ses ventes. Tout est traçable, documenté et transparent — plus de zones d'ombre.",
  },
  {
    icon: MessageCircle,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-400/10",
    title: "Le social au service du business",
    description:
      "L'immobilier est un métier de réseau. Pourtant, aucune plateforme ne propose un vrai espace social dédié au secteur. E-Dome intègre un feed, des stories, des reels et de la messagerie — pensés pour générer des leads, pas juste des likes.",
  },
];

export function PhilosophySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-black py-16 md:py-28 lg:py-40 px-6 overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=40')", backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
      <ArchBackground variant="mixed" />

      <div className="max-w-6xl mx-auto relative">
        <div className="mb-16 md:mb-24">
          <BlurFade delay={0} inView>
            <p className="text-[#C4956A]/50 text-sm tracking-widest uppercase mb-4">Notre approche</p>
          </BlurFade>
          <StaggerText
            text="Pourquoi ça change tout"
            direction="left"
            stagger={0.06}
            className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-white tracking-tight mb-6"
          />
          <BlurFade delay={0.4} inView>
            <p className="text-white/45 text-base md:text-lg max-w-3xl leading-relaxed">
              E-Dome ne se contente pas de regrouper des outils. La plateforme
              repense la façon dont les acteurs de l&apos;immobilier travaillent,
              collaborent et se rémunèrent — en plaçant la connexion humaine
              et la transparence au centre de chaque interaction.
            </p>
          </BlurFade>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.1 }}
              >
                <GlowingBorder>
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`rounded-full p-2.5 ${pillar.iconBg}`}>
                        <Icon size={18} className={pillar.iconColor} />
                      </div>
                      <h3 className="text-white text-lg font-medium tracking-tight">{pillar.title}</h3>
                    </div>
                    <p className="text-white/55 text-sm leading-relaxed">{pillar.description}</p>
                  </div>
                </GlowingBorder>
              </motion.div>
            );
          })}
        </div>

        {/* Video showcase */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="rounded-3xl overflow-hidden aspect-[4/5] md:aspect-video relative"
        >
          <video
            className="w-full h-full object-cover hidden md:block"
            muted autoPlay loop playsInline preload="auto"
            src="/videos/philosophy-bg.mp4"
          />
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=70"
            alt="E-Dome vision" className="w-full h-full object-cover md:hidden"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/30 to-black/80" />

          {/* Top left - title block */}
          <div className="absolute top-0 left-0 p-5 md:p-8 lg:p-10">
            <div className="rounded-2xl px-5 py-4 md:px-7 md:py-5" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(16px)" }}>
              <p className="text-[#C4956A]/60 text-[10px] md:text-xs tracking-[0.2em] uppercase mb-2">E-Dome</p>
              <h3 className="text-white text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight leading-tight mb-4">
                Un seul espace<br />
                <span className="text-[#C4956A]">pour tout l&apos;immobilier.</span>
              </h3>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {[
                  { label: "Recherche", gold: false },
                  { label: "Publication", gold: false },
                  { label: "Réservation", gold: false },
                  { label: "Formation", gold: true },
                  { label: "Recommandation", gold: true },
                  { label: "Rémunération", gold: true },
                ].map((tag) => (
                  <span key={tag.label} className={`text-xs md:text-[10px] px-2.5 py-1 md:px-3 md:py-1.5 rounded-full font-medium border ${
                    tag.gold
                      ? "text-[#C4956A] border-[#C4956A]/30 bg-[#C4956A]/10"
                      : "text-white/80 border-white/15 bg-white/5"
                  }`}>
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom right - description block */}
          <div className="absolute bottom-0 right-0 p-5 md:p-8 lg:p-10">
            <div className="rounded-2xl px-5 py-4 md:px-7 md:py-5 max-w-[280px] md:max-w-md text-right" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(16px)" }}>
              <div className="w-8 h-0.5 bg-[#C4956A]/50 mb-4 ml-auto" />
              <p className="text-white text-sm md:text-base leading-relaxed mb-3">
                Chercher un bien, publier une annonce, réserver une visite,
                suivre une formation, recommander un contact et toucher sa
                commission.
              </p>
              <p className="text-white/50 text-xs md:text-sm leading-relaxed mb-4">
                Sans jamais quitter la plateforme — E-Dome centralise chaque
                étape du parcours pour que chaque acteur gagne en temps,
                en visibilité et en revenus.
              </p>
              <a href="/acces" className="inline-flex items-center gap-2 bg-[#C4956A] text-black text-sm font-semibold px-5 py-3 rounded-lg hover:bg-[#d4a57a] transition-colors ml-auto">
                Voir la maquette
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
