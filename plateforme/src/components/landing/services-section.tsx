"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Home, Users, GraduationCap, Handshake } from "lucide-react";

const features = [
  {
    tag: "Réseau social",
    title: "Feed, Stories & Reels",
    description:
      "Partagez vos biens, vos réussites et vos conseils avec une communauté d'investisseurs et de professionnels. Stories éphémères, reels immobiliers, posts avec mentions et hashtags — un Instagram conçu pour l'immobilier.",
    icon: Users,
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4",
  },
  {
    tag: "Marketplace",
    title: "Explorer & Réserver",
    description:
      "Achat, location courte durée, location longue durée — parcourez les annonces avec carte interactive, filtres avancés, calcul de rendement et réservation intégrée. De la Suisse à Dubai en passant par Marrakech.",
    icon: Home,
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4",
  },
  {
    tag: "Formation",
    title: "Apprendre & Certifier",
    description:
      "Des formations vidéo par des experts : investissement locatif, analyse financière, fiscalité internationale, gestion Airbnb. Progressez du niveau débutant à expert avec des certifications reconnues.",
    icon: GraduationCap,
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4",
  },
  {
    tag: "Apporteurs d'affaires",
    title: "Parrainer & Gagner",
    description:
      "Générez des revenus passifs en recommandant E-Dome. 8% sur les locations courte durée, 3.5% sur les ventes, 20% sur les formations. Suivez vos commissions en temps réel depuis votre dashboard personnalisé.",
    icon: Handshake,
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4",
  },
];

export function ServicesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-black py-28 md:py-40 px-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)]" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex items-start md:items-center justify-between mb-12 md:mb-16 flex-col md:flex-row gap-4"
        >
          <div>
            <p className="text-white/40 text-sm tracking-widest uppercase mb-3">
              Fonctionnalités
            </p>
            <h2 className="text-3xl md:text-5xl text-white tracking-tight">
              Tout-en-un,{" "}
              <em
                className="not-italic text-white/40"
                style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}
              >
                vraiment
              </em>
            </h2>
          </div>
          <p className="text-white/40 text-sm max-w-sm leading-relaxed">
            5 rôles — Hôte, Formateur, Apporteur, Investisseur, Agence — chacun
            avec son dashboard et ses outils dédiés.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.tag}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.12 }}
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

                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="liquid-glass rounded-full p-2.5">
                        <Icon size={16} className="text-white/70" />
                      </div>
                      <p className="uppercase tracking-widest text-white/40 text-xs">
                        {feature.tag}
                      </p>
                    </div>
                    <div className="liquid-glass rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight size={16} className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-white text-xl md:text-2xl mb-3 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
