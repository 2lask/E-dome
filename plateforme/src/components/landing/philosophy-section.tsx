"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Network, UserCog, Eye, MessageCircle } from "lucide-react";
import { ArchBackground } from "@/components/landing/arch-background";
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
      "Chaque transaction est traçable. L'apporteur sait exactement combien il touche, l'hôte voit ce qui est prélevé, le formateur suit ses ventes en direct. Plus de zones d'ombre, plus de commissions cachées — chaque franc est documenté et vérifiable.",
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
    <section ref={ref} className="bg-black py-28 md:py-40 px-6 overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=40')", backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
      <ArchBackground variant="mixed" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24"
        >
          <p className="text-[#C4956A]/50 text-sm tracking-widest uppercase mb-4">Notre approche</p>
          <h2 className="text-5xl md:text-7xl lg:text-8xl text-white tracking-tight mb-6">
            Pourquoi{" "}
            <em className="not-italic text-[#C4956A]/40" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}>
              ça change tout
            </em>
          </h2>
          <p className="text-white/45 text-base md:text-lg max-w-3xl leading-relaxed">
            E-Dome ne se contente pas de regrouper des outils. La plateforme
            repense la façon dont les acteurs de l&apos;immobilier travaillent,
            collaborent et se rémunèrent — en plaçant la connexion humaine
            et la transparence au centre de chaque interaction.
          </p>
        </motion.div>

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
          className="rounded-3xl overflow-hidden aspect-video relative"
        >
          <video
            className="w-full h-full object-cover"
            muted autoPlay loop playsInline preload="auto"
            src="/videos/philosophy-bg.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />

          {/* Top right - title + tags */}
          <div className="absolute top-0 right-0 p-6 md:p-10 text-right">
            <p className="text-white text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight mb-5"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}>
              Un seul espace pour<br />tout l&apos;immobilier.
            </p>
            <div className="flex flex-wrap justify-end gap-2">
              <span className="text-xs px-3 py-1.5 rounded-full text-white/90 font-medium" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>Recherche</span>
              <span className="text-xs px-3 py-1.5 rounded-full text-white/90 font-medium" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>Publication</span>
              <span className="text-xs px-3 py-1.5 rounded-full text-white/90 font-medium" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>Réservation</span>
              <span className="text-xs px-3 py-1.5 rounded-full text-[#C4956A] font-medium" style={{ background: "rgba(196,149,106,0.15)", backdropFilter: "blur(8px)" }}>Formation</span>
              <span className="text-xs px-3 py-1.5 rounded-full text-[#C4956A] font-medium" style={{ background: "rgba(196,149,106,0.15)", backdropFilter: "blur(8px)" }}>Recommandation</span>
              <span className="text-xs px-3 py-1.5 rounded-full text-[#C4956A] font-semibold" style={{ background: "rgba(196,149,106,0.2)", backdropFilter: "blur(8px)" }}>Rémunération</span>
            </div>
          </div>

          {/* Bottom left - description */}
          <div className="absolute bottom-0 left-0 p-6 md:p-10 max-w-xl">
            <p className="text-white/90 text-sm md:text-base leading-relaxed font-light"
              style={{ textShadow: "0 1px 12px rgba(0,0,0,0.9)" }}>
              Chercher un bien, publier une annonce, réserver une visite,
              suivre une formation, recommander un contact et toucher sa
              commission — sans jamais quitter la plateforme.
            </p>
            <p className="text-white/60 text-xs md:text-sm mt-3 leading-relaxed"
              style={{ textShadow: "0 1px 12px rgba(0,0,0,0.9)" }}>
              E-Dome centralise chaque étape du parcours immobilier pour
              que chaque acteur gagne en temps, en visibilité et en revenus.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
