"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArchBackground } from "@/components/landing/arch-background";

export function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-black pt-32 md:pt-44 pb-16 md:pb-24 px-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(196,149,106,0.04)_0%,_transparent_70%)]" />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=40')", backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30" />
      <ArchBackground variant="villa" />

      <div className="max-w-6xl mx-auto relative">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          className="text-[#C4956A] text-sm tracking-widest uppercase mb-8 font-medium">
          Notre vision
        </motion.p>

        <motion.h2 initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight mb-12">
          Pensé pour chaque{" "}
          <em className="not-italic text-[#C4956A]/70" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}>
            acteur de l&apos;immobilier.
          </em>
        </motion.h2>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-16">
          <p className="text-white/75 text-base md:text-lg leading-relaxed">
            E-Dome n&apos;est pas une plateforme de plus. C&apos;est un écosystème
            où chaque professionnel — hôte, agent, promoteur, photographe,
            courtier, notaire, architecte, formateur — dispose d&apos;un espace
            pensé pour son métier. Un compte unique, un profil configurable
            qui s&apos;adapte à votre activité du moment.
          </p>
          <p className="text-white/75 text-base md:text-lg leading-relaxed">
            Au cœur du modèle : un système de commissions transparent qui
            rémunère chaque maillon de la chaîne. L&apos;apporteur d&apos;affaires
            touche sa part, le formateur monétise son expertise, l&apos;hôte
            gère ses réservations, le prestataire propose ses services —
            tout depuis un seul endroit, sans dispersion.
          </p>
        </motion.div>

        {/* Roles - visual strip */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.5 }}>
          <p className="text-white/25 text-xs tracking-widest uppercase mb-6">
            Des profils qui s&apos;adaptent à chaque activité
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Hôte", color: "text-amber-400/80 border-amber-400/20" },
              { label: "Agence", color: "text-blue-400/80 border-blue-400/20" },
              { label: "Agent", color: "text-cyan-400/80 border-cyan-400/20" },
              { label: "Investisseur", color: "text-emerald-400/80 border-emerald-400/20" },
              { label: "Formateur", color: "text-purple-400/80 border-purple-400/20" },
              { label: "Apporteur", color: "text-[#C4956A] border-[#C4956A]/25" },
              { label: "Photographe", color: "text-pink-400/80 border-pink-400/20" },
              { label: "Courtier", color: "text-teal-400/80 border-teal-400/20" },
              { label: "Notaire", color: "text-indigo-400/80 border-indigo-400/20" },
              { label: "Architecte", color: "text-orange-400/80 border-orange-400/20" },
              { label: "Promoteur", color: "text-rose-400/80 border-rose-400/20" },
              { label: "Client", color: "text-sky-400/80 border-sky-400/20" },
            ].map((r) => (
              <span key={r.label} className={`text-xs px-4 py-2 rounded-full border ${r.color} transition-colors cursor-default`}>
                {r.label}
              </span>
            ))}
            <span className="text-xs px-4 py-2 rounded-full border border-white/15 text-white/70">
              et plus encore…
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
