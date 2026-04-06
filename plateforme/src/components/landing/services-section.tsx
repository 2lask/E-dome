"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Home, Users, GraduationCap, Handshake, Radio, Briefcase } from "lucide-react";

const features = [
  {
    tag: "Réseau social immobilier",
    title: "Feed, Stories & Reels",
    description:
      "Un fil d'actualité conçu pour l'immobilier : partagez vos biens, vos visites, vos analyses de marché. Stories éphémères, reels de propriétés, mentions, hashtags — toute l'interaction d'Instagram, orientée vers le professionnel de l'immobilier.",
    icon: Users,
    video: "/videos/reel-1.mp4",
  },
  {
    tag: "Marketplace & Réservations",
    title: "Explorer, comparer, réserver",
    description:
      "Carte interactive MapLibre, filtres avancés par type, pays, budget. Chaque bien affiche son rendement brut et net, son prix au m², sa note énergétique et sa projection ROI à 5 et 10 ans. Réservation intégrée avec gestion des calendriers et paiements sécurisés.",
    icon: Home,
    video: "/videos/reel-2.mp4",
  },
  {
    tag: "Formation & Certification",
    title: "Se former avec les meilleurs",
    description:
      "Catalogue de formations vidéo par des experts du secteur : investissement locatif, gestion Airbnb, analyse financière, fiscalité internationale. De 199 à 497 CHF par formation, avec modules structurés et certifications à la clé.",
    icon: GraduationCap,
    video: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4",
  },
  {
    tag: "Système de commissions",
    title: "L'apporteur d'affaires intégré",
    description:
      "Le cœur économique d'E-Dome : chaque utilisateur peut devenir apporteur d'affaires. 8% sur les locations courte durée, 3.5% sur les ventes, 20% sur les formations, 50% du premier mois en location longue durée. Liens traçables, dashboard de suivi, paiements automatiques.",
    icon: Handshake,
    video: "/videos/reel-4.mp4",
  },
  {
    tag: "Live & Événements",
    title: "Webinaires et conférences en direct",
    description:
      "Programmez des lives de visites de biens, des webinaires d'analyse de marché, des Q&A avec des experts. Système de replays, inscription avec notifications, et intégration avec le calendrier d'événements physiques et virtuels.",
    icon: Radio,
    video: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4",
  },
  {
    tag: "Services professionnels",
    title: "Marketplace de services",
    description:
      "Photographes immobiliers, home stagers, gestionnaires de clés, rénovateurs, notaires, courtiers en financement — trouvez et réservez des prestataires qualifiés directement depuis la plateforme. Demandes de devis intégrées.",
    icon: Briefcase,
    video: "/videos/reel-3.mp4",
  },
];

export function ServicesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-black py-28 md:py-40 px-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)]" />
      {/* Villa background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=30')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex items-start md:items-center justify-between mb-12 md:mb-16 flex-col md:flex-row gap-4"
        >
          <div>
            <p className="text-white/40 text-sm tracking-widest uppercase mb-3">Fonctionnalités</p>
            <h2 className="text-3xl md:text-5xl text-white tracking-tight">
              Tout-en-un,{" "}
              <em className="not-italic text-white/40" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}>
                sans compromis
              </em>
            </h2>
          </div>
          <p className="text-white/40 text-sm max-w-sm leading-relaxed">
            13 profils métiers interchangeables — Hôte, Agent, Promoteur, Investisseur,
            Formateur, Apporteur, Photographe, Courtier, Notaire, Architecte, Agence,
            Client et Admin.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.tag}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="liquid-glass rounded-3xl overflow-hidden group"
              >
                <div className="aspect-video overflow-hidden relative">
                  <video
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    muted
                    autoPlay
                    loop
                    playsInline
                    preload="auto"
                    src={feature.video}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="liquid-glass rounded-full p-2">
                        <Icon size={14} className="text-white/70" />
                      </div>
                      <p className="uppercase tracking-widest text-white/40 text-[10px]">{feature.tag}</p>
                    </div>
                    <div className="liquid-glass rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight size={14} className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-white text-lg mb-2 tracking-tight">{feature.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
