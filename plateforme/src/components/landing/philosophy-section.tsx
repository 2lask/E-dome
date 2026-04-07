"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Globe, UserCog, Eye, MessageCircle } from "lucide-react";
import GlowingBorder from "@/components/ui/glowing-border";

const pillars = [
  {
    icon: Globe,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-400/10",
    title: "Un écosystème, pas un outil",
    description:
      "Aujourd'hui, un agent publie ses biens sur un portail, communique via un autre, gère ses réservations ailleurs et suit ses revenus sur un tableur. E-Dome supprime ces frontières : tout est connecté, tout communique, tout se gère depuis un seul tableau de bord.",
  },
  {
    icon: UserCog,
    iconColor: "text-emerald-300",
    iconBg: "bg-emerald-300/10",
    title: "Des profils qui évoluent avec vous",
    description:
      "Vous démarrez comme apporteur d'affaires, puis vous devenez hôte, puis formateur. Sur E-Dome, votre profil s'adapte. Pas besoin de créer un nouveau compte ou de recommencer. Activez un rôle, désactivez-le — votre historique, vos contacts et vos données restent.",
  },
  {
    icon: Eye,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    title: "Commissions transparentes",
    description:
      "Chaque transaction est traçable. L'apporteur sait exactement combien il touche, l'hôte voit ce qui est prélevé, le formateur suit ses ventes en direct. Plus de zones d'ombre, plus de commissions cachées — chaque franc est documenté et vérifiable.",
  },
  {
    icon: MessageCircle,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-400/10",
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
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <p className="text-white/80 text-lg md:text-xl font-light max-w-xl">
              Un seul espace pour chercher, publier, réserver, se former,
              recommander et être rémunéré.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
