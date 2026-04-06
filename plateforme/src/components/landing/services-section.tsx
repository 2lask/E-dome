"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Home, Users, GraduationCap, Handshake, Radio, Briefcase } from "lucide-react";

const features = [
  {
    tag: "Réseau social immobilier",
    title: "Feed, Stories & Reels",
    description:
      "Un fil d'actualité pensé pour l'immobilier : partagez vos biens, vos visites, vos analyses de marché. Stories éphémères, reels de propriétés, mentions, hashtags — l'interaction sociale orientée vers le professionnel.",
    icon: Users,
    media: { type: "video" as const, src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4" },
  },
  {
    tag: "Marketplace & Réservations",
    title: "Explorer, comparer, réserver",
    description:
      "Carte interactive, filtres avancés par type, pays et budget. Rendement brut et net, prix au m², note énergétique, projection ROI à 5 et 10 ans. Réservation intégrée avec calendrier et paiements sécurisés.",
    icon: Home,
    media: { type: "video" as const, src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4" },
  },
  {
    tag: "Formation & Certification",
    title: "Se former avec les meilleurs",
    description:
      "Catalogue de formations vidéo par des experts du terrain : investissement locatif, gestion de biens, analyse financière, fiscalité internationale. Modules structurés et certifications.",
    icon: GraduationCap,
    media: { type: "video" as const, src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4" },
  },
  {
    tag: "Système de commissions",
    title: "Apporter, recommander, gagner",
    description:
      "Le cœur économique d'E-Dome : chaque utilisateur peut devenir apporteur d'affaires. Commissions sur les locations, les ventes, les formations — liens traçables, dashboard de suivi, paiements automatiques.",
    icon: Handshake,
    media: { type: "image" as const, src: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&q=80" },
  },
  {
    tag: "Live & Événements",
    title: "Webinaires et conférences",
    description:
      "Programmez des lives de visites virtuelles, des webinaires d'analyse de marché, des sessions Q&A. Replays disponibles, inscriptions avec notifications, événements physiques et virtuels.",
    icon: Radio,
    media: { type: "image" as const, src: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80" },
  },
  {
    tag: "Services professionnels",
    title: "Marketplace de prestataires",
    description:
      "Photographes, home stagers, gestionnaires de clés, rénovateurs, notaires, courtiers — trouvez et sollicitez des prestataires qualifiés depuis la plateforme. Demandes de devis intégrées.",
    icon: Briefcase,
    media: { type: "image" as const, src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80" },
  },
];

export function ServicesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-black py-28 md:py-40 px-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(196,149,106,0.02)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=40')", backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}
          className="flex items-start md:items-center justify-between mb-12 md:mb-16 flex-col md:flex-row gap-4">
          <div>
            <p className="text-[#C4956A]/50 text-sm tracking-widest uppercase mb-3">Fonctionnalités</p>
            <h2 className="text-3xl md:text-5xl text-white tracking-tight">
              Tout-en-un,{" "}
              <em className="not-italic text-[#C4956A]/40" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}>sans compromis</em>
            </h2>
          </div>
          <p className="text-white/35 text-sm max-w-sm leading-relaxed">
            Des profils interchangeables qui s&apos;adaptent à chaque métier
            de l&apos;immobilier — un seul compte pour toutes vos activités.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.tag}
                initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="liquid-glass rounded-3xl overflow-hidden group border border-[#C4956A]/5 hover:border-[#C4956A]/15 transition-colors">
                <div className="aspect-video overflow-hidden relative">
                  {feature.media.type === "video" ? (
                    <video
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      muted autoPlay loop playsInline preload="auto"
                      src={feature.media.src}
                    />
                  ) : (
                    <img
                      src={feature.media.src}
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="rounded-full p-2 bg-[#C4956A]/10">
                        <Icon size={14} className="text-[#C4956A]/70" />
                      </div>
                      <p className="uppercase tracking-widest text-[#C4956A]/40 text-[10px]">{feature.tag}</p>
                    </div>
                    <div className="rounded-full p-1.5 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight size={14} className="text-[#C4956A]" />
                    </div>
                  </div>
                  <h3 className="text-white text-lg mb-2 tracking-tight">{feature.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
